/*
 * Checkbox Range
 *
 * Provides shift-click range selection for checkbox lists.
 * When a user holds Shift and clicks a checkbox, all checkboxes
 * between the last clicked and current are set to the same state.
 *
 * Usage:
 *     oc.CheckboxRange.registerClick(ev, 'tr', 'input[type=checkbox]');
 */
export default class CheckboxRange
{
    constructor() {
        this.lastCheckbox = null;
        this.isLastChecked = true;
    }

    registerClick(ev, containerSelector, checkboxSelector) {
        const el = ev.target;

        if (this.lastCheckbox && ev.shiftKey) {
            this.selectRange(el, this.lastCheckbox, containerSelector, checkboxSelector);
        }
        else {
            this.lastCheckbox = el;
            this.isLastChecked = el.checked;
        }
    }

    selectRange(el, prevEl, containerSelector, checkboxSelector) {
        const item = el.closest(containerSelector);
        const prevItem = prevEl.closest(containerSelector);
        if (!item || !prevItem) {
            return;
        }

        const setChecked = (rows) => {
            rows.forEach((row) => {
                row.querySelectorAll(checkboxSelector).forEach((checkbox) => {
                    checkbox.checked = this.isLastChecked;
                    oc.Events.dispatch('change', { target: checkbox });
                });
            });
        };

        // Search forward
        let toSelect = [];
        let nextRow = item;
        while (nextRow) {
            if (nextRow === prevItem) {
                setChecked(toSelect);
                return;
            }
            toSelect.push(nextRow);
            nextRow = nextRow.nextElementSibling;
        }

        // Search backward
        toSelect = [];
        let prevRow = item;
        while (prevRow) {
            if (prevRow === prevItem) {
                setChecked(toSelect);
                return;
            }
            toSelect.push(prevRow);
            prevRow = prevRow.previousElementSibling;
        }
    }
}
