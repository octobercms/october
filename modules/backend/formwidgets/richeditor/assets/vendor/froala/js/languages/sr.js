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
 * Serbian (Latin)
 */

$.FE.LANGUAGE['sr'] = {
  translation: {
    // Place holder
    "Type something": "Ukucajte ne\u0161tp",

    // Basic formatting
    "Bold": "Podebljan",
    "Italic": "Isko\u0161en",
    "Underline": "Podvu\u010deno",
    "Strikethrough": "Precrtan",

    // Main buttons
    "Insert": "Umetanje",
    "Delete": "Izbri\u0161i",
    "Cancel": "Otkazivanje",
    "OK": "Ok",
    "Back": "Nazad",
    "Remove": "Uklonite",
    "More": "Vi\u0161e",
    "Update": "A\u017euriranje",
    "Style": "Stil",

    // Font
    "Font Family": "Odaberi font",
    "Font Size": "Veli\u010dina fontova",

    // Colors
    "Colors": "Boje",
    "Background": "Pozadina",
    "Text": "Tekst",
    "HEX Color": "HEX boje",

    // Paragraphs
    "Paragraph Format": "Format pasusa",
    "Normal": "Normalno",
    "Code": "\u0160ifra",
    "Heading 1": "Naslov 1",
    "Heading 2": "Naslov 2",
    "Heading 3": "Naslov 3",
    "Heading 4": "Naslov 4",

    // Style
    "Paragraph Style": "Stil pasusa",
    "Inline Style": "Umetnutih stilova",

    // Alignment
    "Align": "Poravnavanje",
    "Align Left": "Poravnaj levo",
    "Align Center": "Poravnaj u centru",
    "Align Right": "Poravnaj desno",
    "Align Justify": "Obostrano poravnavanje",
    "None": "Niko nije",

    // Lists
    "Ordered List": "Ure\u0111enih lista",
    "Default": "Уобичајено",
    "Lower Alpha": "Нижи алфа",
    "Lower Greek": "Лов греек",
    "Lower Roman": "Ловер роман",
    "Upper Alpha": "Уппер алпха",
    "Upper Roman": "Уппер роман",

    "Unordered List": "Neure\u0111enu lista",
    "Circle": "Круг",
    "Disc": "Диск",
    "Square": "Квадрат",

    // Line height
    "Line Height": "Висина линија",
    "Single": "Једно",
    "Double": "Доубле",

    // Indent
    "Decrease Indent": "Smanjivanje uvla\u010denja",
    "Increase Indent": "Pove\u0107avanje uvla\u010denja",

    // Links
    "Insert Link": "Umetni vezu",
    "Open in new tab": "Otvori na novoj kartici",
    "Open Link": "Otvori vezu",
    "Edit Link": "Ure\u0111ivanje veze",
    "Unlink": "Ukloni vezu",
    "Choose Link": "Odaberite vezu",

    // Images
    "Insert Image": "Umetanje slike",
    "Upload Image": "Otpremanje slika",
    "By URL": "Po URL adresi",
    "Browse": "Potra\u017ei",
    "Drop image": "Baci sliku",
    "or click": "ili kliknite na dugme",
    "Manage Images": "Upravljanje slike",
    "Loading": "U\u010ditavanje",
    "Deleting": "Brisanje",
    "Tags": "Oznake",
    "Are you sure? Image will be deleted.": "Jesi siguran? Slika \u0107e biti izbrisana.",
    "Replace": "Zameni",
    "Uploading": "Otpremanje",
    "Loading image": "U\u010ditavanje slika",
    "Display": "Prikaz",
    "Inline": "Pri upisivanju",
    "Break Text": "Prelom teksta",
    "Alternative Text": "Alternativni tekst",
    "Change Size": "Promena veli\u010dine",
    "Width": "\u0160irina",
    "Height": "Visina",
    "Something went wrong. Please try again.": "Ne\u0161to krenulo naopako. Poku\u0161ajte ponovo.",
    "Image Caption": "Slika natpisa",
    "Advanced Edit": "Napredno uređivanje",

    // Video
    "Insert Video": "Umetanje video",
    "Embedded Code": "Ugra\u0111eni k\u00f4d",
    "Paste in a video URL": "Lepljenje u video URL",
    "Drop video": "Baci snimak",
    "Your browser does not support HTML5 video.": "Vaš pregledač ne podržava HTML5 video.",
    "Upload Video": "Otpremanje video",

    // Tables
    "Insert Table": "Umetni tabelu",
    "Table Header": "Zaglavlje tabele",
    "Remove Table": "Uklanjanje tabele",
    "Table Style": "Stil tabele",
    "Horizontal Align": "Horizontalno poravnavanje",
    "Row": "Red",
    "Insert row above": "Umetni red iznad",
    "Insert row below": "Umetni red ispod",
    "Delete row": "Izbri\u0161i red",
    "Column": "Kolone",
    "Insert column before": "Umetnite kolonu pre",
    "Insert column after": "Umetnite kolonu nakon",
    "Delete column": "Izbri\u0161i kolone",
    "Cell": "Mobilni",
    "Merge cells": "Objedinjavanje \u0107elija",
    "Horizontal split": "Horizontalna split",
    "Vertical split": "Vertikalno razdelite",
    "Cell Background": "Mobilni pozadina",
    "Vertical Align": "Vertikalno poravnavanje",
    "Top": "Top",
    "Middle": "Srednji",
    "Bottom": "Dno",
    "Align Top": "Poravnaj gore",
    "Align Middle": "Poravnaj po sredini",
    "Align Bottom": "Poravnaj dole",
    "Cell Style": "Mobilni stil",

    // Files
    "Upload File": "Otpremanje datoteke",
    "Drop file": "Baci datoteku",

    // Emoticons
    "Emoticons": "Emotikona",
    "Grinning face": "Nasmejanoj lice",
    "Grinning face with smiling eyes": "Nasmejanoj lice sa osmehom o\u010di",
    "Face with tears of joy": "Suo\u010davaju sa suzama radosnicama",
    "Smiling face with open mouth": "Nasmejano lice sa otvorenim ustima",
    "Smiling face with open mouth and smiling eyes": "Lica sa otvorenim ustima i nasmejani o\u010di",
    "Smiling face with open mouth and cold sweat": "Nasmejano lice sa otvorenih usta i hladan znoj",
    "Smiling face with open mouth and tightly-closed eyes": "Nasmejano lice otvorenih usta i \u010dvrsto zatvorenih o\u010diju",
    "Smiling face with halo": "Nasmejano lice sa oreolom",
    "Smiling face with horns": "Nasmejano lice sa rogovima",
    "Winking face": "Namigivanje lice",
    "Smiling face with smiling eyes": "Lica sa osmehom o\u010di",
    "Face savoring delicious food": "Lice u\u045bivaju\u0436i u ukusnu hranu",
    "Relieved face": "Laknulo lice",
    "Smiling face with heart-shaped eyes": "Nasmejano lice sa o\u010dima u obliku srca",
    "Smiling face with sunglasses": "Nasmejano lice sa nao\u010dare",
    "Smirking face": "Rugaju\u0436i lice",
    "Neutral face": "Neutralno lice",
    "Expressionless face": "Bez izraza lica.",
    "Unamused face": "Nije zapaljen lice",
    "Face with cold sweat": "Suo\u010davaju sa hladnim znojem",
    "Pensive face": "Nevesela lica",
    "Confused face": "Zbunjeno lice",
    "Confounded face": "Dosadnih lice",
    "Kissing face": "Ljubim lice",
    "Face throwing a kiss": "Lice baca poljubac",
    "Kissing face with smiling eyes": "Ljubi lice sa osmehom o\u010di",
    "Kissing face with closed eyes": "Ljubi lice sa zatvorenim o\u010dima",
    "Face with stuck out tongue": "Lice sa zaglavio jezik",
    "Face with stuck out tongue and winking eye": "Lice sa zaglavljen jezik i namigivanje",
    "Face with stuck out tongue and tightly-closed eyes": "Lice sa zaglavljen jezik i cvrsto zatvorene o\u010di",
    "Disappointed face": "Razo\u010darani lice",
    "Worried face": "Zabrinuto lice",
    "Angry face": "Ljut lice",
    "Pouting face": "Zlovoljan lice",
    "Crying face": "Plakanje lice",
    "Persevering face": "Istrajnog lice",
    "Face with look of triumph": "Suo\u010davaju sa izgledom trijumfa",
    "Disappointed but relieved face": "Razo\u010daran ali laknulo lice",
    "Frowning face with open mouth": "Namršten lice sa otvorenim ustima",
    "Anguished face": "Enih lica",
    "Fearful face": "Strahu lice",
    "Weary face": "Umorna lica",
    "Sleepy face": "Spava mi se lice",
    "Tired face": "Umorna lica",
    "Grimacing face": "Klupi lice",
    "Loudly crying face": "Glasno plakanje lice",
    "Face with open mouth": "Suo\u010davaju sa otvorenim ustima",
    "Hushed face": "Tihim lice",
    "Face with open mouth and cold sweat": "Suo\u010davaju sa otvorenih usta i hladan znoj",
    "Face screaming in fear": "Lice vrisak u strahu",
    "Astonished face": "Zadivljeni lice",
    "Flushed face": "Uplakanu lice",
    "Sleeping face": "Pospanog lica",
    "Dizzy face": "Lice mi se vrti",
    "Face without mouth": "Lice bez jezika",
    "Face with medical mask": "Suo\u010davaju sa medicinskim masku",

    // Line breaker
    "Break": "Prelom",

    // Math
    "Subscript": "Indeksni tekst",
    "Superscript": "Eksponentni tekst",

    // Full screen
    "Fullscreen": "Puni ekran",

    // Horizontal line
    "Insert Horizontal Line": "Umetni horizontalnu liniju",

    // Clear formatting
    "Clear Formatting": "Brisanje oblikovanja",

    // Save
    "Save": "\u0441\u0430\u0447\u0443\u0432\u0430\u0442\u0438",

    // Undo, redo
    "Undo": "Opozovi radnju",
    "Redo": "Ponavljanje",

    // Select all
    "Select All": "Izaberi sve",

    // Code view
    "Code View": "Prikaz koda",

    // Quote
    "Quote": "Ponude",
    "Increase": "Pove\u0107anje",
    "Decrease": "Smanjivanje",

    // Quick Insert
    "Quick Insert": "Brzo umetanje",

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
