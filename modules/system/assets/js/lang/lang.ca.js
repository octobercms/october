/*
 * This file has been compiled from: /modules/system/lang/ca/client.php
 */
if ($.oc === undefined) $.oc = {}
if ($.oc.langMessages === undefined) $.oc.langMessages = {}
$.oc.langMessages['ca'] = $.extend(
    $.oc.langMessages['ca'] || {},
    {"markdowneditor":{"formatting":"Formatar","quote":"Quota","code":"Codi","header1":"T\u00edtol 1","header2":"T\u00edtol 2","header3":"T\u00edtol 3","header4":"T\u00edtol 4","header5":"T\u00edtol 5","header6":"T\u00edtol 6","bold":"Negreta","italic":"Cursiva","unorderedlist":"Llista desordenada","orderedlist":"Llista ordenada","video":"V\u00eddeo","image":"Imatge","link":"Enlla\u00e7","horizontalrule":"Insertar l\u00ednia horitzontal","fullscreen":"Pantalla completa","preview":"Previsualitzar"},"mediamanager":{"insert_link":"Insertar enlla\u00e7 a media","insert_image":"Insertar imatge de media","insert_video":"Insertar video de media","insert_audio":"Insertar audio de media","invalid_file_empty_insert":"Siusplau sel\u00b7lecciona l'arxiu a enlla\u00e7ar.","invalid_file_single_insert":"Siusplau sel\u00b7lecciona un sol arxiu.","invalid_image_empty_insert":"Siusplau sel\u00b7lecciona imatge(s) per insertar.","invalid_video_empty_insert":"Siusplau sel\u00b7lecciona un arxiu de v\u00eddeo per insertar.","invalid_audio_empty_insert":"Siusplau sel\u00b7lecciona un arxiu d'audio per insertar."},"alert":{"confirm_button_text":"OK","cancel_button_text":"Cancel\u00b7lar","widget_remove_confirm":"Eliminar aquest widget?"},"datepicker":{"previousMonth":"Mes anterior","nextMonth":"Mes seg\u00fcent","months":["Gener","Febrer","Mar\u00e7","Abril","Maig","Juny","Juliol","Agost","Setembre","Octubre","Novembre","Desembre"],"weekdays":["Diumenge","Dilluns","Dimarts","Dimecres","Dijous","Divendres","Dissabte"],"weekdaysShort":["Dg","Dl","Dm","Dx","Dj","Dv","Ds"]},"colorpicker":{"choose":"Ok"},"filter":{"group":{"all":"tots"},"dates":{"all":"tots","filter_button_text":"Filtrar","reset_button_text":"Reiniciar","date_placeholder":"Data","after_placeholder":"Despr\u00e9s","before_placeholder":"Abans"},"numbers":{"all":"tots","filter_button_text":"Filtrar","reset_button_text":"Reiniciar","min_placeholder":"M\u00edn","max_placeholder":"M\u00e0x"}},"eventlog":{"show_stacktrace":"Mostrar l'stacktrace","hide_stacktrace":"Ocultar l'stacktrace","tabs":{"formatted":"Formatat","raw":"Cru"},"editor":{"title":"Editor de codi font","description":"El teu sistema operatiu hauria d'estar configurat per escoltar un d'aquests esquemes d'URL.","openWith":"Obrir amb","remember_choice":"Recordar l'opci\u00f3 sel\u00b7leccionada durant aquesta sessi\u00f3","open":"Obrir","cancel":"Cancel\u00b7lar"}}}
);

//! moment.js locale configuration
//! locale : catalan (ca)
//! author : Juan G. Hurtado : https://github.com/juanghurtado

;(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined'
       && typeof require === 'function' ? factory(require('../moment')) :
   typeof define === 'function' && define.amd ? define(['moment'], factory) :
   factory(global.moment)
}(this, function (moment) { 'use strict';


    var ca = moment.defineLocale('ca', {
        months : 'gener_febrer_març_abril_maig_juny_juliol_agost_setembre_octubre_novembre_desembre'.split('_'),
        monthsShort : 'gen._febr._mar._abr._mai._jun._jul._ag._set._oct._nov._des.'.split('_'),
        monthsParseExact : true,
        weekdays : 'diumenge_dilluns_dimarts_dimecres_dijous_divendres_dissabte'.split('_'),
        weekdaysShort : 'dg._dl._dt._dc._dj._dv._ds.'.split('_'),
        weekdaysMin : 'Dg_Dl_Dt_Dc_Dj_Dv_Ds'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'H:mm',
            LTS : 'H:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY H:mm',
            LLLL : 'dddd D MMMM YYYY H:mm'
        },
        calendar : {
            sameDay : function () {
                return '[avui a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
            },
            nextDay : function () {
                return '[demà a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
            },
            nextWeek : function () {
                return 'dddd [a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
            },
            lastDay : function () {
                return '[ahir a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
            },
            lastWeek : function () {
                return '[el] dddd [passat a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
            },
            sameElse : 'L'
        },
        relativeTime : {
            future : 'en %s',
            past : 'fa %s',
            s : 'uns segons',
            m : 'un minut',
            mm : '%d minuts',
            h : 'una hora',
            hh : '%d hores',
            d : 'un dia',
            dd : '%d dies',
            M : 'un mes',
            MM : '%d mesos',
            y : 'un any',
            yy : '%d anys'
        },
        ordinalParse: /\d{1,2}(r|n|t|è|a)/,
        ordinal : function (number, period) {
            var output = (number === 1) ? 'r' :
                (number === 2) ? 'n' :
                (number === 3) ? 'r' :
                (number === 4) ? 't' : 'è';
            if (period === 'w' || period === 'W') {
                output = 'a';
            }
            return number + output;
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return ca;

}));
