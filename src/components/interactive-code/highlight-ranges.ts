export function highlightRanges(lines: number[]) {
	const ranges: { start: number; length: number }[] = [];
	for (const line of [...new Set(lines)].sort((a, b) => a - b)) {
		const previous = ranges.at(-1);
		if (previous && line === previous.start + previous.length) previous.length++;
		else ranges.push({ start: line, length: 1 });
	}
	return ranges;
}
