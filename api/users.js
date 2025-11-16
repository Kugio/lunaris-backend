let onlineUsers = new Map();

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const usersList = Array.from(onlineUsers.entries()).map(([id, lastSeen]) => ({
    id,
    lastSeen: new Date(lastSeen).toISOString(),
    online: Date.now() - lastSeen < 5 * 60 * 1000
  }));
  
  res.status(200).json({
    users: usersList,
    count: usersList.length
  });
}
