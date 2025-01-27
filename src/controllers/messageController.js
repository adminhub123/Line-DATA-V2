const SendHistory = require('../models/SendHistory');
const logger = require('../utils/logger'); // เพิ่มบรรทัดนี้

exports.recordSend = async (req, res) => {
  try {
    const { mid, flex, displayName, friendCount, totalSent, sendStatus } = req.body;
    
    const sendRecord = new SendHistory({
      mid,
      flex,
      displayName,
      friendCount,
      totalSent,
      sendStatus,
      sendDate: new Date()
    });

    await sendRecord.save();
    logger.info(`Message recorded for user: ${mid}`);
    res.status(201).json(sendRecord);
  } catch (error) {
    logger.error('Record send error', {
      error: error.message,
      data: req.body
    });
    res.status(500).json({ message: error.message });
  }
};

exports.getSendHistory = async (req, res) => {
  try {
    const { mid } = req.params;
    const history = await SendHistory.find({ mid })
                                   .sort({ sendDate: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};