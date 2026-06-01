import { ControlBase, registerControl } from 'larajax';

registerControl('relation-quick-create', class extends ControlBase {
    init() {
        this.config = Object.assign({
            handlerLoad: null,
            quickCreateValue: '__quick_create__',
            popupSize: null
        }, this.config);
        this.previousValue = null;
    }

    connect() {
        this.$el = $(this.element);
        this.$select = this.$el.find('select').first();
        this.previousValue = this.$select.val();
        this.listen('change', 'select', this.onSelectChange);
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
