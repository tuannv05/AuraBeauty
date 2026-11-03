import React, { useState } from 'react';
import {
  Store, ShieldCheck, Heart, MessageSquare, Star, Award, CheckCircle2,
  Ticket, ArrowLeft, Search, Filter, ShoppingBag, Sparkles, Check, Share2
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../api';

export default function BrandStoreView({
  brandName = 'Innisfree',
  shopId = 'shop-001',
  onBack,
  onSelectProduct,
  onAddToCart,
  onOpenChat,
  onAddToast
}) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(48200);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [savedVouchers, setSavedVouchers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Shop Vouchers
  const shopVouchers = [
    { code: 'INNI20K', title: 'Giảm 20.000đ', minOrder: 299000, desc: 'Đơn từ 299k' },
    { code: 'INNI50K', title: 'Giảm 50.000đ', minOrder: 599000, desc: 'Đơn từ 599k' },
    { code: 'INNIFREESHIP', title: 'Freeship 100%', minOrder: 199000, desc: 'Miễn phí vận chuyển' }
  ];

  // Brand Info
  const brandProfiles = {
    'Innisfree': {
      name: 'Innisfree Official Store',
      tagline: 'Mỹ phẩm thiên nhiên tinh khiết từ hòn đảo ngọc Jeju Hàn Quốc',
      rating: 4.9,
      reviewsCount: '124.5k',
      responseRate: '99% (trong vài phút)',
      founded: 'Hàn Quốc - Thành lập 2000',
      license: 'Số GPKD: 0312891920 do Sở KH&ĐT cấp',
      cert: 'Giấy chứng nhận phân phối độc quyền chính hãng Amorepacific',
      banner: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop&q=80',
      logo: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=150&auto=format&fit=crop&q=80'
    },
    'Cosrx': {
      name: 'Cosrx Vietnam Official Mall',
      tagline: 'Chăm sóc da khoa học chuyên sâu cho da mụn và nhạy cảm',
      rating: 4.9,
      reviewsCount: '89.2k',
      responseRate: '98%',
      founded: 'Hàn Quốc - Đạt chuẩn Dược mỹ phẩm',
      license: 'Số GPKD: 0314567891 do Sở KH&ĐT cấp',
      cert: 'Chứng nhận ủy quyền phân phối chính thức COSRX Korea',
      banner: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&auto=format&fit=crop&q=80',
      logo: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=150&auto=format&fit=crop&q=80'
    },
    'Anua': {
      name: 'Anua Official Heartleaf Store',
      tagline: 'Chiết xuất diếp cá làm dịu da đỉnh cao Hàn Quốc',
      rating: 4.8,
      reviewsCount: '62.4k',
      responseRate: '100%',
      founded: 'Hàn Quốc - Xu hướng Skincare 2024',
      license: 'Số GPKD: 0319876543 do Sở KH&ĐT cấp',
      cert: 'Chứng nhận phân phối chính hãng Anua Official',
      banner: 'https://images.unsplash.com/photo-1608248597359-2e65c58971f1?w=1200&auto=format&fit=crop&q=80',
      logo: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=150&auto=format&fit=crop&q=80'
    },
    "Paula's Choice": {
      name: "Paula's Choice Official Mall",
      tagline: 'Khoa học chăm sóc da chân thực - Không cồn, không hương liệu',
      rating: 4.95,
      reviewsCount: '158.0k',
      responseRate: '99%',
      founded: 'Mỹ - Nghiên cứu da liễu Hoa Kỳ từ 1995',
      license: 'Số GPKD: 0106721999 do Sở KH&ĐT cấp',
      cert: 'Chứng nhận độc quyền phân phối chính hãng Paula\'s Choice USA tại VN',
      banner: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&auto=format&fit=crop&q=80',
      logo: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=150&auto=format&fit=crop&q=80'
    },
    'Klairs': {
      name: 'Dear, Klairs Official Store',
      tagline: 'Simple but Enough - Dịu lành cho làn da nhạy cảm nhất',
      rating: 4.9,
      reviewsCount: '94.1k',
      responseRate: '98%',
      founded: 'Hàn Quốc - Thuần chay & Không thử nghiệm trên động vật',
      license: 'Số GPKD: 0315891234 do Sở KH&ĐT cấp',
      cert: 'Chứng nhận phân phối ủy quyền Dear Klairs Wishcompany',
      banner: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=1200&auto=format&fit=crop&q=80',
      logo: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=150&auto=format&fit=crop&q=80'
    },
    'Some By Mi': {
      name: 'Some By Mi Flagship Store',
      tagline: 'Phép màu cải thiện làn da mụn khuyết điểm sau 30 ngày',
      rating: 4.8,
      reviewsCount: '112.3k',
      responseRate: '97%',
      founded: 'Hàn Quốc - Chuyên gia giải cứu làn da mụn',
      license: 'Số GPKD: 0314488991 do Sở KH&ĐT cấp',
      cert: 'Chứng nhận phân phối chính thức Some By Mi Global',
      banner: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop&q=80',
      logo: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=150&auto=format&fit=crop&q=80'
    },
    'Beauty of Joseon': {
      name: 'Beauty of Joseon Official Mall',
      tagline: 'Tinh hoa thảo dược Hanbang hoàng cung kết hợp công nghệ hiện đại',
      rating: 4.9,
      reviewsCount: '78.6k',
      responseRate: '99%',
      founded: 'Hàn Quốc - Tinh hoa dưỡng da truyền thống',
      license: 'Số GPKD: 0317892345 do Sở KH&ĐT cấp',
      cert: 'Chứng nhận ủy quyền độc quyền Goodai Global Inc',
      banner: 'https://images.unsplash.com/photo-1512290900672-1f48740c21fe?w=1200&auto=format&fit=crop&q=80',
      logo: 'https://images.unsplash.com/photo-1608248597359-2e65c58971f1?w=150&auto=format&fit=crop&q=80'
    },
    'CeraVe': {
      name: 'CeraVe Skincare Official Mall',
      tagline: 'Phục hồi & bảo vệ hàng rào da tự nhiên với 3 Ceramides thiết yếu',
      rating: 4.9,
      reviewsCount: '210.4k',
      responseRate: '99%',
      founded: 'Hoa Kỳ - Được các bác sĩ da liễu khuyên dùng số 1',
      license: 'Số GPKD: 0102345678 do Sở KH&ĐT cấp',
      cert: 'Chứng nhận phân phối chính thức L\'Oréal Vietnam',
      banner: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&auto=format&fit=crop&q=80',
      logo: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=150&auto=format&fit=crop&q=80'
    },
    'La Roche-Posay': {
      name: 'La Roche-Posay Laboratoire Dermatologique',
      tagline: 'Dược mỹ phẩm hàng đầu được hơn 90.000 chuyên gia da liễu toàn cầu khuyên dùng',
      rating: 4.95,
      reviewsCount: '340.2k',
      responseRate: '100%',
      founded: 'Pháp - Nước khoáng nhiệt làm dịu da',
      license: 'Số GPKD: 0102345678 do Sở KH&ĐT cấp',
      cert: 'Chứng nhận phân phối chính hãng L\'Oréal Dược Mỹ Phẩm',
      banner: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=1200&auto=format&fit=crop&q=80',
      logo: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=150&auto=format&fit=crop&q=80'
    }
  };

  const currentBrand = brandProfiles[brandName] || {
    name: `${brandName} Official Store`,
    tagline: `Gian hàng chính hãng ${brandName} được chứng nhận bởi Aura Beauty Mall`,
    rating: 4.9,
    reviewsCount: '50.0k',
    responseRate: '99%',
    founded: 'Chính hãng',
    license: 'Giấy chứng nhận đại lý ủy quyền',
    cert: 'Cam kết 100% hàng chính ngạch, xuất VAT đầy đủ',
    banner: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop&q=80',
    logo: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=150&auto=format&fit=crop&q=80'
  };

  // Filter products by brand
  const brandProducts = MOCK_PRODUCTS.filter(
    (p) => p.brand.toLowerCase() === brandName.toLowerCase()
  );
  const productsToUse = brandProducts.length > 0 ? brandProducts : MOCK_PRODUCTS.slice(0, 4);

  const displayedProducts = productsToUse.filter((p) => {
    if (searchQuery.trim() && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (activeCategory === 'SERUM' && !p.name.toLowerCase().includes('serum')) return false;
    if (activeCategory === 'CLEANSER' && !p.name.toLowerCase().includes('rửa mặt')) return false;
    if (activeCategory === 'CREAM' && !p.name.toLowerCase().includes('kem')) return false;
    return true;
  });

  const handleToggleFollow = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowersCount((prev) => prev - 1);
      onAddToast({ type: 'info', message: `Đã hủy theo dõi ${currentBrand.name}` });
    } else {
      setIsFollowing(true);
      setFollowersCount((prev) => prev + 1);
      onAddToast({ type: 'success', message: `Đã theo dõi ${currentBrand.name}! Bạn sẽ nhận được thông báo khi Shop có ưu đãi mới.` });
    }
  };

  const handleSaveVoucher = (code) => {
    if (!savedVouchers.includes(code)) {
      setSavedVouchers([...savedVouchers, code]);
      onAddToast({ type: 'success', message: `Đã lưu mã giảm giá ${code} vào ví voucher của bạn!` });
    }
  };

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          fontSize: '13px',
          fontWeight: 650,
          color: '#64748b',
          cursor: 'pointer',
          padding: '10px 0',
          marginBottom: '12px'
        }}
      >
        <ArrowLeft size={16} /> Quay lại danh mục mua sắm
      </button>

      {/* Brand Store Hero Banner */}
      <div
        style={{
          borderRadius: '16px',
          overflow: 'hidden',
          background: '#0f172a',
          color: '#ffffff',
          position: 'relative',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}
      >
        {/* Cover Image */}
        <div style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
          <img
            src={currentBrand.banner}
            alt="Cover"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.95) 100%)'
            }}
          />
        </div>

        {/* Brand Details Bar */}
        <div style={{ padding: '0 28px 24px 28px', marginTop: '-50px', position: 'relative' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '16px',
                  border: '3px solid #ffffff',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                  overflow: 'hidden',
                  background: '#ffffff'
                }}
              >
                <img src={currentBrand.logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                    {currentBrand.name}
                  </h1>
                  <span
                    style={{
                      background: '#ec4899',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <ShieldCheck size={13} /> OFFICIAL MALL
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#cbd5e1', margin: '4px 0 8px 0' }}>
                  {currentBrand.tagline}
                </p>
                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#94a3b8' }}>
                  <span>⭐ <strong style={{ color: '#ffffff' }}>{currentBrand.rating}</strong> ({currentBrand.reviewsCount} đánh giá)</span>
                  <span>👥 <strong style={{ color: '#ffffff' }}>{followersCount.toLocaleString()}</strong> người theo dõi</span>
                  <span>⚡ Phản hồi: <strong style={{ color: '#ffffff' }}>{currentBrand.responseRate}</strong></span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleToggleFollow}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: isFollowing ? '1px solid #94a3b8' : 'none',
                  background: isFollowing ? 'rgba(255,255,255,0.1)' : '#ec4899',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
              >
                {isFollowing ? <Check size={16} /> : <Heart size={16} />}
                <span>{isFollowing ? 'Đang theo dõi' : '+ Theo dõi'}</span>
              </button>

              <button
                onClick={onOpenChat}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.25)',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <MessageSquare size={16} style={{ color: '#38bdf8' }} />
                <span>Chat ngay</span>
              </button>
            </div>
          </div>

          {/* Legal Compliance & Trust Banner */}
          <div
            style={{
              marginTop: '18px',
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: '#cbd5e1',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={16} style={{ color: '#fbbf24' }} />
              <span>{currentBrand.cert}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} style={{ color: '#34d399' }} />
              <span>{currentBrand.license}</span>
            </div>
            <div style={{ color: '#f472b6', fontWeight: 650 }}>
              ✓ Cam kết 100% chính hãng - Đền bù 200% nếu phát hiện hàng giả
            </div>
          </div>
        </div>
      </div>

      {/* Shop Vouchers Section */}
      <div style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 750, color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Ticket size={18} style={{ color: '#ec4899' }} /> Mã Giảm Giá Độc Quyền Của Gian Hàng
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          {shopVouchers.map((v) => {
            const isSaved = savedVouchers.includes(v.code);
            return (
              <div
                key={v.code}
                style={{
                  background: '#ffffff',
                  border: '1.5px dashed #f472b6',
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#be185d', background: '#fdf2f8', padding: '2px 6px', borderRadius: '4px' }}>
                    {v.code}
                  </span>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '4px 0 2px 0', color: '#0f172a' }}>
                    {v.title}
                  </h4>
                  <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>{v.desc}</p>
                </div>
                <button
                  onClick={() => handleSaveVoucher(v.code)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isSaved ? '#f1f5f9' : '#ec4899',
                    color: isSaved ? '#64748b' : '#ffffff',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: isSaved ? 'default' : 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {isSaved ? 'Đã lưu' : 'Lưu mã'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Tabs & Search within shop */}
      <div
        style={{
          marginTop: '28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '12px'
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'Tất Cả Sản Phẩm' },
            { id: 'SERUM', label: 'Serum / Tinh chất' },
            { id: 'CREAM', label: 'Kem dưỡng ẩm' },
            { id: 'CLEANSER', label: 'Sữa rửa mặt' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeCategory === cat.id ? '#0f172a' : '#f1f5f9',
                color: activeCategory === cat.id ? '#ffffff' : '#475569',
                fontSize: '13px',
                fontWeight: 650,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search within shop */}
        <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0 10px', width: '240px' }}>
          <Search size={15} style={{ color: '#94a3b8', marginRight: '6px' }} />
          <input
            type="text"
            placeholder="Tìm trong shop này..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', padding: '8px 0', fontSize: '12px', width: '100%' }}
          />
        </div>
      </div>

      {/* Products Grid */}
      <div style={{ marginTop: '20px' }}>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '14px' }}>
          Hiển thị <strong>{displayedProducts.length}</strong> sản phẩm chính hãng của <strong>{currentBrand.name}</strong>
        </p>

        {displayedProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', background: '#f8fafc', borderRadius: '12px' }}>
            <p style={{ fontSize: '14px', color: '#64748b' }}>Không tìm thấy sản phẩm phù hợp trong gian hàng.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {displayedProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => onSelectProduct(prod)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ height: '200px', background: '#f8fafc', position: 'relative' }}>
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      background: '#ec4899',
                      color: '#ffffff',
                      fontSize: '10px',
                      fontWeight: 750,
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}
                  >
                    Mall Chính Hãng
                  </span>
                </div>

                <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4
                      style={{
                        fontSize: '13px',
                        fontWeight: 650,
                        color: '#0f172a',
                        margin: '0 0 6px 0',
                        lineHeight: 1.35,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {prod.name}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#f59e0b', marginBottom: '8px' }}>
                      <Star size={12} fill="#f59e0b" />
                      <span>{prod.rating}</span>
                      <span style={{ color: '#94a3b8' }}>({prod.reviewCount})</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                    <div>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#ec4899' }}>
                        {prod.variants[0].price.toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(prod, prod.variants[0]);
                      }}
                      style={{
                        background: '#fdf2f8',
                        color: '#db2777',
                        border: '1px solid #fbcfe8',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <ShoppingBag size={12} /> Thêm
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
