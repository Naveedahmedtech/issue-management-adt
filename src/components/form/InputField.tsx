import React from "react";
import clsx from "clsx";

const InputField: React.FC<{
    label: string;
    type: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    required?: boolean;
    className?: string;
}> = ({ label, type, name, value, onChange, required = false, className }) => (
    <div className={clsx("mb-4", className)}>
        <label className="block text-text mb-2">{label}</label>
        {type === "textarea" ? (
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                className={clsx(
                    "w-full p-2 border bg-background border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                )}
                required={required}
            />
        ) : (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className={clsx(
                    "w-full p-2 border border-border bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                )}
                required={required}
            />
        )}
    </div>
);

export default InputField;