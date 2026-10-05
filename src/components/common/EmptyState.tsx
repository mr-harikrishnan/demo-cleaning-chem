import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div
      className={`w-full py-16 px-6 bg-white rounded-[16px] border border-[#E6EAF2] flex flex-col items-center justify-center text-center shadow-cleantec-sm ${className}`}
    >
      {icon && (
        <div className="w-16 h-16 rounded-[16px] bg-[#EEF4FF] flex items-center justify-center text-[#1F6FEB] mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold text-[#0A1F5C]">{title}</h3>
      <p className="mt-2 text-sm text-[#475569] max-w-md">{description}</p>
      {actionText && onAction && (
        <div className="mt-6">
          <Button variant="primary" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};
