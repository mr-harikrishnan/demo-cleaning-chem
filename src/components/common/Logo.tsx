import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  light?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  light = false,
}) => {
  const iconSizes = {
    sm: 28,
    md: 34,
    lg: 44,
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const subSizes = {
    sm: 'text-[8px] tracking-[0.2em]',
    md: 'text-[9px] tracking-[0.22em]',
    lg: 'text-[11px] tracking-[0.25em]',
  };

  const s = iconSizes[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon using user's logo.png */}
      <img
        src="/logo.png"
        alt="CleanTec Logo"
        width={s}
        height={s}
        className="object-contain shrink-0 transition-transform duration-200 hover:scale-105"
        style={{ width: `${s}px`, height: `${s}px` }}
      />

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className={`font-extrabold tracking-tight leading-none ${titleSizes[size]}`}>
          <span className={light ? 'text-white' : 'text-[#0B0F19]'}>Clean</span>
          <span className="text-[#059669]">Tec</span>
          <span className="text-[10px] text-[#94A3B8] font-normal align-super ml-0.5">™</span>
        </div>
        {showSubtitle && (
          <span
            className={`font-bold uppercase mt-1 ${subSizes[size]} ${
              light ? 'text-white/70' : 'text-[#64748B]'
            }`}
          >
            Commercial Chemical Solutions
          </span>
        )}
      </div>
    </div>
  );
};
