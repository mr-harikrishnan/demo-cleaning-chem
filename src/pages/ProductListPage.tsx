import {
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
  PackageSearch,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { ProductGrid } from '../components/product/ProductGrid';
import { useProducts } from '../hooks/useProducts';
import { productService } from '../services';
import { Product, ProductCategory } from '../types';

export const ProductListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || undefined;
  const initialSearch = searchParams.get('search') || undefined;

  const {
    products,
    total,
    totalPages,
    page,
    limit,
    options,
    isInitialLoad,
    isLoading,
    setPage,
    setSearch,
    setCategory,
    setSortBy,
    setPriceRange
  } = useProducts({
    category: initialCategory,
    search: initialSearch,
    limit: 12
  });

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(initialSearch || '');
  const [tempMinPrice, setTempMinPrice] = useState<string>('');
  const [tempMaxPrice, setTempMaxPrice] = useState<string>('');

  useEffect(() => {
    productService.getAllProducts().then((res) => setAllProducts(res));
  }, []);

  // Sync category or search if URL changes
  useEffect(() => {
    const cat = searchParams.get('category') || undefined;
    const q = searchParams.get('search') || undefined;
    if (cat !== options.category) {
      setCategory(cat);
    }
    if (q !== options.search) {
      setSearch(q || '');
      setSearchInput(q || '');
    }
  }, [searchParams]);

  const categories: ProductCategory[] = [
    'Floor Cleaner',
    'Dishwash Liquid',
    'Toilet Cleaner',
    'Glass Cleaner',
    'Kitchen Degreaser',
    'Room Freshener',
    'Fabric Wash',
    'Disinfectant',
    'Tile & Surface Cleaner'
  ];

  const pricePresets = [
    { label: 'All Prices', min: undefined, max: undefined },
    { label: 'Under ₹150', min: 0, max: 150 },
    { label: '₹150 - ₹300', min: 150, max: 300 },
    { label: '₹300 - ₹500', min: 300, max: 500 },
    { label: 'Above ₹500', min: 500, max: undefined }
  ];

  const handleCategorySelect = (catName?: string) => {
    if (catName) {
      searchParams.set('category', catName);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
    setCategory(catName);
    setMobileFilterOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      searchParams.set('search', searchInput.trim());
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
    setSearch(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput('');
    searchParams.delete('search');
    setSearchParams(searchParams);
    setSearch('');
  };

  const handlePricePreset = (min?: number, max?: number) => {
    setTempMinPrice(min !== undefined ? String(min) : '');
    setTempMaxPrice(max !== undefined ? String(max) : '');
    setPriceRange(min, max);
    setMobileFilterOpen(false);
  };

  const handlePriceApply = () => {
    const min = tempMinPrice ? Number(tempMinPrice) : undefined;
    const max = tempMaxPrice ? Number(tempMaxPrice) : undefined;
    setPriceRange(min, max);
    setMobileFilterOpen(false);
  };

  const handleResetFilters = () => {
    setSearchParams({});
    setCategory(undefined);
    setSearch('');
    setSearchInput('');
    setPriceRange(undefined, undefined);
    setTempMinPrice('');
    setTempMaxPrice('');
  };

  const hasActiveFilters = Boolean(
    options.category || options.search || options.minPrice !== undefined || options.maxPrice !== undefined
  );

  const filterSidebar = (
    <div className="flex flex-col gap-6">
      {/* Category Filter */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B0F19]">
            Categories
          </h4>
          <span className="text-[11px] text-[#64748B] font-medium">
            {categories.length} segments
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <button
            onClick={() => handleCategorySelect(undefined)}
            className={`flex items-center justify-between px-3 py-2 rounded-[10px] text-xs font-semibold transition-all cursor-pointer ${
              !options.category
                ? 'bg-[#0B0F19] text-white shadow-sm'
                : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0B0F19]'
            }`}
          >
            <span>All Formulations</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold tabular-nums ${
                !options.category ? 'bg-white/20 text-white' : 'bg-[#E2E8F0] text-[#475569]'
              }`}
            >
              {allProducts.length}
            </span>
          </button>

          {categories.map((cat) => {
            const count = allProducts.filter((p) => p.category === cat).length;
            const isSelected = options.category?.toLowerCase() === cat.toLowerCase();

            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`flex items-center justify-between px-3 py-2 rounded-[10px] text-xs font-semibold transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'bg-[#0B0F19] text-white shadow-sm'
                    : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0B0F19]'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold tabular-nums ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#E2E8F0] text-[#475569]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Quick Presets */}
      <div className="pt-5 border-t border-[#E6EAF2] flex flex-col gap-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B0F19]">
          Quick Price Range
        </h4>
        <div className="flex flex-col gap-1.5">
          {pricePresets.map((preset, idx) => {
            const isCurrentPreset =
              options.minPrice === preset.min && options.maxPrice === preset.max;
            return (
              <button
                key={idx}
                onClick={() => handlePricePreset(preset.min, preset.max)}
                className={`flex items-center justify-between px-3 py-1.5 rounded-[8px] text-xs font-medium transition-colors text-left cursor-pointer ${
                  isCurrentPreset
                    ? 'bg-[#EEF2F6] text-[#0B0F19] font-bold border border-[#CBD5E1]'
                    : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0B0F19]'
                }`}
              >
                <span>{preset.label}</span>
                {isCurrentPreset && <Check className="w-3.5 h-3.5 text-[#0B0F19]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Price Range Filter */}
      <div className="pt-5 border-t border-[#E6EAF2] flex flex-col gap-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B0F19]">
          Custom Range (₹)
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min ₹"
            value={tempMinPrice}
            onChange={(e) => setTempMinPrice(e.target.value)}
            className="h-9 px-3 text-xs bg-[#F8FAFC] rounded-[8px] border border-[#E6EAF2] focus:bg-white focus:border-[#0B0F19] outline-none"
          />
          <input
            type="number"
            placeholder="Max ₹"
            value={tempMaxPrice}
            onChange={(e) => setTempMaxPrice(e.target.value)}
            className="h-9 px-3 text-xs bg-[#F8FAFC] rounded-[8px] border border-[#E6EAF2] focus:bg-white focus:border-[#0B0F19] outline-none"
          />
        </div>
        <button
          onClick={handlePriceApply}
          className="w-full h-8 rounded-[8px] bg-[#0B0F19] text-white text-xs font-semibold hover:bg-[#1E293B] transition-colors cursor-pointer"
        >
          Apply Custom Price
        </button>
      </div>

      {/* Reset Filter Button */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-[#E6EAF2]">
          <button
            onClick={handleResetFilters}
            className="w-full py-2 px-3 rounded-[8px] text-xs font-semibold text-[#DC2626] bg-red-50 hover:bg-red-100 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="py-8 bg-white min-h-[85vh]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E6EAF2] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#64748B]">
              <span>CleanTec Commercial Solutions</span>
              <span>•</span>
              <span className="text-[#0B0F19]">Direct Supply Catalog</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B0F19] mt-1 tracking-tight">
              Commercial Cleaning Formulations & Concentrates
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#64748B] max-w-3xl leading-relaxed">
              Engineered active chemical cleaners and high-dilution sanitizers for hotels, restaurants, corporate offices, healthcare facilities, commercial properties, and cleaning contractors.
            </p>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center justify-center gap-2 h-10 px-4 rounded-[10px] border border-[#CBD5E1] bg-white text-xs font-bold text-[#0B0F19] shadow-sm"
          >
            <Filter className="w-3.5 h-3.5 text-[#0B0F19]" />
            <span>Filter Formulations ({total})</span>
          </button>
        </div>

        {/* 1-Click Horizontal Category Pills for quick navigation */}
        <div className="mb-6 overflow-x-auto pb-2 scrollbar-none flex items-center gap-2">
          <button
            onClick={() => handleCategorySelect(undefined)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              !options.category
                ? 'bg-[#0B0F19] text-white shadow-sm'
                : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] hover:text-[#0B0F19]'
            }`}
          >
            All Categories ({allProducts.length})
          </button>
          {categories.map((cat) => {
            const isSelected = options.category?.toLowerCase() === cat.toLowerCase();
            const count = allProducts.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#0B0F19] text-white shadow-sm'
                    : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] hover:text-[#0B0F19]'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-[#E2E8F0] text-[#64748B]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Left Filter Column (3 cols) */}
          <aside className="hidden lg:block lg:col-span-3 bg-white rounded-[16px] border border-[#E6EAF2] p-5 shadow-sm sticky top-24">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#F1F5F9] text-[#0B0F19] font-bold text-xs">
              <SlidersHorizontal className="w-4 h-4 text-[#0B0F19]" />
              <span>Catalog Filters</span>
            </div>
            {filterSidebar}
          </aside>

          {/* Product Grid Area (9 cols) */}
          <div className="lg:col-span-9 flex flex-col gap-5">
            {/* Top Toolbar: Search, Sort Dropdown & Result Count */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#F8FAFC] p-3 rounded-[12px] border border-[#E6EAF2]">
              {/* Live search input */}
              <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search chemicals by name, SKU..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full h-9 pl-9 pr-8 text-xs bg-white rounded-[8px] border border-[#E6EAF2] focus:border-[#0B0F19] outline-none"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0B0F19]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              {/* Sort Dropdown & Count */}
              <div className="flex items-center justify-between sm:justify-end gap-3">
                <div className="text-xs font-semibold text-[#64748B]">
                  <strong className="text-[#0B0F19]">{products.length}</strong> of{' '}
                  <strong className="text-[#0B0F19]">{total}</strong> products
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-[#94A3B8] hidden md:inline">Sort:</span>
                  <select
                    value={options.sortBy || 'newest'}
                    onChange={(e) =>
                      setSortBy(e.target.value as 'price-asc' | 'price-desc' | 'name-asc' | 'newest')
                    }
                    className="h-9 px-3 bg-white border border-[#CBD5E1] rounded-[8px] text-xs font-bold text-[#0B0F19] focus:border-[#0B0F19] outline-none cursor-pointer"
                  >
                    <option value="newest">Featured & Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Alphabetical (A - Z)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filter Badges */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-medium text-[#64748B]">Active filters:</span>
                {options.category && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EEF2F6] text-[#0B0F19] text-xs font-semibold">
                    Category: {options.category}
                    <button
                      onClick={() => handleCategorySelect(undefined)}
                      className="hover:text-[#DC2626] ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {options.search && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EEF2F6] text-[#0B0F19] text-xs font-semibold">
                    Search: "{options.search}"
                    <button onClick={handleClearSearch} className="hover:text-[#DC2626] ml-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {(options.minPrice !== undefined || options.maxPrice !== undefined) && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EEF2F6] text-[#0B0F19] text-xs font-semibold">
                    Price: ₹{options.minPrice || 0} - ₹{options.maxPrice || 'Any'}
                    <button
                      onClick={() => handlePricePreset(undefined, undefined)}
                      className="hover:text-[#DC2626] ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-[#DC2626] hover:underline font-semibold ml-1 cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Products Grid or Empty State */}
            {products.length === 0 && !isInitialLoad && !isLoading ? (
              <EmptyState
                icon={<PackageSearch className="w-8 h-8" />}
                title="No chemical products match your filter criteria"
                description="We couldn't find any formulations matching your selected category, price range, or search term."
                actionText="Reset All Filters"
                onAction={handleResetFilters}
              />
            ) : (
              <ProductGrid
                products={products}
                isLoading={isInitialLoad || isLoading}
                skeletonCount={limit}
                columns={3}
              />
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 pt-6 border-t border-[#E6EAF2] flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  icon={<ChevronLeft className="w-4 h-4" />}
                >
                  Previous
                </Button>

                <span className="px-4 py-1.5 text-xs font-bold text-[#0B0F19] bg-[#F1F5F9] rounded-[8px]">
                  Page {page} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  icon={<ChevronRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between p-6 z-10 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E6EAF2] mb-6">
                <h3 className="text-base font-bold text-[#0B0F19]">Filter Formulations</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-[#94A3B8] hover:text-[#0B0F19]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {filterSidebar}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
