// ============================================================
// PACKED LINES
// ============================================================
// Lists set in the scene (a skill tier on the chalkboard, a drink's recipe
// on its card) are short names joined by a dot. They are packed into lines
// here rather than left to the text wrapper, so a line never starts or ends
// with a stray dot and never splits a name that fits on a line of its own.
// ============================================================

export const LIST_SEPARATOR = " · ";

/** Packs names into lines of at most `maxChars`, joined by the separator. */
export function packLines(names: readonly string[], maxChars: number): string[] {
  const lines: string[] = [];
  for (const name of names) {
    const last = lines[lines.length - 1];
    if (last !== undefined && last.length + LIST_SEPARATOR.length + name.length <= maxChars) {
      lines[lines.length - 1] = `${last}${LIST_SEPARATOR}${name}`;
    } else {
      lines.push(name);
    }
  }
  return lines;
}
