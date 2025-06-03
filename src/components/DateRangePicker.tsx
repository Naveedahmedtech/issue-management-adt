import React, { useEffect, useState, useRef } from 'react';
import { DateRange, Range, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import '../assets/css/date-range-picker-dark.css';
import { useTheme } from '../context/ThemeContext';
import { startOfWeek, endOfWeek, addWeeks, format } from 'date-fns';
import { FaCalendarAlt, FaCalendarCheck } from 'react-icons/fa';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date, end: Date) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
}) => {
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);


  const [weekMode, setWeekMode] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [selection, setSelection] = useState<Range[]>([
    {
      startDate: startDate || new Date(),
      endDate: endDate || new Date(),
      key: 'selection',
    },
  ]);

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync props → internal selection
  useEffect(() => {
    if (startDate && endDate) {
      setSelection([{ startDate, endDate, key: 'selection' }]);
    }
  }, [startDate, endDate]);

  // Reset clickCount each time the picker opens
  useEffect(() => {
    if (open) setClickCount(0);
  }, [open]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (ranges: RangeKeyDict): void => {
    // the two dates from the picker
    const rawStart = ranges.selection.startDate!;
    const rawEnd = ranges.selection.endDate!;

    // figure out exactly which day was clicked
    const clickedDate =
      rawStart.getTime() === rawEnd.getTime() ? rawStart : rawEnd;

    // week boundaries for that click
    const clickedStart = startOfWeek(clickedDate, { weekStartsOn: 1 });
    const clickedEnd = endOfWeek(clickedDate, { weekStartsOn: 1 });

    // ── HERE ARE THE NON-NULL ASSERTIONS ──
    const curStart = selection[0].startDate!;
    const curEnd = selection[0].endDate!;

    // Day-range mode stays exactly as before
    if (!weekMode) {
      setSelection([{ startDate: rawStart, endDate: rawEnd, key: 'selection' }]);
      onChange(rawStart, rawEnd);
      return;
    }

    // === Week-mode multi-week logic ===

    // 1) first click in Week Mode: append/prepend around the default
    if (clickCount === 0) {
      let newStart = curStart;
      let newEnd = curEnd;

      if (clickedEnd < curStart) {
        newStart = clickedStart; // prepend
      } else if (clickedStart > curEnd) {
        newEnd = clickedEnd; // append
      }
      // otherwise leave as the default

      setSelection([{ startDate: newStart, endDate: newEnd, key: 'selection' }]);
      onChange(newStart, newEnd);
      setClickCount(1);
      return;
    }

    // 2) subsequent clicks: extend, shrink, or reset
    let newStart = curStart;
    let newEnd = curEnd;

    if (clickedEnd < curStart) {
      newStart = clickedStart; // extend backwards
    } else if (clickedStart > curEnd) {
      newEnd = clickedEnd; // extend forwards
    } else if (clickedStart.getTime() === curStart.getTime()) {
      newStart = addWeeks(curStart, 1); // shrink front boundary
    } else if (clickedEnd.getTime() === curEnd.getTime()) {
      newEnd = addWeeks(curEnd, -1); // shrink back boundary
    } else {
      newStart = clickedStart; // reset to that single week
      newEnd = clickedEnd;
    }

    setSelection([{ startDate: newStart, endDate: newEnd, key: 'selection' }]);
    onChange(newStart, newEnd);
    setClickCount(c => c + 1);
  };

  const toggleMode = () => {
    const next = !weekMode;
    setWeekMode(next);
    setClickCount(0);

    if (next) {
      const today = new Date();
      const ws = startOfWeek(today, { weekStartsOn: 1 });
      const we = endOfWeek(today, { weekStartsOn: 1 });
      setSelection([{ startDate: ws, endDate: we, key: 'selection' }]);
      onChange(ws, we);
    }
  };

  const d1 = selection[0].startDate!;
  const d2 = selection[0].endDate!;
  const label = weekMode
    ? `Selected Weeks: ${format(d1, 'MMM d')} – ${format(d2, 'MMM d')}`
    : `Selected Dates: ${format(d1, 'MMM d, yyyy')} – ${format(d2, 'MMM d, yyyy')}`;


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
          {weekMode ? (
            <FaCalendarCheck size={20} />
          ) : (
            <FaCalendarAlt size={20} />
          )}
          <span>{label}</span>
        </div>
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            toggleMode();
          }}
          title={weekMode ? 'Switch to Day Mode (custom date selection)' : 'Switch to Week Mode (auto group by week)'}

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
