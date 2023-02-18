export const randomString = () => {
    return (Math.random() * 10).toFixed(0)
}

export const randomInt = (length = 5) => (Math.random() * (10 ** length)).toFixed(0).padStart(4, '0')

export const randomName = () => {
    const NAMES = ['Au', 'Br', "Co", 'Mg', 'Nb', 'Fe', "Pt", "Re", "Li", "Ta"]
    return `${NAMES.at(Math.floor(Math.random() * 4))}${randomString()}`
}

export const randomVideoStream = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 400
    canvas.height = 400
    const stream = canvas.captureStream();
    const ctx = canvas.getContext('2d')
    setInterval(() => {
        ctx?.clearRect(0, 0, 400, 400)
        ctx!.fillStyle = 'blue'
        ctx?.fillRect(0, 0, 400, 400)
        ctx!.fillStyle = 'yellow'
        ctx?.fillText(Date.now().toFixed(0), 20, 20)
    }, 1000)
    return stream
}