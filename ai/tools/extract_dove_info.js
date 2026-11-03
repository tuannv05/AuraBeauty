const fs = require('fs');

const html = fs.readFileSync('tools/wowmart_dove.html', 'utf8');

// Extract description / content
let contentMatch = html.match(/<div[^>]*class="[^"]*woocommerce-product-details__short-description[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
const shortDesc = contentMatch ? contentMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';

// Main content tab
const descTab = html.match(/<div[^>]*id="tab-description"[^>]*>([\s\S]*?)<\/div>/i);
let fullDesc = '';
if (descTab) {
  fullDesc = descTab[1].replace(/<script[\s\S]*?<\/script>/gi, '')
                       .replace(/<style[\s\S]*?<\/style>/gi, '')
                       .replace(/<[^>]+>/g, '\n')
                       .split('\n')
                       .map(s => s.trim())
                       .filter(Boolean)
                       .join('\n');
}

// Brand
const brand = 'Dove';

// Gallery images in order of WooCommerce gallery
const galleryMatches = [...html.matchAll(/data-large_image="([^"]+)"/g)].map(m => m[1]);
const uniqueGallery = [...new Set(galleryMatches)];

console.log('Short description:', shortDesc);
console.log('Full description length:', fullDesc.length);
console.log('Unique Gallery from data-large_image:', uniqueGallery);

// Look for ingredients in fullDesc
const lines = fullDesc.split('\n');
console.log('Sample content lines:');
lines.slice(0, 30).forEach(l => console.log(' - ', l));
