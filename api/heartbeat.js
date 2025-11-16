// Временное хранилище (в продакшене используй Vercel KV)
let onlineUsers = new Map();
let totalUsersList = new Set();

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
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { userId, username } = req.query;
  
  if (!userId) {
    return res.status(400).json({ error: 'userId required' });
  }
  
  // Обновляем статус пользователя
  cleanupUsers();
  onlineUsers.set(userId, Date.now());
  totalUsersList.add(userId);
  
  // Логирование (опционально)
  console.log(`User ${userId} (${username || 'unknown'}) is online`);
  
  res.status(200).json({
    success: true,
    online_users: onlineUsers.size,
    total_users: totalUsersList.size,
    message: 'Heartbeat received'
  });
}
