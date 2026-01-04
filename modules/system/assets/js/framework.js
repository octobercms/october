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

/***/ "./vendor/larajax/larajax/resources/src/framework.js"
/*!***********************************************************!*\
  !*** ./vendor/larajax/larajax/resources/src/framework.js ***!
  \***********************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_namespace__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/namespace */ "./vendor/larajax/larajax/resources/src/core/namespace.js");
/* harmony import */ var _request_namespace__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./request/namespace */ "./vendor/larajax/larajax/resources/src/request/namespace.js");
/* harmony import */ var _request_asset_manager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./request/asset-manager */ "./vendor/larajax/larajax/resources/src/request/asset-manager.js");
/* harmony import */ var _util_events__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util/events */ "./vendor/larajax/larajax/resources/src/util/events.js");
/* harmony import */ var _util_wait__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./util/wait */ "./vendor/larajax/larajax/resources/src/util/wait.js");
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
window.jax.AssetManager = _request_asset_manager__WEBPACK_IMPORTED_MODULE_2__.AssetManager;
window.jax.ajax = _request_namespace__WEBPACK_IMPORTED_MODULE_1__["default"].send;

// Core
window.jax.AjaxFramework = _core_namespace__WEBPACK_IMPORTED_MODULE_0__["default"];
window.jax.request = _core_namespace__WEBPACK_IMPORTED_MODULE_0__["default"].requestElement;
window.jax.parseJSON = _core_namespace__WEBPACK_IMPORTED_MODULE_0__["default"].parseJSON;
window.jax.values = _core_namespace__WEBPACK_IMPORTED_MODULE_0__["default"].serializeAsJSON;

// Util
window.jax.Events = _util_events__WEBPACK_IMPORTED_MODULE_3__.Events;
window.jax.dispatch = _util_events__WEBPACK_IMPORTED_MODULE_3__.Events.dispatch;
window.jax.trigger = _util_events__WEBPACK_IMPORTED_MODULE_3__.Events.trigger;
window.jax.on = _util_events__WEBPACK_IMPORTED_MODULE_3__.Events.on;
window.jax.off = _util_events__WEBPACK_IMPORTED_MODULE_3__.Events.off;
window.jax.one = _util_events__WEBPACK_IMPORTED_MODULE_3__.Events.one;
window.jax.waitFor = _util_wait__WEBPACK_IMPORTED_MODULE_4__.waitFor;
window.jax.pageReady = _util_wait__WEBPACK_IMPORTED_MODULE_4__.domReady;

// Fallback for turbo
window.jax.visit = function (url) {
  return window.location.assign(url);
};

// Auto-start
_core_namespace__WEBPACK_IMPORTED_MODULE_0__["default"].start();

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
/*!***********************************************************!*\
  !*** ./modules/system/assets/vendor/larajax/framework.js ***!
  \***********************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _vendor_larajax_larajax_resources_src_framework__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../vendor/larajax/larajax/resources/src/framework */ "./vendor/larajax/larajax/resources/src/framework.js");
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