import { useEffect, useRef, useState } from 'react'
import { IconSun, IconMoon, IconDeviceDesktop } from '@tabler/icons-react'
import { Tabs } from './ui/tabs'
import { animateThemeChange } from '../lib/theme-transition'

export function ThemeTabs() {
	const root = useRef<HTMLDivElement>(null)
	const select = useRef<HTMLSelectElement | null>(null)
	const [value, setValue] = useState('auto')
	const [ready, setReady] = useState(false)

	useEffect(() => {
		let cancelled = false
		const picker = root.current
			?.closest('[data-theme-control]')
			?.querySelector('starlight-theme-select')

		const sync = () => setValue(select.current!.value)

		customElements.whenDefined('starlight-theme-select').then(() => {
			if (cancelled || !(picker instanceof HTMLElement)) return

			select.current = picker.querySelector('select')
			if (!select.current) return

			sync()

			select.current.addEventListener('change', sync)
			picker.hidden = true
			setReady(true)
		})

		return () => {
			cancelled = true
			select.current?.removeEventListener('change', sync)
			if (picker instanceof HTMLElement) picker.hidden = false
		}
	}, [])

	return (
		<div ref={root} hidden={!ready}>
			<Tabs
				aria-label="Color theme"
				className="[html[data-theme=dark]_&]:[--color-surface-raised:var(--color-border-strong)]"
				iconOnly
				tone="white"
				size="sm"
				value={value}
				onChange={(next) => {
					const picker = select.current
					if (!picker) return
					const theme = next === 'auto'
						? window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
						: next === 'light' ? 'light' : 'dark'
					animateThemeChange(theme, () => {
						picker.value = next
						picker.dispatchEvent(new Event('change', { bubbles: true }))
					})
				}}
				tabs={[
					{
						value: 'light',
						label: 'Light',
						icon: <IconSun size={18} stroke={1.5} />
					},
					{
						value: 'dark',
						label: 'Dark',
						icon: <IconMoon size={18} stroke={1.5} />
					},
					{
						value: 'auto',
						label: 'System',
						icon: <IconDeviceDesktop size={18} stroke={1.5} />
					}
				]}
			/>
		</div>
	)
}
