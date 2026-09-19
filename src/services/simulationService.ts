import {
  QueueState,
  SensorState,
  SystemDiagnostics,
  ActivityLog,
  QueueDataPoint,
  CrowdStatus,
  QueueThresholdConfig,
  NotificationItem
} from '../types/messq';

export class SimulationEngine {
  private thresholds: QueueThresholdConfig = {
    lowMax: 10,
    moderateMax: 25,
    maxCapacity: 45,
    serviceSpeedSeconds: 28
  };

  private currentQueue: number = 17;
  private peakToday: number = 28;
  private averageToday: number = 14;
  private totalServedToday: number = 214;
  private historyPoints: QueueDataPoint[] = [];
  private activityLogs: ActivityLog[] = [];
  private notifications: NotificationItem[] = [];

  private sensorEntry: SensorState = {
    id: 'IR-01',
    name: 'IR Sensor 01 (Entry Lane)',
    pin: 'GPIO 34 (ADC1_CH6)',
    role: 'ENTRY',
    status: 'ONLINE',
    lastTriggered: new Date(Date.now() - 14000),
    responseLatencyMs: 12,
    triggerCountToday: 342,
    signalStrength: 98
  };

  private sensorExit: SensorState = {
    id: 'IR-02',
    name: 'IR Sensor 02 (Serving Exit)',
    pin: 'GPIO 35 (ADC1_CH7)',
    role: 'EXIT',
    status: 'ONLINE',
    lastTriggered: new Date(Date.now() - 38000),
    responseLatencyMs: 14,
    triggerCountToday: 325,
    signalStrength: 96
  };

  private systemDiagnostics: SystemDiagnostics = {
    esp32Status: 'CONNECTED',
    wifiStatus: 'CONNECTED',
    rssi: -62,
    ipAddress: '192.168.1.142',
    macAddress: '24:6F:28:B4:7C:1E',
    firmwareVersion: 'v2.1.4-build09 (FreeRTOS 10.4.3)',
    uptimeSeconds: 84320,
    lastPacketTimestamp: new Date(),
    transmissionQuality: 'STABLE',
    packetsReceived: 1482,
    packetsLost: 0,
    brokerProtocol: 'REST/MQTT via WiFi 802.11 b/g/n (2.4GHz)',
    rawLastPayload: {
      device_id: 'ESP32_MESS_Q01',
      fw_ver: '2.1.4',
      status: 'OK',
      queue_count: 17,
      ir_in_state: 0,
      ir_out_state: 0,
      hall_current: 'NORMAL',
      free_heap_bytes: 184512
    }
  };

  constructor() {
    this.seedInitialHistory();
    this.seedInitialLogs();
    this.seedInitialNotifications();
  }

  private seedInitialHistory() {
    const now = Date.now();
    const baseCounts = [8, 9, 11, 13, 16, 19, 22, 26, 28, 25, 21, 18, 16, 17, 17];
    const stepMs = 2 * 60 * 1000; // 2 minutes apart = last 30 minutes

    for (let i = 0; i < baseCounts.length; i++) {
      const ptTime = new Date(now - (baseCounts.length - 1 - i) * stepMs);
      const hours = ptTime.getHours().toString().padStart(2, '0');
      const mins = ptTime.getMinutes().toString().padStart(2, '0');
      const count = baseCounts[i];
      this.historyPoints.push({
        time: `${hours}:${mins}`,
        timestamp: ptTime.getTime(),
        count,
        status: this.calculateCrowdStatus(count)
      });
    }
  }

  private seedInitialLogs() {
    const now = Date.now();
    this.activityLogs = [
      {
        id: 'act-1',
        timestamp: new Date(now - 14 * 1000),
        type: 'ENTRY',
        message: 'Student joined LH2 Mess line — Queue count is 17',
        delta: +1
      },
      {
        id: 'act-2',
        timestamp: new Date(now - 58 * 1000),
        type: 'EXIT',
        message: 'Diner collected food tray & cleared serving counter',
        delta: -1
      },
      {
        id: 'act-3',
        timestamp: new Date(now - 124 * 1000),
        type: 'HEARTBEAT',
        message: 'Serving counters moving smoothly at normal pace',
        delta: 0
      },
      {
        id: 'act-4',
        timestamp: new Date(now - 210 * 1000),
        type: 'SYSTEM',
        message: 'All 3 serving counters active in LH2 Mess',
        delta: 0
      },
      {
        id: 'act-5',
        timestamp: new Date(now - 340 * 1000),
        type: 'ENTRY',
        message: 'Student joined LH2 Mess line — Queue count is 17',
        delta: +1
      }
    ];
  }

