import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  HelpCircle,
  Info,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Users
} from 'lucide-react';
import { CrowdStatus as CrowdStatusType, QueueThresholdConfig } from '../types/messq';

interface CrowdStatusProps {
  currentStatus: CrowdStatusType;
  thresholds: QueueThresholdConfig;
  currentCount: number;
}

export const CrowdStatus: React.FC<CrowdStatusProps> = ({
  currentStatus,
  thresholds,
  currentCount
}) => {
  const states = [
    {
      id: 'LOW' as CrowdStatusType,
      title: 'LOW CROWD',
      range: `0 – ${thresholds.lowMax} Diners`,
      description: 'Minimal waiting. Estimated service time is short.',
      recommendation: 'Optimal time to eat. Direct access to food counters.',
      waitEst: '< 4 mins',
      accentColor: 'border-emerald-500 text-emerald-400 bg-emerald-950/20',
      activeBorder: 'border-emerald-500 shadow-lg shadow-emerald-950/50',
      badgeBg: 'bg-emerald-950 text-emerald-300 border-emerald-800'
    },
    {
      id: 'MODERATE' as CrowdStatusType,
      title: 'MODERATE CROWD',
      range: `${thresholds.lowMax + 1} – ${thresholds.moderateMax} Diners`,
      description: 'Moderate crowd. A short wait may be expected.',
      recommendation: 'Standard flow. Queue moves briskly across all 3 counters.',
      waitEst: '5 – 12 mins',
      accentColor: 'border-amber-500 text-amber-400 bg-amber-950/20',
      activeBorder: 'border-amber-500 shadow-lg shadow-amber-950/50',
      badgeBg: 'bg-amber-950 text-amber-300 border-amber-800'
    },
    {
      id: 'HIGH' as CrowdStatusType,
      title: 'HIGH CROWD',
      range: `${thresholds.moderateMax + 1}+ Diners`,
      description: 'Heavy crowd. Consider visiting after peak time.',
      recommendation: 'Peak congestion. Expect elevated queue wait times.',
      waitEst: '15+ mins',
      accentColor: 'border-red-500 text-red-400 bg-red-950/20',
      activeBorder: 'border-red-500 shadow-lg shadow-red-950/50',
      badgeBg: 'bg-red-950 text-red-300 border-red-800'
    }
  ];

  return (
    <section
      id="crowd-status-section"
      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 mb-6 shadow-md"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-800/80 gap-2">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-semibold">
            Institutional Crowd Advisory
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-white font-mono">
            Hostel Dining Crowd Classifications
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Current State: <strong className="text-cyan-400">{currentStatus}</strong> ({currentCount} in queue)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {states.map((state) => {
          const isActive = currentStatus === state.id;
          return (
            <div
              key={state.id}
              className={`rounded-xl p-5 transition-all duration-300 relative ${
                isActive
                  ? `bg-slate-950 border-2 ${state.activeBorder}`
                  : 'bg-slate-950/40 border border-slate-800/60 opacity-60 hover:opacity-85'
              }`}
            >
              {/* Active Badge */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-[11px] font-mono font-bold tracking-wider px-2.5 py-0.5 rounded border ${
                    isActive ? state.badgeBg : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {state.title}
                </span>

                {isActive ? (
                  <span className="flex items-center space-x-1 text-[11px] font-mono font-semibold text-cyan-400 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>CURRENT STATE</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-500">{state.range}</span>
                )}
              </div>

              {/* Description */}
              <p
                className={`text-xs sm:text-sm font-medium leading-relaxed mb-3 ${
                  isActive ? 'text-slate-200' : 'text-slate-400'
                }`}
              >
                "{state.description}"
              </p>

              {/* Recommendation & Expected Wait */}
              <div className="pt-3 border-t border-slate-800/80 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Estimated Wait:</span>
                  <span className={`font-semibold ${isActive ? 'text-white' : 'text-slate-400'}`}>
                    {state.waitEst}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  <span className="text-slate-500">Advisory:</span> {state.recommendation}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
