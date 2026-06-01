import { ControlBase, registerControl } from 'larajax';

/*
 * RecordFinder control
 *
 * Data attributes:
 * - data-control="recordfinder" - enables the control on an element
 *
 * JavaScript API:
 * oc.fetchControl(element, 'recordfinder')
 */
registerControl('recordfinder', class extends ControlBase {
    init() {
        this.config = Object.assign({
            refreshHandler: null,
            dataLocker: null
        }, this.config);
    }

    connect() {
        this.$el = $(this.element);
        this.listen('dblclick', this.onDoubleClick);
    }

    disconnect() {
        this.$el = null;
    }

    onDoubleClick(ev) {
        $('.toolbar-find-button', this.$el).trigger('click');
    }

    updateRecord(linkEl, recordId) {
        if (!this.config.dataLocker) {
            return;
        }

        // Selector name must be used because by the time success runs
        // - this.config will be disposed
        // - $locker element will be replaced
        var locker = this.config.dataLocker;

        $(locker).val(recordId);

        this.$el.loadIndicator({ opaque: true });
        this.$el.request(this.config.refreshHandler, {
            afterUpdate: function() {
                $(locker).trigger('change');
            }
        });

        $(linkEl).closest('.recordfinder-popup').popup('hide');
    }
});