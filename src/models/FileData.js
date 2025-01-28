const mongoose = require('mongoose');

const fileDataSchema = new mongoose.Schema({
  Id: String,
  NameFile: String,
  UrlDownload: String,
  CountDownload: { type: Number, default: 0 },
  Created: { type: Date, default: Date.now },
  UpdatedBy: String
}, { timestamps: true });

module.exports = mongoose.model('FileData', fileDataSchema);