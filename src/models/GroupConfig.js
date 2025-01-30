const mongoose = require('mongoose');

const groupConfigSchema = new mongoose.Schema({
    nameGroup: { type: String, required: true },
    linkGroup: Number,
    numberOfPeople: Number,
    chatUid: String,
    listKai: [String],
    status: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

module.exports = mongoose.model('CreateGroupConfig', groupConfigSchema);