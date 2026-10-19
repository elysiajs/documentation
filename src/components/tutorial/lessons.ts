export interface Lesson {
	title: string;
	href: string;
}

export const chapters: { title: string; lessons: Lesson[] }[] = [
	{
		title: 'Getting started',
		lessons: [
			{ title: 'Introduction', href: '/tutorial/' },
			{ title: 'Your first route', href: '/tutorial/getting-started/your-first-route/' },
			{ title: 'Handler and context', href: '/tutorial/getting-started/handler-and-context/' },
			{ title: 'Status and headers', href: '/tutorial/getting-started/status-and-headers/' },
			{ title: 'Validation', href: '/tutorial/getting-started/validation/' },
			{ title: 'Lifecycle', href: '/tutorial/getting-started/life-cycle/' },
			{ title: 'Guard', href: '/tutorial/getting-started/guard/' },
			{ title: 'Plugin', href: '/tutorial/getting-started/plugin/' },
			{ title: 'Encapsulation', href: '/tutorial/getting-started/encapsulation/' }
		]
	},
	{
		title: 'Patterns',
		lessons: [
			{ title: 'Cookie', href: '/tutorial/patterns/cookie/' },
			{ title: 'Error handling', href: '/tutorial/patterns/error-handling/' },
			{ title: 'Validation error', href: '/tutorial/patterns/validation-error/' },
			{ title: 'Extends context', href: '/tutorial/patterns/extends-context/' },
			{ title: 'Merge schemas', href: '/tutorial/patterns/standalone-schema/' },
			{ title: 'Macro', href: '/tutorial/patterns/macro/' }
		]
	},
	{
		title: 'Features',
		lessons: [
			{ title: 'OpenAPI', href: '/tutorial/features/openapi/' },
			{ title: 'Mount', href: '/tutorial/features/mount/' },
			{ title: 'Unit test', href: '/tutorial/features/unit-test/' },
			{ title: 'End-to-end type safety', href: '/tutorial/features/end-to-end-type-safety/' }
		]
	},
	{
		title: 'Conclusion',
		lessons: [
			{ title: "What's next?", href: '/tutorial/whats-next/' },
			{ title: 'Documentation', href: '/table-of-content/' }
		]
	}
];

// Documentation stays in the chapter menu, but is excluded from tutorial prev/next chaining.
const lessons = chapters.flatMap(({ title: chapter, lessons }) => lessons
	.filter(({ href }) => href.startsWith('/tutorial/'))
	.map((lesson) => ({ chapter, lesson })));

export function findLesson(pathname: string): { chapter: string; lesson: Lesson; prev?: Lesson; next?: Lesson; id: string } | undefined {
	const path = pathname.replace(/\/+$/, '') + '/';
	const index = lessons.findIndex(({ lesson }) => lesson.href === path);
	if (index === -1) return;
	return {
		...lessons[index],
		prev: lessons[index - 1]?.lesson,
		next: lessons[index + 1]?.lesson,
		id: path.slice('/tutorial/'.length).replace(/\/+$/, '') || 'index'
	};
}
