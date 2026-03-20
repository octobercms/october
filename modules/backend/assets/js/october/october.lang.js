/*
 * Client side translations
 */
if (!window.oc) {
    window.oc = {};
}

if (!window.oc.langMessages) {
    window.oc.langMessages = {};
}

window.oc.lang = (function(lang, messages) {
    lang.load = function(locale) {
        if (messages[locale] === undefined) {
            messages[locale] = {};
        }

        lang.loadedMessages = messages[locale];
    }

    lang.set = function(name, value) {
        if (name.constructor === {}.constructor) {
            lang.loadedMessages = {
                ...name,
                ...lang.loadedMessages
            };
        }
        else {
            lang.loadedMessages[name] = value;
        }
    }

    lang.get = function(name, params) {
        if (!name) {
            return;
        }

        var result = lang.loadedMessages,
            defaultValue = (typeof params === "string") ? params : name;

        $.each(name.split('.'), function(index, value) {
            if (result[value] === undefined) {
                result = defaultValue;
                return false;
            }

            result = result[value];
        });

        if (params && typeof params === "object") {
            Object.keys(params).forEach(function(key) {
                result = result.replace(new RegExp(":" + key, "g"), params[key]);
            });
        }

        return result;
    }

    if (lang.locale === undefined) {
        lang.locale = $('html').attr('lang') || 'en';
    }

    if (lang.loadedMessages === undefined) {
        lang.load(lang.locale);
    }

    return lang;
})(window.oc.lang || {}, window.oc.langMessages);

// Translation helper
window.oc.t = function(name, params) {
    return oc.lang.get(name, params);
};

// Migrate jQuery
if ($.oc === undefined) {
    $.oc = {};
}

$.oc.lang = oc.lang;
$.oc.langMessages = oc.langMessages;
