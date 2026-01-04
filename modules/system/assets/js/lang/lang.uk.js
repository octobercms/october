/*
 * This file has been compiled from: /modules/system/lang/uk/client.php
 */
if (!window.oc) {
    window.oc = {};
}

if (!window.oc.langMessages) {
    window.oc.langMessages = {};
}

window.oc.langMessages['uk'] = $.extend(
    window.oc.langMessages['uk'] || {},
    {
    "markdowneditor": {
        "formatting": "\u0424\u043e\u0440\u043c\u0430\u0442\u0443\u0432\u0430\u043d\u043d\u044f",
        "quote": "\u0426\u0438\u0442\u0430\u0442\u0430",
        "code": "\u041a\u043e\u0434",
        "header1": "\u0417\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a 1",
        "header2": "\u0417\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a 2",
        "header3": "\u0417\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a 3",
        "header4": "\u0417\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a 4",
        "header5": "\u0417\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a 5",
        "header6": "\u0417\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a 6",
        "bold": "\u0416\u0438\u0440\u043d\u0438\u0439 \u0448\u0440\u0438\u0444\u0442",
        "italic": "\u041a\u0443\u0440\u0441\u0438\u0432",
        "unorderedlist": "\u041d\u0435\u043d\u0443\u043c\u0435\u0440\u043e\u0432\u0430\u043d\u043d\u0438\u0439 \u0441\u043f\u0438\u0441\u043e\u043a",
        "orderedlist": "\u041d\u0443\u043c\u0456\u0440\u043e\u0432\u0430\u043d\u043d\u0438\u0439 \u0441\u043f\u0438\u0441\u043e\u043a",
        "snippet": "Snippet",
        "video": "\u0412\u0456\u0434\u0435\u043e",
        "image": "\u0417\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u043d\u044f",
        "link": "\u041f\u043e\u0441\u0438\u043b\u0430\u043d\u043d\u044f",
        "horizontalrule": "\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u0438 \u0433\u043e\u0440\u0438\u0437\u043e\u043d\u0442\u0430\u043b\u044c\u043d\u0443 \u0440\u0438\u0441\u043a\u0443",
        "fullscreen": "\u041f\u043e\u0432\u043d\u0438\u0439 \u0435\u043a\u0440\u0430\u043d",
        "preview": "\u041f\u043e\u043f\u0435\u0440\u0435\u0434\u043d\u0456\u0439 \u043f\u0435\u0440\u0435\u0433\u043b\u044f\u0434",
        "strikethrough": "Strikethrough",
        "cleanblock": "Clean Block",
        "table": "Table",
        "sidebyside": "Side by Side"
    },
    "mediamanager": {
        "insert_link": "\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u0438 \u043c\u0435\u0434\u0456\u0430-\u043f\u043e\u0441\u0438\u043b\u0430\u043d\u043d\u044f",
        "insert_image": "\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u0438 \u043c\u0435\u0434\u0456\u0430-\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u043d\u044f",
        "insert_video": "\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u0438 \u043c\u0435\u0434\u0456\u0430-\u0432\u0456\u0434\u0435\u043e",
        "insert_audio": "\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u0438 \u043c\u0435\u0434\u0456\u0430-\u0430\u0443\u0434\u0456\u043e",
        "invalid_file_empty_insert": "\u0411\u0443\u0434\u044c \u043b\u0430\u0441\u043a\u0430, \u043e\u0431\u0435\u0440\u0456\u0442\u044c \u0444\u0430\u0439\u043b \u0434\u043b\u044f \u0432\u0441\u0442\u0430\u0432\u043a\u0438 \u043f\u043e\u0441\u0438\u043b\u0430\u043d\u043d\u044f.",
        "invalid_file_single_insert": "\u0411\u0443\u0434\u044c \u043b\u0430\u0441\u043a\u0430, \u043e\u0431\u0435\u0440\u0456\u0442\u044c \u043e\u0434\u0438\u043d \u0444\u0430\u0439\u043b.",
        "invalid_image_empty_insert": "\u0411\u0443\u0434\u044c \u043b\u0430\u0441\u043a\u0430, \u043e\u0431\u0435\u0440\u0456\u0442\u044c \u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u043d\u044f \u0434\u043b\u044f \u0432\u0441\u0442\u0430\u0432\u043a\u0438.",
        "invalid_video_empty_insert": "\u0411\u0443\u0434\u044c \u043b\u0430\u0441\u043a\u0430, \u043e\u0431\u0435\u0440\u0456\u0442\u044c \u0432\u0456\u0434\u0435\u043e \u0434\u043b\u044f \u0432\u0441\u0442\u0430\u0432\u043a\u0438.",
        "invalid_audio_empty_insert": "\u0411\u0443\u0434\u044c \u043b\u0430\u0441\u043a\u0430, \u043e\u0431\u0435\u0440\u0456\u0442\u044c \u0430\u0443\u0434\u0456\u043e \u0434\u043b\u044f \u0432\u0441\u0442\u0430\u0432\u043a\u0438."
    },
    "alert": {
        "error": "Error",
        "confirm": "Confirm",
        "dismiss": "Dismiss",
        "confirm_button_text": "\u041e\u043a",
        "cancel_button_text": "\u0421\u043a\u0430\u0441\u0443\u0432\u0430\u0442\u0438",
        "widget_remove_confirm": "\u0412\u0438\u0434\u0430\u043b\u0438\u0442\u0438 \u0446\u0435\u0439 \u0432\u0456\u0434\u0436\u0435\u0442?"
    },
    "datepicker": {
        "previousMonth": "\u041f\u043e\u043f\u0435\u0440\u0435\u0434\u043d\u0456\u0439 \u043c\u0456\u0441\u044f\u0446\u044c",
        "nextMonth": "\u041d\u0430\u0441\u0442\u0443\u043f\u043d\u0438\u0439 \u043c\u0456\u0441\u044f\u0446\u044c",
        "months": [
            "\u0421\u0456\u0447\u0435\u043d\u044c",
            "\u041b\u044e\u0442\u0438\u0439",
            "\u0411\u0435\u0440\u0435\u0437\u0435\u043d\u044c",
            "\u041a\u0432\u0456\u0442\u0435\u043d\u044c",
            "\u0422\u0440\u0430\u0432\u0435\u043d\u044c",
            "\u0427\u0435\u0440\u0432\u0435\u043d\u044c",
            "\u041b\u0438\u043f\u0435\u043d\u044c",
            "\u0421\u0435\u0440\u043f\u0435\u043d\u044c",
            "\u0412\u0435\u0440\u0435\u0441\u0435\u043d\u044c",
            "\u0416\u043e\u0432\u0442\u0435\u043d\u044c",
            "\u041b\u0438\u0441\u0442\u043e\u043f\u0430\u0434",
            "\u0413\u0440\u0443\u0434\u0435\u043d\u044c"
        ],
        "weekdays": [
            "\u041d\u0435\u0434\u0456\u043b\u044f",
            "\u041f\u043e\u043d\u0435\u0434\u0456\u043b\u043e\u043a",
            "\u0412\u0456\u0432\u0442\u043e\u0440\u043e\u043a",
            "\u0421\u0435\u0440\u0435\u0434\u0430",
            "\u0427\u0435\u0442\u0432\u0435\u0440",
            "\u041f'\u044f\u0442\u043d\u0438\u0446\u044f",
            "C\u0443\u0431\u043e\u0442\u0430"
        ],
        "weekdaysShort": [
            "\u041d\u0434",
            "\u041f\u043d",
            "\u0412\u0442",
            "\u0421\u0440",
            "\u0427\u0442",
            "\u041f\u0442",
            "\u0421\u0431"
        ]
    },
    "colorpicker": {
        "choose": "OK"
    },
    "filter": {
        "group": {
            "all": "\u0432\u0441\u0456"
        },
        "scopes": {
            "apply_button_text": "Apply",
            "clear_button_text": "Clear"
        },
        "dates": {
            "all": "\u0432\u0441\u0456",
            "filter_button_text": "\u0424\u0456\u043b\u044c\u0442\u0440",
            "reset_button_text": "\u0421\u043a\u0438\u043d\u0443\u0442\u0438",
            "date_placeholder": "\u0414\u0430\u0442\u0430",
            "after_placeholder": "\u041f\u0456\u0441\u043b\u044f",
            "before_placeholder": "\u0414\u043e"
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
        "show_stacktrace": "\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u0438 \u0442\u0440\u0430\u0441\u0443\u0432\u0430\u043d\u043d\u044f \u0441\u0442\u0435\u043a\u0430",
        "hide_stacktrace": "\u041f\u0440\u0438\u0445\u043e\u0432\u0430\u0442\u0438 \u0442\u0440\u0430\u0441\u0443\u0432\u0430\u043d\u043d\u044f \u0441\u0442\u0435\u043a\u0430",
        "tabs": {
            "formatted": "\u0424\u043e\u0440\u043c\u0430\u0442\u043e\u0432\u0430\u043d\u0438\u0439",
            "raw": "\u041f\u043e\u0447\u0430\u0442\u043a\u043e\u0432\u0438\u0439"
        },
        "editor": {
            "title": "\u0420\u0435\u0434\u0430\u043a\u0442\u043e\u0440 \u0432\u0438\u0445\u0456\u0434\u043d\u043e\u0433\u043e \u043a\u043e\u0434\u0443",
            "description": "\u0412\u0430\u0448\u0430 \u043e\u043f\u0435\u0440\u0430\u0446\u0456\u0439\u043d\u0430 \u0441\u0438\u0441\u0442\u0435\u043c\u0430 \u043f\u043e\u0432\u0438\u043d\u043d\u0430 \u0431\u0443\u0442\u0438 \u043d\u0430\u043b\u0430\u0448\u0442\u043e\u0432\u0430\u043d\u0430 \u043d\u0430 \u043f\u0440\u043e\u0441\u043b\u0443\u0445\u043e\u0432\u0443\u0432\u0430\u043d\u043d\u044f \u0434\u043e \u043e\u0434\u043d\u0456\u0454\u0457 \u0437 \u0446\u0438\u0445 \u0441\u0445\u0435\u043c URL.",
            "openWith": "\u0412\u0456\u0434\u043a\u0440\u0438\u0442\u0438 \u0437\u0430 \u0434\u043e\u043f\u043e\u043c\u043e\u0433\u043e\u044e",
            "remember_choice": "\u0417\u0430\u043f\u0430\u043c'\u044f\u0442\u0430\u0442\u0438 \u043e\u0431\u0440\u0430\u043d\u0438\u0439 \u0432\u0430\u0440\u0456\u0430\u043d\u0442 \u0434\u043b\u044f \u0446\u0456\u0454\u0457 \u0441\u0435\u0441\u0456\u0457",
            "open": "\u0412\u0456\u0434\u043a\u0440\u0438\u0442\u0438",
            "cancel": "\u0421\u043a\u0430\u0441\u0443\u0432\u0430\u0442\u0438",
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


    function plural(word, num) {
        var forms = word.split('_');
        return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
    }
    function relativeTimeWithPlural(number, withoutSuffix, key) {
        var format = {
            'ss': withoutSuffix ? 'секунда_секунди_секунд' : 'секунду_секунди_секунд',
            'mm': withoutSuffix ? 'хвилина_хвилини_хвилин' : 'хвилину_хвилини_хвилин',
            'hh': withoutSuffix ? 'година_години_годин' : 'годину_години_годин',
            'dd': 'день_дні_днів',
            'MM': 'місяць_місяці_місяців',
            'yy': 'рік_роки_років'
        };
        if (key === 'm') {
            return withoutSuffix ? 'хвилина' : 'хвилину';
        }
        else if (key === 'h') {
            return withoutSuffix ? 'година' : 'годину';
        }
        else {
            return number + ' ' + plural(format[key], +number);
        }
    }
    function weekdaysCaseReplace(m, format) {
        var weekdays = {
            'nominative': 'неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота'.split('_'),
            'accusative': 'неділю_понеділок_вівторок_середу_четвер_п’ятницю_суботу'.split('_'),
            'genitive': 'неділі_понеділка_вівторка_середи_четверга_п’ятниці_суботи'.split('_')
        };

        if (!m) {
            return weekdays['nominative'];
        }

        var nounCase = (/(\[[ВвУу]\]) ?dddd/).test(format) ?
            'accusative' :
            ((/\[?(?:минулої|наступної)? ?\] ?dddd/).test(format) ?
                'genitive' :
                'nominative');
        return weekdays[nounCase][m.day()];
    }
    function processHoursFunction(str) {
        return function () {
            return str + 'о' + (this.hours() === 11 ? 'б' : '') + '] LT';
        };
    }

    var uk = moment.defineLocale('uk', {
        months : {
            'format': 'січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня'.split('_'),
            'standalone': 'січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень'.split('_')
        },
        monthsShort : 'січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд'.split('_'),
        weekdays : weekdaysCaseReplace,
        weekdaysShort : 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
        weekdaysMin : 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D MMMM YYYY р.',
            LLL : 'D MMMM YYYY р., HH:mm',
            LLLL : 'dddd, D MMMM YYYY р., HH:mm'
        },
        calendar : {
            sameDay: processHoursFunction('[Сьогодні '),
            nextDay: processHoursFunction('[Завтра '),
            lastDay: processHoursFunction('[Вчора '),
            nextWeek: processHoursFunction('[У] dddd ['),
            lastWeek: function () {
                switch (this.day()) {
                    case 0:
                    case 3:
                    case 5:
                    case 6:
                        return processHoursFunction('[Минулої] dddd [').call(this);
                    case 1:
                    case 2:
                    case 4:
                        return processHoursFunction('[Минулого] dddd [').call(this);
                }
            },
            sameElse: 'L'
        },
        relativeTime : {
            future : 'за %s',
            past : '%s тому',
            s : 'декілька секунд',
            ss : relativeTimeWithPlural,
            m : relativeTimeWithPlural,
            mm : relativeTimeWithPlural,
            h : 'годину',
            hh : relativeTimeWithPlural,
            d : 'день',
            dd : relativeTimeWithPlural,
            M : 'місяць',
            MM : relativeTimeWithPlural,
            y : 'рік',
            yy : relativeTimeWithPlural
        },
        // M. E.: those two are virtually unused but a user might want to implement them for his/her website for some reason
        meridiemParse: /ночі|ранку|дня|вечора/,
        isPM: function (input) {
            return /^(дня|вечора)$/.test(input);
        },
        meridiem : function (hour, minute, isLower) {
            if (hour < 4) {
                return 'ночі';
            } else if (hour < 12) {
                return 'ранку';
            } else if (hour < 17) {
                return 'дня';
            } else {
                return 'вечора';
            }
        },
        dayOfMonthOrdinalParse: /\d{1,2}-(й|го)/,
        ordinal: function (number, period) {
            switch (period) {
                case 'M':
                case 'd':
                case 'DDD':
                case 'w':
                case 'W':
                    return number + '-й';
                case 'D':
                    return number + '-го';
                default:
                    return number;
            }
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 1st is the first week of the year.
        }
    });

    return uk;

})));


