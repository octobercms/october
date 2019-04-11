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
 * Italian
 */

$.FE.LANGUAGE['it'] = {
  translation: {
    // Place holder
    "Type something": "Digita qualcosa",

    // Basic formatting
    "Bold": "Grassetto",
    "Italic": "Corsivo",
    "Underline": "Sottolineato",
    "Strikethrough": "Barrato",

    // Main buttons
    "Insert": "Inserisci",
    "Delete": "Cancella",
    "Cancel": "Cancella",
    "OK": "OK",
    "Back": "Indietro",
    "Remove": "Rimuovi",
    "More": "Di pi\u00f9",
    "Update": "Aggiorna",
    "Style": "Stile",

    // Font
    "Font Family": "Carattere",
    "Font Size": "Dimensione Carattere",

    // Colors
    "Colors": "Colori",
    "Background": "Sfondo",
    "Text": "Testo",
    "HEX Color": "Colore Esadecimale",

    // Paragraphs
    "Paragraph Format": "Formattazione",
    "Normal": "Normale",
    "Code": "Codice",
    "Heading 1": "Intestazione 1",
    "Heading 2": "Intestazione 2",
    "Heading 3": "Intestazione 3",
    "Heading 4": "Intestazione 4",

    // Style
    "Paragraph Style": "Stile Paragrafo",
    "Inline Style": "Stile in Linea",

    // Alignment
    "Align": "Allinea",
    "Align Left": "Allinea a Sinistra",
    "Align Center": "Allinea al Cento",
    "Align Right": "Allinea a Destra",
    "Align Justify": "Giustifica",
    "None": "Nessuno",

    // Lists
    "Ordered List": "Elenchi Numerati",
    "Default": "Predefinito",
    "Lower Alpha": "Alfa inferiore",
    "Lower Greek": "Basso greco",
    "Lower Roman": "Romano inferiore",
    "Upper Alpha": "Alfa superiore",
    "Upper Roman": "Alto romano",

    "Unordered List": "Elenchi Puntati",
    "Circle": "Cerchio",
    "Disc": "Disco",
    "Square": "Piazza",

    // Line height
    "Line Height": "Altezza della linea",
    "Single": "Singolo",
    "Double": "Doppio",

    // Indent
    "Decrease Indent": "Riduci Rientro",
    "Increase Indent": "Aumenta Rientro",

    // Links
    "Insert Link": "Inserisci Link",
    "Open in new tab": "Apri in nuova scheda",
    "Open Link": "Apri Link",
    "Edit Link": "Modifica Link",
    "Unlink": "Rimuovi Link",
    "Choose Link": "Scegli Link",

    // Images
    "Insert Image": "Inserisci Immagine",
    "Upload Image": "Carica Immagine",
    "By URL": "Inserisci URL",
    "Browse": "Sfoglia",
    "Drop image": "Rilascia immagine",
    "or click": "oppure clicca qui",
    "Manage Images": "Gestione Immagini",
    "Loading": "Caricamento",
    "Deleting": "Eliminazione",
    "Tags": "Etichetta",
    "Are you sure? Image will be deleted.": "Sei sicuro? L\'immagine verr\u00e0 cancellata.",
    "Replace": "Sostituisci",
    "Uploading": "Caricamento",
    "Loading image": "Caricamento immagine",
    "Display": "Visualizzazione",
    "Inline": "In Linea",
    "Break Text": "Separa dal Testo",
    "Alternative Text": "Testo Alternativo",
    "Change Size": "Cambia Dimensioni",
    "Width": "Larghezza",
    "Height": "Altezza",
    "Something went wrong. Please try again.": "Qualcosa non ha funzionato. Riprova, per favore.",
    "Image Caption": "Didascalia",
    "Advanced Edit": "Avanzato",

    // Video
    "Insert Video": "Inserisci Video",
    "Embedded Code": "Codice Incorporato",
    "Paste in a video URL": "Incolla l'URL del video",
    "Drop video": "Rilascia video",
    "Your browser does not support HTML5 video.": "Il tuo browser non supporta i video html5.",
    "Upload Video": "Carica Video",

    // Tables
    "Insert Table": "Inserisci Tabella",
    "Table Header": "Intestazione Tabella",
    "Remove Table": "Rimuovi Tabella",
    "Table Style": "Stile Tabella",
    "Horizontal Align": "Allineamento Orizzontale",
    "Row": "Riga",
    "Insert row above": "Inserisci una riga prima",
    "Insert row below": "Inserisci una riga dopo",
    "Delete row": "Cancella riga",
    "Column": "Colonna",
    "Insert column before": "Inserisci una colonna prima",
    "Insert column after": "Inserisci una colonna dopo",
    "Delete column": "Cancella colonna",
    "Cell": "Cella",
    "Merge cells": "Unisci celle",
    "Horizontal split": "Dividi in orizzontale",
    "Vertical split": "Dividi in verticale",
    "Cell Background": "Sfondo Cella",
    "Vertical Align": "Allineamento Verticale",
    "Top": "Alto",
    "Middle": "Centro",
    "Bottom": "Basso",
    "Align Top": "Allinea in Alto",
    "Align Middle": "Allinea al Centro",
    "Align Bottom": "Allinea in Basso",
    "Cell Style": "Stile Cella",

    // Files
    "Upload File": "Carica File",
    "Drop file": "Rilascia file",

    // Emoticons
    "Emoticons": "Emoticon",
    "Grinning face": "Sorridente",
    "Grinning face with smiling eyes": "Sorridente con gli occhi sorridenti",
    "Face with tears of joy": "Con lacrime di gioia",
    "Smiling face with open mouth": "Sorridente con la bocca aperta",
    "Smiling face with open mouth and smiling eyes": "Sorridente con la bocca aperta e gli occhi sorridenti",
    "Smiling face with open mouth and cold sweat": "Sorridente con la bocca aperta e sudore freddo",
    "Smiling face with open mouth and tightly-closed eyes": "Sorridente con la bocca aperta e gli occhi stretti",
    "Smiling face with halo": "Sorridente con aureola",
    "Smiling face with horns": "Diavolo sorridente",
    "Winking face": "Ammiccante",
    "Smiling face with smiling eyes": "Sorridente imbarazzato",
    "Face savoring delicious food": "Goloso",
    "Relieved face": "Rassicurato",
    "Smiling face with heart-shaped eyes": "Sorridente con gli occhi a forma di cuore",
    "Smiling face with sunglasses": "Sorridente con gli occhiali da sole",
    "Smirking face": "Compiaciuto",
    "Neutral face": "Neutro",
    "Expressionless face": "Inespressivo",
    "Unamused face": "Annoiato",
    "Face with cold sweat": "Sudare freddo",
    "Pensive face": "Pensieroso",
    "Confused face": "Perplesso",
    "Confounded face": "Confuso",
    "Kissing face": "Bacio",
    "Face throwing a kiss": "Manda un bacio",
    "Kissing face with smiling eyes": "Bacio con gli occhi sorridenti",
    "Kissing face with closed eyes": "Bacio con gli occhi chiusi",
    "Face with stuck out tongue": "Linguaccia",
    "Face with stuck out tongue and winking eye": "Linguaccia ammiccante",
    "Face with stuck out tongue and tightly-closed eyes": "Linguaccia con occhi stretti",
    "Disappointed face": "Deluso",
    "Worried face": "Preoccupato",
    "Angry face": "Arrabbiato",
    "Pouting face": "Imbronciato",
    "Crying face": "Pianto",
    "Persevering face": "Perseverante",
    "Face with look of triumph": "Trionfante",
    "Disappointed but relieved face": "Deluso ma rassicurato",
    "Frowning face with open mouth": "Accigliato con la bocca aperta",
    "Anguished face": "Angosciato",
    "Fearful face": "Pauroso",
    "Weary face": "Stanco",
    "Sleepy face": "Assonnato",
    "Tired face": "Snervato",
    "Grimacing face": "Smorfia",
    "Loudly crying face": "Pianto a gran voce",
    "Face with open mouth": "Bocca aperta",
    "Hushed face": "Silenzioso",
    "Face with open mouth and cold sweat": "Bocca aperta e sudore freddo",
    "Face screaming in fear": "Urlante dalla paura",
    "Astonished face": "Stupito",
    "Flushed face": "Arrossito",
    "Sleeping face": "Addormentato",
    "Dizzy face": "Stordito",
    "Face without mouth": "Senza parole",
    "Face with medical mask": "Malattia infettiva",

    // Line breaker
    "Break": "Separatore",

    // Math
    "Subscript": "Pedice",
    "Superscript": "Apice",

    // Full screen
    "Fullscreen": "Schermo intero",

    // Horizontal line
    "Insert Horizontal Line": "Inserisci Divisore Orizzontale",

    // Clear formatting
    "Clear Formatting": "Cancella Formattazione",

    // Save
    "Save": "Salvare",

    // Undo, redo
    "Undo": "Annulla",
    "Redo": "Ripeti",

    // Select all
    "Select All": "Seleziona Tutto",

    // Code view
    "Code View": "Visualizza Codice",

    // Quote
    "Quote": "Citazione",
    "Increase": "Aumenta",
    "Decrease": "Diminuisci",

    // Quick Insert
    "Quick Insert": "Inserimento Rapido",

    // Spcial Characters
    "Special Characters": "Caratteri Speciali",
    "Latin": "Latino",
    "Greek": "Greco",
    "Cyrillic": "Cirillico",
    "Punctuation": "Punteggiatura",
    "Currency": "Valuta",
    "Arrows": "Frecce",
    "Math": "Matematica",
    "Misc": "Misc",

    // Print.
    "Print": "Stampa",

    // Spell Checker.
    "Spell Checker": "Correttore Ortografico",

    // Help
    "Help": "Aiuto",
    "Shortcuts": "Scorciatoie",
    "Inline Editor": "Editor in Linea",
    "Show the editor": "Mostra Editor",
    "Common actions": "Azioni comuni",
    "Copy": "Copia",
    "Cut": "Taglia",
    "Paste": "Incolla",
    "Basic Formatting": "Formattazione di base",
    "Increase quote level": "Aumenta il livello di citazione",
    "Decrease quote level": "Diminuisci il livello di citazione",
    "Image / Video": "Immagine / Video",
    "Resize larger": "Pi\u00f9 grande",
    "Resize smaller": "Pi\u00f9 piccolo",
    "Table": "Tabella",
    "Select table cell": "Seleziona la cella della tabella",
    "Extend selection one cell": "Estendi la selezione di una cella",
    "Extend selection one row": "Estendi la selezione una riga",
    "Navigation": "Navigazione",
    "Focus popup / toolbar": "Metti a fuoco la barra degli strumenti",
    "Return focus to previous position": "Rimetti il fuoco sulla posizione precedente",

    // Embed.ly
    "Embed URL": "Incorpora URL",
    "Paste in a URL to embed": "Incolla un URL da incorporare",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "Il contenuto incollato proviene da un documento di Microsoft Word. Vuoi mantenere la formattazione di Word o pulirlo?",
    "Keep": "Mantieni",
    "Clean": "Pulisci",
    "Word Paste Detected": "\u00c8 stato rilevato un incolla da Word"
  },
  direction: "ltr"
};

}));
