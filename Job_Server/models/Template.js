const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: String,
  html: String,
  css: String,
  previewImage: String
});

module.exports = mongoose.model('Template', templateSchema);
