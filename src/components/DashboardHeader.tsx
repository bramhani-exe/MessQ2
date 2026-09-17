import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  RefreshCw,
  Sparkles,
  Users,
  Utensils
} from 'lucide-react';
import { QueueState } from '../types/messq';
import { CHIEF_WARDEN_NAME, MESS_HALL_NAME } from '../data/mockMenu';

interface DashboardHeaderProps {
  queue: QueueState;
  onRefresh: () => void;
  lastUpdated: Date;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  queue,
  onRefresh,
  lastUpdated
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [secondsAgo, setSecondsAgo] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      const diffSec = Math.floor((Date.now() - new Date(lastUpdated).getTime()) / 1000);
      setSecondsAgo(Math.max(0, diffSec));
    }, 1000);
    return () => clearInterval(timer);
  }, [lastUpdated]);

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left: LH2 Mess Title & Purpose */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {/* Live Indicator */}
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE</span>
            </div>

            <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Updated {secondsAgo === 0 ? 'just now' : `${secondsAgo}s ago`}
            </span>

            <span className="hidden sm:inline text-slate-700">•</span>

            <span className="text-xs text-cyan-400 font-mono hidden sm:inline">
              Hostel Dining Live Status
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono flex items-center gap-2.5">
            <Utensils className="w-6 h-6 text-cyan-400 inline-block" />
            <span>{MESS_HALL_NAME}</span>
            <span className="text-xs font-normal font-sans text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
              Ladies Hostel 2
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Real-time crowd status & daily dining menu schedule for students.
          </p>
        </div>

        {/* Right: Clock & Refresh */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/70">
          <div className="flex items-center space-x-3 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {currentTime.toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })}
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-200 font-medium tracking-wider">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>

          <button
            id="btn-refresh-telemetry"
            onClick={onRefresh}
            title="Refresh queue status"
            className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-xl transition-colors border border-slate-800 hover:border-slate-700"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Student Friendly Quick Info Strip */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        <div className="flex items-center space-x-2 text-slate-400">
          <Users className="w-3.5 h-3.5 text-cyan-400" />
          <span>Serving Counters:</span>
          <span className="font-mono text-slate-200 font-medium">{queue.servingCountersActive} Open Counters</span>
        </div>
        <div className="flex items-center space-x-2 text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Chief Warden:</span>
          <span className="font-mono text-slate-200 font-medium">{CHIEF_WARDEN_NAME}</span>
        </div>
        <div className="col-span-2 sm:col-span-1 flex items-center space-x-2 text-slate-400">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Snacks:</span>
          <span className="font-mono text-emerald-300 font-medium">4:45 PM – 6:15 PM</span>
        </div>
      </div>
    </div>
  );
};
