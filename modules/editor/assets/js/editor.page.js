import { EditorStore } from './editor.store.js';
import { modalUtils } from '../../../backend/vuecomponents/modal/assets/js/classes/index.js';

class EditorPage {
    constructor(height, width) {
        this.store = new EditorStore();

        this.init();
    }

    init() {
        this.initVue();
        this.initListeners();
    }

    initVue() {
        const initialState = $('#editor-initial-state').html();
        this.store.setInitialState(JSON.parse(initialState));

        // Components need access to the store
        // during initialization.
        //
        $.oc.editor = $.oc.editor || {};
        $.oc.editor.store = this.getStore();

        const { app, vm } = oc.mountVueApp('#page-container', {
            data: () => ({
                store: this.store
            })
        });

        this.app = app;
        this.vm = vm;
    }

    initListeners() {
        window.addEventListener('beforeunload', function(event) {
            if ($.oc.editor.application.hasChangedTabs()) {
                event.preventDefault();
                event.returnValue = 'There are unsaved changes.';
            }
        });
    }

    getApplication() {
        return this.vm.$refs.application;
    }

    getLangStr(str) {
        return this.store.state.lang[str];
    }

    getStore() {
        return this.store;
    }

    showAjaxErrorAlert(error, title) {
        modalUtils.showAlert(title, this.getAjaxErrorMessage(error) || title);
    }

    getAjaxErrorMessage(error) {
        if (!error) {
            return null;
        }

        // The larajax exception response carries its message on the $env envelope,
        // which may live on the error itself or on the responseJSON of a wrapped xhr.
        const envelope = error.$env || (error.responseJSON && error.responseJSON.$env);
        if (envelope && envelope.getMessage()) {
            return envelope.getMessage();
        }

        // Fall back to the raw ajax response body message
        const ajaxBody = error.__ajax || (error.responseJSON && error.responseJSON.__ajax);
        if (ajaxBody && ajaxBody.message) {
            return ajaxBody.message;
        }

        // Finally, jQuery-style error fields
        if (error.responseText || error.message) {
            return error.responseText || error.message;
        }

        if (error.status === 0 || error.$status === 0) {
            return 'Error connecting to the server.';
        }

        return null;
    }
}

oc.pageReady().then(() => {
    var editorPage = new EditorPage();

    $.oc.editor.application = editorPage.getApplication();
    $.oc.editor.getLangStr = editorPage.getLangStr;
    $.oc.editor.page = editorPage;
});
