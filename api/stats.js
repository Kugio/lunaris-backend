// Временное хранилище пользователей (обновляется каждые 5 минут)
let onlineUsers = new Map();
let totalUsers = 0;

// Очистка старых пользователей
function cleanupUsers() {
  const now = Date.now();
  const TIMEOUT = 5 * 60 * 1000; // 5 минут
  
  for (const [userId, lastSeen] of onlineUsers.entries()) {
    if (now - lastSeen > TIMEOUT) {
      onlineUsers.delete(userId);
    }
  }
}

export default function handler(req, res) {
  // Очистка старых пользователей
  cleanupUsers();
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Возвращаем статистику
  res.status(200).json({
    status: 'online',
    online_users: onlineUsers.size,
    total_users: Math.max(totalUsers, onlineUsers.size),
    last_update: Date.now()
  });
}
