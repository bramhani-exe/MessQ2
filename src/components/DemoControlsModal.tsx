import React, { useState } from 'react';
import {
  AlertTriangle,
  Check,
  Pause,
  Play,
  Radio,
  RefreshCw,
  Sliders,
  X
} from 'lucide-react';
import { LiveHardwareTelemetry } from '../services/liveQueueService';

interface DemoControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLiveHardware?: boolean;
  dataSource?: 'ESP32_LIVE' | 'SIMULATED';
  onToggleDataSource: (source: 'ESP32_LIVE' | 'SIMULATED') => void;
  onManualEntry?: () => void;
  onManualExit?: () => void;
  onSetPreset: (preset: 'LOW' | 'MODERATE' | 'HIGH' | 'EMPTY') => void;
  simulationActive: boolean;
  onToggleSimulation: (active: boolean) => void;
  simulationSpeedMs: number;
  onChangeSpeed: (ms: number) => void;
  onResetCounter: () => Promise<boolean>;
  rawTelemetry?: LiveHardwareTelemetry | null;
}

export const DemoControlsModal: React.FC<DemoControlsModalProps> = ({
  isOpen,
  onClose,
  dataSource = 'ESP32_LIVE',
  onToggleDataSource,
  onManualEntry,
  onManualExit,
  onSetPreset,
  simulationActive,
  onToggleSimulation,
  simulationSpeedMs,
  onChangeSpeed,
  onResetCounter,
  rawTelemetry
}) => {
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const isLive = dataSource === 'ESP32_LIVE';

  const handleReset = async () => {
    setResetting(true);
    const ok = await onResetCounter();
    setResetting(false);
    if (ok) {
      setResetSuccess(true);
      setShowConfirmReset(false);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e231d]/40 backdrop-blur-xs">
      <div className="bg-white border border-[#e5dac6] rounded-lg max-w-lg w-full p-5 sm:p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#f0e7d7]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-md bg-[#ebf5ee] border border-[#b7dfc4] text-[#1b5e35] flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading text-sm font-bold text-[#1e231d]">
                System Mode &amp; Calibration
              </h3>
              <p className="text-xs text-[#6b7267] font-mono">
                Hardware telemetry configuration &amp; demonstration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8b9187] hover:text-[#1e231d] p-1 rounded-md hover:bg-[#faf7f0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 mt-4 text-xs font-mono">
          {/* Section 1: Telemetry Data Source Switcher */}
          <div>
            <span className="text-[11px] font-semibold text-[#1e231d] uppercase tracking-wider block mb-2">
              1. Telemetry Source
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onToggleDataSource('ESP32_LIVE')}
                className={`p-3 rounded-md border text-left transition-all ${
                  isLive
                    ? 'bg-[#ebf5ee] border-[#b7dfc4] text-[#1b5e35] ring-1 ring-[#236b3d]/20'
                    : 'bg-[#faf7f0] border-[#e5dac6] text-[#6b7267] hover:bg-[#f5efe3]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">Live Hardware</span>
                  {isLive && <Check className="w-3.5 h-3.5 text-[#236b3d]" />}
                </div>
                <div className="text-[10px] text-[#7a8077] mt-1">
                  ESP32 + dual IR sensors via Vercel &amp; Redis
                </div>
              </button>

              <button
                onClick={() => onToggleDataSource('SIMULATED')}
                className={`p-3 rounded-md border text-left transition-all ${
                  !isLive
                    ? 'bg-[#fcf5e8] border-[#ebd4b2] text-[#855314] ring-1 ring-amber-500/20'
                    : 'bg-[#faf7f0] border-[#e5dac6] text-[#6b7267] hover:bg-[#f5efe3]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">Simulation Mode</span>
                  {!isLive && <Check className="w-3.5 h-3.5 text-[#855314]" />}
                </div>
                <div className="text-[10px] text-[#7a8077] mt-1">
                  Mock crowd scenarios for UI demonstration
                </div>
              </button>
            </div>
          </div>

          {/* Section 2: Hardware Calibration (Reset Counter) */}
          {isLive && (
            <div className="p-3.5 bg-[#faf7f0] border border-[#e5dac6] rounded-md space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#1e231d]">
                  Calibrate Physical Counter
                </span>
                {resetSuccess && (
                  <span className="text-[11px] text-[#1b5e35] font-bold">
                    Reset Confirmed!
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#6b7267] leading-relaxed">
                If the physical mess hall is completely empty, you can calibrate the backend queue count and entry/exit counters back to zero.
              </p>

              {!showConfirmReset ? (
                <button
                  onClick={() => setShowConfirmReset(true)}
                  className="w-full py-2 px-3 bg-white border border-[#e5dac6] hover:bg-[#f5efe3] text-[#1e231d] rounded-md font-medium text-xs transition-colors"
                >
                  Calibrate Counter to 0
                </button>
              ) : (
                <div className="p-2.5 bg-[#fdf2f0] border border-[#f5c7c1] rounded-md text-[#a82a1b] space-y-2">
                  <div className="flex items-start gap-2 text-[11px]">
                    <AlertTriangle className="w-4 h-4 text-[#c53727] shrink-0 mt-0.5" />
                    <span>Confirm zero calibration on production API? Only do this if dining hall is clear.</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleReset}
                      disabled={resetting}
                      className="flex-1 py-1.5 bg-[#c53727] hover:bg-[#a82a1b] text-white rounded font-medium text-xs flex items-center justify-center gap-1 transition-colors"
                    >
                      {resetting && <RefreshCw className="w-3 h-3 animate-spin" />}
                      <span>Yes, Reset to 0</span>
                    </button>
                    <button
                      onClick={() => setShowConfirmReset(false)}
                      className="px-3 py-1.5 bg-white border border-[#e5dac6] text-[#4d534b] rounded text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Section 3: Simulator Controls (Only accessible in SIMULATED mode) */}
          {!isLive ? (
            <div className="space-y-4 pt-2 border-t border-[#f0e7d7]">
              <div>
                <span className="text-[11px] font-semibold text-[#1e231d] uppercase tracking-wider block mb-2">
                  Simulation Presets
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSetPreset('EMPTY')}
                    className="p-2.5 rounded-md bg-[#faf7f0] border border-[#e5dac6] hover:bg-[#f5efe3] text-left"
                  >
                    <div className="font-bold text-[#1e231d]">0 Diners (Empty)</div>
                    <div className="text-[10px] text-[#7a8077]">Hall vacant</div>
                  </button>

                  <button
                    onClick={() => onSetPreset('LOW')}
                    className="p-2.5 rounded-md bg-[#ebf5ee] border border-[#b7dfc4] hover:bg-[#def0e3] text-left text-[#1b5e35]"
                  >
                    <div className="font-bold">6 Diners (Low)</div>
                    <div className="text-[10px] text-[#1b5e35]">&lt; 3 mins wait</div>
                  </button>

                  <button
                    onClick={() => onSetPreset('MODERATE')}
                    className="p-2.5 rounded-md bg-[#fcf5e8] border border-[#ebd4b2] hover:bg-[#f7ebd3] text-left text-[#855314]"
                  >
                    <div className="font-bold">17 Diners (Moderate)</div>
                    <div className="text-[10px] text-[#855314]">~4-6 mins wait</div>
                  </button>

                  <button
                    onClick={() => onSetPreset('HIGH')}
                    className="p-2.5 rounded-md bg-[#fdf2f0] border border-[#f5c7c1] hover:bg-[#fae2de] text-left text-[#a82a1b]"
                  >
                    <div className="font-bold">29 Diners (High)</div>
                    <div className="text-[10px] text-[#c53727]">Peak rush</div>
                  </button>
                </div>
              </div>

              {onManualEntry && onManualExit && (
                <div>
                  <span className="text-[11px] font-semibold text-[#1e231d] uppercase tracking-wider block mb-2">
                    Manual Pulse Step
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={onManualEntry}
                      className="py-2 px-3 bg-[#ebf5ee] border border-[#b7dfc4] hover:bg-[#def0e3] text-[#1b5e35] rounded-md font-bold text-center"
                    >
                      +1 Entry (GPIO 34)
                    </button>
                    <button
                      onClick={onManualExit}
                      className="py-2 px-3 bg-[#faf7f0] border border-[#e5dac6] hover:bg-[#f5efe3] text-[#4d534b] rounded-md font-bold text-center"
                    >
                      -1 Exit (GPIO 35)
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 bg-[#faf7f0] border border-[#e5dac6] rounded-md text-[#4d534b] text-[11px] leading-relaxed">
              <strong className="text-[#1e231d]">Hardware Telemetry Active:</strong> Manual simulation presets and synthetic counter overrides are locked out while connected to genuine ESP32 hardware to prevent data contamination.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
