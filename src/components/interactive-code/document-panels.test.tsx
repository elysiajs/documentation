import { expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { fromHtml } from 'hast-util-from-html';
import { select, selectAll } from 'hast-util-select';
import { toString } from 'hast-util-to-string';
import { toHtml } from 'hast-util-to-html';
import { documentPanels } from './document-panels';
import DocumentTabs from './document-tabs';

test('document panels retain nested groups, code whitespace and island hydration metadata', () => {
	const source = `<document-tab-item data-label="Bun &amp; Node">
		<h2 id="bun">Bun</h2><pre><code>  &lt;tag&gt; &amp; &#96;&#96;&#96;\n\n\tend  </code></pre>
		<div data-document-tabs><div role="tabpanel" id="nested"><h3>Nested</h3></div>
			<div role="tabpanel" hidden id="nested-hidden">Other</div></div>
		<astro-island component-url="/island.js" props="{&quot;text&quot;:[0,&quot;&lt;hi&gt;&quot;]}">
			<template data-astro-template="default"><p>Hydrate &amp; preserve</p></template>
		</astro-island>
	</document-tab-item><document-tab-item data-label="Windows"><p>Second</p></document-tab-item>`;
	const result = documentPanels(source, 'test');
	const tree = fromHtml(result.html, { fragment: true });
	expect(result.tabs.map(({ label }) => label)).toEqual(['Bun & Node', 'Windows']);
	const panels = selectAll('[role="tabpanel"]', tree);
	expect(panels).toHaveLength(4);
	expect(panels.map((panel) => !!panel.properties.hidden)).toEqual([false, false, true, true]);
	expect(select('pre code', tree) && toString(select('pre code', tree)!)).toBe('  <tag> & ```\n\n\tend  ');
	expect(select('astro-island', tree)?.properties.props).toBe('{"text":[0,"<hi>"]}');
	expect(toHtml(select('template', tree)!)).toBe(toHtml(select('template', fromHtml(source, { fragment: true }))!));
	expect(panels[0].properties.ariaLabelledBy).toEqual([result.tabs[0].id]);
	expect(panels.at(-1)?.properties.id).toBe(result.tabs[1]['aria-controls']);
	expect(panels[0].properties.tabIndex).toBe(0);
});

test('document tabs SSR connects the actual Spica controls to static panels', () => {
	const result = documentPanels('<document-tab-item data-label="Bun">Bun</document-tab-item><document-tab-item data-label="Node.js">Node</document-tab-item>', 'runtime');
	const controls = fromHtml(renderToStaticMarkup(<DocumentTabs label="Runtime" kind="page" tabs={result.tabs} defaultValue={result.defaultValue} />), { fragment: true });
	expect(select('[role="tablist"]', controls)?.properties.ariaLabel).toBe('Runtime');
	const tabs = selectAll('[role="tab"]', controls);
	expect(tabs.map((tab) => tab.properties.id)).toEqual(result.tabs.map((tab) => tab.id));
	expect(tabs.map((tab) => tab.properties.ariaControls)).toEqual(result.tabs.map((tab) => [tab.value]));
	expect(tabs.map((tab) => tab.properties.ariaSelected)).toEqual(['true', 'false']);
	expect(tabs.map((tab) => tab.tagName)).toEqual(['button', 'button']);
});

test('document panels reject empty groups, unlabelled tabs and non-panel children', () => {
	expect(() => documentPanels(' \n', 'empty')).toThrow('at least one TabItem');
	expect(() => documentPanels('<document-tab-item>Missing</document-tab-item>', 'missing')).toThrow('non-empty label');
	expect(() => documentPanels('<p>Outside a tab</p>', 'outside')).toThrow('direct TabItem children');
});

test('panels are a keyboard stop only when their content has no focusable child', () => {
	const result = documentPanels(`<document-tab-item data-label="Link"><a href="/guide">Guide</a></document-tab-item>
		<document-tab-item data-label="Disabled"><button disabled>Disabled</button></document-tab-item>
		<document-tab-item data-label="Hidden"><input hidden><a href="/guide" tabindex="-1">Unreachable</a></document-tab-item>`, 'focus');
	expect(selectAll('[role="tabpanel"]', fromHtml(result.html, { fragment: true })).map((panel) => panel.properties.tabIndex)).toEqual([undefined, 0, 0]);
});
