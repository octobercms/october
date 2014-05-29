/*
 * Inspector control
 * 
 * Manages properties of inspectable controls.
 *
 * Data attributes:
 * - data-inspectable - makes a control inspectable.
 * - data-inspector-title - title for the inspector popup
 * - data-inspector-description - optional description for the inspector popup
 * - data-inspector-class - class name of the inspectable object. Required for drop-down 
 *   fields with dynamic options.
 * - data-inspector-container - specifies a CSS selector for the inspector container. The default container
 *   is the document body. The container element should be relative positioned. The 'self' container value
 *   allows to inject the inspector to the inspectable element.
 * - data-inspector-offset - offset in pixels to add to the calculated position, to make the position more "random"
 * - data-inspector-placement - top | bottom | left | right. The placement could automatically be changed 
     if the popover doesn't fit into the desired position.
 * - data-inspector-fallback-placement - The placement to use if the default placement
 *   and all other possible placements do not work. The default value is "bottom".
 * - data-inspector-config - Configuration of the inspector fields as an array in the JSON format. 
 *   Each element in the array is an object with the following properties:
 *   - property
 *   - title
 *   - type (currently supported types are: string, checkbox, dropdown)
 *   - description (optional)
 *   - validationPattern (regex pattern for for validating the value, supported by the text editor)
 *   - validationMessage (a message to display if the validation fails)
 *   - placeholder - placholder text, for text and dropdown properties
 *   - depends - a list of properties the property depend on, for dropdown lists
 *   - options - an option list for dropdown lists, optional. If not provided the options are loaded with AJAX.
 *   Example of the configuration string (a single property): 
 *   [{"property":"max-width","title":"Max width","type":"string"}]
 *
 * The Inspector requires the inspectable element to contain a hidden input element with the attribute "data-inspector-values".
 * The inspector uses this field to read and write field values. The field value is a JSON string, an object with keys matching property
 * names and values matching property values.
 *
 * Events
 * - change - the event is triggered on the inspectable element when it's properties are updated.
 * - showing.oc.inspector - triggered before the Inspector is displayed. Allows to cancel the action with e.preventDefault()
 * - hiding.oc.inspector - triggered before the Inspector is hidden. Allows to cancel the action with e.preventDefault()
 * - hidden.oc.inspector - triggered after the Inspector is hidden.
 *
 * Dependences: 
 * - october.popover.js
 */
