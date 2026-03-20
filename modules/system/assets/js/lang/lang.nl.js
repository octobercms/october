/*
 * This file has been compiled from: /modules/system/lang/nl/client.php
 */
if (!window.oc) {
    window.oc = {};
}

if (!window.oc.langMessages) {
    window.oc.langMessages = {};
}

window.oc.langMessages['nl'] = Object.assign(
    window.oc.langMessages['nl'] || {},
    {
    "markdowneditor": {
        "formatting": "Opmaak",
        "quote": "Quote",
        "code": "Code",
        "header1": "Koptekst 1",
        "header2": "Koptekst 2",
        "header3": "Koptekst 3",
        "header4": "Koptekst 4",
        "header5": "Koptekst 5",
        "header6": "Koptekst 6",
        "bold": "Vet",
        "italic": "Cursief",
        "unorderedlist": "Ongeordende lijst",
        "orderedlist": "Gerangschikte lijst",
        "snippet": "Snippet",
        "video": "Video",
        "image": "Afbeelding",
        "link": "Hyperlink",
        "horizontalrule": "Invoegen horizontale lijn",
        "fullscreen": "Volledig scherm",
        "preview": "Voorbeeldweergave",
        "strikethrough": "Doorhalen",
        "cleanblock": "Blok opschonen",
        "table": "Tabel",
        "sidebyside": "Zij aan zij"
    },
    "mediamanager": {
        "insert_link": "Media Link invoegen",
        "insert_image": "Media Afbeelding invoegen",
        "insert_video": "Media Video invoegen",
        "insert_audio": "Media Audio invoegen",
        "invalid_file_empty_insert": "Selecteer bestand om een link naar te maken.",
        "invalid_file_single_insert": "Selecteer \u00e9\u00e9n bestand.",
        "invalid_image_empty_insert": "Selecteer afbeelding(en) om in te voegen.",
        "invalid_video_empty_insert": "Selecteer een video bestand om in te voegen.",
        "invalid_audio_empty_insert": "Selecteer een audio bestand om in te voegen."
    },
    "alert": {
        "error": "Fout",
        "confirm": "Bevestigen",
        "dismiss": "Afwijzen",
        "confirm_button_text": "OK",
        "cancel_button_text": "Annuleren",
        "widget_remove_confirm": "Deze widget verwijderen?"
    },
    "datepicker": {
        "previousMonth": "Vorige maand",
        "nextMonth": "Volgende maan",
        "months": [
            "Januari",
            "Februari",
            "Maart",
            "April",
            "Mei",
            "Juni",
            "Juli",
            "Augustus",
            "September",
            "Oktober",
            "November",
            "December"
        ],
        "weekdays": [
            "Zondag",
            "Maandag",
            "Dinsdag",
            "Woensdag",
            "Donderdag",
            "Vrijdag",
            "Zaterdag"
        ],
        "weekdaysShort": [
            "Zo",
            "Ma",
            "Di",
            "Wo",
            "Do",
            "Vr",
            "Za"
        ]
    },
    "colorpicker": {
        "choose": "OK"
    },
    "filter": {
        "group": {
            "all": "alle"
        },
        "scopes": {
            "apply_button_text": "Toepassen",
            "clear_button_text": "Resetten"
        },
        "dates": {
            "all": "alle",
            "filter_button_text": "Filteren",
            "reset_button_text": "Resetten",
            "date_placeholder": "Datum",
            "after_placeholder": "Na",
            "before_placeholder": "Voor"
        },
        "numbers": {
            "all": "alle",
            "filter_button_text": "Filteren",
            "reset_button_text": "Resetten",
            "min_placeholder": "Minimum",
            "max_placeholder": "Maximum",
            "number_placeholder": "N\u00famero"
        }
    },
    "eventlog": {
        "show_stacktrace": "Toon stacktrace",
        "hide_stacktrace": "Verberg stacktrace",
        "tabs": {
            "formatted": "Geformatteerd",
            "raw": "Bronversie"
        },
        "editor": {
            "title": "Broncode editor",
            "description": "Je besturingssysteem moet in staat zijn om met deze URL-schema's om te kunnen gaan.",
            "openWith": "Openen met",
            "remember_choice": "Onthoudt de geselecteerde optie voor deze browser-sessie",
            "open": "Openen",
            "cancel": "Annuleren",
            "rememberChoice": "Recuerde la opci\u00f3n seleccionada para esta sesi\u00f3n del navegador"
        }
    },
    "upload": {
        "max_files": "Je kan niet meer bestanden uploaden.",
        "invalid_file_type": "Je kan geen bestanden van dit type uploaden.",
        "file_too_big": "Het bestand is te groot ({{filesize}}MB). Maximale bestandsgrootte: {{maxFilesize}}MB.",
        "response_error": "De server reageerde met de code {{statusCode}}.",
        "remove_file": "Verwijder bestand"
    },
    "inspector": {
        "add": "Toevoegen",
        "remove": "Verwijderen",
        "key": "Sleutel",
        "value": "Waarde",
        "ok": "Ok",
        "cancel": "Annuleren",
        "items": "Items"
    },
    "[not set]": "[niet ingesteld]",
    "1 day (today) if not set": "1 dag (vandaag) indien niet ingesteld",
    "Apply": "Toepassen",
    "Ascending": "Oplopend",
    "Attribute": "Attribuut",
    "Bar": "Staafdiagram",
    "Chart": "Grafiek",
    "Chart type": "Grafiektype",
    "Color": "Kleur",
    "Compare Totals": "Totalen vergelijken",
    "Configure": "Configureren",
    "Custom": "Aangepast",
    "Dashboard interval": "Dashboardbereik",
    "Data source": "Gegevensbron",
    "Date interval": "Datumbereik",
    "Day": "Dag",
    "Delete": "Verwijderen",
    "Delete Dashboard": "Dashboard verwijderen",
    "Delete row": "Rij verwijderen",
    "Descending": "Aflopend",
    "Dimension": "Dimensie",
    "Direction": "Richting",
    "Disabled": "Uitgeschakeld",
    "Display": "Weergave",
    "Display [not set]": "Toon [niet ingesteld]",
    "Display all records": "Alle records weergeven",
    "Display relative bars": "Relatieve balken weergeven",
    "Display totals": "Totalen weergeven",
    "Edit Dashboard": "Dashboard bewerken",
    "Empty values": "Lege waarden",
    "Enter a positive number": "Voer een positief getal in",
    "Enter a positive number or leave empty to display all records.": "Voer een positief getal in of laat leeg om alle records weer te geven.",
    "Equal to": "Gelijk aan",
    "Export Dashboard": "Dashboard exporteren",
    "Extra table fields": "Extra tabelvelden",
    "Filters": "Filters",
    "General": "Algemeen",
    "Greater or equal to": "Groter of gelijk aan",
    "Greater than": "Groter dan",
    "Hide": "Verbergen",
    "Horizontal": "Horizontaal",
    "Icon": "Pictogram",
    "Icon Status": "Pictogramstatus",
    "Important": "Belangrijk",
    "Includes": "Bevat",
    "Indicator": "Indicator",
    "Information": "Informatie",
    "Last 30 days": "Afgelopen 30 dagen",
    "Last 7 days": "Afgelopen 7 dagen",
    "Last month": "Vorige maand",
    "Leave empty to disable pagination": "Laat leeg om paginering uit te schakelen",
    "Leave empty to hide the title": "Laat leeg om de titel te verbergen",
    "Less or equal to": "Kleiner of gelijk aan",
    "Less than": "Kleiner dan",
    "Limit": "Limiet",
    "Line": "Lijngrafiek",
    "Link Text": "Linktekst",
    "Link URL": "Link-URL",
    "Make Default": "Als standaard instellen",
    "Manage Dashboards": "Manage Dashboards",
    "Metric": "Metriek",
    "Metrics": "Metrieken",
    "Month": "Maand",
    "My Custom Widget": "Mijn aangepaste widget",
    "No Value": "Geen waarde",
    "Notice text": "Meldingstekst",
    "Number of days": "Aantal dagen",
    "One of": "E\u00e9n van",
    "One value per line": "E\u00e9n waarde per regel",
    "Operation": "Bewerking",
    "Order": "Volgorde",
    "Past hour": "Afgelopen uur",
    "Past X days": "Afgelopen X dagen",
    "Please provide the widget title": "Voer de widgettitel in",
    "Please select a data source": "Selecteer een gegevensbron",
    "Please select a dimension": "Selecteer een dimensie",
    "Please select an icon": "Selecteer een pictogram",
    "Please select metric(s).": "Selecteer metriek(en).",
    "Prev period": "Vorige periode",
    "Quarter": "Kwartaal",
    "Records per page": "Records per pagina",
    "Refresh every minute": "Elke minuut vernieuwen",
    "Rename Dashboard": "Dashboard hernoemen",
    "Reset Layout": "Layout herstellen",
    "Reset layout back to default?": "Layout terugzetten naar standaard?",
    "Same period last year": "Zelfde periode vorig jaar",
    "Section": "Sectie",
    "Section Title": "Sectietitel",
    "Select a dimension and metrics": "Selecteer een dimensie en metrieken",
    "Select an attribute": "Selecteer een attribuut",
    "Select an operation": "Selecteer een bewerking",
    "Select sorting metric or dimension": "Selecteer sorteermetriek of dimensie",
    "Select the metric color": "Selecteer de metriek-kleur",
    "Set the current layout as the default?": "De huidige layout als standaard instellen?",
    "Show Date Interval": "Toon datumbereik",
    "Sort by": "Sorteren op",
    "Sorting": "Sorteren",
    "Sorting & Filtering": "Sorteren & Filteren",
    "Stacked Bar": "Gestapeld staafdiagram",
    "Starts with": "Begint met",
    "Success": "Succes",
    "Table": "Tabel",
    "Text Notice": "Tekstmelding",
    "The dashboard layout has been reset to default.": "De dashboard layout is hersteld naar standaard.",
    "The dashboard was successfully updated.": "Het dashboard is succesvol bijgewerkt.",
    "The limit value must be at least 1": "De limietwaarde moet minimaal 1 zijn",
    "This dashboard is now the default layout.": "Dit dashboard is nu de standaard layout.",
    "This is a text notice widget.": "Dit is een tekstmelding widget.",
    "This month": "Deze maand",
    "This quarter": "Dit kwartaal",
    "This week": "Deze week",
    "This year": "Dit jaar",
    "Title": "Titel",
    "Today": "Vandaag",
    "Value": "Waarde",
    "Values": "Waarden",
    "Vertical": "Verticaal",
    "Warning": "Waarschuwing",
    "Week": "Week",
    "Year": "Jaar",
    "Yesterday": "Gisteren"
}
);


/*! Select2 4.1.0-rc.0 | https://github.com/select2/select2/blob/master/LICENSE.md */

!function(){if(jQuery&&jQuery.fn&&jQuery.fn.select2&&jQuery.fn.select2.amd)var e=jQuery.fn.select2.amd;e.define("select2/i18n/nl",[],function(){return{errorLoading:function(){return"De resultaten konden niet worden geladen."},inputTooLong:function(e){return"Gelieve "+(e.input.length-e.maximum)+" karakters te verwijderen"},inputTooShort:function(e){return"Gelieve "+(e.minimum-e.input.length)+" of meer karakters in te voeren"},loadingMore:function(){return"Meer resultaten laden…"},maximumSelected:function(e){var n=1==e.maximum?"kan":"kunnen",r="Er "+n+" maar "+e.maximum+" item";return 1!=e.maximum&&(r+="s"),r+=" worden geselecteerd"},noResults:function(){return"Geen resultaten gevonden…"},searching:function(){return"Zoeken…"},removeAllItems:function(){return"Verwijder alle items"}}}),e.define,e.require}();
