import React from 'react';
import { Outlet } from 'react-router-dom';
import { CartDrawer } from '../components/cart/CartDrawer';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';

export const CustomerLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#475569]">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <CartDrawer />
      <Footer />
    </div>
  );
};
