import { onBeforeUnmount, onMounted, Ref } from "vue"

export const useClickOutside = (elRef: Ref<HTMLElement | undefined>, callback: () => void) => {
    onMounted(() => {
        if (!elRef.value) return
        const el = elRef.value
        const fn = (e: MouseEvent) => {
            if (el !== e.target && (e.target as HTMLElement)?.contains(el)) {
                callback()
            }
        }
        window.addEventListener('click', fn)
        onBeforeUnmount(() => {
            window.removeEventListener('click', fn)
        })
    })
}