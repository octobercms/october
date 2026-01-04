/*
 * This file has been compiled from: /modules/system/lang/it/client.php
 */
if (!window.oc) {
    window.oc = {};
}

if (!window.oc.langMessages) {
    window.oc.langMessages = {};
}

window.oc.langMessages['it'] = $.extend(
    window.oc.langMessages['it'] || {},
    {
    "markdowneditor": {
        "formatting": "Formattazione",
        "quote": "Citazione",
        "code": "Codice",
        "header1": "Titolo 1",
        "header2": "Titolo 2",
        "header3": "Titolo 3",
        "header4": "Titolo 4",
        "header5": "Titolo 5",
        "header6": "Titolo 6",
        "bold": "Grassetto",
        "italic": "Corsivo",
        "unorderedlist": "Elenco puntato",
        "orderedlist": "Elenco numerato",
        "snippet": "Snippet",
        "video": "Video",
        "image": "Immagine",
        "link": "Collegamento",
        "horizontalrule": "Inserisci linea orizzontale",
        "fullscreen": "Schermo intero",
        "preview": "Anteprima",
        "strikethrough": "Strikethrough",
        "cleanblock": "Clean Block",
        "table": "Table",
        "sidebyside": "Side by Side"
    },
    "mediamanager": {
        "insert_link": "Inserisci collegamento elemento multimediale",
        "insert_image": "Inserisci immagine",
        "insert_video": "Inserisci video",
        "insert_audio": "Inserisci audio",
        "invalid_file_empty_insert": "Si prega di selezionare un file di cui inserire il collegamento.",
        "invalid_file_single_insert": "Si prega di selezionare un singolo file.",
        "invalid_image_empty_insert": "Si prega di selezionare l\\'immagine/le immagini da inserire.",
        "invalid_video_empty_insert": "Si prega di selezionare un file video da inserire.",
        "invalid_audio_empty_insert": "Si prega di selezionare un file audio da inserire."
    },
    "alert": {
        "error": "Error",
        "confirm": "Confirm",
        "dismiss": "Dismiss",
        "confirm_button_text": "OK",
        "cancel_button_text": "Annulla",
        "widget_remove_confirm": "Rimuovere questo widget?"
    },
    "datepicker": {
        "previousMonth": "Mese precedente",
        "nextMonth": "Mese successivo",
        "months": [
            "Gennaio",
            "Febbraio",
            "Marzo",
            "Aprile",
            "Maggio",
            "Giugno",
            "Luglio",
            "Agosto",
            "Settembre",
            "Ottobre",
            "Novembre",
            "Dicembre"
        ],
        "weekdays": [
            "Domenica",
            "Luned\u00ec",
            "Marted\u00ec",
            "Mercoled\u00ec",
            "Gioved\u00ec",
            "Venerd\u00ec",
            "Sabato"
        ],
        "weekdaysShort": [
            "Dom",
            "Lun",
            "Mar",
            "Mer",
            "Gio",
            "Ven",
            "Sab"
        ]
    },
    "colorpicker": {
        "choose": "OK"
    },
    "filter": {
        "group": {
            "all": "tutti"
        },
        "scopes": {
            "apply_button_text": "Applica",
            "clear_button_text": "Rimuovi"
        },
        "dates": {
            "all": "tutte",
            "filter_button_text": "Filtra",
            "reset_button_text": "Reimposta",
            "date_placeholder": "Data",
            "after_placeholder": "Dopo",
            "before_placeholder": "Prima"
        },
        "numbers": {
            "all": "tutti",
            "filter_button_text": "Filtra",
            "reset_button_text": "Reset",
            "min_placeholder": "Min",
            "max_placeholder": "Max",
            "number_placeholder": "N\u00famero"
        }
    },
    "eventlog": {
        "show_stacktrace": "Visualizza la traccia dello stack",
        "hide_stacktrace": "Nascondi la traccia dello stack",
        "tabs": {
            "formatted": "Formattato",
            "raw": "Grezzo"
        },
        "editor": {
            "title": "Editor codice sorgente",
            "description": "Il tuo sistema operativo deve essere configurato per ascoltare uno di questi schemi URL.",
            "openWith": "Apri con",
            "remember_choice": "Ricorda l'opzione selezionata per questa sessione",
            "open": "Apri",
            "cancel": "Annulla",
            "rememberChoice": "Recuerde la opci\u00f3n seleccionada para esta sesi\u00f3n del navegador"
        }
    },
    "upload": {
        "max_files": "You can not upload any more files.",
        "invalid_file_type": "You can't upload files of this type.",
        "file_too_big": "File is too big ({{filesize}}MB). Max filesize: {{maxFilesize}}MB.",
        "response_error": "Server responded with {{statusCode}} code.",
        "remove_file": "Remove file"
    },
    "inspector": {
        "add": "Add",
        "remove": "Remove",
        "key": "Key",
        "value": "Value",
        "ok": "OK",
        "cancel": "Cancel",
        "items": "Items"
    },
    "dashboard": {
        "widget_data_source": "Data source",
        "widget_data_source_required": "Please select a data source",
        "widget_dimension": "Dimension",
        "widget_dimension_required": "Please select a dimension",
        "widget_metric": "Metric",
        "widget_metric_required": "Please select metric(s).",
        "widget_metrics": "Metrics",
        "widget_title": "Title",
        "widget_title_required": "Please provide the widget title",
        "widget_title_optional_placeholder": "Leave empty to hide the title",
        "widget_metric_value": "Value",
        "widget_icon_status": "Icon Status",
        "widget_href": "Link URL",
        "widget_icon": "Icon",
        "widget_icon_required": "Please select an icon",
        "widget_link_text": "Link Text",
        "apply": "Apply",
        "delete": "Delete",
        "configure": "Configure",
        "section_show_interval": "Show Date Interval",
        "widget_chart_type": "Chart type",
        "widget_chart_type_bar": "Bar",
        "widget_chart_type_stacked_bar": "Stacked Bar",
        "widget_chart_type_line": "Line",
        "sort_by": "Sort by",
        "sort_by_required": "Select sorting metric or dimension",
        "sort_by_placeholder": "Select a dimension and metrics",
        "sort_order": "Order",
        "sort_asc": "Ascending",
        "sort_desc": "Descending",
        "group_sorting": "Sorting",
        "value_not_set": "[not set]",
        "limit": "Limit",
        "limit_placeholder": "Display all records",
        "limit_number": "Enter a positive number or leave empty to display all records.",
        "limit_min": "The limit value must be at least 1",
        "empty_values": "Empty values",
        "empty_values_hide": "Hide",
        "empty_values_display_not_set": "Display [not set]",
        "empty_values_dimension": "Dimension",
        "date_interval": "Date interval",
        "date_interval_dashboard_default": "Dashboard interval",
        "date_interval_this_week": "This week",
        "date_interval_this_month": "This month",
        "date_interval_this_quarter": "This quarter",
        "date_interval_this_year": "This year",
        "date_interval_past_hour": "Past hour",
        "date_interval_past_days": "Past X days",
        "date_interval_past_days_value": "Number of days",
        "date_interval_past_days_invalid": "Enter a positive number",
        "prop_date_interval": "Display",
        "date_interval_past_days_placeholder": "1 day (today) if not set",
        "widget_bar_direction": "Direction",
        "widget_bar_direction_vertical": "Vertical",
        "widget_bar_direction_horizontal": "Horizontal",
        "prop_color": "Color",
        "color_required": "Select the metric color",
        "tab_general": "General",
        "tab_sorting_filtering": "Sorting & Filtering",
        "prop_records_per_page": "Records per page",
        "records_per_page_placeholder": "Leave empty to disable pagination",
        "records_per_page_invalid": "Enter a positive number or leave empty to display all records.",
        "prop_display_totals": "Display totals",
        "prop_display_relative_bar": "Display relative bars",
        "prop_extra_table_fields": "Extra table fields",
        "filter_operation_equal_to": "Equal to",
        "filter_operation_greater_equal": "Greater or equal to",
        "filter_operation_less_equal": "Less or equal to",
        "filter_operation_greater": "Greater than",
        "filter_operation_less": "Less than",
        "filter_operation_starts_with": "Starts with",
        "filter_operation_includes": "Includes",
        "filter_operation_one_of": "One of",
        "prop_operation": "Operation",
        "prop_value": "Value",
        "prop_values": "Values",
        "prop_values_one_per_line": "One value per line",
        "prop_filter_attribute": "Attribute",
        "filter_select_attribute": "Select an attribute",
        "filter_select_operation": "Select an operation",
        "prop_filters": "Filters",
        "icon_status_info": "Information",
        "icon_status_important": "Important",
        "icon_status_success": "Success",
        "icon_status_warning": "Warning",
        "icon_status_disabled": "Disabled",
        "range_today": "Today",
        "range_yesterday": "Yesterday",
        "range_last_7_days": "Last 7 days",
        "range_last_30_days": "Last 30 days",
        "range_this_month": "This month",
        "range_last_month": "Last month",
        "range_this_quarter": "This quarter",
        "range_this_year": "This year",
        "range_this_week": "This week",
        "interval_day": "Day",
        "interval_week": "Week",
        "interval_month": "Month",
        "interval_quarter": "Quarter",
        "interval_year": "Year",
        "compare_totals": "Compare Totals",
        "compare_prev_period": "Prev period",
        "compare_prev_year": "Same period last year",
        "compare_none": "Disabled",
        "updated_successfully": "The dashboard was successfully updated.",
        "edit_dashboard": "Edit Dashboard",
        "make_default": "Make Default",
        "make_default_confirm": "Set the current layout as the default?",
        "make_default_successfully": "This dashboard is now the default layout.",
        "reset_layout": "Reset Layout",
        "reset_layout_confirm": "Reset layout back to default?",
        "reset_layout_successfully": "The dashboard layout has been reset to default.",
        "manage_dashboards": "Manage Dashboards",
        "import_success": "The dashboard was successfully imported",
        "new_dashboard": "New Dashboard",
        "import_dashboard": "Import Dashboard",
        "delete_confirm": "Delete the dashboard? This action cannot be reversed. All users with access will be affected.",
        "delete_success": "The dashboard was successfully deleted.",
        "menu_item_custom": "Custom",
        "menu_item_delete_row": "Delete row",
        "widget_type_indicator": "Indicator",
        "widget_type_section_title": "Section Title",
        "widget_type_notice": "Text Notice",
        "widget_type_chart": "Chart",
        "widget_type_table": "Table",
        "notice_text": "Notice text"
    }
}
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


/*! Select2 4.1.0-rc.0 | https://github.com/select2/select2/blob/master/LICENSE.md */

!function(){if(jQuery&&jQuery.fn&&jQuery.fn.select2&&jQuery.fn.select2.amd)var e=jQuery.fn.select2.amd;e.define("select2/i18n/it",[],function(){return{errorLoading:function(){return"I risultati non possono essere caricati."},inputTooLong:function(e){var n=e.input.length-e.maximum,t="Per favore cancella "+n+" caratter";return t+=1!==n?"i":"e"},inputTooShort:function(e){return"Per favore inserisci "+(e.minimum-e.input.length)+" o più caratteri"},loadingMore:function(){return"Caricando più risultati…"},maximumSelected:function(e){var n="Puoi selezionare solo "+e.maximum+" element";return 1!==e.maximum?n+="i":n+="o",n},noResults:function(){return"Nessun risultato trovato"},searching:function(){return"Sto cercando…"},removeAllItems:function(){return"Rimuovi tutti gli oggetti"}}}),e.define,e.require}();

/*!
 * Froala Editor for October CMS
 */

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function( root, jQuery ) {
            if ( jQuery === undefined ) {
                // require('jQuery') returns a factory that requires window to
                // build a jQuery instance, we normalize how we use modules
                // that require this pattern but the window provided is a noop
                // if it's defined (how jquery works)
                if ( typeof window !== 'undefined' ) {
                    jQuery = require('jquery');
                }
                else {
                    jQuery = require('jquery')(root);
                }
            }
            return factory(jQuery);
        };
    } else {
        // Browser globals
        factory(window.jQuery);
    }
}(function ($) {
/**
 * Italian
 */

if (!$.FE_LANGUAGE) {
    $.FE_LANGUAGE = {};
}

$.FE_LANGUAGE['it'] = {
  translation: {
    // Place holder
    "Type something": "Digita qualcosa",

    // Basic formatting
    "Bold": "Grassetto",
    "Italic": "Corsivo",
    "Underline": "Sottolineato",
    "Strikethrough": "Barrato",

    // Main buttons
    "Insert": "Inserisci",
    "Delete": "Cancella",
    "Cancel": "Cancella",
    "OK": "OK",
    "Back": "Indietro",
    "Remove": "Rimuovi",
    "More": "Di pi\u00f9",
    "Update": "Aggiorna",
    "Style": "Stile",

    // Font
    "Font Family": "Carattere",
    "Font Size": "Dimensione Carattere",

    // Colors
    "Colors": "Colori",
    "Background": "Sfondo",
    "Text": "Testo",
    "HEX Color": "Colore Esadecimale",

    // Paragraphs
    "Paragraph Format": "Formattazione",
    "Normal": "Normale",
    "Code": "Codice",
    "Heading 1": "Intestazione 1",
    "Heading 2": "Intestazione 2",
    "Heading 3": "Intestazione 3",
    "Heading 4": "Intestazione 4",

    // Style
    "Paragraph Style": "Stile Paragrafo",
    "Inline Style": "Stile in Linea",

    // Alignment
    "Align": "Allinea",
    "Align Left": "Allinea a Sinistra",
    "Align Center": "Allinea al Cento",
    "Align Right": "Allinea a Destra",
    "Align Justify": "Giustifica",
    "None": "Nessuno",

    // Lists
    "Ordered List": "Elenchi Numerati",
    "Default": "Predefinito",
    "Lower Alpha": "Alfa inferiore",
    "Lower Greek": "Basso greco",
    "Lower Roman": "Romano inferiore",
    "Upper Alpha": "Alfa superiore",
    "Upper Roman": "Alto romano",

    "Unordered List": "Elenchi Puntati",
    "Circle": "Cerchio",
    "Disc": "Disco",
    "Square": "Piazza",

    // Line height
    "Line Height": "Altezza della linea",
    "Single": "Singolo",
    "Double": "Doppio",

    // Indent
    "Decrease Indent": "Riduci Rientro",
    "Increase Indent": "Aumenta Rientro",

    // Links
    "Insert Link": "Inserisci Link",
    "Open in new tab": "Apri in nuova scheda",
    "Open Link": "Apri Link",
    "Edit Link": "Modifica Link",
    "Unlink": "Rimuovi Link",
    "Choose Link": "Scegli Link",

    // Images
    "Insert Image": "Inserisci Immagine",
    "Upload Image": "Carica Immagine",
    "By URL": "Inserisci URL",
    "Browse": "Sfoglia",
    "Drop image": "Rilascia immagine",
    "or click": "oppure clicca qui",
    "Manage Images": "Gestione Immagini",
    "Loading": "Caricamento",
    "Deleting": "Eliminazione",
    "Tags": "Etichetta",
    "Are you sure? Image will be deleted.": "Sei sicuro? L\'immagine verr\u00e0 cancellata.",
    "Replace": "Sostituisci",
    "Uploading": "Caricamento",
    "Loading image": "Caricamento immagine",
    "Display": "Visualizzazione",
    "Inline": "In Linea",
    "Break Text": "Separa dal Testo",
    "Alternative Text": "Testo Alternativo",
    "Change Size": "Cambia Dimensioni",
    "Width": "Larghezza",
    "Height": "Altezza",
    "Something went wrong. Please try again.": "Qualcosa non ha funzionato. Riprova, per favore.",
    "Image Caption": "Didascalia",
    "Advanced Edit": "Avanzato",

    // Video
    "Insert Video": "Inserisci Video",
    "Embedded Code": "Codice Incorporato",
    "Paste in a video URL": "Incolla l'URL del video",
    "Drop video": "Rilascia video",
    "Your browser does not support HTML5 video.": "Il tuo browser non supporta i video html5.",
    "Upload Video": "Carica Video",

    // Tables
    "Insert Table": "Inserisci Tabella",
    "Table Header": "Intestazione Tabella",
    "Remove Table": "Rimuovi Tabella",
    "Table Style": "Stile Tabella",
    "Horizontal Align": "Allineamento Orizzontale",
    "Row": "Riga",
    "Insert row above": "Inserisci una riga prima",
    "Insert row below": "Inserisci una riga dopo",
    "Delete row": "Cancella riga",
    "Column": "Colonna",
    "Insert column before": "Inserisci una colonna prima",
    "Insert column after": "Inserisci una colonna dopo",
    "Delete column": "Cancella colonna",
    "Cell": "Cella",
    "Merge cells": "Unisci celle",
    "Horizontal split": "Dividi in orizzontale",
    "Vertical split": "Dividi in verticale",
    "Cell Background": "Sfondo Cella",
    "Vertical Align": "Allineamento Verticale",
    "Top": "Alto",
    "Middle": "Centro",
    "Bottom": "Basso",
    "Align Top": "Allinea in Alto",
    "Align Middle": "Allinea al Centro",
    "Align Bottom": "Allinea in Basso",
    "Cell Style": "Stile Cella",

    // Files
    "Upload File": "Carica File",
    "Drop file": "Rilascia file",

    // Emoticons
    "Emoticons": "Emoticon",
    "Grinning face": "Sorridente",
    "Grinning face with smiling eyes": "Sorridente con gli occhi sorridenti",
    "Face with tears of joy": "Con lacrime di gioia",
    "Smiling face with open mouth": "Sorridente con la bocca aperta",
    "Smiling face with open mouth and smiling eyes": "Sorridente con la bocca aperta e gli occhi sorridenti",
    "Smiling face with open mouth and cold sweat": "Sorridente con la bocca aperta e sudore freddo",
    "Smiling face with open mouth and tightly-closed eyes": "Sorridente con la bocca aperta e gli occhi stretti",
    "Smiling face with halo": "Sorridente con aureola",
    "Smiling face with horns": "Diavolo sorridente",
    "Winking face": "Ammiccante",
    "Smiling face with smiling eyes": "Sorridente imbarazzato",
    "Face savoring delicious food": "Goloso",
    "Relieved face": "Rassicurato",
    "Smiling face with heart-shaped eyes": "Sorridente con gli occhi a forma di cuore",
    "Smiling face with sunglasses": "Sorridente con gli occhiali da sole",
    "Smirking face": "Compiaciuto",
    "Neutral face": "Neutro",
    "Expressionless face": "Inespressivo",
    "Unamused face": "Annoiato",
    "Face with cold sweat": "Sudare freddo",
    "Pensive face": "Pensieroso",
    "Confused face": "Perplesso",
    "Confounded face": "Confuso",
    "Kissing face": "Bacio",
    "Face throwing a kiss": "Manda un bacio",
    "Kissing face with smiling eyes": "Bacio con gli occhi sorridenti",
    "Kissing face with closed eyes": "Bacio con gli occhi chiusi",
    "Face with stuck out tongue": "Linguaccia",
    "Face with stuck out tongue and winking eye": "Linguaccia ammiccante",
    "Face with stuck out tongue and tightly-closed eyes": "Linguaccia con occhi stretti",
    "Disappointed face": "Deluso",
    "Worried face": "Preoccupato",
    "Angry face": "Arrabbiato",
    "Pouting face": "Imbronciato",
    "Crying face": "Pianto",
    "Persevering face": "Perseverante",
    "Face with look of triumph": "Trionfante",
    "Disappointed but relieved face": "Deluso ma rassicurato",
    "Frowning face with open mouth": "Accigliato con la bocca aperta",
    "Anguished face": "Angosciato",
    "Fearful face": "Pauroso",
    "Weary face": "Stanco",
    "Sleepy face": "Assonnato",
    "Tired face": "Snervato",
    "Grimacing face": "Smorfia",
    "Loudly crying face": "Pianto a gran voce",
    "Face with open mouth": "Bocca aperta",
    "Hushed face": "Silenzioso",
    "Face with open mouth and cold sweat": "Bocca aperta e sudore freddo",
    "Face screaming in fear": "Urlante dalla paura",
    "Astonished face": "Stupito",
    "Flushed face": "Arrossito",
    "Sleeping face": "Addormentato",
    "Dizzy face": "Stordito",
    "Face without mouth": "Senza parole",
    "Face with medical mask": "Malattia infettiva",

    // Line breaker
    "Break": "Separatore",

    // Math
    "Subscript": "Pedice",
    "Superscript": "Apice",

    // Full screen
    "Fullscreen": "Schermo intero",

    // Horizontal line
    "Insert Horizontal Line": "Inserisci Divisore Orizzontale",

    // Clear formatting
    "Clear Formatting": "Cancella Formattazione",

    // Save
    "Save": "Salvare",

    // Undo, redo
    "Undo": "Annulla",
    "Redo": "Ripeti",

    // Select all
    "Select All": "Seleziona Tutto",

    // Code view
    "Code View": "Visualizza Codice",

    // Quote
    "Quote": "Citazione",
    "Increase": "Aumenta",
    "Decrease": "Diminuisci",

    // Quick Insert
    "Quick Insert": "Inserimento Rapido",

    // Spcial Characters
    "Special Characters": "Caratteri Speciali",
    "Latin": "Latino",
    "Greek": "Greco",
    "Cyrillic": "Cirillico",
    "Punctuation": "Punteggiatura",
    "Currency": "Valuta",
    "Arrows": "Frecce",
    "Math": "Matematica",
    "Misc": "Misc",

    // Print.
    "Print": "Stampa",

    // Spell Checker.
    "Spell Checker": "Correttore Ortografico",

    // Help
    "Help": "Aiuto",
    "Shortcuts": "Scorciatoie",
    "Inline Editor": "Editor in Linea",
    "Show the editor": "Mostra Editor",
    "Common actions": "Azioni comuni",
    "Copy": "Copia",
    "Cut": "Taglia",
    "Paste": "Incolla",
    "Basic Formatting": "Formattazione di base",
    "Increase quote level": "Aumenta il livello di citazione",
    "Decrease quote level": "Diminuisci il livello di citazione",
    "Image / Video": "Immagine / Video",
    "Resize larger": "Pi\u00f9 grande",
    "Resize smaller": "Pi\u00f9 piccolo",
    "Table": "Tabella",
    "Select table cell": "Seleziona la cella della tabella",
    "Extend selection one cell": "Estendi la selezione di una cella",
    "Extend selection one row": "Estendi la selezione una riga",
    "Navigation": "Navigazione",
    "Focus popup / toolbar": "Metti a fuoco la barra degli strumenti",
    "Return focus to previous position": "Rimetti il fuoco sulla posizione precedente",

    // Embed.ly
    "Embed URL": "Incorpora URL",
    "Paste in a URL to embed": "Incolla un URL da incorporare",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "Il contenuto incollato proviene da un documento di Microsoft Word. Vuoi mantenere la formattazione di Word o pulirlo?",
    "Keep": "Mantieni",
    "Clean": "Pulisci",
    "Word Paste Detected": "\u00c8 stato rilevato un incolla da Word"
  },
  direction: "ltr"
};

}));

