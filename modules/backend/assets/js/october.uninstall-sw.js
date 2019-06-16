"use strict";
/* Only run on HTTPS connections
 * Block off Front-end Service Worker from running in the Backend allowing security injections see GitHub #4384
 */
 if (location.protocol === 'https:') {
     // Unregister all service workers before signing in to prevent cache issues
     navigator.serviceWorker.getRegistrations().then(
         function(registrations) {
             for (let registration of registrations) {  
                 registration.unregister();
             }
     });
 }