import { ControlBase, registerControl } from 'larajax';

registerControl('relation-quick-create', class extends ControlBase {
    init() {
        this.config = Object.assign({
            handlerLoad: null,
            quickCreateValue: '__quick_create__',
            popupSize: null,
            quickCreated: false
        }, this.config);
        this.previousValue = null;
    }

    connect() {
        this.$el = $(this.element);
        this.$select = this.$el.find('select').first();
        this.previousValue = this.$select.val();

        // Never revert to the sentinel value if it was selected by default
        if (this.previousValue === this.config.quickCreateValue) {
            this.previousValue = '';
        }

        this.listen('change', 'select', this.onSelectChange);

        // Notify dependent fields after a record is quick created
        if (this.config.quickCreated) {
            this.element.removeAttribute('data-quick-created');
            this.$select.trigger('change');
        }
    }

    disconnect() {
        this.$select = null;
        this.$el = null;
    }

    onSelectChange() {
        var value = this.$select.val();
        if (value !== this.config.quickCreateValue) {
            this.previousValue = value;
            return;
        }

        // Revert dropdown to previous value
        this.$select.val(this.previousValue);
        this.$select.trigger('change.select2');

        // Open popup
        this.$el.popup({
            handler: this.config.handlerLoad,
            size: this.config.popupSize || undefined,
            extraData: { _relation_quick_create: 1 }
        });
    }
});
