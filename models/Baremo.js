const { Schema, model } = require('mongoose');

const baremoSchema = new Schema({
  capitulo:            { type: String, required: true },
  codigo:              { type: String, required: true },
  diagnosticoGeneral:  { type: String },
  diagnosticoEspecifica: { type: String },
  diasReposoGeneral:   { type: Number, default: 0 },
  diasReposoEspecifica: { type: Number, default: 0 },
  observaciones:       { type: String },
}, { timestamps: true });

module.exports = model('Baremo', baremoSchema);