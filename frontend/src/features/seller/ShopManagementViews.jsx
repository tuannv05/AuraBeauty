import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Store, Palette, Settings, ShieldAlert, Award, Upload, Check, CheckCircle2,
  AlertCircle, Moon, Sun, Bell, MapPin, Phone, Building, ArrowRight, Gift
} from 'lucide-react';
import { crossZoneSync } from '../../lib/crossZoneSync';
import { NumberTicker, AnimatedBadge, SpringButton } from '../../components/ui';

export function ShopManagementViews({ subTab = 'profile', currentShop, onAddToast, onNavigateSubTab }) {
  const [shopSettings, setShopSettings] = useState(() => crossZoneSync.getShopSettings(currentShop?.id));
  const [vacationMode, setVacationMode] = useState(shopSettings.vacationMode || false);

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    shopName: currentShop?.name || 'Innisfree Official Store Vietnam',
    brand: currentShop?.brand || 'Innisfree',
    cbmpLicense: currentShop?.cbmpLicense || '19820/24/CBMP-QLD',
    address: currentShop?.address || 'Kho Tổng KCN Tân Bình, TP. Hồ Chí Minh',
    hotline: currentShop?.hotline || '1900 6868',
    bio: 'Thương hiệu mỹ phẩm thiên nhiên từ đảo ngọc Jeju Hàn Quốc. Phân phối chính hãng 100% trên Aura Beauty Mall.'
  });

  const handleToggleVacation = (e) => {
    const nextVal = e.target.checked;
    setVacationMode(nextVal);
    crossZoneSync.updateShopSettings(currentShop?.id, { vacationMode: nextVal });
    onAddToast?.({
      type: nextVal ? 'warning' : 'success',
      message: nextVal
        ? 'Đã bật Chế độ Tạm nghỉ! Nút Mua hàng của Shop trên Buyer Zone đã được khóa tạm thời.'
        : 'Đã tắt Chế độ Tạm nghỉ! Gian hàng đã mở lại bình thường cho khách mua sắm.'
    });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    onAddToast?.({ type: 'success', message: 'Đã cập nhật Hồ Sơ Gian Hàng & Gửi yêu cầu tái chứng nhận Official Mall!' });
  };

  // =========================================================================
  // SUBTAB: shop/profile (HỒ SƠ SHOP & OFFICIAL MALL)
  // =========================================================================
  if (subTab === 'profile') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Store className="text-pink-600" size={24} />
              Hồ Sơ Gian Hàng &amp; Chứng Nhận Official Mall
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Quản lý thông tin pháp lý doanh nghiệp, giấy chứng nhận phân phối độc quyền và số CBMP.
            </p>
          </div>
          <span className="px-3 py-1.5 rounded-full text-xs font-extrabold bg-pink-100 text-pink-700 border border-pink-200 flex items-center gap-1.5">
            ★ OFFICIAL MALL ĐÃ XÁC THỰC
          </span>
        </div>

        <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Tên Gian Hàng</label>
              <input
                type="text"
                value={profileForm.shopName}
                onChange={(e) => setProfileForm({ ...profileForm, shopName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Thương Hiệu Đại Diện</label>
              <input
                type="text"
                value={profileForm.brand}
                onChange={(e) => setProfileForm({ ...profileForm, brand: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-pink-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Số CBMP Đại Diện</label>
              <input
                type="text"
                value={profileForm.cbmpLicense}
                onChange={(e) => setProfileForm({ ...profileForm, cbmpLicense: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Hotline CSKH</label>
              <input
                type="text"
                value={profileForm.hotline}
                onChange={(e) => setProfileForm({ ...profileForm, hotline: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Địa Chỉ Kho Trụ Sở</label>
            <input
              type="text"
              value={profileForm.address}
              onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-300"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Mô Tả Giới Thiệu Gian Hàng</label>
            <textarea
              rows={3}
              value={profileForm.bio}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-300"
            />
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition"
            >
              Lưu Hồ Sơ Shop
            </button>
          </div>
        </form>
      </div>
    );
  }

  // =========================================================================
  // SUBTAB: shop/decoration (TRANG TRÍ SHOP)
  // =========================================================================
  if (subTab === 'decoration') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Palette className="text-pink-600" size={24} />
              Trang Trí Gian Hàng Trực Quan
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Thiết kế giao diện storefront: Đổi Banner sự kiện, bố cục kệ sản phẩm nổi bật &amp; góc thử màu AR.
            </p>
          </div>
          <button
            onClick={() => onAddToast?.({ type: 'success', message: 'Đã xuất bản giao diện gian hàng mới lên Buyer Zone!' })}
            className="px-4 py-2 text-xs font-bold text-white bg-pink-600 hover:bg-pink-700 rounded-xl shadow-sm transition"
          >
            Xuất Bản Giao Diện
          </button>
        </div>

        <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm text-center text-xs text-slate-500 space-y-3">
          <Palette className="mx-auto text-pink-600" size={32} />
          <h4 className="font-bold text-slate-800 text-sm">Trình Kéo Thả Kệ Hàng (Storefront Visual Builder)</h4>
          <p className="max-w-md mx-auto">
            Hỗ trợ 3 mẫu layout chuẩn Aura Mall: Layout Banner Carousel, Kệ Sản Phẩm Bán Chạy &amp; Widget Gương Thử Son 3D.
          </p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUBTAB: shop/settings (THIẾT LẬP SHOP & CHẾ ĐỘ TẠM NGHỈ)
  // =========================================================================
  if (subTab === 'settings') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="text-pink-600" size={24} />
            Thiết Lập Shop &amp; Chế Độ Tạm Nghỉ (Vacation Mode)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý trạng thái hoạt động của gian hàng và thông báo tự động khi nhân sự nghỉ lễ.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-xs">
          {/* Vacation Mode Toggle */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 flex items-center justify-between">
            <div className="space-y-1">
              <strong className="text-sm font-bold text-amber-900 flex items-center gap-2">
                <Moon size={16} /> Chế Độ Tạm Nghỉ (Vacation Mode)
              </strong>
              <p className="text-amber-800 max-w-lg">
                Khi bật chế độ này, toàn bộ sản phẩm của Shop sẽ bị vô hiệu hóa nút "Mua Ngay" và "Thêm Vào Giỏ" trên Buyer Zone. Khách vẫn có thể xem thông tin và thử son AR.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={vacationMode}
                onChange={handleToggleVacation}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
            </label>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Cài Đặt Thông Báo &amp; Đơn Hàng</h4>
            {[
              { title: 'Nhận thông báo khi có đơn hàng mới (SSE / Webhook)', desc: 'Gửi chuông thông báo âm thanh và pop-up tức thì khi khách đặt hàng.', checked: true },
              { title: 'Cảnh báo khi tồn kho CAS chạm ngưỡng an toàn (< 10 sản phẩm)', desc: 'Hạn chế tình trạng đứt hàng các sản phẩm bán chạy.', checked: true },
              { title: 'Tự động phản hồi tin nhắn khách hàng (Auto-reply CSKH)', desc: 'Duy trì tỷ lệ phản hồi 98% chuẩn Aura Official Mall.', checked: true }
            ].map((s, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">{s.title}</div>
                  <div className="text-slate-500 mt-0.5">{s.desc}</div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={s.checked}
                  className="rounded border-slate-300 text-pink-600 focus:ring-pink-500 w-4 h-4 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUBTAB: shop/appeals (QUẢN LÝ KHIẾU NẠI & KHÁNG CÁO)
  // =========================================================================
  if (subTab === 'appeals') {
    const disputes = crossZoneSync.getDisputes(currentShop?.id);
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="text-rose-600" size={24} />
              Quản Lý Kháng Cáo &amp; Tranh Chấp Sàn ({disputes.length})
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Theo dõi kết quả phán quyết của Tòa Trọng Tài Sàn (Admin Disputes) đối với các đơn hàng bị khiếu nại.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {disputes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
              Gian hàng không có kháng cáo hoặc tranh chấp nào đang mở.
            </div>
          ) : (
            disputes.map((d) => (
              <div key={d.disputeId} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-pink-600">{d.disputeId} • Đơn {d.subOrderId}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${d.status === 'ARBITRATION_PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {d.status === 'ARBITRATION_PENDING' ? 'Đang chờ Admin phán quyết' : d.status}
                  </span>
                </div>
                <div>Khách khiếu nại: <strong>{d.buyerName}</strong> ({d.amount?.toLocaleString('vi-VN')}₫)</div>
                <div className="text-slate-500 italic">"{d.reason}"</div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUBTAB: shop/missions (NHIỆM VỤ NGƯỜI BÁN & THƯỞNG TÍN DỤNG)
  // =========================================================================
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="text-amber-500" size={24} />
            Nhiệm Vụ Người Bán &amp; Nhận Thưởng Tín Dụng
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Hoàn thành các mốc tăng trưởng để nhận tín dụng quảng cáo miễn phí và ưu tiên hiển thị banner toàn sàn.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 block font-semibold">TÍN DỤNG QUẢNG CÁO:</span>
          <div className="text-xl font-extrabold text-amber-600">2.500.000₫</div>
        </div>
      </div>

      <div className="space-y-3 text-xs">
        {[
          { title: 'Tích Hợp Gương Thử Son AR 60 FPS Cho Ít Nhất 3 Sản Phẩm', progress: '3 / 3 (Đã đạt 100%)', reward: 'Tặng 500K Tín Dụng Ads', done: true },
          { title: 'Duy Trì Tỷ Lệ Giao Hàng Đúng Hạn Trên 99%', progress: '99.8% (Đạt)', reward: 'Huy Hiệu Shop Yêu Thích', done: true },
          { title: 'Đạt Doanh Thu 100 Triệu Trong Tháng 11', progress: '142.6M / 100M (Vượt mốc)', reward: 'Ưu tiên hiển thị Top 1 Danh mục', done: true }
        ].map((m, idx) => (
          <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                {m.done && <CheckCircle2 size={16} className="text-emerald-600" />}
                {m.title}
              </h4>
              <div className="text-[11px] text-slate-500">Tiến trình: <strong className="text-slate-800">{m.progress}</strong></div>
              <span className="inline-block text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                🎁 Phần thưởng: {m.reward}
              </span>
            </div>
            <button
              onClick={() => onAddToast?.({ type: 'success', message: `Đã nhận phần thưởng [${m.reward}] vào ví Shop!` })}
              className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition"
            >
              Nhận Thưởng
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
