/*
 * Backend service worker
 *
 * Propagates a single asset version across the entire ESM dependency graph by
 * rewriting in-flight asset requests with a ?v=<APP_VERSION> query string. A
 * bump to Backend::assetVersion() invalidates every imported module, not just
 * the entry points listed in the layout.
 *
 * Imports inherit the version of the asset that requested them, so a worker
 * left over from a previous build still fetches fresh files for a newer page.
 *
 * Intentionally tiny: no Cache Storage, no offline support, no API routing.
 */

const APP_VERSION = new URL(self.location.href).searchParams.get('v') || '';

const ASSET_PATH_PATTERN = /\/(modules|plugins)\//;
const VERSIONABLE_EXT = /\.(m?js|css)$/i;

// isVersionableAsset checks if the URL is a script or stylesheet served by a module or plugin.
function isVersionableAsset(url) {
    return VERSIONABLE_EXT.test(url.pathname) && ASSET_PATH_PATTERN.test(url.pathname);
}

// resolveVersion returns the version of the importing asset, falling back to the worker version.
function resolveVersion(request) {
    if (!request.referrer) {
        return APP_VERSION;
    }

    const referrer = new URL(request.referrer);

    if (referrer.origin !== self.location.origin || !isVersionableAsset(referrer)) {
        return APP_VERSION;
    }

    return referrer.searchParams.get('v') || APP_VERSION;
}

self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    const request = event.request;

    if (request.method !== 'GET') {
        return;
    }

    const url = new URL(request.url);

    if (url.origin !== self.location.origin) {
        return;
    }

    if (url.searchParams.has('v')) {
        return;
    }

    if (!isVersionableAsset(url)) {
        return;
    }

    url.searchParams.set('v', resolveVersion(request));

    event.respondWith(fetch(new Request(url.toString(), {
        method: request.method,
        headers: request.headers,
        mode: request.mode === 'navigate' ? 'same-origin' : request.mode,
        credentials: request.credentials,
        redirect: request.redirect,
        referrer: request.referrer,
        integrity: request.integrity
    })));
});
