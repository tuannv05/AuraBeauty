import React, { useState, useRef, useEffect } from 'react';
import { streamAdvisorChat } from '../api';
import { cleanChatText } from './SupportChat';

export default function AiAdvisorChat({ skinProfile }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Xin chào! Tôi là Trợ lý AI Cố vấn Mỹ phẩm (RAG + INCI Analysis). Tôi có thể giúp bạn kiểm tra thành phần mỹ phẩm, phân tích kích ứng và gợi ý sản phẩm phù hợp với làn da của bạn.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || isStreaming) return;

    const newMessages = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    setInput('');
    setIsStreaming(true);

    let currentResponseIndex = newMessages.length;
    setMessages([...newMessages, { sender: 'ai', text: 'Đang tra cứu tri thức INCI và phân tích...' }]);

    streamAdvisorChat(
      query,
      skinProfile,
      (partialChunk) => {
        setMessages(prev => {
          const updated = [...prev];
          updated[currentResponseIndex] = { sender: 'ai', text: partialChunk };
          return updated;
        });
      },
      (finalText) => {
        setIsStreaming(false);
      },
      (error) => {
        setIsStreaming(false);
        setMessages(prev => [
          ...prev,
          { sender: 'ai', text: 'Có lỗi xảy ra khi kết nối tới dịch vụ AI Advisor.' }
        ]);
      }
    );
  };

  const sampleQuestions = [
    'Da dầu mụn dùng serum trà xanh này có bị bít tắc lỗ chân lông không?',
    'Phân tích thành phần Niacinamide và BHA kết hợp như thế nào?',
    'Sản phẩm nào phục hồi da nhạy cảm tốt nhất?'
  ];

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 999 }}>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          className="btn-primary"
          style={{
            borderRadius: '9999px',
            padding: '14px 20px',
            boxShadow: '0 4px 12px rgba(236, 72, 153, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px'
          }}
          onClick={() => setIsOpen(true)}
        >
          <span>🤖 Trợ Lý AI Mỹ Phẩm (RAG SSE)</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            width: '420px',
            height: '560px',
            background: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              color: '#ffffff',
              padding: '14px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold' }}>Cosmetic AI Advisor</h3>
              <p style={{ fontSize: '11px', opacity: 0.9 }}>
                Hồ sơ da: <strong>{skinProfile.skinType || 'Chưa thiết lập'}</strong>
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#fff', fontSize: '18px', padding: '0 4px' }}
            >
              ✕
            </button>
          </div>

          {/* Quick Prompts */}
          <div style={{ background: '#f8fafc', padding: '8px 12px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '6px', overflowX: 'auto' }}>
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                className="btn-outline"
                style={{ fontSize: '11px', padding: '4px 8px', whiteSpace: 'nowrap' }}
                onClick={() => handleSend(q)}
              >
                {q.length > 25 ? q.substring(0, 25) + '...' : q}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div style={{ flex: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: m.sender === 'user' ? 'var(--primary)' : '#f1f5f9',
                  color: m.sender === 'user' ? '#ffffff' : '#0f172a',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  lineHeight: '1.45',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {cleanChatText(m.text)}
              </div>
            ))}
            {isStreaming && (
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                ⚡ Đang nhận luồng Server-Sent Events...
              </span>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            style={{ padding: '10px 12px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '8px' }}
          >
            <input
              type="text"
              placeholder="Hỏi về thành phần, hoạt chất, mức độ an toàn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isStreaming}
              style={{ fontSize: '13px', padding: '8px 12px' }}
            />
            <button
              type="submit"
              className="btn-primary"
              disabled={isStreaming || !input.trim()}
              style={{ padding: '8px 14px', fontSize: '13px' }}
            >
              Gửi
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
