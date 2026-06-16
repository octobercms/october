/*
 * Preset Engine - Text transformation utility for slugs, URLs, camelCase, etc.
 *
 * Supports transliteration from multiple languages including Vietnamese, Latin,
 * Greek, Turkish, Russian, Ukrainian, Czech, Polish, Latvian, Arabic, Persian,
 * Lithuanian, Serbian, Azerbaijani, Romanian, and Belarusian.
 *
 * JavaScript API:
 * oc.InputPresetEngine.formatValue(options, 'My Value')
 */

const VIETNAMESE_MAP = {
    'Á': 'A', 'À': 'A', 'Ã': 'A', 'Ả': 'A', 'Ạ': 'A', 'Ắ': 'A', 'Ằ': 'A', 'Ẵ':
    'A', 'Ẳ': 'A', 'Ặ': 'A', 'Ấ': 'A', 'Ầ': 'A', 'Ẫ': 'A', 'Ẩ': 'A', 'Ậ': 'A',
    'Đ': 'D', 'É': 'E', 'È': 'E', 'Ẽ': 'E', 'Ẻ': 'E', 'Ẹ': 'E', 'Ế': 'E', 'Ề':
    'E', 'Ễ': 'E', 'Ể': 'E', 'Ệ': 'E', 'Ó': 'O', 'Ò': 'O', 'Ỏ': 'O', 'Õ': 'O',
    'Ọ': 'O', 'Ố': 'O', 'Ồ': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O', 'Ơ': 'O', 'Ớ':
    'O', 'Ờ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O', 'Í': 'I', 'Ì': 'I', 'Ỉ': 'I',
    'Ĩ': 'I', 'Ị': 'I', 'Ú': 'U', 'Ù': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U', 'Ư':
    'U', 'Ứ': 'U', 'Ừ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U', 'Ý': 'Y', 'Ỳ': 'Y',
    'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y', 'á': 'a', 'à': 'a', 'ã': 'a', 'ả': 'a', 'ạ':
    'a', 'ắ': 'a', 'ằ': 'a', 'ẵ': 'a', 'ẳ': 'a', 'ặ': 'a', 'ấ': 'a', 'ầ': 'a',
    'ẫ': 'a', 'ẩ': 'a', 'ậ': 'a', 'đ': 'd', 'é': 'e', 'è': 'e', 'ẽ': 'e', 'ẻ':
    'e', 'ẹ': 'e', 'ế': 'e', 'ề': 'e', 'ễ': 'e', 'ể': 'e', 'ệ': 'e', 'ó': 'o',
    'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o', 'ố': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ':
    'o', 'ộ': 'o', 'ơ': 'o', 'ớ': 'o', 'ờ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
    'í': 'i', 'ì': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i', 'ú': 'u', 'ù': 'u', 'ủ':
    'u', 'ũ': 'u', 'ụ': 'u', 'ư': 'u', 'ứ': 'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u',
    'ự': 'u', 'ý': 'y', 'ỳ': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y'
};

const LATIN_MAP = {
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
};

const LATIN_SYMBOLS_MAP = {
    '©':'(c)'
};

const GREEK_MAP = {
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
};

const TURKISH_MAP = {
    'ş':'s', 'Ş':'S', 'ı':'i', 'İ':'I', 'ç':'c', 'Ç':'C', 'ü':'u', 'Ü':'U',
    'ö':'o', 'Ö':'O', 'ğ':'g', 'Ğ':'G'
};

const RUSSIAN_MAP = {
    'а':'a', 'б':'b', 'в':'v', 'г':'g', 'д':'d', 'е':'e', 'ё':'yo', 'ж':'zh',
    'з':'z', 'и':'i', 'й':'j', 'к':'k', 'л':'l', 'м':'m', 'н':'n', 'о':'o',
    'п':'p', 'р':'r', 'с':'s', 'т':'t', 'у':'u', 'ф':'f', 'х':'h', 'ц':'c',
    'ч':'ch', 'ш':'sh', 'щ':'shch', 'ъ':'', 'ы':'y', 'ь':'', 'э':'e', 'ю':'yu',
    'я':'ya',
    'А':'A', 'Б':'B', 'В':'V', 'Г':'G', 'Д':'D', 'Е':'E', 'Ё':'Yo', 'Ж':'Zh',
    'З':'Z', 'И':'I', 'Й':'J', 'К':'K', 'Л':'L', 'М':'M', 'Н':'N', 'О':'O',
    'П':'P', 'Р':'R', 'С':'S', 'Т':'T', 'У':'U', 'Ф':'F', 'Х':'H', 'Ц':'C',
    'Ч':'Ch', 'Ш':'Sh', 'Щ':'Shch', 'Ъ':'', 'Ы':'Y', 'Ь':'', 'Э':'E', 'Ю':'Yu',
    'Я':'Ya'
};

