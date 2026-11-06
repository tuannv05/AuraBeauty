const { spawn } = require('child_process');
const path = require('path');

const serverPath = path.join(__dirname, 'index.js');
const mcp = spawn('node', [serverPath]);

let buffer = '';

mcp.stdout.on('data', (data) => {
  buffer += data.toString();
  const lines = buffer.split('\n');
  buffer = lines.pop(); // giữ lại phần chưa hoàn tất

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const msg = JSON.parse(line);
      console.log(`[MCP RESPONSE id=${msg.id}]:`);
      if (msg.result?.tools) {
        console.log(`  Tools count: ${msg.result.tools.length}`);
        msg.result.tools.forEach(t => console.log(`   - Tool: ${t.name}`));
      } else if (msg.result?.content) {
        console.log(`  Output: ${msg.result.content[0].text.substring(0, 150)}...`);
      }
    } catch (e) {
      console.error('Parse error:', e, line);
    }
  }
});

mcp.stderr.on('data', (d) => console.error('STDERR:', d.toString()));

function send(req) {
  mcp.stdin.write(JSON.stringify(req) + '\n');
}

// 1. tools/list
send({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} });

// 2. tools/call: check_inci_conflict
send({
  jsonrpc: '2.0',
  id: 2,
  method: 'tools/call',
  params: {
    name: 'check_inci_conflict',
    arguments: {
      ingredients: ['Retinol 0.5%', 'Salicylic Acid 2%', 'Corticoid'],
      skinType: 'SENSITIVE'
    }
  }
});

// 3. tools/call: get_fefo_stock_status
send({
  jsonrpc: '2.0',
  id: 3,
  method: 'tools/call',
  params: {
    name: 'get_fefo_stock_status',
    arguments: { skuCode: 'SKU-ANUA-77-50ML' }
  }
});

// 4. tools/call: audit_double_entry_ledger
send({
  jsonrpc: '2.0',
  id: 4,
  method: 'tools/call',
  params: {
    name: 'audit_double_entry_ledger',
    arguments: { orderId: 'ORD-TEST-001', grossAmount: 1000000 }
  }
});

// 5. tools/call: inspect_split_order_saga
send({
  jsonrpc: '2.0',
  id: 5,
  method: 'tools/call',
  params: {
    name: 'inspect_split_order_saga',
    arguments: { masterOrderId: 'ORD-SPLIT-888' }
  }
});

setTimeout(() => {
  mcp.kill();
  console.log('--- TEST MCP SERVER HOÀN TẤT 100% ---');
  process.exit(0);
}, 2500);
