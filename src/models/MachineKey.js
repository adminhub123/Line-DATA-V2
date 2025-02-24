// src/models/MachineKey.js
const mongoose = require('mongoose');

const machineKeySchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: true
  },
  machineKey: {
    type: String,
    required: true,
    unique: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUsed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MachineKey', machineKeySchema);