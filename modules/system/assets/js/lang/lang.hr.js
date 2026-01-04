/*
 * This file has been compiled from: /modules/system/lang/hr/client.php
 */
if (!window.oc) {
    window.oc = {};
}

if (!window.oc.langMessages) {
    window.oc.langMessages = {};
}

window.oc.langMessages['hr'] = $.extend(
    window.oc.langMessages['hr'] || {},
    {
    "markdowneditor": {
        "formatting": "Formatting",
        "quote": "Quote",
        "code": "Code",
        "header1": "Header 1",
        "header2": "Header 2",
        "header3": "Header 3",
        "header4": "Header 4",
        "header5": "Header 5",
        "header6": "Header 6",
        "bold": "Bold",
        "italic": "Italic",
        "unorderedlist": "Unordered List",
        "orderedlist": "Ordered List",
        "snippet": "Snippet",
        "video": "Video",
        "image": "Image",
        "link": "Link",
        "horizontalrule": "Insert Horizontal Rule",
        "fullscreen": "Full Screen",
        "preview": "Preview",
        "strikethrough": "Strikethrough",
        "cleanblock": "Clean Block",
        "table": "Table",
        "sidebyside": "Side by Side"
    },
    "mediamanager": {
        "insert_link": "Insert Media Link",
        "insert_image": "Insert Media Image",
        "insert_video": "Insert Media Video",
        "insert_audio": "Insert Media Audio",
        "invalid_file_empty_insert": "Please select file to insert a links to.",
        "invalid_file_single_insert": "Please select a single file.",
        "invalid_image_empty_insert": "Please select image(s) to insert.",
        "invalid_video_empty_insert": "Please select a video file to insert.",
        "invalid_audio_empty_insert": "Please select an audio file to insert."
    },
    "alert": {
        "error": "Error",
        "confirm": "Confirm",
        "dismiss": "Dismiss",
        "confirm_button_text": "OK",
        "cancel_button_text": "Cancel",
        "widget_remove_confirm": "Remove this widget?"
    },
    "datepicker": {
        "previousMonth": "Previous Month",
        "nextMonth": "Next Month",
        "months": [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ],
        "weekdays": [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ],
        "weekdaysShort": [
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat"
        ]
    },
    "colorpicker": {
        "choose": "OK"
    },
    "filter": {
        "group": {
            "all": "all"
        },
        "scopes": {
            "apply_button_text": "Apply",
            "clear_button_text": "Clear"
        },
        "dates": {
            "all": "all",
            "filter_button_text": "Filter",
            "reset_button_text": "Reset",
            "date_placeholder": "Date",
            "after_placeholder": "After",
            "before_placeholder": "Before"
        },
        "numbers": {
            "all": "all",
            "filter_button_text": "Filter",
            "reset_button_text": "Reset",
            "min_placeholder": "Min",
            "max_placeholder": "Max",
            "number_placeholder": "N\u00famero"
        }
    },
    "eventlog": {
        "show_stacktrace": "Show the stacktrace",
        "hide_stacktrace": "Hide the stacktrace",
        "tabs": {
            "formatted": "Formatted",
            "raw": "Raw"
        },
        "editor": {
            "title": "Source Code Editor",
            "description": "Your operating system should be configured to listen to one of these URL schemes.",
            "openWith": "Open with",
            "remember_choice": "Remember selected option for this session",
            "open": "Open",
            "cancel": "Cancel",
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


    function translate(number, withoutSuffix, key) {
        var result = number + ' ';
        switch (key) {
            case 'ss':
                if (number === 1) {
                    result += 'sekunda';
                } else if (number === 2 || number === 3 || number === 4) {
                    result += 'sekunde';
                } else {
                    result += 'sekundi';
                }
                return result;
            case 'm':
                return withoutSuffix ? 'jedna minuta' : 'jedne minute';
            case 'mm':
                if (number === 1) {
                    result += 'minuta';
                } else if (number === 2 || number === 3 || number === 4) {
                    result += 'minute';
                } else {
                    result += 'minuta';
                }
                return result;
            case 'h':
                return withoutSuffix ? 'jedan sat' : 'jednog sata';
            case 'hh':
                if (number === 1) {
                    result += 'sat';
                } else if (number === 2 || number === 3 || number === 4) {
                    result += 'sata';
                } else {
                    result += 'sati';
                }
                return result;
            case 'dd':
                if (number === 1) {
                    result += 'dan';
                } else {
                    result += 'dana';
                }
                return result;
            case 'MM':
                if (number === 1) {
                    result += 'mjesec';
                } else if (number === 2 || number === 3 || number === 4) {
                    result += 'mjeseca';
                } else {
                    result += 'mjeseci';
                }
                return result;
            case 'yy':
                if (number === 1) {
                    result += 'godina';
                } else if (number === 2 || number === 3 || number === 4) {
                    result += 'godine';
                } else {
                    result += 'godina';
                }
                return result;
        }
    }

    var hr = moment.defineLocale('hr', {
        months : {
            format: 'siječnja_veljače_ožujka_travnja_svibnja_lipnja_srpnja_kolovoza_rujna_listopada_studenoga_prosinca'.split('_'),
            standalone: 'siječanj_veljača_ožujak_travanj_svibanj_lipanj_srpanj_kolovoz_rujan_listopad_studeni_prosinac'.split('_')
        },
        monthsShort : 'sij._velj._ožu._tra._svi._lip._srp._kol._ruj._lis._stu._pro.'.split('_'),
        monthsParseExact: true,
        weekdays : 'nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota'.split('_'),
        weekdaysShort : 'ned._pon._uto._sri._čet._pet._sub.'.split('_'),
        weekdaysMin : 'ne_po_ut_sr_če_pe_su'.split('_'),
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
            sameDay  : '[danas u] LT',
            nextDay  : '[sutra u] LT',
            nextWeek : function () {
                switch (this.day()) {
                    case 0:
                        return '[u] [nedjelju] [u] LT';
                    case 3:
                        return '[u] [srijedu] [u] LT';
                    case 6:
                        return '[u] [subotu] [u] LT';
                    case 1:
                    case 2:
                    case 4:
                    case 5:
                        return '[u] dddd [u] LT';
                }
            },
            lastDay  : '[jučer u] LT',
            lastWeek : function () {
                switch (this.day()) {
                    case 0:
                    case 3:
                        return '[prošlu] dddd [u] LT';
                    case 6:
                        return '[prošle] [subote] [u] LT';
                    case 1:
                    case 2:
                    case 4:
                    case 5:
                        return '[prošli] dddd [u] LT';
                }
            },
            sameElse : 'L'
        },
        relativeTime : {
            future : 'za %s',
            past   : 'prije %s',
            s      : 'par sekundi',
            ss     : translate,
            m      : translate,
            mm     : translate,
            h      : translate,
            hh     : translate,
            d      : 'dan',
            dd     : translate,
            M      : 'mjesec',
            MM     : translate,
            y      : 'godinu',
            yy     : translate
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 1st is the first week of the year.
        }
    });

    return hr;

})));


