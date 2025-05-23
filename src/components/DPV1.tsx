// import React, { useEffect, useState } from 'react';
// import { DateRange, Range, RangeKeyDict } from 'react-date-range';
// import 'react-date-range/dist/styles.css';
// import 'react-date-range/dist/theme/default.css';
// import '../assets/css/date-range-picker-dark.css'
// import { useTheme } from '../context/ThemeContext';

// interface DateRangePickerProps {
//   /** Currently selected start date or null */
//   startDate: Date | null;
//   /** Currently selected end date or null */
//   endDate: Date | null;
//   /** Called when user picks a new date range */
//   onChange: (start: Date, end: Date) => void;
// }

// const DateRangePicker: React.FC<DateRangePickerProps> = ({ startDate, endDate, onChange }) => {
//   const { theme } = useTheme();

//   // Use Range[] to align with react-date-range types
//   const [selection, setSelection] = useState<Range[]>([{
//     startDate: startDate ?? new Date(),
//     endDate: endDate ?? new Date(),
//     key: 'selection'
//   }]);

//   // Sync external props into internal state
//   useEffect(() => {
//     if (startDate && endDate) {
//       setSelection([{ startDate, endDate, key: 'selection' }]);
//     }
//   }, [startDate, endDate]);

//   // Handler invoked by the calendar
//   const handleSelect = (ranges: RangeKeyDict) => {
//     const range = ranges.selection;
//     // Ensure non-undefined dates for state
//     const sd = range.startDate ?? new Date();
//     const ed = range.endDate ?? new Date();
//     const updatedRange: Range = { ...range, startDate: sd, endDate: ed, key: 'selection' };
//     setSelection([updatedRange]);

//     // Only emit when both dates are provided
//     if (range.startDate && range.endDate) {
//       onChange(range.startDate, range.endDate);
//     }
//   };

//   const wrapperClass = `date-range-picker ${theme === 'dark' ? 'rdr-picker-dark' : ''}`;

//   console.log({ startDate, endDate })
//   return (
//     <div className={wrapperClass}>
//       <DateRange
//         editableDateInputs={false}
//         onChange={handleSelect}
//         moveRangeOnFirstSelection={false}
//         ranges={selection}
//         months={2}
//         direction="horizontal"

//       />
//     </div>
//   );
// };

// export default DateRangePicker;
