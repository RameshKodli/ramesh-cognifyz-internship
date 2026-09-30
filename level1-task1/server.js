/**
 * Task 1: HTML Structure and Basic Server Interaction
 * - HTML form for user input
 * - Simple Node.js/Express server
 * - Server-side endpoint to handle form submission
 * - Server-side rendering with EJS
 */

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// In-memory store for submitted entries (demonstration only)
const submissions = [];

// GET / -> render the form
app.get('/', (req, res) => {
  res.render('index', { submitted: null });
});

// POST /submit -> handle form submission and render result via EJS
app.post('/submit', (req, res) => {
  const { name, email, message } = req.body;

  const entry = {
    id: submissions.length + 1,
    name,
    email,
    message,
    submittedAt: new Date().toLocaleString()
  };

  submissions.push(entry);

  // Server-side render the confirmation using the submitted data
  res.render('index', { submitted: entry });
});

// GET /submissions -> list all submissions (server-rendered)
app.get('/submissions', (req, res) => {
  res.render('submissions', { submissions });
});

app.listen(PORT, () => {
  console.log(`Task 1 server running at http://localhost:${PORT}`);
});
