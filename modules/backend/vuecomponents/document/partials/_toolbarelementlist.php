<div
    class="document-toolbar-element"
    :class="['element-type-'+element.type, {'button-group': !!element.buttonGroup, 'button-icon-only': element.type == 'button' && !element.label}]">
    <backend-document-toolbar-button
        v-if="element.type == 'button' || element.type == 'dropdown'"
        :settings=element
        :toolbar-disabled="disabled"
        @dropdowncontentshown="onDropdownContentShown"
        @dropdowncontenthidden="onDropdownContentHidden"
        @command="onElementCommand"
    ></backend-document-toolbar-button>
</div>