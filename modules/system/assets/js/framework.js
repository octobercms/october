(() => {
  // ../../vendor/larajax/larajax/resources/src/util/index.js
  function dispatch(eventName, { target = document, detail = {}, bubbles = true, cancelable = true } = {}) {
    const event = new CustomEvent(eventName, { detail, bubbles, cancelable });
    target.dispatchEvent(event);
    return event;
  }
  function unindent(strings, ...values) {
    const lines = trimLeft(interpolate(strings, values)).split("\n");
    const match = lines[0].match(/^\s+/);
    const indent = match ? match[0].length : 0;
    return lines.map((line) => line.slice(indent)).join("\n");
  }
  function trimLeft(string) {
    return string.replace(/^\n/, "");
  }
  function interpolate(strings, values) {
    return strings.reduce((result, string, i) => {
      const value = values[i] == void 0 ? "" : values[i];
      return result + string + value;
    }, "");
  }

  // ../../vendor/larajax/larajax/resources/src/util/events.js
  var namespaceRegex = /[^.]*(?=\..*)\.|.*/;
  var stripNameRegex = /\..*/;
  var stripUidRegex = /::\d+$/;
  var eventRegistry = {};
  var uidEvent = 1;
  var customEvents = {
    mouseenter: "mouseover",
    mouseleave: "mouseout"
  };
  var nativeEvents = /* @__PURE__ */ new Set([
    "click",
    "dblclick",
    "mouseup",
    "mousedown",
    "contextmenu",
    "mousewheel",
    "DOMMouseScroll",
    "mouseover",
    "mouseout",
    "mousemove",
    "selectstart",
    "selectend",
    "keydown",
    "keypress",
    "keyup",
    "orientationchange",
    "touchstart",
    "touchmove",
    "touchend",
    "touchcancel",
    "pointerdown",
    "pointermove",
    "pointerup",
    "pointerleave",
    "pointercancel",
    "gesturestart",
    "gesturechange",
    "gestureend",
    "focus",
    "blur",
    "change",
    "reset",
    "select",
    "submit",
    "focusin",
    "focusout",
    "load",
    "unload",
    "beforeunload",
    "resize",
    "move",
    "DOMContentLoaded",
    "readystatechange",
    "error",
    "abort",
    "scroll"
  ]);
  var Events = class {
    static on(element, event, handler, delegationFunction, options) {
      addHandler(element, event, handler, delegationFunction, options, false);
    }
    static one(element, event, handler, delegationFunction, options) {
      addHandler(element, event, handler, delegationFunction, options, true);
    }
    static off(element, originalTypeEvent, handler, delegationFunction, options) {
      if (typeof originalTypeEvent !== "string" || !element) {
        return;
      }
      const [isDelegated, callable, typeEvent, opts] = normalizeParameters(originalTypeEvent, handler, delegationFunction, options);
      const inNamespace = typeEvent !== originalTypeEvent;
      const events = getElementEvents(element);
      const storeElementEvent = events[typeEvent] || {};
      const isNamespace = originalTypeEvent.startsWith(".");
      if (typeof callable !== "undefined") {
        if (!storeElementEvent) {
          return;
        }
        removeHandler(element, events, typeEvent, callable, isDelegated ? handler : null, opts);
        return;
      }
      if (isNamespace) {
        for (const elementEvent of Object.keys(events)) {
          removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
        }
      }
      for (const keyHandlers of Object.keys(storeElementEvent)) {
        const handlerKey = keyHandlers.replace(stripUidRegex, "");
        if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
          const event = storeElementEvent[keyHandlers];
          removeHandler(element, events, typeEvent, event.callable, event.delegationSelector, opts);
        }
      }
    }
    static dispatch(eventName, { target = document, detail = {}, bubbles = true, cancelable = true } = {}) {
      return dispatch(eventName, { target, detail, bubbles, cancelable });
    }
    static trigger(target, eventName, { detail = {}, bubbles = true, cancelable = true } = {}) {
      return dispatch(eventName, { target, detail, bubbles, cancelable });
    }
  };
  function makeEventUid(element, uid) {
    return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
  }
  function getElementEvents(element) {
    const uid = makeEventUid(element);
    element.uidEvent = uid;
    eventRegistry[uid] = eventRegistry[uid] || {};
    return eventRegistry[uid];
  }
  function findHandler(events, callable, delegationSelector = null) {
    return Object.values(events).find((event) => event.callable === callable && event.delegationSelector === delegationSelector);
  }
  function normalizeParameters(originalTypeEvent, handler, delegationFunction, options) {
    const isDelegated = typeof handler === "string";
    const callable = isDelegated ? delegationFunction : handler;
    const opts = isDelegated ? options : delegationFunction;
    let typeEvent = getTypeEvent(originalTypeEvent);
    if (!nativeEvents.has(typeEvent)) {
      typeEvent = originalTypeEvent;
    }
    return [isDelegated, callable, typeEvent, opts];
  }
  function addHandler(element, originalTypeEvent, handler, delegationFunction, options, oneOff) {
    if (typeof originalTypeEvent !== "string" || !element) {
      return;
    }
    let [isDelegated, callable, typeEvent, opts] = normalizeParameters(originalTypeEvent, handler, delegationFunction, options);
    if (originalTypeEvent in customEvents) {
      const wrapFunction = (fn2) => {
        return function(event) {
          if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
            return fn2.call(this, event);
          }
        };
      };
      callable = wrapFunction(callable);
    }
    const events = getElementEvents(element);
    const handlers = events[typeEvent] || (events[typeEvent] = {});
    const previousFunction = findHandler(handlers, callable, isDelegated ? handler : null);
    if (previousFunction) {
      previousFunction.oneOff = previousFunction.oneOff && oneOff;
      return;
    }
    const uid = makeEventUid(callable, originalTypeEvent.replace(namespaceRegex, ""));
    const fn = isDelegated ? internalDelegationHandler(element, handler, callable) : internalHandler(element, callable);
    fn.delegationSelector = isDelegated ? handler : null;
    fn.callable = callable;
    fn.oneOff = oneOff;
    fn.uidEvent = uid;
    handlers[uid] = fn;
    element.addEventListener(typeEvent, fn, opts);
  }
  function removeHandler(element, events, typeEvent, handler, delegationSelector, options) {
    const fn = findHandler(events[typeEvent], handler, delegationSelector);
    if (!fn) {
      return;
    }
    element.removeEventListener(typeEvent, fn, options);
    delete events[typeEvent][fn.uidEvent];
  }
  function internalHandler(element, fn) {
    return function handler(event) {
      event.delegateTarget = element;
      if (handler.oneOff) {
        Events.off(element, event.type, fn);
      }
      return fn.apply(element, [event]);
    };
  }
  function internalDelegationHandler(element, selector, fn) {
    return function handler(event) {
      const domElements = element.querySelectorAll(selector);
      for (let { target } = event; target && target !== this; target = target.parentNode) {
        for (const domElement of domElements) {
          if (domElement !== target) {
            continue;
          }
          event.delegateTarget = target;
          if (handler.oneOff) {
            Events.off(element, event.type, selector, fn);
          }
          return fn.apply(target, [event]);
        }
      }
    };
  }
  function removeNamespacedHandlers(element, events, typeEvent, namespace) {
    const storeElementEvent = events[typeEvent] || {};
    for (const handlerKey of Object.keys(storeElementEvent)) {
      if (handlerKey.includes(namespace)) {
        const event = storeElementEvent[handlerKey];
        removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
      }
    }
  }
  function getTypeEvent(event) {
    event = event.replace(stripNameRegex, "");
    return customEvents[event] || event;
  }

  // ../../vendor/larajax/larajax/resources/src/request/envelope.js
  var Envelope = class {
    constructor(response = {}, status = 200) {
      const {
        __ajax: body,
        ...data
      } = response;
      this.ok = !!body.ok;
      this.severity = body.severity || "info";
      this.message = body.message ?? null;
      this.data = data || {};
      this.invalid = body.invalid || {};
      this.ops = Array.isArray(body.ops) ? body.ops : [];
      this.redirect = null;
      this.status = status;
    }
    isFatal() {
      return this.severity === "fatal" || this.status >= 500 && this.status <= 599;
    }
    isError() {
      return this.severity === "error" || this.isFatal() || this.ok === false;
    }
    getMessage() {
      return this.message;
    }
    getInvalid() {
      return this.invalid || {};
    }
    getData() {
      return this.data || {};
    }
    getStatus() {
      return this.status;
    }
    getSeverity() {
      return this.severity;
    }
    getOps(type) {
      if (!type) {
        return this.ops;
      }
      return this.ops.filter((o) => o?.op === type);
    }
    getFlash() {
      return this.getOps("flash").map(({ level = "info", text = "" }) => ({ level, text }));
    }
    getBrowserEvents() {
      return this.getOps("dispatch").map(({ selector = null, event, detail, async }) => ({
        selector,
        event,
        detail,
        async
      }));
    }
    getDomPatches() {
      return this.getOps("patchDom").map(({ selector, html = "", swap = "update" }) => ({
        selector,
        html,
        swap
      }));
    }
    getPartials() {
      return this.getOps("partial").map(({ name, html = "" }) => ({ name, html }));
    }
    getAssets() {
      const out = { js: [], css: [], img: [] };
      const seen = { js: /* @__PURE__ */ new Set(), css: /* @__PURE__ */ new Set(), img: /* @__PURE__ */ new Set() };
      for (const { type, assets = [] } of this.getOps("loadAssets")) {
        if (!out[type]) {
          continue;
        }
        for (const asset of assets) {
          if (asset.inline) {
            out[type].push(asset);
            continue;
          }
          const url = typeof asset === "string" ? asset : asset.url;
          if (!seen[type].has(url)) {
            seen[type].add(url);
            out[type].push(typeof asset === "string" ? { url: asset } : asset);
          }
        }
      }
      return out;
    }
    getRedirectUrl() {
      const op = this.getOps("redirect")[0];
      return op?.url || this.redirect || null;
    }
    getReload() {
      return this.getOps("reload")[0] || null;
    }
  };

  // ../../vendor/larajax/larajax/resources/src/request/options.js
  var Options = class {
    constructor(handler, options) {
      if (!handler) {
        throw new Error("The request handler name is not specified.");
      }
      if (!handler.match(/^(?:\w+\:{2})?on*/)) {
        throw new Error('Invalid handler name. The correct handler name format is: "onEvent".');
      }
      if (typeof FormData === "undefined") {
        throw new Error("The browser does not support the FormData interface.");
      }
      this.options = options;
      this.handler = handler;
    }
    static fetch(handler, options) {
      return new this(handler, options).getRequestOptions();
    }
    // Public
    getRequestOptions() {
      return {
        method: "POST",
        url: this.options.url ? this.options.url : window.location.href,
        headers: this.buildHeaders()
      };
    }
    // Private
    buildHeaders() {
      const { handler, options } = this;
      const headers = {
        "X-Requested-With": "XMLHttpRequest",
        "X-AJAX-HANDLER": handler
      };
      if (!options.files) {
        headers["Content-Type"] = options.bulk ? "application/json" : "application/x-www-form-urlencoded";
      }
      if (options.flash) {
        headers["X-AJAX-FLASH"] = 1;
      }
      if (options.partial) {
        headers["X-AJAX-PARTIAL"] = options.partial;
      }
      var partials = this.extractPartials(options.update, options.partial);
      if (partials) {
        headers["X-AJAX-PARTIALS"] = partials;
      }
      var xsrfToken = this.getXSRFToken();
      if (xsrfToken) {
        headers["X-XSRF-TOKEN"] = xsrfToken;
      }
      var csrfToken = this.getCSRFToken();
      if (csrfToken) {
        headers["X-CSRF-TOKEN"] = csrfToken;
      }
      if (options.headers && options.headers.constructor === {}.constructor) {
        Object.assign(headers, options.headers);
      }
      return headers;
    }
    extractPartials(update = {}, selfPartial) {
      var result = [];
      if (update) {
        if (typeof update !== "object") {
          throw new Error("Invalid update value. The correct format is an object ({...})");
        }
        for (var partial in update) {
          if (partial === "_self" && selfPartial) {
            result.push(selfPartial);
          } else {
            result.push(partial);
          }
        }
      }
      return result.join("&");
    }
    getCSRFToken() {
      var tag = document.querySelector('meta[name="csrf-token"]');
      return tag ? tag.getAttribute("content") : null;
    }
    getXSRFToken() {
      var cookieValue = null;
      if (document.cookie && document.cookie != "") {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
          var cookie = cookies[i].replace(/^([\s]*)|([\s]*)$/g, "");
          if (cookie.substring(0, 11) == "XSRF-TOKEN=") {
            cookieValue = decodeURIComponent(cookie.substring(11));
            break;
          }
        }
      }
      return cookieValue;
    }
  };

  // ../../vendor/larajax/larajax/resources/src/request/asset-manager.js
  var AssetManager = class _AssetManager {
    /**
     * Load a collection of assets.
     * @param {{js?: Array<string|{url: string, attributes?: object}>, css?: Array<string|{url: string, attributes?: object}>, img?: Array<string|{url: string, attributes?: object}>}} collection
     * @param {(err?: Error) => void} [callback]  // optional; called on success or with error
     * @returns {Promise<void>}
     */
    static load(collection = {}, callback) {
      const manager = new _AssetManager(), promise = manager.loadCollection(collection);
      if (typeof callback === "function") {
        promise.then(() => callback());
      }
      return promise;
    }
    async loadCollection(collection = {}) {
      const jsList = (collection.js ?? []).map(normalizeAsset).filter((asset) => asset.inline || !document.querySelector(`head script[src="${htmlEscape(asset.url)}"]`));
      const cssList = (collection.css ?? []).map(normalizeAsset).filter((asset) => !document.querySelector(`head link[href="${htmlEscape(asset.url)}"]`));
      const imgList = (collection.img ?? []).map(normalizeAsset);
      if (!jsList.length && !cssList.length && !imgList.length) {
        return;
      }
      await Promise.all([
        this.loadJavaScript(jsList),
        Promise.all(cssList.map((asset) => this.loadStyleSheet(asset))),
        this.loadImages(imgList)
      ]);
    }
    loadStyleSheet(asset) {
      const { url, attributes = {} } = asset;
      return new Promise((resolve, reject) => {
        const el = document.createElement("link");
        el.rel = "stylesheet";
        el.type = "text/css";
        el.href = url;
        for (const [key, value] of Object.entries(attributes)) {
          if (value === true) {
            el.setAttribute(key, "");
          } else if (value !== false && value != null) {
            el.setAttribute(key, value);
          }
        }
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error(`Failed to load CSS: ${url}`));
        document.head.appendChild(el);
      });
    }
    // Sequential loading (safer for dependencies)
    loadJavaScript(list) {
      return list.reduce((p, asset) => {
        if (asset.inline) {
          return p.then(() => new Promise((resolve, reject) => {
            const el = document.createElement("script");
            const attributes2 = asset.attributes || {};
            if (attributes2.type) {
              el.type = attributes2.type;
            }
            for (const [key, value] of Object.entries(attributes2)) {
              if (key === "type") continue;
              if (value === true) el.setAttribute(key, "");
              else if (value !== false && value != null) el.setAttribute(key, value);
            }
            if (el.type === "module") {
              const id = "_lj" + ++inlineModuleId;
              window[id] = () => {
                delete window[id];
                resolve(el);
              };
              el.textContent = asset.inline + `
window['${id}']();`;
            } else {
              el.textContent = asset.inline;
            }
            document.head.appendChild(el);
            if (el.type !== "module") {
              resolve(el);
            }
          }));
        }
        const { url, attributes = {} } = asset;
        return p.then(() => new Promise((resolve, reject) => {
          const el = document.createElement("script");
          if (attributes.type) {
            el.type = attributes.type;
          } else {
            el.type = "text/javascript";
          }
          el.src = url;
          for (const [key, value] of Object.entries(attributes)) {
            if (key === "type") continue;
            if (value === true) {
              el.setAttribute(key, "");
            } else if (value !== false && value != null) {
              el.setAttribute(key, value);
            }
          }
          el.onload = () => resolve(el);
          el.onerror = () => reject(new Error(`Failed to load JS: ${url}`));
          document.head.appendChild(el);
        }));
      }, Promise.resolve());
    }
    loadImages(list) {
      if (!list.length) return Promise.resolve();
      return Promise.all(list.map((asset) => new Promise((resolve, reject) => {
        const { url } = asset;
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        img.src = url;
      })));
    }
  };
  var inlineModuleId = 0;
  function normalizeAsset(asset) {
    return typeof asset === "string" ? { url: asset } : asset;
  }
  function htmlEscape(value) {
    return String(value).replace(/"/g, '\\"');
  }

  // ../../vendor/larajax/larajax/resources/src/request/dom-patcher.js
  var DomUpdateMode = {
    replace: "replace",
    prepend: "prepend",
    append: "append",
    update: "update"
  };
  var DomPatcher = class {
    constructor(envelope, partialMap, options = {}) {
      this.options = options;
      this.envelope = envelope;
      this.partialMap = partialMap;
      this.afterUpdateCallback = null;
    }
    apply() {
      this.applyPartialUpdates();
      this.applyDomUpdates();
    }
    afterUpdate(callback) {
      this.afterUpdateCallback = callback;
    }
    // Should patch the dom using the envelope.getPartials()
    // which is expected to be { name: partialName, html: contents }
    applyPartialUpdates() {
      const partials = this.envelope.getPartials();
      partials.forEach((partial) => {
        let selector = this.partialMap[partial.name];
        let selectedEl = [];
        if (this.partialMap["_self"] && partial.name == this.options.partial && this.options.partialEl) {
          selector = this.partialMap["_self"];
          selectedEl = [this.options.partialEl];
        } else if (selector) {
          selectedEl = resolveSelectorResponse(selector, '[data-ajax-partial="' + partial.name + '"]');
        }
        selectedEl.forEach((el) => {
          this.patchDom(
            el,
            partial.html,
            getSelectorUpdateMode(selector, el)
          );
        });
      });
    }
    // Should patch the dom using the envelope.getDomPatches()
    applyDomUpdates() {
      const updates = this.envelope.getDomPatches();
      updates.forEach((update) => {
        document.querySelectorAll(update.selector).forEach((el) => {
          this.patchDom(el, update.html, update.swap);
        });
      });
    }
    patchDom(element, content, swapType) {
      const parentEl = element.parentNode;
      switch (swapType) {
        case "append":
        case "beforeend":
          element.insertAdjacentHTML("beforeend", content);
          runScriptsOnFragment(element, content);
          break;
        case "after":
        case "afterend":
          element.insertAdjacentHTML("afterend", content);
          runScriptsOnFragment(element, content);
          break;
        case "before":
        case "beforebegin":
          element.insertAdjacentHTML("beforebegin", content);
          runScriptsOnFragment(element, content);
          break;
        case "prepend":
        case "afterbegin":
          element.insertAdjacentHTML("afterbegin", content);
          runScriptsOnFragment(element, content);
          break;
        case "replace":
        case "outerHTML":
          element.outerHTML = content;
          runScriptsOnFragment(parentEl, content);
          break;
        default:
        case "update":
        case "innerHTML":
          element.innerHTML = content;
          runScriptsOnElement(element);
          break;
      }
      if (this.afterUpdateCallback) {
        this.afterUpdateCallback(element);
      }
    }
  };
  function resolveSelectorResponse(selector, partialSelector) {
    if (selector === true) {
      return document.querySelectorAll(partialSelector);
    }
    if (typeof selector !== "string") {
      return [selector];
    }
    if (["#", ".", "@", "^", "!", "="].indexOf(selector.charAt(0)) === -1) {
      return [];
    }
    if (["@", "^", "!", "="].indexOf(selector.charAt(0)) !== -1) {
      selector = selector.substring(1);
    }
    if (!selector) {
      selector = partialSelector;
    }
    return document.querySelectorAll(selector);
  }
  function getSelectorUpdateMode(selector, el) {
    if (typeof selector === "string") {
      if (selector.charAt(0) === "!") {
        return DomUpdateMode.replace;
      }
      if (selector.charAt(0) === "@") {
        return DomUpdateMode.append;
      }
      if (selector.charAt(0) === "^") {
        return DomUpdateMode.prepend;
      }
    }
    if (el.dataset.ajaxUpdateMode !== void 0) {
      return el.dataset.ajaxUpdateMode;
    }
    return DomUpdateMode.update;
  }
  function runScriptsOnElement(el) {
    Array.from(el.querySelectorAll("script")).forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value));
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  }
  function runScriptsOnFragment(container, html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    Array.from(div.querySelectorAll("script")).forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value));
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      container.appendChild(newScript);
      container.removeChild(newScript);
    });
  }

  // ../../vendor/larajax/larajax/resources/src/util/turbo.js
  var _turboProvider = null;
  function registerTurbo(turbo) {
    _turboProvider = turbo;
  }
  function isTurboEnabled() {
    return _turboProvider?.isEnabled() ?? false;
  }
  function turboVisit(url, options) {
    if (_turboProvider) {
      _turboProvider.visit(url, options);
      return true;
    }
    return false;
  }
  function getTurboController() {
    return _turboProvider?.controller ?? null;
  }
  function turboPageReady() {
    return _turboProvider?.pageReady() ?? null;
  }

  // ../../vendor/larajax/larajax/resources/src/util/referrer.js
  function getReferrerUrl() {
    const url = isTurboEnabled() ? getTurboController().getLastVisitUrl() : getReferrerFromSameOrigin();
    if (!url || isSameBaseUrl(url)) {
      return null;
    }
    return url;
  }
  function getReferrerFromSameOrigin() {
    if (!document.referrer) {
      return null;
    }
    try {
      const referrer = new URL(document.referrer);
      if (referrer.origin !== location.origin) {
        return null;
      }
      const pushReferrer = localStorage.getItem("ocPushStateReferrer");
      if (pushReferrer && pushReferrer.indexOf(referrer.pathname) === 0) {
        return pushReferrer;
      }
      return document.referrer;
    } catch (e) {
    }
  }
  function isSameBaseUrl(url) {
    const givenUrl = new URL(url, window.location.origin), currentUrl = new URL(window.location.href);
    return givenUrl.origin === currentUrl.origin && givenUrl.pathname === currentUrl.pathname;
  }

  // ../../vendor/larajax/larajax/resources/src/util/promise.js
  function decoratePromiseProxy(fn, ctx = null) {
    return (...args) => {
      const p = Promise.resolve().then(() => fn.apply(ctx, args));
      return decoratePromise(p);
    };
  }
  function decoratePromise(promise) {
    return Object.assign(promise, {
      done(fn) {
        promise.then(fn);
        return this;
      },
      fail(fn) {
        promise.catch(fn);
        return this;
      },
      always(fn) {
        promise.finally(fn);
        return this;
      }
    });
  }
  function cancellablePromise(executor) {
    if (!executor) {
      executor = () => {
      };
    }
    let hasCanceled = false;
    let cancelHandler = () => {
    };
    let resolveFn, rejectFn;
    const promise = new Promise((resolve, reject) => {
      resolveFn = resolve;
      rejectFn = reject;
      executor(
        (value) => {
          if (!hasCanceled) resolve(value);
        },
        (error) => {
          if (!hasCanceled) reject(error);
        },
        (onCancel) => {
          cancelHandler = onCancel;
        }
      );
    });
    promise.abort = () => {
      hasCanceled = true;
      cancelHandler();
    };
    promise.cancel = promise.abort;
    promise.onCancel = (fn) => {
      cancelHandler = typeof fn === "function" ? fn : cancelHandler;
      return promise;
    };
    promise.resolve = (value) => {
      if (!hasCanceled) {
        resolveFn(value);
      }
    };
    promise.reject = (error) => {
      if (!hasCanceled) {
        rejectFn(error);
      }
    };
    return decoratePromise(promise);
  }

  // ../../vendor/larajax/larajax/resources/src/request/actions.js
  var Actions = class {
    constructor(delegate, context, options) {
      this.el = delegate.el;
      this.delegate = delegate;
      this.context = context;
      this.options = options;
      this.context.start = this.start.bind(this);
      this.context.success = decoratePromiseProxy(this.success, this);
      this.context.error = decoratePromiseProxy(this.error, this);
      this.context.complete = decoratePromiseProxy(this.complete, this);
      this.context.cancel = this.cancel.bind(this);
      this.context.handleErrorMessage = this.handleErrorMessage.bind(this);
    }
    // Options can override all public methods in this class
    invoke(method, args = []) {
      if (this.options[method]) {
        return this.options[method].apply(this.context, args);
      }
      if (this[method]) {
        return this[method](...args);
      }
    }
    // Options can also specify a non-interference "func" method, typically
    // used by eval-based data attributes that takes minimal arguments
    invokeFunc(method, data = null) {
      if (this.options[method]) {
        return this.options[method](this.el, this.context, data);
      }
    }
    // Public
    start(xhr) {
      this.invoke("markAsUpdating", [true]);
      if (this.delegate.options.message) {
        this.invoke("handleProgressMessage", [this.delegate.options.message, false]);
      }
    }
    async success(data, responseCode, xhr) {
      if (this.invoke("beforeUpdate", [data, responseCode, xhr]) === false) {
        return;
      }
      if (this.invokeFunc("beforeUpdateFunc", data) === false) {
        return;
      }
      if (!this.delegate.applicationAllowsUpdate(data, responseCode, xhr)) {
        return;
      }
      if (data instanceof Blob) {
        this.invoke("handleFileDownload", [data, xhr]);
        this.delegate.notifyApplicationRequestSuccess(data, responseCode, xhr);
        this.invokeFunc("successFunc", data);
        return;
      }
      if (!data.$env?.isFatal()) {
        await this.invoke("handleUpdateOperations", [data, responseCode, xhr]);
        await this.invoke("handleUpdateResponse", [data, responseCode, xhr]);
      }
      this.delegate.notifyApplicationRequestSuccess(data, responseCode, xhr);
      this.invokeFunc("successFunc", data);
    }
    async error(data, responseCode, xhr) {
      let errorMsg = data.$env?.getMessage();
      if (window.jaxUnloading !== void 0 && window.jaxUnloading) {
        return;
      }
      this.delegate.toggleRedirect(false);
      if (!data.$env?.isFatal()) {
        await this.invoke("handleUpdateOperations", [data, responseCode, xhr]);
        await this.invoke("handleUpdateResponse", [data, responseCode, xhr]);
      } else if (!errorMsg) {
        if (data.constructor === {}.constructor) {
          if (data.message) {
            errorMsg = data.message;
          } else {
            errorMsg = "Something went wrong! Check the browser console.";
            console.warn(data);
          }
        } else {
          errorMsg = data;
        }
      }
      if (this.el !== document) {
        this.el.setAttribute("data-error-message", errorMsg);
      }
      if (!this.delegate.applicationAllowsError(data, responseCode, xhr)) {
        return;
      }
      if (this.invokeFunc("errorFunc", data) === false) {
        return;
      }
      this.invoke("handleErrorMessage", [errorMsg, data.$env?.getSeverity()]);
    }
    async complete(data, responseCode, xhr) {
      this.delegate.notifyApplicationRequestComplete(data, responseCode, xhr);
      this.invokeFunc("completeFunc", data);
      this.invoke("markAsUpdating", [false]);
      if (this.delegate.options.message) {
        this.invoke("handleProgressMessage", [null, true]);
      }
    }
    cancel() {
      this.invokeFunc("cancelFunc");
      this.delegate.notifyApplicationRequestCancel();
    }
    // Custom function, requests confirmation from the user
    handleConfirmMessage(message) {
      let resolveFn, rejectFn;
      const promise = new Promise((resolve, reject) => {
        resolveFn = resolve;
        rejectFn = reject;
      });
      promise.then(() => {
        this.delegate.sendInternal();
      }).catch(() => {
        this.invoke("cancel", []);
      });
      const event = this.delegate.notifyApplicationConfirmMessage(message, {
        resolve: resolveFn,
        reject: rejectFn
      });
      if (event.defaultPrevented) {
        return false;
      }
      if (message) {
        const result = confirm(message);
        if (!result) {
          this.invoke("cancel", []);
        }
        return result;
      }
    }
    // Custom function, display a progress message to the user
    handleProgressMessage(message, isDone) {
    }
    // Custom function, display a flash message to the user
    handleFlashMessage(message, type) {
    }
    // Custom function, display an error message to the user
    handleErrorMessage(message, severity) {
      const event = this.delegate.notifyApplicationErrorMessage(message);
      if (event.defaultPrevented) {
        return;
      }
      if (message) {
        alert(message);
      }
    }
    // Custom function, focus fields with errors
    handleValidationMessage(message, fields) {
      this.delegate.notifyApplicationBeforeValidate(message, fields);
      if (!this.delegate.formEl) {
        return;
      }
      var isFirstInvalidField = true;
      for (var fieldName in fields) {
        var fieldCheck, fieldNameOptions = [];
        fieldCheck = fieldName.replace(/\.(\w+)/g, "[$1]");
        fieldNameOptions.push('[name="' + fieldCheck + '"]:not([disabled])');
        fieldNameOptions.push('[name="' + fieldCheck + '[]"]:not([disabled])');
        fieldCheck = ("." + fieldName).replace(/\.(\w+)/g, "[$1]");
        fieldNameOptions.push('[name$="' + fieldCheck + '"]:not([disabled])');
        fieldNameOptions.push('[name$="' + fieldCheck + '[]"]:not([disabled])');
        var fieldEmpty = fieldName.replace(/\.[0-9]+$/g, "");
        if (fieldName !== fieldEmpty) {
          fieldCheck = fieldEmpty.replace(/\.(\w+)/g, "[$1]");
          fieldNameOptions.push('[name="' + fieldCheck + '[]"]:not([disabled])');
          fieldCheck = ("." + fieldEmpty).replace(/\.(\w+)/g, "[$1]");
          fieldNameOptions.push('[name$="' + fieldCheck + '[]"]:not([disabled])');
        }
        var fieldElement = this.delegate.formEl.querySelector(fieldNameOptions.join(", "));
        if (fieldElement) {
          let event = this.delegate.notifyApplicationFieldInvalid(fieldElement, fieldName, fields[fieldName], isFirstInvalidField);
          if (isFirstInvalidField) {
            if (!event.defaultPrevented) {
              fieldElement.focus();
            }
            isFirstInvalidField = false;
          }
        }
      }
    }
    // Custom function: handle browser events coming from the server
    async handleBrowserEvents(events = []) {
      if (!events.length) {
        return false;
      }
      let defaultPrevented = false;
      for (const dispatched of events) {
        const isAsync = dispatched?.async === true;
        if (isAsync) {
          await new Promise((outerResolve, outerReject) => {
            let settled = false;
            const resolve = (v) => {
              if (!settled) {
                settled = true;
                outerResolve(v);
              }
            };
            const reject = (e) => {
              if (!settled) {
                settled = true;
                outerReject(e);
              }
            };
            const event = this.delegate.notifyApplicationCustomEvent(dispatched.event, {
              ...dispatched.detail || {},
              context: this.context,
              promise: { resolve, reject }
            });
            if (event?.defaultPrevented) {
              defaultPrevented = true;
            }
          });
        } else {
          const event = this.delegate.notifyApplicationCustomEvent(dispatched.event, {
            ...dispatched.detail || {},
            context: this.context
          });
          if (event?.defaultPrevented) defaultPrevented = true;
        }
      }
      return defaultPrevented;
    }
    // Custom function, redirect the browser to another location
    handleRedirectResponse(href) {
      const event = this.delegate.notifyApplicationBeforeRedirect();
      if (event.defaultPrevented) {
        return;
      }
      if (this.options.browserRedirectBack) {
        href = getReferrerUrl() || href;
      }
      if (isTurboEnabled()) {
        turboVisit(href);
      } else {
        location.assign(href);
      }
    }
    // Custom function, reload the browser
    handleReloadResponse() {
      location.reload();
    }
    // Mark known elements as being updated
    markAsUpdating(isUpdating) {
      var updateOptions = this.options.update || {};
      for (var partial in updateOptions) {
        let selector = updateOptions[partial];
        let selectedEl = [];
        if (updateOptions["_self"] && partial == this.options.partial && this.delegate.partialEl) {
          selector = updateOptions["_self"];
          selectedEl = [this.delegate.partialEl];
        } else {
          selectedEl = resolveSelectorResponse(selector, '[data-ajax-partial="' + partial + '"]');
        }
        selectedEl.forEach(function(el) {
          if (isUpdating) {
            el.setAttribute("data-ajax-updating", "");
          } else {
            el.removeAttribute("data-ajax-updating");
          }
        });
      }
    }
    async handleUpdateResponse(data, responseCode, xhr) {
      if (!data.$env) {
        return;
      }
      const updateOptions = this.options.update || {}, domPatcher = new DomPatcher(data.$env, updateOptions, {
        partial: this.options.partial,
        partialEl: this.delegate.partialEl
      });
      domPatcher.afterUpdate((el) => {
        this.delegate.notifyApplicationAjaxUpdate(el, data, responseCode, xhr);
      });
      domPatcher.apply();
      setTimeout(() => {
        this.delegate.notifyApplicationUpdateComplete(data, responseCode, xhr);
        this.invoke("afterUpdate", [data, responseCode, xhr]);
        this.invokeFunc("afterUpdateFunc", data);
      }, 0);
    }
    async handleUpdateOperations(data, responseCode, xhr) {
      const flashMessages = this.delegate.options.flash ? data.$env?.getFlash() : null;
      if (flashMessages) {
        for (const flashMessage of flashMessages) {
          this.invoke("handleFlashMessage", [flashMessage.text, flashMessage.level]);
        }
      }
      const browserEvents = data.$env?.getBrowserEvents();
      if (browserEvents && await this.invoke("handleBrowserEvents", [browserEvents])) {
        return;
      }
      const redirectUrl = data.$env?.getRedirectUrl();
      if (redirectUrl) {
        this.delegate.toggleRedirect(redirectUrl);
      }
      if (this.delegate.isRedirect) {
        this.invoke("handleRedirectResponse", [this.delegate.options.redirect]);
      }
      if (data.$env?.getReload()) {
        this.invoke("handleReloadResponse");
      }
      const invalidFields = data.$env?.getInvalid();
      if (invalidFields) {
        this.invoke("handleValidationMessage", [data.$env?.getMessage(), invalidFields]);
      }
      const loadAssets = data.$env?.getAssets();
      if (loadAssets) {
        await AssetManager.load(loadAssets);
      }
    }
    // Custom function, download a file response from the server
    handleFileDownload(data, xhr) {
      if (this.options.browserTarget) {
        window.open(window.URL.createObjectURL(data), this.options.browserTarget);
        return;
      }
      const fileName = getFilenameFromHttpResponse(xhr);
      if (!fileName) {
        return;
      }
      const anchor = document.createElement("a");
      anchor.href = window.URL.createObjectURL(data);
      anchor.download = fileName;
      anchor.target = "_blank";
      anchor.click();
      window.URL.revokeObjectURL(anchor.href);
    }
    // Custom function, adds query data to the current URL
    applyQueryToUrl(queryData) {
      const searchParams = new URLSearchParams(window.location.search);
      for (const key of Object.keys(queryData)) {
        const value = queryData[key];
        if (Array.isArray(value)) {
          searchParams.delete(key);
          searchParams.delete(`${key}[]`);
          value.forEach((val) => searchParams.append(`${key}[]`, val));
        } else if (value === null) {
          searchParams.delete(key);
          searchParams.delete(`${key}[]`);
        } else {
          searchParams.set(key, value);
        }
      }
      var newUrl = window.location.pathname, queryStr = searchParams.toString();
      if (queryStr) {
        newUrl += "?" + queryStr.replaceAll("%5B%5D=", "[]=");
      }
      if (isTurboEnabled()) {
        turboVisit(newUrl, { action: "swap", scroll: false });
      } else {
        history.replaceState(null, "", newUrl);
        localStorage.setItem("ocPushStateReferrer", newUrl);
      }
    }
  };
  function getFilenameFromHttpResponse(xhr) {
    const contentDisposition = xhr.getResponseHeader("Content-Disposition");
    if (!contentDisposition) {
      return null;
    }
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/g;
    let match = null;
    let tmpMatch = null;
    while ((tmpMatch = filenameRegex.exec(contentDisposition)) !== null) {
      match = tmpMatch;
    }
    if (match !== null && match[1]) {
      return /filename[^;*=\n]*\*=[^']*''/.exec(match[0]) === null ? match[1].replace(/['"]/g, "") : decodeURIComponent(match[1].substring(match[1].indexOf("''") + 2));
    }
    return null;
  }

  // ../../vendor/larajax/larajax/resources/src/util/form-serializer.js
  var FormSerializer = class _FormSerializer {
    // Public
    static assignToObj(obj, name, value) {
      new _FormSerializer().assignObjectInternal(obj, name, value);
    }
    static serializeAsJSON(element) {
      if (typeof element === "string") {
        element = document.querySelector(element);
      }
      return new _FormSerializer().parseContainer(element);
    }
    // Private
    parseContainer(element) {
      let jsonData = {};
      element.querySelectorAll("input, textarea, select").forEach((field) => {
        if (!field.name || field.disabled || ["file", "reset", "submit", "button"].indexOf(field.type) > -1) {
          return;
        }
        if (["checkbox", "radio"].indexOf(field.type) > -1 && !field.checked) {
          return;
        }
        if (field.type === "select-multiple") {
          var arr = [];
          Array.from(field.options).forEach(function(option) {
            if (option.selected) {
              arr.push({
                name: field.name,
                value: option.value
              });
            }
          });
          this.assignObjectInternal(jsonData, field.name, arr);
          return;
        }
        this.assignObjectInternal(jsonData, field.name, field.value);
      });
      return jsonData;
    }
    assignObjectInternal(obj, fieldName, fieldValue) {
      this.assignObjectNested(
        obj,
        this.nameToArray(fieldName),
        fieldValue,
        fieldName.endsWith("[]")
      );
    }
    assignObjectNested(obj, fieldArr, fieldValue, isArray) {
      var currentTarget = obj, lastIndex = fieldArr.length - 1;
      fieldArr.forEach(function(prop, index) {
        if (isArray && index === lastIndex) {
          if (!Array.isArray(currentTarget[prop])) {
            currentTarget[prop] = [];
          }
          if (Array.isArray(fieldValue)) {
            currentTarget[prop].push(...fieldValue);
          } else {
            currentTarget[prop].push(fieldValue);
          }
        } else {
          if (currentTarget[prop] === void 0 || currentTarget[prop].constructor !== {}.constructor) {
            currentTarget[prop] = {};
          }
          if (index === lastIndex) {
            currentTarget[prop] = fieldValue;
          }
          currentTarget = currentTarget[prop];
        }
      });
    }
    nameToArray(fieldName) {
      var expression = /([^\]\[]+)/g, elements = [], searchResult;
      while (searchResult = expression.exec(fieldName)) {
        elements.push(searchResult[0]);
      }
      return elements;
    }
  };

  // ../../vendor/larajax/larajax/resources/src/request/data.js
  var Data = class {
    constructor(userData, targetEl, formEl) {
      this.userData = userData || {};
      this.targetEl = targetEl;
      this.formEl = formEl;
    }
    // Public
    getRequestData() {
      let requestData;
      if (this.formEl) {
        requestData = new FormData(this.formEl);
      } else {
        requestData = new FormData();
      }
      this.appendSingleInputElement(requestData);
      return requestData;
    }
    getAsFormData() {
      return this.appendJsonToFormData(
        this.getRequestData(),
        this.userData
      );
    }
    getAsQueryString() {
      return this.convertFormDataToQuery(
        this.getAsFormData()
      );
    }
    getAsJsonData() {
      return JSON.stringify(
        this.convertFormDataToJson(
          this.getAsFormData()
        )
      );
    }
    // Private
    appendSingleInputElement(requestData) {
      if (this.formEl || !this.targetEl || !isElementInput(this.targetEl)) {
        return;
      }
      const inputName = this.targetEl.name;
      if (!inputName || this.userData[inputName] !== void 0) {
        return;
      }
      if (this.targetEl.type === "file") {
        this.targetEl.files.forEach(function(value) {
          requestData.append(inputName, value);
        });
      } else {
        requestData.append(inputName, this.targetEl.value);
      }
    }
    appendJsonToFormData(formData, useJson, parentKey) {
      var self = this;
      for (var key in useJson) {
        var fieldKey = key;
        if (parentKey) {
          fieldKey = parentKey + "[" + key + "]";
        }
        var value = useJson[key];
        if (value && value.constructor === {}.constructor) {
          this.appendJsonToFormData(formData, value, fieldKey);
        } else if (value && value.constructor === [].constructor) {
          value.forEach(function(v, i) {
            if (v.constructor === {}.constructor || v.constructor === [].constructor) {
              self.appendJsonToFormData(formData, v, fieldKey + "[" + i + "]");
            } else {
              formData.append(fieldKey + "[]", self.castJsonToFormData(v));
            }
          });
        } else {
          formData.append(fieldKey, this.castJsonToFormData(value));
        }
      }
      return formData;
    }
    convertFormDataToQuery(formData) {
      let flatData = this.formDataToArray(formData);
      return Object.keys(flatData).map(function(key) {
        if (key.endsWith("[]")) {
          return flatData[key].map(function(val) {
            return encodeURIComponent(key) + "=" + encodeURIComponent(val);
          }).join("&");
        } else {
          return encodeURIComponent(key) + "=" + encodeURIComponent(flatData[key]);
        }
      }).join("&");
    }
    convertFormDataToJson(formData) {
      let flatData = this.formDataToArray(formData);
      let jsonData = {};
      for (var key in flatData) {
        FormSerializer.assignToObj(jsonData, key, flatData[key]);
      }
      return jsonData;
    }
    formDataToArray(formData) {
      return Object.fromEntries(
        Array.from(formData.keys()).map((key) => [
          key,
          key.endsWith("[]") ? formData.getAll(key) : formData.getAll(key).pop()
        ])
      );
    }
    castJsonToFormData(val) {
      if (val === null || val === void 0) {
        return "";
      }
      if (val === true) {
        return "1";
      }
      if (val === false) {
        return "0";
      }
      return val;
    }
  };
  function isElementInput(el) {
    return ["input", "select", "textarea"].includes((el.tagName || "").toLowerCase());
  }

  // ../../vendor/larajax/larajax/resources/src/util/http-request.js
  var SystemStatusCode = {
    networkFailure: 0,
    timeoutFailure: -1,
    contentTypeMismatch: -2,
    userAborted: -3
  };
  var HttpRequest = class {
    constructor(delegate, url, options) {
      this.failed = false;
      this.progress = 0;
      this.sent = false;
      this.aborted = false;
      this.timedOut = false;
      this.delegate = delegate;
      this.url = url;
      this.options = options;
      this.headers = options.headers || {};
      this.method = options.method || "GET";
      this.data = options.data;
      this.timeout = options.timeout || 0;
      this.controller = new AbortController();
      this.timeoutId = null;
      this.xhr = this.createXhrWrapper();
    }
    send() {
      if (this.sent) {
        return;
      }
      this.sent = true;
      this.notifyApplicationBeforeRequestStart();
      this.setProgress(0);
      this.delegate.requestStarted();
      if (this.timeout > 0) {
        this.timeoutId = setTimeout(() => {
          this.timedOut = true;
          this.controller.abort();
        }, this.timeout * 1e3);
      }
      this.performFetch();
    }
    async performFetch() {
      try {
        const response = await fetch(this.url, {
          method: this.method,
          headers: this.headers,
          body: this.data || null,
          signal: this.controller.signal
        });
        this.clearTimeout();
        this.updateXhrWrapper(response);
        await this.handleResponse(response);
      } catch (error) {
        this.clearTimeout();
        if (error.name === "AbortError") {
          if (this.timedOut) {
            this.handleTimeout();
          } else {
            this.handleAbort();
          }
        } else {
          this.handleNetworkError();
        }
      }
    }
    async handleResponse(response) {
      const contentType = response.headers.get("Content-Type");
      const contentDisposition = response.headers.get("Content-Disposition") || "";
      if (this.options.htmlOnly && !contentTypeIsHTML(contentType)) {
        this.failed = true;
        this.notifyApplicationAfterRequestEnd();
        this.delegate.requestFailedWithStatusCode(SystemStatusCode.contentTypeMismatch);
        this.destroy();
        return;
      }
      let responseData;
      if (contentDisposition.startsWith("attachment") || contentDisposition.startsWith("inline")) {
        responseData = await response.blob();
      } else if (contentTypeIsJSON(contentType)) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }
      if (response.status >= 200 && response.status < 300) {
        this.notifyApplicationAfterRequestEnd();
        this.delegate.requestCompletedWithResponse(
          responseData,
          response.status,
          this.getRedirectLocation(response)
        );
        this.destroy();
      } else {
        this.failed = true;
        this.notifyApplicationAfterRequestEnd();
        this.delegate.requestFailedWithStatusCode(response.status, responseData);
        this.destroy();
      }
    }
    getRedirectLocation(response) {
      const ajaxLocation = response.headers.get("X-AJAX-LOCATION");
      if (ajaxLocation) {
        return ajaxLocation;
      }
      var anchorMatch = this.url.match(/^(.*)#/), wantUrl = anchorMatch ? anchorMatch[1] : this.url;
      return wantUrl !== response.url ? response.url : null;
    }
    handleTimeout() {
      this.failed = true;
      this.notifyApplicationAfterRequestEnd();
      this.delegate.requestFailedWithStatusCode(SystemStatusCode.timeoutFailure);
      this.destroy();
    }
    handleAbort() {
      if (this.options.trackAbort) {
        this.failed = true;
        this.notifyApplicationAfterRequestEnd();
        this.delegate.requestFailedWithStatusCode(SystemStatusCode.userAborted);
      } else {
        this.notifyApplicationAfterRequestEnd();
      }
      this.destroy();
    }
    handleNetworkError() {
      this.failed = true;
      this.notifyApplicationAfterRequestEnd();
      this.delegate.requestFailedWithStatusCode(SystemStatusCode.networkFailure);
      this.destroy();
    }
    abort() {
      if (this.sent && !this.aborted) {
        this.aborted = true;
        this.controller.abort();
      }
    }
    clearTimeout() {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
    }
    // Application events
    notifyApplicationBeforeRequestStart() {
      Events.dispatch("ajax:request-start", { detail: { url: this.url, xhr: this.xhr }, cancelable: false });
    }
    notifyApplicationAfterRequestEnd() {
      Events.dispatch("ajax:request-end", { detail: { url: this.url, xhr: this.xhr }, cancelable: false });
    }
    // XHR compatibility wrapper
    createXhrWrapper() {
      return {
        status: 0,
        statusText: "",
        responseURL: this.url,
        getResponseHeader: (name) => null,
        getAllResponseHeaders: () => ""
      };
    }
    updateXhrWrapper(response) {
      this.xhr = {
        status: response.status,
        statusText: response.statusText,
        responseURL: response.url,
        getResponseHeader: (name) => response.headers.get(name),
        getAllResponseHeaders: () => [...response.headers].map(([k, v]) => `${k}: ${v}`).join("\r\n")
      };
    }
    setProgress(progress) {
      this.progress = progress;
      this.delegate.requestProgressed(progress);
    }
    destroy() {
      this.setProgress(1);
      this.delegate.requestFinished();
    }
  };
  function contentTypeIsHTML(contentType) {
    return (contentType || "").match(/^text\/html|^application\/xhtml\+xml/);
  }
  function contentTypeIsJSON(contentType) {
    return (contentType || "").includes("application/json");
  }

  // ../../vendor/larajax/larajax/resources/src/extras/progress-bar.js
  var ProgressBar = class _ProgressBar {
    static instance = null;
    static stylesheetReady = false;
    static animationDuration = 300;
    constructor() {
      this.stylesheetElement = this.createStylesheetElement();
      this.progressElement = this.createProgressElement();
      this.hiding = false;
      this.value = 0;
      this.visible = false;
      this.trickle = () => {
        this.setValue(this.value + Math.random() / 100);
      };
    }
    static get defaultCSS() {
      return unindent`
        .jax-progress-bar {
            position: fixed;
            display: block;
            top: 0;
            left: 0;
            height: 3px;
            background: #0076ff;
            z-index: 9999;
            transition:
                width ${_ProgressBar.animationDuration}ms ease-out,
                opacity ${_ProgressBar.animationDuration / 2}ms ${_ProgressBar.animationDuration / 2}ms ease-in;
            transform: translate3d(0, 0, 0);
        }
    `;
    }
    static get progressBar() {
      return {
        show: function() {
          const instance = getOrCreateInstance();
          instance.setValue(0);
          instance.show();
        },
        hide: function() {
          const instance = getOrCreateInstance();
          instance.setValue(100);
          instance.hide();
        }
      };
    }
    show(options = {}) {
      if (options.cssClass) {
        this.progressElement.classList.add(options.cssClass);
      }
      if (!this.visible) {
        this.visible = true;
        this.installStylesheetElement();
        this.installProgressElement();
        this.startTrickling();
      }
    }
    hide() {
      if (this.visible && !this.hiding) {
        this.hiding = true;
        this.fadeProgressElement(() => {
          this.uninstallProgressElement();
          this.stopTrickling();
          this.visible = false;
          this.hiding = false;
        });
      }
    }
    setValue(value) {
      this.value = value;
      this.refresh();
    }
    // Private
    installStylesheetElement() {
      if (!_ProgressBar.stylesheetReady) {
        document.head.insertBefore(this.stylesheetElement, document.head.firstChild);
        _ProgressBar.stylesheetReady = true;
      }
    }
    installProgressElement() {
      this.progressElement.style.width = "0";
      this.progressElement.style.opacity = "1";
      document.documentElement.insertBefore(this.progressElement, document.body);
      this.refresh();
    }
    fadeProgressElement(callback) {
      this.progressElement.style.opacity = "0";
      setTimeout(callback, _ProgressBar.animationDuration * 1.5);
    }
    uninstallProgressElement() {
      if (this.progressElement.parentNode) {
        document.documentElement.removeChild(this.progressElement);
      }
    }
    startTrickling() {
      if (!this.trickleInterval) {
        this.trickleInterval = setInterval(this.trickle, _ProgressBar.animationDuration);
      }
    }
    stopTrickling() {
      clearInterval(this.trickleInterval);
      delete this.trickleInterval;
    }
    refresh() {
      requestAnimationFrame(() => {
        this.progressElement.style.width = `${10 + this.value * 90}%`;
      });
    }
    createStylesheetElement() {
      const element = document.createElement("style");
      element.textContent = _ProgressBar.defaultCSS;
      return element;
    }
    createProgressElement() {
      const element = document.createElement("div");
      element.className = "jax-progress-bar";
      return element;
    }
  };
  function getOrCreateInstance() {
    if (!ProgressBar.instance) {
      ProgressBar.instance = new ProgressBar();
    }
    return ProgressBar.instance;
  }

  // ../../vendor/larajax/larajax/resources/src/request/request.js
  var Request = class _Request {
    constructor(element, handler, options) {
      this.el = element;
      this.handler = handler;
      this.options = { ...this.constructor.DEFAULTS, ...options || {} };
      this.context = { el: element, handler, options: this.options };
      this.progressBar = new ProgressBar();
      this.showProgressBar = () => {
        this.progressBar.show({ cssClass: "is-ajax" });
      };
    }
    static get DEFAULTS() {
      return {
        handler: null,
        update: {},
        files: false,
        bulk: false,
        browserTarget: null,
        browserValidate: false,
        browserRedirectBack: false,
        progressBarDelay: 500,
        progressBar: null
      };
    }
    start() {
      this.promise = cancellablePromise();
      if (!this.applicationAllowsSetup()) {
        return this.promise;
      }
      this.initOtherElements();
      this.preprocessOptions();
      this.actions = new Actions(this, this.context, this.options);
      if (this.actions.invokeFunc("beforeSendFunc") === false) {
        return this.promise;
      }
      if (!this.validateClientSideForm() || !this.applicationAllowsRequest()) {
        return this.promise;
      }
      if (this.options.confirm && !this.actions.invoke("handleConfirmMessage", [this.options.confirm])) {
        return this.promise;
      }
      this.sendInternal();
      return this.promise;
    }
    sendInternal() {
      const dataObj = new Data(this.options.data, this.el, this.formEl);
      let data;
      if (this.options.files) {
        data = dataObj.getAsFormData();
      } else if (this.options.bulk) {
        data = dataObj.getAsJsonData();
      } else {
        data = dataObj.getAsQueryString();
      }
      if (this.options.query) {
        this.actions.invoke("applyQueryToUrl", [
          this.options.query !== true ? this.options.query : JSON.parse(dataObj.getAsJsonData())
        ]);
      }
      const { url, headers, method } = Options.fetch(this.handler, this.options);
      this.request = new HttpRequest(this, url, { method, headers, data, trackAbort: true });
      this.isRedirect = this.options.redirect && this.options.redirect.length > 0;
      this.notifyApplicationBeforeSend();
      this.notifyApplicationAjaxPromise();
      this.promise.onCancel(() => {
        this.request.abort();
      }).then((data2) => {
        if (!this.isRedirect) {
          this.notifyApplicationAjaxDone(data2, data2.$status, data2.$xhr);
          this.notifyApplicationAjaxAlways(data2, data2.$status, data2.$xhr);
          this.notifyApplicationSendComplete(data2, data2.$status, data2.$xhr);
        }
      }).catch((data2) => {
        if (!this.isRedirect) {
          this.notifyApplicationAjaxFail(data2, data2.$status, data2.$xhr);
          this.notifyApplicationAjaxAlways(data2, data2.$status, data2.$xhr);
          this.notifyApplicationSendComplete(data2, data2.$status, data2.$xhr);
        }
      });
      this.request.send();
    }
    static send(handler, options) {
      return new _Request(document, handler, options).start();
    }
    static sendElement(element, handler, options) {
      if (typeof element === "string") {
        element = document.querySelector(element);
      }
      return new _Request(element, handler, options).start();
    }
    toggleRedirect(redirectUrl) {
      if (!redirectUrl) {
        this.options.redirect = null;
        this.isRedirect = false;
      } else {
        this.options.redirect = redirectUrl;
        this.isRedirect = true;
      }
    }
    applicationAllowsSetup() {
      const event = this.notifyApplicationAjaxSetup();
      return !event.defaultPrevented;
    }
    applicationAllowsRequest() {
      const event = this.notifyApplicationBeforeRequest();
      return !event.defaultPrevented;
    }
    applicationAllowsUpdate(data, responseCode, xhr) {
      const event = this.notifyApplicationBeforeUpdate(data, responseCode, xhr);
      return !event.defaultPrevented;
    }
    applicationAllowsError(message, responseCode, xhr) {
      const event = this.notifyApplicationRequestError(message, responseCode, xhr);
      return !event.defaultPrevented;
    }
    // Application events
    notifyApplicationAjaxSetup() {
      return dispatch("ajax:setup", { target: this.el, detail: { context: this.context } });
    }
    notifyApplicationAjaxPromise() {
      return dispatch("ajax:promise", { target: this.el, detail: { context: this.context } });
    }
    notifyApplicationAjaxFail(data, responseCode, xhr) {
      return dispatch("ajax:fail", { target: this.el, detail: { context: this.context, data, responseCode, xhr } });
    }
    notifyApplicationAjaxDone(data, responseCode, xhr) {
      return dispatch("ajax:done", { target: this.el, detail: { context: this.context, data, responseCode, xhr } });
    }
    notifyApplicationAjaxAlways(data, responseCode, xhr) {
      return dispatch("ajax:always", { target: this.el, detail: { context: this.context, data, responseCode, xhr } });
    }
    notifyApplicationAjaxUpdate(target, data, responseCode, xhr) {
      return dispatch("ajax:update", { target, detail: { context: this.context, data, responseCode, xhr } });
    }
    notifyApplicationBeforeRedirect() {
      return dispatch("ajax:before-redirect", { target: this.el });
    }
    // Container-based events
    notifyApplicationBeforeRequest() {
      return dispatch("ajax:before-request", { target: this.triggerEl, detail: { context: this.context } });
    }
    notifyApplicationBeforeUpdate(data, responseCode, xhr) {
      return dispatch("ajax:before-update", { target: this.triggerEl, detail: { context: this.context, data, responseCode, xhr } });
    }
    notifyApplicationRequestSuccess(data, responseCode, xhr) {
      return dispatch("ajax:request-success", { target: this.triggerEl, detail: { context: this.context, data, responseCode, xhr } });
    }
    notifyApplicationRequestError(message, responseCode, xhr) {
      return dispatch("ajax:request-error", { target: this.triggerEl, detail: { context: this.context, message, responseCode, xhr } });
    }
    notifyApplicationRequestComplete(data, responseCode, xhr) {
      return dispatch("ajax:request-complete", { target: this.triggerEl, detail: { context: this.context, data, responseCode, xhr } });
    }
    notifyApplicationRequestCancel() {
      return dispatch("ajax:request-cancel", { target: this.triggerEl, detail: { context: this.context } });
    }
    notifyApplicationBeforeValidate(message, fields) {
      return dispatch("ajax:before-validate", { target: this.triggerEl, detail: { context: this.context, message, fields } });
    }
    notifyApplicationBeforeReplace(target) {
      return dispatch("ajax:before-replace", { target });
    }
    // Window-based events
    notifyApplicationBeforeSend() {
      return dispatch("ajax:before-send", { target: window, detail: { context: this.context } });
    }
    notifyApplicationUpdateComplete(data, responseCode, xhr) {
      return dispatch("ajax:update-complete", { target: window, detail: { context: this.context, data, responseCode, xhr } });
    }
    notifyApplicationSendComplete(data, responseCode, xhr) {
      return dispatch("ajax:send-complete", { target: window, detail: { context: this.context, data, responseCode, xhr } });
    }
    notifyApplicationFieldInvalid(element, fieldName, errorMsg, isFirst) {
      return dispatch("ajax:invalid-field", { target: window, detail: { element, fieldName, errorMsg, isFirst } });
    }
    notifyApplicationConfirmMessage(message, promise) {
      return dispatch("ajax:confirm-message", { target: window, detail: { message, promise } });
    }
    notifyApplicationErrorMessage(message) {
      return dispatch("ajax:error-message", { target: window, detail: { message } });
    }
    notifyApplicationCustomEvent(name, data) {
      return dispatch(name, { target: this.el, detail: data });
    }
    // HTTP request delegate
    requestStarted() {
      this.markAsProgress(true);
      this.toggleLoadingElement(true);
      if (this.options.progressBar) {
        this.showProgressBarAfterDelay();
      }
      this.actions.invoke("start", [this.request.xhr]);
    }
    requestProgressed(progress) {
    }
    async requestCompletedWithResponse(response, statusCode) {
      const data = decorateResponse(response, statusCode, this.request.xhr);
      await this.actions.invoke("success", [data, statusCode, this.request.xhr]);
      await this.actions.invoke("complete", [data, statusCode, this.request.xhr]);
      this.promise.resolve(data);
    }
    async requestFailedWithStatusCode(statusCode, response) {
      const data = decorateResponse(response, statusCode, this.request.xhr);
      if (statusCode == SystemStatusCode.userAborted) {
        await this.actions.invoke("cancel", []);
      } else {
        await this.actions.invoke("error", [data, statusCode, this.request.xhr]);
      }
      await this.actions.invoke("complete", [data, statusCode, this.request.xhr]);
      this.promise.reject(data);
    }
    requestFinished() {
      this.markAsProgress(false);
      this.toggleLoadingElement(false);
      if (this.options.progressBar) {
        this.hideProgressBar();
      }
    }
    // Private
    initOtherElements() {
      if (typeof this.options.form === "string") {
        this.formEl = document.querySelector(this.options.form);
      } else if (this.options.form) {
        this.formEl = this.options.form;
      } else {
        this.formEl = this.el && this.el !== document ? this.el.closest("form") : null;
      }
      this.triggerEl = this.formEl || this.el !== document && this.el.closest("[data-request-scope]") || document.body;
      this.partialEl = this.el && this.el !== document ? this.el.closest("[data-ajax-partial]") : null;
      this.loadingEl = typeof this.options.loading === "string" ? document.querySelector(this.options.loading) : this.options.loading;
    }
    preprocessOptions() {
      if (this.options.partial === void 0 && this.partialEl && this.partialEl.dataset.ajaxPartial !== void 0) {
        this.options.partial = this.partialEl.dataset.ajaxPartial || true;
      }
    }
    validateClientSideForm() {
      if (this.options.browserValidate && typeof document.createElement("input").reportValidity === "function" && this.formEl && !this.formEl.checkValidity()) {
        this.formEl.reportValidity();
        return false;
      }
      return true;
    }
    toggleLoadingElement(isLoading) {
      if (!this.loadingEl) {
        return;
      }
      if (typeof this.loadingEl.show !== "function" || typeof this.loadingEl.hide !== "function") {
        this.loadingEl.style.display = isLoading ? "block" : "none";
        return;
      }
      if (isLoading) {
        this.loadingEl.show();
      } else {
        this.loadingEl.hide();
      }
    }
    showProgressBarAfterDelay() {
      this.progressBar.setValue(0);
      this.progressBarTimeout = window.setTimeout(this.showProgressBar, this.options.progressBarDelay);
    }
    hideProgressBar() {
      this.progressBar.setValue(100);
      this.progressBar.hide();
      if (this.progressBarTimeout != null) {
        window.clearTimeout(this.progressBarTimeout);
        delete this.progressBarTimeout;
      }
    }
    markAsProgress(isLoading) {
      if (isLoading) {
        document.documentElement.setAttribute("data-ajax-progress", "");
        if (this.formEl) {
          this.formEl.setAttribute("data-ajax-progress", this.handler);
        }
      } else {
        document.documentElement.removeAttribute("data-ajax-progress");
        if (this.formEl) {
          this.formEl.removeAttribute("data-ajax-progress");
        }
      }
    }
  };
  function decorateResponse(response, statusCode, xhr) {
    if (!response || response.constructor !== {}.constructor || !response.__ajax) {
      return response || {};
    }
    const { __ajax, ...data } = response, envelope = new Envelope(response, statusCode), meta = {
      env: envelope,
      status: statusCode,
      xhr
    };
    for (const [key, value] of Object.entries(meta)) {
      Object.defineProperty(data, `$${key}`, {
        value,
        enumerable: false,
        writable: false,
        configurable: true
      });
    }
    return data;
  }

  // ../../vendor/larajax/larajax/resources/src/request/namespace.js
  var namespace_default = Request;

  // ../../vendor/larajax/larajax/resources/src/util/json-parser.js
  var JsonParser = class _JsonParser {
    // Public
    static paramToObj(name, value) {
      if (value === void 0) {
        value = "";
      }
      if (typeof value === "object") {
        return value;
      }
      if (value.charAt(0) !== "{") {
        value = "{" + value + "}";
      }
      try {
        return this.parseJSON(value);
      } catch (e) {
        throw new Error("Error parsing the " + name + " attribute value. " + e);
      }
    }
    static parseJSON(json) {
      return JSON.parse(new _JsonParser().parseString(json));
    }
    // Private
    parseString(str) {
      str = str.trim();
      if (!str.length) {
        throw new Error("Broken JSON object.");
      }
      var result = "";
      while (str && str[0] === ",") {
        str = str.substr(1);
      }
      if (str[0] === '"' || str[0] === "'") {
        if (str[str.length - 1] !== str[0]) {
          throw new Error("Invalid string JSON object.");
        }
        var body = '"';
        for (var i = 1; i < str.length; i++) {
          if (str[i] === "\\") {
            if (str[i + 1] === "'") {
              body += str[i + 1];
            } else {
              body += str[i];
              body += str[i + 1];
            }
            i++;
          } else if (str[i] === str[0]) {
            body += '"';
            return body;
          } else if (str[i] === '"') {
            body += '\\"';
          } else body += str[i];
        }
        throw new Error("Invalid string JSON object.");
      }
      if (str === "true" || str === "false") {
        return str;
      }
      if (str === "null") {
        return "null";
      }
      var num = parseFloat(str);
      if (!isNaN(num)) {
        return num.toString();
      }
      if (str[0] === "{") {
        var type = "needKey";
        var result = "{";
        for (var i = 1; i < str.length; i++) {
          if (this.isBlankChar(str[i])) {
            continue;
          } else if (type === "needKey" && (str[i] === '"' || str[i] === "'")) {
            var key = this.parseKey(str, i + 1, str[i]);
            result += '"' + key + '"';
            i += key.length;
            i += 1;
            type = "afterKey";
          } else if (type === "needKey" && this.canBeKeyHead(str[i])) {
            var key = this.parseKey(str, i);
            result += '"';
            result += key;
            result += '"';
            i += key.length - 1;
            type = "afterKey";
          } else if (type === "afterKey" && str[i] === ":") {
            result += ":";
            type = ":";
          } else if (type === ":") {
            var body = this.getBody(str, i);
            i = i + body.originLength - 1;
            result += this.parseString(body.body);
            type = "afterBody";
          } else if (type === "afterBody" || type === "needKey") {
            var last = i;
            while (str[last] === "," || this.isBlankChar(str[last])) {
              last++;
            }
            if (str[last] === "}" && last === str.length - 1) {
              while (result[result.length - 1] === ",") {
                result = result.substr(0, result.length - 1);
              }
              result += "}";
              return result;
            } else if (last !== i && result !== "{") {
              result += ",";
              type = "needKey";
              i = last - 1;
            }
          }
        }
        throw new Error("Broken JSON object near " + result);
      }
      if (str[0] === "[") {
        var result = "[";
        var type = "needBody";
        for (var i = 1; i < str.length; i++) {
          if (" " === str[i] || "\n" === str[i] || "	" === str[i]) {
            continue;
          } else if (type === "needBody") {
            if (str[i] === ",") {
              result += "null,";
              continue;
            }
            if (str[i] === "]" && i === str.length - 1) {
              if (result[result.length - 1] === ",") result = result.substr(0, result.length - 1);
              result += "]";
              return result;
            }
            var body = this.getBody(str, i);
            i = i + body.originLength - 1;
            result += this.parseString(body.body);
            type = "afterBody";
          } else if (type === "afterBody") {
            if (str[i] === ",") {
              result += ",";
              type = "needBody";
              while (str[i + 1] === "," || this.isBlankChar(str[i + 1])) {
                if (str[i + 1] === ",") result += "null,";
                i++;
              }
            } else if (str[i] === "]" && i === str.length - 1) {
              result += "]";
              return result;
            }
          }
        }
        throw new Error("Broken JSON array near " + result);
      }
    }
    parseKey(str, pos, quote) {
      var key = "";
      for (var i = pos; i < str.length; i++) {
        if (quote && quote === str[i]) {
          return key;
        } else if (!quote && (str[i] === " " || str[i] === ":")) {
          return key;
        }
        key += str[i];
        if (str[i] === "\\" && i + 1 < str.length) {
          key += str[i + 1];
          i++;
        }
      }
      throw new Error("Broken JSON syntax near " + key);
    }
    getBody(str, pos) {
      if (str[pos] === '"' || str[pos] === "'") {
        var body = str[pos];
        for (var i = pos + 1; i < str.length; i++) {
          if (str[i] === "\\") {
            body += str[i];
            if (i + 1 < str.length) body += str[i + 1];
            i++;
          } else if (str[i] === str[pos]) {
            body += str[pos];
            return {
              originLength: body.length,
              body
            };
          } else body += str[i];
        }
        throw new Error("Broken JSON string body near " + body);
      }
      if (str[pos] === "t") {
        if (str.indexOf("true", pos) === pos) {
          return {
            originLength: "true".length,
            body: "true"
          };
        }
        throw new Error("Broken JSON boolean body near " + str.substr(0, pos + 10));
      }
      if (str[pos] === "f") {
        if (str.indexOf("f", pos) === pos) {
          return {
            originLength: "false".length,
            body: "false"
          };
        }
        throw new Error("Broken JSON boolean body near " + str.substr(0, pos + 10));
      }
      if (str[pos] === "n") {
        if (str.indexOf("null", pos) === pos) {
          return {
            originLength: "null".length,
            body: "null"
          };
        }
        throw new Error("Broken JSON boolean body near " + str.substr(0, pos + 10));
      }
      if (str[pos] === "-" || str[pos] === "+" || str[pos] === "." || str[pos] >= "0" && str[pos] <= "9") {
        var body = "";
        for (var i = pos; i < str.length; i++) {
          if (str[i] === "-" || str[i] === "+" || str[i] === "." || str[i] >= "0" && str[i] <= "9") {
            body += str[i];
          } else {
            return {
              originLength: body.length,
              body
            };
          }
        }
        throw new Error("Broken JSON number body near " + body);
      }
      if (str[pos] === "{" || str[pos] === "[") {
        var stack = [str[pos]];
        var body = str[pos];
        for (var i = pos + 1; i < str.length; i++) {
          body += str[i];
          if (str[i] === "\\") {
            if (i + 1 < str.length) body += str[i + 1];
            i++;
          } else if (str[i] === '"') {
            if (stack[stack.length - 1] === '"') {
              stack.pop();
            } else if (stack[stack.length - 1] !== "'") {
              stack.push(str[i]);
            }
          } else if (str[i] === "'") {
            if (stack[stack.length - 1] === "'") {
              stack.pop();
            } else if (stack[stack.length - 1] !== '"') {
              stack.push(str[i]);
            }
          } else if (stack[stack.length - 1] !== '"' && stack[stack.length - 1] !== "'") {
            if (str[i] === "{") {
              stack.push("{");
            } else if (str[i] === "}") {
              if (stack[stack.length - 1] === "{") {
                stack.pop();
              } else {
                throw new Error("Broken JSON " + (str[pos] === "{" ? "object" : "array") + " body near " + body);
              }
            } else if (str[i] === "[") {
              stack.push("[");
            } else if (str[i] === "]") {
              if (stack[stack.length - 1] === "[") {
                stack.pop();
              } else {
                throw new Error("Broken JSON " + (str[pos] === "{" ? "object" : "array") + " body near " + body);
              }
            }
          }
          if (!stack.length) {
            return {
              originLength: i - pos,
              body
            };
          }
        }
        throw new Error("Broken JSON " + (str[pos] === "{" ? "object" : "array") + " body near " + body);
      }
      throw new Error("Broken JSON body near " + str.substr(pos - 5 >= 0 ? pos - 5 : 0, 50));
    }
    canBeKeyHead(ch) {
      if (ch[0] === "\\") return false;
      if (ch[0] >= "a" && ch[0] <= "z" || ch[0] >= "A" && ch[0] <= "Z" || ch[0] === "_") return true;
      if (ch[0] >= "0" && ch[0] <= "9") return true;
      if (ch[0] === "$") return true;
      if (ch.charCodeAt(0) > 255) return true;
      return false;
    }
    isBlankChar(ch) {
      return ch === " " || ch === "\n" || ch === "	";
    }
  };

  // ../../vendor/larajax/larajax/resources/src/core/request-builder.js
  var RequestBuilder = class _RequestBuilder {
    constructor(element, handler, options) {
      this.options = options || {};
      this.ogElement = element;
      this.element = this.findElement(element);
      if (!this.element) {
        return namespace_default.send(
          this.normalizeHandler(handler),
          this.options
        );
      }
      this.assignAsEval("beforeSendFunc", "requestBeforeSend");
      this.assignAsEval("beforeUpdateFunc", "requestBeforeUpdate");
      this.assignAsEval("afterUpdateFunc", "requestAfterUpdate");
      this.assignAsEval("successFunc", "requestSuccess");
      this.assignAsEval("errorFunc", "requestError");
      this.assignAsEval("cancelFunc", "requestCancel");
      this.assignAsEval("completeFunc", "requestComplete");
      this.assignAsData("progressBar", "requestProgressBar");
      this.assignAsData("message", "requestMessage");
      this.assignAsData("confirm", "requestConfirm");
      this.assignAsData("redirect", "requestRedirect");
      this.assignAsData("loading", "requestLoading");
      this.assignAsData("form", "requestForm");
      this.assignAsData("url", "requestUrl");
      this.assignAsData("bulk", "requestBulk", { emptyAsTrue: true });
      this.assignAsData("files", "requestFiles", { emptyAsTrue: true });
      this.assignAsData("flash", "requestFlash", { emptyAsTrue: true });
      this.assignAsData("update", "requestUpdate", { parseJson: true });
      this.assignAsData("query", "requestQuery", { emptyAsTrue: true, parseJson: true });
      this.assignAsData("browserTarget", "browserTarget");
      this.assignAsData("browserValidate", "browserValidate", { emptyAsTrue: true });
      this.assignAsData("browserRedirectBack", "browserRedirectBack", { emptyAsTrue: true });
      this.assignAsMetaData("update", "ajaxRequestUpdate", { parseJson: true, mergeValue: true });
      this.assignRequestData();
      if (!handler) {
        handler = this.getHandlerName();
      }
      return namespace_default.sendElement(
        this.element,
        this.normalizeHandler(handler),
        this.options
      );
    }
    static fromElement(element, handler, options) {
      if (typeof element === "string") {
        element = document.querySelector(element);
      }
      return new _RequestBuilder(element, handler, options);
    }
    // Event target may some random node inside the data-request container
    // so it should bubble up but also capture the ogElement in case it is
    // a button that contains data-request-data.
    findElement(element) {
      if (!element || element === document) {
        return null;
      }
      if (element.matches("[data-request]")) {
        return element;
      }
      var parentEl = element.closest("[data-request]");
      if (parentEl) {
        return parentEl;
      }
      return element;
    }
    getHandlerName() {
      if (this.element.dataset.dataRequest) {
        return this.element.dataset.dataRequest;
      }
      return this.element.getAttribute("data-request");
    }
    normalizeHandler(handler) {
      if (handler && !isValidHandler(handler)) {
        if (this.options.url === void 0) {
          this.options.url = handler;
        }
        return "onAjax";
      }
      return handler;
    }
    assignAsEval(optionName, name) {
      if (this.options[optionName] !== void 0) {
        return;
      }
      var attrVal;
      if (this.element.dataset[name]) {
        attrVal = this.element.dataset[name];
      } else {
        attrVal = this.element.getAttribute("data-" + normalizeDataKey(name));
      }
      if (!attrVal) {
        return;
      }
      this.options[optionName] = function(element, context, data) {
        return new Function("context", "data", attrVal).apply(element, [context, data]);
      };
    }
    assignAsData(optionName, name, { parseJson = false, emptyAsTrue = false } = {}) {
      if (this.options[optionName] !== void 0) {
        return;
      }
      var attrVal;
      if (this.element.dataset[name]) {
        attrVal = this.element.dataset[name];
      } else {
        attrVal = this.element.getAttribute("data-" + normalizeDataKey(name));
      }
      if (attrVal === null) {
        return;
      }
      attrVal = this.castAttrToOption(attrVal, emptyAsTrue);
      if (parseJson && typeof attrVal === "string") {
        attrVal = JsonParser.paramToObj(
          "data-" + normalizeDataKey(name),
          attrVal
        );
      }
      this.options[optionName] = attrVal;
    }
    assignAsMetaData(optionName, name, { mergeValue = true, parseJson = false, emptyAsTrue = false } = {}) {
      const meta = document.documentElement.querySelector('head meta[name="' + normalizeDataKey(name) + '"]');
      if (!meta) {
        return;
      }
      var attrVal = meta.getAttribute("content");
      if (parseJson) {
        attrVal = JsonParser.paramToObj(normalizeDataKey(name), attrVal);
      } else {
        attrVal = this.castAttrToOption(attrVal, emptyAsTrue);
      }
      if (mergeValue) {
        this.options[optionName] = {
          ...this.options[optionName] || {},
          ...attrVal
        };
      } else {
        this.options[optionName] = attrVal;
      }
    }
    castAttrToOption(val, emptyAsTrue) {
      if (emptyAsTrue && val === "") {
        return true;
      }
      if (val === "true" || val === "1") {
        return true;
      }
      if (val === "false" || val === "0") {
        return false;
      }
      return val;
    }
    assignRequestData() {
      const data = {};
      elementParents(this.ogElement, "[data-request-data]").forEach(function(el) {
        Object.assign(data, JsonParser.paramToObj(
          "data-request-data",
          el.getAttribute("data-request-data")
        ));
      });
      const attr = this.ogElement.getAttribute("data-request-data");
      if (attr) {
        Object.assign(data, JsonParser.paramToObj("data-request-data", attr));
      }
      if (this.options.data) {
        Object.assign(data, this.options.data);
      }
      this.options.data = data;
    }
  };
  function elementParents(element, selector) {
    const parents = [];
    if (!element.parentNode) {
      return parents;
    }
    let ancestor = element.parentNode.closest(selector);
    while (ancestor) {
      parents.push(ancestor);
      ancestor = ancestor.parentNode.closest(selector);
    }
    return parents;
  }
  function normalizeDataKey(key) {
    return key.replace(/[A-Z]/g, (chr) => `-${chr.toLowerCase()}`);
  }
  function isValidHandler(str) {
    return /^(?:\w+\:{2})?on[A-Z]{1}[\w+]*$/.test(str);
  }

  // ../../vendor/larajax/larajax/resources/src/core/trigger.js
  var Trigger = class {
    constructor(element) {
      this.element = element;
      this.config = this.parse();
      this.timer = null;
      this.throttleTimer = null;
      this.lastValue = null;
      this.fired = false;
      this.throttled = false;
      this.lastRequest = null;
    }
    /**
     * Parse trigger configuration from element attributes
     */
    parse() {
      let trigger = this.element.dataset.requestTrigger;
      let poll = this.element.dataset.requestPoll;
      if (!trigger && this.element.dataset.trackInput !== void 0) {
        const delay = this.element.dataset.trackInput || 300;
        trigger = `input changed delay:${delay}`;
      }
      if (!trigger && this.element.dataset.autoSubmit !== void 0) {
        const delay = this.element.dataset.autoSubmit || 0;
        trigger = delay > 0 ? `load delay:${delay}` : "load";
      }
      if (!trigger) {
        trigger = this.getDefaultTrigger();
      }
      const config = this.parseString(trigger);
      if (poll) {
        config.poll = this.parseTime(poll);
      }
      return config;
    }
    /**
     * Parse trigger string into config object
     * Format: "event modifier modifier:value"
     * Example: "input changed delay:500"
     */
    parseString(str) {
      const parts = str.trim().split(/\s+/);
      const config = {
        event: parts[0] || "click",
        delay: 0,
        throttle: 0,
        once: false,
        changed: false,
        poll: 0
      };
      for (let i = 1; i < parts.length; i++) {
        const part = parts[i];
        if (part === "once") {
          config.once = true;
        } else if (part === "changed") {
          config.changed = true;
        } else if (part.startsWith("delay:")) {
          config.delay = this.parseTime(part.slice(6));
        } else if (part.startsWith("throttle:")) {
          config.throttle = this.parseTime(part.slice(9));
        }
      }
      return config;
    }
    /**
     * Parse time value to milliseconds
     * Supports: 500, 500ms, 1s, 1.5s
     */
    parseTime(value) {
      if (typeof value === "number") {
        return value;
      }
      value = String(value).trim();
      if (value.endsWith("ms")) {
        return parseFloat(value);
      }
      if (value.endsWith("s")) {
        return parseFloat(value) * 1e3;
      }
      return parseInt(value, 10) || 0;
    }
    /**
     * Get default trigger based on element type
     */
    getDefaultTrigger() {
      const el = this.element;
      const tag = el.tagName.toLowerCase();
      const type = el.getAttribute("type")?.toLowerCase();
      if (tag === "form") return "submit";
      if (tag === "a") return "click";
      if (tag === "button") return "click";
      if (tag === "select") return "change";
      if (type === "checkbox" || type === "radio" || type === "file") return "change";
      if (type === "date" || type === "datetime-local" || type === "time" || type === "month" || type === "week" || type === "color" || type === "range") return "change";
      if (tag === "input" && (type === "submit" || type === "button")) return "click";
      if (tag === "input") return "click";
      return "click";
    }
    /**
     * Check if element is still connected to DOM
     */
    isConnected() {
      return this.element.isConnected;
    }
    /**
     * Bind event listeners for invented events only.
     * Standard DOM events (click, submit, change, input) are handled
     * via document-level delegation in Controller.
     */
    bind() {
      const { event } = this.config;
      if (event === "load") {
        dispatch("ajax:trigger", { target: this.element });
      } else if (event === "revealed" || event === "intersect") {
        this.observeVisibility();
      }
    }
    /**
     * Handle the trigger event
     */
    handleEvent(event) {
      if (!this.isConnected()) {
        return;
      }
      if (event && (this.config.event === "submit" || this.config.event === "click")) {
        event.preventDefault();
      }
      const { delay, throttle, once, changed } = this.config;
      if (once && this.fired) {
        return;
      }
      if (changed && !this.hasChanged()) {
        return;
      }
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      if (throttle > 0 && this.throttled) {
        return;
      }
      if (delay > 0) {
        this.timer = setTimeout(() => this.fire(), delay);
      } else {
        this.fire();
      }
    }
    /**
     * Check if the element value has changed
     */
    hasChanged() {
      const value = this.element.value;
      if (this.lastValue === value) {
        return false;
      }
      this.lastValue = value;
      return true;
    }
    /**
     * Fire the actual request
     */
    fire() {
      if (!this.isConnected()) {
        return;
      }
      if (this.lastRequest && this.lastRequest.abort) {
        this.lastRequest.abort();
      }
      this.fired = true;
      this.lastRequest = RequestBuilder.fromElement(this.element);
      if (this.config.throttle > 0) {
        this.throttled = true;
        this.throttleTimer = setTimeout(() => {
          this.throttled = false;
        }, this.config.throttle);
      }
    }
    /**
     * Observe element visibility for revealed/intersect events
     */
    observeVisibility() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!this.isConnected()) {
            observer.disconnect();
            return;
          }
          if (entry.isIntersecting) {
            dispatch("ajax:trigger", { target: this.element });
            if (this.config.once || this.config.event === "intersect") {
              observer.disconnect();
            }
          }
        });
      }, {
        threshold: 0.1
      });
      observer.observe(this.element);
    }
    /**
     * Start polling interval
     */
    startPolling() {
      const intervalId = setInterval(() => {
        if (!this.isConnected()) {
          clearInterval(intervalId);
          return;
        }
        if (!document.hidden) {
          dispatch("ajax:trigger", { target: this.element });
        }
      }, this.config.poll);
    }
  };

  // ../../vendor/larajax/larajax/resources/src/util/wait.js
  function waitFor(predicate, timeout) {
    return new Promise((resolve, reject) => {
      const check = () => {
        if (!predicate()) {
          return;
        }
        clearInterval(interval);
        resolve();
      };
      const interval = setInterval(check, 100);
      check();
      if (!timeout) {
        return;
      }
      setTimeout(() => {
        clearInterval(interval);
        reject();
      }, timeout);
    });
  }
  function domReady() {
    return new Promise((resolve) => {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => resolve());
      } else {
        resolve();
      }
    });
  }

  // ../../vendor/larajax/larajax/resources/src/core/controller.js
  var Controller = class {
    constructor() {
      this.started = false;
      this.triggers = /* @__PURE__ */ new WeakMap();
    }
    start() {
      if (!this.started) {
        addEventListener("beforeunload", this.documentOnBeforeUnload);
        Events.on(document, "click", "[data-request]", this.onTriggerEvent);
        Events.on(document, "submit", "[data-request]", this.onTriggerEvent);
        Events.on(document, "change", "[data-request]", this.onTriggerEvent);
        Events.on(document, "input", "[data-request]", this.onTriggerEvent);
        Events.on(document, "ajax:trigger", "[data-request]", this.onTriggerEvent);
        addEventListener("DOMContentLoaded", this.onRender);
        addEventListener("page:updated", this.onRender);
        addEventListener("ajax:update-complete", this.onRender);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        removeEventListener("beforeunload", this.documentOnBeforeUnload);
        Events.off(document, "click", "[data-request]", this.onTriggerEvent);
        Events.off(document, "submit", "[data-request]", this.onTriggerEvent);
        Events.off(document, "change", "[data-request]", this.onTriggerEvent);
        Events.off(document, "input", "[data-request]", this.onTriggerEvent);
        Events.off(document, "ajax:trigger", "[data-request]", this.onTriggerEvent);
        removeEventListener("DOMContentLoaded", this.onRender);
        removeEventListener("page:updated", this.onRender);
        removeEventListener("ajax:update-complete", this.onRender);
        this.started = false;
      }
    }
    onRender = () => {
      this.render();
    };
    render() {
      Events.dispatch("before-render");
      Events.dispatch("render");
      dispatchEvent(new Event("resize"));
      this.bindCustomTriggers();
    }
    /**
     * Initialize triggers for custom events (load, revealed, intersect)
     * Native events (click, submit, change, input) are handled by document delegation
     */
    bindCustomTriggers() {
      document.querySelectorAll("[data-request]:not([data-trigger-bound])").forEach((el) => {
        const trigger = this.getTrigger(el);
        const eventType = trigger.config.event;
        if (eventType === "load" || eventType === "revealed" || eventType === "intersect") {
          el.setAttribute("data-trigger-bound", "");
          trigger.bind();
        }
        if (trigger.config.poll > 0) {
          el.setAttribute("data-trigger-bound", "");
          trigger.startPolling();
        }
      });
    }
    /**
     * Get or create a Trigger instance for an element
     */
    getTrigger(el) {
      let trigger = this.triggers.get(el);
      if (!trigger) {
        trigger = new Trigger(el);
        this.triggers.set(el, trigger);
      }
      return trigger;
    }
    /**
     * Handle delegated trigger events
     */
    onTriggerEvent = (event) => {
      const el = event.delegateTarget;
      const trigger = this.getTrigger(el);
      const configEvent = trigger.config.event;
      if (event.type === "ajax:trigger") {
        trigger.handleEvent(event);
        return;
      }
      if (event.type === configEvent) {
        trigger.handleEvent(event);
      }
    };
    documentOnBeforeUnload(event) {
      window.jaxUnloading = true;
    }
    /**
     * Wait for the page to be ready.
     * Uses Turbo's pageReady if available, otherwise falls back to domReady.
     */
    pageReady() {
      return turboPageReady() ?? domReady();
    }
  };

  // ../../vendor/larajax/larajax/resources/src/core/namespace.js
  var controller = new Controller();
  var namespace_default2 = {
    controller,
    parseJSON: JsonParser.parseJSON,
    serializeAsJSON: FormSerializer.serializeAsJSON,
    requestElement: RequestBuilder.fromElement,
    pageReady() {
      return controller.pageReady();
    },
    start() {
      controller.start();
    },
    stop() {
      controller.stop();
    }
  };

  // ../../vendor/larajax/larajax/resources/src/util/jax-builder.js
  function buildJaxObject(modules) {
    const {
      AjaxFramework,
      AjaxRequest,
      AssetManager: AssetManager2,
      Events: Events2,
      waitFor: waitFor2,
      visit,
      // Optional modules
      AjaxExtras,
      AjaxObserve,
      AjaxTurbo,
      ControlBase
    } = modules;
    const jax = {
      // Request
      AjaxRequest,
      AssetManager: AssetManager2,
      ajax: AjaxRequest.send,
      // Core
      AjaxFramework,
      request: AjaxFramework.requestElement,
      parseJSON: AjaxFramework.parseJSON,
      values: AjaxFramework.serializeAsJSON,
      pageReady: AjaxFramework.pageReady,
      // Util
      Events: Events2,
      dispatch: Events2.dispatch,
      trigger: Events2.trigger,
      on: Events2.on,
      off: Events2.off,
      one: Events2.one,
      waitFor: waitFor2,
      visit
    };
    if (AjaxExtras) {
      jax.AjaxExtras = AjaxExtras;
      jax.flashMsg = AjaxExtras.flashMsg;
      jax.progressBar = AjaxExtras.progressBar;
      jax.attachLoader = AjaxExtras.attachLoader;
    }
    if (AjaxObserve) {
      jax.AjaxObserve = AjaxObserve;
      jax.registerControl = AjaxObserve.registerControl;
      jax.importControl = AjaxObserve.importControl;
      jax.observeControl = AjaxObserve.observeControl;
      jax.fetchControl = AjaxObserve.fetchControl;
      jax.fetchControls = AjaxObserve.fetchControls;
    }
    if (ControlBase) {
      jax.ControlBase = ControlBase;
    }
    if (AjaxTurbo) {
      registerTurbo(AjaxTurbo);
      jax.AjaxTurbo = AjaxTurbo;
      jax.useTurbo = AjaxTurbo.isEnabled;
    }
    return jax;
  }

  // ../../vendor/larajax/larajax/resources/src/framework.js
  if (!window.jax) {
    window.jax = {};
  }
  Object.assign(window.jax, buildJaxObject({
    AjaxFramework: namespace_default2,
    AjaxRequest: namespace_default,
    AssetManager,
    Events,
    waitFor,
    visit: (url) => window.location.assign(url)
  }));
  namespace_default2.start();

  // assets/vendor/larajax/migrate.js
  window.oc = window.jax;
  window.oc.serializeJSON = window.oc.values;
  (function() {
    var $ = window["jQuery"];
    if ($ === void 0) {
      return;
    }
    bindRequestFunc();
    bindRenderFunc();
    bindjQueryEvents();
    bindOcNamespace();
    function bindRequestFunc() {
      var old = $.fn.request;
      $.fn.request = function(handler, option) {
        var options = typeof option === "object" ? option : {};
        return oc.request(this.get(0), handler, options);
      };
      $.fn.request.Constructor = oc.request;
      $.request = function(handler, option) {
        return $(document).request(handler, option);
      };
      $.fn.request.noConflict = function() {
        $.fn.request = old;
        return this;
      };
    }
    function bindRenderFunc() {
      $.fn.render = function(callback) {
        $(document).on("render", callback);
      };
    }
    function bindOcNamespace() {
      if ($.oc === void 0) {
        $.oc = {};
      }
      $.oc.flashMsg = window.jax.flashMsg;
      $.oc.stripeLoadIndicator = window.jax.progressBar;
    }
    function bindjQueryEvents() {
      migratejQueryEvent(document, "ajax:setup", "ajaxSetup", ["context"]);
      migratejQueryEvent(document, "ajax:promise", "ajaxPromise", ["context"]);
      migratejQueryEvent(document, "ajax:fail", "ajaxFail", ["context", "data", "responseCode", "xhr"]);
      migratejQueryEvent(document, "ajax:done", "ajaxDone", ["context", "data", "responseCode", "xhr"]);
      migratejQueryEvent(document, "ajax:always", "ajaxAlways", ["context", "data", "responseCode", "xhr"]);
      migratejQueryEvent(document, "ajax:before-redirect", "ajaxRedirect");
      migratejQueryEvent(document, "ajax:update", "ajaxUpdate", ["context", "data", "responseCode", "xhr"]);
      migratejQueryEvent(document, "ajax:before-replace", "ajaxBeforeReplace");
      migratejQueryEvent(document, "ajax:before-request", "oc.beforeRequest", ["context"]);
      migratejQueryEvent(document, "ajax:before-update", "ajaxBeforeUpdate", ["context", "data", "responseCode", "xhr"]);
      migratejQueryEvent(document, "ajax:request-success", "ajaxSuccess", ["context", "data", "responseCode", "xhr"]);
      migratejQueryEvent(document, "ajax:request-complete", "ajaxComplete", ["context", "data", "responseCode", "xhr"]);
      migratejQueryEvent(document, "ajax:request-error", "ajaxError", ["context", "message", "responseCode", "xhr"]);
      migratejQueryEvent(document, "ajax:before-validate", "ajaxValidation", ["context", "message", "fields"]);
      migratejQueryEvent(window, "ajax:before-send", "ajaxBeforeSend", ["context"]);
      migratejQueryEvent(window, "ajax:update-complete", "ajaxUpdateComplete", ["context", "data", "responseCode", "xhr"]);
      migratejQueryEvent(window, "ajax:invalid-field", "ajaxInvalidField", ["element", "fieldName", "errorMsg", "isFirst"]);
      migratejQueryEvent(window, "ajax:confirm-message", "ajaxConfirmMessage", ["message", "promise"]);
      migratejQueryEvent(window, "ajax:error-message", "ajaxErrorMessage", ["message"]);
      migratejQueryAttachData(document, "ajax:setup", "a[data-request], button[data-request], form[data-request], a[data-handler], button[data-handler]");
    }
    function migratejQueryEvent(target, jsName, jqName, detailNames) {
      detailNames = detailNames || [];
      $(target).on(jsName, function(ev) {
        triggerjQueryEvent(ev.originalEvent, jqName, detailNames);
      });
    }
    function triggerjQueryEvent(ev, eventName, detailNames) {
      detailNames = detailNames || [];
      var jQueryEvent = $.Event(eventName), args = buildDetailArgs(ev, detailNames);
      $(ev.target).trigger(jQueryEvent, args);
      if (jQueryEvent.isDefaultPrevented()) {
        ev.preventDefault();
      }
    }
    function buildDetailArgs(ev, detailNames) {
      var args = [];
      detailNames.forEach(function(name) {
        args.push(ev.detail[name]);
      });
      return args;
    }
    function migratejQueryAttachData(target, eventName, selector) {
      $(target).on(eventName, selector, function(event) {
        var dataObj = $(this).data("request-data");
        if (!dataObj) {
          return;
        }
        var options = event.detail.context.options;
        if (dataObj.constructor === {}.constructor) {
          Object.assign(options.data, dataObj);
        } else if (typeof dataObj === "string") {
          Object.assign(options.data, paramToObj("request-data", dataObj));
        }
      });
    }
    function paramToObj(name, value) {
      if (value === void 0) {
        value = "";
      }
      if (typeof value === "object") {
        return value;
      }
      if (value.charAt(0) !== "{") {
        value = "{" + value + "}";
      }
      try {
        return oc.parseJSON(value);
      } catch (e) {
        throw new Error("Error parsing the " + name + " attribute value. " + e);
      }
    }
  })();
})();
