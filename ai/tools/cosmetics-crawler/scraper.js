// tools/cosmetics-crawler/scraper.js
const { enrichIngredients } = require('./inciEnricher');
const { extractVtoConfig } = require('./vtoShadeExtractor');
const { exportArtifacts } = require('./exporterAndImporter');

/**
 * 6 Vendor Shops for Split-Order Testing:
 */
const VENDOR_SHOPS = [
  { id: "00000000-0000-0000-0000-000000000010", name: "Anua Official Store", code: "SHOP-ANUA-OFFICIAL" },
  { id: "00000000-0000-0000-0000-000000000020", name: "L'Oréal Paris Official Mall", code: "SHOP-LOREAL-VN" },
  { id: "00000000-0000-0000-0000-000000000030", name: "Hasaki Beauty & Clinic", code: "SHOP-HASAKI-OFFICIAL" },
  { id: "00000000-0000-0000-0000-000000000040", name: "Guardian Flagship Store", code: "SHOP-GUARDIAN-MALL" },
  { id: "00000000-0000-0000-0000-000000000050", name: "K-Beauty Lab Official", code: "SHOP-KBEAUTY-LAB" },
  { id: "00000000-0000-0000-0000-000000000060", name: "Cocoon Vietnam Flagship", code: "SHOP-COCOON-VN" }
];

/**
 * Master catalog of 135+ curated realistic cosmetic products across 6 categories.
 */
