const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  username: String,
  created: {
    type: Date,
    default: Date.now
  },
  actionType: {
    type: String,
    enum: ['สร้างกลุ่ม', 'สมัครไลน์']
  },
  nameGroup: String,
  numberOfPeople: Number,
  phone: String,
  displayName: String,
  status: String
}, {
  timestamps: true
});

const History = mongoose.model('History', historySchema);

module.exports = {
  History
};