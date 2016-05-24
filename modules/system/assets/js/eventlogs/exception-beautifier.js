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
        filePath: /((?:[A-Z]:[/\\]|\/)?[\w/\\]+\.php)(\(([0-9]+)\)|:([0-9]+))?/gi,
        staticCall: /::([^( ]+)\(([^()]*|(?:[^(]*\(.+\)[^)]*))\)/,
        functionCall: /->([^(]+)\(([^()]*|(?:[^(]*\(.+\)[^)]*))\)/,
        closureCall: /\{closure\}\(([^()]*|(?:[^(]*\(.+\)[^)]*))\)/
    }

    ExceptionBeautifier.extensions = []

    ExceptionBeautifier.prototype.init = function () {
        var self = this

        ExceptionBeautifier.extensions.forEach(function (extension) {
            if (typeof extension.onInit === 'function') {
                extension.onInit(self)
            }
        })

        self.$el.addClass('plugin-exception-beautifier')
        self.$el.html(self.parseSource()).find('.beautifier-message-container').addClass('form-control')
    }

    ExceptionBeautifier.prototype.parseSource = function () {
        var self = this,
            source = self.$el.text(),
            markup = {lines: []},
            start = 0,
            end

        /*
         * We only heavily parse stacktrace messages.
         * Standard messages are only applied a simple transform : newline to <br> and tab/spaces indentation to &nbsp;
         */
        if (source.indexOf('Stack trace:') < 0) {
            source = '{exception-beautifier-message-container}{exception-beautifier-message}' + self.formatMessage(source) + '{/exception-beautifier-message}{/exception-beautifier-message-container}'
        } else {
            end = source.indexOf(':', start) + 1
            markup.name = source.substring(start, end)

            start = end
            end = source.indexOf('Stack trace:', start)
            markup.message = source.substring(start, end)

            start = source.indexOf('#', end)
            while ((end = source.indexOf('#', start + 1)) > 0) {
                markup.lines.push(self.parseLine(source.substring(start, end)))
                start = end
            }

            markup.lines.push(self.parseLine(source.substring(start)))

            source = '{exception-beautifier-message-container}' +
                '{exception-beautifier-name}' + markup.name + '{/exception-beautifier-name}' +
                '{exception-beautifier-message}' + self.formatMessage(markup.message) + '{/exception-beautifier-message}' +
                '{/exception-beautifier-message-container}' +
                '{exception-beautifier-stacktrace-title}Stack trace:{/exception-beautifier-stacktrace-title}'

            markup.lines.forEach(function (line) {
                source += '{exception-beautifier-stacktrace-line}' + self.formatStackTraceLine(line) + '{/exception-beautifier-stacktrace-line}'
            })

            ExceptionBeautifier.extensions.forEach(function (extension) {
                if (typeof extension.onParse === 'function') {
                    extension.onParse(self)
                }
            })
        }

        return self.buildMarkup('{exception-beautifier-container}' + source + '{/exception-beautifier-container}')
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
        } else if (matches = str.match(ExceptionBeautifier.REGEX.defaultLine)) {
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
                .replace(/\r|\n|\r\n/g, '{x-newline}')
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
                    '{exception-beautifier-line-number}(' + line.lineNumber + '){/exception-beautifier-line-number}: ' +
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
        } else if (str.match(ExceptionBeautifier.REGEX.closureCall)) {
            str = str.replace(ExceptionBeautifier.REGEX.closureCall, function (str, parameters) {
                return '{exception-beautifier-function}{closure}({/exception-beautifier-function}' +
                    self.formatFunctionParameters(parameters) +
                    '{exception-beautifier-function}){/exception-beautifier-function}'
            })
        } else if (str.match(ExceptionBeautifier.REGEX.functionCall)) {
            str = str.replace(ExceptionBeautifier.REGEX.functionCall, function (str, functionName, parameters) {
                return '{exception-beautifier-function}→' + functionName + '({/exception-beautifier-function}' +
                    self.formatFunctionParameters(parameters) +
                    '{exception-beautifier-function}){/exception-beautifier-function}'
            })
        } else if (str.match(ExceptionBeautifier.REGEX.staticCall)) {
            str = str.replace(ExceptionBeautifier.REGEX.staticCall, function (str, functionName, parameters) {
                return '{exception-beautifier-function}::' + functionName + '({/exception-beautifier-function}' +
                    self.formatFunctionParameters(parameters) +
                    '{exception-beautifier-function}){/exception-beautifier-function}'
            })
        }

        str = str.replace(ExceptionBeautifier.REGEX.filePath, function (str, path, line, lineNumber, altLineNumber) {
            return self.formatFilePath(path, (lineNumber || '') + (altLineNumber || '')) +
                '{exception-beautifier-line-number}' + line + '{/exception-beautifier-line-number}'
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
        } else {
            markup += $.oc.escapeHtmlString(str)
                .replace(/\{x-newline\}/g, '<br>')
                .replace(/\{x-tabulation\}/g, '&nbsp;&nbsp;')
        }

        return markup
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