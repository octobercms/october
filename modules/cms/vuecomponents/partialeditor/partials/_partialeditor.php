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
            :disabled="isDirectDocumentMode || processing"
            :data="documentData"
            :document-icon="directDocumentIcon"
            :show-close-icon="isDirectDocumentMode"
            @documentcloseclick="onDocumentCloseClick"
        ></backend-document-header>
    </template>

    <template v-slot:toolbar>
        <backend-document-toolbar
            :elements="toolbarElements"
            @command="onToolbarCommand"
            :disabled="processing || toolbarDisabled"
        ></backend-document-toolbar>
    </template>

    <template v-slot:content>
        <div class="flex-layout-column fill-container">
            <div class="flex-layout-item fix">
                <cms-component-cmsobjectcomponentlist
                    v-if="hasVisibleComponents"
                    :components="documentData.components"
                    @remove="onComponentRemove"
                    @inspectorshowed="onInspectorShowed"
                    @inspectorhidden="onInspectorHidden"
                ></cms-component-cmsobjectcomponentlist>
            </div>
            <div class="flex-layout-item stretch editor-panel relative">
                <backend-monacoeditor
                    ref="editor"
                    container-css-class="fill-container"
                    :model-definitions="codeEditorModelDefinitions"
                    :support-drag-events="true"
                    @monacoloaded="onMonacoLoaded"
                    @dispose="onMonacoDispose"
                    @drop="onEditorDragDrop"
                    @contextmenu="onEditorContextMenu"
                    @filtersupportedactions="onEditorFilterSupportedActions"
                    @customevent="onEditorCustomEvent"
                >
                </backend-monacoeditor>
            </div>

            <editor-component-editorconflictresolver
                ref="conflictResolver"
            ></editor-component-editorconflictresolver>
        </div>
    </template>
</backend-document>