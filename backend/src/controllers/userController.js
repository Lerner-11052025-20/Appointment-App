const User = require('../models/User');
const AppointmentType = require('../models/AppointmentType');
const Booking = require('../models/Booking');
const Resource = require('../models/Resource');

exports.getProviders = async (req, res, next) => {
  try {
    const providers = await User.find({ role: { $in: ['organiser', 'admin'] } })
      .select('fullName email role isActive')
      .sort('fullName');

    res.status(200).json({ success: true, data: providers });
  } catch (error) {
    next(error);
  }
};

exports.getOrganiserStats = async (req, res, next) => {
  try {

    const myApptIds = await AppointmentType.find({ createdBy: req.user.id }).distinct('_id');

    const [activeServices, totalBookings, totalResources, pendingConfirm] = await Promise.all([
      AppointmentType.countDocuments({ createdBy: req.user.id, 'publish.isPublished': true }),
      Booking.countDocuments({ appointment: { $in: myApptIds } }),
      Resource.countDocuments({ createdBy: req.user.id }),
      Booking.countDocuments({ appointment: { $in: myApptIds }, status: 'pending' })
    ]);

    res.status(200).json({
      success: true,
      data: {
        activeServices,
        totalBookings,
        totalResources,
        pendingConfirm
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getAdminStats = async (req, res, next) => {
  try {
    const [totalUsers, totalProviders, totalAppointments] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: { $in: ['organiser', 'admin'] } }),
      AppointmentType.countDocuments({})
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProviders,
        totalAppointments
      }
    });
  } catch (error) {
    next(error);
  }
};

