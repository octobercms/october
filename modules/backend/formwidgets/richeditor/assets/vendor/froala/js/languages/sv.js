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
 * Swedish
 */

$.FE.LANGUAGE['sv'] = {
  translation: {
    // Place holder
    "Type something": "Ange n\u00e5got",

    // Basic formatting
    "Bold": "Fetstil",
    "Italic": "Kursiv stil",
    "Underline": "Understruken",
    "Strikethrough": "Genomstruken",

    // Main buttons
    "Insert": "Infoga",
    "Delete": "Radera",
    "Cancel": "Avbryt",
    "OK": "Ok",
    "Back": "Tillbaka",
    "Remove": "Ta bort",
    "More": "Mer",
    "Update": "Uppdatera",
    "Style": "Stil",

    // Font
    "Font Family": "Teckensnitt",
    "Font Size": "Teckenstorlek",

    // Colors
    "Colors": "F\u00e4rger",
    "Background": "Bakgrund",
    "Text": "Text",
    "HEX Color": "Hex färg",

    // Paragraphs
    "Paragraph Format": "Format",
    "Normal": "Normal",
    "Code": "Kod",
    "Heading 1": "Rubrik 1",
    "Heading 2": "Rubrik 2",
    "Heading 3": "Rubrik 3",
    "Heading 4": "Rubrik 4",

    // Style
    "Paragraph Style": "Styckesformat",
    "Inline Style": "Infogad stil",

    // Alignment
    "Align": "Justera",
    "Align Left": "Vänsterjustera",
    "Align Center": "Centrera",
    "Align Right": "Högerjustera",
    "Align Justify": "Justera",
    "None": "Inget",

    // Lists
    "Ordered List": "Ordnad lista",
    "Default": "Standard",
    "Lower Alpha": "Lägre alfa",
    "Lower Greek": "Lägre grekiska",
    "Lower Roman": "Lägre roman",
    "Upper Alpha": "Övre alfa",
    "Upper Roman": "Övre roman",

    "Unordered List": "Oordnad lista",
    "Circle": "Cirkel",
    "Disc": "Skiva",
    "Square": "Fyrkant",

    // Line height
    "Line Height": "Radavstånd",
    "Single": "Enda",
    "Double": "Dubbel",

    // Indent
    "Decrease Indent": "Minska indrag",
    "Increase Indent": "\u00d6ka indrag",

    // Links
    "Insert Link": "Infoga l\u00e4nk",
    "Open in new tab": "\u00d6ppna i ny flik",
    "Open Link": "\u00d6ppna l\u00e4nk",
    "Edit Link": "Redigera l\u00e4nk",
    "Unlink": "Ta bort l\u00e4nk",
    "Choose Link": "V\u00e4lj l\u00e4nk",

    // Images
    "Insert Image": "Infoga bild",
    "Upload Image": "Ladda upp en bild",
    "By URL": "Genom URL",
    "Browse": "Bl\u00e4ddra",
    "Drop image": "Sl\u00e4pp bild",
    "or click": "eller klicka",
    "Manage Images": "Hantera bilder",
    "Loading": "Laddar",
    "Deleting": "Raderar",
    "Tags": "Etiketter",
    "Are you sure? Image will be deleted.": "\u00c4r du s\u00e4ker? Bild kommer att raderas.",
    "Replace": "Ers\u00e4tt",
    "Uploading": "Laddar up",
    "Loading image": "Laddar bild",
    "Display": "Visa",
    "Inline": "I linje",
    "Break Text": "Bryt text",
    "Alternative Text": "Alternativ text",
    "Change Size": "\u00c4ndra storlek",
    "Width": "Bredd",
    "Height": "H\u00f6jd",
    "Something went wrong. Please try again.": "N\u00e5got gick fel. Var god f\u00f6rs\u00f6k igen.",
    "Image Caption": "Bildtext",
    "Advanced Edit": "Avancerad redigering",

    // Video
    "Insert Video": "Infoga video",
    "Embedded Code": "Inb\u00e4ddad kod",
    "Paste in a video URL": "Klistra in i en video url",
    "Drop video": "Släpp video",
    "Your browser does not support HTML5 video.": "Din webbläsare stöder inte html5-video.",
    "Upload Video": "Ladda upp video",

    // Tables
    "Insert Table": "Infoga tabell",
    "Table Header": "Tabell huvud",
    "Remove Table": "Ta bort tabellen",
    "Table Style": "Tabellformat",
    "Horizontal Align": "Horisontell justering",
    "Row": "Rad",
    "Insert row above": "Infoga rad f\u00f6re",
    "Insert row below": "Infoga rad efter",
    "Delete row": "Ta bort rad",
    "Column": "Kolumn",
    "Insert column before": "Infoga kollumn f\u00f6re",
    "Insert column after": "Infoga kolumn efter",
    "Delete column": "Ta bort kolumn",
    "Cell": "Cell",
    "Merge cells": "Sammanfoga celler",
    "Horizontal split": "Dela horisontellt",
    "Vertical split": "Dela vertikalt",
    "Cell Background": "Cellbakgrund",
    "Vertical Align": "Vertikal justering",
    "Top": "Överst",
    "Middle": "Mitten",
    "Bottom": "Nederst",
    "Align Top": "Justera överst",
    "Align Middle": "Justera mitten",
    "Align Bottom": "Justera nederst",
    "Cell Style": "Cellformat",

    // Files
    "Upload File": "Ladda upp fil",
    "Drop file": "Sl\u00e4pp fil",

    // Emoticons
    "Emoticons": "Uttryckssymboler",
    "Grinning face": "Grina ansikte",
    "Grinning face with smiling eyes": "Grina ansikte med leende \u00f6gon",
    "Face with tears of joy": "Face med gl\u00e4djet\u00e5rar",
    "Smiling face with open mouth": "Leende ansikte med \u00f6ppen mun",
    "Smiling face with open mouth and smiling eyes": "Leende ansikte med \u00f6ppen mun och leende \u00f6gon",
    "Smiling face with open mouth and cold sweat": "Leende ansikte med \u00f6ppen mun och kallsvett",
    "Smiling face with open mouth and tightly-closed eyes": "Leende ansikte med \u00f6ppen mun och t\u00e4tt slutna \u00f6gon",
    "Smiling face with halo": "Leende ansikte med halo",
    "Smiling face with horns": "Leende ansikte med horn",
    "Winking face": "Blinka ansikte",
    "Smiling face with smiling eyes": "Leende ansikte med leende \u00f6gon",
    "Face savoring delicious food": "Ansikte smaka uts\u00f6kt mat",
    "Relieved face": "L\u00e4ttad ansikte",
    "Smiling face with heart-shaped eyes": "Leende ansikte med hj\u00e4rtformade \u00f6gon",
    "Smiling face with sunglasses": "Leende ansikte med solglas\u00f6gon",
    "Smirking face": "Flinande ansikte",
    "Neutral face": "Neutral ansikte",
    "Expressionless face": "Uttryckslöst ansikte",
    "Unamused face": "Inte roade ansikte",
    "Face with cold sweat": "Ansikte med kallsvett",
    "Pensive face": "Eftert\u00e4nksamt ansikte",
    "Confused face": "F\u00f6rvirrad ansikte",
    "Confounded face": "F\u00f6rbryllade ansikte",
    "Kissing face": "Kyssande ansikte",
    "Face throwing a kiss": "Ansikte kasta en kyss",
    "Kissing face with smiling eyes": "Kyssa ansikte med leende \u00f6gon",
    "Kissing face with closed eyes": "Kyssa ansikte med slutna \u00f6gon",
    "Face with stuck out tongue": "Ansikte med stack ut tungan",
    "Face with stuck out tongue and winking eye": "Ansikte med stack ut tungan och blinkande \u00f6ga",
    "Face with stuck out tongue and tightly-closed eyes": "Ansikte med stack ut tungan och t\u00e4tt slutna \u00f6gon",
    "Disappointed face": "Besviken ansikte",
    "Worried face": "Orolig ansikte",
    "Angry face": "Argt ansikte",
    "Pouting face": "Sk\u00e4ggtorsk ansikte",
    "Crying face": "Gr\u00e5tande ansikte",
    "Persevering face": "Uth\u00e5llig ansikte",
    "Face with look of triumph": "Ansikte med utseendet p\u00e5 triumf",
    "Disappointed but relieved face": "Besviken men l\u00e4ttad ansikte",
    "Frowning face with open mouth": "Rynkar pannan ansikte med \u00f6ppen mun",
    "Anguished face": "\u00c5ngest ansikte",
    "Fearful face": "R\u00e4dda ansikte",
    "Weary face": "Tr\u00f6tta ansikte",
    "Sleepy face": "S\u00f6mnig ansikte",
    "Tired face": "Tr\u00f6tt ansikte",
    "Grimacing face": "Grimaserande ansikte",
    "Loudly crying face": "H\u00f6gt gr\u00e5tande ansikte",
    "Face with open mouth": "Ansikte med \u00f6ppen mun",
    "Hushed face": "D\u00e4mpade ansikte",
    "Face with open mouth and cold sweat": "Ansikte med \u00f6ppen mun och kallsvett",
    "Face screaming in fear": "Face skriker i skr\u00e4ck",
    "Astonished face": "F\u00f6rv\u00e5nad ansikte",
    "Flushed face": "Ansiktsrodnad",
    "Sleeping face": "Sovande anskite",
    "Dizzy face": "Yr ansikte",
    "Face without mouth": "Ansikte utan mun",
    "Face with medical mask": "Ansikte med medicinsk maskera",

    // Line breaker
    "Break": "Ny rad",

    // Math
    "Subscript": "Neds\u00e4nkt",
    "Superscript": "Upph\u00f6jd",

    // Full screen
    "Fullscreen": "Helsk\u00e4rm",

    // Horizontal line
    "Insert Horizontal Line": "Infoga horisontell linje",

    // Clear formatting
    "Clear Formatting": "Ta bort formatering",

    // Save
    "Save": "Spara",

    // Undo, redo
    "Undo": "\u00c5ngra",
    "Redo": "G\u00f6r om",

    // Select all
    "Select All": "Markera allt",

    // Code view
    "Code View": "Kodvy",

    // Quote
    "Quote": "Citat",
    "Increase": "\u00d6ka",
    "Decrease": "Minska",

    // Quick Insert
    "Quick Insert": "Snabbinfoga",

    // Spcial Characters
    "Special Characters": "Specialtecken",
    "Latin": "Latin",
    "Greek": "Grekisk",
    "Cyrillic": "Cyrillic",
    "Punctuation": "Skiljetecken",
    "Currency": "Valuta",
    "Arrows": "Pilar",
    "Math": "Matematik",
    "Misc": "Övrigt",

    // Print.
    "Print": "Skriva ut",

    // Spell Checker.
    "Spell Checker": "Stavningskontroll",

    // Help
    "Help": "Hjälp",
    "Shortcuts": "Genvägar",
    "Inline Editor": "Inline editor",
    "Show the editor": "Visa redigeraren",
    "Common actions": "Vanliga kommandon",
    "Copy": "Kopiera",
    "Cut": "Klipp ut",
    "Paste": "Klistra in",
    "Basic Formatting": "Grundläggande formatering",
    "Increase quote level": "Öka citatnivå",
    "Decrease quote level": "Minska citatnivå",
    "Image / Video": "Bild / video",
    "Resize larger": "Öka storlek",
    "Resize smaller": "Minska storlek",
    "Table": "Tabell",
    "Select table cell": "Markera tabellcell",
    "Extend selection one cell": "Utöka markering en cell",
    "Extend selection one row": "Utöka markering en rad",
    "Navigation": "Navigering",
    "Focus popup / toolbar": "Fokusera popup / verktygsfältet",
    "Return focus to previous position": "Byt fokus till föregående plats",

    // Embed.ly
    "Embed URL": "Bädda in url",
    "Paste in a URL to embed": "Klistra in i en url för att bädda in",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "Den inklippta texten kommer från ett Microsoft Word-dokument. Vill du behålla formateringen eller städa upp det?",
    "Keep": "Behåll",
    "Clean": "Städa upp",
    "Word Paste Detected": "Urklipp från Word upptäckt"
  },
  direction: "ltr"
};

}));
