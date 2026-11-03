import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 100 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1500'], // First byte / stream response dưới 1.5s
    http_req_failed: ['rate<0.02'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';

export default function () {
  const url = `${BASE_URL}/api/v1/ai/chat/stream?prompt=Da%20dau%20mun%20dung%20serum%20nao&skinType=OILY`;
  const params = {
    headers: {
      'Accept': 'text/event-stream',
    },
    timeout: '10s',
  };

  const res = http.get(url, params);
  check(res, {
    'SSE stream status is 200': (r) => r.status === 200,
    'SSE content type valid': (r) => r.headers['Content-Type'] && r.headers['Content-Type'].includes('text/event-stream'),
    'First byte response < 1.5s': (r) => r.timings.waiting < 1500,
  });

  sleep(2);
}
