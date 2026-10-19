import { describe, expect, test } from 'bun:test';
import { chapters, findLesson } from './lessons';

describe('lesson navigation', () => {
	test('the introduction has a stable data id and never links backward out of the tutorial', () => {
		const root = findLesson('/tutorial/');
		expect(root?.id).toBe('index');
		expect(root?.prev).toBeUndefined();
		expect(root?.next?.href).toBe('/tutorial/getting-started/your-first-route/');
		expect(findLesson('/tutorial')).toEqual(root);
	});
	test('nested URLs hydrate the same lesson with or without a trailing slash', () => {
		const lesson = findLesson('/tutorial/patterns/cookie/');
		expect(lesson?.id).toBe('patterns/cookie');
		expect(lesson?.chapter).toBe('Patterns');
		expect(lesson?.prev?.title).toBe('Encapsulation');
		expect(lesson?.next?.title).toBe('Error handling');
		expect(findLesson('/tutorial/patterns/cookie')).toEqual(lesson);
	});
	test('the final lesson ends the tutorial without treating the documentation menu link as executable', () => {
		const last = findLesson('/tutorial/whats-next/');
		expect(last?.id).toBe('whats-next');
		expect(last?.prev?.title).toBe('End-to-end type safety');
		expect(last?.next).toBeUndefined();
		expect(findLesson('/table-of-content/')).toBeUndefined();
		expect(chapters.at(-1)?.lessons.at(-1)).toEqual({ title: 'Documentation', href: '/table-of-content/' });
	});
	test('every menu URL is canonical and unknown URLs cannot load a different lesson', () => {
		expect(chapters.flatMap(({ lessons }) => lessons).every(({ href }) => href.endsWith('/'))).toBe(true);
		expect(findLesson('/tutorial/missing/')).toBeUndefined();
		expect(findLesson('/')).toBeUndefined();
	});
});
