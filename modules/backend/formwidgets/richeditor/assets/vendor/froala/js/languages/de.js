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
 * German
 */

$.FE.LANGUAGE['de'] = {
  translation: {
    // Place holder
    "Type something": "Hier tippen",

    // Basic formatting
    "Bold": "Fett",
    "Italic": "Kursiv",
    "Underline": "Unterstrichen",
    "Strikethrough": "Durchgestrichen",

    // Main buttons
    "Insert": "Einfügen",
    "Delete": "Löschen",
    "Cancel": "Abbrechen",
    "OK": "OK",
    "Back": "Zurück",
    "Remove": "Entfernen",
    "More": "Mehr",
    "Update": "Aktualisieren",
    "Style": "Stil",

    // Font
    "Font Family": "Schriftart",
    "Font Size": "Schriftgröße",

    // Colors
    "Colors": "Farben",
    "Background": "Hintergrund",
    "Text": "Text",
    "HEX Color": "Hexadezimaler Farbwert",

    // Paragraphs
    "Paragraph Format": "Formatierung",
    "Normal": "Normal",
    "Code": "Quelltext",
    "Heading 1": "Überschrift 1",
    "Heading 2": "Überschrift 2",
    "Heading 3": "Überschrift 3",
    "Heading 4": "Überschrift 4",

    // Style
    "Paragraph Style": "Absatzformatierung",
    "Inline Style": "Inlineformatierung",

    // Alignment
    "Align": "Ausrichtung",
    "Align Left": "Linksbündig ausrichten",
    "Align Center": "Zentriert ausrichten",
    "Align Right": "Rechtsbündig ausrichten",
    "Align Justify": "Blocksatz",
    "None": "Keine",

    // Lists
    "Ordered List": "Nummerierte Liste",
    "Default": "Standard",
    "Lower Alpha": "Kleinbuchstaben",
    "Lower Greek": "Griechisches Alphabet",
    "Lower Roman": "Römische Ziffern (klein)",
    "Upper Alpha": "Grossbuchstaben",
    "Upper Roman": "Römische Ziffern (gross)",

    "Unordered List": "Unnummerierte Liste",
    "Circle": "Kreis",
    "Disc": "Kreis gefüllt",
    "Square": "Quadrat",

    // Line height
    "Line Height": "Zeilenhöhe",
    "Single": "Einfach",
    "Double": "Doppelt",

    // Indent
    "Decrease Indent": "Einzug verkleinern",
    "Increase Indent": "Einzug vergrößern",

    // Links
    "Insert Link": "Link einfügen",
    "Open in new tab": "In neuem Tab öffnen",
    "Open Link": "Link öffnen",
    "Edit Link": "Link bearbeiten",
    "Unlink": "Link entfernen",
    "Choose Link": "Einen Link auswählen",

    // Images
    "Insert Image": "Bild einfügen",
    "Upload Image": "Bild hochladen",
    "By URL": "Von URL",
    "Browse": "Durchsuchen",
    "Drop image": "Bild hineinziehen",
    "or click": "oder hier klicken",
    "Manage Images": "Bilder verwalten",
    "Loading": "Laden",
    "Deleting": "Löschen",
    "Tags": "Tags",
    "Are you sure? Image will be deleted.": "Wollen Sie das Bild wirklich löschen?",
    "Replace": "Ersetzen",
    "Uploading": "Hochladen",
    "Loading image": "Das Bild wird geladen",
    "Display": "Textausrichtung",
    "Inline": "Mit Text in einer Zeile",
    "Break Text": "Text umbrechen",
    "Alternative Text": "Alternativtext",
    "Change Size": "Größe ändern",
    "Width": "Breite",
    "Height": "Höhe",
    "Something went wrong. Please try again.": "Etwas ist schief gelaufen. Bitte versuchen Sie es erneut.",
    "Image Caption": "Bildbeschreibung",
    "Advanced Edit": "Erweiterte Bearbeitung",

    // Video
    "Insert Video": "Video einfügen",
    "Embedded Code": "Eingebetteter Code",
    "Paste in a video URL": "Fügen Sie die Video-URL ein",
    "Drop video": "Video hineinziehen",
    "Your browser does not support HTML5 video.": "Ihr Browser unterstützt keine HTML5-Videos.",
    "Upload Video": "Video hochladen",

    // Tables
    "Insert Table": "Tabelle einfügen",
    "Table Header": "Tabellenkopf",
    "Remove Table": "Tabelle entfernen",
    "Table Style": "Tabellenformatierung",
    "Horizontal Align": "Horizontale Ausrichtung",
    "Row": "Zeile",
    "Insert row above": "Neue Zeile davor einfügen",
    "Insert row below": "Neue Zeile danach einfügen",
    "Delete row": "Zeile löschen",
    "Column": "Spalte",
    "Insert column before": "Neue Spalte davor einfügen",
    "Insert column after": "Neue Spalte danach einfügen",
    "Delete column": "Spalte löschen",
    "Cell": "Zelle",
    "Merge cells": "Zellen verbinden",
    "Horizontal split": "Horizontal teilen",
    "Vertical split": "Vertikal teilen",
    "Cell Background": "Zellenfarbe",
    "Vertical Align": "Vertikale Ausrichtung",
    "Top": "Oben",
    "Middle": "Zentriert",
    "Bottom": "Unten",
    "Align Top": "Oben ausrichten",
    "Align Middle": "Zentriert ausrichten",
    "Align Bottom": "Unten ausrichten",
    "Cell Style": "Zellen-Stil",

    // Files
    "Insert File": "Datei einfügen",
    "Upload File": "Datei hochladen",
    "Drop file": "Datei hineinziehen",

    // Emoticons
    "Emoticons": "Emoticons",
    "Grinning face": "Grinsendes Gesicht",
    "Grinning face with smiling eyes": "Grinsend Gesicht mit lächelnden Augen",
    "Face with tears of joy": "Gesicht mit Tränen der Freude",
    "Smiling face with open mouth": "Lächelndes Gesicht mit offenem Mund",
    "Smiling face with open mouth and smiling eyes": "Lächelndes Gesicht mit offenem Mund und lächelnden Augen",
    "Smiling face with open mouth and cold sweat": "Lächelndes Gesicht mit offenem Mund und kaltem Schweiß",
    "Smiling face with open mouth and tightly-closed eyes": "Lächelndes Gesicht mit offenem Mund und fest geschlossenen Augen",
    "Smiling face with halo": "Lächeln Gesicht mit Heiligenschein",
    "Smiling face with horns": "Lächeln Gesicht mit Hörnern",
    "Winking face": "Zwinkerndes Gesicht",
    "Smiling face with smiling eyes": "Lächelndes Gesicht mit lächelnden Augen",
    "Face savoring delicious food": "Gesicht leckeres Essen genießend",
    "Relieved face": "Erleichtertes Gesicht",
    "Smiling face with heart-shaped eyes": "Lächelndes Gesicht mit herzförmigen Augen",
    "Smiling face with sunglasses": "Lächelndes Gesicht mit Sonnenbrille",
    "Smirking face": "Grinsendes Gesicht",
    "Neutral face": "Neutrales Gesicht",
    "Expressionless face": "Ausdrucksloses Gesicht",
    "Unamused face": "Genervtes Gesicht",
    "Face with cold sweat": "Gesicht mit kaltem Schweiß",
    "Pensive face": "Nachdenkliches Gesicht",
    "Confused face": "Verwirrtes Gesicht",
    "Confounded face": "Elendes Gesicht",
    "Kissing face": "Küssendes Gesicht",
    "Face throwing a kiss": "Gesicht wirft einen Kuss",
    "Kissing face with smiling eyes": "Küssendes Gesicht mit lächelnden Augen",
    "Kissing face with closed eyes": "Küssendes Gesicht mit geschlossenen Augen",
    "Face with stuck out tongue": "Gesicht mit herausgestreckter Zunge",
    "Face with stuck out tongue and winking eye": "Gesicht mit herausgestreckter Zunge und zwinkerndem Auge",
    "Face with stuck out tongue and tightly-closed eyes": "Gesicht mit herausgestreckter Zunge und fest geschlossenen Augen",
    "Disappointed face": "Enttäuschtes Gesicht",
    "Worried face": "Besorgtes Gesicht",
    "Angry face": "Verärgertes Gesicht",
    "Pouting face": "Schmollendes Gesicht",
    "Crying face": "Weinendes Gesicht",
    "Persevering face": "Ausharrendes Gesicht",
    "Face with look of triumph": "Gesicht mit triumphierenden Blick",
    "Disappointed but relieved face": "Enttäuschtes, aber erleichtertes Gesicht",
    "Frowning face with open mouth": "Entsetztes Gesicht mit offenem Mund",
    "Anguished face": "Gequältes Gesicht",
    "Fearful face": "Angstvolles Gesicht",
    "Weary face": "Müdes Gesicht",
    "Sleepy face": "Schläfriges Gesicht",
    "Tired face": "Gähnendes Gesicht",
    "Grimacing face": "Grimassenschneidendes Gesicht",
    "Loudly crying face": "Laut weinendes Gesicht",
    "Face with open mouth": "Gesicht mit offenem Mund",
    "Hushed face": "Besorgtes Gesicht mit offenem Mund",
    "Face with open mouth and cold sweat": "Gesicht mit offenem Mund und kaltem Schweiß",
    "Face screaming in fear": "Vor Angst schreiendes Gesicht",
    "Astonished face": "Erstauntes Gesicht",
    "Flushed face": "Gerötetes Gesicht",
    "Sleeping face": "Schlafendes Gesicht",
    "Dizzy face": "Schwindliges Gesicht",
    "Face without mouth": "Gesicht ohne Mund",
    "Face with medical mask": "Gesicht mit Mundschutz",

    // Line breaker
    "Break": "Zeilenumbruch",

    // Math
    "Subscript": "Tiefgestellt",
    "Superscript": "Hochgestellt",

    // Full screen
    "Fullscreen": "Vollbild",

    // Horizontal line
    "Insert Horizontal Line": "Horizontale Linie einfügen",

    // Clear formatting
    "Clear Formatting": "Formatierung löschen",

    // Save
    "Save": "Sparen",

    // Undo, redo
    "Undo": "Rückgängig",
    "Redo": "Wiederholen",

    // Select all
    "Select All": "Alles auswählen",

    // Code view
    "Code View": "Code-Ansicht",

    // Quote
    "Quote": "Zitieren",
    "Increase": "Vergrößern",
    "Decrease": "Verkleinern",

    // Quick Insert
    "Quick Insert": "Schnell einfügen",

    // Spcial Characters
    "Special Characters": "Sonderzeichen",
    "Latin": "Lateinisch",
    "Greek": "Griechisch",
    "Cyrillic": "Kyrillisch",
    "Punctuation": "Satzzeichen",
    "Currency": "Währung",
    "Arrows": "Pfeile",
    "Math": "Mathematik",
    "Misc": "Sonstige",

    // Print.
    "Print": "Drucken",

    // Spell Checker.
    "Spell Checker": "Rechtschreibprüfung",

    // Help
    "Help": "Hilfe",
    "Shortcuts": "Verknüpfungen",
    "Inline Editor": "Inline-Editor",
    "Show the editor": "Editor anzeigen",
    "Common actions": "Häufig verwendete Befehle",
    "Copy": "Kopieren",
    "Cut": "Ausschneiden",
    "Paste": "Einfügen",
    "Basic Formatting": "Grundformatierung",
    "Increase quote level": "Zitatniveau erhöhen",
    "Decrease quote level": "Zitatniveau verringern",
    "Image / Video": "Bild / Video",
    "Resize larger": "Vergrößern",
    "Resize smaller": "Verkleinern",
    "Table": "Tabelle",
    "Select table cell": "Tabellenzelle auswählen",
    "Extend selection one cell": "Erweitere Auswahl um eine Zelle",
    "Extend selection one row": "Erweitere Auswahl um eine Zeile",
    "Navigation": "Navigation",
    "Focus popup / toolbar": "Fokus-Popup / Symbolleiste",
    "Return focus to previous position": "Fokus auf vorherige Position",

    // Embed.ly
    "Embed URL": "URL einbetten",
    "Paste in a URL to embed": "URL einfügen um sie einzubetten",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "Der eingefügte Inhalt kommt aus einem Microsoft Word-Dokument. Möchten Sie die Formatierungen behalten oder verwerfen?",
    "Keep": "Behalten",
    "Clean": "Bereinigen",
    "Word Paste Detected": "Aus Word einfügen"
  },
  direction: "ltr"
};

}));
