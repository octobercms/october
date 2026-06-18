/*
 * Backend service worker
 *
 * Propagates a single asset version across the entire ESM dependency graph by
 * rewriting in-flight asset requests with a ?v=<APP_VERSION> query string. A
 * bump to Backend::assetVersion() invalidates every imported module, not just
 * the entry points listed in the layout.
 *
 * Intentionally tiny: no Cache Storage, no offline support, no API routing.
 */

const APP_VERSION = new URL(self.location.href).searchParams.get('v') || '';

const ASSET_PATH_PATTERN = /\/(modules|plugins)\//;
const VERSIONABLE_EXT = /\.(m?js|css)$/i;

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

    if (!VERSIONABLE_EXT.test(url.pathname)) {
        return;
    }

    if (!ASSET_PATH_PATTERN.test(url.pathname)) {
        return;
    }

    url.searchParams.set('v', APP_VERSION);

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
