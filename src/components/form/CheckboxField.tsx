import React, { useEffect, useId, useRef } from "react";
import clsx from "clsx";

export interface CheckboxFieldProps {
    /** Text label shown near the box */
    label: string;
    /** name & id for the input */
    name: string;
    /** controlled checked state */
    checked: boolean;
    /** change handler */
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    /** disable toggle */
    disabled?: boolean;
    /** extra wrapper classes */
    className?: string;
    /** legacy label color token (kept for compatibility) */
    labelColor?: string;

    /** --- Premium options (optional) --- */
    /** Show an indeterminate (—) state */
    indeterminate?: boolean;
    /** Additional helper line under the label */
    description?: string;
    /** Validation error text (turns red + a11y) */
    error?: string;
    /** Subtle helper (shown when no error) */
    hint?: string;
    /** Visual size */
    size?: "sm" | "md" | "lg";
    /** Label position */
    labelPosition?: "right" | "left";
    /** Readonly visual (keeps color, blocks interaction) */
    readOnly?: boolean;
    /** Required asterisk */
    required?: boolean;
    /** Color accent */
    tone?: "primary" | "emerald" | "amber" | "rose" | "slate";
}

const toneMap = {
    primary: {
        ring: "ring-indigo-400/60",
        bg: "bg-indigo-600",
        bgHover: "hover:bg-indigo-600/90",
        text: "text-indigo-600",
        focus: "focus-visible:ring-2 focus-visible:ring-indigo-500",
    },
    emerald: {
        ring: "ring-emerald-400/60",
        bg: "bg-emerald-600",
        bgHover: "hover:bg-emerald-600/90",
        text: "text-emerald-600",
        focus: "focus-visible:ring-2 focus-visible:ring-emerald-500",
    },
    amber: {
        ring: "ring-amber-400/60",
        bg: "bg-amber-500",
        bgHover: "hover:bg-amber-500/90",
        text: "text-amber-600",
        focus: "focus-visible:ring-2 focus-visible:ring-amber-500",
    },
    rose: {
        ring: "ring-rose-400/60",
        bg: "bg-rose-600",
        bgHover: "hover:bg-rose-600/90",
        text: "text-rose-600",
        focus: "focus-visible:ring-2 focus-visible:ring-rose-500",
    },
    slate: {
        ring: "ring-slate-400/60",
        bg: "bg-slate-700",
        bgHover: "hover:bg-slate-700/90",
        text: "text-slate-700",
        focus: "focus-visible:ring-2 focus-visible:ring-slate-500",
    },
};

const sizeMap = {
    sm: { box: "h-4 w-4", icon: "h-3 w-3", gap: "gap-2", label: "text-sm", desc: "text-xs" },
    md: { box: "h-5 w-5", icon: "h-3.5 w-3.5", gap: "gap-3", label: "text-sm", desc: "text-xs" },
    lg: { box: "h-6 w-6", icon: "h-4 w-4", gap: "gap-3.5", label: "text-base", desc: "text-sm" },
};

