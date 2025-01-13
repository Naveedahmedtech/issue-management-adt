import React from "react";
import Select from "react-select";
import clsx from "clsx";

const SelectField: React.FC<{
    label: string;
    options: { label: string; value: string }[];
    value: { label: string; value: string } | null;
    onChange: (option: { label: string; value: string } | null) => void;
    className?: string;
}> = ({ label, options, value, onChange, className }) => (
    <div className={clsx("mb-4", className)}>
        <label className="block text-text mb-2">{label}</label>
        <Select
            options={options}
            value={value}
            onChange={onChange}
            classNamePrefix="react-select"
            styles={{
                control: (provided) => ({
                    ...provided,
                    borderColor: 'var(--color-border)',
                    backgroundColor: 'var(--color-background-shade-1)',
                    borderRadius: '8px',
                    padding: '5px',
                    cursor: 'pointer',
                    '&:hover': {
                        borderColor: 'var(--color-primary)',
                    },
                }),
                singleValue: (provided) => ({
                    ...provided,
                    color: 'var(--color-text)',
                }),
                placeholder: (provided) => ({
                    ...provided,
                    color: 'var(--color-text-light)', // Use a lighter text color for the placeholder
                }),
                input: (provided) => ({
                    ...provided,
                    color: 'var(--color-text)',
                }),
                dropdownIndicator: (provided) => ({
                    ...provided,
                    color: 'var(--color-text)',
                    cursor: 'pointer',
                }),
                menu: (provided) => ({
                    ...provided,
                    backgroundColor: 'var(--color-background-shade-1)',
                }),
                option: (provided) => ({
                    ...provided,
                    backgroundColor: 'var(--color-background-shade-1)',
                    color: 'var(--color-text)',
                    cursor: 'pointer',
                    ':hover': {
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--color-text)',
                    },
                }),
                multiValueLabel: (provided) => ({
                    ...provided,
                    color: 'var(--color-text)',
                }),
            }}
        />
    </div>
);

export default SelectField;
