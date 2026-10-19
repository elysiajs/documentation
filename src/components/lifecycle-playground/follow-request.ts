export function followScrollTarget(top: number, bottom: number, safeTop: number, safeBottom: number, scrollY: number, maxScroll: number) {
	const delta = top < safeTop || bottom - top > safeBottom - safeTop
		? top - safeTop : bottom > safeBottom ? bottom - safeBottom : 0;
	const target = Math.max(0, Math.min(maxScroll, scrollY + delta));
	return Math.abs(target - scrollY) > 2 ? target : null;
}

export function followPanelTop(eventTop: number, headerTop: number, viewportHeight: number, panelHeight: number) {
	return Math.max(headerTop, Math.min(eventTop, Math.max(headerTop, viewportHeight - panelHeight - 16)));
}

export function followTailSpace(panelHeight: number, finalEventHeight: number) {
	return Math.max(panelHeight - finalEventHeight, 0);
}
