import React from 'react';
import { RefreshCw, Home, AlertCircle } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('IDITZ PERFUME UI Boundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-luxury-cream flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white border border-luxury-gold/50 shadow-2xl p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-4 bg-luxury-gold/10 border border-luxury-gold/40 flex items-center justify-center rounded-full text-luxury-goldDark">
              <AlertCircle className="w-7 h-7" />
            </div>

            <div className="text-[11px] font-semibold tracking-luxury uppercase text-luxury-goldDark mb-1">
              IDITZ PERFUME
            </div>

            <h1 className="text-xl font-serif font-bold text-luxury-black mb-3">
              Application Notice
            </h1>

            <p className="text-xs text-luxury-charcoal/80 mb-6 leading-relaxed">
              We encountered a minor display interruption while rendering this view. Your saved bag and session remain completely safe.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="luxury-btn-primary text-xs flex items-center justify-center gap-2 py-3"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh View
              </button>

              <button
                onClick={this.handleGoHome}
                className="luxury-btn-secondary text-xs flex items-center justify-center gap-2 py-3"
              >
                <Home className="w-3.5 h-3.5" />
                Return Home
              </button>
            </div>

            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <details className="mt-6 text-left border-t border-luxury-lightBorder pt-4">
                <summary className="text-[10px] text-luxury-charcoal cursor-pointer uppercase tracking-wider font-semibold">
                  Technical Diagnostics
                </summary>
                <pre className="mt-2 text-[10px] bg-luxury-ivory p-3 overflow-x-auto text-rose-800 font-mono">
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
