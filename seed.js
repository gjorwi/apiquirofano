if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = require('crypto').webcrypto;
}
require('dns').setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./data/db');

const Especialista  = require('./models/Especialista');
const Paciente      = require('./models/Paciente');
const Quirofano     = require('./models/Quirofano');
const Procedimiento = require('./models/Procedimiento');
const Diagnostico   = require('./models/Diagnostico');
const Insumo        = require('./models/Insumo');
const Caso          = require('./models/Caso');
const Plan          = require('./models/Plan');
const Admision      = require('./models/Admision');
const User          = require('./models/User');

async function seed() {
  await connectDB();
  console.log('🌱 Iniciando seed — limpiando colecciones...');

  await Promise.all([
    Especialista.deleteMany({}),
    Paciente.deleteMany({}),
    Quirofano.deleteMany({}),
    Procedimiento.deleteMany({}),
    Diagnostico.deleteMany({}),
    Insumo.deleteMany({}),
    Caso.deleteMany({}),
    Plan.deleteMany({}),
    Admision.deleteMany({}),
    User.deleteMany({}),
  ]);

  // ── Especialistas ────────────────────────────────────────────────────────────
  const [e1, e2, e3, e4, e5, e6] = await Especialista.insertMany([
    { nombre: 'Dr. Andrés Montoya',  especialidad: 'Cirugía General',         codigoColegiado: 'CG-0045', disponibilidad: [{ dia: 'Lunes',     horaInicio: '07:00', horaFin: '15:00' }, { dia: 'Miércoles', horaInicio: '07:00', horaFin: '15:00' }] },
    { nombre: 'Dra. Carmen Solís',   especialidad: 'Cirugía Cardiovascular',   codigoColegiado: 'CC-0032', disponibilidad: [{ dia: 'Martes',    horaInicio: '08:00', horaFin: '16:00' }, { dia: 'Jueves',    horaInicio: '08:00', horaFin: '16:00' }] },
    { nombre: 'Dr. Felipe Rojas',    especialidad: 'Neurocirugía',             codigoColegiado: 'NC-0018', disponibilidad: [{ dia: 'Lunes',     horaInicio: '06:00', horaFin: '14:00' }, { dia: 'Viernes',   horaInicio: '06:00', horaFin: '14:00' }] },
    { nombre: 'Dra. Valentina Cruz', especialidad: 'Ortopedia',                codigoColegiado: 'OR-0067', disponibilidad: [{ dia: 'Martes',    horaInicio: '07:00', horaFin: '15:00' }, { dia: 'Jueves',    horaInicio: '07:00', horaFin: '15:00' }] },
    { nombre: 'Dr. Hernán Palacios', especialidad: 'Urología',                 codigoColegiado: 'UR-0029', disponibilidad: [{ dia: 'Miércoles', horaInicio: '08:00', horaFin: '16:00' }, { dia: 'Viernes',   horaInicio: '08:00', horaFin: '16:00' }] },
    { nombre: 'Dra. Isabel Vargas',  especialidad: 'Ginecología',              codigoColegiado: 'GN-0053', disponibilidad: [{ dia: 'Lunes',     horaInicio: '07:00', horaFin: '15:00' }, { dia: 'Miércoles', horaInicio: '07:00', horaFin: '15:00' }] },
  ]);
  console.log('✅ 6 especialistas');

  // ── Pacientes ────────────────────────────────────────────────────────────────
  const [p1, p2, p3, p4, p5, p6, p7, p8] = await Paciente.insertMany([
    { nombre: 'María López García',       identificacion: '0101-1985-12345', email: 'maria.lopez@gmail.com',    fechaNacimiento: '1985-03-15', sexo: 'Femenino',  contacto: '9999-1234', historiaClinica: 'HC-001' },
    { nombre: 'Carlos Mendoza Rivera',    identificacion: '0201-1978-54321', email: 'carlos.mendoza@gmail.com',  fechaNacimiento: '1978-07-22', sexo: 'Masculino', contacto: '9888-5678', historiaClinica: 'HC-002' },
    { nombre: 'Ana Sofía Ramos',          identificacion: '0301-1992-11111', email: 'ana.ramos@gmail.com',       fechaNacimiento: '1992-11-08', sexo: 'Femenino',  contacto: '9777-9012', historiaClinica: 'HC-003' },
    { nombre: 'José Antonio Herrera',     identificacion: '0401-1965-22222', email: 'jose.herrera@gmail.com',    fechaNacimiento: '1965-04-30', sexo: 'Masculino', contacto: '9666-3456', historiaClinica: 'HC-004' },
    { nombre: 'Lucía Fernández Blanco',   identificacion: '0501-1990-33333', email: 'lucia.fernandez@gmail.com', fechaNacimiento: '1990-09-18', sexo: 'Femenino',  contacto: '9555-7890', historiaClinica: 'HC-005' },
    { nombre: 'Roberto Castillo Mora',    identificacion: '0601-1973-44444', email: 'roberto.castillo@gmail.com', fechaNacimiento: '1973-01-25', sexo: 'Masculino', contacto: '9444-2345', historiaClinica: 'HC-006' },
    { nombre: 'Patricia Villanueva Cruz', identificacion: '0701-1988-55555', email: 'patricia.villanueva@gmail.com', fechaNacimiento: '1988-06-12', sexo: 'Femenino',  contacto: '9333-6789', historiaClinica: 'HC-007' },
    { nombre: 'Miguel Ángel Torres',      identificacion: '0801-1995-66666', email: 'miguel.torres@gmail.com',    fechaNacimiento: '1995-12-03', sexo: 'Masculino', contacto: '9222-0123', historiaClinica: 'HC-008' },
  ]);
  console.log('✅ 8 pacientes');

  // ── Quirófanos ───────────────────────────────────────────────────────────────
  const [q1, q2, q3, q4] = await Quirofano.insertMany([
    { numero: 'Q-01', ubicacion: 'Planta 2 – Ala Norte',   tipo: 'general',      equipamiento: ['Mesa quirúrgica', 'Lámpara LED', 'Monitor multiparamétrico', 'Electrocauterio'],                                      habilitado: true },
    { numero: 'Q-02', ubicacion: 'Planta 2 – Ala Norte',   tipo: 'especializado', equipamiento: ['Sistema de fluoroscopía', 'Mesa ortopédica', 'Lámpara LED', 'Monitor multiparamétrico'],                              habilitado: true },
    { numero: 'Q-03', ubicacion: 'Planta 2 – Ala Sur',     tipo: 'general',      equipamiento: ['Mesa quirúrgica', 'Lámpara LED', 'Monitor multiparamétrico'],                                                          habilitado: true },
    { numero: 'Q-04', ubicacion: 'Planta 1 – Urgencias',   tipo: 'emergencia',   equipamiento: ['Mesa quirúrgica', 'Desfibrilador', 'Ventilador', 'Monitor multiparamétrico', 'Ecógrafo portátil'],                     habilitado: true },
  ]);
  console.log('✅ 4 quirófanos');

  // ── Procedimientos ───────────────────────────────────────────────────────────
  const [pr1, pr2, pr3, pr4, pr5, pr6, pr7, pr8, pr9, pr10] = await Procedimiento.insertMany([
    { nombre: 'Apendicectomía laparoscópica',   descripcion: 'Extirpación del apéndice por vía laparoscópica',             duracionPromedioMin: 60  },
    { nombre: 'Colecistectomía laparoscópica',  descripcion: 'Extirpación de la vesícula biliar por laparoscopía',         duracionPromedioMin: 75  },
    { nombre: 'Hernioplastia inguinal',          descripcion: 'Reparación de hernia inguinal con malla',                   duracionPromedioMin: 90  },
    { nombre: 'Artroplastia de rodilla',         descripcion: 'Reemplazo total de articulación de rodilla',                duracionPromedioMin: 120 },
    { nombre: 'Bypass coronario',                descripcion: 'Revascularización miocárdica quirúrgica',                   duracionPromedioMin: 240 },
    { nombre: 'Craneotomía',                     descripcion: 'Apertura del cráneo para acceso a estructuras intracraneales', duracionPromedioMin: 180 },
    { nombre: 'Nefrectomía laparoscópica',       descripcion: 'Extirpación de riñón por vía laparoscópica',               duracionPromedioMin: 150 },
    { nombre: 'Histerectomía abdominal',         descripcion: 'Extirpación del útero por vía abdominal',                  duracionPromedioMin: 100 },
    { nombre: 'Tiroidectomía total',             descripcion: 'Extirpación total de la glándula tiroides',                duracionPromedioMin: 90  },
    { nombre: 'Amputación de miembro inferior',  descripcion: 'Amputación infracondílea o supracondílea',                 duracionPromedioMin: 120 },
  ]);
  console.log('✅ 10 procedimientos');

  // ── Diagnósticos ─────────────────────────────────────────────────────────────
  const [d1, d2, d3, d4, d5, d6, d7, d8, d9, d10] = await Diagnostico.insertMany([
    { codigo: 'K35.2', nombre: 'Apendicitis aguda con peritonitis',              descripcion: 'Inflamación aguda del apéndice con peritonitis generalizada' },
    { codigo: 'K80.0', nombre: 'Colelitiasis con colecistitis aguda',            descripcion: 'Cálculos en la vesícula biliar con inflamación aguda' },
    { codigo: 'K40.9', nombre: 'Hernia inguinal unilateral',                     descripcion: 'Hernia inguinal unilateral o no especificada sin obstrucción' },
    { codigo: 'M17.1', nombre: 'Gonartrosis primaria bilateral',                 descripcion: 'Artrosis primaria de rodilla, bilateral' },
    { codigo: 'I25.1', nombre: 'Enfermedad aterosclerótica del corazón',         descripcion: 'Enfermedad coronaria aterosclerótica del corazón' },
    { codigo: 'C71.9', nombre: 'Tumor maligno del encéfalo',                     descripcion: 'Neoplasia maligna de encéfalo, no especificada' },
    { codigo: 'C64',   nombre: 'Tumor maligno del riñón',                        descripcion: 'Neoplasia maligna del riñón excepto de la pelvis renal' },
    { codigo: 'D25',   nombre: 'Leiomioma del útero',                            descripcion: 'Tumor benigno muscular del útero' },
    { codigo: 'E04.0', nombre: 'Bocio no tóxico difuso',                         descripcion: 'Bocio simple eutiroideo difuso' },
    { codigo: 'E11.5', nombre: 'Diabetes tipo 2 con complicaciones circulatorias', descripcion: 'Diabetes mellitus tipo 2 con complicaciones de la circulación periférica' },
  ]);
  console.log('✅ 10 diagnósticos');

  // ── Insumos ──────────────────────────────────────────────────────────────────
  const [i1, i2, i3, i4, i5, i6, i7, i8, i9, i10] = await Insumo.insertMany([
    { nombre: 'Guantes quirúrgicos estériles (par)', descripcion: 'Guantes de látex estériles talla 7.5' },
    { nombre: 'Bisturí desechable Nro. 10',          descripcion: 'Bisturí de hoja de acero inoxidable' },
    { nombre: 'Gasa estéril 10x10 cm',               descripcion: 'Gasa tejida de algodón, estéril' },
    { nombre: 'Sutura Vicryl 3-0',                   descripcion: 'Sutura absorbible trenzada poliglactina 910' },
    { nombre: 'Sutura Nylon 2-0',                    descripcion: 'Sutura no absorbible monofilamento' },
    { nombre: 'Malla de polipropileno',               descripcion: 'Malla sintética para reparación de hernias' },
    { nombre: 'Drenaje Jackson-Pratt',                descripcion: 'Sistema de drenaje activo de silicona' },
    { nombre: 'Catéter urinario 16 Fr',               descripcion: 'Sonda Foley de látex siliconado' },
    { nombre: 'Electrobisturí monopolar',             descripcion: 'Electrodo desechable para electrocauterio' },
    { nombre: 'Compresas abdominales',                descripcion: 'Compresas quirúrgicas con marcador radiopaco' },
  ]);
  console.log('✅ 10 insumos');

  // ── Casos (sin plan todavía) ──────────────────────────────────────────────────
  const casos = await Caso.insertMany([
    { tipo: 'electivo',   prioridad: 'alta',  estado: 'pendiente',   paciente: p1._id, especialistaPrincipal: e1._id, equipoQuirurgico: [e6._id],        diagnostico: d2._id,  procedimiento: pr2._id,  duracionEstimadaMin: 80,  observaciones: 'Paciente con historial de diabetes, requiere evaluación preoperatoria.' },
    { tipo: 'electivo',   prioridad: 'media', estado: 'pendiente',   paciente: p3._id, especialistaPrincipal: e4._id, equipoQuirurgico: [],              diagnostico: d3._id,  procedimiento: pr3._id,  duracionEstimadaMin: 90,  observaciones: 'Primera cirugía programada de hernia.' },
    { tipo: 'electivo',   prioridad: 'baja',  estado: 'aprobada',    paciente: p5._id, especialistaPrincipal: e6._id, equipoQuirurgico: [e1._id],        diagnostico: d8._id,  procedimiento: pr8._id,  duracionEstimadaMin: 110, observaciones: '' },
    { tipo: 'electivo',   prioridad: 'alta',  estado: 'programada',  paciente: p2._id, especialistaPrincipal: e2._id, equipoQuirurgico: [e1._id, e5._id], diagnostico: d5._id, procedimiento: pr5._id,  duracionEstimadaMin: 240, observaciones: 'Requiere UCI postoperatoria reservada.' },
    { tipo: 'electivo',   prioridad: 'media', estado: 'programada',  paciente: p7._id, especialistaPrincipal: e4._id, equipoQuirurgico: [],              diagnostico: d4._id,  procedimiento: pr4._id,  duracionEstimadaMin: 120, observaciones: 'Paciente con prótesis dental, notificar a anestesiología.' },
    { tipo: 'electivo',   prioridad: 'alta',  estado: 'en_admision', paciente: p6._id, especialistaPrincipal: e3._id, equipoQuirurgico: [e1._id],        diagnostico: d6._id,  procedimiento: pr6._id,  duracionEstimadaMin: 200, observaciones: 'Paciente con hipertensión controlada.' },
    { tipo: 'electivo',   prioridad: 'media', estado: 'en_curso',    paciente: p4._id, especialistaPrincipal: e5._id, equipoQuirurgico: [],              diagnostico: d7._id,  procedimiento: pr7._id,  duracionEstimadaMin: 150, observaciones: '' },
    { tipo: 'electivo',   prioridad: 'baja',  estado: 'finalizado',  paciente: p8._id, especialistaPrincipal: e1._id, equipoQuirurgico: [],              diagnostico: d3._id,  procedimiento: pr3._id,  duracionEstimadaMin: 90,  observaciones: 'Sin complicaciones.' },
    { tipo: 'electivo',   prioridad: 'baja',  estado: 'rechazada',   paciente: p1._id, especialistaPrincipal: e6._id, equipoQuirurgico: [],              diagnostico: d9._id,  procedimiento: pr9._id,  duracionEstimadaMin: 90,  observaciones: 'Rechazada por falta de documentación.' },
    { tipo: 'electivo',   prioridad: 'media', estado: 'cancelado',   paciente: p2._id, especialistaPrincipal: e1._id, equipoQuirurgico: [],              diagnostico: d1._id,  procedimiento: pr1._id,  duracionEstimadaMin: 60,  observaciones: 'Cancelado por solicitud del paciente.' },
    { tipo: 'emergencia', prioridad: 'alta',  estado: 'en_admision', paciente: p3._id, especialistaPrincipal: e1._id, equipoQuirurgico: [e5._id],        diagnostico: d1._id,  procedimiento: pr1._id,  duracionEstimadaMin: 60,  observaciones: 'Ingresó con dolor abdominal agudo en FID, cuadro compatible con apendicitis perforada.', fechaIngresoEmergencia: new Date('2026-05-21T03:15:00Z'), motivoEmergencia: 'Apendicitis perforada' },
    { tipo: 'emergencia', prioridad: 'alta',  estado: 'en_curso',    paciente: p6._id, especialistaPrincipal: e2._id, equipoQuirurgico: [e3._id],        diagnostico: d5._id,  procedimiento: pr5._id,  duracionEstimadaMin: 240, observaciones: 'IAM con compromiso hemodinámico. Requiere revascularización urgente.',                    fechaIngresoEmergencia: new Date('2026-05-21T05:40:00Z'), motivoEmergencia: 'Infarto agudo de miocardio' },
    { tipo: 'emergencia', prioridad: 'alta',  estado: 'finalizado',  paciente: p8._id, especialistaPrincipal: e3._id, equipoQuirurgico: [],              diagnostico: d6._id,  procedimiento: pr6._id,  duracionEstimadaMin: 180, observaciones: 'TCE severo, hematoma epidural.',                                                             fechaIngresoEmergencia: new Date('2026-05-18T22:10:00Z'), motivoEmergencia: 'Traumatismo craneoencefálico' },
  ]);
  const [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13] = casos;
  console.log(`✅ ${casos.length} casos`);

  // ── Planes y actualización de casos ─────────────────────────────────────────
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const planesData = [
    { fecha: tomorrow,          horaInicio: '07:00', horaFinEstimada: '11:00', quirofano: q1._id, caso: c4._id },
    { fecha: tomorrow,          horaInicio: '08:00', horaFinEstimada: '10:00', quirofano: q2._id, caso: c5._id },
    { fecha: today,             horaInicio: '08:00', horaFinEstimada: '11:30', quirofano: q3._id, caso: c6._id },
    { fecha: today,             horaInicio: '07:30', horaFinEstimada: '10:00', quirofano: q2._id, caso: c7._id },
    { fecha: today,             horaInicio: '09:00', horaFinEstimada: '10:30', quirofano: q1._id, caso: c8._id },
    { fecha: today,             horaInicio: '04:00', horaFinEstimada: '05:00', quirofano: q4._id, caso: c11._id },
    { fecha: today,             horaInicio: '06:30', horaFinEstimada: '10:30', quirofano: q4._id, caso: c12._id },
    { fecha: today,             horaInicio: '23:00', horaFinEstimada: '02:00', quirofano: q4._id, caso: c13._id },
  ];

  const planes = await Plan.insertMany(planesData);
  const [pl1, pl2, pl3, pl4, pl5, pl6, pl7, pl8] = planes;

  await Promise.all([
    Caso.findByIdAndUpdate(c4._id,  { plan: pl1._id }),
    Caso.findByIdAndUpdate(c5._id,  { plan: pl2._id }),
    Caso.findByIdAndUpdate(c6._id,  { plan: pl3._id }),
    Caso.findByIdAndUpdate(c7._id,  { plan: pl4._id }),
    Caso.findByIdAndUpdate(c8._id,  { plan: pl5._id }),
    Caso.findByIdAndUpdate(c11._id, { plan: pl6._id }),
    Caso.findByIdAndUpdate(c12._id, { plan: pl7._id }),
    Caso.findByIdAndUpdate(c13._id, { plan: pl8._id }),
  ]);
  console.log(`✅ ${planes.length} planes`);

  // ── Admisiones ───────────────────────────────────────────────────────────────
  await Admision.insertMany([
    {
      caso: c6._id,
      fechaHoraIngreso: new Date('2026-05-21T07:00:00Z'),
      responsable: 'Enf. Rosa Jiménez',
      verificacionDocumentos: { identificacion: true, consentimientoFirmado: true, ordenMedica: true },
      signosVitales: { presionArterial: '130/85', frecuenciaCardiaca: 78, temperatura: 36.5, saturacionOxigeno: 97 },
      checklist: [
        { item: 'Ayuno de 8 horas', cumplido: true },
        { item: 'Área quirúrgica preparada', cumplido: true },
        { item: 'Medicación preoperatoria administrada', cumplido: false },
      ],
      insumosUtilizados: [{ insumo: i1._id, cantidad: 2 }, { insumo: i3._id, cantidad: 5 }],
      observaciones: 'Paciente ansioso, se solicitó valoración de anestesiología.',
    },
    {
      caso: c11._id,
      fechaHoraIngreso: new Date('2026-05-21T03:30:00Z'),
      responsable: 'Enf. Pedro Acosta',
      verificacionDocumentos: { identificacion: true, consentimientoFirmado: false, ordenMedica: true },
      signosVitales: { presionArterial: '100/65', frecuenciaCardiaca: 112, temperatura: 38.2, saturacionOxigeno: 95 },
      checklist: [
        { item: 'Vía periférica colocada', cumplido: true },
        { item: 'Exámenes de laboratorio', cumplido: true },
        { item: 'Consentimiento informado', cumplido: false },
      ],
      insumosUtilizados: [{ insumo: i1._id, cantidad: 2 }, { insumo: i9._id, cantidad: 1 }],
      observaciones: 'Emergencia. Familiar firmará consentimiento.',
    },
  ]);
  console.log('✅ 2 admisiones');

  // ── Usuarios ─────────────────────────────────────────────────────────────────
  const PASS = (p) => bcrypt.hashSync(p, 10);
  await User.insertMany([
    { nombre: 'Admin Principal',      username: 'admin',        password: PASS('admin123'), rol: 'administrador', especialistaId: null,     activo: true },
    { nombre: 'Dr. Andrés Montoya',   username: 'dr.montoya',   password: PASS('pass123'),  rol: 'especialista',  especialistaId: e1._id,   activo: true },
    { nombre: 'Dra. Carmen Solís',    username: 'dr.solis',     password: PASS('pass123'),  rol: 'especialista',  especialistaId: e2._id,   activo: true },
    { nombre: 'Dr. Felipe Rojas',     username: 'dr.rojas',     password: PASS('pass123'),  rol: 'especialista',  especialistaId: e3._id,   activo: true },
    { nombre: 'Dra. Valentina Cruz',  username: 'dr.cruz',      password: PASS('pass123'),  rol: 'especialista',  especialistaId: e4._id,   activo: true },
    { nombre: 'Dr. Hernán Palacios',  username: 'dr.palacios',  password: PASS('pass123'),  rol: 'especialista',  especialistaId: e5._id,   activo: true },
    { nombre: 'Dra. Isabel Vargas',   username: 'dr.vargas',    password: PASS('pass123'),  rol: 'especialista',  especialistaId: e6._id,   activo: true },
    { nombre: 'Enf. Rosa Jiménez',    username: 'admision1',    password: PASS('pass123'),  rol: 'admision',      especialistaId: null,     activo: true },
    { nombre: 'Enf. Pedro Acosta',    username: 'admision2',    password: PASS('pass123'),  rol: 'admision',      especialistaId: null,     activo: true },
  ]);
  console.log('✅ 9 usuarios');

  console.log('\n🎉 Seed completado exitosamente');
  console.log('──────────────────────────────────────────');
  console.log('  admin      / admin123');
  console.log('  dr.montoya / pass123');
  console.log('  dr.solis   / pass123');
  console.log('  admision1  / pass123');
  console.log('──────────────────────────────────────────');

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('❌ Error en seed:', err.message);
  process.exit(1);
});
