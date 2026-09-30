/**
 * Task 8: Advanced Server-Side Functionality
 * - Middleware for request processing (body parsing + custom logging)
 * - Background job processing (in-memory queue/worker; notes on Redis/Bull)
 * - Server-side caching for optimized performance
 */
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const requestLogger = require('./middleware/requestLogger');
const { enqueueJob, getJob, getAllJobs, startWorker } = require('./jobs/queue');
const { cacheMiddleware, clearCache } = require('./cache/cache');

const app = express();
const PORT = process.env.PORT || 3008;

// ---- Middleware ----
app.use(express.json());               // body parsing
app.use(morgan('dev'));                 // request logging (library)
app.use(requestLogger);                 // custom request logging middleware
app.use(express.static(path.join(__dirname, 'public')));

// ---- Background job endpoints ----
app.post('/api/jobs', (req, res) => {
  const { type, payload } = req.body;
  if (!type) return res.status(400).json({ error: 'Job "type" is required.' });

  const job = enqueueJob(type, payload || {});
  res.status(202).json({ message: 'Job queued.', job });
});

app.get('/api/jobs/:id', (req, res) => {
  const job = getJob(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found.' });
  res.json(job);
});

app.get('/api/jobs', (req, res) => {
  res.json(getAllJobs());
});

// ---- Cached endpoint (simulates an expensive computation) ----
app.get('/api/expensive-data', cacheMiddleware(10000), async (req, res) => {
  // Simulate a slow operation (e.g., heavy DB aggregation)
  await new Promise(resolve => setTimeout(resolve, 1500));
  res.json({
    generatedAt: new Date().toISOString(),
    data: Array.from({ length: 5 }, (_, i) => ({ id: i + 1, value: Math.random() }))
  });
});

app.post('/api/cache/clear', (req, res) => {
  clearCache();
  res.json({ message: 'Cache cleared.' });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the background worker loop
startWorker();

app.listen(PORT, () => {
  console.log(`Task 8 server running at http://localhost:${PORT}`);
});
