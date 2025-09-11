import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: Math.random().toString(36).substr(2, 9).toUpperCase()
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error);
      console.error('Error Info:', errorInfo);
    }

  }

  handleReportError = () => {
    const { error, errorInfo, errorId } = this.state;
    const subject = encodeURIComponent(`Application Error Report - ${errorId}`);
    const body = encodeURIComponent(`
Hi Support Team,

The application encountered an unexpected error.

Error ID: ${errorId}
Time: ${new Date().toLocaleString()}
URL: ${window.location.href}
Browser: ${navigator.userAgent}

Error Details:
${error?.toString()}

Stack Trace:
${errorInfo?.componentStack}

Please investigate this issue.

Thank you!
    `);

    window.open(`mailto:support@company.com?subject=${subject}&body=${body}`);
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-100 via-white to-pink-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg w-full text-center">
            <div className="mb-8">
              <div className="text-6xl mb-4">💥</div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Something went wrong
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                The application encountered an unexpected error. Don't worry, we've been notified and are working on a fix.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-left">
                <h3 className="text-sm font-medium text-red-800 mb-2">
                  Development Error Details:
                </h3>
                <pre className="text-xs text-red-700 whitespace-pre-wrap overflow-auto max-h-32">
                  {this.state.error.toString()}
                </pre>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
                >
                  <span className="mr-2">🔄</span>
                  Reload Page
                </button>

                <Link
                  to="/"
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
                >
                  <span className="mr-2">🏠</span>
                  Go Home
                </Link>
              </div>

              <button
                onClick={this.handleReportError}
                className="text-sm text-indigo-600 hover:text-indigo-500 underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded"
              >
                Report this error
              </button>
            </div>

            <div className="mt-12 text-sm text-gray-500">
              <p>Error ID: {this.state.errorId}</p>
              <p className="mt-1">Time: {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;