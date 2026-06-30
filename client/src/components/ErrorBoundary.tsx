import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary]", error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      const isDev = import.meta.env.DEV;

      return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-background">
          <div className="flex flex-col items-center w-full max-w-2xl p-8 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 ring-2 ring-destructive/20">
              <AlertTriangle size={32} className="text-destructive" />
            </div>

            <h2 className="text-2xl font-bold mb-2 text-foreground">
              Something went wrong
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              An unexpected error occurred. Please try reloading the page. If the problem persists, contact support.
            </p>

            {isDev && this.state.error && (
              <div className="p-4 w-full rounded-lg bg-muted overflow-auto mb-6 text-start">
                <p className="text-xs font-semibold text-destructive mb-2">
                  {this.state.error.name}: {this.state.error.message}
                </p>
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                  {this.state.error.stack}
                </pre>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => window.location.href = "/"}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg",
                  "border border-border text-muted-foreground",
                  "hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
                )}
              >
                <Home size={16} />
                Go Home
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg",
                  "bg-primary text-primary-foreground",
                  "hover:opacity-90 cursor-pointer transition-opacity"
                )}
              >
                <RotateCcw size={16} />
                Reload Page
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
