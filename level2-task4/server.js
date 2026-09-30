const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for any route so client-side routing works on refresh
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Task 4 server running at http://localhost:${PORT}`);
});
