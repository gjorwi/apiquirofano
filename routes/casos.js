const router = require('express').Router();
const Caso = require('../models/Caso');
const requireRole = require('../middleware/role');

// GET /api/casos
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.estado)      filter.estado = req.query.estado;
    if (req.query.tipo)        filter.tipo = req.query.tipo;
    if (req.query.especialista) filter.especialistaPrincipal = req.query.especialista;
    res.json(await Caso.find(filter).sort({ createdAt: -1 }).lean());
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/casos/:id
router.get('/:id', async (req, res) => {
  try {
    const caso = await Caso.findById(req.params.id).lean();
    if (!caso) return res.status(404).json({ error: 'Caso no encontrado' });
    res.json(caso);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/casos — solo especialistas y administrador pueden crear casos
router.post('/', requireRole('administrador', 'especialista'), async (req, res) => {
  try {
    const caso = await Caso.create({ ...req.body, estado: 'pendiente', plan: null, registradoPor: req.user?.nombre || '' });
    res.status(201).json(caso.toObject());
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// PUT /api/casos/:id
router.put('/:id', async (req, res) => {
  try {
    const caso = await Caso.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean();
    if (!caso) return res.status(404).json({ error: 'Caso no encontrado' });
    res.json(caso);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// PATCH /api/casos/:id — todos los roles autenticados (aprobación la valida la lógica de negocio)
router.patch('/:id', async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.estado === 'aprobada')  updates.aprobadoPor  = req.user?.nombre || '';
    if (updates.estado === 'rechazada') updates.rechazadoPor = req.user?.nombre || '';
    const caso = await Caso.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true, runValidators: true }).lean();
    if (!caso) return res.status(404).json({ error: 'Caso no encontrado' });
    res.json(caso);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// DELETE /api/casos/:id — solo administrador
router.delete('/:id', requireRole('administrador'), async (req, res) => {
  try {
    const caso = await Caso.findByIdAndDelete(req.params.id);
    if (!caso) return res.status(404).json({ error: 'Caso no encontrado' });
    res.status(204).end();
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
