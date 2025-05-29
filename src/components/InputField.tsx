import clsx from "clsx";
import { useField } from 'formik';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { IconColors } from '../utils/styles';
import { IInputFieldProps } from '../types/types';

const InputField: React.FC<IInputFieldProps & {
  labelColor?: string;
  className?: string; // 👉 add className prop
}> = ({
  label,
  leftIcon,
  readonly = false,
  labelColor = 'text-text',
  className, // 👉 destructure
  ...props
}) => {
    const [field, meta] = useField(props);
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => setShowPassword(!showPassword);

    const inputType =
      props.type === 'password' && !showPassword ? 'password' : 'text';
    const inputProps = {
      ...field,
      type: inputType,
      id: props.name,
    };
    console.log('labelColor', labelColor)
    return (
      <div className="mb-2">
        <label
          htmlFor={props.name}
          className={`block text-sm font-medium ${labelColor}`}
        >

          {label}
        </label>
        <div className="mt-1 relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            {...inputProps}
            readOnly={readonly}
            style={{ background: 'var(--color-background-shade-2)' }}
            className={clsx(
              "block w-full sm:text-sm outline-none text-textDark pr-3",
              leftIcon ? "pl-10" : "pl-2",
              !readonly ? "focus:border-primary border-background" : "focus:outline-none border-none",
              meta.touched && meta.error && "border-red-500",
              className // 👉 apply incoming className last (can override)
            )}
          />

          {props.type === 'password' && (
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={toggleShowPassword}
            >
              {showPassword ? (
                <FaEyeSlash color={IconColors.color} />
              ) : (
                <FaEye color={IconColors.color} />
              )}
            </div>
          )}
        </div>
        {meta.touched && meta.error && (
          <div className="text-xs text-red-500">{meta.error}</div>
        )}
      </div>
    );
  };

export default InputField;
