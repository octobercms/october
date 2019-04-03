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
 * Hungarian
 */

$.FE.LANGUAGE['hu'] = {
  translation: {
    // Place holder
    "Type something": "Sz\u00f6veg...",

    // Basic formatting
    "Bold": "F\u00e9lk\u00f6v\u00e9r",
    "Italic": "D\u0151lt",
    "Underline": "Al\u00e1h\u00fazott",
    "Strikethrough": "\u00c1th\u00fazott",

    // Main buttons
    "Insert": "Beilleszt\u00e9s",
    "Delete": "T\u00f6rl\u00e9s",
    "Cancel": "M\u00e9gse",
    "OK": "Rendben",
    "Back": "Vissza",
    "Remove": "Elt\u00e1vol\u00edt\u00e1s",
    "More": "T\u00f6bb",
    "Update": "Friss\u00edt\u00e9s",
    "Style": "St\u00edlus",

    // Font
    "Font Family": "Bet\u0171t\u00edpus",
    "Font Size": "Bet\u0171m\u00e9ret",

    // Colors
    "Colors": "Sz\u00ednek",
    "Background": "H\u00e1tt\u00e9r",
    "Text": "Sz\u00f6veg",
    "HEX Color": "Hex színű",

    // Paragraphs
    "Paragraph Format": "Form\u00e1tumok",
    "Normal": "Norm\u00e1l",
    "Code": "K\u00f3d",
    "Heading 1": "C\u00edmsor 1",
    "Heading 2": "C\u00edmsor 2",
    "Heading 3": "C\u00edmsor 3",
    "Heading 4": "C\u00edmsor 4",

    // Style
    "Paragraph Style": "Bekezd\u00e9s st\u00edlusa",
    "Inline Style": " Helyi st\u00edlus",

    // Alignment
    "Align": "Igaz\u00edt\u00e1s",
    "Align Left": "Balra igaz\u00edt",
    "Align Center": "K\u00f6z\u00e9pre z\u00e1r",
    "Align Right": "Jobbra igaz\u00edt",
    "Align Justify": "Sorkiz\u00e1r\u00e1s",
    "None": "Egyik sem",

    // Lists
    "Ordered List": "Sz\u00e1moz\u00e1s",
    "Default": "Alapértelmezett",
    "Lower Alpha": "Alacsonyabb alfa",
    "Lower Greek": "Alsó görög",
    "Lower Roman": "Alacsonyabb római",
    "Upper Alpha": "Felső alfa",
    "Upper Roman": "Felső római",

    "Unordered List": "Felsorol\u00e1s",
    "Circle": "Kör",
    "Disc": "Lemez",
    "Square": "Négyzet",

    // Line height
    "Line Height": "Vonal magassága",
    "Single": "Egyetlen",
    "Double": "Kettős",

    // Indent
    "Decrease Indent": "Beh\u00faz\u00e1s cs\u00f6kkent\u00e9se",
    "Increase Indent": "Beh\u00faz\u00e1s n\u00f6vel\u00e9se",

    // Links
    "Insert Link": "Hivatkoz\u00e1s beilleszt\u00e9se",
    "Open in new tab": "Megnyit\u00e1s \u00faj lapon",
    "Open Link": "Hivatkoz\u00e1s megnyit\u00e1sa",
    "Edit Link": "Hivatkoz\u00e1 s szerkeszt\u00e9se",
    "Unlink": "Hivatkoz\u00e1s t\u00f6rl\u00e9se",
    "Choose Link": "Keres\u00e9s a lapok k\u00f6z\u00f6tt",

    // Images
    "Insert Image": "K\u00e9p beilleszt\u00e9se",
    "Upload Image": "K\u00e9p felt\u00f6lt\u00e9se",
    "By URL": "Webc\u00edm megad\u00e1sa",
    "Browse": "B\u00f6ng\u00e9sz\u00e9s",
    "Drop image": "H\u00fazza ide a k\u00e9pet",
    "or click": "vagy kattintson ide",
    "Manage Images": "K\u00e9pek kezel\u00e9se",
    "Loading": "Bet\u00f6lt\u00e9s...",
    "Deleting": "T\u00f6rl\u00e9s...",
    "Tags": "C\u00edmk\u00e9k",
    "Are you sure? Image will be deleted.": "Biztos benne? A k\u00e9p t\u00f6rl\u00e9sre ker\u00fcl.",
    "Replace": "Csere",
    "Uploading": "Felt\u00f6lt\u00e9s",
    "Loading image": "K\u00e9p bet\u00f6lt\u00e9se",
    "Display": "Kijelz\u0151",
    "Inline": "Sorban",
    "Break Text": "Sz\u00f6veg t\u00f6r\u00e9se",
    "Alternative Text": "Alternat\u00edv sz\u00f6veg",
    "Change Size": "M\u00e9ret m\u00f3dos\u00edt\u00e1sa",
    "Width": "Sz\u00e9less\u00e9g",
    "Height": "Magass\u00e1g",
    "Something went wrong. Please try again.": "Valami elromlott. K\u00e9rlek pr\u00f3b\u00e1ld \u00fajra.",
    "Image Caption": "Képaláírás",
    "Advanced Edit": "Fejlett szerkesztés",

    // Video
    "Insert Video": "Vide\u00f3 beilleszt\u00e9se",
    "Embedded Code": "K\u00f3d bem\u00e1sol\u00e1sa",
    "Paste in a video URL": "Illessze be a videó URL-címét",
    "Drop video": "Csepp videót",
    "Your browser does not support HTML5 video.": "A böngészője nem támogatja a html5 videót.",
    "Upload Video": "Videó feltöltése",

    // Tables
    "Insert Table": "T\u00e1bl\u00e1zat beilleszt\u00e9se",
    "Table Header": "T\u00e1bl\u00e1zat fejl\u00e9ce",
    "Remove Table": "T\u00e1bla elt\u00e1vol\u00edt\u00e1sa",
    "Table Style": "T\u00e1bl\u00e1zat st\u00edlusa",
    "Horizontal Align": "V\u00edzszintes igaz\u00edt\u00e1s",
    "Row": "Sor",
    "Insert row above": "Sor besz\u00far\u00e1sa el\u00e9",
    "Insert row below": "Sor besz\u00far\u00e1sa m\u00f6g\u00e9",
    "Delete row": "Sor t\u00f6rl\u00e9se",
    "Column": "Oszlop",
    "Insert column before": "Oszlop besz\u00far\u00e1sa el\u00e9",
    "Insert column after": "Oszlop besz\u00far\u00e1sa m\u00f6g\u00e9",
    "Delete column": "Oszlop t\u00f6rl\u00e9se",
    "Cell": "Cella",
    "Merge cells": "Cell\u00e1k egyes\u00edt\u00e9se",
    "Horizontal split": "V\u00edzszintes osztott",
    "Vertical split": "F\u00fcgg\u0151leges osztott",
    "Cell Background": "Cella h\u00e1ttere",
    "Vertical Align": "F\u00fcgg\u0151leges fej\u00e1ll\u00edt\u00e1s",
    "Top": "Fels\u0151",
    "Middle": "K\u00f6z\u00e9ps\u0151",
    "Bottom": "Als\u00f3",
    "Align Top": "Igaz\u00edtsa fel\u00fclre",
    "Align Middle": "Igaz\u00edtsa k\u00f6z\u00e9pre",
    "Align Bottom": "Igaz\u00edtsa al\u00falra",
    "Cell Style": "Cella st\u00edlusa",

    // Files
    "Upload File": "F\u00e1jl felt\u00f6lt\u00e9se",
    "Drop file": "H\u00fazza ide a f\u00e1jlt",

    // Emoticons
    "Emoticons": "Hangulatjelek",
    "Grinning face": "Vigyorg\u00f3 arc",
    "Grinning face with smiling eyes": "Vigyorg\u00f3 arc mosolyg\u00f3 szemekkel",
    "Face with tears of joy": "Arc \u00e1t az \u00f6r\u00f6m k\u00f6nnyei",
    "Smiling face with open mouth": "Mosolyg\u00f3 arc t\u00e1tott sz\u00e1jjal",
    "Smiling face with open mouth and smiling eyes": "Mosolyg\u00f3 arc t\u00e1tott sz\u00e1jjal \u00e9s mosolyg\u00f3 szemek",
    "Smiling face with open mouth and cold sweat": "Mosolyg\u00f3 arc t\u00e1tott sz\u00e1jjal \u00e9s hideg ver\u00edt\u00e9k",
    "Smiling face with open mouth and tightly-closed eyes": "Mosolyg\u00f3 arc t\u00e1tott sz\u00e1jjal \u00e9s szorosan lehunyt szemmel",
    "Smiling face with halo": "Mosolyg\u00f3 arc dicsf\u00e9nyben",
    "Smiling face with horns": "Mosolyg\u00f3 arc szarvakkal",
    "Winking face": "Kacsint\u00f3s arc",
    "Smiling face with smiling eyes": "Mosolyg\u00f3 arc mosolyg\u00f3 szemekkel",
    "Face savoring delicious food": "Arc \u00edzlelgette \u00edzletes \u00e9telek",
    "Relieved face": "Megk\u00f6nnyebb\u00fclt arc",
    "Smiling face with heart-shaped eyes": "Mosolyg\u00f3 arc sz\u00edv alak\u00fa szemekkel",
    "Smilin g face with sunglasses": "Mosolyg\u00f3 arc napszem\u00fcvegben",
    "Smirking face": "Vigyorg\u00f3 arca",
    "Neutral face": "Semleges arc",
    "Expressionless face": "Kifejez\u00e9stelen arc",
    "Unamused face": "Unott arc",
    "Face with cold sweat": "Arc\u00e1n hideg verejt\u00e9kkel",
    "Pensive face": "T\u00f6preng\u0151 arc",
    "Confused face": "Zavaros arc",
    "Confounded face": "R\u00e1c\u00e1folt arc",
    "Kissing face": "Cs\u00f3kos arc",
    "Face throwing a kiss": "Arcra dobott egy cs\u00f3kot",
    "Kissing face with smiling eyes": "Cs\u00f3kos arc\u00e1t mosolyg\u00f3 szemek",
    "Kissing face with closed eyes": "Cs\u00f3kos arc\u00e1t csukott szemmel",
    "Face with stuck out tongue": "Szembe kiny\u00faj totta a nyelv\u00e9t",
    "Face with stuck out tongue and winking eye": "Szembe kiny\u00fajtotta a nyelv\u00e9t, \u00e9s kacsint\u00f3 szem",
    "Face with stuck out tongue and tightly-closed eyes": "Arc kiny\u00fajtotta a nyelv\u00e9t, \u00e9s szorosan lehunyt szemmel",
    "Disappointed face": "Csal\u00f3dott arc",
    "Worried face": "Agg\u00f3d\u00f3 arc\u00e1t",
    "Angry face": "D\u00fch\u00f6s arc",
    "Pouting face": "Duzzog\u00f3 arc",
    "Crying face": "S\u00edr\u00f3 arc",
    "Persevering face": "Kitart\u00f3 arc",
    "Face with look of triumph": "Arc\u00e1t diadalmas pillant\u00e1st",
    "Disappointed but relieved face": "Csal\u00f3dott, de megk\u00f6nnyebb\u00fclt arc",
    "Frowning face with open mouth": "Komor arcb\u00f3l t\u00e1tott sz\u00e1jjal",
    "Anguished face": "Gy\u00f6tr\u0151d\u0151 arc",
    "Fearful face": "F\u00e9lelmetes arc",
    "Weary face": "F\u00e1radt arc",
    "Sleepy face": "\u00e1lmos arc",
    "Tired face": "F\u00e1radt arc",
    "Grimacing face": "Elfintorodott arc",
    "Loudly crying face": "Hangosan s\u00edr\u00f3 arc",
    "Face with open mouth": "Arc nyitott sz\u00e1jjal",
    "Hushed face": "Csit\u00edtott arc",
    "Face with open mouth and cold sweat": "Arc t\u00e1tott sz\u00e1jjal \u00e9s hideg ver\u00edt\u00e9k",
    "Face screaming in fear": "Sikoltoz\u00f3 arc a f\u00e9lelemt\u0151l",
    "Astonished face": "Meglepett arc",
    "Flushed face": "Kipirult arc",
    "Sleeping face": "Alv\u00f3 arc",
    "Dizzy face": " Sz\u00e1d\u00fcl\u0151 arc",
    "Face without mouth": "Arc n\u00e9lküli sz\u00e1j",
    "Face with medical mask": "Arc\u00e1n orvosi maszk",

    // Line breaker
    "Break": "T\u00f6r\u00e9s",

    // Math
    "Subscript": "Als\u00f3 index",
    "Superscript": "Fels\u0151 index",

    // Full screen
    "Fullscreen": "Teljes k\u00e9perny\u0151",

    // Horizontal line
    "Insert Horizontal Line": "V\u00edzszintes vonal",

    // Clear formatting
    "Clear Formatting": "Form\u00e1z\u00e1s elt\u00e1vol\u00edt\u00e1sa",

    // Save
    "Save": "\u004d\u0065\u006e\u0074\u00e9\u0073",

    // Undo, redo
    "Undo": "Visszavon\u00e1s",
    "Redo": "Ism\u00e9t",

    // Select all
    "Select All": "Minden kijel\u00f6l\u00e9se",

    // Code view
    "Code View": "Forr\u00e1sk\u00f3d",

    // Quote
    "Quote": "Id\u00e9zet",
    "Increase": "N\u00f6vel\u00e9s",
    "Decrease": "Cs\u00f6kkent\u00e9s",

    // Quick Insert
    "Quick Insert": "Beilleszt\u00e9s",

    // Spcial Characters
    "Special Characters": "Speciális karakterek",
    "Latin": "Latin",
    "Greek": "Görög",
    "Cyrillic": "Cirill",
    "Punctuation": "Központozás",
    "Currency": "Valuta",
    "Arrows": "Nyilak",
    "Math": "Matematikai",
    "Misc": "Misc",

    // Print.
    "Print": "Nyomtatás",

    // Spell Checker.
    "Spell Checker": "Helyesírás-ellenőrző",

    // Help
    "Help": "Segítség",
    "Shortcuts": "Hivatkozások",
    "Inline Editor": "Inline szerkesztő",
    "Show the editor": "Mutassa meg a szerkesztőt",
    "Common actions": "Közös cselekvések",
    "Copy": "Másolat",
    "Cut": "Vágott",
    "Paste": "Paszta",
    "Basic Formatting": "Alap formázás",
    "Increase quote level": "Növeli az idézet szintjét",
    "Decrease quote level": "Csökkenti az árazási szintet",
    "Image / Video": "Kép / videó",
    "Resize larger": "Nagyobb átméretezés",
    "Resize smaller": "Kisebb méretűek",
    "Table": "Asztal",
    "Select table cell": "Válasszon táblázatcellát",
    "Extend selection one cell": "Kiterjesztheti a kiválasztást egy cellára",
    "Extend selection one row": "Szűkítse ki az egy sort",
    "Navigation": "Navigáció",
    "Focus popup / toolbar": "Fókusz felugró ablak / eszköztár",
    "Return focus to previous position": "Visszaáll az előző pozícióra",

    // Embed.ly
    "Embed URL": "Beágyazott url",
    "Paste in a URL to embed": "Beilleszteni egy URL-t a beágyazáshoz",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "A beillesztett tartalom egy microsoft szó dokumentumból származik. szeretné megtartani a formátumot vagy tisztítani?",
    "Keep": "Tart",
    "Clean": "Tiszta",
    "Word Paste Detected": "Szópaszta észlelhető"
  },
  direction: "ltr"
};

}));
