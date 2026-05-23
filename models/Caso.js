const { Schema, model, Types } = require('mongoose');

const casoSchema = new Schema({
  tipo:     { type: String, enum: ['electivo', 'emergencia'], default: 'electivo' },
  prioridad: { type: String, enum: ['alta', 'media', 'baja'], default: 'media' },
  estado:   {
    type: String,
    enum: ['pendiente', 'aprobada', 'rechazada', 'programada', 'en_admision', 'en_curso', 'finalizado', 'cancelado'],
    default: 'pendiente',
  },
  paciente:              { type: Types.ObjectId, ref: 'Paciente', required: true },
  especialistaPrincipal: { type: Types.ObjectId, ref: 'Especialista', required: true },
  equipoQuirurgico:      [{ type: Types.ObjectId, ref: 'Especialista' }],
  asistentesExternos:    [{ type: String }],
  diagnostico:           { type: Types.ObjectId, ref: 'Diagnostico' },
  procedimiento:         { type: Types.ObjectId, ref: 'Procedimiento' },
  duracionEstimadaMin:   { type: Number },
  observaciones:         { type: String, default: '' },
  plan:                  { type: Types.ObjectId, ref: 'Plan', default: null },
  fechaIngresoEmergencia: { type: Date },
  motivoEmergencia:      { type: String },
  registradoPor:         { type: String, default: '' },
  aprobadoPor:           { type: String, default: '' },
  rechazadoPor:          { type: String, default: '' },
  horaRealInicio:        { type: Date, default: null },
  horaRealFin:           { type: Date, default: null },
}, { timestamps: true });

module.exports = model('Caso', casoSchema);
