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
 * Danish
 */

$.FE.LANGUAGE['da'] = {
  translation: {
    // Place holder
    "Type something": "Skriv her",

    // Basic formatting
    "Bold": "Fed",
    "Italic": "Kursiv",
    "Underline": "Understreget",
    "Strikethrough": "Gennemstreget",

    // Main buttons
    "Insert": "Indsæt",
    "Delete": "Slet",
    "Cancel": "Fortryd",
    "OK": "Ok",
    "Back": "Tilbage",
    "Remove": "Fjern",
    "More": "Mere",
    "Update": "Opdater",
    "Style": "Udseende",

    // Font
    "Font Family": "Skrifttype",
    "Font Size": "Skriftstørrelse",

    // Colors
    "Colors": "Farver",
    "Background": "Baggrund",
    "Text": "Tekst",
    "HEX Color": "Hex farve",

    // Paragraphs
    "Paragraph Format": "Typografi",
    "Normal": "Normal",
    "Code": "Kode",
    "Heading 1": "Overskrift 1",
    "Heading 2": "Overskrift 2",
    "Heading 3": "Overskrift 3",
    "Heading 4": "Overskrift 4",

    // Style
    "Paragraph Style": "Afsnit",
    "Inline Style": "På linje",

    // Alignment
    "Align": "Tilpasning",
    "Align Left": "Venstrejusteret",
    "Align Center": "Centreret",
    "Align Right": "Højrejusteret",
    "Align Justify": "Justeret",
    "None": "Ingen",

    // Lists
    "Ordered List": "Punktopstilling",
    "Default": "Standard",
    "Lower Alpha": "Lavere alfa",
    "Lower Greek": "Lavere græsk",
    "Lower Roman": "Lavere romersk",
    "Upper Alpha": "Øvre alfa",
    "Upper Roman": "Øvre romersk",

    "Unordered List": "Punktopstilling med tal",
    "Circle": "Cirkel",
    "Disc": "Disk",
    "Square": "Firkant",

    // Line height
    "Line Height": "Linjehøjde",
    "Single": "Enkelt",
    "Double": "Dobbelt",

    // Indent
    "Decrease Indent": "Formindsk indrykning",
    "Increase Indent": "Forøg indrykning",

    // Links
    "Insert Link": "Indsæt link",
    "Open in new tab": "Åbn i ny fane",
    "Open Link": "Åbn link",
    "Edit Link": "Rediger link",
    "Unlink": "Fjern link",
    "Choose Link": "Vælg link",

    // Images
    "Insert Image": "Indsæt billede",
    "Upload Image": "Upload billede",
    "By URL": "Fra URL",
    "Browse": "Gennemse",
    "Drop image": "Træk billedet herind",
    "or click": "eller klik",
    "Manage Images": "Administrer billeder",
    "Loading": "Henter",
    "Deleting": "Sletter",
    "Tags": "Tags",
    "Are you sure? Image will be deleted.": "Er du sikker? Billedet vil blive slettet.",
    "Replace": "Udskift",
    "Uploading": "Uploader",
    "Loading image": "Henter billede",
    "Display": "Layout",
    "Inline": "På linje",
    "Break Text": "Ombryd tekst",
    "Alternative Text": "Supplerende tekst",
    "Change Size": "Tilpas størrelse",
    "Width": "Bredde",
    "Height": "Højde",
    "Something went wrong. Please try again.": "Noget gik galt. Prøv igen.",
    "Image Caption": "Billedtekst",
    "Advanced Edit": "Avanceret redigering",

    // Video
    "Insert Video": "Indsæt video",
    "Embedded Code": "Indlejret kode",
    "Paste in a video URL": "Indsæt en video via URL",
    "Drop video": "Træk videoen herind",
    "Your browser does not support HTML5 video.": "Din browser understøtter ikke HTML5 video.",
    "Upload Video": "Upload video",

    // Tables
    "Insert Table": "Indsæt tabel",
    "Table Header": "Tabeloverskrift",
    "Remove Table": "Fjern tabel",
    "Table Style": "Tabeludseende",
    "Horizontal Align": "Vandret tilpasning",
    "Row": "Række",
    "Insert row above": "Indsæt række over",
    "Insert row below": "Indsæt række under",
    "Delete row": "Slet række",
    "Column": "Kolonne",
    "Insert column before": "Indsæt kolonne før",
    "Insert column after": "Indsæt kolonne efter",
    "Delete column": "Slet kolonne",
    "Cell": "Celle",
    "Merge cells": "Flet celler",
    "Horizontal split": "Vandret split",
    "Vertical split": "Lodret split",
    "Cell Background": "Cellebaggrund",
    "Vertical Align": "Lodret tilpasning",
    "Top": "Top",
    "Middle": "Midte",
    "Bottom": "Bund",
    "Align Top": "Tilpas i top",
    "Align Middle": "Tilpas i midte",
    "Align Bottom": "Tilpas i bund",
    "Cell Style": "Celleudseende",

    // Files
    "Upload File": "Upload fil",
    "Drop file": "Træk filen herind",

    // Emoticons
    "Emoticons": "Humørikoner",
    "Grinning face": "Grinende ansigt",
    "Grinning face with smiling eyes": "Grinende ansigt med smilende øjne",
    "Face with tears of joy": "Ansigt med glædestårer",
    "Smiling face with open mouth": "Smilende ansigt med åben mund",
    "Smiling face with open mouth and smiling eyes": "Smilende ansigt med åben mund og smilende øjne",
    "Smiling face with open mouth and cold sweat": "Smilende ansigt med åben mund og koldsved",
    "Smiling face with open mouth and tightly-closed eyes": "Smilende ansigt med åben mund og stramtlukkede øjne",
    "Smiling face with halo": "Smilende ansigt med glorie",
    "Smiling face with horns": "Smilende ansigt med horn",
    "Winking face": "Blinkede ansigt",
    "Smiling face with smiling eyes": "Smilende ansigt med smilende øjne",
    "Face savoring delicious food": "Ansigt der savler over lækker mad",
    "Relieved face": "Lettet ansigt",
    "Smiling face with heart-shaped eyes": "Smilende ansigt med hjerteformede øjne",
    "Smiling face with sunglasses": "Smilende ansigt med solbriller",
    "Smirking face": "Smilende ansigt",
    "Neutral face": "Neutralt ansigt",
    "Expressionless face": "Udtryksløst ansigt",
    "Unamused face": "Utilfredst ansigt",
    "Face with cold sweat": "Ansigt med koldsved",
    "Pensive face": "Eftertænksomt ansigt",
    "Confused face": "Forvirret ansigt",
    "Confounded face": "Irriteret ansigt",
    "Kissing face": "Kyssende ansigt",
    "Face throwing a kiss": "Ansigt der luftkysser",
    "Kissing face with smiling eyes": "Kyssende ansigt med smilende øjne",
    "Kissing face with closed eyes": "Kyssende ansigt med lukkede øjne",
    "Face with stuck out tongue": "Ansigt med tungen ud af munden",
    "Face with stuck out tongue and winking eye": "Ansigt med tungen ud af munden og blinkede øje",
    "Face with stuck out tongue and tightly-closed eyes": "Ansigt med tungen ud af munden og stramt lukkede øjne",
    "Disappointed face": "Skuffet ansigt",
    "Worried face": "Bekymret ansigt",
    "Angry face": "Vredt ansigt",
    "Pouting face": "Surmulende ansigt",
    "Crying face": "Grædende ansigt",
    "Persevering face": "Vedholdende ansigt",
    "Face with look of triumph": "Hoverende ansigt",
    "Disappointed but relieved face": "Skuffet, men lettet ansigt",
    "Frowning face with open mouth": "Ansigt med åben mund og rynket pande",
    "Anguished face": "Forpintt ansigt",
    "Fearful face": "Angst ansigt",
    "Weary face": "Udmattet ansigt",
    "Sleepy face": "Søvnigt ansigt",
    "Tired face": "Træt ansigt",
    "Grimacing face": "Ansigt der laver en grimasse",
    "Loudly crying face": "Vrælende ansigt",
    "Face with open mouth": "Ansigt med åben mund",
    "Hushed face": "Tyst ansigt",
    "Face with open mouth and cold sweat": "Ansigt med åben mund og koldsved",
    "Face screaming in fear": "Ansigt der skriger i frygt",
    "Astonished face": "Forbløffet ansigt",
    "Flushed face": "Blussende ansigt",
    "Sleeping face": "Sovende ansigt",
    "Dizzy face": "Svimmelt ansigt",
    "Face without mouth": "Ansigt uden mund",
    "Face with medical mask": "Ansigt med mundbind",

    // Line breaker
    "Break": "Linjeskift",

    // Math
    "Subscript": "Sænket skrift",
    "Superscript": "Hævet skrift",

    // Full screen
    "Fullscreen": "Fuldskærm",

    // Horizontal line
    "Insert Horizontal Line": "Indsæt vandret linie",

    // Clear formatting
    "Clear Formatting": "Fjern formatering",

    // Undo, redo
    "Undo": "Fortryd",
    "Redo": "Annuller fortryd",

    // Select all
    "Select All": "Vælg alt",

    // Code view
    "Code View": "Kodevisning",

    // Quote
    "Quote": "Citat",
    "Increase": "Forøg",
    "Decrease": "Formindsk",

    // Quick Insert
    "Quick Insert": "Kvik-indsæt",

    // Spcial Characters
    "Special Characters": "Specialtegn",
    "Latin": "Latin",
    "Greek": "Græsk",
    "Cyrillic": "Kyrillisk",
    "Punctuation": "Tegnsætning",
    "Currency": "Valuta",
    "Arrows": "Pile",
    "Math": "Matematik",
    "Misc": "Diverse",

    // Print.
    "Print": "Print",

    // Spell Checker.
    "Spell Checker": "Stavekontrol",

    // Help
    "Help": "Hjælp",
    "Shortcuts": "Genveje",
    "Inline Editor": "Indlejret editor",
    "Show the editor": "Vis editor",
    "Common actions": "Almindelige handlinger",
    "Copy": "Kopier",
    "Cut": "Klip",
    "Paste": "Sæt ind",
    "Basic Formatting": "Grundlæggende formatering",
    "Increase quote level": "Hæv citatniveau",
    "Decrease quote level": "Sænk citatniveau",
    "Image / Video": "Billede / video",
    "Resize larger": "Ændre til større",
    "Resize smaller": "Ændre til mindre",
    "Table": "Tabel",
    "Select table cell": "Vælg tabelcelle",
    "Extend selection one cell": "Udvid markeringen med én celle",
    "Extend selection one row": "Udvid markeringen med én række",
    "Navigation": "Navigation",
    "Focus popup / toolbar": "Fokuser popup / værktøjslinje",
    "Return focus to previous position": "Skift fokus tilbage til tidligere position",

    // Embed.ly
    "Embed URL": "Integrer URL",
    "Paste in a URL to embed": "Indsæt en URL for at indlejre",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "Det indsatte indhold kommer fra et Microsoft Word-dokument. Vil du beholde formateringen eller fjerne den?",
    "Keep": "Behold",
    "Clean": "Fjern",
    "Word Paste Detected": "Indsættelse fra Word opdaget"
  },
  direction: "ltr"
};

}));
