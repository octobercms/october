/*
 * Inspector object list editor class.
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.propertyEditors.base,
        BaseProto = Base.prototype

    var ObjectListEditor = function(inspector, propertyDefinition, containerCell) {
        this.currentRowInspector = null
        this.popup = null

        if (propertyDefinition.titleProperty === undefined) {
            throw new Error('The titleProperty property should be specified in the objectList editor configuration. Property: ' + propertyDefinition.property)
        }

        if (propertyDefinition.itemProperties === undefined) {
            throw new Error('The itemProperties property should be specified in the objectList editor configuration. Property: ' + propertyDefinition.property)
        }

        Base.call(this, inspector, propertyDefinition, containerCell)
    }

    ObjectListEditor.prototype = Object.create(BaseProto)
    ObjectListEditor.prototype.constructor = Base

    ObjectListEditor.prototype.dispose = function() {
        this.unregisterHandlers()
        this.removeControls()

        this.currentRowInspector = null
        this.popup = null

        BaseProto.dispose.call(this)
    }

    //
    // Building
    //

    ObjectListEditor.prototype.build = function() {
        var link = document.createElement('a')

        $.oc.foundation.element.addClass(link, 'trigger')
        link.setAttribute('href', '#')
        this.setLinkText(link)

        $.oc.foundation.element.addClass(this.containerCell, 'trigger-cell')

        this.containerCell.appendChild(link)
    }

    ObjectListEditor.prototype.setLinkText = function(link, value) {
        var value = value !== undefined ? value 
                : this.inspector.getPropertyValue(this.propertyDefinition.property)

        if (value === undefined) {
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
            if (value.length === undefined) {
                throw new Error('Object list value an array. Property: ' + this.propertyDefinition.property)
            }

            $.oc.foundation.element.removeClass(link, 'placeholder')
            link.textContent = 'Items: ' + value.length
        }
    }

    ObjectListEditor.prototype.getPopupContent = function() {
        return '<form>                                                                                  \
                <div class="modal-header">                                                              \
                    <button type="button" class="close" data-dismiss="popup">&times;</button>           \
                    <h4 class="modal-title">{{property}}</h4>                                           \
                </div>                                                                                  \
                <div>                                                                                   \
                    <div class="layout inspector-columns-editor">                                       \
                        <div class="layout-row">                                                        \
                            <div class="layout-cell">                                                   \
                                <div class="layout-relative">                                           \
                                    <div class="layout">                                                \
                                        <div class="layout-row min-size">                               \
                                            <div class="control-toolbar toolbar-padded">                \
                                                <div class="toolbar-item">                              \
                                                    <div class="btn-group">                             \
                                                        <button type="button" class="btn btn-primary    \
                                                            oc-icon-plus"                               \
                                                            data-cmd="create-item">Add</button>         \
                                                        <button type="button" class="btn btn-default    \
                                                            empty oc-icon-trash-o"                      \
                                                            data-cmd="delete-item"></button>            \
                                                    </div>                                              \
                                                </div>                                                  \
                                            </div>                                                      \
                                        </div>                                                          \
                                        <div class="layout-row">                                        \
                                            <div class="layout-cell">                                   \
                                                <div class="layout-relative">                           \
                                                    <div class="layout-absolute">                       \
                                                        <div class="control-scrollpad"                  \
                                                            data-control="scrollpad">                   \
                                                            <div class="scroll-wrapper">                \
                                                                <table class="table data                \
                                                                    no-offset-bottom                    \
                                                                    inspector-table-list">              \
                                                                </table>                                \
                                                            </div>                                      \
                                                        </div>                                          \
                                                    </div>                                              \
                                                </div>                                                  \
                                            </div>                                                      \
                                        </div>                                                          \
                                    </div>                                                              \
                                </div>                                                                  \
                            </div>                                                                      \
                            <div class="layout-cell">                                                   \
                                <div class="layout-relative">                                           \
                                    <div class="layout-absolute">                                       \
                                        <div class="control-scrollpad" data-control="scrollpad">        \
                                            <div class="scroll-wrapper inspector-wrapper">              \
                                                <div data-inspector-container>                          \
                                                </div>                                                  \
                                            </div>                                                      \
                                        </div>                                                          \
                                    </div>                                                              \
                                </div>                                                                  \
                            </div>                                                                      \
                        </div>                                                                          \
                    </div>                                                                              \
                </div>                                                                                  \
                <div class="modal-footer">                                                              \
                    <button type="submit" class="btn btn-primary">OK</button>                           \
                    <button type="button" class="btn btn-default"data-dismiss="popup">Cancel</button>   \
                </div>                                                                                  \
                </form>'
    }

    ObjectListEditor.prototype.buildPopupContents = function(popup) {
        this.buildItemsTable(popup)
    }

    ObjectListEditor.prototype.buildItemsTable = function(popup) {
        var table = popup.querySelector('table'),
            tbody = document.createElement('tbody'),
            items = this.inspector.getPropertyValue(this.propertyDefinition.property),
            titleProperty = this.propertyDefinition.titleProperty

        if (items === undefined || items.length === 0) {
            var row = this.buildEmptyRow()

            tbody.appendChild(row)
        }
        else {
            var firstRow = undefined

            for (var i = 0, len = items.length; i < len; i++) {
                var item = items[i],
                    itemText = item[titleProperty],
                    row = this.buildTableRow(itemText, 'rowlink')

                row.setAttribute('data-inspector-values', JSON.stringify(item))
                tbody.appendChild(row)

                if (firstRow === undefined) {
                    firstRow = row
                }
            }
        }

        table.appendChild(tbody)

        if (firstRow !== undefined) {
            this.selectRow(firstRow)
        }

        this.updateScrollpads()
    }

    ObjectListEditor.prototype.buildEmptyRow = function() {
        return this.buildTableRow('No items found', 'no-data', 'nolink')
    }

    ObjectListEditor.prototype.removeEmptyRow = function() {
        var tbody = this.getTableBody(),
            row = tbody.querySelector('tr.no-data')

        if (row) {
            tbody.removeChild(row)
        }
    }

    ObjectListEditor.prototype.buildTableRow = function(text, rowClass, cellClass) {
        var row = document.createElement('tr'),
            cell = document.createElement('td')

        cell.textContent = text

        if (rowClass !== undefined) {
            $.oc.foundation.element.addClass(row, rowClass)
        }

        if (cellClass !== undefined) {
            $.oc.foundation.element.addClass(cell, cellClass)
        }

        row.appendChild(cell)
        return row
    }

    ObjectListEditor.prototype.updateScrollpads = function() {
        $('.control-scrollpad', this.popup).scrollpad('update')
    }

    //
    // Built-in Inspector management
    //

    ObjectListEditor.prototype.selectRow = function(row) {
        var tbody = row.parentNode,
            inspectorContainer = this.getInspectorContainer(),
            selectedRow = this.getSelectedRow()

        if (selectedRow) {
// TODO: validation of the currently existing Inspector is required
            this.applyDataToRow(selectedRow)
            $.oc.foundation.element.removeClass(selectedRow, 'active')
        }

        this.disposeInspector()

        $.oc.foundation.element.addClass(row, 'active')

        this.createInspectorForRow(row, inspectorContainer)
    }

    ObjectListEditor.prototype.createInspectorForRow = function(row, inspectorContainer) {
        var dataStr = row.getAttribute('data-inspector-values')

        if (dataStr === undefined || typeof dataStr !== 'string') {
            throw new Error('Values not found for the selected row.')
        }

        var properties = this.propertyDefinition.itemProperties,
            values = $.parseJSON(dataStr),
            options = {
                enableExternalParameterEditor: false,
                onChange: this.proxy(this.onInspectorDataChange)
            }

        this.currentRowInspector = new $.oc.inspector.surface(inspectorContainer, properties, values, 
            $.oc.inspector.helpers.generateElementUniqueId(inspectorContainer), options)
    }

    ObjectListEditor.prototype.disposeInspector = function() {
        $.oc.foundation.controlUtils.disposeControls(this.popup)
        this.currentRowInspector = null
    }

    ObjectListEditor.prototype.applyDataToRow = function(row) {
        if (this.currentRowInspector === null) {
            return
        }

        var data = this.currentRowInspector.getValues()
        row.setAttribute('data-inspector-values', JSON.stringify(data))
    }

    ObjectListEditor.prototype.updateRowText = function(property, value) {
        var selectedRow = this.getSelectedRow()
        
        if (!selectedRow) {
            throw new Exception('A row is not found for the updated data')
        }

        if (property !== this.propertyDefinition.titleProperty) {
            return
        }

        selectedRow.firstChild.textContent = value
    }

    ObjectListEditor.prototype.getSelectedRow = function() {
        if (!this.popup) {
            throw new Error('Trying to get selected row without a popup reference.')
        }

        var rows = this.getTableBody().children

        for (var i = 0, len = rows.length; i < len; i++) {
            if ($.oc.foundation.element.hasClass(rows[i], 'active')) {
                return rows[i]
            }
        }

        return null
    }

    ObjectListEditor.prototype.createItem = function() {
        var selectedRow = this.getSelectedRow()

        if (selectedRow) {
// TODO: validation of the currently existing Inspector is required
            this.applyDataToRow(selectedRow)
            $.oc.foundation.element.removeClass(selectedRow, 'active')
        }

        this.disposeInspector()

        var title = 'New item',
            row = this.buildTableRow(title, 'rowlink active'),
            tbody = this.getTableBody(),
            data = {}

        data[this.propertyDefinition.titleProperty] = title

        row.setAttribute('data-inspector-values', JSON.stringify(data))
        tbody.appendChild(row)

        this.selectRow(row)

        this.removeEmptyRow()
        this.updateScrollpads()
    }

    ObjectListEditor.prototype.deleteItem = function() {
        var selectedRow = this.getSelectedRow()

        if (!selectedRow) {
            return
        }

        var nextRow = selectedRow.nextElementSibling,
            prevRow = selectedRow.previousElementSibling,
            tbody = this.getTableBody()

        this.disposeInspector()
        tbody.removeChild(selectedRow)

        var newSelectedRow = nextRow ? nextRow : prevRow

        if (newSelectedRow) {
            this.selectRow(newSelectedRow)
        } else {
            tbody.appendChild(this.buildEmptyRow())
        }

        this.updateScrollpads()
    }

    ObjectListEditor.prototype.applyDataToParentInspector = function() {
        var selectedRow = this.getSelectedRow(),
            tbody = this.getTableBody(),
            dataRows = tbody.querySelectorAll('tr[data-inspector-values]'),
            link = this.getLink(),
            result = []

        if (selectedRow) {
// TODO: validation of the currently existing Inspector is required
            this.applyDataToRow(selectedRow)
        }

        for (var i = 0, len = dataRows.length; i < len; i++) {
            var dataRow = dataRows[i]

            result.push($.parseJSON(dataRow.getAttribute('data-inspector-values')))
        }

        this.inspector.setPropertyValue(this.propertyDefinition.property, result)
        this.setLinkText(link, result)

        $(link).popup('hide')
        return false
    }

    //
    // Helpers
    //

    ObjectListEditor.prototype.getLink = function() {
        return this.containerCell.querySelector('a.trigger')
    }

    ObjectListEditor.prototype.getPopupFormElement = function() {
        var form = this.popup.querySelector('form')

        if (!form) {
            throw new Error('Cannot find form element in the popup window.')
        }

        return form
    }

    ObjectListEditor.prototype.getInspectorContainer = function() {
        return this.popup.querySelector('div[data-inspector-container]')
    }

    ObjectListEditor.prototype.getTableBody = function() {
        return this.popup.querySelector('table.inspector-table-list tbody')
    }

    //
    // Event handlers
    //

    ObjectListEditor.prototype.registerHandlers = function() {
        var link = this.getLink(),
            $link = $(link)

        link.addEventListener('click', this.proxy(this.onTriggerClick))
        $link.on('shown.oc.popup', this.proxy(this.onPopupShown))
        $link.on('hidden.oc.popup', this.proxy(this.onPopupHidden))
    }

    ObjectListEditor.prototype.unregisterHandlers = function() {
        var link = this.getLink(),
            $link = $(link)

        link.removeEventListener('click', this.proxy(this.onTriggerClick))
        $link.off('shown.oc.popup', this.proxy(this.onPopupShown))
        $link.off('hidden.oc.popup', this.proxy(this.onPopupHidden))
    }

    ObjectListEditor.prototype.onTriggerClick = function(ev) {
        $.oc.foundation.event.stop(ev)

        var content = this.getPopupContent()

        content = content.replace('{{property}}', this.propertyDefinition.title)

        $(ev.target).popup({
            content: content
        })

        return false
    }

    ObjectListEditor.prototype.onPopupShown = function(ev, link, popup) {
        $(popup).on('submit.inspector', 'form', this.proxy(this.onSubmit))
        $(popup).on('click', 'tr.rowlink', this.proxy(this.onRowClick))
        $(popup).on('click.inspector', '[data-cmd]', this.proxy(this.onCommand))
        
        this.popup = popup.get(0)

        this.buildPopupContents(this.popup)
    }

    ObjectListEditor.prototype.onPopupHidden = function(ev, link, popup) {
        $(popup).off('.inspector', this.proxy(this.onSubmit))
        $(popup).off('click', 'tr.rowlink', this.proxy(this.onRowClick))
        $(popup).off('click.inspector', '[data-cmd]', this.proxy(this.onCommand))

        this.disposeInspector()
        this.popup = null
    }

    ObjectListEditor.prototype.onSubmit = function(ev) {
        this.applyDataToParentInspector()

        ev.preventDefault()
        return false
    }

    ObjectListEditor.prototype.onRowClick = function(ev) {
        this.selectRow(ev.currentTarget)
    }

    ObjectListEditor.prototype.onInspectorDataChange = function(property, value) {
        this.updateRowText(property, value)
    }

    ObjectListEditor.prototype.onCommand = function(ev) {
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

    //
    // Disposing
    //

    ObjectListEditor.prototype.removeControls = function() {
        if (this.popup) {
            this.disposeInspector(this.popup)
        }
    }

    $.oc.inspector.propertyEditors.objectList = ObjectListEditor
}(window.jQuery);