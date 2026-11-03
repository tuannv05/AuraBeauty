const fs = require('fs');

const seedPath = 'services/catalog-service/src/main/resources/products_seed.json';
const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

const doveProd = {
  "id": "PROD-DOVE-EXFOLIATING-POMEGRANATE",
  "shopId": "00000000-0000-0000-0000-000000000010",
  "name": "Tẩy tế bào chết Dove Exfoliating Body Polish Pomegranate Seeds & Shea Butter 298g",
  "brand": "Dove",
  "description": "Kem tắm tẩy tế bào chết toàn thân Dove Exfoliating Body Polish Pomegranate Seeds & Shea Butter chiết xuất hạt lựu đỏ và bơ hạt mỡ. Công thức giàu độ ẩm với 1/4 kem dưỡng ẩm của Dove tạo sự mềm mại tức thì, hạt tẩy tế bào chết kích thước cát mịn nhẹ nhàng loại bỏ lớp da chết xỉn màu và phục hồi dưỡng chất tự nhiên của làn da.",
  "category": "Chăm sóc cơ thể",
  "subCategory": "Tẩy da chết toàn thân",
  "registrationNumber": "CBMP-19834/23/CBMP-QLD",
  "rating": 4.9,
  "soldCount": 14500,
  "reviewCount": 3820,
  "price": 249000,
  "originalPrice": 285000,
  "inStock": true,
  "badges": [
    "Hàng Chính Hãng",
    "Bản Mỹ 298g",
    "1/4 Kem Dưỡng Dove",
    "Voucher Xtra"
  ],
  "images": [
    "/products/dove-pomegranate-main.jpg",
    "/products/dove-pomegranate-cream-texture.jpg",
    "/products/dove-pomegranate-swatch.jpg",
    "/products/dove-pomegranate-back-label.jpg",
    "/products/dove-pomegranate-top-lid.jpg",
    "/products/dove-pomegranate-side-view.jpg",
    "/products/dove-pomegranate-barcode.jpg",
    "/products/dove-pomegranate-model.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES",
    "DRY",
    "NORMAL"
  ],
  "skinConcerns": [
    "DULLNESS",
    "DRYNESS",
    "PORES"
  ],
  "safetyEthicsBadges": [
    "PARABEN_FREE",
    "CRUELTY_FREE",
    "SULFATE_FREE"
  ],
  "formulationTexture": "CREAM_BALM",
  "originCountry": "USA",
  "variants": [
    {
      "sku": "DOVE-POLISH-POMEGRANATE-298G",
      "title": "Hũ 298g Hạt Lựu & Bơ Hạt Mỡ",
      "price": 249000,
      "originalPrice": 285000,
      "onHand": 175,
      "image": "/products/dove-pomegranate-main.jpg"
    },
    {
      "sku": "DOVE-POLISH-MACADAMIA-298G",
      "title": "Hũ 298g Mắc-ca & Sữa Gạo",
      "price": 249000,
      "originalPrice": 285000,
      "onHand": 140,
      "image": "/products/dove-pomegranate-cream-texture.jpg"
    }
  ],
  "inciIngredients": [
    {
      "inciName": "Water (Aqua)",
      "function": "Dung môi tinh khiết tiêu chuẩn",
      "comedogenicRating": 0,
      "irritationRating": 0
    },
    {
      "inciName": "Glycerin",
      "function": "Hút ẩm dưỡng ẩm tự nhiên cho lớp sừng",
      "comedogenicRating": 0,
      "irritationRating": 0
    },
    {
      "inciName": "Hydrated Silica",
      "function": "Hạt tẩy tế bào chết khoáng mịn màng nhẹ nhàng cuốn sạch tế bào chết",
      "comedogenicRating": 0,
      "irritationRating": 0
    },
    {
      "inciName": "Sodium Lauroyl Isethionate",
      "function": "Chất làm sạch dịu nhẹ không sulfate an toàn vi sinh vật da",
      "comedogenicRating": 0,
      "irritationRating": 0
    },
    {
      "inciName": "Stearic Acid",
      "function": "Acid béo tạo chất kem mềm mượt bảo vệ màng lipid",
      "comedogenicRating": 2,
      "irritationRating": 0
    },
    {
      "inciName": "Punica Granatum Seed Powder",
      "function": "Bột hạt lựu đỏ tự nhiên chống oxy hóa & làm sáng đều màu da",
      "comedogenicRating": 0,
      "irritationRating": 0
    },
    {
      "inciName": "Butyrospermum Parkii (Shea) Butter",
      "function": "Bơ hạt mỡ hữu cơ giàu acid béo phục hồi ẩm mềm mịn 1/4 kem dưỡng Dove",
      "comedogenicRating": 1,
      "irritationRating": 0
    },
    {
      "inciName": "Cocamidopropyl Betaine",
      "function": "Chất hoạt động bề mặt nguồn gốc dầu dừa dịu êm",
      "comedogenicRating": 0,
      "irritationRating": 0
    },
    {
      "inciName": "Cetearyl Alcohol",
      "function": "Cồn béo dưỡng ẩm làm mềm da không gây khô căng",
      "comedogenicRating": 2,
      "irritationRating": 0
    }
  ]
};

// Check if already exists
const existingIdx = seed.findIndex(p => p.id === doveProd.id);
if (existingIdx >= 0) {
  seed[existingIdx] = doveProd;
} else {
  seed.unshift(doveProd);
}

fs.writeFileSync(seedPath, JSON.stringify(seed, null, 2), 'utf8');
console.log('Updated products_seed.json, total products:', seed.length);
