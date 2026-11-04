import React, { useState } from 'react';
import {
  ShieldCheck, Check, ArrowRight, ArrowLeft, Truck, CreditCard,
  QrCode, Wallet, CheckCircle2, AlertCircle, Phone, Lock, Building
} from 'lucide-react';
import { placeOrder } from '../api';

export default function CheckoutView({
  checkoutData,
  user,
  onOrderSuccess,
  onBackToCart,
  onAddToast
}) {
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmation

  // Step 1 Form States
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '0901234567');
  const [email, setEmail] = useState(user?.email || 'buyer@cosmetics.com');
  const [province, setProvince] = useState('TP. Hồ Chí Minh');
  const [district, setDistrict] = useState('Quận 1');
  const [ward, setWard] = useState('Phường Bến Nghé');
  const [streetAddress, setStreetAddress] = useState('123 Đường Nguyễn Huệ');
  const [addressType, setAddressType] = useState('HOME'); // 'HOME' | 'OFFICE'
  const [formErrors, setFormErrors] = useState({});

  // VAT Invoice state
  const [needVatInvoice, setNeedVatInvoice] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');

  // Step 2 Shipping & Payment States
  const [shippingMethod, setShippingMethod] = useState('STANDARD'); // 'STANDARD' | 'EXPRESS' | 'NOW2H'
  const [paymentMethod, setPaymentMethod] = useState('QR'); // 'COD' | 'QR' | 'WALLET' | 'CARD'
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);

  // Step 3 Confirmation State
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const items = checkoutData?.selectedItems || [];
  const subtotal = checkoutData?.subtotal || items.reduce((s, i) => s + i.price * i.quantity, 0);
  const voucherDiscount = checkoutData?.voucherDiscount || 0;

  // Shipping cost based on method
  let shippingCost = subtotal >= 299000 ? 0 : 30000;
  if (shippingMethod === 'EXPRESS') shippingCost += 15000;
  if (shippingMethod === 'NOW2H') shippingCost += 35000;

  const pointsDiscount = useLoyaltyPoints ? 50000 : 0;
  const finalTotal = Math.max(0, subtotal - voucherDiscount - pointsDiscount + shippingCost);

  // Step 1 Validation
  const validateStep1 = () => {
    const errors = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      errors.fullName = 'Vui lòng nhập họ và tên (tối thiểu 2 ký tự).';
    } else if (/\d/.test(fullName)) {
      errors.fullName = 'Họ tên không được chứa số.';
    }

    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phone.trim() || !phoneRegex.test(phone.trim().replace(/\s/g, ''))) {
      errors.phone = 'Số điện thoại không hợp lệ (10 số chuẩn Việt Nam).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() && !emailRegex.test(email.trim())) {
      errors.email = 'Định dạng email chưa chính xác.';
    }

    if (!streetAddress.trim() || streetAddress.trim().length < 5) {
      errors.streetAddress = 'Vui lòng nhập số nhà và tên đường chi tiết (ít nhất 5 ký tự).';
    }

    if (needVatInvoice) {
      if (!companyName.trim()) errors.companyName = 'Vui lòng nhập tên công ty.';
      if (!taxCode.trim() || !/^\d{10}(\d{3})?$/.test(taxCode.trim())) {
        errors.taxCode = 'Mã số thuế phải gồm 10 hoặc 13 chữ số.';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextToPayment = () => {
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onAddToast({ type: 'error', message: 'Vui lòng hoàn thành đúng các thông tin giao hàng bắt buộc.' });
    }
  };

  const handleNextToReview = () => {
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrderFinal = async () => {
    if (!agreedTerms) {
      onAddToast({ type: 'warning', message: 'Bạn cần đồng ý với Điều khoản và Chính sách đổi trả để tiếp tục.' });
      return;
    }

    setIsSubmitting(true);
    const fullAddress = `${streetAddress}, ${ward}, ${district}, ${province}`;
    const res = await placeOrder(
      { ...user, name: fullName, phone: phone, email: email },
      items,
      fullAddress,
      paymentMethod,
      checkoutData?.orderNotes || ''
    );

    setIsSubmitting(false);
    if (res && res.data) {
      onOrderSuccess({
        ...res.data,
        shippingMethod,
        paymentMethod,
        finalTotal,
        subtotal,
        shippingCost,
        voucherDiscount,
        pointsDiscount,
        items
      });
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', paddingBottom: '60px' }}>
      {/* 11.1 Distraction-free Header */}
      <header style={{ background: '#ffffff', borderBottom: '1px solid var(--hairline)', padding: '16px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--ink)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>A</div>
            <span style={{ fontSize: '18px', fontWeight: 750 }}>Aura Beauty Mall Checkout</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981' }}>
              <Lock size={15} /> 100% Bảo Mật SSL 256-Bit
            </span>
            <span style={{ color: 'var(--text-muted)' }}>Hotline: <strong>1900 6868</strong></span>
          </div>
        </div>
      </header>

      {/* Progress Bar (3 Steps) */}
      <div className="container" style={{ margin: '24px auto 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: '640px', margin: '0 auto' }}>
          {[
            { num: 1, label: 'Giao Hàng' },
            { num: 2, label: 'Thanh Toán' },
            { num: 3, label: 'Xác Nhận' }
          ].map((s, idx) => (
            <React.Fragment key={s.num}>
              <div
                onClick={() => { if (step > s.num) setStep(s.num); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: step > s.num ? 'pointer' : 'default'
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: step >= s.num ? 'var(--ink)' : 'var(--canvas-soft)',
                    color: step >= s.num ? '#ffffff' : 'var(--text-faint)',
                    border: step >= s.num ? 'none' : '1px solid var(--hairline)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: 700
                  }}
                >
                  {step > s.num ? <Check size={16} /> : s.num}
                </div>
                <span style={{ fontSize: '13px', fontWeight: step === s.num ? 700 : 500, color: step >= s.num ? 'var(--ink)' : 'var(--text-muted)' }}>
                  {s.label}
                </span>
              </div>
              {idx < 2 && (
                <div
                  style={{
                    flex: 1,
                    height: '2px',
                    background: step > idx + 1 ? 'var(--ink)' : 'var(--hairline)',
                    margin: '0 12px'
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main 2-column checkout body */}
      <div className="container">
        <div className="checkout-grid">
          {/* Left Form Area */}
          <div style={{ minWidth: 0 }}>
            {/* STEP 1: THÔNG TIN GIAO HÀNG */}
            {step === 1 && (
              <div className="squircle-card" style={{ padding: '32px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>1. Địa Chỉ Nhận Hàng</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                  Vui lòng cung cấp chính xác địa chỉ và số điện thoại để đơn vị vận chuyển giao đúng hẹn.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 650, display: 'block', marginBottom: '4px' }}>
                      Họ và tên người nhận <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Nguyễn Văn A"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      style={{ borderColor: formErrors.fullName ? '#ef4444' : 'var(--hairline)' }}
                    />
                    {formErrors.fullName && <p style={{ fontSize: '11px', color: '#ef4444', marginTop: '3px' }}>{formErrors.fullName}</p>}
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 650, display: 'block', marginBottom: '4px' }}>
                      Số điện thoại nhận hàng <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="0901234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ borderColor: formErrors.phone ? '#ef4444' : 'var(--hairline)' }}
                    />
                    {formErrors.phone && <p style={{ fontSize: '11px', color: '#ef4444', marginTop: '3px' }}>{formErrors.phone}</p>}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 650, display: 'block', marginBottom: '4px' }}>
                    Email (nhận xác nhận đơn & hóa đơn điện tử)
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {formErrors.email && <p style={{ fontSize: '11px', color: '#ef4444', marginTop: '3px' }}>{formErrors.email}</p>}
                </div>

                {/* Administrative selects 3-levels */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 650, display: 'block', marginBottom: '4px' }}>Tỉnh / Thành phố *</label>
                    <select value={province} onChange={(e) => setProvince(e.target.value)}>
                      <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="Đà Nẵng">Đà Nẵng</option>
                      <option value="Cần Thơ">Cần Thơ</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 650, display: 'block', marginBottom: '4px' }}>Quận / Huyện *</label>
                    <select value={district} onChange={(e) => setDistrict(e.target.value)}>
                      <option value="Quận 1">Quận 1</option>
                      <option value="Quận 3">Quận 3</option>
                      <option value="Quận Bình Thạnh">Quận Bình Thạnh</option>
                      <option value="TP. Thủ Đức">TP. Thủ Đức</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 650, display: 'block', marginBottom: '4px' }}>Phường / Xã *</label>
                    <select value={ward} onChange={(e) => setWard(e.target.value)}>
                      <option value="Phường Bến Nghé">Phường Bến Nghé</option>
                      <option value="Phường Bến Thành">Phường Bến Thành</option>
                      <option value="Phường Đa Kao">Phường Đa Kao</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 650, display: 'block', marginBottom: '4px' }}>
                    Địa chỉ chi tiết (Số nhà, tên đường, tòa nhà) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Tầng 12, Tòa nhà Bitexco, 2 Hải Triều..."
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    style={{ borderColor: formErrors.streetAddress ? '#ef4444' : 'var(--hairline)' }}
                  />
                  {formErrors.streetAddress && <p style={{ fontSize: '11px', color: '#ef4444', marginTop: '3px' }}>{formErrors.streetAddress}</p>}
                </div>

                {/* Address type & VAT invoice */}
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>Loại địa chỉ:</span>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                    <input type="radio" name="addrType" checked={addressType === 'HOME'} onChange={() => setAddressType('HOME')} /> Nhà riêng
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                    <input type="radio" name="addrType" checked={addressType === 'OFFICE'} onChange={() => setAddressType('OFFICE')} /> Văn phòng
                  </label>
                </div>

                {/* VAT Invoice option */}
                <div style={{ padding: '16px', background: 'var(--canvas-soft)', borderRadius: 'var(--radius-sm)', marginBottom: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={needVatInvoice}
                      onChange={(e) => setNeedVatInvoice(e.target.checked)}
                      style={{ width: '16px', height: '16px' }}
                    />
                    Xuất hóa đơn VAT cho Công ty / Doanh nghiệp
                  </label>

                  {needVatInvoice && (
                    <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <input
                          type="text"
                          placeholder="Tên đầy đủ công ty..."
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                        />
                        {formErrors.companyName && <p style={{ fontSize: '11px', color: '#ef4444' }}>{formErrors.companyName}</p>}
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Mã số thuế (10 hoặc 13 số)..."
                          value={taxCode}
                          onChange={(e) => setTaxCode(e.target.value)}
                        />
                        {formErrors.taxCode && <p style={{ fontSize: '11px', color: '#ef4444' }}>{formErrors.taxCode}</p>}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button onClick={onBackToCart} className="btn-pill-soft" style={{ fontSize: '13px' }}>
                    <ArrowLeft size={14} /> Quay lại giỏ hàng
                  </button>
                  <button onClick={handleNextToPayment} className="btn-pill-primary" style={{ padding: '12px 28px', fontSize: '14px' }}>
                    Tiếp tục đến thanh toán <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: VẬN CHUYỂN & THANH TOÁN */}
            {step === 2 && (
              <div className="squircle-card" style={{ padding: '28px 24px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '14px', letterSpacing: '-0.01em' }}>2. Phương Thức Vận Chuyển</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                  {[
                    { id: 'STANDARD', title: 'Giao Tiêu Chuẩn (2–3 ngày)', price: subtotal >= 299000 ? 'Miễn phí' : '30.000 đ', desc: 'Đơn vị vận chuyển GHTK / Viettel Post' },
                    { id: 'EXPRESS', title: 'Giao Hàng Nhanh (1–2 ngày)', price: '45.000 đ', desc: 'Ưu tiên đóng gói và điều phối trong ngày' },
                    { id: 'NOW2H', title: 'Giao Hỏa Tốc 2 Giờ', price: '65.000 đ', desc: 'Áp dụng cho đơn hàng nội thành TP. HCM & Hà Nội' }
                  ].map((s) => (
                    <div
                      key={s.id}
                      onClick={() => setShippingMethod(s.id)}
                      style={{
                        padding: '12px 16px',
                        border: shippingMethod === s.id ? '1.5px solid var(--ink)' : '1px solid var(--hairline)',
                        borderRadius: 'var(--radius-md)',
                        background: shippingMethod === s.id ? 'var(--canvas-soft)' : '#ffffff',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: shippingMethod === s.id ? '0 1px 4px rgba(0,0,0,0.04)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingMethod === s.id}
                          onChange={() => {}}
                          style={{ width: '18px', height: '18px', minWidth: '18px', flexShrink: 0, margin: 0, cursor: 'pointer' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: '13.5px', fontWeight: 650, margin: 0, color: 'var(--ink)' }}>{s.title}</p>
                          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>{s.desc}</p>
                        </div>
                      </div>
                      <span style={{ fontSize: '13.5px', fontWeight: 700, color: s.price === 'Miễn phí' ? '#10b981' : 'var(--ink)', flexShrink: 0, marginLeft: '12px', whiteSpace: 'nowrap' }}>
                        {s.price}
                      </span>
                    </div>
                  ))}
                </div>

                <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '14px', letterSpacing: '-0.01em' }}>3. Phương Thức Thanh Toán</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                  {[
                    { id: 'QR', title: 'Chuyển Khoản Ngân Hàng Tự Động (VietQR 24/7)', desc: 'Tạo mã QR có sẵn số tiền & nội dung, hệ thống duyệt tự động sau 30 giây', icon: '📱', badge: 'Khuyên dùng' },
                    { id: 'COD', title: 'Thanh toán khi nhận hàng (COD)', desc: 'Kiểm tra hàng trước khi thanh toán tiền mặt cho bưu tá', icon: '💵', badge: 'Tiện lợi' },
                    { id: 'WALLET', title: 'Ví điện tử MoMo / ZaloPay / VNPay', desc: 'Thanh toán tức thời qua ứng dụng ví điện tử liên kết', icon: '👛' },
                    { id: 'CARD', title: 'Thẻ quốc tế Visa / MasterCard / JCB', desc: 'Cổng thanh toán bảo mật chuẩn PCI-DSS quốc tế', icon: '💳' },
                    { id: 'BNPL', title: 'Mua Trước Trả Sau 0% Lãi Suất (Fundiin / Kredivo / Home PayLater)', desc: 'Chia nhỏ đơn hàng thành 3 kỳ thanh toán nhẹ nhàng, không phụ phí ẩn', icon: '⚡', badge: '0% Lãi suất' }
                  ].map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setPaymentMethod(p.id)}
                      style={{
                        padding: '12px 16px',
                        border: paymentMethod === p.id ? '1.5px solid var(--ink)' : '1px solid var(--hairline)',
                        borderRadius: 'var(--radius-md)',
                        background: paymentMethod === p.id ? 'var(--canvas-soft)' : '#ffffff',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: paymentMethod === p.id ? '0 1px 4px rgba(0,0,0,0.04)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === p.id}
                          onChange={() => {}}
                          style={{ width: '18px', height: '18px', minWidth: '18px', flexShrink: 0, margin: 0, cursor: 'pointer' }}
                        />
                        <span style={{
                          width: '32px',
                          height: '32px',
                          minWidth: '32px',
                          borderRadius: '8px',
                          background: paymentMethod === p.id ? '#ffffff' : 'rgba(0,0,0,0.03)',
                          border: '1px solid var(--hairline)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          flexShrink: 0
                        }}>
                          {p.icon}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <p style={{ fontSize: '13.5px', fontWeight: 650, margin: 0, color: 'var(--ink)' }}>{p.title}</p>
                            {p.badge && (
                              <span style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                padding: '2px 6px',
                                borderRadius: '4px',
                                background: p.id === 'BNPL' ? '#fef3c7' : '#ecfdf5',
                                color: p.id === 'BNPL' ? '#92400e' : '#047857',
                                whiteSpace: 'nowrap'
                              }}>
                                {p.badge}
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0', lineHeight: 1.35 }}>{p.desc}</p>
                        </div>
                      </div>

                      {/* Installment breakdown if BNPL selected */}
                      {p.id === 'BNPL' && paymentMethod === 'BNPL' && (
                        <div style={{ marginTop: '4px', padding: '10px 12px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                          <div style={{ fontSize: '11px', fontWeight: 800, color: '#166534', marginBottom: '6px' }}>
                            LỊCH THANH TOÁN DỰ KIẾN (3 KỲ - 0% LÃI SUẤT):
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', textAlign: 'center' }}>
                            <div style={{ padding: '6px 4px', background: '#ffffff', borderRadius: '6px', border: '1px solid #dcfce7' }}>
                              <div style={{ fontSize: '10px', color: '#64748b' }}>Kỳ 1: Hôm nay</div>
                              <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#15803d' }}>{Math.round(finalTotal / 3).toLocaleString('vi-VN')} ₫</div>
                            </div>
                            <div style={{ padding: '6px 4px', background: '#ffffff', borderRadius: '6px', border: '1px solid #dcfce7' }}>
                              <div style={{ fontSize: '10px', color: '#64748b' }}>Kỳ 2: Sau 30 ngày</div>
                              <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#15803d' }}>{Math.round(finalTotal / 3).toLocaleString('vi-VN')} ₫</div>
                            </div>
                            <div style={{ padding: '6px 4px', background: '#ffffff', borderRadius: '6px', border: '1px solid #dcfce7' }}>
                              <div style={{ fontSize: '10px', color: '#64748b' }}>Kỳ 3: Sau 60 ngày</div>
                              <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#15803d' }}>{Math.round(finalTotal / 3).toLocaleString('vi-VN')} ₫</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Loyalty points discount option */}
                <div style={{ padding: '16px', background: 'var(--canvas-soft)', borderRadius: 'var(--radius-sm)', marginBottom: '28px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={useLoyaltyPoints}
                      onChange={(e) => setUseLoyaltyPoints(e.target.checked)}
                      style={{ width: '16px', height: '16px' }}
                    />
                    Dùng 500 điểm thành viên (Giảm ngay 50.000đ)
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button onClick={() => setStep(1)} className="btn-pill-soft" style={{ fontSize: '13px' }}>
                    <ArrowLeft size={14} /> Quay lại địa chỉ
                  </button>
                  <button onClick={handleNextToReview} className="btn-pill-primary" style={{ padding: '12px 28px', fontSize: '14px' }}>
                    Xem lại đơn hàng <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: XÁC NHẬN ĐƠN HÀNG */}
            {step === 3 && (
              <div className="squircle-card" style={{ padding: '32px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 750, marginBottom: '20px' }}>Rà Soát & Xác Nhận Đơn Hàng</h3>

                {/* Shipping info review block */}
                <div style={{ padding: '16px', background: 'var(--canvas-soft)', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' }}>Địa Chỉ Nhận Hàng</h4>
                    <button onClick={() => setStep(1)} style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'underline' }}>Sửa</button>
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: 650 }}>{fullName} · {phone}</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{streetAddress}, {ward}, {district}, {province}</p>
                </div>

                {/* Shipping & Payment method review */}
                <div style={{ padding: '16px', background: 'var(--canvas-soft)', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' }}>Vận Chuyển & Thanh Toán</h4>
                    <button onClick={() => setStep(2)} style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'underline' }}>Sửa</button>
                  </div>
                  <p style={{ fontSize: '13px', marginBottom: '2px' }}>
                    Vận chuyển: <strong>{shippingMethod === 'NOW2H' ? 'Hỏa Tốc 2 Giờ' : shippingMethod === 'EXPRESS' ? 'Giao Nhanh 1-2 ngày' : 'Giao Tiêu Chuẩn'}</strong>
                  </p>
                  <p style={{ fontSize: '13px' }}>
                    Thanh toán: <strong>{paymentMethod === 'QR' ? 'VietQR Tự Động' : paymentMethod === 'COD' ? 'Tiền mặt khi nhận hàng (COD)' : 'Ví điện tử / Thẻ'}</strong>
                  </p>
                </div>

                {/* Terms agreement checkbox */}
                <div style={{ marginBottom: '28px' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      style={{ width: '16px', height: '16px', marginTop: '2px' }}
                    />
                    <span>
                      Tôi đã đọc và đồng ý với <a href="#terms" style={{ textDecoration: 'underline', color: 'var(--accent)' }}>Điều khoản dịch vụ</a> và <a href="#privacy" style={{ textDecoration: 'underline', color: 'var(--accent)' }}>Chính sách đổi trả 7 ngày</a> của Aura Beauty Mall.
                    </span>
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button onClick={() => setStep(2)} className="btn-pill-soft" style={{ fontSize: '13px' }}>
                    <ArrowLeft size={14} /> Quay lại phương thức
                  </button>
                  <button
                    onClick={handlePlaceOrderFinal}
                    disabled={isSubmitting}
                    className="btn-pill-primary"
                    style={{ padding: '14px 36px', fontSize: '15px' }}
                  >
                    {isSubmitting ? 'Đang tạo đơn hàng...' : `Đặt Hàng Ngay (${finalTotal.toLocaleString('vi-VN')} đ)`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Summary Column */}
          <div style={{ position: 'sticky', top: '90px', height: 'fit-content' }}>
            <div className="squircle-card" style={{ padding: '24px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px' }}>
                Đơn Hàng Của Bạn ({items.length} món)
              </h4>

              {/* Items summary */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '240px', overflowY: 'auto', marginBottom: '16px', paddingRight: '4px' }}>
                {items.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <img
                      src={it.image || '/products/PROD-CRW-001.jpg'}
                      alt=""
                      style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'contain', background: '#f8fafc', padding: '2px' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.productName}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          {it.hexColor && (
                            <span
                              style={{
                                width: '9px',
                                height: '9px',
                                borderRadius: '50%',
                                backgroundColor: it.hexColor,
                                display: 'inline-block',
                                border: '1px solid rgba(0,0,0,0.15)'
                              }}
                            />
                          )}
                          SL: {it.quantity} · {it.variantTitle}
                        </span>
                        <span style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace' }}>
                          [{it.variantSku || it.skuCode}]
                        </span>
                      </div>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 700 }}>{(it.price * it.quantity).toLocaleString('vi-VN')} đ</span>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div style={{ borderTop: '1px solid var(--hairline-soft)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Tạm tính:</span>
                  <span>{subtotal.toLocaleString('vi-VN')} đ</span>
                </div>
                {voucherDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                    <span>Giảm giá voucher:</span>
                    <span>-{voucherDiscount.toLocaleString('vi-VN')} đ</span>
                  </div>
                )}
                {pointsDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                    <span>Điểm thưởng:</span>
                    <span>-{pointsDiscount.toLocaleString('vi-VN')} đ</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Phí vận chuyển:</span>
                  <span>{shippingCost === 0 ? 'Miễn phí' : `${shippingCost.toLocaleString('vi-VN')} đ`}</span>
                </div>

                <div style={{ height: '1px', background: 'var(--hairline)', margin: '4px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700 }}>Tổng cộng:</span>
                  <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--ink)' }}>
                    {finalTotal.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
