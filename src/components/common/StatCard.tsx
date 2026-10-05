import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  helperText?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  helperText,
  icon,
  iconBg = 'bg-[#EEF4FF] text-[#1F6FEB]',
  className = ''
}) => {
  return (
    <div
      className={`bg-white rounded-[16px] border border-[#E6EAF2] p-5 shadow-cleantec-sm flex flex-col justify-between transition-all duration-200 hover:shadow-cleantec-md hover:-translate-y-0.5 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#475569]">
          {label}
        </span>
        {icon && (
          <div
            className={`w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 ${iconBg}`}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="text-2xl sm:text-3xl font-extrabold text-[#0A1F5C] tabular-nums tracking-tight">
          {value}
        </div>
        {helperText && (
          <p className="mt-1 text-xs text-[#94A3B8] font-medium truncate">{helperText}</p>
        )}
      </div>
    </div>
  );
};
