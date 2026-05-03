const User = require('../models/User');
const AppointmentType = require('../models/AppointmentType');
const Booking = require('../models/Booking');
const Resource = require('../models/Resource');

exports.getAdminDashboard = async (req, res, next) => {
  try {
    const [
      totalUsers, totalCustomers, totalOrganisers, totalAdmins,
      activeUsers, inactiveUsers,
      totalAppointments, publishedAppointments, unpublishedAppointments,
      totalBookings, confirmedBookings, pendingBookings, cancelledBookings, completedBookings,
      totalResources,
      recentUsers, recentBookings
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'organiser' }),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: false }),
      AppointmentType.countDocuments({}),
      AppointmentType.countDocuments({ 'publish.isPublished': true }),
      AppointmentType.countDocuments({ 'publish.isPublished': { $ne: true } }),
      Booking.countDocuments({}),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'cancelled' }),
      Booking.countDocuments({ status: 'completed' }),
      Resource.countDocuments({}),
      User.find({}).select('-password').sort({ createdAt: -1 }).limit(5).lean(),
      Booking.find({}).populate('customer', 'fullName email').populate('appointment', 'basicInfo.title').sort({ createdAt: -1 }).limit(5).lean()
    ]);

    res.json({
      success: true,
      message: 'Admin dashboard fetched successfully',
      data: {
        stats: {
          totalUsers, totalCustomers, totalOrganisers, totalAdmins,
          activeUsers, inactiveUsers,
          totalAppointments, publishedAppointments, unpublishedAppointments,
          totalBookings, confirmedBookings, pendingBookings, cancelledBookings, completedBookings,
          totalResources
        },
        recentUsers,
        recentBookings,
        roleDistribution: [
          { name: 'Customers', value: totalCustomers },
          { name: 'Organisers', value: totalOrganisers },
          { name: 'Admins', value: totalAdmins }
        ],
        bookingStatusDistribution: [
          { name: 'Confirmed', value: confirmedBookings },
          { name: 'Pending', value: pendingBookings },
          { name: 'Cancelled', value: cancelledBookings },
          { name: 'Completed', value: completedBookings }
        ]
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const { search, role, status, page = 1, limit = 20, sort = '-createdAt' } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role && role !== 'all') query.role = role;
    if (status === 'active') query.isActive = true;
    if (status === 'inactive') query.isActive = false;

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(query).select('-password').sort(sort).skip(skip).limit(Number(limit)).lean(),
      User.countDocuments(query)
    ]);

    res.json({
      success: true,
      message: 'Users fetched successfully',
      data: {
        users,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password').lean();
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    let activitySummary = {};
    if (user.role === 'customer') {
      activitySummary.bookingCount = await Booking.countDocuments({ customer: user._id });
      activitySummary.recentBookings = await Booking.find({ customer: user._id })
        .populate('appointment', 'basicInfo.title')
        .sort({ createdAt: -1 }).limit(5).lean();
    }
    if (user.role === 'organiser') {
      activitySummary.appointmentTypesCount = await AppointmentType.countDocuments({ createdBy: user._id });
      activitySummary.resourcesCount = await Resource.countDocuments({ createdBy: user._id });
      activitySummary.publishedCount = await AppointmentType.countDocuments({ createdBy: user._id, 'publish.isPublished': true });
    }

    res.json({ success: true, data: { ...user, activitySummary } });
  } catch (error) {
    next(error);
  }
};

exports.updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    if (req.params.id === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot deactivate your own account.' });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    user.isActive = isActive;
    await user.save();

    res.json({ success: true, message: `Account ${isActive ? 'activated' : 'deactivated'} successfully.`, data: user });
  } catch (error) {
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const validRoles = ['customer', 'organiser', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role.' });
    }

    if (req.params.id === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot change your own role.' });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    user.role = role;
    await user.save();

    res.json({ success: true, message: `Role updated to '${role}' successfully.`, data: user });
  } catch (error) {
    next(error);
  }
};

exports.getProviders = async (req, res, next) => {
  try {
    const providers = await User.find({ role: 'organiser' }).select('-password').lean();

    const enriched = await Promise.all(providers.map(async (p) => {
      const [appointmentTypesCount, publishedAppointmentsCount, totalBookingsCount] = await Promise.all([
        AppointmentType.countDocuments({ createdBy: p._id }),
        AppointmentType.countDocuments({ createdBy: p._id, 'publish.isPublished': true }),
        Booking.countDocuments({ organiser: p._id })
      ]);
      return { ...p, appointmentTypesCount, publishedAppointmentsCount, totalBookingsCount };
    }));

    res.json({ success: true, message: 'Providers fetched successfully', data: enriched });
  } catch (error) {
    next(error);
  }
};

exports.getPlatformActivity = async (req, res, next) => {
  try {
    const [recentUsers, recentAppointments, recentBookings] = await Promise.all([
      User.find({}).select('-password').sort({ createdAt: -1 }).limit(10).lean(),
      AppointmentType.find({}).populate('createdBy', 'fullName').sort({ createdAt: -1 }).limit(10).lean(),
      Booking.find({}).populate('customer', 'fullName email').populate('appointment', 'basicInfo.title').sort({ createdAt: -1 }).limit(10).lean()
    ]);

    res.json({
      success: true,
      message: 'Platform activity fetched successfully',
      data: { recentUsers, recentAppointments, recentBookings }
    });
  } catch (error) {
    next(error);
  }
};
