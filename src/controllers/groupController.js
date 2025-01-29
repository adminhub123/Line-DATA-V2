// controllers/groupController.js
const logger = require('../utils/logger');
const Group = require('../models/Group');

exports.createGroup = async (req, res) => {
    try {
        const {
            nameGroup, // ชื่อกลุ่ม  
            linkGroup, // link กลุ่ม
            numberOfPeople, // จำนวนคนในกลุ่ม
            chatUid, // chatMid ของกลุ่ม
            listKai, // รายการ line ไก่
            status // สถานะการสร้างกลุ่ม
        } = req.body;

        const group = new Group({
            nameGroup,
            linkGroup,
            numberOfPeople,
            chatUid,
            listKai,
            status,
            createdAt: new Date()
        });

        await group.save();

        // Log success
        logger.info('Group created successfully', {
            name: nameGroup,
            members: numberOfPeople,
            status
        });

        res.status(201).json(group);

    } catch (error) {
        logger.error('Create group error', {
            error: error.message,
            data: req.body
        });
        res.status(500).json({ message: error.message }); 
    }
};