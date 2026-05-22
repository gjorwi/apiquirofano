const { Schema, model } = require('mongoose');

const insumoSchema = new Schema({
  nombre:      { type: String, required: true },
  descripcion: { type: String },
}, { timestamps: true });

module.exports = model('Insumo', insumoSchema);
