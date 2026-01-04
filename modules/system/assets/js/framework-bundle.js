/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./modules/system/assets/vendor/larajax/migrate.js"
/*!*********************************************************!*\
  !*** ./modules/system/assets/vendor/larajax/migrate.js ***!
  \*********************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

/* provided dependency */ var __webpack_provided_window_dot_jQuery = __webpack_require__(/*! jquery */ "jquery");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
// Set oc namespace from jax
window.oc = window.jax;
window.oc.serializeJSON = window.oc.values;

// jQuery compatibility layer
// Plus native deprecations
(function ($) {
  if (!$) {
    return;
  }
  bindRequestFunc();
  bindRenderFunc();
  bindjQueryEvents();
  bindOcNamespace();
  function bindRequestFunc() {
    var old = $.fn.request;
    $.fn.request = function (handler, option) {
      var options = _typeof(option) === 'object' ? option : {};
      return oc.request(this.get(0), handler, options);
    };
    $.fn.request.Constructor = oc.request;

    // Basic function
    $.request = function (handler, option) {
      return $(document).request(handler, option);
    };

    // No conflict
    $.fn.request.noConflict = function () {
      $.fn.request = old;
      return this;
    };
  }
  function bindRenderFunc() {
    $.fn.render = function (callback) {
      $(document).on('render', callback);
    };
  }
  function bindOcNamespace() {
    if ($.oc === undefined) {
      $.oc = {};
    }
    $.oc.flashMsg = window.jax.flashMsg;
    $.oc.stripeLoadIndicator = window.jax.progressBar;
  }
  function bindjQueryEvents() {
    // Element
    migratejQueryEvent(document, 'ajax:setup', 'ajaxSetup', ['context']);
    migratejQueryEvent(document, 'ajax:promise', 'ajaxPromise', ['context']);
    migratejQueryEvent(document, 'ajax:fail', 'ajaxFail', ['context', 'data', 'responseCode', 'xhr']);
    migratejQueryEvent(document, 'ajax:done', 'ajaxDone', ['context', 'data', 'responseCode', 'xhr']);
    migratejQueryEvent(document, 'ajax:always', 'ajaxAlways', ['context', 'data', 'responseCode', 'xhr']);
    migratejQueryEvent(document, 'ajax:before-redirect', 'ajaxRedirect');

    // Updated Element
    migratejQueryEvent(document, 'ajax:update', 'ajaxUpdate', ['context', 'data', 'responseCode', 'xhr']);
    migratejQueryEvent(document, 'ajax:before-replace', 'ajaxBeforeReplace');

    // Trigger Element
    migratejQueryEvent(document, 'ajax:before-request', 'oc.beforeRequest', ['context']);
    migratejQueryEvent(document, 'ajax:before-update', 'ajaxBeforeUpdate', ['context', 'data', 'responseCode', 'xhr']);
    migratejQueryEvent(document, 'ajax:request-success', 'ajaxSuccess', ['context', 'data', 'responseCode', 'xhr']);
    migratejQueryEvent(document, 'ajax:request-complete', 'ajaxComplete', ['context', 'data', 'responseCode', 'xhr']);
    migratejQueryEvent(document, 'ajax:request-error', 'ajaxError', ['context', 'message', 'responseCode', 'xhr']);
    migratejQueryEvent(document, 'ajax:before-validate', 'ajaxValidation', ['context', 'message', 'fields']);

    // Window
    migratejQueryEvent(window, 'ajax:before-send', 'ajaxBeforeSend', ['context']);
    migratejQueryEvent(window, 'ajax:update-complete', 'ajaxUpdateComplete', ['context', 'data', 'responseCode', 'xhr']);
    migratejQueryEvent(window, 'ajax:invalid-field', 'ajaxInvalidField', ['element', 'fieldName', 'errorMsg', 'isFirst']);
    migratejQueryEvent(window, 'ajax:confirm-message', 'ajaxConfirmMessage', ['message', 'promise']);
    migratejQueryEvent(window, 'ajax:error-message', 'ajaxErrorMessage', ['message']);

    // Data adapter
    migratejQueryAttachData(document, 'ajax:setup', 'a[data-request], button[data-request], form[data-request], a[data-handler], button[data-handler]');
  }
  function migratejQueryEvent(target, jsName, jqName, detailNames) {
    detailNames = detailNames || [];
    $(target).on(jsName, function (ev) {
      triggerjQueryEvent(ev.originalEvent, jqName, detailNames);
    });
  }
  function triggerjQueryEvent(ev, eventName, detailNames) {
    detailNames = detailNames || [];
    var jQueryEvent = $.Event(eventName),
      args = buildDetailArgs(ev, detailNames);
    $(ev.target).trigger(jQueryEvent, args);
    if (jQueryEvent.isDefaultPrevented()) {
      ev.preventDefault();
    }
  }
  function buildDetailArgs(ev, detailNames) {
    var args = [];
    detailNames.forEach(function (name) {
      args.push(ev.detail[name]);
    });
    return args;
  }

  // For instances where data() is populated in the jQ instance
  function migratejQueryAttachData(target, eventName, selector) {
    $(target).on(eventName, selector, function (event) {
      var dataObj = $(this).data('request-data');
      if (!dataObj) {
        return;
      }
      var options = event.detail.context.options;
      if (dataObj.constructor === {}.constructor) {
        Object.assign(options.data, dataObj);
      } else if (typeof dataObj === 'string') {
        Object.assign(options.data, paramToObj('request-data', dataObj));
      }
    });
  }
  function paramToObj(name, value) {
    if (value === undefined) {
      value = '';
    }
    if (_typeof(value) === 'object') {
      return value;
    }
    if (value.charAt(0) !== '{') {
      value = "{" + value + "}";
    }
    try {
      return oc.parseJSON(value);
    } catch (e) {
      throw new Error('Error parsing the ' + name + ' attribute value. ' + e);
    }
  }
})(__webpack_provided_window_dot_jQuery);

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/core/controller.js"
/*!*****************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/core/controller.js ***!
  \*****************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Controller: () => (/* binding */ Controller)
/* harmony export */ });
/* harmony import */ var _util_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/events */ "./vendor/larajax/larajax/resources/src/util/events.js");
/* harmony import */ var _trigger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./trigger */ "./vendor/larajax/larajax/resources/src/core/trigger.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


var Controller = /*#__PURE__*/function () {
  function Controller() {
    var _this = this;
    _classCallCheck(this, Controller);
    /**
     * Handle delegated trigger events
     */
    _defineProperty(this, "onTriggerEvent", function (event) {
      var el = event.delegateTarget;
      var trigger = _this.getTrigger(el);
      var configEvent = trigger.config.event;

      // For ajax:trigger (invented events), always handle
      if (event.type === 'ajax:trigger') {
        trigger.handleEvent(event);
        return;
      }

      // For native events, only handle if it matches the configured trigger event
      if (event.type === configEvent) {
        trigger.handleEvent(event);
      }
    });
    this.started = false;
    this.triggers = new WeakMap();
  }
  return _createClass(Controller, [{
    key: "start",
    value: function start() {
      var _this2 = this;
      if (!this.started) {
        // Track unload event for request lib
        window.onbeforeunload = this.documentOnBeforeUnload;

        // Document-level delegation for native events
        _util_events__WEBPACK_IMPORTED_MODULE_0__.Events.on(document, 'click', '[data-request]', this.onTriggerEvent);
        _util_events__WEBPACK_IMPORTED_MODULE_0__.Events.on(document, 'submit', '[data-request]', this.onTriggerEvent);
        _util_events__WEBPACK_IMPORTED_MODULE_0__.Events.on(document, 'change', '[data-request]', this.onTriggerEvent);
        _util_events__WEBPACK_IMPORTED_MODULE_0__.Events.on(document, 'input', '[data-request]', this.onTriggerEvent);

        // Custom event for invented triggers (load, revealed, intersect, poll)
        _util_events__WEBPACK_IMPORTED_MODULE_0__.Events.on(document, 'ajax:trigger', '[data-request]', this.onTriggerEvent);

        // First page load
        addEventListener('DOMContentLoaded', function () {
          return _this2.render();
        });

        // Again, after new scripts load
        addEventListener('page:updated', function () {
          return _this2.render();
        });

        // Again after AJAX request
        addEventListener('ajax:update-complete', function () {
          return _this2.render();
        });
        this.started = true;
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      if (this.started) {
        this.started = false;
      }
    }
  }, {
    key: "render",
    value: function render() {
      // Pre render event, used to move nodes around
      _util_events__WEBPACK_IMPORTED_MODULE_0__.Events.dispatch('before-render');

      // Render event, used to initialize controls
      _util_events__WEBPACK_IMPORTED_MODULE_0__.Events.dispatch('render');

      // Resize event to adjust all measurements
      dispatchEvent(new Event('resize'));
      this.bindCustomTriggers();
    }

    /**
     * Initialize triggers for custom events (load, revealed, intersect)
     * Native events (click, submit, change, input) are handled by document delegation
     */
  }, {
    key: "bindCustomTriggers",
    value: function bindCustomTriggers() {
      var _this3 = this;
      document.querySelectorAll('[data-request]:not([data-trigger-bound])').forEach(function (el) {
        var trigger = _this3.getTrigger(el);
        var eventType = trigger.config.event;

        // Only bind directly for custom events
        if (eventType === 'load' || eventType === 'revealed' || eventType === 'intersect') {
          el.setAttribute('data-trigger-bound', '');
          trigger.bind();
        }

        // Setup polling if configured (works with any event type)
        if (trigger.config.poll > 0) {
          el.setAttribute('data-trigger-bound', '');
          trigger.startPolling();
        }
      });
    }

    /**
     * Get or create a Trigger instance for an element
     */
  }, {
    key: "getTrigger",
    value: function getTrigger(el) {
      var trigger = this.triggers.get(el);
      if (!trigger) {
        trigger = new _trigger__WEBPACK_IMPORTED_MODULE_1__.Trigger(el);
        this.triggers.set(el, trigger);
      }
      return trigger;
    }
  }, {
    key: "documentOnBeforeUnload",
    value: function documentOnBeforeUnload(event) {
      window.jaxUnloading = true;
    }
  }]);
}();

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/core/namespace.js"
/*!****************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/core/namespace.js ***!
  \****************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _controller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./controller */ "./vendor/larajax/larajax/resources/src/core/controller.js");
/* harmony import */ var _request_builder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./request-builder */ "./vendor/larajax/larajax/resources/src/core/request-builder.js");
/* harmony import */ var _util_json_parser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/json-parser */ "./vendor/larajax/larajax/resources/src/util/json-parser.js");
/* harmony import */ var _util_form_serializer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/form-serializer */ "./vendor/larajax/larajax/resources/src/util/form-serializer.js");




var controller = new _controller__WEBPACK_IMPORTED_MODULE_0__.Controller();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  controller: controller,
  parseJSON: _util_json_parser__WEBPACK_IMPORTED_MODULE_2__.JsonParser.parseJSON,
  serializeAsJSON: _util_form_serializer__WEBPACK_IMPORTED_MODULE_3__.FormSerializer.serializeAsJSON,
  requestElement: _request_builder__WEBPACK_IMPORTED_MODULE_1__.RequestBuilder.fromElement,
  start: function start() {
    controller.start();
  },
  stop: function stop() {
    controller.stop();
  }
});

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/core/request-builder.js"
/*!**********************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/core/request-builder.js ***!
  \**********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RequestBuilder: () => (/* binding */ RequestBuilder)
/* harmony export */ });
/* harmony import */ var _request_namespace__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../request/namespace */ "./vendor/larajax/larajax/resources/src/request/namespace.js");
/* harmony import */ var _util_json_parser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/json-parser */ "./vendor/larajax/larajax/resources/src/util/json-parser.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


var RequestBuilder = /*#__PURE__*/function () {
  function RequestBuilder(element, handler, options) {
    _classCallCheck(this, RequestBuilder);
    this.options = options || {};
    this.ogElement = element;
    this.element = this.findElement(element);
    if (!this.element) {
      return _request_namespace__WEBPACK_IMPORTED_MODULE_0__["default"].send(this.normalizeHandler(handler), this.options);
    }
    this.assignAsEval('beforeSendFunc', 'requestBeforeSend');
    this.assignAsEval('beforeUpdateFunc', 'requestBeforeUpdate');
    this.assignAsEval('afterUpdateFunc', 'requestAfterUpdate');
    this.assignAsEval('successFunc', 'requestSuccess');
    this.assignAsEval('errorFunc', 'requestError');
    this.assignAsEval('cancelFunc', 'requestCancel');
    this.assignAsEval('completeFunc', 'requestComplete');
    this.assignAsData('progressBar', 'requestProgressBar');
    this.assignAsData('message', 'requestMessage');
    this.assignAsData('confirm', 'requestConfirm');
    this.assignAsData('redirect', 'requestRedirect');
    this.assignAsData('loading', 'requestLoading');
    this.assignAsData('form', 'requestForm');
    this.assignAsData('url', 'requestUrl');
    this.assignAsData('bulk', 'requestBulk', {
      emptyAsTrue: true
    });
    this.assignAsData('files', 'requestFiles', {
      emptyAsTrue: true
    });
    this.assignAsData('flash', 'requestFlash', {
      emptyAsTrue: true
    });
    this.assignAsData('update', 'requestUpdate', {
      parseJson: true
    });
    this.assignAsData('query', 'requestQuery', {
      emptyAsTrue: true,
      parseJson: true
    });
    this.assignAsData('browserTarget', 'browserTarget');
    this.assignAsData('browserValidate', 'browserValidate', {
      emptyAsTrue: true
    });
    this.assignAsData('browserRedirectBack', 'browserRedirectBack', {
      emptyAsTrue: true
    });
    this.assignAsMetaData('update', 'ajaxRequestUpdate', {
      parseJson: true,
      mergeValue: true
    });
    this.assignRequestData();
    if (!handler) {
      handler = this.getHandlerName();
    }
    return _request_namespace__WEBPACK_IMPORTED_MODULE_0__["default"].sendElement(this.element, this.normalizeHandler(handler), this.options);
  }
  return _createClass(RequestBuilder, [{
    key: "findElement",
    value:
    // Event target may some random node inside the data-request container
    // so it should bubble up but also capture the ogElement in case it is
    // a button that contains data-request-data.
    function findElement(element) {
      if (!element || element === document) {
        return null;
      }
      if (element.matches('[data-request]')) {
        return element;
      }
      var parentEl = element.closest('[data-request]');
      if (parentEl) {
        return parentEl;
      }
      return element;
    }
  }, {
    key: "getHandlerName",
    value: function getHandlerName() {
      if (this.element.dataset.dataRequest) {
        return this.element.dataset.dataRequest;
      }
      return this.element.getAttribute('data-request');
    }
  }, {
    key: "normalizeHandler",
    value: function normalizeHandler(handler) {
      // If handler is not a valid handler name, treat it as a URL and default to onAjax
      if (handler && !isValidHandler(handler)) {
        if (this.options.url === undefined) {
          this.options.url = handler;
        }
        return 'onAjax';
      }
      return handler;
    }
  }, {
    key: "assignAsEval",
    value: function assignAsEval(optionName, name) {
      if (this.options[optionName] !== undefined) {
        return;
      }
      var attrVal;
      if (this.element.dataset[name]) {
        attrVal = this.element.dataset[name];
      } else {
        attrVal = this.element.getAttribute('data-' + normalizeDataKey(name));
      }
      if (!attrVal) {
        return;
      }
      this.options[optionName] = function (element, context, data) {
        return new Function('context', 'data', attrVal).apply(element, [context, data]);
      };
    }
  }, {
    key: "assignAsData",
    value: function assignAsData(optionName, name) {
      var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref$parseJson = _ref.parseJson,
        parseJson = _ref$parseJson === void 0 ? false : _ref$parseJson,
        _ref$emptyAsTrue = _ref.emptyAsTrue,
        emptyAsTrue = _ref$emptyAsTrue === void 0 ? false : _ref$emptyAsTrue;
      if (this.options[optionName] !== undefined) {
        return;
      }
      var attrVal;
      if (this.element.dataset[name]) {
        attrVal = this.element.dataset[name];
      } else {
        attrVal = this.element.getAttribute('data-' + normalizeDataKey(name));
      }
      if (attrVal === null) {
        return;
      }
      attrVal = this.castAttrToOption(attrVal, emptyAsTrue);
      if (parseJson && typeof attrVal === 'string') {
        attrVal = _util_json_parser__WEBPACK_IMPORTED_MODULE_1__.JsonParser.paramToObj('data-' + normalizeDataKey(name), attrVal);
      }
      this.options[optionName] = attrVal;
    }
  }, {
    key: "assignAsMetaData",
    value: function assignAsMetaData(optionName, name) {
      var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref2$mergeValue = _ref2.mergeValue,
        mergeValue = _ref2$mergeValue === void 0 ? true : _ref2$mergeValue,
        _ref2$parseJson = _ref2.parseJson,
        parseJson = _ref2$parseJson === void 0 ? false : _ref2$parseJson,
        _ref2$emptyAsTrue = _ref2.emptyAsTrue,
        emptyAsTrue = _ref2$emptyAsTrue === void 0 ? false : _ref2$emptyAsTrue;
      var meta = document.documentElement.querySelector('head meta[name="' + normalizeDataKey(name) + '"]');
      if (!meta) {
        return;
      }
      var attrVal = meta.getAttribute('content');
      if (parseJson) {
        attrVal = _util_json_parser__WEBPACK_IMPORTED_MODULE_1__.JsonParser.paramToObj(normalizeDataKey(name), attrVal);
      } else {
        attrVal = this.castAttrToOption(attrVal, emptyAsTrue);
      }
      if (mergeValue) {
        this.options[optionName] = _objectSpread(_objectSpread({}, this.options[optionName] || {}), attrVal);
      } else {
        this.options[optionName] = attrVal;
      }
    }
  }, {
    key: "castAttrToOption",
    value: function castAttrToOption(val, emptyAsTrue) {
      if (emptyAsTrue && val === '') {
        return true;
      }
      if (val === 'true' || val === '1') {
        return true;
      }
      if (val === 'false' || val === '0') {
        return false;
      }
      return val;
    }
  }, {
    key: "assignRequestData",
    value: function assignRequestData() {
      var data = {};
      if (this.options.data) {
        Object.assign(data, this.options.data);
      }
      var attr = this.ogElement.getAttribute('data-request-data');
      if (attr) {
        Object.assign(data, _util_json_parser__WEBPACK_IMPORTED_MODULE_1__.JsonParser.paramToObj('data-request-data', attr));
      }
      elementParents(this.ogElement, '[data-request-data]').reverse().forEach(function (el) {
        Object.assign(data, _util_json_parser__WEBPACK_IMPORTED_MODULE_1__.JsonParser.paramToObj('data-request-data', el.getAttribute('data-request-data')));
      });
      this.options.data = data;
    }
  }], [{
    key: "fromElement",
    value: function fromElement(element, handler, options) {
      if (typeof element === 'string') {
        element = document.querySelector(element);
      }
      return new RequestBuilder(element, handler, options);
    }
  }]);
}();
function elementParents(element, selector) {
  var parents = [];
  if (!element.parentNode) {
    return parents;
  }
  var ancestor = element.parentNode.closest(selector);
  while (ancestor) {
    parents.push(ancestor);
    ancestor = ancestor.parentNode.closest(selector);
  }
  return parents;
}
function normalizeDataKey(key) {
  return key.replace(/[A-Z]/g, function (chr) {
    return "-".concat(chr.toLowerCase());
  });
}
function isValidHandler(str) {
  return /^(?:\w+\:{2})?on[A-Z]{1}[\w+]*$/.test(str);
}

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/core/trigger.js"
/*!**************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/core/trigger.js ***!
  \**************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Trigger: () => (/* binding */ Trigger)
/* harmony export */ });
/* harmony import */ var _request_builder__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./request-builder */ "./vendor/larajax/larajax/resources/src/core/request-builder.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util */ "./vendor/larajax/larajax/resources/src/util/index.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


var Trigger = /*#__PURE__*/function () {
  function Trigger(element) {
    _classCallCheck(this, Trigger);
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
  return _createClass(Trigger, [{
    key: "parse",
    value: function parse() {
      var trigger = this.element.dataset.requestTrigger;
      var poll = this.element.dataset.requestPoll;

      // Backwards compat: data-track-input
      if (!trigger && this.element.dataset.trackInput !== undefined) {
        var delay = this.element.dataset.trackInput || 300;
        trigger = "input changed delay:".concat(delay);
      }

      // Backwards compat: data-auto-submit
      if (!trigger && this.element.dataset.autoSubmit !== undefined) {
        var _delay = this.element.dataset.autoSubmit || 0;
        trigger = _delay > 0 ? "load delay:".concat(_delay) : 'load';
      }

      // Default trigger based on element type
      if (!trigger) {
        trigger = this.getDefaultTrigger();
      }
      var config = this.parseString(trigger);

      // Handle polling separately
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
  }, {
    key: "parseString",
    value: function parseString(str) {
      var parts = str.trim().split(/\s+/);
      var config = {
        event: parts[0] || 'click',
        delay: 0,
        throttle: 0,
        once: false,
        changed: false,
        poll: 0
      };
      for (var i = 1; i < parts.length; i++) {
        var part = parts[i];
        if (part === 'once') {
          config.once = true;
        } else if (part === 'changed') {
          config.changed = true;
        } else if (part.startsWith('delay:')) {
          config.delay = this.parseTime(part.slice(6));
        } else if (part.startsWith('throttle:')) {
          config.throttle = this.parseTime(part.slice(9));
        }
      }
      return config;
    }

    /**
     * Parse time value to milliseconds
     * Supports: 500, 500ms, 1s, 1.5s
     */
  }, {
    key: "parseTime",
    value: function parseTime(value) {
      if (typeof value === 'number') {
        return value;
      }
      value = String(value).trim();
      if (value.endsWith('ms')) {
        return parseFloat(value);
      }
      if (value.endsWith('s')) {
        return parseFloat(value) * 1000;
      }
      return parseInt(value, 10) || 0;
    }

    /**
     * Get default trigger based on element type
     */
  }, {
    key: "getDefaultTrigger",
    value: function getDefaultTrigger() {
      var _el$type;
      var el = this.element;
      var tag = el.tagName.toLowerCase();
      var type = (_el$type = el.type) === null || _el$type === void 0 ? void 0 : _el$type.toLowerCase();
      if (tag === 'form') return 'submit';
      if (tag === 'a') return 'click';
      if (tag === 'button') return 'click';
      if (tag === 'select') return 'change';
      if (type === 'checkbox' || type === 'radio' || type === 'file') return 'change';
      if (tag === 'input' && (type === 'submit' || type === 'button')) return 'click';
      if (tag === 'input') return 'click';
      return 'click';
    }

    /**
     * Check if element is still connected to DOM
     */
  }, {
    key: "isConnected",
    value: function isConnected() {
      return this.element.isConnected;
    }

    /**
     * Bind event listeners for invented events only.
     * Standard DOM events (click, submit, change, input) are handled
     * via document-level delegation in Controller.
     */
  }, {
    key: "bind",
    value: function bind() {
      var event = this.config.event;

      // Invented events that need direct binding
      if (event === 'load') {
        (0,_util__WEBPACK_IMPORTED_MODULE_1__.dispatch)('ajax:trigger', {
          target: this.element
        });
      } else if (event === 'revealed' || event === 'intersect') {
        this.observeVisibility();
      }
    }

    /**
     * Handle the trigger event
     */
  }, {
    key: "handleEvent",
    value: function handleEvent(event) {
      var _this = this;
      // User already prevented this event, respect it
      if (event && event.defaultPrevented) {
        return;
      }

      // Element removed from DOM, ignore
      if (!this.isConnected()) {
        return;
      }

      // Prevent default for certain events
      if (event && (this.config.event === 'submit' || this.config.event === 'click')) {
        event.preventDefault();
      }
      var _this$config = this.config,
        delay = _this$config.delay,
        throttle = _this$config.throttle,
        once = _this$config.once,
        changed = _this$config.changed;

      // Once: already fired, ignore
      if (once && this.fired) {
        return;
      }

      // Changed: only fire if value changed
      if (changed && !this.hasChanged()) {
        return;
      }

      // Clear any pending delay timer
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      // Throttle: ignore if within throttle window
      if (throttle > 0 && this.throttled) {
        return;
      }

      // Delay: debounce the request
      if (delay > 0) {
        this.timer = setTimeout(function () {
          return _this.fire();
        }, delay);
      } else {
        this.fire();
      }
    }

    /**
     * Check if the element value has changed
     */
  }, {
    key: "hasChanged",
    value: function hasChanged() {
      var value = this.element.value;
      if (this.lastValue === value) {
        return false;
      }
      this.lastValue = value;
      return true;
    }

    /**
     * Fire the actual request
     */
  }, {
    key: "fire",
    value: function fire() {
      var _this2 = this;
      // Element removed from DOM, don't fire
      if (!this.isConnected()) {
        return;
      }

      // Abort previous request if still pending
      if (this.lastRequest && this.lastRequest.abort) {
        this.lastRequest.abort();
      }
      this.fired = true;
      this.lastRequest = _request_builder__WEBPACK_IMPORTED_MODULE_0__.RequestBuilder.fromElement(this.element);

      // Setup throttle window
      if (this.config.throttle > 0) {
        this.throttled = true;
        this.throttleTimer = setTimeout(function () {
          _this2.throttled = false;
        }, this.config.throttle);
      }
    }

    /**
     * Observe element visibility for revealed/intersect events
     */
  }, {
    key: "observeVisibility",
    value: function observeVisibility() {
      var _this3 = this;
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          // Element removed, disconnect
          if (!_this3.isConnected()) {
            observer.disconnect();
            return;
          }
          if (entry.isIntersecting) {
            (0,_util__WEBPACK_IMPORTED_MODULE_1__.dispatch)('ajax:trigger', {
              target: _this3.element
            });
            if (_this3.config.once || _this3.config.event === 'intersect') {
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
  }, {
    key: "startPolling",
    value: function startPolling() {
      var _this4 = this;
      var intervalId = setInterval(function () {
        // Element removed from DOM, stop polling
        if (!_this4.isConnected()) {
          clearInterval(intervalId);
          return;
        }

        // Only fire when page is visible
        if (!document.hidden) {
          (0,_util__WEBPACK_IMPORTED_MODULE_1__.dispatch)('ajax:trigger', {
            target: _this4.element
          });
        }
      }, this.config.poll);
    }
  }]);
}();

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/extras/attach-loader.js"
/*!**********************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/extras/attach-loader.js ***!
  \**********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AttachLoader: () => (/* binding */ AttachLoader)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util */ "./vendor/larajax/larajax/resources/src/util/index.js");
var _templateObject;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var AttachLoader = /*#__PURE__*/function () {
  function AttachLoader() {
    _classCallCheck(this, AttachLoader);
    this.stylesheetElement = this.createStylesheetElement();
  }
  return _createClass(AttachLoader, [{
    key: "show",
    value:
    // Public
    function show(el) {
      this.installStylesheetElement();
      if (isElementInput(el)) {
        var loadEl = document.createElement('span');
        loadEl.className = 'jax-attach-loader is-inline';
        el.parentNode.insertBefore(loadEl, el.nextSibling); // insertAfter
      } else {
        el.classList.add('jax-attach-loader');
        el.disabled = true;
      }
    }
  }, {
    key: "hide",
    value: function hide(el) {
      if (isElementInput(el)) {
        if (el.nextElementSibling && el.nextElementSibling.classList.contains('jax-attach-loader')) {
          el.nextElementSibling.remove();
        }
      } else {
        el.classList.remove('jax-attach-loader');
        el.disabled = false;
      }
    }
  }, {
    key: "hideAll",
    value: function hideAll() {
      document.querySelectorAll('.jax-attach-loader.is-inline').forEach(function (el) {
        el.remove();
      });
      document.querySelectorAll('.jax-attach-loader').forEach(function (el) {
        el.classList.remove('jax-attach-loader');
        el.disabled = false;
      });
    }
  }, {
    key: "showForm",
    value: function showForm(el) {
      if (el.dataset.attachLoading !== undefined) {
        this.show(el);
      }
      if (el.matches('form')) {
        var self = this;
        el.querySelectorAll('[data-attach-loading][type=submit]').forEach(function (otherEl) {
          if (!isElementInput(otherEl)) {
            self.show(otherEl);
          }
        });
      }
    }
  }, {
    key: "hideForm",
    value: function hideForm(el) {
      if (el.dataset.attachLoading !== undefined) {
        this.hide(el);
      }
      if (el.matches('form')) {
        var self = this;
        el.querySelectorAll('[data-attach-loading]').forEach(function (otherEl) {
          if (!isElementInput(otherEl)) {
            self.hide(otherEl);
          }
        });
      }
    }

    // Private
  }, {
    key: "installStylesheetElement",
    value: function installStylesheetElement() {
      if (!AttachLoader.stylesheetReady) {
        document.head.insertBefore(this.stylesheetElement, document.head.firstChild);
        AttachLoader.stylesheetReady = true;
      }
    }
  }, {
    key: "createStylesheetElement",
    value: function createStylesheetElement() {
      var element = document.createElement('style');
      element.textContent = AttachLoader.defaultCSS;
      return element;
    }
  }], [{
    key: "defaultCSS",
    get: function get() {
      return (0,_util__WEBPACK_IMPORTED_MODULE_0__.unindent)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n        .jax-attach-loader:after {\n            content: '';\n            display: inline-block;\n            vertical-align: middle;\n            margin-left: .4em;\n            height: 1em;\n            width: 1em;\n            animation: jax-rotate-loader 0.8s infinite linear;\n            border: .2em solid currentColor;\n            border-right-color: transparent;\n            border-radius: 50%;\n            opacity: .5;\n        }\n        @keyframes jax-rotate-loader {\n            0% { transform: rotate(0deg); }\n            100%  { transform: rotate(360deg); }\n        }\n    "])));
    }
  }, {
    key: "attachLoader",
    get: function get() {
      return {
        show: function show(el) {
          new AttachLoader().show(resolveElement(el));
        },
        hide: function hide(el) {
          new AttachLoader().hide(resolveElement(el));
        },
        hideAll: function hideAll() {
          new AttachLoader().hideAll();
        }
      };
    }
  }]);
}();
_defineProperty(AttachLoader, "stylesheetReady", false);
function isElementInput(el) {
  return ['input', 'select', 'textarea'].includes((el.tagName || '').toLowerCase());
}
function resolveElement(el) {
  if (typeof el === 'string') {
    el = document.querySelector(el);
  }
  if (!el) {
    throw new Error("Invalid element for attach loader.");
  }
  return el;
}

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/extras/controller.js"
/*!*******************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/extras/controller.js ***!
  \*******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Controller: () => (/* binding */ Controller)
/* harmony export */ });
/* harmony import */ var _validator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validator */ "./vendor/larajax/larajax/resources/src/extras/validator.js");
/* harmony import */ var _attach_loader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./attach-loader */ "./vendor/larajax/larajax/resources/src/extras/attach-loader.js");
/* harmony import */ var _flash_message__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./flash-message */ "./vendor/larajax/larajax/resources/src/extras/flash-message.js");
/* harmony import */ var _util_events__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/events */ "./vendor/larajax/larajax/resources/src/util/events.js");
/* harmony import */ var _util_referrer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../util/referrer */ "./vendor/larajax/larajax/resources/src/util/referrer.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }





