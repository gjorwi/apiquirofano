if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = require('crypto').webcrypto;
}
require('dns').setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./data/db');
const authMiddleware = require('./middleware/auth');

const authRoutes      = require('./routes/auth');
const catalogRoutes   = require('./routes/catalogs');
const casosRoutes     = require('./routes/casos');
const planesRoutes    = require('./routes/planes');
const admisionesRoutes = require('./routes/admisiones');
const usuariosRoutes  = require('./routes/usuarios');

const app = express();

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001', 'http://192.168.1.214:3000', 'http://192.168.1.214:3001'] }));
app.use(express.json());

// ── Rutas públicas ────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// ── Rutas protegidas ──────────────────────────────────────────────────────────
app.use('/api', authMiddleware);

app.use('/api', catalogRoutes);
app.use('/api/casos', casosRoutes);
app.use('/api/planes', planesRoutes);
app.use('/api/admisiones', admisionesRoutes);
app.use('/api/usuarios', usuariosRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

const PORT = process.env.PORT || 4000;
connectDB()
  .then(() => app.listen(PORT, () => console.log(`✅ API QuirófanoApp corriendo en http://localhost:${PORT}`)))
  .catch(err => { console.error('❌ No se pudo conectar a MongoDB:', err.message); process.exit(1); });
