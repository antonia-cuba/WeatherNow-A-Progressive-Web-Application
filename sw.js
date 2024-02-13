// documentation: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers

const CACHE_NAME = "cc";
const URLsCache = ["index.html", "search.html", "style.css", "script1.js", "script2.js"];

// Install event
// create caches
self.addEventListener("install", event => {
    // add files to cache
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(URLsCache);
        })
    )
});

// Activate event
// remove previous caches from previous versions of the service worker
// the service worker takes control of new clients
self.addEventListener("activate", event => {
    event.waitUntil(clients.claim());
});

// Fetch event - for fetch requests
// try to find a match if it was already cached
// if it has not been previously cached (response = undefined), go to the network, do the regular fetch request
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});