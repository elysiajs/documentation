import { computed, type ComputedRef } from 'vue'
import { cubicBezier } from 'motion-v'

const easeOutExpo = cubicBezier(0.16, 1, 0.3, 1)

export function useFlyIn(isInView: ComputedRef<boolean>) {
    return computed(() => (delay: number) => ({
        initial: { translateY: '1.5rem', opacity: 0 },
        animate: isInView.value ? 'inView' : 'initial',
        variants: {
            inView: {
                opacity: 1,
                translateY: 0
            }
        },
        transition: {
            ease: easeOutExpo,
            duration: 2,
            delay
        }
    }))
}

export function useFadeIn(isInView: ComputedRef<boolean>) {
    return computed(() => (delay: number) => ({
        initial: { opacity: 0 },
        animate: isInView.value ? 'inView' : 'initial',
        variants: {
            inView: {
                opacity: 1,
            }
        },
        transition: {
            ease: easeOutExpo,
            duration: 2,
            delay
        }
    }))
}

export function useExpandWidth(isInView: ComputedRef<boolean>) {
    return computed(() => (width:number, delay: number) => ({
        initial: { width: 0, opacity: 0 },
        animate: isInView.value ? 'inView' : 'initial',
        variants: {
            inView: {
                opacity: 1,
				width: `${width}%`
            }
        },
        transition: {
            ease: easeOutExpo,
            duration: 2,
            delay
        }
    }))
}
