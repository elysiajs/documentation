import { expect, test } from 'bun:test';
import { curvedRail } from './curved-rail';
import { timelinePath } from './interactive-timeline';

const markers = [{ x: 8, y: 90 }, { x: 24, y: 200 }, { x: 8, y: 350 }];

test('a rail indents and returns along softened 45-degree lines without branches', () => {
	expect(curvedRail([{ x: 8, y: 0 }, { x: 24, y: 40 }, { x: 8, y: 80 }])).toBe(
		'M 8,0 V 8 Q 8,12 12,16 L 20,24 Q 24,28 24,32 V 40 V 48 Q 24,52 20,56 L 12,64 Q 8,68 8,72 V 80'
	);
	const path = curvedRail([{ x: 8, y: 0 }, { x: 24, y: 40 }, { x: 8, y: 80 }]);
	for (const match of path.matchAll(/Q [^ ]+ ([^ ]+) L ([^ ]+)/g)) {
		const [x1, y1] = match[1].split(',').map(Number);
		const [x2, y2] = match[2].split(',').map(Number);
		expect(y2 - y1).toBe(Math.abs(x2 - x1));
	}
});

test('tight row gaps and small indents cap bends without reversing the vertical rail', () => {
	expect(curvedRail([{ x: 8, y: 0 }, { x: 24, y: 6 }, { x: 8, y: 12 }])).toBe(
		'M 8,0 V 0 Q 8,1 12,2 L 20,4 Q 24,5 24,6 V 6 V 6 Q 24,7 20,8 L 12,10 Q 8,11 8,12 V 12'
	);
	expect(curvedRail([{ x: 8, y: 0 }, { x: 10, y: 40 }])).toBe(
		'M 8,0 V 18.5 Q 8,19 8.5,19.5 L 9.5,20.5 Q 10,21 10,21.5 V 40'
	);
	expect(curvedRail([])).toBe('');
	expect(curvedRail([{ x: 8, y: 0 }])).toBe('M 8,0');
});

test('timeline keeps the intro at SVG y=0 and continues through each marker to the last', () => {
	const geometry = timelinePath(8, markers, { x: 236, gap: 48, radius: 16 });
	expect(geometry.top).toBe(-48);
	expect(geometry.height).toBe(398);
	expect(geometry.path).toStartWith('M 236,0 V 32 Q 236,48 220,48 H 24 Q 8,48 8,64 V 138');
	expect(geometry.path).toEndWith('V 398');
	expect(geometry.path.match(/M /g)).toHaveLength(1);
	// The intro must shrink its corners when the horizontal offset is narrow.
	expect(timelinePath(8, markers, { x: 32, gap: 48, radius: 16 }).path)
		.toStartWith('M 32,0 V 36 Q 32,48 20,48 H 20 Q 8,48 8,60');
});

test('without an intro the continuous rail starts at the first marker, including a nested first step', () => {
	const geometry = timelinePath(8, markers);
	expect(geometry).toEqual({
		path: curvedRail([{ x: 8, y: 0 }, { x: 24, y: 110 }, { x: 8, y: 260 }]),
		top: 90, height: 260,
	});
	expect(timelinePath(8, [{ x: 24, y: 30 }, { x: 8, y: 60 }]).path).toStartWith('M 24,0');
	expect(timelinePath(8, [])).toEqual({ path: '', top: 0, height: 0 });
});
