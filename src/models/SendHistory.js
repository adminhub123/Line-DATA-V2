//src/models/SendHistory.js
const mongoose = require('mongoose');

const sendHistorySchema = new mongoose.Schema({
  mid: { type: String, required: true },
  flex: { type: String },
  displayName: { type: String },
  friendCount: { type: Number, default: 0 },
  totalSent: { type: Number, default: 0 },
  sendStatus: { type: String },
  sendDate: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('SendHistory', sendHistorySchema);