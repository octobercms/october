<li
    class=""
    :class="{'unknown': component.isUnknownComponent, 'inspector-enabled': component.inspectorEnabled}"
    @click="onComponentClick"
>
    <div class="component-header">
        <i :class="componentIcon"></i>
        <h3>
            <span v-text="component.title"></span>
            <span v-text="component.alias"></span>
        </h3>
    </div>
    <p v-text="component.description"></p>
    <p class="component-alias oc-icon-code" v-text="component.alias"></p>
    <button
        class="backend-icon-background-pseudo remove-component"
        title="<?= e(trans('cms::lang.component.remove')) ?>"
        @click.stop.prevent="$emit('removecomponent')"
    ></button>
</li>
