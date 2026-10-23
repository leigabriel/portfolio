const VERSION = 'v6'
const PRECACHE = `lei-precache-${VERSION}`
const RUNTIME = `lei-runtime-${VERSION}`

const DEV_HOSTNAMES = ['localhost', '127.0.0.1', '[::1]']
const IS_DEV_HOST = DEV_HOSTNAMES.includes(self.location.hostname)

// Only the small app shell is precached. Images, models and video are cached
// as they are requested, so a first visit never downloads the whole portfolio.
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/favicon.ico',
    '/favicon.png',
    '/apple-touch-icon.png',

    '/cursors/grab.svg',
    '/cursors/grabbing.svg',
    '/cursors/link.svg',
    '/cursors/pointer.svg',
    '/cursors/text.svg',

    '/fonts/bonny.woff2',
    '/fonts/tritopani.woff2',
    '/fonts/jetbrains-mono-400.woff2',
    '/fonts/jetbrains-mono-500.woff2',

    '/sounds/folder_sfx.mp3',
]

const CACHEABLE_ASSET_RE = /\.(js|css|png|jpg|jpeg|gif|webp|avif|svg|ico|ttf|woff|woff2|otf|mp3|gltf|glb)$/i
const MEDIA_RE = /\.(mp4|webm|mov)$/i

const shellResponse = () =>
    caches.match('/index.html').then((cached) => cached || fetch('/index.html'))

self.addEventListener('install', (event) => {
    if (IS_DEV_HOST) {
        self.skipWaiting()
        return
    }
    event.waitUntil(
        caches.open(PRECACHE).then((cache) =>
            Promise.all(
                PRECACHE_URLS.map((url) =>
                    cache.add(new Request(url, { cache: 'reload' })).catch(() => {})
                )
            )
        ).then(() => self.skipWaiting())
    )
})

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter((key) => key !== PRECACHE && key !== RUNTIME)
                        .map((key) => caches.delete(key))
                )
            )
            .then(() => self.clients.claim())
    )
})

// Serve from cache immediately, refresh the cache in the background.
function staleWhileRevalidate(request) {
    return caches.open(RUNTIME).then((cache) =>
        cache.match(request).then((cached) => {
            const network = fetch(request)
                .then((response) => {
                    if (response.ok) cache.put(request, response.clone())
                    return response
                })
                .catch(() => cached)
            return cached || network
        })
    )
}

self.addEventListener('fetch', (event) => {
    const { request } = event
    if (IS_DEV_HOST) return
    if (request.method !== 'GET') return

    const url = new URL(request.url)
    const isSameOrigin = url.origin === self.location.origin
    const isHtml = request.mode === 'navigate' || request.destination === 'document'

    if (isHtml) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const isHtmlResponse = (response.headers.get('content-type') || '').includes('text/html')
                    // Real 404s (unknown paths) must reach the page as-is.
                    if (response.status === 404 && isHtmlResponse) return response
                    if (!response.ok || !isHtmlResponse) return shellResponse()
                    const copy = response.clone()
                    caches.open(RUNTIME).then((cache) => cache.put(request, copy))
                    return response
                })
                .catch(() => shellResponse())
        )
        return
    }

    if (!isSameOrigin) return
    // Range requests (video) and large media are left to the browser.
    if (MEDIA_RE.test(url.pathname) || request.headers.has('range')) return

    const isAsset =
        request.destination === 'image' ||
        request.destination === 'font' ||
        request.destination === 'audio' ||
        url.pathname.startsWith('/assets/') ||
        CACHEABLE_ASSET_RE.test(url.pathname)
    if (!isAsset) return

    // Hashed build files never change under the same name: cache first.
    if (url.pathname.startsWith('/assets/')) {
        event.respondWith(
            caches.match(request).then((cached) => cached || fetch(request).then((response) => {
                if (response.ok) {
                    const copy = response.clone()
                    caches.open(RUNTIME).then((cache) => cache.put(request, copy))
                }
                return response
            }))
        )
        return
    }

    // Everything else (images, models, fonts) can be replaced under the same
    // name, so it is revalidated in the background.
    event.respondWith(staleWhileRevalidate(request))
})
