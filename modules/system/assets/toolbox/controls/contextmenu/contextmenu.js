/*
 * Context Menu
 *
 * - Documentation: ../docs/contextmenu.md
 *
 * JavaScript API:
 * oc.ContextMenu.show({ pageX, pageY, items })
 * oc.ContextMenu.hide()
 */
'use strict';

class ContextMenu {
    static instance = null;

    constructor() {
        this.menu = document.createElement('menu');
        this.menu.className = 'control-contextmenu';
        document.body.appendChild(this.menu);

        this.boundHideOnClick = this.hideOnClick.bind(this);
        this.boundHideOnContextMenu = this.hideOnContextMenu.bind(this);
        this.boundHideOnScroll = this.hide.bind(this);
        this.boundHideOnKeydown = this.hideOnKeydown.bind(this);
    }

    static getInstance() {
        if (!ContextMenu.instance) {
            ContextMenu.instance = new ContextMenu();
        }
        return ContextMenu.instance;
    }

    static show(options) {
        return ContextMenu.getInstance().openMenu(options);
    }

    static hide() {
        return ContextMenu.getInstance().hide();
    }

    openMenu(options) {
        const delay = this.isOpen() ? 100 : 0;

        this.hide();

        setTimeout(() => {
            if (options.items) {
                this.buildOptions(options.items);
            }

            this.showAt(options.pageX, options.pageY);
        }, delay);
    }

    closeMenu() {
        this.removeListeners();
        this.hide();
    }

    buildOptions(items) {
        this.menu.innerHTML = '';

        items.forEach(item => {
            this.buildOption(item);
        });
    }

    buildOption(option) {
        const li = document.createElement('li');
        li.className = 'contextmenu-item';

        let item;

        if (option.action) {
            const span = document.createElement('span');
            span.className = 'contextmenu-text';
            span.innerHTML = option.name;

            item = document.createElement('button');
            item.className = 'contextmenu-btn';
            item.appendChild(span);

            li.addEventListener('click', option.action);
            li.appendChild(item);
        }
        else {
            item = document.createElement('span');
            item.className = 'contextmenu-title';
            item.innerHTML = option.name;
            li.appendChild(item);
        }

        if (option.icon) {
            const icon = document.createElement('i');
            icon.className = 'contextmenu-icon icon-' + option.icon;
            item.insertBefore(icon, item.firstChild);
        }

        if (option.label) {
            const label = document.createElement('span');
            label.className = 'contextmenu-label';
            label.innerHTML = option.label;
            item.appendChild(label);
        }

        this.menu.appendChild(li);
    }

    showAt(x, y) {
        // Make visible but off-screen to measure
        this.menu.style.left = '-9999px';
        this.menu.style.top = '-9999px';
        this.menu.classList.add('is-visible');

        const w = window.innerWidth;
        const h = window.innerHeight;
        const mw = this.menu.offsetWidth;
        const mh = this.menu.offsetHeight;

        if (x + mw > w) { x = x - mw; }
        if (y + mh > h) { y = y - mh; }

        // Ensure menu doesn't go off-screen on the left or top
        if (x < 0) { x = 0; }
        if (y < 0) { y = 0; }

        this.menu.style.left = x + 'px';
        this.menu.style.top = y + 'px';

        this.addListeners();
    }

    hide() {
        this.menu.classList.remove('is-visible');
        this.removeListeners();
    }

    isOpen() {
        return this.menu.classList.contains('is-visible');
    }

    addListeners() {
        document.addEventListener('click', this.boundHideOnClick);
        document.addEventListener('contextmenu', this.boundHideOnContextMenu);
        document.addEventListener('scroll', this.boundHideOnScroll, true);
        document.addEventListener('keydown', this.boundHideOnKeydown);
    }

    removeListeners() {
        document.removeEventListener('click', this.boundHideOnClick);
        document.removeEventListener('contextmenu', this.boundHideOnContextMenu);
        document.removeEventListener('scroll', this.boundHideOnScroll, true);
        document.removeEventListener('keydown', this.boundHideOnKeydown);
    }

    hideOnClick(event) {
        // Allow clicking menu items to trigger their actions first
        if (this.menu.contains(event.target)) {
            // Hide after a brief delay to allow the action to fire
            setTimeout(() => this.hide(), 50);
        }
        else {
            this.hide();
        }
    }

    hideOnContextMenu(event) {
        // Hide current menu when right-clicking elsewhere
        if (!this.menu.contains(event.target)) {
            this.hide();
        }
    }

    hideOnKeydown(event) {
        if (event.key === 'Escape') {
            this.hide();
        }
    }

    dispose() {
        this.removeListeners();

        if (this.menu && this.menu.parentNode) {
            this.menu.parentNode.removeChild(this.menu);
        }

        this.menu = null;
        ContextMenu.instance = null;
    }
}

oc.ContextMenu = ContextMenu;
