import {
	createElement,
	useId,
	type ButtonHTMLAttributes,
	type CSSProperties
} from 'react'
import { Select as BaseSelect } from '@base-ui/react/select'
import { IconCheck, IconChevronDown } from '@tabler/icons-react'
import { cn } from '../../lib/cn'
import { selectControl, selectGhost, type SelectOption } from './select'
import { menuPanel, menuGlint, menuScroll, menuRow } from './menu-styles'
import { MenuIndicator } from './menu-indicator'

export interface SelectMenuOption extends SelectOption {
	swatch?: string
	disabled?: boolean
}

export interface SelectMenuProps
	extends Omit<
		ButtonHTMLAttributes<HTMLButtonElement>,
		'onChange' | 'value' | 'defaultValue' | 'children'
	> {
	label?: string
	hint?: string
	options?: Array<string | SelectMenuOption>
	value?: string | null
	defaultValue?: string
	onChange?: (value: string | null) => void
	placeholder?: string
	variant?: 'default' | 'ghost'
	required?: boolean
	style?: CSSProperties
}

export function SelectMenu({
	label,
	hint,
	options = [],
	value,
	defaultValue,
	onChange,
	placeholder = 'Select…',
	variant = 'default',
	disabled,
	name,
	required,
	form,
	id,
	style,
	className,
	...rest
}: SelectMenuProps) {
	const generatedId = useId()
	const triggerId = id ?? generatedId
	const items = options.map((option) =>
		typeof option === 'string' ? { value: option, label: option } : option
	)

	const content = (option: SelectMenuOption, item = false) => (
		<>
			{option.swatch ? (
				<span
					aria-hidden
					className="size-3 shrink-0 rounded-full"
					style={{ background: option.swatch }}
				/>
			) : null}
			{item ? (
				<BaseSelect.ItemText className="min-w-0 truncate">
					{option.label}
				</BaseSelect.ItemText>
			) : (
				<span className="min-w-0 truncate">{option.label}</span>
			)}
		</>
	)

	return (
		<div className="spica-surface relative font-sans" style={style}>
			{label ? (
				<label
					htmlFor={triggerId}
					className="mb-1.5 block text-sm text-ink-soft"
				>
					{label}
				</label>
			) : null}
			<BaseSelect.Root
				items={items}
				value={value}
				defaultValue={defaultValue}
				onValueChange={onChange}
				disabled={disabled}
				name={name}
				required={required}
				form={form}
				modal={false}
			>
				<BaseSelect.Trigger
					{...rest}
					id={triggerId}
					aria-describedby={
						[rest['aria-describedby'], hint && `${triggerId}-hint`]
							.filter(Boolean)
							.join(' ') || undefined
					}
					className={cn(
						selectControl,
						'relative [--ripple-color:var(--color-primary)] flex items-center gap-[9px] pr-3 text-left data-[popup-open]:border-primary-line',
						variant === 'ghost' && selectGhost,
						className
					)}
				>
					{createElement(
						'spica-ripple',
						{ 'aria-hidden': 'true' },
						createElement('span')
					)}
					<BaseSelect.Value className="flex min-w-0 flex-1 items-center gap-[9px] data-[placeholder]:text-ink-muted">
						{(current: string | null) => {
							const selected = items.find(
								(item) => item.value === current
							)
							return selected ? content(selected) : placeholder
						}}
					</BaseSelect.Value>
					<BaseSelect.Icon className="flex shrink-0 text-ink-muted transition-transform duration-150 data-[popup-open]:rotate-180 motion-reduce:transition-none">
						<IconChevronDown size={15} aria-hidden />
					</BaseSelect.Icon>
				</BaseSelect.Trigger>
				<BaseSelect.Portal>
					<BaseSelect.Positioner
						align="start"
						sideOffset={6}
						alignItemWithTrigger={false}
						className="z-50"
					>
						<BaseSelect.Popup
							className={cn(
								menuPanel,
								'min-w-(--anchor-width) focus-ring'
							)}
						>
							<span aria-hidden className={menuGlint} />
							<BaseSelect.List className={menuScroll}>
								<MenuIndicator />
								{items.map((option) => (
									<BaseSelect.Item
										key={option.value}
										value={option.value}
										disabled={option.disabled}
										className={cn(
											menuRow,
											'data-[selected]:font-bold data-[selected]:text-primary-deep data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50'
										)}
									>
										{createElement(
											'spica-ripple',
											{ 'aria-hidden': 'true' },
											createElement('span')
										)}
										{content(option, true)}
										<BaseSelect.ItemIndicator className="ml-auto flex text-primary">
											<IconCheck size={15} aria-hidden />
										</BaseSelect.ItemIndicator>
									</BaseSelect.Item>
								))}
							</BaseSelect.List>
						</BaseSelect.Popup>
					</BaseSelect.Positioner>
				</BaseSelect.Portal>
			</BaseSelect.Root>
			{hint ? (
				<span
					id={`${triggerId}-hint`}
					className="mt-1.5 block font-mono text-[11px] text-ink-muted"
				>
					{hint}
				</span>
			) : null}
		</div>
	)
}
