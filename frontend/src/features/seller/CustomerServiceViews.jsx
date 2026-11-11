import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Sparkles, Send, Star, Users, CheckCircle2,
  ThumbsUp, Clock, Bot, ShieldCheck, Tag, ShoppingBag, Eye, RefreshCw
} from 'lucide-react';
import { SpringButton } from '../../components/ui';

export function CustomerServiceViews({ subTab = 'chat', currentShop, onAddToast, onNavigateSubTab }) {
  // Live Chat state
  const [conversations, setConversations] = useState([
    {
      id: 'conv-01',
      buyerName: 'Lê Hoàng Yến',
      buyerEmail: 'hoangyen.le@gmail.com',
      lastMessage: 'Shop ơi chai Serum trà xanh này da nhạy cảm có bị châm chích không ạ?',
      lastTime: '10:42',
      unread: 1,
      skinProfile: {
        skinType: 'SENSITIVE_COMBINATION',
        concerns: ['Mụn ẩn', 'Dễ đỏ rát', 'Thiếu ẩm'],
        skinUndertone: 'COOL_PINK',
        allergies: ['Cồn khô', 'Parabens']
      },
      recentOrder: 'SUB-ORD-882339-S01 (Kem Cherry Blossom)'
    },
    {
      id: 'conv-02',
      buyerName: 'Trần Thu Hà',
      buyerEmail: 'thuha.tran@gmail.com',
      lastMessage: 'Mình đã nhận được hàng rồi nha, đóng gói rất kỹ cảm ơn Shop!',
      lastTime: 'Hôm qua',
      unread: 0,
      skinProfile: {
        skinType: 'OILY',
        concerns: ['Lỗ chân lông to', 'Đổ dầu vùng chữ T'],
        skinUndertone: 'WARM_GOLDEN',
        allergies: []
      },
      recentOrder: 'SUB-ORD-882342-S01 (Serum 80ml)'
    }
  ]);

  const [activeConvId, setActiveConvId] = useState('conv-01');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'BUYER', text: 'Chào Shop, mình đang tìm serum dưỡng ẩm cho mùa hanh khô này.', time: '10:40' },
    { sender: 'SELLER', text: 'Chào bạn Yến! Serum Green Tea Seed Hyaluronic bên mình cấp ẩm sâu 5 tầng biểu bì, rất phù hợp dưỡng ẩm phục hồi bạn nhé.', time: '10:41' },
    { sender: 'BUYER', text: 'Shop ơi chai Serum trà xanh này da nhạy cảm có bị châm chích không ạ?', time: '10:42' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const activeConv = conversations.find((c) => c.id === activeConvId);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = { sender: 'SELLER', text: chatInput, time: 'Vừa xong' };
    setChatMessages([...chatMessages, msg]);
    setChatInput('');
    onAddToast?.({ type: 'success', message: 'Đã gửi tin nhắn đến khách hàng.' });
  };

  // Sample Reviews
  const [reviews, setReviews] = useState([
    {
      id: 'REV-01',
      buyerName: 'Nguyễn Thùy Dung',
      rating: 5,
      productName: 'Innisfree Green Tea Seed Hyaluronic Serum 80ml',
      comment: 'Serum thấm cực nhanh, không hề nhờn rít. Da mình nhạy cảm mà dùng êm ru luôn. 10 điểm cho Shop Mall!',
      reply: 'Dạ Shop cảm ơn bạn Thùy Dung nhiều ạ! Chúc bạn luôn có làn da căng bóng mịn màng nha.',
      date: '10/11/2026'
    },
    {
      id: 'REV-02',
      buyerName: 'Trần Minh Tâm',
      rating: 5,
      productName: 'Son Kem Lì Mịn Môi Innisfree Airy Matte Tint',
      comment: 'Thử màu son trên camera AR của web thấy chuẩn màu y chang ngoài đời thật luôn, son lên môi nhẹ tênh!',
      reply: null,
      date: '09/11/2026'
    }
  ]);
  const [replyInput, setReplyInput] = useState({});

  const handleReplyReview = (reviewId) => {
    const text = replyInput[reviewId];
    if (!text || !text.trim()) return;
    setReviews(reviews.map((r) => (r.id === reviewId ? { ...r, reply: text } : r)));
    setReplyInput({ ...replyInput, [reviewId]: '' });
    onAddToast?.({ type: 'success', message: 'Đã gửi phản hồi đánh giá! Đồng bộ ngay ra Buyer Zone.' });
  };

  // =========================================================================
  // SUBTAB: cs/chat (QUẢN LÝ CHAT TRỰC TUYẾN)
  // =========================================================================
  if (subTab === 'chat') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="text-pink-600" size={24} />
              Quản Lý Trò Chuyện Trực Tuyến &amp; Hồ Sơ Da
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Xem nhanh Skin Profile (loại da, tông da AR, tiền sử dị ứng) để tư vấn mỹ phẩm chuẩn xác.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Đang Trực Tuyến
          </span>
        </div>

        {/* Khung Chat 3 Cột Chuẩn Shopee */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-12 min-h-[560px]">
          {/* Cột 1: Danh sách hội thoại (4 cols) */}
          <div className="md:col-span-4 border-r border-slate-200 flex flex-col">
            <div className="p-3 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-700">
              Hộp thư khách hàng ({conversations.length})
            </div>
            <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
              {conversations.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setActiveConvId(c.id)}
                  className={`p-3.5 cursor-pointer transition ${activeConvId === c.id ? 'bg-pink-50/70 border-l-4 border-pink-600' : 'hover:bg-slate-50'}`}
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-xs text-slate-900">{c.buyerName}</strong>
                    <span className="text-[10px] text-slate-400">{c.lastTime}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-1">{c.lastMessage}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cột 2: Khung chat chính (5 cols) */}
          <div className="md:col-span-5 flex flex-col justify-between border-r border-slate-200 bg-slate-50/40">
            <div className="p-3 bg-white border-b border-slate-200 font-bold text-xs text-slate-900 flex items-center justify-between">
              <span>Đang trò chuyện: <strong>{activeConv?.buyerName}</strong></span>
              <span className="text-[10px] text-slate-400">Tỷ lệ phản hồi Shop: 98.5%</span>
            </div>

            {/* Nội dung tin nhắn */}
            <div className="p-4 space-y-3 overflow-y-auto flex-1 text-xs">
              {chatMessages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'SELLER' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      m.sender === 'SELLER'
                        ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-tr-none shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                    }`}
                  >
                    <div>{m.text}</div>
                    <span className={`block text-[9px] mt-1 ${m.sender === 'SELLER' ? 'text-pink-100' : 'text-slate-400'} text-right`}>
                      {m.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Nhập tin nhắn */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                placeholder="Nhập câu trả lời tư vấn cho khách..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 p-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition flex items-center gap-1"
              >
                <Send size={13} /> Gửi
              </button>
            </form>
          </div>

          {/* Cột 3: Hồ Sơ Da Liễu & Đơn Hàng Của Khách (3 cols) */}
          <div className="md:col-span-3 p-4 bg-white space-y-4 text-xs">
            <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Sparkles className="text-pink-600" size={15} />
              Hồ Sơ Da Của Khách
            </h4>

            {activeConv?.skinProfile && (
              <div className="space-y-2.5">
                <div>
                  <span className="text-slate-400 text-[10px] block">LOẠI DA:</span>
                  <strong className="text-slate-800">{activeConv.skinProfile.skinType}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">SẮC ĐỘ DA (AR VTO):</span>
                  <span className="px-2 py-0.5 rounded bg-pink-50 text-pink-700 font-bold text-[11px]">
                    {activeConv.skinProfile.skinUndertone}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">VẤN ĐỀ VỀ DA:</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {activeConv.skinProfile.concerns.map((c, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">CẦN TRÁNH (DỊ ỨNG):</span>
                  <div className="text-[11px] text-rose-600 font-semibold">
                    {activeConv.skinProfile.allergies.join(', ') || 'Không có'}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100">
              <span className="text-slate-400 text-[10px] block">ĐƠN GẦN NHẤT:</span>
              <strong className="text-slate-800 text-[11px] mt-0.5 block">{activeConv?.recentOrder}</strong>
            </div>

            <button
              onClick={() => onAddToast?.({ type: 'info', message: 'Đã gửi Thẻ Voucher 15% vào khung chat cho khách!' })}
              className="w-full py-2 text-xs font-bold text-pink-600 bg-pink-50 hover:bg-pink-100 rounded-xl transition"
            >
              + Gửi Thẻ Voucher 15%
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUBTAB: cs/ai-assistant (TRỢ LÝ CHAT AI DA LIỄU)
  // =========================================================================
  if (subTab === 'ai-assistant') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Bot className="text-pink-600" size={24} />
              Trợ Lý Chat AI Dược Mỹ Phẩm (Hybrid RAG + SSE)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Tự động trực chat 24/7, tra cứu bảng thành phần INCI và tư vấn chọn son trên camera AR cho khách hàng.
            </p>
          </div>
          <span className="px-3 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full">
            Đang Hoạt Động
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900">Kịch Bản Tự Động Trả Lời</h4>
            <div className="p-3 bg-slate-50 rounded-xl text-slate-600">
              "Chào bạn! Cảm ơn bạn đã nhắn tin cho Innisfree Official Store. Chuyên viên tư vấn da liễu hoặc trợ lý AI đang phân tích câu hỏi của bạn..."
            </div>
            <button
              onClick={() => onAddToast?.({ type: 'success', message: 'Đã cập nhật câu trả lời tự động!' })}
              className="px-3 py-1.5 font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg"
            >
              Chỉnh sửa kịch bản
            </button>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900">Trí Thông Minh Nhân Tạo (ai-advisor-service)</h4>
            <p className="text-slate-500">
              Tích hợp cơ sở tri thức pgvector và chuẩn hóa danh pháp INCI quốc tế. Khi khách hỏi về mẹ bầu, da treatment hay chất cấm, AI sẽ đưa ra câu trả lời đã qua thẩm định y khoa.
            </p>
            <span className="inline-block text-[11px] font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-lg">
              Độ chính xác dược học: 99.8%
            </span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUBTAB: cs/reviews (QUẢN LÝ ĐÁNH GIÁ CỦA SHOP)
  // =========================================================================
  if (subTab === 'reviews') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Star className="text-amber-500 fill-amber-500" size={24} />
              Quản Lý Đánh Giá Của Khách Hàng
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Phản hồi đánh giá 5 sao để duy trì huy hiệu Shop Yêu Thích và chuẩn Official Mall.
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold text-amber-500">4.9 / 5.0</div>
            <span className="text-[11px] text-slate-400">Dựa trên 1.420 đánh giá</span>
          </div>
        </div>

        {/* Danh sách review */}
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
              <div className="flex items-start justify-between">
                <div>
                  <strong className="text-slate-900 text-sm">{r.buyerName}</strong>
                  <div className="flex items-center gap-1 text-amber-400 mt-0.5">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-400" />
                    ))}
                    <span className="text-slate-400 text-[10px] ml-2">Ngày: {r.date}</span>
                  </div>
                  <div className="text-pink-600 font-semibold mt-1">Sản phẩm: {r.productName}</div>
                </div>
              </div>

              <p className="text-slate-700 bg-slate-50 p-3 rounded-xl italic">"{r.comment}"</p>

              {r.reply ? (
                <div className="p-3 bg-pink-50/60 rounded-xl border border-pink-100 text-pink-900 ml-4">
                  <strong>Phản hồi của Shop:</strong> {r.reply}
                </div>
              ) : (
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Nhập lời cảm ơn hoặc phản hồi của Shop..."
                    value={replyInput[r.id] || ''}
                    onChange={(e) => setReplyInput({ ...replyInput, [r.id]: e.target.value })}
                    className="flex-1 p-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <button
                    onClick={() => handleReplyReview(r.id)}
                    className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition"
                  >
                    Trả Lời
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUBTAB: cs/broadcast (TIN NHẮN QUẢNG BÁ)
  // =========================================================================
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="text-purple-600" size={24} />
            Tin Nhắn Quảng Bá Tệp Khách Hàng
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Gửi Voucher hoặc thông điệp nhắc chu kỳ mua lại sau 28 ngày cho khách hàng đã theo dõi Shop.
          </p>
        </div>
        <button
          onClick={() => onAddToast?.({ type: 'success', message: 'Chiến dịch tin nhắn quảng bá đã được gửi tới 1.250 khách hàng tiềm năng!' })}
          className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm transition"
        >
          + Tạo Chiến Dịch Quảng Bá Mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {[
          { title: 'Khách Đã Theo Dõi Shop', count: '128.400 người', desc: 'Gửi voucher độc quyền nhân dịp Siêu Sale.' },
          { title: 'Khách Bỏ Quên Giỏ Hàng', count: '340 người', desc: 'Nhắc khách hoàn tất thanh toán nhận quà tặng.' },
          { title: 'Chu Kỳ Tái Mua Mỹ Phẩm (28 ngày)', count: '1.250 người', desc: 'Nhắc khách bổ sung kem chống nắng & serum.' }
        ].map((item, idx) => (
          <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <h4 className="font-bold text-slate-900">{item.title}</h4>
            <div className="text-base font-extrabold text-purple-700">{item.count}</div>
            <p className="text-slate-500 text-[11px]">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
