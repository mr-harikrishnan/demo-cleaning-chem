Build a complete, premium-quality demo B2B e-commerce web application for "CleanTec Hospitality Chemicals" using React + TypeScript + Vite + React Router + Tailwind CSS + Lucide React. Use Local Storage for all persistence (no backend). The UI must look like a funded, design-led brand website, in the style of top modern SaaS and D2C sites (Stripe, Linear, Apple product pages, Shopify Dawn premium themes), not a basic template.

=====================================
PART A — COMPANY DETAILS (from the advertisement; do not invent conflicting info)
=====================================
Company: CleanTec Hospitality Chemicals (™)
Tagline: Cleaner Spaces | Happier Stays
Headline: Premium Cleaning Solutions for Hotels & Hospitality
Signature line: Clean Today, Better Tomorrow
Strapline: Complete Range of Cleaning Products for a Safer, Cleaner & More Refreshing Environment
Four brand promises (with icons: sparkles, shield-check, leaf, bed): Superior Cleaning | Safe & Effective | Eco Friendly | Ideal for Hospitality
Enquiries & Bulk Orders phone: 8438244083 (tel: link, WhatsApp-style call button)
Address: No: 10, Sannathi Street, Thiruverkadu, Chennai - 600 077.
Industries served: Hotels, Resorts, Hospitals, Offices, Schools, Restaurants, and more (add Hostels, Facility Management, Housekeeping Services, Commercial Facilities as target industries, never as fake customers).
Product categories (9): Dishwash Liquid, Toilet Cleaner, Glass Cleaner, Floor Cleaner, Kitchen Degreaser, Room Freshener, Fabric Wash, Disinfectant, Tile & Surface Cleaner.
Logo: water-drop + leaf + bed icon in navy/blue/green, "CleanTec" wordmark (Clean = navy, Tec = green), "HOSPITALITY CHEMICALS" in spaced capitals below. Recreate it as an SVG component or crop it from the ad.

Do NOT invent certifications, years of experience, customer logos, testimonials, lab reports, or technical specs.

=====================================
PART B — PRODUCT CATALOG (seed into Local Storage, all admin-editable)
=====================================
Each product: id, name, slug, category, shortDescription, description, packSize, price, compareAtPrice, sku, image (path), gallery[], features[], suitableFor[], stock, isActive, isFeatured, createdAt, updatedAt. Prices, pack sizes, SKU and stock are demo placeholders.

1. Kleeny Dish Wash, Lemon Power. Category: Dishwash Liquid. Yellow bottle with a lemon graphic. Features: Removes Grease, Shines Brighter.
2. Toilet Cleaner. Category: Toilet Cleaner. Navy bottle with a red cap. Features: Removes Stains, Kills Germs.
3. Glass Cleaner (bottle). Category: Glass Cleaner. Small blue bottle. Feature: Streak Free Shine.
4. Rapid Wash Fabric Wash, 5L. Category: Fabric Wash. Large blue jug with handle. Features: Long Lasting Freshness, Deep Cleaning Power, Care for Fabrics, Brighter Clothes.
5. Phenyl Disinfectant, 5L. Category: Disinfectant. Brown bottle with a green cap. Feature: Kills 99.9% Germs.
6. Tile & Surface Cleaner. Category: Tile & Surface Cleaner. White bottle with green label. Feature: Removes Dirt & Stains.
7. Glass Cleaner (spray). Category: Glass Cleaner. Blue trigger spray. Feature: Streak Free Shine.
8. Kleenol Floor Cleaner. Category: Floor Cleaner. Pink bottle. Feature: Long Lasting Fragrance.
9. Kitchen Degreaser (spray). Category: Kitchen Degreaser. Yellow trigger spray. Features: Tough on Grease, Gentle on Surfaces.
10. Room Freshener, Floral. Category: Room Freshener. Pink aerosol can.

Only use the claims above. For anything else, use neutral generic descriptions.

=====================================
PART C — DESIGN SYSTEM (follow exactly)
=====================================
THEME: Light / white only. No dark mode. Premium, airy, confident.

COLOR TOKENS (from the logo and ad)
- --navy-900: #0A1F5C (headings, footer, primary buttons)
- --navy-700: #12338F
- --blue-600: #1F6FEB (links, focus rings, active states)
- --blue-50: #EEF4FF (soft section tint)
- --green-600: #2E9B3E (success, eco, secondary CTA)
- --green-50: #EEF8F0
- --yellow-400: #FFC81E (used sparingly: phone number highlight, one small accent per page)
- --ink-900: #0F172A (body headings), --ink-600: #475569 (body text), --ink-400: #94A3B8 (muted)
- --line: #E6EAF2 (borders), --surface: #FFFFFF, --surface-alt: #F7F9FC
- Error #DC2626, Warning #D97706
Use navy for 70% of the colored UI, green for 20%, yellow for under 5%. Never use pure black. Never use random colors. Gradients: only an extremely subtle white→#F7F9FC section background or a soft radial blue glow (opacity under 8%) behind product images. No loud or multi-color gradients.

