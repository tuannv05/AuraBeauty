import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Truck, Printer, RotateCcw, Settings, Search, CheckCircle2,
  AlertCircle, Clock, ChevronRight, Download, Eye, FileText, Check,
  QrCode, Barcode, ShieldAlert, X, Sparkles, Filter, ExternalLink, ArrowRight
} from 'lucide-react';
import { crossZoneSync } from '../../lib/crossZoneSync';
import { NumberTicker, AnimatedBadge, SpringButton } from '../../components/ui';

export function OrderManagementViews({ subTab = 'all', currentShop, onAddToast, onNavigateSubTab }) {
  const [orders, setOrders] = useState(() => crossZoneSync.getOrders(currentShop?.id));
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'PENDING_CONFIRMATION' | 'PROCESSING' | 'SHIPPING' | 'DELIVERED' | 'RETURN_REQUESTED'
  const [quickFilter, setQuickFilter] = useState('ALL'); // 'ALL' | 'EXPRESS' | 'STANDARD'
  const [searchQuery, setSearchQuery] = useState('');
  const [showAwbModal, setShowAwbModal] = useState(false);
  const [activeAwbOrders, setActiveAwbOrders] = useState([]);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [selectedDisputeOrder, setSelectedDisputeOrder] = useState(null);
  const [disputeReasonInput, setDisputeReasonInput] = useState('');

  // Reload orders on cross-zone sync
  React.useEffect(() => {
    return crossZoneSync.subscribe((detail) => {
      setOrders(crossZoneSync.getOrders(currentShop?.id));
    });
  }, [currentShop?.id]);

  // Filtering
  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
    if (quickFilter === 'EXPRESS' && o.shippingMethod !== 'EXPRESS_2H') return false;
    if (quickFilter === 'STANDARD' && o.shippingMethod === 'EXPRESS_2H') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = o.subOrderId.toLowerCase().includes(q) || (o.masterOrderId && o.masterOrderId.toLowerCase().includes(q));
      const matchBuyer = o.buyerName && o.buyerName.toLowerCase().includes(q);
      const matchTracking = o.trackingCode && o.trackingCode.toLowerCase().includes(q);
      if (!matchId && !matchBuyer && !matchTracking) return false;
    }
    return true;
  });

  // Counters
  const counts = {
    ALL: orders.length,
    PENDING_CONFIRMATION: orders.filter((o) => o.status === 'PENDING_CONFIRMATION').length,
    PROCESSING: orders.filter((o) => o.status === 'PROCESSING').length,
    SHIPPING: orders.filter((o) => o.status === 'SHIPPING').length,
    DELIVERED: orders.filter((o) => o.status === 'DELIVERED' || o.status === 'COMPLETED').length,
    RETURN_REQUESTED: orders.filter((o) => o.status === 'RETURN_REQUESTED' || o.status === 'REFUNDED').length
  };

  // Handler: Confirm single order
  const handleConfirmOrder = (subOrderId) => {
    setIsActionLoading(true);
    setTimeout(() => {
      crossZoneSync.updateOrderStatus(subOrderId, 'PROCESSING');
      setIsActionLoading(false);
      onAddToast?.({ type: 'success', message: `Đã xác nhận đơn hàng ${subOrderId}. Chuyển sang chờ lấy hàng.` });
    }, 400);
  };

  // Handler: Mass Ship
  const handleTriggerMassShip = (targetIds = selectedOrderIds) => {
    if (targetIds.length === 0) {
      onAddToast?.({ type: 'error', message: 'Vui lòng chọn ít nhất 1 đơn hàng để giao hàng loạt.' });
      return;
    }
    setIsActionLoading(true);
    setTimeout(() => {
      const ordersToShip = orders.filter((o) => targetIds.includes(o.subOrderId));
      crossZoneSync.massShipOrders(targetIds);
      setActiveAwbOrders(ordersToShip);
      setShowAwbModal(true);
      setSelectedOrderIds([]);
      setIsActionLoading(false);
      onAddToast?.({ type: 'success', message: `Đã xuất kho FEFO & tạo vận đơn hàng loạt cho ${targetIds.length} đơn hàng!` });
    }, 600);
  };

  // Handler: Return/Refund accept or dispute
  const handleAcceptReturn = (subOrderId) => {
    crossZoneSync.updateOrderStatus(subOrderId, 'REFUNDED');
    onAddToast?.({ type: 'info', message: `Đã chấp thuận hoàn tiền cho đơn ${subOrderId}. Tiền hoàn về ví Buyer.` });
  };

  const handleEscalateDispute = (order) => {
    if (!disputeReasonInput.trim()) {
      onAddToast?.({ type: 'error', message: 'Vui lòng nhập lý do phản hồi khiếu nại lên Sàn.' });
      return;
    }
    crossZoneSync.requestReturnRefund(order.subOrderId, disputeReasonInput, order.returnEvidence || 'Biên bản đồng kiểm bưu tá');
    setSelectedDisputeOrder(null);
    setDisputeReasonInput('');
    onAddToast?.({ type: 'success', message: `Đã chuyển khiếu nại đơn ${order.subOrderId} sang Tòa Trọng Tài Sàn (Admin Disputes).` });
  };

  // =========================================================================
  // VIEW 1: orders/all (TẤT CẢ ĐƠN HÀNG)
  // =========================================================================
  if (subTab === 'all') {
    return (
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Package className="text-pink-600" size={24} />
              Quản Lý Tất Cả Đơn Hàng
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Phân tách đơn con đa gian hàng (Split Order) • Xuất kho FEFO • Giữ kho nguyên tử CAS
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onAddToast?.({ type: 'info', message: 'Đang tải file Excel danh sách đơn hàng...' })}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1.5"
            >
              <Download size={15} /> Xuất Báo Cáo
            </button>
            <SpringButton
              onClick={() => handleTriggerMassShip()}
              disabled={selectedOrderIds.length === 0 || isActionLoading}
              className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow-sm flex items-center gap-2 ${
                selectedOrderIds.length > 0 ? 'bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-95' : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              <Printer size={15} />
              {isActionLoading ? 'Đang xử lý...' : `📦 Giao Hàng Loạt (${selectedOrderIds.length})`}
            </SpringButton>
          </div>
        </div>

        {/* 6 Tabs Trạng Thái */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          {[
            { id: 'ALL', label: 'Tất cả', count: counts.ALL },
            { id: 'PENDING_CONFIRMATION', label: 'Chờ xác nhận', count: counts.PENDING_CONFIRMATION, alert: counts.PENDING_CONFIRMATION > 0 },
            { id: 'PROCESSING', label: 'Chờ lấy hàng', count: counts.PROCESSING },
            { id: 'SHIPPING', label: 'Đang giao', count: counts.SHIPPING },
            { id: 'DELIVERED', label: 'Đã giao', count: counts.DELIVERED },
            { id: 'RETURN_REQUESTED', label: 'Trả hàng/Hoàn tiền', count: counts.RETURN_REQUESTED, alert: counts.RETURN_REQUESTED > 0 }
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : tab.alert
                      ? 'bg-rose-100 text-rose-700 font-extrabold'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Pill Filters & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Bộ lọc nhanh:</span>
            {[
              { id: 'ALL', label: 'Tất cả đơn' },
              { id: 'EXPRESS', label: '⚡ Hỏa Tốc 2H' },
              { id: 'STANDARD', label: 'Tiêu Chuẩn' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setQuickFilter(f.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  quickFilter === f.id
                    ? 'bg-pink-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Tìm theo Mã đơn, Khách hàng, Mã vận đơn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>

        {/* Bảng Dữ Liệu 5 Cột Chuẩn Shopee */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {filteredOrders.length === 0 ? (
            /* EMPTY STATE */
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <Package size={28} />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Không tìm thấy đơn hàng nào</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Hiện tại không có đơn hàng nào khớp với bộ lọc đang chọn. Bạn có thể xóa từ khóa tìm kiếm hoặc chọn tab khác.
              </p>
              <button
                onClick={() => {
                  setStatusFilter('ALL');
                  setQuickFilter('ALL');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 text-xs font-semibold text-pink-600 bg-pink-50 hover:bg-pink-100 rounded-xl transition"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="p-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={selectedOrderIds.length === filteredOrders.length && filteredOrders.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOrderIds(filteredOrders.map((o) => o.subOrderId));
                          } else {
                            setSelectedOrderIds([]);
                          }
                        }}
                        className="rounded border-slate-300 text-pink-600 focus:ring-pink-500"
                      />
                    </th>
                    <th className="p-3">Sản phẩm &amp; Phân loại</th>
                    <th className="p-3 w-36">Tổng thanh toán</th>
                    <th className="p-3 w-44">Trạng thái &amp; SLA</th>
                    <th className="p-3 w-40">Đơn vị vận chuyển</th>
                    <th className="p-3 w-36 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((order) => {
                    const isSelected = selectedOrderIds.includes(order.subOrderId);
                    return (
                      <tr key={order.subOrderId} className={`hover:bg-slate-50/80 transition ${isSelected ? 'bg-pink-50/40' : ''}`}>
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedOrderIds((prev) => [...prev, order.subOrderId]);
                              } else {
                                setSelectedOrderIds((prev) => prev.filter((id) => id !== order.subOrderId));
                              }
                            }}
                            className="rounded border-slate-300 text-pink-600 focus:ring-pink-500"
                          />
                        </td>
                        <td className="p-3">
                          <div className="text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                            <span className="font-mono text-pink-600">{order.subOrderId}</span>
                            <span className="text-slate-400 font-normal">| {order.buyerName}</span>
                          </div>
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2.5">
                                <img
                                  src={item.image}
                                  alt={item.productName}
                                  className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                                />
                                <div>
                                  <div className="font-semibold text-slate-900 line-clamp-1">{item.productName}</div>
                                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                                    <span>Phân loại: {item.variantTitle}</span>
                                    <span>x{item.quantity}</span>
                                    {item.batchNo && (
                                      <span className="text-emerald-600 font-mono bg-emerald-50 px-1 rounded">
                                        Lô: {item.batchNo}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="font-extrabold text-slate-900 text-sm">
                            {order.totalAmount.toLocaleString('vi-VN')}₫
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Thực nhận 90%: <strong className="text-emerald-600">{order.sellerAmount?.toLocaleString('vi-VN')}₫</strong>
                          </div>
                          <div className="text-[10px] text-slate-400">Phí sàn 10%: {order.commissionAmount?.toLocaleString('vi-VN')}₫</div>
                        </td>
                        <td className="p-3">
                          {order.status === 'PENDING_CONFIRMATION' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                              <Clock size={12} /> Chờ xác nhận
                            </span>
                          )}
                          {order.status === 'PROCESSING' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                              <Package size={12} /> Chờ lấy hàng
                            </span>
                          )}
                          {order.status === 'SHIPPING' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">
                              <Truck size={12} /> Đang giao hàng
                            </span>
                          )}
                          {order.status === 'DELIVERED' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                              <CheckCircle2 size={12} /> Đã giao hàng
                            </span>
                          )}
                          {order.status === 'RETURN_REQUESTED' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                              <AlertCircle size={12} /> Yêu cầu hoàn tiền
                            </span>
                          )}
                          {order.status === 'REFUNDED' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-200 text-slate-800">
                              Đã hoàn tiền
                            </span>
                          )}
                          <div className="text-[10px] text-slate-400 mt-1">Hạn SLA: {order.slaDeadline}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-slate-800">{order.carrier}</div>
                          {order.trackingCode && (
                            <div className="font-mono text-[11px] text-pink-600 font-bold">{order.trackingCode}</div>
                          )}
                          {order.shippingMethod === 'EXPRESS_2H' && (
                            <span className="inline-block mt-0.5 text-[10px] bg-rose-50 text-rose-700 font-bold px-1.5 py-0.5 rounded">
                              ⚡ Hỏa tốc 2H
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right space-y-1">
                          {order.status === 'PENDING_CONFIRMATION' && (
                            <button
                              onClick={() => handleConfirmOrder(order.subOrderId)}
                              disabled={isActionLoading}
                              className="w-full px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition"
                            >
                              Xác Nhận Đơn
                            </button>
                          )}
                          {order.status === 'PROCESSING' && (
                            <button
                              onClick={() => handleTriggerMassShip([order.subOrderId])}
                              disabled={isActionLoading}
                              className="w-full px-3 py-1.5 text-xs font-bold text-white bg-pink-600 hover:bg-pink-700 rounded-lg shadow-sm transition"
                            >
                              Giao Hàng &amp; In AWB
                            </button>
                          )}
                          {order.status === 'RETURN_REQUESTED' && (
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => handleAcceptReturn(order.subOrderId)}
                                className="px-2 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg"
                              >
                                ✓ Đồng ý hoàn
                              </button>
                              <button
                                onClick={() => setSelectedDisputeOrder(order)}
                                className="px-2 py-1 text-[11px] font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 rounded-lg"
                              >
                                Khiếu nại lên Sàn
                              </button>
                            </div>
                          )}
                          <button
                            onClick={() => onAddToast?.({ type: 'info', message: `Chi tiết vận đơn: ${order.subOrderId}` })}
                            className="text-[11px] text-slate-500 hover:text-slate-900 font-semibold block text-right mt-1"
                          >
                            Xem chi tiết
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal: In Phiếu Giao Hàng Hàng Loạt (AWB Barcode / QR) */}
        <AnimatePresence>
          {showAwbModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl p-6 max-w-2xl w-full border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Printer className="text-pink-600" size={20} />
                      Phiếu Vận Đơn Điện Tử AWB (Air Waybill) Hàng Loạt
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Đã gán mã vận đơn &amp; xuất kho theo đúng lô cận hạn FEFO
                    </p>
                  </div>
                  <button onClick={() => setShowAwbModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4 my-5">
                  {activeAwbOrders.map((o) => (
                    <div key={o.subOrderId} className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-xs font-bold text-slate-500">AURA BEAUTY MALL • OFFICIAL MALL</div>
                          <div className="text-sm font-extrabold text-slate-900 mt-1">{o.carrier}</div>
                          <div className="font-mono text-base font-extrabold text-pink-600 tracking-wider mt-0.5">
                            {o.trackingCode}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Barcode size={38} className="text-slate-800" />
                          <QrCode size={38} className="text-slate-800" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-200 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[10px]">NGƯỜI GỬI:</span>
                          <strong className="text-slate-800">{o.shopName}</strong>
                          <div className="text-[11px] text-slate-500">Kho KCN Tân Bình, TP.HCM</div>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">NGƯỜI NHẬN:</span>
                          <strong className="text-slate-800">{o.buyerName}</strong> ({o.buyerPhone})
                          <div className="text-[11px] text-slate-500 line-clamp-1">{o.shippingAddress}</div>
                        </div>
                      </div>
                      <div className="mt-2 text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200 flex justify-between">
                        <span>Hàng: {o.items.map((i) => i.productName).join(', ')}</span>
                        <strong className="text-slate-900">{o.totalAmount.toLocaleString('vi-VN')}₫ (Đã thanh toán)</strong>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200">
                  <button
                    onClick={() => setShowAwbModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl flex items-center gap-1.5"
                  >
                    <Printer size={15} /> In Tất Cả ({activeAwbOrders.length} phiếu)
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal: Khiếu nại lên Sàn (Dispute Modal) */}
        <AnimatePresence>
          {selectedDisputeOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ShieldAlert className="text-rose-600" size={18} />
                    Khiếu Nại Đơn Hàng Lên Tòa Trọng Tài Sàn
                  </h3>
                  <button onClick={() => setSelectedDisputeOrder(null)} className="text-slate-400 hover:text-slate-600">
                    <X size={18} />
                  </button>
                </div>

                <div className="my-4 space-y-3 text-xs">
                  <div className="p-3 bg-rose-50 rounded-xl text-rose-800">
                    <strong>Đơn hàng:</strong> {selectedDisputeOrder.subOrderId} • Khách hàng: {selectedDisputeOrder.buyerName}
                    <div className="mt-1">
                      <strong>Lý do khách yêu cầu hoàn:</strong> "{selectedDisputeOrder.returnReason}"
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Minh chứng &amp; Lập luận của Shop (Gửi Admin phán quyết):
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Ví dụ: Shop có video đóng gói camera HD nguyên tem niêm phong và bưu tá đã ký nhận kiện hàng nguyên vẹn..."
                      value={disputeReasonInput}
                      onChange={(e) => setDisputeReasonInput(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => setSelectedDisputeOrder(null)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => handleEscalateDispute(selectedDisputeOrder)}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm"
                  >
                    Gửi Khiếu Nại Sang Admin
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: orders/mass-ship (GIAO HÀNG LOẠT)
  // =========================================================================
  if (subTab === 'mass-ship') {
    const pendingOrders = orders.filter((o) => o.status === 'PENDING_CONFIRMATION' || o.status === 'PROCESSING');
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Printer className="text-pink-600" size={24} />
              Giao Hàng Loạt &amp; In Phiếu AWB
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Tối ưu cho ca đóng gói cao điểm: tự động lấy hàng theo nguyên tắc FEFO và in nhãn AWB đồng loạt.
            </p>
          </div>
          <button
            onClick={() => handleTriggerMassShip(pendingOrders.map((o) => o.subOrderId))}
            disabled={pendingOrders.length === 0}
            className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl shadow-sm hover:opacity-95 transition flex items-center gap-2 disabled:opacity-50"
          >
            <Printer size={16} /> Giao Tất Cả {pendingOrders.length} Đơn Chờ
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
            <span className="text-xs text-emerald-700 font-semibold">Tồn kho nguyên tử CAS</span>
            <div className="text-xl font-bold text-emerald-900 mt-1">100% Khả Dụng</div>
            <p className="text-[11px] text-emerald-600 mt-0.5">Không xảy ra xung đột giữ hàng âm</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
            <span className="text-xs text-blue-700 font-semibold">Lô hàng ưu tiên (FEFO)</span>
            <div className="text-xl font-bold text-blue-900 mt-1">LOT-202409 / 10</div>
            <p className="text-[11px] text-blue-600 mt-0.5">Hạn dùng xa 2027, date đạt chuẩn Mall</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
            <span className="text-xs text-purple-700 font-semibold">ĐVVC Liên kết API</span>
            <div className="text-xl font-bold text-purple-900 mt-1">GHTK, SPX, GHN</div>
            <p className="text-[11px] text-purple-600 mt-0.5">Tự động đẩy mã vận đơn thời gian thực</p>
          </div>
        </div>

        {/* Danh sách các đơn chờ giao */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Đơn hàng cần chuẩn bị ({pendingOrders.length})</h3>
          {pendingOrders.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Tuyệt vời! Toàn bộ đơn hàng đã được chuẩn bị và bàn giao cho ĐVVC.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingOrders.map((o) => (
                <div key={o.subOrderId} className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-mono text-xs font-bold text-pink-600">{o.subOrderId}</div>
                    <div className="text-xs font-semibold text-slate-800 mt-0.5">
                      {o.buyerName} • {o.items.map((i) => `${i.productName} (${i.variantTitle})`).join(', ')}
                    </div>
                    <div className="text-[11px] text-slate-500">ĐVVC: {o.carrier} • Hạn gửi: {o.slaDeadline}</div>
                  </div>
                  <button
                    onClick={() => handleTriggerMassShip([o.subOrderId])}
                    className="px-3 py-1.5 text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                  >
                    Xử lý đơn này
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: orders/handover (BÀN GIAO ĐƠN HÀNG)
  // =========================================================================
  if (subTab === 'handover') {
    const shippingOrders = orders.filter((o) => o.status === 'SHIPPING');
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Truck className="text-pink-600" size={24} />
              Bàn Giao Đơn Hàng Cho ĐVVC
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Quét mã vạch bàn giao cho bưu tá và in Biên Bản Bàn Giao Hàng Hóa có chữ ký hai bên.
            </p>
          </div>
          <button
            onClick={() => onAddToast?.({ type: 'success', message: 'Đã xuất file PDF Biên Bản Bàn Giao có chữ ký số.' })}
            className="px-4 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1.5"
          >
            <Printer size={15} /> In Biên Bản Bàn Giao
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Kiện hàng đang chờ bưu tá lấy ({shippingOrders.length})</h3>
          <div className="space-y-3">
            {shippingOrders.map((o) => (
              <div key={o.subOrderId} className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-mono text-xs font-bold text-pink-600">{o.trackingCode}</div>
                  <div className="text-xs text-slate-800 font-semibold">{o.carrier} • Đơn {o.subOrderId}</div>
                  <div className="text-[11px] text-slate-500">Khách: {o.buyerName} • {o.shippingAddress}</div>
                </div>
                <span className="px-2.5 py-1 text-[11px] font-bold text-purple-700 bg-purple-50 rounded-full">
                  Đã dán nhãn AWB
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 4: orders/return-refund (TRẢ HÀNG / HOÀN TIỀN)
  // =========================================================================
  if (subTab === 'return-refund') {
    const returnOrders = orders.filter((o) => o.status === 'RETURN_REQUESTED' || o.status === 'REFUNDED');
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <RotateCcw className="text-rose-600" size={24} />
            Quản Lý Đơn Trả Hàng / Hoàn Tiền / Khiếu Nại
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Xử lý minh bạch theo quy chế bảo vệ người tiêu dùng của Aura Mall: Hoàn tiền ngay hoặc khiếu nại lên Sàn.
          </p>
        </div>

        <div className="space-y-4">
          {returnOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
              Hiện không có đơn hàng nào có yêu cầu khiếu nại trả hàng.
            </div>
          ) : (
            returnOrders.map((o) => (
              <div key={o.subOrderId} className="bg-white rounded-2xl border border-rose-200 p-5 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-rose-600">{o.subOrderId}</span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">Khách hàng: {o.buyerName}</h3>
                    <div className="text-xs text-slate-500">Số điện thoại: {o.buyerPhone}</div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                    {o.status === 'REFUNDED' ? 'Đã hoàn tiền' : 'Chờ Shop phản hồi'}
                  </span>
                </div>

                <div className="p-3 bg-rose-50/60 rounded-xl text-xs text-slate-700">
                  <div className="font-bold text-rose-900">Lý do yêu cầu trả hàng:</div>
                  <div className="italic mt-0.5">"{o.returnReason || 'Không vừa ý / Hàng móp méo'}"</div>
                  {o.returnEvidence && (
                    <div className="mt-2 text-pink-700 font-semibold flex items-center gap-1">
                      📁 Minh chứng khách chụp: <a href={o.returnEvidence} target="_blank" rel="noreferrer" className="underline">Xem ảnh</a>
                    </div>
                  )}
                </div>

                {o.status === 'RETURN_REQUESTED' && (
                  <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleAcceptReturn(o.subOrderId)}
                      className="px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition"
                    >
                      ✓ Đồng Ý Hoàn Tiền (Rút Từ Escrow)
                    </button>
                    <button
                      onClick={() => setSelectedDisputeOrder(o)}
                      className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition"
                    >
                      🚨 Khiếu Nại Lên Tòa Trọng Tài Sàn
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 5: orders/shipping-settings (CÀI ĐẶT VẬN CHUYỂN)
  // =========================================================================
  if (subTab === 'shipping-settings') {
    const settings = crossZoneSync.getShopSettings(currentShop?.id);
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="text-pink-600" size={24} />
            Cài Đặt Vận Chuyển &amp; Kho Đa Điểm
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Thiết lập các kênh vận chuyển khả dụng và quản lý kho hàng kết nối Smart Routing của sàn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cấu hình kênh giao */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Kênh Vận Chuyển Hoạt Động</h3>
            {[
              { id: 'express2h', name: '⚡ Giao Hàng Hỏa Tốc 2H (Aura Now)', desc: 'Áp dụng nội thành TP.HCM & Hà Nội, giao trong 120 phút.', enabled: true },
              { id: 'standard', name: 'Giao Hàng Tiêu Chuẩn (1-3 ngày)', desc: 'GHTK, SPX, GHN toàn quốc.', enabled: true },
              { id: 'economy', name: 'Giao Hàng Tiết Kiệm (3-5 ngày)', desc: 'Tối ưu chi phí cho kiện hàng nặng.', enabled: false }
            ].map((ch) => (
              <div key={ch.id} className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">{ch.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{ch.desc}</div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={ch.enabled}
                  onChange={(e) => onAddToast?.({ type: 'info', message: `Đã cập nhật trạng thái kênh ${ch.name}` })}
                  className="rounded border-slate-300 text-pink-600 focus:ring-pink-500 w-4 h-4"
                />
              </div>
            ))}
          </div>

          {/* Kho đa điểm */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Hệ Thống Kho Đa Điểm (Smart Routing)</h3>
            {settings.warehouses.map((wh) => (
              <div key={wh.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-slate-900">{wh.name}</strong>
                  {wh.isDefault && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-pink-100 text-pink-700 rounded-full">
                      Kho mặc định
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{wh.address}</p>
              </div>
            ))}
            <button
              onClick={() => onAddToast?.({ type: 'info', message: 'Mở form liên kết thêm kho trung chuyển...' })}
              className="w-full py-2 text-xs font-semibold text-pink-600 bg-pink-50 hover:bg-pink-100 rounded-xl transition"
            >
              + Thêm Điểm Kho Mới
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
