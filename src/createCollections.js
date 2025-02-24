const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const MachineKey = require('../src/models/MachineKey');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // สร้าง dummy document เพื่อให้ MongoDB สร้างคอลเลกชัน
    const dummyKey = new MachineKey({
      username: 'temp_user',
      machineKey: 'temp_key_' + Date.now(),
      isActive: false
    });
    
    await dummyKey.save();
    console.log('Created dummy record to initialize collection');
    
    // ลบ dummy document
    await MachineKey.deleteOne({ username: 'temp_user' });
    console.log('Removed dummy record');
    
    console.log('MachineKey collection initialized successfully');
    
    // ปิดการเชื่อมต่อ
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });