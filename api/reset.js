// Vercel Serverless: /api/reset — zero counters (mess closing time).
// POST with x-api-key header. No secrets hardcoded.

import { checkApiKey, loadState, saveState, setCors } from './_lib.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });
  if (!checkApiKey(req)) return res.status(401).json({ error: 'bad api key' });

  const prev = await loadState();
  const next = {
    ...prev,
    queue_count: 0,
    entries: 0,
    exits: 0,
    reason: 'manual_reset',
    server_received_at: new Date().toISOString(),
    esp32_online: prev.esp32_online
  };
  await saveState(next);
  return res.status(200).json({ ok: true, queue_count: 0 });
}
