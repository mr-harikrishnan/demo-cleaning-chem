import {
  ArrowDown,
  ArrowUp,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MoveLeft,
  MoveRight,
  Plus,
  Trash2
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { contentService, productService } from '../../services';
import { Product } from '../../types';

export const AdminLandingPage: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [featuredIds, setFeaturedIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    Promise.all([
      productService.getAllProducts(),
      contentService.getLandingSettings()
    ]).then(([prods, settings]) => {
      setAllProducts(prods);
      setFeaturedIds(settings.featuredProductIds || []);
    });
  }, []);

  const productMap = new Map(allProducts.map((p) => [p.id, p]));

  // Selected products in order
  const selectedProducts = featuredIds
    .map((id) => productMap.get(id))
    .filter((p): p is Product => Boolean(p));

  // Available products (not selected)
  const availableProducts = allProducts.filter((p) => !featuredIds.includes(p.id));

  const handleAdd = (id: string) => {
    if (featuredIds.length >= 8) {
      showToast('Maximum 8 featured products allowed on landing page.', 'error');
      return;
    }
    setFeaturedIds([...featuredIds, id]);
  };

  const handleRemove = (id: string) => {
    setFeaturedIds(featuredIds.filter((item) => item !== id));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const next = [...featuredIds];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    setFeaturedIds(next);
  };

  const handleMoveDown = (index: number) => {
    if (index === featuredIds.length - 1) return;
    const next = [...featuredIds];
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    setFeaturedIds(next);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await contentService.updateFeaturedProducts(featuredIds);
      showToast('Landing page featured products updated!', 'success');
    } catch (err: unknown) {
      console.error('Save featured error:', err);
      const msg = err instanceof Error ? err.message : 'Failed to save landing settings.';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0A1F5C]">Featured Products Showcase</h2>
          <p className="text-xs text-[#475569] mt-0.5">
            Configure the 8 featured chemical products displayed on the homepage.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleSave}
          isLoading={isSaving}
          icon={<Check className="w-4 h-4" />}
        >
          Save Showcase Order
        </Button>
      </div>

      {/* Two Lists: Available vs Selected */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Available Products (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-[16px] border border-[#E6EAF2] p-5 shadow-cleantec-sm flex flex-col gap-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6EAF2]">
            <h3 className="text-sm font-bold text-[#0A1F5C]">
              Available Products ({availableProducts.length})
            </h3>
            <span className="text-[11px] text-[#94A3B8]">Click + to add</span>
          </div>

          <div className="divide-y divide-[#E6EAF2] max-h-[500px] overflow-y-auto">
            {availableProducts.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#94A3B8]">
                All catalog products are currently selected.
              </div>
            ) : (
              availableProducts.map((p) => (
                <div key={p.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={p.image} alt="" className="w-8 h-10 object-contain shrink-0" />
                    <div className="min-w-0">
                      <span className="font-bold text-xs text-[#0A1F5C] truncate block">
                        {p.name}
                      </span>
                      <span className="text-[11px] text-[#94A3B8]">{p.category}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAdd(p.id)}
                    className="p-1.5 rounded-[6px] bg-[#EEF4FF] hover:bg-[#1F6FEB] text-[#1F6FEB] hover:text-white transition-colors cursor-pointer shrink-0"
                    title="Add to Featured"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Selected Products with Reordering (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-[16px] border border-[#E6EAF2] p-5 shadow-cleantec-sm flex flex-col gap-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6EAF2]">
            <div>
              <h3 className="text-sm font-bold text-[#0A1F5C]">
                Active Landing Selection ({featuredIds.length} / 8)
              </h3>
              <span className="text-[11px] text-[#94A3B8]">
                Reorder using arrows to change display sequence on homepage
              </span>
            </div>
            <span className="text-xs font-bold text-[#1F6FEB] bg-[#EEF4FF] px-2.5 py-1 rounded-[6px]">
              Max 8
            </span>
          </div>

          <div className="flex flex-col gap-2 min-h-[300px]">
            {selectedProducts.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#94A3B8]">
                No products selected yet. Add up to 8 products from the left.
              </div>
            ) : (
              selectedProducts.map((p, idx) => (
                <div
                  key={p.id}
                  className="p-3 rounded-[10px] bg-[#F8FAFC] border border-[#E6EAF2] flex items-center justify-between gap-3 hover:border-[#1F6FEB]/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 text-center font-extrabold text-xs text-[#1F6FEB] shrink-0 tabular-nums">
                      #{idx + 1}
                    </span>
                    <img src={p.image} alt="" className="w-8 h-10 object-contain shrink-0" />
                    <div className="min-w-0">
                      <span className="font-bold text-xs text-[#0A1F5C] truncate block">
                        {p.name}
                      </span>
                      <span className="text-[11px] text-[#94A3B8]">{p.category} • ₹{p.price}</span>
                    </div>
                  </div>

                  {/* Reorder and Delete Controls */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleMoveUp(idx)}
                      disabled={idx === 0}
                      className="p-1 text-[#475569] hover:text-[#0A1F5C] disabled:opacity-30 rounded-[4px] hover:bg-white"
                      title="Move Up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(idx)}
                      disabled={idx === selectedProducts.length - 1}
                      className="p-1 text-[#475569] hover:text-[#0A1F5C] disabled:opacity-30 rounded-[4px] hover:bg-white"
                      title="Move Down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemove(p.id)}
                      className="p-1 text-[#DC2626] hover:bg-red-50 rounded-[4px] ml-1"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
