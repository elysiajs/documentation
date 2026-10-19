import { expect, test } from 'bun:test'
import { renderToString } from 'react-dom/server'
import { LifecyclePlayground } from './lifecycle-playground'

test('pending lifecycle names remain focusable tooltip triggers without revealing the trace', () => {
	const html = renderToString(<LifecyclePlayground />)
	const events = html.match(
		/<button\b[^>]*aria-label="[^"]*Inspect event"[^>]*>/g
	)!
	expect(events.length).toBeGreaterThan(0)
	for (const event of events) {
		expect(event).toContain('data-base-ui-tooltip-trigger')
		expect(event).toContain('aria-disabled="true"')
		expect(event).not.toMatch(/\sdisabled(?:\s|=|>)/)
	}
	expect(html).toContain('No response yet.')
	expect(html).not.toContain('Request validation')
})
