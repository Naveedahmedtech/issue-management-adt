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

const SelectField: React.FC<ISelectFieldProps> = ({ label, name, value, options, onChange }) => {
    const handleChange = (selectedOption: Option | null) => {
        onChange(selectedOption);
    };

    // Handle infinite scroll
    const handleMenuScrollToBottom = () => {
        // loadOptions('', () => {});  // Trigger loading more users when scrolled to bottom
    };

    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-textDark mb-1">
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
                        borderColor: 'var(--color-border)',
                        backgroundColor: 'var(--color-background-shade-2)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                    }),
                    menu: (base) => ({
                        ...base,
                        zIndex: 9999,
                        backgroundColor: 'var(--color-background-shade-2)',
                        maxHeight: 200,
                        overflowY: 'auto'
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
                }}
            />
        </div>
    );
};

export default SelectField;
