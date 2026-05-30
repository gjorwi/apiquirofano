const router = require('express').Router();
const Plan = require('../models/Plan');
const Caso = require('../models/Caso');
const requireRole = require('../middleware/role');

// GET /api/planes
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.fecha)     filter.fecha = req.query.fecha;
    if (req.query.quirofano) filter.quirofano = req.query.quirofano;
    res.json(await Plan.find(filter).lean());
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/planes/:id
router.get('/:id', async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id).lean();
    if (!plan) return res.status(404).json({ error: 'Plan no encontrado' });
    res.json(plan);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/planes — administrador, directivo o coordinador puede programar
router.post('/', requireRole('administrador', 'directivo', 'coordinador'), async (req, res) => {
  try {
    if (!req.body.caso) return res.status(400).json({ error: 'Campo caso requerido' });
    const plan = await Plan.create({ ...req.body, programadoPor: req.user?.nombre || '' });
    const caso = await Caso.findByIdAndUpdate(
      req.body.caso,
      { $set: { estado: 'programada', plan: plan._id } },
      { new: true }
    ).lean();
    if (!caso) return res.status(404).json({ error: 'Caso no encontrado' });
    res.status(201).json({ plan: plan.toObject(), caso });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// PUT /api/planes/:id — administrador, directivo o coordinador puede reprogramar
router.put('/:id', requireRole('administrador', 'directivo', 'coordinador'), async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean();
    if (!plan) return res.status(404).json({ error: 'Plan no encontrado' });
    res.json(plan);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// DELETE /api/planes/:id — solo administrador
router.delete('/:id', requireRole('administrador'), async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan no encontrado' });
    await Caso.findByIdAndUpdate(plan.caso, { $set: { estado: 'aprobada', plan: null } });
    res.status(204).end();
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
