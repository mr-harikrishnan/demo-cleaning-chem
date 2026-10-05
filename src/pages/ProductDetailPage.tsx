import {
  ArrowLeft,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/common/Button";
import { StatusText } from "../components/common/StatusText";
import { ProductGrid } from "../components/product/ProductGrid";
import { useCart } from "../../src/context/CartContext";
import { productService } from "../services";
import { Product } from "../types";
import { formatCurrency } from "../utils/formatters";

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "description" | "features" | "suitable"
  >("description");
  const [loading, setLoading] = useState(true);

  const { addItem, openCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!id) return;

    setLoading(true);
    productService
      .getProductBySlug(id)
      .then(async (prod) => {
        if (!prod) {
          setProduct(null);
          return;
        }
        setProduct(prod);
        setSelectedImage(prod.image);

        // Fetch related products in the same category
        const all = await productService.getAllProducts();
        const related = all.filter(
          (p) => p.category === prod.category && p.id !== prod.id,
        );
        setRelatedProducts(related.slice(0, 4));
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 flex flex-col gap-8">
        <div className="h-6 w-48 shimmer bg-[#F1F4F9] rounded-[6px]" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-6 aspect-square shimmer bg-[#F1F4F9] rounded-[24px]" />
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="h-8 w-3/4 shimmer bg-[#F1F4F9] rounded-[6px]" />
            <div className="h-6 w-1/4 shimmer bg-[#F1F4F9] rounded-[6px]" />
            <div className="h-24 w-full shimmer bg-[#F1F4F9] rounded-[10px]" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-20 text-center">
        <Package className="w-16 h-16 text-[#94A3B8] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#0A1F5C]">Product Not Found</h2>
        <p className="mt-2 text-sm text-[#475569]">
          The product you are looking for does not exist or has been removed
          from our catalog.
        </p>
        <Link to="/products" className="inline-block mt-6">
          <Button variant="primary" icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Catalog
          </Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    navigate("/checkout");
  };

  return (
    <div className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#94A3B8] mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-[#0A1F5C] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            to="/products"
            className="hover:text-[#0A1F5C] transition-colors"
          >
            Products
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            to={`/products?category=${encodeURIComponent(product.category)}`}
            className="hover:text-[#0A1F5C] transition-colors"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-[#0A1F5C] truncate">
            {product.name}
          </span>
        </nav>

        {/* Top 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Big Image & Thumbnail Gallery (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="relative aspect-[4/5] sm:aspect-square w-full rounded-[24px] bg-[#F7F9FC] border border-[#E6EAF2] p-8 flex items-center justify-center overflow-hidden shadow-cleantec-sm">
              <div
                className="absolute inset-0 pointer-events-none opacity-60"
                style={{
                  background:
                    "radial-gradient(circle at 50% 60%, #EEF4FF 0%, transparent 70%)",
                }}
              />
              <img
                src={selectedImage || product.image}
                alt={product.name}
                className="relative z-10 max-h-full max-w-full object-contain drop-shadow-md"
              />
            </div>

            {/* Gallery Thumbnails */}
            {product.gallery && product.gallery.length > 1 && (
              <div className="flex items-center gap-3">
                {product.gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-[12px] p-1.5 bg-[#F7F9FC] border transition-all ${
                      selectedImage === img
                        ? "border-[#1F6FEB] shadow-cleantec-sm"
                        : "border-[#E6EAF2] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information, Pricing, Quantity & CTAs (6 cols) */}
          <div className="lg:col-span-6 flex flex-col">
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#12338F]">
              {product.category}
            </span>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0A1F5C] mt-2 leading-tight">
              {product.name}
            </h1>

            {/* SKU and Stock Row */}
            <div className="mt-3 flex items-center gap-4 text-xs">
              <span className="text-[#94A3B8]">SKU: {product.sku}</span>
              <span className="text-[#E6EAF2]">•</span>
              <StatusText
                status={
                  product.stock > 0
                    ? "In Stock (Commercial Ready)"
                    : "Out of Stock"
                }
                variant={product.stock > 0 ? "success" : "error"}
              />
            </div>

            {/* Price Box */}
            <div className="mt-6 p-4 rounded-[12px] bg-[#F7F9FC] border border-[#E6EAF2] flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[#0A1F5C] tabular-nums">
                {formatCurrency(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-base text-[#94A3B8] line-through tabular-nums">
                  {formatCurrency(product.compareAtPrice)}
                </span>
              )}
              <span className="text-xs text-[#475569] font-medium ml-auto">
                Pack Size:{" "}
                <strong className="text-[#0A1F5C]">{product.packSize}</strong>
              </span>
            </div>

            {/* Key Benefits Checklist */}
            <div className="mt-6 flex flex-col gap-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0A1F5C]">
                Key Formulation Benefits
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.features.map((feat) => (
                  <div
                    key={feat}
                    className="flex items-center gap-2 text-sm text-[#0F172A]"
                  >
                    <Check className="w-4 h-4 text-[#2E9B3E] shrink-0 stroke-[2.5]" />
                    <span className="font-semibold">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suitable For Industries List */}
            {product.suitableFor && product.suitableFor.length > 0 && (
              <div className="mt-6 flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0A1F5C]">
                  Recommended Application
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.suitableFor.map((ind) => (
                    <span
                      key={ind}
                      className="inline-flex items-center gap-1.5 text-xs text-[#475569] font-medium"
                    >
                      <Building2 className="w-3.5 h-3.5 text-[#1F6FEB]" />
                      <span>{ind}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Action Buttons */}
            <div className="mt-8 pt-6 border-t border-[#E6EAF2] flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* Stepper */}
              <div className="h-12 px-3 rounded-[10px] bg-[#F7F9FC] border border-[#E6EAF2] flex items-center justify-between gap-4 select-none w-full sm:w-36">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-[6px] bg-white text-[#0A1F5C] hover:bg-[#1F6FEB] hover:text-white transition-colors flex items-center justify-center font-bold text-sm shadow-sm"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold text-[#0A1F5C] tabular-nums text-sm">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-[6px] bg-white text-[#0A1F5C] hover:bg-[#1F6FEB] hover:text-white transition-colors flex items-center justify-center font-bold text-sm shadow-sm"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart */}
              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                icon={<ShoppingCart className="w-4 h-4" />}
                className="flex-1"
              >
                Add to Cart
              </Button>

              {/* Buy Now */}
              <Button
                variant="green"
                size="lg"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex-1"
              >
                Buy Now
              </Button>
            </div>

            {/* Commercial Assurance Notes */}
            <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-[#475569] bg-[#EEF4FF]/50 p-3.5 rounded-[12px] border border-[#1F6FEB]/10">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#1F6FEB] shrink-0" />
                <span>Bulk direct dispatch from Chennai</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2E9B3E] shrink-0" />
                <span>Commercial safety standard tested</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Section: Description | Features | Suitable For */}
        <div className="mt-20 pt-10 border-t border-[#E6EAF2]">
          <div className="flex items-center gap-8 border-b border-[#E6EAF2]">
            {(
              [
                { id: "description", label: "Detailed Description" },
                { id: "features", label: "Formulation Features" },
                { id: "suitable", label: "Target Facilities" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-sm font-bold transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-[#0A1F5C] after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#1F6FEB]'
                    : "text-[#94A3B8] hover:text-[#0A1F5C]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-8 max-w-3xl">
            {activeTab === "description" && (
              <div className="text-sm text-[#475569] leading-relaxed flex flex-col gap-4">
                <p>{product.description}</p>
                <p>
                  Packaged in standard institutional containers designed for
                  housekeeping trolley compatibility, easy dispensing, and safe
                  handling by hotel housekeeping staff.
                </p>
              </div>
            )}

            {activeTab === "features" && (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#0F172A]">
                {product.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2E9B3E]" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "suitable" && (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-[#475569]">
                  CleanTec {product.name} is recommended and formulated for
                  recurring commercial operations in:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm font-semibold text-[#0A1F5C]">
                  {product.suitableFor.map((ind) => (
                    <div key={ind} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1F6FEB]" />
                      <span>{ind}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#E6EAF2]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-[#0A1F5C]">
                Related {product.category} Solutions
              </h3>
              <Link
                to={`/products?category=${encodeURIComponent(product.category)}`}
                className="text-xs font-bold text-[#1F6FEB] hover:underline"
              >
                View all in {product.category}
              </Link>
            </div>
            <ProductGrid products={relatedProducts} skeletonCount={4} />
          </div>
        )}
      </div>
    </div>
  );
};
