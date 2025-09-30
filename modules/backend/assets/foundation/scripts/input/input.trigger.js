/*
 * The trigger API
 */
+function ($) { "use strict";
    var windowResizeTimer;

    oc.registerControl('input-trigger', class extends oc.ControlBase {
        init() {
            if (this.config.triggerCondition === false) {
                throw new Error('Trigger condition is not specified.');
            }

            if (this.config.trigger === false) {
                throw new Error('Trigger selector is not specified.');
            }

            if (this.config.triggerAction === false) {
                throw new Error('Trigger action is not specified.');
            }

            this.triggerSelector = this.config.trigger;
            this.triggerAction = this.config.triggerAction;
            this.triggerCondition = this.config.triggerCondition;

            if (this.config.triggerCondition.indexOf('value') == 0) {
                var match = this.config.triggerCondition.match(/\[([^\]]*)\]/g);
                this.triggerCondition = 'value';
                this.triggerConditionValue = match ? match.map(m => m.slice(1, -1)) : [""];
            }

            this.conditionValid = this.triggerCondition == 'checked' ||
                this.triggerCondition == 'unchecked' ||
                this.triggerCondition == 'value';
        }

        connect() {
            this.$el = $(this.element);
            this.initTriggerParent();
            this.initState();

            this.$el.on('oc.triggerOn.update', this.proxy(this.onUpdatedExternally));
            if (this.conditionValid) {
                $(document).on('change', this.triggerSelector, this.proxy(this.onConditionChangedDebounce));
            }
        }

        disconnect() {
            this.$el.off('oc.triggerOn.update', this.proxy(this.onUpdatedExternally));
            if (this.conditionValid) {
                $(document).off('change', this.triggerSelector, this.proxy(this.onConditionChangedDebounce));
            }

            this.$el = null;
            this.triggerParent = null;

            if (this.changeDebounceTimeoutId !== null) {
                clearTimeout(this.changeDebounceTimeoutId);
            }
        }

        initState() {
            this.changeDebounceTimeoutId = null;

            if (oc.changeMonitor) {
                oc.changeMonitor.disable();
            }

            this.onConditionChanged();

            if (oc.changeMonitor) {
                oc.changeMonitor.enable();
            }
        }

        initTriggerParent() {
            this.triggerParent = undefined;
            if (this.config.triggerClosestParent !== undefined) {
                var closestParentElements = this.config.triggerClosestParent.split(',');
                for (var i = 0; i < closestParentElements.length; i++) {
                    var $triggerElement = this.$el.closest(closestParentElements[i]);
                    if ($triggerElement.length) {
                        this.triggerParent = $triggerElement;
                        break;
                    }
                }
            }
        }

        onUpdatedExternally(ev) {
            ev.stopPropagation();
            this.onConditionChanged();
        }

        onConditionChangedDebounce() {
            if (this.changeDebounceTimeoutId !== null) {
                clearTimeout(this.changeDebounceTimeoutId);
            }

            this.changeDebounceTimeoutId = setTimeout(() => this.onConditionChanged(), 30);
        }

        onConditionChanged() {
            if (this.triggerCondition == 'checked') {
                this.updateTarget(!!$(this.triggerSelector + ':checked', this.triggerParent).length);
            }
            else if (this.triggerCondition == 'unchecked') {
                this.updateTarget(!$(this.triggerSelector + ':checked', this.triggerParent).length);
            }
            else if (this.triggerCondition == 'value') {
                var trigger, triggered = false;

                trigger = $(this.triggerSelector, this.triggerParent)
                    .not('input[type=checkbox], input[type=radio], input[type=button], input[type=submit]');

                if (!trigger.length) {
                    trigger = $(this.triggerSelector, this.triggerParent)
                        .not(':not(input[type=checkbox]:checked, input[type=radio]:checked)');
                }

                var self = this;
                trigger.each(function() {
                    var triggerValue = $(this).val(),
                        valueArray = Array.isArray(triggerValue) ? triggerValue : [triggerValue];

                    if (valueArray.length === 0) {
                        valueArray = [''];
                    }

                    $.each(valueArray, function(key, val) {
                        triggered = self.matchWildcardConditions(val, self.triggerConditionValue);
                        return !triggered;
                    });

                    return !triggered;
                });

                this.updateTarget(triggered);
            }
        }

        // matchWildcardConditions handles multiple trigger condition values
        matchWildcardConditions(value, conditionArr) {
            var matchFound = false;
            conditionArr.forEach((condition) => {
                if (!matchFound && this.matchWildcardString(value, condition)) {
                    matchFound = true;
                }
            });
            return matchFound;
        }

        // matchWildcardString matches a value (MyString) to a condition (My*)
        matchWildcardString(value, condition) {
            if(condition === "*") {
                return !!value;
            }
            var escapeRegex = (value) => value.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
            return new RegExp("^" + condition.split("*").map(escapeRegex).join(".*") + "$").test(value);
        }

        updateTarget(status) {
            var actions = this.triggerAction.split('|');

            $.each(actions, (index, action) => {
                this.updateTargetAction(action, status);
            });

            this.$el.trigger('oc.triggerOn.afterUpdate', status);

            oc.Events.dispatch('trigger:after-update', { target: this.$el.get(0), status: status });

            this.finishUpdate();
        }

        finishUpdate() {
            if (windowResizeTimer !== undefined) {
                window.clearTimeout(windowResizeTimer);
            }

            windowResizeTimer = setTimeout(function() {
                oc.Events.dispatch('trigger:complete');
                $(window).trigger('resize');
            }, 1);
        }

        updateTargetAction(action, status) {
            if (action == 'show') {
                this.$el
                    .toggleClass('oc-hide', !status)
                    .trigger('hide.oc.triggerapi', [!status]);

                oc.Events.dispatch('trigger:hide', { target: this.$el.get(0), status: !status });
            }
            else if (action == 'hide') {
                this.$el
                    .toggleClass('oc-hide', status)
                    .trigger('hide.oc.triggerapi', [status]);

                oc.Events.dispatch('trigger:hide', { target: this.$el.get(0), detail: { status: status } });
            }
            else if (action == 'enable') {
                this.$el
                    .prop('disabled', !status)
                    .toggleClass('control-disabled', !status)
                    .trigger('disable.oc.triggerapi', [!status]);

                oc.Events.dispatch('trigger:disable', { target: this.$el.get(0), detail: { status: !status } });
            }
            else if (action == 'disable') {
                this.$el
                    .prop('disabled', status)
                    .toggleClass('control-disabled', status)
                    .trigger('disable.oc.triggerapi', [status]);

                oc.Events.dispatch('trigger:disable', { target: this.$el.get(0), detail: { status: status } });
            }
            else if (action.indexOf('fill') == 0 && status) {
                var fillMatch = action.match(/[^[\]]+(?=])/g),
                    fillValue = fillMatch ? fillMatch[0] : '1';
                this.$el
                    .not('input[type=checkbox], input[type=radio], input[type=button], input[type=submit]')
                    .val(fillValue);

                this.$el
                    .not(':not(input[type=checkbox], input[type=radio])')
                    .prop('checked', true);

                this.$el
                    .trigger('fill.oc.triggerapi')
                    .trigger('change');

                oc.Events.dispatch('trigger:fill', { target: this.$el.get(0), detail: { fillValue: fillValue } });
            }
            else if (action == 'empty' && status) {
                this.$el
                    .not('input[type=checkbox], input[type=radio], input[type=button], input[type=submit]')
                    .val('');

                this.$el
                    .not(':not(input[type=checkbox], input[type=radio])')
                    .prop('checked', false);

                this.$el
                    .trigger('empty.oc.triggerapi')
                    .trigger('change');

                oc.Events.dispatch('trigger:empty', { target: this.$el.get(0) });
            }

            if (action == 'show' || action == 'hide') {
                this.fixButtonClasses();
            }
        }

        fixButtonClasses() {
            var group = this.$el.closest('.btn-group');

            if (group.length > 0 && this.$el.is(':last-child')) {
                this.$el.prev().toggleClass('last', this.$el.hasClass('oc-hide'));
            }
        }
    });

    // MAGIC ATTRIBUTE
    // ============================

    addEventListener('render', () => {
        document.querySelectorAll('[data-trigger]:not([data-control~="input-trigger"])').forEach((element) => {
            element.dataset.control = ((element.dataset.control || '') + ' input-trigger').trim();
        });
    });

    // JQUERY PLUGIN DEFINITION
    // ============================

    $.fn.triggerOn = function (config) {
        this.each((index, element) => {
            config = config || {};
            for (const key in config) {
                if (key.startsWith('trigger')) {
                    element.dataset[key] = config[key];
                }
            }

            if (!element.matches('[data-control~="input-trigger"]')) {
                element.dataset.control = ((element.dataset.control || '') + ' input-trigger').trim();
            }
        });
    };

}(window.jQuery);
