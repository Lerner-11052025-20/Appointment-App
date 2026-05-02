const User = require('../models/User');
const Booking = require('../models/Booking');

exports.getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Profile fetched successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

exports.updateMyProfile = async (req, res, next) => {
  try {
    const { fullName, profile } = req.body;

    if (fullName === '') {
      return res.status(400).json({ success: false, message: 'Full name cannot be empty' });
    }

    const updates = {};
    if (fullName) updates.fullName = fullName;

    if (profile) {

      const user = await User.findById(req.user.id);
      const currentProfile = user.profile || {};

      updates.profile = {
        ...currentProfile,
        phone: profile.phone !== undefined ? profile.phone : currentProfile.phone,
        avatarUrl: profile.avatarUrl !== undefined ? profile.avatarUrl : currentProfile.avatarUrl,
        timezone: profile.timezone !== undefined ? profile.timezone : currentProfile.timezone,
        preferences: {
          ...(currentProfile.preferences || {}),
          ...(profile.preferences || {})
        }
      };
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyProfileAppointments = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ customer: req.user.id })
      .populate('appointment', 'basicInfo')
      .populate('providerUser', 'fullName email')
      .populate('resource', 'name type location')
      .sort({ bookingDate: 1, startTime: 1 });

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentTimeStr = now.toTimeString().split(' ')[0].substring(0, 5);

    const upcoming = [];
    const past = [];
    const cancelled = [];

    bookings.forEach(b => {
      if (b.status === 'cancelled') {
        cancelled.push(b);
      } else {
        const isFuture = b.bookingDate > todayStr || (b.bookingDate === todayStr && b.startTime >= currentTimeStr);
        if (isFuture && ['pending', 'confirmed', 'rescheduled'].includes(b.status)) {
          upcoming.push(b);
        } else {
          past.push(b);
        }
      }
    });

    past.sort((a, b) => (b.bookingDate + b.startTime).localeCompare(a.bookingDate + a.startTime));
    cancelled.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    res.status(200).json({
      success: true,
      data: {
        upcoming,
        past,
        cancelled,
        stats: {
          total: bookings.length,
          upcoming: upcoming.length,
          past: past.length,
          cancelled: cancelled.length
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyProfileAppointmentDetails = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      customer: req.user.id
    })
    .populate('appointment')
    .populate('providerUser', 'fullName email')
    .populate('resource', 'name type location code');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Booking details fetched successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};