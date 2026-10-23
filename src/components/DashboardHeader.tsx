import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  RefreshCw,
  Utensils
} from 'lucide-react';
import { QueueState } from '../types/messq';
import { MESS_HALL_NAME } from '../data/mockMenu';
import { HardwareConnectionState } from '../services/liveQueueService';

interface DashboardHeaderProps {
  queue: QueueState;
  onRefresh: () => void;
  lastUpdated: Date;
  connectionStatus: HardwareConnectionState;
  isLiveHardware: boolean;
  lastAgeSeconds?: number;
  selectedHostel?: string;
}

const MEAL_SCHEDULE = [
  { id: 'BREAKFAST', name: 'Breakfast', timing: '7:00 AM – 9:00 AM', start: 7.0, end: 9.0 },
  { id: 'LUNCH', name: 'Lunch', timing: '12:30 PM – 2:00 PM', start: 12.5, end: 14.0 },
  { id: 'SNACKS', name: 'Evening Snacks', timing: '4:45 PM – 6:15 PM', start: 16.75, end: 18.25 },
  { id: 'DINNER', name: 'Dinner', timing: '7:15 PM – 9:00 PM', start: 19.25, end: 21.0 }
];

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  queue,
  onRefresh,
  lastUpdated,
  connectionStatus,
  isLiveHardware,
  lastAgeSeconds = 0,
  selectedHostel = 'LH2'
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [secondsAgo, setSecondsAgo] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      const diffSec = Math.floor((now.getTime() - new Date(lastUpdated).getTime()) / 1000);
      setSecondsAgo(Math.max(0, diffSec));
    }, 1000);
    return () => clearInterval(timer);
  }, [lastUpdated]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 700);
  };

  const currentMealWindow = (() => {
    const hour = currentTime.getHours() + currentTime.getMinutes() / 60;
    const current = MEAL_SCHEDULE.find((m) => hour >= m.start && hour < m.end);
    if (current) {
      return { ...current, status: 'SERVING_NOW' as const };
    }
    if (hour < 7.0) return { ...MEAL_SCHEDULE[0], status: 'UPCOMING' as const };
    if (hour < 12.5) return { ...MEAL_SCHEDULE[1], status: 'UPCOMING' as const };
    if (hour < 16.75) return { ...MEAL_SCHEDULE[2], status: 'UPCOMING' as const };
    if (hour < 19.25) return { ...MEAL_SCHEDULE[3], status: 'UPCOMING' as const };
    return { ...MEAL_SCHEDULE[0], status: 'TOMORROW' as const };
  })();

  const getStatusBadge = () => {
    if (!isLiveHardware) {
      return (
        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-[#fcf5e8] border border-[#ebd4b2] text-[#855314]">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>SIMULATION PREVIEW</span>
        </span>
      );
    }

    switch (connectionStatus) {
      case 'CONNECTED':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-[#ebf5ee] border border-[#b7dfc4] text-[#1b5e35]">
            <span className="w-2 h-2 rounded-full bg-[#236b3d] animate-pulse" />
            <span>HARDWARE LIVE</span>
          </span>
        );
      case 'STALE':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-[#fcf5e8] border border-[#ebd4b2] text-[#855314]">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>STALE ({lastAgeSeconds}s ago)</span>
          </span>
        );
      case 'OFFLINE':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-stone-100 border border-[#e5dac6] text-[#4d534b]">
            <span className="w-2 h-2 rounded-full bg-stone-400" />
            <span>ESP32 OFFLINE</span>
          </span>
        );
      case 'ERROR':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-[#fdf2f0] border border-[#f5c7c1] text-[#a82a1b]">
            <span className="w-2 h-2 rounded-full bg-[#c53727]" />
            <span>API RECONNECTING...</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-stone-100 border border-[#e5dac6] text-[#4d534b]">
            <span className="w-2 h-2 rounded-full bg-stone-400" />
            <span>CONNECTING...</span>
          </span>
        );
    }
  };

  const hostelName = selectedHostel === 'LH2' ? MESS_HALL_NAME : `${selectedHostel} Mess`;
  const hostelSublabel = selectedHostel === 'LH2' ? 'Ladies Hostel 2' : `Hostel Block ${selectedHostel}`;

  return (
    <div className="bg-white border border-[#e5dac6] rounded-lg mb-5 p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3.5 border-b border-[#f0e7d7]">
        {/* Hostel Identity & Description */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-[#1e231d]">
              {hostelName}
            </h1>
            <span className="text-xs font-semibold font-mono text-[#8c2210] bg-[#fbf1ea] px-2.5 py-0.5 rounded-md border border-[#ebd0be]">
              {hostelSublabel}
            </span>
          </div>
          <p className="text-xs text-[#4d534b]">
            Real-time queue monitoring and daily hostel dining menu.
          </p>
        </div>

        {/* Live Hardware Status and Serving Window Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {getStatusBadge()}

          <span className="text-xs text-[#596055] flex items-center gap-1.5 font-mono bg-[#faf7f0] px-2.5 py-1 rounded-md border border-[#e5dac6]">
            <Clock className="w-3.5 h-3.5 text-[#8b9187]" />
            {secondsAgo === 0 ? 'Updated just now' : `Updated ${secondsAgo}s ago`}
          </span>

          <span
            className={`text-xs flex items-center gap-1.5 font-mono px-2.5 py-1 rounded-md border ${
              currentMealWindow.status === 'SERVING_NOW'
                ? 'bg-[#ebf5ee] border-[#b7dfc4] text-[#1b5e35]'
                : 'bg-[#faf7f0] border-[#e5dac6] text-[#6b7267]'
            }`}
          >
            <Utensils className="w-3 h-3 text-[#c53727]" />
            {currentMealWindow.status === 'SERVING_NOW' ? (
              <span>Serving Now: {currentMealWindow.name}</span>
            ) : (
              <span>Next: {currentMealWindow.name} ({currentMealWindow.timing})</span>
            )}
          </span>
        </div>
      </div>

      {/* Date, Time & Manual Refresh Action Bar */}
      <div className="flex items-center justify-between gap-3 pt-3">
        <div className="flex items-center gap-2 sm:gap-3 text-xs text-[#4d534b] font-mono bg-[#faf7f0] px-3 py-1.5 rounded-md border border-[#e5dac6]">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#7a8077]" />
            {currentTime.toLocaleDateString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            })}
          </span>
          <span className="text-[#ded2be]">|</span>
          <span className="font-semibold text-[#1e231d] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#7a8077]" />
            {currentTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </span>
        </div>

        <button
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          title="Poll latest queue telemetry from ESP32"
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono text-[#4d534b] hover:text-[#c53727] bg-[#faf7f0] hover:bg-[#f6f0e4] border border-[#e5dac6] rounded-md transition-colors shadow-xs"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#c53727]' : ''}`}
          />
          <span className="hidden sm:inline">Refresh Data</span>
        </button>
      </div>
    </div>
  );
};
