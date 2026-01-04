/*
 * This file has been compiled from: /modules/system/lang/sk/client.php
 */
if (!window.oc) {
    window.oc = {};
}

if (!window.oc.langMessages) {
    window.oc.langMessages = {};
}

window.oc.langMessages['sk'] = $.extend(
    window.oc.langMessages['sk'] || {},
    {
    "markdowneditor": {
        "formatting": "Form\u00e1tovanie",
        "quote": "Cit\u00e1t",
        "code": "K\u00f3d",
        "header1": "Nadpis 1",
        "header2": "Nadpis 2",
        "header3": "Nadpis 3",
        "header4": "Nadpis 4",
        "header5": "Nadpis 5",
        "header6": "Nadpis 6",
        "bold": "Tu\u010dn\u00e9",
        "italic": "Kurz\u00edva",
        "unorderedlist": "Ne\u010d\u00edslovan\u00fd zoznam",
        "orderedlist": "\u010c\u00edslovan\u00fd zoznam",
        "snippet": "Snippet",
        "video": "Video",
        "image": "Obr\u00e1zok",
        "link": "Odkaz",
        "horizontalrule": "Vlo\u017ei\u0165 horizont\u00e1lnu linku",
        "fullscreen": "Cel\u00e1 obrazovka",
        "preview": "N\u00e1h\u013ead",
        "strikethrough": "Strikethrough",
        "cleanblock": "Clean Block",
        "table": "Table",
        "sidebyside": "Side by Side"
    },
    "mediamanager": {
        "insert_link": "Vlo\u017ei\u0165 odkaz",
        "insert_image": "Vlo\u017ei\u0165 obr\u00e1zok",
        "insert_video": "Vlo\u017ei\u0165 video",
        "insert_audio": "Vlo\u017ei\u0165 audio",
        "invalid_file_empty_insert": "Pros\u00edm vyberte s\u00fabor, na ktor\u00fd sa vlo\u017e\u00ed odkaz.",
        "invalid_file_single_insert": "Pros\u00edm vyberte jeden s\u00fabor.",
        "invalid_image_empty_insert": "Pros\u00edm vyberte obr\u00e1zky na vlo\u017eenie.",
        "invalid_video_empty_insert": "Pros\u00edm vyberte video na vlo\u017eenie.",
        "invalid_audio_empty_insert": "Pros\u00edm vyberte audio s\u00fabor na vlo\u017eenie."
    },
    "alert": {
        "error": "Error",
        "confirm": "Confirm",
        "dismiss": "Dismiss",
        "confirm_button_text": "OK",
        "cancel_button_text": "Zru\u0161i\u0165",
        "widget_remove_confirm": "Skuto\u010dne zmaza\u0165 tento widget?"
    },
    "datepicker": {
        "previousMonth": "Predch\u00e1dzaj\u00faci mesiac",
        "nextMonth": "Nasleduj\u00faci mesiac",
        "months": [
            "Janu\u00e1r",
            "Febru\u00e1r",
            "Marec",
            "Apr\u00edl",
            "M\u00e1j",
            "J\u00fan",
            "J\u00fal",
            "August",
            "September",
            "Okt\u00f3ber",
            "November",
            "December"
        ],
        "weekdays": [
            "Nede\u013ea",
            "Pondelok",
            "Utorok",
            "Streda",
            "\u0160tvrtok",
            "Piatok",
            "Sobota"
        ],
        "weekdaysShort": [
            "Ne",
            "Po",
            "Ut",
            "St",
            "\u0160t",
            "Pi",
            "So"
        ]
    },
    "colorpicker": {
        "choose": "OK"
    },
    "filter": {
        "group": {
            "all": "v\u0161etko"
        },
        "scopes": {
            "apply_button_text": "Apply",
            "clear_button_text": "Clear"
        },
        "dates": {
            "all": "v\u0161etko",
            "filter_button_text": "Filtrova\u0165",
            "reset_button_text": "Zru\u0161i\u0165",
            "date_placeholder": "D\u00e1tum",
            "after_placeholder": "Po",
            "before_placeholder": "Pred"
        },
        "numbers": {
            "all": "all",
            "filter_button_text": "Filter",
            "reset_button_text": "Zru\u0161i\u0165",
            "min_placeholder": "Min",
            "max_placeholder": "Max",
            "number_placeholder": "N\u00famero"
        }
    },
    "eventlog": {
        "show_stacktrace": "Zobrazi\u0165 stacktrace",
        "hide_stacktrace": "Skry\u0165 stacktrace",
        "tabs": {
            "formatted": "Form\u00e1tovan\u00e9",
            "raw": "P\u00f4vodn\u00e9 (raw)"
        },
        "editor": {
            "title": "Editor zdrojov\u00e9ho k\u00f3du",
            "description": "V\u00e1\u0161 opera\u010dn\u00fd syst\u00e9m by mal by\u0165 konfigurovan\u00fd tak, aby po\u010d\u00faval jednu z t\u00fdchto URL sh\u00e9m.",
            "openWith": "Otvori\u0165 v",
            "remember_choice": "Zapam\u00e4ta\u0165 si vybran\u00fa vo\u013ebu pre t\u00fato rel\u00e1ciu",
            "open": "Otvori\u0165",
            "cancel": "Zru\u0161i\u0165",
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


    var months = 'január_február_marec_apríl_máj_jún_júl_august_september_október_november_december'.split('_'),
        monthsShort = 'jan_feb_mar_apr_máj_jún_júl_aug_sep_okt_nov_dec'.split('_');
    function plural(n) {
        return (n > 1) && (n < 5);
    }
    function translate(number, withoutSuffix, key, isFuture) {
        var result = number + ' ';
        switch (key) {
            case 's':  // a few seconds / in a few seconds / a few seconds ago
                return (withoutSuffix || isFuture) ? 'pár sekúnd' : 'pár sekundami';
            case 'ss': // 9 seconds / in 9 seconds / 9 seconds ago
                if (withoutSuffix || isFuture) {
                    return result + (plural(number) ? 'sekundy' : 'sekúnd');
                } else {
                    return result + 'sekundami';
                }
                break;
            case 'm':  // a minute / in a minute / a minute ago
                return withoutSuffix ? 'minúta' : (isFuture ? 'minútu' : 'minútou');
            case 'mm': // 9 minutes / in 9 minutes / 9 minutes ago
                if (withoutSuffix || isFuture) {
                    return result + (plural(number) ? 'minúty' : 'minút');
                } else {
                    return result + 'minútami';
                }
                break;
            case 'h':  // an hour / in an hour / an hour ago
                return withoutSuffix ? 'hodina' : (isFuture ? 'hodinu' : 'hodinou');
            case 'hh': // 9 hours / in 9 hours / 9 hours ago
                if (withoutSuffix || isFuture) {
                    return result + (plural(number) ? 'hodiny' : 'hodín');
                } else {
                    return result + 'hodinami';
                }
                break;
            case 'd':  // a day / in a day / a day ago
                return (withoutSuffix || isFuture) ? 'deň' : 'dňom';
            case 'dd': // 9 days / in 9 days / 9 days ago
                if (withoutSuffix || isFuture) {
                    return result + (plural(number) ? 'dni' : 'dní');
                } else {
                    return result + 'dňami';
                }
                break;
            case 'M':  // a month / in a month / a month ago
                return (withoutSuffix || isFuture) ? 'mesiac' : 'mesiacom';
            case 'MM': // 9 months / in 9 months / 9 months ago
                if (withoutSuffix || isFuture) {
                    return result + (plural(number) ? 'mesiace' : 'mesiacov');
                } else {
                    return result + 'mesiacmi';
                }
                break;
            case 'y':  // a year / in a year / a year ago
                return (withoutSuffix || isFuture) ? 'rok' : 'rokom';
            case 'yy': // 9 years / in 9 years / 9 years ago
                if (withoutSuffix || isFuture) {
                    return result + (plural(number) ? 'roky' : 'rokov');
                } else {
                    return result + 'rokmi';
                }
                break;
        }
    }

    var sk = moment.defineLocale('sk', {
        months : months,
        monthsShort : monthsShort,
        weekdays : 'nedeľa_pondelok_utorok_streda_štvrtok_piatok_sobota'.split('_'),
        weekdaysShort : 'ne_po_ut_st_št_pi_so'.split('_'),
        weekdaysMin : 'ne_po_ut_st_št_pi_so'.split('_'),
        longDateFormat : {
            LT: 'H:mm',
            LTS : 'H:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D. MMMM YYYY',
            LLL : 'D. MMMM YYYY H:mm',
            LLLL : 'dddd D. MMMM YYYY H:mm'
        },
        calendar : {
            sameDay: '[dnes o] LT',
            nextDay: '[zajtra o] LT',
            nextWeek: function () {
                switch (this.day()) {
                    case 0:
                        return '[v nedeľu o] LT';
                    case 1:
                    case 2:
                        return '[v] dddd [o] LT';
                    case 3:
                        return '[v stredu o] LT';
                    case 4:
                        return '[vo štvrtok o] LT';
                    case 5:
                        return '[v piatok o] LT';
                    case 6:
                        return '[v sobotu o] LT';
                }
            },
            lastDay: '[včera o] LT',
            lastWeek: function () {
                switch (this.day()) {
                    case 0:
                        return '[minulú nedeľu o] LT';
                    case 1:
                    case 2:
                        return '[minulý] dddd [o] LT';
                    case 3:
                        return '[minulú stredu o] LT';
                    case 4:
                    case 5:
                        return '[minulý] dddd [o] LT';
                    case 6:
                        return '[minulú sobotu o] LT';
                }
            },
            sameElse: 'L'
        },
        relativeTime : {
            future : 'za %s',
            past : 'pred %s',
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
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return sk;

})));


/*! Select2 4.1.0-rc.0 | https://github.com/select2/select2/blob/master/LICENSE.md */

!function(){if(jQuery&&jQuery.fn&&jQuery.fn.select2&&jQuery.fn.select2.amd)var e=jQuery.fn.select2.amd;e.define("select2/i18n/sk",[],function(){var e={2:function(e){return e?"dva":"dve"},3:function(){return"tri"},4:function(){return"štyri"}};return{errorLoading:function(){return"Výsledky sa nepodarilo načítať."},inputTooLong:function(n){var t=n.input.length-n.maximum;return 1==t?"Prosím, zadajte o jeden znak menej":t>=2&&t<=4?"Prosím, zadajte o "+e[t](!0)+" znaky menej":"Prosím, zadajte o "+t+" znakov menej"},inputTooShort:function(n){var t=n.minimum-n.input.length;return 1==t?"Prosím, zadajte ešte jeden znak":t<=4?"Prosím, zadajte ešte ďalšie "+e[t](!0)+" znaky":"Prosím, zadajte ešte ďalších "+t+" znakov"},loadingMore:function(){return"Načítanie ďalších výsledkov…"},maximumSelected:function(n){return 1==n.maximum?"Môžete zvoliť len jednu položku":n.maximum>=2&&n.maximum<=4?"Môžete zvoliť najviac "+e[n.maximum](!1)+" položky":"Môžete zvoliť najviac "+n.maximum+" položiek"},noResults:function(){return"Nenašli sa žiadne položky"},searching:function(){return"Vyhľadávanie…"},removeAllItems:function(){return"Odstráňte všetky položky"}}}),e.define,e.require}();

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
 * Slovak
 */

if (!$.FE_LANGUAGE) {
    $.FE_LANGUAGE = {};
}

$.FE_LANGUAGE['sk'] = {
  translation: {

    // Place holder
    "Type something": "Nap\u00ed\u0161te hoci\u010do",

    // Basic formatting
    "Bold": "Tu\u010dn\u00e9",
    "Italic": "Kurz\u00edva",
    "Underline": "Pod\u010diarknut\u00e9",
    "Strikethrough": "Pre\u0161krtnut\u00e9",

    // Main buttons
    "Insert": "Vlo\u017ei\u0165",
    "Delete": "Vymaza\u0165",
    "Cancel": "Zru\u0161i\u0165",
    "OK": "OK",
    "Back": "Sp\u00e4\u0165",
    "Remove": "Odstr\u00e1ni\u0165",
    "More": "Viac",
    "Update": "Aktualizova\u0165",
    "Style": "\u0165t\u00fdl",

    // Font
    "Font Family": "Typ p\u00edsma",
    "Font Size": "Ve\u013ekos\u0165 p\u00edsma",

    // Colors
    "Colors": "Farby",
    "Background": "Pozadie",
    "Text": "Text",
    "HEX Color": "Hex Farby",

    // Paragraphs
    "Paragraph Format": "Form\u00e1t odstavca",
    "Normal": "Norm\u00e1lne",
    "Code": "K\u00f3d",
    "Heading 1": "Nadpis 1",
    "Heading 2": "Nadpis 2",
    "Heading 3": "Nadpis 3",
    "Heading 4": "Nadpis 4",

    // Style
    "Paragraph Style": "\u0165t\u00fdl odstavca",
    "Inline Style": "Inline \u0161t\u00fdl",

    // Alignment
    "Align": "Zarovnanie",
    "Align Left": "Zarovna\u0165 v\u013eavo",
    "Align Center": "Zarovna\u0165 na stred",
    "Align Right": "Zarovna\u0165 vpravo",
    "Align Justify": "Zarovna\u0165 do bloku",
    "None": "\u017diadne",

    // Lists
    "Ordered List": "\u010c\u00edslovan\u00fd zoznam",
    "Default": "Štandardné",
    "Lower Alpha": "Nižšia alfa",
    "Lower Greek": "Nižšie grécke",
    "Lower Roman": "Nižší roman",
    "Upper Alpha": "Horná alfa",
    "Upper Roman": "Horný román",

    "Unordered List": "Ne\u010d\u00edslovan\u00fd zoznam",
    "Circle": "Kružnice",
    "Disc": "Kotúč",
    "Square": "Námestie",

    // Line height
    "Line Height": "Výška riadku",
    "Single": "Jednoposteľová",
    "Double": "Dvojitý",

    // Indent
    "Decrease Indent": "Zmen\u0161i\u0165 odsadenie",
    "Increase Indent": "Zv\u00e4\u010d\u0161i\u0165 odsadenie",

    // Links
    "Insert Link": "Vlo\u017ei\u0165 odkaz",
    "Open in new tab": "Otvori\u0165 v novom okne",
    "Open Link": "Otvori\u0165 odkaz",
    "Edit Link": "Upravi\u0165 odkaz",
    "Unlink": "Odstr\u00e1ni\u0165 odkaz",
    "Choose Link": "Vyberte odkaz",

    // Images
    "Insert Image": "Vlo\u017ei\u0165 obr\u00e1zok",
    "Upload Image": "Nahra\u0165 obr\u00e1zok",
    "By URL": "Z URL adresy",
    "Browse": "Vybra\u0165",
    "Drop image": "Pretiahnite obr\u00e1zok do tohto miesta",
    "or click": "alebo kliknite a vlo\u017ete",
    "Manage Images": "Spr\u00e1va obr\u00e1zkov",
    "Loading": "Nahr\u00e1vam",
    "Deleting": "Odstra\u0148ujem",
    "Tags": "Zna\u010dky",
    "Are you sure? Image will be deleted.": "Ste si ist\u00fd? Obr\u00e1zok bude odstranen\u00fd.",
    "Replace": "Vymeni\u0165",
    "Uploading": "Nahr\u00e1vam",
    "Loading image": "Obr\u00e1zok se na\u010d\u00edtav\u00e1",
    "Display": "Zobrazi\u0165",
    "Inline": "Inline",
    "Break Text": "Zalomenie textu",
    "Alternative Text": "Alternat\u00edvny text",
    "Change Size": "Zmeni\u0165 ve\u013ekos\u0165",
    "Width": "\u0165\u00edrka",
    "Height": "V\u00fd\u0161ka",
    "Something went wrong. Please try again.": "Nie\u010do sa pokazilo. Pros\u00edm, sk\u00faste to znova.",
    "Image Caption": "Titulok obrázka",
    "Advanced Edit": "Pokročilá úprava",

    // Video
    "Insert Video": "Vlo\u017ei\u0165 video",
    "Embedded Code": "Vlo\u017een\u00fd k\u00f3d",
    "Paste in a video URL": "Vložte do adresy URL videa",
    "Drop video": "Drop video",
    "Your browser does not support HTML5 video.": "Váš prehliadač nepodporuje video html5.",
    "Upload Video": "Nahrať video",

    // Tables
    "Insert Table": "Vlo\u017ei\u0165 tabu\u013eku",
    "Table Header": "Hlavi\u010dka tabu\u013eky",
    "Remove Table": "Odstrani\u0165 tabu\u013eku",
    "Table Style": "\u0165t\u00fdl tabu\u013eky",
    "Horizontal Align": "Horizont\u00e1lne zarovnanie",
    "Row": "Riadok",
    "Insert row above": "Vlo\u017ei\u0165 riadok nad",
    "Insert row below": "Vlo\u017ei\u0165 riadok pod",
    "Delete row": "Odstrani\u0165 riadok",
    "Column": "St\u013apec",
    "Insert column before": "Vlo\u017ei\u0165 st\u013apec v\u013eavo",
    "Insert column after": "Vlo\u017ei\u0165 st\u013apec vpravo",
    "Delete column": "Odstrani\u0165 st\u013apec",
    "Cell": "Bunka",
    "Merge cells": "Zl\u00fa\u010di\u0165 bunky",
    "Horizontal split": "Horizont\u00e1lne rozdelenie",
    "Vertical split": "Vertik\u00e1lne rozdelenie",
    "Cell Background": "Bunka pozadia",
    "Vertical Align": "Vertik\u00e1lne zarovn\u00e1n\u00ed",
    "Top": "Vrch",
    "Middle": "Stred",
    "Bottom": "Spodok",
    "Align Top": "Zarovnat na vrch",
    "Align Middle": "Zarovnat na stred",
    "Align Bottom": "Zarovnat na spodok",
    "Cell Style": "\u0165t\u00fdl bunky",

    // Files
    "Upload File": "Nahra\u0165 s\u00fabor",
    "Drop file": "Vlo\u017ete s\u00fabor sem",

    // Emoticons
    "Emoticons": "Emotikony",
    "Grinning face": "Tv\u00e1r s \u00fasmevom",
    "Grinning face with smiling eyes": "Tv\u00e1r s \u00fasmevom a o\u010dami",
    "Face with tears of joy": "Tv\u00e1r so slzamy radosti",
    "Smiling face with open mouth": "Usmievaj\u00faci sa tv\u00e1r s otvoren\u00fdmi \u00fastami",
    "Smiling face with open mouth and smiling eyes": "Usmievaj\u00faci sa tv\u00e1r s otvoren\u00fdmi \u00fastami a o\u010dami",
    "Smiling face with open mouth and cold sweat": "Usmievaj\u00faci sa tv\u00e1r s otvoren\u00fdmi \u00fastami a studen\u00fd pot",
    "Smiling face with open mouth and tightly-closed eyes": "Usmievaj\u00faci sa tv\u00e1r s otvoren\u00fdmi \u00fastami a zavret\u00fdmi o\u010dami",
    "Smiling face with halo": "Usmievaj\u00faci sa tv\u00e1r s halo",
    "Smiling face with horns": "Usmievaj\u00faci sa tv\u00e1r s rohmi",
    "Winking face": "Mrkaj\u00faca tv\u00e1r",
    "Smiling face with smiling eyes": "Usmievaj\u00faci sa tv\u00e1r a o\u010dami",
    "Face savoring delicious food": "Tv\u00e1r vychutn\u00e1vaj\u00faca si chutn\u00e9 jedlo",
    "Relieved face": "Spokojn\u00e1 tv\u00e1r",
    "Smiling face with heart-shaped eyes": "Usmievaj\u00faci sa tv\u00e1r s o\u010dami v tvare srdca",
    "Smiling face with sunglasses": "Usmievaj\u00faci sa tv\u00e1r so slne\u010dn\u00fdmi okuliarmi",
    "Smirking face": "U\u0161k\u0155\u0148aj\u00faca sa tv\u00e1r",
    "Neutral face": "Neutr\u00e1lna tva\u0155",
    "Expressionless face": "Bezv\u00fdrazn\u00e1 tv\u00e1r",
    "Unamused face": "Nepobaven\u00e1 tv\u00e1r",
    "Face with cold sweat": "Tv\u00e1r so studen\u00fdm potom",
    "Pensive face": "Zamyslen\u00e1 tv\u00e1r",
    "Confused face": "Zmeten\u00e1 tv\u00e1r",
    "Confounded face": "Nahnevan\u00e1 tv\u00e1r",
    "Kissing face": "Bozkavaj\u00faca tv\u00e1r",
    "Face throwing a kiss": "Tv\u00e1r hadzaj\u00faca pusu",
    "Kissing face with smiling eyes": "Bozk\u00e1vaj\u00faca tv\u00e1r s o\u010dami a \u00fasmevom",
    "Kissing face with closed eyes": "Bozk\u00e1vaj\u00faca tv\u00e1r so zavret\u00fdmi o\u010dami",
    "Face with stuck out tongue": "Tv\u00e1r s vyplazen\u00fdm jazykom",
    "Face with stuck out tongue and winking eye": "Mrkaj\u00faca tv\u00e1r s vyplazen\u00fdm jazykom",
    "Face with stuck out tongue and tightly-closed eyes": "Tv\u00e1r s vyplazen\u00fdm jazykom a privret\u00fdmi o\u010dami",
    "Disappointed face": "Sklaman\u00e1 tv\u00e1r",
    "Worried face": "Obavaj\u00faca se tv\u00e1r",
    "Angry face": "Nahnevan\u00e1 tv\u00e1r",
    "Pouting face": "Na\u0161pulen\u00e1 tv\u00e1r",
    "Crying face": "Pla\u010d\u00faca tv\u00e1r",
    "Persevering face": "H\u00fa\u017eevnat\u00e1 tv\u00e1r",
    "Face with look of triumph": "Tv\u00e1r s v\u00fdrazom v\u00ed\u0165aza",
    "Disappointed but relieved face": "Sklaman\u00e1 ale spokojn\u00e1 tv\u00e1r",
    "Frowning face with open mouth": "Zamra\u010den\u00e1 tvar s otvoren\u00fdmi \u00fastami",
    "Anguished face": "\u00dazkostn\u00e1 tv\u00e1r",
    "Fearful face": "Strachuj\u00faca sa tv\u00e1r",
    "Weary face": "Unaven\u00e1 tv\u00e1r",
    "Sleepy face": "Ospal\u00e1 tv\u00e1r",
    "Tired face": "Unaven\u00e1 tv\u00e1r",
    "Grimacing face": "Sv\u00e1r s grimasou",
    "Loudly crying face": "Nahlas pl\u00e1\u010d\u00faca tv\u00e1r",
    "Face with open mouth": "Tv\u00e1r s otvoren\u00fdm \u00fastami",
    "Hushed face": "Ml\u010diaca tv\u00e1r",
    "Face with open mouth and cold sweat": "Tv\u00e1r s otvoren\u00fdmi \u00fastami a studen\u00fdm potom",
    "Face screaming in fear": "Tv\u00e1r kri\u010diaca strachom",
    "Astonished face": "Tv\u00e1r v \u00fa\u017ease",
    "Flushed face": "S\u010dervenanie v tv\u00e1ri",
    "Sleeping face": "Spiaca tv\u00e1r",
    "Dizzy face": "Tv\u00e1r vyjadruj\u00faca z\u00e1vrat",
    "Face without mouth": "Tv\u00e1r bez \u00fast",
    "Face with medical mask": "Tv\u00e1r s lek\u00e1rskou maskou",

    // Line breaker
    "Break": "Zalomenie",

    // Math
    "Subscript": "Doln\u00fd index",
    "Superscript": "Horn\u00fd index",

    // Full screen
    "Fullscreen": "Cel\u00e1 obrazovka",

    // Horizontal line
    "Insert Horizontal Line": "Vlo\u017ei\u0165 vodorovn\u00fa \u010diaru",

    // Clear formatting
    "Clear Formatting": "Vymaza\u0165 formatovanie",

    // Save
    "Save": "\u0055\u006c\u006f\u017e\u0069\u0165",

    // Undo, redo
    "Undo": "Sp\u00e4\u0165",
    "Redo": "Znova",

    // Select all
    "Select All": "Vybra\u0165 v\u0161etko",

    // Code view
    "Code View": "Zobrazi\u0165 html k\u00f3d",

    // Quote
    "Quote": "Cit\u00e1t",
    "Increase": "Nav\u00fd\u0161i\u0165",
    "Decrease": "Zn\u00ed\u017ei\u0165",

    // Quick Insert
    "Quick Insert": "Vlo\u017ei\u0165 zr\u00fdchlene",

    // Spcial Characters
    "Special Characters": "Špeciálne znaky",
    "Latin": "Latinčina",
    "Greek": "Grécky",
    "Cyrillic": "Cyriliky",
    "Punctuation": "Interpunkcia",
    "Currency": "Mena",
    "Arrows": "Šípky",
    "Math": "Matematika",
    "Misc": "Misc",

    // Print.
    "Print": "Vytlačiť",

    // Spell Checker.
    "Spell Checker": "Kontrola pravopisu",

    // Help
    "Help": "Pomoc",
    "Shortcuts": "Skratky",
    "Inline Editor": "Inline editor",
    "Show the editor": "Zobraziť editor",
    "Common actions": "Spoločné akcie",
    "Copy": "Kópie",
    "Cut": "Rez",
    "Paste": "Pasta",
    "Basic Formatting": "Základné formátovanie",
    "Increase quote level": "Zvýšiť úroveň cenovej ponuky",
    "Decrease quote level": "Znížiť úroveň cenovej ponuky",
    "Image / Video": "Obrázok / video",
    "Resize larger": "Zmena veľkosti",
    "Resize smaller": "Meniť veľkosť",
    "Table": "Stôl",
    "Select table cell": "Vyberte bunku tabuľky",
    "Extend selection one cell": "Rozšíriť výber jednej bunky",
    "Extend selection one row": "Rozšíriť výber o jeden riadok",
    "Navigation": "Navigácia",
    "Focus popup / toolbar": "Zameranie / panel s nástrojmi",
    "Return focus to previous position": "Vrátiť zaostrenie na predchádzajúcu pozíciu",

    // Embed.ly
    "Embed URL": "Vložiť adresu URL",
    "Paste in a URL to embed": "Vložte do adresy URL, ktorú chcete vložiť",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "Vložený obsah vychádza z dokumentu Microsoft Word. chcete formát uchovať alebo ho vyčistiť?",
    "Keep": "Zachovať",
    "Clean": "Čistý",
    "Word Paste Detected": "Slovná vložka bola zistená"
  },
  direction: "ltr"
};
}));

