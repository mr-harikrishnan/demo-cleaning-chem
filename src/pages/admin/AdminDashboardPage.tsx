import {
  Banknote,
  Building,
  CheckCircle2,
  Clock,
  DollarSign,
  Package,
  ShoppingBag,
  TrendingUp,
  Truck,
  Users
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../../components/common/DataTable';
import { StatCard } from '../../components/common/StatCard';
import { StatusText } from '../../components/common/StatusText';
import { customerService, orderService, productService } from '../../services';
import { Customer, Order, Product } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const AdminDashboardPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      orderService.getOrders({ limit: 100 }),
      productService.getAllProducts(),
      customerService.getCustomers({ limit: 100 })
    ])
      .then(([ordersRes, productsRes, custRes]) => {
        setOrders(ordersRes.data);
        setProducts(productsRes);
        setCustomers(custRes.data);
      })
      .catch((err) => console.error('Dashboard load error:', err))
      .finally(() => setLoading(false));
  }, []);

  // Compute metrics from active data
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalCollected = orders.reduce((sum, o) => sum + o.amountCollected, 0);
  const totalPending = Math.max(0, totalRevenue - totalCollected);
  const onlineOrdersCount = orders.filter((o) => o.orderType === 'online').length;
  const manualOrdersCount = orders.filter((o) => o.orderType === 'manual').length;
  const activeProductsCount = products.filter((p) => p.isActive).length;
  const inTransitCount = orders.filter((o) => ['confirmed', 'packed', 'out_for_delivery'].includes(o.deliveryStatus)).length;
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
  const deliveredCount = orders.filter((o) => o.deliveryStatus === 'delivered').length;

  const metricCards = [
    {
      label: 'Gross Sales',
      value: formatCurrency(totalRevenue),
      helperText: 'Total value across all orders',
      icon: <DollarSign className="w-5 h-5 text-[#1F6FEB]" />
    },
    {
      label: 'Amount Collected',
      value: formatCurrency(totalCollected),
      helperText: 'Realized liquid collections',
      icon: <CheckCircle2 className="w-5 h-5 text-[#2E9B3E]" />
    },
    {
      label: 'Pending Receivables',
      value: formatCurrency(totalPending),
      helperText: 'Unsettled COD & credit balances',
      icon: <Clock className="w-5 h-5 text-[#D97706]" />
    },
    {
      label: 'Total Orders',
      value: orders.length,
      helperText: `${deliveredCount} delivered successfully`,
      icon: <ShoppingBag className="w-5 h-5 text-[#1F6FEB]" />
    },
    {
      label: 'Online Orders',
      value: onlineOrdersCount,
      helperText: 'Web checkout purchases',
      icon: <ShoppingBag className="w-5 h-5 text-[#1F6FEB]" />
    },
    {
      label: 'Manual Phone Orders',
      value: manualOrdersCount,
      helperText: 'Direct property reservations',
      icon: <Banknote className="w-5 h-5 text-[#2E9B3E]" />
    },
    {
      label: 'Active Catalog',
      value: activeProductsCount,
      helperText: `Out of ${products.length} total SKUs`,
      icon: <Package className="w-5 h-5 text-[#1F6FEB]" />
    },
    {
      label: 'Commercial Clients',
      value: customers.length,
      helperText: 'Registered hospitality facilities',
      icon: <Users className="w-5 h-5 text-[#1F6FEB]" />
    },
    {
      label: 'Fulfillment In Transit',
      value: inTransitCount,
      helperText: 'Active packing & transit items',
      icon: <Truck className="w-5 h-5 text-[#1F6FEB]" />
    },
    {
      label: 'Average Order Value',
      value: formatCurrency(avgOrderValue),
      helperText: 'Institutional average ticket size',
      icon: <TrendingUp className="w-5 h-5 text-[#2E9B3E]" />
    }
  ];

  const recentOrders = orders.slice(0, 5);

  const columns = [
    {
      key: 'orderNumber',
      header: 'Order Reference',
      render: (o: Order) => (
        <span className="font-bold text-[#0A1F5C] hover:text-[#1F6FEB]">{o.orderNumber}</span>
      )
    },
    {
      key: 'customerName',
      header: 'Customer / Facility',
      render: (o: Order) => (
        <div>
          <span className="font-semibold block text-[#0F172A]">{o.customerName}</span>
          <span className="text-xs text-[#94A3B8]">{o.customerPhone}</span>
        </div>
      )
    },
    {
      key: 'orderType',
      header: 'Channel',
      render: (o: Order) => (
        <span className="uppercase text-xs font-semibold text-[#475569]">{o.orderType}</span>
      )
    },
    {
      key: 'deliveryStatus',
      header: 'Delivery Status',
      render: (o: Order) => <StatusText status={o.deliveryStatus} />
    },
    {
      key: 'paymentStatus',
      header: 'Payment',
      render: (o: Order) => <StatusText status={o.paymentStatus} />
    },
    {
      key: 'total',
      header: 'Total Value',
      align: 'right' as const,
      render: (o: Order) => (
        <span className="font-bold tabular-nums text-[#0A1F5C]">{formatCurrency(o.total)}</span>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold text-[#0A1F5C]">Operational Overview</h2>
        <p className="text-xs text-[#475569] mt-0.5">
          Real-time metrics calculated dynamically from all commercial accounts and orders.
        </p>
      </div>

      {/* 10 Metric Cards (4 per row grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card, idx) => (
          <StatCard
            key={idx}
            label={card.label}
            value={card.value}
            helperText={card.helperText}
            icon={card.icon}
          />
        ))}
      </div>

      {/* Recent Orders Section */}
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#0A1F5C]">Recent Commercial Orders</h3>
            <span className="text-xs text-[#94A3B8]">Latest transactions received across all channels</span>
          </div>
          <button
            onClick={() => navigate('/admin/orders')}
            className="text-xs font-bold text-[#1F6FEB] hover:underline"
          >
            View All Orders →
          </button>
        </div>

        <DataTable
          columns={columns}
          data={recentOrders}
          total={recentOrders.length}
          page={1}
          limit={5}
          isLoading={loading}
          rowKey={(o) => o.id}
          onRowClick={(o) => navigate('/admin/orders')}
        />
      </div>
    </div>
  );
};
