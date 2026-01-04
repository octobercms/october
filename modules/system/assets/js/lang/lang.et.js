/*
 * This file has been compiled from: /modules/system/lang/et/client.php
 */
if (!window.oc) {
    window.oc = {};
}

if (!window.oc.langMessages) {
    window.oc.langMessages = {};
}

window.oc.langMessages['et'] = $.extend(
    window.oc.langMessages['et'] || {},
    {
    "markdowneditor": {
        "formatting": "Vorming",
        "quote": "Tsitaat",
        "code": "Kood",
        "header1": "Pealkiri 1",
        "header2": "Pealkiri 2",
        "header3": "Pealkiri 3",
        "header4": "Pealkiri 4",
        "header5": "Pealkiri 5",
        "header6": "Pealkiri 6",
        "bold": "Paks",
        "italic": "Kursiiv",
        "unorderedlist": "J\u00e4rjestamata nimekiri",
        "orderedlist": "J\u00e4rjestatud nimekiri",
        "snippet": "Snippet",
        "video": "Video",
        "image": "Pilt",
        "link": "Link",
        "horizontalrule": "Sisesta horisontaaljoon",
        "fullscreen": "T\u00e4isekraan",
        "preview": "Eelvaade",
        "strikethrough": "Strikethrough",
        "cleanblock": "Clean Block",
        "table": "Table",
        "sidebyside": "Side by Side"
    },
    "mediamanager": {
        "insert_link": "Sisesta link",
        "insert_image": "Siseta pilt",
        "insert_video": "Sisesta video",
        "insert_audio": "Sisesta heliklipp",
        "invalid_file_empty_insert": "Palun vali fail, millele link lisada.",
        "invalid_file_single_insert": "Palun vali \u00fcks fail.",
        "invalid_image_empty_insert": "Palun vali pildid, mida lisada.",
        "invalid_video_empty_insert": "Palun vali videoklipp, mida lisada.",
        "invalid_audio_empty_insert": "Palun vali heliklipp, mida lisada."
    },
    "alert": {
        "error": "Error",
        "confirm": "Confirm",
        "dismiss": "Dismiss",
        "confirm_button_text": "OK",
        "cancel_button_text": "Loobu",
        "widget_remove_confirm": "Eemalda see widget?"
    },
    "datepicker": {
        "previousMonth": "Eelmine kuu",
        "nextMonth": "J\u00e4rgmine kuu",
        "months": [
            "Jaanuar",
            "Veebruar",
            "M\u00e4rts",
            "Aprill",
            "Mai",
            "Juuni",
            "Juuli",
            "August",
            "September",
            "Oktoober",
            "November",
            "Detsember"
        ],
        "weekdays": [
            "P\u00fchap\u00e4ev",
            "Esmasp\u00e4ev",
            "Teisip\u00e4ev",
            "Kolmap\u00e4ev",
            "Neljap\u00e4ev",
            "Reede",
            "Laup\u00e4ev"
        ],
        "weekdaysShort": [
            "P",
            "E",
            "T",
            "K",
            "N",
            "R",
            "L"
        ]
    },
    "colorpicker": {
        "choose": "OK"
    },
    "filter": {
        "group": {
            "all": "k\u00f5ik"
        },
        "scopes": {
            "apply_button_text": "Apply",
            "clear_button_text": "Clear"
        },
        "dates": {
            "all": "k\u00f5ik",
            "filter_button_text": "Filtreeri",
            "reset_button_text": "L\u00e4htesta",
            "date_placeholder": "Kuup\u00e4ev",
            "after_placeholder": "Hiljem kui",
            "before_placeholder": "Varem kui"
        },
        "numbers": {
            "all": "all",
            "filter_button_text": "Filter",
            "reset_button_text": "Reset",
            "min_placeholder": "Min",
            "max_placeholder": "Max"
        }
    },
    "eventlog": {
        "show_stacktrace": "N\u00e4ita stacktrace",
        "hide_stacktrace": "Peida stacktrace",
        "tabs": {
            "formatted": "Kujundatud",
            "raw": "Algne"
        },
        "editor": {
            "title": "L\u00e4htekoodi redaktor",
            "description": "Sinu operatsioonis\u00fcsteem peaks olema sedistatud \u00fche URL skeemi jaoks.",
            "openWith": "Ava programmiga",
            "remember_choice": "J\u00e4ta valik selleks sessiooniks meelde",
            "open": "Ava",
            "cancel": "Loobu"
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
   typeof define === 'function' && define.amd ? define(['moment'], factory) :
   factory(global.moment)
}(this, function (moment) { 'use strict';


    function processRelativeTime(number, withoutSuffix, key, isFuture) {
        var format = {
            's' : ['mõne sekundi', 'mõni sekund', 'paar sekundit'],
            'm' : ['ühe minuti', 'üks minut'],
            'mm': [number + ' minuti', number + ' minutit'],
            'h' : ['ühe tunni', 'tund aega', 'üks tund'],
            'hh': [number + ' tunni', number + ' tundi'],
            'd' : ['ühe päeva', 'üks päev'],
            'M' : ['kuu aja', 'kuu aega', 'üks kuu'],
            'MM': [number + ' kuu', number + ' kuud'],
            'y' : ['ühe aasta', 'aasta', 'üks aasta'],
            'yy': [number + ' aasta', number + ' aastat']
        };
        if (withoutSuffix) {
            return format[key][2] ? format[key][2] : format[key][1];
        }
        return isFuture ? format[key][0] : format[key][1];
    }

    var et = moment.defineLocale('et', {
        months        : 'jaanuar_veebruar_märts_aprill_mai_juuni_juuli_august_september_oktoober_november_detsember'.split('_'),
        monthsShort   : 'jaan_veebr_märts_apr_mai_juuni_juuli_aug_sept_okt_nov_dets'.split('_'),
        weekdays      : 'pühapäev_esmaspäev_teisipäev_kolmapäev_neljapäev_reede_laupäev'.split('_'),
        weekdaysShort : 'P_E_T_K_N_R_L'.split('_'),
        weekdaysMin   : 'P_E_T_K_N_R_L'.split('_'),
        longDateFormat : {
            LT   : 'H:mm',
            LTS : 'H:mm:ss',
            L    : 'DD.MM.YYYY',
            LL   : 'D. MMMM YYYY',
            LLL  : 'D. MMMM YYYY H:mm',
            LLLL : 'dddd, D. MMMM YYYY H:mm'
        },
        calendar : {
            sameDay  : '[Täna,] LT',
            nextDay  : '[Homme,] LT',
            nextWeek : '[Järgmine] dddd LT',
            lastDay  : '[Eile,] LT',
            lastWeek : '[Eelmine] dddd LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : '%s pärast',
            past   : '%s tagasi',
            s      : processRelativeTime,
            m      : processRelativeTime,
            mm     : processRelativeTime,
            h      : processRelativeTime,
            hh     : processRelativeTime,
            d      : processRelativeTime,
            dd     : '%d päeva',
            M      : processRelativeTime,
            MM     : processRelativeTime,
            y      : processRelativeTime,
            yy     : processRelativeTime
        },
        ordinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return et;

}));


/*! Select2 4.1.0-rc.0 | https://github.com/select2/select2/blob/master/LICENSE.md */

!function(){if(jQuery&&jQuery.fn&&jQuery.fn.select2&&jQuery.fn.select2.amd)var e=jQuery.fn.select2.amd;e.define("select2/i18n/et",[],function(){return{inputTooLong:function(e){var n=e.input.length-e.maximum,t="Sisesta "+n+" täht";return 1!=n&&(t+="e"),t+=" vähem"},inputTooShort:function(e){var n=e.minimum-e.input.length,t="Sisesta "+n+" täht";return 1!=n&&(t+="e"),t+=" rohkem"},loadingMore:function(){return"Laen tulemusi…"},maximumSelected:function(e){var n="Saad vaid "+e.maximum+" tulemus";return 1==e.maximum?n+="e":n+="t",n+=" valida"},noResults:function(){return"Tulemused puuduvad"},searching:function(){return"Otsin…"},removeAllItems:function(){return"Eemalda kõik esemed"}}}),e.define,e.require}();

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
 * Estonian
 */

if (!$.FE_LANGUAGE) {
    $.FE_LANGUAGE = {};
}

$.FE_LANGUAGE['et'] = {
  translation: {
    // Place holder
    "Type something": "Kirjuta midagi",

    // Basic formatting
    "Bold": "Rasvane",
    "Italic": "Kursiiv",
    "Underline": "Allajoonitud",
    "Strikethrough": "L\u00e4bikriipsutatud",

    // Main buttons
    "Insert": "Lisa",
    "Delete": "Kustuta",
    "Cancel": "T\u00fchista",
    "OK": "OK",
    "Back": "Tagasi",
    "Remove": "Eemaldama",
    "More": "Rohkem",
    "Update": "Ajakohastama",
    "Style": "Stiil",

    // Font
    "Font Family": "Fondi perekond",
    "Font Size": "Fondi suurus",

    // Colors
    "Colors": "V\u00e4rvid",
    "Background": "Taust",
    "Text": "Tekst",
    "HEX Color": "Hex värvi",

    // Paragraphs
    "Paragraph Format": "Paragrahv formaat",
    "Normal": "Normaalne",
    "Code": "Kood",
    "Heading 1": "P\u00e4is 1",
    "Heading 2": "P\u00e4is 2",
    "Heading 3": "P\u00e4is 3",
    "Heading 4": "P\u00e4is 4",

    // Style
    "Paragraph Style": "Paragrahv stiil",
    "Inline Style": "J\u00e4rjekorras stiil",

    // Alignment
    "Align": "Joonda",
    "Align Left": "Joonda vasakule",
    "Align Center": "Joonda keskele",
    "Align Right": "Joonda paremale",
    "Align Justify": "R\u00f6\u00f6pjoondus",
    "None": "Mitte \u00fckski",

    // Lists
    "Ordered List": "Tellitud nimekirja",
    "Default": "Vaikimisi",
    "Lower Alpha": "Alumine alfa",
    "Lower Greek": "Alumine kreeklane",
    "Lower Roman": "Madalam roomlane",
    "Upper Alpha": "Ülemine alfa",
    "Upper Roman": "Ülemine rooma",

    "Unordered List": "Tavalise nimekirja",
    "Circle": "Ringi",
    "Disc": "Plaat",
    "Square": "Ruut",

    // Line height
    "Line Height": "Reakõrgus",
    "Single": "Üksik",
    "Double": "Topelt",

    // Indent
    "Decrease Indent": "V\u00e4henemine taane",
    "Increase Indent": "Suurenda taanet",

    // Links
    "Insert Link": "Lisa link",
    "Open in new tab": "Ava uues sakis",
    "Open Link": "Avatud link",
    "Edit Link": "Muuda link",
    "Unlink": "Eemalda link",
    "Choose Link": "Vali link",

    // Images
    "Insert Image": "Lisa pilt",
    "Upload Image": "Laadige pilt",
    "By URL": "Poolt URL",
    "Browse": "sirvida",
    "Drop image": "Aseta pilt",
    "or click": "v\u00f5i kliki",
    "Manage Images": "Halda pilte",
    "Loading": "Laadimine",
    "Deleting": "Kustutamine",
    "Tags": "Sildid",
    "Are you sure? Image will be deleted.": "Oled sa kindel? Pilt kustutatakse.",
    "Replace": "Asendama",
    "Uploading": "Laadimise pilti",
    "Loading image": "Laadimise pilti",
    "Display": "Kuvama",
    "Inline": "J\u00e4rjekorras",
    "Break Text": "Murdma teksti",
    "Alternative Text": "Asendusliikme teksti",
    "Change Size": "Muuda suurust",
    "Width": "Laius",
    "Height": "K\u00f5rgus",
    "Something went wrong. Please try again.": "Midagi l\u00e4ks valesti. Palun proovi uuesti.",
    "Image Caption": "Pildi pealkiri",
    "Advanced Edit": "Täiustatud redigeerimine",

    // Video
    "Insert Video": "Lisa video",
    "Embedded Code": "Varjatud koodi",
    "Paste in a video URL": "Kleebi video URL-i",
    "Drop video": "Tilk videot",
    "Your browser does not support HTML5 video.": "Teie brauser ei toeta html5-videot.",
    "Upload Video": "Video üleslaadimine",

    // Tables
    "Insert Table": "Sisesta tabel",
    "Table Header": "Tabel p\u00e4ise kaudu",
    "Remove Table": "Eemalda tabel",
    "Table Style": "Tabel stiili",
    "Horizontal Align": "Horisontaalne joonda",
    "Row": "Rida",
    "Insert row above": "Sisesta rida \u00fcles",
    "Insert row below": "Sisesta rida alla",
    "Delete row": "Kustuta rida",
    "Column": "Veerg",
    "Insert column before": "Sisesta veerg ette",
    "Insert column after": "Sisesta veerg j\u00e4rele",
    "Delete column": "Kustuta veerg",
    "Cell": "Lahter",
    "Merge cells": "\u00fchenda lahtrid",
    "Horizontal split": "Poolita horisontaalselt",
    "Vertical split": "Poolita vertikaalselt",
    "Cell Background": "Lahter tausta",
    "Vertical Align": "Vertikaalne joonda",
    "Top": "\u00fclemine",
    "Middle": "Keskmine",
    "Bottom": "P\u00f5hi",
    "Align Top": "Joonda \u00fclemine",
    "Align Middle": "Joonda keskmine",
    "Align Bottom": "Joonda P\u00f5hi",
    "Cell Style": "Lahter stiili",

    // Files
    "Upload File": "Lae fail \u00fcles",
    "Drop file": "Aseta fail",

    // Emoticons
    "Emoticons": "Emotikonid",
    "Grinning face": "Irvitas n\u00e4kku",
    "Grinning face with smiling eyes": "Irvitas n\u00e4kku naeratavad silmad",
    "Face with tears of joy": "N\u00e4gu r\u00f5\u00f5mupisaratega",
    "Smiling face with open mouth": "Naeratav n\u00e4gu avatud suuga",
    "Smiling face with open mouth and smiling eyes": "Naeratav n\u00e4gu avatud suu ja naeratavad silmad",
    "Smiling face with open mouth and cold sweat": "Naeratav n\u00e4gu avatud suu ja k\u00fclm higi",
    "Smiling face with open mouth and tightly-closed eyes": "Naeratav n\u00e4gu avatud suu ja tihedalt suletud silmad",
    "Smiling face with halo": "Naeratav n\u00e4gu halo",
    "Smiling face with horns": "Naeratav n\u00e4gu sarved",
    "Winking face": "Pilgutab n\u00e4gu",
    "Smiling face with smiling eyes": "Naeratav n\u00e4gu naeratab silmad",
    "Face savoring delicious food": "N\u00e4gu nautides maitsvat toitu",
    "Relieved face": "P\u00e4\u00e4stetud n\u00e4gu",
    "Smiling face with heart-shaped eyes": "Naeratav n\u00e4gu s\u00fcdajas silmad",
    "Smiling face with sunglasses": "Naeratav n\u00e4gu p\u00e4ikeseprillid",
    "Smirking face": "Muigama n\u00e4gu ",
    "Neutral face": "Neutraalne n\u00e4gu",
    "Expressionless face": "Ilmetu n\u00e4gu",
    "Unamused face": "Morn n\u00e4gu",
    "Face with cold sweat": "N\u00e4gu k\u00fclma higiga",
    "Pensive face": "M\u00f5tlik n\u00e4gu",
    "Confused face": "Segaduses n\u00e4gu",
    "Confounded face": "Segas n\u00e4gu",
    "Kissing face": "Suudlevad n\u00e4gu",
    "Face throwing a kiss": "N\u00e4gu viskamine suudlus",
    "Kissing face with smiling eyes": "Suudlevad n\u00e4gu naeratab silmad",
    "Kissing face with closed eyes": "Suudlevad n\u00e4gu, silmad kinni",
    "Face with stuck out tongue": "N\u00e4gu ummikus v\u00e4lja keele",
    "Face with stuck out tongue and winking eye": "N\u00e4gu ummikus v\u00e4lja keele ja silma pilgutav silma",
    "Face with stuck out tongue and tightly-closed eyes": "N\u00e4gu ummikus v\u00e4lja keele ja silmad tihedalt suletuna",
    "Disappointed face": "Pettunud n\u00e4gu",
    "Worried face": "Mures n\u00e4gu",
    "Angry face": "Vihane n\u00e4gu",
    "Pouting face": "Tursik n\u00e4gu",
    "Crying face": "Nutt n\u00e4gu",
    "Persevering face": "Püsiv n\u00e4gu",
    "Face with look of triumph": "N\u00e4gu ilme triumf",
    "Disappointed but relieved face": "Pettunud kuid vabastati n\u00e4gu",
    "Frowning face with open mouth": "Kulmukortsutav n\u00e4gu avatud suuga",
    "Anguished face": "Ahastavad n\u00e4gu",
    "Fearful face": "Hirmunult n\u00e4gu",
    "Weary face": "Grimasse",
    "Sleepy face": "Unine n\u00e4gu",
    "Tired face": "V\u00e4sinud n\u00e4gu",
    "Grimacing face": "Grimassitavaks n\u00e4gu",
    "Loudly crying face": "Valjusti nutma n\u00e4gu",
    "Face with open mouth": "N\u00e4gu avatud suuga",
    "Hushed face": "Raskel n\u00e4gu",
    "Face with open mouth and cold sweat": "N\u00e4gu avatud suu ja k\u00fclm higi",
    "Face screaming in fear": "N\u00e4gu karjuvad hirm",
    "Astonished face": "Lummatud n\u00e4gu",
    "Flushed face": "Punetav n\u00e4gu",
    "Sleeping face": "Uinuv n\u00e4gu",
    "Dizzy face": "Uimane n\u00fcgu",
    "Face without mouth": "N\u00e4gu ilma suu",
    "Face with medical mask": "N\u00e4gu meditsiinilise mask",

    // Line breaker
    "Break": "Murdma",

    // Math
    "Subscript": "Allindeks",
    "Superscript": "\u00dclaindeks",

    // Full screen
    "Fullscreen": "T\u00e4isekraanil",

    // Horizontal line
    "Insert Horizontal Line": "Sisesta horisontaalne joon",

    // Clear formatting
    "Clear Formatting": "Eemalda formaatimine",

    // Save
    "Save": "Salvesta",

    // Undo, redo
    "Undo": "V\u00f5ta tagasi",
    "Redo": "Tee uuesti",

    // Select all
    "Select All": "Vali k\u00f5ik",

    // Code view
    "Code View": "Koodi vaadata",

    // Quote
    "Quote": "Tsitaat",
    "Increase": "Suurendama",
    "Decrease": "V\u00e4henda",

    // Quick Insert
    "Quick Insert": "Kiire sisestada",

    // Spcial Characters
    "Special Characters": "Erimärgid",
    "Latin": "Latin",
    "Greek": "Kreeka keel",
    "Cyrillic": "Kirillitsa",
    "Punctuation": "Kirjavahemärgid",
    "Currency": "Valuuta",
    "Arrows": "Nooled",
    "Math": "Matemaatika",
    "Misc": "Misc",

    // Print.
    "Print": "Printige",

    // Spell Checker.
    "Spell Checker": "Õigekirja kontrollija",

    // Help
    "Help": "Abi",
    "Shortcuts": "Otseteed",
    "Inline Editor": "Sisemine redaktor",
    "Show the editor": "Näita redaktorit",
    "Common actions": "Ühised meetmed",
    "Copy": "Koopia",
    "Cut": "Lõigake",
    "Paste": "Kleepige",
    "Basic Formatting": "Põhiline vormindamine",
    "Increase quote level": "Suurendada tsiteerimise taset",
    "Decrease quote level": "Langetada tsiteerimise tase",
    "Image / Video": "Pilt / video",
    "Resize larger": "Suuruse muutmine suurem",
    "Resize smaller": "Väiksema suuruse muutmine",
    "Table": "Laud",
    "Select table cell": "Vali tabeli lahtrisse",
    "Extend selection one cell": "Laiendage valikut üks lahtrisse",
    "Extend selection one row": "Laiendage valikut ühe reana",
    "Navigation": "Navigeerimine",
    "Focus popup / toolbar": "Fookuse hüpikakna / tööriistariba",
    "Return focus to previous position": "Tagasi pöörata tähelepanu eelmisele positsioonile",

    // Embed.ly
    "Embed URL": "Embed url",
    "Paste in a URL to embed": "Kleepige URL-i sisestamiseks",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "Kleepitud sisu pärineb Microsoft Wordi dokumendist. kas soovite vormi säilitada või puhastada?",
    "Keep": "Pidage seda",
    "Clean": "Puhas",
    "Word Paste Detected": "Avastatud sõna pasta"
  },
  direction: "ltr"
};

}));