  private seedInitialNotifications() {
    this.notifications = [
      {
        id: 'notif-1',
        title: '⭐ Today\'s Favorite on Menu!',
        message: 'Hot Aloo Samosa & Mint Chutney is on today\'s Evening Snacks (4:45 PM – 6:15 PM)!',
        level: 'SUCCESS',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false
      },
      {
        id: 'notif-2',
        title: 'Moderate Crowd Window',
        message: 'LH2 Mess crowd is moderate (~17 students). Est. wait time is ~4 mins.',
        level: 'INFO',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        read: true
      }
    ];
  }

  public calculateCrowdStatus(count: number): CrowdStatus {
    if (count <= this.thresholds.lowMax) return 'LOW';
    if (count <= this.thresholds.moderateMax) return 'MODERATE';
    return 'HIGH';
  }

  public calculateEstimatedWait(count: number): number {
    // 3 active serving counters; average service time ~28 seconds per student
    // Total wait time = (count / counters) * (serviceSpeed / 60)
    const minutes = Math.ceil((count / 2.5) * (this.thresholds.serviceSpeedSeconds / 60));
    return Math.max(1, minutes);
  }

  public getQueueState(): QueueState {
    const crowdStatus = this.calculateCrowdStatus(this.currentQueue);
    return {
      queueCount: this.currentQueue,
      capacity: this.thresholds.maxCapacity,
      estimatedWaitMinutes: this.calculateEstimatedWait(this.currentQueue),
      crowdStatus,
      averageServiceRatePerMin: 2.4,
      lastUpdated: new Date(),
      peakToday: Math.max(this.peakToday, this.currentQueue),
      averageToday: this.averageToday,
      totalServedToday: this.totalServedToday,
      entryRate5Min: 2.8,
      exitRate5Min: 2.2,
      servingCountersActive: 3
    };
  }

  public getSensors(): { entry: SensorState; exit: SensorState } {
    return {
      entry: { ...this.sensorEntry },
      exit: { ...this.sensorExit }
    };
  }

  public getDiagnostics(): SystemDiagnostics {
    return {
      ...this.systemDiagnostics,
      lastPacketTimestamp: new Date(),
      uptimeSeconds: this.systemDiagnostics.uptimeSeconds + 3,
      packetsReceived: this.systemDiagnostics.packetsReceived + 1,
      rawLastPayload: {
        device_id: 'ESP32_MESS_Q01',
        fw_ver: '2.1.4',
        status: this.systemDiagnostics.esp32Status,
        queue_count: this.currentQueue,
        ir_01_val: this.sensorEntry.status === 'ONLINE' ? 1 : 0,
        ir_02_val: this.sensorExit.status === 'ONLINE' ? 1 : 0,
        rssi_dbm: this.systemDiagnostics.rssi,
        uptime_sec: this.systemDiagnostics.uptimeSeconds,
        timestamp: new Date().toISOString()
      }
    };
  }

  public getHistory(): QueueDataPoint[] {
    return [...this.historyPoints];
  }

  public getLogs(): ActivityLog[] {
    return [...this.activityLogs];
  }

  public getNotifications(): NotificationItem[] {
    return [...this.notifications];
  }

  public getThresholds(): QueueThresholdConfig {
    return { ...this.thresholds };
  }

  public updateThresholds(cfg: Partial<QueueThresholdConfig>) {
    this.thresholds = { ...this.thresholds, ...cfg };
  }

