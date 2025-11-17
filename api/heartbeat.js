// Глобальное хранилище (работает в пределах одного инстанса)
const onlineUsers = new Map();
const allUsers = new Set();

function cleanupUsers() {
  const now = Date.now();
  const TIMEOUT = 5 * 60 * 1000;
  
  for (const [userId, lastSeen] of onlineUsers.entries()) {
    if (now - lastSeen > TIMEOUT) {
      onlineUsers.delete(userId);
    }
  }
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Cache-Control', 'no-cache');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { userId, username } = req.query;
  
  if (!userId) {
    return res.status(400).json({ 
      error: 'userId required',
      success: false 
    });
  }
  
  cleanupUsers();
  
  // Регистрируем пользователя
  onlineUsers.set(userId, Date.now());
  allUsers.add(userId);
  
  console.log(`[Heartbeat] User ${userId} (${username || 'Unknown'}) online. Total: ${onlineUsers.size}`);
  
  res.status(200).json({
    success: true,
    online_users: onlineUsers.size,
    total_users: allUsers.size,
    message: 'Heartbeat received',
    timestamp: Date.now()
  });
}
