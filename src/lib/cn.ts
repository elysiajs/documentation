import { createCn } from 'cn/config'

export const cn = createCn({
	extend: {
		theme: {
			ease: ['spring', 'bounce']
		},
		classGroups: {
			'font-size': [{ text: ['eyebrow', 'h2', 'display'] }],
			shadow: [{ shadow: ['primary', 'attention', 'glow', 'glow-soft'] }],
			animate: [
				{
					animate: [
						'spica-spin',
						'spica-march',
						'spica-wave',
						'spica-bob',
						'spica-indet',
						'spica-bloom',
						'spica-pop',
						'spica-float',
						'spica-twinkle',
						'spica-wiggle',
						'spica-glow-in',
						'spica-menu-in'
					]
				}
			]
		}
	}
})
