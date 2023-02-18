export const keys = (() => {
    let i = -1
    return () => {
        i += 1;
        return i;
    }
})()