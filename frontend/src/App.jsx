import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import BuyerZone from './components/BuyerZone';
import SellerZone from './components/SellerZone';
import AdminZone from './components/AdminZone';
import MiniCartDrawer from './components/MiniCartDrawer';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import AuthModal from './components/AuthModal';
import AccountProfileView from './components/AccountProfileView';
import SupportChat from './components/SupportChat';
import ErrorBoundary from './components/ErrorBoundary';
import { TopBarModals } from './components/TopBarModals';
import { USER_ROLES, MOCK_PRODUCTS } from './api';
import { useBrowserHistorySync } from './hooks/useBrowserHistorySync';
import { AuraIntroOverlay } from './components/ui';

export default function App() {
  // Luxury Editorial Intro state: kích hoạt khi mới vào web hoặc khi quay lại trang chủ
  const [showIntro, setShowIntro] = useState(true);
  const prevViewRef = useRef(null);

  // Current user state (mặc định ban đầu là null khi chưa đăng nhập)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('aura_current_user') || localStorage.getItem('cosmepoly_current_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Xóa sạch user mẫu cũ (nếu có) để người dùng bắt đầu ở trạng thái khách chưa đăng nhập
        if (parsed?.id === 'buyer-001' && parsed?.name === 'Nguyễn Văn Mua') {
          localStorage.removeItem('aura_current_user');
          localStorage.removeItem('cosmepoly_current_user');
          return null;
        }
        return parsed;
      }
    } catch (e) {}
    return null; // Chưa đăng nhập -> null
  });

  // Role được suy ra 100% từ quyền của tài khoản đăng nhập
  const activeRole = currentUser?.role || 'BUYER';

  // Browser History & Navigation Sync Manager (HTML5 History API + popstate sync)
  const {
    activeView,
    setActiveView,
    selectedProduct,
    setSelectedProduct,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
    selectedBrand,
    setSelectedBrand,
    sellerTab,
    setSellerTab,
    adminTab,
    setAdminTab,
    isCartOpen,
    setIsCartOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isTryOnOpen,
    setIsTryOnOpen,
    isQuizOpen,
    setIsQuizOpen,
    isSkinScannerOpen,
    setIsSkinScannerOpen,
    isBeautyPassOpen,
    setIsBeautyPassOpen,
    quickViewProduct,
    setQuickViewProduct,
    navigateTo,
    openModal,
    closeModal,
    goBack
  } = useBrowserHistorySync();

  // Kích hoạt Intro khi quay lại trang chủ từ các view khác
  useEffect(() => {
    if (prevViewRef.current && prevViewRef.current !== 'home' && activeView === 'home') {
      setShowIntro(true);
    }
    prevViewRef.current = activeView;
  }, [activeView]);

  // Top Bar Announcement / Quick Link Modals
  const [activeTopBarModal, setActiveTopBarModal] = useState(null);

  // Global Cart & Wishlist
  const [cart, setCart] = useState([
    {
      productId: 'prod-001',
      variantSku: 'INNI-GT-80ML',
      shopId: 'shop-001',
      productName: 'Innisfree Green Tea Seed Hyaluronic Serum',
      variantTitle: 'Chai 80ml (Chuẩn)',
      price: 620000,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&auto=format&fit=crop&q=80'
    }
  ]);
  const [wishlistIds, setWishlistIds] = useState(['prod-002', 'prod-006']);

  // Global Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = ({ type = 'info', message, action }) => {
    const id = 'toast-' + Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-2), { id, type, message, action }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Skin Profile
  const [skinProfile, setSkinProfile] = useState({
    skinType: 'COMBINATION',
    concerns: ['Mụn cám', 'Thâm mụn', 'Vùng chữ T đổ dầu'],
    allergies: ['Cồn khô (Alcohol Denat)', 'Hương liệu nồng']
  });

  const handleLoginSuccess = (userObj) => {
    setCurrentUser(userObj);
    localStorage.setItem('aura_current_user', JSON.stringify(userObj));
    const roleName = userObj.role === 'ADMIN' ? 'Quản Trị Viên' : userObj.role === 'SELLER' ? 'Người Bán (Shop)' : 'Khách Mua';
    if (userObj.role === 'ADMIN') {
      navigateTo({ view: 'admin', adminTab: 'merchants' });
    } else if (userObj.role === 'SELLER') {
      navigateTo({ view: 'seller', sellerTab: 'overview' });
    } else {
      navigateTo({ view: 'home' });
    }
    addToast({
      type: 'success',
      message: `Đăng nhập thành công! Giao diện đã chuyển sang quyền ${roleName}.`
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('aura_current_user');
    localStorage.removeItem('cosmepoly_current_user');
    navigateTo({ view: 'home' });
    addToast({
      type: 'info',
      message: 'Đã đăng xuất tài khoản. Bạn đang xem giao diện Khách Mua.'
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--canvas)' }}>
      {/* 0. Luxury Editorial Brand Intro Overlay (khi mới vào web hoặc quay lại trang chủ) */}
      <AuraIntroOverlay
        isOpen={showIntro}
        onComplete={() => setShowIntro(false)}
      />

      {/* 1. Global Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* 1.1 Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeModal}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* 2. Global Navbar (shown in all views except distraction-free checkout) */}
      {activeView !== 'checkout' && (
        <Navbar
          activeRole={activeRole}
          setActiveRole={(newRole) => {
            if (USER_ROLES[newRole]) {
              handleLoginSuccess(USER_ROLES[newRole]);
            }
          }}
          cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
          wishlistCount={wishlistIds.length}
          onOpenCart={() => openModal('cart')}
          onOpenSkinProfile={() => {
            const popup = document.querySelector('.modal-backdrop');
            if (!popup) {
              addToast({ type: 'info', message: 'Hồ sơ da liễu: ' + skinProfile.skinType });
            }
          }}
          onOpenAuthModal={() => openModal('auth')}
          onLogout={handleLogout}
          onNavigateHome={() => navigateTo({ view: 'home', category: '', search: '' })}
          onNavigateCatalog={() => navigateTo({ view: 'catalog', category: '', search: '' })}
          onNavigateCategory={(cat) => navigateTo({ view: 'catalog', category: cat, search: '' })}
          onNavigateTracking={() => navigateTo({ view: 'order-tracking' })}
          onNavigateCombos={() => navigateTo({ view: 'combos' })}
          onNavigateProfile={() => navigateTo({ view: 'profile' })}
          onSelectProduct={(p) => navigateTo({ view: 'product-detail', productId: p.id, product: p })}
          onSearchSubmit={(query) => navigateTo({ view: 'catalog', search: query, category: '' })}
          onOpenTopBarModal={(k) => setActiveTopBarModal(k)}
          onNavigateFlashSale={() => navigateTo({ view: 'flash-sale' })}
          onNavigateAdmin={() => navigateTo({ view: 'admin', adminTab: 'merchants' })}
          onNavigateSeller={() => navigateTo({ view: 'seller', sellerTab: 'overview' })}
          user={currentUser}
        />
      )}

      {/* 3. Main Content Area */}
      <main className="container" style={{ flex: 1, paddingBottom: '40px' }}>
        <ErrorBoundary
          resetKey={activeView + '-' + (currentUser?.role || 'BUYER')}
          activeView={activeView}
          onReset={() => navigateTo({ view: 'home', category: '', search: '' })}
          onNavigateHome={() => navigateTo({ view: 'home', category: '', search: '' })}
        >
        {activeView === 'profile' ? (
          <div style={{ marginTop: '20px' }}>
            <AccountProfileView
              user={currentUser}
              onUpdateUser={(updated) => {
                setCurrentUser(updated);
                localStorage.setItem('aura_current_user', JSON.stringify(updated));
              }}
              onAddToast={addToast}
              onNavigateHome={() => navigateTo({ view: 'home' })}
              onLogout={handleLogout}
            />
          </div>
        ) : activeView === 'admin' ? (
          <div style={{ marginTop: '24px' }}>
            <AdminZone
              activeTab={adminTab}
              onTabChange={(tab) => navigateTo({ view: 'admin', adminTab: tab })}
              onNavigateHome={() => navigateTo({ view: 'home' })}
            />
          </div>
        ) : activeView === 'seller' ? (
          <div style={{ marginTop: '24px' }}>
            <SellerZone
              user={currentUser}
              activeTab={sellerTab}
              onTabChange={(tab) => navigateTo({ view: 'seller', sellerTab: tab })}
              onNavigateHome={() => navigateTo({ view: 'home' })}
            />
          </div>
        ) : (
          <BuyerZone
            user={currentUser}
            cart={cart}
            setCart={setCart}
            skinProfile={skinProfile}
            setSkinProfile={setSkinProfile}
            isCartOpen={isCartOpen}
            setIsCartOpen={setIsCartOpen}
            activeView={activeView}
            setActiveView={setActiveView}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            isTryOnOpen={isTryOnOpen}
            setIsTryOnOpen={setIsTryOnOpen}
            quickViewProduct={quickViewProduct}
            setQuickViewProduct={setQuickViewProduct}
            isQuizOpen={isQuizOpen}
            setIsQuizOpen={setIsQuizOpen}
            isSkinScannerOpen={isSkinScannerOpen}
            setIsSkinScannerOpen={setIsSkinScannerOpen}
            isBeautyPassOpen={isBeautyPassOpen}
            setIsBeautyPassOpen={setIsBeautyPassOpen}
            navigateTo={navigateTo}
            openModal={openModal}
            closeModal={closeModal}
            goBack={goBack}
            onAddToast={addToast}
            wishlistIds={wishlistIds}
            setWishlistIds={setWishlistIds}
          />
        )}
        </ErrorBoundary>
      </main>

      {/* 4. Global MiniCart Drawer (1.5) */}
      <MiniCartDrawer
        isOpen={isCartOpen}
        onClose={closeModal}
        cart={cart}
        setCart={setCart}
        onOpenFullCart={() => navigateTo({ view: 'cart' })}
        onCheckout={() => navigateTo({ view: 'checkout' })}
        onAddToast={addToast}
        onSelectProduct={(p) => navigateTo({ view: 'product-detail', productId: p.id, product: p })}
      />

      {/* 5. Global Footer (1.4 - hidden in distraction-free checkout) */}
      {activeView !== 'checkout' && (
        <Footer
          onAddToast={addToast}
          onNavigateTracking={() => {
            setActiveView('order-tracking');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenSellerRegistration={() => {
            if (USER_ROLES['SELLER']) {
              handleLoginSuccess(USER_ROLES['SELLER']);
            }
          }}
        />
      )}

      {/* 5.1 Top Bar Modals */}
      <TopBarModals
        activeModal={activeTopBarModal}
        onClose={() => setActiveTopBarModal(null)}
        onAddToast={addToast}
        onNavigateFlashSale={() => {
          setActiveView('flash-sale');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAiChat={() => {
          // Open AI chat window
          const chatBtn = document.querySelector('[aria-label="Mở Trợ Lý AI"]');
          if (chatBtn) chatBtn.click();
        }}
      />

      {/* 6. Global Support Chat & AI Advisor (Hoạt động toàn sàn cho mọi người dùng) */}
      <SupportChat
        skinProfile={skinProfile}
        user={currentUser}
        onSelectProduct={(product) => {
          setSelectedProduct(product);
          setActiveView('product-detail');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateOrderTracking={() => {
          setActiveView('order-tracking');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateCatalog={(q) => {
          if (q) setSearchQuery(q);
          setActiveView('catalog');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateSeller={() => {
          if (currentUser?.role === 'SELLER') {
            setActiveView('home');
          } else {
            setIsAuthModalOpen(true);
            addToast({
              type: 'info',
              message: 'Vui lòng đăng ký hoặc đăng nhập tài khoản Người Bán (Shop) để quản lý gian hàng.'
            });
          }
        }}
      />
    </div>
  );
}
