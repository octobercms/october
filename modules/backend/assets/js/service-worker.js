/*
 * Backend service worker
 *
 * Propagates a single asset version across the entire ESM dependency graph by
 * rewriting in-flight asset requests with a ?v=<appVersion> query string. A
 * bump to Backend::assetVersion() invalidates every imported module, not just
 * the entry points listed in the layout.
 *
 * A worker left over from an older build adopts the version of a newer page
 * from its versioned core head assets, until the new worker takes over.
 *
 * Intentionally tiny: no Cache Storage, no offline support, no API routing.
 */

let appVersion = new URL(self.location.href).searchParams.get('v') || '';

const ASSET_PATH_PATTERN = /\/(modules|plugins)\//;
const CORE_ASSET_PATTERN = /\/modules\/system\/assets\//;
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
        if (CORE_ASSET_PATTERN.test(url.pathname)) {
            appVersion = url.searchParams.get('v');
        }

        return;
    }

    if (!VERSIONABLE_EXT.test(url.pathname)) {
        return;
    }

    if (!ASSET_PATH_PATTERN.test(url.pathname)) {
        return;
    }

    url.searchParams.set('v', appVersion);

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
