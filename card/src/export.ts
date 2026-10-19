import { domToForeignObjectSvg, domToPng } from 'modern-screenshot';

const keep = (node: Node) =>
	!(node instanceof HTMLTextAreaElement || (node instanceof HTMLElement && node.dataset.editorOnly !== undefined));
const options = { width: 1000, height: 562.5, scale: 2, filter: keep };

export async function capture(kind: 'png' | 'svg' = 'png') {
	const artboard = document.getElementById('artboard');
	if (!artboard) throw new Error('The artboard is missing.');

	if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
	getSelection()?.removeAllRanges();
	artboard.dataset.exporting = '';
	try {
		await document.fonts.ready;
		if (kind === 'svg') return new XMLSerializer().serializeToString(await domToForeignObjectSvg(artboard, options));
		return await domToPng(artboard, options);
	} finally {
		delete artboard.dataset.exporting;
	}
}

export async function download(theme: string) {
	const link = document.createElement('a');
	link.href = await capture();
	link.download = `benchmark-${theme}.png`;
	link.click();
}
