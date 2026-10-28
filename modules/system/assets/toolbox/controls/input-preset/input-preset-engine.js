/*
 * Preset Engine - Text transformation utility for slugs, URLs, camelCase, etc.
 *
 * Accented Latin letters in any language are reduced to their base letter
 * through Unicode normalization. The maps below cover letters that do not
 * decompose (ß, æ, ł, đ) and transliterate Greek, Cyrillic, Arabic and Persian.
 *
 * JavaScript API:
 * oc.InputPresetEngine.formatValue(options, 'My Value')
 */

const LATIN_MAP = {
    'Æ': 'AE', 'Ð': 'D', 'Ø': 'O', 'Þ': 'TH', 'ß': 'ss', 'æ': 'ae', 'ð': 'd',
    'ø': 'o', 'œ': 'oe', 'þ': 'th', 'Đ': 'D', 'đ': 'd', 'ł': 'l', 'Ł': 'L',
    'ı': 'i', 'ə': 'e', 'Ə': 'E', 'Ħ': 'H', 'ħ': 'h', 'Ŋ': 'NG', 'ŋ': 'ng',
    'Ŧ': 'T', 'ŧ': 't', 'Ĳ': 'IJ', 'ĳ': 'ij', 'Ŀ': 'L', 'ŀ': 'l'
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

const ARABIC_MAP = {
    'أ':'a', 'ب':'b', 'ت':'t', 'ث': 'th', 'ج':'g', 'ح':'h', 'خ':'kh', 'د':'d',
    'ذ':'th', 'ر':'r', 'ز':'z', 'س':'s', 'ش':'sh', 'ص':'s', 'ض':'d', 'ط':'t',
    'ظ':'th', 'ع':'aa', 'غ':'gh', 'ف':'f', 'ق':'k', 'ك':'k', 'ل':'l', 'م':'m',
    'ن':'n', 'ه':'h', 'و':'o', 'ي':'y'
};

const PERSIAN_MAP = {
    'آ':'a', 'ا':'a', 'پ':'p', 'چ':'ch', 'ژ':'zh', 'ک':'k', 'گ':'gh', 'ی':'y'
};

const SERBIAN_MAP = {
    'ђ':'dj', 'ј':'j', 'љ':'lj', 'њ':'nj', 'ћ':'c', 'џ':'dz',
    'Ђ':'Dj', 'Ј':'j', 'Љ':'Lj', 'Њ':'Nj', 'Ћ':'C', 'Џ':'Dz'
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
    LATIN_MAP,
    LATIN_SYMBOLS_MAP,
    GREEK_MAP,
    RUSSIAN_MAP,
    UKRAINIAN_MAP,
    ARABIC_MAP,
    PERSIAN_MAP,
    SERBIAN_MAP,
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
        this.locale = null;
    }

    initialize() {
        if (this.map) {
            return;
        }

        this.locale = document.querySelector('meta[name="backend-locale"]')?.getAttribute('content');

        const maps = [...ALL_MAPS];
        if (this.locale && typeof SPECIFIC_MAPS[this.locale] === 'object') {
            maps.push(SPECIFIC_MAPS[this.locale]);
        }

        this.map = new Map(maps.flatMap((lookup) => Object.entries(lookup)));
    }

    transliterate(str) {
        this.initialize();

        str = this.replaceFromMap(str.normalize('NFC'));
        str = str.normalize('NFD').replace(/\p{M}/gu, '');

        return this.replaceFromMap(str);
    }

    replaceFromMap(str) {
        return str.replace(/[^\x00-\x7F]/gu, (c) => this.map.get(c) ?? c);
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
        slug = this.transliterate(slug);

        slug = this.removeStopWords(slug, options);
        slug = slug.toLowerCase();
        slug = slug.replace(/[^\w\s]/g, '');
        slug = slug.replace(/\s+/g, '_');

        return numChars ? slug.substring(0, numChars) : slug;
    }

    toCamel(slug, numChars, options) {
        slug = this.transliterate(slug);

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
        slug = this.transliterate(slug);

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
