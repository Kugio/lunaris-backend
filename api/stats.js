// Используем Vercel Edge Config или простой подход с временным хранилищем
const stats = {
  lastUpdate: Date.now(),
  users: new Map()
};

// Очистка старых пользователей
function cleanupUsers() {
  const now = Date.now();
  const TIMEOUT = 5 * 60 * 1000; // 5 минут
  
  for (const [userId, data] of stats.users.entries()) {
    if (now - data.lastSeen > TIMEOUT) {
      stats.users.delete(userId);
    }
  }
}

export default function handler(req, res) {
  cleanupUsers();
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const onlineCount = stats.users.size;
  
  res.status(200).json({
    status: 'online',
    online_users: onlineCount,
    total_users: Math.max(500, onlineCount * 10), // Симуляция общего количества
    last_update: Date.now(),
    timestamp: new Date().toISOString()
  });
}
