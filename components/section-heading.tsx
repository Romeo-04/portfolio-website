interface SectionHeadingProps {
  /** Two-digit index from the section registry, e.g. "01". */
  num: string;
  title: string;
  /** Optional mono note pinned to the far right of the rule. */
  aside?: string;
}

/**
 * The redesign's section header: mono index, display title, a hairline rule
 * running to the right margin, and an optional trailing note.
 */
export default function SectionHeading({
  num,
  title,
  aside,
}: SectionHeadingProps) {
  return (
    <div
      data-reveal-child
      className="mb-10 flex flex-wrap items-baseline gap-x-4 gap-y-2 sm:mb-11"
    >
      <span className="text-beam font-mono text-sm font-bold">{num}</span>
      <h2 className="text-[28px] leading-tight font-bold tracking-[-0.02em] sm:text-[38px] lg:text-[44px]">
        {title}
      </h2>
      <div className="hairline hidden h-px min-w-8 flex-1 sm:block" />
      {aside && (
        <span className="text-ink-muted font-mono text-[11px] tracking-[0.08em]">
          {aside}
        </span>
      )}
    </div>
  );
}
