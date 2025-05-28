import React from "react";
import clsx from "clsx";

const InputField: React.FC<{
    label: string;
    type: string;
    name: string; // Ensure name is required
    value?: string | number | null; // Accept both string and number
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    required?: boolean;
    className?: string;
    labelColor?: string;
    [x: string]: any; // For additional props
}> = ({ label, type, name, value, onChange, required = false, className, labelColor = "text-textDark", ...props }) => (
    <div className={clsx("mb-4", className)}>
        <label htmlFor={name} className={`block text-sm  ${labelColor}`}>
            {label}
        </label>
        {type === "textarea" ? (
            <textarea
                id={name}
                name={name}
                value={value as string} // Ensure textarea only takes string values
                onChange={onChange}
                className={clsx(
                    "w-full p-2 border bg-backgroundShade2 border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                )}
                required={required}
                rows={4}
                {...props}
            />
        ) : (
            <input
                id={name}
                name={name}
                type={type}
                value={value !== undefined ? String(value) : ""} // Convert number to string
                onChange={onChange}
                className={clsx(
                    "w-full p-2 border border-border bg-backgroundShade2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                )}
                required={required}
                {...props}
            />
        )}
    </div>
);

export default InputField;
