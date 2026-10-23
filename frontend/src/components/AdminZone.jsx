import React, { useState } from 'react';

export default function AdminZone() {
  const [pendingShops, setPendingShops] = useState([
    { id: 'shop-003', name: 'Some By Mi Vietnam', owner: 'seller2@cosmetics.com', taxCode: '0316889921', status: 'PENDING' }
  ]);

  const [pendingProducts, setPendingProducts] = useState([
    {
      id: 'prod-004',
      name: 'Some By Mi AHA-BHA-PHA 30 Days Miracle Toner',
      shopName: 'Some By Mi Vietnam',
      registrationNumber: 'CBMP-HCM-2024-00912',
      inciSummary: 'Tea Tree Leaf Water, Niacinamide, Salicylic Acid, Lactobionic Acid',
      status: 'PENDING_APPROVAL'
    }
  ]);

  const [ledgerEntries, setLedgerEntries] = useState([
    { id: 'TX-1001', orderId: 'ORD-100234', accountType: 'CASH_CLEARING', entryType: 'DEBIT', amount: 650000, description: 'Thu tiền khách hàng qua Cổng thanh toán' },
    { id: 'TX-1002', orderId: 'ORD-100234', accountType: 'SELLER_PAYABLE', entryType: 'CREDIT', amount: 585000, description: 'Phải trả Seller Innisfree VN (90%)' },
    { id: 'TX-1003', orderId: 'ORD-100234', accountType: 'PLATFORM_REVENUE', entryType: 'CREDIT', amount: 65000, description: 'Hoa hồng sàn thu 10%' },
    { id: 'TX-1004', orderId: 'ORD-100288', accountType: 'CASH_CLEARING', entryType: 'DEBIT', amount: 700000, description: 'Thu tiền khách hàng qua Cổng thanh toán' },
    { id: 'TX-1005', orderId: 'ORD-100288', accountType: 'SELLER_PAYABLE', entryType: 'CREDIT', amount: 630000, description: 'Phải trả Seller Innisfree VN (90%)' },
    { id: 'TX-1006', orderId: 'ORD-100288', accountType: 'PLATFORM_REVENUE', entryType: 'CREDIT', amount: 70000, description: 'Hoa hồng sàn thu 10%' }
  ]);

  const handleApproveShop = (shopId) => {
    setPendingShops(pendingShops.filter(s => s.id !== shopId));
    alert(`Đã duyệt gian hàng ${shopId} thành công! Sự kiện ShopApproved phát tán sang Kafka.`);
  };

  const handleApproveProduct = (prodId) => {
    setPendingProducts(pendingProducts.filter(p => p.id !== prodId));
    alert(`Đã duyệt sản phẩm ${prodId} thành công! Trạng thái chuyển sang PUBLISHED, tự động đồng bộ sang AI Advisor qua Kafka để đánh chỉ mục pgvector.`);
  };

  const totalDebit = ledgerEntries.filter(e => e.entryType === 'DEBIT').reduce((s, e) => s + e.amount, 0);
  const totalCredit = ledgerEntries.filter(e => e.entryType === 'CREDIT').reduce((s, e) => s + e.amount, 0);

  return (
    <div style={{ marginTop: '20px' }}>
      <div className="card" style={{ marginBottom: '20px', background: '#f8fafc' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>🛡️ Trung Tâm Điều Hành & Giám Sát Sàn Mỹ Phẩm</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Kiểm duyệt tuân thủ pháp lý (Số công bố mỹ phẩm), phê duyệt gian hàng, và kiểm toán Sổ cái kép (Double-entry Ledger).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Pending Shops */}
        <div className="card">
          <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>🏪 Duyệt Gian Hàng Mới ({pendingShops.length})</h3>
          {pendingShops.length === 0 ? (
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Không có gian hàng nào chờ duyệt.</p>
          ) : (
            pendingShops.map(s => (
              <div key={s.id} style={{ border: '1px solid var(--border-color)', borderRadius: '6px', padding: '12px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{s.name}</strong>
                  <span className="badge badge-amber">{s.status}</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>MST: {s.taxCode} | Chủ sở hữu: {s.owner}</p>
                <div style={{ marginTop: '10px', display: 'flex', gap: '6px' }}>
                  <button className="btn-success" style={{ fontSize: '12px', padding: '4px 10px' }} onClick={() => handleApproveShop(s.id)}>
                    ✓ Phê duyệt (Approve)
                  </button>
                  <button className="btn-danger" style={{ fontSize: '12px', padding: '4px 10px' }}>
                    ✕ Từ chối
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pending Products */}
        <div className="card">
          <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>🧴 Duyệt Sản Phẩm & Số Công Bố ({pendingProducts.length})</h3>
          {pendingProducts.length === 0 ? (
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Không có sản phẩm nào chờ duyệt.</p>
          ) : (
            pendingProducts.map(p => (
              <div key={p.id} style={{ border: '1px solid var(--border-color)', borderRadius: '6px', padding: '12px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{p.name}</strong>
                  <span className="badge badge-amber">{p.status}</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Shop: {p.shopName}</p>
                <p style={{ fontSize: '12px', color: '#0369a1', fontWeight: 'bold' }}>Số CBMP: {p.registrationNumber} (Đạt chuẩn)</p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Hoạt chất: {p.inciSummary}</p>
                <div style={{ marginTop: '10px', display: 'flex', gap: '6px' }}>
                  <button className="btn-success" style={{ fontSize: '12px', padding: '4px 10px' }} onClick={() => handleApproveProduct(p.id)}>
                    ✓ Duyệt & Công bố (Publish)
                  </button>
                  <button className="btn-danger" style={{ fontSize: '12px', padding: '4px 10px' }}>
                    ✕ Bác bỏ
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Double-Entry Ledger & Commission Audit */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h3 style={{ fontSize: '16px' }}>📊 Sổ Cái Kép Đối Soát (Double-Entry Ledger) & Hoa Hồng Sàn</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Đảm bảo Invariant kế toán: Tổng Nợ (Debit) luôn bằng Tổng Có (Credit).
            </p>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <span className="badge badge-blue" style={{ fontSize: '13px', padding: '6px 12px' }}>
              Tổng Nợ: {totalDebit.toLocaleString('vi-VN')} đ
            </span>
            <span className="badge badge-green" style={{ fontSize: '13px', padding: '6px 12px' }}>
              Tổng Có: {totalCredit.toLocaleString('vi-VN')} đ
            </span>
            <span className="badge badge-pink" style={{ fontSize: '13px', padding: '6px 12px' }}>
              Cân Bằng: {totalDebit === totalCredit ? '✓ Khớp 100%' : '✕ Lệch'}
            </span>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
              <th style={{ padding: '8px' }}>Mã Bút Toán</th>
              <th style={{ padding: '8px' }}>Đơn Hàng</th>
              <th style={{ padding: '8px' }}>Tài Khoản Kế Toán</th>
              <th style={{ padding: '8px' }}>Loại Bút Toán</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>Số Tiền (VND)</th>
              <th style={{ padding: '8px' }}>Mô Tả Diễn Giải</th>
            </tr>
          </thead>
          <tbody>
            {ledgerEntries.map((e, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px', fontFamily: 'monospace' }}>{e.id}</td>
                <td style={{ padding: '8px', fontFamily: 'monospace' }}>{e.orderId}</td>
                <td style={{ padding: '8px', fontWeight: 500 }}>{e.accountType}</td>
                <td style={{ padding: '8px' }}>
                  <span className={`badge ${e.entryType === 'DEBIT' ? 'badge-blue' : 'badge-green'}`}>
                    {e.entryType}
                  </span>
                </td>
                <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>
                  {e.amount.toLocaleString('vi-VN')} đ
                </td>
                <td style={{ padding: '8px', color: 'var(--text-muted)' }}>{e.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
