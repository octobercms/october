/*
 * This file has been compiled from: /modules/system/lang/es/client.php
 */
if (!window.oc) {
    window.oc = {};
}

if (!window.oc.langMessages) {
    window.oc.langMessages = {};
}

window.oc.langMessages['es'] = $.extend(
    window.oc.langMessages['es'] || {},
    {
    "markdowneditor": {
        "formatting": "Formateo",
        "quote": "Cita",
        "code": "C\u00f3digo",
        "header1": "Encabezado 1",
        "header2": "Encabezado 2",
        "header3": "Encabezado 3",
        "header4": "Encabezado 4",
        "header5": "Encabezado 5",
        "header6": "Encabezado 6",
        "bold": "Negrita",
        "italic": "Cursiva",
        "unorderedlist": "Lista Desordenada",
        "orderedlist": "Lista Ordenada",
        "snippet": "Snippet",
        "video": "Video",
        "image": "Imagen",
        "link": "V\u00ednculo",
        "horizontalrule": "Insertar Regla Horizontal",
        "fullscreen": "Pantalla completa",
        "preview": "Previsualizar",
        "strikethrough": "Strikethrough",
        "cleanblock": "Clean Block",
        "table": "Table",
        "sidebyside": "Side by Side"
    },
    "mediamanager": {
        "insert_link": "Insertar Media V\u00ednculo",
        "insert_image": "Insertar Media Imagen",
        "insert_video": "Insertar Media Video",
        "insert_audio": "Insertar Media Audio",
        "invalid_file_empty_insert": "Por favor seleccione archivo para insertar v\u00ednculo.",
        "invalid_file_single_insert": "Por favor seleccione un solo archivo.",
        "invalid_image_empty_insert": "Por favor seleccione una imagen(es) para insertar.",
        "invalid_video_empty_insert": "Por favor seleccione un archivo de video para insertar.",
        "invalid_audio_empty_insert": "Por favor seleccione un archivo de audio para insertar."
    },
    "alert": {
        "error": "Error",
        "confirm": "Confirm",
        "dismiss": "Dismiss",
        "confirm_button_text": "OK",
        "cancel_button_text": "Cancelar",
        "widget_remove_confirm": "Remove this widget?"
    },
    "datepicker": {
        "previousMonth": "Mes Anterior",
        "nextMonth": "Mes Siguiente",
        "months": [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre"
        ],
        "weekdays": [
            "Domingo",
            "Lunes",
            "Martes",
            "Miercoles",
            "Jueves",
            "Viernes",
            "Sabado"
        ],
        "weekdaysShort": [
            "Dom",
            "Lun",
            "Mar",
            "Mie",
            "Jue",
            "Vie",
            "Sab"
        ]
    },
    "colorpicker": {
        "choose": "OK"
    },
    "filter": {
        "group": {
            "all": "todos"
        },
        "scopes": {
            "apply_button_text": "Aplicar",
            "clear_button_text": "Limpiar"
        },
        "dates": {
            "all": "todas",
            "filter_button_text": "Filtrar",
            "reset_button_text": "Restablecer",
            "date_placeholder": "Fecha",
            "after_placeholder": "Desde",
            "before_placeholder": "Hasta"
        },
        "numbers": {
            "all": "todos",
            "filter_button_text": "Filtrar",
            "reset_button_text": "Restablecer",
            "min_placeholder": "M\u00ednimo",
            "max_placeholder": "M\u00e1ximo",
            "number_placeholder": "N\u00famero"
        }
    },
    "eventlog": {
        "show_stacktrace": "Mostrar el seguimiento de la pila",
        "hide_stacktrace": "Ocultar el seguimiento de la pila",
        "tabs": {
            "formatted": "Formateado",
            "raw": "Sin formato"
        },
        "editor": {
            "title": "Seleccione el editor de c\u00f3digo fuente a usar",
            "description": "Su entorno de sistema operativo debe estar configurado para escuchar a uno de estos esquemas de URL.",
            "openWith": "Abrir con",
            "remember_choice": "Remember selected option for this session",
            "open": "Abrir",
            "cancel": "Cancelar",
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


    var monthsShortDot = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_'),
        monthsShort = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_');

    var monthsParse = [/^ene/i, /^feb/i, /^mar/i, /^abr/i, /^may/i, /^jun/i, /^jul/i, /^ago/i, /^sep/i, /^oct/i, /^nov/i, /^dic/i];
    var monthsRegex = /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i;

    var es = moment.defineLocale('es', {
        months : 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
        monthsShort : function (m, format) {
            if (!m) {
                return monthsShortDot;
            } else if (/-MMM-/.test(format)) {
                return monthsShort[m.month()];
            } else {
                return monthsShortDot[m.month()];
            }
        },
        monthsRegex : monthsRegex,
        monthsShortRegex : monthsRegex,
        monthsStrictRegex : /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,
        monthsShortStrictRegex : /^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,
        monthsParse : monthsParse,
        longMonthsParse : monthsParse,
        shortMonthsParse : monthsParse,
        weekdays : 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
        weekdaysShort : 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
        weekdaysMin : 'do_lu_ma_mi_ju_vi_sá'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'H:mm',
            LTS : 'H:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D [de] MMMM [de] YYYY',
            LLL : 'D [de] MMMM [de] YYYY H:mm',
            LLLL : 'dddd, D [de] MMMM [de] YYYY H:mm'
        },
        calendar : {
            sameDay : function () {
                return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
            },
            nextDay : function () {
                return '[mañana a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
            },
            nextWeek : function () {
                return 'dddd [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
            },
            lastDay : function () {
                return '[ayer a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
            },
            lastWeek : function () {
                return '[el] dddd [pasado a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
            },
            sameElse : 'L'
        },
        relativeTime : {
            future : 'en %s',
            past : 'hace %s',
            s : 'unos segundos',
            ss : '%d segundos',
            m : 'un minuto',
            mm : '%d minutos',
            h : 'una hora',
            hh : '%d horas',
            d : 'un día',
            dd : '%d días',
            M : 'un mes',
            MM : '%d meses',
            y : 'un año',
            yy : '%d años'
        },
        dayOfMonthOrdinalParse : /\d{1,2}º/,
        ordinal : '%dº',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return es;

})));


/*! Select2 4.1.0-rc.0 | https://github.com/select2/select2/blob/master/LICENSE.md */

!function(){if(jQuery&&jQuery.fn&&jQuery.fn.select2&&jQuery.fn.select2.amd)var e=jQuery.fn.select2.amd;e.define("select2/i18n/es",[],function(){return{errorLoading:function(){return"No se pudieron cargar los resultados"},inputTooLong:function(e){var n=e.input.length-e.maximum,r="Por favor, elimine "+n+" car";return r+=1==n?"ácter":"acteres"},inputTooShort:function(e){var n=e.minimum-e.input.length,r="Por favor, introduzca "+n+" car";return r+=1==n?"ácter":"acteres"},loadingMore:function(){return"Cargando más resultados…"},maximumSelected:function(e){var n="Sólo puede seleccionar "+e.maximum+" elemento";return 1!=e.maximum&&(n+="s"),n},noResults:function(){return"No se encontraron resultados"},searching:function(){return"Buscando…"},removeAllItems:function(){return"Eliminar todos los elementos"}}}),e.define,e.require}();

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
 * Spanish
 */

if (!$.FE_LANGUAGE) {
    $.FE_LANGUAGE = {};
}

$.FE_LANGUAGE['es'] = {
  translation: {
    // Place holder
    "Type something": "Escriba algo",

    // Basic formatting
    "Bold": "Negrita",
    "Italic": "It\u00e1lica",
    "Underline": "Subrayado",
    "Strikethrough": "Tachado",

    // Main buttons
    "Insert": "Insertar",
    "Delete": "Borrar",
    "Cancel": "Cancelar",
    "OK": "Ok",
    "Back": "Atr\u00e1s",
    "Remove": "Quitar",
    "More": "M\u00e1s",
    "Update": "Actualizaci\u00f3n",
    "Style": "Estilo",

    // Font
    "Font Family": "Familia de fuentes",
    "Font Size": "Tama\u00f1o de fuente",

    // Colors
    "Colors": "Colores",
    "Background": "Fondo",
    "Text": "Texto",
    "HEX Color": "Color hexadecimal",

    // Paragraphs
    "Paragraph Format": "Formato de p\u00e1rrafo",
    "Normal": "Normal",
    "Code": "C\u00f3digo",
    "Heading 1": "Encabezado 1",
    "Heading 2": "Encabezado 2",
    "Heading 3": "Encabezado 3",
    "Heading 4": "Encabezado 4",

    // Style
    "Paragraph Style": "Estilo de p\u00e1rrafo",
    "Inline Style": "Estilo en l\u00ednea",

    // Alignment
    "Align": "Alinear",
    "Align Left": "Alinear a la izquierda",
    "Align Center": "Alinear al centro",
    "Align Right": "Alinear a la derecha",
    "Align Justify": "Justificar",
    "None": "Ninguno",

    // Lists
    "Ordered List": "Lista ordenada",
    "Default": "Defecto",
    "Lower Alpha": "Alfa inferior",
    "Lower Greek": "Griego inferior",
    "Lower Roman": "Baja romana",
    "Upper Alpha": "Alfa superior",
    "Upper Roman": "Romano superior",

    "Unordered List": "Lista desordenada",
    "Circle": "Circulo",
    "Disc": "Dto",
    "Square": "Cuadrado",

    // Line height
    "Line Height": "Altura de la línea",
    "Single": "Soltero",
    "Double": "Doble",

    // Indent
    "Decrease Indent": "Reducir sangr\u00eda",
    "Increase Indent": "Aumentar sangr\u00eda",

    // Links
    "Insert Link": "Insertar enlace",
    "Open in new tab": "Abrir en una nueva pesta\u00F1a",
    "Open Link": "Abrir enlace",
    "Edit Link": "Editar enlace",
    "Unlink": "Quitar enlace",
    "Choose Link": "Elegir enlace",

    // Images
    "Insert Image": "Insertar imagen",
    "Upload Image": "Cargar imagen",
    "By URL": "Por URL",
    "Browse": "Examinar",
    "Drop image": "Soltar la imagen",
    "or click": "o haga clic en",
    "Manage Images": "Administrar im\u00e1genes",
    "Loading": "Cargando",
    "Deleting": "Borrado",
    "Tags": "Etiquetas",
    "Are you sure? Image will be deleted.": "\u00bfEst\u00e1 seguro? Imagen ser\u00e1 borrada.",
    "Replace": "Reemplazar",
    "Uploading": "Carga",
    "Loading image": "Cargando imagen",
    "Display": "Mostrar",
    "Inline": "En l\u00ednea",
    "Break Text": "Romper texto",
    "Alternative Text": "Texto alternativo",
    "Change Size": "Cambiar tama\u00f1o",
    "Width": "Ancho",
    "Height": "Altura",
    "Something went wrong. Please try again.": "Algo sali\u00f3 mal. Por favor, vuelva a intentarlo.",
    "Image Caption": "Captura de imagen",
    "Advanced Edit": "Edición avanzada",

    // Video
    "Insert Video": "Insertar video",
    "Embedded Code": "C\u00f3digo incrustado",
    "Paste in a video URL": "Pegar en una URL de video",
    "Drop video": "Soltar video",
    "Your browser does not support HTML5 video.": "Su navegador no es compatible con video html5.",
    "Upload Video": "Subir video",

    // Tables
    "Insert Table": "Insertar tabla",
    "Table Header": "Encabezado de la tabla",
    "Remove Table": "Retire la tabla",
    "Table Style": "Estilo de tabla",
    "Horizontal Align": "Alinear horizontal",
    "Row": "Fila",
    "Insert row above": "Insertar fila antes",
    "Insert row below": "Insertar fila despu\u00e9s",
    "Delete row": "Eliminar fila",
    "Column": "Columna",
    "Insert column before": "Insertar columna antes",
    "Insert column after": "Insertar columna despu\u00e9s",
    "Delete column": "Eliminar columna",
    "Cell": "Celda",
    "Merge cells": "Combinar celdas",
    "Horizontal split": "Divisi\u00f3n horizontal",
    "Vertical split": "Divisi\u00f3n vertical",
    "Cell Background": "Fondo de la celda",
    "Vertical Align": "Alinear vertical",
    "Top": "Cima",
    "Middle": "Medio",
    "Bottom": "Del fondo",
    "Align Top": "Alinear a la parte superior",
    "Align Middle": "Alinear media",
    "Align Bottom": "Alinear abajo",
    "Cell Style": "Estilo de celda",

    // Files
    "Upload File": "Subir archivo",
    "Drop file": "Soltar archivo",

    // Emoticons
    "Emoticons": "Emoticones",
    "Grinning face": "Sonriendo cara",
    "Grinning face with smiling eyes": "Sonriendo cara con ojos sonrientes",
    "Face with tears of joy": "Cara con l\u00e1grimas de alegr\u00eda",
    "Smiling face with open mouth": "Cara sonriente con la boca abierta",
    "Smiling face with open mouth and smiling eyes": "Cara sonriente con la boca abierta y los ojos sonrientes",
    "Smiling face with open mouth and cold sweat": "Cara sonriente con la boca abierta y el sudor fr\u00edo",
    "Smiling face with open mouth and tightly-closed eyes": "Cara sonriente con la boca abierta y los ojos fuertemente cerrados",
    "Smiling face with halo": "Cara sonriente con halo",
    "Smiling face with horns": "Cara sonriente con cuernos",
    "Winking face": "Gui\u00f1o de la cara",
    "Smiling face with smiling eyes": "Cara sonriente con ojos sonrientes",
    "Face savoring delicious food": "Care saborear una deliciosa comida",
    "Relieved face": "Cara Aliviado",
    "Smiling face with heart-shaped eyes": "Cara sonriente con los ojos en forma de coraz\u00f3n",
    "Smiling face with sunglasses": "Cara sonriente con gafas de sol",
    "Smirking face": "Sonriendo cara",
    "Neutral face": "Cara neutral",
    "Expressionless face": "Rostro inexpresivo",
    "Unamused face": "Cara no divertido",
    "Face with cold sweat": "Cara con sudor fr\u00edo",
    "Pensive face": "Rostro pensativo",
    "Confused face": "Cara confusa",
    "Confounded face": "Cara Averg\u00fc\u00e9ncense",
    "Kissing face": "Besar la cara",
    "Face throwing a kiss": "Cara lanzando un beso",
    "Kissing face with smiling eyes": "Besar a cara con ojos sonrientes",
    "Kissing face with closed eyes": "Besar a cara con los ojos cerrados",
    "Face with stuck out tongue": "Cara con la lengua pegada",
    "Face with stuck out tongue and winking eye": "Cara con pegado a la lengua y los ojos gui\u00f1o",
    "Face with stuck out tongue and tightly-closed eyes": "Cara con la lengua pegada a y los ojos fuertemente cerrados",
    "Disappointed face": "Cara decepcionado",
    "Worried face": "Cara de preocupaci\u00f3n",
    "Angry face": "Cara enojada",
    "Pouting face": "Que pone mala cara",
    "Crying face": "Cara llorando",
    "Persevering face": "Perseverar cara",
    "Face with look of triumph": "Cara con expresi\u00f3n de triunfo",
    "Disappointed but relieved face": "Decepcionado pero el rostro aliviado",
    "Frowning face with open mouth": "Con el ce\u00f1o fruncido la cara con la boca abierta",
    "Anguished face": "Rostro angustiado",
    "Fearful face": "Cara Temeroso",
    "Weary face": "Rostro cansado",
    "Sleepy face": "Rostro so\u00f1oliento",
    "Tired face": "Rostro cansado",
    "Grimacing face": "Haciendo una mueca cara",
    "Loudly crying face": "Llorando en voz alta la cara",
    "Face with open mouth": "Cara con la boca abierta",
    "Hushed face": "Cara callada",
    "Face with open mouth and cold sweat": "Cara con la boca abierta y el sudor frío",
    "Face screaming in fear": "Cara gritando de miedo",
    "Astonished face": "Cara asombrosa",
    "Flushed face": "Cara enrojecida",
    "Sleeping face": "Rostro dormido",
    "Dizzy face": "Cara Mareado",
    "Face without mouth": "Cara sin boca",
    "Face with medical mask": "Cara con la m\u00e1scara m\u00e9dica",

    // Line breaker
    "Break": "Romper",

    // Math
    "Subscript": "Sub\u00edndice",
    "Superscript": "Super\u00edndice",

    // Full screen
    "Fullscreen": "Pantalla completa",

    // Horizontal line
    "Insert Horizontal Line": "Insertar l\u00ednea horizontal",

    // Clear formatting
    "Clear Formatting": "Quitar el formato",

    // Save
    "Save": "Salvar",

    // Undo, redo
    "Undo": "Deshacer",
    "Redo": "Rehacer",

    // Select all
    "Select All": "Seleccionar todo",

    // Code view
    "Code View": "Vista de c\u00f3digo",

    // Quote
    "Quote": "Cita",
    "Increase": "Aumentar",
    "Decrease": "Disminuci\u00f3n",

    // Quick Insert
    "Quick Insert": "Inserci\u00f3n r\u00e1pida",

    // Spcial Characters
    "Special Characters": "Caracteres especiales",
    "Latin": "Latín",
    "Greek": "Griego",
    "Cyrillic": "Cirílico",
    "Punctuation": "Puntuación",
    "Currency": "Moneda",
    "Arrows": "Flechas",
    "Math": "Mates",
    "Misc": "Misc",

    // Print.
    "Print": "Impresión",

    // Spell Checker.
    "Spell Checker": "Corrector ortográfico",

    // Help
    "Help": "Ayuda",
    "Shortcuts": "Atajos",
    "Inline Editor": "Editor en línea",
    "Show the editor": "Mostrar al editor",
    "Common actions": "Acciones comunes",
    "Copy": "Dupdo",
    "Cut": "Cortar",
    "Paste": "Pegar",
    "Basic Formatting": "Formato básico",
    "Increase quote level": "Aumentar el nivel de cotización",
    "Decrease quote level": "Disminuir el nivel de cotización",
    "Image / Video": "Imagen / video",
    "Resize larger": "Redimensionar más grande",
    "Resize smaller": "Redimensionar más pequeño",
    "Table": "Mesa",
    "Select table cell": "Celda de tabla select",
    "Extend selection one cell": "Ampliar la selección una celda",
    "Extend selection one row": "Ampliar la selección una fila",
    "Navigation": "Navegación",
    "Focus popup / toolbar": "Focus popup / toolbar",
    "Return focus to previous position": "Volver al foco a la posición anterior",

    // Embed.ly
    "Embed URL": "URL de inserción",
    "Paste in a URL to embed": "Pegar en una url para incrustar",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "El contenido pegado viene de un documento de Microsoft Word. ¿Quieres mantener el formato o limpiarlo?",
    "Keep": "Guardar",
    "Clean": "Limpiar",
    "Word Paste Detected": "Palabra detectada"
  },
  direction: "ltr"
};

}));

