import React from 'react';
import Select, { MultiValue, SingleValue } from 'react-select';

interface UserSelectProps {
    name?: string;
    options: { label: string; value: string }[];
    value?: string | string[] | null;
    onChange?: (
        value: string | string[] | null,
        option: SingleValue<{ label: string; value: string }> | MultiValue<{ label: string; value: string }>
    ) => void;
    placeholder?: string;
    className?: string;
    isMulti?: boolean;
    onMenuScrollToBottom?: () => void;
    isLoading?: boolean;
    hasMoreOptions?: boolean;
}

const UserSelect: React.FC<UserSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select...',
    className,
    isMulti = false,
    onMenuScrollToBottom,
    isLoading = false,
    hasMoreOptions = true,
}) => {
    const selectedValue = isMulti
        ? options.filter((option) => Array.isArray(value) && value.includes(option.value))
        : options.find((option) => option.value === value);

    const handleChange = (
        selected: SingleValue<{ label: string; value: string }> | MultiValue<{ label: string; value: string }>
    ) => {
        if (onChange) {
            const extractedValue = isMulti
                ? (selected as MultiValue<{ label: string; value: string }>).map((opt) => opt.value)
                : (selected as SingleValue<{ label: string; value: string }>)?.value ?? null;

            onChange(extractedValue, selected);
        }
    };

    return (
        <div className={className}>
            <Select
                isMulti={isMulti}
                options={options}
                value={selectedValue || null}
                onChange={handleChange}
                placeholder={placeholder}
                onMenuScrollToBottom={() => {
                    if (hasMoreOptions && onMenuScrollToBottom) {
                        onMenuScrollToBottom();
                    }
                }}
                isLoading={isLoading}
                noOptionsMessage={() => (isLoading ? 'Loading...' : 'No options available')}
                loadingMessage={() => 'Loading more options...'}
                styles={{
                    control: (base) => ({
                        ...base,
                        borderColor: 'var(--color-border)',
                        backgroundColor: 'var(--color-background-shade-2)',
                        borderRadius: '8px',
                        padding: '5px',
                        cursor: 'pointer',
                    }),
                    multiValue: (provided) => ({
                        ...provided,
                        backgroundColor: 'var(--color-background-shade-1)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        color: 'var(--color-text)'
                    }),
                    multiValueLabel: (provided) => ({
                        ...provided,
                        color: 'var(--text)',
                    }),
                    multiValueRemove: (provided) => ({
                        ...provided,
                        color: 'var(--color-text)',
                        ':hover': {
                            backgroundColor: 'var(--color-primary)',
                            color: 'var(--color-text)',
                        },
                        cursor: 'pointer',
                    }),
                    menu: (base) => ({
                        ...base,
                        backgroundColor: 'var(--color-background)',
                        zIndex: 1000,
                    }),
                    menuPortal: (base) => ({
                        ...base,
                        zIndex: 1000,
                    }),
                    option: (provided) => ({
                        ...provided,
                        backgroundColor: 'var(--color-background-shade-2)',
                        color: 'var(--color-text-dark)',
                        cursor: 'pointer',
                        ':hover': {
                            backgroundColor: 'var(--color-hover)',
                            color: 'var(--color-text)',
                        },
                    }),
                    singleValue: (provided) => ({
                        ...provided,
                        color: 'var(--color-text-dark)',
                    }),
                    placeholder: (base) => ({
                        ...base,
                        color: 'var(--color-text-hover)',
                    }),
                }}
                menuPortalTarget={document.body}
            />
        </div>
    );
};

export default UserSelect;
