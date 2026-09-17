import React from 'react';
import {
  Check,
  Pause,
  Play,
  Sliders,
  Sparkles,
  Users,
  X
} from 'lucide-react';
import { QueueThresholdConfig } from '../types/messq';

interface DemoControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateEntry: () => void;
  onSimulateExit: () => void;
  onSetPreset: (preset: 'LOW' | 'MODERATE' | 'HIGH' | 'EMPTY') => void;
  simulationActive: boolean;
  onToggleSimulation: (active: boolean) => void;
  simulationSpeedMs: number;
  onChangeSpeed: (ms: number) => void;
}

export const DemoControlsModal: React.FC<DemoControlsModalProps> = ({
  isOpen,
  onClose,
  onSimulateEntry,
  onSimulateExit,
  onSetPreset,
  simulationActive,
  onToggleSimulation,
  simulationSpeedMs,
  onChangeSpeed
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-mono text-white">
                Queue Crowd Simulator
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Test different LH2 Mess crowd levels & wait times
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 mt-5 text-xs font-mono">
          {/* Section 1: Crowd Presets */}
          <div>
            <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              Preset Crowd Scenarios
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onSetPreset('EMPTY')}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-left transition-colors"
              >
                <div className="font-bold text-slate-300">0 Diners (Empty)</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Off-peak or closed</div>
              </button>

              <button
                onClick={() => onSetPreset('LOW')}
                className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 hover:border-emerald-500 text-left transition-colors"
              >
                <div className="font-bold text-emerald-300">6 Diners (LOW)</div>
                <div className="text-[10px] text-emerald-400/80 mt-0.5">&lt; 3 mins wait</div>
              </button>

              <button
                onClick={() => onSetPreset('MODERATE')}
                className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 hover:border-amber-500 text-left transition-colors"
              >
                <div className="font-bold text-amber-300">17 Diners (MODERATE)</div>
                <div className="text-[10px] text-amber-400/80 mt-0.5">~4-5 mins wait</div>
              </button>

              <button
                onClick={() => onSetPreset('HIGH')}
                className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 hover:border-red-500 text-left transition-colors"
              >
                <div className="font-bold text-red-300">29 Diners (HIGH)</div>
                <div className="text-[10px] text-red-400/80 mt-0.5">Peak lunch/dinner rush</div>
              </button>
            </div>
          </div>

          {/* Section 2: Manual Line Increment / Decrement */}
          <div>
            <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              Quick In-Line Step Controls
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onSimulateEntry}
                className="py-2.5 px-3 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-700/60 text-cyan-300 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Users className="w-4 h-4" />
                <span>+1 Student Joins Line</span>
              </button>

              <button
                onClick={onSimulateExit}
                className="py-2.5 px-3 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <span>-1 Food Collected</span>
              </button>
            </div>
          </div>

          {/* Section 3: Live Flow Simulation */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-slate-200 font-bold block">Live Flow Auto-Simulation</span>
                <span className="text-[10px] text-slate-400">
                  Automatically moves students through the line realistically
                </span>
              </div>
              <button
                onClick={() => onToggleSimulation(!simulationActive)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  simulationActive
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                {simulationActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{simulationActive ? 'Running' : 'Paused'}</span>
              </button>
            </div>

            <div className="flex items-center space-x-2 pt-2 border-t border-slate-800/80">
              <span className="text-slate-400 text-[11px]">Update Interval:</span>
              {[
                { ms: 2000, label: 'Fast (2s)' },
                { ms: 4000, label: 'Normal (4s)' },
                { ms: 8000, label: 'Slow (8s)' }
              ].map((sp) => (
                <button
                  key={sp.ms}
                  onClick={() => onChangeSpeed(sp.ms)}
                  className={`px-2 py-1 rounded text-[10px] border ${
                    simulationSpeedMs === sp.ms
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-mono font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
