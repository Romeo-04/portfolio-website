"use client";

// ============================================================
// SHEET GALLERY
// ============================================================
// Screenshots of a project inside its pop-up: one large shot with its
// caption, and thumbnails beneath to switch between them. The large shot
// opens full size in a new tab. The sheet re-mounts per project, so the
// gallery starts on the first shot each time.
// ============================================================

import Image from "next/image";
import { useState } from "react";
import type { Screenshot } from "@/data/portfolio";

export default function SheetGallery({ shots, title }: { shots: Screenshot[]; title: string }) {
  const [index, setIndex] = useState(0);
  const shot = shots[Math.min(index, shots.length - 1)];
  if (!shot) return null;

  return (
    <figure className="sheet-gallery">
      <a href={shot.src} target="_blank" rel="noopener noreferrer" className="sheet-shot" aria-label={`Open full size: ${shot.alt}`}>
        <Image
          key={shot.src}
          src={shot.src}
          alt={shot.alt}
          width={shot.width}
          height={shot.height}
          sizes="(min-width: 768px) 560px, 92vw"
        />
      </a>
      <figcaption>{shot.alt}</figcaption>
      {shots.length > 1 && (
        <div className="sheet-thumbs" role="group" aria-label={`${title} screenshots`}>
          {shots.map((s, k) => (
            <button
              key={s.src}
              type="button"
              className="sheet-thumb"
              aria-label={`Screenshot ${k + 1} of ${shots.length}: ${s.alt}`}
              aria-pressed={k === index}
              onClick={() => setIndex(k)}
            >
              <Image src={s.src} alt="" width={s.width} height={s.height} sizes="96px" />
            </button>
          ))}
        </div>
      )}
    </figure>
  );
}
