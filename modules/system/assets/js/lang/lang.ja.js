/*
 * This file has been compiled from: /modules/system/lang/ja/client.php
 */
if (!window.oc) {
    window.oc = {};
}

if (!window.oc.langMessages) {
    window.oc.langMessages = {};
}

window.oc.langMessages['ja'] = Object.assign(
    window.oc.langMessages['ja'] || {},
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
        "widget_remove_confirm": "Remove this widget?",
        "reload": "Reload"
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
    "[not set]": "[\u672a\u8a2d\u5b9a]",
    "1 day (today) if not set": "\u8a2d\u5b9a\u3055\u308c\u3066\u3044\u306a\u3044\u5834\u5408\u306f1\u65e5\uff08\u4eca\u65e5\uff09",
    "Apply": "\u9069\u7528\u3059\u308b",
    "Ascending": "\u4e0a\u6607",
    "Attribute": "\u5c5e\u6027",
    "Bar": "\u30d0\u30fc",
    "Chart": "\u30c1\u30e3\u30fc\u30c8",
    "Chart type": "\u30c1\u30e3\u30fc\u30c8\u306e\u7a2e\u985e",
    "Color": "\u8272",
    "Compare Totals": "\u5408\u8a08\u3092\u6bd4\u8f03\u3059\u308b",
    "Configure": "\u8a2d\u5b9a",
    "Custom": "\u30ab\u30b9\u30bf\u30e0",
    "Dashboard interval": "\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u9593\u9694",
    "Data source": "\u30c7\u30fc\u30bf\u30bd\u30fc\u30b9",
    "Date interval": "\u65e5\u4ed8\u9593\u9694",
    "Day": "\u65e5",
    "Delete": "\u6d88\u53bb",
    "Delete Dashboard": "\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3092\u524a\u9664",
    "Delete row": "\u884c\u3092\u524a\u9664",
    "Descending": "\u964d\u9806",
    "Dimension": "\u5bf8\u6cd5",
    "Direction": "\u65b9\u5411",
    "Disabled": "\u7121\u52b9",
    "Display": "\u753b\u9762",
    "Display [not set]": "\u8868\u793a [\u672a\u8a2d\u5b9a]",
    "Display all records": "\u3059\u3079\u3066\u306e\u30ec\u30b3\u30fc\u30c9\u3092\u8868\u793a",
    "Display relative bars": "\u76f8\u5bfe\u30d0\u30fc\u3092\u8868\u793a",
    "Display totals": "\u5408\u8a08\u3092\u8868\u793a",
    "Edit Dashboard": "\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3092\u7de8\u96c6",
    "Empty values": "\u7a7a\u306e\u5024",
    "Enter a positive number": "\u6b63\u306e\u6570\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044",
    "Enter a positive number or leave empty to display all records.": "\u6b63\u306e\u6570\u3092\u5165\u529b\u3059\u308b\u304b\u3001\u7a7a\u767d\u306e\u307e\u307e\u306b\u3057\u3066\u3059\u3079\u3066\u306e\u30ec\u30b3\u30fc\u30c9\u3092\u8868\u793a\u3057\u307e\u3059\u3002",
    "Equal to": "\u7b49\u3057\u3044",
    "Export Dashboard": "\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306e\u30a8\u30af\u30b9\u30dd\u30fc\u30c8",
    "Extra table fields": "\u8ffd\u52a0\u306e\u30c6\u30fc\u30d6\u30eb\u30d5\u30a3\u30fc\u30eb\u30c9",
    "Filters": "\u30d5\u30a3\u30eb\u30bf\u30fc",
    "General": "\u4e00\u822c\u7684\u306a",
    "Greater or equal to": "\u3088\u308a\u5927\u304d\u3044\u304b\u7b49\u3057\u3044",
    "Greater than": "\u3088\u308a\u5927\u304d\u3044",
    "Hide": "\u96a0\u308c\u308b",
    "Horizontal": "\u6c34\u5e73",
    "Icon": "\u30a2\u30a4\u30b3\u30f3",
    "Icon Status": "\u30a2\u30a4\u30b3\u30f3\u306e\u30b9\u30c6\u30fc\u30bf\u30b9",
    "Important": "\u91cd\u8981",
    "Includes": "\u542b\u307e\u308c\u308b\u3082\u306e",
    "Indicator": "\u30a4\u30f3\u30b8\u30b1\u30fc\u30bf",
    "Information": "\u60c5\u5831",
    "Last 30 days": "\u904e\u53bb30\u65e5\u9593",
    "Last 7 days": "\u904e\u53bb7\u65e5\u9593",
    "Last month": "\u5148\u6708",
    "Leave empty to disable pagination": "\u30da\u30fc\u30b8\u533a\u5207\u308a\u3092\u7121\u52b9\u306b\u3059\u308b\u306b\u306f\u7a7a\u767d\u306e\u307e\u307e\u306b\u3057\u3066\u304f\u3060\u3055\u3044",
    "Leave empty to hide the title": "\u30bf\u30a4\u30c8\u30eb\u3092\u975e\u8868\u793a\u306b\u3059\u308b\u306b\u306f\u7a7a\u767d\u306e\u307e\u307e\u306b\u3057\u3066\u304f\u3060\u3055\u3044",
    "Less or equal to": "\u4ee5\u4e0b",
    "Less than": "\u672a\u6e80",
    "Limit": "\u5236\u9650",
    "Line": "\u30e9\u30a4\u30f3",
    "Link Text": "\u30ea\u30f3\u30af\u30c6\u30ad\u30b9\u30c8",
    "Link URL": "\u30ea\u30f3\u30afURL",
    "Make Default": "\u30c7\u30d5\u30a9\u30eb\u30c8\u306b\u3059\u308b",
    "Manage Dashboards": "\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306e\u7ba1\u7406",
    "Metric": "\u30e1\u30c8\u30ea\u30c3\u30af",
    "Metrics": "\u30e1\u30c8\u30ea\u30af\u30b9",
    "Month": "\u6708",
    "My Custom Widget": "\u30ab\u30b9\u30bf\u30e0\u30a6\u30a3\u30b8\u30a7\u30c3\u30c8",
    "No Value": "\u4fa1\u5024\u306a\u3057",
    "Notice text": "\u901a\u77e5\u30c6\u30ad\u30b9\u30c8",
    "Number of days": "\u65e5\u6570",
    "One of": "1\u3064",
    "One value per line": "1\u884c\u306b1\u3064\u306e\u5024",
    "Operation": "\u624b\u8853",
    "Order": "\u6ce8\u6587",
    "Past hour": "\u904e\u53bb1\u6642\u9593",
    "Past X days": "\u904e\u53bbX\u65e5\u9593",
    "Please provide the widget title": "\u30a6\u30a3\u30b8\u30a7\u30c3\u30c8\u306e\u30bf\u30a4\u30c8\u30eb\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044",
    "Please select a data source": "\u30c7\u30fc\u30bf\u30bd\u30fc\u30b9\u3092\u9078\u629e\u3057\u3066\u304f\u3060\u3055\u3044",
    "Please select a dimension": "\u5bf8\u6cd5\u3092\u9078\u629e\u3057\u3066\u304f\u3060\u3055\u3044",
    "Please select an icon": "\u30a2\u30a4\u30b3\u30f3\u3092\u9078\u629e\u3057\u3066\u304f\u3060\u3055\u3044",
    "Please select metric(s).": "\u30e1\u30c8\u30ea\u30c3\u30af\u3092\u9078\u629e\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
    "Prev period": "\u524d\u671f",
    "Quarter": "\u56db\u534a\u671f",
    "Records per page": "\u30da\u30fc\u30b8\u3042\u305f\u308a\u306e\u30ec\u30b3\u30fc\u30c9\u6570",
    "Refresh every minute": "1\u5206\u3054\u3068\u306b\u66f4\u65b0",
    "Rename Dashboard": "\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306e\u540d\u524d\u3092\u5909\u66f4\u3059\u308b",
    "Reset Layout": "\u30ec\u30a4\u30a2\u30a6\u30c8\u3092\u30ea\u30bb\u30c3\u30c8",
    "Reset layout back to default?": "\u30ec\u30a4\u30a2\u30a6\u30c8\u3092\u30c7\u30d5\u30a9\u30eb\u30c8\u306b\u623b\u3057\u307e\u3059\u304b?",
    "Same period last year": "\u524d\u5e74\u540c\u671f",
    "Section": "\u30bb\u30af\u30b7\u30e7\u30f3",
    "Section Title": "\u30bb\u30af\u30b7\u30e7\u30f3\u30bf\u30a4\u30c8\u30eb",
    "Select a dimension and metrics": "\u30c7\u30a3\u30e1\u30f3\u30b7\u30e7\u30f3\u3068\u6307\u6a19\u3092\u9078\u629e\u3059\u308b",
    "Select an attribute": "\u5c5e\u6027\u3092\u9078\u629e",
    "Select an operation": "\u64cd\u4f5c\u3092\u9078\u629e",
    "Select sorting metric or dimension": "\u4e26\u3079\u66ff\u3048\u306e\u6307\u6a19\u307e\u305f\u306f\u30c7\u30a3\u30e1\u30f3\u30b7\u30e7\u30f3\u3092\u9078\u629e",
    "Select the metric color": "\u30e1\u30c8\u30ea\u30c3\u30af\u306e\u8272\u3092\u9078\u629e",
    "Set the current layout as the default?": "\u73fe\u5728\u306e\u30ec\u30a4\u30a2\u30a6\u30c8\u3092\u30c7\u30d5\u30a9\u30eb\u30c8\u3068\u3057\u3066\u8a2d\u5b9a\u3057\u307e\u3059\u304b?",
    "Show Date Interval": "\u65e5\u4ed8\u9593\u9694\u3092\u8868\u793a",
    "Sort by": "\u4e26\u3079\u66ff\u3048",
    "Sorting": "\u30bd\u30fc\u30c8",
    "Sorting & Filtering": "\u4e26\u3079\u66ff\u3048\u3068\u30d5\u30a3\u30eb\u30bf\u30ea\u30f3\u30b0",
    "Stacked Bar": "\u7a4d\u307f\u4e0a\u3052\u68d2\u30b0\u30e9\u30d5",
    "Starts with": "\u59cb\u307e\u308a\u306f",
    "Success": "\u6210\u529f",
    "Table": "\u30c6\u30fc\u30d6\u30eb",
    "Text Notice": "\u30c6\u30ad\u30b9\u30c8\u901a\u77e5",
    "The dashboard layout has been reset to default.": "\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306e\u30ec\u30a4\u30a2\u30a6\u30c8\u304c\u30c7\u30d5\u30a9\u30eb\u30c8\u306b\u30ea\u30bb\u30c3\u30c8\u3055\u308c\u307e\u3057\u305f\u3002",
    "The dashboard was successfully updated.": "\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306f\u6b63\u5e38\u306b\u66f4\u65b0\u3055\u308c\u307e\u3057\u305f\u3002",
    "The limit value must be at least 1": "\u5236\u9650\u5024\u306f\u5c11\u306a\u304f\u3068\u30821\u3067\u3042\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059",
    "This dashboard is now the default layout.": "\u3053\u306e\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u304c\u30c7\u30d5\u30a9\u30eb\u30c8\u306e\u30ec\u30a4\u30a2\u30a6\u30c8\u306b\u306a\u308a\u307e\u3057\u305f\u3002",
    "This is a text notice widget.": "\u30c6\u30ad\u30b9\u30c8\u901a\u77e5\u30a6\u30a3\u30b8\u30a7\u30c3\u30c8\u3067\u3059\u3002",
    "This month": "\u4eca\u6708",
    "This quarter": "\u4eca\u56db\u534a\u671f",
    "This week": "\u4eca\u9031",
    "This year": "\u4eca\u5e74",
    "Title": "\u30bf\u30a4\u30c8\u30eb",
    "Today": "\u4eca\u65e5",
    "Value": "\u4fa1\u5024",
    "Values": "\u4fa1\u5024\u89b3",
    "Vertical": "\u5782\u76f4",
    "Warning": "\u8b66\u544a",
    "Week": "\u9031",
    "Year": "\u5e74",
    "Yesterday": "\u6628\u65e5"
}
);


