import React, { useEffect, useState, useRef } from 'react';
import { DateRange, Range, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import '../assets/css/date-range-picker-dark.css';
import { useTheme } from '../context/ThemeContext';
import {
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  isAfter,
  min as dateMin,
  max as dateMax,
  format,
  addWeeks,
  differenceInCalendarWeeks,
  isEqual,
} from 'date-fns';
import { FaCalendarAlt, FaRegCalendarAlt, FaChevronDown } from 'react-icons/fa';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date, end: Date) => void;
}

const normalizeStart = (d: Date) => startOfDay(d);
const normalizeEnd = (d: Date) => endOfDay(d);

// Inclusive week range [Mon..Sun], time-normalized.
const weekRange = (d: Date) => {
  const ws = startOfWeek(d, { weekStartsOn: 1 });
  const we = endOfWeek(d, { weekStartsOn: 1 });
  return { start: normalizeStart(ws), end: normalizeEnd(we) };
};

// Cover any [a..b] with whole weeks.
const spanToWholeWeeks = (a: Date, b: Date) => {
  const aW = weekRange(a);
  const bW = weekRange(b);
  return {
    start: dateMin([aW.start, bW.start]),
    end: dateMax([aW.end, bW.end]),
  };
};

// Ensure start <= end, normalized.
const makeRange = (a: Date, b: Date) => {
  const s = normalizeStart(a);
  const e = normalizeEnd(b);
  return isAfter(s, e) ? { start: e, end: s } : { start: s, end: e };
};

