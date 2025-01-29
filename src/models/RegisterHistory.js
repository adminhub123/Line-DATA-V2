//src/models/RegisterHistory.js
const mongoose = require('mongoose');

const registerHistorySchema = new mongoose.Schema({
    mid: { type: String, required: true },
    displayName: { type: String },
    deviceId: { type: String },
    authKey: { type: String },
    phoneNumber: { type: String },
    fileNumber: { type: String },
    accessToken: { type: String },
    refreshToken: { type: String },
    registerDate: { type: Date, default: Date.now }
}, {
    timestamps: true
});

module.exports = mongoose.model('RegisterHistory', registerHistorySchema);