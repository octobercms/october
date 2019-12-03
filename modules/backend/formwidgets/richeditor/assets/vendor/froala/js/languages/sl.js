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
 * Slovenian
 */

$.FE.LANGUAGE['sl'] = {
  translation: {
    // Place holder
    "Type something": "Nekaj vtipkajte",

    // Basic formatting
    "Bold": "Krepko",
    "Italic": "Poševno",
    "Underline": "Podčrtano",
    "Strikethrough": "Prečrtano",

    // Main buttons
    "Insert": "Vstavi",
    "Delete": "Izbriši",
    "Cancel": "Prekliči",
    "OK": "OK",
    "Back": "Nazaj",
    "Remove": "Odstrani",
    "More": "Več",
    "Update": "Posodobi",
    "Style": "Slog",

    // Font
    "Font Family": "Oblika pisave",
    "Font Size": "Velikost pisave",

    // Colors
    "Colors": "Barve",
    "Background": "Ozadje",
    "Text": "Besedilo",
    "HEX Color": "HEX barva",

    // Paragraphs
    "Paragraph Format": "Oblika odstavka",
    "Normal": "Normalno",
    "Code": "Koda",
    "Heading 1": "Naslov 1",
    "Heading 2": "Naslov 2",
    "Heading 3": "Naslov 3",
    "Heading 4": "Naslov 4",

    // Style
    "Paragraph Style": "Slog odstavka",
    "Inline Style": "Vrstični slog",

    // Alignment
    "Align": "Poravnava",
    "Align Left": "Leva poravnava",
    "Align Center": "Sredinska poravnava",
    "Align Right": "Desna poravnava",
    "Align Justify": "Obojestranska poravnava",
    "None": "Brez poravnave",

    // Lists
    "Ordered List": "Številčni seznam",
    "Default": "Privzeto",
    "Lower Alpha": "Latinica male",
    "Lower Greek": "Grške male",
    "Lower Roman": "Rimske male",
    "Upper Alpha": "Latinica velike",
    "Upper Roman": "Rimske velike",

    "Unordered List": "Neštevilčni seznam",
    "Circle": "Krog",
    "Disc": "Disk",
    "Square": "Kvadrat",

    // Line height
    "Line Height": "Višina vrstice",
    "Single": "Enojna",
    "Double": "Dvojna",

    // Indent
    "Decrease Indent": "Zmanjšaj zamik",
    "Increase Indent": "Povečaj zamik",

    // Links
    "Insert Link": "Vstavi povezavo",
    "Open in new tab": "Odpri povezavo v novem zavihku",
    "Open Link": "Odpri povezavo",
    "Edit Link": "Uredi povezavo",
    "Unlink": "Odstrani povezavo",
    "Choose Link": "Izberi povezavo",

    // Images
    "Insert Image": "Vstavi sliko",
    "Upload Image": "Naloži sliko",
    "By URL": "Iz URL povezave",
    "Browse": "Prebrskaj",
    "Drop image": "Spustite sliko sem",
    "or click": "ali kliknite",
    "Manage Images": "Urejaj slike",
    "Loading": "Nalaganje",
    "Deleting": "Brisanje",
    "Tags": "Značke",
    "Are you sure? Image will be deleted.": "Ali ste prepričani? Slika bo izbrisana.",
    "Replace": "Zamenjaj",
    "Uploading": "Nalaganje",
    "Loading image": "Nalagam sliko",
    "Display": "Prikaži",
    "Inline": "Vrstično",
    "Break Text": "Prelomi besedilo",
    "Alternative Text": "Nadomestno besedilo",
    "Change Size": "Spremeni velikost",
    "Width": "Širina",
    "Height": "Višina",
    "Something went wrong. Please try again.": "Nekaj je šlo narobe. Prosimo, poskusite ponovno.",
    "Image Caption": "Opis slike",
    "Advanced Edit": "Napredno urejanje",

    // Video
    "Insert Video": "Vstavi video posnetek",
    "Embedded Code": "Vdelana koda",
    "Paste in a video URL": "Prilepite URL video posnetka",
    "Drop video": "Spustite video posnetek sem",
    "Your browser does not support HTML5 video.": "Vaš brskalnik ne podpira HTML5 video funkcionalnosti.",
    "Upload Video": "Naloži video posnetek",

    // Tables
    "Insert Table": "Vstavi tabelo",
    "Table Header": "Glava tabele",
    "Remove Table": "Odstrani tabelo",
    "Table Style": "Slog tabele",
    "Horizontal Align": "Horizontalna poravnava",
    "Row": "Vrstica",
    "Insert row above": "Vstavi vrstico nad",
    "Insert row below": "Vstavi vrstico pod",
    "Delete row": "Izbriši vrstico",
    "Column": "Stolpec",
    "Insert column before": "Vstavi stolpec pred",
    "Insert column after": "Vstavi stolpec po",
    "Delete column": "Izbriši stolpec",
    "Cell": "Celica",
    "Merge cells": "Združi celice",
    "Horizontal split": "Horizontalni razcep",
    "Vertical split": "Vertikalni razcep",
    "Cell Background": "Ozadje celice",
    "Vertical Align": "Vertikalna poravnava",
    "Top": "Vrh",
    "Middle": "Sredina",
    "Bottom": "Dno",
    "Align Top": "Vrhnja poravnava",
    "Align Middle": "Sredinska poravnava",
    "Align Bottom": "Spodnja poravnava",
    "Cell Style": "Slog celice",

    // Files
    "Upload File": "Naloži datoteko",
    "Drop file": "Spustite datoteko sem",

    // Emoticons
    "Emoticons": "Emotikoni",

    // Line breaker
    "Break": "Prelom",

    // Math
    "Subscript": "Podpisano",
    "Superscript": "Nadpisano",

    // Full screen
    "Fullscreen": "Celozaslonski način",

    // Horizontal line
    "Insert Horizontal Line": "Vstavi vodoravno črto",

    // Clear formatting
    "Clear Formatting": "Počisti oblikovanje",

    // Save
    "Save": "Shrani",

    // Undo, redo
    "Undo": "Razveljavi",
    "Redo": "Ponovno uveljavi",

    // Select all
    "Select All": "Izberi vse",

    // Code view
    "Code View": "Pogled kode",

    // Quote
    "Quote": "Citat",
    "Increase": "Povečaj",
    "Decrease": "Zmanjšaj",

    // Quick Insert
    "Quick Insert": "Hitro vstavljanje",

    // Special Characters
    "Special Characters": "Posebni znaki",
    "Latin": "Latinica",
    "Greek": "Grščina",
    "Cyrillic": "Cirilica",
    "Punctuation": "Ločila",
    "Currency": "Valute",
    "Arrows": "Puščice",
    "Math": "Matematika",
    "Misc": "Razno",

    // Print.
    "Print": "Natisni",

    // Spell Checker.
    "Spell Checker": "Črkovalnik",

    // Help
    "Help": "Pomoč",
    "Shortcuts": "Bližnjice",
    "Inline Editor": "Vdelani urejevalnik",
    "Show the editor": "Pokaži urejevalnik",
    "Common actions": "Skupna dejanja",
    "Copy": "Kopiraj",
    "Cut": "Izreži",
    "Paste": "Prilepi",
    "Basic Formatting": "Osnovno oblikovanje",
    "Increase quote level": "Povečaj raven citata",
    "Decrease quote level": "Zmanjšaj raven citata",
    "Image / Video": "Slika / Video",
    "Resize larger": "Povečaj",
    "Resize smaller": "Pomanjšaj",
    "Table": "Tabela",
    "Select table cell": "Izberi celico tabele",
    "Extend selection one cell": "Razširi izbor za eno celico",
    "Extend selection one row": "Razširi izbor za eno vrstico",
    "Navigation": "Navigacija",
    "Focus popup / toolbar": "Fokusiraj pojavno okno / orodno vrstico",
    "Return focus to previous position": "Vrni fokus v prejšnji položaj",

    // Embed.ly
    "Embed URL": "Vdelaj URL",
    "Paste in a URL to embed": "Prilepite URL za vdelavo",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "Prilepljena vsebina prihaja iz dokumenta Microsoft Word. Ali želite obliko obdržati ali jo želite očistiti?",
    "Keep": "Obdrži",
    "Clean": "Počisti",
    "Word Paste Detected": "Zaznano je lepljenje s programa Word"
  },
  direction: "ltr"
};

}));