const CURATED_CATALOG = [
  // ==========================================
  // 1. LIPSTICK (>= 30 SẢN PHẨM)
  // ==========================================
  {
    name: "Son Kem Lì Romand Zero Velvet Tint",
    brand: "Romand",
    category: "Lipstick",
    price: 185000,
    originalPrice: 220000,
    description: "Son kem lì mềm mịn như nhung, hiệu ứng mờ viền môi tự nhiên, che phủ vân môi hoàn hảo mà không làm khô môi.",
    suitableSkinTypes: ["NORMAL", "DRY", "OILY", "COMBINATION"],
    ingredients: ["Dimethicone", "Dimethicone Crosspolymer", "Diisostearyl Malate", "Polyglyceryl-2 Triisostearate", "Iron Oxides (CI 77491)", "Red 7 Lake (CI 15850)", "Butyrospermum Parkii (Shea) Butter"],
    images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Son Bóng Romand Juicy Lasting Tint",
    brand: "Romand",
    category: "Lipstick",
    price: 195000,
    originalPrice: 240000,
    description: "Son tint bóng căng mọng như nước ép trái cây mùa hè, giữ lớp bóng thủy tinh bền màu suốt cả ngày.",
    suitableSkinTypes: ["NORMAL", "DRY", "SENSITIVE"],
    ingredients: ["Octyldodecanol", "Diisostearyl Malate", "Glycerin", "Polyglyceryl-2 Triisostearate", "Titanium Dioxide", "Yellow 6 Lake (CI 15985)", "Simmondsia Chinensis (Jojoba) Seed Oil"],
    images: ["https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Son Thỏi Lì MAC Matte Lipstick",
    brand: "MAC",
    category: "Lipstick",
    price: 580000,
    originalPrice: 650000,
    description: "Biểu tượng son lì huyền thoại với độ chuẩn màu tuyệt đối, giữ màu bền bỉ 10 giờ không lem trôi.",
    suitableSkinTypes: ["NORMAL", "OILY", "COMBINATION"],
    ingredients: ["Dimethicone", "Silica", "Kaolin", "Diisostearyl Malate", "Red 7 Lake (CI 15850)", "Iron Oxides (CI 77499)", "Tocopherol"],
    images: ["https://images.unsplash.com/photo-1599733589046-10c005739ef9?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Son Kem Lì MAC Powder Kiss Liquid Lipcolour",
    brand: "MAC",
    category: "Lipstick",
    price: 690000,
    originalPrice: 750000,
    description: "Kết cấu mousse mỏng nhẹ như nhung, hiệu ứng làm mờ rãnh môi mềm mượt, cấp ẩm suốt 10 giờ.",
    suitableSkinTypes: ["NORMAL", "DRY", "COMBINATION"],
    ingredients: ["Dimethicone", "Dimethicone Crosspolymer", "Silica", "Polyglyceryl-2 Triisostearate", "Red 28 Lake (CI 45410)", "Tocopherol"],
    images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Son Kem Lì 3CE Velvet Lip Tint",
    brand: "3CE",
    category: "Lipstick",
    price: 290000,
    originalPrice: 340000,
    description: "Chất son velvet tan chảy ngay khi chạm môi, công thức lưu giữ sắc tố tươi tắn phong cách Hàn Quốc.",
    suitableSkinTypes: ["NORMAL", "OILY", "COMBINATION"],
    ingredients: ["Dimethicone", "Dimethicone Crosspolymer", "Diisostearyl Malate", "Iron Oxides (CI 77491)", "Iron Oxides (CI 77492)", "Red 7 Lake (CI 15850)"],
    images: ["https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Son Thỏi 3CE Soft Matte Lipstick",
    brand: "3CE",
    category: "Lipstick",
    price: 360000,
    originalPrice: 420000,
    description: "Dòng son thỏi lì thế hệ mới, hạt phấn siêu mịn nhẹ tênh như không khí, không gây bột môi.",
    suitableSkinTypes: ["NORMAL", "COMBINATION"],
    ingredients: ["Silica", "Dimethicone", "Kaolin", "Diisostearyl Malate", "Red 7 Lake (CI 15850)", "Mica"],
    images: ["https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Son Kem Lì Maybelline Superstay Matte Ink",
    brand: "Maybelline",
    category: "Lipstick",
    price: 215000,
    originalPrice: 250000,
    description: "Son kem lì chống trôi đỉnh cao suốt 16 giờ, ăn uống không dây dính, chống thấm nước tuyệt đối.",
    suitableSkinTypes: ["OILY", "NORMAL", "COMBINATION"],
    ingredients: ["Dimethicone", "Silica", "Diisostearyl Malate", "Polyglyceryl-2 Triisostearate", "Red 7 Lake (CI 15850)", "Titanium Dioxide"],
    images: ["https://images.unsplash.com/photo-1599733589046-10c005739ef9?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Son Kem Maybelline Superstay Vinyl Ink Bền Màu Căng Bóng",
    brand: "Maybelline",
    category: "Lipstick",
    price: 245000,
    originalPrice: 290000,
    description: "Công nghệ khóa màu đột phá vừa mang lại lớp finish bóng nước vừa giữ màu 16h không xê dịch.",
    suitableSkinTypes: ["NORMAL", "DRY", "COMBINATION"],
    ingredients: ["Octyldodecanol", "Dimethicone", "Glycerin", "Diisostearyl Malate", "Yellow 6 Lake (CI 15985)", "Tocopherol"],
    images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Son Kem Black Rouge Air Fit Velvet Tint Ver 8",
    brand: "Black Rouge",
    category: "Lipstick",
    price: 175000,
    originalPrice: 210000,
    description: "Chất son feather-light êm ái như lông vũ, hương quả mọng ngọt ngào và khả năng bám màu 8h.",
    suitableSkinTypes: ["NORMAL", "DRY", "COMBINATION"],
    ingredients: ["Dimethicone", "Dimethicone Crosspolymer", "Butyrospermum Parkii (Shea) Butter", "Red 7 Lake (CI 15850)", "Iron Oxides (CI 77491)"],
    images: ["https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Son Thỏi Black Rouge Wearable Velvet Lipstick",
    brand: "Black Rouge",
    category: "Lipstick",
    price: 210000,
    originalPrice: 260000,
    description: "Son thỏi nhung lì bán nguyệt ôm sát bờ môi, màu sắc lấy cảm hứng từ ánh sáng hoàng hôn.",
    suitableSkinTypes: ["NORMAL", "DRY"],
    ingredients: ["Diisostearyl Malate", "Silica", "Simmondsia Chinensis (Jojoba) Seed Oil", "Red 28 Lake (CI 45410)", "Iron Oxides (CI 77492)"],
    images: ["https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Son Kem Lì Peripera Ink Velvet",
    brand: "Peripera",
    category: "Lipstick",
    price: 160000,
    originalPrice: 195000,
    description: "Dòng son mực quốc dân xứ kim chi với độ bám màu siêu bền và hiệu ứng nhung mờ mịn môi.",
    suitableSkinTypes: ["NORMAL", "OILY", "COMBINATION"],
    ingredients: ["Dimethicone", "Dimethicone Crosspolymer", "Polyglyceryl-2 Triisostearate", "Red 7 Lake (CI 15850)", "Iron Oxides (CI 77491)"],
    images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Son Bóng Peripera Ink Mood Glowy Tint",
    brand: "Peripera",
    category: "Lipstick",
    price: 185000,
    originalPrice: 220000,
    description: "Son tint bóng ngậm nước như hồ thu tĩnh lặng, tạo đôi môi căng tròn đầy sức sống.",
    suitableSkinTypes: ["DRY", "NORMAL", "SENSITIVE"],
    ingredients: ["Octyldodecanol", "Glycerin", "Diisostearyl Malate", "Titanium Dioxide", "Red 28 Lake (CI 45410)", "Tocopherol"],
    images: ["https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Son Kem Lì Merzy The First Velvet Tint",
    brand: "Merzy",
    category: "Lipstick",
    price: 165000,
    originalPrice: 200000,
    description: "Chất son kem lì bám chặt tôn da, sắc son đỏ gạch và đỏ đất cá tính thời thượng.",
    suitableSkinTypes: ["NORMAL", "OILY", "COMBINATION"],
    ingredients: ["Dimethicone", "Dimethicone Crosspolymer", "Iron Oxides (CI 77491)", "Red 7 Lake (CI 15850)", "Silica"],
    images: ["https://images.unsplash.com/photo-1599733589046-10c005739ef9?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Son Thỏi Merzy Noir In The Velvet Lipstick",
    brand: "Merzy",
    category: "Lipstick",
    price: 195000,
    originalPrice: 235000,
    description: "Vỏ đen huyền bí quyền lực kết hợp chất son nhung mịn semi-matte không khô căng môi.",
    suitableSkinTypes: ["NORMAL", "COMBINATION"],
    ingredients: ["Diisostearyl Malate", "Silica", "Dimethicone", "Iron Oxides (CI 77499)", "Red 7 Lake (CI 15850)"],
    images: ["https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Son Kem Lì BBIA Last Velvet Lip Tint Asia Edition",
    brand: "BBIA",
    category: "Lipstick",
    price: 155000,
    originalPrice: 190000,
    description: "Bản màu chuẩn da Châu Á, chất son nam châm bám chặt lên môi mềm mượt như cánh hoa.",
    suitableSkinTypes: ["NORMAL", "OILY", "COMBINATION"],
    ingredients: ["Dimethicone", "Dimethicone Crosspolymer", "Polyglyceryl-2 Triisostearate", "Iron Oxides (CI 77491)", "Yellow 6 Lake (CI 15985)"],
    images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Son Thỏi Lì Espoir Lipstick No Wear Velvet",
    brand: "Espoir",
    category: "Lipstick",
    price: 380000,
    originalPrice: 450000,
    description: "Son thỏi lì cao cấp nhẹ tênh như không thoa son, bảng màu chuẩn thần thái Seoul quyến rũ.",
    suitableSkinTypes: ["NORMAL", "DRY", "COMBINATION"],
    ingredients: ["Silica", "Dimethicone", "Diisostearyl Malate", "Red 7 Lake (CI 15850)", "Tocopherol"],
    images: ["https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Son Kem Lì Espoir Couture Lip Tint Pure Velvet",
    brand: "Espoir",
    category: "Lipstick",
    price: 360000,
    originalPrice: 430000,
    description: "Chất son nhung cao cấp che phủ rãnh môi mềm như lụa, độ ẩm dồi dào từ bơ hạt mỡ.",
    suitableSkinTypes: ["NORMAL", "DRY"],
    ingredients: ["Dimethicone", "Butyrospermum Parkii (Shea) Butter", "Polyglyceryl-2 Triisostearate", "Red 28 Lake (CI 45410)"],
    images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Son Kem 2 Đầu Lemonade Perfect Couple Lip",
    brand: "Lemonade",
    category: "Lipstick",
    price: 259000,
    originalPrice: 299000,
    description: "Thiết kế 2 đầu tiện lợi gồm Lip Filler làm đầy rãnh môi và Lip Tint kem lì chuẩn sắc.",
    suitableSkinTypes: ["DRY", "NORMAL", "COMBINATION"],
    ingredients: ["Hyaluronic Acid", "Dimethicone", "Diisostearyl Malate", "Red 7 Lake (CI 15850)", "Iron Oxides (CI 77491)"],
    images: ["https://images.unsplash.com/photo-1599733589046-10c005739ef9?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Son Kem Lì Lemonade Matte Addict Lip Tint",
    brand: "Lemonade",
    category: "Lipstick",
    price: 249000,
    originalPrice: 289000,
    description: "Sắc son dành riêng cho làn da phụ nữ Việt Nam, dưỡng ẩm dồi dào, không lộ khuyết điểm môi.",
    suitableSkinTypes: ["NORMAL", "COMBINATION"],
    ingredients: ["Dimethicone", "Simmondsia Chinensis (Jojoba) Seed Oil", "Red 7 Lake (CI 15850)", "Iron Oxides (CI 77492)"],
    images: ["https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Son Thỏi Cao Cấp YSL Rouge Pur Couture The Slim",
    brand: "YSL",
    category: "Lipstick",
    price: 980000,
    originalPrice: 1100000,
    description: "Son thỏi vuông siêu mẫu couture thanh mảnh, chất son lì mịn như da thuộc cao cấp.",
    suitableSkinTypes: ["NORMAL", "DRY", "OILY", "COMBINATION"],
    ingredients: ["Dimethicone", "Silica", "Diisostearyl Malate", "Red 7 Lake (CI 15850)", "Iron Oxides (CI 77491)", "Tocopherol"],
    images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Son Dưỡng Có Màu Dior Addict Lip Glow",
    brand: "Dior",
    category: "Lipstick",
    price: 950000,
    originalPrice: 1050000,
    description: "Huyền thoại son dưỡng tự thức tỉnh sắc hồng môi tự nhiên theo độ pH, nuôi dưỡng 24h.",
    suitableSkinTypes: ["DRY", "NORMAL", "SENSITIVE"],
    ingredients: ["Butyrospermum Parkii (Shea) Butter", "Diisostearyl Malate", "Simmondsia Chinensis (Jojoba) Seed Oil", "Red 28 Lake (CI 45410)", "Tocopherol"],
    images: ["https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Son Kem Lì Dior Forever Liquid",
    brand: "Dior",
    category: "Lipstick",
    price: 1050000,
    originalPrice: 1150000,
    description: "Son kem lì không trọng lượng, không dây dính khẩu trang, sắc màu rạng rỡ suốt ngày dài.",
    suitableSkinTypes: ["NORMAL", "OILY", "COMBINATION"],
    ingredients: ["Dimethicone", "Silica", "Polyglyceryl-2 Triisostearate", "Red 7 Lake (CI 15850)", "Iron Oxides (CI 77491)"],
    images: ["https://images.unsplash.com/photo-1599733589046-10c005739ef9?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Son Thỏi Shu Uemura Rouge Unlimited Kinu Satin",
    brand: "Shu Uemura",
    category: "Lipstick",
    price: 850000,
    originalPrice: 950000,
    description: "Cảm hứng từ lụa tơ tằm Nhật Bản Kinu, kết cấu satin óng mượt và hương gỗ Hinoki thư giãn.",
    suitableSkinTypes: ["NORMAL", "DRY", "COMBINATION"],
    ingredients: ["Diisostearyl Malate", "Octyldodecanol", "Camellia Sinensis Leaf Extract", "Red 7 Lake (CI 15850)", "Mica"],
    images: ["https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Son Kem Lì Focallure Airy Matte Tint",
    brand: "FOCALLURE",
    category: "Lipstick",
    price: 99000,
    originalPrice: 139000,
    description: "Son kem mỏng như mây với công thức kháng nước, dễ tán đều viền môi ombre xinh xắn.",
    suitableSkinTypes: ["NORMAL", "COMBINATION"],
    ingredients: ["Dimethicone", "Dimethicone Crosspolymer", "Red 7 Lake (CI 15850)", "Iron Oxides (CI 77492)"],
    images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Son Kem Bùn Focallure Velvet Lip Clay",
    brand: "FOCALLURE",
    category: "Lipstick",
    price: 109000,
    originalPrice: 149000,
    description: "Kết cấu bùn mịn che phủ hoàn hảo vân môi, đa năng dùng được cho cả môi và má hồng.",
    suitableSkinTypes: ["NORMAL", "OILY", "COMBINATION"],
    ingredients: ["Silica", "Dimethicone", "Kaolin", "Red 28 Lake (CI 45410)", "Iron Oxides (CI 77491)"],
    images: ["https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Son Thỏi Thuần Chay Cocoon Dầu Dừa Bến Tre",
    brand: "Cocoon",
    category: "Lipstick",
    price: 145000,
    originalPrice: 175000,
    description: "Son dưỡng có màu 100% thuần chay từ dầu dừa Bến Tre và bơ hạt mỡ, nuôi dưỡng đôi môi mềm mại.",
    suitableSkinTypes: ["DRY", "NORMAL", "SENSITIVE"],
    ingredients: ["Butyrospermum Parkii (Shea) Butter", "Simmondsia Chinensis (Jojoba) Seed Oil", "Tocopherol", "Red 7 Lake (CI 15850)"],
    images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Son Kem Lì Gilaa Long Wear Lip Cream Rich Collagen",
    brand: "Gilaa",
    category: "Lipstick",
    price: 245000,
    originalPrice: 290000,
    description: "Bổ sung collagen thủy phân tái tạo độ căng bóng khỏe mạnh, không gây thâm môi.",
    suitableSkinTypes: ["NORMAL", "DRY", "COMBINATION"],
    ingredients: ["Dimethicone", "Hyaluronic Acid", "Diisostearyl Malate", "Red 7 Lake (CI 15850)", "Iron Oxides (CI 77491)"],
    images: ["https://images.unsplash.com/photo-1599733589046-10c005739ef9?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Son Tint Lì Innisfree Airy Matte Tint",
    brand: "Innisfree",
    category: "Lipstick",
    price: 280000,
    originalPrice: 330000,
    description: "Chiết xuất dầu hạt trà xanh đảo Jeju cấp ẩm cho lớp son lì mỏng nhẹ, màu sắc tươi tắn.",
    suitableSkinTypes: ["NORMAL", "DRY", "COMBINATION"],
    ingredients: ["Camellia Sinensis Leaf Extract", "Dimethicone", "Polyglyceryl-2 Triisostearate", "Red 28 Lake (CI 45410)"],
    images: ["https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Son Thỏi Innisfree Dewy Tint Lip Balm",
    brand: "Innisfree",
    category: "Lipstick",
    price: 290000,
    originalPrice: 350000,
    description: "Son dưỡng bóng nhẹ chiết xuất dầu hạt bạch đàn và hoa sơn trà, tạo độ bóng ẩm trong trẻo.",
    suitableSkinTypes: ["DRY", "NORMAL", "SENSITIVE"],
    ingredients: ["Simmondsia Chinensis (Jojoba) Seed Oil", "Butyrospermum Parkii (Shea) Butter", "Diisostearyl Malate", "Red 7 Lake (CI 15850)"],
    images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Son Kem Lì L'Oréal Paris Chiffon Signature",
    brand: "L'Oréal",
    category: "Lipstick",
    price: 269000,
    originalPrice: 319000,
    description: "Son kem nhẹ tựa mây chiffon, công nghệ hạt màu khuếch tán tạo hiệu ứng mờ nhạt ảo diệu.",
    suitableSkinTypes: ["NORMAL", "DRY", "COMBINATION"],
    ingredients: ["Dimethicone", "Dimethicone Crosspolymer", "Silica", "Red 7 Lake (CI 15850)", "Iron Oxides (CI 77491)"],
    images: ["https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80"]
  },

  // ==========================================
  // 2. BLUSH (>= 15 SẢN PHẨM)
  // ==========================================
  {
    name: "Phấn Má Hồng 3CE Mood Recipe Face Blush",
    brand: "3CE",
    category: "Blush",
    price: 320000,
    originalPrice: 380000,
    description: "Hạt phấn siêu mịn tiệp vào da, kiềm dầu nhẹ và tạo sắc hồng cam tự nhiên tôn lên gò má rạng rỡ.",
    suitableSkinTypes: ["OILY", "NORMAL", "COMBINATION"],
    ingredients: ["Talc", "Mica", "Silica", "Dimethicone", "Iron Oxides (CI 77491)", "Red 7 Lake (CI 15850)"],
    images: ["https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Phấn Má Hồng NARS Blush Orgasm Siêu Mịn",
    brand: "NARS",
    category: "Blush",
    price: 850000,
    originalPrice: 950000,
    description: "Huyền thoại má hồng màu hồng đào ánh nhũ vàng quyến rũ, tạo gò má ửng hồng tỏa sáng tự nhiên.",
    suitableSkinTypes: ["NORMAL", "DRY", "COMBINATION"],
    ingredients: ["Mica", "Silica", "Dimethicone", "Red 7 Lake (CI 15850)", "Iron Oxides (CI 77491)", "Titanium Dioxide"],
    images: ["https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Phấn Má Hồng Canmake Glow Fleur Cheeks",
    brand: "Canmake",
    category: "Blush",
    price: 245000,
    originalPrice: 290000,
    description: "Bảng má 5 ô hoa nở rạng ngời xứ Phù Tang, phối hợp giữa màu lì và ánh ngọc trai trong veo.",
    suitableSkinTypes: ["NORMAL", "DRY", "SENSITIVE"],
    ingredients: ["Mica", "Silica", "Squalane", "Simmondsia Chinensis (Jojoba) Seed Oil", "Red 28 Lake (CI 45410)"],
    images: ["https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Phấn Má Hồng Romand Better Than Cheek",
    brand: "Romand",
    category: "Blush",
    price: 185000,
    originalPrice: 220000,
    description: "Hạt phấn lấy cảm hứng từ quả sấy khô, làm mờ lỗ chân lông và kiềm dầu hoàn hảo cho gò má.",
    suitableSkinTypes: ["OILY", "NORMAL", "COMBINATION"],
    ingredients: ["Talc", "Silica", "Dimethicone", "Iron Oxides (CI 77492)", "Red 7 Lake (CI 15850)"],
    images: ["https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Má Hồng Dạng Kem Rare Beauty Soft Pinch Liquid Blush",
    brand: "Rare Beauty",
    category: "Blush",
    price: 650000,
    originalPrice: 720000,
    description: "Chất kem mỏng nhẹ tán êm ái, sắc tố siêu đậm chỉ cần 1 chấm nhỏ cho đôi má ửng hồng cả ngày.",
    suitableSkinTypes: ["NORMAL", "DRY", "COMBINATION", "SENSITIVE"],
    ingredients: ["Dimethicone", "Octyldodecanol", "Glycerin", "Red 7 Lake (CI 15850)", "Titanium Dioxide"],
    images: ["https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Phấn Má Hồng Benefit Dandelion Xinh Xắn",
    brand: "Benefit",
    category: "Blush",
    price: 820000,
    originalPrice: 900000,
    description: "Sắc hồng phấn hoa bồ công anh baby dịu dàng làm sáng bừng gương mặt mệt mỏi.",
    suitableSkinTypes: ["NORMAL", "DRY", "COMBINATION"],
    ingredients: ["Talc", "Mica", "Dimethicone", "Red 28 Lake (CI 45410)", "Titanium Dioxide"],
    images: ["https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Phấn Má Hồng Clinique Cheek Pop Hoa Cúc",
    brand: "Clinique",
    category: "Blush",
    price: 680000,
    originalPrice: 780000,
    description: "Công nghệ nướng độc quyền cho hạt phấn trong suốt tiệp vào da như màu ửng hồng tự nhiên.",
    suitableSkinTypes: ["ALL", "SENSITIVE", "DRY"],
    ingredients: ["Dimethicone", "Silica", "Squalane", "Red 7 Lake (CI 15850)", "Iron Oxides (CI 77491)"],
    images: ["https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Phấn Má Hồng Peripera Pure Blushed Sunshine Cheek",
    brand: "Peripera",
    category: "Blush",
    price: 145000,
    originalPrice: 180000,
    description: "Sắc màu ánh nắng dịu nhẹ, chất phấn mỏng mịn kiểm soát bã nhờn không gây bết dính.",
    suitableSkinTypes: ["OILY", "NORMAL", "COMBINATION"],
    ingredients: ["Talc", "Silica", "Dimethicone", "Iron Oxides (CI 77491)", "Yellow 6 Lake (CI 15985)"],
    images: ["https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Má Hồng Dạng Kem Focallure Hangover Red Wine",
    brand: "FOCALLURE",
    category: "Blush",
    price: 89000,
    originalPrice: 129000,
    description: "Chất kem mềm mại dễ tán bằng ngón tay, tạo hiệu ứng má say rượu đáng yêu.",
    suitableSkinTypes: ["NORMAL", "DRY"],
    ingredients: ["Dimethicone", "Diisostearyl Malate", "Red 7 Lake (CI 15850)", "Mica"],
    images: ["https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Phấn Má Hồng Judydoll Đơn Sắc Mịn Màng",
    brand: "Judydoll",
    category: "Blush",
    price: 135000,
    originalPrice: 169000,
    description: "Tone màu chuẩn phong cách Douyin nhẹ nhàng, làm đầy hõm má và tạo khối sáng cho khuôn mặt.",
    suitableSkinTypes: ["NORMAL", "COMBINATION"],
    ingredients: ["Mica", "Silica", "Dimethicone", "Iron Oxides (CI 77492)", "Red 28 Lake (CI 45410)"],
    images: ["https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Phấn Má Hồng Innisfree Airy Eyes & Cheek",
    brand: "Innisfree",
    category: "Blush",
    price: 260000,
    originalPrice: 310000,
    description: "Phấn má thuần chay mỏng nhẹ chiết xuất khoáng chất thiên nhiên đảo Jeju an toàn lành tính.",
    suitableSkinTypes: ["ALL", "SENSITIVE"],
    ingredients: ["Mica", "Silica", "Camellia Sinensis Leaf Extract", "Iron Oxides (CI 77491)"],
    images: ["https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Phấn Má Hồng Maybelline Fit Me Mono Blush",
    brand: "Maybelline",
    category: "Blush",
    price: 175000,
    originalPrice: 215000,
    description: "Công thức hạt phấn siêu nhỏ chuẩn sắc tự nhiên, bền màu không phai suốt 16 giờ.",
    suitableSkinTypes: ["NORMAL", "OILY", "COMBINATION"],
    ingredients: ["Talc", "Dimethicone", "Silica", "Red 7 Lake (CI 15850)", "Iron Oxides (CI 77499)"],
    images: ["https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Phấn Má Hồng Espoir Real Cheek Up",
    brand: "Espoir",
    category: "Blush",
    price: 340000,
    originalPrice: 390000,
    description: "Tông màu trong trẻo tươi mới giúp khuôn mặt trẻ trung rạng rỡ cả ngày mà không bị xỉn màu.",
    suitableSkinTypes: ["NORMAL", "COMBINATION"],
    ingredients: ["Mica", "Talc", "Dimethicone", "Red 7 Lake (CI 15850)", "Titanium Dioxide"],
    images: ["https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Phấn Má Dạng Nén L'Oréal Paris Le Blush",
    brand: "L'Oréal",
    category: "Blush",
    price: 219000,
    originalPrice: 259000,
    description: "Kết cấu hạt phấn siêu mịn kèm cọ chuyên dụng, tạo độ bắt sáng tự nhiên và gò má thon gọn.",
    suitableSkinTypes: ["NORMAL", "DRY", "COMBINATION"],
    ingredients: ["Talc", "Mica", "Silica", "Red 7 Lake (CI 15850)", "Iron Oxides (CI 77491)"],
    images: ["https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Má Hồng Dạng Thạch BBIA Ready To Wear Downy Cheek",
    brand: "BBIA",
    category: "Blush",
    price: 140000,
    originalPrice: 175000,
    description: "Kết cấu kem thạch mềm dẻo như bánh flan, tan mướt vào da tạo đôi má ửng màu mọng nước.",
    suitableSkinTypes: ["NORMAL", "DRY", "COMBINATION"],
    ingredients: ["Dimethicone", "Diisostearyl Malate", "Red 28 Lake (CI 45410)", "Titanium Dioxide"],
    images: ["https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=600&auto=format&fit=crop&q=80"]
  },

  // ==========================================
  // 3. FOUNDATION (>= 15 SẢN PHẨM)
  // ==========================================
  {
    name: "Phấn Nước Căng Bóng Clio Kill Cover Mesh Glow Cushion",
    brand: "Clio",
    category: "Foundation",
    price: 495000,
    originalPrice: 580000,
    description: "Màng lưới lọc kem nền siêu mịn mang lại lớp nền căng bóng mọng nước Glass-skin suốt 54 giờ.",
    suitableSkinTypes: ["NORMAL", "DRY", "COMBINATION"],
    ingredients: ["Titanium Dioxide", "Zinc Oxide", "Dimethicone", "Niacinamide", "Hyaluronic Acid", "Iron Oxides (CI 77492)"],
    images: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Phấn Nước Kiềm Dầu Clio Kill Cover The New Founwear Cushion",
    brand: "Clio",
    category: "Foundation",
    price: 495000,
    originalPrice: 580000,
    description: "Che phủ đỉnh cao khuyết điểm và lỗ chân lông to, công thức bán lì semi-matte kiềm dầu suốt 72h.",
    suitableSkinTypes: ["OILY", "COMBINATION", "NORMAL"],
    ingredients: ["Titanium Dioxide", "Silica", "Dimethicone", "Niacinamide", "Iron Oxides (CI 77491)", "Iron Oxides (CI 77492)"],
    images: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Kem Nền Kiềm Dầu Maybelline Fit Me Matte + Poreless",
    brand: "Maybelline",
    category: "Foundation",
    price: 245000,
    originalPrice: 285000,
    description: "Kem nền kiềm dầu quốc dân với hạt đất sét khoáng hút bã nhờn, che phủ lỗ chân lông tự nhiên.",
    suitableSkinTypes: ["OILY", "COMBINATION"],
    ingredients: ["Water", "Dimethicone", "Silica", "Kaolin", "Titanium Dioxide", "Iron Oxides (CI 77492)", "Tocopherol"],
    images: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Kem Nền Lâu Trôi Maybelline Superstay Active Wear 30H",
    brand: "Maybelline",
    category: "Foundation",
    price: 295000,
    originalPrice: 345000,
    description: "Chống nước, chống mồ hôi và không lem khẩu trang suốt 30 giờ, độ che phủ từ trung bình đến cao.",
    suitableSkinTypes: ["OILY", "NORMAL", "COMBINATION"],
    ingredients: ["Dimethicone", "Silica", "Titanium Dioxide", "Iron Oxides (CI 77491)", "Iron Oxides (CI 77492)"],
    images: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Phấn Nước Laneige Neo Cushion Matte Kiềm Dầu",
    brand: "Laneige",
    category: "Foundation",
    price: 520000,
    originalPrice: 620000,
    description: "Thiết kế bo tròn thời thượng, lớp nền mỏng nhẹ không dính khẩu trang và bảo vệ da khỏi ánh sáng xanh.",
    suitableSkinTypes: ["OILY", "COMBINATION"],
    ingredients: ["Titanium Dioxide", "Silica", "Dimethicone", "Panthenol", "Iron Oxides (CI 77492)", "Tocopherol"],
    images: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Phấn Nước Laneige Neo Cushion Glow Căng Mọng",
    brand: "Laneige",
    category: "Foundation",
    price: 520000,
    originalPrice: 620000,
    description: "Cấp ẩm dồi dào với công nghệ Liquid Diamond cho làn da rạng rỡ tỏa sáng 360 độ suốt cả ngày.",
    suitableSkinTypes: ["DRY", "NORMAL", "SENSITIVE"],
    ingredients: ["Hyaluronic Acid", "Titanium Dioxide", "Niacinamide", "Glycerin", "Dimethicone", "Mica"],
    images: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Phấn Nước Espoir Pro Tailor Be Velvet Cushion SPF34",
    brand: "Espoir",
    category: "Foundation",
    price: 490000,
    originalPrice: 560000,
    description: "Độ che phủ vượt trội nhưng mỏng mịn như nhung, chứng nhận thuần chay an toàn cho da mụn nhạy cảm.",
    suitableSkinTypes: ["COMBINATION", "OILY", "NORMAL"],
    ingredients: ["Titanium Dioxide", "Zinc Oxide", "Dimethicone", "Panthenol", "Iron Oxides (CI 77492)"],
    images: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Kem Nền Espoir Pro Tailor Foundation Be Glow",
    brand: "Espoir",
    category: "Foundation",
    price: 580000,
    originalPrice: 650000,
    description: "Kem nền dạng lỏng cho hiệu ứng bóng bẩy tự nhiên kiểu Hàn Quốc, nuôi dưỡng làn da ngậm nước.",
    suitableSkinTypes: ["DRY", "NORMAL"],
    ingredients: ["Hyaluronic Acid", "Titanium Dioxide", "Squalane", "Dimethicone", "Iron Oxides (CI 77491)"],
    images: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Kem Nền Estee Lauder Double Wear Stay-in-Place SPF10",
    brand: "Estee Lauder",
    category: "Foundation",
    price: 1350000,
    originalPrice: 1550000,
    description: "Nữ hoàng kem nền kiềm dầu số 1 thế giới với khả năng che khuyết điểm hoàn mỹ suốt 24 giờ bất chấp nắng gắt.",
    suitableSkinTypes: ["OILY", "COMBINATION"],
    ingredients: ["Water", "Dimethicone", "Silica", "Titanium Dioxide", "Iron Oxides (CI 77491)", "Iron Oxides (CI 77492)", "Tocopherol"],
    images: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Kem Nền L'Oréal Paris Infallible 32H Fresh Wear",
    brand: "L'Oréal",
    category: "Foundation",
    price: 349000,
    originalPrice: 399000,
    description: "Công nghệ hạt phấn oxy siêu nhẹ cho làn da hít thở thoải mái, che phủ mịn màng suốt 32h.",
    suitableSkinTypes: ["NORMAL", "OILY", "COMBINATION"],
    ingredients: ["Dimethicone", "Silica", "Titanium Dioxide", "Niacinamide", "Iron Oxides (CI 77492)"],
    images: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Kem Nền L'Oréal True Match Tinted Serum Hyaluronic Acid",
    brand: "L'Oréal",
    category: "Foundation",
    price: 389000,
    originalPrice: 449000,
    description: "Serum trang điểm chứa 1% Hyaluronic Acid tinh khiết, vừa làm sáng đều màu da vừa dưỡng ẩm sâu.",
    suitableSkinTypes: ["DRY", "NORMAL", "SENSITIVE"],
    ingredients: ["Hyaluronic Acid", "Glycerin", "Titanium Dioxide", "Dimethicone", "Mica"],
    images: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Phấn Nước Missha M Magic Cushion Cover Lasting SPF50+",
    brand: "Missha",
    category: "Foundation",
    price: 165000,
    originalPrice: 210000,
    description: "Chỉ số chống nắng cực cao SPF50+/PA+++, che phủ khuyết điểm mụn và thâm đỏ nhanh chóng tiện lợi.",
    suitableSkinTypes: ["OILY", "COMBINATION"],
    ingredients: ["Titanium Dioxide", "Zinc Oxide", "Silica", "Dimethicone", "Iron Oxides (CI 77492)"],
    images: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Phấn Nước Aprilskin Magic Snow Cushion Black 2.0",
    brand: "Aprilskin",
    category: "Foundation",
    price: 345000,
    originalPrice: 420000,
    description: "Được mệnh danh là 'phù thủy che khuyết điểm' với khả năng che mụn và tàn nhang hoàn hảo trong 1 lần dặm.",
    suitableSkinTypes: ["NORMAL", "OILY", "COMBINATION"],
    ingredients: ["Titanium Dioxide", "Niacinamide", "Dimethicone", "Centella Asiatica Extract", "Iron Oxides (CI 77492)"],
    images: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Kem Nền MAC Studio Fix Fluid SPF 15",
    brand: "MAC",
    category: "Foundation",
    price: 980000,
    originalPrice: 1100000,
    description: "Kem nền kiềm dầu chuyên nghiệp chuẩn studio chụp ảnh, kiểm soát dầu thừa và bền màu 24h.",
    suitableSkinTypes: ["OILY", "COMBINATION", "NORMAL"],
    ingredients: ["Water", "Dimethicone", "Silica", "Titanium Dioxide", "Iron Oxides (CI 77491)", "Tocopherol"],
    images: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Kem Nền YSL All Hours Foundation Luminous Matte",
    brand: "YSL",
    category: "Foundation",
    price: 1550000,
    originalPrice: 1750000,
    description: "Kem nền sang trọng với phức hợp Hyaluronic Acid, lớp finish lì rạng rỡ suốt ngày đêm không xuống tông.",
    suitableSkinTypes: ["NORMAL", "DRY", "COMBINATION"],
    ingredients: ["Hyaluronic Acid", "Titanium Dioxide", "Dimethicone", "Silica", "Iron Oxides (CI 77492)"],
    images: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"]
  },

  // ==========================================
  // 4. EYESHADOW (>= 15 SẢN PHẨM)
  // ==========================================
  {
    name: "Bảng Phấn Mắt 9 Ô 3CE Multi Eye Color Palette Overtake",
    brand: "3CE",
    category: "Eyeshadow",
    price: 650000,
    originalPrice: 750000,
    description: "Bảng phấn mắt tone hồng đất và cam nâu ánh kim bán chạy nhất Châu Á, hạt phấn mịn bám màu lâu.",
    suitableSkinTypes: ["ALL"],
    ingredients: ["Mica", "Talc", "Silica", "Dimethicone", "Iron Oxides (CI 77491)", "Iron Oxides (CI 77499)"],
    images: ["https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Bảng Phấn Mắt 3CE Multi Eye Color Palette Plot Twist",
    brand: "3CE",
    category: "Eyeshadow",
    price: 650000,
    originalPrice: 750000,
    description: "Tone nâu cà phê và vàng đồng thanh lịch ấm áp, phù hợp cho cả trang điểm hàng ngày và tiệc tối.",
    suitableSkinTypes: ["ALL"],
    ingredients: ["Mica", "Talc", "Dimethicone", "Iron Oxides (CI 77492)", "Titanium Dioxide"],
    images: ["https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Bảng Phấn Mắt 10 Ô Clio Pro Eye Palette Koshort in Seoul",
    brand: "Clio",
    category: "Eyeshadow",
    price: 490000,
    originalPrice: 580000,
    description: "Bộ sưu tập mèo Koshort đáng yêu gồm các ô lì, nhũ mịn và kim tuyến lấp lánh như sương mai.",
    suitableSkinTypes: ["ALL"],
    ingredients: ["Mica", "Silica", "Dimethicone", "Red 7 Lake (CI 15850)", "Titanium Dioxide"],
    images: ["https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Bảng Phấn Mắt 10 Ô Romand Better Than Palette Secret Garden",
    brand: "Romand",
    category: "Eyeshadow",
    price: 420000,
    originalPrice: 490000,
    description: "10 sắc thái khu vườn bí mật với 5 cấp độ đậm nhạt khác nhau, tạo chiều sâu cuốn hút cho đôi mắt.",
    suitableSkinTypes: ["ALL"],
    ingredients: ["Talc", "Mica", "Silica", "Iron Oxides (CI 77491)", "Iron Oxides (CI 77492)"],
    images: ["https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Bảng Phấn Mắt 9 Ô Dasique Shadow Palette Milk Latte",
    brand: "Dasique",
    category: "Eyeshadow",
    price: 520000,
    originalPrice: 590000,
    description: "Tone be sữa latte dịu ngọt thuần khiết, hạt nhũ mịn ngọc trai bắt sáng tinh tế dưới ánh đèn.",
    suitableSkinTypes: ["ALL"],
    ingredients: ["Mica", "Dimethicone", "Silica", "Titanium Dioxide", "Iron Oxides (CI 77492)"],
    images: ["https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Bảng Phấn Mắt Urban Decay Naked3 Rose-Gold Palette",
    brand: "Urban Decay",
    category: "Eyeshadow",
    price: 1250000,
    originalPrice: 1450000,
    description: "12 ô màu tông vàng hồng rose gold quyến rũ kinh điển, độ bám màu vượt bậc không vón cục.",
    suitableSkinTypes: ["ALL"],
    ingredients: ["Talc", "Mica", "Silica", "Dimethicone", "Red 7 Lake (CI 15850)", "Iron Oxides (CI 77491)"],
    images: ["https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Bảng Phấn Mắt Morphe 35O Nature Glow Eyeshadow Palette",
    brand: "Morphe",
    category: "Eyeshadow",
    price: 750000,
    originalPrice: 890000,
    description: "Bảng mắt chuyên nghiệp 35 ô tông ấm nồng cháy, phù hợp cho mọi phong cách từ công sở đến lễ hội.",
    suitableSkinTypes: ["ALL"],
    ingredients: ["Mica", "Talc", "Dimethicone", "Iron Oxides (CI 77491)", "Iron Oxides (CI 77499)"],
    images: ["https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Bảng Phấn Mắt 12 Ô Perfect Diary Thám Hiểm Động Vật",
    brand: "Perfect Diary",
    category: "Eyeshadow",
    price: 450000,
    originalPrice: 520000,
    description: "Hạt phấn nhũ đa chiều bắt sáng lấp lánh như mắt hổ và cáo, giữ màu mắt lung linh suốt ngày dài.",
    suitableSkinTypes: ["ALL"],
    ingredients: ["Mica", "Silica", "Dimethicone", "Red 7 Lake (CI 15850)", "Titanium Dioxide"],
    images: ["https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Bảng Phấn Mắt 9 Ô ColourPop Going Coconuts",
    brand: "ColourPop",
    category: "Eyeshadow",
    price: 360000,
    originalPrice: 420000,
    description: "Tone nâu dừa trung tính hoàn hảo cho mọi tông da, chất phấn bơ mịn dễ tán ngay cả với người mới bắt đầu.",
    suitableSkinTypes: ["ALL"],
    ingredients: ["Mica", "Talc", "Silica", "Iron Oxides (CI 77491)", "Iron Oxides (CI 77492)"],
    images: ["https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Bảng Phấn Mắt 4 Ô Romand Better Than Eyes Dry Willow",
    brand: "Romand",
    category: "Eyeshadow",
    price: 260000,
    originalPrice: 310000,
    description: "Bộ 4 ô tiện lợi gồm 3 ô lì và 1 ô nhũ kim cương bắt sáng, phối màu chuẩn gu tinh tế.",
    suitableSkinTypes: ["ALL"],
    ingredients: ["Talc", "Mica", "Dimethicone", "Titanium Dioxide", "Iron Oxides (CI 77491)"],
    images: ["https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Bảng Phấn Mắt 9 Ô Huda Beauty Nude Obsessions Rich",
    brand: "Huda Beauty",
    category: "Eyeshadow",
    price: 890000,
    originalPrice: 1050000,
    description: "Sắc thái tone nude đỏ mận và sô cô la đậm đà, chất nhũ duo-chrome chuyển màu kỳ ảo theo góc nhìn.",
    suitableSkinTypes: ["ALL"],
    ingredients: ["Mica", "Silica", "Dimethicone", "Red 7 Lake (CI 15850)", "Iron Oxides (CI 77499)"],
    images: ["https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Bảng Phấn Mắt Etude House Play Color Eyes Bake House",
    brand: "Etude",
    category: "Eyeshadow",
    price: 360000,
    originalPrice: 420000,
    description: "Cảm hứng từ những chiếc bánh nướng thơm lừng mộc mạc, hạt phấn bám chắc vào mí mắt.",
    suitableSkinTypes: ["ALL"],
    ingredients: ["Talc", "Mica", "Silica", "Iron Oxides (CI 77492)", "Titanium Dioxide"],
    images: ["https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Nhũ Mắt Dạng Lỏng 3CE Eye Switch Double Note",
    brand: "3CE",
    category: "Eyeshadow",
    price: 340000,
    originalPrice: 390000,
    description: "Hạt kim tuyến lấp lánh phản chiếu ánh sáng rực rỡ, đầu cọ mảnh dễ nhấn khóe mắt và bọng mắt dưới.",
    suitableSkinTypes: ["ALL"],
    ingredients: ["Water", "Mica", "Glycerin", "Titanium Dioxide"],
    images: ["https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Bảng Phấn Mắt Focallure Sunrise 16 Ô Rực Rỡ",
    brand: "FOCALLURE",
    category: "Eyeshadow",
    price: 145000,
    originalPrice: 195000,
    description: "16 ô màu bình minh nhiệt đới với độ lên màu ấn tượng, phù hợp cho các buổi tiệc tùng sống động.",
    suitableSkinTypes: ["ALL"],
    ingredients: ["Mica", "Talc", "Dimethicone", "Red 7 Lake (CI 15850)", "Iron Oxides (CI 77491)"],
    images: ["https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Bảng Phấn Mắt 4 Ô Maybelline City Mini Palette Rooftop Bronzes",
    brand: "Maybelline",
    category: "Eyeshadow",
    price: 215000,
    originalPrice: 260000,
    description: "Tông đồng ánh hoàng hôn New York thời thượng, hạt phấn mượt mà không bị rơi bụi phấn xuống bọng mắt.",
    suitableSkinTypes: ["ALL"],
    ingredients: ["Talc", "Mica", "Silica", "Dimethicone", "Iron Oxides (CI 77491)"],
    images: ["https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=600&auto=format&fit=crop&q=80"]
  },

  // ==========================================
  // 5. CLEANSER & MAKEUP REMOVER (>= 25 SẢN PHẨM)
  // ==========================================
  {
    name: "Sữa Rửa Mặt Tạo Bọt CeraVe Foaming Facial Cleanser",
    brand: "CeraVe",
    category: "Cleanser",
    price: 360000,
    originalPrice: 410000,
    description: "Sữa rửa mặt dạng gel tạo bọt dịu nhẹ cho da thường đến da dầu, chứa 3 Ceramide thiết yếu củng cố hàng rào da.",
    suitableSkinTypes: ["OILY", "NORMAL", "COMBINATION"],
    ingredients: ["Ceramide NP", "Ceramide AP", "Ceramide EOP", "Niacinamide", "Hyaluronic Acid", "Phytosphingosine", "Cholesterol"],
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Sữa Rửa Mặt Dưỡng Ẩm CeraVe Hydrating Cleanser",
    brand: "CeraVe",
    category: "Cleanser",
    price: 360000,
    originalPrice: 410000,
    description: "Công nghệ MVE nhả chậm dưỡng chất, làm sạch không bọt êm dịu không làm tổn thương màng ẩm của da khô.",
    suitableSkinTypes: ["DRY", "SENSITIVE", "NORMAL"],
    ingredients: ["Ceramide NP", "Ceramide AP", "Ceramide EOP", "Hyaluronic Acid", "Glycerin", "Phytosphingosine"],
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Gel Rửa Mặt Giảm Mụn La Roche-Posay Effaclar Purifying Foaming Gel",
    brand: "La Roche-Posay",
    category: "Cleanser",
    price: 395000,
    originalPrice: 465000,
    description: "Công thức chuyên biệt cho da dầu mụn nhạy cảm với nước khoáng La Roche-Posay và Kẽm PCA kiềm dầu sạch sâu.",
    suitableSkinTypes: ["OILY", "COMBINATION", "SENSITIVE"],
    ingredients: ["Zinc PCA", "Water", "Coco-Glucoside", "Sodium Cocoyl Isethionate", "Citric Acid"],
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Nước Tẩy Trang La Roche-Posay Micellar Water Ultra Oily Skin",
    brand: "La Roche-Posay",
    category: "Cleanser",
    price: 435000,
    originalPrice: 495000,
    description: "Nước tẩy trang công nghệ hạt Micellar hút sạch 99% cặn trang điểm và bụi mịn PM2.5 mà không gây rát da.",
    suitableSkinTypes: ["OILY", "COMBINATION", "SENSITIVE"],
    ingredients: ["PEG-6 Caprylic/Capric Glycerides", "Zinc PCA", "Glycerin", "Water"],
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Nước Tẩy Trang Bioderma Sensibio H2O Hồng Dịu Nhẹ",
    brand: "Bioderma",
    category: "Cleanser",
    price: 440000,
    originalPrice: 495000,
    description: "Nước tẩy trang y khoa số 1 thế giới dành cho da nhạy cảm, độ pH 5.5 tương thích sinh học hoàn hảo.",
    suitableSkinTypes: ["SENSITIVE", "NORMAL", "DRY"],
    ingredients: ["PEG-6 Caprylic/Capric Glycerides", "Water", "Allantoin", "Glycerin"],
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Nước Tẩy Trang Bioderma Sebium H2O Xanh Kiềm Dầu",
    brand: "Bioderma",
    category: "Cleanser",
    price: 440000,
    originalPrice: 495000,
    description: "Phức hợp Fluidactiv điều hòa chất lượng bã nhờn sinh học, ngăn ngừa bít tắc chân lông sinh mụn.",
    suitableSkinTypes: ["OILY", "COMBINATION"],
    ingredients: ["PEG-6 Caprylic/Capric Glycerides", "Zinc PCA", "Water", "Glycerin"],
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Sữa Rửa Mặt Tạo Bọt Chiết Xuất Rau Diếp Cá Anua Heartleaf 77%",
    brand: "Anua",
    category: "Cleanser",
    price: 310000,
    originalPrice: 360000,
    description: "Chứa 77% chiết xuất diếp cá làm dịu ửng đỏ, bọt dày mịn xốp giảm thiểu lực ma sát tay trên da mụn nhạy cảm.",
    suitableSkinTypes: ["SENSITIVE", "OILY", "COMBINATION"],
    ingredients: ["Houttuynia Cordata Extract", "Centella Asiatica Extract", "Glycerin", "Coco-Glucoside", "Panthenol"],
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Dầu Tẩy Trang Làm Sạch Mụn Đầu Đen Anua Heartleaf Pore Control Cleansing Oil",
    brand: "Anua",
    category: "Cleanser",
    price: 380000,
    originalPrice: 450000,
    description: "Nhũ hóa cực nhanh hòa tan sạch mụn đầu đen và sợi bã nhờn cứng đầu, không gây bít tắc sinh mụn ẩn.",
    suitableSkinTypes: ["OILY", "COMBINATION", "NORMAL"],
    ingredients: ["Simmondsia Chinensis (Jojoba) Seed Oil", "Houttuynia Cordata Extract", "Centella Asiatica Extract", "Tocopherol"],
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Gel Rửa Mặt Lành Tính Simple Kind To Skin Refreshing Facial Wash",
    brand: "Simple",
    category: "Cleanser",
    price: 110000,
    originalPrice: 135000,
    description: "100% không xà phòng, công thức giàu Pro-Vitamin B5 và Vitamin E làm sạch thuần khiết cho làn da tuổi teen.",
    suitableSkinTypes: ["ALL", "SENSITIVE"],
    ingredients: ["Water", "Cocamidopropyl Betaine", "Panthenol", "Tocopherol", "Allantoin"],
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Sữa Rửa Mặt Dịu Nhẹ Buổi Sáng Cosrx Low pH Good Morning Gel Cleanser",
    brand: "Cosrx",
    category: "Cleanser",
    price: 185000,
    originalPrice: 230000,
    description: "Độ pH chuẩn 5.3 tương đương màng axit da, chứa BHA tự nhiên và tràm trà thanh lọc tế bào chết buổi sáng.",
    suitableSkinTypes: ["OILY", "COMBINATION", "SENSITIVE"],
    ingredients: ["Melaleuca Alternifolia (Tea Tree) Leaf Oil", "Salicylic Acid", "Allantoin", "Betaine"],
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Sữa Rửa Mặt Tinh Chất Trà Xanh Innisfree Green Tea Amino Acid Foam",
    brand: "Innisfree",
    category: "Cleanser",
    price: 240000,
    originalPrice: 285000,
    description: "Hợp chất Amino Acid từ trà xanh hữu cơ Beauty Green Tea đảo Jeju cấp ẩm mềm mượt sau khi rửa.",
    suitableSkinTypes: ["COMBINATION", "NORMAL", "DRY"],
    ingredients: ["Camellia Sinensis Leaf Extract", "Myristic Acid", "Stearic Acid", "Glycerin"],
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Sáp Tẩy Trang Banila Co Clean It Zero Original",
    brand: "Banila Co",
    category: "Cleanser",
    price: 350000,
    originalPrice: 420000,
    description: "Sáp tẩy trang tan chảy như kem tuyết, loại bỏ sạch hoàn toàn mascara chống nước và son lì cứng đầu.",
    suitableSkinTypes: ["NORMAL", "DRY", "COMBINATION"],
    ingredients: ["Simmondsia Chinensis (Jojoba) Seed Oil", "Tocopherol", "Water", "Glycerin"],
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Gel Rửa Mặt Cà Phê Đắk Lắk Cocoon Giúp Da Sạch Sâu Rạng Rỡ",
    brand: "Cocoon",
    category: "Cleanser",
    price: 175000,
    originalPrice: 205000,
    description: "Chiết xuất hạt cà phê Đắk Lắk giàu caffeine cùng dầu mù u chống oxy hóa, làm sáng và sạch mịn da.",
    suitableSkinTypes: ["NORMAL", "OILY", "COMBINATION"],
    ingredients: ["Coco-Glucoside", "Glycerin", "Allantoin", "Water"],
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Nước Tẩy Trang Hoa Hồng Hữu Cơ Cocoon Thuần Chay",
    brand: "Cocoon",
    category: "Cleanser",
    price: 245000,
    originalPrice: 285000,
    description: "Nước cất hoa hồng Cao Bằng hữu cơ kết hợp hoạt chất Bisabolol làm sạch êm ái, cấp ẩm se khít chân lông.",
    suitableSkinTypes: ["SENSITIVE", "DRY", "NORMAL"],
    ingredients: ["PEG-6 Caprylic/Capric Glycerides", "Glycerin", "Allantoin", "Panthenol"],
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Bọt Rửa Mặt Dưỡng Ẩm Sâu Hada Labo Gokujyun Hyaluronic Acid Bubble",
    brand: "Hada Labo",
    category: "Cleanser",
    price: 185000,
    originalPrice: 220000,
    description: "Thiết kế tạo bọt sẵn siêu tiện lợi chứa hệ dưỡng ẩm 2 loại Hyaluronic Acid khóa ẩm mềm mọng chuẩn Nhật.",
    suitableSkinTypes: ["NORMAL", "DRY", "SENSITIVE"],
    ingredients: ["Hyaluronic Acid", "Sodium Hyaluronate", "Glycerin", "Coco-Glucoside"],
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Sữa Rửa Mặt Tơ Tằm Senka Perfect Whip Kháng Khuẩn",
    brand: "Senka",
    category: "Cleanser",
    price: 105000,
    originalPrice: 125000,
    description: "Bọt tơ tằm trắng xốp dày gấp 5 lần len lỏi làm sạch bụi bẩn và bã nhờn ẩn sâu trong nang lông.",
    suitableSkinTypes: ["OILY", "COMBINATION"],
    ingredients: ["Myristic Acid", "Stearic Acid", "Glycerin", "Sodium Hyaluronate"],
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Bọt Rửa Mặt Rau Má Skin1004 Madagascar Centella Ampoule Foam",
    brand: "Skin1004",
    category: "Cleanser",
    price: 245000,
    originalPrice: 290000,
    description: "Chiết xuất rau má vùng Madagascar tinh khiết 33% giúp làm sạch sâu dịu mát và hồi phục màng da tổn thương.",
    suitableSkinTypes: ["SENSITIVE", "OILY", "COMBINATION"],
    ingredients: ["Centella Asiatica Extract", "Madecassoside", "Glycerin", "Coco-Glucoside"],
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Dầu Tẩy Trang Rau Má Skin1004 Madagascar Centella Light Cleansing Oil",
    brand: "Skin1004",
    category: "Cleanser",
    price: 360000,
    originalPrice: 420000,
    description: "Dầu tẩy trang kết cấu lỏng nhẹ như nước, nhũ hóa nhanh gọn không để lại cảm giác nhờn dính.",
    suitableSkinTypes: ["OILY", "COMBINATION", "NORMAL"],
    ingredients: ["Centella Asiatica Extract", "Simmondsia Chinensis (Jojoba) Seed Oil", "Tocopherol"],
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Sữa Rửa Mặt Giảm Mụn Paula's Choice Clear Pore Normalizing Cleanser",
    brand: "Paula's Choice",
    category: "Cleanser",
    price: 590000,
    originalPrice: 650000,
    description: "Công thức chứa 0.5% Salicylic Acid hòa tan bã nhờn, kháng khuẩn mụn trứng cá và làm dịu nốt mụn viêm sưng.",
    suitableSkinTypes: ["OILY", "COMBINATION"],
    ingredients: ["Salicylic Acid", "Panthenol", "Glycerin", "Water"],
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Sữa Rửa Mặt Klairs Rich Moist Foaming Cleanser Làm Dịu",
    brand: "Klairs",
    category: "Cleanser",
    price: 285000,
    originalPrice: 335000,
    description: "Tạo bọt tự nhiên từ Axit Amin dịu nhẹ không phá vỡ màng ẩm, chứa tràm trà và diếp cá lành tính.",
    suitableSkinTypes: ["SENSITIVE", "DRY", "NORMAL"],
    ingredients: ["Melaleuca Alternifolia (Tea Tree) Leaf Oil", "Houttuynia Cordata Extract", "Hyaluronic Acid", "Ceramide NP"],
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Nước Tẩy Trang Cấp Ẩm L'Oréal Paris Micellar Water 3-in-1 Deep Cleansing",
    brand: "L'Oréal",
    category: "Cleanser",
    price: 199000,
    originalPrice: 249000,
    description: "Kết cấu 2 lớp bi-phase vừa tẩy sạch cặn makeup chống trôi vừa giữ ẩm cho da mịn màng.",
    suitableSkinTypes: ["ALL"],
    ingredients: ["PEG-6 Caprylic/Capric Glycerides", "Glycerin", "Water"],
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Gel Rửa Mặt Tràm Trà Giảm Mụn Some By Mi AHA-BHA-PHA 30 Days Miracle",
    brand: "Some By Mi",
    category: "Cleanser",
    price: 245000,
    originalPrice: 295000,
    description: "Bộ 3 axit AHA-BHA-PHA kết hợp tràm trà hàm lượng cao loại bỏ tế bào chết và kháng khuẩn mụn thần tốc.",
    suitableSkinTypes: ["OILY", "COMBINATION"],
    ingredients: ["Salicylic Acid", "Lactic Acid", "Melaleuca Alternifolia (Tea Tree) Leaf Oil", "Centella Asiatica Extract"],
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Gel Rửa Mặt Cấp Nước Chuyên Sâu Torriden DIVE-IN Low Molecular Hyaluronic Acid",
    brand: "Torriden",
    category: "Cleanser",
    price: 320000,
    originalPrice: 375000,
    description: "Phức hợp 5 loại phân tử Hyaluronic Acid đa tầng, rửa sạch bụi bẩn mà làn da vẫn ẩm mượt như ngậm nước.",
    suitableSkinTypes: ["DRY", "NORMAL", "SENSITIVE"],
    ingredients: ["Hyaluronic Acid", "Sodium Hyaluronate", "Allantoin", "Panthenol"],
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Gel Rửa Mặt Dành Cho Da Dầu Mụn SVR Sebiaclear Gel Moussant",
    brand: "SVR",
    category: "Cleanser",
    price: 375000,
    originalPrice: 425000,
    description: "Hoạt chất Gluconolactone tinh khiết giúp thanh lọc tế bào chết bề mặt nhẹ nhàng và làm thông thoáng nang lông.",
    suitableSkinTypes: ["OILY", "COMBINATION", "SENSITIVE"],
    ingredients: ["Coco-Glucoside", "Glycerin", "Niacinamide", "Water"],
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Sữa Rửa Mặt Cetaphil Gentle Skin Cleanser Dịu Lành Cho Da Nhạy Cảm",
    brand: "Cetaphil",
    category: "Cleanser",
    price: 340000,
    originalPrice: 395000,
    description: "Công thức y khoa không xà phòng được các bác sĩ da liễu khuyên dùng cho làn da mẫn cảm và chàm ngứa.",
    suitableSkinTypes: ["SENSITIVE", "DRY", "NORMAL"],
    ingredients: ["Glycerin", "Niacinamide", "Panthenol", "Water"],
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"]
  },

  // ==========================================
  // 6. SKINCARE & SERUM (>= 30 SẢN PHẨM)
  // ==========================================
  {
    name: "Dung Dịch Tẩy Tế Bào Chết Hóa Học Paula's Choice Skin Perfecting 2% BHA Liquid",
    brand: "Paula's Choice",
    category: "Skincare",
    price: 850000,
    originalPrice: 950000,
    description: "Sản phẩm tẩy da chết hóa học số 1 thế giới với 2% Salicylic Acid làm sạch sâu lỗ chân lông và thu nhỏ chân lông.",
    suitableSkinTypes: ["OILY", "COMBINATION"],
    ingredients: ["Salicylic Acid", "Camellia Sinensis Leaf Extract", "Water"],
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Tinh Chất Niacinamide 20% Paula's Choice Clinical Niacinamide 20% Treatment",
    brand: "Paula's Choice",
    category: "Skincare",
    price: 1550000,
    originalPrice: 1750000,
    description: "Nồng độ 20% Niacinamide tinh khiết thu nhỏ lỗ chân lông phì đại và phục hồi bề mặt da thô ráp.",
    suitableSkinTypes: ["OILY", "COMBINATION", "NORMAL"],
    ingredients: ["Niacinamide", "Glycerin", "Allantoin", "Camellia Sinensis Leaf Extract"],
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Tinh Chất Phục Hồi Da Klairs Midnight Blue Youth Activating Drop",
    brand: "Klairs",
    category: "Skincare",
    price: 430000,
    originalPrice: 495000,
    description: "Chứa Peptide Đồng sinh học và chiết xuất hoa cúc xanh làm dịu kích ứng và tái sinh collagen màng đáy.",
    suitableSkinTypes: ["SENSITIVE", "DRY", "NORMAL"],
    ingredients: ["Copper Tripeptide-1", "Guaiazulene", "Hyaluronic Acid", "Water"],
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Kem Dưỡng Làm Dịu Phục Hồi Klairs Midnight Blue Calming Cream",
    brand: "Klairs",
    category: "Skincare",
    price: 395000,
    originalPrice: 460000,
    description: "Chất kem màu xanh biển dịu mát làm giảm tức thì cảm giác bỏng rát sau khi nặn mụn hoặc treatment nặng.",
    suitableSkinTypes: ["SENSITIVE", "OILY", "COMBINATION", "NORMAL"],
    ingredients: ["Centella Asiatica Extract", "Ceramide NP", "Hyaluronic Acid", "Simmondsia Chinensis (Jojoba) Seed Oil"],
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Nước Hoa Hồng Klairs Supple Preparation Unscented Toner",
    brand: "Klairs",
    category: "Skincare",
    price: 295000,
    originalPrice: 350000,
    description: "Toner dưỡng ẩm không mùi hương liệu, cân bằng độ pH và cung cấp độ ẩm sâu tức thì sau khi rửa mặt.",
    suitableSkinTypes: ["ALL", "SENSITIVE"],
    ingredients: ["Hyaluronic Acid", "Centella Asiatica Extract", "Panthenol", "Betaine"],
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Nước Hoa Hồng Diếp Cá Cân Bằng Dịu Da Anua Heartleaf 77% Soothing Toner",
    brand: "Anua",
    category: "Skincare",
    price: 390000,
    originalPrice: 450000,
    description: "Toner bán chạy số 1 tại Olive Young Hàn Quốc với 77% diếp cá giúp hạ nhiệt và giảm đỏ da mụn nhạy cảm.",
    suitableSkinTypes: ["SENSITIVE", "OILY", "COMBINATION"],
    ingredients: ["Houttuynia Cordata Extract", "Centella Asiatica Extract", "Panthenol", "Betaine"],
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Tinh Chất Rau Diếp Cá Giảm Mụn Anua Heartleaf 80% Moisture Soothing Ampoule",
    brand: "Anua",
    category: "Skincare",
    price: 460000,
    originalPrice: 530000,
    description: "Nồng độ đậm đặc 80% rau diếp cá bổ sung độ ẩm chuyên sâu, dập tắt ổ viêm sưng mụn chỉ sau 1 đêm.",
    suitableSkinTypes: ["SENSITIVE", "OILY", "COMBINATION"],
    ingredients: ["Houttuynia Cordata Extract", "Hyaluronic Acid", "Panthenol", "Betaine"],
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Serum Làm Dịu Da Mụn Nghệ Hưng Yên Cocoon Thuần Chay",
    brand: "Cocoon",
    category: "Skincare",
    price: 295000,
    originalPrice: 345000,
    description: "Chiết xuất củ nghệ Hưng Yên giàu curcuminoid kết hợp 4% Vitamin B3 và 2% NAG làm sáng mờ thâm mụn.",
    suitableSkinTypes: ["ALL", "SENSITIVE"],
    ingredients: ["Niacinamide", "Centella Asiatica Extract", "Allantoin", "Water"],
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Kem Dưỡng Ẩm Thạch Hoa Hồng Cocoon Mọng Nước 24H",
    brand: "Cocoon",
    category: "Skincare",
    price: 345000,
    originalPrice: 395000,
    description: "Kết cấu mọng nước thạch thấu nhanh chứa Hyaluronic Acid và nước hoa hồng hữu cơ nuôi dưỡng làn da căng mướt.",
    suitableSkinTypes: ["DRY", "NORMAL", "COMBINATION"],
    ingredients: ["Hyaluronic Acid", "Glycerin", "Panthenol", "Allantoin"],
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Tinh Chất Rau Má Phục Hồi Skin1004 Madagascar Centella Ampoule",
    brand: "Skin1004",
    category: "Skincare",
    price: 380000,
    originalPrice: 450000,
    description: "100% chiết xuất rau má Madagascar nguyên chất làm dịu và phục hồi tế bào da suy yếu tổn thương.",
    suitableSkinTypes: ["ALL", "SENSITIVE"],
    ingredients: ["Centella Asiatica Extract", "Madecassoside", "Asiaticoside"],
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Kem Dưỡng Rau Má Phục Hồi Skin1004 Madagascar Centella Soothing Cream",
    brand: "Skin1004",
    category: "Skincare",
    price: 360000,
    originalPrice: 420000,
    description: "Chứa 72% chiết xuất rau má kết hợp 4 loại Ceramide thực vật củng cố hàng rào lipid cho da dầu mụn.",
    suitableSkinTypes: ["OILY", "COMBINATION", "SENSITIVE"],
    ingredients: ["Centella Asiatica Extract", "Ceramide NP", "Ceramide AP", "Ceramide EOP", "Phytosphingosine"],
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Serum Trị Thâm Sáng Da The Ordinary Niacinamide 10% + Zinc 1%",
    brand: "The Ordinary",
    category: "Skincare",
    price: 245000,
    originalPrice: 290000,
    description: "Công thức kiểm soát bã nhờn vượt trội, làm mờ thâm sau mụn và se nhỏ lỗ chân lông hiệu quả.",
    suitableSkinTypes: ["OILY", "COMBINATION"],
    ingredients: ["Niacinamide", "Zinc PCA", "Water"],
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Serum Cấp Nước Chuyên Sâu The Ordinary Hyaluronic Acid 2% + B5",
    brand: "The Ordinary",
    category: "Skincare",
    price: 275000,
    originalPrice: 320000,
    description: "Hệ Hyaluronic Acid 3 kích thước phân tử kết hợp Vitamin B5 cấp ẩm đa tầng giúp làn da căng bóng mịn màng.",
    suitableSkinTypes: ["ALL", "DRY", "SENSITIVE"],
    ingredients: ["Hyaluronic Acid", "Sodium Hyaluronate", "Panthenol", "Water"],
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Serum Chống Lão Hóa The Ordinary Retinol 0.5% in Squalane",
    brand: "The Ordinary",
    category: "Skincare",
    price: 285000,
    originalPrice: 340000,
    description: "Dung dịch 0.5% Retinol nguyên chất trong nền dầu Squalane giảm thiểu kích ứng, kích thích tái tạo da.",
    suitableSkinTypes: ["NORMAL", "DRY", "COMBINATION"],
    ingredients: ["Squalane", "Retinol", "Simmondsia Chinensis (Jojoba) Seed Oil", "Tocopherol"],
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Serum Phục Hồi Đêm Estee Lauder Advanced Night Repair Synchronized Multi-Recovery",
    brand: "Estee Lauder",
    category: "Skincare",
    price: 2650000,
    originalPrice: 2950000,
    description: "Chai nâu huyền thoại công nghệ ChronoluxCB đánh thức khả năng phục hồi tế bào tự nhiên trong giấc ngủ.",
    suitableSkinTypes: ["ALL", "DRY", "COMBINATION"],
    ingredients: ["Bifida Ferment Lysate", "Hyaluronic Acid", "Squalane", "Glycerin"],
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Kem Dưỡng Ẩm Sâu Phục Hồi La Roche-Posay Cicaplast Baume B5+ Mẫu Mới",
    brand: "La Roche-Posay",
    category: "Skincare",
    price: 360000,
    originalPrice: 420000,
    description: "Bổ sung Tribioma cân bằng hệ vi sinh da, nồng độ 5% Panthenol và Madecassoside phục hồi biểu bì sau 1 giờ.",
    suitableSkinTypes: ["ALL", "DRY", "SENSITIVE"],
    ingredients: ["Panthenol", "Madecassoside", "Zinc Oxide", "Butyrospermum Parkii (Shea) Butter", "Glycerin"],
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Serum Giảm Mụn Đỏ La Roche-Posay Effaclar Ultra Concentrated Serum",
    brand: "La Roche-Posay",
    category: "Skincare",
    price: 850000,
    originalPrice: 950000,
    description: "Tổ hợp 3 loại axit Salicylic, Glycolic và LHA giải phóng bít tắc cổ nang lông và mờ thâm mụn chuyên sâu.",
    suitableSkinTypes: ["OILY", "COMBINATION"],
    ingredients: ["Salicylic Acid", "Glycolic Acid", "Niacinamide", "Water"],
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Serum Dưỡng Trắng Đều Màu Da Kiehl's Clearly Corrective Dark Spot Solution",
    brand: "Kiehl's",
    category: "Skincare",
    price: 1850000,
    originalPrice: 2100000,
    description: "Dẫn xuất Vitamin C hoạt tính thế hệ mới kết hợp chiết xuất Bạch Dương Trắng làm mờ đốm nâu nám sạm.",
    suitableSkinTypes: ["ALL", "SENSITIVE"],
    ingredients: ["3-O-Ethyl Ascorbic Acid", "Salicylic Acid", "Tocopherol", "Glycerin"],
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Kem Dưỡng Ẩm Cấp Nước Suốt 24H Kiehl's Ultra Facial Cream",
    brand: "Kiehl's",
    category: "Skincare",
    price: 950000,
    originalPrice: 1100000,
    description: "Chiết xuất đạm Glycoprotein từ băng Nam Cực và dầu Squalane khóa ẩm mạnh mẽ trong mọi điều kiện thời tiết.",
    suitableSkinTypes: ["DRY", "NORMAL", "COMBINATION"],
    ingredients: ["Squalane", "Glycerin", "Water"],
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Kem Dưỡng Phục Hồi Hàng Rào Ẩm Obagi Kinetin+ Hydrating Cream",
    brand: "Obagi",
    category: "Skincare",
    price: 1450000,
    originalPrice: 1650000,
    description: "Phức hợp Kinetin và Zeatin từ thực vật phục hồi chuyên sâu cấu trúc da mỏng yếu do dùng kem trộn hoặc corticoid.",
    suitableSkinTypes: ["SENSITIVE", "DRY", "NORMAL"],
    ingredients: ["Panthenol", "Allantoin", "Sodium Hyaluronate", "Tocopherol"],
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Serum Chống Oxy Hóa Đỉnh Cao SkinCeuticals C E Ferulic",
    brand: "SkinCeuticals",
    category: "Skincare",
    price: 3650000,
    originalPrice: 4100000,
    description: "Tỉ lệ vàng 15% Pure Vitamin C + 1% Vitamin E + 0.5% Ferulic Acid nhân 8 lần sức mạnh bảo vệ da trước tia UV.",
    suitableSkinTypes: ["NORMAL", "DRY", "COMBINATION"],
    ingredients: ["Ascorbic Acid", "Tocopherol", "Glycerin", "Water"],
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Serum Dưỡng Trắng Mờ Nám Goodndoc Snail Ultra Moisture Essence",
    brand: "Goodndoc",
    category: "Skincare",
    price: 490000,
    originalPrice: 560000,
    description: "Chứa dịch ốc sên và Niacinamide dưỡng ẩm sâu, mờ sẹo rỗ và nuôi dưỡng làn da căng mọng trẻ trung.",
    suitableSkinTypes: ["ALL", "DRY"],
    ingredients: ["Snail Secretion Filtrate", "Niacinamide", "Centella Asiatica Extract", "Panthenol"],
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Serum Cấp Ẩm Đa Tầng Torriden DIVE-IN Low Molecular Hyaluronic Acid Serum",
    brand: "Torriden",
    category: "Skincare",
    price: 420000,
    originalPrice: 480000,
    description: "Serum cấp ẩm quốc dân Hàn Quốc thẩm thấu nhanh như nước, làm dịu tức thì tình trạng da khô căng rát.",
    suitableSkinTypes: ["ALL", "DRY", "SENSITIVE"],
    ingredients: ["Hyaluronic Acid", "Sodium Hyaluronate", "Allantoin", "Panthenol", "Ceramide NP"],
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Kem Dưỡng Làm Dịu Chiết Xuất Ngải Cứu I'm From Mugwort Cream",
    brand: "I'm From",
    category: "Skincare",
    price: 490000,
    originalPrice: 560000,
    description: "Chứa 73.55% ngải cứu lên men vùng Ganghwa giúp thanh lọc giải độc và hạ nhiệt làn da ửng đỏ.",
    suitableSkinTypes: ["SENSITIVE", "OILY", "COMBINATION"],
    ingredients: ["Artemisia Princeps Extract", "Glycerin", "Allantoin", "Panthenol"],
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Serum Keo Ong Căng Bóng Tỏa Sáng Beauty of Joseon Glow Serum",
    brand: "Beauty of Joseon",
    category: "Skincare",
    price: 320000,
    originalPrice: 380000,
    description: "Cảm hứng y học cổ truyền triều đại Joseon với 60% keo ong và 2% Niacinamide cho làn da bừng sáng.",
    suitableSkinTypes: ["NORMAL", "DRY", "COMBINATION"],
    ingredients: ["Propolis Extract", "Niacinamide", "Sodium Hyaluronate", "Centella Asiatica Extract"],
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Kem Chống Nắng Thuần Vật Lý Skin1004 Madagascar Centella Air-Fit Suncream Plus SPF50+",
    brand: "Skin1004",
    category: "Skincare",
    price: 330000,
    originalPrice: 390000,
    description: "Màng lọc khoáng chất Zinc Oxide dịu nhẹ nâng tông trắng hồng tự nhiên, kiềm dầu nhẹ tênh cả ngày.",
    suitableSkinTypes: ["ALL", "SENSITIVE"],
    ingredients: ["Zinc Oxide", "Titanium Dioxide", "Centella Asiatica Extract", "Niacinamide", "Madecassoside"],
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Kem Chống Nắng Hóa Học Cấp Ẩm Beauty of Joseon Relief Sun: Rice + Probiotics SPF50+",
    brand: "Beauty of Joseon",
    category: "Skincare",
    price: 330000,
    originalPrice: 390000,
    description: "Kem chống nắng chứa 30% chiết xuất gạo lên men thẩm thấu êm ái như kem dưỡng ẩm không vệt trắng.",
    suitableSkinTypes: ["DRY", "NORMAL", "SENSITIVE"],
    ingredients: ["Ethylhexyl Triazone", "Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine", "Niacinamide", "Glycerin"],
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Kem Dưỡng Ẩm Chống Lão Hóa Ban Đêm Olay Regenerist Retinol 24 Night Moisturizer",
    brand: "Olay",
    category: "Skincare",
    price: 499000,
    originalPrice: 599000,
    description: "Phức hợp độc quyền Retinol + Niacinamide cải thiện rõ rệt nếp nhăn và đốm nâu sau 28 đêm.",
    suitableSkinTypes: ["NORMAL", "DRY", "COMBINATION"],
    ingredients: ["Retinol", "Niacinamide", "Palmitoyl Tripeptide-1", "Glycerin"],
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Kem Dưỡng Cấp Nước Neutrogena Hydro Boost Water Gel",
    brand: "Neutrogena",
    category: "Skincare",
    price: 365000,
    originalPrice: 420000,
    description: "Chất gel xanh mát lạnh khóa ẩm suốt 72 giờ, giải tỏa tức thì cơn khát nước của da dầu thiếu ẩm.",
    suitableSkinTypes: ["OILY", "COMBINATION", "NORMAL"],
    ingredients: ["Hyaluronic Acid", "Dimethicone", "Glycerin"],
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"]
  },
  {
    name: "Serum Dưỡng Trắng Cấp Nước L'Oréal Paris Revitalift 1.5% Pure Hyaluronic Acid",
    brand: "L'Oréal",
    category: "Skincare",
    price: 399000,
    originalPrice: 479000,
    description: "Serum cấp ẩm số 1 thế giới với 1.5% Hyaluronic Acid phân tử kép làm mờ nếp nhăn và da căng mịn.",
    suitableSkinTypes: ["ALL", "DRY"],
    ingredients: ["Hyaluronic Acid", "Sodium Hyaluronate", "Glycerin", "Water"],
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"]
  }
];

/**
 * Main Crawler and Pipeline Orchestrator.
 */
async function runCrawler() {
  console.log("==================================================================");
  console.log("🚀 STARTING COSMETICS CRAWLER & MULTI-VENDOR ENRICHMENT PIPELINE");
  console.log("==================================================================");

  const enrichedProducts = [];

  // Summary counts per category
  const categoryCounts = {
    Lipstick: 0,
    Blush: 0,
    Foundation: 0,
    Eyeshadow: 0,
    Cleanser: 0,
    Skincare: 0
  };

  CURATED_CATALOG.forEach((raw, idx) => {
    const id = `PROD-CRW-${String(idx + 1).padStart(3, '0')}`;
    const shop = VENDOR_SHOPS[idx % VENDOR_SHOPS.length];
    const cat = raw.category;

    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

    // 1. Generate CBMP Registration Number (Format: XXXXXX/YY/CBMP-QLD)
    const randomSeq = 100000 + Math.floor(Math.random() * 899999);
    const cbmpNumber = `${randomSeq}/24/CBMP-QLD`;

    // 2. Enrich INCI ingredients with scientific safety ratings
    const ingredients = enrichIngredients(raw.ingredients);

    // 3. Extract AR VTO configuration for makeup categories
    const vtoConfig = extractVtoConfig(cat, `SKU-CRW-${idx + 1}`);

    // 4. Generate variants (matching VTO shades if available, or default size variants)
    let variants = [];
    if (vtoConfig && vtoConfig.shades && vtoConfig.shades.length > 0) {
      variants = vtoConfig.shades.map(s => ({
        skuCode: s.skuCode,
        name: `${raw.name} - ${s.shadeName}`,
        price: raw.price,
        originalPrice: raw.originalPrice,
        attributes: {
          Shade: s.shadeName,
          Finish: s.finishType,
          Hex: s.hexColor
        }
      }));
    } else {
      variants = [
        {
          skuCode: `SKU-CRW-${idx + 1}-STD`,
          name: `${raw.name} - Tiêu chuẩn`,
          price: raw.price,
          originalPrice: raw.originalPrice,
          attributes: { DungTich: "Tiêu chuẩn" }
        }
      ];
    }

    const productDoc = {
      id,
      shopId: shop.id,
      name: raw.name,
      brand: raw.brand,
      description: raw.description,
      category: raw.category,
      registrationNo: cbmpNumber,
      suitableSkinTypes: raw.suitableSkinTypes,
      ingredients,
      variants,
      images: raw.images,
      vtoConfig,
      status: "PUBLISHED",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    enrichedProducts.push(productDoc);
  });

  console.log(`\n✅ Successfully generated & enriched ${enrichedProducts.length} cosmetics products!`);
  console.log("📊 Category Breakdown:");
  Object.entries(categoryCounts).forEach(([cat, cnt]) => {
    console.log(`   - ${cat.padEnd(12)}: ${cnt} products`);
  });

  console.log("\n🏪 Vendor Shop Distribution:");
  const shopCounts = {};
  enrichedProducts.forEach(p => {
    shopCounts[p.shopId] = (shopCounts[p.shopId] || 0) + 1;
  });
  VENDOR_SHOPS.forEach(s => {
    console.log(`   - ${s.name.padEnd(28)} (${s.code}): ${shopCounts[s.id] || 0} products`);
  });

  // Export artifacts (JSON, SQL)
  await exportArtifacts(enrichedProducts);

  console.log("\n🎉 Crawl & Enrichment complete!");
}

if (require.main === module) {
  runCrawler().catch(err => {
    console.error("Crawler error:", err);
    process.exit(1);
  });
}

module.exports = {
  runCrawler,
  VENDOR_SHOPS,
  CURATED_CATALOG
};
