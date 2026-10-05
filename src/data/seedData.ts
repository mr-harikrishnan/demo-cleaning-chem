import { Customer, LandingPageSettings, Order, Product, SiteContent, User } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Kleeny Dish Wash, Lemon Power',
    slug: 'kleeny-dish-wash-lemon-power',
    category: 'Dishwash Liquid',
    shortDescription: 'Tough grease cutting formula with refreshing lemon fragrance.',
    description: 'Kleeny Dish Wash Lemon Power is formulated for hospitality kitchens and commercial dishwashing. Penetrates stubborn oil and burnt residue effortlessly without leaving film.',
    packSize: '500 ml',
    price: 185,
    compareAtPrice: 220,
    sku: 'CT-DW-001',
    image: '/images/products/kleeny-dish-wash-lemon-power.jpg',
    gallery: [
      '/images/products/kleeny-dish-wash-lemon-power.jpg',
      '/images/products/kitchen-degreaser-spray.jpg'
    ],
    features: ['Removes Grease', 'Shines Brighter'],
    suitableFor: ['Hotels', 'Restaurants', 'Resorts', 'Commercial Facilities'],
    stock: 120,
    isActive: true,
    isFeatured: true,
    createdAt: '2026-01-15T09:00:00.000Z',
    updatedAt: '2026-01-15T09:00:00.000Z'
  },
  {
    id: 'prod-2',
    name: 'Toilet Cleaner',
    slug: 'toilet-cleaner',
    category: 'Toilet Cleaner',
    shortDescription: 'Deep cleaning formula that eliminates tough limescale and germs.',
    description: 'Hospitality-grade thick toilet cleaner designed for guest room and commercial restrooms. Clings to bowl surfaces for maximum contact time and disinfection.',
    packSize: '1 L',
    price: 145,
    compareAtPrice: 170,
    sku: 'CT-TC-002',
    image: '/images/products/toilet-cleaner.jpg',
    gallery: ['/images/products/toilet-cleaner.jpg'],
    features: ['Removes Stains', 'Kills Germs'],
    suitableFor: ['Hotels', 'Resorts', 'Hospitals', 'Offices', 'Schools'],
    stock: 95,
    isActive: true,
    isFeatured: true,
    createdAt: '2026-01-15T09:30:00.000Z',
    updatedAt: '2026-01-15T09:30:00.000Z'
  },
  {
    id: 'prod-3',
    name: 'Glass Cleaner (bottle)',
    slug: 'glass-cleaner-bottle',
    category: 'Glass Cleaner',
    shortDescription: 'Professional refill bottle for crystal-clear window and mirror care.',
    description: 'Fast-drying liquid cleaner specifically engineered for mirror walls, display cabinets, and glass partitions in commercial spaces.',
    packSize: '500 ml',
    price: 120,
    compareAtPrice: 140,
    sku: 'CT-GC-003',
    image: '/images/products/glass-cleaner-bottle.jpg',
    gallery: ['/images/products/glass-cleaner-bottle.jpg'],
    features: ['Streak Free Shine'],
    suitableFor: ['Hotels', 'Resorts', 'Offices', 'Commercial Facilities'],
    stock: 80,
    isActive: true,
    isFeatured: true,
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-01-15T10:00:00.000Z'
  },
  {
    id: 'prod-4',
    name: 'Rapid Wash Fabric Wash, 5L',
    slug: 'rapid-wash-fabric-wash-5l',
    category: 'Fabric Wash',
    shortDescription: 'Bulk hospitality laundry liquid with deep fiber conditioning.',
    description: 'Concentrated laundry detergent formulated for hotel linens, bath towels, and uniforms. Protects fabric softness while maintaining bright whites and colors.',
    packSize: '5 L',
    price: 650,
    compareAtPrice: 750,
    sku: 'CT-FW-004',
    image: '/images/products/rapid-wash-fabric-wash-5l.jpg',
    gallery: ['/images/products/rapid-wash-fabric-wash-5l.jpg'],
    features: ['Long Lasting Freshness', 'Deep Cleaning Power', 'Care for Fabrics', 'Brighter Clothes'],
    suitableFor: ['Hotels', 'Resorts', 'Hospitals', 'Housekeeping Services'],
    stock: 45,
    isActive: true,
    isFeatured: true,
    createdAt: '2026-01-15T10:30:00.000Z',
    updatedAt: '2026-01-15T10:30:00.000Z'
  },
  {
    id: 'prod-5',
    name: 'Phenyl Disinfectant, 5L',
    slug: 'phenyl-disinfectant-5l',
    category: 'Disinfectant',
    shortDescription: 'Heavy-duty germicidal floor fluid for high footfall corridors.',
    description: 'Commercial grade disinfectant solution for sanitizing floors in lobbies, hospital wards, and large hospitality corridors.',
    packSize: '5 L',
    price: 380,
    compareAtPrice: 450,
    sku: 'CT-PD-005',
    image: '/images/products/phenyl-disinfectant-5l.jpg',
    gallery: ['/images/products/phenyl-disinfectant-5l.jpg'],
    features: ['Kills 99.9% Germs'],
    suitableFor: ['Hotels', 'Resorts', 'Hospitals', 'Offices', 'Schools', 'Hostels'],
    stock: 60,
    isActive: true,
    isFeatured: true,
    createdAt: '2026-01-15T11:00:00.000Z',
    updatedAt: '2026-01-15T11:00:00.000Z'
  },
  {
    id: 'prod-6',
    name: 'Tile & Surface Cleaner',
    slug: 'tile-surface-cleaner',
    category: 'Tile & Surface Cleaner',
    shortDescription: 'Multi-surface restorative solution for ceramic, granite, and tile surfaces.',
    description: 'Removes deep ground-in dirt, watermarks, and grout discoloration from bathroom and dining area surfaces.',
    packSize: '1 L',
    price: 160,
    compareAtPrice: 190,
    sku: 'CT-TSC-006',
    image: '/images/products/tile-surface-cleaner.jpg',
    gallery: ['/images/products/tile-surface-cleaner.jpg'],
    features: ['Removes Dirt & Stains'],
    suitableFor: ['Hotels', 'Restaurants', 'Resorts', 'Facility Management'],
    stock: 75,
    isActive: true,
    isFeatured: true,
    createdAt: '2026-01-15T11:30:00.000Z',
    updatedAt: '2026-01-15T11:30:00.000Z'
  },
  {
    id: 'prod-7',
    name: 'Glass Cleaner (spray)',
    slug: 'glass-cleaner-spray',
    category: 'Glass Cleaner',
    shortDescription: 'Precision spray trigger bottle for instant spot cleaning.',
    description: 'Ergonomic spray applicator delivering fine mist coverage for instant smudge removal on glass tables, mirrors, and windows.',
    packSize: '500 ml',
    price: 140,
    compareAtPrice: 165,
    sku: 'CT-GCS-007',
    image: '/images/products/glass-cleaner-spray.jpg',
    gallery: ['/images/products/glass-cleaner-spray.jpg'],
    features: ['Streak Free Shine'],
    suitableFor: ['Hotels', 'Resorts', 'Restaurants', 'Offices'],
    stock: 85,
    isActive: true,
    isFeatured: true,
    createdAt: '2026-01-15T12:00:00.000Z',
    updatedAt: '2026-01-15T12:00:00.000Z'
  },
  {
    id: 'prod-8',
    name: 'Kleenol Floor Cleaner',
    slug: 'kleenol-floor-cleaner',
    category: 'Floor Cleaner',
    shortDescription: 'Pleasantly scented neutral floor detergent for marble and tiles.',
    description: 'Provides lasting fragrance and gentle non-abrasive cleaning for marble, vinyl, polished tiles, and hardwood hotel flooring.',
    packSize: '1 L',
    price: 175,
    compareAtPrice: 210,
    sku: 'CT-FC-008',
    image: '/images/products/kleenol-floor-cleaner.jpg',
    gallery: ['/images/products/kleenol-floor-cleaner.jpg'],
    features: ['Long Lasting Fragrance'],
    suitableFor: ['Hotels', 'Resorts', 'Offices', 'Schools', 'Hostels'],
    stock: 90,
    isActive: true,
    isFeatured: true,
    createdAt: '2026-01-15T12:30:00.000Z',
    updatedAt: '2026-01-15T12:30:00.000Z'
  },
  {
    id: 'prod-9',
    name: 'Kitchen Degreaser (spray)',
    slug: 'kitchen-degreaser-spray',
    category: 'Kitchen Degreaser',
    shortDescription: 'Industrial strength degreasing foam for hoods, grills, and stoves.',
    description: 'Specially engineered for hotel and commercial kitchens. Breaks down carbonized grease on exhaust hoods, cooktops, and stainless steel splashbacks.',
    packSize: '500 ml',
    price: 195,
    compareAtPrice: 240,
    sku: 'CT-KD-009',
    image: '/images/products/kitchen-degreaser-spray.jpg',
    gallery: ['/images/products/kitchen-degreaser-spray.jpg'],
    features: ['Tough on Grease', 'Gentle on Surfaces'],
    suitableFor: ['Hotels', 'Restaurants', 'Resorts', 'Commercial Facilities'],
    stock: 65,
    isActive: true,
    isFeatured: false,
    createdAt: '2026-01-15T13:00:00.000Z',
    updatedAt: '2026-01-15T13:00:00.000Z'
  },
  {
    id: 'prod-10',
    name: 'Room Freshener, Floral',
    slug: 'room-freshener-floral',
    category: 'Room Freshener',
    shortDescription: 'Fine aerosol mist designed for premium guest room ambience.',
    description: 'Eliminates lingering odors and diffuses an elegant, subtle floral bouquet suited for luxury hotel suites, conference halls, and reception lounges.',
    packSize: '300 ml',
    price: 165,
    compareAtPrice: 195,
    sku: 'CT-RF-010',
    image: '/images/products/room-freshener-floral.jpg',
    gallery: ['/images/products/room-freshener-floral.jpg'],
    features: ['Long Lasting Fragrance'],
    suitableFor: ['Hotels', 'Resorts', 'Offices', 'Housekeeping Services'],
    stock: 110,
    isActive: true,
    isFeatured: false,
    createdAt: '2026-01-15T13:30:00.000Z',
    updatedAt: '2026-01-15T13:30:00.000Z'
  }
];

