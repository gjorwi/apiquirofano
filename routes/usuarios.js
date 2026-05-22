const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const requireRole = require('../middleware/role');

// GET /api/usuarios
router.get('/', async (req, res) => {
  try {
    res.json(await User.find().select('-password').lean());
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/usuarios — solo administrador
router.post('/', requireRole('administrador'), async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    if (!password) return res.status(400).json({ error: 'Contraseña requerida' });
    const hashed = await bcrypt.hash(password, 10);
    const usuario = await User.create({ ...rest, password: hashed, activo: true });
    const { password: _, ...safe } = usuario.toObject();
    res.status(201).json(safe);
  } catch (err) {
    const status = err.code === 11000 ? 409 : 400;
    res.status(status).json({ error: err.code === 11000 ? 'Username ya existe' : err.message });
  }
});

// PUT /api/usuarios/:id — solo administrador
router.put('/:id', requireRole('administrador'), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    } else {
      delete updates.password;
    }
    const usuario = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-password').lean();
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// PATCH /api/usuarios/:id/toggle — solo administrador
router.patch('/:id/toggle', requireRole('administrador'), async (req, res) => {
  try {
    const u = await User.findById(req.params.id);
    if (!u) return res.status(404).json({ error: 'Usuario no encontrado' });
    u.activo = !u.activo;
    await u.save();
    const { password: _, ...safe } = u.toObject();
    res.json(safe);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
