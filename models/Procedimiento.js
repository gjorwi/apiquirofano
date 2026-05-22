const { Schema, model } = require('mongoose');

const procedimientoSchema = new Schema({
  nombre:             { type: String, required: true },
  descripcion:        { type: String },
  duracionPromedioMin: { type: Number, default: 60 },
}, { timestamps: true });

module.exports = model('Procedimiento', procedimientoSchema);
