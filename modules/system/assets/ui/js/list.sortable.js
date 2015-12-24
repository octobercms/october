/*
 * Sortable plugin.
 * 
 * Status: experimental. The behavior is not perfect, but it's OK in terms of memory
 * usage and disposing.
 *
 * This is a lightweight, October-style implementation of the drag & drop sorting
 * functionality. The plugin uses only HTML5 Drag&Drop feature and completely
 * disposable.
 *
 * During the dragging the plugin creates a placeholder element, which should be 
 * styled separately.
 *
 * Draggable elements should be marked with "draggable" HTML5 attribute.
 *
 * Current / planned features:
 *
 * [x] Sorting a single list.
 * [ ] Dragging items between multiple lists.
 * [ ] Sorting nested lists.
 
 * JAVASCRIPT API
 *
 * $('#list').listSortable({})
 *
 * DATA ATTRIBUTES API
 *
 * In the simplest case the plugin can be initialized like this:
 * <ul data-control="list-sortable">
 *     <li draggable="true">...</li>
 *
 * Multiple lists will not support this option and the plugin should be created 
 * and updated by a caller code.
 *
 * Options:
 * - handle: optional selector for a drag handle element. Also available as data-handle attribute.
 * - direction: direction of the list - horizontal or vertical. Also available as data-direction attribute. Default is vertical.
 *
 * Events:
 * - dragged.list.sortable - triggered on a list element after it was moved
 */

