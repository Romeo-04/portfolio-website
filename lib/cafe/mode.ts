// Which version of the café a visitor gets (spec decisions Q2, section 5).
// resolveMode is pure; the two detectors only run in the browser.

export type CafeMode = "cafe" | "menu" | "closed";

export function resolveMode(env: {
  webgl: boolean;
  phone: boolean;
  entered: boolean;
}): CafeMode {
  if (!env.webgl) return "closed";
  if (env.phone && !env.entered) return "menu";
  return "cafe";
}

export function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function isPhoneViewport(): boolean {
  return window.matchMedia("(max-width: 767px)").matches;
}
