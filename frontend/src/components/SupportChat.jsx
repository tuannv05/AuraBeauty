import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  RotateCcw,
  PhoneCall,
  ShoppingBag,
  Truck,
  Eye,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Star
} from 'lucide-react';
import { streamAdvisorChat, getMatchedProductsForQuery } from '../api';

function formatPrice(number) {
  if (!number) return '0 ₫';
  return number.toLocaleString('vi-VN') + ' ₫';
}

function formatMessageContent(rawText, isAi) {
  if (!rawText) return null;
  const lines = rawText.split('\n');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', wordBreak: 'break-word' }}>
      {lines.map((line, lIdx) => {
        const trimmed = line.trim();

        // 1. Dòng trống -> tạo khoảng cách ngắt đoạn thoáng đãng
        if (!trimmed) {
          return <div key={lIdx} style={{ height: '6px' }} />;
        }

        // 2. Dòng phân cách ---
        if (trimmed === '---' || trimmed === '***') {
          return <hr key={lIdx} style={{ border: 'none', borderTop: '1px dashed #e2e8f0', margin: '8px 0' }} />;
        }

        // Process **bold** emphasis
        const parts = line.split(/(\*\*.*?\*\*)/g);
        const formattedParts = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong
                key={pIdx}
                style={{
                  color: isAi ? '#0f172a' : '#ffffff',
                  fontWeight: 750,
                  background: isAi ? 'rgba(236, 72, 153, 0.08)' : 'transparent',
                  padding: isAi ? '1px 4px' : '0',
                  borderRadius: '4px'
                }}
              >
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });

        // 3. Tiêu đề mục lớn: ví dụ "1. 🩺...", "### ...", "☀️ Buổi Sáng", "🌙 Buổi Tối", "🔬 Hoạt chất"
        if (/^\s*(\d+\.\s*[🔬🩺🛍️📦⚡🎁🔄💯⚖️🏪📋🚀💰🌿💧✨🌟💳🏧🎟️💡]|###|☀️|🌙|🔬|⏰|🛡️)/.test(trimmed)) {
          return (
            <div
              key={lIdx}
              style={{
                fontSize: '13.5px',
                fontWeight: 800,
                color: isAi ? '#be185d' : '#ffffff',
                marginTop: '10px',
                marginBottom: '4px',
                paddingBottom: '3px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {formattedParts}
            </div>
          );
        }

        // 4. Hộp Callout / Ghi chú / Lời khuyên / Cảnh báo: ví dụ "💡 *Lời khuyên*:" hoặc "⚠️ *Lưu ý*:"
        if (trimmed.startsWith('💡') || trimmed.startsWith('⚠️') || trimmed.startsWith('👉') || trimmed.startsWith('🛡️')) {
          return (
            <div
              key={lIdx}
              style={{
                marginTop: '8px',
                marginBottom: '6px',
                padding: '9px 12px',
                background: trimmed.startsWith('⚠️') ? '#fff1f2' : trimmed.startsWith('💡') ? '#fefce8' : '#f0fdf4',
                border: trimmed.startsWith('⚠️') ? '1px solid #fecdd3' : trimmed.startsWith('💡') ? '1px solid #fef08a' : '1px solid #bbf7d0',
                borderRadius: '10px',
                fontSize: '12.5px',
                lineHeight: 1.55,
                color: '#334155'
              }}
            >
              {formattedParts}
            </div>
          );
        }

        // 5. Danh sách gạch đầu dòng bullet (• hoặc - hoặc *)
        if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
          return (
            <div
              key={lIdx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                paddingLeft: '6px',
                marginBottom: '3px',
                fontSize: '13px',
                lineHeight: 1.55
              }}
            >
              <span
                style={{
                  color: isAi ? '#ec4899' : '#ffffff',
                  fontSize: '11px',
                  lineHeight: '1.8',
                  flexShrink: 0
                }}
              >
                ●
              </span>
              <div style={{ flex: 1 }}>{formattedParts}</div>
            </div>
          );
        }

        // 6. Danh sách có đánh số 1. 2. 3.
        if (/^\s*\d+\.\s/.test(trimmed)) {
          return (
            <div
              key={lIdx}
              style={{
                paddingLeft: '8px',
                marginBottom: '3px',
                fontSize: '13px',
                lineHeight: 1.55
              }}
            >
              {formattedParts}
            </div>
          );
        }

        // 7. Dòng bình thường
        return (
          <div
            key={lIdx}
            style={{
              fontSize: '13px',
              lineHeight: 1.55,
              color: isAi ? '#1e293b' : '#ffffff',
              marginBottom: '2px'
            }}
          >
            {formattedParts}
          </div>
        );
      })}
    </div>
  );
}

