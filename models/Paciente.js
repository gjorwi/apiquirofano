const { Schema, model } = require('mongoose');

const pacienteSchema = new Schema({
  nombre:          { type: String, required: true },
  identificacion:  { type: String, required: true, unique: true },
  fechaNacimiento: { type: String },
  sexo:            { type: String },
  contacto:        { type: String },
  historiaClinica: { type: String },
  direccion:       { type: String },
  alergias:        { type: String, default: '' },
}, { timestamps: true });

module.exports = model('Paciente', pacienteSchema);
