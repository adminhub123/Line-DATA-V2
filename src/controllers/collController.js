const logger = require('../utils/logger');

// GET /collections/CreateGroupConfig/records
exports.getCreateGroupConfig = async (req, res) => {
    try {
        logger.info('Get CreateGroupConfig records request:', {
            headers: req.headers,
            query: req.query
        });

        // สร้าง response แบบ collection record
        const records = {
            page: 1,
            perPage: 30,
            totalItems: 0,
            totalPages: 1,
            items: []
        };

        logger.info('Get CreateGroupConfig records response:', {
            totalItems: records.totalItems,
            items: records.items
        });

        res.json(records);

    } catch (error) {
        logger.error('Get CreateGroupConfig records error:', {
            error: {
                message: error.message,
                stack: error.stack
            }
        });
        res.status(500).json({ message: error.message });
    }
};

// POST /collections/CreateGroupConfig/records 
exports.createCreateGroupConfig = async (req, res) => {
    try {
        logger.info('Create CreateGroupConfig record request:', {
            body: req.body,
            headers: req.headers
        });

        const record = {
            id: new Date().getTime().toString(),
            ...req.body,
            created: new Date().toISOString(),
            updated: new Date().toISOString()
        };

        logger.info('Created CreateGroupConfig record:', {
            record
        });

        res.status(201).json(record);

    } catch (error) {
        logger.error('Create CreateGroupConfig record error:', {
            error: {
                message: error.message,
                stack: error.stack
            },
            body: req.body
        });
        res.status(500).json({ message: error.message });
    }
};