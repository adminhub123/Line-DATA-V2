const { DashboardRecord, RegisterRecord } = require('../models/DashboardData');
const logger = require('../utils/logger');

exports.getDashboardData = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = {};
    if (startDate && endDate) {
      query.Created = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // ดึงข้อมูลการสร้างกลุ่ม
    const createGroupRecords = await DashboardRecord.find(query)
      .sort({ Created: -1 });

    // ดึงข้อมูลการสมัคร
    const registerRecords = await RegisterRecord.find(query)
      .sort({ Created: -1 });

    // คำนวณสถิติ
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayGroups = createGroupRecords.filter(r => 
      new Date(r.Created) >= todayStart
    ).length;

    const todayRegisters = registerRecords.filter(r => 
      new Date(r.Created) >= todayStart
    ).length;

    res.json({
      createGroupRecords,
      registerRecords,
      stats: {
        todayGroups,
        todayRegisters
      }
    });

  } catch (error) {
    logger.error('Get dashboard data error:', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
};