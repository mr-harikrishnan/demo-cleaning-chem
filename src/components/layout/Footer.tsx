import { Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B0F19] text-white pt-14 pb-10 border-t border-white/10 w-full">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 5-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Column 1 & 2: Brand & Contact Info */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Logo size="md" light showSubtitle />
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-normal mt-1 max-w-sm">
              Complete range of commercial cleaning & specialty chemical formulations engineered for businesses, hotels, restaurants, corporate tech parks, healthcare, and property management.
            </p>

            <div className="mt-2 flex flex-col gap-2.5 text-xs text-white/80">
              <a
                href="tel:8438244083"
                className="flex items-center gap-2.5 text-white hover:text-[#38BDF8] transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[#F59E0B] shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] text-white/50 block">Commercial Desk / WhatsApp</span>
                  <span className="text-xs font-bold text-white tracking-wide">8438244083</span>
                </div>
              </a>

              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[#38BDF8] shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="leading-snug">
                  <span className="text-[10px] text-white/50 block">Registered Facility & Warehouse</span>
                  <span className="text-xs text-white/80">No: 10, Sannathi Street, Thiruverkadu, Chennai - 600 077.</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[#10B981] shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] text-white/50 block">Direct Channel</span>
                  <span className="text-xs text-white/80">orders@cleantechospitality.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Shop Categories */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Shop Categories
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-white/60">
              <li>
                <Link to="/products?category=Floor%20Cleaner" className="hover:text-white transition-colors">
                  Floor Cleaners
                </Link>
              </li>
              <li>
                <Link to="/products?category=Dishwash%20Liquid" className="hover:text-white transition-colors">
                  Dishwash Liquid
                </Link>
              </li>
              <li>
                <Link to="/products?category=Toilet%20Cleaner" className="hover:text-white transition-colors">
                  Toilet Cleaners
                </Link>
              </li>
              <li>
                <Link to="/products?category=Glass%20Cleaner" className="hover:text-white transition-colors">
                  Glass & Mirror Care
                </Link>
              </li>
              <li>
                <Link to="/products?category=Kitchen%20Degreaser" className="hover:text-white transition-colors">
                  Kitchen Degreasers
                </Link>
              </li>
              <li>
                <Link to="/products?category=Fabric%20Wash" className="hover:text-white transition-colors">
                  Bulk 5L Fabric Wash
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-[#38BDF8] hover:underline font-semibold mt-1 block">
                  View All Products ➔
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Commercial Solutions */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Solutions
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-white/60">
              <li>
                <Link to="/products?category=Kitchen%20Degreaser" className="hover:text-white transition-colors">
                  Commercial Kitchens
                </Link>
              </li>
              <li>
                <Link to="/products?category=Toilet%20Cleaner" className="hover:text-white transition-colors">
                  Restroom & Hygiene
                </Link>
              </li>
              <li>
                <Link to="/products?category=Floor%20Cleaner" className="hover:text-white transition-colors">
                  High-Footfall Floors
                </Link>
              </li>
              <li>
                <Link to="/products?category=Fabric%20Wash" className="hover:text-white transition-colors">
                  Commercial Laundry
                </Link>
              </li>
              <li>
                <Link to="/products?category=Disinfectant" className="hover:text-white transition-colors">
                  Surface Disinfection
                </Link>
              </li>
              <li>
                <a href="/#industries" className="hover:text-white transition-colors">
                  Industries Served
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: Support & Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Account & Support
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-white/60">
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">
                  Your Orders & Tracking
                </Link>
              </li>
              <li>
                <a href="/#contact" className="hover:text-white transition-colors">
                  Request a Quote
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Customer Sign In
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <a href="/#about" className="hover:text-white transition-colors">
                  About CleanTec
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>© {new Date().getFullYear()} CleanTec™ Commercial Chemical Solutions. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-5 text-xs text-white/50">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Supply</span>
            <span className="hover:text-white cursor-pointer">Tamil Nadu Logistics</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
