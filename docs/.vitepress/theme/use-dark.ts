import { onMounted, ref } from 'vue'

export default function useDark() {
    const isDark = ref(false)

    onMounted(() => {
        isDark.value = document.documentElement.classList.contains('dark')

        const attrObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName !== 'class') return

                isDark.value =
                    document.documentElement.classList.contains('dark')
            })
        })

        attrObserver.observe(document.documentElement, { attributes: true })

        return () => {
            attrObserver.disconnect()
        }
    })

    return isDark
}
