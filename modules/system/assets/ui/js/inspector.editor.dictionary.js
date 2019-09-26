/*
 * Inspector dictionary editor class.
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.propertyEditors.popupBase,
        BaseProto = Base.prototype

    var DictionaryEditor = function(inspector, propertyDefinition, containerCell, group) {
        this.keyValidationSet = null
        this.valueValidationSet = null

        Base.call(this, inspector, propertyDefinition, containerCell, group)
    }

    DictionaryEditor.prototype = Object.create(BaseProto)
    DictionaryEditor.prototype.constructor = Base

    DictionaryEditor.prototype.dispose = function() {
        this.disposeValidators()
        
        this.keyValidationSet = null
        this.valueValidationSet = null

        BaseProto.dispose.call(this)
    }

    DictionaryEditor.prototype.init = function() {
        this.initValidators()

        BaseProto.init.call(this)
    }

    DictionaryEditor.prototype.supportsExternalParameterEditor = function() {
        return false
    }

    //
    // Popup editor methods
    //

    DictionaryEditor.prototype.setLinkText = function(link, value) {
        var value = value !== undefined ? value 
                : this.inspector.getPropertyValue(this.propertyDefinition.property)

        if (value === undefined) {
            value = this.propertyDefinition.default
        }

        if (value === undefined || $.isEmptyObject(value)) {
            var placeholder = this.propertyDefinition.placeholder

            if (placeholder !== undefined) {
                $.oc.foundation.element.addClass(link, 'placeholder')
                link.textContent = placeholder
            }
            else {
                link.textContent = 'Items: 0'
            }
        }
        else {
            if (typeof value !== 'object') {
                this.throwError('Object list value should be an object.')
            }

            var itemCount = this.getValueKeys(value).length

            $.oc.foundation.element.removeClass(link, 'placeholder')
            link.textContent = 'Items: ' + itemCount
        }
    }

    DictionaryEditor.prototype.getPopupContent = function() {
        return '<form>                                                                                  \
                <div class="modal-header">                                                              \
                    <button type="button" class="close" data-dismiss="popup">&times;</button>           \
                    <h4 class="modal-title">{{property}}</h4>                                           \
                </div>                                                                                  \
                <div class="modal-body">                                                                \
                    <div class="control-toolbar">                                                       \
                        <div class="toolbar-item">                                                      \
                            <div class="btn-group">                                                     \
                                <button type="button" class="btn btn-primary                            \
                                    oc-icon-plus"                                                       \
                                    data-cmd="create-item">Add</button>                                 \
                                <button type="button" class="btn btn-default                            \
                                    empty oc-icon-trash-o"                                              \
                                    data-cmd="delete-item"></button>                                    \
                            </div>                                                                      \
                        </div>                                                                          \
                    </div>                                                                              \
                    <div class="form-group">                                                            \
                        <div class="inspector-dictionary-container">                                    \
                            <table class="headers">                                                     \
                                <thead>                                                                 \
                                    <tr>                                                                \
                                        <td>Key</td>                                                    \
                                        <td>Value</td>                                                  \
                                    </tr>                                                               \
                                </thead>                                                                \
                            </table>                                                                    \
                            <div class="values">                                                        \
                                <div class="control-scrollpad"                                          \
                                    data-control="scrollpad">                                           \
                                    <div class="scroll-wrapper">                                        \
                                        <table class="                                                  \
                                            no-offset-bottom                                            \
                                            inspector-dictionary-table">                                \
                                        </table>                                                        \
                                    </div>                                                              \
                                </div>                                                                  \
                            </div>                                                                      \
                        </div>                                                                          \
                    </div>                                                                              \
                </div>                                                                                  \
                <div class="modal-footer">                                                              \
                    <button type="submit" class="btn btn-primary">OK</button>                           \
                    <button type="button" class="btn btn-default" data-dismiss="popup">Cancel</button>  \
                </div>                                                                                  \
                </form>'
    }

    DictionaryEditor.prototype.configurePopup = function(popup) {
        this.buildItemsTable(popup.get(0))

        this.focusFirstInput()
    }

    DictionaryEditor.prototype.handleSubmit = function($form) {
        return this.applyValues()
    }

    //
    // Building and row management
    //

    DictionaryEditor.prototype.buildItemsTable = function(popup) {
        var table = popup.querySelector('table.inspector-dictionary-table'),
            tbody = document.createElement('tbody'),
            items = this.inspector.getPropertyValue(this.propertyDefinition.property),
            titleProperty = this.propertyDefinition.titleProperty

        if (items === undefined) {
            items = this.propertyDefinition.default
        }

        if (items === undefined || this.getValueKeys(items).length === 0) {
            var row = this.buildEmptyRow()

            tbody.appendChild(row)
        }
        else {
            for (var key in items) {
                var row = this.buildTableRow(key, items[key])

                tbody.appendChild(row)
            }
        }

        table.appendChild(tbody)
        this.updateScrollpads()
    }

    DictionaryEditor.prototype.buildTableRow = function(key, value) {
        var row = document.createElement('tr'),
            keyCell = document.createElement('td'),
            valueCell = document.createElement('td')

        this.createInput(keyCell, key)
        this.createInput(valueCell, value)

        row.appendChild(keyCell)
        row.appendChild(valueCell)

        return row
    }

    DictionaryEditor.prototype.buildEmptyRow = function() {
        return this.buildTableRow(null, null)
    }

    DictionaryEditor.prototype.createInput = function(container, value) {
        var input = document.createElement('input'),
            controlContainer = document.createElement('div')

        input.setAttribute('type', 'text')
        input.setAttribute('class', 'form-control')
        input.value = value

        controlContainer.appendChild(input)
        container.appendChild(controlContainer)
    }

    DictionaryEditor.prototype.setActiveCell = function(input) {
        var activeCells = this.popup.querySelectorAll('td.active')

        for (var i = activeCells.length-1; i >= 0; i--) {
            $.oc.foundation.element.removeClass(activeCells[i], 'active')
        }

        var activeCell = input.parentNode.parentNode // input / div / td
        $.oc.foundation.element.addClass(activeCell, 'active')
    }

    DictionaryEditor.prototype.createItem = function() {
        var activeRow = this.getActiveRow(),
            newRow = this.buildEmptyRow(),
            tbody = this.getTableBody(),
            nextSibling = activeRow ? activeRow.nextElementSibling : null

        tbody.insertBefore(newRow, nextSibling)

        this.focusAndMakeActive(newRow.querySelector('input'))
        this.updateScrollpads()
    }

    DictionaryEditor.prototype.deleteItem = function() {
        var activeRow = this.getActiveRow(),
            tbody = this.getTableBody()

        if (!activeRow) {
            return
        }

        var nextRow = activeRow.nextElementSibling,
            prevRow = activeRow.previousElementSibling

        tbody.removeChild(activeRow)

        var newSelectedRow = nextRow ? nextRow : prevRow

        if (!newSelectedRow) {
            newSelectedRow = this.buildEmptyRow()
            tbody.appendChild(newSelectedRow)
        }

        this.focusAndMakeActive(newSelectedRow .querySelector('input'))
        this.updateScrollpads()
    }

    DictionaryEditor.prototype.applyValues = function() {
        var tbody = this.getTableBody(),
            dataRows = tbody.querySelectorAll('tr'),
            link = this.getLink(),
            result = {}

        for (var i = 0, len = dataRows.length; i < len; i++) {
            var dataRow = dataRows[i],
                keyInput = this.getRowInputByIndex(dataRow, 0),
                valueInput = this.getRowInputByIndex(dataRow, 1),
                key = $.trim(keyInput.value),
                value = $.trim(valueInput.value)

            if (key.length == 0 && value.length == 0) {
                continue
            }

            if (key.length == 0) {
                $.oc.flashMsg({text: 'The key cannot be empty.', 'class': 'error', 'interval': 3})
                this.focusAndMakeActive(keyInput)
                return false
            }

            if (value.length == 0) {
                $.oc.flashMsg({text: 'The value cannot be empty.', 'class': 'error', 'interval': 3})
                this.focusAndMakeActive(valueInput)
                return false
            }

            if (result[key] !== undefined) {
                $.oc.flashMsg({text: 'Keys should be unique.', 'class': 'error', 'interval': 3})
                this.focusAndMakeActive(keyInput)
                return false
            }
        
            var validationResult = this.keyValidationSet.validate(key)
            if (validationResult !== null) {
                $.oc.flashMsg({text: validationResult, 'class': 'error', 'interval': 5})
                return false
            }

            validationResult = this.valueValidationSet.validate(value)
            if (validationResult !== null) {
                $.oc.flashMsg({text: validationResult, 'class': 'error', 'interval': 5})
                return false
            }

            result[key] = value
        }

        this.inspector.setPropertyValue(this.propertyDefinition.property, result)
        this.setLinkText(link, result)
    }

    //
    // Helpers
    //

    DictionaryEditor.prototype.getValueKeys = function(value) {
        var result = []

        for (var key in value) {
            result.push(key)
        }

        return result
    }

    DictionaryEditor.prototype.getActiveRow = function() {
        var activeCell = this.popup.querySelector('td.active')

        if (!activeCell) {
            return null
        }

        return activeCell.parentNode
    }

    DictionaryEditor.prototype.getTableBody = function() {
        return this.popup.querySelector('table.inspector-dictionary-table tbody')
    }

    DictionaryEditor.prototype.updateScrollpads = function() {
        $('.control-scrollpad', this.popup).scrollpad('update')
    }

    DictionaryEditor.prototype.focusFirstInput = function() {
        var input = this.popup.querySelector('td input')

        if (input) {
            input.focus()
            this.setActiveCell(input)
        }
    }

    DictionaryEditor.prototype.getEditorCell = function(cell) {
        return cell.parentNode.parentNode // cell / div / td
    }

    DictionaryEditor.prototype.getEditorRow = function(cell) {
        return cell.parentNode.parentNode.parentNode // cell / div / td / tr
    }

    DictionaryEditor.prototype.focusAndMakeActive = function(input) {
        input.focus()
        this.setActiveCell(input)
    }

    DictionaryEditor.prototype.getRowInputByIndex = function(row, index) {
        return row.cells[index].querySelector('input')
    }

    //
    // Navigation
    //

    DictionaryEditor.prototype.navigateDown = function(ev) {
        var cell = this.getEditorCell(ev.currentTarget),
            row = this.getEditorRow(ev.currentTarget),
            nextRow = row.nextElementSibling

        if (!nextRow) {
            return
        }

        var newActiveEditor = nextRow.cells[cell.cellIndex].querySelector('input')

        this.focusAndMakeActive(newActiveEditor)
    }

    DictionaryEditor.prototype.navigateUp = function(ev) {
        var cell = this.getEditorCell(ev.currentTarget),
            row = this.getEditorRow(ev.currentTarget),
            prevRow = row.previousElementSibling

        if (!prevRow) {
            return
        }

        var newActiveEditor = prevRow.cells[cell.cellIndex].querySelector('input')

        this.focusAndMakeActive(newActiveEditor)
    }

    //
    // Validation
    //

    DictionaryEditor.prototype.initValidators = function() {
        this.keyValidationSet = new $.oc.inspector.validationSet({
            validation: this.propertyDefinition.validationKey
        }, this.propertyDefinition.property+'.validationKey')

        this.valueValidationSet = new $.oc.inspector.validationSet({
            validation: this.propertyDefinition.validationValue
        }, this.propertyDefinition.property+'.validationValue')
    }

    DictionaryEditor.prototype.disposeValidators = function() {
        this.keyValidationSet.dispose()
        this.valueValidationSet.dispose()
    }

    //
    // Event handlers
    //

    DictionaryEditor.prototype.onPopupShown = function(ev, link, popup) {
        BaseProto.onPopupShown.call(this,ev, link, popup )

        popup.on('focus.inspector', 'td input', this.proxy(this.onFocus))
        popup.on('keydown.inspector', 'td input', this.proxy(this.onKeyDown))
        popup.on('click.inspector', '[data-cmd]', this.proxy(this.onCommand))
    }

    DictionaryEditor.prototype.onPopupHidden = function(ev, link, popup) {
        popup.off('.inspector', 'td input')
        popup.off('.inspector', '[data-cmd]', this.proxy(this.onCommand))

        BaseProto.onPopupHidden.call(this, ev, link, popup)
    }

    DictionaryEditor.prototype.onFocus = function(ev) {
        this.setActiveCell(ev.currentTarget)
    }

    DictionaryEditor.prototype.onCommand = function(ev) {
        var command = ev.currentTarget.getAttribute('data-cmd')

        switch (command) {
            case 'create-item' : 
                this.createItem()
            break;
            case 'delete-item' : 
                this.deleteItem()
            break;
        }
    }

    DictionaryEditor.prototype.onKeyDown = function(ev) {
        if (ev.key === 'ArrowDown') {
            return this.navigateDown(ev)
        }
        else if (ev.key === 'ArrowUp') {
            return this.navigateUp(ev)
        }
    }

    $.oc.inspector.propertyEditors.dictionary = DictionaryEditor
}(window.jQuery);