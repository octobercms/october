/*
 * Exception Beautifier plugin
 */
+function ($) {
    "use strict";

    var ExceptionBeautifier = function (el, options) {
        var self = this

        self.$el = $(el)
        self.options = options || {}

        // Init
        self.init()
    }

    ExceptionBeautifier.DEFAULTS = {}

    ExceptionBeautifier.REGEX = {
        phpline: /^(#[0-9]+)\s+(.+\.php)(?:\(([0-9]+)\))?\s*:(.*)/,
        artisan: /^(#[0-9]+)\s+(.+artisan)(?:\(([0-9]+)\))?\s*:(.*)/,
        internalLine: /^(#[0-9]+)\s+(\[internal function\]\s*:)(.*)/,
        defaultLine: /^(#[0-9]+)\s*(.*)/,
        className: /([a-z0-9]+\\[a-z0-9\\]+(?:\.\.\.)?)/gi,
        filePath: /((?:[A-Z]:)?(?:[\\\/][\w\.-_~@%]+)\.(?:php|js|css|less|yaml|txt|ini))(\(([0-9]+)\)|:([0-9]+)|\s|$)/gi,
        staticCall: /::([^( ]+)\(([^()]*|(?:[^(]*\(.+\)[^)]*))\)/,
        functionCall: /->([^(]+)\(([^()]*|(?:[^(]*\(.+\)[^)]*))\)/,
        closureCall: /\{closure\}\(([^()]*|(?:[^(]*\(.+\)[^)]*))\)/
    }

    ExceptionBeautifier.extensions = []

    ExceptionBeautifier.prototype.init = function () {
        var self = this,
            markup

        ExceptionBeautifier.extensions.forEach(function (extension) {
            if (typeof extension.onInit === 'function') {
                extension.onInit(self)
            }
        })

        markup = self.parseSource(self.$el.html())

        self.$el
            .addClass('plugin-exception-beautifier')
            .empty()
            .append(markup)
    }

    ExceptionBeautifier.prototype.parseSource = function (raw) {
        var self = this,
            source = raw,
            markup = {lines: []},
            start = 0,
            end

        /*
         * We only heavily parse stacktrace messages.
         * Standard messages are only applied a simple transform : newline to <br> and tab/spaces indentation to &nbsp;
         */
        if (source.indexOf('Stack trace:') < 0) {
            source = '{exception-beautifier-message-container}{exception-beautifier-message}' + self.formatMessage(source) + '{/exception-beautifier-message}{/exception-beautifier-message-container}'
        }
        else {
            end = source.indexOf('Stack trace:', start)
            markup.message = source.substring(start, end)

            start = source.indexOf('#', end)
            while ((end = source.indexOf('#', start + 1)) > 0) {
                markup.lines.push(self.parseLine(source.substring(start, end)))
                start = end
            }

            markup.lines.push(self.parseLine(source.substring(start)))

            source = '{exception-beautifier-message-container}' +
                '{exception-beautifier-message}' + self.formatMessage(markup.message) + '{/exception-beautifier-message}' +
                '{/exception-beautifier-message-container}' +
                '{exception-beautifier-stacktrace#div}'

            markup.lines.forEach(function (line) {
                source += '{exception-beautifier-stacktrace-line}' + self.formatStackTraceLine(line) + '{/exception-beautifier-stacktrace-line}'
            })

            source += '{/exception-beautifier-stacktrace#div}'

            ExceptionBeautifier.extensions.forEach(function (extension) {
                if (typeof extension.onParse === 'function') {
                    extension.onParse(self)
                }
            })
        }

        markup = $(self.buildMarkup('{exception-beautifier-container}' + source + '{/exception-beautifier-container}'))

        return self.finalizeMarkup(markup, raw)
    }

    ExceptionBeautifier.prototype.parseLine = function (str) {
        var line = {},
            matches

        if ((matches = str.match(ExceptionBeautifier.REGEX.phpline)) || (matches = str.match(ExceptionBeautifier.REGEX.artisan))) {
            line.type = 'phpline'
            line.number = $.trim(matches[1])
            line.file = $.trim(matches[2])
            line.lineNumber = $.trim(matches[3])
            line.function = $.trim(matches[4])
        }
        else if (matches = str.match(ExceptionBeautifier.REGEX.internalLine)) {
            line.type = 'internal'
            line.number = $.trim(matches[1])
            line.internal = $.trim(matches[2])
            line.function = $.trim(matches[3])
        }
        else if (matches = str.match(ExceptionBeautifier.REGEX.defaultLine)) {
            line.type = 'default'
            line.number = $.trim(matches[1])
            line.function = $.trim(matches[2])
        }

        return line
    }


    ExceptionBeautifier.prototype.formatMessage = function (str) {
        var self = this

        return self.formatLineCode(
            str
                .replace(/^\s+/, '')
                .replace(/\r\n|\r|\n/g, '{x-newline}')
                .replace(/\t| {2}/g, '{x-tabulation}')
        )
    }

    ExceptionBeautifier.prototype.formatFilePath = function (path, line) {
        return '{exception-beautifier-file}' + path + '{/exception-beautifier-file}'
    }

    ExceptionBeautifier.prototype.formatStackTraceLine = function (line) {
        var self = this

        if (line.function) {
            line.function = self.formatLineCode(line.function)
        }

        switch (line.type) {
            case  'phpline':
                return '{exception-beautifier-stacktrace-line-number}' + line.number + '{/exception-beautifier-stacktrace-line-number}' +
                    self.formatFilePath(line.file, line.lineNumber) +
                    '{exception-beautifier-line-number}(' + line.lineNumber + '):{/exception-beautifier-line-number} ' +
                    '{exception-beautifier-stacktrace-line-function}' + line.function + '{/exception-beautifier-stacktrace-line-function}'

            case  'internal':
                return '{exception-beautifier-stacktrace-line-number}' + line.number + '{/exception-beautifier-stacktrace-line-number}' +
                    '{exception-beautifier-stacktrace-line-internal}' + line.internal + '{/exception-beautifier-stacktrace-line-internal}' +
                    '{exception-beautifier-stacktrace-line-function}' + line.function + '{/exception-beautifier-stacktrace-line-function}'

            case  'default':
                return '{exception-beautifier-stacktrace-line-number}' + line.number + '{/exception-beautifier-stacktrace-line-number}' +
                    '{exception-beautifier-stacktrace-line-function}' + line.function + '{/exception-beautifier-stacktrace-line-function}'
        }

        return ''
    }

    ExceptionBeautifier.prototype.formatLineCode = function (str) {
        var self = this

        if (str.match(/^\s*(call_user_func|spl_autoload_call)/)) {
            str = str.replace(/^\s*(?:call_user_func|spl_autoload_call)([^(]*)\((.*)\)/, function (str, suffix, parameters) {
                return '{exception-beautifier-system-function}call_user_func' + suffix + '({/exception-beautifier-system-function}' +
                    self.formatFunctionParameters(parameters) +
                    '{exception-beautifier-system-function}){/exception-beautifier-system-function}'
            })
        }
        else if (str.match(ExceptionBeautifier.REGEX.closureCall)) {
            str = str.replace(ExceptionBeautifier.REGEX.closureCall, function (str, parameters) {
                return '{exception-beautifier-function}{closure}({/exception-beautifier-function}' +
                    self.formatFunctionParameters(parameters) +
                    '{exception-beautifier-function}){/exception-beautifier-function}'
            })
        }
        else if (str.match(ExceptionBeautifier.REGEX.functionCall)) {
            str = str.replace(ExceptionBeautifier.REGEX.functionCall, function (str, functionName, parameters) {
                return '{exception-beautifier-function}→' + functionName + '({/exception-beautifier-function}' +
                    self.formatFunctionParameters(parameters) +
                    '{exception-beautifier-function}){/exception-beautifier-function}'
            })
        }
        else if (str.match(ExceptionBeautifier.REGEX.staticCall)) {
            str = str.replace(ExceptionBeautifier.REGEX.staticCall, function (str, functionName, parameters) {
                return '{exception-beautifier-function}::' + functionName + '({/exception-beautifier-function}' +
                    self.formatFunctionParameters(parameters) +
                    '{exception-beautifier-function}){/exception-beautifier-function}'
            })
        }

        str = str.replace(ExceptionBeautifier.REGEX.filePath, function (str, path, line, lineNumber, altLineNumber) {
            return self.formatFilePath(path, (lineNumber || '') + (altLineNumber || '')) +
                ($.trim(line).length > 0 ? ('{exception-beautifier-line-number}' + line + '{/exception-beautifier-line-number}') : ' ')
        })

        str = str.replace(ExceptionBeautifier.REGEX.className, function (str, name) {
            return '{exception-beautifier-class}' + name + '{/exception-beautifier-class}'
        })

        return str
    }

    ExceptionBeautifier.prototype.formatFunctionParameters = function (parameters) {
        return parameters
            .replace(/^([0-9]+)|([^a-z\\])([0-9]+)$|^([0-9]+)([^a-z\\])|([^a-z\\])([0-9]+)([^a-z\\])/g, '$2$6{exception-beautifier-number}$1$3$4$7{/exception-beautifier-number}$5$8')
            .replace(/^Array$|([^a-z\\])Array$|^Array([^a-z\\])|([^a-z\\])Array([^a-z\\])/g, '$1$3{exception-beautifier-code}Array{/exception-beautifier-code}$2$4')
            .replace(/^Closure$|(\()Closure(\))/g, '$1{exception-beautifier-code}Closure{/exception-beautifier-code}$2')
            .replace(/Object\(([^)]+)\)/g, '{exception-beautifier-code}Object({/exception-beautifier-code}$1{exception-beautifier-code}){/exception-beautifier-code}')
            .replace(/"((?:\\.|[^"])*)"/g, '{exception-beautifier-string}"$1"{/exception-beautifier-string}')
            .replace(/'((?:\\.|[^'])*)'/g, '{exception-beautifier-string}\'$1\'{/exception-beautifier-string}')
    }

    ExceptionBeautifier.prototype.buildMarkup = function (str) {
        var self = this,
            start = str.indexOf('{exception-beautifier-'),
            cssOffset = 'exception-beautifier-'.length,
            end, endtag, tmp, matches, tag, html, css, attrs, markup = ''

        if (start >= 0) {
            if (start > 0) {
                markup += self.buildMarkup(str.substring(0, start))
            }

            while (start >= 0) {
                end = endtag = str.indexOf('}', start)

                if ((tmp = str.indexOf(' ', start)) >= 0) {
                    end = Math.min(end, tmp)
                }

                tag = str.substring(start + 1, end)
                end = str.indexOf('{/' + tag + '}', start)
                start = str.indexOf('}', start)

                if (end < 0) {
                    throw 'Markup error tag {' + tag + '} not closed'
                }

                html = 'span'
                attrs = ''
                css = tag

                if (matches = tag.match(/(.+)#([a-z]+)$/)) {
                    css = matches[1]
                    html = matches[2]
                }

                css = 'beautifier-' + css.substr(cssOffset)

                if (tmp >= 0 && tmp < endtag) {
                    attrs = str.substring(tmp, endtag)
                }

                markup += '<' + html + ' class="' + css + '"' + attrs + '>'
                markup += self.buildMarkup(str.substring(start + 1, end))
                markup += '</' + html + '>'

                end = end + ('{/' + tag + '}').length
                start = str.indexOf('{exception-beautifier-', end)

                if (start > end || start < 0) {
                    markup += self.buildMarkup(str.substring(end, start < 0 ? undefined : start))
                }
            }
        }
        else {
            // Allow HTML entities
            str = str.replace(/&amp;([^\s&;]+?);/g, '&$1;')

            markup += str
                .replace(/\{x-newline\}/g, '<br>')
                .replace(/\{x-tabulation\}/g, '&nbsp;&nbsp;')
        }

        return markup
    }

    ExceptionBeautifier.prototype.finalizeMarkup = function (markup, source) {
        var stacktrace,
            messageContainer,
            tabs,
            iframe

        markup.find('.beautifier-file').each(function () {
            $(this).find('.beautifier-class').each(function () {
                var $el = $(this)
                $el.replaceWith($el.text())
            })
        })

        markup.find('.beautifier-file+.beautifier-line-number').each(function () {
            var $el = $(this)
            $el.appendTo($el.prev())
        })

        messageContainer = markup.find('.beautifier-message-container')
        stacktrace = markup.find('.beautifier-stacktrace').addClass('hidden')

        if (!!stacktrace.length) {
            $('<a class="beautifier-toggle-stacktrace" href="javascript:;"><span>' + $.oc.lang.get('eventlog.show_stacktrace') + '</span></a>')
                .appendTo(messageContainer)
                .on('click', function (event) {
                    event.preventDefault()
                    event.stopPropagation()

                    var $el = $(this)
                    $('.beautifier-stacktrace', markup).toggleClass('hidden')
                    $el.hide()
                })
        }

        tabs = $('<div class="control-tabs content-tabs tabs-inset">' +
            '<ul class="nav nav-tabs">' +
            '<li class="active"><a href="#beautifier-tab-formatted">' + $.oc.lang.get('eventlog.tabs.formatted') + '</a></li>' +
            '<li><a href="#beautifier-tab-raw">' + $.oc.lang.get('eventlog.tabs.raw') + '</a></li>' +
            '</ul><div class="tab-content">' +
            '<div class="tab-pane pane-inset active" id="beautifier-tab-formatted"></div>' +
            '<div class="tab-pane pane-inset" id="beautifier-tab-raw"></div>' +
            '</div></div>')

        if (source.indexOf('Message-ID:') > 0) {
            markup = source.trim().replace(/(?:^|<\/html>)[^]*?(?:<html|$)/g, function(m) {
                return m.replace(/\r\n|\r|\n/g, '<br>').replace(/ {2}/g, '&nbsp;&nbsp;')
            })
            iframe = $('<iframe id="#beautifier-tab-formatted-iframe" style="width: 100%; height: 500px; padding: 0" frameborder="0"></iframe>')
        }

        /*
         * Build tab content
         */
        if (iframe) {
            tabs.find('#beautifier-tab-formatted').append(iframe)
            iframe.wrap('<div class="beautifier-formatted-content" />')
            iframe.on('load', function() {
                var $html = iframe.contents().find('html')
                $html.html(markup)
                $html.css({
                    'font-family': '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
                    'font-size': '14px',
                    'color': '#74787e'
                })
                iframe.height($html.height() + 1)
            })
        }
        else {
            tabs.find('#beautifier-tab-formatted').append(markup)
        }

        tabs.find('#beautifier-tab-raw').append('<div class="beautifier-raw-content">' + source.trim().replace(/\r\n|\r|\n/g, '<br>').replace(/ {2}/g, '&nbsp;&nbsp;') + '</div>')

        tabs.ocTab({
            closable: false
        })

        return tabs
    }

    // EXCEPTION BEAUTIFIER PLUGIN DEFINITION
    // ============================

    $.fn.exceptionBeautifier = function (option) {
        var args = arguments,
            result

        this.each(function () {
            var $this = $(this)
            var data = $this.data('oc.exceptionBeautifier')
            var options = $.extend({}, ExceptionBeautifier.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.exceptionBeautifier', (data = new ExceptionBeautifier(this, options)))
            if (typeof option == 'string') result = data[option].call($this)
            if (typeof result != 'undefined') return false
        })

        return result ? result : this
    }

    $.fn.exceptionBeautifier.Constructor = ExceptionBeautifier

    $(document).render(function () {
        $('[data-plugin="exception-beautifier"]').exceptionBeautifier()
    })

}(window.jQuery)
