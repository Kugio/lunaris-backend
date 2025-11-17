import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'no-cache');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // Получаем всех онлайн пользователей
    const userKeys = await redis.keys('user:*');
    const onlineCount = userKeys.length;
    
    // Получаем общее количество
    const totalCount = await redis.scard('all_users');
    
    res.status(200).json({
      status: 'online',
      online_users: onlineCount,
      total_users: totalCount || 0,
      last_update: Date.now(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Stats] Error:', error);
    res.status(500).json({
      status: 'error',
      online_users: 0,
      total_users: 0
    });
  }
}