var Controller = /*#__PURE__*/function () {
  function Controller() {
    var _this = this;
    _classCallCheck(this, Controller);
    this.started = false;

    // Progress bar default value
    this.enableProgressBar = function (event) {
      var options = event.detail.context.options;
      if (options.progressBar === null) {
        options.progressBar = true;
      }
    };

    // Attach loader
    this.showAttachLoader = function (event) {
      _this.attachLoader.showForm(event.target);
    };
    this.hideAttachLoader = function (event) {
      _this.attachLoader.hideForm(event.target);
    };
    this.hideAllAttachLoaders = function (event) {
      _this.attachLoader.hideAll();
    };

    // Validator
    this.validatorSubmit = function (event) {
      _this.validator.submit(event.target);
    };
    this.validatorValidate = function (event) {
      _this.validator.validate(event.target, event.detail.fields, event.detail.message, shouldShowFlashMessage(event.detail.context.options.flash, 'validate'));
    };

    // Flash message
    this.flashMessageBind = function (event) {
      var options = event.detail.context.options;
      if (options.flash) {
        options.handleErrorMessage = function (message) {
          if (message && shouldShowFlashMessage(options.flash, 'error') || shouldShowFlashMessage(options.flash, 'validate')) {
            _this.flashMessage.show({
              message: message,
              type: 'error'
            });
          }
        };
        options.handleFlashMessage = function (message, type) {
          if (message && shouldShowFlashMessage(options.flash, type)) {
            _this.flashMessage.show({
              message: message,
              type: type
            });
          }
        };
      }
      var context = event.detail;
      options.handleProgressMessage = function (message, isDone) {
        if (!isDone) {
          context.progressMessageId = _this.flashMessage.show({
            message: message,
            type: 'loading',
            interval: 10
          });
        } else {
          _this.flashMessage.show(context.progressMessageId ? {
            replace: context.progressMessageId
          } : {
            hideAll: true
          });
          context = null;
        }
      };
    };
    this.flashMessageRender = function (event) {
      _this.flashMessage.render();
    };
    this.hideAllFlashMessages = function (event) {
      _this.flashMessage.hideAll();
    };

    // Browser redirect
    this.handleBrowserRedirect = function (event) {
      if (event.defaultPrevented) {
        return;
      }
      var href = (0,_util_referrer__WEBPACK_IMPORTED_MODULE_4__.getReferrerUrl)();
      if (!href) {
        return;
      }
      event.preventDefault();
      if (jax.useTurbo && jax.useTurbo()) {
        jax.visit(href);
      } else {
        location.assign(href);
      }
    };
  }
  return _createClass(Controller, [{
    key: "start",
    value: function start() {
      if (!this.started) {
        // Progress bar
        addEventListener('ajax:setup', this.enableProgressBar);

        // Attach loader
        this.attachLoader = new _attach_loader__WEBPACK_IMPORTED_MODULE_1__.AttachLoader();
        _util_events__WEBPACK_IMPORTED_MODULE_3__.Events.on(document, 'ajax:promise', 'form, [data-attach-loading]', this.showAttachLoader);
        _util_events__WEBPACK_IMPORTED_MODULE_3__.Events.on(document, 'ajax:fail', 'form, [data-attach-loading]', this.hideAttachLoader);
        _util_events__WEBPACK_IMPORTED_MODULE_3__.Events.on(document, 'ajax:done', 'form, [data-attach-loading]', this.hideAttachLoader);
        addEventListener('page:before-cache', this.hideAllAttachLoaders);

        // Validator
        this.validator = new _validator__WEBPACK_IMPORTED_MODULE_0__.Validator();
        _util_events__WEBPACK_IMPORTED_MODULE_3__.Events.on(document, 'ajax:before-validate', '[data-request-validate]', this.validatorValidate);
        _util_events__WEBPACK_IMPORTED_MODULE_3__.Events.on(document, 'ajax:promise', '[data-request-validate]', this.validatorSubmit);

        // Flash message
        this.flashMessage = new _flash_message__WEBPACK_IMPORTED_MODULE_2__.FlashMessage();
        addEventListener('render', this.flashMessageRender);
        addEventListener('ajax:setup', this.flashMessageBind);
        addEventListener('page:before-cache', this.hideAllFlashMessages);

        // Browser redirect
        _util_events__WEBPACK_IMPORTED_MODULE_3__.Events.on(document, 'click', '[data-browser-redirect-back]', this.handleBrowserRedirect);
        this.started = true;
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      if (this.started) {
        // Progress bar
        removeEventListener('ajax:setup', this.enableProgressBar);

        // Attach loader
        this.attachLoader = null;
        _util_events__WEBPACK_IMPORTED_MODULE_3__.Events.off(document, 'ajax:promise', 'form, [data-attach-loading]', this.showAttachLoader);
        _util_events__WEBPACK_IMPORTED_MODULE_3__.Events.off(document, 'ajax:fail', 'form, [data-attach-loading]', this.hideAttachLoader);
        _util_events__WEBPACK_IMPORTED_MODULE_3__.Events.off(document, 'ajax:done', 'form, [data-attach-loading]', this.hideAttachLoader);
        removeEventListener('page:before-cache', this.hideAllAttachLoaders);

        // Validator
        this.validator = null;
        _util_events__WEBPACK_IMPORTED_MODULE_3__.Events.off(document, 'ajax:before-validate', '[data-request-validate]', this.validatorValidate);
        _util_events__WEBPACK_IMPORTED_MODULE_3__.Events.off(document, 'ajax:promise', '[data-request-validate]', this.validatorSubmit);

        // Flash message
        this.flashMessage = null;
        removeEventListener('render', this.flashMessageRender);
        removeEventListener('ajax:setup', this.flashMessageBind);
        removeEventListener('page:before-cache', this.hideAllFlashMessages);

        // Browser redirect
        _util_events__WEBPACK_IMPORTED_MODULE_3__.Events.off(document, 'click', '[data-browser-redirect-back]', this.handleBrowserRedirect);
        this.started = false;
      }
    }
  }]);
}();
function shouldShowFlashMessage(value, type) {
  // Validation messages are not included by default
  if (value === true && type !== 'validate') {
    return true;
  }
  if (typeof value !== 'string') {
    return false;
  }
  if (value === '*') {
    return true;
  }
  var result = false;
  value.split(',').forEach(function (validType) {
    if (validType.trim() === type) {
      result = true;
    }
  });
  return result;
}

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/extras/flash-message.js"
/*!**********************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/extras/flash-message.js ***!
  \**********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FlashMessage: () => (/* binding */ FlashMessage)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util */ "./vendor/larajax/larajax/resources/src/util/index.js");
var _templateObject;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var FlashMessage = /*#__PURE__*/function () {
  function FlashMessage() {
    _classCallCheck(this, FlashMessage);
    this.queue = [];
    this.lastUniqueId = 0;
    this.displayedMessage = null;
    this.stylesheetElement = this.createStylesheetElement();
  }
  return _createClass(FlashMessage, [{
    key: "runQueue",
    value: function runQueue() {
      if (this.displayedMessage) {
        return;
      }
      var options = this.queue.shift();
      if (options === undefined) {
        return;
      }
      this.buildFlashMessage(options);
    }
  }, {
    key: "clearQueue",
    value: function clearQueue() {
      this.queue = [];
      if (this.displayedMessage && this.displayedMessage.uniqueId) {
        this.hide(this.displayedMessage.uniqueId, true);
      }
    }
  }, {
    key: "removeFromQueue",
    value: function removeFromQueue(uniqueId) {
      for (var index = 0; index < this.queue.length; index++) {
        if (this.queue[index].uniqueId == uniqueId) {
          this.queue.splice(index, 1);
          return;
        }
      }
    }
  }, {
    key: "show",
    value: function show() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.installStylesheetElement();
      var _options$message = options.message,
        message = _options$message === void 0 ? '' : _options$message,
        _options$type = options.type,
        type = _options$type === void 0 ? 'info' : _options$type,
        _options$replace = options.replace,
        replace = _options$replace === void 0 ? null : _options$replace,
        _options$hideAll = options.hideAll,
        hideAll = _options$hideAll === void 0 ? false : _options$hideAll;

      // Legacy API
      if (options.text) message = options.text;
      if (options["class"]) type = options["class"];

      // Clear all messages
      if (hideAll || type === 'error' || type === 'loading') {
        this.clearQueue();
      }

      // Replace or remove a message
      if (replace) {
        if (this.displayedMessage && replace === this.displayedMessage.uniqueId) {
          this.hide(replace, true);
        } else {
          this.removeFromQueue(replace);
        }
      }

      // Nothing to show
      if (!message) {
        return;
      }
      var uniqueId = this.makeUniqueId();
      this.queue.push(_objectSpread(_objectSpread({}, options), {}, {
        uniqueId: uniqueId
      }));
      this.runQueue();
      return uniqueId;
    }
  }, {
    key: "makeUniqueId",
    value: function makeUniqueId() {
      return ++this.lastUniqueId;
    }
  }, {
    key: "buildFlashMessage",
    value: function buildFlashMessage() {
      var _this = this;
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _options$message2 = options.message,
        message = _options$message2 === void 0 ? '' : _options$message2,
        _options$type2 = options.type,
        type = _options$type2 === void 0 ? 'info' : _options$type2,
        _options$target = options.target,
        target = _options$target === void 0 ? null : _options$target,
        _options$interval = options.interval,
        interval = _options$interval === void 0 ? 3 : _options$interval;

      // Legacy API
      if (options.text) message = options.text;
      if (options["class"]) type = options["class"];

      // Idempotence
      if (target) {
        target.removeAttribute('data-control');
      }

      // Inject element
      var flashElement = this.createFlashElement(message, type);
      this.createMessagesElement().appendChild(flashElement);
      this.displayedMessage = {
        uniqueId: options.uniqueId,
        element: flashElement,
        options: options
      };

      // Remove logic
      var _remove = function remove(event) {
        clearInterval(timer);
        flashElement.removeEventListener('click', pause);
        flashElement.removeEventListener('extras:flash-remove', _remove);
        flashElement.querySelector('.flash-close').removeEventListener('click', _remove);
        flashElement.classList.remove('flash-show');
        if (event && event.detail.isReplace) {
          flashElement.remove();
          _this.displayedMessage = null;
          _this.runQueue();
        } else {
          setTimeout(function () {
            flashElement.remove();
            _this.displayedMessage = null;
            _this.runQueue();
          }, 600);
        }
      };

      // Pause logic
      var pause = function pause() {
        clearInterval(timer);
      };

      // Events
      flashElement.addEventListener('click', pause, {
        once: true
      });
      flashElement.addEventListener('extras:flash-remove', _remove, {
        once: true
      });
      flashElement.querySelector('.flash-close').addEventListener('click', _remove, {
        once: true
      });

      // Timeout
      var timer;
      if (interval && interval !== 0) {
        timer = setTimeout(_remove, interval * 1000);
      }
      setTimeout(function () {
        flashElement.classList.add('flash-show');
      }, 20);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      document.querySelectorAll('[data-control=flash-message]').forEach(function (el) {
        _this2.show(_objectSpread(_objectSpread({}, el.dataset), {}, {
          target: el,
          message: el.innerHTML
        }));
        el.remove();
      });
    }
  }, {
    key: "hide",
    value: function hide(uniqueId, isReplace) {
      if (this.displayedMessage && uniqueId === this.displayedMessage.uniqueId) {
        this.displayedMessage.element.dispatchEvent(new CustomEvent('extras:flash-remove', {
          detail: {
            isReplace: isReplace
          }
        }));
      }
    }
  }, {
    key: "hideAll",
    value: function hideAll() {
      this.clearQueue();
      this.displayedMessage = null;
      document.querySelectorAll('.jax-flash-message, [data-control=flash-message]').forEach(function (el) {
        el.remove();
      });
    }
  }, {
    key: "createFlashElement",
    value: function createFlashElement(message, type) {
      var element = document.createElement('div');
      var loadingHtml = type === 'loading' ? '<span class="flash-loader"></span>' : '';
      var closeHtml = '<a class="flash-close"></a>';
      element.className = 'jax-flash-message ' + type;
      element.innerHTML = loadingHtml + '<span class="flash-message">' + message + '</span>' + closeHtml;
      return element;
    }

    // Private
  }, {
    key: "installStylesheetElement",
    value: function installStylesheetElement() {
      if (!FlashMessage.stylesheetReady) {
        document.head.insertBefore(this.stylesheetElement, document.head.firstChild);
        FlashMessage.stylesheetReady = true;
      }
    }
  }, {
    key: "createStylesheetElement",
    value: function createStylesheetElement() {
      var element = document.createElement('style');
      element.textContent = FlashMessage.defaultCSS;
      return element;
    }
  }, {
    key: "createMessagesElement",
    value: function createMessagesElement() {
      var found = document.querySelector('.jax-flash-messages');
      if (found) {
        return found;
      }
      var element = document.createElement('div');
      element.className = 'jax-flash-messages';
      document.body.appendChild(element);
      return element;
    }
  }], [{
    key: "defaultCSS",
    get: function get() {
      return (0,_util__WEBPACK_IMPORTED_MODULE_0__.unindent)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n        .jax-flash-message {\n            display: flex;\n            position: fixed;\n            z-index: 10300;\n            width: 500px;\n            left: 50%;\n            top: 50px;\n            margin-left: -250px;\n            color: #fff;\n            font-size: 1rem;\n            padding: 10px 15px;\n            border-radius: 5px;\n            opacity: 0;\n            transition: all 0.5s, width 0s;\n            transform: scale(0.9);\n        }\n        @media (max-width: 768px) {\n            .jax-flash-message {\n                left: 1rem;\n                right: 1rem;\n                top: 1rem;\n                margin-left: 0;\n                width: auto;\n            }\n        }\n        .jax-flash-message.flash-show {\n            opacity: 1;\n            transform: scale(1);\n        }\n        .jax-flash-message.loading {\n            transition: opacity 0.2s;\n            transform: scale(1);\n        }\n        .jax-flash-message.success {\n            background: #86cb43;\n        }\n        .jax-flash-message.error {\n            background: #cc3300;\n        }\n        .jax-flash-message.warning {\n            background: #f0ad4e;\n        }\n        .jax-flash-message.info, .jax-flash-message.loading {\n            background: #5fb6f5;\n        }\n        .jax-flash-message span.flash-message {\n            flex-grow: 1;\n        }\n        .jax-flash-message a.flash-close {\n            box-sizing: content-box;\n            width: 1em;\n            height: 1em;\n            padding: .25em .25em;\n            background: transparent url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23FFF'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e\") center/1em auto no-repeat;\n            border: 0;\n            border-radius: .25rem;\n            opacity: .5;\n            text-decoration: none;\n            cursor: pointer;\n        }\n        .jax-flash-message a.flash-close:hover,\n        .jax-flash-message a.flash-close:focus {\n            opacity: 1;\n        }\n        .jax-flash-message.loading a.flash-close {\n            display: none;\n        }\n        .jax-flash-message span.flash-loader {\n            margin-right: 1em;\n        }\n        .jax-flash-message span.flash-loader:after {\n            position: relative;\n            top: 2px;\n            content: '';\n            display: inline-block;\n            height: 1.2em;\n            width: 1.2em;\n            animation: jax-flash-loader 0.8s infinite linear;\n            border: .2em solid currentColor;\n            border-right-color: transparent;\n            border-radius: 50%;\n            opacity: .5;\n        }\n        html[data-turbo-preview] .jax-flash-message {\n            opacity: 0;\n        }\n        @keyframes jax-flash-loader {\n            0% { transform: rotate(0deg); }\n            100%  { transform: rotate(360deg); }\n        }\n    "])));
    }
  }, {
    key: "flashMsg",
    value: function flashMsg(options) {
      return getOrCreateInstance().show(options);
    }
  }]);
}();
_defineProperty(FlashMessage, "instance", null);
_defineProperty(FlashMessage, "stylesheetReady", false);
function getOrCreateInstance() {
  if (!FlashMessage.instance) {
    FlashMessage.instance = new FlashMessage();
  }
  return FlashMessage.instance;
}

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/extras/namespace.js"
/*!******************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/extras/namespace.js ***!
  \******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _controller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./controller */ "./vendor/larajax/larajax/resources/src/extras/controller.js");
/* harmony import */ var _flash_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./flash-message */ "./vendor/larajax/larajax/resources/src/extras/flash-message.js");
/* harmony import */ var _progress_bar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./progress-bar */ "./vendor/larajax/larajax/resources/src/extras/progress-bar.js");
/* harmony import */ var _attach_loader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./attach-loader */ "./vendor/larajax/larajax/resources/src/extras/attach-loader.js");




var controller = new _controller__WEBPACK_IMPORTED_MODULE_0__.Controller();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  controller: controller,
  flashMsg: _flash_message__WEBPACK_IMPORTED_MODULE_1__.FlashMessage.flashMsg,
  progressBar: _progress_bar__WEBPACK_IMPORTED_MODULE_2__.ProgressBar.progressBar,
  attachLoader: _attach_loader__WEBPACK_IMPORTED_MODULE_3__.AttachLoader.attachLoader,
  start: function start() {
    controller.start();
  },
  stop: function stop() {
    controller.stop();
  }
});

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/extras/progress-bar.js"
/*!*********************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/extras/progress-bar.js ***!
  \*********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ProgressBar: () => (/* binding */ ProgressBar)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util */ "./vendor/larajax/larajax/resources/src/util/index.js");
var _templateObject;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var ProgressBar = /*#__PURE__*/function () {
  function ProgressBar() {
    var _this = this;
    _classCallCheck(this, ProgressBar);
    this.stylesheetElement = this.createStylesheetElement();
    this.progressElement = this.createProgressElement();
    this.hiding = false;
    this.value = 0;
    this.visible = false;
    this.trickle = function () {
      _this.setValue(_this.value + Math.random() / 100);
    };
  }
  return _createClass(ProgressBar, [{
    key: "show",
    value: function show() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
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
  }, {
    key: "hide",
    value: function hide() {
      var _this2 = this;
      if (this.visible && !this.hiding) {
        this.hiding = true;
        this.fadeProgressElement(function () {
          _this2.uninstallProgressElement();
          _this2.stopTrickling();
          _this2.visible = false;
          _this2.hiding = false;
        });
      }
    }
  }, {
    key: "setValue",
    value: function setValue(value) {
      this.value = value;
      this.refresh();
    }

    // Private
  }, {
    key: "installStylesheetElement",
    value: function installStylesheetElement() {
      if (!ProgressBar.stylesheetReady) {
        document.head.insertBefore(this.stylesheetElement, document.head.firstChild);
        ProgressBar.stylesheetReady = true;
      }
    }
  }, {
    key: "installProgressElement",
    value: function installProgressElement() {
      this.progressElement.style.width = "0";
      this.progressElement.style.opacity = "1";
      document.documentElement.insertBefore(this.progressElement, document.body);
      this.refresh();
    }
  }, {
    key: "fadeProgressElement",
    value: function fadeProgressElement(callback) {
      this.progressElement.style.opacity = "0";
      setTimeout(callback, ProgressBar.animationDuration * 1.5);
    }
  }, {
    key: "uninstallProgressElement",
    value: function uninstallProgressElement() {
      if (this.progressElement.parentNode) {
        document.documentElement.removeChild(this.progressElement);
      }
    }
  }, {
    key: "startTrickling",
    value: function startTrickling() {
      if (!this.trickleInterval) {
        this.trickleInterval = setInterval(this.trickle, ProgressBar.animationDuration);
      }
    }
  }, {
    key: "stopTrickling",
    value: function stopTrickling() {
      clearInterval(this.trickleInterval);
      delete this.trickleInterval;
    }
  }, {
    key: "refresh",
    value: function refresh() {
      var _this3 = this;
      requestAnimationFrame(function () {
        _this3.progressElement.style.width = "".concat(10 + _this3.value * 90, "%");
      });
    }
  }, {
    key: "createStylesheetElement",
    value: function createStylesheetElement() {
      var element = document.createElement('style');
      element.textContent = ProgressBar.defaultCSS;
      return element;
    }
  }, {
    key: "createProgressElement",
    value: function createProgressElement() {
      var element = document.createElement('div');
      element.className = 'jax-progress-bar';
      return element;
    }
  }], [{
    key: "defaultCSS",
    get: function get() {
      return (0,_util__WEBPACK_IMPORTED_MODULE_0__.unindent)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n        .jax-progress-bar {\n            position: fixed;\n            display: block;\n            top: 0;\n            left: 0;\n            height: 3px;\n            background: #0076ff;\n            z-index: 9999;\n            transition:\n                width ", "ms ease-out,\n                opacity ", "ms ", "ms ease-in;\n            transform: translate3d(0, 0, 0);\n        }\n    "])), ProgressBar.animationDuration, ProgressBar.animationDuration / 2, ProgressBar.animationDuration / 2);
    }
  }, {
    key: "progressBar",
    get: function get() {
      return {
        show: function show() {
          var instance = getOrCreateInstance();
          instance.setValue(0);
          instance.show();
        },
        hide: function hide() {
          var instance = getOrCreateInstance();
          instance.setValue(100);
          instance.hide();
        }
      };
    }
  }]);
}();
_defineProperty(ProgressBar, "instance", null);
_defineProperty(ProgressBar, "stylesheetReady", false);
_defineProperty(ProgressBar, "animationDuration", 300);
function getOrCreateInstance() {
  if (!ProgressBar.instance) {
    ProgressBar.instance = new ProgressBar();
  }
  return ProgressBar.instance;
}

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/extras/validator.js"
/*!******************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/extras/validator.js ***!
  \******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Validator: () => (/* binding */ Validator)
/* harmony export */ });
/* harmony import */ var _util_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/events */ "./vendor/larajax/larajax/resources/src/util/events.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var Validator = /*#__PURE__*/function () {
  function Validator() {
    _classCallCheck(this, Validator);
  }
  return _createClass(Validator, [{
    key: "submit",
    value: function submit(el) {
      var form = el.closest('form');
      if (!form) {
        return;
      }
      form.querySelectorAll('[data-validate-for]').forEach(function (el) {
        el.classList.remove('jax-visible');
      });
      form.querySelectorAll('[data-validate-error]').forEach(function (el) {
        el.classList.remove('jax-visible');
      });
    }
  }, {
    key: "validate",
    value: function validate(el, fields, errorMsg, allowDefault) {
      var form = el.closest('form'),
        messages = [];
      if (!form) {
        return;
      }
      for (var fieldName in fields) {
        // Build messages
        var fieldMessages = fields[fieldName];
        messages = [].concat(_toConsumableArray(messages), _toConsumableArray(fieldMessages));

        // Display message next to field
        var field = form.querySelector('[data-validate-for="' + fieldName + '"]');
        if (field) {
          if (!field.innerHTML || field.dataset.emptyMode) {
            field.dataset.emptyMode = true;
            field.innerHTML = fieldMessages.join(', ');
          }
          field.classList.add('jax-visible');
        }
      }
      var container = form.querySelector('[data-validate-error]');
      if (container) {
        container.classList.add('jax-visible');

        // Messages found inside the container
        var oldMessages = container.querySelectorAll('[data-message]');
        if (oldMessages.length > 0) {
          var clone = oldMessages[0];
          messages.forEach(function (message) {
            var newNode = clone.cloneNode(true);
            newNode.innerHTML = message;
            // Insert after
            clone.parentNode.insertBefore(newNode, clone.nextSibling);
          });
          oldMessages.forEach(function (el) {
            el.remove();
          });
        }
        // Just use the container to set the value
        else {
          container.innerHTML = errorMsg;
        }
      }

      // Flash messages want a pass here
      if (allowDefault) {
        return;
      }

      // Prevent default error behavior
      _util_events__WEBPACK_IMPORTED_MODULE_0__.Events.one(form, 'ajax:request-error', function (event) {
        event.preventDefault();
      });
    }
  }]);
}();

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/framework-bundle.js"
/*!******************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/framework-bundle.js ***!
  \******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_namespace__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/namespace */ "./vendor/larajax/larajax/resources/src/core/namespace.js");
/* harmony import */ var _request_namespace__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./request/namespace */ "./vendor/larajax/larajax/resources/src/request/namespace.js");
/* harmony import */ var _extras_namespace__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./extras/namespace */ "./vendor/larajax/larajax/resources/src/extras/namespace.js");
/* harmony import */ var _observe_namespace__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./observe/namespace */ "./vendor/larajax/larajax/resources/src/observe/namespace.js");
/* harmony import */ var _turbo_namespace__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./turbo/namespace */ "./vendor/larajax/larajax/resources/src/turbo/namespace.js");
/* harmony import */ var _observe_control_base__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./observe/control-base */ "./vendor/larajax/larajax/resources/src/observe/control-base.js");
/* harmony import */ var _request_asset_manager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./request/asset-manager */ "./vendor/larajax/larajax/resources/src/request/asset-manager.js");
/* harmony import */ var _util_events__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./util/events */ "./vendor/larajax/larajax/resources/src/util/events.js");
/* harmony import */ var _util_wait__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./util/wait */ "./vendor/larajax/larajax/resources/src/util/wait.js");
/**
 * --------------------------------------------------------------------------
 * Larajax: Frontend JavaScript Framework
 * https://larajax.org
 * --------------------------------------------------------------------------
 * Copyright 2025 Responsiv Pty. Ltd.
 * --------------------------------------------------------------------------
 */










if (!window.jax) {
  window.jax = {};
}

// Request
window.jax.AjaxRequest = _request_namespace__WEBPACK_IMPORTED_MODULE_1__["default"];
window.jax.AssetManager = _request_asset_manager__WEBPACK_IMPORTED_MODULE_6__.AssetManager;
window.jax.ajax = _request_namespace__WEBPACK_IMPORTED_MODULE_1__["default"].send;

// Core
window.jax.AjaxFramework = _core_namespace__WEBPACK_IMPORTED_MODULE_0__["default"];
window.jax.request = _core_namespace__WEBPACK_IMPORTED_MODULE_0__["default"].requestElement;
window.jax.parseJSON = _core_namespace__WEBPACK_IMPORTED_MODULE_0__["default"].parseJSON;
window.jax.values = _core_namespace__WEBPACK_IMPORTED_MODULE_0__["default"].serializeAsJSON;

// Extras
window.jax.AjaxExtras = _extras_namespace__WEBPACK_IMPORTED_MODULE_2__["default"];
window.jax.flashMsg = _extras_namespace__WEBPACK_IMPORTED_MODULE_2__["default"].flashMsg;
window.jax.progressBar = _extras_namespace__WEBPACK_IMPORTED_MODULE_2__["default"].progressBar;
window.jax.attachLoader = _extras_namespace__WEBPACK_IMPORTED_MODULE_2__["default"].attachLoader;

// Observe
window.jax.AjaxObserve = _observe_namespace__WEBPACK_IMPORTED_MODULE_3__["default"];
window.jax.ControlBase = _observe_control_base__WEBPACK_IMPORTED_MODULE_5__.ControlBase;
window.jax.registerControl = _observe_namespace__WEBPACK_IMPORTED_MODULE_3__["default"].registerControl;
window.jax.importControl = _observe_namespace__WEBPACK_IMPORTED_MODULE_3__["default"].importControl;
window.jax.observeControl = _observe_namespace__WEBPACK_IMPORTED_MODULE_3__["default"].observeControl;
window.jax.fetchControl = _observe_namespace__WEBPACK_IMPORTED_MODULE_3__["default"].fetchControl;
window.jax.fetchControls = _observe_namespace__WEBPACK_IMPORTED_MODULE_3__["default"].fetchControls;

// Turbo
window.jax.AjaxTurbo = _turbo_namespace__WEBPACK_IMPORTED_MODULE_4__["default"];
window.jax.useTurbo = _turbo_namespace__WEBPACK_IMPORTED_MODULE_4__["default"].isEnabled;
window.jax.visit = _turbo_namespace__WEBPACK_IMPORTED_MODULE_4__["default"].visit;
window.jax.pageReady = _turbo_namespace__WEBPACK_IMPORTED_MODULE_4__["default"].pageReady;

// Util
window.jax.Events = _util_events__WEBPACK_IMPORTED_MODULE_7__.Events;
window.jax.dispatch = _util_events__WEBPACK_IMPORTED_MODULE_7__.Events.dispatch;
window.jax.trigger = _util_events__WEBPACK_IMPORTED_MODULE_7__.Events.trigger;
window.jax.on = _util_events__WEBPACK_IMPORTED_MODULE_7__.Events.on;
window.jax.off = _util_events__WEBPACK_IMPORTED_MODULE_7__.Events.off;
window.jax.one = _util_events__WEBPACK_IMPORTED_MODULE_7__.Events.one;
window.jax.waitFor = _util_wait__WEBPACK_IMPORTED_MODULE_8__.waitFor;

// Auto-start all modules
_core_namespace__WEBPACK_IMPORTED_MODULE_0__["default"].start();
_extras_namespace__WEBPACK_IMPORTED_MODULE_2__["default"].start();
_observe_namespace__WEBPACK_IMPORTED_MODULE_3__["default"].start();
_turbo_namespace__WEBPACK_IMPORTED_MODULE_4__["default"].start();

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/observe/application.js"
/*!*********************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/observe/application.js ***!
  \*********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Application: () => (/* binding */ Application)
/* harmony export */ });
/* harmony import */ var _dispatcher__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dispatcher */ "./vendor/larajax/larajax/resources/src/observe/dispatcher.js");
/* harmony import */ var _container__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./container */ "./vendor/larajax/larajax/resources/src/observe/container.js");
/* harmony import */ var _util_wait__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/wait */ "./vendor/larajax/larajax/resources/src/util/wait.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



var Application = /*#__PURE__*/function () {
  function Application() {
    _classCallCheck(this, Application);
    this.started = false;
    this.element = document.documentElement;
    this.dispatcher = new _dispatcher__WEBPACK_IMPORTED_MODULE_0__.Dispatcher(this);
    this.container = new _container__WEBPACK_IMPORTED_MODULE_1__.Container(this);
  }
  return _createClass(Application, [{
    key: "startAsync",
    value: function startAsync() {
      var _this = this;
      (0,_util_wait__WEBPACK_IMPORTED_MODULE_2__.domReady)().then(function () {
        _this.start();
      });
    }
  }, {
    key: "start",
    value: function start() {
      if (!this.started) {
        this.started = true;
        this.dispatcher.start();
        this.container.start();
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      if (this.started) {
        this.dispatcher.stop();
        this.container.stop();
        this.started = false;
      }
    }
  }, {
    key: "register",
    value: function register(identifier, controlConstructor) {
      this.load({
        identifier: identifier,
        controlConstructor: controlConstructor
      });
    }
  }, {
    key: "observe",
    value: function observe(element, identifier) {
      var observer = this.container.scopeObserver;
      observer.elementMatchedValue(element, observer.parseValueForToken({
        element: element,
        content: identifier
      }));
      var foundControl = this.getControlForElementAndIdentifier(element, identifier);
      if (!element.matches("[data-control~=\"".concat(identifier, "\"]"))) {
        element.dataset.control = ((element.dataset.control || '') + ' ' + identifier).trim();
      }
      return foundControl;
    }
  }, {
    key: "import",
    value: function _import(identifier) {
      var module = this.container.getModuleForIdentifier(identifier);
      if (!module) {
        throw new Error("Control is not registered [".concat(identifier, "]"));
      }
      return module.controlConstructor;
    }
  }, {
    key: "fetch",
    value: function fetch(element, identifier) {
      if (typeof element === 'string') {
        element = document.querySelector(element);
      }
      if (!identifier) {
        identifier = element.dataset.control;
      }
      return element ? this.getControlForElementAndIdentifier(element, identifier) : null;
    }
  }, {
    key: "fetchAll",
    value: function fetchAll(elements, identifier) {
      var _this2 = this;
      if (typeof elements === 'string') {
        elements = document.querySelectorAll(elements);
      }
      var result = [];
      elements.forEach(function (element) {
        var control = _this2.fetch(element, identifier);
        if (control) {
          result.push(control);
        }
      });
      return result;
    }
  }, {
    key: "load",
    value: function load(head) {
      var _this3 = this;
      for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        rest[_key - 1] = arguments[_key];
      }
      var definitions = Array.isArray(head) ? head : [head].concat(rest);
      definitions.forEach(function (definition) {
        if (definition.controlConstructor.shouldLoad) {
          _this3.container.loadDefinition(definition);
        }
      });
    }
  }, {
    key: "unload",
    value: function unload(head) {
      var _this4 = this;
      for (var _len2 = arguments.length, rest = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        rest[_key2 - 1] = arguments[_key2];
      }
      var identifiers = Array.isArray(head) ? head : [head].concat(rest);
      identifiers.forEach(function (identifier) {
        return _this4.container.unloadIdentifier(identifier);
      });
    }

    // Controls
  }, {
    key: "controls",
    get: function get() {
      return this.container.contexts.map(function (context) {
        return context.control;
      });
    }
  }, {
    key: "getControlForElementAndIdentifier",
    value: function getControlForElementAndIdentifier(element, identifier) {
      var context = this.container.getContextForElementAndIdentifier(element, identifier);
      return context ? context.control : null;
    }

    // Error handling
  }, {
    key: "handleError",
    value: function handleError(error, message, detail) {
      var _a;
      console.error("%s\n\n%o\n\n%o", message, error, detail);
      (_a = window.onerror) === null || _a === void 0 ? void 0 : _a.call(window, message, "", 0, 0, error);
    }
  }]);
}();

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/observe/container.js"
/*!*******************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/observe/container.js ***!
  \*******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Container: () => (/* binding */ Container)
/* harmony export */ });
/* harmony import */ var _module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./module */ "./vendor/larajax/larajax/resources/src/observe/module.js");
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scope */ "./vendor/larajax/larajax/resources/src/observe/scope.js");
/* harmony import */ var _scope_observer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scope-observer */ "./vendor/larajax/larajax/resources/src/observe/scope-observer.js");
/* harmony import */ var _util_multimap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util/multimap */ "./vendor/larajax/larajax/resources/src/observe/util/multimap.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }




