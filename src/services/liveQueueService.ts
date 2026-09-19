// Frontend helper for Model A live data.
//  mode 'server' (default): GET <serverUrl>/queue -> same-origin /api/queue on Vercel,
//                           or Vite proxy -> localhost:3001 offline fallback in dev.
//  mode 'direct': GET <esp32Url>/status                 -> ESP32 WebServer, same-WiFi test only
//
// Both return normalized LiveTelemetry. iotService polls this when dataSource==='ESP32_LIVE'.

export type LiveMode = 'server' | 'direct';

export interface LiveTelemetry {
  queue_count: number;
  entries: number | null;
  exits: number | null;
  ir1_state: number | null;
  ir2_state: number | null;
  rssi: number | null;
  esp32_online: boolean;
  ageSec: number | null;
  reason: string;
}

const LS_MODE = 'messq.live.mode';
const LS_SERVER = 'messq.live.serverUrl';
const LS_ESP32 = 'messq.live.esp32Url';

export function getLiveMode(): LiveMode {
  try {
    const m = localStorage.getItem(LS_MODE);
    if (m === 'direct' || m === 'server') return m;
  } catch { /* ignore */ }
  const envMode = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_LIVE_MODE;
  return envMode === 'direct' ? 'direct' : 'server';
}

export function getServerUrl(): string {
  try {
    const v = localStorage.getItem(LS_SERVER);
    if (v) return v;
  } catch { /* ignore */ }
  const env = (import.meta as unknown as { env?: Record<string, string> }).env;
  // In dev, Vite proxies /api -> localhost:3001 (see vite.config.ts), so relative works.
  return env?.VITE_SERVER_URL || '/api';
}

export function getEsp32Url(): string {
  try {
    const v = localStorage.getItem(LS_ESP32);
    if (v) return v;
  } catch { /* ignore */ }
  const env = (import.meta as unknown as { env?: Record<string, string> }).env;
  return env?.VITE_ESP32_URL || 'http://192.168.1.142/status';
}

export function setLiveConfig(mode: LiveMode, serverUrl: string, esp32Url: string) {
  try {
    localStorage.setItem(LS_MODE, mode);
    localStorage.setItem(LS_SERVER, serverUrl);
    localStorage.setItem(LS_ESP32, esp32Url);
  } catch { /* ignore */ }
}

function num(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}

export async function fetchLiveTelemetry(
  mode: LiveMode,
  serverUrl: string,
  esp32Url: string,
  timeoutMs = 6000
): Promise<LiveTelemetry> {
  const url = mode === 'direct' ? esp32Url : `${serverUrl.replace(/\/$/, '')}/queue`;
  const ctrl = new AbortController();
  const t = window.setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { method: 'GET', cache: 'no-store', signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (typeof data.queue_count !== 'number') throw new Error('bad payload: queue_count missing');
    const age = num(data.last_update_age_sec);
    // Server reports esp32_online; direct mode is online if fetch succeeded.
    const online = mode === 'direct' ? true : data.esp32_online !== false && (age === null || age < 30);
    return {
      queue_count: Math.max(0, Math.min(60, Math.round(data.queue_count))),
      entries: num(data.entries),
      exits: num(data.exits),
      ir1_state: num(data.ir1_state ?? data.ir_in_state),
      ir2_state: num(data.ir2_state ?? data.ir_out_state),
      rssi: num(data.rssi ?? data.rssi_dbm),
      esp32_online: online,
      ageSec: age,
      reason: String(data.reason || (mode === 'direct' ? 'direct' : 'server'))
    };
  } finally {
    window.clearTimeout(t);
  }
}
