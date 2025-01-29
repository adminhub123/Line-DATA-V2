//src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    default: 'user'
  },
  team: {
    type: String,
    required: true,
    default: 'user'
  },
  isWebAdmin: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  expiration: {  // เพิ่มฟิลด์นี้
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// ไม่ต้องแก้ไขส่วนนี้
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);