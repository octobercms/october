/*
 * This file has been compiled from: /modules/system/lang/zh-cn/client.php
 */
if ($.oc === undefined) $.oc = {}
if ($.oc.langMessages === undefined) $.oc.langMessages = {}
$.oc.langMessages['zh-cn'] = $.extend(
    $.oc.langMessages['zh-cn'] || {},
    {"markdowneditor":{"formatting":"\u683c\u5f0f\u5316","quote":"\u5f15\u7528","code":"\u4ee3\u7801","header1":"\u6807\u9898 1","header2":"\u6807\u9898 2","header3":"\u6807\u9898 3","header4":"\u6807\u9898 4","header5":"\u6807\u9898 5","header6":"\u6807\u9898 6","bold":"\u7c97\u4f53","italic":"\u659c\u4f53","unorderedlist":"\u65e0\u5e8f\u5217\u8868","orderedlist":"\u6709\u5e8f\u5217\u8868","video":"\u89c6\u9891","image":"\u56fe\u7247","link":"\u94fe\u63a5","horizontalrule":"\u63d2\u5165\u5206\u5272\u7ebf","fullscreen":"\u5168\u5c4f","preview":"\u9884\u89c8"},"mediamanager":{"insert_link":"\u63d2\u5165\u94fe\u63a5","insert_image":"\u63d2\u5165\u56fe\u7247","insert_video":"\u63d2\u5165\u89c6\u9891","insert_audio":"\u63d2\u5165\u97f3\u9891","invalid_file_empty_insert":"\u8bf7\u9009\u62e9\u8981\u63d2\u5165\u7684\u6587\u4ef6\u3002","invalid_file_single_insert":"\u8bf7\u9009\u62e9\u8981\u63d2\u5165\u7684\u6587\u4ef6\u3002","invalid_image_empty_insert":"\u8bf7\u9009\u62e9\u8981\u63d2\u5165\u7684\u56fe\u7247\u6587\u4ef6\u3002","invalid_video_empty_insert":"\u8bf7\u9009\u62e9\u8981\u63d2\u5165\u7684\u89c6\u9891\u6587\u4ef6\u3002","invalid_audio_empty_insert":"\u8bf7\u9009\u62e9\u8981\u63d2\u5165\u7684\u97f3\u9891\u6587\u4ef6\u3002"},"alert":{"confirm_button_text":"\u786e\u5b9a","cancel_button_text":"\u53d6\u6d88","widget_remove_confirm":"Remove this widget?"},"datepicker":{"previousMonth":"\u4e0a\u4e00\u4e2a\u6708","nextMonth":"\u4e0b\u4e00\u4e2a\u6708","months":["\u4e00\u6708","\u4e8c\u6708","\u4e09\u6708","\u56db\u6708","\u4e94\u6708","\u516d\u6708","\u4e03\u6708","\u516b\u6708","\u4e5d\u6708","\u5341\u6708","\u5341\u4e00\u6708","\u5341\u4e8c\u6708"],"weekdays":["\u5468\u65e5","\u5468\u4e00","\u5468\u4e8c","\u5468\u4e09","\u5468\u56db","\u5468\u4e94","\u5468\u516d"],"weekdaysShort":["\u65e5","\u4e00","\u4e8c","\u4e09","\u56db","\u4e94","\u516d"]},"filter":{"group":{"all":"\u5168\u90e8"},"dates":{"all":"\u5168\u90e8","filter_button_text":"\u7b5b\u9009","reset_button_text":"\u91cd\u7f6e","date_placeholder":"\u65e5\u671f","after_placeholder":"After","before_placeholder":"Before"}},"eventlog":{"show_stacktrace":"\u663e\u793a\u5806\u6808","hide_stacktrace":"\u9690\u85cf\u5806\u6808","tabs":{"formatted":"\u683c\u5f0f\u5316\u7684","raw":"\u539f\u59cb"},"editor":{"title":"\u6e90\u4ee3\u7801\u7f16\u8f91\u5668","description":"Your operating system should be configured to listen to one of these URL schemes.","openWith":"Open with","remember_choice":"\u8bb0\u4f4f\u9009\u62e9","open":"\u6253\u5f00","cancel":"\u53d6\u6d88"}}}
);

//! moment.js locale configuration
//! locale : chinese (zh-cn)
//! author : suupic : https://github.com/suupic
//! author : Zeno Zeng : https://github.com/zenozeng

;(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined'
       && typeof require === 'function' ? factory(require('../moment')) :
   typeof define === 'function' && define.amd ? define(['moment'], factory) :
   factory(global.moment)
}(this, function (moment) { 'use strict';


    var zh_cn = moment.defineLocale('zh-cn', {
        months : '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
        monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
        weekdays : '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
        weekdaysShort : '周日_周一_周二_周三_周四_周五_周六'.split('_'),
        weekdaysMin : '日_一_二_三_四_五_六'.split('_'),
        longDateFormat : {
            LT : 'Ah点mm分',
            LTS : 'Ah点m分s秒',
            L : 'YYYY-MM-DD',
            LL : 'YYYY年MMMD日',
            LLL : 'YYYY年MMMD日Ah点mm分',
            LLLL : 'YYYY年MMMD日ddddAh点mm分',
            l : 'YYYY-MM-DD',
            ll : 'YYYY年MMMD日',
            lll : 'YYYY年MMMD日Ah点mm分',
            llll : 'YYYY年MMMD日ddddAh点mm分'
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
            sameDay : function () {
                return this.minutes() === 0 ? '[今天]Ah[点整]' : '[今天]LT';
            },
            nextDay : function () {
                return this.minutes() === 0 ? '[明天]Ah[点整]' : '[明天]LT';
            },
            lastDay : function () {
                return this.minutes() === 0 ? '[昨天]Ah[点整]' : '[昨天]LT';
            },
            nextWeek : function () {
                var startOfWeek, prefix;
                startOfWeek = moment().startOf('week');
                prefix = this.diff(startOfWeek, 'days') >= 7 ? '[下]' : '[本]';
                return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm';
            },
            lastWeek : function () {
                var startOfWeek, prefix;
                startOfWeek = moment().startOf('week');
                prefix = this.unix() < startOfWeek.unix()  ? '[上]' : '[本]';
                return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm';
            },
            sameElse : 'LL'
        },
        ordinalParse: /\d{1,2}(日|月|周)/,
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

    return zh_cn;

}));
