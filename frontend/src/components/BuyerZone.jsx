import React, { useState, useEffect } from 'react';
import { fetchProducts, placeOrder } from '../api';

export default function BuyerZone({ user, cart, setCart, skinProfile, setSkinProfile, isSkinProfileOpen, setIsSkinProfileOpen, isCartOpen, setIsCartOpen }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSkinType, setSelectedSkinType] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [activeInciProduct, setActiveInciProduct] = useState(null);
  const [orderResult, setOrderResult] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [search, selectedBrand, selectedSkinType]);

  const loadProducts = async () => {
    setLoading(true);
    const data = await fetchProducts(search, selectedBrand, selectedSkinType);
    setProducts(data);
    setLoading(false);
  };

  const handleAddToCart = (product, variant) => {
    const existing = cart.find(i => i.variantSku === variant.sku);
    if (existing) {
      setCart(cart.map(i => i.variantSku === variant.sku ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          variantSku: variant.sku,
          shopId: product.shopId,
          productName: product.name,
          variantTitle: variant.title,
          price: variant.price,
          quantity: 1
        }
      ]);
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsPlacingOrder(true);
    const res = await placeOrder(user, cart, '123 Đường Nguyễn Huệ, Quận 1, TP. HCM');
    setIsPlacingOrder(false);
    if (res && res.data) {
      setOrderResult(res.data);
      setCart([]);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={{ marginTop: '20px' }}>
      {/* Search & Filters */}
      <div className="card" style={{ marginBottom: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <div style={{ flex: '2', minWidth: '240px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)' }}>TÌM KIẾM SẢN PHẨM / THÀNH PHẦN INCI</label>
          <input
            type="text"
            placeholder="Ví dụ: Hyaluronic, BHA, Niacinamide, Serum..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ flex: '1', minWidth: '160px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)' }}>LOẠI DA PHÙ HỢP</label>
          <select value={selectedSkinType} onChange={(e) => setSelectedSkinType(e.target.value)}>
            <option value="">Tất cả loại da</option>
            <option value="OILY">Da Dầu (OILY)</option>
            <option value="DRY">Da Khô (DRY)</option>
            <option value="SENSITIVE">Da Nhạy Cảm (SENSITIVE)</option>
            <option value="COMBINATION">Da Hỗn Hợp (COMBINATION)</option>
            <option value="NORMAL">Da Thường (NORMAL)</option>
          </select>
        </div>
        <div style={{ flex: '1', minWidth: '160px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)' }}>THƯƠNG HIỆU</label>
          <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
            <option value="">Tất cả thương hiệu</option>
            <option value="Innisfree">Innisfree</option>
            <option value="La Roche-Posay">La Roche-Posay</option>
            <option value="Cosrx">Cosrx</option>
          </select>
        </div>
      </div>

      {/* Product List */}
      {loading ? (
        <p>Đang tải danh mục mỹ phẩm...</p>
      ) : (
        <div className="grid-cols-3">
          {products.map((prod) => (
            <div key={prod.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span className="badge badge-pink">{prod.brand}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CBMP: {prod.registrationNumber}</span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px' }}>{prod.name}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>{prod.description}</p>
                
                {/* INCI preview */}
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '4px' }}>HOẠT CHẤT CHÍNH (INCI):</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {prod.inciIngredients?.slice(0, 3).map((inci, idx) => (
                      <span key={idx} className="badge badge-blue" style={{ fontSize: '11px' }}>
                        {inci.name}
                      </span>
                    ))}
                    {prod.inciIngredients?.length > 3 && (
                      <button
                        onClick={() => setActiveInciProduct(prod)}
                        style={{ border: 'none', background: 'none', color: 'var(--primary)', fontSize: '11px', textDecoration: 'underline', padding: '0 4px' }}
                      >
                        +{prod.inciIngredients.length - 3} chất khác
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Variants & Buy */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                <p style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>Chọn phân loại:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {prod.variants?.map((v) => (
                    <div key={v.sku} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px' }}>{v.title} - <strong style={{ color: 'var(--primary)' }}>{v.price.toLocaleString('vi-VN')} đ</strong></span>
                      <button
                        className="btn-primary"
                        style={{ padding: '4px 10px', fontSize: '12px' }}
                        onClick={() => handleAddToCart(prod, v)}
                      >
                        + Thêm
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* INCI Detail Modal */}
      {activeInciProduct && (
        <div className="modal-overlay" onClick={() => setActiveInciProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Bảng Thành Phần INCI Chi Tiết</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Sản phẩm: <strong>{activeInciProduct.name}</strong> ({activeInciProduct.brand})
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>Tên INCI chuẩn</th>
                  <th style={{ padding: '8px' }}>Công dụng</th>
                  <th style={{ padding: '8px', textAlign: 'center' }}>Gây bít tắc</th>
                  <th style={{ padding: '8px', textAlign: 'center' }}>Kích ứng</th>
                </tr>
              </thead>
              <tbody>
                {activeInciProduct.inciIngredients?.map((inci, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px', fontWeight: 500 }}>{inci.name}</td>
                    <td style={{ padding: '8px', color: 'var(--text-muted)' }}>{inci.functionCategory}</td>
                    <td style={{ padding: '8px', textAlign: 'center' }}>{inci.comedogenicRating}/5</td>
                    <td style={{ padding: '8px', textAlign: 'center' }}>{inci.irritationRating}/5</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button className="btn-outline" onClick={() => setActiveInciProduct(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal / Drawer */}
      {isCartOpen && (
        <div className="modal-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>🛒 Giỏ Hàng & Tách Đơn Hàng (Split-Order)</h3>
            {cart.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>Giỏ hàng hiện đang trống.</p>
            ) : (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  {cart.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '14px' }}>{item.productName}</p>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          Gian hàng: <span className="badge badge-blue">{item.shopId}</span> | SKU: {item.variantSku}
                        </p>
                        <p style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 'bold' }}>
                          {item.price.toLocaleString('vi-VN')} đ × {item.quantity}
                        </p>
                      </div>
                      <button
                        className="btn-danger"
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                        onClick={() => setCart(cart.filter(i => i.variantSku !== item.variantSku))}
                      >
                        Xóa
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ background: '#fdf2f8', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '16px' }}>
                    <span>Tổng thanh toán:</span>
                    <span style={{ color: 'var(--primary)' }}>{cartTotal.toLocaleString('vi-VN')} đ</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    💡 Hệ thống tự động kích hoạt Saga Orchestrator: Giữ tồn kho nguyên tử → Thanh toán Mock → Tách Sub-order theo từng Shop!
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button className="btn-outline" onClick={() => setIsCartOpen(false)}>Tiếp tục mua sắm</button>
                  <button className="btn-primary" disabled={isPlacingOrder} onClick={handleCheckout}>
                    {isPlacingOrder ? 'Đang kích hoạt Saga...' : '⚡ Đặt Hàng & Thanh Toán Ngay'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Success Modal with Split-Orders */}
      {orderResult && (
        <div className="modal-overlay" onClick={() => setOrderResult(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', color: 'var(--success)', marginBottom: '8px' }}>🎉 Đặt Hàng Thành Công! (Saga Completed)</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Mã đơn gốc (Master Order): <strong>{orderResult.orderId}</strong> - Trạng thái: <span className="badge badge-green">{orderResult.status}</span>
            </p>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Các Đơn Con Được Tách Tự Động (Sub-orders theo Seller):</h4>
              {orderResult.subOrders?.map((sub, idx) => (
                <div key={idx} style={{ background: '#f8fafc', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '6px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '13px' }}>Mã đơn con: {sub.subOrderId}</span>
                    <span className="badge badge-blue">Shop: {sub.shopId}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Tiền hàng: {sub.subTotal.toLocaleString('vi-VN')} đ | Trạng thái: <span className="badge badge-green">{sub.status}</span>
                  </p>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'right' }}>
              <button className="btn-primary" onClick={() => setOrderResult(null)}>Hoàn tất</button>
            </div>
          </div>
        </div>
      )}

      {/* Skin Profile Modal */}
      {isSkinProfileOpen && (
        <div className="modal-overlay" onClick={() => setIsSkinProfileOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>🌿 Hồ Sơ Da Khách Hàng (Skin Profile)</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Dữ liệu được lưu trữ để làm nguồn ngữ cảnh (Context) cho Trợ lý AI Advisor tư vấn chuẩn xác.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Loại da chính:</label>
                <select
                  value={skinProfile.skinType}
                  onChange={(e) => setSkinProfile({ ...skinProfile, skinType: e.target.value })}
                >
                  <option value="OILY">Da dầu (OILY)</option>
                  <option value="DRY">Da khô (DRY)</option>
                  <option value="SENSITIVE">Da nhạy cảm (SENSITIVE)</option>
                  <option value="COMBINATION">Da hỗn hợp (COMBINATION)</option>
                  <option value="NORMAL">Da thường (NORMAL)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Vấn đề về da (Concerns):</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Mụn ẩn, thâm mụn, lỗ chân lông to..."
                  value={skinProfile.concerns?.join(', ') || ''}
                  onChange={(e) => setSkinProfile({ ...skinProfile, concerns: e.target.value.split(',').map(s => s.trim()) })}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Thành phần dị ứng / Cần tránh (Allergies):</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Cồn khô (Alcohol Denat), Hương liệu (Fragrance), Paraben..."
                  value={skinProfile.allergies?.join(', ') || ''}
                  onChange={(e) => setSkinProfile({ ...skinProfile, allergies: e.target.value.split(',').map(s => s.trim()) })}
                />
              </div>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button className="btn-outline" onClick={() => setIsSkinProfileOpen(false)}>Hủy</button>
              <button className="btn-primary" onClick={() => { alert('Hồ sơ da đã được cập nhật thành công!'); setIsSkinProfileOpen(false); }}>
                Lưu hồ sơ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
