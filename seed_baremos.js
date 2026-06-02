if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = require('crypto').webcrypto;
}
require('dns').setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./data/db');
const Baremo = require('./models/Baremo');

async function seedBaremos() {
  await connectDB();
  console.log('🌱 Cargando baremos desde Excel...');

  const XLSX = require('xlsx');
  const wb = XLSX.readFile('../baremo_de_dias_maximos_de_incapacidad_2016.xlsx');
  const ws = wb.Sheets['TIEMPO MAXIMO DE REPOSO'];
  const raw = XLSX.utils.sheet_to_json(ws, { header: 1 }).slice(1);

  const activos = raw.filter(r => r[3] === 'ACTIVO');
  const baremosData = activos.map(r => ({
    capitulo:              String(r[0] || '').trim(),
    codigo:                String(r[1] || '').split(' - ')[0].trim(),
    diagnosticoGeneral:   String(r[1] || '').replace(/^[A-Z][0-9][0-9]\.?[0-9]?\s*-\s*/, '').trim(),
    diagnosticoEspecifica: String(r[4] || '').replace(/^[0-9]+\s*-\s*/, '').trim(),
    diasReposoGeneral:    Number(r[2]) || 0,
    diasReposoEspecifica:  Number(r[5]) || 0,
    observaciones:         '',
  }));

  await Baremo.deleteMany({});
  const inserted = await Baremo.insertMany(baremosData);

  console.log(`✅ ${inserted.length} registros de baremo insertados`);

  const sample = await Baremo.findOne().lean();
  if (sample) {
    console.log('   Ejemplo:', sample.capitulo);
    console.log('   ', sample.codigo, '-', sample.diagnosticoGeneral, '|', sample.diagnosticoEspecifica);
    console.log('   Días:', sample.diasReposoGeneral, '(G) /', sample.diasReposoEspecifica, '(E)');
  }

  await mongoose.disconnect();
  console.log('🏁 Seed baremos completado');
}

seedBaremos().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});