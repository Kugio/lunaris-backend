export default function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Возвращаем статистику
  res.status(200).json({
    status: 'online',
    online_users: Math.floor(Math.random() * 50) + 30,
    total_users: 500,
    last_update: Date.now()
  });
}