var Container = /*#__PURE__*/function () {
  function Container(application) {
    _classCallCheck(this, Container);
    this.application = application;
    this.scopeObserver = new _scope_observer__WEBPACK_IMPORTED_MODULE_2__.ScopeObserver(this.element, this);
    this.scopesByIdentifier = new _util_multimap__WEBPACK_IMPORTED_MODULE_3__.Multimap();
    this.modulesByIdentifier = new Map();
  }
  return _createClass(Container, [{
    key: "element",
    get: function get() {
      return this.application.element;
    }
  }, {
    key: "modules",
    get: function get() {
      return Array.from(this.modulesByIdentifier.values());
    }
  }, {
    key: "contexts",
    get: function get() {
      return this.modules.reduce(function (contexts, module) {
        return contexts.concat(module.contexts);
      }, []);
    }
  }, {
    key: "start",
    value: function start() {
      this.scopeObserver.start();
    }
  }, {
    key: "stop",
    value: function stop() {
      this.scopeObserver.stop();
    }
  }, {
    key: "loadDefinition",
    value: function loadDefinition(definition) {
      this.unloadIdentifier(definition.identifier);
      var module = new _module__WEBPACK_IMPORTED_MODULE_0__.Module(this.application, definition);
      this.connectModule(module);
      var afterLoad = definition.controlConstructor.afterLoad;
      if (afterLoad) {
        afterLoad.call(definition.controlConstructor, definition.identifier, this.application);
      }
    }
  }, {
    key: "unloadIdentifier",
    value: function unloadIdentifier(identifier) {
      var module = this.modulesByIdentifier.get(identifier);
      if (module) {
        this.disconnectModule(module);
      }
    }
  }, {
    key: "getModuleForIdentifier",
    value: function getModuleForIdentifier(identifier) {
      return this.modulesByIdentifier.get(identifier);
    }
  }, {
    key: "getContextForElementAndIdentifier",
    value: function getContextForElementAndIdentifier(element, identifier) {
      var module = this.modulesByIdentifier.get(identifier);
      if (module) {
        return module.contexts.find(function (context) {
          return context.element == element;
        });
      }
    }

    // Error handler delegate
  }, {
    key: "handleError",
    value: function handleError(error, message, detail) {
      this.application.handleError(error, message, detail);
    }

    // Scope observer delegate
  }, {
    key: "createScopeForElementAndIdentifier",
    value: function createScopeForElementAndIdentifier(element, identifier) {
      return new _scope__WEBPACK_IMPORTED_MODULE_1__.Scope(element, identifier);
    }
  }, {
    key: "scopeConnected",
    value: function scopeConnected(scope) {
      this.scopesByIdentifier.add(scope.identifier, scope);
      var module = this.modulesByIdentifier.get(scope.identifier);
      if (module) {
        module.connectContextForScope(scope);
      }
    }
  }, {
    key: "scopeDisconnected",
    value: function scopeDisconnected(scope) {
      this.scopesByIdentifier["delete"](scope.identifier, scope);
      var module = this.modulesByIdentifier.get(scope.identifier);
      if (module) {
        module.disconnectContextForScope(scope);
      }
    }

    // Modules
  }, {
    key: "connectModule",
    value: function connectModule(module) {
      this.modulesByIdentifier.set(module.identifier, module);
      var scopes = this.scopesByIdentifier.getValuesForKey(module.identifier);
      scopes.forEach(function (scope) {
        return module.connectContextForScope(scope);
      });
    }
  }, {
    key: "disconnectModule",
    value: function disconnectModule(module) {
      this.modulesByIdentifier["delete"](module.identifier);
      var scopes = this.scopesByIdentifier.getValuesForKey(module.identifier);
      scopes.forEach(function (scope) {
        return module.disconnectContextForScope(scope);
      });
    }
  }]);
}();

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/observe/context.js"
/*!*****************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/observe/context.js ***!
  \*****************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Context: () => (/* binding */ Context)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Context = /*#__PURE__*/function () {
  function Context(module, scope) {
    _classCallCheck(this, Context);
    this.module = module;
    this.scope = scope;
    this.control = new module.controlConstructor(this);
    try {
      this.control.initBefore();
      this.control.init();
      this.control.initAfter();
    } catch (error) {
      this.handleError(error, 'initializing control');
    }
  }
  return _createClass(Context, [{
    key: "connect",
    value: function connect() {
      try {
        this.control.connectBefore();
        this.control.connect();
        this.control.connectAfter();
      } catch (error) {
        this.handleError(error, 'connecting control');
      }
    }
  }, {
    key: "refresh",
    value: function refresh() {}
  }, {
    key: "disconnect",
    value: function disconnect() {
      try {
        this.control.disconnectBefore();
        this.control.disconnect();
        this.control.disconnectAfter();
      } catch (error) {
        this.handleError(error, 'disconnecting control');
      }
    }
  }, {
    key: "application",
    get: function get() {
      return this.module.application;
    }
  }, {
    key: "identifier",
    get: function get() {
      return this.module.identifier;
    }
  }, {
    key: "dispatcher",
    get: function get() {
      return this.application.dispatcher;
    }
  }, {
    key: "element",
    get: function get() {
      return this.scope.element;
    }
  }, {
    key: "parentElement",
    get: function get() {
      return this.element.parentElement;
    }

    // Error handling
  }, {
    key: "handleError",
    value: function handleError(error, message) {
      var detail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var identifier = this.identifier,
        control = this.control,
        element = this.element;
      detail = Object.assign({
        identifier: identifier,
        control: control,
        element: element
      }, detail);
      this.application.handleError(error, "Error ".concat(message), detail);
    }
  }]);
}();

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/observe/control-base.js"
/*!**********************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/observe/control-base.js ***!
  \**********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ControlBase: () => (/* binding */ ControlBase)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var ControlBase = /*#__PURE__*/function () {
  function ControlBase(context) {
    _classCallCheck(this, ControlBase);
    this.context = context;
    this.config = this.parseDataset(context.scope.element.dataset || {});
  }
  return _createClass(ControlBase, [{
    key: "application",
    get: function get() {
      return this.context.application;
    }
  }, {
    key: "scope",
    get: function get() {
      return this.context.scope;
    }
  }, {
    key: "element",
    get: function get() {
      return this.scope.element;
    }
  }, {
    key: "identifier",
    get: function get() {
      return this.scope.identifier;
    }
  }, {
    key: "init",
    value: function init() {
      // Set up initial control state
    }
  }, {
    key: "connect",
    value: function connect() {
      // Control is connected to the DOM
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      // Control is disconnected from the DOM
    }

    // Internal events avoid the need to call parent logic
  }, {
    key: "initBefore",
    value: function initBefore() {
      this.proxiedEvents = {};
      this.proxiedMethods = {};
    }
  }, {
    key: "initAfter",
    value: function initAfter() {}
  }, {
    key: "connectBefore",
    value: function connectBefore() {}
  }, {
    key: "connectAfter",
    value: function connectAfter() {}
  }, {
    key: "disconnectBefore",
    value: function disconnectBefore() {}
  }, {
    key: "disconnectAfter",
    value: function disconnectAfter() {
      for (var key in this.proxiedEvents) {
        this.forget.apply(this, _toConsumableArray(this.proxiedEvents[key]));
        delete this.proxiedEvents[key];
      }
      for (var _key in this.proxiedMethods) {
        this.proxiedMethods[_key] = undefined;
      }
    }

    // Events
  }, {
    key: "listen",
    value: function listen(eventName, targetOrHandler, handlerOrOptions, options) {
      if (typeof targetOrHandler === 'string') {
        jax.Events.on(this.element, eventName, targetOrHandler, this.proxy(handlerOrOptions), options);
      } else if (targetOrHandler instanceof Element) {
        jax.Events.on(targetOrHandler, eventName, this.proxy(handlerOrOptions), options);
      } else {
        jax.Events.on(this.element, eventName, this.proxy(targetOrHandler), handlerOrOptions);
      }

      // Automatic unbinding
      ControlBase.proxyCounter++;
      this.proxiedEvents[ControlBase.proxyCounter] = arguments;
    }
  }, {
    key: "forget",
    value: function forget(eventName, targetOrHandler, handlerOrOptions, options) {
      if (typeof targetOrHandler === 'string') {
        jax.Events.off(this.element, eventName, targetOrHandler, this.proxy(handlerOrOptions), options);
      } else if (targetOrHandler instanceof Element) {
        jax.Events.off(targetOrHandler, eventName, this.proxy(handlerOrOptions), options);
      } else {
        jax.Events.off(this.element, eventName, this.proxy(targetOrHandler), handlerOrOptions);
      }

      // Fills JS gap
      var compareArrays = function compareArrays(a, b) {
        if (a.length === b.length) {
          for (var i = 0; i < a.length; i++) {
            if (a[i] === b[i]) {
              return true;
            }
          }
        }
        return false;
      };

      // Seeking GC
      for (var key in this.proxiedEvents) {
        if (compareArrays(arguments, this.proxiedEvents[key])) {
          delete this.proxiedEvents[key];
        }
      }
    }
  }, {
    key: "dispatch",
    value: function dispatch(eventName) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$target = _ref.target,
        target = _ref$target === void 0 ? this.element : _ref$target,
        _ref$detail = _ref.detail,
        detail = _ref$detail === void 0 ? {} : _ref$detail,
        _ref$prefix = _ref.prefix,
        prefix = _ref$prefix === void 0 ? this.identifier : _ref$prefix,
        _ref$bubbles = _ref.bubbles,
        bubbles = _ref$bubbles === void 0 ? true : _ref$bubbles,
        _ref$cancelable = _ref.cancelable,
        cancelable = _ref$cancelable === void 0 ? true : _ref$cancelable;
      var type = prefix ? "".concat(prefix, ":").concat(eventName) : eventName;
      var event = new CustomEvent(type, {
        detail: detail,
        bubbles: bubbles,
        cancelable: cancelable
      });
      target.dispatchEvent(event);
      return event;
    }
  }, {
    key: "proxy",
    value: function proxy(method) {
      if (method.ocProxyId === undefined) {
        ControlBase.proxyCounter++;
        method.ocProxyId = ControlBase.proxyCounter;
      }
      if (this.proxiedMethods[method.ocProxyId] !== undefined) {
        return this.proxiedMethods[method.ocProxyId];
      }
      this.proxiedMethods[method.ocProxyId] = method.bind(this);
      return this.proxiedMethods[method.ocProxyId];
    }
  }, {
    key: "parseDataset",
    value: function parseDataset(dataset) {
      var result = {};
      for (var _i = 0, _Object$entries = Object.entries(dataset); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          key = _Object$entries$_i[0],
          value = _Object$entries$_i[1];
        result[key] = this.parseValue(value);
      }
      return result;
    }
  }, {
    key: "parseValue",
    value: function parseValue(value) {
      if (value === 'true') return true;
      if (value === 'false') return false;
      if (value === 'null') return null;
      if (value === 'undefined') return undefined;
      if (value !== '' && !isNaN(Number(value))) return Number(value);
      return value;
    }
  }], [{
    key: "shouldLoad",
    get: function get() {
      return true;
    }
  }, {
    key: "afterLoad",
    value: function afterLoad(_identifier, _application) {
      return;
    }
  }]);
}();
_defineProperty(ControlBase, "proxyCounter", 0);


/***/ },

/***/ "./vendor/larajax/larajax/resources/src/observe/dispatcher.js"
/*!********************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/observe/dispatcher.js ***!
  \********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Dispatcher: () => (/* binding */ Dispatcher)
/* harmony export */ });
/* harmony import */ var _event_listener__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./event-listener */ "./vendor/larajax/larajax/resources/src/observe/event-listener.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var Dispatcher = /*#__PURE__*/function () {
  function Dispatcher(application) {
    _classCallCheck(this, Dispatcher);
    this.application = application;
    this.eventListenerMaps = new Map();
    this.started = false;
  }
  return _createClass(Dispatcher, [{
    key: "start",
    value: function start() {
      if (!this.started) {
        this.started = true;
        this.eventListeners.forEach(function (eventListener) {
          return eventListener.connect();
        });
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      if (this.started) {
        this.started = false;
        this.eventListeners.forEach(function (eventListener) {
          return eventListener.disconnect();
        });
      }
    }
  }, {
    key: "eventListeners",
    get: function get() {
      return Array.from(this.eventListenerMaps.values()).reduce(function (listeners, map) {
        return listeners.concat(Array.from(map.values()));
      }, []);
    }

    // Binding observer delegate
  }, {
    key: "bindingConnected",
    value: function bindingConnected(binding) {
      this.fetchEventListenerForBinding(binding).bindingConnected(binding);
    }
  }, {
    key: "bindingDisconnected",
    value: function bindingDisconnected(binding) {
      var clearEventListeners = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      this.fetchEventListenerForBinding(binding).bindingDisconnected(binding);
      if (clearEventListeners) this.clearEventListenersForBinding(binding);
    }

    // Error handling
  }, {
    key: "handleError",
    value: function handleError(error, message) {
      var detail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      this.application.handleError(error, "Error ".concat(message), detail);
    }
  }, {
    key: "clearEventListenersForBinding",
    value: function clearEventListenersForBinding(binding) {
      var eventListener = this.fetchEventListenerForBinding(binding);
      if (!eventListener.hasBindings()) {
        eventListener.disconnect();
        this.removeMappedEventListenerFor(binding);
      }
    }
  }, {
    key: "removeMappedEventListenerFor",
    value: function removeMappedEventListenerFor(binding) {
      var eventTarget = binding.eventTarget,
        eventName = binding.eventName,
        eventOptions = binding.eventOptions;
      var eventListenerMap = this.fetchEventListenerMapForEventTarget(eventTarget);
      var cacheKey = this.cacheKey(eventName, eventOptions);
      eventListenerMap["delete"](cacheKey);
      if (eventListenerMap.size == 0) {
        this.eventListenerMaps["delete"](eventTarget);
      }
    }
  }, {
    key: "fetchEventListenerForBinding",
    value: function fetchEventListenerForBinding(binding) {
      var eventTarget = binding.eventTarget,
        eventName = binding.eventName,
        eventOptions = binding.eventOptions;
      return this.fetchEventListener(eventTarget, eventName, eventOptions);
    }
  }, {
    key: "fetchEventListener",
    value: function fetchEventListener(eventTarget, eventName, eventOptions) {
      var eventListenerMap = this.fetchEventListenerMapForEventTarget(eventTarget);
      var cacheKey = this.cacheKey(eventName, eventOptions);
      var eventListener = eventListenerMap.get(cacheKey);
      if (!eventListener) {
        eventListener = this.createEventListener(eventTarget, eventName, eventOptions);
        eventListenerMap.set(cacheKey, eventListener);
      }
      return eventListener;
    }
  }, {
    key: "createEventListener",
    value: function createEventListener(eventTarget, eventName, eventOptions) {
      var eventListener = new _event_listener__WEBPACK_IMPORTED_MODULE_0__.EventListener(eventTarget, eventName, eventOptions);
      if (this.started) {
        eventListener.connect();
      }
      return eventListener;
    }
  }, {
    key: "fetchEventListenerMapForEventTarget",
    value: function fetchEventListenerMapForEventTarget(eventTarget) {
      var eventListenerMap = this.eventListenerMaps.get(eventTarget);
      if (!eventListenerMap) {
        eventListenerMap = new Map();
        this.eventListenerMaps.set(eventTarget, eventListenerMap);
      }
      return eventListenerMap;
    }
  }, {
    key: "cacheKey",
    value: function cacheKey(eventName, eventOptions) {
      var parts = [eventName];
      Object.keys(eventOptions).sort().forEach(function (key) {
        parts.push("".concat(eventOptions[key] ? "" : "!").concat(key));
      });
      return parts.join(":");
    }
  }]);
}();

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/observe/event-listener.js"
/*!************************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/observe/event-listener.js ***!
  \************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EventListener: () => (/* binding */ EventListener)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var EventListener = /*#__PURE__*/function () {
  function EventListener(eventTarget, eventName, eventOptions) {
    _classCallCheck(this, EventListener);
    this.eventTarget = eventTarget;
    this.eventName = eventName;
    this.eventOptions = eventOptions;
    this.unorderedBindings = new Set();
  }
  return _createClass(EventListener, [{
    key: "connect",
    value: function connect() {
      this.eventTarget.addEventListener(this.eventName, this, this.eventOptions);
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      this.eventTarget.removeEventListener(this.eventName, this, this.eventOptions);
    }

    // Binding observer delegate
  }, {
    key: "bindingConnected",
    value: function bindingConnected(binding) {
      this.unorderedBindings.add(binding);
    }
  }, {
    key: "bindingDisconnected",
    value: function bindingDisconnected(binding) {
      this.unorderedBindings["delete"](binding);
    }
  }, {
    key: "handleEvent",
    value: function handleEvent(event) {
      var extendedEvent = extendEvent(event);
      var _iterator = _createForOfIteratorHelper(this.bindings),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var binding = _step.value;
          if (extendedEvent.immediatePropagationStopped) {
            break;
          } else {
            binding.handleEvent(extendedEvent);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "hasBindings",
    value: function hasBindings() {
      return this.unorderedBindings.size > 0;
    }
  }, {
    key: "bindings",
    get: function get() {
      return Array.from(this.unorderedBindings).sort(function (left, right) {
        var leftIndex = left.index,
          rightIndex = right.index;
        return leftIndex < rightIndex ? -1 : leftIndex > rightIndex ? 1 : 0;
      });
    }
  }]);
}();
function extendEvent(event) {
  if ('immediatePropagationStopped' in event) {
    return event;
  } else {
    var _stopImmediatePropagation = event.stopImmediatePropagation;
    return Object.assign(event, {
      immediatePropagationStopped: false,
      stopImmediatePropagation: function stopImmediatePropagation() {
        this.immediatePropagationStopped = true;
        _stopImmediatePropagation.call(this);
      }
    });
  }
}

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/observe/module.js"
/*!****************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/observe/module.js ***!
  \****************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Module: () => (/* binding */ Module)
/* harmony export */ });
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./context */ "./vendor/larajax/larajax/resources/src/observe/context.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var Module = /*#__PURE__*/function () {
  function Module(application, definition) {
    _classCallCheck(this, Module);
    this.application = application;
    this.definition = blessDefinition(definition);
    this.contextsByScope = new WeakMap();
    this.connectedContexts = new Set();
  }
  return _createClass(Module, [{
    key: "identifier",
    get: function get() {
      return this.definition.identifier;
    }
  }, {
    key: "controlConstructor",
    get: function get() {
      return this.definition.controlConstructor;
    }
  }, {
    key: "contexts",
    get: function get() {
      return Array.from(this.connectedContexts);
    }
  }, {
    key: "connectContextForScope",
    value: function connectContextForScope(scope) {
      var context = this.fetchContextForScope(scope);
      this.connectedContexts.add(context);
      context.connect();
    }
  }, {
    key: "disconnectContextForScope",
    value: function disconnectContextForScope(scope) {
      var context = this.contextsByScope.get(scope);
      if (context) {
        this.connectedContexts["delete"](context);
        context.disconnect();
      }
    }
  }, {
    key: "fetchContextForScope",
    value: function fetchContextForScope(scope) {
      var context = this.contextsByScope.get(scope);
      if (!context) {
        context = new _context__WEBPACK_IMPORTED_MODULE_0__.Context(this, scope);
        this.contextsByScope.set(scope, context);
      }
      return context;
    }
  }]);
}();
function blessDefinition(definition) {
  return {
    identifier: definition.identifier,
    controlConstructor: definition.controlConstructor
  };
}

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/observe/mutation/attribute-observer.js"
/*!*************************************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/observe/mutation/attribute-observer.js ***!
  \*************************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AttributeObserver: () => (/* binding */ AttributeObserver)
/* harmony export */ });
/* harmony import */ var _element_observer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./element-observer */ "./vendor/larajax/larajax/resources/src/observe/mutation/element-observer.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var AttributeObserver = /*#__PURE__*/function () {
  function AttributeObserver(element, attributeName, delegate) {
    _classCallCheck(this, AttributeObserver);
    this.delegate = delegate;
    this.attributeName = attributeName;
    this.elementObserver = new _element_observer__WEBPACK_IMPORTED_MODULE_0__.ElementObserver(element, this);
  }
  return _createClass(AttributeObserver, [{
    key: "element",
    get: function get() {
      return this.elementObserver.element;
    }
  }, {
    key: "selector",
    get: function get() {
      return "[".concat(this.attributeName, "]");
    }
  }, {
    key: "start",
    value: function start() {
      this.elementObserver.start();
    }
  }, {
    key: "pause",
    value: function pause(callback) {
      this.elementObserver.pause(callback);
    }
  }, {
    key: "stop",
    value: function stop() {
      this.elementObserver.stop();
    }
  }, {
    key: "refresh",
    value: function refresh() {
      this.elementObserver.refresh();
    }
  }, {
    key: "started",
    get: function get() {
      return this.elementObserver.started;
    }

    // Element observer delegate
  }, {
    key: "matchElement",
    value: function matchElement(element) {
      return element.hasAttribute(this.attributeName);
    }
  }, {
    key: "matchElementsInTree",
    value: function matchElementsInTree(tree) {
      var match = this.matchElement(tree) ? [tree] : [];
      var matches = Array.from(tree.querySelectorAll(this.selector));
      return match.concat(matches);
    }
  }, {
    key: "elementMatched",
    value: function elementMatched(element) {
      if (this.delegate.elementMatchedAttribute) {
        this.delegate.elementMatchedAttribute(element, this.attributeName);
      }
    }
  }, {
    key: "elementUnmatched",
    value: function elementUnmatched(element) {
      if (this.delegate.elementUnmatchedAttribute) {
        this.delegate.elementUnmatchedAttribute(element, this.attributeName);
      }
    }
  }, {
    key: "elementAttributeChanged",
    value: function elementAttributeChanged(element, attributeName) {
      if (this.delegate.elementAttributeValueChanged && this.attributeName == attributeName) {
        this.delegate.elementAttributeValueChanged(element, attributeName);
      }
    }
  }]);
}();

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/observe/mutation/element-observer.js"
/*!***********************************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/observe/mutation/element-observer.js ***!
  \***********************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ElementObserver: () => (/* binding */ ElementObserver)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var ElementObserver = /*#__PURE__*/function () {
  function ElementObserver(element, delegate) {
    var _this = this;
    _classCallCheck(this, ElementObserver);
    this.mutationObserverInit = {
      attributes: true,
      childList: true,
      subtree: true
    };
    this.element = element;
    this.started = false;
    this.delegate = delegate;
    this.elements = new Set();
    this.mutationObserver = new MutationObserver(function (mutations) {
      return _this.processMutations(mutations);
    });
  }
  return _createClass(ElementObserver, [{
    key: "start",
    value: function start() {
      if (!this.started) {
        this.started = true;
        this.mutationObserver.observe(this.element, this.mutationObserverInit);
        this.refresh();
      }
    }
  }, {
    key: "pause",
    value: function pause(callback) {
      if (this.started) {
        this.mutationObserver.disconnect();
        this.started = false;
      }
      callback();
      if (!this.started) {
        this.mutationObserver.observe(this.element, this.mutationObserverInit);
        this.started = true;
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      if (this.started) {
        this.mutationObserver.takeRecords();
        this.mutationObserver.disconnect();
        this.started = false;
      }
    }
  }, {
    key: "refresh",
    value: function refresh() {
      if (this.started) {
        var matches = new Set(this.matchElementsInTree());
        for (var _i = 0, _Array$from = Array.from(this.elements); _i < _Array$from.length; _i++) {
          var element = _Array$from[_i];
          if (!matches.has(element)) {
            this.removeElement(element);
          }
        }
        for (var _i2 = 0, _Array$from2 = Array.from(matches); _i2 < _Array$from2.length; _i2++) {
          var _element = _Array$from2[_i2];
          this.addElement(_element);
        }
      }
    }

    // Mutation record processing
  }, {
    key: "processMutations",
    value: function processMutations(mutations) {
      if (this.started) {
        var _iterator = _createForOfIteratorHelper(mutations),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var mutation = _step.value;
            this.processMutation(mutation);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }
  }, {
    key: "processMutation",
    value: function processMutation(mutation) {
      if (mutation.type == "attributes") {
        this.processAttributeChange(mutation.target, mutation.attributeName);
      } else if (mutation.type == "childList") {
        this.processRemovedNodes(mutation.removedNodes);
        this.processAddedNodes(mutation.addedNodes);
      }
    }
  }, {
    key: "processAttributeChange",
    value: function processAttributeChange(element, attributeName) {
      if (this.elements.has(element)) {
        if (this.delegate.elementAttributeChanged && this.matchElement(element)) {
          this.delegate.elementAttributeChanged(element, attributeName);
        } else {
          this.removeElement(element);
        }
      } else if (this.matchElement(element)) {
        this.addElement(element);
      }
    }
  }, {
    key: "processRemovedNodes",
    value: function processRemovedNodes(nodes) {
      for (var _i3 = 0, _Array$from3 = Array.from(nodes); _i3 < _Array$from3.length; _i3++) {
        var node = _Array$from3[_i3];
        var element = this.elementFromNode(node);
        if (element) {
          this.processTree(element, this.removeElement);
        }
      }
    }
  }, {
    key: "processAddedNodes",
    value: function processAddedNodes(nodes) {
      for (var _i4 = 0, _Array$from4 = Array.from(nodes); _i4 < _Array$from4.length; _i4++) {
        var node = _Array$from4[_i4];
        var element = this.elementFromNode(node);
        if (element && this.elementIsActive(element)) {
          this.processTree(element, this.addElement);
        }
      }
    }

    // Element matching
  }, {
    key: "matchElement",
    value: function matchElement(element) {
      return this.delegate.matchElement(element);
    }
  }, {
    key: "matchElementsInTree",
    value: function matchElementsInTree() {
      var tree = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.element;
      return this.delegate.matchElementsInTree(tree);
    }
  }, {
    key: "processTree",
    value: function processTree(tree, processor) {
      var _iterator2 = _createForOfIteratorHelper(this.matchElementsInTree(tree)),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var element = _step2.value;
          processor.call(this, element);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }, {
    key: "elementFromNode",
    value: function elementFromNode(node) {
      if (node.nodeType == Node.ELEMENT_NODE) {
        return node;
      }
    }
  }, {
    key: "elementIsActive",
    value: function elementIsActive(element) {
      if (element.isConnected != this.element.isConnected) {
        return false;
      } else {
        return this.element.contains(element);
      }
    }

    // Element tracking
  }, {
    key: "addElement",
    value: function addElement(element) {
      if (!this.elements.has(element)) {
        if (this.elementIsActive(element)) {
          this.elements.add(element);
          if (this.delegate.elementMatched) {
            this.delegate.elementMatched(element);
          }
        }
      }
    }
  }, {
    key: "removeElement",
    value: function removeElement(element) {
      if (this.elements.has(element)) {
        this.elements["delete"](element);
        if (this.delegate.elementUnmatched) {
          this.delegate.elementUnmatched(element);
        }
      }
    }
  }]);
}();

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/observe/mutation/index.js"
/*!************************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/observe/mutation/index.js ***!
  \************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AttributeObserver: () => (/* reexport safe */ _attribute_observer__WEBPACK_IMPORTED_MODULE_0__.AttributeObserver),
/* harmony export */   ElementObserver: () => (/* reexport safe */ _element_observer__WEBPACK_IMPORTED_MODULE_1__.ElementObserver),
/* harmony export */   SelectorObserver: () => (/* reexport safe */ _selector_observer__WEBPACK_IMPORTED_MODULE_2__.SelectorObserver),
/* harmony export */   TokenListObserver: () => (/* reexport safe */ _token_list_observer__WEBPACK_IMPORTED_MODULE_3__.TokenListObserver),
/* harmony export */   ValueListObserver: () => (/* reexport safe */ _value_list_observer__WEBPACK_IMPORTED_MODULE_4__.ValueListObserver)
/* harmony export */ });
/* harmony import */ var _attribute_observer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./attribute-observer */ "./vendor/larajax/larajax/resources/src/observe/mutation/attribute-observer.js");
/* harmony import */ var _element_observer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./element-observer */ "./vendor/larajax/larajax/resources/src/observe/mutation/element-observer.js");
/* harmony import */ var _selector_observer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./selector-observer */ "./vendor/larajax/larajax/resources/src/observe/mutation/selector-observer.js");
/* harmony import */ var _token_list_observer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./token-list-observer */ "./vendor/larajax/larajax/resources/src/observe/mutation/token-list-observer.js");
/* harmony import */ var _value_list_observer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./value-list-observer */ "./vendor/larajax/larajax/resources/src/observe/mutation/value-list-observer.js");






/***/ },

/***/ "./vendor/larajax/larajax/resources/src/observe/mutation/selector-observer.js"
/*!************************************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/observe/mutation/selector-observer.js ***!
  \************************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SelectorObserver: () => (/* binding */ SelectorObserver)
/* harmony export */ });
/* harmony import */ var _element_observer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./element-observer */ "./vendor/larajax/larajax/resources/src/observe/mutation/element-observer.js");
/* harmony import */ var _util_multimap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/multimap */ "./vendor/larajax/larajax/resources/src/observe/util/multimap.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


var SelectorObserver = /*#__PURE__*/function () {
  function SelectorObserver(element, selector, delegate, details) {
    _classCallCheck(this, SelectorObserver);
    this._selector = selector;
    this.details = details;
    this.elementObserver = new _element_observer__WEBPACK_IMPORTED_MODULE_0__.ElementObserver(element, this);
    this.delegate = delegate;
    this.matchesByElement = new _util_multimap__WEBPACK_IMPORTED_MODULE_1__.Multimap();
  }
  return _createClass(SelectorObserver, [{
    key: "started",
    get: function get() {
      return this.elementObserver.started;
    }
  }, {
    key: "selector",
    get: function get() {
      return this._selector;
    },
    set: function set(selector) {
      this._selector = selector;
      this.refresh();
    }
  }, {
    key: "start",
    value: function start() {
      this.elementObserver.start();
    }
  }, {
    key: "pause",
    value: function pause(callback) {
      this.elementObserver.pause(callback);
    }
  }, {
    key: "stop",
    value: function stop() {
      this.elementObserver.stop();
    }
  }, {
    key: "refresh",
    value: function refresh() {
      this.elementObserver.refresh();
    }
  }, {
    key: "element",
    get: function get() {
      return this.elementObserver.element;
    }
    // Element observer delegate
  }, {
    key: "matchElement",
    value: function matchElement(element) {
      var selector = this.selector;
      if (selector) {
        var matches = element.matches(selector);
        if (this.delegate.selectorMatchElement) {
          return matches && this.delegate.selectorMatchElement(element, this.details);
        }
        return matches;
      } else {
        return false;
      }
    }
  }, {
    key: "matchElementsInTree",
    value: function matchElementsInTree(tree) {
      var _this = this;
      var selector = this.selector;
      if (selector) {
        var match = this.matchElement(tree) ? [tree] : [];
        var matches = Array.from(tree.querySelectorAll(selector)).filter(function (match) {
          return _this.matchElement(match);
        });
        return match.concat(matches);
      } else {
        return [];
      }
    }
  }, {
    key: "elementMatched",
    value: function elementMatched(element) {
      var selector = this.selector;
      if (selector) {
        this.selectorMatched(element, selector);
      }
    }
  }, {
    key: "elementUnmatched",
    value: function elementUnmatched(element) {
      var selectors = this.matchesByElement.getKeysForValue(element);
      var _iterator = _createForOfIteratorHelper(selectors),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var selector = _step.value;
          this.selectorUnmatched(element, selector);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "elementAttributeChanged",
    value: function elementAttributeChanged(element, _attributeName) {
      var selector = this.selector;
      if (selector) {
        var matches = this.matchElement(element);
        var matchedBefore = this.matchesByElement.has(selector, element);
        if (matches && !matchedBefore) {
          this.selectorMatched(element, selector);
        } else if (!matches && matchedBefore) {
          this.selectorUnmatched(element, selector);
        }
      }
    }
    // Selector management
  }, {
    key: "selectorMatched",
    value: function selectorMatched(element, selector) {
      this.delegate.selectorMatched(element, selector, this.details);
      this.matchesByElement.add(selector, element);
    }
  }, {
    key: "selectorUnmatched",
    value: function selectorUnmatched(element, selector) {
      this.delegate.selectorUnmatched(element, selector, this.details);
      this.matchesByElement["delete"](selector, element);
    }
  }]);
}();

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/observe/mutation/token-list-observer.js"
/*!**************************************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/observe/mutation/token-list-observer.js ***!
  \**************************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TokenListObserver: () => (/* binding */ TokenListObserver)
/* harmony export */ });
/* harmony import */ var _attribute_observer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./attribute-observer */ "./vendor/larajax/larajax/resources/src/observe/mutation/attribute-observer.js");
/* harmony import */ var _util_multimap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/multimap */ "./vendor/larajax/larajax/resources/src/observe/util/multimap.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


var TokenListObserver = /*#__PURE__*/function () {
  function TokenListObserver(element, attributeName, delegate) {
    _classCallCheck(this, TokenListObserver);
    this.delegate = delegate;
    this.attributeObserver = new _attribute_observer__WEBPACK_IMPORTED_MODULE_0__.AttributeObserver(element, attributeName, this);
    this.tokensByElement = new _util_multimap__WEBPACK_IMPORTED_MODULE_1__.Multimap();
  }
  return _createClass(TokenListObserver, [{
    key: "started",
    get: function get() {
      return this.attributeObserver.started;
    }
  }, {
    key: "start",
    value: function start() {
      this.attributeObserver.start();
    }
  }, {
    key: "pause",
    value: function pause(callback) {
      this.attributeObserver.pause(callback);
    }
  }, {
    key: "stop",
    value: function stop() {
      this.attributeObserver.stop();
    }
  }, {
    key: "refresh",
    value: function refresh() {
      this.attributeObserver.refresh();
    }
  }, {
    key: "element",
    get: function get() {
      return this.attributeObserver.element;
    }
  }, {
    key: "attributeName",
    get: function get() {
      return this.attributeObserver.attributeName;
    }

    // Attribute observer delegate
  }, {
    key: "elementMatchedAttribute",
    value: function elementMatchedAttribute(element) {
      this.tokensMatched(this.readTokensForElement(element));
    }
  }, {
    key: "elementAttributeValueChanged",
    value: function elementAttributeValueChanged(element) {
      var _this$refreshTokensFo = this.refreshTokensForElement(element),
        _this$refreshTokensFo2 = _slicedToArray(_this$refreshTokensFo, 2),
        unmatchedTokens = _this$refreshTokensFo2[0],
        matchedTokens = _this$refreshTokensFo2[1];
      this.tokensUnmatched(unmatchedTokens);
      this.tokensMatched(matchedTokens);
    }
  }, {
    key: "elementUnmatchedAttribute",
    value: function elementUnmatchedAttribute(element) {
      this.tokensUnmatched(this.tokensByElement.getValuesForKey(element));
    }
  }, {
    key: "tokensMatched",
    value: function tokensMatched(tokens) {
      var _this = this;
      tokens.forEach(function (token) {
        return _this.tokenMatched(token);
      });
    }
  }, {
    key: "tokensUnmatched",
    value: function tokensUnmatched(tokens) {
      var _this2 = this;
      tokens.forEach(function (token) {
        return _this2.tokenUnmatched(token);
      });
    }
  }, {
    key: "tokenMatched",
    value: function tokenMatched(token) {
      this.delegate.tokenMatched(token);
      this.tokensByElement.add(token.element, token);
    }
  }, {
    key: "tokenUnmatched",
    value: function tokenUnmatched(token) {
      this.delegate.tokenUnmatched(token);
      this.tokensByElement["delete"](token.element, token);
    }
  }, {
    key: "refreshTokensForElement",
    value: function refreshTokensForElement(element) {
      var previousTokens = this.tokensByElement.getValuesForKey(element);
      var currentTokens = this.readTokensForElement(element);
      var firstDifferingIndex = zip(previousTokens, currentTokens).findIndex(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          previousToken = _ref2[0],
          currentToken = _ref2[1];
        return !tokensAreEqual(previousToken, currentToken);
      });
      if (firstDifferingIndex == -1) {
        return [[], []];
      } else {
        return [previousTokens.slice(firstDifferingIndex), currentTokens.slice(firstDifferingIndex)];
      }
    }
  }, {
    key: "readTokensForElement",
    value: function readTokensForElement(element) {
      var attributeName = this.attributeName;
      var tokenString = element.getAttribute(attributeName) || "";
      return parseTokenString(tokenString, element, attributeName);
    }
  }]);
}();
function parseTokenString(tokenString, element, attributeName) {
  return tokenString.trim().split(/\s+/).filter(function (content) {
    return content.length;
  }).map(function (content, index) {
    return {
      element: element,
      attributeName: attributeName,
      content: content,
      index: index
    };
  });
}
function zip(left, right) {
  var length = Math.max(left.length, right.length);
  return Array.from({
    length: length
  }, function (_, index) {
    return [left[index], right[index]];
  });
}
function tokensAreEqual(left, right) {
  return left && right && left.index == right.index && left.content == right.content;
}

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/observe/mutation/value-list-observer.js"
/*!**************************************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/observe/mutation/value-list-observer.js ***!
  \**************************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ValueListObserver: () => (/* binding */ ValueListObserver)
