import React, { useState } from 'react';
import {
  ArrowRight,
  Clock,
  Cpu,
  ChevronDown,
  ChevronUp,
  Info,
  Utensils
} from 'lucide-react';
import { QueueState, QueueThresholdConfig } from '../types/messq';
import { LiveHardwareTelemetry } from '../services/liveQueueService';
import { FULL_WEEK_MENU } from '../data/mockMenu';

interface QueueStatusProps {
  queue: QueueState;
  thresholds: QueueThresholdConfig;
  isLoading?: boolean;
  rawTelemetry?: LiveHardwareTelemetry | null;
  onOpenResetModal?: () => void;
  onOpenSettings?: () => void;
  onNavigateToMenu?: () => void;
}

export const QueueStatus: React.FC<QueueStatusProps> = ({
  queue,
  thresholds,
  isLoading = false,
  rawTelemetry,
  onOpenResetModal,
  onOpenSettings,
  onNavigateToMenu
}) => {
  const { queueCount, estimatedWaitMinutes, crowdStatus } = queue;
  const [hardwareDetailsOpen, setHardwareDetailsOpen] = useState(false);

  // Daily meal schedule definitions (4:45 PM – 6:15 PM for Evening Snacks)
  const MEAL_SCHEDULE = [
    { id: 'BREAKFAST', name: 'Breakfast', timing: '7:00 AM – 9:00 AM', start: 7.0, end: 9.0 },
    { id: 'LUNCH', name: 'Lunch', timing: '12:30 PM – 2:00 PM', start: 12.5, end: 14.0 },
    { id: 'SNACKS', name: 'Evening Snacks', timing: '4:45 PM – 6:15 PM', start: 16.75, end: 18.25 },
    { id: 'DINNER', name: 'Dinner', timing: '7:15 PM – 9:00 PM', start: 19.25, end: 21.0 }
  ];

  // Helper to determine active or next meal window
  const getCurrentMealWindow = () => {
    const hour = new Date().getHours() + new Date().getMinutes() / 60;
    const current = MEAL_SCHEDULE.find((m) => hour >= m.start && hour < m.end);
    if (current) {
      return { ...current, status: 'SERVING_NOW' as const };
    }

    if (hour < 7.0) return { ...MEAL_SCHEDULE[0], status: 'UPCOMING' as const };
    if (hour < 12.5) return { ...MEAL_SCHEDULE[1], status: 'UPCOMING' as const };
    if (hour < 16.75) return { ...MEAL_SCHEDULE[2], status: 'UPCOMING' as const };
    if (hour < 19.25) return { ...MEAL_SCHEDULE[3], status: 'UPCOMING' as const };
    return { ...MEAL_SCHEDULE[0], status: 'TOMORROW' as const };
  };

  const currentWindow = getCurrentMealWindow();

  // Status visual configurations (Food-Inspired Palette: Basil Green, Warm Crust Amber, Tomato Red)
  const statusConfig = {
    LOW: {
      label: 'Low Density',
      bgClass: 'bg-[#ebf5ee]',
      borderClass: 'border-[#b7dfc4]',
      textClass: 'text-[#1b5e35]',
      barClass: 'bg-[#236b3d]',
      gaugePercent: 28,
      desc: 'Low density: Plenty of seating, minimal wait at the counter.'
    },
    MODERATE: {
      label: 'Moderate Density',
      bgClass: 'bg-[#fcf5e8]',
      borderClass: 'border-[#ebd4b2]',
      textClass: 'text-[#855314]',
      barClass: 'bg-[#c9741f]',
      gaugePercent: 62,
      desc: 'Moderate density: Moving steadily across active serving stations.'
    },
    HIGH: {
      label: 'High Density',
      bgClass: 'bg-[#fdf2f0]',
      borderClass: 'border-[#f5c7c1]',
      textClass: 'text-[#a82a1b]',
      barClass: 'bg-[#c53727]',
      gaugePercent: 92,
      desc: 'High density: Expect a short wait at the counter during the meal rush.'
    }
  }[crowdStatus];

  // Sensor state from authoritative telemetry
  const totalEntries = rawTelemetry ? rawTelemetry.entries : queue.entryRate5Min;
  const totalExits = rawTelemetry ? rawTelemetry.exits : queue.totalServedToday;
  const ir1Active = rawTelemetry ? rawTelemetry.ir1_state === 1 : false;
  const ir2Active = rawTelemetry ? rawTelemetry.ir2_state === 1 : false;

  // Meal highlights preview for today
  const todaysSchedule = FULL_WEEK_MENU.thursday;
  const activeMealPlan =
    todaysSchedule.meals.find((m) => m.id === currentWindow.id) || todaysSchedule.meals[0];
  const sampleHighlights = activeMealPlan.items.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* 1. LIVE QUEUE COUNT (Appears immediately after dashboard) */}
      <section className="bg-white border border-[#e5dac6] rounded-lg shadow-xs overflow-hidden">
        <div className="p-6 sm:p-8 bg-[#faf7f0]">
          <div className="flex items-center space-x-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#236b3d] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-[#236b3d] font-bold">
              Live Queue Count
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline gap-3 my-2">
            {isLoading ? (
              <div className="text-6xl sm:text-7xl font-bold font-mono text-[#d8c8af] animate-pulse">
                --
              </div>
            ) : (
              <div className="text-6xl sm:text-7xl lg:text-8xl font-black font-mono tracking-tight text-[#1e231d] tabular-nums">
                {queueCount}
              </div>
            )}
            <div className="text-base sm:text-lg font-medium text-[#4d534b]">
              students currently in line
            </div>
          </div>

          {/* EXACT Required Disclaimer Text */}
          <div className="mt-4 pt-3 border-t border-[#ebdcc7] flex items-start space-x-2">
            <Info className="w-4 h-4 text-[#8b9187] shrink-0 mt-0.5" />
            <p className="text-xs text-[#596055] leading-relaxed font-sans">
              Approximate count. Actual waiting time and queue size may vary. People currently waiting in the queue.
            </p>
          </div>
        </div>
      </section>

      {/* 2. CROWD DENSITY (Without capacity: 45 diners) */}
      <section className="bg-white border border-[#e5dac6] rounded-lg p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <span className="text-xs font-mono uppercase tracking-wider text-[#6b7267] font-semibold">
            Crowd Density
          </span>
          <span
            className={`px-3 py-1 rounded-md text-xs font-semibold font-mono border ${statusConfig.bgClass} ${statusConfig.borderClass} ${statusConfig.textClass}`}
          >
            {statusConfig.label}
          </span>
        </div>

        {/* Visual Occupancy Gauge */}
        <div className="w-full bg-[#f3ece0] h-2.5 rounded-full overflow-hidden mb-3">
          <div
            className={`h-full transition-all duration-500 rounded-full ${statusConfig.barClass}`}
            style={{ width: `${statusConfig.gaugePercent}%` }}
          />
        </div>

        <p className="text-xs sm:text-sm text-[#4d534b] leading-relaxed">
          {statusConfig.desc}
        </p>
      </section>

      {/* 3. ESTIMATED WAITING TIME */}
      <section className="bg-white border border-[#e5dac6] rounded-lg p-5 sm:p-6 shadow-xs bg-[#fbf9f4]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#6b7267] font-semibold">
            Estimated Waiting Time
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="font-heading text-3xl sm:text-4xl font-bold text-[#1e231d] tabular-nums">
              {isLoading ? '--' : queueCount === 0 ? '0' : estimatedWaitMinutes}
            </span>
            <span className="text-xs sm:text-sm font-medium text-[#4d534b]">
              {queueCount === 0 ? 'min (immediate)' : 'minutes'}
            </span>
          </div>
        </div>

        <p className="text-xs text-[#7a8077] leading-relaxed font-sans">
          Calculated from current queue count and average serving rate across active counters.
        </p>
      </section>

      {/* 4. DAILY DINING SCHEDULE */}
      <section className="bg-white border border-[#e5dac6] rounded-lg p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-[#f0e7d7] gap-2">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-[#236b3d]" />
            <h2 className="font-heading font-semibold text-sm sm:text-base text-[#1e231d]">
              Daily Dining Schedule
            </h2>
          </div>
          <span className="text-xs font-mono text-[#6b7267]">
            {currentWindow.status === 'SERVING_NOW'
              ? `Currently Serving: ${currentWindow.name}`
              : `Upcoming: ${currentWindow.name} (${currentWindow.timing})`}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {MEAL_SCHEDULE.map((meal) => {
            const isCurrent = meal.id === currentWindow.id && currentWindow.status === 'SERVING_NOW';
            const isNext = meal.id === currentWindow.id && currentWindow.status !== 'SERVING_NOW';

            return (
              <div
                key={meal.id}
                className={`p-3 rounded-md border text-xs transition-colors ${
                  isCurrent
                    ? 'bg-[#ebf5ee] border-[#b7dfc4] text-[#1b5e35]'
                    : isNext
                    ? 'bg-[#fcf5e8] border-[#ebd4b2] text-[#855314]'
                    : 'bg-white border-[#e5dac6] text-[#4d534b]'
                }`}
              >
                <div className="flex items-center justify-between font-medium">
                  <span className="font-semibold">{meal.name}</span>
                  {isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-[#236b3d]" title="Service Active" />
                  )}
                </div>
                <div className="text-[11px] font-mono text-[#7a8077] mt-1">
                  {meal.timing}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. TODAY'S MESS HIGHLIGHTS PREVIEW (Keep as it is) */}
      <section className="bg-white border border-[#e5dac6] rounded-lg p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-[#f0e7d7] gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <Utensils className="w-4 h-4 text-[#c53727]" />
              <h3 className="font-heading font-semibold text-base text-[#1e231d]">
                Today&apos;s Menu Highlights: {activeMealPlan.title}
              </h3>
            </div>
            <p className="text-xs text-[#6b7267] mt-0.5">
              Serving window: {activeMealPlan.timing} (Vegetarian, Non-Veg, and Special)
            </p>
          </div>

          {onNavigateToMenu && (
            <button
              onClick={onNavigateToMenu}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-[#c53727] hover:bg-[#a82a1b] text-white text-xs font-medium transition-colors shadow-xs"
            >
              <span>View Full Mess Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {sampleHighlights.map((dish) => (
            <div
              key={dish.id}
              className="p-3 rounded-md bg-[#faf7f0] border border-[#e5dac6] text-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span
                    className={`font-semibold ${
                      dish.segment === 'NON_VEG'
                        ? 'text-[#8a5a18]'
                        : dish.segment === 'SPECIAL'
                        ? 'text-[#c53727]'
                        : 'text-[#1b5e35]'
                    }`}
                  >
                    {dish.segment}
                  </span>
                  {dish.portionNote && (
                    <span className="text-[#8b9187]">{dish.portionNote}</span>
                  )}
                </div>
                <h4 className="font-medium text-[#1e231d] leading-snug">
                  {dish.name}
                </h4>
              </div>
              <span className="text-[10px] font-mono text-[#8b9187] mt-2">
                ~{dish.calories} kcal
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. COMPACT COLLAPSIBLE HARDWARE DETAILS */}
      <section className="bg-white border border-[#e5dac6] rounded-lg shadow-xs overflow-hidden">
        <button
          onClick={() => setHardwareDetailsOpen(!hardwareDetailsOpen)}
          className="w-full px-5 py-3.5 flex items-center justify-between bg-[#faf7f0] hover:bg-[#f5efe3] transition-colors text-left"
        >
          <div className="flex items-center space-x-2 text-xs font-mono text-[#2a2f29]">
            <Cpu className="w-4 h-4 text-[#236b3d]" />
            <span className="font-semibold uppercase tracking-wider">
              Hardware Details & Sensor Telemetry
            </span>
            <span className="text-[#7a8077] hidden sm:inline">
              (ESP32 Break-Beam Optical Sensors)
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs text-[#6b7267] font-mono">
            <span>{hardwareDetailsOpen ? 'Hide' : 'Show Details'}</span>
            {hardwareDetailsOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </button>

        {hardwareDetailsOpen && (
          <div className="p-5 sm:p-6 border-t border-[#e5dac6] bg-white space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3 bg-[#faf7f0] rounded-md border border-[#e5dac6]">
                <span className="text-[10px] text-[#8b9187] block uppercase">Controller</span>
                <span className="font-semibold text-[#1e231d]">
                  {rawTelemetry?.device_id || 'ESP32_MESS_Q01'}
                </span>
                <span className="text-[10px] text-[#1b5e35] block mt-0.5">
                  {rawTelemetry?.esp32_online ? 'Hardware Online' : 'Active'}
                </span>
              </div>

              <div className="p-3 bg-[#faf7f0] rounded-md border border-[#e5dac6]">
                <span className="text-[10px] text-[#8b9187] block uppercase">Wi-Fi RSSI</span>
                <span className="font-semibold text-[#1e231d]">
                  {rawTelemetry?.rssi ? `${rawTelemetry.rssi} dBm` : '-62 dBm'}
                </span>
                <span className="text-[10px] text-[#7a8077] block mt-0.5">Campus Network</span>
              </div>

              <div className="p-3 bg-[#faf7f0] rounded-md border border-[#e5dac6]">
                <span className="text-[10px] text-[#8b9187] block uppercase">Entry Sensor (GPIO 34)</span>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span
                    className={`w-2 h-2 rounded-full ${ir1Active ? 'bg-[#236b3d]' : 'bg-[#ded2be]'}`}
                  />
                  <span className="font-semibold text-[#1e231d]">
                    {totalEntries} Total Entries
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#faf7f0] rounded-md border border-[#e5dac6]">
                <span className="text-[10px] text-[#8b9187] block uppercase">Exit Sensor (GPIO 35)</span>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span
                    className={`w-2 h-2 rounded-full ${ir2Active ? 'bg-[#236b3d]' : 'bg-[#ded2be]'}`}
                  />
                  <span className="font-semibold text-[#1e231d]">
                    {totalExits} Total Exits
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#f0e7d7] text-xs">
              <span className="text-[#6b7267] text-[11px]">
                Optical break-beam sensors count doorway crossings without recording personal identity.
              </span>
              {onOpenResetModal && (
                <button
                  onClick={onOpenResetModal}
                  className="px-2.5 py-1 text-xs font-mono text-[#6b7267] hover:text-[#c53727] hover:bg-[#fdf2f0] border border-[#e5dac6] rounded-md transition-colors"
                >
                  Calibrate Counter (Reset)
                </button>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
