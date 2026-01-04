/*
 * This file has been compiled from: /modules/system/lang/th/client.php
 */
if (!window.oc) {
    window.oc = {};
}

if (!window.oc.langMessages) {
    window.oc.langMessages = {};
}

window.oc.langMessages['th'] = $.extend(
    window.oc.langMessages['th'] || {},
    {
    "markdowneditor": {
        "formatting": "\u0e01\u0e32\u0e23\u0e08\u0e31\u0e14\u0e23\u0e39\u0e1b\u0e41\u0e1a\u0e1a",
        "quote": "\u0e2d\u0e49\u0e32\u0e07\u0e02\u0e49\u0e2d\u0e04\u0e27\u0e32\u0e21",
        "code": "\u0e42\u0e04\u0e49\u0e14",
        "header1": "\u0e2b\u0e31\u0e27\u0e40\u0e23\u0e37\u0e48\u0e2d\u0e07 1",
        "header2": "\u0e2b\u0e31\u0e27\u0e40\u0e23\u0e37\u0e48\u0e2d\u0e07 2",
        "header3": "\u0e2b\u0e31\u0e27\u0e40\u0e23\u0e37\u0e48\u0e2d\u0e07 3",
        "header4": "\u0e2b\u0e31\u0e27\u0e40\u0e23\u0e37\u0e48\u0e2d\u0e07 4",
        "header5": "\u0e2b\u0e31\u0e27\u0e40\u0e23\u0e37\u0e48\u0e2d\u0e07 5",
        "header6": "\u0e2b\u0e31\u0e27\u0e40\u0e23\u0e37\u0e48\u0e2d\u0e07 6",
        "bold": "\u0e15\u0e31\u0e27\u0e2b\u0e19\u0e32",
        "italic": "\u0e15\u0e31\u0e27\u0e40\u0e2d\u0e35\u0e22\u0e07",
        "unorderedlist": "\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e41\u0e1a\u0e1a\u0e44\u0e21\u0e48\u0e21\u0e35\u0e25\u0e33\u0e14\u0e31\u0e1a",
        "orderedlist": "\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e41\u0e1a\u0e1a\u0e21\u0e35\u0e25\u0e33\u0e14\u0e31\u0e1a",
        "snippet": "Snippet",
        "video": "\u0e27\u0e34\u0e14\u0e35\u0e42\u0e2d",
        "image": "\u0e23\u0e39\u0e1b\u0e20\u0e32\u0e1e",
        "link": "\u0e25\u0e34\u0e07\u0e01\u0e4c",
        "horizontalrule": "\u0e43\u0e2a\u0e48\u0e17\u0e35\u0e48\u0e04\u0e31\u0e48\u0e19\u0e1a\u0e23\u0e23\u0e17\u0e31\u0e14",
        "fullscreen": "\u0e40\u0e15\u0e47\u0e21\u0e2b\u0e19\u0e49\u0e32\u0e08\u0e2d",
        "preview": "\u0e14\u0e39\u0e15\u0e31\u0e27\u0e2d\u0e22\u0e48\u0e32\u0e07",
        "strikethrough": "Strikethrough",
        "cleanblock": "Clean Block",
        "table": "Table",
        "sidebyside": "Side by Side"
    },
    "mediamanager": {
        "insert_link": "\u0e43\u0e2a\u0e48\u0e25\u0e34\u0e07\u0e01\u0e4c",
        "insert_image": "\u0e43\u0e2a\u0e48\u0e23\u0e39\u0e1b\u0e20\u0e32\u0e1e",
        "insert_video": "\u0e43\u0e2a\u0e48\u0e27\u0e34\u0e14\u0e35\u0e42\u0e2d",
        "insert_audio": "\u0e43\u0e2a\u0e48\u0e44\u0e1f\u0e25\u0e4c\u0e40\u0e2a\u0e35\u0e22\u0e07",
        "invalid_file_empty_insert": "\u0e01\u0e23\u0e38\u0e13\u0e32\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e44\u0e1f\u0e25\u0e4c\u0e17\u0e35\u0e48\u0e08\u0e30\u0e43\u0e2a\u0e48\u0e25\u0e34\u0e07\u0e01\u0e4c",
        "invalid_file_single_insert": "\u0e01\u0e23\u0e38\u0e13\u0e32\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e44\u0e1f\u0e25\u0e4c\u0e40\u0e14\u0e35\u0e22\u0e27",
        "invalid_image_empty_insert": "\u0e01\u0e23\u0e38\u0e13\u0e32\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e23\u0e39\u0e1b\u0e20\u0e32\u0e1e\u0e17\u0e35\u0e48\u0e08\u0e30\u0e43\u0e2a\u0e48",
        "invalid_video_empty_insert": "\u0e01\u0e23\u0e38\u0e13\u0e32\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e27\u0e34\u0e14\u0e35\u0e42\u0e2d\u0e17\u0e35\u0e48\u0e08\u0e30\u0e43\u0e2a\u0e48",
        "invalid_audio_empty_insert": "\u0e01\u0e23\u0e38\u0e13\u0e32\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e44\u0e1f\u0e25\u0e4c\u0e40\u0e2a\u0e35\u0e22\u0e07\u0e17\u0e35\u0e48\u0e08\u0e30\u0e43\u0e2a\u0e48"
    },
    "alert": {
        "error": "Error",
        "confirm": "Confirm",
        "dismiss": "Dismiss",
        "confirm_button_text": "\u0e15\u0e01\u0e25\u0e07",
        "cancel_button_text": "\u0e22\u0e01\u0e40\u0e25\u0e34\u0e01",
        "widget_remove_confirm": "\u0e25\u0e1a\u0e27\u0e34\u0e14\u0e40\u0e08\u0e47\u0e17\u0e19\u0e35\u0e49?"
    },
    "datepicker": {
        "previousMonth": "\u0e40\u0e14\u0e37\u0e2d\u0e19\u0e01\u0e48\u0e2d\u0e19\u0e2b\u0e19\u0e49\u0e32",
        "nextMonth": "\u0e40\u0e14\u0e37\u0e2d\u0e19\u0e16\u0e31\u0e14\u0e44\u0e1b",
        "months": [
            "\u0e21\u0e01\u0e23\u0e32\u0e04\u0e21",
            "\u0e01\u0e38\u0e21\u0e20\u0e32\u0e1e\u0e31\u0e19\u0e18\u0e4c",
            "\u0e21\u0e35\u0e19\u0e32\u0e04\u0e21",
            "\u0e40\u0e21\u0e29\u0e32\u0e22\u0e19",
            "\u0e1e\u0e24\u0e29\u0e20\u0e32\u0e04\u0e21",
            "\u0e21\u0e34\u0e16\u0e38\u0e19\u0e32\u0e22\u0e19",
            "\u0e01\u0e23\u0e01\u0e0e\u0e32\u0e04\u0e21",
            "\u0e2a\u0e34\u0e07\u0e2b\u0e32\u0e04\u0e21",
            "\u0e01\u0e31\u0e19\u0e22\u0e32\u0e22\u0e19",
            "\u0e15\u0e38\u0e25\u0e32\u0e04\u0e21",
            "\u0e1e\u0e24\u0e28\u0e08\u0e34\u0e01\u0e32\u0e22\u0e19",
            "\u0e18\u0e31\u0e19\u0e27\u0e32\u0e04\u0e21"
        ],
        "weekdays": [
            "\u0e2d\u0e32\u0e17\u0e34\u0e15\u0e22\u0e4c",
            "\u0e08\u0e31\u0e19\u0e17\u0e23\u0e4c",
            "\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23",
            "\u0e1e\u0e38\u0e18",
            "\u0e1e\u0e24\u0e2b\u0e31\u0e2a\u0e1a\u0e14\u0e35",
            "\u0e28\u0e38\u0e01\u0e23\u0e4c",
            "\u0e40\u0e2a\u0e32\u0e23\u0e4c"
        ],
        "weekdaysShort": [
            "\u0e2d\u0e32.",
            "\u0e08.",
            "\u0e2d.",
            "\u0e1e.",
            "\u0e1e\u0e24.",
            "\u0e28.",
            "\u0e2a."
        ]
    },
    "colorpicker": {
        "choose": "\u0e15\u0e01\u0e25\u0e07"
    },
    "filter": {
        "group": {
            "all": "\u0e17\u0e31\u0e49\u0e07\u0e2b\u0e21\u0e14"
        },
        "scopes": {
            "apply_button_text": "\u0e19\u0e33\u0e44\u0e1b\u0e43\u0e0a\u0e49",
            "clear_button_text": "\u0e40\u0e04\u0e25\u0e35\u0e22\u0e23\u0e4c"
        },
        "dates": {
            "all": "\u0e17\u0e31\u0e49\u0e07\u0e2b\u0e21\u0e14",
            "filter_button_text": "\u0e01\u0e23\u0e2d\u0e07",
            "reset_button_text": "\u0e15\u0e31\u0e49\u0e07\u0e04\u0e48\u0e32\u0e40\u0e23\u0e34\u0e48\u0e21\u0e15\u0e49\u0e19",
            "date_placeholder": "\u0e27\u0e31\u0e19\u0e17\u0e35\u0e48",
            "after_placeholder": "\u0e2b\u0e25\u0e31\u0e07\u0e08\u0e32\u0e01",
            "before_placeholder": "\u0e01\u0e48\u0e2d\u0e19"
        },
        "numbers": {
            "all": "\u0e17\u0e31\u0e49\u0e07\u0e2b\u0e21\u0e14",
            "filter_button_text": "\u0e01\u0e23\u0e2d\u0e07",
            "reset_button_text": "\u0e15\u0e31\u0e49\u0e07\u0e04\u0e48\u0e32\u0e40\u0e23\u0e34\u0e48\u0e21\u0e15\u0e49\u0e19",
            "min_placeholder": "\u0e19\u0e49\u0e2d\u0e22\u0e17\u0e35\u0e48\u0e2a\u0e38\u0e14",
            "max_placeholder": "\u0e21\u0e32\u0e01\u0e17\u0e35\u0e48\u0e2a\u0e38\u0e14",
            "number_placeholder": "N\u00famero"
        }
    },
    "eventlog": {
        "show_stacktrace": "\u0e41\u0e2a\u0e14\u0e07 stacktrace",
        "hide_stacktrace": "\u0e0b\u0e48\u0e2d\u0e19 stacktrace",
        "tabs": {
            "formatted": "\u0e08\u0e31\u0e14\u0e23\u0e39\u0e1b\u0e41\u0e1a\u0e1a\u0e41\u0e25\u0e49\u0e27",
            "raw": "\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e14\u0e34\u0e1a"
        },
        "editor": {
            "title": "\u0e15\u0e31\u0e27\u0e41\u0e01\u0e49\u0e44\u0e02\u0e0b\u0e2d\u0e23\u0e4c\u0e2a\u0e42\u0e04\u0e49\u0e14",
            "description": "Your operating system should be configured to listen to one of these URL schemes.",
            "openWith": "\u0e40\u0e1b\u0e34\u0e14\u0e14\u0e49\u0e27\u0e22",
            "remember_choice": "\u0e08\u0e33\u0e15\u0e31\u0e27\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e17\u0e35\u0e48\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e44\u0e27\u0e49",
            "open": "\u0e40\u0e1b\u0e34\u0e14",
            "cancel": "\u0e22\u0e01\u0e40\u0e25\u0e34\u0e01",
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


    var th = moment.defineLocale('th', {
        months : 'มกราคม_กุมภาพันธ์_มีนาคม_เมษายน_พฤษภาคม_มิถุนายน_กรกฎาคม_สิงหาคม_กันยายน_ตุลาคม_พฤศจิกายน_ธันวาคม'.split('_'),
        monthsShort : 'ม.ค._ก.พ._มี.ค._เม.ย._พ.ค._มิ.ย._ก.ค._ส.ค._ก.ย._ต.ค._พ.ย._ธ.ค.'.split('_'),
        monthsParseExact: true,
        weekdays : 'อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์'.split('_'),
        weekdaysShort : 'อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัส_ศุกร์_เสาร์'.split('_'), // yes, three characters difference
        weekdaysMin : 'อา._จ._อ._พ._พฤ._ศ._ส.'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'H:mm',
            LTS : 'H:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY เวลา H:mm',
            LLLL : 'วันddddที่ D MMMM YYYY เวลา H:mm'
        },
        meridiemParse: /ก่อนเที่ยง|หลังเที่ยง/,
        isPM: function (input) {
            return input === 'หลังเที่ยง';
        },
        meridiem : function (hour, minute, isLower) {
            if (hour < 12) {
                return 'ก่อนเที่ยง';
            } else {
                return 'หลังเที่ยง';
            }
        },
        calendar : {
            sameDay : '[วันนี้ เวลา] LT',
            nextDay : '[พรุ่งนี้ เวลา] LT',
            nextWeek : 'dddd[หน้า เวลา] LT',
            lastDay : '[เมื่อวานนี้ เวลา] LT',
            lastWeek : '[วัน]dddd[ที่แล้ว เวลา] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'อีก %s',
            past : '%sที่แล้ว',
            s : 'ไม่กี่วินาที',
            ss : '%d วินาที',
            m : '1 นาที',
            mm : '%d นาที',
            h : '1 ชั่วโมง',
            hh : '%d ชั่วโมง',
            d : '1 วัน',
            dd : '%d วัน',
            M : '1 เดือน',
            MM : '%d เดือน',
            y : '1 ปี',
            yy : '%d ปี'
        }
    });

    return th;

})));


