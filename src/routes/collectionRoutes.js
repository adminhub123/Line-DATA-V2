const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const fileDataController = require('../controllers/fileDataController');
const auth = require('../middleware/auth');

// Get all collections
router.get('/', async (req, res) => {
 try {
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
       },
       {
         id: "GetFileData", 
         name: "GetFileData",
         type: "base"
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

// FileData routes with auth middleware
router.get('/GetFileData/records', auth, fileDataController.getRecords);
router.get('/GetFileData/records/:id', auth, fileDataController.getRecord);
router.post('/GetFileData/records', auth, fileDataController.createRecord);
router.patch('/GetFileData/records/:id', auth, fileDataController.updateRecord);
router.delete('/GetFileData/records/:id', auth, fileDataController.deleteRecord);

// Other collection routes
router.get('/:collection/records', auth, async (req, res) => {
 try {
   const collection = req.params.collection;
   res.json({
     code: 200,
     message: "",
     data: {
       page: 1,
       perPage: 30,
       totalItems: 0,
       totalPages: 0,
       items: [] 
     }
   });
 } catch (error) {
   logger.error(`Get ${req.params.collection} records error:`, error);
   res.status(500).json({
     code: 500,
     message: error.message,
     data: {
       items: []
     }
   });
 }
});

router.get('/:collection/records/:id', auth, async (req, res) => {
 try {
   const collection = req.params.collection;
   const id = req.params.id;
   res.json({
     code: 200,
     message: "",
     data: {
       id: id,
       collectionId: collection,
       collectionName: collection,
       created: new Date().toISOString(),
       updated: new Date().toISOString()
     }
   });
 } catch (error) {
   logger.error(`Get ${req.params.collection} record error:`, error);
   res.status(404).json({
     code: 404,
     message: "Record not found",
     data: {}
   });
 }
});

router.post('/:collection/records', auth, async (req, res) => {
 try {
   const collection = req.params.collection;
   const record = {
     id: Date.now().toString(),
     collectionId: collection,
     collectionName: collection,
     created: new Date().toISOString(),
     updated: new Date().toISOString(),
     ...req.body
   };

   res.status(201).json({
     code: 201,
     message: "",
     data: record
   });
 } catch (error) {
   logger.error(`Create ${req.params.collection} record error:`, error);
   res.status(500).json({
     code: 500,
     message: error.message,
     data: {}
   });
 }
});

router.patch('/:collection/records/:id', auth, async (req, res) => {
 try {
   const collection = req.params.collection;
   const id = req.params.id;
   const record = {
     id: id,
     collectionId: collection,
     collectionName: collection, 
     updated: new Date().toISOString(),
     ...req.body
   };

   res.json({
     code: 200,
     message: "",
     data: record
   });
 } catch (error) {
   logger.error(`Update ${req.params.collection} record error:`, error);
   res.status(500).json({
     code: 500,
     message: error.message,
     data: {}
   });
 }
});

router.delete('/:collection/records/:id', auth, async (req, res) => {
 try {
   const collection = req.params.collection;
   const id = req.params.id;
   
   res.json({
     code: 200,
     message: "",
     data: {}
   });
 } catch (error) {
   logger.error(`Delete ${req.params.collection} record error:`, error);
   res.status(500).json({
     code: 500,
     message: error.message,
     data: {}
   });
 }
});

module.exports = router;