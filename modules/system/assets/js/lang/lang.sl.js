/*
 * This file has been compiled from: /modules/system/lang/sl/client.php
 */
if ($.oc === undefined) $.oc = {}
if ($.oc.langMessages === undefined) $.oc.langMessages = {}
$.oc.langMessages['sl'] = $.extend(
    $.oc.langMessages['sl'] || {},
    {"markdowneditor":{"formatting":"Oblikovanje","quote":"Citat","code":"Koda","header1":"Naslov 1","header2":"Naslov 2","header3":"Naslov 3","header4":"Naslov 4","header5":"Naslov 5","header6":"Naslov 6","bold":"Krepko","italic":"Le\u017ee\u010de","unorderedlist":"Neo\u0161tevil\u010deni seznam","orderedlist":"\u0160tevil\u010dni seznam","video":"Video","image":"Slika","link":"Povezava","horizontalrule":"Vstavi vodoravno \u010drto","fullscreen":"Celozaslonski na\u010din","preview":"Predogled"},"mediamanager":{"insert_link":"Vstavi povezavo","insert_image":"Vstavi sliko","insert_video":"Vstavi video posnetek","insert_audio":"Vstavi zvo\u010dni posnetek","invalid_file_empty_insert":"Izberite datoteko, do katere \u017eelite vstaviti povezavo.","invalid_file_single_insert":"Izberite eno samo datoteko.","invalid_image_empty_insert":"Izberite slike za vstavljanje.","invalid_video_empty_insert":"Izberite video posnetek za vstavljanje.","invalid_audio_empty_insert":"Izberite zvo\u010dni posnetek za vstavljanje."},"alert":{"confirm_button_text":"V redu","cancel_button_text":"Prekli\u010di","widget_remove_confirm":"Odstrani ta vti\u010dnik?"},"datepicker":{"previousMonth":"Prej\u0161nji mesec","nextMonth":"Naslednji mesec","months":["Januar","Februar","Marec","April","Maj","Junij","Julij","Avgust","September","Oktober","November","December"],"weekdays":["Nedelja","Ponedeljek","Torek","Sreda","\u010cetrtek","Petek","Sobota"],"weekdaysShort":["Ned","Pon","Tor","Sre","\u010cet","Pet","Sob"]},"colorpicker":{"choose":"Ok"},"filter":{"group":{"all":"vsi"},"scopes":{"apply_button_text":"Uporabi","clear_button_text":"Po\u010disti"},"dates":{"all":"vsi","filter_button_text":"Filtriraj","reset_button_text":"Ponastavi","date_placeholder":"Datum","after_placeholder":"Po","before_placeholder":"Pred"},"numbers":{"all":"vsi","filter_button_text":"Filtriraj","reset_button_text":"Ponastavi","min_placeholder":"Min","max_placeholder":"Max"}},"eventlog":{"show_stacktrace":"Prika\u017ei sled dogodkov","hide_stacktrace":"Skrij sled dogodkov","tabs":{"formatted":"Oblikovano","raw":"Brez oblikovanja"},"editor":{"title":"Urejevalnik izvorne kode","description":"Va\u0161 operacijski sistem mora biti nastavljen tako, da upo\u0161teva eno od teh URL shem.","openWith":"Za odpiranje uporabi","remember_choice":"Zapomni si izbrane nastavitve za to sejo","open":"Odpri","cancel":"Prekli\u010di"}}}
);

//! moment.js locale configuration v2.22.2

