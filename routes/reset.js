const router      = require('express').Router();
const requireRole = require('../middleware/role');
const User        = require('../models/User');
const Paciente    = require('../models/Paciente');
const Especialista= require('../models/Especialista');
const Quirofano   = require('../models/Quirofano');
const Procedimiento=require('../models/Procedimiento');
const Diagnostico = require('../models/Diagnostico');
const Insumo      = require('../models/Insumo');
const Baremo      = require('../models/Baremo');
const Caso        = require('../models/Caso');
const Plan        = require('../models/Plan');
const Admision    = require('../models/Admision');

const admin = requireRole('administrador');

const del = (Model, filter = {}) => async (req, res) => {
  try {
    const result = await Model.deleteMany(filter);
    res.json({ deleted: result.deletedCount });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Usuarios — conserva todos los administradores
router.delete('/usuarios',      admin, del(User,         { rol: { $ne: 'administrador' } }));

// Catálogos
router.delete('/pacientes',     admin, del(Paciente));
router.delete('/especialistas', admin, del(Especialista));
router.delete('/quirofanos',    admin, del(Quirofano));
router.delete('/procedimientos',admin, del(Procedimiento));
router.delete('/diagnosticos',  admin, del(Diagnostico));
router.delete('/insumos',       admin, del(Insumo));
router.delete('/baremos',        admin, del(Baremo));

// Operaciones (cascada lógica: eliminar admisiones y planes primero)
router.delete('/admisiones',    admin, del(Admision));
router.delete('/planes', admin, async (req, res) => {
  try {
    const planes = await Plan.deleteMany({});
    // Revertir casos a estado aprobada
    await Caso.updateMany({ plan: { $ne: null } }, { $set: { estado: 'aprobada', plan: null } });
    res.json({ deleted: planes.deletedCount });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
router.delete('/casos', admin, async (req, res) => {
  try {
    await Admision.deleteMany({});
    await Plan.deleteMany({});
    const casos = await Caso.deleteMany({});
    res.json({ deleted: casos.deletedCount });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
