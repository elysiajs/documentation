import { fromHtml } from 'hast-util-from-html';
import { select } from 'hast-util-select';
import { toHtml } from 'hast-util-to-html';

const focusable = [
	'input:not([disabled]):not([type="hidden"])', 'select:not([disabled])',
	'textarea:not([disabled])', 'button:not([disabled])', 'a[href]', 'area[href]',
	'summary', 'iframe', 'object', 'embed', 'audio[controls]', 'video[controls]',
	'[contenteditable]', '[tabindex]:not([disabled])',
].map((selector) => `${selector}:not([hidden]):not([tabindex="-1"])`).join(',');

export function documentPanels(html: string, id: string) {
	const tree = fromHtml(html, { fragment: true });
	const tabs = tree.children.flatMap((node, index) => {
		if (node.type === 'text' && !node.value.trim() || node.type === 'comment') return [];
		if (node.type !== 'element' || node.tagName !== 'document-tab-item')
			throw new Error('Document tabs require direct TabItem children.');
		const label = node.properties.dataLabel;
		if (typeof label !== 'string' || !label.trim())
			throw new Error('TabItem requires a non-empty label.');
		const value = `${id}-panel-${index}`;
		const tabId = `${id}-tab-${index}`;
		node.tagName = 'div';
		node.properties = { id: value, role: 'tabpanel', ariaLabelledBy: [tabId] };
		if (!select(focusable, node)) node.properties.tabIndex = 0;
		return [{ value, label, id: tabId, 'aria-controls': value, node }];
	});
	const [first, ...rest] = tabs;
	if (!first) throw new Error('Document tabs require at least one TabItem.');
	for (const { node } of rest) node.properties.hidden = true;
	return {
		html: toHtml(tree),
		tabs: tabs.map(({ node, ...tab }) => tab),
		defaultValue: first.value,
	};
}
