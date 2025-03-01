import React, { Component, ErrorInfo, ReactNode } from 'react';

// Define the props type to include 'children'
interface ErrorBoundaryProps {
  children: ReactNode;  // 'children' can be anything renderable: string, number, JSX, etc.
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render shows the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can log the error to an error reporting service
    console.error("Error caught by Error Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render a fallback UI in case of an error
      return <h1>Something went wrong.</h1>;
    }

    // Render the children components
    return this.props.children;
  }
}

export default ErrorBoundary;
