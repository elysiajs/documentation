import { computed, type Ref } from 'vue'
import { cubicBezier } from 'motion-v'

const easeOutExpo = cubicBezier(0.16, 1, 0.3, 1)

export function useFlyIn(isInView: Ref<boolean>) {
    return computed(() => (delay = 0) => ({
        initial: { translateY: '1.75rem', opacity: 0 },
        animate: isInView.value ? 'inView' : 'initial',
        variants: {
            inView: {
                opacity: 1,
                translateY: 0
            }
        },
        transition: {
            ease: easeOutExpo,
            duration: 1.6,
            delay
        }
    }))
}

export function useFadeIn(isInView: Ref<boolean>) {
    return computed(() => (delay = 0) => ({
        initial: { opacity: 0 },
        animate: isInView.value ? 'inView' : 'initial',
        variants: {
            inView: {
                opacity: 1,
            }
        },
        transition: {
            ease: easeOutExpo,
            duration: 1.6,
            delay
        }
    }))
}

export function useExpandWidth(isInView: Ref<boolean>) {
    return computed(() => (width: number, delay = 0) => ({
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
            duration: 1.6,
            delay
        }
    }))
}
