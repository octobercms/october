/*
 * Scripts for the Import controller behavior.
 */
+function ($) { "use strict";

    var ImportBehavior = function() {

        this.processImport = function () {
            var $form = $('#importFileColumns').closest('form')

            $form.request('onImport', {
                success: function(data) {
                    $('#importContainer').html(data.result)
                    $(document).trigger('render')
                }
            })
        }

        this.loadFileColumnSample = function(el) {
            var $el = $(el),
                $column = $el.closest('[data-column-id]'),
                columnId = $column.data('column-id')

            $el.popup({
                handler: 'onImportLoadColumnSampleForm',
                extraData: {
                    file_column_id: columnId
                }
            })
        }

        this.bindColumnSorting = function() {
            /*
             * Unbind existing
             */
            $('#importDbColumns > ul, .import-column-bindings > ul').each(function(){
                var $this = $(this)
                if ($this.data('oc.sortable')) {
                    $this.sortable('destroyGroup')
                    $this.sortable('destroy')
                }
            })

            var sortableOptions = {
                group: 'import-fields',
                usePlaceholderClone: true,
                nested: false,
                onDrop: $.proxy(this.onDropColumn, this)
            }

            $('#importDbColumns > ul, .import-column-bindings > ul').sortable(sortableOptions)
        }

        this.onDropColumn = function ($dbItem, container, _super, event) {
            var
                $fileColumns = $('#importFileColumns'),
                $fileItem,
                isMatch = $.contains($fileColumns.get(0), $dbItem.get(0)),
                matchColumnId

            /*
             * Has a previous match?
             */
            matchColumnId = $dbItem.data('column-matched-id')
            if (matchColumnId !== null) {
                $fileItem = $('[data-column-id='+matchColumnId+']', $fileColumns)
                this.toggleMatchState($fileItem)
            }

            /*
             * Is a new match?
             */
            if (isMatch) {
                $fileItem = $dbItem.closest('[data-column-id]'),
                this.matchColumn($dbItem, $fileItem)
            }
            else {
                this.unmatchColumn($dbItem)
            }

            if (_super) {
                _super($dbItem, container)
            }
        }

        this.toggleMatchState = function ($container) {
            var hasItems = !!$('.import-column-bindings li', $container).length
            $container.toggleClass('is-matched', hasItems)
        }

        this.ignoreFileColumn = function(el) {
            var $el = $(el),
                $column = $el.closest('[data-column-id]')

            $column.addClass('is-ignored')
            $('#showIgnoredColumnsButton').removeClass('disabled')
        }

        this.showIgnoredColumns = function() {
            $('#importFileColumns li.is-ignored').removeClass('is-ignored')
            $('#showIgnoredColumnsButton').addClass('disabled')
        }

        this.autoMatchColumns = function() {
            var self = this,
                fileColumns = {},
                $this,
                name

            $('#importFileColumns li').each(function() {
                $this = $(this)
                name = $.trim($('.column-label', $this).text())
                fileColumns[name] = $this
            })

            $('#importDbColumns li').each(function() {
                $this = $(this)
                name = $.trim($('> span', $this).text())
                if (fileColumns[name]) {

                    $this.appendTo($('.import-column-bindings > ul', fileColumns[name]))
                    self.matchColumn($this, fileColumns[name])
                }
            })
        }

        this.matchColumn = function($dbItem, $fileItem) {
            var matchColumnId = $fileItem.data('column-id'),
                dbColumnName = $dbItem.data('column-name'),
                $dbItemMatchInput = $('[data-column-match-input]', $dbItem)

            this.toggleMatchState($fileItem)

            $dbItem.data('column-matched-id', matchColumnId)
            $dbItemMatchInput.attr('name', 'column_match['+matchColumnId+'][]')
            $dbItemMatchInput.attr('value', dbColumnName)
        }

        this.unmatchColumn = function($dbItem) {
            var $dbItemMatchInput = $('[data-column-match-input]', $dbItem)

            $dbItem.removeData('column-matched-id')
            $dbItemMatchInput.attr('name', '');
            $dbItemMatchInput.attr('value', '');
        }
    }

    $.oc.importBehavior = new ImportBehavior;
}(window.jQuery);