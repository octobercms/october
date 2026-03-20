<backend-document
    container-css-class="fill-container"
    :built-in-mode="true"
    :full-screen="fullScreen"
    ref="document"
>
    <template v-slot:toolbar v-if="!hasExternalToolbar">
        <backend-document-toolbar
            :elements="toolbarElements"
            @command="onToolbarCommand"
            ref="toolbar"
        ></backend-document-toolbar>
    </template>

    <template v-slot:content>
        <div class="flex-layout-column fill-container" ref="contentContainer">
            <div class="flex-layout-item stretch editor-panel relative">
                <backend-document-markdowneditor
                    v-model="value"
                    ref="markdownEditor"
                    container-css-class="fill-container"
                    :built-in-mode="true"
                    :toolbar-container="toolbarExtensionPointProxy"
                    :external-toolbar-app-state="externalToolbarAppState"
                    :use-media-manager="useMediaManager"
                    :side-by-side="sideBySide"
                    @focus="onFocus"
                    @blur="onBlur"
                >
                </backend-document-markdowneditor>
            </div>
        </div>
    </template>
</backend-document>
