const RegisterHistory = require('../models/RegisterHistory');
const logger = require('../utils/logger');

exports.recordRegister = async (req, res) => {
  try {
    const {
      mid,
      team,
      phone,
      displayName,
      status,
      countFriend,
      userId,
      accessToken,
      refreshToken,
      authToken
    } = req.body;

    const registerRecord = new RegisterHistory({
      mid,
      team,
      phone,
      displayName,
      status,
      countFriend,
      userId,
      accessToken,
      refreshToken,
      authToken,
      registerDate: new Date()
    });

    await registerRecord.save();
    logger.info(`New registration recorded: ${mid}`, {
      team,
      status,
      displayName
    });
    res.status(201).json(registerRecord);
  } catch (error) {
    logger.error('Record registration error', {
      error: error.message,
      data: { ...req.body, accessToken: '***', refreshToken: '***', authToken: '***' }
    });
    res.status(500).json({ message: error.message });
  }
};

exports.getRegisterHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await RegisterHistory.find({ userId })
                                       .sort({ registerDate: -1 });
    logger.info(`Register history retrieved for user: ${userId}`);
    res.json(history);
  } catch (error) {
    logger.error('Get register history error', {
      error: error.message,
      userId: req.params.userId
    });
    res.status(500).json({ message: error.message });
  }
};