/*
 * This file has been compiled from: /modules/system/lang/fr/client.php
 */
if ($.oc === undefined) $.oc = {}
if ($.oc.langMessages === undefined) $.oc.langMessages = {}
$.oc.langMessages['fr'] = $.extend(
    $.oc.langMessages['fr'] || {},
    {"markdowneditor":{"formatting":"Formatage","quote":"Citation","code":"Code","header1":"Ent\u00eate 1","header2":"Ent\u00eate 2","header3":"Ent\u00eate 3","header4":"Ent\u00eate 4","header5":"Ent\u00eate 5","header6":"Ent\u00eate 6","bold":"Gras","italic":"Italique","unorderedlist":"Liste non ordonn\u00e9e","orderedlist":"Liste ordonn\u00e9e","video":"Vid\u00e9o","image":"Image","link":"Lien","horizontalrule":"Ins\u00e9rer la r\u00e8gle horizontalement","fullscreen":"Plein \u00e9cran","preview":"Aper\u00e7u"},"mediamanager":{"insert_link":"Ins\u00e9rer un lien vers un fichier du gestionnaire de m\u00e9dia","insert_image":"Ins\u00e9rer une image du gestionnaire de m\u00e9dia","insert_video":"Ins\u00e9rer une vid\u00e9o du gestionnaire de m\u00e9dia","insert_audio":"Ins\u00e9rer un document audio du gestionnaire de m\u00e9dia","invalid_file_empty_insert":"Veuillez s\u00e9lectionner un fichier \u00e0 lier.","invalid_file_single_insert":"Veuillez s\u00e9lectionner un seul fichier.","invalid_image_empty_insert":"Veuillez s\u00e9lectionner au moins une image \u00e0 ins\u00e9rer.","invalid_video_empty_insert":"Veuillez s\u00e9lectionner une vid\u00e9o \u00e0 ins\u00e9rer.","invalid_audio_empty_insert":"Veuillez s\u00e9lectionner un document audio \u00e0 ins\u00e9rer."},"alert":{"confirm_button_text":"OK","cancel_button_text":"Annuler","widget_remove_confirm":"Retirer ce widget ?"},"datepicker":{"previousMonth":"Mois pr\u00e9c\u00e9dent","nextMonth":"Mois suivant","months":["Janvier","F\u00e9vrier","Mars","Avril","Mai","Juin","Juillet","Ao\u00fbt","Septembre","Octobre","Novembre","D\u00e9cembre"],"weekdays":["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"],"weekdaysShort":["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"]},"colorpicker":{"choose":"Ok"},"filter":{"group":{"all":"tous"},"scopes":{"apply_button_text":"Appliquer","clear_button_text":"Annuler"},"dates":{"all":"toute la p\u00e9riode","filter_button_text":"Filtrer","reset_button_text":"Effacer","date_placeholder":"Date","after_placeholder":"Apr\u00e8s le","before_placeholder":"Avant le"},"numbers":{"all":"tous","filter_button_text":"Filtres","reset_button_text":"R\u00e9initialiser","min_placeholder":"Min","max_placeholder":"Max"}},"eventlog":{"show_stacktrace":"Afficher la pile d\u2019ex\u00e9cution","hide_stacktrace":"Masquer la pile d\u2019ex\u00e9cution","tabs":{"formatted":"Message format\u00e9","raw":"Message brut"},"editor":{"title":"S\u00e9lectionnez l\u2019\u00e9diteur de code source \u00e0 utiliser","description":"L\u2019environnement de votre syst\u00e8me d\u2019exploitation doit \u00eatre configur\u00e9 pour ouvrir l\u2019un des sch\u00e9mas d\u2019URL ci-dessous.","openWith":"Ouvrir avec","remember_choice":"Se souvenir de la s\u00e9lection pour la dur\u00e9e de la session dans ce navigateur","open":"Ouvrir","cancel":"Annuler"}}}
);

//! moment.js locale configuration v2.22.2

;(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined'
       && typeof require === 'function' ? factory(require('../moment')) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


    var fr = moment.defineLocale('fr', {
        months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
        monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
        monthsParseExact : true,
        weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
        weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
        weekdaysMin : 'di_lu_ma_me_je_ve_sa'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay : '[Aujourd’hui à] LT',
            nextDay : '[Demain à] LT',
            nextWeek : 'dddd [à] LT',
            lastDay : '[Hier à] LT',
            lastWeek : 'dddd [dernier à] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'dans %s',
            past : 'il y a %s',
            s : 'quelques secondes',
            ss : '%d secondes',
            m : 'une minute',
            mm : '%d minutes',
            h : 'une heure',
            hh : '%d heures',
            d : 'un jour',
            dd : '%d jours',
            M : 'un mois',
            MM : '%d mois',
            y : 'un an',
            yy : '%d ans'
        },
        dayOfMonthOrdinalParse: /\d{1,2}(er|)/,
        ordinal : function (number, period) {
            switch (period) {
                // TODO: Return 'e' when day of month > 1. Move this case inside
                // block for masculine words below.
                // See https://github.com/moment/moment/issues/3375
                case 'D':
                    return number + (number === 1 ? 'er' : '');

                // Words with masculine grammatical gender: mois, trimestre, jour
                default:
                case 'M':
                case 'Q':
                case 'DDD':
                case 'd':
                    return number + (number === 1 ? 'er' : 'e');

                // Words with feminine grammatical gender: semaine
                case 'w':
                case 'W':
                    return number + (number === 1 ? 're' : 'e');
            }
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return fr;

})));

