import { onMounted, ref } from 'vue'

export default function useDark() {
    const isDark = ref(false)

    onMounted(() => {
        // @ts-ignore
        isDark.value = document.documentElement.classList.contains('dark')

        // @ts-ignore
        const attrObserver = new MutationObserver((mutations) => {
            // @ts-ignore
            mutations.forEach((mutation) => {
                if (mutation.attributeName !== 'class') return

                isDark.value =
                    // @ts-ignore
                    document.documentElement.classList.contains('dark')
            })
        })

        // @ts-ignore
        attrObserver.observe(document.documentElement, { attributes: true })

        return () => {
            attrObserver.disconnect()
        }
    })

    return isDark
}
