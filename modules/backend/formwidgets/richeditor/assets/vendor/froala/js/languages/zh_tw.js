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
 * Traditional Chinese spoken in Taiwan.
 */

$.FE.LANGUAGE['zh_tw'] = {
  translation: {
    // Place holder
    "Type something": "\u8f38\u5165\u4e00\u4e9b\u5167\u5bb9",

    // Basic formatting
    "Bold": "\u7c97\u9ad4",
    "Italic": "\u659c\u9ad4",
    "Underline": "\u5e95\u7dda",
    "Strikethrough": "\u522a\u9664\u7dda",

    // Main buttons
    "Insert": "\u63d2\u5165",
    "Delete": "\u522a\u9664",
    "Cancel": "\u53d6\u6d88",
    "OK": "\u78ba\u5b9a",
    "Back": "\u5f8c",
    "Remove": "\u79fb\u9664",
    "More": "\u66f4\u591a",
    "Update": "\u66f4\u65b0",
    "Style": "\u6a23\u5f0f",

    // Font
    "Font Family": "\u5b57\u9ad4",
    "Font Size": "\u5b57\u578b\u5927\u5c0f",

    // Colors
    "Colors": "\u984f\u8272",
    "Background": "\u80cc\u666f",
    "Text": "\u6587\u5b57",
    "HEX Color": "十六進制顏色",

    // Paragraphs
    "Paragraph Format": "\u683c\u5f0f",
    "Normal": "\u6b63\u5e38",
    "Code": "\u7a0b\u5f0f\u78bc",
    "Heading 1": "\u6a19\u984c 1",
    "Heading 2": "\u6a19\u984c 2",
    "Heading 3": "\u6a19\u984c 3",
    "Heading 4": "\u6a19\u984c 4",

    // Style
    "Paragraph Style": "\u6bb5\u843d\u6a23\u5f0f",
    "Inline Style": "\u5167\u806f\u6a23\u5f0f",

    // Alignment
    "Align": "\u5c0d\u9f4a",
    "Align Left": "\u7f6e\u5de6\u5c0d\u9f4a",
    "Align Center": "\u7f6e\u4e2d\u5c0d\u9f4a",
    "Align Right": "\u7f6e\u53f3\u5c0d\u9f4a",
    "Align Justify": "\u5de6\u53f3\u5c0d\u9f4a",
    "None": "\u7121",

    // Lists
    "Ordered List": "\u6578\u5b57\u6e05\u55ae",
    "Default": "默認",
    "Lower Alpha": "低α",
    "Lower Greek": "下希臘",
    "Lower Roman": "較低的羅馬",
    "Upper Alpha": "上阿爾法",
    "Upper Roman": "上羅馬",

    "Unordered List": "\u9805\u76ee\u6e05\u55ae",
    "Circle": "圈",
    "Disc": "圓盤",
    "Square": "廣場",

    // Line height
    "Line Height": "線高",
    "Single": "單",
    "Double": "雙",

    // Indent
    "Decrease Indent": "\u6e1b\u5c11\u7e2e\u6392",
    "Increase Indent": "\u589e\u52a0\u7e2e\u6392",

    // Links
    "Insert Link": "\u63d2\u5165\u9023\u7d50",
    "Open in new tab": "\u5728\u65b0\u5206\u9801\u958b\u555f",
    "Open Link": "\u958b\u555f\u9023\u7d50",
    "Edit Link": "\u7de8\u8f2f\u9023\u7d50",
    "Unlink": "\u79fb\u9664\u9023\u7d50",
    "Choose Link": "\u9078\u64c7\u9023\u7d50",

    // Images
    "Insert Image": "\u63d2\u5165\u5716\u7247",
    "Upload Image": "\u4e0a\u50b3\u5716\u7247",
    "By URL": "\u7db2\u5740\u4e0a\u50b3",
    "Browse": "\u700f\u89bd",
    "Drop image": "\u5716\u7247\u62d6\u66f3",
    "or click": "\u6216\u9ede\u64ca",
    "Manage Images": "\u7ba1\u7406\u5716\u7247",
    "Loading": "\u8f09\u5165\u4e2d",
    "Deleting": "\u522a\u9664",
    "Tags": "\u6a19\u7c64",
    "Are you sure? Image will be deleted.": "\u78ba\u5b9a\u522a\u9664\u5716\u7247\uff1f",
    "Replace": "\u66f4\u63db",
    "Uploading": "\u4e0a\u50b3",
    "Loading image": "\u4e0a\u50b3\u4e2d",
    "Display": "\u986f\u793a",
    "Inline": "\u5d4c\u5165",
    "Break Text": "\u8207\u6587\u5b57\u5206\u96e2",
    "Alternative Text": "\u6587\u5b57\u74b0\u7e5e",
    "Change Size": "\u8abf\u6574\u5927\u5c0f",
    "Width": "\u5bec\u5ea6",
    "Height": "\u9ad8\u5ea6",
    "Something went wrong. Please try again.": "\u932f\u8aa4\uff0c\u8acb\u518d\u8a66\u4e00\u6b21\u3002",
    "Image Caption": "圖片說明",
    "Advanced Edit": "高級編輯",

    // Video
    "Insert Video": "\u63d2\u5165\u5f71\u7247",
    "Embedded Code": "\u5d4c\u5165\u7a0b\u5f0f\u78bc",
    "Paste in a video URL": "粘貼在視頻網址",
    "Drop video": "放下視頻",
    "Your browser does not support HTML5 video.": "您的瀏覽器不支持html5視頻。",
    "Upload Video": "上傳視頻",

    // Tables
    "Insert Table": "\u63d2\u5165\u8868\u683c",
    "Table Header": "\u8868\u982d",
    "Remove Table": "\u522a\u9664\u8868",
    "Table Style": "\u8868\u6a23\u5f0f",
    "Horizontal Align": "\u6c34\u6e96\u5c0d\u9f4a\u65b9\u5f0f",
    "Row": "\u884c",
    "Insert row above": "\u5411\u4e0a\u63d2\u5165\u4e00\u884c",
    "Insert row below": "\u5411\u4e0b\u63d2\u5165\u4e00\u884c",
    "Delete row": "\u522a\u9664\u884c",
    "Column": "\u5217",
    "Insert column before": "\u5411\u5de6\u63d2\u5165\u4e00\u5217",
    "Insert column after": "\u5411\u53f3\u63d2\u5165\u4e00\u5217",
    "Delete column": "\u522a\u9664\u884c",
    "Cell": "\u5132\u5b58\u683c",
    "Merge cells": "\u5408\u4f75\u5132\u5b58\u683c",
    "Horizontal split": "\u6c34\u5e73\u5206\u5272",
    "Vertical split": "\u5782\u76f4\u5206\u5272",
    "Cell Background": "\u5132\u5b58\u683c\u80cc\u666f",
    "Vertical Align": "\u5782\u76f4\u5c0d\u9f4a\u65b9\u5f0f",
    "Top": "\u4e0a",
    "Middle": "\u4e2d",
    "Bottom": "\u4e0b",
    "Align Top": "\u5411\u4e0a\u5c0d\u9f4a",
    "Align Middle": "\u4e2d\u9593\u5c0d\u9f4a",
    "Align Bottom": "\u5e95\u90e8\u5c0d\u9f4a",
    "Cell Style": "\u5132\u5b58\u683c\u6a23\u5f0f",

    // Files
    "Upload File": "\u4e0a\u50b3\u6587\u4ef6",
    "Drop file": "\u6587\u4ef6\u62d6\u66f3",

    // Emoticons
    "Emoticons": "\u8868\u60c5",
    "Grinning face": "\u81c9\u4e0a\u7b11\u563b\u563b",
    "Grinning face with smiling eyes": "\u7b11\u563b\u563b\u7684\u81c9\uff0c\u542b\u7b11\u7684\u773c\u775b",
    "Face with tears of joy": "\u81c9\u4e0a\u5e36\u8457\u559c\u6085\u7684\u6dda\u6c34",
    "Smiling face with open mouth": "\u7b11\u81c9\u5f35\u958b\u5634",
    "Smiling face with open mouth and smiling eyes": "\u7b11\u81c9\u5f35\u958b\u5634\u5fae\u7b11\u7684\u773c\u775b",
    "Smiling face with open mouth and cold sweat": "\u7b11\u81c9\u5f35\u958b\u5634\uff0c\u4e00\u8eab\u51b7\u6c57",
    "Smiling face with open mouth and tightly-closed eyes": "\u7b11\u81c9\u5f35\u958b\u5634\uff0c\u7dca\u7dca\u9589\u8457\u773c\u775b",
    "Smiling face with halo": "\u7b11\u81c9\u6688",
    "Smiling face with horns": "\u5fae\u7b11\u7684\u81c9\u89d2",
    "Winking face": "\u7728\u773c\u8868\u60c5",
    "Smiling face with smiling eyes": "\u9762\u5e36\u5fae\u7b11\u7684\u773c\u775b",
    "Face savoring delicious food": "\u9762\u5c0d\u54c1\u5690\u7f8e\u5473\u7684\u98df\u7269",
    "Relieved face": "\u9762\u5c0d\u5982\u91cb\u91cd\u8ca0",
    "Smiling face with heart-shaped eyes": "\u5fae\u7b11\u7684\u81c9\uff0c\u5fc3\u81df\u5f62\u7684\u773c\u775b",
    "Smiling face with sunglasses": "\u7b11\u81c9\u592a\u967d\u93e1",
    "Smirking face": "\u9762\u5c0d\u9762\u5e36\u7b11\u5bb9",
    "Neutral face": "\u4e2d\u6027\u9762",
    "Expressionless face": "\u9762\u7121\u8868\u60c5",
    "Unamused face": "\u4e00\u81c9\u4e0d\u5feb\u7684\u81c9",
    "Face with cold sweat": "\u9762\u5c0d\u51b7\u6c57",
    "Pensive face": "\u6c89\u601d\u7684\u81c9",
    "Confused face": "\u9762\u5c0d\u56f0\u60d1",
    "Confounded face": "\u8a72\u6b7b\u7684\u81c9",
    "Kissing face": "\u9762\u5c0d\u63a5\u543b",
    "Face throwing a kiss": "\u9762\u5c0d\u6295\u64f2\u4e00\u500b\u543b",
    "Kissing face with smiling eyes": "\u63a5\u543b\u81c9\uff0c\u542b\u7b11\u7684\u773c\u775b",
    "Kissing face with closed eyes": "\u63a5\u543b\u7684\u81c9\u9589\u8457\u773c\u775b",
    "Face with stuck out tongue": "\u9762\u5c0d\u4f38\u51fa\u820c\u982d",
    "Face with stuck out tongue and winking eye": "\u9762\u5c0d\u4f38\u51fa\u820c\u982d\u548c\u7728\u52d5\u7684\u773c\u775b",
    "Face with stuck out tongue and tightly-closed eyes": "\u9762\u5c0d\u4f38\u51fa\u820c\u982d\u548c\u7dca\u9589\u7684\u773c\u775b",
    "Disappointed face": "\u9762\u5c0d\u5931\u671b",
    "Worried face": "\u9762\u5c0d\u64d4\u5fc3",
    "Angry face": "\u61a4\u6012\u7684\u81c9",
    "Pouting face": "\u9762\u5c0d\u5658\u5634",
    "Crying face": "\u54ed\u6ce3\u7684\u81c9",
    "Persevering face": "\u600e\u5948\u81c9",
    "Face with look of triumph": "\u9762\u5e36\u770b\u7684\u52dd\u5229",
    "Disappointed but relieved face": "\u5931\u671b\uff0c\u4f46\u81c9\u4e0a\u91cb\u7136",
    "Frowning face with open mouth": "\u9762\u5c0d\u76ba\u8457\u7709\u982d\u5f35\u53e3",
    "Anguished face": "\u9762\u5c0d\u75db\u82e6",
    "Fearful face": "\u53ef\u6015\u7684\u81c9",
    "Weary face": "\u9762\u5c0d\u53ad\u5026",
    "Sleepy face": "\u9762\u5c0d\u56f0",
    "Tired face": "\u75b2\u618a\u7684\u81c9",
    "Grimacing face": "\u7319\u7370\u7684\u81c9",
    "Loudly crying face": "\u5927\u8072\u54ed\u81c9",
    "Face with open mouth": "\u9762\u5c0d\u5f35\u958b\u5634",
    "Hushed face": "\u5b89\u975c\u7684\u81c9",
    "Face with open mouth and cold sweat": "\u9762\u5c0d\u5f35\u958b\u5634\uff0c\u4e00\u8eab\u51b7\u6c57",
    "Face screaming in fear": "\u9762\u5c0d\u5c16\u53eb\u5728\u6050\u61fc\u4e2d",
    "Astonished face": "\u9762\u5c0d\u9a5a\u8a1d",
    "Flushed face": "\u7d05\u64b2\u64b2\u7684\u81c9\u86cb",
    "Sleeping face": "\u719f\u7761\u7684\u81c9",
    "Dizzy face": "\u9762\u5c0d\u7729",
    "Face without mouth": "\u81c9\u4e0a\u6c92\u6709\u5634",
    "Face with medical mask": "\u9762\u5c0d\u91ab\u7642\u53e3\u7f69",

    // Line breaker
    "Break": "\u63db\u884c",

    // Math
    "Subscript": "\u4e0b\u6a19",
    "Superscript": "\u4e0a\u6a19",

    // Full screen
    "Fullscreen": "\u5168\u87a2\u5e55",

    // Horizontal line
    "Insert Horizontal Line": "\u63d2\u5165\u6c34\u5e73\u7dda",

    // Clear formatting
    "Clear Formatting": "\u6e05\u9664\u683c\u5f0f",

    // Save
    "Save": "保存",

    // Undo, redo
    "Undo": "\u5fa9\u539f",
    "Redo": "\u53d6\u6d88\u5fa9\u539f",

    // Select all
    "Select All": "\u5168\u9078",

    // Code view
    "Code View": "\u539f\u59cb\u78bc",

    // Quote
    "Quote": "\u5f15\u6587",
    "Increase": "\u7e2e\u6392",
    "Decrease": "\u53bb\u9664\u7e2e\u6392",

    // Quick Insert
    "Quick Insert": "\u5feb\u63d2",

    // Spcial Characters
    "Special Characters": "特殊字符",
    "Latin": "拉丁",
    "Greek": "希臘語",
    "Cyrillic": "西里爾",
    "Punctuation": "標點",
    "Currency": "貨幣",
    "Arrows": "箭頭",
    "Math": "數學",
    "Misc": "雜項",

    // Print.
    "Print": "打印",

    // Spell Checker.
    "Spell Checker": "拼寫檢查器",

    // Help
    "Help": "幫幫我",
    "Shortcuts": "快捷鍵",
    "Inline Editor": "內聯編輯器",
    "Show the editor": "顯示編輯",
    "Common actions": "共同行動",
    "Copy": "複製",
    "Cut": "切",
    "Paste": "糊",
    "Basic Formatting": "基本格式",
    "Increase quote level": "提高報價水平",
    "Decrease quote level": "降低報價水平",
    "Image / Video": "圖像/視頻",
    "Resize larger": "調整大小更大",
    "Resize smaller": "調整大小更小",
    "Table": "表",
    "Select table cell": "選擇表單元格",
    "Extend selection one cell": "擴展選擇一個單元格",
    "Extend selection one row": "擴展選擇一行",
    "Navigation": "導航",
    "Focus popup / toolbar": "焦點彈出/工具欄",
    "Return focus to previous position": "將焦點返回到上一個位置",

    // Embed.ly
    "Embed URL": "嵌入網址",
    "Paste in a URL to embed": "粘貼在一個網址中嵌入",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "粘貼的內容來自微軟Word文檔。你想保留格式還是清理它？",
    "Keep": "保持",
    "Clean": "清潔",
    "Word Paste Detected": "檢測到字貼"
  },
  direction: "ltr"
};

}));
