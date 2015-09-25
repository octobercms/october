/*
 * Inspector text editor class.
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.propertyEditors.base,
        BaseProto = Base.prototype

    var TextEditor = function(inspector, propertyDefinition, containerCell) {
        Base.call(this, inspector, propertyDefinition, containerCell)
    }

    TextEditor.prototype = Object.create(BaseProto)
    TextEditor.prototype.constructor = Base

    TextEditor.prototype.dispose = function() {
        this.unregisterHandlers()

        BaseProto.dispose.call(this)
    }

    TextEditor.prototype.build = function() {
        var link = document.createElement('a')

        $.oc.foundation.element.addClass(link, 'trigger')
        link.setAttribute('href', '#')
        this.setLinkText(link)

        $.oc.foundation.element.addClass(this.containerCell, 'trigger-cell')

        this.containerCell.appendChild(link)
    }

    TextEditor.prototype.setLinkText = function(link, value) {
        var value = value !== undefined ? value 
                : this.inspector.getPropertyValue(this.propertyDefinition.property)

        if (value === undefined) {
            value = this.propertyDefinition.default
        }

        if (!value) {
            value = this.propertyDefinition.placeholder
            $.oc.foundation.element.addClass(link, 'placeholder')
        } 
        else {
            $.oc.foundation.element.removeClass(link, 'placeholder')
        }

        if (typeof value === 'string') {
            value = value.replace(/(?:\r\n|\r|\n)/g, ' ');
            value = $.trim(value)
            value = value.substring(0, 300);
        }

        link.textContent = value
    }

    TextEditor.prototype.getPopupContent = function() {
        return '<form>                                                                                  \
                <div class="modal-header">                                                              \
                    <button type="button" class="close" data-dismiss="popup">&times;</button>           \
                    <h4 class="modal-title">{{property}}</h4>                                           \
                </div>                                                                                  \
                <div class="modal-body">                                                                \
                    <div class="form-group">                                                            \
                        <textarea class="form-control size-small field-textarea" name="name" value=""/> \
                    </div>                                                                              \
                </div>                                                                                  \
                <div class="modal-footer">                                                              \
                    <button type="submit" class="btn btn-primary">OK</button>                           \
                    <button type="button" class="btn btn-default"data-dismiss="popup">Cancel</button>   \
                </div>                                                                                  \
                </form>'
    }

    TextEditor.prototype.updateDisplayedValue = function(value) {
        this.setLinkText(this.getLink(), value)
    }

    TextEditor.prototype.registerHandlers = function() {
        var link = this.getLink(),
            $link = $(link)

        link.addEventListener('click', this.proxy(this.onTriggerClick))
        $link.on('shown.oc.popup', this.proxy(this.onPopupShown))
        $link.on('hidden.oc.popup', this.proxy(this.onPopupHidden))
    }

    TextEditor.prototype.unregisterHandlers = function() {
        var link = this.getLink(),
            $link = $(link)

        link.removeEventListener('click', this.proxy(this.onTriggerClick))
        $link.off('shown.oc.popup', this.proxy(this.onPopupShown))
        $link.off('hidden.oc.popup', this.proxy(this.onPopupHidden))
    }

    TextEditor.prototype.getLink = function() {
        return this.containerCell.querySelector('a.trigger')
    }

    TextEditor.prototype.onTriggerClick = function(ev) {
        $.oc.foundation.event.stop(ev)

        var content = this.getPopupContent()

        content = content.replace('{{property}}', this.propertyDefinition.title)

        $(ev.target).popup({
            content: content
        })

        return false
    }

    TextEditor.prototype.onPopupShown = function(ev, link, popup) {
        var $textarea = $(popup).find('textarea'),
            value = this.inspector.getPropertyValue(this.propertyDefinition.property)

        $(popup).on('submit.inspector', 'form', this.proxy(this.onSubmit))

        if (this.propertyDefinition.placeholder) {
            $textarea.attr('placeholder', this.propertyDefinition.placeholder)
        }

        if (value === undefined) {
            value = this.propertyDefinition.default
        }

        $textarea.val(value)
        $textarea.focus()
    }

    TextEditor.prototype.onPopupHidden = function(ev, link, popup) {
        $(popup).off('.inspector', this.proxy(this.onSubmit))
    }

    TextEditor.prototype.onSubmit = function(ev) {
        ev.preventDefault()

        var $form = $(ev.target),
            $textarea = $form.find('textarea'),
            link = this.getLink(),
            value = $.trim($textarea.val())

        this.inspector.setPropertyValue(this.propertyDefinition.property, value)
// TODO: validate here

        this.setLinkText(link)
        $(link).popup('hide')
        return false
    }

    $.oc.inspector.propertyEditors.text = TextEditor
}(window.jQuery);