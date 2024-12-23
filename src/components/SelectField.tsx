import React from 'react';
import Select from 'react-select';

interface Option {
    value: string;
    label: string;
}

interface ISelectFieldProps {
    label: string;
    options: Option[];
    name: string;
    value: Option | null;
    onChange: (option: Option | null) => void;
}

const SelectField: React.FC<ISelectFieldProps> = ({ label, options, name, value, onChange }) => {
    const handleChange = (selectedOption: Option | null) => {
        onChange(selectedOption);
    };

    return (
        <div className="mb-4">
            <label htmlFor={name} className="block text-sm font-medium text-text mb-1">
                {label}
            </label>
            <Select
                id={name}
                name={name}
                value={value}
                options={options}
                onChange={handleChange}
                classNamePrefix="react-select"
                className="react-select-container"
                styles={{
                    control: (base) => ({
                        ...base,
                        borderColor: 'var(--color-primary)',
                        backgroundColor: 'var(--color-background)',
                        color: 'var(--color-text)',
                        '&:hover': { borderColor: 'var(--color-primary)' },
                    }),
                    singleValue: (base) => ({
                        ...base,
                        color: 'var(--color-text)',
                    }),
                    menu: (base) => ({
                        ...base,
                        backgroundColor: 'var(--color-background)',
                    }),
                    option: (base, state) => ({
                        ...base,
                        color: state.isSelected ? 'var(--color-text-hover)' : 'var(--color-text)',
                        backgroundColor: state.isFocused ? 'var(--color-hover)' : 'var(--color-background)',
                    }),
                }}
            />
        </div>
    );
};

export default SelectField;
