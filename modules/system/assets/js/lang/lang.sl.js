/*
 * This file has been compiled from: /modules/system/lang/sl/client.php
 */
if (!window.oc) {
    window.oc = {};
}

if (!window.oc.langMessages) {
    window.oc.langMessages = {};
}

window.oc.langMessages['sl'] = $.extend(
    window.oc.langMessages['sl'] || {},
    {
    "markdowneditor": {
        "formatting": "Oblikovanje",
        "quote": "Citat",
        "code": "Koda",
        "header1": "Naslov 1",
        "header2": "Naslov 2",
        "header3": "Naslov 3",
        "header4": "Naslov 4",
        "header5": "Naslov 5",
        "header6": "Naslov 6",
        "bold": "Krepko",
        "italic": "Le\u017ee\u010de",
        "unorderedlist": "Neo\u0161tevil\u010deni seznam",
        "orderedlist": "\u0160tevil\u010dni seznam",
        "snippet": "Snippet",
        "video": "Video",
        "image": "Slika",
        "link": "Povezava",
        "horizontalrule": "Vstavi vodoravno \u010drto",
        "fullscreen": "Celozaslonski na\u010din",
        "preview": "Predogled",
        "strikethrough": "Strikethrough",
        "cleanblock": "Clean Block",
        "table": "Table",
        "sidebyside": "Side by Side"
    },
    "mediamanager": {
        "insert_link": "Vstavi povezavo",
        "insert_image": "Vstavi sliko",
        "insert_video": "Vstavi video posnetek",
        "insert_audio": "Vstavi zvo\u010dni posnetek",
        "invalid_file_empty_insert": "Izberite datoteko, do katere \u017eelite vstaviti povezavo.",
        "invalid_file_single_insert": "Izberite eno samo datoteko.",
        "invalid_image_empty_insert": "Izberite slike za vstavljanje.",
        "invalid_video_empty_insert": "Izberite video posnetek za vstavljanje.",
        "invalid_audio_empty_insert": "Izberite zvo\u010dni posnetek za vstavljanje."
    },
    "alert": {
        "error": "Error",
        "confirm": "Confirm",
        "dismiss": "Dismiss",
        "confirm_button_text": "V redu",
        "cancel_button_text": "Prekli\u010di",
        "widget_remove_confirm": "Odstrani ta vti\u010dnik?"
    },
    "datepicker": {
        "previousMonth": "Prej\u0161nji mesec",
        "nextMonth": "Naslednji mesec",
        "months": [
            "Januar",
            "Februar",
            "Marec",
            "April",
            "Maj",
            "Junij",
            "Julij",
            "Avgust",
            "September",
            "Oktober",
            "November",
            "December"
        ],
        "weekdays": [
            "Nedelja",
            "Ponedeljek",
            "Torek",
            "Sreda",
            "\u010cetrtek",
            "Petek",
            "Sobota"
        ],
        "weekdaysShort": [
            "Ned",
            "Pon",
            "Tor",
            "Sre",
            "\u010cet",
            "Pet",
            "Sob"
        ]
    },
    "colorpicker": {
        "choose": "OK"
    },
    "filter": {
        "group": {
            "all": "vsi"
        },
        "scopes": {
            "apply_button_text": "Uporabi",
            "clear_button_text": "Po\u010disti"
        },
        "dates": {
            "all": "vsi",
            "filter_button_text": "Filtriraj",
            "reset_button_text": "Ponastavi",
            "date_placeholder": "Datum",
            "after_placeholder": "Po",
            "before_placeholder": "Pred"
        },
        "numbers": {
            "all": "vsi",
            "filter_button_text": "Filtriraj",
            "reset_button_text": "Ponastavi",
            "min_placeholder": "Min",
            "max_placeholder": "Max",
            "number_placeholder": "N\u00famero"
        }
    },
    "eventlog": {
        "show_stacktrace": "Prika\u017ei sled dogodkov",
        "hide_stacktrace": "Skrij sled dogodkov",
        "tabs": {
            "formatted": "Oblikovano",
            "raw": "Brez oblikovanja"
        },
        "editor": {
            "title": "Urejevalnik izvorne kode",
            "description": "Va\u0161 operacijski sistem mora biti nastavljen tako, da upo\u0161teva eno od teh URL shem.",
            "openWith": "Za odpiranje uporabi",
            "remember_choice": "Zapomni si izbrane nastavitve za to sejo",
            "open": "Odpri",
            "cancel": "Prekli\u010di",
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


    function processRelativeTime(number, withoutSuffix, key, isFuture) {
        var result = number + ' ';
        switch (key) {
            case 's':
                return withoutSuffix || isFuture ? 'nekaj sekund' : 'nekaj sekundami';
            case 'ss':
                if (number === 1) {
                    result += withoutSuffix ? 'sekundo' : 'sekundi';
                } else if (number === 2) {
                    result += withoutSuffix || isFuture ? 'sekundi' : 'sekundah';
                } else if (number < 5) {
                    result += withoutSuffix || isFuture ? 'sekunde' : 'sekundah';
                } else {
                    result += withoutSuffix || isFuture ? 'sekund' : 'sekund';
                }
                return result;
            case 'm':
                return withoutSuffix ? 'ena minuta' : 'eno minuto';
            case 'mm':
                if (number === 1) {
                    result += withoutSuffix ? 'minuta' : 'minuto';
                } else if (number === 2) {
                    result += withoutSuffix || isFuture ? 'minuti' : 'minutama';
                } else if (number < 5) {
                    result += withoutSuffix || isFuture ? 'minute' : 'minutami';
                } else {
                    result += withoutSuffix || isFuture ? 'minut' : 'minutami';
                }
                return result;
            case 'h':
                return withoutSuffix ? 'ena ura' : 'eno uro';
            case 'hh':
                if (number === 1) {
                    result += withoutSuffix ? 'ura' : 'uro';
                } else if (number === 2) {
                    result += withoutSuffix || isFuture ? 'uri' : 'urama';
                } else if (number < 5) {
                    result += withoutSuffix || isFuture ? 'ure' : 'urami';
                } else {
                    result += withoutSuffix || isFuture ? 'ur' : 'urami';
                }
                return result;
            case 'd':
                return withoutSuffix || isFuture ? 'en dan' : 'enim dnem';
            case 'dd':
                if (number === 1) {
                    result += withoutSuffix || isFuture ? 'dan' : 'dnem';
                } else if (number === 2) {
                    result += withoutSuffix || isFuture ? 'dni' : 'dnevoma';
                } else {
                    result += withoutSuffix || isFuture ? 'dni' : 'dnevi';
                }
                return result;
            case 'M':
                return withoutSuffix || isFuture ? 'en mesec' : 'enim mesecem';
            case 'MM':
                if (number === 1) {
                    result += withoutSuffix || isFuture ? 'mesec' : 'mesecem';
                } else if (number === 2) {
                    result += withoutSuffix || isFuture ? 'meseca' : 'mesecema';
                } else if (number < 5) {
                    result += withoutSuffix || isFuture ? 'mesece' : 'meseci';
                } else {
                    result += withoutSuffix || isFuture ? 'mesecev' : 'meseci';
                }
                return result;
            case 'y':
                return withoutSuffix || isFuture ? 'eno leto' : 'enim letom';
            case 'yy':
                if (number === 1) {
                    result += withoutSuffix || isFuture ? 'leto' : 'letom';
                } else if (number === 2) {
                    result += withoutSuffix || isFuture ? 'leti' : 'letoma';
                } else if (number < 5) {
                    result += withoutSuffix || isFuture ? 'leta' : 'leti';
                } else {
                    result += withoutSuffix || isFuture ? 'let' : 'leti';
                }
                return result;
        }
    }

    var sl = moment.defineLocale('sl', {
        months : 'januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december'.split('_'),
        monthsShort : 'jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.'.split('_'),
        monthsParseExact: true,
        weekdays : 'nedelja_ponedeljek_torek_sreda_četrtek_petek_sobota'.split('_'),
        weekdaysShort : 'ned._pon._tor._sre._čet._pet._sob.'.split('_'),
        weekdaysMin : 'ne_po_to_sr_če_pe_so'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'H:mm',
            LTS : 'H:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D. MMMM YYYY',
            LLL : 'D. MMMM YYYY H:mm',
            LLLL : 'dddd, D. MMMM YYYY H:mm'
        },
        calendar : {
            sameDay  : '[danes ob] LT',
            nextDay  : '[jutri ob] LT',

            nextWeek : function () {
                switch (this.day()) {
                    case 0:
                        return '[v] [nedeljo] [ob] LT';
                    case 3:
                        return '[v] [sredo] [ob] LT';
                    case 6:
                        return '[v] [soboto] [ob] LT';
                    case 1:
                    case 2:
                    case 4:
                    case 5:
                        return '[v] dddd [ob] LT';
                }
            },
            lastDay  : '[včeraj ob] LT',
            lastWeek : function () {
                switch (this.day()) {
                    case 0:
                        return '[prejšnjo] [nedeljo] [ob] LT';
                    case 3:
                        return '[prejšnjo] [sredo] [ob] LT';
                    case 6:
                        return '[prejšnjo] [soboto] [ob] LT';
                    case 1:
                    case 2:
                    case 4:
                    case 5:
                        return '[prejšnji] dddd [ob] LT';
                }
            },
            sameElse : 'L'
        },
        relativeTime : {
            future : 'čez %s',
            past   : 'pred %s',
            s      : processRelativeTime,
            ss     : processRelativeTime,
            m      : processRelativeTime,
            mm     : processRelativeTime,
            h      : processRelativeTime,
            hh     : processRelativeTime,
            d      : processRelativeTime,
            dd     : processRelativeTime,
            M      : processRelativeTime,
            MM     : processRelativeTime,
            y      : processRelativeTime,
            yy     : processRelativeTime
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 1st is the first week of the year.
        }
    });

    return sl;

})));


