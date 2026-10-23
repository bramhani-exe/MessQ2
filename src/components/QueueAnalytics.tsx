import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Info,
  LineChart as LineChartIcon,
  Sparkles,
  TrendingUp,
  Users
} from 'lucide-react';
import { QueueDataPoint, QueueState, QueueThresholdConfig } from '../types/messq';

interface QueueAnalyticsProps {
  queue: QueueState;
  history: QueueDataPoint[];
  thresholds: QueueThresholdConfig;
}

// Typical Peak Hours Dining Curve for LH2 Mess across operational hours
interface HourlyRushPoint {
  hour: string;
  timeLabel: string;
  count: number;
  meal: string;
  isPeak: boolean;
  status: 'LOW' | 'MODERATE' | 'HIGH';
}

const TYPICAL_HOURLY_RUSH: HourlyRushPoint[] = [
  { hour: '07:00', timeLabel: '7:00 AM', count: 6, meal: 'Breakfast Opens', isPeak: false, status: 'LOW' },
  { hour: '07:30', timeLabel: '7:30 AM', count: 14, meal: 'Breakfast', isPeak: false, status: 'LOW' },
  { hour: '08:00', timeLabel: '8:00 AM', count: 26, meal: 'Breakfast Peak', isPeak: true, status: 'HIGH' },
  { hour: '08:30', timeLabel: '8:30 AM', count: 22, meal: 'Breakfast Rush', isPeak: false, status: 'MODERATE' },
  { hour: '09:00', timeLabel: '9:00 AM', count: 5, meal: 'Breakfast Ends', isPeak: false, status: 'LOW' },
  { hour: '10:30', timeLabel: '10:30 AM', count: 0, meal: 'Closed (Prep)', isPeak: false, status: 'LOW' },
  { hour: '12:30', timeLabel: '12:30 PM', count: 16, meal: 'Lunch Opens', isPeak: false, status: 'MODERATE' },
  { hour: '01:00', timeLabel: '1:00 PM', count: 36, meal: 'Lunch Peak', isPeak: true, status: 'HIGH' },
  { hour: '01:30', timeLabel: '1:30 PM', count: 30, meal: 'Lunch Rush', isPeak: true, status: 'HIGH' },
  { hour: '02:00', timeLabel: '2:00 PM', count: 8, meal: 'Lunch Ends', isPeak: false, status: 'LOW' },
  { hour: '03:30', timeLabel: '3:30 PM', count: 0, meal: 'Closed (Prep)', isPeak: false, status: 'LOW' },
  { hour: '04:45', timeLabel: '4:45 PM', count: 12, meal: 'Snacks Open', isPeak: false, status: 'LOW' },
  { hour: '05:15', timeLabel: '5:15 PM', count: 22, meal: 'Snacks Peak', isPeak: true, status: 'MODERATE' },
  { hour: '05:45', timeLabel: '5:45 PM', count: 15, meal: 'Evening Snacks', isPeak: false, status: 'MODERATE' },
  { hour: '06:15', timeLabel: '6:15 PM', count: 4, meal: 'Snacks End', isPeak: false, status: 'LOW' },
  { hour: '07:15', timeLabel: '7:15 PM', count: 18, meal: 'Dinner Opens', isPeak: false, status: 'MODERATE' },
  { hour: '08:00', timeLabel: '8:00 PM', count: 34, meal: 'Dinner Peak', isPeak: true, status: 'HIGH' },
  { hour: '08:30', timeLabel: '8:30 PM', count: 24, meal: 'Dinner Rush', isPeak: false, status: 'MODERATE' },
  { hour: '09:00', timeLabel: '9:00 PM', count: 6, meal: 'Dinner Ends', isPeak: false, status: 'LOW' }
];

