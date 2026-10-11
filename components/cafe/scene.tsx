"use client";

export default function CafeScene({ cut }: { cut: boolean }) {
  return <div aria-hidden data-cut={cut} className="fixed inset-0 -z-10" />;
}
