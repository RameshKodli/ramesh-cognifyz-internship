/**
 * Task 6: Database Integration and User Authentication
 * - MongoDB via Mongoose
 * - JWT-based authentication (register/login)
 * - Protected CRUD endpoints (only owner can see/delete their items)
 *
 * Setup:
 *   1. cp .env.example .env   (then fill in MONGODB_URI and JWT_SECRET)
 *   2. npm install
 *   3. npm start
 */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');

const app = express();
const PORT = process.env.PORT || 3006;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Task 6 server running at http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
