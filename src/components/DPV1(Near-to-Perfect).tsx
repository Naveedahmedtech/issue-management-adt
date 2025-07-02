// import React, { useEffect, useState, useRef } from 'react';
// import { DateRange, Range, RangeKeyDict } from 'react-date-range';
// import 'react-date-range/dist/styles.css';
// import 'react-date-range/dist/theme/default.css';
// import '../assets/css/date-range-picker-dark.css';
// import { useTheme } from '../context/ThemeContext';
// import { startOfWeek, endOfWeek, addWeeks, format } from 'date-fns';
// import { FaCalendarAlt, FaCalendarCheck } from 'react-icons/fa';

// interface DateRangePickerProps {
//   startDate: Date | null;
//   endDate: Date | null;
//   onChange: (start: Date, end: Date) => void;
// }

// const DateRangePicker: React.FC<DateRangePickerProps> = ({ startDate, endDate, onChange }) => {
//   const { theme } = useTheme();
//   const [weekMode, setWeekMode] = useState(false);
//   const [clickCount, setClickCount] = useState(0);
//   const [selection, setSelection] = useState<Range[]>([
//     { startDate: startDate || new Date(), endDate: endDate || new Date(), key: 'selection' }
//   ]);
//   const [open, setOpen] = useState(false);
//   const ref = useRef<HTMLDivElement>(null);

//   // Sync props → internal
//   useEffect(() => {
//     if (startDate && endDate) {
//       setSelection([{ startDate, endDate, key: 'selection' }]);
//     }
//   }, [startDate, endDate]);

//   // Reset click counter when opening
//   useEffect(() => {
//     if (open) setClickCount(0);
//   }, [open]);

//   // Close on outside click
//   useEffect(() => {
//     const handle = (e: MouseEvent) => {
//       if (ref.current && !ref.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handle);
//     return () => document.removeEventListener('mousedown', handle);
//   }, []);

//   const handleSelect = (ranges: RangeKeyDict) => {
//     // figure out which day the user actually clicked:
//     const rawStart = ranges.selection.startDate!;
//     const rawEnd   = ranges.selection.endDate!;
//     const clickedDate = rawStart.getTime() === rawEnd.getTime()
//       ? rawStart
//       : rawEnd;

//     // week boundaries of the clicked date
//     const clickedStart = startOfWeek(clickedDate, { weekStartsOn: 1 });
//     const clickedEnd   = endOfWeek(clickedDate,   { weekStartsOn: 1 });
//     const { startDate: curStart, endDate: curEnd } = selection[0];

//     if (!weekMode) {
//       // ← Unchanged Day Mode
//       if (rawStart && rawEnd) {
//         setSelection([{ startDate: rawStart, endDate: rawEnd, key: 'selection' }]);
//         onChange(rawStart, rawEnd);
//       }
//       return;
//     }

//     // === Multi-week logic ===

//     // 1) very first click in Week Mode → reset to that week
//     if (clickCount === 0) {
//       setSelection([{ startDate: clickedStart, endDate: clickedEnd, key: 'selection' }]);
//       onChange(clickedStart, clickedEnd);
//       setClickCount(1);
//       return;
//     }

//     // 2) subsequent clicks → extend, shrink, or reset
//     let newStart = curStart;
//     let newEnd   = curEnd;

//     // extend backwards?
//     if (clickedEnd < curStart) {
//       newStart = clickedStart;
//     }
//     // extend forwards?
//     else if (clickedStart > curEnd) {
//       newEnd = clickedEnd;
//     }
//     // shrink start boundary?
//     else if (clickedStart.getTime() === curStart.getTime()) {
//       newStart = addWeeks(curStart, 1);
//     }
//     // shrink end boundary?
//     else if (clickedEnd.getTime() === curEnd.getTime()) {
//       newEnd = addWeeks(curEnd, -1);
//     }
//     // click inside span → reset to that single week
//     else {
//       newStart = clickedStart;
//       newEnd   = clickedEnd;
//     }

//     setSelection([{ startDate: newStart, endDate: newEnd, key: 'selection' }]);
//     onChange(newStart, newEnd);
//     setClickCount(c => c + 1);
//   };

//   const toggleMode = () => {
//     const next = !weekMode;
//     setWeekMode(next);
//     setClickCount(0);

//     if (next) {
//       // initialize to current week
//       const today = new Date();
//       const ws = startOfWeek(today, { weekStartsOn: 1 });
//       const we = endOfWeek(today,   { weekStartsOn: 1 });
//       setSelection([{ startDate: ws, endDate: we, key: 'selection' }]);
//       onChange(ws, we);
//     }
//   };

//   const { startDate: d1, endDate: d2 } = selection[0];
//   const label = weekMode
//     ? `Weeks: ${format(d1, 'MMM d')} – ${format(d2, 'MMM d')}`
//     : `Range: ${format(d1, 'MMM d, yyyy')} – ${format(d2, 'MMM d, yyyy')}`;

//   return (
//     <div ref={ref} className="relative inline-block w-full">
//       <div
//         onClick={() => setOpen(o => !o)}
//         className={`
//           flex items-center justify-between
//           px-4 py-2 bg-white dark:bg-gray-800
//           border rounded-lg shadow cursor-pointer
//           ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}
//         `}
//       >
//         <div className="flex items-center space-x-2 text-gray-800 dark:text-gray-200">
//           {weekMode ? <FaCalendarCheck size={20} /> : <FaCalendarAlt size={20} />}
//           <span>{label}</span>
//         </div>
//         <button
//           onClick={e => { e.stopPropagation(); toggleMode(); }}
//           title={`Switch to ${weekMode ? 'Day Range Mode' : 'Week Mode'}`}
//           className="
//             relative inline-flex items-center h-6 w-12
//             bg-gray-200 dark:bg-gray-700
//             rounded-full transition-colors
//             focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500
//           "
//           aria-pressed={weekMode}
//         >
//           <span
//             className={`
//               absolute left-0 top-0.5 h-5 w-5 bg-white
//               rounded-full shadow transform transition-transform
//               ${weekMode ? 'translate-x-6' : 'translate-x-0'}
//             `}
//           />
//         </button>
//       </div>

//       {open && (
//         <div className={`
//           mt-2 bg-white dark:bg-gray-800
//           border rounded-lg shadow-lg p-4
//           ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}
//         `}>
//           <DateRange
//             editableDateInputs={false}
//             moveRangeOnFirstSelection={false}
//             ranges={selection}
//             onChange={handleSelect}
//             months={2}
//             direction="vertical"
//             className="rounded-lg overflow-hidden"
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default DateRangePicker;