export const QueueAnalytics: React.FC<QueueAnalyticsProps> = ({
  queue,
  history,
  thresholds
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{
    label: string;
    count: number;
    meal: string;
    isPeak?: boolean;
    type: 'typical' | 'live';
  } | null>(null);

  const [viewMode, setViewMode] = useState<'typical' | 'live' | 'comparison'>('typical');

  const currentCount = queue.queueCount;
  const peakCount = history.length > 0 ? Math.max(...history.map((h) => h.count), currentCount) : currentCount;
  const averageCount =
    history.length > 0
      ? Math.round(history.reduce((acc, cur) => acc + cur.count, 0) / history.length)
      : currentCount;

  // Chart Dimensions
  const width = 840;
  const height = 240;
  const paddingLeft = 40;
  const paddingRight = 24;
  const paddingTop = 24;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const maxVal = 40;

  // Typical Curve Points
  const typicalPoints = TYPICAL_HOURLY_RUSH.map((pt, i) => {
    const x = paddingLeft + (i / (TYPICAL_HOURLY_RUSH.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (pt.count / maxVal) * chartHeight;
    return { x, y, pt };
  });

  const typicalPathD = typicalPoints.reduce((acc, curr, i, arr) => {
    if (i === 0) return `M ${curr.x} ${curr.y}`;
    const prev = arr[i - 1];
    const cx = (prev.x + curr.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
  }, '');

  // Live History Points (if available)
  const liveDataPoints = history.length > 0 ? history : [
    { timestamp: Date.now(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), count: currentCount, status: queue.crowdStatus }
  ];

  const livePoints = liveDataPoints.map((pt, i) => {
    const x = paddingLeft + (i / Math.max(1, liveDataPoints.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (pt.count / maxVal) * chartHeight;
    return { x, y, pt };
  });

  const livePathD =
    livePoints.length > 1
      ? livePoints.reduce((acc, curr, i, arr) => {
          if (i === 0) return `M ${curr.x} ${curr.y}`;
          const prev = arr[i - 1];
          const cx = (prev.x + curr.x) / 2;
          return `${acc} C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
        }, '')
      : '';

  return (
    <section
      id="queue-analytics-section"
      className="bg-white border border-[#e5dac6] rounded-lg p-5 sm:p-6 mb-6 shadow-xs"
    >
      {/* Header with Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-[#f0e7d7] gap-3">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#c53727] font-semibold flex items-center gap-1.5">
            <LineChartIcon className="w-3.5 h-3.5" />
            Peak Hours &amp; Queue Trends
          </span>
          <h3 className="font-heading text-lg sm:text-xl font-bold text-[#1e231d]">
            Daily Mess Traffic &amp; Peak Hours Curve
          </h3>
          <p className="text-xs text-[#6b7267] mt-0.5">
            Hourly dining rush pattern and counter turnaround flow for LH2 Mess
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-1.5 p-1 bg-[#faf7f0] rounded-md border border-[#e5dac6] text-xs font-mono">
          <button
            onClick={() => setViewMode('typical')}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${
              viewMode === 'typical'
                ? 'bg-[#c53727] text-white font-semibold'
                : 'text-[#4d534b] hover:text-[#1e231d]'
            }`}
          >
            Typical Day Rush
          </button>
          <button
            onClick={() => setViewMode('comparison')}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${
              viewMode === 'comparison'
                ? 'bg-[#c53727] text-white font-semibold'
                : 'text-[#4d534b] hover:text-[#1e231d]'
            }`}
          >
            Overlay Live
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="bg-[#faf7f0] p-3.5 rounded-md border border-[#e5dac6]">
          <span className="text-[10px] font-mono uppercase text-[#7a8077] block">Current Live Queue</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-bold font-mono text-[#1e231d] tabular-nums">{currentCount}</span>
            <span className="text-xs text-[#6b7267]">students</span>
          </div>
        </div>

        <div className="bg-[#faf7f0] p-3.5 rounded-md border border-[#e5dac6]">
          <span className="text-[10px] font-mono uppercase text-[#7a8077] block">Busiest Meal Peak</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-bold font-mono text-[#c53727] tabular-nums">1:00 PM</span>
            <span className="text-xs text-[#6b7267]">~36 diners</span>
          </div>
        </div>

        <div className="bg-[#faf7f0] p-3.5 rounded-md border border-[#e5dac6]">
          <span className="text-[10px] font-mono uppercase text-[#7a8077] block">Fastest Service Window</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-bold font-mono text-[#236b3d] tabular-nums">7:15 AM</span>
            <span className="text-xs text-[#6b7267]">&lt; 2 min wait</span>
          </div>
        </div>

        <div className="bg-[#faf7f0] p-3.5 rounded-md border border-[#e5dac6]">
          <span className="text-[10px] font-mono uppercase text-[#7a8077] block">Total Exited Today</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-bold font-mono text-[#236b3d] tabular-nums">{queue.totalServedToday}</span>
            <span className="text-xs text-[#6b7267]">students</span>
          </div>
        </div>
      </div>

      {/* SVG Line Graph */}
      <div className="bg-[#faf7f0] border border-[#e5dac6] rounded-md p-4 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2 text-xs font-mono text-[#6b7267]">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-0.5 bg-[#c53727] inline-block" />
              <span>Typical Daily Curve</span>
            </span>
            {viewMode === 'comparison' && (
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#236b3d] inline-block" />
                <span>Live Telemetry Points</span>
              </span>
            )}
          </div>
          <span className="text-[11px] text-[#7a8077]">Hover points for crowd details</span>
        </div>

        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full min-w-[680px] h-auto overflow-visible select-none"
          >
            {/* High Rush Threshold Line */}
            <line
              x1={paddingLeft}
              y1={paddingTop + chartHeight - (thresholds.moderateMax / maxVal) * chartHeight}
              x2={width - paddingRight}
              y2={paddingTop + chartHeight - (thresholds.moderateMax / maxVal) * chartHeight}
              stroke="#f5c7c1"
              strokeDasharray="4 4"
              strokeWidth="1"
            />
            <text
              x={width - paddingRight - 4}
              y={paddingTop + chartHeight - (thresholds.moderateMax / maxVal) * chartHeight - 4}
              fill="#a82a1b"
              fontSize="9"
              textAnchor="end"
              fontFamily="JetBrains Mono"
            >
              Peak Rush Level ({thresholds.moderateMax} students)
            </text>

            {/* Horizontal Grid lines */}
            {[0, 10, 20, 30, 40].map((val) => {
              const y = paddingTop + chartHeight - (val / maxVal) * chartHeight;
              return (
                <g key={val}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={width - paddingRight}
                    y2={y}
                    stroke="#ebdcc7"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingLeft - 8}
                    y={y + 3}
                    fill="#7a8077"
                    fontSize="10"
                    textAnchor="end"
                    fontFamily="JetBrains Mono"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Meal Time Band Indicators */}
            <g opacity="0.6">
              {/* Breakfast Band */}
              <text x={paddingLeft + chartWidth * 0.12} y={paddingTop - 6} fill="#236b3d" fontSize="9" fontWeight="bold" fontFamily="JetBrains Mono" textAnchor="middle">
                BREAKFAST (7-9 AM)
              </text>
              {/* Lunch Band */}
              <text x={paddingLeft + chartWidth * 0.44} y={paddingTop - 6} fill="#c53727" fontSize="9" fontWeight="bold" fontFamily="JetBrains Mono" textAnchor="middle">
                LUNCH (12:30-2 PM)
              </text>
              {/* Snacks Band */}
              <text x={paddingLeft + chartWidth * 0.68} y={paddingTop - 6} fill="#855314" fontSize="9" fontWeight="bold" fontFamily="JetBrains Mono" textAnchor="middle">
                SNACKS (4:45-6:15 PM)
              </text>
              {/* Dinner Band */}
              <text x={paddingLeft + chartWidth * 0.88} y={paddingTop - 6} fill="#1e231d" fontSize="9" fontWeight="bold" fontFamily="JetBrains Mono" textAnchor="middle">
                DINNER (7:15-9 PM)
              </text>
            </g>

            {/* Gradient Fill under Typical Curve */}
            <defs>
              <linearGradient id="rushCurveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c53727" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#faf7f0" stopOpacity="0" />
              </linearGradient>
            </defs>
            {typicalPathD && (
              <path
                d={`${typicalPathD} L ${typicalPoints[typicalPoints.length - 1].x} ${paddingTop + chartHeight} L ${typicalPoints[0].x} ${paddingTop + chartHeight} Z`}
                fill="url(#rushCurveGradient)"
              />
            )}

            {/* Main Peak Hours Line Curve */}
            {typicalPathD && (
              <path
                d={typicalPathD}
                fill="none"
                stroke="#c53727"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Typical Points */}
            {typicalPoints.map(({ x, y, pt }, idx) => {
              const isHovered = hoveredPoint?.label === pt.timeLabel && hoveredPoint.type === 'typical';
              return (
                <g
                  key={`typical-${idx}`}
                  className="cursor-pointer"
                  onMouseEnter={() =>
                    setHoveredPoint({
                      label: pt.timeLabel,
                      count: pt.count,
                      meal: pt.meal,
                      isPeak: pt.isPeak,
                      type: 'typical'
                    })
                  }
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 6 : pt.isPeak ? 4.5 : 3}
                    fill={pt.isPeak ? '#c53727' : '#ffffff'}
                    stroke="#c53727"
                    strokeWidth="2"
                  />
                  {/* Time label under point for key marks */}
                  {(idx % 2 === 0 || pt.isPeak) && (
                    <text
                      x={x}
                      y={height - 12}
                      fill={pt.isPeak ? '#c53727' : '#7a8077'}
                      fontSize={pt.isPeak ? '9.5' : '8.5'}
                      fontWeight={pt.isPeak ? 'bold' : 'normal'}
                      textAnchor="middle"
                      fontFamily="JetBrains Mono"
                    >
                      {pt.hour}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Live Telemetry Points (in comparison mode or overlay) */}
            {viewMode === 'comparison' && (
              <>
                {livePathD && (
                  <path
                    d={livePathD}
                    fill="none"
                    stroke="#236b3d"
                    strokeWidth="2"
                    strokeDasharray="3 3"
                  />
                )}
                {livePoints.map(({ x, y, pt }, idx) => {
                  const isHovered = hoveredPoint?.label === pt.time && hoveredPoint.type === 'live';
                  return (
                    <g
                      key={`live-${idx}`}
                      className="cursor-pointer"
                      onMouseEnter={() =>
                        setHoveredPoint({
                          label: pt.time,
                          count: pt.count,
                          meal: 'Live Hardware Session',
                          type: 'live'
                        })
                      }
                      onMouseLeave={() => setHoveredPoint(null)}
                    >
                      <circle
                        cx={x}
                        cy={y}
                        r={isHovered ? 6 : 4}
                        fill="#236b3d"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                    </g>
                  );
                })}
              </>
            )}
          </svg>
        </div>

        {/* Hovered Tooltip */}
        {hoveredPoint ? (
          <div className="mt-3 flex flex-wrap items-center justify-between text-xs font-mono bg-white border border-[#e5dac6] px-3.5 py-2 rounded-md text-[#2a2f29] shadow-xs gap-2">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#7a8077]" />
              Time: <strong>{hoveredPoint.label}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#c53727]" />
              Queue: <strong className="text-[#c53727]">{hoveredPoint.count} students in line</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#236b3d]" />
              Window: <strong>{hoveredPoint.meal}</strong> {hoveredPoint.isPeak && '(Peak Hour)'}
            </span>
          </div>
        ) : (
          <div className="mt-3 text-[11px] font-mono text-[#7a8077] flex items-center justify-between">
            <span>Chart displays expected counter queue line length throughout LH2 meal timings.</span>
            <span className="text-[#236b3d] font-semibold">Green = Fast Service &bull; Red = Peak Rush</span>
          </div>
        )}
      </div>

      {/* Peak Hours Strategic Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        <div className="p-4 bg-[#ebf5ee] border border-[#b7dfc4] rounded-md text-xs space-y-1.5">
          <div className="flex items-center space-x-2 text-[#1b5e35] font-semibold font-mono">
            <CheckCircle2 className="w-4 h-4" />
            <span>Recommended Low-Wait Arrival Windows</span>
          </div>
          <ul className="text-[#1b5e35] space-y-1 font-mono text-[11px] pl-6 list-disc">
            <li>Breakfast: 7:00 AM – 7:45 AM (Immediate counter service)</li>
            <li>Lunch: 12:30 PM – 12:45 PM or 1:40 PM – 2:00 PM</li>
            <li>Evening Snacks: 4:45 PM – 5:00 PM</li>
            <li>Dinner: 7:15 PM – 7:45 PM or after 8:35 PM</li>
          </ul>
        </div>

        <div className="p-4 bg-[#fdf2f0] border border-[#f5c7c1] rounded-md text-xs space-y-1.5">
          <div className="flex items-center space-x-2 text-[#a82a1b] font-semibold font-mono">
            <TrendingUp className="w-4 h-4" />
            <span>Expected High-Rush Interval Times</span>
          </div>
          <ul className="text-[#a82a1b] space-y-1 font-mono text-[11px] pl-6 list-disc">
            <li>Breakfast Rush: 8:00 AM – 8:30 AM (~26 students)</li>
            <li>Lunch Rush: 1:00 PM – 1:30 PM (~36 students)</li>
            <li>Evening Snacks: 5:15 PM – 5:35 PM (~22 students)</li>
            <li>Dinner Rush: 8:00 PM – 8:30 PM (~34 students)</li>
          </ul>
        </div>
      </div>
    </section>
  );
};
