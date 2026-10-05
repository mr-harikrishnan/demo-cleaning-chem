import { ChevronDown } from 'lucide-react';
import React, { forwardRef } from 'react';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold uppercase tracking-wider text-[#0A1F5C]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            className={`w-full h-11 pl-3.5 pr-10 bg-white text-sm text-[#0F172A] rounded-[10px] border appearance-none transition-colors duration-150 focus-ring cursor-pointer ${
              error
                ? 'border-[#DC2626] focus:border-[#DC2626]'
                : 'border-[#E6EAF2] hover:border-[#CBD5E1] focus:border-[#1F6FEB]'
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 pointer-events-none text-[#94A3B8] flex items-center">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && <span className="text-xs text-[#DC2626] font-medium">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
