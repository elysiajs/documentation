# 001 — Make the bar → panel morph settle like Liquid Glass

- **Status**: DONE
- **Commit**: b1d3ce6 (plus uncommitted assistant work; the morph lives only in the working tree)
- **Severity**: HIGH
- **Category**: Easing & duration · Interruptibility
- **Estimated scope**: 2 files (`src/components/assistant/morph.ts`, `src/styles/global.css`), ~80 lines

## Problem

The Ask Elysia bottom bar morphs into the docked assistant panel (and back) through one glass overlay animated with WAAPI in `src/components/assistant/morph.ts`. The user wants the motion to feel like Apple's Liquid Glass: a **logarithmic** curve, meaning every part of the motion launches fast and decelerates smoothly into place (exponential settle), with a soft, gel-like shape change. Today it does the opposite on the vertical axis.

```ts
// src/components/assistant/morph.ts:8-11 — current
const duration = 420
const lead = 'cubic-bezier(0.16, 1, 0.3, 1)'
const follow = 'cubic-bezier(0.7, 0, 0.84, 0)'
const size = 'cubic-bezier(0.65, 0, 0.35, 1)'
```

```ts
// src/components/assistant/morph.ts:36-53 — current (abridged)
const frames = (end: Box) => [
	{ right: [right(start), right(end)] },
	{
		bottom: [bottom(start), bottom(end)],
		height: [px(start.height), px(end.height)]
	},
	{ width: [px(start.width), px(end.width)] }
]
const animations = frames(to).map((keyframes, index) =>
	element.animate(keyframes, {
		duration,
		easing: [opening ? lead : follow, opening ? follow : lead, size][index],
		fill: 'forwards'
	})
)
```

What's wrong, concretely:

1. **`follow` is an ease-in** (`cubic-bezier(0.7, 0, 0.84, 0)`). The vertical move and the height growth start dead slow and *accelerate*, so the surface lands on the panel at peak velocity. That reads as a hard L-turn and a slammed stop, not a settle. Ease-in on UI motion is always wrong.
2. **Fixed 420ms cubic-béziers can't express the long, soft tail** of a spring settle, and they can't carry velocity.
3. **The panel waits for the whole flight.** `landed` resolves only after all three animations finish, so the real panel appears after the slowest axis ends, which will get worse with spring tails.
4. **The shape doesn't feel liquid.** Width uses a symmetric ease-in-out and the radius is a fixed `rounded-3xl` on the overlay, so a 48px-tall pill (radius 24px) is fine at start, but there is no gel-like give.

```css
/* src/styles/global.css:414-417 — current */
.docs-page[data-morph] .docs-assistant {
	opacity: 0;
	transition: none;
}
```

The real panel stays at `opacity: 0` until `data-morph` is removed (when the overlay lands), then the overlay fades out over 280ms (`release`, `morph.ts:68-75`).

## Target

### Motion model: per-axis critically damped springs (logarithmic settle)

Replace the three cubic-béziers with springs rendered as CSS `linear()` easings (WAAPI supports `linear()` in Chrome 113+, Safari 17.2+, Firefox 112+; no dependency needed). A critically damped spring (bounce 0) approaches its target exponentially. That is the "logarithmic" curve: fast launch, long gentle tail, no overshoot.

The curved path comes from giving the two position axes **different spring durations**. The fast axis arrives first, the slow axis keeps easing in, so the path is a smooth arc rather than an L. Both axes decelerate, so nothing lands at speed.

| Animated property | Opening (bar → panel) | Closing (panel → bar) |
| --- | --- | --- |
| `right` (horizontal position) | spring duration **0.34s**, bounce **0** | spring duration **0.52s**, bounce **0** |
| `bottom` + `height` (vertical) | spring duration **0.52s**, bounce **0** | spring duration **0.34s**, bounce **0** |
| `width` (shape) | spring duration **0.46s**, bounce **0.3** | spring duration **0.46s**, bounce **0.3** |
| `border-radius` | `24px` → `24px` (no change needed, see note) | same |

- **Opening** therefore sweeps right quickly, then rises into the panel while still decelerating: bottom center → bottom right → top right, as a continuous arc.
- **Closing** mirrors it: it drops first, then glides left into the bar.
- Width gets the only bounce (0.3, which overshoots about 3.5% of the width change, roughly 10px when 672px becomes 384px) because overshooting it is safe: the overlay is pinned by its right edge, so extra width extends left into the content, never past the viewport. `right`, `bottom` and `height` must **not** bounce. An overshoot there would push the surface past the viewport edge or above the top.
- Note on radius: the bar pill is 48px tall with a full radius (24px), and the overlay class already uses `rounded-3xl` (24px), the docked panel's radius. Keep `rounded-3xl`; no radius animation is needed.

