import React, { useState, useEffect } from 'react';
import {
  User, Shield, Sparkles, MapPin, KeyRound, Package, Check, AlertCircle,
  Plus, Trash2, Edit2, CheckCircle2, Lock, Eye, EyeOff, Save, Phone, Mail,
  Calendar, Building, Home, ArrowLeft, RefreshCw
} from 'lucide-react';
import {
  apiUpdateProfile,
  apiChangePassword,
  apiGetSkinProfile,
  apiSaveSkinProfile,
  apiGetAddresses,
  apiAddAddress,
  apiDeleteAddress,
  apiSetDefaultAddress
} from '../api';

const SKIN_TYPES_LIST = [
  { id: 'OILY', label: 'Da Dầu (Oily Skin)', desc: 'Tuyến bã nhờn hoạt động mạnh, dễ bóng dầu vùng chữ T và dễ nổi mụn.' },
  { id: 'DRY', label: 'Da Khô (Dry Skin)', desc: 'Thiếu độ ẩm và dầu tự nhiên, bề mặt da dễ bong tróc, thô ráp và căng rát.' },
  { id: 'COMBINATION', label: 'Da Hỗn Hợp (Combination)', desc: 'Dầu vùng chữ T (trán, mũi, cằm) nhưng khô hoặc bình thường ở hai bên má.' },
  { id: 'SENSITIVE', label: 'Da Nhạy Cảm (Sensitive)', desc: 'Lớp màng bảo vệ mỏng manh, dễ đỏ ửng, châm chích khi đổi thời tiết hoặc mỹ phẩm.' },
  { id: 'NORMAL', label: 'Da Thường (Normal Skin)', desc: 'Độ ẩm và dầu cân bằng hoàn hảo, lỗ chân lông nhỏ mịn, ít khuyết điểm.' }
];

const POPULAR_CONCERNS = [
  'Mụn cám & Đầu đen', 'Mụn viêm bọc sưng đỏ', 'Thâm mụn (PIH/PIE)',
  'Lỗ chân lông to', 'Nám & Đốm nâu tàn nhang', 'Chống lão hóa & Nếp nhăn',
  'Da xỉn màu thiếu sức sống', 'Phục hồi da sau peel/treatment'
];

const COMMON_ALLERGIES = [
  'Cồn khô (Alcohol Denat)', 'Hương liệu (Fragrance / Parfum)', 'Paraben',
  'Dầu khoáng (Mineral Oil)', 'Chất tạo bọt SLS/SLES', 'Silicones gây bí da'
];

