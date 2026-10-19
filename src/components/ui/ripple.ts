/*
 * Adapted from https://github.com/saltyaom/m3-ripple
 * Copyright 2025 saltyAom
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/** The soft edge extends beyond the diagonal, so the final wave covers the host. */
export function rippleGeometry(
	width: number,
	height: number,
	x = width / 2,
	y = height / 2
) {
	const size = Math.max(1, Math.floor(Math.max(width, height) * 0.2))
	const scale =
		(Math.hypot(width, height) +
			12 +
			Math.max(Math.max(width, height) * 0.35, 75)) /
		size

	return {
		size: `${size}px`,
		start: `translate(${x - size / 2}px, ${y - size / 2}px) scale(1)`,
		end: `translate(${(width - size) / 2}px, ${(height - size) / 2}px) scale(${scale})`
	}
}

if (
	typeof customElements !== 'undefined' &&
	!customElements.get('spica-ripple')
) {
	customElements.define(
		'spica-ripple',
		class extends HTMLElement {
			static observedAttributes = ['disabled']
			private listeners?: AbortController
			private delay?: ReturnType<typeof setTimeout>
			private release?: ReturnType<typeof setTimeout>
			private animation?: Animation
			private pointer?: PointerEvent
			private started = 0

			private get disabled() {
				return (
					this.hasAttribute('disabled') ||
					!this.parentElement ||
					this.parentElement.matches(':disabled') ||
					!!this.closest('[aria-disabled="true"], [inert]')
				)
			}

			private duration(name: string, fallback: number) {
				const value = Number(this.getAttribute(name) ?? fallback)
				return Number.isFinite(value) && value >= 0 ? value : fallback
			}

			private reset = () => {
				clearTimeout(this.delay)
				clearTimeout(this.release)
				this.pointer = undefined
				this.animation?.cancel()
				this.animation = undefined
				this.removeAttribute('data-pressed')
				this.removeAttribute('data-hovered')
			}

			private begin(event?: PointerEvent) {
				if (this.disabled) return this.reset()
				const wave = this.firstElementChild as HTMLElement | null
				if (!wave) return
				clearTimeout(this.release)
				this.animation?.cancel()
				const rect = this.getBoundingClientRect()
				// Bounding coordinates include an ancestor's press scale; animate in local pixels.
				const width = this.clientWidth,
					height = this.clientHeight
				const { size, start, end } = rippleGeometry(
					width,
					height,
					event && rect.width
						? ((event.clientX - rect.left) * width) / rect.width
						: undefined,
					event && rect.height
						? ((event.clientY - rect.top) * height) / rect.height
						: undefined
				)
				wave.style.width = wave.style.height = size
				wave.style.transform = end
				this.started = performance.now()
				this.setAttribute('data-pressed', '')
				if (!matchMedia('(prefers-reduced-motion: reduce)').matches)
					this.animation = wave.animate(
						{ transform: [start, end] },
						{
							duration: this.duration('duration', 150),
							easing:
								this.getAttribute('easing') ||
								'cubic-bezier(0.2, 0, 0, 1)'
						}
					)
			}

			private end() {
				clearTimeout(this.delay)
				this.pointer = undefined
				this.release = setTimeout(
					() => this.removeAttribute('data-pressed'),
					Math.max(
						0,
						this.duration('minimum-press-duration', 225) -
							(performance.now() - this.started)
					)
				)
			}

			connectedCallback() {
				this.listeners?.abort()
				const host = this.parentElement
				if (!host) return
				this.listeners = new AbortController()
				const options = { signal: this.listeners.signal, capture: true }
				host.addEventListener(
					'pointerenter',
					(event) => {
						if (
							event.target === host &&
							!this.disabled &&
							event.isPrimary &&
							event.pointerType !== 'touch'
						)
							this.setAttribute('data-hovered', '')
					},
					options
				)
				host.addEventListener(
					'pointerdown',
					(event) => {
						if (
							this.disabled ||
							!event.isPrimary ||
							event.button !== 0 ||
							this.pointer
						)
							return
						clearTimeout(this.release)
						this.removeAttribute('data-pressed')
						this.pointer = event
						if (event.pointerType === 'touch')
							this.delay = setTimeout(
								() => this.begin(event),
								this.duration('touch-delay', 150)
							)
						else this.begin(event)
					},
					options
				)
				window.addEventListener(
					'pointerup',
					(event) => {
						if (event.pointerId !== this.pointer?.pointerId) return
						const rect = host.getBoundingClientRect()
						if (
							event.clientX < rect.left ||
							event.clientX > rect.right ||
							event.clientY < rect.top ||
							event.clientY > rect.bottom
						)
							return this.reset()
						if (!this.hasAttribute('data-pressed'))
							this.begin(this.pointer)
						this.end()
					},
					options
				)
				host.addEventListener(
					'click',
					(event) => {
						// Keyboard and assistive activation have no pointer position.
						if (
							!this.disabled &&
							event.detail === 0 &&
							!this.pointer
						) {
							this.begin()
							this.end()
						}
					},
					options
				)
				host.addEventListener(
					'pointerleave',
					(event) => {
						// Touch emits a leave after releasing implicit capture on pointerup.
						if (event.pointerType === 'touch' && !this.pointer)
							return
						if (
							event.target === host &&
							(!this.pointer ||
								event.pointerId === this.pointer.pointerId)
						)
							this.reset()
					},
					options
				)
				window.addEventListener(
					'pointercancel',
					(event) => {
						if (event.pointerId === this.pointer?.pointerId)
							this.reset()
					},
					options
				)
				host.addEventListener('contextmenu', this.reset, options)
				host.addEventListener('blur', this.reset, options)
				window.addEventListener('blur', this.reset, {
					...options,
					capture: false
				})
			}

			attributeChangedCallback() {
				if (this.disabled) this.reset()
			}

			disconnectedCallback() {
				this.listeners?.abort()
				this.reset()
			}
		}
	)
}
