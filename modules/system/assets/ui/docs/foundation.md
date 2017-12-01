# Foundation

The foundation libraries are the core base of all scripts and controls. The goals of this library are:

- Well structured and readable code.
- Don't leave references to DOM elements.
- Unbind all event handlers.
- Write high-performance code (in cases when it's needed).

That's especially important on pages where users spend much time interacting with the page, like the CMS and Pages sections, but all back-end controls should follow these rules, because we never know when they are used.

## Why it's important to release the memory, DOM references and event handlers

A typical JavaScript control class instance consists of the following parts:

1. JavaScript object representing the control.
1. A reference to the corresponding DOM element. Usually it's the control's root element containing a tree with the control HTML markup.
1. A number of event handlers to handle user's interaction with the control.

If any of that components are not released we have these problems:

1. Non-released JavaScript objects increase the memory footprint. The more memory the application uses, the slower it works. Eventually it could result in a crashed tab or entire browser.
1. Non-released references to DOM elements could result in detached DOM trees. That, in turn, could result in thousands of invisible DOM elements living in a page, increasing the memory footprint and making the application less responsive.
1. Unbound event handlers usually result in non-released DOM elements, which is bad by itself, and also in the code which executes when the user interacts with the application and which should not be executed. That affects the performance.

## This is how to deal with those problems:

1. Remove the JavaScript object - usually by removing the data from the control's root element: `this.$el.removeData('oc.myControl')`
Clean all references to DOM elements. Usually it's done by assigning NULL to corresponding object properties.
1. Watch for any references caught by closures (or - better do not use closures, see below).
1. Unbind event handlers.

October Storm provides everything we need to meet the goals. Please read on to learn more!

## How to write quality code

OOP approach and prototypes should be used in all places. This approach automatically deals with closures that could retain references to scope variables. Typical class code template:

```js
function ($) { "use strict";
    var SomeClass = function() {
        this.init()
    }

    SomeClass.prototype.init = function (){
        ...
    }
}
```

## Basics of writing disposable classes

If a class should be disposable (all UI controls should be disposable), the class should extend `$.oc.foundation.base` class. That class has two useful methods: `proxy(method)` and `dispose()`.

`proxy()` method is an alternative to jQuery's `$.proxy`, but as `$.oc.foundation.base` implements OOP approach, passing this parameter to the method is not required. This method is good for three reasons.

1. It's code is very simple and easily controllable and debuggable.
1. It caches bound functions and doesn't create new function as `$.proxy` does.
1. It automatically removes all cached bound functions when the object is disposed with dispose() method.

`dispose()` method in the base class cleans up bound methods cached by `proxy()` method and provides a common API for disposing objects. All classes that are supposed to do clean-up work, should override that method, do their own clean-up and call the base `dispose()` method.

Example of a disposable class:

```js
+function ($) { "use strict";
    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var SomeDisposableClass = function(element) {
        this.$el = $(element)

        Base.call(this)
        this.init()
    }

    SomeDisposableClass.prototype = Object.create(BaseProto)
    SomeDisposableClass.prototype.constructor = SomeDisposableClass

    SomeDisposableClass.prototype.init = function () {
    }

    SomeDisposableClass.prototype.dispose = function () {
        this.$el = null
        BaseProto.dispose.call(this)
    }
}
```

A couple of important things to note:

1. The class constructor should call Base.call(this).
1. The class prototype should be replaced with a copy of the Base class prototype, and its constructor reference should be restored back to the class constructor. It should be done right after the class constructor and before any method is defined in the class prototype.

## Binding and unbinding events

When binding events, use this.proxy() to make references to event handlers. Always unbind events in dispose() method:

```js
+function ($) { "use strict";
    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var SomeDisposableClass = function(element) {
        this.$el = $(element)

        Base.call(this)
        this.init()
    }

    [...]

    SomeDisposableClass.prototype.init = function () {
        this.$el.on('click', this.proxy(this.onClick))
    }

    SomeDisposableClass.prototype.dispose = function () {
        this.$el.off('click', this.proxy(this.onClick))
        this.$el = null
        BaseProto.dispose.call(this)
    }
}
```

## Making disposable controls

UI controls should support two ways of disposing - with calling their `dispose()` method and with invoking the dispose-control handler. Also, disposable controls should mark their corresponding DOM elements as disposable, with October foundation API. Example:

```js
+function ($) { "use strict";
    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var SomeDisposableControl = function(element) {
        this.$el = $(element)

        $.oc.foundation.controlUtils.markDisposable(element)
        Base.call(this)
        this.init()
    }

    ...

    SomeDisposableControl.prototype.init = function () {
        this.$el.one('dispose-control', this.proxy(this.dispose))
    }

    SomeDisposableControl.prototype.dispose = function () {
        this.$el.off('dispose-control', this.proxy(this.dispose))
        this.$el = null
        BaseProto.dispose.call(this)
    }
}
```

`$.oc.foundation.controlUtils.markDisposable(element)` call in the constructor adds `data-disposable` attribute to the DOM element, allowing the framework to find all disposable elements in a container and dispose them by calling their dispose-control handler when it's required.

## Full example of a jQuery plugin that creates a disposable control

We already have a boilerplate code for jQuery code. Disposable controls approach just extends it. Don't forget to remove the  data associated with controls from their DOM elements.

```js
+function ($) { "use strict";
    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var SomeDisposableControl = function (element, options) {
        this.$el = $(element)
        this.options = options || {}

        $.oc.foundation.controlUtils.markDisposable(element)
        Base.call(this)
        this.init()
    }

    SomeDisposableControl.prototype = Object.create(BaseProto)
    SomeDisposableControl.prototype.constructor = SomeDisposableControl

    SomeDisposableControl.prototype.init = function() {
        this.$el.on('click', this.proxy(this.onClick))
        this.$el.one('dispose-control', this.proxy(this.dispose))
    }

    SomeDisposableControl.prototype.dispose = function() {
        this.$el.off('click', this.proxy(this.onClick))
        this.$el.off('dispose-control', this.proxy(this.dispose))
        this.$el.removeData('oc.someDisposableControl')

        this.$el = null

        // In some cases options could contain callbacks, 
        // so it's better to clean them up too.
        this.options = null

        BaseProto.dispose.call(this)
    }

    SomeDisposableControl.DEFAULTS = {
        someParam: null
    }

    // PLUGIN DEFINITION
    // ============================

    var old = $.fn.someDisposableControl

    $.fn.someDisposableControl = function (option) {
        var args = Array.prototype.slice.call(arguments, 1), items, result

        items = this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.someDisposableControl')
            var options = $.extend({}, SomeDisposableControl.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.someDisposableControl', (data = new SomeDisposableControl(this, options)))
            if (typeof option == 'string') result = data[option].apply(data, args)
            if (typeof result != 'undefined') return false
        })

        return result ? result : items
    }

    $.fn.someDisposableControl.Constructor = SomeDisposableControl

    $.fn.someDisposableControl.noConflict = function () {
        $.fn.someDisposableControl = old
        return this
    }

    // Add this only if required
    $(document).render(function (){
        $('[data-some-disposable-control]').someDisposableControl()
    })

}(window.jQuery);
```