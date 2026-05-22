const { Schema, model, Types } = require('mongoose');

const planSchema = new Schema({
  fecha:          { type: String, required: true },
  horaInicio:     { type: String, required: true },
  horaFinEstimada: { type: String, required: true },
  quirofano:      { type: Types.ObjectId, ref: 'Quirofano', required: true },
  caso:           { type: Types.ObjectId, ref: 'Caso', required: true },
  programadoPor:  { type: String, default: '' },
}, { timestamps: true });

module.exports = model('Plan', planSchema);
