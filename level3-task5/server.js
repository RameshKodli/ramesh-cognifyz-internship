/**
 * Task 5: API Integration and Front-End Interaction
 * RESTful API (in-memory "database") + static front-end that consumes it.
 */
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory "database"
let items = [
  { id: 1, title: 'Learn Node.js', done: false },
  { id: 2, title: 'Build a REST API', done: true }
];
let nextId = 3;

// CREATE
app.post('/api/items', (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required.' });
  }
  const item = { id: nextId++, title: title.trim(), done: false };
  items.push(item);
  res.status(201).json(item);
});

// READ (all)
app.get('/api/items', (req, res) => {
  res.json(items);
});

// READ (one)
app.get('/api/items/:id', (req, res) => {
  const item = items.find(i => i.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Item not found.' });
  res.json(item);
});

// UPDATE
app.put('/api/items/:id', (req, res) => {
  const item = items.find(i => i.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Item not found.' });

  const { title, done } = req.body;
  if (title !== undefined) item.title = title;
  if (done !== undefined) item.done = done;

  res.json(item);
});

// DELETE
app.delete('/api/items/:id', (req, res) => {
  const idx = items.findIndex(i => i.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Item not found.' });

  const removed = items.splice(idx, 1);
  res.json(removed[0]);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Task 5 server running at http://localhost:${PORT}`);
});
