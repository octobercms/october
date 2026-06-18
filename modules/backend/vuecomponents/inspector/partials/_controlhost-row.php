<tr class="inspector-control-row" :class="{'has-errors': hasErrors, 'hide-bottom-border': bottomBorderHidden}" v-show="isVisible">
    <th v-if="!isFullWidth && !controlLabelHidden" :style="titlePanelStyle">
        <div class="inspector-label-container" :class="{'has-description': control.description}">
            <label
                class="inspector-padding-control-left"
                v-text="control.title"
                v-bind:for="controlEditorId"
                :style="labelStyle"
                @click.stop="onLabelClick"
            ></label>
            <span
                v-if="control.description"
                class="property-description backend-icon-background-pseudo"
                v-bind:data-tooltip-text="control.description"
            ></span>
        </div>
    </th>

    <td v-bind:colspan="controlColspan">
        <div class="full-width-control-label" v-if="isFullWidth && (control.title || control.description) && ! controlLabelHidden">
            <label
                class="inspector-padding-control-left"
                v-text="control.title"
                v-bind:for="controlEditorId"
                :style="labelStyle"
                @click.stop="onLabelClick"
            ></label>
            <div
                v-if="control.description"
                class="inspector-padding-control-left full-width-property-description"
                v-text="control.description"
                :style="labelStyle"
            ></div> 
        </div>

        <div :class="{'inspector-control-container': !isFullWidth, 'no-property-title': !control.title && !control.description}">
            <div v-if="!isFullWidth" class="inspector-drag-handle"></div>

            <div
                v-if="showExternalParamEditor"
                class="external-param-editor-container"
                :class="{'editor-visible': externalParamEditorVisible}"
            >
                <div class="external-param-normal-editor" v-show="!externalParamEditorVisible">
                    <?= $this->makePartial('controlhost-row-controls') ?>
                </div>
                <div class="external-editor" v-show="externalParamEditorVisible">
                    <input
                        type="text"
                        class="inspector-control"
                        ref="externalParamInput"
                        :value="externalParamValue"
                        @input="onExternalParamInput"
                        @focus="onExternalParamFocus"
                        @blur="onExternalParamBlur"
                        placeholder="<?= e(trans('backend::lang.inspector.enter_external_param')) ?>"
                    />
                </div>
                <a
                    href="javascript:;"
                    class="external-editor-link"
                    @click.stop.prevent="toggleExternalParamEditor"
                    data-tooltip-text="<?= e(trans('backend::lang.inspector.external_param_tooltip')) ?>"
                ><i class="ph ph-brackets-curly"></i></a>
            </div>

            <template v-if="!showExternalParamEditor">
                <?= $this->makePartial('controlhost-row-controls') ?>
            </template>
        </div>
    </td>
</tr>