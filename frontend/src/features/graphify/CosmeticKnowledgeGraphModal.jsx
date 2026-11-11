import React, { useState, useEffect } from 'react';
import { X, Network, AlertTriangle, CheckCircle2, ShoppingBag, Eye, RefreshCw, Filter, Sparkles, Layers } from 'lucide-react';
import GraphCanvas from './GraphCanvas';
import LOCAL_GRAPH_DATA from './cosmetics_knowledge_graph.json';

/**
 * CosmeticKnowledgeGraphModal (Graphify Engine Integration)
 * - 4 UI States: Loading Skeleton, Empty State, Error with Retry, Success Interactive Canvas
 * - Spotlight Inspection for INCI Actives, Synergies (#10B981) and Conflicts (#EF4444)
 * - Direct Add to Cart & AR Virtual Try-On triggers
 */
export default function CosmeticKnowledgeGraphModal({
  isOpen,
  onClose,
  initialProductId = null,
  onAddToCart,
  onOpenVto,
  isArActive = false
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('ALL'); // ALL, INGREDIENT, PRODUCT, SYNERGY_CONFLICT

  // Load graph data (Try API then fallback to verified local json)
  const loadGraph = async () => {
    setLoading(true);
    setError(null);
    try {
      if (initialProductId) {
        // Filter Ego-network around initialProductId from dataset
        const pNodeId = `PRODUCT:${initialProductId}`;
        const centerNode = LOCAL_GRAPH_DATA.nodes.find(n => n.id === pNodeId || n.rawId === initialProductId);

        if (centerNode) {
          const directEdges = LOCAL_GRAPH_DATA.edges.filter(e => e.source === centerNode.id || e.target === centerNode.id);
          const connectedNodeIds = new Set([centerNode.id]);
          directEdges.forEach(e => {
            connectedNodeIds.add(e.source);
            connectedNodeIds.add(e.target);
          });

          // Add 2-hop synergy/conflict edges between connected ingredients
          const activeEdges = [...directEdges];
          LOCAL_GRAPH_DATA.edges.forEach(e => {
            if ((e.relationship === 'SYNERGY_WITH' || e.relationship === 'CONFLICTS_WITH') &&
                connectedNodeIds.has(e.source) && connectedNodeIds.has(e.target)) {
              if (!activeEdges.includes(e)) activeEdges.push(e);
            }
          });

          const subNodes = LOCAL_GRAPH_DATA.nodes.filter(n => connectedNodeIds.has(n.id));
          setGraphData({ nodes: subNodes, edges: activeEdges });
          setSelectedNode(centerNode);
        } else {
          // Default to all key nodes if specific product not in ego graph
          setGraphData({
            nodes: LOCAL_GRAPH_DATA.nodes.slice(0, 45),
            edges: LOCAL_GRAPH_DATA.edges.slice(0, 90)
          });
        }
      } else {
        setGraphData({
          nodes: LOCAL_GRAPH_DATA.nodes,
          edges: LOCAL_GRAPH_DATA.edges
        });
      }
    } catch (err) {
      console.error('Error loading graph:', err);
      setError('Không thể tải bản đồ tri thức mỹ phẩm. Vui lòng thử lại.');
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadGraph();
    }
  }, [isOpen, initialProductId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
              <Network size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-800">Bản Đồ Tri Thức Hoạt Chất & Sản Phẩm (Graphify AI)</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-700 rounded-full border border-rose-200">
                  GRAPH-RAG
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Trực quan hóa tương tác đa chiều giữa hoạt chất INCI, hiệp đồng dưỡng da & cảnh báo xung đột
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter Pills Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-2.5 bg-white border-b border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-slate-400 flex items-center gap-1 mr-1">
              <Filter size={13} /> Lọc:
            </span>
            <button
              onClick={() => setSelectedFilter('ALL')}
              className={`px-3 py-1 rounded-full font-medium transition-colors ${
                selectedFilter === 'ALL'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả ({graphData.nodes.length})
            </button>
            <button
              onClick={() => setSelectedFilter('SYNERGY_CONFLICT')}
              className={`px-3 py-1 rounded-full font-medium transition-colors ${
                selectedFilter === 'SYNERGY_CONFLICT'
                  ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/20'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              ⚠️ Cảnh báo & Hiệp đồng
            </button>
            <button
              onClick={() => setSelectedFilter('INGREDIENT')}
              className={`px-3 py-1 rounded-full font-medium transition-colors ${
                selectedFilter === 'INGREDIENT'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              Hoạt chất INCI
            </button>
            <button
              onClick={() => setSelectedFilter('PRODUCT')}
              className={`px-3 py-1 rounded-full font-medium transition-colors ${
                selectedFilter === 'PRODUCT'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              Sản phẩm
            </button>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span> Hiệp đồng (Synergy)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></span> Xung đột (Conflict)
            </span>
          </div>
        </div>

        {/* Body (4 States: Loading, Empty, Error, Data) */}
        <div className="relative flex-1 p-5 overflow-hidden flex flex-col md:flex-row gap-5">
          
          {/* Main Visualizer Area */}
          <div className="flex-1 flex flex-col min-h-[380px]">
            {loading ? (
              // 1. Loading Skeleton State
              <div className="w-full h-[520px] rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 animate-spin mb-3">
                  <RefreshCw size={28} />
                </div>
                <h4 className="font-semibold text-slate-700 text-sm">Đang tải và tính toán liên kết đồ thị...</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Động cơ Graphify đang bóc tách phân cụm hoạt chất và quét ma trận tương thích dược lý.
                </p>
              </div>
            ) : error ? (
              // 2. Error State with Retry
              <div className="w-full h-[520px] rounded-xl bg-rose-50/50 border border-rose-200 flex flex-col items-center justify-center p-6 text-center">
                <AlertTriangle size={36} className="text-rose-500 mb-2" />
                <h4 className="font-bold text-slate-800 text-sm">{error}</h4>
                <p className="text-xs text-slate-500 mt-1 mb-4">Vui lòng kiểm tra lại kết nối hoặc thử lại.</p>
                <button
                  onClick={loadGraph}
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw size={14} /> Thử lại ngay
                </button>
              </div>
            ) : graphData.nodes.length === 0 ? (
              // 3. Empty State
              <div className="w-full h-[520px] rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center p-6 text-center">
                <Layers size={36} className="text-slate-400 mb-2" />
                <h4 className="font-bold text-slate-700 text-sm">Chưa có liên kết tri thức</h4>
                <p className="text-xs text-slate-500 mt-1 mb-4">Sản phẩm này chưa ghi nhận liên kết hoạt chất hoặc chưa có biến thể phù hợp.</p>
                <button
                  onClick={() => setSelectedFilter('ALL')}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                >
                  Xem toàn bộ mạng lưới
                </button>
              </div>
            ) : (
              // 4. Success State Interactive Canvas
              <GraphCanvas
                nodes={graphData.nodes}
                edges={graphData.edges}
                onNodeClick={(node) => setSelectedNode(node)}
                isArActive={isArActive}
                selectedCategory={selectedFilter}
                height="520px"
              />
            )}
          </div>

          {/* Right Side Inspection Drawer */}
          {selectedNode && (
            <div className="w-full md:w-80 bg-slate-50/90 rounded-xl border border-slate-200 p-4.5 flex flex-col justify-between animate-fadeIn text-xs">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-700">
                    {selectedNode.type}
                  </span>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Node Details */}
                <div className="mt-3.5 space-y-3">
                  {selectedNode.image && (
                    <div className="w-full h-32 rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center p-2">
                      <img
                        src={selectedNode.image}
                        alt={selectedNode.label}
                        className="max-h-full object-contain"
                      />
                    </div>
                  )}

                  <h4 className="font-bold text-sm text-slate-800 leading-snug">
                    {selectedNode.label}
                  </h4>

                  {selectedNode.price && (
                    <div className="text-rose-600 font-bold text-base">
                      {selectedNode.price.toLocaleString('vi-VN')} đ
                    </div>
                  )}

                  <p className="text-slate-600 text-xs leading-relaxed">
                    {selectedNode.description || 'Nút thành phần thuộc hệ sinh thái Đồ thị Tri thức Aura Beauty Mall.'}
                  </p>

                  {/* Safety Indices for INCI */}
                  {selectedNode.type === 'INGREDIENT' && (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                      <div className="bg-white p-2 rounded border border-slate-200 text-center">
                        <span className="block text-[10px] text-slate-400">Gây bít tắc</span>
                        <span className="font-bold text-emerald-600">{selectedNode.comedogenicRating || 0}/5</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-slate-200 text-center">
                        <span className="block text-[10px] text-slate-400">Gây kích ứng</span>
                        <span className="font-bold text-blue-600">{selectedNode.irritationRating || 0}/5</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {selectedNode.type === 'PRODUCT' && (
                <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col gap-2">
                  {onAddToCart && (
                    <button
                      onClick={() => onAddToCart({ id: selectedNode.rawId, name: selectedNode.label, price: selectedNode.price, image: selectedNode.image })}
                      className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ShoppingBag size={14} /> Thêm vào giỏ hàng
                    </button>
                  )}
                  {onOpenVto && (
                    <button
                      onClick={() => onOpenVto(selectedNode.rawId)}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Eye size={14} /> Thử son ảo AR Virtual Try-On
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Động cơ Đồ thị Tri thức Graphify Clean-room • Cập nhật 157 sản phẩm chính hãng</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
