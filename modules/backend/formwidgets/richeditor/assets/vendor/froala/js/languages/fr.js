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
 * French
 */

$.FE.LANGUAGE['fr'] = {
  translation: {
    // Place holder
    "Type something": "Tapez quelque chose",

    // Basic formatting
    "Bold": "Gras",
    "Italic": "Italique",
    "Underline": "Soulign\u00e9",
    "Strikethrough": "Barr\u00e9",

    // Main buttons
    "Insert": "Ins\u00e9rer",
    "Delete": "Supprimer",
    "Cancel": "Annuler",
    "OK": "Ok",
    "Back": "Retour",
    "Remove": "Supprimer",
    "More": "Plus",
    "Update": "Actualiser",
    "Style": "Style",

    // Font
    "Font Family": "Polices de caract\u00e8res",
    "Font Size": "Taille de police",

    // Colors
    "Colors": "Couleurs",
    "Background": "Arri\u00e8re-plan",
    "Text": "Texte",
    "HEX Color": "Couleur hexad\u00e9cimale",

    // Paragraphs
    "Paragraph Format": "Format de paragraphe",
    "Normal": "Normal",
    "Code": "Code",
    "Heading 1": "Titre 1",
    "Heading 2": "Titre 2",
    "Heading 3": "Titre 3",
    "Heading 4": "Titre 4",

    // Style
    "Paragraph Style": "Style de paragraphe",
    "Inline Style": "Style en ligne",

    // Alignment
    "Align": "Aligner",
    "Align Left": "Aligner \u00e0 gauche",
    "Align Center": "Aligner au centre",
    "Align Right": "Aligner \u00e0 droite",
    "Align Justify": "Justifier",
    "None": "Aucun",

    // Lists
    "Ordered List": "Liste ordonn\u00e9e",
    "Default": "Défaut",
    "Lower Alpha": "Alpha inférieur",
    "Lower Greek": "Grec inférieur",
    "Lower Roman": "Bas romain",
    "Upper Alpha": "Alpha supérieur",
    "Upper Roman": "Haut romain",

    "Unordered List": "Liste non ordonn\u00e9e",
    "Circle": "Cercle",
    "Disc": "Disque",
    "Square": "Carré",

    // Line height
    "Line Height": "Hauteur de la ligne",
    "Single": "Unique",
    "Double": "Double",

    // Indent
    "Decrease Indent": "Diminuer le retrait",
    "Increase Indent": "Augmenter le retrait",

    // Links
    "Insert Link": "Ins\u00e9rer un lien",
    "Open in new tab": "Ouvrir dans un nouvel onglet",
    "Open Link": "Ouvrir le lien",
    "Edit Link": "Modifier le lien",
    "Unlink": "Enlever le lien",
    "Choose Link": "Choisir le lien",

    // Images
    "Insert Image": "Ins\u00e9rer une image",
    "Upload Image": "T\u00e9l\u00e9verser une image",
    "By URL": "Par URL",
    "Browse": "Parcourir",
    "Drop image": "D\u00e9poser une image",
    "or click": "ou cliquer",
    "Manage Images": "G\u00e9rer les images",
    "Loading": "Chargement",
    "Deleting": "Suppression",
    "Tags": "\u00c9tiquettes",
    "Are you sure? Image will be deleted.": "Etes-vous certain? L'image sera supprim\u00e9e.",
    "Replace": "Remplacer",
    "Uploading": "En t\u00e9l\u00e9versement d'images",
    "Loading image": "En chargement d'images",
    "Display": "Afficher",
    "Inline": "En ligne",
    "Break Text": "Rompre le texte",
    "Alternative Text": "Texte alternatif",
    "Change Size": "Changer la dimension",
    "Width": "Largeur",
    "Height": "Hauteur",
    "Something went wrong. Please try again.": "Quelque chose a mal tourn\u00e9. Veuillez r\u00e9essayer.",
    "Image Caption": "L\u00e9gende de l'image",
    "Advanced Edit": "\u00c9dition avanc\u00e9e",

    // Video
    "Insert Video": "Ins\u00e9rer une vid\u00e9o",
    "Embedded Code": "Code int\u00e9gr\u00e9",
    "Paste in a video URL": "Coller l'URL d'une vid\u00e9o",
    "Drop video": "D\u00e9poser une vid\u00e9o",
    "Your browser does not support HTML5 video.": "Votre navigateur ne supporte pas les vid\u00e9os en format HTML5.",
    "Upload Video": "T\u00e9l\u00e9verser une vid\u00e9o",

    // Tables
    "Insert Table": "Ins\u00e9rer un tableau",
    "Table Header": "Ent\u00eate de tableau",
    "Remove Table": "Supprimer le tableau",
    "Table Style": "Style de tableau",
    "Horizontal Align": "Alignement horizontal",
    "Row": "Ligne",
    "Insert row above": "Ins\u00e9rer une ligne au-dessus",
    "Insert row below": "Ins\u00e9rer une ligne en-dessous",
    "Delete row": "Supprimer la ligne",
    "Column": "Colonne",
    "Insert column before": "Ins\u00e9rer une colonne avant",
    "Insert column after": "Ins\u00e9rer une colonne apr\u00e8s",
    "Delete column": "Supprimer la colonne",
    "Cell": "Cellule",
    "Merge cells": "Fusionner les cellules",
    "Horizontal split": "Diviser horizontalement",
    "Vertical split": "Diviser verticalement",
    "Cell Background": "Arri\u00e8re-plan de la cellule",
    "Vertical Align": "Alignement vertical",
    "Top": "En haut",
    "Middle": "Au centre",
    "Bottom": "En bas",
    "Align Top": "Aligner en haut",
    "Align Middle": "Aligner au centre",
    "Align Bottom": "Aligner en bas",
    "Cell Style": "Style de cellule",

    // Files
    "Upload File": "T\u00e9l\u00e9verser un fichier",
    "Drop file": "D\u00e9poser un fichier",

    // Emoticons
    "Emoticons": "\u00c9motic\u00f4nes",
    "Grinning face": "Souriant visage",
    "Grinning face with smiling eyes": "Souriant visage aux yeux souriants",
    "Face with tears of joy": "Visage \u00e0 des larmes de joie",
    "Smiling face with open mouth": "Visage souriant avec la bouche ouverte",
    "Smiling face with open mouth and smiling eyes": "Visage souriant avec la bouche ouverte et les yeux en souriant",
    "Smiling face with open mouth and cold sweat": "Visage souriant avec la bouche ouverte et la sueur froide",
    "Smiling face with open mouth and tightly-closed eyes": "Visage souriant avec la bouche ouverte et les yeux herm\u00e9tiquement clos",
    "Smiling face with halo": "Sourire visage avec halo",
    "Smiling face with horns": "Visage souriant avec des cornes",
    "Winking face": "Clin d'oeil visage",
    "Smiling face with smiling eyes": "Sourire visage aux yeux souriants",
    "Face savoring delicious food": "Visage savourant de d\u00e9licieux plats",
    "Relieved face": "Soulag\u00e9 visage",
    "Smiling face with heart-shaped eyes": "Visage souriant avec des yeux en forme de coeur",
    "Smiling face with sunglasses": "Sourire visage avec des lunettes de soleil",
    "Smirking face": "Souriant visage",
    "Neutral face": "Visage neutre",
    "Expressionless face": "Visage sans expression",
    "Unamused face": "Visage pas amus\u00e9",
    "Face with cold sweat": "Face \u00e0 la sueur froide",
    "Pensive face": "pensif visage",
    "Confused face": "Visage confus",
    "Confounded face": "visage maudit",
    "Kissing face": "Embrasser le visage",
    "Face throwing a kiss": "Visage jetant un baiser",
    "Kissing face with smiling eyes": "Embrasser le visage avec les yeux souriants",
    "Kissing face with closed eyes": "Embrasser le visage avec les yeux ferm\u00e9s",
    "Face with stuck out tongue": "Visage avec sortait de la langue",
    "Face with stuck out tongue and winking eye": "Visage avec sortait de la langue et des yeux clignotante",
    "Face with stuck out tongue and tightly-closed eyes": "Visage avec sortait de la langue et les yeux ferm\u00e9s herm\u00e9tiquement",
    "Disappointed face": "Visage d\u00e9\u00e7u",
    "Worried face": "Visage inquiet",
    "Angry face": "Visage en col\u00e9re",
    "Pouting face": "Faire la moue face",
    "Crying face": "Pleurer visage",
    "Persevering face": "Pers\u00e9v\u00e9rer face",
    "Face with look of triumph": "Visage avec le regard de triomphe",
    "Disappointed but relieved face": "D\u00e9\u00e7u, mais le visage soulag\u00e9",
    "Frowning face with open mouth": "Les sourcils fronc\u00e9s visage avec la bouche ouverte",
    "Anguished face": "Visage angoiss\u00e9",
    "Fearful face": "Craignant visage",
    "Weary face": "Visage las",
    "Sleepy face": "Visage endormi",
    "Tired face": "Visage fatigu\u00e9",
    "Grimacing face": "Visage grima\u00e7ante",
    "Loudly crying face": "Pleurer bruyamment visage",
    "Face with open mouth": "Visage \u00e0 la bouche ouverte",
    "Hushed face": "Visage feutr\u00e9e",
    "Face with open mouth and cold sweat": "Visage \u00e0 la bouche ouverte et la sueur froide",
    "Face screaming in fear": "Visage hurlant de peur",
    "Astonished face": "Visage \u00e9tonn\u00e9",
    "Flushed face": "Visage congestionn\u00e9",
    "Sleeping face": "Visage au bois dormant",
    "Dizzy face": "Visage vertige",
    "Face without mouth": "Visage sans bouche",
    "Face with medical mask": "Visage avec un masque m\u00e9dical",

    // Line breaker
    "Break": "Rompre",

    // Math
    "Subscript": "Indice",
    "Superscript": "Exposant",

    // Full screen
    "Fullscreen": "Plein \u00e9cran",

    // Horizontal line
    "Insert Horizontal Line": "Ins\u00e9rer une ligne horizontale",

    // Clear formatting
    "Clear Formatting": "Effacer le formatage",

    // Save
    "Save": "sauvegarder",

    // Undo, redo
    "Undo": "Annuler",
    "Redo": "R\u00e9tablir",

    // Select all
    "Select All": "Tout s\u00e9lectionner",

    // Code view
    "Code View": "Mode HTML",

    // Quote
    "Quote": "Citation",
    "Increase": "Augmenter",
    "Decrease": "Diminuer",

    // Quick Insert
    "Quick Insert": "Insertion rapide",

    // Spcial Characters
    "Special Characters": "Caract\u00e8res sp\u00e9ciaux",
    "Latin": "Latin",
    "Greek": "Grec",
    "Cyrillic": "Cyrillique",
    "Punctuation": "Ponctuation",
    "Currency": "Devise",
    "Arrows": "Fl\u00e8ches",
    "Math": "Math",
    "Misc": "Divers",

    // Print.
    "Print": "Imprimer",

    // Spell Checker.
    "Spell Checker": "Correcteur orthographique",

    // Help
    "Help": "Aide",
    "Shortcuts": "Raccourcis",
    "Inline Editor": "\u00c9diteur en ligne",
    "Show the editor": "Montrer l'\u00e9diteur",
    "Common actions": "Actions communes",
    "Copy": "Copier",
    "Cut": "Couper",
    "Paste": "Coller",
    "Basic Formatting": "Formatage de base",
    "Increase quote level": "Augmenter le niveau de citation",
    "Decrease quote level": "Diminuer le niveau de citation",
    "Image / Video": "Image / vid\u00e9o",
    "Resize larger": "Redimensionner plus grand",
    "Resize smaller": "Redimensionner plus petit",
    "Table": "Table",
    "Select table cell": "S\u00e9lectionner la cellule du tableau",
    "Extend selection one cell": "\u00c9tendre la s\u00e9lection d'une cellule",
    "Extend selection one row": "\u00c9tendre la s\u00e9lection d'une ligne",
    "Navigation": "Navigation",
    "Focus popup / toolbar": "Focus popup / toolbar",
    "Return focus to previous position": "Retourner l'accent sur le poste pr\u00e9c\u00e9dent",

    // Embed.ly
    "Embed URL": "URL int\u00e9gr\u00e9e",
    "Paste in a URL to embed": "Coller une URL int\u00e9gr\u00e9e",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "Le contenu coll\u00e9 provient d'un document Microsoft Word. Voulez-vous conserver le format ou le nettoyer?",
    "Keep": "Conserver",
    "Clean": "Nettoyer",
    "Word Paste Detected": "Copiage de mots d\u00e9tect\u00e9"
  },
  direction: "ltr"
};

}));
