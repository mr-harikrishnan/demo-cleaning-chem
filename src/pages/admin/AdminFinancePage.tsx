import {
  Banknote,
  CheckCircle2,
  Clock,
  DollarSign,
  PieChart,
  TrendingUp
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { StatCard } from '../../components/common/StatCard';
import { StatusText } from '../../components/common/StatusText';
import { orderService, paymentService } from '../../services';
import { Order, PaymentRecord } from '../../types';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';

type TimeFilter = 'today' | 'week' | 'month' | 'all';

export const AdminFinancePage: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([orderService.getOrders({ limit: 100 }), paymentService.getPayments()])
      .then(([ordRes, payRes]) => {
        setOrders(ordRes.data);
        setPayments(payRes);
      })
      .catch((err) => console.error('Finance load error:', err))
      .finally(() => setLoading(false));
  }, []);

  // Filter orders by chosen timeframe
  const filteredOrders = orders.filter((o) => {
    if (timeFilter === 'all') return true;
    const orderDate = new Date(o.createdAt).getTime();
    const now = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000;

    if (timeFilter === 'today') {
      return now - orderDate <= oneDay;
    }
    if (timeFilter === 'week') {
      return now - orderDate <= 7 * oneDay;
    }
    if (timeFilter === 'month') {
      return now - orderDate <= 30 * oneDay;
    }
    return true;
  });

  const grossSales = filteredOrders.reduce((sum, o) => sum + o.total, 0);
  const totalCollected = filteredOrders.reduce((sum, o) => sum + o.amountCollected, 0);
  const pendingReceivables = Math.max(0, grossSales - totalCollected);
  const collectionRate = grossSales > 0 ? Math.round((totalCollected / grossSales) * 100) : 0;
  const onlineCollected = filteredOrders
    .filter((o) => o.paymentMethod === 'online')
    .reduce((sum, o) => sum + o.amountCollected, 0);
  const codCollected = filteredOrders
    .filter((o) => o.paymentMethod === 'cod')
    .reduce((sum, o) => sum + o.amountCollected, 0);
  const avgOrderValue = filteredOrders.length > 0 ? Math.round(grossSales / filteredOrders.length) : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0A1F5C]">Financial & Revenue Summary</h2>
          <p className="text-xs text-[#475569] mt-0.5">
            Realized cashflows, collections, receivables, and channel performances.
          </p>
        </div>

        {/* Timeframe Filter (Segmented underline control as requested in Part H) */}
        <div className="flex items-center gap-6 border-b border-[#E6EAF2]">
          {[
            { id: 'today', label: 'Today' },
            { id: 'week', label: 'This Week' },
            { id: 'month', label: 'This Month' },
            { id: 'all', label: 'All Time' }
          ].map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTimeFilter(tf.id as TimeFilter)}
              className={`pb-2.5 text-xs font-bold transition-colors relative cursor-pointer ${
                timeFilter === tf.id
                  ? 'text-[#0A1F5C] after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#1F6FEB]'
                  : 'text-[#94A3B8] hover:text-[#0A1F5C]'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Gross Billings"
          value={formatCurrency(grossSales)}
          helperText={`${filteredOrders.length} orders booked`}
          icon={<DollarSign className="w-5 h-5 text-[#1F6FEB]" />}
        />
        <StatCard
          label="Total Realized Collections"
          value={formatCurrency(totalCollected)}
          helperText={`${collectionRate}% settlement rate`}
          icon={<CheckCircle2 className="w-5 h-5 text-[#2E9B3E]" />}
          iconBg="bg-[#EEF8F0] text-[#2E9B3E]"
        />
        <StatCard
          label="Pending Receivables"
          value={formatCurrency(pendingReceivables)}
          helperText="Awaiting delivery & driver collections"
          icon={<Clock className="w-5 h-5 text-[#D97706]" />}
          iconBg="bg-amber-50 text-[#D97706]"
        />
        <StatCard
          label="Average Ticket Size"
          value={formatCurrency(avgOrderValue)}
          helperText="Per commercial booking"
          icon={<TrendingUp className="w-5 h-5 text-[#1F6FEB]" />}
        />
      </div>

      {/* Payment Channel Breakdown & Settlements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Channels (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-[16px] border border-[#E6EAF2] p-6 shadow-cleantec-sm flex flex-col gap-4">
          <h3 className="text-sm font-bold text-[#0A1F5C] uppercase tracking-wider">
            Settlement by Channel
          </h3>

          <div className="flex flex-col gap-4 divide-y divide-[#E6EAF2]">
            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[8px] bg-[#EEF4FF] text-[#1F6FEB] flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#0A1F5C] block">Online Payment / UPI</span>
                  <span className="text-[11px] text-[#94A3B8]">Instant gateway settlements</span>
                </div>
              </div>
              <span className="text-base font-bold text-[#0A1F5C] tabular-nums">
                {formatCurrency(onlineCollected)}
              </span>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[8px] bg-[#EEF8F0] text-[#2E9B3E] flex items-center justify-center">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#0A1F5C] block">Cash on Delivery</span>
                  <span className="text-[11px] text-[#94A3B8]">Logistics driver cash receipts</span>
                </div>
              </div>
              <span className="text-base font-bold text-[#0A1F5C] tabular-nums">
                {formatCurrency(codCollected)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Payment Ledger Records (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-[16px] border border-[#E6EAF2] p-6 shadow-cleantec-sm flex flex-col gap-4">
          <h3 className="text-sm font-bold text-[#0A1F5C] uppercase tracking-wider">
            Recorded Transactions Log ({payments.length})
          </h3>

          <div className="divide-y divide-[#E6EAF2] text-xs max-h-[380px] overflow-y-auto">
            {payments.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#0A1F5C] block">{p.orderNumber}</span>
                  <span className="text-[#94A3B8] font-mono text-[11px]">
                    Ref: {p.transactionRef} • {formatDateTime(p.paidAt)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#2E9B3E] tabular-nums text-sm block">
                    +{formatCurrency(p.amount)}
                  </span>
                  <StatusText status={p.paymentMethod} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
