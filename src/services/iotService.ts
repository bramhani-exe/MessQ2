import {
  QueueState,
  SensorState,
  SystemDiagnostics,
  ActivityLog,
  QueueDataPoint,
  QueueThresholdConfig,
  NotificationItem
} from '../types/messq';
import { simulationEngine } from './simulationService';

export interface MessQSnapshot {
  queue: QueueState;
  sensors: {
    entry: SensorState;
    exit: SensorState;
  };
  diagnostics: SystemDiagnostics;
  history: QueueDataPoint[];
  logs: ActivityLog[];
  notifications: NotificationItem[];
  thresholds: QueueThresholdConfig;
  dataSource: 'SIMULATED' | 'ESP32_LIVE';
  simulationActive: boolean;
  simulationIntervalMs: number;
}

type Listener = (snapshot: MessQSnapshot) => void;

class IotService {
  private listeners: Set<Listener> = new Set();
  private timer: number | null = null;
  private simulationActive: boolean = true;
  private simulationIntervalMs: number = 4000;
  private dataSource: 'SIMULATED' | 'ESP32_LIVE' = 'SIMULATED';
  private realEsp32Url: string = '';

  constructor() {
    this.startSimulationLoop();
  }

  public getSnapshot(): MessQSnapshot {
    return {
      queue: simulationEngine.getQueueState(),
      sensors: simulationEngine.getSensors(),
      diagnostics: simulationEngine.getDiagnostics(),
      history: simulationEngine.getHistory(),
      logs: simulationEngine.getLogs(),
      notifications: simulationEngine.getNotifications(),
      thresholds: simulationEngine.getThresholds(),
      dataSource: this.dataSource,
      simulationActive: this.simulationActive,
      simulationIntervalMs: this.simulationIntervalMs
    };
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    // Send immediate snapshot upon subscription
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
        console.error('Error notifying MessQ subscriber:', err);
      }
    });
  }

  public startSimulationLoop() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (!this.simulationActive) return;

    this.timer = window.setInterval(() => {
      if (this.dataSource === 'SIMULATED' && this.simulationActive) {
        simulationEngine.simulateStep();
        this.notify();
      } else if (this.dataSource === 'ESP32_LIVE') {
        this.pollRealEsp32();
      }
    }, this.simulationIntervalMs);
  }

  public setSimulationActive(active: boolean) {
    this.simulationActive = active;
    if (active) {
      this.startSimulationLoop();
    } else if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.notify();
  }

  public setSimulationSpeed(ms: number) {
    this.simulationIntervalMs = ms;
    this.startSimulationLoop();
    this.notify();
  }

  public triggerManualEntry() {
    simulationEngine.manualEntry();
    this.notify();
  }

  public triggerManualExit() {
    simulationEngine.manualExit();
    this.notify();
  }

  public setPreset(preset: 'LOW' | 'MODERATE' | 'HIGH' | 'EMPTY') {
    switch (preset) {
      case 'EMPTY':
        simulationEngine.setQueuePreset(0, 'Empty Hall');
        break;
      case 'LOW':
        simulationEngine.setQueuePreset(6, 'Low Traffic (Post-Breakfast)');
        break;
      case 'MODERATE':
        simulationEngine.setQueuePreset(17, 'Normal Campus Flow');
        break;
      case 'HIGH':
        simulationEngine.setQueuePreset(29, 'Peak Lunch Rush');
        break;
    }
    this.notify();
  }

  public toggleHardware(connected: boolean) {
    simulationEngine.toggleEsp32Connection(connected);
    this.notify();
  }

  public updateThresholds(cfg: Partial<QueueThresholdConfig>) {
    simulationEngine.updateThresholds(cfg);
    this.notify();
  }

  public markNotificationRead(id: string) {
    simulationEngine.markNotificationAsRead(id);
    this.notify();
  }

  public markAllNotificationsRead() {
    simulationEngine.markAllNotificationsAsRead();
    this.notify();
  }

  public addNotification(title: string, message: string, level: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS' = 'INFO') {
    simulationEngine.addNotification(title, message, level);
    this.notify();
  }

  public configureRealEsp32(url: string, enable: boolean) {
    this.realEsp32Url = url;
    this.dataSource = enable ? 'ESP32_LIVE' : 'SIMULATED';
    this.notify();
  }

  private async pollRealEsp32() {
    if (!this.realEsp32Url) return;
    try {
      const res = await fetch(this.realEsp32Url, { method: 'GET', cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        // Structure compatible with ESP32 standard payload
        if (typeof data.queue_count === 'number') {
          simulationEngine.setQueuePreset(data.queue_count, 'ESP32 Direct Telemetry');
        }
      }
    } catch (err) {
      console.warn('Live ESP32 fetch failed, fallback active:', err);
    }
    this.notify();
  }
}

export const iotService = new IotService();
