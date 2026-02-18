const CACHE_VERSION = 'v1'
const STATIC_CACHE = `robofriends-static-${CACHE_VERSION}`
const API_CACHE = `robofriends-api-${CACHE_VERSION}`

const ROBOTS_API_URL = 'https://jsonplaceholder.typicode.com/users'

self.addEventListener('install', (event) => {
    self.skipWaiting()

    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) =>
            cache.addAll(['/', '/index.html', '/sw.js']),
        ),
    )
})

self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then((keys) =>
                Promise.all(
                    keys
                        .filter(
                            (key) =>
                                key.startsWith('robofriends-') &&
                                key !== STATIC_CACHE &&
                                key !== API_CACHE,
                        )
                        .map((key) => caches.delete(key)),
                ),
            ),
        ]),
    )
})

function isSameOrigin(requestUrl) {
    return requestUrl.origin === self.location.origin
}

function isStaticAssetRequest(request) {
    if (request.method !== 'GET') return false

    const url = new URL(request.url)
    if (!isSameOrigin(url)) return false

    if (url.pathname.startsWith('/assets/')) return true

    // Vite-built assets / common static files
    return (
        request.destination === 'script' ||
        request.destination === 'style' ||
        request.destination === 'image' ||
        request.destination === 'font'
    )
}

async function cacheFirst(request) {
    const cached = await caches.match(request)
    if (cached) return cached

    const response = await fetch(request)
    if (response.ok) {
        const cache = await caches.open(STATIC_CACHE)
        cache.put(request, response.clone())
    }
    return response
}

async function networkFirst(request, cacheName, fallbackRequest) {
    try {
        const response = await fetch(request)
        if (response.ok) {
            const cache = await caches.open(cacheName)
            cache.put(request, response.clone())
        }
        return response
    } catch {
        const cached = await caches.match(request)
        if (cached) return cached
        if (fallbackRequest) {
            const fallback = await caches.match(fallbackRequest)
            if (fallback) return fallback
        }
        throw new Error('Offline and no cached response available')
    }
}

self.addEventListener('fetch', (event) => {
    const { request } = event
    if (request.method !== 'GET') return

    // Cache the robots API response (network-first)
    if (request.url === ROBOTS_API_URL) {
        event.respondWith(networkFirst(request, API_CACHE))
        return
    }

    // App navigations (network-first, fallback to cached shell)
    if (request.mode === 'navigate') {
        event.respondWith(networkFirst(request, STATIC_CACHE, '/index.html'))
        return
    }

    // Static assets (cache-first)
    if (isStaticAssetRequest(request)) {
        event.respondWith(cacheFirst(request))
    }
})