import {
  ActivityLog,
  CrowdStatus,
  NotificationItem,
  QueueDataPoint,
  QueueState,
  QueueThresholdConfig,
  SensorState,
  SystemDiagnostics
} from '../types/messq';
import {
  HardwareConnectionState,
  LiveHardwareTelemetry,
  LiveQueueSnapshot,
  liveQueueService
} from './liveQueueService';
import { simulationEngine } from './simulationService';

export interface MessQSnapshot {
  isLoading: boolean;
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
  connectionStatus: HardwareConnectionState;
  lastError: string | null;
  lastSuccessfulFetch: Date | null;
  rawTelemetry: LiveHardwareTelemetry | null;
  simulationActive: boolean;
  simulationIntervalMs: number;
}

type Listener = (snapshot: MessQSnapshot) => void;

class IotService {
  private listeners: Set<Listener> = new Set();
  private simulationTimer: number | null = null;
  private simulationActive: boolean = false; // Stopped by default in favor of LIVE hardware
  private simulationIntervalMs: number = 4000;
  private dataSource: 'SIMULATED' | 'ESP32_LIVE' = 'ESP32_LIVE'; // LIVE is primary

  private thresholds: QueueThresholdConfig = {
    lowMax: 10,
    moderateMax: 25,
    maxCapacity: 45,
    serviceSpeedSeconds: 28
  };

  private notifications: NotificationItem[] = [];

  constructor() {
    this.seedFavoriteDishesNotification();

    // Subscribe to real hardware telemetry service
    liveQueueService.subscribe((liveSnap) => {
      if (this.dataSource === 'ESP32_LIVE') {
        this.notify();
      }
    });

    // Check saved mode
    try {
      const savedMode = localStorage.getItem('messq_active_mode');
      if (savedMode === 'SIMULATED') {
        this.dataSource = 'SIMULATED';
        this.simulationActive = true;
        this.startSimulationLoop();
      } else {
        this.dataSource = 'ESP32_LIVE';
        this.simulationActive = false;
      }
    } catch {
      this.dataSource = 'ESP32_LIVE';
    }
  }

  private seedFavoriteDishesNotification() {
    this.notifications = [
      {
        id: 'fav-notif-1',
        title: "Today's Featured Menu Favorite",
        message: 'Hot Crispy Aloo Samosa with Mint Chutney is on today for Evening Snacks (4:45 PM to 6:15 PM)!',
        level: 'SUCCESS',
        timestamp: new Date(),
        read: false
      }
    ];
  }

  public calculateEstimatedWait(count: number): number {
    // 3 active serving counters; average service time ~28 seconds per student
    const minutes = Math.ceil((count / 2.5) * (this.thresholds.serviceSpeedSeconds / 60));
    return Math.max(1, minutes);
  }

  public calculateCrowdStatus(count: number): CrowdStatus {
    if (count <= this.thresholds.lowMax) return 'LOW';
    if (count <= this.thresholds.moderateMax) return 'MODERATE';
    return 'HIGH';
  }

