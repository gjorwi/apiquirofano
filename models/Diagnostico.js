const { Schema, model } = require('mongoose');

const diagnosticoSchema = new Schema({
  codigo:      { type: String },
  nombre:      { type: String, required: true },
  descripcion: { type: String },
}, { timestamps: true });

module.exports = model('Diagnostico', diagnosticoSchema);
