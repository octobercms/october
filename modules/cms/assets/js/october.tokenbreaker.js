/*
 * Token Breaker plugin
 * Locates Twig tokens and replaces them with potential content inside.
 * 
 * JavaScript API:
 * $('#codeEditor').tokenBreaker({ option: 'value' })
 *
 * Dependences: 
 * - Code Edtior (codeeditor.js)
 */

+function ($) { "use strict";

    // TOKEN BREAKER CLASS DEFINITION
    // ============================

    var TokenBreaker = function(element, options) {
        this.options   = options
        this.$el       = $(element)

        // Public properties
        this.something  = false

        // Init
        this.init()
    }

    TokenBreaker.DEFAULTS = {
        option: 'default'
    }

    TokenBreaker.prototype.init = function() {

        this.$editor = this.$el.codeEditor('getEditorObject')
        this.$selection = this.$editor.getSelection()
        this.$session = this.$editor.getSession()
        this.tokenName = null
        this.tokenValue = null
        this.tokenDefinition = null

        this.$selection.on('changeCursor', $.proxy(this.cursorChange, this))
    }

    TokenBreaker.prototype.cursorChange = function(event) {

        var cursor = this.$selection.getCursor(),
            word = this.getActiveWord(cursor).toLowerCase()

        if (word == 'component') {
            this.handleCursorOnToken(cursor, word)
        }
        else if (this.tokenName) {
            this.tokenName = null
            this.tokenValue = null
            this.tokenDefinition = null

            this.$el.trigger('hide.oc.tokenbreaker')
        }

    }

    TokenBreaker.prototype.handleCursorOnToken = function(cursor, token) {
        var line = this.$session.getLine(cursor.row),
            definition = this.getTwigTokenDefinition(token, line, cursor.column)

        if (definition) {

            var value = this.getTwigTokenValue(token, definition[0])

            if (value) {
                if (!this.tokenName)
                    this.$el.trigger('show.oc.tokenbreaker')

                this.tokenName = token
                this.tokenValue = value
                this.tokenDefinition = definition
            }
        }
    }

    TokenBreaker.prototype.breakToken = function() {
        console.log('Breaking token ' + this.tokenName + ' with value: ' + this.tokenValue)

        // Prepare a promise
        // Lock the editor
        // Replace the text
        // Unlock after promise resolved
    }

    TokenBreaker.prototype.getTwigTokenValue = function(tokenName, tokenString) {

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
    TokenBreaker.prototype.getTwigTokenDefinition = function(token, str, pos, filter) {

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

    TokenBreaker.prototype.getActiveWord = function(cursor) {
        var $session = this.$session,
            wordRange = $session.getWordRange(cursor.row, cursor.column),
            word = $session.getTextRange(wordRange)

        return word
    }

    // TOKEN BREAKER PLUGIN DEFINITION
    // ============================

    var old = $.fn.tokenBreaker

    $.fn.tokenBreaker = function (option) {
        var args = Array.prototype.slice.call(arguments, 1), regexMatch
        this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.tokenbreaker')
            var options = $.extend({}, TokenBreaker.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.tokenbreaker', (data = new TokenBreaker(this, options)))
            if (typeof option == 'string') regexMatch = data[option].apply(data, args)
            if (typeof regexMatch != 'undefined') return false
        })

        return regexMatch ? regexMatch : this
    }

    $.fn.tokenBreaker.Constructor = TokenBreaker

    // TOKEN BREAKER NO CONFLICT
    // =================

    $.fn.tokenBreaker.noConflict = function () {
        $.fn.tokenBreaker = old
        return this
    }

}(window.jQuery);
