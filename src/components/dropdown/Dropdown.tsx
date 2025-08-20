import Select, { MultiValue, SingleValue } from 'react-select';
import { useField, useFormikContext } from 'formik';

interface Option {
  label: string;
  value: string;
}

interface FormikSelectProps {
  name: string;
  options: Option[];
  placeholder?: string;
  className?: string;
  value?: Option | Option[] | null;
  onChange?: (option: SingleValue<Option> | MultiValue<Option>) => void;
  isMulti?: boolean;
  onMenuScrollToBottom?: () => void;
  isLoading?: boolean;
  hasMoreOptions?: boolean;
  label?: string;
  light?: boolean;
}

const FormikSelect: React.FC<FormikSelectProps> = (props) => {
  const {
    name,
    options,
    placeholder,
    className,
    value,
    onChange,
    isMulti = false,
    onMenuScrollToBottom,
    isLoading = false,
    hasMoreOptions = true,
    label,
    light = false,
  } = props;

  const { setFieldValue } = useFormikContext<any>();
  const [field, meta] = useField(name);

  const pick = (darkToken: string, lightToken: string) => (light ? darkToken : lightToken);

  const handleChange = (
    selectedOption: SingleValue<Option> | MultiValue<Option>
  ) => {
    if (setFieldValue) {
      setFieldValue(
        name,
        isMulti
          ? (selectedOption as MultiValue<Option>).map((opt) => opt.value)
          : (selectedOption as SingleValue<Option>)?.value || ''
      );
    }
    onChange?.(selectedOption);
  };

  const selectedValue = isMulti
    ? options.filter(
        (opt) => Array.isArray(field.value) && field.value.includes(opt.value)
      )
    : options.find((opt) => opt.value === field.value);

  const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={name}
          className={`block text-sm font-medium ${light ? "text-text" : "text-textDark"} mb-1`}
        >
          {label}
        </label>
      )}
      <Select
        isMulti={isMulti}
        options={options}
        value={selectedValue ?? value ?? null}
        onChange={handleChange}
        placeholder={placeholder}
        onMenuScrollToBottom={() => {
          if (hasMoreOptions && onMenuScrollToBottom) onMenuScrollToBottom();
        }}
        isLoading={isLoading}
        noOptionsMessage={() => (isLoading ? 'Loading...' : 'No options available')}
        loadingMessage={() => 'Loading more options...'}

        // ✅ Key fixes for modals
        menuPortalTarget={isBrowser ? document.body : undefined}
        menuPosition="fixed"
        menuShouldScrollIntoView={false}

        styles={{
          control: (base, state) => ({
            ...base,
            backgroundColor: pick('var(--color-background-hover)', 'var(--color-background-shade-2)'),
            borderColor: meta.touched && meta.error ? 'red' : 'var(--color-background)',
            color: pick('var(--color-background)', 'var(--color-text-dark)'),
            '&:hover': {
              borderColor: meta.touched && meta.error ? 'red' : 'var(--color-primary)',
            },
            boxShadow: state.isFocused ? '0 0 0 1px var(--color-primary)' : 'none',
            zIndex: state.isFocused ? "100000000" : (base as any).zIndex,
            minWidth: '150px',
            borderRadius: '8px',
            padding: '5px',
          }),
          multiValue: (provided) => ({
            ...provided,
            backgroundColor: pick('var(--color-background-shade-1)', 'var(--color-background-shade-2)'),
            borderRadius: '8px',
            cursor: 'pointer',
            color: pick('var(--color-text-text)', 'var(--color-text-dark)'),
          }),
          multiValueLabel: (provided) => ({
            ...provided,
            color: pick('var(--color-text-hover)', 'var(--color-text-dark)'),
          }),
          multiValueRemove: (provided) => ({
            ...provided,
            color: pick('var(--color-text-hover)', 'var(--color-text-dark)'),
            ':hover': {
              backgroundColor: pick('var(--color-background)', 'var(--color-background-shade-2)'),
              color: 'var(--color-text)',
            },
            cursor: 'pointer',
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: pick('var(--color-hover)', 'var(--color-text)'),
            // Make sure the menu beats your modal (increase if your modal uses higher values)
            zIndex: 100001,
          }),
          menuPortal: (base) => ({
            ...base,
            zIndex: 100001,
          }),
          option: (base, { isFocused, isSelected }) => ({
            ...base,
            backgroundColor: isSelected
              ? pick('var(--color-background-shade-1)', 'var(--color-background-shade-2)')
              : isFocused
              ? pick('var(--color-background-shade-1)', 'var(--color-background-shade-2)')
              : 'transparent',
            color: pick('var(--color-text-hover)', 'var(--color-text-dark)'),
          }),
          singleValue: (base) => ({
            ...base,
            color: pick('var(--color-text-hover)', 'var(--color-text-dark)'),
          }),
          placeholder: (base) => ({
            ...base,
            color: 'var(--color-text-secondary)',
          }),
        }}
      />
      {meta.touched && meta.error && (
        <div className="text-red-600 text-sm mt-1">{meta.error}</div>
      )}
    </div>
  );
};

export default FormikSelect;

