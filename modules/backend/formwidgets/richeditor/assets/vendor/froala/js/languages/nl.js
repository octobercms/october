/*!
 * froala_editor v2.9.3 (https://www.froala.com/wysiwyg-editor)
 * License https://froala.com/wysiwyg-editor/terms/
 * Copyright 2014-2019 Froala Labs
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
 * Dutch
 */

$.FE.LANGUAGE['nl'] = {
  translation: {
    // Place holder
    "Type something": "Typ iets",

    // Basic formatting
    "Bold": "Vet",
    "Italic": "Cursief",
    "Underline": "Onderstreept",
    "Strikethrough": "Doorhalen",

    // Main buttons
    "Insert": "Invoegen",
    "Delete": "Verwijder",
    "Cancel": "Annuleren",
    "OK": "Ok\u00e9",
    "Back": "Terug",
    "Remove": "Verwijderen",
    "More": "Meer",
    "Update": "Bijwerken",
    "Style": "Stijl",

    // Font
    "Font Family": "Lettertype",
    "Font Size": "Lettergrootte",

    // Colors
    "Colors": "Kleuren",
    "Background": "Achtergrond",
    "Text": "Tekst",
    "HEX Color": "HEX kleur",

    // Paragraphs
    "Paragraph Format": "Opmaak",
    "Normal": "Normaal",
    "Code": "Code",
    "Heading 1": "Kop 1",
    "Heading 2": "Kop 2",
    "Heading 3": "Kop 3",
    "Heading 4": "Kop 4",

    // Style
    "Paragraph Style": "Paragraaf stijl",
    "Inline Style": "Inline stijl",

    // Alignment
    "Align": "Uitlijnen",
    "Align Left": "Links uitlijnen",
    "Align Center": "Centreren",
    "Align Right": "Rechts uitlijnen",
    "Align Justify": "Uitvullen",
    "None": "Geen",

    // Lists
    "Ordered List": "Geordende lijst",
    "Default": "Standaard",
    "Lower Alpha": "Lagere alpha",
    "Lower Greek": "Lager Grieks",
    "Lower Roman": "Lager Romeins",
    "Upper Alpha": "Bovenste alfa",
    "Upper Roman": "Bovenste roman",

    "Unordered List": "Ongeordende lijst",
    "Circle": "Cirkel",
    "Disc": "Schijf",
    "Square": "Plein",

    // Line height
    "Line Height": "Lijnhoogte",
    "Single": "Single",
    "Double": "Dubbele",

    // Indent
    "Decrease Indent": "Inspringen verkleinen",
    "Increase Indent": "Inspringen vergroten",

    // Links
    "Insert Link": "Link invoegen",
    "Open in new tab": "Openen in nieuwe tab",
    "Open Link": "Open link",
    "Edit Link": "Link bewerken",
    "Unlink": "Link verwijderen",
    "Choose Link": "Link kiezen",

    // Images
    "Insert Image": "Afbeelding invoegen",
    "Upload Image": "Afbeelding uploaden",
    "By URL": "Via URL",
    "Browse": "Bladeren",
    "Drop image": "Sleep afbeelding",
    "or click": "of klik op",
    "Manage Images": "Afbeeldingen beheren",
    "Loading": "Bezig met laden",
    "Deleting": "Verwijderen",
    "Tags": "Labels",
    "Are you sure? Image will be deleted.": "Weet je het zeker? Afbeelding wordt verwijderd.",
    "Replace": "Vervangen",
    "Uploading": "Uploaden",
    "Loading image": "Afbeelding laden",
    "Display": "Tonen",
    "Inline": "Inline",
    "Break Text": "Tekst afbreken",
    "Alternative Text": "Alternatieve tekst",
    "Change Size": "Grootte wijzigen",
    "Width": "Breedte",
    "Height": "Hoogte",
    "Something went wrong. Please try again.": "Er is iets fout gegaan. Probeer opnieuw.",
    "Image Caption": "Afbeelding caption",
    "Advanced Edit": "Geavanceerd bewerken",

    // Video
    "Insert Video": "Video invoegen",
    "Embedded Code": "Ingebedde code",
    "Paste in a video URL": "Voeg een video-URL toe",
    "Drop video": "Sleep video",
    "Your browser does not support HTML5 video.": "Je browser ondersteunt geen html5-video.",
    "Upload Video": "Video uploaden",

    // Tables
    "Insert Table": "Tabel invoegen",
    "Table Header": "Tabel hoofd",
    "Remove Table": "Verwijder tabel",
    "Table Style": "Tabelstijl",
    "Horizontal Align": "Horizontale uitlijning",
    "Row": "Rij",
    "Insert row above": "Voeg rij boven toe",
    "Insert row below": "Voeg rij onder toe",
    "Delete row": "Verwijder rij",
    "Column": "Kolom",
    "Insert column before": "Voeg kolom in voor",
    "Insert column after": "Voeg kolom in na",
    "Delete column": "Verwijder kolom",
    "Cell": "Cel",
    "Merge cells": "Cellen samenvoegen",
    "Horizontal split": "Horizontaal splitsen",
    "Vertical split": "Verticaal splitsen",
    "Cell Background": "Cel achtergrond",
    "Vertical Align": "Verticale uitlijning",
    "Top": "Top",
    "Middle": "Midden",
    "Bottom": "Onder",
    "Align Top": "Uitlijnen top",
    "Align Middle": "Uitlijnen midden",
    "Align Bottom": "Onder uitlijnen",
    "Cell Style": "Celstijl",

    // Files
    "Upload File": "Bestand uploaden",
    "Drop file": "Sleep bestand",

    // Emoticons
    "Emoticons": "Emoticons",
    "Grinning face": "Grijnzend gezicht",
    "Grinning face with smiling eyes": "Grijnzend gezicht met lachende ogen",
    "Face with tears of joy": "Gezicht met tranen van vreugde",
    "Smiling face with open mouth": "Lachend gezicht met open mond",
    "Smiling face with open mouth and smiling eyes": "Lachend gezicht met open mond en lachende ogen",
    "Smiling face with open mouth and cold sweat": "Lachend gezicht met open mond en koud zweet",
    "Smiling face with open mouth and tightly-closed eyes": "Lachend gezicht met open mond en strak gesloten ogen",
    "Smiling face with halo": "Lachend gezicht met halo",
    "Smiling face with horns": "Lachend gezicht met hoorns",
    "Winking face": "Knipogend gezicht",
    "Smiling face with smiling eyes": "Lachend gezicht met lachende ogen",
    "Face savoring delicious food": "Gezicht genietend van heerlijk eten",
    "Relieved face": "Opgelucht gezicht",
    "Smiling face with heart-shaped eyes": "Glimlachend gezicht met hart-vormige ogen",
    "Smiling face with sunglasses": "Lachend gezicht met zonnebril",
    "Smirking face": "Grijnzende gezicht",
    "Neutral face": "Neutraal gezicht",
    "Expressionless face": "Uitdrukkingsloos gezicht",
    "Unamused face": "Niet geamuseerd gezicht",
    "Face with cold sweat": "Gezicht met koud zweet",
    "Pensive face": "Peinzend gezicht",
    "Confused face": "Verward gezicht",
    "Confounded face": "Beschaamd gezicht",
    "Kissing face": "Zoenend gezicht",
    "Face throwing a kiss": "Gezicht gooien van een kus",
    "Kissing face with smiling eyes": "Zoenend gezicht met lachende ogen",
    "Kissing face with closed eyes": "Zoenend gezicht met gesloten ogen",
    "Face with stuck out tongue": "Gezicht met uitstekende tong",
    "Face with stuck out tongue and winking eye": "Gezicht met uitstekende tong en knipoog",
    "Face with stuck out tongue and tightly-closed eyes": "Gezicht met uitstekende tong en strak-gesloten ogen",
    "Disappointed face": "Teleurgesteld gezicht",
    "Worried face": "Bezorgd gezicht",
    "Angry face": "Boos gezicht",
    "Pouting face": "Pruilend gezicht",
    "Crying face": "Huilend gezicht",
    "Persevering face": "Volhardend gezicht",
    "Face with look of triumph": "Gezicht met blik van triomf",
    "Disappointed but relieved face": "Teleurgesteld, maar opgelucht gezicht",
    "Frowning face with open mouth": "Fronsend gezicht met open mond",
    "Anguished face": "Gekweld gezicht",
    "Fearful face": "Angstig gezicht",
    "Weary face": "Vermoeid gezicht",
    "Sleepy face": "Slaperig gezicht",
    "Tired face": "Moe gezicht",
    "Grimacing face": "Grimassen trekkend gezicht",
    "Loudly crying face": "Luid schreeuwend gezicht",
    "Face with open mouth": "Gezicht met open mond",
    "Hushed face": "Tot zwijgen gebracht gezicht",
    "Face with open mouth and cold sweat": "Gezicht met open mond en koud zweet",
    "Face screaming in fear": "Gezicht schreeuwend van angst",
    "Astonished face": "Verbaasd gezicht",
    "Flushed face": "Blozend gezicht",
    "Sleeping face": "Slapend gezicht",
    "Dizzy face": "Duizelig gezicht",
    "Face without mouth": "Gezicht zonder mond",
    "Face with medical mask": "Gezicht met medisch masker",

    // Line breaker
    "Break": "Afbreken",

    // Math
    "Subscript": "Subscript",
    "Superscript": "Superscript",

    // Full screen
    "Fullscreen": "Volledig scherm",

    // Horizontal line
    "Insert Horizontal Line": "Horizontale lijn invoegen",

    // Clear formatting
    "Clear Formatting": "Verwijder opmaak",

    // Save
    "Save": "Opslaan",

    // Undo, redo
    "Undo": "Ongedaan maken",
    "Redo": "Opnieuw",

    // Select all
    "Select All": "Alles selecteren",

    // Code view
    "Code View": "Codeweergave",

    // Quote
    "Quote": "Citaat",
    "Increase": "Toenemen",
    "Decrease": "Afnemen",

    // Quick Insert
    "Quick Insert": "Snel invoegen",

    // Spcial Characters
    "Special Characters": "Speciale tekens",
    "Latin": "Latijns",
    "Greek": "Grieks",
    "Cyrillic": "Cyrillisch",
    "Punctuation": "Interpunctie",
    "Currency": "Valuta",
    "Arrows": "Pijlen",
    "Math": "Wiskunde",
    "Misc": "Misc",

    // Print.
    "Print": "Afdrukken",

    // Spell Checker.
    "Spell Checker": "Spellingscontrole",

    // Help
    "Help": "Hulp",
    "Shortcuts": "Snelkoppelingen",
    "Inline Editor": "Inline editor",
    "Show the editor": "Laat de editor zien",
    "Common actions": "Algemene acties",
    "Copy": "Kopiëren",
    "Cut": "Knippen",
    "Paste": "Plakken",
    "Basic Formatting": "Basisformattering",
    "Increase quote level": "Citaat niveau verhogen",
    "Decrease quote level": "Citaatniveau verminderen",
    "Image / Video": "Beeld / video",
    "Resize larger": "Groter maken",
    "Resize smaller": "Kleiner maken",
    "Table": "Tabel",
    "Select table cell": "Selecteer tabelcel",
    "Extend selection one cell": "Selecteer een cel uit",
    "Extend selection one row": "Selecteer een rij uit",
    "Navigation": "Navigatie",
    "Focus popup / toolbar": "Focus pop-up / werkbalk",
    "Return focus to previous position": "Focus terug naar vorige positie",

    // Embed.ly
    "Embed URL": "Embed url",
    "Paste in a URL to embed": "Voer een URL in om toe te voegen",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "De geplakte inhoud komt uit een Microsoft Word-document. wil je het formaat behouden of schoonmaken?",
    "Keep": "Opmaak behouden",
    "Clean": "Tekst schoonmaken",
    "Word Paste Detected": "Word inhoud gedetecteerd"
  },
  direction: "ltr"
};

}));
