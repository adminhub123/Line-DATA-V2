// models/Collection.js
const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  type: { // Flex, Register, AddFriend, DataFile, Group
    type: String,
    required: true
  },
  status: Boolean,
  name: String,
  data: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

module.exports = mongoose.model('Collection', collectionSchema);