/*
 * This file has been compiled from: /modules/system/lang/de/client.php
 */
if (!window.oc) {
    window.oc = {};
}

if (!window.oc.langMessages) {
    window.oc.langMessages = {};
}

window.oc.langMessages['de'] = $.extend(
    window.oc.langMessages['de'] || {},
    {
    "markdowneditor": {
        "formatting": "Formatierung",
        "quote": "Zitat",
        "code": "Code",
        "header1": "\u00dcberschrift 1",
        "header2": "\u00dcberschrift 2",
        "header3": "\u00dcberschrift 3",
        "header4": "\u00dcberschrift 4",
        "header5": "\u00dcberschrift 5",
        "header6": "\u00dcberschrift 6",
        "bold": "Fett",
        "italic": "Kursiv",
        "unorderedlist": "Normale Liste",
        "orderedlist": "Nummerierte Liste",
        "snippet": "Snippet",
        "video": "Video",
        "image": "Bild",
        "link": "Link",
        "horizontalrule": "Horizontale Linie",
        "fullscreen": "Vollbild",
        "preview": "Vorschau",
        "strikethrough": "Strikethrough",
        "cleanblock": "Clean Block",
        "table": "Table",
        "sidebyside": "Side by Side"
    },
    "mediamanager": {
        "insert_link": "Link aus Medienbibliothek",
        "insert_image": "Bild aus Medienbibliothek",
        "insert_video": "Video aus Medienbibliothek",
        "insert_audio": "Audio aus Medienbibliothek",
        "invalid_file_empty_insert": "Bitte Datei ausw\u00e4hlen.",
        "invalid_file_single_insert": "Bitte nur eine Datei w\u00e4hlen.",
        "invalid_image_empty_insert": "Bitte ein Bild ausw\u00e4hlen.",
        "invalid_video_empty_insert": "Bitte ein Video ausw\u00e4hlen.",
        "invalid_audio_empty_insert": "Bitte eine Audiodatei ausw\u00e4hlen."
    },
    "alert": {
        "error": "Error",
        "confirm": "Confirm",
        "dismiss": "Dismiss",
        "confirm_button_text": "OK",
        "cancel_button_text": "Abbrechen",
        "widget_remove_confirm": "Remove this widget?"
    },
    "datepicker": {
        "previousMonth": "Vorheriger Monat",
        "nextMonth": "N\u00e4chsten Monat",
        "months": [
            "Januar",
            "Februar",
            "M\u00e4rz",
            "April",
            "Mai",
            "Juni",
            "Juli",
            "August",
            "September",
            "Oktober",
            "November",
            "Dezember"
        ],
        "weekdays": [
            "Sonntag",
            "Montag",
            "Dienstag",
            "Mittwoch",
            "Donnerstag",
            "Freitag",
            "Samstag"
        ],
        "weekdaysShort": [
            "So",
            "Mo",
            "Di",
            "Mi",
            "Do",
            "Fr",
            "Sa"
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


    function processRelativeTime(number, withoutSuffix, key, isFuture) {
        var format = {
            'm': ['eine Minute', 'einer Minute'],
            'h': ['eine Stunde', 'einer Stunde'],
            'd': ['ein Tag', 'einem Tag'],
            'dd': [number + ' Tage', number + ' Tagen'],
            'M': ['ein Monat', 'einem Monat'],
            'MM': [number + ' Monate', number + ' Monaten'],
            'y': ['ein Jahr', 'einem Jahr'],
            'yy': [number + ' Jahre', number + ' Jahren']
        };
        return withoutSuffix ? format[key][0] : format[key][1];
    }

    var de = moment.defineLocale('de', {
        months : 'Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
        monthsShort : 'Jan._Feb._März_Apr._Mai_Juni_Juli_Aug._Sep._Okt._Nov._Dez.'.split('_'),
        monthsParseExact : true,
        weekdays : 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
        weekdaysShort : 'So._Mo._Di._Mi._Do._Fr._Sa.'.split('_'),
        weekdaysMin : 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D. MMMM YYYY',
            LLL : 'D. MMMM YYYY HH:mm',
            LLLL : 'dddd, D. MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay: '[heute um] LT [Uhr]',
            sameElse: 'L',
            nextDay: '[morgen um] LT [Uhr]',
            nextWeek: 'dddd [um] LT [Uhr]',
            lastDay: '[gestern um] LT [Uhr]',
            lastWeek: '[letzten] dddd [um] LT [Uhr]'
        },
        relativeTime : {
            future : 'in %s',
            past : 'vor %s',
            s : 'ein paar Sekunden',
            ss : '%d Sekunden',
            m : processRelativeTime,
            mm : '%d Minuten',
            h : processRelativeTime,
            hh : '%d Stunden',
            d : processRelativeTime,
            dd : processRelativeTime,
            M : processRelativeTime,
            MM : processRelativeTime,
            y : processRelativeTime,
            yy : processRelativeTime
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return de;

})));


/*! Select2 4.1.0-rc.0 | https://github.com/select2/select2/blob/master/LICENSE.md */

!function(){if(jQuery&&jQuery.fn&&jQuery.fn.select2&&jQuery.fn.select2.amd)var e=jQuery.fn.select2.amd;e.define("select2/i18n/de",[],function(){return{errorLoading:function(){return"Die Ergebnisse konnten nicht geladen werden."},inputTooLong:function(e){return"Bitte "+(e.input.length-e.maximum)+" Zeichen weniger eingeben"},inputTooShort:function(e){return"Bitte "+(e.minimum-e.input.length)+" Zeichen mehr eingeben"},loadingMore:function(){return"Lade mehr Ergebnisse…"},maximumSelected:function(e){var n="Sie können nur "+e.maximum+" Element";return 1!=e.maximum&&(n+="e"),n+=" auswählen"},noResults:function(){return"Keine Übereinstimmungen gefunden"},searching:function(){return"Suche…"},removeAllItems:function(){return"Entferne alle Elemente"}}}),e.define,e.require}();

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
 * German
 */

if (!$.FE_LANGUAGE) {
    $.FE_LANGUAGE = {};
}

$.FE_LANGUAGE['de'] = {
  translation: {
    // Place holder
    "Type something": "Hier tippen",

    // Basic formatting
    "Bold": "Fett",
    "Italic": "Kursiv",
    "Underline": "Unterstrichen",
    "Strikethrough": "Durchgestrichen",

    // Main buttons
    "Insert": "Einfügen",
    "Delete": "Löschen",
    "Cancel": "Abbrechen",
    "OK": "OK",
    "Back": "Zurück",
    "Remove": "Entfernen",
    "More": "Mehr",
    "Update": "Aktualisieren",
    "Style": "Stil",

    // Font
    "Font Family": "Schriftart",
    "Font Size": "Schriftgröße",

    // Colors
    "Colors": "Farben",
    "Background": "Hintergrund",
    "Text": "Text",
    "HEX Color": "Hexadezimaler Farbwert",

    // Paragraphs
    "Paragraph Format": "Formatierung",
    "Normal": "Normal",
    "Code": "Quelltext",
    "Heading 1": "Überschrift 1",
    "Heading 2": "Überschrift 2",
    "Heading 3": "Überschrift 3",
    "Heading 4": "Überschrift 4",

    // Style
    "Paragraph Style": "Absatzformatierung",
    "Inline Style": "Inlineformatierung",

    // Alignment
    "Align": "Ausrichtung",
    "Align Left": "Linksbündig ausrichten",
    "Align Center": "Zentriert ausrichten",
    "Align Right": "Rechtsbündig ausrichten",
    "Align Justify": "Blocksatz",
    "None": "Keine",

    // Lists
    "Ordered List": "Nummerierte Liste",
    "Default": "Standard",
    "Lower Alpha": "Kleinbuchstaben",
    "Lower Greek": "Griechisches Alphabet",
    "Lower Roman": "Römische Ziffern (klein)",
    "Upper Alpha": "Grossbuchstaben",
    "Upper Roman": "Römische Ziffern (gross)",

    "Unordered List": "Unnummerierte Liste",
    "Circle": "Kreis",
    "Disc": "Kreis gefüllt",
    "Square": "Quadrat",

    // Line height
    "Line Height": "Zeilenhöhe",
    "Single": "Einfach",
    "Double": "Doppelt",

    // Indent
    "Decrease Indent": "Einzug verkleinern",
    "Increase Indent": "Einzug vergrößern",

    // Links
    "Insert Link": "Link einfügen",
    "Open in new tab": "In neuem Tab öffnen",
    "Open Link": "Link öffnen",
    "Edit Link": "Link bearbeiten",
    "Unlink": "Link entfernen",
    "Choose Link": "Einen Link auswählen",

    // Images
    "Insert Image": "Bild einfügen",
    "Upload Image": "Bild hochladen",
    "By URL": "Von URL",
    "Browse": "Durchsuchen",
    "Drop image": "Bild hineinziehen",
    "or click": "oder hier klicken",
    "Manage Images": "Bilder verwalten",
    "Loading": "Laden",
    "Deleting": "Löschen",
    "Tags": "Tags",
    "Are you sure? Image will be deleted.": "Wollen Sie das Bild wirklich löschen?",
    "Replace": "Ersetzen",
    "Uploading": "Hochladen",
    "Loading image": "Das Bild wird geladen",
    "Display": "Textausrichtung",
    "Inline": "Mit Text in einer Zeile",
    "Break Text": "Text umbrechen",
    "Alternative Text": "Alternativtext",
    "Change Size": "Größe ändern",
    "Width": "Breite",
    "Height": "Höhe",
    "Something went wrong. Please try again.": "Etwas ist schief gelaufen. Bitte versuchen Sie es erneut.",
    "Image Caption": "Bildbeschreibung",
    "Advanced Edit": "Erweiterte Bearbeitung",

    // Video
    "Insert Video": "Video einfügen",
    "Embedded Code": "Eingebetteter Code",
    "Paste in a video URL": "Fügen Sie die Video-URL ein",
    "Drop video": "Video hineinziehen",
    "Your browser does not support HTML5 video.": "Ihr Browser unterstützt keine HTML5-Videos.",
    "Upload Video": "Video hochladen",

    // Tables
    "Insert Table": "Tabelle einfügen",
    "Table Header": "Tabellenkopf",
    "Remove Table": "Tabelle entfernen",
    "Table Style": "Tabellenformatierung",
    "Horizontal Align": "Horizontale Ausrichtung",
    "Row": "Zeile",
    "Insert row above": "Neue Zeile davor einfügen",
    "Insert row below": "Neue Zeile danach einfügen",
    "Delete row": "Zeile löschen",
    "Column": "Spalte",
    "Insert column before": "Neue Spalte davor einfügen",
    "Insert column after": "Neue Spalte danach einfügen",
    "Delete column": "Spalte löschen",
    "Cell": "Zelle",
    "Merge cells": "Zellen verbinden",
    "Horizontal split": "Horizontal teilen",
    "Vertical split": "Vertikal teilen",
    "Cell Background": "Zellenfarbe",
    "Vertical Align": "Vertikale Ausrichtung",
    "Top": "Oben",
    "Middle": "Zentriert",
    "Bottom": "Unten",
    "Align Top": "Oben ausrichten",
    "Align Middle": "Zentriert ausrichten",
    "Align Bottom": "Unten ausrichten",
    "Cell Style": "Zellen-Stil",

    // Files
    "Upload File": "Datei hochladen",
    "Drop file": "Datei hineinziehen",

    // Emoticons
    "Emoticons": "Emoticons",
    "Grinning face": "Grinsendes Gesicht",
    "Grinning face with smiling eyes": "Grinsend Gesicht mit lächelnden Augen",
    "Face with tears of joy": "Gesicht mit Tränen der Freude",
    "Smiling face with open mouth": "Lächelndes Gesicht mit offenem Mund",
    "Smiling face with open mouth and smiling eyes": "Lächelndes Gesicht mit offenem Mund und lächelnden Augen",
    "Smiling face with open mouth and cold sweat": "Lächelndes Gesicht mit offenem Mund und kaltem Schweiß",
    "Smiling face with open mouth and tightly-closed eyes": "Lächelndes Gesicht mit offenem Mund und fest geschlossenen Augen",
    "Smiling face with halo": "Lächeln Gesicht mit Heiligenschein",
    "Smiling face with horns": "Lächeln Gesicht mit Hörnern",
    "Winking face": "Zwinkerndes Gesicht",
    "Smiling face with smiling eyes": "Lächelndes Gesicht mit lächelnden Augen",
    "Face savoring delicious food": "Gesicht leckeres Essen genießend",
    "Relieved face": "Erleichtertes Gesicht",
    "Smiling face with heart-shaped eyes": "Lächelndes Gesicht mit herzförmigen Augen",
    "Smiling face with sunglasses": "Lächelndes Gesicht mit Sonnenbrille",
    "Smirking face": "Grinsendes Gesicht",
    "Neutral face": "Neutrales Gesicht",
    "Expressionless face": "Ausdrucksloses Gesicht",
    "Unamused face": "Genervtes Gesicht",
    "Face with cold sweat": "Gesicht mit kaltem Schweiß",
    "Pensive face": "Nachdenkliches Gesicht",
    "Confused face": "Verwirrtes Gesicht",
    "Confounded face": "Elendes Gesicht",
    "Kissing face": "Küssendes Gesicht",
    "Face throwing a kiss": "Gesicht wirft einen Kuss",
    "Kissing face with smiling eyes": "Küssendes Gesicht mit lächelnden Augen",
    "Kissing face with closed eyes": "Küssendes Gesicht mit geschlossenen Augen",
    "Face with stuck out tongue": "Gesicht mit herausgestreckter Zunge",
    "Face with stuck out tongue and winking eye": "Gesicht mit herausgestreckter Zunge und zwinkerndem Auge",
    "Face with stuck out tongue and tightly-closed eyes": "Gesicht mit herausgestreckter Zunge und fest geschlossenen Augen",
    "Disappointed face": "Enttäuschtes Gesicht",
    "Worried face": "Besorgtes Gesicht",
    "Angry face": "Verärgertes Gesicht",
    "Pouting face": "Schmollendes Gesicht",
    "Crying face": "Weinendes Gesicht",
    "Persevering face": "Ausharrendes Gesicht",
    "Face with look of triumph": "Gesicht mit triumphierenden Blick",
    "Disappointed but relieved face": "Enttäuschtes, aber erleichtertes Gesicht",
    "Frowning face with open mouth": "Entsetztes Gesicht mit offenem Mund",
    "Anguished face": "Gequältes Gesicht",
    "Fearful face": "Angstvolles Gesicht",
    "Weary face": "Müdes Gesicht",
    "Sleepy face": "Schläfriges Gesicht",
    "Tired face": "Gähnendes Gesicht",
    "Grimacing face": "Grimassenschneidendes Gesicht",
    "Loudly crying face": "Laut weinendes Gesicht",
    "Face with open mouth": "Gesicht mit offenem Mund",
    "Hushed face": "Besorgtes Gesicht mit offenem Mund",
    "Face with open mouth and cold sweat": "Gesicht mit offenem Mund und kaltem Schweiß",
    "Face screaming in fear": "Vor Angst schreiendes Gesicht",
    "Astonished face": "Erstauntes Gesicht",
    "Flushed face": "Gerötetes Gesicht",
    "Sleeping face": "Schlafendes Gesicht",
    "Dizzy face": "Schwindliges Gesicht",
    "Face without mouth": "Gesicht ohne Mund",
    "Face with medical mask": "Gesicht mit Mundschutz",

    // Line breaker
    "Break": "Zeilenumbruch",

    // Math
    "Subscript": "Tiefgestellt",
    "Superscript": "Hochgestellt",

    // Full screen
    "Fullscreen": "Vollbild",

    // Horizontal line
    "Insert Horizontal Line": "Horizontale Linie einfügen",

    // Clear formatting
    "Clear Formatting": "Formatierung löschen",

    // Save
    "Save": "Sparen",

    // Undo, redo
    "Undo": "Rückgängig",
    "Redo": "Wiederholen",

    // Select all
    "Select All": "Alles auswählen",

    // Code view
    "Code View": "Code-Ansicht",

    // Quote
    "Quote": "Zitieren",
    "Increase": "Vergrößern",
    "Decrease": "Verkleinern",

    // Quick Insert
    "Quick Insert": "Schnell einfügen",

    // Spcial Characters
    "Special Characters": "Sonderzeichen",
    "Latin": "Lateinisch",
    "Greek": "Griechisch",
    "Cyrillic": "Kyrillisch",
    "Punctuation": "Satzzeichen",
    "Currency": "Währung",
    "Arrows": "Pfeile",
    "Math": "Mathematik",
    "Misc": "Sonstige",

    // Print.
    "Print": "Drucken",

    // Spell Checker.
    "Spell Checker": "Rechtschreibprüfung",

    // Help
    "Help": "Hilfe",
    "Shortcuts": "Verknüpfungen",
    "Inline Editor": "Inline-Editor",
    "Show the editor": "Editor anzeigen",
    "Common actions": "Häufig verwendete Befehle",
    "Copy": "Kopieren",
    "Cut": "Ausschneiden",
    "Paste": "Einfügen",
    "Basic Formatting": "Grundformatierung",
    "Increase quote level": "Zitatniveau erhöhen",
    "Decrease quote level": "Zitatniveau verringern",
    "Image / Video": "Bild / Video",
    "Resize larger": "Vergrößern",
    "Resize smaller": "Verkleinern",
    "Table": "Tabelle",
    "Select table cell": "Tabellenzelle auswählen",
    "Extend selection one cell": "Erweitere Auswahl um eine Zelle",
    "Extend selection one row": "Erweitere Auswahl um eine Zeile",
    "Navigation": "Navigation",
    "Focus popup / toolbar": "Fokus-Popup / Symbolleiste",
    "Return focus to previous position": "Fokus auf vorherige Position",

    // Embed.ly
    "Embed URL": "URL einbetten",
    "Paste in a URL to embed": "URL einfügen um sie einzubetten",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "Der eingefügte Inhalt kommt aus einem Microsoft Word-Dokument. Möchten Sie die Formatierungen behalten oder verwerfen?",
    "Keep": "Behalten",
    "Clean": "Bereinigen",
    "Word Paste Detected": "Aus Word einfügen"
  },
  direction: "ltr"
};

}));

