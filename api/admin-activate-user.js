import { activateUserCourse } from './_activation-helper.js';

export default async function handler(req, res) {
  // CORS
  const origin  = req.headers.origin || req.headers.referer || '';
  const allowed = process.env.VITE_SITE_URL || '';
  res.setHeader('Access-Control-Allow-Origin', (allowed && origin.startsWith(allowed)) ? origin : '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Admin auth
  const authHeader = req.headers['authorization'] || '';
  const adminPass  = process.env.ADMIN_PASS || process.env.VITE_ADMIN_PASS || '';
  if (!adminPass || authHeader !== `Bearer ${adminPass}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { email, name, phone, courses: requestedCourses } = req.body || {};
  if (!email) return res.status(400).json({ error: 'email is required' });

  // If caller specifies course IDs, only activate those; otherwise activate both
  const coursesToActivate = (Array.isArray(requestedCourses) && requestedCourses.length)
    ? requestedCourses
    : ['mat-ma-21', 'kegel'];

  try {
    const results = [];
    for (const courseId of coursesToActivate) {
      const result = await activateUserCourse({
        email,
        name,
        phone,
        courseId,
        source: 'admin_panel',
      });
      results.push(result);
    }

    return res.status(200).json({
      success: true,
      email,
      courses: coursesToActivate,
      message: `Đã kích hoạt ${coursesToActivate.length} khóa học cho ${email}`,
    });

  } catch (err) {
    console.error('[admin-activate-user] Error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
