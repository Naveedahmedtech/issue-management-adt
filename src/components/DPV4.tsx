// import React, { useEffect, useState, useRef } from 'react';
// import { DateRange, Range, RangeKeyDict } from 'react-date-range';
// import 'react-date-range/dist/styles.css';
// import 'react-date-range/dist/theme/default.css';
// import '../assets/css/date-range-picker-dark.css';
// import { useTheme } from '../context/ThemeContext';
// import { startOfWeek, endOfWeek, format } from 'date-fns';
// import { FaCalendarAlt, FaCalendarCheck } from 'react-icons/fa';

// interface DateRangePickerProps {
//   startDate: Date | null;
//   endDate: Date | null;
//   onChange: (start: Date, end: Date) => void;
// }

// const DateRangePicker: React.FC<DateRangePickerProps> = ({ startDate, endDate, onChange }) => {
//   const { theme } = useTheme();
//   const [weekMode, setWeekMode] = useState(false);
//   const [anchorWeek, setAnchorWeek] = useState<Date | null>(null);
//   const [selection, setSelection] = useState<Range[]>([{
//     startDate: startDate || new Date(),
//     endDate: endDate || startDate || new Date(),
//     key: 'selection'
//   }]);
//   const [open, setOpen] = useState(false);
//   const ref = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (ref.current && !ref.current.contains(e.target as Node)) {
//         setOpen(false);
//         setAnchorWeek(null);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   useEffect(() => {
//     if (!weekMode && startDate && endDate) {
//       setSelection([{ startDate, endDate, key: 'selection' }]);
//     }
//   }, [startDate, endDate, weekMode]);

//   const handleSelect = (ranges: RangeKeyDict) => {
//     const { selection: range } = ranges;
//     if (!weekMode) {
//       const { startDate: st, endDate: ed } = range;
//       if (st && ed) {
//         setSelection([{ startDate: st, endDate: ed, key: 'selection' }]);
//         onChange(st, ed);
//       }
//     } else {
//       const date = range.startDate!;
//       const weekStart = startOfWeek(date, { weekStartsOn: 1 });
//       const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
//       if (!anchorWeek) {
//         setAnchorWeek(weekStart);
//         setSelection([{ startDate: weekStart, endDate: weekEnd, key: 'selection' }]);
//         onChange(weekStart, weekEnd);
//       } else {
//         const anchorStart = startOfWeek(anchorWeek, { weekStartsOn: 1 });
//         const anchorEnd = endOfWeek(anchorWeek, { weekStartsOn: 1 });
//         const start = anchorStart < weekStart ? anchorStart : weekStart;
//         const end = anchorStart < weekStart ? weekEnd : anchorEnd;
//         setSelection([{ startDate: start, endDate: end, key: 'selection' }]);
//         onChange(start, end);
//       }
//     }
//   };

//   const toggleMode = () => {
//     if (weekMode) {
//       setWeekMode(false);
//       setAnchorWeek(null);
//       if (startDate && endDate) {
//         setSelection([{ startDate, endDate, key: 'selection' }]);
//       }
//     } else {
//       setWeekMode(true);
//       const base = startDate || selection[0].startDate;
//       const wkStart = startOfWeek(base, { weekStartsOn: 1 });
//       const wkEnd = endOfWeek(base, { weekStartsOn: 1 });
//       setAnchorWeek(wkStart);
//       setSelection([{ startDate: wkStart, endDate: wkEnd, key: 'selection' }]);
//       onChange(wkStart, wkEnd);
//     }
//   };

//   const current = selection[0];
//   const label = weekMode
//     ? `Weeks: ${format(current.startDate, 'MMM d')} – ${format(current.endDate, 'MMM d')}`
//     : `Range: ${format(current.startDate, 'MMM d, yyyy')} – ${format(current.endDate, 'MMM d, yyyy')}`;

//   return (
//     <div ref={ref} className="relative inline-block w-full">
//       <div
//         onClick={() => setOpen(o => !o)}
//         className={`flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border rounded-lg shadow cursor-pointer ${
//           theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
//         }`}
//       >
//         <div className="flex items-center space-x-2 text-gray-800 dark:text-gray-200">
//           {weekMode ? <FaCalendarCheck size={20} /> : <FaCalendarAlt size={20} />}
//           <span>{label}</span>
//         </div>
//         <button
//           onClick={e => { e.stopPropagation(); toggleMode(); }}
//           title={`Switch to ${weekMode ? 'Day Mode' : 'Week Mode'}`}
//           className="relative inline-flex items-center h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500"
//           aria-pressed={weekMode}
//         >
//           <span
//             className={`absolute left-0 top-0.5 h-5 w-5 bg-white rounded-full shadow transform transition-transform ${
//               weekMode ? 'translate-x-6' : 'translate-x-0'
//             }`}
//           />
//         </button>
//       </div>
//       {open && (
//         <div className={`mt-2 bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-4 ${
//           theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
//         }`}
//         >
//           <DateRange
//             editableDateInputs={false}
//             onChange={handleSelect}
//             moveRangeOnFirstSelection={false}
//             ranges={selection}
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
