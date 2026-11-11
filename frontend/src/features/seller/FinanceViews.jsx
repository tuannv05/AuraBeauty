import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet, DollarSign, ArrowUpRight, CheckCircle2, Clock, Landmark,
  Plus, AlertCircle, Download, FileText, Check, ShieldCheck, X
} from 'lucide-react';
import { crossZoneSync } from '../../lib/crossZoneSync';
import { NumberTicker, AnimatedBadge, SpringButton } from '../../components/ui';

export function FinanceViews({ subTab = 'revenue', currentShop, onAddToast, onNavigateSubTab }) {
  const [finance, setFinance] = useState(() => crossZoneSync.getFinance());
  const [revenueTab, setRevenueTab] = useState('UNSETTLED'); // 'UNSETTLED' | 'SETTLED'
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Sync with cross-zone
  React.useEffect(() => {
    return crossZoneSync.subscribe(() => {
      setFinance(crossZoneSync.getFinance());
    });
  }, []);

  const [bankAccounts, setBankAccounts] = useState([
    {
      id: 'BANK-01',
      bankName: 'Vietcombank (VCB)',
      accountNumber: '0071001234567',
      accountHolder: 'CONG TY CP MY PHAM AMOREPACIFIC VIETNAM',
      branch: 'Chi nhánh Tân Định, TP. HCM',
      isDefault: true
    },
    {
      id: 'BANK-02',
      bankName: 'Techcombank (TCB)',
      accountNumber: '19034567890012',
      accountHolder: 'CONG TY CP MY PHAM AMOREPACIFIC VIETNAM',
      branch: 'Chi nhánh Sài Gòn, TP. HCM',
      isDefault: false
    }
  ]);

  const handleRequestWithdrawal = (e) => {
    e.preventDefault();
    const amt = Number(withdrawAmount);
    if (!amt || amt <= 0) {
      onAddToast?.({ type: 'error', message: 'Vui lòng nhập số tiền rút hợp lệ.' });
      return;
    }
    if (amt > finance.sellerPayableBalance) {
      onAddToast?.({ type: 'error', message: 'Số tiền rút vượt quá số dư khả dụng trong ví Shop!' });
      return;
    }

    setIsWithdrawing(true);
    setTimeout(() => {
      const defaultBank = bankAccounts.find((b) => b.isDefault) || bankAccounts[0];
      const bankInfo = `${defaultBank.bankName} - STK: ${defaultBank.accountNumber} (${defaultBank.accountHolder})`;
      crossZoneSync.requestWithdrawal(currentShop?.id, currentShop?.name || 'Innisfree Official', amt, bankInfo);
      setIsWithdrawing(false);
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      onAddToast?.({
        type: 'success',
        message: `Đã tạo lệnh rút ${amt.toLocaleString('vi-VN')}₫ thành công! Đang chờ Admin kế toán duyệt giải ngân.`
      });
    }, 600);
  };

  // =========================================================================
  // SUBTAB: finance/revenue (DOANH THU & ĐỐI SOÁT KẾ TOÁN)
  // =========================================================================
  if (subTab === 'revenue') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="text-emerald-600" size={24} />
              Doanh Thu &amp; Đối Soát Sổ Cái Kép (Double-Entry Ledger)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Hạch toán minh bạch: Tổng tiền đơn hàng (100%) = Phí hoa hồng sàn (10%) + Thực nhận của Shop (90%).
            </p>
          </div>
          <button
            onClick={() => onAddToast?.({ type: 'info', message: 'Đang trích xuất sao kê kế toán định dạng CSV/Excel...' })}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1.5"
          >
            <Download size={15} /> Xuất Báo Cáo Quyết Toán
          </button>
        </div>

        {/* 3 KPI Thống Kê Kế Toán */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold">Đang giữ tại Ký quỹ Escrow (Chưa quyết toán)</span>
            <div className="text-2xl font-extrabold text-pink-600 mt-1">
              <NumberTicker value={finance.escrowHolding} suffix="₫" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Sẽ tự động giải ngân khi đơn hàng chuyển sang Đã Giao</p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold">Doanh thu lũy kế thực nhận (90%)</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">
              <NumberTicker value={Math.round(finance.totalRevenueAccumulated * 9)} suffix="₫" />
            </div>
            <p className="text-[11px] text-emerald-600 mt-1">Đã khấu trừ 10% hoa hồng sàn cố định</p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold">Tổng hoa hồng sàn đã đóng (10%)</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              <NumberTicker value={finance.totalRevenueAccumulated} suffix="₫" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Phục vụ hạ tầng, marketing &amp; bảo hiểm đơn hàng</p>
          </div>
        </div>

        {/* 2 Tabs Quyết Toán */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            {[
              { id: 'UNSETTLED', label: 'Chưa Quyết Toán (Đang giữ trong Escrow)' },
              { id: 'SETTLED', label: 'Đã Quyết Toán (Đã cộng vào số dư ví Shop)' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setRevenueTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  revenueTab === tab.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <th className="p-3">Mã đơn hàng con</th>
                  <th className="p-3">Ngày phát sinh</th>
                  <th className="p-3">Tổng thanh toán</th>
                  <th className="p-3">Hoa hồng sàn (10%)</th>
                  <th className="p-3">Thực nhận của Shop (90%)</th>
                  <th className="p-3 text-right">Trạng thái Escrow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {revenueTab === 'UNSETTLED' ? (
                  <>
                    <tr className="hover:bg-slate-50/80">
                      <td className="p-3 font-mono font-bold text-pink-600">SUB-ORD-882341-S01</td>
                      <td className="p-3 text-slate-500">11/11/2026</td>
                      <td className="p-3 font-bold text-slate-900">620.000₫</td>
                      <td className="p-3 text-slate-500">62.000₫</td>
                      <td className="p-3 font-extrabold text-emerald-600">558.000₫</td>
                      <td className="p-3 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          Chờ lấy hàng
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/80">
                      <td className="p-3 font-mono font-bold text-pink-600">SUB-ORD-882342-S01</td>
                      <td className="p-3 text-slate-500">11/11/2026</td>
                      <td className="p-3 font-bold text-slate-900">960.000₫</td>
                      <td className="p-3 text-slate-500">96.000₫</td>
                      <td className="p-3 font-extrabold text-emerald-600">864.000₫</td>
                      <td className="p-3 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          Đang giao
                        </span>
                      </td>
                    </tr>
                  </>
                ) : (
                  <>
                    <tr className="hover:bg-slate-50/80">
                      <td className="p-3 font-mono font-bold text-pink-600">SUB-ORD-882340-S01</td>
                      <td className="p-3 text-slate-500">08/11/2026</td>
                      <td className="p-3 font-bold text-slate-900">620.000₫</td>
                      <td className="p-3 text-slate-500">62.000₫</td>
                      <td className="p-3 font-extrabold text-emerald-600">558.000₫</td>
                      <td className="p-3 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          ✓ Đã quyết toán
                        </span>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUBTAB: finance/balance (SỐ DƯ VÍ SHOP & YÊU CẦU RÚT TIỀN)
  // =========================================================================
  if (subTab === 'balance') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Wallet className="text-pink-600" size={24} />
              Số Dư Ví Aura Mall &amp; Rút Tiền
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Số dư khả dụng có thể rút về tài khoản ngân hàng bất cứ lúc nào, miễn phí giao dịch.
            </p>
          </div>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-95 rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            <ArrowUpRight size={16} /> Yêu Cầu Rút Tiền
          </button>
        </div>

        {/* Số dư thẻ lớn */}
        <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl text-white shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold">SỐ DƯ KHẢ DỤNG HIỆN TẠI</span>
            <div className="text-3xl font-extrabold tracking-tight mt-1">
              <NumberTicker value={finance.sellerPayableBalance} suffix="₫" />
            </div>
            <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
              <ShieldCheck size={14} /> Tiền sạch đã quyết toán qua Sổ cái kép
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">TÀI KHOẢN MẶC ĐỊNH:</span>
            <strong className="text-xs text-white">Vietcombank - CN Tân Định</strong>
            <div className="font-mono text-xs text-pink-400 mt-0.5">... 1234567</div>
          </div>
        </div>

        {/* Lịch sử yêu cầu rút tiền */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Lịch sử lệnh rút tiền ({finance.pendingWithdrawRequests.length})</h3>
          <div className="space-y-3">
            {finance.pendingWithdrawRequests.map((req) => (
              <div key={req.id} className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <div className="font-mono font-bold text-slate-900">{req.id}</div>
                  <div className="text-slate-500 mt-0.5">{req.bank}</div>
                  <div className="text-[10px] text-slate-400">Thời gian: {req.createdAt}</div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-sm text-pink-600">
                    -{req.amount.toLocaleString('vi-VN')}₫
                  </div>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {req.status === 'APPROVED' ? '✓ Đã chuyển tiền' : 'Chờ Admin duyệt chi'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Yêu Cầu Rút Tiền */}
        <AnimatePresence>
          {showWithdrawModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <ArrowUpRight className="text-pink-600" size={18} />
                    Yêu Cầu Rút Tiền Về Ngân Hàng
                  </h3>
                  <button onClick={() => setShowWithdrawModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleRequestWithdrawal} className="my-4 space-y-3.5 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Số dư khả dụng:</label>
                    <div className="font-extrabold text-base text-emerald-600">
                      {finance.sellerPayableBalance.toLocaleString('vi-VN')}₫
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nhập số tiền muốn rút (VND) *</label>
                    <input
                      type="number"
                      required
                      placeholder="VD: 10000000"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-slate-600">
                    <span className="font-bold text-slate-800 block mb-0.5">Tài khoản nhận tiền:</span>
                    <div>Vietcombank - STK: 0071001234567</div>
                    <div className="text-[11px] text-slate-400">Chủ TK: CONG TY CP MY PHAM AMOREPACIFIC VIETNAM</div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setShowWithdrawModal(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={isWithdrawing}
                      className="px-5 py-2 text-xs font-bold text-white bg-pink-600 hover:bg-pink-700 rounded-xl shadow-sm transition disabled:opacity-50"
                    >
                      {isWithdrawing ? 'Đang gửi lệnh...' : 'Xác Nhận Rút Tiền'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // =========================================================================
  // SUBTAB: finance/bank-accounts (TÀI KHOẢN NGÂN HÀNG)
  // =========================================================================
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Landmark className="text-pink-600" size={24} />
            Tài Khoản Ngân Hàng Nhận Tiền Đối Soát
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý các tài khoản ngân hàng doanh nghiệp để nhận tiền quyết toán tự động từ Aura Mall.
          </p>
        </div>
        <button
          onClick={() => onAddToast?.({ type: 'info', message: 'Mở form xác thực OTP thêm tài khoản ngân hàng mới...' })}
          className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition flex items-center gap-1.5"
        >
          <Plus size={15} /> + Thêm Tài Khoản Mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {bankAccounts.map((b) => (
          <div key={b.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2 relative">
            {b.isDefault && (
              <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-pink-700">
                Mặc định nhận tiền
              </span>
            )}
            <h4 className="font-extrabold text-sm text-slate-900">{b.bankName}</h4>
            <div className="font-mono text-base font-bold text-pink-600 tracking-wider">{b.accountNumber}</div>
            <div className="text-slate-600 font-semibold">{b.accountHolder}</div>
            <div className="text-slate-400 text-[11px]">{b.branch}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
