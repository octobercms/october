/*
 * This file has been compiled from: /modules/system/lang/sk/client.php
 */
if ($.oc === undefined) $.oc = {}
if ($.oc.langMessages === undefined) $.oc.langMessages = {}
$.oc.langMessages['sk'] = $.extend(
    $.oc.langMessages['sk'] || {},
    {"markdowneditor":{"formatting":"Form\u00e1tovanie","quote":"Cit\u00e1t","code":"K\u00f3d","header1":"Nadpis 1","header2":"Nadpis 2","header3":"Nadpis 3","header4":"Nadpis 4","header5":"Nadpis 5","header6":"Nadpis 6","bold":"Tu\u010dn\u00e9","italic":"Kurz\u00edva","unorderedlist":"Ne\u010d\u00edslovan\u00fd zoznam","orderedlist":"\u010c\u00edslovan\u00fd zoznam","video":"Video","image":"Obr\u00e1zok","link":"Odkaz","horizontalrule":"Vlo\u017ei\u0165 horizont\u00e1lnu linku","fullscreen":"Cel\u00e1 obrazovka","preview":"N\u00e1h\u013ead"},"mediamanager":{"insert_link":"Vlo\u017ei\u0165 odkaz","insert_image":"Vlo\u017ei\u0165 obr\u00e1zok","insert_video":"Vlo\u017ei\u0165 video","insert_audio":"Vlo\u017ei\u0165 audio","invalid_file_empty_insert":"Pros\u00edm vyberte s\u00fabor, na ktor\u00fd sa vlo\u017e\u00ed odkaz.","invalid_file_single_insert":"Pros\u00edm vyberte jeden s\u00fabor.","invalid_image_empty_insert":"Pros\u00edm vyberte obr\u00e1zky na vlo\u017eenie.","invalid_video_empty_insert":"Pros\u00edm vyberte video na vlo\u017eenie.","invalid_audio_empty_insert":"Pros\u00edm vyberte audio s\u00fabor na vlo\u017eenie."},"alert":{"confirm_button_text":"OK","cancel_button_text":"Zru\u0161i\u0165","widget_remove_confirm":"Skuto\u010dne zmaza\u0165 tento widget?"},"datepicker":{"previousMonth":"Predch\u00e1dzaj\u00faci mesiac","nextMonth":"Nasleduj\u00faci mesiac","months":["Janu\u00e1r","Febru\u00e1r","Marec","Apr\u00edl","M\u00e1j","J\u00fan","J\u00fal","August","September","Okt\u00f3ber","November","December"],"weekdays":["Nede\u013ea","Pondelok","Utorok","Streda","\u0160tvrtok","Piatok","Sobota"],"weekdaysShort":["Ne","Po","Ut","St","\u0160t","Pi","So"]},"colorpicker":{"choose":"Ok"},"filter":{"group":{"all":"v\u0161etko"},"scopes":{"apply_button_text":"Apply","clear_button_text":"Clear"},"dates":{"all":"v\u0161etko","filter_button_text":"Filtrova\u0165","reset_button_text":"Zru\u0161i\u0165","date_placeholder":"D\u00e1tum","after_placeholder":"Po","before_placeholder":"Pred"},"numbers":{"all":"all","filter_button_text":"Filter","reset_button_text":"Zru\u0161i\u0165","min_placeholder":"Min","max_placeholder":"Max"}},"eventlog":{"show_stacktrace":"Zobrazi\u0165 stacktrace","hide_stacktrace":"Skry\u0165 stacktrace","tabs":{"formatted":"Form\u00e1tovan\u00e9","raw":"P\u00f4vodn\u00e9 (raw)"},"editor":{"title":"Editor zdrojov\u00e9ho k\u00f3du","description":"V\u00e1\u0161 opera\u010dn\u00fd syst\u00e9m by mal by\u0165 konfigurovan\u00fd tak, aby po\u010d\u00faval jednu z t\u00fdchto URL sh\u00e9m.","openWith":"Otvori\u0165 v","remember_choice":"Zapam\u00e4ta\u0165 si vybran\u00fa vo\u013ebu pre t\u00fato rel\u00e1ciu","open":"Otvori\u0165","cancel":"Zru\u0161i\u0165"}}}
);

//! moment.js locale configuration v2.22.2

