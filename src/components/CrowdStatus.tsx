import React from 'react';
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
      title: 'Low Density',
      range: `0 – ${thresholds.lowMax} Diners`,
      description: 'Minimal queue resistance. Serving counters move with zero congestion.',
      recommendation: 'Optimal time to eat. Direct counter access with ample seating.',
      waitEst: '< 3 mins',
      borderClass: 'border-[#b7dfc4]',
      activeBg: 'bg-[#ebf5ee]',
      badgeBg: 'bg-[#ebf5ee] text-[#1b5e35] border-[#b7dfc4]'
    },
    {
      id: 'MODERATE' as CrowdStatusType,
      title: 'Moderate Density',
      range: `${thresholds.lowMax + 1} – ${thresholds.moderateMax} Diners`,
      description: 'Standard campus flow. Queue moves briskly across all 3 active counters.',
      recommendation: 'Good dining window. Short turnaround time.',
      waitEst: '4 – 8 mins',
      borderClass: 'border-[#ebd4b2]',
      activeBg: 'bg-[#fcf5e8]',
      badgeBg: 'bg-[#fcf5e8] text-[#855314] border-[#ebd4b2]'
    },
    {
      id: 'HIGH' as CrowdStatusType,
      title: 'High Density',
      range: `${thresholds.moderateMax + 1}+ Diners`,
      description: 'Peak dining surge. Counters operating near full capacity.',
      recommendation: 'Heavy rush. If schedule permits, visit 20 mins later.',
      waitEst: '10 – 15 mins',
      borderClass: 'border-[#f5c7c1]',
      activeBg: 'bg-[#fdf2f0]',
      badgeBg: 'bg-[#fdf2f0] text-[#a82a1b] border-[#f5c7c1]'
    }
  ];

  return (
    <section
      id="crowd-status-section"
      className="bg-white border border-[#e5dac6] rounded-lg p-5 sm:p-6 mb-6 shadow-xs"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-[#f0e7d7] gap-2">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#c53727] font-semibold">
            Institutional Advisory
          </span>
          <h3 className="font-heading text-base sm:text-lg font-bold text-[#1e231d]">
            Crowd Density Classifications
          </h3>
        </div>
        <span className="text-xs font-mono text-[#6b7267]">
          Current: <strong className="text-[#1e231d]">{currentStatus}</strong> ({currentCount} in queue)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {states.map((state) => {
          const isActive = currentStatus === state.id;
          return (
            <div
              key={state.id}
              className={`rounded-md p-4 transition-all border ${
                isActive
                  ? `${state.activeBg} ${state.borderClass} ring-1 ring-[#c53727]/20`
                  : 'bg-[#faf7f0] border-[#e5dac6] opacity-80'
              }`}
            >
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[11px] font-mono font-semibold tracking-wider px-2 py-0.5 rounded-md border ${
                    isActive ? state.badgeBg : 'bg-white text-[#6b7267] border-[#e5dac6]'
                  }`}
                >
                  {state.title}
                </span>

                {isActive ? (
                  <span className="text-[10px] font-mono font-bold text-[#c53727]">
                    ACTIVE NOW
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-[#8b9187]">{state.range}</span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-[#4d534b] leading-relaxed mb-3">
                {state.description}
              </p>

              {/* Recommendation & Wait */}
              <div className="pt-2 border-t border-[#f0e7d7] space-y-1 text-xs font-mono">
                <div className="flex justify-between text-[#6b7267]">
                  <span>Estimated Wait:</span>
                  <span className="font-bold text-[#1e231d]">{state.waitEst}</span>
                </div>
                <div className="text-[11px] text-[#7a8077]">
                  <span className="text-[#8b9187]">Note:</span> {state.recommendation}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
