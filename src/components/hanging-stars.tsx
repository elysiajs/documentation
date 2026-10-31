import { useId } from 'react'
import { cn } from '../lib/cn'

export const sparkle =
	'M0 -1C0 -.35 .35 0 1 0C.35 0 0 .35 0 1C0 .35 -.35 0 -1 0C-.35 0 0 -.35 0 -1Z'

type Ornament = 'spica' | 'sparkle' | 'ring'

interface Composition {
	width: number
	height: number
	className: string
	// one solid compass arc, and a dotted one just outside it; too flat to read across a wide page
	arc?: {
		cx: number
		cy: number
		r: number
		dots: {
			strokeDasharray: string
			pathLength?: number
			strokeDashoffset?: number
		}
	}
	// x and length of each hanging thread; Spica is the one pink star
	threads: { x: number; length: number; ornament: Ornament; size: number }[]
	bokeh: [x: number, y: number, r: number][]
}

const compositions: Record<'panel' | 'page', Composition> = {
	panel: {
		width: 384,
		height: 160,
		className:
			'h-[160px] [mask-image:linear-gradient(#000_50%,transparent_85%)]',
		arc: {
			cx: 190,
			cy: -380,
			r: 470,
			dots: {
				strokeDasharray: '1 6',
				pathLength: 100,
				strokeDashoffset: -30
			}
		},
		threads: [
			{ x: 22, length: 78, ornament: 'ring', size: 5.5 },
			{ x: 160, length: 84, ornament: 'spica', size: 7.5 },
			{ x: 196, length: 38, ornament: 'sparkle', size: 4 },
			{ x: 248, length: 56, ornament: 'sparkle', size: 4.5 },
			{ x: 290, length: 42, ornament: 'ring', size: 4.5 }
		],
		bokeh: [
			[48, 112, 1.5],
			[96, 58, 1],
			[124, 126, 2.5],
			[222, 92, 1],
			[270, 118, 2],
			[318, 84, 1.5],
			[350, 122, 1],
			[372, 52, 2]
		]
	},
	// The content column (672 wide) is centred at x 564; y is from the top of the page at xl.
	// Inside the column everything stays above the breadcrumb (y 40); only the gutters hang longer.
	page: {
		width: 1128,
		height: 160,
		className:
			'h-40 opacity-70 [mask-image:linear-gradient(#000_55%,transparent_92%)]',
		threads: [
			{ x: 118, length: 70, ornament: 'ring', size: 4 },
			{ x: 200, length: 110, ornament: 'sparkle', size: 4.5 },
			{ x: 412, length: 14, ornament: 'sparkle', size: 3.5 },
			{ x: 464, length: 26, ornament: 'ring', size: 4 },
			{ x: 528, length: 22, ornament: 'spica', size: 6.5 },
			{ x: 642, length: 30, ornament: 'ring', size: 3.5 },
			{ x: 716, length: 20, ornament: 'sparkle', size: 4.5 },
			{ x: 846, length: 28, ornament: 'sparkle', size: 3.5 },
			{ x: 928, length: 84, ornament: 'sparkle', size: 4 },
			{ x: 1010, length: 120, ornament: 'ring', size: 4.5 }
		],
		bokeh: [
			[96, 48, 1.5],
			[160, 112, 2],
			[246, 16, 1],
			[372, 30, 1.5],
			[496, 8, 2.5],
			[680, 34, 1],
			[766, 12, 1.5],
			[884, 30, 2],
			[958, 130, 1.5],
			[1046, 60, 1]
		]
	}
}

// the star chart hung from the top edge: dotted threads ending in stars, soft bokeh, a faint compass arc in the panel
export function HangingStars({
	composition = 'panel'
}: {
	composition?: keyof typeof compositions
}) {
	const glow = useId()
	const { width, height, className, arc, threads, bokeh } =
		compositions[composition]

	return (
		<svg
			aria-hidden
			viewBox={`0 0 ${width} ${height}`}
			preserveAspectRatio="xMidYMin slice"
			className={cn(
				'pointer-events-none absolute inset-x-0 top-0 -z-1 w-full text-harmony-center-deep',
				className
			)}
		>
			<defs>
				<radialGradient id={glow}>
					<stop
						offset="0"
						style={{
							stopColor: 'var(--color-primary)',
							stopOpacity: 0.35
						}}
					/>
					<stop
						offset="1"
						style={{
							stopColor: 'var(--color-primary)',
							stopOpacity: 0
						}}
					/>
				</radialGradient>
			</defs>
			{arc && (
				<>
					<circle
						cx={arc.cx}
						cy={arc.cy}
						r={arc.r}
						fill="none"
						stroke="currentColor"
						strokeOpacity=".16"
					/>
					<circle
						cx={arc.cx}
						cy={arc.cy}
						r={arc.r + 8}
						{...arc.dots}
						fill="none"
						stroke="currentColor"
						strokeOpacity=".2"
						strokeLinecap="round"
					/>
				</>
			)}
			<g fill="currentColor">
				{bokeh.map(([x, y, r], index) => (
					<circle
						key={index}
						cx={x}
						cy={y}
						r={r}
						opacity={r > 1.5 ? 0.14 : 0.24}
					/>
				))}
			</g>
			{threads.map(({ x, length, ornament, size }, index) => (
				<g
					key={x}
					className={cn(
						'hanging-string',
						ornament === 'ring' && 'text-harmony-right-deep'
					)}
					style={{
						transformOrigin: `${x}px 0px`,
						animationDuration: `${7 + (index % 3)}s`,
						animationDelay: `${-index * 1.7}s`
					}}
				>
					<line
						x1={x}
						y1="0"
						x2={x}
						y2={length - size - 3}
						stroke="currentColor"
						strokeOpacity=".4"
						strokeWidth="1.2"
						strokeLinecap="round"
						strokeDasharray="0 4.5"
					/>
					<g transform={`translate(${x} ${length}) scale(${size})`}>
						{ornament === 'spica' ? (
							<>
								<circle r="2.4" fill={`url(#${glow})`} />
								<circle
									r="1.9"
									fill="none"
									stroke="currentColor"
									strokeOpacity=".3"
									strokeWidth={0.8 / size}
									strokeDasharray={`${1.5 / size} ${3 / size}`}
									strokeLinecap="round"
								/>
								<path
									d={sparkle}
									className="hanging-twinkle origin-center text-primary [transform-box:fill-box]"
									fill="currentColor"
									style={{ animationDelay: '-.6s' }}
								/>
							</>
						) : ornament === 'ring' ? (
							<circle
								r=".8"
								fill="none"
								stroke="currentColor"
								strokeOpacity=".5"
								strokeWidth={1.2 / size}
							/>
						) : (
							<path
								d={sparkle}
								fill="currentColor"
								fillOpacity=".55"
								className="hanging-twinkle origin-center [transform-box:fill-box]"
								style={{ animationDelay: `${-index * 0.7}s` }}
							/>
						)}
					</g>
				</g>
			))}
		</svg>
	)
}
