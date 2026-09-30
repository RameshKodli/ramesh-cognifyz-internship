/**
 * Task 7: Advanced API Usage and External API Integration
 * - OAuth-style client-credentials token issuing (simplified demo)
 * - Integrates a real external API (GitHub public API) into the app
 * - Rate limiting on API routes
 * - Centralized error handling
 */
require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const fetch = require('node-fetch');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3007;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/* ---------------------------------------------------------
   1. Simplified OAuth2 "client credentials" grant simulation
   In production you'd redirect to a real provider (GitHub,
   Google, etc). Here we issue our own short-lived tokens to
   demonstrate the concept end-to-end.
--------------------------------------------------------- */
const issuedTokens = new Map(); // token -> expiry timestamp

app.post('/oauth/token', (req, res, next) => {
  try {
    const { client_id, client_secret, grant_type } = req.body;

    if (grant_type !== 'client_credentials') {
      return res.status(400).json({ error: 'unsupported_grant_type' });
    }
    if (client_id !== process.env.OAUTH_CLIENT_ID || client_secret !== process.env.OAUTH_CLIENT_SECRET) {
      return res.status(401).json({ error: 'invalid_client' });
    }

    const token = crypto.randomBytes(24).toString('hex');
    const expiresInSeconds = 3600;
    issuedTokens.set(token, Date.now() + expiresInSeconds * 1000);

    res.json({ access_token: token, token_type: 'Bearer', expires_in: expiresInSeconds });
  } catch (err) {
    next(err);
  }
});

function requireOAuthToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing bearer token. Call /oauth/token first.' });
  }
  const token = authHeader.split(' ')[1];
  const expiry = issuedTokens.get(token);
  if (!expiry || expiry < Date.now()) {
    return res.status(401).json({ error: 'Token invalid or expired.' });
  }
  next();
}

/* ---------------------------------------------------------
   2. Rate limiting for the external-API-backed routes
--------------------------------------------------------- */
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,             // 10 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again in a minute.' }
});

/* ---------------------------------------------------------
   3. External API integration (GitHub public API)
--------------------------------------------------------- */
app.get('/api/github/:username', requireOAuthToken, apiLimiter, async (req, res, next) => {
  try {
    const { username } = req.params;
    const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
      headers: { 'User-Agent': 'cognifyz-task7-demo' }
    });

    if (!response.ok) {
      const error = new Error(`GitHub API returned ${response.status}`);
      error.status = response.status === 404 ? 404 : 502;
      throw error;
    }

    const data = await response.json();
    res.json({
      login: data.login,
      name: data.name,
      publicRepos: data.public_repos,
      followers: data.followers,
      avatarUrl: data.avatar_url,
      profileUrl: data.html_url
    });
  } catch (err) {
    next(err); // hand off to centralized error handler
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* ---------------------------------------------------------
   4. Centralized error-handling middleware
--------------------------------------------------------- */
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`Task 7 server running at http://localhost:${PORT}`);
  console.log('Get a token: POST /oauth/token with client_id/client_secret from .env');
});
