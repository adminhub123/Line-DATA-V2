const mongoose = require('mongoose');

const fileDataSchema = new mongoose.Schema({
  nameFile: {
    type: String,
    required: true
  },
  urlDownload: {
    type: String,
    required: true  
  },
  countDownload: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true // เพิ่ม created, updated timestamps อัตโนมัติ
});

module.exports = mongoose.model('FileData', fileDataSchema);