+function ($) { "use strict";
    if ($.oc === undefined)
        $.oc = {}

    $.oc.inspector = {
        editors: {},
        propertyCounter: 0
    }
    
    // INSPECTOR CLASS DEFINITION
    // ============================

    var Inspector = function(element, options) {
        this.options   = options
        this.$el       = $(element)
        this.loadConfiguration()
    }

    Inspector.prototype.loadConfiguration = function() {
        var jsonString = this.$el.data('inspector-config')

        if (jsonString === undefined)
            throw new Error('The Inspector cannot be initialized because the Inspector configuration ' + 
                'attribute is not defined on the inspectable element.');

        if (!$.isArray(jsonString)) {
            try {
                this.config = $.parseJSON(jsonString)
            } catch(err) {
                throw new Error('Error parsing the Inspector field configuration. ' + err)
            }
        } else
            this.config = jsonString

        this.propertyValuesField = $('input[data-inspector-values]', this.$el)
        if (this.propertyValuesField.length === 0)
            throw new Error('Error initializing the Inspector: the inspectable element should contain ' +
                'an hidden input element with the data-inspector-values property.')
    }

    Inspector.prototype.getPopoverTemplate = function() {
        return '                                                                        \
                <div class="popover-head">                                              \
                    <h3>{{title}}</h3>                                                  \
                    {{#description}}                                                    \
                        <p>{{description}}</p>                                          \
                    {{/description}}                                                    \
                    <button type="button" class="close"                                 \
                        data-dismiss="popover"                                          \
                        aria-hidden="true">&times;</button>                             \
                </div>                                                                  \
                <form>                                                                  \
                    <table class="inspector-fields">                                    \
                        {{#properties}}                                                 \
                            <tr id="{{#propFormat}}{{property}}{{/propFormat}}">        \
                                <th><div title="{{title}}">                             \
                                {{title}}                                               \
                                {{#info}}{{/info}}                                      \
                                </div></th>                                             \
                                {{#editor}}{{/editor}}                                  \
                            </tr>                                                       \
                        {{/properties}}                                                 \
                    </table>                                                            \
                <form>                                                                  \
            '
    }

    Inspector.prototype.init = function() {
        var self = this,
            data = {
                title: this.$el.data('inspector-title'),
                description: this.$el.data('inspector-description'),
                properties: this.config,
                editor: function() {
                    return function(text, render) {
                        return self.renderEditor(this, render)
                    }
                },
                info: function() {
                    return function(text, render) {
                        if (this.description !== undefined && this.description != null)
                            return render('<span data-toggle="tooltip" title="{{description}}" class="info oc-icon-info"></span>', this)
                    }
                },
                propFormat: function() {
                    return function(text, render) {
                        return 'prop-'+render(text).replace('.', '-')
                    }
                }
            }

        this.editors   = []
        this.initProperties()

        this.$el.data('oc.inspectorVisible', true)

        var displayPopover = function() {
            var offset = self.$el.data('inspector-offset') 
            if (offset === undefined)
                offset = 15
            
            var offsetX = self.$el.data('inspector-offset-x'),
                offsetY = self.$el.data('inspector-offset-y') 

            var placement = self.$el.data('inspector-placement') 
            if (placement === undefined)
                placement = 'bottom'

            var fallbackPlacement = self.$el.data('inspector-fallback-placement') 
            if (fallbackPlacement === undefined)
                fallbackPlacement = 'bottom'

            self.$el.ocPopover({
                content: Mustache.render(self.getPopoverTemplate(), data),
                highlightModalTarget: true,
                modal: true,
                placement: placement,
                fallbackPlacement: fallbackPlacement,
                containerClass: 'control-inspector',
                container:  self.$el.data('inspector-container'),
                offset: offset,
                offsetX: offsetX,
                offsetY: offsetY,
                width: 300
            })

            self.$el.on('hiding.oc.popover', function(e){self.onBeforeHide(e)})
            self.$el.on('hide.oc.popover', function(){self.cleanup()})
            self.$el.addClass('inspector-open')
            
            $(self.$el.data('oc.popover').$container).on('keydown', function(e){
                if(e.keyCode == 13)
                    $(this).trigger('close.oc.popover')
            })

            if (self.editors.length > 0) {
                if (self.editors[0].focus !== undefined)
                    self.editors[0].focus()
            }

            $.each(self.editors, function(){
                if (this.init !== undefined)
                    this.init()
            })

            $('[data-toggle=tooltip]', self.$el.data('oc.popover').$container).tooltip({placement: 'auto right', container: 'body'})
        }

        var e = $.Event('showing.oc.inspector')
        this.$el.trigger(e, [{callback: displayPopover}])
        if (e.isDefaultPrevented()) 
            return

        if (!e.isPropagationStopped())
            displayPopover()
    }

    Inspector.prototype.initProperties = function() {
        var propertyValuesStr = $.trim(this.propertyValuesField.val())

        try {
            this.propertyValues = propertyValuesStr.length === 0 ? {} : $.parseJSON(propertyValuesStr)
            this.originalPropertyValues = $.extend(true, {}, this.propertyValues)
        } catch(err) {
            throw new Error('Error parsing the Inspector property values string. ' + err)
        }
    }

    Inspector.prototype.readProperty = function(property) {
        if (this.propertyValues[property] !== undefined)
            return this.propertyValues[property]

        return null
    }

    Inspector.prototype.writeProperty = function(property, value) {
        this.propertyValues[property] = value
        this.propertyValuesField.val(JSON.stringify(this.propertyValues))

        if (this.originalPropertyValues[property] === undefined || this.originalPropertyValues[property] != value) {
            this.$el.trigger('change')
            this.markPropertyChanged(property, true)
        } else
            this.markPropertyChanged(property, false)

        this.$el.trigger('propertyChanged.oc.Inspector', [property])

        return value
    }

    Inspector.prototype.markPropertyChanged = function(property, changed) {
        $('#prop-'+property.replace('.', '-'), this.$el.data('oc.popover').$container).toggleClass('changed', changed)
    }

    Inspector.prototype.renderEditor = function(data, render) {
        $.oc.inspector.propertyCounter ++

        var editorClass = 'inspectorEditor' 
            + data.type.charAt(0).toUpperCase() 
            + data.type.slice(1),
            editorId = 'inspector-property-'+data.type+$.oc.inspector.propertyCounter

        if ($.oc.inspector.editors[editorClass] === undefined)
            throw new Error('The Inspector editor class "' + editorClass + 
                '" is not defined in the $.oc.inspector.editors namespace.')

        var editor = new $.oc.inspector.editors[editorClass](editorId, this, data)
        this.editors.push(editor)

        return editor.renderEditor()
    }

    Inspector.prototype.cleanup = function() {
        this.$el.off('hiding.oc.popover')
        this.$el.off('hide.oc.popover')
        this.$el.off('.oc.Inspector')
        this.$el.removeClass('inspector-open')

        var e = $.Event('hidden.oc.inspector')
        this.$el.trigger(e)

        this.$el.data('oc.inspectorVisible', false)
    }

    Inspector.prototype.onBeforeHide = function(e) {
        $.each(this.editors, function() {
            this.applyValue()
        })

        var eH = $.Event('hiding.oc.inspector')
        this.$el.trigger(eH, [{values: this.propertyValues}])
        if (eH.isDefaultPrevented()) {
            e.preventDefault()
            return false
        }

        $.each(this.editors, function() {
            if (this.validate === undefined)
                return true

            var validationError = this.validate()
            if (!validationError)
                return true

            alert(validationError)
            e.preventDefault()

            var self = this
            setTimeout(function (){
                self.focus()
            }, 0)
            return false
        })

        var $contianer = this.$el.data('inspector-container')
        $('[data-toggle=tooltip]', this.$el.data('oc.popover').$container).tooltip('hide')
    }

    //
    // EDITOR DEFINITIONS 
    // ==================

    /*
     * Inspector editor classes should be defined in the $.oc.inspector.editors namespace.
     * Editors could be defined in other scripts. The methods editors should
     * define are:
     * - renderEditor(), the editor cell HTML
     * - validate(), optional, validates the value and returns the validation error message
     * - applyValue(), applies the editor value
     * - focus(), focuses the editor input element, if applicable
     */

    // STRING EDITOR
    // ==================

    var InspectorEditorString = function(editorId, inspector, fieldDef) {
        this.inspector = inspector
        this.fieldDef = fieldDef
        this.editorId = editorId
        this.selector = '#'+this.editorId+' input'

        var self = this
        $(document).on('focus', this.selector, function() {
            var $field = $(this)

            $('td', $field.closest('table')).removeClass('active')
            $field.closest('td').addClass('active')
        })

        $(document).on('change', this.selector, function() {
            self.applyValue()
        })
    }

    InspectorEditorString.prototype.applyValue = function() {
        this.inspector.writeProperty(this.fieldDef.property, $.trim($(this.selector).val()))
    }

    InspectorEditorString.prototype.renderEditor = function() {
        var data = {
            id: this.editorId,
            value: $.trim(this.inspector.readProperty(this.fieldDef.property)),
            placeholder: this.fieldDef.placeholder !== undefined ? this.fieldDef.placeholder : ''
        }

        return Mustache.render('<td class="text" id="{{id}}"><input type="text" value="{{value}}" placeholder="{{placeholder}}"/></td>', data)
    }

    InspectorEditorString.prototype.validate = function() {
        if (this.fieldDef.validationPattern === undefined)
            return

        var val = $.trim($(this.selector).val()),
            re = new RegExp(this.fieldDef.validationPattern, 'm')

        if (!val.match(re))
            return this.fieldDef.validationMessage
    }

    InspectorEditorString.prototype.focus = function() {
        $(this.selector).focus()
    }

    $.oc.inspector.editors.inspectorEditorString = InspectorEditorString;

    // CHECKBOX EDITOR
    // ==================
    
    var InspectorEditorCheckbox = function(editorId, inspector, fieldDef) {
        this.inspector = inspector
        this.fieldDef = fieldDef
        this.editorId = editorId
        this.selector = '#'+this.editorId+' input'

        var self = this

        $(document).on('change', this.selector, function() {
            self.applyValue()
        })
    }

    InspectorEditorCheckbox.prototype.applyValue = function() {
        this.inspector.writeProperty(this.fieldDef.property, $(this.selector).get(0).checked ? 1 : 0 )
    }

    InspectorEditorCheckbox.prototype.renderEditor = function() {
        var data = {
                id: this.editorId,
                checked: this.inspector.readProperty(this.fieldDef.property) ? 'checked' : null,
                cbId: this.editorId + '-cb',
                title: this.fieldDef.title
            }

        return Mustache.render(this.getTemplate(), data)
    }

    InspectorEditorCheckbox.prototype.focus = function() {
        $(this.selector).closest('div').focus()
    }

    InspectorEditorCheckbox.prototype.getTemplate = function() {
        return '                                              \
            <td id="{{id}}">                                  \
                <div tabindex="0" class="checkbox             \
                    custom-checkbox nolabel">                 \
                    <input type="checkbox"                    \
                        value="1"                             \
                        {{checked}} id="{{cbId}}"/>           \
                    <label for="{{cbId}}">{{title}}</label>   \
                </div>                                        \
            </td>                                             \
        ';
    }

    $.oc.inspector.editors.inspectorEditorCheckbox = InspectorEditorCheckbox;

    // DROPDOWN EDITOR
    // ==================
    
    var InspectorEditorDropdown = function(editorId, inspector, fieldDef) {
        this.inspector = inspector
        this.fieldDef = fieldDef
        this.editorId = editorId
        this.selector = '#'+this.editorId+' select'
        this.dynamicOptions = this.fieldDef.options ? false : true

        var self = this

        $(document).on('change', this.selector, function() {
            self.applyValue()
        })
    }

    InspectorEditorDropdown.prototype.applyValue = function() {
        this.inspector.writeProperty(this.fieldDef.property, $(this.selector).val())
    }

    InspectorEditorDropdown.prototype.renderEditor = function() {
        var 
            self = this,
            data = {
            id: this.editorId,
            value: $.trim(this.inspector.readProperty(this.fieldDef.property)),
            selectId: this.editorId + '-select',
            defaultOption: function() {
                return function(text, render) {
                    if (self.fieldDef.placeholder == undefined)
                        return ''

                    if (!Modernizr.touch)
                        return '<option></option>'
                }
            }
        }

        if (this.fieldDef.options) {
            var options = []

            if (this.fieldDef.placeholder !== undefined && Modernizr.touch)
                options.push({value: null, title: this.fieldDef.placeholder})

            $.each(this.fieldDef.options, function(value, title){
                options.push({value: value, title: title})
            })

           data.options = options
        }

        return Mustache.render(this.getTemplate(), data)
    }

    InspectorEditorDropdown.prototype.getTemplate = function() {
        return '                                                    \
            <td id="{{id}}" class="dropdown">                       \
                <select id="{{selectId}}" class="custom-select">    \
                    {{#defaultOption}}{{/defaultOption}}            \
                    {{#options}}                                    \
                        <option value="{{value}}">                  \
                            {{title}}                               \
                        </option>                                   \
                    {{/options}}                                    \
                </select>                                           \
            </td>                                                   \
        ';
    }

    InspectorEditorDropdown.prototype.init = function() {
        var value = this.inspector.readProperty(this.fieldDef.property),
            self = this

        $(this.selector).val(value)

        if (!Modernizr.touch) {
            var options = {
                    dropdownCssClass: 'ocInspectorDropdown'
                }

            if (this.fieldDef.placeholder !== undefined)
                options.placeholder = this.fieldDef.placeholder

            $(this.selector).select2(options)
        }

        if (this.dynamicOptions) {
            if (!Modernizr.touch) {
                this.indicatorContainer = $('.select2-container', $(this.selector).closest('td'))
                this.indicatorContainer.addClass('loading-indicator-container').addClass('size-small').addClass('transparent')
            }

            this.loadOptions()
        }

        if (this.fieldDef.depends)
            this.inspector.$el.on('propertyChanged.oc.Inspector', $.proxy(this.onDependencyChanged, this))
    }

    InspectorEditorDropdown.prototype.onDependencyChanged = function(ev, property) {
        if ($.inArray(property, this.fieldDef.depends) === -1)
            return

        var self = this,
            dependencyValues = this.getDependencyValues()

        if (this.prevDependencyValues === undefined || this.prevDependencyValues != dependencyValues)
            this.loadOptions()
    }

    InspectorEditorDropdown.prototype.saveDependencyValues = function() {
        this.prevDependencyValues = this.getDependencyValues()
    }

    InspectorEditorDropdown.prototype.getDependencyValues = function() {
        var dependencyValues = '',
            self = this

        $.each(this.fieldDef.depends, function(index, masterProperty){
            dependencyValues += masterProperty + ':' + self.inspector.readProperty(masterProperty) + '-'
        })

        return dependencyValues
    }

    InspectorEditorDropdown.prototype.showLoadingIndicator = function() {
        if (!Modernizr.touch)
            this.indicatorContainer.loadIndicator({'opaque': true}) 
    }

    InspectorEditorDropdown.prototype.hideLoadingIndicator = function() {
        if (!Modernizr.touch)
            this.indicatorContainer.loadIndicator('hide') 
    }

    InspectorEditorDropdown.prototype.loadOptions= function() {
        var $form = $(this.selector).closest('form'),
            data = this.inspector.propertyValues,
            $select = $(this.selector),
            currentValue = this.inspector.readProperty(this.fieldDef.property),
            self = this

        if (this.fieldDef.depends)
            this.saveDependencyValues()

        data.inspectorProperty = this.fieldDef.property
        data.inspectorClassName = this.inspector.options.inspectorClass

        this.showLoadingIndicator()

        $form.request('onInspectableGetOptions', {
            data: data,
            success: function(data) {
                $('option', $select).remove()

                if (self.fieldDef.placeholder !== undefined)
                    $select.append($('<option></option>'))

                if (data.options)
                    $.each(data.options, function(key, obj) {
                        $select.append($('<option></option>').attr('value', obj.value).text(obj.title))
                    })

                var hasOption = $('option[value="' + currentValue + '"]', $select).length > 0
                if (hasOption)
                    $select.val(currentValue)
                else
                    $('option:first-child', $select).attr("selected", "selected");

                $select.trigger('change')

                self.hideLoadingIndicator()
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseText.length ? jqXHR.responseText : jqXHR.statusText)
                self.hideLoadingIndicator()
            }
        })
    }

    $.oc.inspector.editors.inspectorEditorDropdown = InspectorEditorDropdown;

    // INSPECTOR DATA-API
    // ==================
 
    $(document).on('click', '[data-inspectable]', function(){
        var $this = $(this),
            inspector = $this.data('oc.inspector')

        if ($this.data('oc.inspectorVisible'))
            return false

        if (inspector === undefined) {
            inspector = new Inspector(this, $this.data())
            $this.data('oc.inspector', inspector)
        }

        inspector.init()
        return false
    })
}(window.jQuery);