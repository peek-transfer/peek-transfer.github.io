import { ref, UnwrapRef } from "vue"

const keys = (() => {
    let i = -1
    return () => {
        i += 1;
        return i;
    }
})()

export type Binding<T = unknown> = { bind: T, key: number }

export const createProvider = <T>() => {
    const bindings = ref<Binding<T>[]>([])
    const unshift = (bind: UnwrapRef<T>) => {
        const key = keys()
        bindings.value.unshift({ bind, key })
        return key

    }
    const push = (bind: UnwrapRef<T>) => {
        const key = keys()
        bindings.value.push({ bind, key })
        return key

    }
    const remove = (key: number) => {
        bindings.value = bindings.value.filter(bind => bind.key !== key)
    }

    return {
        bindings, unshift, push, remove
    }
}