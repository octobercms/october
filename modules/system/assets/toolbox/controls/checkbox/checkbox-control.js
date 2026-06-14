/*
 * Checkbox Control
 *
 * Adds indeterminate (tri-state) checkbox support.
 *
 * Indeterminate checkboxes cycle: unchecked → indeterminate → checked → unchecked
 * Usage: <div class="form-check is-indeterminate" data-control="checkbox">
 */
import { ControlBase } from 'larajax';

export default class CheckboxControl extends ControlBase
{
    init() {
        this.$input = this.element.querySelector('input[type=checkbox]');
    }

    connect() {
        if (this.$input) {
            this.initIndeterminateState();
            this.listen('click', this.$input, this.onClickCycleState);
        }
    }

    disconnect() {
        this.$input = null;
    }

    initIndeterminateState() {
        const checked = parseInt(this.$input.dataset.checked);

        switch (checked) {
            // Indeterminate
            case 1:
                this.$input.indeterminate = true;
                break;

            // Checked
            case 2:
                this.$input.indeterminate = false;
                this.$input.checked = true;
                break;

            // Unchecked
            default:
                this.$input.indeterminate = false;
                this.$input.checked = false;
        }
    }

    onClickCycleState() {
        let checked = parseInt(this.$input.dataset.checked);

        if (isNaN(checked)) {
            checked = this.$input.checked ? 1 : 0;
        }

        switch (checked) {
            // Unchecked, going indeterminate
            case 0:
                this.$input.dataset.checked = 1;
                this.$input.indeterminate = true;
                break;

            // Indeterminate, going checked
            case 1:
                this.$input.dataset.checked = 2;
                this.$input.indeterminate = false;
                this.$input.checked = true;
                break;

            // Checked, going unchecked
            default:
                this.$input.dataset.checked = 0;
                this.$input.indeterminate = false;
                this.$input.checked = false;
        }
    }
}

// Auto-discover
// ============================

addEventListener('render', function() {
    document.querySelectorAll('.form-check.is-indeterminate:not([data-control~="checkbox"])').forEach(function(element) {
        element.dataset.control = ((element.dataset.control || '') + ' checkbox').trim();
    });
});
