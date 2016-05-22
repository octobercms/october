/*
 * Previews class
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

    ExceptionBeautifier.DEFAULTS = {
        editor: 'phpstorm'
    }

    ExceptionBeautifier.REGEX = {
        phpLine: /^(#[0-9]+)\s+(.+\.php)(?:\(([0-9]+)\))?\s*:(.*)/,
        internalLine: /^(#[0-9]+)\s+(\[internal function\]\s*:)(.*)/,
        defaultLine: /^(#[0-9]+)\s*(.*)/,
        className: /([a-z0-9]+\\[a-z0-9\\]+)/gi,
        filePath: /((?:[A-Z]:[/\\]|\/)?[\w/\\]+\.php)(\(([0-9]+)\)|:([0-9]+))?/gi,
        functionCall: /->([^(]+)\((.*)\)/i
    }

    ExceptionBeautifier.extensions = []

    ExceptionBeautifier.prototype.init = function () {
        var self = this

        ExceptionBeautifier.extensions.forEach(function (extension) {
            extension.onInit(self);
        })

        self.$el.html(self.parseSource())
    }

    ExceptionBeautifier.prototype.parseSource = function () {
        var self = this,
            source = self.$el.text(),
            markup = {lines: []},
            start = 0,
            end,
            matches

        // We only parse stack trace message. Just transform newline to <br> and format spaces for standard messages.
        if (source.indexOf('Stack trace:') < 0) {
            return '<div class="form-control">' + self.formatMessage(source) + '</div>';
        }

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

        source = '<div class="form-control">' +
            '<span class="markup_exception_name">' + markup.name + '</span>' +
            '<span class="markup_exception_message">' + self.formatMessage(markup.message) + '</span>' +
            '</div>' +
            '<span class="markup_exception_stacktrace_title">Stack trace:</span>'

        markup.lines.forEach(function (line) {
            source += '<span class="markup_exception_stacktrace_line">' + self.formatLine(line) + '</span>'
        })

        ExceptionBeautifier.extensions.forEach(function (extension) {
            extension.onParse(self);
        })

        return '<div class="markup_exception_container">' + source + '</div>'
    }

    ExceptionBeautifier.prototype.parseLine = function (str) {
        var self = this,
            line = {},
            matches

        if (matches = str.match(ExceptionBeautifier.REGEX.phpLine)) {
            line.type = 'phpLine'
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
        } else if (matches = str.match(ExceptionBeautifier.REGEX.defaultLine)){
            line.type = 'default'
            line.number = $.trim(matches[1])
            line.function = $.trim(matches[2])
        }

        return line
    }

    ExceptionBeautifier.prototype.formatLine = function (line) {
        var self = this

        if (line.function) {
            line.function = self.formatClasses(line.function)
        }

        switch (line.type) {
            case  'phpLine':
                return '<span class="markup_exception_stacktrace_line_number">' + line.number + '</span>' +
                    self.formatFilePath(line.file, line.lineNumber) +
                    '<span class="markup_exception_line_number">(' + line.lineNumber + ')</span>: ' +
                    '<span class="markup_exception_stacktrace_line_function">' + line.function + '</span>'

            case  'internal':
                return '<span class="markup_exception_stacktrace_line_number">' + line.number + '</span>' +
                    '<span class="markup_exception_stacktrace_line_internal">' + line.internal + '</span>' +
                    '<span class="markup_exception_stacktrace_line_function">' + line.function + '</span>'

            case  'default':
                return '<span class="markup_exception_stacktrace_line_number">' + line.number + '</span>' +
                    '<span class="markup_exception_stacktrace_line_function">' + line.function + '</span>'
        }

        return ''
    }

    ExceptionBeautifier.prototype.formatClasses = function (str) {
        var self = this

        str = str.replace(ExceptionBeautifier.REGEX.className, '<span class="markup_exception_class">$1</span>')

        str = str.replace(ExceptionBeautifier.REGEX.filePath, self.formatFilePath('$1', '$3$4') +
            '<span class="markup_exception_line_number">$2</span>')

        if (str.match(/^\s*(call_user_func|spl_autoload_call)/)) {
            str = str.replace(/^\s*(?:call_user_func|spl_autoload_call)([^(]*)\((.*)\)/,
                '<span class="markup_exception_function --system">call_user_func$1</span>' +
                '<span class="markup_exception_sign">(</span>' +
                '$2' +
                '<span class="markup_exception_sign">)</span>')
        } else {
            str = str.replace(ExceptionBeautifier.REGEX.functionCall,
                '<span class="markup_exception_sign">-></span>' +
                '<span class="markup_exception_function">$1</span>' +
                '<span class="markup_exception_sign">(</span>' +
                '$2' +
                '<span class="markup_exception_sign">)</span>')
        }

        return str
    }

    ExceptionBeautifier.prototype.formatFilePath = function (path, line) {
        var self = this

        return '<span class="markup_exception_file"">' + path + '</span>'
    }

    ExceptionBeautifier.prototype.formatMessage = function (str) {
        var self = this

        return self.formatClasses(str)
            .replace(/^\s+/, '')
            .replace(/\r|\n|\r\r/g, '<br>')
            .replace(/\r| {4}/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
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