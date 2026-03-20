<div v-bind:tabindex="containerTabIndex" @focus="onContainerFocus">
    <backend-loading-indicator v-if="loadingDynamicOptions"
        size="tiny"
    ></backend-loading-indicator>

    <backend-dropdown
        v-if="!loadingDynamicOptions"
        :options="options"
        :id="controlId"
        :placeholder="control.placeholder"
        :tabindex="0"
        :disabled="inspectorPreferences.readOnly"
        :allow-empty="true"
        track-by="code"
        label="label"
        ref="input"
        v-model="selectedValue"
        select-label=""
        selected-label=""
        deselect-label=""
        @update:model-value="updateValue"
        @open="onFocus"
        @close="onBlur"
        @vue:mounted="onDropdownMounted"
    >
        <template #noResult>
            <span><?= e(trans('backend::lang.form.no_options_found')) ?></span>
        </template>
        <template v-if="useValuesAsIcons || useValuesAsColors" #option="props">
            <div class="option-with-icon" v-if="useValuesAsIcons">
                <div class="option-icon" :class="props.option.code"></div>
                <span>{{ props.option.label }}</span>
            </div>

            <div class="option-with-color" v-if="useValuesAsColors">
                <div class="option-color" :style="{'background-color': props.option.code}"></div>
                <span>{{ props.option.label }}</span>
            </div>
        </template>
    </backend-dropdown>
</div>