TYPOGRAPHY: ONE family only, "Plus Jakarta Sans" (Google Fonts, weights 400, 500, 600, 700, 800). Fallback: Inter, system-ui.
- Display (hero): 56/60 desktop, 40/44 tablet, 34/38 mobile, weight 800, letter-spacing -0.025em, navy-900
- H2 section title: 40/46 desktop, 30/36 mobile, weight 700, letter-spacing -0.02em
- H3: 24/32, weight 700. H4: 18/28, weight 600
- Body: 16/28, weight 400, ink-600. Small: 14/22. Caption/label: 12/16, weight 600, uppercase, tracking 0.08em (plain text, never a chip)
- Prices: tabular numerals, weight 700
- Max text width 62ch for paragraphs.

SPACING (8-pt grid): 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- Section vertical padding: 96px desktop, 72px tablet, 56px mobile
- Container max-width 1200px, side padding 24px (16px mobile)
- Grid gaps: 24px (cards), 32px (large columns)
- Generous whitespace between a section title and its content (48px)

RADIUS (consistent system)
- Buttons and inputs: 10px
- Cards, tables, panels: 16px
- Large media containers and the hero image panel: 24px
- Small elements (tooltips, checkboxes): 6px
- Never pill-shaped buttons, never fully rounded rectangles for text labels.

SHADOWS (soft, layered, low-opacity navy tint, never gray-black)
- sm: 0 1px 2px rgba(10,31,92,.06)
- md: 0 4px 16px rgba(10,31,92,.08)
- lg (hover): 0 16px 40px rgba(10,31,92,.12)
Cards: 1px border var(--line) + shadow-sm at rest, shadow-lg and translateY(-4px) on hover (200ms ease-out).

BUTTONS
- Primary: navy-900 background, white text, 48px height, 10px radius, weight 600, hover navy-700 + slight lift, active scale .98
- Secondary: white, 1px navy border, navy text
- Tertiary: text link with an arrow icon that slides 4px on hover
- Green CTA only for "Order" and "Add to Cart" success actions
- Visible focus ring: 2px blue-600 offset 2px.

NO CHIP UI RULE: no pill badges or tag backgrounds. For labels like "Eco Friendly" or "In Stock", use an icon + plain text, or a small colored dot + text. Status in tables: 8px dot + text label (green = paid/delivered, amber = pending, red = failed/cancelled, blue = confirmed/packed).

ICONS: Lucide, stroke 1.75, 20–24px, navy or blue. Industry and promise icons sit inside a 48px square with 12px radius and a blue-50 background.

MOTION (subtle and purposeful): fade-up on section scroll-in (16px, 400ms), card hover lift, button press, drawer slide 250ms, cart badge bump, toast slide. Respect prefers-reduced-motion. No parallax, no floating objects.

=====================================
PART D — PRODUCT CARD (the hero component, make it exceptional)
=====================================
Card: white, 1px --line border, 16px radius, hover lift + shadow-lg.
- Top: image area 4:5 ratio, background --surface-alt with a faint radial blue-50 glow behind the bottle, 24px padding, image object-contain, with a soft elliptical ground shadow under the bottle. On hover the bottle scales 1.05 and lifts 6px.
- Top-left corner: category in 12px uppercase label text (plain, no chip).
- Top-right: wishlist-style heart icon button (optional) or quick-view eye icon, visible on hover (always visible on mobile).
- Body (20px padding): product name (H4, navy-900, max 2 lines), one-line short description (ink-600, 14px), then a key-benefit line with a small green check icon, such as "Removes Grease".
- Meta row: pack size (e.g. "500 ml") on the left, stock status as dot + text on the right.
- Footer row, separated by a 1px divider: price on the left (20px bold, with a struck-through compareAtPrice in ink-400 if present, and "₹" formatted with Indian grouping), and a 44px "Add to Cart" icon+text button on the right. After clicking, it changes to a quantity stepper (− 1 +) in place.
- Entire card is clickable to the product page, but the Add button doesn't navigate.
- Skeleton loading state with a shimmer (white to gray-100, subtle).
- Grid: 4 columns desktop, 3 laptop, 2 tablet, 2 compact mobile (smaller padding), 1 column under 360px.

