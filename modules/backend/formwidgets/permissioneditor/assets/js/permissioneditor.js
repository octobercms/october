import { ControlBase, registerControl } from 'larajax';

/*
 * Permission Editor form field control
 *
 * Data attributes:
 * - data-control="permissioneditor" - enables the permission editor plugin
 *
 * JavaScript API:
 * oc.fetchControl(element, 'permissioneditor')
 */
registerControl('permissioneditor', class extends ControlBase {
    init() {
    }

    connect() {
        this.$el = $(this.element);

        this.listen('click', '[data-field-permission-all]', this.onPermissionAllClick);
        this.listen('click', '[data-field-permission-none]', this.onPermissionNoneClick);
        this.listen('click', '[data-field-permission-toggle]', this.onPermissionToggleClick);
        this.listen('click', 'li.permission-item label.item-name', this.onPermissionNameClick);
        this.listen('change', 'li.mode-checkbox input[type=checkbox]', this.renderViewState);
        this.listen('change', 'li.mode-radio input[type=radio]', this.renderViewState);

        this.renderViewState();
    }

    disconnect() {
        this.$el = null;
    }

    // EVENT HANDLERS
    // ============================

    renderViewState() {
        this.evalDisabledStateForAll();
        this.evalNestingOptions();
        this.evalSelectionStateForAll();
    }

    evalDisabledStateForAll() {
        var self = this;
        $('li', this.$el).each(function() {
            self.evalDisabledState($(this));
        });
    }

    evalDisabledState($item) {
        var isDisabled;

        if ($item.hasClass('mode-checkbox')) {
            isDisabled = !$('> .item-content > .item-value > input[type=checkbox]', $item).is(':checked');
        }
        else {
            isDisabled = $('> .item-content > .item-value > input[type=radio][value=-1]', $item).is(':checked');
        }

        $item.toggleClass('disabled', isDisabled);
    }

    evalNestingOptions($items) {
        if (!$items) {
            $items = $('> ul > li', this.$el);
        }

        var self = this;
        $items.each(function() {
            var $item = $(this);

            if (!$item.hasClass('disabled')) {
                $('> ul > li > .item-content > .item-value > input', $item)
                    .prop('readonly', false);
            }
            else if ($item.hasClass('mode-checkbox')) {
                $('> ul > li > .item-content > .item-value > input', $item)
                    .prop('readonly', true)
                    .prop('checked', false)
                    .closest('li').addClass('disabled');
            }
            else if ($item.hasClass('mode-radio')) {
                $('> ul > li > .item-content > .item-value > input', $item)
                    .prop('readonly', true)
                    .prop('checked', false);

                $('> ul > li > .item-content > .item-value > input[value=-1]', $item)
                    .prop('checked', true)
                    .closest('li').addClass('disabled');
            }

            self.evalNestingOptions($('> ul > li', $item));
        });
    }

    evalSelectionStateForAll(ev) {
        var self = this;
        $('li.permission-section', this.$el).each(function() {
            self.evalSelectionState(this);
        });
    }

    evalSelectionState(el) {
        var $header = $(el),
            $checkNone = $('[data-field-permission-none]', $header),
            $checkAll = $('[data-field-permission-all]', $header);

        if (!$checkAll.length || !$checkNone.length) {
            return;
        }

        $checkAll.show();
        $checkNone.hide();

        $header.nextUntil('li.permission-section').each(function() {
            var $row = $(this);
            if (!$row.hasClass('disabled')) {
                $checkNone.show();
                $checkAll.hide();
                return false;
            }
        });
    }

    onPermissionAllClick(ev) {
        var self = this,
            $header = $(ev.target).closest('li');

        $header.nextUntil('li.permission-section').each(function() {
            var $row = $(this);
            self.onPermissionNameClick({ target: $row.get(0) }, true);

            // Children
            $('li', this).each(function() {
                self.onPermissionNameClick({ target: this }, true);
            });
        });
    }

    onPermissionNoneClick(ev) {
        var self = this,
            $header = $(ev.target).closest('li');

        $header.nextUntil('li.permission-section').each(function() {
            var $row = $(this);
            self.onPermissionNameClick({ target: $row.get(0) }, false);

            // Children
            $('li', this).each(function() {
                self.onPermissionNameClick({ target: this }, false);
            });
        });
    }

    onPermissionToggleClick(ev) {
        var self = this,
            $header = $(ev.target).closest('li'),
            $radios = $header.next().find('> .item-content > .item-value > input[type=radio]'),
            nextIndex = this.findNextIndexFromRadio($radios);

        $header.nextUntil('li.permission-section').each(function() {
            var $row = $(this);
            self.onPermissionNameClick({ target: $row.get(0) }, nextIndex);

            // Children
            $('li', this).each(function() {
                self.onPermissionNameClick({ target: this }, nextIndex);
            });
        });
    }

    findNextIndexFromRadio($radios) {
        var nextIndex = 0;

        for (var i=2; i>=0; i--) {
            if ($radios.get(i).checked) {
                nextIndex = i + 1;
                break;
            }
        }

        if (nextIndex > 2) {
            nextIndex = 0;
        }

        return nextIndex;
    }

    onPermissionNameClick(ev, isChecked) {
        var $row = $(ev.target).closest('li'),
            $checkbox = $row.find('> .item-content > .item-value > input[type=checkbox]');

        if ($checkbox.length) {
            if (isChecked !== undefined) {
                $checkbox.prop('checked', isChecked);
                this.renderViewState();
            }
            else {
                $checkbox.trigger('click');
            }
        }
        else {
            var $radios = $row.find('> .item-content > .item-value > input[type=radio]');
            if ($radios.length != 3) {
                return;
            }

            if (isChecked !== undefined) {
                $($radios.get(isChecked)).prop('checked', true);
                this.renderViewState();
            }
            else {
                var nextIndex = this.findNextIndexFromRadio($radios);
                $($radios.get(nextIndex)).trigger('click');
            }
        }
    }
});