/*! Select2 4.1.0-rc.0 | https://github.com/select2/select2/blob/master/LICENSE.md */

!function(){if(jQuery&&jQuery.fn&&jQuery.fn.select2&&jQuery.fn.select2.amd)var e=jQuery.fn.select2.amd;e.define("select2/i18n/sl",[],function(){return{errorLoading:function(){return"Zadetkov iskanja ni bilo mogoče naložiti."},inputTooLong:function(e){var n=e.input.length-e.maximum,t="Prosim zbrišite "+n+" znak";return 2==n?t+="a":1!=n&&(t+="e"),t},inputTooShort:function(e){var n=e.minimum-e.input.length,t="Prosim vpišite še "+n+" znak";return 2==n?t+="a":1!=n&&(t+="e"),t},loadingMore:function(){return"Nalagam več zadetkov…"},maximumSelected:function(e){var n="Označite lahko največ "+e.maximum+" predmet";return 2==e.maximum?n+="a":1!=e.maximum&&(n+="e"),n},noResults:function(){return"Ni zadetkov."},searching:function(){return"Iščem…"},removeAllItems:function(){return"Odstranite vse elemente"}}}),e.define,e.require}();

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
 * Slovenian
 */

if (!$.FE_LANGUAGE) {
    $.FE_LANGUAGE = {};
}

