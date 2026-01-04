/*
 * This file has been compiled from: /modules/system/lang/ar/client.php
 */
if (!window.oc) {
    window.oc = {};
}

if (!window.oc.langMessages) {
    window.oc.langMessages = {};
}

window.oc.langMessages['ar'] = $.extend(
    window.oc.langMessages['ar'] || {},
    {
    "markdowneditor": {
        "formatting": "\u0627\u0644\u062a\u0646\u0633\u064a\u0642",
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
            "max_placeholder": "Max"
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
            "cancel": "Cancel"
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


    var symbolMap = {
        '1': '١',
        '2': '٢',
        '3': '٣',
        '4': '٤',
        '5': '٥',
        '6': '٦',
        '7': '٧',
        '8': '٨',
        '9': '٩',
        '0': '٠'
    }, numberMap = {
        '١': '1',
        '٢': '2',
        '٣': '3',
        '٤': '4',
        '٥': '5',
        '٦': '6',
        '٧': '7',
        '٨': '8',
        '٩': '9',
        '٠': '0'
    }, pluralForm = function (n) {
        return n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5;
    }, plurals = {
        s : ['أقل من ثانية', 'ثانية واحدة', ['ثانيتان', 'ثانيتين'], '%d ثوان', '%d ثانية', '%d ثانية'],
        m : ['أقل من دقيقة', 'دقيقة واحدة', ['دقيقتان', 'دقيقتين'], '%d دقائق', '%d دقيقة', '%d دقيقة'],
        h : ['أقل من ساعة', 'ساعة واحدة', ['ساعتان', 'ساعتين'], '%d ساعات', '%d ساعة', '%d ساعة'],
        d : ['أقل من يوم', 'يوم واحد', ['يومان', 'يومين'], '%d أيام', '%d يومًا', '%d يوم'],
        M : ['أقل من شهر', 'شهر واحد', ['شهران', 'شهرين'], '%d أشهر', '%d شهرا', '%d شهر'],
        y : ['أقل من عام', 'عام واحد', ['عامان', 'عامين'], '%d أعوام', '%d عامًا', '%d عام']
    }, pluralize = function (u) {
        return function (number, withoutSuffix, string, isFuture) {
            var f = pluralForm(number),
                str = plurals[u][pluralForm(number)];
            if (f === 2) {
                str = str[withoutSuffix ? 0 : 1];
            }
            return str.replace(/%d/i, number);
        };
    }, months = [
        'يناير',
        'فبراير',
        'مارس',
        'أبريل',
        'مايو',
        'يونيو',
        'يوليو',
        'أغسطس',
        'سبتمبر',
        'أكتوبر',
        'نوفمبر',
        'ديسمبر'
    ];

    var ar = moment.defineLocale('ar', {
        months : months,
        monthsShort : months,
        weekdays : 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
        weekdaysShort : 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
        weekdaysMin : 'ح_ن_ث_ر_خ_ج_س'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'D/\u200FM/\u200FYYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd D MMMM YYYY HH:mm'
        },
        meridiemParse: /ص|م/,
        isPM : function (input) {
            return 'م' === input;
        },
        meridiem : function (hour, minute, isLower) {
            if (hour < 12) {
                return 'ص';
            } else {
                return 'م';
            }
        },
        calendar : {
            sameDay: '[اليوم عند الساعة] LT',
            nextDay: '[غدًا عند الساعة] LT',
            nextWeek: 'dddd [عند الساعة] LT',
            lastDay: '[أمس عند الساعة] LT',
            lastWeek: 'dddd [عند الساعة] LT',
            sameElse: 'L'
        },
        relativeTime : {
            future : 'بعد %s',
            past : 'منذ %s',
            s : pluralize('s'),
            ss : pluralize('s'),
            m : pluralize('m'),
            mm : pluralize('m'),
            h : pluralize('h'),
            hh : pluralize('h'),
            d : pluralize('d'),
            dd : pluralize('d'),
            M : pluralize('M'),
            MM : pluralize('M'),
            y : pluralize('y'),
            yy : pluralize('y')
        },
        preparse: function (string) {
            return string.replace(/[١٢٣٤٥٦٧٨٩٠]/g, function (match) {
                return numberMap[match];
            }).replace(/،/g, ',');
        },
        postformat: function (string) {
            return string.replace(/\d/g, function (match) {
                return symbolMap[match];
            }).replace(/,/g, '،');
        },
        week : {
            dow : 6, // Saturday is the first day of the week.
            doy : 12  // The week that contains Jan 1st is the first week of the year.
        }
    });

    return ar;

})));


