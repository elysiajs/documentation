export interface Box {
	left: number
	top: number
	width: number
	height: number
}

let surface: HTMLElement | undefined

// a logarithmic curve, 1 - e^(-t/τ): fastest on the first frame, slowing every frame after
function decay(tau: number) {
	const ms = Math.round(tau * 1000 * Math.log(1000))
	const stops = Array.from({ length: 49 }, (_, index) =>
		index === 48 ? 1 : +(1 - Math.exp(-((index / 48) * ms) / (tau * 1000))).toFixed(4)
	)

	return {
		easing: `linear(${stops.join(', ')})`,
		ms,
		// within 4%, long before the tail ends
		near: Math.round(tau * 1000 * Math.log(25))
	}
}

// Apple-style spring sampled into a CSS linear() easing
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

/**
 * One glass surface travelling between the bar and the docked panel. Opening, X settles on a quicker
 * curve than Y, so the path arcs from bottom center toward bottom right and up the right edge; closing
 * mirrors it. Only the width bounces, it's pinned by the right edge so it can't pass the viewport.
 * `landed` resolves with the surface, or undefined when a newer morph took over mid-flight (that one
 * starts from wherever this one was). `retarget` moves the destination while it flies, for a bar
 * that reflows with the content.
 */
export function morph(from: Box, to: Box, opening: boolean) {
	const start = surface?.isConnected ? surface.getBoundingClientRect() : from
	for (const animation of surface?.getAnimations() ?? []) animation.cancel()
	surface?.remove()

	const element = (surface = document.createElement('div'))
	element.setAttribute('aria-hidden', 'true')
	element.className =
		'spica-surface pointer-events-none fixed z-44 box-border rounded-3xl border border-solid border-border-strong bg-glass light:bg-surface/85 shadow-lg [backdrop-filter:var(--glass-blur-small)]'
	document.querySelector('.docs-page')!.append(element)

	// pinned by the right and bottom edges, which only ever move toward the viewport's, never past
	const px = (value: number) => `${value}px`
	const right = (box: Box) => px(innerWidth - box.left - box.width)
	const bottom = (box: Box) => px(innerHeight - box.top - box.height)
	const frames = (end: Box) => [
		{ right: [right(start), right(end)] },
		{
			bottom: [bottom(start), bottom(end)],
			height: [px(start.height), px(end.height)]
		},
		{ width: [px(start.width), px(end.width)] }
	]
	// time constants in seconds, the quicker axis bends the path into an arc
	const quick = decay(0.075)
	const slow = decay(0.112)
	const gel = spring(0.46, 0.3)
	const [horizontal, vertical] = opening ? [quick, slow] : [slow, quick]
	const timing = [horizontal, vertical, gel]
	const animations = frames(to).map((keyframes, index) =>
		element.animate(keyframes, {
			duration: timing[index].ms,
			easing: timing[index].easing,
			fill: 'forwards'
		})
	)
	const slower = horizontal.near > vertical.near ? horizontal : vertical

	return {
		landed: new Promise<HTMLElement | undefined>((resolve) =>
			setTimeout(
				() => resolve(surface === element ? element : undefined),
				slower.near
			)
		),
		retarget(end: Box) {
			frames(end).forEach((keyframes, index) =>
				(animations[index].effect as KeyframeEffect).setKeyframes(keyframes)
			)
		}
	}
}

// where the panel docks (panel.tsx: lg:inset-2 lg:left-auto lg:w-96), for a first open still loading it
export function docked(): Box {
	const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
	const { clientWidth, clientHeight } = document.documentElement
	const inset = rem / 2
	const width = 24 * rem

	return {
		left: clientWidth - inset - width,
		top: inset,
		width,
		height: clientHeight - inset * 2
	}
}

// a flight with nowhere to land fades out where it is
export function drop() {
	if (!surface) return
	for (const animation of surface.getAnimations()) animation.pause()
	release(surface)
}

const released = new WeakSet<HTMLElement>()

// the real surface fades in above it, then it goes. Once: a second fade would flash it back to opaque
export function release(element: HTMLElement) {
	if (released.has(element)) return
	released.add(element)

	element
		.animate(
			{ opacity: [1, 0] },
			{ duration: 220, easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)' }
		)
		.finished.finally(() => {
			element.remove()
			if (surface === element) surface = undefined
		})
}

// the docked panel's own box, ignoring its entry transform
export const boxOf = (element: HTMLElement): Box => ({
	left: element.offsetLeft,
	top: element.offsetTop,
	width: element.offsetWidth,
	height: element.offsetHeight
})
