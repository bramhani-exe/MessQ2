// OPTIONAL OFFLINE FALLBACK only (hostel demo without internet).
// Production = Vercel serverless api/*.js + Upstash Redis, same routes (/api/queue).
// Run fallback: node server/server.js   (Node 18+)
// ESP32 POSTs here on every ENTRY/EXIT + heartbeat.
// MessQ frontend polls GET /api/queue every 2-3s (via Vite proxy /api in dev).

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.MESSQ_PORT ? Number(process.env.MESSQ_PORT) : 3001;
const API_KEY = process.env.MESSQ_API_KEY || '';
if (!API_KEY) console.warn('WARNING: MESSQ_API_KEY not set — fallback server accepts any key (dev only). Set it in env.');
const DB_FILE = path.join(__dirname, 'queue-state.json');

let state = {
  device_id: 'ESP32_MESS_Q01',
  queue_count: 17,
  entries: 342,
  exits: 325,
  ir1_state: 1,
  ir2_state: 1,
  rssi: -62,
  uptime_sec: 0,
  reason: 'init',
  server_received_at: new Date().toISOString(),
  esp32_online: false
};

try {
  if (fs.existsSync(DB_FILE)) {
    const saved = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    if (typeof saved.queue_count === 'number') state = { ...state, ...saved, esp32_online: false };
  }
} catch (e) {
  console.warn('Could not load saved state:', e.message);
}

function save() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2));
  } catch (e) {
    console.warn('Save failed:', e.message);
  }
}

function sendJson(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
}

function ageSec() {
  const t = Date.parse(state.server_received_at);
  if (Number.isNaN(t)) return 9999;
  return Math.floor((Date.now() - t) / 1000);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-api-key'
    });
    return res.end();
  }

  // POST /api/queue — ESP32 telemetry ingest
  if (url.pathname === '/api/queue' && req.method === 'POST') {
    if (API_KEY && req.headers['x-api-key'] !== API_KEY) return sendJson(res, 401, { error: 'bad api key' });
    let raw = '';
    req.on('data', (c) => { raw += c; if (raw.length > 1e6) req.destroy(); });
    req.on('end', () => {
      try {
        const data = JSON.parse(raw || '{}');
        if (typeof data.queue_count !== 'number') return sendJson(res, 400, { error: 'queue_count required' });
        state = {
          ...state,
          device_id: String(data.device_id || 'ESP32_MESS_Q01'),
          queue_count: Math.max(0, Math.min(60, Math.round(data.queue_count))),
          entries: Number(data.entries ?? state.entries),
          exits: Number(data.exits ?? state.exits),
          ir1_state: Number(data.ir1_state ?? state.ir1_state),
          ir2_state: Number(data.ir2_state ?? state.ir2_state),
          rssi: Number(data.rssi ?? state.rssi),
          uptime_sec: Number(data.uptime_sec ?? 0),
          reason: String(data.reason || 'update'),
          server_received_at: new Date().toISOString(),
          esp32_online: true
        };
        save();
        console.log(`[queue] ${state.reason} count=${state.queue_count} entries=${state.entries} exits=${state.exits}`);
        return sendJson(res, 200, { ok: true, queue_count: state.queue_count });
      } catch (e) {
        return sendJson(res, 400, { error: 'invalid json' });
      }
    });
    return;
  }

  // GET /api/queue — frontend poll
  if (url.pathname === '/api/queue' && req.method === 'GET') {
    const age = ageSec();
    return sendJson(res, 200, { ...state, esp32_online: age < 30, last_update_age_sec: age });
  }

  // POST /api/reset — zero counters (mess closing)
  if (url.pathname === '/api/reset' && req.method === 'POST') {
    if (API_KEY && req.headers['x-api-key'] !== API_KEY) return sendJson(res, 401, { error: 'bad api key' });
    state.queue_count = 0;
    state.entries = 0;
    state.exits = 0;
    state.reason = 'manual_reset';
    state.server_received_at = new Date().toISOString();
    save();
    return sendJson(res, 200, { ok: true, queue_count: 0 });
  }

  // GET /api/health
  if (url.pathname === '/api/health') return sendJson(res, 200, { ok: true, time: new Date().toISOString() });

  return sendJson(res, 404, { error: 'not found' });
});

server.listen(PORT, () => {
  console.log(`MessQ backend on http://localhost:${PORT}`);
  console.log(`Expecting ESP32 POSTs with x-api-key header. Frontend polls GET /api/queue`);
});
