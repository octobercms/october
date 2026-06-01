import { ControlBase, registerControl } from 'larajax';

/*
 * DataTable Handsontable control
 *
 * Data attributes:
 * - data-control="datatable-handsontable" - enables the control on an element
 *
 * JavaScript API:
 * oc.fetchControl(element, 'datatable-handsontable')
 */
registerControl('datatable-handsontable', class extends ControlBase {
    init() {
        this.config = Object.assign({
            columns: [],
            data: [],
            colHeaders: [],
            hotOptions: {},
            ajaxColumns: [],
            columnDependencies: {},
            alias: '',
            fieldName: ''
        }, this.parseJsonConfig());

        this.hot = null;
        this.optionCache = {};
    }

    connect() {
        this.containerEl = this.element.querySelector('[data-hot-container]');
        this.dataInputEl = this.element.querySelector('[data-table-data]');

        this.initHandsontable();
        this.bindToolbar();
        this.bindFormSubmit();
        this.syncToHiddenInput();
        this.initVisibilityObserver();
    }

    disconnect() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }

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
        var jsonKeys = ['columns', 'data', 'colHeaders', 'hotOptions', 'ajaxColumns', 'columnDependencies'];
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

        var hotOptions = Object.assign({}, this.config.hotOptions, {
            data: this.config.data.length ? this.config.data : [{}],
            columns: columns,
            colHeaders: this.config.colHeaders,
            contextMenu: this.buildContextMenu(),
            afterChange: function(changes, source) {
                self.onAfterChange(changes, source);
            },
            afterRemoveRow: function() {
                self.syncToHiddenInput();
            },
            afterCreateRow: function() {
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

    initVisibilityObserver() {
        var hot = this.hot;
        var rendered = false;
        this.observer = new IntersectionObserver(function(entries) {
            if (entries[0].isIntersecting && !rendered) {
                rendered = true;
                hot.render();
            }
        });
        this.observer.observe(this.containerEl);
    }

    processColumns() {
        var self = this;

        return this.config.columns.map(function(col) {
            var processed = Object.assign({}, col);

            delete processed._validation;
            delete processed._optionMap;

            if (self.config.ajaxColumns.indexOf(col.data) !== -1) {
                processed.source = function(query, callback) {
                    self.loadOptions(col.data, this.row, query, callback);
                };
            }

            if (col._validation) {
                processed.validator = function(value, callback) {
                    callback(self.validate(col._validation, value));
                };
            }

            return processed;
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
                var displayValues = [];

                if (Array.isArray(options)) {
                    displayValues = options;
                }
                else {
                    displayValues = Object.values(options);
                }

                self.optionCache[cacheKey] = displayValues;
                callback(displayValues);
            }
        });
    }

    validate(rules, value) {
        if (!value && rules.required) {
            return false;
        }
        if (rules.integer && value && !Number.isInteger(Number(value))) {
            return false;
        }
        if (rules.float && value && isNaN(parseFloat(value))) {
            return false;
        }
        if (rules.regex && value && !new RegExp(rules.regex.pattern).test(value)) {
            return false;
        }
        return true;
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
        return { items: items };
    }

    onAfterChange(changes, source) {
        if (source === 'loadData' || source === 'dependency') return;

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

        this.syncToHiddenInput();
    }

    syncToHiddenInput() {
        var data = this.hot.getSourceData();

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
            oc.request(self.element, self.config.alias + '::onExportCsv', {
                data: { tableData: self.dataInputEl.value },
                download: true
            });
        });

        this.listen('input', '[data-table-search]', function(ev) {
            var search = self.hot.getPlugin('search');
            search.query(ev.target.value);
            self.hot.render();
        });
    }

    bindFormSubmit() {
        this.formEl = this.element.closest('form');
        if (this.formEl) {
            this.listen('ajaxBeforeSend', this.formEl, this.onBeforeFormSubmit);
        }
    }

    onBeforeFormSubmit() {
        this.syncToHiddenInput();
    }
});