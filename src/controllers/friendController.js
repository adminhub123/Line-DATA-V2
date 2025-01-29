//src/controllers/friendController.js
const FriendHistory = require('../models/FriendHistory');
const logger = require('../utils/logger'); 

exports.recordFriendAction = async (req, res) => {
  try {
    const {
      mid,
      friendCount,
      friendCountAfterAction,
      totalActions
    } = req.body;

    const friendDifference = friendCountAfterAction - friendCount;

    const friendRecord = new FriendHistory({
      mid,
      friendCount,
      friendCountAfterAction,
      friendDifference,
      totalActions,
      actionDate: new Date()
    });

    await friendRecord.save();
    logger.info(`Friend action recorded for user: ${mid}`);
    res.status(201).json(friendRecord);
  } catch (error) {
    logger.error('Record friend action error', {
      error: error.message,
      data: req.body
    });
    res.status(500).json({ message: error.message });
  }
};

exports.getFriendHistory = async (req, res) => {
  try {
    const { mid } = req.params;
    const history = await FriendHistory.find({ mid })
                                     .sort({ actionDate: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};