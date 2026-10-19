import { expect, test } from 'bun:test'
import type { StarlightRouteData } from '@astrojs/starlight/route-data'
import { renderToStaticMarkup } from 'react-dom/server'
import { fromHtml } from 'hast-util-from-html'
import { select, selectAll } from 'hast-util-select'
import { toString } from 'hast-util-to-string'
import { docToMarkdown } from '../../scripts/export-docs'
import Breadcrumb, { breadcrumbItems } from './breadcrumb'
import AsideHeader from './tutorial/aside-header'

test('breadcrumbs follow the current sidebar ancestry and stay out of exported docs', () => {
	const sidebar = [
		{
			type: 'group',
			label: 'Essential',
			entries: [
				{
					type: 'link',
					label: 'Routing',
					href: '/essential/route/',
					isCurrent: false
				}
			]
		},
		{
			type: 'group',
			label: 'Eden',
			entries: [
				{
					type: 'group',
					label: 'Eden Treaty',
					entries: [
						{
							type: 'link',
							label: 'Parameters',
							href: '/eden/treaty/parameters/',
							isCurrent: true
						}
					]
				}
			]
		}
	] as StarlightRouteData['sidebar']
	const html = renderToStaticMarkup(
		<Breadcrumb sidebar={sidebar} title="Interactive parameters" />
	)
	const tree = fromHtml(html)
	expect(select('nav', tree)?.properties.ariaLabel).toBe('Breadcrumb')
	expect(selectAll('li', tree).map(toString)).toEqual([
		'Docs',
		'Eden',
		'Eden Treaty',
		'Parameters'
	])
	expect(selectAll('a', tree).map((link) => link.properties.href)).toEqual([
		'/table-of-content/'
	])
	expect(toString(select('[aria-current="page"]', tree)!)).toBe('Parameters')
	expect(selectAll('button[aria-haspopup="menu"]', tree)).toHaveLength(3)
	expect(
		select('button[aria-current="page"]', tree)?.properties.ariaLabel
	).toBe('Pages in this group: Parameters')
	const crumbs = breadcrumbItems(sidebar)
	expect(crumbs[0].items).toEqual([
		{
			label: 'Essential',
			items: [
				{
					label: 'Routing',
					href: '/essential/route/',
					current: false
				}
			]
		},
		{
			label: 'Eden',
			items: [
				{
					label: 'Eden Treaty',
					items: [
						{
							label: 'Parameters',
							href: '/eden/treaty/parameters/',
							current: true
						}
					]
				}
			]
		}
	])
	expect(crumbs[1].items).toEqual(crumbs[0].items)
	expect(crumbs[2].items).toEqual([
		{ label: 'Parameters', href: '/eden/treaty/parameters/', current: true }
	])
	expect(
		docToMarkdown(
			`<main><div data-interactive-doc-layout>${html}<h1>Parameters</h1><p>Read parameters.</p></div></main>`
		)?.markdown
	).toBe('# Parameters\n\nRead parameters.\n')

	const fallback = fromHtml(
		renderToStaticMarkup(<Breadcrumb sidebar={[]} title="Unlisted page" />)
	)
	expect(selectAll('button', fallback)).toHaveLength(0)
	expect(selectAll('li', fallback).map(toString)).toEqual([
		'Docs',
		'Unlisted page'
	])
})

test('page menus include every sibling and retain subgroups without leaking another group’s pages', () => {
	const sidebar = [
		{
			type: 'group',
			label: 'Essential',
			entries: [
				{
					type: 'link',
					label: 'Routing',
					href: '/essential/route/',
					isCurrent: false
				}
			]
		},
		{
			type: 'group',
			label: 'Eden',
			entries: [
				{
					type: 'link',
					label: 'Overview',
					href: '/eden/',
					isCurrent: true
				},
				{
					type: 'link',
					label: 'Installation',
					href: '/eden/installation/',
					isCurrent: false
				},
				{
					type: 'group',
					label: 'Eden Treaty',
					entries: [
						{
							type: 'link',
							label: 'Parameters',
							href: '/eden/treaty/parameters/',
							isCurrent: false
						}
					]
				}
			]
		}
	] as StarlightRouteData['sidebar']
	expect(breadcrumbItems(sidebar).at(-1)?.items).toEqual([
		{ label: 'Overview', href: '/eden/', current: true },
		{ label: 'Installation', href: '/eden/installation/', current: false },
		{
			label: 'Eden Treaty',
			items: [
				{
					label: 'Parameters',
					href: '/eden/treaty/parameters/',
					current: false
				}
			]
		}
	])
})

test('tutorial breadcrumbs omit the docs root and first separator, keeping chapter and lesson menus', () => {
	for (const [lesson, labels] of [
		['index', ['Getting started', 'Introduction']],
		['patterns/macro', ['Patterns', 'Macro']],
		['whats-next', ['Conclusion', "What's next?"]]
	] as const) {
		const tree = fromHtml(
			renderToStaticMarkup(<AsideHeader lesson={lesson} />)
		)
		const nav = select('[data-breadcrumb]', tree)!
		const items = selectAll('li', nav)
		expect(items.map(toString)).toEqual([...labels])
		expect(selectAll('a', nav)).toHaveLength(0)
		expect(selectAll('button[aria-haspopup="menu"]', nav)).toHaveLength(2)
		expect(
			selectAll('svg.tabler-icon-chevron-right', items[0])
		).toHaveLength(0)
		expect(
			selectAll('svg.tabler-icon-chevron-right', items[1])
		).toHaveLength(1)
		expect(toString(select('[aria-current="page"]', nav)!)).toBe(labels[1])
	}
})
