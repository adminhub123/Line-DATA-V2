// models/Group.js
const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    nameGroup: { type: String, required: true },
    linkGroup: { type: Number },
    numberOfPeople: { type: Number },
    chatUid: { type: String },
    listKai: [{ type: String }], // Array ของ line ไก่
    status: { type: String },
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

module.exports = mongoose.model('Group', groupSchema);