/* harmony export */ });
/* harmony import */ var _token_list_observer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./token-list-observer */ "./vendor/larajax/larajax/resources/src/observe/mutation/token-list-observer.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var ValueListObserver = /*#__PURE__*/function () {
  function ValueListObserver(element, attributeName, delegate) {
    _classCallCheck(this, ValueListObserver);
    this.tokenListObserver = new _token_list_observer__WEBPACK_IMPORTED_MODULE_0__.TokenListObserver(element, attributeName, this);
    this.delegate = delegate;
    this.parseResultsByToken = new WeakMap();
    this.valuesByTokenByElement = new WeakMap();
  }
  return _createClass(ValueListObserver, [{
    key: "started",
    get: function get() {
      return this.tokenListObserver.started;
    }
  }, {
    key: "start",
    value: function start() {
      this.tokenListObserver.start();
    }
  }, {
    key: "stop",
    value: function stop() {
      this.tokenListObserver.stop();
    }
  }, {
    key: "refresh",
    value: function refresh() {
      this.tokenListObserver.refresh();
    }
  }, {
    key: "element",
    get: function get() {
      return this.tokenListObserver.element;
    }
  }, {
    key: "attributeName",
    get: function get() {
      return this.tokenListObserver.attributeName;
    }
  }, {
    key: "tokenMatched",
    value: function tokenMatched(token) {
      var element = token.element;
      var _this$fetchParseResul = this.fetchParseResultForToken(token),
        value = _this$fetchParseResul.value;
      if (value) {
        this.fetchValuesByTokenForElement(element).set(token, value);
        this.delegate.elementMatchedValue(element, value);
      }
    }
  }, {
    key: "tokenUnmatched",
    value: function tokenUnmatched(token) {
      var element = token.element;
      var _this$fetchParseResul2 = this.fetchParseResultForToken(token),
        value = _this$fetchParseResul2.value;
      if (value) {
        this.fetchValuesByTokenForElement(element)["delete"](token);
        this.delegate.elementUnmatchedValue(element, value);
      }
    }
  }, {
    key: "fetchParseResultForToken",
    value: function fetchParseResultForToken(token) {
      var parseResult = this.parseResultsByToken.get(token);
      if (!parseResult) {
        parseResult = this.parseToken(token);
        this.parseResultsByToken.set(token, parseResult);
      }
      return parseResult;
    }
  }, {
    key: "fetchValuesByTokenForElement",
    value: function fetchValuesByTokenForElement(element) {
      var valuesByToken = this.valuesByTokenByElement.get(element);
      if (!valuesByToken) {
        valuesByToken = new Map();
        this.valuesByTokenByElement.set(element, valuesByToken);
      }
      return valuesByToken;
    }
  }, {
    key: "parseToken",
    value: function parseToken(token) {
      try {
        var value = this.delegate.parseValueForToken(token);
        return {
          value: value
        };
      } catch (error) {
        return {
          error: error
        };
      }
    }
  }]);
}();

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/observe/namespace.js"
/*!*******************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/observe/namespace.js ***!
  \*******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _application__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./application */ "./vendor/larajax/larajax/resources/src/observe/application.js");

var application = new _application__WEBPACK_IMPORTED_MODULE_0__.Application();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  application: application,
  registerControl: function registerControl(id, control) {
    return application.register(id, control);
  },
  importControl: function importControl(id) {
    return application["import"](id);
  },
  observeControl: function observeControl(element, id) {
    return application.observe(element, id);
  },
  fetchControl: function fetchControl(element, identifier) {
    return application.fetch(element, identifier);
  },
  fetchControls: function fetchControls(elements, identifier) {
    return application.fetchAll(elements, identifier);
  },
  start: function start() {
    application.startAsync();
  },
  stop: function stop() {
    application.stop();
  }
});

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/observe/scope-observer.js"
/*!************************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/observe/scope-observer.js ***!
  \************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ScopeObserver: () => (/* binding */ ScopeObserver)
/* harmony export */ });
/* harmony import */ var _mutation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mutation */ "./vendor/larajax/larajax/resources/src/observe/mutation/index.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var ScopeObserver = /*#__PURE__*/function () {
  function ScopeObserver(element, delegate) {
    _classCallCheck(this, ScopeObserver);
    this.element = element;
    this.delegate = delegate;
    this.valueListObserver = new _mutation__WEBPACK_IMPORTED_MODULE_0__.ValueListObserver(this.element, this.controlAttribute, this);
    this.scopesByIdentifierByElement = new WeakMap();
    this.scopeReferenceCounts = new WeakMap();
  }
  return _createClass(ScopeObserver, [{
    key: "start",
    value: function start() {
      this.valueListObserver.start();
    }
  }, {
    key: "stop",
    value: function stop() {
      this.valueListObserver.stop();
    }
  }, {
    key: "controlAttribute",
    get: function get() {
      return 'data-control';
    }

    // Value observer delegate
  }, {
    key: "parseValueForToken",
    value: function parseValueForToken(token) {
      var element = token.element,
        identifier = token.content;
      var scopesByIdentifier = this.fetchScopesByIdentifierForElement(element);
      var scope = scopesByIdentifier.get(identifier);
      if (!scope) {
        scope = this.delegate.createScopeForElementAndIdentifier(element, identifier);
        scopesByIdentifier.set(identifier, scope);
      }
      return scope;
    }
  }, {
    key: "elementMatchedValue",
    value: function elementMatchedValue(element, value) {
      var referenceCount = (this.scopeReferenceCounts.get(value) || 0) + 1;
      this.scopeReferenceCounts.set(value, referenceCount);
      if (referenceCount == 1) {
        this.delegate.scopeConnected(value);
      }
    }
  }, {
    key: "elementUnmatchedValue",
    value: function elementUnmatchedValue(element, value) {
      var referenceCount = this.scopeReferenceCounts.get(value);
      if (referenceCount) {
        this.scopeReferenceCounts.set(value, referenceCount - 1);
        if (referenceCount == 1) {
          this.delegate.scopeDisconnected(value);
        }
      }
    }
  }, {
    key: "fetchScopesByIdentifierForElement",
    value: function fetchScopesByIdentifierForElement(element) {
      var scopesByIdentifier = this.scopesByIdentifierByElement.get(element);
      if (!scopesByIdentifier) {
        scopesByIdentifier = new Map();
        this.scopesByIdentifierByElement.set(element, scopesByIdentifier);
      }
      return scopesByIdentifier;
    }
  }]);
}();

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/observe/scope.js"
/*!***************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/observe/scope.js ***!
  \***************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Scope: () => (/* binding */ Scope)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Scope = /*#__PURE__*/function () {
  function Scope(element, identifier) {
    var _this = this;
    _classCallCheck(this, Scope);
    this.element = element;
    this.identifier = identifier;
    this.containsElement = function (element) {
      return element.closest(_this.controlSelector) === _this.element;
    };
  }
  return _createClass(Scope, [{
    key: "findElement",
    value: function findElement(selector) {
      return this.element.matches(selector) ? this.element : this.queryElements(selector).find(this.containsElement);
    }
  }, {
    key: "findAllElements",
    value: function findAllElements(selector) {
      return [].concat(_toConsumableArray(this.element.matches(selector) ? [this.element] : []), _toConsumableArray(this.queryElements(selector).filter(this.containsElement)));
    }
  }, {
    key: "queryElements",
    value: function queryElements(selector) {
      return Array.from(this.element.querySelectorAll(selector));
    }
  }, {
    key: "controlSelector",
    get: function get() {
      return attributeValueContainsToken('data-control', this.identifier);
    }
  }, {
    key: "isDocumentScope",
    get: function get() {
      return this.element === document.documentElement;
    }
  }, {
    key: "documentScope",
    get: function get() {
      return this.isDocumentScope ? this : new Scope(document.documentElement, this.identifier);
    }
  }]);
}();
function attributeValueContainsToken(attributeName, token) {
  return "[".concat(attributeName, "~=\"").concat(token, "\"]");
}

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/observe/util/multimap.js"
/*!***********************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/observe/util/multimap.js ***!
  \***********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Multimap: () => (/* binding */ Multimap)
/* harmony export */ });
/* harmony import */ var _set_operations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./set-operations */ "./vendor/larajax/larajax/resources/src/observe/util/set-operations.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var Multimap = /*#__PURE__*/function () {
  function Multimap() {
    _classCallCheck(this, Multimap);
    this.valuesByKey = new Map();
  }
  return _createClass(Multimap, [{
    key: "keys",
    get: function get() {
      return Array.from(this.valuesByKey.keys());
    }
  }, {
    key: "values",
    get: function get() {
      var sets = Array.from(this.valuesByKey.values());
      return sets.reduce(function (values, set) {
        return values.concat(Array.from(set));
      }, React.createElement(V, null), [] > []);
    }
  }, {
    key: "size",
    get: function get() {
      var sets = Array.from(this.valuesByKey.values());
      return sets.reduce(function (size, set) {
        return size + set.size;
      }, 0);
    }
  }, {
    key: "add",
    value: function add(key, value) {
      (0,_set_operations__WEBPACK_IMPORTED_MODULE_0__.add)(this.valuesByKey, key, value);
    }
  }, {
    key: "delete",
    value: function _delete(key, value) {
      (0,_set_operations__WEBPACK_IMPORTED_MODULE_0__.del)(this.valuesByKey, key, value);
    }
  }, {
    key: "has",
    value: function has(key, value) {
      var values = this.valuesByKey.get(key);
      return values != null && values.has(value);
    }
  }, {
    key: "hasKey",
    value: function hasKey(key) {
      return this.valuesByKey.has(key);
    }
  }, {
    key: "hasValue",
    value: function hasValue(value) {
      var sets = Array.from(this.valuesByKey.values());
      return sets.some(function (set) {
        return set.has(value);
      });
    }
  }, {
    key: "getValuesForKey",
    value: function getValuesForKey(key) {
      var values = this.valuesByKey.get(key);
      return values ? Array.from(values) : [];
    }
  }, {
    key: "getKeysForValue",
    value: function getKeysForValue(value) {
      return Array.from(this.valuesByKey).filter(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          _key = _ref2[0],
          values = _ref2[1];
        return values.has(value);
      }).map(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
          key = _ref4[0],
          _values = _ref4[1];
        return key;
      });
    }
  }]);
}();

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/observe/util/set-operations.js"
/*!*****************************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/observe/util/set-operations.js ***!
  \*****************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   add: () => (/* binding */ add),
/* harmony export */   del: () => (/* binding */ del),
/* harmony export */   fetch: () => (/* binding */ fetch),
/* harmony export */   prune: () => (/* binding */ prune)
/* harmony export */ });
function add(map, key, value) {
  fetch(map, key).add(value);
}
function del(map, key, value) {
  fetch(map, key)["delete"](value);
  prune(map, key);
}
function fetch(map, key) {
  var values = map.get(key);
  if (!values) {
    values = new Set();
    map.set(key, values);
  }
  return values;
}
function prune(map, key) {
  var values = map.get(key);
  if (values != null && values.size == 0) {
    map["delete"](key);
  }
}

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/request/actions.js"
/*!*****************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/request/actions.js ***!
  \*****************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Actions: () => (/* binding */ Actions)
/* harmony export */ });
/* harmony import */ var _asset_manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./asset-manager */ "./vendor/larajax/larajax/resources/src/request/asset-manager.js");
/* harmony import */ var _dom_patcher__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom-patcher */ "./vendor/larajax/larajax/resources/src/request/dom-patcher.js");
/* harmony import */ var _util_referrer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/referrer */ "./vendor/larajax/larajax/resources/src/util/referrer.js");
/* harmony import */ var _util_promise__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/promise */ "./vendor/larajax/larajax/resources/src/util/promise.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(_typeof(e) + " is not iterable"); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }




var Actions = /*#__PURE__*/function () {
  function Actions(delegate, context, options) {
    _classCallCheck(this, Actions);
    this.el = delegate.el;
    this.delegate = delegate;
    this.context = context;
    this.options = options;

    // Allow override to call parent logic
    this.context.start = this.start.bind(this);
    this.context.success = (0,_util_promise__WEBPACK_IMPORTED_MODULE_3__.decoratePromiseProxy)(this.success, this);
    this.context.error = (0,_util_promise__WEBPACK_IMPORTED_MODULE_3__.decoratePromiseProxy)(this.error, this);
    this.context.complete = (0,_util_promise__WEBPACK_IMPORTED_MODULE_3__.decoratePromiseProxy)(this.complete, this);
    this.context.cancel = this.cancel.bind(this);
  }

  // Options can override all public methods in this class
  return _createClass(Actions, [{
    key: "invoke",
    value: function invoke(method) {
      var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      if (this.options[method]) {
        return this.options[method].apply(this.context, args);
      }

      // beforeUpdate and afterUpdate are not part of context
      // since they have no base logic and won't exist here
      if (this[method]) {
        return this[method].apply(this, _toConsumableArray(args));
      }
    }

    // Options can also specify a non-interference "func" method, typically
    // used by eval-based data attributes that takes minimal arguments
  }, {
    key: "invokeFunc",
    value: function invokeFunc(method) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      if (this.options[method]) {
        return this.options[method](this.el, this.context, data);
      }
    }

    // Public
  }, {
    key: "start",
    value: function start(xhr) {
      this.invoke('markAsUpdating', [true]);
      if (this.delegate.options.message) {
        this.invoke('handleProgressMessage', [this.delegate.options.message, false]);
      }
    }
  }, {
    key: "success",
    value: function () {
      var _success = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(data, responseCode, xhr) {
        var _data$$env;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              if (!(this.invoke('beforeUpdate', [data, responseCode, xhr]) === false)) {
                _context.n = 1;
                break;
              }
              return _context.a(2);
            case 1:
              if (!(this.invokeFunc('beforeUpdateFunc', data) === false)) {
                _context.n = 2;
                break;
              }
              return _context.a(2);
            case 2:
              if (this.delegate.applicationAllowsUpdate(data, responseCode, xhr)) {
                _context.n = 3;
                break;
              }
              return _context.a(2);
            case 3:
              if (!(data instanceof Blob)) {
                _context.n = 4;
                break;
              }
              this.invoke('handleFileDownload', [data, xhr]);
              this.delegate.notifyApplicationRequestSuccess(data, responseCode, xhr);
              this.invokeFunc('successFunc', data);
              return _context.a(2);
            case 4:
              if ((_data$$env = data.$env) !== null && _data$$env !== void 0 && _data$$env.isFatal()) {
                _context.n = 6;
                break;
              }
              _context.n = 5;
              return this.invoke('handleUpdateOperations', [data, responseCode, xhr]);
            case 5:
              _context.n = 6;
              return this.invoke('handleUpdateResponse', [data, responseCode, xhr]);
            case 6:
              this.delegate.notifyApplicationRequestSuccess(data, responseCode, xhr);
              this.invokeFunc('successFunc', data);
            case 7:
              return _context.a(2);
          }
        }, _callee, this);
      }));
      function success(_x, _x2, _x3) {
        return _success.apply(this, arguments);
      }
      return success;
    }()
  }, {
    key: "error",
    value: function () {
      var _error = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(data, responseCode, xhr) {
        var _data$$env2, _data$$env3;
        var errorMsg;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              errorMsg = (_data$$env2 = data.$env) === null || _data$$env2 === void 0 ? void 0 : _data$$env2.getMessage();
              if (!(window.jaxUnloading !== undefined && window.jaxUnloading)) {
                _context2.n = 1;
                break;
              }
              return _context2.a(2);
            case 1:
              // Disable redirects
              this.delegate.toggleRedirect(false);
              if ((_data$$env3 = data.$env) !== null && _data$$env3 !== void 0 && _data$$env3.isFatal()) {
                _context2.n = 4;
                break;
              }
              _context2.n = 2;
              return this.invoke('handleUpdateOperations', [data, responseCode, xhr]);
            case 2:
              _context2.n = 3;
              return this.invoke('handleUpdateResponse', [data, responseCode, xhr]);
            case 3:
              _context2.n = 5;
              break;
            case 4:
              if (data.constructor === {}.constructor) {
                if (!errorMsg && data.message) {
                  errorMsg = data.message;
                } else {
                  errorMsg = "Something went wrong! Check the browser console.";
                  console.warn(data);
                }
              } else {
                errorMsg = data;
              }
            case 5:
              // Capture the error message on the node
              if (this.el !== document) {
                this.el.setAttribute('data-error-message', errorMsg);
              }

              // Trigger 'ajaxError' on the form, halt if event.preventDefault() is called
              if (this.delegate.applicationAllowsError(data, responseCode, xhr)) {
                _context2.n = 6;
                break;
              }
              return _context2.a(2);
            case 6:
              if (!(this.invokeFunc('errorFunc', data) === false)) {
                _context2.n = 7;
                break;
              }
              return _context2.a(2);
            case 7:
              this.invoke('handleErrorMessage', [errorMsg]);
            case 8:
              return _context2.a(2);
          }
        }, _callee2, this);
      }));
      function error(_x4, _x5, _x6) {
        return _error.apply(this, arguments);
      }
      return error;
    }()
  }, {
    key: "complete",
    value: function () {
      var _complete = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(data, responseCode, xhr) {
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              this.delegate.notifyApplicationRequestComplete(data, responseCode, xhr);
              this.invokeFunc('completeFunc', data);
              this.invoke('markAsUpdating', [false]);
              if (this.delegate.options.message) {
                this.invoke('handleProgressMessage', [null, true]);
              }
            case 1:
              return _context3.a(2);
          }
        }, _callee3, this);
      }));
      function complete(_x7, _x8, _x9) {
        return _complete.apply(this, arguments);
      }
      return complete;
    }()
  }, {
    key: "cancel",
    value: function cancel() {
      this.invokeFunc('cancelFunc');
    }

    // Custom function, requests confirmation from the user
  }, {
    key: "handleConfirmMessage",
    value: function handleConfirmMessage(message) {
      var _this = this;
      var resolveFn, rejectFn;
      var promise = new Promise(function (resolve, reject) {
        resolveFn = resolve;
        rejectFn = reject;
      });
      promise.then(function () {
        _this.delegate.sendInternal();
      })["catch"](function () {
        _this.invoke('cancel', []);
      });
      var event = this.delegate.notifyApplicationConfirmMessage(message, {
        resolve: resolveFn,
        reject: rejectFn
      });
      if (event.defaultPrevented) {
        return false;
      }
      if (message) {
        var result = confirm(message);
        if (!result) {
          this.invoke('cancel', []);
        }
        return result;
      }
    }

    // Custom function, display a progress message to the user
  }, {
    key: "handleProgressMessage",
    value: function handleProgressMessage(message, isDone) {}

    // Custom function, display a flash message to the user
  }, {
    key: "handleFlashMessage",
    value: function handleFlashMessage(message, type) {}

    // Custom function, display an error message to the user
  }, {
    key: "handleErrorMessage",
    value: function handleErrorMessage(message) {
      var event = this.delegate.notifyApplicationErrorMessage(message);
      if (event.defaultPrevented) {
        return;
      }
      if (message) {
        alert(message);
      }
    }

    // Custom function, focus fields with errors
  }, {
    key: "handleValidationMessage",
    value: function handleValidationMessage(message, fields) {
      this.delegate.notifyApplicationBeforeValidate(message, fields);
      if (!this.delegate.formEl) {
        return;
      }
      var isFirstInvalidField = true;
      for (var fieldName in fields) {
        var fieldCheck,
          fieldNameOptions = [];

        // field1[field2][field3]
        fieldCheck = fieldName.replace(/\.(\w+)/g, '[$1]');
        fieldNameOptions.push('[name="' + fieldCheck + '"]:not([disabled])');
        fieldNameOptions.push('[name="' + fieldCheck + '[]"]:not([disabled])');

        // [field1][field2][field3]
        fieldCheck = ('.' + fieldName).replace(/\.(\w+)/g, '[$1]');
        fieldNameOptions.push('[name$="' + fieldCheck + '"]:not([disabled])');
        fieldNameOptions.push('[name$="' + fieldCheck + '[]"]:not([disabled])');

        // field.0 → field[]
        var fieldEmpty = fieldName.replace(/\.[0-9]+$/g, '');
        if (fieldName !== fieldEmpty) {
          fieldCheck = fieldEmpty.replace(/\.(\w+)/g, '[$1]');
          fieldNameOptions.push('[name="' + fieldCheck + '[]"]:not([disabled])');
          fieldCheck = ('.' + fieldEmpty).replace(/\.(\w+)/g, '[$1]');
          fieldNameOptions.push('[name$="' + fieldCheck + '[]"]:not([disabled])');
        }
        var fieldElement = this.delegate.formEl.querySelector(fieldNameOptions.join(', '));
        if (fieldElement) {
          var event = this.delegate.notifyApplicationFieldInvalid(fieldElement, fieldName, fields[fieldName], isFirstInvalidField);
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
  }, {
    key: "handleBrowserEvents",
    value: function () {
      var _handleBrowserEvents = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
        var _this2 = this;
        var events,
          defaultPrevented,
          _iterator,
          _step,
          _loop,
          _args5 = arguments,
          _t;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              events = _args5.length > 0 && _args5[0] !== undefined ? _args5[0] : [];
              if (events.length) {
                _context5.n = 1;
                break;
              }
              return _context5.a(2, false);
            case 1:
              defaultPrevented = false;
              _iterator = _createForOfIteratorHelper(events);
              _context5.p = 2;
              _loop = /*#__PURE__*/_regenerator().m(function _loop() {
                var dispatched, isAsync, event;
                return _regenerator().w(function (_context4) {
                  while (1) switch (_context4.n) {
                    case 0:
                      dispatched = _step.value;
                      isAsync = (dispatched === null || dispatched === void 0 ? void 0 : dispatched.async) === true;
                      if (!isAsync) {
                        _context4.n = 2;
                        break;
                      }
                      _context4.n = 1;
                      return new Promise(function (outerResolve, outerReject) {
                        var settled = false;
                        var resolve = function resolve(v) {
                          if (!settled) {
                            settled = true;
                            outerResolve(v);
                          }
                        };
                        var reject = function reject(e) {
                          if (!settled) {
                            settled = true;
                            outerReject(e);
                          }
                        };
                        var event = _this2.delegate.notifyApplicationCustomEvent(dispatched.event, _objectSpread(_objectSpread({}, dispatched.detail || {}), {}, {
                          context: _this2.context,
                          promise: {
                            resolve: resolve,
                            reject: reject
                          }
                        }));
                        if (event !== null && event !== void 0 && event.defaultPrevented) {
                          defaultPrevented = true;
                        }
                      });
                    case 1:
                      _context4.n = 3;
                      break;
                    case 2:
                      event = _this2.delegate.notifyApplicationCustomEvent(dispatched.event, _objectSpread(_objectSpread({}, dispatched.detail || {}), {}, {
                        context: _this2.context
                      }));
                      if (event !== null && event !== void 0 && event.defaultPrevented) defaultPrevented = true;
                    case 3:
                      return _context4.a(2);
                  }
                }, _loop);
              });
              _iterator.s();
            case 3:
              if ((_step = _iterator.n()).done) {
                _context5.n = 5;
                break;
              }
              return _context5.d(_regeneratorValues(_loop()), 4);
            case 4:
              _context5.n = 3;
              break;
            case 5:
              _context5.n = 7;
              break;
            case 6:
              _context5.p = 6;
              _t = _context5.v;
              _iterator.e(_t);
            case 7:
              _context5.p = 7;
              _iterator.f();
              return _context5.f(7);
            case 8:
              return _context5.a(2, defaultPrevented);
          }
        }, _callee4, null, [[2, 6, 7, 8]]);
      }));
      function handleBrowserEvents() {
        return _handleBrowserEvents.apply(this, arguments);
      }
      return handleBrowserEvents;
    }() // Custom function, redirect the browser to another location
  }, {
    key: "handleRedirectResponse",
    value: function handleRedirectResponse(href) {
      var event = this.delegate.notifyApplicationBeforeRedirect();
      if (event.defaultPrevented) {
        return;
      }
      if (this.options.browserRedirectBack) {
        href = (0,_util_referrer__WEBPACK_IMPORTED_MODULE_2__.getReferrerUrl)() || href;
      }
      if (jax.useTurbo && jax.useTurbo()) {
        jax.visit(href);
      } else {
        location.assign(href);
      }
    }

    // Custom function, reload the browser
  }, {
    key: "handleReloadResponse",
    value: function handleReloadResponse() {
      location.reload();
    }

    // Mark known elements as being updated
  }, {
    key: "markAsUpdating",
    value: function markAsUpdating(isUpdating) {
      var updateOptions = this.options.update || {};
      for (var partial in updateOptions) {
        var selector = updateOptions[partial];
        var selectedEl = [];
        if (updateOptions['_self'] && partial == this.options.partial && this.delegate.partialEl) {
          selector = updateOptions['_self'];
          selectedEl = [this.delegate.partialEl];
        } else {
          selectedEl = (0,_dom_patcher__WEBPACK_IMPORTED_MODULE_1__.resolveSelectorResponse)(selector, '[data-ajax-partial="' + partial + '"]');
        }
        selectedEl.forEach(function (el) {
          if (isUpdating) {
            el.setAttribute('data-ajax-updating', '');
          } else {
            el.removeAttribute('data-ajax-updating');
          }
        });
      }
    }
  }, {
    key: "handleUpdateResponse",
    value: function () {
      var _handleUpdateResponse = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(data, responseCode, xhr) {
        var _this3 = this;
        var updateOptions, domPatcher;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              if (data.$env) {
                _context6.n = 1;
                break;
              }
              return _context6.a(2);
            case 1:
              updateOptions = this.options.update || {}, domPatcher = new _dom_patcher__WEBPACK_IMPORTED_MODULE_1__.DomPatcher(data.$env, updateOptions, {
                partial: this.options.partial,
                partialEl: this.delegate.partialEl
              });
              domPatcher.afterUpdate(function (el) {
                _this3.delegate.notifyApplicationAjaxUpdate(el, data, responseCode, xhr);
              });
              domPatcher.apply();

              // Wait for the dom patcher to finish rendering from partial updates
              setTimeout(function () {
                _this3.delegate.notifyApplicationUpdateComplete(data, responseCode, xhr);
                _this3.invoke('afterUpdate', [data, responseCode, xhr]);
                _this3.invokeFunc('afterUpdateFunc', data);
              }, 0);
            case 2:
              return _context6.a(2);
          }
        }, _callee5, this);
      }));
      function handleUpdateResponse(_x0, _x1, _x10) {
        return _handleUpdateResponse.apply(this, arguments);
      }
      return handleUpdateResponse;
    }()
  }, {
    key: "handleUpdateOperations",
    value: function () {
      var _handleUpdateOperations = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(data, responseCode, xhr) {
        var _data$$env4, _data$$env5, _data$$env6, _data$$env7, _data$$env8, _data$$env0;
        var flashMessages, flashMessage, browserEvents, redirectUrl, invalidFields, _data$$env9, loadAssets, _t2;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.n) {
            case 0:
              // Dispatch flash messages
              flashMessages = this.delegate.options.flash ? (_data$$env4 = data.$env) === null || _data$$env4 === void 0 ? void 0 : _data$$env4.getFlash() : null;
              if (flashMessages) {
                for (flashMessage in flashMessages) {
                  this.invoke('handleFlashMessage', [flashMessage.text, flashMessage.level]);
                }
              }

              // Handle browser events
              browserEvents = (_data$$env5 = data.$env) === null || _data$$env5 === void 0 ? void 0 : _data$$env5.getBrowserEvents();
              _t2 = browserEvents;
              if (!_t2) {
                _context7.n = 2;
                break;
              }
              _context7.n = 1;
              return this.invoke('handleBrowserEvents', [browserEvents]);
            case 1:
              _t2 = _context7.v;
            case 2:
              if (!_t2) {
                _context7.n = 3;
                break;
              }
              return _context7.a(2);
            case 3:
              // Handle redirect
              redirectUrl = (_data$$env6 = data.$env) === null || _data$$env6 === void 0 ? void 0 : _data$$env6.getRedirectUrl();
              if (redirectUrl) {
                this.delegate.toggleRedirect(redirectUrl);
              }
              if (this.delegate.isRedirect) {
                this.invoke('handleRedirectResponse', [this.delegate.options.redirect]);
              }
              if ((_data$$env7 = data.$env) !== null && _data$$env7 !== void 0 && _data$$env7.getReload()) {
                this.invoke('handleReloadResponse');
              }

              // Handle validation
              invalidFields = (_data$$env8 = data.$env) === null || _data$$env8 === void 0 ? void 0 : _data$$env8.getInvalid();
              if (invalidFields) {
                this.invoke('handleValidationMessage', [(_data$$env9 = data.$env) === null || _data$$env9 === void 0 ? void 0 : _data$$env9.getMessage(), invalidFields]);
              }

              // Handle asset injection
              loadAssets = (_data$$env0 = data.$env) === null || _data$$env0 === void 0 ? void 0 : _data$$env0.getAssets();
              if (!loadAssets) {
                _context7.n = 4;
                break;
              }
              _context7.n = 4;
              return _asset_manager__WEBPACK_IMPORTED_MODULE_0__.AssetManager.load(loadAssets);
            case 4:
              return _context7.a(2);
          }
        }, _callee6, this);
      }));
      function handleUpdateOperations(_x11, _x12, _x13) {
        return _handleUpdateOperations.apply(this, arguments);
      }
      return handleUpdateOperations;
    }() // Custom function, download a file response from the server
  }, {
    key: "handleFileDownload",
    value: function handleFileDownload(data, xhr) {
      if (this.options.browserTarget) {
        window.open(window.URL.createObjectURL(data), this.options.browserTarget);
        return;
      }
      var fileName = getFilenameFromHttpResponse(xhr);
      if (!fileName) {
        return;
      }
      var anchor = document.createElement('a');
      anchor.href = window.URL.createObjectURL(data);
      anchor.download = fileName;
      anchor.target = '_blank';
      anchor.click();
      window.URL.revokeObjectURL(anchor.href);
    }

    // Custom function, adds query data to the current URL
  }, {
    key: "applyQueryToUrl",
    value: function applyQueryToUrl(queryData) {
      var searchParams = new URLSearchParams(window.location.search);
      var _loop2 = function _loop2() {
        var key = _Object$keys[_i];
        var value = queryData[key];
        if (Array.isArray(value)) {
          searchParams["delete"](key);
          searchParams["delete"]("".concat(key, "[]"));
          value.forEach(function (val) {
            return searchParams.append("".concat(key, "[]"), val);
          });
        } else if (value === null) {
          searchParams["delete"](key);
          searchParams["delete"]("".concat(key, "[]"));
        } else {
          searchParams.set(key, value);
        }
      };
      for (var _i = 0, _Object$keys = Object.keys(queryData); _i < _Object$keys.length; _i++) {
        _loop2();
      }
      var newUrl = window.location.pathname,
        queryStr = searchParams.toString();
      if (queryStr) {
        newUrl += '?' + queryStr.replaceAll('%5B%5D=', '[]=');
      }
      if (jax.useTurbo && jax.useTurbo()) {
        jax.visit(newUrl, {
          action: 'swap',
          scroll: false
        });
      } else {
        history.replaceState(null, '', newUrl);

        // Tracking referrer since document.referrer will not update
        localStorage.setItem('ocPushStateReferrer', newUrl);
      }
    }
  }]);
}();
function getFilenameFromHttpResponse(xhr) {
  var contentDisposition = xhr.getResponseHeader('Content-Disposition');
  if (!contentDisposition) {
    return null;
  }
  var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/g;
  var match = null;
  var tmpMatch = null;
  while ((tmpMatch = filenameRegex.exec(contentDisposition)) !== null) {
    match = tmpMatch;
  }
  if (match !== null && match[1]) {
    // Decide ASCII or UTF-8 file name
    return /filename[^;*=\n]*\*=[^']*''/.exec(match[0]) === null ? match[1].replace(/['"]/g, '') : decodeURIComponent(match[1].substring(match[1].indexOf("''") + 2));
  }
  return null;
}

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/request/asset-manager.js"
/*!***********************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/request/asset-manager.js ***!
  \***********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AssetManager: () => (/* binding */ AssetManager)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var AssetManager = /*#__PURE__*/function () {
  function AssetManager() {
    _classCallCheck(this, AssetManager);
  }
  return _createClass(AssetManager, [{
    key: "loadCollection",
    value: function () {
      var _loadCollection = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var _collection$js,
          _collection$css,
          _collection$img,
          _this = this;
        var collection,
          jsList,
          cssList,
          imgList,
          _args = arguments;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              collection = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
              jsList = ((_collection$js = collection.js) !== null && _collection$js !== void 0 ? _collection$js : []).filter(function (asset) {
                return !document.querySelector("head script[src=\"".concat(htmlEscape(asset.url), "\"]"));
              });
              cssList = ((_collection$css = collection.css) !== null && _collection$css !== void 0 ? _collection$css : []).filter(function (asset) {
                return !document.querySelector("head link[href=\"".concat(htmlEscape(asset.url), "\"]"));
              });
              imgList = (_collection$img = collection.img) !== null && _collection$img !== void 0 ? _collection$img : [];
              if (!(!jsList.length && !cssList.length && !imgList.length)) {
                _context.n = 1;
                break;
              }
              return _context.a(2);
            case 1:
              _context.n = 2;
              return Promise.all([this.loadJavaScript(jsList), Promise.all(cssList.map(function (asset) {
                return _this.loadStyleSheet(asset);
              })), this.loadImages(imgList)]);
            case 2:
              return _context.a(2);
          }
        }, _callee, this);
      }));
      function loadCollection() {
        return _loadCollection.apply(this, arguments);
      }
      return loadCollection;
    }()
  }, {
    key: "loadStyleSheet",
    value: function loadStyleSheet(asset) {
      var url = asset.url,
        _asset$attributes = asset.attributes,
        attributes = _asset$attributes === void 0 ? {} : _asset$attributes;
      return new Promise(function (resolve, reject) {
        var el = document.createElement('link');
        el.rel = 'stylesheet';
        el.type = 'text/css';
        el.href = url;

        // Apply custom attributes
        for (var _i = 0, _Object$entries = Object.entries(attributes); _i < _Object$entries.length; _i++) {
          var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            key = _Object$entries$_i[0],
            value = _Object$entries$_i[1];
          if (value === true) {
            el.setAttribute(key, '');
          } else if (value !== false && value != null) {
            el.setAttribute(key, value);
          }
        }
        el.onload = function () {
          return resolve(el);
        };
        el.onerror = function () {
          return reject(new Error("Failed to load CSS: ".concat(url)));
        };
        document.head.appendChild(el);
      });
    }

    // Sequential loading (safer for dependencies)
  }, {
    key: "loadJavaScript",
    value: function loadJavaScript(list) {
      return list.reduce(function (p, asset) {
        var url = asset.url,
          _asset$attributes2 = asset.attributes,
          attributes = _asset$attributes2 === void 0 ? {} : _asset$attributes2;
        return p.then(function () {
          return new Promise(function (resolve, reject) {
            var el = document.createElement('script');

            // Set type based on attributes, default to text/javascript unless 'module' is specified
            if (attributes.type) {
              el.type = attributes.type;
            } else {
              el.type = 'text/javascript';
            }
            el.src = url;

            // Apply custom attributes (skip 'type' as it's already handled)
            for (var _i2 = 0, _Object$entries2 = Object.entries(attributes); _i2 < _Object$entries2.length; _i2++) {
              var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
                key = _Object$entries2$_i[0],
                value = _Object$entries2$_i[1];
              if (key === 'type') continue;
              if (value === true) {
                el.setAttribute(key, '');
              } else if (value !== false && value != null) {
                el.setAttribute(key, value);
              }
            }
            el.onload = function () {
              return resolve(el);
            };
            el.onerror = function () {
              return reject(new Error("Failed to load JS: ".concat(url)));
            };
            document.head.appendChild(el);
          });
        });
      }, Promise.resolve());
    }
  }, {
    key: "loadImages",
    value: function loadImages(list) {
      if (!list.length) return Promise.resolve();
      return Promise.all(list.map(function (asset) {
        return new Promise(function (resolve, reject) {
          var url = asset.url;
          var img = new Image();
          img.onload = function () {
            return resolve(url);
          };
          img.onerror = function () {
            return reject(new Error("Failed to load image: ".concat(url)));
          };
          img.src = url;
        });
      }));
    }
  }], [{
    key: "load",
    value:
    /**
     * Load a collection of assets.
     * @param {{js?: Array<{url: string, attributes?: object}>, css?: Array<{url: string, attributes?: object}>, img?: Array<{url: string, attributes?: object}>}} collection
     * @param {(err?: Error) => void} [callback]  // optional; called on success or with error
     * @returns {Promise<void>}
     */
    function load() {
      var collection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var callback = arguments.length > 1 ? arguments[1] : undefined;
      var manager = new AssetManager(),
        promise = manager.loadCollection(collection);
      if (typeof callback === 'function') {
        promise.then(function () {
          return callback();
        });
      }
      return promise;
    }
  }]);
}();

