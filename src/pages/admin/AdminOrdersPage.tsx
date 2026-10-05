import {
  CheckCircle2,
  DollarSign,
  Edit,
  Eye,
  Filter,
  Plus,
  RefreshCw,
  ShoppingBag,
  Trash2,
  Truck
} from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { DataTable } from '../../components/common/DataTable';
import { Drawer } from '../../components/common/Drawer';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Select } from '../../components/common/Select';
import { StatusText } from '../../components/common/StatusText';
import { useToast } from '../../context/ToastContext';
import { useOrders } from '../../hooks/useOrders';
import { customerService, orderService, productService } from '../../services';
import { Customer, DeliveryStatus, Order, PaymentStatus, Product } from '../../types';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

export const AdminOrdersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'online' | 'manual'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const {
    orders,
    total,
    page,
    limit,
    isInitialLoad,
    isLoading,
    setPage,
    setSearch,
    setType,
    setPaymentStatus,
    setDeliveryStatus,
    setLimit,
    refresh
  } = useOrders({ type: 'all', limit: 10 });

  const { showToast } = useToast();

  // Selected order for detail drawer
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Edit status states in drawer
  const [editPaymentStatus, setEditPaymentStatus] = useState<PaymentStatus>('pending');
  const [editDeliveryStatus, setEditDeliveryStatus] = useState<DeliveryStatus>('pending');
  const [editAmountCollected, setEditAmountCollected] = useState<number>(0);
  const [editNotes, setEditNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Manual Order Creation State
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [manualCustomerName, setManualCustomerName] = useState('');
  const [manualCustomerEmail, setManualCustomerEmail] = useState('');
  const [manualCustomerPhone, setManualCustomerPhone] = useState('');
  const [manualAddress, setManualAddress] = useState('');
  const [manualCity, setManualCity] = useState('Chennai');
  const [manualSelectedItems, setManualSelectedItems] = useState<
    { productId: string; quantity: number; price: number }[]
  >([]);
  const [manualPaymentMethod, setManualPaymentMethod] = useState<'online' | 'cod'>('online');
  const [manualAmountCollected, setManualAmountCollected] = useState<number>(0);
  const [isCreatingManual, setIsCreatingManual] = useState(false);

  const handleTabChange = (tab: 'all' | 'online' | 'manual') => {
    setActiveTab(tab);
    setType(tab);
  };

  const handleOpenDetail = (order: Order) => {
    setSelectedOrder(order);
    setEditPaymentStatus(order.paymentStatus);
    setEditDeliveryStatus(order.deliveryStatus);
    setEditAmountCollected(order.amountCollected);
    setEditNotes(order.notes || '');
    setIsDrawerOpen(true);
  };

  const handleUpdateOrderStatus = async () => {
    if (!selectedOrder) return;
    setIsUpdating(true);

    try {
      const updated = await orderService.updateStatus(selectedOrder.id, {
        paymentStatus: editPaymentStatus,
        deliveryStatus: editDeliveryStatus,
        amountCollected: editAmountCollected,
        notes: editNotes
      });

      setSelectedOrder(updated);
      showToast(`Order ${updated.orderNumber} updated successfully.`, 'success');
      refresh();
      setIsDrawerOpen(false);
    } catch (err: unknown) {
      console.error('Update order error:', err);
      showToast('Failed to update order.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  // Open Manual Order creation modal
  const handleOpenManualOrderModal = async () => {
    const [cRes, pRes] = await Promise.all([
      customerService.getCustomers({ limit: 100 }),
      productService.getAllProducts()
    ]);
    setAllCustomers(cRes.data);
    setAllProducts(pRes);
    if (pRes.length > 0) {
      setManualSelectedItems([{ productId: pRes[0].id, quantity: 1, price: pRes[0].price }]);
    }
    setIsManualModalOpen(true);
  };

  const handleAddManualItemRow = () => {
    if (allProducts.length > 0) {
      setManualSelectedItems((prev) => [
        ...prev,
        { productId: allProducts[0].id, quantity: 1, price: allProducts[0].price }
      ]);
    }
  };

  const handleRemoveManualItemRow = (index: number) => {
    setManualSelectedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleManualProductChange = (index: number, prodId: string) => {
    const found = allProducts.find((p) => p.id === prodId);
    if (!found) return;
    setManualSelectedItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, productId: prodId, price: found.price } : item
      )
    );
  };

  const handleCreateManualOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCustomerName || !manualCustomerPhone || manualSelectedItems.length === 0) {
      showToast('Please fill required customer details and items.', 'error');
      return;
    }

    setIsCreatingManual(true);
    try {
      const orderItems = manualSelectedItems.map((sel) => {
        const prod = allProducts.find((p) => p.id === sel.productId)!;
        return {
          productId: prod.id,
          productName: prod.name,
          packSize: prod.packSize,
          price: sel.price,
          quantity: sel.quantity,
          lineTotal: sel.price * sel.quantity,
          image: prod.image
        };
      });

      const subtotal = orderItems.reduce((sum, item) => sum + item.lineTotal, 0);
      const deliveryFee = 0;
      const total = subtotal + deliveryFee;

      const created = await orderService.createOrder({
        customerId: `cust-manual-${Date.now()}`,
        customerName: manualCustomerName,
        customerEmail: manualCustomerEmail || `${manualCustomerPhone}@placeholder.local`,
        customerPhone: manualCustomerPhone,
        shippingAddress: {
          name: manualCustomerName,
          phone: manualCustomerPhone,
          email: manualCustomerEmail,
          address: manualAddress || 'Direct Commercial Pickup',
          city: manualCity,
          state: 'Tamil Nadu',
          pincode: '600077'
        },
        items: orderItems,
        subtotal,
        deliveryFee,
        total,
        amountCollected: manualAmountCollected,
        orderType: 'manual',
        paymentMethod: manualPaymentMethod,
        paymentStatus: manualAmountCollected >= total ? 'paid' : manualAmountCollected > 0 ? 'partially_paid' : 'pending',
        deliveryStatus: 'confirmed',
        notes: 'Manual order logged by admin.'
      });

      showToast(`Manual Order ${created.orderNumber} created!`, 'success');
      setIsManualModalOpen(false);
      refresh();
    } catch (err: unknown) {
      console.error('Create manual order error:', err);
      const msg = err instanceof Error ? err.message : 'Unable to create manual order.';
      showToast(msg, 'error');
    } finally {
      setIsCreatingManual(false);
    }
  };

  const columns = [
    {
      key: 'orderNumber',
      header: 'Reference',
      render: (o: Order) => (
        <div>
          <span className="font-bold text-[#0A1F5C] hover:text-[#1F6FEB] block">
            {o.orderNumber}
          </span>
          <span className="text-[11px] text-[#94A3B8]">{formatDateTime(o.createdAt)}</span>
        </div>
      )
    },
    {
      key: 'customerName',
      header: 'Customer / Property',
      render: (o: Order) => (
        <div>
          <span className="font-semibold block text-[#0F172A]">{o.customerName}</span>
          <span className="text-xs text-[#94A3B8]">{o.customerPhone}</span>
        </div>
      )
    },
    {
      key: 'orderType',
      header: 'Type',
      render: (o: Order) => (
        <span className="text-xs font-bold uppercase text-[#475569]">{o.orderType}</span>
      )
    },
    {
      key: 'deliveryStatus',
      header: 'Delivery Status',
      render: (o: Order) => <StatusText status={o.deliveryStatus} />
    },
    {
      key: 'paymentStatus',
      header: 'Payment Status',
      render: (o: Order) => <StatusText status={o.paymentStatus} />
    },
    {
      key: 'total',
      header: 'Total Value',
      align: 'right' as const,
      render: (o: Order) => (
        <div>
          <span className="font-bold tabular-nums text-[#0A1F5C] block">
            {formatCurrency(o.total)}
          </span>
          <span className="text-[11px] text-[#2E9B3E] tabular-nums">
            Rec: {formatCurrency(o.amountCollected)}
          </span>
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'center' as const,
      render: (o: Order) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleOpenDetail(o);
          }}
          className="p-1.5 rounded-[6px] hover:bg-[#EEF4FF] text-[#1F6FEB] transition-colors"
          title="Manage Order"
        >
          <Edit className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0A1F5C]">Order Management</h2>
          <p className="text-xs text-[#475569] mt-0.5">
            Process online web checkouts and log manual phone reservations.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleOpenManualOrderModal}
        >
          Create Manual Order
        </Button>
      </div>

      {/* Underline Tabs: All | Online Orders | Manual Orders */}
      <div className="flex items-center gap-8 border-b border-[#E6EAF2]">
        {[
          { id: 'all', label: 'All Orders' },
          { id: 'online', label: 'Online Orders' },
          { id: 'manual', label: 'Manual Direct Orders' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id as any)}
            className={`pb-3 text-sm font-bold transition-colors relative cursor-pointer ${
              activeTab === tab.id
                ? 'text-[#0A1F5C] after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#1F6FEB]'
                : 'text-[#94A3B8] hover:text-[#0A1F5C]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* DataTable adhering strictly to DataTable rules */}
      <DataTable
        columns={columns}
        data={orders}
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
        searchPlaceholder="Search order ref, facility, phone..."
        rowKey={(o) => o.id}
        onRowClick={handleOpenDetail}
        filterSlot={
          <div className="flex items-center gap-2">
            <select
              onChange={(e) => setDeliveryStatus(e.target.value)}
              className="h-11 px-3 bg-white border border-[#E6EAF2] rounded-[10px] text-xs font-semibold text-[#0A1F5C] focus-ring"
            >
              <option value="all">All Delivery Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="packed">Packed</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="h-11 px-3 bg-white border border-[#E6EAF2] rounded-[10px] text-xs font-semibold text-[#0A1F5C] focus-ring"
            >
              <option value="all">All Payment Statuses</option>
              <option value="paid">Paid</option>
              <option value="partially_paid">Partially Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        }
      />

      {/* Order Detail & Status Management Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedOrder ? `Manage ${selectedOrder.orderNumber}` : 'Order Details'}
        subtitle={selectedOrder ? `Channel: ${selectedOrder.orderType.toUpperCase()}` : ''}
        width="lg"
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleUpdateOrderStatus}
              isLoading={isUpdating}
            >
              Save Status Updates
            </Button>
          </div>
        }
      >
        {selectedOrder && (
          <div className="flex flex-col gap-6">
            {/* Quick Financial Snapshot */}
            <div className="p-4 rounded-[12px] bg-[#F8FAFC] border border-[#E6EAF2] grid grid-cols-3 gap-3 text-center">
              <div>
                <span className="text-[10px] text-[#94A3B8] uppercase font-bold">Total Bill</span>
                <span className="text-base font-extrabold text-[#0A1F5C] block tabular-nums">
                  {formatCurrency(selectedOrder.total)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#2E9B3E] uppercase font-bold">Collected</span>
                <span className="text-base font-extrabold text-[#2E9B3E] block tabular-nums">
                  {formatCurrency(editAmountCollected)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#DC2626] uppercase font-bold">Pending</span>
                <span className="text-base font-extrabold text-[#DC2626] block tabular-nums">
                  {formatCurrency(Math.max(0, selectedOrder.total - editAmountCollected))}
                </span>
              </div>
            </div>

            {/* Editable Status Controls */}
            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1F5C]">
                Status & Settlement Management
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#0A1F5C] block mb-1">
                    Delivery Fulfillment Status
                  </label>
                  <select
                    value={editDeliveryStatus}
                    onChange={(e) => setEditDeliveryStatus(e.target.value as DeliveryStatus)}
                    className="w-full h-11 px-3 bg-white border border-[#E6EAF2] rounded-[10px] text-xs font-semibold text-[#0A1F5C] focus-ring"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="packed">Packed</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#0A1F5C] block mb-1">
                    Payment Status
                  </label>
                  <select
                    value={editPaymentStatus}
                    onChange={(e) => setEditPaymentStatus(e.target.value as PaymentStatus)}
                    className="w-full h-11 px-3 bg-white border border-[#E6EAF2] rounded-[10px] text-xs font-semibold text-[#0A1F5C] focus-ring"
                  >
                    <option value="pending">Pending</option>
                    <option value="partially_paid">Partially Paid</option>
                    <option value="paid">Paid (Fully Settled)</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#0A1F5C] block mb-1">
                  Amount Collected (₹)
                </label>
                <input
                  type="number"
                  value={editAmountCollected}
                  onChange={(e) => {
                    const num = Number(e.target.value);
                    setEditAmountCollected(num);
                    if (num >= selectedOrder.total) {
                      setEditPaymentStatus('paid');
                    } else if (num > 0) {
                      setEditPaymentStatus('partially_paid');
                    }
                  }}
                  className="w-full h-11 px-3 bg-white border border-[#E6EAF2] rounded-[10px] text-sm tabular-nums focus-ring font-bold text-[#0A1F5C]"
                />
                <span className="text-[11px] text-[#94A3B8] mt-1 block">
                  Auto-settles to 'Paid' when amount collected meets total {formatCurrency(selectedOrder.total)}.
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#0A1F5C] block mb-1">
                  Internal Notes
                </label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full p-3 bg-white border border-[#E6EAF2] rounded-[10px] text-xs focus-ring"
                  placeholder="e.g. Check received via cheque / advance paid"
                />
              </div>
            </div>

            {/* Line items list */}
            <div className="pt-4 border-t border-[#E6EAF2] flex flex-col gap-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1F5C]">
                Ordered Products ({selectedOrder.items.length})
              </h4>
              <div className="divide-y divide-[#E6EAF2] text-xs">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#0A1F5C] block">{item.productName}</span>
                      <span className="text-[#94A3B8]">
                        Pack: {item.packSize} • Qty: {item.quantity}
                      </span>
                    </div>
                    <span className="font-bold tabular-nums text-[#0A1F5C]">
                      {formatCurrency(item.lineTotal)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery address */}
            <div className="pt-4 border-t border-[#E6EAF2] text-xs text-[#475569]">
              <span className="font-bold text-[#0A1F5C] uppercase block mb-1">Delivery Destination</span>
              <div>{selectedOrder.shippingAddress.name} ({selectedOrder.shippingAddress.phone})</div>
              <div>{selectedOrder.shippingAddress.address}</div>
              <div>{selectedOrder.shippingAddress.city} - {selectedOrder.shippingAddress.pincode}</div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Create Manual Order Modal */}
      <Modal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        title="Create Manual Direct Order"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateManualOrder} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Customer / Hotel Name"
              required
              placeholder="e.g. Anand Sharma (Palms Resort)"
              value={manualCustomerName}
              onChange={(e) => setManualCustomerName(e.target.value)}
            />
            <Input
              label="Contact Mobile"
              type="tel"
              required
              placeholder="e.g. 9840123456"
              value={manualCustomerPhone}
              onChange={(e) => setManualCustomerPhone(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address (Optional)"
              type="email"
              placeholder="e.g. accounts@palmsresort.com"
              value={manualCustomerEmail}
              onChange={(e) => setManualCustomerEmail(e.target.value)}
            />
            <Input
              label="Delivery Address"
              placeholder="e.g. Gate 2, Palms Resort, ECR"
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
            />
          </div>

          {/* Product Items Selectors */}
          <div className="p-4 rounded-[12px] bg-[#F8FAFC] border border-[#E6EAF2] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0A1F5C]">
                Selected Products
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddManualItemRow}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Another Item
              </Button>
            </div>

            <div className="flex flex-col gap-3">
              {manualSelectedItems.map((row, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex-1">
                    <select
                      value={row.productId}
                      onChange={(e) => handleManualProductChange(idx, e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-[#E6EAF2] rounded-[8px] text-xs font-medium focus-ring"
                    >
                      {allProducts.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.packSize}) — ₹{p.price}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-24">
                    <input
                      type="number"
                      min={1}
                      value={row.quantity}
                      onChange={(e) =>
                        setManualSelectedItems((prev) =>
                          prev.map((item, i) =>
                            i === idx ? { ...item, quantity: Number(e.target.value) } : item
                          )
                        )
                      }
                      className="w-full h-10 px-2.5 bg-white border border-[#E6EAF2] rounded-[8px] text-xs font-semibold text-center focus-ring"
                    />
                  </div>

                  <div className="w-24 text-right font-bold text-xs tabular-nums text-[#0A1F5C]">
                    {formatCurrency(row.price * row.quantity)}
                  </div>

                  {manualSelectedItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveManualItemRow(idx)}
                      className="p-1.5 text-[#94A3B8] hover:text-[#DC2626]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#0A1F5C] block mb-1">
                Payment Channel
              </label>
              <select
                value={manualPaymentMethod}
                onChange={(e) => setManualPaymentMethod(e.target.value as 'online' | 'cod')}
                className="w-full h-11 px-3 bg-white border border-[#E6EAF2] rounded-[10px] text-xs font-semibold focus-ring"
              >
                <option value="online">Online / Direct Bank Transfer</option>
                <option value="cod">Cash on Delivery / Driver Collection</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#0A1F5C] block mb-1">
                Initial Amount Collected (₹)
              </label>
              <input
                type="number"
                value={manualAmountCollected}
                onChange={(e) => setManualAmountCollected(Number(e.target.value))}
                className="w-full h-11 px-3 bg-white border border-[#E6EAF2] rounded-[10px] text-sm tabular-nums font-bold focus-ring"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#E6EAF2] flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsManualModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" isLoading={isCreatingManual}>
              Submit Manual Order
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
