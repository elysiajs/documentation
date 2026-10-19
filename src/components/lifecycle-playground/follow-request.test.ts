import { expect, test } from 'bun:test';
import { followPanelTop, followScrollTarget, followTailSpace } from './follow-request';

test('follow leaves visible events alone and moves only enough to reveal an obscured edge', () => {
	expect(followScrollTarget(150, 220, 100, 700, 500, 2000)).toBeNull();
	expect(followScrollTarget(80, 180, 100, 700, 500, 2000)).toBe(480);
	expect(followScrollTarget(680, 750, 100, 700, 500, 2000)).toBe(550);
	expect(followScrollTarget(98, 180, 100, 700, 500, 2000)).toBeNull();
});

test('oversized events align their start without producing unreachable document scroll targets', () => {
	expect(followScrollTarget(150, 900, 100, 700, 500, 2000)).toBe(550);
	expect(followScrollTarget(0, 50, 100, 700, 20, 2000)).toBe(0);
	expect(followScrollTarget(680, 750, 100, 700, 1980, 2000)).toBe(2000);
	expect(followScrollTarget(680, 750, 100, 700, 2000, 2000)).toBeNull();
});

test('mobile alignment clears the full panel at its resting sticky position', () => {
	const safeTop = 64 + 240 + 16;
	expect(followScrollTarget(280, 370, safeTop, 812, 500, 2000)).toBe(460);
	expect(followScrollTarget(758, 848, safeTop, 812, 500, 2000)).toBe(536);
	expect(followScrollTarget(safeTop, 410, safeTop, 812, 500, 2000)).toBeNull();
});

test('the desktop panel tracks the event while remaining below the header and inside the viewport', () => {
	expect(followPanelTop(220, 64, 863, 383)).toBe(220);
	expect(followPanelTop(20, 64, 863, 383)).toBe(64);
	expect(followPanelTop(700, 64, 863, 383)).toBe(464);
	expect(followPanelTop(220, 64, 600, 560)).toBe(64);
});

test('the final event leaves enough containing-block space for the complete sticky panel', () => {
	const stickyTop = 64;
	const finalEventTop = 80;
	const finalEventHeight = 90;
	const panelHeight = 383;
	const tail = followTailSpace(panelHeight, finalEventHeight);
	expect(finalEventTop + finalEventHeight + tail).toBeGreaterThanOrEqual(stickyTop + panelHeight);
	expect(tail).toBe(293);
	expect(followTailSpace(120, 180)).toBe(0);
});
