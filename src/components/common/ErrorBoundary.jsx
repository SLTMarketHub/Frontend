import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // In production, report to monitoring service (e.g., Sentry)
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="max-w-lg w-full bg-white shadow-card rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Something went wrong</h2>
            <p className="text-gray-600 mt-2">An unexpected error occurred. Please try again.</p>
            {process.env.NODE_ENV !== 'production' && (
              <pre className="text-left mt-4 p-3 bg-gray-100 rounded text-xs overflow-auto">
                {String(this.state.error)}
              </pre>
            )}
            <div className="mt-6 flex items-center justify-center gap-3">
              <a
                href="/admin/dashboard"
                className="px-4 py-2 bg-slt-primary text-white rounded hover:bg-slt-primary/90"
              >
                Go to Dashboard
              </a>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
