const router = require('express').Router();
const Admision = require('../models/Admision');
const Caso     = require('../models/Caso');
const requireRole = require('../middleware/role');

// GET /api/admisiones
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.caso) filter.caso = req.query.caso;
    res.json(await Admision.find(filter).lean());
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/admisiones/:id
router.get('/:id', async (req, res) => {
  try {
    const adm = await Admision.findById(req.params.id).lean();
    if (!adm) return res.status(404).json({ error: 'Admisión no encontrada' });
    res.json(adm);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/admisiones — solo personal de admisión y administrador
router.post('/', requireRole('admision', 'administrador'), async (req, res) => {
  try {
    if (!req.body.caso) return res.status(400).json({ error: 'Campo caso requerido' });
    const admision = await Admision.create({ ...req.body, ingresadoPor: req.user?.nombre || '' });
    const caso = await Caso.findByIdAndUpdate(
      req.body.caso,
      { $set: { estado: 'en_admision' } },
      { new: true }
    ).lean();
    if (!caso) return res.status(404).json({ error: 'Caso no encontrado' });
    res.status(201).json({ admision: admision.toObject(), caso });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// PUT /api/admisiones/:id
router.put('/:id', async (req, res) => {
  try {
    const adm = await Admision.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean();
    if (!adm) return res.status(404).json({ error: 'Admisión no encontrada' });
    res.json(adm);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;
