import { useState, useEffect, useRef, useCallback } from 'react';
import { MOCK_PRODUCTS } from '../api';
import { getEnrichedCatalog } from '../lib/submenuCatalogMapper';

export function buildNavUrl(snapshot) {
  const params = new URLSearchParams();
  const view = snapshot.view || 'home';

  if (view !== 'home') {
    params.set('view', view);
  }
  if (snapshot.productId && (view === 'product-detail' || snapshot.modal === 'quick-view' || snapshot.modal === 'try-on')) {
    params.set('id', snapshot.productId);
  }
  if (snapshot.category && view === 'catalog') {
    params.set('category', snapshot.category);
  }
  if (snapshot.search && view === 'catalog') {
    params.set('q', snapshot.search);
  }
  if (snapshot.brand && view === 'brand-store') {
    params.set('brand', snapshot.brand);
  }
  if (view === 'seller' && snapshot.sellerTab && snapshot.sellerTab !== 'overview') {
    params.set('tab', snapshot.sellerTab);
  }
  if (view === 'admin' && snapshot.adminTab && snapshot.adminTab !== 'merchants') {
    params.set('tab', snapshot.adminTab);
  }
  if (snapshot.modal) {
    params.set('modal', snapshot.modal);
  }
  const qs = params.toString();
  return qs ? `/?${qs}` : '/';
}

export function parseNavUrl(search = window.location.search) {
  const params = new URLSearchParams(search);
  const view = params.get('view') || 'home';
  const productId = params.get('id') || null;
  const category = params.get('category') || '';
  const searchStr = params.get('q') || '';
  const brand = params.get('brand') || 'Innisfree';
  const tab = params.get('tab') || null;
  const modal = params.get('modal') || null;

  return {
    view,
    productId,
    category,
    search: searchStr,
    brand,
    sellerTab: view === 'seller' ? (tab || 'overview') : 'overview',
    adminTab: view === 'admin' ? (tab || 'merchants') : 'merchants',
    modal,
    timestamp: Date.now()
  };
}

export function findProductById(id) {
  if (!id) return MOCK_PRODUCTS[0];
  try {
    const catalog = getEnrichedCatalog(MOCK_PRODUCTS);
    const found = catalog.find((p) => p.id === id || p.skuCode === id || p.sku === id);
    if (found) return found;
  } catch (e) {
    console.error('Error resolving product by id:', e);
  }
  return MOCK_PRODUCTS.find((p) => p.id === id) || MOCK_PRODUCTS[0];
}

