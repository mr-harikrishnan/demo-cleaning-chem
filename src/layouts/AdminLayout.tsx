import {
  DollarSign,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Package,
  RefreshCw,
  ShoppingBag,
  Sliders,
  Users
} from 'lucide-react';
import React, { useState } from 'react';
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Logo } from '../components/common/Logo';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { resetAllDemoData } from '../storage';

export const AdminLayout: React.FC = () => {
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Protected route check
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login?redirect=/admin" replace />;
  }

  const handleResetData = async () => {
    setIsResetting(true);
    try {
      resetAllDemoData();
      showToast('All demo data has been reset to defaults.', 'info');
      setResetDialogOpen(false);
      // Brief timeout before reloading page state
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (err) {
      console.error('Reset data error:', err);
      showToast('Failed to reset data.', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" />, exact: true },
    { label: 'Orders & Fulfillment', path: '/admin/orders', icon: <ShoppingBag className="w-4 h-4" /> },
    { label: 'Product Catalog', path: '/admin/products', icon: <Package className="w-4 h-4" /> },
    { label: 'Customers', path: '/admin/customers', icon: <Users className="w-4 h-4" /> },
    { label: 'Finance & Sales', path: '/admin/finance', icon: <DollarSign className="w-4 h-4" /> },
    { label: 'Landing Page Products', path: '/admin/landing-page', icon: <Sliders className="w-4 h-4" /> },
    { label: 'Site Content & Enquiries', path: '/admin/content', icon: <FileText className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex">
      {/* Fixed 260px Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-[260px] bg-white border-r border-[#E6EAF2] flex flex-col justify-between z-30 shadow-cleantec-sm">
        <div>
          {/* Sidebar Top: Logo */}
          <div className="h-16 px-6 border-b border-[#E6EAF2] flex items-center justify-between">
            <Link to="/admin">
              <Logo size="sm" showSubtitle={false} />
            </Link>
            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-[4px] bg-[#EEF4FF] text-[#1F6FEB]">
              Admin
            </span>
          </div>

          {/* Navigation Links */}
          <div className="p-4 flex flex-col gap-1">
            <span className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
              Main Management
            </span>

            {navItems.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-xs font-semibold transition-colors duration-150 relative ${
                    isActive
                      ? 'bg-[#EEF4FF] text-[#0A1F5C] font-bold before:content-[""] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:bg-[#1F6FEB] before:rounded-r'
                      : 'text-[#475569] hover:bg-[#F7F9FC] hover:text-[#0A1F5C]'
                  }`}
                >
                  <span className={isActive ? 'text-[#1F6FEB]' : 'text-[#94A3B8]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sidebar Bottom: Back to Website & Logout */}
        <div className="p-4 border-t border-[#E6EAF2] flex flex-col gap-2">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-xs font-semibold text-[#475569] hover:bg-[#EEF4FF] hover:text-[#0A1F5C] transition-colors"
          >
            <Home className="w-4 h-4 text-[#1F6FEB]" />
            <span>View Live Website</span>
          </Link>

          <button
            onClick={() => logout().then(() => navigate('/login'))}
            className="flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-xs font-semibold text-[#DC2626] hover:bg-red-50 transition-colors w-full text-left cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area: Offset by 260px */}
      <div className="flex-1 ml-[260px] flex flex-col min-w-0">
        {/* 64px Top Header */}
        <header className="sticky top-0 z-20 h-16 bg-white/90 backdrop-blur-sm border-b border-[#E6EAF2] px-8 flex items-center justify-between shadow-cleantec-sm">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-[#0A1F5C]">CleanTec Management Portal</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Reset Demo Data Button */}
            <Button
              variant="outline"
              size="sm"
              icon={<RefreshCw className="w-3.5 h-3.5 text-[#1F6FEB]" />}
              onClick={() => setResetDialogOpen(true)}
            >
              Reset Demo Data
            </Button>

            {/* Admin Avatar */}
            <div className="flex items-center gap-2.5 pl-4 border-l border-[#E6EAF2]">
              <div className="w-8 h-8 rounded-full bg-[#0A1F5C] text-white flex items-center justify-center font-bold text-xs">
                {currentUser?.name.charAt(0)}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-[#0A1F5C]">{currentUser?.name}</span>
                <span className="text-[10px] text-[#94A3B8] font-medium">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="p-8 flex-1 max-w-[1400px] w-full">
          <Outlet />
        </main>
      </div>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        onConfirm={handleResetData}
        title="Reset All Demo Data?"
        message="This will reseed all products, orders, customers, and landing page configurations back to their factory demo state. Any custom orders or edited products will be reset."
        confirmText="Yes, Reset Data"
        cancelText="Cancel"
        isDanger={true}
        isLoading={isResetting}
      />
    </div>
  );
};
