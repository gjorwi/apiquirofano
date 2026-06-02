const router = require('express').Router();
const Baremo = require('../models/Baremo');

router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.buscar) {
      const q = req.query.buscar;
      filter.$or = [
        { codigo: { $regex: q, $options: 'i' } },
        { diagnosticoGeneral: { $regex: q, $options: 'i' } },
        { diagnosticoEspecifica: { $regex: q, $options: 'i' } },
      ];
    }
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 30);
    const skip = (page - 1) * limit;
    const total = await Baremo.countDocuments(filter);
    const baremos = await Baremo.find(filter).lean().sort({ diagnosticoGeneral: 1 }).skip(skip).limit(limit);
    res.json({ baremos, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const b = await Baremo.findById(req.params.id).lean();
    if (!b) return res.status(404).json({ error: 'No encontrado' });
    res.json(b);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    if (!req.body.codigo || !req.body.diagnosticoGeneral || req.body.diasReposoGeneral == null) {
      return res.status(400).json({ error: 'campos requeridos: codigo, diagnosticoGeneral, diasReposoGeneral' });
    }
    const b = await Baremo.create(req.body);
    res.status(201).json(b.toObject());
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const b = await Baremo.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean();
    if (!b) return res.status(404).json({ error: 'No encontrado' });
    res.json(b);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const r = await Baremo.findByIdAndDelete(req.params.id);
    if (!r) return res.status(404).json({ error: 'No encontrado' });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;