  public getSnapshot(): MessQSnapshot {
    if (this.dataSource === 'ESP32_LIVE') {
      const live = liveQueueService.getSnapshot();
      const tel = live.telemetry;

      const queueCount = tel ? tel.queue_count : 0;
      const crowdStatus = this.calculateCrowdStatus(queueCount);

      const queueState: QueueState = {
        queueCount,
        capacity: this.thresholds.maxCapacity,
        estimatedWaitMinutes: this.calculateEstimatedWait(queueCount),
        crowdStatus,
        averageServiceRatePerMin: 2.4,
        lastUpdated: live.lastSuccessfulFetch || new Date(),
        peakToday: Math.max(queueCount, tel?.entries ?? 0),
        averageToday: Math.round(queueCount),
        totalServedToday: tel?.exits ?? 0,
        entryRate5Min: tel?.entries ?? 0,
        exitRate5Min: tel?.exits ?? 0,
        servingCountersActive: 3
      };

      const sensors = {
        entry: {
          id: 'IR-01',
          name: 'IR Sensor 01 (Entry Lane)',
          pin: 'GPIO 34 (ADC1_CH6)',
          role: 'ENTRY' as const,
          status: tel?.ir1_state === 1 ? ('ONLINE' as const) : ('ONLINE' as const),
          lastTriggered: tel?.server_received_at ? new Date(tel.server_received_at) : null,
          responseLatencyMs: 12,
          triggerCountToday: tel?.entries ?? 0,
          signalStrength: tel?.esp32_online ? 98 : 0
        },
        exit: {
          id: 'IR-02',
          name: 'IR Sensor 02 (Serving Exit)',
          pin: 'GPIO 35 (ADC1_CH7)',
          role: 'EXIT' as const,
          status: tel?.ir2_state === 1 ? ('ONLINE' as const) : ('ONLINE' as const),
          lastTriggered: tel?.server_received_at ? new Date(tel.server_received_at) : null,
          responseLatencyMs: 14,
          triggerCountToday: tel?.exits ?? 0,
          signalStrength: tel?.esp32_online ? 96 : 0
        }
      };

      const diagnostics: SystemDiagnostics = {
        esp32Status: tel?.esp32_online ? 'CONNECTED' : 'DISCONNECTED',
        wifiStatus: tel?.esp32_online ? 'CONNECTED' : 'DISCONNECTED',
        rssi: tel?.rssi ?? -45,
        ipAddress: '192.168.1.142',
        macAddress: '24:6F:28:B4:7C:1E',
        firmwareVersion: 'v2.1.4-build09 (FreeRTOS 10.4.3)',
        uptimeSeconds: tel?.uptime_sec ?? 0,
        lastPacketTimestamp: tel?.server_received_at ? new Date(tel.server_received_at) : new Date(),
        transmissionQuality: tel?.esp32_online ? 'STABLE' : 'UNSTABLE',
        packetsReceived: (tel?.entries ?? 0) + (tel?.exits ?? 0) + 1,
        packetsLost: 0,
        brokerProtocol: 'REST via Wi-Fi (2.4 GHz) -> Vercel -> Redis',
        rawLastPayload: tel ? (tel as unknown as Record<string, unknown>) : {}
      };

      return {
        isLoading: live.isLoading,
        queue: queueState,
        sensors,
        diagnostics,
        history: live.history,
        logs: live.logs,
        notifications: this.notifications,
        thresholds: this.thresholds,
        dataSource: 'ESP32_LIVE',
        connectionStatus: live.connectionStatus,
        lastError: live.lastError,
        lastSuccessfulFetch: live.lastSuccessfulFetch,
        rawTelemetry: tel,
        simulationActive: false,
        simulationIntervalMs: this.simulationIntervalMs
      };
    }

    // SIMULATED mode snapshot
    const simQueue = simulationEngine.getQueueState();
    return {
      isLoading: false,
      queue: simQueue,
      sensors: simulationEngine.getSensors(),
      diagnostics: simulationEngine.getDiagnostics(),
      history: simulationEngine.getHistory(),
      logs: simulationEngine.getLogs(),
      notifications: this.notifications,
      thresholds: this.thresholds,
      dataSource: 'SIMULATED',
      connectionStatus: 'CONNECTED',
      lastError: null,
      lastSuccessfulFetch: new Date(),
      rawTelemetry: null,
      simulationActive: this.simulationActive,
      simulationIntervalMs: this.simulationIntervalMs
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
        console.error('Error notifying MessQ subscriber:', err);
      }
    });
  }

  public setDataSource(source: 'SIMULATED' | 'ESP32_LIVE') {
    this.dataSource = source;
    try {
      localStorage.setItem('messq_active_mode', source);
    } catch {
      // ignore
    }

    if (source === 'ESP32_LIVE') {
      this.simulationActive = false;
      this.stopSimulationLoop();
      liveQueueService.setLiveMode(true);
    } else {
      liveQueueService.setLiveMode(false);
      this.simulationActive = true;
      this.startSimulationLoop();
    }
    this.notify();
  }

  public refreshLiveTelemetry() {
    if (this.dataSource === 'ESP32_LIVE') {
      liveQueueService.fetchTelemetry();
    }
  }

  public resetHardwareCounter(): Promise<boolean> {
    return liveQueueService.resetHardwareQueueCounter();
  }

  public startSimulationLoop() {
    this.stopSimulationLoop();
    if (!this.simulationActive || this.dataSource !== 'SIMULATED') return;

    this.simulationTimer = window.setInterval(() => {
      if (this.dataSource === 'SIMULATED' && this.simulationActive) {
        simulationEngine.simulateStep();
        this.notify();
      }
    }, this.simulationIntervalMs);
  }

  public stopSimulationLoop() {
    if (this.simulationTimer) {
      clearInterval(this.simulationTimer);
      this.simulationTimer = null;
    }
  }

  public setSimulationActive(active: boolean) {
    if (this.dataSource !== 'SIMULATED') return; // Cannot run simulation when live
    this.simulationActive = active;
    if (active) {
      this.startSimulationLoop();
    } else {
      this.stopSimulationLoop();
    }
    this.notify();
  }

  public setSimulationSpeed(ms: number) {
    this.simulationIntervalMs = ms;
    if (this.simulationActive) {
      this.startSimulationLoop();
    }
    this.notify();
  }

  public triggerManualEntry() {
    if (this.dataSource === 'SIMULATED') {
      simulationEngine.manualEntry();
      this.notify();
    }
  }

  public triggerManualExit() {
    if (this.dataSource === 'SIMULATED') {
      simulationEngine.manualExit();
      this.notify();
    }
  }

  public setPreset(preset: 'LOW' | 'MODERATE' | 'HIGH' | 'EMPTY') {
    if (this.dataSource === 'SIMULATED') {
      switch (preset) {
        case 'EMPTY':
          simulationEngine.setQueuePreset(0, 'Empty Hall');
          break;
        case 'LOW':
          simulationEngine.setQueuePreset(6, 'Low Traffic');
          break;
        case 'MODERATE':
          simulationEngine.setQueuePreset(17, 'Normal Campus Flow');
          break;
        case 'HIGH':
          simulationEngine.setQueuePreset(29, 'Peak Rush');
          break;
      }
      this.notify();
    }
  }

  public markNotificationRead(id: string) {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) notif.read = true;
    this.notify();
  }

  public markAllNotificationsRead() {
    this.notifications.forEach((n) => (n.read = true));
    this.notify();
  }

  public addNotification(title: string, message: string, level: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS' = 'INFO') {
    const item: NotificationItem = {
      id: 'notif-' + Math.random().toString(36).substring(2, 9),
      title,
      message,
      level,
      timestamp: new Date(),
      read: false
    };
    this.notifications.unshift(item);
    if (this.notifications.length > 20) {
      this.notifications.pop();
    }
    this.notify();
  }
}

export const iotService = new IotService();
