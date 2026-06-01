/*
 * This file has been compiled from: /modules/system/lang/nl/client.php
 */
if (!window.oc) {
    window.oc = {};
}

if (!window.oc.langMessages) {
    window.oc.langMessages = {};
}

window.oc.langMessages['nl'] = Object.assign(
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
        "widget_remove_confirm": "Deze widget verwijderen?",
        "reload": "Reload"
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
            "rememberChoice": "Recuerde la opci\u00f3n seleccionada para esta sesi\u00f3n del navegador"
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
    "[not set]": "[niet ingesteld]",
    "1 day (today) if not set": "1 dag (vandaag) indien niet ingesteld",
    "Apply": "Toepassen",
    "Ascending": "Oplopend",
    "Attribute": "Attribuut",
    "Bar": "Staafdiagram",
    "Chart": "Grafiek",
    "Chart type": "Grafiektype",
    "Color": "Kleur",
    "Compare Totals": "Totalen vergelijken",
    "Configure": "Configureren",
    "Custom": "Aangepast",
    "Dashboard interval": "Dashboardbereik",
    "Data source": "Gegevensbron",
    "Date interval": "Datumbereik",
    "Day": "Dag",
    "Delete": "Verwijderen",
    "Delete Dashboard": "Dashboard verwijderen",
    "Delete row": "Rij verwijderen",
    "Descending": "Aflopend",
    "Dimension": "Dimensie",
    "Direction": "Richting",
    "Disabled": "Uitgeschakeld",
    "Display": "Weergave",
    "Display [not set]": "Toon [niet ingesteld]",
    "Display all records": "Alle records weergeven",
    "Display relative bars": "Relatieve balken weergeven",
    "Display totals": "Totalen weergeven",
    "Edit Dashboard": "Dashboard bewerken",
    "Empty values": "Lege waarden",
    "Enter a positive number": "Voer een positief getal in",
    "Enter a positive number or leave empty to display all records.": "Voer een positief getal in of laat leeg om alle records weer te geven.",
    "Equal to": "Gelijk aan",
    "Export Dashboard": "Dashboard exporteren",
    "Extra table fields": "Extra tabelvelden",
    "Filters": "Filters",
    "General": "Algemeen",
    "Greater or equal to": "Groter of gelijk aan",
    "Greater than": "Groter dan",
    "Hide": "Verbergen",
    "Horizontal": "Horizontaal",
    "Icon": "Pictogram",
    "Icon Status": "Pictogramstatus",
    "Important": "Belangrijk",
    "Includes": "Bevat",
    "Indicator": "Indicator",
    "Information": "Informatie",
    "Last 30 days": "Afgelopen 30 dagen",
    "Last 7 days": "Afgelopen 7 dagen",
    "Last month": "Vorige maand",
    "Leave empty to disable pagination": "Laat leeg om paginering uit te schakelen",
    "Leave empty to hide the title": "Laat leeg om de titel te verbergen",
    "Less or equal to": "Kleiner of gelijk aan",
    "Less than": "Kleiner dan",
    "Limit": "Limiet",
    "Line": "Lijngrafiek",
    "Link Text": "Linktekst",
    "Link URL": "Link-URL",
    "Make Default": "Als standaard instellen",
    "Manage Dashboards": "Dashboards beheren",
    "Metric": "Metriek",
    "Metrics": "Metrieken",
    "Month": "Maand",
    "My Custom Widget": "Mijn aangepaste widget",
    "No Value": "Geen waarde",
    "Notice text": "Meldingstekst",
    "Number of days": "Aantal dagen",
    "One of": "E\u00e9n van",
    "One value per line": "E\u00e9n waarde per regel",
    "Operation": "Bewerking",
    "Order": "Volgorde",
    "Past hour": "Afgelopen uur",
    "Past X days": "Afgelopen X dagen",
    "Please provide the widget title": "Voer de widgettitel in",
    "Please select a data source": "Selecteer een gegevensbron",
    "Please select a dimension": "Selecteer een dimensie",
    "Please select an icon": "Selecteer een pictogram",
    "Please select metric(s).": "Selecteer metriek(en).",
    "Prev period": "Vorige periode",
    "Quarter": "Kwartaal",
    "Records per page": "Records per pagina",
    "Refresh every minute": "Elke minuut vernieuwen",
    "Rename Dashboard": "Dashboard hernoemen",
    "Reset Layout": "Layout herstellen",
    "Reset layout back to default?": "Layout terugzetten naar standaard?",
    "Same period last year": "Zelfde periode vorig jaar",
    "Section": "Sectie",
    "Section Title": "Sectietitel",
    "Select a dimension and metrics": "Selecteer een dimensie en metrieken",
    "Select an attribute": "Selecteer een attribuut",
    "Select an operation": "Selecteer een bewerking",
    "Select sorting metric or dimension": "Selecteer sorteermetriek of dimensie",
    "Select the metric color": "Selecteer de metriek-kleur",
    "Set the current layout as the default?": "De huidige layout als standaard instellen?",
    "Show Date Interval": "Toon datumbereik",
    "Sort by": "Sorteren op",
    "Sorting": "Sorteren",
    "Sorting & Filtering": "Sorteren & Filteren",
    "Stacked Bar": "Gestapeld staafdiagram",
    "Starts with": "Begint met",
    "Success": "Succes",
    "Table": "Tabel",
    "Text Notice": "Tekstmelding",
    "The dashboard layout has been reset to default.": "De dashboard layout is hersteld naar standaard.",
    "The dashboard was successfully updated.": "Het dashboard is succesvol bijgewerkt.",
    "The limit value must be at least 1": "De limietwaarde moet minimaal 1 zijn",
    "This dashboard is now the default layout.": "Dit dashboard is nu de standaard layout.",
    "This is a text notice widget.": "Dit is een tekstmelding widget.",
    "This month": "Deze maand",
    "This quarter": "Dit kwartaal",
    "This week": "Deze week",
    "This year": "Dit jaar",
    "Title": "Titel",
    "Today": "Vandaag",
    "Value": "Waarde",
    "Values": "Waarden",
    "Vertical": "Verticaal",
    "Warning": "Waarschuwing",
    "Week": "Week",
    "Year": "Jaar",
    "Yesterday": "Gisteren"
}
);


