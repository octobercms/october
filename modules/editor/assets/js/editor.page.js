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
        let responseText = error.responseText || error.message;

        if (!responseText && error.status === 0) {
            responseText = 'Error connecting to the server.';
        }

        modalUtils.showAlert(title, responseText);
    }
}

$(document).ready(function() {
    var editorPage = new EditorPage();

    $.oc.editor.application = editorPage.getApplication();
    $.oc.editor.getLangStr = editorPage.getLangStr;
    $.oc.editor.page = editorPage;
});
