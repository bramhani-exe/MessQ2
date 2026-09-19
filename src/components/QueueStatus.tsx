import React from 'react';
import {
  CheckCircle2,
  Clock,
  Coffee,
  Flame,
  Info,
  Layers,
  Sparkles,
  Users,
  Utensils
} from 'lucide-react';
import { CrowdStatus, QueueState, QueueThresholdConfig } from '../types/messq';

interface QueueStatusProps {
  queue: QueueState;
  thresholds: QueueThresholdConfig;
  onOpenSettings?: () => void;
}

export const QueueStatus: React.FC<QueueStatusProps> = ({
  queue,
  thresholds
}) => {
  const { queueCount, estimatedWaitMinutes, crowdStatus, capacity } = queue;

  // Percentage of max capacity
  const capacityPercent = Math.min(100, Math.round((queueCount / capacity) * 100));

  // Determine current active meal window for easy student glance
  const getCurrentMealWindow = () => {
    const hour = new Date().getHours() + new Date().getMinutes() / 60;
    if (hour >= 7.0 && hour < 9.0) {
      return { name: 'Breakfast', timing: '7:00 AM to 9:00 AM', active: true };
    }
    if (hour >= 12.5 && hour < 14.0) {
      return { name: 'Lunch', timing: '12:30 PM to 2:00 PM', active: true };
    }
    if (hour >= 16.75 && hour < 18.25) {
      return { name: 'Snacks', timing: '4:45 PM to 6:15 PM', active: true };
    }
    if (hour >= 19.25 && hour < 21.0) {
      return { name: 'Dinner', timing: '7:15 PM to 9:00 PM', active: true };
    }

    if (hour < 7.0) return { name: 'Next: Breakfast', timing: '7:00 AM to 9:00 AM', active: false };
    if (hour < 12.5) return { name: 'Next: Lunch', timing: '12:30 PM to 2:00 PM', active: false };
    if (hour < 16.75) return { name: 'Next: Snacks', timing: '4:45 PM to 6:15 PM', active: false };
    if (hour < 19.25) return { name: 'Next: Dinner', timing: '7:15 PM to 9:00 PM', active: false };
    return { name: 'Next: Breakfast', timing: 'Tomorrow 7:00 AM to 9:00 AM', active: false };
  };

  const mealWindow = getCurrentMealWindow();

  // Status visual configurations
  const statusConfig = {
    LOW: {
      label: 'LOW',
      badgeBg: 'bg-emerald-950/80',
      badgeBorder: 'border-emerald-500/40',
      badgeText: 'text-emerald-300',
      dotColor: 'bg-emerald-400',
      icon: CheckCircle2,
      desc: 'Quick service! Almost no line at the counters right now.',
      accentBar: 'bg-emerald-500'
    },
    MODERATE: {
      label: 'MODERATE',
      badgeBg: 'bg-amber-950/80',
      badgeBorder: 'border-amber-500/40',
      badgeText: 'text-amber-300',
      dotColor: 'bg-amber-400',
      icon: Info,
      desc: 'Normal flow. Lines are moving fast and steady.',
      accentBar: 'bg-amber-500'
    },
    HIGH: {
      label: 'HIGH',
      badgeBg: 'bg-red-950/80',
      badgeBorder: 'border-red-500/40',
      badgeText: 'text-red-300',
      dotColor: 'bg-red-400',
      icon: Flame,
      desc: 'Peak rush! You may have to wait a few minutes.',
      accentBar: 'bg-red-500'
    }
  }[crowdStatus];

  const StatusIcon = statusConfig.icon;

  const totalSegments = 20;
  const filledSegments = Math.min(totalSegments, Math.round((queueCount / capacity) * totalSegments));

  return (
    <section
      id="main-queue-status-section"
      className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-6 shadow-md"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800/80">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-semibold">
            LH2 Dining Hall
          </span>
          <h2 className="text-lg sm:text-2xl font-bold text-white font-mono flex items-center gap-2">
            Current Queue (approx.)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Approximate count of students waiting in line right now
          </p>
        </div>

        {/* Current Active Meal */}
        <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono">
          <Utensils className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-200 font-bold">{mealWindow.name}</span>
              {mealWindow.active ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ) : (
                <span className="text-[10px] text-slate-400">(Upcoming)</span>
              )}
            </div>
            <span className="text-[10px] text-slate-400">{mealWindow.timing}</span>
          </div>
        </div>
      </div>

      {/* Official Mess Timings Reference Bar (4 Meals) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5 font-mono text-xs">
        <div className="flex flex-col px-3 py-2 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 text-[10px] flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            Breakfast
          </span>
          <span className="text-slate-200 font-semibold text-xs mt-0.5">7:00 AM – 9:00 AM</span>
        </div>

        <div className="flex flex-col px-3 py-2 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 text-[10px] flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400" />
            Lunch
          </span>
          <span className="text-slate-200 font-semibold text-xs mt-0.5">12:30 PM – 2:00 PM</span>
        </div>

        <div className="flex flex-col px-3 py-2 bg-slate-950 rounded-xl border border-emerald-500/30 bg-emerald-950/10">
          <span className="text-emerald-400 text-[10px] flex items-center gap-1 font-semibold">
            <Coffee className="w-3 h-3 text-emerald-400" />
            Snacks (Common)
          </span>
          <span className="text-emerald-300 font-semibold text-xs mt-0.5">4:45 PM – 6:15 PM</span>
        </div>

        <div className="flex flex-col px-3 py-2 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 text-[10px] flex items-center gap-1">
            <Clock className="w-3 h-3 text-purple-400" />
            Dinner
          </span>
          <span className="text-slate-200 font-semibold text-xs mt-0.5">7:15 PM – 9:00 PM</span>
        </div>
      </div>

      {/* 3 Core Metric Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5">
        {/* Metric 1: Current Queue (approx.) */}
        <div
          id="metric-current-queue"
          className="bg-slate-950 border border-slate-800 rounded-xl p-4 sm:p-5 relative group hover:border-slate-700 transition-colors shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              Waiting in Line
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Live
            </span>
          </div>

          <div className="flex items-baseline space-x-2 my-1">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white">
              ~{queueCount}
            </span>
            <span className="text-xs sm:text-sm font-medium text-slate-400">
              students (approx.)
            </span>
          </div>

          <div className="mt-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800/60 font-mono">
            Line fullness: ~{capacityPercent}%
          </div>
        </div>

        {/* Metric 2: Estimated Wait Time (approx.) */}
        <div
          id="metric-estimated-wait"
          className="bg-slate-950 border border-slate-800 rounded-xl p-4 sm:p-5 relative group hover:border-slate-700 transition-colors shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              Expected Wait
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Average
            </span>
          </div>

          <div className="flex items-baseline space-x-2 my-1">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white">
              ~{estimatedWaitMinutes}
            </span>
            <span className="text-xs sm:text-sm font-medium text-slate-400">
              mins wait (approx.)
            </span>
          </div>

          <div className="mt-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800/60 font-mono">
            3 Serving counters open
          </div>
        </div>

        {/* Metric 3: Crowd Level */}
        <div
          id="metric-crowd-status"
          className={`bg-slate-950 border ${statusConfig.badgeBorder} rounded-xl p-4 sm:p-5 relative group transition-all shadow-sm`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              Crowd Status
            </span>
          </div>

          <div className="flex items-center space-x-2 my-1">
            <div
              className={`inline-flex items-center space-x-2 px-3 py-1 rounded-lg border ${statusConfig.badgeBg} ${statusConfig.badgeBorder} ${statusConfig.badgeText}`}
            >
              <StatusIcon className="w-4 h-4 shrink-0" />
              <span className="text-base sm:text-lg font-bold font-mono tracking-wide">
                {crowdStatus}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800/60 leading-relaxed">
            {statusConfig.desc}
          </p>
        </div>
      </div>

      {/* Simplified Queue Visual Level */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 sm:p-4">
        <div className="flex items-center justify-between mb-1.5 text-xs font-mono">
          <span className="text-slate-300 font-semibold">
            Line Crowd Indicator (approx.)
          </span>
          <span className="text-slate-400">
            ~<strong className="text-white">{queueCount}</strong> people
          </span>
        </div>

        {/* Progress Bar Segments */}
        <div className="grid grid-cols-10 sm:grid-cols-20 gap-1 my-2">
          {Array.from({ length: totalSegments }).map((_, idx) => {
            const isFilled = idx < filledSegments;
            let barColor = 'bg-slate-800/60';
            if (isFilled) {
              if (crowdStatus === 'LOW') barColor = 'bg-emerald-500';
              else if (crowdStatus === 'MODERATE') barColor = idx < 6 ? 'bg-emerald-500' : 'bg-amber-500';
              else barColor = idx < 6 ? 'bg-emerald-500' : idx < 13 ? 'bg-amber-500' : 'bg-red-500';
            }

            return (
              <div
                key={idx}
                className={`h-3.5 sm:h-4 rounded-sm transition-all duration-200 ${barColor}`}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            LOW (No waiting)
          </span>
          <span className="text-amber-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            MODERATE (Short line)
          </span>
          <span className="text-red-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
            HIGH (Busy)
          </span>
        </div>
      </div>
    </section>
  );
};
