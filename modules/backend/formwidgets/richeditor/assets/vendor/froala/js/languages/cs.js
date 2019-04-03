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
 * Czech
 */

$.FE.LANGUAGE['cs'] = {
  translation: {
    // Place holder
    "Type something": "Napi\u0161te n\u011bco",

    // Basic formatting
    "Bold": "Tu\u010dn\u00e9",
    "Italic": "Kurz\u00edva",
    "Underline": "Podtr\u017een\u00e9",
    "Strikethrough": "P\u0159e\u0161krtnut\u00e9",

    // Main buttons
    "Insert": "Vlo\u017eit",
    "Delete": "Vymazat",
    "Cancel": "Zru\u0161it",
    "OK": "OK",
    "Back": "Zp\u011bt",
    "Remove": "Odstranit",
    "More": "V\u00edce",
    "Update": "Aktualizovat",
    "Style": "Styl",

    // Font
    "Font Family": "Typ p\u00edsma",
    "Font Size": "Velikost p\u00edsma",

    // Colors
    "Colors": "Barvy",
    "Background": "Pozad\u00ed",
    "Text": "P\u00edsmo",
    "HEX Color": "Hex Barvy",

    // Paragraphs
    "Paragraph Format": "Form\u00e1t odstavec",
    "Normal": "Norm\u00e1ln\u00ed",
    "Code": "K\u00f3d",
    "Heading 1": "Nadpis 1",
    "Heading 2": "Nadpis 2",
    "Heading 3": "Nadpis 3",
    "Heading 4": "Nadpis 4",

    // Style
    "Paragraph Style": "Odstavec styl",
    "Inline Style": "Inline styl",

    // Alignment
    "Align": "Zarovn\u00e1n\u00ed",
    "Align Left": "Zarovnat vlevo",
    "Align Center": "Zarovnat na st\u0159ed",
    "Align Right": "Zarovnat vpravo",
    "Align Justify": "Zarovnat do bloku",
    "None": "Nikdo",

    // Lists
    "Ordered List": "\u010c\u00edslovan\u00fd seznam",
    "Default": "Výchozí",
    "Lower Alpha": "Nižší alfa",
    "Lower Greek": "Nižší řečtina",
    "Lower Roman": "Nižší římský",
    "Upper Alpha": "Horní alfa",
    "Upper Roman": "Horní římský",

    "Unordered List": "Ne\u010d\u00edslovan\u00fd seznam",
    "Circle": "Kruh",
    "Disc": "Disk",
    "Square": "Náměstí",

    // Line height
    "Line Height": "Výška řádku",
    "Single": "Singl",
    "Double": "Dvojnásobek",

    // Indent
    "Decrease Indent": "Zmen\u0161it odsazen\u00ed",
    "Increase Indent": "Zv\u011bt\u0161it odsazen\u00ed",

    // Links
    "Insert Link": "Vlo\u017eit odkaz",
    "Open in new tab": "Otev\u0159\u00edt v nov\u00e9 z\u00e1lo\u017ece",
    "Open Link": "Otev\u0159\u00edt odkaz",
    "Edit Link": "Upravit odkaz",
    "Unlink": "Odstranit odkaz",
    "Choose Link": "Zvolte odkaz",

    // Images
    "Insert Image": "Vlo\u017eit obr\u00e1zek",
    "Upload Image": "Nahr\u00e1t obr\u00e1zek",
    "By URL": "Podle URL",
    "Browse": "Proch\u00e1zet",
    "Drop image": "P\u0159et\u00e1hn\u011bte sem obr\u00e1zek",
    "or click": "nebo zde klepn\u011bte",
    "Manage Images": "Spr\u00e1va obr\u00e1zk\u016f",
    "Loading": "Nakl\u00e1d\u00e1n\u00ed",
    "Deleting": "Odstran\u011bn\u00ed",
    "Tags": "Zna\u010dky",
    "Are you sure? Image will be deleted.": "Ur\u010dit\u011b? Obr\u00e1zek bude smaz\u00e1n.",
    "Replace": "Nahradit",
    "Uploading": "Nahr\u00e1v\u00e1n\u00ed",
    "Loading image": "Obr\u00e1zek se na\u010d\u00edt\u00e1",
    "Display": "Zobrazit",
    "Inline": "Inline",
    "Break Text": "P\u0159est\u00e1vka textu",
    "Alternative Text": "Alternativn\u00ed textu",
    "Change Size": "Zm\u011bnit velikost",
    "Width": "\u0160\u00ed\u0159ka",
    "Height": "V\u00fd\u0161ka",
    "Something went wrong. Please try again.": "N\u011bco se pokazilo. Pros\u00edm zkuste to znovu.",
    "Image Caption": "Obrázek titulku",
    "Advanced Edit": "Pokročilá úprava",

    // Video
    "Insert Video": "Vlo\u017eit video",
    "Embedded Code": "Vlo\u017een\u00fd k\u00f3d",
    "Paste in a video URL": "Vložit adresu URL videa",
    "Drop video": "Drop video",
    "Your browser does not support HTML5 video.": "Váš prohlížeč nepodporuje video html5.",
    "Upload Video": "Nahrát video",

    // Tables
    "Insert Table": "Vlo\u017eit tabulku",
    "Table Header": "Hlavi\u010dka tabulky",
    "Remove Table": "Odstranit tabulku",
    "Table Style": "Styl tabulky",
    "Horizontal Align": "Horizont\u00e1ln\u00ed zarovn\u00e1n\u00ed",
    "Row": "\u0158\u00e1dek",
    "Insert row above": "Vlo\u017eit \u0159\u00e1dek nad",
    "Insert row below": "Vlo\u017eit \u0159\u00e1dek pod",
    "Delete row": "Smazat \u0159\u00e1dek",
    "Column": "Sloupec",
    "Insert column before": "Vlo\u017eit sloupec vlevo",
    "Insert column after": "Vlo\u017eit sloupec vpravo",
    "Delete column": "Smazat sloupec",
    "Cell": "Bu\u0148ka",
    "Merge cells": "Slou\u010dit bu\u0148ky",
    "Horizontal split": "Horizont\u00e1ln\u00ed rozd\u011blen\u00ed",
    "Vertical split": "Vertik\u00e1ln\u00ed rozd\u011blen\u00ed",
    "Cell Background": "Bu\u0148ka pozad\u00ed",
    "Vertical Align": "Vertik\u00e1ln\u00ed zarovn\u00e1n\u00ed",
    "Top": "Vrchol",
    "Middle": "St\u0159ed",
    "Bottom": "Spodn\u00ed",
    "Align Top": "Zarovnat vrchol",
    "Align Middle": "Zarovnat st\u0159ed",
    "Align Bottom": "Zarovnat spodn\u00ed",
    "Cell Style": "Styl bu\u0148ky",

    // Files
    "Upload File": "Nahr\u00e1t soubor",
    "Drop file": "P\u0159et\u00e1hn\u011bte sem soubor",

    // Emoticons
    "Emoticons": "Emotikony",
    "Grinning face": "S \u00fasm\u011bvem tv\u00e1\u0159",
    "Grinning face with smiling eyes": "S \u00fasm\u011bvem obli\u010dej s o\u010dima s \u00fasm\u011bvem",
    "Face with tears of joy": "tv\u00e1\u0159 se slzami radosti",
    "Smiling face with open mouth": "Usm\u00edvaj\u00edc\u00ed se obli\u010dej s otev\u0159en\u00fdmi \u00fasty",
    "Smiling face with open mouth and smiling eyes": "Usm\u00edvaj\u00edc\u00ed se obli\u010dej s otev\u0159en\u00fdmi \u00fasty a o\u010dima s \u00fasm\u011bvem",
    "Smiling face with open mouth and cold sweat": "Usm\u00edvaj\u00edc\u00ed se tv\u00e1\u0159 s otev\u0159en\u00fdmi \u00fasty a studen\u00fd pot",
    "Smiling face with open mouth and tightly-closed eyes": "Usm\u00edvaj\u00edc\u00ed se tv\u00e1\u0159 s otev\u0159en\u00fdmi \u00fasty a t\u011bsn\u011b zav\u0159en\u00e9 o\u010di",
    "Smiling face with halo": "Usm\u00edvaj\u00edc\u00ed se obli\u010dej s halo",
    "Smiling face with horns": "Usm\u00edvaj\u00edc\u00ed se obli\u010dej s  rohy",
    "Winking face": "Mrk\u00e1n\u00ed tv\u00e1\u0159",
    "Smiling face with smiling eyes": "Usm\u00edvaj\u00edc\u00ed se obli\u010dej s  o\u010dima s \u00fasm\u011bvem",
    "Face savoring delicious food": "Tv\u00e1\u0159 vychutn\u00e1val chutn\u00e9 j\u00eddlo",
    "Relieved face": "Ulevilo tv\u00e1\u0159",
    "Smiling face with heart-shaped eyes": "Usm\u00edvaj\u00edc\u00ed se tv\u00e1\u0159 ve tvaru srdce o\u010dima",
    "Smiling face with sunglasses": "Usm\u00edvaj\u00edc\u00ed se tv\u00e1\u0159 se slune\u010dn\u00edmi br\u00fdlemi",
    "Smirking face": "Uculoval tv\u00e1\u0159",
    "Neutral face": "Neutr\u00e1ln\u00ed tv\u00e1\u0159",
    "Expressionless face": "Bezv\u00fdrazn\u00fd obli\u010dej",
    "Unamused face": "Ne pobaven\u00fd tv\u00e1\u0159",
    "Face with cold sweat": "Tv\u00e1\u0159 se studen\u00fdm potem",
    "Pensive face": "Zamy\u0161len\u00fd obli\u010dej",
    "Confused face": "Zmaten\u00fd tv\u00e1\u0159",
    "Confounded face": "Na\u0161tvan\u00fd tv\u00e1\u0159",
    "Kissing face": "L\u00edb\u00e1n\u00ed tv\u00e1\u0159",
    "Face throwing a kiss": "Tv\u00e1\u0159 h\u00e1zet polibek",
    "Kissing face with smiling eyes": "L\u00edb\u00e1n\u00ed obli\u010dej s o\u010dima s \u00fasm\u011bvem",
    "Kissing face with closed eyes": "L\u00edb\u00e1n\u00ed tv\u00e1\u0159 se zav\u0159en\u00fdma o\u010dima",
    "Face with stuck out tongue": "Tv\u00e1\u0159 s tr\u010dely jazyk",
    "Face with stuck out tongue and winking eye": "Tv\u00e1\u0159 s tr\u010dely jazykem a mrkat o\u010dima",
    "Face with stuck out tongue and tightly-closed eyes": "Suo\u010diti s tr\u010dely jazykem t\u011bsn\u011b zav\u0159en\u00e9 vidikovce",
    "Disappointed face": "Zklaman\u00fd tv\u00e1\u0159",
    "Worried face": "Boj\u00ed\u0161 se tv\u00e1\u0159",
    "Angry face": "Rozzloben\u00fd tv\u00e1\u0159",
    "Pouting face": "Na\u0161pulen\u00e9 tv\u00e1\u0159",
    "Crying face": "Pl\u00e1\u010d tv\u00e1\u0159",
    "Persevering face": "Vytrval\u00fdm tv\u00e1\u0159",
    "Face with look of triumph": "Tv\u00e1\u0159 s v\u00fdrazem triumfu",
    "Disappointed but relieved face": "Zklaman\u00fd ale ulevilo tv\u00e1\u0159",
    "Frowning face with open mouth": "Zamra\u010dil se obli\u010dej s otev\u0159en\u00fdmi \u00fasty",
    "Anguished face": "\u00fazkostn\u00e9 tv\u00e1\u0159",
    "Fearful face": "Stra\u0161n\u00fd tv\u00e1\u0159",
    "Weary face": "Unaven\u00fd tv\u00e1\u0159",
    "Sleepy face": "Ospal\u00fd tv\u00e1\u0159",
    "Tired face": "Unaven\u00fd tv\u00e1\u0159",
    "Grimacing face": "\u0161klebil tv\u00e1\u0159",
    "Loudly crying face": "Hlasit\u011b pl\u00e1\u010de tv\u00e1\u0159",
    "Face with open mouth": "Obli\u010dej s otev\u0159en\u00fdmi \u00fasty",
    "Hushed face": "Tlumen\u00fd tv\u00e1\u0159",
    "Face with open mouth and cold sweat": "Obli\u010dej s otev\u0159en\u00fdmi \u00fasty a studen\u00fd pot",
    "Face screaming in fear": "Tv\u00e1\u0159 k\u0159i\u010d\u00ed ve strachu",
    "Astonished face": "V \u00fa\u017easu tv\u00e1\u0159",
    "Flushed face": "Zarudnut\u00ed v obli\u010deji",
    "Sleeping face": "Sp\u00edc\u00ed tv\u00e1\u0159",
    "Dizzy face": "Z\u00e1vrat\u011b tv\u00e1\u0159",
    "Face without mouth": "Tv\u00e1\u0159 bez \u00fast",
    "Face with medical mask": "Tv\u00e1\u0159 s l\u00e9ka\u0159sk\u00fdm maskou",

    // Line breaker
    "Break": "P\u0159eru\u0161en\u00ed",

    // Math
    "Subscript": "Doln\u00ed index",
    "Superscript": "Horn\u00ed index",

    // Full screen
    "Fullscreen": "Cel\u00e1 obrazovka",

    // Horizontal line
    "Insert Horizontal Line": "Vlo\u017eit vodorovnou \u010d\u00e1ru",

    // Clear formatting
    "Clear Formatting": "Vymazat form\u00e1tov\u00e1n\u00ed",

    // Save
    "Save": "\u0055\u006c\u006f\u017e\u0069\u0074",

    // Undo, redo
    "Undo": "Zp\u011bt",
    "Redo": "Znovu",

    // Select all
    "Select All": "Vybrat v\u0161e",

    // Code view
    "Code View": "Zobrazen\u00ed k\u00f3d",

    // Quote
    "Quote": "Cit\u00e1t",
    "Increase": "Nav\u00fd\u0161it",
    "Decrease": "Sn\u00ed\u017een\u00ed",

    // Quick Insert
    "Quick Insert": "Rychl\u00e1 vlo\u017eka",

    // Spcial Characters
    "Special Characters": "Speciální znaky",
    "Latin": "Latinský",
    "Greek": "Řecký",
    "Cyrillic": "Cyrilice",
    "Punctuation": "Interpunkce",
    "Currency": "Měna",
    "Arrows": "Šipky",
    "Math": "Matematika",
    "Misc": "Misc",

    // Print.
    "Print": "Tisk",

    // Spell Checker.
    "Spell Checker": "Kontrola pravopisu",

    // Help
    "Help": "Pomoc",
    "Shortcuts": "Zkratky",
    "Inline Editor": "Inline editor",
    "Show the editor": "Zobrazit editor",
    "Common actions": "Společné akce",
    "Copy": "Kopírovat",
    "Cut": "Střih",
    "Paste": "Vložit",
    "Basic Formatting": "Základní formátování",
    "Increase quote level": "Zvýšení cenové hladiny",
    "Decrease quote level": "Snížit úroveň cenové nabídky",
    "Image / Video": "Obraz / video",
    "Resize larger": "Změna velikosti větší",
    "Resize smaller": "Změnit velikost menší",
    "Table": "Stůl",
    "Select table cell": "Vyberte buňku tabulky",
    "Extend selection one cell": "Rozšířit výběr o jednu buňku",
    "Extend selection one row": "Rozšířit výběr o jeden řádek",
    "Navigation": "Navigace",
    "Focus popup / toolbar": "Popup / panel nástrojů zaostření",
    "Return focus to previous position": "Návrat na předchozí pozici",

    // Embed.ly
    "Embed URL": "Vložte url",
    "Paste in a URL to embed": "Vložit adresu URL, kterou chcete vložit",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "Vložený obsah pochází z dokumentu Microsoft Word. chcete formát uchovat nebo jej vyčistit?",
    "Keep": "Držet",
    "Clean": "Čistý",
    "Word Paste Detected": "Slovní vložka zjištěna"
  },
  direction: "ltr"
};

}));
