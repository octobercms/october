(function ($) {
    'use strict';

    window.RedactorPlugins = window.RedactorPlugins || {}

    var Table = function (redactor) {
        this.redactor = redactor
    }

    Table.prototype = {
        control: {
            rowUp     : { text: 'Add row above' },
            rowDown   : { text: 'Add row below' },
            colLeft   : { text: 'Add column left' },
            colRight  : { text: 'Add column right' },
            addHead   : { text: 'Add header' },
            delHead   : { text: 'Delete header' },
            delCol    : { text: 'Delete column' },
            delRow    : { text: 'Delete row' },
            delTable  : { text: 'Delete table' },
            stripe    : { text: 'Striped row' },
            border    : { text: 'Borders on rows' },
            fullBorder: { text: 'Borders everywhere' }
        },

        controlGroup: [ 'up', 'down', '|', {
            'Table Options': [
                'rowUp', 'rowDown', 'colLeft', 'colRight', '|',
                'addHead', 'delHead', '|',
                'delCol', 'delRow', 'delTable', '|',
                'border', 'stripe', 'fullBorder'
            ]
        }, 'remove'],

        insertTable: function (rows, columns) {

            this.redactor.buffer.set(false)

            var $tableBox = $('<div></div>'),
                tableId = Math.floor(Math.random() * 99999),
                $table = $('<table id="table' + tableId + '">'),
                $thead = $('<thead>').appendTo($table),
                $tbody = $('<tbody>').appendTo($table),
                $row,
                $column

            $row = $('<tr>').appendTo($thead)

            for (var z = 0; z < columns; z++) {
                $('<th>Header</th>').appendTo($row)
            }

            for (var i = 0; i < rows; i++) {
                $row = $('<tr>')

                for (var z = 0; z < columns; z++) {
                    $column = $('<td>Data</td>')

                    /*
                     * Set the focus to the first table data row
                     */
                    if (i === 0 && z === 0) {
                        $column.append('<span id="selection-marker-1">' + this.redactor.opts.invisibleSpace + '</span>')
                    }

                    $($row).append($column)
                }

                $tbody.append($row)
            }

            $('<figure data-type="table">').addClass('oc-table oc-table-bordered-rows').append($table).appendTo($tableBox)
            var html = $tableBox.html()

            this.redactor.modal.close()
            this.redactor.selection.restore()

            var current = this.redactor.selection.getBlock() || this.redactor.selection.getCurrent()
            if (current) {
                $(current).after(html)
            }
            else {
                this.redactor.insert.html(html)
            }

            this.redactor.selection.restore()

            var table = this.redactor.$editor.find('#table' + tableId)

            table.find('span#selection-marker-1').remove()
            table.removeAttr('id')

            this.redactor.code.sync()

        },

        command: function (command, $figure, $target) {

            switch (command) {
            case 'rowUp':
            case 'rowDown':
                $.proxy(function () {
                    var $row = $target.closest('tr'),
                        $clone = $('<tr>'),
                        childCount = $row.children().length

                    for (var i = 0; i < childCount; i++) {
                        $('<td>').text('Data').appendTo($clone)
                    }

                    if (command === 'rowUp') {
                        $clone.insertBefore($row)
                    }
                    else {
                        $clone.insertAfter($row)
                    }

                }, this)()
                break

            case 'colLeft':
            case 'colRight':
                $.proxy(function () {
                    var $cell = $target.closest('td'),
                        $row = $cell.closest('tr'),
                        $table = $row.closest('table'),
                        position = $row.children().index($cell) + 1,
                        insertPosition = command === 'colLeft' ? 'before' : 'after'

                    $table.find('thead tr').children(':nth-child(' + position + ')')[insertPosition]($('<th>').text('Header'))
                    $table.find('tbody tr').children(':nth-child(' + position + ')')[insertPosition]($('<td>').text('Data'))
                }, this)()
                break

            case 'addHead':
                if (!$figure.find('table thead').length) {
                    $.proxy(function () {
                        var numCols = $figure.find('tr').first().children().length,
                            $table = $figure.find('table'),
                            $thead = $('<thead>').prependTo($table),
                            $row = $('<tr>').appendTo($thead)

                        for (var i = 0; i < numCols; i++) {
                            $('<th>').text('Header').appendTo($row)
                        }
                    }, this)()
                }
                break

            case 'delHead':
                $figure.find('thead').remove()
                break

            case 'delCol':
                $.proxy(function () {
                    var $cell = $target.closest('td'),
                        position = $cell.parent().children().index($cell) + 1

                    $cell.closest('table').find('tr').children(':nth-child(' + position + ')').remove()
                }, this)()
                break

            case 'delRow':
                $target.closest('tr').remove()
                break

            case 'delTable':
                $figure.remove()
                break

            case 'border':
                $figure.removeClass('oc-table-bordered-all').toggleClass('oc-table-bordered-rows')
                break

            case 'stripe':
                $figure.toggleClass('oc-table-striped')
                break

            case 'fullBorder':
                $figure.removeClass('oc-table-bordered-rows').toggleClass('oc-table-bordered-all')
                break
            }
        }
    }

    window.RedactorPlugins.table = function() {
        return {
            init: function () {
                this.table = new Table(this)

                var button = this.button.addBefore('link', 'table', 'Table')
                this.button.addCallback(button, $.proxy(function () {

                    /*
                     * Save cursor position
                     */
                    this.selection.save()

                    var callback = $.proxy(function () {
                        setTimeout(function () {
                            $('#redactor_table_rows').trigger('focus')
                        }, 200)

                    }, this)

                    var insert = $.proxy(function () {
                        this.table.insertTable($('#redactor_table_rows').val(), $('#redactor_table_columns').val())
                        this.button.setInactive('table')
                    }, this)

                    var modal = String()
                        + '<section id="redactor-modal-table-insert">'
                            + '<label>' + this.opts.curLang.rows + '</label>'
                            + '<input type="text" size="5" value="2" id="redactor_table_rows" class="redactor_input">'
                            + '<label>' + this.opts.curLang.columns + '</label>'
                            + '<input type="text" size="5" value="3" id="redactor_table_columns" class="redactor_input">'
                        + '</section>'

                    this.modal.addTemplate('insert-table', modal)
                    this.modal.addCallback('insert-table', callback)
                    this.modal.load('insert-table', 'Insert Table', 500)

                    this.modal.createCancelButton()
                    this.modal.createActionButton(this.lang.get('insert')).on('click', insert)
                    this.modal.show()

                }, this))

                button.addClass('redactor_btn_table').removeClass('redactor-btn-image')
            }
        }
    }

}(jQuery));