import React from 'react';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CheckCircle2,
  Clock,
  History,
  Radio
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
          color: 'text-[#1b5e35]',
          bg: 'bg-[#ebf5ee] border-[#b7dfc4]',
          label: 'ENTRY (GPIO 34)'
        };
      case 'EXIT':
        return {
          icon: ArrowDownCircle,
          color: 'text-[#855314]',
          bg: 'bg-[#fcf5e8] border-[#ebd4b2]',
          label: 'EXIT (GPIO 35)'
        };
      case 'ALERT':
        return {
          icon: Radio,
          color: 'text-[#a82a1b]',
          bg: 'bg-[#fdf2f0] border-[#f5c7c1]',
          label: 'HARDWARE'
        };
      default:
        return {
          icon: CheckCircle2,
          color: 'text-[#4d534b]',
          bg: 'bg-white border-[#e5dac6]',
          label: 'TELEMETRY'
        };
    }
  };

  return (
    <section
      id="recent-activity-section"
      className="bg-white border border-[#e5dac6] rounded-lg p-5 sm:p-6 mb-6 shadow-xs"
    >
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#f0e7d7]">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#c53727] font-semibold flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" />
            Live Hardware Feed
          </span>
          <h3 className="font-heading text-base sm:text-lg font-bold text-[#1e231d]">
            Recent Sensor Events
          </h3>
        </div>
        <span className="text-xs font-mono text-[#7a8077]">
          Real-time stream
        </span>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {logs.length === 0 ? (
          <div className="p-8 text-center bg-[#faf7f0] border border-dashed border-[#e5dac6] rounded-md">
            <p className="text-xs font-mono text-[#7a8077]">
              Awaiting physical sensor events on GPIO 34 (Entry) and GPIO 35 (Exit)...
            </p>
          </div>
        ) : (
          logs.map((log) => {
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
                className="bg-[#faf7f0] border border-[#e5dac6] rounded-md p-3 flex items-center justify-between transition-colors text-xs font-mono"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-7 h-7 rounded-md border flex items-center justify-center shrink-0 ${badge.bg} ${badge.color}`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>

                  <div>
                    <p className="text-[#1e231d] font-medium leading-tight">
                      {log.message}
                    </p>
                    <span className="text-[10px] text-[#7a8077] uppercase tracking-wider mt-0.5 block">
                      {badge.label}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-3">
                  <span className="text-[#6b7267] font-medium">{timeStr}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
