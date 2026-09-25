import React, { useState, useMemo } from 'react';
import { formatFriendlyDate } from '../../utils/date';
import { COLOR_SCALES } from '../../utils/heatmap';

export interface HeatmapItem {
  date: string;
  count: number;
  level: number;
}

export interface ContributionHeatmapProps {
  data: HeatmapItem[];
  colorScale?: 'green' | 'emerald' | 'cyan' | 'amber' | 'blue';
  cellSize?: number;
  gap?: number;
  showMonthLabels?: boolean;
  showDayLabels?: boolean;
  interactive?: boolean;
  onCellClick?: (item: HeatmapItem) => void;
  unitName?: string; // e.g. 'contributions' or 'problems solved'
  emptyTooltipText?: string;
  maxColumns?: number;
}

export const ContributionHeatmap: React.FC<ContributionHeatmapProps> = ({
  data,
  colorScale = 'green',
  cellSize = 11,
  gap = 3,
  showMonthLabels = true,
  showDayLabels = false,
  interactive = true,
  onCellClick,
  unitName = 'contributions',
  emptyTooltipText = 'No activity',
  maxColumns,
}) => {
  const [hoveredCell, setHoveredCell] = useState<{
    item: HeatmapItem;
    x: number;
    y: number;
  } | null>(null);

  const colors = COLOR_SCALES[colorScale] || COLOR_SCALES.green;

  // Build grid: columns of 7 days (Sunday = 0 to Saturday = 6)
  const { weeks, monthLabels } = useMemo(() => {
    if (!data || data.length === 0) {
      return { weeks: [], monthLabels: [] };
    }

    // Sort ascending by date
    const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));

    // Pad beginning to align first day with its day of week
    const firstDate = new Date(sorted[0].date + 'T00:00:00');
    const firstDayOfWeek = firstDate.getDay(); // 0-6

    const paddedItems: (HeatmapItem | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      paddedItems.push(null);
    }
    sorted.forEach((item) => paddedItems.push(item));

    // Chunk into 7-day columns
    const columns: (HeatmapItem | null)[][] = [];
    for (let i = 0; i < paddedItems.length; i += 7) {
      columns.push(paddedItems.slice(i, i + 7));
    }

    // If maxColumns specified, take only the last maxColumns
    const visibleWeeks = maxColumns ? columns.slice(-maxColumns) : columns;

    // Calculate month labels
    const labels: { text: string; colIndex: number }[] = [];
    let lastMonth = -1;

    visibleWeeks.forEach((week, colIdx) => {
      const firstValidDay = week.find((d) => d !== null);
      if (firstValidDay) {
        const d = new Date(firstValidDay.date + 'T00:00:00');
        const month = d.getMonth();
        if (month !== lastMonth && d.getDate() <= 14) {
          labels.push({
            text: d.toLocaleDateString('en-US', { month: 'short' }),
            colIndex: colIdx,
          });
          lastMonth = month;
        }
      }
    });

    return { weeks: visibleWeeks, monthLabels: labels };
  }, [data, maxColumns]);

  const getCellColor = (level: number) => {
    const safeLevel = Math.max(0, Math.min(level, colors.levels.length - 1));
    return colors.levels[safeLevel];
  };

  const getBorderColor = (level: number) => {
    const safeLevel = Math.max(0, Math.min(level, colors.borderColors.length - 1));
    return colors.borderColors[safeLevel];
  };

  if (weeks.length === 0) {
    return (
      <div className="h-28 flex items-center justify-center text-xs text-slate-500 font-mono">
        No activity records available
      </div>
    );
  }

  return (
    <div className="relative select-none overflow-x-auto overflow-y-hidden pb-1">
      {/* Month Labels */}
      {showMonthLabels && monthLabels.length > 0 && (
        <div
          className="relative h-4 mb-1 text-[10px] text-slate-400 font-medium tracking-wider"
          style={{ width: weeks.length * (cellSize + gap) }}
        >
          {monthLabels.map((lbl, idx) => (
            <span
              key={idx}
              className="absolute transform -translate-x-1"
              style={{ left: lbl.colIndex * (cellSize + gap) }}
            >
              {lbl.text}
            </span>
          ))}
        </div>
      )}

      {/* Grid Container */}
      <div
        className="flex"
        style={{
          gap: `${gap}px`,
        }}
        onMouseLeave={() => setHoveredCell(null)}
      >
        {/* Optional Day Labels */}
        {showDayLabels && (
          <div
            className="flex flex-col text-[9px] text-slate-400 pr-1.5 justify-between py-0.5"
            style={{ height: 7 * (cellSize + gap) - gap }}
          >
            <span className="leading-none">Mon</span>
            <span className="leading-none">Wed</span>
            <span className="leading-none">Fri</span>
          </div>
        )}

        {/* Weeks */}
        {weeks.map((week, colIdx) => (
          <div
            key={colIdx}
            className="flex flex-col"
            style={{ gap: `${gap}px` }}
          >
            {Array.from({ length: 7 }).map((_, rowIdx) => {
              const item = week[rowIdx];
              if (!item) {
                return (
                  <div
                    key={rowIdx}
                    className="rounded-[3px] bg-transparent"
                    style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                  />
                );
              }

              const cellBg = getCellColor(item.level);
              const cellBorder = getBorderColor(item.level);

              return (
                <div
                  key={rowIdx}
                  className={`heat-cell rounded-[3px] border cursor-pointer ${cellBg} ${cellBorder}`}
                  style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                  onClick={() => onCellClick?.(item)}
                  onMouseEnter={(e) => {
                    if (!interactive) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoveredCell({
                      item,
                      x: rect.left + rect.width / 2,
                      y: rect.top,
                    });
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Floating Tooltip */}
      {hoveredCell && interactive && (
        <div
          className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full -mt-2 px-2.5 py-1.5 bg-[#12141a]/95 backdrop-blur-md border border-white/10 rounded-lg text-xs shadow-xl text-slate-200 whitespace-nowrap animate-in fade-in duration-150"
          style={{
            left: `${hoveredCell.x}px`,
            top: `${hoveredCell.y}px`,
          }}
        >
          <div className="font-semibold text-white">
            {hoveredCell.item.count > 0 ? (
              <>
                <span className="text-emerald-400 font-bold">{hoveredCell.item.count}</span>{' '}
                {unitName}
              </>
            ) : (
              emptyTooltipText
            )}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            {formatFriendlyDate(hoveredCell.item.date)}
          </div>
        </div>
      )}
    </div>
  );
};
