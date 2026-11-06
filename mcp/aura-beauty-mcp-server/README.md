# Aura Beauty Mall MCP Server

Standard Model Context Protocol (MCP) server providing clinical and operational tools for AI Agents.

## Available Tools
1. `check_inci_conflict`: Dermatological active conflict & banned substance scanner.
2. `get_fefo_stock_status`: CAS inventory & FEFO lot expiration guard (< 6 months).
3. `audit_double_entry_ledger`: Double-entry invariant audit (10% commission, 90% payout).
4. `inspect_split_order_saga`: Multi-vendor order split journey & Outbox state.

## Run
```bash
node index.js
```