### Spring → `linear()` helper (add to `morph.ts`)

Apple's parametrization: perceptual `duration` (seconds) and `bounce` (0 = critically damped). Mass 1:

```ts
// Apple-style spring sampled into a CSS linear() easing: a fast launch that settles exponentially
function spring(duration: number, bounce = 0) {
	const stiffness = ((2 * Math.PI) / duration) ** 2
	const damping = (4 * Math.PI * (1 - bounce)) / duration
	const step = 1 / 120
	const samples = [0]
	let position = 0
	let velocity = 0

	while (samples.length < 600) {
		velocity += (stiffness * (1 - position) - damping * velocity) * step
		position += velocity * step
		samples.push(position)
		if (Math.abs(1 - position) < 0.001 && Math.abs(velocity) < 0.01) break
	}
	samples[samples.length - 1] = 1

	const every = Math.ceil(samples.length / 48)
	const stops = samples.filter(
		(_, index) => index % every === 0 || index === samples.length - 1
	)
	const settle = samples.findIndex((value) => Math.abs(1 - value) < 0.04)

	return {
		easing: `linear(${stops.map((value) => +value.toFixed(4)).join(', ')})`,
		ms: Math.round((samples.length - 1) * step * 1000),
		// when it's visually there (within 4%), long before the tail ends
		near: Math.round(settle * step * 1000)
	}
}
```

Expected outputs (sanity check while implementing): `spring(0.34)` → ms ≈ 592, near ≈ 283; `spring(0.52)` → ms ≈ 833, near ≈ 433; `spring(0.46, 0.3)` → ms ≈ 692 with ≈3.5% overshoot (values from a reference run of this exact helper). If you get wildly different numbers, the integration is wrong; stop and report.

### Hand-off timing (fixes "panel waits for the tail")

