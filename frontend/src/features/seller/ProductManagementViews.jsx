import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Plus, Sparkles, ShieldCheck, AlertTriangle, CheckCircle2,
  XCircle, Sliders, Palette, Calendar, Layers, Eye, RefreshCw, Upload,
  Search, Filter, ExternalLink, ArrowRight, ShieldAlert, Check
} from 'lucide-react';
import { SellerProductSynergyGraph } from '../graphify';
import { crossZoneSync } from '../../lib/crossZoneSync';
import { SpringButton, NumberTicker, AnimatedBadge } from '../../components/ui';

export function ProductManagementViews({ subTab = 'all', currentShop, onAddToast, onNavigateSubTab }) {
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'PUBLISHED' | 'PENDING_APPROVAL' | 'OUT_OF_STOCK'
  const [searchQuery, setSearchQuery] = useState('');

  // Sample Product List for Shop
  const [products, setProducts] = useState([
    {
      id: 'prod-001',
      name: 'Innisfree Green Tea Seed Hyaluronic Serum',
      brand: 'Innisfree',
      category: 'Serum',
      categoryPath: 'SKINCARE TONER HYDRATING_TONER',
      status: 'PUBLISHED',
      registrationNumber: '19820/24/CBMP-QLD',
      inciSummary: 'Camellia Sinensis Leaf Extract, Sodium Hyaluronate, Panthenol, Niacinamide',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&auto=format&fit=crop&q=80',
      casStock: 165,
      reservedStock: 12,
      batches: [
        { batchNo: 'LOT-202410-01', mfg: '15/10/2024', exp: '15/10/2027', stock: 120, status: 'GOOD' },
        { batchNo: 'LOT-202404-03', mfg: '10/04/2024', exp: '10/04/2027', stock: 45, status: 'GOOD' }
      ],
      priceRange: '350.000₫ - 620.000₫',
      vtoSupported: false
    },
    {
      id: 'prod-002',
      name: 'Innisfree Cherry Blossom Glow Jelly Cream',
      brand: 'Innisfree',
      category: 'Kem dưỡng ẩm',
      categoryPath: 'SKINCARE MOISTURIZER REPAIR_CREAM',
      status: 'PUBLISHED',
      registrationNumber: '19821/24/CBMP-QLD',
      inciSummary: 'Prunus Yedoensis Leaf Extract, Betaine, Niacinamide, Glycerin',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&auto=format&fit=crop&q=80',
      casStock: 8,
      reservedStock: 4,
      batches: [
        { batchNo: 'LOT-202409-12', mfg: '01/09/2024', exp: '01/09/2027', stock: 8, status: 'LOW_STOCK' }
      ],
      priceRange: '480.000₫',
      vtoSupported: false
    },
    {
      id: 'prod-007',
      name: 'Son Kem Lì Mịn Môi Innisfree Airy Matte Tint',
      brand: 'Innisfree',
      category: 'Son môi',
      categoryPath: 'MAKEUP LIPSTICK MATTE_LIPSTICK',
      status: 'PUBLISHED',
      registrationNumber: '19825/24/CBMP-QLD',
      inciSummary: 'Dimethicone, Dimethicone Crosspolymer, Polyglyceryl-2 Triisostearate, CI 77491',
      image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&auto=format&fit=crop&q=80',
      casStock: 240,
      reservedStock: 15,
      batches: [
        { batchNo: 'LOT-202410-09', mfg: '20/10/2024', exp: '20/10/2027', stock: 240, status: 'GOOD' }
      ],
      priceRange: '290.000₫',
      vtoSupported: true,
      vtoCategory: 'LIPSTICK',
      vtoShadesCount: 4
    },
    {
      id: 'prod-008',
      name: 'Innisfree Super Volcanic Pore Clay Mask 2X',
      brand: 'Innisfree',
      category: 'Mặt nạ',
      categoryPath: 'SKINCARE MASK CLAY_MASK',
      status: 'PENDING_APPROVAL',
      registrationNumber: '19830/24/CBMP-QLD',
      inciSummary: 'Volcanic Ash, Kaolin, Bentonite, Lactic Acid, Silica',
      image: 'https://images.unsplash.com/photo-1567928815117-6d634268e0d4?w=400&auto=format&fit=crop&q=80',
      casStock: 180,
      reservedStock: 0,
      batches: [
        { batchNo: 'LOT-202411-01', mfg: '01/11/2024', exp: '01/11/2027', stock: 180, status: 'GOOD' }
      ],
      priceRange: '340.000₫',
      vtoSupported: false
    }
  ]);

  // Add Product Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Skincare',
    categoryPath: 'SKINCARE SERUM HYDRATING_SERUM',
    registrationNumber: '',
    inciSummary: '',
    price: '',
    initialStock: '',
    batchNo: `LOT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-01`,
    expDate: '2027-12-31',
    vtoSupported: false,
    vtoCategory: 'LIPSTICK',
    vtoHex: '#D9384E',
    vtoFinish: 'MATTE',
    vtoOpacity: 0.85
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Submit New Product
  const handleSubmitNewProduct = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.registrationNumber.trim()) {
      onAddToast?.({ type: 'error', message: 'Vui lòng nhập Tên sản phẩm và Số CBMP hợp lệ.' });
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      const newProd = {
        id: `prod-${Date.now().toString().slice(-4)}`,
        name: formData.name,
        brand: currentShop?.brand || 'Innisfree',
        category: formData.category,
        categoryPath: formData.categoryPath,
        status: 'PENDING_APPROVAL', // Chờ Admin duyệt CBMP
        registrationNumber: formData.registrationNumber,
        inciSummary: formData.inciSummary || 'Aqua, Glycerin, Butylene Glycol...',
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&auto=format&fit=crop&q=80',
        casStock: Number(formData.initialStock) || 100,
        reservedStock: 0,
        batches: [
          { batchNo: formData.batchNo, mfg: '01/11/2024', exp: formData.expDate, stock: Number(formData.initialStock) || 100, status: 'GOOD' }
        ],
        priceRange: `${Number(formData.price || 350000).toLocaleString('vi-VN')}₫`,
        vtoSupported: formData.vtoSupported
      };
      setProducts([newProd, ...products]);
      setIsSubmitting(false);
      onAddToast?.({
        type: 'success',
        message: 'Đã gửi hồ sơ sản phẩm lên Admin Zone để kiểm duyệt Số CBMP & Quét chất cấm INCI!'
      });
      onNavigateSubTab?.('all');
    }, 600);
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    if (filterStatus !== 'ALL' && p.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.registrationNumber.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // =========================================================================
  // SUBTAB: products/all (TẤT CẢ SẢN PHẨM & QUẢN LÝ LÔ)
  // =========================================================================
  if (subTab === 'all') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Package className="text-pink-600" size={24} />
              Tất Cả Sản Phẩm &amp; Quản Lý Lô Date
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Quản lý toàn bộ SKU • Tồn kho nguyên tử CAS • Hạn sử dụng lô FEFO • Tích hợp AR Try-On
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigateSubTab?.('add')}
              className="px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl shadow-sm hover:opacity-95 transition flex items-center gap-1.5"
            >
              <Plus size={16} /> + Thêm Sản Phẩm Mới
            </button>
          </div>
        </div>

        {/* Quick Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'ALL', label: 'Tất cả' },
              { id: 'PUBLISHED', label: 'Đang hoạt động' },
              { id: 'PENDING_APPROVAL', label: 'Chờ duyệt CBMP' }
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setFilterStatus(st.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  filterStatus === st.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Tìm theo tên sản phẩm, số CBMP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>

        {/* Product Grid / Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="p-3.5">Thông tin sản phẩm</th>
                  <th className="p-3.5 w-36">Giá bán</th>
                  <th className="p-3.5 w-40">Tồn kho CAS</th>
                  <th className="p-3.5 w-52">Lô hàng &amp; Hạn dùng FEFO</th>
                  <th className="p-3.5 w-36">Trạng thái CBMP</th>
                  <th className="p-3.5 w-28 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5">
                      <div className="flex items-start gap-3">
                        <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-xl border border-slate-200" />
                        <div>
                          <div className="font-bold text-slate-900 line-clamp-1">{p.name}</div>
                          <div className="text-[11px] text-pink-600 font-semibold mt-0.5">Số CBMP: {p.registrationNumber}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              {p.category}
                            </span>
                            {p.vtoSupported && (
                              <span className="text-[10px] bg-pink-50 text-pink-700 font-bold px-1.5 py-0.5 rounded border border-pink-200 flex items-center gap-1">
                                <Sparkles size={10} /> Thử son AR 60 FPS
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <strong className="text-slate-900">{p.priceRange}</strong>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{p.casStock} sản phẩm</div>
                      <div className="text-[10px] text-slate-400">Đang giữ: {p.reservedStock} (CAS reserved)</div>
                    </td>
                    <td className="p-3.5">
                      <div className="space-y-1">
                        {p.batches.map((b, i) => (
                          <div key={i} className="text-[11px] flex items-center justify-between bg-slate-50 px-2 py-1 rounded">
                            <span className="font-mono text-slate-700">{b.batchNo}</span>
                            <span className="text-slate-500">EXP: {b.exp}</span>
                            <strong className="text-emerald-700">{b.stock}</strong>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5">
                      {p.status === 'PUBLISHED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 size={12} /> Đang hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                          <ShieldCheck size={12} /> Chờ duyệt CBMP
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => onAddToast?.({ type: 'info', message: `Chỉnh sửa thông tin ${p.name}` })}
                        className="text-pink-600 hover:text-pink-800 font-bold text-xs"
                      >
                        Sửa SKU
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUBTAB: products/add (THÊM SẢN PHẨM & CẤU HÌNH VTO AR)
  // =========================================================================
  if (subTab === 'add') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Plus className="text-pink-600" size={24} />
              Đăng Sản Phẩm Mới Chuẩn Official Mall
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Điền thông tin pháp lý CBMP, danh pháp INCI và thiết lập bộ thử màu thực tế ảo AR 60 FPS.
            </p>
          </div>
          <button
            onClick={() => onNavigateSubTab?.('all')}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            ← Quay lại danh sách
          </button>
        </div>

        <form onSubmit={handleSubmitNewProduct} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cột 1 & 2: Thông tin cơ bản & Pháp lý */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                1. Thông Tin Cơ Bản &amp; Danh Mục Phân Cấp
              </h3>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tên Sản Phẩm *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Son Kem Lì Kháng Nước Mịn Môi Aura Velvet Tint 5g"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Danh Mục Mỹ Phẩm</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
                  >
                    <option value="Son môi">Son môi (Lipstick)</option>
                    <option value="Serum">Serum &amp; Tinh chất</option>
                    <option value="Kem dưỡng ẩm">Kem dưỡng ẩm (Moisturizer)</option>
                    <option value="Kem chống nắng">Kem chống nắng (Sunscreen)</option>
                    <option value="Phấn má">Phấn má hồng (Blush)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category Path (51 Sub-menu)</label>
                  <input
                    type="text"
                    value={formData.categoryPath}
                    onChange={(e) => setFormData({ ...formData, categoryPath: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-slate-50 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Giá Bán Niêm Yết (VND) *</label>
                  <input
                    type="number"
                    required
                    placeholder="350000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Số Lượng Nhập Kho Đầu Kỳ</label>
                  <input
                    type="number"
                    placeholder="200"
                    value={formData.initialStock}
                    onChange={(e) => setFormData({ ...formData, initialStock: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
            </div>

            {/* Khối Pháp lý CBMP & INCI */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <ShieldCheck className="text-emerald-600" size={18} />
                2. Hồ Sơ Pháp Lý CBMP &amp; Bảng Thành Phần INCI
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Số Công Bố Mỹ Phẩm (CBMP) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: 19825/24/CBMP-QLD"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Bắt buộc theo Nghị định 93/2016/NĐ-CP</span>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mã Lô Sản Xuất (Batch No)</label>
                  <input
                    type="text"
                    value={formData.batchNo}
                    onChange={(e) => setFormData({ ...formData, batchNo: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Bảng Thành Phần Chuẩn Quốc Tế INCI (Cách nhau bằng dấu phẩy)
                </label>
                <textarea
                  rows={3}
                  placeholder="Water, Niacinamide, Glycerin, Panthenol, Camellia Sinensis Leaf Extract..."
                  value={formData.inciSummary}
                  onChange={(e) => setFormData({ ...formData, inciSummary: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <span className="text-[10px] text-emerald-600 mt-1 block font-medium">
                  ✓ Hệ thống AI sẽ tự động phân tích độ an toàn &amp; mức độ bít tắc lỗ chân lông (Comedogenic Rating).
                </span>
              </div>
            </div>
          </div>

          {/* Cột 3: Cấu hình AR Virtual Try-On */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-pink-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-pink-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="text-pink-600" size={17} />
                  3. Cấu Hình AR Virtual Try-On
                </h3>
                <input
                  type="checkbox"
                  checked={formData.vtoSupported}
                  onChange={(e) => setFormData({ ...formData, vtoSupported: e.target.checked })}
                  className="rounded text-pink-600 focus:ring-pink-500 w-4 h-4 cursor-pointer"
                />
              </div>

              {formData.vtoSupported ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Vùng Trang Điểm Thử Nghiệm</label>
                    <select
                      value={formData.vtoCategory}
                      onChange={(e) => setFormData({ ...formData, vtoCategory: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="LIPSTICK">💄 Son Môi (Lipstick)</option>
                      <option value="BLUSH">🌸 Phấn Má Hồng (Blush)</option>
                      <option value="FOUNDATION">🧴 Kem Nền (Foundation)</option>
                      <option value="EYESHADOW">✨ Phấn Mắt (Eyeshadow)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Chọn Mã Màu (HEX)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.vtoHex}
                        onChange={(e) => setFormData({ ...formData, vtoHex: e.target.value })}
                        className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 p-0.5"
                      />
                      <input
                        type="text"
                        value={formData.vtoHex}
                        onChange={(e) => setFormData({ ...formData, vtoHex: e.target.value })}
                        className="flex-1 p-2 rounded-lg border border-slate-300 font-mono uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Chất Son / Hiệu Ứng Bề Mặt</label>
                    <select
                      value={formData.vtoFinish}
                      onChange={(e) => setFormData({ ...formData, vtoFinish: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="MATTE">Lì Mịn (Matte - Khô ráo, không bóng)</option>
                      <option value="GLOSSY">Bóng Căng Mọng (Glossy - Ánh sáng cao)</option>
                      <option value="VELVET">Nhung Mịn (Velvet - Mờ ảo tự nhiên)</option>
                      <option value="SHIMMER">Nhũ Lấp Lánh (Shimmer)</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span>Độ Đậm Sắc Độ (Opacity)</span>
                      <span>{Math.round(formData.vtoOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.3"
                      max="1.0"
                      step="0.05"
                      value={formData.vtoOpacity}
                      onChange={(e) => setFormData({ ...formData, vtoOpacity: parseFloat(e.target.value) })}
                      className="w-full accent-pink-600"
                    />
                  </div>

                  {/* Khung xem trước màu son AR */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block mb-1 font-bold">MẪU HIỂN THỊ MÀU LÊN MÔI:</span>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-14 h-8 rounded-full shadow-inner border border-white"
                        style={{ backgroundColor: formData.vtoHex, opacity: formData.vtoOpacity }}
                      />
                      <div className="text-[11px] text-slate-600">
                        <div>Chất: <strong>{formData.vtoFinish}</strong></div>
                        <div>Mã: <strong>{formData.vtoHex}</strong></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-400">
                  Sản phẩm này chưa bật tính năng thử màu thực tế ảo trên camera AR.
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-95 rounded-2xl shadow-md transition disabled:opacity-50"
            >
              {isSubmitting ? 'Đang gửi hồ sơ lên Admin...' : '🚀 Hoàn Tất & Gửi Duyệt Sản Phẩm'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // =========================================================================
  // SUBTAB: products/standard (SẢN PHẨM TIÊU CHUẨN AURA MALL)
  // =========================================================================
  if (subTab === 'standard') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="text-emerald-600" size={24} />
            Bộ Tiêu Chuẩn Sản Phẩm Official Mall
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Đánh giá chất lượng đăng tải sản phẩm để giữ vững danh hiệu Official Mall &amp; ưu tiên thuật toán tìm kiếm.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Ảnh Sản Phẩm 1:1 Đạt Chuẩn', status: '100% Đạt', desc: 'Ảnh nền trắng hoặc editorial cao cấp, độ phân giải tối thiểu 800x800px.' },
            { title: 'Hiệu Lực Giấy Phép CBMP', status: 'Đã Xác Thực', desc: 'Toàn bộ SKU đều có mã CBMP do Cục Quản Lý Dược cấp còn hiệu lực.' },
            { title: 'Đầy Đủ 8 Phân Hệ Facet Search', status: 'Đạt Chuẩn', desc: 'Có đầy đủ loại da phù hợp, texture, dung tích, xuất xứ và chứng chỉ an toàn.' },
            { title: 'Tỷ Lệ Tồn Kho CAS Khả Dụng', status: '99.4%', desc: 'Hạn chế tối đa tình trạng hủy đơn do hết hàng bất ngờ.' }
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  ✓ {item.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUBTAB: products/ai-optimizer (CÔNG CỤ TỐI ƯU AI & GRAPHIFY SYNERGY)
  // =========================================================================
  if (subTab === 'ai-optimizer') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="text-pink-600" size={24} />
              Công Cụ Tối Ưu AI &amp; Đồ Thị Hiệp Đồng Graphify
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Kết nối ai-advisor-service (8086) &amp; Graphify Engine: Tự động phân tích hoạt chất bổ trợ để tạo combo Mua Kèm Deal Sốc.
            </p>
          </div>
        </div>

        {/* Nhúng trực tiếp SellerProductSynergyGraph */}
        <SellerProductSynergyGraph onAddToast={onAddToast} />
      </div>
    );
  }

  return null;
}
