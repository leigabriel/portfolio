export function registerSW() {
    if (!('serviceWorker' in navigator)) return
    if (import.meta.env.DEV) return

    navigator.serviceWorker
        .register('/sw.js', { scope: '/', updateViaCache: 'none' })
        .then((reg) => {
            reg.update().catch(() => {})
            setInterval(() => reg.update().catch(() => {}), 60 * 60 * 1000)
        })
        .catch((err) => console.error('[SW] Registration failed:', err))
}
