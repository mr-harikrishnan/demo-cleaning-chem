import { ArrowRight, CheckCircle2, PackageCheck, ShoppingBag, Truck } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { orderService } from '../services';
import { Order } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

export const OrderSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!orderId) return;
    orderService.getOrderById(orderId).then((res) => {
      if (res) setOrder(res);
    });
  }, [orderId]);

  return (
    <div className="py-16 bg-[#F7F9FC]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-[24px] border border-[#E6EAF2] p-8 shadow-cleantec-md flex flex-col items-center text-center">
          {/* Success Check */}
          <div className="w-16 h-16 rounded-full bg-[#EEF8F0] text-[#2E9B3E] flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-[#2E9B3E]">
            Order Confirmed & Scheduled
          </span>
          <h1 className="text-3xl font-extrabold text-[#0A1F5C] mt-1">Thank You For Your Order</h1>
          <p className="mt-2 text-sm text-[#475569] max-w-md">
            Your commercial chemical supplies are being prepared for dispatch from our Thiruverkadu facility.
          </p>

          {/* Order Snapshot Card */}
          <div className="mt-8 p-6 bg-[#F8FAFC] rounded-[16px] border border-[#E6EAF2] w-full text-left flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E6EAF2] gap-2">
              <div>
                <span className="text-[11px] text-[#94A3B8] uppercase font-semibold">Order Reference</span>
                <div className="text-base font-bold text-[#0A1F5C]">{order?.orderNumber || orderId}</div>
              </div>
              <div className="sm:text-right">
                <span className="text-[11px] text-[#94A3B8] uppercase font-semibold">Date Placed</span>
                <div className="text-xs font-semibold text-[#0F172A]">{formatDate(order?.createdAt || new Date().toISOString())}</div>
              </div>
            </div>

            {/* Delivery Timeline Indicator */}
            <div className="py-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0A1F5C] block mb-3">
                Fulfillment Status
              </span>
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-1.5 text-[#2E9B3E]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmed</span>
                </div>
                <div className="flex-1 h-0.5 bg-[#2E9B3E] mx-2" />
                <div className="flex items-center gap-1.5 text-[#1F6FEB]">
                  <PackageCheck className="w-4 h-4" />
                  <span>Packing</span>
                </div>
                <div className="flex-1 h-0.5 bg-[#E6EAF2] mx-2" />
                <div className="flex items-center gap-1.5 text-[#94A3B8]">
                  <Truck className="w-4 h-4" />
                  <span>Dispatch</span>
                </div>
              </div>
            </div>

            {/* Summary details */}
            {order && (
              <div className="pt-4 border-t border-[#E6EAF2] flex justify-between text-sm font-bold text-[#0A1F5C]">
                <span>Total Amount</span>
                <span className="tabular-nums">{formatCurrency(order.total)}</span>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full">
            <Link to="/orders" className="w-full sm:flex-1">
              <Button variant="primary" size="lg" className="w-full">
                View Order Tracking
              </Button>
            </Link>
            <Link to="/products" className="w-full sm:flex-1">
              <Button variant="outline" size="lg" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
