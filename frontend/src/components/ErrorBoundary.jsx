import React from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary captured error:', error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    if (
      this.state.hasError &&
      (prevProps.activeView !== this.props.activeView ||
        prevProps.resetKey !== this.props.resetKey)
    ) {
      this.setState({ hasError: false, error: null });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleNavigateHome = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onNavigateHome) {
      this.props.onNavigateHome();
    } else {
      window.location.href = '/';
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '420px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '48px 24px',
            background: 'var(--canvas)',
            borderRadius: 'var(--radius-lg, 20px)',
            border: '1px solid var(--hairline)',
            margin: '32px auto',
            maxWidth: '680px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(244, 63, 94, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f43f5e',
              marginBottom: '18px'
            }}
          >
            <AlertCircle size={32} />
          </div>

          <h3
            style={{
              fontSize: '20px',
              fontWeight: 750,
              color: 'var(--ink)',
              marginBottom: '8px'
            }}
          >
            Giao diện đang được làm mới
          </h3>

          <p
            style={{
              fontSize: '13.5px',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              maxWidth: '480px',
              marginBottom: '24px'
            }}
          >
            Hệ thống đã tự động ngăn ngừa màn hình trắng và ghi nhận yêu cầu. Bạn có thể tải lại danh mục hoặc quay về trang chủ để tiếp tục mua sắm mượt mà.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={this.handleReset}
              className="btn-pill-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                fontSize: '13px',
                fontWeight: 650,
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={15} /> Tải lại danh mục
            </button>

            <button
              onClick={this.handleNavigateHome}
              className="btn-pill-soft"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Home size={15} /> Về Trang Chủ
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
