export const appendMessageToURL = (msg: Record<string, any>, host = window.origin,) => {
    const params = new URLSearchParams()
    Object.entries(msg).forEach(([k, v]) => {
        params.append(k, v)
    })
    return `${host}?${params.toString()}`
}

export const readMessageFromURL = <T = unknown>(url = location.href) => {
    const search = new URLSearchParams(new URL(url).search)
    return Object.fromEntries(search.entries()) as Partial<T> | undefined

}
export const removeURLMessage = () => {
    history.replaceState({}, '0', window.origin)
}