const express = require('express');
const Item = require('../models/Item');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// All routes below require a valid JWT
router.use(requireAuth);

// Create item owned by the logged-in user
router.post('/', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required.' });

    const item = await Item.create({ title, owner: req.userId });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get only the logged-in user's items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find({ owner: req.userId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an item, only if it belongs to the requester
router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!item) return res.status(404).json({ error: 'Item not found or not authorized.' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
