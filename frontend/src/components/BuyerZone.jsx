import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HomeView from './HomeView';
import CatalogView from './CatalogView';
import ProductDetailView from './ProductDetailView';
import CartView from './CartView';
import CheckoutView from './CheckoutView';
import OrderResultView from './OrderResultView';
import OrderTrackingView from './OrderTrackingView';
import CombosView from './CombosView';
import QuickViewModal from './QuickViewModal';
import CompareDrawerAndModal from './CompareDrawerAndModal';
import SkinTypePopup from './SkinTypePopup';
import SkinQuizModal from './SkinQuizModal';
import CookieBanner from './CookieBanner';
import BrandStoreView from './BrandStoreView';
import VirtualTryOnModal from './VirtualTryOnModal';
import SkinScannerModal from './SkinScannerModal';
import BeautyPassModal from './BeautyPassModal';
import RoutineSchedulerView from './RoutineSchedulerView';
import { FlashSaleView } from './FlashSaleView';
import { MOCK_PRODUCTS } from '../api';

export default function BuyerZone({
  user,
  cart,
  setCart,
  skinProfile,
  setSkinProfile,
  isCartOpen,
  setIsCartOpen,
  activeView,
  setActiveView,
  selectedProduct,
  setSelectedProduct,
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  onAddToast,
  wishlistIds,
  setWishlistIds
}) {
  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Compare List (Max 4)
  const [compareList, setCompareList] = useState([]);

  // Selected Brand Store
  const [selectedBrand, setSelectedBrand] = useState('Innisfree');

  // Skin Quiz Modal
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // Beauty-Tech Modals
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  const [isSkinScannerOpen, setIsSkinScannerOpen] = useState(false);
  const [isBeautyPassOpen, setIsBeautyPassOpen] = useState(false);

  // Checkout Data & Last Created Order
  const [checkoutData, setCheckoutData] = useState(null);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [trackingLookupTarget, setTrackingLookupTarget] = useState({ orderId: '', phone: '' });

  // Add to cart helper (Accurate SKU & Variant Resolution)
  const handleAddToCart = (product, variant = {}, qty = 1) => {
    const targetSku =
      variant.skuCode ||
      variant.sku ||
      product.variants?.[0]?.skuCode ||
      product.variants?.[0]?.sku ||
      `${product.id}-STD`;

    const targetTitle =
      variant.title ||
      variant.name ||
      variant.attributes?.Shade ||
      variant.attributes?.DungTich ||
      variant.attributes?.volume ||
      'Tiêu chuẩn';

    const targetPrice =
      variant.price !== undefined
        ? variant.price
        : product.variants?.[0]?.price ?? product.price ?? 0;

    const hexColor =
      variant.hexColor ||
      variant.attributes?.Hex ||
      variant.attributes?.color ||
      null;

    const finishType =
      variant.finishType ||
      variant.attributes?.Finish ||
      null;

    // Resolve variant image or fallback to product packshot
    const skuImg = `/products/${targetSku}.jpg`;
    const targetImage =
      variant.image ||
      (product.images && product.images.find((img) => img === skuImg || img.includes(targetSku))) ||
      product.images?.[0] ||
      product.image ||
      '/products/PROD-CRW-001.jpg';

    const existing = cart.find((i) => i.variantSku === targetSku);
    if (existing) {
      setCart(
        cart.map((i) =>
          i.variantSku === targetSku ? { ...i, quantity: i.quantity + qty } : i
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          variantSku: targetSku,
          skuCode: targetSku,
          shopId: product.shopId,
          productName: product.name,
          variantTitle: targetTitle,
          price: targetPrice,
          quantity: qty,
          image: targetImage,
          hexColor,
          finishType
        }
      ]);
    }

    onAddToast({
      type: 'success',
      message: `Đã thêm ${qty}x "${product.name.slice(0, 22)}..." (${targetTitle}) vào giỏ hàng!`
    });

    // Auto open mini-cart drawer as specified in 1.5 & 5.4
    setIsCartOpen(true);
  };

  const handleBuyNow = (product, variant = {}, qty = 1) => {
    handleAddToCart(product, variant, qty);
    const targetSku =
      variant.skuCode ||
      variant.sku ||
      product.variants?.[0]?.skuCode ||
      product.variants?.[0]?.sku ||
      `${product.id}-STD`;

    const targetTitle =
      variant.title ||
      variant.name ||
      variant.attributes?.Shade ||
      variant.attributes?.DungTich ||
      'Tiêu chuẩn';

    const targetPrice =
      variant.price !== undefined
        ? variant.price
        : product.variants?.[0]?.price ?? product.price ?? 0;

    const targetImage =
      variant.image ||
      product.images?.[0] ||
      product.image ||
      '/products/PROD-CRW-001.jpg';

    setCheckoutData({
      selectedItems: [
        {
          productId: product.id,
          variantSku: targetSku,
          skuCode: targetSku,
          shopId: product.shopId,
          productName: product.name,
          variantTitle: targetTitle,
          price: targetPrice,
          quantity: qty,
          image: targetImage,
          hexColor: variant.hexColor || variant.attributes?.Hex || null,
          finishType: variant.finishType || variant.attributes?.Finish || null
        }
      ],
      subtotal: targetPrice * qty,
      voucherDiscount: 0
    });
    setActiveView('checkout');
  };

  const handleToggleWishlist = (productId) => {
    if (wishlistIds.includes(productId)) {
      setWishlistIds(wishlistIds.filter((id) => id !== productId));
      onAddToast({ type: 'info', message: 'Đã xóa sản phẩm khỏi danh sách yêu thích.' });
    } else {
      setWishlistIds([...wishlistIds, productId]);
      onAddToast({ type: 'success', message: '❤️ Đã lưu sản phẩm vào danh sách yêu thích!' });
    }
  };

  const handleAddToCompare = (product) => {
    if (compareList.some((p) => p.id === product.id)) {
      onAddToast({ type: 'info', message: 'Sản phẩm này đã có trong danh sách so sánh.' });
      return;
    }
    if (compareList.length >= 4) {
      onAddToast({ type: 'warning', message: 'Chỉ có thể so sánh tối đa 4 sản phẩm cùng lúc.' });
      return;
    }
    setCompareList([...compareList, product]);
    onAddToast({ type: 'success', message: `Đã thêm "${product.name.slice(0, 20)}..." vào bảng so sánh.` });
  };

  const handleRemoveFromCompare = (productId) => {
    setCompareList(compareList.filter((p) => p.id !== productId));
  };

  return (
    <div>
      {/* 1. VIEW ROUTER WITH SMOOTH ANIMATION */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >

      {/* VIEW: HOME */}
      {activeView === 'home' && (
        <HomeView
          onOpenTryOn={(p) => {
            if (p) setSelectedProduct(p);
            setIsTryOnOpen(true);
          }}
          onSelectProduct={(p) => {
            setSelectedProduct(p);
            setActiveView('product-detail');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onAddToCart={handleAddToCart}
          onOpenQuickView={(p) => setQuickViewProduct(p)}
          onToggleWishlist={handleToggleWishlist}
          wishlistIds={wishlistIds}
          onAddToCompare={handleAddToCompare}
          onNavigateCatalog={() => {
            setSearchQuery('');
            setCategoryFilter('');
            setActiveView('catalog');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateCategory={(cat) => {
            setCategoryFilter(cat);
            setSearchQuery('');
            setActiveView('catalog');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateCombos={() => {
            setActiveView('combos');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenQuiz={() => setIsQuizOpen(true)}
          skinType={skinProfile?.skinType || 'COMBINATION'}
          onOpenSkinScanner={() => setIsSkinScannerOpen(true)}
          onOpenBeautyPass={() => setIsBeautyPassOpen(true)}
          onNavigateRoutine={() => {
            setActiveView('routine');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* VIEW: CATALOG */}
      {activeView === 'catalog' && (
        <CatalogView
          onOpenTryOn={(p) => {
            if (p) setSelectedProduct(p);
            setIsTryOnOpen(true);
          }}
          initialCategory={categoryFilter}
          initialSearch={searchQuery}
          onSelectProduct={(p) => {
            setSelectedProduct(p);
            setActiveView('product-detail');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onAddToCart={handleAddToCart}
          onOpenQuickView={(p) => setQuickViewProduct(p)}
          onToggleWishlist={handleToggleWishlist}
          wishlistIds={wishlistIds}
          onNavigateHome={() => {
            setActiveView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateBrandStore={(brand) => {
            setSelectedBrand(brand || 'Innisfree');
            setActiveView('brand-store');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* VIEW: PRODUCT DETAIL */}
      {activeView === 'product-detail' && selectedProduct && (
        <ProductDetailView
          product={selectedProduct}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          onToggleWishlist={handleToggleWishlist}
          isWishlisted={wishlistIds.includes(selectedProduct.id)}
          onAddToCompare={handleAddToCompare}
          onSelectProduct={(p) => {
            setSelectedProduct(p);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onAddToast={onAddToast}
          onNavigateHome={() => {
            setActiveView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateBrandStore={(brand) => {
            setSelectedBrand(brand || 'Innisfree');
            setActiveView('brand-store');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* VIEW: FULL CART */}
      {activeView === 'cart' && (
        <CartView
          cart={cart}
          setCart={setCart}
          onProceedCheckout={(data) => {
            setCheckoutData(data);
            setActiveView('checkout');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectProduct={(p) => {
            setSelectedProduct(p);
            setActiveView('product-detail');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateHome={() => {
            setActiveView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateBrandStore={(brand) => {
            setSelectedBrand(brand || 'Innisfree');
            setActiveView('brand-store');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onAddToast={onAddToast}
        />
      )}

      {/* VIEW: 3-STEP CHECKOUT */}
      {activeView === 'checkout' && (
        <CheckoutView
          checkoutData={checkoutData}
          user={user}
          onOrderSuccess={(order) => {
            setCreatedOrder(order);
            setCart([]); // Clear cart
            setActiveView('order-result');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onBackToCart={() => {
            setActiveView('cart');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onAddToast={onAddToast}
        />
      )}

      {/* VIEW: ORDER RESULT */}
      {activeView === 'order-result' && (
        <OrderResultView
          orderData={createdOrder}
          onNavigateTracking={(orderId, phone) => {
            setTrackingLookupTarget({ orderId, phone });
            setActiveView('order-tracking');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateHome={() => {
            setActiveView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateBrandStore={(brand) => {
            setSelectedBrand(brand || 'Innisfree');
            setActiveView('brand-store');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onAddToast={onAddToast}
        />
      )}

      {/* VIEW: ORDER TRACKING */}
      {activeView === 'order-tracking' && (
        <OrderTrackingView
          initialOrderId={trackingLookupTarget.orderId}
          initialPhone={trackingLookupTarget.phone}
          onOpenSupportChat={() => {}}
          onAddToast={onAddToast}
          onNavigateHome={() => {
            setActiveView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateBrandStore={(brand) => {
            setSelectedBrand(brand || 'Innisfree');
            setActiveView('brand-store');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* VIEW: COMBOS */}
      {activeView === 'combos' && (
        <CombosView
          onAddToCart={handleAddToCart}
          onAddToast={onAddToast}
          onNavigateHome={() => {
            setActiveView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateBrandStore={(brand) => {
            setSelectedBrand(brand || 'Innisfree');
            setActiveView('brand-store');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* VIEW: BRAND STORE */}
      {activeView === 'brand-store' && (
        <BrandStoreView
          brandName={selectedBrand}
          onBack={() => {
            setActiveView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectProduct={(p) => {
            setSelectedProduct(p);
            setActiveView('product-detail');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onAddToCart={handleAddToCart}
          onOpenChat={() => {
            onAddToast({ type: 'info', message: `Đang kết nối chat với chuyên viên tư vấn của ${selectedBrand}...` });
          }}
          onAddToast={onAddToast}
        />
      )}

      {/* VIEW: 28-DAY SKINCARE ROUTINE & CONFLICT DETECTOR */}
      {activeView === 'routine' && (
        <RoutineSchedulerView
          skinProfile={skinProfile}
          onAddToCart={handleAddToCart}
          onAddToast={onAddToast}
          onSelectProduct={(p) => {
            setSelectedProduct(p);
            setActiveView('product-detail');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* VIEW: FLASH SALE DEALS */}
      {activeView === 'flash-sale' && (
        <FlashSaleView
          onSelectProduct={(p) => {
            setSelectedProduct(p);
            setActiveView('product-detail');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onAddToCart={handleAddToCart}
          onOpenQuickView={(p) => setQuickViewProduct(p)}
          onOpenTryOn={(p) => {
            if (p) setSelectedProduct(p);
            setIsTryOnOpen(true);
          }}
          onNavigateHome={() => {
            setActiveView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onAddToast={onAddToast}
          wishlistIds={wishlistIds}
        />
      )}
        </motion.div>
      </AnimatePresence>

      {/* 2. GLOBAL OVERLAYS & MODALS */}

      {/* Virtual Try-On AR Modal */}
      <VirtualTryOnModal
        isOpen={isTryOnOpen}
        onClose={() => setIsTryOnOpen(false)}
        initialProduct={selectedProduct}
        onAddToCart={(item) => {
          handleAddToCart(
            { id: item.id, name: item.name, shopId: item.shopId, images: [item.image] },
            { skuCode: item.variantSku || item.skuCode, sku: item.variantSku, title: item.variantTitle, price: item.price },
            item.quantity
          );
        }}
        onAddToast={onAddToast}
        currentUser={user}
      />

      {/* AI Skin Scanner Modal */}
      <SkinScannerModal
        isOpen={isSkinScannerOpen}
        onClose={() => setIsSkinScannerOpen(false)}
        onUpdateSkinProfile={(newProfile) => {
          setSkinProfile({ ...skinProfile, ...newProfile });
        }}
        onAddToCart={(item) => {
          handleAddToCart(
            { id: item.id, name: item.name, shopId: item.shopId, images: [item.image] },
            { skuCode: item.variantSku || item.skuCode, sku: item.variantSku, title: item.variantTitle, price: item.price },
            item.quantity
          );
        }}
        onAddToast={onAddToast}
        onSelectProduct={(p) => {
          setSelectedProduct(p);
          setActiveView('product-detail');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Beauty Pass Loyalty Modal */}
      <BeautyPassModal
        isOpen={isBeautyPassOpen}
        onClose={() => setIsBeautyPassOpen(false)}
        user={user}
        onAddToast={onAddToast}
      />

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
          onViewFullDetail={(p) => {
            setSelectedProduct(p);
            setActiveView('product-detail');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onAddToast={onAddToast}
        />
      )}

      {/* Compare Drawer & Modal */}
      <CompareDrawerAndModal
        compareList={compareList}
        onRemoveFromCompare={handleRemoveFromCompare}
        onClearCompare={() => setCompareList([])}
        onAddToCart={handleAddToCart}
        onSelectProduct={(p) => {
          setSelectedProduct(p);
          setActiveView('product-detail');
        }}
      />

      {/* First-time Skin Type Popup */}
      <SkinTypePopup
        onSelectSkinType={(skinId) => {
          setSkinProfile({ ...skinProfile, skinType: skinId });
          onAddToast({ type: 'success', message: '🎉 Đã cập nhật loại da vào hồ sơ cá nhân hóa!' });
        }}
      />

      {/* Skin Routine Quiz Modal */}
      <SkinQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onCompleteQuiz={(answers) => {
          setSkinProfile({
            ...skinProfile,
            skinType: answers.skinType,
            concerns: [answers.concern]
          });
        }}
        onAddToast={onAddToast}
      />

      {/* Cookie Consent Banner */}
      <CookieBanner />
    </div>
  );
}
