// Shared helpers for MessQ Vercel serverless API + Upstash Redis.
// Env (Vercel Dashboard, never committed):
//   UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN  (or KV_REST_API_URL / KV_REST_API_TOKEN)
//   MESSQ_API_KEY  (shared secret ESP32 sends as x-api-key header)
// No secrets are hardcoded here. If Redis env is missing (local dev),
// state falls back to in-memory (resets on cold start) so GET/POST still work.

const STATE_KEY = 'messq:queue:v1';

function redisConfig() {
  const url = (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '').replace(/\/$/, '');
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '';
  return url && token ? { url, token } : null;
}

export function defaultState() {
  return {
    device_id: 'ESP32_MESS_Q01',
    queue_count: 0,
    entries: 0,
    exits: 0,
    ir1_state: 1,
    ir2_state: 1,
    rssi: null,
    uptime_sec: 0,
    reason: 'init',
    server_received_at: new Date().toISOString(),
    esp32_online: false
  };
}

function memGet() {
  return globalThis.__messqMem || null;
}
function memSet(s) {
  globalThis.__messqMem = s;
}

async function upstashPipeline(cmds) {
  const cfg = redisConfig();
  const res = await fetch(cfg.url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${cfg.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds)
  });
  if (!res.ok) throw new Error(`upstash HTTP ${res.status}`);
  return res.json();
}

export async function loadState() {
  const cfg = redisConfig();
  if (cfg) {
    try {
      const out = await upstashPipeline([['GET', STATE_KEY]]);
      const raw = Array.isArray(out) ? out[0]?.result : out?.result;
      if (typeof raw === 'string' && raw.length > 0) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.queue_count === 'number') return { ...defaultState(), ...parsed };
      }
      if (raw && typeof raw === 'object' && typeof raw.queue_count === 'number') {
        return { ...defaultState(), ...raw };
      }
    } catch (e) {
      console.warn('Redis GET failed, using memory fallback:', e.message);
    }
  }
  return memGet() || defaultState();
}

export async function saveState(s) {
  memSet(s);
  const cfg = redisConfig();
  if (!cfg) return { persisted: false };
  try {
    await upstashPipeline([['SET', STATE_KEY, JSON.stringify(s)]]);
    return { persisted: true };
  } catch (e) {
    console.warn('Redis SET failed (memory kept):', e.message);
    return { persisted: false, error: e.message };
  }
}

export function ageSec(iso) {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return 9999;
  return Math.floor((Date.now() - t) / 1000);
}

export function withOnlineFlag(s) {
  const age = ageSec(s.server_received_at);
  return { ...s, esp32_online: age < 30, last_update_age_sec: age };
}

export function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');
}

export function checkApiKey(req) {
  const expected = process.env.MESSQ_API_KEY || '';
  if (!expected) return true; // allow until env is configured (dev convenience)
  const got = req.headers['x-api-key'] || req.headers['X-API-KEY'];
  return got === expected;
}

export function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string' && req.body.length > 0) {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return {};
}

export function redisConfigured() {
  return !!redisConfig();
}
