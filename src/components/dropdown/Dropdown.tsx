import Select, {MultiValue, SingleValue} from 'react-select';
import {useField, useFormikContext} from 'formik';

interface FormikSelectProps {
    name: string;
    options: { label: string; value: string }[];
    placeholder?: string;
    className?: string;
    value?: { label: string; value: string } | { label: string; value: string }[] | null;
    onChange?: (
        option: SingleValue<{ label: string; value: string }> | MultiValue<{ label: string; value: string }>
    ) => void;
    isMulti?: boolean;
    onMenuScrollToBottom?: () => void;
    isLoading?: boolean;  // Add loading state prop
    hasMoreOptions?: boolean;  // To prevent unnecessary loading when no more data
}

const FormikSelect: React.FC<FormikSelectProps> = ({
    name,
    options,
    placeholder,
    className,
    value,
    onChange,
    isMulti = false,
    onMenuScrollToBottom,
    isLoading = false,  // Default loading state
    hasMoreOptions = true,  // Default to true
}) => {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);

    const handleChange = (
        selectedOption: SingleValue<{ label: string; value: string }> | MultiValue<{ label: string; value: string }>
    ) => {
        if (setFieldValue) {
            setFieldValue(
                name,
                isMulti
                    ? (selectedOption as MultiValue<{ label: string; value: string }>).map((option) => option.value)
                    : (selectedOption as SingleValue<{ label: string; value: string }>)?.value || ''
            );
        }
        if (onChange) {
            onChange(selectedOption);
        }
    };

    const selectedValue = isMulti
        ? options.filter((option) => Array.isArray(field.value) && field.value.includes(option.value))
        : options.find((option) => option.value === field.value);

    return (
        <div className={className}>
            <Select
                isMulti={isMulti}
                options={options}
                value={selectedValue || value || null}
                onChange={handleChange}
                placeholder={placeholder}
                onMenuScrollToBottom={() => {
                    if (hasMoreOptions && onMenuScrollToBottom) {
                        onMenuScrollToBottom();  // Trigger load more if more options are available
                    }
                }}
                isLoading={isLoading}  // Show spinner while loading
                noOptionsMessage={() => (isLoading ? 'Loading...' : 'No options available')}
                loadingMessage={() => 'Loading more options...'}  // Show this when fetching more data
                styles={{
                    control: (base, state) => ({
                        ...base,
                        backgroundColor: 'var(--color-background)',
                        borderColor: meta.touched && meta.error ? 'red' : 'var(--color-text)',
                        color: 'var(--color-text)',
                        '&:hover': {
                            borderColor: meta.touched && meta.error ? 'red' : 'var(--color-hover)',
                        },
                        boxShadow: state.isFocused ? '0 0 0 1px var(--color-primary)' : 'none',
                        zIndex: state.isFocused ? 20 : base.zIndex,
                        minWidth: '150px',
                        borderRadius: '8px',
                        padding: '5px',
                        borderWidth: '2px',
                    }),
                    multiValue: (provided) => ({
                        ...provided,
                        backgroundColor: 'var(--color-background-shade-1)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                    }),
                    multiValueLabel: (provided) => ({
                        ...provided,
                        color: 'var(--text)',
                    }),
                    multiValueRemove: (provided) => ({
                        ...provided,
                        color: 'var(--color-text)',
                        ':hover': {
                            backgroundColor: 'var(--color-background-shade-2)',
                            color: 'var(--color-text)',
                        },
                        cursor: 'pointer',
                    }),
                    menu: (base) => ({
                        ...base,
                        backgroundColor: 'var(--color-background-shade-2)',
                        zIndex: 1000,
                    }),
                    menuPortal: (base) => ({
                        ...base,
                        zIndex: 1000,
                    }),
                    option: (base, { isFocused }) => ({
                        ...base,
                        backgroundColor: isFocused ? 'var(--color-background-shade-2)' : 'var(--color-background)',
                        color: isFocused ? 'var(--color-text)' : 'var(--color-text)',
                    }),
                    singleValue: (base) => ({
                        ...base,
                        color: 'var(--color-text)',
                    }),
                    placeholder: (base) => ({
                        ...base,
                        color: 'var(--color-text-hover)',
                    }),
                }}
                menuPortalTarget={document.body}
            />
            {meta.touched && meta.error && <div className="text-red-600 text-sm mt-1">{meta.error}</div>}
        </div>
    );
};

export default FormikSelect;
