/**
 * Simple in-memory server-side cache with TTL.
 * For production/multi-instance deployments, swap the Map for Redis.
 */
const store = new Map(); // key -> { value, expiresAt }

function cacheMiddleware(ttlMs = 10000) {
  return (req, res, next) => {
    const key = req.originalUrl;
    const cached = store.get(key);

    if (cached && cached.expiresAt > Date.now()) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cached.value);
    }

    // Monkey-patch res.json to capture the response and cache it
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      store.set(key, { value: body, expiresAt: Date.now() + ttlMs });
      res.setHeader('X-Cache', 'MISS');
      return originalJson(body);
    };

    next();
  };
}

function clearCache() {
  store.clear();
}

module.exports = { cacheMiddleware, clearCache };
