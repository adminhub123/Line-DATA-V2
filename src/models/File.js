// models/File.js
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  username: String,
  fileName: String,
  countPhone: Number,
  filePath: String,
  countDownload: { type: Number, default: 0 },
  urlDownload: String
}, {
  timestamps: true
});

module.exports = mongoose.model('File', fileSchema);