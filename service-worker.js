// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
importScripts('https://www.gstatic.com/firebasejs/6.6.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.6.2/firebase-messaging.js');

//Import and configure Workbox base SW
// importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

// Firebase Messaging SW
var config = {
  apiKey: "AIzaSyBZ278HcsmVncMN7M4XThCnQfw-h72vqpA",
  authDomain: "upma-80899.firebaseapp.com",
  databaseURL: "https://upma-80899.firebaseio.com",
  projectId: "upma-80899",
  storageBucket: "upma-80899.appspot.com",
  messagingSenderId: "440196037821"
};
firebase.initializeApp(config);


var messaging = firebase.messaging();

// [START background_handler]
messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  var notificationTitle = 'Background Message Title';
  var notificationOptions = {
    body: 'Background Message body.',
    icon: './images/icons/icon-192x192.png' 
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});
// [END background_handler]



// workbox.core.setCacheNameDetails({
//   prefix: 'UPMA',
//   suffix: 'v1'
// });
// workbox.setConfig({debug: false});

// workbox.routing.registerRoute(
//   // Cache CSS files
//   /.*\.css/,
//   // Use cache but update in the background ASAP
//   workbox.strategies.staleWhileRevalidate({
//     // Use a custom cache name
//     cacheName: 'css-cache-0',
//     plugins: [
//       new workbox.expiration.Plugin({
//         // Cache only 25 css
//         maxEntries: 25,
//         // Cache for a maximum of a week
//         maxAgeSeconds: 1* 7 * 24 * 60 * 60,
//       })
//     ],
//   })
// );


// workbox.routing.registerRoute(
//   // Cache JS files
//   /.*\.js/,
//   // Use cache but update in the background ASAP
//   workbox.strategies.staleWhileRevalidate({
//     // Use a custom cache name
//     cacheName: 'js-cache-0',
//     plugins: [
//       new workbox.expiration.Plugin({
//         // Cache only 20 js
//         maxEntries: 20,
//         // Cache for a maximum of a week
//         maxAgeSeconds: 1 * 7 * 24 * 60 * 60,
//       })
//     ],
//   })
// );


// workbox.routing.registerRoute(
//   // Cache image files
//   /.*\.(?:png|jpg|jpeg|svg|gif)/,
//   // Use the cache if it's available
//   workbox.strategies.staleWhileRevalidate({
//     // Use a custom cache name
//     cacheName: 'image-cache-0',
//     plugins: [
//       new workbox.expiration.Plugin({
//         // Cache only 25 images
//         maxEntries: 25,
//         // Cache for a maximum of a week
//         maxAgeSeconds: 1 * 7 * 24 * 60 * 60,
//       })
//     ],
//   })
// );

// Cache the Google Fonts stylesheets with a stale while revalidate strategy.
// workbox.routing.registerRoute(
//   /^https:\/\/fonts\.googleapis\.com/,
//   workbox.strategies.staleWhileRevalidate({
//     cacheName: 'google-fonts-stylesheets-0',
//   }),
// );

// Cache the Google Fonts webfont files with a cache first strategy for 1 year.
// workbox.routing.registerRoute(
//   /^https:\/\/fonts\.gstatic\.com/,
//   workbox.strategies.cacheFirst({
//     cacheName: 'google-fonts-webfonts-0',
//     plugins: [
//       new workbox.cacheableResponse.Plugin({
//         statuses: [0, 200],
//       }),
//       new workbox.expiration.Plugin({
//         maxAgeSeconds: 60 * 60 * 24 * 365,
//       }),
//     ],
//   }),
// );

