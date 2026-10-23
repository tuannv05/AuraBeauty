import React from 'react';

export default function Navbar({ activeRole, setActiveRole, cartCount, onOpenCart, onOpenSkinProfile }) {
  return (
    <header style={{ background: '#ffffff', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>✨</span>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--primary)' }}>CosmePoly</h1>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Multi-Vendor Cosmetics & RAG Advisor</p>
          </div>
        </div>

        {/* Role Navigation */}
        <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '8px', gap: '4px' }}>
          <button
            className={activeRole === 'BUYER' ? 'btn-primary' : 'btn-outline'}
            style={{ padding: '6px 14px', fontSize: '13px' }}
            onClick={() => setActiveRole('BUYER')}
          >
            🛍️ Khách Mua (Buyer)
          </button>
          <button
            className={activeRole === 'SELLER' ? 'btn-primary' : 'btn-outline'}
            style={{ padding: '6px 14px', fontSize: '13px' }}
            onClick={() => setActiveRole('SELLER')}
          >
            🏪 Người Bán (Seller)
          </button>
          <button
            className={activeRole === 'ADMIN' ? 'btn-primary' : 'btn-outline'}
            style={{ padding: '6px 14px', fontSize: '13px' }}
            onClick={() => setActiveRole('ADMIN')}
          >
            🛡️ Quản Trị (Admin)
          </button>
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {activeRole === 'BUYER' && (
            <>
              <button className="btn-outline" style={{ fontSize: '13px' }} onClick={onOpenSkinProfile}>
                🌿 Hồ Sơ Da
              </button>
              <button className="btn-primary" style={{ fontSize: '13px', position: 'relative' }} onClick={onOpenCart}>
                🛒 Giỏ Hàng {cartCount > 0 && `(${cartCount})`}
              </button>
            </>
          )}
          {activeRole === 'SELLER' && (
            <span className="badge badge-blue">Shop: Innisfree VN (APPROVED)</span>
          )}
          {activeRole === 'ADMIN' && (
            <span className="badge badge-amber">Quyền: Toàn Quyền Quản Trị</span>
          )}
        </div>
      </div>
    </header>
  );
}
