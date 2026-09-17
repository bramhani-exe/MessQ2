import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Calendar,
  Clock,
  Flame,
  Info,
  LineChart,
  TrendingUp
} from 'lucide-react';
import { QueueDataPoint, QueueState, QueueThresholdConfig } from '../types/messq';

interface QueueAnalyticsProps {
  queue: QueueState;
  history: QueueDataPoint[];
  thresholds: QueueThresholdConfig;
}

export const QueueAnalytics: React.FC<QueueAnalyticsProps> = ({
  queue,
  history,
  thresholds
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<QueueDataPoint | null>(null);
  const [hoverX, setHoverX] = useState<number | null>(null);

  // Compute stats
  const currentCount = queue.queueCount;
  const peakCount = Math.max(...history.map((h) => h.count), queue.peakToday);
  const lowestCount = Math.min(...history.map((h) => h.count), 4);
  const averageCount =
    history.length > 0
      ? Math.round(history.reduce((acc, cur) => acc + cur.count, 0) / history.length)
      : queue.averageToday;

  // Chart Dimensions
  const width = 800;
  const height = 240;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const maxVal = Math.max(35, peakCount + 5);

  // Generate SVG Points
  const points = history.map((pt, i) => {
    const x = paddingLeft + (i / Math.max(1, history.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (pt.count / maxVal) * chartHeight;
    return { x, y, pt };
  });

  const pathD =
    points.length > 0
      ? points.reduce((acc, curr, i, arr) => {
          if (i === 0) return `M ${curr.x} ${curr.y}`;
          // Smooth bezier curve
          const prev = arr[i - 1];
          const cx = (prev.x + curr.x) / 2;
          return `${acc} C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
        }, '')
      : '';

  const areaD =
    points.length > 0
      ? `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
      : '';

  // Dynamic Insight generation
  let insightText = '';
  if (queue.crowdStatus === 'HIGH') {
    insightText =
      'Peak dining rush detected. Influx rate exceeds counter discharge pace. Expect longer turnaround until rush clears.';
  } else if (queue.crowdStatus === 'MODERATE') {
    insightText =
      'Queue density is currently within the expected meal-hour baseline. All service counters are maintaining steady flow.';
  } else {
    insightText =
      'Optimal dining window active. Minimal queue resistance with prompt counter availability and seat vacancy.';
  }

  return (
    <section
      id="queue-analytics-section"
      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 mb-6 shadow-md"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-800/80 gap-3">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-semibold flex items-center gap-1.5">
            <LineChart className="w-3.5 h-3.5" />
            Temporal Crowd Trends
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-white font-mono">
            Queue Size Over Time (Past 30 Minutes)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Approximate student crowd trends over the past 30 minutes in LH2 Mess
          </p>
        </div>

        {/* Rolling Window Badge */}
        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
            Window: 30 Mins (2m Bins)
          </span>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          <span className="text-[11px] font-mono uppercase text-slate-500 block">Current</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold font-mono text-white">{currentCount}</span>
            <span className="text-xs text-slate-400">diners</span>
          </div>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          <span className="text-[11px] font-mono uppercase text-slate-500 block">30-Min Average</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold font-mono text-cyan-400">{averageCount}</span>
            <span className="text-xs text-slate-400">diners</span>
          </div>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          <span className="text-[11px] font-mono uppercase text-slate-500 block">Peak Recorded</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold font-mono text-amber-400">{peakCount}</span>
            <span className="text-xs text-slate-400">diners</span>
          </div>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          <span className="text-[11px] font-mono uppercase text-slate-500 block">Today's Total Served</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold font-mono text-emerald-400">{queue.totalServedToday}</span>
            <span className="text-xs text-slate-400">meals</span>
          </div>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-3 sm:p-5 relative">
        <div className="w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto overflow-visible select-none"
          >
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Threshold reference lines */}
            {/* High threshold line */}
            <line
              x1={paddingLeft}
              y1={paddingTop + chartHeight - (thresholds.moderateMax / maxVal) * chartHeight}
              x2={width - paddingRight}
              y2={paddingTop + chartHeight - (thresholds.moderateMax / maxVal) * chartHeight}
              stroke="#ef4444"
              strokeDasharray="4 4"
              strokeOpacity="0.35"
              strokeWidth="1"
            />
            <text
              x={width - paddingRight - 4}
              y={paddingTop + chartHeight - (thresholds.moderateMax / maxVal) * chartHeight - 4}
              fill="#f87171"
              fontSize="9"
              textAnchor="end"
              fontFamily="JetBrains Mono"
            >
              High Threshold ({thresholds.moderateMax}+)
            </text>

            {/* Moderate threshold line */}
            <line
              x1={paddingLeft}
              y1={paddingTop + chartHeight - (thresholds.lowMax / maxVal) * chartHeight}
              x2={width - paddingRight}
              y2={paddingTop + chartHeight - (thresholds.lowMax / maxVal) * chartHeight}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              strokeOpacity="0.35"
              strokeWidth="1"
            />
            <text
              x={width - paddingRight - 4}
              y={paddingTop + chartHeight - (thresholds.lowMax / maxVal) * chartHeight - 4}
              fill="#fbbf24"
              fontSize="9"
              textAnchor="end"
              fontFamily="JetBrains Mono"
            >
              Moderate Threshold ({thresholds.lowMax})
            </text>

            {/* Subtle Horizontal grid lines */}
            {[0, 10, 20, 30].map((val) => {
              if (val > maxVal) return null;
              const y = paddingTop + chartHeight - (val / maxVal) * chartHeight;
              return (
                <g key={val}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={width - paddingRight}
                    y2={y}
                    stroke="#334155"
                    strokeWidth="0.75"
                    strokeOpacity="0.4"
                  />
                  <text
                    x={paddingLeft - 8}
                    y={y + 3}
                    fill="#64748b"
                    fontSize="10"
                    textAnchor="end"
                    fontFamily="JetBrains Mono"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Filled Area */}
            {areaD && <path d={areaD} fill="url(#chartGradient)" />}

            {/* Main Data Line */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="#22d3ee"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Data Point Dots and interactive hitboxes */}
            {points.map(({ x, y, pt }, idx) => {
              const isHovered = hoveredPoint?.timestamp === pt.timestamp;
              return (
                <g
                  key={idx}
                  className="cursor-pointer"
                  onMouseEnter={() => {
                    setHoveredPoint(pt);
                    setHoverX(x);
                  }}
                  onMouseLeave={() => {
                    setHoveredPoint(null);
                    setHoverX(null);
                  }}
                >
                  {/* Invisible broad hitbox */}
                  <rect
                    x={x - 15}
                    y={paddingTop}
                    width={30}
                    height={chartHeight}
                    fill="transparent"
                  />

                  {/* Dot */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 6 : 3.5}
                    fill={
                      pt.status === 'HIGH'
                        ? '#ef4444'
                        : pt.status === 'MODERATE'
                        ? '#f59e0b'
                        : '#10b981'
                    }
                    stroke="#090d16"
                    strokeWidth="2"
                    className="transition-all duration-150"
                  />

                  {/* X-axis time label on every 2nd or 3rd point */}
                  {idx % 3 === 0 && (
                    <text
                      x={x}
                      y={height - 15}
                      fill="#64748b"
                      fontSize="9.5"
                      textAnchor="middle"
                      fontFamily="JetBrains Mono"
                    >
                      {pt.time}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Interactive hover guideline */}
            {hoverX !== null && (
              <line
                x1={hoverX}
                y1={paddingTop}
                x2={hoverX}
                y2={paddingTop + chartHeight}
                stroke="#38bdf8"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            )}
          </svg>
        </div>

        {/* Hover Tooltip Popup */}
        {hoveredPoint && (
          <div className="mt-3 flex items-center justify-between text-xs font-mono bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-slate-300 shadow-lg">
            <span>
              Timestamp: <strong className="text-white">{hoveredPoint.time}</strong>
            </span>
            <span>
              Queue Count: <strong className="text-cyan-400">{hoveredPoint.count} diners</strong>
            </span>
            <span>
              Status:{' '}
              <strong
                className={
                  hoveredPoint.status === 'HIGH'
                    ? 'text-red-400'
                    : hoveredPoint.status === 'MODERATE'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }
              >
                {hoveredPoint.status}
              </strong>
            </span>
          </div>
        )}
      </div>

      {/* Dynamic Institutional Insight Banner */}
      <div className="mt-4 p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-start space-x-3">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <strong className="text-slate-200 font-mono">Real-Time Queue Insight: </strong>
          <span className="text-slate-400 leading-relaxed">{insightText}</span>
        </div>
      </div>
    </section>
  );
};
