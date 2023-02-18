export const intervalWatch = (matcher: () => boolean, option?: { delay?: number, timeout?: number }) => new Promise<void>((res, rej) => {
    const startTime = Date.now()
    const id = setInterval(() => {
        const ok = matcher()
        if (Date.now() - startTime >= (option?.timeout ?? Infinity)) {
            clearInterval(id)
            rej()
            return
        }
        if (ok) {
            clearInterval(id)
            res()
        }
    }, option?.delay)

})