import React from 'react';

export type StatusVariant =
  | 'success' // green (paid, delivered, active, in_stock)
  | 'warning' // amber (pending, partially_paid, low_stock)
  | 'error' // red (failed, cancelled, out_of_stock)
  | 'info' // blue (confirmed, packed, out_for_delivery)
  | 'neutral';

interface StatusTextProps {
  status: string;
  variant?: StatusVariant;
  className?: string;
  showDot?: boolean;
}

export const StatusText: React.FC<StatusTextProps> = ({
  status,
  variant,
  className = '',
  showDot = true
}) => {
  // Determine variant automatically if not provided
  const normalized = status.toLowerCase().replace(/[\s_-]+/g, '');

  let computedVariant: StatusVariant = variant || 'neutral';
  if (!variant) {
    if (['paid', 'delivered', 'active', 'instock', 'success', 'completed'].includes(normalized)) {
      computedVariant = 'success';
    } else if (['pending', 'partiallypaid', 'lowstock', 'processing'].includes(normalized)) {
      computedVariant = 'warning';
    } else if (['failed', 'cancelled', 'inactive', 'outofstock', 'error'].includes(normalized)) {
      computedVariant = 'error';
    } else if (['confirmed', 'packed', 'outfordelivery', 'online', 'shipped'].includes(normalized)) {
      computedVariant = 'info';
    }
  }

  const dotColors = {
    success: 'bg-[#2E9B3E]',
    warning: 'bg-[#D97706]',
    error: 'bg-[#DC2626]',
    info: 'bg-[#1F6FEB]',
    neutral: 'bg-[#94A3B8]'
  };

  const textColors = {
    success: 'text-[#2E9B3E]',
    warning: 'text-[#D97706]',
    error: 'text-[#DC2626]',
    info: 'text-[#1F6FEB]',
    neutral: 'text-[#475569]'
  };

  // Format label nicely: out_for_delivery -> Out for Delivery
  const displayLabel = status
    .replace(/[_-]/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <span className={`inline-flex items-center gap-2 text-xs font-semibold select-none ${textColors[computedVariant]} ${className}`}>
      {showDot && <span className={`w-2 h-2 rounded-full shrink-0 ${dotColors[computedVariant]}`} />}
      <span>{displayLabel}</span>
    </span>
  );
};
