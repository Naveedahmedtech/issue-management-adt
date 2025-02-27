import React from 'react';
import Select from 'react-select';

interface Option {
    value: string;
    label: string;
}

interface ISelectFieldProps {
    label: string;
    name: string;
    value: Option | null;
    options: Option[];  // Initial and dynamically loaded options
    loadOptions?: (inputValue: string, callback: (options: Option[]) => void) => void;
    onChange: (option: Option | null) => void;
}

const SelectField: React.FC<ISelectFieldProps> = ({ label, name, value, options, loadOptions, onChange }) => {
    const handleChange = (selectedOption: Option | null) => {
        onChange(selectedOption);
    };

    // Handle infinite scroll
    const handleMenuScrollToBottom = () => {
        // loadOptions('', () => {});  // Trigger loading more users when scrolled to bottom
    };

    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-text mb-1">
                {label}
            </label>
            <Select
                id={name}
                name={name}
                value={value || null}
                options={options}
                onChange={handleChange}
                onMenuScrollToBottom={handleMenuScrollToBottom}  // Trigger when scroll reaches bottom
                menuPortalTarget={document.body}
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
                    menu: (base) => ({
                        ...base,
                        zIndex: 9999,
                        backgroundColor: 'var(--color-background)',
                        maxHeight: 200,
                        overflowY: 'auto'
                    }),
                }}
            />
        </div>
    );
};

export default SelectField;