export const INITIAL_LANDING_SETTINGS: LandingPageSettings = {
  featuredProductIds: [
    'prod-1',
    'prod-2',
    'prod-3',
    'prod-4',
    'prod-5',
    'prod-6',
    'prod-7',
    'prod-8'
  ]
};

export const INITIAL_SITE_CONTENT: SiteContent = {
  companyName: 'CleanTec Hospitality Chemicals',
  tagline: 'Cleaner Spaces | Happier Stays',
  headline: 'Premium Cleaning Solutions for Hotels & Hospitality',
  signatureLine: 'Clean Today, Better Tomorrow',
  strapline: 'Complete Range of Cleaning Products for a Safer, Cleaner & More Refreshing Environment',
  phone: '8438244083',
  address: 'No: 10, Sannathi Street, Thiruverkadu, Chennai - 600 077.',
  promises: [
    {
      title: 'Superior Cleaning',
      description: 'Formulated for deep dirt and grease removal across commercial spaces.',
      icon: 'Sparkles'
    },
    {
      title: 'Safe & Effective',
      description: 'Reliable performance that protects surfaces, fixtures, and materials.',
      icon: 'ShieldCheck'
    },
    {
      title: 'Eco Friendly',
      description: 'Responsible formulations that minimize environmental footprint.',
      icon: 'Leaf'
    },
    {
      title: 'Ideal for Hospitality',
      description: 'Tailored for hotels, resorts, guest facilities, and dining spaces.',
      icon: 'BedDouble'
    }
  ],
  industries: [
    { id: 'ind-1', name: 'Hotels', useCase: 'Guest rooms, bathrooms, lobbies and linen care', icon: 'Building2' },
    { id: 'ind-2', name: 'Resorts', useCase: 'Expansive properties, open dining, and luxury villas', icon: 'Palmtree' },
    { id: 'ind-3', name: 'Hospitals', useCase: 'Sanitization of wards, corridors, and care stations', icon: 'Cross' },
    { id: 'ind-4', name: 'Offices', useCase: 'Workstation hygiene, washrooms, and conference halls', icon: 'Briefcase' },
    { id: 'ind-5', name: 'Schools', useCase: 'Classrooms, cafeterias, and communal wash areas', icon: 'GraduationCap' },
    { id: 'ind-6', name: 'Restaurants', useCase: 'Commercial kitchens, food prep zones, and dining tables', icon: 'Utensils' },
    { id: 'ind-7', name: 'Hostels', useCase: 'High-density living quarters and shared washrooms', icon: 'Home' },
    { id: 'ind-8', name: 'Facility Management', useCase: 'Contract maintenance across corporate parks', icon: 'Wrench' },
    { id: 'ind-9', name: 'Housekeeping Services', useCase: 'Professional turnover and deep-clean contracts', icon: 'Sparkles' },
    { id: 'ind-10', name: 'Commercial Facilities', useCase: 'Public halls, shopping areas, and transit hubs', icon: 'Building' }
  ],
  enquiries: [
    {
      id: 'enq-1',
      name: 'Ravi Chandran',
      phone: '9840123456',
      requirement: 'Requirement for 50 units of 5L Rapid Wash and 20 units of Phenyl for a resort in ECR.',
      createdAt: '2026-02-10T11:20:00.000Z'
    }
  ]
};

