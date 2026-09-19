// Vercel Serverless: /api/queue
// ESP32 POSTs live Model A telemetry (GPIO34 ENTRY+1 / GPIO35 EXIT-1, ESP32 authoritative).
// MessQ frontend GETs the same URL (same-origin, no CORS issues in production).

import {
  checkApiKey,
  defaultState,
  loadState,
  readJsonBody,
  saveState,
  setCors,
  withOnlineFlag
} from './_lib.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'GET') {
    const s = await loadState();
    return res.status(200).json(withOnlineFlag(s));
  }

  if (req.method === 'POST') {
    if (!checkApiKey(req)) return res.status(401).json({ error: 'bad api key' });
    const data = readJsonBody(req);
    if (typeof data.queue_count !== 'number') {
      return res.status(400).json({ error: 'queue_count (number) required' });
    }
    const prev = await loadState();
    const next = {
      ...defaultState(),
      ...prev,
      device_id: String(data.device_id || 'ESP32_MESS_Q01'),
      queue_count: Math.max(0, Math.min(60, Math.round(data.queue_count))),
      entries: Number.isFinite(Number(data.entries)) ? Number(data.entries) : prev.entries,
      exits: Number.isFinite(Number(data.exits)) ? Number(data.exits) : prev.exits,
      ir1_state: typeof data.ir1_state === 'number' ? data.ir1_state : prev.ir1_state,
      ir2_state: typeof data.ir2_state === 'number' ? data.ir2_state : prev.ir2_state,
      rssi: typeof data.rssi === 'number' ? data.rssi : prev.rssi,
      uptime_sec: typeof data.uptime_sec === 'number' ? data.uptime_sec : 0,
      reason: String(data.reason || 'update'),
      server_received_at: new Date().toISOString(),
      esp32_online: true
    };
    await saveState(next);
    console.log(`[queue] ${next.reason} count=${next.queue_count} entries=${next.entries} exits=${next.exits}`);
    return res.status(200).json({ ok: true, queue_count: next.queue_count });
  }

  return res.status(405).json({ error: 'method not allowed' });
}
