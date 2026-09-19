// Vercel Serverless: /api/health

import { redisConfigured, setCors } from './_lib.js';

export default function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  return res.status(200).json({ ok: true, time: new Date().toISOString(), redis: redisConfigured() });
}
