const User = require('../models/User');
const logger = require('../utils/logger');

exports.createUser = async (req, res) => {
  try {
    const { username, password, role, team, isWebAdmin, expiration } = req.body;

    logger.info('Create user request:', {
      username,
      role,
      team,
      expiration,
      isWebAdmin
    });

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      logger.warn('Username already exists:', { username });
      return res.status(400).json({ 
        status: 'error',
        message: 'Username already exists'
      });
    }

    const user = new User({
      username,
      password,
      role,
      team,
      isWebAdmin: isWebAdmin || false,
      expiration: expiration ? new Date(expiration) : new Date(Date.now() + (1000 * 24 * 60 * 60 * 1000)),
      lastLogin: null
    });

    await user.save();

    logger.info('User created successfully:', {
      username,
      role,
      team
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      status: 'success',
      data: userResponse
    });
  } catch (error) {
    logger.error('Create user error:', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error creating user'
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.json(users);
  } catch (error) {
    logger.error('Get users error:', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ message: 'Error fetching users' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, role, team, isWebAdmin, expiration } = req.body;

    logger.info('Update user request:', {
      id,
      username,
      role,
      team,
      expiration,
      isWebAdmin
    });

    const user = await User.findById(id);
    if (!user) {
      logger.warn('User not found:', { id });
      return res.status(404).json({ 
        status: 'error',
        message: 'User not found' 
      });
    }

    user.username = username;
    user.role = role;
    user.team = team;
    user.isWebAdmin = isWebAdmin;
    if (expiration) {
      user.expiration = new Date(expiration);
    }

    await user.save();

    logger.info('User updated successfully:', {
      id,
      username,
      role,
      team
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      status: 'success',
      data: userResponse
    });
  } catch (error) {
    logger.error('Update user error:', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error updating user'
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    logger.info('Delete user request:', { id });

    const user = await User.findById(id);
    if (!user) {
      logger.warn('User not found:', { id });
      return res.status(404).json({ 
        status: 'error',
        message: 'User not found' 
      });
    }

    await User.deleteOne({ _id: id });

    logger.info('User deleted successfully:', { id });

    res.json({ 
      status: 'success',
      message: 'User deleted successfully' 
    });
  } catch (error) {
    logger.error('Delete user error:', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error deleting user'
    });
  }
};