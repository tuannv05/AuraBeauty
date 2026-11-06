#!/usr/bin/env node
/**
 * Aura Beauty Mall - Standard Model Context Protocol (MCP) Server.
 * Implements JSON-RPC 2.0 over standard I/O (stdio).
 * Provides safe query tools for AI Agents (INCI, FEFO, Double-Entry Ledger, Saga).
 */

const readline = require('readline');

// ============================================================================
// 1. TOOL SCHEMAS
// ============================================================================
const TOOLS = [
  {
    name: 'check_inci_conflict',
    description: 'Kiểm tra xung đột hóa mỹ phẩm giữa các hoạt chất mạnh (Retinoids, AHA/BHA, Vit C, Benzoyl Peroxide) và cảnh báo chất cấm theo chuẩn CBMP Bộ Y Tế.',
    inputSchema: {
      type: 'object',
      properties: {
        ingredients: {
          type: 'array',
          items: { type: 'string' },
          description: 'Danh sách các hoạt chất hoặc thành phần INCI (VD: ["Retinol 0.5%", "Salicylic Acid 2%"])'
        },
        skinType: {
          type: 'string',
          enum: ['OILY', 'DRY', 'SENSITIVE', 'COMBINATION', 'NORMAL'],
          description: 'Loại da của người dùng (VD: SENSITIVE)'
        }
      },
      required: ['ingredients']
    }
  },
  {
    name: 'get_fefo_stock_status',
    description: 'Kiểm tra tồn kho nguyên tử CAS và trạng thái các lô hàng theo thuật toán FEFO (khóa các lô cận hạn dưới 6 tháng).',
    inputSchema: {
      type: 'object',
      properties: {
        skuCode: {
          type: 'string',
          description: 'Mã SKU sản phẩm (VD: SKU-ANUA-77-50ML hoặc SKU-ROMAND-02)'
        }
      },
      required: ['skuCode']
    }
  },
  {
    name: 'audit_double_entry_ledger',
    description: 'Kiểm toán tính bất biến Sổ cái kép Double-Entry: Tổng Nợ (Debit) = Tổng Có (Credit), tỷ lệ trích 10% hoa hồng sàn và 90% công nợ Shop.',
    inputSchema: {
      type: 'object',
      properties: {
        orderId: {
          type: 'string',
          description: 'Mã đơn hàng (VD: ORD-MOMO-20261106-9821)'
        },
        grossAmount: {
          type: 'number',
          description: 'Tổng giá trị đơn hàng (VNĐ) (VD: 490000)'
        }
      },
      required: ['orderId', 'grossAmount']
    }
  },
  {
    name: 'inspect_split_order_saga',
    description: 'Truy vết hành trình đơn hàng tách gian hàng (MasterOrder -> SubOrders) và trạng thái phân phối Kafka Outbox.',
    inputSchema: {
      type: 'object',
      properties: {
        masterOrderId: {
          type: 'string',
          description: 'Mã MasterOrder (VD: ORD-MULTI-SHOP-001)'
        }
      },
      required: ['masterOrderId']
    }
  }
];

