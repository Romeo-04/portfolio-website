"use client";

import { Component, type ReactNode } from "react";

// Catches a failed 3D chunk or WebGL context so the shell can fall back to
// the menu-as-page instead of breaking the whole route.
export default class SceneBoundary extends Component<
  { onError: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