export const SUGGESTION_CATEGORIES = [
  { id: 'popular', name: '🔥 Phổ biến' },
  { id: 'acne', name: '🌿 Mụn & Kiềm dầu' },
  { id: 'hydration', name: '💧 Cấp ẩm & Phục hồi' },
  { id: 'antiaging', name: '✨ Trẻ hóa & Nám' },
  { id: 'sunscreen', name: '☀️ Kem chống nắng' },
  { id: 'makeup', name: '💄 Son & Trang điểm' },
  { id: 'orders', name: '📦 Đơn hàng & Đổi trả' },
  { id: 'vouchers', name: '🎟️ Voucher & Mở Shop' }
];

export const SUGGESTION_ITEMS = {
  popular: [
    { label: '🌿 Routine da dầu mụn bã nhờn', prompt: 'Tư vấn giúp tôi phác đồ chăm sóc cho da dầu mụn, bã nhờn và lỗ chân lông to với BHA và Niacinamide' },
    { label: '💧 Phục hồi da khô thiếu nước', prompt: 'Đề xuất routine 3 bước phục hồi cấp ẩm sâu cho da khô nhạy cảm với Hyaluronic Acid và Ceramide' },
    { label: '☀️ Kem chống nắng kiềm dầu', prompt: 'Gợi ý cho tôi kem chống nắng kiềm dầu, phổ rộng SPF50+ PA++++ không gây bít tắc chân lông' },
    { label: '📦 Hướng dẫn tra cứu đơn hàng', prompt: 'Làm thế nào để tôi kiểm tra trạng thái và tra cứu đơn hàng của mình?' },
    { label: '🛡️ Đổi trả 7 ngày & Đền 200%', prompt: 'Chính sách đổi trả trong 7 ngày và cam kết chính hãng đền bù 200% của Aura Beauty Mall như thế nào?' },
    { label: '🎟️ Áp voucher kép Shop + Sàn', prompt: 'Cách săn và áp dụng đồng thời Voucher Thương Hiệu cùng Voucher Toàn Sàn Aura Beauty Mall?' }
  ],
  acne: [
    { label: '🧪 Kết hợp BHA và Niacinamide', prompt: 'Cách kết hợp Salicylic Acid (BHA 2%) và Niacinamide trong cùng routine thế nào để không đẩy mụn ồ ạt?' },
    { label: '🧼 Sữa rửa mặt pH 5.5 da mụn', prompt: 'Sữa rửa mặt nào làm sạch sâu bã nhờn dịu nhẹ có độ pH chuẩn 5.5 không gây khô căng da?' },
    { label: '🎯 Giảm mụn viêm sưng không thâm', prompt: 'Phác đồ chấm mụn viêm sưng cấp tốc và ngăn ngừa hình thành sẹo thâm mụn sau viêm (PIE/PIH)' },
    { label: '🌿 Routine kiềm dầu mùa hè', prompt: 'Routine chăm sóc da bóng dầu, lỗ chân lông to và mụn đầu đen vào thời tiết nắng nóng' }
  ],
  hydration: [
    { label: '🌸 Phục hồi da sau peel / treatment', prompt: 'Hướng dẫn phục hồi hàng rào bảo vệ da sau khi peel hoặc dùng retinol bị bong tróc, ửng đỏ' },
    { label: '🐌 Tinh chất ốc sên Cosrx Snail 96', prompt: 'Serum tinh chất ốc sên Cosrx Advanced Snail 96 Mucin có công dụng gì và da dầu mụn dùng được không?' },
    { label: '💧 Serum Hyaluronic Acid đa tầng', prompt: 'Serum cấp nước HA Innisfree Green Tea Seed Hyaluronic Serum có gì nổi bật và dùng ở bước nào?' },
    { label: '🛡️ Tác dụng của Ceramide và B5', prompt: 'Tại sao da treatment cần bổ sung Ceramide NP và Vitamin B5 để phục hồi màng lipid?' }
  ],
  antiaging: [
    { label: '✨ Dùng Retinol cho người mới', prompt: 'Hướng dẫn cách dùng Retinol chống lão hóa an toàn cho người mới bắt đầu không bị kích ứng bong tróc' },
    { label: '🌟 Mờ nám tàn nhang & Arbutin', prompt: 'Phác đồ ức chế hắc sắc tố Melanin, làm mờ nám sạm đốm nâu với Tranexamic Acid và Alpha Arbutin' },
    { label: '🍊 Dùng Vitamin C buổi sáng', prompt: 'Tại sao bác sĩ da liễu khuyên bôi Serum Vitamin C vào buổi sáng trước kem chống nắng?' },
    { label: '⏳ Chống lão hóa sớm tuổi 25+', prompt: 'Những hoạt chất và sản phẩm nào cần thiết nhất cho quy trình chống lão hóa da từ tuổi 25?' }
  ],
  sunscreen: [
    { label: '☀️ Kem chống nắng Anessa vàng', prompt: 'Kem chống nắng Anessa Perfect UV Milk SPF50+ PA++++ có kiềm dầu và chống trôi nước tốt không?' },
    { label: '🧴 Quy tắc thoa 2 ngón tay', prompt: 'Lượng kem chống nắng chuẩn y khoa là bao nhiêu? Cách thoa đủ 2mg/cm2 không bị vệt trắng' },
    { label: '🔄 Cách bôi lại KCN trong ngày', prompt: 'Cách bôi lại kem chống nắng giữa ngày khi đang trang điểm hoặc đi làm văn phòng' }
  ],
  makeup: [
    { label: '💄 Son kem lì Romand Blur Fudge', prompt: 'Son kem lì mịn môi Romand Blur Fudge Tint có những tone màu nào hot và có bị lộ rãnh môi không?' },
    { label: '💋 Bí quyết đánh son mịn như nhung', prompt: 'Mẹo dưỡng môi và tẩy tế bào chết môi trước khi đánh son kem lì để màu lên chuẩn và bền cả ngày' },
    { label: '✨ Tẩy trang sạch sâu ngừa mụn ẩn', prompt: 'Cách nhũ hóa dầu tẩy trang và dùng nước tẩy trang micellar chuẩn y khoa để không sinh mụn ẩn' }
  ],
  orders: [
    { label: '📦 Tra cứu hành trình vận chuyển', prompt: 'Làm thế nào để tôi kiểm tra trạng thái và tra cứu đơn hàng của mình?' },
    { label: '🛡️ Bảo hành chính hãng đền 200%', prompt: 'Chính sách đổi trả trong 7 ngày và cam kết chính hãng đền bù 200% của Aura Beauty Mall như thế nào?' },
    { label: '🚚 Phí ship & Giao hỏa tốc 2h', prompt: 'Thời gian giao hàng toàn quốc và điều kiện để được Freeship giao hỏa tốc 2 giờ tại Aura Beauty Mall?' },
    { label: '❌ Cách hủy đơn & Hoàn tiền', prompt: 'Tôi có thể hủy đơn hàng khi nào và tiền thanh toán sẽ được hoàn về tài khoản trong bao lâu?' }
  ],
  vouchers: [
    { label: '🎟️ Cách áp dụng Voucher kép', prompt: 'Cách săn và áp dụng đồng thời Voucher Thương Hiệu cùng Voucher Toàn Sàn Aura Beauty Mall?' },
    { label: '🏪 Đăng ký mở gian hàng Official Mall', prompt: 'Làm sao để tôi đăng ký mở gian hàng Official Mall trên sàn Aura Beauty Mall?' },
    { label: '📜 Giấy công bố mỹ phẩm CBMP', prompt: 'Hồ sơ công bố mỹ phẩm CBMP của Bộ Y Tế cần thiết những giấy tờ gì để bán hàng trên sàn?' },
    { label: '📞 Kết nối Hotline CSKH 1900 6868', prompt: 'Tôi cần liên hệ bộ phận hỗ trợ khách hàng và khiếu nại của Aura Beauty Mall qua các kênh nào?' }
  ]
};

