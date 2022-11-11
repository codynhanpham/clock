const staticClock = "PWA-Clocksite-v1";
const assets = [
    "/clock/",
    "/clock/index.html",
    "/clock/css/clockstyle.css",
    "/clock/js/clockscript.js",
]

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(staticClock).then(cache => {
        cache.addAll(assets)
        })
    )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        })
    )
})