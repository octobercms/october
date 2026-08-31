import { VueControlBase } from '../../../backend/assets/js/vueapp/vue-control-base.js';
import { modalUtils } from '../../../backend/vuecomponents/modal/assets/js/classes/index.js';

class VueEntryHeaderControls extends VueControlBase {
    init() {
        this.registerState({
            publishingStateChanged: false,
            entryTypeOptions: []
        });

        this.registerMethod('onSetEntryType', this.onSetEntryType);
        this.registerMethod('onPublishDraftClick', this.onPublishDraftClick);
        this.registerMethod('onRestoreRecordClick', this.onRestoreRecordClick);
        this.registerMethod('onSubmissionRejectClick', this.onSubmissionRejectClick);
        this.registerMethod('onSubmissionSpamClick', this.onSubmissionSpamClick);
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
                    _content_group_switch: entryType
                }
            });

            this.state.initial.contentGroup = entryType;
            this.makeEntryTypeOptions();
        }
        catch (response) {
            modalUtils.showAlert(oc.lang.get('form_error'), response.responseText);
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

    async onSubmissionRejectClick(ev) {
        const target = ev.currentTarget;
        this.containers.vueEntryHeaderControls.$refs.publishingControls.hide();

        try {
            await modalUtils.showConfirm(
                oc.lang.get('submission_reject_confirm_title', 'Reject Submission'),
                oc.lang.get('submission_reject_confirm', 'Are you sure you want to reject this submission?'),
                { isDanger: true }
            );
        }
        catch (cancelled) {
            return;
        }

        await this.onCommand('form:onSubmissionReject', false, ev, target, {}, true);
    }

    async onSubmissionSpamClick(ev) {
        const target = ev.currentTarget;
        this.containers.vueEntryHeaderControls.$refs.publishingControls.hide();

        try {
            await modalUtils.showConfirm(
                oc.lang.get('submission_spam_confirm_title', 'Mark as Spam'),
                oc.lang.get('submission_spam_confirm', 'This will also reject other pending submissions from the same IP address. Are you sure?'),
                { isDanger: true }
            );
        }
        catch (cancelled) {
            return;
        }

        await this.onCommand('form:onSubmissionSpam', false, ev, target, {}, true);
    }

    onPublishingControlsBtnClick(ev) {
        this.containers.vueEntryHeaderControls.$refs.publishingControls.show(ev.currentTarget);
    }

    onPublishingStateChanged(changed) {
        this.state.publishingStateChanged = changed;
    }
}

oc.registerControl('vue-entry-header-controls', VueEntryHeaderControls);

export { VueEntryHeaderControls };
export default VueEntryHeaderControls;
