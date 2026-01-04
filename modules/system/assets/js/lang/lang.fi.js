/*
 * This file has been compiled from: /modules/system/lang/fi/client.php
 */
if (!window.oc) {
    window.oc = {};
}

if (!window.oc.langMessages) {
    window.oc.langMessages = {};
}

window.oc.langMessages['fi'] = $.extend(
    window.oc.langMessages['fi'] || {},
    {
    "markdowneditor": {
        "formatting": "Muotoilu",
        "quote": "Lainaus",
        "code": "Koodi",
        "header1": "Otsikko 1",
        "header2": "Otsikko 2",
        "header3": "Otsikko 3",
        "header4": "Otsikko 4",
        "header5": "Otsikko 5",
        "header6": "Otsikko 6",
        "bold": "Lihavointi",
        "italic": "Kursivointi",
        "unorderedlist": "J\u00e4rjest\u00e4m\u00e4t\u00f6n lista",
        "orderedlist": "J\u00e4rjestetty lista",
        "snippet": "Snippet",
        "video": "Video",
        "image": "Kuva",
        "link": "Linkki",
        "horizontalrule": "Lis\u00e4\u00e4 horisontaalinen jakaja",
        "fullscreen": "Kokon\u00e4ytt\u00f6",
        "preview": "Esikatsele",
        "strikethrough": "Yliviivattu",
        "cleanblock": "Puhdas blokki",
        "table": "Taulukko",
        "sidebyside": "Vierekk\u00e4in"
    },
    "mediamanager": {
        "insert_link": "Lis\u00e4\u00e4 linkki Mediaan",
        "insert_image": "Lis\u00e4\u00e4 kuva",
        "insert_video": "Lis\u00e4\u00e4 video",
        "insert_audio": "Lis\u00e4\u00e4 \u00e4\u00e4nitiedosto",
        "invalid_file_empty_insert": "Valitse liitett\u00e4v\u00e4 tiedosto.",
        "invalid_file_single_insert": "Valitse vain yksi tiedosto.",
        "invalid_image_empty_insert": "Valitse linkitett\u00e4v\u00e4(t) kuva(t).",
        "invalid_video_empty_insert": "Valitse linkitett\u00e4v\u00e4 videotiedosto.",
        "invalid_audio_empty_insert": "Valitse linkitett\u00e4v\u00e4 \u00e4\u00e4nitiedosto."
    },
    "alert": {
        "error": "Virhe",
        "confirm": "Vahvista",
        "dismiss": "Poistu",
        "confirm_button_text": "OK",
        "cancel_button_text": "Peruuta",
        "widget_remove_confirm": "Poista t\u00e4m\u00e4 vimpain?"
    },
    "datepicker": {
        "previousMonth": "Edellinen kuukausi",
        "nextMonth": "Seuraava kuukausi",
        "months": [
            "tammikuu",
            "helmikuu",
            "maaliskuu",
            "huhtikuu",
            "toukokuu",
            "kes\u00e4kuu",
            "hein\u00e4kuu",
            "elokuu",
            "syyskuu",
            "lokakuu",
            "marraskuu",
            "joulukuu"
        ],
        "weekdays": [
            "sunnutai",
            "maanantai",
            "tiistai",
            "keskiviikko",
            "torstai",
            "perjantai",
            "lauantai"
        ],
        "weekdaysShort": [
            "su",
            "ma",
            "ti",
            "ke",
            "to",
            "pe",
            "la"
        ]
    },
    "colorpicker": {
        "choose": "OK"
    },
    "filter": {
        "group": {
            "all": "kaikki"
        },
        "scopes": {
            "apply_button_text": "Ota k\u00e4ytt\u00f6\u00f6n",
            "clear_button_text": "Tyhjenn\u00e4"
        },
        "dates": {
            "all": "kaikki",
            "filter_button_text": "Suodata",
            "reset_button_text": "Palauta",
            "date_placeholder": "P\u00e4iv\u00e4",
            "after_placeholder": "J\u00e4lkeen",
            "before_placeholder": "Ennen"
        },
        "numbers": {
            "all": "kaikki",
            "filter_button_text": "Suodata",
            "reset_button_text": "Palauta",
            "min_placeholder": "V\u00e4h.",
            "max_placeholder": "Enint.",
            "number_placeholder": "N\u00famero"
        }
    },
    "eventlog": {
        "show_stacktrace": "N\u00e4yt\u00e4 stacktrace",
        "hide_stacktrace": "Piilota stacktrace",
        "tabs": {
            "formatted": "Muotoiltu",
            "raw": "Raaka"
        },
        "editor": {
            "title": "L\u00e4hdekoodieditori",
            "description": "K\u00e4ytt\u00f6j\u00e4rjestelm\u00e4si pit\u00e4isi olla m\u00e4\u00e4ritetty kuuntelemaan jotain n\u00e4ist\u00e4 URL osoitteista.",
            "openWith": "Avaa sovelluksessa",
            "remember_choice": "Muista valittu vaihtoehto istunnon ajan",
            "open": "Avaa",
            "cancel": "Peruuta",
            "rememberChoice": "Recuerde la opci\u00f3n seleccionada para esta sesi\u00f3n del navegador"
        }
    },
    "upload": {
        "max_files": "Et voi siirt\u00e4\u00e4 enemp\u00e4\u00e4 tiedostoja.",
        "invalid_file_type": "T\u00e4m\u00e4n tyypin tiedostot eiv\u00e4t ole sallittuja.",
        "file_too_big": "Tiedosto on liian iso ({{filesize}}MB). Suurin sallittu tiedostokoko on: {{maxFilesize}}MB.",
        "response_error": "Palvelin vastasi koodilla {{statusCode}}.",
        "remove_file": "Poista tiedosto"
    },
    "inspector": {
        "add": "Lis\u00e4\u00e4",
        "remove": "Poista",
        "key": "Avain",
        "value": "Arvo",
        "ok": "OK",
        "cancel": "Peruuta",
        "items": "Kohteet"
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


    var numbersPast = 'nolla yksi kaksi kolme neljä viisi kuusi seitsemän kahdeksan yhdeksän'.split(' '),
        numbersFuture = [
            'nolla', 'yhden', 'kahden', 'kolmen', 'neljän', 'viiden', 'kuuden',
            numbersPast[7], numbersPast[8], numbersPast[9]
        ];
    function translate(number, withoutSuffix, key, isFuture) {
        var result = '';
        switch (key) {
            case 's':
                return isFuture ? 'muutaman sekunnin' : 'muutama sekunti';
            case 'ss':
                return isFuture ? 'sekunnin' : 'sekuntia';
            case 'm':
                return isFuture ? 'minuutin' : 'minuutti';
            case 'mm':
                result = isFuture ? 'minuutin' : 'minuuttia';
                break;
            case 'h':
                return isFuture ? 'tunnin' : 'tunti';
            case 'hh':
                result = isFuture ? 'tunnin' : 'tuntia';
                break;
            case 'd':
                return isFuture ? 'päivän' : 'päivä';
            case 'dd':
                result = isFuture ? 'päivän' : 'päivää';
                break;
            case 'M':
                return isFuture ? 'kuukauden' : 'kuukausi';
            case 'MM':
                result = isFuture ? 'kuukauden' : 'kuukautta';
                break;
            case 'y':
                return isFuture ? 'vuoden' : 'vuosi';
            case 'yy':
                result = isFuture ? 'vuoden' : 'vuotta';
                break;
        }
        result = verbalNumber(number, isFuture) + ' ' + result;
        return result;
    }
    function verbalNumber(number, isFuture) {
        return number < 10 ? (isFuture ? numbersFuture[number] : numbersPast[number]) : number;
    }

    var fi = moment.defineLocale('fi', {
        months : 'tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu'.split('_'),
        monthsShort : 'tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu'.split('_'),
        weekdays : 'sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai'.split('_'),
        weekdaysShort : 'su_ma_ti_ke_to_pe_la'.split('_'),
        weekdaysMin : 'su_ma_ti_ke_to_pe_la'.split('_'),
        longDateFormat : {
            LT : 'HH.mm',
            LTS : 'HH.mm.ss',
            L : 'DD.MM.YYYY',
            LL : 'Do MMMM[ta] YYYY',
            LLL : 'Do MMMM[ta] YYYY, [klo] HH.mm',
            LLLL : 'dddd, Do MMMM[ta] YYYY, [klo] HH.mm',
            l : 'D.M.YYYY',
            ll : 'Do MMM YYYY',
            lll : 'Do MMM YYYY, [klo] HH.mm',
            llll : 'ddd, Do MMM YYYY, [klo] HH.mm'
        },
        calendar : {
            sameDay : '[tänään] [klo] LT',
            nextDay : '[huomenna] [klo] LT',
            nextWeek : 'dddd [klo] LT',
            lastDay : '[eilen] [klo] LT',
            lastWeek : '[viime] dddd[na] [klo] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : '%s päästä',
            past : '%s sitten',
            s : translate,
            ss : translate,
            m : translate,
            mm : translate,
            h : translate,
            hh : translate,
            d : translate,
            dd : translate,
            M : translate,
            MM : translate,
            y : translate,
            yy : translate
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return fi;

})));


/*! Select2 4.1.0-rc.0 | https://github.com/select2/select2/blob/master/LICENSE.md */

!function(){if(jQuery&&jQuery.fn&&jQuery.fn.select2&&jQuery.fn.select2.amd)var n=jQuery.fn.select2.amd;n.define("select2/i18n/fi",[],function(){return{errorLoading:function(){return"Tuloksia ei saatu ladattua."},inputTooLong:function(n){return"Ole hyvä ja anna "+(n.input.length-n.maximum)+" merkkiä vähemmän"},inputTooShort:function(n){return"Ole hyvä ja anna "+(n.minimum-n.input.length)+" merkkiä lisää"},loadingMore:function(){return"Ladataan lisää tuloksia…"},maximumSelected:function(n){return"Voit valita ainoastaan "+n.maximum+" kpl"},noResults:function(){return"Ei tuloksia"},searching:function(){return"Haetaan…"},removeAllItems:function(){return"Poista kaikki kohteet"}}}),n.define,n.require}();

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
 * Finnish
 */

if (!$.FE_LANGUAGE) {
    $.FE_LANGUAGE = {};
}

$.FE_LANGUAGE['fi'] = {
  translation: {
    // Place holder
    "Type something": "Kirjoita jotain",

    // Basic formatting
    "Bold": "Lihavointi",
    "Italic": "Kursivointi",
    "Underline": "Alleviivaus",
    "Strikethrough": "Yliviivaus",

    // Main buttons
    "Insert": "Lis\u00e4\u00e4",
    "Delete": "Poista",
    "Cancel": "Peruuta",
    "OK": "Ok",
    "Back": "Takaisin",
    "Remove": "Poista",
    "More": "Lis\u00e4\u00e4",
    "Update": "P\u00e4ivitys",
    "Style": "Tyyli",

    // Font
    "Font Family": "Fontti",
    "Font Size": "Fonttikoko",

    // Colors
    "Colors": "V\u00e4rit",
    "Background": "Taustan",
    "Text": "Tekstin",
    "HEX Color": "Heksadesimaali",

    // Paragraphs
    "Paragraph Format": "Muotoilut",
    "Normal": "Normaali",
    "Code": "Koodi",
    "Heading 1": "Otsikko 1",
    "Heading 2": "Otsikko 2",
    "Heading 3": "Otsikko 3",
    "Heading 4": "Otsikko 4",

    // Style
    "Paragraph Style": "Kappaleen tyyli",
    "Inline Style": "Linjassa tyyli",

    // Alignment
    "Align": "Tasaa",
    "Align Left": "Tasaa vasemmalle",
    "Align Center": "Keskit\u00e4",
    "Align Right": "Tasaa oikealle",
    "Align Justify": "Tasaa",
    "None": "Ei mit\u00e4\u00e4n",

    // Lists
    "Ordered List": "J\u00e4rjestetty lista",
    "Default": "Oletusarvo",
    "Lower Alpha": "Alempi alfa",
    "Lower Greek": "Alempi kreikka",
    "Lower Roman": "Alempi roomalainen",
    "Upper Alpha": "Ylempi alfa",
    "Upper Roman": "Ylempi roomalainen",

    "Unordered List": "J\u00e4rjest\u00e4m\u00e4t\u00f6n lista",
    "Circle": "Ympyrä",
    "Disc": "Levy",
    "Square": "Neliö-",

    // Line height
    "Line Height": "Viivankorkeus",
    "Single": "Yksittäinen",
    "Double": "Kaksinkertainen",

    // Indent
    "Decrease Indent": "Sisenn\u00e4",
    "Increase Indent": "Loitonna",

    // Links
    "Insert Link": "Lis\u00e4\u00e4 linkki",
    "Open in new tab": "Avaa uudessa v\u00e4lilehdess\u00e4",
    "Open Link": "Avaa linkki",
    "Edit Link": "Muokkaa linkki",
    "Unlink": "Poista linkki",
    "Choose Link": "Valitse linkki",

    // Images
    "Insert Image": "Lis\u00e4\u00e4 kuva",
    "Upload Image": "Lataa kuva",
    "By URL": "Mukaan URL",
    "Browse": "Selailla",
    "Drop image": "Pudota kuva",
    "or click": "tai napsauta",
    "Manage Images": "Hallitse kuvia",
    "Loading": "Lastaus",
    "Deleting": "Poistaminen",
    "Tags": "Tagit",
    "Are you sure? Image will be deleted.": "Oletko varma? Kuva poistetaan.",
    "Replace": "Vaihda",
    "Uploading": "Lataaminen",
    "Loading image": "Lastaus kuva",
    "Display": "N\u00e4ytt\u00e4",
    "Inline": "Linjassa",
    "Break Text": "Rikkoa teksti",
    "Alternative Text": "Vaihtoehtoinen teksti",
    "Change Size": "Muuta kokoa",
    "Width": "Leveys",
    "Height": "Korkeus",
    "Something went wrong. Please try again.": "Jotain meni pieleen. Yrit\u00e4 uudelleen.",
    "Image Caption": "Kuva-otsikko",
    "Advanced Edit": "Edistynyt muokkaus",

    // Video
    "Insert Video": "Lis\u00e4\u00e4 video",
    "Embedded Code": "Upotettu koodi",
    "Paste in a video URL": "Liitä video url",
    "Drop video": "Pudota video",
    "Your browser does not support HTML5 video.": "Selaimesi ei tue html5-videota.",
    "Upload Video": "Lataa video",

    // Tables
    "Insert Table": "Lis\u00e4\u00e4 taulukko",
    "Table Header": "Taulukko yl\u00e4tunniste",
    "Remove Table": "Poista taulukko",
    "Table Style": "Taulukko tyyli",
    "Horizontal Align": "Vaakasuora tasaa",
    "Row": "Rivi",
    "Insert row above": "Lis\u00e4\u00e4 rivi ennen",
    "Insert row below": "Lis\u00e4\u00e4 rivi j\u00e4lkeen",
    "Delete row": "Poista rivi",
    "Column": "Sarake",
    "Insert column before": "Lis\u00e4\u00e4 sarake ennen",
    "Insert column after": "Lis\u00e4\u00e4 sarake j\u00e4lkeen",
    "Delete column": "Poista sarake",
    "Cell": "Solu",
    "Merge cells": "Yhdist\u00e4 solut",
    "Horizontal split": "Jaa vaakasuora",
    "Vertical split": "Jaa pystysuora",
    "Cell Background": "Solun tausta",
    "Vertical Align": "Pystysuora tasaa",
    "Top": "Alku",
    "Middle": "Keskimm\u00e4inen",
    "Bottom": "Pohja",
    "Align Top": "Tasaa alkuun",
    "Align Middle": "Tasaa keskimm\u00e4inen",
    "Align Bottom": "Tasaa pohja",
    "Cell Style": "Solun tyyli",

    // Files
    "Upload File": "Lataa tiedosto",
    "Drop file": "Pudota tiedosto",

    // Emoticons
    "Emoticons": "Hymi\u00f6it\u00e4",
    "Grinning face": "Virnisteli kasvot",
    "Grinning face with smiling eyes": "Virnisteli kasvot hymyilev\u00e4t silm\u00e4t",
    "Face with tears of joy": "Kasvot ilon kyyneleit\u00e4",
    "Smiling face with open mouth": "Hymyilev\u00e4 kasvot suu auki",
    "Smiling face with open mouth and smiling eyes": "Hymyilev\u00e4 kasvot suu auki ja hymyilee silm\u00e4t",
    "Smiling face with open mouth and cold sweat": "Hymyilev\u00e4 kasvot suu auki ja kylm\u00e4 hiki",
    "Smiling face with open mouth and tightly-closed eyes": "Hymyilev\u00e4 kasvot suu auki ja tiiviisti suljettu silm\u00e4t",
    "Smiling face with halo": "Hymyilev\u00e4 kasvot Halo",
    "Smiling face with horns": "Hymyilev\u00e4 kasvot sarvet",
    "Winking face": "Silm\u00e4niskut kasvot",
    "Smiling face with smiling eyes": "Hymyilev\u00e4 kasvot hymyilev\u00e4t silm\u00e4t",
    "Face savoring delicious food": "Kasvot maistella herkullista ruokaa",
    "Relieved face": "Vapautettu kasvot",
    "Smiling face with heart-shaped eyes": "Hymyilev\u00e4t kasvot syd\u00e4men muotoinen silm\u00e4t",
    "Smiling face with sunglasses": "Hymyilev\u00e4 kasvot aurinkolasit",
    "Smirking face": "Hym\u00e4t\u00e4\u00e4 kasvot",
    "Neutral face": "Neutraali kasvot",
    "Expressionless face": "Ilmeet\u00f6n kasvot",
    "Unamused face": "Ei huvittanut kasvo",
    "Face with cold sweat": "Kasvot kylm\u00e4 hiki",
    "Pensive face": "Mietteli\u00e4s kasvot",
    "Confused face": "Sekava kasvot",
    "Confounded face": "Sekoitti kasvot",
    "Kissing face": "Suudella kasvot",
    "Face throwing a kiss": "Kasvo heitt\u00e4\u00e4 suudelma",
    "Kissing face with smiling eyes": "Suudella kasvot hymyilev\u00e4t silm\u00e4t",
    "Kissing face with closed eyes": "Suudella kasvot silm\u00e4t ummessa",
    "Face with stuck out tongue": "Kasvot ojensi kieli",
    "Face with stuck out tongue and winking eye": "Kasvot on juuttunut pois kielen ja silm\u00e4niskuja silm\u00e4",
    "Face with stuck out tongue and tightly-closed eyes": "Kasvot on juuttunut pois kielen ja tiiviisti suljettuna silm\u00e4t",
    "Disappointed face": "Pettynyt kasvot",
    "Worried face": "Huolissaan kasvot",
    "Angry face": "Vihainen kasvot",
    "Pouting face": "Pouting kasvot",
    "Crying face": "Itku kasvot",
    "Persevering face": "Pitk\u00e4j\u00e4nteinen kasvot",
    "Face with look of triumph": "Kasvot ilme Triumph",
    "Disappointed but relieved face": "Pettynyt mutta helpottunut kasvot",
    "Frowning face with open mouth": "Frowning kasvot suu auki",
    "Anguished face": "Tuskainen kasvot",
    "Fearful face": "Pelokkuus kasvot",
    "Weary face": "V\u00e4synyt kasvot",
    "Sleepy face": "Unelias kasvot",
    "Tired face": "V\u00e4synyt kasvot",
    "Grimacing face": "Irvist\u00e4en kasvot",
    "Loudly crying face": "\u00e4\u00e4nekk\u00e4\u00e4sti itku kasvot",
    "Face with open mouth": "Kasvot suu auki",
    "Hushed face": "Hiljentynyt kasvot",
    "Face with open mouth and cold sweat": "Kasvot suu auki ja kylm\u00e4 hiki",
    "Face screaming in fear": "Kasvot huutaa pelosta",
    "Astonished face": "H\u00e4mm\u00e4stynyt kasvot",
    "Flushed face": "Kasvojen punoitus",
    "Sleeping face": "Nukkuva kasvot",
    "Dizzy face": "Huimausta kasvot",
    "Face without mouth": "Kasvot ilman suuhun",
    "Face with medical mask": "Kasvot l\u00e4\u00e4ketieteen naamio",

    // Line breaker
    "Break": "Rikkoa",

    // Math
    "Subscript": "Alaindeksi",
    "Superscript": "Yl\u00e4indeksi",

    // Full screen
    "Fullscreen": "Koko n\u00e4ytt\u00f6",

    // Horizontal line
    "Insert Horizontal Line": "Lis\u00e4\u00e4 vaakasuora viiva",

    // Clear formatting
    "Clear Formatting": "Poista muotoilu",

    // Save
    "Save": "Tallentaa",

    // Undo, redo
    "Undo": "Peru",
    "Redo": "Tee uudelleen",

    // Select all
    "Select All": "Valitse kaikki",

    // Code view
    "Code View": "Koodi n\u00e4kym\u00e4",

    // Quote
    "Quote": "Lainaus",
    "Increase": "Lis\u00e4t\u00e4",
    "Decrease": "Pienenn\u00e4",

    // Quick Insert
    "Quick Insert": "Nopea insertti",

    // Spcial Characters
    "Special Characters": "Erikoismerkkejä",
    "Latin": "Latina",
    "Greek": "Kreikkalainen",
    "Cyrillic": "Kyrillinen",
    "Punctuation": "Välimerkit",
    "Currency": "Valuutta",
    "Arrows": "Nuolet",
    "Math": "Matematiikka",
    "Misc": "Sekalaista",

    // Print.
    "Print": "Tulosta",

    // Spell Checker.
    "Spell Checker": "Oikeinkirjoittaja",

    // Help
    "Help": "Auta",
    "Shortcuts": "Pikakuvakkeet",
    "Inline Editor": "Inline-editori",
    "Show the editor": "Näytä editori",
    "Common actions": "Yhteisiä toimia",
    "Copy": "Kopio",
    "Cut": "Leikata",
    "Paste": "Tahna",
    "Basic Formatting": "Perusmuotoilu",
    "Increase quote level": "Lisää lainaustasoa",
    "Decrease quote level": "Laskea lainaustasoa",
    "Image / Video": "Kuva / video",
    "Resize larger": "Kokoa suurempi",
    "Resize smaller": "Pienempi koko",
    "Table": "Pöytä",
    "Select table cell": "Valitse taulukon solu",
    "Extend selection one cell": "Laajentaa valinta yhden solun",
    "Extend selection one row": "Laajenna valinta yksi rivi",
    "Navigation": "Suunnistus",
    "Focus popup / toolbar": "Painopistevalo / työkalurivi",
    "Return focus to previous position": "Palauta tarkennus edelliseen asentoon",

    // Embed.ly
    "Embed URL": "Upottaa URL-osoite",
    "Paste in a URL to embed": "Liitä upotettu URL-osoite",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "Liitetty sisältö tulee Microsoft Word -asiakirjasta. Haluatko säilyttää muodon tai puhdistaa sen?",
    "Keep": "Pitää",
    "Clean": "Puhdas",
    "Word Paste Detected": "Sana-tahna havaittu"
  },
  direction: "ltr"
};

}));