$.FE_LANGUAGE['sl'] = {
  translation: {
    // Place holder
    "Type something": "Nekaj vtipkajte",

    // Basic formatting
    "Bold": "Krepko",
    "Italic": "Poševno",
    "Underline": "Podčrtano",
    "Strikethrough": "Prečrtano",

    // Main buttons
    "Insert": "Vstavi",
    "Delete": "Izbriši",
    "Cancel": "Prekliči",
    "OK": "OK",
    "Back": "Nazaj",
    "Remove": "Odstrani",
    "More": "Več",
    "Update": "Posodobi",
    "Style": "Slog",

    // Font
    "Font Family": "Oblika pisave",
    "Font Size": "Velikost pisave",

    // Colors
    "Colors": "Barve",
    "Background": "Ozadje",
    "Text": "Besedilo",
    "HEX Color": "HEX barva",

    // Paragraphs
    "Paragraph Format": "Oblika odstavka",
    "Normal": "Normalno",
    "Code": "Koda",
    "Heading 1": "Naslov 1",
    "Heading 2": "Naslov 2",
    "Heading 3": "Naslov 3",
    "Heading 4": "Naslov 4",

    // Style
    "Paragraph Style": "Slog odstavka",
    "Inline Style": "Vrstični slog",

    // Alignment
    "Align": "Poravnava",
    "Align Left": "Leva poravnava",
    "Align Center": "Sredinska poravnava",
    "Align Right": "Desna poravnava",
    "Align Justify": "Obojestranska poravnava",
    "None": "Brez poravnave",

    // Lists
    "Ordered List": "Številčni seznam",
    "Default": "Privzeto",
    "Lower Alpha": "Latinica male",
    "Lower Greek": "Grške male",
    "Lower Roman": "Rimske male",
    "Upper Alpha": "Latinica velike",
    "Upper Roman": "Rimske velike",

    "Unordered List": "Neštevilčni seznam",
    "Circle": "Krog",
    "Disc": "Disk",
    "Square": "Kvadrat",

    // Line height
    "Line Height": "Višina vrstice",
    "Single": "Enojna",
    "Double": "Dvojna",

    // Indent
    "Decrease Indent": "Zmanjšaj zamik",
    "Increase Indent": "Povečaj zamik",

    // Links
    "Insert Link": "Vstavi povezavo",
    "Open in new tab": "Odpri povezavo v novem zavihku",
    "Open Link": "Odpri povezavo",
    "Edit Link": "Uredi povezavo",
    "Unlink": "Odstrani povezavo",
    "Choose Link": "Izberi povezavo",

    // Images
    "Insert Image": "Vstavi sliko",
    "Upload Image": "Naloži sliko",
    "By URL": "Iz URL povezave",
    "Browse": "Prebrskaj",
    "Drop image": "Spustite sliko sem",
    "or click": "ali kliknite",
    "Manage Images": "Urejaj slike",
    "Loading": "Nalaganje",
    "Deleting": "Brisanje",
    "Tags": "Značke",
    "Are you sure? Image will be deleted.": "Ali ste prepričani? Slika bo izbrisana.",
    "Replace": "Zamenjaj",
    "Uploading": "Nalaganje",
    "Loading image": "Nalagam sliko",
    "Display": "Prikaži",
    "Inline": "Vrstično",
    "Break Text": "Prelomi besedilo",
    "Alternative Text": "Nadomestno besedilo",
    "Change Size": "Spremeni velikost",
    "Width": "Širina",
    "Height": "Višina",
    "Something went wrong. Please try again.": "Nekaj je šlo narobe. Prosimo, poskusite ponovno.",
    "Image Caption": "Opis slike",
    "Advanced Edit": "Napredno urejanje",

    // Video
    "Insert Video": "Vstavi video posnetek",
    "Embedded Code": "Vdelana koda",
    "Paste in a video URL": "Prilepite URL video posnetka",
    "Drop video": "Spustite video posnetek sem",
    "Your browser does not support HTML5 video.": "Vaš brskalnik ne podpira HTML5 video funkcionalnosti.",
    "Upload Video": "Naloži video posnetek",

    // Tables
    "Insert Table": "Vstavi tabelo",
    "Table Header": "Glava tabele",
    "Remove Table": "Odstrani tabelo",
    "Table Style": "Slog tabele",
    "Horizontal Align": "Horizontalna poravnava",
    "Row": "Vrstica",
    "Insert row above": "Vstavi vrstico nad",
    "Insert row below": "Vstavi vrstico pod",
    "Delete row": "Izbriši vrstico",
    "Column": "Stolpec",
    "Insert column before": "Vstavi stolpec pred",
    "Insert column after": "Vstavi stolpec po",
    "Delete column": "Izbriši stolpec",
    "Cell": "Celica",
    "Merge cells": "Združi celice",
    "Horizontal split": "Horizontalni razcep",
    "Vertical split": "Vertikalni razcep",
    "Cell Background": "Ozadje celice",
    "Vertical Align": "Vertikalna poravnava",
    "Top": "Vrh",
    "Middle": "Sredina",
    "Bottom": "Dno",
    "Align Top": "Vrhnja poravnava",
    "Align Middle": "Sredinska poravnava",
    "Align Bottom": "Spodnja poravnava",
    "Cell Style": "Slog celice",

    // Files
    "Upload File": "Naloži datoteko",
    "Drop file": "Spustite datoteko sem",

    // Emoticons
    "Emoticons": "Emotikoni",

    // Line breaker
    "Break": "Prelom",

    // Math
    "Subscript": "Podpisano",
    "Superscript": "Nadpisano",

    // Full screen
    "Fullscreen": "Celozaslonski način",

    // Horizontal line
    "Insert Horizontal Line": "Vstavi vodoravno črto",

    // Clear formatting
    "Clear Formatting": "Počisti oblikovanje",

    // Save
    "Save": "Shrani",

    // Undo, redo
    "Undo": "Razveljavi",
    "Redo": "Ponovno uveljavi",

    // Select all
    "Select All": "Izberi vse",

    // Code view
    "Code View": "Pogled kode",

    // Quote
    "Quote": "Citat",
    "Increase": "Povečaj",
    "Decrease": "Zmanjšaj",

    // Quick Insert
    "Quick Insert": "Hitro vstavljanje",

    // Special Characters
    "Special Characters": "Posebni znaki",
    "Latin": "Latinica",
    "Greek": "Grščina",
    "Cyrillic": "Cirilica",
    "Punctuation": "Ločila",
    "Currency": "Valute",
    "Arrows": "Puščice",
    "Math": "Matematika",
    "Misc": "Razno",

    // Print.
    "Print": "Natisni",

    // Spell Checker.
    "Spell Checker": "Črkovalnik",

    // Help
    "Help": "Pomoč",
    "Shortcuts": "Bližnjice",
    "Inline Editor": "Vdelani urejevalnik",
    "Show the editor": "Pokaži urejevalnik",
    "Common actions": "Skupna dejanja",
    "Copy": "Kopiraj",
    "Cut": "Izreži",
    "Paste": "Prilepi",
    "Basic Formatting": "Osnovno oblikovanje",
    "Increase quote level": "Povečaj raven citata",
    "Decrease quote level": "Zmanjšaj raven citata",
    "Image / Video": "Slika / Video",
    "Resize larger": "Povečaj",
    "Resize smaller": "Pomanjšaj",
    "Table": "Tabela",
    "Select table cell": "Izberi celico tabele",
    "Extend selection one cell": "Razširi izbor za eno celico",
    "Extend selection one row": "Razširi izbor za eno vrstico",
    "Navigation": "Navigacija",
    "Focus popup / toolbar": "Fokusiraj pojavno okno / orodno vrstico",
    "Return focus to previous position": "Vrni fokus v prejšnji položaj",

    // Embed.ly
    "Embed URL": "Vdelaj URL",
    "Paste in a URL to embed": "Prilepite URL za vdelavo",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "Prilepljena vsebina prihaja iz dokumenta Microsoft Word. Ali želite obliko obdržati ali jo želite očistiti?",
    "Keep": "Obdrži",
    "Clean": "Počisti",
    "Word Paste Detected": "Zaznano je lepljenje s programa Word"
  },
  direction: "ltr"
};

}));