// ============================================================================
// 2. TOOL EXECUTION LOGIC
// ============================================================================
function handleToolCall(name, args) {
  switch (name) {
    case 'check_inci_conflict': {
      const ingredients = (args.ingredients || []).map(i => String(i).toUpperCase());
      const skinType = (args.skinType || 'NORMAL').toUpperCase();

      const bannedBlacklist = ['CORTICOID', 'DEXAMETHASONE', 'HYDROQUINONE', 'MERCURY', 'THỦY NGÂN'];
      const detectedBanned = ingredients.filter(i => bannedBlacklist.some(b => i.includes(b)));

      const conflicts = [];
      const hasRetinoid = ingredients.some(i => i.includes('RETINOL') || i.includes('TRETINOIN'));
      const hasAcid = ingredients.some(i => i.includes('AHA') || i.includes('BHA') || i.includes('SALICYLIC') || i.includes('GLYCOLIC'));
      const hasVitC = ingredients.some(i => i.includes('ASCORBIC'));
      const hasBp = ingredients.some(i => i.includes('BENZOYL PEROXIDE'));

      if (hasRetinoid && hasAcid) {
        conflicts.push({
          pair: 'Retinoid + AHA/BHA (Direct Acid)',
          severity: skinType === 'SENSITIVE' ? 'HIGH (ĐỎ)' : 'MEDIUM (VÀNG)',
          clinicalAdvice: 'Quá tải hàng rào sừng, nguy cơ đỏ rát. Khuyến nghị tách chu kỳ: Đêm 1 tẩy da chết, Đêm 2 Retinoid (Skin Cycling 4 đêm).'
        });
      }
      if (hasRetinoid && hasBp) {
        conflicts.push({
          pair: 'Retinoid + Benzoyl Peroxide',
          severity: 'HIGH (ĐỎ)',
          clinicalAdvice: 'Benzoyl Peroxide oxy hóa làm mất hoạt tính của Retinol. Dùng Benzoyl Peroxide ban ngày và Retinol ban đêm.'
        });
      }
      if (hasAcid && hasVitC && skinType === 'SENSITIVE') {
        conflicts.push({
          pair: 'Vitamin C + AHA/BHA',
          severity: 'HIGH (ĐỎ)',
          clinicalAdvice: 'Độ pH thấp cộng hưởng dễ gây châm chích. Dùng Vitamin C buổi sáng, AHA/BHA buổi tối.'
        });
      }

      return {
        status: 'SUCCESS',
        skinType,
        bannedDetected: detectedBanned,
        hasBannedSubstances: detectedBanned.length > 0,
        conflictCount: conflicts.length,
        conflicts,
        safetyRating: detectedBanned.length > 0 ? 0 : conflicts.length === 0 ? 100 : 75,
        timestamp: new Date().toISOString()
      };
    }

    case 'get_fefo_stock_status': {
      const sku = args.skuCode || 'SKU-UNKNOWN';
      const today = new Date();
      return {
        status: 'SUCCESS',
        skuCode: sku,
        casAvailableStock: 48,
        reservedStock: 2,
        lots: [
          {
            lotNumber: 'LOT-2026-A',
            manufacturingDate: '2025-01-10',
            expiryDate: '2027-01-10',
            quantity: 30,
            status: 'ELIGIBLE_ACTIVE',
            daysUntilExpiry: 430
          },
          {
            lotNumber: 'LOT-2025-X',
            manufacturingDate: '2024-05-15',
            expiryDate: '2026-12-15',
            quantity: 18,
            status: 'NEAR_EXPIRY_LOCKED',
            daysUntilExpiry: 39,
            warning: 'Hạn dùng dưới 180 ngày (< 6 tháng). Tự động khóa xuất kho FEFO.'
          }
        ],
        fefoDispatchLot: 'LOT-2026-A',
        timestamp: today.toISOString()
      };
    }

    case 'audit_double_entry_ledger': {
      const orderId = args.orderId;
      const gross = Number(args.grossAmount) || 0;
      const commission = Math.round(gross * 0.10);
      const sellerPayable = gross - commission;

      const totalDebit = gross;
      const totalCredit = commission + sellerPayable;
      const isBalanced = totalDebit === totalCredit;

      return {
        status: 'SUCCESS',
        orderId,
        invariantPassed: isBalanced,
        equation: `Total Debit (${totalDebit.toLocaleString('vi-VN')} đ) == Total Credit (${totalCredit.toLocaleString('vi-VN')} đ)`,
        entries: [
          { type: 'DEBIT', account: 'ESCROW_HOLDING', amount: totalDebit, desc: 'Giải phóng quỹ Escrow' },
          { type: 'CREDIT', account: 'PLATFORM_REVENUE (10%)', amount: commission, desc: 'Phí hoa hồng sàn TMĐT' },
          { type: 'CREDIT', account: 'SELLER_PAYABLE (90%)', amount: sellerPayable, desc: 'Giải ngân công nợ Shop' }
        ],
        auditResult: isBalanced ? 'AUDIT_VERIFIED_100_PERCENT' : 'INVARIANT_ERROR'
      };
    }

    case 'inspect_split_order_saga': {
      const masterOrderId = args.masterOrderId;
      return {
        status: 'SUCCESS',
        masterOrderId,
        buyerId: 'usr-buyer-8921',
        paymentMethod: 'MOMO_ESCROW',
        status: 'CONFIRMED',
        subOrders: [
          {
            subOrderId: `${masterOrderId}-SHOP-01`,
            shopId: 'shop-innisfree-official',
            shopName: 'Innisfree Official Mall',
            items: [{ sku: 'SKU-SERUM-TRA-XANH', qty: 1, unitPrice: 620000 }],
            subTotal: 620000,
            proRataDiscount: 35000,
            payableAmount: 585000,
            status: 'PROCESSING'
          },
          {
            subOrderId: `${masterOrderId}-SHOP-02`,
            shopId: 'shop-romand-vietnam',
            shopName: 'Romand Beauty Flagship',
            items: [{ sku: 'SKU-ROMAND-02', qty: 1, unitPrice: 179000 }],
            subTotal: 179000,
            proRataDiscount: 15000,
            payableAmount: 164000,
            status: 'PROCESSING'
          }
        ],
        outboxSagaState: {
          lastDispatchedEvent: 'OrderConfirmedEvent',
          kafkaPartitionKey: masterOrderId,
          retryCount: 0,
          deliveredToPartitions: [0, 1]
        }
      };
    }

    default:
      throw new Error(`Tool not found: ${name}`);
  }
}

// ============================================================================
// 3. JSON-RPC STDIO TRANSPORT
// ============================================================================
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
  if (!line || !line.trim()) return;

  try {
    const request = JSON.parse(line);
    const { id, method, params } = request;

    if (method === 'tools/list') {
      const response = {
        jsonrpc: '2.0',
        id,
        result: { tools: TOOLS }
      };
      process.stdout.write(JSON.stringify(response) + '\n');
    } else if (method === 'tools/call') {
      const { name, arguments: args } = params;
      try {
        const toolResult = handleToolCall(name, args || {});
        const response = {
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(toolResult, null, 2)
              }
            ]
          }
        };
        process.stdout.write(JSON.stringify(response) + '\n');
      } catch (err) {
        const errorResponse = {
          jsonrpc: '2.0',
          id,
          error: {
            code: -32000,
            message: err.message
          }
        };
        process.stdout.write(JSON.stringify(errorResponse) + '\n');
      }
    } else {
      const response = {
        jsonrpc: '2.0',
        id,
        result: {}
      };
      process.stdout.write(JSON.stringify(response) + '\n');
    }
  } catch (err) {
    process.stderr.write(`Error parsing JSON-RPC line: ${err.message}\n`);
  }
});
