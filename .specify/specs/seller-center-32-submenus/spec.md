# SPEC: KÊNH NGƯỜI BÁN SHOPEE (7 PHÂN HỆ - 32 SUB-MENUS) & ĐỒNG BỘ LIÊN THÔNG 3 PHÂN KHU (SELLER ↔ BUYER ↔ ADMIN)
> Đồng bộ từ [docs/flows/QT-11-shopee-seller-center-32-submenus-sync.md](file:///d:/A_javaFW/WebBanMP/docs/flows/QT-11-shopee-seller-center-32-submenus-sync.md)

## 1. Mục tiêu
- Phát triển toàn diện Kênh Người Bán Shopee (7 phân hệ - 32 sub-menus).
- Đồng bộ liên thông 3 phân khu: Seller ↔ Buyer ↔ Admin.
- Tích hợp đồ thị tri thức Graphify (`SellerProductSynergyGraph`) tại `products/ai-optimizer`.
- Cam kết 0% màn hình trắng, hỗ trợ backward-compatible alias cho 9 tab cũ.

## 2. 7 Phân hệ & 32 Sub-menus
1. Quản Lý Đơn Hàng (5): `orders/all`, `orders/mass-ship`, `orders/handover`, `orders/return-refund`, `orders/shipping-settings`
2. Quản Lý Sản Phẩm (4): `products/all`, `products/add`, `products/standard`, `products/ai-optimizer`
3. Kênh Marketing (10): `marketing/center`, `marketing/bidding`, `marketing/display-ads`, `marketing/off-platform-ads`, `marketing/kol-affiliate`, `marketing/live-video`, `marketing/discounts`, `marketing/flash-sale`, `marketing/vouchers`, `marketing/shopee-campaigns`
4. Chăm Sóc Khách Hàng (4): `cs/chat`, `cs/ai-assistant`, `cs/broadcast`, `cs/reviews`
5. Tài Chính (3): `finance/revenue`, `finance/balance`, `finance/bank-accounts`
6. Dữ Liệu (2): `data/sales-analytics`, `data/operation-performance`
7. Quản Lý Shop (5): `shop/profile`, `shop/decoration`, `shop/settings`, `shop/appeals`, `shop/missions`

## 3. Tiêu chí nghiệm thu (AC-01..AC-06)
- Đầy đủ 32 sub-menus có logic nghiệp vụ thật, 4 trạng thái UI.
- Tự động map 9 tab cũ (`overview`, `products`, `inventory`, `orders`, `warehouses`, `ads`, `marketing`, `cs`, `finance`).
- Đồng bộ tức thì Sản phẩm CBMP, Đơn hàng CAS/FEFO, Tài chính Escrow Sổ cái kép 10%/90%, Marketing.
- Clean Root và build production thành công.
