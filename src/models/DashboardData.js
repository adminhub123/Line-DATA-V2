const mongoose = require('mongoose');

const createGroupRecordSchema = new mongoose.Schema({
  Username: String,
  Created: Date,
  NameGroup: String,  
  NumberOfPeople: Number,
  Status: String
});

const registerRecordSchema = new mongoose.Schema({
  Username: String,
  Created: Date,
  Phone: String,
  DisplayName: String,
  Status: String
});

const DashboardRecord = mongoose.model('CreateGroupRecord', createGroupRecordSchema);
const RegisterRecord = mongoose.model('RegisterRecord', registerRecordSchema);

module.exports = {
  DashboardRecord,
  RegisterRecord
};