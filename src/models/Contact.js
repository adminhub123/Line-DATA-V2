const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  targetUserMid: { type: String, required: true },
  userType: { type: Number, required: true },
  profileName: { type: String },
  statusMessage: { type: String },
  contactType: { type: Number, required: true }
}, {
  timestamps: true
});

// สร้าง compound index สำหรับค้นหา
contactSchema.index({ userId: 1, targetUserMid: 1 }, { unique: true });

module.exports = mongoose.model('Contact', contactSchema);