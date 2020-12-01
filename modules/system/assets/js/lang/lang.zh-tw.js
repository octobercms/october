/*
 * This file has been compiled from: /modules/system/lang/zh-tw/client.php
 */
if ($.oc === undefined) $.oc = {}
if ($.oc.langMessages === undefined) $.oc.langMessages = {}
$.oc.langMessages['zh-tw'] = $.extend(
    $.oc.langMessages['zh-tw'] || {},
    {"markdowneditor":{"formatting":"\u683c\u5f0f","quote":"\u5f15\u7528","code":"\u7a0b\u5f0f\u78bc","header1":"\u6a19\u984c\u4e00","header2":"\u6a19\u984c\u4e8c","header3":"\u6a19\u984c\u4e09","header4":"\u6a19\u984c\u56db","header5":"\u6a19\u984c\u4e94","header6":"\u6a19\u984c\u516d","bold":"\u7c97\u9ad4","italic":"\u659c\u9ad4","unorderedlist":"\u9805\u76ee\u6e05\u55ae","orderedlist":"\u6578\u5b57\u6e05\u55ae","video":"\u5f71\u7247","image":"\u5716\u7247","link":"\u9023\u7d50","horizontalrule":"\u63d2\u5165\u6c34\u5e73\u7dda","fullscreen":"\u5168\u87a2\u5e55","preview":"\u9810\u89bd"},"mediamanager":{"insert_link":"\u63d2\u5165\u5a92\u9ad4\u6ac3\u9023\u7d50","insert_image":"\u63d2\u5165\u5a92\u9ad4\u6ac3\u5716\u7247","insert_video":"\u63d2\u5165\u5a92\u9ad4\u6ac3\u5f71\u7247","insert_audio":"\u63d2\u5165\u5a92\u9ad4\u6ac3\u97f3\u8a0a","invalid_file_empty_insert":"\u8acb\u9078\u64c7\u6a94\u6848\u4ee5\u63d2\u5165\u9023\u7d50\u3002","invalid_file_single_insert":"\u8acb\u9078\u64c7\u4e00\u500b\u6a94\u6848\u3002","invalid_image_empty_insert":"\u8acb\u9078\u64c7\u63d2\u5165\u7684\u5716\u7247\u3002","invalid_video_empty_insert":"\u8acb\u9078\u64c7\u63d2\u5165\u7684\u5f71\u7247\u3002","invalid_audio_empty_insert":"\u8acb\u9078\u64c7\u63d2\u5165\u7684\u97f3\u8a0a\u3002"},"alert":{"confirm_button_text":"\u78ba\u8a8d","cancel_button_text":"\u53d6\u6d88","widget_remove_confirm":"\u78ba\u5b9a\u79fb\u9664\u6b64\u5143\u4ef6\uff1f"},"datepicker":{"previousMonth":"\u4e0a\u500b\u6708","nextMonth":"\u4e0b\u500b\u6708","months":["\u4e00\u6708","\u4e8c\u6708","\u4e09\u6708","\u56db\u6708","\u4e94\u6708","\u516d\u6708","\u4e03\u6708","\u516b\u6708","\u4e5d\u6708","\u5341\u6708","\u5341\u4e00\u6708","\u5341\u4e8c\u6708"],"weekdays":["\u661f\u671f\u65e5","\u661f\u671f\u4e00","\u661f\u671f\u4e8c","\u661f\u671f\u4e09","\u661f\u671f\u56db","\u661f\u671f\u4e94","\u661f\u671f\u516d"],"weekdaysShort":["\u9031\u65e5","\u9031\u4e00","\u9031\u4e8c","\u9031\u4e09","\u9031\u56db","\u9031\u4e94","\u9031\u516d"]},"colorpicker":{"choose":"\u78ba\u5b9a"},"filter":{"group":{"all":"\u5168\u90e8"},"scopes":{"apply_button_text":"\u78ba\u5b9a","clear_button_text":"\u6e05\u9664"},"dates":{"all":"\u5168\u90e8","filter_button_text":"\u7be9\u9078","reset_button_text":"\u91cd\u7f6e","date_placeholder":"\u65e5\u671f","after_placeholder":"\u5728\u6b64\u4e4b\u5f8c","before_placeholder":"\u5728\u6b64\u4e4b\u524d"},"numbers":{"all":"\u5168\u90e8","filter_button_text":"\u7be9\u9078","reset_button_text":"\u91cd\u7f6e","min_placeholder":"\u6700\u5c0f\u503c","max_placeholder":"\u6700\u5927\u503c"}},"eventlog":{"show_stacktrace":"Show the stacktrace","hide_stacktrace":"Hide the stacktrace","tabs":{"formatted":"Formatted","raw":"Raw"},"editor":{"title":"Source code editor","description":"Your operating system should be configured to listen to one of these URL schemes.","openWith":"Open with","remember_choice":"Remember selected option for this session","open":"Open","cancel":"Cancel"}}}
);

//! moment.js locale configuration v2.22.2

;(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined'
       && typeof require === 'function' ? factory(require('../moment')) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


    var zhTw = moment.defineLocale('zh-tw', {
        months : '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
        monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
        weekdays : '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
        weekdaysShort : '週日_週一_週二_週三_週四_週五_週六'.split('_'),
        weekdaysMin : '日_一_二_三_四_五_六'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'YYYY/MM/DD',
            LL : 'YYYY年M月D日',
            LLL : 'YYYY年M月D日 HH:mm',
            LLLL : 'YYYY年M月D日dddd HH:mm',
            l : 'YYYY/M/D',
            ll : 'YYYY年M月D日',
            lll : 'YYYY年M月D日 HH:mm',
            llll : 'YYYY年M月D日dddd HH:mm'
        },
        meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
        meridiemHour : function (hour, meridiem) {
            if (hour === 12) {
                hour = 0;
            }
            if (meridiem === '凌晨' || meridiem === '早上' || meridiem === '上午') {
                return hour;
            } else if (meridiem === '中午') {
                return hour >= 11 ? hour : hour + 12;
            } else if (meridiem === '下午' || meridiem === '晚上') {
                return hour + 12;
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
            sameDay : '[今天] LT',
            nextDay : '[明天] LT',
            nextWeek : '[下]dddd LT',
            lastDay : '[昨天] LT',
            lastWeek : '[上]dddd LT',
            sameElse : 'L'
        },
        dayOfMonthOrdinalParse: /\d{1,2}(日|月|週)/,
        ordinal : function (number, period) {
            switch (period) {
                case 'd' :
                case 'D' :
                case 'DDD' :
                    return number + '日';
                case 'M' :
                    return number + '月';
                case 'w' :
                case 'W' :
                    return number + '週';
                default :
                    return number;
            }
        },
        relativeTime : {
            future : '%s內',
            past : '%s前',
            s : '幾秒',
            ss : '%d 秒',
            m : '1 分鐘',
            mm : '%d 分鐘',
            h : '1 小時',
            hh : '%d 小時',
            d : '1 天',
            dd : '%d 天',
            M : '1 個月',
            MM : '%d 個月',
            y : '1 年',
            yy : '%d 年'
        }
    });

    return zhTw;

})));

