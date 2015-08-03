if (!RedactorPlugins) var RedactorPlugins = {};

(function($)
{
    RedactorPlugins.table = function()
    {
        return {
            getTemplate: function()
            {
                return String()
                + '<section id="redactor-modal-table-insert">'
                    + '<label>' + this.lang.get('rows') + '</label>'
                    + '<input type="text" size="5" value="2" id="redactor-table-rows" />'
                    + '<label>' + this.lang.get('columns') + '</label>'
                    + '<input type="text" size="5" value="3" id="redactor-table-columns" />'
                + '</section>';
            },
            init: function()
            {

                var dropdown = {};

                dropdown.insert_table = { title: this.lang.get('insert_table'), func: this.table.show };
                dropdown.insert_row_above = { title: this.lang.get('insert_row_above'), func: this.table.addRowAbove };
                dropdown.insert_row_below = { title: this.lang.get('insert_row_below'), func: this.table.addRowBelow };
                dropdown.insert_column_left = { title: this.lang.get('insert_column_left'), func: this.table.addColumnLeft };
                dropdown.insert_column_right = { title: this.lang.get('insert_column_right'), func: this.table.addColumnRight };
                dropdown.add_head = { title: this.lang.get('add_head'), func: this.table.addHead };
                dropdown.delete_head = { title: this.lang.get('delete_head'), func: this.table.deleteHead };
                dropdown.delete_column = { title: this.lang.get('delete_column'), func: this.table.deleteColumn };
                dropdown.delete_row = { title: this.lang.get('delete_row'), func: this.table.deleteRow };
                dropdown.delete_table = { title: this.lang.get('delete_table'), func: this.table.deleteTable };

                this.observe.addButton('td', 'table');
                this.observe.addButton('th', 'table');

                var button = this.button.addBefore('link', 'table', this.lang.get('table'));
                this.button.addDropdown(button, dropdown);

                button.addClass('redactor_btn_table').removeClass('redactor-btn-image')
            },
            show: function()
            {
                this.modal.addTemplate('table', this.table.getTemplate());

                this.modal.load('table', this.lang.get('insert_table'), 300);
                this.modal.createCancelButton();

                var button = this.modal.createActionButton(this.lang.get('insert'));
                button.on('click', this.table.insert);

                this.selection.save();
                this.modal.show();

                $('#redactor-table-rows').focus();

            },
            insert: function()
            {
                this.placeholder.remove();
                this.clean.cleanEmptyParagraph();
                
                var rows = $('#redactor-table-rows').val(),
                    columns = $('#redactor-table-columns').val(),
                    $tableBox = $('<div>'),
                    tableId = Math.floor(Math.random() * 99999),
                    $table = $('<table id="table' + tableId + '"><tbody></tbody></table>'),
                    i, $row, z, $column;

                for (i = 0; i < rows; i++)
                {
                    $row = $('<tr>');

                    for (z = 0; z < columns; z++)
                    {
                        $column = $('<td>' + this.opts.invisibleSpace + '</td>');

                        // set the focus to the first td
                        if (i === 0 && z === 0)
                        {
                            $column.append(this.selection.getMarker());
                        }

                        $($row).append($column);
                    }

                    $table.append($row);
                }

                $tableBox.append($table);
                var html = $tableBox.html();

                this.modal.close();
                this.selection.restore();

                if (this.table.getTable()) return;

                this.buffer.set();

                var current = this.selection.getBlock() || this.selection.getCurrent();
                if (current && current.tagName != 'BODY')
                {
                    if (current.tagName == 'LI') current = $(current).closest('ul, ol');
                    $(current).after(html);
                }
                else
                {
                    this.insert.html(html, false);
                }

                this.selection.restore();

                var table = this.$editor.find('#table' + tableId);

                if (!this.opts.linebreaks && (this.utils.browser('mozilla') || this.utils.browser('msie')))
                {
                    var $next = table.next();
                    if ($next.length === 0)
                    {
                         table.after(this.opts.emptyHtml);
                    }
                }

                this.observe.buttons();

                table.find('span.redactor-selection-marker').remove();
                table.removeAttr('id');

                this.code.sync();
                this.core.setCallback('insertedTable', table);
            },
            getTable: function()
            {
                var $table = $(this.selection.getParent()).closest('table');

                if (!this.utils.isRedactorParent($table)) return false;
                if ($table.size() === 0) return false;

                return $table;
            },
            restoreAfterDelete: function($table)
            {
                this.selection.restore();
                $table.find('span.redactor-selection-marker').remove();
                this.code.sync();
            },
            deleteTable: function()
            {
                var $table = this.table.getTable();
                if (!$table) return;

                this.buffer.set();


                var $next = $table.next();
                if (!this.opts.linebreaks && $next.length !== 0)
                {
                    this.caret.setStart($next);
                }
                else
                {
                    this.caret.setAfter($table);
                }


                $table.remove();

                this.code.sync();
            },
            deleteRow: function()
            {
            var $table = this.table.getTable();
            if (!$table) return;

            var $current = $(this.selection.getCurrent());

            this.buffer.set();

            var $current_tr = $current.closest('tr');
            var $focus_tr = $current_tr.prev().length ? $current_tr.prev() : $current_tr.next();
            if ($focus_tr.length)
            {
                var $focus_td = $focus_tr.children('td, th').first();
                if ($focus_td.length) $focus_td.prepend(this.selection.getMarker());
            }

            $current_tr.remove();
            this.table.restoreAfterDelete($table);
        },
            deleteColumn: function()
            {
            var $table = this.table.getTable();
            if (!$table) return;

            this.buffer.set();

            var $current = $(this.selection.getCurrent());
            var $current_td = $current.closest('td, th');
            var index = $current_td[0].cellIndex;

            $table.find('tr').each($.proxy(function(i, elem)
            {
                var $elem = $(elem);
                var focusIndex = index - 1 < 0 ? index + 1 : index - 1;
                if (i === 0) $elem.find('td, th').eq(focusIndex).prepend(this.selection.getMarker());

                $elem.find('td, th').eq(index).remove();

            }, this));

            this.table.restoreAfterDelete($table);
        },
            addHead: function()
            {
                var $table = this.table.getTable();
                if (!$table) return;

                this.buffer.set();

                if ($table.find('thead').size() !== 0)
                {
                    this.table.deleteHead();
                    return;
                }

                var tr = $table.find('tr').first().clone();
                tr.find('td').replaceWith($.proxy(function()
                {
                    return $('<th>').html(this.opts.invisibleSpace);
                }, this));

                $thead = $('<thead></thead>').append(tr);
                $table.prepend($thead);

                this.code.sync();

            },
            deleteHead: function()
            {
                var $table = this.table.getTable();
                if (!$table) return;

                var $thead = $table.find('thead');
                if ($thead.size() === 0) return;

                this.buffer.set();

                $thead.remove();
                this.code.sync();
            },
            addRowAbove: function()
            {
                this.table.addRow('before');
            },
            addRowBelow: function()
            {
                this.table.addRow('after');
            },
            addColumnLeft: function()
            {
                this.table.addColumn('before');
            },
            addColumnRight: function()
            {
                this.table.addColumn('after');
            },
            addRow: function(type)
            {
                var $table = this.table.getTable();
                if (!$table) return;

                this.buffer.set();

                var $current = $(this.selection.getCurrent());
                var $current_tr = $current.closest('tr');
                var new_tr = $current_tr.clone();

                new_tr.find('th').replaceWith(function()
                {
                    var $td = $('<td>');
                    $td[0].attributes = this.attributes;

                    return $td.append($(this).contents());
                });

                new_tr.find('td').html(this.opts.invisibleSpace);

                if (type == 'after')
                {
                    $current_tr.after(new_tr);
                }
                else
                {
                    $current_tr.before(new_tr);
                }

                this.code.sync();
            },
            addColumn: function (type)
            {
                var $table = this.table.getTable();
                if (!$table) return;

                var index = 0;
                var current = $(this.selection.getCurrent());

                this.buffer.set();

                var $current_tr = current.closest('tr');
                var $current_td = current.closest('td, th');

                $current_tr.find('td, th').each($.proxy(function(i, elem)
                {
                    if ($(elem)[0] === $current_td[0]) index = i;

                }, this));

                $table.find('tr').each($.proxy(function(i, elem)
                {
                    var $current = $(elem).find('td, th').eq(index);

                    var td = $current.clone();
                    td.html(this.opts.invisibleSpace);

                    if (type == 'after')
                    {
                        $current.after(td);
                    }
                    else
                    {
                        $current.before(td);
                    }

                }, this));

                this.code.sync();
            }
        };
    };
})(jQuery);