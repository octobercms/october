/*
 * This file has been compiled from: /modules/system/lang/et/client.php
 */
if ($.oc === undefined) $.oc = {}
if ($.oc.langMessages === undefined) $.oc.langMessages = {}
$.oc.langMessages['et'] = $.extend(
    $.oc.langMessages['et'] || {},
    {"markdowneditor":{"formatting":"Vorming","quote":"Tsitaat","code":"Kood","header1":"Pealkiri 1","header2":"Pealkiri 2","header3":"Pealkiri 3","header4":"Pealkiri 4","header5":"Pealkiri 5","header6":"Pealkiri 6","bold":"Paks","italic":"Kursiiv","unorderedlist":"J\u00e4rjestamata nimekiri","orderedlist":"J\u00e4rjestatud nimekiri","video":"Video","image":"Pilt","link":"Link","horizontalrule":"Sisesta horisontaaljoon","fullscreen":"T\u00e4isekraan","preview":"Eelvaade"},"mediamanager":{"insert_link":"Sisesta link","insert_image":"Siseta pilt","insert_video":"Sisesta video","insert_audio":"Sisesta heliklipp","invalid_file_empty_insert":"Palun vali fail, millele link lisada.","invalid_file_single_insert":"Palun vali \u00fcks fail.","invalid_image_empty_insert":"Palun vali pildid, mida lisada.","invalid_video_empty_insert":"Palun vali videoklipp, mida lisada.","invalid_audio_empty_insert":"Palun vali heliklipp, mida lisada."},"alert":{"confirm_button_text":"OK","cancel_button_text":"Loobu","widget_remove_confirm":"Eemalda see widget?"},"datepicker":{"previousMonth":"Eelmine kuu","nextMonth":"J\u00e4rgmine kuu","months":["Jaanuar","Veebruar","M\u00e4rts","Aprill","Mai","Juuni","Juuli","August","September","Oktoober","November","Detsember"],"weekdays":["P\u00fchap\u00e4ev","Esmasp\u00e4ev","Teisip\u00e4ev","Kolmap\u00e4ev","Neljap\u00e4ev","Reede","Laup\u00e4ev"],"weekdaysShort":["P","E","T","K","N","R","L"]},"colorpicker":{"choose":"Ok"},"filter":{"group":{"all":"k\u00f5ik"},"scopes":{"apply_button_text":"Apply","clear_button_text":"Clear"},"dates":{"all":"k\u00f5ik","filter_button_text":"Filtreeri","reset_button_text":"L\u00e4htesta","date_placeholder":"Kuup\u00e4ev","after_placeholder":"Hiljem kui","before_placeholder":"Varem kui"},"numbers":{"all":"all","filter_button_text":"Filter","reset_button_text":"Reset","min_placeholder":"Min","max_placeholder":"Max"}},"eventlog":{"show_stacktrace":"N\u00e4ita stacktrace","hide_stacktrace":"Peida stacktrace","tabs":{"formatted":"Kujundatud","raw":"Algne"},"editor":{"title":"L\u00e4htekoodi redaktor","description":"Sinu operatsioonis\u00fcsteem peaks olema sedistatud \u00fche URL skeemi jaoks.","openWith":"Ava programmiga","remember_choice":"J\u00e4ta valik selleks sessiooniks meelde","open":"Ava","cancel":"Loobu"}}}
);

//! moment.js locale configuration v2.22.2

;(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined'
       && typeof require === 'function' ? factory(require('../moment')) :
   typeof define === 'function' && define.amd ? define(['moment'], factory) :
   factory(global.moment)
}(this, function (moment) { 'use strict';


    function processRelativeTime(number, withoutSuffix, key, isFuture) {
        var format = {
            's' : ['mõne sekundi', 'mõni sekund', 'paar sekundit'],
            'm' : ['ühe minuti', 'üks minut'],
            'mm': [number + ' minuti', number + ' minutit'],
            'h' : ['ühe tunni', 'tund aega', 'üks tund'],
            'hh': [number + ' tunni', number + ' tundi'],
            'd' : ['ühe päeva', 'üks päev'],
            'M' : ['kuu aja', 'kuu aega', 'üks kuu'],
            'MM': [number + ' kuu', number + ' kuud'],
            'y' : ['ühe aasta', 'aasta', 'üks aasta'],
            'yy': [number + ' aasta', number + ' aastat']
        };
        if (withoutSuffix) {
            return format[key][2] ? format[key][2] : format[key][1];
        }
        return isFuture ? format[key][0] : format[key][1];
    }

    var et = moment.defineLocale('et', {
        months        : 'jaanuar_veebruar_märts_aprill_mai_juuni_juuli_august_september_oktoober_november_detsember'.split('_'),
        monthsShort   : 'jaan_veebr_märts_apr_mai_juuni_juuli_aug_sept_okt_nov_dets'.split('_'),
        weekdays      : 'pühapäev_esmaspäev_teisipäev_kolmapäev_neljapäev_reede_laupäev'.split('_'),
        weekdaysShort : 'P_E_T_K_N_R_L'.split('_'),
        weekdaysMin   : 'P_E_T_K_N_R_L'.split('_'),
        longDateFormat : {
            LT   : 'H:mm',
            LTS : 'H:mm:ss',
            L    : 'DD.MM.YYYY',
            LL   : 'D. MMMM YYYY',
            LLL  : 'D. MMMM YYYY H:mm',
            LLLL : 'dddd, D. MMMM YYYY H:mm'
        },
        calendar : {
            sameDay  : '[Täna,] LT',
            nextDay  : '[Homme,] LT',
            nextWeek : '[Järgmine] dddd LT',
            lastDay  : '[Eile,] LT',
            lastWeek : '[Eelmine] dddd LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : '%s pärast',
            past   : '%s tagasi',
            s      : processRelativeTime,
            m      : processRelativeTime,
            mm     : processRelativeTime,
            h      : processRelativeTime,
            hh     : processRelativeTime,
            d      : processRelativeTime,
            dd     : '%d päeva',
            M      : processRelativeTime,
            MM     : processRelativeTime,
            y      : processRelativeTime,
            yy     : processRelativeTime
        },
        ordinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return et;

}));

