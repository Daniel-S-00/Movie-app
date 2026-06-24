import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-primary p-8 text-center">
          <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
            Something went wrong
          </h1>
          <p className="mb-6 max-w-md text-light-200">
            {this.state.error?.message ?? "An unexpected error occurred."}
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="rounded-lg bg-light-100/10 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-light-100/20 focus:outline-none focus:ring-2 focus:ring-light-100/40"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
