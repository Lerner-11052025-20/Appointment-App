const AppointmentType = require('../models/AppointmentType');
const generateShareToken = require('../utils/generateShareToken');

exports.createAppointment = async (req, res, next) => {
  try {
    const data = { ...req.body, createdBy: req.user._id, updatedBy: req.user._id };
    const appt = await AppointmentType.create(data);
    res.status(201).json({ success: true, message: 'Appointment created successfully.', data: appt });
  } catch (err) { next(err); }
};

exports.getAppointments = async (req, res, next) => {
  try {
    const Booking = require('../models/Booking');
    const { search, status, page = 1, limit = 20 } = req.query;
    const filter = req.user.role === 'admin' ? {} : { createdBy: req.user._id };

    if (search) filter.$text = { $search: search };
    if (status === 'published') filter['publish.isPublished'] = true;
    else if (status === 'unpublished') filter['publish.isPublished'] = false;

    const skip = (Number(page) - 1) * Number(limit);
    const [appointments, total] = await Promise.all([
      AppointmentType.find(filter)
        .populate('assignedUsers', 'fullName email')
        .populate('assignedResources', 'name code type')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit)),
      AppointmentType.countDocuments(filter),
    ]);

    const today = new Date().toISOString().split('T')[0];
    const appointmentIds = appointments.map(a => a._id);
    const meetingCounts = await Booking.aggregate([
      {
        $match: {
          appointment: { $in: appointmentIds },
          status: { $in: ['confirmed', 'pending'] },
          bookingDate: { $gte: today }
        }
      },
      { $group: { _id: '$appointment', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    meetingCounts.forEach(mc => { countMap[mc._id.toString()] = mc.count; });

    const enriched = appointments.map(a => {
      const obj = a.toObject();
      obj.upcomingMeetingsCount = countMap[a._id.toString()] || 0;
      return obj;
    });

    res.json({ success: true, data: enriched, meta: { total, page: Number(page), limit: Number(limit) } });
  } catch (err) { next(err); }
};

exports.getAppointmentById = async (req, res, next) => {
  try {
    const appt = await AppointmentType.findById(req.params.id)
      .populate('assignedUsers', 'fullName email')
      .populate('assignedResources', 'name code type');
    if (!appt) return res.status(404).json({ success: false, message: 'Appointment not found.' });
    res.json({ success: true, data: appt });
  } catch (err) { next(err); }
};

exports.updateAppointment = async (req, res, next) => {
  try {
    const appt = await AppointmentType.findById(req.params.id);
    if (!appt) return res.status(404).json({ success: false, message: 'Appointment not found.' });
    if (req.user.role !== 'admin' && appt.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized to update this appointment.' });

    const updated = await AppointmentType.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.user._id },
      { new: true, runValidators: true }
    ).populate('assignedUsers', 'fullName email').populate('assignedResources', 'name code type');

    res.json({ success: true, message: 'Appointment updated.', data: updated });
  } catch (err) { next(err); }
};

exports.deleteAppointment = async (req, res, next) => {
  try {
    const appt = await AppointmentType.findById(req.params.id);
    if (!appt) return res.status(404).json({ success: false, message: 'Appointment not found.' });
    if (req.user.role !== 'admin' && appt.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    await appt.deleteOne();
    res.json({ success: true, message: 'Appointment deleted.' });
  } catch (err) { next(err); }
};

exports.publishAppointment = async (req, res, next) => {
  try {
    const appt = await AppointmentType.findById(req.params.id);
    if (!appt) return res.status(404).json({ success: false, message: 'Appointment not found.' });
    appt.publish.isPublished = true;
    appt.publish.publishedAt = new Date();
    if (!appt.publish.shareToken) appt.publish.shareToken = generateShareToken();
    appt.updatedBy = req.user._id;
    await appt.save();
    res.json({ success: true, message: 'Appointment published.', data: appt });
  } catch (err) { next(err); }
};

exports.unpublishAppointment = async (req, res, next) => {
  try {
    const appt = await AppointmentType.findById(req.params.id);
    if (!appt) return res.status(404).json({ success: false, message: 'Appointment not found.' });
    appt.publish.isPublished = false;
    appt.updatedBy = req.user._id;
    await appt.save();
    res.json({ success: true, message: 'Appointment unpublished.', data: appt });
  } catch (err) { next(err); }
};

exports.generateShareLink = async (req, res, next) => {
  try {
    const appt = await AppointmentType.findById(req.params.id);
    if (!appt) return res.status(404).json({ success: false, message: 'Appointment not found.' });
    if (!appt.publish.shareToken) {
      appt.publish.shareToken = generateShareToken();
      await appt.save();
    }
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const shareUrl = `${clientUrl}/book/private/${appt.publish.shareToken}`;
    res.json({ success: true, data: { shareUrl, shareToken: appt.publish.shareToken } });
  } catch (err) { next(err); }
};

exports.getAppointmentMeetings = async (req, res, next) => {
  try {
    const Booking = require('../models/Booking');
    const bookings = await Booking.find({ appointment: req.params.id })
      .populate('customer', 'fullName email')
      .sort('bookingDate startTime');

    const data = bookings.map(b => {
      let customerName = 'Unknown';
      if (b.customer) {
        customerName = b.customer.fullName;
      }

      return {
        _id: b._id,
        customerName,
        date: new Date(b.bookingDate).toLocaleDateString(),
        time: `${b.startTime} - ${b.endTime}`,
        status: b.status,
        capacity: b.selectedCapacity || 1
      };
    });

    res.json({ success: true, data, meta: { total: data.length } });
  } catch (err) { next(err); }
};

exports.getAppointmentByShareToken = async (req, res, next) => {
  try {
    const appt = await AppointmentType.findOne({ 'publish.shareToken': req.params.shareToken })
      .populate('assignedUsers', 'fullName')
      .populate('assignedResources', 'name code type');
    if (!appt) return res.status(404).json({ success: false, message: 'Appointment not found.' });
    res.json({ success: true, data: appt });
  } catch (err) { next(err); }
};

exports.getPublishedAppointments = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const filter = { 'publish.isPublished': true };

    if (search) filter.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);
    const [appointments, total] = await Promise.all([
      AppointmentType.find(filter)
        .populate('assignedUsers', 'fullName email')
        .populate('assignedResources', 'name code type')
        .sort('-publish.publishedAt')
        .skip(skip)
        .limit(Number(limit)),
      AppointmentType.countDocuments(filter),
    ]);

    res.json({ success: true, data: appointments, meta: { total, page: Number(page), limit: Number(limit) } });
  } catch (err) { next(err); }
};

exports.getPublishedAppointmentById = async (req, res, next) => {
  try {
    const appt = await AppointmentType.findOne({ _id: req.params.id, 'publish.isPublished': true })
      .populate('assignedUsers', 'fullName email')
      .populate('assignedResources', 'name code type');
    if (!appt) return res.status(404).json({ success: false, message: 'Published appointment not found.' });
    res.json({ success: true, data: appt });
  } catch (err) { next(err); }
};