<backend-document
    container-css-class="fill-container"
    :built-in-mode="true"
    :full-screen="fullScreen"
    ref="document"
>
    <template v-slot:toolbar v-if="!hasExternalToolbar">
        <backend-document-toolbar
            :elements="toolbarElements"
            :disabled="readOnly"
            @command="onToolbarCommand"
            ref="toolbar"
        ></backend-document-toolbar>
    </template>

    <template v-slot:content>
        <div class="flex-layout-column fill-container" ref="contentContainer">
            <div class="flex-layout-item stretch editor-panel relative">
                <backend-richeditor-document-connector
                    :allow-resizing="showMargins"
                    :toolbar-container="toolbarExtensionPointProxy"
                    :external-toolbar-app-state="externalToolbarAppState"
                    :use-media-manager="useMediaManager"
                    :built-in-mode="true"
                    unique-key="html-editor-form-widget"
                    container-css-class="fill-container"
                    ref="documentConnector"
                >
                    <backend-richeditor
                        v-model="value"
                        :read-only="options.readOnly"
                        :use-line-breaks="options.useLineBreaks"
                        :full-page="fullPage"
                        :editor-options="editorOptions"
                        :toolbar-buttons="toolbarButtons"
                        ref="richeditor"
                        @blur="onBlur"
                        @focus="onFocus"
                    >
                    </backend-richeditor>
                </backend-richeditor-document-connector>
            </div>
        </div>
    </template>
</backend-document>
