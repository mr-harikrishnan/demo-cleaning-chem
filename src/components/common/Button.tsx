import { Loader2 } from 'lucide-react';
import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'green' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-[10px] transition-all duration-200 focus-ring select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer';

  const sizeStyles = {
    sm: 'h-9 px-3.5 text-xs gap-1.5',
    md: 'h-11 px-4 text-sm gap-2',
    lg: 'h-12 px-6 text-base gap-2.5'
  };

  const variantStyles = {
    primary: 'bg-[#0A1F5C] text-white hover:bg-[#12338F] shadow-cleantec-sm hover:shadow-cleantec-md',
    secondary: 'bg-white text-[#0A1F5C] border border-[#0A1F5C] hover:bg-[#EEF4FF]',
    green: 'bg-[#2E9B3E] text-white hover:bg-[#258233] shadow-cleantec-sm hover:shadow-cleantec-md',
    outline: 'bg-white text-[#0F172A] border border-[#E6EAF2] hover:border-[#1F6FEB] hover:text-[#1F6FEB] hover:bg-[#F7F9FC]',
    ghost: 'bg-transparent text-[#475569] hover:text-[#0A1F5C] hover:bg-[#EEF4FF]',
    danger: 'bg-[#DC2626] text-white hover:bg-[#B91C1C]'
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      disabled={isDisabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};
