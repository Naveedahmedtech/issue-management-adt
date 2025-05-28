import React from "react";
import Select from "react-select";
import clsx from "clsx";

const SelectField: React.FC<{
    label: string;
    options: { label: string; value: string }[];
    value: { label: string; value: string } | null;
    onChange: (option: { label: string; value: string } | null) => void;
    className?: string;
    labelColor?: string;
}> = ({ label, options, value, onChange, className,labelColor = "text-textDark" }) => (
    <div className={clsx("mb-4", className)}>
        <label className={`block text-sm  ${labelColor}`}>{label}</label>
        <Select
            options={options}
            value={value}
            onChange={onChange}
            classNamePrefix="react-select"
            styles={{
                control: (provided) => ({
                    ...provided,
                    borderColor: 'var(--color-border)',
                    backgroundColor: 'var(--color-background-shade-2)',
                    borderRadius: '8px',
                    padding: '5px',
                    cursor: 'pointer',
                    '&:hover': {
                        borderColor: 'var(--color-background-shade-2)',
                    },
                }),
                singleValue: (provided) => ({
                    ...provided,
                    color: 'var(--color-text-dark)',
                }),
                placeholder: (provided) => ({
                    ...provided,
                    color: 'var(--color-text-dark)', // Use a lighter text-dark color for the placeholder
                }),
                input: (provided) => ({
                    ...provided,
                    color: 'var(--color-text-dark)',
                }),
                dropdownIndicator: (provided) => ({
                    ...provided,
                    color: 'var(--color-text-dark)',
                    cursor: 'pointer',
                }),
                menu: (provided) => ({
                    ...provided,
                    backgroundColor: 'var(--color-background-shade-2)',
                }),
                option: (provided) => ({
                    ...provided,
                    backgroundColor: 'var(--color-background-shade-2)',
                    color: 'var(--color-text-dark)',
                    cursor: 'pointer',
                    ':hover': {
                        backgroundColor: 'var(--color-background)',
                        color: 'var(--color-text-dark)',
                    },
                }),
                multiValueLabel: (provided) => ({
                    ...provided,
                    color: 'var(--color-text-dark)',
                }),
            }}
        />
    </div>
);

export default SelectField;
