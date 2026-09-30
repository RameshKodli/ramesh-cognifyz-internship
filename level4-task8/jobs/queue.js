/**
 * Simple in-memory background job queue.
 *
 * NOTE: For production you'd swap this for Redis + Bull/BullMQ so jobs
 * survive restarts and can be processed by separate worker processes:
 *
 *   const { Queue, Worker } = require('bullmq');
 *   const jobQueue = new Queue('tasks', { connection: { host: '127.0.0.1', port: 6379 } });
 *   new Worker('tasks', async job => { ... }, { connection: { host: '127.0.0.1', port: 6379 } });
 *
 * This lightweight version demonstrates the same concept (enqueue now,
 * process asynchronously in the background) without external dependencies.
 */

const jobs = [];
let jobIdCounter = 1;

function enqueueJob(type, payload) {
  const job = {
    id: jobIdCounter++,
    type,
    payload,
    status: 'queued',
    createdAt: new Date().toISOString(),
    result: null
  };
  jobs.push(job);
  return job;
}

function getJob(id) {
  return jobs.find(j => j.id === Number(id));
}

function getAllJobs() {
  return jobs;
}

// Background worker: processes one queued job per tick
async function processJob(job) {
  job.status = 'processing';

  // Simulate work (e.g., sending an email, generating a report)
  await new Promise(resolve => setTimeout(resolve, 2000));

  switch (job.type) {
    case 'send-email':
      job.result = `Email sent to ${job.payload.to}`;
      break;
    case 'generate-report':
      job.result = `Report generated with ${job.payload.rows || 0} rows`;
      break;
    default:
      job.result = 'Unknown job type processed';
  }

  job.status = 'completed';
  job.completedAt = new Date().toISOString();
  console.log(`[worker] Job #${job.id} (${job.type}) completed.`);
}

// Simple polling worker loop
function startWorker() {
  setInterval(() => {
    const nextJob = jobs.find(j => j.status === 'queued');
    if (nextJob) {
      processJob(nextJob);
    }
  }, 1000);
}

module.exports = { enqueueJob, getJob, getAllJobs, startWorker };
