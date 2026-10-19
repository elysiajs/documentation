import { createRoot } from 'react-dom/client'
import { Tabs } from '../components/ui/tabs'

export function mountProductTabs(
	container: HTMLElement,
	products: { id: string; label: string }[],
	initial: string,
	onChange: (value: string) => void
): () => void {
	const order = ['elysia', 'eden', 'reference']
	const tabs = [...products]
		.sort(
			(a, b) =>
				(order.indexOf(a.id) + 1 || Infinity) -
				(order.indexOf(b.id) + 1 || Infinity)
		)
		.map(({ id, label }) => ({ value: id, label }))

	tabs.unshift({ value: '', label: 'All' })
	const root = createRoot(container)

	root.render(
		<Tabs
			aria-label="Product"
			variant="ghost"
			size="sm"
			tabs={tabs}
			defaultValue={initial}
			onChange={onChange}
		/>
	)

	return () => root.unmount()
}
