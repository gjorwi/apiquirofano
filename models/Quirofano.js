const { Schema, model } = require('mongoose');

const quirofanoSchema = new Schema({
  numero:      { type: String, required: true },
  ubicacion:   { type: String },
  tipo:        { type: String, enum: ['general', 'especializado', 'emergencia'], default: 'general' },
  equipamiento: [{ type: String }],
  habilitado:  { type: Boolean, default: true },
}, { timestamps: true });

module.exports = model('Quirofano', quirofanoSchema);
