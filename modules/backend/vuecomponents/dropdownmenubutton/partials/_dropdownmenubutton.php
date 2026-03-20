<div>
    <button
        v-bind:disabled="disabled"
        v-bind:tabindex="disabled ? -1 : 0"
        v-bind:id="buttonId"
        ref="button"
        :class="cssClass"
        @click="onClick"
    >
        <span class="button-label" v-text="buttonText"></span>
    </button>

    <backend-dropdown-menu
        :items=menuitems
        :menu-id="menuId"
        :labeled-by-id="buttonId"
        ref="menu"
        @command="onMenuItemCommand"
        @shown="onMenuShown"
        @hidden="onMenuHidden"
        :preferable-position="preferableMenuPosition"
    ></backend-dropdown-menu>
</div>