import fs from 'fs';
import path from 'path';

const outDir = path.resolve(process.cwd(), 'public/images/products');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function createBottleSvg({ name, color, capColor, labelColor, type, subtitle, accent }) {
  if (type === 'spray') {
    return `<svg width="400" height="500" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#EEF4FF" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.85"/>
          <stop offset="50%" stop-color="${color}" stop-opacity="1"/>
          <stop offset="85%" stop-color="${color}" stop-opacity="0.75"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0.6"/>
        </linearGradient>
        <linearGradient id="labelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="100%" stop-color="#F8FAFC"/>
        </linearGradient>
      </defs>
      <ellipse cx="200" cy="450" rx="90" ry="14" fill="#0A1F5C" fill-opacity="0.08"/>
      <!-- Bottle neck and trigger spray -->
      <path d="M190 140 H210 V170 H190 Z" fill="#E2E8F0"/>
      <!-- Spray Trigger Head -->
      <path d="M175 110 H225 V140 H175 Z" fill="#0A1F5C" rx="4"/>
      <path d="M175 115 L130 130 V120 L175 110 Z" fill="#0A1F5C"/>
      <path d="M185 140 C185 155 170 165 160 175 H175 C185 165 195 155 195 140 Z" fill="#12338F"/>
      <!-- Bottle Body -->
      <path d="M150 200 C150 170 190 170 190 170 H210 C210 170 250 170 250 200 L260 410 C260 435 240 445 200 445 C160 445 140 435 140 410 L150 200 Z" fill="url(#bodyGrad)"/>
      <!-- Bottle Highlight -->
      <path d="M160 210 L152 410 C152 420 160 430 175 435 L175 205 C166 205 162 208 160 210 Z" fill="#FFFFFF" fill-opacity="0.3"/>
      <!-- Label -->
      <rect x="156" y="240" width="88" height="150" rx="8" fill="url(#labelGrad)" stroke="#E2E8F0" stroke-width="1.5"/>
      <rect x="156" y="240" width="88" height="24" rx="4" fill="${labelColor}"/>
      <text x="200" y="256" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="700" text-anchor="middle" letter-spacing="0.5">CLEANTEC™</text>
      <text x="200" y="280" fill="#0A1F5C" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="800" text-anchor="middle">${name.toUpperCase()}</text>
      <text x="200" y="295" fill="#2E9B3E" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="700" text-anchor="middle">${subtitle.toUpperCase()}</text>
      <circle cx="200" cy="325" r="18" fill="${accent || '#EEF4FF'}"/>
      <path d="M195 325 L199 329 L206 321" stroke="#2E9B3E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="200" y="360" fill="#0F172A" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="600" text-anchor="middle">500 ml</text>
      <text x="200" y="375" fill="#1F6FEB" font-family="'Plus Jakarta Sans', sans-serif" font-size="6.5" font-weight="600" text-anchor="middle">PROFESSIONAL</text>
    </svg>`;
  }

  if (type === 'jug') {
    return `<svg width="400" height="500" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="200" cy="455" rx="100" ry="16" fill="#0A1F5C" fill-opacity="0.08"/>
      <!-- Cap -->
      <rect x="175" y="115" width="50" height="25" rx="4" fill="${capColor}"/>
      <rect x="180" y="140" width="40" height="15" fill="#E2E8F0"/>
      <!-- Handle -->
      <path d="M150 170 C120 170 110 200 110 240 C110 280 120 310 150 310" stroke="${color}" stroke-width="26" stroke-linecap="round"/>
      <path d="M150 170 C125 170 116 200 116 240 C116 280 125 310 150 310" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="8" stroke-linecap="round"/>
      <!-- Main Jug Body -->
      <rect x="140" y="155" width="145" height="280" rx="20" fill="${color}"/>
      <path d="M150 165 H275 V425 H150 Z" fill="#FFFFFF" fill-opacity="0.08"/>
      <!-- Label -->
      <rect x="160" y="210" width="105" height="180" rx="10" fill="#FFFFFF" stroke="#E6EAF2" stroke-width="1.5"/>
      <rect x="160" y="210" width="105" height="32" rx="6" fill="${labelColor}"/>
      <text x="212" y="231" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="800" text-anchor="middle" letter-spacing="1">CLEANTEC™</text>
      <text x="212" y="262" fill="#0A1F5C" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="800" text-anchor="middle">${name.toUpperCase()}</text>
      <text x="212" y="280" fill="#2E9B3E" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" text-anchor="middle">${subtitle.toUpperCase()}</text>
      <rect x="175" y="300" width="75" height="38" rx="6" fill="#EEF4FF"/>
      <text x="212" y="318" fill="#0A1F5C" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="800" text-anchor="middle">5 LITRES</text>
      <text x="212" y="331" fill="#1F6FEB" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="600" text-anchor="middle">HOTEL PACK</text>
      <text x="212" y="365" fill="#475569" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="600" text-anchor="middle">HOSPITALITY GRADE</text>
    </svg>`;
  }

  if (type === 'can') {
    return `<svg width="400" height="500" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="200" cy="450" rx="75" ry="14" fill="#0A1F5C" fill-opacity="0.08"/>
      <!-- Aerosol Cap -->
      <path d="M170 120 C170 110 180 100 200 100 C220 100 230 110 230 120 V160 H170 Z" fill="${capColor}"/>
      <circle cx="200" cy="130" r="3" fill="#FFFFFF"/>
      <!-- Can Body -->
      <rect x="160" y="160" width="80" height="280" rx="14" fill="${color}"/>
      <rect x="164" y="160" width="10" height="280" fill="#FFFFFF" fill-opacity="0.3"/>
      <!-- Graphics -->
      <rect x="160" y="230" width="80" height="150" fill="#FFFFFF" fill-opacity="0.95"/>
      <rect x="160" y="230" width="80" height="24" fill="${labelColor}"/>
      <text x="200" y="246" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="800" text-anchor="middle" letter-spacing="0.5">CLEANTEC™</text>
      <text x="200" y="272" fill="#0A1F5C" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="800" text-anchor="middle">${name.toUpperCase()}</text>
      <text x="200" y="288" fill="#D97706" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="700" text-anchor="middle">${subtitle.toUpperCase()}</text>
      <circle cx="200" cy="320" r="16" fill="#FFFBEB"/>
      <path d="M195 320 C195 312 205 312 205 320 C205 328 195 328 195 320 Z" fill="#D97706"/>
      <text x="200" y="355" fill="#475569" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="600" text-anchor="middle">300 ml</text>
    </svg>`;
  }

  // Standard bottle with cap
  return `<svg width="400" height="500" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="200" cy="450" rx="80" ry="14" fill="#0A1F5C" fill-opacity="0.08"/>
    <!-- Cap -->
    <rect x="180" y="105" width="40" height="35" rx="6" fill="${capColor}"/>
    <rect x="186" y="140" width="28" height="12" fill="#CBD5E1"/>
    <!-- Angled Neck / Shoulder -->
    <path d="M175 160 C175 150 185 145 200 145 C215 145 225 150 225 160 L245 205 C250 215 250 225 250 240 L248 420 C248 438 232 445 200 445 C168 445 152 438 152 420 L150 240 C150 225 150 215 155 205 Z" fill="${color}"/>
    <!-- Reflection -->
    <path d="M160 215 L156 420 C156 428 162 436 175 440 L178 215 C170 215 164 215 160 215 Z" fill="#FFFFFF" fill-opacity="0.3"/>
    <!-- Label -->
    <rect x="162" y="240" width="76" height="155" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
    <rect x="162" y="240" width="76" height="24" rx="4" fill="${labelColor}"/>
    <text x="200" y="256" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="800" text-anchor="middle" letter-spacing="0.5">CLEANTEC™</text>
    <text x="200" y="280" fill="#0A1F5C" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="800" text-anchor="middle">${name.toUpperCase()}</text>
    <text x="200" y="295" fill="#2E9B3E" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="700" text-anchor="middle">${subtitle.toUpperCase()}</text>
    <circle cx="200" cy="328" r="16" fill="${accent || '#EEF4FF'}"/>
    <path d="M195 328 L198 331 L205 324" stroke="#2E9B3E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="200" y="365" fill="#0F172A" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="600" text-anchor="middle">500 ml / 1 L</text>
    <text x="200" y="378" fill="#1F6FEB" font-family="'Plus Jakarta Sans', sans-serif" font-size="6.5" font-weight="600" text-anchor="middle">PROFESSIONAL</text>
  </svg>`;
}

