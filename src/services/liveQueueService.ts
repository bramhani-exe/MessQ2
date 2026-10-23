import { ActivityLog, CrowdStatus, QueueDataPoint } from '../types/messq';

export interface LiveHardwareTelemetry {
  device_id: string;
  queue_count: number;
  entries: number;
  exits: number;
  ir1_state: number; // GPIO 34 (Entry sensor)
  ir2_state: number; // GPIO 35 (Exit sensor)
  rssi: number;
  uptime_sec: number;
  reason: string;
  server_received_at: string;
  esp32_online: boolean;
  last_update_age_sec: number;
}

export type HardwareConnectionState = 'LOADING' | 'CONNECTED' | 'STALE' | 'OFFLINE' | 'ERROR';

export interface LiveQueueSnapshot {
  isLoading: boolean;
  isLiveMode: boolean;
  telemetry: LiveHardwareTelemetry | null;
  connectionStatus: HardwareConnectionState;
  lastSuccessfulFetch: Date | null;
  lastError: string | null;
  logs: ActivityLog[];
  history: QueueDataPoint[];
}

type Listener = (snapshot: LiveQueueSnapshot) => void;

const API_PRIMARY_ENDPOINT = 'https://mess-q2.vercel.app/api/queue';
const API_LOCAL_FALLBACK = '/api/queue';
const POLLING_INTERVAL_MS = 3500;
const STORAGE_KEY_MODE = 'messq_live_mode_preference';

class LiveQueueService {
  private listeners: Set<Listener> = new Set();
  private pollTimer: number | null = null;
  private abortController: AbortController | null = null;

  private isLoading: boolean = true;
  private isLiveMode: boolean = true;
  private telemetry: LiveHardwareTelemetry | null = null;
  private connectionStatus: HardwareConnectionState = 'LOADING';
  private lastSuccessfulFetch: Date | null = null;
  private lastError: string | null = null;
  private logs: ActivityLog[] = [];
  private history: QueueDataPoint[] = [];

  // Track previous counts to detect real physical transitions
  private prevEntries: number | null = null;
  private prevExits: number | null = null;
  private prevQueueCount: number | null = null;

  constructor() {
    // Read persisted mode if available, default to true (LIVE)
    try {
      const savedMode = localStorage.getItem(STORAGE_KEY_MODE);
      if (savedMode !== null) {
        this.isLiveMode = savedMode === 'true';
      }
    } catch {
      this.isLiveMode = true;
    }

    if (this.isLiveMode) {
      this.startPolling();
    } else {
      this.isLoading = false;
    }
  }