function getFollowUpChips(aiText) {
  if (!aiText) return [];
  const text = aiText.toLowerCase();
  if (text.includes('mụn') || text.includes('bha') || text.includes('salicylic') || text.includes('niacinamide')) {
    return [
      { label: '🧪 BHA kết hợp Niacinamide thế nào?', prompt: 'Cách kết hợp Salicylic Acid (BHA 2%) và Niacinamide trong cùng routine thế nào để không đẩy mụn ồ ạt?' },
      { label: '🧼 Sữa rửa mặt pH 5.5 da mụn', prompt: 'Sữa rửa mặt nào làm sạch sâu bã nhờn dịu nhẹ có độ pH chuẩn 5.5 không gây khô căng da?' },
      { label: '☀️ Kem chống nắng kiềm dầu quang phổ rộng', prompt: 'Gợi ý cho tôi kem chống nắng kiềm dầu, phổ rộng SPF50+ PA++++ không gây bít tắc chân lông' }
    ];
  }
  if (text.includes('retinol') || text.includes('lão hóa') || text.includes('nếp nhăn') || text.includes('trắng da') || text.includes('nám')) {
    return [
      { label: '💧 Phục hồi da khi dùng Retinol', prompt: 'Hướng dẫn phục hồi hàng rào bảo vệ da sau khi peel hoặc dùng retinol bị bong tróc, ửng đỏ' },
      { label: '🍊 Dùng Vitamin C sáng hay tối?', prompt: 'Tại sao bác sĩ da liễu khuyên bôi Serum Vitamin C vào buổi sáng trước kem chống nắng?' },
      { label: '☀️ Kem chống nắng Anessa SPF50+', prompt: 'Kem chống nắng Anessa Perfect UV Milk SPF50+ PA++++ có kiềm dầu và chống trôi nước tốt không?' }
    ];
  }
  if (text.includes('ẩm') || text.includes('khô') || text.includes('phục hồi') || text.includes('ceramide') || text.includes('ốc sên')) {
    return [
      { label: '🐌 Tinh chất ốc sên Cosrx Snail 96', prompt: 'Serum tinh chất ốc sên Cosrx Advanced Snail 96 Mucin có công dụng gì và da dầu mụn dùng được không?' },
      { label: '🧴 Quy tắc bôi kem chống nắng 2 ngón tay', prompt: 'Lượng kem chống nắng chuẩn y khoa là bao nhiêu? Cách thoa đủ 2mg/cm2 không bị vệt trắng' },
      { label: '💄 Son kem lì Romand Blur Fudge', prompt: 'Son kem lì mịn môi Romand Blur Fudge Tint có những tone màu nào hot và có bị lộ rãnh môi không?' }
    ];
  }
  if (text.includes('đơn hàng') || text.includes('đổi trả') || text.includes('vận chuyển') || text.includes('ship') || text.includes('voucher')) {
    return [
      { label: '🎟️ Hướng dẫn săn Voucher kép', prompt: 'Cách săn và áp dụng đồng thời Voucher Thương Hiệu cùng Voucher Toàn Sàn Aura Beauty Mall?' },
      { label: '📞 Hotline CSKH 1900 6868', prompt: 'Tôi cần liên hệ bộ phận hỗ trợ khách hàng và khiếu nại của Aura Beauty Mall qua các kênh nào?' },
      { label: '🏪 Hướng dẫn mở shop Official Mall', prompt: 'Làm sao để tôi đăng ký mở gian hàng Official Mall trên sàn Aura Beauty Mall?' }
    ];
  }
  return [
    { label: '🌿 Routine da dầu mụn bã nhờn', prompt: 'Tư vấn giúp tôi phác đồ chăm sóc cho da dầu mụn, bã nhờn và lỗ chân lông to với BHA và Niacinamide' },
    { label: '💧 Routine cấp ẩm phục hồi da', prompt: 'Đề xuất routine 3 bước phục hồi cấp ẩm sâu cho da khô nhạy cảm với Hyaluronic Acid và Ceramide' },
    { label: '📦 Tra cứu đơn hàng của tôi', prompt: 'Làm thế nào để tôi kiểm tra trạng thái và tra cứu đơn hàng của mình?' }
  ];
}

