import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Sparkles } from 'lucide-react';

/**
 * Reusable Interactive Knowledge Graph Canvas (Graphify Architecture)
 * - 60 FPS Canvas 2D with DPI compensation
 * - Physics simulation with velocity damping & stable equilibrium
 * - Automatic pause when AR Virtual Try-On camera is active (GPU protection)
 * - Spotlight Hover & Node Selection Drawer
 */
export default function GraphCanvas({
  nodes = [],
  edges = [],
  onNodeClick,
  isArActive = false,
  height = '520px',
  selectedCategory = 'ALL'
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Simulation internal state
  const simNodesRef = useRef([]);
  const simEdgesRef = useRef([]);
  const animFrameIdRef = useRef(null);

  // Camera Pan & Zoom state
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const transformRef = useRef({ scale: 1, x: 0, y: 0 });
  transformRef.current = transform;

  // Interaction tracking
  const draggingNodeRef = useRef(null);
  const isPanningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState(null);
  const hoveredNodeRef = useRef(null);
  hoveredNodeRef.current = hoveredNode;

  // Filter nodes based on category
  const filteredNodes = React.useMemo(() => {
    if (selectedCategory === 'ALL') return nodes;
    if (selectedCategory === 'SYNERGY_CONFLICT') {
      const activeIds = new Set();
      edges.forEach(e => {
        if (e.relationship === 'SYNERGY_WITH' || e.relationship === 'CONFLICTS_WITH') {
          activeIds.add(e.source);
          activeIds.add(e.target);
        }
      });
      return nodes.filter(n => activeIds.has(n.id) || n.type === 'INGREDIENT');
    }
    return nodes.filter(n => n.type === selectedCategory || n.category === selectedCategory);
  }, [nodes, edges, selectedCategory]);

  const filteredNodeIds = React.useMemo(() => new Set(filteredNodes.map(n => n.id)), [filteredNodes]);

  const filteredEdges = React.useMemo(() => {
    return edges.filter(e => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target));
  }, [edges, filteredNodeIds]);

  // Initialize simulation positions
  useEffect(() => {
    const width = containerRef.current ? containerRef.current.clientWidth : 800;
    const h = parseInt(height, 10) || 520;
    const cx = width / 2;
    const cy = h / 2;

    simNodesRef.current = filteredNodes.map((n, i) => {
      const angle = (i / filteredNodes.length) * 2 * Math.PI;
      const radius = 80 + Math.random() * 180;
      return {
        ...n,
        x: n.x !== undefined ? n.x : cx + radius * Math.cos(angle),
        y: n.y !== undefined ? n.y : cy + radius * Math.sin(angle),
        vx: 0,
        vy: 0,
        radius: n.type === 'PRODUCT' ? 22 : n.type === 'INGREDIENT' ? 26 : 18
      };
    });

    simEdgesRef.current = filteredEdges.map(e => ({ ...e }));
  }, [filteredNodes, filteredEdges, height]);

  // Simulation step & render loop
  useEffect(() => {
    if (isArActive) {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    let isRunning = true;

    function render() {
      if (!isRunning) return;

      const width = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);

      // --- 1. PHYSICS UPDATE STEP ---
      const sNodes = simNodesRef.current;
      const sEdges = simEdgesRef.current;
      const cx = width / 2;
      const cy = h / 2;

      // Centering force & velocity damping
      for (let i = 0; i < sNodes.length; i++) {
        const node = sNodes[i];
        if (node === draggingNodeRef.current) continue;

        // Centering
        node.vx += (cx - node.x) * 0.0005;
        node.vy += (cy - node.y) * 0.0005;

        // Repulsion between nodes (Coulomb)
        for (let j = i + 1; j < sNodes.length; j++) {
          const other = sNodes[j];
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const distSq = dx * dx + dy * dy + 1;
          const dist = Math.sqrt(distSq);
          if (dist < 260) {
            const force = 120 / distSq;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            node.vx -= fx;
            node.vy -= fy;
            other.vx += fx;
            other.vy += fy;
          }
        }
      }

      // Spring force along edges (Hooke's Law)
      const nodeIndexMap = new Map();
      sNodes.forEach((n, idx) => nodeIndexMap.set(n.id, idx));

      for (let e of sEdges) {
        const sIdx = nodeIndexMap.get(e.source);
        const tIdx = nodeIndexMap.get(e.target);
        if (sIdx === undefined || tIdx === undefined) continue;

        const source = sNodes[sIdx];
        const target = sNodes[tIdx];
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const targetDist = e.relationship === 'SYNERGY_WITH' || e.relationship === 'CONFLICTS_WITH' ? 140 : 100;
        const force = (dist - targetDist) * 0.015;

        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        if (source !== draggingNodeRef.current) {
          source.vx += fx;
          source.vy += fy;
        }
        if (target !== draggingNodeRef.current) {
          target.vx -= fx;
          target.vy -= fy;
        }
      }

      // Integrate velocity and apply friction
      for (let n of sNodes) {
        if (n === draggingNodeRef.current) continue;
        n.vx *= 0.88;
        n.vy *= 0.88;
        n.x += n.vx;
        n.y += n.vy;
      }

      // --- 2. DRAWING STEP ---
      ctx.clearRect(0, 0, width, h);

      // Background subtle grid
      ctx.save();
      const currentScale = transformRef.current.scale;
      const currentX = transformRef.current.x;
      const currentY = transformRef.current.y;
      ctx.translate(currentX, currentY);
      ctx.scale(currentScale, currentScale);

      const hNode = hoveredNodeRef.current;
      const connectedNodeIds = new Set();
      if (hNode) {
        connectedNodeIds.add(hNode.id);
        sEdges.forEach(e => {
          if (e.source === hNode.id) connectedNodeIds.add(e.target);
          if (e.target === hNode.id) connectedNodeIds.add(e.source);
        });
      }

      // Draw Edges
      for (let e of sEdges) {
        const sIdx = nodeIndexMap.get(e.source);
        const tIdx = nodeIndexMap.get(e.target);
        if (sIdx === undefined || tIdx === undefined) continue;

        const s = sNodes[sIdx];
        const t = sNodes[tIdx];

        const isHighlighted = hNode && (connectedNodeIds.has(e.source) && connectedNodeIds.has(e.target));
        const isDimmed = hNode && !isHighlighted;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(t.x, t.y);

        if (e.relationship === 'SYNERGY_WITH') {
          ctx.strokeStyle = isDimmed ? 'rgba(16, 185, 129, 0.15)' : '#10B981';
          ctx.lineWidth = isHighlighted ? 3.5 : 2.5;
          ctx.setLineDash([6, 4]);
        } else if (e.relationship === 'CONFLICTS_WITH') {
          ctx.strokeStyle = isDimmed ? 'rgba(239, 68, 68, 0.15)' : '#EF4444';
          ctx.lineWidth = isHighlighted ? 4 : 3;
          ctx.setLineDash([4, 4]);
        } else {
          ctx.strokeStyle = isDimmed ? 'rgba(203, 213, 225, 0.15)' : 'rgba(148, 163, 184, 0.4)';
          ctx.lineWidth = isHighlighted ? 2 : 1.2;
          ctx.setLineDash([]);
        }

        ctx.stroke();

        // Edge label for synergies/conflicts
        if ((e.relationship === 'SYNERGY_WITH' || e.relationship === 'CONFLICTS_WITH') && (!hNode || isHighlighted)) {
          const midX = (s.x + t.x) / 2;
          const midY = (s.y + t.y) / 2;
          ctx.fillStyle = e.relationship === 'SYNERGY_WITH' ? '#10B981' : '#EF4444';
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(e.relationship === 'SYNERGY_WITH' ? 'HIỆP ĐỒNG' : 'XUNG ĐỘT', midX, midY - 6);
        }

        ctx.restore();
      }

      // Draw Nodes
      for (let n of sNodes) {
        const isSelected = hNode && hNode.id === n.id;
        const isNeighbor = hNode && connectedNodeIds.has(n.id);
        const isDimmed = hNode && !isSelected && !isNeighbor;

        ctx.save();
        ctx.globalAlpha = isDimmed ? 0.25 : 1.0;

        // Node Glow on hover
        if (isSelected || isNeighbor) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius + 6, 0, 2 * Math.PI);
          ctx.fillStyle = n.color || '#3B82F6';
          ctx.globalAlpha = 0.2;
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }

        // Main Node Circle
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, 2 * Math.PI);
        ctx.fillStyle = n.color || '#3B82F6';
        ctx.fill();

        ctx.lineWidth = isSelected ? 3 : 1.5;
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();

        // Label
        ctx.fillStyle = '#1E293B';
        ctx.font = isSelected ? 'bold 11px sans-serif' : '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        const label = n.label.length > 18 ? n.label.slice(0, 16) + '...' : n.label;
        ctx.fillText(label, n.x, n.y + n.radius + 4);

        // Type badge inside node
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 8px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const typeInitial = n.type === 'PRODUCT' ? 'SP' : n.type === 'INGREDIENT' ? 'INCI' : n.type === 'BRAND' ? 'BR' : 'DA';
        ctx.fillText(typeInitial, n.x, n.y);

        ctx.restore();
      }

      ctx.restore();

      animFrameIdRef.current = requestAnimationFrame(render);
    }

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isArActive]);

  // Coordinate Conversion Helper
  const getCanvasCoords = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    // Invert pan & zoom
    const { scale, x, y } = transformRef.current;
    return {
      x: (mouseX - x) / scale,
      y: (mouseY - y) / scale,
      rawX: mouseX,
      rawY: mouseY
    };
  }, []);

  // Pointer Handlers
  const handleMouseDown = (e) => {
    const { x, y, rawX, rawY } = getCanvasCoords(e);
    // Find node clicked
    const found = simNodesRef.current.find(n => {
      const dx = n.x - x;
      const dy = n.y - y;
      return Math.sqrt(dx * dx + dy * dy) <= n.radius + 4;
    });

    if (found) {
      draggingNodeRef.current = found;
      if (onNodeClick) onNodeClick(found);
    } else {
      isPanningRef.current = true;
      panStartRef.current = { x: rawX - transformRef.current.x, y: rawY - transformRef.current.y };
    }
  };

  const handleMouseMove = (e) => {
    const { x, y, rawX, rawY } = getCanvasCoords(e);

    if (draggingNodeRef.current) {
      draggingNodeRef.current.x = x;
      draggingNodeRef.current.y = y;
      draggingNodeRef.current.vx = 0;
      draggingNodeRef.current.vy = 0;
    } else if (isPanningRef.current) {
      setTransform(prev => ({
        ...prev,
        x: rawX - panStartRef.current.x,
        y: rawY - panStartRef.current.y
      }));
    } else {
      // Hover detection
      const found = simNodesRef.current.find(n => {
        const dx = n.x - x;
        const dy = n.y - y;
        return Math.sqrt(dx * dx + dy * dy) <= n.radius + 4;
      });
      setHoveredNode(found || null);
    }
  };

  const handleMouseUp = () => {
    draggingNodeRef.current = null;
    isPanningRef.current = false;
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setTransform(prev => {
      const newScale = Math.min(Math.max(prev.scale * zoomFactor, 0.4), 3.0);
      return { ...prev, scale: newScale };
    });
  };

  const zoomIn = () => setTransform(prev => ({ ...prev, scale: Math.min(prev.scale * 1.2, 3.0) }));
  const zoomOut = () => setTransform(prev => ({ ...prev, scale: Math.max(prev.scale * 0.8, 0.4) }));
  const resetView = () => setTransform({ scale: 1, x: 0, y: 0 });

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden bg-slate-50/70 rounded-xl border border-slate-200" style={{ height }}>
      {/* Zoom / Pan Floating Toolbar */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm">
        <button
          onClick={zoomIn}
          title="Phóng to"
          className="p-1 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={zoomOut}
          title="Thu nhỏ"
          className="p-1 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors"
        >
          <ZoomOut size={16} />
        </button>
        <button
          onClick={resetView}
          title="Đặt lại khung nhìn"
          className="p-1 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* GPU 60 FPS Indicator */}
      {isArActive && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-emerald-500/90 text-white text-xs px-3 py-1.5 rounded-full shadow-sm animate-pulse">
          <Sparkles size={14} />
          <span>Vật lý đồ thị tạm dừng (Bảo vệ 60 FPS cho AR Camera)</span>
        </div>
      )}

      {/* Main Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />
    </div>
  );
}
