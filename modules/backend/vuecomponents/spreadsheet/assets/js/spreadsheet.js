export default {
    props: {
        data: {
            type: Array,
            default: function() {
                return [];
            }
        },
        columns: {
            type: Array,
            default: function() {
                return [];
            }
        },
        disabled: {
            type: Boolean,
            default: false
        },
        storageKey: {
            type: String,
            default: ''
        }
    },
    data: function() {
        return {
            hot: null,
            columnRatios: null,
            lastSelectedRow: null,
            searchResults: [],
            searchIndex: -1,
            ready: false
        };
    },
    watch: {
        disabled: function(value) {
            if (this.hot) {
                this.hot.updateSettings({ readOnly: value });
            }
        }
    },
    mounted: function() {
        this.initHandsontable();
        this.initResizeObserver();
    },
    beforeUnmount: function() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }

        if (this.hot) {
            this.hot.destroy();
            this.hot = null;
        }
    },
    methods: {
        initHandsontable: function() {
            var self = this;

            var colHeaders = [];
            var columns = [];

            this.columns.forEach(function(col) {
                colHeaders.push(col.title || col.data);
                columns.push({
                    data: col.data,
                    type: col.type || 'text',
                    readOnly: col.readOnly || false
                });
            });

            this.loadColumnRatios();

            var containerWidth = this.$refs.container.offsetWidth;
            var colWidths;

            if (this.columnRatios && this.columnRatios.length === columns.length) {
                colWidths = this.columnRatios.map(function(ratio) {
                    return Math.floor(ratio * containerWidth);
                });
            }

            var hotOptions = {
                data: this.data.length ? this.data : [{}],
                columns: columns,
                colHeaders: colHeaders,
                colWidths: colWidths,
                rowHeaders: false,
                stretchH: 'last',
                autoWrapRow: true,
                autoWrapCol: true,
                manualColumnResize: true,
                undo: true,
                minRows: 1,
                minSpareRows: 1,
                rowHeights: 30,
                width: this.$refs.container.offsetWidth,
                height: this.$refs.container.offsetHeight,
                preventOverflow: false,
                readOnly: this.disabled,
                search: true,
                licenseKey: 'non-commercial-and-evaluation',
                contextMenu: {
                    items: {
                        row_above: { name: 'Insert row above' },
                        row_below: { name: 'Insert row below' },
                        remove_row: { name: 'Remove row' },
                        undo: { name: 'Undo' },
                        redo: { name: 'Redo' }
                    }
                },
                afterChange: function(changes, source) {
                    if (source === 'loadData') {
                        return;
                    }
                    self.emitData();
                },
                afterRemoveRow: function() {
                    self.emitData();
                },
                afterCreateRow: function() {
                    self.emitData();
                },
                afterColumnResize: function() {
                    self.captureColumnRatios();
                },
                afterSelectionEnd: function(row) {
                    self.lastSelectedRow = row;
                }
            };

            this.hot = Vue.markRaw(
                new Handsontable(this.$refs.container, hotOptions)
            );

            this.ready = true;
        },

        emitData: function() {
            if (!this.ready) {
                return;
            }

            var data = this.hot.getSourceData();

            if (!Array.isArray(data)) {
                return;
            }

            var filtered = data.filter(function(row) {
                return Object.keys(row).some(function(key) {
                    return row[key] !== null && row[key] !== '' && row[key] !== undefined;
                });
            });

            this.$emit('change', filtered);
        },

        loadData: function(data) {
            if (this.hot) {
                this.ready = false;
                this.hot.loadData(data.length ? data : [{}]);
                this.ready = true;
            }
        },

        captureColumnRatios: function() {
            var colCount = this.hot.countCols();
            var totalWidth = 0;
            var widths = [];

            for (var i = 0; i < colCount; i++) {
                var w = this.hot.getColWidth(i);
                widths.push(w);
                totalWidth += w;
            }

            if (totalWidth > 0) {
                this.columnRatios = widths.map(function(w) {
                    return w / totalWidth;
                });
                this.saveColumnRatios();
            }
        },

        loadColumnRatios: function() {
            if (!this.storageKey) {
                return;
            }

            try {
                var stored = localStorage.getItem('spreadsheet-ratios-' + this.storageKey);
                if (stored) {
                    this.columnRatios = JSON.parse(stored);
                }
            }
            catch (e) {
                // Ignore storage errors
            }
        },

        saveColumnRatios: function() {
            if (!this.storageKey || !this.columnRatios) {
                return;
            }

            try {
                localStorage.setItem('spreadsheet-ratios-' + this.storageKey, JSON.stringify(this.columnRatios));
            }
            catch (e) {
                // Ignore storage errors
            }
        },

        initResizeObserver: function() {
            var self = this;
            var parentEl = this.$el.parentElement;

            this.resizeObserver = new ResizeObserver(function() {
                if (self.hot && parentEl) {
                    var newWidth = parentEl.offsetWidth;
                    var settings = {
                        width: newWidth,
                        height: parentEl.offsetHeight
                    };

                    if (self.columnRatios) {
                        settings.colWidths = self.columnRatios.map(function(ratio) {
                            return Math.floor(ratio * newWidth);
                        });
                    }

                    self.hot.updateSettings(settings);
                }
            });

            this.resizeObserver.observe(parentEl);
        },

        addRow: function() {
            if (!this.hot) {
                return;
            }

            var selected = this.hot.getSelected();
            var row = selected ? selected[0][0] : this.lastSelectedRow;

            if (row === null || row === undefined) {
                row = this.hot.countRows() - 1;
            }

            this.hot.alter('insert_row', row + 1);
        },

        deleteRow: function() {
            if (!this.hot) {
                return;
            }

            var selected = this.hot.getSelected();
            var row = selected ? selected[0][0] : this.lastSelectedRow;

            if (row === null || row === undefined) {
                row = this.hot.countRows() - 1;
            }

            if (row >= 0) {
                this.hot.alter('remove_row', row);
                this.lastSelectedRow = null;
            }
        },

        search: function(query) {
            if (!this.hot) {
                return;
            }

            this.clearSearchFocus();

            var plugin = this.hot.getPlugin('search');
            this.searchResults = plugin.query(query || '');
            this.searchIndex = -1;
            this.hot.render();

            if (this.searchResults.length > 0) {
                this.searchIndex = 0;
                this.applySearchFocus();
                this.hot.scrollViewportTo(this.searchResults[0].row, this.searchResults[0].col);
            }
        },

        searchNext: function() {
            if (!this.hot || this.searchResults.length === 0) {
                return;
            }

            this.clearSearchFocus();
            this.searchIndex = (this.searchIndex + 1) % this.searchResults.length;
            this.applySearchFocus();

            var result = this.searchResults[this.searchIndex];
            this.hot.scrollViewportTo(result.row, result.col);
        },

        applySearchFocus: function() {
            if (this.searchIndex < 0 || !this.hot) {
                return;
            }

            var result = this.searchResults[this.searchIndex];
            var meta = this.hot.getCellMeta(result.row, result.col);
            var cls = meta.className || '';
            meta.className = (cls + ' htSearchFocus').trim();
            this.hot.render();
        },

        clearSearchFocus: function() {
            if (this.searchIndex < 0 || !this.hot) {
                return;
            }

            var result = this.searchResults[this.searchIndex];
            var meta = this.hot.getCellMeta(result.row, result.col);
            if (meta.className) {
                meta.className = meta.className.replace(/\bhtSearchFocus\b/g, '').trim();
            }
        },

        render: function() {
            if (this.hot) {
                this.hot.render();
            }
        }
    }
};
