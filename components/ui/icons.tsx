// ============================================================
// ICONS
// ============================================================
// One small line-icon set for the whole site, so buttons and links use
// drawn icons instead of text arrows. 24px grid, 2px round strokes,
// currentColor, and decorative (aria-hidden): the text beside each icon
// carries the meaning.
// ============================================================

import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 16, children, className, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      className={`inline-block shrink-0 align-[-0.15em] ${className ?? ""}`}
      {...rest}
    >
      {children}
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Icon>
  );
}

export function ArrowLeft(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </Icon>
  );
}

/** Opens in a new tab. */
export function External(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </Icon>
  );
}

export function Close(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Icon>
  );
}

export function Mail(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6.5l8.5 6.5 8.5-6.5" />
    </Icon>
  );
}

export function Code(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" />
    </Icon>
  );
}

export function Document(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </Icon>
  );
}

/** A coffee cup with steam: loyalty stamps and the closed sign. */
export function Cup(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 10h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" />
      <path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H17M8 3.5c-.6.8.6 1.7 0 2.5M12 3.5c-.6.8.6 1.7 0 2.5" />
    </Icon>
  );
}

export function ChevronDown(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 9l6 6 6-6" />
    </Icon>
  );
}

export function Quote(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" stroke="none">
      <path d="M4 18v-5.5C4 8.4 6.2 5.8 10 5l.8 1.9C8.6 7.7 7.6 9.2 7.5 11H10v7zm9.5 0v-5.5c0-4.1 2.2-6.7 6-7.5l.8 1.9c-2.2.8-3.2 2.3-3.3 4.1h2.5v7z" />
    </Icon>
  );
}

export function User(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c.8-4 4-6 8-6s7.2 2 8 6" />
    </Icon>
  );
}
