const mongoose = require('mongoose');

const slotInventorySchema = new mongoose.Schema({
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'AppointmentType', required: true },
  providerUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resource: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource' },

  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },

  capacity: { type: Number, default: 1 },
  bookedCount: { type: Number, default: 0 },

  status: {
    type: String,
    enum: ['available', 'full', 'blocked'],
    default: 'available'
  },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

slotInventorySchema.index({ appointment: 1, providerUser: 1, resource: 1, date: 1, startTime: 1 }, { unique: true });

module.exports = mongoose.model('SlotInventory', slotInventorySchema);