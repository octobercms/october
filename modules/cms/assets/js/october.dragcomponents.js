/*
 * DragComponents plugin
 * 
 * Data attributes:
 * - data-control="dragcomponents" - enables the plugin on an element
 * - data-option="value" - an option with a value
 *
 * JavaScript API:
 * $('a#someElement').dragComponents({ option: 'value' })
 *
 * Dependences: 
 * - Some other plugin (filename.js)
 */

+function ($) { "use strict";

    // DRAGCOMPONENTS CLASS DEFINITION
    // ============================

    var DragComponents = function(element, options) {
        var self       = this
        this.options   = options
        this.$el       = $(element)

        var $el = this.$el,
            $clone,
            $editorArea,
            $editor,
            $componentList,
            adjX = 0,
            adjY = 0,
            dragging = false,
            startPos,
            editorPos

        $el.mousedown(function(event){
            if ($el.data('component-attached')) return

            startDrag(event)
            return false
        })

        $el.on('touchstart', function(event){
            if ($el.data('component-attached')) return

            var touchEvent = event.originalEvent;
            if (touchEvent.touches.length == 1) {
                startDrag(touchEvent.touches[0])
                event.stopPropagation()
            }
        })

        function initDrag(event) {
            $componentList = $('#cms-master-tabs > div.tab-content > .tab-pane.active .control-componentlist')
            $el.addClass(self.options.placeholderClass)
            $clone.show()
            $editorArea = $('#cms-master-tabs > div.tab-content > .tab-pane.active [data-control="codeeditor"]')
            if (!$editorArea.length) return

            $editor = $editorArea.codeEditor('getEditorObject')
            $editor.focus()

            $editor.on('mousemove', function (event) {
               editorPos = event.getDocumentPosition()
               $editor.clearSelection()
               $editor.moveCursorToPosition(editorPos)
            });
        }

        /*
         * Internal event, drag has started
         */
        function startDrag(event) {

            startPos = $el.offset()
            $clone = $el.clone().appendTo($(document.body))

            $clone
                .css({
                    zIndex: '99999',
                    position: 'absolute',
                    pointerEvents: 'none'
                })
                .addClass('draggable-component-item')
                .width($el.width())
                .height($el.height())
                .hide()

            var objX = (event.pageX - startPos.left),
                objY = (event.pageY - startPos.top)

            $clone.data('dragComponents', { x: objX, y: objY })

            if (Modernizr.touchevents) {
                $(window).on('touchmove.oc.dragcomponents', function(event){
                    var touchEvent = event.originalEvent
                    moveDrag(touchEvent.touches[0])
                    event.preventDefault()
                })

                $(window).on('touchend.oc.dragcomponents', function(event) {
                    stopDrag()
                })
            }
            else {
                $(window).on('mousemove.oc.dragcomponents', function(event){
                    moveDrag(event)
                    $(document.body).addClass(self.options.dragClass)
                    return false
                })

                $(window).on('mouseup.oc.dragcomponents', function(mouseUpEvent){
                    var isClick = event.pageX == mouseUpEvent.pageX && event.pageY == mouseUpEvent.pageY
                    stopDrag(isClick)
                    return false
                })
            }
        }

        /*
         * Internal event, drag is active
         */
        function moveDrag(event) {
            if (!dragging) {
                dragging = true
                initDrag(event)
            }

            adjY = $(window).scrollTop()
            adjX = $(window).scrollLeft()
            var offset = $clone.data('dragComponents')
            $clone.css({
                left: (event.pageX - adjX - offset.x),
                top: (event.pageY - adjY - offset.y)
            })

            if (collision($clone, $componentList))
                $componentList.addClass('droppable')
            else
                $componentList.removeClass('droppable')
        }

        /*
         * Internal event, drag has ended
         */
        function stopDrag(click) {
            dragging = false

            if (click)
                $(document.body).removeClass(self.options.dragClass)

            $el.removeClass(self.options.placeholderClass)
            $(window)
                .off('mousemove.oc.dragcomponents mouseup.oc.dragcomponents')
                .removeData('dragComponents')

            if (!click)
                finishDrag()

            $clone.remove()

            window.setTimeout(function(){
                if (!click) {
                    $(document.body).removeClass(self.options.dragClass)
                }
            }, 100)
        }

        function finishDrag() {
            // Dragged to the code editor
            if (collision($clone, $editorArea)) {
                // Add the component to the page
                $el.click()

                // Can only attach to page or layouts
                if ($componentList.length && $editor) {
                    // Inject {% component %} tag
                    var alias = $('input[name="component_aliases[]"]', $el).val()
                    $editor.insert("{% component '" + alias + "' %}")
                }
            }
            // Dragged to the component list
            else if (collision($clone, $componentList)) {
                // Add the component to the page
                $el.click()
            }

            if ($editor) {
                $editor.removeAllListeners('mousemove')
                $editor.blur()
            }

            if ($componentList.length) {
                $componentList.removeClass('droppable')
            }
        }

        function collision($div1, $div2) {
            if (!$div1 || !$div2 || !$div1.length || !$div2.length)
                return false

            var x1 = $div1.offset().left,
                y1 = $div1.offset().top,
                h1 = $div1.outerHeight(true),
                w1 = $div1.outerWidth(true),
                b1 = y1 + h1,
                r1 = x1 + w1,
                x2 = $div2.offset().left,
                y2 = $div2.offset().top,
                h2 = $div2.outerHeight(true),
                w2 = $div2.outerWidth(true),
                b2 = y2 + h2,
                r2 = x2 + w2

            return !(b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2)
        }

    }

    DragComponents.DEFAULTS = {
        dragClass: 'drag',
        placeholderClass: 'placeholder'
    }

    // DRAGCOMPONENTS PLUGIN DEFINITION
    // ============================

    var old = $.fn.dragComponents

    $.fn.dragComponents = function (option) {
        var args = Array.prototype.slice.call(arguments, 1)
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.dragcomponents')
            var options = $.extend({}, DragComponents.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.dragcomponents', (data = new DragComponents(this, options)))
            else if (typeof option == 'string') data[option].apply(data, args)
        })
    }

    $.fn.dragComponents.Constructor = DragComponents

    // DRAGCOMPONENTS NO CONFLICT
    // =================

    $.fn.dragComponents.noConflict = function () {
        $.fn.dragComponents = old
        return this
    }

    // DRAGCOMPONENTS DATA-API
    // ===============

    $(document).on('mouseenter.oc.dragcomponents', '[data-control="dragcomponent"]', function() {
        $(this).dragComponents()
    });

}(window.jQuery);
