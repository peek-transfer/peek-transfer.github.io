declare global {
    interface Window {
        dataLayer?: any;
    }
}
export const assay = (category: string, name?: string, data?: string) => {
    if (window.dataLayer) {
        const formData = {
            event: import.meta.env.DEV ? `DEV_${category}` : category,
            eventAction: name,
            eventLabel: data
        }
        window.dataLayer.push(formData)
    }
}