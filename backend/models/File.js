const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  branch: { type: String, required: true },
  semester: { type: String, required: true },
  subject: { type: String, required: true },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('File', fileSchema);