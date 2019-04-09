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
 * Slovak
 */

$.FE.LANGUAGE['sk'] = {
  translation: {

    // Place holder
    "Type something": "Nap\u00ed\u0161te hoci\u010do",

    // Basic formatting
    "Bold": "Tu\u010dn\u00e9",
    "Italic": "Kurz\u00edva",
    "Underline": "Pod\u010diarknut\u00e9",
    "Strikethrough": "Pre\u0161krtnut\u00e9",

    // Main buttons
    "Insert": "Vlo\u017ei\u0165",
    "Delete": "Vymaza\u0165",
    "Cancel": "Zru\u0161i\u0165",
    "OK": "OK",
    "Back": "Sp\u00e4\u0165",
    "Remove": "Odstr\u00e1ni\u0165",
    "More": "Viac",
    "Update": "Aktualizova\u0165",
    "Style": "\u0165t\u00fdl",

    // Font
    "Font Family": "Typ p\u00edsma",
    "Font Size": "Ve\u013ekos\u0165 p\u00edsma",

    // Colors
    "Colors": "Farby",
    "Background": "Pozadie",
    "Text": "Text",
    "HEX Color": "Hex Farby",

    // Paragraphs
    "Paragraph Format": "Form\u00e1t odstavca",
    "Normal": "Norm\u00e1lne",
    "Code": "K\u00f3d",
    "Heading 1": "Nadpis 1",
    "Heading 2": "Nadpis 2",
    "Heading 3": "Nadpis 3",
    "Heading 4": "Nadpis 4",

    // Style
    "Paragraph Style": "\u0165t\u00fdl odstavca",
    "Inline Style": "Inline \u0161t\u00fdl",

    // Alignment
    "Align": "Zarovnanie",
    "Align Left": "Zarovna\u0165 v\u013eavo",
    "Align Center": "Zarovna\u0165 na stred",
    "Align Right": "Zarovna\u0165 vpravo",
    "Align Justify": "Zarovna\u0165 do bloku",
    "None": "\u017diadne",

    // Lists
    "Ordered List": "\u010c\u00edslovan\u00fd zoznam",
    "Default": "Štandardné",
    "Lower Alpha": "Nižšia alfa",
    "Lower Greek": "Nižšie grécke",
    "Lower Roman": "Nižší roman",
    "Upper Alpha": "Horná alfa",
    "Upper Roman": "Horný román",

    "Unordered List": "Ne\u010d\u00edslovan\u00fd zoznam",
    "Circle": "Kružnice",
    "Disc": "Kotúč",
    "Square": "Námestie",

    // Line height
    "Line Height": "Výška riadku",
    "Single": "Jednoposteľová",
    "Double": "Dvojitý",

    // Indent
    "Decrease Indent": "Zmen\u0161i\u0165 odsadenie",
    "Increase Indent": "Zv\u00e4\u010d\u0161i\u0165 odsadenie",

    // Links
    "Insert Link": "Vlo\u017ei\u0165 odkaz",
    "Open in new tab": "Otvori\u0165 v novom okne",
    "Open Link": "Otvori\u0165 odkaz",
    "Edit Link": "Upravi\u0165 odkaz",
    "Unlink": "Odstr\u00e1ni\u0165 odkaz",
    "Choose Link": "Vyberte odkaz",

    // Images
    "Insert Image": "Vlo\u017ei\u0165 obr\u00e1zok",
    "Upload Image": "Nahra\u0165 obr\u00e1zok",
    "By URL": "Z URL adresy",
    "Browse": "Vybra\u0165",
    "Drop image": "Pretiahnite obr\u00e1zok do tohto miesta",
    "or click": "alebo kliknite a vlo\u017ete",
    "Manage Images": "Spr\u00e1va obr\u00e1zkov",
    "Loading": "Nahr\u00e1vam",
    "Deleting": "Odstra\u0148ujem",
    "Tags": "Zna\u010dky",
    "Are you sure? Image will be deleted.": "Ste si ist\u00fd? Obr\u00e1zok bude odstranen\u00fd.",
    "Replace": "Vymeni\u0165",
    "Uploading": "Nahr\u00e1vam",
    "Loading image": "Obr\u00e1zok se na\u010d\u00edtav\u00e1",
    "Display": "Zobrazi\u0165",
    "Inline": "Inline",
    "Break Text": "Zalomenie textu",
    "Alternative Text": "Alternat\u00edvny text",
    "Change Size": "Zmeni\u0165 ve\u013ekos\u0165",
    "Width": "\u0165\u00edrka",
    "Height": "V\u00fd\u0161ka",
    "Something went wrong. Please try again.": "Nie\u010do sa pokazilo. Pros\u00edm, sk\u00faste to znova.",
    "Image Caption": "Titulok obrázka",
    "Advanced Edit": "Pokročilá úprava",

    // Video
    "Insert Video": "Vlo\u017ei\u0165 video",
    "Embedded Code": "Vlo\u017een\u00fd k\u00f3d",
    "Paste in a video URL": "Vložte do adresy URL videa",
    "Drop video": "Drop video",
    "Your browser does not support HTML5 video.": "Váš prehliadač nepodporuje video html5.",
    "Upload Video": "Nahrať video",

    // Tables
    "Insert Table": "Vlo\u017ei\u0165 tabu\u013eku",
    "Table Header": "Hlavi\u010dka tabu\u013eky",
    "Remove Table": "Odstrani\u0165 tabu\u013eku",
    "Table Style": "\u0165t\u00fdl tabu\u013eky",
    "Horizontal Align": "Horizont\u00e1lne zarovnanie",
    "Row": "Riadok",
    "Insert row above": "Vlo\u017ei\u0165 riadok nad",
    "Insert row below": "Vlo\u017ei\u0165 riadok pod",
    "Delete row": "Odstrani\u0165 riadok",
    "Column": "St\u013apec",
    "Insert column before": "Vlo\u017ei\u0165 st\u013apec v\u013eavo",
    "Insert column after": "Vlo\u017ei\u0165 st\u013apec vpravo",
    "Delete column": "Odstrani\u0165 st\u013apec",
    "Cell": "Bunka",
    "Merge cells": "Zl\u00fa\u010di\u0165 bunky",
    "Horizontal split": "Horizont\u00e1lne rozdelenie",
    "Vertical split": "Vertik\u00e1lne rozdelenie",
    "Cell Background": "Bunka pozadia",
    "Vertical Align": "Vertik\u00e1lne zarovn\u00e1n\u00ed",
    "Top": "Vrch",
    "Middle": "Stred",
    "Bottom": "Spodok",
    "Align Top": "Zarovnat na vrch",
    "Align Middle": "Zarovnat na stred",
    "Align Bottom": "Zarovnat na spodok",
    "Cell Style": "\u0165t\u00fdl bunky",

    // Files
    "Upload File": "Nahra\u0165 s\u00fabor",
    "Drop file": "Vlo\u017ete s\u00fabor sem",

    // Emoticons
    "Emoticons": "Emotikony",
    "Grinning face": "Tv\u00e1r s \u00fasmevom",
    "Grinning face with smiling eyes": "Tv\u00e1r s \u00fasmevom a o\u010dami",
    "Face with tears of joy": "Tv\u00e1r so slzamy radosti",
    "Smiling face with open mouth": "Usmievaj\u00faci sa tv\u00e1r s otvoren\u00fdmi \u00fastami",
    "Smiling face with open mouth and smiling eyes": "Usmievaj\u00faci sa tv\u00e1r s otvoren\u00fdmi \u00fastami a o\u010dami",
    "Smiling face with open mouth and cold sweat": "Usmievaj\u00faci sa tv\u00e1r s otvoren\u00fdmi \u00fastami a studen\u00fd pot",
    "Smiling face with open mouth and tightly-closed eyes": "Usmievaj\u00faci sa tv\u00e1r s otvoren\u00fdmi \u00fastami a zavret\u00fdmi o\u010dami",
    "Smiling face with halo": "Usmievaj\u00faci sa tv\u00e1r s halo",
    "Smiling face with horns": "Usmievaj\u00faci sa tv\u00e1r s rohmi",
    "Winking face": "Mrkaj\u00faca tv\u00e1r",
    "Smiling face with smiling eyes": "Usmievaj\u00faci sa tv\u00e1r a o\u010dami",
    "Face savoring delicious food": "Tv\u00e1r vychutn\u00e1vaj\u00faca si chutn\u00e9 jedlo",
    "Relieved face": "Spokojn\u00e1 tv\u00e1r",
    "Smiling face with heart-shaped eyes": "Usmievaj\u00faci sa tv\u00e1r s o\u010dami v tvare srdca",
    "Smiling face with sunglasses": "Usmievaj\u00faci sa tv\u00e1r so slne\u010dn\u00fdmi okuliarmi",
    "Smirking face": "U\u0161k\u0155\u0148aj\u00faca sa tv\u00e1r",
    "Neutral face": "Neutr\u00e1lna tva\u0155",
    "Expressionless face": "Bezv\u00fdrazn\u00e1 tv\u00e1r",
    "Unamused face": "Nepobaven\u00e1 tv\u00e1r",
    "Face with cold sweat": "Tv\u00e1r so studen\u00fdm potom",
    "Pensive face": "Zamyslen\u00e1 tv\u00e1r",
    "Confused face": "Zmeten\u00e1 tv\u00e1r",
    "Confounded face": "Nahnevan\u00e1 tv\u00e1r",
    "Kissing face": "Bozkavaj\u00faca tv\u00e1r",
    "Face throwing a kiss": "Tv\u00e1r hadzaj\u00faca pusu",
    "Kissing face with smiling eyes": "Bozk\u00e1vaj\u00faca tv\u00e1r s o\u010dami a \u00fasmevom",
    "Kissing face with closed eyes": "Bozk\u00e1vaj\u00faca tv\u00e1r so zavret\u00fdmi o\u010dami",
    "Face with stuck out tongue": "Tv\u00e1r s vyplazen\u00fdm jazykom",
    "Face with stuck out tongue and winking eye": "Mrkaj\u00faca tv\u00e1r s vyplazen\u00fdm jazykom",
    "Face with stuck out tongue and tightly-closed eyes": "Tv\u00e1r s vyplazen\u00fdm jazykom a privret\u00fdmi o\u010dami",
    "Disappointed face": "Sklaman\u00e1 tv\u00e1r",
    "Worried face": "Obavaj\u00faca se tv\u00e1r",
    "Angry face": "Nahnevan\u00e1 tv\u00e1r",
    "Pouting face": "Na\u0161pulen\u00e1 tv\u00e1r",
    "Crying face": "Pla\u010d\u00faca tv\u00e1r",
    "Persevering face": "H\u00fa\u017eevnat\u00e1 tv\u00e1r",
    "Face with look of triumph": "Tv\u00e1r s v\u00fdrazom v\u00ed\u0165aza",
    "Disappointed but relieved face": "Sklaman\u00e1 ale spokojn\u00e1 tv\u00e1r",
    "Frowning face with open mouth": "Zamra\u010den\u00e1 tvar s otvoren\u00fdmi \u00fastami",
    "Anguished face": "\u00dazkostn\u00e1 tv\u00e1r",
    "Fearful face": "Strachuj\u00faca sa tv\u00e1r",
    "Weary face": "Unaven\u00e1 tv\u00e1r",
    "Sleepy face": "Ospal\u00e1 tv\u00e1r",
    "Tired face": "Unaven\u00e1 tv\u00e1r",
    "Grimacing face": "Sv\u00e1r s grimasou",
    "Loudly crying face": "Nahlas pl\u00e1\u010d\u00faca tv\u00e1r",
    "Face with open mouth": "Tv\u00e1r s otvoren\u00fdm \u00fastami",
    "Hushed face": "Ml\u010diaca tv\u00e1r",
    "Face with open mouth and cold sweat": "Tv\u00e1r s otvoren\u00fdmi \u00fastami a studen\u00fdm potom",
    "Face screaming in fear": "Tv\u00e1r kri\u010diaca strachom",
    "Astonished face": "Tv\u00e1r v \u00fa\u017ease",
    "Flushed face": "S\u010dervenanie v tv\u00e1ri",
    "Sleeping face": "Spiaca tv\u00e1r",
    "Dizzy face": "Tv\u00e1r vyjadruj\u00faca z\u00e1vrat",
    "Face without mouth": "Tv\u00e1r bez \u00fast",
    "Face with medical mask": "Tv\u00e1r s lek\u00e1rskou maskou",

    // Line breaker
    "Break": "Zalomenie",

    // Math
    "Subscript": "Doln\u00fd index",
    "Superscript": "Horn\u00fd index",

    // Full screen
    "Fullscreen": "Cel\u00e1 obrazovka",

    // Horizontal line
    "Insert Horizontal Line": "Vlo\u017ei\u0165 vodorovn\u00fa \u010diaru",

    // Clear formatting
    "Clear Formatting": "Vymaza\u0165 formatovanie",

    // Save
    "Save": "\u0055\u006c\u006f\u017e\u0069\u0165",

    // Undo, redo
    "Undo": "Sp\u00e4\u0165",
    "Redo": "Znova",

    // Select all
    "Select All": "Vybra\u0165 v\u0161etko",

    // Code view
    "Code View": "Zobrazi\u0165 html k\u00f3d",

    // Quote
    "Quote": "Cit\u00e1t",
    "Increase": "Nav\u00fd\u0161i\u0165",
    "Decrease": "Zn\u00ed\u017ei\u0165",

    // Quick Insert
    "Quick Insert": "Vlo\u017ei\u0165 zr\u00fdchlene",

    // Spcial Characters
    "Special Characters": "Špeciálne znaky",
    "Latin": "Latinčina",
    "Greek": "Grécky",
    "Cyrillic": "Cyriliky",
    "Punctuation": "Interpunkcia",
    "Currency": "Mena",
    "Arrows": "Šípky",
    "Math": "Matematika",
    "Misc": "Misc",

    // Print.
    "Print": "Vytlačiť",

    // Spell Checker.
    "Spell Checker": "Kontrola pravopisu",

    // Help
    "Help": "Pomoc",
    "Shortcuts": "Skratky",
    "Inline Editor": "Inline editor",
    "Show the editor": "Zobraziť editor",
    "Common actions": "Spoločné akcie",
    "Copy": "Kópie",
    "Cut": "Rez",
    "Paste": "Pasta",
    "Basic Formatting": "Základné formátovanie",
    "Increase quote level": "Zvýšiť úroveň cenovej ponuky",
    "Decrease quote level": "Znížiť úroveň cenovej ponuky",
    "Image / Video": "Obrázok / video",
    "Resize larger": "Zmena veľkosti",
    "Resize smaller": "Meniť veľkosť",
    "Table": "Stôl",
    "Select table cell": "Vyberte bunku tabuľky",
    "Extend selection one cell": "Rozšíriť výber jednej bunky",
    "Extend selection one row": "Rozšíriť výber o jeden riadok",
    "Navigation": "Navigácia",
    "Focus popup / toolbar": "Zameranie / panel s nástrojmi",
    "Return focus to previous position": "Vrátiť zaostrenie na predchádzajúcu pozíciu",

    // Embed.ly
    "Embed URL": "Vložiť adresu URL",
    "Paste in a URL to embed": "Vložte do adresy URL, ktorú chcete vložiť",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "Vložený obsah vychádza z dokumentu Microsoft Word. chcete formát uchovať alebo ho vyčistiť?",
    "Keep": "Zachovať",
    "Clean": "Čistý",
    "Word Paste Detected": "Slovná vložka bola zistená"
  },
  direction: "ltr"
};
}));
