//src/models/RegisterHistory.js
const mongoose = require('mongoose');

const registerHistorySchema = new mongoose.Schema({
  mid: { type: String, required: true },
  team: { type: String },
  phone: { type: String },
  displayName: { type: String },
  status: { type: String },
  countFriend: { type: Number, default: 0 },
  userId: { type: String },
  accessToken: { type: String },
  refreshToken: { type: String },
  registerDate: { type: Date, default: Date.now },
  authToken: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('RegisterHistory', registerHistorySchema);