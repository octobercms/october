/*
 * Implements a new tooltips solution.
 *
 * The solution doesn't use Bootstrap tooltips and doesn't
 * require adding listeners to each control with a tooltip.
 * It can handle tooltips on dynamically added elements without
 * explicit initialization.
 */

+(function($) {
    'use strict';

    class Tooltips {
        constructor() {
            this.$tooltipElement = null;
            this.tooltipTimeout = null;

            this.onMouseEnter = (ev) => {
                if (!ev.target || !ev.target.getAttribute || !ev.target.dataset) {
                    return;
                }

                if (!ev.target.getAttribute('data-tooltip-text')) {
                    return;
                }

                this.clearTooltipTimeout();
                this.destroyTooltip();

                this.tooltipTimeout = setTimeout(() => {
                    this.createTooltip(ev.target);
                }, 300);
            }

            this.onMouseLeave = (ev) => {
                if (!ev.target || !ev.target.getAttribute || !ev.target.dataset) {
                    return;
                }

                if (!ev.target.getAttribute('data-tooltip-text')) {
                    return;
                }

                this.clearTooltipTimeout();
                this.destroyTooltip();
            }

            this.onMouseDown = (ev) => {
                this.destroyTooltip();
            }

            this.onKeyDown = (ev) => {
                this.destroyTooltip();
            };

            this.hideAllTooltips = () => {
                this.clearTooltipTimeout();
                if (this.$tooltipElement) {
                    this.$tooltipElement.remove();
                    this.$tooltipElement = null;
                }
            };

            this.addListeners();
        }

        addListeners() {
            document.addEventListener('mouseenter', this.onMouseEnter, true);
            document.addEventListener('mouseleave', this.onMouseLeave, true);
            document.addEventListener('mousedown', this.onMouseDown);
            document.addEventListener('click', this.onMouseDown);
            document.addEventListener('keydown', this.onKeyDown);
            addEventListener('ajax:before-update', this.hideAllTooltips);
            addEventListener('page:before-render', this.hideAllTooltips);
        }

        clear() {
            this.clearTooltipTimeout();
            this.destroyTooltip();
        }

        clearTooltipTimeout() {
            if (this.tooltipTimeout !== null) {
                clearTimeout(this.tooltipTimeout);
            }

            this.tooltipTimeout = null;
        }

        createTooltip(element) {
            if (!this.$tooltipElement) {
                this.$tooltipElement = $(
                    '<div class="october-tooltip tooltip-hidden tooltip-invisible"><span class="tooltip-text"></span><span class="tooltip-hotkey"></span></div>'
                );
                $(document.body).append(this.$tooltipElement);
            }

            this.$tooltipElement.find('.tooltip-text').text(element.getAttribute('data-tooltip-text'));
            var tooltipHotkey = element.getAttribute('data-tooltip-hotkey'),
                hotkeySpan = this.$tooltipElement.find('.tooltip-hotkey').html('');

            if (tooltipHotkey) {
                tooltipHotkey.split(',').forEach(function(hotkeys) {
                    hotkeySpan.append($('<i>').text(hotkeys.trim()));
                });
            }

            this.$tooltipElement.removeClass('tooltip-hidden');
            this.$tooltipElement.css('left', 0);

            var $element = $(element),
                elementOffset = $element.offset(),
                elementWidth = $element.outerWidth(),
                elementHeight = $element.height(),
                tooltipWidth = this.$tooltipElement.outerWidth(),
                bodyWidth = $(document.body).width(),
                left = Math.round(elementOffset.left + elementWidth / 2 - tooltipWidth / 2);

            if (left < 0) {
                left = 15;
            }

            var rightDiff = left + tooltipWidth - bodyWidth;
            if (rightDiff > 0) {
                left -= rightDiff + 15;
            }

            var tooltipHeight = this.$tooltipElement.outerHeight(),
                position = element.getAttribute('data-tooltip-position'),
                top = position === 'top'
                    ? elementOffset.top - tooltipHeight - 5
                    : elementOffset.top + elementHeight + 5;

            this.$tooltipElement.css({
                left: left,
                top: top
            });

            this.$tooltipElement.removeClass('tooltip-invisible');
        }

        destroyTooltip() {
            if (!this.$tooltipElement) {
                return;
            }

            this.$tooltipElement.addClass('tooltip-invisible');

            setTimeout(() => {
                if (this.$tooltipElement) {
                    this.$tooltipElement.addClass('tooltip-hidden');
                }
            }, 150);
        }
    }

    var tooltips = new Tooltips();

    oc.octoberTooltips = {
        clear: function() {
            tooltips.clear();
        }
    };

    // @deprecated
    $.oc.octoberTooltips = oc.octoberTooltips;
})(window.jQuery);
