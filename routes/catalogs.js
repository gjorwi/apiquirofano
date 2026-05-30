const router = require('express').Router();
const Paciente     = require('../models/Paciente');
const Especialista = require('../models/Especialista');
const Quirofano    = require('../models/Quirofano');
const Procedimiento = require('../models/Procedimiento');
const Diagnostico  = require('../models/Diagnostico');
const Insumo       = require('../models/Insumo');

function crud(path, Model, notFound) {
  router.get(path, async (_, res) => {
    try { res.json(await Model.find().lean()); }
    catch (err) { res.status(500).json({ error: err.message }); }
  });

  router.post(path, async (req, res) => {
    try {
      const doc = await Model.create(req.body);
      const obj = doc.toObject();
      console.log(`${Model.modelName} creado:`, JSON.stringify(obj));
      res.status(201).json(obj);
    }
    catch (err) { res.status(400).json({ error: err.message }); }
  });

  router.put(`${path}/:id`, async (req, res) => {
    try {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean();
      if (!doc) return res.status(404).json({ error: notFound });
      res.json(doc);
    } catch (err) { res.status(400).json({ error: err.message }); }
  });

  router.delete(`${path}/:id`, async (req, res) => {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) return res.status(404).json({ error: notFound });
      res.status(204).end();
    } catch (err) { res.status(500).json({ error: err.message }); }
  });
}

crud('/pacientes',      Paciente,     'Paciente no encontrado');
crud('/especialistas',  Especialista, 'Especialista no encontrado');
crud('/quirofanos',     Quirofano,    'Quirófano no encontrado');
crud('/procedimientos', Procedimiento,'Procedimiento no encontrado');
crud('/diagnosticos',   Diagnostico,  'Diagnóstico no encontrado');
crud('/insumos',        Insumo,       'Insumo no encontrado');

module.exports = router;
