import React, { useState } from 'react';
import { ShieldAlert, Server, Network, Layers, RefreshCw, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import GraphCanvas from './GraphCanvas';

/**
 * AdminGraphifyExplorer (Graphify Engine in Admin Zone)
 * - Tab 1: Anti-Fraud Ring Graph (Mạng lưới Chống Gian Lận Voucher & Device Fingerprint)
 * - Tab 2: Microservices Topology Graph (Kiến trúc 7 Microservices, Kafka Outbox & Saga Events)
 * - 4 UI States: Loading Skeleton, Empty State, Error with Retry, Success Interactive Canvas
 */
export default function AdminGraphifyExplorer({ initialTab = 'antifraud' }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'antifraud' or 'topology'
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Mock Anti-Fraud Ring Dataset
  const antiFraudNodes = [
    // Fraud Ring 1: Voucher Brushing Farm
    { id: 'IP:113.161.42.18', label: 'IP: 113.161.42.18 (Hà Nội)', type: 'IP', color: '#EF4444', val: 24, description: 'Địa chỉ IP phát hiện 5 tài khoản đặt hàng cùng lúc trong 3 phút.' },
    { id: 'DEV:FP-8F92A', label: 'Device: DEV-FP-8F92A (Xiaomi)', type: 'DEVICE', color: '#F97316', val: 22, description: 'Dấu vân tay phần cứng trình duyệt trùng khớp trên 4 tài khoản clone.' },
    { id: 'USER:U-CLONE-01', label: 'User: tran.van.a99', type: 'USER', color: '#EF4444', val: 18, description: 'Tài khoản mới tạo 10 phút trước, áp voucher 100K.' },
    { id: 'USER:U-CLONE-02', label: 'User: tran.van.b88', type: 'USER', color: '#EF4444', val: 18, description: 'Tài khoản clone cùng số điện thoại ảo.' },
    { id: 'USER:U-CLONE-03', label: 'User: mai.hoa.x77', type: 'USER', color: '#EF4444', val: 18, description: 'Tài khoản nghi vấn gom đơn hàng chớp nhoáng.' },
    { id: 'VOUCHER:V-AURA-100K', label: 'Voucher: AURA-100K-TET', type: 'VOUCHER', color: '#8B5CF6', val: 20, description: 'Mã giảm giá độc quyền dành cho khách hàng mới.' },
    
    // Normal User Group (Legitimate)
    { id: 'IP:14.232.18.99', label: 'IP: 14.232.18.99 (TP.HCM)', type: 'IP', color: '#10B981', val: 20, description: 'Địa chỉ IP mạng dân dụng Viettel sạch.' },
    { id: 'USER:U-VIP-01', label: 'User: nguyen.thuy.linh', type: 'USER', color: '#10B981', val: 18, description: 'Khách hàng VIP Kim Cương, lịch sử 28 đơn hàng thành công.' },
    { id: 'ORDER:ORD-AURA-9821', label: 'Order: ORD-AURA-9821', type: 'ORDER', color: '#0EA5E9', val: 16, description: 'Đơn hàng thật đã thanh toán qua thẻ tín dụng.' }
  ];

  const antiFraudEdges = [
    { source: 'USER:U-CLONE-01', target: 'IP:113.161.42.18', relationship: 'USES_IP', color: '#EF4444', description: 'Đăng nhập từ IP gian lận' },
    { source: 'USER:U-CLONE-02', target: 'IP:113.161.42.18', relationship: 'USES_IP', color: '#EF4444', description: 'Đăng nhập từ IP gian lận' },
    { source: 'USER:U-CLONE-03', target: 'IP:113.161.42.18', relationship: 'USES_IP', color: '#EF4444', description: 'Đăng nhập từ IP gian lận' },
    { source: 'USER:U-CLONE-01', target: 'DEV:FP-8F92A', relationship: 'SHARED_DEVICE', color: '#EF4444', description: 'Trùng dấu vân tay phần cứng' },
    { source: 'USER:U-CLONE-02', target: 'DEV:FP-8F92A', relationship: 'SHARED_DEVICE', color: '#EF4444', description: 'Trùng dấu vân tay phần cứng' },
    { source: 'USER:U-CLONE-01', target: 'VOUCHER:V-AURA-100K', relationship: 'ABUSED_VOUCHER', color: '#F43F5E', description: 'Lạm dụng mã voucher' },
    { source: 'USER:U-CLONE-02', target: 'VOUCHER:V-AURA-100K', relationship: 'ABUSED_VOUCHER', color: '#F43F5E', description: 'Lạm dụng mã voucher' },
    { source: 'USER:U-VIP-01', target: 'IP:14.232.18.99', relationship: 'USES_IP', color: '#10B981', description: 'Địa chỉ IP uy tín' },
    { source: 'USER:U-VIP-01', target: 'ORDER:ORD-AURA-9821', relationship: 'PLACED_ORDER', color: '#0EA5E9', description: 'Đơn hàng hợp lệ' }
  ];

  // 2. Microservices Topology Dataset
  const topologyNodes = [
    { id: 'SVC:GATEWAY', label: 'api-gateway (8080)', type: 'GATEWAY', color: '#4F46E5', val: 28, description: 'Cổng điều hướng tập trung, xác thực JWT & bảo vệ Rate Limiting.' },
    { id: 'SVC:ACCOUNT', label: 'account-service (8081)', type: 'SERVICE', color: '#0EA5E9', val: 22, description: 'Quản lý tài khoản, danh tính RBAC, hồ sơ shop & người mua.' },
    { id: 'SVC:CATALOG', label: 'catalog-service (8082)', type: 'SERVICE', color: '#10B981', val: 24, description: 'Quản lý 157 sản phẩm, danh mục 51 sub-menus & INCI specs.' },
    { id: 'SVC:INVENTORY', label: 'inventory-service (8083)', type: 'SERVICE', color: '#F59E0B', val: 24, description: 'Giữ hàng nguyên tử CAS Concurrency & quản lý hạn dùng FEFO.' },
    { id: 'SVC:ORDER', label: 'order-service (8084)', type: 'SERVICE', color: '#8B5CF6', val: 24, description: 'Điều phối Saga Split Order, tách đơn đa người bán tự động.' },
    { id: 'SVC:PAYMENT', label: 'payment-service (8085)', type: 'SERVICE', color: '#EC4899', val: 24, description: 'Sổ cái kép Double-Entry Ledger, ký quỹ Escrow 10% sàn / 90% seller.' },
    { id: 'SVC:AI_ADVISOR', label: 'ai-advisor-service (8086)', type: 'SERVICE', color: '#F43F5E', val: 24, description: 'Động cơ Graphify Knowledge Graph RAG & tư vấn mỹ phẩm SSE.' },
    { id: 'INFRA:KAFKA', label: 'Kafka Event Bus (9092)', type: 'BROKER', color: '#334155', val: 26, description: 'Truyền thông phi đồng bộ sự kiện Outbox Relay bảo toàn tính nhất quán.' },
    { id: 'INFRA:POSTGRES', label: 'PostgreSQL pgvector (5432)', type: 'DATABASE', color: '#0284C7', val: 20, description: 'R2DBC Non-blocking DB lưu trữ sổ cái, đơn hàng & vector embeddings.' },
    { id: 'INFRA:MONGO', label: 'MongoDB Reactive (27017)', type: 'DATABASE', color: '#059669', val: 20, description: 'Lưu trữ tài liệu ProductDocument 157 sản phẩm & VTO configurations.' }
  ];

  const topologyEdges = [
    { source: 'SVC:GATEWAY', target: 'SVC:ACCOUNT', relationship: 'ROUTES_HTTP', color: '#6366F1', description: 'Định tuyến HTTP Non-blocking' },
    { source: 'SVC:GATEWAY', target: 'SVC:CATALOG', relationship: 'ROUTES_HTTP', color: '#6366F1', description: 'Định tuyến HTTP Non-blocking' },
    { source: 'SVC:GATEWAY', target: 'SVC:ORDER', relationship: 'ROUTES_HTTP', color: '#6366F1', description: 'Định tuyến HTTP Non-blocking' },
    { source: 'SVC:GATEWAY', target: 'SVC:AI_ADVISOR', relationship: 'ROUTES_HTTP', color: '#6366F1', description: 'Định tuyến HTTP Non-blocking' },
    { source: 'SVC:ORDER', target: 'INFRA:KAFKA', relationship: 'OUTBOX_EVENT', color: '#8B5CF6', description: 'Phát sự kiện OrderCreatedEvent' },
    { source: 'INFRA:KAFKA', target: 'SVC:INVENTORY', relationship: 'CONSUMES_EVENT', color: '#F59E0B', description: 'Kích hoạt giữ kho nguyên tử CAS' },
    { source: 'INFRA:KAFKA', target: 'SVC:PAYMENT', relationship: 'CONSUMES_EVENT', color: '#EC4899', description: 'Ghi sổ cái kép Debit = Credit' },
    { source: 'SVC:CATALOG', target: 'INFRA:MONGO', relationship: 'REACTIVE_STREAMS', color: '#059669', description: 'Đọc/Ghi danh mục MongoDB' },
    { source: 'SVC:PAYMENT', target: 'INFRA:POSTGRES', relationship: 'R2DBC_TRANSACTION', color: '#0284C7', description: 'Giao dịch sổ cái Non-blocking' }
  ];

  const currentNodes = activeTab === 'antifraud' ? antiFraudNodes : topologyNodes;
  const currentEdges = activeTab === 'antifraud' ? antiFraudEdges : topologyEdges;

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Tab Switcher Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-200 bg-slate-50/70">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Network className="text-rose-500" size={20} />
            Graphify Admin Intelligence Explorer
          </h3>
          <p className="text-xs text-slate-500">
            Trực quan hóa mạng lưới liên kết thiết bị gian lận & giám sát luồng sự kiện 7 microservices
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-200/80 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => { setActiveTab('antifraud'); setSelectedNode(null); }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'antifraud'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert size={15} />
            Mạng Lưới Chống Gian Lận ({antiFraudNodes.length} nút)
          </button>
          <button
            onClick={() => { setActiveTab('topology'); setSelectedNode(null); }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'topology'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Server size={15} />
            Kiến Trúc 7 Microservices & Saga ({topologyNodes.length} nút)
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative p-5 flex flex-col lg:flex-row gap-5">
        <div className="flex-1 min-h-[460px]">
          <GraphCanvas
            nodes={currentNodes}
            edges={currentEdges}
            onNodeClick={(n) => setSelectedNode(n)}
            height="460px"
            selectedCategory="ALL"
          />
        </div>

        {/* Node Inspector Drawer */}
        <div className="w-full lg:w-72 bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                {selectedNode ? selectedNode.type : 'Chi tiết phần tử'}
              </span>
              {selectedNode && (
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedNode.color }}></span>
              )}
            </div>

            {selectedNode ? (
              <div className="mt-3 space-y-2.5">
                <h4 className="font-bold text-sm text-slate-800 leading-snug">{selectedNode.label}</h4>
                <p className="text-slate-600 leading-relaxed">{selectedNode.description}</p>
                <div className="p-2.5 bg-white rounded border border-slate-200 text-slate-500 font-mono text-[11px]">
                  ID: {selectedNode.id}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400">
                <Info size={28} className="mx-auto mb-2 opacity-50" />
                <p>Nhấp vào bất kỳ nút nào trên đồ thị để xem phân tích chi tiết liên kết.</p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-400">
            {activeTab === 'antifraud' ? (
              <span className="text-rose-600 font-semibold">⚠️ Cảnh báo: Phát hiện 1 vòng vây gian lận IP/Device</span>
            ) : (
              <span className="text-emerald-600 font-semibold">✅ 7 Microservices phản ứng Non-blocking ổn định</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