/*! Select2 4.1.0-rc.0 | https://github.com/select2/select2/blob/master/LICENSE.md */

!function(){if(jQuery&&jQuery.fn&&jQuery.fn.select2&&jQuery.fn.select2.amd)var n=jQuery.fn.select2.amd;n.define("select2/i18n/th",[],function(){return{errorLoading:function(){return"ไม่สามารถค้นข้อมูลได้"},inputTooLong:function(n){return"โปรดลบออก "+(n.input.length-n.maximum)+" ตัวอักษร"},inputTooShort:function(n){return"โปรดพิมพ์เพิ่มอีก "+(n.minimum-n.input.length)+" ตัวอักษร"},loadingMore:function(){return"กำลังค้นข้อมูลเพิ่ม…"},maximumSelected:function(n){return"คุณสามารถเลือกได้ไม่เกิน "+n.maximum+" รายการ"},noResults:function(){return"ไม่พบข้อมูล"},searching:function(){return"กำลังค้นข้อมูล…"},removeAllItems:function(){return"ลบรายการทั้งหมด"}}}),n.define,n.require}();

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
 * Thai
 */

if (!$.FE_LANGUAGE) {
    $.FE_LANGUAGE = {};
}

$.FE_LANGUAGE['th'] = {
  translation: {
    // Place holder
    "Type something": "\u0e1e\u0e34\u0e21\u0e1e\u0e4c\u0e1a\u0e32\u0e07\u0e2a\u0e34\u0e48\u0e07\u0e1a\u0e32\u0e07\u0e2d\u0e22\u0e48\u0e32\u0e07",

    // Basic formatting
    "Bold": "\u0e15\u0e31\u0e27\u0e2b\u0e19\u0e32",
    "Italic": "\u0e15\u0e31\u0e27\u0e40\u0e2d\u0e35\u0e22\u0e07",
    "Underline": "\u0e02\u0e35\u0e14\u0e40\u0e2a\u0e49\u0e19\u0e43\u0e15\u0e49",
    "Strikethrough": "\u0e02\u0e35\u0e14\u0e17\u0e31\u0e1a",

    // Main buttons
    "Insert": "\u0e41\u0e17\u0e23\u0e01",
    "Delete": "\u0e25\u0e1a",
    "Cancel": "\u0e22\u0e01\u0e40\u0e25\u0e34\u0e01",
    "OK": "\u0e15\u0e01\u0e25\u0e07",
    "Back": "\u0e01\u0e25\u0e31\u0e1a",
    "Remove": "\u0e40\u0e2d\u0e32\u0e2d\u0e2d\u0e01",
    "More": "\u0e21\u0e32\u0e01\u0e01\u0e27\u0e48\u0e32",
    "Update": "\u0e2d\u0e31\u0e1e\u0e40\u0e14\u0e17",
    "Style": "\u0e2a\u0e44\u0e15\u0e25\u0e4c",

    // Font
    "Font Family": "\u0e15\u0e23\u0e30\u0e01\u0e39\u0e25\u0e41\u0e1a\u0e1a\u0e2d\u0e31\u0e01\u0e29\u0e23",
    "Font Size": "\u0e02\u0e19\u0e32\u0e14\u0e41\u0e1a\u0e1a\u0e2d\u0e31\u0e01\u0e29\u0e23",

    // Colors
    "Colors": "\u0e2a\u0e35",
    "Background": "\u0e1e\u0e37\u0e49\u0e19\u0e2b\u0e25\u0e31\u0e07",
    "Text": "\u0e02\u0e49\u0e2d\u0e04\u0e27\u0e32\u0e21",
    "HEX Color": "สีฐานสิบหก",

    // Paragraphs
    "Paragraph Format": "\u0e23\u0e39\u0e1b\u0e41\u0e1a\u0e1a",
    "Normal": "\u0e1b\u0e01\u0e15\u0e34",
    "Code": "\u0e42\u0e04\u0e49\u0e14",
    "Heading 1": "\u0e2a\u0e48\u0e27\u0e19\u0e2b\u0e31\u0e27 1",
    "Heading 2": "\u0e2a\u0e48\u0e27\u0e19\u0e2b\u0e31\u0e27 2",
    "Heading 3": "\u0e2a\u0e48\u0e27\u0e19\u0e2b\u0e31\u0e27 3",
    "Heading 4": "\u0e2a\u0e48\u0e27\u0e19\u0e2b\u0e31\u0e27 4",

    // Style
    "Paragraph Style": "\u0e25\u0e31\u0e01\u0e29\u0e13\u0e30\u0e22\u0e48\u0e2d\u0e2b\u0e19\u0e49\u0e32",
    "Inline Style": "\u0e23\u0e39\u0e1b\u0e41\u0e1a\u0e1a\u0e2d\u0e34\u0e19\u0e44\u0e25\u0e19\u0e4c",

    // Alignment
    "Align": "\u0e01\u0e32\u0e23\u0e08\u0e31\u0e14\u0e41\u0e19\u0e27",
    "Align Left": "\u0e08\u0e31\u0e14\u0e0a\u0e34\u0e14\u0e0b\u0e49\u0e32\u0e22",
    "Align Center": "\u0e08\u0e31\u0e14\u0e01\u0e36\u0e48\u0e07\u0e01\u0e25\u0e32\u0e07",
    "Align Right": "\u0e08\u0e31\u0e14\u0e0a\u0e34\u0e14\u0e02\u0e27\u0e32",
    "Align Justify": "\u0e40\u0e15\u0e47\u0e21\u0e41\u0e19\u0e27",
    "None": "\u0e44\u0e21\u0e48",

    // Lists
    "Ordered List": "\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e25\u0e33\u0e14\u0e31\u0e1a\u0e40\u0e25\u0e02",
    "Default": "ค่าเริ่มต้น",
    "Lower Alpha": "อัลฟาตอนล่าง",
    "Lower Greek": "กรีกต่ำกว่า",
    "Lower Roman": "โรมันล่าง",
    "Upper Alpha": "อัลฟาตอนบน",
    "Upper Roman": "โรมันตอนบน",

    "Unordered List": "\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e2a\u0e31\u0e0d\u0e25\u0e31\u0e01\u0e29\u0e13\u0e4c\u0e2b\u0e31\u0e27\u0e02\u0e49\u0e2d\u0e22\u0e48\u0e2d\u0e22",
    "Circle": "วงกลม",
    "Disc": "จาน",
    "Square": "สี่เหลี่ยม",

    // Line height
    "Line Height": "ความสูงของบรรทัด",
    "Single": "เดียว",
    "Double": "สอง",

    // Indent
    "Decrease Indent": "\u0e25\u0e14\u0e01\u0e32\u0e23\u0e40\u0e22\u0e37\u0e49\u0e2d\u0e07",
    "Increase Indent": "\u0e40\u0e1e\u0e34\u0e48\u0e21\u0e01\u0e32\u0e23\u0e40\u0e22\u0e37\u0e49\u0e2d\u0e07",

    // Links
    "Insert Link": "\u0e41\u0e17\u0e23\u0e01\u0e25\u0e34\u0e07\u0e01\u0e4c",
    "Open in new tab": "\u0e40\u0e1b\u0e34\u0e14\u0e43\u0e19\u0e41\u0e17\u0e47\u0e1a\u0e43\u0e2b\u0e21\u0e48",
    "Open Link": "\u0e40\u0e1b\u0e34\u0e14\u0e25\u0e34\u0e49\u0e07\u0e04\u0e4c",
    "Edit Link": "\u0e25\u0e34\u0e07\u0e04\u0e4c\u0e41\u0e01\u0e49\u0e44\u0e02",
    "Unlink": "\u0e40\u0e2d\u0e32\u0e25\u0e34\u0e07\u0e01\u0e4c\u0e2d\u0e2d\u0e01",
    "Choose Link": "\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e01\u0e32\u0e23\u0e40\u0e0a\u0e37\u0e48\u0e2d\u0e21\u0e42\u0e22\u0e07",

    // Images
    "Insert Image": "\u0e41\u0e17\u0e23\u0e01\u0e23\u0e39\u0e1b\u0e20\u0e32\u0e1e",
    "Upload Image": "\u0e01\u0e32\u0e23\u0e2d\u0e31\u0e1b\u0e42\u0e2b\u0e25\u0e14\u0e20\u0e32\u0e1e",
    "By URL": "\u0e15\u0e32\u0e21 URL",
    "Browse": "\u0e40\u0e23\u0e35\u0e22\u0e01\u0e14\u0e39",
    "Drop image": "\u0e27\u0e32\u0e07\u0e20\u0e32\u0e1e",
    "or click": "\u0e2b\u0e23\u0e37\u0e2d\u0e04\u0e25\u0e34\u0e01\u0e17\u0e35\u0e48",
    "Manage Images": "\u0e08\u0e31\u0e14\u0e01\u0e32\u0e23\u0e20\u0e32\u0e1e",
    "Loading": "\u0e42\u0e2b\u0e25\u0e14",
    "Deleting": "\u0e25\u0e1a",
    "Tags": "\u0e41\u0e17\u0e47\u0e01",
    "Are you sure? Image will be deleted.": "\u0e04\u0e38\u0e13\u0e41\u0e19\u0e48\u0e43\u0e08\u0e2b\u0e23\u0e37\u0e2d\u0e44\u0e21\u0e48 \u0e20\u0e32\u0e1e\u0e08\u0e30\u0e16\u0e39\u0e01\u0e25\u0e1a",
    "Replace": "\u0e41\u0e17\u0e19\u0e17\u0e35\u0e48",
    "Uploading": "\u0e2d\u0e31\u0e1e\u0e42\u0e2b\u0e25\u0e14",
    "Loading image": "\u0e42\u0e2b\u0e25\u0e14\u0e20\u0e32\u0e1e",
    "Display": "\u0e41\u0e2a\u0e14\u0e07",
    "Inline": "\u0e41\u0e1a\u0e1a\u0e2d\u0e34\u0e19\u0e44\u0e25\u0e19\u0e4c",
    "Break Text": "\u0e02\u0e49\u0e2d\u0e04\u0e27\u0e32\u0e21\u0e2b\u0e22\u0e38\u0e14",
    "Alternative Text": "\u0e02\u0e49\u0e2d\u0e04\u0e27\u0e32\u0e21\u0e2d\u0e37\u0e48\u0e19",
    "Change Size": "\u0e40\u0e1b\u0e25\u0e35\u0e48\u0e22\u0e19\u0e02\u0e19\u0e32\u0e14",
    "Width": "\u0e04\u0e27\u0e32\u0e21\u0e01\u0e27\u0e49\u0e32\u0e07",
    "Height": "\u0e04\u0e27\u0e32\u0e21\u0e2a\u0e39\u0e07",
    "Something went wrong. Please try again.": "\u0e1a\u0e32\u0e07\u0e2d\u0e22\u0e48\u0e32\u0e07\u0e1c\u0e34\u0e14\u0e1b\u0e01\u0e15\u0e34. \u0e01\u0e23\u0e38\u0e13\u0e32\u0e25\u0e2d\u0e07\u0e2d\u0e35\u0e01\u0e04\u0e23\u0e31\u0e49\u0e07.",
    "Image Caption": "คำบรรยายภาพ",
    "Advanced Edit": "แก้ไขขั้นสูง",

    // Video
    "Insert Video": "\u0e41\u0e17\u0e23\u0e01\u0e27\u0e34\u0e14\u0e35\u0e42\u0e2d",
    "Embedded Code": "\u0e23\u0e2b\u0e31\u0e2a\u0e2a\u0e21\u0e2d\u0e07\u0e01\u0e25\u0e1d\u0e31\u0e07\u0e15\u0e31\u0e27",
    "Paste in a video URL": "วางใน URL วิดีโอ",
    "Drop video": "วางวิดีโอ",
    "Your browser does not support HTML5 video.": "เบราเซอร์ของคุณไม่สนับสนุนวิดีโอ HTML5",
    "Upload Video": "อัปโหลดวิดีโอ",

    // Tables
    "Insert Table": "\u0e41\u0e17\u0e23\u0e01\u0e15\u0e32\u0e23\u0e32\u0e07",
    "Table Header": "\u0e2a\u0e48\u0e27\u0e19\u0e2b\u0e31\u0e27\u0e02\u0e2d\u0e07\u0e15\u0e32\u0e23\u0e32\u0e07",
    "Remove Table": "\u0e40\u0e2d\u0e32\u0e15\u0e32\u0e23\u0e32\u0e07\u0e2d\u0e2d\u0e01",
    "Table Style": "\u0e25\u0e31\u0e01\u0e29\u0e13\u0e30\u0e15\u0e32\u0e23\u0e32\u0e07",
    "Horizontal Align": "\u0e43\u0e19\u0e41\u0e19\u0e27\u0e19\u0e2d\u0e19",
    "Row": "\u0e41\u0e16\u0e27",
    "Insert row above": "\u0e41\u0e17\u0e23\u0e01\u0e41\u0e16\u0e27\u0e14\u0e49\u0e32\u0e19\u0e1a\u0e19",
    "Insert row below": "\u0e41\u0e17\u0e23\u0e01\u0e41\u0e16\u0e27\u0e14\u0e49\u0e32\u0e19\u0e25\u0e48\u0e32\u0e07",
    "Delete row": "\u0e25\u0e1a\u0e41\u0e16\u0e27",
    "Column": "\u0e04\u0e2d\u0e25\u0e31\u0e21\u0e19\u0e4c",
    "Insert column before": "\u0e41\u0e17\u0e23\u0e01\u0e04\u0e2d\u0e25\u0e31\u0e21\u0e19\u0e4c\u0e02\u0e49\u0e32\u0e07\u0e2b\u0e19\u0e49\u0e32",
    "Insert column after": "\u0e41\u0e17\u0e23\u0e01\u0e04\u0e2d\u0e25\u0e31\u0e21\u0e19\u0e4c\u0e02\u0e49\u0e32\u0e07\u0e2b\u0e25\u0e31\u0e07",
    "Delete column": "\u0e25\u0e1a\u0e04\u0e2d\u0e25\u0e31\u0e21\u0e19\u0e4c",
    "Cell": "\u0e40\u0e0b\u0e25\u0e25\u0e4c",
    "Merge cells": "\u0e1c\u0e2a\u0e32\u0e19\u0e40\u0e0b\u0e25\u0e25\u0e4c",
    "Horizontal split": "\u0e41\u0e22\u0e01\u0e41\u0e19\u0e27\u0e19\u0e2d\u0e19",
    "Vertical split": "\u0e41\u0e22\u0e01\u0e43\u0e19\u0e41\u0e19\u0e27\u0e15\u0e31\u0e49\u0e07",
    "Cell Background": "\u0e1e\u0e37\u0e49\u0e19\u0e2b\u0e25\u0e31\u0e07\u0e02\u0e2d\u0e07\u0e40\u0e0b\u0e25\u0e25\u0e4c",
    "Vertical Align": "\u0e08\u0e31\u0e14\u0e41\u0e19\u0e27\u0e15\u0e31\u0e49\u0e07",
    "Top": "\u0e14\u0e49\u0e32\u0e19\u0e1a\u0e19",
    "Middle": "\u0e01\u0e25\u0e32\u0e07",
    "Bottom": "\u0e01\u0e49\u0e19",
    "Align Top": "\u0e08\u0e31\u0e14\u0e14\u0e49\u0e32\u0e19\u0e1a\u0e19",
    "Align Middle": "\u0e15\u0e4d\u0e32\u0e41\u0e2b\u0e19\u0e48\u0e07\u0e01\u0e25\u0e32\u0e07",
    "Align Bottom": "\u0e15\u0e4d\u0e32\u0e41\u0e2b\u0e19\u0e48\u0e07\u0e14\u0e49\u0e32\u0e19\u0e25\u0e48\u0e32\u0e07",
    "Cell Style": "\u0e23\u0e39\u0e1b\u0e41\u0e1a\u0e1a\u0e02\u0e2d\u0e07\u0e40\u0e0b\u0e25\u0e25\u0e4c",

    // Files
    "Upload File": "\u0e2d\u0e31\u0e1b\u0e42\u0e2b\u0e25\u0e14\u0e44\u0e1f\u0e25\u0e4c",
    "Drop file": "\u0e27\u0e32\u0e07\u0e44\u0e1f\u0e25\u0e4c",

    // Emoticons
    "Emoticons": "\u0e2d\u0e35\u0e42\u0e21\u0e15\u0e34\u0e04\u0e2d\u0e19",
    "Grinning face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e22\u0e34\u0e49\u0e21",
    "Grinning face with smiling eyes": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e22\u0e34\u0e49\u0e21\u0e14\u0e49\u0e27\u0e22\u0e15\u0e32\u0e22\u0e34\u0e49\u0e21",
    "Face with tears of joy": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e14\u0e49\u0e27\u0e22\u0e19\u0e49\u0e33\u0e15\u0e32\u0e41\u0e2b\u0e48\u0e07\u0e04\u0e27\u0e32\u0e21\u0e2a\u0e38\u0e02",
    "Smiling face with open mouth": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e40\u0e1b\u0e37\u0e49\u0e2d\u0e19\u0e23\u0e2d\u0e22\u0e22\u0e34\u0e49\u0e21\u0e17\u0e35\u0e48\u0e21\u0e35\u0e1b\u0e32\u0e01\u0e40\u0e1b\u0e34\u0e14",
    "Smiling face with open mouth and smiling eyes": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e22\u0e34\u0e49\u0e21\u0e01\u0e31\u0e1a\u0e40\u0e1b\u0e34\u0e14\u0e1b\u0e32\u0e01\u0e41\u0e25\u0e30\u0e15\u0e32\u0e22\u0e34\u0e49\u0e21",
    "Smiling face with open mouth and cold sweat": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e22\u0e34\u0e49\u0e21\u0e14\u0e49\u0e27\u0e22\u0e1b\u0e32\u0e01\u0e40\u0e1b\u0e34\u0e14\u0e41\u0e25\u0e30\u0e40\u0e2b\u0e07\u0e37\u0e48\u0e2d\u0e40\u0e22\u0e47\u0e19",
    "Smiling face with open mouth and tightly-closed eyes": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e22\u0e34\u0e49\u0e21\u0e01\u0e31\u0e1a\u0e40\u0e1b\u0e34\u0e14\u0e1b\u0e32\u0e01\u0e41\u0e25\u0e30\u0e15\u0e32\u0e41\u0e19\u0e48\u0e19\u0e1b\u0e34\u0e14",
    "Smiling face with halo": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e22\u0e34\u0e49\u0e21\u0e17\u0e35\u0e48\u0e21\u0e35\u0e23\u0e31\u0e28\u0e21\u0e35",
    "Smiling face with horns": "\u0e22\u0e34\u0e49\u0e21\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e21\u0e35\u0e40\u0e02\u0e32",
    "Winking face": "\u0e01\u0e32\u0e23\u0e01\u0e23\u0e30\u0e1e\u0e23\u0e34\u0e1a\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32",
    "Smiling face with smiling eyes": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e22\u0e34\u0e49\u0e21\u0e14\u0e49\u0e27\u0e22\u0e15\u0e32\u0e22\u0e34\u0e49\u0e21",
    "Face savoring delicious food": "\u0e40\u0e1c\u0e0a\u0e34\u0e0d \u0073\u0061\u0076\u006f\u0072\u0069\u006e\u0067 \u0e2d\u0e32\u0e2b\u0e32\u0e23\u0e2d\u0e23\u0e48\u0e2d\u0e22",
    "Relieved face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e42\u0e25\u0e48\u0e07\u0e43\u0e08",
    "Smiling face with heart-shaped eyes": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e22\u0e34\u0e49\u0e21\u0e14\u0e49\u0e27\u0e22\u0e15\u0e32\u0e23\u0e39\u0e1b\u0e2b\u0e31\u0e27\u0e43\u0e08",
    "Smiling face with sunglasses": "\u0e22\u0e34\u0e49\u0e21\u0e2b\u0e19\u0e49\u0e32\u0e14\u0e49\u0e27\u0e22\u0e41\u0e27\u0e48\u0e19\u0e15\u0e32\u0e01\u0e31\u0e19\u0e41\u0e14\u0e14",
    "Smirking face": "\u0e2b\u0e19\u0e49\u0e32\u0e41\u0e2a\u0e22\u0e30\u0e22\u0e34\u0e49\u0e21\u0e17\u0e35\u0e48\u0e21\u0e38\u0e21",
    "Neutral face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e17\u0e35\u0e48\u0e40\u0e1b\u0e47\u0e19\u0e01\u0e25\u0e32\u0e07",
    "Expressionless face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e2d\u0e32\u0e23\u0e21\u0e13\u0e4c",
    "Unamused face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32 \u0055\u006e\u0061\u006d\u0075\u0073\u0065\u0064",
    "Face with cold sweat": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e17\u0e35\u0e48\u0e21\u0e35\u0e40\u0e2b\u0e07\u0e37\u0e48\u0e2d\u0e40\u0e22\u0e47\u0e19",
    "Pensive face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e2b\u0e21\u0e48\u0e19",
    "Confused face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e2a\u0e31\u0e1a\u0e2a\u0e19",
    "Confounded face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e2a\u0e31\u0e1a\u0e2a\u0e19",
    "Kissing face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e08\u0e39\u0e1a",
    "Face throwing a kiss": "\u0e15\u0e49\u0e2d\u0e07\u0e40\u0e1c\u0e0a\u0e34\u0e0d\u0e01\u0e31\u0e1a\u0e01\u0e32\u0e23\u0e02\u0e27\u0e49\u0e32\u0e07\u0e1b\u0e32\u0e08\u0e39\u0e1a",
    "Kissing face with smiling eyes": "\u0e08\u0e39\u0e1a\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e14\u0e49\u0e27\u0e22\u0e15\u0e32\u0e22\u0e34\u0e49\u0e21",
    "Kissing face with closed eyes": "\u0e08\u0e39\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e14\u0e49\u0e27\u0e22\u0e14\u0e27\u0e07\u0e15\u0e32\u0e17\u0e35\u0e48\u0e1b\u0e34\u0e14\u0e2a\u0e19\u0e34\u0e17",
    "Face with stuck out tongue": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e21\u0e35\u0e41\u0e1e\u0e25\u0e21\u0e2d\u0e2d\u0e01\u0e21\u0e32\u0e25\u0e34\u0e49\u0e19",
    "Face with stuck out tongue and winking eye": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e21\u0e35\u0e15\u0e34\u0e14\u0e25\u0e34\u0e49\u0e19\u0e41\u0e25\u0e30\u0e15\u0e32\u0e02\u0e22\u0e34\u0e1a\u0e15\u0e32",
    "Face with stuck out tongue and tightly-closed eyes": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e21\u0e35\u0e15\u0e34\u0e14\u0e25\u0e34\u0e49\u0e19\u0e41\u0e25\u0e30\u0e14\u0e27\u0e07\u0e15\u0e32\u0e17\u0e35\u0e48\u0e1b\u0e34\u0e14\u0e41\u0e19\u0e48\u0e19",
    "Disappointed face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e1c\u0e34\u0e14\u0e2b\u0e27\u0e31\u0e07",
    "Worried face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e01\u0e31\u0e07\u0e27\u0e25",
    "Angry face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e42\u0e01\u0e23\u0e18",
    "Pouting face": "\u0e2b\u0e19\u0e49\u0e32\u0e21\u0e38\u0e48\u0e22",
    "Crying face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e23\u0e49\u0e2d\u0e07\u0e44\u0e2b\u0e49",
    "Persevering face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e40\u0e2d\u0e32\u0e16\u0e48\u0e32\u0e19",
    "Face with look of triumph": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e01\u0e31\u0e1a\u0e23\u0e39\u0e1b\u0e25\u0e31\u0e01\u0e29\u0e13\u0e4c\u0e02\u0e2d\u0e07\u0e0a\u0e31\u0e22\u0e0a\u0e19\u0e30",
    "Disappointed but relieved face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e1c\u0e34\u0e14\u0e2b\u0e27\u0e31\u0e07 \u0e41\u0e15\u0e48\u0e42\u0e25\u0e48\u0e07\u0e43\u0e08",
    "Frowning face with open mouth": "\u0e2b\u0e19\u0e49\u0e32\u0e21\u0e38\u0e48\u0e22\u0e17\u0e35\u0e48\u0e21\u0e35\u0e1b\u0e32\u0e01\u0e40\u0e1b\u0e34\u0e14",
    "Anguished face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e01\u0e14\u0e02\u0e35\u0e48",
    "Fearful face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e17\u0e35\u0e48\u0e19\u0e48\u0e32\u0e01\u0e25\u0e31\u0e27",
    "Weary face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e17\u0e35\u0e48\u0e40\u0e2b\u0e19\u0e37\u0e48\u0e2d\u0e22\u0e25\u0e49\u0e32",
    "Sleepy face": "\u0e2b\u0e19\u0e49\u0e32\u0e07\u0e48\u0e27\u0e07\u0e19\u0e2d\u0e19",
    "Tired face": "\u0e2b\u0e19\u0e49\u0e32\u0e40\u0e1a\u0e37\u0e48\u0e2d",
    "Grimacing face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32 \u0067\u0072\u0069\u006d\u0061\u0063\u0069\u006e\u0067",
    "Loudly crying face": "\u0e23\u0e49\u0e2d\u0e07\u0e44\u0e2b\u0e49\u0e40\u0e2a\u0e35\u0e22\u0e07\u0e14\u0e31\u0e07\u0e2b\u0e19\u0e49\u0e32",
    "Face with open mouth": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e17\u0e35\u0e48\u0e21\u0e35\u0e1b\u0e32\u0e01\u0e40\u0e1b\u0e34\u0e14",
    "Hushed face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e40\u0e07\u0e35\u0e22\u0e1a",
    "Face with open mouth and cold sweat": "หน้ากับปากเปิดและเหงื่อเย็น",
    "Face screaming in fear": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e17\u0e35\u0e48\u0e21\u0e35\u0e1b\u0e32\u0e01\u0e40\u0e1b\u0e34\u0e14\u0e41\u0e25\u0e30\u0e40\u0e2b\u0e07\u0e37\u0e48\u0e2d\u0e40\u0e22\u0e47\u0e19",
    "Astonished face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e1b\u0e23\u0e30\u0e2b\u0e25\u0e32\u0e14\u0e43\u0e08",
    "Flushed face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e41\u0e14\u0e07",
    "Sleeping face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e19\u0e2d\u0e19",
    "Dizzy face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e15\u0e32\u0e25\u0e32\u0e22",
    "Face without mouth": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e42\u0e14\u0e22\u0e44\u0e21\u0e48\u0e15\u0e49\u0e2d\u0e07\u0e1b\u0e32\u0e01",
    "Face with medical mask": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e14\u0e49\u0e27\u0e22\u0e2b\u0e19\u0e49\u0e32\u0e01\u0e32\u0e01\u0e17\u0e32\u0e07\u0e01\u0e32\u0e23\u0e41\u0e1e\u0e17\u0e22\u0e4c",

    // Line breaker
    "Break": "\u0e2b\u0e22\u0e38\u0e14",

    // Math
    "Subscript": "\u0e15\u0e31\u0e27\u0e2b\u0e49\u0e2d\u0e22",
    "Superscript": "\u0e15\u0e31\u0e27\u0e22\u0e01",

    // Full screen
    "Fullscreen": "\u0e40\u0e15\u0e47\u0e21\u0e2b\u0e19\u0e49\u0e32\u0e08\u0e2d",

    // Horizontal line
    "Insert Horizontal Line": "\u0e41\u0e17\u0e23\u0e01\u0e40\u0e2a\u0e49\u0e19\u0e41\u0e19\u0e27\u0e19\u0e2d\u0e19",

    // Clear formatting
    "Clear Formatting": "\u0e19\u0e33\u0e01\u0e32\u0e23\u0e08\u0e31\u0e14\u0e23\u0e39\u0e1b\u0e41\u0e1a\u0e1a",

    // Save
    "Save": "\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01",

    // Undo, redo
    "Undo": "\u0e40\u0e25\u0e34\u0e01\u0e17\u0e33",
    "Redo": "\u0e17\u0e4d\u0e32\u0e0b\u0e49\u0e33",

    // Select all
    "Select All": "\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e17\u0e31\u0e49\u0e07\u0e2b\u0e21\u0e14",

    // Code view
    "Code View": "\u0e21\u0e38\u0e21\u0e21\u0e2d\u0e07\u0e23\u0e2b\u0e31\u0e2a",

    // Quote
    "Quote": "\u0e2d\u0e49\u0e32\u0e07",
    "Increase": "\u0e40\u0e1e\u0e34\u0e48\u0e21",
    "Decrease": "\u0e25\u0e14\u0e25\u0e07",

    // Quick Insert
    "Quick Insert": "\u0e41\u0e17\u0e23\u0e01\u0e14\u0e48\u0e27\u0e19",

    // Spcial Characters
    "Special Characters": "อักขระพิเศษ",
    "Latin": "ละติน",
    "Greek": "กรีก",
    "Cyrillic": "ริลลิก",
    "Punctuation": "วรรคตอน",
    "Currency": "เงินตรา",
    "Arrows": "ลูกศร",
    "Math": "คณิตศาสตร์",
    "Misc": "อื่น ๆ",

    // Print.
    "Print": "พิมพ์",

    // Spell Checker.
    "Spell Checker": "ตัวตรวจสอบการสะกด",

    // Help
    "Help": "ช่วยด้วย",
    "Shortcuts": "ทางลัด",
    "Inline Editor": "ตัวแก้ไขแบบอินไลน์",
    "Show the editor": "แสดงตัวแก้ไข",
    "Common actions": "การกระทำร่วมกัน",
    "Copy": "สำเนา",
    "Cut": "ตัด",
    "Paste": "แปะ",
    "Basic Formatting": "การจัดรูปแบบพื้นฐาน",
    "Increase quote level": "ระดับราคาเพิ่มขึ้น",
    "Decrease quote level": "ระดับราคาลดลง",
    "Image / Video": "ภาพ / วิดีโอ",
    "Resize larger": "ปรับขนาดใหญ่ขึ้น",
    "Resize smaller": "ปรับขนาดเล็กลง",
    "Table": "ตาราง",
    "Select table cell": "เลือกเซลล์ตาราง",
    "Extend selection one cell": "ขยายการเลือกหนึ่งเซลล์",
    "Extend selection one row": "ขยายการเลือกหนึ่งแถว",
    "Navigation": "การเดินเรือ",
    "Focus popup / toolbar": "โฟกัสป๊อปอัพ / แถบเครื่องมือ",
    "Return focus to previous position": "กลับไปยังตำแหน่งก่อนหน้า",

    // Embed.ly
    "Embed URL": "ฝัง URL",
    "Paste in a URL to embed": "วางใน url เพื่อฝัง",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "เนื้อหาที่วางจะมาจากเอกสารคำในแบบ microsoft คุณต้องการเก็บรูปแบบหรือทำความสะอาดหรือไม่?",
    "Keep": "เก็บ",
    "Clean": "สะอาด",
    "Word Paste Detected": "ตรวจพบการวางคำ"
  },
  direction: "ltr"
};

}));