// Count whole weeks in an already week-snapped span (inclusive).
const countWeeksIncl = (s: Date, e: Date) =>
  differenceInCalendarWeeks(e, s, { weekStartsOn: 1 }) + 1;

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
}) => {
  const { theme } = useTheme();

  // SSR-safe initial mobile detection
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  // Mode state (day/week)
  const [weekMode, setWeekMode] = useState(false);

  const [flashHeader, setFlashHeader] = useState(false);

  // Selection state (kept identical)
  const [selection, setSelection] = useState<Range[]>([
    {
      startDate: startDate ? normalizeStart(startDate) : normalizeStart(new Date()),
      endDate: endDate ? normalizeEnd(endDate) : normalizeEnd(new Date()),
      key: 'selection',
    },
  ]);

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [lastClickedWeekStart, setLastClickedWeekStart] = useState<Date | null>(null);

  // Resize listener (SSR-safe)
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 640);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Sync props → internal selection (normalized)
  useEffect(() => {
    if (startDate && endDate) {
      const { start, end } = makeRange(startDate, endDate);
      setSelection([{ startDate: start, endDate: end, key: 'selection' }]);
    }
  }, [startDate, endDate]);


  useEffect(() => {
    // Trigger a brief highlight whenever the dates change
    setFlashHeader(true);
    const t = setTimeout(() => setFlashHeader(false), 800);
    return () => clearTimeout(t);
  }, [selection[0]?.startDate, selection[0]?.endDate]);

  // Close on outside click
  // useEffect(() => {
  //   const handleClickOutside = (e: MouseEvent) => {
  //     if (ref.current && !ref.current.contains(e.target as Node)) {
  //       setOpen(false);
  //     }
  //   };
  //   document.addEventListener('pointerdown', handleClickOutside);
  //   return () => document.removeEventListener('pointerdown', handleClickOutside);
  // }, []);

  const applyRange = (start: Date, end: Date) => {
    const { start: s, end: e } = makeRange(start, end);
    setSelection([{ startDate: s, endDate: e, key: 'selection' }]);
    onChange(s, e);
    setFlashHeader(true);
  };

  const handleSelect = (ranges: RangeKeyDict): void => {
    const rawStart = ranges.selection.startDate;
    const rawEnd = ranges.selection.endDate;
    if (!rawStart || !rawEnd) return;

    if (!weekMode) {
      applyRange(rawStart, rawEnd);
      return;
    }

    const picked = spanToWholeWeeks(rawStart, rawEnd);
    const curStart = selection[0].startDate ?? picked.start;
    const curEnd = selection[0].endDate ?? picked.end;
    const current = spanToWholeWeeks(curStart, curEnd);

    const pickedIsSingleWeek = countWeeksIncl(picked.start, picked.end) === 1;
    const currentWeekCount = countWeeksIncl(current.start, current.end);

    const sameAsLastClick =
      lastClickedWeekStart && isEqual(lastClickedWeekStart, picked.start);

    setLastClickedWeekStart(picked.start);

    if (pickedIsSingleWeek) {
      const isAtStart = isEqual(picked.start, current.start);
      const isAtEnd = isEqual(picked.end, current.end);
      const hasMultipleWeeks = currentWeekCount > 1;

      // Toggle off edge week (existing behavior)
      if (hasMultipleWeeks && (isAtStart || isAtEnd) && !sameAsLastClick) {
        if (isAtStart) {
          const newStart = weekRange(addWeeks(current.start, 1)).start;
          applyRange(newStart, current.end);
          return;
        }
        if (isAtEnd) {
          const newEnd = weekRange(addWeeks(current.end, -1)).end;
          applyRange(current.start, newEnd);
          return;
        }
      }
    }

    // Merge/expand (existing behavior)
    const mergedStart = dateMin([current.start, picked.start]);
    const mergedEnd = dateMax([current.end, picked.end]);
    applyRange(mergedStart, mergedEnd);
  };

  const toggleMode = (next?: boolean) => {
    const newMode = typeof next === 'boolean' ? next : !weekMode;
    setWeekMode(newMode);

    const curStart = selection[0].startDate ?? new Date();
    const curEnd = selection[0].endDate ?? new Date();

    if (newMode) {
      // Entering week mode → snap to whole weeks covering current range
      const { start, end } = spanToWholeWeeks(curStart, curEnd);
      applyRange(start, end);
    } else {
      // Exiting week mode → keep same visible range, normalized to days
      applyRange(curStart, curEnd);
    }
  };

  const clearSelection = () => {
    if (weekMode) {
      const { start, end } = weekRange(new Date());
      applyRange(start, end);
    } else {
      const today = new Date();
      applyRange(today, today);
    }
  };

  const d1 = selection[0].startDate!;
  const d2 = selection[0].endDate!;
  const headerLabel = `${format(d1, 'MMM d, yyyy')} – ${format(d2, 'MMM d, yyyy')}`;
  const weekCount = countWeeksIncl(weekRange(d1).start, weekRange(d2).end);

  return (
    <div className="w-full">

      {/* Controls header */}
      <div className="mb-2 flex flex-col gap-2">
        {/* Top row: segmented toggle + header summary + clear */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          {/* Segmented toggle */}
          <div
            role="tablist"
            aria-label="Date selection mode"
            className="inline-flex rounded-md border overflow-hidden"
          >
            <button
             type="button" 
              role="tab"
              aria-selected={!weekMode}
              onClick={() => toggleMode(false)}
              className={`
                px-3 py-1.5 text-sm font-medium focus:outline-none
                ${!weekMode
                  ? 'bg-backgroundShade1 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'}
              `}
            >
              Day mode
            </button>
            <button
             type="button" 
              role="tab"
              aria-selected={weekMode}
              onClick={() => toggleMode(true)}
              className={`
                px-3 py-1.5 text-sm font-medium border-l
                ${weekMode
                  ? 'bg-amber-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'}
              `}
            >
              Week mode
            </button>
          </div>

          {/* Header summary (single source of truth) */}
          <div
            className={`flex flex-wrap items-center gap-2 rounded-md px-2 py-1 transition-all
    ${flashHeader
                ? 'ring-2 ring-backgroundShade1/60 bg-indigo-50 dark:bg-indigo-900/30'
                : ''}
  `}
            aria-live="polite"  // announce updates for a11y
          >
            <span className="text-sm text-gray-800 dark:text-gray-200 flex items-center gap-1">
              <FaRegCalendarAlt aria-hidden className="opacity-80" />
              {headerLabel}
            </span>

            {weekMode && (
              <span className="text-xs rounded-full px-2 py-0.5 bg-amber-100 text-amber-700">
                {weekCount} {weekCount === 1 ? 'week' : 'weeks'}
              </span>
            )}

            <button
              type="button"
              onClick={clearSelection}
              className="ml-1 text-xs underline text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Clear selection"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Helper text (slightly darker for readability) */}
        <p className="text-xs text-gray-700/80 dark:text-gray-300/80">
          {weekMode
            ? 'Week mode: selections snap to full Mon–Sun weeks. Click an edge week again to shrink the span.'
            : 'Day mode: pick any start and end dates. Selection is exact to the day.'}
        </p>
      </div>

      {/* Input trigger only (no repeated dates) */}
      <div ref={ref} className="relative inline-block w-full mt-1">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className={`
            w-full flex items-center justify-between
            px-4 py-2 bg-white dark:bg-gray-800
            border rounded-lg shadow
            ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}
            text-gray-800 dark:text-gray-200
          `}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={`Open calendar. ${weekMode ? 'Week mode' : 'Day mode'} active.`}
        >
          <span className="flex items-center space-x-2">
            <FaCalendarAlt size={18} className="opacity-80" />
            <span>Select timeframe</span>
          </span>
          <FaChevronDown className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div
            role="dialog"
            aria-label="Date range picker"
            className={`
              mt-2 bg-white dark:bg-gray-800
              border rounded-lg shadow-lg p-4
              ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}
              overflow-x-auto max-w-full
            `}
          >
            <div className="min-w-[300px] sm:min-w-[600px]">
              <DateRange
                editableDateInputs={false}
                moveRangeOnFirstSelection={false}
                ranges={selection}
                onChange={handleSelect}
                months={isMobile ? 1 : 2}
                direction="horizontal"
                className="rounded-lg overflow-hidden"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateRangePicker;
