import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },   // Ramp-up
    { duration: '1m', target: 200 },   // Sustained load
    { duration: '30s', target: 500 },   // Spike load
    { duration: '30s', target: 0 },     // Ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<150', 'p(99)<300'], // 95% dưới 150ms
    http_req_failed: ['rate<0.01'],                 // Tỷ lệ lỗi dưới 1%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';

export default function () {
  // 1. Browse Catalog with Facet Filters
  const catalogRes = http.get(`${BASE_URL}/api/products?page=0&size=12&skinType=OILY`);
  check(catalogRes, {
    'Catalog response status is 200': (r) => r.status === 200,
    'Catalog latency < 100ms': (r) => r.timings.duration < 100,
  });

  sleep(0.5);

  // 2. Tra cứu tồn kho SKU
  const stockRes = http.get(`${BASE_URL}/api/inventory/SKU-ANUA-77-50ML`);
  check(stockRes, {
    'Inventory check status is 200': (r) => r.status === 200,
  });

  sleep(0.5);

  // 3. Checkout Simulation (Split Order)
  const orderPayload = JSON.stringify({
    items: [
      {
        productId: 'prod-001',
        variantSku: 'SKU-ANUA-77-50ML',
        shopId: '00000000-0000-0000-0000-000000000010',
        productName: 'Anua Heartleaf 77% Soothing Toner',
        quantity: 1,
        unitPrice: 380000,
      },
    ],
    shippingAddress: {
      recipientName: 'Tester k6',
      phoneNumber: '0987654321',
      streetAddress: '123 Đường Cầu Giấy',
      city: 'Hà Nội',
    },
    paymentMethod: 'VNPAY_QR',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': '00000000-0000-0000-0000-000000000003',
    },
  };

  const orderRes = http.post(`${BASE_URL}/api/orders`, orderPayload, params);
  check(orderRes, {
    'Order created successfully (201 or 200)': (r) => r.status === 201 || r.status === 200,
  });

  sleep(1);
}
