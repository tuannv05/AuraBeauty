// =========================================================================
// SMART SUBMENU MAPPER & CURATED DATA ENRICHER
// Đảm bảo 100% 51 Sub-menu con, Vấn đề da & Thương hiệu không bao giờ bị trắng màn hình
// =========================================================================

export const SUBMENU_DEFINITIONS = [
  // 1. Skincare (10 submenus)
  {
    slug: 'tay-trang',
    name: 'Tẩy trang (Nước / Dầu / Sáp)',
    parent: 'Chăm sóc da mặt',
    keywords: ['tẩy trang', 'micellar', 'cleansing oil', 'cleansing water', 'sáp tẩy trang', 'bioderma', 'banila'],
    banner: {
      title: 'Dung Dịch & Dầu Tẩy Trang Làm Sạch Sâu',
      desc: 'Công nghệ Micellar Water & dầu thực vật nhũ hóa tức thì, quét sạch bụi mịn PM2.5 và lớp makeup kháng nước mà không gây khô căng.',
      badge: 'Làm Sạch Dịu Nhẹ'
    }
  },
  {
    slug: 'sua-rua-mat',
    name: 'Sữa rửa mặt (Gel / Bọt / Kem)',
    parent: 'Chăm sóc da mặt',
    keywords: ['sữa rửa mặt', 'cleanser', 'cleansing foam', 'cerave', 'cosrx', 'la roche-posay', 'gel rửa mặt'],
    banner: {
      title: 'Sữa Rửa Mặt Cân Bằng pH 5.5 Chuẩn Da Liễu',
      desc: 'Dạng gel và bọt mịn chứa Ceramide, BHA và Panthenol làm sạch sâu lỗ chân lông, bảo vệ màng acid mantle tự nhiên.',
      badge: 'Bác Sĩ Khuyên Dùng'
    }
  },
  {
    slug: 'tay-te-bao-chet-mat',
    name: 'Tẩy tế bào chết (AHA/BHA Hóa học & Hạt vật lý)',
    parent: 'Chăm sóc da mặt',
    keywords: ['tẩy tế bào chết', 'exfoliant', 'bha', 'aha', 'scrub', 'lactic acid', 'salicylic acid', 'peeling'],
    banner: {
      title: 'Tẩy Da Chết Hóa Học AHA / BHA Khoa Học',
      desc: 'Bóc tách tế bào sừng già cỗi, gom cồi mụn ẩn và kích thích tái tạo collagen cho làn da căng bóng mịn màng.',
      badge: 'Treatment Chuyên Sâu'
    }
  },
  {
    slug: 'toner-nuoc-hoa-hong',
    name: 'Toner / Nước hoa hồng cân bằng pH',
    parent: 'Chăm sóc da mặt',
    keywords: ['toner', 'nước hoa hồng', 'cân bằng', 'heartleaf', 'diếp cá', 'centella', 'anua', 'thayers'],
    banner: {
      title: 'Nước Cân Bằng Cấp Nước & Làm Dịu Da',
      desc: 'Chiết xuất 77% Diếp cá Heartleaf và Rau má Centella hạ nhiệt da tức thì, se khít lỗ chân lông và mở đường hấp thụ dưỡng chất.',
      badge: 'Cân Bằng Đa Tầng'
    }
  },
  {
    slug: 'serum-tinh-chat',
    name: 'Serum / Tinh chất đặc trị phục hồi',
    parent: 'Chăm sóc da mặt',
    keywords: ['serum', 'tinh chất', 'ampoule', 'b5', 'hyaluronic', 'niacinamide', 'vitamin c', 'retinol'],
    banner: {
      title: 'Serum & Tinh Chất Đặc Trị Đột Phá',
      desc: 'Nồng độ hoạt chất vàng tối ưu giúp giải quyết tận gốc các vấn đề da: thâm đỏ mụn, lão hóa, mất nước và sạm nám.',
      badge: 'Hoạt Chất Đậm Đặc'
    }
  },
  {
    slug: 'kem-duong-am',
    name: 'Kem dưỡng ẩm khóa nước',
    parent: 'Chăm sóc da mặt',
    keywords: ['kem dưỡng', 'moisturizer', 'cream', 'gel cream', 'ceramide', 'khóa ẩm', 'cấp ẩm'],
    banner: {
      title: 'Kem Dưỡng Khóa Ẩm & Tái Thiết Hàng Rào Bảo Vệ',
      desc: 'Công thức giàu Ceramide NP/AP/EOP và Hyaluronic Acid khóa chặt độ ẩm suốt 48 giờ, ngăn chặn thoát nước biểu bì.',
      badge: 'Khóa Ẩm 48H'
    }
  },
  {
    slug: 'dau-duong-da',
    name: 'Dầu dưỡng da chuyên sâu (Facial Oil)',
    parent: 'Chăm sóc da mặt',
    keywords: ['dầu dưỡng', 'facial oil', 'squalane', 'rosehip', 'dầu hạt', 'dầu marula'],
    banner: {
      title: 'Dầu Dưỡng Da Thực Vật Squalane & Rosehip',
      desc: 'Nuôi dưỡng làn da khô ráp và lão hóa với các acid béo thiết yếu Omega 3-6-9, thẩm thấu nhanh không gây bít tắc.',
      badge: 'Nuôi Dưỡng Chuyên Sâu'
    }
  },
  {
    slug: 'mat-na',
    name: 'Mặt nạ (Mặt nạ giấy / Đất sét thải độc / Mặt nạ ngủ)',
    parent: 'Chăm sóc da mặt',
    keywords: ['mặt nạ', 'mask', 'sheet mask', 'đất sét', 'volcanic', 'clay mask', 'mặt nạ ngủ'],
    banner: {
      title: 'Mặt Nạ Đất Sét Hút Sạch Bã Nhờn & Mặt Nạ Giấy Dưỡng Ẩm',
      desc: 'Tro núi lửa Jeju hút sạch sợi bã nhờn kết hợp mặt nạ sinh học dưỡng ẩm phục hồi cấp tốc sau 15 phút.',
      badge: 'Spa Tại Nhà'
    }
  },
  {
    slug: 'kem-chong-nang',
    name: 'Kem chống nắng (Vật lý / Hóa học / Lai)',
    parent: 'Chăm sóc da mặt',
    keywords: ['chống nắng', 'sunscreen', 'sun cream', 'sun fluid', 'uv', 'spf', 'uvinul', 'mexoryl', 'tinosorb'],
    banner: {
      title: 'Kem Chống Nắng Quang Phổ Rộng Màng Lọc Tối Tân',
      desc: 'Bảo vệ da tuyệt đối trước tia UVA, UVB, tia hồng ngoại và ánh sáng xanh HEV với chỉ số SPF 50+ PA++++ kiểm nghiệm độc lập.',
      badge: 'Màng Lọc Tối Tân'
    }
  },
  {
    slug: 'xit-khoang',
    name: 'Xịt khoáng làm dịu da khẩn cấp',
    parent: 'Chăm sóc da mặt',
    keywords: ['xịt khoáng', 'thermal spring water', 'mist', 'avene', 'la roche-posay', 'làm dịu'],
    banner: {
      title: 'Nước Khoáng Tinh Khiết Làm Dịu Kích Ứng Khẩn Cấp',
      desc: 'Giàu khoáng chất Selenium và Kẽm vi lượng giúp làm dịu vết đỏ rát, cháy nắng và duy trì độ ẩm tự nhiên suốt cả ngày dài.',
      badge: 'Khoáng Chất Vi Lượng'
    }
  },

  // 2. Makeup (16 submenus)
  {
    slug: 'kem-lot-primer',
    name: 'Kem lót (Primer kiềm dầu / cấp ẩm)',
    parent: 'Trang điểm',
    keywords: ['kem lót', 'primer', 'kiềm dầu', 'poreless', 'blur'],
    banner: {
      title: 'Kem Lót Làm Mịn Lỗ Chân Lông & Kiềm Dầu 12H',
      desc: 'Làm mờ lỗ chân lông tức thì, tạo lớp đệm nhung mịn cho lớp nền bám chặt và không xuống tông cả ngày.',
      badge: 'Che Khuyết Điểm'
    }
  },
  {
    slug: 'kem-nen-foundation',
    name: 'Kem nền (Liquid Foundation)',
    parent: 'Trang điểm',
    keywords: ['kem nền', 'foundation', 'liquid foundation', 'che phủ', 'lâu trôi', 'mac', 'maybelline'],
    banner: {
      title: 'Kem Nền Mịn Lì & Căng Bóng Tự Nhiên',
      desc: 'Độ che phủ linh hoạt từ vừa đến cao, kiềm dầu kháng nước và chống oxy hóa giữ sắc màu chuẩn đẹp suốt 24 giờ.',
      badge: 'Lâu Trôi 24H'
    }
  },
  {
    slug: 'phan-nuoc-cushion',
    name: 'Phấn nước (Cushion)',
    parent: 'Trang điểm',
    keywords: ['cushion', 'phấn nước', 'glow', 'tiện lợi', 'romand', 'clio'],
    banner: {
      title: 'Phấn Nước Cushion Căng Bóng Chuẩn K-Beauty',
      desc: 'Hạt phấn siêu mịn tiệp vào da chỉ với một lần dặm, mang lại lớp nền trong veo tự nhiên chuẩn làn da sứ Hàn Quốc.',
      badge: 'Glass Skin'
    }
  },
  {
    slug: 'kem-che-khuyet-diem',
    name: 'Kem che khuyết điểm (Concealer)',
    parent: 'Trang điểm',
    keywords: ['che khuyết điểm', 'concealer', 'quầng thâm', 'thâm mụn'],
    banner: {
      title: 'Kem Che Khuyết Điểm Siêu Bám & Che Phủ Tuyệt Đối',
      desc: 'Xóa mờ quầng thâm mắt, thâm mụn đỏ và đốm nâu mà không gây đọng rãnh nhăn hay dày bí lớp makeup.',
      badge: 'Độ Che Phủ Cao'
    }
  },
  {
    slug: 'phan-phu-kiem-dau',
    name: 'Phấn phủ kiềm dầu (Phấn nén / Phấn bột)',
    parent: 'Trang điểm',
    keywords: ['phấn phủ', 'setting powder', 'loose powder', 'no-sebum', 'bột kiềm dầu'],
    banner: {
      title: 'Phấn Phủ Khoáng Hút Dầu Bền Bỉ No-Sebum',
      desc: 'Khoáng chất tự nhiên khóa lớp nền bền màu, kiểm soát dầu nhờn vùng chữ T cho làn da ráo mịn cả ngày.',
      badge: 'Kiềm Dầu 16H'
    }
  },
  {
    slug: 'ma-hong',
    name: 'Má hồng (Phấn má / Kem má)',
    parent: 'Trang điểm',
    keywords: ['má hồng', 'blush', 'phấn má', 'kem má', 'má kem', 'cheek'],
    banner: {
      title: 'Má Hồng Căng Mọng & Ửng Hồng Tự Nhiên (Hỗ Trợ AR Try-On)',
      desc: 'Sắc thái má hồng đa dạng phù hợp mọi tone da Warm/Cool/Neutral, dễ dàng tán đều và bám màu 8-12 tiếng.',
      badge: 'Hỗ Trợ AR VTO'
    }
  },
  {
    slug: 'tao-khoi-highlight',
    name: 'Tạo khối & Bắt sáng (Contour & Highlight)',
    parent: 'Trang điểm',
    keywords: ['tạo khối', 'contour', 'highlight', 'bắt sáng', 'bronzer', 'nhũ'],
    banner: {
      title: 'Bảng Tạo Khối V-Line & Bắt Sáng Ngọc Trai 3D',
      desc: 'Tôn đường nét thon gọn khuôn mặt, điểm bắt sáng lấp lánh phản chiếu ánh sáng đa chiều tinh tế.',
      badge: 'Định Hình 3D'
    }
  },
  {
    slug: 'ke-mat-eyeliner',
    name: 'Bút kẻ mắt (Eyeliner nước / chì)',
    parent: 'Trang điểm',
    keywords: ['kẻ mắt', 'eyeliner', 'chì kẻ mắt', 'mắt nước', 'chống lem'],
    banner: {
      title: 'Bút Kẻ Mắt Nước Kháng Nước Đầu Cọ Siêu Mảnh 0.01mm',
      desc: 'Nét kẻ sắc bén, mực ra đều và bền bỉ chống lem trôi trước mồ hôi, dầu thừa và nước mắt suốt cả ngày.',
      badge: 'Kháng Nước Lem'
    }
  },
  {
    slug: 'mascara',
    name: 'Mascara làm dài và cong mi',
    parent: 'Trang điểm',
    keywords: ['mascara', 'chuốt mi', 'dài mi', 'cong mi', 'waterproof'],
    banner: {
      title: 'Mascara Nâng Mi Cong Vút & Tơi Từng Sợi Mi',
      desc: 'Công thức chứa vi sợi tơ nối mi tự nhiên, khóa độ cong 18 tiếng không vón cục và chống thấm nước hoàn hảo.',
      badge: 'Khóa Cong 18H'
    }
  },
  {
    slug: 'phan-mat',
    name: 'Bảng phấn mắt đa sắc',
    parent: 'Trang điểm',
    keywords: ['phấn mắt', 'eyeshadow', 'bảng mắt', 'nhũ mắt', 'glitter'],
    banner: {
      title: 'Bảng Phấn Mắt Phối Màu Đa Phong Cách Mịn Nhẹ',
      desc: 'Hạt phấn nén ngọc trai mềm mượt, kết hợp hoàn hảo giữa tông lì tự nhiên và nhũ lấp lánh đa chiều.',
      badge: 'Đa Sắc Thái'
    }
  },
  {
    slug: 'chi-ke-may',
    name: 'Chì kẻ mày & Gel định hình mày',
    parent: 'Trang điểm',
    keywords: ['kẻ mày', 'chì mày', 'eyebrow', 'gel mày', 'định hình mày'],
    banner: {
      title: 'Chì Kẻ Mày Phẩy Sợi Tự Nhiên & Mascara Mày Lâu Trôi',
      desc: 'Đầu chì vát xéo định hình khung chân mày chuẩn xác, chất bột lì bám tốt không gây bết dính.',
      badge: 'Định Hình Sợi'
    }
  },
  {
    slug: 'son-thoi-li',
    name: 'Son thỏi lì & mịn mượt (Matte / Satin)',
    parent: 'Trang điểm',
    keywords: ['son thỏi', 'son lì', 'matte lipstick', 'satin', 'rouge', 'mac', 'romand'],
    banner: {
      title: 'BST Son Thỏi Lì Cao Cấp Mịn Như Nhung (Hỗ Trợ AR Try-On)',
      desc: 'Lên màu chuẩn chỉ với một đường lướt, chất son nhẹ tênh làm mờ rãnh môi cùng khả năng thử màu thực tế ảo AR webcam.',
      badge: 'Hỗ Trợ AR VTO'
    }
  },
  {
    slug: 'son-kem-tint',
    name: 'Son kem & Son tint lâu trôi (Velvet Tint)',
    parent: 'Trang điểm',
    keywords: ['son kem', 'son tint', 'velvet tint', 'kem lì', 'lâu trôi'],
    banner: {
      title: 'Son Kem Lì Velvet Tint Kháng Nước Siêu Bền Màu',
      desc: 'Hiệu ứng mịn mờ mộng mơ, lớp tint bám chặt bền bỉ đến 10 giờ ăn uống không lo trôi màu.',
      badge: 'Bền Màu 10H'
    }
  },
  {
    slug: 'son-bong',
    name: 'Son bóng căng mọng gương (Glossy Lip)',
    parent: 'Trang điểm',
    keywords: ['son bóng', 'lip gloss', 'căng mọng', 'bóng gương', 'juicy'],
    banner: {
      title: 'Son Bóng Căng Mọng Tráng Gương Thủy Tinh',
      desc: 'Tạo hiệu ứng môi căng đầy quyến rũ, bổ sung dưỡng chất dầu hạt jojoba nuôi dưỡng môi không gây dính rít.',
      badge: 'Hiệu Ứng Gương'
    }
  },
  {
    slug: 'son-duong',
    name: 'Son dưỡng có màu / không màu',
    parent: 'Trang điểm',
    keywords: ['son dưỡng', 'lip balm', 'dưỡng môi', 'trị thâm môi', 'bơ hạt mỡ'],
    banner: {
      title: 'Son Dưỡng Ẩm Chuyên Sâu & Phục Hồi Sắc Tố Môi',
      desc: 'Chiết xuất dầu dừa hữu cơ, bơ hạt mỡ và vitamin E làm mềm vết nứt nẻ và làm sáng hồng viền môi tự nhiên.',
      badge: 'Dưỡng Ẩm Sâu'
    }
  },
  {
    slug: 'tay-da-chet-moi',
    name: 'Tẩy tế bào chết & Mặt nạ ủ môi',
    parent: 'Trang điểm',
    keywords: ['tẩy da chết môi', 'ủ môi', 'lip sleeping mask', 'scrub môi', 'laneige'],
    banner: {
      title: 'Mặt Nạ Ngủ Môi & Tẩy Tế Bào Chết Hạt Đường Mềm Mượt',
      desc: 'Phức hợp quả mọng Berry làm tan lớp tế bào sừng khô ráp trong giấc ngủ, cho đôi môi mọng nước mịn màng mỗi sáng.',
      badge: 'Ủ Môi Ban Đêm'
    }
  },

  // 3. Body Care (7 submenus)
  {
    slug: 'cham-soc-co-the',
    name: 'Chăm sóc cơ thể',
    parent: 'Chăm sóc cơ thể',
    keywords: ['chăm sóc cơ thể', 'bodycare', 'body care', 'làm sạch cơ thể', 'dưỡng thể & vệ sinh'],
    banner: {
      title: 'Chăm Sóc Cơ Thể Toàn Diện & Trắng Mịn',
      desc: 'Sữa tắm lưu hương cao cấp, tẩy da chết toàn thân và dưỡng thể chuẩn da liễu cho làn da sáng mịn rạng ngời.',
      badge: 'Body Care Essentials'
    }
  },
  {
    slug: 'sua-tam',
    name: 'Sữa tắm dưỡng ẩm / làm sáng',
    parent: 'Chăm sóc cơ thể',
    keywords: ['sữa tắm', 'body wash', 'shower gel', 'tắm dưỡng thể', 'làm sáng body', 'dove deep moisture', 'cetaphil refresh'],
    banner: {
      title: 'Sữa Tắm Dưỡng Ẩm Hương Nước Hoa Cao Cấp',
      desc: 'Công thức dịu nhẹ không chứa sulfate, bổ sung dầu oliu và tinh dầu hoa hồng dưỡng da mềm mịn và ngát hương thơm.',
      badge: 'Hương Nước Hoa'
    }
  },
  {
    slug: 'tay-da-chet-body',
    name: 'Tẩy da chết toàn thân (Body Scrub)',
    parent: 'Chăm sóc cơ thể',
    keywords: ['tẩy da chết body', 'tẩy da chết toàn thân', 'body scrub', 'tẩy tế bào chết body', 'body polish', 'dove hạt lựu', 'tẩy tế bào chết toàn thân'],
    banner: {
      title: 'Tẩy Tế Bào Chết Cơ Thể Cà Phê Đắk Lắk Thuần Chay',
      desc: 'Hạt cà phê nguyên chất xay mịn cuốn trôi lớp sừng già cỗi, làm sáng vùng da sần sùi đầu gối, khuỷu tay và giảm viêm nang lông.',
      badge: 'Thuần Chay 100%'
    }
  },
  {
    slug: 'muoi-tam',
    name: 'Muối tắm thư giãn',
    parent: 'Chăm sóc cơ thể',
    keywords: ['muối tắm', 'muối tắm thư giãn', 'bath salt', 'epsom', 'thư giãn', 'ngâm bồn', 'a bonné', 'sữa bò'],
    banner: {
      title: 'Muối Tắm Khoáng Epsom Thư Giãn Thải Độc Làn Da',
      desc: 'Khoáng chất Magie tự nhiên giải tỏa căng thẳng cơ bắp, hỗ trợ đào thải độc tố và dưỡng da mịn màng sau ngày dài mệt mỏi.',
      badge: 'Thư Giãn Spa'
    }
  },
  {
    slug: 'sua-duong-the',
    name: 'Sữa dưỡng thể (Body Lotion Niacinamide/B5)',
    parent: 'Chăm sóc cơ thể',
    keywords: ['sữa dưỡng thể', 'body lotion', 'sữa dưỡng thể (body lotion)', 'dưỡng trắng body', 'vaseline', 'vaseline healthy bright', 'cerave daily moisturizing', 'niacinamide body'],
    banner: {
      title: 'Sữa Dưỡng Thể Dưỡng Trắng & Cấp Ẩm Chuyên Sâu',
      desc: 'Hàm lượng Niacinamide tinh khiết kết hợp Hyaluronic Acid giúp nâng tông sáng mịn đều màu toàn thân chỉ sau 14 ngày.',
      badge: 'Trắng Sáng 14 Ngày'
    }
  },
  {
    slug: 'khu-mui',
    name: 'Lăn / Xịt khử mùi',
    parent: 'Chăm sóc cơ thể',
    keywords: ['lăn / xịt khử mùi', 'khử mùi', 'lăn khử mùi', 'xịt khử mùi', 'deodorant', 'lăn nách', 'ngăn mồ hôi', 'etiaxil', 'lăn nách vichy'],
    banner: {
      title: 'Lăn & Xịt Ngăn Tiết Mồ Hôi Kháng Khuẩn 48H',
      desc: 'Công nghệ vi nang lưu hương kháng khuẩn suốt 48 giờ, giữ vùng da dưới cánh tay luôn khô thoáng, sáng mịn không thâm sạm.',
      badge: 'Khô Thoáng 48H'
    }
  },
  {
    slug: 'kem-duong-tay-chan',
    name: 'Kem dưỡng chuyên biệt cho da tay & gót chân',
    parent: 'Chăm sóc cơ thể',
    keywords: ['kem dưỡng da tay / chân', 'kem dưỡng da tay', 'kem dưỡng chân', 'kem tay', 'hand cream', 'gót chân', 'nứt gót', 'dưỡng da tay', 'eulactol', 'l\'occitane'],
    banner: {
      title: 'Kem Dưỡng Da Tay Bơ Hạt Mỡ & Trị Nứt Gót Chân',
      desc: 'Phục hồi cấp tốc làn da tay chai sần nứt nẻ do hóa chất và thời tiết lạnh, nuôi dưỡng móng tay chắc khỏe bóng khỏe.',
      badge: 'Phục Hồi Cấp Tốc'
    }
  },
  {
    slug: 'triet-long',
    name: 'Kem triệt lông dịu nhẹ',
    parent: 'Chăm sóc cơ thể',
    keywords: ['triệt lông', 'tẩy lông', 'kem tẩy lông', 'veet', 'cléo', 'tẩy lông nách', 'tẩy lông chân'],
    banner: {
      title: 'Kem Tẩy Lông Dịu Nhẹ Không Đau Rát Chiết Xuất Lô Hội',
      desc: 'Làm mủn chân lông chỉ trong 5 phút, ức chế lông mọc lại thưa mảnh hơn mà không gây kích ứng hay châm chích.',
      badge: 'Êm Dịu 5 Phút'
    }
  },

  // 4. Hair Care (7 submenus)
  {
    slug: 'dau-goi',
    name: 'Dầu gội sạch gàu / ngừa rụng tóc',
    parent: 'Chăm sóc tóc & Da đầu',
    keywords: ['dầu gội', 'shampoo', 'trị gàu', 'ngừa rụng tóc', 'bưởi', 'dầu gội bưởi'],
    banner: {
      title: 'Dầu Gội Tinh Dầu Vỏ Bưởi & Biotin Ngừa Rụng Tóc',
      desc: 'Kích thích nang tóc phát triển chắc khỏe, làm sạch gàu và bã nhờn da đầu nhẹ nhàng mà không làm khô xơ sợi tóc.',
      badge: 'Giảm Rụng Tóc'
    }
  },
  {
    slug: 'dau-xa',
    name: 'Dầu xả suôn mượt phục hồi',
    parent: 'Chăm sóc tóc & Da đầu',
    keywords: ['dầu xả', 'conditioner', 'suôn mượt', 'xả tóc'],
    banner: {
      title: 'Dầu Xả Phục Hồi Keratin & Collagen Cho Tóc Xơ Rối',
      desc: 'Hàn gắn biểu bì tóc hư tổn do uốn nhuộm tẩy, mang lại mái tóc bồng bềnh óng ả và suôn mượt không xơ rối.',
      badge: 'Suôn Mượt Óng Ả'
    }
  },
  {
    slug: 'dau-goi-kho',
    name: 'Dầu gội khô tiện lợi',
    parent: 'Chăm sóc tóc & Da đầu',
    keywords: ['dầu gội khô', 'dry shampoo', 'batiste', 'hút dầu tóc'],
    banner: {
      title: 'Dầu Gội Khô Hút Dầu Bồng Bềnh Tóc Trong 30 Giây',
      desc: 'Bột gạo siêu mịn hút sạch dầu thừa bết dính tức thì, mang lại mái tóc sạch mát bồng bềnh tự tin mà không cần dùng nước.',
      badge: 'Bồng Bềnh 30s'
    }
  },
  {
    slug: 'kem-u-toc',
    name: 'Kem ủ tóc & Mặt nạ ủ nhiệt Keratin',
    parent: 'Chăm sóc tóc & Da đầu',
    keywords: ['kem ủ tóc', 'hair mask', 'ủ tóc', 'fino', 'tsubaki', 'phục hồi tóc'],
    banner: {
      title: 'Mặt Nạ Ủ Tóc Phục Hồi Chuyên Sâu Tsubaki & Fino Nhật Bản',
      desc: 'Công nghệ thẩm thấu CMC độc quyền đưa dưỡng chất sữa ong chúa và protein ngọc trai thấm sâu vào từng lõi tóc.',
      badge: 'Phục Hồi Lõi Tóc'
    }
  },
  {
    slug: 'tinh-dau-duong-toc',
    name: 'Tinh dầu dưỡng bóng tóc (Argan Oil)',
    parent: 'Chăm sóc tóc & Da đầu',
    keywords: ['tinh dầu dưỡng tóc', 'hair oil', 'argan oil', 'moroccanoil', 'dưỡng tóc'],
    banner: {
      title: 'Tinh Dầu Dưỡng Tóc Argan Ma-rốc Bảo Vệ Nhiệt',
      desc: 'Chống xơ rối và bảo vệ sợi tóc trước nhiệt độ máy sấy lên tới 230°C, cho mái tóc bóng mượt chuẩn salon.',
      badge: 'Chuẩn Salon'
    }
  },
  {
    slug: 'xit-moc-toc',
    name: 'Xịt bưởi kích thích mọc tóc con',
    parent: 'Chăm sóc tóc & Da đầu',
    keywords: ['xịt mọc tóc', 'xịt bưởi', 'hair tonic', 'mọc tóc con', 'kích thích mọc tóc'],
    banner: {
      title: 'Xịt Dưỡng Kích Mọc Tóc Con Tinh Dầu Bưởi Đậm Đặc',
      desc: 'Cung cấp vitamin B5 và tinh chất vỏ bưởi nguyên chất trực tiếp nuôi nang tóc, giảm gãy rụng rõ rệt sau 21 ngày.',
      badge: 'Mọc Tóc 21 Ngày'
    }
  },
  {
    slug: 'thuoc-nhuom-toc',
    name: 'Thuốc nhuộm & Bọt phủ bạc tóc thảo dược',
    parent: 'Chăm sóc tóc & Da đầu',
    keywords: ['thuốc nhuộm', 'nhuộm tóc', 'bọt nhuộm', 'phủ bạc', 'hair color'],
    banner: {
      title: 'Bọt Nhuộm Tóc Thời Trang & Phủ Bạc Thảo Dược An Toàn',
      desc: 'Màu sắc thời thượng chuẩn salon tại nhà, không chứa amoniac độc hại, bảo vệ da đầu nhạy cảm.',
      badge: 'Không Amoniac'
    }
  },

  // 5. Fragrance (6 submenus)
  {
    slug: 'nuoc-hoa-nu',
    name: 'Nước hoa Nữ (Hương hoa cỏ, ngọt ngào)',
    parent: 'Nước hoa',
    keywords: ['nước hoa nữ', 'perfume nữ', 'floral', 'chanel', 'dior', 'gucci', 'hoa cỏ'],
    banner: {
      title: 'Bộ Sưu Tập Nước Hoa Nữ Quyến Rũ & Thanh Lịch',
      desc: 'Nốt hương hoa hồng Centifolia, nhài Sambac và vani ngọt ngào khẳng định khí chất kiêu kỳ của phái đẹp.',
      badge: 'Hương Thơm Nữ Tính'
    }
  },
  {
    slug: 'nuoc-hoa-nam',
    name: 'Nước hoa Nam (Hương gỗ, trầm ấm, nam tính)',
    parent: 'Nước hoa',
    keywords: ['nước hoa nam', 'cologne', 'woody', 'bleu', 'sauvage', 'hương gỗ'],
    banner: {
      title: 'Nước Hoa Nam Lịch Lãm & Cuốn Hút Nốt Hương Gỗ Trầm',
      desc: 'Sự hòa quyện giữa cam Bergamot thanh khiết và gỗ tuyết tùng, hổ phách ấm áp tạo dấu ấn bản lĩnh phái mạnh.',
      badge: 'Nam Tính Lịch Lãm'
    }
  },
  {
    slug: 'nuoc-hoa-unisex',
    name: 'Nước hoa Unisex (Thanh mát, cá tính)',
    parent: 'Nước hoa',
    keywords: ['nước hoa unisex', 'niche perfume', 'le labo', 'santal 33', 'cá tính'],
    banner: {
      title: 'Nước Hoa Niche Đẳng Cấp Phi Giới Tính (Unisex)',
      desc: 'Mùi hương độc bản tôn vinh sự tự do, phá cách với các nốt hương trà đen, bạch đậu khấu và da thuộc sang trọng.',
      badge: 'Mùi Hương Độc Bản'
    }
  },
  {
    slug: 'body-mist',
    name: 'Xịt thơm toàn thân & tóc (Body Mist)',
    parent: 'Nước hoa',
    keywords: ['body mist', 'xịt thơm', 'bath and body works', 'victoria secret'],
    banner: {
      title: 'Xịt Thơm Toàn Thân & Tóc Body Mist Lưu Hương 6H',
      desc: 'Hương thơm ngọt ngào tươi mát kết hợp chiết xuất nha đam dưỡng ẩm nhẹ dịu cho cơ thể suốt ngày dài hoạt động.',
      badge: 'Lưu Hương 6H'
    }
  },
  {
    slug: 'nuoc-hoa-chiet',
    name: 'Nước hoa chiết mini 10ml bỏ túi',
    parent: 'Nước hoa',
    keywords: ['nước hoa chiết', 'mini 10ml', 'chiết chính hãng', 'travel size'],
    banner: {
      title: 'Nước Hoa Chiết Chính Hãng 10ml Tiện Lợi Tiết Kiệm',
      desc: 'Thử nghiệm các mùi hương đắt giá hàng đầu thế giới với chi phí hợp lý, vòi xịt phun sương mịn dễ dàng mang theo.',
      badge: 'Tiện Lợi 10ml'
    }
  },
  {
    slug: 'tinh-dau-vung-kin',
    name: 'Tinh dầu nước hoa vùng kín',
    parent: 'Nước hoa',
    keywords: ['tinh dầu vùng kín', 'foellie', 'dionel', 'nước hoa vùng kín'],
    banner: {
      title: 'Tinh Dầu Thơm Kháng Khuẩn Dịu Nhẹ Cân Bằng pH',
      desc: 'Chiết xuất dầu hạt hướng dương và tinh dầu hoa cúc la mã khử mùi tự nhiên, mang lại cảm giác thoải mái tự tin tuyệt đối.',
      badge: 'Cân Bằng Dịu Nhẹ'
    }
  },

  // 6. Supplements (6 submenus)
  {
    slug: 'collagen',
    name: 'Nước uống / Viên uống Collagen thủy phân',
    parent: 'Thực phẩm chức năng',
    keywords: ['collagen', 'collagen thủy phân', 'nước uống collagen', 'dhc collagen', 'trẻ hóa'],
    banner: {
      title: 'Collagen Peptide Thủy Phân Đậm Đặc Trẻ Hóa Tế Bào',
      desc: 'Kích thước phân tử siêu nhỏ thẩm thấu trực tiếp vào tầng trung bì, phục hồi độ săn chắc và mờ nếp nhăn nhanh chóng.',
      badge: 'Hấp Thu Tức Thì'
    }
  },
  {
    slug: 'vien-trang-da',
    name: 'Viên uống trắng da (Glutathione & Vitamin C)',
    parent: 'Thực phẩm chức năng',
    keywords: ['trắng da', 'glutathione', 'transino', 'vitamin c uống', 'viên uống sáng da'],
    banner: {
      title: 'Viên Uống Trắng Da Mờ Nám Chuyên Sâu Transino & Glutathione',
      desc: 'Ức chế hắc sắc tố Melanin từ bên trong gốc tế bào, làm mờ nám mảng, tàn nhang và dưỡng sáng toàn thân bền vững.',
      badge: 'Trắng Sáng Toàn Thân'
    }
  },
  {
    slug: 'vien-tri-mun',
    name: 'Viên uống cân bằng nội tiết & Giảm mụn',
    parent: 'Thực phẩm chức năng',
    keywords: ['viên trị mụn', 'nội tiết', 'tinh dầu hoa anh thảo', 'kẽm trị mụn', 'viên uống kẽm giảm nhờn', 'viên kẽm', 'kẽm giảm nhờn', 'evening primrose'],
    banner: {
      title: 'Viên Uống Cân Bằng Nội Tiết Tinh Dầu Hoa Anh Thảo & Kẽm Zinc',
      desc: 'Bổ sung acid béo GLA tự nhiên và Kẽm vi lượng điều hòa hormone, làm giảm mụn viêm nội tiết và cải thiện độ đàn hồi làn da.',
      badge: 'Cân Bằng Nội Tiết'
    }
  },
  {
    slug: 'vitamin-tong-hop',
    name: 'Vitamin tổng hợp (Multivitamin E, C, Kẽm)',
    parent: 'Thực phẩm chức năng',
    keywords: ['vitamin tổng hợp', 'multivitamin', 'vitamin e', 'kẽm', 'tăng đề kháng'],
    banner: {
      title: 'Vitamin & Khoáng Chất Vi Lượng Tăng Sức Đề Kháng Da',
      desc: 'Tổ hợp 12 loại vitamin thiết yếu giúp chống oxy hóa, kích thích phục hồi tế bào và duy trì cơ thể khỏe đẹp từ bên trong.',
      badge: 'Khỏe Đẹp Toàn Diện'
    }
  },
  {
    slug: 'vien-cap-nuoc',
    name: 'Viên uống cấp nước cấp ẩm Hyaluronic Acid',
    parent: 'Thực phẩm chức năng',
    keywords: ['viên cấp nước', 'hyaluronic acid uống', 'cấp nước nội sinh', 'aqua'],
    banner: {
      title: 'Viên Uống Cấp Nước Đa Tầng Cho Da Căng Mọng',
      desc: 'Ngậm nước gấp 1000 lần trọng lượng tế bào, đẩy lùi tình trạng khô căng ráp nẻ do ngồi điều hòa và thời tiết hanh khô.',
      badge: 'Căng Mọng Ngậm Nước'
    }
  },
  {
    slug: 'vien-chong-nang',
    name: 'Viên uống chống nắng nội sinh',
    parent: 'Thực phẩm chức năng',
    keywords: ['viên chống nắng', 'chống nắng nội sinh', 'heliocare', 'dương xỉ'],
    banner: {
      title: 'Viên Uống Chống Nắng Chiết Xuất Dương Xỉ Heliocare',
      desc: 'Công nghệ Fernblock® vô hiệu hóa các gốc tự do do tia UV sinh ra, bảo vệ da toàn diện từ sâu bên trong cơ thể.',
      badge: 'Bảo Vệ Nội Sinh'
    }
  },

  // 7. Beauty Tools (7 submenus)
  {
    slug: 'bong-tay-trang',
    name: 'Bông tẩy trang 100% cotton hữu cơ',
    parent: 'Phụ kiện làm đẹp',
    keywords: ['bông tẩy trang', 'cotton', 'silcot', 'bông cotton hữu cơ'],
    banner: {
      title: 'Bông Tẩy Trang 100% Sợi Bông Tự Nhiên Không Rụng Xơ',
      desc: 'Bề mặt dập viền êm mềm như mây, tiết kiệm dung dịch toner dưỡng ẩm và không gây xước rát làn da mỏng manh.',
      badge: 'Cotton Hữu Cơ'
    }
  },
  {
    slug: 'bo-co-trang-diem',
    name: 'Bộ cọ trang điểm chuyên nghiệp',
    parent: 'Phụ kiện làm đẹp',
    keywords: ['bộ cọ', 'cọ trang điểm', 'makeup brush', 'cọ phấn', 'cọ mắt'],
    banner: {
      title: 'Bộ Cọ Trang Điểm Lông Nhân Tạo Kháng Khuẩn Cao Cấp',
      desc: 'Sợi lông mềm mại bắt phấn tối ưu, đầy đủ cọ nền, cọ phấn phủ, cọ mắt và má hồng cho lớp trang điểm hoàn mỹ.',
      badge: 'Chuẩn Makeup Artist'
    }
  },
  {
    slug: 'mut-tan-nen',
    name: 'Mút tán nền hồ lô / vát xéo',
    parent: 'Phụ kiện làm đẹp',
    keywords: ['mút tán nền', 'beauty blender', 'mút trang điểm', 'bông mút'],
    banner: {
      title: 'Mút Tán Nền Bọt Biển Siêu Mềm Tiệp Lớp Nền Hoàn Hảo',
      desc: 'Độ đàn hồi cao nở gấp đôi khi ngậm nước, mang lại lớp nền mỏng nhẹ tự nhiên không để lại vệt cọ hay mốc nền.',
      badge: 'Tiệp Nền Mỏng Nhẹ'
    }
  },
  {
    slug: 'kep-bam-mi',
    name: 'Kẹp bấm mi cong tự nhiên',
    parent: 'Phụ kiện làm đẹp',
    keywords: ['bấm mi', 'kẹp mi', 'eyelash curler', 'cong mi', 'shiseido'],
    banner: {
      title: 'Kẹp Bấm Mi Thiết Kế Chuẩn Cung Mắt Phụ Nữ Châu Á',
      desc: 'Đệm silicon êm ái uốn cong mi từ gốc đến ngọn chỉ với một lần bấm nhẹ nhàng mà không gây gãy rụng mi.',
      badge: 'Cong Mi Tự Nhiên'
    }
  },
  {
    slug: 'may-rua-mat',
    name: 'Máy rửa mặt sóng âm T-Sonic',
    parent: 'Phụ kiện làm đẹp',
    keywords: ['máy rửa mặt', 't-sonic', 'foreo', 'làm sạch sâu', 'silicon y tế'],
    banner: {
      title: 'Máy Rửa Mặt Sóng Âm T-Sonic Rung 8000 Lần/Phút',
      desc: 'Đầu cọ silicon kháng khuẩn chuẩn y tế cuốn sạch 99.5% bụi bẩn dầu thừa, ngăn ngừa mụn ẩn và kích thích tuần hoàn máu.',
      badge: 'Sóng Âm T-Sonic'
    }
  },
  {
    slug: 'may-massage-ems',
    name: 'Máy đẩy tinh chất & Massage nâng cơ mặt EMS',
    parent: 'Phụ kiện làm đẹp',
    keywords: ['máy nâng cơ', 'máy massage nâng cơ', 'máy massage', 'massage nâng cơ', 'ems', 'đẩy tinh chất', 'massage mặt', 'điện di ion'],
    banner: {
      title: 'Máy Đẩy Tinh Chất Ion Nóng Lạnh & Nâng Cơ Vi Dòng EMS',
      desc: 'Tăng cường hấp thụ serum gấp 5 lần so với thoa tay, kích thích sản sinh collagen và thon gọn đường nét khuôn mặt.',
      badge: 'Công Nghệ Vi Dòng'
    }
  },
  {
    slug: 'dao-cao-may',
    name: 'Dụng cụ tỉa chân mày an toàn',
    parent: 'Phụ kiện làm đẹp',
    keywords: ['dao cạo mày', 'tỉa mày', 'nhíp', 'tỉa chân mày'],
    banner: {
      title: 'Dao Tỉa Chân Mày Thép Không Gỉ Lưới An Toàn',
      desc: 'Lưỡi dao sắc bén có rãnh bảo vệ chống trầy xước da, giúp định hình cung mày thanh tú chuẩn xác tại nhà.',
      badge: 'Lưới Bảo Vệ An Toàn'
    }
  }
];

