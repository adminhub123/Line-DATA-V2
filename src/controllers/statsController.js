const SendHistory = require('../models/SendHistory');
const FriendHistory = require('../models/FriendHistory');
const RegisterHistory = require('../models/RegisterHistory');
const logger = require('../utils/logger');

exports.getDailyStats = async (req, res) => {
  try {
    const { date } = req.query;
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    logger.info(`Retrieving daily stats for: ${date}`);

    // รวมสถิติการส่งข้อความ
    const sendStats = await SendHistory.aggregate([
      {
        $match: {
          sendDate: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          totalMessages: { $sum: 1 },
          totalFriendCount: { $sum: "$friendCount" },
          successCount: {
            $sum: { $cond: [{ $eq: ["$sendStatus", "success"] }, 1, 0] }
          },
          failedCount: {
            $sum: { $cond: [{ $eq: ["$sendStatus", "failed"] }, 1, 0] }
          }
        }
      }
    ]);

    // รวมสถิติการเพิ่มเพื่อน
    const friendStats = await FriendHistory.aggregate([
      {
        $match: {
          actionDate: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          totalActions: { $sum: 1 },
          totalFriendsAdded: { $sum: "$friendDifference" },
          averageFriendsPerAction: { $avg: "$friendDifference" }
        }
      }
    ]);

    // รวมสถิติการลงทะเบียน
    const registerStats = await RegisterHistory.aggregate([
      {
        $match: {
          registerDate: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          totalRegistrations: { $sum: 1 },
          activeUsers: {
            $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] }
          }
        }
      }
    ]);

    res.json({
      date: date,
      messagingStats: sendStats[0] || {
        totalMessages: 0,
        totalFriendCount: 0,
        successCount: 0,
        failedCount: 0
      },
      friendStats: friendStats[0] || {
        totalActions: 0,
        totalFriendsAdded: 0,
        averageFriendsPerAction: 0
      },
      registrationStats: registerStats[0] || {
        totalRegistrations: 0,
        activeUsers: 0
      }
    });
  } catch (error) {
    logger.error('Get daily stats error', {
      error: error.message,
      date: req.query.date
    });
    res.status(500).json({ message: error.message });
  }
};

exports.getDateRangeStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    logger.info(`Retrieving stats for date range: ${startDate} to ${endDate}`);

    const dailyStats = await SendHistory.aggregate([
      {
        $match: {
          sendDate: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$sendDate" }
          },
          messageCount: { $sum: 1 },
          successCount: {
            $sum: { $cond: [{ $eq: ["$sendStatus", "success"] }, 1, 0] }
          },
          totalFriendCount: { $sum: "$friendCount" }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    res.json(dailyStats);
  } catch (error) {
    logger.error('Get date range stats error', {
      error: error.message,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    });
    res.status(500).json({ message: error.message });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;
    logger.info(`Retrieving user stats for: ${userId}`);

    // สถิติการส่งข้อความ
    const messageStats = await SendHistory.aggregate([
      {
        $match: { mid: userId }
      },
      {
        $group: {
          _id: null,
          totalMessages: { $sum: 1 },
          successfulMessages: {
            $sum: { $cond: [{ $eq: ["$sendStatus", "success"] }, 1, 0] }
          },
          failedMessages: {
            $sum: { $cond: [{ $eq: ["$sendStatus", "failed"] }, 1, 0] }
          },
          averageFriendCount: { $avg: "$friendCount" },
          totalFriendCount: { $sum: "$friendCount" }
        }
      }
    ]);

    // สถิติการเพิ่มเพื่อน
    const friendStats = await FriendHistory.aggregate([
      {
        $match: { mid: userId }
      },
      {
        $group: {
          _id: null,
          totalActions: { $sum: 1 },
          totalFriendsAdded: { $sum: "$friendDifference" },
          averageFriendsPerAction: { $avg: "$friendDifference" },
          maxFriendsInOneAction: { $max: "$friendDifference" },
          minFriendsInOneAction: { $min: "$friendDifference" }
        }
      }
    ]);

    // สถิติการลงทะเบียน
    const registerStats = await RegisterHistory.findOne(
      { userId: userId },
      {
        registerDate: 1,
        status: 1,
        team: 1,
        displayName: 1,
        countFriend: 1
      }
    );

    res.json({
      userId,
      messageStats: messageStats[0] || {
        totalMessages: 0,
        successfulMessages: 0,
        failedMessages: 0,
        averageFriendCount: 0,
        totalFriendCount: 0
      },
      friendStats: friendStats[0] || {
        totalActions: 0,
        totalFriendsAdded: 0,
        averageFriendsPerAction: 0,
        maxFriendsInOneAction: 0,
        minFriendsInOneAction: 0
      },
      registerInfo: registerStats || null
    });
  } catch (error) {
    logger.error('Get user stats error', {
      error: error.message,
      userId: req.params.userId
    });
    res.status(500).json({ message: error.message });
  }
};