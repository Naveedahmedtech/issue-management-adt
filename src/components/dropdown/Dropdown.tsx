import Select, { SingleValue } from 'react-select';
import { useField, useFormikContext, FormikContextType } from 'formik';
import { FormikSelectProps, SingleSelectProps } from '../../types/types';


const FormikSelect = ({ name, options, placeholder, className, value, onChange }: FormikSelectProps) => {
    const formikContext = useFormikContext<FormikContextType<any>>();
    const [field, meta] = useField(name);

    const handleChange = (selectedOption: SingleValue<SingleSelectProps>) => {
        if (formikContext?.setFieldValue) {
            // If we have Formik context, use setFieldValue
            formikContext.setFieldValue(name, selectedOption ? selectedOption.value : '');
        }
        if (onChange) {
            // If an onChange prop is provided, use it as well
            onChange(selectedOption || null);
        }
    };

    return (
        <div className={className}>
            <Select
                options={options}
                value={formikContext ? options.find(option => option.value === field.value) : value}
                onChange={handleChange}
                placeholder={placeholder}
                styles={{
                    control: (base, state) => ({
                        ...base,
                        backgroundColor: 'var(--color-background)',
                        borderColor: meta.touched && meta.error ? 'red' : 'var(--color-border)',
                        color: 'var(--color-text)',
                        '&:hover': {
                            borderColor: meta.touched && meta.error ? 'red' : 'var(--color-hover)',
                        },
                        boxShadow: state.isFocused ? '0 0 0 1px var(--color-primary)' : 'none',
                        zIndex: state.isFocused ? 20 : base.zIndex,
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
                    option: (base, { isFocused }) => ({
                        ...base,
                        backgroundColor: isFocused ? 'var(--color-hover)' : 'var(--color-background)',
                        color: isFocused ? 'var(--color-text-hover)' : 'var(--color-text)',
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
