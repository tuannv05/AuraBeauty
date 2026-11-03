const fs = require('fs');
const path = require('path');

// Color palettes for brand silhouettes and formulas
const BRAND_THEMES = {
  'cerave': { primary: '#0072ce', secondary: '#ffffff', accent: '#002f6c', cap: '#ffffff', body: '#ffffff' },
  'la roche-posay': { primary: '#009ee3', secondary: '#ffffff', accent: '#004b79', cap: '#ffffff', body: '#ffffff' },
  'bioderma': { primary: '#e6007e', secondary: '#ffffff', accent: '#008375', cap: '#e6007e', body: '#ffffff' },
  'the ordinary': { primary: '#111111', secondary: '#f4f4f4', accent: '#666666', cap: '#ffffff', body: '#ffffff' },
  'cosrx': { primary: '#e11d48', secondary: '#ffffff', accent: '#111827', cap: '#111827', body: '#ffffff' },
  'innisfree': { primary: '#15803d', secondary: '#f0fdf4', accent: '#166534', cap: '#ffffff', body: '#f0fdf4' },
  'cocoon': { primary: '#854d0e', secondary: '#fefce8', accent: '#ca8a04', cap: '#451a03', body: '#fefce8' },
  'paula\'s choice': { primary: '#1e293b', secondary: '#334155', accent: '#0284c7', cap: '#334155', body: '#1e293b' },
  'klairs': { primary: '#78716c', secondary: '#fafaf9', accent: '#44403c', cap: '#78716c', body: '#fafaf9' },
  'skin1004': { primary: '#d97706', secondary: '#fffbeb', accent: '#b45309', cap: '#ffffff', body: '#fffbeb' },
  'anessa': { primary: '#ca8a04', secondary: '#fef08a', accent: '#eab308', cap: '#ca8a04', body: '#fef08a' },
  'mac': { primary: '#000000', secondary: '#1c1917', accent: '#d4af37', cap: '#000000', body: '#000000' },
  '3ce': { primary: '#e11d48', secondary: '#fff1f2', accent: '#be123c', cap: '#1c1917', body: '#fff1f2' },
  'romand': { primary: '#be185d', secondary: '#fdf2f8', accent: '#9d174d', cap: '#fce7f3', body: '#fdf2f8' },
  'maybelline': { primary: '#be123c', secondary: '#0f172a', accent: '#f43f5e', cap: '#0f172a', body: '#0f172a' },
  'l\'oréal': { primary: '#b45309', secondary: '#000000', accent: '#f59e0b', cap: '#000000', body: '#ffffff' },
  'dior': { primary: '#09090b', secondary: '#fafafa', accent: '#d4af37', cap: '#09090b', body: '#fafafa' },
  'chanel': { primary: '#000000', secondary: '#ffffff', accent: '#e2e8f0', cap: '#000000', body: '#ffffff' },
  'senka': { primary: '#1d4ed8', secondary: '#eff6ff', accent: '#2563eb', cap: '#1d4ed8', body: '#eff6ff' },
  'hada labo': { primary: '#0284c7', secondary: '#f0f9ff', accent: '#0369a1', cap: '#0284c7', body: '#ffffff' },
  'svr': { primary: '#059669', secondary: '#ecfdf5', accent: '#047857', cap: '#059669', body: '#ffffff' },
  'vichy': { primary: '#0284c7', secondary: '#ffffff', accent: '#0369a1', cap: '#0284c7', body: '#ffffff' },
  'cetaphil': { primary: '#0284c7', secondary: '#22c55e', accent: '#0369a1', cap: '#22c55e', body: '#ffffff' },
  'dhc': { primary: '#1e3a8a', secondary: '#ffffff', accent: '#3b82f6', cap: '#ffffff', body: '#ffffff' }
};

