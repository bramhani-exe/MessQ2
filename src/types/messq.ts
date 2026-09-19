export type CrowdStatus = 'LOW' | 'MODERATE' | 'HIGH';

export interface QueueState {
  queueCount: number;
  capacity: number;
  estimatedWaitMinutes: number;
  crowdStatus: CrowdStatus;
  averageServiceRatePerMin: number;
  lastUpdated: Date;
  peakToday: number;
  averageToday: number;
  totalServedToday: number;
  entryRate5Min: number;
  exitRate5Min: number;
  servingCountersActive: number;
}

export interface SensorState {
  id: string;
  name: string;
  pin: string;
  role: 'ENTRY' | 'EXIT';
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  lastTriggered: Date | null;
  responseLatencyMs: number;
  triggerCountToday: number;
  signalStrength: number; // 0-100%
}

export interface SystemDiagnostics {
  esp32Status: 'CONNECTED' | 'DISCONNECTED' | 'RECONNECTING';
  wifiStatus: 'CONNECTED' | 'DISCONNECTED';
  rssi: number; // dBm, e.g. -62
  ipAddress: string;
  macAddress: string;
  firmwareVersion: string;
  uptimeSeconds: number;
  lastPacketTimestamp: Date;
  transmissionQuality: 'STABLE' | 'LATENCY_SPIKE' | 'UNSTABLE';
  packetsReceived: number;
  packetsLost: number;
  brokerProtocol: string;
  rawLastPayload: Record<string, unknown>;
}

export interface ActivityLog {
  id: string;
  timestamp: Date;
  type: 'ENTRY' | 'EXIT' | 'SYSTEM' | 'ALERT' | 'HEARTBEAT';
  message: string;
  delta: number;
}

export interface QueueDataPoint {
  time: string;
  timestamp: number;
  count: number;
  status: CrowdStatus;
}

export type MealType = 'BREAKFAST' | 'LUNCH' | 'SNACKS' | 'DINNER';
export type FoodSegment = 'VEG' | 'NON_VEG' | 'SPECIAL';

export interface MenuItem {
  id: string;
  name: string;
  category: 'staple' | 'curry' | 'bread' | 'beverage' | 'dessert' | 'sides' | 'snack' | 'salad' | 'soup';
  segment: FoodSegment;
  isVeg: boolean;
  isSpecial?: boolean;
  portionNote?: string;
  calories?: number;
}

export interface MealSchedule {
  id: MealType;
  title: string;
  timing: string;
  startTimeHour: number; // 24-hr format
  endTimeHour: number;
  items: MenuItem[];
}

export interface DayMenuSchedule {
  dayName: string;
  datesText: string;
  meals: MealSchedule[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  level: 'INFO' | 'SUCCESS' | 'WARNING' | 'CRITICAL';
  timestamp: Date;
  read: boolean;
}

export interface QueueThresholdConfig {
  lowMax: number; // default 10
  moderateMax: number; // default 25
  maxCapacity: number; // default 40
  serviceSpeedSeconds: number; // avg seconds per person, default 28s
}

export interface UserProfile {
  id: string;
  name: string;
  rollNumber: string;
  role: 'STUDENT' | 'WARDEN' | 'MESS_ADMIN';
  hostelBlock: string;
  roomNumber: string;
}
