"use client";

/*
  Tiny error boundary that silently swallows R3F / WebGL failures so the
  hero text still paints on devices without WebGL (rare but real: blocked
  hardware acceleration, ancient iGPUs, locked-down enterprise browsers).

  React doesn't have a hook-based ErrorBoundary yet, so this is the one
  class component in the codebase.
*/

import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { failed: boolean };

export default class R3FBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (typeof window !== "undefined") {
      console.warn("[R3FBoundary] hero scene failed; degrading silently", error, info);
    }
  }

  render(): ReactNode {
    if (this.state.failed) return null;
    return this.props.children;
  }
}