;(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined'
       && typeof require === 'function' ? factory(require('../moment')) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


    function processRelativeTime(number, withoutSuffix, key, isFuture) {
        var result = number + ' ';
        switch (key) {
            case 's':
                return withoutSuffix || isFuture ? 'nekaj sekund' : 'nekaj sekundami';
            case 'ss':
                if (number === 1) {
                    result += withoutSuffix ? 'sekundo' : 'sekundi';
                } else if (number === 2) {
                    result += withoutSuffix || isFuture ? 'sekundi' : 'sekundah';
                } else if (number < 5) {
                    result += withoutSuffix || isFuture ? 'sekunde' : 'sekundah';
                } else {
                    result += withoutSuffix || isFuture ? 'sekund' : 'sekund';
                }
                return result;
            case 'm':
                return withoutSuffix ? 'ena minuta' : 'eno minuto';
            case 'mm':
                if (number === 1) {
                    result += withoutSuffix ? 'minuta' : 'minuto';
                } else if (number === 2) {
                    result += withoutSuffix || isFuture ? 'minuti' : 'minutama';
                } else if (number < 5) {
                    result += withoutSuffix || isFuture ? 'minute' : 'minutami';
                } else {
                    result += withoutSuffix || isFuture ? 'minut' : 'minutami';
                }
                return result;
            case 'h':
                return withoutSuffix ? 'ena ura' : 'eno uro';
            case 'hh':
                if (number === 1) {
                    result += withoutSuffix ? 'ura' : 'uro';
                } else if (number === 2) {
                    result += withoutSuffix || isFuture ? 'uri' : 'urama';
                } else if (number < 5) {
                    result += withoutSuffix || isFuture ? 'ure' : 'urami';
                } else {
                    result += withoutSuffix || isFuture ? 'ur' : 'urami';
                }
                return result;
            case 'd':
                return withoutSuffix || isFuture ? 'en dan' : 'enim dnem';
            case 'dd':
                if (number === 1) {
                    result += withoutSuffix || isFuture ? 'dan' : 'dnem';
                } else if (number === 2) {
                    result += withoutSuffix || isFuture ? 'dni' : 'dnevoma';
                } else {
                    result += withoutSuffix || isFuture ? 'dni' : 'dnevi';
                }
                return result;
            case 'M':
                return withoutSuffix || isFuture ? 'en mesec' : 'enim mesecem';
            case 'MM':
                if (number === 1) {
                    result += withoutSuffix || isFuture ? 'mesec' : 'mesecem';
                } else if (number === 2) {
                    result += withoutSuffix || isFuture ? 'meseca' : 'mesecema';
                } else if (number < 5) {
                    result += withoutSuffix || isFuture ? 'mesece' : 'meseci';
                } else {
                    result += withoutSuffix || isFuture ? 'mesecev' : 'meseci';
                }
                return result;
            case 'y':
                return withoutSuffix || isFuture ? 'eno leto' : 'enim letom';
            case 'yy':
                if (number === 1) {
                    result += withoutSuffix || isFuture ? 'leto' : 'letom';
                } else if (number === 2) {
                    result += withoutSuffix || isFuture ? 'leti' : 'letoma';
                } else if (number < 5) {
                    result += withoutSuffix || isFuture ? 'leta' : 'leti';
                } else {
                    result += withoutSuffix || isFuture ? 'let' : 'leti';
                }
                return result;
        }
    }

    var sl = moment.defineLocale('sl', {
        months : 'januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december'.split('_'),
        monthsShort : 'jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.'.split('_'),
        monthsParseExact: true,
        weekdays : 'nedelja_ponedeljek_torek_sreda_četrtek_petek_sobota'.split('_'),
        weekdaysShort : 'ned._pon._tor._sre._čet._pet._sob.'.split('_'),
        weekdaysMin : 'ne_po_to_sr_če_pe_so'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'H:mm',
            LTS : 'H:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D. MMMM YYYY',
            LLL : 'D. MMMM YYYY H:mm',
            LLLL : 'dddd, D. MMMM YYYY H:mm'
        },
        calendar : {
            sameDay  : '[danes ob] LT',
            nextDay  : '[jutri ob] LT',

            nextWeek : function () {
                switch (this.day()) {
                    case 0:
                        return '[v] [nedeljo] [ob] LT';
                    case 3:
                        return '[v] [sredo] [ob] LT';
                    case 6:
                        return '[v] [soboto] [ob] LT';
                    case 1:
                    case 2:
                    case 4:
                    case 5:
                        return '[v] dddd [ob] LT';
                }
            },
            lastDay  : '[včeraj ob] LT',
            lastWeek : function () {
                switch (this.day()) {
                    case 0:
                        return '[prejšnjo] [nedeljo] [ob] LT';
                    case 3:
                        return '[prejšnjo] [sredo] [ob] LT';
                    case 6:
                        return '[prejšnjo] [soboto] [ob] LT';
                    case 1:
                    case 2:
                    case 4:
                    case 5:
                        return '[prejšnji] dddd [ob] LT';
                }
            },
            sameElse : 'L'
        },
        relativeTime : {
            future : 'čez %s',
            past   : 'pred %s',
            s      : processRelativeTime,
            ss     : processRelativeTime,
            m      : processRelativeTime,
            mm     : processRelativeTime,
            h      : processRelativeTime,
            hh     : processRelativeTime,
            d      : processRelativeTime,
            dd     : processRelativeTime,
            M      : processRelativeTime,
            MM     : processRelativeTime,
            y      : processRelativeTime,
            yy     : processRelativeTime
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 1st is the first week of the year.
        }
    });

    return sl;

})));

