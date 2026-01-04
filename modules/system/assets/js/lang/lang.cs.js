/*
 * This file has been compiled from: /modules/system/lang/cs/client.php
 */
if (!window.oc) {
    window.oc = {};
}

if (!window.oc.langMessages) {
    window.oc.langMessages = {};
}

window.oc.langMessages['cs'] = $.extend(
    window.oc.langMessages['cs'] || {},
    {
    "markdowneditor": {
        "formatting": "Form\u00e1tov\u00e1n\u00ed",
        "quote": "Citace",
        "code": "K\u00f3d",
        "header1": "Nadpis 1",
        "header2": "Nadpis 2",
        "header3": "Nadpis 3",
        "header4": "Nadpis 4",
        "header5": "Nadpis 5",
        "header6": "Nadpis 6",
        "bold": "Tu\u010dn\u011b",
        "italic": "Kurz\u00edvou",
        "unorderedlist": "Ne\u010d\u00edslovan\u00fd seznam",
        "orderedlist": "\u010c\u00edslovan\u00fd seznam",
        "snippet": "Snippet",
        "video": "Video",
        "image": "Obr\u00e1zek",
        "link": "Odkaz",
        "horizontalrule": "Vlo\u017eit horizont\u00e1ln\u00ed linku",
        "fullscreen": "Cel\u00e1 obrazovka",
        "preview": "N\u00e1hled",
        "strikethrough": "Strikethrough",
        "cleanblock": "Clean Block",
        "table": "Table",
        "sidebyside": "Side by Side"
    },
    "mediamanager": {
        "insert_link": "Vlo\u017eit odkaz",
        "insert_image": "Vlo\u017eit obr\u00e1zek",
        "insert_video": "Vlo\u017eit video",
        "insert_audio": "Vlo\u017eit zvuk",
        "invalid_file_empty_insert": "Pros\u00edm vyberte soubor, na kter\u00fd se vlo\u017e\u00ed odkaz.",
        "invalid_file_single_insert": "Vyberte jeden soubor.",
        "invalid_image_empty_insert": "Vyberte soubor(y) pro vlo\u017een\u00ed.",
        "invalid_video_empty_insert": "Vyberte video soubor pro vlo\u017een\u00ed.",
        "invalid_audio_empty_insert": "Vyberte audio soubor pro vlo\u017een\u00ed."
    },
    "alert": {
        "error": "Error",
        "confirm": "Confirm",
        "dismiss": "Dismiss",
        "confirm_button_text": "OK",
        "cancel_button_text": "Zru\u0161it",
        "widget_remove_confirm": "Odstranit widget?"
    },
    "datepicker": {
        "previousMonth": "P\u0159edchoz\u00ed m\u011bs\u00edc",
        "nextMonth": "N\u00e1sleduj\u00edc\u00ed m\u011bs\u00edc",
        "months": [
            "Leden",
            "\u00danor",
            "B\u0159ezen",
            "Duben",
            "Kv\u011bten",
            "\u010cerven",
            "\u010cervenec",
            "Srpen",
            "Z\u00e1\u0159\u00ed",
            "\u0158\u00edjen",
            "Listopad",
            "Prosinec"
        ],
        "weekdays": [
            "Ned\u011ble",
            "Pond\u011bl\u00ed",
            "\u00dater\u00fd",
            "St\u0159eda",
            "\u010ctvrtek",
            "P\u00e1tek",
            "Sobota"
        ],
        "weekdaysShort": [
            "Ne",
            "Po",
            "\u00dat",
            "St",
            "\u010ct",
            "P\u00e1",
            "So"
        ]
    },
    "colorpicker": {
        "choose": "OK"
    },
    "filter": {
        "group": {
            "all": "V\u0161e"
        },
        "scopes": {
            "apply_button_text": "Filtrovat",
            "clear_button_text": "Zru\u0161it"
        },
        "dates": {
            "all": "V\u0161e",
            "filter_button_text": "Filtrovat",
            "reset_button_text": "Zru\u0161it",
            "date_placeholder": "Datum",
            "after_placeholder": "Po",
            "before_placeholder": "P\u0159ed"
        },
        "numbers": {
            "all": "V\u0161e",
            "filter_button_text": "Filtrovat",
            "reset_button_text": "Zru\u0161it",
            "min_placeholder": "Minimum",
            "max_placeholder": "Maximum"
        }
    },
    "eventlog": {
        "show_stacktrace": "Zobrazit stacktrace",
        "hide_stacktrace": "Skr\u00fdt stacktrace",
        "tabs": {
            "formatted": "Form\u00e1tov\u00e1no",
            "raw": "P\u016fvodn\u00ed (raw)"
        },
        "editor": {
            "title": "Editor zdrojov\u00e9ho k\u00f3du",
            "description": "V\u00e1\u0161 opera\u010dn\u00ed syst\u00e9m by m\u011bl b\u00fdt konfigurov\u00e1n tak, aby naslouchal jednomu z t\u011bchto sch\u00e9mat adres URL.",
            "openWith": "Otev\u0159\u00edt v",
            "remember_choice": "Zapamatovat si vybranou volbu pro tuto relaci",
            "open": "Otev\u0159\u00edt",
            "cancel": "Zru\u0161it"
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


    var months = 'leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec'.split('_'),
        monthsShort = 'led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro'.split('_');
    function plural(n) {
        return (n > 1) && (n < 5) && (~~(n / 10) !== 1);
    }
    function translate(number, withoutSuffix, key, isFuture) {
        var result = number + ' ';
        switch (key) {
            case 's':  // a few seconds / in a few seconds / a few seconds ago
                return (withoutSuffix || isFuture) ? 'pár sekund' : 'pár sekundami';
            case 'ss': // 9 seconds / in 9 seconds / 9 seconds ago
                if (withoutSuffix || isFuture) {
                    return result + (plural(number) ? 'sekundy' : 'sekund');
                } else {
                    return result + 'sekundami';
                }
                break;
            case 'm':  // a minute / in a minute / a minute ago
                return withoutSuffix ? 'minuta' : (isFuture ? 'minutu' : 'minutou');
            case 'mm': // 9 minutes / in 9 minutes / 9 minutes ago
                if (withoutSuffix || isFuture) {
                    return result + (plural(number) ? 'minuty' : 'minut');
                } else {
                    return result + 'minutami';
                }
                break;
            case 'h':  // an hour / in an hour / an hour ago
                return withoutSuffix ? 'hodina' : (isFuture ? 'hodinu' : 'hodinou');
            case 'hh': // 9 hours / in 9 hours / 9 hours ago
                if (withoutSuffix || isFuture) {
                    return result + (plural(number) ? 'hodiny' : 'hodin');
                } else {
                    return result + 'hodinami';
                }
                break;
            case 'd':  // a day / in a day / a day ago
                return (withoutSuffix || isFuture) ? 'den' : 'dnem';
            case 'dd': // 9 days / in 9 days / 9 days ago
                if (withoutSuffix || isFuture) {
                    return result + (plural(number) ? 'dny' : 'dní');
                } else {
                    return result + 'dny';
                }
                break;
            case 'M':  // a month / in a month / a month ago
                return (withoutSuffix || isFuture) ? 'měsíc' : 'měsícem';
            case 'MM': // 9 months / in 9 months / 9 months ago
                if (withoutSuffix || isFuture) {
                    return result + (plural(number) ? 'měsíce' : 'měsíců');
                } else {
                    return result + 'měsíci';
                }
                break;
            case 'y':  // a year / in a year / a year ago
                return (withoutSuffix || isFuture) ? 'rok' : 'rokem';
            case 'yy': // 9 years / in 9 years / 9 years ago
                if (withoutSuffix || isFuture) {
                    return result + (plural(number) ? 'roky' : 'let');
                } else {
                    return result + 'lety';
                }
                break;
        }
    }

    var cs = moment.defineLocale('cs', {
        months : months,
        monthsShort : monthsShort,
        monthsParse : (function (months, monthsShort) {
            var i, _monthsParse = [];
            for (i = 0; i < 12; i++) {
                // use custom parser to solve problem with July (červenec)
                _monthsParse[i] = new RegExp('^' + months[i] + '$|^' + monthsShort[i] + '$', 'i');
            }
            return _monthsParse;
        }(months, monthsShort)),
        shortMonthsParse : (function (monthsShort) {
            var i, _shortMonthsParse = [];
            for (i = 0; i < 12; i++) {
                _shortMonthsParse[i] = new RegExp('^' + monthsShort[i] + '$', 'i');
            }
            return _shortMonthsParse;
        }(monthsShort)),
        longMonthsParse : (function (months) {
            var i, _longMonthsParse = [];
            for (i = 0; i < 12; i++) {
                _longMonthsParse[i] = new RegExp('^' + months[i] + '$', 'i');
            }
            return _longMonthsParse;
        }(months)),
        weekdays : 'neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota'.split('_'),
        weekdaysShort : 'ne_po_út_st_čt_pá_so'.split('_'),
        weekdaysMin : 'ne_po_út_st_čt_pá_so'.split('_'),
        longDateFormat : {
            LT: 'H:mm',
            LTS : 'H:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D. MMMM YYYY',
            LLL : 'D. MMMM YYYY H:mm',
            LLLL : 'dddd D. MMMM YYYY H:mm',
            l : 'D. M. YYYY'
        },
        calendar : {
            sameDay: '[dnes v] LT',
            nextDay: '[zítra v] LT',
            nextWeek: function () {
                switch (this.day()) {
                    case 0:
                        return '[v neděli v] LT';
                    case 1:
                    case 2:
                        return '[v] dddd [v] LT';
                    case 3:
                        return '[ve středu v] LT';
                    case 4:
                        return '[ve čtvrtek v] LT';
                    case 5:
                        return '[v pátek v] LT';
                    case 6:
                        return '[v sobotu v] LT';
                }
            },
            lastDay: '[včera v] LT',
            lastWeek: function () {
                switch (this.day()) {
                    case 0:
                        return '[minulou neděli v] LT';
                    case 1:
                    case 2:
                        return '[minulé] dddd [v] LT';
                    case 3:
                        return '[minulou středu v] LT';
                    case 4:
                    case 5:
                        return '[minulý] dddd [v] LT';
                    case 6:
                        return '[minulou sobotu v] LT';
                }
            },
            sameElse: 'L'
        },
        relativeTime : {
            future : 'za %s',
            past : 'před %s',
            s : translate,
            ss : translate,
            m : translate,
            mm : translate,
            h : translate,
            hh : translate,
            d : translate,
            dd : translate,
            M : translate,
            MM : translate,
            y : translate,
            yy : translate
        },
        dayOfMonthOrdinalParse : /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return cs;

})));


/*! Select2 4.1.0-rc.0 | https://github.com/select2/select2/blob/master/LICENSE.md */

!function(){if(jQuery&&jQuery.fn&&jQuery.fn.select2&&jQuery.fn.select2.amd)var e=jQuery.fn.select2.amd;e.define("select2/i18n/cs",[],function(){function e(e,n){switch(e){case 2:return n?"dva":"dvě";case 3:return"tři";case 4:return"čtyři"}return""}return{errorLoading:function(){return"Výsledky nemohly být načteny."},inputTooLong:function(n){var t=n.input.length-n.maximum;return 1==t?"Prosím, zadejte o jeden znak méně.":t<=4?"Prosím, zadejte o "+e(t,!0)+" znaky méně.":"Prosím, zadejte o "+t+" znaků méně."},inputTooShort:function(n){var t=n.minimum-n.input.length;return 1==t?"Prosím, zadejte ještě jeden znak.":t<=4?"Prosím, zadejte ještě další "+e(t,!0)+" znaky.":"Prosím, zadejte ještě dalších "+t+" znaků."},loadingMore:function(){return"Načítají se další výsledky…"},maximumSelected:function(n){var t=n.maximum;return 1==t?"Můžete zvolit jen jednu položku.":t<=4?"Můžete zvolit maximálně "+e(t,!1)+" položky.":"Můžete zvolit maximálně "+t+" položek."},noResults:function(){return"Nenalezeny žádné položky."},searching:function(){return"Vyhledávání…"},removeAllItems:function(){return"Odstraňte všechny položky"}}}),e.define,e.require}();

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
 * Czech
 */

if (!$.FE_LANGUAGE) {
    $.FE_LANGUAGE = {};
}

$.FE_LANGUAGE['cs'] = {
  translation: {
    // Place holder
    "Type something": "Napi\u0161te n\u011bco",

    // Basic formatting
    "Bold": "Tu\u010dn\u00e9",
    "Italic": "Kurz\u00edva",
    "Underline": "Podtr\u017een\u00e9",
    "Strikethrough": "P\u0159e\u0161krtnut\u00e9",

    // Main buttons
    "Insert": "Vlo\u017eit",
    "Delete": "Vymazat",
    "Cancel": "Zru\u0161it",
    "OK": "OK",
    "Back": "Zp\u011bt",
    "Remove": "Odstranit",
    "More": "V\u00edce",
    "Update": "Aktualizovat",
    "Style": "Styl",

    // Font
    "Font Family": "Typ p\u00edsma",
    "Font Size": "Velikost p\u00edsma",

    // Colors
    "Colors": "Barvy",
    "Background": "Pozad\u00ed",
    "Text": "P\u00edsmo",
    "HEX Color": "Hex Barvy",

    // Paragraphs
    "Paragraph Format": "Form\u00e1t odstavec",
    "Normal": "Norm\u00e1ln\u00ed",
    "Code": "K\u00f3d",
    "Heading 1": "Nadpis 1",
    "Heading 2": "Nadpis 2",
    "Heading 3": "Nadpis 3",
    "Heading 4": "Nadpis 4",

    // Style
    "Paragraph Style": "Odstavec styl",
    "Inline Style": "Inline styl",

    // Alignment
    "Align": "Zarovn\u00e1n\u00ed",
    "Align Left": "Zarovnat vlevo",
    "Align Center": "Zarovnat na st\u0159ed",
    "Align Right": "Zarovnat vpravo",
    "Align Justify": "Zarovnat do bloku",
    "None": "Nikdo",

    // Lists
    "Ordered List": "\u010c\u00edslovan\u00fd seznam",
    "Default": "Výchozí",
    "Lower Alpha": "Nižší alfa",
    "Lower Greek": "Nižší řečtina",
    "Lower Roman": "Nižší římský",
    "Upper Alpha": "Horní alfa",
    "Upper Roman": "Horní římský",

    "Unordered List": "Ne\u010d\u00edslovan\u00fd seznam",
    "Circle": "Kruh",
    "Disc": "Disk",
    "Square": "Náměstí",

    // Line height
    "Line Height": "Výška řádku",
    "Single": "Singl",
    "Double": "Dvojnásobek",

    // Indent
    "Decrease Indent": "Zmen\u0161it odsazen\u00ed",
    "Increase Indent": "Zv\u011bt\u0161it odsazen\u00ed",

    // Links
    "Insert Link": "Vlo\u017eit odkaz",
    "Open in new tab": "Otev\u0159\u00edt v nov\u00e9 z\u00e1lo\u017ece",
    "Open Link": "Otev\u0159\u00edt odkaz",
    "Edit Link": "Upravit odkaz",
    "Unlink": "Odstranit odkaz",
    "Choose Link": "Zvolte odkaz",

    // Images
    "Insert Image": "Vlo\u017eit obr\u00e1zek",
    "Upload Image": "Nahr\u00e1t obr\u00e1zek",
    "By URL": "Podle URL",
    "Browse": "Proch\u00e1zet",
    "Drop image": "P\u0159et\u00e1hn\u011bte sem obr\u00e1zek",
    "or click": "nebo zde klepn\u011bte",
    "Manage Images": "Spr\u00e1va obr\u00e1zk\u016f",
    "Loading": "Nakl\u00e1d\u00e1n\u00ed",
    "Deleting": "Odstran\u011bn\u00ed",
    "Tags": "Zna\u010dky",
    "Are you sure? Image will be deleted.": "Ur\u010dit\u011b? Obr\u00e1zek bude smaz\u00e1n.",
    "Replace": "Nahradit",
    "Uploading": "Nahr\u00e1v\u00e1n\u00ed",
    "Loading image": "Obr\u00e1zek se na\u010d\u00edt\u00e1",
    "Display": "Zobrazit",
    "Inline": "Inline",
    "Break Text": "P\u0159est\u00e1vka textu",
    "Alternative Text": "Alternativn\u00ed textu",
    "Change Size": "Zm\u011bnit velikost",
    "Width": "\u0160\u00ed\u0159ka",
    "Height": "V\u00fd\u0161ka",
    "Something went wrong. Please try again.": "N\u011bco se pokazilo. Pros\u00edm zkuste to znovu.",
    "Image Caption": "Obrázek titulku",
    "Advanced Edit": "Pokročilá úprava",

    // Video
    "Insert Video": "Vlo\u017eit video",
    "Embedded Code": "Vlo\u017een\u00fd k\u00f3d",
    "Paste in a video URL": "Vložit adresu URL videa",
    "Drop video": "Drop video",
    "Your browser does not support HTML5 video.": "Váš prohlížeč nepodporuje video html5.",
    "Upload Video": "Nahrát video",

    // Tables
    "Insert Table": "Vlo\u017eit tabulku",
    "Table Header": "Hlavi\u010dka tabulky",
    "Remove Table": "Odstranit tabulku",
    "Table Style": "Styl tabulky",
    "Horizontal Align": "Horizont\u00e1ln\u00ed zarovn\u00e1n\u00ed",
    "Row": "\u0158\u00e1dek",
    "Insert row above": "Vlo\u017eit \u0159\u00e1dek nad",
    "Insert row below": "Vlo\u017eit \u0159\u00e1dek pod",
    "Delete row": "Smazat \u0159\u00e1dek",
    "Column": "Sloupec",
    "Insert column before": "Vlo\u017eit sloupec vlevo",
    "Insert column after": "Vlo\u017eit sloupec vpravo",
    "Delete column": "Smazat sloupec",
    "Cell": "Bu\u0148ka",
    "Merge cells": "Slou\u010dit bu\u0148ky",
    "Horizontal split": "Horizont\u00e1ln\u00ed rozd\u011blen\u00ed",
    "Vertical split": "Vertik\u00e1ln\u00ed rozd\u011blen\u00ed",
    "Cell Background": "Bu\u0148ka pozad\u00ed",
    "Vertical Align": "Vertik\u00e1ln\u00ed zarovn\u00e1n\u00ed",
    "Top": "Vrchol",
    "Middle": "St\u0159ed",
    "Bottom": "Spodn\u00ed",
    "Align Top": "Zarovnat vrchol",
    "Align Middle": "Zarovnat st\u0159ed",
    "Align Bottom": "Zarovnat spodn\u00ed",
    "Cell Style": "Styl bu\u0148ky",

    // Files
    "Upload File": "Nahr\u00e1t soubor",
    "Drop file": "P\u0159et\u00e1hn\u011bte sem soubor",

    // Emoticons
    "Emoticons": "Emotikony",
    "Grinning face": "S \u00fasm\u011bvem tv\u00e1\u0159",
    "Grinning face with smiling eyes": "S \u00fasm\u011bvem obli\u010dej s o\u010dima s \u00fasm\u011bvem",
    "Face with tears of joy": "tv\u00e1\u0159 se slzami radosti",
    "Smiling face with open mouth": "Usm\u00edvaj\u00edc\u00ed se obli\u010dej s otev\u0159en\u00fdmi \u00fasty",
    "Smiling face with open mouth and smiling eyes": "Usm\u00edvaj\u00edc\u00ed se obli\u010dej s otev\u0159en\u00fdmi \u00fasty a o\u010dima s \u00fasm\u011bvem",
    "Smiling face with open mouth and cold sweat": "Usm\u00edvaj\u00edc\u00ed se tv\u00e1\u0159 s otev\u0159en\u00fdmi \u00fasty a studen\u00fd pot",
    "Smiling face with open mouth and tightly-closed eyes": "Usm\u00edvaj\u00edc\u00ed se tv\u00e1\u0159 s otev\u0159en\u00fdmi \u00fasty a t\u011bsn\u011b zav\u0159en\u00e9 o\u010di",
    "Smiling face with halo": "Usm\u00edvaj\u00edc\u00ed se obli\u010dej s halo",
    "Smiling face with horns": "Usm\u00edvaj\u00edc\u00ed se obli\u010dej s  rohy",
    "Winking face": "Mrk\u00e1n\u00ed tv\u00e1\u0159",
    "Smiling face with smiling eyes": "Usm\u00edvaj\u00edc\u00ed se obli\u010dej s  o\u010dima s \u00fasm\u011bvem",
    "Face savoring delicious food": "Tv\u00e1\u0159 vychutn\u00e1val chutn\u00e9 j\u00eddlo",
    "Relieved face": "Ulevilo tv\u00e1\u0159",
    "Smiling face with heart-shaped eyes": "Usm\u00edvaj\u00edc\u00ed se tv\u00e1\u0159 ve tvaru srdce o\u010dima",
    "Smiling face with sunglasses": "Usm\u00edvaj\u00edc\u00ed se tv\u00e1\u0159 se slune\u010dn\u00edmi br\u00fdlemi",
    "Smirking face": "Uculoval tv\u00e1\u0159",
    "Neutral face": "Neutr\u00e1ln\u00ed tv\u00e1\u0159",
    "Expressionless face": "Bezv\u00fdrazn\u00fd obli\u010dej",
    "Unamused face": "Ne pobaven\u00fd tv\u00e1\u0159",
    "Face with cold sweat": "Tv\u00e1\u0159 se studen\u00fdm potem",
    "Pensive face": "Zamy\u0161len\u00fd obli\u010dej",
    "Confused face": "Zmaten\u00fd tv\u00e1\u0159",
    "Confounded face": "Na\u0161tvan\u00fd tv\u00e1\u0159",
    "Kissing face": "L\u00edb\u00e1n\u00ed tv\u00e1\u0159",
    "Face throwing a kiss": "Tv\u00e1\u0159 h\u00e1zet polibek",
    "Kissing face with smiling eyes": "L\u00edb\u00e1n\u00ed obli\u010dej s o\u010dima s \u00fasm\u011bvem",
    "Kissing face with closed eyes": "L\u00edb\u00e1n\u00ed tv\u00e1\u0159 se zav\u0159en\u00fdma o\u010dima",
    "Face with stuck out tongue": "Tv\u00e1\u0159 s tr\u010dely jazyk",
    "Face with stuck out tongue and winking eye": "Tv\u00e1\u0159 s tr\u010dely jazykem a mrkat o\u010dima",
    "Face with stuck out tongue and tightly-closed eyes": "Suo\u010diti s tr\u010dely jazykem t\u011bsn\u011b zav\u0159en\u00e9 vidikovce",
    "Disappointed face": "Zklaman\u00fd tv\u00e1\u0159",
    "Worried face": "Boj\u00ed\u0161 se tv\u00e1\u0159",
    "Angry face": "Rozzloben\u00fd tv\u00e1\u0159",
    "Pouting face": "Na\u0161pulen\u00e9 tv\u00e1\u0159",
    "Crying face": "Pl\u00e1\u010d tv\u00e1\u0159",
    "Persevering face": "Vytrval\u00fdm tv\u00e1\u0159",
    "Face with look of triumph": "Tv\u00e1\u0159 s v\u00fdrazem triumfu",
    "Disappointed but relieved face": "Zklaman\u00fd ale ulevilo tv\u00e1\u0159",
    "Frowning face with open mouth": "Zamra\u010dil se obli\u010dej s otev\u0159en\u00fdmi \u00fasty",
    "Anguished face": "\u00fazkostn\u00e9 tv\u00e1\u0159",
    "Fearful face": "Stra\u0161n\u00fd tv\u00e1\u0159",
    "Weary face": "Unaven\u00fd tv\u00e1\u0159",
    "Sleepy face": "Ospal\u00fd tv\u00e1\u0159",
    "Tired face": "Unaven\u00fd tv\u00e1\u0159",
    "Grimacing face": "\u0161klebil tv\u00e1\u0159",
    "Loudly crying face": "Hlasit\u011b pl\u00e1\u010de tv\u00e1\u0159",
    "Face with open mouth": "Obli\u010dej s otev\u0159en\u00fdmi \u00fasty",
    "Hushed face": "Tlumen\u00fd tv\u00e1\u0159",
    "Face with open mouth and cold sweat": "Obli\u010dej s otev\u0159en\u00fdmi \u00fasty a studen\u00fd pot",
    "Face screaming in fear": "Tv\u00e1\u0159 k\u0159i\u010d\u00ed ve strachu",
    "Astonished face": "V \u00fa\u017easu tv\u00e1\u0159",
    "Flushed face": "Zarudnut\u00ed v obli\u010deji",
    "Sleeping face": "Sp\u00edc\u00ed tv\u00e1\u0159",
    "Dizzy face": "Z\u00e1vrat\u011b tv\u00e1\u0159",
    "Face without mouth": "Tv\u00e1\u0159 bez \u00fast",
    "Face with medical mask": "Tv\u00e1\u0159 s l\u00e9ka\u0159sk\u00fdm maskou",

    // Line breaker
    "Break": "P\u0159eru\u0161en\u00ed",

    // Math
    "Subscript": "Doln\u00ed index",
    "Superscript": "Horn\u00ed index",

    // Full screen
    "Fullscreen": "Cel\u00e1 obrazovka",

    // Horizontal line
    "Insert Horizontal Line": "Vlo\u017eit vodorovnou \u010d\u00e1ru",

    // Clear formatting
    "Clear Formatting": "Vymazat form\u00e1tov\u00e1n\u00ed",

    // Save
    "Save": "\u0055\u006c\u006f\u017e\u0069\u0074",

    // Undo, redo
    "Undo": "Zp\u011bt",
    "Redo": "Znovu",

    // Select all
    "Select All": "Vybrat v\u0161e",

    // Code view
    "Code View": "Zobrazen\u00ed k\u00f3d",

    // Quote
    "Quote": "Cit\u00e1t",
    "Increase": "Nav\u00fd\u0161it",
    "Decrease": "Sn\u00ed\u017een\u00ed",

    // Quick Insert
    "Quick Insert": "Rychl\u00e1 vlo\u017eka",

    // Spcial Characters
    "Special Characters": "Speciální znaky",
    "Latin": "Latinský",
    "Greek": "Řecký",
    "Cyrillic": "Cyrilice",
    "Punctuation": "Interpunkce",
    "Currency": "Měna",
    "Arrows": "Šipky",
    "Math": "Matematika",
    "Misc": "Misc",

    // Print.
    "Print": "Tisk",

    // Spell Checker.
    "Spell Checker": "Kontrola pravopisu",

    // Help
    "Help": "Pomoc",
    "Shortcuts": "Zkratky",
    "Inline Editor": "Inline editor",
    "Show the editor": "Zobrazit editor",
    "Common actions": "Společné akce",
    "Copy": "Kopírovat",
    "Cut": "Střih",
    "Paste": "Vložit",
    "Basic Formatting": "Základní formátování",
    "Increase quote level": "Zvýšení cenové hladiny",
    "Decrease quote level": "Snížit úroveň cenové nabídky",
    "Image / Video": "Obraz / video",
    "Resize larger": "Změna velikosti větší",
    "Resize smaller": "Změnit velikost menší",
    "Table": "Stůl",
    "Select table cell": "Vyberte buňku tabulky",
    "Extend selection one cell": "Rozšířit výběr o jednu buňku",
    "Extend selection one row": "Rozšířit výběr o jeden řádek",
    "Navigation": "Navigace",
    "Focus popup / toolbar": "Popup / panel nástrojů zaostření",
    "Return focus to previous position": "Návrat na předchozí pozici",

    // Embed.ly
    "Embed URL": "Vložte url",
    "Paste in a URL to embed": "Vložit adresu URL, kterou chcete vložit",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "Vložený obsah pochází z dokumentu Microsoft Word. chcete formát uchovat nebo jej vyčistit?",
    "Keep": "Držet",
    "Clean": "Čistý",
    "Word Paste Detected": "Slovní vložka zjištěna"
  },
  direction: "ltr"
};

}));

