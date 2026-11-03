import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';

export default function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-item ${toast.type || 'info'}`}>
          {toast.type === 'success' && <CheckCircle2 size={18} style={{ color: '#34d399', flexShrink: 0 }} />}
          {toast.type === 'warning' && <AlertTriangle size={18} style={{ color: '#fbbf24', flexShrink: 0 }} />}
          {toast.type === 'error' && <AlertCircle size={18} style={{ color: '#f87171', flexShrink: 0 }} />}
          <div style={{ flex: 1, fontSize: '13px' }}>
            {toast.message}
            {toast.action && (
              <button
                onClick={toast.action.onClick}
                style={{
                  marginLeft: '10px',
                  color: '#60a5fa',
                  textDecoration: 'underline',
                  fontWeight: 600,
                  fontSize: '12px'
                }}
              >
                {toast.action.label}
              </button>
            )}
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            style={{ color: '#9ca3af', padding: '2px', display: 'flex' }}
            title="Đóng"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}
