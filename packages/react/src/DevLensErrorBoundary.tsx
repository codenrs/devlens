import React from 'react';
import { errorStore } from '@nrshagor/devlens-core';

export type DevLensErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export class DevLensErrorBoundary extends React.Component<
  DevLensErrorBoundaryProps,
  { hasError: boolean }
> {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    errorStore.addError({
      source: 'react',
      error,
      componentStack: errorInfo.componentStack ?? undefined,
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }

    return this.props.children;
  }
}