// Minimal escaping for querySelector
function htmlEscape(value) {
  return String(value).replace(/"/g, '\\"');
}

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/request/data.js"
/*!**************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/request/data.js ***!
  \**************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Data: () => (/* binding */ Data)
/* harmony export */ });
/* harmony import */ var _util_form_serializer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/form-serializer */ "./vendor/larajax/larajax/resources/src/util/form-serializer.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var Data = /*#__PURE__*/function () {
  function Data(userData, targetEl, formEl) {
    _classCallCheck(this, Data);
    this.userData = userData || {};
    this.targetEl = targetEl;
    this.formEl = formEl;
  }

  // Public
  return _createClass(Data, [{
    key: "getRequestData",
    value: function getRequestData() {
      var requestData;

      // Serialize form
      if (this.formEl) {
        requestData = new FormData(this.formEl);
      } else {
        requestData = new FormData();
      }

      // Add single input data
      this.appendSingleInputElement(requestData);
      return requestData;
    }
  }, {
    key: "getAsFormData",
    value: function getAsFormData() {
      return this.appendJsonToFormData(this.getRequestData(), this.userData);
    }
  }, {
    key: "getAsQueryString",
    value: function getAsQueryString() {
      return this.convertFormDataToQuery(this.getAsFormData());
    }
  }, {
    key: "getAsJsonData",
    value: function getAsJsonData() {
      return JSON.stringify(this.convertFormDataToJson(this.getAsFormData()));
    }

    // Private
  }, {
    key: "appendSingleInputElement",
    value: function appendSingleInputElement(requestData) {
      // Has a form, no target element, or not a singular input
      if (this.formEl || !this.targetEl || !isElementInput(this.targetEl)) {
        return;
      }

      // No name or supplied by user data already
      var inputName = this.targetEl.name;
      if (!inputName || this.userData[inputName] !== undefined) {
        return;
      }

      // Include files, if they are any
      if (this.targetEl.type === 'file') {
        this.targetEl.files.forEach(function (value) {
          requestData.append(inputName, value);
        });
      } else {
        requestData.append(inputName, this.targetEl.value);
      }
    }
  }, {
    key: "appendJsonToFormData",
    value: function appendJsonToFormData(formData, useJson, parentKey) {
      var self = this;
      for (var key in useJson) {
        var fieldKey = key;
        if (parentKey) {
          fieldKey = parentKey + '[' + key + ']';
        }
        var value = useJson[key];

        // Object
        if (value && value.constructor === {}.constructor) {
          this.appendJsonToFormData(formData, value, fieldKey);
        }
        // Array
        else if (value && value.constructor === [].constructor) {
          value.forEach(function (v, i) {
            if (v.constructor === {}.constructor || v.constructor === [].constructor) {
              self.appendJsonToFormData(formData, v, fieldKey + '[' + i + ']');
            } else {
              formData.append(fieldKey + '[]', self.castJsonToFormData(v));
            }
          });
        }
        // Mixed
        else {
          formData.append(fieldKey, this.castJsonToFormData(value));
        }
      }
      return formData;
    }
  }, {
    key: "convertFormDataToQuery",
    value: function convertFormDataToQuery(formData) {
      // Process to a flat object with array values
      var flatData = this.formDataToArray(formData);

      // Process HTML names to a query string
      return Object.keys(flatData).map(function (key) {
        if (key.endsWith('[]')) {
          return flatData[key].map(function (val) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(val);
          }).join('&');
        } else {
          return encodeURIComponent(key) + '=' + encodeURIComponent(flatData[key]);
        }
      }).join('&');
    }
  }, {
    key: "convertFormDataToJson",
    value: function convertFormDataToJson(formData) {
      // Process to a flat object with array values
      var flatData = this.formDataToArray(formData);

      // Process HTML names to a nested object
      var jsonData = {};
      for (var key in flatData) {
        _util_form_serializer__WEBPACK_IMPORTED_MODULE_0__.FormSerializer.assignToObj(jsonData, key, flatData[key]);
      }
      return jsonData;
    }
  }, {
    key: "formDataToArray",
    value: function formDataToArray(formData) {
      return Object.fromEntries(Array.from(formData.keys()).map(function (key) {
        return [key, key.endsWith('[]') ? formData.getAll(key) : formData.getAll(key).pop()];
      }));
    }
  }, {
    key: "castJsonToFormData",
    value: function castJsonToFormData(val) {
      if (val === null || val === undefined) {
        return '';
      }
      if (val === true) {
        return '1';
      }
      if (val === false) {
        return '0';
      }
      return val;
    }
  }]);
}();
function isElementInput(el) {
  return ['input', 'select', 'textarea'].includes((el.tagName || '').toLowerCase());
}

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/request/dom-patcher.js"
/*!*********************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/request/dom-patcher.js ***!
  \*********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DomPatcher: () => (/* binding */ DomPatcher),
/* harmony export */   DomUpdateMode: () => (/* binding */ DomUpdateMode),
/* harmony export */   resolveSelectorResponse: () => (/* binding */ resolveSelectorResponse)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var DomUpdateMode = {
  replaceWith: 'replace',
  prepend: 'prepend',
  append: 'append',
  update: 'innerHTML'
};
var DomPatcher = /*#__PURE__*/function () {
  function DomPatcher(envelope, partialMap) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    _classCallCheck(this, DomPatcher);
    this.options = options;
    this.envelope = envelope;
    this.partialMap = partialMap;
    this.afterUpdateCallback = null;
  }
  return _createClass(DomPatcher, [{
    key: "apply",
    value: function apply() {
      this.applyPartialUpdates();
      this.applyDomUpdates();
    }
  }, {
    key: "afterUpdate",
    value: function afterUpdate(callback) {
      this.afterUpdateCallback = callback;
    }

    // Should patch the dom using the envelope.getPartials()
    // which is expected to be { partialName: html contents }
  }, {
    key: "applyPartialUpdates",
    value: function applyPartialUpdates() {
      var _this = this;
      var partials = this.envelope.getPartials();
      partials.forEach(function (partial) {
        var selector = _this.partialMap[partial.name];
        var selectedEl = [];

        // If the update options has a _self, values like true and '^' will resolve to the partial element,
        // these values are also used to make AJAX partial handlers available without performing an update
        if (_this.partialMap['_self'] && partial == _this.options.partial && _this.options.partialEl) {
          selector = _this.partialMap['_self'];
          selectedEl = [_this.options.partialEl];
        } else if (selector) {
          selectedEl = resolveSelectorResponse(selector, '[data-ajax-partial="' + partial + '"]');
        }
        selectedEl.forEach(function (el) {
          _this.patchDom(el, partial.html, getSelectorUpdateMode(selector, el));
        });
      });
    }

    // Should patch the dom using the envelope.getDomPatches()
  }, {
    key: "applyDomUpdates",
    value: function applyDomUpdates() {
      var _this2 = this;
      var updates = this.envelope.getDomPatches();
      updates.forEach(function (update) {
        document.querySelectorAll(update.selector).forEach(function (el) {
          _this2.patchDom(el, update.html, update.swap);
        });
      });
    }
  }, {
    key: "patchDom",
    value: function patchDom(element, content, swapType) {
      var parentEl = element.parentNode;
      switch (swapType) {
        case 'append':
        case 'beforeend':
          element.insertAdjacentHTML('beforeend', content);
          runScriptsOnFragment(element, content);
          break;
        case 'afterend':
          element.insertAdjacentHTML('afterend', content);
          runScriptsOnFragment(element, content);
          break;
        case 'beforebegin':
          element.insertAdjacentHTML('beforebegin', content);
          runScriptsOnFragment(element, content);
          break;
        case 'prepend':
        case 'afterbegin':
          element.insertAdjacentHTML('afterbegin', content);
          runScriptsOnFragment(element, content);
          break;
        case 'replace':
          element.replaceWith(content);
          runScriptsOnFragment(parentEl, content);
          break;
        case 'outerHTML':
          element.outerHTML = content;
          runScriptsOnFragment(parentEl, content);
          break;
        default:
        case 'innerHTML':
          element.innerHTML = content;
          runScriptsOnElement(element);
          break;
      }
      if (this.afterUpdateCallback) {
        this.afterUpdateCallback(element);
      }
    }
  }]);
}();
function resolveSelectorResponse(selector, partialSelector) {
  // Look for AJAX partial selectors
  if (selector === true) {
    return document.querySelectorAll(partialSelector);
  }

  // Selector is DOM element
  if (typeof selector !== 'string') {
    return [selector];
  }

  // Invalid selector
  if (['#', '.', '@', '^', '!', '='].indexOf(selector.charAt(0)) === -1) {
    return [];
  }

  // Append, prepend, replace with or custom selector
  if (['@', '^', '!', '='].indexOf(selector.charAt(0)) !== -1) {
    selector = selector.substring(1);
  }

  // Empty selector remains
  if (!selector) {
    selector = partialSelector;
  }
  return document.querySelectorAll(selector);
}
function getSelectorUpdateMode(selector, el) {
  // Look at selector prefix
  if (typeof selector === 'string') {
    if (selector.charAt(0) === '!') {
      return DomUpdateMode.replaceWith;
    }
    if (selector.charAt(0) === '@') {
      return DomUpdateMode.append;
    }
    if (selector.charAt(0) === '^') {
      return DomUpdateMode.prepend;
    }
  }

  // Look at element dataset
  if (el.dataset.ajaxUpdateMode !== undefined) {
    return el.dataset.ajaxUpdateMode;
  }

  // Default mode
  return DomUpdateMode.update;
}

// Replaces blocked scripts with fresh nodes
function runScriptsOnElement(el) {
  Array.from(el.querySelectorAll('script')).forEach(function (oldScript) {
    var newScript = document.createElement('script');
    Array.from(oldScript.attributes).forEach(function (attr) {
      return newScript.setAttribute(attr.name, attr.value);
    });
    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
}

// Runs scripts on a fragment inside a container
function runScriptsOnFragment(container, html) {
  var div = document.createElement('div');
  div.innerHTML = html;
  Array.from(div.querySelectorAll('script')).forEach(function (oldScript) {
    var newScript = document.createElement('script');
    Array.from(oldScript.attributes).forEach(function (attr) {
      return newScript.setAttribute(attr.name, attr.value);
    });
    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
    container.appendChild(newScript);
    container.removeChild(newScript);
  });
}

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/request/envelope.js"
/*!******************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/request/envelope.js ***!
  \******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Envelope: () => (/* binding */ Envelope)
/* harmony export */ });
var _excluded = ["__ajax"];
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Envelope = /*#__PURE__*/function () {
  function Envelope() {
    var _body$message;
    var response = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
    _classCallCheck(this, Envelope);
    var body = response.__ajax,
      data = _objectWithoutProperties(response, _excluded);
    this.ok = !!body.ok;
    this.severity = body.severity || 'info';
    this.message = (_body$message = body.message) !== null && _body$message !== void 0 ? _body$message : null;
    this.data = data || {};
    this.invalid = body.invalid || {};
    this.ops = Array.isArray(body.ops) ? body.ops : [];
    this.redirect = null;
    this.status = status;
  }
  return _createClass(Envelope, [{
    key: "isFatal",
    value: function isFatal() {
      return this.severity === 'fatal' || this.status >= 500 && this.status <= 599;
    }
  }, {
    key: "isError",
    value: function isError() {
      return this.severity === 'error' || this.isFatal() || this.ok === false;
    }
  }, {
    key: "getMessage",
    value: function getMessage() {
      return this.message;
    }
  }, {
    key: "getInvalid",
    value: function getInvalid() {
      return this.invalid || {};
    }
  }, {
    key: "getData",
    value: function getData() {
      return this.data || {};
    }
  }, {
    key: "getStatus",
    value: function getStatus() {
      return this.status;
    }
  }, {
    key: "getSeverity",
    value: function getSeverity() {
      return this.severity;
    }
  }, {
    key: "getOps",
    value: function getOps(type) {
      if (!type) {
        return this.ops;
      }
      return this.ops.filter(function (o) {
        return (o === null || o === void 0 ? void 0 : o.op) === type;
      });
    }
  }, {
    key: "getFlash",
    value: function getFlash() {
      return this.getOps('flash').map(function (_ref) {
        var _ref$level = _ref.level,
          level = _ref$level === void 0 ? 'info' : _ref$level,
          _ref$text = _ref.text,
          text = _ref$text === void 0 ? '' : _ref$text;
        return {
          level: level,
          text: text
        };
      });
    }
  }, {
    key: "getBrowserEvents",
    value: function getBrowserEvents() {
      return this.getOps('dispatch').map(function (_ref2) {
        var _ref2$selector = _ref2.selector,
          selector = _ref2$selector === void 0 ? null : _ref2$selector,
          event = _ref2.event,
          detail = _ref2.detail,
          async = _ref2.async;
        return {
          selector: selector,
          event: event,
          detail: detail,
          async: async
        };
      });
    }
  }, {
    key: "getDomPatches",
    value: function getDomPatches() {
      return this.getOps('patchDom').map(function (_ref3) {
        var selector = _ref3.selector,
          _ref3$html = _ref3.html,
          html = _ref3$html === void 0 ? '' : _ref3$html,
          _ref3$swap = _ref3.swap,
          swap = _ref3$swap === void 0 ? 'innerHTML' : _ref3$swap;
        return {
          selector: selector,
          html: html,
          swap: swap
        };
      });
    }
  }, {
    key: "getPartials",
    value: function getPartials() {
      return this.getOps('partial').map(function (_ref4) {
        var name = _ref4.name,
          _ref4$html = _ref4.html,
          html = _ref4$html === void 0 ? '' : _ref4$html;
        return {
          name: name,
          html: html
        };
      });
    }
  }, {
    key: "getAssets",
    value: function getAssets() {
      var out = {
        js: [],
        css: [],
        img: []
      };
      var seen = {
        js: new Set(),
        css: new Set(),
        img: new Set()
      };
      var _iterator = _createForOfIteratorHelper(this.getOps('loadAssets')),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _step.value,
            type = _step$value.type,
            _step$value$assets = _step$value.assets,
            assets = _step$value$assets === void 0 ? [] : _step$value$assets;
          if (!out[type]) {
            continue;
          }
          var _iterator2 = _createForOfIteratorHelper(assets),
            _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var asset = _step2.value;
              // Handle both string and { url, attributes } formats
              var url = typeof asset === 'string' ? asset : asset.url;
              if (!seen[type].has(url)) {
                seen[type].add(url);
                out[type].push(typeof asset === 'string' ? {
                  url: asset
                } : asset);
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return out;
    }
  }, {
    key: "getRedirectUrl",
    value: function getRedirectUrl() {
      var op = this.getOps('redirect')[0];
      return (op === null || op === void 0 ? void 0 : op.url) || this.redirect || null;
    }
  }, {
    key: "getReload",
    value: function getReload() {
      return this.getOps('reload')[0] || null;
    }
  }]);
}();

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/request/namespace.js"
/*!*******************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/request/namespace.js ***!
  \*******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./request */ "./vendor/larajax/larajax/resources/src/request/request.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_request__WEBPACK_IMPORTED_MODULE_0__.Request);

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/request/options.js"
/*!*****************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/request/options.js ***!
  \*****************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Options: () => (/* binding */ Options)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Options = /*#__PURE__*/function () {
  function Options(handler, options) {
    _classCallCheck(this, Options);
    if (!handler) {
      throw new Error('The request handler name is not specified.');
    }
    if (!handler.match(/^(?:\w+\:{2})?on*/)) {
      throw new Error('Invalid handler name. The correct handler name format is: "onEvent".');
    }
    if (typeof FormData === 'undefined') {
      throw new Error('The browser does not support the FormData interface.');
    }
    this.options = options;
    this.handler = handler;
  }
  return _createClass(Options, [{
    key: "getRequestOptions",
    value:
    // Public
    function getRequestOptions() {
      return {
        method: 'POST',
        url: this.options.url ? this.options.url : window.location.href,
        headers: this.buildHeaders()
      };
    }

    // Private
  }, {
    key: "buildHeaders",
    value: function buildHeaders() {
      var handler = this.handler,
        options = this.options;
      var headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'X-AJAX-HANDLER': handler
      };
      if (!options.files) {
        headers['Content-Type'] = options.bulk ? 'application/json' : 'application/x-www-form-urlencoded';
      }
      if (options.flash) {
        headers['X-AJAX-FLASH'] = 1;
      }
      if (options.partial) {
        headers['X-AJAX-PARTIAL'] = options.partial;
      }
      var partials = this.extractPartials(options.update, options.partial);
      if (partials) {
        headers['X-AJAX-PARTIALS'] = partials;
      }
      var xsrfToken = this.getXSRFToken();
      if (xsrfToken) {
        headers['X-XSRF-TOKEN'] = xsrfToken;
      }
      var csrfToken = this.getCSRFToken();
      if (csrfToken) {
        headers['X-CSRF-TOKEN'] = csrfToken;
      }
      if (options.headers && options.headers.constructor === {}.constructor) {
        Object.assign(headers, options.headers);
      }
      return headers;
    }
  }, {
    key: "extractPartials",
    value: function extractPartials() {
      var update = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var selfPartial = arguments.length > 1 ? arguments[1] : undefined;
      var result = [];
      if (update) {
        if (_typeof(update) !== 'object') {
          throw new Error('Invalid update value. The correct format is an object ({...})');
        }
        for (var partial in update) {
          if (partial === '_self' && selfPartial) {
            result.push(selfPartial);
          } else {
            result.push(partial);
          }
        }
      }
      return result.join('&');
    }
  }, {
    key: "getCSRFToken",
    value: function getCSRFToken() {
      var tag = document.querySelector('meta[name="csrf-token"]');
      return tag ? tag.getAttribute('content') : null;
    }
  }, {
    key: "getXSRFToken",
    value: function getXSRFToken() {
      var cookieValue = null;
      if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
          var cookie = cookies[i].replace(/^([\s]*)|([\s]*)$/g, '');
          if (cookie.substring(0, 11) == 'XSRF-TOKEN' + '=') {
            cookieValue = decodeURIComponent(cookie.substring(11));
            break;
          }
        }
      }
      return cookieValue;
    }
  }], [{
    key: "fetch",
    value: function fetch(handler, options) {
      return new this(handler, options).getRequestOptions();
    }
  }]);
}();

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/request/request.js"
/*!*****************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/request/request.js ***!
  \*****************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Request: () => (/* binding */ Request)
/* harmony export */ });
/* harmony import */ var _envelope__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./envelope */ "./vendor/larajax/larajax/resources/src/request/envelope.js");
/* harmony import */ var _options__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./options */ "./vendor/larajax/larajax/resources/src/request/options.js");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./actions */ "./vendor/larajax/larajax/resources/src/request/actions.js");
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./data */ "./vendor/larajax/larajax/resources/src/request/data.js");
/* harmony import */ var _util_http_request__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../util/http-request */ "./vendor/larajax/larajax/resources/src/util/http-request.js");
/* harmony import */ var _extras_progress_bar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../extras/progress-bar */ "./vendor/larajax/larajax/resources/src/extras/progress-bar.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../util */ "./vendor/larajax/larajax/resources/src/util/index.js");
/* harmony import */ var _util_promise__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../util/promise */ "./vendor/larajax/larajax/resources/src/util/promise.js");
var _excluded = ["__ajax"];
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }








var Request = /*#__PURE__*/function () {
  function Request(element, handler, options) {
    var _this = this;
    _classCallCheck(this, Request);
    this.el = element;
    this.handler = handler;
    this.options = _objectSpread(_objectSpread({}, this.constructor.DEFAULTS), options || {});
    this.context = {
      el: element,
      handler: handler,
      options: this.options
    };
    this.progressBar = new _extras_progress_bar__WEBPACK_IMPORTED_MODULE_5__.ProgressBar();
    this.showProgressBar = function () {
      _this.progressBar.show({
        cssClass: 'is-ajax'
      });
    };
  }
  return _createClass(Request, [{
    key: "start",
    value: function start() {
      // Setup
      if (!this.applicationAllowsSetup()) {
        return;
      }
      this.initOtherElements();
      this.preprocessOptions();

      // Prepare actions
      this.actions = new _actions__WEBPACK_IMPORTED_MODULE_2__.Actions(this, this.context, this.options);
      if (this.actions.invokeFunc('beforeSendFunc') === false) {
        return;
      }
      if (!this.validateClientSideForm() || !this.applicationAllowsRequest()) {
        return;
      }

      // Confirm before sending
      if (this.options.confirm && !this.actions.invoke('handleConfirmMessage', [this.options.confirm])) {
        return;
      }

      // Send request
      this.sendInternal();
      return this.promise;
    }
  }, {
    key: "sendInternal",
    value: function sendInternal() {
      var _this2 = this;
      // Prepare data
      var dataObj = new _data__WEBPACK_IMPORTED_MODULE_3__.Data(this.options.data, this.el, this.formEl);
      var data;
      if (this.options.files) {
        data = dataObj.getAsFormData();
      } else if (this.options.bulk) {
        data = dataObj.getAsJsonData();
      } else {
        data = dataObj.getAsQueryString();
      }

      // Prepare query
      if (this.options.query) {
        this.actions.invoke('applyQueryToUrl', [this.options.query !== true ? this.options.query : JSON.parse(dataObj.getAsJsonData())]);
      }

      // Prepare request
      var _Options$fetch = _options__WEBPACK_IMPORTED_MODULE_1__.Options.fetch(this.handler, this.options),
        url = _Options$fetch.url,
        headers = _Options$fetch.headers,
        method = _Options$fetch.method;
      this.request = new _util_http_request__WEBPACK_IMPORTED_MODULE_4__.HttpRequest(this, url, {
        method: method,
        headers: headers,
        data: data,
        trackAbort: true
      });
      this.promise = (0,_util_promise__WEBPACK_IMPORTED_MODULE_7__.cancellablePromise)();
      this.isRedirect = this.options.redirect && this.options.redirect.length > 0;

      // Lifecycle events
      this.notifyApplicationBeforeSend();
      this.notifyApplicationAjaxPromise();
      this.promise.onCancel(function () {
        _this2.request.abort();
      }).then(function (data) {
        if (!_this2.isRedirect) {
          _this2.notifyApplicationAjaxDone(data, data.$status, data.$xhr);
          _this2.notifyApplicationAjaxAlways(data, data.$status, data.$xhr);
          _this2.notifyApplicationSendComplete(data, data.$status, data.$xhr);
        }
      })["catch"](function (data) {
        if (!_this2.isRedirect) {
          _this2.notifyApplicationAjaxFail(data, data.$status, data.$xhr);
          _this2.notifyApplicationAjaxAlways(data, data.$status, data.$xhr);
          _this2.notifyApplicationSendComplete(data, data.$status, data.$xhr);
        }
      });
      this.request.send();
    }
  }, {
    key: "toggleRedirect",
    value: function toggleRedirect(redirectUrl) {
      if (!redirectUrl) {
        this.options.redirect = null;
        this.isRedirect = false;
      } else {
        this.options.redirect = redirectUrl;
        this.isRedirect = true;
      }
    }
  }, {
    key: "applicationAllowsSetup",
    value: function applicationAllowsSetup() {
      var event = this.notifyApplicationAjaxSetup();
      return !event.defaultPrevented;
    }
  }, {
    key: "applicationAllowsRequest",
    value: function applicationAllowsRequest() {
      var event = this.notifyApplicationBeforeRequest();
      return !event.defaultPrevented;
    }
  }, {
    key: "applicationAllowsUpdate",
    value: function applicationAllowsUpdate(data, responseCode, xhr) {
      var event = this.notifyApplicationBeforeUpdate(data, responseCode, xhr);
      return !event.defaultPrevented;
    }
  }, {
    key: "applicationAllowsError",
    value: function applicationAllowsError(message, responseCode, xhr) {
      var event = this.notifyApplicationRequestError(message, responseCode, xhr);
      return !event.defaultPrevented;
    }

    // Application events
  }, {
    key: "notifyApplicationAjaxSetup",
    value: function notifyApplicationAjaxSetup() {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:setup', {
        target: this.el,
        detail: {
          context: this.context
        }
      });
    }
  }, {
    key: "notifyApplicationAjaxPromise",
    value: function notifyApplicationAjaxPromise() {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:promise', {
        target: this.el,
        detail: {
          context: this.context
        }
      });
    }
  }, {
    key: "notifyApplicationAjaxFail",
    value: function notifyApplicationAjaxFail(data, responseCode, xhr) {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:fail', {
        target: this.el,
        detail: {
          context: this.context,
          data: data,
          responseCode: responseCode,
          xhr: xhr
        }
      });
    }
  }, {
    key: "notifyApplicationAjaxDone",
    value: function notifyApplicationAjaxDone(data, responseCode, xhr) {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:done', {
        target: this.el,
        detail: {
          context: this.context,
          data: data,
          responseCode: responseCode,
          xhr: xhr
        }
      });
    }
  }, {
    key: "notifyApplicationAjaxAlways",
    value: function notifyApplicationAjaxAlways(data, responseCode, xhr) {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:always', {
        target: this.el,
        detail: {
          context: this.context,
          data: data,
          responseCode: responseCode,
          xhr: xhr
        }
      });
    }
  }, {
    key: "notifyApplicationAjaxUpdate",
    value: function notifyApplicationAjaxUpdate(target, data, responseCode, xhr) {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:update', {
        target: target,
        detail: {
          context: this.context,
          data: data,
          responseCode: responseCode,
          xhr: xhr
        }
      });
    }
  }, {
    key: "notifyApplicationBeforeRedirect",
    value: function notifyApplicationBeforeRedirect() {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:before-redirect', {
        target: this.el
      });
    }

    // Container-based events
  }, {
    key: "notifyApplicationBeforeRequest",
    value: function notifyApplicationBeforeRequest() {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:before-request', {
        target: this.triggerEl,
        detail: {
          context: this.context
        }
      });
    }
  }, {
    key: "notifyApplicationBeforeUpdate",
    value: function notifyApplicationBeforeUpdate(data, responseCode, xhr) {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:before-update', {
        target: this.triggerEl,
        detail: {
          context: this.context,
          data: data,
          responseCode: responseCode,
          xhr: xhr
        }
      });
    }
  }, {
    key: "notifyApplicationRequestSuccess",
    value: function notifyApplicationRequestSuccess(data, responseCode, xhr) {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:request-success', {
        target: this.triggerEl,
        detail: {
          context: this.context,
          data: data,
          responseCode: responseCode,
          xhr: xhr
        }
      });
    }
  }, {
    key: "notifyApplicationRequestError",
    value: function notifyApplicationRequestError(message, responseCode, xhr) {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:request-error', {
        target: this.triggerEl,
        detail: {
          context: this.context,
          message: message,
          responseCode: responseCode,
          xhr: xhr
        }
      });
    }
  }, {
    key: "notifyApplicationRequestComplete",
    value: function notifyApplicationRequestComplete(data, responseCode, xhr) {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:request-complete', {
        target: this.triggerEl,
        detail: {
          context: this.context,
          data: data,
          responseCode: responseCode,
          xhr: xhr
        }
      });
    }
  }, {
    key: "notifyApplicationBeforeValidate",
    value: function notifyApplicationBeforeValidate(message, fields) {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:before-validate', {
        target: this.triggerEl,
        detail: {
          context: this.context,
          message: message,
          fields: fields
        }
      });
    }
  }, {
    key: "notifyApplicationBeforeReplace",
    value: function notifyApplicationBeforeReplace(target) {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:before-replace', {
        target: target
      });
    }

    // Window-based events
  }, {
    key: "notifyApplicationBeforeSend",
    value: function notifyApplicationBeforeSend() {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:before-send', {
        target: window,
        detail: {
          context: this.context
        }
      });
    }
  }, {
    key: "notifyApplicationUpdateComplete",
    value: function notifyApplicationUpdateComplete(data, responseCode, xhr) {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:update-complete', {
        target: window,
        detail: {
          context: this.context,
          data: data,
          responseCode: responseCode,
          xhr: xhr
        }
      });
    }
  }, {
    key: "notifyApplicationSendComplete",
    value: function notifyApplicationSendComplete(data, responseCode, xhr) {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:send-complete', {
        target: window,
        detail: {
          context: this.context,
          data: data,
          responseCode: responseCode,
          xhr: xhr
        }
      });
    }
  }, {
    key: "notifyApplicationFieldInvalid",
    value: function notifyApplicationFieldInvalid(element, fieldName, errorMsg, isFirst) {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:invalid-field', {
        target: window,
        detail: {
          element: element,
          fieldName: fieldName,
          errorMsg: errorMsg,
          isFirst: isFirst
        }
      });
    }
  }, {
    key: "notifyApplicationConfirmMessage",
    value: function notifyApplicationConfirmMessage(message, promise) {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:confirm-message', {
        target: window,
        detail: {
          message: message,
          promise: promise
        }
      });
    }
  }, {
    key: "notifyApplicationErrorMessage",
    value: function notifyApplicationErrorMessage(message) {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:error-message', {
        target: window,
        detail: {
          message: message
        }
      });
    }
  }, {
    key: "notifyApplicationCustomEvent",
    value: function notifyApplicationCustomEvent(name, data) {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)(name, {
        target: this.el,
        detail: data
      });
    }

    // HTTP request delegate
  }, {
    key: "requestStarted",
    value: function requestStarted() {
      this.markAsProgress(true);
      this.toggleLoadingElement(true);
      if (this.options.progressBar) {
        this.showProgressBarAfterDelay();
      }
      this.actions.invoke('start', [this.request.xhr]);
    }
  }, {
    key: "requestProgressed",
    value: function requestProgressed(progress) {}
  }, {
    key: "requestCompletedWithResponse",
    value: function () {
      var _requestCompletedWithResponse = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(response, statusCode) {
        var data;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              data = decorateResponse(response, statusCode, this.request.xhr);
              _context.n = 1;
              return this.actions.invoke('success', [data, statusCode, this.request.xhr]);
            case 1:
              _context.n = 2;
              return this.actions.invoke('complete', [data, statusCode, this.request.xhr]);
            case 2:
              this.promise.resolve(data);
            case 3:
              return _context.a(2);
          }
        }, _callee, this);
      }));
      function requestCompletedWithResponse(_x, _x2) {
        return _requestCompletedWithResponse.apply(this, arguments);
      }
      return requestCompletedWithResponse;
    }()
  }, {
    key: "requestFailedWithStatusCode",
    value: function () {
      var _requestFailedWithStatusCode = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(statusCode, response) {
        var data;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              data = decorateResponse(response, statusCode, this.request.xhr);
              if (!(statusCode == _util_http_request__WEBPACK_IMPORTED_MODULE_4__.SystemStatusCode.userAborted)) {
                _context2.n = 2;
                break;
              }
              _context2.n = 1;
              return this.actions.invoke('cancel', []);
            case 1:
              _context2.n = 3;
              break;
            case 2:
              _context2.n = 3;
              return this.actions.invoke('error', [data, statusCode, this.request.xhr]);
            case 3:
              _context2.n = 4;
              return this.actions.invoke('complete', [data, statusCode, this.request.xhr]);
            case 4:
              this.promise.reject(data);
            case 5:
              return _context2.a(2);
          }
        }, _callee2, this);
      }));
      function requestFailedWithStatusCode(_x3, _x4) {
        return _requestFailedWithStatusCode.apply(this, arguments);
      }
      return requestFailedWithStatusCode;
    }()
  }, {
    key: "requestFinished",
    value: function requestFinished() {
      this.markAsProgress(false);
      this.toggleLoadingElement(false);
      if (this.options.progressBar) {
        this.hideProgressBar();
      }
    }

    // Private
  }, {
    key: "initOtherElements",
    value: function initOtherElements() {
      if (typeof this.options.form === 'string') {
        this.formEl = document.querySelector(this.options.form);
      } else if (this.options.form) {
        this.formEl = this.options.form;
      } else {
        this.formEl = this.el && this.el !== document ? this.el.closest('form') : null;
      }
      this.triggerEl = this.formEl || this.el !== document && this.el.closest('[data-request-scope]') || document.body;
      this.partialEl = this.el && this.el !== document ? this.el.closest('[data-ajax-partial]') : null;
      this.loadingEl = typeof this.options.loading === 'string' ? document.querySelector(this.options.loading) : this.options.loading;
    }
  }, {
    key: "preprocessOptions",
    value: function preprocessOptions() {
      // Partial mode
      if (this.options.partial === undefined && this.partialEl && this.partialEl.dataset.ajaxPartial !== undefined) {
        this.options.partial = this.partialEl.dataset.ajaxPartial || true;
      }
    }
  }, {
    key: "validateClientSideForm",
    value: function validateClientSideForm() {
      if (this.options.browserValidate && typeof document.createElement('input').reportValidity === 'function' && this.formEl && !this.formEl.checkValidity()) {
        this.formEl.reportValidity();
        return false;
      }
      return true;
    }
  }, {
    key: "toggleLoadingElement",
    value: function toggleLoadingElement(isLoading) {
      if (!this.loadingEl) {
        return;
      }
      if (typeof this.loadingEl.show !== 'function' || typeof this.loadingEl.hide !== 'function') {
        this.loadingEl.style.display = isLoading ? 'block' : 'none';
        return;
      }
      if (isLoading) {
        this.loadingEl.show();
      } else {
        this.loadingEl.hide();
      }
    }
  }, {
    key: "showProgressBarAfterDelay",
    value: function showProgressBarAfterDelay() {
      this.progressBar.setValue(0);
      this.progressBarTimeout = window.setTimeout(this.showProgressBar, this.options.progressBarDelay);
    }
  }, {
    key: "hideProgressBar",
    value: function hideProgressBar() {
      this.progressBar.setValue(100);
      this.progressBar.hide();
      if (this.progressBarTimeout != null) {
        window.clearTimeout(this.progressBarTimeout);
        delete this.progressBarTimeout;
      }
    }
  }, {
    key: "markAsProgress",
    value: function markAsProgress(isLoading) {
      if (isLoading) {
        document.documentElement.setAttribute('data-ajax-progress', '');
        if (this.formEl) {
          this.formEl.setAttribute('data-ajax-progress', this.handler);
        }
      } else {
        document.documentElement.removeAttribute('data-ajax-progress');
        if (this.formEl) {
          this.formEl.removeAttribute('data-ajax-progress');
        }
      }
    }
  }], [{
    key: "DEFAULTS",
    get: function get() {
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
  }, {
    key: "send",
    value: function send(handler, options) {
      return new Request(document, handler, options).start();
    }
  }, {
    key: "sendElement",
    value: function sendElement(element, handler, options) {
      if (typeof element === 'string') {
        element = document.querySelector(element);
      }
      return new Request(element, handler, options).start();
    }
  }]);
}();
function decorateResponse(response, statusCode, xhr) {
  if (!response || response.constructor !== {}.constructor || !response.__ajax) {
    return response;
  }
  var __ajax = response.__ajax,
    data = _objectWithoutProperties(response, _excluded),
    envelope = new _envelope__WEBPACK_IMPORTED_MODULE_0__.Envelope(response, statusCode),
    meta = {
      env: envelope,
      status: statusCode,
      xhr: xhr
    };

  // Add each meta key as non-enumerable property prefixed with $
  for (var _i = 0, _Object$entries = Object.entries(meta); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
      key = _Object$entries$_i[0],
      value = _Object$entries$_i[1];
    Object.defineProperty(data, "$".concat(key), {
      value: value,
      enumerable: false,
      writable: false,
      configurable: true
    });
  }
  return data;
}

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/turbo/browser-adapter.js"
/*!***********************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/turbo/browser-adapter.js ***!
  \***********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BrowserAdapter: () => (/* binding */ BrowserAdapter)
