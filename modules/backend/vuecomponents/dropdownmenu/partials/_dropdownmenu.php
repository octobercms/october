<div>
    <transition name="backend-dropdown-overlay-touch-screen">
        <div v-if="visible" class="backend-dropdownmenu-overlay" @click.prevent="onOverlayClick" @contextmenu.prevent="onOverlayContextMenu"></div>
    </transition>

    <backend-dropdown-menu-sheet
        ref="sheet"
        :items="items"
        :labeled-by-id="labeledById"
        :menu-id="menuId"
        :preferable-position="preferablePosition"
        @aligntotrigger="$emit('aligntotrigger', $event)"
        @command="$emit('command', $event)"
        @hidden="onSheetHidden"
        @closemenu="hideMenu"
    ></backend-dropdown-menu-sheet>
</div>