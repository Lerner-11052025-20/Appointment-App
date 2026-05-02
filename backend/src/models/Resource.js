const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Resource name is required'], trim: true },
    code: { type: String, trim: true },
    type: {
      type: String,
      enum: ['room', 'equipment', 'court', 'desk', 'doctor_chair', 'custom'],
      default: 'custom',
    },
    description: { type: String },
    location: { type: String },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', resourceSchema);