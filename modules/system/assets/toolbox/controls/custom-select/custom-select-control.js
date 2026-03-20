/*
 * Custom Select
 *
 * Config:
 * - animation: true
 * - autohide: true
 * - delay: 5000
 */
import { ControlBase } from 'larajax';

export default class CustomSelectControl extends ControlBase {
    init() {
        this.$el = $(this.element);
        this.initDefaults();
    }

    initDefaults() {
        const defaults = {
            animation: true,
            autohide: true,
            delay: 5000
        };

        for (const key in defaults) {
            if (this.element.dataset[key] === undefined) {
                this.element.dataset[key] = defaults[key];
            }
        }
    }

    connect() {
        // Internal Events
        this.formatSelectOption = function(state) {
            // Escape HTML
            var text = $('<span>').text(state.text).html();

            // Element is optgroup
            if (state.id === undefined) {
                return text;
            }

            var $option = $(state.element),
                statusColor = state.status ? state.status : $option.data('status'),
                iconClass = state.icon ? state.icon : $option.data('icon'),
                imageSrc = state.image ? state.image : $option.data('image');

            if (statusColor) {
                return '<span class="select-status status-indicator" style="background:'+statusColor+'"></span> ' + text;
            }

            if (iconClass) {
                return '<i class="select-icon '+iconClass+'"></i> ' + text;
            }

            if (imageSrc) {
                return '<img class="select-image" src="'+imageSrc+'" alt="" /> ' + text;
            }

            return text;
        }

        this.disableSelect = function(event, status) {
            if ($(this).data('select2') != null) {
                $(this).select2('enable', !status);
            }
        };

        // Adds support for vanilla JS and jQuery change event
        // Bind to native and prevent recursion with event once
        this.triggerNativeChange = (event) => {
            oc.Events.dispatch('change', { target: event.currentTarget });
            $(event.currentTarget).one('change', this.triggerNativeChange);
        };

        // Destroy placeholder if it is still there
        this.destroyPlaceholder();

        // Init
        this.$el.one('change', this.proxy(this.triggerNativeChange));
        this.$el.on('disable', this.proxy(this.disableSelect));

        this.bindCustomSelect();
        this.bindCustomSelectWorkaround();
    }

    disconnect() {
        this.clonePlaceholder();

        this.$el.off('change', this.proxy(this.triggerNativeChange));
        this.$el.off('disable', this.proxy(this.disableSelect));

        this.$el.off('select2:open', this.select2OpenWorkaround);

        if (this.$el.data('select2') != null) {
            this.$el.select2('destroy');
        }
    }

    bindCustomSelectWorkaround() {
        // Hack to reintroduce containerCssClass
        this.$el.data('select2').$container.addClass(this.options.containerCssClass);

        // Workaround for search not auto focusing (https://github.com/select2/select2/issues/5993)
        this.select2OpenWorkaround = function() {
            setTimeout(function() {
                var searchField = document.querySelector('.select2-container--open .select2-search__field');
                if (searchField) {
                    searchField.focus();
                }
            }, 100);
        };

        this.$el.on('select2:open', this.select2OpenWorkaround);
    }

    destroyPlaceholder() {
        var artefact = this.element && this.element.nextElementSibling;
        if (artefact && artefact.matches('.select2')) {
            artefact.remove();
        }
    }

    clonePlaceholder() {
        var artefact = this.element && this.element.nextElementSibling;
        if (artefact && artefact.matches('.select2')) {
            var newNode = artefact.cloneNode(true);
            artefact.parentNode.insertBefore(newNode, artefact.nextSibling);
            newNode.innerHtml = artefact.innerHtml;
            this.element.style.display = 'none';
        }
    }

    bindCustomSelect() {
        var options = this.options = this.buildSelectOptions();

        if (this.element.dataset.handler) {
            options = this.buildAjaxHandlerOption(options, this.element.dataset.handler);
        }

        if (this.element.dataset.tokenSeparators) {
            options = this.buildTokenSeparatorOptions(options, this.element.dataset.tokenSeparators);
        }

        this.$el.select2(options);
    }

