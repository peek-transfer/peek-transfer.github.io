import { Ref, watch } from "vue";

export const useValueSettled = <T>(value: Ref<T>, to: T, rejectValue?: unknown | T, from?: T) => {
    return new Promise<void>((res, rej) => {
        const stop = watch(value, (v, oldV) => {
            if (from === undefined || from === oldV)
                if (v === to) {
                    res()
                    stop()
                    return
                }
            if (v === rejectValue) {
                rej()
                stop()
            }
        })
    })
}