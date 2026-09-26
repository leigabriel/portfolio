const VERSION = 'v3'
const PRECACHE = `lei-precache-${VERSION}`
const RUNTIME = `lei-runtime-${VERSION}`

const DEV_HOSTNAMES = ['localhost', '127.0.0.1', '[::1]']
const IS_DEV_HOST = DEV_HOSTNAMES.includes(self.location.hostname)

const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/favicon.ico',

    '/cursors/grab.svg',
    '/cursors/grabbing.svg',
    '/cursors/link.svg',
    '/cursors/pointer.svg',
    '/cursors/text.svg',

    '/fonts/bonny.ttf',
    '/fonts/tritopani.otf',

    '/images/me.jpg',
    '/images/1000.png',

    '/images/archive/althea.png',
    '/images/archive/call_me.png',
    '/images/archive/die_for_you.png',
    '/images/archive/evil_jordan.png',
    '/images/archive/giselle.jpg',
    '/images/archive/jennie.png',
    '/images/archive/new_jeans.png',
    '/images/archive/ningning.png',
    '/images/archive/perception.png',
    '/images/archive/pusa.png',
    '/images/archive/queen_yunjin.png',
    '/images/archive/rockstar.png',
    '/images/archive/vintage.png',

    '/images/poster_designs/dandadan.jpg',
    '/images/poster_designs/kanibalismo.png',
    '/images/poster_designs/multo.png',
    '/images/poster_designs/reze-01.jpg',
    '/images/poster_designs/rukia-01.jpg',

    '/images/web_projects/bulusanzoo.png',
    '/images/web_projects/gamebulusanzoo.png',
    '/images/web_projects/mategrid64.png',
    '/images/web_projects/zootopia.png',

    '/sounds/folder_sfx.mp3',

    '/svg/affinity.svg',
    '/svg/androidstudio.svg',
    '/svg/paperclip.svg',
    '/svg/threejs.svg',
]

const CACHEABLE_ASSET_RE = /\.(js|css|png|jpg|jpeg|gif|webp|avif|svg|ico|ttf|woff|woff2|otf|mp3)$/i

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
                    const copy = response.clone()
                    caches.open(RUNTIME).then((cache) => cache.put(request, copy))
                    return response
                })
                .catch(() =>
                    caches.match(request).then((cached) => cached || caches.match('/index.html'))
                )
        )
        return
    }

    if (!isSameOrigin) return

    const isPrecached = PRECACHE_URLS.includes(url.pathname)
    const isAsset =
        request.destination === 'image' ||
        request.destination === 'font' ||
        request.destination === 'audio' ||
        url.pathname.includes('/assets/') ||
        CACHEABLE_ASSET_RE.test(url.pathname)

    if (!isPrecached && !isAsset) return
    if (/\.(mp4|webm|mov)$/i.test(url.pathname)) return

    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) return cached

            return fetch(request).then((response) => {
                if (response.ok || response.type === 'opaque') {
                    const cacheName = isPrecached ? PRECACHE : RUNTIME
                    const copy = response.clone()
                    caches.open(cacheName).then((cache) => cache.put(request, copy))
                }
                return response
            })
        })
    )
})
