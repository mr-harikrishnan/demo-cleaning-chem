import { CheckCircle2, ShieldCheck, Smartphone } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Logo } from '../components/common/Logo';
import { orderService, paymentService } from '../services';
import { formatCurrency } from '../utils/formatters';

export const DemoPaymentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || 'demo';
  const amount = Number(searchParams.get('amount')) || 1020;

  const [isPaid, setIsPaid] = useState(false);
  const [txnRef, setTxnRef] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePay = async () => {
    setLoading(true);
    const generatedRef = `UPI-DEMO-${Date.now().toString().slice(-8)}`;

    try {
      if (orderId && orderId !== 'demo') {
        await paymentService.processDemoPayment({
          orderId,
          amount,
          paymentMethod: 'online',
          transactionRef: generatedRef
        });

        await orderService.updateStatus(orderId, {
          paymentStatus: 'paid',
          deliveryStatus: 'confirmed',
          amountCollected: amount
        });
      }

      setTxnRef(generatedRef);
      setIsPaid(true);
    } catch (err) {
      console.error('Demo payment error:', err);
      // Still show success in demo mode
      setTxnRef(generatedRef);
      setIsPaid(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-[24px] border border-[#E6EAF2] shadow-cleantec-lg p-6 flex flex-col items-center text-center">
        <Logo size="sm" showSubtitle={false} className="mb-4" />

        <div className="w-full py-3 bg-[#EEF4FF] rounded-[12px] border border-[#1F6FEB]/20 flex items-center justify-center gap-2 text-xs font-bold text-[#0A1F5C] mb-6">
          <Smartphone className="w-4 h-4 text-[#1F6FEB]" />
          <span>CleanTec Demo UPI Gateway</span>
        </div>

        {!isPaid ? (
          <div className="w-full flex flex-col items-center">
            <span className="text-xs text-[#94A3B8] uppercase font-semibold">Paying To Merchant</span>
            <h3 className="text-base font-bold text-[#0A1F5C] mt-0.5">
              CleanTec Hospitality Chemicals
            </h3>

            <div className="my-8 py-6 px-4 bg-[#F8FAFC] rounded-[16px] border border-[#E6EAF2] w-full flex flex-col items-center">
              <span className="text-xs text-[#475569] font-medium">Order Number: {orderId}</span>
              <div className="text-4xl font-extrabold text-[#0A1F5C] tabular-nums mt-2">
                {formatCurrency(amount)}
              </div>
              <span className="text-[11px] text-[#2E9B3E] font-semibold mt-2">
                • Verified Commercial Payment Gateway
              </span>
            </div>

            <Button
              variant="green"
              size="lg"
              className="w-full h-14 text-base font-bold shadow-cleantec-md"
              onClick={handlePay}
              isLoading={loading}
            >
              Pay {formatCurrency(amount)} (Demo)
            </Button>

            <span className="mt-4 text-[11px] text-[#94A3B8]">
              This is a sandbox simulation. No actual bank funds will be deducted.
            </span>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center animate-bump">
            <div className="w-16 h-16 rounded-full bg-[#EEF8F0] text-[#2E9B3E] flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-xl font-extrabold text-[#0A1F5C]">Payment Successful</h3>
            <span className="text-2xl font-extrabold text-[#0A1F5C] tabular-nums mt-1">
              {formatCurrency(amount)}
            </span>

            <div className="mt-6 p-4 bg-[#F8FAFC] rounded-[12px] border border-[#E6EAF2] w-full text-xs text-[#475569] flex flex-col gap-2">
              <div className="flex justify-between">
                <span>Transaction Ref:</span>
                <strong className="text-[#0A1F5C] font-mono">{txnRef}</strong>
              </div>
              <div className="flex justify-between">
                <span>Timestamp:</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <strong className="text-[#2E9B3E]">SETTLED</strong>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full mt-6"
              onClick={() => {
                if (orderId && orderId !== 'demo') {
                  navigate(`/order-success?orderId=${orderId}`);
                } else {
                  navigate('/');
                }
              }}
            >
              Return to Website
            </Button>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-[#E6EAF2] flex items-center gap-1.5 text-[11px] text-[#94A3B8]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2E9B3E]" />
          <span>Direct Hotel Commercial Procurement SafePay</span>
        </div>
      </div>
    </div>
  );
};