export const INITIAL_USERS: (User & { passwordHash: string })[] = [
  {
    id: 'user-admin',
    name: 'CleanTec Admin',
    email: 'admin@gmail.com',
    role: 'admin',
    phone: '8438244083',
    address: 'No: 10, Sannathi Street, Thiruverkadu',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600077',
    passwordHash: 'Admin@123',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'user-hari',
    name: 'Hari Kumar',
    email: 'hari@gmail.com',
    role: 'customer',
    phone: '9876543210',
    address: 'Flat 4B, Grand Horizon Residency, Anna Nagar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600040',
    passwordHash: 'Hari@123',
    createdAt: '2026-01-10T10:00:00.000Z'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'user-hari',
    name: 'Hari Kumar',
    email: 'hari@gmail.com',
    role: 'customer',
    phone: '9876543210',
    address: 'Flat 4B, Grand Horizon Residency, Anna Nagar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600040',
    totalOrders: 2,
    totalSpent: 1810,
    createdAt: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'user-priya',
    name: 'Priya Sundaram (Grand Bay Resort)',
    email: 'priya.sundaram@grandbay.com',
    role: 'customer',
    phone: '9841238910',
    address: 'Grand Bay Resort, East Coast Road, Kovalam',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '603112',
    totalOrders: 1,
    totalSpent: 4200,
    createdAt: '2026-01-18T14:00:00.000Z'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'CT-2026-1001',
    customerId: 'user-hari',
    customerName: 'Hari Kumar',
    customerEmail: 'hari@gmail.com',
    customerPhone: '9876543210',
    shippingAddress: {
      name: 'Hari Kumar',
      phone: '9876543210',
      email: 'hari@gmail.com',
      address: 'Flat 4B, Grand Horizon Residency, Anna Nagar',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600040'
    },
    items: [
      {
        productId: 'prod-4',
        productName: 'Rapid Wash Fabric Wash, 5L',
        packSize: '5 L',
        price: 650,
        quantity: 1,
        lineTotal: 650,
        image: '/images/products/rapid-wash-fabric-wash-5l.jpg'
      },
      {
        productId: 'prod-1',
        productName: 'Kleeny Dish Wash, Lemon Power',
        packSize: '500 ml',
        price: 185,
        quantity: 2,
        lineTotal: 370,
        image: '/images/products/kleeny-dish-wash-lemon-power.jpg'
      }
    ],
    subtotal: 1020,
    deliveryFee: 0,
    total: 1020,
    amountCollected: 1020,
    orderType: 'online',
    paymentMethod: 'online',
    paymentStatus: 'paid',
    deliveryStatus: 'delivered',
    notes: 'Please deliver to security desk if unavailable.',
    createdAt: '2026-02-01T10:15:00.000Z',
    updatedAt: '2026-02-03T16:30:00.000Z'
  },
  {
    id: 'ord-1002',
    orderNumber: 'CT-2026-1002',
    customerId: 'user-hari',
    customerName: 'Hari Kumar',
    customerEmail: 'hari@gmail.com',
    customerPhone: '9876543210',
    shippingAddress: {
      name: 'Hari Kumar',
      phone: '9876543210',
      email: 'hari@gmail.com',
      address: 'Flat 4B, Grand Horizon Residency, Anna Nagar',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600040'
    },
    items: [
      {
        productId: 'prod-5',
        productName: 'Phenyl Disinfectant, 5L',
        packSize: '5 L',
        price: 380,
        quantity: 1,
        lineTotal: 380,
        image: '/images/products/phenyl-disinfectant-5l.jpg'
      },
      {
        productId: 'prod-8',
        productName: 'Kleenol Floor Cleaner',
        packSize: '1 L',
        price: 175,
        quantity: 2,
        lineTotal: 350,
        image: '/images/products/kleenol-floor-cleaner.jpg'
      },
      {
        productId: 'prod-2',
        productName: 'Toilet Cleaner',
        packSize: '1 L',
        price: 145,
        quantity: 1,
        lineTotal: 145,
        image: '/images/products/toilet-cleaner.jpg'
      }
    ],
    subtotal: 875,
    deliveryFee: 0,
    total: 875,
    amountCollected: 875,
    orderType: 'online',
    paymentMethod: 'online',
    paymentStatus: 'paid',
    deliveryStatus: 'out_for_delivery',
    notes: 'Full online payment verified via UPI. Dispatched with CleanTec Priority Delivery.',
    createdAt: '2026-02-08T14:40:00.000Z',
    updatedAt: '2026-02-09T09:00:00.000Z'
  },
  {
    id: 'ord-1003',
    orderNumber: 'CT-2026-1003',
    customerId: 'user-priya',
    customerName: 'Priya Sundaram (Grand Bay Resort)',
    customerEmail: 'priya.sundaram@grandbay.com',
    customerPhone: '9841238910',
    shippingAddress: {
      name: 'Priya Sundaram',
      phone: '9841238910',
      email: 'priya.sundaram@grandbay.com',
      address: 'Grand Bay Resort, East Coast Road, Kovalam',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '603112'
    },
    items: [
      {
        productId: 'prod-4',
        productName: 'Rapid Wash Fabric Wash, 5L',
        packSize: '5 L',
        price: 650,
        quantity: 4,
        lineTotal: 2600,
        image: '/images/products/rapid-wash-fabric-wash-5l.jpg'
      },
      {
        productId: 'prod-6',
        productName: 'Tile & Surface Cleaner',
        packSize: '1 L',
        price: 160,
        quantity: 10,
        lineTotal: 1600,
        image: '/images/products/tile-surface-cleaner.jpg'
      }
    ],
    subtotal: 4200,
    deliveryFee: 0,
    total: 4200,
    amountCollected: 4200,
    orderType: 'manual',
    paymentMethod: 'online',
    paymentStatus: 'paid',
    deliveryStatus: 'confirmed',
    notes: 'Direct hotel reservation purchase arranged via phone inquiry.',
    createdAt: '2026-02-09T16:00:00.000Z',
    updatedAt: '2026-02-09T16:15:00.000Z'
  }
];
