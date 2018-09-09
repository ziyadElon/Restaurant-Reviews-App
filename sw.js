console.log('Inside SW script');
let currentCacheName = 'restaurants-v3';

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(currentCacheName).then(function(cache) {
           return cache.addAll([
            '/',
            'js/main.js',
            'js/dbhelper.js',
            'js/restaurant_info.js',
            'css/styles.css',
            'data/restaurants.json',
            '/img',
            '/key.js'
            //'//normalize-css.googlecode.com/svn/trunk/normalize.css'
            ]);        
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter( function(cacheName) {
                    return cacheName.startsWith('restaurants') && 
                            cacheName != currentCacheName 
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );    
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            if(response) return response;
            return fetch(event.request)
            .then(dynResponse => {
                return caches.open(currentCacheName).then(cache => {
                  cache.put(event.request.url, dynResponse.clone());
                  return dynResponse;
                });
              });
        }) 
    );
});