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
 * English spoken in Great Britain
 */

$.FE.LANGUAGE['en_gb'] = {
  translation: {
    // Place holder
    "Type something": "Type something",

    // Basic formatting
    "Bold": "Bold",
    "Italic": "Italic",
    "Underline": "Underline",
    "Strikethrough": "Strikethrough",

    // Main buttons
    "Insert": "Insert",
    "Delete": "Delete",
    "Cancel": "Cancel",
    "OK": "OK",
    "Back": "Back",
    "Remove": "Remove",
    "More": "More",
    "Update": "Update",
    "Style": "Style",

    // Font
    "Font Family": "Font Family",
    "Font Size": "Font Size",

    // Colors
    "Colors": "Colours",
    "Background": "Background",
    "Text": "Text",
    "HEX Color": "HEX Colour",

    // Paragraphs
    "Paragraph Format": "Paragraph Format",
    "Normal": "Normal",
    "Code": "Code",
    "Heading 1": "Heading 1",
    "Heading 2": "Heading 2",
    "Heading 3": "Heading 3",
    "Heading 4": "Heading 4",

    // Style
    "Paragraph Style": "Paragraph Style",
    "Inline Style": "Inline Style",

    // Alignment
    "Align": "Align",
    "Align Left": "Align Left",
    "Align Center": "Align Centre",
    "Align Right": "Alight Right",
    "Align Justify": "Align Justify",
    "None": "None",

    // Lists
    "Ordered List": "Ordered List",
    "Default": "",
    "Lower Alpha": "Lower Alpha",
    "Lower Greek": "Lower Greek",
    "Lower Roman": "Lower Roman",
    "Upper Alpha": "Upper Alpha",
    "Upper Roman": "Upper Roman",

    "Unordered List": "Unordered List",
    "Circle": "Circle",
    "Disc": "Disc",
    "Square": "Square",

    // Line height
    "Line Height": "Line Height",
    "Single": "Single",
    "Double": "Double",

    // Indent
    "Decrease Indent": "Decrease Indent",
    "Increase Indent": "Increase Indent",

    // Links
    "Insert Link": "Insert Link",
    "Open in new tab": "Open in new tab",
    "Open Link": "Open Link",
    "Edit Link": "Edit Link",
    "Unlink": "Unlink",
    "Choose Link": "Choose Link",

    // Images
    "Insert Image": "Insert Image",
    "Upload Image": "Upload Image",
    "By URL": "By URL",
    "Browse": "Browse",
    "Drop image": "Drop image",
    "or click": "or click",
    "Manage Images": "Manage Images",
    "Loading": "Loading",
    "Deleting": "Deleting",
    "Tags": "Tags",
    "Are you sure? Image will be deleted.": "Are you sure? Image will be deleted.",
    "Replace": "Replace",
    "Uploading": "Uploading",
    "Loading image": "Loading image",
    "Display": "Display",
    "Inline": "Inline",
    "Break Text": "Break Text",
    "Alternative Text": "Alternative Text",
    "Change Size": "Change Size",
    "Width": "Width",
    "Height": "Height",
    "Something went wrong. Please try again.": "Something went wrong. Please try again.",
    "Image Caption": "Image Caption",
    "Advanced Edit": "Advanced Edit",

    // Video
    "Insert Video": "Insert Video",
    "Embedded Code": "Embedded Code",
    "Paste in a video URL": "Paste in a video URL",
    "Drop video": "Drop video",
    "Your browser does not support HTML5 video.": "Your browser does not support HTML5 video.",
    "Upload Video": "Upload Video",

    // Tables
    "Insert Table": "Insert Table",
    "Table Header": "Table Header",
    "Remove Table": "Remove Table",
    "Table Style": "Table Style",
    "Horizontal Align": "Horizontal Align",
    "Row": "Row",
    "Insert row above": "Insert row above",
    "Insert row below": "Insert row below",
    "Delete row": "Delete row",
    "Column": "Column",
    "Insert column before": "Insert column before",
    "Insert column after": "Insert column after",
    "Delete column": "Delete column",
    "Cell": "Cell",
    "Merge cells": "Merge cells",
    "Horizontal split": "Horizontal split",
    "Vertical split": "Vertical split",
    "Cell Background": "Cell Background",
    "Vertical Align": "Vertical Align",
    "Top": "Top",
    "Middle": "Middle",
    "Bottom": "Bottom",
    "Align Top": "Align Top",
    "Align Middle": "Align Middle",
    "Align Bottom": "Align Bottom",
    "Cell Style": "Cell Style",

    // Files
    "Upload File": "Upload File",
    "Drop file": "Drop file",

    // Emoticons
    "Emoticons": "Emoticons",

    // Line breaker
    "Break": "Break",

    // Math
    "Subscript": "Subscript",
    "Superscript": "Superscript",

    // Full screen
    "Fullscreen": "Fullscreen",

    // Horizontal line
    "Insert Horizontal Line": "Insert Horizontal Line",

    // Clear formatting
    "Clear Formatting": "Clear Formatting",

    // Save
    "Save": "Save",

    // Undo, redo
    "Undo": "Undo",
    "Redo": "Redo",

    // Select all
    "Select All": "Select All",

    // Code view
    "Code View": "Code View",

    // Quote
    "Quote": "Quote",
    "Increase": "Increase",
    "Decrease": "Decrease",

    // Quick Insert
    "Quick Insert": "Quick Insert",

    // Spcial Characters
    "Special Characters": "Special Characters",
    "Latin": "Latin",
    "Greek": "Greek",
    "Cyrillic": "Cyrillic",
    "Punctuation": "Punctuation",
    "Currency": "Currency",
    "Arrows": "Arrows",
    "Math": "Math",
    "Misc": "Misc",

    // Print.
    "Print": "Print",

    // Spell Checker.
    "Spell Checker": "Spell Checker",

    // Help
    "Help": "Help",
    "Shortcuts": "Shortcuts",
    "Inline Editor": "Inline Editor",
    "Show the editor": "Show the editor",
    "Common actions": "Common actions",
    "Copy": "Copy",
    "Cut": "Cut",
    "Paste": "Paste",
    "Basic Formatting": "Basic Formatting",
    "Increase quote level": "Increase quote level",
    "Decrease quote level": "Decrease quote level",
    "Image / Video": "Image / Video",
    "Resize larger": "Resize larger",
    "Resize smaller": "Resize smaller",
    "Table": "Table",
    "Select table cell": "Select table cell",
    "Extend selection one cell": "Extend selection one cell",
    "Extend selection one row": "Extend selection one row",
    "Navigation": "Navigation",
    "Focus popup / toolbar": "Focus popup / toolbar",
    "Return focus to previous position": "Return focus to previous position",

    // Embed.ly
    "Embed URL": "Embed URL",
    "Paste in a URL to embed": "Paste in a URL to embed",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?",
    "Keep": "Keep",
    "Clean": "Clean",
    "Word Paste Detected": "Word Paste Detected"
  },
  direction: "ltr"
};

}));