//! moment.js locale configuration
//! locale : Japanese [ja]
//! author : LI Long : https://github.com/baryon

;(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined'
       && typeof require === 'function' ? factory(require('../moment')) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';

    //! moment.js locale configuration

    var ja = moment.defineLocale('ja', {
        eras: [
            {
                since: '2019-05-01',
                offset: 1,
                name: '令和',
                narrow: '㋿',
                abbr: 'R',
            },
            {
                since: '1989-01-08',
                until: '2019-04-30',
                offset: 1,
                name: '平成',
                narrow: '㍻',
                abbr: 'H',
            },
            {
                since: '1926-12-25',
                until: '1989-01-07',
                offset: 1,
                name: '昭和',
                narrow: '㍼',
                abbr: 'S',
            },
            {
                since: '1912-07-30',
                until: '1926-12-24',
                offset: 1,
                name: '大正',
                narrow: '㍽',
                abbr: 'T',
            },
            {
                since: '1873-01-01',
                until: '1912-07-29',
                offset: 6,
                name: '明治',
                narrow: '㍾',
                abbr: 'M',
            },
            {
                since: '0001-01-01',
                until: '1873-12-31',
                offset: 1,
                name: '西暦',
                narrow: 'AD',
                abbr: 'AD',
            },
            {
                since: '0000-12-31',
                until: -Infinity,
                offset: 1,
                name: '紀元前',
                narrow: 'BC',
                abbr: 'BC',
            },
        ],
        eraYearOrdinalRegex: /(元|\d+)年/,
        eraYearOrdinalParse: function (input, match) {
            return match[1] === '元' ? 1 : parseInt(match[1] || input, 10);
        },
        months: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
        monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split(
            '_'
        ),
        weekdays: '日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日'.split('_'),
        weekdaysShort: '日_月_火_水_木_金_土'.split('_'),
        weekdaysMin: '日_月_火_水_木_金_土'.split('_'),
        longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'YYYY/MM/DD',
            LL: 'YYYY年M月D日',
            LLL: 'YYYY年M月D日 HH:mm',
            LLLL: 'YYYY年M月D日 dddd HH:mm',
            l: 'YYYY/MM/DD',
            ll: 'YYYY年M月D日',
            lll: 'YYYY年M月D日 HH:mm',
            llll: 'YYYY年M月D日(ddd) HH:mm',
        },
        meridiemParse: /午前|午後/i,
        isPM: function (input) {
            return input === '午後';
        },
        meridiem: function (hour, minute, isLower) {
            if (hour < 12) {
                return '午前';
            } else {
                return '午後';
            }
        },
        calendar: {
            sameDay: '[今日] LT',
            nextDay: '[明日] LT',
            nextWeek: function (now) {
                if (now.week() !== this.week()) {
                    return '[来週]dddd LT';
                } else {
                    return 'dddd LT';
                }
            },
            lastDay: '[昨日] LT',
            lastWeek: function (now) {
                if (this.week() !== now.week()) {
                    return '[先週]dddd LT';
                } else {
                    return 'dddd LT';
                }
            },
            sameElse: 'L',
        },
        dayOfMonthOrdinalParse: /\d{1,2}日/,
        ordinal: function (number, period) {
            switch (period) {
                case 'y':
                    return number === 1 ? '元年' : number + '年';
                case 'd':
                case 'D':
                case 'DDD':
                    return number + '日';
                default:
                    return number;
            }
        },
        relativeTime: {
            future: '%s後',
            past: '%s前',
            s: '数秒',
            ss: '%d秒',
            m: '1分',
            mm: '%d分',
            h: '1時間',
            hh: '%d時間',
            d: '1日',
            dd: '%d日',
            M: '1ヶ月',
            MM: '%dヶ月',
            y: '1年',
            yy: '%d年',
        },
    });

    return ja;

})));


