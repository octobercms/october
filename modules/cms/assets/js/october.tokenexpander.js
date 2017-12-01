/*
 * Token Expander plugin
 * Locates Twig tokens and replaces them with potential content inside.
 * 
 * JavaScript API:
 * $('#codeEditor').tokenExpander({ option: 'value' })
 *
 * Dependences:
 * - Code Edtior (codeeditor.js)
 */

+function ($) { "use strict";

    // TOKEN EXPANDER CLASS DEFINITION
    // ============================

    var TokenExpander = function(element, options) {
        this.options   = options
        this.$el       = $(element)

        // Public properties
        this.something  = false

        // Init
        this.init()
    }

    TokenExpander.DEFAULTS = {
        option: 'default'
    }

    TokenExpander.prototype.init = function() {

        this.$editor = this.$el.codeEditor('getEditorObject')
        this.$selection = this.$editor.getSelection()
        this.$session = this.$editor.getSession()
        this.tokenName = null
        this.tokenValue = null
        this.tokenDefinition = null
        this.tokenRange = null

        this.$selection.on('changeCursor', $.proxy(this.cursorChange, this))
    }

    TokenExpander.prototype.cursorChange = function(event) {

        var cursor = this.$selection.getCursor(),
            word = this.getActiveWord(cursor).toLowerCase()

        if (word == 'component') {
            this.handleCursorOnToken(cursor, word)
        }
        else if (this.tokenName) {
            this.tokenName = null
            this.tokenValue = null
            this.tokenDefinition = null
            this.tokenRange = null

            this.$el.trigger('hide.oc.tokenexpander')
        }

    }

    TokenExpander.prototype.handleCursorOnToken = function(cursor, token) {
        var line = this.$session.getLine(cursor.row),
            definition = this.getTwigTokenDefinition(token, line, cursor.column)

        if (definition) {

            var value = this.getTwigTokenValue(token, definition[0])

            if (value) {
                if (!this.tokenName)
                    this.$el.trigger('show.oc.tokenexpander')

                this.tokenName = token
                this.tokenValue = value
                this.tokenDefinition = definition
                this.tokenRange = this.$selection.getRange() // Used only for its row
            }
        }
    }

    /**
     * Callback must return a promise object
     */
    TokenExpander.prototype.expandToken = function(callback) {
        var $editor = this.$editor,
            $session = this.$session,
            definition = this.tokenDefinition,
            range = this.tokenRange

        $editor.setReadOnly(true)

        callback(this.tokenName, this.tokenValue)
            .done(function(data){
                range.setStart(range.start.row, definition[1])
                range.setEnd(range.end.row, definition[2])
                $session.replace(range, data.result)
            })
            .always(function(){
                $editor.setReadOnly(false)
            })
    }

    TokenExpander.prototype.getTwigTokenValue = function(tokenName, tokenString) {

        var regex = new RegExp("^{%\\s*"+tokenName+"\\s(['"+'"'+"])([^"+'"'+"']+)(?:\\1)[^(?:%})]+%}$", "i"),
            regexMatch = regex.exec(tokenString)

        if (regexMatch && regexMatch[2])
            return regexMatch[2]

        return null
    }

    /**
     * Returns an array of [tokenString, startPos, endPos] or null
     * Eg: ['{% component "thing" %}', 0, 23]
     */
    TokenExpander.prototype.getTwigTokenDefinition = function(token, str, pos, filter) {

        if (!filter)
            filter = 0

        var filteredStr = str.substring(filter),
            regex = new RegExp("{%\\s*"+token+"\\s[^(?:%})]+%}", "i"),
            regexMatch = regex.exec(filteredStr)

        if (regexMatch) {
            var start = str.indexOf(regexMatch[0], filter),
                end = start + regexMatch[0].length

            // Win!
            if (start < pos && end > pos)
                return [regexMatch[0], start, end]

            // Try again
            return this.getTwigTokenDefinition(token, str, pos, end)
        }

        // Fail
        return null
    }

    TokenExpander.prototype.getActiveWord = function(cursor) {
        var $session = this.$session,
            wordRange = $session.getWordRange(cursor.row, cursor.column),
            word = $session.getTextRange(wordRange)

        return word
    }

    // TOKEN EXPANDER PLUGIN DEFINITION
    // ============================

    var old = $.fn.tokenExpander

    $.fn.tokenExpander = function (option) {
        var args = Array.prototype.slice.call(arguments, 1), regexMatch
        this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.tokenexpander')
            var options = $.extend({}, TokenExpander.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.tokenexpander', (data = new TokenExpander(this, options)))
            if (typeof option == 'string') regexMatch = data[option].apply(data, args)
            if (typeof regexMatch != 'undefined') return false
        })

        return regexMatch ? regexMatch : this
    }

    $.fn.tokenExpander.Constructor = TokenExpander

    // TOKEN EXPANDER NO CONFLICT
    // =================

    $.fn.tokenExpander.noConflict = function () {
        $.fn.tokenExpander = old
        return this
    }

}(window.jQuery);
