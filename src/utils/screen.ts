export const getWindowSize = () => ({
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
});

export const registerActualWindowSizeCss = () => {
    const register = () => {
        const size = getWindowSize()
        document.documentElement.style.setProperty('--actVw', `${size.innerWidth}px`);
        document.documentElement.style.setProperty('--actVh', `${size.innerHeight}px`);
    }
    window.addEventListener('resize', register)
    register()
    return () => {
        window.removeEventListener('resize', register)
    }
}