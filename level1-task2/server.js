/**
 * Task 2: Inline Styles, Basic Interaction, and Server-Side Validation
 * - More complex form with inline JS client-side validation
 * - Server-side validation for submitted data
 * - Temporary server-side storage (in-memory)
 */

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Temporary server-side storage
const tempStorage = [];

function validateSignup({ username, email, age, password }) {
  const errors = [];

  if (!username || username.trim().length < 3) {
    errors.push('Username must be at least 3 characters long.');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('A valid email address is required.');
  }
  const ageNum = Number(age);
  if (!age || isNaN(ageNum) || ageNum < 13 || ageNum > 120) {
    errors.push('Age must be a number between 13 and 120.');
  }
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long.');
  }

  return errors;
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Server-side validation endpoint
app.post('/api/signup', (req, res) => {
  const errors = validateSignup(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const { username, email, age } = req.body;
  const record = {
    id: tempStorage.length + 1,
    username,
    email,
    age,
    createdAt: new Date().toISOString()
  };

  tempStorage.push(record); // store validated data temporarily

  res.status(200).json({ success: true, message: 'Signup validated and stored.', data: record });
});

app.get('/api/records', (req, res) => {
  res.json(tempStorage);
});

app.listen(PORT, () => {
  console.log(`Task 2 server running at http://localhost:${PORT}`);
});
