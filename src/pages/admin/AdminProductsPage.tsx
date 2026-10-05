import {
  Check,
  Edit,
  Eye,
  Plus,
  Power,
  Trash2,
  Upload
} from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { DataTable } from '../../components/common/DataTable';
import { Drawer } from '../../components/common/Drawer';
import { Input } from '../../components/common/Input';
import { StatusText } from '../../components/common/StatusText';
import { useToast } from '../../context/ToastContext';
import { useProducts } from '../../hooks/useProducts';
import { productService } from '../../services';
import { Product, ProductCategory } from '../../types';
import { formatCurrency } from '../../utils/formatters';

export const AdminProductsPage: React.FC = () => {
  const {
    products,
    total,
    page,
    limit,
    isInitialLoad,
    isLoading,
    setPage,
    setSearch,
    setCategory,
    setLimit,
    refresh
  } = useProducts({ limit: 12, activeOnly: false });

  const { showToast } = useToast();

  // Drawer Form State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [category, setCategoryField] = useState<ProductCategory>('Dishwash Liquid');
  const [packSize, setPackSize] = useState('500 ml');
  const [price, setPrice] = useState<number>(180);
  const [compareAtPrice, setCompareAtPrice] = useState<number | undefined>(220);
  const [sku, setSku] = useState('CT-PROD-001');
  const [stock, setStock] = useState<number>(100);
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [featuresText, setFeaturesText] = useState('Removes Grease, Shines Brighter');
  const [suitableText, setSuitableText] = useState('Hotels, Restaurants, Commercial Facilities');
  const [imagePath, setImagePath] = useState('/images/products/kleeny-dish-wash-lemon-power.svg');
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Delete Confirmation State
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const categories: ProductCategory[] = [
    'Dishwash Liquid',
    'Toilet Cleaner',
    'Glass Cleaner',
    'Floor Cleaner',
    'Kitchen Degreaser',
    'Room Freshener',
    'Fabric Wash',
    'Disinfectant',
    'Tile & Surface Cleaner'
  ];

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setName('');
    setCategoryField('Dishwash Liquid');
    setPackSize('500 ml');
    setPrice(180);
    setCompareAtPrice(220);
    setSku(`CT-SKU-${Math.floor(100 + Math.random() * 900)}`);
    setStock(100);
    setShortDesc('Professional hospitality-grade chemical formulation.');
    setDescription('High performance active cleaning liquid engineered for commercial and hotel operations.');
    setFeaturesText('Deep Dirt Removal, Commercial Strength');
    setSuitableText('Hotels, Resorts, Hospitals, Offices');
    setImagePath('/images/products/kleeny-dish-wash-lemon-power.svg');
    setIsActive(true);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCategoryField(p.category);
    setPackSize(p.packSize);
    setPrice(p.price);
    setCompareAtPrice(p.compareAtPrice);
    setSku(p.sku);
    setStock(p.stock);
    setShortDesc(p.shortDescription);
    setDescription(p.description);
    setFeaturesText(p.features.join(', '));
    setSuitableText(p.suitableFor.join(', '));
    setImagePath(p.image);
    setIsActive(p.isActive);
    setIsDrawerOpen(true);
  };

  // Image upload handler (stores as Data URL as required in Part H)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePath(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Product name is required.', 'error');
      return;
    }

    setIsSaving(true);
    const parsedFeatures = featuresText.split(',').map((f) => f.trim()).filter(Boolean);
    const parsedSuitable = suitableText.split(',').map((s) => s.trim()).filter(Boolean);

    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, {
          name,
          category,
          packSize,
          price: Number(price),
          compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
          sku,
          stock: Number(stock),
          shortDescription: shortDesc,
          description,
          features: parsedFeatures,
          suitableFor: parsedSuitable,
          image: imagePath,
          isActive
        });
        showToast('Product updated successfully.', 'success');
      } else {
        await productService.createProduct({
          name,
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          category,
          packSize,
          price: Number(price),
          compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
          sku,
          stock: Number(stock),
          shortDescription: shortDesc,
          description,
          features: parsedFeatures,
          suitableFor: parsedSuitable,
          image: imagePath,
          gallery: [imagePath],
          isActive,
          isFeatured: false
        });
        showToast('New product added to catalog.', 'success');
      }

      setIsDrawerOpen(false);
      refresh();
    } catch (err: unknown) {
      console.error('Save product error:', err);
      const msg = err instanceof Error ? err.message : 'Failed to save product.';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (p: Product) => {
    try {
      await productService.toggleProductStatus(p.id);
      showToast(`${p.name} status updated.`, 'info');
      refresh();
    } catch (err) {
      console.error('Toggle status error:', err);
      showToast('Unable to change status.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await productService.deleteProduct(productToDelete.id);
      showToast(`${productToDelete.name} deleted from catalog.`, 'info');
      setProductToDelete(null);
      refresh();
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Unable to delete product.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Product & SKU',
      render: (p: Product) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-12 rounded-[6px] bg-[#F7F9FC] border border-[#E6EAF2] p-1 flex items-center justify-center shrink-0">
            <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain" />
          </div>
          <div>
            <span className="font-bold text-[#0A1F5C] block">{p.name}</span>
            <span className="text-[11px] text-[#94A3B8]">
              {p.sku} • {p.packSize}
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
      render: (p: Product) => (
        <span className="text-xs font-semibold text-[#475569]">{p.category}</span>
      )
    },
    {
      key: 'price',
      header: 'Price',
      align: 'right' as const,
      render: (p: Product) => (
        <span className="font-bold tabular-nums text-[#0A1F5C]">
          {formatCurrency(p.price)}
        </span>
      )
    },
    {
      key: 'stock',
      header: 'Stock Qty',
      align: 'center' as const,
      render: (p: Product) => (
        <span className="text-xs font-bold tabular-nums text-[#0F172A]">{p.stock} units</span>
      )
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (p: Product) => (
        <StatusText
          status={p.isActive ? 'Active' : 'Inactive'}
          variant={p.isActive ? 'success' : 'error'}
        />
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right' as const,
      render: (p: Product) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => handleToggleStatus(p)}
            title={p.isActive ? 'Deactivate Product' : 'Activate Product'}
            className="p-1.5 rounded-[6px] hover:bg-[#EEF4FF] text-[#475569] hover:text-[#1F6FEB] transition-colors"
          >
            <Power className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenEdit(p)}
            title="Edit Product"
            className="p-1.5 rounded-[6px] hover:bg-[#EEF4FF] text-[#1F6FEB] transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setProductToDelete(p)}
            title="Delete Product"
            className="p-1.5 rounded-[6px] hover:bg-red-50 text-[#DC2626] transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0A1F5C]">Hospitality Product Catalog</h2>
          <p className="text-xs text-[#475569] mt-0.5">
            Manage commercial formulations, prices, pack sizes, inventory, and listings.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleOpenCreate}
        >
          Add New Product
        </Button>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={products}
        total={total}
        page={page}
        limit={limit}
        isInitialLoad={isInitialLoad}
        isLoading={isLoading}
        onPageChange={setPage}
        onLimitChange={setLimit}
        onSearchChange={setSearch}
        searchPlaceholder="Search product name, category, SKU..."
        rowKey={(p) => p.id}
        onRowClick={handleOpenEdit}
        filterSlot={
          <select
            onChange={(e) => setCategory(e.target.value === 'all' ? undefined : e.target.value)}
            className="h-11 px-3 bg-white border border-[#E6EAF2] rounded-[10px] text-xs font-semibold text-[#0A1F5C] focus-ring"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        }
      />

      {/* Right-Side Product CRUD Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingProduct ? 'Edit Commercial Product' : 'Add New Chemical Product'}
        subtitle="Saved changes reflect instantly across customer store"
        width="lg"
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveProduct}
              isLoading={isSaving}
            >
              {editingProduct ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSaveProduct} className="flex flex-col gap-5">
          <Input
            label="Product Title"
            required
            placeholder="e.g. Kleeny Dish Wash, Lemon Power"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#0A1F5C] block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategoryField(e.target.value as ProductCategory)}
                className="w-full h-11 px-3 bg-white border border-[#E6EAF2] rounded-[10px] text-xs font-semibold focus-ring"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Pack Size"
              required
              placeholder="e.g. 500 ml or 5 L"
              value={packSize}
              onChange={(e) => setPackSize(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="B2B Price (₹)"
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
            <Input
              label="MRP Compare Price (₹)"
              type="number"
              value={compareAtPrice || ''}
              onChange={(e) => setCompareAtPrice(e.target.value ? Number(e.target.value) : undefined)}
            />
            <Input
              label="Stock Available"
              type="number"
              required
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
            />
          </div>

          <Input
            label="SKU Code"
            required
            placeholder="e.g. CT-DW-001"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />

          {/* Image Upload / Data URL input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[#0A1F5C]">Product Image</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-20 rounded-[10px] bg-[#F7F9FC] border border-[#E6EAF2] p-1 flex items-center justify-center shrink-0">
                <img src={imagePath} alt="" className="max-h-full max-w-full object-contain" />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="text-xs text-[#475569] file:mr-3 file:py-1.5 file:px-3 file:rounded-[8px] file:border-0 file:text-xs file:font-semibold file:bg-[#EEF4FF] file:text-[#1F6FEB] hover:file:bg-[#1F6FEB] hover:file:text-white cursor-pointer"
                />
                <input
                  type="text"
                  value={imagePath}
                  onChange={(e) => setImagePath(e.target.value)}
                  placeholder="Or enter image URL / SVG path"
                  className="w-full h-9 px-3 text-xs bg-white border border-[#E6EAF2] rounded-[8px] focus-ring"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#0A1F5C] block mb-1">
              One-Line Short Description
            </label>
            <input
              type="text"
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              placeholder="e.g. Tough grease cutting formula with refreshing lemon fragrance."
              className="w-full h-11 px-3 bg-white border border-[#E6EAF2] rounded-[10px] text-xs focus-ring"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#0A1F5C] block mb-1">
              Full Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-white border border-[#E6EAF2] rounded-[10px] text-xs focus-ring"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#0A1F5C] block mb-1">
              Features (Comma separated)
            </label>
            <input
              type="text"
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              placeholder="e.g. Removes Grease, Shines Brighter"
              className="w-full h-11 px-3 bg-white border border-[#E6EAF2] rounded-[10px] text-xs focus-ring"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#0A1F5C] block mb-1">
              Suitable For Industries (Comma separated)
            </label>
            <input
              type="text"
              value={suitableText}
              onChange={(e) => setSuitableText(e.target.value)}
              placeholder="e.g. Hotels, Restaurants, Resorts, Offices"
              className="w-full h-11 px-3 bg-white border border-[#E6EAF2] rounded-[10px] text-xs focus-ring"
            />
          </div>

          {/* Active Switch */}
          <div className="pt-2 flex items-center justify-between border-t border-[#E6EAF2]">
            <span className="text-xs font-semibold text-[#0A1F5C]">Listing Status</span>
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-[#0A1F5C]">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-[#1F6FEB] focus:ring-0"
              />
              <span>Active in Customer Catalog</span>
            </label>
          </div>
        </form>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Product?"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action will remove it from the catalog.`}
        confirmText="Yes, Delete"
        isDanger={true}
        isLoading={isDeleting}
      />
    </div>
  );
};
