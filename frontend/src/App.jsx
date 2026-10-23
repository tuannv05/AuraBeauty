import React, { useState } from 'react';
import Navbar from './components/Navbar';
import BuyerZone from './components/BuyerZone';
import SellerZone from './components/SellerZone';
import AdminZone from './components/AdminZone';
import AiAdvisorChat from './components/AiAdvisorChat';
import { USER_ROLES } from './api';

export default function App() {
  const [activeRole, setActiveRole] = useState('BUYER'); // BUYER | SELLER | ADMIN
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSkinProfileOpen, setIsSkinProfileOpen] = useState(false);
  const [skinProfile, setSkinProfile] = useState({
    skinType: 'COMBINATION',
    concerns: ['Mụn cám', 'Thâm mụn', 'Vùng chữ T đổ dầu'],
    allergies: ['Cồn khô (Alcohol Denat)', 'Hương liệu nồng']
  });

  const currentUser = USER_ROLES[activeRole];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSkinProfile={() => setIsSkinProfileOpen(true)}
      />

      <main className="container" style={{ flex: 1, paddingBottom: '80px' }}>
        {activeRole === 'BUYER' && (
          <BuyerZone
            user={currentUser}
            cart={cart}
            setCart={setCart}
            skinProfile={skinProfile}
            setSkinProfile={setSkinProfile}
            isSkinProfileOpen={isSkinProfileOpen}
            setIsSkinProfileOpen={setIsSkinProfileOpen}
            isCartOpen={isCartOpen}
            setIsCartOpen={setIsCartOpen}
          />
        )}

        {activeRole === 'SELLER' && (
          <SellerZone user={currentUser} />
        )}

        {activeRole === 'ADMIN' && (
          <AdminZone />
        )}
      </main>

      {/* RAG AI Advisor Widget */}
      <AiAdvisorChat skinProfile={skinProfile} />

      <footer style={{ background: '#ffffff', borderTop: '1px solid var(--border-color)', padding: '16px 0', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
        <p>Hệ Thống Sàn Mỹ Phẩm Đa Người Bán & Cố Vấn Da Liễu AI (6 Microservices + Event-Driven Saga + Hexagonal Architecture)</p>
      </footer>
    </div>
  );
}
