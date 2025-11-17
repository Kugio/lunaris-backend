import { Redis } from '@upstash/redis';

// Upstash Redis клиент (использует переменные окружения автоматически)
const redis = Redis.fromEnv();

const TIMEOUT = 300; // 5 минут в секундах

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'no-cache');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { userId, username } = req.query;
  
  if (!userId || userId === 'nil' || userId === 'undefined') {
    return res.status(400).json({ 
      error: 'Valid userId required',
      success: false 
    });
  }
  
  try {
    const now = Date.now();
    
    // Сохраняем пользователя с TTL 5 минут
    await redis.setex(`user:${userId}`, TIMEOUT, JSON.stringify({
      username: username || 'Unknown',
      lastSeen: now
    }));
    
    // Добавляем в set всех пользователей
    await redis.sadd('all_users', userId);
    
    // Получаем количество онлайн
    const userKeys = await redis.keys('user:*');
    const onlineCount = userKeys.length;
    
    // Получаем общее количество
    const totalCount = await redis.scard('all_users');
    
    console.log(`[Heartbeat] User ${userId} online. Online: ${onlineCount}, Total: ${totalCount}`);
    
    res.status(200).json({
      success: true,
      online_users: onlineCount,
      total_users: totalCount,
      message: 'Heartbeat received',
      timestamp: now
    });
  } catch (error) {
    console.error('[Heartbeat] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}
