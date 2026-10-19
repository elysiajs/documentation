import {
	IconSelector,
	IconCode,
	IconLeaf,
	IconBook,
	IconSearch,
	IconCheck,
	IconNews,
	IconPhoto
} from '@tabler/icons-react'
import type { Product } from '../lib/product'
import { Dropdown } from './ui/dropdown'
import { InputGroup } from './ui/input-group'
import { Button } from './ui/button'

const PRODUCTS: Record<
	Product,
	{ label: string; icon: typeof IconCode; href: string }
> = {
	elysia: {
		label: 'Elysia',
		icon: IconCode,
		href: '/at-glance/'
	},
	eden: {
		label: 'Eden',
		icon: IconLeaf,
		href: '/eden/'
	},
	reference: {
		label: 'Reference',
		icon: IconBook,
		href: '/reference/'
	}
}

export function ProductSwitcher({ product }: { product: Product }) {
	const { label, icon: Icon } = PRODUCTS[product]
	return (
		<Dropdown
			className="w-full"
			trigger={
				<Button
					variant="tertiary"
					className="w-full justify-between text-ink-muted px-2.5 min-h-10.25"
					aria-label="Switch product"
				>
					<Icon size={16} />
					<span className="flex-1 text-left translate-y-px">
						{label}
					</span>
					<IconSelector
						size={16}
						className="scale-125"
						stroke={1.5}
					/>
				</Button>
			}
			items={[
				...Object.entries(PRODUCTS).map(
					([key, { label, icon: Icon, href }]) => ({
						label: (
							<span
								className={`flex items-center justify-between gap-3 ${key === product ? 'text-primary-ink' : ''}`}
							>
								{label}
								{key === product && (
									<IconCheck
										size={16}
										stroke={1.75}
										aria-hidden
										className="shrink-0"
									/>
								)}
							</span>
						),
						icon: <Icon size={20} />,
						href,
						current: key === product
					})
				),
				{
					label: (
						<span className="flex items-center justify-between gap-3">
							Blog
						</span>
					),
					icon: <IconNews size={20} />,
					href: '/blog/'
				},
				{
					label: (
						<span className="flex items-center justify-between gap-3">
							Illustration
						</span>
					),
					icon: <IconPhoto size={20} />,
					href: '/illust/'
				}
			]}
		/>
	)
}

export function SearchField() {
	return (
		<InputGroup
			data-docs-search-input
			role="combobox"
			aria-autocomplete="list"
			aria-expanded="false"
			aria-describedby="docs-search-help"
			aria-controls="docs-search-results"
			type="search"
			name="q"
			aria-label="Search documentation"
			placeholder="Search documentation…"
			autoComplete="off"
			className="text-lg"
			prefix={<IconSearch size={24} stroke={1.75} />}
		/>
	)
}