/* harmony export */ });
/* harmony import */ var _util_http_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/http-request */ "./vendor/larajax/larajax/resources/src/util/http-request.js");
/* harmony import */ var _extras_progress_bar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../extras/progress-bar */ "./vendor/larajax/larajax/resources/src/extras/progress-bar.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util */ "./vendor/larajax/larajax/resources/src/util/index.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



var BrowserAdapter = /*#__PURE__*/function () {
  function BrowserAdapter(controller) {
    var _this = this;
    _classCallCheck(this, BrowserAdapter);
    this.progressBar = new _extras_progress_bar__WEBPACK_IMPORTED_MODULE_1__.ProgressBar();
    this.showProgressBar = function () {
      _this.progressBar.show({
        cssClass: 'is-turbo'
      });
    };
    this.controller = controller;
  }
  return _createClass(BrowserAdapter, [{
    key: "visitProposedToLocationWithAction",
    value: function visitProposedToLocationWithAction(location, action) {
      var restorationIdentifier = (0,_util__WEBPACK_IMPORTED_MODULE_2__.uuid)();
      this.controller.startVisitToLocationWithAction(location, action, restorationIdentifier);
    }
  }, {
    key: "visitStarted",
    value: function visitStarted(visit) {
      visit.issueRequest();
      visit.changeHistory();
      visit.goToSamePageAnchor();
      visit.loadCachedSnapshot();
    }
  }, {
    key: "visitRequestStarted",
    value: function visitRequestStarted(visit) {
      this.progressBar.setValue(0);
      if (visit.hasCachedSnapshot() || visit.action != 'restore') {
        this.showProgressBarAfterDelay();
      } else {
        this.showProgressBar();
      }
    }
  }, {
    key: "visitRequestProgressed",
    value: function visitRequestProgressed(visit) {
      this.progressBar.setValue(visit.progress);
    }
  }, {
    key: "visitRequestCompleted",
    value: function visitRequestCompleted(visit) {
      visit.loadResponse();
    }
  }, {
    key: "visitRequestFailedWithStatusCode",
    value: function visitRequestFailedWithStatusCode(visit, statusCode) {
      switch (statusCode) {
        case _util_http_request__WEBPACK_IMPORTED_MODULE_0__.SystemStatusCode.networkFailure:
        case _util_http_request__WEBPACK_IMPORTED_MODULE_0__.SystemStatusCode.timeoutFailure:
        case _util_http_request__WEBPACK_IMPORTED_MODULE_0__.SystemStatusCode.contentTypeMismatch:
        case _util_http_request__WEBPACK_IMPORTED_MODULE_0__.SystemStatusCode.userAborted:
          return this.reload();
        default:
          return visit.loadResponse();
      }
    }
  }, {
    key: "visitRequestFinished",
    value: function visitRequestFinished(visit) {
      this.hideProgressBar();
    }
  }, {
    key: "visitCompleted",
    value: function visitCompleted(visit) {
      visit.followRedirect();
    }
  }, {
    key: "pageInvalidated",
    value: function pageInvalidated() {
      this.reload();
    }
  }, {
    key: "visitFailed",
    value: function visitFailed(visit) {}
  }, {
    key: "visitRendered",
    value: function visitRendered(visit) {}

    // Private
  }, {
    key: "showProgressBarAfterDelay",
    value: function showProgressBarAfterDelay() {
      if (this.controller.progressBarVisible) {
        this.progressBarTimeout = window.setTimeout(this.showProgressBar, this.controller.progressBarDelay);
      }
    }
  }, {
    key: "hideProgressBar",
    value: function hideProgressBar() {
      if (this.controller.progressBarVisible) {
        this.progressBar.hide();
        if (this.progressBarTimeout !== null) {
          window.clearTimeout(this.progressBarTimeout);
          delete this.progressBarTimeout;
        }
      }
    }
  }, {
    key: "reload",
    value: function reload() {
      window.location.reload();
    }
  }]);
}();

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/turbo/controller.js"
/*!******************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/turbo/controller.js ***!
  \******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Controller: () => (/* binding */ Controller)
/* harmony export */ });
/* harmony import */ var _browser_adapter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./browser-adapter */ "./vendor/larajax/larajax/resources/src/turbo/browser-adapter.js");
/* harmony import */ var _history__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./history */ "./vendor/larajax/larajax/resources/src/turbo/history.js");
/* harmony import */ var _location__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./location */ "./vendor/larajax/larajax/resources/src/turbo/location.js");
/* harmony import */ var _scroll_manager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./scroll-manager */ "./vendor/larajax/larajax/resources/src/turbo/scroll-manager.js");
/* harmony import */ var _snapshot_cache__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./snapshot-cache */ "./vendor/larajax/larajax/resources/src/turbo/snapshot-cache.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../util */ "./vendor/larajax/larajax/resources/src/util/index.js");
/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./view */ "./vendor/larajax/larajax/resources/src/turbo/view.js");
/* harmony import */ var _visit__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./visit */ "./vendor/larajax/larajax/resources/src/turbo/visit.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }








var Controller = /*#__PURE__*/function () {
  function Controller() {
    var _this = this;
    _classCallCheck(this, Controller);
    this.adapter = new _browser_adapter__WEBPACK_IMPORTED_MODULE_0__.BrowserAdapter(this);
    this.history = new _history__WEBPACK_IMPORTED_MODULE_1__.History(this);
    this.restorationData = {};
    this.restorationDataKeys = [];
    this.restorationDataLimit = 20;
    this.scrollManager = new _scroll_manager__WEBPACK_IMPORTED_MODULE_3__.ScrollManager(this);
    this.useScroll = true;
    this.view = new _view__WEBPACK_IMPORTED_MODULE_6__.View(this);
    this.cache = new _snapshot_cache__WEBPACK_IMPORTED_MODULE_4__.SnapshotCache(10);
    this.enabled = true;
    this.pendingAssets = 0;
    this.progressBarDelay = 500;
    this.progressBarVisible = true;
    this.started = false;
    this.uniqueInlineScripts = new Set();
    this.uniqueInlineScriptsLimit = 100;
    this.currentVisit = null;
    this.historyVisit = null;
    this.pageIsReady = false;

    // Event handlers
    this.pageLoaded = function () {
      _this.pageIsReady = true;
      _this.lastRenderedLocation = _this.location;
      _this.notifyApplicationAfterPageLoad();
      _this.notifyApplicationAfterPageAndScriptsLoad();
      _this.observeInlineScripts();
    };
    this.clickCaptured = function () {
      removeEventListener('click', _this.clickBubbled, false);
      addEventListener('click', _this.clickBubbled, false);
    };
    this.clickBubbled = function (event) {
      if (_this.enabled && _this.clickEventIsSignificant(event)) {
        var link = _this.getVisitableLinkForTarget(event.target);
        if (link) {
          var location = _this.getVisitableLocationForLink(link);
          if (location && _this.applicationAllowsFollowingLinkToLocation(link, location)) {
            event.preventDefault();
            var action = _this.getActionForLink(link);
            var scroll = _this.useScrollForLink(link);
            _this.visit(location, {
              action: action,
              scroll: scroll
            });
          }
        }
      }
    };
  }
  return _createClass(Controller, [{
    key: "start",
    value: function start() {
      if (Controller.supported && !this.started) {
        addEventListener('click', this.clickCaptured, true);
        addEventListener('DOMContentLoaded', this.pageLoaded, false);
        this.startHistory();
        this.scrollManager.start();
        this.started = true;
        this.enabled = this.documentIsEnabled();
      }
    }
  }, {
    key: "disable",
    value: function disable() {
      this.enabled = false;
    }
  }, {
    key: "stop",
    value: function stop() {
      if (this.started) {
        removeEventListener('click', this.clickCaptured, true);
        removeEventListener('DOMContentLoaded', this.pageLoaded, false);
        this.scrollManager.stop();
        this.stopHistory();
        this.started = false;
      }
    }
  }, {
    key: "isEnabled",
    value: function isEnabled() {
      return this.started && this.enabled;
    }
  }, {
    key: "pageReady",
    value: function pageReady() {
      var _this2 = this;
      return new Promise(function (resolve) {
        if (!_this2.pageIsReady) {
          addEventListener('render', function () {
            return resolve();
          }, {
            once: true
          });
        } else {
          resolve();
        }
      });
    }
  }, {
    key: "clearCache",
    value: function clearCache() {
      this.cache = new _snapshot_cache__WEBPACK_IMPORTED_MODULE_4__.SnapshotCache(10);
    }
  }, {
    key: "visit",
    value: function visit(location) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      location = _location__WEBPACK_IMPORTED_MODULE_2__.Location.wrap(location);
      var action = options.action || 'advance';
      if (this.applicationAllowsVisitingLocation(location, action)) {
        if (this.locationIsVisitable(location)) {
          this.useScroll = options.scroll !== false;
          this.adapter.visitProposedToLocationWithAction(location, action);
        } else {
          window.location.href = location.toString();
        }
      }
    }
  }, {
    key: "startVisitToLocationWithAction",
    value: function startVisitToLocationWithAction(location, action, restorationIdentifier) {
      if (Controller.supported) {
        var restorationData = this.getRestorationDataForIdentifier(restorationIdentifier);
        this.startVisit(_location__WEBPACK_IMPORTED_MODULE_2__.Location.wrap(location), action, {
          restorationData: restorationData
        });
      } else {
        window.location.href = location.toString();
      }
    }
  }, {
    key: "setProgressBarVisible",
    value: function setProgressBarVisible(value) {
      this.progressBarVisible = value;
    }
  }, {
    key: "setProgressBarDelay",
    value: function setProgressBarDelay(delay) {
      this.progressBarDelay = delay;
    }

    // History
  }, {
    key: "startHistory",
    value: function startHistory() {
      this.location = _location__WEBPACK_IMPORTED_MODULE_2__.Location.currentLocation;
      this.restorationIdentifier = (0,_util__WEBPACK_IMPORTED_MODULE_5__.uuid)();
      this.history.start();
      this.history.replace(this.location, this.restorationIdentifier);
    }
  }, {
    key: "stopHistory",
    value: function stopHistory() {
      this.history.stop();
    }
  }, {
    key: "getLastVisitUrl",
    value: function getLastVisitUrl() {
      if (this.historyVisit) {
        return this.historyVisit.referrer.absoluteURL;
      }
    }
  }, {
    key: "pushHistoryWithLocationAndRestorationIdentifier",
    value: function pushHistoryWithLocationAndRestorationIdentifier(locatable, restorationIdentifier) {
      this.historyVisit = this.currentVisit;
      this.location = _location__WEBPACK_IMPORTED_MODULE_2__.Location.wrap(locatable);
      this.restorationIdentifier = restorationIdentifier;
      this.history.push(this.location, this.restorationIdentifier);
    }
  }, {
    key: "replaceHistoryWithLocationAndRestorationIdentifier",
    value: function replaceHistoryWithLocationAndRestorationIdentifier(locatable, restorationIdentifier) {
      this.location = _location__WEBPACK_IMPORTED_MODULE_2__.Location.wrap(locatable);
      this.restorationIdentifier = restorationIdentifier;
      this.history.replace(this.location, this.restorationIdentifier);
    }

    // History delegate
  }, {
    key: "historyPoppedToLocationWithRestorationIdentifier",
    value: function historyPoppedToLocationWithRestorationIdentifier(location, restorationIdentifier) {
      if (this.enabled) {
        this.location = location;
        this.restorationIdentifier = restorationIdentifier;
        var restorationData = this.getRestorationDataForIdentifier(restorationIdentifier);
        this.startVisit(location, 'restore', {
          restorationIdentifier: restorationIdentifier,
          restorationData: restorationData,
          historyChanged: true
        });
      } else {
        this.adapter.pageInvalidated();
      }
    }

    // Snapshot cache
  }, {
    key: "getCachedSnapshotForLocation",
    value: function getCachedSnapshotForLocation(location) {
      var snapshot = this.cache.get(location);
      return snapshot ? snapshot.clone() : snapshot;
    }
  }, {
    key: "shouldCacheSnapshot",
    value: function shouldCacheSnapshot() {
      return this.view.getSnapshot().isCacheable();
    }
  }, {
    key: "cacheSnapshot",
    value: function cacheSnapshot() {
      var _this3 = this;
      if (this.shouldCacheSnapshot()) {
        this.notifyApplicationBeforeCachingSnapshot();
        var snapshot = this.view.getSnapshot();
        var location = this.lastRenderedLocation || _location__WEBPACK_IMPORTED_MODULE_2__.Location.currentLocation;
        (0,_util__WEBPACK_IMPORTED_MODULE_5__.defer)(function () {
          return _this3.cache.put(location, snapshot.clone());
        });
      }
    }

    // Scrolling
  }, {
    key: "scrollToAnchor",
    value: function scrollToAnchor(anchor) {
      var element = this.view.getElementForAnchor(anchor);
      if (element) {
        this.scrollToElement(element);
      } else {
        this.scrollToPosition({
          x: 0,
          y: 0
        });
      }
    }
  }, {
    key: "scrollToElement",
    value: function scrollToElement(element) {
      this.scrollManager.scrollToElement(element);
    }
  }, {
    key: "scrollToPosition",
    value: function scrollToPosition(position) {
      this.scrollManager.scrollToPosition(position);
    }

    // Scroll manager delegate
  }, {
    key: "scrollPositionChanged",
    value: function scrollPositionChanged(position) {
      var restorationData = this.getCurrentRestorationData();
      restorationData.scrollPosition = position;
    }

    // Pending asset management
  }, {
    key: "incrementPendingAsset",
    value: function incrementPendingAsset() {
      this.pendingAssets++;
    }
  }, {
    key: "decrementPendingAsset",
    value: function decrementPendingAsset() {
      this.pendingAssets--;
      if (this.pendingAssets === 0) {
        this.pageIsReady = true;
        this.notifyApplicationAfterPageAndScriptsLoad();
        this.notifyApplicationAfterLoadScripts();
      }
    }

    // View
  }, {
    key: "render",
    value: function render(options, callback) {
      this.view.render(options, callback);
    }
  }, {
    key: "viewInvalidated",
    value: function viewInvalidated() {
      this.adapter.pageInvalidated();
    }
  }, {
    key: "viewAllowsImmediateRender",
    value: function viewAllowsImmediateRender(newBody, options) {
      this.pageIsReady = false;
      this.notifyApplicationUnload();
      var event = this.notifyApplicationBeforeRender(newBody, options);
      return !event.defaultPrevented;
    }
  }, {
    key: "viewRendered",
    value: function viewRendered() {
      this.lastRenderedLocation = this.currentVisit.location;
      this.notifyApplicationAfterRender();
    }

    // Inline script monitoring
  }, {
    key: "observeInlineScripts",
    value: function observeInlineScripts() {
      var _this4 = this;
      document.documentElement.querySelectorAll('script[data-turbo-eval-once]').forEach(function (el) {
        return _this4.applicationHasSeenInlineScript(el);
      });
    }
  }, {
    key: "applicationHasSeenInlineScript",
    value: function applicationHasSeenInlineScript(element) {
      var uid = element.getAttribute('data-turbo-eval-once');
      if (!uid) {
        return false;
      }
      var hasSeen = this.uniqueInlineScripts.has(uid);
      if (!hasSeen) {
        // Trim if at limit (remove oldest entries)
        if (this.uniqueInlineScripts.size >= this.uniqueInlineScriptsLimit) {
          var iterator = this.uniqueInlineScripts.values();
          this.uniqueInlineScripts["delete"](iterator.next().value);
        }
        this.uniqueInlineScripts.add(uid);
      }
      return hasSeen;
    }

    // Application events
  }, {
    key: "applicationAllowsFollowingLinkToLocation",
    value: function applicationAllowsFollowingLinkToLocation(link, location) {
      var event = this.notifyApplicationAfterClickingLinkToLocation(link, location);
      return !event.defaultPrevented;
    }
  }, {
    key: "applicationAllowsVisitingLocation",
    value: function applicationAllowsVisitingLocation(location, action) {
      var event = this.notifyApplicationBeforeVisitingLocation(location, action);
      return !event.defaultPrevented;
    }
  }, {
    key: "notifyApplicationAfterClickingLinkToLocation",
    value: function notifyApplicationAfterClickingLinkToLocation(link, location) {
      return (0,_util__WEBPACK_IMPORTED_MODULE_5__.dispatch)('page:click', {
        target: link,
        detail: {
          url: location.absoluteURL
        }
      });
    }
  }, {
    key: "notifyApplicationBeforeVisitingLocation",
    value: function notifyApplicationBeforeVisitingLocation(location, action) {
      return (0,_util__WEBPACK_IMPORTED_MODULE_5__.dispatch)('page:before-visit', {
        detail: {
          url: location.absoluteURL,
          action: action
        }
      });
    }
  }, {
    key: "notifyApplicationAfterVisitingLocation",
    value: function notifyApplicationAfterVisitingLocation(location) {
      return (0,_util__WEBPACK_IMPORTED_MODULE_5__.dispatch)('page:visit', {
        detail: {
          url: location.absoluteURL
        },
        cancelable: false
      });
    }
  }, {
    key: "notifyApplicationBeforeCachingSnapshot",
    value: function notifyApplicationBeforeCachingSnapshot() {
      return (0,_util__WEBPACK_IMPORTED_MODULE_5__.dispatch)('page:before-cache', {
        cancelable: false
      });
    }
  }, {
    key: "notifyApplicationBeforeRender",
    value: function notifyApplicationBeforeRender(newBody, options) {
      return (0,_util__WEBPACK_IMPORTED_MODULE_5__.dispatch)('page:before-render', {
        detail: _objectSpread({
          newBody: newBody
        }, options)
      });
    }
  }, {
    key: "notifyApplicationAfterRender",
    value: function notifyApplicationAfterRender() {
      return (0,_util__WEBPACK_IMPORTED_MODULE_5__.dispatch)('page:render', {
        cancelable: false
      });
    }
  }, {
    key: "notifyApplicationAfterPageLoad",
    value: function notifyApplicationAfterPageLoad() {
      var timing = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return (0,_util__WEBPACK_IMPORTED_MODULE_5__.dispatch)('page:load', {
        detail: {
          url: this.location.absoluteURL,
          timing: timing
        },
        cancelable: false
      });
    }
  }, {
    key: "notifyApplicationAfterPageAndScriptsLoad",
    value: function notifyApplicationAfterPageAndScriptsLoad() {
      return (0,_util__WEBPACK_IMPORTED_MODULE_5__.dispatch)('page:loaded', {
        cancelable: false
      });
    }
  }, {
    key: "notifyApplicationAfterLoadScripts",
    value: function notifyApplicationAfterLoadScripts() {
      return (0,_util__WEBPACK_IMPORTED_MODULE_5__.dispatch)('page:updated', {
        cancelable: false
      });
    }
  }, {
    key: "notifyApplicationUnload",
    value: function notifyApplicationUnload() {
      return (0,_util__WEBPACK_IMPORTED_MODULE_5__.dispatch)('page:unload', {
        cancelable: false
      });
    }

    // Private
  }, {
    key: "startVisit",
    value: function startVisit(location, action, properties) {
      if (this.currentVisit) {
        this.currentVisit.cancel();
      }
      this.currentVisit = this.createVisit(location, action, properties);
      this.currentVisit.scrolled = !this.useScroll;
      this.currentVisit.start();
      this.notifyApplicationAfterVisitingLocation(location);
    }
  }, {
    key: "createVisit",
    value: function createVisit(location, action, properties) {
      var visit = new _visit__WEBPACK_IMPORTED_MODULE_7__.Visit(this, location, action, properties.restorationIdentifier);
      visit.restorationData = Object.assign({}, properties.restorationData || {});
      visit.historyChanged = !!properties.historyChanged;
      visit.referrer = this.location;
      return visit;
    }
  }, {
    key: "visitCompleted",
    value: function visitCompleted(visit) {
      this.notifyApplicationAfterPageLoad(visit.getTimingMetrics());
      if (this.pendingAssets === 0) {
        this.pageIsReady = true;
        this.notifyApplicationAfterPageAndScriptsLoad();
        this.notifyApplicationAfterLoadScripts();
      }
    }
  }, {
    key: "clickEventIsSignificant",
    value: function clickEventIsSignificant(event) {
      return !(event.target && event.target.isContentEditable || event.defaultPrevented || event.which > 1 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey);
    }
  }, {
    key: "getVisitableLinkForTarget",
    value: function getVisitableLinkForTarget(target) {
      if (target instanceof Element && this.elementIsVisitable(target)) {
        var container = target.closest('a[href]:not([download])');
        if (container && container.getAttribute('target') && container.getAttribute('target') != '_self') {
          return null;
        }
        return container;
      }
    }
  }, {
    key: "getVisitableLocationForLink",
    value: function getVisitableLocationForLink(link) {
      var location = new _location__WEBPACK_IMPORTED_MODULE_2__.Location(link.getAttribute('href') || '');
      if (this.locationIsVisitable(location)) {
        return location;
      }
    }
  }, {
    key: "getActionForLink",
    value: function getActionForLink(link) {
      var action = link.getAttribute('data-turbo-action');
      return this.isAction(action) ? action : 'advance';
    }
  }, {
    key: "useScrollForLink",
    value: function useScrollForLink(link) {
      return link.getAttribute('data-turbo-no-scroll') === null;
    }
  }, {
    key: "isAction",
    value: function isAction(action) {
      return action == 'advance' || action == 'replace' || action == 'restore' || action == 'swap';
    }
  }, {
    key: "documentIsEnabled",
    value: function documentIsEnabled() {
      var meta = document.documentElement.querySelector('head meta[name="turbo-visit-control"]');
      if (meta) {
        var value = meta.getAttribute('content');
        return value == 'enable' || value == 'reload';
      }
      return false;
    }
  }, {
    key: "elementIsVisitable",
    value: function elementIsVisitable(element) {
      var container = element.closest('[data-turbo]');
      if (container) {
        return container.getAttribute('data-turbo') != 'false';
      } else {
        return true;
      }
    }
  }, {
    key: "locationIsVisitable",
    value: function locationIsVisitable(location) {
      return location.isPrefixedBy(this.view.getRootLocation()) && location.isHTML();
    }
  }, {
    key: "locationIsSamePageAnchor",
    value: function locationIsSamePageAnchor(location) {
      return typeof location.anchor != 'undefined' && location.requestURL == this.location.requestURL;
    }
  }, {
    key: "getCurrentRestorationData",
    value: function getCurrentRestorationData() {
      return this.getRestorationDataForIdentifier(this.restorationIdentifier);
    }
  }, {
    key: "getRestorationDataForIdentifier",
    value: function getRestorationDataForIdentifier(identifier) {
      if (!(identifier in this.restorationData)) {
        this.restorationData[identifier] = {};
        this.restorationDataKeys.push(identifier);
        this.trimRestorationData();
      }
      return this.restorationData[identifier];
    }
  }, {
    key: "trimRestorationData",
    value: function trimRestorationData() {
      while (this.restorationDataKeys.length > this.restorationDataLimit) {
        var oldestKey = this.restorationDataKeys.shift();
        delete this.restorationData[oldestKey];
      }
    }
  }]);
}();
Controller.supported = !!(window.history.pushState && window.requestAnimationFrame && window.addEventListener);

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/turbo/error-renderer.js"
/*!**********************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/turbo/error-renderer.js ***!
  \**********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ErrorRenderer: () => (/* binding */ ErrorRenderer)
/* harmony export */ });
/* harmony import */ var _renderer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./renderer */ "./vendor/larajax/larajax/resources/src/turbo/renderer.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util */ "./vendor/larajax/larajax/resources/src/util/index.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }


var ErrorRenderer = /*#__PURE__*/function (_Renderer) {
  function ErrorRenderer(delegate, html) {
    var _this;
    _classCallCheck(this, ErrorRenderer);
    _this = _callSuper(this, ErrorRenderer);
    _this.delegate = delegate;
    _this.htmlElement = function () {
      var htmlElement = document.createElement('html');
      htmlElement.innerHTML = html;
      return htmlElement;
    }();
    _this.newHead = _this.htmlElement.querySelector('head') || document.createElement('head');
    _this.newBody = _this.htmlElement.querySelector('body') || document.createElement('body');
    return _this;
  }
  _inherits(ErrorRenderer, _Renderer);
  return _createClass(ErrorRenderer, [{
    key: "render",
    value: function render(callback) {
      var _this2 = this;
      this.renderView(function () {
        _this2.replaceHeadAndBody();
        _this2.activateBodyScriptElements();
        callback();
      });
    }
  }, {
    key: "replaceHeadAndBody",
    value: function replaceHeadAndBody() {
      var _document = document,
        documentElement = _document.documentElement,
        head = _document.head,
        body = _document.body;
      documentElement.replaceChild(this.newHead, head);
      documentElement.replaceChild(this.newBody, body);
    }
  }, {
    key: "activateBodyScriptElements",
    value: function activateBodyScriptElements() {
      var _iterator = _createForOfIteratorHelper(this.getScriptElements()),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var replaceableElement = _step.value;
          var parentNode = replaceableElement.parentNode;
          if (parentNode) {
            var element = this.createScriptElement(replaceableElement);
            parentNode.replaceChild(element, replaceableElement);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "getScriptElements",
    value: function getScriptElements() {
      return (0,_util__WEBPACK_IMPORTED_MODULE_1__.array)(document.documentElement.querySelectorAll('script'));
    }
  }], [{
    key: "render",
    value: function render(delegate, callback, html) {
      return new this(delegate, html).render(callback);
    }
  }]);
}(_renderer__WEBPACK_IMPORTED_MODULE_0__.Renderer);

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/turbo/head-details.js"
/*!********************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/turbo/head-details.js ***!
  \********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HeadDetails: () => (/* binding */ HeadDetails)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util */ "./vendor/larajax/larajax/resources/src/util/index.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var HeadDetails = /*#__PURE__*/function () {
  function HeadDetails(children) {
    _classCallCheck(this, HeadDetails);
    this.detailsByOuterHTML = children.reduce(function (result, element) {
      var outerHTML = element.outerHTML;
      var details = outerHTML in result ? result[outerHTML] : {
        type: elementType(element),
        tracked: elementIsTracked(element),
        elements: []
      };
      return Object.assign(Object.assign({}, result), _defineProperty({}, outerHTML, Object.assign(Object.assign({}, details), {
        elements: [].concat(_toConsumableArray(details.elements), [element])
      })));
    }, {});
  }
  return _createClass(HeadDetails, [{
    key: "getTrackedElementSignature",
    value: function getTrackedElementSignature() {
      var _this = this;
      return Object.keys(this.detailsByOuterHTML).filter(function (outerHTML) {
        return _this.detailsByOuterHTML[outerHTML].tracked;
      }).join("");
    }
  }, {
    key: "getScriptElementsNotInDetails",
    value: function getScriptElementsNotInDetails(headDetails) {
      return this.getElementsMatchingTypeNotInDetails('script', headDetails);
    }
  }, {
    key: "getStylesheetElementsNotInDetails",
    value: function getStylesheetElementsNotInDetails(headDetails) {
      return this.getElementsMatchingTypeNotInDetails('stylesheet', headDetails);
    }
  }, {
    key: "getElementsMatchingTypeNotInDetails",
    value: function getElementsMatchingTypeNotInDetails(matchedType, headDetails) {
      var _this2 = this;
      return Object.keys(this.detailsByOuterHTML).filter(function (outerHTML) {
        return !(outerHTML in headDetails.detailsByOuterHTML);
      }).map(function (outerHTML) {
        return _this2.detailsByOuterHTML[outerHTML];
      }).filter(function (_ref) {
        var type = _ref.type;
        return type == matchedType;
      }).map(function (_ref2) {
        var _ref2$elements = _slicedToArray(_ref2.elements, 1),
          element = _ref2$elements[0];
        return element;
      });
    }
  }, {
    key: "getProvisionalElements",
    value: function getProvisionalElements() {
      var _this3 = this;
      return Object.keys(this.detailsByOuterHTML).reduce(function (result, outerHTML) {
        var _this3$detailsByOuter = _this3.detailsByOuterHTML[outerHTML],
          type = _this3$detailsByOuter.type,
          tracked = _this3$detailsByOuter.tracked,
          elements = _this3$detailsByOuter.elements;
        if (type == null && !tracked) {
          return [].concat(_toConsumableArray(result), _toConsumableArray(elements));
        } else if (elements.length > 1) {
          return [].concat(_toConsumableArray(result), _toConsumableArray(elements.slice(1)));
        } else {
          return result;
        }
      }, []);
    }
  }, {
    key: "getMetaValue",
    value: function getMetaValue(name) {
      var element = this.findMetaElementByName(name);
      return element ? element.getAttribute('content') : null;
    }
  }, {
    key: "findMetaElementByName",
    value: function findMetaElementByName(name) {
      var _this4 = this;
      return Object.keys(this.detailsByOuterHTML).reduce(function (result, outerHTML) {
        var _this4$detailsByOuter = _slicedToArray(_this4.detailsByOuterHTML[outerHTML].elements, 1),
          element = _this4$detailsByOuter[0];
        return elementIsMetaElementWithName(element, name) ? element : result;
      }, undefined);
    }
  }], [{
    key: "fromHeadElement",
    value: function fromHeadElement(headElement) {
      var children = headElement ? (0,_util__WEBPACK_IMPORTED_MODULE_0__.array)(headElement.children) : [];
      return new this(children);
    }
  }]);
}();
function elementType(element) {
  if (elementIsScript(element)) {
    return 'script';
  } else if (elementIsStylesheet(element)) {
    return 'stylesheet';
  }
}
function elementIsTracked(element) {
  return element.getAttribute('data-turbo-track') == 'reload';
}
function elementIsScript(element) {
  var tagName = element.tagName.toLowerCase();
  return tagName == 'script';
}
function elementIsStylesheet(element) {
  var tagName = element.tagName.toLowerCase();
  return tagName == 'style' || tagName == 'link' && element.getAttribute('rel') == 'stylesheet';
}
function elementIsMetaElementWithName(element, name) {
  var tagName = element.tagName.toLowerCase();
  return tagName == 'meta' && element.getAttribute('name') == name;
}

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/turbo/history.js"
/*!***************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/turbo/history.js ***!
  \***************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   History: () => (/* binding */ History)
