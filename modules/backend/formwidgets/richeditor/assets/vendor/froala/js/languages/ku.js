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
 * Arabic
 */

$.FE.LANGUAGE['ku'] = {
  translation: {
    // Place holder
    "Type something": "شتێک بنووسە",

    // Basic formatting
    "Bold": "تۆخکردنەوە",
    "Italic": "لارکردنەوە",
    "Underline": "هێڵ بەژێردا هێنان",
    "Strikethrough": "هێڵ بە سەردا هێنان",

    // Main buttons
    "Insert": "خستنە ناو",
    "Delete": "سڕینەوە",
    "Cancel": "پاشگەزبوونەوە",
    "OK": "باشە",
    "Back": "گەڕانەوە",
    "Remove": "لابردن",
    "More": "زیاتر",
    "Update": "نوێکردنەوە",
    "Style": "شێواز",

    // Font
    "Font Family": "فۆنتی خێزان",
    "Font Size": "قەبارەی فۆنت",

    // Colors
    "Colors": "ڕەنگەکان",
    "Background": "پاشبنەما(باکگراوند)",
    "Text": "دەق",

    // Paragraphs بۆیە ڕەقەمەکانی خوارەوەم نەکردووە بە کوردی لە شوێنی تریش بینیوومە هەروا نوسراوەتەوە
    "Paragraph Format": "شێوازی پەڕەگراف",
    "Normal": "ئاسایی",
    "Code": "کۆد",
    "Heading 1": " 1",
    "Heading 2": " 2",
    "Heading 3": " 3",
    "Heading 4": " 4",

    // Style
    "Paragraph Style": "شێوازی پەڕەگراف",
    "Inline Style": "شێوزای ناو دێڕ",

    // Alignment
    "Align": "ڕیزکردن",
    "Align Left": "ڕیزکردن لای چەپەوە",
    "Align Center": "ڕیزکردن لە ناوەڕاستەوە",
    "Align Right": "ڕیزکردن لای ڕاستەوە",
    "Align Justify": "هاوڕێک",
    "None": "هیچ",

    // Lists
    "Ordered List": "لیستی داواکراو",
    "Default": "Destçûnî",
    "Lower Alpha": "Alpha kêm",
    "Lower Greek": "Grek",
    "Lower Roman": "Roman",
    "Upper Alpha": "Alpha",
    "Upper Roman": "Rûsî",

    "Unordered List": "لیستی داوانەکراو",
    "Circle": "Çember",
    "Disc": "Disc",
    "Square": "Meydan",

    // Line height
    "Line Height": "Hewayê",
    "Single": "Yekoyek",
    "Double": "Dûcar",

    // Indent
    "Decrease Indent": "کەمکردنەوەی بۆشایی بەجێهێشتن",
    "Increase Indent": "زیادکردنی بۆشایی بەجێهێشتن",

    // Links
    "Insert Link": "دانانی بەستەر",
    "Open in new tab": "کردنەوەی لە تابێکی نوێدا",
    "Open Link": "کردنەوەی بەستەر",
    "Edit Link": "دەستکاریکردنی بەستەر",
    "Unlink": "سڕینەوەی بەستەر",
    "Choose Link": "هەڵبژاردنی بەستەر",

    // Images
    "Insert Image": "هێنانی وێنە",
    "Upload Image": "بارکردنی وێنە",
    "By URL": "بە شێوەی بەستەر",
    "Browse": "هێنان",
    "Drop image": "ڕاکێشانی وێنە",
    "or click": "یان کرتە",
    "Manage Images": "بەڕێوەبردنی وێنە",
    "ئامادەکردن": "Cargando",
    "Deleting": "سڕینەوە",
    "Tags": "تاگەکان",
    "Are you sure? Image will be deleted.": "دڵنیایت لە سڕینەوەی وێنەکە",
    "Replace": "لەبری دانان",
    "Uploading": "بارکردن",
    "Loading image": "ئامادەکردنی وێنە",
    "Display": "پیشان دان",
    "Inline": "ناو دێڕ",
    "Break Text": "ماوەی دەق",
    "Alternative Text": "جێگرەوەی دەق",
    "Change Size": "گۆڕینی قەبارەی",
    "Width": "پانی",
    "Height": "بەرزی",
    "Something went wrong. Please try again.": "شتێک هە ڵەیە تکایە هەوڵبدەرەوە",

    // Video
    "Insert Video": "دانانی ڤیدیۆ",
    "Embedded Code": "کۆدی ئێمبد",

    // Tables
    "Insert Table": "دانانی خشتە",
    "Table Header": "خشتەی ناونیشان",
    "Remove Table": "سڕینەوەی خشتە",
    "Table Style": "شێوازی خشتە",
    "Horizontal Align": "ڕێکخستنی ئاسۆیی",
    "Row": "ڕیز",
    "Insert row above": "دانانی ڕیز لەسەرەوە",
    "Insert row below": "دانانی ڕیز لە خوارەوە",
    "Delete row": "سڕینەوەی ڕیز",
    "Column": "ستوون",
    "Insert column before": "زیادکردنی ستونێک لە پێشەوە",
    "Insert column after": "زیادکردنی ستونێک لە دوایەوە",
    "Delete column": "سڕینەوەی ستونێک",
    "Cell": "خانە",
    "Merge cells": "تێکەڵکردنی خانەکان",
    "Horizontal split": "جیاکردنەوەی هێڵی ئاسۆیی",
    "Vertical split": "جیاکردنەوەی سەر بەرەو خوار",
    "Cell Background": "خانەی باکگراوند",
    "Vertical Align": "ڕیزکردن بەشێوەی سەر بەرەو خوار",
    "Top": "سەرەوە",
    "Middle": "ناوەڕاست",
    "Bottom": "خوارەوە",
    "Align Top": "ڕیزکردن لە سەرەوە",
    "Align Middle": "ڕیزکردن لە ناوەڕاستەوە",
    "Align Bottom": "ڕیزکردن لە خوارەوە",
    "Cell Style": "شێوازی خانە",

    // Files
    "Upload File": "بەرزکردنەوەی پەڕگە",
    "Drop file": "ڕاکێشانی پەڕگە",

    // Emoticons
    "Emoticons": "ئیمۆجی",
    "Grinning face": "ڕوخسارێکی پێکەنیناوی",
    "Grinning face with smiling eyes": "ڕوخسارێکی پێکەنیناوی لەگەڵ چاوێکی خەندە ئامێز",
    "Face with tears of joy": "دەمووچاوێک لەگەڵ ئاو هاتنە خوارەوەوە بە چاودا",
    "Smiling face with open mouth": "دەمووچاوێکی پێکەنیناوی لەگەڵ دەمکردنەوە",
    "Smiling face with open mouth and smiling eyes": "دەمووچاوێکی پێکەنیناوی لەگەڵ دەمکردنەوە و چاوێکی خەندە ئامێز",
    "Smiling face with open mouth and cold sweat": "دەمووچاوێکی پێکەنیناوی لەگەڵ دەمکردنەوە و ئارەق کردنەوە",
    "Smiling face with open mouth and tightly-closed eyes": "Cara sonriente con la boca abierta y los ojos fuertemente cerrados",
    "Smiling face with halo": "دەمووچاوێکی پێکەنیناوی و بوونی بازنەیەکی خڕ بەسەرتەوە",
    "Smiling face with horns": "دەمووچاوێکی پێکەنیناوی لەگەڵ دوو قۆچدا",
    "Winking face": "چاو داگرتن",
    "Smiling face with smiling eyes": "دەمووچاوێکی پێکەنیناوی چاوی بچوک کردوەتەوە",
    "Face savoring delicious food": "دەمووچاوی کەسێک کە حەزی لە خواردنە",
    "Relieved face": "دەمووچاوێکی حەساوە",
    "Smiling face with heart-shaped eyes": "دەمووچاوێک لەگەڵ بوونی دڵ لە چاودا",
    "Smiling face with sunglasses": "دەمووچاوێک لەگەڵ چاویلکەدا",
    "Smirking face": "دەمووچاوێکی فیزاوی",
    "Neutral face": "دەم داخستن",
    "Expressionless face": "دەم و چاو داخستن",
    "Unamused face": "دەمووچاوێکی بێزار",
    "Face with cold sweat": "ڕوخسارێک لەگەڵ ئارەقی سارددا",
    "Pensive face": "ڕوخسارێکی خەمبار",
    "Confused face": "ڕوخسارێکی قەلەق",
    "Confounded face": "ڕوخسارێکی ئاڵۆز",
    "Kissing face": "دەمووچاوێک و ماچ",
    "Face throwing a kiss": "دەمووچاوێک ماچ هەڵبدات",
    "Kissing face with smiling eyes": "دەمووچاوێک ماچ دەکات لەگەڵ ڕوخسارێکی پێکەنیناوی",
    "Kissing face with closed eyes": "دەمووچاوێک ماچ دەکات و چاوی داخستووە",
    "Face with stuck out tongue": "ڕوخسارێک زمانی دەرهێناوە",
    "Face with stuck out tongue and winking eye": "ڕوخسارێک زمانی دەرهێناوە و چاوێکی لێت داگرتووە",
    "Face with stuck out tongue and tightly-closed eyes": "هەردووچاوی داخستووە و زمان دەردێنێت",
    "Disappointed face": "ڕوخسارێکی نائومێد کراو",
    "Worried face": "ڕوخسارێکی بێتاقەت",
    "Angry face": "ڕوخسارێکی توڕە",
    "Pouting face": "ڕوخسارێک لچی دەرهێناوە",
    "Crying face": "ڕوخسارێک دەگری",
    "Persevering face": "ڕوخسارێکی تەواوی بێتاقەت",
    "Face with look of triumph": "ڕوخسارێک کە سوورە لەسەر کارێک",
    "Disappointed but relieved face": "ڕوخسارێکی خەمبارە و ئارەق دەکاتەوە",
    "Frowning face with open mouth": "ڕوخسارێکی تووڕە و دەمی کراوەتەوە",
    "Anguished face": "ڕوخسارێکی خەمناک",
    "Fearful face": "دەموچاوێکی ترساو",
    "Weary face": "ڕوخسارێکی ماندوو",
    "Sleepy face": "ڕوخسارێکی خەوتوو",
    "Tired face": "ڕوخسارێکی ماندوو",
    "Grimacing face": "دان جیڕ کردنەوە",
    "Loudly crying face": "ڕوخسارێک بە دەنگی بەرزەوە دەگری",
    "Face with open mouth": "ڕوخسارێک دەمی کردوەتەوە",
    "Hushed face": "ڕوخسارێکی بێدەنگ کراو",
    "Face with open mouth and cold sweat": "دەمووچاوێک دەمی کردوەتەوە و ئارەق دەڕێژێت",
    "Face screaming in fear": "دەمووچاوێک هاوار دەکات و لە شتێک دەترسێت",
    "Astonished face": "ڕوخسارێکی سەرسام بوو",
    "Flushed face": "ڕوخسارێکی سور بووەوە",
    "Sleeping face": "ڕوخسارێکی خەوتوو",
    "Dizzy face": "سەرگێژ خواردن",
    "Face without mouth": "دەمووچاوێک بەبێ دەم",
    "Face with medical mask": "دەمووچاوێک لەگەڵ ماسکی پزیشکی",

    // Line breaker
    "Break": "بڕینی هێڵێک",

    // Math
    "Subscript": "نوسین لە ژێرەوەی نوسینێکی دیکە",
    "Superscript": "سەرنووس",

    // Full screen
    "Fullscreen": "پڕ بە شاشە",

    // Horizontal line
    "Insert Horizontal Line": "دانانی هێڵی ئاسۆیی",

    // Clear formatting
    "Clear Formatting": "سڕینەوەی شێواز",

    // Save
    "Save": "Rizgarkirin",

    // Undo, redo
    "Undo": "گەڕانەوە",
    "Redo": "هێنانەوەی هەنگاوی پێشتر",

    // Select all
    "Select All": "دیاریکردنی هەموو",

    // Code view
    "Code View": "بینینی کۆد",

    // Quote
    "Quote": "وتە",
    "Increase": "زیادکردن",
    "Decrease": "کەمکردن",

    // Quick Insert
    "Quick Insert": "خێرا خستنە ناو",

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
  direction: "rtl"
};

}));
