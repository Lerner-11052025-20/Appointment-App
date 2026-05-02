const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'AppointmentType', required: true },
  organiser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  providerUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resource: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource' },

  bookingDate: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },

  selectedCapacity: { type: Number, default: 1 },

  answers: [{
    questionId: String,
    label: String,
    type: { type: String },
    answer: mongoose.Schema.Types.Mixed
  }],

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'rescheduled', 'completed'],
    default: 'confirmed'
  },

  payment: {
    required: { type: Boolean, default: false },
    amount: { type: Number },
    status: { type: String, enum: ['not_required', 'pending', 'paid', 'failed'], default: 'not_required' },
    mockTransactionId: String
  },

  confirmation: {
    message: String,
    confirmedAt: Date
  },

  cancel: {
    cancelledAt: Date,
    reason: String
  },

  rescheduleHistory: [{
    oldDate: String,
    oldStartTime: String,
    oldEndTime: String,
    newDate: String,
    newStartTime: String,
    newEndTime: String,
    changedAt: Date
  }]
}, { timestamps: true });

bookingSchema.index({ customer: 1 });
bookingSchema.index({ appointment: 1 });
bookingSchema.index({ bookingDate: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ appointment: 1, providerUser: 1, resource: 1, bookingDate: 1, startTime: 1 });

module.exports = mongoose.model('Booking', bookingSchema);