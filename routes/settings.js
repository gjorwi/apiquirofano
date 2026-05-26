const router = require('express').Router();
const Setting = require('../models/Setting');

const getOrCreate = async () => {
  let s = await Setting.findOne().lean();
  if (!s) s = await Setting.create({});
  return s;
};

router.get('/', async (req, res) => {
  try { res.json(await getOrCreate()); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

router.patch('/', async (req, res) => {
  try {
    const updated = await Setting.findOneAndUpdate(
      {},
      { $set: req.body },
      { new: true, upsert: true, lean: true }
    );
    res.json(updated);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
