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
        <div className="">
            <label htmlFor={name} className="block text-sm font-medium text-text mb-1">
                {label}
            </label>
            <Select
                id={name}
                name={name}
                value={value || null} // Ensure value defaults to null if undefined
                options={options}
                onChange={handleChange}
                menuPortalTarget={document.body} // Render dropdown outside parent container
                classNamePrefix="react-select"
                className="react-select-container"
                styles={{
                    control: (base) => ({
                        ...base,
                        borderColor: 'var(--color-primary)',
                        backgroundColor: 'var(--color-background)',
                        color: 'var(--color-text)',
                        '&:hover': { borderColor: 'var(--color-primary)' },
                        minWidth: "150px"
                    }),
                    singleValue: (base) => ({
                        ...base,
                        color: 'var(--color-text)',
                    }),
                    menu: (base) => ({
                        ...base,
                        zIndex: 9999, // Ensure dropdown is above other elements
                        backgroundColor: 'var(--color-background)',
                    }),
                    menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999, // Ensure the portal has the highest z-index
                    }),
                    option: (base, state) => ({
                        ...base,
                        color: state.isSelected ? 'var(--color-text-primary)' : 'var(--color-text)',
                        backgroundColor: state.isFocused ? 'var(--color-primary)' : 'var(--color-background)',
                    }),
                }}
            />
        </div>
    );
};

export default SelectField;
