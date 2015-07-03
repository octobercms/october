(function ($) {
    'use strict';

    window.RedactorPlugins = window.RedactorPlugins || {}

    var Figure = function (redactor) {
        this.redactor = redactor
        this.toolbar = {}
        this.init()
    }

    Figure.prototype = {
        control: {
            up    : { classSuffix: 'arrow-up' },
            down  : { classSuffix: 'arrow-down' },
            '|'   : { classSuffix: 'divider' },
            remove: { classSuffix: 'delete' }
        },

        controlGroup: ['up', 'down', 'remove'],

        init: function () {
            this.observeToolbars()
            this.observeKeyboard()
        },

        showToolbar: function (event) {
            var $figure = $(event.currentTarget),
                type = $figure.data('type') || 'default',
                $toolbar = this.getToolbar(type).data('figure', $figure).prependTo($figure).show()

            if (this.redactor[type] && this.redactor[type].onShow) {
                this.redactor[type].onShow($figure, $toolbar)
            }
        },

        hideToolbar: function (event) {
            $(event.currentTarget).find('.oc-figure-controls').appendTo(this.redactor.$box).hide()
        },

        observeToolbars: function () {

            /*
             * Before clicking a command, make sure we save the current node within the editor
             */
            this.redactor.$editor.on('mousedown.figure', '.oc-figure-controls', $.proxy(function (event) {
                event.preventDefault()
                this.current = this.redactor.selection.getCurrent()
            }, this))

            this.redactor.$editor.on('click.figure', '.oc-figure-controls span, .oc-figure-controls a', $.proxy(function (event) {
                event.stopPropagation()
                var $target = $(event.currentTarget),
                    command = $target.data('command'),
                    $figure = $target.closest('figure'),
                    plugin  = this.redactor[$figure.data('type')]

                this.command(command, $figure, plugin)
            }, this))

            this.redactor.$editor.on('keydown.figure', function () {
                $(this).find('figure').triggerHandler('mouseleave')
            })

            /*
             * Mobile
             */
            if (this.redactor.utils.isMobile()) {

                /*
                 * If $editor is focused, click doesn't seem to fire
                 */
                this.redactor.$editor.on('touchstart.figure', 'figure', function (event) {
                    if (event.target.nodeName !== 'FIGCAPTION' && $(event.target).parents('.oc-figure-controls').length) {
                        $(this).trigger('click', event)
                    }
                })

                this.redactor.$editor.on('click.figure', 'figure', $.proxy(function (event) {
                    if (event.target.nodeName !== 'FIGCAPTION') {
                        this.redactor.$editor.trigger('blur')
                    }

                    this.showToolbar(event)
                }, this))
            }
            /*
             * Desktop
             */
            else {
                /*
                 * Move toolbar into figure on mouseenter
                 */
                this.redactor.$editor.on('mouseenter.figure', 'figure', $.proxy(this.showToolbar, this))

                /*
                 * Remove toolbar from figure on mouseleave
                 */
               this.redactor.$editor.on('mouseleave.figure', 'figure', $.proxy(this.hideToolbar, this))
            }

        },

        getToolbar: function (type) {
            if (this.toolbar[type])
                return this.toolbar[type]

            var controlGroup  = (this.redactor[type] && this.redactor[type].controlGroup) || this.controlGroup,
                controls      = $.extend({}, this.control, (this.redactor[type] && this.redactor[type].control) || {}),
                $controls     = this.buildControls(controlGroup, controls),
                $toolbar      = $('<div class="oc-figure-controls">').append($controls)

            this.toolbar[type] = $toolbar

            return $toolbar
        },

        buildControls: function (controlGroup, controls) {

            var $controls = $()

            $.each(controlGroup, $.proxy(function (index, command) {
                var control

                /*
                 * Basic command
                 */
                if (typeof command === 'string') {

                    control = controls[command]

                    $controls = $controls.add($('<span>', {
                        'class': 'oc-figure-controls-' + control.classSuffix,
                        'text': control.text
                    }).data({
                        command: command,
                        control: control
                    }))
                }
                /*
                 * Dropdown
                 */
                else if (typeof command === 'object') {
                    $.each(command, $.proxy(function (text, commands) {

                        var $button = $('<span>').text(' ' + text).addClass('oc-figure-controls-table dropdown'),
                            $dropdown = $('<ul class="dropdown-menu open oc-dropdown-menu" />'),
                            container = $('<li class="dropdown-container" />'),
                            list = $('<ul />'),
                            listItem

                        $dropdown.append(container.append(list))
                        $button.append($dropdown)

                        $button.on('mouseover.figure', function () { $dropdown.show() })
                        $button.on('mouseout.figure', function () { $dropdown.hide() })

                        $.each(commands, $.proxy(function (index, command) {
                            control = controls[command]
                            if (command === '|') {
                                $('<li class="divider" />').appendTo(list)
                            }
                            else {
                                listItem = $('<li />')
                                $('<a />', {
                                    text: control.text
                                }).data({
                                    command: command,
                                    control: control
                                }).appendTo(listItem)

                                if (index == 0) listItem.addClass('first-item')
                                listItem.appendTo(list)
                            }
                        }, this))

                        $controls = $controls.add($button)

                    }, this))
                }
            }, this))

            return $controls
        },

        command: function (command, $figure, plugin) {

            /*
             * Move the toolbar before carrying out the command so it doesn't break when undoing/redoing
             */
            $figure.find('.oc-figure-controls').appendTo(this.redactor.$box)

            /*
             * Maintain undo history
             */
            this.redactor.buffer.set(this.redactor.$editor.html())

            /*
             * Shared functions
             */
            switch (command) {
                case 'up':
                    $figure.prev().before($figure)
                    break

                case 'down':
                    $figure.next().after($figure)
                    break

                case 'remove':
                    $figure.remove()
                    break

                default:
                    if (plugin && plugin.command) {
                        plugin.command(command, $figure, $(this.current))
                    }
                    break
            }

            this.redactor.code.sync()

        },

        observeKeyboard: function () {
            var redactor = this.redactor
            redactor.$editor.on('keydown.figure', function (event) {
                /*
                 * Node at cursor
                 */
                var currentNode = redactor.selection.getBlock()

                /*
                 * Delete key
                 */
                if (
                    event.keyCode === 8
                    && !redactor.caret.getOffset(currentNode)
                    && currentNode.previousSibling
                    && currentNode.previousSibling.nodeName === 'FIGURE'
                ) {
                    event.preventDefault()
                }
            })
        },

        destroy: function() {
            this.redactor.$editor.off('.figure')

            for (var type in this.toolbar) {
                this.toolbar[type].find('span').off('.figure')
            }

            this.redactor = null
            this.toolbar = null
        }
    }

    window.RedactorPlugins.figure = function() {
        return {
            init: function () {
                this.figure = new Figure(this)
            }
        }
    }

}(jQuery));