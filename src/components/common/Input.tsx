import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider text-[#0A1F5C]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 pointer-events-none text-[#94A3B8] flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full h-11 px-3.5 bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] rounded-[10px] border transition-colors duration-150 focus-ring ${
              leftIcon ? 'pl-10' : ''
            } ${rightIcon ? 'pr-10' : ''} ${
              error
                ? 'border-[#DC2626] focus:border-[#DC2626]'
                : 'border-[#E6EAF2] hover:border-[#CBD5E1] focus:border-[#1F6FEB]'
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-[#94A3B8] flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <span className="text-xs text-[#DC2626] font-medium">{error}</span>}
        {!error && helperText && (
          <span className="text-xs text-[#94A3B8]">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
