const mongoose = require('mongoose');

const resignationSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lwd: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedLwd: {
    type: Date
  },
  reason: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Resignation', resignationSchema);