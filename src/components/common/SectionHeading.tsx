import React from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  eyebrowIcon?: React.ReactNode;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  eyebrowIcon,
  title,
  subtitle,
  align = 'center',
  className = ''
}) => {
  const alignClasses = align === 'center' ? 'text-center items-center mx-auto' : 'text-left items-start';

  return (
    <div className={`flex flex-col mb-12 max-w-3xl ${alignClasses} ${className}`}>
      {eyebrow && (
        <div className="flex items-center gap-2 mb-3">
          {eyebrowIcon && <span className="text-[#2E9B3E] shrink-0">{eyebrowIcon}</span>}
          <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#12338F]">
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-[40px] leading-tight lg:leading-[46px] font-bold text-[#0A1F5C] tracking-[-0.02em]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-[#475569] leading-relaxed max-w-[62ch]">
          {subtitle}
        </p>
      )}
    </div>
  );
};
