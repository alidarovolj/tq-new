import type { Ref } from 'vue';

export const useClickOutside = <T extends HTMLElement>(
    ref: Ref<T | null>,
    cb: () => void
) => {
    const clickHandler = (event: MouseEvent | TouchEvent) => {
        if (ref.value && !ref.value.contains(event.target as Node)) {
            cb()
        }
    }

    onMounted(() => {
        document.addEventListener('mousedown', clickHandler)
        document.addEventListener('touchstart', clickHandler)
    })

    onBeforeUnmount(() => {
        document.removeEventListener('mousedown', clickHandler)
        document.removeEventListener('touchstart', clickHandler)
    })
}
