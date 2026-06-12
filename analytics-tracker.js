// analytics-tracker.js - Visitor & Interaction Tracker for ForMen (Mật Mã 21)

(function() {
  // 1. Initialize session ID
  let sessionId = sessionStorage.getItem('mm21_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 11);
    sessionStorage.setItem('mm21_session_id', sessionId);
  }

  // Get current path (relative to root)
  const path = window.location.pathname || '/';
  
  // Try to retrieve logged-in student name
  let userName = 'Khách viếng thăm';
  try {
    const sessionObj = JSON.parse(localStorage.getItem('thuthach21ngay_user_session'));
    if (sessionObj && sessionObj.name) {
      userName = sessionObj.name;
    }
  } catch (e) {}

  // Get Device Type
  function getDeviceType() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return "Tablet";
    }
    if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
      return "Mobile";
    }
    return "Desktop";
  }

  const device = getDeviceType();

  // Helper: send telemetry data to Serverless sync API
  function sendToServer(type, payload) {
    fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ type, payload })
    }).catch(err => {
      // Silently ignore errors when running locally without Vercel CLI serverless environment
    });
  }

  // 2. Track Page View
  function trackPageView() {
    try {
      const visits = JSON.parse(localStorage.getItem('mm21_analytics_visits') || '[]');
      
      // Limit list size to prevent local storage overflow (max 2000 entries)
      if (visits.length > 2000) {
        visits.shift();
      }
      
      const payload = {
        sessionId,
        path,
        timestamp: Date.now(),
        device,
        name: userName
      };
      
      visits.push(payload);
      localStorage.setItem('mm21_analytics_visits', JSON.stringify(visits));
      
      // Sync to server in real-time
      sendToServer('pageview', payload);
    } catch (e) {
      console.error('[Analytics] Page view tracking failed:', e);
    }
  }

  // 3. Heartbeat for Online Active Users
  function sendHeartbeat() {
    try {
      const activeUsers = JSON.parse(localStorage.getItem('mm21_analytics_active_users') || '{}');
      const now = Date.now();
      
      activeUsers[sessionId] = {
        path,
        name: userName,
        lastActive: now,
        device
      };
      
      // Clean up inactive sessions (older than 1 minute)
      for (const id in activeUsers) {
        if (now - activeUsers[id].lastActive > 60 * 1000) {
          delete activeUsers[id];
        }
      }
      
      localStorage.setItem('mm21_analytics_active_users', JSON.stringify(activeUsers));
      
      // Sync heartbeat to server
      sendToServer('heartbeat', {
        sessionId,
        path,
        name: userName,
        device
      });
    } catch (e) {
      console.error('[Analytics] Heartbeat failed:', e);
    }
  }

  // 4. Click Heatmap Tracking
  function trackClick(e) {
    try {
      // Calculate scroll coordinates relative to full document width & height
      const docWidth = document.documentElement.scrollWidth || document.body.scrollWidth || 1;
      const docHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 1;
      
      // Save coordinate as percentage with 1 decimal place (e.g. 45.2%)
      const xPercent = Math.round((e.pageX / docWidth) * 1000) / 10;
      const yPercent = Math.round((e.pageY / docHeight) * 1000) / 10;
      
      const clicks = JSON.parse(localStorage.getItem('mm21_analytics_clicks') || '[]');
      if (clicks.length > 5000) {
        clicks.shift(); // Avoid storage overflow
      }
      
      // Retrieve text or details about clicked element
      let elementText = '';
      if (e.target.textContent) {
        elementText = e.target.textContent.trim().slice(0, 30);
      }
      
      const payload = {
        path,
        x: xPercent,
        y: yPercent,
        target: e.target.tagName.toLowerCase(),
        id: e.target.id || '',
        class: e.target.className || '',
        text: elementText,
        timestamp: Date.now()
      };
      
      clicks.push(payload);
      localStorage.setItem('mm21_analytics_clicks', JSON.stringify(clicks));
      
      // Sync click to server
      sendToServer('click', payload);
    } catch (err) {
      console.error('[Analytics] Click tracking failed:', err);
    }
  }

  // Execute tracking immediately
  trackPageView();
  sendHeartbeat();
  
  // Heartbeat ping every 10 seconds
  setInterval(sendHeartbeat, 10000);
  
  // Listen for all clicks
  window.addEventListener('click', trackClick);
})();
