//src/models/FriendHistory.js
const mongoose = require('mongoose');

const friendHistorySchema = new mongoose.Schema({
  mid: { type: String, required: true },
  friendCount: { type: Number, default: 0 },
  friendCountAfterAction: { type: Number },
  friendDifference: { type: Number },
  actionDate: { type: Date, default: Date.now },
  totalActions: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('FriendHistory', friendHistorySchema);