/*
 * Sortable plugin, a forked version of johnny's sortable plugin. 
 *
 * Forked from: https://github.com/johnny/jquery-sortable/tree/1563f32858cfe250051ad0a573425569c49d631f
 *
 * Note: Consider using october.simplelist.js with "is-sortable" class.
 * 
 * Usage:
 *   <ol class='example'>
 *       <li>First</li>
 *       <li>Second</li>
 *       <li>Third</li>
 *   </ol>
 *   
 *   $(function () {
 *       $("ol.example").sortable()
 *   })
 *
 * Basic CSS requirements:
 *
 *  body.dragging, body.dragging * { cursor: move !important }
 *  .dragged { position: absolute; opacity: 0.5; z-index: 2000; }
 *  ol.example li.placeholder { position: relative; }
 *
 * More examples:
 *
 *   http://johnny.github.io/jquery-sortable/
 *
 */

+function ($) { "use strict";

    var eventNames,
        cursorAdjustment,
        containerDefaults = {
            drag:     true,  // Items can be dragged from this container
            drop:     true,  // Items can be droped onto this container
            exclude:  "",    // Exclude items from being draggable, if the selector matches the item
            nested:   true,  // Search for nested containers within an item
            vertical: true   // The items are assumed to be arranged vertically
        },
        groupDefaults = {
            afterMove: function ($placeholder, container, $closestEl) {},
            // The exact css path between the container and its items, e.g. "> tbody"
            containerPath: "",
            // The css selector of the containers
            containerSelector: "ol, ul",
            // Distance the mouse has to travel to start dragging
            distance: 0,
            // Time in milliseconds after mousedown until dragging should start.
            // This option can be used to prevent unwanted drags when clicking on an element.
            delay: 0,
            // The css selector of the drag handle
            handle: "",
            // The exact css path between the item and its subcontainers
            itemPath: "",
            // Use animation when an item is removed or inserted into the tree
            useAnimation : false,
            // The css selector of the items
            itemSelector: "li",
            // Check if the dragged item may be inside the container.
            // Use with care, since the search for a valid container entails a depth first search
            // and may be quite expensive.
            isValidTarget: function ($item, container) {
                return true
            },
            // Executed before onDrop if placeholder is detached.
            // This happens if pullPlaceholder is set to false and the drop occurs outside a container.
            onCancel: function ($item, container, _super, event) {
            },

            tweakCursorAdjustment: function(adjustment) {
                return adjustment
            },
            // Called after the drag has been started,
            // that is the mouse button is beeing held down and
            // the mouse is moving.
            // The container is the closest initialized container.
            // Therefore it might not be the container, that actually contains the item.
            onDragStart: function ($item, container, _super, event) {
                // Relative cursors position
                var offset = $item.offset(),
                    pointer = container.rootGroup.pointer

                if (pointer) {
                    cursorAdjustment = {
                        left: pointer.left - offset.left,
                        top: pointer.top - offset.top
                    }
                }
                else {
                    cursorAdjustment = null
                }

                cursorAdjustment = this.tweakCursorAdjustment(cursorAdjustment)

                $item.css({
                    height: $item.height(),
                    width: $item.width()
                })

                if (this.useAnimation)
                    $item.data('oc.animated', true)

                $item.addClass("dragged")
                $("body").addClass("dragging")
            },
            // Executed at the beginning of a mouse move event.
            // The Placeholder has not been moved yet.
            onDrag: function ($item, position, _super, event) {
                if (cursorAdjustment) {
                    // Relative cursors position
                    $item.css({
                      left: position.left - cursorAdjustment.left,
                      top: position.top - cursorAdjustment.top
                    })
                }
                else {
                    // Default behavior
                    $item.css(position)
                }
            },
            // Called when the mouse button is being released
            onDrop: function ($item, container, _super, event) {
                $item.removeClass("dragged").removeAttr("style")
                $("body").removeClass("dragging")

                if ($item.data('oc.animated')) {
                    $item.hide()
                    $item.slideDown(200)
                }
            },
            // Called on mousedown. If falsy value is returned, the dragging will not start.
            onMousedown: function ($item, _super, event) {
                if (event.target.nodeName != 'INPUT' && event.target.nodeName != 'SELECT') {
                    event.preventDefault()
                    return true
                }
            },
            // Template for the placeholder. Can be any valid jQuery input
            // e.g. a string, a DOM element.
            // The placeholder must have the class "placeholder"
            placeholder: '<li class="placeholder"/>',
            // If true, the position of the placeholder is calculated on every mousemove.
            // If false, it is only calculated when the mouse is above a container.
            pullPlaceholder: true,
            // Specifies serialization of the container group.
            // The pair $parent/$children is either container/items or item/subcontainers.
            // Note that this default method only works, if every item only has one subcontainer
            serialize: function ($parent, $children, parentIsContainer) {
                var result = $.extend({}, $parent.data())

                if (parentIsContainer)
                    return $children
                else if ($children[0]) {
                    result.children = $children
                    delete result.subContainer
                }

                delete result.sortable

                return result
            },
            // Set tolerance while dragging. Positive values decrease sensitivity,
            // negative values increase it.
            tolerance: 0
        },

        containerGroups = {},
        groupCounter = 0,
        emptyBox = {
            left: 0,
            top: 0,
            bottom: 0,
            right: 0
        },
        eventNames = {
            start: "touchstart.sortable mousedown.sortable",
            drop: "touchend.sortable touchcancel.sortable mouseup.sortable",
            drag: "touchmove.sortable mousemove.sortable",
            scroll: "scroll.sortable"
        }

    /*
     * a is Array [left, right, top, bottom]
     * b is array [left, top]
     */
    function d(a, b) {
        var x = Math.max(0, a[0] - b[0], b[0] - a[1]),
            y = Math.max(0, a[2] - b[1], b[1] - a[3])
        return x + y;
    }

    function setDimensions(array, dimensions, tolerance, useOffset) {
        var i = array.length,
        offsetMethod = useOffset ? "offset" : "position"
        tolerance = tolerance || 0

        while (i--) {
            var el = array[i].el ? array[i].el : $(array[i]),
                pos = el[offsetMethod]() // use fitting method
                pos.left += parseInt(el.css('margin-left'), 10)
                pos.top += parseInt(el.css('margin-top'), 10)
                dimensions[i] = [
                    pos.left - tolerance,
                    pos.left + el.outerWidth() + tolerance,
                    pos.top - tolerance,
                    pos.top + el.outerHeight() + tolerance
                ]
        }
    }

    function getRelativePosition(pointer, element) {
        var offset = element.offset()
        return {
            left: pointer.left - offset.left,
            top: pointer.top - offset.top
        }
    }

    function sortByDistanceDesc(dimensions, pointer, lastPointer) {
        pointer = [pointer.left, pointer.top]
        lastPointer = lastPointer && [lastPointer.left, lastPointer.top]

        var dim,
            i = dimensions.length,
            distances = []

        while (i--) {
            dim = dimensions[i]
            distances[i] = [i, d(dim, pointer), lastPointer && d(dim, lastPointer)]
        }
        distances = distances.sort(function (a, b) {
            return b[1] - a[1] || b[2] - a[2] || b[0] - a[0]
        })

        return distances // last entry is the closest
    }

    function ContainerGroup(options) {
        this.options = $.extend({}, groupDefaults, options)
        this.containers = []

        if (!this.options.parentContainer) {
            this.scrollProxy = $.proxy(this.scroll, this)
            this.dragProxy = $.proxy(this.drag, this)
            this.dropProxy = $.proxy(this.drop, this)
            this.placeholder = $(this.options.placeholder)

            if (!options.isValidTarget)
                this.options.isValidTarget = undefined
        }
    }

    ContainerGroup.get = function (options) {
        if (!containerGroups[options.group]) {
            if (!options.group)
                options.group = groupCounter++

            containerGroups[options.group] = new ContainerGroup(options)
        }
        return containerGroups[options.group]
    }

    ContainerGroup.prototype = {
        dragInit: function (e, itemContainer) {
            this.$document = $(itemContainer.el[0].ownerDocument)

            if (itemContainer.enabled()) {
                // get item to drag
                this.item = $(e.target).closest(this.options.itemSelector)
                this.itemContainer = itemContainer

                if (this.item.is(this.options.exclude) ||
                    !this.options.onMousedown(this.item, groupDefaults.onMousedown, e)){
                    return
                }

                this.setPointer(e)
                this.toggleListeners('on')

            } else {
                this.toggleListeners('on', ['drop'])
            }

            this.setupDelayTimer()
            this.dragInitDone = true
        },
        drag: function (e) {
            if (!this.dragging) {

                if (!this.distanceMet(e) || !this.delayMet) {
                    return
                }

                this.options.onDragStart(this.item, this.itemContainer, groupDefaults.onDragStart, e)
                this.item.before(this.placeholder)
                this.dragging = true
            }

            this.setPointer(e)
            // Place item under the cursor
            this.options.onDrag(this.item,
                                getRelativePosition(this.pointer, this.item.offsetParent()),
                                groupDefaults.onDrag,
                                e)

            var x = e.pageX || e.originalEvent.pageX,
                y = e.pageY || e.originalEvent.pageY,
                box = this.sameResultBox,
                t = this.options.tolerance

            if (!box || box.top - t > y || box.bottom + t < y || box.left - t > x || box.right + t < x) {
                if (!this.searchValidTarget()) this.placeholder.detach()
            }
        },
        drop: function (e) {
            this.toggleListeners('off')

            this.dragInitDone = false

            if (this.dragging) {
                // processing Drop, check if placeholder is detached
                if (this.placeholder.closest("html")[0])
                    this.placeholder.before(this.item).detach()
                else
                    this.options.onCancel(this.item, this.itemContainer, groupDefaults.onCancel, e)

                this.options.onDrop(this.item, this.getContainer(this.item), groupDefaults.onDrop, e)

                // cleanup
                this.clearDimensions()
                this.clearOffsetParent()
                this.lastAppendedItem = this.sameResultBox = undefined
                this.dragging = false
            }
        },
        searchValidTarget: function (pointer, lastPointer) {
            if (!pointer) {
                pointer = this.relativePointer || this.pointer
                lastPointer = this.lastRelativePointer || this.lastPointer
            }

            var distances = sortByDistanceDesc(this.getContainerDimensions(), pointer, lastPointer),
                i = distances.length

            while (i--) {
                var index = distances[i][0],
                    distance = distances[i][1]

                if (!distance || this.options.pullPlaceholder) {
                    var container = this.containers[index]
                    if (!container.disabled) {
                        if (!this.$getOffsetParent()) {
                            var offsetParent = container.getItemOffsetParent()
                                pointer = getRelativePosition(pointer, offsetParent)
                                lastPointer = getRelativePosition(lastPointer, offsetParent)
                        }
                        if (container.searchValidTarget(pointer, lastPointer))
                            return true
                    }
                }
            }
            if (this.sameResultBox)
                this.sameResultBox = undefined
        },
        movePlaceholder: function (container, item, method, sameResultBox) {
            var lastAppendedItem = this.lastAppendedItem
            if (!sameResultBox && lastAppendedItem && lastAppendedItem[0] === item[0])
                return;

            item[method](this.placeholder)
            this.lastAppendedItem = item
            this.sameResultBox = sameResultBox
            this.options.afterMove(this.placeholder, container, item)
        },
        getContainerDimensions: function () {
            if (!this.containerDimensions)
                setDimensions(this.containers, this.containerDimensions = [], this.options.tolerance, !this.$getOffsetParent())

            return this.containerDimensions
        },
        getContainer: function (element) {
            return element.closest(this.options.containerSelector).data('oc.sortable')
        },
        $getOffsetParent: function () {
            if (this.offsetParent === undefined) {
                var i = this.containers.length - 1,
                offsetParent = this.containers[i].getItemOffsetParent()

                if (!this.options.parentContainer) {
                    while (i--) {
                        if (offsetParent[0] != this.containers[i].getItemOffsetParent()[0]) {
                            // If every container has the same offset parent,
                            // use position() which is relative to this parent,
                            // otherwise use offset()
                            // compare #setDimensions
                            offsetParent = false
                            break;
                        }
                    }
                }

                this.offsetParent = offsetParent
            }
            return this.offsetParent
        },
        setPointer: function (e) {
            var pointer = this.getPointer(e)

            if (this.$getOffsetParent()) {
                var relativePointer = getRelativePosition(pointer, this.$getOffsetParent())
                this.lastRelativePointer = this.relativePointer
                this.relativePointer = relativePointer
            }

            this.lastPointer = this.pointer
            this.pointer = pointer
        },
        distanceMet: function (e) {
            var currentPointer = this.getPointer(e)
            return (Math.max(
                Math.abs(this.pointer.left - currentPointer.left),
                Math.abs(this.pointer.top - currentPointer.top)
            ) >= this.options.distance)
        },
        getPointer: function(e) {
            return {
                left: e.pageX || e.originalEvent.pageX,
                top: e.pageY || e.originalEvent.pageY
            }
        },
        setupDelayTimer: function () {
            var self = this
            this.delayMet = !this.options.delay

            if (!this.delayMet) {
                clearTimeout(this._mouseDelayTimer);
                this._mouseDelayTimer = setTimeout(function() {
                    self.delayMet = true
                }, this.options.delay)
            }
        },
        scroll: function (e) {
            this.clearDimensions()
            this.clearOffsetParent()
        },
        toggleListeners: function (method, events) {
            var self = this
            events = events || ['drag', 'drop', 'scroll']
            $.each(events, function (i, event) {

                self.$document[method](eventNames[event], self[event + 'Proxy'])
            })
        },
        clearOffsetParent: function () {
            this.offsetParent = undefined
        },
        // Recursively clear container and item dimensions
        clearDimensions: function () {
            this.containerDimensions = undefined
            var i = this.containers.length
            while (i--) {
                this.containers[i].clearDimensions()
            }
        },
        destroy: function () {
            // TODO iterate over subgroups and destroy them
            // TODO remove all events

            containerGroups[this.options.group] = undefined
/*

            if (!this.options) {
                return
            }

            var group = this.options.group
            containerGroups[group].options = null
            containerGroups[group] = undefined
            for (var i in containerGroups) {
                if (containerGroups[i]) {
                    containerGroups[i] = undefined
                }
            }
*/
        }
    }

    /*************************************************************************/

    function Container(element, options) {
        this.el = element
        this.options = $.extend({}, containerDefaults, options)

        this.group = ContainerGroup.get(this.options)
        this.rootGroup = this.options.rootGroup || this.group
        this.parentContainer = this.options.parentContainer
        this.handle = this.rootGroup.options.handle || this.rootGroup.options.itemSelector

        var itemPath = this.rootGroup.options.itemPath,
        target = itemPath ? this.el.find(itemPath) : this.el

        //Start-Event binden
        target.on(eventNames.start, this.handle, $.proxy(this.dragInit, this))

        if (this.options.drop) {
            this.group.containers.push(this)
        }
    }

    Container.prototype = {
        dragInit: function (e) {
            var rootGroup = this.rootGroup

            if (!rootGroup.dragInitDone && this.options.drag) {
                rootGroup.dragInit(e, this)
            }
        },
        searchValidTarget: function (pointer, lastPointer) {
            var distances = sortByDistanceDesc(this.getItemDimensions(), pointer, lastPointer),
                i = distances.length,
                rootGroup = this.rootGroup,
                validTarget = !rootGroup.options.isValidTarget || rootGroup.options.isValidTarget(rootGroup.item, this)

            if (!i && validTarget) {
                var itemPath = this.rootGroup.options.itemPath,
                target = itemPath ? this.el.find(itemPath) : this.el

                rootGroup.movePlaceholder(this, target, "append")
                return true
            } else {
                while (i--) {
                    var index = distances[i][0],
                    distance = distances[i][1]
                    if (!distance && this.hasChildGroup(index)) {
                        var found = this.getContainerGroup(index).searchValidTarget(pointer, lastPointer)
                        if (found)
                            return true
                    }
                    else if (validTarget) {
                        this.movePlaceholder(index, pointer)
                        return true
                    }
                }
            }
        },
        movePlaceholder: function (index, pointer) {
            var item = $(this.items[index]),
                dim = this.itemDimensions[index],
                method = "after",
                width = item.outerWidth(),
                height = item.outerHeight(),
                offset = item.offset(),
                sameResultBox = {
                    left: offset.left,
                    right: offset.left + width,
                    top: offset.top,
                    bottom: offset.top + height
                }

            if (this.options.vertical) {
                var yCenter = (dim[2] + dim[3]) / 2,
                inUpperHalf = pointer.top <= yCenter
                if (inUpperHalf) {
                    method = "before"
                    sameResultBox.bottom -= height / 2
                } else {
                    sameResultBox.top += height / 2
                }
            } else {
                var xCenter = (dim[0] + dim[1]) / 2,
                inLeftHalf = pointer.left <= xCenter
                if (inLeftHalf) {
                    method = "before"
                    sameResultBox.right -= width / 2
                } else {
                    sameResultBox.left += width / 2
                }
            }
            if (this.hasChildGroup(index)) {
                sameResultBox = emptyBox
            }

            this.rootGroup.movePlaceholder(this, item, method, sameResultBox)
        },
        getItemDimensions: function () {
            if (!this.itemDimensions) {
                this.items = this.$getChildren(this.el, "item").filter(":not(.placeholder, .dragged)").get()
                setDimensions(this.items, this.itemDimensions = [], this.options.tolerance)
            }
            return this.itemDimensions
        },
        getItemOffsetParent: function () {
            var offsetParent,
                el = this.el
            // Since el might be empty we have to check el itself and
            // can not do something like el.children().first().offsetParent()
            if (el.css("position") === "relative" || el.css("position") === "absolute" || el.css("position") === "fixed")
                offsetParent = el
            else
                offsetParent = el.offsetParent()
            return offsetParent
        },
        hasChildGroup: function (index) {
            return this.options.nested && this.getContainerGroup(index)
        },
        getContainerGroup: function (index) {
            var childGroup = $.data(this.items[index], "subContainer")
            if (childGroup === undefined) {
                var childContainers = this.$getChildren(this.items[index], "container")
                childGroup = false

                if (childContainers[0]) {
                    var options = $.extend({}, this.options, {
                        parentContainer: this,
                        rootGroup: this.rootGroup,
                        group: groupCounter++
                    })
                    childGroup = childContainers.sortable(options).data('oc.sortable').group
                }
                $.data(this.items[index], "subContainer", childGroup)
            }
            return childGroup
        },
        enabled: function () {
            return !this.disabled && (!this.parentContainer || this.parentContainer.enabled())
        },
        $getChildren: function (parent, type) {
            var options = this.rootGroup.options,
            path = options[type + "Path"],
            selector = options[type + "Selector"]

            parent = $(parent)
            if (path)
                parent = parent.find(path)

            return parent.children(selector)
        },
        _serialize: function (parent, isContainer) {
            var self = this,
            childType = isContainer ? "item" : "container",

            children = this.$getChildren(parent, childType).not(this.options.exclude).map(function () {
                return self._serialize($(this), !isContainer)
            }).get()

            return this.rootGroup.options.serialize(parent, children, isContainer)
        },
        clearDimensions: function () {
            this.itemDimensions = undefined
            if (this.items && this.items[0]) {
                var i = this.items.length
                while (i--) {
                    var group = $.data(this.items[i], "subContainer")
                    if (group)
                        group.clearDimensions()
                }
            }
        }
    }

    var API = {
        enable: function (ignoreChildren) {
            this.disabled = false
        },
        disable: function (ignoreChildren) {
            this.disabled = true
        },
        serialize: function () {
            return this._serialize(this.el, true)
        },
        destroy: function () {
            this.rootGroup.destroy()
            $(this.el).data('oc.sortable')
        }
    }

    $.extend(Container.prototype, API)

    // SORTABLE PLUGIN DEFINITION
    // ============================

    var old = $.fn.sortable

    $.fn.sortable = function (option) {
        var args = Array.prototype.slice.call(arguments, 1)

        return this.map(function () {
            var $this = $(this),
                object = $this.data('oc.sortable')

            if (object && API[option])
                return API[option].apply(object, args) || this
            else if (!object && (option === undefined ||typeof option === "object")) {
                $this.data('oc.sortable', new Container($this, option))
            }

            return this
        });
    };

    // SORTABLE NO CONFLICT
    // =================

    $.fn.sortable.noConflict = function () {
        $.fn.sortable = old
        return this
    }

}(window.jQuery);

/* ===================================================
 *  jquery-sortable.js v0.9.12
 *  http://johnny.github.com/jquery-sortable/
 * ===================================================
 *  Copyright (c) 2012 Jonas von Andrian
 *  All rights reserved.
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions are met:
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *  * The name of the author may not be used to endorse or promote products
 *    derived from this software without specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 *  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 *  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 *  DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 *  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 *  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 *  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 *  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 *  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * ========================================================== */