export default function SupportChat({
  skinProfile,
  user,
  onSelectProduct,
  onNavigateOrderTracking,
  onNavigateCatalog,
  onNavigateSeller
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [showPreview, setShowPreview] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeCategory, setActiveCategory] = useState('popular');

  // Initial welcome greeting with preloaded bestsellers
  const initialGreeting = {
    id: 'msg-welcome',
    sender: 'ai',
    time: 'Vừa xong',
    text: `✨ **Xin chào ${user?.name ? user.name : 'bạn'}!** Tôi là **Dược Sĩ Da Liễu AI & Chuyên Viên CSKH của Aura Beauty Mall**.

Tôi sẵn sàng hỗ trợ bạn chu đáo 24/7 với dữ liệu chuẩn y khoa:
• **Bắt bệnh & xây dựng Routine**: Chẩn đoán theo loại da và thành phần INCI an toàn.
• **Gợi ý mỹ phẩm chính hãng**: Sản phẩm có Số công bố mỹ phẩm (CBMP) từ Bộ Y Tế.
• **Chính sách đổi trả 7 ngày**: Hoàn tiền 100%, đền bù 200% nếu phát hiện hàng giả.
• **Vận chuyển & Phí ship**: Giao hỏa tốc 2h, Freeship đơn từ 299k.
• **Kênh Người Bán (Seller)**: Hướng dẫn đăng ký gian hàng và cấp tick Official Mall.

👉 *Dưới đây là một số dòng sản phẩm được bác sĩ da liễu khuyên dùng nhiều nhất trên sàn:*`,
    recommendedProducts: getMatchedProductsForQuery('best sellers')
  };

  const [messages, setMessages] = useState([initialGreeting]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (showPreview) {
      const timer = setTimeout(() => setShowPreview(false), 9000);
      return () => clearTimeout(timer);
    }
  }, [showPreview]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const handleOpenChat = () => {
    setIsOpen(true);
    setUnreadCount(0);
    setShowPreview(false);
  };

  const handleResetChat = () => {
    if (isStreaming) return;
    setMessages([
      {
        id: 'msg-welcome-' + Date.now(),
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Đã làm mới phiên tư vấn! Tôi có thể hỗ trợ thông tin gì thêm cho ${user?.name ? user.name : 'bạn'}?`
      }
    ]);
  };

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isStreaming) return;

    const userMsg = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: text
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsStreaming(true);

    const aiMsgId = 'ai-' + (Date.now() + 1);
    setMessages((prev) => [
      ...prev,
      {
        id: aiMsgId,
        sender: 'ai',
        time: 'Đang suy nghĩ...',
        text: '',
        recommendedProducts: []
      }
    ]);

    streamAdvisorChat(
      text,
      skinProfile,
      (chunk) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === aiMsgId ? { ...m, text: chunk } : m))
        );
      },
      (fullText, matchedProducts) => {
        setIsStreaming(false);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgId
              ? {
                  ...m,
                  text: fullText,
                  recommendedProducts: matchedProducts || [],
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
              : m
          )
        );
      },
      (err) => {
        setIsStreaming(false);
      },
      user
    );
  };

  const handleViewProduct = (product) => {
    if (onSelectProduct) {
      onSelectProduct(product);
      // Giữ chat mở hoặc đóng tùy người dùng, ở đây có thể tạm thu nhỏ để xem trang
      // setIsOpen(false);
    }
  };

  const activeSuggestions = SUGGESTION_ITEMS[activeCategory] || SUGGESTION_ITEMS.popular;

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 950,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '10px'
        }}
      >
        {/* Message Preview Toast */}
        {showPreview && !isOpen && (
          <div
            onClick={handleOpenChat}
            style={{
              background: '#0f172a',
              color: '#ffffff',
              padding: '11px 16px',
              borderRadius: '16px',
              fontSize: '13px',
              boxShadow: '0 12px 28px -5px rgba(0, 0, 0, 0.35)',
              maxWidth: '280px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              border: '1px solid rgba(255,255,255,0.15)',
              animation: 'scaleUp 200ms ease'
            }}
          >
            <div style={{ background: '#ec4899', padding: '6px', borderRadius: '50%', flexShrink: 0, display: 'flex' }}>
              <Sparkles size={14} style={{ color: '#ffffff' }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '12px', color: '#f472b6' }}>Dược Sĩ AI Đang Trực Tuyến</div>
              <div style={{ fontSize: '12px', color: '#cbd5e1' }}>Cần tư vấn routine chuẩn y khoa hay tra cứu đơn không bạn?</div>
            </div>
          </div>
        )}

        <button
          onClick={handleOpenChat}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#ffffff',
            boxShadow: '0 10px 25px rgba(15, 23, 42, 0.4), 0 0 0 2px rgba(236, 72, 153, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            cursor: 'pointer',
            border: 'none',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          title="Tư vấn Dược Sĩ AI & CSKH Aura Beauty Mall"
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <MessageCircle size={28} />
          {/* Online green indicator dot */}
          <span
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '13px',
              height: '13px',
              borderRadius: '50%',
              background: '#10b981',
              border: '2px solid #0f172a'
            }}
          />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                left: '-4px',
                background: '#ec4899',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 800,
                borderRadius: '50%',
                width: '22px',
                height: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(236, 72, 153, 0.5)'
              }}
            >
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Expandable Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '450px',
            maxWidth: 'calc(100vw - 32px)',
            height: '640px',
            maxHeight: 'calc(100vh - 48px)',
            background: '#ffffff',
            borderRadius: '22px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0,0,0,0.08)',
            zIndex: 1100,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'scaleUp 200ms ease'
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              padding: '14px 18px',
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(236, 72, 153, 0.4)'
                }}
              >
                <Bot size={22} style={{ color: '#ffffff' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 750, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Dược Sĩ AI Aura Beauty Mall
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                </h4>
                <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0 0' }}>
                  RAG Da Liễu Y Khoa & CSKH Toàn Sàn 24/7
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={handleResetChat}
                title="Làm mới hội thoại"
                disabled={isStreaming}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#cbd5e1',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: isStreaming ? 'not-allowed' : 'pointer'
                }}
              >
                <RotateCcw size={15} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Đóng chat"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#cbd5e1',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Suggestion Categories & Quick prompt chips */}
          <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            {/* 1. Category Tabs */}
            <div
              style={{
                padding: '8px 12px 4px 12px',
                display: 'flex',
                gap: '6px',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                scrollbarWidth: 'none'
              }}
            >
              {SUGGESTION_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    style={{
                      fontSize: '11px',
                      fontWeight: isActive ? 750 : 600,
                      padding: '4px 10px',
                      background: isActive ? '#ec4899' : '#ffffff',
                      color: isActive ? '#ffffff' : '#64748b',
                      border: isActive ? '1px solid #db2777' : '1px solid #e2e8f0',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'all 0.15s ease',
                      boxShadow: isActive ? '0 2px 6px rgba(236,72,153,0.3)' : 'none'
                    }}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {/* 2. Prompt Chips in Active Category */}
            <div
              style={{
                padding: '6px 12px 10px 12px',
                display: 'flex',
                gap: '6px',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                scrollbarWidth: 'none'
              }}
            >
              {activeSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.prompt)}
                  disabled={isStreaming}
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 600,
                    padding: '4px 11px',
                    background: '#ffffff',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    borderRadius: '16px',
                    cursor: isStreaming ? 'not-allowed' : 'pointer',
                    flexShrink: 0,
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#ec4899';
                    e.currentTarget.style.color = '#ec4899';
                    e.currentTarget.style.background = '#fdf2f8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.color = '#334155';
                    e.currentTarget.style.background = '#ffffff';
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Body */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              background: '#f8fafc'
            }}
          >
            {messages.map((m) => {
              const isAi = m.sender === 'ai';
              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    flexDirection: isAi ? 'row' : 'row-reverse',
                    alignItems: 'flex-start',
                    gap: '10px'
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: isAi ? '#fdf2f8' : '#0f172a',
                      color: isAi ? '#ec4899' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      border: isAi ? '1px solid #fbcfe8' : 'none'
                    }}
                  >
                    {isAi ? <Bot size={18} /> : <User size={18} />}
                  </div>

                  <div style={{ maxWidth: '88%', width: isAi ? '88%' : 'auto' }}>
                    <div
                      style={{
                        padding: '14px 18px',
                        borderRadius: '18px',
                        borderTopLeftRadius: isAi ? '4px' : '18px',
                        borderTopRightRadius: !isAi ? '4px' : '18px',
                        background: isAi ? '#ffffff' : '#0f172a',
                        color: isAi ? '#1f2937' : '#ffffff',
                        fontSize: '13px',
                        boxShadow: isAi ? '0 3px 12px rgba(0,0,0,0.05), 0 0 0 1px #e2e8f0' : 'none'
                      }}
                    >
                      {/* Nội dung câu trả lời được format rõ ràng */}
                      {formatMessageContent(m.text, isAi) || (isStreaming ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', padding: '6px 0' }}>
                          <RefreshCw size={14} className="animate-spin" />
                          <span>Dược sĩ AI đang phân tích dữ liệu y khoa & tìm kiếm sản phẩm...</span>
                        </div>
                      ) : null)}

                      {/* KHỐI ĐỀ XUẤT SẢN PHẨM (Ảnh, Tên, Giá, Nút xem chi tiết) */}
                      {isAi && m.recommendedProducts && m.recommendedProducts.length > 0 && (
                        <div
                          style={{
                            marginTop: '16px',
                            paddingTop: '12px',
                            borderTop: '1px solid #f1f5f9'
                          }}
                        >
                          <div
                            style={{
                              fontSize: '12px',
                              fontWeight: 800,
                              color: '#0f172a',
                              marginBottom: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}
                          >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Sparkles size={14} style={{ color: '#ec4899' }} />
                              Gợi ý sản phẩm chính hãng phù hợp:
                            </span>
                            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                              {m.recommendedProducts.length} sản phẩm
                            </span>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {m.recommendedProducts.map((prod) => {
                              const displayPrice = prod.variants?.[0]?.price || prod.flashSalePrice || 350000;
                              const originalPrice = prod.variants?.[0]?.originalPrice || prod.flashSaleOriginal;
                              const imgUrl = prod.images?.[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800';

                              return (
                                <div
                                  key={prod.id}
                                  style={{
                                    display: 'flex',
                                    gap: '12px',
                                    padding: '10px',
                                    background: '#ffffff',
                                    borderRadius: '14px',
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                                    alignItems: 'center',
                                    transition: 'all 0.2s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#ec4899';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(236,72,153,0.12)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                    e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.03)';
                                  }}
                                >
                                  {/* Ảnh sản phẩm */}
                                  <div style={{ position: 'relative', width: '74px', height: '74px', flexShrink: 0 }}>
                                    <img
                                      src={imgUrl}
                                      alt={prod.name}
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '10px',
                                        border: '1px solid #f1f5f9'
                                      }}
                                    />
                                    <span
                                      style={{
                                        position: 'absolute',
                                        bottom: '2px',
                                        left: '2px',
                                        background: 'rgba(15, 23, 42, 0.85)',
                                        color: '#ffffff',
                                        fontSize: '9px',
                                        fontWeight: 700,
                                        padding: '1px 4px',
                                        borderRadius: '4px'
                                      }}
                                    >
                                      Mall
                                    </span>
                                  </div>

                                  {/* Thông tin sản phẩm */}
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                      <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#ec4899', textTransform: 'uppercase' }}>
                                        {prod.brand}
                                      </span>
                                      {prod.rating && (
                                        <span style={{ fontSize: '10.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                          <Star size={10} style={{ fill: '#eab308', color: '#eab308' }} /> {prod.rating}
                                        </span>
                                      )}
                                    </div>

                                    <h5
                                      style={{
                                        fontSize: '12.5px',
                                        fontWeight: 700,
                                        color: '#0f172a',
                                        margin: '0 0 4px 0',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                      }}
                                      title={prod.name}
                                    >
                                      {prod.name}
                                    </h5>

                                    {/* Giá tiền */}
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '6px' }}>
                                      <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#e11d48' }}>
                                        {formatPrice(displayPrice)}
                                      </span>
                                      {originalPrice && originalPrice > displayPrice && (
                                        <span style={{ fontSize: '11px', color: '#94a3b8', textDecoration: 'line-through' }}>
                                          {formatPrice(originalPrice)}
                                        </span>
                                      )}
                                    </div>

                                    {/* Nút bấm xem thông tin sản phẩm */}
                                    <button
                                      onClick={() => handleViewProduct(prod)}
                                      style={{
                                        background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '5px 10px',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 6px rgba(236,72,153,0.25)',
                                        transition: 'transform 0.15s ease'
                                      }}
                                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                    >
                                      <Eye size={12} /> Xem thông tin sản phẩm →
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Nút hành động theo ngữ cảnh (Tra cứu đơn hàng, Kênh người bán, Hotline) */}
                      {isAi && m.text && (
                        <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px dashed #e2e8f0', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {m.text.includes('Tra cứu đơn hàng') && onNavigateOrderTracking && (
                            <button
                              onClick={() => {
                                onNavigateOrderTracking();
                                setIsOpen(false);
                              }}
                              style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                background: '#ecfdf5',
                                color: '#059669',
                                border: '1px solid #a7f3d0',
                                padding: '4px 10px',
                                borderRadius: '12px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                cursor: 'pointer'
                              }}
                            >
                              <Truck size={12} /> Mở trang Tra Cứu Đơn Hàng →
                            </button>
                          )}

                          {m.text.includes('Official Mall') && onNavigateSeller && (
                            <button
                              onClick={() => {
                                onNavigateSeller();
                                setIsOpen(false);
                              }}
                              style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                background: '#f5f3ff',
                                color: '#7c3aed',
                                border: '1px solid #ddd6fe',
                                padding: '4px 10px',
                                borderRadius: '12px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                cursor: 'pointer'
                              }}
                            >
                              <ShoppingBag size={12} /> Vào Kênh Người Bán →
                            </button>
                          )}

                          {m.text.includes('1900 6868') && (
                            <a
                              href="tel:19006868"
                              style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                background: '#fff1f2',
                                color: '#e11d48',
                                border: '1px solid #fecdd3',
                                padding: '4px 10px',
                                borderRadius: '12px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                textDecoration: 'none'
                              }}
                            >
                              <PhoneCall size={12} /> Gọi Hotline 1900 6868
                            </a>
                          )}
                        </div>
                      )}

                      {/* Gợi ý câu hỏi tiếp theo theo ngữ cảnh câu trả lời */}
                      {isAi && m.text && !isStreaming && (
                        <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed #e2e8f0' }}>
                          <div
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              color: '#ec4899',
                              marginBottom: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Sparkles size={11} /> Gợi ý câu hỏi tiếp theo cho bạn:
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                            {getFollowUpChips(m.text).map((chip, cIdx) => (
                              <button
                                key={cIdx}
                                onClick={() => handleSendMessage(chip.prompt)}
                                disabled={isStreaming}
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  background: '#f8fafc',
                                  color: '#334155',
                                  border: '1px solid #e2e8f0',
                                  borderRadius: '12px',
                                  padding: '4px 8px',
                                  cursor: isStreaming ? 'not-allowed' : 'pointer',
                                  textAlign: 'left',
                                  transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = '#ec4899';
                                  e.currentTarget.style.color = '#ec4899';
                                  e.currentTarget.style.background = '#fdf2f8';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = '#e2e8f0';
                                  e.currentTarget.style.color = '#334155';
                                  e.currentTarget.style.background = '#f8fafc';
                                }}
                              >
                                {chip.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <span
                      style={{
                        fontSize: '10px',
                        color: '#94a3b8',
                        marginTop: '4px',
                        display: 'block',
                        textAlign: isAi ? 'left' : 'right',
                        padding: '0 4px'
                      }}
                    >
                      {m.time}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{
              padding: '12px 16px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#ffffff'
            }}
          >
            <input
              type="text"
              placeholder="Nhập câu hỏi (routine mụn, BHA, đơn hàng, son môi...)"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isStreaming}
              style={{
                flex: 1,
                borderRadius: '24px',
                padding: '10px 18px',
                fontSize: '13px',
                border: '1px solid #cbd5e1',
                outline: 'none',
                background: '#f8fafc',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => (e.target.style.borderColor = '#ec4899')}
              onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isStreaming}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: !inputMessage.trim() || isStreaming ? '#cbd5e1' : 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                cursor: !inputMessage.trim() || isStreaming ? 'not-allowed' : 'pointer',
                boxShadow: !inputMessage.trim() || isStreaming ? 'none' : '0 4px 12px rgba(236, 72, 153, 0.4)',
                transition: 'all 0.2s ease'
              }}
            >
              {isStreaming ? <RefreshCw size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
