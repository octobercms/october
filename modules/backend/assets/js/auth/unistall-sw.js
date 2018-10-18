// Unistall a Service Worker before a User Signs in to prevent cache issues
navigator.serviceWorker.getRegistrations().then(

    function(registrations) {

        for(let registration of registrations) {  
            registration.unregister();

        }

});