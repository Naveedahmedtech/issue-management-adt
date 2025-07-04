import React from "react";
import clsx from "clsx";

export interface CheckboxFieldProps {
    /** Text label shown to the right of the box */
    label: string;
    /** name & id for the input */
    name: string;
    /** controlled checked state */
    checked: boolean;
    /** change handler */
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    /** disable toggle */
    disabled?: boolean;
    /** extra wrapper classes */
    className?: string;
    labelColor?: string;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
                                                         label,
                                                         name,
                                                         checked,
                                                         onChange,
                                                         disabled = false,
                                                         className,
                                                         labelColor = 'text-text'
                                                     }) => (
    <div className={clsx("flex items-center mb-4", className)}>
        <input
            type="checkbox"
            id={name}
            name={name}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className={clsx(
                "h-4 w-4 border rounded  focus:ring-offset-0",
                // match your theme tokens
                "border-border",
                "text-textDark",
                disabled && "opacity-50 cursor-not-allowed"
            )}
        />
        <label htmlFor={name} className={`ml-2 ${labelColor} select-none`}>
            {label}
        </label>
    </div>
);

export default CheckboxField;
