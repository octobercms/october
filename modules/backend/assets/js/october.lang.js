/*
 * Client side translations
 */

if ($.oc === undefined)
    $.oc = {}

if ($.oc.langMessages === undefined)
    $.oc.langMessages = {}

$.oc.lang = (function(lang, messages) {

    lang.load = function(locale) {
        if (messages[locale] === undefined) {
            messages[locale] = {}
        }

        lang.loadedMessages = messages[locale]
    }

    lang.get = function(name, defaultValue) {
        var result = lang.loadedMessages

        $.each(name.split('.'), function(index, value) {
            if (result[value] === undefined) {
                result = defaultValue
                return false
            }

            result = result[value]
        })

        return result
    }

    if (lang.locale === undefined) {
        lang.locale = 'en'
    }

    if (lang.loadedMessages === undefined) {
        lang.load(lang.locale)
    }

    return lang

})($.oc.lang || {}, $.oc.langMessages);