'use strict';

/**
 * Reordering class for dashboard row drag-and-drop reordering.
 */
export default class Reordering
{
    static instance() {
        return this.$instance || (this.$instance = new this);
    }

    onMouseDown(ev, row, rows) {
        const rowElement = ev.target.closest('[data-report-row]');
        const buttonElement = ev.target.closest('[data-edit-row-button]');
        const rowsContainerElement = ev.target.closest('.rows-container');

        this.dragState = {
            startY: ev.pageY,
            rowElement,
            buttonElement,
            rowsContainerElement,
            row: row,
            rows: rows,
            paused: false
        };

        document.addEventListener('mousemove', (ev) => this.onMouseMove(ev), { passive: true });
        document.addEventListener('mouseup', (ev) => this.onMouseUp(ev));
    }

    onMouseMove(ev) {
        if (ev.buttons != 1) {
            // Handle the case when the button was released
            // outside of the viewport. mouseup doesn't fire
            // in that case.
            //
            this.onMouseUp();
        }

        if (!this.dragState) {
            return;
        }

        const dy = this.updateButtonPosition(ev);

        if (this.dragState.paused) {
            return;
        }

        const { rowElement, rows, row, buttonElement } = this.dragState;
        rowElement.classList.add('reordering');
        buttonElement.blur();
        const box = rowElement.getBoundingClientRect();

        let swapIndex = this.shouldSwap(box.top + dy, rows.indexOf(row));
        if (swapIndex !== -1) {
            const thisIndex = rows.indexOf(row);
            if (this.swapRows(thisIndex, swapIndex)) {
                this.dragState.startY = ev.pageY;
                if (thisIndex > swapIndex) {
                    this.dragState.startY -= box.height;
                }

                this.dragState.paused = true;

                // Let the transition finish before resuming
                this.updateButtonPosition(ev);
                setTimeout(() => {
                    if (this.dragState) {
                        this.dragState.paused = false;
                    }
                }, 210);
            }
        }
    }

    onMouseUp() {
        if (this.dragState) {
            // Suppress the context menu
            const { rowElement, buttonElement } = this.dragState;
            setTimeout(() => rowElement.classList.remove('reordering'), 0);
            buttonElement.style.transform = `translateY(0)`;
        }

        this.dragState = null;
    }

    updateButtonPosition(ev) {
        const { startY, buttonElement } = this.dragState;
        const dy = ev.pageY - startY;
        buttonElement.style.transform = `translateY(${dy}px)`;
        return dy;
    }

    shouldSwap(newY, currentIndex) {
        const { rowsContainerElement } = this.dragState;
        const rows = Array.from(rowsContainerElement.querySelectorAll('[data-report-row]'));
        let newRow = null;
        let newRowIndex = -1;

        rows.forEach((row, index) => {
            const box = row.getBoundingClientRect();
            if (newY > box.top && newY < box.bottom && index !== currentIndex) {
                newRow = row;
                newRowIndex = index;
            }
        });

        return newRowIndex;
    }

    swapRows(rowIndex1, rowIndex2) {
        const { rows } = this.dragState;
        if (rowIndex1 < 0 || rowIndex2 < 0 || rowIndex1 >= rows.length || rowIndex2 >= rows.length) {
            // One or both row indexes are out of bounds
            return false;
        }

        // Swap rows - Vue 3: Direct array index assignment is reactive
        const temp = rows[rowIndex1];
        rows[rowIndex1] = rows[rowIndex2];
        rows[rowIndex2] = temp;

        return true;
    }
}
