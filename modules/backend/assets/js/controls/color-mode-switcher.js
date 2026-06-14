oc.registerControl('color-mode-switcher', class extends oc.ControlBase {
    init() {
        this.$anchor = this.element.querySelector('a');
        this.$label = this.element.querySelector('.nav-label');
        this.$icon = this.element.querySelector('.nav-icon > i');
    }

    connect() {
        this.listen('click', this.$anchor, this.onToggleSwitch)
        this.updateUi();
    }

    onToggleSwitch() {
        var current = this.getCurrentMode(),
            preferred;

        if (current === 'light') {
            preferred = 'dark';
        }
        else if (current === 'dark') {
            preferred = 'auto';
        }
        else {
            preferred = 'light';
        }

        $.oc.setColorModeTheme(preferred);

        Cookies.set('admin_color_mode_user', preferred, { expires: 365, path: '/' });

        if (preferred === 'auto') {
            document.documentElement.classList.add('color-mode-auto');
        }
        else {
            document.documentElement.classList.remove('color-mode-auto');
        }

        this.updateUi();
    }

    updateUi() {
        var mode = this.getCurrentMode();

        if (mode === 'light') {
            this.$label.innerText = this.element.dataset.langDarkMode;
            this.$icon.setAttribute('class', 'icon-moon');
        }
        else if (mode === 'dark') {
            this.$label.innerText = this.element.dataset.langAutoMode;
            this.$icon.setAttribute('class', 'icon-adjust');
        }
        else {
            this.$label.innerText = this.element.dataset.langLightMode;
            this.$icon.setAttribute('class', 'icon-sun');
        }
    }

    getCurrentMode() {
        var userCookie = Cookies.get('admin_color_mode_user');
        if (userCookie === 'auto') {
            return 'auto';
        }
        if (document.documentElement.classList.contains('color-mode-auto') && !userCookie) {
            return 'auto';
        }
        return document.documentElement.getAttribute('data-bs-theme');
    }
});