- `landed` must resolve at the **slow position axis's `near` time** (when it's within 4% of target), not when every animation finishes. Use a `setTimeout` for that time. Resolve `undefined` if a newer morph replaced this one before then (same rule as today: `surface === element`).
- The three animations keep running to completion underneath. `release` (overlay fade-out) starts at `near`, while the overlay is still settling the last few pixels, so the real panel and the overlay overlap only while the overlay fades.
- `release` fade: change `duration: 280, easing: 'ease-out'` to `duration: 220, easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)'` (the repo's `--ease-out` value).

### Real panel reveal (the liquid "clear" moment)

When `data-morph` is removed, the panel content comes in from a slight blur instead of only appearing:

```css
/* src/styles/global.css — target, replacing lines 414-417 */
.docs-page[data-morph] .docs-assistant {
	opacity: 0;
	filter: blur(6px);
	transition: none;
}

.docs-page:not([data-morph]) .docs-assistant[open] {
	transition:
		opacity 220ms var(--ease-out),
		filter 260ms var(--ease-out);
}

@media (prefers-reduced-motion: reduce) {
	.docs-page .docs-assistant {
		filter: none;
	}
}
```

Before editing, check that `.docs-assistant` doesn't already set a `transition` this rule would override (it has Tailwind `transition-[opacity,translate,display,overlay]` classes in `src/components/assistant/panel.tsx` ~line 270). If those classes set transitions on `[open]`, add `filter 260ms var(--ease-out)` to *that* transition list instead of adding the second rule, and keep its existing durations. **Do not** create two competing transition declarations.

### Interrupts (keep today's behavior, add velocity)

`morph()` already starts a new flight from the overlay's current rect when interrupted (`morph.ts:24-27`). Keep that. Velocity carry-over is **out of scope** for this plan: a critically damped spring started from rest at the current rect is acceptable, and it no longer slams because nothing accelerates into the target.

## Repo conventions to follow

- Easing tokens live in `src/styles/spica.css:98-100`: `--ease-out: cubic-bezier(0.22, 0.61, 0.36, 1)`, `--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)`. The morph helper is TS-side (WAAPI), so it uses literal values. Mirror `--ease-out`'s value exactly where the plan says so.
- Style: tabs, no semicolons, single quotes, short lowercase comments only where they explain *why* (see the existing comments in `morph.ts`).
- Exemplar of WAAPI in this file: `release()` at `src/components/assistant/morph.ts:68-75`.

## Steps

1. **`src/components/assistant/morph.ts`**: delete lines 8-11 (`duration`, `lead`, `follow`, `size`). Add the `spring()` helper from *Target* above the `morph` function.
2. **`morph.ts`, inside `morph()`**: build the per-axis springs from the table:
   ```ts
   const quick = spring(0.34)
   const slow = spring(0.52)
   const gel = spring(0.46, 0.3)
   const [horizontal, vertical] = opening ? [quick, slow] : [slow, quick]
   ```
   Replace the `element.animate(...)` options so each keyframe group uses its own spring:
   ```ts
   const timing = [horizontal, vertical, gel]
   const animations = frames(to).map((keyframes, index) =>
   	element.animate(keyframes, {
   		duration: timing[index].ms,
   		easing: timing[index].easing,
   		fill: 'forwards'
   	})
   )
   ```
   Keep `frames()` exactly as is (right / bottom+height / width).
3. **`morph.ts`, `landed`**: replace `Promise.all(animations.map((animation) => animation.finished))…` with a promise that resolves after the slow axis's `near` ms:
   ```ts
   const slower = horizontal.near > vertical.near ? horizontal : vertical
   landed: new Promise<HTMLElement | undefined>((resolve) =>
   	setTimeout(
   		() => resolve(surface === element ? element : undefined),
   		slower.near
   	)
   ),
   ```
   `retarget()` stays as is. It updates keyframes, and the spring easing and duration are unchanged.
4. **`morph.ts`, `release()`**: change the fade to `{ duration: 220, easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)' }`. Make sure the overlay is still removed in `finally` as today. Also cancel/finish its running position animations before `remove()`; removal does that implicitly, so no code is needed, just don't break it.
5. **`src/styles/global.css:414-417`**: apply the *Real panel reveal* CSS, following the caveat about existing `.docs-assistant` transitions in `panel.tsx`.
6. Do **not** change `bar.tsx`. It calls `morph(from, to, opening)`, `.landed` and `.retarget()`, and those signatures stay the same.

## Boundaries

- Do NOT touch `src/components/assistant/bar.tsx`, `panel.tsx` (except adding `filter` to an existing transition list if step 5's caveat applies), `store.ts`, or any other file.
- Do NOT add dependencies (no Motion / Framer Motion). `linear()` + WAAPI only.
- Do NOT change when a morph runs (desktop docked only, bar visible, not reduced motion). That gating lives in `bar.tsx` and is correct.
- Do NOT add bounce to `right`, `bottom` or `height`. Only `width` bounces.
- If the code at the cited lines doesn't match the excerpts (drift), STOP and report instead of improvising.

## Verification

- **Mechanical**: `bun test src/components/assistant` passes. `bunx tsc --noEmit -p . 2>&1 | grep components/assistant` prints nothing. `bun run build` completes (do not run `astro check` at the same time). In a browser console, `CSS.supports('animation-timing-function', 'linear(0, 1)')` is `true`.
- **Feel check** (desktop ≥1024px, panel docks; bar visible at top of a docs page):
  - Open with Enter in the bar. In Chrome DevTools → Animations panel at **10%** playback, confirm:
    - the surface leaves fast and *every* axis slows toward the end, with no acceleration into the panel;
    - the path is a continuous arc (right first, then rising), not an L with a corner;
    - width swells a touch past the panel width and eases back once (gel), while the top and right edges never pass the panel's final edges or the viewport.
  - At 100%: the panel content is readable about 0.43s after Enter (the slow axis's `near`). It shouldn't feel like it waits for a tail.
  - Close (Escape or the X): it drops first, then glides left into the bar, mirrored and just as soft.
  - Open then immediately close, five times quickly: no snapping, no double surfaces, no surface stuck on screen.
  - Rendering panel → `prefers-reduced-motion: reduce`: no travel at all, a plain fade (existing behavior); the panel content has no blur.
  - Light and dark: the overlay glass matches the panel glass; no flash as the overlay fades.
- **Done when**: there is no `cubic-bezier(0.7, 0, 0.84, 0)` (ease-in) anywhere in `src/components/assistant/`; the opening path is a decelerating arc in slow motion; the panel content is interactive at the `near` time, not after the full settle.

## Amendment after execution (2026-10-31)

The executor reported that springs started from rest accelerate for the first ~55–85ms before decelerating, so the motion wasn't logarithmic from the first frame. Fix applied in `src/components/assistant/morph.ts`: the two position axes use `decay(τ)`, an exact logarithmic curve `1 - e^(-t/τ)` sampled into `linear()` (peak speed at t=0, slowing every frame after, no overshoot), with τ = 75ms horizontal and 112ms vertical (swapped when closing), tuned with the user between 54/83ms (too fast) and 100/145ms (too slow). Width keeps `spring(0.46, 0.3)`. Timings: quick ms ≈ 518 / near ≈ 241; slow ms ≈ 774 / near ≈ 361. A first attempt launched the springs at their natural frequency (τ ≈ 54/83ms); that covered ~2/3 of the distance in 3–5 frames and read as a jump, so the morph looked dropped.