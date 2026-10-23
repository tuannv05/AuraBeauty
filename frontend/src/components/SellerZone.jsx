import React, { useState } from 'react';

export default function SellerZone({ user }) {
  const [subOrders, setSubOrders] = useState([
    {
      subOrderId: 'SUB-9102',
      orderId: 'ORD-100234',
      buyerEmail: 'buyer@cosmetics.com',
      status: 'CONFIRMED',
      items: [
        { productName: 'Innisfree Green Tea Seed Hyaluronic Serum', variantTitle: 'Chai 80ml', quantity: 1, unitPrice: 650000 }
      ],
      subTotal: 650000,
      createdAt: '2026-10-23 14:30'
    },
    {
      subOrderId: 'SUB-9105',
      orderId: 'ORD-100288',
      buyerEmail: 'lan.anh@gmail.com',
      status: 'SHIPPED',
      items: [
        { productName: 'Innisfree Green Tea Seed Hyaluronic Serum', variantTitle: 'Chai 30ml', quantity: 2, unitPrice: 350000 }
      ],
      subTotal: 700000,
      createdAt: '2026-10-23 15:45'
    }
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: 'Innisfree',
    description: '',
    registrationNumber: '',
    inciText: 'Water, Camellia Sinensis Leaf Extract, Propanediol, Sodium Hyaluronate',
    sku: '',
    variantTitle: '',
    price: 300000,
    stock: 100
  });

  const [sellerProducts, setSellerProducts] = useState([
    {
      id: 'prod-001',
      name: 'Innisfree Green Tea Seed Hyaluronic Serum',
      brand: 'Innisfree',
      registrationNumber: 'CBMP-HN-2024-00123',
      status: 'PUBLISHED',
      variantsCount: 2
    }
  ]);

  const handleUpdateStatus = (subOrderId, newStatus) => {
    setSubOrders(subOrders.map(sub => sub.subOrderId === subOrderId ? { ...sub, status: newStatus } : sub));
    if (newStatus === 'REJECTED') {
      alert(`Đơn con ${subOrderId} đã bị từ chối. Sự kiện bồi hoàn SubOrderRejected được phát vào Kafka: hoàn tiền phần này cho Buyer và nhả tồn kho!`);
    } else {
      alert(`Đơn con ${subOrderId} đã chuyển trạng thái sang: ${newStatus}`);
    }
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProduct.registrationNumber) {
      alert('Lỗi nghiệp vụ: Số công bố mỹ phẩm (Registration No.) là bắt buộc để gửi duyệt!');
      return;
    }
    const created = {
      id: 'prod-' + Math.floor(100 + Math.random() * 900),
      name: newProduct.name,
      brand: newProduct.brand,
      registrationNumber: newProduct.registrationNumber,
      status: 'PENDING_APPROVAL',
      variantsCount: 1
    };
    setSellerProducts([...sellerProducts, created]);
    alert('Đã tạo sản phẩm nháp và gửi Admin phê duyệt!');
    setNewProduct({
      name: '',
      brand: 'Innisfree',
      description: '',
      registrationNumber: '',
      inciText: '',
      sku: '',
      variantTitle: '',
      price: 0,
      stock: 0
    });
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <div className="card" style={{ marginBottom: '20px', background: '#f8fafc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>🏪 Quản Lý Gian Hàng: Innisfree VN Official Store</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Mã Shop: <code>shop-001</code> | Trạng thái: <span className="badge badge-green">APPROVED</span></p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Hoa hồng sàn áp dụng:</span>
            <p style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--primary)' }}>10% (Đối soát tự động qua Sổ cái)</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Sub-order Management */}
        <div className="card">
          <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>📦 Đơn Hàng Con Cần Xử Lý (Sub-Orders)</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Mỗi Shop chỉ thấy và xử lý các Sub-order thuộc về Shop mình.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {subOrders.map(sub => (
              <div key={sub.subOrderId} style={{ border: '1px solid var(--border-color)', borderRadius: '6px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '14px' }}>{sub.subOrderId}</strong>
                  <span className={`badge ${sub.status === 'CONFIRMED' ? 'badge-amber' : sub.status === 'SHIPPED' ? 'badge-blue' : 'badge-red'}`}>
                    {sub.status}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Đơn gốc: {sub.orderId} | Khách: {sub.buyerEmail}</p>
                <div style={{ margin: '8px 0', fontSize: '13px' }}>
                  {sub.items.map((it, i) => (
                    <div key={i}>• {it.productName} ({it.variantTitle}) × {it.quantity}</div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <span style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '14px' }}>
                    {sub.subTotal.toLocaleString('vi-VN')} đ
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {sub.status === 'CONFIRMED' && (
                      <>
                        <button className="btn-primary" style={{ fontSize: '12px', padding: '4px 8px' }} onClick={() => handleUpdateStatus(sub.subOrderId, 'SHIPPED')}>
                          🚚 Giao hàng
                        </button>
                        <button className="btn-danger" style={{ fontSize: '12px', padding: '4px 8px' }} onClick={() => handleUpdateStatus(sub.subOrderId, 'REJECTED')}>
                          ✖ Từ chối
                        </button>
                      </>
                    )}
                    {sub.status === 'SHIPPED' && (
                      <button className="btn-success" style={{ fontSize: '12px', padding: '4px 8px' }} onClick={() => handleUpdateStatus(sub.subOrderId, 'DELIVERED')}>
                        ✅ Đã giao thành công
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Creation Form */}
        <div className="card">
          <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>➕ Đăng Sản Phẩm Mới (Có kiểm duyệt INCI & CBMP)</h3>
          <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Tên sản phẩm mỹ phẩm:</label>
              <input
                type="text"
                required
                placeholder="VD: Kem dưỡng ẩm Trà Xanh Cân Bằng Dầu"
                value={newProduct.name}
                onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Số tiếp nhận Phiếu công bố mỹ phẩm (BẮT BUỘC):</label>
              <input
                type="text"
                required
                placeholder="VD: 12345/24/CBMP-QLD hoặc CBMP-HN-2024-0099"
                value={newProduct.registrationNumber}
                onChange={e => setNewProduct({ ...newProduct, registrationNumber: e.target.value })}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Danh sách thành phần INCI (Cách nhau bởi dấu phẩy):</label>
              <textarea
                rows="2"
                placeholder="Water, Glycerin, Niacinamide, Camellia Sinensis..."
                value={newProduct.inciText}
                onChange={e => setNewProduct({ ...newProduct, inciText: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Tên phân loại (Variant):</label>
                <input
                  type="text"
                  placeholder="VD: Chai 50ml"
                  value={newProduct.variantTitle}
                  onChange={e => setNewProduct({ ...newProduct, variantTitle: e.target.value })}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Mã SKU:</label>
                <input
                  type="text"
                  placeholder="VD: INNI-CREAM-50"
                  value={newProduct.sku}
                  onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Giá bán (VND):</label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={e => setNewProduct({ ...newProduct, price: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Tồn kho ban đầu:</label>
                <input
                  type="number"
                  value={newProduct.stock}
                  onChange={e => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
              Gửi sản phẩm sang Admin duyệt
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
