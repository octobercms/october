<div class="component-backend-inspector-group">
    <div
        class="group-name inspector-padding-control-left inspector-padding-control-right"
        :class="{expanded: expanded, collapsed: !expanded, loading: loading, 'has-errors': hasErrors, 'hide-bottom-border-collapsed': hideBottomBorder}"
        @click.stop="onToggleGroup"
    >
        <div :style="nameStyle">
            <span
                v-text="nameAndValue"
                class="backend-icon-background-pseudo"
            ></span>

            <backend-loading-indicator v-if="loading"
                size="tiny"
            ></backend-loading-indicator>
        </div>
    </div>
    <transition name="group-fade-in">
        <backend-inspector-controlhost
            v-show="expanded"
            :controls="controls"
            :obj="obj"
            :parent-obj="parentObj"
            :splitter-data="splitterData"
            :depth="depth + 1"
            :panel-update-data="panelUpdateData"
            :inspector-preferences="inspectorPreferences"
            :inspector-unique-id="inspectorUniqueId"
            @inspectorcommand="$emit('inspectorcommand', $event)"
        >
        </backend-inspector-controlhost>
    </transition>
</div>