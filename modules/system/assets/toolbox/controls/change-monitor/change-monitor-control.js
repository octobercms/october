/*
 * The form change monitor API.
 *
 * - Documentation: ../docs/change-monitor.md
 */
import { ControlBase } from 'larajax';

const $ = window.jQuery;

export default class ChangeMonitorControl extends ControlBase {
    // Static property for global disable state
    static globallyDisabled = false;

    static disable() {
        ChangeMonitorControl.globallyDisabled = true;
    }

    static enable() {
        ChangeMonitorControl.globallyDisabled = false;
    }

    init() {
        this.paused = false;
    }

    connect() {
        this.$el = $(this.element);

        this.$el.on('change', this.proxy(this.change));
        this.$el.on('unchange.oc.changeMonitor', this.proxy(this.unchange));
        this.$el.on('click ajaxSuccess', '[data-change-monitor-commit]', this.proxy(this.unchange));
        this.$el.on('pause.oc.changeMonitor', this.proxy(this.pause));
        this.$el.on('resume.oc.changeMonitor', this.proxy(this.resume));
        this.$el.on('pauseUnloadListener.oc.changeMonitor', this.proxy(this.pauseUnloadListener));
        this.$el.on('resumeUnloadListener.oc.changeMonitor', this.proxy(this.resumeUnloadListener));
        this.$el.on('keyup input paste', 'input:not(.ace_search_field):not([data-search-input]), textarea:not(.ace_text-input)', this.proxy(this.onInputChange));

        $('input:not([type=hidden]):not(.ace_search_field):not([data-search-input]), textarea:not(.ace_text-input)', this.$el).each(function() {
            $(this).data('oldval.oc.changeMonitor', $(this).val());
        });

        $(window).on('beforeunload', this.proxy(this.onBeforeUnload));
        addEventListener('page:before-visit', this.proxy(this.onBeforeUnloadTurbo));

        this.$el.trigger('ready.oc.changeMonitor');
    }

    disconnect() {
        if (this.$el === null) {
            return;
        }

        this.$el.off('change', this.proxy(this.change));
        this.$el.off('unchange.oc.changeMonitor', this.proxy(this.unchange));
        this.$el.off('click ajaxSuccess', '[data-change-monitor-commit]', this.proxy(this.unchange));
        this.$el.off('pause.oc.changeMonitor ', this.proxy(this.pause));
        this.$el.off('resume.oc.changeMonitor ', this.proxy(this.resume));
        this.$el.off('pauseUnloadListener.oc.changeMonitor', this.proxy(this.pauseUnloadListener));
        this.$el.off('resumeUnloadListener.oc.changeMonitor', this.proxy(this.resumeUnloadListener));
        this.$el.off('keyup input paste', 'input:not(.ace_search_field), textarea:not(.ace_text-input)', this.proxy(this.onInputChange));

        $(window).off('beforeunload', this.proxy(this.onBeforeUnload));
        removeEventListener('page:before-visit', this.proxy(this.onBeforeUnloadTurbo));

        this.$el = null;
    }

    change(ev, inputChange) {
        if (this.paused || ChangeMonitorControl.globallyDisabled) {
            return;
        }

        if (ev.target.className === 'ace_search_field') {
            return;
        }

        if (!inputChange) {
            var type = $(ev.target).attr('type');
            if (type === 'text' || type === 'password') {
                return;
            }
        }

        if (!this.$el.hasClass('oc-data-changed')) {
            this.$el.trigger('changed.oc.changeMonitor');
            this.$el.addClass('oc-data-changed');
        }
    }

    unchange() {
        if (this.paused || ChangeMonitorControl.globallyDisabled) {
            return;
        }

        if (this.$el.hasClass('oc-data-changed')) {
            this.$el.trigger('unchanged.oc.changeMonitor');
            this.$el.removeClass('oc-data-changed');
        }
    }

    onInputChange(ev) {
        if (this.paused || ChangeMonitorControl.globallyDisabled) {
            return;
        }

        var $el = $(ev.target);
        if ($el.data('oldval.oc.changeMonitor') !== $el.val()) {
            $el.data('oldval.oc.changeMonitor', $el.val());
            this.change(ev, true);
        }
    }

    pause() {
        this.paused = true;
    }

    resume() {
        this.paused = false;
    }

    pauseUnloadListener() {
        this.unloadListenerPaused = true;
    }

    resumeUnloadListener() {
        this.unloadListenerPaused = false;
    }

    shouldWarn() {
        return $.contains(document.documentElement, this.$el.get(0)) &&
            this.$el.hasClass('oc-data-changed') &&
            !this.unloadListenerPaused;
    }

    onBeforeUnload(event) {
        if (this.shouldWarn()) {
            event.preventDefault();
            return event.returnValue = '';
        }
    }

    // Disable PJAX to fallback to the browser unload event
    onBeforeUnloadTurbo(event) {
        const { url, action } = event.detail;
        if (this.shouldWarn() && action === 'advance') {
            event.preventDefault();
            location.assign(url);
        }
    }
}

// CUSTOM RENDERER
// ============================

addEventListener('render', function() {
    document.querySelectorAll('[data-change-monitor]:not([data-control~="change-monitor"])').forEach(function(element) {
        element.dataset.control = ((element.dataset.control || '') + ' change-monitor').trim();
    });
});

// JQUERY PLUGIN DEFINITION
// ============================

var old = $.fn.changeMonitor;

$.fn.changeMonitor = function (option) {
    return this.each(function () {
        var $this = $(this);

        // Check if already initialized via ControlBase
        if (this.ocChangeMonitorControl) {
            return;
        }

        // Add data-control attribute to trigger ControlBase initialization
        if (!this.matches('[data-control~="change-monitor"]')) {
            this.dataset.control = ((this.dataset.control || '') + ' change-monitor').trim();
        }

        // Trigger render to initialize the control
        oc.AjaxFramework.controller.render();
    });
}

$.fn.changeMonitor.Constructor = ChangeMonitorControl;

// CHANGEMONITOR NO CONFLICT
// ============================

$.fn.changeMonitor.noConflict = function () {
    $.fn.changeMonitor = old;
    return this;
}
