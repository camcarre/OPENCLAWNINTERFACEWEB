import https from 'https';

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
  const searchParams = new URLSearchParams();
  Object.keys(restQuery).forEach(key => {
    const value = restQuery[key];
    if (Array.isArray(value)) {
      value.forEach(v => searchParams.append(key, v));
    } else {
      searchParams.append(key, value);
    }
  });
  const queryString = searchParams.toString();
  const targetPath = (originalPath ? `/${originalPath}` : '/') + (queryString ? `?${queryString}` : '');

  // Log request for debugging
  console.log(`[Proxy] Requesting: https://76.13.32.171.sslip.io${targetPath}`);
  console.log(`[Proxy] Method: ${req.method}`);
  console.log(`[Proxy] Headers (Client):`, JSON.stringify(req.headers));

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
    rejectUnauthorized: false,
    timeout: 50000 // 50 seconds timeout
  };

  // Add Content-Length if body exists
  if (req.body) {
    const bodyString = JSON.stringify(req.body);
    options.headers['Content-Length'] = Buffer.byteLength(bodyString);
    console.log(`[Proxy] Body (Snippet):`, bodyString.substring(0, 200));
  }

  const proxyReq = https.request(options, (proxyRes) => {
      console.log(`[Proxy] Response Status: ${proxyRes.statusCode}`);
      console.log(`[Proxy] Response Headers:`, JSON.stringify(proxyRes.headers));
      
      res.status(proxyRes.statusCode || 500);
      // Copy headers from proxy response
      Object.keys(proxyRes.headers).forEach(key => {
        if (proxyRes.headers[key]) {
          res.setHeader(key, proxyRes.headers[key]);
        }
      });
      
      // Log response body snippet and pipe manually
      let bodySnippet = '';
      proxyRes.on('data', (chunk) => {
        if (bodySnippet.length < 500) {
          bodySnippet += chunk.toString();
        }
        res.write(chunk);
      });
      
      proxyRes.on('end', () => {
         console.log(`[Proxy] Response Body (Snippet):`, bodySnippet.substring(0, 500));
         res.end();
      });
    });

  proxyReq.on('timeout', () => {
    console.error('[Proxy] Request timed out');
    proxyReq.destroy();
    res.status(504).json({ error: 'Gateway Timeout', details: 'Upstream server took too long to respond' });
  });

  proxyReq.on('error', (e) => {
    console.error('[Proxy] Error:', e.message);
    if (!res.headersSent) {
      res.status(502).json({ error: 'Bad Gateway', details: e.message });
    }
  });

  if (req.body) {
    proxyReq.write(JSON.stringify(req.body));
  }
  proxyReq.end();
}
