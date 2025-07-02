import React from "react";
import clsx from "clsx";

const InputField: React.FC<{
    label: string;
    type: string;
    name: string;
    value?: string | number | null;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    required?: boolean;
    className?: string;
    labelColor?: string;
    inputClassName?: string;
    maxLength?: number;
    [x: string]: any;
}> = ({
    label,
    type,
    name,
    value,
    onChange,
    required = false,
    className,
    inputClassName,
    labelColor = "text-textDark",
    maxLength,
    ...props
}) => {
    const currentLength = value ? String(value).length : 0;

    return (
        <div className={clsx("", className)}>
            <label htmlFor={name} className={`block text-sm font-medium ${labelColor}`}>
                {label}
            </label>

            {type === "textarea" ? (
                <textarea
                    id={name}
                    name={name}
                    value={value as string}
                    onChange={onChange}
                    className={clsx(
                        "w-full p-2 border bg-backgroundShade2 border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
                        inputClassName
                    )}
                    required={required}
                    rows={4}
                    maxLength={maxLength}
                    {...props}
                />
            ) : (
                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value !== undefined ? String(value) : ""}
                    onChange={onChange}
                    className={clsx(
                        "w-full p-2 border border-border bg-backgroundShade2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
                        inputClassName
                    )}
                    required={required}
                    maxLength={maxLength}
                    {...props}
                />
            )}

            {maxLength && (
                <div className="text-right text-xs text-gray-500 mt-1">
                    {currentLength} / {maxLength}
                </div>
            )}
        </div>
    );
};

export default InputField;
