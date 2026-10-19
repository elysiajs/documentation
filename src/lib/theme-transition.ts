type ThemeTransition = { transition: ViewTransition | null }

let active: ThemeTransition | undefined
let lastSwitch = 0

export function animateThemeChange(theme: 'light' | 'dark', apply: () => void) {
	const root = document.documentElement
	const previous = active
	active = undefined
	previous?.transition?.skipTransition()
	delete root.dataset.themeTransition

	if (
		root.dataset.theme === theme ||
		typeof document.startViewTransition !== 'function' ||
		window.matchMedia('(prefers-reduced-motion: reduce)').matches
	) {
		apply()
		return
	}

	const now = Date.now()
	try {
		const saved = localStorage.getItem('theme-switch')
		if (saved !== null && Number.isFinite(Number(saved))) lastSwitch = Number(saved)
		localStorage.setItem('theme-switch', String(now))
	} catch {
		// Remember repeat switches in this page when storage is blocked.
	}
	root.dataset.themeTransition = now - lastSwitch < 3 * 60 * 1000 ? 'fast' : 'normal'
	lastSwitch = now

	const current: ThemeTransition = { transition: null }
	active = current
	const cleanup = () => {
		if (active !== current) return
		active = undefined
		delete root.dataset.themeTransition
	}

	try {
		current.transition = document.startViewTransition(() => {
			if (active === current) apply()
		})
		const transition = current.transition
		void transition.ready.catch(() => transition.skipTransition())
		void transition.finished.then(cleanup, cleanup)
	} catch {
		cleanup()
		apply()
	}
}
