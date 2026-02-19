const WebSocket = require('ws');
const http = require('http');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const WS_PORT = 18790;
const HTTP_PORT = 18791;
const SESSIONS_DIR = '/data/.openclaw/agents/main/sessions';

const wss = new WebSocket.Server({ port: WS_PORT });
console.log(`WebSocket Server started on port ${WS_PORT}`);

const runCommand = (cmd) => {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) reject(stderr);
      else resolve(stdout);
    });
  });
};

async function getStats() {
  try {
    const usage = await runCommand('python3 /data/.openclaw/workspace/scripts/openclaw-advanced-usage.py');
    return JSON.parse(usage);
  } catch (e) {
    return { error: 'Stats failed' };
  }
}

async function getSystemInfo() {
  try {
    const disk = await runCommand("df /data | tail -1 | awk '{print $5}'");
    const ram = await runCommand("free -m | awk '/Mem:/ {print $7}'");
    return {
      disk: disk.trim(),
      ram: `${ram.trim()}MB`,
      online: true
    };
  } catch (e) {
    return { online: false };
  }
}

function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

// Watch session files
if (fs.existsSync(SESSIONS_DIR)) {
  fs.watch(SESSIONS_DIR, (eventType, filename) => {
    if (filename && filename.endsWith('.jsonl')) {
      const filePath = path.join(SESSIONS_DIR, filename);
      try {
        const content = fs.readFileSync(filePath, 'utf8').trim().split('\n');
        const lastLine = JSON.parse(content[content.length - 1]);
        if (lastLine.type === 'message' && lastLine.message.role === 'assistant') {
          broadcast({
            type: 'activity',
            agent: lastLine.model || 'main',
            thought: 'Working on task...'
          });
        }
      } catch (e) {}
    }
  });
}

setInterval(async () => {
  const stats = await getStats();
  const sys = await getSystemInfo();
  broadcast({ type: 'status_update', wallet: stats, system: sys });
}, 10000);

wss.on('connection', async (ws) => {
  console.log('Client connected');
  const stats = await getStats();
  const sys = await getSystemInfo();
  ws.send(JSON.stringify({ type: 'init', wallet: stats, system: sys }));
});

const httpServer = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/api/message' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const token = req.headers['authorization'];
        // Use localhost since we are inside the same container
        const response = await fetch('http://localhost:18789/api/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': token },
          body: body
        });
        const data = await response.json();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
      } catch (e) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Proxy failed' }));
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

httpServer.listen(HTTP_PORT, () => {
  console.log(`HTTP Proxy started on port ${HTTP_PORT}`);
});
