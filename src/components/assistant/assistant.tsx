import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Bar } from './bar'
import { mount, takeOpener, useAssistant, wide } from './store'

const loadPanel = () => import('./panel')
const Panel = lazy(loadPanel)

const usable = (element: HTMLElement | null) =>
	element &&
	element !== document.body &&
	element.isConnected &&
	element.getClientRects().length &&
	!element.closest('[inert]')

export default function Assistant() {
	const { open } = useAssistant()
	const [loaded, setLoaded] = useState(open)
	const wasOpen = useRef(open)

	useEffect(() => {
		const unmount = mount()
		// the ⌘K ask row waits for this, so nothing is chosen before anyone listens
		const shell = document.querySelector('.docs-page')!
		shell.setAttribute('data-assistant-ready', '')
		shell.setAttribute('data-ask-bar', '')

		return () => {
			shell.removeAttribute('data-assistant-ready')
			shell.removeAttribute('data-ask-bar')
			unmount()
		}
	}, [])

	useEffect(() => {
		const shell = document.querySelector('.docs-page')!
		const media = wide()
		const dock = () =>
			shell.toggleAttribute(
				'data-assistant-docked',
				open && media.matches
			)

		dock()
		media.addEventListener('change', dock)
		return () => media.removeEventListener('change', dock)
	}, [open])

	useEffect(() => {
		if (open) setLoaded(true)
		else if (wasOpen.current) {
			const opener = takeOpener()
			// the ⌘K row and shortcuts leave no visible opener, Search is the nearest entry
			if (opener)
				(usable(opener)
					? opener
					: [
							...document.querySelectorAll<HTMLElement>(
								'[data-docs-search]'
							)
						].find(usable)
				)?.focus()
		}

		wasOpen.current = open
	}, [open])

	return (
		<>
			<Bar onIntent={loadPanel} />
			{loaded && (
				<Suspense fallback={null}>
					<Panel />
				</Suspense>
			)}
		</>
	)
}
