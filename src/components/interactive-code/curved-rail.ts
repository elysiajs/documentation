export type RailPoint = { x: number; y: number };

/** A single rail through ordered row centers, with softened 45-degree turns; tight gaps compress vertically. */
export function curvedRail(points: RailPoint[], radius = 4) {
	if (!points.length) return '';
	let path = `M ${points[0].x},${points[0].y}`;
	for (let index = 1; index < points.length; index++) {
		const from = points[index - 1];
		const to = points[index];
		if (from.x !== to.x) {
			const direction = Math.sign(to.x - from.x);
			const middle = (from.y + to.y) / 2;
			const half = Math.abs(to.x - from.x) / 2;
			const r = Math.max(0, Math.min(radius, half / 2));
			const scale = Math.min(1, (to.y - from.y) / (2 * (half + r)));
			path += ` V ${middle - (half + r) * scale} Q ${from.x},${middle - half * scale} ${from.x + direction * r},${middle - (half - r) * scale} L ${to.x - direction * r},${middle + (half - r) * scale} Q ${to.x},${middle + half * scale} ${to.x},${middle + (half + r) * scale}`;
		}
		path += ` V ${to.y}`;
	}
	return path;
}