export function useBrowserHistorySync() {
  const initialRef = useRef(parseNavUrl());

  const [activeView, setActiveView] = useState(initialRef.current.view);
  const [selectedProduct, setSelectedProduct] = useState(() =>
    findProductById(initialRef.current.productId)
  );
  const [categoryFilter, setCategoryFilter] = useState(initialRef.current.category);
  const [searchQuery, setSearchQuery] = useState(initialRef.current.search);
  const [selectedBrand, setSelectedBrand] = useState(initialRef.current.brand);
  const [sellerTab, setSellerTab] = useState(initialRef.current.sellerTab);
  const [adminTab, setAdminTab] = useState(initialRef.current.adminTab);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(initialRef.current.modal === 'cart');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(initialRef.current.modal === 'auth');
  const [isTryOnOpen, setIsTryOnOpen] = useState(initialRef.current.modal === 'try-on');
  const [isQuizOpen, setIsQuizOpen] = useState(initialRef.current.modal === 'quiz');
  const [isSkinScannerOpen, setIsSkinScannerOpen] = useState(initialRef.current.modal === 'skin-scanner');
  const [isBeautyPassOpen, setIsBeautyPassOpen] = useState(initialRef.current.modal === 'beauty-pass');
  const [quickViewProduct, setQuickViewProduct] = useState(() =>
    initialRef.current.modal === 'quick-view' ? findProductById(initialRef.current.productId) : null
  );

  // Snapshot ref to track state and prevent loops
  const currentSnapshotRef = useRef({
    view: initialRef.current.view,
    productId: initialRef.current.productId,
    category: initialRef.current.category,
    search: initialRef.current.search,
    brand: initialRef.current.brand,
    sellerTab: initialRef.current.sellerTab,
    adminTab: initialRef.current.adminTab,
    modal: initialRef.current.modal
  });

  const isPopStateRef = useRef(false);

  const applySnapshot = useCallback((snapshot) => {
    currentSnapshotRef.current = {
      view: snapshot.view || 'home',
      productId: snapshot.productId || null,
      category: snapshot.category || '',
      search: snapshot.search || '',
      brand: snapshot.brand || 'Innisfree',
      sellerTab: snapshot.sellerTab || 'overview',
      adminTab: snapshot.adminTab || 'merchants',
      modal: snapshot.modal || null
    };

    setActiveView(snapshot.view || 'home');
    if (snapshot.productId) {
      setSelectedProduct(findProductById(snapshot.productId));
    }
    setCategoryFilter(snapshot.category || '');
    setSearchQuery(snapshot.search || '');
    if (snapshot.brand) setSelectedBrand(snapshot.brand);
    if (snapshot.sellerTab) setSellerTab(snapshot.sellerTab);
    if (snapshot.adminTab) setAdminTab(snapshot.adminTab);

    // Apply modal state
    setIsCartOpen(snapshot.modal === 'cart');
    setIsAuthModalOpen(snapshot.modal === 'auth');
    setIsTryOnOpen(snapshot.modal === 'try-on');
    setIsQuizOpen(snapshot.modal === 'quiz');
    setIsSkinScannerOpen(snapshot.modal === 'skin-scanner');
    setIsBeautyPassOpen(snapshot.modal === 'beauty-pass');
    if (snapshot.modal === 'quick-view' && snapshot.productId) {
      setQuickViewProduct(findProductById(snapshot.productId));
    } else {
      setQuickViewProduct(null);
    }
  }, []);

  // Initial Mount & Popstate Listener (Home Fallback Guard)
  useEffect(() => {
    const init = initialRef.current;
    const baseHomeSnapshot = {
      view: 'home',
      productId: null,
      category: '',
      search: '',
      brand: 'Innisfree',
      sellerTab: 'overview',
      adminTab: 'merchants',
      modal: null,
      isHomeBase: true
    };

    if (init.view !== 'home' || init.modal) {
      // Deep link support: mark Home as base entry, then push the current deep link
      window.history.replaceState(baseHomeSnapshot, '', '/');
      const deepUrl = buildNavUrl(init);
      window.history.pushState(init, '', deepUrl);
    } else {
      // Mark Home as base entry in history stack
      window.history.replaceState(baseHomeSnapshot, '', '/');
    }

    const handlePopState = (event) => {
      isPopStateRef.current = true;
      let snapshot = event.state;

      // Home Fallback Guard: if user hits Back when state is null, gracefully fall back to Home
      if (!snapshot || (!snapshot.view && !snapshot.modal)) {
        snapshot = baseHomeSnapshot;
      }

      applySnapshot(snapshot);
      isPopStateRef.current = false;
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [applySnapshot]);

  // Navigate function: updates state and pushes/replaces HTML5 history
  const navigateTo = useCallback((next, options = {}) => {
    console.log('[useBrowserHistorySync] navigateTo called:', next);
    const { replace = false, skipScroll = false } = options;
    const cur = currentSnapshotRef.current;

    const nextView = next.view !== undefined ? next.view : cur.view;
    const nextProduct = next.product || (next.productId ? findProductById(next.productId) : (nextView === 'product-detail' ? selectedProduct : null));
    const nextProductId = nextProduct?.id || (nextView === 'product-detail' ? cur.productId : null);
    const nextCategory = next.category !== undefined ? next.category : (nextView === 'catalog' ? cur.category : '');
    const nextSearch = next.search !== undefined ? next.search : (nextView === 'catalog' ? cur.search : '');
    const nextBrand = next.brand !== undefined ? next.brand : cur.brand;
    const nextSellerTab = next.sellerTab !== undefined ? next.sellerTab : cur.sellerTab;
    const nextAdminTab = next.adminTab !== undefined ? next.adminTab : cur.adminTab;
    const nextModal = next.modal !== undefined ? next.modal : null;

    const newSnapshot = {
      view: nextView,
      productId: nextProductId,
      category: nextCategory,
      search: nextSearch,
      brand: nextBrand,
      sellerTab: nextSellerTab,
      adminTab: nextAdminTab,
      modal: nextModal,
      timestamp: Date.now()
    };

    const isIdentical =
      cur.view === newSnapshot.view &&
      cur.productId === newSnapshot.productId &&
      cur.category === newSnapshot.category &&
      cur.search === newSnapshot.search &&
      cur.brand === newSnapshot.brand &&
      cur.sellerTab === newSnapshot.sellerTab &&
      cur.adminTab === newSnapshot.adminTab &&
      cur.modal === newSnapshot.modal;

    if (!isIdentical && !isPopStateRef.current) {
      const url = buildNavUrl(newSnapshot);
      if (replace) {
        window.history.replaceState(newSnapshot, '', url);
      } else {
        window.history.pushState(newSnapshot, '', url);
      }
      currentSnapshotRef.current = newSnapshot;

      if (!skipScroll) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    // Update React states
    setActiveView(nextView);
    if (nextProduct) setSelectedProduct(nextProduct);
    setCategoryFilter(nextCategory);
    setSearchQuery(nextSearch);
    setSelectedBrand(nextBrand);
    setSellerTab(nextSellerTab);
    setAdminTab(nextAdminTab);

    // Update Modals
    setIsCartOpen(nextModal === 'cart');
    setIsAuthModalOpen(nextModal === 'auth');
    setIsTryOnOpen(nextModal === 'try-on');
    setIsQuizOpen(nextModal === 'quiz');
    setIsSkinScannerOpen(nextModal === 'skin-scanner');
    setIsBeautyPassOpen(nextModal === 'beauty-pass');
    if (nextModal === 'quick-view' && nextProduct) {
      setQuickViewProduct(nextProduct);
    } else if (!nextModal) {
      setQuickViewProduct(null);
    }
  }, [selectedProduct]);

  // Open modal helper (pushes modal to history so Back closes it)
  const openModal = useCallback((modalName, data = {}) => {
    const cur = currentSnapshotRef.current;
    const prod = data.product || (data.productId ? findProductById(data.productId) : null);
    navigateTo({
      ...cur,
      modal: modalName,
      product: prod,
      productId: prod?.id || cur.productId
    }, { skipScroll: true });
  }, [navigateTo]);

  // Close modal helper (pops history if modal was pushed)
  const closeModal = useCallback(() => {
    if (currentSnapshotRef.current.modal) {
      window.history.back();
    } else {
      setIsCartOpen(false);
      setIsAuthModalOpen(false);
      setIsTryOnOpen(false);
      setIsQuizOpen(false);
      setIsSkinScannerOpen(false);
      setIsBeautyPassOpen(false);
      setQuickViewProduct(null);
    }
  }, []);

  // Go back helper for in-page button
  const goBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigateTo({ view: 'home' });
    }
  }, [navigateTo]);

  return {
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
  };
}
