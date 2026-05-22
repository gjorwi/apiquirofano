const { Schema, model, Types } = require('mongoose');

const admisionSchema = new Schema({
  caso:             { type: Types.ObjectId, ref: 'Caso', required: true, unique: true },
  fechaHoraIngreso: { type: Date, default: Date.now },
  responsable:      { type: String },
  signosVitales: {
    presionArterial:    { type: String },
    frecuenciaCardiaca: { type: Number },
    temperatura:        { type: Number },
    saturacionOxigeno:  { type: Number },
  },
  verificacionDocumentos: {
    identificacion:       { type: Boolean, default: false },
    consentimientoFirmado: { type: Boolean, default: false },
    ordenMedica:          { type: Boolean, default: false },
  },
  checklist: [{
    item:    { type: String },
    cumplido: { type: Boolean, default: false },
  }],
  insumosUtilizados: [{
    insumo:   { type: Types.ObjectId, ref: 'Insumo' },
    cantidad: { type: Number, default: 1 },
  }],
  ingresadoPor: { type: String, default: '' },
  observaciones: { type: String },
}, { timestamps: true });

module.exports = model('Admision', admisionSchema);
