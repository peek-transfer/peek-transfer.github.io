type Initializer<T> = T extends any ? (T | (() => T)) : never
export function createLocalStorageHandler<T>(key: string): [() => T | undefined, (v: T) => void]
export function createLocalStorageHandler<T>(key: string, initialValue: Initializer<T>): [() => T, (v: T) => void]


export function createLocalStorageHandler<T>(key: string, initialValue?: Initializer<T>) {
    const set = (v: T) => {
        localStorage.setItem(key, typeof v === 'string' ? `"${v}"` : JSON.stringify(v))
    }
    const get = () => {
        const item = localStorage.getItem(key)
        if (item === null) return undefined;
        return JSON.parse(item)

    }
    if (initialValue !== undefined && get() === undefined) {

        set((typeof initialValue === 'function') ? initialValue() : initialValue)
    }
    const handler = [get, set]
    return handler as [typeof get, typeof set,]

}

const x = 0 as unknown;
if (typeof x === 'function') {
    x()
}