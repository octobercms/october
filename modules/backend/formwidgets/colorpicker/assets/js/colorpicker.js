/*
 * ColorPicker plugin
 *
 * Data attributes:
 * - data-control="colorpicker" - enables the plugin on an element
 * - data-data-locker="input#locker" - Input element to store and restore the chosen color
 *
 * Config:
 * - showAlpha: false
 * - allowEmpty: false
 * - dataLocker: null
 * - disabled: false
 *
 */

'use strict';

oc.registerControl('colorpicker', class extends oc.ControlBase {
    connect() {
        this.$el = $(this.element);
        this.$dataLocker  = $(this.config.dataLocker, this.$el);
        this.$colorList = $('> ul', this.$el);
        this.$customColor = $('[data-custom-color]', this.$el);
        this.$customColorSpan = $('> span', this.$customColor);
        this.originalColor = this.$customColor.data('hexColor');

        if (!this.config.disabled) {
            this.$colorList.on('click', '> li', this.proxy(this.onSelectColor));
        }

        if (this.$customColor.length) {
            this.initSpectrum();

            if (!this.config.disabled) {
                this.$dataLocker.on('click', this.proxy(this.onClickLocker));
                this.$dataLocker.on('keyup', this.proxy(this.onKeyupLocker));
                this.$dataLocker.on('change', this.proxy(this.onChangeLocker));
            }
        }

        // Adds support for vanilla JS and jQuery change event
        // Bind to native and prevent recursion with event once
        this.triggerNativeChange = (event) => {
            oc.Events.dispatch('change', { target: event.currentTarget });
            $(event.currentTarget).one('change', this.triggerNativeChange);
        };

        this.$dataLocker.one('change', this.proxy(this.triggerNativeChange));
    }

    disconnect() {
        if (!this.config.disabled) {
            this.$colorList.off('click', '> li', this.proxy(this.onSelectColor));
        }

        if (this.$customColor.length) {
            this.$customColor.spectrum('destroy');

            if (!this.config.disabled) {
                this.$dataLocker.off('click', this.proxy(this.onClickLocker));
                this.$dataLocker.off('keyup', this.proxy(this.onKeyupLocker));
                this.$dataLocker.off('change', this.proxy(this.onChangeLocker));
            }
        }

        this.$dataLocker.off('change', this.proxy(this.triggerNativeChange));
    }

    onSelectColor(ev) {
        this.$dataLocker.val(
            $(ev.target).closest('li').data('hexColor')
        ).trigger('change');

        // Needed in case custom color is not used
        this.updateChosenColor(ev.target);
    }

    onClickLocker(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        this.$customColor.spectrum('show');
    }

    onKeyupLocker(ev) {
        this.$customColor.spectrum('set', $(ev.target).val());
    }

    onChangeLocker(ev) {
        this.setColor($(ev.target).val());
    }

    initSpectrum() {
        var self = this;

        this.$customColor.spectrum({
            preferredFormat: this.config.showAlpha ? 'hex8' : 'hex',
            showInput: true,
            showAlpha: !!this.config.showAlpha,
            allowEmpty: !!this.config.allowEmpty,
            color: this.$customColor.data('hexColor'),
            chooseText: $.oc.lang.get('colorpicker.choose', 'OK'),
            cancelText: '⨯',
            appendTo: 'parent',
            disabled: this.config.disabled,
            hide: function(color) {
                self.$customColorSpan.css('background', self.evalHexValue(color));
            },
            show: function(color) {
                self.onShowSpectrum(self.evalHexValue(color));
            },
            move: function(color) {
                self.$customColorSpan.css('background', self.evalHexValue(color));
            },
            change: function(color) {
                self.$dataLocker.val(self.evalHexValue(color)).trigger('change');
            }
        });
    }

    onShowSpectrum(hexColor) {
        this.$customColor.data('hexColor', hexColor);
        this.$dataLocker.val(hexColor);
        this.updateChosenColor(this.$customColor);
    }

    //
    // API
    //

    setColor(hexColor) {
        var $listColor = $('[data-hex-color="'+hexColor+'"]:not(.custom-color)', this.$el);

        // Locker is a custom value
        if (!$listColor.length && this.$customColor.length) {
            this.$customColorSpan.css('background', hexColor);
            this.$customColor.data('hexColor', hexColor);
            this.$customColor.spectrum('set', hexColor);
            $listColor = this.$customColor;
        }

        // Select the preset or custom
        if ($listColor.length) {
            this.updateChosenColor($listColor);
        }
    }

    //
    // Internals
    //

    updateChosenColor(el) {
        $(el).closest('li')
            .addClass('active')
            .siblings()
            .removeClass('active');
    }

    evalHexValue(color) {
        if (!color) {
            return '';
        }

        if (this.config.showAlpha) {
            return color.toHex8String();
        }

        return color.toHexString();
    }
});
