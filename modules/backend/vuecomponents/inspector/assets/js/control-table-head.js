/*
 * Vue Inspector table control implementation
 */
export default {
    props: {
        columns: Array
    },
    data: function () {
        return {
            draggedHandle: null,
            draggedColumnIndex: null,
            draggedColumnInitialPosition: null,
            draggedColumnInitialWidth: null,
            columnWidth: {},
            minColumnSize: 50 // TODO - make a property of columns
        };
    },
    computed: {
        columnsHash: function computeColumnsHash() {
            var str = JSON.stringify(this.columns);

            var hash = 0;
            if (str.length == 0) {
                return hash
            };

            for (i = 0; i < str.length; i++) {
                char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32bit integer
            }

            return hash;
        },

        columnsWidthStorageKey: function computeColumnsWidthStorageKey() {
            return 'inspector-table-column-width-' + this.columnsHash;
        }
    },
    methods: {
        initCellWidths: function initCellWidths(column) {
            var cells = column.closest('thead').find('th'),
                component = this,
                lastIndex = cells.length - 1,
                widthList = []

            cells.each(function (index, cell) {
                var $cell = $(cell);

                if ($cell.data('widthSet')) {
                    return;
                }

                var width = $cell.width();

                widthList.push(width);
                $cell.data('widthSet', true);

                // Vue 3: Direct assignment is reactive
                component.columnWidth[index] = width;
            });

            for (var index = 0; index < widthList.length; index++) {
                $(cells[index]).width(widthList[index]);
            }
        },

        onHandleMouseDown: function onHandleMouseDown(ev) {
            if (!$(ev.target).hasClass('cell-resize-handle')) {
                return;
            }

            this.draggedHandle = ev.target;
            var column = $(this.draggedHandle).closest('th');

            this.containerSize = $(this.$el).width();
            this.draggedColumnIndex = column.index();
            this.draggedColumnInitialPosition = $(this.draggedHandle).offset().left;

            this.initCellWidths(column);

            this.draggedColumnInitialWidth = this.columnWidth[this.draggedColumnIndex];
            $(document.body).addClass('splitter-dragging-vertical');

            document.addEventListener('mousemove', this.onMouseMove, { passive: true });
            document.addEventListener('mouseup', this.onMouseUp);
        },

        onMouseMove: function onMouseMove(ev) {
            if (ev.buttons != 1) {
                // Handle the case when the button was released
                // outside of the viewport. mouseup doesn't fire
                // in that case.
                //
                this.onMouseUp();
            }

            var delta = ev.pageX - this.draggedColumnInitialPosition,
                minSize = this.minColumnSize,
                newWidth = 0,
                widthDelta = 0;

            newWidth = Math.max(this.draggedColumnInitialWidth - delta, minSize);

            if (delta < 0) {
                // Dragging to the left, increasing the current
                // column width and potentially shrinking a
                // previous column.

                var maxWidth = this.columnWidth[this.draggedColumnIndex]
                    + this.columnWidth[this.draggedColumnIndex - 1]
                    - minSize;

                newWidth = Math.min(newWidth, maxWidth);
            }

            widthDelta = this.columnWidth[this.draggedColumnIndex] - newWidth;

            var newPrevColumnWidth = this.columnWidth[this.draggedColumnIndex - 1] + widthDelta;
            // Vue 3: Direct assignment is reactive
            this.columnWidth[this.draggedColumnIndex - 1] = newPrevColumnWidth;
            this.columnWidth[this.draggedColumnIndex] = newWidth;
        },

        onMouseUp: function onMouseUp() {
            this.draggedHandle = null;

            document.removeEventListener('mousemove', this.onMouseMove, { passive: true });
            document.removeEventListener('mouseup', this.onMouseUp);

            $(document.body).removeClass('splitter-dragging-vertical');

            localStorage.setItem(this.columnsWidthStorageKey, JSON.stringify(this.columnWidth));
        }
    },
    mounted: function () {
        var storedWidth = localStorage.getItem(this.columnsWidthStorageKey);
        if (!storedWidth) {
            return;
        }

        try {
            storedWidth = JSON.parse(storedWidth);

            if (typeof storedWidth !== 'object') {
                return;
            }

            var keys = Object.keys(storedWidth);
            for (var index = 0; index < keys.length; index++) {
                if (index !== 0) {
                    // Vue 3: Direct assignment is reactive
                    this.columnWidth[keys[index]] = storedWidth[index];
                }
            }
        }
        catch (e) { }
    }
};
