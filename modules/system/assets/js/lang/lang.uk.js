/*
 * This file has been compiled from: /modules/system/lang/uk/client.php
 */
if ($.oc === undefined) $.oc = {}
if ($.oc.langMessages === undefined) $.oc.langMessages = {}
$.oc.langMessages['uk'] = $.extend(
    $.oc.langMessages['uk'] || {},
    {"markdowneditor":{"formatting":"\u0424\u043e\u0440\u043c\u0430\u0442\u0443\u0432\u0430\u043d\u043d\u044f","quote":"\u0426\u0438\u0442\u0430\u0442\u0430","code":"\u041a\u043e\u0434","header1":"\u0417\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a 1","header2":"\u0417\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a 2","header3":"\u0417\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a 3","header4":"\u0417\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a 4","header5":"\u0417\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a 5","header6":"\u0417\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a 6","bold":"\u0416\u0438\u0440\u043d\u0438\u0439 \u0448\u0440\u0438\u0444\u0442","italic":"\u041a\u0443\u0440\u0441\u0438\u0432","unorderedlist":"\u041d\u0435\u043d\u0443\u043c\u0435\u0440\u043e\u0432\u0430\u043d\u043d\u0438\u0439 \u0441\u043f\u0438\u0441\u043e\u043a","orderedlist":"\u041d\u0443\u043c\u0456\u0440\u043e\u0432\u0430\u043d\u043d\u0438\u0439 \u0441\u043f\u0438\u0441\u043e\u043a","video":"\u0412\u0456\u0434\u0435\u043e","image":"\u0417\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u043d\u044f","link":"\u041f\u043e\u0441\u0438\u043b\u0430\u043d\u043d\u044f","horizontalrule":"\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u0438 \u0433\u043e\u0440\u0438\u0437\u043e\u043d\u0442\u0430\u043b\u044c\u043d\u0443 \u0440\u0438\u0441\u043a\u0443","fullscreen":"\u041f\u043e\u0432\u043d\u0438\u0439 \u0435\u043a\u0440\u0430\u043d","preview":"\u041f\u043e\u043f\u0435\u0440\u0435\u0434\u043d\u0456\u0439 \u043f\u0435\u0440\u0435\u0433\u043b\u044f\u0434"},"mediamanager":{"insert_link":"\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u0438 \u043c\u0435\u0434\u0456\u0430-\u043f\u043e\u0441\u0438\u043b\u0430\u043d\u043d\u044f","insert_image":"\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u0438 \u043c\u0435\u0434\u0456\u0430-\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u043d\u044f","insert_video":"\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u0438 \u043c\u0435\u0434\u0456\u0430-\u0432\u0456\u0434\u0435\u043e","insert_audio":"\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u0438 \u043c\u0435\u0434\u0456\u0430-\u0430\u0443\u0434\u0456\u043e","invalid_file_empty_insert":"\u0411\u0443\u0434\u044c \u043b\u0430\u0441\u043a\u0430, \u043e\u0431\u0435\u0440\u0456\u0442\u044c \u0444\u0430\u0439\u043b \u0434\u043b\u044f \u0432\u0441\u0442\u0430\u0432\u043a\u0438 \u043f\u043e\u0441\u0438\u043b\u0430\u043d\u043d\u044f.","invalid_file_single_insert":"\u0411\u0443\u0434\u044c \u043b\u0430\u0441\u043a\u0430, \u043e\u0431\u0435\u0440\u0456\u0442\u044c \u043e\u0434\u0438\u043d \u0444\u0430\u0439\u043b.","invalid_image_empty_insert":"\u0411\u0443\u0434\u044c \u043b\u0430\u0441\u043a\u0430, \u043e\u0431\u0435\u0440\u0456\u0442\u044c \u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u043d\u044f \u0434\u043b\u044f \u0432\u0441\u0442\u0430\u0432\u043a\u0438.","invalid_video_empty_insert":"\u0411\u0443\u0434\u044c \u043b\u0430\u0441\u043a\u0430, \u043e\u0431\u0435\u0440\u0456\u0442\u044c \u0432\u0456\u0434\u0435\u043e \u0434\u043b\u044f \u0432\u0441\u0442\u0430\u0432\u043a\u0438.","invalid_audio_empty_insert":"\u0411\u0443\u0434\u044c \u043b\u0430\u0441\u043a\u0430, \u043e\u0431\u0435\u0440\u0456\u0442\u044c \u0430\u0443\u0434\u0456\u043e \u0434\u043b\u044f \u0432\u0441\u0442\u0430\u0432\u043a\u0438."},"alert":{"confirm_button_text":"\u041e\u043a","cancel_button_text":"\u0421\u043a\u0430\u0441\u0443\u0432\u0430\u0442\u0438","widget_remove_confirm":"\u0412\u0438\u0434\u0430\u043b\u0438\u0442\u0438 \u0446\u0435\u0439 \u0432\u0456\u0434\u0436\u0435\u0442?"},"datepicker":{"previousMonth":"\u041f\u043e\u043f\u0435\u0440\u0435\u0434\u043d\u0456\u0439 \u043c\u0456\u0441\u044f\u0446\u044c","nextMonth":"\u041d\u0430\u0441\u0442\u0443\u043f\u043d\u0438\u0439 \u043c\u0456\u0441\u044f\u0446\u044c","months":["\u0421\u0456\u0447\u0435\u043d\u044c","\u041b\u044e\u0442\u0438\u0439","\u0411\u0435\u0440\u0435\u0437\u0435\u043d\u044c","\u041a\u0432\u0456\u0442\u0435\u043d\u044c","\u0422\u0440\u0430\u0432\u0435\u043d\u044c","\u0427\u0435\u0440\u0432\u0435\u043d\u044c","\u041b\u0438\u043f\u0435\u043d\u044c","\u0421\u0435\u0440\u043f\u0435\u043d\u044c","\u0412\u0435\u0440\u0435\u0441\u0435\u043d\u044c","\u0416\u043e\u0432\u0442\u0435\u043d\u044c","\u041b\u0438\u0441\u0442\u043e\u043f\u0430\u0434","\u0413\u0440\u0443\u0434\u0435\u043d\u044c"],"weekdays":["\u041d\u0435\u0434\u0456\u043b\u044f","\u041f\u043e\u043d\u0435\u0434\u0456\u043b\u043e\u043a","\u0412\u0456\u0432\u0442\u043e\u0440\u043e\u043a","\u0421\u0435\u0440\u0435\u0434\u0430","\u0427\u0435\u0442\u0432\u0435\u0440","\u041f'\u044f\u0442\u043d\u0438\u0446\u044f","C\u0443\u0431\u043e\u0442\u0430"],"weekdaysShort":["\u041d\u0434","\u041f\u043d","\u0412\u0442","\u0421\u0440","\u0427\u0442","\u041f\u0442","\u0421\u0431"]},"colorpicker":{"choose":"Ok"},"filter":{"group":{"all":"\u0432\u0441\u0456"},"scopes":{"apply_button_text":"Apply","clear_button_text":"Clear"},"dates":{"all":"\u0432\u0441\u0456","filter_button_text":"\u0424\u0456\u043b\u044c\u0442\u0440","reset_button_text":"\u0421\u043a\u0438\u043d\u0443\u0442\u0438","date_placeholder":"\u0414\u0430\u0442\u0430","after_placeholder":"\u041f\u0456\u0441\u043b\u044f","before_placeholder":"\u0414\u043e"},"numbers":{"all":"all","filter_button_text":"Filter","reset_button_text":"Reset","min_placeholder":"Min","max_placeholder":"Max"}},"eventlog":{"show_stacktrace":"\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u0438 \u0442\u0440\u0430\u0441\u0443\u0432\u0430\u043d\u043d\u044f \u0441\u0442\u0435\u043a\u0430","hide_stacktrace":"\u041f\u0440\u0438\u0445\u043e\u0432\u0430\u0442\u0438 \u0442\u0440\u0430\u0441\u0443\u0432\u0430\u043d\u043d\u044f \u0441\u0442\u0435\u043a\u0430","tabs":{"formatted":"\u0424\u043e\u0440\u043c\u0430\u0442\u043e\u0432\u0430\u043d\u0438\u0439","raw":"\u041f\u043e\u0447\u0430\u0442\u043a\u043e\u0432\u0438\u0439"},"editor":{"title":"\u0420\u0435\u0434\u0430\u043a\u0442\u043e\u0440 \u0432\u0438\u0445\u0456\u0434\u043d\u043e\u0433\u043e \u043a\u043e\u0434\u0443","description":"\u0412\u0430\u0448\u0430 \u043e\u043f\u0435\u0440\u0430\u0446\u0456\u0439\u043d\u0430 \u0441\u0438\u0441\u0442\u0435\u043c\u0430 \u043f\u043e\u0432\u0438\u043d\u043d\u0430 \u0431\u0443\u0442\u0438 \u043d\u0430\u043b\u0430\u0448\u0442\u043e\u0432\u0430\u043d\u0430 \u043d\u0430 \u043f\u0440\u043e\u0441\u043b\u0443\u0445\u043e\u0432\u0443\u0432\u0430\u043d\u043d\u044f \u0434\u043e \u043e\u0434\u043d\u0456\u0454\u0457 \u0437 \u0446\u0438\u0445 \u0441\u0445\u0435\u043c URL.","openWith":"\u0412\u0456\u0434\u043a\u0440\u0438\u0442\u0438 \u0437\u0430 \u0434\u043e\u043f\u043e\u043c\u043e\u0433\u043e\u044e","remember_choice":"\u0417\u0430\u043f\u0430\u043c'\u044f\u0442\u0430\u0442\u0438 \u043e\u0431\u0440\u0430\u043d\u0438\u0439 \u0432\u0430\u0440\u0456\u0430\u043d\u0442 \u0434\u043b\u044f \u0446\u0456\u0454\u0457 \u0441\u0435\u0441\u0456\u0457","open":"\u0412\u0456\u0434\u043a\u0440\u0438\u0442\u0438","cancel":"\u0421\u043a\u0430\u0441\u0443\u0432\u0430\u0442\u0438"}}}
);

//! moment.js locale configuration v2.22.2
//! locale : ukrainian (uk)
//! author : zemlanin : https://github.com/zemlanin
//! Author : Menelion Elensúle : https://github.com/Oire

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
