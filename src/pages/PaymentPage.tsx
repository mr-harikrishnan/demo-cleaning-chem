import {
  Banknote,
  CheckCircle2,
  Copy,
  CreditCard,
  QrCode,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { useToast } from '../context/ToastContext';
import { orderService, paymentService } from '../services';
import { Order } from '../types';
import { formatCurrency } from '../utils/formatters';

export const PaymentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const amountParam = searchParams.get('amount');

  const [order, setOrder] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [onlineTab, setOnlineTab] = useState<'qr' | 'upi' | 'card' | 'netbanking'>('qr');
  const [upiId, setUpiId] = useState('cleantec@icici');
  const [isProcessing, setIsProcessing] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderId) return;
    orderService.getOrderById(orderId).then((res) => {
      if (res) setOrder(res);
    });
  }, [orderId]);

  const payableAmount = order ? order.total : Number(amountParam) || 0;
  const demoUrl = `${window.location.origin}/demo-payment?orderId=${orderId || 'demo'}&amount=${payableAmount}`;

  const handleConfirmPayment = async () => {
    if (!order) {
      showToast('Order reference missing.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      if (paymentMethod === 'online') {
        // Record online payment transaction
        await paymentService.processDemoPayment({
          orderId: order.id,
          amount: payableAmount,
          paymentMethod: 'online',
          transactionRef: `UPI-${Date.now().toString().slice(-8)}`
        });

        // Update order status to paid & confirmed
        await orderService.updateStatus(order.id, {
          paymentStatus: 'paid',
          deliveryStatus: 'confirmed',
          amountCollected: payableAmount
        });

        showToast('Online payment confirmed successfully!', 'success');
      } else {
        // COD selection
        await orderService.updateStatus(order.id, {
          paymentStatus: 'pending',
          deliveryStatus: 'confirmed',
          amountCollected: 0
        });

        showToast('Order confirmed for Cash on Delivery.', 'success');
      }

      navigate(`/order-success?orderId=${order.id}`);
    } catch (err: unknown) {
      console.error('Payment completion error:', err);
      const msg = err instanceof Error ? err.message : 'Unable to verify payment.';
      showToast(msg, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyDemoUrl = () => {
    navigator.clipboard.writeText(demoUrl);
    showToast('Payment link copied to clipboard!', 'info');
  };

  return (
    <div className="py-12 bg-[#F7F9FC]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* 3-Step Indicator */}
        <div className="mb-10 max-w-xl mx-auto flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#E6EAF2] -translate-y-1/2 z-0" />

          {/* Step 1: Details (Done) */}
          <div className="relative z-10 flex flex-col items-center gap-1.5 bg-[#F7F9FC] px-2">
            <div className="w-9 h-9 rounded-full bg-[#2E9B3E] text-white flex items-center justify-center font-bold text-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-[#2E9B3E]">Details</span>
          </div>

          {/* Step 2: Payment (Active) */}
          <div className="relative z-10 flex flex-col items-center gap-1.5 bg-[#F7F9FC] px-2">
            <div className="w-9 h-9 rounded-full bg-[#0A1F5C] text-white flex items-center justify-center font-bold text-xs shadow-cleantec-sm">
              2
            </div>
            <span className="text-xs font-bold text-[#0A1F5C]">Payment Method</span>
          </div>

          {/* Step 3: Confirmation */}
          <div className="relative z-10 flex flex-col items-center gap-1.5 bg-[#F7F9FC] px-2">
            <div className="w-9 h-9 rounded-full bg-[#F1F4F9] text-[#94A3B8] border border-[#E6EAF2] flex items-center justify-center font-bold text-xs">
              3
            </div>
            <span className="text-xs font-medium text-[#94A3B8]">Confirmation</span>
          </div>
        </div>

        {/* Main Payment Card */}
        <div className="bg-white rounded-[20px] border border-[#E6EAF2] p-8 shadow-cleantec-md flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E6EAF2] gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#12338F]">
                Order {order?.orderNumber || 'CT-2026-DEMO'}
              </span>
              <h2 className="text-2xl font-bold text-[#0A1F5C] mt-1">Payment Method</h2>
            </div>
            <div className="text-left sm:text-right">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] text-[11px] font-extrabold mb-1">
                <span>100% Full Payment</span>
              </div>
              <span className="text-xs text-[#94A3B8] block">Total Amount (Full Settlement)</span>
              <span className="text-2xl font-extrabold text-[#0A1F5C] tabular-nums">
                {formatCurrency(payableAmount)}
              </span>
            </div>
          </div>

          {/* Full Payment Policy Banner */}
          <div className="px-4 py-2.5 rounded-[10px] bg-[#F1F5F9] border border-[#CBD5E1] text-xs text-[#334155] flex items-center justify-between">
            <span className="font-medium">
              Payment Policy: Orders through this portal require full settlement. Partial payments are not supported.
            </span>
            <span className="text-[11px] font-bold text-[#15803D] shrink-0 ml-2">No Partial Advance</span>
          </div>

          {/* Select Online vs COD */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPaymentMethod('online')}
              className={`p-4 rounded-[12px] border text-left flex items-start gap-3 transition-all ${
                paymentMethod === 'online'
                  ? 'border-[#1F6FEB] bg-[#EEF4FF]/50 shadow-cleantec-sm'
                  : 'border-[#E6EAF2] hover:bg-[#F8FAFC]'
              }`}
            >
              <div
                className={`p-2 rounded-[8px] ${
                  paymentMethod === 'online' ? 'bg-[#1F6FEB] text-white' : 'bg-[#F1F4F9] text-[#475569]'
                }`}
              >
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-[#0A1F5C] block">Online Payment</span>
                <span className="text-xs text-[#475569] mt-0.5 block">
                  Instant UPI QR, Mobile UPI, Card
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('cod')}
              className={`p-4 rounded-[12px] border text-left flex items-start gap-3 transition-all ${
                paymentMethod === 'cod'
                  ? 'border-[#1F6FEB] bg-[#EEF4FF]/50 shadow-cleantec-sm'
                  : 'border-[#E6EAF2] hover:bg-[#F8FAFC]'
              }`}
            >
              <div
                className={`p-2 rounded-[8px] ${
                  paymentMethod === 'cod' ? 'bg-[#1F6FEB] text-white' : 'bg-[#F1F4F9] text-[#475569]'
                }`}
              >
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-[#0A1F5C] block">Cash on Delivery</span>
                <span className="text-xs text-[#475569] mt-0.5 block">
                  Pay cash / UPI upon delivery
                </span>
              </div>
            </button>
          </div>

          {/* Online Payment Options */}
          {paymentMethod === 'online' ? (
            <div className="p-6 rounded-[16px] bg-[#F7F9FC] border border-[#E6EAF2] flex flex-col gap-6">
              {/* Tabs */}
              <div className="flex border-b border-[#E6EAF2] gap-4">
                {[
                  { id: 'qr', label: 'Scan to Pay (Demo)', icon: <QrCode className="w-4 h-4" /> },
                  { id: 'upi', label: 'UPI ID', icon: <Smartphone className="w-4 h-4" /> },
                  { id: 'card', label: 'Card (Demo)', icon: <CreditCard className="w-4 h-4" /> }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setOnlineTab(t.id as any)}
                    className={`pb-3 text-xs font-bold flex items-center gap-1.5 transition-colors relative ${
                      onlineTab === t.id
                        ? 'text-[#0A1F5C] after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#1F6FEB]'
                        : 'text-[#94A3B8] hover:text-[#0A1F5C]'
                    }`}
                  >
                    {t.icon}
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>

              {/* QR Tab */}
              {onlineTab === 'qr' && (
                <div className="flex flex-col sm:flex-row items-center gap-8 py-2">
                  <div className="p-4 bg-white rounded-[16px] border border-[#E6EAF2] shadow-sm flex flex-col items-center shrink-0">
                    <QRCodeSVG value={demoUrl} size={168} level="M" />
                    <span className="mt-2 text-[11px] font-semibold text-[#0A1F5C] uppercase tracking-wider">
                      Scan with Any UPI App
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="text-xs font-semibold text-[#0A1F5C]">
                      Demo Payment Instructions:
                    </div>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      Scan the QR code with your mobile camera or click below to simulate the simulated phone transaction page.
                    </p>

                    <div className="flex items-center gap-2">
                      <a
                        href={demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-[#1F6FEB] underline"
                      >
                        Open Mobile Demo Payment Screen ↗
                      </a>
                      <button
                        onClick={copyDemoUrl}
                        className="p-1 text-[#94A3B8] hover:text-[#0A1F5C]"
                        title="Copy link"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-3 bg-white rounded-[10px] border border-[#E6EAF2] text-[11px] text-[#475569] flex flex-col gap-1">
                      <div className="flex justify-between">
                        <span>Merchant:</span>
                        <strong className="text-[#0A1F5C]">CleanTec Hospitality Chemicals</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>VPA:</span>
                        <strong className="text-[#0A1F5C]">cleantec@icici</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* UPI Tab */}
              {onlineTab === 'upi' && (
                <div className="flex flex-col gap-3 max-w-sm">
                  <label className="text-xs font-semibold text-[#0A1F5C]">Enter your UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. yourname@okhdfcbank"
                    className="h-11 px-3.5 bg-white rounded-[10px] border border-[#E6EAF2] text-sm focus-ring"
                  />
                  <span className="text-[11px] text-[#94A3B8]">
                    A payment request of {formatCurrency(payableAmount)} will be simulated.
                  </span>
                </div>
              )}

              {/* Card Tab */}
              {onlineTab === 'card' && (
                <div className="flex flex-col gap-3 max-w-md">
                  <div className="p-3 rounded-[8px] bg-[#EEF4FF] text-xs text-[#0A1F5C]">
                    For production payments, Razorpay / Stripe gateway integration is connected. For this demo, simply click Confirm below.
                  </div>
                </div>
              )}

              {/* Fallback confirmation button */}
              <div className="pt-4 border-t border-[#E6EAF2] flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-[#94A3B8]">
                  Completed payment on your mobile app?
                </span>
                <Button
                  variant="green"
                  size="md"
                  onClick={handleConfirmPayment}
                  isLoading={isProcessing}
                >
                  Payment Completed? Confirm Demo Payment
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-[16px] bg-[#F7F9FC] border border-[#E6EAF2] flex flex-col gap-4">
              <div className="flex items-center gap-3 text-sm font-semibold text-[#0A1F5C]">
                <Banknote className="w-5 h-5 text-[#2E9B3E]" />
                <span>Cash / UPI on Commercial Delivery</span>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                Our logistics driver will present a digital GST commercial receipt upon delivery at your facility. You may settle in cash or direct UPI transfer at delivery.
              </p>

              <div className="pt-4 border-t border-[#E6EAF2]">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleConfirmPayment}
                  isLoading={isProcessing}
                >
                  Confirm Order with Cash on Delivery
                </Button>
              </div>
            </div>
          )}

          {/* Commercial Security Seal */}
          <div className="pt-4 border-t border-[#E6EAF2] flex items-center justify-center gap-2 text-xs text-[#94A3B8]">
            <ShieldCheck className="w-4 h-4 text-[#2E9B3E]" />
            <span>256-Bit Encrypted Demo Transaction Protocol</span>
          </div>
        </div>
      </div>
    </div>
  );
};
