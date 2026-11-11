import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tag, Zap, Gift, Video, Users, TrendingUp, DollarSign, Plus, Check,
  Clock, Sparkles, Megaphone, Share2, BarChart2, CheckCircle2, X, AlertCircle
} from 'lucide-react';
import { crossZoneSync } from '../../lib/crossZoneSync';
import { NumberTicker, AnimatedBadge, SpringButton } from '../../components/ui';

export function MarketingViews({ subTab = 'center', currentShop, onAddToast, onNavigateSubTab }) {
  const [marketingData, setMarketingData] = useState(() => crossZoneSync.getMarketing());
  const [newVoucherCode, setNewVoucherCode] = useState('');
  const [newVoucherValue, setNewVoucherValue] = useState('20000');
  const [newVoucherMinSpend, setNewVoucherMinSpend] = useState('250000');
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  // Sync with cross-zone
  React.useEffect(() => {
    return crossZoneSync.subscribe(() => {
      setMarketingData(crossZoneSync.getMarketing());
    });
  }, []);

  const handleCreateVoucher = (e) => {
    e.preventDefault();
    if (!newVoucherCode.trim()) {
      onAddToast?.({ type: 'error', message: 'Vui lòng nhập Mã voucher!' });
      return;
    }
    const voucher = {
      code: newVoucherCode.toUpperCase(),
      title: `Giảm ${Number(newVoucherValue).toLocaleString('vi-VN')}₫ cho đơn từ ${Number(newVoucherMinSpend).toLocaleString('vi-VN')}₫`,
      discountType: 'FIXED',
      discountValue: Number(newVoucherValue),
      minSpend: Number(newVoucherMinSpend),
      usageLimit: 500,
      usedCount: 0,
      startDate: 'Hôm nay',
      endDate: 'Cuối tháng',
      status: 'ACTIVE'
    };
    crossZoneSync.addVoucher(voucher);
    setShowVoucherModal(false);
    setNewVoucherCode('');
    onAddToast?.({
      type: 'success',
      message: `Đã tạo mã Voucher [${voucher.code}] thành công! Mã đã sẵn sàng áp dụng trong Giỏ hàng Buyer Zone.`
    });
  };

  // =========================================================================
  // SUBTAB: marketing/center (KÊNH MARKETING TỔNG QUAN)
  // =========================================================================
  if (subTab === 'center') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Megaphone className="text-pink-600" size={24} />
              Kênh Marketing &amp; Tăng Trưởng Doanh Số
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Trung tâm kích cầu toàn diện: Tạo mã giảm giá, chạy đấu thầu từ khóa và liên kết tiếp thị KOL.
            </p>
          </div>
          <button
            onClick={() => onNavigateSubTab?.('vouchers')}
            className="px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl shadow-sm hover:opacity-95 transition"
          >
            + Tạo Khuyến Mãi Mới
          </button>
        </div>

        {/* 4 Công cụ cốt lõi */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: 'vouchers', title: 'Mã Giảm Giá Shop', desc: 'Thu hút khách thêm sản phẩm vào giỏ hàng', count: `${marketingData.vouchers.length} đang chạy`, icon: Tag, color: 'text-pink-600', bg: 'bg-pink-50' },
            { id: 'flash-sale', title: 'Flash Sale Shop', desc: 'Tạo khung giờ vàng giảm giá chớp nhoáng', count: '1 khung giờ', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
            { id: 'display-ads', title: 'Quảng Cáo Tìm Kiếm', desc: 'Đấu thầu từ khóa xuất hiện trang nhất', count: 'ROAS 13.4x', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
            { id: 'kol-affiliate', title: 'KOL Tiếp Thị', desc: 'Hợp tác reviewer & beauty blogger', count: '12 KOLs kết nối', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' }
          ].map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.id}
                onClick={() => onNavigateSubTab?.(c.id)}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-pink-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.color} flex items-center justify-center mb-3`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{c.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{c.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-pink-600">
                  <span>{c.count}</span>
                  <span>Cài đặt →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUBTAB: marketing/vouchers (MÃ GIẢM GIÁ CỦA SHOP)
  // =========================================================================
  if (subTab === 'vouchers') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Tag className="text-pink-600" size={24} />
              Mã Giảm Giá Của Shop ({marketingData.vouchers.length})
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Voucher áp dụng cho đơn hàng con của Shop trong luồng tách đơn Split Order của Buyer.
            </p>
          </div>
          <button
            onClick={() => setShowVoucherModal(true)}
            className="px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl shadow-sm hover:opacity-95 transition flex items-center gap-1.5"
          >
            <Plus size={16} /> + Tạo Voucher Mới
          </button>
        </div>

        {/* Voucher List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {marketingData.vouchers.map((v) => (
            <div key={v.code} className="bg-white p-5 rounded-2xl border border-pink-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <span className="font-mono text-sm font-extrabold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-lg border border-pink-200">
                    {v.code}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${v.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                    {v.status === 'ACTIVE' ? 'Đang áp dụng' : 'Tạm dừng'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-2">{v.title}</h3>
                <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                  <div>Đơn tối thiểu: <strong>{v.minSpend.toLocaleString('vi-VN')}₫</strong></div>
                  <div>Thời gian: {v.startDate} - {v.endDate}</div>
                  <div>Đã dùng: <strong>{v.usedCount} / {v.usageLimit}</strong> lượt</div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  onClick={() => {
                    crossZoneSync.toggleVoucher(v.code);
                    onAddToast?.({ type: 'info', message: `Đã thay đổi trạng thái mã ${v.code}` });
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                >
                  {v.status === 'ACTIVE' ? 'Tạm dừng' : 'Kích hoạt lại'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Tạo Voucher Mới */}
        <AnimatePresence>
          {showVoucherModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Tag className="text-pink-600" size={18} />
                    Tạo Mã Giảm Giá Shop Mới
                  </h3>
                  <button onClick={() => setShowVoucherModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleCreateVoucher} className="my-4 space-y-3.5 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Mã Voucher (viết hoa liền không dấu)</label>
                    <input
                      type="text"
                      required
                      placeholder="VD: BEAUTY20K, AURA15"
                      value={newVoucherCode}
                      onChange={(e) => setNewVoucherCode(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Số tiền giảm (VND)</label>
                    <input
                      type="number"
                      required
                      placeholder="20000"
                      value={newVoucherValue}
                      onChange={(e) => setNewVoucherValue(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Giá trị đơn hàng tối thiểu (VND)</label>
                    <input
                      type="number"
                      required
                      placeholder="250000"
                      value={newVoucherMinSpend}
                      onChange={(e) => setNewVoucherMinSpend(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setShowVoucherModal(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-bold text-white bg-pink-600 hover:bg-pink-700 rounded-lg shadow-sm"
                    >
                      Lưu &amp; Kích Hoạt Voucher
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // =========================================================================
  // SUBTAB: marketing/display-ads (DỊCH VỤ HIỂN THỊ AURA ADS)
  // =========================================================================
  if (subTab === 'display-ads') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={24} />
              Quảng Cáo Tìm Kiếm &amp; Dịch Vụ Hiển Thị
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Đấu thầu từ khóa CPC để đưa sản phẩm lên đầu trang tìm kiếm và dải Banner khuyến mãi Buyer Zone.
            </p>
          </div>
          <button
            onClick={() => onAddToast?.({ type: 'info', message: 'Tạo chiến dịch đấu thầu từ khóa mới...' })}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition"
          >
            + Tạo Chiến Dịch Mới
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500">Lượt Click</span>
            <div className="text-xl font-bold text-slate-900 mt-1">430 clicks</div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500">Chi phí tiêu (Spent)</span>
            <div className="text-xl font-bold text-slate-900 mt-1">924.500₫</div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500">Doanh thu tạo ra (GMV)</span>
            <div className="text-xl font-bold text-emerald-600 mt-1">12.400.000₫</div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500">Hiệu suất ROAS</span>
            <div className="text-xl font-bold text-pink-600 mt-1">13.4x</div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUBTAB: marketing/flash-sale (FLASH SALE CỦA SHOP)
  // =========================================================================
  if (subTab === 'flash-sale') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Zap className="text-amber-500" size={24} />
              Flash Sale Của Shop
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Tạo khung giờ giảm giá sốc với số lượng tồn kho giới hạn (giữ kho CAS tự động).
            </p>
          </div>
          <button
            onClick={() => onAddToast?.({ type: 'info', message: 'Tạo khung giờ Flash Sale mới...' })}
            className="px-4 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-sm transition"
          >
            + Đăng Ký Khung Giờ Mới
          </button>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                ⚡ Khung giờ: 12:00 - 14:00 Hôm nay
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-2">
                Innisfree Green Tea Seed Hyaluronic Serum 80ml
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs line-through text-slate-400">620.000₫</span>
              <div className="text-base font-extrabold text-rose-600">520.000₫</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Phân bổ tồn kho CAS: 50 chai</span>
            <strong className="text-emerald-600">Đã bán 38 chai (76%)</strong>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUBTAB: Các sub-tab khác (bidding, off-platform-ads, kol-affiliate, live-video, discounts, shopee-campaigns)
  // =========================================================================
  const subMeta = {
    'bidding': { title: 'Đấu Giá Rẻ Vô Địch', desc: 'Đăng ký SKU tham gia chiến dịch giá tốt nhất sàn để nhận diện nhãn Rẻ Vô Địch.' },
    'off-platform-ads': { title: 'Quảng Cáo Ngoại Sàn (Meta & TikTok)', desc: 'Tạo link theo dõi chuyển đổi UTM để tối ưu chi phí chạy ads Facebook & TikTok.' },
    'kol-affiliate': { title: 'Tăng Đơn Cùng KOL / KOC', desc: 'Thiết lập tỷ lệ hoa hồng tiếp thị liên kết từ 5% - 15% cho reviewer làm đẹp.' },
    'live-video': { title: 'Livestream Thử Màu & Video Ngắn', desc: 'Quản lý phòng Live tư vấn da trực tiếp và gắn sản phẩm vào video ngắn Aura Video.' },
    'discounts': { title: 'Khuyến Mãi Của Shop & Mua Kèm Deal Sốc', desc: 'Thiết lập combo chu trình dưỡng da 28 ngày giảm thêm 10% khi mua kèm.' },
    'shopee-campaigns': { title: 'Chương Trình Đại Tiệc Sàn Aura', desc: 'Đăng ký sản phẩm tham gia các chiến dịch Siêu Sale 11.11, Lương Về của Aura Mall.' }
  };

  const meta = subMeta[subTab] || { title: 'Kênh Marketing', desc: 'Quản lý chiến dịch tiếp thị gian hàng.' };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Gift className="text-pink-600" size={24} />
            {meta.title}
          </h2>
          <p className="text-xs text-slate-500 mt-1">{meta.desc}</p>
        </div>
        <button
          onClick={() => onAddToast?.({ type: 'success', message: `Đã kích hoạt chương trình ${meta.title}!` })}
          className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition"
        >
          Tham Gia Ngay
        </button>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500 space-y-2">
        <CheckCircle2 className="mx-auto text-pink-600" size={32} />
        <h4 className="font-bold text-slate-800">Tính năng đã sẵn sàng trên Kênh Người Bán</h4>
        <p className="max-w-md mx-auto">
          Gian hàng Official Mall của bạn đủ điều kiện tham gia với hạn mức ưu đãi và phí sàn hỗ trợ tối đa 10%.
        </p>
      </div>
    </div>
  );
}
