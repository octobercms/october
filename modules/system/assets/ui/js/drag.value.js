/*
 * Drag Value plugin
 *
 * Uses native dragging to allow elements to be dragged in to inputs, textareas, etc
 *
 * Data attributes:
 * - data-control="dragvalue" - enables the plugin on an element
 * - data-text-value="text to include" - text value to include when dragging
 * - data-drag-click="false" - allow click event, tries to cache the last active element
 *                             and insert the text at the current cursor position
 *
 * JavaScript API:
 * $('a#someElement').dragValue({ textValue: 'insert this text' })
 *
 */

+function ($) { "use strict";

    // DRAG VALUE CLASS DEFINITION
    // ============================

    var DragValue = function(element, options) {
        this.options   = options
        this.$el       = $(element)

        // Init
        this.init()
    }

    DragValue.DEFAULTS = {
        dragClick: false
    }

    DragValue.prototype.init = function() {
        this.$el.prop('draggable', true)
        this.textValue = this.$el.data('textValue')

        this.$el.on('dragstart', $.proxy(this.handleDragStart, this))
        this.$el.on('drop', $.proxy(this.handleDrop, this))
        this.$el.on('dragend', $.proxy(this.handleDragEnd, this))

        if (this.options.dragClick) {
            this.$el.on('click', $.proxy(this.handleClick, this))
            this.$el.on('mouseover', $.proxy(this.handleMouseOver, this))
        }
    }

    //
    // Drag events
    //

    DragValue.prototype.handleDragStart = function(event) {
        var e = event.originalEvent
        e.dataTransfer.effectAllowed = 'all'
        e.dataTransfer.setData('text/plain', this.textValue)

        this.$el
            .css({ opacity: 0.5 })
            .addClass('dragvalue-dragging')
    }

    DragValue.prototype.handleDrop = function(event) {
        event.stopPropagation()
        return false
    }

    DragValue.prototype.handleDragEnd = function(event) {
        this.$el
            .css({ opacity: 1 })
            .removeClass('dragvalue-dragging')
    }

    //
    // Click events
    //

    DragValue.prototype.handleMouseOver = function(event) {
        var el = document.activeElement
        if (!el) return

        if (el.isContentEditable || (
            el.tagName.toLowerCase() == 'input' &&
            el.type == 'text' ||
            el.tagName.toLowerCase() == 'textarea'
        )) {
            this.lastElement = el
        }
    }

    DragValue.prototype.handleClick = function(event) {
        if (!this.lastElement) return

        var $el = $(this.lastElement)

        if ($el.hasClass('ace_text-input'))
            return this.handleClickCodeEditor(event, $el)

        if (this.lastElement.isContentEditable)
            return this.handleClickContentEditable()

        this.insertAtCaret(this.lastElement, this.textValue)
    }

    DragValue.prototype.handleClickCodeEditor = function(event, $el) {
        var $editorArea = $el.closest('[data-control=codeeditor]')
        if (!$editorArea.length) return

        $editorArea.codeEditor('getEditorObject').insert(this.textValue)
    }

    DragValue.prototype.handleClickContentEditable = function() {
        var sel, range, html;
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();
                range.insertNode( document.createTextNode(this.textValue) );
            }
        }
        else if (document.selection && document.selection.createRange) {
            document.selection.createRange().text = this.textValue;
        }
    }

    //
    // Helpers
    //

    DragValue.prototype.insertAtCaret = function(el, insertValue) {
        // IE
        if (document.selection) {
            el.focus()
            sel = document.selection.createRange()
            sel.text = insertValue
            el.focus()
        }
        // Real browsers
        else if (el.selectionStart || el.selectionStart == '0') {
            var startPos = el.selectionStart, endPos = el.selectionEnd, scrollTop = el.scrollTop
            el.value = el.value.substring(0, startPos) + insertValue + el.value.substring(endPos, el.value.length)
            el.focus()
            el.selectionStart = startPos + insertValue.length
            el.selectionEnd = startPos + insertValue.length
            el.scrollTop = scrollTop
        }
        else {
            el.value += insertValue
            el.focus()
        }
    }

    // DRAG VALUE PLUGIN DEFINITION
    // ============================

    var old = $.fn.dragValue

    $.fn.dragValue = function (option) {
        var args = Array.prototype.slice.call(arguments, 1), result
        this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.dragvalue')
            var options = $.extend({}, DragValue.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.dragvalue', (data = new DragValue(this, options)))
            if (typeof option == 'string') result = data[option].apply(data, args)
            if (typeof result != 'undefined') return false
        })

        return result ? result : this
    }

    $.fn.dragValue.Constructor = DragValue

    // DRAG VALUE NO CONFLICT
    // =================

    $.fn.dragValue.noConflict = function () {
        $.fn.dragValue = old
        return this
    }

    // DRAG VALUE DATA-API
    // ===============

    $(document).render(function() {
        $('[data-control="dragvalue"]').dragValue()
    });

}(window.jQuery);