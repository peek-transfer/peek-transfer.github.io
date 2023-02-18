export const getColorByString = (str: string) => {
    const num = str.split('').reduce((p, c) => p + c.charCodeAt(0), 0)
    const hex = Math.floor(num * 1000).toString(16)
    const pd = `000000${hex}`
    const color = pd.slice(pd.length - 6)
    return `#${color}`
}