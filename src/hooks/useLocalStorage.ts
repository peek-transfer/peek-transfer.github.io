import { createLocalStorageHandler } from "@/utils/localStorage"
import { computed, ref, watch } from "vue";

export const useLocalStorage = <T>(key: string, initializer: () => T) => {
    const [get, set] = createLocalStorageHandler<T>(key, initializer as any);
    const _value = ref(get())
    return computed({
        get: () => _value.value,
        set: (v) => {
            set(v as any);
            _value.value = v
        }
    })
}