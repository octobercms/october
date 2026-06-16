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
            :disabled="processing"
        ></backend-document-header>
    </template>

    <template v-slot:toolbar>
        <backend-document-toolbar
            :elements="toolbarElements"
            @command="onToolbarCommand"
            :disabled="processing"
        ></backend-document-toolbar>
    </template>

    <template v-slot:drawer>
        <div class="lang-editor-search" v-show="showSearch">
            <input
                type="text"
                placeholder="<?= e(trans('backend::lang.list.search_prompt')) ?>"
                @input="onSearchInput"
                @keydown.enter.prevent="onSearchNext"
                ref="searchInput"
            />
        </div>
    </template>

    <template v-slot:content>
        <div class="flex-layout-column fill-container">
            <div class="flex-layout-item stretch editor-panel relative">
                <backend-spreadsheet
                    ref="spreadsheet"
                    storage-key="cms-lang-editor"
                    :data="spreadsheetData"
                    :columns="spreadsheetColumns"
                    :disabled="processing"
                    @change="onSpreadsheetChange"
                >
                </backend-spreadsheet>
            </div>
        </div>
    </template>
</backend-document>
