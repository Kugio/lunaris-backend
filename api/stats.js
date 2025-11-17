import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'no-cache');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // Получаем всех активных пользователей
    const allUserKeys = await kv.keys('user:*');
    const onlineCount = allUserKeys.length;
    const totalCount = await kv.scard('all_users');
    
    res.status(200).json({
      status: 'online',
      online_users: onlineCount,
      total_users: totalCount || 500,
      last_update: Date.now(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      status: 'error',
      online_users: 0,
      total_users: 0
    });
  }
}
