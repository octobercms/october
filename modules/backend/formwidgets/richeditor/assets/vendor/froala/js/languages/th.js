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
 * Thai
 */

$.FE.LANGUAGE['th'] = {
  translation: {
    // Place holder
    "Type something": "\u0e1e\u0e34\u0e21\u0e1e\u0e4c\u0e1a\u0e32\u0e07\u0e2a\u0e34\u0e48\u0e07\u0e1a\u0e32\u0e07\u0e2d\u0e22\u0e48\u0e32\u0e07",

    // Basic formatting
    "Bold": "\u0e15\u0e31\u0e27\u0e2b\u0e19\u0e32",
    "Italic": "\u0e15\u0e31\u0e27\u0e40\u0e2d\u0e35\u0e22\u0e07",
    "Underline": "\u0e02\u0e35\u0e14\u0e40\u0e2a\u0e49\u0e19\u0e43\u0e15\u0e49",
    "Strikethrough": "\u0e02\u0e35\u0e14\u0e17\u0e31\u0e1a",

    // Main buttons
    "Insert": "\u0e41\u0e17\u0e23\u0e01",
    "Delete": "\u0e25\u0e1a",
    "Cancel": "\u0e22\u0e01\u0e40\u0e25\u0e34\u0e01",
    "OK": "\u0e15\u0e01\u0e25\u0e07",
    "Back": "\u0e01\u0e25\u0e31\u0e1a",
    "Remove": "\u0e40\u0e2d\u0e32\u0e2d\u0e2d\u0e01",
    "More": "\u0e21\u0e32\u0e01\u0e01\u0e27\u0e48\u0e32",
    "Update": "\u0e2d\u0e31\u0e1e\u0e40\u0e14\u0e17",
    "Style": "\u0e2a\u0e44\u0e15\u0e25\u0e4c",

    // Font
    "Font Family": "\u0e15\u0e23\u0e30\u0e01\u0e39\u0e25\u0e41\u0e1a\u0e1a\u0e2d\u0e31\u0e01\u0e29\u0e23",
    "Font Size": "\u0e02\u0e19\u0e32\u0e14\u0e41\u0e1a\u0e1a\u0e2d\u0e31\u0e01\u0e29\u0e23",

    // Colors
    "Colors": "\u0e2a\u0e35",
    "Background": "\u0e1e\u0e37\u0e49\u0e19\u0e2b\u0e25\u0e31\u0e07",
    "Text": "\u0e02\u0e49\u0e2d\u0e04\u0e27\u0e32\u0e21",
    "HEX Color": "สีฐานสิบหก",

    // Paragraphs
    "Paragraph Format": "\u0e23\u0e39\u0e1b\u0e41\u0e1a\u0e1a",
    "Normal": "\u0e1b\u0e01\u0e15\u0e34",
    "Code": "\u0e42\u0e04\u0e49\u0e14",
    "Heading 1": "\u0e2a\u0e48\u0e27\u0e19\u0e2b\u0e31\u0e27 1",
    "Heading 2": "\u0e2a\u0e48\u0e27\u0e19\u0e2b\u0e31\u0e27 2",
    "Heading 3": "\u0e2a\u0e48\u0e27\u0e19\u0e2b\u0e31\u0e27 3",
    "Heading 4": "\u0e2a\u0e48\u0e27\u0e19\u0e2b\u0e31\u0e27 4",

    // Style
    "Paragraph Style": "\u0e25\u0e31\u0e01\u0e29\u0e13\u0e30\u0e22\u0e48\u0e2d\u0e2b\u0e19\u0e49\u0e32",
    "Inline Style": "\u0e23\u0e39\u0e1b\u0e41\u0e1a\u0e1a\u0e2d\u0e34\u0e19\u0e44\u0e25\u0e19\u0e4c",

    // Alignment
    "Align": "\u0e01\u0e32\u0e23\u0e08\u0e31\u0e14\u0e41\u0e19\u0e27",
    "Align Left": "\u0e08\u0e31\u0e14\u0e0a\u0e34\u0e14\u0e0b\u0e49\u0e32\u0e22",
    "Align Center": "\u0e08\u0e31\u0e14\u0e01\u0e36\u0e48\u0e07\u0e01\u0e25\u0e32\u0e07",
    "Align Right": "\u0e08\u0e31\u0e14\u0e0a\u0e34\u0e14\u0e02\u0e27\u0e32",
    "Align Justify": "\u0e40\u0e15\u0e47\u0e21\u0e41\u0e19\u0e27",
    "None": "\u0e44\u0e21\u0e48",

    // Lists
    "Ordered List": "\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e25\u0e33\u0e14\u0e31\u0e1a\u0e40\u0e25\u0e02",
    "Default": "ค่าเริ่มต้น",
    "Lower Alpha": "อัลฟาตอนล่าง",
    "Lower Greek": "กรีกต่ำกว่า",
    "Lower Roman": "โรมันล่าง",
    "Upper Alpha": "อัลฟาตอนบน",
    "Upper Roman": "โรมันตอนบน",

    "Unordered List": "\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e2a\u0e31\u0e0d\u0e25\u0e31\u0e01\u0e29\u0e13\u0e4c\u0e2b\u0e31\u0e27\u0e02\u0e49\u0e2d\u0e22\u0e48\u0e2d\u0e22",
    "Circle": "วงกลม",
    "Disc": "จาน",
    "Square": "สี่เหลี่ยม",

    // Line height
    "Line Height": "ความสูงของบรรทัด",
    "Single": "เดียว",
    "Double": "สอง",

    // Indent
    "Decrease Indent": "\u0e25\u0e14\u0e01\u0e32\u0e23\u0e40\u0e22\u0e37\u0e49\u0e2d\u0e07",
    "Increase Indent": "\u0e40\u0e1e\u0e34\u0e48\u0e21\u0e01\u0e32\u0e23\u0e40\u0e22\u0e37\u0e49\u0e2d\u0e07",

    // Links
    "Insert Link": "\u0e41\u0e17\u0e23\u0e01\u0e25\u0e34\u0e07\u0e01\u0e4c",
    "Open in new tab": "\u0e40\u0e1b\u0e34\u0e14\u0e43\u0e19\u0e41\u0e17\u0e47\u0e1a\u0e43\u0e2b\u0e21\u0e48",
    "Open Link": "\u0e40\u0e1b\u0e34\u0e14\u0e25\u0e34\u0e49\u0e07\u0e04\u0e4c",
    "Edit Link": "\u0e25\u0e34\u0e07\u0e04\u0e4c\u0e41\u0e01\u0e49\u0e44\u0e02",
    "Unlink": "\u0e40\u0e2d\u0e32\u0e25\u0e34\u0e07\u0e01\u0e4c\u0e2d\u0e2d\u0e01",
    "Choose Link": "\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e01\u0e32\u0e23\u0e40\u0e0a\u0e37\u0e48\u0e2d\u0e21\u0e42\u0e22\u0e07",

    // Images
    "Insert Image": "\u0e41\u0e17\u0e23\u0e01\u0e23\u0e39\u0e1b\u0e20\u0e32\u0e1e",
    "Upload Image": "\u0e01\u0e32\u0e23\u0e2d\u0e31\u0e1b\u0e42\u0e2b\u0e25\u0e14\u0e20\u0e32\u0e1e",
    "By URL": "\u0e15\u0e32\u0e21 URL",
    "Browse": "\u0e40\u0e23\u0e35\u0e22\u0e01\u0e14\u0e39",
    "Drop image": "\u0e27\u0e32\u0e07\u0e20\u0e32\u0e1e",
    "or click": "\u0e2b\u0e23\u0e37\u0e2d\u0e04\u0e25\u0e34\u0e01\u0e17\u0e35\u0e48",
    "Manage Images": "\u0e08\u0e31\u0e14\u0e01\u0e32\u0e23\u0e20\u0e32\u0e1e",
    "Loading": "\u0e42\u0e2b\u0e25\u0e14",
    "Deleting": "\u0e25\u0e1a",
    "Tags": "\u0e41\u0e17\u0e47\u0e01",
    "Are you sure? Image will be deleted.": "\u0e04\u0e38\u0e13\u0e41\u0e19\u0e48\u0e43\u0e08\u0e2b\u0e23\u0e37\u0e2d\u0e44\u0e21\u0e48 \u0e20\u0e32\u0e1e\u0e08\u0e30\u0e16\u0e39\u0e01\u0e25\u0e1a",
    "Replace": "\u0e41\u0e17\u0e19\u0e17\u0e35\u0e48",
    "Uploading": "\u0e2d\u0e31\u0e1e\u0e42\u0e2b\u0e25\u0e14",
    "Loading image": "\u0e42\u0e2b\u0e25\u0e14\u0e20\u0e32\u0e1e",
    "Display": "\u0e41\u0e2a\u0e14\u0e07",
    "Inline": "\u0e41\u0e1a\u0e1a\u0e2d\u0e34\u0e19\u0e44\u0e25\u0e19\u0e4c",
    "Break Text": "\u0e02\u0e49\u0e2d\u0e04\u0e27\u0e32\u0e21\u0e2b\u0e22\u0e38\u0e14",
    "Alternative Text": "\u0e02\u0e49\u0e2d\u0e04\u0e27\u0e32\u0e21\u0e2d\u0e37\u0e48\u0e19",
    "Change Size": "\u0e40\u0e1b\u0e25\u0e35\u0e48\u0e22\u0e19\u0e02\u0e19\u0e32\u0e14",
    "Width": "\u0e04\u0e27\u0e32\u0e21\u0e01\u0e27\u0e49\u0e32\u0e07",
    "Height": "\u0e04\u0e27\u0e32\u0e21\u0e2a\u0e39\u0e07",
    "Something went wrong. Please try again.": "\u0e1a\u0e32\u0e07\u0e2d\u0e22\u0e48\u0e32\u0e07\u0e1c\u0e34\u0e14\u0e1b\u0e01\u0e15\u0e34. \u0e01\u0e23\u0e38\u0e13\u0e32\u0e25\u0e2d\u0e07\u0e2d\u0e35\u0e01\u0e04\u0e23\u0e31\u0e49\u0e07.",
    "Image Caption": "คำบรรยายภาพ",
    "Advanced Edit": "แก้ไขขั้นสูง",

    // Video
    "Insert Video": "\u0e41\u0e17\u0e23\u0e01\u0e27\u0e34\u0e14\u0e35\u0e42\u0e2d",
    "Embedded Code": "\u0e23\u0e2b\u0e31\u0e2a\u0e2a\u0e21\u0e2d\u0e07\u0e01\u0e25\u0e1d\u0e31\u0e07\u0e15\u0e31\u0e27",
    "Paste in a video URL": "วางใน URL วิดีโอ",
    "Drop video": "วางวิดีโอ",
    "Your browser does not support HTML5 video.": "เบราเซอร์ของคุณไม่สนับสนุนวิดีโอ HTML5",
    "Upload Video": "อัปโหลดวิดีโอ",

    // Tables
    "Insert Table": "\u0e41\u0e17\u0e23\u0e01\u0e15\u0e32\u0e23\u0e32\u0e07",
    "Table Header": "\u0e2a\u0e48\u0e27\u0e19\u0e2b\u0e31\u0e27\u0e02\u0e2d\u0e07\u0e15\u0e32\u0e23\u0e32\u0e07",
    "Remove Table": "\u0e40\u0e2d\u0e32\u0e15\u0e32\u0e23\u0e32\u0e07\u0e2d\u0e2d\u0e01",
    "Table Style": "\u0e25\u0e31\u0e01\u0e29\u0e13\u0e30\u0e15\u0e32\u0e23\u0e32\u0e07",
    "Horizontal Align": "\u0e43\u0e19\u0e41\u0e19\u0e27\u0e19\u0e2d\u0e19",
    "Row": "\u0e41\u0e16\u0e27",
    "Insert row above": "\u0e41\u0e17\u0e23\u0e01\u0e41\u0e16\u0e27\u0e14\u0e49\u0e32\u0e19\u0e1a\u0e19",
    "Insert row below": "\u0e41\u0e17\u0e23\u0e01\u0e41\u0e16\u0e27\u0e14\u0e49\u0e32\u0e19\u0e25\u0e48\u0e32\u0e07",
    "Delete row": "\u0e25\u0e1a\u0e41\u0e16\u0e27",
    "Column": "\u0e04\u0e2d\u0e25\u0e31\u0e21\u0e19\u0e4c",
    "Insert column before": "\u0e41\u0e17\u0e23\u0e01\u0e04\u0e2d\u0e25\u0e31\u0e21\u0e19\u0e4c\u0e02\u0e49\u0e32\u0e07\u0e2b\u0e19\u0e49\u0e32",
    "Insert column after": "\u0e41\u0e17\u0e23\u0e01\u0e04\u0e2d\u0e25\u0e31\u0e21\u0e19\u0e4c\u0e02\u0e49\u0e32\u0e07\u0e2b\u0e25\u0e31\u0e07",
    "Delete column": "\u0e25\u0e1a\u0e04\u0e2d\u0e25\u0e31\u0e21\u0e19\u0e4c",
    "Cell": "\u0e40\u0e0b\u0e25\u0e25\u0e4c",
    "Merge cells": "\u0e1c\u0e2a\u0e32\u0e19\u0e40\u0e0b\u0e25\u0e25\u0e4c",
    "Horizontal split": "\u0e41\u0e22\u0e01\u0e41\u0e19\u0e27\u0e19\u0e2d\u0e19",
    "Vertical split": "\u0e41\u0e22\u0e01\u0e43\u0e19\u0e41\u0e19\u0e27\u0e15\u0e31\u0e49\u0e07",
    "Cell Background": "\u0e1e\u0e37\u0e49\u0e19\u0e2b\u0e25\u0e31\u0e07\u0e02\u0e2d\u0e07\u0e40\u0e0b\u0e25\u0e25\u0e4c",
    "Vertical Align": "\u0e08\u0e31\u0e14\u0e41\u0e19\u0e27\u0e15\u0e31\u0e49\u0e07",
    "Top": "\u0e14\u0e49\u0e32\u0e19\u0e1a\u0e19",
    "Middle": "\u0e01\u0e25\u0e32\u0e07",
    "Bottom": "\u0e01\u0e49\u0e19",
    "Align Top": "\u0e08\u0e31\u0e14\u0e14\u0e49\u0e32\u0e19\u0e1a\u0e19",
    "Align Middle": "\u0e15\u0e4d\u0e32\u0e41\u0e2b\u0e19\u0e48\u0e07\u0e01\u0e25\u0e32\u0e07",
    "Align Bottom": "\u0e15\u0e4d\u0e32\u0e41\u0e2b\u0e19\u0e48\u0e07\u0e14\u0e49\u0e32\u0e19\u0e25\u0e48\u0e32\u0e07",
    "Cell Style": "\u0e23\u0e39\u0e1b\u0e41\u0e1a\u0e1a\u0e02\u0e2d\u0e07\u0e40\u0e0b\u0e25\u0e25\u0e4c",

    // Files
    "Upload File": "\u0e2d\u0e31\u0e1b\u0e42\u0e2b\u0e25\u0e14\u0e44\u0e1f\u0e25\u0e4c",
    "Drop file": "\u0e27\u0e32\u0e07\u0e44\u0e1f\u0e25\u0e4c",

    // Emoticons
    "Emoticons": "\u0e2d\u0e35\u0e42\u0e21\u0e15\u0e34\u0e04\u0e2d\u0e19",
    "Grinning face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e22\u0e34\u0e49\u0e21",
    "Grinning face with smiling eyes": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e22\u0e34\u0e49\u0e21\u0e14\u0e49\u0e27\u0e22\u0e15\u0e32\u0e22\u0e34\u0e49\u0e21",
    "Face with tears of joy": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e14\u0e49\u0e27\u0e22\u0e19\u0e49\u0e33\u0e15\u0e32\u0e41\u0e2b\u0e48\u0e07\u0e04\u0e27\u0e32\u0e21\u0e2a\u0e38\u0e02",
    "Smiling face with open mouth": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e40\u0e1b\u0e37\u0e49\u0e2d\u0e19\u0e23\u0e2d\u0e22\u0e22\u0e34\u0e49\u0e21\u0e17\u0e35\u0e48\u0e21\u0e35\u0e1b\u0e32\u0e01\u0e40\u0e1b\u0e34\u0e14",
    "Smiling face with open mouth and smiling eyes": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e22\u0e34\u0e49\u0e21\u0e01\u0e31\u0e1a\u0e40\u0e1b\u0e34\u0e14\u0e1b\u0e32\u0e01\u0e41\u0e25\u0e30\u0e15\u0e32\u0e22\u0e34\u0e49\u0e21",
    "Smiling face with open mouth and cold sweat": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e22\u0e34\u0e49\u0e21\u0e14\u0e49\u0e27\u0e22\u0e1b\u0e32\u0e01\u0e40\u0e1b\u0e34\u0e14\u0e41\u0e25\u0e30\u0e40\u0e2b\u0e07\u0e37\u0e48\u0e2d\u0e40\u0e22\u0e47\u0e19",
    "Smiling face with open mouth and tightly-closed eyes": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e22\u0e34\u0e49\u0e21\u0e01\u0e31\u0e1a\u0e40\u0e1b\u0e34\u0e14\u0e1b\u0e32\u0e01\u0e41\u0e25\u0e30\u0e15\u0e32\u0e41\u0e19\u0e48\u0e19\u0e1b\u0e34\u0e14",
    "Smiling face with halo": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e22\u0e34\u0e49\u0e21\u0e17\u0e35\u0e48\u0e21\u0e35\u0e23\u0e31\u0e28\u0e21\u0e35",
    "Smiling face with horns": "\u0e22\u0e34\u0e49\u0e21\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e21\u0e35\u0e40\u0e02\u0e32",
    "Winking face": "\u0e01\u0e32\u0e23\u0e01\u0e23\u0e30\u0e1e\u0e23\u0e34\u0e1a\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32",
    "Smiling face with smiling eyes": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e22\u0e34\u0e49\u0e21\u0e14\u0e49\u0e27\u0e22\u0e15\u0e32\u0e22\u0e34\u0e49\u0e21",
    "Face savoring delicious food": "\u0e40\u0e1c\u0e0a\u0e34\u0e0d \u0073\u0061\u0076\u006f\u0072\u0069\u006e\u0067 \u0e2d\u0e32\u0e2b\u0e32\u0e23\u0e2d\u0e23\u0e48\u0e2d\u0e22",
    "Relieved face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e42\u0e25\u0e48\u0e07\u0e43\u0e08",
    "Smiling face with heart-shaped eyes": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e22\u0e34\u0e49\u0e21\u0e14\u0e49\u0e27\u0e22\u0e15\u0e32\u0e23\u0e39\u0e1b\u0e2b\u0e31\u0e27\u0e43\u0e08",
    "Smiling face with sunglasses": "\u0e22\u0e34\u0e49\u0e21\u0e2b\u0e19\u0e49\u0e32\u0e14\u0e49\u0e27\u0e22\u0e41\u0e27\u0e48\u0e19\u0e15\u0e32\u0e01\u0e31\u0e19\u0e41\u0e14\u0e14",
    "Smirking face": "\u0e2b\u0e19\u0e49\u0e32\u0e41\u0e2a\u0e22\u0e30\u0e22\u0e34\u0e49\u0e21\u0e17\u0e35\u0e48\u0e21\u0e38\u0e21",
    "Neutral face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e17\u0e35\u0e48\u0e40\u0e1b\u0e47\u0e19\u0e01\u0e25\u0e32\u0e07",
    "Expressionless face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e2d\u0e32\u0e23\u0e21\u0e13\u0e4c",
    "Unamused face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32 \u0055\u006e\u0061\u006d\u0075\u0073\u0065\u0064",
    "Face with cold sweat": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e17\u0e35\u0e48\u0e21\u0e35\u0e40\u0e2b\u0e07\u0e37\u0e48\u0e2d\u0e40\u0e22\u0e47\u0e19",
    "Pensive face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e2b\u0e21\u0e48\u0e19",
    "Confused face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e2a\u0e31\u0e1a\u0e2a\u0e19",
    "Confounded face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e2a\u0e31\u0e1a\u0e2a\u0e19",
    "Kissing face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e08\u0e39\u0e1a",
    "Face throwing a kiss": "\u0e15\u0e49\u0e2d\u0e07\u0e40\u0e1c\u0e0a\u0e34\u0e0d\u0e01\u0e31\u0e1a\u0e01\u0e32\u0e23\u0e02\u0e27\u0e49\u0e32\u0e07\u0e1b\u0e32\u0e08\u0e39\u0e1a",
    "Kissing face with smiling eyes": "\u0e08\u0e39\u0e1a\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e14\u0e49\u0e27\u0e22\u0e15\u0e32\u0e22\u0e34\u0e49\u0e21",
    "Kissing face with closed eyes": "\u0e08\u0e39\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e14\u0e49\u0e27\u0e22\u0e14\u0e27\u0e07\u0e15\u0e32\u0e17\u0e35\u0e48\u0e1b\u0e34\u0e14\u0e2a\u0e19\u0e34\u0e17",
    "Face with stuck out tongue": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e21\u0e35\u0e41\u0e1e\u0e25\u0e21\u0e2d\u0e2d\u0e01\u0e21\u0e32\u0e25\u0e34\u0e49\u0e19",
    "Face with stuck out tongue and winking eye": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e21\u0e35\u0e15\u0e34\u0e14\u0e25\u0e34\u0e49\u0e19\u0e41\u0e25\u0e30\u0e15\u0e32\u0e02\u0e22\u0e34\u0e1a\u0e15\u0e32",
    "Face with stuck out tongue and tightly-closed eyes": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e21\u0e35\u0e15\u0e34\u0e14\u0e25\u0e34\u0e49\u0e19\u0e41\u0e25\u0e30\u0e14\u0e27\u0e07\u0e15\u0e32\u0e17\u0e35\u0e48\u0e1b\u0e34\u0e14\u0e41\u0e19\u0e48\u0e19",
    "Disappointed face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e1c\u0e34\u0e14\u0e2b\u0e27\u0e31\u0e07",
    "Worried face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e01\u0e31\u0e07\u0e27\u0e25",
    "Angry face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e42\u0e01\u0e23\u0e18",
    "Pouting face": "\u0e2b\u0e19\u0e49\u0e32\u0e21\u0e38\u0e48\u0e22",
    "Crying face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e23\u0e49\u0e2d\u0e07\u0e44\u0e2b\u0e49",
    "Persevering face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e40\u0e2d\u0e32\u0e16\u0e48\u0e32\u0e19",
    "Face with look of triumph": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e01\u0e31\u0e1a\u0e23\u0e39\u0e1b\u0e25\u0e31\u0e01\u0e29\u0e13\u0e4c\u0e02\u0e2d\u0e07\u0e0a\u0e31\u0e22\u0e0a\u0e19\u0e30",
    "Disappointed but relieved face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e1c\u0e34\u0e14\u0e2b\u0e27\u0e31\u0e07 \u0e41\u0e15\u0e48\u0e42\u0e25\u0e48\u0e07\u0e43\u0e08",
    "Frowning face with open mouth": "\u0e2b\u0e19\u0e49\u0e32\u0e21\u0e38\u0e48\u0e22\u0e17\u0e35\u0e48\u0e21\u0e35\u0e1b\u0e32\u0e01\u0e40\u0e1b\u0e34\u0e14",
    "Anguished face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e01\u0e14\u0e02\u0e35\u0e48",
    "Fearful face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e17\u0e35\u0e48\u0e19\u0e48\u0e32\u0e01\u0e25\u0e31\u0e27",
    "Weary face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e17\u0e35\u0e48\u0e40\u0e2b\u0e19\u0e37\u0e48\u0e2d\u0e22\u0e25\u0e49\u0e32",
    "Sleepy face": "\u0e2b\u0e19\u0e49\u0e32\u0e07\u0e48\u0e27\u0e07\u0e19\u0e2d\u0e19",
    "Tired face": "\u0e2b\u0e19\u0e49\u0e32\u0e40\u0e1a\u0e37\u0e48\u0e2d",
    "Grimacing face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32 \u0067\u0072\u0069\u006d\u0061\u0063\u0069\u006e\u0067",
    "Loudly crying face": "\u0e23\u0e49\u0e2d\u0e07\u0e44\u0e2b\u0e49\u0e40\u0e2a\u0e35\u0e22\u0e07\u0e14\u0e31\u0e07\u0e2b\u0e19\u0e49\u0e32",
    "Face with open mouth": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e17\u0e35\u0e48\u0e21\u0e35\u0e1b\u0e32\u0e01\u0e40\u0e1b\u0e34\u0e14",
    "Hushed face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e40\u0e07\u0e35\u0e22\u0e1a",
    "Face with open mouth and cold sweat": "หน้ากับปากเปิดและเหงื่อเย็น",
    "Face screaming in fear": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e17\u0e35\u0e48\u0e21\u0e35\u0e1b\u0e32\u0e01\u0e40\u0e1b\u0e34\u0e14\u0e41\u0e25\u0e30\u0e40\u0e2b\u0e07\u0e37\u0e48\u0e2d\u0e40\u0e22\u0e47\u0e19",
    "Astonished face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e1b\u0e23\u0e30\u0e2b\u0e25\u0e32\u0e14\u0e43\u0e08",
    "Flushed face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e41\u0e14\u0e07",
    "Sleeping face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e19\u0e2d\u0e19",
    "Dizzy face": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e15\u0e32\u0e25\u0e32\u0e22",
    "Face without mouth": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e42\u0e14\u0e22\u0e44\u0e21\u0e48\u0e15\u0e49\u0e2d\u0e07\u0e1b\u0e32\u0e01",
    "Face with medical mask": "\u0e43\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e14\u0e49\u0e27\u0e22\u0e2b\u0e19\u0e49\u0e32\u0e01\u0e32\u0e01\u0e17\u0e32\u0e07\u0e01\u0e32\u0e23\u0e41\u0e1e\u0e17\u0e22\u0e4c",

    // Line breaker
    "Break": "\u0e2b\u0e22\u0e38\u0e14",

    // Math
    "Subscript": "\u0e15\u0e31\u0e27\u0e2b\u0e49\u0e2d\u0e22",
    "Superscript": "\u0e15\u0e31\u0e27\u0e22\u0e01",

    // Full screen
    "Fullscreen": "\u0e40\u0e15\u0e47\u0e21\u0e2b\u0e19\u0e49\u0e32\u0e08\u0e2d",

    // Horizontal line
    "Insert Horizontal Line": "\u0e41\u0e17\u0e23\u0e01\u0e40\u0e2a\u0e49\u0e19\u0e41\u0e19\u0e27\u0e19\u0e2d\u0e19",

    // Clear formatting
    "Clear Formatting": "\u0e19\u0e33\u0e01\u0e32\u0e23\u0e08\u0e31\u0e14\u0e23\u0e39\u0e1b\u0e41\u0e1a\u0e1a",

    // Save
    "Save": "\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01",

    // Undo, redo
    "Undo": "\u0e40\u0e25\u0e34\u0e01\u0e17\u0e33",
    "Redo": "\u0e17\u0e4d\u0e32\u0e0b\u0e49\u0e33",

    // Select all
    "Select All": "\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e17\u0e31\u0e49\u0e07\u0e2b\u0e21\u0e14",

    // Code view
    "Code View": "\u0e21\u0e38\u0e21\u0e21\u0e2d\u0e07\u0e23\u0e2b\u0e31\u0e2a",

    // Quote
    "Quote": "\u0e2d\u0e49\u0e32\u0e07",
    "Increase": "\u0e40\u0e1e\u0e34\u0e48\u0e21",
    "Decrease": "\u0e25\u0e14\u0e25\u0e07",

    // Quick Insert
    "Quick Insert": "\u0e41\u0e17\u0e23\u0e01\u0e14\u0e48\u0e27\u0e19",

    // Spcial Characters
    "Special Characters": "อักขระพิเศษ",
    "Latin": "ละติน",
    "Greek": "กรีก",
    "Cyrillic": "ริลลิก",
    "Punctuation": "วรรคตอน",
    "Currency": "เงินตรา",
    "Arrows": "ลูกศร",
    "Math": "คณิตศาสตร์",
    "Misc": "อื่น ๆ",

    // Print.
    "Print": "พิมพ์",

    // Spell Checker.
    "Spell Checker": "ตัวตรวจสอบการสะกด",

    // Help
    "Help": "ช่วยด้วย",
    "Shortcuts": "ทางลัด",
    "Inline Editor": "ตัวแก้ไขแบบอินไลน์",
    "Show the editor": "แสดงตัวแก้ไข",
    "Common actions": "การกระทำร่วมกัน",
    "Copy": "สำเนา",
    "Cut": "ตัด",
    "Paste": "แปะ",
    "Basic Formatting": "การจัดรูปแบบพื้นฐาน",
    "Increase quote level": "ระดับราคาเพิ่มขึ้น",
    "Decrease quote level": "ระดับราคาลดลง",
    "Image / Video": "ภาพ / วิดีโอ",
    "Resize larger": "ปรับขนาดใหญ่ขึ้น",
    "Resize smaller": "ปรับขนาดเล็กลง",
    "Table": "ตาราง",
    "Select table cell": "เลือกเซลล์ตาราง",
    "Extend selection one cell": "ขยายการเลือกหนึ่งเซลล์",
    "Extend selection one row": "ขยายการเลือกหนึ่งแถว",
    "Navigation": "การเดินเรือ",
    "Focus popup / toolbar": "โฟกัสป๊อปอัพ / แถบเครื่องมือ",
    "Return focus to previous position": "กลับไปยังตำแหน่งก่อนหน้า",

    // Embed.ly
    "Embed URL": "ฝัง URL",
    "Paste in a URL to embed": "วางใน url เพื่อฝัง",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "เนื้อหาที่วางจะมาจากเอกสารคำในแบบ microsoft คุณต้องการเก็บรูปแบบหรือทำความสะอาดหรือไม่?",
    "Keep": "เก็บ",
    "Clean": "สะอาด",
    "Word Paste Detected": "ตรวจพบการวางคำ"
  },
  direction: "ltr"
};

}));
