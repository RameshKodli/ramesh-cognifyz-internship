/**
 * Task 3: Advanced CSS Styling and Responsive Design
 * Simple static server that serves a fully responsive multi-section page
 * built with Bootstrap + custom CSS (transitions/animations).
 */
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Task 3 server running at http://localhost:${PORT}`);
});
