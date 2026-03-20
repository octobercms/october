<backend-document
    :header-collapsed="documentHeaderCollapsed"
    :full-screen="documentFullScreen"
    :loading="initializing"
    :processing="processing"
    :error-loading-document="errorLoadingDocument"
    error-loading-document-header="<?= e(trans('cms::lang.editor.error_loading_header')) ?>"
    container-css-class="fill-container"
>
    <template v-slot:header>
        <backend-document-header
            title-property="fileName"
            ref="documentHeader"
            :data="documentData"
            :disabled="isDirectDocumentMode || processing"
            :document-icon="directDocumentIcon"
            :show-close-icon="isDirectDocumentMode"
            @documentcloseclick="onDocumentCloseClick"
        ></backend-document-header>
    </template>

    <template v-slot:toolbar>
        <backend-document-toolbar
            :elements="toolbarElements"
            @command="onToolbarCommand"
            :disabled="processing"
        ></backend-document-toolbar>
    </template>

    <template v-slot:content>
        <div class="flex-layout-column fill-container">
            <div class="flex-layout-item stretch editor-panel relative">
                <backend-monacoeditor
                    v-show="!isRicheditorDocument && !isMarkdownDocument"
                    ref="editor"
                    container-css-class="fill-container"
                    :model-definitions="codeEditorModelDefinitions"
                    @monacoloaded="onMonacoLoaded"
                    @dispose="onMonacoDispose"
                    @contextmenu="onEditorContextMenu"
                    @filtersupportedactions="onEditorFilterSupportedActions"
                >
                </backend-monacoeditor>

                <backend-richeditor-document-connector
                    :allow-resizing="true"
                    :toolbar-container="toolbarExtensionPoint"
                    :use-media-manager="editorUserData.useMediaManager"
                    unique-key="content-html-editor"
                    container-css-class="fill-container"
                    v-if="isRicheditorDocument"
                >
                    <backend-richeditor
                        v-model="documentData.markup"
                    >
                    </backend-richeditor>
                </backend-richeditor-document-connector>

                <backend-document-markdowneditor
                    v-if="isMarkdownDocument"
                    v-model="documentData.markup"
                    ref="markdownEditor"
                    container-css-class="fill-container"
                    :toolbar-container="toolbarExtensionPoint"
                    :use-media-manager="editorUserData.useMediaManager"
                >
                </backend-document-markdowneditor>
            </div>

            <editor-component-editorconflictresolver
                ref="conflictResolver"
            ></editor-component-editorconflictresolver>
        </div>
    </template>
</backend-document>