//! moment.js locale configuration
//! locale : Dutch [nl]
//! author : Joris Röling : https://github.com/jorisroling
//! author : Jacob Middag : https://github.com/middagj

;(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined'
       && typeof require === 'function' ? factory(require('../moment')) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';

    //! moment.js locale configuration

    var monthsShortWithDots =
            'jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.'.split('_'),
        monthsShortWithoutDots =
            'jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec'.split('_'),
        monthsParse = [
            /^jan/i,
            /^feb/i,
            /^(maart|mrt\.?)$/i,
            /^apr/i,
            /^mei$/i,
            /^jun[i.]?$/i,
            /^jul[i.]?$/i,
            /^aug/i,
            /^sep/i,
            /^okt/i,
            /^nov/i,
            /^dec/i,
        ],
        monthsRegex =
            /^(januari|februari|maart|april|mei|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;

    var nl = moment.defineLocale('nl', {
        months: 'januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december'.split(
            '_'
        ),
        monthsShort: function (m, format) {
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
        monthsStrictRegex:
            /^(januari|februari|maart|april|mei|ju[nl]i|augustus|september|oktober|november|december)/i,
        monthsShortStrictRegex:
            /^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,

        monthsParse: monthsParse,
        longMonthsParse: monthsParse,
        shortMonthsParse: monthsParse,

        weekdays:
            'zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag'.split('_'),
        weekdaysShort: 'zo._ma._di._wo._do._vr._za.'.split('_'),
        weekdaysMin: 'zo_ma_di_wo_do_vr_za'.split('_'),
        weekdaysParseExact: true,
        longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD-MM-YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd D MMMM YYYY HH:mm',
        },
        calendar: {
            sameDay: '[vandaag om] LT',
            nextDay: '[morgen om] LT',
            nextWeek: 'dddd [om] LT',
            lastDay: '[gisteren om] LT',
            lastWeek: '[afgelopen] dddd [om] LT',
            sameElse: 'L',
        },
        relativeTime: {
            future: 'over %s',
            past: '%s geleden',
            s: 'een paar seconden',
            ss: '%d seconden',
            m: 'één minuut',
            mm: '%d minuten',
            h: 'één uur',
            hh: '%d uur',
            d: 'één dag',
            dd: '%d dagen',
            w: 'één week',
            ww: '%d weken',
            M: 'één maand',
            MM: '%d maanden',
            y: 'één jaar',
            yy: '%d jaar',
        },
        dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
        ordinal: function (number) {
            return (
                number +
                (number === 1 || number === 8 || number >= 20 ? 'ste' : 'de')
            );
        },
        week: {
            dow: 1, // Monday is the first day of the week.
            doy: 4, // The week that contains Jan 4th is the first week of the year.
        },
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