  // Realistic Simulation Step: Gradual realistic movement
  public simulateStep(): {
    delta: number;
    type: 'ENTRY' | 'EXIT' | 'NONE';
    newCount: number;
  } {
    // Gradual realistic drift: ~60% of the time, an entry or exit occurs
    const rand = Math.random();
    let delta = 0;
    let type: 'ENTRY' | 'EXIT' | 'NONE' = 'NONE';

    if (rand < 0.35 && this.currentQueue < this.thresholds.maxCapacity) {
      // Entry detected
      delta = 1;
      type = 'ENTRY';
      this.currentQueue += 1;
      this.sensorEntry.lastTriggered = new Date();
      this.sensorEntry.triggerCountToday += 1;
      this.recordActivity('ENTRY', `Student entered LH2 Mess — Queue is now ${this.currentQueue}`, +1);
    } else if (rand > 0.65 && this.currentQueue > 2) {
      // Exit detected
      delta = -1;
      type = 'EXIT';
      this.currentQueue -= 1;
      this.totalServedToday += 1;
      this.sensorExit.lastTriggered = new Date();
      this.sensorExit.triggerCountToday += 1;
      this.recordActivity('EXIT', `Diner completed meal — Queue decreased to ${this.currentQueue}`, -1);
    } else {
      // Periodic check
      if (Math.random() < 0.2) {
        this.recordActivity('HEARTBEAT', `Counters serving students smoothly`, 0);
      }
    }

    if (this.currentQueue > this.peakToday) {
      this.peakToday = this.currentQueue;
    }

    this.appendHistoryPoint();
    return { delta, type, newCount: this.currentQueue };
  }

  public manualEntry(): number {
    if (this.currentQueue < this.thresholds.maxCapacity) {
      this.currentQueue += 1;
      this.sensorEntry.lastTriggered = new Date();
      this.sensorEntry.triggerCountToday += 1;
      this.recordActivity('ENTRY', `Student joined queue — Queue increased to ${this.currentQueue}`, +1);
      this.appendHistoryPoint();
    }
    return this.currentQueue;
  }

  public manualExit(): number {
    if (this.currentQueue > 0) {
      this.currentQueue -= 1;
      this.totalServedToday += 1;
      this.sensorExit.lastTriggered = new Date();
      this.sensorExit.triggerCountToday += 1;
      this.recordActivity('EXIT', `Student cleared counter — Queue decreased to ${this.currentQueue}`, -1);
      this.appendHistoryPoint();
    }
    return this.currentQueue;
  }

  public setQueuePreset(count: number, label: string) {
    this.currentQueue = Math.max(0, Math.min(this.thresholds.maxCapacity, count));
    this.recordActivity('SYSTEM', `Queue state calibrated to ${label} preset: ${this.currentQueue} diners`, 0);
    this.appendHistoryPoint();

    const status = this.calculateCrowdStatus(this.currentQueue);
    this.addNotification(
      `Queue Crowd Shift: ${status}`,
      `Mess queue is now estimated at ${this.currentQueue} students (${status} density).`,
      status === 'HIGH' ? 'WARNING' : status === 'MODERATE' ? 'INFO' : 'SUCCESS'
    );
  }

