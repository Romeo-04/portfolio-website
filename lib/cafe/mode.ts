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
    const ctx = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!ctx) return false;
    // Release the probe's GL context so browsers do not count it toward their limit.
    ctx.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function isPhoneViewport(): boolean {
  return window.matchMedia("(max-width: 767px)").matches;
}
