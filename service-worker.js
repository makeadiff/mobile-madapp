importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

workbox.routing.registerRoute(
  // Cache CSS files
  /.*\.css/,
  // Use cache but update in the background ASAP
  workbox.strategies.staleWhileRevalidate({
    // Use a custom cache name
    cacheName: 'css-cache-0',
    plugins: [
      new workbox.expiration.Plugin({
        // Cache only 25 css
        maxEntries: 25,
        // Cache for a maximum of a week
        maxAgeSeconds: 1* 7 * 24 * 60 * 60,
      })
    ],
  })
);


workbox.routing.registerRoute(
  // Cache JS files
  /.*\.js/,
  // Use cache but update in the background ASAP
  workbox.strategies.staleWhileRevalidate({
    // Use a custom cache name
    cacheName: 'js-cache-0',
    plugins: [
      new workbox.expiration.Plugin({
        // Cache only 20 js
        maxEntries: 20,
        // Cache for a maximum of a week
        maxAgeSeconds: 1 * 7 * 24 * 60 * 60,
      })
    ],
  })
);


workbox.routing.registerRoute(
  // Cache image files
  /.*\.(?:png|jpg|jpeg|svg|gif)/,
  // Use the cache if it's available
  workbox.strategies.staleWhileRevalidate({
    // Use a custom cache name
    cacheName: 'image-cache-0',
    plugins: [
      new workbox.expiration.Plugin({
        // Cache only 25 images
        maxEntries: 25,
        // Cache for a maximum of a week
        maxAgeSeconds: 1 * 7 * 24 * 60 * 60,
      })
    ],
  })
);


// Cache the Google Fonts stylesheets with a stale while revalidate strategy.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets-0',
  }),
);

// Cache the Google Fonts webfont files with a cache first strategy for 1 year.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  workbox.strategies.cacheFirst({
    cacheName: 'google-fonts-webfonts-0',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
      }),
    ],
  }),
); 