// =========================================================================
// CURATED NICHE FALLBACK CATALOG
// Bổ sung dữ liệu sản phẩm cao cấp có sẵn số CBMP cho các sub-menu ngách
// Đảm bảo không có bất kỳ sub-menu nào bị kết quả rỗng []
// =========================================================================
export const CURATED_NICHE_PRODUCTS = [
  {
  "id": "PROD-CRW-KGN-01",
  "name": "Viên Uống Kẽm Giảm Nhờn Kiềm Dầu & Ngừa Mụn DHC Zinc Gluconate 60 Ngày 60 Viên",
  "brand": "DHC",
  "category": "Thực phẩm chức năng",
  "subCategory": "Viên uống kẽm giảm nhờn",
  "rating": 4.9,
  "soldCount": 88400,
  "reviewCount": 20100,
  "price": 110000,
  "originalPrice": 145000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Kẽm Men Tự Nhiên",
    "Kiềm Dầu Hiệu Quả"
  ],
  "images": [
    "/products/PROD-CRW-KGN-01.jpg"
  ],
  "targetSkinTypes": [
    "OILY",
    "ACNE_PRONE"
  ],
  "skinConcerns": [
    "SEBUM",
    "ACNE"
  ],
  "formulationTexture": "STICK",
  "originCountry": "JAPAN",
  "variants": [
    {
      "sku": "DHC-ZINC-KGN-60D",
      "title": "Gói 60 viên uống 60 ngày",
      "price": 110000,
      "onHand": 1500
    }
  ],
  "inciIngredients": [
    {
      "name": "Kẽm 15mg, Crom 60mcg, Selen 50mcg",
      "function": "Giảm bài tiết bã nhờn, kháng viêm mụn cám mụn đầu đen"
    }
  ]
},
  {
  "id": "PROD-CRW-KGN-02",
  "name": "Viên Uống Kẽm Tự Nhiên Hỗ Trợ Giảm Tiết Bã Nhờn Swisse Ultiboost Zinc+ 60 Viên Úc",
  "brand": "Swisse",
  "category": "Thực phẩm chức năng",
  "subCategory": "Viên uống kẽm giảm nhờn",
  "rating": 4.8,
  "soldCount": 23400,
  "reviewCount": 5100,
  "price": 240000,
  "originalPrice": 310000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Kẽm Kèm Vitamin B6",
    "Da Sạch Nhờn"
  ],
  "images": [
    "/products/PROD-CRW-KGN-02.jpg"
  ],
  "targetSkinTypes": [
    "OILY",
    "COMBINATION"
  ],
  "skinConcerns": [
    "SEBUM"
  ],
  "formulationTexture": "STICK",
  "originCountry": "AUSTRALIA",
  "variants": [
    {
      "sku": "SWISSE-ZINC-60V",
      "title": "Lọ 60 viên nén Swisse Úc",
      "price": 240000,
      "onHand": 430
    }
  ],
  "inciIngredients": [
    {
      "name": "Zinc Amino Acid Chelate 25mg, Vitamin A & Vitamin B6",
      "function": "Kiểm soát dầu nhờn vùng chữ T"
    }
  ]
},
  {
  "id": "PROD-CRW-KGN-03",
  "name": "Viên Uống Kẽm Sinh Học Kháng Viêm Blackmores Bio Zinc 84 Viên Úc",
  "brand": "Blackmores",
  "category": "Thực phẩm chức năng",
  "subCategory": "Viên uống kẽm giảm nhờn",
  "rating": 4.9,
  "soldCount": 31500,
  "reviewCount": 6800,
  "price": 290000,
  "originalPrice": 360000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Kẽm Sinh Học Hấp Thu Cao",
    "Ngừa Thâm Sau Mụn"
  ],
  "images": [
    "/products/PROD-CRW-KGN-03.jpg"
  ],
  "targetSkinTypes": [
    "OILY",
    "ACNE_PRONE"
  ],
  "skinConcerns": [
    "SEBUM",
    "ACNE"
  ],
  "formulationTexture": "STICK",
  "originCountry": "AUSTRALIA",
  "variants": [
    {
      "sku": "BLACKMORES-BIOZINC-84V",
      "title": "Lọ thủy tinh 84 viên",
      "price": 290000,
      "onHand": 510
    }
  ],
  "inciIngredients": [
    {
      "name": "Kẽm sinh học & Magie, Mangan",
      "function": "Lành vết thương do mụn, điều hòa tuyến bã nhờn"
    }
  ]
},
  {
  "id": "PROD-CRW-KGN-04",
  "name": "Viên Uống Bổ Sung Kẽm Giảm Dầu Mụn Puritan's Pride Zinc 50mg 100 Viên Mỹ",
  "brand": "Puritan's Pride",
  "category": "Thực phẩm chức năng",
  "subCategory": "Viên uống kẽm giảm nhờn",
  "rating": 4.8,
  "soldCount": 26800,
  "reviewCount": 5600,
  "price": 195000,
  "originalPrice": 260000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Hàm Lượng Cao 50mg",
    "Tiêu Chuẩn FDA Mỹ"
  ],
  "images": [
    "/products/PROD-CRW-KGN-04.jpg"
  ],
  "targetSkinTypes": [
    "OILY",
    "ACNE_PRONE"
  ],
  "formulationTexture": "STICK",
  "originCountry": "USA",
  "variants": [
    {
      "sku": "PURITAN-ZINC-100V",
      "title": "Lọ 100 viên nén",
      "price": 195000,
      "onHand": 620
    }
  ],
  "inciIngredients": [
    {
      "name": "Zinc Gluconate 50mg",
      "function": "Giảm bóng nhờn và se nhỏ lỗ chân lông"
    }
  ]
},
  {
  "id": "PROD-CRW-KGN-05",
  "name": "Viên Uống Hỗ Trợ Ngừa Mụn Giảm Nhờn Acnes Clear Skin Zinc 30 Viên",
  "brand": "Acnes",
  "category": "Thực phẩm chức năng",
  "subCategory": "Viên uống kẽm giảm nhờn",
  "rating": 4.8,
  "soldCount": 35200,
  "reviewCount": 7900,
  "price": 85000,
  "originalPrice": 110000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Chuyên Biệt Da Mụn Nhờn",
    "Giá Học Sinh Sinh Viên"
  ],
  "images": [
    "/products/PROD-CRW-KGN-05.jpg"
  ],
  "targetSkinTypes": [
    "OILY",
    "ACNE_PRONE"
  ],
  "formulationTexture": "STICK",
  "originCountry": "VIETNAM",
  "variants": [
    {
      "sku": "ACNES-ZINC-30V",
      "title": "Hộp 3 vỉ x 10 viên",
      "price": 85000,
      "onHand": 950
    }
  ],
  "inciIngredients": [
    {
      "name": "Kẽm sinh học & Chiết xuất nghệ Curcumin",
      "function": "Kháng viêm kiềm nhờn mờ thâm mụn"
    }
  ]
},

  {
  "id": "PROD-CRW-KPM-01",
  "name": "Kẹp Bấm Mi Shiseido Eyelash Curler 213 Nhật Bản Chuẩn Cong Tự Nhiên",
  "brand": "Shiseido",
  "category": "Phụ kiện làm đẹp",
  "subCategory": "Kẹp bấm mi",
  "rating": 4.9,
  "soldCount": 42100,
  "reviewCount": 8900,
  "price": 165000,
  "originalPrice": 220000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Bán Chạy Nhất",
    "Chính Hãng Nhật"
  ],
  "images": [
    "/products/PROD-CRW-KPM-01.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "skinConcerns": [],
  "keyActiveGroups": [],
  "safetyEthicsBadges": [
    "HYPOALLERGENIC"
  ],
  "formulationTexture": "STICK",
  "originCountry": "JAPAN",
  "variants": [
    {
      "sku": "SHISEIDO-213-MAIN",
      "title": "Kẹp mi + 1 Đệm silicone thay thế",
      "price": 165000,
      "onHand": 450
    }
  ],
  "inciIngredients": [
    {
      "name": "Thép carbon không gỉ & Đệm cao su silicon y tế",
      "function": "Bấm mi cong vút không gãy rụng"
    }
  ]
},
  {
  "id": "PROD-CRW-KPM-02",
  "name": "Kẹp Bấm Mi Shu Uemura Eyelash Curler Đệm Silicone Cong Vút 24H",
  "brand": "Shu Uemura",
  "category": "Phụ kiện làm đẹp",
  "subCategory": "Kẹp bấm mi",
  "rating": 4.9,
  "soldCount": 18500,
  "reviewCount": 4200,
  "price": 395000,
  "originalPrice": 480000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Cao Cấp",
    "Top 1 Nhật Bản"
  ],
  "images": [
    "/products/PROD-CRW-KPM-02.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "skinConcerns": [],
  "keyActiveGroups": [],
  "safetyEthicsBadges": [
    "HYPOALLERGENIC"
  ],
  "formulationTexture": "STICK",
  "originCountry": "JAPAN",
  "variants": [
    {
      "sku": "SHU-CURLER-CLASSIC",
      "title": "Bản Cổ Điển Mạ Bạc Kèm Đệm",
      "price": 395000,
      "onHand": 280
    }
  ],
  "inciIngredients": [
    {
      "name": "Thép không gỉ cao cấp mạ chrome",
      "function": "Vòm cong chuẩn mắt châu Á"
    }
  ]
},
  {
  "id": "PROD-CRW-KPM-03",
  "name": "Kẹp Bấm Mi Cán Đen Chuyên Nghiệp Vacosi Classic Curler Pro BM01",
  "brand": "Vacosi",
  "category": "Phụ kiện làm đẹp",
  "subCategory": "Kẹp bấm mi",
  "rating": 4.8,
  "soldCount": 36200,
  "reviewCount": 7100,
  "price": 65000,
  "originalPrice": 85000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Giá Tốt",
    "Êm Mi Tuyệt Đối"
  ],
  "images": [
    "/products/PROD-CRW-KPM-03.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "skinConcerns": [],
  "keyActiveGroups": [],
  "safetyEthicsBadges": [
    "HYPOALLERGENIC"
  ],
  "formulationTexture": "STICK",
  "originCountry": "KOREA",
  "variants": [
    {
      "sku": "VACOSI-BM01",
      "title": "Cán Đen Chuẩn Salon Hàn Quốc",
      "price": 65000,
      "onHand": 800
    }
  ],
  "inciIngredients": [
    {
      "name": "Thép hợp kim phủ sơn tĩnh điện",
      "function": "Khung bấm chắc chắn nhẹ tay"
    }
  ]
},
  {
  "id": "PROD-CRW-KPM-04",
  "name": "Kẹp Bấm Mi Góc Rộng Ôm Trọn Mắt DHC Eyelash Curler Nhật Bản",
  "brand": "DHC",
  "category": "Phụ kiện làm đẹp",
  "subCategory": "Kẹp bấm mi",
  "rating": 4.8,
  "soldCount": 12400,
  "reviewCount": 2300,
  "price": 175000,
  "originalPrice": 210000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Góc Siêu Rộng",
    "Không Kẹp Mí"
  ],
  "images": [
    "/products/PROD-CRW-KPM-04.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "skinConcerns": [],
  "keyActiveGroups": [],
  "safetyEthicsBadges": [
    "HYPOALLERGENIC"
  ],
  "formulationTexture": "STICK",
  "originCountry": "JAPAN",
  "variants": [
    {
      "sku": "DHC-CURLER-WIDE",
      "title": "Bản Vòm Mắt Châu Á Tiêu Chuẩn",
      "price": 175000,
      "onHand": 350
    }
  ],
  "inciIngredients": [
    {
      "name": "Thép mạ niken & Đệm cao su mềm",
      "function": "Ôm trọn sợi mi từ gốc đến ngọn"
    }
  ]
},
  {
  "id": "PROD-CRW-KPM-05",
  "name": "Kẹp Bấm Mi Mini Gập Gọn Du Lịch Kai Compact Curler Japan",
  "brand": "Kai",
  "category": "Phụ kiện làm đẹp",
  "subCategory": "Kẹp bấm mi",
  "rating": 4.9,
  "soldCount": 28900,
  "reviewCount": 5600,
  "price": 79000,
  "originalPrice": 105000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Nhỏ Gọn Bỏ Túi",
    "Chính Hãng Kai"
  ],
  "images": [
    "/products/PROD-CRW-KPM-05.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "skinConcerns": [],
  "keyActiveGroups": [],
  "safetyEthicsBadges": [
    "HYPOALLERGENIC"
  ],
  "formulationTexture": "STICK",
  "originCountry": "JAPAN",
  "variants": [
    {
      "sku": "KAI-COMPACT-PINK",
      "title": "Màu Hồng Pastel Kèm Đệm Sơ Cua",
      "price": 79000,
      "onHand": 620
    }
  ],
  "inciIngredients": [
    {
      "name": "Nhựa Polycarbonate & Kháng khuẩn",
      "function": "Gập phẳng tiện lợi du lịch"
    }
  ]
},
  {
  "id": "PROD-CRW-MTN-01",
  "name": "Bông Mút Tán Nền Hồ Lô Real Techniques Miracle Complexion Sponge Cam Đào",
  "brand": "Real Techniques",
  "category": "Phụ kiện làm đẹp",
  "subCategory": "Mút tán nền",
  "rating": 4.9,
  "soldCount": 58200,
  "reviewCount": 12400,
  "price": 145000,
  "originalPrice": 185000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Top 1 Bán Chạy",
    "Nền Căng Bóng"
  ],
  "images": [
    "/products/PROD-CRW-MTN-01.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "skinConcerns": [],
  "keyActiveGroups": [
    "HYDRATION"
  ],
  "safetyEthicsBadges": [
    "LATEX_FREE",
    "VEGAN"
  ],
  "formulationTexture": "POWDER",
  "originCountry": "USA",
  "variants": [
    {
      "sku": "RT-SPONGE-ORANGE",
      "title": "Mút Đơn Cam Classic Vát Phẳng",
      "price": 145000,
      "onHand": 950
    }
  ],
  "inciIngredients": [
    {
      "name": "100% Polyurethane Foam không mủ cao su",
      "function": "Kháng khuẩn, tán kem nền mỏng mịn không vệt"
    }
  ]
},
  {
  "id": "PROD-CRW-MTN-02",
  "name": "Mút Trang Điểm Giọt Nước Không Mủ Cao Su Beautyblender The Original Pink",
  "brand": "Beautyblender",
  "category": "Phụ kiện làm đẹp",
  "subCategory": "Mút tán nền",
  "rating": 4.9,
  "soldCount": 16700,
  "reviewCount": 3800,
  "price": 420000,
  "originalPrice": 490000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Huyền Thoại Nền Lì",
    "Không Hút Kem"
  ],
  "images": [
    "/products/PROD-CRW-MTN-02.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "skinConcerns": [],
  "keyActiveGroups": [],
  "safetyEthicsBadges": [
    "LATEX_FREE",
    "CRUELTY_FREE"
  ],
  "formulationTexture": "POWDER",
  "originCountry": "USA",
  "variants": [
    {
      "sku": "BB-ORIGINAL-PINK",
      "title": "Màu Hồng Nguyên Bản Quả Trứng",
      "price": 420000,
      "onHand": 210
    }
  ],
  "inciIngredients": [
    {
      "name": "Hydrophilic Polyurethane Foam",
      "function": "Nở gấp đôi khi ngậm nước tạo hiệu ứng filter"
    }
  ]
},
  {
  "id": "PROD-CRW-MTN-03",
  "name": "Bông Mút Nở Tán Nền Vát Xéo Kháng Khuẩn Focallure Hydrophilic Beauty Egg",
  "brand": "Focallure",
  "category": "Phụ kiện làm đẹp",
  "subCategory": "Mút tán nền",
  "rating": 4.8,
  "soldCount": 45600,
  "reviewCount": 9200,
  "price": 42000,
  "originalPrice": 65000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Siêu Mềm Mịn",
    "Giá Siêu Tốt"
  ],
  "images": [
    "/products/PROD-CRW-MTN-03.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "skinConcerns": [],
  "keyActiveGroups": [],
  "safetyEthicsBadges": [
    "LATEX_FREE"
  ],
  "formulationTexture": "POWDER",
  "originCountry": "CHINA",
  "variants": [
    {
      "sku": "FOCALLURE-EGG-MATCHA",
      "title": "Màu Xanh Matcha Mềm Mịn",
      "price": 42000,
      "onHand": 1200
    }
  ],
  "inciIngredients": [
    {
      "name": "Bọt xốp vi mô không mùi",
      "function": "Tán phấn nước và kem nền kiềm dầu"
    }
  ]
},
  {
  "id": "PROD-CRW-MTN-04",
  "name": "Bông Mút Giọt Nước Vát Xéo Đa Năng Vacosi Pro Blender Pear Shape BP21",
  "brand": "Vacosi",
  "category": "Phụ kiện làm đẹp",
  "subCategory": "Mút tán nền",
  "rating": 4.8,
  "soldCount": 31400,
  "reviewCount": 6100,
  "price": 68000,
  "originalPrice": 89000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Vát Phẳng 2 Đầu",
    "Độ Đàn Hồi Cao"
  ],
  "images": [
    "/products/PROD-CRW-MTN-04.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "skinConcerns": [],
  "keyActiveGroups": [],
  "safetyEthicsBadges": [
    "LATEX_FREE"
  ],
  "formulationTexture": "POWDER",
  "originCountry": "KOREA",
  "variants": [
    {
      "sku": "VACOSI-BP21-PURPLE",
      "title": "Tím Lavender Hồ Lô Vát",
      "price": 68000,
      "onHand": 740
    }
  ],
  "inciIngredients": [
    {
      "name": "Polymer xốp cấu trúc hạt siêu mịn",
      "function": "Che phủ khuyết điểm và rãnh cười"
    }
  ]
},
  {
  "id": "PROD-CRW-MTN-05",
  "name": "Set 3 Bông Mút Tán Nền Vát Xéo Bealy Teardrop Makeup Sponge Box",
  "brand": "Bealy",
  "category": "Phụ kiện làm đẹp",
  "subCategory": "Mút tán nền",
  "rating": 4.9,
  "soldCount": 22800,
  "reviewCount": 4600,
  "price": 95000,
  "originalPrice": 130000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Hộp 3 Mút Tiện Lợi",
    "Mềm Như Mây"
  ],
  "images": [
    "/products/PROD-CRW-MTN-05.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "skinConcerns": [],
  "keyActiveGroups": [],
  "safetyEthicsBadges": [
    "LATEX_FREE"
  ],
  "formulationTexture": "POWDER",
  "originCountry": "VIETNAM",
  "variants": [
    {
      "sku": "BEALY-SET3-BOX",
      "title": "Set 3 Quả Kèm Hộp Nhựa Bảo Quản",
      "price": 95000,
      "onHand": 510
    }
  ],
  "inciIngredients": [
    {
      "name": "Bọt biển thế hệ mới siêu ngậm nước",
      "function": "Tán nền mướt mịn không mốc cakey"
    }
  ]
},
  {
  "id": "PROD-CRW-DCM-01",
  "name": "Set 3 Dao Cạo Lông Mày Lưỡi Thép Thụy Điển Chống Trầy Kai Beauty Care Japan",
  "brand": "Kai",
  "category": "Phụ kiện làm đẹp",
  "subCategory": "Nhíp / Dao cạo mày",
  "rating": 4.9,
  "soldCount": 65400,
  "reviewCount": 14100,
  "price": 52000,
  "originalPrice": 70000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Lưỡi Thép Siêu Bén",
    "An Toàn Chống Xước"
  ],
  "images": [
    "/products/PROD-CRW-DCM-01.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "formulationTexture": "STICK",
  "originCountry": "JAPAN",
  "variants": [
    {
      "sku": "KAI-SET3-RAZOR",
      "title": "Vỉ 3 cây màu pastel kèm nắp đậy",
      "price": 52000,
      "onHand": 1400
    }
  ],
  "inciIngredients": [
    {
      "name": "Thép không gỉ Thụy Điển & Nhựa ABS",
      "function": "Cạo sạch lông mày êm dịu không xước da"
    }
  ]
},
  {
  "id": "PROD-CRW-DCM-02",
  "name": "Nhíp Bấm Lông Mày Thép Không Gỉ Kềm Nghĩa N-402 Đầu Xéo Chuẩn Salon",
  "brand": "Kềm Nghĩa",
  "category": "Phụ kiện làm đẹp",
  "subCategory": "Nhíp / Dao cạo mày",
  "rating": 4.9,
  "soldCount": 48900,
  "reviewCount": 9800,
  "price": 48000,
  "originalPrice": 60000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Thương Hiệu Quốc Dân",
    "Khít Chặt Tận Gốc"
  ],
  "images": [
    "/products/PROD-CRW-DCM-02.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "formulationTexture": "STICK",
  "originCountry": "VIETNAM",
  "variants": [
    {
      "sku": "KEMNGHIA-N402",
      "title": "Thép không gỉ mạ niken đầu xéo",
      "price": 48000,
      "onHand": 950
    }
  ],
  "inciIngredients": [
    {
      "name": "Thép không gỉ Inox cao cấp",
      "function": "Gắp chuẩn xác từng sợi lông mày nhỏ nhất"
    }
  ]
},
  {
  "id": "PROD-CRW-DCM-03",
  "name": "Dao Cạo Chân Mày Gấp Gọn Tiện Lợi Innisfree Eyebrow Razor Hàn Quốc",
  "brand": "Innisfree",
  "category": "Phụ kiện làm đẹp",
  "subCategory": "Nhíp / Dao cạo mày",
  "rating": 4.8,
  "soldCount": 26300,
  "reviewCount": 5200,
  "price": 45000,
  "originalPrice": 60000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Gập Gọn Vệ Sinh",
    "Chính Hãng Hàn"
  ],
  "images": [
    "/products/PROD-CRW-DCM-03.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "formulationTexture": "STICK",
  "originCountry": "KOREA",
  "variants": [
    {
      "sku": "INNI-RAZOR-FOLD",
      "title": "Cây gấp gọn màu trắng an toàn",
      "price": 45000,
      "onHand": 620
    }
  ],
  "inciIngredients": [
    {
      "name": "Lưỡi dao thép vi lưới an toàn",
      "function": "Tạo dáng chân mày sắc nét"
    }
  ]
},
  {
  "id": "PROD-CRW-DCM-04",
  "name": "Hộp 3 Dao Cạo Lông Mặt & Chân Mày Feather Piany Japan Lưỡi Bọc Bạch Kim",
  "brand": "Feather",
  "category": "Phụ kiện làm đẹp",
  "subCategory": "Nhíp / Dao cạo mày",
  "rating": 4.9,
  "soldCount": 39100,
  "reviewCount": 7800,
  "price": 68000,
  "originalPrice": 85000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Lưỡi Bạch Kim",
    "Êm Ái Dịu Nhẹ"
  ],
  "images": [
    "/products/PROD-CRW-DCM-04.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "formulationTexture": "STICK",
  "originCountry": "JAPAN",
  "variants": [
    {
      "sku": "FEATHER-PIANY-3P",
      "title": "Hộp 3 cây 3 màu lưỡi mạ platinum",
      "price": 68000,
      "onHand": 780
    }
  ],
  "inciIngredients": [
    {
      "name": "Platinum Coated Stainless Steel",
      "function": "Lướt êm trên bề mặt da mặt và chân mày"
    }
  ]
},
  {
  "id": "PROD-CRW-DCM-05",
  "name": "Nhíp Gắp Lông Mày Đầu Nhọn Thẳng Cao Cấp Vacosi Point Tweezer T01",
  "brand": "Vacosi",
  "category": "Phụ kiện làm đẹp",
  "subCategory": "Nhíp / Dao cạo mày",
  "rating": 4.8,
  "soldCount": 19400,
  "reviewCount": 3600,
  "price": 40000,
  "originalPrice": 55000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Đầu Nhọn Chuẩn Xác",
    "Thép Không Gỉ"
  ],
  "images": [
    "/products/PROD-CRW-DCM-05.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "formulationTexture": "STICK",
  "originCountry": "KOREA",
  "variants": [
    {
      "sku": "VACOSI-T01-SILVER",
      "title": "Bản Bạc Trơn Đầu Nhọn T01",
      "price": 40000,
      "onHand": 550
    }
  ],
  "inciIngredients": [
    {
      "name": "Thép phẫu thuật không rỉ",
      "function": "Bấm sát chân lông mày chống đứt gãy"
    }
  ]
},
  {
  "id": "PROD-CRW-BCT-01",
  "name": "Bộ Cọ Trang Điểm Cá Nhân 14 Cây Lông Mềm Kèm Bao Da Vacosi Essential Brush Set",
  "brand": "Vacosi",
  "category": "Phụ kiện làm đẹp",
  "subCategory": "Bộ cọ trang điểm",
  "rating": 4.9,
  "soldCount": 29500,
  "reviewCount": 6800,
  "price": 345000,
  "originalPrice": 450000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Đầy Đủ 14 Cây",
    "Bao Da Cao Cấp"
  ],
  "images": [
    "/products/PROD-CRW-BCT-01.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "formulationTexture": "STICK",
  "originCountry": "KOREA",
  "variants": [
    {
      "sku": "VACOSI-SET14-LEATHER",
      "title": "Bộ 14 cây + Bao Da Đen Đựng Cọ",
      "price": 345000,
      "onHand": 380
    }
  ],
  "inciIngredients": [
    {
      "name": "Sợi tổng hợp bionic mềm mượt",
      "function": "Bám phấn đều, tán má hồng, phấn phủ, phấn mắt"
    }
  ]
},
  {
  "id": "PROD-CRW-BCT-02",
  "name": "Bộ Cọ Trang Điểm Mặt & Mắt 5 Cây Real Techniques Everyday Essentials Kèm Mút",
  "brand": "Real Techniques",
  "category": "Phụ kiện làm đẹp",
  "subCategory": "Bộ cọ trang điểm",
  "rating": 4.9,
  "soldCount": 34200,
  "reviewCount": 7900,
  "price": 389000,
  "originalPrice": 480000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Top Bán Chạy Toàn Cầu",
    "Lông Cọ Kháng Khuẩn"
  ],
  "images": [
    "/products/PROD-CRW-BCT-02.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "formulationTexture": "STICK",
  "originCountry": "USA",
  "variants": [
    {
      "sku": "RT-EVERYDAY-5P",
      "title": "Bộ 4 Cọ Chuyên Nghiệp + 1 Mút RT",
      "price": 389000,
      "onHand": 410
    }
  ],
  "inciIngredients": [
    {
      "name": "UltraPlush Synthetic Bristles",
      "function": "Lông cọ thiết kế công thái học dễ vệ sinh"
    }
  ]
},
  {
  "id": "PROD-CRW-BCT-03",
  "name": "Set Cọ Trang Điểm 10 Cây Lông Nhung Siêu Mịn Focallure Multifunction Brush Set",
  "brand": "Focallure",
  "category": "Phụ kiện làm đẹp",
  "subCategory": "Bộ cọ trang điểm",
  "rating": 4.8,
  "soldCount": 52100,
  "reviewCount": 11200,
  "price": 165000,
  "originalPrice": 230000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Ngon Bổ Rẻ",
    "Lông Nhân Tạo Thân Thiện"
  ],
  "images": [
    "/products/PROD-CRW-BCT-03.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "formulationTexture": "STICK",
  "originCountry": "CHINA",
  "variants": [
    {
      "sku": "FOCALLURE-SET10-PINK",
      "title": "Bộ 10 Cây Hồng Gold Sang Trọng",
      "price": 165000,
      "onHand": 830
    }
  ],
  "inciIngredients": [
    {
      "name": "Lông sợi nhung kháng khuẩn",
      "function": "Tán phấn mắt, highlight, tạo khối tự nhiên"
    }
  ]
},
  {
  "id": "PROD-CRW-BCT-04",
  "name": "Bộ Cọ Trang Điểm Cao Cấp 18 Cây Maange Professional kèm Túi Da Đựng",
  "brand": "Maange",
  "category": "Phụ kiện làm đẹp",
  "subCategory": "Bộ cọ trang điểm",
  "rating": 4.8,
  "soldCount": 41300,
  "reviewCount": 8400,
  "price": 195000,
  "originalPrice": 280000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Đầy Đủ Chi Tiết",
    "Không Rụng Lông"
  ],
  "images": [
    "/products/PROD-CRW-BCT-04.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "formulationTexture": "STICK",
  "originCountry": "CHINA",
  "variants": [
    {
      "sku": "MAANGE-SET18-BAG",
      "title": "Bộ 18 Cây Đen Khung Bạc + Túi Da",
      "price": 195000,
      "onHand": 650
    }
  ],
  "inciIngredients": [
    {
      "name": "Sợi fiber tổng hợp mật độ cao",
      "function": "Không hút sản phẩm, giữ độ mịn của nền"
    }
  ]
},
  {
  "id": "PROD-CRW-BCT-05",
  "name": "Bộ Cọ Trang Điểm Chuyên Nghiệp 12 Cây Lông Dê Tự Nhiên Bealy Studio Pro",
  "brand": "Bealy",
  "category": "Phụ kiện làm đẹp",
  "subCategory": "Bộ cọ trang điểm",
  "rating": 4.9,
  "soldCount": 16800,
  "reviewCount": 3400,
  "price": 450000,
  "originalPrice": 580000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Lông Dê Thật",
    "Bám Phấn Cực Tốt"
  ],
  "images": [
    "/products/PROD-CRW-BCT-05.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "formulationTexture": "STICK",
  "originCountry": "VIETNAM",
  "variants": [
    {
      "sku": "BEALY-SET12-GOAT",
      "title": "Hộp 12 Cây Thân Gỗ Cổ Điển",
      "price": 450000,
      "onHand": 240
    }
  ],
  "inciIngredients": [
    {
      "name": "Lông dê tự nhiên tiệt trùng 100%",
      "function": "Ăn phấn đều màu cho makeup artist"
    }
  ]
},
  {
  "id": "PROD-CRW-XMT-01",
  "name": "Nước Dưỡng Tóc Tinh Dầu Bưởi Cocoon Pomelo Hair Tonic 140ml Giảm Gãy Rụng & Kích Mọc Tóc",
  "brand": "Cocoon",
  "category": "Chăm sóc tóc & Da đầu",
  "subCategory": "Xịt mọc tóc",
  "rating": 4.9,
  "soldCount": 92400,
  "reviewCount": 24500,
  "price": 145000,
  "originalPrice": 165000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Thuần Chay 100%",
    "Kích Mọc Tóc Con"
  ],
  "images": [
    "/products/PROD-CRW-XMT-01.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "skinConcerns": [
    "HAIR_LOSS"
  ],
  "keyActiveGroups": [
    "SOOTHING_BOTANICAL"
  ],
  "safetyEthicsBadges": [
    "VEGAN",
    "CRUELTY_FREE",
    "ALCOHOL_FREE"
  ],
  "formulationTexture": "WATER_LIQUID",
  "originCountry": "VIETNAM",
  "variants": [
    {
      "sku": "COCOON-POMELO-140ML",
      "title": "Chai xịt 140ml phiên bản nâng cấp",
      "price": 145000,
      "onHand": 1500
    }
  ],
  "inciIngredients": [
    {
      "name": "Tinh dầu vỏ bưởi nguyên chất & Vitamin B5 (Panthenol)",
      "function": "Kích thích nang tóc phát triển dày mượt"
    }
  ]
},
  {
  "id": "PROD-CRW-XMT-02",
  "name": "Tinh Dầu Bưởi Dưỡng Mọc Tóc Milaganics Grapefruit Hair Mist 100ml",
  "brand": "Milaganics",
  "category": "Chăm sóc tóc & Da đầu",
  "subCategory": "Xịt mọc tóc",
  "rating": 4.8,
  "soldCount": 34100,
  "reviewCount": 6800,
  "price": 85000,
  "originalPrice": 110000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Thảo Mộc Tự Nhiên",
    "Không Bết Dính"
  ],
  "images": [
    "/products/PROD-CRW-XMT-02.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "formulationTexture": "WATER_LIQUID",
  "originCountry": "VIETNAM",
  "variants": [
    {
      "sku": "MILAGANICS-HAIR-100ML",
      "title": "Chai xịt 100ml hương bưởi ngọt",
      "price": 85000,
      "onHand": 850
    }
  ],
  "inciIngredients": [
    {
      "name": "Grapefruit Essential Oil & D-Panthenol",
      "function": "Phục hồi chân tóc suy yếu"
    }
  ]
},
  {
  "id": "PROD-CRW-XMT-03",
  "name": "Xịt Dưỡng Tóc Hương Bưởi Cổ Điển Thorakao Grapefruit Hair Lotion 150ml",
  "brand": "Thorakao",
  "category": "Chăm sóc tóc & Da đầu",
  "subCategory": "Xịt mọc tóc",
  "rating": 4.8,
  "soldCount": 48200,
  "reviewCount": 9200,
  "price": 55000,
  "originalPrice": 70000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Thương Hiệu Lâu Đời",
    "Ngừa Rụng Tóc"
  ],
  "images": [
    "/products/PROD-CRW-XMT-03.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "formulationTexture": "WATER_LIQUID",
  "originCountry": "VIETNAM",
  "variants": [
    {
      "sku": "THORAKAO-BUOI-150ML",
      "title": "Chai 150ml vòi xịt phun sương",
      "price": 55000,
      "onHand": 1100
    }
  ],
  "inciIngredients": [
    {
      "name": "Citrus Grandis Peel Oil",
      "function": "Nuôi dưỡng da đầu thoáng sạch khỏe khoắn"
    }
  ]
},
  {
  "id": "PROD-CRW-XMT-04",
  "name": "Serum Dưỡng Tóc Dày & Ngăn Rụng The Ordinary Multi-Peptide Serum for Hair Density 60ml",
  "brand": "The Ordinary",
  "category": "Chăm sóc tóc & Da đầu",
  "subCategory": "Xịt mọc tóc",
  "rating": 4.9,
  "soldCount": 21500,
  "reviewCount": 4800,
  "price": 420000,
  "originalPrice": 520000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Phức Hợp Peptides",
    "Khoa Học Dày Tóc"
  ],
  "images": [
    "/products/PROD-CRW-XMT-04.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "keyActiveGroups": [
    "ANTI_AGING"
  ],
  "safetyEthicsBadges": [
    "VEGAN",
    "ALCOHOL_FREE"
  ],
  "formulationTexture": "WATER_LIQUID",
  "originCountry": "CANADA",
  "variants": [
    {
      "sku": "TO-HAIR-DENSITY-60ML",
      "title": "Chai thủy tinh nhỏ giọt 60ml",
      "price": 420000,
      "onHand": 420
    }
  ],
  "inciIngredients": [
    {
      "name": "REDENSYL™, Procapil™, CAPIXYL™ Peptide Complex",
      "function": "Tăng mật độ nang tóc gấp 3 lần"
    }
  ]
},
  {
  "id": "PROD-CRW-XMT-05",
  "name": "Tinh Chất Xịt Mọc Tóc Gừng Tươi Weilaiya Ginger Hair Root Nourishing Tonic 100ml",
  "brand": "Weilaiya",
  "category": "Chăm sóc tóc & Da đầu",
  "subCategory": "Xịt mọc tóc",
  "rating": 4.9,
  "soldCount": 18900,
  "reviewCount": 3900,
  "price": 450000,
  "originalPrice": 550000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Gừng Vân Nam",
    "Ấm Da Đầu"
  ],
  "images": [
    "/products/PROD-CRW-XMT-05.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "formulationTexture": "WATER_LIQUID",
  "originCountry": "CHINA",
  "variants": [
    {
      "sku": "WEILAIYA-TONIC-100ML",
      "title": "Chai xịt 100ml tinh chất gừng",
      "price": 450000,
      "onHand": 350
    }
  ],
  "inciIngredients": [
    {
      "name": "Chiết xuất gừng tươi & Hà thủ ô đỏ",
      "function": "Lưu thông máu da đầu kích thích mọc tóc"
    }
  ]
},
  {
  "id": "PROD-CRW-TNT-01",
  "name": "Bọt Nhuộm Tóc Tự Làm Tại Nhà Mise En Scene Hello Bubble Foam Color Hàn Quốc",
  "brand": "Mise En Scene",
  "category": "Chăm sóc tóc & Da đầu",
  "subCategory": "Thuốc nhuộm tóc",
  "rating": 4.9,
  "soldCount": 65200,
  "reviewCount": 14300,
  "price": 175000,
  "originalPrice": 240000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Màu Hot Trend",
    "Tự Nhuộm Dễ Dàng"
  ],
  "images": [
    "/products/PROD-CRW-TNT-01.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "formulationTexture": "GEL",
  "originCountry": "KOREA",
  "variants": [
    {
      "sku": "MISE-BUBBLE-7K",
      "title": "Màu 7K Ash Khaki Brown Nâu Rêu Khói",
      "price": 175000,
      "onHand": 820
    }
  ],
  "inciIngredients": [
    {
      "name": "Tinh chất hạt trà xanh & Dầu hạt camellia",
      "function": "Lên màu chuẩn mà không làm khô xơ tóc"
    }
  ]
},
  {
  "id": "PROD-CRW-TNT-02",
  "name": "Thuốc Nhuộm Tóc Phủ Bạc Thảo Dược Bigen Silk Touch Nhật Bản Không Mùi Amoniac",
  "brand": "Bigen",
  "category": "Chăm sóc tóc & Da đầu",
  "subCategory": "Thuốc nhuộm tóc",
  "rating": 4.9,
  "soldCount": 42800,
  "reviewCount": 8900,
  "price": 185000,
  "originalPrice": 220000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Phủ Bạc 100%",
    "Thảo Dược Nhật Bản"
  ],
  "images": [
    "/products/PROD-CRW-TNT-02.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "formulationTexture": "CREAM_BALM",
  "originCountry": "JAPAN",
  "variants": [
    {
      "sku": "BIGEN-SILK-3N",
      "title": "Màu 3N Nâu Đen Tự Nhiên",
      "price": 185000,
      "onHand": 680
    }
  ],
  "inciIngredients": [
    {
      "name": "Dầu ô liu, nhân sâm & Bạc hà",
      "function": "Bảo vệ da đầu không xót"
    }
  ]
},
  {
  "id": "PROD-CRW-TNT-03",
  "name": "Kem Nhuộm Tóc Dưỡng Màu Thời Trang L'Oreal Paris Excellence Creme Pháp",
  "brand": "L'Oreal Paris",
  "category": "Chăm sóc tóc & Da đầu",
  "subCategory": "Thuốc nhuộm tóc",
  "rating": 4.9,
  "soldCount": 58400,
  "reviewCount": 11800,
  "price": 195000,
  "originalPrice": 250000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Bảo Vệ 3 Tác Động",
    "Bền Màu 8 Tuần"
  ],
  "images": [
    "/products/PROD-CRW-TNT-03.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "formulationTexture": "CREAM_BALM",
  "originCountry": "FRANCE",
  "variants": [
    {
      "sku": "LOREAL-EXCELLENCE-4",
      "title": "Màu 4 Nâu Tự Nhiên Quý Phái",
      "price": 195000,
      "onHand": 720
    }
  ],
  "inciIngredients": [
    {
      "name": "Pro-Keratin, Ceramide & Collagen",
      "function": "Phục hồi sợi tóc trước và sau khi nhuộm"
    }
  ]
},
  {
  "id": "PROD-CRW-TNT-04",
  "name": "Thuốc Nhuộm Tóc Dược Liệu Thái Dương Nhuộm Đen Tự Nhiên Hộp 5 Gói",
  "brand": "Thái Dương",
  "category": "Chăm sóc tóc & Da đầu",
  "subCategory": "Thuốc nhuộm tóc",
  "rating": 4.8,
  "soldCount": 31200,
  "reviewCount": 5900,
  "price": 95000,
  "originalPrice": 120000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Dược Liệu Lá Móng",
    "An Toàn Cho Tóc"
  ],
  "images": [
    "/products/PROD-CRW-TNT-04.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "formulationTexture": "POWDER",
  "originCountry": "VIETNAM",
  "variants": [
    {
      "sku": "THAIDUONG-NHUOM-5G",
      "title": "Hộp 5 gói x 10g bột thảo mộc",
      "price": 95000,
      "onHand": 940
    }
  ],
  "inciIngredients": [
    {
      "name": "Bột lá móng Lawsonia Inermis tự nhiên",
      "function": "Phủ đen tóc bạc an toàn không kích ứng"
    }
  ]
},
  {
  "id": "PROD-CRW-TNT-05",
  "name": "Bọt Nhuộm Tóc Tạo Bọt Dưỡng Tóc Beautylabo Whip Hair Color Nhật Bản",
  "brand": "Beautylabo",
  "category": "Chăm sóc tóc & Da đầu",
  "subCategory": "Thuốc nhuộm tóc",
  "rating": 4.8,
  "soldCount": 27500,
  "reviewCount": 5200,
  "price": 160000,
  "originalPrice": 210000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Bọt Kem Xốp Mịn",
    "Dưỡng Ẩm Trái Cây"
  ],
  "images": [
    "/products/PROD-CRW-TNT-05.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "formulationTexture": "GEL",
  "originCountry": "JAPAN",
  "variants": [
    {
      "sku": "BEAUTYLABO-HONEY",
      "title": "Màu Honey Chiffon Vàng Mật Ong",
      "price": 160000,
      "onHand": 510
    }
  ],
  "inciIngredients": [
    {
      "name": "Mật ong & Tinh dầu hoa cúc dại",
      "function": "Giữ sợi tóc bóng mượt bồng bềnh"
    }
  ]
},
  {
  "id": "PROD-CRW-DXA-01",
  "name": "Dầu Xả Phục Hồi Tóc Hư Tổn Cao Cấp Tsubaki Premium Moist & Repair Conditioner 490ml",
  "brand": "Tsubaki",
  "category": "Chăm sóc tóc & Da đầu",
  "subCategory": "Dầu xả",
  "rating": 4.9,
  "soldCount": 51200,
  "reviewCount": 11400,
  "price": 189000,
  "originalPrice": 235000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Công Nghệ Thẩm Thấu Nhanh",
    "Bóng Mượt Như Salon"
  ],
  "images": [
    "/products/PROD-CRW-DXA-01.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "formulationTexture": "CREAM_BALM",
  "originCountry": "JAPAN",
  "variants": [
    {
      "sku": "TSUBAKI-COND-RED-490",
      "title": "Chai vòi bơm 490ml Đỏ Dưỡng Ẩm",
      "price": 189000,
      "onHand": 890
    }
  ],
  "inciIngredients": [
    {
      "name": "Dầu hoa trà Nhật Bản & Protein đậu nành",
      "function": "Phục hồi lõi tóc hư tổn do uốn nhuộm"
    }
  ]
},
  {
  "id": "PROD-CRW-DXA-02",
  "name": "Dầu Xả Bưởi Phục Hồi & Giảm Rụng Tóc Cocoon Pomelo Hair Conditioner 310ml",
  "brand": "Cocoon",
  "category": "Chăm sóc tóc & Da đầu",
  "subCategory": "Dầu xả",
  "rating": 4.9,
  "soldCount": 38700,
  "reviewCount": 8200,
  "price": 165000,
  "originalPrice": 195000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Thuần Chay Không Silicon",
    "Mượt Tóc Nhẹ Tênh"
  ],
  "images": [
    "/products/PROD-CRW-DXA-02.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "formulationTexture": "CREAM_BALM",
  "originCountry": "VIETNAM",
  "variants": [
    {
      "sku": "COCOON-COND-310ML",
      "title": "Chai 310ml nắp bật tiện lợi",
      "price": 165000,
      "onHand": 740
    }
  ],
  "inciIngredients": [
    {
      "name": "Tinh dầu bưởi & Xylishine™ từ tảo nâu",
      "function": "Cung cấp dưỡng chất bóng mượt không gây bẹp tóc"
    }
  ]
},
  {
  "id": "PROD-CRW-DXA-03",
  "name": "Dầu Xả 3 Phút Diệu Kỳ Cho Tóc Hư Tổn Nặng Pantene 3 Minute Miracle 180ml",
  "brand": "Pantene",
  "category": "Chăm sóc tóc & Da đầu",
  "subCategory": "Dầu xả",
  "rating": 4.8,
  "soldCount": 64100,
  "reviewCount": 13900,
  "price": 85000,
  "originalPrice": 110000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Phục Hồi 3 Phút",
    "Pro-V Độc Quyền"
  ],
  "images": [
    "/products/PROD-CRW-DXA-03.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "formulationTexture": "CREAM_BALM",
  "originCountry": "THAILAND",
  "variants": [
    {
      "sku": "PANTENE-3MM-180ML",
      "title": "Tuýp 180ml Total Damage Care",
      "price": 85000,
      "onHand": 1200
    }
  ],
  "inciIngredients": [
    {
      "name": "Pro-Vitamin B5 công thức đậm đặc",
      "function": "Xử lý tóc chẻ ngọn và khô xơ trong 3 phút"
    }
  ]
},
  {
  "id": "PROD-CRW-DXA-04",
  "name": "Dầu Xả Keratin Cho Tóc Vào Nếp Suôn Mượt Tresemme Keratin Smooth Conditioner 640g",
  "brand": "Tresemme",
  "category": "Chăm sóc tóc & Da đầu",
  "subCategory": "Dầu xả",
  "rating": 4.9,
  "soldCount": 49500,
  "reviewCount": 10800,
  "price": 195000,
  "originalPrice": 245000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Vào Nếp 72H",
    "Chuẩn Salon Tresemme"
  ],
  "images": [
    "/products/PROD-CRW-DXA-04.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "formulationTexture": "CREAM_BALM",
  "originCountry": "VIETNAM",
  "variants": [
    {
      "sku": "TRESEMME-KERATIN-640",
      "title": "Chai lớn 640g vòi nhấn",
      "price": 195000,
      "onHand": 830
    }
  ],
  "inciIngredients": [
    {
      "name": "Hydrolyzed Keratin & Dầu Marula",
      "function": "Chống xù rối và giữ nếp tóc bồng bềnh"
    }
  ]
},
  {
  "id": "PROD-CRW-DXA-05",
  "name": "Dầu Xả Phục Hồi Toàn Diện 5 Tác Động L'Oreal Paris Elseve Total Repair 5 Conditioner 280ml",
  "brand": "L'Oreal Paris",
  "category": "Chăm sóc tóc & Da đầu",
  "subCategory": "Dầu xả",
  "rating": 4.8,
  "soldCount": 42300,
  "reviewCount": 9100,
  "price": 125000,
  "originalPrice": 155000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Ceramide Phục Hồi",
    "Giảm Chẻ Ngọn"
  ],
  "images": [
    "/products/PROD-CRW-DXA-05.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "formulationTexture": "CREAM_BALM",
  "originCountry": "FRANCE",
  "variants": [
    {
      "sku": "LOREAL-ELSEVE-280ML",
      "title": "Chai nắp bật 280ml",
      "price": 125000,
      "onHand": 650
    }
  ],
  "inciIngredients": [
    {
      "name": "Micro-Ceramide lấp đầy kẽ nứt tóc",
      "function": "Chống đứt gãy, thô ráp và xỉn màu"
    }
  ]
},
  {
  "id": "PROD-CRW-NHT-01",
  "name": "Nước Hoa Chiết Le Labo Santal 33 EDP 10ml Chuẩn Chính Hãng Mùi Gỗ Đẳng Cấp",
  "brand": "Le Labo",
  "category": "Nước hoa",
  "subCategory": "Nước hoa chiết mini 10ml",
  "rating": 4.9,
  "soldCount": 15400,
  "reviewCount": 3800,
  "price": 580000,
  "originalPrice": 690000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Gỗ Đàn Hương Sang Trọng",
    "Lưu Hương 12H+"
  ],
  "images": [
    "/products/PROD-CRW-NHT-01.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "formulationTexture": "WATER_LIQUID",
  "originCountry": "USA",
  "variants": [
    {
      "sku": "LELABO-33-10ML",
      "title": "Ống chiết thủy tinh 10ml vòi phun sương",
      "price": 580000,
      "onHand": 240
    }
  ],
  "inciIngredients": [
    {
      "name": "Cardamom, Iris, Violet, Sandalwood, Cedarwood",
      "function": "Hương thơm cá tính nịnh mũi"
    }
  ]
},
  {
  "id": "PROD-CRW-NHT-02",
  "name": "Nước Hoa Chiết Maison Margiela Replica Jazz Club EDT 10ml Hương Rượu Trầm Ấm",
  "brand": "Maison Margiela",
  "category": "Nước hoa",
  "subCategory": "Nước hoa chiết mini 10ml",
  "rating": 4.9,
  "soldCount": 12800,
  "reviewCount": 2900,
  "price": 490000,
  "originalPrice": 580000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Hương Rượu Rum & Thuốc Lá",
    "Ấm Áp Quyến Rũ"
  ],
  "images": [
    "/products/PROD-CRW-NHT-02.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "formulationTexture": "WATER_LIQUID",
  "originCountry": "FRANCE",
  "variants": [
    {
      "sku": "REPLICA-JAZZ-10ML",
      "title": "Ống 10ml nắp bạc chống rò rỉ",
      "price": 490000,
      "onHand": 190
    }
  ],
  "inciIngredients": [
    {
      "name": "Pink Pepper, Neroli, Rum, Tobacco Leaf, Vanilla",
      "function": "Phong cách quý ông lãng tử"
    }
  ]
},
  {
  "id": "PROD-CRW-NHT-03",
  "name": "Nước Hoa Chiết Nam Chanel Bleu de Chanel Eau de Parfum 10ml Nam Tính Cuốn Hút",
  "brand": "Chanel",
  "category": "Nước hoa",
  "subCategory": "Nước hoa chiết mini 10ml",
  "rating": 4.9,
  "soldCount": 28900,
  "reviewCount": 6500,
  "price": 450000,
  "originalPrice": 550000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Vua Nước Hoa Nam",
    "Lưu Hương Vượt Trội"
  ],
  "images": [
    "/products/PROD-CRW-NHT-03.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "formulationTexture": "WATER_LIQUID",
  "originCountry": "FRANCE",
  "variants": [
    {
      "sku": "BLEU-CHANEL-10ML",
      "title": "Chai chiết vỏ kim loại xoay 10ml",
      "price": 450000,
      "onHand": 380
    }
  ],
  "inciIngredients": [
    {
      "name": "Bưởi chùm, Hương trầm, Tuyết tùng & Hổ phách",
      "function": "Lôi cuốn phái nữ mọi ánh nhìn"
    }
  ]
},
  {
  "id": "PROD-CRW-NHT-04",
  "name": "Nước Hoa Chiết Nam Dior Sauvage Eau de Parfum 10ml Tươi Mát Hoang Dã",
  "brand": "Dior",
  "category": "Nước hoa",
  "subCategory": "Nước hoa chiết mini 10ml",
  "rating": 4.9,
  "soldCount": 32400,
  "reviewCount": 7400,
  "price": 420000,
  "originalPrice": 510000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Top 1 Nước Hoa Thế Giới",
    "Tỏa Hương Xa"
  ],
  "images": [
    "/products/PROD-CRW-NHT-04.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "formulationTexture": "WATER_LIQUID",
  "originCountry": "FRANCE",
  "variants": [
    {
      "sku": "DIOR-SAUVAGE-10ML",
      "title": "Ống chiết tiện lợi 10ml",
      "price": 420000,
      "onHand": 420
    }
  ],
  "inciIngredients": [
    {
      "name": "Cam Bergamot Calabria, Tiêu Tứ Xuyên & Ambroxan",
      "function": "Phóng khoáng mạnh mẽ"
    }
  ]
},
  {
  "id": "PROD-CRW-NHT-05",
  "name": "Nước Hoa Chiết Nữ YSL Libre Eau de Parfum 10ml Hương Hoa Lavender Sang Trọng",
  "brand": "YSL",
  "category": "Nước hoa",
  "subCategory": "Nước hoa chiết mini 10ml",
  "rating": 4.9,
  "soldCount": 25100,
  "reviewCount": 5800,
  "price": 430000,
  "originalPrice": 520000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Nữ Quyền Độc Lập",
    "Lưu Hương Cả Ngày"
  ],
  "images": [
    "/products/PROD-CRW-NHT-05.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "formulationTexture": "WATER_LIQUID",
  "originCountry": "FRANCE",
  "variants": [
    {
      "sku": "YSL-LIBRE-10ML",
      "title": "Chai chiết vòi phun nano 10ml",
      "price": 430000,
      "onHand": 310
    }
  ],
  "inciIngredients": [
    {
      "name": "Hoa oải hương Pháp, Hoa cam Morocco & Vani Madagascar",
      "function": "Tự do kiêu kỳ"
    }
  ]
},
  {
  "id": "PROD-CRW-VKN-01",
  "name": "Nước Hoa Vùng Kín Foellie Eau de Bijou 5ml Đen Quyến Rũ Sang Trọng",
  "brand": "Foellie",
  "category": "Nước hoa",
  "subCategory": "Nước hoa vùng kín",
  "rating": 4.9,
  "soldCount": 85200,
  "reviewCount": 19800,
  "price": 185000,
  "originalPrice": 250000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Khử Mùi 99.9%",
    "Hương Thơm Nồng Nàn"
  ],
  "images": [
    "/products/PROD-CRW-VKN-01.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES",
    "SENSITIVE"
  ],
  "formulationTexture": "FACIAL_OIL",
  "originCountry": "KOREA",
  "variants": [
    {
      "sku": "FOELLIE-BIJOU-5ML",
      "title": "Chai 5ml vỏ đen huyền bí",
      "price": 185000,
      "onHand": 1100
    }
  ],
  "inciIngredients": [
    {
      "name": "Dầu hoa anh thảo, Dầu argan, Dầu jojoba & Tinh dầu hạt hướng dương",
      "function": "Cân bằng pH và khử mùi vùng nhạy cảm 48h"
    }
  ]
},
  {
  "id": "PROD-CRW-VKN-02",
  "name": "Nước Hoa Vùng Kín Foellie Eau de Bonbon 5ml Trắng Ngọt Ngào Thanh Khiết",
  "brand": "Foellie",
  "category": "Nước hoa",
  "subCategory": "Nước hoa vùng kín",
  "rating": 4.9,
  "soldCount": 62400,
  "reviewCount": 13500,
  "price": 185000,
  "originalPrice": 250000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Hương Đào & Kẹo Ngọt",
    "Dịu Nhẹ An Toàn"
  ],
  "images": [
    "/products/PROD-CRW-VKN-02.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES",
    "SENSITIVE"
  ],
  "formulationTexture": "FACIAL_OIL",
  "originCountry": "KOREA",
  "variants": [
    {
      "sku": "FOELLIE-BONBON-5ML",
      "title": "Chai 5ml vỏ trắng tinh khôi",
      "price": 185000,
      "onHand": 840
    }
  ],
  "inciIngredients": [
    {
      "name": "6 loại tinh dầu thiên nhiên cao cấp",
      "function": "Mang lại cảm giác thơm mát sạch sẽ suốt chu kỳ"
    }
  ]
},
  {
  "id": "PROD-CRW-VKN-03",
  "name": "Nước Hoa Vùng Kín Dionel Secret Love Black Edition 5ml Hàn Quốc Lưu Hương 24H",
  "brand": "Dionel",
  "category": "Nước hoa",
  "subCategory": "Nước hoa vùng kín",
  "rating": 4.8,
  "soldCount": 45800,
  "reviewCount": 9700,
  "price": 195000,
  "originalPrice": 260000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Huyền Thoại Dionel",
    "Kháng Viêm Tự Nhiên"
  ],
  "images": [
    "/products/PROD-CRW-VKN-03.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES",
    "SENSITIVE"
  ],
  "formulationTexture": "FACIAL_OIL",
  "originCountry": "KOREA",
  "variants": [
    {
      "sku": "DIONEL-BLACK-5ML",
      "title": "Chai thủy tinh 5ml giọt nén",
      "price": 195000,
      "onHand": 620
    }
  ],
  "inciIngredients": [
    {
      "name": "Dầu hạt macadamia, Oenothera Biennis Oil",
      "function": "Diệt khuẩn Candida và tạo hương say đắm"
    }
  ]
},
  {
  "id": "PROD-CRW-VKN-04",
  "name": "Tinh Dầu Nước Hoa Vùng Kín Cenota Secret Sexy 10ml Khử Mùi Kháng Khuẩn",
  "brand": "Cenota",
  "category": "Nước hoa",
  "subCategory": "Nước hoa vùng kín",
  "rating": 4.8,
  "soldCount": 28900,
  "reviewCount": 5400,
  "price": 160000,
  "originalPrice": 220000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Dung Tích Lớn 10ml",
    "Công Nghệ Pháp"
  ],
  "images": [
    "/products/PROD-CRW-VKN-04.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES",
    "SENSITIVE"
  ],
  "formulationTexture": "FACIAL_OIL",
  "originCountry": "VIETNAM",
  "variants": [
    {
      "sku": "CENOTA-SEXY-10ML",
      "title": "Chai 10ml tiết kiệm gấp đôi",
      "price": 160000,
      "onHand": 510
    }
  ],
  "inciIngredients": [
    {
      "name": "Hương hoa linh lan & Tinh dầu hạnh nhân",
      "function": "Kháng khuẩn và khử mùi hôi"
    }
  ]
},
  {
  "id": "PROD-CRW-VKN-05",
  "name": "Nước Hoa Vùng Kín Tinh Tế De Memoria Floral Pocket Perfume 5ml",
  "brand": "De Memoria",
  "category": "Nước hoa",
  "subCategory": "Nước hoa vùng kín",
  "rating": 4.9,
  "soldCount": 21300,
  "reviewCount": 4600,
  "price": 175000,
  "originalPrice": 230000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Hương Hoa Xứ Grasse",
    "Không Chứa Cồn"
  ],
  "images": [
    "/products/PROD-CRW-VKN-05.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES",
    "SENSITIVE"
  ],
  "formulationTexture": "FACIAL_OIL",
  "originCountry": "KOREA",
  "variants": [
    {
      "sku": "DEMEMORIA-FLORAL-5ML",
      "title": "Chai 5ml hương hoa hồng Montmartre",
      "price": 175000,
      "onHand": 430
    }
  ],
  "inciIngredients": [
    {
      "name": "Rose Damascena Flower Oil & Chamomilla Recutita",
      "function": "Làm dịu và ngăn mùi bí bách"
    }
  ]
},
  {
  "id": "PROD-CRW-VMN-01",
  "name": "Tinh Dầu Hoa Anh Thảo Cân Bằng Nội Tiết & Giảm Mụn Blackmores Evening Primrose Oil 190 Viên",
  "brand": "Blackmores",
  "category": "Thực phẩm chức năng",
  "subCategory": "Viên uống trị mụn / nội tiết",
  "rating": 4.9,
  "soldCount": 38900,
  "reviewCount": 8900,
  "price": 520000,
  "originalPrice": 650000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Chuẩn Úc 1000mg",
    "Cân Bằng Nội Tiết Tố"
  ],
  "images": [
    "/products/PROD-CRW-VMN-01.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES",
    "ACNE_PRONE"
  ],
  "skinConcerns": [
    "ACNE",
    "HORMONAL_ACNE"
  ],
  "safetyEthicsBadges": [
    "NON_GMO",
    "GLUTEN_FREE"
  ],
  "formulationTexture": "STICK",
  "originCountry": "AUSTRALIA",
  "variants": [
    {
      "sku": "BLACKMORES-EPO-190V",
      "title": "Hộp 190 viên nang mềm",
      "price": 520000,
      "onHand": 550
    }
  ],
  "inciIngredients": [
    {
      "name": "Evening Primrose Oil 1000mg (chứa Gamma-Linolenic Acid GLA 100mg)",
      "function": "Điều hòa kinh nguyệt, giảm mụn nội tiết cằm và lưng"
    }
  ]
},
  {
  "id": "PROD-CRW-VMN-02",
  "name": "Viên Uống Bổ Sung Kẽm Kiểm Soát Bã Nhờn Ngừa Mụn DHC Zinc 60 Ngày 60 Viên",
  "brand": "DHC",
  "category": "Thực phẩm chức năng",
  "subCategory": "Viên uống trị mụn / nội tiết",
  "rating": 4.9,
  "soldCount": 95400,
  "reviewCount": 22100,
  "price": 110000,
  "originalPrice": 145000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Kẽm Men Tự Nhiên",
    "Kiểm Soát Nhờn Vượt Trội"
  ],
  "images": [
    "/products/PROD-CRW-VMN-02.jpg"
  ],
  "targetSkinTypes": [
    "OILY",
    "ACNE_PRONE"
  ],
  "skinConcerns": [
    "ACNE",
    "SEBUM"
  ],
  "formulationTexture": "STICK",
  "originCountry": "JAPAN",
  "variants": [
    {
      "sku": "DHC-ZINC-60D",
      "title": "Gói 60 viên uống trong 60 ngày",
      "price": 110000,
      "onHand": 1800
    }
  ],
  "inciIngredients": [
    {
      "name": "Kẽm Gluconate 15mg, Crom 60mcg, Selen 50mcg",
      "function": "Kháng viêm gom cồi mụn, ức chế tuyến dầu"
    }
  ]
},
  {
  "id": "PROD-CRW-VMN-03",
  "name": "Viên Uống Trị Mụn Trứng Cá & Mụn Viêm Pair A Lion 120 Viên Nhật Bản",
  "brand": "Lion",
  "category": "Thực phẩm chức năng",
  "subCategory": "Viên uống trị mụn / nội tiết",
  "rating": 4.8,
  "soldCount": 29800,
  "reviewCount": 6400,
  "price": 280000,
  "originalPrice": 350000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Đặc Trị Mụn Bọc",
    "Thải Độc Gan Da Liễu"
  ],
  "images": [
    "/products/PROD-CRW-VMN-03.jpg"
  ],
  "targetSkinTypes": [
    "ACNE_PRONE"
  ],
  "skinConcerns": [
    "ACNE"
  ],
  "formulationTexture": "STICK",
  "originCountry": "JAPAN",
  "variants": [
    {
      "sku": "PAIR-A-120V",
      "title": "Hộp thủy tinh 120 viên nén",
      "price": 280000,
      "onHand": 620
    }
  ],
  "inciIngredients": [
    {
      "name": "Glucuronolactone, L-Cysteine, Vitamin B2 & Vitamin B6",
      "function": "Đào thải độc tố gan, ngăn chặn mụn tái phát"
    }
  ]
},
  {
  "id": "PROD-CRW-VMN-04",
  "name": "Viên Uống 32 Loại Rau Củ Thanh Nhiệt Thải Độc DHC Perfect Vegetable 60 Ngày 240 Viên",
  "brand": "DHC",
  "category": "Thực phẩm chức năng",
  "subCategory": "Viên uống trị mụn / nội tiết",
  "rating": 4.9,
  "soldCount": 74200,
  "reviewCount": 16800,
  "price": 260000,
  "originalPrice": 320000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "32 Loại Rau Xanh",
    "Giảm Nóng Trong Mụn Nhọt"
  ],
  "images": [
    "/products/PROD-CRW-VMN-04.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "skinConcerns": [
    "INTERNAL_HEAT"
  ],
  "formulationTexture": "STICK",
  "originCountry": "JAPAN",
  "variants": [
    {
      "sku": "DHC-VEGE-60D",
      "title": "Gói 240 viên uống 60 ngày",
      "price": 260000,
      "onHand": 1300
    }
  ],
  "inciIngredients": [
    {
      "name": "100% rau củ quốc sản Nhật Bản & 1000 tỷ lợi khuẩn Lactic Acid",
      "function": "Mát gan tiêu độc, hỗ trợ tiêu hóa không táo bón"
    }
  ]
},
  {
  "id": "PROD-CRW-VMN-05",
  "name": "Tinh Dầu Hoa Anh Thảo Hữu Cơ Pháp Nat&Form Huile d'Onagre Bio 200 Viên",
  "brand": "Nat&Form",
  "category": "Thực phẩm chức năng",
  "subCategory": "Viên uống trị mụn / nội tiết",
  "rating": 4.8,
  "soldCount": 21400,
  "reviewCount": 4700,
  "price": 320000,
  "originalPrice": 390000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Chuẩn Hữu Cơ Bio EcoCert",
    "Chống Lão Hóa Nội Sinh"
  ],
  "images": [
    "/products/PROD-CRW-VMN-05.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "formulationTexture": "STICK",
  "originCountry": "FRANCE",
  "variants": [
    {
      "sku": "NATFORM-BIO-200V",
      "title": "Hộp phân hủy sinh học 200 viên",
      "price": 320000,
      "onHand": 480
    }
  ],
  "inciIngredients": [
    {
      "name": "Organic Evening Primrose Oil 500mg ép lạnh nguyên chất",
      "function": "Cải thiện làn da khô ráp sần sùi mụn do rối loạn nội tiết"
    }
  ]
},
  {
  "id": "PROD-CRW-VCN-01",
  "name": "Viên Uống Cấp Nước & Căng Bóng Da CJ Innerb Aqua Rich Double Up 70 Viên Hàn Quốc",
  "brand": "CJ Innerb",
  "category": "Thực phẩm chức năng",
  "subCategory": "Viên uống cấp nước Hyaluronic",
  "rating": 4.9,
  "soldCount": 42300,
  "reviewCount": 9600,
  "price": 450000,
  "originalPrice": 590000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Gấp Đôi HA 240mg",
    "Căng Mọng Da Sứ"
  ],
  "images": [
    "/products/PROD-CRW-VCN-01.jpg"
  ],
  "targetSkinTypes": [
    "DRY",
    "DEHYDRATED",
    "COMBINATION"
  ],
  "skinConcerns": [
    "DEHYDRATION"
  ],
  "keyActiveGroups": [
    "HYDRATION"
  ],
  "formulationTexture": "STICK",
  "originCountry": "KOREA",
  "variants": [
    {
      "sku": "INNERB-DOUBLEUP-70V",
      "title": "Lọ 70 viên nang mềm vàng gold",
      "price": 450000,
      "onHand": 780
    }
  ],
  "inciIngredients": [
    {
      "name": "Hyaluronic Acid 240mg, Collagen thủy phân & Ceramide cá",
      "function": "Ngậm nước tầng sâu giúp da ẩm mượt căng bóng suốt ngày dài"
    }
  ]
},
  {
  "id": "PROD-CRW-VCN-02",
  "name": "Viên Uống Bổ Sung Hyaluronic Acid Giữ Ẩm Da DHC Hyaluronic Acid 60 Ngày 120 Viên",
  "brand": "DHC",
  "category": "Thực phẩm chức năng",
  "subCategory": "Viên uống cấp nước Hyaluronic",
  "rating": 4.9,
  "soldCount": 36800,
  "reviewCount": 8100,
  "price": 295000,
  "originalPrice": 380000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "HA 150mg Nhật Bản",
    "Chống Khô Ráp Bong Tróc"
  ],
  "images": [
    "/products/PROD-CRW-VCN-02.jpg"
  ],
  "targetSkinTypes": [
    "DRY",
    "SENSITIVE"
  ],
  "keyActiveGroups": [
    "HYDRATION"
  ],
  "formulationTexture": "STICK",
  "originCountry": "JAPAN",
  "variants": [
    {
      "sku": "DHC-HA-60D",
      "title": "Gói 120 viên uống 60 ngày",
      "price": 295000,
      "onHand": 690
    }
  ],
  "inciIngredients": [
    {
      "name": "Hyaluronic Acid 150mg, Squalane & Chiết xuất hạt vải thiều",
      "function": "Tạo màng ẩm tự nhiên bảo vệ da mặt và cơ thể"
    }
  ]
},
  {
  "id": "PROD-CRW-VCN-03",
  "name": "Viên Uống Trắng Da Cấp Nước Huons White Glutathione Inner Aqua 60 Viên",
  "brand": "Huons",
  "category": "Thực phẩm chức năng",
  "subCategory": "Viên uống cấp nước Hyaluronic",
  "rating": 4.8,
  "soldCount": 19400,
  "reviewCount": 4200,
  "price": 380000,
  "originalPrice": 480000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Cấp Nước Sáng Mịn",
    "Glutathione Chuẩn Hàn"
  ],
  "images": [
    "/products/PROD-CRW-VCN-03.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "keyActiveGroups": [
    "HYDRATION",
    "BRIGHTENING"
  ],
  "formulationTexture": "STICK",
  "originCountry": "KOREA",
  "variants": [
    {
      "sku": "HUONS-AQUA-60V",
      "title": "Lọ 60 viên màu xanh ngọc bích",
      "price": 380000,
      "onHand": 430
    }
  ],
  "inciIngredients": [
    {
      "name": "Hyaluronic Acid, L-Glutathione & Vitamin C",
      "function": "Vừa cấp nước khóa ẩm vừa làm mờ sạm nám"
    }
  ]
},
  {
  "id": "PROD-CRW-VCN-04",
  "name": "Tinh Chất Uống Giữ Ẩm & Chống Khô Da Astalift Moist Essence F Dạng Viên 60 Viên",
  "brand": "Astalift",
  "category": "Thực phẩm chức năng",
  "subCategory": "Viên uống cấp nước Hyaluronic",
  "rating": 4.9,
  "soldCount": 11200,
  "reviewCount": 2600,
  "price": 680000,
  "originalPrice": 850000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Astaxanthin Đỏ Cao Cấp",
    "Chống Lão Hóa Cấp Nước"
  ],
  "images": [
    "/products/PROD-CRW-VCN-04.jpg"
  ],
  "targetSkinTypes": [
    "DRY",
    "AGING"
  ],
  "keyActiveGroups": [
    "HYDRATION",
    "ANTI_AGING"
  ],
  "formulationTexture": "STICK",
  "originCountry": "JAPAN",
  "variants": [
    {
      "sku": "ASTALIFT-MOIST-60V",
      "title": "Lọ 60 viên công nghệ Fujifilm",
      "price": 680000,
      "onHand": 220
    }
  ],
  "inciIngredients": [
    {
      "name": "Nano Astaxanthin, Ceramide & Hyaluronic Acid vi mô",
      "function": "Phục hồi hàng rào giữ nước đa tầng"
    }
  ]
},
  {
  "id": "PROD-CRW-VCN-05",
  "name": "Nước Uống Collagen & Cấp Nước Chống Lão Hóa The Collagen Shiseido 10 Lọ x 50ml",
  "brand": "Shiseido",
  "category": "Thực phẩm chức năng",
  "subCategory": "Viên uống cấp nước Hyaluronic",
  "rating": 4.9,
  "soldCount": 48900,
  "reviewCount": 11200,
  "price": 580000,
  "originalPrice": 720000,
  "inStock": true,
  "badges": [
    "Shopee Mall",
    "Collagen Nước Thẩm Thấu Nhanh",
    "Bán Chạy Nhất Nhật Bản"
  ],
  "images": [
    "/products/PROD-CRW-VCN-05.jpg"
  ],
  "targetSkinTypes": [
    "ALL_SKIN_TYPES"
  ],
  "keyActiveGroups": [
    "HYDRATION",
    "ANTI_AGING"
  ],
  "formulationTexture": "WATER_LIQUID",
  "originCountry": "JAPAN",
  "variants": [
    {
      "sku": "SHISEIDO-COLLAGEN-BOX",
      "title": "Hộp 10 chai x 50ml vị trái cây",
      "price": 580000,
      "onHand": 920
    }
  ],
  "inciIngredients": [
    {
      "name": "Collagen Peptide 1000mg, Hyaluronic Acid 5mg, Ceramide 600mcg & Trái Amla",
      "function": "Tăng độ đàn hồi căng mọng mịn màng cho da"
    }
  ]
},

  // 0. Showcase Lip On Lip Glowy Satin (Chuẩn Shopee Mall từ hình ảnh thực tế)
  {
    id: 'PROD-LIP-ON-LIP',
    shopId: '00000000-0000-0000-0000-000000000010',
    name: 'Son thỏi dưỡng môi trang điểm chất son satin Lip On Lip Glowy Satin 2.2g',
    brand: 'Lip On Lip',
    description: 'Son thỏi trang điểm dưỡng môi chất son satin bóng nhẹ, dưỡng ẩm vượt trội với dầu olive và bơ hạt mỡ, lên màu chuẩn sắc tự nhiên suốt 6H.',
    category: 'Lipstick',
    subCategory: 'Son thỏi',
    registrationNumber: '214589/23/CBMP-QLD',
    rating: 4.9,
    soldCount: 7420,
    reviewCount: 1620,
    price: 135520,
    originalPrice: 155000,
    inStock: true,
    badges: ['Shopee Mall', 'Xử lý bởi Mall', 'Voucher Xtra'],
    images: ['/products/PROD-LIPONLIP.jpg', '/products/PROD-LIPONLIP-STUDIO.jpg', '/products/SKU-LIPONLIP-04.jpg', '/products/SKU-LIPONLIP-02.jpg', '/products/SKU-LIPONLIP-05.jpg', '/products/SKU-LIPONLIP-01.jpg', '/products/SKU-LIPONLIP-03.jpg'],
    targetSkinTypes: ['ALL_SKIN_TYPES', 'DRY', 'NORMAL'],
    skinConcerns: ['DEHYDRATION'],
    keyActiveGroups: ['HYDRATION'],
    safetyEthicsBadges: ['PARABEN_FREE'],
    formulationTexture: 'STICK',
    originCountry: 'VIETNAM',
    variants: [
      {
        skuCode: 'SKU-LIPONLIP-04',
        name: 'Đỏ Ruby',
        price: 135520,
        originalPrice: 155000,
        onHand: 65,
        stock: 65,
        inStock: true,
        attributes: { Shade: 'Đỏ Ruby', Finish: 'SATIN', Hex: '#B71C35' },
        image: '/products/SKU-LIPONLIP-04.jpg'
      },
      {
        skuCode: 'SKU-LIPONLIP-02',
        name: 'Đỏ Gạch',
        price: 135520,
        originalPrice: 155000,
        onHand: 85,
        stock: 85,
        inStock: true,
        attributes: { Shade: 'Đỏ Gạch', Finish: 'SATIN', Hex: '#9E2A2B' },
        image: '/products/SKU-LIPONLIP-02.jpg'
      },
      {
        skuCode: 'SKU-LIPONLIP-05',
        name: 'Hồng Đỏ',
        price: 135520,
        originalPrice: 155000,
        onHand: 42,
        stock: 42,
        inStock: true,
        attributes: { Shade: 'Hồng Đỏ', Finish: 'SATIN', Hex: '#D43F68' },
        image: '/products/SKU-LIPONLIP-05.jpg'
      },
      {
        skuCode: 'SKU-LIPONLIP-01',
        name: 'Cam Gạch',
        price: 135520,
        originalPrice: 155000,
        onHand: 0,
        stock: 0,
        inStock: false,
        attributes: { Shade: 'Cam Gạch', Finish: 'SATIN', Hex: '#C85A32' },
        image: '/products/SKU-LIPONLIP-01.jpg'
      },
      {
        skuCode: 'SKU-LIPONLIP-03',
        name: 'Cam Đào',
        price: 135520,
        originalPrice: 155000,
        onHand: 70,
        stock: 70,
        inStock: true,
        attributes: { Shade: 'Cam Đào', Finish: 'SATIN', Hex: '#ED7A56' },
        image: '/products/SKU-LIPONLIP-03.jpg'
      }
    ],
    vtoConfig: {
      supported: true,
      category: 'lipstick',
      finishType: 'SATIN',
      shades: [
        { skuCode: 'SKU-LIPONLIP-04', shadeName: 'Đỏ Ruby', hexColor: '#B71C35', finishType: 'SATIN', opacity: 0.85, bestUndertone: 'ALL' },
        { skuCode: 'SKU-LIPONLIP-02', shadeName: 'Đỏ Gạch', hexColor: '#9E2A2B', finishType: 'SATIN', opacity: 0.85, bestUndertone: 'WARM' },
        { skuCode: 'SKU-LIPONLIP-05', shadeName: 'Hồng Đỏ', hexColor: '#D43F68', finishType: 'SATIN', opacity: 0.85, bestUndertone: 'COOL' },
        { skuCode: 'SKU-LIPONLIP-01', shadeName: 'Cam Gạch', hexColor: '#C85A32', finishType: 'SATIN', opacity: 0.85, bestUndertone: 'WARM' },
        { skuCode: 'SKU-LIPONLIP-03', shadeName: 'Cam Đào', hexColor: '#ED7A56', finishType: 'SATIN', opacity: 0.85, bestUndertone: 'WARM' }
      ]
    },
    inciIngredients: [
      { inciName: 'Olea Europaea (Olive) Fruit Oil', comedogenicRating: 2, irritationRating: 0, function: 'Dầu ô liu dưỡng môi ẩm mượt chống thâm' },
      { inciName: 'Butyrospermum Parkii (Shea) Butter', comedogenicRating: 0, irritationRating: 0, function: 'Bơ hạt mỡ làm mềm rãnh nhăn môi' }
    ]
  },
  // Showcase WAKEMAKE Soft Blurring Balm Stick 3.5g (10 Sắc thái chuẩn Olive Young từ ảnh thực tế)
  {
    id: 'PROD-WAKEMAKE-BLURRING',
    shopId: '00000000-0000-0000-0000-000000000010',
    name: 'Son thỏi làm mờ rãnh môi WAKEMAKE Soft Blurring Balm Stick 3.5g',
    brand: 'WAKEMAKE',
    description: 'Son thỏi thuần chay WAKEMAKE Soft Blurring Balm Stick tạo hiệu ứng môi mờ ảo tự nhiên, mịn màng che phủ rãnh môi hoàn hảo, giàu dưỡng chất với 10 tông màu chuẩn Hàn Quốc.',
    category: 'Lipstick',
    subCategory: 'Son thỏi',
    registrationNumber: '289410/24/CBMP-QLD',
    rating: 4.9,
    soldCount: 6890,
    reviewCount: 1480,
    price: 285000,
    originalPrice: 350000,
    inStock: true,
    badges: ['Shopee Mall', 'Olive Young Top 1', 'Thuần Chay', 'Voucher Xtra'],
    images: [
      '/products/PROD-WAKEMAKE-BLURRING.jpg',
      '/products/SKU-WAKEMAKE-01.jpg',
      '/products/SKU-WAKEMAKE-02.jpg',
      '/products/SKU-WAKEMAKE-03.jpg',
      '/products/SKU-WAKEMAKE-04.jpg',
      '/products/SKU-WAKEMAKE-05.jpg',
      '/products/SKU-WAKEMAKE-06.jpg',
      '/products/SKU-WAKEMAKE-07.jpg',
      '/products/SKU-WAKEMAKE-08.jpg',
      '/products/SKU-WAKEMAKE-09.jpg',
      '/products/SKU-WAKEMAKE-10.jpg'
    ],
    targetSkinTypes: ['ALL_SKIN_TYPES', 'DRY', 'NORMAL'],
    skinConcerns: ['DEHYDRATION'],
    keyActiveGroups: ['HYDRATION', 'ANTIOXIDANT'],
    safetyEthicsBadges: ['VEGAN', 'CRUELTY_FREE', 'PARABEN_FREE'],
    formulationTexture: 'STICK',
    originCountry: 'KOREA',
    variants: [
      {
        skuCode: 'SKU-WAKEMAKE-01',
        name: '01 Love Fever - Màu hồng đất trung tính',
        price: 285000,
        originalPrice: 350000,
        onHand: 88,
        stock: 88,
        inStock: true,
        attributes: { Shade: '01 Love Fever - Màu hồng đất trung tính', Finish: 'MATTE_BLUR', Hex: '#C97A7E' },
        image: '/products/SKU-WAKEMAKE-01.jpg'
      },
      {
        skuCode: 'SKU-WAKEMAKE-02',
        name: '02 Milk Apricot - Màu cam đào sữa',
        price: 285000,
        originalPrice: 350000,
        onHand: 65,
        stock: 65,
        inStock: true,
        attributes: { Shade: '02 Milk Apricot - Màu cam đào sữa', Finish: 'MATTE_BLUR', Hex: '#E8927C' },
        image: '/products/SKU-WAKEMAKE-02.jpg'
      },
      {
        skuCode: 'SKU-WAKEMAKE-03',
        name: '03 Shy Youth - Màu hồng dâu',
        price: 285000,
        originalPrice: 350000,
        onHand: 92,
        stock: 92,
        inStock: true,
        attributes: { Shade: '03 Shy Youth - Màu hồng dâu', Finish: 'MATTE_BLUR', Hex: '#E06D85' },
        image: '/products/SKU-WAKEMAKE-03.jpg'
      },
      {
        skuCode: 'SKU-WAKEMAKE-04',
        name: '04 Peach Bebe - Cam đào ấm',
        price: 285000,
        originalPrice: 350000,
        onHand: 74,
        stock: 74,
        inStock: true,
        attributes: { Shade: '04 Peach Bebe - Cam đào ấm', Finish: 'MATTE_BLUR', Hex: '#DF7963' },
        image: '/products/SKU-WAKEMAKE-04.jpg'
      },
      {
        skuCode: 'SKU-WAKEMAKE-05',
        name: '05 Blushed Pink - Màu hồng cánh sen',
        price: 285000,
        originalPrice: 350000,
        onHand: 58,
        stock: 58,
        inStock: true,
        attributes: { Shade: '05 Blushed Pink - Màu hồng cánh sen', Finish: 'MATTE_BLUR', Hex: '#D75C88' },
        image: '/products/SKU-WAKEMAKE-05.jpg'
      },
      {
        skuCode: 'SKU-WAKEMAKE-06',
        name: '06 Neat - Màu hồng trung tính',
        price: 285000,
        originalPrice: 350000,
        onHand: 80,
        stock: 80,
        inStock: true,
        attributes: { Shade: '06 Neat - Màu hồng trung tính', Finish: 'MATTE_BLUR', Hex: '#BD6B74' },
        image: '/products/SKU-WAKEMAKE-06.jpg'
      },
      {
        skuCode: 'SKU-WAKEMAKE-07',
        name: '07 Hush Mauve - Màu hồng đất',
        price: 285000,
        originalPrice: 350000,
        onHand: 62,
        stock: 62,
        inStock: true,
        attributes: { Shade: '07 Hush Mauve - Màu hồng đất', Finish: 'MATTE_BLUR', Hex: '#A65E6B' },
        image: '/products/SKU-WAKEMAKE-07.jpg'
      },
      {
        skuCode: 'SKU-WAKEMAKE-08',
        name: '08 Maple Coral - Màu cam san hô',
        price: 285000,
        originalPrice: 350000,
        onHand: 95,
        stock: 95,
        inStock: true,
        attributes: { Shade: '08 Maple Coral - Màu cam san hô', Finish: 'MATTE_BLUR', Hex: '#D46452' },
        image: '/products/SKU-WAKEMAKE-08.jpg'
      },
      {
        skuCode: 'SKU-WAKEMAKE-09',
        name: '09 Hip Berry - Màu đỏ berry',
        price: 285000,
        originalPrice: 350000,
        onHand: 46,
        stock: 46,
        inStock: true,
        attributes: { Shade: '09 Hip Berry - Màu đỏ berry', Finish: 'MATTE_BLUR', Hex: '#9E2A3B' },
        image: '/products/SKU-WAKEMAKE-09.jpg'
      },
      {
        skuCode: 'SKU-WAKEMAKE-10',
        name: '10 Clear Red - Màu đỏ thuần',
        price: 285000,
        originalPrice: 350000,
        onHand: 110,
        stock: 110,
        inStock: true,
        attributes: { Shade: '10 Clear Red - Màu đỏ thuần', Finish: 'MATTE_BLUR', Hex: '#C81D25' },
        image: '/products/SKU-WAKEMAKE-10.jpg'
      }
    ],
    vtoConfig: {
      supported: true,
      category: 'lipstick',
      finishType: 'MATTE',
      shades: [
        { skuCode: 'SKU-WAKEMAKE-01', shadeName: '01 Love Fever - Màu hồng đất trung tính', hexColor: '#C97A7E', finishType: 'MATTE', opacity: 0.85, bestUndertone: 'NEUTRAL' },
        { skuCode: 'SKU-WAKEMAKE-02', shadeName: '02 Milk Apricot - Màu cam đào sữa', hexColor: '#E8927C', finishType: 'MATTE', opacity: 0.85, bestUndertone: 'WARM' },
        { skuCode: 'SKU-WAKEMAKE-03', shadeName: '03 Shy Youth - Màu hồng dâu', hexColor: '#E06D85', finishType: 'MATTE', opacity: 0.85, bestUndertone: 'COOL' },
        { skuCode: 'SKU-WAKEMAKE-04', shadeName: '04 Peach Bebe - Cam đào ấm', hexColor: '#DF7963', finishType: 'MATTE', opacity: 0.85, bestUndertone: 'WARM' },
        { skuCode: 'SKU-WAKEMAKE-05', shadeName: '05 Blushed Pink - Màu hồng cánh sen', hexColor: '#D75C88', finishType: 'MATTE', opacity: 0.85, bestUndertone: 'COOL' },
        { skuCode: 'SKU-WAKEMAKE-06', shadeName: '06 Neat - Màu hồng trung tính', hexColor: '#BD6B74', finishType: 'MATTE', opacity: 0.85, bestUndertone: 'NEUTRAL' },
        { skuCode: 'SKU-WAKEMAKE-07', shadeName: '07 Hush Mauve - Màu hồng đất', hexColor: '#A65E6B', finishType: 'MATTE', opacity: 0.85, bestUndertone: 'COOL' },
        { skuCode: 'SKU-WAKEMAKE-08', shadeName: '08 Maple Coral - Màu cam san hô', hexColor: '#D46452', finishType: 'MATTE', opacity: 0.85, bestUndertone: 'WARM' },
        { skuCode: 'SKU-WAKEMAKE-09', shadeName: '09 Hip Berry - Màu đỏ berry', hexColor: '#9E2A3B', finishType: 'MATTE', opacity: 0.85, bestUndertone: 'COOL' },
        { skuCode: 'SKU-WAKEMAKE-10', shadeName: '10 Clear Red - Màu đỏ thuần', hexColor: '#C81D25', finishType: 'MATTE', opacity: 0.85, bestUndertone: 'ALL' }
      ]
    },
    inciIngredients: [
      { inciName: 'Synthetic Wax', comedogenicRating: 0, irritationRating: 0, function: 'Sáp vi tinh thể định hình thỏi son lướt êm ái' },
      { inciName: 'Prunus Armeniaca (Apricot) Kernel Oil', comedogenicRating: 2, irritationRating: 0, function: 'Dầu hạt mơ nuôi dưỡng đôi môi căng mọng' },
      { inciName: 'Rosa Canina Fruit Oil', comedogenicRating: 1, irritationRating: 0, function: 'Dầu tầm xuân chống oxy hóa và giữ ẩm mềm mại' }
    ]
  },
  // Body Care
  {
    id: 'niche-body-001',
    name: 'Cocoon Cà Phê Đắk Lắk Tẩy Tế Bào Chết Toàn Thân 200ml',
    brand: 'Cocoon',
    category: 'Chăm sóc cơ thể',
    subCategory: 'Tẩy da chết toàn thân (Body Scrub)',
    images: ['/products/niche-body-001.jpg'],
    registrationNumber: '002145/22/CBMP-HCM',
    rating: 4.9,
    soldCount: 8420,
    inStock: true,
    badges: ['Thuần Chay', 'Bán Chạy'],
    targetSkinTypes: ['NORMAL', 'OILY', 'DRY', 'COMBINATION'],
    skinConcerns: ['DULLNESS', 'PORES', 'BARRIER_REPAIR'],
    keyActiveGroups: ['SOOTHING_BOTANICAL', 'EXFOLIATION'],
    safetyEthicsBadges: ['VEGAN', 'CRUELTY_FREE', 'PARABEN_FREE', 'ALCOHOL_FREE'],
    formulationTexture: 'CREAM_BALM',
    originCountry: 'VIETNAM',
    variants: [
      { sku: 'COCOON-COFFEE-200ML', title: 'Hũ 200ml', price: 125000, originalPrice: 145000, onHand: 150 }
    ],
    inciIngredients: [
      { name: 'Coffea Robusta Seed Powder', comedogenicRating: 0, irritationRating: 0, function: 'Tẩy tế bào chết vật lý tự nhiên' },
      { name: 'Theobroma Cacao Seed Butter', comedogenicRating: 2, irritationRating: 0, function: 'Khóa ẩm, làm mềm mịn da' }
    ]
  },
  {
    id: 'niche-body-002',
    name: 'Muối Tắm Khoáng Epsom Thư Giãn Tinh Dầu Hoa Oải Hương Lavender 500g',
    brand: 'Aura Spa Care',
    category: 'Chăm sóc cơ thể',
    subCategory: 'Muối tắm thư giãn',
    images: ['/products/niche-body-002.jpg'],
    registrationNumber: '003912/23/CBMP-QLD',
    rating: 4.8,
    soldCount: 3120,
    inStock: true,
    badges: ['Spa Thư Giãn'],
    targetSkinTypes: ['NORMAL', 'OILY', 'DRY'],
    skinConcerns: ['DEHYDRATION', 'DULLNESS'],
    keyActiveGroups: ['SOOTHING_BOTANICAL'],
    safetyEthicsBadges: ['FRAGRANCE_FREE', 'PARABEN_FREE', 'VEGAN'],
    formulationTexture: 'POWDER',
    originCountry: 'USA',
    variants: [
      { sku: 'EPSOM-LAVENDER-500G', title: 'Túi 500g', price: 180000, onHand: 120 }
    ],
    inciIngredients: [
      { name: 'Magnesium Sulfate', comedogenicRating: 0, irritationRating: 0, function: 'Muối khoáng làm dịu cơ bắp và da' }
    ]
  },
  {
    id: 'niche-body-003',
    name: 'Kem Tẩy Lông Veet Pure Dịu Nhẹ Cho Da Nhạy Cảm 100ml',
    brand: 'Veet',
    category: 'Chăm sóc cơ thể',
    subCategory: 'Kem triệt lông dịu nhẹ',
    images: ['/products/niche-body-003.jpg'],
    registrationNumber: '110293/21/CBMP-QLD',
    rating: 4.7,
    soldCount: 9400,
    inStock: true,
    badges: ['Da Nhạy Cảm'],
    targetSkinTypes: ['SENSITIVE', 'NORMAL'],
    skinConcerns: ['PORES'],
    keyActiveGroups: ['SOOTHING_BOTANICAL'],
    safetyEthicsBadges: ['FRAGRANCE_FREE', 'PARABEN_FREE'],
    formulationTexture: 'CREAM_BALM',
    originCountry: 'FRANCE',
    variants: [
      { sku: 'VEET-PURE-100ML', title: 'Tuýp 100ml', price: 95000, originalPrice: 110000, onHand: 200 }
    ],
    inciIngredients: [
      { name: 'Potassium Thioglycolate', comedogenicRating: 0, irritationRating: 1, function: 'Làm mềm và rụng lông nhẹ dịu' }
    ]
  },
  {
    id: 'niche-body-004',
    name: 'Kem Dưỡng Da Tay L\'Occitane Shea Butter Hand Cream 75ml',
    brand: 'L\'Occitane',
    category: 'Chăm sóc cơ thể',
    subCategory: 'Kem dưỡng da tay & gót chân',
    images: ['/products/niche-body-004.jpg'],
    registrationNumber: '19820/22/CBMP-QLD',
    rating: 4.9,
    soldCount: 5200,
    inStock: true,
    badges: ['Cao Cấp', 'Top Bán Chạy'],
    targetSkinTypes: ['DRY', 'NORMAL', 'SENSITIVE'],
    skinConcerns: ['DEHYDRATION', 'BARRIER_REPAIR'],
    keyActiveGroups: ['HYDRATION', 'SOOTHING_BOTANICAL'],
    safetyEthicsBadges: ['PARABEN_FREE', 'ALCOHOL_FREE'],
    formulationTexture: 'CREAM_BALM',
    originCountry: 'FRANCE',
    variants: [
      { sku: 'LOCCITANE-SHEA-75ML', title: 'Tuýp 75ml', price: 620000, onHand: 80 }
    ],
    inciIngredients: [
      { name: 'Butyrospermum Parkii Butter', comedogenicRating: 0, irritationRating: 0, function: '20% Bơ hạt mỡ dưỡng ẩm sâu' }
    ]
  },

  // Haircare
  {
    id: 'niche-hair-001',
    name: 'Dầu Gội Khô Batiste Dry Shampoo Original Hương Tươi Mát 200ml',
    brand: 'Batiste',
    category: 'Chăm sóc tóc & Da đầu',
    subCategory: 'Dầu gội khô tiện lợi',
    images: ['/products/niche-hair-001.webp'],
    registrationNumber: '189201/22/CBMP-QLD',
    rating: 4.8,
    soldCount: 15400,
    inStock: true,
    badges: ['Bồng Bềnh Tóc'],
    targetSkinTypes: ['OILY', 'NORMAL'],
    skinConcerns: ['OIL_CONTROL'],
    keyActiveGroups: ['SOOTHING_BOTANICAL'],
    safetyEthicsBadges: ['PARABEN_FREE', 'CRUELTY_FREE'],
    formulationTexture: 'POWDER',
    originCountry: 'UK',
    variants: [
      { sku: 'BATISTE-ORIG-200ML', title: 'Chai 200ml', price: 165000, onHand: 300 }
    ],
    inciIngredients: [
      { name: 'Oryza Sativa Starch', comedogenicRating: 0, irritationRating: 0, function: 'Bột gạo hút sạch dầu bã nhờn' }
    ]
  },
  {
    id: 'niche-hair-002',
    name: 'Tinh Dầu Dưỡng Tóc Moroccanoil Treatment Original 100ml',
    brand: 'Moroccanoil',
    category: 'Chăm sóc tóc & Da đầu',
    subCategory: 'Tinh dầu dưỡng bóng tóc',
    images: ['/products/niche-hair-002.png'],
    registrationNumber: '109823/21/CBMP-QLD',
    rating: 5.0,
    soldCount: 12800,
    inStock: true,
    badges: ['Top Salon', 'Best Seller'],
    targetSkinTypes: ['DRY', 'NORMAL'],
    skinConcerns: ['DEHYDRATION', 'BARRIER_REPAIR'],
    keyActiveGroups: ['SOOTHING_BOTANICAL'],
    safetyEthicsBadges: ['ALCOHOL_FREE', 'PARABEN_FREE'],
    formulationTexture: 'FACIAL_OIL',
    originCountry: 'USA',
    variants: [
      { sku: 'MOROCCAN-OIL-100ML', title: 'Chai 100ml', price: 890000, onHand: 140 }
    ],
    inciIngredients: [
      { name: 'Argania Spinosa Kernel Oil', comedogenicRating: 0, irritationRating: 0, function: 'Dầu argan phục hồi ngọn tóc hư tổn' }
    ]
  },
  {
    id: 'niche-hair-003',
    name: 'Mặt Nạ Tóc Shiseido Fino Premium Touch Phục Hồi Chuyên Sâu 230g',
    brand: 'Shiseido',
    category: 'Chăm sóc tóc & Da đầu',
    subCategory: 'Kem ủ tóc & Mặt nạ ủ nhiệt',
    images: ['/products/niche-hair-003.jpg'],
    registrationNumber: '154092/22/CBMP-QLD',
    rating: 4.9,
    soldCount: 22000,
    inStock: true,
    badges: ['Số 1 Nhật Bản'],
    targetSkinTypes: ['DRY', 'NORMAL'],
    skinConcerns: ['BARRIER_REPAIR'],
    keyActiveGroups: ['HYDRATION'],
    safetyEthicsBadges: ['ALCOHOL_FREE'],
    formulationTexture: 'CREAM_BALM',
    originCountry: 'JAPAN',
    variants: [
      { sku: 'SHISEIDO-FINO-230G', title: 'Hũ 230g', price: 215000, onHand: 240 }
    ],
    inciIngredients: [
      { name: 'Royal Jelly Extract', comedogenicRating: 0, irritationRating: 0, function: 'Sữa ong chúa nuôi dưỡng sợi tóc' }
    ]
  },

  // Fragrance
  {
    id: 'niche-frag-001',
    name: 'Nước Hoa Nữ Chanel Coco Mademoiselle Eau De Parfum 50ml',
    brand: 'Chanel',
    category: 'Nước hoa',
    subCategory: 'Nước hoa Nữ',
    images: ['/products/niche-frag-001.webp'],
    registrationNumber: '198200/23/CBMP-QLD',
    rating: 5.0,
    soldCount: 6800,
    inStock: true,
    badges: ['Xa Xỉ', 'Hương Hoa Cỏ'],
    targetSkinTypes: ['NORMAL', 'DRY'],
    skinConcerns: ['DULLNESS'],
    keyActiveGroups: ['SOOTHING_BOTANICAL'],
    safetyEthicsBadges: ['PARABEN_FREE'],
    formulationTexture: 'WATER_LIQUID',
    originCountry: 'FRANCE',
    variants: [
      { sku: 'CHANEL-COCO-50ML', title: 'Chai 50ml', price: 3450000, onHand: 50 }
    ],
    inciIngredients: [
      { name: 'Citrus Aurantium Dulcis Oil', comedogenicRating: 0, irritationRating: 0, function: 'Tinh dầu cam tươi ngọt thanh' }
    ]
  },
  {
    id: 'niche-frag-002',
    name: 'Xịt Thơm Toàn Thân Bath & Body Works Gingham Fine Fragrance Mist 236ml',
    brand: 'Bath & Body Works',
    category: 'Nước hoa',
    subCategory: 'Xịt thơm toàn thân (Body Mist)',
    images: ['/products/niche-frag-002.jpg'],
    registrationNumber: '142301/22/CBMP-QLD',
    rating: 4.8,
    soldCount: 18900,
    inStock: true,
    badges: ['Lưu Hương 6H'],
    targetSkinTypes: ['NORMAL', 'DRY'],
    skinConcerns: ['DEHYDRATION'],
    keyActiveGroups: ['SOOTHING_BOTANICAL'],
    safetyEthicsBadges: ['PARABEN_FREE'],
    formulationTexture: 'WATER_LIQUID',
    originCountry: 'USA',
    variants: [
      { sku: 'BBW-GINGHAM-236ML', title: 'Chai 236ml', price: 295000, onHand: 180 }
    ],
    inciIngredients: [
      { name: 'Aloe Barbadensis Leaf Extract', comedogenicRating: 0, irritationRating: 0, function: 'Nha đam dưỡng ẩm cơ thể' }
    ]
  },

  // Supplements
  {
    id: 'niche-supp-001',
    name: 'Viên Uống Collagen DHC Nhật Bản 2050mg (Gói 60 Ngày 360 Viên)',
    brand: 'DHC',
    category: 'Thực phẩm chức năng',
    subCategory: 'Nước uống / Viên uống Collagen',
    images: ['/products/niche-supp-001.jpg'],
    registrationNumber: '4892/2020/ĐKSP-ATTP',
    rating: 4.9,
    soldCount: 31000,
    inStock: true,
    badges: ['Top 1 Collagen Nhật'],
    targetSkinTypes: ['DRY', 'NORMAL', 'COMBINATION'],
    skinConcerns: ['AGING_WRINKLES', 'DEHYDRATION'],
    keyActiveGroups: ['ANTI_AGING'],
    safetyEthicsBadges: ['PARABEN_FREE'],
    formulationTexture: 'POWDER',
    originCountry: 'JAPAN',
    variants: [
      { sku: 'DHC-COLLAGEN-360V', title: 'Gói 360 viên (60 ngày)', price: 385000, onHand: 420 }
    ],
    inciIngredients: [
      { name: 'Fish Collagen Peptide', comedogenicRating: 0, irritationRating: 0, function: 'Collagen thủy phân từ cá biển sâu' }
    ]
  },
  {
    id: 'niche-supp-002',
    name: 'Viên Uống Trắng Da Mờ Nám Transino White C Clear 120 Viên',
    brand: 'Transino',
    category: 'Thực phẩm chức năng',
    subCategory: 'Viên uống trắng da',
    images: ['/products/niche-supp-002.jpg'],
    registrationNumber: '7821/2021/ĐKSP-ATTP',
    rating: 4.9,
    soldCount: 14200,
    inStock: true,
    badges: ['Mờ Nám Sâu'],
    targetSkinTypes: ['NORMAL', 'DRY', 'OILY'],
    skinConcerns: ['HYPERPIGMENTATION', 'DULLNESS'],
    keyActiveGroups: ['BRIGHTENING'],
    safetyEthicsBadges: ['PARABEN_FREE'],
    formulationTexture: 'POWDER',
    originCountry: 'JAPAN',
    variants: [
      { sku: 'TRANSINO-WHITE-120V', title: 'Hộp 120 viên', price: 495000, onHand: 160 }
    ],
    inciIngredients: [
      { name: 'L-Cysteine & Ascorbic Acid 1000mg', comedogenicRating: 0, irritationRating: 0, function: 'Ức chế hắc sắc tố Melanin' }
    ]
  },

  // Beauty Tools
  {
    id: 'niche-tool-001',
    name: 'Bông Tẩy Trang Silcot Miếng Đôi Dưỡng Da Nhật Bản Hộp 40 Miếng',
    brand: 'Silcot',
    category: 'Phụ kiện làm đẹp',
    subCategory: 'Bông tẩy trang',
    images: ['/products/niche-tool-001.webp'],
    registrationNumber: 'TCCS-0912/20',
    rating: 5.0,
    soldCount: 45000,
    inStock: true,
    badges: ['Tiết Kiệm Toner'],
    targetSkinTypes: ['SENSITIVE', 'DRY', 'NORMAL', 'OILY'],
    skinConcerns: ['DEHYDRATION'],
    keyActiveGroups: ['HYDRATION'],
    safetyEthicsBadges: ['FRAGRANCE_FREE', 'PARABEN_FREE', 'VEGAN'],
    formulationTexture: 'POWDER',
    originCountry: 'JAPAN',
    variants: [
      { sku: 'SILCOT-DUO-40M', title: 'Hộp 40 miếng đôi', price: 58000, onHand: 600 }
    ],
    inciIngredients: [
      { name: '100% Rayon & Natural Cotton', comedogenicRating: 0, irritationRating: 0, function: 'Sợi bọt biển mềm mịn không xơ' }
    ]
  },
  {
    id: 'niche-tool-002',
    name: 'Máy Rửa Mặt Sóng Âm Silicon Y Tế Foreo Luna 4 Smart Cleanser',
    brand: 'Foreo',
    category: 'Phụ kiện làm đẹp',
    subCategory: 'Máy rửa mặt sóng âm T-Sonic',
    images: ['/products/niche-tool-002.png'],
    registrationNumber: 'TCCS-LUNA4-2023',
    rating: 4.9,
    soldCount: 2300,
    inStock: true,
    badges: ['Công Nghệ Cao', 'Chính Hãng Thụy Điển'],
    targetSkinTypes: ['OILY', 'COMBINATION', 'NORMAL', 'SENSITIVE'],
    skinConcerns: ['PORES', 'ACNE', 'OIL_CONTROL'],
    keyActiveGroups: ['EXFOLIATION'],
    safetyEthicsBadges: ['HYPOALLERGENIC'],
    formulationTexture: 'STICK',
    originCountry: 'SWITZERLAND',
    variants: [
      { sku: 'FOREO-LUNA4-PINK', title: 'Màu Hồng (Da Thường)', price: 3850000, onHand: 40 },
      { sku: 'FOREO-LUNA4-BLUE', title: 'Màu Xanh (Da Hỗn Hợp)', price: 3850000, onHand: 35 }
    ],
    inciIngredients: [
      { name: 'Ultra-hygienic Medical Silicone', comedogenicRating: 0, irritationRating: 0, function: 'Silicon y tế kháng khuẩn 35 lần' }
    ]
  },
  {
    id: 'niche-tool-003',
    name: 'Máy Đẩy Tinh Chất & Massage Nâng Cơ Ya-Man Photo PLUS EMS',
    brand: 'Ya-Man',
    category: 'Phụ kiện làm đẹp',
    subCategory: 'Máy đẩy tinh chất & Massage nâng cơ',
    images: ['/products/niche-tool-003.jpg'],
    registrationNumber: 'TCCS-YAMAN-2023',
    rating: 5.0,
    soldCount: 950,
    inStock: true,
    badges: ['Spa Công Nghệ Cao'],
    targetSkinTypes: ['DRY', 'NORMAL', 'COMBINATION'],
    skinConcerns: ['AGING_WRINKLES', 'BARRIER_REPAIR'],
    keyActiveGroups: ['ANTI_AGING'],
    safetyEthicsBadges: ['HYPOALLERGENIC'],
    formulationTexture: 'STICK',
    originCountry: 'JAPAN',
    variants: [
      { sku: 'YAMAN-PHOTO-HRF10T', title: 'Máy Ya-Man Gold', price: 7900000, onHand: 25 }
    ],
    inciIngredients: [
      { inciName: 'Titanium Head & Radio Frequency RF', comedogenicRating: 0, irritationRating: 0, function: 'Sóng vô tuyến RF kích sinh collagen' }
    ]
  },
  {
    id: 'niche-makeup-001',
    name: 'Kem Che Khuyết Điểm Chống Nắng The Saem Cover Perfection Tip Concealer SPF28 PA++',
    brand: 'The Saem',
    category: 'Trang điểm',
    subCategory: 'Kem che khuyết điểm (Concealer)',
    images: ['/products/niche-makeup-001.jpg'],
    registrationNumber: 'CBMP-19342/22/CBMP-QLD',
    rating: 4.8,
    soldCount: 15400,
    inStock: true,
    badges: ['Che Phủ Đỉnh Cao', 'Bestseller Hàn Quốc'],
    targetSkinTypes: ['OILY', 'COMBINATION', 'NORMAL'],
    skinConcerns: ['ACNE_PORES', 'PIGMENTATION_DARK_SPOTS'],
    keyActiveGroups: ['NIACINAMIDE'],
    safetyEthicsBadges: ['DERMATOLOGICALLY_TESTED'],
    formulationTexture: 'CREAM',
    originCountry: 'KOREA',
    variants: [
      { sku: 'THESAEM-TIP-1.5', title: 'Tone 1.5 Natural Beige', price: 89000, originalPrice: 110000, onHand: 350 },
      { sku: 'THESAEM-TIP-01', title: 'Tone 01 Clear Beige', price: 89000, originalPrice: 110000, onHand: 280 }
    ],
    inciIngredients: [
      { inciName: 'Titanium Dioxide', comedogenicRating: 0, irritationRating: 0, function: 'Màng lọc khoáng và che khuyết điểm hoàn hảo' },
      { inciName: 'Centella Asiatica Extract', comedogenicRating: 0, irritationRating: 0, function: 'Rau má làm dịu nốt mụn viêm sưng' }
    ]
  },
  {
    id: 'niche-makeup-002',
    name: 'Phấn Phủ Bột Kiềm Dầu Khoáng Tự Nhiên Innisfree No-Sebum Mineral Powder 5g',
    brand: 'Innisfree',
    category: 'Trang điểm',
    subCategory: 'Phấn phủ kiềm dầu (Phấn nén / Phấn bột)',
    images: ['/products/niche-makeup-002.jpg'],
    registrationNumber: 'CBMP-18230/21/CBMP-QLD',
    rating: 4.9,
    soldCount: 28500,
    inStock: true,
    badges: ['Kiềm Dầu Quốc Dân', 'Hút Bã Nhờn 16H'],
    targetSkinTypes: ['OILY', 'COMBINATION'],
    skinConcerns: ['ACNE_PORES', 'DULLNESS'],
    keyActiveGroups: ['MINERALS'],
    safetyEthicsBadges: ['NON_COMEDOGENIC', 'FRAGRANCE_FREE'],
    formulationTexture: 'POWDER',
    originCountry: 'KOREA',
    variants: [
      { sku: 'INNI-NOSEBUM-5G', title: 'Hộp 5g', price: 135000, originalPrice: 160000, onHand: 500 }
    ],
    inciIngredients: [
      { inciName: 'Silica', comedogenicRating: 0, irritationRating: 0, function: 'Bột khoáng thiên nhiên hút sạch dầu thừa tức thì' },
      { inciName: 'Jeju Mineral Salt', comedogenicRating: 0, irritationRating: 0, function: 'Khoáng núi lửa đảo Jeju giữ da thông thoáng' }
    ]
  },
  {
    id: 'niche-makeup-003',
    name: 'Bút Kẻ Mắt Nước Kháng Nước Đầu Cọ Siêu Mảnh Kissme Heroine Make Smooth Liquid Eyeliner 0.1mm',
    brand: 'Kissme',
    category: 'Trang điểm',
    subCategory: 'Bút kẻ mắt (Eyeliner nước / chì)',
    images: ['/products/niche-makeup-003.webp'],
    registrationNumber: 'CBMP-14221/20/CBMP-QLD',
    rating: 4.9,
    soldCount: 9800,
    inStock: true,
    badges: ['Chống Lem Trôi', 'Siêu Mảnh 0.1mm'],
    targetSkinTypes: ['ALL_SKIN_TYPES'],
    skinConcerns: ['DULLNESS'],
    keyActiveGroups: ['WATERPROOF'],
    safetyEthicsBadges: ['OPHTHALMOLOGIST_TESTED'],
    formulationTexture: 'LIQUID',
    originCountry: 'JAPAN',
    variants: [
      { sku: 'KISSME-EYE-01', title: 'Màu Đen Jet Black 01', price: 235000, originalPrice: 275000, onHand: 160 },
      { sku: 'KISSME-EYE-02', title: 'Màu Nâu Tự Nhiên 02', price: 235000, originalPrice: 275000, onHand: 140 }
    ],
    inciIngredients: [
      { inciName: 'Acrylates Copolymer', comedogenicRating: 0, irritationRating: 0, function: 'Màng film chống nước, chống cọ xát và mồ hôi' },
      { inciName: 'Panthenol', comedogenicRating: 0, irritationRating: 0, function: 'Vitamin B5 nuôi dưỡng chân mi chắc khỏe' }
    ]
  },
  {
    id: 'niche-makeup-004',
    name: 'Mascara Làm Dài Và Cong Mi Chống Nước Maybelline Lash Sensational Sky High Waterproof 6ml',
    brand: 'Maybelline',
    category: 'Trang điểm',
    subCategory: 'Mascara làm dài và cong mi',
    images: ['/products/niche-makeup-004.jpg'],
    registrationNumber: 'CBMP-19945/22/CBMP-QLD',
    rating: 4.8,
    soldCount: 22000,
    inStock: true,
    badges: ['Cong Mi 24H', 'Không Lem Vón Cục'],
    targetSkinTypes: ['ALL_SKIN_TYPES'],
    skinConcerns: ['DULLNESS'],
    keyActiveGroups: ['WATERPROOF'],
    safetyEthicsBadges: ['OPHTHALMOLOGIST_TESTED'],
    formulationTexture: 'GEL',
    originCountry: 'USA',
    variants: [
      { sku: 'MAYB-SKYHIGH-BLACK', title: 'Đen Huyền Very Black', price: 219000, originalPrice: 260000, onHand: 380 }
    ],
    inciIngredients: [
      { inciName: 'Bamboo Extract', comedogenicRating: 0, irritationRating: 0, function: 'Chiết xuất tre nối dài từng sợi mi tơi tự nhiên' },
      { inciName: 'Beeswax', comedogenicRating: 0, irritationRating: 0, function: 'Sáp ong tự nhiên định hình độ cong mi bền bỉ 24H' }
    ]
  },
  {
    id: 'niche-makeup-005',
    name: 'Chì Kẻ Mày 2 Đầu Bền Màu Định Hình Sợi Tự Nhiên Innisfree Auto Eyebrow Pencil 0.3g',
    brand: 'Innisfree',
    category: 'Trang điểm',
    subCategory: 'Chì kẻ mày & Gel định hình mày',
    images: ['/products/niche-makeup-005.webp'],
    registrationNumber: 'CBMP-17552/21/CBMP-QLD',
    rating: 4.7,
    soldCount: 16700,
    inStock: true,
    badges: ['Dễ Vẽ Sợi', 'Bền Màu 12H'],
    targetSkinTypes: ['ALL_SKIN_TYPES'],
    skinConcerns: ['DULLNESS'],
    keyActiveGroups: ['MINERALS'],
    safetyEthicsBadges: ['CRUELTY_FREE'],
    formulationTexture: 'STICK',
    originCountry: 'KOREA',
    variants: [
      { sku: 'INNI-EYEBROW-04', title: 'Màu 04 Nâu Xám (Ash Brown)', price: 79000, originalPrice: 95000, onHand: 240 },
      { sku: 'INNI-EYEBROW-05', title: 'Màu 05 Nâu Đậm (Espresso Brown)', price: 79000, originalPrice: 95000, onHand: 210 }
    ],
    inciIngredients: [
      { inciName: 'Hydrogenated Soybean Oil', comedogenicRating: 0, irritationRating: 0, function: 'Dầu đậu nành hydro hóa tạo chất chì mềm mượt dễ lướt' },
      { inciName: 'Iron Oxides', comedogenicRating: 0, irritationRating: 0, function: 'Hạt màu khoáng tinh khiết an toàn cho vùng mắt' }
    ]
  },
  {
    id: 'niche-body-005',
    name: 'Sữa Tắm Nước Hoa Tinh Dầu Trắng Sáng Mịn Màng The Body Shop British Rose Shower Gel 250ml',
    brand: 'The Body Shop',
    category: 'Chăm sóc cơ thể',
    subCategory: 'Sữa tắm dưỡng ẩm & Lưu hương',
    images: ['/products/niche-body-005.jpg'],
    registrationNumber: 'CBMP-15431/21/CBMP-QLD',
    rating: 4.8,
    soldCount: 7800,
    inStock: true,
    badges: ['Hương Nước Hoa Anh Quốc', 'Dưỡng Sáng Mịn'],
    targetSkinTypes: ['ALL_SKIN_TYPES', 'DRY'],
    skinConcerns: ['DEHYDRATION', 'DULLNESS'],
    keyActiveGroups: ['ROSE_ESSENCE'],
    safetyEthicsBadges: ['VEGAN', 'CRUELTY_FREE'],
    formulationTexture: 'GEL',
    originCountry: 'UK',
    variants: [
      { sku: 'TBS-ROSE-250ML', title: 'Chai 250ml', price: 249000, originalPrice: 289000, onHand: 190 }
    ],
    inciIngredients: [
      { inciName: 'Rosa Gallica Flower Extract', comedogenicRating: 0, irritationRating: 0, function: 'Chiết xuất hoa hồng hữu cơ giữ ẩm và dưỡng da mịn lụa' }
    ]
  },
  {
    id: 'niche-body-006',
    name: 'Lăn Khử Mùi Khoáng Khô Thoáng 48h Cho Da Nhạy Cảm Vichy Anti-Transpirant 50ml',
    brand: 'Vichy',
    category: 'Chăm sóc cơ thể',
    subCategory: 'Lăn / Xịt khử mùi',
    images: ['/products/niche-body-006.jpg'],
    registrationNumber: 'CBMP-16540/22/CBMP-QLD',
    rating: 4.9,
    soldCount: 14200,
    inStock: true,
    badges: ['Khô Thoáng 48H', 'Chuẩn Da Liễu'],
    targetSkinTypes: ['SENSITIVE', 'ALL_SKIN_TYPES'],
    skinConcerns: ['DEHYDRATION'],
    keyActiveGroups: ['MINERALS'],
    safetyEthicsBadges: ['ALCOHOL_FREE', 'PARABEN_FREE', 'HYPOALLERGENIC'],
    formulationTexture: 'LOTION',
    originCountry: 'FRANCE',
    variants: [
      { sku: 'VICHY-DEO-50ML', title: 'Chai lăn 50ml nắp trắng', price: 235000, originalPrice: 275000, onHand: 280 }
    ],
    inciIngredients: [
      { inciName: 'Aluminum Chlorohydrate', comedogenicRating: 0, irritationRating: 0, function: 'Muối khoáng kiểm soát mồ hôi và vi khuẩn gây mùi' },
      { inciName: 'Vichy Mineralizing Water', comedogenicRating: 0, irritationRating: 0, function: 'Nước khoáng núi lửa làm dịu vùng da dưới cánh tay' }
    ]
  },
  {
    id: 'niche-body-007',
    name: 'Sữa Tắm Dưỡng Ẩm Chuyên Sâu Dove Deep Moisture Cho Làn Da Mềm Mượt 500g',
    brand: 'Dove',
    category: 'Chăm sóc cơ thể',
    subCategory: 'Sữa tắm',
    images: ['/products/niche-body-007.jpg'],
    registrationNumber: 'CBMP-19842/23/CBMP-QLD',
    rating: 4.8,
    soldCount: 9600,
    inStock: true,
    badges: ['Dưỡng Ẩm Chuyên Sâu', 'Bán Chạy'],
    targetSkinTypes: ['DRY', 'NORMAL', 'SENSITIVE'],
    skinConcerns: ['DEHYDRATION'],
    keyActiveGroups: ['HYDRATION'],
    safetyEthicsBadges: ['PARABEN_FREE', 'CRUELTY_FREE'],
    formulationTexture: 'CREAM_BALM',
    originCountry: 'USA',
    variants: [
      { sku: 'DOVE-DM-500G', title: 'Chai 500g', price: 145000, originalPrice: 175000, onHand: 150 },
      { sku: 'DOVE-DM-1000G', title: 'Chai Đại 1000g Tiết Kiệm', price: 235000, originalPrice: 280000, onHand: 120 }
    ],
    inciIngredients: [
      { inciName: 'NutriumMoisture', comedogenicRating: 0, irritationRating: 0, function: 'Hỗn hợp dưỡng chất thẩm thấu nuôi dưỡng sâu từng tế bào' },
      { inciName: 'Glycerin', comedogenicRating: 0, irritationRating: 0, function: 'Khóa ẩm ngăn ngừa tình trạng da khô căng sau khi tắm' }
    ]
  },
  {
    id: 'niche-body-008',
    name: 'Sữa Tắm Sáng Da Dịu Lành Cho Da Nhạy Cảm Cetaphil Bright Healthy Radiance Refresh Body Wash 245ml',
    brand: 'Cetaphil',
    category: 'Chăm sóc cơ thể',
    subCategory: 'Sữa tắm',
    images: ['/products/niche-body-008.jpg'],
    registrationNumber: 'CBMP-22341/22/CBMP-QLD',
    rating: 4.9,
    soldCount: 6500,
    inStock: true,
    badges: ['Chuẩn Da Liễu', 'Dịu Nhẹ'],
    targetSkinTypes: ['SENSITIVE', 'DRY', 'ALL_SKIN_TYPES'],
    skinConcerns: ['DULLNESS', 'DEHYDRATION'],
    keyActiveGroups: ['BRIGHTENING'],
    safetyEthicsBadges: ['FRAGRANCE_FREE', 'PARABEN_FREE', 'HYPOALLERGENIC'],
    formulationTexture: 'GEL',
    originCountry: 'CANADA',
    variants: [
      { sku: 'CETAPHIL-BHR-245ML', title: 'Chai 245ml', price: 295000, originalPrice: 340000, onHand: 110 }
    ],
    inciIngredients: [
      { inciName: 'Niacinamide', comedogenicRating: 0, irritationRating: 0, function: 'Dưỡng sáng đều màu da và củng cố màng bảo vệ' },
      { inciName: 'Sea Daffodil', comedogenicRating: 0, irritationRating: 0, function: 'Chiết xuất hoa thủy tiên biển ức chế melanin sạm màu' }
    ]
  },
  {
    id: 'niche-body-009',
    name: 'Sữa Dưỡng Thể Dưỡng Trắng & Chống Nắng Vaseline Healthy Bright Daily Sun Refreshing SPF50+ 300ml',
    brand: 'Vaseline',
    category: 'Chăm sóc cơ thể',
    subCategory: 'Sữa dưỡng thể (Body Lotion)',
    images: ['/products/niche-body-009.jpg'],
    registrationNumber: 'CBMP-18239/22/CBMP-QLD',
    rating: 4.9,
    soldCount: 22000,
    inStock: true,
    badges: ['Chống Nắng SPF50+', 'Top 1 Bán Chạy'],
    targetSkinTypes: ['NORMAL', 'OILY', 'ALL_SKIN_TYPES'],
    skinConcerns: ['DULLNESS', 'UV_PROTECTION'],
    keyActiveGroups: ['BRIGHTENING', 'UV_FILTERS'],
    safetyEthicsBadges: ['PARABEN_FREE'],
    formulationTexture: 'LOTION',
    originCountry: 'THAILAND',
    variants: [
      { sku: 'VASELINE-SPF50-300ML', title: 'Chai 300ml (Chống nắng SPF50+)', price: 185000, originalPrice: 220000, onHand: 240 },
      { sku: 'VASELINE-GLUTA-330ML', title: 'Chai 330ml (Gluta-Hya Vàng)', price: 175000, originalPrice: 210000, onHand: 180 }
    ],
    inciIngredients: [
      { inciName: 'GlutaGlow', comedogenicRating: 0, irritationRating: 0, function: 'Hiệu quả sáng da gấp 10 lần so với Vitamin C' },
      { inciName: 'Hyaluronic Acid', comedogenicRating: 0, irritationRating: 0, function: 'Cấp nước tầng sâu cho làn da căng mọng rạng rỡ' }
    ]
  },
  {
    id: 'niche-body-010',
    name: 'Sữa Dưỡng Thể Phục Hồi Hàng Rào Ẩm Da Khô Nhạy Cảm CeraVe Daily Moisturizing Lotion 236ml',
    brand: 'CeraVe',
    category: 'Chăm sóc cơ thể',
    subCategory: 'Sữa dưỡng thể (Body Lotion)',
    images: ['/products/niche-body-010.jpg'],
    registrationNumber: 'CBMP-14920/21/CBMP-QLD',
    rating: 4.9,
    soldCount: 18500,
    inStock: true,
    badges: ['Chuẩn Da Liễu', '3 Ceramides Thiết Yếu'],
    targetSkinTypes: ['DRY', 'SENSITIVE', 'NORMAL'],
    skinConcerns: ['DEHYDRATION', 'BARRIER_REPAIR'],
    keyActiveGroups: ['HYDRATION'],
    safetyEthicsBadges: ['FRAGRANCE_FREE', 'PARABEN_FREE', 'NON_COMEDOGENIC'],
    formulationTexture: 'LOTION',
    originCountry: 'USA',
    variants: [
      { sku: 'CERAVE-LOTION-236ML', title: 'Chai 236ml', price: 345000, originalPrice: 390000, onHand: 160 },
      { sku: 'CERAVE-LOTION-473ML', title: 'Chai Lớn 473ml Tiết Kiệm', price: 465000, originalPrice: 520000, onHand: 95 }
    ],
    inciIngredients: [
      { inciName: 'Ceramides 1, 3, 6-II', comedogenicRating: 0, irritationRating: 0, function: 'Khôi phục lớp màng lipid bảo vệ tự nhiên của da' },
      { inciName: 'Hyaluronic Acid', comedogenicRating: 0, irritationRating: 0, function: 'Duy trì độ ẩm tự nhiên suốt 24 giờ với công nghệ MVE' }
    ]
  },
  {
    id: 'niche-body-011',
    name: 'Tẩy Tế Bào Chết Cơ Thể Dove Exfoliating Body Polish Pomegranate Seeds & Shea Butter 298g',
    brand: 'Dove',
    category: 'Chăm sóc cơ thể',
    subCategory: 'Tẩy da chết toàn thân (Body Scrub)',
    description: 'Kem tắm tẩy tế bào chết toàn thân Dove Exfoliating Body Polish Pomegranate Seeds & Shea Butter chiết xuất hạt lựu đỏ và bơ hạt mỡ. Công thức giàu độ ẩm với 1/4 kem dưỡng ẩm của Dove tạo sự mềm mại tức thì, hạt tẩy tế bào chết kích thước cát mịn nhẹ nhàng loại bỏ lớp da chết xỉn màu và phục hồi dưỡng chất tự nhiên.',
    images: [
      '/products/dove-pomegranate-main.jpg',
      '/products/dove-pomegranate-cream-texture.jpg',
      '/products/dove-pomegranate-swatch.jpg',
      '/products/dove-pomegranate-back-label.jpg',
      '/products/dove-pomegranate-top-lid.jpg',
      '/products/dove-pomegranate-side-view.jpg',
      '/products/dove-pomegranate-barcode.jpg',
      '/products/dove-pomegranate-model.jpg'
    ],
    registrationNumber: 'CBMP-19834/23/CBMP-QLD',
    rating: 4.9,
    soldCount: 14500,
    inStock: true,
    badges: ['Hạt Lựu Đỏ Mỹ', '1/4 Kem Dưỡng Dove', 'Mịn Màng Tức Thì'],
    targetSkinTypes: ['ALL_SKIN_TYPES', 'DRY', 'NORMAL'],
    skinConcerns: ['DULLNESS', 'PORES', 'DRYNESS'],
    keyActiveGroups: ['EXFOLIATION', 'SOOTHING_BOTANICAL', 'HYDRATION'],
    safetyEthicsBadges: ['PARABEN_FREE', 'CRUELTY_FREE', 'SULFATE_FREE'],
    formulationTexture: 'CREAM_BALM',
    originCountry: 'USA',
    variants: [
      {
        sku: 'DOVE-POLISH-POMEGRANATE-298G',
        title: 'Hũ 298g Hương Hạt Lựu & Bơ Hạt Mỡ',
        price: 249000,
        originalPrice: 285000,
        onHand: 175,
        image: '/products/dove-pomegranate-main.jpg'
      },
      {
        sku: 'DOVE-POLISH-MACADAMIA-298G',
        title: 'Hũ 298g Mắc-ca & Sữa Gạo',
        price: 249000,
        originalPrice: 285000,
        onHand: 140,
        image: '/products/dove-pomegranate-cream-texture.jpg'
      }
    ],
    inciIngredients: [
      { inciName: 'Water (Aqua)', comedogenicRating: 0, irritationRating: 0, function: 'Dung môi tinh khiết tiêu chuẩn' },
      { inciName: 'Glycerin', comedogenicRating: 0, irritationRating: 0, function: 'Hút ẩm dưỡng ẩm tự nhiên cho lớp sừng' },
      { inciName: 'Hydrated Silica', comedogenicRating: 0, irritationRating: 0, function: 'Hạt tẩy tế bào chết khoáng mịn màng nhẹ nhàng cuốn sạch tế bào chết' },
      { inciName: 'Sodium Lauroyl Isethionate', comedogenicRating: 0, irritationRating: 0, function: 'Chất làm sạch dịu nhẹ không sulfate an toàn vi sinh vật da' },
      { inciName: 'Stearic Acid', comedogenicRating: 2, irritationRating: 0, function: 'Acid béo tạo chất kem mềm mượt bảo vệ màng lipid' },
      { inciName: 'Punica Granatum Seed Powder', comedogenicRating: 0, irritationRating: 0, function: 'Bột hạt lựu đỏ tự nhiên chống oxy hóa & làm sáng đều màu da' },
      { inciName: 'Butyrospermum Parkii (Shea) Butter', comedogenicRating: 1, irritationRating: 0, function: 'Bơ hạt mỡ hữu cơ giàu acid béo phục hồi ẩm mềm mịn 1/4 kem dưỡng Dove' },
      { inciName: 'Cocamidopropyl Betaine', comedogenicRating: 0, irritationRating: 0, function: 'Chất hoạt động bề mặt nguồn gốc dầu dừa dịu êm' },
      { inciName: 'Cetearyl Alcohol', comedogenicRating: 2, irritationRating: 0, function: 'Cồn béo dưỡng ẩm làm mềm da không gây khô căng' }
    ]
  },
  {
    id: 'niche-body-012',
    name: 'Muối Tắm Sữa Bò Dưỡng Trắng & Mịn Da Toàn Thân A Bonné Spa Milk Salt 350g',
    brand: 'A Bonné',
    category: 'Chăm sóc cơ thể',
    subCategory: 'Muối tắm thư giãn',
    images: ['/products/niche-body-012.jpg'],
    registrationNumber: 'CBMP-10492/21/CBMP-QLD',
    rating: 4.8,
    soldCount: 31000,
    inStock: true,
    badges: ['Trắng Mịn Tự Nhiên', 'Giá Học Sinh'],
    targetSkinTypes: ['ALL_SKIN_TYPES', 'NORMAL', 'OILY'],
    skinConcerns: ['DULLNESS', 'PORES'],
    keyActiveGroups: ['EXFOLIATION'],
    safetyEthicsBadges: ['PARABEN_FREE'],
    formulationTexture: 'POWDER',
    originCountry: 'THAILAND',
    variants: [
      { sku: 'ABONNE-MILK-SALT-350G', title: 'Túi zip 350g', price: 45000, originalPrice: 55000, onHand: 350 }
    ],
    inciIngredients: [
      { inciName: 'Sodium Chloride', comedogenicRating: 0, irritationRating: 0, function: 'Hạt muối biển tinh khiết sát khuẩn và tẩy sạch tế bào chết' },
      { inciName: 'Hydrolyzed Milk Protein', comedogenicRating: 0, irritationRating: 0, function: 'Protein sữa thủy phân làm trắng sáng và mềm mại da' }
    ]
  },
  {
    id: 'niche-body-013',
    name: 'Lăn Khử Mùi Đặc Trị Mồ Hôi & Ngăn Mùi Tối Ưu Etiaxil Détranspirant Traitement 15ml',
    brand: 'Etiaxil',
    category: 'Chăm sóc cơ thể',
    subCategory: 'Lăn / Xịt khử mùi',
    images: ['/products/niche-body-013.jpg'],
    registrationNumber: 'CBMP-12849/21/CBMP-QLD',
    rating: 4.9,
    soldCount: 19800,
    inStock: true,
    badges: ['Đặc Trị Mồ Hôi', 'Không Vàng Áo'],
    targetSkinTypes: ['ALL_SKIN_TYPES', 'SENSITIVE'],
    skinConcerns: ['DEHYDRATION'],
    keyActiveGroups: ['MINERALS'],
    safetyEthicsBadges: ['FRAGRANCE_FREE', 'PARABEN_FREE'],
    formulationTexture: 'LOTION',
    originCountry: 'FRANCE',
    variants: [
      { sku: 'ETIAXIL-RED-15ML', title: 'Chai 15ml Nhãn Đỏ (Da thường)', price: 215000, originalPrice: 250000, onHand: 210 },
      { sku: 'ETIAXIL-GREEN-15ML', title: 'Chai 15ml Nhãn Xanh (Da nhạy cảm)', price: 215000, originalPrice: 250000, onHand: 180 }
    ],
    inciIngredients: [
      { inciName: 'Alcohol Denat & Aluminum Lactate', comedogenicRating: 0, irritationRating: 0, function: 'Tác động trực tiếp làm se khít tuyến mồ hôi tối ưu 48-72h' }
    ]
  },
  {
    id: 'niche-body-014',
    name: 'Kem Tẩy Lông Chiết Xuất Bơ Cho Da Nhạy Cảm Cléo Avocado Hair Removal Cream 50g',
    brand: 'Cléo',
    category: 'Chăm sóc cơ thể',
    subCategory: 'Triệt lông',
    images: ['/products/niche-body-014.jpg'],
    registrationNumber: 'CBMP-09432/20/CBMP-QLD',
    rating: 4.7,
    soldCount: 16400,
    inStock: true,
    badges: ['Chiết Xuất Bơ', 'Không Đau Rát'],
    targetSkinTypes: ['SENSITIVE', 'NORMAL'],
    skinConcerns: ['PORES'],
    keyActiveGroups: ['SOOTHING_BOTANICAL'],
    safetyEthicsBadges: ['PARABEN_FREE'],
    formulationTexture: 'CREAM_BALM',
    originCountry: 'VIETNAM',
    variants: [
      { sku: 'CLEO-AVOCADO-50G', title: 'Tuýp 50g Dịu Nhẹ', price: 55000, originalPrice: 68000, onHand: 260 }
    ],
    inciIngredients: [
      { inciName: 'Persea Gratissima Oil', comedogenicRating: 0, irritationRating: 0, function: 'Dầu bơ thiên nhiên xoa dịu vùng da sau khi tẩy lông' }
    ]
  },
  {
    id: 'niche-body-015',
    name: 'Kem Dưỡng Gót Chân Nứt Nẻ & Làm Mềm Da Chai Sần Eulactol Heel Balm Gold 60ml',
    brand: 'Eulactol',
    category: 'Chăm sóc cơ thể',
    subCategory: 'Kem dưỡng da tay / chân',
    images: ['/products/niche-body-015.jpg'],
    registrationNumber: 'CBMP-14238/22/CBMP-QLD',
    rating: 4.9,
    soldCount: 7800,
    inStock: true,
    badges: ['Trị Nứt Gót Chân', 'Hiệu Quả 3 Ngày'],
    targetSkinTypes: ['DRY', 'NORMAL'],
    skinConcerns: ['DEHYDRATION', 'BARRIER_REPAIR'],
    keyActiveGroups: ['HYDRATION'],
    safetyEthicsBadges: ['FRAGRANCE_FREE', 'PARABEN_FREE'],
    formulationTexture: 'CREAM_BALM',
    originCountry: 'AUSTRALIA',
    variants: [
      { sku: 'EULACTOL-HEEL-60ML', title: 'Tuýp 60ml', price: 165000, originalPrice: 195000, onHand: 90 }
    ],
    inciIngredients: [
      { inciName: 'Urea 25%', comedogenicRating: 0, irritationRating: 0, function: 'Hoạt chất vàng tiêu sừng làm mềm nhanh các mảng chai nứt gót' }
    ]
  }
];

