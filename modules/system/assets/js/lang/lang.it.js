/*
 * This file has been compiled from: /modules/system/lang/it/client.php
 */
if ($.oc === undefined) $.oc = {}
if ($.oc.langMessages === undefined) $.oc.langMessages = {}
$.oc.langMessages['it'] = $.extend(
    $.oc.langMessages['it'] || {},
    {"markdowneditor":{"formatting":"Formattazione","quote":"Citazione","code":"Codice","header1":"Titolo 1","header2":"Titolo 2","header3":"Titolo 3","header4":"Titolo 4","header5":"Titolo 5","header6":"Titolo 6","bold":"Grassetto","italic":"Corsivo","unorderedlist":"Elenco puntato","orderedlist":"Elenco numerato","video":"Video","image":"Immagine","link":"Collegamento","horizontalrule":"Inserisci linea orizzontale","fullscreen":"Schermo intero","preview":"Anteprima"},"mediamanager":{"insert_link":"Inserisci collegamento elemento multimediale","insert_image":"Inserisci immagine","insert_video":"Inserisci video","insert_audio":"Inserisci audio","invalid_file_empty_insert":"Si prega di selezionare un file di cui inserire il collegamento.","invalid_file_single_insert":"Si prega di selezionare un singolo file.","invalid_image_empty_insert":"Si prega di selezionare l\\'immagine\/le immagini da inserire.","invalid_video_empty_insert":"Si prega di selezionare un file video da inserire.","invalid_audio_empty_insert":"Si prega di selezionare un file audio da inserire."},"alert":{"confirm_button_text":"OK","cancel_button_text":"Annulla","widget_remove_confirm":"Remove this widget?"},"datepicker":{"previousMonth":"Mese precedente","nextMonth":"Mese successivo","months":["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"],"weekdays":["Domenica","Luned\u00ec","Marted\u00ec","Mercoled\u00ec","Gioved\u00ec","Venerd\u00ec","Sabato"],"weekdaysShort":["Dom","Lun","Mar","Mer","Gio","Ven","Sab"]},"colorpicker":{"choose":"Ok"},"filter":{"group":{"all":"tutti"},"scopes":{"apply_button_text":"Apply","clear_button_text":"Clear"},"dates":{"all":"tutte","filter_button_text":"Filtra","reset_button_text":"Reimposta","date_placeholder":"Data","after_placeholder":"Dopo","before_placeholder":"Prima"},"numbers":{"all":"all","filter_button_text":"Filter","reset_button_text":"Reset","min_placeholder":"Min","max_placeholder":"Max"}},"eventlog":{"show_stacktrace":"Visualizza la traccia dello stack","hide_stacktrace":"Nascondi la traccia dello stack","tabs":{"formatted":"Formattato","raw":"Grezzo"},"editor":{"title":"Editor codice sorgente","description":"Il tuo sistema operativo deve essere configurato per ascoltare uno di questi schemi URL.","openWith":"Apri con","remember_choice":"Ricorda l'opzione selezionata per questa sessione","open":"Apri","cancel":"Annulla"}}}
);

//! moment.js locale configuration v2.22.2

;(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined'
       && typeof require === 'function' ? factory(require('../moment')) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


    var it = moment.defineLocale('it', {
        months : 'gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre'.split('_'),
        monthsShort : 'gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic'.split('_'),
        weekdays : 'domenica_lunedì_martedì_mercoledì_giovedì_venerdì_sabato'.split('_'),
        weekdaysShort : 'dom_lun_mar_mer_gio_ven_sab'.split('_'),
        weekdaysMin : 'do_lu_ma_me_gi_ve_sa'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay: '[Oggi alle] LT',
            nextDay: '[Domani alle] LT',
            nextWeek: 'dddd [alle] LT',
            lastDay: '[Ieri alle] LT',
            lastWeek: function () {
                switch (this.day()) {
                    case 0:
                        return '[la scorsa] dddd [alle] LT';
                    default:
                        return '[lo scorso] dddd [alle] LT';
                }
            },
            sameElse: 'L'
        },
        relativeTime : {
            future : function (s) {
                return ((/^[0-9].+$/).test(s) ? 'tra' : 'in') + ' ' + s;
            },
            past : '%s fa',
            s : 'alcuni secondi',
            ss : '%d secondi',
            m : 'un minuto',
            mm : '%d minuti',
            h : 'un\'ora',
            hh : '%d ore',
            d : 'un giorno',
            dd : '%d giorni',
            M : 'un mese',
            MM : '%d mesi',
            y : 'un anno',
            yy : '%d anni'
        },
        dayOfMonthOrdinalParse : /\d{1,2}º/,
        ordinal: '%dº',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return it;

})));

