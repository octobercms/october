/*
 * October General Utilities
 */

// Security helper
// Prevents front end service workers from leaking in to the backend
//
window.unregisterServiceWorkers = unregisterServiceWorkers;
function unregisterServiceWorkers() {
    if (location.protocol === 'https:') {
        navigator.serviceWorker.getRegistrations().then(
            function(registrations) {
                for (var index=0; index<registrations.length; index++) {
                    registrations[index].unregister({ immediate: true })
                }
            }
        );
    }
}

// Service worker used to bust the ESM dependency graph cache,
// A bump to the asset version invalidates every imported module
//
window.registerBackendServiceWorker = registerBackendServiceWorker;
function registerBackendServiceWorker(workerUrl, scope) {
    if (!('serviceWorker' in navigator)) {
        return;
    }

    if (typeof window.isSecureContext === 'boolean' && !window.isSecureContext) {
        return;
    }

    var workerOrigin = new URL(workerUrl, location.href).origin;
    var workerPath = new URL(workerUrl, location.href).pathname;

    navigator.serviceWorker.getRegistrations().then(function (registrations) {
        var sweeps = [];
        for (var i = 0; i < registrations.length; i++) {
            var reg = registrations[i];
            var regScope = new URL(reg.scope);

            // Skip our own registration
            var activeScript = (reg.active || reg.waiting || reg.installing || {}).scriptURL;
            if (activeScript && new URL(activeScript).pathname === workerPath) {
                continue;
            }

            // Skip workers on a different origin (shouldn't happen, but guard anyway)
            if (regScope.origin !== workerOrigin) {
                continue;
            }

            // Unregister any worker whose scope covers the backend scope
            if (scope.indexOf(regScope.pathname) === 0) {
                sweeps.push(reg.unregister({ immediate: true }));
            }
        }
        return Promise.all(sweeps);
    }).then(function () {
        return navigator.serviceWorker.register(workerUrl, { scope: scope });
    }).catch(function (err) {
        console.warn('Backend service worker registration failed:', err);
    });
}


// Path helpers
//
if ($.oc === undefined) {
    $.oc = {};
}

$.oc.backendUrl = function(url) {
    var backendBasePath = $('meta[name="backend-base-path"]').attr('content');

    if (!backendBasePath) {
        return url;
    }

    if (url.substr(0, 1) == '/') {
        url = url.substr(1);
    }

    return backendBasePath + '/' + url;
}

$.oc.backendCalculateTopContainerOffset = function() {
    var height = $('#layout-mainmenu > .main-menu-container').outerHeight();

    if ($('#layout-banner-area').length) {
        height += $('#layout-banner-area').outerHeight();
    }

    return height;
}

// String escape
//
$.oc.escapeHtmlString = function(string) {
    var htmlEscapes = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;'
        },
        htmlEscaper = /[&<>"'\/]/g

    return ('' + string).replace(htmlEscaper, function(match) {
        return htmlEscapes[match];
    });
}

// Touch Detection
// Returns true only for pure touch devices (no mouse), false for hybrid devices like touch laptops
//
$.oc.isTouchEnabled = function() {
    return window.matchMedia('(pointer: coarse)').matches &&
        !window.matchMedia('(pointer: fine)').matches;
}

// Tooltips
//
$(document).render(function() {
    $('[data-control="tooltip"], [data-bs-toggle="tooltip"], [data-toggle="tooltip"]').tooltip();
});

// Color Modes
//
$.oc.setColorModeTheme = function(theme) {
    if (theme === 'auto') {
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-bs-theme', theme);
}

;(function() {
    if (document.documentElement.classList.contains('color-mode-auto')) {
        var current = document.documentElement.getAttribute('data-bs-theme'),
            preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

        if (current === 'auto' || preferred !== Cookies.get('admin_color_mode_setting')) {
            Cookies.set('admin_color_mode_setting', preferred, { expires: 365, path: '/' });
            $.oc.setColorModeTheme(preferred);
        }
    }

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        addEventListener('render', function() {
            const darkFavicon = document.querySelector('head > link[data-favicon-dark]');
            if (darkFavicon) {
                darkFavicon.href = darkFavicon.dataset.faviconDark;
            }
        });
    }
})();