// =========================================================================
// HELPER: LẤY THÔNG TIN METADATA BỘ LỌC CHO QUERY (SMART SCORING MATCH)
// =========================================================================
export function getSubmenuMetadata(query) {
  if (!query) return null;
  const clean = query.trim().toLowerCase();
  let bestDef = null;
  let bestScore = -1;

  for (const def of SUBMENU_DEFINITIONS) {
    let score = 0;
    const defNameLow = def.name.toLowerCase();
    const slugLow = def.slug.toLowerCase();

    if (clean === slugLow) {
      score = 100;
    } else if (clean === defNameLow) {
      score = 95;
    } else if (def.keywords.map((k) => k.toLowerCase()).includes(clean)) {
      score = 90;
    } else if (clean.includes(defNameLow) || defNameLow.includes(clean)) {
      score = 80;
    } else {
      for (const kw of def.keywords) {
        const kwLow = kw.toLowerCase();
        if (kwLow === clean) {
          score = Math.max(score, 85);
        } else if (kwLow.length >= 4 && clean.includes(kwLow)) {
          score = Math.max(score, 50 + Math.min(kwLow.length * 2, 25));
        } else if (kwLow.length < 4) {
          const regex = new RegExp('(?:^|\\s|[(\\[])' + kwLow + '(?:$|\\s|[)\\]])', 'i');
          if (regex.test(clean)) {
            score = Math.max(score, 40);
          }
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestDef = def;
    }
  }

  return bestScore > 0 ? bestDef : null;
}

// =========================================================================
// HELPER: SUY LUẬN CATEGORY PATH CHUẨN CLIENT-SIDE (NULL-SAFE)
// =========================================================================
export function resolveClientCategoryPath(p) {
  if (Array.isArray(p?.categoryPath) && p.categoryPath.length > 0) {
    return p.categoryPath;
  }
  const name = (p?.name || '').toLowerCase();
  const cat = (p?.category || '').toLowerCase();

  if (cat.includes('body') || cat.includes('cơ thể') || name.includes('sữa tắm') || name.includes('dưỡng thể') || name.includes('body polish')) {
    if (name.includes('tẩy tế bào chết') || name.includes('scrub') || name.includes('polish')) return ['BODY_CARE', 'BODY_SCRUB'];
    if (name.includes('sữa tắm') || name.includes('shower')) return ['BODY_CARE', 'BODY_WASH'];
    return ['BODY_CARE', 'BODY_MOISTURIZER'];
  }
  if (cat.includes('hair') || cat.includes('tóc') || name.includes('dầu gội') || name.includes('dầu xả') || name.includes('da đầu')) {
    if (name.includes('da đầu') || name.includes('scalp')) return ['HAIR_CARE', 'SCALP_TREATMENT'];
    if (name.includes('dầu gội') || name.includes('shampoo')) return ['HAIR_CARE', 'SHAMPOO'];
    return ['HAIR_CARE', 'CONDITIONER'];
  }
  if (cat.includes('nước hoa') || cat.includes('perfume') || name.includes('nước hoa') || name.includes('body mist')) {
    return ['PERFUME', 'WOMEN_PERFUME'];
  }
  if (cat === 'lipstick' || name.includes('son ') || name.includes('son kem') || name.includes('son thỏi') || name.includes('tint')) {
    if (name.includes('son kem') || name.includes('tint')) return ['MAKEUP', 'LIP', 'LIP_TINT'];
    return ['MAKEUP', 'LIP', 'LIPSTICK'];
  }
  if (cat === 'blush' || name.includes('má hồng')) return ['MAKEUP', 'FACE', 'BLUSH'];
  if (cat === 'foundation' || name.includes('kem nền') || name.includes('phấn nước') || name.includes('cushion')) return ['MAKEUP', 'FACE', 'FOUNDATION'];
  if (cat === 'eyeshadow' || name.includes('phấn mắt') || name.includes('mascara')) return ['MAKEUP', 'EYE', 'EYESHADOW'];
  if (cat === 'cleanser' || name.includes('sữa rửa mặt') || name.includes('tẩy trang')) return ['SKINCARE', 'CLEANSER', 'GEL_CLEANSER'];
  if (name.includes('tẩy tế bào chết') || name.includes('bha') || name.includes('aha')) return ['SKINCARE', 'FACE_SCRUB', 'CHEMICAL_PEEL'];
  if (cat === 'toner' || name.includes('toner') || name.includes('nước hoa hồng')) return ['SKINCARE', 'TONER'];
  if (cat === 'serum' || name.includes('serum') || name.includes('tinh chất')) return ['SKINCARE', 'SERUM'];
  if (cat === 'cream' || name.includes('kem dưỡng')) return ['SKINCARE', 'MOISTURIZER'];
  if (cat === 'sunscreen' || name.includes('chống nắng')) return ['SKINCARE', 'SUNSCREEN'];
  return ['SKINCARE', 'GENERAL_SKINCARE'];
}

// =========================================================================
// HELPER: LỌC VÀ LÀM GIÀU DỮ LIỆU SẢN PHẨM KHÔNG BAO GIỜ RỖNG
// =========================================================================
export function getEnrichedCatalog(allProducts = []) {
  // Kết hợp danh sách gốc và danh mục ngách đã làm giàu
  const existingIds = new Set(allProducts.map((p) => p.id));
  const newNiche = CURATED_NICHE_PRODUCTS.filter((p) => !existingIds.has(p.id)).map((p) => {
    if (!p.categoryPath) {
      p.categoryPath = resolveClientCategoryPath(p);
    }
    return p;
  });
  return [...allProducts, ...newNiche];
}

export function searchAndFilterProducts(allProducts = [], query = '', category = '') {
  const merged = getEnrichedCatalog(allProducts);
  const qClean = (query || '').trim().toLowerCase();
  const catClean = (category || '').trim().toLowerCase();

  if (!qClean && !catClean) return merged;

  // 1. Tìm xem query có ứng với Submenu nào không
  const meta = getSubmenuMetadata(qClean || catClean);

  let results = merged.filter((p) => {
    if (!p) return false;
    const pName = (p.name || '').toLowerCase();
    const pBrand = (p.brand || '').toLowerCase();
    const pCat = (p.category || '').toLowerCase();
    const pSubCat = (p.subCategory || '').toLowerCase();
    const pPaths = (p.categoryPath || resolveClientCategoryPath(p)).map((x) => String(x).toLowerCase());

    // Helper lấy tên INCI an toàn
    const getInciText = (i) => {
      if (!i) return '';
      if (typeof i === 'string') return i;
      return i.inciName || i.name || '';
    };

    // Khớp categoryPath trực tiếp (Null-Safe)
    if (catClean && pPaths.some((cp) => cp === catClean || cp.includes(catClean))) {
      return true;
    }
    if (qClean && pPaths.some((cp) => cp === qClean || cp.includes(qClean))) {
      return true;
    }

    // Nếu có meta keywords, kiểm tra khớp từ khóa
    if (meta) {
      const matchKeyword = meta.keywords.some((kw) => {
        const kwLow = (kw || '').toLowerCase();
        return (
          pPaths.some((cp) => cp.includes(kwLow)) ||
          pSubCat.includes(kwLow) ||
          pName.includes(kwLow) ||
          pCat.includes(kwLow) ||
          (p.inciIngredients && p.inciIngredients.some((i) => getInciText(i).toLowerCase().includes(kwLow)))
        );
      });
      if (matchKeyword) {
        // Cách ly phân hệ chéo: Chăm sóc cơ thể / Tóc không bị lẫn mặt / môi
        if (meta.parent && meta.parent.toLowerCase().includes('cơ thể')) {
          if (pPaths.includes('skincare') || pPaths.includes('lip') || pCat.includes('mặt') || pCat === 'Lipstick' || pCat === 'Skincare') {
            return false;
          }
        }
        if (meta.parent && (meta.parent.toLowerCase().includes('tóc') || meta.parent.toLowerCase().includes('da đầu'))) {
          if (pPaths.includes('skincare') || pPaths.includes('lip')) {
            return false;
          }
        }
        return true;
      }
    }

    // Khớp thông thường
    if (qClean) {
      if (pPaths.some((cp) => cp.includes(qClean)) || pSubCat.includes(qClean) || pName.includes(qClean) || pBrand.includes(qClean) || pCat.includes(qClean)) {
        return true;
      }
      if (p.inciIngredients && p.inciIngredients.some((i) => getInciText(i).toLowerCase().includes(qClean))) {
        return true;
      }
    }

    if (catClean) {
      if (pPaths.some((cp) => cp.includes(catClean)) || pCat.includes(catClean) || pSubCat.includes(catClean)) return true;
    }

    return false;
  });

  // BẢO ĐẢM ZERO-BLANK: Tự động bổ sung sản phẩm tương đồng cùng danh mục cha để không bao giờ bị rỗng
  const PARENT_CATEGORY_MAP = {
    'chăm sóc da mặt': ['skincare', 'cleanser', 'serum', 'cream', 'da mặt', 'chăm sóc da mặt'],
    'trang điểm': ['makeup', 'trang điểm', 'lipstick', 'blush', 'foundation', 'eyeshadow', 'son', 'phấn', 'mắt', 'môi'],
    'chăm sóc cơ thể': ['body', 'bodycare', 'chăm sóc cơ thể', 'dưỡng thể', 'triệt lông'],
    'chăm sóc tóc & da đầu': ['hair', 'haircare', 'chăm sóc tóc', 'gội', 'xả', 'ủ tóc'],
    'nước hoa': ['fragrance', 'perfume', 'nước hoa'],
    'thực phẩm chức năng': ['supplement', 'thực phẩm chức năng', 'collagen', 'vitamin'],
    'phụ kiện làm đẹp': ['tool', 'device', 'dụng cụ', 'phụ kiện', 'máy']
  };

  if (results.length < 6) {
    const parentKey = meta ? meta.parent.toLowerCase() : (catClean || 'chăm sóc da mặt');
    const relatedTokens = PARENT_CATEGORY_MAP[parentKey] || [parentKey];

    const filler = merged.filter((p) => {
      if (results.some((r) => r.id === p.id)) return false;
      const pCat = (p.category || '').toLowerCase();
      const pSubCat = (p.subCategory || '').toLowerCase();
      const pName = (p.name || '').toLowerCase();
      return relatedTokens.some((tok) => pCat.includes(tok) || pSubCat.includes(tok) || pName.includes(tok));
    });

    results = [...results, ...filler];
  }

  // Nếu vẫn dưới 6 sản phẩm (trường hợp cực hiếm), tự động đệm các sản phẩm nổi bật nhất
  if (results.length < 6) {
    const generalFiller = merged.filter((p) => !results.some((r) => r.id === p.id)).slice(0, 6 - results.length);
    results = [...results, ...generalFiller];
  }

  return results.slice(0, 24);
}
