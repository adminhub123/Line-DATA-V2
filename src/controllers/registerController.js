const RegisterHistory = require('../models/RegisterHistory'); 
const logger = require('../utils/logger');

exports.recordRegister = async (req, res) => {
   try {
       logger.info('Register request received:', {
           body: req.body,
           headers: req.headers,
           path: req.path
       });

       const {
           Mid,
           DisplayName, 
           AuthKey,
           Phone,
           AccessToken,
           RefreshToken,
           Status,
           BrandId,
           CreatedAt,
           UpdatedAt
       } = req.body;

       const registerRecord = new RegisterHistory({
           mid: Mid,
           displayName: DisplayName,
           authKey: AuthKey, 
           phoneNumber: Phone,
           accessToken: AccessToken,
           refreshToken: RefreshToken,
           status: Status,
           brandId: BrandId,
           createdAt: CreatedAt,
           updatedAt: UpdatedAt,
           registerDate: new Date()
       });

       await registerRecord.save();

       logger.info(`Registration recorded successfully for user: ${Mid}`, {
           displayName: DisplayName,
           phoneNumber: Phone
       });

       res.status(201).json(registerRecord);

   } catch (error) {
       logger.error('Register record error:', {
           error: {
               message: error.message,
               stack: error.stack,
               name: error.name
           },
           body: {
               ...req.body,
               accessToken: '***',
               refreshToken: '***'
           }
       });

       res.status(500).json({
           message: error.message,
           errorType: error.name
       });
   }
};

exports.getRegisterHistory = async (req, res) => {
   try {
       const { userId } = req.params;
       const history = await RegisterHistory.find({ mid: userId })
                                         .sort({ registerDate: -1 });
       
       logger.info(`Register history retrieved for user: ${userId}`);
       res.json(history);

   } catch (error) {
       logger.error('Get register history error:', {
           error: {
               message: error.message,
               stack: error.stack
           },
           userId: req.params.userId  
       });

       res.status(500).json({ message: error.message });
   }
};