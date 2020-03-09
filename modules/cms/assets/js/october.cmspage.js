/*
 * Scripts for the CMS page.
 */
+function ($) { "use strict";

    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var CmsPage = function() {

        Base.call(this)

        //
        // Initialization
        //

        this.init()
    }

    CmsPage.prototype = Object.create(BaseProto)
    CmsPage.prototype.constructor = CmsPage

    CmsPage.prototype.init = function() {
        $(document).ready(this.proxy(this.registerHandlers))
    }

    CmsPage.prototype.updateTemplateList = function(type) {
        var $form = $('#cms-side-panel form[data-template-type='+type+']'),
            templateList = type + 'List'

        $form.request(templateList + '::onUpdate', {
            complete: function() {
                $('button[data-control=delete-template]', $form).trigger('oc.triggerOn.update')
            }
        })
    }

    CmsPage.prototype.registerHandlers = function() {
        var $document = $(document),
            $masterTabs = $('#cms-master-tabs')

        $masterTabs.on('closed.oc.tab', this.proxy(this.onTabClosed))
        $masterTabs.on('beforeClose.oc.tab', this.proxy(this.onBeforeTabClose))
        $masterTabs.on('oc.beforeRequest', this.proxy(this.onBeforeRequest))
        $masterTabs.on('shown.bs.tab', this.proxy(this.onTabShown))
        $masterTabs.on('initTab.oc.tab', this.proxy(this.onInitTab))
        $masterTabs.on('afterAllClosed.oc.tab', this.proxy(this.onAfterAllTabsClosed))

        $(window).on('ajaxInvalidField', this.proxy(this.ajaxInvalidField))
        $document.on('open.oc.list', '#cms-side-panel', this.proxy(this.onOpenDocument))
        $document.on('ajaxUpdate', '[data-control=filelist], [data-control=assetlist]', this.proxy(this.onAjaxUpdate))
        $document.on('ajaxError', '#cms-master-tabs form', this.proxy(this.onAjaxError))
        $document.on('ajaxSuccess', '#cms-master-tabs form', this.proxy(this.onAjaxSuccess))
        $document.on('click', '#cms-side-panel form button[data-control=create-template], #cms-side-panel form li a[data-control=create-template]', this.proxy(this.onCreateTemplateClick))
        $document.on('click', '#cms-side-panel form button[data-control=delete-template]', this.proxy(this.onDeleteTemplateClick))
        $document.on('showing.oc.inspector', '[data-inspectable]', this.proxy(this.onInspectorShowing))
        $document.on('hidden.oc.inspector', '[data-inspectable]', this.proxy(this.onInspectorHidden))
        $document.on('hiding.oc.inspector', '[data-inspectable]', this.proxy(this.onInspectorHiding))
        $document.on('click', '#cms-master-tabs > div.tab-content > .tab-pane.active .control-componentlist a.remove', this.proxy(this.onComponentRemove))
        $document.on('click', '#cms-component-list [data-component]', this.proxy(this.onComponentClick))
    }

    // EVENT HANDLERS
    // ============================

    CmsPage.prototype.onOpenDocument = function(event) {
        /*
         * Open a document when it's clicked in the sidebar
         */

        var $item = $(event.relatedTarget),
            $form = $item.closest('[data-template-type]'),
            data = {
                type: $form.data('template-type'),
                theme: $item.data('item-theme'),
                path: $item.data('item-path')
            },
            tabId = data.type + '-' + data.theme + '-' + data.path

        if (data.type == 'asset' && $item.data('editable') === undefined)
            return true

        if ($form.length == 0)
            return false

        /*
         * Find if the tab is already opened
         */
         if ($('#cms-master-tabs').data('oc.tab').goTo(tabId))
            return false

        /*
         * Open a new tab
         */
        $.oc.stripeLoadIndicator.show()

        $form.request('onOpenTemplate', {
            data: data
        }).done(function(data) {
            $.oc.stripeLoadIndicator.hide()
            $('#cms-master-tabs').ocTab('addTab', data.tabTitle, data.tab, tabId, $form.data('type-icon'))
        }).always(function() {
            $.oc.stripeLoadIndicator.hide()
        }).fail(function(jqXHR, textStatus, errorThrown) {
            $.oc.stripeLoadIndicator.hide()
        })

        return false
    }

    CmsPage.prototype.ajaxInvalidField = function(ev, element, name, messages, isFirst) {
        /*
         * Detect invalid fields, uncollapse the panel
         */
        if (!isFirst)
            return

        ev.preventDefault()

        var $el = $(element),
            $panel = $el.closest('.form-tabless-fields.collapsed'),
            $primaryPanel = $el.closest('.control-tabs.primary-tabs.collapsed')

        if ($panel.length > 0)
            $panel.removeClass('collapsed')

        if ($primaryPanel.length > 0) {
            $primaryPanel.removeClass('collapsed')

            var pane = $primaryPanel.closest('.tab-pane'),
                $secondaryPanel = $('.control-tabs.secondary-tabs', pane)

            $secondaryPanel.removeClass('primary-collapsed')
        }

        $el.focus()
    }

    CmsPage.prototype.onTabClosed = function(ev) {
        this.updateModifiedCounter()

        if ($('> div.tab-content > div.tab-pane', '#cms-master-tabs').length == 0)
            this.setPageTitle('')
    }

    CmsPage.prototype.onBeforeTabClose = function(ev) {
        if ($.fn.table !== undefined)
            $('[data-control=table]', ev.relatedTarget).table('dispose')

        $.oc.foundation.controlUtils.disposeControls(ev.relatedTarget.get(0))
    }

    CmsPage.prototype.onBeforeRequest = function(ev) {
        var $form = $(ev.target)

        if ($('.components .layout-cell.error-component', $form).length > 0) {
            if (!confirm('The form contains unknown components. Their properties will be lost on save. Do you want to save the form?'))
                ev.preventDefault()
        }
    }

    CmsPage.prototype.onTabShown = function(ev) {
        /*
         * Listen for the tabs "shown" event to track the current template in the list
         */

        var $target = $(ev.target)

        if ($target.closest('[data-control=tab]').attr('id') != 'cms-master-tabs')
            return

        var dataId = $target.closest('li').attr('data-tab-id'),
            title = $target.attr('title'),
            $sidePanel = $('#cms-side-panel')

        if (title)
            this.setPageTitle(title)

        $sidePanel.find('[data-control=filelist]').fileList('markActive', dataId)
        $sidePanel.find('form').trigger('oc.list.setActiveItem', [dataId])
    }

    CmsPage.prototype.onInitTab = function(ev, data) {
        /*
         * Listen for the tabs "initTab" event to inject extra controls to the tab
         */

        if ($(ev.target).attr('id') != 'cms-master-tabs')
            return

        var $collapseIcon = $('<a href="javascript:;" class="tab-collapse-icon tabless"><i class="icon-chevron-up"></i></a>'),
            $panel = $('.form-tabless-fields', data.pane)

        $panel.append($collapseIcon);

        $collapseIcon.click(function(){
            $panel.toggleClass('collapsed')

            if (typeof(localStorage) !== 'undefined')
                localStorage.ocCmsTablessCollapsed = $panel.hasClass('collapsed') ? 1 : 0

            window.setTimeout(function(){
                $(window).trigger('oc.updateUi')
            }, 500)

            return false
        })

        var $primaryCollapseIcon = $('<a href="javascript:;" class="tab-collapse-icon primary"><i class="icon-chevron-down"></i></a>'),
            $primaryPanel = $('.control-tabs.primary-tabs', data.pane),
            $secondaryPanel = $('.control-tabs.secondary-tabs', data.pane)

        if ($primaryPanel.length > 0) {
            $secondaryPanel.append($primaryCollapseIcon);

            $primaryCollapseIcon.click(function(){
                $primaryPanel.toggleClass('collapsed')
                $secondaryPanel.toggleClass('primary-collapsed')
                $(window).trigger('oc.updateUi')
                if (typeof(localStorage) !== 'undefined')
                    localStorage.ocCmsPrimaryCollapsed = $primaryPanel.hasClass('collapsed') ? 1 : 0
                return false
            })
        }

        if (typeof(localStorage) !== 'undefined') {
            if (!$('a', data.tab).hasClass('new-template') && localStorage.ocCmsTablessCollapsed == 1)
                $panel.addClass('collapsed')

            if (localStorage.ocCmsPrimaryCollapsed == 1) {
                $primaryPanel.addClass('collapsed')
                $secondaryPanel.addClass('primary-collapsed')
            }
        }

        var $componentListFormGroup = $('.control-componentlist', data.pane).closest('.form-group')
        if ($primaryPanel.length > 0)
            $primaryPanel.before($componentListFormGroup)
        else
            $secondaryPanel.parent().before($componentListFormGroup)

        $componentListFormGroup.removeClass()
        $componentListFormGroup.addClass('layout-row min-size')
        this.updateComponentListClass(data.pane)
        this.updateFormEditorMode(data.pane, true)

        var $form = $('form', data.pane),
            self = this

        $form.on('changed.oc.changeMonitor', function() {
            $panel.trigger('modified.oc.tab')
            $panel.find('[data-control=commit-button]').addClass('hide');
            $panel.find('[data-control=reset-button]').addClass('hide');
            self.updateModifiedCounter()
        })

        $form.on('unchanged.oc.changeMonitor', function() {
            $panel.trigger('unmodified.oc.tab')
            self.updateModifiedCounter()
        })

        this.addTokenExpanderToEditor(data.pane, $form)
    }

    CmsPage.prototype.onAfterAllTabsClosed = function(ev) {
        var $sidePanel = $('#cms-side-panel')

        $sidePanel.find('[data-control=filelist]').fileList('markActive', null)
        $sidePanel.find('form').trigger('oc.list.setActiveItem', [null])
    }

    CmsPage.prototype.onAjaxUpdate = function(ev) {
        var dataId = $('#cms-master-tabs .nav-tabs li.active').attr('data-tab-id'),
            $sidePanel = $('#cms-side-panel')

        $sidePanel.find('[data-control=filelist]').fileList('markActive', dataId)
        $sidePanel.find('form').trigger('oc.list.setActiveItem', [dataId])
    }

    CmsPage.prototype.onAjaxSuccess = function(ev, context, data) {
        var element = ev.target

        // Update the visibilities of the commit & reset buttons
        $('[data-control=commit-button]', element).toggleClass('hide', !data.canCommit)
        $('[data-control=reset-button]', element).toggleClass('hide', !data.canReset)

        if (data.templatePath !== undefined) {
            $('input[name=templatePath]', element).val(data.templatePath)
            $('input[name=templateMtime]', element).val(data.templateMtime)
            $('[data-control=delete-button]', element).removeClass('hide')
            $('[data-control=preview-button]', element).removeClass('hide')

            if (data.pageUrl !== undefined)
                $('[data-control=preview-button]', element).attr('href', data.pageUrl)
        }

        if (data.tabTitle !== undefined) {
            $('#cms-master-tabs').ocTab('updateTitle', $(element).closest('.tab-pane'), data.tabTitle)
            this.setPageTitle(data.tabTitle)
        }

        var tabId = $('input[name=templateType]', element).val() + '-'
                    + $('input[name=theme]', element).val() + '-'
                    + $('input[name=templatePath]', element).val();

        $('#cms-master-tabs').ocTab('updateIdentifier', $(element).closest('.tab-pane'), tabId)

        var templateType = $('input[name=templateType]', element).val()
        if (templateType.length > 0) {
            $.oc.cmsPage.updateTemplateList(templateType)

            if (templateType == 'layout')
                this.updateLayouts(element)
        }

        this.updateFormEditorMode($(element).closest('.tab-pane'), false)

        if (context.handler == 'onSave' && (!data['X_OCTOBER_ERROR_FIELDS'] && !data['X_OCTOBER_ERROR_MESSAGE'])) {
            $(element).trigger('unchange.oc.changeMonitor')
        }

        // Reload the form if the server has requested it
        if (data.forceReload) {
            this.reloadForm(element)
        }
    }

    CmsPage.prototype.onAjaxError = function(ev, context, message, data, jqXHR) {
        if (context.handler == 'onSave') {
            if (jqXHR.responseText == 'mtime-mismatch') {
                ev.preventDefault()
                this.handleMtimeMismatch(ev.target)
            }
        }
    }

    CmsPage.prototype.onCreateTemplateClick = function(ev) {
       var  $form = $(ev.target).closest('[data-template-type]'),
            type = $form.data('template-type'),
            tabId = type + Math.random(),
            self = this

        $.oc.stripeLoadIndicator.show()

        $form.request('onCreateTemplate', {
           data: {type: type}
        }).done(function(data) {
            $('#cms-master-tabs').ocTab('addTab', data.tabTitle, data.tab, tabId, $form.data('type-icon') + ' new-template')
            $('#layout-side-panel').trigger('close.oc.sidePanel')
            self.setPageTitle(data.tabTitle)
        }).always(function(){
            $.oc.stripeLoadIndicator.hide()
        })
    }

    CmsPage.prototype.onDeleteTemplateClick = function(ev) {
        var $el = $(ev.currentTarget),
            $form = $el.closest('form'),
            templateType = $form.data('template-type'),
            self = this

        if (!confirm($el.data('confirmation')))
            return

        $.oc.stripeLoadIndicator.show()

        $form.request('onDeleteTemplates', {
            data: {type: templateType}
        }).done(function(data) {
            var tabs = $('#cms-master-tabs').data('oc.tab');
            $.each(data.deleted, function(index, path){
                var
                    tabId = templateType + '-' + data.theme + '-' + path,
                    tab = tabs.findByIdentifier(tabId)

                $('#cms-master-tabs').ocTab('closeTab', tab, true)
            })

            if (data.error !== undefined && $.type(data.error) === 'string' && data.error.length)
                $.oc.flashMsg({text: data.error, 'class': 'error'})
        }).always(function(){
            self.updateTemplateList(templateType)
            $.oc.stripeLoadIndicator.hide()
        })
    }

    CmsPage.prototype.onInspectorShowing = function(ev, data) {
        var $dragScroll = $(ev.currentTarget).closest('[data-control="toolbar"]').data('oc.dragScroll')
        if ($dragScroll) {
            $dragScroll.goToElement(ev.currentTarget, data.callback)
        } else {
            data.callback();
        }

        ev.stopPropagation()
    }

    CmsPage.prototype.onInspectorHidden = function(ev) {
        var element = ev.target,
            values = JSON.parse($('[data-inspector-values]', element).val())

        $('[name="component_aliases[]"]', element).val(values['oc.alias'])
        $('span.alias', element).text(values['oc.alias'])
    }

    CmsPage.prototype.onInspectorHiding = function(ev, values) {
        var element = ev.target,
            values = JSON.parse($('[data-inspector-values]', element).val()),
            alias = values['oc.alias'],
            $componentList = $('#cms-master-tabs > div.tab-content > .tab-pane.active .control-componentlist .layout'),
            $cell = $(ev.target).parent()

        $('div.layout-cell', $componentList).each(function(){
            if ($cell.get(0) == this)
                return true

            var $input = $('input[name="component_aliases[]"]', this)

            if ($input.val() == alias) {
                ev.preventDefault()
                alert('The component alias "'+alias+'" is already used.')
                return false
           }
        })
    }

    CmsPage.prototype.onComponentRemove = function(ev) {
        var element = ev.currentTarget

        $(element).trigger('change')
        var pane = $(element).closest('.tab-pane'),
            component = $(element).closest('div.layout-cell')

        /*
         * Remove any {% component %} tags in the editor for this component
         */
        var editor = $('[data-control=codeeditor]', pane)
        if (editor.length) {
            var alias = $('input[name="component_aliases[]"]', component).val(),
                codeEditor = editor.codeEditor('getEditorObject')

            codeEditor.replace('', {
                needle: "{% component '" + alias + "' %}"
            })
        }

        component.remove()
        $(window).trigger('oc.updateUi')

        this.updateComponentListClass(pane)
        return false
    }

    CmsPage.prototype.onComponentClick = function(ev) {
        /*
         * Determine if a page or layout is open in the master tabs
         */

        var $componentList = $('#cms-master-tabs > div.tab-content > .tab-pane.active .control-componentlist .layout')
        if ($componentList.length == 0) {
            alert('Components can be added only to pages, partials and layouts.')
            return;
        }

        var $component = $(ev.currentTarget).clone(),
            $iconInput = $component.find('[data-component-icon]'),
            $componentContainer = $('.layout-relative', $component),
            $configInput = $component.find('[data-inspector-config]'),
            $aliasInput = $component.find('[data-component-default-alias]'),
            $valuesInput = $component.find('[data-inspector-values]'),
            $nameInput = $component.find('[data-component-name]'),
            $classInput = $component.find('[data-inspector-class]'),
            alias = $aliasInput.val(),
            originalAlias = alias,
            counter = 2,
            existingAliases = []

        $('div.layout-cell input[name="component_aliases[]"]', $componentList).each(function(){
            existingAliases.push($(this).val())
        })

        while($.inArray(alias, existingAliases) !== -1) {
            alias = originalAlias + counter
            counter++
        }

        // Set the last alias used so dragComponents can use it
        $('input[name="component_aliases[]"]', $(ev.currentTarget)).val(alias)

        $component.attr('data-component-attached', true)
        $componentContainer.addClass($iconInput.val())
        $iconInput.remove()

        $componentContainer.attr({
            'data-inspectable': '',
            'data-inspector-title': $component.find('span.name').text(),
            'data-inspector-description': $component.find('span.description').text(),
            'data-inspector-config': $configInput.val(),
            'data-inspector-class': $classInput.val()
        })

        $configInput.remove()
        $('input[name="component_names[]"]', $component).val($nameInput.val())
        $nameInput.remove()
        $('input[name="component_aliases[]"]', $component).val(alias)
        $component.find('span.alias').text(alias)
        $valuesInput.val($valuesInput.val().replace('--alias--', alias))
        $aliasInput.remove()

        $component.addClass('adding')
        $componentList.append($component)
        $componentList.closest('[data-control="toolbar"]').data('oc.dragScroll').goToElement($component)
        $component.removeClass('adding')
        $component.trigger('change')

        this.updateComponentListClass($component.closest('.tab-pane'))

        $(window).trigger('oc.updateUi')
    }

    // INTERNAL METHODS
    // ============================

    CmsPage.prototype.updateComponentListClass = function(pane) {
        var $componentList = $('.control-componentlist', pane),
            $primaryPanel = $('.control-tabs.primary-tabs', pane),
            $primaryTabContainer = $('.nav-tabs', $primaryPanel),
            hasComponents = $('.layout', $componentList).children(':not(.hidden)').length > 0

        $primaryTabContainer.toggleClass('component-area', hasComponents)
        $componentList.toggleClass('has-components', hasComponents)
    }

    CmsPage.prototype.updateFormEditorMode = function(pane, initialization) {
        var $contentTypeElement = $('[data-toolbar-type]', pane)
        if ($contentTypeElement.length == 0)
            return

        if ($contentTypeElement.data('toolbar-type') != 'content')
            return

        var fileName = $('input[name=fileName]', pane).val(),
            parts = fileName.split('.'),
            extension = 'txt',
            mode = 'plain_text',
            modes = $.oc.codeEditorExtensionModes,
            editor = $('[data-control=codeeditor]', pane)

        if (parts.length >= 2)
            extension = parts.pop().toLowerCase()

        if (modes[extension] !== undefined)
            mode = modes[extension];

        var setEditorMode = function() {
            window.setTimeout(function(){
                editor.data('oc.codeEditor').editor.getSession().setMode({path: 'ace/mode/'+mode})
            }, 200)
        }

        if (initialization)
            editor.on('oc.codeEditorReady', setEditorMode)
        else
            setEditorMode()
    }

    CmsPage.prototype.updateModifiedCounter = function() {
        var counters = {
            page: { menu: 'pages', count: 0 },
            partial: { menu: 'partials', count: 0 },
            layout: { menu: 'layouts', count: 0 },
            content: { menu: 'content', count: 0 },
            asset: { menu: 'assets', count:  0}
        }

        $('> div.tab-content > div.tab-pane[data-modified]', '#cms-master-tabs').each(function(){
            var inputType = $('> form > input[name=templateType]', this).val()
            counters[inputType].count++
        })

        $.each(counters, function(type, data){
            $.oc.sideNav.setCounter('cms/' + data.menu, data.count);
        })
    }

    CmsPage.prototype.addTokenExpanderToEditor = function(pane, $form) {
        var group = $('[data-field-name=markup]', pane),
            editor = $('[data-control=codeeditor]', group),
            canExpand = false,
            self = this

        if (!editor.length || editor.data('oc.tokenexpander'))
            return

        var toolbar = editor.codeEditor('getToolbar')

        editor.tokenExpander()

        var breakButton = $('<li />').prop({ 'class': 'tokenexpander-button' }).append(
            $('<a />').prop({ 'href': 'javascript:; '}).append(
                $('<i />').prop({ 'class': 'icon-code-fork' })
            )
        )

        breakButton.hide().on('click', function(){
            self.handleExpandToken(editor, $form)
            return false
        })

        $('ul:first', toolbar).prepend(breakButton)

        editor
            .on('show.oc.tokenexpander', function(){
                canExpand = true
                breakButton.show()
            })
            .on('hide.oc.tokenexpander', function(){
                canExpand = false
                breakButton.hide()
            })
            .on('dblclick', function(ev){
                if ((ev.metaKey || ev.ctrlKey) && canExpand) {
                    self.handleExpandToken(editor, $form)
                }
            })
    }

    CmsPage.prototype.handleExpandToken = function(editor, $form) {
        editor.tokenExpander('expandToken', function(token, value){
            return $form.request('onExpandMarkupToken', {
                data: { tokenType: token, tokenName: value }
            })
        })
    }

    CmsPage.prototype.handleMtimeMismatch = function(form) {
        var $form = $(form)
        $form.popup({ handler: 'onOpenConcurrencyResolveForm' })

        var popup = $form.data('oc.popup'),
            self = this

        $(popup.$content).on('click', 'button[data-action=reload]', function(){
            popup.hide()
            self.reloadForm(form)
        })

        $(popup.$content).on('click', 'button[data-action=save]', function(){
            popup.hide()

            $('input[name=templateForceSave]', $form).val(1)
            $('a[data-request=onSave]', $form).trigger('click')
            $('input[name=templateForceSave]', $form).val(0)
        })
    }

    CmsPage.prototype.reloadForm = function(form) {
        var
            $form = $(form),
            data = {
                type: $('[name=templateType]', $form).val(),
                theme: $('[name=theme]', $form).val(),
                path: $('[name=templatePath]', $form).val(),
            },
            tabId = data.type + '-' + data.theme + '-' + data.path,
            tabs = $('#cms-master-tabs').data('oc.tab'),
            tab = tabs.findByIdentifier(tabId),
            self = this

        /*
         * Update tab
         */

        $.oc.stripeLoadIndicator.show()

        $form.request('onOpenTemplate', {
            data: data
        }).done(function(data) {
            $('#cms-master-tabs').ocTab('updateTab', tab, data.tabTitle, data.tab)
            $('#cms-master-tabs').ocTab('unmodifyTab', tab)
            self.updateModifiedCounter()
        }).always(function() {
            $.oc.stripeLoadIndicator.hide()
        }).fail(function(jqXHR, textStatus, errorThrown) {
            alert(jqXHR.responseText.length ? jqXHR.responseText : jqXHR.statusText)
        })
    }

    CmsPage.prototype.setPageTitle = function(title) {
        if (title.length)
            $.oc.layout.setPageTitle(title + ' | ')
        else
            $.oc.layout.setPageTitle(title)
    }

    CmsPage.prototype.updateLayouts = function(form) {
        $(form).request('onGetTemplateList', {
            success: function(data) {
                $('#cms-master-tabs > .tab-content select[name="settings[layout]"]').each(function(){
                    var
                        $select = $(this),
                        value = $select.val()

                    $select.find('option').remove()
                    $.each(data.layouts, function(layoutFile, layoutName){
                        $select.append($('<option>').attr('value', layoutFile).text(layoutName))
                    })
                    $select.trigger('pause.oc.changeMonitor')
                    $select.val(value)
                    $select.trigger('change')
                    $select.trigger('resume.oc.changeMonitor')
                })
            }
        })
    }

    $.oc.cmsPage = new CmsPage();
}(window.jQuery);