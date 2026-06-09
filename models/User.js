const { Schema, model, Types } = require('mongoose');

const userSchema = new Schema({
  nombre:       { type: String, required: true },
  username:     { type: String, required: true, unique: true },
  password:     { type: String, required: true },
  rol: { type: String, enum: ['administrador', 'especialista', 'admision', 'directivo', 'coordinador', 'baremo'], required: true },
  esJefeServicio: { type: Boolean, default: false },
  medicinaFamiliar: { type: Boolean, default: false },
  especialistaId: { type: Types.ObjectId, ref: 'Especialista', default: null },
  activo:       { type: Boolean, default: true },
}, { timestamps: true });

module.exports = model('User', userSchema);
