/*
 * This file has been compiled from: /modules/system/lang/es/client.php
 */
if ($.oc === undefined) $.oc = {}
if ($.oc.langMessages === undefined) $.oc.langMessages = {}
$.oc.langMessages['es'] = $.extend(
    $.oc.langMessages['es'] || {},
    {"markdowneditor":{"formatting":"Formateo","quote":"Cita","code":"C\u00f3digo","header1":"Encabezado 1","header2":"Encabezado 2","header3":"Encabezado 3","header4":"Encabezado 4","header5":"Encabezado 5","header6":"Encabezado 6","bold":"Negrita","italic":"Cursiva","unorderedlist":"Lista Desordenada","orderedlist":"Lista Ordenada","video":"Video","image":"Imagen","link":"V\u00ednculo","horizontalrule":"Insertar Regla Horizontal","fullscreen":"Pantalla completa","preview":"Previsualizar"},"mediamanager":{"insert_link":"Insertar Media V\u00ednculo","insert_image":"Insertar Media Imagen","insert_video":"Insertar Media Video","insert_audio":"Insertar Media Audio","invalid_file_empty_insert":"Por favor seleccione archivo para insertar v\u00ednculo.","invalid_file_single_insert":"Por favor seleccione un solo archivo.","invalid_image_empty_insert":"Por favor seleccione una imagen(es) para insertar.","invalid_video_empty_insert":"Por favor seleccione un archivo de video para insertar.","invalid_audio_empty_insert":"Por favor seleccione un archivo de audio para insertar."},"alert":{"confirm_button_text":"OK","cancel_button_text":"Cancelar","widget_remove_confirm":"Remove this widget?"},"datepicker":{"previousMonth":"Mes Anterior","nextMonth":"Mes Siguiente","months":["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],"weekdays":["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"],"weekdaysShort":["Dom","Lun","Mar","Mie","Jue","Vie","Sab"]},"colorpicker":{"choose":"Ok"},"filter":{"group":{"all":"todos"},"dates":{"all":"todos","filter_button_text":"Filtro","reset_button_text":"Restablecer","date_placeholder":"Fecha","after_placeholder":"Despues","before_placeholder":"Antes"},"numbers":{"all":"all","filter_button_text":"Filter","reset_button_text":"Reset","min_placeholder":"Min","max_placeholder":"Max"}},"eventlog":{"show_stacktrace":"Mostrar el seguimiento de la pila","hide_stacktrace":"Ocultar el seguimiento de la pila","tabs":{"formatted":"Formateado","raw":"Sin formato"},"editor":{"title":"Seleccione el editor de c\u00f3digo fuente a usar","description":"Su entorno de sistema operativo debe estar configurado para escuchar a uno de estos esquemas de URL.","openWith":"Abrir con","remember_choice":"Remember selected option for this session","open":"Abrir","cancel":"Cancelar","rememberChoice":"Recuerde que la opci\u00f3n seleccionada para esta sesi\u00f3n del navegador"}}}
);

//! moment.js locale configuration
//! locale : spanish (es)
//! author : Julio Napurí : https://github.com/julionc

;(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined'
       && typeof require === 'function' ? factory(require('../moment')) :
   typeof define === 'function' && define.amd ? define(['moment'], factory) :
   factory(global.moment)
}(this, function (moment) { 'use strict';


    var monthsShortDot = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_'),
        monthsShort = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_');

    var es = moment.defineLocale('es', {
        months : 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
        monthsShort : function (m, format) {
            if (/-MMM-/.test(format)) {
                return monthsShort[m.month()];
            } else {
                return monthsShortDot[m.month()];
            }
        },
        monthsParseExact : true,
        weekdays : 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
        weekdaysShort : 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
        weekdaysMin : 'do_lu_ma_mi_ju_vi_sá'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'H:mm',
            LTS : 'H:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D [de] MMMM [de] YYYY',
            LLL : 'D [de] MMMM [de] YYYY H:mm',
            LLLL : 'dddd, D [de] MMMM [de] YYYY H:mm'
        },
        calendar : {
            sameDay : function () {
                return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
            },
            nextDay : function () {
                return '[mañana a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
            },
            nextWeek : function () {
                return 'dddd [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
            },
            lastDay : function () {
                return '[ayer a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
            },
            lastWeek : function () {
                return '[el] dddd [pasado a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
            },
            sameElse : 'L'
        },
        relativeTime : {
            future : 'en %s',
            past : 'hace %s',
            s : 'unos segundos',
            m : 'un minuto',
            mm : '%d minutos',
            h : 'una hora',
            hh : '%d horas',
            d : 'un día',
            dd : '%d días',
            M : 'un mes',
            MM : '%d meses',
            y : 'un año',
            yy : '%d años'
        },
        ordinalParse : /\d{1,2}º/,
        ordinal : '%dº',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return es;

}));
