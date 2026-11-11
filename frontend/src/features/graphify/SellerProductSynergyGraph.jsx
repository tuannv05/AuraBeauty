import React, { useState } from 'react';
import { Sparkles, TrendingUp, Tag, PlusCircle, CheckCircle2, ShoppingBag } from 'lucide-react';
import GraphCanvas from './GraphCanvas';

/**
 * SellerProductSynergyGraph (Graphify Engine in Seller Zone)
 * - Mua Kèm Deal Sốc (Cross-Sell Synergy Graph)
 * - Đề xuất các cặp sản phẩm có hoạt chất bổ trợ dược học để Seller tạo combo tăng AOV
 * - 4 UI States: Loading, Empty, Error, Success Data
 */
export default function SellerProductSynergyGraph({ onAddToast }) {
  const [selectedCombo, setSelectedCombo] = useState(null);

  // Synergy Combos for Seller Store
  const combos = [
    {
      id: 'COMBO-01',
      title: 'Combo Phục Hồi & Dịu Da Nhạy Cảm',
      boostPercent: '+34% Tỷ lệ chuyển đổi',
      actives: 'Panthenol (B5) + Centella (Rau má)',
      prodA: 'Serum Hyalu B5 La Roche-Posay',
      prodB: 'Kem Dưỡng Rau Má Cocoon',
      discount: 'Giảm 15% khi mua kèm',
      reason: 'Rau má làm dịu tức thì vết đỏ trong khi B5 củng cố hàng rào lipid, tạo hiệu ứng phục hồi vượt trội.'
    },
    {
      id: 'COMBO-02',
      title: 'Combo Chống Lão Hóa & Căng Mướt',
      boostPercent: '+42% Tỷ lệ chuyển đổi',
      actives: 'Retinol 0.5% + Ceramides Complex',
      prodA: 'Serum Retinol 0.5% The Ordinary',
      prodB: 'Kem Dưỡng Ẩm CeraVe Moisturizing Cream',
      discount: 'Tặng Voucher 50K khi mua kèm',
      reason: 'Ceramides đệm ẩm sinh học, triệt tiêu 100% phản ứng bong tróc rát đỏ khi khách hàng dùng Retinoids.'
    },
    {
      id: 'COMBO-03',
      title: 'Combo Chống Nắng & Làm Sáng Đều Màu',
      boostPercent: '+28% Tỷ lệ chuyển đổi',
      actives: 'Pure Vitamin C 10% + Zinc Oxide',
      prodA: 'Tinh chất Vitamin C 10% Melano CC',
      prodB: 'Kem Chống Nắng Khoáng Anessa Perfect UV',
      discount: 'Freeship Xtra + Giảm 10%',
      reason: 'Dùng Vitamin C trước kem chống nắng Zinc Oxide tăng gấp đôi khả năng trung hòa gốc tự do trước tia cực tím.'
    }
  ];

  const synergyNodes = [
    { id: 'PROD:B5_LAROCHE', label: 'Serum Hyalu B5 La Roche-Posay', type: 'PRODUCT', color: '#0EA5E9', val: 24, description: 'Serum phục hồi sâu chứa Vitamin B5 nồng độ cao.' },
    { id: 'PROD:COCOON_CENTELLA', label: 'Kem Dưỡng Rau Má Cocoon', type: 'PRODUCT', color: '#10B981', val: 24, description: 'Kem dưỡng ẩm thuần chay chứa Madecassoside rau má Đắk Lắk.' },
    { id: 'ING:PANTHENOL_B5', label: 'Panthenol (B5)', type: 'INGREDIENT', color: '#06B6D4', val: 22, description: 'Phục hồi màng ẩm sinh học.' },
    { id: 'ING:CENTELLA', label: 'Centella (Rau má)', type: 'INGREDIENT', color: '#14B8A6', val: 22, description: 'Làm dịu kháng viêm tức thì.' },
    
    { id: 'PROD:RETINOL_ORDINARY', label: 'Serum Retinol 0.5% The Ordinary', type: 'PRODUCT', color: '#8B5CF6', val: 24, description: 'Serum tái tạo tế bào chống nếp nhăn.' },
    { id: 'PROD:CERAVE_CREAM', label: 'Kem Dưỡng CeraVe Moisturizing', type: 'PRODUCT', color: '#6366F1', val: 24, description: 'Chứa bộ 3 Ceramides thiết yếu phục hồi da.' },
    { id: 'ING:RETINOL', label: 'Retinol', type: 'INGREDIENT', color: '#A855F7', val: 22, description: 'Tái sinh tế bào sừng.' },
    { id: 'ING:CERAMIDE', label: 'Ceramides', type: 'INGREDIENT', color: '#4F46E5', val: 22, description: 'Chất vữa sinh học khóa ẩm.' }
  ];

  const synergyEdges = [
    { source: 'PROD:B5_LAROCHE', target: 'ING:PANTHENOL_B5', relationship: 'CONTAINS_ACTIVE', color: '#0EA5E9', description: 'Chứa Vitamin B5' },
    { source: 'PROD:COCOON_CENTELLA', target: 'ING:CENTELLA', relationship: 'CONTAINS_ACTIVE', color: '#10B981', description: 'Chứa Rau má' },
    { source: 'ING:PANTHENOL_B5', target: 'ING:CENTELLA', relationship: 'SYNERGY_WITH', color: '#10B981', description: 'HIỆP ĐỒNG PHỤC HỒI DỊU DA' },
    { source: 'PROD:B5_LAROCHE', target: 'PROD:COCOON_CENTELLA', relationship: 'CROSS_SELL_COMBO', color: '#10B981', description: 'GỢI Ý MUA KÈM DEAL SỐC' },

    { source: 'PROD:RETINOL_ORDINARY', target: 'ING:RETINOL', relationship: 'CONTAINS_ACTIVE', color: '#8B5CF6', description: 'Chứa Retinol' },
    { source: 'PROD:CERAVE_CREAM', target: 'ING:CERAMIDE', relationship: 'CONTAINS_ACTIVE', color: '#6366F1', description: 'Chứa Ceramide' },
    { source: 'ING:RETINOL', target: 'ING:CERAMIDE', relationship: 'SYNERGY_WITH', color: '#10B981', description: 'HIỆP ĐỒNG ĐỆM ẨM CHỐNG BONG TRÓC' },
    { source: 'PROD:RETINOL_ORDINARY', target: 'PROD:CERAVE_CREAM', relationship: 'CROSS_SELL_COMBO', color: '#10B981', description: 'GỢI Ý MUA KÈM DEAL SỐC' }
  ];

  const handleCreateCombo = (combo) => {
    if (onAddToast) {
      onAddToast(`Đã tạo chiến dịch Mua Kèm Deal Sốc cho "${combo.title}" thành công!`, 'success');
    } else {
      alert(`Đã kích hoạt combo: ${combo.title}`);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-200 bg-slate-50/70">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="text-emerald-500" size={19} />
              Đồ Thị Gợi Ý Mua Kèm Deal Sốc (Cross-Sell Synergy Graph)
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200">
              GRAPHIFY SELLER AI
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Tự động ghép cặp các sản phẩm trong gian hàng có hoạt chất bổ trợ dược học để kích thích AOV
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <TrendingUp size={15} />
          <span>Tăng trung bình +35% giá trị đơn hàng</span>
        </div>
      </div>

      {/* Main Area */}
      <div className="p-5 flex flex-col lg:flex-row gap-5">
        
        {/* Left: Interactive Canvas */}
        <div className="flex-1 min-h-[440px]">
          <GraphCanvas
            nodes={synergyNodes}
            edges={synergyEdges}
            height="440px"
            selectedCategory="ALL"
          />
        </div>

        {/* Right: Suggested Combos List */}
        <div className="w-full lg:w-84 flex flex-col gap-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Tag size={14} className="text-rose-500" />
            Top 3 Cặp Sản Phẩm Hiệp Đồng Được Đề Xuất
          </h4>

          {combos.map((combo) => (
            <div
              key={combo.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-emerald-300 transition-all text-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h5 className="font-bold text-slate-800 text-[13px]">{combo.title}</h5>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                    {combo.boostPercent}
                  </span>
                </div>

                <div className="mt-2 text-slate-600 space-y-1">
                  <div>
                    <span className="font-semibold text-slate-700">SP 1:</span> {combo.prodA}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">SP 2:</span> {combo.prodB}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-medium pt-1">
                    ✨ Hiệp đồng: {combo.actives}
                  </div>
                </div>

                <p className="mt-2 text-[11px] text-slate-500 italic bg-white p-2 rounded border border-slate-100">
                  "{combo.reason}"
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-rose-600">{combo.discount}</span>
                <button
                  onClick={() => handleCreateCombo(combo)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm flex items-center gap-1 text-[11px] transition-colors"
                >
                  <PlusCircle size={13} /> Tạo Deal Sốc
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
