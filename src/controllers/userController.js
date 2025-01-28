const User = require('../models/User');
const logger = require('../utils/logger');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // ไม่ส่ง password กลับไป
    res.json(users);
  } catch (error) {
    logger.error('Get users error:', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ message: 'Error fetching users' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, password, role, team } = req.body;

    // ตรวจสอบว่ามี user นี้อยู่แล้วหรือไม่
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // สร้าง user ใหม่
    const user = new User({
      username,
      password, // จะถูก hash ใน model
      role,
      team,
      lastLogin: null
    });

    await user.save();
    
    logger.info('User created:', {
      username,
      role,
      team
    });

    // ส่งข้อมูลกลับโดยไม่มี password
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    logger.error('Create user error:', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ message: 'Error creating user' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, role, team } = req.body;

    // ตรวจสอบว่ามี user อื่นที่ใช้ username นี้หรือไม่
    const existingUser = await User.findOne({ 
      username, 
      _id: { $ne: id } 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { username, role, team },
      { new: true, select: '-password' }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    logger.info('User updated:', {
      id,
      username,
      role,
      team
    });

    res.json(user);
  } catch (error) {
    logger.error('Update user error:', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ message: 'Error updating user' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ไม่ให้ลบ user ที่กำลัง login อยู่
    if (user._id.toString() === req.userId) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await User.deleteOne({ _id: id });

    logger.info('User deleted:', {
      id,
      username: user.username
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error('Delete user error:', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ message: 'Error deleting user' });
  }
};