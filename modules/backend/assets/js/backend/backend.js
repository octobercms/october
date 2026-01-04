/*
 * October General Utilities
 */

// Security helper
// Prevents front end service workers from leaking in to the backend
//
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

// Color Modes
//
$.oc.setColorModeTheme = function(theme) {
    if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
    }
    else {
        document.documentElement.setAttribute('data-bs-theme', theme);
    }
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

// Color Switcher
//

oc.registerControl('color-mode-switcher', class extends oc.ControlBase {
    init() {
        this.$anchor = this.element.querySelector('a');
        this.$label = this.element.querySelector('.nav-label');
        this.$icon = this.element.querySelector('.nav-icon > i');
    }

    connect() {
        this.listen('click', this.$anchor, this.onToggleSwitch)
        this.updateUi();
    }

    onToggleSwitch() {
        var current = this.getCurrentMode(),
            preferred = current === 'dark' ? 'light' : 'dark';

        $.oc.setColorModeTheme(preferred);

        Cookies.set('admin_color_mode_user', preferred, { expires: 365, path: '/' });
        this.updateUi();
    }

    updateUi() {
        if (this.getCurrentMode() === 'dark') {
            this.$label.innerText = this.element.dataset.langLightMode;
            this.$icon.setAttribute('class', 'icon-sun');
        }
        else {
            this.$label.innerText = this.element.dataset.langDarkMode;
            this.$icon.setAttribute('class', 'icon-moon');
        }
    }

    getCurrentMode() {
        return document.documentElement.getAttribute('data-bs-theme');
    }
});
