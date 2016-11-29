/*
 * This file has been compiled from: /modules/system/lang/tr/client.php
 */
if ($.oc === undefined) $.oc = {}
if ($.oc.langMessages === undefined) $.oc.langMessages = {}
$.oc.langMessages['tr'] = $.extend(
    $.oc.langMessages['tr'] || {},
    {"markdowneditor":{"formatting":"Formatlama","quote":"Al\u0131nt\u0131","code":"Kod","header1":"Ba\u015fl\u0131k 1","header2":"Ba\u015fl\u0131k 2","header3":"Ba\u015fl\u0131k 3","header4":"Ba\u015fl\u0131k 4","header5":"Ba\u015fl\u0131k 5","header6":"Ba\u015fl\u0131k 6","bold":"Kal\u0131n","italic":"\u0130talik","unorderedlist":"S\u0131ras\u0131z Liste","orderedlist":"S\u0131ral\u0131 Liste","video":"Video","image":"G\u00f6rsel\/Resim","link":"Link","horizontalrule":"Yatay \u00c7izgi Ekle","fullscreen":"Tam Ekran","preview":"\u00d6nizleme"},"mediamanager":{"insert_link":"Medya Linki Ekle","insert_image":"Medya Resim Ekle","insert_video":"Medya Video Ekle","insert_audio":"Medya Ses Ekle","invalid_file_empty_insert":"L\u00fctfen link verilecek dosyay\u0131 se\u00e7in.","invalid_file_single_insert":"L\u00fctfen tek bir dosya se\u00e7in.","invalid_image_empty_insert":"L\u00fctfen eklenecek resim(ler)i se\u00e7in.","invalid_video_empty_insert":"L\u00fctfen eklenecek video dosyas\u0131n\u0131 se\u00e7in.","invalid_audio_empty_insert":"L\u00fctfen eklenecek ses dosyas\u0131n\u0131 se\u00e7in."},"alert":{"confirm_button_text":"Evet","cancel_button_text":"\u0130ptal","widget_remove_confirm":"Bu eklentiyi kald\u0131rma istedi\u011finize emin misiniz?"},"datepicker":{"previousMonth":"\u00d6nceki Ay","nextMonth":"Sonraki Ay","months":["Ocak","\u015eubat","Mart","Nisan","May\u0131s","Haziran","Temmuz","A\u011fustos","Eyl\u00fcl","Ekim","Kas\u0131m","Aral\u0131k"],"weekdays":["Pazar","Pazartesi","Sal\u0131","\u00c7ar\u015famba","Per\u015fembe","Cuma","Cumartesi"],"weekdaysShort":["Paz","Pzt","Sal","\u00c7ar","Per","Cum","Cmt"]},"filter":{"group":{"all":"t\u00fcm\u00fc"},"dates":{"all":"t\u00fcm\u00fc","filter_button_text":"Filtrele","reset_button_text":"S\u0131f\u0131rla","date_placeholder":"Tarih","after_placeholder":"Sonra","before_placeholder":"\u00d6nce"}},"eventlog":{"show_stacktrace":"Veri y\u0131\u011f\u0131n\u0131n\u0131 g\u00f6ster","hide_stacktrace":"Veri y\u0131\u011f\u0131n\u0131n\u0131 gizle","tabs":{"formatted":"Formatl\u0131","raw":"Ham Veri"},"editor":{"title":"Kaynak kod edit\u00f6r\u00fc","description":"\u0130\u015fletim sisteminiz URL \u015femalar\u0131na yan\u0131t verecek \u015fekilde yap\u0131land\u0131r\u0131lmal\u0131d\u0131r.","openWith":"Birlikte a\u00e7","remember_choice":"Bu oturum i\u00e7in se\u00e7enekleri hat\u0131rla","open":"A\u00e7","cancel":"\u0130ptal"}}}
);

//! moment.js locale configuration
//! locale : turkish (tr)
//! authors : Erhan Gundogan : https://github.com/erhangundogan,
//!           Burak Yiğit Kaya: https://github.com/BYK

;(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined'
       && typeof require === 'function' ? factory(require('../moment')) :
   typeof define === 'function' && define.amd ? define(['moment'], factory) :
   factory(global.moment)
}(this, function (moment) { 'use strict';


    var suffixes = {
        1: '\'inci',
        5: '\'inci',
        8: '\'inci',
        70: '\'inci',
        80: '\'inci',
        2: '\'nci',
        7: '\'nci',
        20: '\'nci',
        50: '\'nci',
        3: '\'üncü',
        4: '\'üncü',
        100: '\'üncü',
        6: '\'ncı',
        9: '\'uncu',
        10: '\'uncu',
        30: '\'uncu',
        60: '\'ıncı',
        90: '\'ıncı'
    };

    var tr = moment.defineLocale('tr', {
        months : 'Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık'.split('_'),
        monthsShort : 'Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara'.split('_'),
        weekdays : 'Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi'.split('_'),
        weekdaysShort : 'Paz_Pts_Sal_Çar_Per_Cum_Cts'.split('_'),
        weekdaysMin : 'Pz_Pt_Sa_Ça_Pe_Cu_Ct'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd, D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay : '[bugün saat] LT',
            nextDay : '[yarın saat] LT',
            nextWeek : '[haftaya] dddd [saat] LT',
            lastDay : '[dün] LT',
            lastWeek : '[geçen hafta] dddd [saat] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : '%s sonra',
            past : '%s önce',
            s : 'birkaç saniye',
            m : 'bir dakika',
            mm : '%d dakika',
            h : 'bir saat',
            hh : '%d saat',
            d : 'bir gün',
            dd : '%d gün',
            M : 'bir ay',
            MM : '%d ay',
            y : 'bir yıl',
            yy : '%d yıl'
        },
        ordinalParse: /\d{1,2}'(inci|nci|üncü|ncı|uncu|ıncı)/,
        ordinal : function (number) {
            if (number === 0) {  // special case for zero
                return number + '\'ıncı';
            }
            var a = number % 10,
                b = number % 100 - a,
                c = number >= 100 ? 100 : null;
            return number + (suffixes[a] || suffixes[b] || suffixes[c]);
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 1st is the first week of the year.
        }
    });

    return tr;

}));
