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
    "Type something": "Szöveg...",

    // Basic formatting
    "Bold": "Félkövér",
    "Italic": "Dőlt",
    "Underline": "Aláhúzott",
    "Strikethrough": "Áthúzott",

    // Main buttons
    "Insert": "Beillesztés",
    "Delete": "Törlés",
    "Cancel": "Mégse",
    "OK": "Rendben",
    "Back": "Vissza",
    "Remove": "Eltávolítás",
    "More": "Több",
    "Update": "Frissítés",
    "Style": "Stílus",

    // Font
    "Font Family": "Betűtípus",
    "Font Size": "Betűméret",

    // Colors
    "Colors": "Színek",
    "Background": "Háttér",
    "Text": "Szöveg",
    "HEX Color": "HEX színkód",

    // Paragraphs
    "Paragraph Format": "Formátumok",
    "Normal": "Normál",
    "Code": "Kód",
    "Heading 1": "Címsor 1",
    "Heading 2": "Címsor 2",
    "Heading 3": "Címsor 3",
    "Heading 4": "Címsor 4",

    // Style
    "Paragraph Style": "Bekezdés stílusa",
    "Inline Style": " Helyi stílus",

    // Alignment
    "Align": "Igazítás",
    "Align Left": "Balra igazít",
    "Align Center": "Középre zár",
    "Align Right": "Jobbra igazít",
    "Align Justify": "Sorkizárás",
    "None": "Egyik sem",

    // Lists
    "Ordered List": "Számozás",
    "Default": "Alapértelmezett",
    "Lower Alpha": "Csökkenő alfa",
    "Lower Greek": "Csökkenő görög",
    "Lower Roman": "Csökkenő római",
    "Upper Alpha": "Növekvő alfa",
    "Upper Roman": "Növekvő római",

    "Unordered List": "Felsorolás",
    "Circle": "Kör",
    "Disc": "Korong",
    "Square": "Négyzet",

    // Line height
    "Line Height": "Vonal magassága",
    "Single": "Szimpla",
    "Double": "Dupla",

    // Indent
    "Decrease Indent": "Behúzás csökkentése",
    "Increase Indent": "Behúzás növelése",

    // Links
    "Insert Link": "Hivatkozás beillesztése",
    "Open in new tab": "Megnyitás új lapon",
    "Open Link": "Hivatkozás megnyitása",
    "Edit Link": "Hivatkozás szerkesztése",
    "Unlink": "Hivatkozás törlése",
    "Choose Link": "Keresés a lapok között",

    // Images
    "Insert Image": "Kép beillesztése",
    "Upload Image": "Kép feltöltése",
    "By URL": "Webcím megadása",
    "Browse": "Böngészés a Médiában",
    "Drop image": "Húzza ide a képet",
    "or click": "vagy kattintson ide",
    "Manage Images": "Képek kezelése",
    "Loading": "Betöltés...",
    "Deleting": "Törlés...",
    "Tags": "Címkék",
    "Are you sure? Image will be deleted.": "Biztos benne? A kép törlésre kerül.",
    "Replace": "Csere",
    "Uploading": "Feltöltés",
    "Loading image": "Kép betöltése",
    "Display": "Kijelző",
    "Inline": "Sorban",
    "Break Text": "Szöveg törése",
    "Alternative Text": "Alternatív szöveg",
    "Change Size": "Méret módosítása",
    "Width": "Szélesség",
    "Height": "Magasság",
    "Something went wrong. Please try again.": "Valami elromlott. Kérjük próbálja újra.",
    "Image Caption": "Képaláírás",
    "Advanced Edit": "Fejlett szerkesztés",

    // Video
    "Insert Video": "Videó beillesztése",
    "Embedded Code": "Kód bemásolása",
    "Paste in a video URL": "Illessze be a videó webcímét",
    "Drop video": "Húzza ide a videót",
    "Your browser does not support HTML5 video.": "A böngészője nem támogatja a HTML5 videókat.",
    "Upload Video": "Videó feltöltése",

    // Tables
    "Insert Table": "Táblázat beillesztése",
    "Table Header": "Táblázat fejléce",
    "Remove Table": "Tábla eltávolítása",
    "Table Style": "Táblázat stílusa",
    "Horizontal Align": "Vízszintes igazítás",
    "Row": "Sor",
    "Insert row above": "Sor beszúrása elé",
    "Insert row below": "Sor beszúrása mögé",
    "Delete row": "Sor törlése",
    "Column": "Oszlop",
    "Insert column before": "Oszlop beszúrása elé",
    "Insert column after": "Oszlop beszúrása mögé",
    "Delete column": "Oszlop törlése",
    "Cell": "Cella",
    "Merge cells": "Cellák egyesítése",
    "Horizontal split": "Vízszintes osztott",
    "Vertical split": "Függőleges osztott",
    "Cell Background": "Cella háttere",
    "Vertical Align": "Függőleges igazítás",
    "Top": "Felső",
    "Middle": "Középső",
    "Bottom": "Alsó",
    "Align Top": "Igazítsa felülre",
    "Align Middle": "Igazítsa középre",
    "Align Bottom": "Igazítsa alúlra",
    "Cell Style": "Cella stílusa",

    // Files
    "Upload File": "Fájl feltöltése",
    "Drop file": "Húzza ide a fájlt",

    // Emoticons
    "Emoticons": "Hangulatjelek",
    "Grinning face": "Vigyorgó arc",
    "Grinning face with smiling eyes": "Vigyorgó arc mosolygó szemekkel",
    "Face with tears of joy": "Arcon az öröm könnyei",
    "Smiling face with open mouth": "Mosolygó arc tátott szájjal",
    "Smiling face with open mouth and smiling eyes": "Mosolygó arc tátott szájjal és mosolygó szemek",
    "Smiling face with open mouth and cold sweat": "Mosolygó arc tátott szájjal és hideg veríték",
    "Smiling face with open mouth and tightly-closed eyes": "Mosolygó arc tátott szájjal és lehunyt szemmel",
    "Smiling face with halo": "Mosolygó arc dicsfényben",
    "Smiling face with horns": "Mosolygó arc szarvakkal",
    "Winking face": "Kacsintós arc",
    "Smiling face with smiling eyes": "Mosolygó arc mosolygó szemekkel",
    "Face savoring delicious food": "Ízletes ételek kóstolása",
    "Relieved face": "Megkönnyebbült arc",
    "Smiling face with heart-shaped eyes": "Mosolygó arc szív alakú szemekkel",
    "Smilin g face with sunglasses": "Mosolygó arc napszemüvegben",
    "Smirking face": "Vigyorgó arc",
    "Neutral face": "Semleges arc",
    "Expressionless face": "Kifejezéstelen arc",
    "Unamused face": "Unott arc",
    "Face with cold sweat": "Arcán hideg verejtékkel",
    "Pensive face": "Töprengő arc",
    "Confused face": "Zavaros arc",
    "Confounded face": "Rácáfolt arc",
    "Kissing face": "Csókos arc",
    "Face throwing a kiss": "Arcra dobott egy csókot",
    "Kissing face with smiling eyes": "Csókos arcán mosolygó szemek",
    "Kissing face with closed eyes": "Csókos arcán csukott szemmel",
    "Face with stuck out tongue": "Kinyújototta a nyelvét",
    "Face with stuck out tongue and winking eye": "Kinyújtotta a nyelvét és kacsintó szem",
    "Face with stuck out tongue and tightly-closed eyes": "Kinyújtotta a nyelvét és szorosan lehunyt szemmel",
    "Disappointed face": "Csalódott arc",
    "Worried face": "Aggódó arc",
    "Angry face": "Dühös arc",
    "Pouting face": "Duzzogó arc",
    "Crying face": "Síró arc",
    "Persevering face": "Kitartó arc",
    "Face with look of triumph": "Arcát diadalmas pillantást",
    "Disappointed but relieved face": "Csalódott, de megkönnyebbült arc",
    "Frowning face with open mouth": "Komor arc tátott szájjal",
    "Anguished face": "Gyötrődő arc",
    "Fearful face": "Félelmetes arc",
    "Weary face": "Fáradt arc",
    "Sleepy face": "Álmos arc",
    "Tired face": "Fáradt arc",
    "Grimacing face": "Elfintorodott arc",
    "Loudly crying face": "Hangosan síró arc",
    "Face with open mouth": "Arc nyitott szájjal",
    "Hushed face": "Csitított arc",
    "Face with open mouth and cold sweat": "Arc tátott szájjal és hideg veríték",
    "Face screaming in fear": "Sikoltozó arc a félelemtől",
    "Astonished face": "Meglepett arc",
    "Flushed face": "Kipirult arc",
    "Sleeping face": "Alvó arc",
    "Dizzy face": " Szádülő arc",
    "Face without mouth": "Arc nélküli száj",
    "Face with medical mask": "Arcán orvosi maszk",

    // Line breaker
    "Break": "Törés",

    // Math
    "Subscript": "Alsó index",
    "Superscript": "Felső index",

    // Full screen
    "Fullscreen": "Teljes képernyő",

    // Horizontal line
    "Insert Horizontal Line": "Vízszintes vonal",

    // Clear formatting
    "Clear Formatting": "Formázás eltávolítása",

    // Save
    "Save": "Mentés",

    // Undo, redo
    "Undo": "Visszavonás",
    "Redo": "Ismét",

    // Select all
    "Select All": "Minden kijelölése",

    // Code view
    "Code View": "Forráskód",

    // Quote
    "Quote": "Idézet",
    "Increase": "Növelés",
    "Decrease": "Csökkentés",

    // Quick Insert
    "Quick Insert": "Beillesztés",

    // Spcial Characters
    "Special Characters": "Speciális karakterek",
    "Latin": "Latin",
    "Greek": "Görög",
    "Cyrillic": "Cirill",
    "Punctuation": "Központozás",
    "Currency": "Valuta",
    "Arrows": "Nyilak",
    "Math": "Matematikai",
    "Misc": "Egyéb",

    // Print
    "Print": "Nyomtatás",

    // Spell Checker
    "Spell Checker": "Helyesírás-ellenőrző",

    // Help
    "Help": "Segítség",
    "Shortcuts": "Hivatkozások",
    "Inline Editor": "Inline szerkesztő",
    "Show the editor": "Mutassa a szerkesztőt",
    "Common actions": "Közös cselekvések",
    "Copy": "Másolás",
    "Cut": "Kivágás",
    "Paste": "Beillesztés",
    "Basic Formatting": "Alap formázás",
    "Increase quote level": "Növeli az idézet behúzását",
    "Decrease quote level": "Csökkenti az idézet behúzását",
    "Image / Video": "Kép / videó",
    "Resize larger": "Méretezés nagyobbra",
    "Resize smaller": "Méretezés kisebbre",
    "Table": "Asztal",
    "Select table cell": "Válasszon táblázat cellát",
    "Extend selection one cell": "Növelje meg egy sorral",
    "Extend selection one row": "Csökkentse egy sorral",
    "Navigation": "Navigáció",
    "Focus popup / toolbar": "Felugró ablak / eszköztár",
    "Return focus to previous position": "Visszaáll az előző pozícióra",

    // Embed.ly
    "Embed URL": "Beágyazott webcím",
    "Paste in a URL to embed": "Beilleszteni egy webcímet a beágyazáshoz",

    // Word Paste
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "A beillesztett tartalom egy Microsoft Word dokumentumból származik. Szeretné megtartani a formázását vagy sem?",
    "Keep": "Megtartás",
    "Clean": "Tisztítás",
    "Word Paste Detected": "Word beillesztés észlelhető",

    // October CMS
    "Insert Audio": "Audió beillesztése",
    "Insert File": "Fájl beillesztése"
  },
  direction: "ltr"
};

}));