/* harmony export */ });
/* harmony import */ var _location__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./location */ "./vendor/larajax/larajax/resources/src/turbo/location.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util */ "./vendor/larajax/larajax/resources/src/util/index.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


var History = /*#__PURE__*/function () {
  function History(delegate) {
    var _this = this;
    _classCallCheck(this, History);
    this.started = false;
    this.pageLoaded = false;

    // Event handlers
    this.onPopState = function (event) {
      if (!_this.shouldHandlePopState()) {
        return;
      }
      if (!event.state || !event.state.ajaxTurbo) {
        return;
      }
      var ajaxTurbo = event.state.ajaxTurbo;
      var location = _location__WEBPACK_IMPORTED_MODULE_0__.Location.currentLocation;
      var restorationIdentifier = ajaxTurbo.restorationIdentifier;
      _this.delegate.historyPoppedToLocationWithRestorationIdentifier(location, restorationIdentifier);
    };
    this.onPageLoad = function (event) {
      (0,_util__WEBPACK_IMPORTED_MODULE_1__.defer)(function () {
        _this.pageLoaded = true;
      });
    };
    this.delegate = delegate;
  }
  return _createClass(History, [{
    key: "start",
    value: function start() {
      if (!this.started) {
        addEventListener('popstate', this.onPopState, false);
        addEventListener('load', this.onPageLoad, false);
        this.started = true;
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      if (this.started) {
        removeEventListener('popstate', this.onPopState, false);
        removeEventListener('load', this.onPageLoad, false);
        this.started = false;
      }
    }
  }, {
    key: "push",
    value: function push(location, restorationIdentifier) {
      this.update(history.pushState, location, restorationIdentifier);
    }
  }, {
    key: "replace",
    value: function replace(location, restorationIdentifier) {
      this.update(history.replaceState, location, restorationIdentifier);
    }

    // Private
  }, {
    key: "shouldHandlePopState",
    value: function shouldHandlePopState() {
      // Safari dispatches a popstate event after window's load event, ignore it
      return this.pageIsLoaded();
    }
  }, {
    key: "pageIsLoaded",
    value: function pageIsLoaded() {
      return this.pageLoaded || document.readyState == 'complete';
    }
  }, {
    key: "update",
    value: function update(method, location, restorationIdentifier) {
      var state = {
        ajaxTurbo: {
          restorationIdentifier: restorationIdentifier
        }
      };
      method.call(history, state, '', location.absoluteURL);
    }
  }]);
}();

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/turbo/location.js"
/*!****************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/turbo/location.js ***!
  \****************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Location: () => (/* binding */ Location)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Location = /*#__PURE__*/function () {
  function Location(url) {
    _classCallCheck(this, Location);
    var linkWithAnchor = document.createElement('a');
    linkWithAnchor.href = url;
    this.absoluteURL = linkWithAnchor.href;
    var anchorLength = linkWithAnchor.hash.length;
    if (anchorLength < 2) {
      this.requestURL = this.absoluteURL;
    } else {
      this.requestURL = this.absoluteURL.slice(0, -anchorLength);
      this.anchor = linkWithAnchor.hash.slice(1);
    }
  }
  return _createClass(Location, [{
    key: "getOrigin",
    value: function getOrigin() {
      return this.absoluteURL.split("/", 3).join("/");
    }
  }, {
    key: "getPath",
    value: function getPath() {
      return (this.requestURL.match(/\/\/[^/]*(\/[^?;]*)/) || [])[1] || "/";
    }
  }, {
    key: "getPathComponents",
    value: function getPathComponents() {
      return this.getPath().split("/").slice(1);
    }
  }, {
    key: "getLastPathComponent",
    value: function getLastPathComponent() {
      return this.getPathComponents().slice(-1)[0];
    }
  }, {
    key: "getExtension",
    value: function getExtension() {
      return (this.getLastPathComponent().match(/\.[^.]*$/) || [])[0] || "";
    }
  }, {
    key: "isHTML",
    value: function isHTML() {
      return this.getExtension().match(/^(?:|\.(?:htm|html|xhtml))$/);
    }
  }, {
    key: "isPrefixedBy",
    value: function isPrefixedBy(location) {
      var prefixURL = getPrefixURL(location);
      return this.isEqualTo(location) || stringStartsWith(this.absoluteURL, prefixURL);
    }
  }, {
    key: "isEqualTo",
    value: function isEqualTo(location) {
      return location && this.absoluteURL === location.absoluteURL;
    }
  }, {
    key: "toCacheKey",
    value: function toCacheKey() {
      return this.requestURL;
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return this.absoluteURL;
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.absoluteURL;
    }
  }, {
    key: "valueOf",
    value: function valueOf() {
      return this.absoluteURL;
    }
  }], [{
    key: "currentLocation",
    get: function get() {
      return this.wrap(window.location.toString());
    }
  }, {
    key: "wrap",
    value: function wrap(locatable) {
      if (typeof locatable == 'string') {
        return new Location(locatable);
      } else if (locatable != null) {
        return locatable;
      }
    }
  }]);
}();
function getPrefixURL(location) {
  return addTrailingSlash(location.getOrigin() + location.getPath());
}
function addTrailingSlash(url) {
  return stringEndsWith(url, "/") ? url : url + "/";
}
function stringStartsWith(string, prefix) {
  return string.slice(0, prefix.length) === prefix;
}
function stringEndsWith(string, suffix) {
  return string.slice(-suffix.length) === suffix;
}

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/turbo/namespace.js"
/*!*****************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/turbo/namespace.js ***!
  \*****************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _controller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./controller */ "./vendor/larajax/larajax/resources/src/turbo/controller.js");

var controller = new _controller__WEBPACK_IMPORTED_MODULE_0__.Controller();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  get supported() {
    return _controller__WEBPACK_IMPORTED_MODULE_0__.Controller.supported;
  },
  controller: controller,
  visit: function visit(location, options) {
    controller.visit(location, options);
  },
  clearCache: function clearCache() {
    controller.clearCache();
  },
  setProgressBarVisible: function setProgressBarVisible(value) {
    controller.setProgressBarVisible(value);
  },
  setProgressBarDelay: function setProgressBarDelay(delay) {
    controller.setProgressBarDelay(delay);
  },
  start: function start() {
    controller.start();
  },
  isEnabled: function isEnabled() {
    return controller.isEnabled();
  },
  pageReady: function pageReady() {
    return controller.pageReady();
  }
});

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/turbo/renderer.js"
/*!****************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/turbo/renderer.js ***!
  \****************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Renderer: () => (/* binding */ Renderer)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util */ "./vendor/larajax/larajax/resources/src/util/index.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var Renderer = /*#__PURE__*/function () {
  function Renderer() {
    _classCallCheck(this, Renderer);
  }
  return _createClass(Renderer, [{
    key: "renderView",
    value: function renderView(callback) {
      var _this = this;
      var renderInterception = function renderInterception() {
        callback();
        _this.delegate.viewRendered(_this.newBody);
      };
      var options = {
        resume: renderInterception
      };
      var immediateRender = this.delegate.viewAllowsImmediateRender(this.newBody, options);
      if (immediateRender) {
        renderInterception();
      }
    }
  }, {
    key: "invalidateView",
    value: function invalidateView() {
      this.delegate.viewInvalidated();
    }
  }, {
    key: "createScriptElement",
    value: function createScriptElement(element) {
      if (element.getAttribute('data-turbo-eval') === 'false' || this.delegate.applicationHasSeenInlineScript(element)) {
        return element;
      }
      var createdScriptElement = document.createElement('script');
      createdScriptElement.textContent = element.textContent;
      createdScriptElement.async = false;
      copyElementAttributes(createdScriptElement, element);
      return createdScriptElement;
    }
  }]);
}();
function copyElementAttributes(destinationElement, sourceElement) {
  var _iterator = _createForOfIteratorHelper((0,_util__WEBPACK_IMPORTED_MODULE_0__.array)(sourceElement.attributes)),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _step.value,
        name = _step$value.name,
        value = _step$value.value;
      destinationElement.setAttribute(name, value);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/turbo/scroll-manager.js"
/*!**********************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/turbo/scroll-manager.js ***!
  \**********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ScrollManager: () => (/* binding */ ScrollManager)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var ScrollManager = /*#__PURE__*/function () {
  function ScrollManager(delegate) {
    var _this = this;
    _classCallCheck(this, ScrollManager);
    this.started = false;
    this.onScroll = function () {
      _this.updatePosition({
        x: window.pageXOffset,
        y: window.pageYOffset
      });
    };
    this.delegate = delegate;
  }
  return _createClass(ScrollManager, [{
    key: "start",
    value: function start() {
      if (!this.started) {
        addEventListener('scroll', this.onScroll, false);
        this.onScroll();
        this.started = true;
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      if (this.started) {
        removeEventListener('scroll', this.onScroll, false);
        this.started = false;
      }
    }
  }, {
    key: "scrollToElement",
    value: function scrollToElement(element) {
      element.scrollIntoView();
    }
  }, {
    key: "scrollToPosition",
    value: function scrollToPosition(_ref) {
      var x = _ref.x,
        y = _ref.y;
      window.scrollTo(x, y);
    }

    // Private
  }, {
    key: "updatePosition",
    value: function updatePosition(position) {
      this.delegate.scrollPositionChanged(position);
    }
  }]);
}();

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/turbo/snapshot-cache.js"
/*!**********************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/turbo/snapshot-cache.js ***!
  \**********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SnapshotCache: () => (/* binding */ SnapshotCache)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var SnapshotCache = /*#__PURE__*/function () {
  function SnapshotCache(size) {
    _classCallCheck(this, SnapshotCache);
    this.keys = [];
    this.snapshots = {};
    this.size = size;
  }
  return _createClass(SnapshotCache, [{
    key: "has",
    value: function has(location) {
      return location.toCacheKey() in this.snapshots;
    }
  }, {
    key: "get",
    value: function get(location) {
      if (this.has(location)) {
        var snapshot = this.read(location);
        this.touch(location);
        return snapshot;
      }
    }
  }, {
    key: "put",
    value: function put(location, snapshot) {
      this.write(location, snapshot);
      this.touch(location);
      return snapshot;
    }

    // Private
  }, {
    key: "read",
    value: function read(location) {
      return this.snapshots[location.toCacheKey()];
    }
  }, {
    key: "write",
    value: function write(location, snapshot) {
      this.snapshots[location.toCacheKey()] = snapshot;
    }
  }, {
    key: "touch",
    value: function touch(location) {
      var key = location.toCacheKey();
      var index = this.keys.indexOf(key);
      if (index > -1) this.keys.splice(index, 1);
      this.keys.unshift(key);
      this.trim();
    }
  }, {
    key: "trim",
    value: function trim() {
      var _iterator = _createForOfIteratorHelper(this.keys.splice(this.size)),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var key = _step.value;
          delete this.snapshots[key];
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }]);
}();

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/turbo/snapshot-renderer.js"
/*!*************************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/turbo/snapshot-renderer.js ***!
  \*************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SnapshotRenderer: () => (/* binding */ SnapshotRenderer)
/* harmony export */ });
/* harmony import */ var _renderer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./renderer */ "./vendor/larajax/larajax/resources/src/turbo/renderer.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util */ "./vendor/larajax/larajax/resources/src/util/index.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }


var SnapshotRenderer = /*#__PURE__*/function (_Renderer) {
  function SnapshotRenderer(delegate, currentSnapshot, newSnapshot, isPreview) {
    var _this;
    _classCallCheck(this, SnapshotRenderer);
    _this = _callSuper(this, SnapshotRenderer);
    _this.delegate = delegate;
    _this.currentSnapshot = currentSnapshot;
    _this.currentHeadDetails = currentSnapshot.headDetails;
    _this.newSnapshot = newSnapshot;
    _this.newHeadDetails = newSnapshot.headDetails;
    _this.newBody = newSnapshot.bodyElement;
    _this.isPreview = isPreview;
    return _this;
  }
  _inherits(SnapshotRenderer, _Renderer);
  return _createClass(SnapshotRenderer, [{
    key: "render",
    value: function render(callback) {
      var _this2 = this;
      if (this.shouldRender()) {
        this.mergeHead();
        this.renderView(function () {
          _this2.replaceBody();
          if (!_this2.isPreview) {
            _this2.focusFirstAutofocusableElement();
          }
          callback();
        });
      } else {
        this.invalidateView();
      }
    }
  }, {
    key: "mergeHead",
    value: function mergeHead() {
      this.copyNewHeadStylesheetElements();
      this.copyNewHeadScriptElements();
      this.removeCurrentHeadProvisionalElements();
      this.copyNewHeadProvisionalElements();
    }
  }, {
    key: "replaceBody",
    value: function replaceBody() {
      var placeholders = this.relocateCurrentBodyPermanentElements();
      this.activateNewBodyScriptElements();
      this.assignNewBody();
      this.replacePlaceholderElementsWithClonedPermanentElements(placeholders);
    }
  }, {
    key: "shouldRender",
    value: function shouldRender() {
      return this.currentSnapshot.isEnabled() && this.newSnapshot.isVisitable() && this.trackedElementsAreIdentical();
    }
  }, {
    key: "trackedElementsAreIdentical",
    value: function trackedElementsAreIdentical() {
      return this.currentHeadDetails.getTrackedElementSignature() == this.newHeadDetails.getTrackedElementSignature();
    }
  }, {
    key: "copyNewHeadStylesheetElements",
    value: function copyNewHeadStylesheetElements() {
      var _iterator = _createForOfIteratorHelper(this.getNewHeadStylesheetElements()),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var element = _step.value;
          document.head.appendChild(element);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "copyNewHeadScriptElements",
    value: function copyNewHeadScriptElements() {
      var _iterator2 = _createForOfIteratorHelper(this.getNewHeadScriptElements()),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var element = _step2.value;
          document.head.appendChild(this.bindPendingAssetLoadedEventOnce(this.createScriptElement(element)));
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }, {
    key: "bindPendingAssetLoadedEventOnce",
    value: function bindPendingAssetLoadedEventOnce(element) {
      if (!element.hasAttribute('src')) {
        return element;
      }
      var self = this,
        _loadEvent = function loadEvent() {
          self.delegate.decrementPendingAsset();
          element.removeEventListener('load', _loadEvent);
        };
      element.addEventListener('load', _loadEvent);
      this.delegate.incrementPendingAsset();
      return element;
    }
  }, {
    key: "removeCurrentHeadProvisionalElements",
    value: function removeCurrentHeadProvisionalElements() {
      var _iterator3 = _createForOfIteratorHelper(this.getCurrentHeadProvisionalElements()),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var element = _step3.value;
          document.head.removeChild(element);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }, {
    key: "copyNewHeadProvisionalElements",
    value: function copyNewHeadProvisionalElements() {
      var _iterator4 = _createForOfIteratorHelper(this.getNewHeadProvisionalElements()),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var element = _step4.value;
          document.head.appendChild(element);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
  }, {
    key: "relocateCurrentBodyPermanentElements",
    value: function relocateCurrentBodyPermanentElements() {
      var _this3 = this;
      return this.getCurrentBodyPermanentElements().reduce(function (placeholders, permanentElement) {
        var newElement = _this3.newSnapshot.getPermanentElementById(permanentElement.id);
        if (newElement) {
          var placeholder = createPlaceholderForPermanentElement(permanentElement);
          replaceElementWithElement(permanentElement, placeholder.element);
          replaceElementWithElement(newElement, permanentElement);
          return [].concat(_toConsumableArray(placeholders), [placeholder]);
        } else {
          return placeholders;
        }
      }, []);
    }
  }, {
    key: "replacePlaceholderElementsWithClonedPermanentElements",
    value: function replacePlaceholderElementsWithClonedPermanentElements(placeholders) {
      var _iterator5 = _createForOfIteratorHelper(placeholders),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var _step5$value = _step5.value,
            element = _step5$value.element,
            permanentElement = _step5$value.permanentElement;
          var clonedElement = permanentElement.cloneNode(true);
          replaceElementWithElement(element, clonedElement);
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    }
  }, {
    key: "activateNewBodyScriptElements",
    value: function activateNewBodyScriptElements() {
      var _iterator6 = _createForOfIteratorHelper(this.getNewBodyScriptElements()),
        _step6;
      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var inertScriptElement = _step6.value;
          var activatedScriptElement = this.createScriptElement(inertScriptElement);
          replaceElementWithElement(inertScriptElement, activatedScriptElement);
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
    }
  }, {
    key: "assignNewBody",
    value: function assignNewBody() {
      replaceElementWithElement(document.body, this.newBody);
    }
  }, {
    key: "focusFirstAutofocusableElement",
    value: function focusFirstAutofocusableElement() {
      var element = this.newSnapshot.findFirstAutofocusableElement();
      if (elementIsFocusable(element)) {
        element.focus();
      }
    }
  }, {
    key: "getNewHeadStylesheetElements",
    value: function getNewHeadStylesheetElements() {
      return this.newHeadDetails.getStylesheetElementsNotInDetails(this.currentHeadDetails);
    }
  }, {
    key: "getNewHeadScriptElements",
    value: function getNewHeadScriptElements() {
      return this.newHeadDetails.getScriptElementsNotInDetails(this.currentHeadDetails);
    }
  }, {
    key: "getCurrentHeadProvisionalElements",
    value: function getCurrentHeadProvisionalElements() {
      return this.currentHeadDetails.getProvisionalElements();
    }
  }, {
    key: "getNewHeadProvisionalElements",
    value: function getNewHeadProvisionalElements() {
      return this.newHeadDetails.getProvisionalElements();
    }
  }, {
    key: "getCurrentBodyPermanentElements",
    value: function getCurrentBodyPermanentElements() {
      return this.currentSnapshot.getPermanentElementsPresentInSnapshot(this.newSnapshot);
    }
  }, {
    key: "getNewBodyScriptElements",
    value: function getNewBodyScriptElements() {
      return (0,_util__WEBPACK_IMPORTED_MODULE_1__.array)(this.newBody.querySelectorAll('script'));
    }
  }], [{
    key: "render",
    value: function render(delegate, callback, currentSnapshot, newSnapshot, isPreview) {
      return new this(delegate, currentSnapshot, newSnapshot, isPreview).render(callback);
    }
  }]);
}(_renderer__WEBPACK_IMPORTED_MODULE_0__.Renderer);
function createPlaceholderForPermanentElement(permanentElement) {
  var element = document.createElement('meta');
  element.setAttribute('name', 'turbo-permanent-placeholder');
  element.setAttribute('content', permanentElement.id);
  return {
    element: element,
    permanentElement: permanentElement
  };
}
function replaceElementWithElement(fromElement, toElement) {
  var parentElement = fromElement.parentElement;
  if (parentElement) {
    return parentElement.replaceChild(toElement, fromElement);
  }
}
function elementIsFocusable(element) {
  return element && typeof element.focus == 'function';
}

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/turbo/snapshot.js"
/*!****************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/turbo/snapshot.js ***!
  \****************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Snapshot: () => (/* binding */ Snapshot)
/* harmony export */ });
/* harmony import */ var _head_details__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./head-details */ "./vendor/larajax/larajax/resources/src/turbo/head-details.js");
/* harmony import */ var _location__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./location */ "./vendor/larajax/larajax/resources/src/turbo/location.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util */ "./vendor/larajax/larajax/resources/src/util/index.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



var Snapshot = /*#__PURE__*/function () {
  function Snapshot(headDetails, bodyElement) {
    _classCallCheck(this, Snapshot);
    this.headDetails = headDetails;
    this.bodyElement = bodyElement;
  }
  return _createClass(Snapshot, [{
    key: "clone",
    value: function clone() {
      return new Snapshot(this.headDetails, this.bodyElement.cloneNode(true));
    }
  }, {
    key: "getRootLocation",
    value: function getRootLocation() {
      var root = this.getSetting('root', '/');
      return new _location__WEBPACK_IMPORTED_MODULE_1__.Location(root);
    }
  }, {
    key: "getCacheControlValue",
    value: function getCacheControlValue() {
      return this.getSetting('cache-control');
    }
  }, {
    key: "getElementForAnchor",
    value: function getElementForAnchor(anchor) {
      try {
        return this.bodyElement.querySelector("[id='".concat(anchor, "'], a[name='").concat(anchor, "']"));
      } catch (e) {
        return null;
      }
    }
  }, {
    key: "getPermanentElements",
    value: function getPermanentElements() {
      return (0,_util__WEBPACK_IMPORTED_MODULE_2__.array)(this.bodyElement.querySelectorAll('[id][data-turbo-permanent]'));
    }
  }, {
    key: "getPermanentElementById",
    value: function getPermanentElementById(id) {
      return this.bodyElement.querySelector("#".concat(id, "[data-turbo-permanent]"));
    }
  }, {
    key: "getPermanentElementsPresentInSnapshot",
    value: function getPermanentElementsPresentInSnapshot(snapshot) {
      return this.getPermanentElements().filter(function (_ref) {
        var id = _ref.id;
        return snapshot.getPermanentElementById(id);
      });
    }
  }, {
    key: "findFirstAutofocusableElement",
    value: function findFirstAutofocusableElement() {
      return this.bodyElement.querySelector('[autofocus]');
    }
  }, {
    key: "hasAnchor",
    value: function hasAnchor(anchor) {
      return this.getElementForAnchor(anchor) != null;
    }
  }, {
    key: "isPreviewable",
    value: function isPreviewable() {
      return this.getCacheControlValue() != 'no-preview';
    }
  }, {
    key: "isCacheable",
    value: function isCacheable() {
      return this.getCacheControlValue() != 'no-cache';
    }
  }, {
    key: "isNativeError",
    value: function isNativeError() {
      return this.getSetting('visit-control', false) != false;
    }
  }, {
    key: "isEnabled",
    value: function isEnabled() {
      return this.getSetting('visit-control') != 'disable';
    }
  }, {
    key: "isVisitable",
    value: function isVisitable() {
      return this.isEnabled() && this.getSetting('visit-control') != 'reload';
    }
  }, {
    key: "getSetting",
    value: function getSetting(name, defaultValue) {
      var value = this.headDetails.getMetaValue("turbo-".concat(name));
      return value == null ? defaultValue : value;
    }
  }], [{
    key: "wrap",
    value: function wrap(value) {
      if (value instanceof this) {
        return value;
      } else if (typeof value == 'string') {
        return this.fromHTMLString(value);
      } else {
        return this.fromHTMLElement(value);
      }
    }
  }, {
    key: "fromHTMLString",
    value: function fromHTMLString(html) {
      var element = document.createElement('html');
      element.innerHTML = html;
      return this.fromHTMLElement(element);
    }
  }, {
    key: "fromHTMLElement",
    value: function fromHTMLElement(htmlElement) {
      var headElement = htmlElement.querySelector('head');
      var bodyElement = htmlElement.querySelector('body') || document.createElement('body');
      var headDetails = _head_details__WEBPACK_IMPORTED_MODULE_0__.HeadDetails.fromHeadElement(headElement);
      return new this(headDetails, bodyElement);
    }
  }]);
}();

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/turbo/view.js"
/*!************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/turbo/view.js ***!
  \************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   View: () => (/* binding */ View)
/* harmony export */ });
/* harmony import */ var _error_renderer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./error-renderer */ "./vendor/larajax/larajax/resources/src/turbo/error-renderer.js");
/* harmony import */ var _snapshot__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./snapshot */ "./vendor/larajax/larajax/resources/src/turbo/snapshot.js");
/* harmony import */ var _snapshot_renderer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./snapshot-renderer */ "./vendor/larajax/larajax/resources/src/turbo/snapshot-renderer.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



var View = /*#__PURE__*/function () {
  function View(delegate) {
    _classCallCheck(this, View);
    this.htmlElement = document.documentElement;
    this.delegate = delegate;
  }
  return _createClass(View, [{
    key: "getRootLocation",
    value: function getRootLocation() {
      return this.getSnapshot().getRootLocation();
    }
  }, {
    key: "getElementForAnchor",
    value: function getElementForAnchor(anchor) {
      return this.getSnapshot().getElementForAnchor(anchor);
    }
  }, {
    key: "getSnapshot",
    value: function getSnapshot() {
      return _snapshot__WEBPACK_IMPORTED_MODULE_1__.Snapshot.fromHTMLElement(this.htmlElement);
    }
  }, {
    key: "render",
    value: function render(_ref, callback) {
      var snapshot = _ref.snapshot,
        error = _ref.error,
        isPreview = _ref.isPreview;
      this.markAsPreview(isPreview);
      if (snapshot) {
        this.renderSnapshot(snapshot, isPreview, callback);
      } else {
        this.renderError(error, callback);
      }
    }

    // Private
  }, {
    key: "markAsPreview",
    value: function markAsPreview(isPreview) {
      if (isPreview) {
        this.htmlElement.setAttribute('data-turbo-preview', '');
      } else {
        this.htmlElement.removeAttribute('data-turbo-preview');
      }
    }
  }, {
    key: "renderSnapshot",
    value: function renderSnapshot(snapshot, isPreview, callback) {
      _snapshot_renderer__WEBPACK_IMPORTED_MODULE_2__.SnapshotRenderer.render(this.delegate, callback, this.getSnapshot(), snapshot, isPreview || false);
    }
  }, {
    key: "renderError",
    value: function renderError(error, callback) {
      _error_renderer__WEBPACK_IMPORTED_MODULE_0__.ErrorRenderer.render(this.delegate, callback, error || '');
    }
  }]);
}();

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/turbo/visit.js"
/*!*************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/turbo/visit.js ***!
  \*************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TimingMetric: () => (/* binding */ TimingMetric),
/* harmony export */   Visit: () => (/* binding */ Visit),
/* harmony export */   VisitState: () => (/* binding */ VisitState)
/* harmony export */ });
/* harmony import */ var _util_http_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/http-request */ "./vendor/larajax/larajax/resources/src/util/http-request.js");
/* harmony import */ var _location__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./location */ "./vendor/larajax/larajax/resources/src/turbo/location.js");
/* harmony import */ var _snapshot__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./snapshot */ "./vendor/larajax/larajax/resources/src/turbo/snapshot.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util */ "./vendor/larajax/larajax/resources/src/util/index.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }




var TimingMetric = {
  visitStart: 'visitStart',
  requestStart: 'requestStart',
  requestEnd: 'requestEnd',
  visitEnd: 'visitEnd'
};
var VisitState = {
  initialized: 'initialized',
  started: 'started',
  canceled: 'canceled',
  failed: 'failed',
  completed: 'completed'
};
var Visit = /*#__PURE__*/function () {
  function Visit(controller, location, action) {
    var _this = this;
    var restorationIdentifier = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : (0,_util__WEBPACK_IMPORTED_MODULE_3__.uuid)();
    _classCallCheck(this, Visit);
    this.identifier = (0,_util__WEBPACK_IMPORTED_MODULE_3__.uuid)();
    this.timingMetrics = {};
    this.followedRedirect = false;
    this.historyChanged = false;
    this.progress = 0;
    this.scrolled = false;
    this.snapshotCached = action === 'swap';
    this.state = VisitState.initialized;

    // Scrolling
    this.performScroll = function () {
      if (!_this.scrolled) {
        if (_this.action == 'restore') {
          _this.scrollToRestoredPosition() || _this.scrollToTop();
        } else {
          _this.scrollToAnchor() || _this.scrollToTop();
        }
        _this.scrolled = true;
      }
    };
    this.controller = controller;
    this.location = location;
    this.action = action;
    this.adapter = controller.adapter;
    this.restorationIdentifier = restorationIdentifier;
    this.isSamePage = this.locationChangeIsSamePage();
  }
  return _createClass(Visit, [{
    key: "start",
    value: function start() {
      if (this.state == VisitState.initialized) {
        this.recordTimingMetric(TimingMetric.visitStart);
        this.state = VisitState.started;
        this.adapter.visitStarted(this);
      }
    }
  }, {
    key: "cancel",
    value: function cancel() {
      if (this.state == VisitState.started) {
        if (this.request) {
          this.request.abort();
        }
        this.cancelRender();
        this.state = VisitState.canceled;
      }
    }
  }, {
    key: "complete",
    value: function complete() {
      if (this.state == VisitState.started) {
        this.recordTimingMetric(TimingMetric.visitEnd);
        this.state = VisitState.completed;
        this.adapter.visitCompleted(this);
        this.controller.visitCompleted(this);
      }
    }
  }, {
    key: "fail",
    value: function fail() {
      if (this.state == VisitState.started) {
        this.state = VisitState.failed;
        this.adapter.visitFailed(this);
      }
    }
  }, {
    key: "changeHistory",
    value: function changeHistory() {
      if (!this.historyChanged) {
        var actionForHistory = this.location.isEqualTo(this.referrer) ? 'replace' : this.action;
        var method = this.getHistoryMethodForAction(actionForHistory);
        method.call(this.controller, this.location, this.restorationIdentifier);
        this.historyChanged = true;
      }
    }
  }, {
    key: "issueRequest",
    value: function issueRequest() {
      if (this.shouldIssueRequest() && !this.request) {
        var url = _location__WEBPACK_IMPORTED_MODULE_1__.Location.wrap(this.location).absoluteURL;
        var options = {
          method: 'GET',
          headers: {},
          htmlOnly: true,
          timeout: 240
        };
        options.headers['Accept'] = 'text/html, application/xhtml+xml';
        options.headers['X-PJAX'] = 1;
        if (this.hasCachedSnapshot()) {
          options.headers['X-PJAX-CACHED'] = 1;
        }
        if (this.referrer) {
          options.headers['X-PJAX-REFERRER'] = _location__WEBPACK_IMPORTED_MODULE_1__.Location.wrap(this.referrer).absoluteURL;
        }
        this.progress = 0;
        this.request = new _util_http_request__WEBPACK_IMPORTED_MODULE_0__.HttpRequest(this, url, options);
        this.request.send();
      }
    }
  }, {
    key: "getCachedSnapshot",
    value: function getCachedSnapshot() {
      var snapshot = this.controller.getCachedSnapshotForLocation(this.location);
      if (snapshot && (!this.location.anchor || snapshot.hasAnchor(this.location.anchor))) {
        if (this.action == 'restore' || snapshot.isPreviewable()) {
          return snapshot;
        }
      }
    }
  }, {
    key: "hasCachedSnapshot",
    value: function hasCachedSnapshot() {
      return this.getCachedSnapshot() != null;
    }
  }, {
    key: "loadCachedSnapshot",
    value: function loadCachedSnapshot() {
      var _this2 = this;
      var snapshot = this.getCachedSnapshot();
      if (snapshot) {
        var isPreview = this.shouldIssueRequest();
        this.render(function () {
          _this2.cacheSnapshot();
          if (_this2.isSamePage) {
            _this2.performScroll();
            _this2.adapter.visitRendered(_this2);
          } else {
            _this2.controller.render({
              snapshot: snapshot,
              isPreview: isPreview
            }, _this2.performScroll);
            _this2.adapter.visitRendered(_this2);
            if (!isPreview) {
              _this2.complete();
            }
          }
        });
      }
    }
  }, {
    key: "loadResponse",
    value: function loadResponse() {
      var _this3 = this;
      var request = this.request,
        response = this.response;
      if (request && response) {
        this.render(function () {
          var snapshot = _snapshot__WEBPACK_IMPORTED_MODULE_2__.Snapshot.fromHTMLString(response);
          _this3.cacheSnapshot();
          if (request.failed && !snapshot.isNativeError()) {
            _this3.controller.render({
              error: response
            }, _this3.performScroll);
            _this3.adapter.visitRendered(_this3);
            _this3.fail();
          } else {
            _this3.controller.render({
              snapshot: snapshot
            }, _this3.performScroll);
            _this3.adapter.visitRendered(_this3);
            _this3.complete();
          }
        });
      }
    }
  }, {
    key: "followRedirect",
    value: function followRedirect() {
      if (this.redirectedToLocation && !this.followedRedirect) {
        this.location = this.redirectedToLocation;
        this.controller.replaceHistoryWithLocationAndRestorationIdentifier(this.redirectedToLocation, this.restorationIdentifier);
        this.followedRedirect = true;
      }
    }
  }, {
    key: "goToSamePageAnchor",
    value: function goToSamePageAnchor() {
      var _this4 = this;
      if (this.isSamePage) {
        this.render(function () {
          _this4.cacheSnapshot();
          _this4.performScroll();
          _this4.adapter.visitRendered(_this4);
        });
      }
    }

    // HTTP request delegate
  }, {
    key: "requestStarted",
    value: function requestStarted() {
      this.recordTimingMetric(TimingMetric.requestStart);
      this.adapter.visitRequestStarted(this);
    }
  }, {
    key: "requestProgressed",
    value: function requestProgressed(progress) {
      this.progress = progress;
      if (this.adapter.visitRequestProgressed) {
        this.adapter.visitRequestProgressed(this);
      }
    }
  }, {
    key: "requestCompletedWithResponse",
    value: function requestCompletedWithResponse(response, statusCode, redirectedToLocation) {
      this.response = response;
      this.redirectedToLocation = _location__WEBPACK_IMPORTED_MODULE_1__.Location.wrap(redirectedToLocation);
      this.adapter.visitRequestCompleted(this);
    }
  }, {
    key: "requestFailedWithStatusCode",
    value: function requestFailedWithStatusCode(statusCode, response) {
      this.response = response;
      this.adapter.visitRequestFailedWithStatusCode(this, statusCode);
    }
  }, {
    key: "requestFinished",
    value: function requestFinished() {
      this.recordTimingMetric(TimingMetric.requestEnd);
      this.adapter.visitRequestFinished(this);
    }
  }, {
    key: "scrollToRestoredPosition",
    value: function scrollToRestoredPosition() {
      var position = this.restorationData ? this.restorationData.scrollPosition : undefined;
      if (position) {
        this.controller.scrollToPosition(position);
        return true;
      }
    }
  }, {
    key: "scrollToAnchor",
    value: function scrollToAnchor() {
      if (this.location.anchor != null) {
        this.controller.scrollToAnchor(this.location.anchor);
        return true;
      }
    }
  }, {
    key: "scrollToTop",
    value: function scrollToTop() {
      this.controller.scrollToPosition({
        x: 0,
        y: 0
      });
    }

    // Instrumentation
  }, {
    key: "recordTimingMetric",
    value: function recordTimingMetric(metric) {
      this.timingMetrics[metric] = new Date().getTime();
    }
  }, {
    key: "getTimingMetrics",
    value: function getTimingMetrics() {
      return Object.assign({}, this.timingMetrics);
    }

    // Private
  }, {
    key: "getHistoryMethodForAction",
    value: function getHistoryMethodForAction(action) {
      switch (action) {
        case 'swap':
        case 'replace':
          return this.controller.replaceHistoryWithLocationAndRestorationIdentifier;
        case 'advance':
        case 'restore':
          return this.controller.pushHistoryWithLocationAndRestorationIdentifier;
      }
    }
  }, {
    key: "shouldIssueRequest",
    value: function shouldIssueRequest() {
      if (this.action == 'restore') {
        return !this.hasCachedSnapshot();
      } else if (this.isSamePage) {
        return false;
      } else {
        return true;
      }
    }
  }, {
    key: "locationChangeIsSamePage",
    value: function locationChangeIsSamePage() {
      if (this.action == 'swap') {
        return true;
      }
      var lastLocation = this.action == 'restore' && this.controller.lastRenderedLocation;
      return this.controller.locationIsSamePageAnchor(lastLocation || this.location);
    }
  }, {
    key: "cacheSnapshot",
    value: function cacheSnapshot() {
      if (!this.snapshotCached) {
        this.controller.cacheSnapshot();
        this.snapshotCached = true;
      }
    }
  }, {
    key: "render",
    value: function render(callback) {
      var _this5 = this;
      this.cancelRender();
      this.frame = requestAnimationFrame(function () {
        delete _this5.frame;
        callback.call(_this5);
      });
    }
  }, {
    key: "cancelRender",
    value: function cancelRender() {
      if (this.frame) {
        cancelAnimationFrame(this.frame);
        delete this.frame;
      }
    }
  }]);
}();

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/util/events.js"
/*!*************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/util/events.js ***!
  \*************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Events: () => (/* binding */ Events)
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index */ "./vendor/larajax/larajax/resources/src/util/index.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