const CheckboxField: React.FC<CheckboxFieldProps> = ({
    label,
    name,
    checked,
    onChange,
    disabled = false,
    className,
    labelColor = "text-text",
    indeterminate = false,
    description,
    error,
    hint,
    size = "md",
    labelPosition = "right",
    readOnly = false,
    required = false,
    tone = "primary",
}) => {
    const ids = {
        input: useId(),
        desc: useId(),
        err: useId(),
    };

    const s = sizeMap[size];
    const t = toneMap[tone];

    const inputRef = useRef<HTMLInputElement>(null);

    // Set indeterminate visual on the native checkbox
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.indeterminate = indeterminate && !checked;
        }
    }, [indeterminate, checked]);

    const describedBy = clsx(
        error ? ids.err : undefined,
        !error && (description || hint) ? ids.desc : undefined
    );

    // Guard interactions when readOnly
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (readOnly) {
            // prevent state change if readOnly
            e.preventDefault();
            e.stopPropagation();
            // push back native state
            if (inputRef.current) inputRef.current.checked = checked;
            return;
        }
        onChange(e);
    };

    const LabelBlock = (
        <div className="min-w-0">
            <label
                htmlFor={ids.input}
                className={clsx(
                    "select-none cursor-pointer",
                    s.label,
                    // legacy color token support (if you have theme tokens)
                    labelColor || "text-gray-900 dark:text-gray-100",
                    disabled && "opacity-60 cursor-not-allowed",
                    readOnly && "cursor-default"
                )}
            >
                {label}
                {required && <span className="ml-0.5 text-rose-500">*</span>}
            </label>
            {(description || error || hint) && (
                <p
                    id={error ? ids.err : ids.desc}
                    className={clsx(
                        "mt-0.5",
                        s.desc,
                        error
                            ? "text-rose-600 dark:text-rose-400"
                            : "text-gray-500 dark:text-gray-400"
                    )}
                >
                    {error ?? description ?? hint}
                </p>
            )}
        </div>
    );

    return (
        <div
            className={clsx(
                "inline-flex items-start",
                s.gap,
                "rounded-xl p-2 -m-2 transition-colors",
                " dark:hover:bg-gray-800/50",
                disabled && "hover:bg-transparent",
                className
            )}
        >
            {/* Label on LEFT option */}
            {labelPosition === "left" && LabelBlock}

            {/* Checkbox + custom UI */}
            <div className="relative flex items-center">
                <span className="relative inline-flex items-center justify-center">
                    {/* REAL INPUT sits on top of the faux box to capture clicks */}
                    <input
                        ref={inputRef}
                        type="checkbox"
                        id={ids.input}
                        name={name}
                        checked={checked}
                        onChange={handleChange}
                        disabled={disabled}
                        aria-invalid={!!error}
                        aria-describedby={describedBy || undefined}
                        className={clsx(
                            "peer absolute inset-0 opacity-0",
                            "cursor-pointer",
                            (disabled || readOnly) && "cursor-not-allowed",
                            // match the box footprint so it fully covers the visual box
                            s.box
                        )}
                    />

                    {/* Faux box UNDER the input */}
                    <span
                        aria-hidden
                        className={clsx(
                            "inline-flex items-center justify-center rounded-md border transition-all",
                            "shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]",
                            s.box,
                            "bg-white dark:bg-gray-900",
                            error ? "border-rose-400" : "border-gray-300 dark:border-gray-700",
                            !disabled && t.focus, // focus-visible ring via peer
                            (disabled || readOnly) && "opacity-60",
                            "peer-checked:border-transparent peer-checked:shadow-none"
                        )}
                    >
                        {/* Checkmark / Indeterminate glyph */}
                        <svg
                            viewBox="0 0 20 20"
                            className={clsx(
                                "transition-transform duration-150 ease-out",
                                s.icon,
                                checked || indeterminate ? "scale-100" : "scale-0"
                            )}
                        >
                            <rect
                                x="0"
                                y="0"
                                width="20"
                                height="20"
                                rx="5"
                                className={clsx(
                                    checked ? t.bg : "bg-transparent",
                                    checked && t.bgHover,
                                    "transition-colors",
                                    "fill-current",
                                    checked ? "" : "fill-transparent",
                                    checked ? t.text : ""
                                )}
                            />
                            {indeterminate && !checked ? (
                                <rect
                                    x="5"
                                    y="9"
                                    width="10"
                                    height="2"
                                    rx="1"
                                    className={clsx(t.text, "fill-current")}
                                />
                            ) : (
                                checked && (
                                    <path
                                        d="M5 10.5l3 3 7-7"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                )
                            )}
                        </svg>
                    </span>
                </span>
            </div>






            {/* Label on RIGHT option (default) */}
            {labelPosition === "right" && LabelBlock}
        </div>
    );
};

export default CheckboxField;
