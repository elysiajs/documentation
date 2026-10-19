export type GalleryPage = {
	title: string
	lang: string
	src: string
}

export type GalleryItem = {
	description: string
	cover: string
	illust: string
	page: [GalleryPage, ...GalleryPage[]]
}

export const preview = [
	{
		description: 'Greenfield',
		cover: '/illust/ely/greenfield/greenfield_day.webp',
		illust: '寂しくない',
		page: [
			{
				title: 'Greenfield',
				lang: 'Day',
				src: '/illust/ely/greenfield/greenfield_day.webp'
			}
		]
	},
	{
		description: 'Elysia chan 3rd revision',
		cover: '/illust/ely/rev3/elysia 2 stand small.webp',
		illust: 'SaltyAom',
		page: [
			{
				title: 'Elysia chan 3rd revision',
				lang: 'Rev 3',
				src: '/illust/ely/rev3/elysia 2 stand small.webp'
			}
		]
	},
	{
		description: 'Elysia 2 RC cover image inspired by 「またおいで」',
		cover: '/illust/ely/またおいで/またおいで base.webp',
		illust: 'SaltyAom',
		page: [
			{
				title: 'またおいで',
				lang: 'Base',
				src: '/illust/ely/またおいで/またおいで base.webp'
			},
			{
				title: 'またおいで',
				lang: 'RC',
				src: '/illust/ely/またおいで/またおいで.webp'
			}
		]
	},
	{
		description: 'Elysia chan welcome gesture',
		cover: '/illust/ely/welcome-gesture/elysia-chan-welcome-gesture.webp',
		illust: 'SaltyAom',
		page: [
			{
				title: 'Welcome gesture, full CG',
				lang: 'Full CG',
				src: '/illust/ely/welcome-gesture/elysia-chan-welcome-gesture.webp'
			},
			{
				title: 'Welcome gesture, plain',
				lang: 'Plain',
				src: '/illust/ely/welcome-gesture/elysia-chan-welcome-gesture-plain.webp'
			},
			{
				title: 'Welcome Gesture Default',
				lang: 'Card',
				src: '/illust/ely/welcome-gesture-card/welcome-gesture-card.webp'
			},
			{
				title: 'Welcome Gesture Default Plain',
				lang: 'Card plain',
				src: '/illust/ely/welcome-gesture-card/welcome-gesture-card-plain.webp'
			},
			{
				title: 'Welcome Gesture Default',
				lang: 'Card 3/4',
				src: '/illust/ely/welcome-gesture-card/welcome-gesture-card-3-4.webp'
			},
			{
				title: 'Welcome Gesture Default Plain',
				lang: 'Card plain 3/4',
				src: '/illust/ely/welcome-gesture-card/welcome-gesture-card-3-4-plain.webp'
			},
			{
				title: 'Welcome Gesture Dual',
				lang: 'Card dual 3/4',
				src: '/illust/ely/welcome-gesture-card/welcome-gesture-card-3-4-dual.webp'
			},
			{
				title: 'Elysia dual',
				lang: 'Dual',
				src: '/illust/ely/card-dual/elysia-card-dual.webp'
			}
		]
	},
	{
		description: 'Elysia chan 2nd revision',
		cover: '/illust/ely/rev2/elysia-chan-rev-2.webp',
		illust: 'SaltyAom',
		page: [
			{
				title: 'Elysia chan 2nd revision',
				lang: 'Rev 2',
				src: '/illust/ely/rev2/elysia-chan-rev-2.webp'
			},
			{
				title: 'Card for Elysia chan 2nd revision',
				lang: 'Card',
				src: '/illust/ely/rev2/elysia-chan-card.webp'
			},
			{
				title: '2nd revision, 3/4',
				lang: 'Card 3/4',
				src: '/illust/ely/rev2-card/elysia-rev-2-card-3-4.webp'
			},
			{
				title: '2nd revision, 3/5',
				lang: 'Card 3/5',
				src: '/illust/ely/rev2-card/elysia-rev-2-card-3-5.webp'
			}
		]
	},
	{
		description: 'Cover art for Elysia 1.4 release',
		cover: '/blog/elysia-14/elysia-supersymmetry.webp',
		illust: 'SaltyAom',
		page: [
			{
				title: 'Supersymmetry',
				lang: 'Elysia 1.4',
				src: '/blog/elysia-14/elysia-supersymmetry.webp'
			}
		]
	},
	{
		cover: '/elysia/sprite/still.webp',
		description: 'Elysia chan chibi rev. 1',
		illust: 'SaltyAom',
		page: [
			{
				title: 'Elysia chibi standing',
				lang: 'Stand',
				src: '/elysia/sprite/still.webp'
			},
			{
				title: 'Elysia chibi sitting',
				lang: 'Sit',
				src: '/elysia/sprite/sit.webp'
			}
		]
	},
	{
		cover: '/illust/ely/rev1/elysia-chan.webp',
		description: 'Original illustration of Elysia chan',
		illust: 'SaltyAom',
		page: [
			{
				title: 'Original illustration of Elysia chan',
				lang: 'Elysia chan rev. 1',
				src: '/illust/ely/rev1/elysia-chan.webp'
			},
			{
				title: 'Card for original Elysia chan',
				lang: 'Card',
				src: '/illust/ely/rev1/elysia-chan-card.webp'
			}
		]
	}
] satisfies GalleryItem[]

export const yonkoma = [
	{
		description: "Someone's waiting",
		cover: '/illust/4koma/1/cover.webp',
		illust: 'SaltyAom',
		page: [
			{
				title: "Someone's waiting",
				lang: 'English',
				src: '/illust/4koma/1/en.webp'
			},
			{
				title: 'ずっと待ってた',
				lang: '日本語',
				src: '/illust/4koma/1/jp.webp'
			},
			{
				title: "Someone's waiting",
				lang: 'Elysian',
				src: '/illust/4koma/1/el.webp'
			},
			{
				title: "Someone's waiting",
				lang: 'Template',
				src: '/illust/4koma/1/blank.webp'
			}
		]
	}
] satisfies GalleryItem[]
