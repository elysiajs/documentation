// Scale and position spring from the trigger; opacity fades without overshooting
export const menuPanel =
	'spica-surface relative max-w-(--available-width) overflow-visible rounded-2xl border border-border-strong bg-glass light:bg-surface/75 p-1.5 shadow-lg [backdrop-filter:var(--glass-blur-small)] [transform-origin:var(--transform-origin)] transition-[opacity,scale,translate] duration-[240ms] [transition-timing-function:var(--ease-out),var(--ease-spring),var(--ease-spring)] data-[starting-style]:scale-[.96] data-[starting-style]:-translate-y-1 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 data-[ending-style]:duration-100 data-[ending-style]:ease-out data-[instant]:transition-none motion-reduce:transition-none';

export const menuGlint =
	'pointer-events-none absolute -top-px left-[18%] h-[1.5px] w-[38%] rounded-[1px] [background:linear-gradient(90deg,transparent,var(--color-bloom)_30%,var(--color-harmony-center)_70%,transparent)]';

// Bleed into the frame padding, retaining 6px inside the scroll box for dashed focus outlines
export const menuScroll =
	'menu-scroll relative -m-1.5 max-h-[min(260px,calc(var(--available-height)_-_14px))] overflow-y-auto overscroll-contain p-1.5';

export const menuRow =
	'relative [--ripple-color:var(--color-primary)] flex w-full cursor-pointer items-center gap-[9px] rounded-lg bg-transparent px-1.5 py-2 text-left font-sans text-sm font-medium text-ink outline-none select-none touch-manipulation focus-ring';
