const AppointmentType = require('../models/AppointmentType');
const Booking = require('../models/Booking');
const Resource = require('../models/Resource');
const User = require('../models/User');
const { normalizeDateRange } = require('../utils/dateRangeUtils');

const buildReportScope = async (user, filters = {}) => {
  const { from, to } = normalizeDateRange(filters.from, filters.to);
  const bookingQuery = { bookingDate: { $gte: from, $lte: to } };
  const appointmentQuery = {};

  if (user.role === 'organiser') {
    const myApptIds = await AppointmentType.find({ createdBy: user._id }).distinct('_id');
    bookingQuery.appointment = { $in: myApptIds };
    appointmentQuery.createdBy = user._id;
  }

  if (filters.appointmentId) {
    bookingQuery.appointment = filters.appointmentId;
    appointmentQuery._id = filters.appointmentId;
  }
  if (filters.providerUserId) bookingQuery.providerUser = filters.providerUserId;
  if (filters.resourceId) bookingQuery.resource = filters.resourceId;

  return { bookingQuery, appointmentQuery, from, to };
};

const getSummaryStats = async (user, filters) => {
  const { bookingQuery, appointmentQuery } = await buildReportScope(user, filters);

  const [
    totalAppointments, publishedAppointments,
    totalBookings, confirmedBookings, pendingBookings, cancelledBookings, completedBookings,
    totalProviders, totalResources
  ] = await Promise.all([
    AppointmentType.countDocuments(appointmentQuery),
    AppointmentType.countDocuments({ ...appointmentQuery, 'publish.isPublished': true }),
    Booking.countDocuments(bookingQuery),
    Booking.countDocuments({ ...bookingQuery, status: 'confirmed' }),
    Booking.countDocuments({ ...bookingQuery, status: 'pending' }),
    Booking.countDocuments({ ...bookingQuery, status: 'cancelled' }),
    Booking.countDocuments({ ...bookingQuery, status: 'completed' }),
    user.role === 'admin' ? User.countDocuments({ role: 'organiser' }) : Promise.resolve(1),
    user.role === 'admin' ? Resource.countDocuments({}) : Resource.countDocuments({ createdBy: user._id })
  ]);

  return {
    totalAppointments,
    publishedAppointments,
    unpublishedAppointments: totalAppointments - publishedAppointments,
    totalBookings, confirmedBookings, pendingBookings, cancelledBookings, completedBookings,
    totalProviders, totalResources
  };
};

const getPeakHours = async (user, filters) => {
  const { bookingQuery } = await buildReportScope(user, filters);
  const nonCancelledQuery = { ...bookingQuery, status: { $ne: 'cancelled' } };
  if (bookingQuery.appointment) nonCancelledQuery.appointment = bookingQuery.appointment;

  const result = await Booking.aggregate([
    { $match: nonCancelledQuery },
    { $group: { _id: '$startTime', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  if (result.length === 0) return [];

  const maxCount = result[0].count;
  const thresholdHigh = maxCount * 0.66;
  const thresholdMed = maxCount * 0.33;

  return result.map(r => ({
    hour: r._id,
    count: r.count,
    intensity: r.count >= thresholdHigh ? 'high' : r.count >= thresholdMed ? 'medium' : 'low'
  })).sort((a, b) => a.hour.localeCompare(b.hour));
};

const getProviderUtilizationStats = async (user, filters) => {
  const { bookingQuery } = await buildReportScope(user, filters);

  const result = await Booking.aggregate([
    { $match: { ...bookingQuery, providerUser: { $exists: true, $ne: null } } },
    {
      $group: {
        _id: '$providerUser',
        totalBookings: { $sum: 1 },
        confirmedBookings: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } },
        cancelledBookings: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
        pendingBookings: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } }
      }
    },
    { $sort: { totalBookings: -1 } }
  ]);

  if (result.length === 0) return [];

  const providerIds = result.map(r => r._id);
  const providers = await User.find({ _id: { $in: providerIds } }).select('fullName email').lean();
  const providerMap = {};
  providers.forEach(p => { providerMap[p._id.toString()] = p; });

  const maxBookings = result[0].totalBookings;

  return result.map(r => ({
    providerId: r._id,
    providerName: providerMap[r._id.toString()]?.fullName || 'Unknown',
    providerEmail: providerMap[r._id.toString()]?.email || '',
    totalBookings: r.totalBookings,
    confirmedBookings: r.confirmedBookings,
    cancelledBookings: r.cancelledBookings,
    pendingBookings: r.pendingBookings,
    utilizationPercent: Math.round((r.totalBookings / maxBookings) * 100)
  }));
};

