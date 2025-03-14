// src/models/MessageSync.js
const mongoose = require('mongoose');

const messageItemSchema = new mongoose.Schema({
  Title: String,
  Content: String,
  ImagePath: String,
  Created: Date,
  Updated: Date,
  Enabled: Boolean
}, { _id: false });

const messageSyncSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,  // เพิ่ม unique เพื่อให้แต่ละ username มีได้แค่ 1 เรคอร์ด
    index: true
  },
  team: {
    type: String,
    index: true
  },
  lastSyncTime: {
    type: Date,
    default: Date.now
  },
  messages: [messageItemSchema],
  messageCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MessageSync', messageSyncSchema);