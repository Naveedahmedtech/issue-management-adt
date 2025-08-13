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
  isBefore,
  min as dateMin,
  max as dateMax,
  format,
} from 'date-fns';
import { FaCalendarAlt, FaCalendarCheck } from 'react-icons/fa';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date, end: Date) => void;
}

const normalizeStart = (d: Date) => startOfDay(d);
const normalizeEnd = (d: Date) => endOfDay(d);

// Inclusive week range [Mon..Sun] with times normalized.
const weekRange = (d: Date) => {
  const ws = startOfWeek(d, { weekStartsOn: 1 });
  const we = endOfWeek(d, { weekStartsOn: 1 });
  return { start: normalizeStart(ws), end: normalizeEnd(we) };
};

// Make sure start <= end, and normalize time boundaries.
const makeRange = (a: Date, b: Date) => {
  const s = normalizeStart(a);
  const e = normalizeEnd(b);
  return isAfter(s, e) ? { start: e, end: s } : { start: s, end: e };
};

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
}) => {
  const { theme } = useTheme();

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  const [weekMode, setWeekMode] = useState(false);
  const [anchorWeekStart, setAnchorWeekStart] = useState<Date | null>(null);

  const [selection, setSelection] = useState<Range[]>([
    {
      startDate: startDate ? normalizeStart(startDate) : normalizeStart(new Date()),
      endDate: endDate ? normalizeEnd(endDate) : normalizeEnd(new Date()),
      key: 'selection',
    },
  ]);

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  // Reset anchor when opening to make the first click intuitive
  useEffect(() => {
    if (open) setAnchorWeekStart(null);
  }, [open]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, []);

  const applyRange = (start: Date, end: Date) => {
    const { start: s, end: e } = makeRange(start, end);
    setSelection([{ startDate: s, endDate: e, key: 'selection' }]);
    onChange(s, e);
  };

  const handleSelect = (ranges: RangeKeyDict): void => {
    const rawStart = ranges.selection.startDate!;
    const rawEnd = ranges.selection.endDate!;

    // Determine which date was actually clicked (react-date-range toggles between these).
    const clicked =
      rawStart && rawEnd && rawStart.getTime() === rawEnd.getTime() ? rawStart : rawEnd;

    if (!weekMode) {
      // Day mode: just normalize and apply.
      applyRange(rawStart, rawEnd);
      return;
    }

    // Week mode: click selects the week of the clicked date
    const { start: wStart, end: wEnd } = weekRange(clicked);

    if (!anchorWeekStart) {
      // First click after opening / or after switching to week mode
      setAnchorWeekStart(wStart);
      applyRange(wStart, wEnd);
      return;
    }

    // Subsequent clicks: select all weeks between anchor and clicked
    const { start: aStart } = weekRange(anchorWeekStart);
    const start = isBefore(wStart, aStart) ? wStart : aStart;
    const end = isAfter(wEnd, endOfDay(aStart)) ? wEnd : endOfDay(aStart);

    applyRange(start, end);
  };

  const toggleMode = () => {
    const next = !weekMode;
    setWeekMode(next);
    setAnchorWeekStart(null);

    if (next) {
      // Entering week mode: snap current (or today) to this week
      const base = selection[0].startDate ?? new Date();
      const { start, end } = weekRange(base);
      applyRange(start, end);
    } else {
      // Exiting week mode: keep the same visible range but normalize to day precision
      const curStart = selection[0].startDate ?? new Date();
      const curEnd = selection[0].endDate ?? new Date();
      applyRange(curStart, curEnd);
    }
  };

  const d1 = selection[0].startDate!;
  const d2 = selection[0].endDate!;
  const label =  `Selected Dates: ${format(d1, 'MMM d, yyyy')} – ${format(d2, 'MMM d, yyyy')}`;

  return (
    <div ref={ref} className="relative inline-block w-full">
      <div
        onClick={() => setOpen(o => !o)}
        className={`
          flex items-center justify-between
          px-4 py-2 bg-white dark:bg-gray-800
          border rounded-lg shadow cursor-pointer
          ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}
        `}
      >
        <div className="flex items-center space-x-2 text-gray-800 dark:text-gray-200">
          {weekMode ? <FaCalendarCheck size={20} /> : <FaCalendarAlt size={20} />}
          <span>{label}</span>
        </div>
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            toggleMode();
          }}
          title={
            weekMode
              ? 'Switch to Day Mode (custom date selection)'
              : 'Switch to Week Mode (auto group by week)'
          }
          className="
            relative inline-flex items-center h-6 w-12
            bg-gray-200 dark:bg-gray-700
            rounded-full transition-colors
            focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500
          "
          aria-pressed={weekMode}
          aria-label={weekMode ? 'Switch to Day Mode' : 'Switch to Week Mode'}
        >
          <span
            className={`
              absolute left-0 top-0.5 h-5 w-5 bg-white
              rounded-full shadow transform transition-transform
              ${weekMode ? 'translate-x-6' : 'translate-x-0'}
            `}
          />
        </button>
      </div>

      {open && (
        <div
          className={`mt-2 bg-white dark:bg-gray-800
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
              direction="vertical"
              className="rounded-lg overflow-hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
