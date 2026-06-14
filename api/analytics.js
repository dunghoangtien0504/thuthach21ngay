// api/analytics.js - Real-time Analytics Synchronizer (Serverless Function)

// Ephemeral in-memory database for real-time synchronization
// Note: In serverless environments, these variables will persist as long as the instance stays warm.
let globalVisits = [];
let globalClicks = [];
let globalActiveUsers = {};
const rateLimitMap = {};
const RATE_LIMIT_WINDOW = 10000;
const RATE_LIMIT_MAX = 30;

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const now = Date.now();

  // Basic rate limiting per IP
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (!rateLimitMap[clientIp]) rateLimitMap[clientIp] = [];
  rateLimitMap[clientIp] = rateLimitMap[clientIp].filter(t => now - t < RATE_LIMIT_WINDOW);
  if (rateLimitMap[clientIp].length >= RATE_LIMIT_MAX) {
    return res.status(429).json({ error: 'Too many requests' });
  }
  rateLimitMap[clientIp].push(now);

  // Clean up inactive active users (older than 60 seconds)
  for (const id in globalActiveUsers) {
    if (now - globalActiveUsers[id].lastActive > 60 * 1000) {
      delete globalActiveUsers[id];
    }
  }

  if (req.method === 'GET') {
    // Return all synchronized analytics data
    return res.status(200).json({
      success: true,
      visits: globalVisits,
      clicks: globalClicks,
      activeUsers: globalActiveUsers
    });
  }

  if (req.method === 'POST') {
    const { type, payload } = req.body || {};

    if (!type || !payload) {
      return res.status(400).json({ error: 'Missing type or payload' });
    }

    try {
      if (type === 'pageview' && payload.sessionId && payload.path) {
        globalVisits.push({
          sessionId: String(payload.sessionId).substring(0, 64),
          path: String(payload.path).substring(0, 200),
          timestamp: Number(payload.timestamp) || now,
          device: String(payload.device || '').substring(0, 20),
          name: String(payload.name || '').substring(0, 50),
        });
        if (globalVisits.length > 2000) globalVisits.shift();
      }
      else if (type === 'heartbeat' && payload.sessionId) {
        globalActiveUsers[String(payload.sessionId).substring(0, 64)] = {
          path: String(payload.path || '').substring(0, 200),
          name: String(payload.name || '').substring(0, 50),
          device: String(payload.device || '').substring(0, 20),
          lastActive: now
        };
      }
      else if (type === 'click' && payload.path) {
        globalClicks.push({
          path: String(payload.path).substring(0, 200),
          x: Number(payload.x) || 0,
          y: Number(payload.y) || 0,
          target: String(payload.target || '').substring(0, 100),
          timestamp: Number(payload.timestamp) || now,
        });
        if (globalClicks.length > 5000) globalClicks.shift();
      }

      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
