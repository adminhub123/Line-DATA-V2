const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

router.post('/auth-with-password', async (req, res) => {
  try {
    // จำลองการทำงานเหมือน PocketBase
    res.json({
      code: 200,
      message: "",
      data: {
        token: "dummy_token", // ส่งค่าเพื่อให้โปรแกรมทำงานต่อได้
        admin: {
          id: "dummy_id",
          avatar: 0,
          email: "admin@example.com"
        }
      }
    });
  } catch (error) {
    logger.error('Admin auth error:', error);
    res.status(401).json({
      code: 401,
      message: "Authentication failed",
      data: {}
    });
  }
});

module.exports = router;