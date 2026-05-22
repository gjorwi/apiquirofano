const { Schema, model } = require('mongoose');

const especialistaSchema = new Schema({
  nombre:          { type: String, required: true },
  especialidad:    { type: String, required: true },
  codigoColegiado: { type: String },
  disponibilidad:  [{
    dia:       String,
    horaInicio: String,
    horaFin:   String,
  }],
}, { timestamps: true });

module.exports = model('Especialista', especialistaSchema);
