oc.registerControl('vue-entry-document', class extends oc.VueControlBase {
    init() {
        this.registerState({
            showDraftNotes: true,
            toolbarDisabled: false,
            toolbarExtensionPoint: [],
            toolbarExtraButtons: [],
            toolbarElements: []
        });

        this.registerMethod('onCommand', this.onCommand);
    }

    connect() {
        this.initState();
        this.initListeners();
        this.refreshToolbarExtraButtons();
    }

    disconnect() {
        this.destroyListeners();
        this.previewTracker = null;
    }

    initListeners() {
        // Listen for AJAX
        $(window).on('oc.updateUi', this.proxy(this.refreshToolbars));

        // Extra check to fix a race condition
        $(window).one('shown.bs.tab', this.proxy(this.refreshToolbars));

        // Wait for hot controls
        setTimeout(() => this.refreshToolbars(), 0);

        this.state.eventBus.$on('documentloadingstart', () => {
            this.state.processing = true;
        });

        this.state.eventBus.$on('documentloadingend', () => {
            this.state.processing = false;
        });
    }

    destroyListeners() {
        $(window).off('oc.updateUi', this.proxy(this.refreshToolbars));
        $(window).off('shown.bs.tab', this.proxy(this.refreshToolbars));
    }

    refreshToolbars() {
        this.state.toolbarExtensionPoint.splice(0);
        this.state.eventBus.$emit('extendapptoolbar');
    }

    refreshToolbarExtraButtons() {
        this.state.toolbarExtraButtons.splice(0);

        if (this.isDraftable() && this.state.initial.isDraft && !this.state.initial.isFirstDraft) {
            this.state.toolbarExtraButtons.push({
                type: 'button',
                icon: 'icon-notes-edit',
                label: oc.lang.get('draft_notes'),
                pressed: this.state.showDraftNotes,
                command: 'togglenotes'
            });
        }
    }

    isDraftable() {
        return this.state.initial.draftable;
    }

    loadShowDraftNotes() {
        if (!this.isDraftable()) {
            return false;
        }

        let lastDraftId = localStorage.getItem('tailor-display-notes-last-draft-id');
        if (parseInt(lastDraftId) < this.state.initial.currentDraftId) {
            return true;
        }


        let item = localStorage.getItem('tailor-draft-display-notes');
        if (item === null) {
            return true;
        }

        return parseInt(item) == 1;
    }

    saveShowDraftNotes() {
        localStorage.setItem('tailor-draft-display-notes', this.state.showDraftNotes ? 1 : 0);
        localStorage.setItem('tailor-display-notes-last-draft-id', this.state.initial.currentDraftId);
    }

    initState() {
        if (!this.isDraftable()) {
            this.state.showDraftNotes = false;
        }

        this.state.showDraftNotesUI = this.state.initial.isDraft && !this.state.initial.isFirstDraft && this.isDraftable();
        if (this.state.showDraftNotesUI) {
            this.state.showDraftNotes = this.loadShowDraftNotes();
        }

        // Build Toolbar
        this.state.toolbarElements = [];

        // Save
        if (this.state.initial.canRestore) {
                this.state.toolbarElements.push({
                    type: 'button',
                    icon: 'icon-refresh',
                    label: oc.lang.get('form_restore'),
                    tooltip: oc.lang.get('form_restore'),
                    hotkey: 'ctrl+enter, cmd+enter',
                    tooltipHotkey: '⌃S, ⌘S',
                    command: 'form:onRestore'
                });
        }
        else {
            this.state.toolbarElements.push(this.makeSaveButton());

            // Save and Close
            if (!this.state.initial.isSingular && (this.state.initial.canPublish || this.state.initial.isDraft)) {
                this.state.toolbarElements.push({
                    type: 'button',
                    icon: 'icon-keyboard-return',
                    label: oc.lang.get('form_save_close'),
                    tooltip: oc.lang.get('form_save_close'),
                    hotkey: 'ctrl+enter, cmd+enter',
                    tooltipHotkey: '⌃S, ⌘S',
                    command: this.state.initial.isDraft ? 'form:onCommitDraft' : 'form:onSave',
                    customData: {
                        request: {
                            browserRedirectBack: true,
                            data: { close: 1 }
                        }
                    }
                });
            }
        }

        // Extras
        this.state.toolbarElements.push(this.state.toolbarExtraButtons);

        // Delete
        if (this.state.initial.canDelete && !this.state.initial.isCreateAction) {
            this.state.toolbarElements.push(this.makeDeleteButton());
        }

        // Preview
        if (this.state.initial.hasPreviewPage && !this.state.initial.isCreateAction) {
            this.state.toolbarElements.push({
                type: 'button',
                icon: 'icon-location-target',
                command: 'onPreview',
                label: oc.lang.get('preview')
            });
        }

        // Extensions
        this.state.toolbarElements.push(this.state.toolbarExtensionPoint);
    }

    makeSaveButton() {
        let saveButtonCommand = 'form:onSave';
        let saveButtonLabel = oc.lang.get('form_save');
        let showBadge = false;

        if (this.isDraftable() && this.state.initial.isDraft) {
            saveButtonCommand = 'form:onCommitDraft';
            saveButtonLabel = oc.lang.get('save_draft');
        }

        // Notify user about pending drafts
        if (this.state.initial.drafts.length && this.state.initial.canPublish) {
            showBadge = true;
        }

        // Only allow non-publishers to create drafts
        if (!this.state.initial.canPublish && !this.state.initial.isDraft) {
            saveButtonCommand = 'onCreateDraft';
            saveButtonLabel = oc.lang.get('create_draft');
        }

        return {
            type: 'button',
            icon: 'icon-save-cloud',
            label: saveButtonLabel,
            tooltip: saveButtonLabel,
            hotkey: 'ctrl+s, cmd+s',
            tooltipHotkey: '⌃S, ⌘S',
            command: saveButtonCommand,
            showBadge: showBadge,
            menuitems: this.makeSaveMenuItems(),
            customData: {
                request: {
                    data: { 'redirect': 0 }
                }
            }
        }
    }

    makeSaveMenuItems() {
        if (!this.isDraftable() || !this.state.initial.canPublish) {
            return null;
        }

        let result = [];

        if (this.state.initial.isDraft) {
            result = [
                {
                    type: 'text',
                    label: oc.lang.get('save_apply_draft'),
                    command: 'form:onPublishDraft'
                }
            ];
        }

        if (this.state.initial.isDraft && !this.state.initial.isFirstDraft) {
            result.push({
                type: 'text',
                href: this.state.initial.primaryRecordUrl,
                label: oc.lang.get('edit_primary_record')
            });
        }

        if (!this.state.initial.isFirstDraft) {
            if (result.length > 0) {
                result.push({ type: 'separator' });
            }
            result.push({
                type: 'text',
                label: oc.lang.get('create_draft'),
                command: 'onCreateDraft'
            });
        }

        if (this.state.initial.drafts.length) {
            const draftItems = [];
            const draftItemType = this.state.initial.isDraft && !this.state.initial.isFirstDraft ? 'radiobutton' : 'text';

            this.state.initial.drafts.forEach(draft => {
                draftItems.push({
                    type: draftItemType,
                    href: this.state.initial.primaryRecordUrl + '?draft=' + draft.id,
                    label: draft.primary_attrs.name,
                    checked: this.state.initial.currentDraftId == draft.id,
                    disabled: this.state.initial.currentDraftId == draft.id
                })
            });

            result.push(
                {
                    type: 'text',
                    label: oc.lang.get('select_draft'),
                    items: draftItems
                }
            );
        }

        return result;
    }

    makeDeleteButton() {
        let deleteButtonLabel = oc.lang.get('form_delete');
        let deleteButtonCmd = 'form:onDelete';
        let deleteButtonConfirm = oc.lang.get('delete_entry_confirm');
        if (this.state.initial.isDraft) {
            deleteButtonLabel = oc.lang.get('discard_draft');
            deleteButtonCmd = this.state.initial.isFirstDraft
                ? 'form:onForceDelete'
                : 'form:onDiscardDraft';

            deleteButtonConfirm = oc.lang.get('discard_draft_confirm');
        }
        else if (this.state.initial.isDeleted) {
            deleteButtonLabel = oc.lang.get('force_delete');
            deleteButtonCmd = 'form:onForceDelete';
            deleteButtonConfirm = oc.lang.get('force_delete_confirm');
        }

        return {
            type: 'button',
            icon: 'icon-delete',
            command: deleteButtonCmd,
            hotkey: 'shift+option+d',
            label: deleteButtonLabel,
            fixedRight: true,
            tooltip: deleteButtonLabel,
            tooltipHotkey: '⇧⌥D',
            customData: {
                confirm: deleteButtonConfirm
            }
        };
    }

    handleFormSaved(data) {
        this.containers.vueEntryHeaderControls.$refs.publishingControls.updateSavedState();
        $('#tailor-form').trigger('unchange.oc.changeMonitor');

        this.state.initial.statusCode = data.result.statusCode;
        this.state.initial.drafts = data.result.drafts;
        this.state.initial.fullSlug = data.result.fullSlug;

        Vue.set(this.state.toolbarElements, 0, this.makeSaveButton());

        if (this.previewTracker && this.previewTracker.isPreviewAvailable()) {
            this.previewTracker.refreshPreview();
        }
    }

    async onCommand(command, isHotkey, ev, targetElement, customData, throwOnError) {
        if (command === 'togglenotes') {
            this.state.showDraftNotes = !this.state.showDraftNotes;
            this.saveShowDraftNotes();
            this.refreshToolbarExtraButtons();
            return;
        }

        if (command === 'onCreateDraft') {
            this.onCreateDraft(command, isHotkey, ev, targetElement, customData, throwOnError);
            return;
        }

        if (command === 'onPreview') {
            this.onPreview(targetElement);
            return;
        }

        if (!this.app.isFormCommand(command)) {
            return;
        }

        this.state.toolbarDisabled = true;
        $('#tailor-form').trigger('pauseUnloadListener');

        try {
            let data = await this.app.onCommand(command, isHotkey, ev, targetElement, customData);
            this.state.toolbarDisabled = false;

            if (command == 'form:onSave' || command == 'form:onCommitDraft') {
                this.handleFormSaved(data);
            }

            $('#tailor-form').trigger('resumeUnloadListener');
        }
        catch (error) {
            $('#tailor-form').trigger('resumeUnloadListener');
            this.state.toolbarDisabled = false;
            if (throwOnError) {
                throw error;
            }
        }
    }

    async onPreview(targetElement) {
        this.state.processing = true;
        this.state.toolbarDisabled = true;

        if (!this.previewTracker) {
            this.previewTracker = oc.Modules.import('tailor.preview-tracker').newTracker();
        }

        try {
            if (this.previewTracker.isPreviewAvailable()) {
                await oc.request(targetElement, 'onPreview', {
                    data: { preview_token: this.previewTracker.getToken() }
                });
                this.previewTracker.refreshPreview(true);
            }
            else {
                const data = await oc.request(targetElement, 'onPreview');
                this.previewTracker.openPreview(data.token, data.url);
            }
        }
        catch (error) {}

        this.state.processing = false;
        this.state.toolbarDisabled = false;
    }

    async onCreateDraft(command, isHotkey, ev, targetElement, customData, throwOnError) {
        if (!$('#tailor-form').hasClass('oc-data-changed')) {
            this.onCommand('form:onCreateDraft', isHotkey, ev, targetElement, customData, throwOnError);
            return;
        }

        try {
            await oc.confirmPromise(oc.lang.get('confirm_create_draft'));

            this.onCommand('form:onCreateDraft', isHotkey, ev, targetElement, customData, throwOnError);
        }
        catch (error) {}
    }
});
