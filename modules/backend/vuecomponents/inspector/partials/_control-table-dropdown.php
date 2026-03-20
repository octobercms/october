<div
    v-bind:tabindex="containerTabIndex"
    @focus="onContainerFocus"
    class="inspector-table-dropdown-container"
>
    <backend-dropdown
        :options="options"
        :placeholder="column.placeholder"
        :tabindex="0"
        :disabled="inspectorPreferences.readOnly"
        :allow-empty="true"
        track-by="code"
        label="label"
        ref="editor"
        v-model="selectedValue"
        select-label=""
        selected-label=""
        deselect-label=""
        @update:model-value="updateValue"
        @open="onFocus"
        @close="onBlur"
    >
        <template #noResult>
            <span><?= e(trans('backend::lang.form.no_options_found')) ?></span>
        </template>
    </backend-dropdown>

    <div class="dropdown-placeholder" v-if="!hasValue" v-text="column.placeholder"></div>
</div>