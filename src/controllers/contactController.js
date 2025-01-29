//src/controllers/contactController.js
const Contact = require('../models/Contact');
const logger = require('../utils/logger');

exports.createContacts = async (req, res) => {
  try {
    const { userId, contacts } = req.body;
    
    const operations = contacts.map(contact => ({
      updateOne: {
        filter: { userId: userId, targetUserMid: contact.targetUserMid },
        update: { $set: contact },
        upsert: true
      }
    }));

    const result = await Contact.bulkWrite(operations);
    logger.info(`Contacts updated for user: ${userId}`, {
      count: contacts.length
    });
    res.status(200).json({
      message: 'Contacts updated successfully',
      result: result
    });
  } catch (error) {
    logger.error('Create contacts error', {
      error: error.message,
      userId: req.body.userId
    });
    res.status(500).json({ message: error.message });
  }
};

exports.getContact = async (req, res) => {
  try {
    const { userId, targetUserMid } = req.params;
    const contact = await Contact.findOne({ userId, targetUserMid });
    
    if (!contact) {
      logger.warn(`Contact not found: ${userId}/${targetUserMid}`);
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.json(contact);
  } catch (error) {
    logger.error('Get contact error', {
      error: error.message,
      userId: req.params.userId,
      targetUserMid: req.params.targetUserMid
    });
    res.status(500).json({ message: error.message });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const { userId, targetUserMid } = req.params;
    const updateData = req.body;
    
    const contact = await Contact.findOneAndUpdate(
      { userId, targetUserMid },
      updateData,
      { new: true }
    );
    
    if (!contact) {
      logger.warn(`Contact not found for update: ${userId}/${targetUserMid}`);
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    logger.info(`Contact updated: ${userId}/${targetUserMid}`);
    res.json(contact);
  } catch (error) {
    logger.error('Update contact error', {
      error: error.message,
      userId: req.params.userId,
      targetUserMid: req.params.targetUserMid,
      data: req.body
    });
    res.status(500).json({ message: error.message });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const { userId, targetUserMid } = req.params;
    const contact = await Contact.findOneAndDelete({ userId, targetUserMid });
    
    if (!contact) {
      logger.warn(`Contact not found for deletion: ${userId}/${targetUserMid}`);
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    logger.info(`Contact deleted: ${userId}/${targetUserMid}`);
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    logger.error('Delete contact error', {
      error: error.message,
      userId: req.params.userId,
      targetUserMid: req.params.targetUserMid
    });
    res.status(500).json({ message: error.message });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const { userId } = req.params;
    const contacts = await Contact.find({ userId });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};