/*! Select2 4.1.0-rc.0 | https://github.com/select2/select2/blob/master/LICENSE.md */

!function(){if(jQuery&&jQuery.fn&&jQuery.fn.select2&&jQuery.fn.select2.amd)var n=jQuery.fn.select2.amd;n.define("select2/i18n/uk",[],function(){function n(n,e,u,r){return n%100>10&&n%100<15?r:n%10==1?e:n%10>1&&n%10<5?u:r}return{errorLoading:function(){return"Неможливо завантажити результати"},inputTooLong:function(e){return"Будь ласка, видаліть "+(e.input.length-e.maximum)+" "+n(e.maximum,"літеру","літери","літер")},inputTooShort:function(n){return"Будь ласка, введіть "+(n.minimum-n.input.length)+" або більше літер"},loadingMore:function(){return"Завантаження інших результатів…"},maximumSelected:function(e){return"Ви можете вибрати лише "+e.maximum+" "+n(e.maximum,"пункт","пункти","пунктів")},noResults:function(){return"Нічого не знайдено"},searching:function(){return"Пошук…"},removeAllItems:function(){return"Видалити всі елементи"}}}),n.define,n.require}();

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
 * Ukrainian
 */

if (!$.FE_LANGUAGE) {
    $.FE_LANGUAGE = {};
}

