const { History } = require('../models/Dashboard');
const User = require('../models/User');
const logger = require('../utils/logger');

exports.getDashboardSummary = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const userId = req.userId; // จาก auth middleware

    // นับจำนวนทั้งหมด
    const totalCreatedGroups = await History.countDocuments({
      actionType: 'สร้างกลุ่ม',
      created: { $gte: today, $lt: tomorrow }
    });

    const totalProgramGroups = await History.countDocuments({
      actionType: 'สร้างกลุ่ม',
      created: { $gte: today, $lt: tomorrow }
    });

    const totalRegistrations = await History.countDocuments({
      actionType: 'สมัครไลน์',
      created: { $gte: today, $lt: tomorrow }
    });

    // นับเฉพาะของ user นี้
    const yourCreatedGroups = await History.countDocuments({
      actionType: 'สร้างกลุ่ม',
      created: { $gte: today, $lt: tomorrow },
      username: req.userId
    });

    res.json({
      totalCreatedGroups,
      totalProgramGroups,
      totalRegistrations,
      yourCreatedGroups
    });

  } catch (error) {
    logger.error('Get dashboard summary error:', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ message: 'Error fetching dashboard summary' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};

    // ถ้ามีการระบุช่วงวันที่
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      query.created = {
        $gte: start,
        $lte: end
      };
    }

    const records = await History.find(query)
      .sort({ created: -1 })
      .select('username created actionType status');

    res.json({ records });

  } catch (error) {
    logger.error('Get history error:', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ message: 'Error fetching history' });
  }
};

// API สำหรับบันทึกประวัติ
exports.createHistory = async (req, res) => {
  try {
    const {
      username,
      actionType,
      nameGroup,
      numberOfPeople,
      phone,
      displayName,
      status
    } = req.body;

    const history = new History({
      username,
      actionType,
      nameGroup,
      numberOfPeople,
      phone,
      displayName,
      status
    });

    await history.save();

    logger.info('History created:', {
      username,
      actionType,
      status
    });

    res.status(201).json(history);

  } catch (error) {
    logger.error('Create history error:', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ message: 'Error creating history' });
  }
};