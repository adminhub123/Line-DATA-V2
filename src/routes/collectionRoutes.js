const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

router.get('/', async (req, res) => {
  try {
    // จำลองการดึงข้อมูล collections
    res.json({
      code: 200,
      message: "",
      data: [
        {
          id: "users",
          name: "users",
          type: "base",
        },
        {
          id: "messages",
          name: "messages", 
          type: "base",
        }
      ]
    });
  } catch (error) {
    logger.error('Get collections error:', error);
    res.status(500).json({
      code: 500,
      message: error.message,
      data: []
    });
  }
});

module.exports = router;