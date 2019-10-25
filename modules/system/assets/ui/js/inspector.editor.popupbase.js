/*
 * Base class for Inspector editors that create popups.
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.propertyEditors.base,
        BaseProto = Base.prototype

    var PopupBase = function(inspector, propertyDefinition, containerCell, group) {
        this.popup = null

        Base.call(this, inspector, propertyDefinition, containerCell, group)
    }

    PopupBase.prototype = Object.create(BaseProto)
    PopupBase.prototype.constructor = Base

    PopupBase.prototype.dispose = function() {
        this.unregisterHandlers()
        this.popup = null

        BaseProto.dispose.call(this)
    }

    PopupBase.prototype.build = function() {
        var link = document.createElement('a')

        $.oc.foundation.element.addClass(link, 'trigger')
        link.setAttribute('href', '#')
        this.setLinkText(link)

        $.oc.foundation.element.addClass(this.containerCell, 'trigger-cell')

        this.containerCell.appendChild(link)
    }

    PopupBase.prototype.setLinkText = function(link, value) {
    }

    PopupBase.prototype.getPopupContent = function() {
        return '<form>                                                                                  \
                <div class="modal-header">                                                              \
                    <button type="button" class="close" data-dismiss="popup">&times;</button>           \
                    <h4 class="modal-title">{{property}}</h4>                                           \
                </div>                                                                                  \
                <div class="modal-body">                                                                \
                    <div class="form-group">                                                            \
                    </div>                                                                              \
                </div>                                                                                  \
                <div class="modal-footer">                                                              \
                    <button type="submit" class="btn btn-primary">OK</button>                           \
                    <button type="button" class="btn btn-default" data-dismiss="popup">Cancel</button>  \
                </div>                                                                                  \
                </form>'
    }

    PopupBase.prototype.updateDisplayedValue = function(value) {
        this.setLinkText(this.getLink(), value)
    }

    PopupBase.prototype.registerHandlers = function() {
        var link = this.getLink(),
            $link = $(link)

        link.addEventListener('click', this.proxy(this.onTriggerClick))
        $link.on('shown.oc.popup', this.proxy(this.onPopupShown))
        $link.on('hidden.oc.popup', this.proxy(this.onPopupHidden))
    }

    PopupBase.prototype.unregisterHandlers = function() {
        var link = this.getLink(),
            $link = $(link)

        link.removeEventListener('click', this.proxy(this.onTriggerClick))
        $link.off('shown.oc.popup', this.proxy(this.onPopupShown))
        $link.off('hidden.oc.popup', this.proxy(this.onPopupHidden))
    }

    PopupBase.prototype.getLink = function() {
        return this.containerCell.querySelector('a.trigger')
    }

    PopupBase.prototype.configurePopup = function(popup) {
    }

    PopupBase.prototype.handleSubmit = function($form) {
    }

    PopupBase.prototype.hidePopup = function() {
        $(this.getLink()).popup('hide')
    }

    PopupBase.prototype.onTriggerClick = function(ev) {
        $.oc.foundation.event.stop(ev)

        var content = this.getPopupContent()

        content = content.replace('{{property}}', this.propertyDefinition.title)

        $(ev.target).popup({
            content: content
        })

        return false
    }

    PopupBase.prototype.onPopupShown = function(ev, link, popup) {
        $(popup).on('submit.inspector', 'form', this.proxy(this.onSubmit))

        this.popup = popup.get(0)

        this.configurePopup(popup)

        this.getRootSurface().popupDisplayed()
    }

    PopupBase.prototype.onPopupHidden = function(ev, link, popup) {
        $(popup).off('.inspector', 'form', this.proxy(this.onSubmit))
        this.popup = null

        this.getRootSurface().popupHidden()
    }

    PopupBase.prototype.onSubmit = function(ev) {
        ev.preventDefault()

        if (this.handleSubmit($(ev.target)) === false) {
            return false
        }

        this.setLinkText(this.getLink())
        this.hidePopup()
        return false
    }

    $.oc.inspector.propertyEditors.popupBase = PopupBase
}(window.jQuery);