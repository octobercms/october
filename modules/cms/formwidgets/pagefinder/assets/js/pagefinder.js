/*
 * PageFinder page
 */
'use strict';

oc.registerControl('pagefinder', class extends oc.ControlBase {
    init() {
        this.$dataLocker = document.querySelector(this.config.dataLocker);
    }

    connect() {
        this.listen('click', '.toolbar-find-button', this.onClickFindButton);
        this.listen('dblclick', this.onDoubleClick);
    }

    onDoubleClick() {
        this.element.querySelector('.toolbar-find-button').click();
    }

    onInsertPage(item) {
        if (!this.$dataLocker) {
            return;
        }

        this.$dataLocker.value = item.link;

        if (!this.config.refreshHandler) {
            return;
        }

        oc.request(this.element, this.config.refreshHandler, {
            afterUpdate: () => {
                $(this.config.dataLocker).trigger('change');
            }
        });
    }

    onClickFindButton(ev) {
        var currentValue = this.$dataLocker ? this.$dataLocker.value : '';

        oc.pageLookup.popup({
            alias: 'ocpagelookup',
            value: currentValue,
            onInsert: this.proxy(this.onInsertPage),
            includeTitle: true,
            singleMode: this.config.singleMode,
            allowCustomUrl: this.config.allowCustomUrl,
            allowedTypes: this.parseJsonConfig(this.config.allowedTypes),
            excludedTypes: this.parseJsonConfig(this.config.excludedTypes)
        });
    }

    parseJsonConfig(value) {
        if (!value || value === 'null') {
            return null;
        }
        if (typeof value === 'string') {
            try { return JSON.parse(value); } catch(e) { return null; }
        }
        return value;
    }
});
