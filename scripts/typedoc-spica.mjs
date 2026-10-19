// TypeDoc plugin: wrap every starlight-typedoc page in the site's Spica doc layout
import { Application, Converter, PageEvent, ReflectionKind } from 'typedoc'
import { MemberRouter } from 'typedoc-plugin-markdown'

const ROOT_TITLE = 'API reference'
const BEFORE_STARLIGHT = 100

function pageTitle(page) {
	return page.model.kind === ReflectionKind.Project
		? ROOT_TITLE
		: page.model.name
}

function description(model) {
	const comment = model.comment ?? model.signatures?.[0]?.comment
	const text = (comment?.summary ?? []).map((part) => part.text).join('')
	const summary = text
		.split(/\r?\n\s*\r?\n/)[0]
		.replace(/`/g, '')
		.replace(/\s+/g, ' ')
		.trim()

	if (summary) return summary

	return model.kind === ReflectionKind.Project
		? 'Elysia API reference.'
		: `Elysia API reference for ${model.name}.`
}

function stripCommentHeading(comment) {
	const first = comment?.summary?.[0]
	if (first?.kind !== 'text' || !first.text.startsWith('### ')) return
	first.text = first.text.replace(/^### [^\n]*\n?/, '')
}

function serialize(frontmatter) {
	const lines = Object.entries(frontmatter).map(
		([key, value]) =>
			`${key}: ${typeof value === 'string' ? JSON.stringify(value) : value}`
	)
	return `---\n${lines.join('\n')}\n---\n\n`
}

function open(context) {
	const depth = context.page.url.split('/').length - 1
	const prefix = '../'.repeat(depth + 3)
	return [
		`import InteractiveDocLayout from "${prefix}components/interactive-code/layout.astro";`,
		`import "${prefix}styles/routing.css";`,
		'',
		'<div class="essential-page">',
		'<InteractiveDocLayout>',
		'<div class="content-layout">',
		`<h1 id="_top">${pageTitle(context.page)}</h1>`
	].join('\n')
}

const close = () => '</div>\n</InteractiveDocLayout>\n</div>'

// Type parameters render as a table (no heading), so registering anchors for them makes
// TypeDoc's slugger disagree with Astro's heading ids (e.g. `status` vs `status-1`).
class SpicaRouter extends MemberRouter {
	buildAnchors(target, pageTarget) {
		if (target.isTypeParameter?.()) return
		super.buildAnchors(target, pageTarget)
	}
}

function escapeName(name) {
	return name.replace(/[<>{}_`|[\]*]/g, (char) => `\\${char}`)
}

function cell(text) {
	const collapsed = text.replace(/\r?\n/g, ' ')
	const escaped = collapsed
		.split(/(`+[^`]*`+)/)
		.map((part, i) =>
			i % 2 === 1
				? part
				: part
						.replace(/</g, '\\<')
						.replace(/\{/g, '\\{')
						.replace(/\}/g, '\\}')
		)
		.join('')
	return escaped.replace(/(?<!\\)\|/g, '\\|').trim()
}

// Same shape as partials.groupIndex, but with "|" escaped so descriptions cannot split a row.
function groupTable(context, group) {
	const kinds = new Set(
		group.children.map((child) => ReflectionKind.singularString(child.kind))
	)
	const header = kinds.size === 1 ? [...kinds][0] : 'Name'
	const rows = group.children.map((child) => {
		const name = child.isDeprecated()
			? `~~${escapeName(child.name)}~~`
			: escapeName(child.name)
		const link = context.router.hasUrl(child)
			? `[${name}](${context.urlTo(child)})`
			: name
		const comment = child.comment ?? child.signatures?.[0]?.comment
		const summary = context.helpers.getDescriptionForComment(comment)
		return `| ${link} | ${summary ? cell(summary) : '-'} |`
	})
	return [`| ${header} | Description |`, '| ------ | ------ |', ...rows].join(
		'\n'
	)
}

function members(context) {
	const model = context.page.model
	if (!model.kindOf(ReflectionKind.Class | ReflectionKind.Interface))
		return ''

	const groups = (model.groups ?? []).filter(
		(group) => group.title !== 'Constructors'
	)
	if (groups.length === 0) return ''

	const md = ['## Members']
	for (const group of groups)
		md.push(`### ${group.title}`, groupTable(context, group))

	return md.join('\n\n')
}

export function load(app) {
	app.renderer.defineRouter('spica', SpicaRouter)

	app.renderer.on(
		PageEvent.BEGIN,
		(event) => {
			event.frontmatter = {
				template: 'splash',
				description: description(event.model)
			}
		},
		BEFORE_STARLIGHT
	)

	app.renderer.on(
		PageEvent.END,
		(event) => {
			if (!event.contents || !event.frontmatter) return
			if (event.model.kind === ReflectionKind.Project)
				event.frontmatter.title = ROOT_TITLE
			event.contents = serialize(event.frontmatter) + event.contents
		},
		BEFORE_STARLIGHT
	)

	let removed = 0
	app.converter.on(Converter.EVENT_RESOLVE_BEGIN, (context) => {
		for (const reflection of context.project.getReflectionsByKind(
			ReflectionKind.All
		)) {
			stripCommentHeading(reflection.comment)
			for (const signature of reflection.signatures ?? [])
				stripCommentHeading(signature.comment)
			if (reflection.name === 'state') {
				// The dependency's example increments a local number instead of shared state.
				for (const comment of [
					reflection.comment,
					...(reflection.signatures ?? []).map((signature) => signature.comment)
				])
					for (const block of comment?.blockTags ?? []) {
						if (block.tag !== '@example') continue
						for (const part of block.content)
							if (part.kind === 'code')
								part.text = part.text.replaceAll(
									".get('/', ({ store: { counter } }) => ++counter)",
									".get('/', ({ store }) => ++store.counter)"
								)
					}
			}
			if (!reflection.name.startsWith('~')) continue
			// Removing a parent also removes its children; skip those already gone.
			if (context.project.getReflectionById(reflection.id) !== reflection)
				continue
			context.project.removeReflection(reflection)
			removed++
		}
		app.logger.info(
			`typedoc-spica: removed ${removed} internal (~) reflections`
		)
	})

	// typedoc-plugin-markdown installs renderer.markdownHooks in its own load(), which runs after this one.
	app.on(Application.EVENT_BOOTSTRAP_END, () => {
		const hooks = app.renderer.markdownHooks
		hooks.on('page.begin', open)
		hooks.on('index.page.begin', open)
		hooks.on('content.begin', members)
		hooks.on('page.end', close)
		hooks.on('index.page.end', close)
	})
}
