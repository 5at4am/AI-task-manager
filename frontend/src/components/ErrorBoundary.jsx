import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-violet-50 dark:bg-void-900 px-4">
          <div className="max-w-md w-full bg-white dark:bg-void-800 rounded-2xl border border-violet-200 dark:border-violet-600/20 p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#FFEEF0] dark:bg-[#993556]/20 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-[#993556] dark:text-[#ED93B1]" />
            </div>
            <h1 className="text-xl font-bold text-text-heading dark:text-mist-100 mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-text-secondary dark:text-mist-500 mb-6">
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-violet-600 hover:bg-violet-700 text-white transition-colors duration-150 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Go Home
            </button>
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-xs font-semibold text-text-muted dark:text-mist-500 cursor-pointer">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 p-3 bg-violet-50 dark:bg-void-700 rounded-lg text-xs text-[#993556] dark:text-[#ED93B1] overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