function getBrandTheme(brandName) {
  const key = (brandName || '').toLowerCase().trim();
  for (const [k, v] of Object.entries(BRAND_THEMES)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return { primary: '#27272a', secondary: '#ffffff', accent: '#f43f5e', cap: '#27272a', body: '#ffffff' };
}

function escapeXml(unsafe) {
  return String(unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Determine container type
 */
function classifyContainer(p) {
  const cat = (p.category || '').toLowerCase();
  const subCat = (p.subCategory || '').toLowerCase();
  const name = (p.name || '').toLowerCase();
  const tex = (p.formulationTexture || '').toLowerCase();

  if (cat.includes('lipstick') || subCat.includes('son')) {
    if (name.includes('tint') || name.includes('kem') || name.includes('bóng') || name.includes('vinyl') || name.includes('water')) {
      return 'LIP_TINT';
    }
    return 'LIPSTICK_BULLET';
  }

  if (cat.includes('eyeshadow') || subCat.includes('phấn mắt') || name.includes('bảng mắt')) {
    return 'EYESHADOW_PALETTE';
  }

  if (cat.includes('blush') || subCat.includes('má hồng') || name.includes('phấn phủ') || name.includes('cushion') || name.includes('powder')) {
    return 'BLUSH_COMPACT';
  }

  if (cat.includes('foundation') || subCat.includes('kem nền') || name.includes('foundation')) {
    return 'FOUNDATION_PUMP';
  }

  if (name.includes('serum') || name.includes('tinh chất') || name.includes('essence') || name.includes('ampoule') || tex.includes('oil')) {
    return 'SERUM_DROPPER';
  }

  if (name.includes('kem chống nắng') || name.includes('sunscreen') || name.includes('sun milk')) {
    return 'SUNSCREEN_FLAT';
  }

  if (name.includes('hũ') || name.includes('kem dưỡng') || name.includes('mặt nạ') || name.includes('sleeping mask') || name.includes('scrub') || name.includes('tẩy tế bào chết toàn thân') || name.includes('muối tắm')) {
    if (!name.includes('tuýp') && !name.includes('tube')) {
      return 'CREAM_JAR';
    }
  }

  if (name.includes('nước hoa') || cat.includes('nước hoa') || name.includes('fragrance') || name.includes('parfum') || name.includes('eau de')) {
    return 'PERFUME_BOTTLE';
  }

  if (name.includes('viên uống') || cat.includes('thực phẩm chức năng') || name.includes('collagen') || name.includes('white c')) {
    return 'SUPPLEMENT_BOTTLE';
  }

  if (name.includes('máy rửa mặt') || name.includes('máy đẩy') || name.includes('luna') || name.includes('massage') || name.includes('bông tẩy trang') || name.includes('kẻ mắt') || name.includes('mascara') || name.includes('eyebrow')) {
    return 'BEAUTY_DEVICE';
  }

  if (name.includes('sữa tắm') || name.includes('dưỡng thể') || name.includes('body wash') || name.includes('body lotion') || name.includes('dầu gội') || name.includes('dầu xả') || name.includes('shampoo')) {
    return 'BODY_LOTION_PUMP';
  }

  if (name.includes('toner') || name.includes('nước cân bằng') || name.includes('tẩy trang') || name.includes('micellar') || name.includes('lotion')) {
    return 'TONER_CYLINDER';
  }

  // Default for cleansers / tubes
  return 'CLEANSER_TUBE';
}

/**
 * Extract display metadata
 */
function getProductPackInfo(p) {
  const brand = (p.brand || 'AURA').toUpperCase();
  const theme = getBrandTheme(brand);

  // Extract key line name
  let lineName = p.name;
  lineName = lineName.replace(new RegExp(`^(${p.brand}|${p.brand.toUpperCase()})\\s*`, 'i'), '');
  const words = lineName.split(/\s+/).slice(0, 5).join(' ');

  // Extract volume
  const volMatch = p.name.match(/(\d+\s*(?:ml|g|viên|miếng|fl\.?\s*oz))/i) || 
                   (p.variants && p.variants[0] && p.variants[0].name ? p.variants[0].name.match(/(\d+\s*(?:ml|g|viên))/i) : null);
  const volume = volMatch ? volMatch[0].toUpperCase() : '50 ML';

  // Extract origin
  const origin = (p.originCountry || p.origin || 'KOREA').toUpperCase();

  // Extract hex color for makeup
  let hexColor = '#e11d48';
  if (p.vtoConfig && p.vtoConfig.shades && p.vtoConfig.shades.length > 0 && p.vtoConfig.shades[0].hexColor) {
    hexColor = p.vtoConfig.shades[0].hexColor;
  } else if (p.category === 'Foundation') {
    hexColor = '#eab696';
  } else if (p.category === 'Blush') {
    hexColor = '#f472b6';
  } else if (p.category === 'Eyeshadow') {
    hexColor = '#b45309';
  }

  // Actives / subtitles
  const active = p.keyActiveGroups && p.keyActiveGroups.length > 0 ? p.keyActiveGroups[0].replace(/_/g, ' ') : 'DERMATOLOGICAL CARE';

  return {
    brand,
    lineName: words,
    fullName: p.name,
    volume,
    origin,
    theme,
    hexColor,
    active
  };
}

/**
 * Base studio scene with radial lighting and drop shadow
 */
function createStudioScene(content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <!-- Studio Background Gradient -->
    <radialGradient id="studioLighting" cx="50%" cy="40%" r="65%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="60%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#e2e8f0" />
    </radialGradient>

    <!-- Glass Specular Highlight -->
    <linearGradient id="glassSpecular" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45" />
      <stop offset="25%" stop-color="#ffffff" stop-opacity="0.1" />
      <stop offset="70%" stop-color="#ffffff" stop-opacity="0" />
      <stop offset="90%" stop-color="#ffffff" stop-opacity="0.3" />
    </linearGradient>

    <!-- Metallic Gold Highlight -->
    <linearGradient id="goldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="35%" stop-color="#ca8a04" />
      <stop offset="70%" stop-color="#fef9c3" />
      <stop offset="100%" stop-color="#a16207" />
    </linearGradient>

    <!-- Soft Drop Shadow Filter -->
    <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="18" stdDeviation="14" flood-color="#0f172a" flood-opacity="0.16" />
    </filter>

    <filter id="blurFilter" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="10" />
    </filter>
  </defs>

  <!-- Studio Backdrop -->
  <rect width="800" height="800" fill="url(#studioLighting)" />

  <!-- Studio Pedestal Floor Reflection -->
  <ellipse cx="400" cy="710" rx="220" ry="24" fill="#cbd5e1" opacity="0.35" filter="url(#blurFilter)" />
  <ellipse cx="400" cy="705" rx="150" ry="14" fill="#64748b" opacity="0.25" filter="url(#blurFilter)" />

  ${content}

  <!-- Aura Luxury Stamp -->
  <g transform="translate(400, 770)" text-anchor="middle" opacity="0.6">
    <text font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#94a3b8" letter-spacing="4">
      AURA BEAUTY MALL • 100% AUTHENTIC PACKSHOT
    </text>
  </g>
</svg>`;
}

// -------------------------------------------------------------
// SILHOUETTE 1: SERUM DROPPER BOTTLE
// -------------------------------------------------------------
function renderSerumDropper(info) {
  const liquidColor = info.theme.primary === '#000000' || info.theme.primary === '#111111' 
    ? '#e0f2fe' 
    : info.theme.secondary !== '#ffffff' ? info.theme.secondary : '#e2e8f0';

  return `
    <g id="serum-bottle" filter="url(#softShadow)">
      <!-- Dropper Pipette / Bulb -->
      <path d="M375,130 C375,105 425,105 425,130 L420,165 L380,165 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />
      <rect x="372" y="165" width="56" height="26" rx="4" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2" />
      
      <!-- Collar Ring -->
      <rect x="364" y="190" width="72" height="30" rx="3" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5" />
      <line x1="364" y1="205" x2="436" y2="205" stroke="#e2e8f0" stroke-width="2" />

      <!-- Bottle Neck -->
      <rect x="374" y="220" width="52" height="22" fill="#e2e8f0" opacity="0.7" />

      <!-- Glass Bottle Body (Rounded Cylinder) -->
      <rect x="310" y="242" width="180" height="420" rx="32" fill="${liquidColor}" stroke="#94a3b8" stroke-width="2" />
      
      <!-- Specular Highlighting on Glass -->
      <rect x="312" y="244" width="176" height="416" rx="30" fill="url(#glassSpecular)" />
      <rect x="325" y="255" width="16" height="390" rx="8" fill="#ffffff" opacity="0.5" />

      <!-- Bottle Label -->
      <g transform="translate(325, 310)">
        <rect width="150" height="280" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="url(#softShadow)" />
        
        <!-- Brand Header -->
        <text x="75" y="42" font-family="'Helvetica Neue', Arial, sans-serif" font-size="14" font-weight="900" fill="${info.theme.primary}" text-anchor="middle" letter-spacing="2">
          ${escapeXml(info.brand)}
        </text>
        <line x1="25" y1="52" x2="125" y2="52" stroke="${info.theme.primary}" stroke-width="1.5" />

        <!-- Product Line -->
        <text x="75" y="85" font-family="'Helvetica Neue', Arial, sans-serif" font-size="13" font-weight="700" fill="#0f172a" text-anchor="middle">
          ${escapeXml(info.lineName.slice(0, 18))}
        </text>
        <text x="75" y="105" font-family="'Helvetica Neue', Arial, sans-serif" font-size="11" font-weight="600" fill="#475569" text-anchor="middle">
          ${escapeXml(info.lineName.slice(18, 38))}
        </text>

        <!-- Active Focus Formula -->
        <rect x="18" y="130" width="114" height="34" rx="4" fill="${info.theme.primary}" opacity="0.08" />
        <text x="75" y="152" font-family="'Helvetica Neue', Arial, sans-serif" font-size="10.5" font-weight="700" fill="${info.theme.primary}" text-anchor="middle">
          ${escapeXml(info.active.slice(0, 16))}
        </text>

        <!-- Spec & Volume Details -->
        <text x="75" y="220" font-family="'Helvetica Neue', Arial, sans-serif" font-size="11" font-weight="750" fill="#0f172a" text-anchor="middle" letter-spacing="1">
          ${escapeXml(info.volume)}
        </text>
        <text x="75" y="245" font-family="'Helvetica Neue', Arial, sans-serif" font-size="9" font-weight="600" fill="#94a3b8" text-anchor="middle" letter-spacing="1.5">
          MADE IN ${escapeXml(info.origin)}
        </text>
      </g>
    </g>
  `;
}

// -------------------------------------------------------------
// SILHOUETTE 2: CLEANSER / TREATMENT SQUEEZE TUBE
// -------------------------------------------------------------
function renderCleanserTube(info) {
  return `
    <g id="cleanser-tube" filter="url(#softShadow)">
      <!-- Tube Crimp Top Seal -->
      <polygon points="320,160 480,160 475,175 325,175" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1.5" />
      <line x1="335" y1="167" x2="465" y2="167" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3,3" />

      <!-- Tube Body -->
      <path d="M325,175 L475,175 L455,570 L345,570 Z" fill="${info.theme.body}" stroke="#cbd5e1" stroke-width="2" />
      
      <!-- Brand Accent Stripe -->
      <polygon points="328,210 472,210 470,224 330,224" fill="${info.theme.primary}" />
      
      <!-- Flip Top Cap Base -->
      <rect x="350" y="570" width="100" height="75" rx="8" fill="${info.theme.cap}" stroke="#94a3b8" stroke-width="2" />
      <line x1="350" y1="605" x2="450" y2="605" stroke="#cbd5e1" stroke-width="2" />

      <!-- Central Label Typography -->
      <g transform="translate(400, 260)" text-anchor="middle">
        <text y="30" font-family="'Helvetica Neue', Arial, sans-serif" font-size="18" font-weight="900" fill="${info.theme.primary}" letter-spacing="2">
          ${escapeXml(info.brand)}
        </text>
        <rect x="-40" y="42" width="80" height="3" fill="${info.theme.accent}" />

        <text y="90" font-family="'Helvetica Neue', Arial, sans-serif" font-size="15" font-weight="800" fill="#0f172a">
          ${escapeXml(info.lineName.slice(0, 20))}
        </text>
        <text y="112" font-family="'Helvetica Neue', Arial, sans-serif" font-size="12" font-weight="600" fill="#64748b">
          ${escapeXml(info.lineName.slice(20, 42))}
        </text>

        <!-- Dermatological Verification Badge -->
        <rect x="-65" y="145" width="130" height="28" rx="6" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5" />
        <text y="163" font-family="'Helvetica Neue', Arial, sans-serif" font-size="10" font-weight="750" fill="${info.theme.primary}">
          DERMATOLOGIST TESTED
        </text>

        <text y="240" font-family="'Helvetica Neue', Arial, sans-serif" font-size="13" font-weight="750" fill="#334155" letter-spacing="1">
          ${escapeXml(info.volume)}
        </text>
        <text y="262" font-family="'Helvetica Neue', Arial, sans-serif" font-size="9" font-weight="600" fill="#94a3b8" letter-spacing="1">
          LABORATOIRE DERMATOLOGIQUE • ${escapeXml(info.origin)}
        </text>
      </g>
    </g>
  `;
}

// -------------------------------------------------------------
// SILHOUETTE 3: BULLET LIPSTICK WITH ARTISTIC SWATCH
// -------------------------------------------------------------
function renderLipstickBullet(info) {
  const bulletColor = info.hexColor;

  return `
    <g id="bullet-lipstick" filter="url(#softShadow)">
      <!-- Swatch Streak Beside Lipstick -->
      <path d="M470,280 C560,250 540,430 510,480 C480,520 460,500 480,440 Z" fill="${bulletColor}" opacity="0.85" filter="url(#softShadow)" />

      <!-- Lipstick Base Case (Outer Tube) -->
      <rect x="330" y="440" width="140" height="240" rx="16" fill="#111827" stroke="#374151" stroke-width="2" />
      <rect x="335" y="445" width="130" height="230" rx="12" fill="url(#glassSpecular)" opacity="0.2" />

      <!-- Inner Metallic Gold / Chrome Barrel -->
      <rect x="345" y="320" width="110" height="130" rx="4" fill="url(#goldMetallic)" stroke="#ca8a04" stroke-width="1.5" />

      <!-- Lipstick Bullet (Angled Cut Teardrop Tip) -->
      <path d="M355,325 L445,325 L445,230 L395,170 L355,230 Z" fill="${bulletColor}" stroke="#881337" stroke-width="1.5" />
      <!-- Bullet Highlight Sheen -->
      <path d="M365,320 L395,185 L415,220 L375,320 Z" fill="#ffffff" opacity="0.25" />

      <!-- Brand Logo on Case -->
      <g transform="translate(400, 530)" text-anchor="middle">
        <text y="10" font-family="'Helvetica Neue', Arial, sans-serif" font-size="18" font-weight="900" fill="#ffffff" letter-spacing="3">
          ${escapeXml(info.brand)}
        </text>
        <line x1="-30" y1="22" x2="30" y2="22" stroke="#d4af37" stroke-width="1.5" />

        <text y="50" font-family="'Helvetica Neue', Arial, sans-serif" font-size="12" font-weight="700" fill="#fbcfe8">
          ${escapeXml(info.lineName.slice(0, 18))}
        </text>
        
        <!-- Shade HEX Badge -->
        <rect x="-45" y="70" width="90" height="26" rx="13" fill="#000000" stroke="#d4af37" stroke-width="1" />
        <circle cx="-25" cy="83" r="6" fill="${bulletColor}" stroke="#ffffff" stroke-width="1" />
        <text x="8" y="87" font-family="'Helvetica Neue', Arial, sans-serif" font-size="10" font-weight="750" fill="#ffffff">
          ${info.hexColor}
        </text>
      </g>
    </g>
  `;
}

// -------------------------------------------------------------
// SILHOUETTE 4: LIQUID LIP TINT WITH WAND & GLOSS SWATCH
// -------------------------------------------------------------
function renderLipTint(info) {
  const tintColor = info.hexColor;

  return `
    <g id="lip-tint" filter="url(#softShadow)">
      <!-- Liquid Swatch Wave -->
      <path d="M470,220 C560,180 570,390 490,440 C430,480 470,360 480,270 Z" fill="${tintColor}" opacity="0.88" />

      <!-- Applicator Wand pulled out -->
      <rect x="475" y="150" width="10" height="160" rx="3" fill="#e2e8f0" stroke="#cbd5e1" />
      <polygon points="473,310 487,310 483,335 477,335" fill="${tintColor}" stroke="#881337" stroke-width="1" />

      <!-- Lip Tint Cap / Wand Handle -->
      <rect x="330" y="180" width="120" height="150" rx="12" fill="${info.theme.cap}" stroke="#cbd5e1" stroke-width="2" />

      <!-- Frosted Bottle Body -->
      <rect x="330" y="325" width="120" height="320" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" />
      
      <!-- Liquid Product inside (revealed through frosted glass) -->
      <rect x="342" y="380" width="96" height="245" rx="10" fill="${tintColor}" opacity="0.92" />
      <rect x="342" y="380" width="96" height="245" rx="10" fill="url(#glassSpecular)" opacity="0.4" />

      <!-- Typography on Bottle -->
      <g transform="translate(390, 480)" text-anchor="middle">
        <text y="0" font-family="'Helvetica Neue', Arial, sans-serif" font-size="15" font-weight="900" fill="#ffffff" letter-spacing="2">
          ${escapeXml(info.brand)}
        </text>
        <text y="24" font-family="'Helvetica Neue', Arial, sans-serif" font-size="11" font-weight="700" fill="#ffffff">
          ${escapeXml(info.lineName.slice(0, 16))}
        </text>
        <rect x="-35" y="40" width="70" height="20" rx="10" fill="rgba(0,0,0,0.4)" />
        <text y="54" font-family="'Helvetica Neue', Arial, sans-serif" font-size="9" font-weight="750" fill="#ffffff">
          ${info.hexColor}
        </text>
      </g>
    </g>
  `;
}

// -------------------------------------------------------------
// SILHOUETTE 5: LUXURY CREAM / SCRUB JAR
// -------------------------------------------------------------
function renderCreamJar(info) {
  const jarColor = info.brand === 'COCOON' ? '#451a03' : info.theme.body;

  return `
    <g id="cream-jar" filter="url(#softShadow)">
      <!-- Lid / Cap -->
      <ellipse cx="400" cy="330" rx="170" ry="30" fill="${info.theme.cap}" stroke="#94a3b8" stroke-width="2" />
      <rect x="230" y="330" width="340" height="50" fill="${info.theme.cap}" stroke="#94a3b8" stroke-width="2" />
      <ellipse cx="400" cy="380" rx="170" ry="25" fill="${info.theme.cap}" />
      <!-- Metallic rim highlight -->
      <ellipse cx="400" cy="330" rx="160" ry="22" fill="url(#glassSpecular)" opacity="0.6" />

      <!-- Jar Body Base -->
      <path d="M240,380 L560,380 C550,580 520,630 400,630 C280,630 250,580 240,380 Z" fill="${jarColor}" stroke="#94a3b8" stroke-width="2.5" />
      <ellipse cx="400" cy="625" rx="150" ry="20" fill="#000000" opacity="0.1" />

      <!-- Jar Label Panel -->
      <rect x="270" y="420" width="260" height="150" rx="10" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="url(#softShadow)" />
      
      <g transform="translate(400, 455)" text-anchor="middle">
        <text y="15" font-family="'Helvetica Neue', Arial, sans-serif" font-size="18" font-weight="900" fill="${info.theme.primary}" letter-spacing="2">
          ${escapeXml(info.brand)}
        </text>
        <line x1="-50" y1="26" x2="50" y2="26" stroke="${info.theme.primary}" stroke-width="1.5" />

        <text y="55" font-family="'Helvetica Neue', Arial, sans-serif" font-size="13" font-weight="800" fill="#0f172a">
          ${escapeXml(info.lineName.slice(0, 24))}
        </text>
        <text y="75" font-family="'Helvetica Neue', Arial, sans-serif" font-size="11" font-weight="600" fill="#64748b">
          INTENSIVE MOISTURIZING REPAIR
        </text>

        <text y="105" font-family="'Helvetica Neue', Arial, sans-serif" font-size="12" font-weight="750" fill="#334155" letter-spacing="1">
          ${escapeXml(info.volume)} • ${escapeXml(info.origin)}
        </text>
      </g>
    </g>
  `;
}

// -------------------------------------------------------------
// SILHOUETTE 6: TONER / MICELLAR WATER CYLINDER BOTTLE
// -------------------------------------------------------------
function renderTonerCylinder(info) {
  return `
    <g id="toner-cylinder" filter="url(#softShadow)">
      <!-- Flip Top / Pump Cap -->
      <rect x="360" y="160" width="80" height="40" rx="6" fill="${info.theme.cap}" stroke="#94a3b8" stroke-width="2" />
      <line x1="360" y1="185" x2="440" y2="185" stroke="#ffffff" stroke-width="2" />

      <!-- Bottle Neck -->
      <rect x="375" y="200" width="50" height="25" fill="#e2e8f0" stroke="#cbd5e1" />

      <!-- Bottle Curved Shoulder -->
      <path d="M375,225 C375,250 310,260 310,290 L310,640 C310,665 490,665 490,640 L490,290 C490,260 425,250 425,225 Z" fill="#ffffff" stroke="#94a3b8" stroke-width="2" />
      
      <!-- Liquid Level and Sheen -->
      <rect x="315" y="300" width="170" height="335" rx="8" fill="url(#glassSpecular)" opacity="0.45" />

      <!-- Label Wrap -->
      <rect x="320" y="330" width="160" height="250" rx="6" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" />

      <g transform="translate(400, 370)" text-anchor="middle">
        <text y="20" font-family="'Helvetica Neue', Arial, sans-serif" font-size="16" font-weight="900" fill="${info.theme.primary}" letter-spacing="2">
          ${escapeXml(info.brand)}
        </text>
        <line x1="-35" y1="30" x2="35" y2="30" stroke="${info.theme.primary}" stroke-width="1.5" />

        <text y="65" font-family="'Helvetica Neue', Arial, sans-serif" font-size="14" font-weight="800" fill="#0f172a">
          ${escapeXml(info.lineName.slice(0, 18))}
        </text>
        <text y="88" font-family="'Helvetica Neue', Arial, sans-serif" font-size="11" font-weight="600" fill="#64748b">
          ${escapeXml(info.lineName.slice(18, 36))}
        </text>

        <rect x="-55" y="110" width="110" height="26" rx="4" fill="${info.theme.primary}" opacity="0.1" />
        <text y="127" font-family="'Helvetica Neue', Arial, sans-serif" font-size="10" font-weight="750" fill="${info.theme.primary}">
          CALMING &amp; HYDRATING
        </text>

        <text y="180" font-family="'Helvetica Neue', Arial, sans-serif" font-size="12" font-weight="750" fill="#334155" letter-spacing="1">
          ${escapeXml(info.volume)}
        </text>
        <text y="200" font-family="'Helvetica Neue', Arial, sans-serif" font-size="9" font-weight="600" fill="#94a3b8">
          MADE IN ${escapeXml(info.origin)}
        </text>
      </g>
    </g>
  `;
}

// -------------------------------------------------------------
// SILHOUETTE 7: FOUNDATION PUMP BOTTLE
// -------------------------------------------------------------
function renderFoundationPump(info) {
  const shadeColor = info.hexColor || '#f3c5a6';

  return `
    <g id="foundation-bottle" filter="url(#softShadow)">
      <!-- Pump Head -->
      <path d="M375,150 L425,150 L425,175 L445,175 L445,190 L425,190 L425,210 L375,210 Z" fill="#111827" stroke="#374151" stroke-width="2" />
      <rect x="365" y="210" width="70" height="35" rx="3" fill="#d4af37" stroke="#ca8a04" stroke-width="1.5" />

      <!-- Bottle Neck -->
      <rect x="375" y="245" width="50" height="15" fill="#e2e8f0" />

      <!-- Frosted Glass Bottle Body showing foundation color -->
      <rect x="320" y="260" width="160" height="380" rx="16" fill="${shadeColor}" stroke="#94a3b8" stroke-width="2" />
      <rect x="320" y="260" width="160" height="380" rx="16" fill="url(#glassSpecular)" opacity="0.5" />

      <!-- Foundation Drop Swatch next to bottle -->
      <ellipse cx="520" cy="460" rx="28" ry="40" fill="${shadeColor}" stroke="#ca8a04" stroke-width="1" filter="url(#softShadow)" />

      <!-- Front Silk-Screen Typography -->
      <g transform="translate(400, 360)" text-anchor="middle">
        <text y="20" font-family="'Helvetica Neue', Arial, sans-serif" font-size="18" font-weight="900" fill="#000000" letter-spacing="2">
          ${escapeXml(info.brand)}
        </text>
        <text y="55" font-family="'Helvetica Neue', Arial, sans-serif" font-size="14" font-weight="800" fill="#0f172a">
          ${escapeXml(info.lineName.slice(0, 18))}
        </text>
        <text y="75" font-family="'Helvetica Neue', Arial, sans-serif" font-size="11" font-weight="600" fill="#334155">
          24H LONGWEAR FLAWLESS
        </text>

        <rect x="-40" y="110" width="80" height="24" rx="12" fill="#000000" />
        <text y="126" font-family="'Helvetica Neue', Arial, sans-serif" font-size="10" font-weight="750" fill="#ffffff">
          SPF 25 / PA+++
        </text>

        <text y="200" font-family="'Helvetica Neue', Arial, sans-serif" font-size="12" font-weight="750" fill="#000000" letter-spacing="1">
          ${escapeXml(info.volume)} • ${escapeXml(info.origin)}
        </text>
      </g>
    </g>
  `;
}

// -------------------------------------------------------------
// SILHOUETTE 8: CUSHION / BLUSH COMPACT
// -------------------------------------------------------------
function renderBlushCompact(info) {
  const panColor = info.hexColor || '#fb7185';

  return `
    <g id="blush-compact" filter="url(#softShadow)">
      <!-- Opened Mirror Lid -->
      <ellipse cx="400" cy="240" rx="170" ry="110" fill="#1e293b" stroke="#475569" stroke-width="2" />
      <ellipse cx="400" cy="240" rx="150" ry="95" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
      <!-- Mirror Reflection Highlight -->
      <path d="M300,180 L500,280" stroke="#ffffff" stroke-width="4" opacity="0.6" stroke-linecap="round" />

      <!-- Lower Pan Case -->
      <ellipse cx="400" cy="460" rx="180" ry="120" fill="#0f172a" stroke="#334155" stroke-width="2.5" />
      
      <!-- Color Powder / Cushion Pan -->
      <ellipse cx="400" cy="460" rx="145" ry="95" fill="${panColor}" stroke="#ca8a04" stroke-width="2" />
      <!-- Subtle embossed texture -->
      <ellipse cx="400" cy="460" rx="110" ry="70" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.3" stroke-dasharray="4,4" />

      <!-- Brand Stamp inside or below -->
      <g transform="translate(400, 465)" text-anchor="middle">
        <text y="0" font-family="'Helvetica Neue', Arial, sans-serif" font-size="16" font-weight="900" fill="#ffffff" letter-spacing="3">
          ${escapeXml(info.brand)}
        </text>
        <text y="20" font-family="'Helvetica Neue', Arial, sans-serif" font-size="10" font-weight="750" fill="#fbcfe8" letter-spacing="1">
          ${escapeXml(info.lineName.slice(0, 16))}
        </text>
      </g>
    </g>
  `;
}

// -------------------------------------------------------------
// SILHOUETTE 9: EYESHADOW PALETTE
// -------------------------------------------------------------
function renderEyeshadowPalette(info) {
  const shades = ['#b45309', '#d97706', '#f59e0b', '#fde68a', '#be185d', '#9d174d'];

  return `
    <g id="eyeshadow-palette" filter="url(#softShadow)">
      <!-- Palette Outer Case -->
      <rect x="230" y="240" width="340" height="380" rx="20" fill="#1c1917" stroke="#44403c" stroke-width="3" />
      <rect x="240" y="250" width="320" height="360" rx="14" fill="#292524" />

      <!-- Palette Pans (6 distinct shades) -->
      <g transform="translate(265, 330)">
        <rect x="0" y="0" width="80" height="80" rx="8" fill="${shades[0]}" stroke="#d4af37" stroke-width="1" />
        <rect x="100" y="0" width="80" height="80" rx="8" fill="${shades[1]}" stroke="#d4af37" stroke-width="1" />
        <rect x="200" y="0" width="80" height="80" rx="8" fill="${shades[2]}" stroke="#d4af37" stroke-width="1" />

        <rect x="0" y="100" width="80" height="80" rx="8" fill="${shades[3]}" stroke="#d4af37" stroke-width="1" />
        <rect x="100" y="100" width="80" height="80" rx="8" fill="${shades[4]}" stroke="#d4af37" stroke-width="1" />
        <rect x="200" y="100" width="80" height="80" rx="8" fill="${shades[5]}" stroke="#d4af37" stroke-width="1" />
      </g>

      <!-- Brand Header on Lid -->
      <g transform="translate(400, 290)" text-anchor="middle">
        <text y="0" font-family="'Helvetica Neue', Arial, sans-serif" font-size="16" font-weight="900" fill="#d4af37" letter-spacing="3">
          ${escapeXml(info.brand)}
        </text>
        <text y="20" font-family="'Helvetica Neue', Arial, sans-serif" font-size="10" font-weight="700" fill="#a8a29e">
          ${escapeXml(info.lineName.slice(0, 24))}
        </text>
      </g>
    </g>
  `;
}

// -------------------------------------------------------------
// SILHOUETTE 10: LUXURY PERFUME BOTTLE
// -------------------------------------------------------------
function renderPerfumeBottle(info) {
  return `
    <g id="perfume-bottle" filter="url(#softShadow)">
      <!-- Atomizer Sprayer & Cap -->
      <rect x="365" y="180" width="70" height="70" rx="10" fill="url(#goldMetallic)" stroke="#ca8a04" stroke-width="1.5" />
      <rect x="385" y="150" width="30" height="30" rx="4" fill="#ffffff" opacity="0.8" />

      <!-- Flacon Glass Body (Faceted Luxury Cut) -->
      <polygon points="310,260 490,260 520,620 280,620" fill="#fdf2f8" stroke="#94a3b8" stroke-width="2" />
      <polygon points="310,260 490,260 520,620 280,620" fill="url(#glassSpecular)" opacity="0.6" />

      <!-- Fragrance Label Plaque -->
      <rect x="330" y="360" width="140" height="150" rx="6" fill="#ffffff" stroke="#d4af37" stroke-width="2" filter="url(#softShadow)" />

      <g transform="translate(400, 410)" text-anchor="middle">
        <text y="15" font-family="'Helvetica Neue', Arial, sans-serif" font-size="17" font-weight="900" fill="#000000" letter-spacing="3">
          ${escapeXml(info.brand)}
        </text>
        <line x1="-30" y1="26" x2="30" y2="26" stroke="#d4af37" stroke-width="1.5" />

        <text y="55" font-family="'Helvetica Neue', Arial, sans-serif" font-size="12" font-weight="800" fill="#0f172a">
          ${escapeXml(info.lineName.slice(0, 18))}
        </text>
        <text y="75" font-family="'Helvetica Neue', Arial, sans-serif" font-size="9" font-weight="600" fill="#64748b" letter-spacing="2">
          EAU DE PARFUM
        </text>

        <text y="115" font-family="'Helvetica Neue', Arial, sans-serif" font-size="10" font-weight="750" fill="#000000" letter-spacing="1">
          ${escapeXml(info.volume)} • ${escapeXml(info.origin)}
        </text>
      </g>
    </g>
  `;
}

// -------------------------------------------------------------
// SILHOUETTE 11: SUPPLEMENTS PILL BOTTLE
// -------------------------------------------------------------
function renderSupplementBottle(info) {
  return `
    <g id="supplement-bottle" filter="url(#softShadow)">
      <!-- Tamper Evident Cap -->
      <rect x="330" y="200" width="140" height="55" rx="8" fill="#ffffff" stroke="#94a3b8" stroke-width="2" />
      <line x1="330" y1="225" x2="470" y2="225" stroke="#cbd5e1" stroke-width="2" />

      <!-- Bottle Body -->
      <rect x="300" y="255" width="200" height="380" rx="20" fill="#ffffff" stroke="#94a3b8" stroke-width="2" />
      <rect x="300" y="255" width="200" height="380" rx="20" fill="url(#glassSpecular)" opacity="0.3" />

      <!-- Label Wrap -->
      <rect x="305" y="300" width="190" height="280" rx="4" fill="${info.theme.primary}" />
      
      <g transform="translate(400, 360)" text-anchor="middle">
        <text y="15" font-family="'Helvetica Neue', Arial, sans-serif" font-size="20" font-weight="900" fill="#ffffff" letter-spacing="3">
          ${escapeXml(info.brand)}
        </text>
        <line x1="-50" y1="28" x2="50" y2="28" stroke="#ffffff" stroke-width="1.5" />

        <text y="65" font-family="'Helvetica Neue', Arial, sans-serif" font-size="15" font-weight="800" fill="#fef08a">
          ${escapeXml(info.lineName.slice(0, 18))}
        </text>
        <text y="88" font-family="'Helvetica Neue', Arial, sans-serif" font-size="12" font-weight="600" fill="#ffffff">
          INNER BEAUTY SUPPLEMENT
        </text>

        <rect x="-60" y="120" width="120" height="30" rx="6" fill="#ffffff" />
        <text y="140" font-family="'Helvetica Neue', Arial, sans-serif" font-size="12" font-weight="900" fill="${info.theme.primary}">
          ${escapeXml(info.volume)}
        </text>

        <text y="195" font-family="'Helvetica Neue', Arial, sans-serif" font-size="11" font-weight="750" fill="#ffffff" letter-spacing="1">
          GMP CERTIFIED • ${escapeXml(info.origin)}
        </text>
      </g>
    </g>
  `;
}

// -------------------------------------------------------------
// SILHOUETTE 12: BEAUTY DEVICE (FOREO / YA-MAN / TOOLS)
// -------------------------------------------------------------
function renderBeautyDevice(info) {
  return `
    <g id="beauty-device" filter="url(#softShadow)">
      <!-- Device Silhouette (Ergonomic Silicone Egg / Wand) -->
      <path d="M330,300 C330,190 470,190 470,300 L470,540 C470,620 330,620 330,540 Z" fill="#f43f5e" stroke="#e11d48" stroke-width="2" />
      
      <!-- Silicone Sonic Bristles Area -->
      <g fill="#fda4af">
        <circle cx="360" cy="260" r="4" /><circle cx="380" cy="260" r="4" /><circle cx="400" cy="260" r="4" /><circle cx="420" cy="260" r="4" /><circle cx="440" cy="260" r="4" />
        <circle cx="350" cy="280" r="4" /><circle cx="370" cy="280" r="4" /><circle cx="390" cy="280" r="4" /><circle cx="410" cy="280" r="4" /><circle cx="430" cy="280" r="4" /><circle cx="450" cy="280" r="4" />
        <circle cx="360" cy="300" r="4" /><circle cx="380" cy="300" r="4" /><circle cx="400" cy="300" r="4" /><circle cx="420" cy="300" r="4" /><circle cx="440" cy="300" r="4" />
      </g>

      <!-- Center Metallic Interface Button -->
      <circle cx="400" cy="460" r="22" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" />
      <circle cx="400" cy="460" r="10" fill="#f43f5e" />

      <g transform="translate(400, 520)" text-anchor="middle">
        <text y="0" font-family="'Helvetica Neue', Arial, sans-serif" font-size="15" font-weight="900" fill="#ffffff" letter-spacing="2">
          ${escapeXml(info.brand)}
        </text>
        <text y="20" font-family="'Helvetica Neue', Arial, sans-serif" font-size="10" font-weight="700" fill="#fecdd3">
          ${escapeXml(info.lineName.slice(0, 16))}
        </text>
      </g>
    </g>
  `;
}

// -------------------------------------------------------------
// SILHOUETTE 13: BODY LOTION / BODY WASH PUMP BOTTLE
// -------------------------------------------------------------
function renderBodyLotionPump(info) {
  return `
    <g id="lotion-pump-bottle" filter="url(#softShadow)">
      <!-- Large Pump Dispenser -->
      <path d="M370,140 L430,140 L430,170 L460,170 L460,185 L430,185 L430,210 L370,210 Z" fill="${info.theme.cap}" stroke="#94a3b8" stroke-width="2" />
      <rect x="365" y="210" width="70" height="30" rx="3" fill="#cbd5e1" />

      <!-- Bottle Body (Generous Family Size) -->
      <rect x="290" y="240" width="220" height="420" rx="24" fill="${info.theme.body}" stroke="#94a3b8" stroke-width="2.5" />
      <rect x="290" y="240" width="220" height="420" rx="24" fill="url(#glassSpecular)" opacity="0.3" />

      <!-- Label -->
      <rect x="310" y="280" width="180" height="320" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" />

      <g transform="translate(400, 330)" text-anchor="middle">
        <text y="20" font-family="'Helvetica Neue', Arial, sans-serif" font-size="19" font-weight="900" fill="${info.theme.primary}" letter-spacing="2">
          ${escapeXml(info.brand)}
        </text>
        <line x1="-45" y1="32" x2="45" y2="32" stroke="${info.theme.primary}" stroke-width="1.5" />

        <text y="70" font-family="'Helvetica Neue', Arial, sans-serif" font-size="14" font-weight="800" fill="#0f172a">
          ${escapeXml(info.lineName.slice(0, 20))}
        </text>
        <text y="92" font-family="'Helvetica Neue', Arial, sans-serif" font-size="11" font-weight="600" fill="#64748b">
          NOURISHING BODY CARE
        </text>

        <rect x="-60" y="130" width="120" height="28" rx="6" fill="${info.theme.primary}" opacity="0.1" />
        <text y="148" font-family="'Helvetica Neue', Arial, sans-serif" font-size="10.5" font-weight="750" fill="${info.theme.primary}">
          WITH NIACINAMIDE &amp; B5
        </text>

        <text y="230" font-family="'Helvetica Neue', Arial, sans-serif" font-size="13" font-weight="750" fill="#334155" letter-spacing="1">
          ${escapeXml(info.volume)}
        </text>
        <text y="255" font-family="'Helvetica Neue', Arial, sans-serif" font-size="9" font-weight="600" fill="#94a3b8">
          MADE IN ${escapeXml(info.origin)}
        </text>
      </g>
    </g>
  `;
}

// -------------------------------------------------------------
// SILHOUETTE 14: SUNSCREEN FLAT BOTTLE
// -------------------------------------------------------------
function renderSunscreenFlat(info) {
  return `
    <g id="sunscreen-flat" filter="url(#softShadow)">
      <!-- Angled Twist Cap -->
      <polygon points="360,170 440,170 425,240 375,240" fill="${info.theme.cap}" stroke="#94a3b8" stroke-width="2" />

      <!-- Bottle Body (Pocket Oval / Flat Shaker) -->
      <path d="M340,240 L460,240 C500,240 510,590 450,630 C400,640 400,640 350,630 C290,590 300,240 340,240 Z" fill="${info.theme.body}" stroke="#cbd5e1" stroke-width="2" />
      <path d="M340,240 L460,240 C500,240 510,590 450,630 C400,640 400,640 350,630 C290,590 300,240 340,240 Z" fill="url(#glassSpecular)" opacity="0.4" />

      <g transform="translate(400, 310)" text-anchor="middle">
        <text y="25" font-family="'Helvetica Neue', Arial, sans-serif" font-size="19" font-weight="900" fill="${info.theme.primary}" letter-spacing="3">
          ${escapeXml(info.brand)}
        </text>
        <line x1="-40" y1="38" x2="40" y2="38" stroke="${info.theme.accent}" stroke-width="2" />

        <text y="80" font-family="'Helvetica Neue', Arial, sans-serif" font-size="14" font-weight="800" fill="#0f172a">
          ${escapeXml(info.lineName.slice(0, 18))}
        </text>
        <text y="102" font-family="'Helvetica Neue', Arial, sans-serif" font-size="11" font-weight="600" fill="#475569">
          PERFECT UV SUNSCREEN
        </text>

        <!-- Golden Sun Protection Shield Badge -->
        <rect x="-65" y="135" width="130" height="34" rx="17" fill="#ca8a04" />
        <text y="157" font-family="'Helvetica Neue', Arial, sans-serif" font-size="13" font-weight="900" fill="#ffffff" letter-spacing="1">
          SPF 50+ / PA++++
        </text>

        <text y="240" font-family="'Helvetica Neue', Arial, sans-serif" font-size="13" font-weight="750" fill="#1e293b" letter-spacing="1">
          ${escapeXml(info.volume)} • ${escapeXml(info.origin)}
        </text>
      </g>
    </g>
  `;
}

/**
 * Master Packshot Renderer
 */
function generatePackshotSvg(product) {
  const info = getProductPackInfo(product);
  const type = classifyContainer(product);

  let innerSvg = '';
  switch (type) {
    case 'LIPSTICK_BULLET':
      innerSvg = renderLipstickBullet(info);
      break;
    case 'LIP_TINT':
      innerSvg = renderLipTint(info);
      break;
    case 'EYESHADOW_PALETTE':
      innerSvg = renderEyeshadowPalette(info);
      break;
    case 'BLUSH_COMPACT':
      innerSvg = renderBlushCompact(info);
      break;
    case 'FOUNDATION_PUMP':
      innerSvg = renderFoundationPump(info);
      break;
    case 'SERUM_DROPPER':
      innerSvg = renderSerumDropper(info);
      break;
    case 'CREAM_JAR':
      innerSvg = renderCreamJar(info);
      break;
    case 'TONER_CYLINDER':
      innerSvg = renderTonerCylinder(info);
      break;
    case 'SUNSCREEN_FLAT':
      innerSvg = renderSunscreenFlat(info);
      break;
    case 'PERFUME_BOTTLE':
      innerSvg = renderPerfumeBottle(info);
      break;
    case 'SUPPLEMENT_BOTTLE':
      innerSvg = renderSupplementBottle(info);
      break;
    case 'BEAUTY_DEVICE':
      innerSvg = renderBeautyDevice(info);
      break;
    case 'BODY_LOTION_PUMP':
      innerSvg = renderBodyLotionPump(info);
      break;
    case 'CLEANSER_TUBE':
    default:
      innerSvg = renderCleanserTube(info);
      break;
  }

  return createStudioScene(innerSvg);
}

module.exports = {
  generatePackshotSvg,
  classifyContainer,
  getProductPackInfo
};
