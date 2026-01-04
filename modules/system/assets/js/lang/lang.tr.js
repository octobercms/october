/*
 * This file has been compiled from: /modules/system/lang/tr/client.php
 */
if (!window.oc) {
    window.oc = {};
}

if (!window.oc.langMessages) {
    window.oc.langMessages = {};
}

window.oc.langMessages['tr'] = $.extend(
    window.oc.langMessages['tr'] || {},
    {
    "markdowneditor": {
        "formatting": "Formatlama",
        "quote": "Al\u0131nt\u0131",
        "code": "Kod",
        "header1": "Ba\u015fl\u0131k 1",
        "header2": "Ba\u015fl\u0131k 2",
        "header3": "Ba\u015fl\u0131k 3",
        "header4": "Ba\u015fl\u0131k 4",
        "header5": "Ba\u015fl\u0131k 5",
        "header6": "Ba\u015fl\u0131k 6",
        "bold": "Kal\u0131n",
        "italic": "\u0130talik",
        "unorderedlist": "S\u0131ras\u0131z Liste",
        "orderedlist": "S\u0131ral\u0131 Liste",
        "snippet": "Snippet",
        "video": "Video",
        "image": "G\u00f6rsel/Resim",
        "link": "Link",
        "horizontalrule": "Yatay \u00c7izgi Ekle",
        "fullscreen": "Tam Ekran",
        "preview": "\u00d6nizleme",
        "strikethrough": "Strikethrough",
        "cleanblock": "Clean Block",
        "table": "Table",
        "sidebyside": "Side by Side"
    },
    "mediamanager": {
        "insert_link": "Medya Linki Ekle",
        "insert_image": "Medya Resim Ekle",
        "insert_video": "Medya Video Ekle",
        "insert_audio": "Medya Ses Ekle",
        "invalid_file_empty_insert": "L\u00fctfen link verilecek dosyay\u0131 se\u00e7in.",
        "invalid_file_single_insert": "L\u00fctfen tek bir dosya se\u00e7in.",
        "invalid_image_empty_insert": "L\u00fctfen eklenecek resim(ler)i se\u00e7in.",
        "invalid_video_empty_insert": "L\u00fctfen eklenecek video dosyas\u0131n\u0131 se\u00e7in.",
        "invalid_audio_empty_insert": "L\u00fctfen eklenecek ses dosyas\u0131n\u0131 se\u00e7in."
    },
    "alert": {
        "error": "Error",
        "confirm": "Confirm",
        "dismiss": "Dismiss",
        "confirm_button_text": "Evet",
        "cancel_button_text": "\u0130ptal",
        "widget_remove_confirm": "Bu eklentiyi kald\u0131rma istedi\u011finize emin misiniz?"
    },
    "datepicker": {
        "previousMonth": "\u00d6nceki Ay",
        "nextMonth": "Sonraki Ay",
        "months": [
            "Ocak",
            "\u015eubat",
            "Mart",
            "Nisan",
            "May\u0131s",
            "Haziran",
            "Temmuz",
            "A\u011fustos",
            "Eyl\u00fcl",
            "Ekim",
            "Kas\u0131m",
            "Aral\u0131k"
        ],
        "weekdays": [
            "Pazar",
            "Pazartesi",
            "Sal\u0131",
            "\u00c7ar\u015famba",
            "Per\u015fembe",
            "Cuma",
            "Cumartesi"
        ],
        "weekdaysShort": [
            "Paz",
            "Pzt",
            "Sal",
            "\u00c7ar",
            "Per",
            "Cum",
            "Cmt"
        ]
    },
    "colorpicker": {
        "choose": "Se\u00e7"
    },
    "filter": {
        "group": {
            "all": "t\u00fcm\u00fc"
        },
        "scopes": {
            "apply_button_text": "Uygula",
            "clear_button_text": "Temizle"
        },
        "dates": {
            "all": "t\u00fcm\u00fc",
            "filter_button_text": "Filtrele",
            "reset_button_text": "S\u0131f\u0131rla",
            "date_placeholder": "Tarih",
            "after_placeholder": "Sonra",
            "before_placeholder": "\u00d6nce"
        },
        "numbers": {
            "all": "all",
            "filter_button_text": "Filtrele",
            "reset_button_text": "S\u0131f\u0131rla",
            "min_placeholder": "Min",
            "max_placeholder": "Max",
            "number_placeholder": "N\u00famero"
        }
    },
    "eventlog": {
        "show_stacktrace": "Veri y\u0131\u011f\u0131n\u0131n\u0131 g\u00f6ster",
        "hide_stacktrace": "Veri y\u0131\u011f\u0131n\u0131n\u0131 gizle",
        "tabs": {
            "formatted": "Formatl\u0131",
            "raw": "Ham Veri"
        },
        "editor": {
            "title": "Kaynak kod edit\u00f6r\u00fc",
            "description": "\u0130\u015fletim sisteminiz URL \u015femalar\u0131na yan\u0131t verecek \u015fekilde yap\u0131land\u0131r\u0131lmal\u0131d\u0131r.",
            "openWith": "Birlikte a\u00e7",
            "remember_choice": "Bu oturum i\u00e7in se\u00e7enekleri hat\u0131rla",
            "open": "A\u00e7",
            "cancel": "\u0130ptal",
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

    var suffixes = {
        1: '\'inci',
        5: '\'inci',
        8: '\'inci',
        70: '\'inci',
        80: '\'inci',
        2: '\'nci',
        7: '\'nci',
        20: '\'nci',
        50: '\'nci',
        3: '\'üncü',
        4: '\'üncü',
        100: '\'üncü',
        6: '\'ncı',
        9: '\'uncu',
        10: '\'uncu',
        30: '\'uncu',
        60: '\'ıncı',
        90: '\'ıncı'
    };

    var tr = moment.defineLocale('tr', {
        months : 'Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık'.split('_'),
        monthsShort : 'Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara'.split('_'),
        weekdays : 'Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi'.split('_'),
        weekdaysShort : 'Paz_Pts_Sal_Çar_Per_Cum_Cts'.split('_'),
        weekdaysMin : 'Pz_Pt_Sa_Ça_Pe_Cu_Ct'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd, D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay : '[bugün saat] LT',
            nextDay : '[yarın saat] LT',
            nextWeek : '[gelecek] dddd [saat] LT',
            lastDay : '[dün] LT',
            lastWeek : '[geçen] dddd [saat] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : '%s sonra',
            past : '%s önce',
            s : 'birkaç saniye',
            ss : '%d saniye',
            m : 'bir dakika',
            mm : '%d dakika',
            h : 'bir saat',
            hh : '%d saat',
            d : 'bir gün',
            dd : '%d gün',
            M : 'bir ay',
            MM : '%d ay',
            y : 'bir yıl',
            yy : '%d yıl'
        },
        ordinal: function (number, period) {
            switch (period) {
                case 'd':
                case 'D':
                case 'Do':
                case 'DD':
                    return number;
                default:
                    if (number === 0) {  // special case for zero
                        return number + '\'ıncı';
                    }
                    var a = number % 10,
                        b = number % 100 - a,
                        c = number >= 100 ? 100 : null;
                    return number + (suffixes[a] || suffixes[b] || suffixes[c]);
            }
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 1st is the first week of the year.
        }
    });

    return tr;

})));