+function ($) { "use strict";
    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype,
        listSortableIdCounter = 0,
        elementsIdCounter = 0

    var ListSortable = function (element, options) {
        this.lists = []
        this.options = options
        this.listSortableId = null
        this.lastMousePosition = null

        Base.call(this)

        $.oc.foundation.controlUtils.markDisposable(element)
        this.init()

        this.addList(element)
    }

    ListSortable.prototype = Object.create(BaseProto)
    ListSortable.prototype.constructor = ListSortable

    ListSortable.prototype.init = function () {
        listSortableIdCounter++

        this.listSortableId = 'listsortable/id/' + listSortableIdCounter
    }

    ListSortable.prototype.addList = function(list) {
        this.lists.push(list)
        this.registerListHandlers(list)

        if (this.lists.length == 1) {
            $(list).one('dispose-control', this.proxy(this.dispose))
        }
    }

    //
    // Event management
    //

    ListSortable.prototype.registerListHandlers = function(list) {
        var $list = $(list)

        $list.on('dragstart', '> li', this.proxy(this.onDragStart))
        $list.on('dragover', '> li', this.proxy(this.onDragOver))
        $list.on('dragenter', '> li', this.proxy(this.onDragEnter))
        $list.on('dragleave', '> li', this.proxy(this.onDragLeave))
        $list.on('drop', '> li', this.proxy(this.onDragDrop))
        $list.on('dragend', '> li', this.proxy(this.onDragEnd))
    }

    ListSortable.prototype.unregisterListHandlers = function(list) {
        $list.off('dragstart', '> li', this.proxy(this.onDragStart))
        $list.off('dragover', '> li', this.proxy(this.onDragOver))
        $list.off('dragenter', '> li', this.proxy(this.onDragEnter))
        $list.off('dragleave', '> li', this.proxy(this.onDragLeave))
        $list.off('drop', '> li', this.proxy(this.onDragDrop))
        $list.off('dragend', '> li', this.proxy(this.onDragEnd))
    }

    ListSortable.prototype.unregisterHandlers = function() {
        $(document).off('dragover', this.proxy(this.onDocumentDragOver))
        $(document).off('mousemove', this.proxy(this.onDocumentMouseMove))
        $(this.lists[0]).off('dispose-control', this.proxy(this.dispose))
    }

    //
    // Disposing
    //

    ListSortable.prototype.unbindLists = function() {
        for (var i=this.lists.length-1; i>0; i--) {
            var list = this.lists[i]

            this.unregisterListHandlers(this.lists[i])
            $(list).removeData('oc.listSortable')
        }
    }

    ListSortable.prototype.dispose = function() {
        this.unbindLists()
        this.unregisterHandlers()

        this.options = null
        this.lists = []

        BaseProto.dispose.call(this)
    }

    //
    // Internal helpers
    //

    ListSortable.prototype.elementBelongsToManagedList = function(element) {
        for (var i=this.lists.length-1; i >= 0; i--) {
            var list = this.lists[i],
                children = [].slice.call(list.children) // Converts HTMLCollection to array

            if (children.indexOf(element) !== -1) {
                return true
            }
        }

        return false
    }

    ListSortable.prototype.isDragStartAllowed = function(element) {
        // TODO: if handle selector is specified - test if 
        // the element is a handle.

        return true
    }

    ListSortable.prototype.elementIsPlaceholder = function(element) {
        return element.getAttribute('class') === 'list-sortable-placeholder'
    }

    ListSortable.prototype.getElementSortableId = function(element) {
        if (element.hasAttribute('data-list-sortable-element-id')) {
            return element.getAttribute('data-list-sortable-element-id')
        }

        elementsIdCounter++
        var elementId = elementsIdCounter

        element.setAttribute('data-list-sortable-element-id', elementsIdCounter)

        return elementsIdCounter
    }

    ListSortable.prototype.dataTransferContains = function(ev, element) {
        if (ev.dataTransfer.types.indexOf !== undefined){
            return ev.dataTransfer.types.indexOf(element) >= 0
        }

        return ev.dataTransfer.types.contains(element)
    }

    ListSortable.prototype.isSourceManagedList = function(ev) {
        return this.dataTransferContains(ev, this.listSortableId)
    }

    ListSortable.prototype.removePlaceholders = function() {
        for (var i=this.lists.length-1; i >= 0; i--) {
            var list = this.lists[i], 
                placeholders = list.querySelectorAll('.list-sortable-placeholder')

            for (var j=placeholders.length-1; j >= 0; j--) {
                list.removeChild(placeholders[j])
            }
        }
    }

    ListSortable.prototype.createPlaceholder = function(element, ev) {
        var placeholder = document.createElement('li'),
            placement = this.getPlaceholderPlacement(element, ev)

        this.removePlaceholders()

        placeholder.setAttribute('class', 'list-sortable-placeholder')
        placeholder.setAttribute('draggable', true)

        if (placement == 'before') {
            element.parentNode.insertBefore(placeholder, element)
        }
        else {
            element.parentNode.insertBefore(placeholder, element.nextSibling)
        }
    }

    ListSortable.prototype.moveElement = function(target, ev) {
        var list = target.parentNode,
            placeholder = list.querySelector('.list-sortable-placeholder')

        if (!placeholder) {
            return
        }

        var elementId = ev.dataTransfer.getData('listsortable/elementid')
        if (!elementId) {
            return
        }

        var item = this.findDraggedItem(elementId)
        if (!item) {
            return
        }

        placeholder.parentNode.insertBefore(item, placeholder)
        $(item).trigger('dragged.list.sortable')
    }

    ListSortable.prototype.findDraggedItem = function(elementId) {
        for (var i=this.lists.length-1; i >= 0; i--) {
            var list = this.lists[i],
                item = list.querySelector('[data-list-sortable-element-id="'+elementId+'"]')

            if (item) {
                return item
            }
        }

        return null
    }

    ListSortable.prototype.getPlaceholderPlacement = function(hoverElement, ev) {
        var mousePosition = $.oc.foundation.event.pageCoordinates(ev),
            elementPosition = $.oc.foundation.element.absolutePosition(hoverElement)

        if (this.options.direction == 'vertical') {
            var elementCenter = elementPosition.top + hoverElement.offsetHeight/2

            return mousePosition.y <= elementCenter ? 'before' : 'after'
        }
        else {
            var elementCenter = elementPosition.left + hoverElement.offsetWidth/2

            return mousePosition.x <= elementCenter ? 'before' : 'after'
        }
    }

    ListSortable.prototype.lastMousePositionChanged = function(ev) {
        var mousePosition = $.oc.foundation.event.pageCoordinates(ev.originalEvent)

        if (this.lastMousePosition === null || this.lastMousePosition.x != mousePosition.x || this.lastMousePosition.y != mousePosition.y) {
            this.lastMousePosition = mousePosition
            return true
        }

        return false
    }

    ListSortable.prototype.mouseOutsideLists = function(ev) {
        var mousePosition = $.oc.foundation.event.pageCoordinates(ev)

        for (var i=this.lists.length-1; i >= 0; i--) {
            if ($.oc.foundation.element.elementContainsPoint(this.lists[i], mousePosition)) {
                return false
            }
        }

        return true
    }

    ListSortable.prototype.getClosestDraggableParent = function(element) {
        var current = element

        while (current) {
            if (current.tagName === 'LI' && current.hasAttribute('draggable') ) {
                return current
            }

            current = current.parentNode
        }

        return null
    }

    // EVENT HANDLERS
    // ============================

    ListSortable.prototype.onDragStart = function(ev) {
        if (!this.isDragStartAllowed(ev.target)) {
            return
        }

        ev.originalEvent.dataTransfer.effectAllowed = 'move'
        ev.originalEvent.dataTransfer.setData('listsortable/elementid', this.getElementSortableId(ev.target))
        ev.originalEvent.dataTransfer.setData(this.listSortableId, this.listSortableId)

        // The mousemove handler is used to remove the placeholder
        // when the drag is canceled with Escape button. We can't use
        // the dragend for removing the placeholders because dragend
        // is triggered before drop, but we need placeholder to exists
        // in the drop handler.
        // 
        // Mouse events are suppressed during the drag and drop operations,
        // so we only need to handle it once (but we still must the handler 
        // explicitly).
        $(document).on('mousemove', this.proxy(this.onDocumentMouseMove))

        // The dragover handler is used to hide the placeholder when
        // the mouse is outside of any known list.
        $(document).on('dragover', this.proxy(this.onDocumentDragOver))
    }

    ListSortable.prototype.onDragOver = function(ev) {
        if (!this.isSourceManagedList(ev.originalEvent)) {
            return
        }

        var draggable = this.getClosestDraggableParent(ev.target)
        if (!draggable) {
            return
        }

        if (!this.elementIsPlaceholder(draggable) && this.lastMousePositionChanged(ev)) {
            this.createPlaceholder(draggable, ev.originalEvent)
        }

        ev.stopPropagation()
        ev.preventDefault()
        ev.originalEvent.dataTransfer.dropEffect = 'move'
    }

    ListSortable.prototype.onDragEnter = function(ev) {
        if (!this.isSourceManagedList(ev.originalEvent)) {
            return
        }

        var draggable = this.getClosestDraggableParent(ev.target)
        if (!draggable) {
            return
        }

        if (this.elementIsPlaceholder(draggable)) {
            return
        }

        this.createPlaceholder(draggable, ev.originalEvent)
        ev.stopPropagation()
        ev.preventDefault()
    }

    ListSortable.prototype.onDragLeave = function(ev) {
        if (!this.isSourceManagedList(ev.originalEvent)) {
            return
        }

        ev.stopPropagation()
        ev.preventDefault()
    }

    ListSortable.prototype.onDragDrop = function(ev) {
        if (!this.isSourceManagedList(ev.originalEvent)) {
            return
        }

        var draggable = this.getClosestDraggableParent(ev.target)
        if (!draggable) {
            return
        }

        this.moveElement(draggable, ev.originalEvent)

        this.removePlaceholders()
    }

    ListSortable.prototype.onDragEnd = function(ev) {
        $(document).off('dragover', this.proxy(this.onDocumentDragOver))
    }

    ListSortable.prototype.onDocumentDragOver = function(ev) {
        if (!this.isSourceManagedList(ev.originalEvent)) {
            return
        }

        if (this.mouseOutsideLists(ev.originalEvent)) {
            this.removePlaceholders()
            return
        }
    }

    ListSortable.prototype.onDocumentMouseMove = function(ev) {
        $(document).off('mousemove', this.proxy(this.onDocumentMouseMove))
        this.removePlaceholders()
    }


    // PLUGIN DEFINITION
    // ============================

    ListSortable.DEFAULTS = {
        handle: null,
        direction: 'vertical'
    }

    var old = $.fn.listSortable

    $.fn.listSortable = function (option) {
        var args = arguments

        return this.each(function () {
            var $this = $(this),
                data  = $this.data('oc.listSortable'),
                options = $.extend({}, ListSortable.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) {
                $this.data('oc.listSortable', (data = new ListSortable(this, options)))
            }

            if (typeof option == 'string' && data) { 
                if (data[option]) {
                    var methodArguments = Array.prototype.slice.call(args) // Clone the arguments array
                    methodArguments.shift()

                    data[option].apply(data, methodArguments)
                }
            }
        })
      }

    $.fn.listSortable.Constructor = ListSortable

    // LISTSORTABLE NO CONFLICT
    // =================

    $.fn.listSortable.noConflict = function () {
        $.fn.listSortable = old
        return this
    }

    $(document).render(function(){
        $('[data-control=list-sortable]').listSortable()
    })

}(window.jQuery);