const UKRAINIAN_MAP = {
    'Є':'Ye', 'І':'I', 'Ї':'Yi', 'Ґ':'G', 'є':'ye', 'і':'i', 'ї':'yi', 'ґ':'g'
};

const CZECH_MAP = {
    'č':'c', 'ď':'d', 'ě':'e', 'ň': 'n', 'ř':'r', 'š':'s', 'ť':'t', 'ů':'u',
    'ž':'z', 'Č':'C', 'Ď':'D', 'Ě':'E', 'Ň': 'N', 'Ř':'R', 'Š':'S', 'Ť':'T',
    'Ů':'U', 'Ž':'Z'
};

const POLISH_MAP = {
    'ą':'a', 'ć':'c', 'ę':'e', 'ł':'l', 'ń':'n', 'ó':'o', 'ś':'s', 'ź':'z',
    'ż':'z', 'Ą':'A', 'Ć':'C', 'Ę':'E', 'Ł':'L', 'Ń':'N', 'Ó':'O', 'Ś':'S',
    'Ź':'Z', 'Ż':'Z'
};

const LATVIAN_MAP = {
    'ā':'a', 'č':'c', 'ē':'e', 'ģ':'g', 'ī':'i', 'ķ':'k', 'ļ':'l', 'ņ':'n',
    'š':'s', 'ū':'u', 'ž':'z', 'Ā':'A', 'Č':'C', 'Ē':'E', 'Ģ':'G', 'Ī':'I',
    'Ķ':'K', 'Ļ':'L', 'Ņ':'N', 'Š':'S', 'Ū':'U', 'Ž':'Z'
};

const ARABIC_MAP = {
    'أ':'a', 'ب':'b', 'ت':'t', 'ث': 'th', 'ج':'g', 'ح':'h', 'خ':'kh', 'د':'d',
    'ذ':'th', 'ر':'r', 'ز':'z', 'س':'s', 'ش':'sh', 'ص':'s', 'ض':'d', 'ط':'t',
    'ظ':'th', 'ع':'aa', 'غ':'gh', 'ف':'f', 'ق':'k', 'ك':'k', 'ل':'l', 'م':'m',
    'ن':'n', 'ه':'h', 'و':'o', 'ي':'y'
};

const PERSIAN_MAP = {
    'آ':'a', 'ا':'a', 'پ':'p', 'چ':'ch', 'ژ':'zh', 'ک':'k', 'گ':'gh', 'ی':'y'
};

const LITHUANIAN_MAP = {
    'ą':'a', 'č':'c', 'ę':'e', 'ė':'e', 'į':'i', 'š':'s', 'ų':'u', 'ū':'u',
    'ž':'z',
    'Ą':'A', 'Č':'C', 'Ę':'E', 'Ė':'E', 'Į':'I', 'Š':'S', 'Ų':'U', 'Ū':'U',
    'Ž':'Z'
};

const SERBIAN_MAP = {
    'ђ':'dj', 'ј':'j', 'љ':'lj', 'њ':'nj', 'ћ':'c', 'џ':'dz', 'đ':'d',
    'Ђ':'Dj', 'Ј':'j', 'Љ':'Lj', 'Њ':'Nj', 'Ћ':'C', 'Џ':'Dz', 'Đ':'D'
};

const AZERBAIJANI_MAP = {
    'ç':'c', 'ə':'e', 'ğ':'g', 'ı':'i', 'ö':'o', 'ş':'s', 'ü':'u',
    'Ç':'C', 'Ə':'E', 'Ğ':'G', 'İ':'I', 'Ö':'O', 'Ş':'S', 'Ü':'U'
};

const ROMANIAN_MAP = {
    'ă':'a', 'â':'a', 'î':'i', 'ș':'s', 'ț':'t',
    'Ă':'A', 'Â':'A', 'Î':'I', 'Ș':'S', 'Ț':'T'
};

const BELARUSIAN_MAP = {
    'ў':'w', 'Ў':'W'
};

const SPECIFIC_MAPS = {
    'de': {
        'Ä': 'AE', 'Ö': 'OE', 'Ü': 'UE',
        'ä': 'ae', 'ö': 'oe', 'ü': 'ue'
    }
};

