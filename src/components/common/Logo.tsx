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
      {/* Precision Geometric Emblem */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={s}
          height={s}
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-200 hover:scale-105"
        >
          <defs>
            <linearGradient id="logoGradPrimary" x1="6" y1="4" x2="38" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor={light ? '#FFFFFF' : '#0B0F19'} />
              <stop offset="1" stopColor={light ? '#E0F2FE' : '#1E3A8A'} />
            </linearGradient>
            <linearGradient id="logoGradAccent" x1="14" y1="12" x2="32" y2="34" gradientUnits="userSpaceOnUse">
              <stop stopColor="#059669" />
              <stop offset="1" stopColor="#10B981" />
            </linearGradient>
          </defs>

          {/* Outer Rounded Diamond / Shield */}
          <rect
            x="22"
            y="2"
            width="28"
            height="28"
            rx="7"
            transform="rotate(45 22 2)"
            fill="url(#logoGradPrimary)"
            fillOpacity={light ? "0.15" : "0.08"}
            stroke="url(#logoGradPrimary)"
            strokeWidth="2.5"
          />

          {/* Precision Center Droplet & Clean Sparkle */}
          <path
            d="M22 10C22 10 13 21 13 27C13 32 17 36 22 36C27 36 31 32 31 27C31 21 22 10 22 10Z"
            fill="url(#logoGradAccent)"
          />

          {/* Inner Light Reflection Facet */}
          <path
            d="M19 23C19 20 21 16 22 14C23 16 24 18 24 20C24 23 21.5 24 19 23Z"
            fill="#FFFFFF"
            fillOpacity="0.45"
          />
        </svg>
      </div>

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