=====================================
PART E — IMAGE STRATEGY (important)
=====================================
- All images load from the product data's image paths (public/images/products/<slug>.png, plus gallery images). Never hardcode in components.
- I will supply 4K product images (3840×3840 PNG, transparent or pure white background, product centered with 10% padding, soft studio lighting, subtle floor reflection, the exact CleanTec label design from the attached advertisement). Create clean placeholders with the correct file names until I replace them: use the cropped bottles from the advertisement where possible, then generate SVG fallback placeholders showing the product name on a neutral tile.
- Use <img> with width/height, loading="lazy", decoding="async", srcset when several sizes exist, and a fallback onError image.
- Hero: a large composition of the full product range (the lineup image from the ad, background removed) standing on a soft white-blue surface, in a 24px-radius panel. Do not use the ad as a full-bleed background.
- Industry sections use clean line icons, not stock photos.

=====================================
PART F — LANDING PAGE (premium story flow)
=====================================
Sticky header: white with 80% opacity plus a subtle blur on scroll (optional), 72px height, logo left, nav (Home, Products, Industries, Contact), right side: search icon, cart icon with badge count, Login/Account, and a navy "Bulk Orders" button. Mobile: hamburger opens a slide-in drawer.

1. HERO (two columns, 12-col grid): left column has a small green-icon eyebrow line "Cleaner Spaces | Happier Stays", display headline "Premium Cleaning Solutions for Hospitality & Professional Spaces", a short paragraph, CTAs [View Products] (primary) and [Call 8438244083] (secondary), then a 4-item row with the brand promises (icon + label, divider lines between). Right column shows the product lineup in a 24px-radius panel with a soft blue-50 background and a floating small info line "Complete range for a safer, cleaner & more refreshing environment" (plain text card, no chip). A thin line "Hotels | Resorts | Hospitals | Offices | Schools | Restaurants" sits under the hero.
2. WHO WE ARE: 2 columns. Left has the title and 2 paragraphs of honest positioning; right has 3 simple facts (Professional range, Hospitality focused, Convenient ordering), big icon, short text, divider lines.
3. WHO WE SERVE: 5 × 2 grid of industries, each with an icon square, heading, one-line use case, and a subtle hover border color change.
4. PRODUCT RANGE: heading with a "View All Products" link on the right, then a grid of max 8 featured ProductCards. IDs come from landingPageSettings.featuredProductIds in Local Storage.
5. CATEGORIES: 9 category tiles (icon + name + product count computed from data) linking to /products?category=...
6. WHY CLEANTEC: 4 columns matching the promises (Superior Cleaning, Safe & Effective, Eco Friendly, Ideal for Hospitality) with short copy.
7. COMPARISON: a clean 3-column table, "Factor | General / Unstructured Purchase | CleanTec Professional Range", rows: Product selection, Professional use cases, Categories, Pack sizes, Bulk ordering, Industry suitability, Order support, Centralized range. The CleanTec column has a very light blue-50 background and a check icon per row; the general column uses a gray dash. Respectful and factual.
8. HOW ORDERING WORKS: 4 numbered steps with a thin connecting line: Browse → Add to Cart → Checkout (Online/COD) → Confirmation & Delivery Tracking.
9. BULK ORDER CTA: a navy-900 full-width panel with a white heading "For Enquiries & Bulk Orders", the phone number in yellow-400 at 40px, the address with a map-pin icon, and a white [Contact for Bulk Orders] button. Include a small enquiry form (name, phone, requirement) stored in Local Storage.
10. FOOTER: navy-900 background with white and 70%-white text, 4 columns: brand + tagline + short blurb; Quick Links (Home, Products, Orders, Contact); Business Areas (Hotels, Resorts, Hospitals, Restaurants, Offices, Schools, Facility Management); Contact (phone, address). A bottom bar with © and "Demo application".

All copy comes from siteContent in Local Storage.