/*! Select2 4.1.0-rc.0 | https://github.com/select2/select2/blob/master/LICENSE.md */

!function(){if(jQuery&&jQuery.fn&&jQuery.fn.select2&&jQuery.fn.select2.amd)var n=jQuery.fn.select2.amd;n.define("select2/i18n/hr",[],function(){function n(n){var e=" "+n+" znak";return n%10<5&&n%10>0&&(n%100<5||n%100>19)?n%10>1&&(e+="a"):e+="ova",e}return{errorLoading:function(){return"Preuzimanje nije uspjelo."},inputTooLong:function(e){return"Unesite "+n(e.input.length-e.maximum)},inputTooShort:function(e){return"Unesite još "+n(e.minimum-e.input.length)},loadingMore:function(){return"Učitavanje rezultata…"},maximumSelected:function(n){return"Maksimalan broj odabranih stavki je "+n.maximum},noResults:function(){return"Nema rezultata"},searching:function(){return"Pretraga…"},removeAllItems:function(){return"Ukloni sve stavke"}}}),n.define,n.require}();

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
 * Croatian
 */

if (!$.FE_LANGUAGE) {
    $.FE_LANGUAGE = {};
}

$.FE_LANGUAGE['hr'] = {
  translation: {
    // Place holder
    "Type something": "Napi\u0161i ne\u0161to",

    // Basic formatting
    "Bold": "Podebljaj",
    "Italic": "Kurziv",
    "Underline": "Podcrtano",
    "Strikethrough": "Precrtano",

    // Main buttons
    "Insert": "Umetni",
    "Delete": "Obri\u0161i",
    "Cancel": "Otka\u017ei",
    "OK": "U redu",
    "Back": "Natrag",
    "Remove": "Ukloni",
    "More": "Vi\u0161e",
    "Update": "A\u017euriraj",
    "Style": "Stil",

    // Font
    "Font Family": "Odaberi font",
    "Font Size": "Veli\u010dina fonta",

    // Colors
    "Colors": "Boje",
    "Background": "Pozadina",
    "Text": "Tekst",
    "HEX Color": "Heksadecimalne boje",

    // Paragraphs
    "Paragraph Format": "Format odlomka",
    "Normal": "Normalno",
    "Code": "Izvorni kod",
    "Heading 1": "Naslov 1",
    "Heading 2": "Naslov 2",
    "Heading 3": "Naslov 3",
    "Heading 4": "Naslov 4",

    // Style
    "Paragraph Style": "Stil odlomka",
    "Inline Style": "Stil u liniji",

    // Alignment
    "Align": "Poravnaj",
    "Align Left": "Poravnaj lijevo",
    "Align Center": "Poravnaj po sredini",
    "Align Right": "Poravnaj desno",
    "Align Justify": "Obostrano poravnanje",
    "None": "Nijedan",

    // Lists
    "Ordered List": "Ure\u0111ena lista",
    "Default": "Zadano",
    "Lower Alpha": "Niži alfa",
    "Lower Greek": "Donji grčki",
    "Lower Roman": "Niži rimski",
    "Upper Alpha": "Gornja alfa",
    "Upper Roman": "Gornji rimski",

    "Unordered List": "Neure\u0111ena lista",
    "Circle": "Krug",
    "Disc": "Disk",
    "Square": "Kvadrat",

    // Line height
    "Line Height": "Visina crte",
    "Single": "Singl",
    "Double": "Dvostruko",

    // Indent
    "Decrease Indent": "Uvuci odlomak",
    "Increase Indent": "Izvuci odlomak",

    // Links
    "Insert Link": "Umetni link",
    "Open in new tab": "Otvori u novom prozoru",
    "Open Link": "Otvori link",
    "Edit Link": "Uredi link",
    "Unlink": "Ukloni link",
    "Choose Link": "Odaberi link",

    // Images
    "Insert Image": "Umetni sliku",
    "Upload Image": "Prijenos slike",
    "By URL": "Prema URL",
    "Browse": "Odabir",
    "Drop image": "Ispusti sliku",
    "or click": "ili odaberi",
    "Manage Images": "Upravljanje slikama",
    "Loading": "U\u010ditavanje",
    "Deleting": "Brisanje",
    "Tags": "Oznake",
    "Are you sure? Image will be deleted.": "Da li ste sigurni da \u017eelite obrisati ovu sliku?",
    "Replace": "Zamijeni",
    "Uploading": "Prijenos",
    "Loading image": "Otvaram sliku",
    "Display": "Prika\u017ei",
    "Inline": "U liniji",
    "Break Text": "Odvojeni tekst",
    "Alternative Text": "Alternativni tekst",
    "Change Size": "Promjena veli\u010dine",
    "Width": "\u0160irina",
    "Height": "Visina",
    "Something went wrong. Please try again.": "Ne\u0161to je po\u0161lo po zlu. Molimo poku\u0161ajte ponovno.",
    "Image Caption": "Opis slike",
    "Advanced Edit": "Napredno uređivanje",

    // Video
    "Insert Video": "Umetni video",
    "Embedded Code": "Ugra\u0111eni kod",
    "Paste in a video URL": "Zalijepite u URL videozapisa",
    "Drop video": "Ispusti video",
    "Your browser does not support HTML5 video.": "Vaš preglednik ne podržava HTML video.",
    "Upload Video": "Prenesi videozapis",

    // Tables
    "Insert Table": "Umetni tablicu",
    "Table Header": "Zaglavlje tablice",
    "Remove Table": "Izbri\u0161i tablicu",
    "Table Style": "Tablica stil",
    "Horizontal Align": "Horizontalna poravnanje",
    "Row": "Red",
    "Insert row above": "Umetni red iznad",
    "Insert row below": "Umetni red ispod",
    "Delete row": "Obri\u0161i red",
    "Column": "Stupac",
    "Insert column before": "Umetni stupac prije",
    "Insert column after": "Umetni stupac poslije",
    "Delete column": "Obri\u0161i stupac",
    "Cell": "Polje",
    "Merge cells": "Spoji polja",
    "Horizontal split": "Horizontalno razdvajanje polja",
    "Vertical split": "Vertikalno razdvajanje polja",
    "Cell Background": "Polje pozadine",
    "Vertical Align": "Vertikalno poravnanje",
    "Top": "Vrh",
    "Middle": "Sredina",
    "Bottom": "Dno",
    "Align Top": "Poravnaj na vrh",
    "Align Middle": "Poravnaj po sredini",
    "Align Bottom": "Poravnaj na dno",
    "Cell Style": "Stil polja",

    // Files
    "Upload File": "Prijenos datoteke",
    "Drop file": "Ispusti datoteku",

    // Emoticons
    "Emoticons": "Emotikoni",
    "Grinning face": "Nacereno lice",
    "Grinning face with smiling eyes": "Nacereno lice s nasmije\u0161enim o\u010dima",
    "Face with tears of joy": "Lice sa suzama radosnicama",
    "Smiling face with open mouth": "Nasmijano lice s otvorenim ustima",
    "Smiling face with open mouth and smiling eyes": "Nasmijano lice s otvorenim ustima i nasmijanim o\u010dima",
    "Smiling face with open mouth and cold sweat": "Nasmijano lice s otvorenim ustima i hladnim znojem",
    "Smiling face with open mouth and tightly-closed eyes": "Nasmijano lice s otvorenim ustima i \u010dvrsto zatvorenih o\u010diju",
    "Smiling face with halo": "Nasmijano lice sa aureolom",
    "Smiling face with horns": "Nasmijano lice s rogovima",
    "Winking face": "Lice koje namiguje",
    "Smiling face with smiling eyes": "Nasmijano lice s nasmiješenim o\u010dima",
    "Face savoring delicious food": "Lice koje u\u017eiva ukusnu hranu",
    "Relieved face": "Lice s olak\u0161anjem",
    "Smiling face with heart-shaped eyes": "Nasmijano lice sa o\u010dima u obliku srca",
    "Smiling face with sunglasses": "Nasmijano lice sa sun\u010danim nao\u010dalama",
    "Smirking face": "Zlokobno nasmije\u0161eno lice",
    "Neutral face": "Neutralno lice",
    "Expressionless face": "Bezizra\u017eajno lice",
    "Unamused face": "Nezainteresirano lice",
    "Face with cold sweat": "Lice s hladnim znojem",
    "Pensive face": "Zami\u0161ljeno lice",
    "Confused face": "Zbunjeno lice",
    "Confounded face": "Zbunjeno lice",
    "Kissing face": "Lice s poljupcem",
    "Face throwing a kiss": "Lice koje baca poljubac",
    "Kissing face with smiling eyes": "Lice s poljupcem s nasmije\u0161enim o\u010dima",
    "Kissing face with closed eyes": "Lice s poljupcem zatvorenih o\u010diju",
    "Face with stuck out tongue": "Lice s ispru\u017eenim jezikom",
    "Face with stuck out tongue and winking eye": "Lice s ispru\u017eenim jezikom koje namiguje",
    "Face with stuck out tongue and tightly-closed eyes": "Lice s ispru\u017eenim jezikom i \u010dvrsto zatvorenih o\u010diju",
    "Disappointed face": "Razo\u010darano lice",
    "Worried face": "Zabrinuto lice",
    "Angry face": "Ljutito lice",
    "Pouting face": "Nadureno lice",
    "Crying face": "Uplakano lice",
    "Persevering face": "Lice s negodovanjem",
    "Face with look of triumph": "Trijumfalno lice",
    "Disappointed but relieved face": "Razo\u010darano ali olakšano lice",
    "Frowning face with open mouth": "Namrgo\u0111eno lice s otvorenim ustima",
    "Anguished face": "Tjeskobno lice",
    "Fearful face": "Prestra\u0161eno lice",
    "Weary face": "Umorno lice",
    "Sleepy face": "Pospano lice",
    "Tired face": "Umorno lice",
    "Grimacing face": "Lice sa grimasama",
    "Loudly crying face": "Glasno pla\u010du\u0107e lice",
    "Face with open mouth": "Lice s otvorenim ustima",
    "Hushed face": "Tiho lice",
    "Face with open mouth and cold sweat": "Lice s otvorenim ustima i hladnim znojem",
    "Face screaming in fear": "Lice koje vri\u0161ti u strahu",
    "Astonished face": "Zaprepa\u0161teno lice",
    "Flushed face": "Zajapureno lice",
    "Sleeping face": "Spava\u0107e lice",
    "Dizzy face": "Lice sa vrtoglavicom",
    "Face without mouth": "Lice bez usta",
    "Face with medical mask": "Lice s medicinskom maskom",

    // Line breaker
    "Break": "Odvojeno",

    // Math
    "Subscript": "Indeks",
    "Superscript": "Eksponent",

    // Full screen
    "Fullscreen": "Puni zaslon",

    // Horizontal line
    "Insert Horizontal Line": "Umetni liniju",

    // Clear formatting
    "Clear Formatting": "Ukloni oblikovanje",

    // Save
    "Save": "\u0055\u0161\u0074\u0065\u0064\u006a\u0065\u0074\u0069",

    // Undo, redo
    "Undo": "Korak natrag",
    "Redo": "Korak naprijed",

    // Select all
    "Select All": "Odaberi sve",

    // Code view
    "Code View": "Pregled koda",

    // Quote
    "Quote": "Citat",
    "Increase": "Pove\u0107aj",
    "Decrease": "Smanji",

    // Quick Insert
    "Quick Insert": "Brzo umetak",

    // Spcial Characters
    "Special Characters": "Posebni znakovi",
    "Latin": "Latinski",
    "Greek": "Grčki",
    "Cyrillic": "Ćirilica",
    "Punctuation": "Interpunkcija",
    "Currency": "Valuta",
    "Arrows": "Strelice",
    "Math": "Matematika",
    "Misc": "Razno",

    // Print.
    "Print": "Otisak",

    // Spell Checker.
    "Spell Checker": "Provjeritelj pravopisa",

    // Help
    "Help": "Pomoć",
    "Shortcuts": "Prečaci",
    "Inline Editor": "Inline editor",
    "Show the editor": "Prikaži urednika",
    "Common actions": "Zajedničke radnje",
    "Copy": "Kopirati",
    "Cut": "Rez",
    "Paste": "Zalijepiti",
    "Basic Formatting": "Osnovno oblikovanje",
    "Increase quote level": "Povećati razinu citata",
    "Decrease quote level": "Smanjite razinu citata",
    "Image / Video": "Slika / video",
    "Resize larger": "Promijenite veličinu većeg",
    "Resize smaller": "Promijenite veličinu manju",
    "Table": "Stol",
    "Select table cell": "Odaberite stolnu ćeliju",
    "Extend selection one cell": "Proširiti odabir jedne ćelije",
    "Extend selection one row": "Proširite odabir jednog retka",
    "Navigation": "Navigacija",
    "Focus popup / toolbar": "Fokus popup / alatnoj traci",
    "Return focus to previous position": "Vratiti fokus na prethodnu poziciju",

    // Embed.ly
    "Embed URL": "Uredi url",
    "Paste in a URL to embed": "Zalijepite URL da biste ga ugradili",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "Zalijepi sadržaj dolazi iz Microsoft Word dokumenta. Želite li zadržati format ili očistiti?",
    "Keep": "Zadržati",
    "Clean": "Čist",
    "Word Paste Detected": "Otkrivena je zastavica riječi"
  },
  direction: "ltr"
};

}));

