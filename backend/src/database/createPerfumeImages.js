import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const targetDir = path.resolve(__dirname, '../../../frontend/public/images/perfumes');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const perfumes = [
  {
    id: 'kashmir-saffron-amber',
    name: 'KASHMIR SAFFRON',
    subtitle: 'ROYAL AMBER',
    concentration: 'EXTRAIT DE PARFUM',
    liquidColor1: '#C97A1E',
    liquidColor2: '#5A2A04',
    capColor: '#C5A880',
    capColorDark: '#8C6D46',
    glassTint: 'rgba(217, 148, 57, 0.25)',
    accentTag: 'KASHMIR COLLECTION'
  },
  {
    id: 'assam-oud-imperial',
    name: 'ASSAM OUD',
    subtitle: 'IMPERIAL',
    concentration: 'EXTRAIT DE PARFUM',
    liquidColor1: '#4A2810',
    liquidColor2: '#1A0C03',
    capColor: '#C5A880',
    capColorDark: '#664E2E',
    glassTint: 'rgba(74, 40, 16, 0.4)',
    accentTag: 'ROYAL OUD RESERVE'
  },
  {
    id: 'kannauj-rose-musk',
    name: 'KANNAUJ ROSE',
    subtitle: '& VELVET MUSK',
    concentration: 'EAU DE PARFUM',
    liquidColor1: '#C4576C',
    liquidColor2: '#681829',
    capColor: '#DFCAAE',
    capColorDark: '#9A7B54',
    glassTint: 'rgba(196, 87, 108, 0.2)',
    accentTag: 'ARTISANAL FLORAL'
  },
  {
    id: 'mysore-sandalwood-cardamom',
    name: 'MYSORE CHANDAN',
    subtitle: '& SPICED CARDAMOM',
    concentration: 'EXTRAIT DE PARFUM',
    liquidColor1: '#B8860B',
    liquidColor2: '#644200',
    capColor: '#D4AF37',
    capColorDark: '#8B6508',
    glassTint: 'rgba(184, 134, 11, 0.25)',
    accentTag: 'HERITAGE WOODS'
  },
  {
    id: 'monsoon-ruh-khus',
    name: 'MONSOON RUH KHUS',
    subtitle: 'HERITAGE VETIVER',
    concentration: 'PURE EXTRAIT',
    liquidColor1: '#2E6F40',
    liquidColor2: '#0D3017',
    capColor: '#C5A880',
    capColorDark: '#7A623F',
    glassTint: 'rgba(46, 111, 64, 0.3)',
    accentTag: 'MONSOON PETRICHOR'
  },
  {
    id: 'himalayan-cedar-bergamot',
    name: 'HIMALAYAN CEDAR',
    subtitle: '& FRESH BERGAMOT',
    concentration: 'EAU DE PARFUM',
    liquidColor1: '#4A7C82',
    liquidColor2: '#16363B',
    capColor: '#E2D3BE',
    capColorDark: '#A38B6B',
    glassTint: 'rgba(74, 124, 130, 0.2)',
    accentTag: 'ALPINE FRESH'
  },
  {
    id: 'jasmine-sambac-night-queen',
    name: 'JASMINE SAMBAC',
    subtitle: '& RAJNIGANDHA',
    concentration: 'EXTRAIT DE PARFUM',
    liquidColor1: '#E6B87D',
    liquidColor2: '#7E4F18',
    capColor: '#D4AF37',
    capColorDark: '#91711C',
    glassTint: 'rgba(230, 184, 125, 0.25)',
    accentTag: 'MIDNIGHT BLOOMS'
  },
  {
    id: 'dark-incense-black-pepper',
    name: 'TEMPLE INCENSE',
    subtitle: '& BLACK PEPPER',
    concentration: 'EXTRAIT DE PARFUM',
    liquidColor1: '#2D282A',
    liquidColor2: '#0D0B0C',
    capColor: '#8C6D46',
    capColorDark: '#4A3720',
    glassTint: 'rgba(45, 40, 42, 0.45)',
    accentTag: 'SACRED SMOKE'
  },
  {
    id: 'smoky-birch-warm-cinnamon',
    name: 'SMOKY BIRCH',
    subtitle: '& CEYLON CINNAMON',
    concentration: 'EAU DE PARFUM',
    liquidColor1: '#993D13',
    liquidColor2: '#471402',
    capColor: '#C5A880',
    capColorDark: '#855E30',
    glassTint: 'rgba(153, 61, 19, 0.3)',
    accentTag: 'WARM SPICE'
  },
  {
    id: 'vanilla-bourbon-golden-tobacco',
    name: 'VANILLA BOURBON',
    subtitle: '& GOLDEN TOBACCO',
    concentration: 'EXTRAIT DE PARFUM',
    liquidColor1: '#C17817',
    liquidColor2: '#532900',
    capColor: '#D4AF37',
    capColorDark: '#8B6508',
    glassTint: 'rgba(193, 120, 23, 0.3)',
    accentTag: 'GOURMAND AMBER'
  }
];

