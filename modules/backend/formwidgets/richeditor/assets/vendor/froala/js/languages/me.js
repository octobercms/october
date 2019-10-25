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
 * Montenegrin
 */

$.FE.LANGUAGE['me'] = {
  translation: {
    // Place holder
    "Type something": "Ukucajte ne\u0161tp",

    // Basic formatting
    "Bold": "Bold",
    "Italic": "Italic",
    "Underline": "Podvu\u010deno",
    "Strikethrough": "Prekri\u017eano",

    // Main buttons
    "Insert": "Umetni",
    "Delete": "Obri\u0161i",
    "Cancel": "Otka\u017ei",
    "OK": "U redu",
    "Back": "Natrag",
    "Remove": "Ukloni",
    "More": "Vi\u0161e",
    "Update": "A\u017euriranje",
    "Style": "Stil",

    // Font
    "Font Family": "Odaberi font",
    "Font Size": "Veli\u010dina fonta",

    // Colors
    "Colors": "Boje",
    "Background": "Pozadine",
    "Text": "Teksta",
    "HEX Color": "HEX boje",

    // Paragraphs
    "Paragraph Format": "Paragraf formatu",
    "Normal": "Normalno",
    "Code": "Izvorni kod",
    "Heading 1": "Naslov 1",
    "Heading 2": "Naslov 2",
    "Heading 3": "Naslov 3",
    "Heading 4": "Naslov 4",

    // Style
    "Paragraph Style": "Paragraf stil",
    "Inline Style": "Inline stil",

    // Alignment
    "Align": "Poravnaj",
    "Align Left": "Poravnaj lijevo",
    "Align Center": "Poravnaj po sredini",
    "Align Right": "Poravnaj desno",
    "Align Justify": "Cjelokupno poravnanje",
    "None": "Nijedan",

    // Lists
    "Ordered List": "Ure\u0111ena lista",
    "Default": "",
    "Lower Alpha": "",
    "Lower Greek": "",
    "Lower Roman": "",
    "Upper Alpha": "",
    "Upper Roman": "",

    "Unordered List": "Nesre\u0111ene lista",
    "Circle": "",
    "Disc": "",
    "Square": "",

    // Line height
    "Line Height": "",
    "Single": "",
    "Double": "",

    // Indent
    "Decrease Indent": "Smanjenje alineja",
    "Increase Indent": "Pove\u0107anje alineja",

    // Links
    "Insert Link": "Umetni link",
    "Open in new tab": "Otvori u novom prozoru",
    "Open Link": "Otvori link",
    "Edit Link": "Uredi link",
    "Unlink": "Ukloni link",
    "Choose Link": "Izabrati link",

    // Images
    "Insert Image": "Umetni sliku",
    "Upload Image": "Upload sliku",
    "By URL": "Preko URL",
    "Browse": "Pregledaj",
    "Drop image": "Izbaci sliku",
    "or click": "ili odaberi",
    "Manage Images": "Upravljanje ilustracijama",
    "Loading": "Koji tovari",
    "Deleting": "Brisanje",
    "Tags": "Oznake",
    "Are you sure? Image will be deleted.": "Da li ste sigurni da \u017eelite da obri\u0161ete ovu ilustraciju?",
    "Replace": "Zamijenite",
    "Uploading": "Uploading",
    "Loading image": "Koji tovari sliku",
    "Display": "Prikaz",
    "Inline": "Inline",
    "Break Text": "Break tekst",
    "Alternative Text": "Alternativna tekst",
    "Change Size": "Promijeni veli\u010dinu",
    "Width": "\u0161irina",
    "Height": "Visina",
    "Something went wrong. Please try again.": "Ne\u0161to je po\u0161lo po zlu. Molimo vas da poku\u0161ate ponovo.",
    "Image Caption": "Slika natpisa",
    "Advanced Edit": "Napredno uređivanje",

    // Video
    "Insert Video": "Umetni video",
    "Embedded Code": "Embedded kod",
    "Paste in a video URL": "Prilepite v URL video posnetka",
    "Drop video": "Izbaci video",
    "Your browser does not support HTML5 video.": "Váš prehliadač nepodporuje video HTML5.",
    "Upload Video": "Upload video",

    // Tables
    "Insert Table": "Umetni tabelu",
    "Table Header": "Zaglavlje tabelu",
    "Remove Table": "Izbri\u0161i tabelu",
    "Table Style": "Tabelu stil",
    "Horizontal Align": "Horizontalna poravnanje",
    "Row": "Red",
    "Insert row above": "Umetni red iznad",
    "Insert row below": "Umetni red ispod",
    "Delete row": "Obri\u0161i red",
    "Column": "Kolona",
    "Insert column before": "Umetni kolonu prije",
    "Insert column after": "Umetni kolonu poslije",
    "Delete column": "Obri\u0161i kolonu",
    "Cell": "\u0106elija",
    "Merge cells": "Spoji \u0107elija",
    "Horizontal split": "Horizontalno razdvajanje polja",
    "Vertical split": "Vertikalno razdvajanje polja",
    "Cell Background": "\u0106elija pozadini",
    "Vertical Align": "Vertikalni poravnaj",
    "Top": "Vrh",
    "Middle": "Srednji",
    "Bottom": "Dno",
    "Align Top": "Poravnaj vrh",
    "Align Middle": "Poravnaj srednji",
    "Align Bottom": "Poravnaj dno",
    "Cell Style": "\u0106elija stil",

    // Files
    "Upload File": "Upload datoteke",
    "Drop file": "Drop datoteke",

    // Emoticons
    "Emoticons": "Emotikona",
    "Grinning face": "Cere\u0107i lice",
    "Grinning face with smiling eyes": "Cere\u0107i lice nasmijana o\u010dima",
    "Face with tears of joy": "Lice sa suze radosnice",
    "Smiling face with open mouth": "Nasmijana lica s otvorenih usta",
    "Smiling face with open mouth and smiling eyes": "Nasmijana lica s otvorenih usta i nasmijana o\u010di",
    "Smiling face with open mouth and cold sweat": "Nasmijana lica s otvorenih usta i hladan znoj",
    "Smiling face with open mouth and tightly-closed eyes": "Nasmijana lica s otvorenih usta i \u010dvrsto-zatvorenih o\u010diju",
    "Smiling face with halo": "Nasmijana lica sa halo",
    "Smiling face with horns": "Nasmijana lica s rogovima",
    "Winking face": "Namigivanje lice",
    "Smiling face with smiling eyes": "Nasmijana lica sa nasmijana o\u010dima",
    "Face savoring delicious food": "Suo\u010davaju uživaju\u0107i ukusna hrana",
    "Relieved face": "Laknulo lice",
    "Smiling face with heart-shaped eyes": "Nasmijana lica sa obliku srca o\u010di",
    "Smiling face with sunglasses": "Nasmijana lica sa sun\u010dane nao\u010dare",
    "Smirking face": "Namr\u0161tena lica",
    "Neutral face": "Neutral lice",
    "Expressionless face": "Bezizra\u017eajno lice",
    "Unamused face": "Nije zabavno lice",
    "Face with cold sweat": "Lice s hladnim znojem",
    "Pensive face": "Zami\u0161ljen lice",
    "Confused face": "Zbunjen lice",
    "Confounded face": "Uzbu\u0111en lice",
    "Kissing face": "Ljubakanje lice",
    "Face throwing a kiss": "Suo\u010davaju bacanje poljubac",
    "Kissing face with smiling eyes": "Ljubljenje lice nasmijana o\u010dima",
    "Kissing face with closed eyes": "Ljubljenje lice sa zatvorenim o\u010dima",
    "Face with stuck out tongue": "Lice sa ispru\u017eio jezik",
    "Face with stuck out tongue and winking eye": "Lice sa ispru\u017eio jezik i trep\u0107u\u0107e \u0107e oko",
    "Face with stuck out tongue and tightly-closed eyes": "Lice sa ispru\u017eio jezik i \u010dvrsto zatvorene o\u010di",
    "Disappointed face": "Razo\u010daran lice",
    "Worried face": "Zabrinuti lice",
    "Angry face": "Ljut lice",
    "Pouting face": "Napu\u0107enim lice",
    "Crying face": "Plakanje lice",
    "Persevering face": "Istrajan lice",
    "Face with look of triumph": "Lice s pogledom trijumfa",
    "Disappointed but relieved face": "Razo\u010daran, ali olak\u0161anje lice",
    "Frowning face with open mouth": "Namr\u0161tiv\u0161i lice s otvorenih usta",
    "Anguished face": "Bolnom lice",
    "Fearful face": "Pla\u0161ljiv lice",
    "Weary face": "Umoran lice",
    "Sleepy face": "Pospan lice",
    "Tired face": "Umorno lice",
    "Grimacing face": "Grimase lice",
    "Loudly crying face": "Glasno pla\u010de lice",
    "Face with open mouth": "Lice s otvorenih usta",
    "Hushed face": "Smiren lice",
    "Face with open mouth and cold sweat": "Lice s otvorenih usta i hladan znoj",
    "Face screaming in fear": "Suo\u010davaju vri\u0161ti u strahu",
    "Astonished face": "Zapanjen lice",
    "Flushed face": "Rumeno lice",
    "Sleeping face": "Usnulo lice",
    "Dizzy face": "O\u0161amu\u0107en lice",
    "Face without mouth": "Lice bez usta",
    "Face with medical mask": "Lice sa medicinskom maskom",

    // Line breaker
    "Break": "Slomiti",

    // Math
    "Subscript": "Potpisan",
    "Superscript": "Natpis",

    // Full screen
    "Fullscreen": "Preko cijelog zaslona",

    // Horizontal line
    "Insert Horizontal Line": "Umetni vodoravna liniju",

    // Clear formatting
    "Clear Formatting": "Izbrisati formatiranje",

    // Save
    "Save": "Save",

    // Undo, redo
    "Undo": "Korak nazad",
    "Redo": "Korak naprijed",

    // Select all
    "Select All": "Ozna\u010di sve",

    // Code view
    "Code View": "Kod pogled",

    // Quote
    "Quote": "Citat",
    "Increase": "Pove\u0107ati",
    "Decrease": "Smanjenje",

    // Quick Insert
    "Quick Insert": "Brzo umetni",

    // Spcial Characters
    "Special Characters": "Specijalni znakovi",
    "Latin": "Latino",
    "Greek": "Grk",
    "Cyrillic": "Ćirilica",
    "Punctuation": "Interpunkcije",
    "Currency": "Valuta",
    "Arrows": "Strelice",
    "Math": "Matematika",
    "Misc": "Misc",

    // Print.
    "Print": "Odštampaj",

    // Spell Checker.
    "Spell Checker": "Kontrolor pravopisa",

    // Help
    "Help": "Pomoć",
    "Shortcuts": "Prečice",
    "Inline Editor": "Pri upisivanju Editor",
    "Show the editor": "Prikaži urednik",
    "Common actions": "Zajedničke akcije",
    "Copy": "Kopija",
    "Cut": "Rez",
    "Paste": "Nalepi",
    "Basic Formatting": "Osnovno oblikovanje",
    "Increase quote level": "Povećati ponudu za nivo",
    "Decrease quote level": "Smanjenje ponude nivo",
    "Image / Video": "Slika / Video",
    "Resize larger": "Veće veličine",
    "Resize smaller": "Promena veličine manji",
    "Table": "Sto",
    "Select table cell": "Select ćelije",
    "Extend selection one cell": "Proširite selekciju jednu ćeliju",
    "Extend selection one row": "Proširite selekciju jedan red",
    "Navigation": "Navigacija",
    "Focus popup / toolbar": "Fokus Iskačući meni / traka sa alatkama",
    "Return focus to previous position": "Vratiti fokus na prethodnu poziciju",

    // Embed.ly
    "Embed URL": "Ugradite URL",
    "Paste in a URL to embed": "Nalepite URL adresu da biste ugradili",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "Nalepljeni sadržaj dolazi iz Microsoft Word dokument. Da li želite zadržati u formatu ili počistiti?",
    "Keep": "Nastavi",
    "Clean": "Oиisti",
    "Word Paste Detected": "Word Nalepi otkriven"
  },
  direction: "ltr"
};

}));
