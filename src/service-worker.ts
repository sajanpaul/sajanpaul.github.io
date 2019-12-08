/**
@author: Sajan Paul,
@since:  2019-12-07,
@description : Service Worker file
*/

const staticCacheName = 'pages-cache-v1';
const filesToCache:string[] = [
];
self.addEventListener('install', (event:any) => {
    console.log('Attempting to install service worker and cache static assets');
    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                return cache.addAll(filesToCache);
            })
    );
});
self.addEventListener('fetch', (event:any) => {
    console.log('Fetch event for ', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    console.log('Found ', event.request.url, ' in cache');
                    return response;
                }
                console.log('Network request for ', event.request.url);
                return fetch(event.request).then(response => {
                    return caches.open(staticCacheName).then(cache => {
                        cache.put(event.request.url, response.clone());
                        return response;
                    });
                });
            }).catch(error => {
                console.log('Error, ', error);
            })
    );
});
self.addEventListener('activate', (event:any)=> {
    console.log('Activating new service worker...');
    const cacheWhitelist = [staticCacheName];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
})
