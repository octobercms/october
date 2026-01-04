oc.registerControl('vue-entry-header-controls', class extends oc.VueControlBase {
    init() {
        this.registerState({
            publishingStateChanged: false,
            entryTypeOptions: []
        });

        this.registerMethod('onSetEntryType', this.onSetEntryType);
        this.registerMethod('onPublishDraftClick', this.onPublishDraftClick);
        this.registerMethod('onRestoreRecordClick', this.onRestoreRecordClick);
        this.registerMethod('onPublishingControlsBtnClick', this.onPublishingControlsBtnClick);
        this.registerMethod('onPublishingStateChanged', this.onPublishingStateChanged);
    }

    connect() {
        this.state.entryTypeOptions = [];
        this.state.publishingStateChanged = false;
        this.makeEntryTypeOptions();
    }

    disconnect() {
    }

    makeEntryTypeOptions() {
        if (!this.state.initial.entryTypeOptions) {
            return;
        }

        const options = this.state.initial.entryTypeOptions;
        const keys = Object.keys(options);

        this.state.entryTypeOptions = [];
        keys.forEach(key => {
            this.state.entryTypeOptions.push({
                type: 'radiobutton',
                command: key,
                checked: this.state.initial.contentGroup == key,
                label: options[key]
            });
        })
    }

    async onCommand(command, isHotkey, ev, targetElement, customData, throwOnError) {
        var registeredMethod = this.app.getMethod('onCommand');
        if (registeredMethod) {
            return registeredMethod(command, isHotkey, ev, targetElement, customData, throwOnError);
        }

        return this.app.onCommand(command, isHotkey, ev, targetElement);
    }

    async onSetEntryType(entryType, isHotkey, ev, targetElement) {
        this.state.processing = true;
        this.state.toolbarDisabled = true;

        try {
            await oc.request(targetElement, 'onChangeEntryType', {
                data: {
                    EntryRecord: {
                        content_group: entryType
                    }
                }
            });

            this.state.initial.contentGroup = entryType;
            this.makeEntryTypeOptions();
        }
        catch (response) {
            oc.vueComponentHelpers.modalUtils.showAlert(oc.lang.get('form_error'), response.responseText);
        }

        this.state.toolbarDisabled = false;
        this.state.processing = false;
    }

    async onPublishDraftClick(ev) {
        try {
            await this.onCommand('form:onPublishDraft', false, ev, ev.currentTarget, {}, true)
        }
        catch (error) {
            this.containers.vueEntryHeaderControls.$refs.publishingControls.hide();
        }
    }

    async onRestoreRecordClick(ev) {
        try {
            await this.onCommand('form:onRestore', false, ev, ev.currentTarget, {}, true)
        }
        catch (error) {
            this.containers.vueEntryHeaderControls.$refs.publishingControls.hide();
        }
    }

    onPublishingControlsBtnClick(ev) {
        this.containers.vueEntryHeaderControls.$refs.publishingControls.show(ev.currentTarget);
    }

    onPublishingStateChanged(changed) {
        this.state.publishingStateChanged = changed;
    }
});
