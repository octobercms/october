/*
 * This file has been compiled from: /modules/system/lang/en-ca/client.php
 */
if (!window.oc) {
    window.oc = {};
}

if (!window.oc.langMessages) {
    window.oc.langMessages = {};
}

window.oc.langMessages['en-ca'] = $.extend(
    window.oc.langMessages['en-ca'] || {},
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


    var enCa = moment.defineLocale('en-ca', {
        months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
        monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
        weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
        weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
        weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
        longDateFormat : {
            LT : 'h:mm A',
            LTS : 'h:mm:ss A',
            L : 'YYYY-MM-DD',
            LL : 'MMMM D, YYYY',
            LLL : 'MMMM D, YYYY h:mm A',
            LLLL : 'dddd, MMMM D, YYYY h:mm A'
        },
        calendar : {
            sameDay : '[Today at] LT',
            nextDay : '[Tomorrow at] LT',
            nextWeek : 'dddd [at] LT',
            lastDay : '[Yesterday at] LT',
            lastWeek : '[Last] dddd [at] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'in %s',
            past : '%s ago',
            s : 'a few seconds',
            ss : '%d seconds',
            m : 'a minute',
            mm : '%d minutes',
            h : 'an hour',
            hh : '%d hours',
            d : 'a day',
            dd : '%d days',
            M : 'a month',
            MM : '%d months',
            y : 'a year',
            yy : '%d years'
        },
        dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (~~(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    return enCa;

})));


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
 * English spoken in Canada
 */

if (!$.FE_LANGUAGE) {
    $.FE_LANGUAGE = {};
}

$.FE_LANGUAGE['en_ca'] = {
  translation: {
    // Place holder
    "Type something": "Type something",

    // Basic formatting
    "Bold": "Bold",
    "Italic": "Italic",
    "Underline": "Underline",
    "Strikethrough": "Strikethrough",

    // Main buttons
    "Insert": "Insert",
    "Delete": "Delete",
    "Cancel": "Cancel",
    "OK": "OK",
    "Back": "Back",
    "Remove": "Remove",
    "More": "More",
    "Update": "Update",
    "Style": "Style",

    // Font
    "Font Family": "Font Family",
    "Font Size": "Font Size",

    // Colors
    "Colors": "Colours",
    "Background": "Background",
    "Text": "Text",
    "HEX Color": "HEX Colour",

    // Paragraphs
    "Paragraph Format": "Paragraph Format",
    "Normal": "Normal",
    "Code": "Code",
    "Heading 1": "Heading 1",
    "Heading 2": "Heading 2",
    "Heading 3": "Heading 3",
    "Heading 4": "Heading 4",

    // Style
    "Paragraph Style": "Paragraph Style",
    "Inline Style": "Inline Style",

    // Alignment
    "Align": "Align",
    "Align Left": "Align Left",
    "Align Center": "Align Centre",
    "Align Right": "Align Right",
    "Align Justify": "Align Justify",
    "None": "None",

    // Lists
    "Ordered List": "Ordered List",
    "Default": "",
    "Lower Alpha": "Lower Alpha",
    "Lower Greek": "Lower Greek",
    "Lower Roman": "Lower Roman",
    "Upper Alpha": "Upper Alpha",
    "Upper Roman": "Upper Roman",

    "Unordered List": "Unordered List",
    "Circle": "Circle",
    "Disc": "Disc",
    "Square": "Square",

    // Line height
    "Line Height": "Line Height",
    "Single": "Single",
    "Double": "Double",

    // Indent
    "Decrease Indent": "Decrease Indent",
    "Increase Indent": "Increase Indent",

    // Links
    "Insert Link": "Insert Link",
    "Open in new tab": "Open in new tab",
    "Open Link": "Open Link",
    "Edit Link": "Edit Link",
    "Unlink": "Unlink",
    "Choose Link": "Choose Link",

    // Images
    "Insert Image": "Insert Image",
    "Upload Image": "Upload Image",
    "By URL": "By URL",
    "Browse": "Browse",
    "Drop image": "Drop image",
    "or click": "or click",
    "Manage Images": "Manage Images",
    "Loading": "Loading",
    "Deleting": "Deleting",
    "Tags": "Tags",
    "Are you sure? Image will be deleted.": "Are you sure? Image will be deleted.",
    "Replace": "Replace",
    "Uploading": "Uploading",
    "Loading image": "Loading image",
    "Display": "Display",
    "Inline": "Inline",
    "Break Text": "Break Text",
    "Alternative Text": "Alternative Text",
    "Change Size": "Change Size",
    "Width": "Width",
    "Height": "Height",
    "Something went wrong. Please try again.": "Something went wrong. Please try again.",
    "Image Caption": "Image Caption",
    "Advanced Edit": "Advanced Edit",

    // Video
    "Insert Video": "Insert Video",
    "Embedded Code": "Embedded Code",
    "Paste in a video URL": "Paste in a video URL",
    "Drop video": "Drop video",
    "Your browser does not support HTML5 video.": "Your browser does not support HTML5 video.",
    "Upload Video": "Upload Video",

    // Tables
    "Insert Table": "Insert Table",
    "Table Header": "Table Header",
    "Remove Table": "Remove Table",
    "Table Style": "Table Style",
    "Horizontal Align": "Horizontal Align",
    "Row": "Row",
    "Insert row above": "Insert row above",
    "Insert row below": "Insert row below",
    "Delete row": "Delete row",
    "Column": "Column",
    "Insert column before": "Insert column before",
    "Insert column after": "Insert column after",
    "Delete column": "Delete column",
    "Cell": "Cell",
    "Merge cells": "Merge cells",
    "Horizontal split": "Horizontal split",
    "Vertical split": "Vertical split",
    "Cell Background": "Cell Background",
    "Vertical Align": "Vertical Align",
    "Top": "Top",
    "Middle": "Middle",
    "Bottom": "Bottom",
    "Align Top": "Align Top",
    "Align Middle": "Align Middle",
    "Align Bottom": "Align Bottom",
    "Cell Style": "Cell Style",

    // Files
    "Upload File": "Upload File",
    "Drop file": "Drop file",

    // Emoticons
    "Emoticons": "Emoticons",

    // Line breaker
    "Break": "Break",

    // Math
    "Subscript": "Subscript",
    "Superscript": "Superscript",

    // Full screen
    "Fullscreen": "Fullscreen",

    // Horizontal line
    "Insert Horizontal Line": "Insert Horizontal Line",

    // Clear formatting
    "Clear Formatting": "Clear Formatting",

    // Save
    "Save": "Save",

    // Undo, redo
    "Undo": "Undo",
    "Redo": "Redo",

    // Select all
    "Select All": "Select All",

    // Code view
    "Code View": "Code View",

    // Quote
    "Quote": "Quote",
    "Increase": "Increase",
    "Decrease": "Decrease",

    // Quick Insert
    "Quick Insert": "Quick Insert",

    // Spcial Characters
    "Special Characters": "Special Characters",
    "Latin": "Latin",
    "Greek": "Greek",
    "Cyrillic": "Cyrillic",
    "Punctuation": "Punctuation",
    "Currency": "Currency",
    "Arrows": "Arrows",
    "Math": "Math",
    "Misc": "Misc",

    // Print.
    "Print": "Print",

    // Spell Checker.
    "Spell Checker": "Spell Checker",

    // Help
    "Help": "Help",
    "Shortcuts": "Shortcuts",
    "Inline Editor": "Inline Editor",
    "Show the editor": "Show the editor",
    "Common actions": "Common actions",
    "Copy": "Copy",
    "Cut": "Cut",
    "Paste": "Paste",
    "Basic Formatting": "Basic Formatting",
    "Increase quote level": "Increase quote level",
    "Decrease quote level": "Decrease quote level",
    "Image / Video": "Image / Video",
    "Resize larger": "Resize larger",
    "Resize smaller": "Resize smaller",
    "Table": "Table",
    "Select table cell": "Select table cell",
    "Extend selection one cell": "Extend selection one cell",
    "Extend selection one row": "Extend selection one row",
    "Navigation": "Navigation",
    "Focus popup / toolbar": "Focus popup / toolbar",
    "Return focus to previous position": "Return focus to previous position",

    // Embed.ly
    "Embed URL": "Embed URL",
    "Paste in a URL to embed": "Paste in a URL to embed",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?",
    "Keep": "Keep",
    "Clean": "Clean",
    "Word Paste Detected": "Word Paste Detected"
  },
  direction: "ltr"
};

}));

