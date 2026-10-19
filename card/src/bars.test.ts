import { describe, expect, test } from 'bun:test';
import { barWidths, parseValue } from './bars';

const widths = (...values: string[]) => barWidths(values.map((value) => ({ value })));

describe('barWidths', () => {
	test('a fill is proportional to its value, and the largest value fills the track', () => {
		const [bun, checkers, tsc] = widths('1.75s', '5.88s', '12.58s')!;

		expect(tsc).toBe(100);
		expect(bun).toBeCloseTo((1.75 / 12.58) * 100, 10);
		expect(checkers).toBeCloseTo((5.88 / 12.58) * 100, 10);
		expect(checkers / bun).toBeCloseTo(5.88 / 1.75, 10);
	});

	test('small values are not padded up to a minimum length', () => {
		const [fast, slow] = widths('1ms', '1000ms')!;
		expect(fast).toBeCloseTo(0.1, 10);
		expect(slow).toBe(100);
	});

	test('scales against the max, not the sum, so adding a row never shrinks the longest bar', () => {
		expect(widths('2s', '1s')).toEqual([100, 50]);
		expect(widths('2s', '1s', '1s')).toEqual([100, 50, 50]);
	});

	test('thousands separators and spaces do not truncate the number', () => {
		expect(widths('1,250 ms', '625ms', '2_500 ms')).toEqual([50, 25, 100]);
	});

	test('values with different units draw no bars', () => {
		expect(widths('1.75s', '900ms')).toBeNull();
		expect(widths('12', '12s')).toBeNull();
		expect(widths('1.75s', '1.75S')).toBeNull();
	});

	test('byte units are converted to bytes, so mixed sizes draw proportional bars', () => {
		const [small, mid, large] = widths('449b', '5.857kb', '30.339kb')!;
		expect(large).toBe(100);
		expect(small).toBeCloseTo((449 / 30339) * 100, 10);
		expect(mid).toBeCloseTo((5857 / 30339) * 100, 10);
		expect(widths('1gb', '250mb', '500000kb')).toEqual([100, 25, 50]);
	});

	test('binary units are powers of 1024, decimal units powers of 1000', () => {
		const [kib, kb] = widths('1KiB', '1KB')!;
		expect(kib).toBe(100);
		expect(kb).toBeCloseTo((1000 / 1024) * 100, 10);
		expect(widths('1GiB', '512MiB', '1048576KiB')).toEqual([100, 50, 100]);
	});

	test('byte units ignore case', () => {
		expect(widths('1kb', '1KB', '1Kb', '2kB')).toEqual([50, 50, 50, 100]);
		expect(widths('1.0 GiB', '2 gib')).toEqual([50, 100]);
	});

	test('bytes next to a non-byte unit still draw no bars', () => {
		expect(widths('449b', '1.75s')).toBeNull();
		expect(widths('449b', '449')).toBeNull();
		expect(widths('1mb', '1ms')).toBeNull();
	});

	test('unparseable, zero and negative values draw no bar and leave the others alone', () => {
		expect(widths('fast', '0s', '-3s', '', '4s', '2s')).toEqual([0, 0, 0, 0, 100, 50]);
		expect(widths('n/a', 'tbd')).toEqual([0, 0]);
		expect(widths('-8s', '-2s')).toEqual([0, 0]);
	});

	test('a number too large to represent draws no bar and leaves the others alone', () => {
		expect(widths(`${'9'.repeat(309)}s`, '2s', '1s')).toEqual([0, 100, 50]);
		expect(widths(`${'9'.repeat(300)}gb`, '2b', '1b')).toEqual([0, 100, 50]);
	});
});

describe('parseValue', () => {
	test('reads the leading number and keeps the rest as the unit', () => {
		expect(parseValue('12.58s')).toEqual({ n: 12.58, unit: 's' });
		expect(parseValue('10,947 files')).toEqual({ n: 10947, unit: 'files' });
		expect(parseValue('.5x')).toEqual({ n: 0.5, unit: 'x' });
		expect(parseValue('42')).toEqual({ n: 42, unit: '' });
	});

	test('returns null when there is no leading number', () => {
		expect(parseValue('s')).toBeNull();
		expect(parseValue('~2s')).toBeNull();
		expect(parseValue('')).toBeNull();
		expect(parseValue(`${'9'.repeat(309)}s`)).toBeNull();
	});
});