/*! Select2 4.1.0-rc.0 | https://github.com/select2/select2/blob/master/LICENSE.md */

!function(){if(jQuery&&jQuery.fn&&jQuery.fn.select2&&jQuery.fn.select2.amd)var n=jQuery.fn.select2.amd;n.define("select2/i18n/ar",[],function(){return{errorLoading:function(){return"لا يمكن تحميل النتائج"},inputTooLong:function(n){return"الرجاء حذف "+(n.input.length-n.maximum)+" عناصر"},inputTooShort:function(n){return"الرجاء إضافة "+(n.minimum-n.input.length)+" عناصر"},loadingMore:function(){return"جاري تحميل نتائج إضافية..."},maximumSelected:function(n){return"تستطيع إختيار "+n.maximum+" بنود فقط"},noResults:function(){return"لم يتم العثور على أي نتائج"},searching:function(){return"جاري البحث…"},removeAllItems:function(){return"قم بإزالة كل العناصر"}}}),n.define,n.require}();

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
 * Arabic
 */

if (!$.FE_LANGUAGE) {
    $.FE_LANGUAGE = {};
}

$.FE_LANGUAGE['ar'] = {
  translation: {
    // Place holder
    "Type something": "\u0627\u0643\u062a\u0628 \u0634\u064a\u0626\u0627",

    // Basic formatting
    "Bold": "\u063a\u0627\u0645\u0642",
    "Italic": "\u0645\u0627\u0626\u0644",
    "Underline": "\u062a\u0633\u0637\u064a\u0631",
    "Strikethrough": "\u064a\u062a\u0648\u0633\u0637 \u062e\u0637",

    // Main buttons
    "Insert": "\u0625\u062f\u0631\u0627\u062c",
    "Delete": "\u062d\u0630\u0641",
    "Cancel": "\u0625\u0644\u063a\u0627\u0621",
    "OK": "\u0645\u0648\u0627\u0641\u0642",
    "Back": "\u0638\u0647\u0631",
    "Remove": "\u0625\u0632\u0627\u0644\u0629",
    "More": "\u0623\u0643\u062b\u0631",
    "Update": "\u0627\u0644\u062a\u062d\u062f\u064a\u062b",
    "Style": "\u0623\u0633\u0644\u0648\u0628",

    // Font
    "Font Family": "\u0639\u0627\u0626\u0644\u0629 \u0627\u0644\u062e\u0637",
    "Font Size": "\u062d\u062c\u0645 \u0627\u0644\u062e\u0637",

    // Colors
    "Colors": "\u0627\u0644\u0623\u0644\u0648\u0627\u0646",
    "Background": "\u0627\u0644\u062e\u0644\u0641\u064a\u0629",
    "Text": "\u0627\u0644\u0646\u0635",
    "HEX Color": "عرافة اللون",

    // Paragraphs
    "Paragraph Format": "\u062a\u0646\u0633\u064a\u0642 \u0627\u0644\u0641\u0642\u0631\u0629",
    "Normal": "\u0637\u0628\u064a\u0639\u064a",
    "Code": "\u0643\u0648\u062f",
    "Heading 1": "\u0627\u0644\u0639\u0646\u0627\u0648\u064a\u0646 1",
    "Heading 2": "\u0627\u0644\u0639\u0646\u0627\u0648\u064a\u0646 2",
    "Heading 3": "\u0627\u0644\u0639\u0646\u0627\u0648\u064a\u0646 3",
    "Heading 4": "\u0627\u0644\u0639\u0646\u0627\u0648\u064a\u0646 4",

    // Style
    "Paragraph Style": "\u0646\u0645\u0637 \u0627\u0644\u0641\u0642\u0631\u0629",
    "Inline Style": "\u0627\u0644\u0646\u0645\u0637 \u0627\u0644\u0645\u0636\u0645\u0646",

    // Alignment
    "Align": "\u0645\u062d\u0627\u0630\u0627\u0629",
    "Align Left": "\u0645\u062d\u0627\u0630\u0627\u0629 \u0627\u0644\u0646\u0635 \u0644\u0644\u064a\u0633\u0627\u0631",
    "Align Center": "\u062a\u0648\u0633\u064a\u0637",
    "Align Right": "\u0645\u062d\u0627\u0630\u0627\u0629 \u0627\u0644\u0646\u0635 \u0644\u0644\u064a\u0645\u064a\u0646",
    "Align Justify": "\u0636\u0628\u0637",
    "None": "\u0644\u0627 \u0634\u064a\u0621",

    // Lists
    "Ordered List": "\u0642\u0627\u0626\u0645\u0629 \u0645\u0631\u062a\u0628\u0629",
    "Default": "الافتراضي",
    "Lower Alpha": "أقل ألفا",
    "Lower Greek": "أقل اليونانية",
    "Lower Roman": "انخفاض الروماني",
    "Upper Alpha": "العلوي ألفا",
    "Upper Roman": "الروماني العلوي",

    "Unordered List": "\u0642\u0627\u0626\u0645\u0629 \u063a\u064a\u0631 \u0645\u0631\u062a\u0628\u0629",
    "Circle": "دائرة",
    "Disc": "القرص",
    "Square": "ميدان",

    // Line height
    "Line Height": "ارتفاع خط",
    "Single": "غير مرتبطة",
    "Double": "مزدوج",

    // Indent
    "Decrease Indent": "\u0627\u0646\u062e\u0641\u0627\u0636 \u0627\u0644\u0645\u0633\u0627\u0641\u0629 \u0627\u0644\u0628\u0627\u062f\u0626\u0629",
    "Increase Indent": "\u0632\u064a\u0627\u062f\u0629 \u0627\u0644\u0645\u0633\u0627\u0641\u0629 \u0627\u0644\u0628\u0627\u062f\u0626\u0629",

    // Links
    "Insert Link": "\u0625\u062f\u0631\u0627\u062c \u0631\u0627\u0628\u0637",
    "Open in new tab": "\u0641\u062a\u062d \u0641\u064a \u0639\u0644\u0627\u0645\u0629 \u062a\u0628\u0648\u064a\u0628 \u062c\u062f\u064a\u062f\u0629",
    "Open Link": "\u0627\u0641\u062a\u062d \u0627\u0644\u0631\u0627\u0628\u0637",
    "Edit Link": "\u0627\u0631\u062a\u0628\u0627\u0637 \u062a\u062d\u0631\u064a\u0631",
    "Unlink": "\u062d\u0630\u0641 \u0627\u0644\u0631\u0627\u0628\u0637",
    "Choose Link": "\u0627\u062e\u062a\u064a\u0627\u0631 \u0635\u0644\u0629",

    // Images
    "Insert Image": "\u0625\u062f\u0631\u0627\u062c \u0635\u0648\u0631\u0629",
    "Upload Image": "\u062a\u062d\u0645\u064a\u0644 \u0635\u0648\u0631\u0629",
    "By URL": "\u0628\u0648\u0627\u0633\u0637\u0629 URL",
    "Browse": "\u062a\u0635\u0641\u062d",
    "Drop image": "\u0625\u0633\u0642\u0627\u0637 \u0635\u0648\u0631\u0629",
    "or click": "\u0623\u0648 \u0627\u0646\u0642\u0631 \u0641\u0648\u0642",
    "Manage Images": "\u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u0635\u0648\u0631",
    "Loading": "\u062a\u062d\u0645\u064a\u0644",
    "Deleting": "\u062d\u0630\u0641",
    "Tags": "\u0627\u0644\u0643\u0644\u0645\u0627\u062a",
    "Are you sure? Image will be deleted.": "\u0647\u0644 \u0623\u0646\u062a \u0645\u062a\u0623\u0643\u062f\u061f \u0633\u064a\u062a\u0645 \u062d\u0630\u0641 \u0627\u0644\u0635\u0648\u0631\u0629\u002e",
    "Replace": "\u0627\u0633\u062a\u0628\u062f\u0627\u0644",
    "Uploading": "\u062a\u062d\u0645\u064a\u0644",
    "Loading image": "\u0635\u0648\u0631\u0629 \u062a\u062d\u0645\u064a\u0644",
    "Display": "\u0639\u0631\u0636",
    "Inline": "\u0641\u064a \u062e\u0637",
    "Break Text": "\u0646\u0635 \u0627\u0633\u062a\u0631\u0627\u062d\u0629",
    "Alternative Text": "\u0646\u0635 \u0628\u062f\u064a\u0644",
    "Change Size": "\u062a\u063a\u064a\u064a\u0631 \u062d\u062c\u0645",
    "Width": "\u0639\u0631\u0636",
    "Height": "\u0627\u0631\u062a\u0641\u0627\u0639",
    "Something went wrong. Please try again.": ".\u062d\u062f\u062b \u062e\u0637\u0623 \u0645\u0627. \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0627\u062e\u0631\u0649",
    "Image Caption": "تعليق على الصورة",
    "Advanced Edit": "تعديل متقدم",

    // Video
    "Insert Video": "\u0625\u062f\u0631\u0627\u062c \u0641\u064a\u062f\u064a\u0648",
    "Embedded Code": "\u0627\u0644\u062a\u0639\u0644\u064a\u0645\u0627\u062a \u0627\u0644\u0628\u0631\u0645\u062c\u064a\u0629 \u0627\u0644\u0645\u0636\u0645\u0646\u0629",
    "Paste in a video URL": "لصق في عنوان ورل للفيديو",
    "Drop video": "انخفاض الفيديو",
    "Your browser does not support HTML5 video.": "متصفحك لا يدعم فيديو HTML5.",
    "Upload Video": "رفع فيديو",

    // Tables
    "Insert Table": "\u0625\u062f\u0631\u0627\u062c \u062c\u062f\u0648\u0644",
    "Table Header": "\u0631\u0623\u0633 \u0627\u0644\u062c\u062f\u0648\u0644",
    "Remove Table": "\u0625\u0632\u0627\u0644\u0629 \u0627\u0644\u062c\u062f\u0648\u0644",
    "Table Style": "\u0646\u0645\u0637 \u0627\u0644\u062c\u062f\u0648\u0644",
    "Horizontal Align": "\u0645\u062d\u0627\u0630\u0627\u0629 \u0623\u0641\u0642\u064a\u0629",
    "Row": "\u0635\u0641",
    "Insert row above": "\u0625\u062f\u0631\u0627\u062c \u0635\u0641 \u0644\u0644\u0623\u0639\u0644\u0649",
    "Insert row below": "\u0625\u062f\u0631\u0627\u062c \u0635\u0641 \u0644\u0644\u0623\u0633\u0641\u0644",
    "Delete row": "\u062d\u0630\u0641 \u0635\u0641",
    "Column": "\u0639\u0645\u0648\u062f",
    "Insert column before": "\u0625\u062f\u0631\u0627\u062c \u0639\u0645\u0648\u062f \u0644\u0644\u064a\u0633\u0627\u0631",
    "Insert column after": "\u0625\u062f\u0631\u0627\u062c \u0639\u0645\u0648\u062f \u0644\u0644\u064a\u0645\u064a\u0646",
    "Delete column": "\u062d\u0630\u0641 \u0639\u0645\u0648\u062f",
    "Cell": "\u062e\u0644\u064a\u0629",
    "Merge cells": "\u062f\u0645\u062c \u062e\u0644\u0627\u064a\u0627",
    "Horizontal split": "\u0627\u0646\u0642\u0633\u0627\u0645 \u0623\u0641\u0642\u064a",
    "Vertical split": "\u0627\u0644\u0627\u0646\u0642\u0633\u0627\u0645 \u0627\u0644\u0639\u0645\u0648\u062f\u064a",
    "Cell Background": "\u062e\u0644\u0641\u064a\u0629 \u0627\u0644\u062e\u0644\u064a\u0629",
    "Vertical Align": "\u0645\u062d\u0627\u0630\u0627\u0629 \u0639\u0645\u0648\u062f\u064a\u0629",
    "Top": "\u0623\u0639\u0644\u0649",
    "Middle": "\u0648\u0633\u0637",
    "Bottom": "\u0623\u0633\u0641\u0644",
    "Align Top": "\u0645\u062d\u0627\u0630\u0627\u0629 \u0623\u0639\u0644\u0649",
    "Align Middle": "\u0645\u062d\u0627\u0630\u0627\u0629 \u0648\u0633\u0637",
    "Align Bottom": "\u0645\u062d\u0627\u0630\u0627\u0629 \u0627\u0644\u0623\u0633\u0641\u0644",
    "Cell Style": "\u0646\u0645\u0637 \u0627\u0644\u062e\u0644\u064a\u0629",

    // Files
    "Upload File": "\u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u0645\u0644\u0641",
    "Drop file": "\u0627\u0646\u062e\u0641\u0627\u0636 \u0627\u0644\u0645\u0644\u0641",

    // Emoticons
    "Emoticons": "\u0627\u0644\u0645\u0634\u0627\u0639\u0631",
    "Grinning face": "\u064a\u0643\u0634\u0631 \u0648\u062c\u0647\u0647",
    "Grinning face with smiling eyes": "\u0645\u0628\u062a\u0633\u0645\u0627 \u0648\u062c\u0647 \u0645\u0639 \u064a\u0628\u062a\u0633\u0645 \u0627\u0644\u0639\u064a\u0646",
    "Face with tears of joy": "\u0648\u062c\u0647 \u0645\u0639 \u062f\u0645\u0648\u0639 \u0627\u0644\u0641\u0631\u062d",
    "Smiling face with open mouth": "\u0627\u0644\u0648\u062c\u0647 \u0627\u0644\u0645\u0628\u062a\u0633\u0645 \u0645\u0639 \u0641\u062a\u062d \u0627\u0644\u0641\u0645",
    "Smiling face with open mouth and smiling eyes": "\u0627\u0644\u0648\u062c\u0647 \u0627\u0644\u0645\u0628\u062a\u0633\u0645 \u0645\u0639 \u0641\u062a\u062d \u0627\u0644\u0641\u0645 \u0648\u0627\u0644\u0639\u064a\u0646\u064a\u0646 \u064a\u0628\u062a\u0633\u0645",
    "Smiling face with open mouth and cold sweat": "\u0627\u0644\u0648\u062c\u0647 \u0627\u0644\u0645\u0628\u062a\u0633\u0645 \u0645\u0639 \u0641\u062a\u062d \u0627\u0644\u0641\u0645 \u0648\u0627\u0644\u0639\u0631\u0642 \u0627\u0644\u0628\u0627\u0631\u062f",
    "Smiling face with open mouth and tightly-closed eyes": "\u0627\u0644\u0648\u062c\u0647 \u0627\u0644\u0645\u0628\u062a\u0633\u0645 \u0645\u0639 \u0641\u062a\u062d \u0627\u0644\u0641\u0645 \u0648\u0627\u0644\u0639\u064a\u0646\u064a\u0646 \u0645\u063a\u0644\u0642\u0629 \u0628\u0625\u062d\u0643\u0627\u0645",
    "Smiling face with halo": "\u0627\u0644\u0648\u062c\u0647 \u0627\u0644\u0645\u0628\u062a\u0633\u0645 \u0645\u0639 \u0647\u0627\u0644\u0629",
    "Smiling face with horns": "\u0627\u0644\u0648\u062c\u0647 \u0627\u0644\u0645\u0628\u062a\u0633\u0645 \u0628\u0642\u0631\u0648\u0646",
    "Winking face": "\u0627\u0644\u063a\u0645\u0632 \u0648\u062c\u0647",
    "Smiling face with smiling eyes": "\u064a\u0628\u062a\u0633\u0645 \u0648\u062c\u0647 \u0645\u0639 \u0639\u064a\u0648\u0646 \u062a\u0628\u062a\u0633\u0645",
    "Face savoring delicious food": "\u064a\u0648\u0627\u062c\u0647 \u0644\u0630\u064a\u0630 \u0627\u0644\u0645\u0630\u0627\u0642 \u0644\u0630\u064a\u0630 \u0627\u0644\u0637\u0639\u0627\u0645",
    "Relieved face": "\u0648\u062c\u0647 \u0628\u0627\u0644\u0627\u0631\u062a\u064a\u0627\u062d",
    "Smiling face with heart-shaped eyes": "\u0627\u0644\u0648\u062c\u0647 \u0627\u0644\u0645\u0628\u062a\u0633\u0645 \u0628\u0639\u064a\u0646\u064a\u0646 \u0639\u0644\u0649 \u0634\u0643\u0644 \u0642\u0644\u0628",
    "Smiling face with sunglasses": "\u0627\u0644\u0648\u062c\u0647 \u0627\u0644\u0645\u0628\u062a\u0633\u0645 \u0645\u0639 \u0627\u0644\u0646\u0638\u0627\u0631\u0627\u062a \u0627\u0644\u0634\u0645\u0633\u064a\u0629",
    "Smirking face": "\u0633\u0645\u064a\u0631\u0643\u064a\u0646\u062c \u0627\u0644\u0648\u062c\u0647",
    "Neutral face": "\u0645\u062d\u0627\u064a\u062f \u0627\u0644\u0648\u062c\u0647",
    "Expressionless face": "\u0648\u062c\u0647 \u0627\u0644\u062a\u0639\u0627\u0628\u064a\u0631",
    "Unamused face": "\u0644\u0627 \u0645\u0633\u0644\u064a\u0627 \u0627\u0644\u0648\u062c\u0647",
    "Face with cold sweat": "\u0648\u062c\u0647 \u0645\u0639 \u0639\u0631\u0642 \u0628\u0627\u0631\u062f",
    "Pensive face": "\u0648\u062c\u0647 \u0645\u062a\u0623\u0645\u0644",
    "Confused face": "\u0648\u062c\u0647 \u0627\u0644\u062e\u0644\u0637",
    "Confounded face": "\u0648\u062c\u0647 \u0645\u0631\u062a\u0628\u0643",
    "Kissing face": "\u062a\u0642\u0628\u064a\u0644 \u0627\u0644\u0648\u062c\u0647",
    "Face throwing a kiss": "\u0645\u0648\u0627\u062c\u0647\u0629 \u0631\u0645\u064a \u0642\u0628\u0644\u0629",
    "Kissing face with smiling eyes": "\u062a\u0642\u0628\u064a\u0644 \u0648\u062c\u0647 \u0645\u0639 \u0639\u064a\u0648\u0646 \u062a\u0628\u062a\u0633\u0645",
    "Kissing face with closed eyes": "\u062a\u0642\u0628\u064a\u0644 \u0648\u062c\u0647 \u0645\u0639 \u0639\u064a\u0648\u0646 \u0645\u063a\u0644\u0642\u0629",
    "Face with stuck out tongue": "\u0627\u0644\u0648\u062c\u0647 \u0645\u0639 \u062a\u0645\u0633\u0643 \u0628\u0647\u0627 \u0627\u0644\u0644\u0633\u0627\u0646",
    "Face with stuck out tongue and winking eye": "\u0627\u0644\u0648\u062c\u0647 \u0645\u0639 \u062a\u0645\u0633\u0643 \u0628\u0647\u0627 \u0627\u0644\u0644\u0633\u0627\u0646 \u0648\u0627\u0644\u0639\u064a\u0646 \u0627\u0644\u062a\u063a\u0627\u0636\u064a",
    "Face with stuck out tongue and tightly-closed eyes": "\u0627\u0644\u0648\u062c\u0647 \u0645\u0639 \u062a\u0645\u0633\u0643 \u0628\u0647\u0627 \u0627\u0644\u0644\u0633\u0627\u0646 \u0648\u0627\u0644\u0639\u064a\u0648\u0646 \u0645\u063a\u0644\u0642\u0629 \u0628\u0623\u062d\u0643\u0627\u0645\u002d",
    "Disappointed face": "\u0648\u062c\u0647\u0627 \u062e\u064a\u0628\u0629 \u0623\u0645\u0644",
    "Worried face": "\u0648\u062c\u0647\u0627 \u0627\u0644\u0642\u0644\u0642\u0648\u0646",
    "Angry face": "\u0648\u062c\u0647 \u063a\u0627\u0636\u0628",
    "Pouting face": "\u0627\u0644\u0639\u0628\u0648\u0633 \u0648\u062c\u0647",
    "Crying face": "\u0627\u0644\u0628\u0643\u0627\u0621 \u0627\u0644\u0648\u062c\u0647",
    "Persevering face": "\u0627\u0644\u0645\u062b\u0627\u0628\u0631\u0629 \u0648\u062c\u0647\u0647",
    "Face with look of triumph": "\u0648\u0627\u062c\u0647 \u0645\u0639 \u0646\u0638\u0631\u0629 \u0627\u0646\u062a\u0635\u0627\u0631",
    "Disappointed but relieved face": "\u0628\u062e\u064a\u0628\u0629 \u0623\u0645\u0644 \u0648\u0644\u0643\u0646 \u064a\u0639\u0641\u0649 \u0648\u062c\u0647",
    "Frowning face with open mouth": "\u0645\u0642\u0637\u0628 \u0627\u0644\u0648\u062c\u0647 \u0645\u0639 \u0641\u062a\u062d \u0627\u0644\u0641\u0645",
    "Anguished face": "\u0627\u0644\u0648\u062c\u0647 \u0627\u0644\u0645\u0624\u0644\u0645",
    "Fearful face": "\u0627\u0644\u0648\u062c\u0647 \u0627\u0644\u0645\u062e\u064a\u0641",
    "Weary face": "\u0648\u062c\u0647\u0627 \u0628\u0627\u0644\u0636\u062c\u0631",
    "Sleepy face": "\u0648\u062c\u0647 \u0646\u0639\u0633\u0627\u0646",
    "Tired face": "\u0648\u062c\u0647 \u0645\u062a\u0639\u0628",
    "Grimacing face": "\u0648\u062e\u0631\u062c \u0633\u064a\u0633 \u0627\u0644\u0648\u062c\u0647",
    "Loudly crying face": "\u0627\u0644\u0628\u0643\u0627\u0621 \u0628\u0635\u0648\u062a \u0639\u0627\u0644 \u0648\u062c\u0647\u0647",
    "Face with open mouth": "\u0648\u0627\u062c\u0647 \u0645\u0639 \u0641\u062a\u062d \u0627\u0644\u0641\u0645",
    "Hushed face": "\u0648\u062c\u0647\u0627 \u0627\u0644\u062a\u0643\u062a\u0645",
    "Face with open mouth and cold sweat": "\u0648\u0627\u062c\u0647 \u0645\u0639 \u0641\u062a\u062d \u0627\u0644\u0641\u0645 \u0648\u0627\u0644\u0639\u0631\u0642 \u0627\u0644\u0628\u0627\u0631\u062f",
    "Face screaming in fear": "\u0648\u0627\u062c\u0647 \u064a\u0635\u0631\u062e \u0641\u064a \u062e\u0648\u0641",
    "Astonished face": "\u0648\u062c\u0647\u0627 \u062f\u0647\u0634",
    "Flushed face": "\u0627\u062d\u0645\u0631\u0627\u0631 \u0627\u0644\u0648\u062c\u0647",
    "Sleeping face": "\u0627\u0644\u0646\u0648\u0645 \u0627\u0644\u0648\u062c\u0647",
    "Dizzy face": "\u0648\u062c\u0647\u0627 \u0628\u0627\u0644\u062f\u0648\u0627\u0631",
    "Face without mouth": "\u0648\u0627\u062c\u0647 \u062f\u0648\u0646 \u0627\u0644\u0641\u0645",
    "Face with medical mask": "\u0648\u0627\u062c\u0647 \u0645\u0639 \u0642\u0646\u0627\u0639 \u0627\u0644\u0637\u0628\u064a\u0629",

    // Line breaker
    "Break": "\u0627\u0644\u0627\u0646\u0642\u0633\u0627\u0645",

    // Math
    "Subscript": "\u0645\u0646\u062e\u0641\u0636",
    "Superscript": "\u062d\u0631\u0641 \u0641\u0648\u0642\u064a",

    // Full screen
    "Fullscreen": "\u0643\u0627\u0645\u0644 \u0627\u0644\u0634\u0627\u0634\u0629",

    // Horizontal line
    "Insert Horizontal Line": "\u0625\u062f\u0631\u0627\u062c \u062e\u0637 \u0623\u0641\u0642\u064a",

    // Clear formatting
    "Clear Formatting": "\u0625\u0632\u0627\u0644\u0629 \u0627\u0644\u062a\u0646\u0633\u064a\u0642",

    // Save
    "Save": "\u062d\u0641\u0638",

    // Undo, redo
    "Undo": "\u062a\u0631\u0627\u062c\u0639",
    "Redo": "\u0625\u0639\u0627\u062f\u0629",

    // Select all
    "Select All": "\u062a\u062d\u062f\u064a\u062f \u0627\u0644\u0643\u0644",

    // Code view
    "Code View": "\u0639\u0631\u0636 \u0627\u0644\u062a\u0639\u0644\u064a\u0645\u0627\u062a \u0627\u0644\u0628\u0631\u0645\u062c\u064a\u0629",

    // Quote
    "Quote": "\u0627\u0642\u062a\u0628\u0633",
    "Increase": "\u0632\u064a\u0627\u062f\u0629",
    "Decrease": "\u0627\u0646\u062e\u0641\u0627\u0636",

    // Quick Insert
    "Quick Insert": "\u0625\u062f\u0631\u0627\u062c \u0633\u0631\u064a\u0639",

    // Spcial Characters
    "Special Characters": "أحرف خاصة",
    "Latin": "لاتينية",
    "Greek": "الإغريقي",
    "Cyrillic": "السيريلية",
    "Punctuation": "علامات ترقيم",
    "Currency": "دقة",
    "Arrows": "السهام",
    "Math": "الرياضيات",
    "Misc": "متفرقات",

    // Print.
    "Print": "طباعة",

    // Spell Checker.
    "Spell Checker": "مدقق املائي",

    // Help
    "Help": "مساعدة",
    "Shortcuts": "اختصارات",
    "Inline Editor": "محرر مضمنة",
    "Show the editor": "عرض المحرر",
    "Common actions": "الإجراءات المشتركة",
    "Copy": "نسخ",
    "Cut": "يقطع",
    "Paste": "معجون",
    "Basic Formatting": "التنسيق الأساسي",
    "Increase quote level": "زيادة مستوى الاقتباس",
    "Decrease quote level": "انخفاض مستوى الاقتباس",
    "Image / Video": "صورة / فيديو",
    "Resize larger": "تغيير حجم أكبر",
    "Resize smaller": "تغيير حجم أصغر",
    "Table": "الطاولة",
    "Select table cell": "حدد خلية الجدول",
    "Extend selection one cell": "توسيع اختيار خلية واحدة",
    "Extend selection one row": "تمديد اختيار صف واحد",
    "Navigation": "التنقل",
    "Focus popup / toolbar": "التركيز المنبثقة / شريط الأدوات",
    "Return focus to previous position": "عودة التركيز إلى الموقف السابق",

    // Embed.ly
    "Embed URL": "تضمين عنوان ورل",
    "Paste in a URL to embed": "الصق في عنوان ورل لتضمينه",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "المحتوى الذي تم لصقه قادم من وثيقة كلمة ميكروسوفت. هل تريد الاحتفاظ بالتنسيق أو تنظيفه؟",
    "Keep": "احتفظ",
    "Clean": "نظيف",
    "Word Paste Detected": "تم اكتشاف معجون الكلمات"
  },
  direction: "rtl"
};

}));

