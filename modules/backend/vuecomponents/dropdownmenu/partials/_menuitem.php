<li
    class="item"
    :class="{
        separator: type == 'separator',
        first: isFirst,
        'submenu-expanded': isSubmenuExpanded
    }"
    v-bind:role="type == 'separator' ? 'separator' : 'presentation'"
    v-bind:disabled="disabled"
>
    <button v-if="!href && type != 'separator'"
        ref="itemElement"
        v-bind:tabindex="disabled ? -1 : 0"
        v-bind:disabled="disabled"
        v-bind:aria-disabled="disabled"
        v-bind:role="itemRole"
        v-bind:aria-checked="itemIsChecked ? 'true' : 'false'"
        v-bind:id="menuItemId"
        v-bind:aria-haspopup="hasSubmenu"
        v-bind:aria-expanded="isSubmenuExpanded"
        :class="{'has-submenu': hasSubmenu}"
        :style="itemStyle"
        @click="onClick($event)"
        @mouseenter="onMouseEnter"
        data-menuitem
    >
        <i :class="icon" v-if="icon"></i>
        <i
            class="backend-icon-background-pseudo"
            v-if="type == 'checkbox' || type == 'radiobutton'"
        ></i>
        <i
            class="backend-icon-background-pseudo submenu-indicator"
            v-if="hasSubmenu"
        ></i>
        <span v-text="label"></span>
    </button>

    <a
        ref="itemElement"
        v-if="href && type != 'separator'"
        v-bind:href="href"
        v-bind:target="target ? target : '_self'"
        v-bind:tabindex="disabled ? -1 : 0"
        v-bind:disabled="disabled || undefined"
        v-bind:aria-disabled="disabled || undefined"
        v-bind:aria-checked="itemIsChecked ? 'true' : 'false'"
        v-bind:role="itemRole"
        :style="itemStyle"
        @click="onClick($event)"
        @mouseenter="onMouseEnter"
        data-menuitem
    >
        <i :class="icon" v-if="icon"></i>
        <i
            class="backend-icon-background-pseudo"
            v-if="type == 'checkbox' || type == 'radiobutton'"
        ></i>
        <span v-text="label"></span>
    </a>

    <backend-dropdown-menu-sheet
        v-if="hasSubmenu"
        ref="submenu"
        :items="items"
        :labeled-by-id="menuItemId"
        :menu-id="submenuId"
        :is-submenu="true"
        @command="$emit('command', $event)"
        @hidden="onSubmenuHidden"
        @closemenu="$emit('closemenu', $event)"
    ></backend-dropdown-menu-sheet>
</li>