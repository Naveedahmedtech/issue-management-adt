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
                    borderColor: 'var(--color-border)', // Custom border color
                    backgroundColor: 'var(--color-background-shade-1)', // Background color for the control
                    borderRadius: '8px',
                    padding: '5px',
                    cursor: 'pointer',
                    '&:hover': {
                        borderColor: 'var(--color-primary)', // Hover border color
                    },
                }),
                // Targeting the placeholder directly in the 'control' element
                placeholder: (provided) => ({
                    ...provided,
                    color: 'var(--color-text) !important', // Force text color of input

                }),
                input: (provided) => ({
                    ...provided,
                    color: 'var(--color-text) !important', // Force text color of input
                }),
                dropdownIndicator: (provided) => ({
                    ...provided,
                    color: 'var(--color-text)  !important', // Dropdown arrow color
                    cursor: 'pointer',
                }),
                menu: (provided) => ({
                    ...provided,
                    backgroundColor: 'var(--color-background-shade-1)', // Background color for dropdown menu
                }),
                option: (provided:any) => ({
                    ...provided,
                    backgroundColor: 'var(--color-background-shade-1)',
                    color: 'var(--color-text)',
                    cursor: 'pointer',
                    ':hover': {
                        backgroundColor: 'var(--color-primary)', // Hover background color
                        color: 'var(--color-text)', // Hover text color
                    },
                }),
            }}
        />
    </div>
);

export default SelectField;
