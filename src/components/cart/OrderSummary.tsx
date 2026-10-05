import { ShieldCheck, Truck } from 'lucide-react';
import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../common/Button';

interface OrderSummaryProps {
  subtotal: number;
  deliveryFee: number;
  total: number;
  onAction?: () => void;
  actionText?: string;
  actionVariant?: 'primary' | 'green';
  isLoading?: boolean;
  disabled?: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  deliveryFee,
  total,
  onAction,
  actionText,
  actionVariant = 'green',
  isLoading = false,
  disabled = false
}) => {
  const freeThreshold = 1500;
  const neededForFreeDelivery = Math.max(0, freeThreshold - subtotal);

  return (
    <div className="bg-white rounded-[16px] border border-[#E6EAF2] p-6 shadow-cleantec-sm flex flex-col gap-5 sticky top-24">
      <h3 className="text-lg font-bold text-[#0A1F5C]">Order Summary</h3>

      {/* Free Delivery Bar */}
      {subtotal > 0 && (
        <div className="p-3 rounded-[10px] bg-[#EEF4FF] border border-[#1F6FEB]/20 flex items-center gap-2.5 text-xs text-[#0A1F5C]">
          <Truck className="w-4 h-4 text-[#1F6FEB] shrink-0" />
          {neededForFreeDelivery === 0 ? (
            <span className="font-semibold text-[#2E9B3E]">
              You qualify for FREE bulk commercial delivery!
            </span>
          ) : (
            <span>
              Add <strong className="font-bold">{formatCurrency(neededForFreeDelivery)}</strong> more for FREE delivery
            </span>
          )}
        </div>
      )}

      {/* Cost Breakdown */}
      <div className="flex flex-col gap-3 text-sm text-[#475569] divide-y divide-[#E6EAF2]">
        <div className="flex justify-between pt-1">
          <span>Items Subtotal</span>
          <span className="font-semibold text-[#0F172A] tabular-nums">
            {formatCurrency(subtotal)}
          </span>
        </div>

        <div className="flex justify-between pt-3">
          <span>Standard Commercial Delivery</span>
          <span className="font-semibold text-[#0F172A] tabular-nums">
            {deliveryFee === 0 ? (
              <span className="text-[#2E9B3E] font-bold">FREE</span>
            ) : (
              formatCurrency(deliveryFee)
            )}
          </span>
        </div>

        <div className="flex justify-between pt-4 text-base font-bold text-[#0A1F5C]">
          <span>Total Amount</span>
          <span className="text-xl font-extrabold text-[#0A1F5C] tabular-nums">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {onAction && actionText && (
        <Button
          variant={actionVariant}
          size="lg"
          onClick={onAction}
          isLoading={isLoading}
          disabled={disabled}
          className="w-full mt-2"
        >
          {actionText}
        </Button>
      )}

      {/* Commercial Trust Notes */}
      <div className="pt-4 border-t border-[#E6EAF2] flex items-center gap-2 text-xs text-[#94A3B8]">
        <ShieldCheck className="w-4 h-4 text-[#2E9B3E] shrink-0" />
        <span>Direct Manufacturer Pricing & Commercial Invoice</span>
      </div>
    </div>
  );
};
