import { ControlBase, registerControl } from 'larajax';
import { validateValue, hasRequiredRule } from './datatable.validation.js';

/*
 * DataTable control
 *
 * Data attributes:
 * - data-control="datatable" - enables the control on an element
 *
 * JavaScript API:
 * oc.fetchControl(element, 'datatable')
 */
registerControl('datatable', class extends ControlBase {
    init() {
        this.config = Object.assign({
            columns: [],
            colHeaders: [],
            hotOptions: {},
            ajaxColumns: [],
            columnDependencies: {},
            alias: '',
            fieldName: '',
            dataLocker: null
        }, this.parseJsonConfig());

        this.hot = null;
        this.optionCache = {};
    }

    connect() {
        this.containerEl = this.element.querySelector('[data-hot-container]');
        this.dataInputEl = this.element.querySelector(this.config.dataLocker);

        this.initHandsontable();
        this.bindToolbar();
        this.bindFormSubmit();
        this.syncToHiddenInput();
    }

    disconnect() {
        if (this.hot) {
            this.hot.destroy();
            this.hot = null;
        }

        this.formEl = null;
        this.containerEl = null;
        this.dataInputEl = null;
    }

    parseJsonConfig() {
        var el = this.element;
        var jsonKeys = ['columns', 'colHeaders', 'hotOptions', 'ajaxColumns', 'columnDependencies'];
        var result = {};

        for (var key in el.dataset) {
            var value = el.dataset[key];
            if (jsonKeys.indexOf(key) !== -1) {
                try { result[key] = JSON.parse(value); } catch (e) { result[key] = value; }
            }
            else {
                result[key] = this.parseValue(value);
            }
        }

        return result;
    }

    initHandsontable() {
        var self = this;
        var columns = this.processColumns();

        this.lastSelectedRow = null;

        var hasPlaceholder = !!(this.config.hotOptions && this.config.hotOptions.emptyDataState);
        var lockerData = this.getLockerData();
        var initialData = lockerData.length
            ? lockerData
            : (hasPlaceholder ? [] : [{}]);

        var hotOptions = Object.assign({}, this.config.hotOptions, {
            data: initialData,
            columns: columns,
            colHeaders: this.config.colHeaders,
            contextMenu: this.buildContextMenu(),
            decimalSeparator: this.getDecimalSeparator(),
            beforeChange: function(changes, source) {
                self.onBeforeChange(changes, source);
            },
            beforePaste: function(data) {
                self.onBeforePaste(data);
            },
            beforeKeyDown: function(event) {
                self.onBeforeKeyDown(event);
            },
            afterChange: function(changes, source) {
                self.onAfterChange(changes, source);
            },
            afterRemoveRow: function() {
                self.syncToHiddenInput();
            },
            afterCreateRow: function() {
                self.syncToHiddenInput();
            },
            beforeRowMove: function() {
                self.onBeforeRowMove();
            },
            afterRowMove: function() {
                self.syncToHiddenInput();
            },
            afterUndo: function() {
                self.syncToHiddenInput();
            },
            afterRedo: function() {
                self.syncToHiddenInput();
            },
            afterSelectionEnd: function(row) {
                self.lastSelectedRow = row;
            },
            afterDeselect: function() {
                // Keep lastSelectedRow so toolbar buttons can reference it
            }
        });

        this.hot = new Handsontable(this.containerEl, hotOptions);
    }

    processColumns() {
        var self = this;

        return this.config.columns.map(function(col) {
            var processed = Object.assign({}, col);

            delete processed._validation;

            if (self.config.ajaxColumns.indexOf(col.data) !== -1) {
                processed.source = function(query, callback) {
                    self.loadOptions(col.data, this.row, query, callback);
                };
            }

            // Percentage widths resolve against the field's width when it loads
            var percent = typeof col.width === 'string' && /^\d+(\.\d+)?%$/.test(col.width) ? parseFloat(col.width) : null;
            if (percent !== null) {
                var available = self.containerEl.clientWidth;
                if (available > 0) {
                    processed.width = Math.round(available * percent / 100);
                }
                else {
                    delete processed.width;
                }
            }

            if (col._validation) {
                processed.validator = function(value, callback) {
                    callback(validateValue(col._validation, value, self.hot.getSourceDataAtRow(this.row)) === null);
                };

                // Empty cells skip validators unless they are not allowed to be empty
                if (hasRequiredRule(col._validation)) {
                    processed.allowEmpty = false;
                }
            }

            return processed;
        });
    }

    /**
     * findInvalidCell checks every cell that would be saved, returning the first that breaks its column's
     * rules as { row, col, message } in visual positions, or null
     */
    findInvalidCell() {
        var hot = this.hot;
        var columns = this.config.columns;

        for (var row = 0; row < hot.countRows(); row++) {
            var rowData = hot.getSourceDataAtRow(hot.toPhysicalRow(row));

            // Rows without values are dropped on save, so they aren't checked
            if (!rowData || !this.rowHasValues(rowData)) {
                continue;
            }

            for (var col = 0; col < hot.countCols(); col++) {
                var column = columns.find(function(item) { return item.data === hot.colToProp(col); });
                var message = column && column._validation ? validateValue(column._validation, rowData[column.data], rowData) : null;

                if (message !== null) {
                    return { row: row, col: col, message: message };
                }
            }
        }

        return null;
    }

    rowHasValues(row) {
        return Object.keys(row).some(function(key) {
            return row[key] !== null && row[key] !== '' && row[key] !== undefined;
        });
    }

    /**
     * isSaveRequest tells whether a request saves the form, the requests requireValid blocks
     */
    isSaveRequest(handler) {
        var formHandler = this.formEl ? this.formEl.getAttribute('data-request') : null;
        return !!handler && (handler === formHandler || handler === 'onSave' || /::onSave$/.test(handler));
    }

    /**
     * getDecimalSeparator returns the decimal separator of the backend locale, used to read typed numbers
     */
    getDecimalSeparator() {
        var meta = document.querySelector('meta[name="backend-locale"]');
        var locale = (meta && meta.content) || document.documentElement.lang || undefined;

        try {
            var decimal = new Intl.NumberFormat(locale).formatToParts(1.5).find(function(part) {
                return part.type === 'decimal';
            });

            return decimal ? decimal.value : '.';
        }
        catch (e) {
            return '.';
        }
    }

    getColumnConfig(prop) {
        return this.config.columns.find(function(col) {
            return col.data === prop;
        });
    }

    loadOptions(column, row, query, callback) {
        var self = this;
        var rowData = {};

        this.config.columns.forEach(function(col) {
            rowData[col.data] = self.hot.getDataAtRowProp(row, col.data);
        });

        var cacheKey = column + ':' + JSON.stringify(rowData);
        if (this.optionCache[cacheKey]) {
            callback(this.optionCache[cacheKey]);
            return;
        }

        oc.request(this.element, this.config.alias + '::onGetDropdownOptions', {
            data: { column: column, rowData: rowData },
            success: function(response) {
                var options = response.options || {};
                var sourceItems = [];

                if (Array.isArray(options)) {
                    // Plain array: key === value, but still ship as objects
                    // for consistency.
                    sourceItems = options.map(function(label) {
                        return { key: label, value: label };
                    });
                }
                else {
                    // Object form { key: label, ... }
                    sourceItems = Object.keys(options).map(function(key) {
                        return { key: key, value: options[key] };
                    });
                }

                self.optionCache[cacheKey] = sourceItems;
                callback(sourceItems);
            }
        });
    }

    buildContextMenu() {
        var items = {};
        if (this.config.adding !== false) {
            items.row_above = { name: 'Insert row above' };
            items.row_below = { name: 'Insert row below' };
        }
        if (this.config.deleting !== false) {
            items.remove_row = { name: 'Remove row' };
        }
        items.undo = { name: 'Undo' };
        items.redo = { name: 'Redo' };
        // Freeze/unfreeze items appear when manualColumnFreeze is enabled
        // (driven by the `reorderColumns` field option). The string keys are
        // intercepted by the plugin which fills in the labels.
        if (this.config.hotOptions && this.config.hotOptions.manualColumnFreeze) {
            items.freeze_column = {};
            items.unfreeze_column = {};
        }
        return { items: items };
    }

    /**
     * onBeforeKeyDown ignores select all outside the editor when the table allows one cell at a time
     */
    onBeforeKeyDown(event) {
        var isSelectAll = (event.ctrlKey || event.metaKey) && event.keyCode === 65;
        var editor = this.hot.getActiveEditor();

        if (!isSelectAll || this.hot.getSettings().selectionMode !== 'single' || (editor && editor.isOpened())) {
            return;
        }

        event.preventDefault();
        Handsontable.dom.stopImmediatePropagation(event);
    }

    /**
     * onBeforePaste keeps only the first pasted value when the table allows one cell at a time
     */
    onBeforePaste(data) {
        if (this.hot.getSettings().selectionMode !== 'single') {
            return;
        }

        data.splice(1);
        data[0].splice(1);
    }

    /**
     * onBeforeChange stores checkbox text from pastes and fills as the column's checked or unchecked value
     */
    onBeforeChange(changes, source) {
        var self = this;

        // Undo and redo put back the exact values they recorded
        if (source === 'UndoRedo.undo' || source === 'UndoRedo.redo') {
            return;
        }

        (changes || []).forEach(function(change) {
            var column = change && self.getColumnConfig(change[1]);
            if (column && column.type === 'checkbox') {
                change[3] = self.normalizeCheckboxValue(column, change[3]);
            }
        });
    }

    normalizeCheckboxValue(column, value) {
        if (value === null || value === undefined || value === column.checkedTemplate || value === column.uncheckedTemplate) {
            return value;
        }

        var text = String(value).trim().toLowerCase();

        if (text === String(column.checkedTemplate) || ['true', 'yes', 'on', 'y', 'x'].indexOf(text) !== -1) {
            return column.checkedTemplate;
        }

        if (text === String(column.uncheckedTemplate) || ['false', 'no', 'off', 'n'].indexOf(text) !== -1) {
            return column.uncheckedTemplate;
        }

        return value;
    }

    onAfterChange(changes, source) {
        if (source === 'loadData') return;

        // A dependent column reset arrives as its own change, which only needs saving
        if (source !== 'dependency') {
            this.resetDependentColumns(changes);
        }

        this.syncToHiddenInput();
    }

    resetDependentColumns(changes) {
        var self = this;
        var deps = this.config.columnDependencies;

        if (changes && Object.keys(deps).length) {
            changes.forEach(function(change) {
                var prop = change[1];
                Object.keys(deps).forEach(function(depCol) {
                    if (deps[depCol] === prop) {
                        self.hot.setDataAtRowProp(change[0], depCol, null, 'dependency');
                        Object.keys(self.optionCache).forEach(function(key) {
                            if (key.indexOf(depCol + ':') === 0) {
                                delete self.optionCache[key];
                            }
                        });
                    }
                });
            });
        }
    }

    /**
     * onBeforeRowMove makes a sorted order the row order first, so a moved row lands where it was dropped
     */
    onBeforeRowMove() {
        var sorting = this.hot.getPlugin('columnSorting');
        if (sorting && sorting.isSorted()) {
            sorting.keepSortedOrder();
        }
    }

    /**
     * getRowsInOrder returns the source rows in the order people arranged them, ignoring any column sort
     */
    getRowsInOrder() {
        var data = this.hot.getSourceData();
        var sorting = this.hot.getPlugin('columnSorting');
        var sequence = sorting ? sorting.getUnsortedIndexesSequence() : this.hot.rowIndexMapper.getIndexesSequence();

        return sequence
            .map(function(physicalRow) {
                return data[physicalRow];
            })
            .filter(function(row) {
                return !!row;
            });
    }

    getLockerData() {
        try {
            return JSON.parse(this.dataInputEl.value) || [];
        }
        catch (e) {
            return [];
        }
    }

    syncToHiddenInput() {
        var data = this.getRowsInOrder();

        var filtered = data.filter(function(row) {
            return Object.keys(row).some(function(key) {
                return row[key] !== null && row[key] !== '' && row[key] !== undefined;
            });
        });

        this.dataInputEl.value = JSON.stringify(filtered);
    }

    bindToolbar() {
        var self = this;

        this.listen('click', '[data-table-add]', function() {
            self.hot.alter('insert_row', self.hot.countRows());
        });

        this.listen('click', '[data-table-delete]', function() {
            var selected = self.hot.getSelected();
            var row = selected ? selected[0][0] : self.lastSelectedRow;
            if (row === null || row === undefined) {
                row = self.hot.countRows() - 1;
            }
            if (row >= 0) {
                self.hot.alter('remove_row', row);
                self.lastSelectedRow = null;
            }
        });

        this.listen('click', '[data-table-export]', function() {
            self.syncToHiddenInput();
            oc.request(self.element, self.config.alias + '::onExportCsv', {
                data: { tableData: self.dataInputEl.value }
            });
        });

        this.listen('click', '[data-table-import]', function() {
            var fileInput = self.element.querySelector('[data-table-import-file]');
            fileInput.value = '';
            fileInput.click();
        });

        this.listen('change', '[data-table-import-file]', function(ev) {
            var file = ev.target.files && ev.target.files[0];
            if (file) {
                file.text().then(function(text) {
                    self.importCsv(text);
                });
            }
        });

        this.listen('input', '[data-table-search]', function(ev) {
            var search = self.hot.getPlugin('search');
            search.query(ev.target.value);
            self.hot.render();
        });
    }

    /**
     * importCsv sends CSV text to the server, which matches its columns, and appends the returned rows
     */
    importCsv(text) {
        var self = this;

        oc.request(this.element, this.config.alias + '::onImportCsv', {
            data: { csvData: text },
            success: function(response) {
                self.appendRows(response.rows || []);
            }
        });
    }

    /**
     * appendRows writes rows keyed by column after the last row with a value, adding rows as needed
     */
    appendRows(rows) {
        if (!rows.length) {
            return;
        }

        var hot = this.hot;
        var colCount = hot.countCols();
        var startRow = 0;

        for (var row = hot.countRows() - 1; row >= 0; row--) {
            var hasValue = hot.getDataAtRow(row).some(function(value) {
                return value !== null && value !== '' && value !== undefined;
            });

            if (hasValue) {
                startRow = row + 1;
                break;
            }
        }

        var input = rows.map(function(rowData) {
            var values = [];
            for (var col = 0; col < colCount; col++) {
                var prop = hot.colToProp(col);
                values.push(rowData[prop] !== undefined ? rowData[prop] : null);
            }
            return values;
        });

        hot.populateFromArray(startRow, 0, input, null, null, 'CsvImport');
    }

    bindFormSubmit() {
        this.formEl = this.element.closest('form');
        if (this.formEl) {
            // Requests bubble ajax:setup through the form before it is serialized
            this.listen('ajax:setup', this.formEl, this.onBeforeFormSubmit);
        }
    }

    onBeforeFormSubmit(event) {
        this.syncToHiddenInput();

        if (!this.config.requireValid || !this.isSaveRequest(event.detail && event.detail.context && event.detail.context.handler)) {
            return;
        }

        // With requireValid, a save stops at the first invalid cell, which is flagged, selected and explained
        var invalid = this.findInvalidCell();
        if (invalid) {
            event.preventDefault();
            this.hot.setCellMeta(invalid.row, invalid.col, 'valid', false);
            this.hot.selectCell(invalid.row, invalid.col);
            this.hot.render();
            oc.flashMsg({ text: invalid.message, class: 'error', interval: 5 });
        }
    }
});