<backend-document
    :header-collapsed="documentHeaderCollapsed"
    :full-screen="documentFullScreen"
    :loading="initializing"
    :processing="processing"
    :error-loading-document="errorLoadingDocument"
    error-loading-document-header="<?= e(trans('tailor::lang.blueprint.error_loading')) ?>"
    container-css-class="fill-container"
>
    <template v-slot:header>
        <backend-document-header
            title-property="fileName"
            ref="documentHeader"
            :data="documentData"
            :disabled="processing"
        ></backend-document-header>
    </template>

    <template v-slot:toolbar>
        <backend-document-toolbar
            :elements="toolbarElements"
            @command="onBlueprintToolbarCommand"
            :disabled="processing"
        ></backend-document-toolbar>
    </template>

    <template v-slot:content>
        <div class="d-flex flex-column fill-container">
            <div class="flex-fill position-relative editor-panel">
                <backend-monacoeditor
                    ref="editor"
                    container-css-class="fill-container"
                    :model-definitions="codeEditorModelDefinitions"
                    :glyph-margin="true"
                >
                </backend-monacoeditor>
            </div>

            <editor-component-editorconflictresolver
                ref="conflictResolver"
            ></editor-component-editorconflictresolver>
        </div>
    </template>
</backend-document>