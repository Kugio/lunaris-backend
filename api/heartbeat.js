let onlineUsers = new Map();

export default function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { userId, username } = req.query;
  
  if (!userId) {
    return res.status(400).json({ error: 'userId required' });
  }
  
  // Очистка старых пользователей
  const now = Date.now();
  for (const [id, lastSeen] of onlineUsers.entries()) {
    if (now - lastSeen > 5 * 60 * 1000) {
      onlineUsers.delete(id);
    }
  }
  
  // Регистрируем пользователя
  onlineUsers.set(userId, now);
  
  res.status(200).json({
    success: true,
    online_users: onlineUsers.size,
    message: 'Heartbeat received'
  });
}