/*! Select2 4.1.0-rc.0 | https://github.com/select2/select2/blob/master/LICENSE.md */

!function(){if(jQuery&&jQuery.fn&&jQuery.fn.select2&&jQuery.fn.select2.amd)var n=jQuery.fn.select2.amd;n.define("select2/i18n/ja",[],function(){return{errorLoading:function(){return"結果が読み込まれませんでした"},inputTooLong:function(n){return n.input.length-n.maximum+" 文字を削除してください"},inputTooShort:function(n){return"少なくとも "+(n.minimum-n.input.length)+" 文字を入力してください"},loadingMore:function(){return"読み込み中…"},maximumSelected:function(n){return n.maximum+" 件しか選択できません"},noResults:function(){return"対象が見つかりません"},searching:function(){return"検索しています…"},removeAllItems:function(){return"すべてのアイテムを削除"}}}),n.define,n.require}();

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
 * Japanese
 */

if (!$.FE_LANGUAGE) {
    $.FE_LANGUAGE = {};
}

$.FE_LANGUAGE['ja'] = {
  translation: {
    // Place holder
    "Type something": "\u3053\u3053\u306b\u5165\u529b\u3057\u307e\u3059",

    // Basic formatting
    "Bold": "\u592a\u5b57",
    "Italic": "\u659c\u4f53",
    "Underline": "\u4e0b\u7dda",
    "Strikethrough": "\u53d6\u308a\u6d88\u3057\u7dda",

    // Main buttons
    "Insert": "\u633f\u5165",
    "Delete": "\u524a\u9664",
    "Cancel": "\u30ad\u30e3\u30f3\u30bb\u30eb",
    "OK": "OK",
    "Back": "\u623b\u308b",
    "Remove": "\u524a\u9664",
    "More": "\u3082\u3063\u3068",
    "Update": "\u66f4\u65b0",
    "Style": "\u30b9\u30bf\u30a4\u30eb",

    // Font
    "Font Family": "\u30d5\u30a9\u30f3\u30c8",
    "Font Size": "\u30d5\u30a9\u30f3\u30c8\u30b5\u30a4\u30ba",

    // Colors
    "Colors": "\u8272",
    "Background": "\u80cc\u666f",
    "Text": "\u30c6\u30ad\u30b9\u30c8",
    "HEX Color": "\u30d8\u30ad\u30b5\u306e\u8272",

    // Paragraphs
    "Paragraph Format": "\u6bb5\u843d\u306e\u66f8\u5f0f",
    "Normal": "\u6a19\u6e96",
    "Code": "\u30b3\u30fc\u30c9",
    "Heading 1": "\u30d8\u30c3\u30c0\u30fc 1",
    "Heading 2": "\u30d8\u30c3\u30c0\u30fc 2",
    "Heading 3": "\u30d8\u30c3\u30c0\u30fc 3",
    "Heading 4": "\u30d8\u30c3\u30c0\u30fc 4",

    // Style
    "Paragraph Style": "\u6bb5\u843d\u30b9\u30bf\u30a4\u30eb",
    "Inline Style": "\u30a4\u30f3\u30e9\u30a4\u30f3\u30b9\u30bf\u30a4\u30eb",

    // Alignment
    "Align": "\u914d\u7f6e",
    "Align Left": "\u5de6\u63c3\u3048",
    "Align Center": "\u4e2d\u592e\u63c3\u3048",
    "Align Right": "\u53f3\u63c3\u3048",
    "Align Justify": "\u4e21\u7aef\u63c3\u3048",
    "None": "\u306a\u3057",

    // Lists
    "Ordered List": "\u6bb5\u843d\u756a\u53f7",
    "Default": "デフォルト",
    "Lower Alpha": "下アルファ",
    "Lower Greek": "下ギリシャ",
    "Lower Roman": "下ローマ",
    "Upper Alpha": "アッパーアルファ",
    "Upper Roman": "アッパーローマン",

    "Unordered List": "\u7b87\u6761\u66f8\u304d",
    "Circle": "サークル",
    "Disc": "ディスク",
    "Square": "平方",

    // Line height
    "Line Height": "行の高さ",
    "Single": "シングル",
    "Double": "ダブル",

    // Indent
    "Decrease Indent": "\u30a4\u30f3\u30c7\u30f3\u30c8\u3092\u6e1b\u3089\u3059",
    "Increase Indent": "\u30a4\u30f3\u30c7\u30f3\u30c8\u3092\u5897\u3084\u3059",

    // Links
    "Insert Link": "\u30ea\u30f3\u30af\u306e\u633f\u5165",
    "Open in new tab": "\u65b0\u3057\u3044\u30bf\u30d6\u3067\u958b\u304f",
    "Open Link": "\u30ea\u30f3\u30af\u3092\u958b\u304f",
    "Edit Link": "\u30ea\u30f3\u30af\u306e\u7de8\u96c6",
    "Unlink": "\u30ea\u30f3\u30af\u306e\u524a\u9664",
    "Choose Link": "\u30ea\u30f3\u30af\u3092\u9078\u629e",

    // Images
    "Insert Image": "\u753b\u50cf\u306e\u633f\u5165",
    "Upload Image": "\u753b\u50cf\u3092\u30a2\u30c3\u30d7\u30ed\u30fc\u30c9",
    "By URL": "\u753b\u50cf\u306eURL\u3092\u5165\u529b",
    "Browse": "\u53c2\u7167",
    "Drop image": "\u753b\u50cf\u3092\u30c9\u30e9\u30c3\u30b0&\u30c9\u30ed\u30c3\u30d7",
    "or click": "\u307e\u305f\u306f\u30af\u30ea\u30c3\u30af",
    "Manage Images": "\u753b\u50cf\u306e\u7ba1\u7406",
    "Loading": "\u8aad\u307f\u8fbc\u307f\u4e2d",
    "Deleting": "\u524a\u9664",
    "Tags": "\u30bf\u30b0",
    "Are you sure? Image will be deleted.": "\u672c\u5f53\u306b\u524a\u9664\u3057\u307e\u3059\u304b\uff1f",
    "Replace": "\u7f6e\u63db",
    "Uploading": "\u30a2\u30c3\u30d7\u30ed\u30fc\u30c9\u4e2d",
    "Loading image": "\u753b\u50cf\u8aad\u307f\u8fbc\u307f\u4e2d",
    "Display": "\u8868\u793a",
    "Inline": "\u30a4\u30f3\u30e9\u30a4\u30f3",
    "Break Text": "\u30c6\u30ad\u30b9\u30c8\u306e\u6539\u884c",
    "Alternative Text": "\u4ee3\u66ff\u30c6\u30ad\u30b9\u30c8",
    "Change Size": "\u30b5\u30a4\u30ba\u5909\u66f4",
    "Width": "\u5e45",
    "Height": "\u9ad8\u3055",
    "Something went wrong. Please try again.": "\u554f\u984c\u304c\u767a\u751f\u3057\u307e\u3057\u305f\u3002\u3082\u3046\u4e00\u5ea6\u3084\u308a\u76f4\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
    "Image Caption": "\u753b\u50cf\u30ad\u30e3\u30d7\u30b7\u30e7\u30f3",
    "Advanced Edit": "\u9ad8\u5ea6\u306a\u7de8\u96c6",

    // Video
    "Insert Video": "\u52d5\u753b\u306e\u633f\u5165",
    "Embedded Code": "\u57cb\u3081\u8fbc\u307f\u30b3\u30fc\u30c9",
    "Paste in a video URL": "\u52d5\u753bURL\u306b\u8cbc\u308a\u4ed8\u3051\u308b",
    "Drop video": "\u52d5\u753b\u3092\u30c9\u30e9\u30c3\u30b0&\u30c9\u30ed\u30c3\u30d7",
    "Your browser does not support HTML5 video.": "\u3042\u306a\u305f\u306e\u30d6\u30e9\u30a6\u30b6\u306fhtml5 video\u3092\u30b5\u30dd\u30fc\u30c8\u3057\u3066\u3044\u307e\u305b\u3093\u3002",
    "Upload Video": "\u52d5\u753b\u306e\u30a2\u30c3\u30d7\u30ed\u30fc\u30c9",

    // Tables
    "Insert Table": "\u8868\u306e\u633f\u5165",
    "Table Header": "\u8868\u306e\u30d8\u30c3\u30c0\u30fc",
    "Remove Table": "\u8868\u306e\u524a\u9664",
    "Table Style": "\u8868\u306e\u30b9\u30bf\u30a4\u30eb",
    "Horizontal Align": "\u6a2a\u4f4d\u7f6e",
    "Row": "\u884c",
    "Insert row above": "\u4e0a\u306b\u884c\u3092\u633f\u5165",
    "Insert row below": "\u4e0b\u306b\u884c\u3092\u633f\u5165",
    "Delete row": "\u884c\u306e\u524a\u9664",
    "Column": "\u5217",
    "Insert column before": "\u5de6\u306b\u5217\u3092\u633f\u5165",
    "Insert column after": "\u53f3\u306b\u5217\u3092\u633f\u5165",
    "Delete column": "\u5217\u306e\u524a\u9664",
    "Cell": "\u30bb\u30eb",
    "Merge cells": "\u30bb\u30eb\u306e\u7d50\u5408",
    "Horizontal split": "\u6a2a\u5206\u5272",
    "Vertical split": "\u7e26\u5206\u5272",
    "Cell Background": "\u30bb\u30eb\u306e\u80cc\u666f",
    "Vertical Align": "\u7e26\u4f4d\u7f6e",
    "Top": "\u4e0a\u63c3\u3048",
    "Middle": "\u4e2d\u592e\u63c3\u3048",
    "Bottom": "\u4e0b\u63c3\u3048",
    "Align Top": "\u4e0a\u306b\u63c3\u3048\u307e\u3059",
    "Align Middle": "\u4e2d\u592e\u306b\u63c3\u3048\u307e\u3059",
    "Align Bottom": "\u4e0b\u306b\u63c3\u3048\u307e\u3059",
    "Cell Style": "\u30bb\u30eb\u30b9\u30bf\u30a4\u30eb",

    // Files
    "Upload File": "\u30d5\u30a1\u30a4\u30eb\u306e\u30a2\u30c3\u30d7\u30ed\u30fc\u30c9",
    "Drop file": "\u30d5\u30a1\u30a4\u30eb\u3092\u30c9\u30e9\u30c3\u30b0&\u30c9\u30ed\u30c3\u30d7",

    // Emoticons
    "Emoticons": "\u7d75\u6587\u5b57",
    "Grinning face": "\u30cb\u30f3\u30de\u30ea\u9854",
    "Grinning face with smiling eyes": "\u30cb\u30f3\u30de\u30ea\u9854(\u7b11\u3063\u3066\u3044\u308b\u76ee)",
    "Face with tears of joy": "\u5b09\u3057\u6ce3\u304d\u3059\u308b\u9854",
    "Smiling face with open mouth": "\u7b11\u9854(\u5e83\u3052\u305f\u53e3)",
    "Smiling face with open mouth and smiling eyes": "\u7b11\u9854(\u5e83\u3052\u305f\u53e3\u3001\u7b11\u3063\u3066\u3044\u308b\u76ee)",
    "Smiling face with open mouth and cold sweat": "\u7b11\u9854(\u5e83\u3052\u305f\u53e3\u3001\u51b7\u3084\u6c57)",
    "Smiling face with open mouth and tightly-closed eyes": "\u7b11\u9854(\u5e83\u3052\u305f\u53e3\u3001\u3057\u3063\u304b\u308a\u9589\u3058\u305f\u76ee)",
    "Smiling face with halo": "\u5929\u4f7f\u306e\u8f2a\u304c\u304b\u304b\u3063\u3066\u3044\u308b\u7b11\u9854",
    "Smiling face with horns": "\u89d2\u306e\u3042\u308b\u7b11\u9854",
    "Winking face": "\u30a6\u30a3\u30f3\u30af\u3057\u305f\u9854",
    "Smiling face with smiling eyes": "\u7b11\u9854(\u7b11\u3063\u3066\u3044\u308b\u76ee)",
    "Face savoring delicious food": "\u304a\u3044\u3057\u3044\u3082\u306e\u3092\u98df\u3079\u305f\u9854",
    "Relieved face": "\u5b89\u5fc3\u3057\u305f\u9854",
    "Smiling face with heart-shaped eyes": "\u76ee\u304c\u30cf\u30fc\u30c8\u306e\u7b11\u9854",
    "Smiling face with sunglasses": "\u30b5\u30f3\u30b0\u30e9\u30b9\u3092\u304b\u3051\u305f\u7b11\u9854",
    "Smirking face": "\u4f5c\u308a\u7b11\u3044",
    "Neutral face": "\u7121\u8868\u60c5\u306e\u9854",
    "Expressionless face": "\u7121\u8868\u60c5\u306a\u9854",
    "Unamused face": "\u3064\u307e\u3089\u306a\u3044\u9854",
    "Face with cold sweat": "\u51b7\u3084\u6c57\u3092\u304b\u3044\u305f\u9854",
    "Pensive face": "\u8003\u3048\u4e2d\u306e\u9854",
    "Confused face": "\u5c11\u3057\u3057\u3087\u3093\u307c\u308a\u3057\u305f\u9854",
    "Confounded face": "\u56f0\u308a\u679c\u3066\u305f\u9854",
    "Kissing face": "\u30ad\u30b9\u3059\u308b\u9854",
    "Face throwing a kiss": "\u6295\u3052\u30ad\u30c3\u30b9\u3059\u308b\u9854",
    "Kissing face with smiling eyes": "\u7b11\u3044\u306a\u304c\u3089\u30ad\u30b9\u3059\u308b\u9854",
    "Kissing face with closed eyes": "\u76ee\u3092\u9589\u3058\u3066\u30ad\u30b9\u3059\u308b\u9854",
    "Face with stuck out tongue": "\u304b\u3089\u304b\u3063\u305f\u9854(\u3042\u3063\u304b\u3093\u3079\u3048)",
    "Face with stuck out tongue and winking eye": "\u30a6\u30a3\u30f3\u30af\u3057\u3066\u820c\u3092\u51fa\u3057\u305f\u9854",
    "Face with stuck out tongue and tightly-closed eyes": "\u76ee\u3092\u9589\u3058\u3066\u820c\u3092\u51fa\u3057\u305f\u9854",
    "Disappointed face": "\u843d\u3061\u8fbc\u3093\u3060\u9854",
    "Worried face": "\u4e0d\u5b89\u306a\u9854",
    "Angry face": "\u6012\u3063\u305f\u9854",
    "Pouting face": "\u3075\u304f\u308c\u9854",
    "Crying face": "\u6ce3\u3044\u3066\u3044\u308b\u9854",
    "Persevering face": "\u5931\u6557\u9854",
    "Face with look of triumph": "\u52dd\u3061\u307b\u3053\u3063\u305f\u9854",
    "Disappointed but relieved face": "\u5b89\u5835\u3057\u305f\u9854",
    "Frowning face with open mouth": "\u3044\u3084\u306a\u9854(\u958b\u3051\u305f\u53e3)",
    "Anguished face": "\u3052\u3093\u306a\u308a\u3057\u305f\u9854",
    "Fearful face": "\u9752\u3056\u3081\u305f\u9854",
    "Weary face": "\u75b2\u308c\u305f\u9854",
    "Sleepy face": "\u7720\u3044\u9854",
    "Tired face": "\u3057\u3093\u3069\u3044\u9854",
    "Grimacing face": "\u3061\u3087\u3063\u3068\u4e0d\u5feb\u306a\u9854",
    "Loudly crying face": "\u5927\u6ce3\u304d\u3057\u3066\u3044\u308b\u9854",
    "Face with open mouth": "\u53e3\u3092\u958b\u3051\u305f\u9854",
    "Hushed face": "\u9ed9\u3063\u305f\u9854",
    "Face with open mouth and cold sweat": "\u53e3\u3092\u958b\u3051\u305f\u9854(\u51b7\u3084\u6c57)",
    "Face screaming in fear": "\u6050\u6016\u306e\u53eb\u3073\u9854",
    "Astonished face": "\u9a5a\u3044\u305f\u9854",
    "Flushed face": "\u71b1\u3063\u307d\u3044\u9854",
    "Sleeping face": "\u5bdd\u9854",
    "Dizzy face": "\u307e\u3044\u3063\u305f\u9854",
    "Face without mouth": "\u53e3\u306e\u306a\u3044\u9854",
    "Face with medical mask": "\u30de\u30b9\u30af\u3057\u305f\u9854",

    // Line breaker
    "Break": "\u6539\u884c",

    // Math
    "Subscript": "\u4e0b\u4ed8\u304d\u6587\u5b57",
    "Superscript": "\u4e0a\u4ed8\u304d\u6587\u5b57",

    // Full screen
    "Fullscreen": "\u5168\u753b\u9762\u8868\u793a",

    // Horizontal line
    "Insert Horizontal Line": "\u6c34\u5e73\u7dda\u306e\u633f\u5165",

    // Clear formatting
    "Clear Formatting": "\u66f8\u5f0f\u306e\u30af\u30ea\u30a2",

    // Save
    "Save": "\u30bb\u30fc\u30d6",

    // Undo, redo
    "Undo": "\u5143\u306b\u623b\u3059",
    "Redo": "\u3084\u308a\u76f4\u3059",

    // Select all
    "Select All": "\u5168\u3066\u3092\u9078\u629e",

    // Code view
    "Code View": "HTML\u30bf\u30b0\u8868\u793a",

    // Quote
    "Quote": "\u5f15\u7528",
    "Increase": "\u5897\u52a0",
    "Decrease": "\u6e1b\u5c11",

    // Quick Insert
    "Quick Insert": "\u30af\u30a4\u30c3\u30af\u633f\u5165",

    // Spcial Characters
    "Special Characters": "\u7279\u6b8a\u6587\u5b57",
    "Latin": "\u30e9\u30c6\u30f3\u8a9e",
    "Greek": "\u30ae\u30ea\u30b7\u30e3\u8a9e",
    "Cyrillic": "\u30ad\u30ea\u30eb\u6587\u5b57",
    "Punctuation": "\u53e5\u8aad\u70b9",
    "Currency": "\u901a\u8ca8",
    "Arrows": "\u77e2\u5370",
    "Math": "\u6570\u5b66",
    "Misc": "\u305d\u306e\u4ed6",

    // Print.
    "Print": "\u5370\u5237",

    // Spell Checker.
    "Spell Checker": "\u30b9\u30da\u30eb\u30c1\u30a7\u30c3\u30af",

    // Help
    "Help": "\u30d8\u30eb\u30d7",
    "Shortcuts": "\u30b7\u30e7\u30fc\u30c8\u30ab\u30c3\u30c8",
    "Inline Editor": "\u30a4\u30f3\u30e9\u30a4\u30f3\u30a8\u30c7\u30a3\u30bf",
    "Show the editor": "\u30a8\u30c7\u30a3\u30bf\u3092\u8868\u793a",
    "Common actions": "\u4e00\u822c\u52d5\u4f5c",
    "Copy": "\u30b3\u30d4\u30fc",
    "Cut": "\u30ab\u30c3\u30c8",
    "Paste": "\u8cbc\u308a\u4ed8\u3051",
    "Basic Formatting": "\u57fa\u672c\u66f8\u5f0f",
    "Increase quote level": "\u5f15\u7528\u3092\u5897\u3084\u3059",
    "Decrease quote level": "\u5f15\u7528\u3092\u6e1b\u3089\u3059",
    "Image / Video": "\u753b\u50cf/\u52d5\u753b",
    "Resize larger": "\u5927\u304d\u304f\u3059\u308b",
    "Resize smaller": "\u5c0f\u3055\u304f\u3059\u308b",
    "Table": "\u8868",
    "Select table cell": "\u30bb\u30eb\u3092\u9078\u629e",
    "Extend selection one cell": "\u30bb\u30eb\u306e\u9078\u629e\u7bc4\u56f2\u3092\u5e83\u3052\u308b",
    "Extend selection one row": "\u5217\u306e\u9078\u629e\u7bc4\u56f2\u3092\u5e83\u3052\u308b",
    "Navigation": "\u30ca\u30d3\u30b2\u30fc\u30b7\u30e7\u30f3",
    "Focus popup / toolbar": "\u30dd\u30c3\u30d7\u30a2\u30c3\u30d7/\u30c4\u30fc\u30eb\u30d0\u30fc\u3092\u30d5\u30a9\u30fc\u30ab\u30b9",
    "Return focus to previous position": "\u524d\u306e\u4f4d\u7f6e\u306b\u30d5\u30a9\u30fc\u30ab\u30b9\u3092\u623b\u3059",

    //\u00a0Embed.ly
    "Embed URL": "\u57cb\u3081\u8fbc\u307fURL",
    "Paste in a URL to embed": "\u57cb\u3081\u8fbc\u307fURL\u306b\u8cbc\u308a\u4ed8\u3051\u308b",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "\u8cbc\u308a\u4ed8\u3051\u305f\u6587\u66f8\u306fMicrosoft Word\u304b\u3089\u53d6\u5f97\u3055\u308c\u307e\u3059\u3002\u30d5\u30a9\u30fc\u30de\u30c3\u30c8\u3092\u4fdd\u6301\u3057\u3066\u8cbc\u308a\u4ed8\u3051\u307e\u3059\u304b\uff1f",
    "Keep": "\u66f8\u5f0f\u3092\u4fdd\u6301\u3059\u308b",
    "Clean": "\u66f8\u5f0f\u3092\u4fdd\u6301\u3057\u306a\u3044",
    "Word Paste Detected": "Microsoft Word\u306e\u8cbc\u308a\u4ed8\u3051\u304c\u691c\u51fa\u3055\u308c\u307e\u3057\u305f"
  },
  direction: "ltr"
};

}));