/*! Select2 4.1.0-rc.0 | https://github.com/select2/select2/blob/master/LICENSE.md */

!function(){if(jQuery&&jQuery.fn&&jQuery.fn.select2&&jQuery.fn.select2.amd)var n=jQuery.fn.select2.amd;n.define("select2/i18n/tr",[],function(){return{errorLoading:function(){return"Sonuç yüklenemedi"},inputTooLong:function(n){return n.input.length-n.maximum+" karakter daha girmelisiniz"},inputTooShort:function(n){return"En az "+(n.minimum-n.input.length)+" karakter daha girmelisiniz"},loadingMore:function(){return"Daha fazla…"},maximumSelected:function(n){return"Sadece "+n.maximum+" seçim yapabilirsiniz"},noResults:function(){return"Sonuç bulunamadı"},searching:function(){return"Aranıyor…"},removeAllItems:function(){return"Tüm öğeleri kaldır"}}}),n.define,n.require}();

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
 * Turkish
 */

if (!$.FE_LANGUAGE) {
    $.FE_LANGUAGE = {};
}

$.FE_LANGUAGE['tr'] = {
  translation: {
    // Place holder
    "Type something": "Bir \u015fey yaz\u0131n",

    // Basic formatting
    "Bold": "Kal\u0131n",
    "Italic": "\u0130talik",
    "Underline": "Alt\u0131 \u00e7izili",
    "Strikethrough": "\u00dcst\u00fc \u00e7izili",

    // Main buttons
    "Insert": "Ekle",
    "Delete": "Silmek",
    "Cancel": "\u0130ptal",
    "OK": "Tamam",
    "Back": "Geri",
    "Remove": "Kald\u0131r",
    "More": "Daha",
    "Update": "G\u00fcncelle\u015ftirme",
    "Style": "Stil",

    // Font
    "Font Family": "Yaz\u0131tipi Ailesi",
    "Font Size": "Yaz\u0131tipi B\u00fcy\u00fckl\u00fc\u011f\u00fc",

    // Colors
    "Colors": "Renkler",
    "Background": "Arkaplan",
    "Text": "Metin",
    "HEX Color": "Altı renkli",

    // Paragraphs
    "Paragraph Format": "Bi\u00e7imler",
    "Normal": "Normal",
    "Code": "Kod",
    "Heading 1": "Ba\u015fl\u0131k 1",
    "Heading 2": "Ba\u015fl\u0131k 2",
    "Heading 3": "Ba\u015fl\u0131k 3",
    "Heading 4": "Ba\u015fl\u0131k 4",

    // Style
    "Paragraph Style": "Paragraf stili",
    "Inline Style": "\u00c7izgide stili",

    // Alignment
    "Align": "Hizalama",
    "Align Left": "Sola hizala",
    "Align Center": "Ortala",
    "Align Right": "Sa\u011fa hizala",
    "Align Justify": "\u0130ki yana yasla",
    "None": "Hi\u00e7biri",

    // Lists
    "Ordered List": "S\u0131ral\u0131 liste",
    "Default": "Varsayılan",
    "Lower Alpha": "Alt alfa",
    "Lower Greek": "Alt yunan",
    "Lower Roman": "Alt roma",
    "Upper Alpha": "Üst alfa",
    "Upper Roman": "Üst roma",

    "Unordered List": "S\u0131ras\u0131z liste",
    "Circle": "Daire",
    "Disc": "Disk",
    "Square": "Kare",

    // Line height
    "Line Height": "Satır yüksekliği",
    "Single": "Tek",
    "Double": "Çift",

    // Indent
    "Decrease Indent": "Girintiyi azalt",
    "Increase Indent": "Girintiyi art\u0131r",

    // Links
    "Insert Link": "Ba\u011flant\u0131 ekle",
    "Open in new tab": "Yeni sekmede a\u00e7",
    "Open Link": "Linki a\u00e7",
    "Edit Link": "D\u00fczenleme ba\u011flant\u0131s\u0131",
    "Unlink": "Ba\u011flant\u0131y\u0131 kald\u0131r",
    "Choose Link": "Ba\u011flant\u0131y\u0131 se\u00e7in",

    // Images
    "Insert Image": "Resim ekle",
    "Upload Image": "Y\u00fckleme g\u00f6r\u00fcnt\u00fcs\u00fc",
    "By URL": "URL'ye g\u00f6re",
    "Browse": "G\u00f6zat",
    "Drop image": "B\u0131rak resim",
    "or click": "ya da t\u0131klay\u0131n",
    "Manage Images": "G\u00f6r\u00fcnt\u00fcleri y\u00f6netin",
    "Loading": "Y\u00fckleniyor",
    "Deleting": "Silme",
    "Tags": "Etiketler",
    "Are you sure? Image will be deleted.": "Emin misin? Resim silinecektir.",
    "Replace": "De\u011fi\u015ftirmek",
    "Uploading": "Y\u00fckleme",
    "Loading image": "Y\u00fckleme g\u00f6r\u00fcnt\u00fcs\u00fc",
    "Display": "G\u00f6stermek",
    "Inline": "\u00c7izgide",
    "Break Text": "K\u0131r\u0131lma metni",
    "Alternative Text": "Alternatif metin",
    "Change Size": "De\u011fi\u015fim boyutu",
    "Width": "Geni\u015flik",
    "Height": "Y\u00fckseklik",
    "Something went wrong. Please try again.": "Bir \u015feyler yanl\u0131\u015f gitti. L\u00fctfen tekrar deneyin.",
    "Image Caption": "Resim yazısı",
    "Advanced Edit": "Ileri düzey düzenleme",

    // Video
    "Insert Video": "Video ekle",
    "Embedded Code": "G\u00f6m\u00fcl\u00fc kod",
    "Paste in a video URL": "Bir video URL'sine yapıştırın",
    "Drop video": "Video bırak",
    "Your browser does not support HTML5 video.": "Tarayıcınız html5 videoyu desteklemez.",
    "Upload Video": "Video yükle",

    // Tables
    "Insert Table": "Tablo ekle",
    "Table Header": "Tablo \u00fcstbilgisi",
    "Remove Table": "Tablo kald\u0131rma",
    "Table Style": "Tablo stili",
    "Horizontal Align": "Yatay hizalama",
    "Row": "Sat\u0131r",
    "Insert row above": "\u00d6ncesine yeni sat\u0131r ekle",
    "Insert row below": "Sonras\u0131na yeni sat\u0131r ekle",
    "Delete row": "Sat\u0131r\u0131 sil",
    "Column": "S\u00fctun",
    "Insert column before": "\u00d6ncesine yeni s\u00fctun ekle",
    "Insert column after": "Sonras\u0131na yeni s\u00fctun ekle",
    "Delete column": "S\u00fctunu sil",
    "Cell": "H\u00fccre",
    "Merge cells": "H\u00fccreleri birle\u015ftir",
    "Horizontal split": "Yatay b\u00f6l\u00fcnm\u00fc\u015f",
    "Vertical split": "Dikey  b\u00f6l\u00fcnm\u00fc\u015f",
    "Cell Background": "H\u00fccre arka plan\u0131",
    "Vertical Align": "Dikey hizalama",
    "Top": "\u00dcst",
    "Middle": "Orta",
    "Bottom": "Alt",
    "Align Top": "\u00dcst hizalama",
    "Align Middle": "Orta hizalama",
    "Align Bottom": "Dibe hizalama",
    "Cell Style": "H\u00fccre stili",

    // Files
    "Upload File": "Dosya Y\u00fckle",
    "Drop file": "B\u0131rak dosya",

    // Emoticons
    "Emoticons": "\u0130fadeler",
    "Grinning face": "S\u0131r\u0131tan y\u00fcz",
    "Grinning face with smiling eyes": "G\u00fclen g\u00f6zlerle y\u00fcz s\u0131r\u0131tarak",
    "Face with tears of joy": "Sevin\u00e7 g\u00f6zya\u015flar\u0131yla Y\u00fcz",
    "Smiling face with open mouth": "A\u00e7\u0131k a\u011fz\u0131 ile g\u00fcl\u00fcmseyen y\u00fcz\u00fc",
    "Smiling face with open mouth and smiling eyes": "A\u00e7\u0131k a\u011fzı ve g\u00fcl\u00fcmseyen g\u00f6zlerle g\u00fcler y\u00fcz",
    "Smiling face with open mouth and cold sweat": "A\u00e7\u0131k a\u011fz\u0131 ve so\u011fuk ter ile g\u00fclen y\u00fcz\u00fc",
    "Smiling face with open mouth and tightly-closed eyes": "A\u00e7\u0131k a\u011fz\u0131 s\u0131k\u0131ca kapal\u0131 g\u00f6zlerle g\u00fclen y\u00fcz\u00fc",
    "Smiling face with halo": "Halo ile y\u00fcz g\u00fclen",
    "Smiling face with horns": "Boynuzlar\u0131 ile g\u00fcler y\u00fcz",
    "Winking face": "G\u00f6z a\u00e7\u0131p kapay\u0131ncaya y\u00fcz\u00fc",
    "Smiling face with smiling eyes": "G\u00fclen g\u00f6zlerle g\u00fcler Y\u00fcz",
    "Face savoring delicious food": "Lezzetli yemekler tad\u0131n\u0131 Y\u00fcz",
    "Relieved face": "Rahatlad\u0131m y\u00fcz\u00fc",
    "Smiling face with heart-shaped eyes": "Kalp \u015feklinde g\u00f6zlerle g\u00fcler y\u00fcz",
    "Smiling face with sunglasses": "Kalp \u015feklinde g\u00f6zlerle g\u00fcler y\u00fcz",
    "Smirking face": "S\u0131r\u0131tan y\u00fcz",
    "Neutral face": "N\u00f6tr y\u00fcz",
    "Expressionless face": "Ifadesiz y\u00fcz\u00fc",
    "Unamused face": "Kay\u0131ts\u0131z y\u00fcz\u00fc",
    "Face with cold sweat": "So\u011fuk terler Y\u00fcz",
    "Pensive face": "dalg\u0131n bir y\u00fcz",
    "Confused face": "\u015fa\u015fk\u0131n bir y\u00fcz",
    "Confounded face": "Ele\u015ftirilmi\u015ftir y\u00fcz\u00fc",
    "Kissing face": "\u00f6p\u00fc\u015fme y\u00fcz\u00fc",
    "Face throwing a kiss": "Bir \u00f6p\u00fcc\u00fck atma Y\u00fcz",
    "Kissing face with smiling eyes": "G\u00fclen g\u00f6zlerle y\u00fcz \u00f6p\u00fc\u015fme",
    "Kissing face with closed eyes": "Kapal\u0131 g\u00f6zlerle \u00f6p\u00f6\u015fme y\u00fcz",
    "Face with stuck out tongue": "Dilini y\u00fcz ile s\u0131k\u0131\u015fm\u0131\u015f",
    "Face with stuck out tongue and winking eye": "\u015ea\u015f\u0131r\u0131p kalm\u0131\u015f d\u0131\u015far\u0131 dil ve g\u00f6z k\u0131rpan y\u00fcz",
    "Face with stuck out tongue and tightly-closed eyes": "Y\u00fcz ile dil ve s\u0131k\u0131ca kapal\u0131 g\u00f6zleri s\u0131k\u0131\u015fm\u0131\u015f",
    "Disappointed face": "Hayal k\u0131r\u0131kl\u0131\u011f\u0131na y\u00fcz\u00fc",
    "Worried face": "Endi\u015feli bir y\u00fcz",
    "Angry face": "K\u0131zg\u0131n y\u00fcz",
    "Pouting face": "Somurtarak y\u00fcz\u00fc",
    "Crying face": "A\u011flayan y\u00fcz",
    "Persevering face": "Azmeden y\u00fcz\u00fc",
    "Face with look of triumph": "Zafer bak\u0131\u015fla Y\u00fcz",
    "Disappointed but relieved face": "Hayal k\u0131r\u0131kl\u0131\u011f\u0131 ama rahatlad\u0131m y\u00fcz",
    "Frowning face with open mouth": "A\u00e7\u0131k a\u011fz\u0131 ile \u00e7at\u0131k y\u00fcz\u00fc",
    "Anguished face": "Kederli y\u00fcz",
    "Fearful face": "Korkulu y\u00fcz\u00fc",
    "Weary face": "Yorgun y\u00fcz\u00fc",
    "Sleepy face": "Uykulu y\u00fcz\u00fc",
    "Tired face": "Yorgun y\u00fcz\u00fc",
    "Grimacing face": "Y\u00fcz\u00fcn\u00fc buru\u015fturarak y\u00fcz\u00fc",
    "Loudly crying face": "Y\u00fcksek sesle y\u00fcz\u00fc a\u011fl\u0131yor",
    "Face with open mouth": "A\u00e7\u0131k a\u011fz\u0131 ile Y\u00fcz",
    "Hushed face": "Dingin y\u00fcz\u00fc",
    "Face with open mouth and cold sweat": "A\u00e7\u0131k a\u011fz\u0131 ve so\u011fuk ter ile Y\u00fcz",
    "Face screaming in fear": "Korku i\u00e7inde \u00e7ı\u011fl\u0131k Y\u00fcz",
    "Astonished face": "\u015fa\u015fk\u0131n bir y\u00fcz",
    "Flushed face": "K\u0131zarm\u0131\u015f y\u00fcz\u00fc",
    "Sleeping face": "Uyuyan y\u00fcz\u00fc",
    "Dizzy face": "Ba\u015f\u0131m d\u00f6nd\u00fc y\u00fcz",
    "Face without mouth": "A\u011f\u0131z olmadan Y\u00fcz",
    "Face with medical mask": "T\u0131bbi maske ile y\u00fcz",

    // Line breaker
    "Break": "K\u0131r\u0131lma",

    // Math
    "Subscript": "Alt simge",
    "Superscript": "\u00dcst simge",

    // Full screen
    "Fullscreen": "Tam ekran",

    // Horizontal line
    "Insert Horizontal Line": "Yatay \u00e7izgi ekleme",

    // Clear formatting
    "Clear Formatting": "Bi\u00e7imlendirme kald\u0131r",

    // Save
    "Save": "Kayıt etmek",

    // Undo, redo
    "Undo": "Geri Al",
    "Redo": "Yinele",

    // Select all
    "Select All": "T\u00fcm\u00fcn\u00fc se\u00e7",

    // Code view
    "Code View": "Kod g\u00f6r\u00fcn\u00fcm\u00fc",

    // Quote
    "Quote": "Al\u0131nt\u0131",
    "Increase": "Art\u0131rmak",
    "Decrease": "Azal\u0131\u015f",

    // Quick Insert
    "Quick Insert": "H\u0131zl\u0131 insert",

    // Spcial Characters
    "Special Characters": "Özel karakterler",
    "Latin": "Latince",
    "Greek": "Yunan",
    "Cyrillic": "Kiril",
    "Punctuation": "Noktalama",
    "Currency": "Para birimi",
    "Arrows": "Oklar",
    "Math": "Matematik",
    "Misc": "Misc",

    // Print.
    "Print": "Baskı",

    // Spell Checker.
    "Spell Checker": "Yazım denetleyicisi",

    // Help
    "Help": "Yardım et",
    "Shortcuts": "Kısayollar",
    "Inline Editor": "Satır içi düzenleyici",
    "Show the editor": "Editörü gösterin",
    "Common actions": "Ortak eylemler",
    "Copy": "Kopya",
    "Cut": "Kesim",
    "Paste": "Yapıştırmak",
    "Basic Formatting": "Temel biçimlendirme",
    "Increase quote level": "Teklif seviyesini yükselt",
    "Decrease quote level": "Teklif seviyesini azalt",
    "Image / Video": "Resim / video",
    "Resize larger": "Daha büyük yeniden boyutlandır",
    "Resize smaller": "Daha küçük boyuta getir",
    "Table": "Tablo",
    "Select table cell": "Tablo hücresi seç",
    "Extend selection one cell": "Seçimi bir hücre genişlet",
    "Extend selection one row": "Seçimi bir sıra genişlet",
    "Navigation": "Navigasyon",
    "Focus popup / toolbar": "Odaklanma açılır penceresi / araç çubuğu",
    "Return focus to previous position": "Odaklamaya önceki konumuna geri dönün",

    // Embed.ly
    "Embed URL": "URL göm",
    "Paste in a URL to embed": "Yerleştirmek için bir URL'ye yapıştırın",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "Yapıştırılan içerik bir Microsoft Word belgesinden geliyor. Biçimi saklamaya mı yoksa temizlemeyi mi istiyor musun?",
    "Keep": "Tutmak",
    "Clean": "Temiz",
    "Word Paste Detected": "Kelime yapıştırması algılandı"
  },
  direction: "ltr"
};

}));

