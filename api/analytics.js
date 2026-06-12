// api/analytics.js - Real-time Analytics Synchronizer (Serverless Function)

// Ephemeral in-memory database for real-time synchronization
// Note: In serverless environments, these variables will persist as long as the instance stays warm.
let globalVisits = [];
let globalClicks = [];
let globalActiveUsers = {};

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const now = Date.now();

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
      if (type === 'pageview') {
        // payload = { sessionId, path, timestamp, device, name }
        globalVisits.push(payload);
        if (globalVisits.length > 2000) globalVisits.shift(); // Limit size
      } 
      else if (type === 'heartbeat') {
        // payload = { sessionId, path, name, device }
        globalActiveUsers[payload.sessionId] = {
          path: payload.path,
          name: payload.name,
          device: payload.device,
          lastActive: now
        };
      } 
      else if (type === 'click') {
        // payload = { path, x, y, target, id, class, text, timestamp }
        globalClicks.push(payload);
        if (globalClicks.length > 5000) globalClicks.shift(); // Limit size
      }

      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
