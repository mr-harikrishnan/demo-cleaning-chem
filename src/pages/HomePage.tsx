import {
  ArrowRight,
  Award,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Droplets,
  HeartHandshake,
  Leaf,
  MapPin,
  PhoneCall,
  Play,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Truck
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ProductCard } from '../components/product/ProductCard';
import { useToast } from '../context/ToastContext';
import { contentService, productService } from '../services';
import { Product, SiteContent } from '../types';

export const HomePage: React.FC = () => {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Accordion state for "Why CleanTec Professional"
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);

  // Enquiry form state
  const [enqName, setEnqName] = useState('');
  const [enqPhone, setEnqPhone] = useState('');
  const [enqFacilityType, setEnqFacilityType] = useState('Hotel / Resort');
  const [enqRequirement, setEnqRequirement] = useState('');
  const [enqSubmitting, setEnqSubmitting] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [siteData, featured] = await Promise.all([
          contentService.getContent(),
          productService.getFeaturedProducts()
        ]);
        setContent(siteData);
        setFeaturedProducts(featured);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubmitting(true);
    setTimeout(() => {
      showToast('Thank you! You are now subscribed to commercial updates.', 'success');
      setNewsletterEmail('');
      setNewsletterSubmitting(false);
    }, 600);
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enqName || !enqPhone || !enqRequirement) {
      showToast('Please fill out all enquiry fields.', 'error');
      return;
    }

    setEnqSubmitting(true);
    try {
      const fullRequirement = `[Facility Type: ${enqFacilityType}] ${enqRequirement}`;
      await contentService.submitEnquiry(enqName, enqPhone, fullRequirement);
      showToast('Quote enquiry received. Our commercial supply team will contact you shortly.', 'success');
      setEnqName('');
      setEnqPhone('');
      setEnqRequirement('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to submit enquiry.';
      showToast(msg, 'error');
    } finally {
      setEnqSubmitting(false);
    }
  };

  const accordionItems = [
    {
      title: 'Standardized Dilution Ratios',
      content:
        'Concentrated active chemistries with precise dosage markers, reducing per-room cleaning overheads and preventing chemical waste across housekeeping shifts.'
    },
    {
      title: 'Fixture & Sanitaryware Safe',
      content:
        'Non-abrasive, neutral-pH formulations engineered to preserve luxury hotel chrome faucets, marble floors, vitrified wall tiles, and guest linens from corrosion.'
    },
    {
      title: 'Scheduled Bulk Delivery Across Tamil Nadu',
      content:
        'Direct supply desk dispatching recurring monthly consignments to Chennai, Coimbatore, Madurai, Trichy, and Salem with transparent commercial invoices.'
    }
  ];

  return (
    <div className="w-full flex flex-col bg-white text-[#0B0F19]">
      {/* 1. HERO BANNER SECTION (Matching Reference Sky-Blue Banner) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 w-full">
        <div className="rounded-[28px] sm:rounded-[36px] overflow-hidden relative bg-gradient-to-r from-[#BAE6FD] via-[#D0EFFE] to-[#EBF7FF] border border-[#BCE4F7]/60 p-8 sm:p-12 lg:p-16 flex flex-col justify-center min-h-[460px] lg:min-h-[520px]">
          {/* Subtle background ambient bubbles */}
          <div className="absolute top-6 left-12 w-32 h-32 rounded-full bg-white/20 blur-xl pointer-events-none" />
          <div className="absolute bottom-8 right-1/3 w-48 h-48 rounded-full bg-[#38BDF8]/10 blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] leading-[1.06] font-extrabold text-[#0B0F19] tracking-[-0.03em]">
                Pure Formulations <br className="hidden sm:inline" />
                For Spotless Stays
              </h1>

              <p className="mt-5 text-sm sm:text-base text-[#334155] leading-relaxed max-w-[52ch]">
                Discover premium commercial cleaning and hygiene chemicals crafted with active formulations. Engineered for hotels, restaurants, healthcare, and spotless facility care.
              </p>

              <div className="mt-8 flex items-center gap-4">
                <a
                  href="#bestsellers"
                  className="rounded-full bg-[#0B0F19] text-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-[#1E293B] shadow-md transition-all hover:scale-[1.02] active:scale-95"
                >
                  Explore Collection
                </a>

                <a
                  href="#contact"
                  className="rounded-full bg-white/80 border border-[#0B0F19]/20 text-[#0B0F19] px-6 py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-white shadow-sm transition-all"
                >
                  Get a Quote
                </a>
              </div>
            </div>

            {/* Right Product Composition Column */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-full max-w-[420px] aspect-[4/3] rounded-[24px] overflow-hidden shadow-lg border border-white/50 bg-white/40">
                <img
                  src="/images/banners/hero-reference-duo.jpg"
                  alt="CleanTec Commercial Cleaning Bottles Lineup"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST INDICATORS STRIP (Circular Badges Matching Reference) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 w-full">
        <div className="py-6 border-y border-[#EAEAEA] grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#D97706] shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-[#0B0F19]">
              Hospitality Formulations
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#D97706] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-[#0B0F19]">
              Trusted By 500+ Properties
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#D97706] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-[#0B0F19]">
              Safe & Surface Friendly
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#D97706] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-[#0B0F19]">
              Direct Concentrated Supply
            </span>
          </div>
        </div>
      </section>

      {/* 3. BEST SELLERS SECTION (Matching Reference 4-Card Row) */}
      <section id="bestsellers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B0F19] tracking-tight">
            Best Sellers
          </h2>

          <Link
            to="/products"
            className="rounded-full border border-[#0B0F19] text-[#0B0F19] px-6 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#0B0F19] hover:text-white transition-all"
          >
            Shop All
          </Link>
        </div>

        {/* 4 Cards Grid: 3 Products + 1 Editorial Teaser */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}

          {/* 4th Column Editorial Teaser matching reference */}
          <div className="bg-[#FAF8F5] rounded-[20px] border border-[#EFE9DD] p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#94A3B8] tracking-widest uppercase">
                01 / 10
              </span>
              <p className="mt-4 text-xs sm:text-sm text-[#475569] leading-relaxed">
                Standardized commercial chemistry formulated for luxury hotel suites, marble floors, and sparkling washroom presentations.
              </p>
            </div>

            <div className="pt-6 border-t border-[#EAEAEA] flex items-center justify-between">
              <span className="text-xs font-bold text-[#0B0F19]">More items</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/products')}
                  aria-label="Previous items"
                  className="w-8 h-8 rounded-full border border-[#CBD5E1] flex items-center justify-center text-[#0B0F19] hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/products')}
                  aria-label="Next items"
                  className="w-8 h-8 rounded-full bg-[#0B0F19] text-white flex items-center justify-center hover:bg-[#1E293B] transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. "POWERED BY CHEMISTRY" FORMULATION MATRIX (Beige Banner from Reference) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
        <div className="rounded-[24px] bg-[#FAF6EF] p-8 lg:p-10 border border-[#EFE9DD]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-4 flex flex-col">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B0F19] tracking-tight">
                Engineered By Science
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-[#64748B] leading-relaxed">
                We combine modern commercial chemical science with surface-safe active ingredients to deliver spotless results across hospitality spaces.
              </p>
            </div>

            {/* Right 4 Ingredients Cards */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-[16px] p-4 flex flex-col items-center text-center shadow-sm border border-[#F1ECE1]">
                <div className="w-12 h-12 rounded-full bg-[#FEF3C7] flex items-center justify-center mb-3 text-[#D97706]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-[#0B0F19] uppercase tracking-wide">
                  Lemon Actives
                </span>
                <span className="text-[10px] text-[#94A3B8] mt-1">Grease Cutting</span>
              </div>

              <div className="bg-white rounded-[16px] p-4 flex flex-col items-center text-center shadow-sm border border-[#F1ECE1]">
                <div className="w-12 h-12 rounded-full bg-[#FEF3C7] flex items-center justify-center mb-3 text-[#D97706]">
                  <Droplets className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-[#0B0F19] uppercase tracking-wide">
                  Neutral Surfactants
                </span>
                <span className="text-[10px] text-[#94A3B8] mt-1">Marble Safe</span>
              </div>

              <div className="bg-white rounded-[16px] p-4 flex flex-col items-center text-center shadow-sm border border-[#F1ECE1]">
                <div className="w-12 h-12 rounded-full bg-[#FEF3C7] flex items-center justify-center mb-3 text-[#D97706]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-[#0B0F19] uppercase tracking-wide">
                  Germicidal Quats
                </span>
                <span className="text-[10px] text-[#94A3B8] mt-1">99.9% Kill Rate</span>
              </div>

              <div className="bg-white rounded-[16px] p-4 flex flex-col items-center text-center shadow-sm border border-[#F1ECE1]">
                <div className="w-12 h-12 rounded-full bg-[#FEF3C7] flex items-center justify-center mb-3 text-[#D97706]">
                  <Leaf className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-[#0B0F19] uppercase tracking-wide">
                  Aqua Base
                </span>
                <span className="text-[10px] text-[#94A3B8] mt-1">Eco Balanced</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. "WHAT CUSTOMERS SAY" / REVIEWS ROW (Matching Reference Layout) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B0F19] tracking-tight">
            What clients say
          </h2>

          <div className="flex items-center gap-2">
            <div className="flex items-center text-[#F59E0B]">
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-semibold text-[#475569]">
              Trusted with 200+ Properties
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {/* Review Card 1 */}
          <div className="rounded-[20px] bg-gradient-to-b from-[#334155] to-[#1E293B] p-6 text-white flex flex-col justify-between min-h-[360px]">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                  AK
                </div>
                <div>
                  <h4 className="text-sm font-bold">Anand Kumar</h4>
                  <span className="text-[11px] text-white/60">Executive Housekeeper, Ocean Bay Resort</span>
                </div>
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                "CleanTec's Kleenol floor cleaner and glass spray completely streamlined our room turnaround times. The mirrors dry streak-free and the pleasant floral aroma leaves guests complimenting our rooms."
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1 text-[#F59E0B] mb-3">
                <Star className="w-3 h-3 fill-current" />
                <Star className="w-3 h-3 fill-current" />
                <Star className="w-3 h-3 fill-current" />
                <Star className="w-3 h-3 fill-current" />
                <Star className="w-3 h-3 fill-current" />
                <span className="text-[11px] text-white/80 font-bold ml-1">5.00</span>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-[11px] text-white/90 flex items-center justify-between">
                <span>Kleenol Floor Cleaner</span>
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              </div>
            </div>
          </div>

          {/* Video / Lifestyle Property Card with Play button */}
          <div className="rounded-[20px] overflow-hidden relative min-h-[360px] flex items-center justify-center group bg-[#0B0F19]">
            <img
              src="/images/banners/hero-reference-duo.jpg"
              alt="CleanTec Housekeeping In Action"
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10 w-14 h-14 rounded-full bg-white text-[#0B0F19] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
            <div className="absolute bottom-6 left-6 right-6 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-[11px] text-white/90 flex items-center justify-between">
              <span>Commercial Hotel Housekeeping Standard</span>
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            </div>
          </div>

          {/* Review Card 2 */}
          <div className="rounded-[20px] bg-gradient-to-b from-[#334155] to-[#1E293B] p-6 text-white flex flex-col justify-between min-h-[360px]">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                  SM
                </div>
                <div>
                  <h4 className="text-sm font-bold">Suresh Menok</h4>
                  <span className="text-[11px] text-white/60">Operations Lead, Sterling Corporate Tech Park</span>
                </div>
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                "We procure the 5L Rapid Wash and 5L Phenyl Disinfectant in bulk monthly. Zero supply delays, highly economical dilution ratios, and dependable direct factory service from Chennai."
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1 text-[#F59E0B] mb-3">
                <Star className="w-3 h-3 fill-current" />
                <Star className="w-3 h-3 fill-current" />
                <Star className="w-3 h-3 fill-current" />
                <Star className="w-3 h-3 fill-current" />
                <Star className="w-3 h-3 fill-current" />
                <span className="text-[11px] text-white/80 font-bold ml-1">5.00</span>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-[11px] text-white/90 flex items-center justify-between">
                <span>Rapid Wash 5L Concentrate</span>
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MID-PAGE FEATURE BANNER ("Why CleanTec Professional") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
        <div className="rounded-[28px] sm:rounded-[36px] overflow-hidden relative bg-gradient-to-r from-[#D7F0FA] to-[#C0E7F7] border border-[#BCE4F7]/60 p-8 sm:p-12 lg:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Accordion list */}
            <div className="lg:col-span-6 flex flex-col">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B0F19] tracking-tight">
                Why CleanTec Professional
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#475569] leading-relaxed max-w-md">
                Commercial formulations engineered for heavy footfall, zero surface degradation, and immaculate guest impression.
              </p>

              {/* Accordion list */}
              <div className="mt-6 flex flex-col divide-y divide-[#CBD5E1]">
                {accordionItems.map((item, idx) => (
                  <div key={idx} className="py-4">
                    <button
                      onClick={() => setOpenAccordion(openAccordion === idx ? null : idx)}
                      className="w-full flex items-center justify-between text-left font-bold text-sm text-[#0B0F19] hover:text-[#1E40AF] transition-colors"
                    >
                      <span>{item.title}</span>
                      <Plus
                        className={`w-4 h-4 transition-transform duration-200 ${
                          openAccordion === idx ? 'rotate-45' : ''
                        }`}
                      />
                    </button>
                    {openAccordion === idx && (
                      <p className="mt-2.5 text-xs text-[#475569] leading-relaxed">
                        {item.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: 4k Twin Bottle Studio Photo */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <div className="w-full max-w-[440px] aspect-[4/3] rounded-[24px] overflow-hidden shadow-lg border border-white/60 bg-white/40">
                <img
                  src="/images/banners/mid-feature-duo.jpg"
                  alt="CleanTec Professional Chemical Duo"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. "AS FEATURED IN" / INDUSTRY CLIENT SECTORS STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full text-center">
        <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider block mb-6">
          Supplying Commercial Facilities Across Tamil Nadu
        </span>
        <div className="py-4 px-6 rounded-[16px] bg-[#FAF8F5] border border-[#EFE9DD] flex flex-wrap items-center justify-around gap-6 text-xs font-bold text-[#64748B] uppercase tracking-widest">
          <span>Luxury Resorts</span>
          <span>•</span>
          <span>Metro Hospitals</span>
          <span>•</span>
          <span>Corporate Tech Parks</span>
          <span>•</span>
          <span>Commercial Kitchens</span>
          <span>•</span>
          <span>Educational Campuses</span>
        </div>
      </section>

      {/* 8. "DISCOVER THE SCIENCE" / EDITORIAL HOSPITALITY ARTICLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B0F19] tracking-tight">
              Discover the science
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#64748B]">
              Formulation guides and professional housekeeping best practices for facility managers.
            </p>
          </div>

          <Link
            to="/products"
            className="rounded-full border border-[#0B0F19] text-[#0B0F19] px-6 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#0B0F19] hover:text-white transition-all hidden sm:inline-block"
          >
            Read All Guides
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <div className="aspect-[16/10] rounded-[16px] overflow-hidden bg-[#F8FAFC] border border-[#EAEAEA] mb-4">
              <img
                src="/images/banners/hero-reference-duo.jpg"
                alt="Housekeeping Dilution Ratios"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="text-[11px] text-[#94A3B8] font-medium">15 January, 2026</span>
            <h3 className="text-base font-bold text-[#0B0F19] mt-1 leading-snug">
              Optimal Dilution Ratios for Marble & Granite Hotel Foyers
            </h3>
            <p className="mt-2 text-xs text-[#64748B] leading-relaxed line-clamp-2">
              How neutral pH floor detergents eliminate ground-in grime without degrading natural stone sealant or creating slippery residue.
            </p>
            <div className="mt-3 text-xs font-bold text-[#0B0F19] flex items-center gap-1 hover:underline cursor-pointer">
              <span>Read Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="aspect-[16/10] rounded-[16px] overflow-hidden bg-[#F8FAFC] border border-[#EAEAEA] mb-4">
              <img
                src="/images/banners/mid-feature-duo.jpg"
                alt="Commercial Kitchen Degreasing"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="text-[11px] text-[#94A3B8] font-medium">10 January, 2026</span>
            <h3 className="text-base font-bold text-[#0B0F19] mt-1 leading-snug">
              Commercial Kitchen Degreasing: Safety & Active Contact Times
            </h3>
            <p className="mt-2 text-xs text-[#64748B] leading-relaxed line-clamp-2">
              Breaking down stubborn carbonized fats on exhaust hoods and grills using surface-safe chemical foaming techniques.
            </p>
            <div className="mt-3 text-xs font-bold text-[#0B0F19] flex items-center gap-1 hover:underline cursor-pointer">
              <span>Read Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="aspect-[16/10] rounded-[16px] overflow-hidden bg-[#F8FAFC] border border-[#EAEAEA] mb-4">
              <img
                src="/images/banners/prefooter-cta-banner.jpg"
                alt="Linen Preservation"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="text-[11px] text-[#94A3B8] font-medium">05 January, 2026</span>
            <h3 className="text-base font-bold text-[#0B0F19] mt-1 leading-snug">
              Preserving White Linens & Towels in High-Turnaround Laundries
            </h3>
            <p className="mt-2 text-xs text-[#64748B] leading-relaxed line-clamp-2">
              Formulation secrets behind retaining fabric tensile softness, bright whites, and subtle lingering freshness across 100+ washes.
            </p>
            <div className="mt-3 text-xs font-bold text-[#0B0F19] flex items-center gap-1 hover:underline cursor-pointer">
              <span>Read Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* 9. PRE-FOOTER CTA BANNER (Matching Reference Bottom Banner) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
        <div className="rounded-[28px] sm:rounded-[36px] overflow-hidden relative bg-gradient-to-r from-[#C2EDFD] via-[#D1F3F9] to-[#D5F5E3] border border-[#BCE4F7]/50 p-8 sm:p-12 lg:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Center Content */}
            <div className="lg:col-span-8 flex flex-col items-start">
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] leading-tight font-extrabold text-[#0B0F19] tracking-tight">
                Start Your Facility <br className="hidden sm:inline" />
                Hygiene Transformation Today
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-[#475569] leading-relaxed max-w-lg">
                Experience institutional-grade hygiene products designed to keep your spaces immaculate, fresh, and welcoming for guests and staff.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="#contact"
                  className="rounded-full bg-[#0B0F19] text-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-[#1E293B] shadow-md transition-all"
                >
                  Request a Quote
                </a>
                <a
                  href={`tel:${content?.phone || '8438244083'}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#0B0F19] hover:underline px-3 py-2"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#059669]" />
                  <span>Call {content?.phone || '8438244083'}</span>
                </a>
              </div>
            </div>

            {/* Right Product Composition */}
            <div className="lg:col-span-4 flex items-center justify-center">
              <div className="w-full max-w-[340px] aspect-[4/3] rounded-[20px] overflow-hidden shadow-md border border-white/60 bg-white/40">
                <img
                  src="/images/banners/prefooter-cta-banner.jpg"
                  alt="CleanTec Home Care Kit"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. B2B QUOTE & DIRECT ENQUIRY FORM */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
        <div className="rounded-[28px] bg-[#FAF8F5] border border-[#EFE9DD] p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Contact Details */}
            <div className="lg:col-span-5 flex flex-col">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D97706]">
                Direct Commercial Supply Desk
              </span>
              <h3 className="text-3xl font-extrabold text-[#0B0F19] mt-2 tracking-tight">
                For Enquiries & Bulk Orders
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Connect directly with our Chennai chemical supply desk for recurring monthly replenishment schedules and customized institutional volume pricing.
              </p>

              {/* Direct Telephone */}
              <div className="mt-6 flex flex-col gap-1">
                <span className="text-xs text-[#94A3B8] font-semibold uppercase">Telephone & WhatsApp</span>
                <a
                  href={`tel:${content?.phone || '8438244083'}`}
                  className="text-3xl sm:text-4xl font-extrabold text-[#0B0F19] hover:text-[#1E40AF] transition-colors inline-flex items-center gap-3"
                >
                  <PhoneCall className="w-7 h-7 text-[#059669]" />
                  <span>{content?.phone || '8438244083'}</span>
                </a>
              </div>

              {/* Verified Physical Address */}
              <div className="mt-6 pt-6 border-t border-[#EAEAEA] flex items-start gap-3 text-xs text-[#475569]">
                <MapPin className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#0B0F19] block">CleanTec Facility Address:</span>
                  <span>{content?.address || 'No: 10, Sannathi Street, Thiruverkadu, Chennai - 600 077.'}</span>
                </div>
              </div>
            </div>

            {/* Right Quote Request Form */}
            <div className="lg:col-span-7 bg-white rounded-[20px] border border-[#EAEAEA] p-6 sm:p-8 shadow-sm">
              <h4 className="text-lg font-bold text-[#0B0F19]">Request Commercial Quote</h4>
              <p className="text-xs text-[#64748B] mt-1">
                Provide your facility details below. Our team responds within 2 business hours.
              </p>

              <form onSubmit={handleEnquirySubmit} className="mt-6 flex flex-col gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#0B0F19] uppercase block mb-1">
                    Facility / Contact Person
                  </label>
                  <input
                    type="text"
                    required
                    value={enqName}
                    onChange={(e) => setEnqName(e.target.value)}
                    placeholder="e.g. Ocean Bay Resort / Anand Sharma"
                    className="w-full h-11 px-3.5 bg-white text-xs rounded-full border border-[#CBD5E1] focus:border-[#0B0F19] focus-ring"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#0B0F19] uppercase block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={enqPhone}
                      onChange={(e) => setEnqPhone(e.target.value)}
                      placeholder="e.g. 9840123456"
                      className="w-full h-11 px-3.5 bg-white text-xs rounded-full border border-[#CBD5E1] focus:border-[#0B0F19] focus-ring"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#0B0F19] uppercase block mb-1">
                      Facility Sector
                    </label>
                    <select
                      value={enqFacilityType}
                      onChange={(e) => setEnqFacilityType(e.target.value)}
                      className="w-full h-11 px-3.5 bg-white text-xs rounded-full border border-[#CBD5E1] focus:border-[#0B0F19] focus-ring text-[#0B0F19]"
                    >
                      <option value="Hotel / Resort">Hotel / Resort</option>
                      <option value="Hospital / Healthcare">Hospital / Healthcare</option>
                      <option value="Commercial Kitchen">Commercial Kitchen</option>
                      <option value="Corporate Office">Corporate Office</option>
                      <option value="Facility Agency">Facility Management</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#0B0F19] uppercase block mb-1">
                    Requirement & Quantities
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={enqRequirement}
                    onChange={(e) => setEnqRequirement(e.target.value)}
                    placeholder="e.g. 50 cans of 5L Fabric Wash, 30 bottles of Toilet Cleaner, 20 bottles of Kleenol Floor Cleaner."
                    className="w-full p-3 bg-white text-xs rounded-[16px] border border-[#CBD5E1] focus:border-[#0B0F19] focus-ring"
                  />
                </div>

                <button
                  type="submit"
                  disabled={enqSubmitting}
                  className="rounded-full bg-[#0B0F19] text-white py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-[#1E293B] shadow-md transition-all cursor-pointer mt-2 disabled:opacity-50"
                >
                  {enqSubmitting ? 'Sending Request...' : 'Submit Commercial Quote Request'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 11. NEWSLETTER STRIP (Black Strip Matching Reference) */}
      <section className="bg-[#0B0F19] text-white py-14 border-b border-white/10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Headline */}
            <div className="lg:col-span-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Subscribe <br />
                to our newsletter
              </h2>
            </div>

            {/* Right Input with Pill Button */}
            <div className="lg:col-span-6 flex flex-col items-start lg:items-end">
              <span className="text-xs text-white/60 mb-2">
                Get monthly bulk chemical promotions and dilution guides
              </span>
              <form
                onSubmit={handleNewsletterSubmit}
                className="w-full max-w-md flex items-center bg-white rounded-full p-1"
              >
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your commercial email..."
                  className="w-full text-xs text-[#0B0F19] px-4 py-2 outline-none bg-transparent"
                />
                <button
                  type="submit"
                  disabled={newsletterSubmitting}
                  className="rounded-full bg-[#0B0F19] text-white px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#1E293B] shrink-0 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>Subscribe</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
