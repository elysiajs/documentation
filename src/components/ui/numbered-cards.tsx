import { useId, type CSSProperties, type ReactNode } from 'react'
import { Card, CardTitle } from './card'
import './numbered-cards.css'

export interface NumberedCardsProps {
	items: { title: string; children: ReactNode }[]
	/** @default '8rem' */
	minHeight?: CSSProperties['minHeight']
}

export function NumberedCards({
	items,
	minHeight = '8rem'
}: NumberedCardsProps) {
	const id = useId()
	if (items.length < 1 || items.length > 4)
		throw new RangeError('NumberedCards requires between 1 and 4 items.')

	return (
		<div
			className="spica-numbered-cards"
			style={{ '--card-count': items.length } as CSSProperties}
		>
			<ol role="list">
				{items.map(({ title, children }, index) => (
					<li key={index}>
						<Card
							className="spica-numbered-card"
							style={{ minHeight }}
						>
							<svg
								className="spica-numbered-card-number"
								viewBox="-48 -108 92 113"
								aria-hidden="true"
								focusable="false"
							>
								<defs>
									<linearGradient
										id={`${id}-${index}`}
										x1="0"
										y1="0"
										x2="1"
										y2="1"
									>
										<stop stopColor="var(--card-bloom)" />
										<stop
											offset="1"
											stopColor="var(--card-light)"
										/>
									</linearGradient>
								</defs>
								<text
									x="0"
									y="0"
									textAnchor="middle"
									fill="none"
									stroke={`url(#${id}-${index})`}
									strokeWidth="1.5"
								>
									{index + 1}
								</text>
							</svg>
							<CardTitle>{title}</CardTitle>
							<div className="spica-numbered-card-body">
								{children}
							</div>
						</Card>
					</li>
				))}
			</ol>
		</div>
	)
}
