import { fromHtml } from 'hast-util-from-html';
import { selectAll } from 'hast-util-select';
import { toHtml } from 'hast-util-to-html';

export function interactiveStepContent(html: string, count: number): { html: string; className?: string }[] {
	const tree = fromHtml(html, { fragment: true });
	const content: { html: string; className?: string }[] = [];
	for (const child of tree.children) {
		if (child.type === 'comment' || (child.type === 'text' && !child.value.trim())) continue;
		if (child.type !== 'element' || !('dataInteractiveStepContent' in child.properties)) {
			throw new Error('InteractiveDoc content must be direct InteractiveStep children.');
		}
		if (selectAll('[data-interactive-step-content]', { type: 'root', children: child.children }).length) {
			throw new Error('InteractiveStep children must not be nested.');
		}
		content.push({
			html: toHtml(child.children),
			className: Array.isArray(child.properties.className) ? child.properties.className.join(' ') : undefined,
		});
	}
	if (content.length !== count) {
		throw new Error(`InteractiveDoc has ${count} code entries but ${content.length} InteractiveStep children.`);
	}
	return content;
}