  // Model A live telemetry: ESP32 is authoritative for queue_count.
  // Applies ENTRY (+1) / EXIT (-1) deltas so RecentActivity stays truthful,
  // updates sensor trigger metadata without spamming notifications every poll.
  public applyLiveTelemetry(payload: {
    queue_count: number;
    entries?: number | null;
    exits?: number | null;
    ir1_state?: number | null;
    ir2_state?: number | null;
    rssi?: number | null;
    reason?: string;
  }): { delta: number } {
    const next = Math.max(0, Math.min(this.thresholds.maxCapacity, Math.round(payload.queue_count)));
    const prev = this.currentQueue;
    const delta = next - prev;
    const now = new Date();

    if (delta > 0) {
      this.sensorEntry.lastTriggered = now;
      this.sensorEntry.triggerCountToday += delta;
      this.sensorEntry.status = 'ONLINE';
      this.recordActivity('ENTRY', `IR-01 ENTRY: ${delta} student(s) joined — Queue is now ${next}`, delta);
    } else if (delta < 0) {
      const served = Math.min(Math.abs(delta), 50);
      this.sensorExit.lastTriggered = now;
      this.sensorExit.triggerCountToday += served;
      this.sensorExit.status = 'ONLINE';
      this.totalServedToday += served;
      this.recordActivity('EXIT', `IR-02 EXIT: ${served} student(s) left counter — Queue is now ${next}`, delta);
    }
    // Heartbeat / no-change: keep sensors online, no log spam.
    if (delta === 0) {
      this.sensorEntry.status = 'ONLINE';
      this.sensorExit.status = 'ONLINE';
    }

    this.currentQueue = next;
    if (typeof payload.entries === 'number') {
      this.sensorEntry.triggerCountToday = payload.entries;
    }
    if (typeof payload.exits === 'number') {
      this.sensorExit.triggerCountToday = payload.exits;
    }
    if (typeof payload.rssi === 'number') {
      this.systemDiagnostics.rssi = payload.rssi;
    }
    this.systemDiagnostics.esp32Status = 'CONNECTED';
    this.systemDiagnostics.wifiStatus = 'CONNECTED';
    this.systemDiagnostics.lastPacketTimestamp = now;
    this.systemDiagnostics.packetsReceived += 1;
    this.systemDiagnostics.rawLastPayload = {
      device_id: 'ESP32_MESS_Q01',
      queue_count: next,
      ir_01_val: payload.ir1_state ?? 1,
      ir_02_val: payload.ir2_state ?? 1,
      reason: payload.reason ?? 'live',
      timestamp: now.toISOString()
    };

    if (delta !== 0) {
      this.appendHistoryPoint();
      if (next > this.peakToday) this.peakToday = next;
    }
    return { delta };
  }

  public toggleEsp32Connection(connected: boolean) {
    this.systemDiagnostics.esp32Status = connected ? 'CONNECTED' : 'DISCONNECTED';
    this.systemDiagnostics.wifiStatus = connected ? 'CONNECTED' : 'DISCONNECTED';
    this.sensorEntry.status = connected ? 'ONLINE' : 'OFFLINE';
    this.sensorExit.status = connected ? 'ONLINE' : 'OFFLINE';

    this.recordActivity(
      'ALERT',
      connected
        ? 'ESP32 telemetry link restored. Both IR break-beam sensors synchronized.'
        : 'ESP32 Wi-Fi disconnected. Operating on cached telemetry fallback.',
      0
    );

    this.addNotification(
      connected ? 'ESP32 Connected' : 'ESP32 Hardware Disconnected',
      connected
        ? 'NodeMCU telemetry feed online and streaming real-time IR sensor packets.'
        : 'Telemetry feed dropped. Check power supply to NodeMCU and 2.4GHz WiFi link.',
      connected ? 'SUCCESS' : 'CRITICAL'
    );
  }

  private appendHistoryPoint() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const mins = now.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hours}:${mins}`;

    // Update or append point
    const last = this.historyPoints[this.historyPoints.length - 1];
    if (last && last.time === timeStr) {
      last.count = this.currentQueue;
      last.status = this.calculateCrowdStatus(this.currentQueue);
    } else {
      this.historyPoints.push({
        time: timeStr,
        timestamp: now.getTime(),
        count: this.currentQueue,
        status: this.calculateCrowdStatus(this.currentQueue)
      });
      // Keep last 16 points (~32 minutes)
      if (this.historyPoints.length > 16) {
        this.historyPoints.shift();
      }
    }
  }

  private recordActivity(type: ActivityLog['type'], message: string, delta: number) {
    const item: ActivityLog = {
      id: 'act-' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date(),
      type,
      message,
      delta
    };
    this.activityLogs.unshift(item);
    if (this.activityLogs.length > 30) {
      this.activityLogs.pop();
    }
  }

  public addNotification(title: string, message: string, level: NotificationItem['level']) {
    const item: NotificationItem = {
      id: 'notif-' + Math.random().toString(36).substring(2, 9),
      title,
      message,
      level,
      timestamp: new Date(),
      read: false
    };
    this.notifications.unshift(item);
    if (this.notifications.length > 15) {
      this.notifications.pop();
    }
  }

  public markNotificationAsRead(id: string) {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) notif.read = true;
  }

  public markAllNotificationsAsRead() {
    this.notifications.forEach((n) => (n.read = true));
  }
}

export const simulationEngine = new SimulationEngine();
