import https from 'https';
import { URLSearchParams } from 'url';

export default function handler(req, res) {
  // CORS Setup
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Get the target path from query parameter (set by vercel.json rewrite)
  const { originalPath, ...restQuery } = req.query;
  
  // Reconstruct query string excluding originalPath
  const queryString = new URLSearchParams(restQuery).toString();
  const targetPath = (originalPath ? `/${originalPath}` : '/') + (queryString ? `?${queryString}` : '');

  // Configuration de la requête vers le VPS (Caddy)
  const options = {
    hostname: '76.13.32.171.sslip.io',
    port: 443,
    path: targetPath,
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      // Use environment variable for API key, or fallback to hardcoded value
      'Authorization': `Bearer ${process.env.OPENCLAW_API_KEY || 'rfmvVk9cmyQ7YcxbIE8lnlhBF5MoIwyL'}`,
    },
    // CRITIQUE : On ignore l'erreur de certificat auto-signé
    rejectUnauthorized: false
  };

  // Add Content-Length if body exists
  if (req.body) {
    const bodyString = JSON.stringify(req.body);
    options.headers['Content-Length'] = Buffer.byteLength(bodyString);
  }

  const proxyReq = https.request(options, (proxyRes) => {
    res.status(proxyRes.statusCode || 500);
    // Copy headers from proxy response
    Object.keys(proxyRes.headers).forEach(key => {
      if (proxyRes.headers[key]) {
        res.setHeader(key, proxyRes.headers[key]);
      }
    });
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (e) => {
    console.error('Proxy Error:', e);
    res.status(500).json({ error: 'Proxy connection failed', details: e.message });
  });

  if (req.body) {
    proxyReq.write(JSON.stringify(req.body));
  }
  proxyReq.end();
}
