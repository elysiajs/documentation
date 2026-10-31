/** The tab a roving-tabindex key moves to, or -1 when the key isn't one. Arrows wrap on either axis. */
export function rovingIndex(key: string, index: number, count: number) {
	switch (key) {
		case 'ArrowRight':
		case 'ArrowDown':
			return (index + 1) % count
		case 'ArrowLeft':
		case 'ArrowUp':
			return (index - 1 + count) % count
		case 'Home':
			return 0
		case 'End':
			return count - 1
	}

	return -1
}
