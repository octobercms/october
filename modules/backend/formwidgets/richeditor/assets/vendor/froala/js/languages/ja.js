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
 * Japanese
 */

$.FE.LANGUAGE['ja'] = {
  translation: {
    // Place holder
    "Type something": "\u3053\u3053\u306b\u5165\u529b\u3057\u307e\u3059",

    // Basic formatting
    "Bold": "\u592a\u5b57",
    "Italic": "\u659c\u4f53",
    "Underline": "\u4e0b\u7dda",
    "Strikethrough": "\u53d6\u308a\u6d88\u3057\u7dda",

    // Main buttons
    "Insert": "\u633f\u5165",
    "Delete": "\u524a\u9664",
    "Cancel": "\u30ad\u30e3\u30f3\u30bb\u30eb",
    "OK": "OK",
    "Back": "\u623b\u308b",
    "Remove": "\u524a\u9664",
    "More": "\u3082\u3063\u3068",
    "Update": "\u66f4\u65b0",
    "Style": "\u30b9\u30bf\u30a4\u30eb",

    // Font
    "Font Family": "\u30d5\u30a9\u30f3\u30c8",
    "Font Size": "\u30d5\u30a9\u30f3\u30c8\u30b5\u30a4\u30ba",

    // Colors
    "Colors": "\u8272",
    "Background": "\u80cc\u666f",
    "Text": "\u30c6\u30ad\u30b9\u30c8",
    "HEX Color": "\u30d8\u30ad\u30b5\u306e\u8272",

    // Paragraphs
    "Paragraph Format": "\u6bb5\u843d\u306e\u66f8\u5f0f",
    "Normal": "\u6a19\u6e96",
    "Code": "\u30b3\u30fc\u30c9",
    "Heading 1": "\u30d8\u30c3\u30c0\u30fc 1",
    "Heading 2": "\u30d8\u30c3\u30c0\u30fc 2",
    "Heading 3": "\u30d8\u30c3\u30c0\u30fc 3",
    "Heading 4": "\u30d8\u30c3\u30c0\u30fc 4",

    // Style
    "Paragraph Style": "\u6bb5\u843d\u30b9\u30bf\u30a4\u30eb",
    "Inline Style": "\u30a4\u30f3\u30e9\u30a4\u30f3\u30b9\u30bf\u30a4\u30eb",

    // Alignment
    "Align": "\u914d\u7f6e",
    "Align Left": "\u5de6\u63c3\u3048",
    "Align Center": "\u4e2d\u592e\u63c3\u3048",
    "Align Right": "\u53f3\u63c3\u3048",
    "Align Justify": "\u4e21\u7aef\u63c3\u3048",
    "None": "\u306a\u3057",

    // Lists
    "Ordered List": "\u6bb5\u843d\u756a\u53f7",
    "Default": "デフォルト",
    "Lower Alpha": "下アルファ",
    "Lower Greek": "下ギリシャ",
    "Lower Roman": "下ローマ",
    "Upper Alpha": "アッパーアルファ",
    "Upper Roman": "アッパーローマン",

    "Unordered List": "\u7b87\u6761\u66f8\u304d",
    "Circle": "サークル",
    "Disc": "ディスク",
    "Square": "平方",

    // Line height
    "Line Height": "行の高さ",
    "Single": "シングル",
    "Double": "ダブル",

    // Indent
    "Decrease Indent": "\u30a4\u30f3\u30c7\u30f3\u30c8\u3092\u6e1b\u3089\u3059",
    "Increase Indent": "\u30a4\u30f3\u30c7\u30f3\u30c8\u3092\u5897\u3084\u3059",

    // Links
    "Insert Link": "\u30ea\u30f3\u30af\u306e\u633f\u5165",
    "Open in new tab": "\u65b0\u3057\u3044\u30bf\u30d6\u3067\u958b\u304f",
    "Open Link": "\u30ea\u30f3\u30af\u3092\u958b\u304f",
    "Edit Link": "\u30ea\u30f3\u30af\u306e\u7de8\u96c6",
    "Unlink": "\u30ea\u30f3\u30af\u306e\u524a\u9664",
    "Choose Link": "\u30ea\u30f3\u30af\u3092\u9078\u629e",

    // Images
    "Insert Image": "\u753b\u50cf\u306e\u633f\u5165",
    "Upload Image": "\u753b\u50cf\u3092\u30a2\u30c3\u30d7\u30ed\u30fc\u30c9",
    "By URL": "\u753b\u50cf\u306eURL\u3092\u5165\u529b",
    "Browse": "\u53c2\u7167",
    "Drop image": "\u753b\u50cf\u3092\u30c9\u30e9\u30c3\u30b0&\u30c9\u30ed\u30c3\u30d7",
    "or click": "\u307e\u305f\u306f\u30af\u30ea\u30c3\u30af",
    "Manage Images": "\u753b\u50cf\u306e\u7ba1\u7406",
    "Loading": "\u8aad\u307f\u8fbc\u307f\u4e2d",
    "Deleting": "\u524a\u9664",
    "Tags": "\u30bf\u30b0",
    "Are you sure? Image will be deleted.": "\u672c\u5f53\u306b\u524a\u9664\u3057\u307e\u3059\u304b\uff1f",
    "Replace": "\u7f6e\u63db",
    "Uploading": "\u30a2\u30c3\u30d7\u30ed\u30fc\u30c9\u4e2d",
    "Loading image": "\u753b\u50cf\u8aad\u307f\u8fbc\u307f\u4e2d",
    "Display": "\u8868\u793a",
    "Inline": "\u30a4\u30f3\u30e9\u30a4\u30f3",
    "Break Text": "\u30c6\u30ad\u30b9\u30c8\u306e\u6539\u884c",
    "Alternative Text": "\u4ee3\u66ff\u30c6\u30ad\u30b9\u30c8",
    "Change Size": "\u30b5\u30a4\u30ba\u5909\u66f4",
    "Width": "\u5e45",
    "Height": "\u9ad8\u3055",
    "Something went wrong. Please try again.": "\u554f\u984c\u304c\u767a\u751f\u3057\u307e\u3057\u305f\u3002\u3082\u3046\u4e00\u5ea6\u3084\u308a\u76f4\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
    "Image Caption": "\u753b\u50cf\u30ad\u30e3\u30d7\u30b7\u30e7\u30f3",
    "Advanced Edit": "\u9ad8\u5ea6\u306a\u7de8\u96c6",

    // Video
    "Insert Video": "\u52d5\u753b\u306e\u633f\u5165",
    "Embedded Code": "\u57cb\u3081\u8fbc\u307f\u30b3\u30fc\u30c9",
    "Paste in a video URL": "\u52d5\u753bURL\u306b\u8cbc\u308a\u4ed8\u3051\u308b",
    "Drop video": "\u52d5\u753b\u3092\u30c9\u30e9\u30c3\u30b0&\u30c9\u30ed\u30c3\u30d7",
    "Your browser does not support HTML5 video.": "\u3042\u306a\u305f\u306e\u30d6\u30e9\u30a6\u30b6\u306fhtml5 video\u3092\u30b5\u30dd\u30fc\u30c8\u3057\u3066\u3044\u307e\u305b\u3093\u3002",
    "Upload Video": "\u52d5\u753b\u306e\u30a2\u30c3\u30d7\u30ed\u30fc\u30c9",

    // Tables
    "Insert Table": "\u8868\u306e\u633f\u5165",
    "Table Header": "\u8868\u306e\u30d8\u30c3\u30c0\u30fc",
    "Remove Table": "\u8868\u306e\u524a\u9664",
    "Table Style": "\u8868\u306e\u30b9\u30bf\u30a4\u30eb",
    "Horizontal Align": "\u6a2a\u4f4d\u7f6e",
    "Row": "\u884c",
    "Insert row above": "\u4e0a\u306b\u884c\u3092\u633f\u5165",
    "Insert row below": "\u4e0b\u306b\u884c\u3092\u633f\u5165",
    "Delete row": "\u884c\u306e\u524a\u9664",
    "Column": "\u5217",
    "Insert column before": "\u5de6\u306b\u5217\u3092\u633f\u5165",
    "Insert column after": "\u53f3\u306b\u5217\u3092\u633f\u5165",
    "Delete column": "\u5217\u306e\u524a\u9664",
    "Cell": "\u30bb\u30eb",
    "Merge cells": "\u30bb\u30eb\u306e\u7d50\u5408",
    "Horizontal split": "\u6a2a\u5206\u5272",
    "Vertical split": "\u7e26\u5206\u5272",
    "Cell Background": "\u30bb\u30eb\u306e\u80cc\u666f",
    "Vertical Align": "\u7e26\u4f4d\u7f6e",
    "Top": "\u4e0a\u63c3\u3048",
    "Middle": "\u4e2d\u592e\u63c3\u3048",
    "Bottom": "\u4e0b\u63c3\u3048",
    "Align Top": "\u4e0a\u306b\u63c3\u3048\u307e\u3059",
    "Align Middle": "\u4e2d\u592e\u306b\u63c3\u3048\u307e\u3059",
    "Align Bottom": "\u4e0b\u306b\u63c3\u3048\u307e\u3059",
    "Cell Style": "\u30bb\u30eb\u30b9\u30bf\u30a4\u30eb",

    // Files
    "Upload File": "\u30d5\u30a1\u30a4\u30eb\u306e\u30a2\u30c3\u30d7\u30ed\u30fc\u30c9",
    "Drop file": "\u30d5\u30a1\u30a4\u30eb\u3092\u30c9\u30e9\u30c3\u30b0&\u30c9\u30ed\u30c3\u30d7",

    // Emoticons
    "Emoticons": "\u7d75\u6587\u5b57",
    "Grinning face": "\u30cb\u30f3\u30de\u30ea\u9854",
    "Grinning face with smiling eyes": "\u30cb\u30f3\u30de\u30ea\u9854(\u7b11\u3063\u3066\u3044\u308b\u76ee)",
    "Face with tears of joy": "\u5b09\u3057\u6ce3\u304d\u3059\u308b\u9854",
    "Smiling face with open mouth": "\u7b11\u9854(\u5e83\u3052\u305f\u53e3)",
    "Smiling face with open mouth and smiling eyes": "\u7b11\u9854(\u5e83\u3052\u305f\u53e3\u3001\u7b11\u3063\u3066\u3044\u308b\u76ee)",
    "Smiling face with open mouth and cold sweat": "\u7b11\u9854(\u5e83\u3052\u305f\u53e3\u3001\u51b7\u3084\u6c57)",
    "Smiling face with open mouth and tightly-closed eyes": "\u7b11\u9854(\u5e83\u3052\u305f\u53e3\u3001\u3057\u3063\u304b\u308a\u9589\u3058\u305f\u76ee)",
    "Smiling face with halo": "\u5929\u4f7f\u306e\u8f2a\u304c\u304b\u304b\u3063\u3066\u3044\u308b\u7b11\u9854",
    "Smiling face with horns": "\u89d2\u306e\u3042\u308b\u7b11\u9854",
    "Winking face": "\u30a6\u30a3\u30f3\u30af\u3057\u305f\u9854",
    "Smiling face with smiling eyes": "\u7b11\u9854(\u7b11\u3063\u3066\u3044\u308b\u76ee)",
    "Face savoring delicious food": "\u304a\u3044\u3057\u3044\u3082\u306e\u3092\u98df\u3079\u305f\u9854",
    "Relieved face": "\u5b89\u5fc3\u3057\u305f\u9854",
    "Smiling face with heart-shaped eyes": "\u76ee\u304c\u30cf\u30fc\u30c8\u306e\u7b11\u9854",
    "Smiling face with sunglasses": "\u30b5\u30f3\u30b0\u30e9\u30b9\u3092\u304b\u3051\u305f\u7b11\u9854",
    "Smirking face": "\u4f5c\u308a\u7b11\u3044",
    "Neutral face": "\u7121\u8868\u60c5\u306e\u9854",
    "Expressionless face": "\u7121\u8868\u60c5\u306a\u9854",
    "Unamused face": "\u3064\u307e\u3089\u306a\u3044\u9854",
    "Face with cold sweat": "\u51b7\u3084\u6c57\u3092\u304b\u3044\u305f\u9854",
    "Pensive face": "\u8003\u3048\u4e2d\u306e\u9854",
    "Confused face": "\u5c11\u3057\u3057\u3087\u3093\u307c\u308a\u3057\u305f\u9854",
    "Confounded face": "\u56f0\u308a\u679c\u3066\u305f\u9854",
    "Kissing face": "\u30ad\u30b9\u3059\u308b\u9854",
    "Face throwing a kiss": "\u6295\u3052\u30ad\u30c3\u30b9\u3059\u308b\u9854",
    "Kissing face with smiling eyes": "\u7b11\u3044\u306a\u304c\u3089\u30ad\u30b9\u3059\u308b\u9854",
    "Kissing face with closed eyes": "\u76ee\u3092\u9589\u3058\u3066\u30ad\u30b9\u3059\u308b\u9854",
    "Face with stuck out tongue": "\u304b\u3089\u304b\u3063\u305f\u9854(\u3042\u3063\u304b\u3093\u3079\u3048)",
    "Face with stuck out tongue and winking eye": "\u30a6\u30a3\u30f3\u30af\u3057\u3066\u820c\u3092\u51fa\u3057\u305f\u9854",
    "Face with stuck out tongue and tightly-closed eyes": "\u76ee\u3092\u9589\u3058\u3066\u820c\u3092\u51fa\u3057\u305f\u9854",
    "Disappointed face": "\u843d\u3061\u8fbc\u3093\u3060\u9854",
    "Worried face": "\u4e0d\u5b89\u306a\u9854",
    "Angry face": "\u6012\u3063\u305f\u9854",
    "Pouting face": "\u3075\u304f\u308c\u9854",
    "Crying face": "\u6ce3\u3044\u3066\u3044\u308b\u9854",
    "Persevering face": "\u5931\u6557\u9854",
    "Face with look of triumph": "\u52dd\u3061\u307b\u3053\u3063\u305f\u9854",
    "Disappointed but relieved face": "\u5b89\u5835\u3057\u305f\u9854",
    "Frowning face with open mouth": "\u3044\u3084\u306a\u9854(\u958b\u3051\u305f\u53e3)",
    "Anguished face": "\u3052\u3093\u306a\u308a\u3057\u305f\u9854",
    "Fearful face": "\u9752\u3056\u3081\u305f\u9854",
    "Weary face": "\u75b2\u308c\u305f\u9854",
    "Sleepy face": "\u7720\u3044\u9854",
    "Tired face": "\u3057\u3093\u3069\u3044\u9854",
    "Grimacing face": "\u3061\u3087\u3063\u3068\u4e0d\u5feb\u306a\u9854",
    "Loudly crying face": "\u5927\u6ce3\u304d\u3057\u3066\u3044\u308b\u9854",
    "Face with open mouth": "\u53e3\u3092\u958b\u3051\u305f\u9854",
    "Hushed face": "\u9ed9\u3063\u305f\u9854",
    "Face with open mouth and cold sweat": "\u53e3\u3092\u958b\u3051\u305f\u9854(\u51b7\u3084\u6c57)",
    "Face screaming in fear": "\u6050\u6016\u306e\u53eb\u3073\u9854",
    "Astonished face": "\u9a5a\u3044\u305f\u9854",
    "Flushed face": "\u71b1\u3063\u307d\u3044\u9854",
    "Sleeping face": "\u5bdd\u9854",
    "Dizzy face": "\u307e\u3044\u3063\u305f\u9854",
    "Face without mouth": "\u53e3\u306e\u306a\u3044\u9854",
    "Face with medical mask": "\u30de\u30b9\u30af\u3057\u305f\u9854",

    // Line breaker
    "Break": "\u6539\u884c",

    // Math
    "Subscript": "\u4e0b\u4ed8\u304d\u6587\u5b57",
    "Superscript": "\u4e0a\u4ed8\u304d\u6587\u5b57",

    // Full screen
    "Fullscreen": "\u5168\u753b\u9762\u8868\u793a",

    // Horizontal line
    "Insert Horizontal Line": "\u6c34\u5e73\u7dda\u306e\u633f\u5165",

    // Clear formatting
    "Clear Formatting": "\u66f8\u5f0f\u306e\u30af\u30ea\u30a2",

    // Save
    "Save": "\u30bb\u30fc\u30d6",

    // Undo, redo
    "Undo": "\u5143\u306b\u623b\u3059",
    "Redo": "\u3084\u308a\u76f4\u3059",

    // Select all
    "Select All": "\u5168\u3066\u3092\u9078\u629e",

    // Code view
    "Code View": "HTML\u30bf\u30b0\u8868\u793a",

    // Quote
    "Quote": "\u5f15\u7528",
    "Increase": "\u5897\u52a0",
    "Decrease": "\u6e1b\u5c11",

    // Quick Insert
    "Quick Insert": "\u30af\u30a4\u30c3\u30af\u633f\u5165",

    // Spcial Characters
    "Special Characters": "\u7279\u6b8a\u6587\u5b57",
    "Latin": "\u30e9\u30c6\u30f3\u8a9e",
    "Greek": "\u30ae\u30ea\u30b7\u30e3\u8a9e",
    "Cyrillic": "\u30ad\u30ea\u30eb\u6587\u5b57",
    "Punctuation": "\u53e5\u8aad\u70b9",
    "Currency": "\u901a\u8ca8",
    "Arrows": "\u77e2\u5370",
    "Math": "\u6570\u5b66",
    "Misc": "\u305d\u306e\u4ed6",

    // Print.
    "Print": "\u5370\u5237",

    // Spell Checker.
    "Spell Checker": "\u30b9\u30da\u30eb\u30c1\u30a7\u30c3\u30af",

    // Help
    "Help": "\u30d8\u30eb\u30d7",
    "Shortcuts": "\u30b7\u30e7\u30fc\u30c8\u30ab\u30c3\u30c8",
    "Inline Editor": "\u30a4\u30f3\u30e9\u30a4\u30f3\u30a8\u30c7\u30a3\u30bf",
    "Show the editor": "\u30a8\u30c7\u30a3\u30bf\u3092\u8868\u793a",
    "Common actions": "\u4e00\u822c\u52d5\u4f5c",
    "Copy": "\u30b3\u30d4\u30fc",
    "Cut": "\u30ab\u30c3\u30c8",
    "Paste": "\u8cbc\u308a\u4ed8\u3051",
    "Basic Formatting": "\u57fa\u672c\u66f8\u5f0f",
    "Increase quote level": "\u5f15\u7528\u3092\u5897\u3084\u3059",
    "Decrease quote level": "\u5f15\u7528\u3092\u6e1b\u3089\u3059",
    "Image / Video": "\u753b\u50cf/\u52d5\u753b",
    "Resize larger": "\u5927\u304d\u304f\u3059\u308b",
    "Resize smaller": "\u5c0f\u3055\u304f\u3059\u308b",
    "Table": "\u8868",
    "Select table cell": "\u30bb\u30eb\u3092\u9078\u629e",
    "Extend selection one cell": "\u30bb\u30eb\u306e\u9078\u629e\u7bc4\u56f2\u3092\u5e83\u3052\u308b",
    "Extend selection one row": "\u5217\u306e\u9078\u629e\u7bc4\u56f2\u3092\u5e83\u3052\u308b",
    "Navigation": "\u30ca\u30d3\u30b2\u30fc\u30b7\u30e7\u30f3",
    "Focus popup / toolbar": "\u30dd\u30c3\u30d7\u30a2\u30c3\u30d7/\u30c4\u30fc\u30eb\u30d0\u30fc\u3092\u30d5\u30a9\u30fc\u30ab\u30b9",
    "Return focus to previous position": "\u524d\u306e\u4f4d\u7f6e\u306b\u30d5\u30a9\u30fc\u30ab\u30b9\u3092\u623b\u3059",

    //\u00a0Embed.ly
    "Embed URL": "\u57cb\u3081\u8fbc\u307fURL",
    "Paste in a URL to embed": "\u57cb\u3081\u8fbc\u307fURL\u306b\u8cbc\u308a\u4ed8\u3051\u308b",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "\u8cbc\u308a\u4ed8\u3051\u305f\u6587\u66f8\u306fMicrosoft Word\u304b\u3089\u53d6\u5f97\u3055\u308c\u307e\u3059\u3002\u30d5\u30a9\u30fc\u30de\u30c3\u30c8\u3092\u4fdd\u6301\u3057\u3066\u8cbc\u308a\u4ed8\u3051\u307e\u3059\u304b\uff1f",
    "Keep": "\u66f8\u5f0f\u3092\u4fdd\u6301\u3059\u308b",
    "Clean": "\u66f8\u5f0f\u3092\u4fdd\u6301\u3057\u306a\u3044",
    "Word Paste Detected": "Microsoft Word\u306e\u8cbc\u308a\u4ed8\u3051\u304c\u691c\u51fa\u3055\u308c\u307e\u3057\u305f"
  },
  direction: "ltr"
};

}));
