export default function registerServiceWorker() {
    window.addEventListener('load', () => {
        if (!('serviceWorker' in navigator)) return

        navigator.serviceWorker
            .register('/sw.js')
            .then(() => console.info('Service worker registered!'))
            .catch((error) => console.warn(`Error: ${error}`))
    })
}