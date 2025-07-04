import React from "react";
import DatePicker from "react-datepicker";
import clsx from "clsx";

const DateField: React.FC<{
    label: string;
    selected: Date | null;
    onChange: (date: Date | null) => void;
    className?: string;
    placeholderText?: string
}> = ({ label, selected, onChange, className, placeholderText }) => (
    <div className={clsx("w-full", className)}>
        {
            label &&
            <label className="block text-text">{label}</label>
        }
        <DatePicker
            selected={selected}
            onChange={onChange}
            placeholderText={placeholderText}
            className={clsx(
                "w-full p-2 bg-backgroundShade2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            )}
            calendarClassName="custom-calendar"
            dateFormat="yyyy-MM-dd"
        />
    </div>
);

export default DateField;