function generatePerfumeSvg(p) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="1000" viewBox="0 0 800 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient -->
    <radialGradient id="bgGrad" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#FAF8F5" />
      <stop offset="60%" stop-color="#EFE8DF" />
      <stop offset="100%" stop-color="#E2D8CA" />
    </radialGradient>

    <!-- Liquid Gradient -->
    <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${p.liquidColor1}" stop-opacity="0.9" />
      <stop offset="70%" stop-color="${p.liquidColor2}" stop-opacity="0.96" />
      <stop offset="100%" stop-color="#0F0E0E" stop-opacity="0.98" />
    </linearGradient>

    <!-- Glass Highlights & Sheen -->
    <linearGradient id="glassSheen" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.5" />
      <stop offset="15%" stop-color="#FFFFFF" stop-opacity="0.1" />
      <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.0" />
      <stop offset="85%" stop-color="#FFFFFF" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.6" />
    </linearGradient>

    <!-- Metallic Cap Gradient -->
    <linearGradient id="capGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${p.capColorDark}" />
      <stop offset="25%" stop-color="${p.capColor}" />
      <stop offset="45%" stop-color="#FFF5E4" />
      <stop offset="70%" stop-color="${p.capColor}" />
      <stop offset="100%" stop-color="${p.capColorDark}" />
    </linearGradient>

    <!-- Label Metallic Foil -->
    <linearGradient id="goldFoil" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#9A7B54" />
      <stop offset="30%" stop-color="#DFCAAE" />
      <stop offset="50%" stop-color="#FFF3E0" />
      <stop offset="70%" stop-color="#C5A880" />
      <stop offset="100%" stop-color="#8C6D46" />
    </linearGradient>

    <!-- Soft Drop Shadow Filter -->
    <filter id="bottleShadow" x="100" y="780" width="600" height="180" filterUnits="userSpaceOnUse">
      <feGaussianBlur stdDeviation="30" />
    </filter>
  </defs>

  <!-- Studio Background -->
  <rect width="800" height="1000" fill="url(#bgGrad)" />

  <!-- Studio Ambient Floor Reflection Ring -->
  <ellipse cx="400" cy="880" rx="260" ry="40" fill="#000000" opacity="0.18" filter="url(#bottleShadow)" />
  <ellipse cx="400" cy="870" rx="190" ry="22" fill="#000000" opacity="0.28" filter="url(#bottleShadow)" />

  <!-- Subtle Indian Paisley / Geometric Watermark in Background -->
  <g opacity="0.03" stroke="#C5A880" stroke-width="1.5">
    <circle cx="400" cy="450" r="320" stroke-dasharray="8 8" />
    <circle cx="400" cy="450" r="240" />
    <circle cx="400" cy="450" r="160" stroke-dasharray="4 4" />
  </g>

  <!-- ================= PERFUME BOTTLE ================= -->

  <!-- Liquid Reservoir Interior Body -->
  <rect x="235" y="380" width="330" height="460" rx="24" fill="url(#liquidGrad)" />

  <!-- Liquid Meniscus & Shimmer -->
  <path d="M 235 410 Q 400 425 565 410 L 565 820 Q 400 845 235 820 Z" fill="${p.liquidColor1}" opacity="0.25" />

  <!-- Outer Heavy Crystal Glass Flacon -->
  <rect x="220" y="350" width="360" height="510" rx="30" fill="${p.glassTint}" stroke="#FFFFFF" stroke-width="2" stroke-opacity="0.6" />

  <!-- Glass Bevels (Heavy Base Thickness) -->
  <rect x="220" y="780" width="360" height="80" rx="20" fill="#FFFFFF" fill-opacity="0.15" />
  <line x1="240" y1="780" x2="560" y2="780" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="0.5" />

  <!-- Vertical Glass Specular Sheen (Studio Lighting) -->
  <rect x="220" y="350" width="360" height="510" rx="30" fill="url(#glassSheen)" />

  <!-- Left Sharp Studio Rim Light -->
  <path d="M 230 370 L 230 840" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity="0.75" />
  <!-- Right Soft Studio Rim Light -->
  <path d="M 570 370 L 570 840" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.55" />

  <!-- Bottle Shoulder Neck (Crystal Collar) -->
  <rect x="360" y="310" width="80" height="45" rx="8" fill="url(#glassSheen)" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="0.6" />

  <!-- Heavy Gold Atomizer Collar & Sprayer Ring -->
  <rect x="350" y="275" width="100" height="40" rx="6" fill="url(#capGrad)" stroke="#6E502B" stroke-width="1" />
  <rect x="354" y="280" width="92" height="6" fill="#FFF5E4" opacity="0.6" />

  <!-- Solid Premium Heavy Weighted Cap -->
  <rect x="310" y="140" width="180" height="140" rx="14" fill="url(#capGrad)" stroke="#664E2E" stroke-width="1.5" />

  <!-- Cap Fluting / Ribbing Details -->
  <line x1="330" y1="140" x2="330" y2="280" stroke="#FFFFFF" stroke-width="1" opacity="0.4" />
  <line x1="360" y1="140" x2="360" y2="280" stroke="#000000" stroke-width="1" opacity="0.25" />
  <line x1="400" y1="140" x2="400" y2="280" stroke="#FFFFFF" stroke-width="1.5" opacity="0.6" />
  <line x1="440" y1="140" x2="440" y2="280" stroke="#000000" stroke-width="1" opacity="0.25" />
  <line x1="470" y1="140" x2="470" y2="280" stroke="#FFFFFF" stroke-width="1" opacity="0.4" />

  <!-- Cap Crown Crest Medallion -->
  <rect x="375" y="115" width="50" height="28" rx="6" fill="url(#capGrad)" />
  <circle cx="400" cy="129" r="8" fill="#FFFFFF" opacity="0.4" />

  <!-- ================= LUXURY EMBOSSED LABEL ================= -->
  <g transform="translate(265, 450)">
    <!-- Label Background (Cream Textured Paper) -->
    <rect x="0" y="0" width="270" height="260" rx="8" fill="#FAF7F2" stroke="#DFCAAE" stroke-width="2" />

    <!-- Inner Gold Foil Border Frame -->
    <rect x="8" y="8" width="254" height="244" rx="4" fill="none" stroke="url(#goldFoil)" stroke-width="1.5" />
    <rect x="12" y="12" width="246" height="236" rx="2" fill="none" stroke="#C5A880" stroke-width="0.75" stroke-dasharray="3 3" />

    <!-- Brand Emblem -->
    <path d="M 135 30 L 143 45 L 127 45 Z" fill="#9A7B54" />
    <circle cx="135" cy="40" r="14" stroke="#9A7B54" stroke-width="1" fill="none" />
    <text x="135" y="44" font-family="'Cinzel', serif" font-size="10" font-weight="700" fill="#9A7B54" text-anchor="middle">I</text>

    <!-- Brand Name -->
    <text x="135" y="75" font-family="'Cinzel', 'Playfair Display', serif" font-size="16" font-weight="800" fill="#0F0E0E" letter-spacing="4" text-anchor="middle">IDITZ</text>
    <text x="135" y="92" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="600" fill="#8C6D46" letter-spacing="3" text-anchor="middle">PERFUME</text>

    <!-- Gold Accent Line -->
    <line x1="60" y1="104" x2="210" y2="104" stroke="url(#goldFoil)" stroke-width="1" />

    <!-- Perfume Name -->
    <text x="135" y="130" font-family="'Playfair Display', Georgia, serif" font-size="14" font-weight="700" fill="#1A1918" text-anchor="middle">${p.name}</text>
    <text x="135" y="150" font-family="'Playfair Display', Georgia, serif" font-size="11" font-weight="600" font-style="italic" fill="#8C6D46" text-anchor="middle">${p.subtitle}</text>

    <!-- Concentration -->
    <text x="135" y="185" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" fill="#3F3C38" letter-spacing="2" text-anchor="middle">${p.concentration}</text>
    
    <!-- Collection Origin Stamp -->
    <rect x="40" y="202" width="190" height="20" rx="3" fill="#EFE8DF" />
    <text x="135" y="215" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="600" fill="#6B5438" letter-spacing="1.5" text-anchor="middle">${p.accentTag}</text>

    <text x="135" y="238" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="500" fill="#8C857B" letter-spacing="2" text-anchor="middle">100 ML • 3.4 FL. OZ. • HANDCRAFTED IN INDIA</text>
  </g>

  <!-- Front Bottle Glass Reflection Arc -->
  <path d="M 235 370 Q 300 450 300 830" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" opacity="0.35" />
</svg>`;
}

for (const p of perfumes) {
  const svg = generatePerfumeSvg(p);
  const filePath = path.join(targetDir, `${p.id}.svg`);
  fs.writeFileSync(filePath, svg, 'utf8');
  console.log(`Generated perfume image: ${p.id}.svg`);
}

// Copy also to backend/uploads so it's accessible via backend static files too
const backendUploads = path.resolve(__dirname, '../../../backend/uploads');
for (const p of perfumes) {
  const srcPath = path.join(targetDir, `${p.id}.svg`);
  const destPath = path.join(backendUploads, `${p.id}.svg`);
  fs.copyFileSync(srcPath, destPath);
}
console.log('All perfume images generated successfully!');
