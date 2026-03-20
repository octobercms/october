<div class="dropdown-menu backend-dropdownmenu" data-menu-position-container>
    <div class="dropdown-container">
        <transition name="backend-dropdown-menu-touch-screen" v-on:after-leave="onAfterLeave">
            <ul
                role="menu"
                :class="menuClassName"
                ref="menu"
                v-if="visible"
                v-bind:id="menuId"
                v-bind:aria-labelledby="labeledById"
            >
                <li class="submenu-header clearfix" v-if="isSubmenu">
                    <button
                        class="go-back-link backend-icon-background-pseudo"
                        @click.stop.prevent="onGoBackClick"
                    ><?= e(trans('backend::lang.dropdownmenu.go_back')) ?></button>
                    <button
                        class="close-link backend-icon-background-pseudo"
                        @click.stop.prevent="onCloseClick"
                    ><?= e(trans('backend::lang.dropdownmenu.close_menu')) ?></button>
                </li>

                <backend-dropdown-menu-menuitem
                    v-for="(item, index) in items"
                    :ref="el => setMenuItemRef(el, index)"
                    :type="item.type"
                    :disabled="item.disabled"
                    :href="item.href"
                    :target="item.target"
                    :checked="item.checked"
                    :items="item.items"
                    :icon="item.icon"
                    :label="item.label"
                    :command="item.command"
                    :itemStyle="item.style"
                    :key="index"
                    :is-first="index == 0"
                    @command="onCommand($event)"
                    @hide="onHide"
                    @itemmouseenter="onItemMouseEnter"
                    @submenushown="onItemSubmenuShown"
                    @submenuhidden="onItemSubmenuHidden"
                    @closemenu="$emit('closemenu', $event)"
                ></backend-dropdown-menu-menuitem>
            </ul>
        </transition>
    </div>
</div>