export default function AccountProfileView({ user, onUpdateUser, onAddToast, onNavigateHome, onLogout }) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'skin' | 'addresses' | 'security' | 'orders'

  // Tab 1: Profile State
  const [fullName, setFullName] = useState(user?.name || user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '0901234567');
  const [gender, setGender] = useState('female');
  const [dob, setDob] = useState('2000-01-01');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Tab 2: Skin Profile State
  const [skinType, setSkinType] = useState('COMBINATION');
  const [skinTone, setSkinTone] = useState('NATURAL'); // 'FAIR' | 'NATURAL' | 'TAN'
  const [selectedConcerns, setSelectedConcerns] = useState(['Mụn cám & Đầu đen', 'Thâm mụn (PIH/PIE)']);
  const [selectedAllergies, setSelectedAllergies] = useState(['Cồn khô (Alcohol Denat)']);
  const [customAllergyInput, setCustomAllergyInput] = useState('');
  const [isSavingSkin, setIsSavingSkin] = useState(false);

  // Tab: Followed Shops State
  const [followedShops, setFollowedShops] = useState([
    { id: 'shop-001', name: 'Innisfree Official Store Vietnam', rating: 4.9, followers: '48.2k', logo: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&auto=format&fit=crop&q=80' },
    { id: 'shop-002', name: 'Cosrx Vietnam Official Mall', rating: 4.9, followers: '89.2k', logo: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=100&auto=format&fit=crop&q=80' },
    { id: 'shop-003', name: 'Anua Official Heartleaf Store', rating: 4.8, followers: '62.4k', logo: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=100&auto=format&fit=crop&q=80' }
  ]);

  // Tab 3: Address Book State
  const [addresses, setAddresses] = useState([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    recipientName: '',
    phone: '',
    province: 'TP. Hồ Chí Minh',
    district: 'Quận 1',
    ward: 'Phường Bến Nghé',
    streetAddress: '',
    isDefault: false,
    label: 'HOME'
  });

  // Tab 4: Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [isChangingPwd, setIsChangingPwd] = useState(false);

  // Load initial data
  useEffect(() => {
    loadUserSkinProfile();
    loadUserAddresses();
  }, [user]);

  const loadUserSkinProfile = async () => {
    const sp = await apiGetSkinProfile(user);
    if (sp) {
      if (sp.skinType) setSkinType(sp.skinType);
      if (sp.concerns && sp.concerns.length > 0) setSelectedConcerns(sp.concerns);
      if (sp.allergies && sp.allergies.length > 0) setSelectedAllergies(sp.allergies);
    }
  };

  const loadUserAddresses = async () => {
    const addrs = await apiGetAddresses(user);
    setAddresses(addrs);
  };

  // Handle Profile Update
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      onAddToast({ type: 'error', message: 'Họ và tên không được để trống' });
      return;
    }
    setIsUpdatingProfile(true);
    const updated = await apiUpdateProfile(user, { fullName, phone });
    setIsUpdatingProfile(false);
    onUpdateUser({ ...user, name: fullName, fullName, phone });
    onAddToast({ type: 'success', message: 'Cập nhật hồ sơ cá nhân thành công!' });
  };

  // Handle Skin Profile Save
  const handleSaveSkinProfile = async () => {
    setIsSavingSkin(true);
    const payload = {
      skinType,
      concerns: selectedConcerns,
      allergies: selectedAllergies
    };
    await apiSaveSkinProfile(user, payload);
    setIsSavingSkin(false);
    onAddToast({
      type: 'success',
      message: 'Hồ sơ da liễu đã được lưu! AI Cố vấn sẽ dùng dữ liệu này để cá nhân hóa phân tích hoạt chất INCI cho bạn.'
    });
  };

  const toggleConcern = (item) => {
    if (selectedConcerns.includes(item)) {
      setSelectedConcerns(selectedConcerns.filter((c) => c !== item));
    } else {
      setSelectedConcerns([...selectedConcerns, item]);
    }
  };

  const toggleAllergy = (item) => {
    if (selectedAllergies.includes(item)) {
      setSelectedAllergies(selectedAllergies.filter((a) => a !== item));
    } else {
      setSelectedAllergies([...selectedAllergies, item]);
    }
  };

  const handleAddCustomAllergy = (e) => {
    e.preventDefault();
    if (!customAllergyInput.trim()) return;
    if (!selectedAllergies.includes(customAllergyInput.trim())) {
      setSelectedAllergies([...selectedAllergies, customAllergyInput.trim()]);
    }
    setCustomAllergyInput('');
  };

  // Handle Password Change
  const calculatePasswordStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[0-9]/.test(pwd)) score += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 25;
    return score;
  };

  const pwdStrength = calculatePasswordStrength(newPassword);

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      onAddToast({ type: 'error', message: 'Mật khẩu mới phải có tối thiểu 8 ký tự' });
      return;
    }
    if (newPassword !== confirmPassword) {
      onAddToast({ type: 'error', message: 'Xác nhận mật khẩu mới không khớp' });
      return;
    }

    setIsChangingPwd(true);
    try {
      await apiChangePassword(user, { currentPassword, newPassword });
      setIsChangingPwd(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onAddToast({ type: 'success', message: 'Đổi mật khẩu tài khoản thành công!' });
    } catch (err) {
      setIsChangingPwd(false);
      onAddToast({ type: 'error', message: err.message || 'Mật khẩu hiện tại không chính xác' });
    }
  };

  // Handle Address Actions
  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.recipientName.trim() || !newAddress.phone.trim() || !newAddress.streetAddress.trim()) {
      onAddToast({ type: 'error', message: 'Vui lòng điền đầy đủ thông tin địa chỉ' });
      return;
    }
    const created = await apiAddAddress(user, newAddress);
    setAddresses([created, ...addresses]);
    setIsAddressModalOpen(false);
    setNewAddress({
      recipientName: '',
      phone: '',
      province: 'TP. Hồ Chí Minh',
      district: 'Quận 1',
      ward: 'Phường Bến Nghé',
      streetAddress: '',
      isDefault: false,
      label: 'HOME'
    });
    onAddToast({ type: 'success', message: 'Đã thêm địa chỉ nhận hàng mới' });
  };

  const handleDeleteAddress = async (id) => {
    await apiDeleteAddress(user, id);
    setAddresses(addresses.filter((a) => a.id !== id));
    onAddToast({ type: 'info', message: 'Đã xóa địa chỉ' });
  };

  const handleSetDefault = async (id) => {
    await apiSetDefaultAddress(user, id);
    setAddresses(addresses.map((a) => ({ ...a, isDefault: a.id === id })));
    onAddToast({ type: 'success', message: 'Đã đặt làm địa chỉ mặc định' });
  };

  const roleBadgeText = user?.role === 'ADMIN' ? 'Quản Trị Viên Sàn' : user?.role === 'SELLER' ? 'Đối Tác Bán Hàng' : 'Khách Mua Thành Viên';

  return (
    <div style={{ maxWidth: '1100px', margin: '24px auto', padding: '0 16px' }}>
      
      {/* Top Breadcrumb & Back */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button
          onClick={onNavigateHome}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: '#64748b',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ec4899')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
        >
          <ArrowLeft size={16} /> Quay lại trang chủ
        </button>
        <span style={{ fontSize: '13px', color: '#94a3b8' }}>
          Tài khoản / <strong>Trung Tâm Quản Lý Thông Tin</strong>
        </span>
      </div>

      {/* Main Layout: Left Sidebar + Right Content Box */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px' }}>
        
        {/* Left Sidebar: Profile Card & Navigation Tabs */}
        <div>
          {/* User Profile Card */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '24px 20px',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              marginBottom: '16px'
            }}
          >
            <div
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                fontWeight: 800,
                margin: '0 auto 14px',
                boxShadow: '0 4px 14px rgba(236,72,153,0.35)'
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'C'}
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 750, color: '#0f172a', marginBottom: '4px' }}>
              {user?.name || user?.fullName || 'Khách Mua Hàng'}
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
              {user?.email || 'buyer@cosmetics.com'}
            </p>
            <span
              style={{
                background: user?.role === 'ADMIN' ? '#fef3c7' : user?.role === 'SELLER' ? '#eff6ff' : '#fdf2f8',
                color: user?.role === 'ADMIN' ? '#b45309' : user?.role === 'SELLER' ? '#1d4ed8' : '#be185d',
                fontSize: '11px',
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: '9999px',
                border: '1px solid currentColor'
              }}
            >
              {roleBadgeText}
            </span>

            {/* Quick stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', borderTop: '1px solid #f1f5f9', marginTop: '18px', paddingTop: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Loại da</span>
                <strong style={{ fontSize: '13px', color: '#ec4899' }}>{skinType}</strong>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Địa chỉ lưu</span>
                <strong style={{ fontSize: '13px', color: '#0f172a' }}>{addresses.length} địa chỉ</strong>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <button
              onClick={() => setActiveTab('profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'profile' ? '#fdf2f8' : 'transparent',
                color: activeTab === 'profile' ? '#ec4899' : '#334155',
                fontWeight: activeTab === 'profile' ? 700 : 500,
                fontSize: '13.5px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <User size={18} /> Thông tin cá nhân
            </button>

            <button
              onClick={() => setActiveTab('skin')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'skin' ? '#fdf2f8' : 'transparent',
                color: activeTab === 'skin' ? '#ec4899' : '#334155',
                fontWeight: activeTab === 'skin' ? 700 : 500,
                fontSize: '13.5px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <Sparkles size={18} style={{ color: '#ec4899' }} /> Hồ sơ da liễu độc quyền
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'addresses' ? '#fdf2f8' : 'transparent',
                color: activeTab === 'addresses' ? '#ec4899' : '#334155',
                fontWeight: activeTab === 'addresses' ? 700 : 500,
                fontSize: '13.5px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <MapPin size={18} /> Sổ địa chỉ nhận hàng
            </button>

            <button
              onClick={() => setActiveTab('followed')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'followed' ? '#fdf2f8' : 'transparent',
                color: activeTab === 'followed' ? '#ec4899' : '#334155',
                fontWeight: activeTab === 'followed' ? 700 : 500,
                fontSize: '13.5px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <Building size={18} /> Gian hàng đang theo dõi ({followedShops.length})
            </button>

            <button
              onClick={() => setActiveTab('security')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'security' ? '#fdf2f8' : 'transparent',
                color: activeTab === 'security' ? '#ec4899' : '#334155',
                fontWeight: activeTab === 'security' ? 700 : 500,
                fontSize: '13.5px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <KeyRound size={18} /> Đổi mật khẩu & Bảo mật
            </button>

            <div style={{ borderTop: '1px solid #f1f5f9', margin: '6px 0' }} />

            <button
              onClick={onLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                background: 'transparent',
                color: '#ef4444',
                fontWeight: 650,
                fontSize: '13.5px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <Lock size={18} /> Đăng xuất tài khoản
            </button>
          </div>
        </div>

        {/* Right Content Panel */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '28px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
          }}
        >
          
          {/* TAB 1: THÔNG TIN CÁ NHÂN */}
          {activeTab === 'profile' && (
            <div>
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Hồ Sơ Cá Nhân</h2>
                <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                  Quản lý thông tin hồ sơ của bạn để bảo mật tài khoản và nhận ưu đãi cá nhân hóa
                </p>
              </div>

              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '580px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Email đăng nhập (Không thể thay đổi)
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 14px' }}>
                    <Mail size={16} style={{ color: '#94a3b8', marginRight: '10px' }} />
                    <span style={{ fontSize: '13.5px', color: '#64748b', flex: 1 }}>{user?.email}</span>
                    <span style={{ fontSize: '11px', background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700 }}>
                      ✓ Đã xác thực
                    </span>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Họ và tên *
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '0 14px' }}>
                    <User size={16} style={{ color: '#94a3b8', marginRight: '10px' }} />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      style={{ border: 'none', outline: 'none', padding: '11px 0', fontSize: '13.5px', width: '100%' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Số điện thoại liên hệ *
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '0 14px' }}>
                    <Phone size={16} style={{ color: '#94a3b8', marginRight: '10px' }} />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0901234567"
                      style={{ border: 'none', outline: 'none', padding: '11px 0', fontSize: '13.5px', width: '100%' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                      Giới tính
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      style={{ border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '11px 14px', fontSize: '13.5px', width: '100%', outline: 'none', background: '#fff' }}
                    >
                      <option value="female">Nữ</option>
                      <option value="male">Nam</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                      Ngày sinh
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '0 14px' }}>
                      <Calendar size={16} style={{ color: '#94a3b8', marginRight: '8px' }} />
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        style={{ border: 'none', outline: 'none', padding: '10px 0', fontSize: '13px', width: '100%' }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ paddingTop: '10px' }}>
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    style={{
                      background: '#ec4899',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '12px 28px',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(236,72,153,0.3)'
                    }}
                  >
                    <Save size={16} />
                    {isUpdatingProfile ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: HỒ SƠ DA LIỄU ĐỘC QUYỀN */}
          {activeTab === 'skin' && (
            <div>
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>🌿</span>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                    Hồ Sơ Da Liễu Độc Quyền (Personalized Skin Profile)
                  </h2>
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                  Dữ liệu được lưu trữ để làm nguồn ngữ cảnh (Context) cho Trợ lý AI Advisor tư vấn chuẩn xác và cảnh báo hoạt chất dị ứng khi bạn mua sắm.
                </p>
              </div>

              {/* 1. Chọn loại da chính */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '12px' }}>
                  1. Loại da chính của bạn:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                  {SKIN_TYPES_LIST.map((st) => {
                    const isSelected = skinType === st.id;
                    return (
                      <div
                        key={st.id}
                        onClick={() => setSkinType(st.id)}
                        style={{
                          border: isSelected ? '2px solid #ec4899' : '1px solid #e2e8f0',
                          background: isSelected ? '#fdf2f8' : '#ffffff',
                          borderRadius: '12px',
                          padding: '14px',
                          cursor: 'pointer',
                          transition: 'all 120ms ease'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <strong style={{ fontSize: '13.5px', color: isSelected ? '#ec4899' : '#0f172a' }}>
                            {st.label}
                          </strong>
                          {isSelected && <CheckCircle2 size={18} style={{ color: '#ec4899' }} />}
                        </div>
                        <p style={{ fontSize: '11.5px', color: '#64748b', lineHeight: 1.4 }}>{st.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 1.1 Chọn Tông Da (Skin Tone) */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '12px' }}>
                  2. Tông da của bạn (Skin Tone):
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {[
                    { id: 'FAIR', label: 'Trắng Sáng (Fair / Light)', desc: 'Dưới ánh nắng dễ ửng đỏ, hợp cushion tone 21, son hồng/đỏ thuần.' },
                    { id: 'NATURAL', label: 'Tự Nhiên (Natural / Medium)', desc: 'Tông da vàng châu Á chuẩn, hợp cushion tone 23, son cam đất/đỏ gạch.' },
                    { id: 'TAN', label: 'Bánh Mật (Tan / Warm Deep)', desc: 'Khỏe khoắn cá tính, hợp tone ấm nude, phấn highlight đồng ấm.' }
                  ].map((tone) => {
                    const isSelected = skinTone === tone.id;
                    return (
                      <div
                        key={tone.id}
                        onClick={() => setSkinTone(tone.id)}
                        style={{
                          border: isSelected ? '2px solid #ec4899' : '1px solid #e2e8f0',
                          background: isSelected ? '#fdf2f8' : '#ffffff',
                          borderRadius: '12px',
                          padding: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <strong style={{ fontSize: '13px', color: isSelected ? '#ec4899' : '#0f172a' }}>{tone.label}</strong>
                          {isSelected && <CheckCircle2 size={16} style={{ color: '#ec4899' }} />}
                        </div>
                        <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>{tone.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Chọn các vấn đề da */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '12px' }}>
                  3. Tình trạng da & Mối bận tâm chính:
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {POPULAR_CONCERNS.map((c, i) => {
                    const isChecked = selectedConcerns.includes(c);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => toggleConcern(c)}
                        style={{
                          border: isChecked ? '1.5px solid #ec4899' : '1px solid #cbd5e1',
                          background: isChecked ? '#fdf2f8' : '#ffffff',
                          color: isChecked ? '#ec4899' : '#334155',
                          borderRadius: '9999px',
                          padding: '7px 16px',
                          fontSize: '12.5px',
                          fontWeight: isChecked ? 700 : 500,
                          cursor: 'pointer'
                        }}
                      >
                        {isChecked ? '✓ ' : '+ '} {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Thành phần dị ứng / Cần tránh */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '12px' }}>
                  3. Hoạt chất dị ứng hoặc cần tránh tuyệt đối:
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                  {COMMON_ALLERGIES.map((a, i) => {
                    const isAllergic = selectedAllergies.includes(a);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => toggleAllergy(a)}
                        style={{
                          border: isAllergic ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                          background: isAllergic ? '#fef2f2' : '#ffffff',
                          color: isAllergic ? '#dc2626' : '#334155',
                          borderRadius: '9999px',
                          padding: '7px 16px',
                          fontSize: '12.5px',
                          fontWeight: isAllergic ? 700 : 500,
                          cursor: 'pointer'
                        }}
                      >
                        {isAllergic ? '🚫 ' : ''} {a}
                      </button>
                    );
                  })}
                </div>

                {/* Thêm chất dị ứng tùy chỉnh */}
                <form onSubmit={handleAddCustomAllergy} style={{ display: 'flex', gap: '8px', maxWidth: '420px' }}>
                  <input
                    type="text"
                    placeholder="Thêm hoạt chất khác (VD: Tea tree oil, Lanolin)..."
                    value={customAllergyInput}
                    onChange={(e) => setCustomAllergyInput(e.target.value)}
                    style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', flex: 1 }}
                  />
                  <button
                    type="submit"
                    style={{ background: '#334155', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Thêm
                  </button>
                </form>
              </div>

              <button
                type="button"
                onClick={handleSaveSkinProfile}
                disabled={isSavingSkin}
                style={{
                  background: '#ec4899',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 32px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(236,72,153,0.35)'
                }}
              >
                <Save size={16} />
                {isSavingSkin ? 'Đang lưu...' : 'Lưu Hồ Sơ Da Liễu'}
              </button>
            </div>
          )}

          {/* TAB 3: SỔ ĐỊA CHỈ NHẬN HÀNG */}
          {activeTab === 'addresses' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Sổ Địa Chỉ Nhận Hàng</h2>
                  <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                    Quản lý danh sách địa chỉ nhận hàng để thanh toán nhanh hơn khi đặt mua
                  </p>
                </div>
                <button
                  onClick={() => setIsAddressModalOpen(true)}
                  style={{
                    background: '#ec4899',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus size={16} /> Thêm Địa Chỉ Mới
                </button>
              </div>

              {/* Address List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {addresses.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                    <MapPin size={36} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                    <p style={{ fontSize: '14px' }}>Bạn chưa có địa chỉ nhận hàng nào được lưu.</p>
                  </div>
                ) : (
                  addresses.map((addr) => (
                    <div
                      key={addr.id}
                      style={{
                        border: addr.isDefault ? '2px solid #ec4899' : '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '18px 20px',
                        background: addr.isDefault ? '#fffbfd' : '#ffffff',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                          <strong style={{ fontSize: '14.5px', color: '#0f172a' }}>{addr.recipientName}</strong>
                          <span style={{ fontSize: '13px', color: '#64748b' }}>({addr.phone})</span>
                          <span
                            style={{
                              fontSize: '11px',
                              background: addr.label === 'HOME' ? '#eff6ff' : '#f8fafc',
                              color: addr.label === 'HOME' ? '#2563eb' : '#475569',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontWeight: 700
                            }}
                          >
                            {addr.label === 'HOME' ? 'Nhà Riêng' : 'Văn Phòng'}
                          </span>
                          {addr.isDefault && (
                            <span style={{ fontSize: '11px', background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                              ✓ Mặc Định
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.5 }}>
                          {addr.streetAddress}, {addr.ward}, {addr.district}, {addr.province}
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {!addr.isDefault && (
                          <button
                            onClick={() => handleSetDefault(addr.id)}
                            style={{ background: 'none', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', color: '#475569', cursor: 'pointer' }}
                          >
                            Đặt mặc định
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', padding: '6px', cursor: 'pointer' }}
                          title="Xóa địa chỉ"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: GIAN HÀNG ĐANG THEO DÕI */}
          {activeTab === 'followed' && (
            <div>
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                  Gian Hàng Thương Hiệu Đang Theo Dõi ({followedShops.length})
                </h2>
                <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                  Cập nhật tin tức khuyến mãi độc quyền, voucher và bộ sưu tập mới từ các Official Mall bạn yêu thích.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {followedShops.map((shop) => (
                  <div
                    key={shop.id}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#ffffff'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '50px', height: '50px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                        <img src={shop.logo} alt={shop.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <strong style={{ fontSize: '14px', color: '#0f172a' }}>{shop.name}</strong>
                          <span style={{ background: '#ec4899', color: '#fff', fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '9999px' }}>
                            Mall
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>
                          ⭐ {shop.rating} | 👥 {shop.followers} người theo dõi
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => {
                          onNavigateHome();
                          onAddToast({ type: 'info', message: `Đang chuyển đến gian hàng ${shop.name}` });
                        }}
                        style={{
                          background: '#ec4899',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 14px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Vào Gian Hàng
                      </button>
                      <button
                        onClick={() => {
                          setFollowedShops(followedShops.filter((s) => s.id !== shop.id));
                          onAddToast({ type: 'info', message: `Đã hủy theo dõi ${shop.name}` });
                        }}
                        style={{
                          background: '#f1f5f9',
                          color: '#64748b',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          fontSize: '12px',
                          fontWeight: 650,
                          cursor: 'pointer'
                        }}
                      >
                        Bỏ theo dõi
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ĐỔI MẬT KHẨU & BẢO MẬT */}
          {activeTab === 'security' && (
            <div>
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Đổi Mật Khẩu & Bảo Mật</h2>
                <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                  Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu của bạn với bất kỳ ai
                </p>
              </div>

              <form onSubmit={handleChangePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '480px' }}>
                {/* Mật khẩu hiện tại */}
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Mật khẩu hiện tại *
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '0 14px' }}>
                    <KeyRound size={16} style={{ color: '#94a3b8', marginRight: '10px' }} />
                    <input
                      type={showCurrentPwd ? 'text' : 'password'}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Nhập mật khẩu hiện tại"
                      style={{ border: 'none', outline: 'none', padding: '11px 0', fontSize: '13.5px', width: '100%' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                    >
                      {showCurrentPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Mật khẩu mới */}
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Mật khẩu mới (Tối thiểu 8 ký tự) *
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '0 14px' }}>
                    <Lock size={16} style={{ color: '#94a3b8', marginRight: '10px' }} />
                    <input
                      type={showNewPwd ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Nhập mật khẩu mới"
                      style={{ border: 'none', outline: 'none', padding: '11px 0', fontSize: '13.5px', width: '100%' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPwd(!showNewPwd)}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                    >
                      {showNewPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Thanh đo độ mạnh mật khẩu */}
                  {newPassword && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>
                        <span>Độ mạnh mật khẩu:</span>
                        <strong style={{ color: pwdStrength <= 25 ? '#ef4444' : pwdStrength <= 50 ? '#f59e0b' : pwdStrength <= 75 ? '#3b82f6' : '#10b981' }}>
                          {pwdStrength <= 25 ? 'Yếu' : pwdStrength <= 50 ? 'Trung bình' : pwdStrength <= 75 ? 'Khá' : 'Rất mạnh'}
                        </strong>
                      </div>
                      <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${pwdStrength}%`,
                            background: pwdStrength <= 25 ? '#ef4444' : pwdStrength <= 50 ? '#f59e0b' : pwdStrength <= 75 ? '#3b82f6' : '#10b981',
                            transition: 'width 200ms ease'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Xác nhận mật khẩu mới */}
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Xác nhận mật khẩu mới *
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '0 14px' }}>
                    <Lock size={16} style={{ color: '#94a3b8', marginRight: '10px' }} />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu mới"
                      style={{ border: 'none', outline: 'none', padding: '11px 0', fontSize: '13.5px', width: '100%' }}
                    />
                  </div>
                </div>

                <div style={{ paddingTop: '10px' }}>
                  <button
                    type="submit"
                    disabled={isChangingPwd}
                    style={{
                      background: '#ec4899',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '12px 28px',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Save size={16} />
                    {isChangingPwd ? 'Đang cập nhật...' : 'Cập Nhật Mật Khẩu'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Modal Thêm Địa Chỉ Nhận Hàng Mới */}
      {isAddressModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setIsAddressModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '500px',
              background: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
            }}
          >
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
              Thêm Địa Chỉ Giao Hàng Mới
            </h3>

            <form onSubmit={handleAddNewAddress} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Tên người nhận *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={newAddress.recipientName}
                    onChange={(e) => setNewAddress({ ...newAddress, recipientName: e.target.value })}
                    style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0901234567"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Tỉnh / Thành phố *</label>
                  <input
                    type="text"
                    required
                    value={newAddress.province}
                    onChange={(e) => setNewAddress({ ...newAddress, province: e.target.value })}
                    style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Quận / Huyện *</label>
                  <input
                    type="text"
                    required
                    value={newAddress.district}
                    onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                    style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Phường / Xã *</label>
                <input
                  type="text"
                  required
                  value={newAddress.ward}
                  onChange={(e) => setNewAddress({ ...newAddress, ward: e.target.value })}
                  style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Địa chỉ cụ thể (Số nhà, tên đường, tòa nhà) *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: 123 Đường Nguyễn Huệ, Tòa nhà Bitexco"
                  value={newAddress.streetAddress}
                  onChange={(e) => setNewAddress({ ...newAddress, streetAddress: e.target.value })}
                  style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Loại địa chỉ:</label>
                <label style={{ fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="label"
                    value="HOME"
                    checked={newAddress.label === 'HOME'}
                    onChange={() => setNewAddress({ ...newAddress, label: 'HOME' })}
                  />
                  Nhà Riêng
                </label>
                <label style={{ fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="label"
                    value="OFFICE"
                    checked={newAddress.label === 'OFFICE'}
                    onChange={() => setNewAddress({ ...newAddress, label: 'OFFICE' })}
                  />
                  Văn Phòng
                </label>
              </div>

              <label style={{ fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={newAddress.isDefault}
                  onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                />
                Đặt làm địa chỉ nhận hàng mặc định
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  style={{ padding: '8px 18px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '13px', cursor: 'pointer' }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#ec4899', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Lưu Địa Chỉ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
