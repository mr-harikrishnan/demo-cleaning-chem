import {
  Building2,
  ChevronDown,
  Droplets,
  Layers,
  LogOut,
  Menu,
  PhoneCall,
  Search,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  User as UserIcon,
  UtensilsCrossed,
  X
} from 'lucide-react';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Logo } from '../common/Logo';

export const Header: React.FC = () => {
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();
  const { count, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      navigate(`/products?search=${encodeURIComponent(headerSearch.trim())}`);
      setSearchOpen(false);
      setHeaderSearch('');
      setActiveDropdown(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const productCategories = [
    { name: 'Floor Cleaners', path: '/products?category=Floor%20Cleaner', desc: 'Neutral floral detergents for marble & tiles' },
    { name: 'Dishwash Liquid', path: '/products?category=Dishwash%20Liquid', desc: 'Lemon active grease cutting concentrates' },
    { name: 'Toilet & Washroom', path: '/products?category=Toilet%20Cleaner', desc: 'Thick limescale and bowl sanitizing gel' },
    { name: 'Glass & Mirrors', path: '/products?category=Glass%20Cleaner', desc: 'Streak-free fast drying surface polish' },
    { name: 'Kitchen Degreasers', path: '/products?category=Kitchen%20Degreaser', desc: 'Industrial foam for exhaust hoods & grills' },
    { name: 'Bulk Fabric Wash 5L', path: '/products?category=Fabric%20Wash', desc: 'Commercial laundry detergent for linens' },
    { name: 'Phenyl Disinfectants', path: '/products?category=Disinfectant', desc: 'Germicidal fluids for corridor sanitation' },
    { name: 'Tile & Deep Cleaner', path: '/products?category=Tile%20%26%20Surface%20Cleaner', desc: 'Heavy duty ceramic & grout renovator' }
  ];

  const solutions = [
    { title: 'Commercial Kitchen Sanitation', path: '/products?category=Kitchen%20Degreaser', desc: 'Hoods, ranges, prep tables and dishwashing' },
    { title: 'Washroom & Restroom Care', path: '/products?category=Toilet%20Cleaner', desc: 'Porcelain bowl descaling and fixture protection' },
    { title: 'High-Footfall Floor Maintenance', path: '/products?category=Floor%20Cleaner', desc: 'Marble, polished granite and vitrified tiles' },
    { title: 'Commercial Laundry & Linens', path: '/products?category=Fabric%20Wash', desc: 'Bed linens, bath towels and staff uniforms' },
    { title: 'Corridor & Surface Disinfection', path: '/products?category=Disinfectant', desc: 'Hospital-grade pathogen barrier for businesses' }
  ];

  const industries = [
    { title: 'Hotels & Luxury Resorts', path: '/#industries', desc: 'Flawless guest room presentation & aromas' },
    { title: 'Restaurants & Commercial Kitchens', path: '/#industries', desc: 'Hygienic food prep zones & degreased hoods' },
    { title: 'Corporate Offices & Tech Parks', path: '/#industries', desc: 'High footfall lobbies & executive restrooms' },
    { title: 'Healthcare Facilities & Clinics', path: '/#industries', desc: 'Stringent disinfection & surface sanitizers' },
    { title: 'Schools & Educational Campuses', path: '/#industries', desc: 'Economical 5L bulk formulas for daily hygiene' },
    { title: 'Facility Management Agencies', path: '/#industries', desc: 'Scheduled recurring dispatch across Tamil Nadu' }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 h-[72px] bg-white border-b border-[#EAEAEA] transition-colors duration-200">
        <div className="max-w-[1360px] h-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Left: Brand Logo */}
          <Link to="/" className="shrink-0 focus-ring rounded-[8px]" aria-label="CleanTec Home">
            <Logo size="md" />
          </Link>

          {/* Center: Desktop Navigation with Hover Dropdowns */}
          <nav className="hidden lg:flex items-center gap-7 h-full">
            {/* 1. Products Dropdown */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setActiveDropdown('products')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                to="/products"
                className={`text-[13px] font-semibold transition-colors duration-150 inline-flex items-center gap-1.5 py-2 ${
                  location.pathname.startsWith('/products')
                    ? 'text-[#0B0F19] font-bold'
                    : 'text-[#475569] hover:text-[#0B0F19]'
                }`}
              >
                <span>Products</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#94A3B8] transition-transform duration-200 ${
                    activeDropdown === 'products' ? 'rotate-180 text-[#0B0F19]' : ''
                  }`}
                />
              </Link>

              {activeDropdown === 'products' && (
                <div className="absolute top-[68px] left-0 w-[580px] bg-white rounded-[20px] shadow-2xl border border-[#EAEAEA] p-6 z-50 grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-150">
                  {productCategories.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setActiveDropdown(null)}
                      className="p-2.5 rounded-[12px] hover:bg-[#F8FAFC] transition-colors group flex flex-col"
                    >
                      <span className="text-xs font-bold text-[#0B0F19] group-hover:text-[#1E40AF] transition-colors">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-[#64748B] mt-0.5 leading-snug">
                        {item.desc}
                      </span>
                    </Link>
                  ))}

                  <div className="col-span-2 pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                    <span className="text-xs text-[#94A3B8]">Concentrated 500ml, 1L & 5L commercial sizes</span>
                    <Link
                      to="/products"
                      onClick={() => setActiveDropdown(null)}
                      className="text-xs font-bold text-[#0B0F19] hover:text-[#1E40AF] inline-flex items-center gap-1"
                    >
                      <span>View All Products</span>
                      <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Solutions Dropdown */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setActiveDropdown('solutions')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a
                href="/#solutions"
                className="text-[13px] font-semibold text-[#475569] hover:text-[#0B0F19] transition-colors inline-flex items-center gap-1.5 py-2"
              >
                <span>Solutions</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#94A3B8] transition-transform duration-200 ${
                    activeDropdown === 'solutions' ? 'rotate-180 text-[#0B0F19]' : ''
                  }`}
                />
              </a>

              {activeDropdown === 'solutions' && (
                <div className="absolute top-[68px] left-0 w-[420px] bg-white rounded-[20px] shadow-2xl border border-[#EAEAEA] p-5 z-50 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
                  {solutions.map((item) => (
                    <Link
                      key={item.title}
                      to={item.path}
                      onClick={() => setActiveDropdown(null)}
                      className="p-2.5 rounded-[12px] hover:bg-[#F8FAFC] transition-colors group flex flex-col"
                    >
                      <span className="text-xs font-bold text-[#0B0F19] group-hover:text-[#1E40AF] transition-colors">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-[#64748B] mt-0.5 leading-snug">
                        {item.desc}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Industries Dropdown */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setActiveDropdown('industries')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a
                href="/#industries"
                className="text-[13px] font-semibold text-[#475569] hover:text-[#0B0F19] transition-colors inline-flex items-center gap-1.5 py-2"
              >
                <span>Industries</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#94A3B8] transition-transform duration-200 ${
                    activeDropdown === 'industries' ? 'rotate-180 text-[#0B0F19]' : ''
                  }`}
                />
              </a>

              {activeDropdown === 'industries' && (
                <div className="absolute top-[68px] left-0 w-[440px] bg-white rounded-[20px] shadow-2xl border border-[#EAEAEA] p-5 z-50 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
                  {industries.map((item) => (
                    <a
                      key={item.title}
                      href={item.path}
                      onClick={() => setActiveDropdown(null)}
                      className="p-2.5 rounded-[12px] hover:bg-[#F8FAFC] transition-colors group flex flex-col"
                    >
                      <span className="text-xs font-bold text-[#0B0F19] group-hover:text-[#1E40AF] transition-colors">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-[#64748B] mt-0.5 leading-snug">
                        {item.desc}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Links */}
            <Link
              to="/orders"
              className="text-[13px] font-semibold text-[#475569] hover:text-[#0B0F19] transition-colors py-2"
            >
              Orders
            </Link>

            <a
              href="/#contact"
              className="text-[13px] font-semibold text-[#475569] hover:text-[#0B0F19] transition-colors py-2"
            >
              Contact
            </a>

            <a
              href="/#about"
              className="text-[13px] font-semibold text-[#475569] hover:text-[#0B0F19] transition-colors py-2"
            >
              About us
            </a>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Search Trigger */}
            <div className="relative">
              {searchOpen ? (
                <form
                  onSubmit={handleSearchSubmit}
                  className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-white rounded-full border border-[#0B0F19] shadow-xl pl-3 pr-1 py-1 z-10 w-64 sm:w-72"
                >
                  <Search className="w-4 h-4 text-[#94A3B8] shrink-0" />
                  <input
                    type="text"
                    autoFocus
                    value={headerSearch}
                    onChange={(e) => setHeaderSearch(e.target.value)}
                    placeholder="Search chemical range..."
                    className="w-full text-xs text-[#0B0F19] px-2 py-1 outline-none bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="p-1 text-[#94A3B8] hover:text-[#0B0F19]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  aria-label="Open search"
                  className="p-2 text-[#0B0F19] hover:text-[#1E40AF] transition-colors focus-ring"
                >
                  <Search className="w-[18px] h-[18px]" />
                </button>
              )}
            </div>

            {/* User Account / Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-label="User account"
                  className="p-2 text-[#0B0F19] hover:text-[#1E40AF] transition-colors focus-ring cursor-pointer"
                >
                  <UserIcon className="w-[18px] h-[18px]" />
                </button>

                {userDropdownOpen && (
                  <div
                    onClick={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-[16px] shadow-2xl border border-[#EAEAEA] py-2 z-50 text-xs flex flex-col"
                  >
                    <div className="px-4 py-2.5 border-b border-[#EAEAEA]">
                      <div className="font-bold text-[#0B0F19] truncate">{currentUser?.name}</div>
                      <div className="text-[11px] text-[#94A3B8] truncate">{currentUser?.email}</div>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-[#0B0F19] hover:bg-[#F8FAFC] font-semibold"
                      >
                        <ShieldAlert className="w-4 h-4 text-[#1E40AF]" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <Link
                      to="/orders"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-[#475569] hover:bg-[#F8FAFC]"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Your Orders</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-[#DC2626] hover:bg-red-50 border-t border-[#EAEAEA] text-left font-semibold cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" aria-label="Sign in" className="p-2 text-[#0B0F19] hover:text-[#1E40AF] transition-colors">
                <UserIcon className="w-[18px] h-[18px]" />
              </Link>
            )}

            {/* Shopping Bag Button with count */}
            <button
              onClick={openCart}
              aria-label={`Open shopping bag with ${count} items`}
              className="relative p-2 text-[#0B0F19] hover:text-[#1E40AF] transition-colors focus-ring cursor-pointer"
            >
              <ShoppingBag className="w-[18px] h-[18px]" />
              {count > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-[16px] px-1 bg-[#0B0F19] text-white text-[9px] font-bold rounded-full flex items-center justify-center tabular-nums">
                  {count}
                </span>
              )}
            </button>

            {/* Get a Quote Pill Button */}
            <a
              href="/#contact"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-full border border-[#0B0F19] text-[#0B0F19] hover:bg-[#0B0F19] hover:text-white transition-all text-xs font-semibold tracking-wide"
            >
              Get a Quote
            </a>

            {/* Mobile Hamburger Menu button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile menu"
              className="lg:hidden p-2 text-[#0B0F19] hover:bg-[#F8FAFC] rounded-lg transition-colors focus-ring cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-in Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between p-6 z-10 overflow-y-auto">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#EAEAEA]">
                <Logo size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-[#94A3B8] hover:text-[#0B0F19]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-1 text-sm font-semibold text-[#0B0F19]">
                <Link
                  to="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-3 rounded-[8px] hover:bg-[#F8FAFC]"
                >
                  All Products
                </Link>

                <div className="pl-3 flex flex-col gap-1.5 py-1 border-l-2 border-[#EAEAEA] ml-2">
                  <Link
                    to="/products?category=Floor%20Cleaner"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs text-[#475569] py-1 hover:text-[#0B0F19]"
                  >
                    • Floor Cleaners
                  </Link>
                  <Link
                    to="/products?category=Dishwash%20Liquid"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs text-[#475569] py-1 hover:text-[#0B0F19]"
                  >
                    • Dishwash Liquid
                  </Link>
                  <Link
                    to="/products?category=Kitchen%20Degreaser"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs text-[#475569] py-1 hover:text-[#0B0F19]"
                  >
                    • Kitchen Degreasers
                  </Link>
                  <Link
                    to="/products?category=Fabric%20Wash"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs text-[#475569] py-1 hover:text-[#0B0F19]"
                  >
                    • Fabric Wash 5L
                  </Link>
                </div>

                <a
                  href="/#industries"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-3 rounded-[8px] hover:bg-[#F8FAFC]"
                >
                  Industries Served
                </a>

                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-3 rounded-[8px] hover:bg-[#F8FAFC]"
                >
                  Your Orders
                </Link>

                <a
                  href="/#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-3 rounded-[8px] hover:bg-[#F8FAFC]"
                >
                  Commercial Quotes
                </a>

                <a
                  href="/#about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-3 rounded-[8px] hover:bg-[#F8FAFC]"
                >
                  About CleanTec
                </a>
              </nav>

              <div className="pt-2 flex flex-col gap-2">
                <a
                  href="/#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full bg-[#0B0F19] text-white text-xs font-bold uppercase tracking-wider"
                >
                  Get a Quote
                </a>
              </div>
            </div>

            <div className="pt-6 border-t border-[#EAEAEA] flex flex-col gap-3">
              <a
                href="tel:8438244083"
                className="w-full flex items-center justify-center gap-2 h-11 bg-[#0B0F19] text-white rounded-full font-semibold text-xs uppercase tracking-wider"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#059669]" />
                <span>Call 8438244083</span>
              </a>
              <span className="text-center text-xs text-[#94A3B8]">
                Commercial Chemical Supply Desk
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
