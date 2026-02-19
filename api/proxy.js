import https from 'https';

export default function handler(req, res) {
  // CORS Setup
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Configuration de la requête vers le VPS (Caddy)
  const options = {
    hostname: '76.13.32.171.sslip.io',
    port: 443,
    path: '/api/message',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': req.headers['authorization'] || 'Bearer rfmvVk9cmyQ7YcxbIE8lnlhBF5MoIwyL',
      'Content-Length': Buffer.byteLength(JSON.stringify(req.body))
    },
    // CRITIQUE : On ignore l'erreur de certificat auto-signé
    rejectUnauthorized: false
  };

  const proxyReq = https.request(options, (proxyRes) => {
    res.status(proxyRes.statusCode);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (e) => {
    console.error('Proxy Error:', e);
    res.status(500).json({ error: 'Proxy connection failed', details: e.message });
  });

  proxyReq.write(JSON.stringify(req.body));
  proxyReq.end();
}
