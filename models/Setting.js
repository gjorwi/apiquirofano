const { Schema, model } = require('mongoose');
const settingSchema = new Schema({
  hideDemoLogin: { type: Boolean, default: false },
}, { timestamps: true });
module.exports = model('Setting', settingSchema);
