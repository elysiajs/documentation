import { expect, test } from 'bun:test'
import { renderToString } from 'react-dom/server'
import { StoryText } from './primitives'
import { dedupBeats, DeduplicationStory, dedupSceneAt } from './deduplication'
import { dependencyBeats, DependencyStory, dependencySceneAt } from './dependency'
import { scopeBeats, scopeSceneAt, ScopeStory } from './scope'

test('Storyboard starts with accessible stage controls and an idle live caption', () => {
	const html = renderToString(<DependencyStory />)
	expect(html).toContain('role="group" aria-label="How dependencies become available"')
	const previous = html.match(/<button[^>]*aria-label="Previous stage"[^>]*>/)?.[0]
	expect(previous).toContain('aria-disabled="true"')
	expect(previous).not.toMatch(/\sdisabled(?:=|\s|>)/)
	expect(html).toMatch(/<button[^>]*aria-label="Play"/)
	expect(html).toMatch(/<button[^>]*aria-label="Next stage"/)
	expect(html).toContain('aria-label="Stage 1 of 4"')
	expect(html).toContain('<number-flow-react')
	expect(html).toContain('role="status" aria-atomic="true" aria-live="polite"')
	expect(html).toContain('<progress class="sr-only" aria-label="Time through current stage" max="100" value="0"')
	expect(html).toContain(`aria-label="${Math.ceil((dependencyBeats[1].at - dependencyBeats[0].at) / 1000)}s"`)
	expect(html.match(/data-head="true"/g)).toHaveLength(1)
})

test('DeduplicationStory renders the named plugin and instances with an idle Play button', () => {
	const html = renderToString(<DeduplicationStory />)
	for (const name of ['ip', 'router1', 'router2', 'server'])
		expect(html).toContain(name)

	expect(html).toContain('Named hooks')
	expect(html).toContain('/ip-')
	expect(html).not.toContain('<text')
	expect(html).not.toContain('viewBox="0 0 640')
	expect(html).toMatch(/<button[^>]*aria-label="Play"/)
})

test('Setup keeps scope neutral and inactive captions out of keyboard navigation', () => {
	const html = renderToString(<ScopeStory />)
	expect(html).toContain('Scope level')
	expect(html).toContain('Overview')
	expect(html).not.toContain('current.beforeHandle')
	expect(html).toContain('Not shown yet')
	expect(html).not.toContain('Not reached')
	expect(html.match(/aria-hidden="true" inert=""/g)).toHaveLength(scopeBeats.length - 1)
})

test('Only the duplicate hook is skipped after the second router is merged', () => {
	for (let i = 0; i < dedupBeats.length; i++) {
		const scene = dedupSceneAt(i)
		expect(new Set(scene.registry).size).toBe(scene.registry.length)
		expect(scene.skipped).toBe(i >= 4)
		if (!scene.merged2) expect(scene.skipped).toBe(false)
		if (scene.skipped) expect(scene.merged2).toBe(true)
	}
})

test('Two routers register the named plugin only once', () => {
	expect(dedupSceneAt(dedupBeats.length - 1).registry).toEqual(['ip'])
})

test('Auth becomes available only after decoration and an explicit dependency', () => {
	for (let i = 0; i < dependencyBeats.length; i++) {
		const scene = dependencySceneAt(i)
		if (scene.available) expect(scene.used).toBe(true)
		if (scene.used) expect(scene.decorated).toBe(true)
	}
	expect(dependencySceneAt(0).available).toBe(false)
	expect(dependencySceneAt(dependencyBeats.length - 1).available).toBe(true)
})

test('Hook scope grows from descendants to the immediate parent to every parent', () => {
	let previous = scopeSceneAt(0).reached
	for (let i = 1; i < scopeBeats.length; i++) {
		const { reached } = scopeSceneAt(i)
		for (const instance of Object.keys(previous) as (keyof typeof previous)[])
			if (previous[instance]) expect(reached[instance]).toBe(true)
		previous = reached
	}

	const local = scopeSceneAt(1)
	expect(local.scope).toBe('local')
	expect(local.reached).toEqual({ child: true, current: true, parent: false, main: false })
	const plugin = scopeSceneAt(2)
	expect(plugin.scope).toBe('plugin')
	expect(plugin.reached).toEqual({ child: true, current: true, parent: true, main: false })
	const global = scopeSceneAt(scopeBeats.length - 1)
	expect(global.scope).toBe('global')
	expect(global.reached).toEqual({ child: true, current: true, parent: true, main: true })
})

test('StoryText initial and empty text do not announce a change or add a wrapper', () => {
	for (const children of ['Runs', '']) {
		const html = renderToString(<StoryText instant={false}>{children}</StoryText>)
		expect(html).toBe(`<span class="plugin-story__text">${children}</span>`)
	}
})
