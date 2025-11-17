import { kv } from '@vercel/kv';

const TIMEOUT = 5 * 60 * 1000; // 5 минут

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Cache-Control', 'no-cache');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { userId, username } = req.query;
  
  if (!userId || userId === 'nil') {
    return res.status(400).json({ 
      error: 'Valid userId required',
      success: false 
    });
  }
  
  try {
    const now = Date.now();
    
    // Сохраняем пользователя с TTL 5 минут
    await kv.set(`user:${userId}`, {
      username: username || 'Unknown',
      lastSeen: now
    }, { ex: 300 }); // 300 секунд = 5 минут
    
    // Добавляем в Set всех пользователей
    await kv.sadd('all_users', userId);
    
    // Получаем всех активных пользователей
    const allUserKeys = await kv.keys('user:*');
    const onlineCount = allUserKeys.length;
    const totalCount = await kv.scard('all_users');
    
    console.log(`[Heartbeat] User ${userId} online. Total: ${onlineCount}`);
    
    res.status(200).json({
      success: true,
      online_users: onlineCount,
      total_users: totalCount,
      message: 'Heartbeat received',
      timestamp: now
    });
  } catch (error) {
    console.error('Heartbeat error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}
