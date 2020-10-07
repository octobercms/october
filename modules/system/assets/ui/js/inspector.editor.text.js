/*
 * Inspector text editor class.
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.propertyEditors.popupBase,
        BaseProto = Base.prototype

    var TextEditor = function(inspector, propertyDefinition, containerCell, group) {
        Base.call(this, inspector, propertyDefinition, containerCell, group)
    }

    TextEditor.prototype = Object.create(BaseProto)
    TextEditor.prototype.constructor = Base

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
                        <p class="inspector-field-comment"></p>                                         \
                        <textarea class="form-control size-small field-textarea" name="name">           \
                        </textarea>                                                                     \
                    </div>                                                                              \
                </div>                                                                                  \
                <div class="modal-footer">                                                              \
                    <button type="submit" class="btn btn-primary">OK</button>                           \
                    <button type="button" class="btn btn-default" data-dismiss="popup">Cancel</button>  \
                </div>                                                                                  \
                </form>'
    }

    TextEditor.prototype.configureComment = function(popup) {
        if (!this.propertyDefinition.description) {
            return
        }

        var descriptionElement = $(popup).find('p.inspector-field-comment')
        descriptionElement.text(this.propertyDefinition.description)
    }

    TextEditor.prototype.configurePopup = function(popup) {
        var $textarea = $(popup).find('textarea'),
            value = this.inspector.getPropertyValue(this.propertyDefinition.property)

        if (this.propertyDefinition.placeholder) {
            $textarea.attr('placeholder', this.propertyDefinition.placeholder)
        }

        if (value === undefined) {
            value = this.propertyDefinition.default
        }

        $textarea.val(value)
        $textarea.focus()

        this.configureComment(popup)
    }

    TextEditor.prototype.handleSubmit = function($form) {
        var $textarea = $form.find('textarea'),
            link = this.getLink(),
            value = $.trim($textarea.val())

        this.inspector.setPropertyValue(this.propertyDefinition.property, value)
    }

    $.oc.inspector.propertyEditors.text = TextEditor
}(window.jQuery);
