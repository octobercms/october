<div v-oc-hotkey:[settings.hotkey]="onHotkey" v-if="!settings.hidden">
    <a
        role="button"
        v-if="settings.href"
        v-bind:href="settings.href"
        v-bind:target="settings.target ? settings.target : '_self'"
        v-bind:disabled="(settings.disabled || toolbarDisabled) || null"
        v-bind:tabindex="settings.disabled || toolbarDisabled ? -1 : 0"
        v-bind:aria-controls="ariaControlsId"
        v-bind:aria-haspopup="settings.type == 'dropdown'"
        v-bind:id="buttonId"
        v-bind:data-cmd="command"
        v-bind:data-tooltip-text="tooltip"
        v-bind:data-tooltip-hotkey="tooltipHotkey"
        class="backend-toolbar-button"
        :class="cssClass"
        @click="onClick"
        ref="button"
    >
        <i v-if="icon" :class="icon"></i>
        <span class="button-label" v-if="label" v-text="label"></span>
    </a>
    <button
        type="button"
        v-else
        v-bind:disabled="settings.disabled || toolbarDisabled"
        v-bind:tabindex="settings.disabled || toolbarDisabled ? -1 : 0"
        v-bind:aria-controls="ariaControlsId"
        v-bind:aria-haspopup="settings.type == 'dropdown'"
        v-bind:id="buttonId"
        v-bind:data-cmd="command"
        v-bind:data-tooltip-text="tooltip"
        v-bind:data-tooltip-hotkey="tooltipHotkey"
        class="backend-toolbar-button"
        :class="cssClass"
        @click="onClick"
        ref="button"
    >
        <i v-if="icon" :class="icon"></i>
        <span class="button-label" v-if="label" v-text="label" :style="titleStyle"></span>
    </button
    ><button
        type="button"
        v-if="settings.type != 'dropdown' && settings.menuitems"
        class="backend-toolbar-button menu-trigger"
        :class="menuTriggerCssClass"
        aria-haspopup="true"
        v-bind:disabled="settings.disabled || toolbarDisabled"
        v-bind:tabindex="settings.disabled || toolbarDisabled ? -1 : 0"
        v-bind:id="menuButtonId"
        v-bind:aria-controls="menuId"
        @click="onClick($event, false, true)"
        ref="menuButton"
    >
        <span v-if="settings.showBadge" class="badge"></span>
    </button>

    <backend-dropdown-menu
        v-if="settings.menuitems"
        :items=settings.menuitems
        :menu-id="menuId"
        :labeled-by-id="buttonId"
        ref="menu"
        @closedwithesc="onMenuClosedWithEsc"
        @command="onMenuItemCommand"
        @shown="onMenuShown"
        @hidden="onMenuHidden"
        @aligntotrigger="onAlignToTrigger"
    ></backend-dropdown-menu>
</div>
