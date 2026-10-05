import {
  ArrowLeft,
  DollarSign,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  User as UserIcon
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { DataTable } from '../../components/common/DataTable';
import { StatusText } from '../../components/common/StatusText';
import { customerService } from '../../services';
import { Customer, Order } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const AdminCustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    customerService
      .getCustomerById(id)
      .then((res) => {
        setCustomer(res.customer);
        setOrders(res.orders);
      })
      .catch((err) => console.error('Error loading customer details:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-xs">Loading customer profile...</div>;
  }

  if (!customer) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-bold text-[#0A1F5C]">Customer Not Found</h3>
        <Link to="/admin/customers" className="inline-block mt-4">
          <Button variant="outline" size="sm">Back to Customers</Button>
        </Link>
      </div>
    );
  }

  const orderColumns = [
    {
      key: 'orderNumber',
      header: 'Reference',
      render: (o: Order) => <span className="font-bold text-[#0A1F5C]">{o.orderNumber}</span>
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (o: Order) => <span className="text-xs text-[#475569]">{formatDate(o.createdAt)}</span>
    },
    {
      key: 'deliveryStatus',
      header: 'Fulfillment',
      render: (o: Order) => <StatusText status={o.deliveryStatus} />
    },
    {
      key: 'paymentStatus',
      header: 'Payment',
      render: (o: Order) => <StatusText status={o.paymentStatus} />
    },
    {
      key: 'total',
      header: 'Order Total',
      align: 'right' as const,
      render: (o: Order) => (
        <span className="font-bold tabular-nums text-[#0A1F5C]">{formatCurrency(o.total)}</span>
      )
    },
    {
      key: 'amountCollected',
      header: 'Collected',
      align: 'right' as const,
      render: (o: Order) => (
        <span className="font-semibold tabular-nums text-[#2E9B3E]">
          {formatCurrency(o.amountCollected)}
        </span>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/admin/customers"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F6FEB] hover:underline"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Customers</span>
      </Link>

      {/* Customer Header Snapshot */}
      <div className="bg-white rounded-[16px] border border-[#E6EAF2] p-6 shadow-cleantec-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#0A1F5C] text-white flex items-center justify-center font-extrabold text-xl">
            {customer.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#0A1F5C]">{customer.name}</h2>
            <div className="flex flex-wrap items-center gap-4 mt-1 text-xs text-[#475569]">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span>{customer.email}</span>
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span>{customer.phone || 'No phone'}</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span>{customer.address}, {customer.city}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 border-t sm:border-t-0 pt-4 sm:pt-0 border-[#E6EAF2]">
          <div className="text-center">
            <span className="text-[10px] text-[#94A3B8] uppercase font-bold">Total Orders</span>
            <span className="text-xl font-extrabold text-[#0A1F5C] block tabular-nums">
              {orders.length}
            </span>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-[#94A3B8] uppercase font-bold">Lifetime Spend</span>
            <span className="text-xl font-extrabold text-[#2E9B3E] block tabular-nums">
              {formatCurrency(customer.totalSpent)}
            </span>
          </div>
        </div>
      </div>

      {/* Order History */}
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-bold text-[#0A1F5C]">Customer Order History</h3>
        <DataTable
          columns={orderColumns}
          data={orders}
          total={orders.length}
          page={1}
          limit={20}
          rowKey={(o) => o.id}
        />
      </div>
    </div>
  );
};
