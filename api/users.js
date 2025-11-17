import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const userKeys = await kv.keys('user:*');
    const users = [];
    
    for (const key of userKeys) {
      const userData = await kv.get(key);
      if (userData) {
        users.push({
          id: key.replace('user:', ''),
          username: userData.username,
          lastSeen: userData.lastSeen,
          online: true
        });
      }
    }
    
    res.status(200).json({
      users: users,
      count: users.length
    });
  } catch (error) {
    console.error('[Users] Error:', error);
    res.status(500).json({
      users: [],
      count: 0,
      error: error.message
    });
  }
}