;(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined'
       && typeof require === 'function' ? factory(require('../moment')) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


    var months = 'január_február_marec_apríl_máj_jún_júl_august_september_október_november_december'.split('_'),
        monthsShort = 'jan_feb_mar_apr_máj_jún_júl_aug_sep_okt_nov_dec'.split('_');
    function plural(n) {
        return (n > 1) && (n < 5);
    }
    function translate(number, withoutSuffix, key, isFuture) {
        var result = number + ' ';
        switch (key) {
            case 's':  // a few seconds / in a few seconds / a few seconds ago
                return (withoutSuffix || isFuture) ? 'pár sekúnd' : 'pár sekundami';
            case 'ss': // 9 seconds / in 9 seconds / 9 seconds ago
                if (withoutSuffix || isFuture) {
                    return result + (plural(number) ? 'sekundy' : 'sekúnd');
                } else {
                    return result + 'sekundami';
                }
                break;
            case 'm':  // a minute / in a minute / a minute ago
                return withoutSuffix ? 'minúta' : (isFuture ? 'minútu' : 'minútou');
            case 'mm': // 9 minutes / in 9 minutes / 9 minutes ago
                if (withoutSuffix || isFuture) {
                    return result + (plural(number) ? 'minúty' : 'minút');
                } else {
                    return result + 'minútami';
                }
                break;
            case 'h':  // an hour / in an hour / an hour ago
                return withoutSuffix ? 'hodina' : (isFuture ? 'hodinu' : 'hodinou');
            case 'hh': // 9 hours / in 9 hours / 9 hours ago
                if (withoutSuffix || isFuture) {
                    return result + (plural(number) ? 'hodiny' : 'hodín');
                } else {
                    return result + 'hodinami';
                }
                break;
            case 'd':  // a day / in a day / a day ago
                return (withoutSuffix || isFuture) ? 'deň' : 'dňom';
            case 'dd': // 9 days / in 9 days / 9 days ago
                if (withoutSuffix || isFuture) {
                    return result + (plural(number) ? 'dni' : 'dní');
                } else {
                    return result + 'dňami';
                }
                break;
            case 'M':  // a month / in a month / a month ago
                return (withoutSuffix || isFuture) ? 'mesiac' : 'mesiacom';
            case 'MM': // 9 months / in 9 months / 9 months ago
                if (withoutSuffix || isFuture) {
                    return result + (plural(number) ? 'mesiace' : 'mesiacov');
                } else {
                    return result + 'mesiacmi';
                }
                break;
            case 'y':  // a year / in a year / a year ago
                return (withoutSuffix || isFuture) ? 'rok' : 'rokom';
            case 'yy': // 9 years / in 9 years / 9 years ago
                if (withoutSuffix || isFuture) {
                    return result + (plural(number) ? 'roky' : 'rokov');
                } else {
                    return result + 'rokmi';
                }
                break;
        }
    }

    var sk = moment.defineLocale('sk', {
        months : months,
        monthsShort : monthsShort,
        weekdays : 'nedeľa_pondelok_utorok_streda_štvrtok_piatok_sobota'.split('_'),
        weekdaysShort : 'ne_po_ut_st_št_pi_so'.split('_'),
        weekdaysMin : 'ne_po_ut_st_št_pi_so'.split('_'),
        longDateFormat : {
            LT: 'H:mm',
            LTS : 'H:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D. MMMM YYYY',
            LLL : 'D. MMMM YYYY H:mm',
            LLLL : 'dddd D. MMMM YYYY H:mm'
        },
        calendar : {
            sameDay: '[dnes o] LT',
            nextDay: '[zajtra o] LT',
            nextWeek: function () {
                switch (this.day()) {
                    case 0:
                        return '[v nedeľu o] LT';
                    case 1:
                    case 2:
                        return '[v] dddd [o] LT';
                    case 3:
                        return '[v stredu o] LT';
                    case 4:
                        return '[vo štvrtok o] LT';
                    case 5:
                        return '[v piatok o] LT';
                    case 6:
                        return '[v sobotu o] LT';
                }
            },
            lastDay: '[včera o] LT',
            lastWeek: function () {
                switch (this.day()) {
                    case 0:
                        return '[minulú nedeľu o] LT';
                    case 1:
                    case 2:
                        return '[minulý] dddd [o] LT';
                    case 3:
                        return '[minulú stredu o] LT';
                    case 4:
                    case 5:
                        return '[minulý] dddd [o] LT';
                    case 6:
                        return '[minulú sobotu o] LT';
                }
            },
            sameElse: 'L'
        },
        relativeTime : {
            future : 'za %s',
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

    return sk;

})));

