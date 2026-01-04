/*
 * This file has been compiled from: /modules/system/lang/zh-cn/client.php
 */
if (!window.oc) {
    window.oc = {};
}

if (!window.oc.langMessages) {
    window.oc.langMessages = {};
}

window.oc.langMessages['zh-cn'] = $.extend(
    window.oc.langMessages['zh-cn'] || {},
    {
    "markdowneditor": {
        "formatting": "\u683c\u5f0f\u5316",
        "quote": "\u5f15\u7528",
        "code": "\u4ee3\u7801",
        "header1": "\u6807\u9898 1",
        "header2": "\u6807\u9898 2",
        "header3": "\u6807\u9898 3",
        "header4": "\u6807\u9898 4",
        "header5": "\u6807\u9898 5",
        "header6": "\u6807\u9898 6",
        "bold": "\u7c97\u4f53",
        "italic": "\u659c\u4f53",
        "unorderedlist": "\u65e0\u5e8f\u5217\u8868",
        "orderedlist": "\u6709\u5e8f\u5217\u8868",
        "snippet": "Snippet",
        "video": "\u89c6\u9891",
        "image": "\u56fe\u7247",
        "link": "\u94fe\u63a5",
        "horizontalrule": "\u63d2\u5165\u5206\u5272\u7ebf",
        "fullscreen": "\u5168\u5c4f",
        "preview": "\u9884\u89c8",
        "strikethrough": "Strikethrough",
        "cleanblock": "Clean Block",
        "table": "Table",
        "sidebyside": "Side by Side"
    },
    "mediamanager": {
        "insert_link": "\u63d2\u5165\u94fe\u63a5",
        "insert_image": "\u63d2\u5165\u56fe\u7247",
        "insert_video": "\u63d2\u5165\u89c6\u9891",
        "insert_audio": "\u63d2\u5165\u97f3\u9891",
        "invalid_file_empty_insert": "\u8bf7\u9009\u62e9\u8981\u63d2\u5165\u7684\u6587\u4ef6\u3002",
        "invalid_file_single_insert": "\u8bf7\u9009\u62e9\u8981\u63d2\u5165\u7684\u6587\u4ef6\u3002",
        "invalid_image_empty_insert": "\u8bf7\u9009\u62e9\u8981\u63d2\u5165\u7684\u56fe\u7247\u6587\u4ef6\u3002",
        "invalid_video_empty_insert": "\u8bf7\u9009\u62e9\u8981\u63d2\u5165\u7684\u89c6\u9891\u6587\u4ef6\u3002",
        "invalid_audio_empty_insert": "\u8bf7\u9009\u62e9\u8981\u63d2\u5165\u7684\u97f3\u9891\u6587\u4ef6\u3002"
    },
    "alert": {
        "error": "\u9519\u8bef",
        "confirm": "\u786e\u8ba4",
        "dismiss": "\u53d6\u6d88",
        "confirm_button_text": "\u786e\u5b9a",
        "cancel_button_text": "\u53d6\u6d88",
        "widget_remove_confirm": "\u5220\u9664\u8fd9\u4e2a\u5c0f\u90e8\u4ef6?"
    },
    "datepicker": {
        "previousMonth": "\u4e0a\u4e00\u4e2a\u6708",
        "nextMonth": "\u4e0b\u4e00\u4e2a\u6708",
        "months": [
            "\u4e00\u6708",
            "\u4e8c\u6708",
            "\u4e09\u6708",
            "\u56db\u6708",
            "\u4e94\u6708",
            "\u516d\u6708",
            "\u4e03\u6708",
            "\u516b\u6708",
            "\u4e5d\u6708",
            "\u5341\u6708",
            "\u5341\u4e00\u6708",
            "\u5341\u4e8c\u6708"
        ],
        "weekdays": [
            "\u5468\u65e5",
            "\u5468\u4e00",
            "\u5468\u4e8c",
            "\u5468\u4e09",
            "\u5468\u56db",
            "\u5468\u4e94",
            "\u5468\u516d"
        ],
        "weekdaysShort": [
            "\u65e5",
            "\u4e00",
            "\u4e8c",
            "\u4e09",
            "\u56db",
            "\u4e94",
            "\u516d"
        ]
    },
    "colorpicker": {
        "choose": "\u597d"
    },
    "filter": {
        "group": {
            "all": "\u5168\u90e8"
        },
        "scopes": {
            "apply_button_text": "\u5e94\u7528",
            "clear_button_text": "\u6e05\u9664"
        },
        "dates": {
            "all": "\u5168\u90e8",
            "filter_button_text": "\u7b5b\u9009",
            "reset_button_text": "\u91cd\u7f6e",
            "date_placeholder": "\u65e5\u671f",
            "after_placeholder": "\u4e4b\u540e",
            "before_placeholder": "\u4e4b\u524d"
        },
        "numbers": {
            "all": "\u5168\u90e8",
            "filter_button_text": "\u8fc7\u6ee4\u5668",
            "reset_button_text": "\u91cd\u7f6e",
            "min_placeholder": "\u6700\u5c0f",
            "max_placeholder": "\u6700\u5927",
            "number_placeholder": "N\u00famero"
        }
    },
    "eventlog": {
        "show_stacktrace": "\u663e\u793a\u5806\u6808",
        "hide_stacktrace": "\u9690\u85cf\u5806\u6808",
        "tabs": {
            "formatted": "\u683c\u5f0f\u5316",
            "raw": "\u539f\u59cb"
        },
        "editor": {
            "title": "\u6e90\u4ee3\u7801\u7f16\u8f91\u5668",
            "description": "\u60a8\u7684\u7cfb\u7edf\u5e94\u914d\u7f6e\u4e00\u4e2a\u4fa6\u542c\u8fd9\u4e9b URL \u7684\u65b9\u6848",
            "openWith": "\u6253\u5f00\u65b9\u5f0f",
            "remember_choice": "\u8bb0\u4f4f\u672c\u6b21\u4f1a\u8bdd\u9009\u62e9\u7684\u9009\u9879",
            "open": "\u6253\u5f00",
            "cancel": "\u53d6\u6d88",
            "rememberChoice": "Recuerde la opci\u00f3n seleccionada para esta sesi\u00f3n del navegador"
        }
    },
    "upload": {
        "max_files": "\u60a8\u4e0d\u80fd\u4e0a\u4f20\u4efb\u4f55\u6587\u4ef6",
        "invalid_file_type": "\u60a8\u4e0d\u80fd\u4e0a\u4f20\u8fd9\u79cd\u7c7b\u578b\u7684\u6587\u4ef6",
        "file_too_big": "\u6587\u4ef6\u592a\u5927 ({{filesize}}MB)\u3002 \u6700\u5927\u6587\u4ef6\u5927\u5c0f\uff1a{{maxFilesize}}MB",
        "response_error": "\u670d\u52a1\u5668\u54cd\u5e94 {{statusCode}} \u4ee3\u7801",
        "remove_file": "\u5220\u9664\u6587\u4ef6"
    },
    "inspector": {
        "add": "\u65b0\u589e",
        "remove": "\u79fb\u9664",
        "key": "\u952e",
        "value": "\u503c",
        "ok": "\u786e\u5b9a",
        "cancel": "\u53d6\u6d88",
        "items": "\u9879\u76ee"
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


    var zhCn = moment.defineLocale('zh-cn', {
        months : '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
        monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
        weekdays : '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
        weekdaysShort : '周日_周一_周二_周三_周四_周五_周六'.split('_'),
        weekdaysMin : '日_一_二_三_四_五_六'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'YYYY/MM/DD',
            LL : 'YYYY年M月D日',
            LLL : 'YYYY年M月D日Ah点mm分',
            LLLL : 'YYYY年M月D日ddddAh点mm分',
            l : 'YYYY/M/D',
            ll : 'YYYY年M月D日',
            lll : 'YYYY年M月D日 HH:mm',
            llll : 'YYYY年M月D日dddd HH:mm'
        },
        meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
        meridiemHour: function (hour, meridiem) {
            if (hour === 12) {
                hour = 0;
            }
            if (meridiem === '凌晨' || meridiem === '早上' ||
                    meridiem === '上午') {
                return hour;
            } else if (meridiem === '下午' || meridiem === '晚上') {
                return hour + 12;
            } else {
                // '中午'
                return hour >= 11 ? hour : hour + 12;
            }
        },
        meridiem : function (hour, minute, isLower) {
            var hm = hour * 100 + minute;
            if (hm < 600) {
                return '凌晨';
            } else if (hm < 900) {
                return '早上';
            } else if (hm < 1130) {
                return '上午';
            } else if (hm < 1230) {
                return '中午';
            } else if (hm < 1800) {
                return '下午';
            } else {
                return '晚上';
            }
        },
        calendar : {
            sameDay : '[今天]LT',
            nextDay : '[明天]LT',
            nextWeek : '[下]ddddLT',
            lastDay : '[昨天]LT',
            lastWeek : '[上]ddddLT',
            sameElse : 'L'
        },
        dayOfMonthOrdinalParse: /\d{1,2}(日|月|周)/,
        ordinal : function (number, period) {
            switch (period) {
                case 'd':
                case 'D':
                case 'DDD':
                    return number + '日';
                case 'M':
                    return number + '月';
                case 'w':
                case 'W':
                    return number + '周';
                default:
                    return number;
            }
        },
        relativeTime : {
            future : '%s内',
            past : '%s前',
            s : '几秒',
            ss : '%d 秒',
            m : '1 分钟',
            mm : '%d 分钟',
            h : '1 小时',
            hh : '%d 小时',
            d : '1 天',
            dd : '%d 天',
            M : '1 个月',
            MM : '%d 个月',
            y : '1 年',
            yy : '%d 年'
        },
        week : {
            // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return zhCn;

})));


/*! Select2 4.1.0-rc.0 | https://github.com/select2/select2/blob/master/LICENSE.md */

!function(){if(jQuery&&jQuery.fn&&jQuery.fn.select2&&jQuery.fn.select2.amd)var n=jQuery.fn.select2.amd;n.define("select2/i18n/zh-cn",[],function(){return{errorLoading:function(){return"无法载入结果。"},inputTooLong:function(n){return"请删除"+(n.input.length-n.maximum)+"个字符"},inputTooShort:function(n){return"请再输入至少"+(n.minimum-n.input.length)+"个字符"},loadingMore:function(){return"载入更多结果…"},maximumSelected:function(n){return"最多只能选择"+n.maximum+"个项目"},noResults:function(){return"未找到结果"},searching:function(){return"搜索中…"},removeAllItems:function(){return"删除所有项目"}}}),n.define,n.require}();

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
* Simplified Chinese spoken in China.
*/

if (!$.FE_LANGUAGE) {
    $.FE_LANGUAGE = {};
}

$.FE_LANGUAGE['zh_cn'] = {
  translation: {
    // Place holder
    "Type something": "输入内容",

    // Basic formatting
    "Bold": "粗体",
    "Italic": "斜体",
    "Underline": "下划线",
    "Strikethrough": "删除线",

    // Main buttons
    "Insert": "插入",
    "Delete": "删除",
    "Cancel": "取消",
    "OK": "确定",
    "Back": "后退",
    "Remove": "删除",
    "More": "更多",
    "Update": "更新",
    "Style": "样式",

    // Font
    "Font Family": "字体",
    "Font Size": "字号",

    // Colors
    "Colors": "颜色",
    "Background": "背景",
    "Text": "字体",
    "HEX Color": "十六进制颜色",

    // Paragraphs
    "Paragraph Format": "段落格式",
    "Normal": "正文",
    "Code": "代码",
    "Heading 1": "标题1",
    "Heading 2": "标题2",
    "Heading 3": "标题3",
    "Heading 4": "标题4",

    // Style
    "Paragraph Style": "段落样式",
    "Inline Style": "内联样式",

    // Alignment
    "Align": "对齐方式",
    "Align Left": "左对齐",
    "Align Center": "居中",
    "Align Right": "右对齐",
    "Align Justify": "两端对齐",
    "None": "无",

    // Lists
    "Ordered List": "编号",
    "Default": "默认",
    "Lower Alpha": "小写英文字母",
    "Lower Greek": "小写希腊字母",
    "Lower Roman": "小写罗马数字",
    "Upper Alpha": "大写英文字母",
    "Upper Roman": "大写罗马数字",

    "Unordered List": "项目符号",
    "Circle": "空心圆",
    "Disc": "实心圆",
    "Square": "方块",

    // Line height
    "Line Height": "线高",
    "Single": "单",
    "Double": "双",

    // Indent
    "Decrease Indent": "减少缩进",
    "Increase Indent": "增加缩进",

    // Links
    "Insert Link": "插入超链接",
    "Open in new tab": "在新标签页中打开",
    "Open Link": "打开超链接",
    "Edit Link": "编辑超链接",
    "Unlink": "删除超链接",
    "Choose Link": "选择超链接",

    // Images
    "Insert Image": "插入图片",
    "Upload Image": "上传图片",
    "By URL": "通过 URL",
    "Browse": "浏览",
    "Drop image": "拖入图片",
    "or click": "或点击",
    "Manage Images": "管理图片",
    "Loading": "加载中",
    "Deleting": "删除中",
    "Tags": "标签",
    "Are you sure? Image will be deleted.": "图片将会被删除，是否确认？",
    "Replace": "替换",
    "Uploading": "上传中",
    "Loading image": "图片加载中",
    "Display": "显示",
    "Inline": "嵌入型",
    "Break Text": "上下型环绕",
    "Alternative Text": "替换文字",
    "Change Size": "改变大小",
    "Width": "宽度",
    "Height": "高度",
    "Something went wrong. Please try again.": "发生错误，请重试。",
    "Image Caption": "图片标题",
    "Advanced Edit": "高级编辑",

    // Video
    "Insert Video": "插入视频",
    "Embedded Code": "嵌入代码",
    "Paste in a video URL": "粘贴视频网址",
    "Drop video": "拖入视频",
    "Your browser does not support HTML5 video.": "您的浏览器不支持 HTML5 视频。",
    "Upload Video": "上传视频",

    // Tables
    "Insert Table": "插入表格",
    "Table Header": "表头",
    "Remove Table": "删除表格",
    "Table Style": "表格样式",
    "Horizontal Align": "水平对齐方式",
    "Row": "行",
    "Insert row above": "在上方插入",
    "Insert row below": "在下方插入",
    "Delete row": "删除行",
    "Column": "列",
    "Insert column before": "在左侧插入",
    "Insert column after": "在右侧插入",
    "Delete column": "删除列",
    "Cell": "单元格",
    "Merge cells": "合并单元格",
    "Horizontal split": "水平分割",
    "Vertical split": "垂直分割",
    "Cell Background": "单元格背景",
    "Vertical Align": "垂直对齐方式",
    "Top": "靠上",
    "Middle": "居中",
    "Bottom": "靠下",
    "Align Top": "靠上对齐",
    "Align Middle": "居中对齐",
    "Align Bottom": "靠下对齐",
    "Cell Style": "单元格样式",

    // Files
    "Upload File": "上传文件",
    "Drop file": "拖入文件",

    // Emoticons
    "Emoticons": "表情符号",
    "Grinning face": "露齿笑脸",
    "Grinning face with smiling eyes": "露齿笑到眯起眼",
    "Face with tears of joy": "笑哭",
    "Smiling face with open mouth": "张嘴微笑",
    "Smiling face with open mouth and smiling eyes": "眯眼张嘴微笑",
    "Smiling face with open mouth and cold sweat": "带冷汗的张嘴微笑",
    "Smiling face with open mouth and tightly-closed eyes": "紧闭双眼张嘴微笑",
    "Smiling face with halo": "带光环微笑",
    "Smiling face with horns": "带牛角的微笑",
    "Winking face": "眨眼",
    "Smiling face with smiling eyes": "眯眼微笑",
    "Face savoring delicious food": "馋",
    "Relieved face": "如释重负",
    "Smiling face with heart-shaped eyes": "桃心眼微笑",
    "Smiling face with sunglasses": "戴太阳镜微笑",
    "Smirking face": "得意地笑",
    "Neutral face": "中性脸",
    "Expressionless face": "面无表情",
    "Unamused face": "不高兴",
    "Face with cold sweat": "冷汗",
    "Pensive face": "沉思",
    "Confused face": "迷惑",
    "Confounded face": "困惑",
    "Kissing face": "嘴巴嘟嘟",
    "Face throwing a kiss": "飞吻",
    "Kissing face with smiling eyes": "眯眼接吻",
    "Kissing face with closed eyes": "闭眼接吻",
    "Face with stuck out tongue": "吐舌",
    "Face with stuck out tongue and winking eye": "眨眼吐舌",
    "Face with stuck out tongue and tightly-closed eyes": "眯眼吐舌",
    "Disappointed face": "失望",
    "Worried face": "担心",
    "Angry face": "生气",
    "Pouting face": "撅嘴",
    "Crying face": "大哭",
    "Persevering face": "坚强",
    "Face with look of triumph": "扬眉吐气",
    "Disappointed but relieved face": "失望",
    "Frowning face with open mouth": "皱眉",
    "Anguished face": "痛苦",
    "Fearful face": "害怕",
    "Weary face": "疲惫",
    "Sleepy face": "困了",
    "Tired face": "累了",
    "Grimacing face": "扭曲脸",
    "Loudly crying face": "大哭",
    "Face with open mouth": "张开嘴",
    "Hushed face": "安静",
    "Face with open mouth and cold sweat": "冷汗",
    "Face screaming in fear": "害怕尖叫",
    "Astonished face": "惊讶",
    "Flushed face": "脸红",
    "Sleeping face": "熟睡",
    "Dizzy face": "眩晕",
    "Face without mouth": "没有嘴的脸",
    "Face with medical mask": "口罩脸",

    // Line breaker
    "Break": "换行",

    // Math
    "Subscript": "下标",
    "Superscript": "上标",

    // Full screen
    "Fullscreen": "全屏",

    // Horizontal line
    "Insert Horizontal Line": "插入水平线",

    // Clear formatting
    "Clear Formatting": "清除格式",

    // Save
    "Save": "保存",

    // Undo, redo
    "Undo": "撤消",
    "Redo": "恢复",

    // Select all
    "Select All": "全选",

    // Code view
    "Code View": "代码视图",

    // Quote
    "Quote": "引用",
    "Increase": "增加引用级别",
    "Decrease": "减少引用级别",

    // Quick Insert
    "Quick Insert": "快速插入",

    // Spcial Characters
    "Special Characters": "特殊字符",
    "Latin": "拉丁字母",
    "Greek": "希腊字母",
    "Cyrillic": "西里尔字母",
    "Punctuation": "标点",
    "Currency": "货币",
    "Arrows": "箭头",
    "Math": "数学",
    "Misc": "杂项",

    // Print.
    "Print": "打印",

    // Spell Checker.
    "Spell Checker": "拼写检查器",

    // Help
    "Help": "帮助",
    "Shortcuts": "快捷键",
    "Inline Editor": "内联编辑器",
    "Show the editor": "显示编辑器",
    "Common actions": "常用操作",
    "Copy": "复制",
    "Cut": "剪切",
    "Paste": "粘贴",
    "Basic Formatting": "基本格式",
    "Increase quote level": "增加引用级别",
    "Decrease quote level": "减少引用级别",
    "Image / Video": "图像/视频",
    "Resize larger": "放大",
    "Resize smaller": "缩小",
    "Table": "表格",
    "Select table cell": "选择单元格",
    "Extend selection one cell": "增加选中的单元格",
    "Extend selection one row": "增加选中的行",
    "Navigation": "导航",
    "Focus popup / toolbar": "焦点弹出/工具栏",
    "Return focus to previous position": "将焦点返回到上一个位置",

    // Embed.ly
    "Embed URL": "嵌入网址",
    "Paste in a URL to embed": "粘贴要嵌入的网址",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "粘贴的内容来自微软 Word 文档。你想保留还是清除格式？",
    "Keep": "保留",
    "Clean": "清除",
    "Word Paste Detected": "检测到粘贴自 Word 的内容"
  },
  direction: "ltr"
};

}));

