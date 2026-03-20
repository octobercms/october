'use strict';

import Sizing from './sizing.js';

/**
 * Dragging class for dashboard widget drag-and-drop.
 */
export default class Dragging
{
    constructor() {
        document.addEventListener('dragend', (ev) => this.onDragEnd(ev));
        this.boundDragEnd = this.onDragEnd.bind(this);
        this.store = null;
        this.sizing = Sizing.instance();
    }

    static instance() {
        return this.$instance || (this.$instance = new this);
    }

    setStore(store) {
        this.store = store;
    }

    onDragStart(ev, widget, widgetIndexInRow, rows, row) {
        this.dragState = {
            rowWithWidget: row,
            widgetIndexInRow: widgetIndexInRow,

            draggedWidget: widget,
            originalWidth: widget.width,
            originalRows: rows,
            originalRowsCopy: JSON.parse(JSON.stringify(rows)),
            dropOccurred: false
        };

        this.store.setSystemDataFlag(widget, 'dragged', true);
        $(ev.target)
            .closest('[data-report-container]')
            .addClass('dragging');

        this.createDragClone(ev);
        document.addEventListener('mouseup', this.boundDragEnd);
    }

    onDragOverWidget(ev, targetIndexInRow, row) {
        if (!this.dragState) {
            return;
        }
        ev.preventDefault();
        this.putWidgetAtRowIndex(row, targetIndexInRow);
    }

    onDragOverRow(ev, row) {
        if (!this.dragState) {
            return;
        }

        ev.preventDefault();

        const sourceRow = this.dragState.rowWithWidget;
        const isSameRow = sourceRow === row;
        const rowWidgetsLen = row.widgets.length;

        if (isSameRow && rowWidgetsLen > 0 && row.widgets[rowWidgetsLen-1] === this.dragState.draggedWidget) {
            return;
        }

        this.putWidgetAtRowIndex(row, row.widgets.length, true);
    }

    onDragEnd(ev) {
        ev.preventDefault();

        if (!this.dragState) {
            return;
        }

        document.removeEventListener('mouseup', this.boundDragEnd);

        if (!this.dragState.dropOccurred) {
            this.restoreRows();
        }

        this.store.setSystemDataFlag(this.dragState.draggedWidget, 'dragged', false);
        this.dragState = null;
        $('[data-report-container]').removeClass('dragging');
    }

    onDrop(ev) {
        if (!this.dragState) {
            return;
        }

        this.dragState.draggedWidget.width = this.dragState.originalWidth;
        this.dragState.dropOccurred = true;

        this.onDragEnd(ev)
    }

    restoreRows() {
        this.dragState.originalRows.splice(0);
        for (let i = 0; i < this.dragState.originalRowsCopy.length; i++) {
            this.dragState.originalRows.push(this.dragState.originalRowsCopy[i]);
        }
    }

    putWidgetAtRowIndex(row, targetIndexInRow, droppingAtRow) {
        const sourceRow = this.dragState.rowWithWidget;
        const isSameRow = sourceRow === row;
        if (isSameRow && targetIndexInRow === this.dragState.widgetIndexInRow) {
            return;
        }

        if (!isSameRow && !this.sizing.canFitNewWidget(row.widgets, this.dragState.originalWidth)) {
            if (this.store.getSystemDataFlag(row, 'widgetDoesntFit')) {
                return;
            }

            this.store.setSystemDataFlag(row, 'widgetDoesntFit', true);
            setTimeout(() => {
                this.store.setSystemDataFlag(row, 'widgetDoesntFit', false);
            }, 2000);

            return;
        }

        const widget = sourceRow.widgets.splice(this.dragState.widgetIndexInRow, 1)[0];
        if (isSameRow && droppingAtRow) {
            targetIndexInRow--;
        }

        if (row.widgets && targetIndexInRow >= 0 && row.widgets.length > targetIndexInRow) {
            const targetWidgetWidth = row.widgets[targetIndexInRow].width;
            // Match the width to avoid flickering
            // when swapping widgets.
            widget.width = targetWidgetWidth;
        }

        row.widgets.splice(targetIndexInRow, 0, widget);
        this.dragState.widgetIndexInRow = targetIndexInRow;
        this.dragState.rowWithWidget = row;
    }

    createDragClone(ev) {
        const draggedNode = ev.target;
        const clone = draggedNode.cloneNode(true);
        clone.style.width = draggedNode.offsetWidth + 'px';
        clone.classList.add('widget-clone');
        draggedNode.parentNode.appendChild(clone);
        this.draggedWidgetWidth = draggedNode.offsetWidth;

        const rect = draggedNode.getBoundingClientRect();
        ev.dataTransfer.effectAllowed = 'move';
        ev.dataTransfer.setDragImage(clone, ev.clientX - rect.left, ev.clientY - rect.top);

        setTimeout(function () {
            draggedNode.parentNode.removeChild(clone);
        }, 0);
    }
}
