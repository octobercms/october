/*
 * Inspector string list with autocompletion editor class.
 *
 * TODO: validation is not implemented in this editor. See the Dictionary editor for reference.
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.propertyEditors.popupBase,
        BaseProto = Base.prototype

    var StringListAutocomplete = function(inspector, propertyDefinition, containerCell, group) {
        this.items = null

        Base.call(this, inspector, propertyDefinition, containerCell, group)
    }

    StringListAutocomplete.prototype = Object.create(BaseProto)
    StringListAutocomplete.prototype.constructor = Base

    StringListAutocomplete.prototype.dispose = function() {
        BaseProto.dispose.call(this)
    }

    StringListAutocomplete.prototype.init = function() {
        BaseProto.init.call(this)
    }

    StringListAutocomplete.prototype.supportsExternalParameterEditor = function() {
        return false
    }

    StringListAutocomplete.prototype.setLinkText = function(link, value) {
        var value = value !== undefined ? value 
                : this.inspector.getPropertyValue(this.propertyDefinition.property)

        if (value === undefined) {
            value = this.propertyDefinition.default
        }

        this.checkValueType(value)

        if (!value) {
            value = this.propertyDefinition.placeholder
            $.oc.foundation.element.addClass(link, 'placeholder')

            if (!value) {
                value = '[]'
            }

            link.textContent = value
        } 
        else {
            $.oc.foundation.element.removeClass(link, 'placeholder')
    
            link.textContent = '[' + value.join(', ') + ']'
        }
    }

    StringListAutocomplete.prototype.checkValueType = function(value) {
        if (value && Object.prototype.toString.call(value) !== '[object Array]') {
            this.throwError('The string list value should be an array.')
        }
    }

    //
    // Popup editor methods
    //

    StringListAutocomplete.prototype.getPopupContent = function() {
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
                    <button type="button" class="btn btn-default" data-dismiss="popup">Cancel</button>   \
                </div>                                                                                  \
                </form>'
    }

    StringListAutocomplete.prototype.configurePopup = function(popup) {
        this.initAutocomplete()

        this.buildItemsTable(popup.get(0))

        this.focusFirstInput()
    }

    StringListAutocomplete.prototype.handleSubmit = function($form) {
        return this.applyValues()
    }

    //
    // Building and row management
    //

    StringListAutocomplete.prototype.buildItemsTable = function(popup) {
        var table = popup.querySelector('table.inspector-dictionary-table'),
            tbody = document.createElement('tbody'),
            items = this.inspector.getPropertyValue(this.propertyDefinition.property)

        if (items === undefined) {
            items = this.propertyDefinition.default
        }

        if (items === undefined || this.getValueKeys(items).length === 0) {
            var row = this.buildEmptyRow()

            tbody.appendChild(row)
        }
        else {
            for (var key in items) {
                var row = this.buildTableRow(items[key])

                tbody.appendChild(row)
            }
        }

        table.appendChild(tbody)
        this.updateScrollpads()
    }

    StringListAutocomplete.prototype.buildTableRow = function(value) {
        var row = document.createElement('tr'),
            valueCell = document.createElement('td')

        this.createInput(valueCell, value)

        row.appendChild(valueCell)

        return row
    }

    StringListAutocomplete.prototype.buildEmptyRow = function() {
        return this.buildTableRow(null)
    }

    StringListAutocomplete.prototype.createInput = function(container, value) {
        var input = document.createElement('input'),
            controlContainer = document.createElement('div')

        input.setAttribute('type', 'text')
        input.setAttribute('class', 'form-control')
        input.value = value

        controlContainer.appendChild(input)
        container.appendChild(controlContainer)
    }

    StringListAutocomplete.prototype.setActiveCell = function(input) {
        var activeCells = this.popup.querySelectorAll('td.active')

        for (var i = activeCells.length-1; i >= 0; i--) {
            $.oc.foundation.element.removeClass(activeCells[i], 'active')
        }

        var activeCell = input.parentNode.parentNode // input / div / td
        $.oc.foundation.element.addClass(activeCell, 'active')

        this.buildAutoComplete(input)
    }

    StringListAutocomplete.prototype.createItem = function() {
        var activeRow = this.getActiveRow(),
            newRow = this.buildEmptyRow(),
            tbody = this.getTableBody(),
            nextSibling = activeRow ? activeRow.nextElementSibling : null

        tbody.insertBefore(newRow, nextSibling)

        this.focusAndMakeActive(newRow.querySelector('input'))
        this.updateScrollpads()
    }

    StringListAutocomplete.prototype.deleteItem = function() {
        var activeRow = this.getActiveRow(),
            tbody = this.getTableBody()

        if (!activeRow) {
            return
        }

        var nextRow = activeRow.nextElementSibling,
            prevRow = activeRow.previousElementSibling,
            input = this.getRowInputByIndex(activeRow, 0)

        if (input) {
            this.removeAutocomplete(input)
        }

        tbody.removeChild(activeRow)

        var newSelectedRow = nextRow ? nextRow : prevRow

        if (!newSelectedRow) {
            newSelectedRow = this.buildEmptyRow()
            tbody.appendChild(newSelectedRow)
        }

        this.focusAndMakeActive(newSelectedRow.querySelector('input'))
        this.updateScrollpads()
    }

    StringListAutocomplete.prototype.applyValues = function() {
        var tbody = this.getTableBody(),
            dataRows = tbody.querySelectorAll('tr'),
            link = this.getLink(),
            result = []

        for (var i = 0, len = dataRows.length; i < len; i++) {
            var dataRow = dataRows[i],
                valueInput = this.getRowInputByIndex(dataRow, 0),
                value = $.trim(valueInput.value)

            if (value.length == 0) {
                continue
            }

            result.push(value)
        }

        this.inspector.setPropertyValue(this.propertyDefinition.property, result)
        this.setLinkText(link, result)
    }

    //
    // Helpers
    //

    StringListAutocomplete.prototype.getValueKeys = function(value) {
        var result = []

        for (var key in value) {
            result.push(key)
        }

        return result
    }

    StringListAutocomplete.prototype.getActiveRow = function() {
        var activeCell = this.popup.querySelector('td.active')

        if (!activeCell) {
            return null
        }

        return activeCell.parentNode
    }

    StringListAutocomplete.prototype.getTableBody = function() {
        return this.popup.querySelector('table.inspector-dictionary-table tbody')
    }

    StringListAutocomplete.prototype.updateScrollpads = function() {
        $('.control-scrollpad', this.popup).scrollpad('update')
    }

    StringListAutocomplete.prototype.focusFirstInput = function() {
        var input = this.popup.querySelector('td input')

        if (input) {
            input.focus()
            this.setActiveCell(input)
        }
    }

    StringListAutocomplete.prototype.getEditorCell = function(cell) {
        return cell.parentNode.parentNode // cell / div / td
    }

    StringListAutocomplete.prototype.getEditorRow = function(cell) {
        return cell.parentNode.parentNode.parentNode // cell / div / td / tr
    }

    StringListAutocomplete.prototype.focusAndMakeActive = function(input) {
        input.focus()
        this.setActiveCell(input)
    }

    StringListAutocomplete.prototype.getRowInputByIndex = function(row, index) {
        return row.cells[index].querySelector('input')
    }

    //
    // Navigation
    //

    StringListAutocomplete.prototype.navigateDown = function(ev) {
        var cell = this.getEditorCell(ev.currentTarget),
            row = this.getEditorRow(ev.currentTarget),
            nextRow = row.nextElementSibling

        if (!nextRow) {
            return
        }

        var newActiveEditor = nextRow.cells[cell.cellIndex].querySelector('input')

        this.focusAndMakeActive(newActiveEditor)
    }

    StringListAutocomplete.prototype.navigateUp = function(ev) {
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
    // Autocomplete
    //

    StringListAutocomplete.prototype.initAutocomplete = function() {
        if (this.propertyDefinition.items !== undefined) {
            this.items = this.prepareItems(this.propertyDefinition.items)
            this.initializeAutocompleteForCurrentInput()
        }
        else {
            this.loadDynamicItems()
        }
    }

    StringListAutocomplete.prototype.initializeAutocompleteForCurrentInput = function() {
        var activeElement = document.activeElement

        if (!activeElement) {
            return
        }

        var inputs = this.popup.querySelectorAll('td input.form-control')

        if (!inputs) {
            return
        }

        for (var i=inputs.length-1; i>=0; i--) {
            if (inputs[i] === activeElement) {
                this.buildAutoComplete(inputs[i])
                return
            }
        }
    }

    StringListAutocomplete.prototype.buildAutoComplete = function(input) {
        if (this.items === null) {
            return
        }

        $(input).autocomplete({
            source: this.items,
            matchWidth: true,
            menu: '<ul class="autocomplete dropdown-menu inspector-autocomplete"></ul>',
            bodyContainer: true
        })
    }

    StringListAutocomplete.prototype.removeAutocomplete = function(input) {
        var $input = $(input)

        if (!$input.data('autocomplete')) {
            return
        }

        $input.autocomplete('destroy')
    }

    StringListAutocomplete.prototype.prepareItems = function(items) {
        var result = {}

        if ($.isArray(items)) {
            for (var i = 0, len = items.length; i < len; i++) {
                result[items[i]] = items[i]
            }
        }
        else {
            result = items
        }

        return result
    }

    StringListAutocomplete.prototype.loadDynamicItems = function() {
        if (this.isDisposed()) {
            return
        }

        var data = this.getRootSurface().getValues(),
            $form = $(this.popup).find('form')

        if (this.triggerGetItems(data) === false) {
            return
        }

        data['inspectorProperty'] = this.getPropertyPath()
        data['inspectorClassName'] = this.inspector.options.inspectorClass

        $form.request('onInspectableGetOptions', {
            data: data,
        })
        .done(this.proxy(this.itemsRequestDone))
    }

    StringListAutocomplete.prototype.triggerGetItems = function(values) {
        var $inspectable = this.getInspectableElement()
        if (!$inspectable) {
            return true
        }

        var itemsEvent = $.Event('autocompleteitems.oc.inspector')

        $inspectable.trigger(itemsEvent, [{
            values: values, 
            callback: this.proxy(this.itemsRequestDone),
            property: this.inspector.getPropertyPath(this.propertyDefinition.property),
            propertyDefinition: this.propertyDefinition
        }])

        if (itemsEvent.isDefaultPrevented()) {
            return false
        }

        return true
    }

    StringListAutocomplete.prototype.itemsRequestDone = function(data) {
        if (this.isDisposed()) {
            // Handle the case when the asynchronous request finishes after
            // the editor is disposed
            return
        }

        var loadedItems = {}

        if (data.options) {
            for (var i = data.options.length-1; i >= 0; i--) {
                loadedItems[data.options[i].value] = data.options[i].title
            }
        }

        this.items = this.prepareItems(loadedItems)
        this.initializeAutocompleteForCurrentInput()
    }

    StringListAutocomplete.prototype.removeAutocompleteFromAllRows = function() {
        var inputs = this.popup.querySelector('td input.form-control')

        for (var i=inputs.length-1; i>=0; i--) {
            this.removeAutocomplete(inputs[i])
        }
    }

    //
    // Event handlers
    //

    StringListAutocomplete.prototype.onPopupShown = function(ev, link, popup) {
        BaseProto.onPopupShown.call(this,ev, link, popup)

        popup.on('focus.inspector', 'td input', this.proxy(this.onFocus))
        popup.on('blur.inspector', 'td input', this.proxy(this.onBlur))
        popup.on('keydown.inspector', 'td input', this.proxy(this.onKeyDown))
        popup.on('click.inspector', '[data-cmd]', this.proxy(this.onCommand))
    }

    StringListAutocomplete.prototype.onPopupHidden = function(ev, link, popup) {
        popup.off('.inspector', 'td input')
        popup.off('.inspector', '[data-cmd]', this.proxy(this.onCommand))

        this.removeAutocompleteFromAllRows()
        this.items = null

        BaseProto.onPopupHidden.call(this, ev, link, popup)
    }

    StringListAutocomplete.prototype.onFocus = function(ev) {
        this.setActiveCell(ev.currentTarget)
    }

    StringListAutocomplete.prototype.onBlur = function(ev) {
        if ($(ev.relatedTarget).closest('ul.inspector-autocomplete').length > 0) {
            // Do not close the autocomplete results if a drop-down
            // menu item was clicked
            return
        }

        this.removeAutocomplete(ev.currentTarget)
    }

    StringListAutocomplete.prototype.onCommand = function(ev) {
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

    StringListAutocomplete.prototype.onKeyDown = function(ev) {
        if (ev.key === 'ArrowDown') {
            return this.navigateDown(ev)
        }
        else if (ev.key === 'ArrowUp') {
            return this.navigateUp(ev)
        }
    }

    $.oc.inspector.propertyEditors.stringListAutocomplete = StringListAutocomplete
}(window.jQuery);