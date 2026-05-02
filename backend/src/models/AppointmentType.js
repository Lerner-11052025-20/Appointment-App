const mongoose = require('mongoose');

const weeklySlotSchema = new mongoose.Schema(
  { day: String, from: String, to: String, isActive: { type: Boolean, default: true } },
  { _id: false }
);

const flexDateSchema = new mongoose.Schema(
  { date: String, from: String, to: String, isActive: { type: Boolean, default: true } },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    type: {
      type: String,
      enum: ['text', 'textarea', 'select', 'checkbox', 'radio', 'yes_no', 'number', 'date'],
      default: 'text',
    },
    options: [String],
    required: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const appointmentTypeSchema = new mongoose.Schema(
  {
    basicInfo: {
      title: { type: String, required: [true, 'Title is required'], trim: true },
      description: { type: String, default: '' },
      duration: { type: Number, required: true, default: 30 },
      durationUnit: { type: String, enum: ['minutes', 'hours'], default: 'minutes' },
      location: { type: String, default: '' },
      isOnline: { type: Boolean, default: false },
      imageUrl: { type: String, default: '' },
    },
    bookingType: {
      type: { type: String, enum: ['user', 'resource'], default: 'user' },
    },
    assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    assignedResources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
    assignmentMode: { type: String, enum: ['automatic', 'by_visitor'], default: 'automatic' },
    capacity: {
      manageCapacity: { type: Boolean, default: false },
      maxSimultaneous: { type: Number, default: 1 },
      capacityPerSlot: { type: Number, default: 1 },
    },
    schedule: {
      scheduleType: { type: String, enum: ['weekly', 'flexible'], default: 'weekly' },
      weekly: [weeklySlotSchema],
      flexibleDates: [flexDateSchema],
    },
    questions: [questionSchema],
    options: {
      manualConfirmation: { type: Boolean, default: false },
      advancePayment: { type: Boolean, default: false },
      paymentAmount: { type: Number, default: 0 },
      allowCancellation: { type: Boolean, default: true },
      allowReschedule: { type: Boolean, default: true },
      cancellationWindowHours: { type: Number, default: 24 },
      rescheduleWindowHours: { type: Number, default: 24 },
    },
    misc: {
      internalNotes: { type: String, default: '' },
      confirmationMessage: { type: String, default: '' },
      venueInstructions: { type: String, default: '' },
      additionalTerms: { type: String, default: '' },
    },
    publish: {
      isPublished: { type: Boolean, default: false },
      publishedAt: { type: Date },
      shareToken: { type: String },
      allowPrivateShare: { type: Boolean, default: true },
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    upcomingMeetingsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

appointmentTypeSchema.index({ 'basicInfo.title': 'text' });
appointmentTypeSchema.index({ createdBy: 1 });
appointmentTypeSchema.index({ 'publish.shareToken': 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('AppointmentType', appointmentTypeSchema);