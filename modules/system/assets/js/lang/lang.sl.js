/*
 * This file has been compiled from: /modules/system/lang/sl/client.php
 */
if ($.oc === undefined) $.oc = {}
if ($.oc.langMessages === undefined) $.oc.langMessages = {}
$.oc.langMessages['sl'] = $.extend(
    $.oc.langMessages['sl'] || {},
    {"markdowneditor":{"formatting":"Oblikovanje","quote":"Citat","code":"Koda","header1":"Naslov 1","header2":"Naslov 2","header3":"Naslov 3","header4":"Naslov 4","header5":"Naslov 5","header6":"Naslov 6","bold":"Krepko","italic":"Le\u017ee\u010de","unorderedlist":"Ne\u0161tevil\u010dni seznam","orderedlist":"\u0160tevil\u010dni seznam","video":"Video","image":"Slika","link":"Povezava","horizontalrule":"Vstavi vodoravno \u010drto","fullscreen":"Celozaslonski na\u010din","preview":"Predogled"},"mediamanager":{"insert_link":"Vstavi povezavo","insert_image":"Vstavi sliko","insert_video":"Vstavi video posnetek","insert_audio":"Vstavi zvo\u010dni posnetek","invalid_file_empty_insert":"Izberite datoteko, do katere \u017eelite vstaviti povezavo.","invalid_file_single_insert":"Izberite eno samo datoteko.","invalid_image_empty_insert":"Izberite slike za vstavljanje.","invalid_video_empty_insert":"Izberite video posnetek za vstavljanje.","invalid_audio_empty_insert":"Izberite zvo\u010dni posnetek za vstavljanje."},"alert":{"confirm_button_text":"V redu","cancel_button_text":"Prekli\u010di","widget_remove_confirm":"Odstrani ta vti\u010dnik?"},"datepicker":{"previousMonth":"Prej\u0161nji mesec","nextMonth":"Naslednji mesec","months":["Januar","Februar","Marec","April","Maj","Junij","Julij","Avgust","September","Oktober","November","December"],"weekdays":["Nedelja","Ponedeljek","Torek","Sreda","\u010cetrtek","Petek","Sobota"],"weekdaysShort":["Ned","Pon","Tor","Sre","\u010cet","Pet","Sob"]},"colorpicker":{"choose":"Ok"},"filter":{"group":{"all":"vsi"},"scopes":{"apply_button_text":"Uporabi","clear_button_text":"Po\u010disti"},"dates":{"all":"vsi","filter_button_text":"Filtriraj","reset_button_text":"Ponastavi","date_placeholder":"Datum","after_placeholder":"Po","before_placeholder":"Pred"},"numbers":{"all":"vsi","filter_button_text":"Filtriraj","reset_button_text":"Ponastavi","min_placeholder":"Min","max_placeholder":"Max"}},"eventlog":{"show_stacktrace":"Prika\u017ei sled dogodkov","hide_stacktrace":"Skrij sled dogodkov","tabs":{"formatted":"Oblikovano","raw":"Brez oblikovanja"},"editor":{"title":"Urejevalnik izvorne kode","description":"Va\u0161 operacijski sistem mora biti nastavljen tako, da upo\u0161teva eno od teh URL shem.","openWith":"Za odpiranje uporabi","remember_choice":"Zapomni si izbrane nastavitve za to sejo","open":"Odpri","cancel":"Prekli\u010di"}}}
);

