/*
 * Search Input
 */
import { ControlBase } from 'larajax';

export default class SearchInputControl extends ControlBase
{
    init() {
        this.$form = this.element.closest('form');
        this.$triggerEl = this.$form ? this.$form : this.element;
        this.$input = this.element.querySelector('[data-search-input]');
        this.$clearBtn = this.element.querySelector('[data-search-clear]');
        this.extraData = null;
    }

    connect() {
        this.element.classList.add('control-search');
        this.element.classList.add('size-input-text');
        this.element.classList.add('loading-indicator-container');
        this.listen('ajax:setup', this.linkToListWidget);
        this.listen('ajax:request-complete', this.$triggerEl, this.toggleClearButton);
        this.listen('input', this.$input, this.toggleClearButton);
        this.listen('click', this.$clearBtn, this.clearInput);
        this.toggleClearButton();
    }

    disconnect() {
        this.element.classList.remove('control-search');
        this.element.classList.remove('size-input-text');
        this.element.classList.remove('loading-indicator-container');
    }

    clearInput() {
        this.$input.value = '';
        this.toggleClearButton();

        if (this.$input.dataset.request) {
            oc.request(this.$input);
        }
    }

    toggleClearButton() {
        if (this.$input.value) {
            this.$clearBtn.style.display = 'block';
        }
        else {
            this.$clearBtn.style.display = 'none';
        }
    }

    // @todo this should be moved to the list widget
    linkToListWidget(ev) {
        var listId = $(this.element).closest('[data-list-linkage]').data('list-linkage');
        if (!listId) {
            return;
        }

        var $widget = $('#'+listId+' > .control-list:first');
        if (!$widget.data('oc.listwidget')) {
            return;
        }

        ev.detail.context.options.data.allChecked = $widget.listWidget('getAllChecked');
    }
}
