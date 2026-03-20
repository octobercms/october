<div>
    <backend-loading-indicator v-if="loadingDynamicOptions"
        size="tiny"
    ></backend-loading-indicator>

    <backend-autocomplete
        v-if="!loadingDynamicOptions"
        ref="autocomplete"
        :search="onSearch"
        :getResultValue="getResultValue"
        :placeholder="placeholder"
        :defaultValue="initialValue"
        :readonly="inspectorPreferences.readOnly"
        v-bind:id="controlId"
        @input="onInput"
        @change="onChange"
        @update="onUpdate"
        @focus="onFocus"
        @blur="onBlur"
    >
        <template #result="{ result, props }">
            <li v-bind="props" class="autocomplete-result">
                {{ result.value }}
            </li>
        </template>
    </backend-autocomplete>
</div>