  public getSnapshot(): LiveQueueSnapshot {
    return {
      isLoading: this.isLoading,
      isLiveMode: this.isLiveMode,
      telemetry: this.telemetry,
      connectionStatus: this.connectionStatus,
      lastSuccessfulFetch: this.lastSuccessfulFetch,
      lastError: this.lastError,
      logs: [...this.logs],
      history: [...this.history]
    };
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.getSnapshot());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const snap = this.getSnapshot();
    this.listeners.forEach((fn) => {
      try {
        fn(snap);
      } catch (err) {
        console.error('Error notifying liveQueue subscriber:', err);
      }
    });
  }

  public setLiveMode(active: boolean) {
    this.isLiveMode = active;
    try {
      localStorage.setItem(STORAGE_KEY_MODE, String(active));
    } catch {
      // ignore
    }

    if (active) {
      this.startPolling();
    } else {
      this.stopPolling();
    }
    this.notify();
  }

  public startPolling() {
    this.stopPolling();
    // Immediate fetch on initiation
    this.fetchTelemetry();
    this.pollTimer = window.setInterval(() => {
      this.fetchTelemetry();
    }, POLLING_INTERVAL_MS);
  }

  public stopPolling() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  public async fetchTelemetry(): Promise<void> {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();

    // Try primary production endpoint first, fallback to proxy
    const endpoints = [API_PRIMARY_ENDPOINT, API_LOCAL_FALLBACK];
    let payload: LiveHardwareTelemetry | null = null;
    let fetchError: string | null = null;

    for (const url of endpoints) {
      try {
        const response = await fetch(url, {
          method: 'GET',
          cache: 'no-store',
          signal: this.abortController.signal,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          const raw = await response.json();
          // Validate required hardware fields
          if (typeof raw.queue_count === 'number') {
            payload = {
              device_id: String(raw.device_id || 'ESP32_MESS_Q01'),
              queue_count: Math.max(0, Number(raw.queue_count)),
              entries: Math.max(0, Number(raw.entries ?? 0)),
              exits: Math.max(0, Number(raw.exits ?? 0)),
              ir1_state: Number(raw.ir1_state ?? 0),
              ir2_state: Number(raw.ir2_state ?? 0),
              rssi: Number(raw.rssi ?? -50),
              uptime_sec: Number(raw.uptime_sec ?? 0),
              reason: String(raw.reason ?? 'heartbeat'),
              server_received_at: String(raw.server_received_at || new Date().toISOString()),
              esp32_online: Boolean(raw.esp32_online),
              last_update_age_sec: Math.max(0, Number(raw.last_update_age_sec ?? 0))
            };
            break;
          }
        } else {
          fetchError = `HTTP ${response.status}: ${response.statusText}`;
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return; // Ignore intentional abort
        }
        fetchError = err instanceof Error ? err.message : 'Network fetch failure';
      }
    }

    if (payload !== null) {
      this.handleSuccessfulTelemetry(payload);
    } else {
      this.handleFailedTelemetry(fetchError || 'Unable to connect to production queue API');
    }
    this.notify();
  }

  private handleSuccessfulTelemetry(data: LiveHardwareTelemetry) {
    this.isLoading = false;
    this.lastError = null;
    this.lastSuccessfulFetch = new Date();
    this.telemetry = data;

    // Determine connection state based on actual backend telemetry age
    if (!data.esp32_online || data.last_update_age_sec >= 60) {
      this.connectionStatus = 'OFFLINE';
    } else if (data.last_update_age_sec >= 20) {
      this.connectionStatus = 'STALE';
    } else {
      this.connectionStatus = 'CONNECTED';
    }

    // Process genuine activity logs from hardware counter deltas
    this.recordHardwareTransitions(data);

    // Record session history point
    this.appendSessionHistoryPoint(data.queue_count);
  }

  private handleFailedTelemetry(errorMessage: string) {
    this.isLoading = false;
    this.lastError = errorMessage;
    this.connectionStatus = 'ERROR';
    // CRITICAL: We preserve this.telemetry so last known numbers are retained
  }

  private recordHardwareTransitions(data: LiveHardwareTelemetry) {
    const now = new Date();

    // Baseline initialization on first fetch
    if (this.prevEntries === null || this.prevExits === null) {
      this.prevEntries = data.entries;
      this.prevExits = data.exits;
      this.prevQueueCount = data.queue_count;

      this.logs.unshift({
        id: 'init-' + Date.now(),
        timestamp: now,
        type: 'SYSTEM',
        message: `Hardware telemetry stream linked: initial queue count is ${data.queue_count} diners`,
        delta: 0
      });
      return;
    }

    // Entry detected
    if (data.entries > this.prevEntries || data.reason === 'entry') {
      const delta = Math.max(1, data.entries - this.prevEntries);
      this.logs.unshift({
        id: 'entry-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        timestamp: now,
        type: 'ENTRY',
        message: `IR Sensor 1 (GPIO 34 Entry) detected +${delta} student(s) entering LH2 Mess`,
        delta: delta
      });
      this.prevEntries = data.entries;
    }

    // Exit detected
    if (data.exits > this.prevExits || data.reason === 'exit') {
      const delta = Math.max(1, data.exits - this.prevExits);
      this.logs.unshift({
        id: 'exit-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        timestamp: now,
        type: 'EXIT',
        message: `IR Sensor 2 (GPIO 35 Exit) detected -${delta} diner(s) cleared counter`,
        delta: -delta
      });
      this.prevExits = data.exits;
    }

    // Queue count shift without entry/exit delta
    if (data.queue_count !== this.prevQueueCount) {
      this.prevQueueCount = data.queue_count;
    }

    // Cap activity log to latest 30 entries
    if (this.logs.length > 30) {
      this.logs = this.logs.slice(0, 30);
    }
  }

  private appendSessionHistoryPoint(count: number) {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const mins = now.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hours}:${mins}`;

    const status: CrowdStatus = count <= 10 ? 'LOW' : count <= 25 ? 'MODERATE' : 'HIGH';

    const last = this.history[this.history.length - 1];
    if (last && last.time === timeStr) {
      last.count = count;
      last.status = status;
      last.timestamp = now.getTime();
    } else {
      this.history.push({
        time: timeStr,
        timestamp: now.getTime(),
        count: count,
        status: status
      });
      // Keep last 15 points
      if (this.history.length > 15) {
        this.history.shift();
      }
    }
  }

  // Explicit, safeguarded manual reset for demonstration purposes
  public async resetHardwareQueueCounter(): Promise<boolean> {
    try {
      const response = await fetch(API_PRIMARY_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          queue_count: 0,
          entries: 0,
          exits: 0,
          reason: 'manual_reset'
        })
      });

      if (response.ok) {
        // Trigger immediate re-fetch
        await this.fetchTelemetry();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to reset hardware queue:', err);
      return false;
    }
  }
}

export const liveQueueService = new LiveQueueService();