/**
 * Constants
 */
var namespaceRegex = /[^.]*(?=\..*)\.|.*/;
var stripNameRegex = /\..*/;
var stripUidRegex = /::\d+$/;
var eventRegistry = {}; // Events storage

var uidEvent = 1;
var customEvents = {
  mouseenter: 'mouseover',
  mouseleave: 'mouseout'
};
var nativeEvents = new Set(['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll']);
var Events = /*#__PURE__*/function () {
  function Events() {
    _classCallCheck(this, Events);
  }
  return _createClass(Events, null, [{
    key: "on",
    value: function on(element, event, handler, delegationFunction, options) {
      addHandler(element, event, handler, delegationFunction, options, false);
    }
  }, {
    key: "one",
    value: function one(element, event, handler, delegationFunction, options) {
      addHandler(element, event, handler, delegationFunction, options, true);
    }
  }, {
    key: "off",
    value: function off(element, originalTypeEvent, handler, delegationFunction, options) {
      if (typeof originalTypeEvent !== 'string' || !element) {
        return;
      }
      var _normalizeParameters = normalizeParameters(originalTypeEvent, handler, delegationFunction, options),
        _normalizeParameters2 = _slicedToArray(_normalizeParameters, 4),
        isDelegated = _normalizeParameters2[0],
        callable = _normalizeParameters2[1],
        typeEvent = _normalizeParameters2[2],
        opts = _normalizeParameters2[3];
      var inNamespace = typeEvent !== originalTypeEvent;
      var events = getElementEvents(element);
      var storeElementEvent = events[typeEvent] || {};
      var isNamespace = originalTypeEvent.startsWith('.');
      if (typeof callable !== 'undefined') {
        // Simplest case: handler is passed, remove that listener ONLY.
        if (!storeElementEvent) {
          return;
        }
        removeHandler(element, events, typeEvent, callable, isDelegated ? handler : null, opts);
        return;
      }
      if (isNamespace) {
        for (var _i = 0, _Object$keys = Object.keys(events); _i < _Object$keys.length; _i++) {
          var elementEvent = _Object$keys[_i];
          removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
        }
      }
      for (var _i2 = 0, _Object$keys2 = Object.keys(storeElementEvent); _i2 < _Object$keys2.length; _i2++) {
        var keyHandlers = _Object$keys2[_i2];
        var handlerKey = keyHandlers.replace(stripUidRegex, '');
        if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
          var event = storeElementEvent[keyHandlers];
          removeHandler(element, events, typeEvent, event.callable, event.delegationSelector, opts);
        }
      }
    }
  }, {
    key: "dispatch",
    value: function dispatch(eventName) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$target = _ref.target,
        target = _ref$target === void 0 ? document : _ref$target,
        _ref$detail = _ref.detail,
        detail = _ref$detail === void 0 ? {} : _ref$detail,
        _ref$bubbles = _ref.bubbles,
        bubbles = _ref$bubbles === void 0 ? true : _ref$bubbles,
        _ref$cancelable = _ref.cancelable,
        cancelable = _ref$cancelable === void 0 ? true : _ref$cancelable;
      return (0,_index__WEBPACK_IMPORTED_MODULE_0__.dispatch)(eventName, {
        target: target,
        detail: detail,
        bubbles: bubbles,
        cancelable: cancelable
      });
    }
  }, {
    key: "trigger",
    value: function trigger(target, eventName) {
      var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref2$detail = _ref2.detail,
        detail = _ref2$detail === void 0 ? {} : _ref2$detail,
        _ref2$bubbles = _ref2.bubbles,
        bubbles = _ref2$bubbles === void 0 ? true : _ref2$bubbles,
        _ref2$cancelable = _ref2.cancelable,
        cancelable = _ref2$cancelable === void 0 ? true : _ref2$cancelable;
      return (0,_index__WEBPACK_IMPORTED_MODULE_0__.dispatch)(eventName, {
        target: target,
        detail: detail,
        bubbles: bubbles,
        cancelable: cancelable
      });
    }
  }]);
}();

/**
 * Private methods
 */
function makeEventUid(element, uid) {
  return uid && "".concat(uid, "::").concat(uidEvent++) || element.uidEvent || uidEvent++;
}
function getElementEvents(element) {
  var uid = makeEventUid(element);
  element.uidEvent = uid;
  eventRegistry[uid] = eventRegistry[uid] || {};
  return eventRegistry[uid];
}
function findHandler(events, callable) {
  var delegationSelector = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  return Object.values(events).find(function (event) {
    return event.callable === callable && event.delegationSelector === delegationSelector;
  });
}
function normalizeParameters(originalTypeEvent, handler, delegationFunction, options) {
  var isDelegated = typeof handler === 'string';
  var callable = isDelegated ? delegationFunction : handler;
  var opts = isDelegated ? options : delegationFunction;
  var typeEvent = getTypeEvent(originalTypeEvent);
  if (!nativeEvents.has(typeEvent)) {
    typeEvent = originalTypeEvent;
  }
  return [isDelegated, callable, typeEvent, opts];
}
function addHandler(element, originalTypeEvent, handler, delegationFunction, options, oneOff) {
  if (typeof originalTypeEvent !== 'string' || !element) {
    return;
  }
  var _normalizeParameters3 = normalizeParameters(originalTypeEvent, handler, delegationFunction, options),
    _normalizeParameters4 = _slicedToArray(_normalizeParameters3, 4),
    isDelegated = _normalizeParameters4[0],
    callable = _normalizeParameters4[1],
    typeEvent = _normalizeParameters4[2],
    opts = _normalizeParameters4[3];

  // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
  // this prevents the handler from being dispatched the same way as mouseover or mouseout does
  if (originalTypeEvent in customEvents) {
    var wrapFunction = function wrapFunction(fn) {
      return function (event) {
        if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
          return fn.call(this, event);
        }
      };
    };
    callable = wrapFunction(callable);
  }
  var events = getElementEvents(element);
  var handlers = events[typeEvent] || (events[typeEvent] = {});
  var previousFunction = findHandler(handlers, callable, isDelegated ? handler : null);
  if (previousFunction) {
    previousFunction.oneOff = previousFunction.oneOff && oneOff;
    return;
  }
  var uid = makeEventUid(callable, originalTypeEvent.replace(namespaceRegex, ''));
  var fn = isDelegated ? internalDelegationHandler(element, handler, callable) : internalHandler(element, callable);
  fn.delegationSelector = isDelegated ? handler : null;
  fn.callable = callable;
  fn.oneOff = oneOff;
  fn.uidEvent = uid;
  handlers[uid] = fn;
  element.addEventListener(typeEvent, fn, opts);
}
function removeHandler(element, events, typeEvent, handler, delegationSelector, options) {
  var fn = findHandler(events[typeEvent], handler, delegationSelector);
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
    var domElements = element.querySelectorAll(selector);
    for (var target = event.target; target && target !== this; target = target.parentNode) {
      var _iterator = _createForOfIteratorHelper(domElements),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var domElement = _step.value;
          if (domElement !== target) {
            continue;
          }
          event.delegateTarget = target;
          if (handler.oneOff) {
            Events.off(element, event.type, selector, fn);
          }
          return fn.apply(target, [event]);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  };
}
function removeNamespacedHandlers(element, events, typeEvent, namespace) {
  var storeElementEvent = events[typeEvent] || {};
  for (var _i3 = 0, _Object$keys3 = Object.keys(storeElementEvent); _i3 < _Object$keys3.length; _i3++) {
    var handlerKey = _Object$keys3[_i3];
    if (handlerKey.includes(namespace)) {
      var event = storeElementEvent[handlerKey];
      removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
    }
  }
}

// Allow to get the native events from namespaced events ('click.bs.button' --> 'click')
function getTypeEvent(event) {
  event = event.replace(stripNameRegex, '');
  return customEvents[event] || event;
}

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/util/form-serializer.js"
/*!**********************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/util/form-serializer.js ***!
  \**********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FormSerializer: () => (/* binding */ FormSerializer)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// FormSerializer serializes input elements to JSON
var FormSerializer = /*#__PURE__*/function () {
  function FormSerializer() {
    _classCallCheck(this, FormSerializer);
  }
  return _createClass(FormSerializer, [{
    key: "parseContainer",
    value:
    // Private
    function parseContainer(element) {
      var _this = this;
      var jsonData = {};
      element.querySelectorAll('input, textarea, select').forEach(function (field) {
        if (!field.name || field.disabled || ['file', 'reset', 'submit', 'button'].indexOf(field.type) > -1) {
          return;
        }
        if (['checkbox', 'radio'].indexOf(field.type) > -1 && !field.checked) {
          return;
        }
        if (field.type === 'select-multiple') {
          var arr = [];
          Array.from(field.options).forEach(function (option) {
            if (option.selected) {
              arr.push({
                name: field.name,
                value: option.value
              });
            }
          });
          _this.assignObjectInternal(jsonData, field.name, arr);
          return;
        }
        _this.assignObjectInternal(jsonData, field.name, field.value);
      });
      return jsonData;
    }
  }, {
    key: "assignObjectInternal",
    value: function assignObjectInternal(obj, fieldName, fieldValue) {
      this.assignObjectNested(obj, this.nameToArray(fieldName), fieldValue, fieldName.endsWith('[]'));
    }
  }, {
    key: "assignObjectNested",
    value: function assignObjectNested(obj, fieldArr, fieldValue, isArray) {
      var currentTarget = obj,
        lastIndex = fieldArr.length - 1;
      fieldArr.forEach(function (prop, index) {
        if (isArray && index === lastIndex) {
          if (!Array.isArray(currentTarget[prop])) {
            currentTarget[prop] = [];
          }
          if (Array.isArray(fieldValue)) {
            var _currentTarget$prop;
            (_currentTarget$prop = currentTarget[prop]).push.apply(_currentTarget$prop, _toConsumableArray(fieldValue));
          } else {
            currentTarget[prop].push(fieldValue);
          }
        } else {
          if (currentTarget[prop] === undefined || currentTarget[prop].constructor !== {}.constructor) {
            currentTarget[prop] = {};
          }
          if (index === lastIndex) {
            currentTarget[prop] = fieldValue;
          }
          currentTarget = currentTarget[prop];
        }
      });
    }
  }, {
    key: "nameToArray",
    value: function nameToArray(fieldName) {
      var expression = /([^\]\[]+)/g,
        elements = [],
        searchResult;
      while (searchResult = expression.exec(fieldName)) {
        elements.push(searchResult[0]);
      }
      return elements;
    }
  }], [{
    key: "assignToObj",
    value:
    // Public
    function assignToObj(obj, name, value) {
      new FormSerializer().assignObjectInternal(obj, name, value);
    }
  }, {
    key: "serializeAsJSON",
    value: function serializeAsJSON(element) {
      if (typeof element === 'string') {
        element = document.querySelector(element);
      }
      return new FormSerializer().parseContainer(element);
    }
  }]);
}();

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/util/http-request.js"
/*!*******************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/util/http-request.js ***!
  \*******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HttpRequest: () => (/* binding */ HttpRequest),
/* harmony export */   SystemStatusCode: () => (/* binding */ SystemStatusCode)
/* harmony export */ });
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./events */ "./vendor/larajax/larajax/resources/src/util/events.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var SystemStatusCode = {
  networkFailure: 0,
  timeoutFailure: -1,
  contentTypeMismatch: -2,
  userAborted: -3
};
var HttpRequest = /*#__PURE__*/function () {
  function HttpRequest(delegate, url, options) {
    _classCallCheck(this, HttpRequest);
    this.failed = false;
    this.progress = 0;
    this.sent = false;
    this.aborted = false;
    this.timedOut = false;
    this.delegate = delegate;
    this.url = url;
    this.options = options;
    this.headers = options.headers || {};
    this.method = options.method || 'GET';
    this.data = options.data;
    this.timeout = options.timeout || 0;

    // AbortController for cancellation and timeout
    this.controller = new AbortController();
    this.timeoutId = null;

    // XHR compatibility wrapper (populated after response)
    this.xhr = this.createXhrWrapper();
  }
  return _createClass(HttpRequest, [{
    key: "send",
    value: function send() {
      var _this = this;
      if (this.sent) {
        return;
      }
      this.sent = true;
      this.notifyApplicationBeforeRequestStart();
      this.setProgress(0);
      this.delegate.requestStarted();

      // Set up timeout
      if (this.timeout > 0) {
        this.timeoutId = setTimeout(function () {
          _this.timedOut = true;
          _this.controller.abort();
        }, this.timeout * 1000);
      }
      this.performFetch();
    }
  }, {
    key: "performFetch",
    value: function () {
      var _performFetch = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var response, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              _context.p = 0;
              _context.n = 1;
              return fetch(this.url, {
                method: this.method,
                headers: this.headers,
                body: this.data || null,
                signal: this.controller.signal
              });
            case 1:
              response = _context.v;
              this.clearTimeout();

              // Update XHR wrapper with response data
              this.updateXhrWrapper(response);

              // Process the response
              _context.n = 2;
              return this.handleResponse(response);
            case 2:
              _context.n = 4;
              break;
            case 3:
              _context.p = 3;
              _t = _context.v;
              this.clearTimeout();
              if (_t.name === 'AbortError') {
                if (this.timedOut) {
                  this.handleTimeout();
                } else {
                  this.handleAbort();
                }
              } else {
                this.handleNetworkError();
              }
            case 4:
              return _context.a(2);
          }
        }, _callee, this, [[0, 3]]);
      }));
      function performFetch() {
        return _performFetch.apply(this, arguments);
      }
      return performFetch;
    }()
  }, {
    key: "handleResponse",
    value: function () {
      var _handleResponse = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(response) {
        var contentType, contentDisposition, responseData;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              contentType = response.headers.get('Content-Type');
              contentDisposition = response.headers.get('Content-Disposition') || ''; // Check HTML-only constraint
              if (!(this.options.htmlOnly && !contentTypeIsHTML(contentType))) {
                _context2.n = 1;
                break;
              }
              this.failed = true;
              this.notifyApplicationAfterRequestEnd();
              this.delegate.requestFailedWithStatusCode(SystemStatusCode.contentTypeMismatch);
              this.destroy();
              return _context2.a(2);
            case 1:
              if (!(contentDisposition.startsWith('attachment') || contentDisposition.startsWith('inline'))) {
                _context2.n = 3;
                break;
              }
              _context2.n = 2;
              return response.blob();
            case 2:
              responseData = _context2.v;
              _context2.n = 7;
              break;
            case 3:
              if (!contentTypeIsJSON(contentType)) {
                _context2.n = 5;
                break;
              }
              _context2.n = 4;
              return response.json();
            case 4:
              responseData = _context2.v;
              _context2.n = 7;
              break;
            case 5:
              _context2.n = 6;
              return response.text();
            case 6:
              responseData = _context2.v;
            case 7:
              // Check status code
              if (response.status >= 200 && response.status < 300) {
                this.notifyApplicationAfterRequestEnd();
                this.delegate.requestCompletedWithResponse(responseData, response.status, this.getRedirectLocation(response));
                this.destroy();
              } else {
                this.failed = true;
                this.notifyApplicationAfterRequestEnd();
                this.delegate.requestFailedWithStatusCode(response.status, responseData);
                this.destroy();
              }
            case 8:
              return _context2.a(2);
          }
        }, _callee2, this);
      }));
      function handleResponse(_x) {
        return _handleResponse.apply(this, arguments);
      }
      return handleResponse;
    }()
  }, {
    key: "getRedirectLocation",
    value: function getRedirectLocation(response) {
      // Check for explicit redirect header
      var ajaxLocation = response.headers.get('X-AJAX-LOCATION');
      if (ajaxLocation) {
        return ajaxLocation;
      }

      // Check if response URL differs from request URL
      var anchorMatch = this.url.match(/^(.*)#/),
        wantUrl = anchorMatch ? anchorMatch[1] : this.url;
      return wantUrl !== response.url ? response.url : null;
    }
  }, {
    key: "handleTimeout",
    value: function handleTimeout() {
      this.failed = true;
      this.notifyApplicationAfterRequestEnd();
      this.delegate.requestFailedWithStatusCode(SystemStatusCode.timeoutFailure);
      this.destroy();
    }
  }, {
    key: "handleAbort",
    value: function handleAbort() {
      if (this.options.trackAbort) {
        this.failed = true;
        this.notifyApplicationAfterRequestEnd();
        this.delegate.requestFailedWithStatusCode(SystemStatusCode.userAborted);
      } else {
        this.notifyApplicationAfterRequestEnd();
      }
      this.destroy();
    }
  }, {
    key: "handleNetworkError",
    value: function handleNetworkError() {
      this.failed = true;
      this.notifyApplicationAfterRequestEnd();
      this.delegate.requestFailedWithStatusCode(SystemStatusCode.networkFailure);
      this.destroy();
    }
  }, {
    key: "abort",
    value: function abort() {
      if (this.sent && !this.aborted) {
        this.aborted = true;
        this.controller.abort();
      }
    }
  }, {
    key: "clearTimeout",
    value: function (_clearTimeout) {
      function clearTimeout() {
        return _clearTimeout.apply(this, arguments);
      }
      clearTimeout.toString = function () {
        return _clearTimeout.toString();
      };
      return clearTimeout;
    }(function () {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
    }

    // Application events
    )
  }, {
    key: "notifyApplicationBeforeRequestStart",
    value: function notifyApplicationBeforeRequestStart() {
      _events__WEBPACK_IMPORTED_MODULE_0__.Events.dispatch('ajax:request-start', {
        detail: {
          url: this.url,
          xhr: this.xhr
        },
        cancelable: false
      });
    }
  }, {
    key: "notifyApplicationAfterRequestEnd",
    value: function notifyApplicationAfterRequestEnd() {
      _events__WEBPACK_IMPORTED_MODULE_0__.Events.dispatch('ajax:request-end', {
        detail: {
          url: this.url,
          xhr: this.xhr
        },
        cancelable: false
      });
    }

    // XHR compatibility wrapper
  }, {
    key: "createXhrWrapper",
    value: function createXhrWrapper() {
      return {
        status: 0,
        statusText: '',
        responseURL: this.url,
        getResponseHeader: function getResponseHeader(name) {
          return null;
        },
        getAllResponseHeaders: function getAllResponseHeaders() {
          return '';
        }
      };
    }
  }, {
    key: "updateXhrWrapper",
    value: function updateXhrWrapper(response) {
      this.xhr = {
        status: response.status,
        statusText: response.statusText,
        responseURL: response.url,
        getResponseHeader: function getResponseHeader(name) {
          return response.headers.get(name);
        },
        getAllResponseHeaders: function getAllResponseHeaders() {
          return _toConsumableArray(response.headers).map(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
              k = _ref2[0],
              v = _ref2[1];
            return "".concat(k, ": ").concat(v);
          }).join('\r\n');
        }
      };
    }
  }, {
    key: "setProgress",
    value: function setProgress(progress) {
      this.progress = progress;
      this.delegate.requestProgressed(progress);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.setProgress(1);
      this.delegate.requestFinished();
    }
  }]);
}();
function contentTypeIsHTML(contentType) {
  return (contentType || '').match(/^text\/html|^application\/xhtml\+xml/);
}
function contentTypeIsJSON(contentType) {
  return (contentType || '').includes('application/json');
}

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/util/index.js"
/*!************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/util/index.js ***!
  \************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   array: () => (/* binding */ array),
/* harmony export */   defer: () => (/* binding */ defer),
/* harmony export */   dispatch: () => (/* binding */ dispatch),
/* harmony export */   unindent: () => (/* binding */ unindent),
/* harmony export */   uuid: () => (/* binding */ uuid)
/* harmony export */ });
function dispatch(eventName) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    _ref$target = _ref.target,
    target = _ref$target === void 0 ? document : _ref$target,
    _ref$detail = _ref.detail,
    detail = _ref$detail === void 0 ? {} : _ref$detail,
    _ref$bubbles = _ref.bubbles,
    bubbles = _ref$bubbles === void 0 ? true : _ref$bubbles,
    _ref$cancelable = _ref.cancelable,
    cancelable = _ref$cancelable === void 0 ? true : _ref$cancelable;
  var event = new CustomEvent(eventName, {
    detail: detail,
    bubbles: bubbles,
    cancelable: cancelable
  });
  target.dispatchEvent(event);
  return event;
}
function defer(callback) {
  setTimeout(callback, 1);
}
function unindent(strings) {
  for (var _len = arguments.length, values = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    values[_key - 1] = arguments[_key];
  }
  var lines = trimLeft(interpolate(strings, values)).split("\n");
  var match = lines[0].match(/^\s+/);
  var indent = match ? match[0].length : 0;
  return lines.map(function (line) {
    return line.slice(indent);
  }).join("\n");
}
function trimLeft(string) {
  return string.replace(/^\n/, "");
}
function interpolate(strings, values) {
  return strings.reduce(function (result, string, i) {
    var value = values[i] == undefined ? "" : values[i];
    return result + string + value;
  }, "");
}
function array(values) {
  return Array.prototype.slice.call(values);
}
function uuid() {
  return Array.apply(null, {
    length: 36
  }).map(function (_, i) {
    if (i == 8 || i == 13 || i == 18 || i == 23) {
      return "-";
    } else if (i == 14) {
      return "4";
    } else if (i == 19) {
      return (Math.floor(Math.random() * 4) + 8).toString(16);
    } else {
      return Math.floor(Math.random() * 15).toString(16);
    }
  }).join("");
}

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/util/json-parser.js"
/*!******************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/util/json-parser.js ***!
  \******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   JsonParser: () => (/* binding */ JsonParser)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// JsonParser serializes JS-syntax to JSON without using eval
var JsonParser = /*#__PURE__*/function () {
  function JsonParser() {
    _classCallCheck(this, JsonParser);
  }
  return _createClass(JsonParser, [{
    key: "parseString",
    value:
    // Private
    function parseString(str) {
      str = str.trim();
      if (!str.length) {
        throw new Error("Broken JSON object.");
      }
      var result = "";

      /*
       * the mistake ','
       */
      while (str && str[0] === ",") {
        str = str.substr(1);
      }

      /*
       * string
       */
      if (str[0] === "\"" || str[0] === "'") {
        if (str[str.length - 1] !== str[0]) {
          throw new Error("Invalid string JSON object.");
        }
        var body = "\"";
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
            body += "\"";
            return body;
          } else if (str[i] === "\"") {
            body += "\\\"";
          } else body += str[i];
        }
        throw new Error("Invalid string JSON object.");
      }

      /*
       * boolean
       */
      if (str === "true" || str === "false") {
        return str;
      }

      /*
       * null
       */
      if (str === "null") {
        return "null";
      }

      /*
       * number
       */
      var num = parseFloat(str);
      if (!isNaN(num)) {
        return num.toString();
      }

      /*
       * object
       */
      if (str[0] === "{") {
        var type = "needKey";
        var result = "{";
        for (var i = 1; i < str.length; i++) {
          if (this.isBlankChar(str[i])) {
            continue;
          } else if (type === "needKey" && (str[i] === "\"" || str[i] === "'")) {
            var key = this.parseKey(str, i + 1, str[i]);
            result += "\"" + key + "\"";
            i += key.length;
            i += 1;
            type = "afterKey";
          } else if (type === "needKey" && this.canBeKeyHead(str[i])) {
            var key = this.parseKey(str, i);
            result += "\"";
            result += key;
            result += "\"";
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

      /*
       * array
       */
      if (str[0] === "[") {
        var result = "[";
        var type = "needBody";
        for (var i = 1; i < str.length; i++) {
          if (" " === str[i] || "\n" === str[i] || "\t" === str[i]) {
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

              // deal with mistake ","
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
  }, {
    key: "parseKey",
    value: function parseKey(str, pos, quote) {
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
  }, {
    key: "getBody",
    value: function getBody(str, pos) {
      // parse string body
      if (str[pos] === "\"" || str[pos] === "'") {
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
              body: body
            };
          } else body += str[i];
        }
        throw new Error("Broken JSON string body near " + body);
      }

      // parse true / false
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

      // parse null
      if (str[pos] === "n") {
        if (str.indexOf("null", pos) === pos) {
          return {
            originLength: "null".length,
            body: "null"
          };
        }
        throw new Error("Broken JSON boolean body near " + str.substr(0, pos + 10));
      }

      // parse number
      if (str[pos] === "-" || str[pos] === "+" || str[pos] === "." || str[pos] >= "0" && str[pos] <= "9") {
        var body = "";
        for (var i = pos; i < str.length; i++) {
          if (str[i] === "-" || str[i] === "+" || str[i] === "." || str[i] >= "0" && str[i] <= "9") {
            body += str[i];
          } else {
            return {
              originLength: body.length,
              body: body
            };
          }
        }
        throw new Error("Broken JSON number body near " + body);
      }

      // parse object
      if (str[pos] === "{" || str[pos] === "[") {
        var stack = [str[pos]];
        var body = str[pos];
        for (var i = pos + 1; i < str.length; i++) {
          body += str[i];
          if (str[i] === "\\") {
            if (i + 1 < str.length) body += str[i + 1];
            i++;
          } else if (str[i] === "\"") {
            if (stack[stack.length - 1] === "\"") {
              stack.pop();
            } else if (stack[stack.length - 1] !== "'") {
              stack.push(str[i]);
            }
          } else if (str[i] === "'") {
            if (stack[stack.length - 1] === "'") {
              stack.pop();
            } else if (stack[stack.length - 1] !== "\"") {
              stack.push(str[i]);
            }
          } else if (stack[stack.length - 1] !== "\"" && stack[stack.length - 1] !== "'") {
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
              body: body
            };
          }
        }
        throw new Error("Broken JSON " + (str[pos] === "{" ? "object" : "array") + " body near " + body);
      }
      throw new Error("Broken JSON body near " + str.substr(pos - 5 >= 0 ? pos - 5 : 0, 50));
    }
  }, {
    key: "canBeKeyHead",
    value: function canBeKeyHead(ch) {
      if (ch[0] === "\\") return false;
      if (ch[0] >= 'a' && ch[0] <= 'z' || ch[0] >= 'A' && ch[0] <= 'Z' || ch[0] === '_') return true;
      if (ch[0] >= '0' && ch[0] <= '9') return true;
      if (ch[0] === '$') return true;
      if (ch.charCodeAt(0) > 255) return true;
      return false;
    }
  }, {
    key: "isBlankChar",
    value: function isBlankChar(ch) {
      return ch === " " || ch === "\n" || ch === "\t";
    }
  }], [{
    key: "paramToObj",
    value:
    // Public
    function paramToObj(name, value) {
      if (value === undefined) {
        value = '';
      }
      if (_typeof(value) === 'object') {
        return value;
      }
      if (value.charAt(0) !== '{') {
        value = "{" + value + "}";
      }
      try {
        return this.parseJSON(value);
      } catch (e) {
        throw new Error('Error parsing the ' + name + ' attribute value. ' + e);
      }
    }
  }, {
    key: "parseJSON",
    value: function parseJSON(json) {
      return JSON.parse(new JsonParser().parseString(json));
    }
  }]);
}();

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/util/promise.js"
/*!**************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/util/promise.js ***!
  \**************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cancellablePromise: () => (/* binding */ cancellablePromise),
/* harmony export */   decoratePromise: () => (/* binding */ decoratePromise),
/* harmony export */   decoratePromiseProxy: () => (/* binding */ decoratePromiseProxy)
/* harmony export */ });
// Decorate an async/function so that calling it returns a jQuery-style promise
function decoratePromiseProxy(fn) {
  var ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    // Ensure sync throws also become rejections
    var p = Promise.resolve().then(function () {
      return fn.apply(ctx, args);
    });
    return decoratePromise(p);
  };
}
function decoratePromise(promise) {
  return Object.assign(promise, {
    done: function done(fn) {
      promise.then(fn);
      return this;
    },
    fail: function fail(fn) {
      promise["catch"](fn);
      return this;
    },
    always: function always(fn) {
      promise["finally"](fn);
      return this;
    }
  });
}
function cancellablePromise(executor) {
  if (!executor) {
    executor = function executor() {};
  }
  var hasCanceled = false;
  var cancelHandler = function cancelHandler() {};
  var resolveFn, rejectFn;
  var promise = new Promise(function (resolve, reject) {
    resolveFn = resolve;
    rejectFn = reject;
    executor(function (value) {
      if (!hasCanceled) resolve(value);
    }, function (error) {
      if (!hasCanceled) reject(error);
    }, function (onCancel) {
      cancelHandler = onCancel;
    });
  });
  promise.cancel = function () {
    hasCanceled = true;
    cancelHandler();
  };
  promise.onCancel = function (fn) {
    cancelHandler = typeof fn === 'function' ? fn : cancelHandler;
    return promise;
  };
  promise.resolve = function (value) {
    if (!hasCanceled) {
      resolveFn(value);
    }
  };
  promise.reject = function (error) {
    if (!hasCanceled) {
      rejectFn(error);
    }
  };
  return decoratePromise(promise);
}

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/util/referrer.js"
/*!***************************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/util/referrer.js ***!
  \***************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getReferrerUrl: () => (/* binding */ getReferrerUrl)
/* harmony export */ });
/**
 * getReferrerUrl returns the last visited URL
 */
function getReferrerUrl() {
  var url = jax.useTurbo && jax.useTurbo() ? jax.AjaxTurbo.controller.getLastVisitUrl() : getReferrerFromSameOrigin();
  if (!url || isSameBaseUrl(url)) {
    return null;
  }
  return url;
}
function getReferrerFromSameOrigin() {
  if (!document.referrer) {
    return null;
  }

  // Fallback when turbo router is not activated
  try {
    var referrer = new URL(document.referrer);
    if (referrer.origin !== location.origin) {
      return null;
    }
    var pushReferrer = localStorage.getItem('ocPushStateReferrer');
    if (pushReferrer && pushReferrer.indexOf(referrer.pathname) === 0) {
      return pushReferrer;
    }
    return document.referrer;
  } catch (e) {}
}
function isSameBaseUrl(url) {
  var givenUrl = new URL(url, window.location.origin),
    currentUrl = new URL(window.location.href);
  return givenUrl.origin === currentUrl.origin && givenUrl.pathname === currentUrl.pathname;
}

/***/ },

/***/ "./vendor/larajax/larajax/resources/src/util/wait.js"
/*!***********************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/util/wait.js ***!
  \***********************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   domReady: () => (/* binding */ domReady),
/* harmony export */   waitFor: () => (/* binding */ waitFor)
/* harmony export */ });
/**
 * Function to wait for predicates.
 * @param {function() : Boolean} predicate - A function that returns a bool
 * @param {Number} [timeout] - Optional maximum waiting time in ms after rejected
 */
function waitFor(predicate, timeout) {
  return new Promise(function (resolve, reject) {
    var check = function check() {
      if (!predicate()) {
        return;
      }
      clearInterval(interval);
      resolve();
    };
    var interval = setInterval(check, 100);
    check();
    if (!timeout) {
      return;
    }
    setTimeout(function () {
      clearInterval(interval);
      reject();
    }, timeout);
  });
}

/**
 * Function to wait for the DOM to be ready, if not already
 */
function domReady() {
  return new Promise(function (resolve) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        return resolve();
      });
    } else {
      resolve();
    }
  });
}

/***/ },

/***/ "jquery"
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
(module) {

"use strict";
module.exports = jQuery;

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!******************************************************************!*\
  !*** ./modules/system/assets/vendor/larajax/framework-bundle.js ***!
  \******************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _vendor_larajax_larajax_resources_src_framework_bundle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../vendor/larajax/larajax/resources/src/framework-bundle */ "./vendor/larajax/larajax/resources/src/framework-bundle.js");
/* harmony import */ var _migrate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./migrate */ "./modules/system/assets/vendor/larajax/migrate.js");
/* harmony import */ var _migrate__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_migrate__WEBPACK_IMPORTED_MODULE_1__);
/**
 * --------------------------------------------------------------------------
 * Larajax: Frontend JavaScript Framework
 * https://larajax.org
 * --------------------------------------------------------------------------
 * Copyright 2025 Responsiv Pty. Ltd.
 * --------------------------------------------------------------------------
 */



})();

/******/ })()
;