const reportService = require('../services/reportAggregationService');

exports.getReportOverview = async (req, res, next) => {
  try {
    const filters = { from: req.query.from, to: req.query.to, appointmentId: req.query.appointmentId, providerUserId: req.query.providerUserId, resourceId: req.query.resourceId };
    const [summary, peakBookingHours, providerUtilization, resourceUtilization, bookingStatusDistribution, dailyBookingTrend, mostBookedAppointments] = await Promise.all([
      reportService.getSummaryStats(req.user, filters),
      reportService.getPeakHours(req.user, filters),
      reportService.getProviderUtilizationStats(req.user, filters),
      reportService.getResourceUtilizationStats(req.user, filters),
      reportService.getBookingStatusDistribution(req.user, filters),
      reportService.getDailyBookingTrend(req.user, filters),
      reportService.getMostBookedAppointments(req.user, filters)
    ]);

    res.json({
      success: true,
      message: 'Reports overview fetched successfully',
      data: { summary, peakBookingHours, providerUtilization, resourceUtilization, bookingStatusDistribution, dailyBookingTrend, mostBookedAppointments }
    });
  } catch (error) {
    next(error);
  }
};

exports.getPeakBookingHours = async (req, res, next) => {
  try {
    const data = await reportService.getPeakHours(req.user, { from: req.query.from, to: req.query.to, appointmentId: req.query.appointmentId });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.getProviderUtilization = async (req, res, next) => {
  try {
    const data = await reportService.getProviderUtilizationStats(req.user, { from: req.query.from, to: req.query.to, appointmentId: req.query.appointmentId });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.getResourceUtilization = async (req, res, next) => {
  try {
    const data = await reportService.getResourceUtilizationStats(req.user, { from: req.query.from, to: req.query.to, appointmentId: req.query.appointmentId });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.getBookingTrends = async (req, res, next) => {
  try {
    const data = await reportService.getDailyBookingTrend(req.user, { from: req.query.from, to: req.query.to });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.getAppointmentPerformance = async (req, res, next) => {
  try {
    const data = await reportService.getMostBookedAppointments(req.user, { from: req.query.from, to: req.query.to });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