const getResourceUtilizationStats = async (user, filters) => {
  const { bookingQuery } = await buildReportScope(user, filters);

  const result = await Booking.aggregate([
    { $match: { ...bookingQuery, resource: { $exists: true, $ne: null } } },
    {
      $group: {
        _id: '$resource',
        totalBookings: { $sum: 1 },
        confirmedBookings: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } },
        cancelledBookings: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } }
      }
    },
    { $sort: { totalBookings: -1 } }
  ]);

  if (result.length === 0) return [];

  const resourceIds = result.map(r => r._id);
  const resources = await Resource.find({ _id: { $in: resourceIds } }).lean();
  const resourceMap = {};
  resources.forEach(r => { resourceMap[r._id.toString()] = r; });

  const maxBookings = result[0].totalBookings;

  return result.map(r => ({
    resourceId: r._id,
    resourceName: resourceMap[r._id.toString()]?.name || 'Unknown',
    resourceType: resourceMap[r._id.toString()]?.type || 'custom',
    totalBookings: r.totalBookings,
    confirmedBookings: r.confirmedBookings,
    cancelledBookings: r.cancelledBookings,
    utilizationPercent: Math.round((r.totalBookings / maxBookings) * 100)
  }));
};

const getBookingStatusDistribution = async (user, filters) => {
  const { bookingQuery } = await buildReportScope(user, filters);
  const result = await Booking.aggregate([
    { $match: bookingQuery },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  return result.map(r => ({ name: r._id, value: r.count }));
};

const getDailyBookingTrend = async (user, filters) => {
  const { bookingQuery } = await buildReportScope(user, filters);

  const result = await Booking.aggregate([
    { $match: bookingQuery },
    {
      $group: {
        _id: '$bookingDate',
        bookings: { $sum: 1 },
        confirmed: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } },
        pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
        cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return result.map(r => ({
    date: r._id,
    bookings: r.bookings,
    confirmed: r.confirmed,
    pending: r.pending,
    cancelled: r.cancelled
  }));
};

const getMostBookedAppointments = async (user, filters) => {
  const { bookingQuery } = await buildReportScope(user, filters);

  const result = await Booking.aggregate([
    { $match: bookingQuery },
    {
      $group: {
        _id: '$appointment',
        totalBookings: { $sum: 1 },
        confirmedBookings: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } },
        cancelledBookings: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } }
      }
    },
    { $sort: { totalBookings: -1 } },
    { $limit: 10 }
  ]);

  const apptIds = result.map(r => r._id);
  const appts = await AppointmentType.find({ _id: { $in: apptIds } }).select('basicInfo.title').lean();
  const apptMap = {};
  appts.forEach(a => { apptMap[a._id.toString()] = a.basicInfo?.title || 'Untitled'; });

  return result.map(r => {
    const conversionRate = r.totalBookings > 0 ? (r.confirmedBookings / r.totalBookings) * 100 : 0;
    return {
      appointmentId: r._id,
      title: apptMap[r._id.toString()] || 'Unknown',
      totalBookings: r.totalBookings,
      confirmedBookings: r.confirmedBookings,
      cancelledBookings: r.cancelledBookings,
      conversionLabel: conversionRate >= 70 ? 'High Demand' : conversionRate >= 40 ? 'Stable' : 'Low Demand'
    };
  });
};

module.exports = {
  buildReportScope, getSummaryStats, getPeakHours,
  getProviderUtilizationStats, getResourceUtilizationStats,
  getBookingStatusDistribution, getDailyBookingTrend, getMostBookedAppointments
};
