/*
 * This file has been compiled from: /modules/system/lang/zh-tw/client.php
 */
if ($.oc === undefined) $.oc = {}
if ($.oc.langMessages === undefined) $.oc.langMessages = {}
$.oc.langMessages['zh-tw'] = $.extend(
    $.oc.langMessages['zh-tw'] || {},
    {"markdowneditor":{"formatting":"Formatting","quote":"Quote","code":"Code","header1":"Header 1","header2":"Header 2","header3":"Header 3","header4":"Header 4","header5":"Header 5","header6":"Header 6","bold":"Bold","italic":"Italic","unorderedlist":"Unordered List","orderedlist":"Ordered List","video":"Video","image":"Image","link":"Link","horizontalrule":"Insert Horizontal Rule","fullscreen":"Full screen","preview":"Preview"},"mediamanager":{"insert_link":"Insert Media Link","insert_image":"Insert Media Image","insert_video":"Insert Media Video","insert_audio":"Insert Media Audio","invalid_file_empty_insert":"Please select file to insert a links to.","invalid_file_single_insert":"Please select a single file.","invalid_image_empty_insert":"Please select image(s) to insert.","invalid_video_empty_insert":"Please select a video file to insert.","invalid_audio_empty_insert":"Please select an audio file to insert."},"alert":{"confirm_button_text":"OK","cancel_button_text":"Cancel","widget_remove_confirm":"Remove this widget?"},"datepicker":{"previousMonth":"Previous Month","nextMonth":"Next Month","months":["January","February","March","April","May","June","July","August","September","October","November","December"],"weekdays":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"weekdaysShort":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]},"colorpicker":{"choose":"Ok"},"filter":{"group":{"all":"all"},"scopes":{"apply_button_text":"Apply","clear_button_text":"Clear"},"dates":{"all":"all","filter_button_text":"Filter","reset_button_text":"Reset","date_placeholder":"Date","after_placeholder":"After","before_placeholder":"Before"},"numbers":{"all":"all","filter_button_text":"Filter","reset_button_text":"Reset","min_placeholder":"Min","max_placeholder":"Max"}},"eventlog":{"show_stacktrace":"Show the stacktrace","hide_stacktrace":"Hide the stacktrace","tabs":{"formatted":"Formatted","raw":"Raw"},"editor":{"title":"Source code editor","description":"Your operating system should be configured to listen to one of these URL schemes.","openWith":"Open with","remember_choice":"Remember selected option for this session","open":"Open","cancel":"Cancel"}}}
);

//! moment.js locale configuration v2.22.2
//! locale : traditional chinese (zh-tw)
//! author : Ben : https://github.com/ben-lin

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
