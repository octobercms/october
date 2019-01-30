// Unregister all service workers before signing in to prevent cache issues
navigator.serviceWorker.getRegistrations().then(
    function(registrations) {
        for (let registration of registrations) {  
            registration.unregister();
        }
});