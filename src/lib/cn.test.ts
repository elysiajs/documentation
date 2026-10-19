import { expect, test } from 'bun:test';
import { cn } from './cn';

test('custom Spica utilities conflict with their Tailwind groups', () => {
	expect(cn('text-display text-sm')).toBe('text-sm');
	expect(cn('shadow-primary shadow-none')).toBe('shadow-none');
	expect(cn('ease-spring ease-out')).toBe('ease-out');
	expect(cn('animate-spica-spin animate-none')).toBe('animate-none');
});