const products = [
  {
    slug: 'kleeny-dish-wash-lemon-power',
    name: 'Kleeny Dish Wash',
    subtitle: 'Lemon Power',
    color: '#FACC15',
    capColor: '#15803D',
    labelColor: '#0A1F5C',
    type: 'bottle',
    accent: '#FEF08A'
  },
  {
    slug: 'toilet-cleaner',
    name: 'Toilet Cleaner',
    subtitle: 'Kills 99.9% Germs',
    color: '#0A1F5C',
    capColor: '#DC2626',
    labelColor: '#DC2626',
    type: 'bottle',
    accent: '#FEE2E2'
  },
  {
    slug: 'glass-cleaner-bottle',
    name: 'Glass Cleaner',
    subtitle: 'Streak Free Shine',
    color: '#38BDF8',
    capColor: '#0284C7',
    labelColor: '#0A1F5C',
    type: 'bottle',
    accent: '#E0F2FE'
  },
  {
    slug: 'rapid-wash-fabric-wash-5l',
    name: 'Rapid Wash',
    subtitle: 'Fabric Wash 5L',
    color: '#2563EB',
    capColor: '#1D4ED8',
    labelColor: '#0A1F5C',
    type: 'jug',
    accent: '#DBEAFE'
  },
  {
    slug: 'phenyl-disinfectant-5l',
    name: 'Phenyl Disinfectant',
    subtitle: '5L Heavy Duty',
    color: '#78350F',
    capColor: '#15803D',
    labelColor: '#15803D',
    type: 'jug',
    accent: '#DCFCE7'
  },
  {
    slug: 'tile-surface-cleaner',
    name: 'Tile & Surface',
    subtitle: 'Removes Dirt & Stains',
    color: '#F1F5F9',
    capColor: '#16A34A',
    labelColor: '#16A34A',
    type: 'bottle',
    accent: '#DCFCE7'
  },
  {
    slug: 'glass-cleaner-spray',
    name: 'Glass Cleaner',
    subtitle: 'Streak Free Shine',
    color: '#38BDF8',
    capColor: '#0284C7',
    labelColor: '#0A1F5C',
    type: 'spray',
    accent: '#E0F2FE'
  },
  {
    slug: 'kleenol-floor-cleaner',
    name: 'Kleenol Floor',
    subtitle: 'Long Lasting Fragrance',
    color: '#F472B6',
    capColor: '#DB2777',
    labelColor: '#0A1F5C',
    type: 'bottle',
    accent: '#FCE7F3'
  },
  {
    slug: 'kitchen-degreaser-spray',
    name: 'Kitchen Degreaser',
    subtitle: 'Tough on Grease',
    color: '#FBBF24',
    capColor: '#D97706',
    labelColor: '#0A1F5C',
    type: 'spray',
    accent: '#FEF3C7'
  },
  {
    slug: 'room-freshener-floral',
    name: 'Room Freshener',
    subtitle: 'Floral Premium Mist',
    color: '#F43F5E',
    capColor: '#E11D48',
    labelColor: '#BE123C',
    type: 'can',
    accent: '#FFE4E6'
  }
];