=====================================
PART G — OTHER CUSTOMER PAGES (same design quality)
=====================================
- /products: left filter column (search, category checkboxes with counts, price range, availability), top sort dropdown with a result count, a card grid, a polished no-results state with an illustration icon, and pagination or "load more".
- /products/:id: breadcrumb; a 2-column layout with a big image on a soft panel with thumbnail gallery on the left, and on the right the name, category, price, pack size, stock dot, a features checklist, suitable-for industries as an icon list, a quantity stepper, [Add to Cart] and [Buy Now]. Below: a tabbed section (Description | Features | Suitable For) with underline tabs, and Related Products by category.
- /cart: a 2-column layout (items table/list, and a sticky order summary panel). Item rows have an image, name, pack size, stepper, line total and a remove button.
- /checkout: a 3-step indicator (Details → Payment → Confirmation); form with Name, Mobile, Email, Address, City, State, Pincode (inline validation, 48px inputs, floating or top labels), and a sticky summary. If not logged in, show a clean login/register gate that returns to checkout after sign-in.
- /payment: choose Online Payment or Cash on Delivery. Online shows an amount, a QR code (qrcode.react) pointing to /demo-payment?orderId=...&amount=..., the text "Scan to Pay (Demo)", a dummy reference, UPI/QR/Card/Net Banking options (only QR/UPI interactive), and a fallback button "Payment completed? Confirm Demo Payment". Add /demo-payment as the mobile page: "CleanTec Demo Payment", order number, amount, [Pay ₹X (Demo)], then a success state with a reference.
- /order-success, /orders, /orders/:id (with a delivery-status timeline), /profile, /login, /register: split-screen auth (left a navy-50 brand panel with the logo and promises, right the form).
- Demo credentials: customer hari@gmail.com / Hari@123, admin admin@gmail.com / Admin@123. Include a small "Use demo credentials" helper on the login page. Add developer comments noting the auth and payment are demo only.

=====================================
PART H — ADMIN PANEL (professional internal app, same palette)
=====================================
Routes: /admin, /admin/orders, /admin/customers, /admin/customers/:id, /admin/products, /admin/landing-page, /admin/content, /admin/finance. Role-protected.
- Layout: a fixed 260px white sidebar (logo, grouped nav with Lucide icons, active item = blue-50 background + navy text + 3px left blue bar), a 64px top header (page title, search, admin avatar menu, Reset Demo Data with a confirm dialog), and a content area on a --surface-alt background with white panels.
- Dashboard: 10 metric cards (icon square, label, large number, and a small helper line), laid out 4 per row, plus a Recent Orders table. No big charts.
- Tables: white panel, 16px radius, sticky header with an uppercase 12px gray label row, 56px rows, hover row tint, right-aligned numbers, dot+text statuses, a row action menu, a toolbar with search and filters, and pagination.
- Orders: standard underline tabs for "Online Orders | Manual Orders", an order detail drawer to update Payment Status, Delivery Status and Amount Collected (pending = total − collected, auto-set to paid when collected ≥ total), and a "Create Manual Order" flow (customer → products → qty → price → payment → status).
- Products: full CRUD in a right-side drawer form with image upload (stored as a data URL or path), activate/deactivate toggle switch, delete confirmation.
- Landing Page admin: two lists (Available | Selected), reorder with up/down buttons or drag, a hard limit of 8 with a toast on exceeding, live preview of order.
- Finance: filters Today / This Week / This Month / All Time as a segmented underline control, with all numbers computed from the orders.
- Customers: list + detail with info, order history, purchase summary, payment history.

=====================================
PART I — ARCHITECTURE & DATA
=====================================
Folders: src/{components,pages,layouts,routes,hooks,services,storage,types,data,utils,assets}. A centralized storage service (getData/setData/removeData/updateData) with typed storage modules: auth, product, cart, order, customer, landingPage, content, payment. Keys: cleantec_users, cleantec_session, cleantec_products, cleantec_cart, cleantec_orders, cleantec_customers, cleantec_landing_page, cleantec_site_content, cleantec_payment_records. Seed once. All values (products, prices, content, featured IDs, orders) come from state or Local Storage. Never hardcode them in JSX. Reusable components: Header, Footer, ProductCard, ProductGrid, CartDrawer, OrderSummary, DataTable, Drawer, Modal, ConfirmDialog, EmptyState, Skeleton, Toast, FormField, StatusText, SectionHeading, StatCard.

Seed data: 1 customer (Hari), 1 admin, the 10 products, 8 featured IDs, 1 online paid order, 1 COD order with partial collection, 1 manual order, and site content.

Orders: orderType (online | manual), paymentMethod (online | cod), paymentStatus (pending | paid | partially_paid | failed), deliveryStatus (pending | confirmed | packed | out_for_delivery | delivered | cancelled). Changes in admin must reflect in the customer's order history, finance and dashboard immediately.

=====================================
PART J — QUALITY BAR / FINAL CHECKLIST
=====================================
- Looks like a premium brand site: consistent tokens, aligned grids, perfect spacing rhythm, no cramped areas, no random sizes.
- Fully responsive with no horizontal overflow at 360, 768, 1024 and 1440px.
- Accessibility: AA contrast, keyboard focus states, alt text, labels, aria for drawers and dialogs.
- Empty, loading, error and success states for every list and form.
- Toasts for add to cart, save, delete and payment.
- Clean TypeScript, no any, no console errors, the build passes.
- Do not add fake reviews, fake logos, fake certificates or fake stats.
- Deliver the complete working app, not static screens.