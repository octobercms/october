/*
=require ../vendor/modernizr/modernizr.js
=require ../vendor/mustache/mustache.js
=require foundation.js
=require popover.js
=require tooltip.js
=require checkbox.js
=require select.js
*/
/*
 * Inspector control
 *
 * - Documentation: ../docs/inspector.md
 */
+function ($) { "use strict";
    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

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

        this.title = false
        this.description = false

        Base.call(this)
    }

    Inspector.prototype = Object.create(BaseProto)
    Inspector.prototype.constructor = Inspector

    Inspector.prototype.loadConfiguration = function(onSuccess) {
        var configString = this.$el.data('inspector-config')
        if (configString !== undefined) {
            // If the data-inspector-config attribute is provided,
            // load the configuration from it
            this.parseConfiguration(configString)

            if (onSuccess !== undefined)
                onSuccess();
        } else {
            // If the data-inspector-config attribute is not provided,
            // request the configuration from the server.
            var $form = $(this.selector).closest('form'),
                data = this.$el.data(),
                self = this

            $.oc.stripeLoadIndicator.show()

            var request = $form.request('onGetInspectorConfiguration', {
                data: data
            }).done(function(data) {
                self.parseConfiguration(data.configuration.properties)

                if (data.configuration.title !== undefined)
                    self.title = data.configuration.title

                if (data.configuration.description !== undefined)
                    self.description = data.configuration.description

                $.oc.stripeLoadIndicator.hide()

                if (onSuccess !== undefined)
                    onSuccess();
            }).always(function() {
                $.oc.stripeLoadIndicator.hide()
            })
        }
    }

    Inspector.prototype.parseConfiguration = function(jsonString) {
        if (jsonString === undefined)
            throw new Error('The Inspector cannot be initialized because the Inspector configuration ' + 
                'attribute is not defined on the inspectable element.');

        if (!$.isArray(jsonString) && !$.isPlainObject(jsonString)) {
            try {
                this.config = $.parseJSON(jsonString)
            } catch(err) {
                throw new Error('Error parsing the Inspector field configuration. ' + err)
            }
        } else
            this.config = jsonString

        this.propertyValuesField = $('input[data-inspector-values]', this.$el)

        // Inspector saves property values to data-property-xxx attributes if the input[data-inspector-values] 
        // doesn't exist, so the condition is not required.
        //
        // if (this.propertyValuesField.length === 0)
        //     throw new Error('Error initializing the Inspector: the inspectable element should contain ' +
        //         'an hidden input element with the data-inspector-values property.')
    }

    Inspector.prototype.getPopoverTemplate = function() {
        return '                                                                                                      \
                <div class="popover-head">                                                                            \
                    <h3>{{title}}</h3>                                                                                \
                    {{#description}}                                                                                  \
                        <p>{{description}}</p>                                                                        \
                    {{/description}}                                                                                  \
                    <button type="button" class="close"                                                               \
                        data-dismiss="popover"                                                                        \
                        aria-hidden="true">&times;</button>                                                           \
                </div>                                                                                                \
                <form autocomplete="off" onsubmit="return false">                                                     \
                    <table class="inspector-fields {{#tableClass}}{{/tableClass}}">                                   \
                        {{#properties}}                                                                               \
                            <tr id="{{#propFormat}}{{property}}{{/propFormat}}" data-property="{{property}}"          \
                                {{#dataGroupIndex}}{{/dataGroupIndex}}                                                \
                                class="{{#cellClass}}{{/cellClass}}">                                                 \
                                <th {{#colspan}}{{/colspan}}><div><div><span class="title-element" title="{{title}}"> \
                                {{#expandControl}}{{/expandControl}}                                                  \
                                {{title}}</span>                                                                      \
                                {{#info}}{{/info}}                                                                    \
                                </div></div></th>                                                                     \
                                {{#editor}}{{/editor}}                                                                \
                            </tr>                                                                                     \
                        {{/properties}}                                                                               \
                    </table>                                                                                          \
                <form>                                                                                                \
            '
    }

    Inspector.prototype.init = function() {
        // Exit if there are no properties
        if (!this.config || this.config.length == 0)
            return

        this.editors   = []
        this.initProperties()

        this.$el.data('oc.inspectorVisible', true)

        var e = $.Event('showing.oc.inspector')
        this.$el.trigger(e, [{callback: this.proxy(this.displayPopover)}])
        if (e.isDefaultPrevented())
            return

        if (!e.isPropagationStopped())
            this.displayPopover()
    }

    Inspector.prototype.displayPopover = function() {
        var fieldsConfig = this.preprocessConfig(),
            renderEditorBound = this.proxy(this.renderEditor),
            groupExpandedBound = this.proxy(this.groupExpanded),
            data = {
                title: this.title ? this.title : this.$el.data('inspector-title'),
                description: this.description ? this.description : this.$el.data('inspector-description'),
                properties: fieldsConfig.properties,
                editor: function() {
                    return function(text, render) {
                       if (this.itemType == 'property')
                           return renderEditorBound(this, render)
                    }
                },
                info: function() {
                    return function(text, render) {
                        if (this.description !== undefined && this.description != null)
                            return render('<span title="{{description}}" class="info oc-icon-info with-tooltip"></span>', this)
                    }
                },
                propFormat: function() {
                    return function(text, render) {
                        return 'prop-'+render(text).replace('.', '-')
                    }
                },
                colspan: function() {
                    return function(text, render) {
                        return this.itemType == 'group' ? 'colspan="2"' : null
                    }
                },
                tableClass: function() {
                    return function(text, render) {
                        return fieldsConfig.hasGroups ? 'has-groups' : null
                    }
                },
                cellClass: function() {
                    return function(text, render) {
                        var result = this.itemType + ((this.itemType == 'property' && this.groupIndex !== undefined) ? ' grouped' : '')

                       if (this.itemType == 'property' && this.groupIndex !== undefined)
                           result += groupExpandedBound(this.group) ? ' expanded' : ' collapsed'

                        if (this.itemType == 'property' && !this.showExternalParam)
                            result += ' no-external-parameter'

                        return result
                    }
                },
                expandControl: function() {
                    return function(text, render) {
                        if (this.itemType == 'group') {
                            this.itemStatus = groupExpandedBound(this.title) ? 'expanded' : ''

                            return render('<a class="expandControl {{itemStatus}}" href="javascript:;" data-group-index="{{groupIndex}}"><span>Expand/collapse</span></a>', this)
                        }
                    }
                },
                dataGroupIndex: function() {
                    return function(text, render) {
                        return this.groupIndex !== undefined && this.itemType == 'property' ? render('data-group-index={{groupIndex}}', this) : ''
                    }

                }
            }

        var offset = this.$el.data('inspector-offset')
        if (offset === undefined)
            offset = 15

        var offsetX = this.$el.data('inspector-offset-x'),
            offsetY = this.$el.data('inspector-offset-y')

        var placement = this.$el.data('inspector-placement')
        if (placement === undefined)
            placement = 'bottom'

        var fallbackPlacement = this.$el.data('inspector-fallback-placement') 
        if (fallbackPlacement === undefined)
            fallbackPlacement = 'bottom'

        this.$el.ocPopover({
            content: Mustache.render(this.getPopoverTemplate(), data),
            highlightModalTarget: true,
            modal: true,
            placement: placement,
            fallbackPlacement: fallbackPlacement,
            containerClass: 'control-inspector',
            container:  this.$el.data('inspector-container'),
            offset: offset,
            offsetX: offsetX,
            offsetY: offsetY,
            width: 400
        })

        this.$el.on('hiding.oc.popover', this.proxy(this.onBeforeHide))
        this.$el.on('hide.oc.popover', this.proxy(this.cleanup))
        this.$el.addClass('inspector-open')

        $(this.$el.data('oc.popover').$container).on('keydown', this.proxy(this.onPopoverKeyDown))

        if (this.editors.length > 0) {
            if (this.editors[0].focus !== undefined)
                this.editors[0].focus()
        }

        if (this.$el.closest('[data-inspector-external-parameters]').length > 0)
            this.initExternalParameterEditor(this.$el.data('oc.popover').$container)

        for (var i=0, len = this.editors.length; i < len; i++) {
            if (this.editors[i].init !== undefined)
                this.editors[i].init()
        }

        $('.with-tooltip', this.$el.data('oc.popover').$container)
            .tooltip({ placement: 'auto right', container: 'body', delay: 500 })

        var $container = this.$el.data('oc.popover').$container
        $container.on('click', 'tr.group', this.proxy(this.onGroupClick))

        var cssClass = this.options.inspectorCssClass

        if (cssClass !== undefined)
            $container.addClass(cssClass)
    }

    Inspector.prototype.onPopoverKeyDown = function(ev) {
        if(ev.keyCode == 13)
            $(ev.currentTarget).trigger('close.oc.popover')
    }

    Inspector.prototype.onGroupClick = function(ev) {
        var $container = this.$el.data('oc.popover').$container
        this.toggleGroup($('a.expandControl', ev.target), $container)

        return false
    }

    /*
     * Initializes the external parameter editors for properties that support this feature.
     */
    Inspector.prototype.initExternalParameterEditor = function($container) {
        var self = this

        $('table.inspector-fields tr', $container).each(function(){
            if (!$(this).hasClass('no-external-parameter')) {
                var property = $(this).data('property'),
                    $td = $('td', this),
                    $editorContainer = $('<div class="external-param-editor-container"></div>'),
                    $editor = $(
                        '<div class="external-editor">                  \
                            <div class="controls">                      \
                                <input type="text" tabindex="-1"/>      \
                                <a href="#" tabindex="-1">              \
                                    <i class="oc-icon-terminal"></i>    \
                                </a>                                    \
                            </div>                                      \
                        </div>')

                $editorContainer.append($td.children())
                $editorContainer.append($editor)
                $td.append($editorContainer)

                var $editorLink = $('a', $editor)

                $editorLink
                    .click(function() {
                        return self.toggleExternalParameterEditor($(this))
                    })
                    .attr('title', 'Click to enter the external parameter name to load the property value from')
                    .tooltip({'container': 'body', delay: 500})

                var $input = $editor.find('input'),
                    propertyValue = self.propertyValues[property]

                $input.on('focus', function(){
                    var $field = $(this)

                    $('td', $field.closest('table')).removeClass('active')
                    $field.closest('td').addClass('active')
                })

                $input.on('change', function(){
                    self.markPropertyChanged(property, true)
                })

                var matches = []
                if (propertyValue) {
                    if (matches = propertyValue.match(/^\{\{([^\}]+)\}\}$/)) {
                        var value = $.trim(matches[1])

                        if (value.length > 0) {
                            self.showExternalParameterEditor($editorContainer, $editor, $editorLink, $td, true)
                            $editor.find('input').val(value)
                            self.writeProperty(property, null, true)
                        }
                    }
                }
            }
        })
    }

    Inspector.prototype.showExternalParameterEditor = function($container, $editor, $editorLink, $cell, noAnimation) {
        var position = $editor.position()
        $('input', $editor).focus()

        if (!noAnimation) {
            $editor.css({
                'left': position.left + 'px',
                'right': 0
            })
        } else {
            $editor.css('right', 0)
        }

        setTimeout(function(){
            $editor.css('left', 0)
            $cell.scrollTop(0)
        }, 0)

        $container.addClass('editor-visible')
        $editorLink.attr('data-original-title', 'Click to enter the property value')
        this.toggleCellEditorVisibility($cell, false)
        $editor.find('input').attr('tabindex', 0)
    }

    Inspector.prototype.toggleExternalParameterEditor = function($editorLink) {
        var $container = $editorLink.closest('.external-param-editor-container'),
            $editor = $('.external-editor', $container),
            $cell = $editorLink.closest('td'),
            self = this

        $editorLink.tooltip('hide')

        if (!$container.hasClass('editor-visible')) {
            self.showExternalParameterEditor($container, $editor, $editorLink, $cell)
        } else {
            var left = $container.width()

            $editor.css('left', left + 'px')
            setTimeout(function(){
                $editor.css({
                    'left': 'auto',
                    'right': '30px'
                })
                $container.removeClass('editor-visible')
                $container.closest('td').removeClass('active')

                var property = $container.closest('tr').data('property'),
                    propertyEditor = self.findEditor(property)

                if (propertyEditor && propertyEditor.onHideExternalParameterEditor !== undefined)
                    propertyEditor.onHideExternalParameterEditor()
            }, 200)
            $editorLink.attr('data-original-title', 'Click to enter the external parameter name to load the property value from')
            $editor.find('input').attr('tabindex', -1)
            self.toggleCellEditorVisibility($cell, true)
        }

        return false
    }

    Inspector.prototype.toggleCellEditorVisibility = function($cell, show) {
        var $container = $('.external-param-editor-container', $cell)

        $container.children().each(function(){
            var $el = $(this)

            if ($el.hasClass('external-editor'))
                return

            if (show)
                $el.removeClass('hide')
            else {
                var height = $cell.data('inspector-cell-height')

                if (!height) {
                    height = $cell.height()
                    $cell.data('inspector-cell-height', height)
                }

                $container.css('height', height + 'px')
                $el.addClass('hide')
            }
        })
    }

    /*
     * Creates group nodes in the property set
     */
    Inspector.prototype.preprocessConfig = function() {
        var fields = [],
            result = {
                hasGroups: false,
                properties: []
            },
            groupIndex = 0

        function findGroup(title) {
            var groups = $.grep(fields, function(item) {
                return item.itemType !== undefined && item.itemType == 'group' && item.title == title
            })

            if (groups.length > 0)
                return groups[0]

            return null
        }

        $.each(this.config, function() {
            this.itemType = 'property'

            if (this.group === undefined)
                fields.push(this)
            else {
                var group = findGroup(this.group)

                if (!group) {
                    group = {
                        itemType: 'group',
                        title: this.group,
                        properties: [],
                        groupIndex: groupIndex
                    }

                    groupIndex++
                    fields.push(group)
                }

                this.groupIndex = group.groupIndex
                group.properties.push(this)
            }
        })

        $.each(fields, function() {
            result.properties.push(this)

            if (this.itemType == 'group') {
                result.hasGroups = true

                $.each(this.properties, function() {
                    result.properties.push(this)
                })

                delete this.properties
            }
        })

        return result
    }

    Inspector.prototype.toggleGroup = function(link, $container) {
        var $link = $(link),
            groupIndex = $link.data('group-index'),
            propertyRows = $('tr[data-group-index='+groupIndex+']', $container),
            duration = Math.round(100 / propertyRows.length),
            collapse = true,
            statuses = this.loadGroupExpandedStatuses(),
            title = $('span.title-element', $link.closest('tr')).attr('title')

        if ($link.hasClass('expanded')) {
            $link.removeClass('expanded')
            statuses[title] = false
        } else {
            $link.addClass('expanded')
            collapse = false
            statuses[title] = true
        }

        propertyRows.each(function(index){
            var self = $(this)
            setTimeout(function(){
                self.toggleClass('collapsed', collapse)
                self.toggleClass('expanded', !collapse)
            }, index*duration)
            
        })

       this.writeGroupExpandedStatuses(statuses)
    }

    Inspector.prototype.loadGroupExpandedStatuses = function() {
        var statuses = this.$el.data('inspector-group-statuses')

        return statuses !== undefined ? JSON.parse(statuses) : {}
    }

    Inspector.prototype.writeGroupExpandedStatuses = function(statuses) {
        this.$el.data('inspector-group-statuses', JSON.stringify(statuses))
    }

    Inspector.prototype.groupExpanded = function(title) {
        var statuses = this.loadGroupExpandedStatuses()

        if (statuses[title] !== undefined)
            return statuses[title]

        return false
    }

    Inspector.prototype.normalizePropertyCode = function(code) {
        var lowerCaseCode = code.toLowerCase()

        for (var index in this.config) {
            var propertyInfo = this.config[index]

            if (propertyInfo.property.toLowerCase() == lowerCaseCode)
                return propertyInfo.property
        }

        return code
    }

    Inspector.prototype.initProperties = function() {
        if (!this.propertyValuesField.length) {
            // Load property valies from data-property-xxx attributes
            var properties = {},
                attributes = this.$el.get(0).attributes

            for (var i=0, len = attributes.length; i < len; i++) {
                var attribute = attributes[i],
                    matches = []

                if (matches = attribute.name.match(/^data-property-(.*)$/)) {
                    properties[this.normalizePropertyCode(matches[1])] = attribute.value
                }
            }

            this.propertyValues = properties
        } else {
            // Load property values from the hidden input
            var propertyValuesStr = $.trim(this.propertyValuesField.val())
            this.propertyValues = propertyValuesStr.length === 0 ? {} : $.parseJSON(propertyValuesStr)
        }

        try {
            this.originalPropertyValues = $.extend(true, {}, this.propertyValues)
        } catch(err) {
            throw new Error('Error parsing the Inspector property values string. ' + err)
        }
    }

    Inspector.prototype.readProperty = function(property, returnUndefined) {
        if (this.propertyValues[property] !== undefined)
            return this.propertyValues[property]

        return returnUndefined ? undefined : null
    }

    Inspector.prototype.getDefaultValue = function(property) {
        for (var index in this.config) {
            var propertyInfo = this.config[index]

            if (propertyInfo.itemType !== 'property')
                continue

            if (propertyInfo.property == property)
                return propertyInfo.default
        }

        return undefined
    }

    Inspector.prototype.writeProperty = function(property, value, noChangedStatusUpdate) {
        this.propertyValues[property] = value

        if (this.propertyValuesField.length)
            this.propertyValuesField.val(JSON.stringify(this.propertyValues))
        else {
            var self = this

            $.each(this.propertyValues, function(propertyName) {
                self.$el.attr('data-property-' + propertyName, this)
            })
        }

        if (this.originalPropertyValues[property] === undefined || this.originalPropertyValues[property] != value) {
            if (!noChangedStatusUpdate) {
                this.$el.trigger('change')
                this.markPropertyChanged(property, true)
            }
        } else {
            if (!noChangedStatusUpdate)
                this.markPropertyChanged(property, false)
        }

        if (!noChangedStatusUpdate)
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
        editor.inspectorCellId = editorId

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

        this.dispose()
    }

    Inspector.prototype.dispose = function() {
        var $popoverContainer = $(this.$el.data('oc.popover').$container)
        $popoverContainer.off('keydown', this.proxy(this.onPopoverKeyDown))
        $('.with-tooltip', $popoverContainer).tooltip('destroy')
        this.$el.removeData('oc.inspector')

        this.editors = null
        this.options = null
        this.$el = null

        BaseProto.dispose.call(this)
    }

    Inspector.prototype.onBeforeHide = function(e) {
        var $container = this.$el.data('inspector-container'),
            externalParamErrorFound = false,
            self = this

        $.each(this.editors, function() {
            if (!self.editorExternalPropertyEnabled(this))
                this.applyValue()
            else {
                var $cell = $('#'+this.inspectorCellId, $container),
                    $extPropEditorContainer = $cell.find('.external-param-editor-container'),
                    $input = $extPropEditorContainer.find('.external-editor input'),
                    val = $.trim($input.val())

                if (val.length == 0) {
                    alert('Please enter external parameter name for the '+this.fieldDef.title+' property.')
                    externalParamErrorFound = true
                    setTimeout(function(){
                        $input.focus()
                    }, 0)
                    return false
                }

                self.writeProperty(this.fieldDef.property, '{{ '+val+' }}')
            }
        })

        if (externalParamErrorFound) {
            e.preventDefault()
            return false
        }

        var eH = $.Event('hiding.oc.inspector'),
            inspector = this

        this.$el.trigger(eH, [{values: this.propertyValues}])
        if (eH.isDefaultPrevented()) {
            e.preventDefault()
            return false
        }

        $.each(this.editors, function() {
            if (inspector.editorExternalPropertyEnabled(this))
                return true

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

        $('.with-tooltip', this.$el.data('oc.popover').$container).tooltip('hide')

        if (!e.isDefaultPrevented()) {
            for (var i=0, len=this.editors.length; i<len; i++) {
                this.editors[i].dispose()
                this.editors[i] = null
            }
        }
    }

    Inspector.prototype.editorExternalPropertyEnabled = function(editor) {
        var $container = this.$el.data('inspector-container'),
            $cell = $('#'+editor.inspectorCellId, $container),
            $extPropEditorContainer = $cell.find('.external-param-editor-container')

        return $extPropEditorContainer.hasClass('editor-visible')
    }

    Inspector.prototype.findEditor = function(property) {
        var count = this.editors.length

        for (var i=0; i < count; i++) {
            if (this.editors[i].fieldDef.property == property)
                return this.editors[i]
        }

        return null
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
     * - init(), sets the initial editor value
     * - onHideExternalParameterEditor(), optional handler, triggered when a user hides the 
     *   external parameter editor on the Inspector field.
     * - dispose(), disposes the editor and cleans its references to the DOM elements and event handlers.
     *
     * All editors should extend the $.oc.foundation.base class
     *
     */

    // STRING EDITOR
    // ==================

    var InspectorEditorString = function(editorId, inspector, fieldDef) {
        this.inspector = inspector
        this.fieldDef = fieldDef
        this.editorId = editorId
        this.selector = '#'+this.editorId+' input.string-editor'

        Base.call(this)

        $(document).on('focus', this.selector, this.proxy(this.onFocus))
        $(document).on('change', this.selector, this.proxy(this.applyValue))
    }

    InspectorEditorString.prototype = Object.create(BaseProto)
    InspectorEditorString.prototype.constructor = InspectorEditorString

    InspectorEditorString.prototype.init = function() {
        var value = this.inspector.readProperty(this.fieldDef.property, true)

        if (value === undefined) 
            value = this.inspector.getDefaultValue(this.fieldDef.property)

        $(this.selector).val($.trim(value))
    }

    InspectorEditorString.prototype.dispose = function() {
        $(document).off('change', this.selector, this.proxy(this.applyValue))
        $(document).off('focus', this.selector, this.proxy(this.onFocus))

        this.inspector = null
        this.fieldDef = null
        this.editorId = null
        this.selector = null

        BaseProto.dispose.call(this)
    }

    InspectorEditorString.prototype.onFocus = function(ev) {
        var $field = $(ev.currentTarget)

        $('td', $field.closest('table')).removeClass('active')
        $field.closest('td').addClass('active')
    }

    InspectorEditorString.prototype.applyValue = function() {
        this.inspector.writeProperty(this.fieldDef.property, $.trim($(this.selector).val()))
    }

    InspectorEditorString.prototype.renderEditor = function() {
        var data = {
            id: this.editorId,
            placeholder: this.fieldDef.placeholder !== undefined ? this.fieldDef.placeholder : ''
        }

        return Mustache.render('<td class="text" id="{{id}}"><input type="text" class="string-editor" placeholder="{{placeholder}}"/></td>', data)
    }

    InspectorEditorString.prototype.validate = function() {
        var val = $.trim($(this.selector).val())

        if (this.fieldDef.required && val.length === 0)
            return this.fieldDef.validationMessage || 'Required fields were left blank.'

        if (this.fieldDef.validationPattern === undefined)
            return

        var re = new RegExp(this.fieldDef.validationPattern, 'm')

        if (!val.match(re))
            return this.fieldDef.validationMessage
    }

    InspectorEditorString.prototype.focus = function() {
        $(this.selector).focus()
        $(this.selector).closest('td').scrollLeft(0)
    }

    $.oc.inspector.editors.inspectorEditorString = InspectorEditorString;

    // CHECKBOX EDITOR
    // ==================
    
    var InspectorEditorCheckbox = function(editorId, inspector, fieldDef) {
        this.inspector = inspector
        this.fieldDef = fieldDef
        this.editorId = editorId
        this.selector = '#'+this.editorId+' input'

        Base.call(this)

        $(document).on('change', this.selector, this.proxy(this.applyValue))
    }

    InspectorEditorCheckbox.prototype = Object.create(BaseProto)
    InspectorEditorCheckbox.prototype.constructor = InspectorEditorCheckbox

    InspectorEditorCheckbox.prototype.dispose = function() {
        $(document).off('change', this.selector, this.proxy(this.applyValue))

        this.inspector = null
        this.fieldDef = null
        this.editorId = null
        this.selector = null

        BaseProto.dispose.call(this)
    }

    InspectorEditorCheckbox.prototype.applyValue = function() {
        this.inspector.writeProperty(this.fieldDef.property, $(this.selector).get(0).checked ? 1 : 0 )
    }

    InspectorEditorCheckbox.prototype.renderEditor = function() {
        var self = this,
            data = {
                id: this.editorId,
                cbId: this.editorId + '-cb',
                title: this.fieldDef.title
            }

        return Mustache.render(this.getTemplate(), data)
    }

    InspectorEditorCheckbox.prototype.init = function() {
        var isChecked = this.inspector.readProperty(this.fieldDef.property, true)

        if (isChecked === undefined) {
            if (this.fieldDef.default !== undefined) {
                isChecked = this.normalizeCheckedValue(this.fieldDef.default)
            }
        } else {
            isChecked = this.normalizeCheckedValue(isChecked)
        }
        
        $(this.selector).prop('checked', isChecked)
    }

    InspectorEditorCheckbox.prototype.normalizeCheckedValue = function(value) {
         if (value == '0' || value == 'false')
            return false

        return value
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
                        id="{{cbId}}"/>                       \
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
        this.initialization = false

        Base.call(this)

        $(document).on('change', this.selector, this.proxy(this.applyValue))
    }

    InspectorEditorDropdown.prototype = Object.create(BaseProto)
    InspectorEditorDropdown.prototype.constructor = InspectorEditorDropdown

    InspectorEditorDropdown.prototype.dispose = function() {
        $(document).off('change', this.selector, this.proxy(this.applyValue))

        var $element = $(this.selector)
        if ($element.data('select2') != null) {
            $element.select2('close')
            $element.select2('destroy')
        }

        this.inspector = null
        this.fieldDef = null
        this.editorId = null
        this.selector = null

        BaseProto.dispose.call(this)
    }

    InspectorEditorDropdown.prototype.applyValue = function() {
        this.inspector.writeProperty(this.fieldDef.property, $(this.selector).val(), this.initialization)
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
        var value = this.inspector.readProperty(this.fieldDef.property, true)

        if (value === undefined)
            value = this.inspector.getDefaultValue(this.fieldDef.property)

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
                this.indicatorContainer.addClass('loading-indicator-container').addClass('size-small')
            }

            this.loadOptions(true)
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
            this.indicatorContainer.loadIndicator()
    }

    InspectorEditorDropdown.prototype.hideLoadingIndicator = function() {
        if (!Modernizr.touch)
            this.indicatorContainer.loadIndicator('hide')
    }

    InspectorEditorDropdown.prototype.loadOptions = function(initialization) {
        var $form = $(this.selector).closest('form'),
            data = this.inspector.propertyValues,
            $select = $(this.selector),
            currentValue = this.inspector.readProperty(this.fieldDef.property, true),
            self = this

        if (currentValue === undefined)
            currentValue = this.inspector.getDefaultValue(this.fieldDef.property)

        for (var index in this.inspector.config) {
            var propertyInfo = this.inspector.config[index]

            if (propertyInfo.itemType == 'property') {
                if (data[propertyInfo.property] === undefined)
                    data[propertyInfo.property] = this.inspector.getDefaultValue(propertyInfo.property)
            }
        }

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

                self.initialization = initialization
                $select.trigger('change')
                self.initialization = false

                self.hideLoadingIndicator()
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseText.length ? jqXHR.responseText : jqXHR.statusText)
                self.hideLoadingIndicator()
            }
        })
    }

    InspectorEditorDropdown.prototype.onHideExternalParameterEditor = function() {
        this.loadOptions(false)
    }

    $.oc.inspector.editors.inspectorEditorDropdown = InspectorEditorDropdown;

    // INSPECTOR PLUGIN DEFINITION
    // ============================

    function initInspector($element) {
        // For now the inspector configuration is not retained in the element's data,
        // fix later (see #83) -ab Apr 27 2015
        var inspector = $element.data('oc.inspector')

        if (inspector === undefined) {
            inspector = new Inspector($element.get(0), $element.data())

            inspector.loadConfiguration(function(){
                inspector.init()
            })

            $element.data('oc.inspector', inspector)
        }
        // else
        //     inspector.init()
    }

    $.fn.inspector = function (option) {
        return this.each(function () {
            initInspector($(this))
        })
    }

    // INSPECTOR DATA-API
    // ==================

    $(document).on('click', '[data-inspectable]', function(){
        var $this = $(this)

        if ($this.data('oc.inspectorVisible'))
            return false

        initInspector($this)

        return false
    })
}(window.jQuery);
