import clsx from "clsx";
import { useField } from "formik";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IconColors } from "../utils/styles";
import { IInputFieldProps } from "../types/types";

const InputField: React.FC<
  IInputFieldProps & {
    labelColor?: string;
    className?: string;
  }
> = ({
  label,
  leftIcon,
  readonly = false,
  labelColor = "text-text",
  className,
  disabled,
  ...props
}) => {
  const [field, meta] = useField(props);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = props.type === "password";
  const canTogglePassword = isPassword && !readonly && !disabled;

  const toggleShowPassword = () => {
    if (canTogglePassword) setShowPassword((p) => !p);
  };

  const inputType =
    isPassword && !showPassword ? "password" : "text";

  const inputProps = {
    ...field,
    type: inputType,
    id: props.name,
  };

  return (
    <div className="mb-2">
      <label
        htmlFor={props.name}
        className={clsx(
          "block text-sm font-medium",
          labelColor,
          (disabled || readonly) && "opacity-70"
        )}
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
          aria-disabled={disabled || undefined}
          disabled={disabled}
          /* Adapt background/text when disabled; keep your theme var if present */
          style={{
            background: disabled
              ? "var(--color-background-disabled, #f3f4f6)"
              : "var(--color-background-shade-2)",
            color: disabled
              ? "var(--color-text-disabled, #9ca3af)"
              : undefined,
          }}
          className={clsx(
            "block w-full sm:text-sm outline-none text-textDark pr-3",
            leftIcon ? "pl-10" : "pl-2",
            // Focus & border behavior
            readonly
              ? "focus:outline-none border-none"
              : disabled
              ? "border-gray-200 focus:border-gray-200 focus:shadow-none cursor-not-allowed placeholder:text-gray-400"
              : "focus:border-primary border-background",
            // Error state
            meta.touched && meta.error && "border-red-500",
            // Global disabled visual
            disabled && "opacity-70",
            className
          )}
          // placeholder={props?.placeholder}
        />

        {isPassword && (
          <button
            type="button"
            tabIndex={canTogglePassword ? 0 : -1}
            aria-hidden={!canTogglePassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className={clsx(
              "absolute inset-y-0 right-0 pr-3 flex items-center",
              canTogglePassword ? "cursor-pointer" : "cursor-not-allowed opacity-50"
            )}
            onClick={toggleShowPassword}
            disabled={!canTogglePassword}
          >
            {showPassword ? (
              <FaEyeSlash color={IconColors.color} />
            ) : (
              <FaEye color={IconColors.color} />
            )}
          </button>
        )}
      </div>

      {meta.touched && meta.error && (
        <div className="text-xs text-red-500">{meta.error}</div>
      )}
    </div>
  );
};

export default InputField;