    buildTokenSeparatorOptions(selectOptions, separators) {
        selectOptions.tags = true;
        selectOptions.tokenSeparators = separators.split('|');

        // When the dropdown is hidden, force the first option to be selected always.
        if (this.element.classList.contains('select-no-dropdown')) {
            selectOptions.selectOnClose = true;
            selectOptions.minimumInputLength = 1;

            this.$el.on('select2:closing', function() {
                var highlightedEls = $('.select2-dropdown.select-no-dropdown:first .select2-results__option--highlighted');
                if (highlightedEls.length > 0) {
                    highlightedEls.removeClass('select2-results__option--highlighted');
                    $('.select2-dropdown.select-no-dropdown:first .select2-results__option:first').addClass('select2-results__option--highlighted');
                }
            });
        }

        return selectOptions;
    }

    buildAjaxHandlerOption(selectOptions, handler) {
        var self = this;

        selectOptions.ajax = {
            transport: function(params, success, failure) {
                var request = oc.request(self.$el.get(0), handler, {
                    data: params.data
                });

                request.done(success);
                request.fail(failure);

                return request;
            },
            processResults: function (data, params) {
                var results = data.result || data.results,
                    options = [];

                delete(data.result);

                // Select2 format
                if (results[0] && typeof(results[0]) === 'object') {
                    options = results;
                }
                // Build key-value map
                else {
                    for (var i in results) {
                        if (results.hasOwnProperty(i)) {
                            options.push({
                                id: i,
                                text: results[i]
                            });
                        }
                    }
                }

                data.results = options;
                return data;
            },
            dataType: 'json'
        };

        return selectOptions;
    }

    buildSelectOptions() {
        var selectOptions = {
            templateResult: this.formatSelectOption,
            templateSelection: this.formatSelectOption,
            escapeMarkup: function(m) { return m },
            width: 'style',
            containerCssClass: '',
            dropdownCssClass: '',
            selectionCssClass: ''
        }

        if (this.element.classList.contains('select-no-search')) {
            selectOptions.minimumResultsForSearch = Infinity;
        }

        if (this.element.classList.contains('select-no-dropdown')) {
            selectOptions.dropdownCssClass += ' select-no-dropdown';
            selectOptions.selectionCssClass += ' select-no-dropdown';
        }

        if (this.element.classList.contains('select-hide-selected')) {
            selectOptions.dropdownCssClass += ' select-hide-selected';
        }

        if (this.element.classList.contains('select-dropdown-auto-width')) {
            selectOptions.dropdownAutoWidth = true;
            selectOptions.dropdownCssClass += ' select-dropdown-auto-width';
        }

        // Sizing
        if (this.element.classList.contains('form-control-sm')) {
            selectOptions.containerCssClass += ' form-control-sm';
        }

        if (this.element.classList.contains('form-control-lg')) {
            selectOptions.containerCssClass += ' form-control-lg';
        }

        // Language
        var language = this.element.dataset.language;
        if (!language) {
            var meta = document.querySelector('meta[name="backend-locale"]');
            if (meta) {
                language = meta.getAttribute('content');
            }
        }

        if (language) {
            selectOptions.language = language;
        }

        // Placeholder
        var placeholder = this.element.dataset.placeholder;
        if (placeholder) {
            selectOptions.placeholder = placeholder;
            selectOptions.allowClear = true;
        }

        return selectOptions;
    }

    static get DATANAME() {
        return 'ocSelect';
    }

    static get DEFAULTS() {
        return {
            animation: true,
            autohide: true,
            delay: 5000
        }
    }
}

// CUSTOM RENDERER
// ============================

addEventListener('render', function() {
    document.querySelectorAll('select.custom-select:not([data-control~="custom-select"])').forEach(function(element) {
        element.dataset.control = ((element.dataset.control || '') + ' custom-select').trim();
    });
});
