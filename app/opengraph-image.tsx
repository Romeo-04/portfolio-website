import { ImageResponse } from "next/og";
import { personalInfo, siteConfig } from "@/data/portfolio";

// Generated share card, so there's no static PNG to keep in sync.
export const alt = `${siteConfig.name} — ${siteConfig.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#1b120c",
          color: "#f5e9da",
        }}
      >
        <div style={{ fontSize: 28, color: "#d9a066", letterSpacing: 4 }}>
          {new URL(siteConfig.url).host.toUpperCase()}
        </div>
        <div style={{ fontSize: 84, fontWeight: 700, marginTop: 24 }}>
          {personalInfo.name}
        </div>
        <div style={{ fontSize: 40, marginTop: 12, color: "#e8cfb4" }}>
          {personalInfo.role}
        </div>
        <div style={{ fontSize: 28, marginTop: 40, color: "#b8a28c", maxWidth: 900 }}>
          {personalInfo.tagline}
        </div>
      </div>
    ),
    size,
  );
}
