/*
 * This file has been compiled from: /modules/system/lang/pl/client.php
 */
if ($.oc === undefined) $.oc = {}
if ($.oc.langMessages === undefined) $.oc.langMessages = {}
$.oc.langMessages['pl'] = $.extend(
    $.oc.langMessages['pl'] || {},
    {"markdowneditor":{"formatting":"Formaty","quote":"Cytat","code":"Widok kod","header1":"Nag\u0142\u00f3wek 1","header2":"Nag\u0142\u00f3wek 2","header3":"Nag\u0142\u00f3wek 3","header4":"Nag\u0142\u00f3wek 4","header5":"Nag\u0142\u00f3wek 5","header6":"Nag\u0142\u00f3wek 6","bold":"Pogrubienie","italic":"Kursywa","unorderedlist":"\"Lista nieuporz\u0105dkowana","orderedlist":"Uporz\u0105dkowana lista","video":"Wideo","image":"Obrazek","link":"Link","horizontalrule":"Wstaw lini\u0119 poziom\u0105","fullscreen":"Pe\u0142ny ekran","preview":"Podgl\u0105d"},"mediamanager":{"insert_link":"Wstaw Link","insert_image":"Wstaw Obraz","insert_video":"Wstaw Wideo","insert_audio":"Wstaw Audio","invalid_file_empty_insert":"Prosimy wybra\u0107 plik do podlinkowania.","invalid_file_single_insert":"Prosimy wybra\u0107 pojedynczy plik.","invalid_image_empty_insert":"Prosimy wybra\u0107 obrazy do wstawienia.","invalid_video_empty_insert":"Prosimy wybra\u0107 wideo do wstawienia.","invalid_audio_empty_insert":"Prosimy wybra\u0107 audio do wstawienia."},"alert":{"confirm_button_text":"OK","cancel_button_text":"Anuluj","widget_remove_confirm":"Remove this widget?"},"datepicker":{"previousMonth":"Poprzedni miesi\u0105c","nextMonth":"Nast\u0119pny miesi\u0105c","months":["Stycze\u0144","Luty","Marzec","Kwiecie\u0144","Maj","Czerwiec","Lipiec","Sierpie\u0144","Wrzesie\u0144","Pa\u017adziernik","Listopad","Grudzie\u0144"],"weekdays":["Niedziela","Poniedzia\u0142ek","Wtorek","\u015aroda","Czwartek","Pi\u0105tek","Sobota"],"weekdaysShort":["Nie","Pn","Wt","\u015ar","Czw","Pt","So"]},"colorpicker":{"choose":"Ok"},"filter":{"group":{"all":"wszystkie"},"dates":{"all":"wszystkie","filter_button_text":"Filtruj","reset_button_text":"Resetuj","date_placeholder":"Data","after_placeholder":"Po","before_placeholder":"Przed"},"numbers":{"all":"all","filter_button_text":"Filter","reset_button_text":"Reset","min_placeholder":"Min","max_placeholder":"Max"}},"eventlog":{"show_stacktrace":"Poka\u017c stos wywo\u0142a\u0144","hide_stacktrace":"Ukryj stos wywo\u0142a\u0144","tabs":{"formatted":"Sformatowany","raw":"Nieprzetworzony"},"editor":{"title":"Edytor kodu \u017ar\u00f3d\u0142owego","description":"Tw\u00f3j system operacyjny powinien by\u0107 skonfigurowany aby nas\u0142uchiwa\u0107 na jednym z podanych schemat\u00f3w URL.","openWith":"Otw\u00f3rz za pomoc\u0105","remember_choice":"Zapami\u0119taj wybran\u0105 opcj\u0119 dla tej sesji","open":"Otw\u00f3rz","cancel":"Anuluj"}}}
);

//! moment.js locale configuration
//! locale : polish (pl)
//! author : Rafal Hirsz : https://github.com/evoL

;(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined'
       && typeof require === 'function' ? factory(require('../moment')) :
   typeof define === 'function' && define.amd ? define(['moment'], factory) :
   factory(global.moment)
}(this, function (moment) { 'use strict';


    var monthsNominative = 'styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień'.split('_'),
        monthsSubjective = 'stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_września_października_listopada_grudnia'.split('_');
    function plural(n) {
        return (n % 10 < 5) && (n % 10 > 1) && ((~~(n / 10) % 10) !== 1);
    }
    function translate(number, withoutSuffix, key) {
        var result = number + ' ';
        switch (key) {
        case 'm':
            return withoutSuffix ? 'minuta' : 'minutę';
        case 'mm':
            return result + (plural(number) ? 'minuty' : 'minut');
        case 'h':
            return withoutSuffix  ? 'godzina'  : 'godzinę';
        case 'hh':
            return result + (plural(number) ? 'godziny' : 'godzin');
        case 'MM':
            return result + (plural(number) ? 'miesiące' : 'miesięcy');
        case 'yy':
            return result + (plural(number) ? 'lata' : 'lat');
        }
    }

    var pl = moment.defineLocale('pl', {
        months : function (momentToFormat, format) {
            if (format === '') {
                // Hack: if format empty we know this is used to generate
                // RegExp by moment. Give then back both valid forms of months
                // in RegExp ready format.
                return '(' + monthsSubjective[momentToFormat.month()] + '|' + monthsNominative[momentToFormat.month()] + ')';
            } else if (/D MMMM/.test(format)) {
                return monthsSubjective[momentToFormat.month()];
            } else {
                return monthsNominative[momentToFormat.month()];
            }
        },
        monthsShort : 'sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru'.split('_'),
        weekdays : 'niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota'.split('_'),
        weekdaysShort : 'nie_pon_wt_śr_czw_pt_sb'.split('_'),
        weekdaysMin : 'Nd_Pn_Wt_Śr_Cz_Pt_So'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd, D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay: '[Dziś o] LT',
            nextDay: '[Jutro o] LT',
            nextWeek: '[W] dddd [o] LT',
            lastDay: '[Wczoraj o] LT',
            lastWeek: function () {
                switch (this.day()) {
                case 0:
                    return '[W zeszłą niedzielę o] LT';
                case 3:
                    return '[W zeszłą środę o] LT';
                case 6:
                    return '[W zeszłą sobotę o] LT';
                default:
                    return '[W zeszły] dddd [o] LT';
                }
            },
            sameElse: 'L'
        },
        relativeTime : {
            future : 'za %s',
            past : '%s temu',
            s : 'kilka sekund',
            m : translate,
            mm : translate,
            h : translate,
            hh : translate,
            d : '1 dzień',
            dd : '%d dni',
            M : 'miesiąc',
            MM : translate,
            y : 'rok',
            yy : translate
        },
        ordinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return pl;

}));
