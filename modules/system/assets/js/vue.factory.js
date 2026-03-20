/**
 * Vue 3 Application Factory
 *
 * Creates pre-configured Vue app instances with globally registered
 * components and directives.
 */

/**
 * Creates a Vue 3 app with all registered components and directives.
 * @param {Object} options - Vue app options (data, methods, etc.)
 * @returns {Object} Vue app instance (call .mount() to mount)
 */
export function createOctoberApp(options = {}) {
    const app = Vue.createApp(options);

    // Register all globally registered components
    if (window.oc && window.oc.vueComponents) {
        for (const [name, component] of Object.entries(window.oc.vueComponents)) {
            app.component(name, component);
        }
    }

    // Register all globally registered directives
    if (window.oc && window.oc.vueDirectives) {
        for (const [name, directive] of Object.entries(window.oc.vueDirectives)) {
            app.directive(name, directive);
        }
    }

    return app;
}

/**
 * Creates and mounts a Vue 3 app in one step.
 * @param {string|Element} container - Mount target (selector or element)
 * @param {Object} options - Vue app options (data, methods, etc.)
 * @returns {Object} Object with { app, vm } - the app and mounted instance
 */
export function mountOctoberApp(container, options = {}) {
    // Get the actual element
    const element = typeof container === 'string'
        ? document.querySelector(container)
        : container;

    // Check for <template> child element (Vue 2 compatibility)
    // In Vue 2, mounting to an element containing <template> would use that template.
    // In Vue 3, we need to extract the template content explicitly.
    const templateEl = element?.querySelector(':scope > template');
    if (templateEl) {
        // Use the template's innerHTML as the app template
        options.template = templateEl.innerHTML;
    }

    const app = createOctoberApp(options);
    const vm = app.mount(container);
    return { app, vm };
}

// Expose globally for non-module contexts
if (!window.oc) window.oc = {};
window.oc.createVueApp = createOctoberApp;
window.oc.mountVueApp = mountOctoberApp;
