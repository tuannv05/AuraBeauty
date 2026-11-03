import React, { useState } from 'react';
import {
  X, Lock, Mail, User, Shield, Store, ShoppingBag, Eye, EyeOff,
  CheckCircle2, AlertCircle, Sparkles, Building, MapPin, FileText, Check
} from 'lucide-react';
import { USER_ROLES, apiLogin, apiRegister } from '../api';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register State
  const [registerRole, setRegisterRole] = useState('BUYER'); // 'BUYER' | 'SELLER'
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Seller specific fields
  const [shopName, setShopName] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [shopAddress, setShopAddress] = useState('');

  // Status State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Password strength calculation
  const calculatePasswordStrength = (pwd) => {
    let score = 0;
    if (!pwd) return { score: 0, text: 'Chưa nhập', color: '#94a3b8', percent: 0 };
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score === 1) return { score, text: 'Yếu', color: '#ef4444', percent: 25 };
    if (score === 2) return { score, text: 'Trung bình', color: '#f59e0b', percent: 50 };
    if (score === 3) return { score, text: 'Khá mạnh', color: '#3b82f6', percent: 75 };
    if (score === 4) return { score, text: 'Rất mạnh', color: '#10b981', percent: 100 };
    return { score: 0, text: 'Quá ngắn', color: '#ef4444', percent: 15 };
  };

  const pwdStrength = calculatePasswordStrength(regPassword);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const result = await apiLogin(email, password);
      setSuccessMsg('Đăng nhập thành công!');
      setTimeout(() => {
        onLoginSuccess(result.user || result);
        onClose();
      }, 500);
    } catch (err) {
      setErrorMsg(err.message || 'Email hoặc mật khẩu không chính xác.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (regPassword.length < 8) {
      setErrorMsg('Mật khẩu phải có tối thiểu 8 ký tự.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('Vui lòng đồng ý với Điều khoản dịch vụ để tiếp tục.');
      return;
    }

    if (registerRole === 'SELLER' && !shopName.trim()) {
      setErrorMsg('Vui lòng nhập tên gian hàng của bạn.');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        fullName: fullName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        role: registerRole,
        shopName: registerRole === 'SELLER' ? shopName.trim() : null
      };

      const result = await apiRegister(payload);
      setSuccessMsg(
        registerRole === 'SELLER'
          ? 'Đăng ký gian hàng thành công! Đang chuyển đến bảng quản trị người bán...'
          : 'Đăng ký tài khoản thành công! Đang chuyển đến trung tâm mua sắm...'
      );

      setTimeout(() => {
        onLoginSuccess(result.user || result);
        onClose();
      }, 700);
    } catch (err) {
      setErrorMsg(err.message || 'Đăng ký không thành công. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (roleKey) => {
    setErrorMsg('');
    const demoUser = USER_ROLES[roleKey];
    onLoginSuccess(demoUser);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '480px',
          maxHeight: '90vh',
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header Modal */}
        <div
          style={{
            padding: '20px 24px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>✨</span>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, letterSpacing: '-0.3px' }}>
                {activeTab === 'login' ? 'Đăng Nhập Hệ Thống' : 'Tạo Tài Khoản Mới'}
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>
              Hệ thống mỹ phẩm đa kênh Aura Beauty Mall
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              flex: 1,
              padding: '14px 16px',
              fontSize: '13px',
              fontWeight: 700,
              border: 'none',
              background: activeTab === 'login' ? '#ffffff' : 'transparent',
              color: activeTab === 'login' ? '#ec4899' : '#64748b',
              borderBottom: activeTab === 'login' ? '3px solid #ec4899' : '3px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              flex: 1,
              padding: '14px 16px',
              fontSize: '13px',
              fontWeight: 700,
              border: 'none',
              background: activeTab === 'register' ? '#ffffff' : 'transparent',
              color: activeTab === 'register' ? '#ec4899' : '#64748b',
              borderBottom: activeTab === 'register' ? '3px solid #ec4899' : '3px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Đăng Ký Thành Viên
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {/* Error Message */}
          {errorMsg && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                padding: '12px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div
              style={{
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                color: '#065f46',
                padding: '12px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          {activeTab === 'login' ? (
            /* =========================================================================
               TAB ĐĂNG NHẬP
               ========================================================================= */
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Email đăng nhập
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '0 12px',
                    background: '#f8fafc',
                    transition: 'border-color 0.2s'
                  }}
                >
                  <Mail size={16} style={{ color: '#94a3b8', marginRight: '10px' }} />
                  <input
                    type="email"
                    required
                    placeholder="VD: buyer@cosmetics.com hoặc email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      border: 'none',
                      outline: 'none',
                      padding: '11px 0',
                      fontSize: '13px',
                      width: '100%',
                      background: 'transparent'
                    }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                    Mật khẩu
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Vui lòng liên hệ Admin qua hotline 1900 6868 hoặc đăng nhập nhanh bằng tài khoản mẫu bên dưới để kiểm tra.')}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      fontSize: '11px',
                      color: '#ec4899',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '0 12px',
                    background: '#f8fafc'
                  }}
                >
                  <Lock size={16} style={{ color: '#94a3b8', marginRight: '10px' }} />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      border: 'none',
                      outline: 'none',
                      padding: '11px 0',
                      fontSize: '13px',
                      width: '100%',
                      background: 'transparent'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: '#94a3b8',
                      cursor: 'pointer'
                    }}
                  >
                    {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ accentColor: '#ec4899', width: '15px', height: '15px' }}
                  />
                  Ghi nhớ phiên đăng nhập
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  background: isLoading ? '#94a3b8' : 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '13px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)',
                  transition: 'all 0.2s'
                }}
              >
                {isLoading ? 'Đang xác thực...' : 'Đăng Nhập'}
              </button>

              {/* Phím tắt đăng nhập nhanh phục vụ Demo/Đánh giá hệ thống */}
              <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '16px', marginTop: '4px' }}>
                <p style={{ fontSize: '11px', color: '#64748b', fontWeight: 650, marginBottom: '10px', textAlign: 'center' }}>
                  ⚡ Hoặc đăng nhập nhanh bằng tài khoản thử nghiệm:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('BUYER')}
                    style={{
                      background: '#eff6ff',
                      color: '#1d4ed8',
                      border: '1px solid #bfdbfe',
                      borderRadius: '8px',
                      padding: '10px 4px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'background 0.2s'
                    }}
                  >
                    <ShoppingBag size={16} />
                    <span>Khách Mua</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('SELLER')}
                    style={{
                      background: '#fdf2f8',
                      color: '#be185d',
                      border: '1px solid #fbcfe8',
                      borderRadius: '8px',
                      padding: '10px 4px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'background 0.2s'
                    }}
                  >
                    <Store size={16} />
                    <span>Người Bán</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('ADMIN')}
                    style={{
                      background: '#fef3c7',
                      color: '#b45309',
                      border: '1px solid #fde68a',
                      borderRadius: '8px',
                      padding: '10px 4px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'background 0.2s'
                    }}
                  >
                    <Shield size={16} />
                    <span>Quản Trị</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* =========================================================================
               TAB ĐĂNG KÝ TÀI KHOẢN MỚI
               ========================================================================= */
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '8px' }}>
                  Chọn loại tài khoản đăng ký:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setRegisterRole('BUYER')}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      border: registerRole === 'BUYER' ? '2px solid #ec4899' : '1.5px solid #e2e8f0',
                      background: registerRole === 'BUYER' ? '#fdf2f8' : '#ffffff',
                      color: registerRole === 'BUYER' ? '#ec4899' : '#475569',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <ShoppingBag size={18} />
                    <span>Khách Mua Hàng</span>
                    <span style={{ fontSize: '10px', fontWeight: 500, color: '#94a3b8' }}>Mua sắm & Phân tích da</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegisterRole('SELLER')}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      border: registerRole === 'SELLER' ? '2px solid #ec4899' : '1.5px solid #e2e8f0',
                      background: registerRole === 'SELLER' ? '#fdf2f8' : '#ffffff',
                      color: registerRole === 'SELLER' ? '#ec4899' : '#475569',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Store size={18} />
                    <span>Người Bán (Shop)</span>
                    <span style={{ fontSize: '10px', fontWeight: 500, color: '#94a3b8' }}>Mở gian hàng mỹ phẩm</span>
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Họ và tên
                </label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '0 12px', background: '#f8fafc' }}>
                  <User size={16} style={{ color: '#94a3b8', marginRight: '10px' }} />
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Thị Lan Anh"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{ border: 'none', outline: 'none', padding: '10px 0', fontSize: '13px', width: '100%', background: 'transparent' }}
                  />
                </div>
              </div>

              {registerRole === 'SELLER' && (
                <>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                      Tên gian hàng mỹ phẩm <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '0 12px', background: '#f8fafc' }}>
                      <Building size={16} style={{ color: '#ec4899', marginRight: '10px' }} />
                      <input
                        type="text"
                        required
                        placeholder="VD: Seoul Skin Official Store"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        style={{ border: 'none', outline: 'none', padding: '10px 0', fontSize: '13px', width: '100%', background: 'transparent' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                      Mã số thuế / CCCD kinh doanh (Tùy chọn)
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '0 12px', background: '#f8fafc' }}>
                      <FileText size={16} style={{ color: '#94a3b8', marginRight: '10px' }} />
                      <input
                        type="text"
                        placeholder="VD: 0312345678"
                        value={taxCode}
                        onChange={(e) => setTaxCode(e.target.value)}
                        style={{ border: 'none', outline: 'none', padding: '10px 0', fontSize: '13px', width: '100%', background: 'transparent' }}
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Email đăng ký
                </label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '0 12px', background: '#f8fafc' }}>
                  <Mail size={16} style={{ color: '#94a3b8', marginRight: '10px' }} />
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    style={{ border: 'none', outline: 'none', padding: '10px 0', fontSize: '13px', width: '100%', background: 'transparent' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Mật khẩu (Tối thiểu 8 ký tự)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '0 12px', background: '#f8fafc' }}>
                  <Lock size={16} style={{ color: '#94a3b8', marginRight: '10px' }} />
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    placeholder="Nhập mật khẩu an toàn..."
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    style={{ border: 'none', outline: 'none', padding: '10px 0', fontSize: '13px', width: '100%', background: 'transparent' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    style={{ background: 'none', border: 'none', padding: 0, color: '#94a3b8', cursor: 'pointer' }}
                  >
                    {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {regPassword && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                      <span style={{ color: '#64748b' }}>Độ mạnh mật khẩu:</span>
                      <span style={{ fontWeight: 700, color: pwdStrength.color }}>{pwdStrength.text}</span>
                    </div>
                    <div style={{ height: '4px', width: '100%', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${pwdStrength.percent}%`,
                          background: pwdStrength.color,
                          transition: 'width 0.3s ease-in-out'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Xác nhận lại mật khẩu
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: regConfirmPassword && regPassword !== regConfirmPassword ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '0 12px',
                    background: '#f8fafc'
                  }}
                >
                  <Lock size={16} style={{ color: '#94a3b8', marginRight: '10px' }} />
                  <input
                    type={showRegConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Nhập lại mật khẩu..."
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    style={{ border: 'none', outline: 'none', padding: '10px 0', fontSize: '13px', width: '100%', background: 'transparent' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                    style={{ background: 'none', border: 'none', padding: 0, color: '#94a3b8', cursor: 'pointer' }}
                  >
                    {showRegConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {regConfirmPassword && regPassword !== regConfirmPassword && (
                  <p style={{ fontSize: '11px', color: '#ef4444', margin: '4px 0 0 0' }}>
                    Mật khẩu xác nhận chưa khớp!
                  </p>
                )}
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#475569', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    style={{ accentColor: '#ec4899', width: '16px', height: '16px', marginTop: '2px' }}
                  />
                  <span>
                    Tôi đồng ý với <strong style={{ color: '#ec4899' }}>Điều khoản sử dụng</strong> và <strong style={{ color: '#ec4899' }}>Chính sách bảo mật</strong> của Aura Beauty Mall.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  background: isLoading ? '#94a3b8' : 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '13px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)',
                  transition: 'all 0.2s',
                  marginTop: '4px'
                }}
              >
                {isLoading
                  ? 'Đang khởi tạo tài khoản...'
                  : registerRole === 'SELLER'
                  ? '🚀 Đăng Ký & Mở Gian Hàng'
                  : '✨ Đăng Ký Tài Khoản Khách Mua'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