//! moment.js locale configuration v2.22.2

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
    && typeof require === 'function' ? factory(require('../moment')) :
        typeof define === 'function' && define.amd ? define(['../moment'], factory) :
            factory(global.moment)
}(this, (function (moment) { 'use strict';

    function translate(number, withoutSuffix, key, isFuture) {
        var result = number + ' ';
        switch (key) {
            case 's':  // a few seconds / in a few seconds / a few seconds ago
                return (withoutSuffix || isFuture) ? 'nekaj sekund' : 'nekaj sekundami';
            case 'ss': // 9 seconds / in 9 seconds / 9 seconds ago
                if (withoutSuffix) {
                    if (number == 1) {
                        return result + 'sekunda';
                    } else if (number == 2) {
                        return result + 'sekundi';
                    } else if (number == 3 || number == 4) {
                        return result + 'sekunde';
                    } else {
                        return result + 'sekund';
                    }
                } else if (isFuture) {
                    if (number == 1) {
                        return result + 'sekundo';
                    } else if (number == 2) {
                        return result + 'sekundi';
                    } else if (number == 3 || number == 4) {
                        return result + 'sekunde';
                    } else {
                        return result + 'sekund';
                    }
                } else {
                    if (number == 1) {
                        return result + 'sekundo';
                    } else if (number == 2) {
                        return result + 'sekundama';
                    } else {
                        return result + 'sekundami';
                    }
                }
                break;
            case 'm':  // a minute / in a minute / a minute ago
                return withoutSuffix ? 'minuta' : 'minuto';
            case 'mm': // 9 minutes / in 9 minutes / 9 minutes ago
                if (withoutSuffix) {
                    if (number == 1) {
                        return result + 'minuta';
                    } else if (number == 2) {
                        return result + 'minuti';
                    } else if (number == 3 || number == 4) {
                        return result + 'minute';
                    } else {
                        return result + 'minut';
                    }
                } else if (isFuture) {
                    if (number == 1) {
                        return result + 'minuto';
                    } else if (number == 2) {
                        return result + 'minuti';
                    } else if (number == 3 || number == 4) {
                        return result + 'minute';
                    } else {
                        return result + 'minut';
                    }
                } else {
                    if (number == 1) {
                        return result + 'minuto';
                    } else if (number == 2) {
                        return result + 'minutama';
                    } else {
                        return result + 'minutami';
                    }
                }
                break;
            case 'h':  // an hour / in an hour / an hour ago
                return withoutSuffix ? 'ura' : 'eno uro';
            case 'hh': // 9 hours / in 9 hours / 9 hours ago
                if (withoutSuffix) {
                    if (number == 1) {
                        return result + 'ura';
                    } else if (number == 2) {
                        return result + 'uri';
                    } else if (number == 3 || number == 4) {
                        return result + 'ure';
                    } else {
                        return result + 'ur';
                    }
                } else if (isFuture) {
                    if (number == 1) {
                        return result + 'uro';
                    } else if (number == 2) {
                        return result + 'uri';
                    } else if (number == 3 || number == 4) {
                        return result + 'ure';
                    } else {
                        return result + 'ur';
                    }
                } else {
                    if (number == 1) {
                        return result + 'uro';
                    } else if (number == 2) {
                        return result + 'urama';
                    } else {
                        return result + 'urami';
                    }
                }
                break;
            case 'd':  // a day / in a day / a day ago
                return withoutSuffix ? 'dan' : (isFuture ? 'en dan' : 'enim dnem');
            case 'dd': // 9 days / in 9 days / 9 days ago
                if (withoutSuffix) {
                    if (number == 1) {
                        return result + 'dan';
                    } else if (number == 2) {
                        return result + 'dneva';
                    } else if (number == 3 || number == 4) {
                        return result + 'dnevi';
                    } else {
                        return result + 'dni';
                    }
                } else if (isFuture) {
                    if (number == 1) {
                        return result + 'dan';
                    } else {
                        return result + 'dni';
                    }
                } else {
                    if (number == 1) {
                        return result + 'dnevom';
                    } else if (number == 2) {
                        return result + 'dnevoma';
                    } else {
                        return result + 'dnevi';
                    }
                }
                break;
            case 'M':  // a month / in a month / a month ago
                return withoutSuffix ? 'mesec' : (isFuture ? 'en mesec' : 'enim mesecem');
            case 'MM': // 9 months / in 9 months / 9 months ago
                if (withoutSuffix) {
                    if (number == 1) {
                        return result + 'mesec';
                    } else if (number == 2) {
                        return result + 'meseca';
                    } else if (number == 3 || number == 4) {
                        return result + 'meseci';
                    } else {
                        return result + 'mesecev';
                    }
                } else if (isFuture) {
                    if (number == 1) {
                        return result + 'mesec';
                    } else if (number == 2) {
                        return result + 'meseca';
                    } else if (number == 3 || number == 4) {
                        return result + 'mesece';
                    } else {
                        return result + 'mesecev';
                    }
                } else {
                    if (number == 1) {
                        return result + 'mesecom';
                    } else if (number == 2) {
                        return result + 'mesecema';
                    } else {
                        return result + 'meseci';
                    }
                }
                break;
            case 'y':  // a year / in a year / a year ago
                return withoutSuffix ? 'leto' : (isFuture ? 'eno leto' : 'enim letom');
            case 'yy': // 9 years / in 9 years / 9 years ago
                if (withoutSuffix) {
                    if (number == 1) {
                        return result + 'leto';
                    } else if (number == 2) {
                        return result + 'leti';
                    } else if (number == 3 || number == 4) {
                        return result + 'leta';
                    } else {
                        return result + 'let';
                    }
                } else if (isFuture) {
                    if (number == 1) {
                        return result + 'leto';
                    } else if (number == 2) {
                        return result + 'leti';
                    } else if (number == 3 || number == 4) {
                        return result + 'leta';
                    } else {
                        return result + 'let';
                    }
                } else {
                    if (number == 1) {
                        return result + 'letom';
                    } else if (number == 2) {
                        return result + 'letoma';
                    } else {
                        return result + 'leti';
                    }
                }
                break;
        }
    }

    var sl = moment.defineLocale('sl', {
        months : 'januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december'.split('_'),
        monthsShort : 'jan_feb_mar_apr_maj_jun_jul_avg_sep_okt_nov_dec'.split('_'),
        weekdays : 'nedelja_ponedeljek_torek_sreda_\u010detrtek_petek_sobota'.split('_'),
        weekdaysShort : 'ned_pon_tor_sre_\u010det_pet_sob'.split('_'),
        weekdaysMin : 'ne_po_to_sr_\u010de_pe_so'.split('_'),
        longDateFormat : {
            LT : 'H:mm',
            LTS : 'H:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D. MMMM YYYY',
            LLL : 'D. MMMM YYYY H:mm',
            LLLL : 'dddd, D. MMMM YYYY H:mm'
        },
        calendar : {
            sameDay : '[danes ob] LT',
            nextDay : '[jutri ob] LT',
            nextWeek: function () {
                switch (this.day()) {
                    case 0:
                        return '[v nedeljo ob] LT';
                    case 1:
                    case 2:
                        return '[v] dddd [ob] LT';
                    case 3:
                        return '[v sredo ob] LT';
                    case 4:
                    case 5:
                        return '[v] dddd [ob] LT';
                    case 6:
                        return '[v soboto ob] LT';
                }
            },
            lastDay : '[včeraj ob] LT',
            lastWeek: function () {
                switch (this.day()) {
                    case 0:
                        return '[prej\u0161njo nedeljo ob] LT';
                    case 1:
                    case 2:
                        return '[prej\u0161nji] dddd [ob] LT';
                    case 3:
                        return '[prej\u0161njo sredo ob] LT';
                    case 4:
                    case 5:
                        return '[prej\u0161nji] dddd [ob] LT';
                    case 6:
                        return '[prej\u0161njo soboto ob] LT';
                }
            },
            sameElse : 'L'
        },
        relativeTime : {
            future : '\u010dez %s',
            past : 'pred %s',
            s : translate,
            ss : translate,
            m : translate,
            mm : translate,
            h : translate,
            hh : translate,
            d : translate,
            dd : translate,
            M : translate,
            MM : translate,
            y : translate,
            yy : translate
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return sl;

})));

