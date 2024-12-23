import React from 'react';

interface ITextAreaProps {
    label: string;
    name: string;
    value: string;
    placeholder?: string;
    rows?: number;
    maxLength?: number; // Optional prop for character limit
    showCharacterCount?: boolean; // Optional prop to show character count
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextAreaField: React.FC<ITextAreaProps> = ({
    label,
    name,
    value,
    placeholder,
    rows = 4,
    maxLength,
    showCharacterCount = false,
    onChange
}) => {
    return (
        <div className="mb-4">
            <label htmlFor={name} className="block text-sm font-medium text-text mb-1">
                {label}
            </label>
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                rows={rows}
                maxLength={maxLength}
                placeholder={placeholder}
                className="block w-full py-2 px-3 outline-none border border-primary bg-background text-text rounded-md focus:ring-2 focus:ring-primary transition ease-in-out duration-150"
            />
            {showCharacterCount && maxLength && (
                <div className="text-right text-sm text-secondary mt-1">
                    {value.length} / {maxLength}
                </div>
            )}
        </div>
    );
};

export default TextAreaField;
