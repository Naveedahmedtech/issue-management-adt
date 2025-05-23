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
//   const [selection, setSelection] = useState<Range[]>([
//     { startDate: startDate || new Date(), endDate: endDate || new Date(), key: 'selection' }
//   ]);
//   const [open, setOpen] = useState(false);
//   const ref = useRef<HTMLDivElement>(null);

//   // Sync external props
//   useEffect(() => {
//     if (startDate && endDate) {
//       setSelection([{ startDate, endDate, key: 'selection' }]);
//     }
//   }, [startDate, endDate]);

//   // Close on outside click
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (ref.current && !ref.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleSelect = (ranges: RangeKeyDict) => {
//     const clicked = ranges.selection.startDate!;
//     if (!weekMode) {
//       // Day mode (unchanged)
//       const { startDate: s, endDate: e } = ranges.selection;
//       if (s && e) {
//         setSelection([{ startDate: s, endDate: e, key: 'selection' }]);
//         onChange(s, e);
//       }
//       return;
//     }

//     // Multi-week mode
//     const clickedStart = startOfWeek(clicked, { weekStartsOn: 1 });
//     const clickedEnd   = endOfWeek(clicked,   { weekStartsOn: 1 });
//     const { startDate: curStart, endDate: curEnd } = selection[0];
//     let newStart = curStart, newEnd = curEnd;

//     if (clickedEnd < curStart) {
//       newStart = clickedStart;
//     } else if (clickedStart > curEnd) {
//       newEnd = clickedEnd;
//     } else if (clickedStart.getTime() === curStart.getTime()) {
//       newStart = addWeeks(curStart, 1);
//     } else if (clickedEnd.getTime() === curEnd.getTime()) {
//       newEnd = addWeeks(curEnd, -1);
//     } else {
//       // reset to single week if you click in the middle
//       newStart = clickedStart;
//       newEnd   = clickedEnd;
//     }

//     setSelection([{ startDate: newStart, endDate: newEnd, key: 'selection' }]);
//     onChange(newStart, newEnd);
//   };

//   const toggleMode = () => {
//     const next = !weekMode;
//     setWeekMode(next);
//     if (next) {
//       const today = new Date();
//       const ws = startOfWeek(today, { weekStartsOn: 1 });
//       const we = endOfWeek(today, { weekStartsOn: 1 });
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
//         className={`flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border rounded-lg shadow cursor-pointer ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}
//       >
//         <div className="flex items-center space-x-2 text-gray-800 dark:text-gray-200">
//           {weekMode ? <FaCalendarCheck size={20} /> : <FaCalendarAlt size={20} />}
//           <span>{label}</span>
//         </div>
//         <button
//           onClick={e => { e.stopPropagation(); toggleMode(); }}
//           title={`Switch to ${weekMode ? 'Day Range Mode' : 'Week Mode'}`}
//           className="relative inline-flex items-center h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500"
//           aria-pressed={weekMode}
//         >
//           <span
//             className={`absolute left-0 top-0.5 h-5 w-5 bg-white rounded-full shadow transform transition-transform ${weekMode ? 'translate-x-6' : 'translate-x-0'}`}
//           />
//         </button>
//       </div>

//       {open && (
//         <div className={`mt-2 bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
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
