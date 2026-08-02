import { Component, type ReactNode } from "react";

/* ============================================================================
   Global ErrorBoundary — graceful degradation for the whole app.
   Prevents a single thrown render error from blanking the platform.
   ============================================================================ */
type Props = { children: ReactNode; fallback?: ReactNode };
type State = { hasError: boolean; error?: Error };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    // In production this reports to the observability backend.
    if (typeof console !== "undefined") console.error("[TournamentOS] render error:", error);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <div
        role="alert"
        className="grid min-h-screen place-items-center bg-void-950 px-6 text-center text-hi"
      >
        <div className="max-w-md">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-rose-300">System exception</p>
          <h1 className="mt-4 font-display text-3xl font-bold">Something went off-bracket.</h1>
          <p className="mt-3 text-sm leading-relaxed text-mid">
            An unexpected error interrupted this view. Your session is safe — reload the module to continue.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={this.handleReset}
              className="mo-press rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-void-950"
            >
              Retry
            </button>
            <a
              href="/"
              className="mo-press rounded-full border border-white/12 px-5 py-2.5 text-sm text-hi transition-colors hover:border-cyan-400/40 hover:text-cyan-300"
            >
              Back to home
            </a>
          </div>
        </div>
      </div>
    );
  }
}
