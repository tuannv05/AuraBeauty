import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart2, TrendingUp, Sparkles, AlertTriangle, CheckCircle2,
  Users, ShoppingBag, Eye, Award, Sliders
} from 'lucide-react';
import { NumberTicker, AnimatedBadge, MotionCard } from '../../components/ui';

export function DataAnalyticsViews({ subTab = 'sales-analytics', currentShop, onAddToast }) {
  // =========================================================================
  // SUBTAB: data/sales-analytics (PHÂN TÍCH BÁN HÀNG)
  // =========================================================================
  if (subTab === 'sales-analytics') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BarChart2 className="text-pink-600" size={24} />
              Phân Tích Bán Hàng &amp; Chuyển Đổi Gương AR
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Dữ liệu phân tích hành vi khách hàng từ Gương thử màu ảo AR 60 FPS sang tỷ lệ chốt đơn thực tế.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
            30 ngày qua ▾
          </span>
        </div>

        {/* 4 Thẻ KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MotionCard hoverScale={1.02} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold">Doanh thu tổng (GMV)</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              <NumberTicker value={142600000} suffix="₫" />
            </div>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 block">↑ +24.8% so với tháng trước</span>
          </MotionCard>

          <MotionCard hoverScale={1.02} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold">Lượt thử màu trên Gương AR</span>
            <div className="text-2xl font-extrabold text-pink-600 mt-1">
              <NumberTicker value={18420} suffix=" lượt" />
            </div>
            <span className="text-[11px] text-pink-600 font-bold mt-1 block">478 điểm 3D Canvas 60 FPS</span>
          </MotionCard>

          <MotionCard hoverScale={1.02} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold">Tỷ lệ chốt đơn sau khi thử AR</span>
            <div className="text-2xl font-extrabold text-purple-600 mt-1">14.8%</div>
            <span className="text-[11px] text-purple-600 font-bold mt-1 block">Cao gấp 3.2 lần sản phẩm thường</span>
          </MotionCard>

          <MotionCard hoverScale={1.02} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold">Giá trị đơn trung bình (AOV)</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              <NumberTicker value={685000} suffix="₫" />
            </div>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 block">↑ Tăng nhờ Mua Kèm Deal Sốc</span>
          </MotionCard>
        </div>

        {/* Phân tích theo danh mục */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Doanh Thu Theo Phân Loại Mỹ Phẩm</h3>
          <div className="space-y-3">
            {[
              { cat: 'Serum & Tinh chất đặc trị', gmv: '68.400.000₫', percent: '48%', color: 'bg-pink-600' },
              { cat: 'Kem dưỡng ẩm & Phục hồi da', gmv: '42.100.000₫', percent: '30%', color: 'bg-emerald-500' },
              { cat: 'Son môi & Trang điểm AR', gmv: '24.300.000₫', percent: '17%', color: 'bg-purple-600' },
              { cat: 'Mặt nạ & Làm sạch', gmv: '7.800.000₫', percent: '5%', color: 'bg-blue-500' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-700">{item.cat}</span>
                  <strong className="text-slate-900">{item.gmv} ({item.percent})</strong>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: item.percent }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUBTAB: data/operation-performance (HIỆU QUẢ HOẠT ĐỘNG & SAO QUẢ TẠ)
  // =========================================================================
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="text-emerald-600" size={24} />
            Hiệu Quả Vận Hành &amp; Điểm Phạt Sao Quả Tạ
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Bảng chỉ số chất lượng dịch vụ: Cam kết chuẩn Shopee Mall không vi phạm chất cấm và không trễ hạn giao.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            ✓ 0 Điểm Sao Quả Tạ
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {[
          { title: 'Tỷ lệ đơn giao trễ hạn', value: '0.2%', target: '< 1.5%', status: 'TỐT' },
          { title: 'Tỷ lệ hủy đơn do hết hàng', value: '0.0%', target: '< 1.0%', status: 'XUẤT SẮC (CAS chuẩn)' },
          { title: 'Tỷ lệ phản hồi tin nhắn', value: '98.5%', target: '> 90%', status: 'TỐT' },
          { title: 'Vi phạm kiểm duyệt CBMP / INCI', value: '0 vi phạm', target: '0 vi phạm', status: 'CHUẨN MALL' }
        ].map((item, idx) => (
          <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900">{item.title}</h4>
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {item.status}
              </span>
            </div>
            <div className="text-lg font-extrabold text-slate-900">{item.value}</div>
            <div className="text-[11px] text-slate-400">Mục tiêu yêu cầu: {item.target}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
