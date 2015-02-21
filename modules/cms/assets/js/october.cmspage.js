/*
 * Scripts for the CMS page.
 */
+function ($) { "use strict";
    $(document).ready(function(){
        /*
         * Listen for the "open.oc.list" event in the template lists
         */
        $(document).on('open.oc.list', '#cms-side-panel', function(e) {
            var
                $item = $(e.relatedTarget),
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
                data: data,
                success: function(data) {
                    this.success(data).done(function(){
                        $.oc.stripeLoadIndicator.hide()
                        $('#cms-master-tabs').ocTab('addTab', data.tabTitle, data.tab, tabId, $form.data('type-icon'))
                    }).always(function(){
                        $.oc.stripeLoadIndicator.hide()
                    })
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert(jqXHR.responseText.length ? jqXHR.responseText : jqXHR.statusText)
                    $.oc.stripeLoadIndicator.hide()
                }
            })

            return false
        })

        /*
         * Detect invalid fields, uncollapse the panel
         */
        $(window).on('ajaxInvalidField', function(event, element, name, messages, isFirst){
            if (!isFirst) return
            event.preventDefault()

            var $panel = element.closest('.form-tabless-fields.collapsed'),
                $primaryPanel = element.closest('.control-tabs.primary.collapsed')

            if ($panel.length > 0)
                $panel.removeClass('collapsed')

            if ($primaryPanel.length > 0) {
                $primaryPanel.removeClass('collapsed')

                var pane = $primaryPanel.closest('.tab-pane'),
                    $secondaryPanel = $('.control-tabs.secondary', pane)

                $secondaryPanel.removeClass('primary-collapsed')
            }

            element.focus()
        })

        /*
         * Listen for the closing events
         */
        $('#cms-master-tabs').on('closed.oc.tab', function(event){
            updateModifiedCounter()

            if ($('> div.tab-content > div.tab-pane', '#cms-master-tabs').length == 0)
                setPageTitle('')
        })

        $('#cms-master-tabs').on('beforeClose.oc.tab', function(event){
            // Dispose data table widgets

            if ($.fn.table !== undefined)
                $('[data-control=table]', event.relatedTarget).table('dispose')
        })

        /*
         * Listen for the onBeforeRequest event
         */
        $('#cms-master-tabs').on('oc.beforeRequest', function(event) {
            var $form = $(event.target)

            if ( $('.components .layout-cell.error-component', $form).length > 0) {
                if (!confirm('The form contains unknown components. Their properties will be lost on save. Do you want to save the form?'))
                    event.preventDefault()
            }
        })

        /*
         * Listen for the tabs "shown" event to track the current template in the list
         */
        $('#cms-master-tabs').on('shown.bs.tab', function(event){
            if ($(event.target).closest('[data-control=tab]').attr('id') != 'cms-master-tabs')
                return

            var dataId = $(event.target).closest('li').attr('data-tab-id')

            var title = $(event.target).attr('title')
            if (title)
                setPageTitle(title)

            $('#cms-side-panel [data-control=filelist]').fileList('markActive', dataId)
            $('#cms-side-panel form').trigger('oc.list.setActiveItem', [dataId])
        })

        /*
         * Listen for the tabs "initTab" event to inject extra controls to the tab
         */
        $('#cms-master-tabs').on('initTab.oc.tab', function(event, data){
            if ($(event.target).attr('id') != 'cms-master-tabs')
                return

            var $collapseIcon = $('<a href="javascript:;" class="tab-collapse-icon tabless"><i class="icon-chevron-up"></i></a>')
            var $panel = $('.form-tabless-fields', data.pane)
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

            var $primaryCollapseIcon = $('<a href="javascript:;" class="tab-collapse-icon primary"><i class="icon-chevron-down"></i></a>')
            var $primaryPanel = $('.control-tabs.primary', data.pane)
            var $secondaryPanel = $('.control-tabs.secondary', data.pane)
            var $primaryTabContainer = $('.nav-tabs', $primaryPanel)

            $primaryTabContainer.addClass('master-area')

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
            updateComponentListClass(data.pane)
            updateFormEditorMode(data.pane, true)

            var $form = $('form', data.pane)

            $form.on('changed.oc.changeMonitor', function() {
                $panel.trigger('modified.oc.tab')
                updateModifiedCounter()
            })

            $form.on('unchanged.oc.changeMonitor', function() {
                $panel.trigger('unmodified.oc.tab')
                updateModifiedCounter()
            })

            addTokenExpanderToEditor(data.pane, $form)
        })

        /*
         * Listen for the "afterAllClosed.oc.tab" event in the master tabs widget
         */
        $('#cms-master-tabs').on('afterAllClosed.oc.tab', function(event){
            $('#cms-side-panel [data-control=filelist]').fileList('markActive', null)
            $('#cms-side-panel form').trigger('oc.list.setActiveItem', [null])
        })

        /*
         * Listen for AJAX updates of the list views
         */
        $(document).on('ajaxUpdate', '[data-control=filelist], [data-control=assetlist]', function(event){
            var dataId = $('#cms-master-tabs .nav-tabs li.active').attr('data-tab-id')
            $('#cms-side-panel [data-control=filelist]').fileList('markActive', dataId)
            $('#cms-side-panel form').trigger('oc.list.setActiveItem', [dataId])
        })

        /*
         * Listen for the template forms AJAX success event
         */
        $(document).on('ajaxSuccess', '#cms-master-tabs form', function(event, context, data){
            if (data.templatePath !== undefined) {
                $('input[name=templatePath]', this).val(data.templatePath)
                $('input[name=templateMtime]', this).val(data.templateMtime)
                $('[data-control=delete-button]', this).removeClass('hide')
                $('[data-control=preview-button]', this).removeClass('hide')

                if (data.pageUrl !== undefined)
                    $('[data-control=preview-button]', this).attr('href', data.pageUrl)
            }

            if (data.tabTitle !== undefined) {
                $('#cms-master-tabs').ocTab('updateTitle', $(this).closest('.tab-pane'), data.tabTitle)
                setPageTitle(data.tabTitle)
            }

            var tabId = $('input[name=templateType]', this).val() + '-'
                        + $('input[name=theme]', this).val() + '-'
                        + $('input[name=templatePath]', this).val();

            $('#cms-master-tabs').ocTab('updateIdentifier', $(this).closest('.tab-pane'), tabId)

            var templateType = $('input[name=templateType]', this).val()
            if (templateType.length > 0) {
                $.oc.cmsPage.updateTemplateList(templateType)

                if (templateType == 'layout')
                    updateLayouts(this)
            }

            updateFormEditorMode($(this).closest('.tab-pane'), false)

            if (context.handler == 'onSave' && (!data['X_OCTOBER_ERROR_FIELDS'] && !data['X_OCTOBER_ERROR_MESSAGE'])) {
                $(this).trigger('unchange.oc.changeMonitor')
            }
        })

        $(document).on('ajaxError', '#cms-master-tabs form', function(event, context, data, jqXHR){
            if (context.handler == 'onSave') {
                if (jqXHR.responseText == 'mtime-mismatch') {
                    event.preventDefault()
                    handleMtimeMismatch(this)
                }
            }
        })

        /*
         * Listen for the oc.createTemplate event
         */
        $(document).on('click', '#cms-side-panel form button[data-control=create-template], #cms-side-panel form li a[data-control=create-template]', function(event){
           var 
                $form = $(this).closest('[data-template-type]'),
                type = $form.data('template-type'),
                tabId = type + Math.random()

            $.oc.stripeLoadIndicator.show()
            $form.request('onCreateTemplate', {
               data: {
                   type: type
               },
               success: function(data) {
                    this.success(data).done(function(){
                        $('#cms-master-tabs').ocTab('addTab', data.tabTitle, data.tab, tabId, $form.data('type-icon') + ' new-template')
                        $('#layout-side-panel').trigger('close.oc.sidePanel')
                        setPageTitle(data.tabTitle)
                    }).always(function(){
                        $.oc.stripeLoadIndicator.hide()
                    })
               }
           })
        })

        /*
         * Listen for the oc.deleteTemplate event
         */
        $(document).on('click', '#cms-side-panel form button[data-control=delete-template]', function(event){
            var
                $el = $(this),
                $form = $el.closest('form'),
                templateType = $form.data('template-type')

            if (!confirm($el.data('confirmation')))
                return

            $form.request('onDeleteTemplates', {
                data: {
                    type: templateType
                },
                success: function(data) {
                    var tabs = $('#cms-master-tabs').data('oc.tab');
                    $.each(data.deleted, function(index, path){
                        var 
                            tabId = templateType + '-' + data.theme + '-' + path,
                            tab = tabs.findByIdentifier(tabId)

                        $('#cms-master-tabs').ocTab('closeTab', tab, true)
                    })

                    if (data.error !== undefined && $.type(data.error) === 'string' && data.error.length)
                        $.oc.flashMsg({text: data.error, 'class': 'error'})
                },
                complete: function() {
                    $.oc.cmsPage.updateTemplateList(templateType)
                }
            })
        })

        /*
         * Listen for the showing.oc.inspector event on the components
         */
        $(document).on('showing.oc.inspector', '[data-inspectable]', function(ev, data) {
            $(ev.currentTarget).closest('[data-control="toolbar"]').data('oc.dragScroll').goToElement(ev.currentTarget, data.callback)

            ev.stopPropagation()
        })

        /*
         * Listen for the hidden.oc.inspector event on the components
         */
        $(document).on('hidden.oc.inspector', '[data-inspectable]', function() {
            var values = $.parseJSON($('[data-inspector-values]', this).val())

            $('[name="component_aliases[]"]', this).val(values['oc.alias'])
            $('span.alias', this).text(values['oc.alias'])
        })

        /*
         * Listen for the hiding.oc.inspector event on the components
         */
        $(document).on('hiding.oc.inspector', '[data-inspectable]', function(e, values) {
            var values = $.parseJSON($('[data-inspector-values]', this).val()),
                alias = values['oc.alias'],
                $componentList = $('#cms-master-tabs > div.tab-content > .tab-pane.active .control-componentlist .layout'),
                $cell = $(e.target).parent()

            $('div.layout-cell', $componentList).each(function(){
                if ($cell.get(0) == this)
                    return true

                var $input = $('input[name="component_aliases[]"]', this)

                if ($input.val() == alias) {
                    e.preventDefault()
                    alert('The component alias "'+alias+'" is already used.')
                    return false
               }
            })
        })

        function updateComponentListClass(pane) {
            var $componentList = $('.control-componentlist', pane),
                $primaryPanel = $('.control-tabs.primary', pane),
                $primaryTabContainer = $('.nav-tabs', $primaryPanel),
                hasComponents = $('.layout', $componentList).children(':not(.hidden)').length > 0

            $primaryTabContainer.toggleClass('component-area', hasComponents)
            $componentList.toggleClass('has-components', hasComponents)
        }

        function updateFormEditorMode(pane, initialization) {
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

        function updateModifiedCounter() {
            var counters = {
                page: {menu: 'pages', count: 0},
                partial: {menu: 'partials', count: 0},
                layout: {menu: 'layouts', count: 0},
                content: {menu: 'content', count: 0},
                asset:{menu: 'assets', count: 0}
            }

            $('> div.tab-content > div.tab-pane[data-modified]', '#cms-master-tabs').each(function(){
                var inputType = $('> form > input[name=templateType]', this).val()
                counters[inputType].count++
            })

            $.each(counters, function(type, data){
                $.oc.sideNav.setCounter('cms/' + data.menu, data.count);
            })
        }

        function addTokenExpanderToEditor(pane, $form) {
            var group = $('[data-field-name=markup]', pane),
                editor = $('[data-control=codeeditor]', group),
                canExpand = false

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
                handleExpandToken(editor, $form)
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
                .on('dblclick', function(e){
                    if ((e.metaKey || e.ctrlKey) && canExpand) {
                        handleExpandToken(editor, $form)
                    }
                })
        }

        function handleExpandToken(editor, $form) {
            editor.tokenExpander('expandToken', function(token, value){
                return $form.request('onExpandMarkupToken', {
                    data: { tokenType: token, tokenName: value }
                })
            })
        }

        function handleMtimeMismatch(form) {
            var $form = $(form)
            $form.popup({ handler: 'onOpenConcurrencyResolveForm' })

            var popup = $form.data('oc.popup')

            $(popup.$content).on('click', 'button[data-action=reload]', function(){
                popup.hide()

                reloadForm(form)
            })

            $(popup.$content).on('click', 'button[data-action=save]', function(){
                popup.hide()

                $('input[name=templateForceSave]', $form).val(1)
                $('a[data-request=onSave]', $form).trigger('click')
                $('input[name=templateForceSave]', $form).val(0)
            })
        }

        function reloadForm(form) {
            var 
                $form = $(form),
                data = {
                    type: $('[name=templateType]', $form).val(),
                    theme: $('[name=theme]', $form).val(),
                    path: $('[name=templatePath]', $form).val(),
                },
                tabId = data.type + '-' + data.theme + '-' + data.path,
                tabs = $('#cms-master-tabs').data('oc.tab'),
                tab = tabs.findByIdentifier(tabId)

            /*
             * Update tab
             */

            $.oc.stripeLoadIndicator.show()
            $form.request('onOpenTemplate', {
                data: data,
                success: function(data) {
                    this.success(data).done(function(){
                        $.oc.stripeLoadIndicator.hide()
                        $('#cms-master-tabs').ocTab('updateTab', tab, data.tabTitle, data.tab)
                        $('#cms-master-tabs').ocTab('unmodifyTab', tab)
                        updateModifiedCounter()
                    }).always(function(){
                        $.oc.stripeLoadIndicator.hide()
                    })
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert(jqXHR.responseText.length ? jqXHR.responseText : jqXHR.statusText)
                    $.oc.stripeLoadIndicator.hide()
                }
            })
        }

        function setPageTitle(title) {
            if (title.length)
                $.oc.layout.setPageTitle(title + ' | ')
            else
                $.oc.layout.setPageTitle(title)
        }

        /*
         * Listen for the click event on the components' remove link
         */
        $(document).on('click', '#cms-master-tabs > div.tab-content > .tab-pane.active .control-componentlist a.remove', function(e) {
            $(this).trigger('change')
            var pane = $(this).closest('.tab-pane'),
                component = $(this).closest('div.layout-cell')

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

            updateComponentListClass(pane)
            return false
        })

        /*
         * Listen for the click event in the component list
         */
        $(document).on('click', '#cms-component-list [data-component]', function(e) {
            /*
             * Determine if a page or layout is open in the master tabs
             */

            var $componentList = $('#cms-master-tabs > div.tab-content > .tab-pane.active .control-componentlist .layout')
            if ($componentList.length == 0) {
                alert('Components can be added only to pages, partials and layouts.')
                return;
            }

            var $component = $(this).clone(),
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
            $('input[name="component_aliases[]"]', $(this)).val(alias)

            $component.attr('data-component-attached', true)
            $componentContainer.addClass($iconInput.val())
            $iconInput.remove()
            $componentContainer.attr('data-inspectable', '')
            $componentContainer.attr('data-inspector-title', $component.find('span.name').text())
            $componentContainer.attr('data-inspector-description', $component.find('span.description').text())
            $componentContainer.attr('data-inspector-config', $configInput.val())
            $componentContainer.attr('data-inspector-class', $classInput.val())

            $configInput.remove()
            $('input[name="component_names[]"]', $component).val($nameInput.val())
            $nameInput.remove()
            $('input[name="component_aliases[]"]', $component).val(alias)
            $component.find('span.alias').text(alias)
            $component.find('span.alias').text(alias)
            $valuesInput.val($valuesInput.val().replace('--alias--', alias))
            $aliasInput.remove()

            $component.addClass('adding')
            $componentList.append($component)
            $componentList.closest('[data-control="toolbar"]').data('oc.dragScroll').goToElement($component)
            $component.removeClass('adding')
            $component.trigger('change')

            updateComponentListClass($component.closest('.tab-pane'))

            $(window).trigger('oc.updateUi')
        })
    })

    function updateLayouts(form) {
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

    var CmsPage = function() {
        this.updateTemplateList = function(type) {
            var 
                $form = $('#cms-side-panel form[data-template-type='+type+']'),
                templateList = type + 'List'

            $form.request(templateList + '::onUpdate', {
                complete: function() {
                    $('button[data-control=delete-template]', $form).trigger('oc.triggerOn.update')
                }
            })
        }
    }

    $.oc.cmsPage = new CmsPage;
}(window.jQuery);