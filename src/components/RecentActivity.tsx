import React from 'react';
import {
  Activity,
  ArrowDownCircle,
  ArrowUpCircle,
  CheckCircle2,
  Clock,
  History,
  Radio,
  Wifi
} from 'lucide-react';
import { ActivityLog } from '../types/messq';

interface RecentActivityProps {
  logs: ActivityLog[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ logs }) => {
  const getLogBadge = (log: ActivityLog) => {
    switch (log.type) {
      case 'ENTRY':
        return {
          icon: ArrowUpCircle,
          color: 'text-cyan-400',
          bg: 'bg-cyan-950/70 border-cyan-800/60',
          label: 'ENTRY'
        };
      case 'EXIT':
        return {
          icon: ArrowDownCircle,
          color: 'text-emerald-400',
          bg: 'bg-emerald-950/70 border-emerald-800/60',
          label: 'EXIT'
        };
      case 'ALERT':
        return {
          icon: Radio,
          color: 'text-amber-400',
          bg: 'bg-amber-950/70 border-amber-800/60',
          label: 'ALERT'
        };
      case 'HEARTBEAT':
        return {
          icon: Wifi,
          color: 'text-blue-400',
          bg: 'bg-blue-950/70 border-blue-800/60',
          label: 'HEARTBEAT'
        };
      default:
        return {
          icon: CheckCircle2,
          color: 'text-slate-400',
          bg: 'bg-slate-900 border-slate-800',
          label: 'SYSTEM'
        };
    }
  };

  return (
    <section
      id="recent-activity-section"
      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 mb-6 shadow-md"
    >
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-semibold flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" />
            Live Queue Feed
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-white font-mono">
            Recent Mess Activity
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Showing latest events
        </span>
      </div>

      <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
        {logs.map((log) => {
          const badge = getLogBadge(log);
          const IconComponent = badge.icon;
          const timeStr = new Date(log.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });

          return (
            <div
              key={log.id}
              className="bg-slate-950/70 border border-slate-800/70 hover:border-slate-700/90 rounded-xl p-3 flex items-center justify-between transition-colors text-xs font-mono"
            >
              <div className="flex items-center space-x-3">
                {/* Type Badge */}
                <div
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${badge.bg} ${badge.color}`}
                >
                  <IconComponent className="w-4 h-4" />
                </div>

                <div>
                  <p className="text-slate-200 font-medium leading-tight">
                    {log.message}
                  </p>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5 block">
                    Sensor Trigger • {badge.label}
                  </span>
                </div>
              </div>

              {/* Timestamp */}
              <div className="text-right shrink-0 pl-3">
                <span className="text-slate-300 font-medium">{timeStr}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
