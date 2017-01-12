/*
 * An input preset converter.
 *
 * The API allows to convert text entered into an element to a URL, slug or file name
 * value in another input element.
 *
 * Supported data attributes:
 * - data-input-preset: specifies a CSS selector for a source input element
 * - data-input-preset-closest-parent: optional, specifies a CSS selector for a closest common parent
 *   for the source and destination input elements.
 * - data-input-preset-type: specifies the conversion type. Supported values are:
 *   url, file, slug, camel.
 * - data-input-preset-prefix-input: optional, prefixes the converted value with the value found
 *   in the supplied input element using a CSS selector.
 *
 * Example: <input type="text" id="name" value=""/>
 *          <input type="text"
 *             data-input-preset="#name"
 *             data-input-preset-type="file">
 *
 * JavaScript API:
 * $('#filename').inputPreset({inputPreset: '#name', inputPresetType: 'file'})
 */
+function ($) { "use strict";

    var VIETNAMESE_MAP = {
        'Á': 'A', 'À': 'A', 'Ã': 'A', 'Ả': 'A', 'Ạ': 'A', 'Ắ': 'A', 'Ằ': 'A', 'Ẵ':
        'A', 'Ẳ': 'A', 'Ặ': 'A', 'Ấ': 'A', 'Ầ': 'A', 'Ẫ': 'A', 'Ẩ': 'A', 'Ậ': 'A',
        'Đ': 'D', 'É': 'E', 'È': 'E', 'Ẽ': 'E', 'Ẻ': 'E', 'Ẹ': 'E', 'Ế': 'E', 'Ề':
        'E', 'Ễ': 'E', 'Ể': 'E', 'Ệ': 'E', 'Ó': 'O', 'Ò': 'O', 'Ỏ': 'O', 'Õ': 'O',
        'Ọ': 'O', 'Ố': 'O', 'Ồ': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O', 'Ớ': 'O', 'Ờ':
        'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O', 'Í': 'I', 'Ì': 'I', 'Ỉ': 'I', 'Ĩ': 'I',
        'Ị': 'I', 'Ú': 'U', 'Ù': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U', 'Ứ': 'U', 'Ừ':
        'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U', 'Ý': 'Y', 'Ỳ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y',
        'Ỵ': 'Y', 'á': 'a', 'à': 'a', 'ã': 'a', 'ả': 'a', 'ạ': 'a', 'ắ': 'a', 'ằ':
        'a', 'ẵ': 'a', 'ẳ': 'a', 'ặ': 'a', 'ấ': 'a', 'ầ': 'a', 'ẫ': 'a', 'ẩ': 'a',
        'ậ': 'a','đ': 'd', 'é': 'e', 'è': 'e', 'ẽ': 'e', 'ẻ': 'e', 'ẹ': 'e', 'ế': 
        'e', 'ề':'e', 'ễ': 'e', 'ể': 'e', 'ệ': 'e', 'ó': 'o', 'ò': 'o', 'ỏ': 'o',
        'õ': 'o', 'ọ': 'o', 'ố': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o', 'ớ':
        'o', 'ờ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o', 'í': 'i', 'ì': 'i', 'ỉ': 'i',
        'ĩ': 'i', 'ị': 'i', 'ú': 'u', 'ù': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u', 'ứ':
        'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u', 'ý': 'y', 'ỳ': 'y', 'ỷ': 'y', 
        'ỹ': 'y', 'ỵ': 'y'
    },
    LATIN_MAP = {
        'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A', 'Æ': 'AE', 'Ç':
        'C', 'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E', 'Ì': 'I', 'Í': 'I', 'Î': 'I',
        'Ï': 'I', 'Ð': 'D', 'Ñ': 'N', 'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö':
        'O', 'Ő': 'O', 'Ø': 'O', 'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U', 'Ű': 'U',
        'Ý': 'Y', 'Þ': 'TH', 'Ÿ': 'Y', 'ß': 'ss', 'à':'a', 'á':'a', 'â': 'a', 'ã':
        'a', 'ä': 'a', 'å': 'a', 'æ': 'ae', 'ç': 'c', 'è': 'e', 'é': 'e', 'ê': 'e',
        'ë': 'e', 'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i', 'ð': 'd', 'ñ': 'n', 'ò':
        'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ő': 'o', 'ø': 'o', 'ō': 'o',
        'œ': 'oe', 'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u', 'ű': 'u', 'ý': 'y', 'þ':
        'th', 'ÿ': 'y'
    },
    LATIN_SYMBOLS_MAP = {
        '©':'(c)'
    },
    GREEK_MAP = {
        'α':'a', 'β':'b', 'γ':'g', 'δ':'d', 'ε':'e', 'ζ':'z', 'η':'h', 'θ':'8',
        'ι':'i', 'κ':'k', 'λ':'l', 'μ':'m', 'ν':'n', 'ξ':'3', 'ο':'o', 'π':'p',
        'ρ':'r', 'σ':'s', 'τ':'t', 'υ':'y', 'φ':'f', 'χ':'x', 'ψ':'ps', 'ω':'w',
        'ά':'a', 'έ':'e', 'ί':'i', 'ό':'o', 'ύ':'y', 'ή':'h', 'ώ':'w', 'ς':'s',
        'ϊ':'i', 'ΰ':'y', 'ϋ':'y', 'ΐ':'i',
        'Α':'A', 'Β':'B', 'Γ':'G', 'Δ':'D', 'Ε':'E', 'Ζ':'Z', 'Η':'H', 'Θ':'8',
        'Ι':'I', 'Κ':'K', 'Λ':'L', 'Μ':'M', 'Ν':'N', 'Ξ':'3', 'Ο':'O', 'Π':'P',
        'Ρ':'R', 'Σ':'S', 'Τ':'T', 'Υ':'Y', 'Φ':'F', 'Χ':'X', 'Ψ':'PS', 'Ω':'W',
        'Ά':'A', 'Έ':'E', 'Ί':'I', 'Ό':'O', 'Ύ':'Y', 'Ή':'H', 'Ώ':'W', 'Ϊ':'I',
        'Ϋ':'Y'
    },
    TURKISH_MAP = {
        'ş':'s', 'Ş':'S', 'ı':'i', 'İ':'I', 'ç':'c', 'Ç':'C', 'ü':'u', 'Ü':'U',
        'ö':'o', 'Ö':'O', 'ğ':'g', 'Ğ':'G'
    },
    RUSSIAN_MAP = {
        'а':'a', 'б':'b', 'в':'v', 'г':'g', 'д':'d', 'е':'e', 'ё':'yo', 'ж':'zh',
        'з':'z', 'и':'i', 'й':'j', 'к':'k', 'л':'l', 'м':'m', 'н':'n', 'о':'o',
        'п':'p', 'р':'r', 'с':'s', 'т':'t', 'у':'u', 'ф':'f', 'х':'h', 'ц':'c',
        'ч':'ch', 'ш':'sh', 'щ':'sh', 'ъ':'', 'ы':'y', 'ь':'', 'э':'e', 'ю':'yu',
        'я':'ya',
        'А':'A', 'Б':'B', 'В':'V', 'Г':'G', 'Д':'D', 'Е':'E', 'Ё':'Yo', 'Ж':'Zh',
        'З':'Z', 'И':'I', 'Й':'J', 'К':'K', 'Л':'L', 'М':'M', 'Н':'N', 'О':'O',
        'П':'P', 'Р':'R', 'С':'S', 'Т':'T', 'У':'U', 'Ф':'F', 'Х':'H', 'Ц':'C',
        'Ч':'Ch', 'Ш':'Sh', 'Щ':'Sh', 'Ъ':'', 'Ы':'Y', 'Ь':'', 'Э':'E', 'Ю':'Yu',
        'Я':'Ya'
    },
    UKRAINIAN_MAP = {
        'Є':'Ye', 'І':'I', 'Ї':'Yi', 'Ґ':'G', 'є':'ye', 'і':'i', 'ї':'yi', 'ґ':'g'
    },
    CZECH_MAP = {
        'č':'c', 'ď':'d', 'ě':'e', 'ň': 'n', 'ř':'r', 'š':'s', 'ť':'t', 'ů':'u',
        'ž':'z', 'Č':'C', 'Ď':'D', 'Ě':'E', 'Ň': 'N', 'Ř':'R', 'Š':'S', 'Ť':'T',
        'Ů':'U', 'Ž':'Z'
    },
    POLISH_MAP = {
        'ą':'a', 'ć':'c', 'ę':'e', 'ł':'l', 'ń':'n', 'ó':'o', 'ś':'s', 'ź':'z',
        'ż':'z', 'Ą':'A', 'Ć':'C', 'Ę':'E', 'Ł':'L', 'Ń':'N', 'Ó':'O', 'Ś':'S',
        'Ź':'Z', 'Ż':'Z'
    },
    LATVIAN_MAP = {
        'ā':'a', 'č':'c', 'ē':'e', 'ģ':'g', 'ī':'i', 'ķ':'k', 'ļ':'l', 'ņ':'n',
        'š':'s', 'ū':'u', 'ž':'z', 'Ā':'A', 'Č':'C', 'Ē':'E', 'Ģ':'G', 'Ī':'I',
        'Ķ':'K', 'Ļ':'L', 'Ņ':'N', 'Š':'S', 'Ū':'U', 'Ž':'Z'
    },
    ARABIC_MAP = {
        'أ':'a', 'ب':'b', 'ت':'t', 'ث': 'th', 'ج':'g', 'ح':'h', 'خ':'kh', 'د':'d',
        'ذ':'th', 'ر':'r', 'ز':'z', 'س':'s', 'ش':'sh', 'ص':'s', 'ض':'d', 'ط':'t',
        'ظ':'th', 'ع':'aa', 'غ':'gh', 'ف':'f', 'ق':'k', 'ك':'k', 'ل':'l', 'م':'m',
        'ن':'n', 'ه':'h', 'و':'o', 'ي':'y'
    },
    PERSIAN_MAP = {
        'آ':'a', 'ا':'a', 'پ':'p', 'چ':'ch', 'ژ':'zh', 'ک':'k', 'گ':'gh', 'ی':'y'
    },
    LITHUANIAN_MAP = {
        'ą':'a', 'č':'c', 'ę':'e', 'ė':'e', 'į':'i', 'š':'s', 'ų':'u', 'ū':'u',
        'ž':'z',
        'Ą':'A', 'Č':'C', 'Ę':'E', 'Ė':'E', 'Į':'I', 'Š':'S', 'Ų':'U', 'Ū':'U',
        'Ž':'Z'
    },
    SERBIAN_MAP = {
        'ђ':'dj', 'ј':'j', 'љ':'lj', 'њ':'nj', 'ћ':'c', 'џ':'dz', 'đ':'dj',
        'Ђ':'Dj', 'Ј':'j', 'Љ':'Lj', 'Њ':'Nj', 'Ћ':'C', 'Џ':'Dz', 'Đ':'Dj'
    },
    AZERBAIJANI_MAP = {
        'ç':'c', 'ə':'e', 'ğ':'g', 'ı':'i', 'ö':'o', 'ş':'s', 'ü':'u',
        'Ç':'C', 'Ə':'E', 'Ğ':'G', 'İ':'I', 'Ö':'O', 'Ş':'S', 'Ü':'U'
    },
    ROMANIAN_MAP = {
        'ă':'a', 'â':'a', 'î':'i', 'ș':'s', 'ț':'t',
        'Ă':'A', 'Â':'A', 'Î':'I', 'Ș':'S', 'Ț':'T'
    },
    SPECIFIC_MAPS = {
        'de': {
            'Ä': 'AE', 'Ö': 'OE', 'Ü': 'UE',
            'ä': 'ae', 'ö': 'oe', 'ü': 'ue'
        }
    },
    ALL_MAPS = [
        VIETNAMESE_MAP,
        LATIN_MAP,
        LATIN_SYMBOLS_MAP,
        GREEK_MAP,
        TURKISH_MAP,
        RUSSIAN_MAP,
        UKRAINIAN_MAP,
        CZECH_MAP,
        POLISH_MAP,
        LATVIAN_MAP,
        ARABIC_MAP,
        PERSIAN_MAP,
        LITHUANIAN_MAP,
        SERBIAN_MAP,
        AZERBAIJANI_MAP,
        ROMANIAN_MAP
    ]

    var removeList = [
        "a", "an", "as", "at", "before", "but", "by", "for", "from", "is",
        "in", "into", "like", "of", "off", "on", "onto", "per", "since",
        "than", "the", "this", "that", "to", "up", "via", "with"
    ]

    var locale = $('meta[name="backend-locale"]').attr('content')

    var Downcoder = {
        Initialize: function() {
            if (Downcoder.map) {
                return;
            }
            Downcoder.map = {};
            Downcoder.chars = [];
            if(typeof SPECIFIC_MAPS[locale] === 'object') {
                ALL_MAPS.push(SPECIFIC_MAPS[locale]);
            }
            for (var i=0; i<ALL_MAPS.length; i++) {
                var lookup = ALL_MAPS[i];
                for (var c in lookup) {
                    if (lookup.hasOwnProperty(c)) {
                        Downcoder.map[c] = lookup[c];
                    }
                }
            }
            for (var k in Downcoder.map) {
                if (Downcoder.map.hasOwnProperty(k)) {
                    Downcoder.chars.push(k);
                }
            }
            Downcoder.regex = new RegExp(Downcoder.chars.join('|'), 'g');
        }
    }

    function toCamel(slug, numChars) {

        Downcoder.Initialize()
        slug = slug.replace(Downcoder.regex, function(m) {
            return Downcoder.map[m]
        })

        var regex = new RegExp('\\b(' + removeList.join('|') + ')\\b', 'gi')
        slug = slug.replace(regex, '')
        slug = slug.toLowerCase()
        slug = slug.replace(/(\b|-)\w/g, function(m) {
            return m.toUpperCase();
        });
        slug = slug.replace(/[^-\w\s]/g, '')
        slug = slug.replace(/^\s+|\s+$/g, '')
        slug = slug.replace(/[-\s]+/g, '')
        slug = slug.substr(0, 1).toLowerCase() + slug.substr(1);
        return slug.substring(0, numChars)
    }

    function slugify(slug, numChars) {

        Downcoder.Initialize()
        slug = slug.replace(Downcoder.regex, function(m) {
            return Downcoder.map[m]
        })

        var regex = new RegExp('\\b(' + removeList.join('|') + ')\\b', 'gi')
        slug = slug.replace(regex, '')
        slug = slug.replace(/[^-\w\s]/g, '')
        slug = slug.replace(/^\s+|\s+$/g, '')
        slug = slug.replace(/[-\s]+/g, '-')
        slug = slug.toLowerCase()
        return slug.substring(0, numChars)
    }

    var InputPreset = function (element, options) {
        var $el = this.$el = $(element)
        this.options = options || {}
        this.cancelled = false

        var parent = options.inputPresetClosestParent !== undefined
                ? $el.closest(options.inputPresetClosestParent)
                : undefined,
            self = this,
            prefix = ''

        if (options.inputPresetPrefixInput !== undefined)
            prefix = $(options.inputPresetPrefixInput, parent).val()

        if (prefix === undefined)
            prefix = ''

        // Do not update the element if it already has a value and the value doesn't match the prefix
        if ($el.val().length && $el.val() != prefix)
            return

        $el.val(prefix).trigger('oc.inputPreset.afterUpdate')

        this.$src = $(options.inputPreset, parent),
        this.$src.on('keyup', function() {
            if (self.cancelled)
                return

            $el.val(prefix + self.formatValue()).trigger('oc.inputPreset.afterUpdate')
        })

        this.$el.on('change', function() {
            self.cancelled = true
        })
    }

    InputPreset.prototype.formatNamespace = function() {
        var value = toCamel(this.$src.val())

        return value.substr(0, 1).toUpperCase() + value.substr(1)
    }

    InputPreset.prototype.formatValue = function() {
        if (this.options.inputPresetType == 'exact') {
            return this.$src.val();
        }
        else if (this.options.inputPresetType == 'namespace') {
            return this.formatNamespace()
        }

        if (this.options.inputPresetType == 'camel') {
            var value = toCamel(this.$src.val())
        }
        else {
            var value = slugify(this.$src.val())
        }

        if (this.options.inputPresetType == 'url') {
            value = '/' + value
        }

        return value.replace(/\s/gi, "-")
    }

    InputPreset.DEFAULTS = {
        inputPreset: '',
        inputPresetType: 'slug',
        inputPresetClosestParent: undefined,
        inputPresetPrefixInput: undefined
    }

    // INPUT CONVERTER PLUGIN DEFINITION
    // ============================

    var old = $.fn.inputPreset

    $.fn.inputPreset = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('oc.inputPreset')
            var options = $.extend({}, InputPreset.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('oc.inputPreset', (data = new InputPreset(this, options)))
        })
    }

    $.fn.inputPreset.Constructor = InputPreset

    // INPUT CONVERTER NO CONFLICT
    // =================

    $.fn.inputPreset.noConflict = function () {
        $.fn.inputPreset = old
        return this
    }

    // INPUT CONVERTER DATA-API
    // ===============

    $(document).render(function() {
        $('[data-input-preset]').inputPreset()
    })

}(window.jQuery);
