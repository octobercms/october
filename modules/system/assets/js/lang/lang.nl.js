/*
 * This file has been compiled from: /modules/system/lang/nl/client.php
 */
if (!window.oc) {
    window.oc = {};
}

if (!window.oc.langMessages) {
    window.oc.langMessages = {};
}

window.oc.langMessages['nl'] = $.extend(
    window.oc.langMessages['nl'] || {},
    {
    "markdowneditor": {
        "formatting": "Opmaak",
        "quote": "Quote",
        "code": "Code",
        "header1": "Koptekst 1",
        "header2": "Koptekst 2",
        "header3": "Koptekst 3",
        "header4": "Koptekst 4",
        "header5": "Koptekst 5",
        "header6": "Koptekst 6",
        "bold": "Vet",
        "italic": "Cursief",
        "unorderedlist": "Ongeordende lijst",
        "orderedlist": "Gerangschikte lijst",
        "snippet": "Snippet",
        "video": "Video",
        "image": "Afbeelding",
        "link": "Hyperlink",
        "horizontalrule": "Invoegen horizontale lijn",
        "fullscreen": "Volledig scherm",
        "preview": "Voorbeeldweergave",
        "strikethrough": "Doorhalen",
        "cleanblock": "Blok opschonen",
        "table": "Tabel",
        "sidebyside": "Zij aan zij"
    },
    "mediamanager": {
        "insert_link": "Media Link invoegen",
        "insert_image": "Media Afbeelding invoegen",
        "insert_video": "Media Video invoegen",
        "insert_audio": "Media Audio invoegen",
        "invalid_file_empty_insert": "Selecteer bestand om een link naar te maken.",
        "invalid_file_single_insert": "Selecteer \u00e9\u00e9n bestand.",
        "invalid_image_empty_insert": "Selecteer afbeelding(en) om in te voegen.",
        "invalid_video_empty_insert": "Selecteer een video bestand om in te voegen.",
        "invalid_audio_empty_insert": "Selecteer een audio bestand om in te voegen."
    },
    "alert": {
        "error": "Fout",
        "confirm": "Bevestigen",
        "dismiss": "Afwijzen",
        "confirm_button_text": "OK",
        "cancel_button_text": "Annuleren",
        "widget_remove_confirm": "Deze widget verwijderen?"
    },
    "datepicker": {
        "previousMonth": "Vorige maand",
        "nextMonth": "Volgende maan",
        "months": [
            "Januari",
            "Februari",
            "Maart",
            "April",
            "Mei",
            "Juni",
            "Juli",
            "Augustus",
            "September",
            "Oktober",
            "November",
            "December"
        ],
        "weekdays": [
            "Zondag",
            "Maandag",
            "Dinsdag",
            "Woensdag",
            "Donderdag",
            "Vrijdag",
            "Zaterdag"
        ],
        "weekdaysShort": [
            "Zo",
            "Ma",
            "Di",
            "Wo",
            "Do",
            "Vr",
            "Za"
        ]
    },
    "colorpicker": {
        "choose": "OK"
    },
    "filter": {
        "group": {
            "all": "alle"
        },
        "scopes": {
            "apply_button_text": "Toepassen",
            "clear_button_text": "Resetten"
        },
        "dates": {
            "all": "alle",
            "filter_button_text": "Filteren",
            "reset_button_text": "Resetten",
            "date_placeholder": "Datum",
            "after_placeholder": "Na",
            "before_placeholder": "Voor"
        },
        "numbers": {
            "all": "alle",
            "filter_button_text": "Filteren",
            "reset_button_text": "Resetten",
            "min_placeholder": "Minimum",
            "max_placeholder": "Maximum",
            "number_placeholder": "N\u00famero"
        }
    },
    "eventlog": {
        "show_stacktrace": "Toon stacktrace",
        "hide_stacktrace": "Verberg stacktrace",
        "tabs": {
            "formatted": "Geformatteerd",
            "raw": "Bronversie"
        },
        "editor": {
            "title": "Broncode editor",
            "description": "Je besturingssysteem moet in staat zijn om met deze URL-schema's om te kunnen gaan.",
            "openWith": "Openen met",
            "remember_choice": "Onthoudt de geselecteerde optie voor deze browser-sessie",
            "open": "Openen",
            "cancel": "Annuleren",
            "rememberChoice": "Onthoud de optie die voor deze browsersessie is geselecteerd"
        }
    },
    "upload": {
        "max_files": "Je kan niet meer bestanden uploaden.",
        "invalid_file_type": "Je kan geen bestanden van dit type uploaden.",
        "file_too_big": "Het bestand is te groot ({{filesize}}MB). Maximale bestandsgrootte: {{maxFilesize}}MB.",
        "response_error": "De server reageerde met de code {{statusCode}}.",
        "remove_file": "Verwijder bestand"
    },
    "inspector": {
        "add": "Toevoegen",
        "remove": "Verwijderen",
        "key": "Sleutel",
        "value": "Waarde",
        "ok": "Ok",
        "cancel": "Annuleren",
        "items": "Items"
    },
    "dashboard": {
        "widget_data_source": "Gegevensbron",
        "widget_data_source_required": "Selecteer een gegevensbron",
        "widget_dimension": "Dimensie",
        "widget_dimension_required": "Selecteer een dimensie",
        "widget_metric": "Maatstaf",
        "widget_metric_required": "Selecteer maatstaf(en).",
        "widget_metrics": "Maatstaven",
        "widget_title": "Titel",
        "widget_title_required": "Geef de widgettitel op",
        "widget_title_optional_placeholder": "Laat leeg om de titel te verbergen",
        "widget_metric_value": "Waarde",
        "widget_icon_status": "Pictogramstatus",
        "widget_href": "Link-URL",
        "widget_icon": "Pictogram",
        "widget_icon_required": "Selecteer een pictogram",
        "widget_link_text": "Linktekst",
        "apply": "Toepassen",
        "delete": "Verwijderen",
        "configure": "Configureren",
        "section_show_interval": "Datuminterval weergeven",
        "widget_chart_type": "Grafiektype",
        "widget_chart_type_bar": "Staaf",
        "widget_chart_type_stacked_bar": "Gestapelde staaf",
        "widget_chart_type_line": "Lijn",
        "sort_by": "Sorteren op",
        "sort_by_required": "Selecteer sorteermaatstaf of dimensie",
        "sort_by_placeholder": "Selecteer een dimensie en maatstaven",
        "sort_order": "Volgorde",
        "sort_asc": "Oplopend",
        "sort_desc": "Aflopend",
        "group_sorting": "Sortering",
        "value_not_set": "[niet ingesteld]",
        "limit": "Limiet",
        "limit_placeholder": "Alle records weergeven",
        "limit_number": "Voer een positief getal in of laat leeg om alle records weer te geven.",
        "limit_min": "De limietwaarde moet minimaal 1 zijn",
        "empty_values": "Lege waarden",
        "empty_values_hide": "Verbergen",
        "empty_values_display_not_set": "Toon [niet ingesteld]",
        "empty_values_dimension": "Dimensie",
        "date_interval": "Datuminterval",
        "date_interval_dashboard_default": "Dashboard-interval",
        "date_interval_this_week": "Deze week",
        "date_interval_this_month": "Deze maand",
        "date_interval_this_quarter": "Dit kwartaal",
        "date_interval_this_year": "Dit jaar",
        "date_interval_past_hour": "Afgelopen uur",
        "date_interval_past_days": "Afgelopen X dagen",
        "date_interval_past_days_value": "Aantal dagen",
        "date_interval_past_days_invalid": "Voer een positief getal in",
        "prop_date_interval": "Weergave",
        "date_interval_past_days_placeholder": "1 dag (vandaag) indien niet ingesteld",
        "widget_bar_direction": "Richting",
        "widget_bar_direction_vertical": "Verticaal",
        "widget_bar_direction_horizontal": "Horizontaal",
        "prop_color": "Kleur",
        "color_required": "Selecteer de kleur van de maatstaf",
        "tab_general": "Algemeen",
        "tab_sorting_filtering": "Sorteren & Filteren",
        "prop_records_per_page": "Records per pagina",
        "records_per_page_placeholder": "Laat leeg om paginering uit te schakelen",
        "records_per_page_invalid": "Voer een positief getal in of laat leeg om alle records weer te geven.",
        "prop_display_totals": "Totalen weergeven",
        "prop_display_relative_bar": "Relatieve staven weergeven",
        "prop_extra_table_fields": "Extra tabelvelden",
        "filter_operation_equal_to": "Gelijk aan",
        "filter_operation_greater_equal": "Groter dan of gelijk aan",
        "filter_operation_less_equal": "Kleiner dan of gelijk aan",
        "filter_operation_greater": "Groter dan",
        "filter_operation_less": "Kleiner dan",
        "filter_operation_starts_with": "Begint met",
        "filter_operation_includes": "Bevat",
        "filter_operation_one_of": "Een van",
        "prop_operation": "Bewerking",
        "prop_value": "Waarde",
        "prop_values": "Waarden",
        "prop_values_one_per_line": "Eén waarde per regel",
        "prop_filter_attribute": "Attribuut",
        "filter_select_attribute": "Selecteer een attribuut",
        "filter_select_operation": "Selecteer een bewerking",
        "prop_filters": "Filters",
        "icon_status_info": "Informatie",
        "icon_status_important": "Belangrijk",
        "icon_status_success": "Succes",
        "icon_status_warning": "Waarschuwing",
        "icon_status_disabled": "Uitgeschakeld",
        "range_today": "Vandaag",
        "range_yesterday": "Gisteren",
        "range_last_7_days": "Afgelopen 7 dagen",
        "range_last_30_days": "Afgelopen 30 dagen",
        "range_this_month": "Deze maand",
        "range_last_month": "Vorige maand",
        "range_this_quarter": "Dit kwartaal",
        "range_this_year": "Dit jaar",
        "range_this_week": "Deze week",
        "interval_day": "Dag",
        "interval_week": "Week",
        "interval_month": "Maand",
        "interval_quarter": "Kwartaal",
        "interval_year": "Jaar",
        "compare_totals": "Totalen vergelijken",
        "compare_prev_period": "Vorige periode",
        "compare_prev_year": "Zelfde periode vorig jaar",
        "compare_none": "Uitgeschakeld",
        "updated_successfully": "Het dashboard is succesvol bijgewerkt.",
        "edit_dashboard": "Dashboard bewerken",
        "manage_dashboards": "Dashboards beheren",
        "import_success": "Het dashboard is succesvol geïmporteerd",
        "new_dashboard": "Nieuw dashboard",
        "import_dashboard": "Dashboard importeren",
        "delete_confirm": "Dashboard verwijderen? Deze actie kan niet ongedaan worden gemaakt. Alle gebruikers met toegang worden beïnvloed.",
        "delete_success": "Het dashboard is succesvol verwijderd.",
        "menu_item_custom": "Aangepast",
        "menu_item_delete_row": "Rij verwijderen",
        "widget_type_indicator": "Indicator",
        "widget_type_section_title": "Sectietitel",
        "widget_type_notice": "Tekstbericht",
        "widget_type_chart": "Grafiek",
        "widget_type_table": "Tabel",
        "notice_text": "Berichttekst"
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


    var monthsShortWithDots = 'jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.'.split('_'),
        monthsShortWithoutDots = 'jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec'.split('_');

    var monthsParse = [/^jan/i, /^feb/i, /^maart|mrt.?$/i, /^apr/i, /^mei$/i, /^jun[i.]?$/i, /^jul[i.]?$/i, /^aug/i, /^sep/i, /^okt/i, /^nov/i, /^dec/i];
    var monthsRegex = /^(januari|februari|maart|april|mei|april|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;

    var nl = moment.defineLocale('nl', {
        months : 'januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december'.split('_'),
        monthsShort : function (m, format) {
            if (!m) {
                return monthsShortWithDots;
            } else if (/-MMM-/.test(format)) {
                return monthsShortWithoutDots[m.month()];
            } else {
                return monthsShortWithDots[m.month()];
            }
        },

        monthsRegex: monthsRegex,
        monthsShortRegex: monthsRegex,
        monthsStrictRegex: /^(januari|februari|maart|mei|ju[nl]i|april|augustus|september|oktober|november|december)/i,
        monthsShortStrictRegex: /^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,

        monthsParse : monthsParse,
        longMonthsParse : monthsParse,
        shortMonthsParse : monthsParse,

        weekdays : 'zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag'.split('_'),
        weekdaysShort : 'zo._ma._di._wo._do._vr._za.'.split('_'),
        weekdaysMin : 'zo_ma_di_wo_do_vr_za'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD-MM-YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay: '[vandaag om] LT',
            nextDay: '[morgen om] LT',
            nextWeek: 'dddd [om] LT',
            lastDay: '[gisteren om] LT',
            lastWeek: '[afgelopen] dddd [om] LT',
            sameElse: 'L'
        },
        relativeTime : {
            future : 'over %s',
            past : '%s geleden',
            s : 'een paar seconden',
            ss : '%d seconden',
            m : 'één minuut',
            mm : '%d minuten',
            h : 'één uur',
            hh : '%d uur',
            d : 'één dag',
            dd : '%d dagen',
            M : 'één maand',
            MM : '%d maanden',
            y : 'één jaar',
            yy : '%d jaar'
        },
        dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
        ordinal : function (number) {
            return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de');
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return nl;

})));


/*! Select2 4.1.0-rc.0 | https://github.com/select2/select2/blob/master/LICENSE.md */

!function(){if(jQuery&&jQuery.fn&&jQuery.fn.select2&&jQuery.fn.select2.amd)var e=jQuery.fn.select2.amd;e.define("select2/i18n/nl",[],function(){return{errorLoading:function(){return"De resultaten konden niet worden geladen."},inputTooLong:function(e){return"Gelieve "+(e.input.length-e.maximum)+" karakters te verwijderen"},inputTooShort:function(e){return"Gelieve "+(e.minimum-e.input.length)+" of meer karakters in te voeren"},loadingMore:function(){return"Meer resultaten laden…"},maximumSelected:function(e){var n=1==e.maximum?"kan":"kunnen",r="Er "+n+" maar "+e.maximum+" item";return 1!=e.maximum&&(r+="s"),r+=" worden geselecteerd"},noResults:function(){return"Geen resultaten gevonden…"},searching:function(){return"Zoeken…"},removeAllItems:function(){return"Verwijder alle items"}}}),e.define,e.require}();

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
 * Dutch
 */

if (!$.FE_LANGUAGE) {
    $.FE_LANGUAGE = {};
}

$.FE_LANGUAGE['nl'] = {
  translation: {
    // Place holder
    "Type something": "Typ iets",

    // Basic formatting
    "Bold": "Vet",
    "Italic": "Cursief",
    "Underline": "Onderstreept",
    "Strikethrough": "Doorhalen",

    // Main buttons
    "Insert": "Invoegen",
    "Delete": "Verwijder",
    "Cancel": "Annuleren",
    "OK": "Ok\u00e9",
    "Back": "Terug",
    "Remove": "Verwijderen",
    "More": "Meer",
    "Update": "Bijwerken",
    "Style": "Stijl",

    // Font
    "Font Family": "Lettertype",
    "Font Size": "Lettergrootte",

    // Colors
    "Colors": "Kleuren",
    "Background": "Achtergrond",
    "Text": "Tekst",
    "HEX Color": "HEX kleur",

    // Paragraphs
    "Paragraph Format": "Opmaak",
    "Normal": "Normaal",
    "Code": "Code",
    "Heading 1": "Kop 1",
    "Heading 2": "Kop 2",
    "Heading 3": "Kop 3",
    "Heading 4": "Kop 4",

    // Style
    "Paragraph Style": "Paragraaf stijl",
    "Inline Style": "Inline stijl",

    // Alignment
    "Align": "Uitlijnen",
    "Align Left": "Links uitlijnen",
    "Align Center": "Centreren",
    "Align Right": "Rechts uitlijnen",
    "Align Justify": "Uitvullen",
    "None": "Geen",

    // Lists
    "Ordered List": "Geordende lijst",
    "Default": "Standaard",
    "Lower Alpha": "Lagere alpha",
    "Lower Greek": "Lager Grieks",
    "Lower Roman": "Lager Romeins",
    "Upper Alpha": "Bovenste alfa",
    "Upper Roman": "Bovenste roman",

    "Unordered List": "Ongeordende lijst",
    "Circle": "Cirkel",
    "Disc": "Schijf",
    "Square": "Plein",

    // Line height
    "Line Height": "Lijnhoogte",
    "Single": "Single",
    "Double": "Dubbele",

    // Indent
    "Decrease Indent": "Inspringen verkleinen",
    "Increase Indent": "Inspringen vergroten",

    // Links
    "Insert Link": "Link invoegen",
    "Open in new tab": "Openen in nieuwe tab",
    "Open Link": "Open link",
    "Edit Link": "Link bewerken",
    "Unlink": "Link verwijderen",
    "Choose Link": "Link kiezen",

    // Images
    "Insert Image": "Afbeelding invoegen",
    "Upload Image": "Afbeelding uploaden",
    "By URL": "Via URL",
    "Browse": "Bladeren",
    "Drop image": "Sleep afbeelding",
    "or click": "of klik op",
    "Manage Images": "Afbeeldingen beheren",
    "Loading": "Bezig met laden",
    "Deleting": "Verwijderen",
    "Tags": "Labels",
    "Are you sure? Image will be deleted.": "Weet je het zeker? Afbeelding wordt verwijderd.",
    "Replace": "Vervangen",
    "Uploading": "Uploaden",
    "Loading image": "Afbeelding laden",
    "Display": "Tonen",
    "Inline": "Inline",
    "Break Text": "Tekst afbreken",
    "Alternative Text": "Alternatieve tekst",
    "Change Size": "Grootte wijzigen",
    "Width": "Breedte",
    "Height": "Hoogte",
    "Something went wrong. Please try again.": "Er is iets fout gegaan. Probeer opnieuw.",
    "Image Caption": "Afbeelding caption",
    "Advanced Edit": "Geavanceerd bewerken",

    // Video
    "Insert Video": "Video invoegen",
    "Embedded Code": "Ingebedde code",
    "Paste in a video URL": "Voeg een video-URL toe",
    "Drop video": "Sleep video",
    "Your browser does not support HTML5 video.": "Je browser ondersteunt geen html5-video.",
    "Upload Video": "Video uploaden",

    // Tables
    "Insert Table": "Tabel invoegen",
    "Table Header": "Tabel hoofd",
    "Remove Table": "Verwijder tabel",
    "Table Style": "Tabelstijl",
    "Horizontal Align": "Horizontale uitlijning",
    "Row": "Rij",
    "Insert row above": "Voeg rij boven toe",
    "Insert row below": "Voeg rij onder toe",
    "Delete row": "Verwijder rij",
    "Column": "Kolom",
    "Insert column before": "Voeg kolom in voor",
    "Insert column after": "Voeg kolom in na",
    "Delete column": "Verwijder kolom",
    "Cell": "Cel",
    "Merge cells": "Cellen samenvoegen",
    "Horizontal split": "Horizontaal splitsen",
    "Vertical split": "Verticaal splitsen",
    "Cell Background": "Cel achtergrond",
    "Vertical Align": "Verticale uitlijning",
    "Top": "Top",
    "Middle": "Midden",
    "Bottom": "Onder",
    "Align Top": "Uitlijnen top",
    "Align Middle": "Uitlijnen midden",
    "Align Bottom": "Onder uitlijnen",
    "Cell Style": "Celstijl",

    // Files
    "Upload File": "Bestand uploaden",
    "Drop file": "Sleep bestand",

    // Emoticons
    "Emoticons": "Emoticons",
    "Grinning face": "Grijnzend gezicht",
    "Grinning face with smiling eyes": "Grijnzend gezicht met lachende ogen",
    "Face with tears of joy": "Gezicht met tranen van vreugde",
    "Smiling face with open mouth": "Lachend gezicht met open mond",
    "Smiling face with open mouth and smiling eyes": "Lachend gezicht met open mond en lachende ogen",
    "Smiling face with open mouth and cold sweat": "Lachend gezicht met open mond en koud zweet",
    "Smiling face with open mouth and tightly-closed eyes": "Lachend gezicht met open mond en strak gesloten ogen",
    "Smiling face with halo": "Lachend gezicht met halo",
    "Smiling face with horns": "Lachend gezicht met hoorns",
    "Winking face": "Knipogend gezicht",
    "Smiling face with smiling eyes": "Lachend gezicht met lachende ogen",
    "Face savoring delicious food": "Gezicht genietend van heerlijk eten",
    "Relieved face": "Opgelucht gezicht",
    "Smiling face with heart-shaped eyes": "Glimlachend gezicht met hart-vormige ogen",
    "Smiling face with sunglasses": "Lachend gezicht met zonnebril",
    "Smirking face": "Grijnzende gezicht",
    "Neutral face": "Neutraal gezicht",
    "Expressionless face": "Uitdrukkingsloos gezicht",
    "Unamused face": "Niet geamuseerd gezicht",
    "Face with cold sweat": "Gezicht met koud zweet",
    "Pensive face": "Peinzend gezicht",
    "Confused face": "Verward gezicht",
    "Confounded face": "Beschaamd gezicht",
    "Kissing face": "Zoenend gezicht",
    "Face throwing a kiss": "Gezicht gooien van een kus",
    "Kissing face with smiling eyes": "Zoenend gezicht met lachende ogen",
    "Kissing face with closed eyes": "Zoenend gezicht met gesloten ogen",
    "Face with stuck out tongue": "Gezicht met uitstekende tong",
    "Face with stuck out tongue and winking eye": "Gezicht met uitstekende tong en knipoog",
    "Face with stuck out tongue and tightly-closed eyes": "Gezicht met uitstekende tong en strak-gesloten ogen",
    "Disappointed face": "Teleurgesteld gezicht",
    "Worried face": "Bezorgd gezicht",
    "Angry face": "Boos gezicht",
    "Pouting face": "Pruilend gezicht",
    "Crying face": "Huilend gezicht",
    "Persevering face": "Volhardend gezicht",
    "Face with look of triumph": "Gezicht met blik van triomf",
    "Disappointed but relieved face": "Teleurgesteld, maar opgelucht gezicht",
    "Frowning face with open mouth": "Fronsend gezicht met open mond",
    "Anguished face": "Gekweld gezicht",
    "Fearful face": "Angstig gezicht",
    "Weary face": "Vermoeid gezicht",
    "Sleepy face": "Slaperig gezicht",
    "Tired face": "Moe gezicht",
    "Grimacing face": "Grimassen trekkend gezicht",
    "Loudly crying face": "Luid schreeuwend gezicht",
    "Face with open mouth": "Gezicht met open mond",
    "Hushed face": "Tot zwijgen gebracht gezicht",
    "Face with open mouth and cold sweat": "Gezicht met open mond en koud zweet",
    "Face screaming in fear": "Gezicht schreeuwend van angst",
    "Astonished face": "Verbaasd gezicht",
    "Flushed face": "Blozend gezicht",
    "Sleeping face": "Slapend gezicht",
    "Dizzy face": "Duizelig gezicht",
    "Face without mouth": "Gezicht zonder mond",
    "Face with medical mask": "Gezicht met medisch masker",

    // Line breaker
    "Break": "Afbreken",

    // Math
    "Subscript": "Subscript",
    "Superscript": "Superscript",

    // Full screen
    "Fullscreen": "Volledig scherm",

    // Horizontal line
    "Insert Horizontal Line": "Horizontale lijn invoegen",

    // Clear formatting
    "Clear Formatting": "Verwijder opmaak",

    // Save
    "Save": "Opslaan",

    // Undo, redo
    "Undo": "Ongedaan maken",
    "Redo": "Opnieuw",

    // Select all
    "Select All": "Alles selecteren",

    // Code view
    "Code View": "Codeweergave",

    // Quote
    "Quote": "Citaat",
    "Increase": "Toenemen",
    "Decrease": "Afnemen",

    // Quick Insert
    "Quick Insert": "Snel invoegen",

    // Spcial Characters
    "Special Characters": "Speciale tekens",
    "Latin": "Latijns",
    "Greek": "Grieks",
    "Cyrillic": "Cyrillisch",
    "Punctuation": "Interpunctie",
    "Currency": "Valuta",
    "Arrows": "Pijlen",
    "Math": "Wiskunde",
    "Misc": "Misc",

    // Print.
    "Print": "Afdrukken",

    // Spell Checker.
    "Spell Checker": "Spellingscontrole",

    // Help
    "Help": "Hulp",
    "Shortcuts": "Snelkoppelingen",
    "Inline Editor": "Inline editor",
    "Show the editor": "Laat de editor zien",
    "Common actions": "Algemene acties",
    "Copy": "Kopiëren",
    "Cut": "Knippen",
    "Paste": "Plakken",
    "Basic Formatting": "Basisformattering",
    "Increase quote level": "Citaat niveau verhogen",
    "Decrease quote level": "Citaatniveau verminderen",
    "Image / Video": "Beeld / video",
    "Resize larger": "Groter maken",
    "Resize smaller": "Kleiner maken",
    "Table": "Tabel",
    "Select table cell": "Selecteer tabelcel",
    "Extend selection one cell": "Selecteer een cel uit",
    "Extend selection one row": "Selecteer een rij uit",
    "Navigation": "Navigatie",
    "Focus popup / toolbar": "Focus pop-up / werkbalk",
    "Return focus to previous position": "Focus terug naar vorige positie",

    // Embed.ly
    "Embed URL": "Embed url",
    "Paste in a URL to embed": "Voer een URL in om toe te voegen",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "De geplakte inhoud komt uit een Microsoft Word-document. wil je het formaat behouden of schoonmaken?",
    "Keep": "Opmaak behouden",
    "Clean": "Tekst schoonmaken",
    "Word Paste Detected": "Word inhoud gedetecteerd"
  },
  direction: "ltr"
};

}));