// Write individual product SVG files
for (const p of products) {
  const svgContent = createBottleSvg(p);
  fs.writeFileSync(path.join(outDir, `${p.slug}.svg`), svgContent, 'utf-8');
}

// Write a fallback image
const fallbackSvg = `<svg width="400" height="500" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="500" rx="16" fill="#F8FAFC"/>
  <circle cx="200" cy="220" r="48" fill="#EEF4FF"/>
  <path d="M200 190 C200 190 180 215 180 230 C180 241 189 250 200 250 C211 250 220 241 220 230 C220 215 200 190 200 190 Z" fill="#1F6FEB"/>
  <text x="200" y="300" fill="#0A1F5C" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="700" text-anchor="middle">CleanTec Hospitality</text>
  <text x="200" y="325" fill="#94A3B8" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="600" text-anchor="middle">Professional Cleaning Solutions</text>
</svg>`;
fs.writeFileSync(path.join(outDir, 'fallback.svg'), fallbackSvg, 'utf-8');

// Write Hero Lineup composition image
const heroLineupSvg = `<svg width="800" height="550" viewBox="0 0 800 550" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="heroGlow" cx="50%" cy="65%" r="60%">
      <stop offset="0%" stop-color="#EEF4FF" stop-opacity="1"/>
      <stop offset="60%" stop-color="#F7F9FC" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="800" height="550" rx="24" fill="url(#heroGlow)"/>
  <!-- Floor shadow reflection -->
  <ellipse cx="400" cy="480" rx="340" ry="24" fill="#0A1F5C" fill-opacity="0.07"/>
  
  <!-- Lineup of bottles (rendered in layered perspective) -->
  <!-- Left Jug: Rapid Wash Fabric 5L -->
  <g transform="translate(100, 160) scale(0.65)">
    <rect x="175" y="115" width="50" height="25" rx="4" fill="#1D4ED8"/>
    <path d="M150 170 C120 170 110 200 110 240 C110 280 120 310 150 310" stroke="#2563EB" stroke-width="26" stroke-linecap="round"/>
    <rect x="140" y="155" width="145" height="280" rx="20" fill="#2563EB"/>
    <rect x="160" y="210" width="105" height="180" rx="10" fill="#FFFFFF"/>
    <text x="212" y="260" fill="#0A1F5C" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="800" text-anchor="middle">RAPID WASH</text>
    <text x="212" y="320" fill="#1F6FEB" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="800" text-anchor="middle">5 LITRES</text>
  </g>

  <!-- Right Jug: Phenyl 5L -->
  <g transform="translate(480, 160) scale(0.65)">
    <rect x="175" y="115" width="50" height="25" rx="4" fill="#15803D"/>
    <path d="M150 170 C120 170 110 200 110 240 C110 280 120 310 150 310" stroke="#78350F" stroke-width="26" stroke-linecap="round"/>
    <rect x="140" y="155" width="145" height="280" rx="20" fill="#78350F"/>
    <rect x="160" y="210" width="105" height="180" rx="10" fill="#FFFFFF"/>
    <text x="212" y="260" fill="#0A1F5C" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="800" text-anchor="middle">PHENYL 5L</text>
    <text x="212" y="320" fill="#15803D" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="800" text-anchor="middle">DISINFECTANT</text>
  </g>

  <!-- Toilet Cleaner Navy (Left-Mid) -->
  <g transform="translate(190, 150) scale(0.72)">
    <rect x="180" y="105" width="40" height="35" rx="6" fill="#DC2626"/>
    <path d="M175 160 C175 150 185 145 200 145 C215 145 225 150 225 160 L245 205 L248 420 C248 438 232 445 200 445 C168 445 152 438 152 420 L150 240 Z" fill="#0A1F5C"/>
    <rect x="162" y="240" width="76" height="155" rx="8" fill="#FFFFFF"/>
    <text x="200" y="280" fill="#DC2626" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="800" text-anchor="middle">TOILET</text>
    <text x="200" y="295" fill="#0A1F5C" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="700" text-anchor="middle">CLEANER</text>
  </g>

  <!-- Kleeny Dishwash Lemon (Center Front) -->
  <g transform="translate(290, 130) scale(0.82)">
    <rect x="180" y="105" width="40" height="35" rx="6" fill="#15803D"/>
    <path d="M175 160 C175 150 185 145 200 145 C215 145 225 150 225 160 L245 205 L248 420 C248 438 232 445 200 445 C168 445 152 438 152 420 L150 240 Z" fill="#FACC15"/>
    <rect x="162" y="240" width="76" height="155" rx="8" fill="#FFFFFF"/>
    <rect x="162" y="240" width="76" height="24" rx="4" fill="#0A1F5C"/>
    <text x="200" y="256" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="800" text-anchor="middle">CLEANTEC</text>
    <text x="200" y="280" fill="#0A1F5C" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="800" text-anchor="middle">KLEENY</text>
    <text x="200" y="296" fill="#15803D" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="700" text-anchor="middle">LEMON POWER</text>
  </g>

  <!-- Glass Cleaner Trigger Spray (Right-Mid) -->
  <g transform="translate(390, 140) scale(0.75)">
    <path d="M175 110 H225 V140 H175 Z" fill="#0A1F5C" rx="4"/>
    <path d="M175 115 L130 130 V120 L175 110 Z" fill="#0A1F5C"/>
    <path d="M150 200 C150 170 190 170 190 170 H210 C210 170 250 170 250 200 L260 410 C260 435 240 445 200 445 C160 445 140 435 140 410 Z" fill="#38BDF8"/>
    <rect x="156" y="240" width="88" height="150" rx="8" fill="#FFFFFF"/>
    <text x="200" y="280" fill="#0A1F5C" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5" font-weight="800" text-anchor="middle">GLASS</text>
    <text x="200" y="295" fill="#1F6FEB" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="700" text-anchor="middle">SHINE SPRAY</text>
  </g>

  <!-- Kleenol Floor Cleaner Pink (Right Front) -->
  <g transform="translate(460, 160) scale(0.7)">
    <rect x="180" y="105" width="40" height="35" rx="6" fill="#DB2777"/>
    <path d="M175 160 C175 150 185 145 200 145 C215 145 225 150 225 160 L245 205 L248 420 C248 438 232 445 200 445 C168 445 152 438 152 420 L150 240 Z" fill="#F472B6"/>
    <rect x="162" y="240" width="76" height="155" rx="8" fill="#FFFFFF"/>
    <text x="200" y="280" fill="#0A1F5C" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="800" text-anchor="middle">KLEENOL</text>
    <text x="200" y="295" fill="#DB2777" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="700" text-anchor="middle">FLOOR CLEANER</text>
  </g>

  <!-- Badge banner in hero -->
  <rect x="230" y="475" width="340" height="38" rx="10" fill="#FFFFFF" stroke="#E6EAF2"/>
  <text x="400" y="499" fill="#0A1F5C" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="700" text-anchor="middle">Complete Hospitality Range • 100% Commercial Grade</text>
</svg>`;
fs.writeFileSync(path.join(outDir, 'hero-lineup.svg'), heroLineupSvg, 'utf-8');

console.log('Successfully generated all 10 product SVGs, hero lineup, and fallback SVG in public/images/products/');
