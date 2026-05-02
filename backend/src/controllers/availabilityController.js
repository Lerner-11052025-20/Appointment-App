const AppointmentType = require('../models/AppointmentType');
const { getAvailabilityForAppointment } = require('../services/slotGenerationService');

exports.getAvailability = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const { date, providerUserId, resourceId } = req.query;

    if (!date) return res.status(400).json({ success: false, message: 'Date is required' });

    const appointment = await AppointmentType.findById(appointmentId);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    const slots = await getAvailabilityForAppointment(appointment, date, providerUserId, resourceId);
    res.json({ success: true, data: slots });
  } catch (error) {
    next(error);
  }
};