import { ArrowRight, Check, Lock, ShieldCheck, UserCheck } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { OrderSummary } from '../components/cart/OrderSummary';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services';
import { ShippingAddress } from '../types';

export const CheckoutPage: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Form State initialized with logged-in user profile if available
  const [formData, setFormData] = useState<ShippingAddress>({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    city: currentUser?.city || 'Chennai',
    state: currentUser?.state || 'Tamil Nadu',
    pincode: currentUser?.pincode || '600077'
  });

  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If cart is empty, redirect
  if (items.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto px-4">
        <h2 className="text-2xl font-bold text-[#0A1F5C]">Your cart is empty</h2>
        <p className="mt-2 text-sm text-[#475569]">Please add items to your cart before proceeding to checkout.</p>
        <Link to="/products" className="inline-block mt-6">
          <Button variant="primary">Return to Catalog</Button>
        </Link>
      </div>
    );
  }

  // 1. If not logged in, show clean gate as requested in Part G
  if (!isAuthenticated) {
    return (
      <div className="py-16 bg-[#F7F9FC]">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-[20px] border border-[#E6EAF2] p-8 shadow-cleantec-md text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-[#EEF4FF] text-[#1F6FEB] flex items-center justify-center mb-4">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#0A1F5C]">Sign in to Complete Order</h2>
            <p className="mt-2 text-sm text-[#475569] max-w-md">
              Please sign in to your CleanTec account or create a business profile so we can track and dispatch your hospitality chemical order.
            </p>

            <div className="w-full mt-8 flex flex-col gap-3">
              <Link to="/login?redirect=/checkout">
                <Button variant="primary" size="lg" className="w-full">
                  Sign In with Existing Account
                </Button>
              </Link>
              <Link to="/register?redirect=/checkout">
                <Button variant="outline" size="lg" className="w-full">
                  Create New Commercial Account
                </Button>
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-[#E6EAF2] w-full text-xs text-[#94A3B8] flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2E9B3E]" />
              <span>Direct B2B procurement • Instant order processing</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const validateForm = (): boolean => {
    const errs: Partial<Record<keyof ShippingAddress, string>> = {};

    // 1. Presence validation
    if (!formData.name.trim()) errs.name = 'Full name is required.';
    if (!formData.phone.trim()) errs.phone = 'Mobile number is required.';
    if (!formData.email.trim()) errs.email = 'Email address is required.';
    if (!formData.address.trim()) errs.address = 'Street address is required.';
    if (!formData.city.trim()) errs.city = 'City is required.';
    if (!formData.state.trim()) errs.state = 'State is required.';
    if (!formData.pincode.trim()) errs.pincode = 'Pincode is required.';

    // 2. Format validation
    if (formData.email && !formData.email.includes('@')) {
      errs.email = 'Please provide a valid email address.';
    }
    if (formData.phone && formData.phone.length < 10) {
      errs.phone = 'Please provide a 10-digit mobile number.';
    }
    if (formData.pincode && formData.pincode.length !== 6) {
      errs.pincode = 'Pincode must be 6 digits.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceedToPayment = async () => {
    if (!validateForm()) {
      showToast('Please check the required delivery details.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create draft/pending order
      const order = await orderService.createOrder({
        customerId: currentUser?.id || 'guest',
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: formData,
        items: items.map((i) => ({
          productId: i.productId,
          productName: i.product.name,
          packSize: i.product.packSize,
          price: i.product.price,
          quantity: i.quantity,
          lineTotal: i.product.price * i.quantity,
          image: i.product.image
        })),
        subtotal,
        deliveryFee,
        total,
        amountCollected: 0,
        orderType: 'online',
        paymentMethod: 'online',
        paymentStatus: 'pending',
        deliveryStatus: 'pending',
        notes
      });

      // Clear the cart
      clearCart();

      // Navigate to payment page with newly created order
      navigate(`/payment?orderId=${order.id}&amount=${order.total}`);
    } catch (err: unknown) {
      console.error('Checkout error:', err);
      const msg = err instanceof Error ? err.message : 'Unable to proceed with checkout.';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-10 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* 3-Step Indicator */}
        <div className="mb-10 max-w-xl mx-auto flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#E6EAF2] -translate-y-1/2 z-0" />

          {/* Step 1: Details (Active) */}
          <div className="relative z-10 flex flex-col items-center gap-1.5 bg-white px-2">
            <div className="w-9 h-9 rounded-full bg-[#0A1F5C] text-white flex items-center justify-center font-bold text-xs shadow-cleantec-sm">
              1
            </div>
            <span className="text-xs font-bold text-[#0A1F5C]">Facility Details</span>
          </div>

          {/* Step 2: Payment */}
          <div className="relative z-10 flex flex-col items-center gap-1.5 bg-white px-2">
            <div className="w-9 h-9 rounded-full bg-[#F1F4F9] text-[#94A3B8] border border-[#E6EAF2] flex items-center justify-center font-bold text-xs">
              2
            </div>
            <span className="text-xs font-medium text-[#94A3B8]">Payment Method</span>
          </div>

          {/* Step 3: Confirmation */}
          <div className="relative z-10 flex flex-col items-center gap-1.5 bg-white px-2">
            <div className="w-9 h-9 rounded-full bg-[#F1F4F9] text-[#94A3B8] border border-[#E6EAF2] flex items-center justify-center font-bold text-xs">
              3
            </div>
            <span className="text-xs font-medium text-[#94A3B8]">Confirmation</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Form Details (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Authenticated user badge */}
            <div className="p-4 rounded-[12px] bg-[#EEF4FF] border border-[#1F6FEB]/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-[#1F6FEB]" />
                <span className="text-xs font-medium text-[#0A1F5C]">
                  Signed in as <strong>{currentUser?.name}</strong> ({currentUser?.email})
                </span>
              </div>
              <Link to="/profile" className="text-xs font-bold text-[#1F6FEB] hover:underline">
                Edit Profile
              </Link>
            </div>

            <div className="bg-white rounded-[16px] border border-[#E6EAF2] p-6 shadow-cleantec-sm flex flex-col gap-6">
              <h3 className="text-lg font-bold text-[#0A1F5C] border-b border-[#E6EAF2] pb-3">
                Commercial Delivery Location
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Contact Person / Facility Head"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.name}
                  error={errors.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />

                <Input
                  label="Phone Number (for Delivery Driver)"
                  type="tel"
                  required
                  placeholder="e.g. 9840123456"
                  value={formData.phone}
                  error={errors.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <Input
                label="Email Address for Invoicing"
                type="email"
                required
                placeholder="e.g. purchase@hotelresort.com"
                value={formData.email}
                error={errors.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />

              <Input
                label="Facility / Hotel Address & Room / Block"
                required
                placeholder="e.g. Grand Horizon Hotel, 142 Mount Road"
                value={formData.address}
                error={errors.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="City"
                  required
                  value={formData.city}
                  error={errors.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />

                <Input
                  label="State"
                  required
                  value={formData.state}
                  error={errors.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />

                <Input
                  label="Pincode"
                  required
                  placeholder="e.g. 600002"
                  value={formData.pincode}
                  error={errors.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#0A1F5C] block mb-1.5">
                  Gate Delivery Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Deliver to rear kitchen receiving dock or housekeeping store."
                  className="w-full p-3 bg-white text-sm rounded-[10px] border border-[#E6EAF2] focus:border-[#1F6FEB] focus-ring"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary (4 cols) */}
          <div className="lg:col-span-4">
            <OrderSummary
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              total={total}
              actionText="Continue to Payment"
              actionVariant="green"
              isLoading={isSubmitting}
              onAction={handleProceedToPayment}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
