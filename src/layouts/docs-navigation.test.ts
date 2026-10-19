import { expect, test } from 'bun:test'

test('same-product navigation keeps the shell and lets Astro deduplicate scripts before inserting new content', async () => {
	const source = await Bun.file(
		new URL('./docs-layout.astro', import.meta.url)
	).text()
	const body = source.match(
		/document\.addEventListener\('astro:before-swap', \(event\) => \{([^]*?)\n\t\t\}, \{ signal \}\)/
	)![1]
	const prepare = new Function(
		'context',
		'event',
		`
		let { dialog, desktop, setOpen, document, shell, sidebar, controller, activeShell } = context;
		${new Bun.Transpiler({ loader: 'ts' }).transformSync(body)}
		return activeShell;
	`
	)
	const calls: string[] = []
	let nativeSwapped = false
	const nextMain = { scriptsDeduplicated: false }
	const group = { open: false, parentElement: null }
	const link = (href: string, current = false) => ({
		current,
		getAttribute: () => href,
		setAttribute() {
			this.current = true
		},
		removeAttribute() {
			this.current = false
		},
		closest: () => group
	})
	const oldLink = link('/essential/route/', true),
		nextLink = link('/essential/handler/')
	const sidebar = {
		scrollTop: 320,
		querySelectorAll: () => [oldLink, nextLink]
	}
	const shell = {
		dataset: { astroTransitionPersist: 'docs-shell-elysia' },
		querySelector: () => ({
			replaceWith(main: typeof nextMain) {
				expect(nativeSwapped).toBe(true)
				expect(main.scriptsDeduplicated).toBe(true)
				calls.push('replace content')
			}
		})
	}
	const incoming = {
		dataset: { astroTransitionPersist: 'docs-shell-elysia' },
		querySelector: (selector: string) =>
			selector === '.main-frame' ? nextMain : nextLink
	}
	const context = {
		dialog: { open: false },
		desktop: { matches: true },
		setOpen: () => calls.push('close sidebar'),
		document: { documentElement: { dataset: { theme: 'light' } } },
		shell,
		sidebar,
		controller: { abort: () => calls.push('dispose shell') },
		activeShell: shell
	}
	const event = {
		newDocument: {
			documentElement: { dataset: { theme: 'dark' } },
			querySelector: () => incoming
		},
		swap: () => {
			nextMain.scriptsDeduplicated = true
			nativeSwapped = true
			calls.push('native swap')
		}
	}
	expect(prepare(context, event)).toBe(shell)
	expect(calls).toEqual([])
	event.swap()
	expect(calls).toEqual(['native swap', 'replace content'])
	expect(oldLink.current).toBe(false)
	expect(nextLink.current).toBe(true)
	expect(group.open).toBe(true)
	expect(sidebar.scrollTop).toBe(320)
	expect(event.newDocument.documentElement.dataset.theme).toBe('light')

	// A different product needs its own sidebar, switcher, and search filter.
	incoming.dataset.astroTransitionPersist = 'docs-shell-eden'
	expect(prepare(context, event)).toBeUndefined()
	expect(calls.at(-1)).toBe('dispose shell')
})