$.FE_LANGUAGE['uk'] = {
  translation: {
    // Place holder
    "Type something": "\u041d\u0430\u043f\u0438\u0448\u0456\u0442\u044c \u0431\u0443\u0434\u044c-\u0449\u043e",

    // Basic formatting
    "Bold": "\u0416\u0438\u0440\u043d\u0438\u0439",
    "Italic": "\u041a\u0443\u0440\u0441\u0438\u0432",
    "Underline": "\u041f\u0456\u0434\u043a\u0440\u0435\u0441\u043b\u0435\u043d\u0438\u0439",
    "Strikethrough": "\u0417\u0430\u043a\u0440\u0435\u0441\u043b\u0435\u043d\u0438\u0439",

    // Main buttons
    "Insert": "\u0432\u0441\u0442\u0430\u0432\u0438\u0442\u0438",
    "Delete": "\u0412\u0438\u0434\u0430\u043b\u0438\u0442\u0438",
    "Cancel": "\u0421\u043a\u0430\u0441\u0443\u0432\u0430\u0442\u0438",
    "OK": "OK",
    "Back": "\u043d\u0430\u0437\u0430\u0434",
    "Remove": "\u0432\u0438\u0434\u0430\u043b\u0438\u0442\u0438",
    "More": "\u0431\u0456\u043b\u044c\u0448\u0435",
    "Update": "\u043e\u043d\u043e\u0432\u043b\u0435\u043d\u043d\u044f",
    "Style": "\u0441\u0442\u0438\u043b\u044c",

    // Font
    "Font Family": "\u0428\u0440\u0438\u0444\u0442",
    "Font Size": "\u0420\u043e\u0437\u043c\u0456\u0440 \u0448\u0440\u0438\u0444\u0442\u0443",

    // Colors
    "Colors": "\u043a\u043e\u043b\u044c\u043e\u0440\u0438",
    "Background": "\u0424\u043e\u043d",
    "Text": "\u0422\u0435\u043a\u0441\u0442",
    "HEX Color": "Шістнадцятковий колір",

    // Paragraphs
    "Paragraph Format": "\u0424\u043e\u0440\u043c\u0430\u0442",
    "Normal": "\u041d\u043e\u0440\u043c\u0430\u043b\u044c\u043d\u0438\u0439",
    "Code": "\u041a\u043e\u0434",
    "Heading 1": "\u0417\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a 1",
    "Heading 2": "\u0417\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a 2",
    "Heading 3": "\u0417\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a 3",
    "Heading 4": "\u0417\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a 4",

    // Style
    "Paragraph Style": "\u043f\u0443\u043d\u043a\u0442 \u0441\u0442\u0438\u043b\u044c",
    "Inline Style": "\u0432\u0431\u0443\u0434\u043e\u0432\u0430\u043d\u0438\u0439 \u0441\u0442\u0438\u043b\u044c",

    // Alignment
    "Align": "\u0412\u0438\u0440\u0456\u0432\u043d\u044e\u0432\u0430\u043d\u043d\u044f",
    "Align Left": "\u041f\u043e \u043b\u0456\u0432\u043e\u043c\u0443 \u043a\u0440\u0430\u044e",
    "Align Center": "\u041f\u043e \u0446\u0435\u043d\u0442\u0440\u0443",
    "Align Right": "\u041f\u043e \u043f\u0440\u0430\u0432\u043e\u043c\u0443 \u043a\u0440\u0430\u044e",
    "Align Justify": "\u041f\u043e \u0448\u0438\u0440\u0438\u043d\u0456",
    "None": "\u043d\u0456",

    // Lists
    "Ordered List": "\u041d\u0443\u043c\u0435\u0440\u043e\u0432\u0430\u043d\u0438\u0439 \u0441\u043f\u0438\u0441\u043e\u043a",
    "Default": "За замовчуванням",
    "Lower Alpha": "Нижня альфа",
    "Lower Greek": "Нижній грецький",
    "Lower Roman": "Нижній римський",
    "Upper Alpha": "Верхня альфа",
    "Upper Roman": "Верхній римський",

    "Unordered List": "\u041c\u0430\u0440\u043a\u043e\u0432\u0430\u043d\u0438\u0439 \u0441\u043f\u0438\u0441\u043e\u043a",
    "Circle": "Коло",
    "Disc": "Диск",
    "Square": "Площа",

    // Line height
    "Line Height": "Висота рядка",
    "Single": "Одномісний",
    "Double": "Подвійний",

    // Indent
    "Decrease Indent": "\u0417\u043c\u0435\u043d\u0448\u0438\u0442\u0438 \u0432\u0456\u0434\u0441\u0442\u0443\u043f",
    "Increase Indent": "\u0417\u0431\u0456\u043b\u044c\u0448\u0438\u0442\u0438 \u0432\u0456\u0434\u0441\u0442\u0443\u043f",

    // Links
    "Insert Link": "\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u0438 \u043f\u043e\u0441\u0438\u043b\u0430\u043d\u043d\u044f",
    "Open in new tab": "\u0412\u0456\u0434\u043a\u0440\u0438\u0442\u0438 \u0432 \u043d\u043e\u0432\u0456\u0439 \u0432\u043a\u043b\u0430\u0434\u0446\u0456",
    "Open Link": "\u0432\u0456\u0434\u043a\u0440\u0438\u0442\u0438 \u043f\u043e\u0441\u0438\u043b\u0430\u043d\u043d\u044f",
    "Edit Link": "\u0440\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u0442\u0438 \u043f\u043e\u0441\u0438\u043b\u0430\u043d\u043d\u044f",
    "Unlink": "\u0412\u0438\u0434\u0430\u043b\u0438\u0442\u0438 \u043f\u043e\u0441\u0438\u043b\u0430\u043d\u043d\u044f",
    "Choose Link": "\u0412\u0438\u0431\u0435\u0440\u0456\u0442\u044c \u043f\u043e\u0441\u0438\u043b\u0430\u043d\u043d\u044f",

    // Images
    "Insert Image": "\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u0438 \u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u043d\u044f",
    "Upload Image": "\u0417\u0430\u0432\u0430\u043d\u0442\u0430\u0436\u0438\u0442\u0438 \u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u043d\u044f",
    "By URL": "\u0437\u0430 URL",
    "Browse": "\u043f\u0435\u0440\u0435\u0433\u043b\u044f\u0434\u0430\u0442\u0438",
    "Drop image": "\u041f\u0435\u0440\u0435\u043c\u0456\u0441\u0442\u0456\u0442\u044c \u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u043d\u044f \u0441\u044e\u0434\u0438",
    "or click": "\u0430\u0431\u043e \u043d\u0430\u0442\u0438\u0441\u043d\u0456\u0442\u044c",
    "Manage Images": "\u041a\u0435\u0440\u0443\u0432\u0430\u043d\u043d\u044f \u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u043d\u044f\u043c\u0438",
    "Loading": "\u0417\u0430\u0432\u0430\u043d\u0442\u0430\u0436\u0435\u043d\u043d\u044f",
    "Deleting": "\u0432\u0438\u0434\u0430\u043b\u0435\u043d\u043d\u044f",
    "Tags": "\u043a\u043b\u044e\u0447\u043e\u0432\u0456 \u0441\u043b\u043e\u0432\u0430",
    "Are you sure? Image will be deleted.": "\u0412\u0438 \u0432\u043f\u0435\u0432\u043d\u0435\u043d\u0456? \u0417\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u043d\u044f \u0431\u0443\u0434\u0435 \u0432\u0438\u0434\u0430\u043b\u0435\u043d\u043e.",
    "Replace": "\u0437\u0430\u043c\u0456\u043d\u044e\u0432\u0430\u0442\u0438",
    "Uploading": "\u0417\u0430\u0432\u0430\u043d\u0442\u0430\u0436\u0435\u043d\u043d\u044f",
    "Loading image": "\u0417\u0430\u0432\u0430\u043d\u0442\u0430\u0436\u0435\u043d\u043d\u044f \u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u044c",
    "Display": "\u0434\u0438\u0441\u043f\u043b\u0435\u0439",
    "Inline": "\u0412 \u043b\u0456\u043d\u0456\u044e",
    "Break Text": "\u043f\u0435\u0440\u0435\u0440\u0432\u0430 \u0442\u0435\u043a\u0441\u0442",
    "Alternative Text": "\u0430\u043b\u044c\u0442\u0435\u0440\u043d\u0430\u0442\u0438\u0432\u043d\u0438\u0439 \u0442\u0435\u043a\u0441\u0442",
    "Change Size": "\u0437\u043c\u0456\u043d\u0438\u0442\u0438 \u0440\u043e\u0437\u043c\u0456\u0440",
    "Width": "\u0428\u0438\u0440\u0438\u043d\u0430",
    "Height": "\u0412\u0438\u0441\u043e\u0442\u0430",
    "Something went wrong. Please try again.": "\u0429\u043e\u0441\u044c \u043f\u0456\u0448\u043b\u043e \u043d\u0435 \u0442\u0430\u043a. \u0411\u0443\u0434\u044c \u043b\u0430\u0441\u043a\u0430 \u0441\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0449\u0435 \u0440\u0430\u0437.",
    "Image Caption": "Заголовок зображення",
    "Advanced Edit": "Розширений редагування",

    // Video
    "Insert Video": "\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u0438 \u0432\u0456\u0434\u0435\u043e",
    "Embedded Code": "\u0432\u0431\u0443\u0434\u043e\u0432\u0430\u043d\u0438\u0439 \u043a\u043e\u0434",
    "Paste in a video URL": "Вставте в відео-URL",
    "Drop video": "Перетягніть відео",
    "Your browser does not support HTML5 video.": "Ваш браузер не підтримує відео html5.",
    "Upload Video": "Завантажити відео",

    // Tables
    "Insert Table": "\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u0438 \u0442\u0430\u0431\u043b\u0438\u0446\u044e",
    "Table Header": "\u0417\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a \u0442\u0430\u0431\u043b\u0438\u0446\u0456",
    "Remove Table": "\u0412\u0438\u0434\u0430\u043b\u0438\u0442\u0438 \u0442\u0430\u0431\u043b\u0438\u0446\u0456",
    "Table Style": "\u0421\u0442\u0438\u043b\u044c \u0442\u0430\u0431\u043b\u0438\u0446\u0456",
    "Horizontal Align": "\u0413\u043e\u0440\u0438\u0437\u043e\u043d\u0442\u0430\u043b\u044c\u043d\u0435 \u0432\u0438\u0440\u0456\u0432\u043d\u044e\u0432\u0430\u043d\u043d\u044f",
    "Row": "\u0420\u044f\u0434\u043e\u043a",
    "Insert row above": "\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u0438 \u043f\u043e\u0440\u043e\u0436\u043d\u0456\u0439 \u0440\u044f\u0434\u043e\u043a \u0437\u0432\u0435\u0440\u0445\u0443",
    "Insert row below": "\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u0438 \u043f\u043e\u0440\u043e\u0436\u043d\u0456\u0439 \u0440\u044f\u0434\u043e\u043a \u0437\u043d\u0438\u0437\u0443",
    "Delete row": "\u0412\u0438\u0434\u0430\u043b\u0438\u0442\u0438 \u0440\u044f\u0434\u043e\u043a",
    "Column": "\u0421\u0442\u043e\u0432\u043f\u0435\u0446\u044c",
    "Insert column before": "\u0414\u043e\u0434\u0430\u0442\u0438 \u0441\u0442\u043e\u0432\u043f\u0435\u0446\u044c \u043b\u0456\u0432\u043e\u0440\u0443\u0447",
    "Insert column after": "\u0414\u043e\u0434\u0430\u0442\u0438 \u0441\u0442\u043e\u0432\u043f\u0435\u0446\u044c \u043f\u0440\u0430\u0432\u043e\u0440\u0443\u0447",
    "Delete column": "\u0412\u0438\u0434\u0430\u043b\u0438\u0442\u0438 \u0441\u0442\u043e\u0432\u043f\u0435\u0446\u044c",
    "Cell": "\u041a\u043e\u043c\u0456\u0440\u043a\u0430",
    "Merge cells": "\u041e\u0431'\u0454\u0434\u043d\u0430\u0442\u0438 \u043a\u043e\u043c\u0456\u0440\u043a\u0438",
    "Horizontal split": "\u0420\u043e\u0437\u0434\u0456\u043b\u0438\u0442\u0438 \u0433\u043e\u0440\u0438\u0437\u043e\u043d\u0442\u0430\u043b\u044c\u043d\u043e",
    "Vertical split": "\u0420\u043e\u0437\u0434\u0456\u043b\u0438\u0442\u0438 \u0432\u0435\u0440\u0442\u0438\u043a\u0430\u043b\u044c\u043d\u043e",
    "Cell Background": "\u0441\u0442\u0456\u043b\u044c\u043d\u0438\u043a\u043e\u0432\u0438\u0439 \u0444\u043e\u043d",
    "Vertical Align": "\u0432\u0435\u0440\u0442\u0438\u043a\u0430\u043b\u044c\u043d\u0430 \u0432\u0438\u0440\u0456\u0432\u043d\u044e\u0432\u0430\u043d\u043d\u044f",
    "Top": "\u0422\u043e\u043f",
    "Middle": "\u0441\u0435\u0440\u0435\u0434\u043d\u0456\u0439",
    "Bottom": "\u0434\u043d\u043e",
    "Align Top": "\u0417\u0456\u0441\u0442\u0430\u0432\u0442\u0435 \u0432\u0435\u0440\u0445\u043d\u044e",
    "Align Middle": "\u0432\u0438\u0440\u0456\u0432\u043d\u044f\u0442\u0438 \u043f\u043e \u0441\u0435\u0440\u0435\u0434\u0438\u043d\u0456",
    "Align Bottom": "\u0417\u0456\u0441\u0442\u0430\u0432\u0442\u0435 \u043d\u0438\u0436\u043d\u044e",
    "Cell Style": "\u0441\u0442\u0438\u043b\u044c \u043a\u043e\u043c\u0456\u0440\u043a\u0438",

    // Files
    "Upload File": "\u0417\u0430\u0432\u0430\u043d\u0442\u0430\u0436\u0438\u0442\u0438 \u0444\u0430\u0439\u043b",
    "Drop file": "\u041f\u0435\u0440\u0435\u043c\u0456\u0441\u0442\u0456\u0442\u044c \u0444\u0430\u0439\u043b \u0441\u044e\u0434\u0438",

    // Emoticons
    "Emoticons": "\u0441\u043c\u0430\u0439\u043b\u0438",
    "Grinning face": "\u043f\u043e\u0441\u043c\u0456\u0445\u043d\u0443\u0432\u0448\u0438\u0441\u044c \u043e\u0441\u043e\u0431\u0430",
    "Grinning face with smiling eyes": "\u041f\u043e\u0441\u043c\u0456\u0445\u043d\u0443\u0432\u0448\u0438\u0441\u044c \u043e\u0441\u043e\u0431\u0430 \u0437 \u0443\u0441\u043c\u0456\u0445\u043d\u0435\u043d\u0438\u043c\u0438 \u043e\u0447\u0438\u043c\u0430",
    "Face with tears of joy": "\u041e\u0431\u043b\u0438\u0447\u0447\u044f \u0437\u0456 \u0441\u043b\u044c\u043e\u0437\u0430\u043c\u0438 \u0440\u0430\u0434\u043e\u0441\u0442\u0456",
    "Smiling face with open mouth": "\u0423\u0441\u043c\u0456\u0445\u043d\u0435\u043d\u0435 \u043e\u0431\u043b\u0438\u0447\u0447\u044f \u0437 \u0432\u0456\u0434\u043a\u0440\u0438\u0442\u0438\u043c \u0440\u043e\u0442\u043e\u043c",
    "Smiling face with open mouth and smiling eyes": "\u041f\u043e\u0441\u043c\u0456\u0445\u0430\u044e\u0447\u0438\u0441\u044c \u043e\u0441\u043e\u0431\u0430 \u0437 \u0432\u0456\u0434\u043a\u0440\u0438\u0442\u0438\u043c \u0440\u043e\u0442\u043e\u043c \u0456 ",
    "Smiling face with open mouth and cold sweat": "\u041f\u043e\u0441\u043c\u0456\u0445\u0430\u044e\u0447\u0438\u0441\u044c \u043e\u0441\u043e\u0431\u0430 \u0437 \u0432\u0456\u0434\u043a\u0440\u0438\u0442\u0438\u043c \u0440\u043e\u0442\u043e\u043c \u0456 ",
    "Smiling face with open mouth and tightly-closed eyes": "\u041f\u043e\u0441\u043c\u0456\u0445\u0430\u044e\u0447\u0438\u0441\u044c \u043e\u0441\u043e\u0431\u0430 \u0437 \u0432\u0456\u0434\u043a\u0440\u0438\u0442\u0438\u043c \u0440\u043e\u0442\u043e\u043c \u0456 \u0449\u0456\u043b\u044c\u043d\u043e \u0437\u0430\u043a\u0440\u0438\u0442\u0438\u043c\u0438 \u043e\u0447\u0438\u043c\u0430",
    "Smiling face with halo": "\u041f\u043e\u0441\u043c\u0456\u0445\u0430\u044e\u0447\u0438\u0441\u044c \u043e\u0441\u043e\u0431\u0430 \u0433\u0430\u043b\u043e",
    "Smiling face with horns": "\u041f\u043e\u0441\u043c\u0456\u0445\u0430\u044e\u0447\u0438\u0441\u044c \u043e\u0441\u043e\u0431\u0430 \u0437 \u0440\u043e\u0433\u0430\u043c\u0438",
    "Winking face": "\u043f\u0456\u0434\u043c\u043e\u0440\u0433\u0443\u044e\u0447\u0438 \u043e\u0441\u043e\u0431\u0430",
    "Smiling face with smiling eyes": "\u041f\u043e\u0441\u043c\u0456\u0445\u0430\u044e\u0447\u0438\u0441\u044c \u043e\u0441\u043e\u0431\u0430 \u0437 \u0443\u0441\u043c\u0456\u0445\u043d\u0435\u043d\u0438\u043c\u0438 \u043e\u0447\u0438\u043c\u0430",
    "Face savoring delicious food": "\u041e\u0441\u043e\u0431\u0430 \u0441\u043c\u0430\u043a\u0443\u044e\u0447\u0438 \u0441\u043c\u0430\u0447\u043d\u0443 \u0457\u0436\u0443",
    "Relieved face": "\u0437\u0432\u0456\u043b\u044c\u043d\u0435\u043d\u043e \u043e\u0441\u043e\u0431\u0430",
    "Smiling face with heart-shaped eyes": "\u041f\u043e\u0441\u043c\u0456\u0445\u0430\u044e\u0447\u0438\u0441\u044c \u043e\u0441\u043e\u0431\u0430 \u0443 \u0444\u043e\u0440\u043c\u0456 \u0441\u0435\u0440\u0446\u044f \u043e\u0447\u0438\u043c\u0430",
    "Smiling face with sunglasses": "\u0053\u006d\u0069\u006c\u0069\u006e\u0067 \u0066\u0061\u0063\u0065 \u0077\u0069\u0074\u0068 \u0073\u0075\u006e\u0067\u006c\u0061\u0073\u0073\u0065\u0073",
    "Smirking face": "\u043f\u043e\u0441\u043c\u0456\u0445\u043d\u0443\u0432\u0448\u0438\u0441\u044c \u043e\u0441\u043e\u0431\u0430",
    "Neutral face": "\u0437\u0432\u0438\u0447\u0430\u0439\u043d\u0438\u0439 \u043e\u0441\u043e\u0431\u0430",
    "Expressionless face": "\u043d\u0435\u0432\u0438\u0440\u0430\u0437\u043d\u0456 \u043e\u0431\u043b\u0438\u0447\u0447\u044f",
    "Unamused face": "\u0055\u006e\u0061\u006d\u0075\u0073\u0065\u0064 \u043e\u0441\u043e\u0431\u0430",
    "Face with cold sweat": "\u041e\u0441\u043e\u0431\u0430 \u0437 \u0445\u043e\u043b\u043e\u0434\u043d\u043e\u0433\u043e \u043f\u043e\u0442\u0443",
    "Pensive face": "\u0437\u0430\u043c\u0438\u0441\u043b\u0435\u043d\u0438\u0439 \u043e\u0441\u043e\u0431\u0430",
    "Confused face": "\u043f\u043b\u0443\u0442\u0430\u0442\u0438 \u043e\u0441\u043e\u0431\u0430",
    "Confounded face": "\u043d\u0435\u0445\u0430\u0439 \u043f\u043e\u0441\u043e\u0440\u043e\u043c\u043b\u044f\u0442\u044c\u0441\u044f \u043e\u0441\u043e\u0431\u0430",
    "Kissing face": "\u043f\u043e\u0446\u0456\u043b\u0443\u043d\u043a\u0438 \u043e\u0441\u043e\u0431\u0430",
    "Face throwing a kiss": "\u041e\u0441\u043e\u0431\u0430 \u043a\u0438\u0434\u0430\u043b\u0438 \u043f\u043e\u0446\u0456\u043b\u0443\u043d\u043e\u043a",
    "Kissing face with smiling eyes": "\u041f\u043e\u0446\u0456\u043b\u0443\u043d\u043a\u0438 \u043e\u0441\u043e\u0431\u0430 \u0437 \u0443\u0441\u043c\u0456\u0445\u043d\u0435\u043d\u0438\u043c\u0438 \u043e\u0447\u0438\u043c\u0430",
    "Kissing face with closed eyes": "\u041f\u043e\u0446\u0456\u043b\u0443\u043d\u043a\u0438 \u043e\u0431\u043b\u0438\u0447\u0447\u044f \u0437 \u0437\u0430\u043f\u043b\u044e\u0449\u0435\u043d\u0438\u043c\u0438 \u043e\u0447\u0438\u043c\u0430",
    "Face with stuck out tongue": "\u041e\u0431\u043b\u0438\u0447\u0447\u044f \u0437 \u0441\u0442\u0438\u0440\u0447\u0430\u043b\u0438 \u044f\u0437\u0438\u043a",
    "Face with stuck out tongue and winking eye": "\u041e\u0431\u043b\u0438\u0447\u0447\u044f \u0437 \u0441\u0442\u0438\u0440\u0447\u0430\u043b\u0438 \u044f\u0437\u0438\u043a\u0430 \u0456 \u0410\u043d\u0456\u043c\u043e\u0432\u0430\u043d\u0435 \u043e\u0447\u0435\u0439",
    "Face with stuck out tongue and tightly-closed eyes": "\u041e\u0431\u043b\u0438\u0447\u0447\u044f \u0437 \u0441\u0442\u0438\u0440\u0447\u0430\u043b\u0438 \u044f\u0437\u0438\u043a\u0430 \u0456 \u0449\u0456\u043b\u044c\u043d\u043e \u0437\u0430\u043a\u0440\u0438\u0442\u0456 \u043e\u0447\u0456",
    "Disappointed face": "\u0440\u043e\u0437\u0447\u0430\u0440\u043e\u0432\u0430\u043d\u0438\u0439 \u043e\u0441\u043e\u0431\u0430",
    "Worried face": "\u0441\u0442\u0443\u0440\u0431\u043e\u0432\u0430\u043d\u0438\u0439 \u043e\u0441\u043e\u0431\u0430",
    "Angry face": "\u0437\u043b\u0438\u0439 \u043e\u0441\u043e\u0431\u0430",
    "Pouting face": "\u043f\u0443\u0445\u043a\u0456 \u043e\u0441\u043e\u0431\u0430",
    "Crying face": "\u043f\u043b\u0430\u0447 \u043e\u0441\u043e\u0431\u0430",
    "Persevering face": "\u043d\u0430\u043f\u043e\u043b\u0435\u0433\u043b\u0438\u0432\u0430 \u043e\u0441\u043e\u0431\u0430",
    "Face with look of triumph": "\u041e\u0441\u043e\u0431\u0430 \u0437 \u0432\u0438\u0434\u043e\u043c \u0442\u0440\u0456\u0443\u043c\u0444\u0443",
    "Disappointed but relieved face": "\u0420\u043e\u0437\u0447\u0430\u0440\u043e\u0432\u0430\u043d\u0438\u0439\u002c \u0430\u043b\u0435 \u0437\u0432\u0456\u043b\u044c\u043d\u0435\u043d\u0438\u0439 \u043e\u0441\u043e\u0431\u0430",
    "Frowning face with open mouth": "\u041d\u0430\u0441\u0443\u043f\u0438\u0432\u0448\u0438\u0441\u044c \u043e\u0441\u043e\u0431\u0430 \u0437 \u0432\u0456\u0434\u043a\u0440\u0438\u0442\u0438\u043c \u0440\u043e\u0442\u043e\u043c",
    "Anguished face": "\u0431\u043e\u043b\u0456\u0441\u043d\u0438\u0439 \u043e\u0441\u043e\u0431\u0430",
    "Fearful face": "\u043f\u043e\u0431\u043e\u044e\u044e\u0447\u0438\u0441\u044c \u043e\u0441\u043e\u0431\u0430",
    "Weary face": "\u0432\u0442\u043e\u043c\u043b\u0435\u043d\u0438\u0439 \u043e\u0441\u043e\u0431\u0430",
    "Sleepy face": "сонне обличчя",
    "Tired face": "\u0432\u0442\u043e\u043c\u0438\u043b\u0438\u0441\u044f \u043e\u0441\u043e\u0431\u0430",
    "Grimacing face": "\u0433\u0440\u0438\u043c\u0430\u0441\u0443\u044e\u0447\u0438 \u043e\u0441\u043e\u0431\u0430",
    "Loudly crying face": "\u004c\u006f\u0075\u0064\u006c\u0079 \u0063\u0072\u0079\u0069\u006e\u0067 \u0066\u0061\u0063\u0065",
    "Face with open mouth": "\u041e\u0441\u043e\u0431\u0430 \u0437 \u0432\u0456\u0434\u043a\u0440\u0438\u0442\u0438\u043c \u0440\u043e\u0442\u043e\u043c",
    "Hushed face": "\u0437\u0430\u0442\u0438\u0445 \u043e\u0441\u043e\u0431\u0430",
    "Face with open mouth and cold sweat": "\u041e\u0441\u043e\u0431\u0430 \u0437 \u0432\u0456\u0434\u043a\u0440\u0438\u0442\u0438\u043c \u0440\u043e\u0442\u043e\u043c \u0456 \u0445\u043e\u043b\u043e\u0434\u043d\u0438\u0439 \u043f\u0456\u0442",
    "Face screaming in fear": "\u041e\u0441\u043e\u0431\u0430 \u043a\u0440\u0438\u0447\u0430\u0442\u0438 \u0432 \u0441\u0442\u0440\u0430\u0445\u0443",
    "Astonished face": "\u0437\u0434\u0438\u0432\u043e\u0432\u0430\u043d\u0438\u0439 \u043e\u0441\u043e\u0431\u0430",
    "Flushed face": "\u043f\u0440\u0438\u043f\u043b\u0438\u0432 \u043a\u0440\u043e\u0432\u0456 \u0434\u043e \u043e\u0431\u043b\u0438\u0447\u0447\u044f",
    "Sleeping face": "\u0421\u043f\u043b\u044f\u0447\u0430 \u043e\u0441\u043e\u0431\u0430",
    "Dizzy face": "\u0414\u0456\u0437\u0437\u0456 \u043e\u0441\u043e\u0431\u0430",
    "Face without mouth": "\u041e\u0441\u043e\u0431\u0430 \u0431\u0435\u0437 \u0440\u043e\u0442\u0430",
    "Face with medical mask": "\u041e\u0441\u043e\u0431\u0430 \u0437 \u043c\u0435\u0434\u0438\u0447\u043d\u043e\u044e \u043c\u0430\u0441\u043a\u043e\u044e",

    // Line breaker
    "Break": "\u0437\u043b\u043e\u043c\u0438\u0442\u0438",

    // Math
    "Subscript": "\u043f\u0456\u0434\u0440\u044f\u0434\u043a\u043e\u0432\u0438\u0439",
    "Superscript": "\u043d\u0430\u0434\u0440\u044f\u0434\u043a\u043e\u0432\u0438\u0439 \u0441\u0438\u043c\u0432\u043e\u043b",

    // Full screen
    "Fullscreen": "\u043f\u043e\u0432\u043d\u043e\u0435\u043a\u0440\u0430\u043d\u043d\u0438\u0439 \u0440\u0435\u0436\u0438\u043c",

    // Horizontal line
    "Insert Horizontal Line": "\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u0438 \u0433\u043e\u0440\u0438\u0437\u043e\u043d\u0442\u0430\u043b\u044c\u043d\u0443 \u043b\u0456\u043d\u0456\u044e",

    // Clear formatting
    "Clear Formatting": "\u041e\u0447\u0438\u0441\u0442\u0438\u0442\u0438 \u0444\u043e\u0440\u043c\u0430\u0442\u0443\u0432\u0430\u043d\u043d\u044f",

    // Save
    "Save": "\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438",

    // Undo, redo
    "Undo": "\u0421\u043a\u0430\u0441\u0443\u0432\u0430\u0442\u0438",
    "Redo": "\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u0438",

    // Select all
    "Select All": "\u0412\u0438\u0431\u0440\u0430\u0442\u0438 \u0432\u0441\u0435",

    // Code view
    "Code View": "\u041f\u0435\u0440\u0435\u0433\u043b\u044f\u0434 \u043a\u043e\u0434\u0443",

    // Quote
    "Quote": "\u0426\u0438\u0442\u0430\u0442\u0430",
    "Increase": "\u0417\u0431\u0456\u043b\u044c\u0448\u0438\u0442\u0438",
    "Decrease": "\u0437\u043d\u0438\u0436\u0435\u043d\u043d\u044f",

    // Quick Insert
    "Quick Insert": "\u0428\u0432\u0438\u0434\u043a\u0438\u0439 \u0432\u0441\u0442\u0430\u0432\u043a\u0430",

    // Spcial Characters
    "Special Characters": "Спеціальні символи",
    "Latin": "Латинський",
    "Greek": "Грецький",
    "Cyrillic": "Кирилиця",
    "Punctuation": "Пунктуація",
    "Currency": "Валюта",
    "Arrows": "Стріли",
    "Math": "Математика",
    "Misc": "Різне",

    // Print.
    "Print": "Друкувати",

    // Spell Checker.
    "Spell Checker": "Перевірка орфографії",

    // Help
    "Help": "Допомогти",
    "Shortcuts": "Ярлики",
    "Inline Editor": "Вбудований редактор",
    "Show the editor": "Показати редактору",
    "Common actions": "Спільні дії",
    "Copy": "Скопіювати",
    "Cut": "Вирізати",
    "Paste": "Вставити",
    "Basic Formatting": "Основне форматування",
    "Increase quote level": "Збільшити рівень цитування",
    "Decrease quote level": "Знизити рівень цитування",
    "Image / Video": "Зображення / відео",
    "Resize larger": "Змінити розмір більше",
    "Resize smaller": "Змінити розмір менше",
    "Table": "Стіл",
    "Select table cell": "Виберіть комірку таблиці",
    "Extend selection one cell": "Продовжити виділення однієї комірки",
    "Extend selection one row": "Продовжити виділення одного рядка",
    "Navigation": "Навігація",
    "Focus popup / toolbar": "Фокус спливаюче / панель інструментів",
    "Return focus to previous position": "Поверніть фокус на попередню позицію",

    // Embed.ly
    "Embed URL": "Вставити URL-адресу",
    "Paste in a URL to embed": "Вставте в url, щоб вставити",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "Вставлений вміст надходить з документу Microsoft Word. ви хочете зберегти формат чи очистити його?",
    "Keep": "Тримати",
    "Clean": "Чистий",
    "Word Paste Detected": "Слово паста виявлено"
  },
  direction: "ltr"
};

}));

