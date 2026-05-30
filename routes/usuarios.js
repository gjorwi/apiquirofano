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

// PATCH /api/usuarios/:id/password — admin/directivo pueden cambiar cualquier contraseña, otros solo la suya
router.patch('/:id/password', async (req, res) => {
  try {
    const targetId = req.params.id;
    const { currentPassword, newPassword } = req.body;
    const isSelf = req.user?.id === targetId;
    const isAdminOrDirectivo = ['administrador', 'directivo'].includes(req.user?.rol);
    if (!isSelf && !isAdminOrDirectivo) {
      return res.status(403).json({ error: 'Solo puedes cambiar tu propia contraseña' });
    }
    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 4 caracteres' });
    }
    const user = await User.findById(targetId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    if (isSelf && !isAdminOrDirectivo) {
      if (!currentPassword || !bcrypt.compareSync(currentPassword, user.password)) {
        return res.status(400).json({ error: 'Contraseña actual incorrecta' });
      }
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
