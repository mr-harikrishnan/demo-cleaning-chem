import { ChevronRight, Eye, Phone, Users } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../../components/common/DataTable';
import { useCustomers } from '../../hooks/useCustomers';
import { Customer } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const AdminCustomersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const {
    customers,
    total,
    page,
    limit,
    isInitialLoad,
    isLoading,
    setPage,
    setSearch,
    setLimit
  } = useCustomers({ limit: 10 });

  const navigate = useNavigate();

  const columns = [
    {
      key: 'name',
      header: 'Customer / Property Name',
      render: (c: Customer) => (
        <div>
          <span className="font-bold text-[#0A1F5C] hover:text-[#1F6FEB] block">
            {c.name}
          </span>
          <span className="text-xs text-[#94A3B8]">{c.email}</span>
        </div>
      )
    },
    {
      key: 'phone',
      header: 'Contact Phone',
      render: (c: Customer) => (
        <span className="text-xs font-semibold text-[#0F172A]">{c.phone || '—'}</span>
      )
    },
    {
      key: 'city',
      header: 'Location',
      render: (c: Customer) => (
        <span className="text-xs text-[#475569]">{c.city || 'Chennai'}, {c.state || 'Tamil Nadu'}</span>
      )
    },
    {
      key: 'totalOrders',
      header: 'Orders Placed',
      align: 'center' as const,
      render: (c: Customer) => (
        <span className="text-xs font-bold text-[#0A1F5C] bg-[#EEF4FF] px-2.5 py-1 rounded-[6px] tabular-nums">
          {c.totalOrders} {c.totalOrders === 1 ? 'order' : 'orders'}
        </span>
      )
    },
    {
      key: 'totalSpent',
      header: 'Total Spent',
      align: 'right' as const,
      render: (c: Customer) => (
        <span className="font-bold tabular-nums text-[#0A1F5C]">
          {formatCurrency(c.totalSpent)}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right' as const,
      render: (c: Customer) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/admin/customers/${c.id}`);
          }}
          className="p-1.5 rounded-[6px] hover:bg-[#EEF4FF] text-[#1F6FEB] transition-colors"
          title="View Customer Profile"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0A1F5C]">Commercial Customers</h2>
        <p className="text-xs text-[#475569] mt-0.5">
          Directory of registered hotels, facilities, and procurement managers.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={customers}
        total={total}
        page={page}
        limit={limit}
        isInitialLoad={isInitialLoad}
        isLoading={isLoading}
        searchValue={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setSearch(val);
        }}
        onPageChange={setPage}
        onLimitChange={setLimit}
        searchPlaceholder="Search customer name, email, phone, location..."
        rowKey={(c) => c.id}
        onRowClick={(c) => navigate(`/admin/customers/${c.id}`)}
      />
    </div>
  );
};
