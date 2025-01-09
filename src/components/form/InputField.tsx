import React from "react";
import clsx from "clsx";

const InputField: React.FC<{
    label: string;
    type: string;
    required?: boolean;
    className?: string;
    [x: string]: any; // For additional props
}> = ({ label, type, required = false, className, ...props }) => (
    <div className={clsx("mb-4", className)}>
        <label htmlFor={props.name} className="block text-text mb-2">{label}</label>
        {type === "textarea" ? (
            <textarea
                id={props.name}
                {...props.field}
                className={clsx(
                    "w-full p-2 border bg-background border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                )}
                required={required}
            />
        ) : (
            <input
                id={props.name}
                type={type}
                {...props.field}
                className={clsx(
                    "w-full p-2 border border-border bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                )}
                required={required}
            />
        )}
    </div>
);

export default InputField;