const ALL_MAPS = [
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
    ROMANIAN_MAP,
    BELARUSIAN_MAP
];

const REMOVE_LIST = [
    "a", "an", "as", "at", "before", "but", "by", "for", "from", "is",
    "in", "into", "like", "of", "off", "on", "onto", "per", "since",
    "than", "the", "this", "that", "to", "up", "via", "with"
];

export default class InputPresetEngine {
    constructor() {
        this.map = null;
        this.chars = null;
        this.regex = null;
        this.locale = null;
    }

    initialize() {
        if (this.map) {
            return;
        }

        this.locale = document.querySelector('meta[name="backend-locale"]')?.getAttribute('content');

        this.map = {};
        this.chars = [];

        const maps = [...ALL_MAPS];
        if (this.locale && typeof SPECIFIC_MAPS[this.locale] === 'object') {
            maps.push(SPECIFIC_MAPS[this.locale]);
        }

        for (let i = 0; i < maps.length; i++) {
            const lookup = maps[i];
            for (const c in lookup) {
                if (lookup.hasOwnProperty(c)) {
                    this.map[c] = lookup[c];
                }
            }
        }

        for (const k in this.map) {
            if (this.map.hasOwnProperty(k)) {
                this.chars.push(k);
            }
        }

        this.regex = new RegExp(this.chars.join('|'), 'g');
    }

    removeStopWords(str, options) {
        if (this.locale && !this.locale.startsWith('en')) {
            return str;
        }

        if (options.inputPresetRemoveWords) {
            const regex = new RegExp('\\b(' + REMOVE_LIST.join('|') + ')\\b', 'gi');
            str = str.replace(regex, '');
        }

        return str;
    }

    toSnake(slug, numChars, options) {
        this.initialize();

        slug = slug.replace(this.regex, (m) => {
            return this.map[m];
        });

        slug = this.removeStopWords(slug, options);
        slug = slug.toLowerCase();
        slug = slug.replace(/[^\w\s]/g, '');
        slug = slug.replace(/\s+/g, '_');

        return numChars ? slug.substring(0, numChars) : slug;
    }

    toCamel(slug, numChars, options) {
        this.initialize();

        slug = slug.replace(this.regex, (m) => {
            return this.map[m];
        });

        slug = this.removeStopWords(slug, options);
        slug = slug.toLowerCase();
        slug = slug.replace(/(\b|-)\w/g, (m) => {
            return m.toUpperCase();
        });
        slug = slug.replaceAll('\\', ' ');
        slug = slug.replaceAll('/', ' ');
        slug = slug.replace(/[^-\w\s]/g, '');
        slug = slug.replace(/^\s+|\s+$/g, '');
        slug = slug.replace(/[-\s]+/g, '');
        slug = slug.substr(0, 1).toLowerCase() + slug.substr(1);

        return numChars ? slug.substring(0, numChars) : slug;
    }

    formatNamespace(srcValue, options) {
        const value = this.toCamel(srcValue, undefined, options);
        return value.substr(0, 1).toUpperCase() + value.substr(1);
    }

    slugify(slug, numChars, options) {
        this.initialize();

        slug = slug.replace(this.regex, (m) => {
            return this.map[m];
        });

        slug = this.removeStopWords(slug, options);
        slug = slug.replaceAll('\\', ' ');
        slug = slug.replaceAll('/', ' ');
        slug = slug.replace(/[^-\w\s]/g, '');
        slug = slug.replace(/^\s+|\s+$/g, '');
        slug = slug.replace(/[-\s]+/g, '-');
        slug = slug.toLowerCase();

        return numChars ? slug.substring(0, numChars) : slug;
    }

    formatValue(options, srcValue) {
        // Exception handling
        if (typeof srcValue === 'undefined') {
            return '';
        }

        if (options.inputPresetType == 'exact') {
            return srcValue;
        }
        else if (options.inputPresetType == 'namespace') {
            return this.formatNamespace(srcValue, options);
        }

        let value;
        if (options.inputPresetType == 'camel') {
            value = this.toCamel(srcValue, undefined, options);
        }
        else if (options.inputPresetType == 'snake') {
            value = this.toSnake(srcValue, undefined, options);
        }
        else {
            value = this.slugify(srcValue, undefined, options);
        }

        if (options.inputPresetType == 'url') {
            value = '/' + value;
        }

        return value.replace(/\s/gi, "-");
    }
}
