<div
    class="component-cms-object-component-list flex-layout-row"
    :class="{expanded: expanded}"
>
    <div class="components-scrollable flex-layout-item stretch" ref="scrollable">
        <transition-group name="cms-transition-component-list" class="flex-layout-row" tag="ul">
            <template v-for="(component, index) in components" :key="component.alias">
                <cms-component-cmsobjectcomponentlist-component
                    v-if="!component.isHidden"
                    :component="component"
                    @removecomponent="onRemoveComponentClick(index)"
                    @inspectorhiding="onInspectorHiding($event, index)"
                    @inspectorhidden="$emit('inspectorhidden')"
                    @inspectorshowed="$emit('inspectorshowed')"
                ></cms-component-cmsobjectcomponentlist-component>
            </template>
        </transition-group>
    </div>
    <div class="flex-layout-item fix list-control-buttons">
        <button
            class="expand-collapse-button editor-icon-button backend-icon-background-pseudo"
            :class="{'expand-list': !expanded, 'collapse-list': expanded}" 
            title="<?= e(trans('cms::lang.component.expand_or_collapse')) ?>"
            @click.prevent="onToggleCollapse"
        ><?= e(trans('cms::lang.component.expand_or_collapse')) ?></button>
    </div>
</div>