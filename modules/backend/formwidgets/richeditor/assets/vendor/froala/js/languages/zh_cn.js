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
* Simplified Chinese spoken in China.
*/

$.FE.LANGUAGE['zh_cn'] = {
  translation: {
    // Place holder
    "Type something": "输入内容",

    // Basic formatting
    "Bold": "粗体",
    "Italic": "斜体",
    "Underline": "下划线",
    "Strikethrough": "删除线",

    // Main buttons
    "Insert": "插入",
    "Delete": "删除",
    "Cancel": "取消",
    "OK": "确定",
    "Back": "后退",
    "Remove": "删除",
    "More": "更多",
    "Update": "更新",
    "Style": "样式",

    // Font
    "Font Family": "字体",
    "Font Size": "字号",

    // Colors
    "Colors": "颜色",
    "Background": "背景",
    "Text": "字体",
    "HEX Color": "十六进制颜色",

    // Paragraphs
    "Paragraph Format": "段落格式",
    "Normal": "正文",
    "Code": "代码",
    "Heading 1": "标题1",
    "Heading 2": "标题2",
    "Heading 3": "标题3",
    "Heading 4": "标题4",

    // Style
    "Paragraph Style": "段落样式",
    "Inline Style": "内联样式",

    // Alignment
    "Align": "对齐方式",
    "Align Left": "左对齐",
    "Align Center": "居中",
    "Align Right": "右对齐",
    "Align Justify": "两端对齐",
    "None": "无",

    // Lists
    "Ordered List": "编号",
    "Default": "默认",
    "Lower Alpha": "低α",
    "Lower Greek": "下希腊",
    "Lower Roman": "较低的罗马",
    "Upper Alpha": "上阿尔法",
    "Upper Roman": "上罗马",

    "Unordered List": "项目符号",
    "Circle": "圈",
    "Disc": "圆盘",
    "Square": "广场",

    // Line height
    "Line Height": "线高",
    "Single": "单",
    "Double": "双",

    // Indent
    "Decrease Indent": "减少缩进量",
    "Increase Indent": "增加缩进量",

    // Links
    "Insert Link": "插入超链接",
    "Open in new tab": "在新标签页中打开",
    "Open Link": "打开超链接",
    "Edit Link": "编辑超链接",
    "Unlink": "删除超链接",
    "Choose Link": "选择超链接",

    // Images
    "Insert Image": "插入图片",
    "Upload Image": "上传图片",
    "By URL": "通过 URL",
    "Browse": "浏览",
    "Drop image": "拖入图片",
    "or click": "或点击",
    "Manage Images": "管理图片",
    "Loading": "加载中",
    "Deleting": "删除中",
    "Tags": "标签",
    "Are you sure? Image will be deleted.": "图片将会被删除，是否确认？",
    "Replace": "替换",
    "Uploading": "上传中",
    "Loading image": "图片加载中",
    "Display": "显示",
    "Inline": "嵌入型",
    "Break Text": "上下型环绕",
    "Alternative Text": "替换文字",
    "Change Size": "改变大小",
    "Width": "宽度",
    "Height": "高度",
    "Something went wrong. Please try again.": "发生错误，请重试。",
    "Image Caption": "图片标题",
    "Advanced Edit": "高级编辑",

    // Video
    "Insert Video": "插入视频",
    "Embedded Code": "嵌入代码",
    "Paste in a video URL": "粘贴视频网址",
    "Drop video": "拖入视频",
    "Your browser does not support HTML5 video.": "您的浏览器不支持 HTML5 视频。",
    "Upload Video": "上传视频",

    // Tables
    "Insert Table": "插入表格",
    "Table Header": "表头",
    "Remove Table": "删除表格",
    "Table Style": "表格样式",
    "Horizontal Align": "水平对齐方式",
    "Row": "行",
    "Insert row above": "在上方插入",
    "Insert row below": "在下方插入",
    "Delete row": "删除行",
    "Column": "列",
    "Insert column before": "在左侧插入",
    "Insert column after": "在右侧插入",
    "Delete column": "删除列",
    "Cell": "单元格",
    "Merge cells": "合并单元格",
    "Horizontal split": "水平分割",
    "Vertical split": "垂直分割",
    "Cell Background": "单元格背景",
    "Vertical Align": "垂直对齐方式",
    "Top": "靠上",
    "Middle": "居中",
    "Bottom": "靠下",
    "Align Top": "靠上对齐",
    "Align Middle": "居中对齐",
    "Align Bottom": "靠下对齐",
    "Cell Style": "单元格样式",

    // Files
    "Upload File": "上传文件",
    "Drop file": "拖入文件",

    // Emoticons
    "Emoticons": "表情符号",
    "Grinning face": "露齿笑脸",
    "Grinning face with smiling eyes": "露齿笑到眯起眼",
    "Face with tears of joy": "笑哭",
    "Smiling face with open mouth": "张嘴微笑",
    "Smiling face with open mouth and smiling eyes": "眯眼张嘴微笑",
    "Smiling face with open mouth and cold sweat": "带冷汗的张嘴微笑",
    "Smiling face with open mouth and tightly-closed eyes": "紧闭双眼张嘴微笑",
    "Smiling face with halo": "带光环微笑",
    "Smiling face with horns": "带牛角的微笑",
    "Winking face": "眨眼",
    "Smiling face with smiling eyes": "眯眼微笑",
    "Face savoring delicious food": "馋",
    "Relieved face": "如释重负",
    "Smiling face with heart-shaped eyes": "桃心眼微笑",
    "Smiling face with sunglasses": "戴太阳镜微笑",
    "Smirking face": "得意地笑",
    "Neutral face": "中性脸",
    "Expressionless face": "面无表情",
    "Unamused face": "不高兴",
    "Face with cold sweat": "冷汗",
    "Pensive face": "沉思",
    "Confused face": "迷惑",
    "Confounded face": "困惑",
    "Kissing face": "嘴巴嘟嘟",
    "Face throwing a kiss": "飞吻",
    "Kissing face with smiling eyes": "眯眼接吻",
    "Kissing face with closed eyes": "闭眼接吻",
    "Face with stuck out tongue": "吐舌",
    "Face with stuck out tongue and winking eye": "眨眼吐舌",
    "Face with stuck out tongue and tightly-closed eyes": "眯眼吐舌",
    "Disappointed face": "失望",
    "Worried face": "担心",
    "Angry face": "生气",
    "Pouting face": "撅嘴",
    "Crying face": "大哭",
    "Persevering face": "坚强",
    "Face with look of triumph": "扬眉吐气",
    "Disappointed but relieved face": "失望",
    "Frowning face with open mouth": "皱眉",
    "Anguished face": "痛苦",
    "Fearful face": "害怕",
    "Weary face": "疲惫",
    "Sleepy face": "困了",
    "Tired face": "累了",
    "Grimacing face": "扭曲脸",
    "Loudly crying face": "大哭",
    "Face with open mouth": "张开嘴",
    "Hushed face": "安静",
    "Face with open mouth and cold sweat": "冷汗",
    "Face screaming in fear": "害怕尖叫",
    "Astonished face": "惊讶",
    "Flushed face": "脸红",
    "Sleeping face": "熟睡",
    "Dizzy face": "眩晕",
    "Face without mouth": "没有嘴的脸",
    "Face with medical mask": "口罩脸",

    // Line breaker
    "Break": "换行",

    // Math
    "Subscript": "下标",
    "Superscript": "上标",

    // Full screen
    "Fullscreen": "全屏",

    // Horizontal line
    "Insert Horizontal Line": "插入水平线",

    // Clear formatting
    "Clear Formatting": "清除格式",

    // Save
    "Save": "保存",

    // Undo, redo
    "Undo": "撤消",
    "Redo": "恢复",

    // Select all
    "Select All": "全选",

    // Code view
    "Code View": "代码视图",

    // Quote
    "Quote": "引用",
    "Increase": "增加引用级别",
    "Decrease": "减少引用级别",

    // Quick Insert
    "Quick Insert": "快速插入",

    // Spcial Characters
    "Special Characters": "特殊字符",
    "Latin": "拉丁字母",
    "Greek": "希腊字母",
    "Cyrillic": "西里尔字母",
    "Punctuation": "标点",
    "Currency": "货币",
    "Arrows": "箭头",
    "Math": "数学",
    "Misc": "杂项",

    // Print.
    "Print": "打印",

    // Spell Checker.
    "Spell Checker": "拼写检查器",

    // Help
    "Help": "帮助",
    "Shortcuts": "快捷键",
    "Inline Editor": "内联编辑器",
    "Show the editor": "显示编辑器",
    "Common actions": "常用操作",
    "Copy": "复制",
    "Cut": "剪切",
    "Paste": "粘贴",
    "Basic Formatting": "基本格式",
    "Increase quote level": "增加引用级别",
    "Decrease quote level": "减少引用级别",
    "Image / Video": "图像/视频",
    "Resize larger": "放大",
    "Resize smaller": "缩小",
    "Table": "表格",
    "Select table cell": "选择单元格",
    "Extend selection one cell": "增加选中的单元格",
    "Extend selection one row": "增加选中的行",
    "Navigation": "导航",
    "Focus popup / toolbar": "焦点弹出/工具栏",
    "Return focus to previous position": "将焦点返回到上一个位置",

    // Embed.ly
    "Embed URL": "嵌入网址",
    "Paste in a URL to embed": "粘贴要嵌入的网址",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "粘贴的内容来自微软 Word 文档。你想保留还是清除格式？",
    "Keep": "保留",
    "Clean": "清除",
    "Word Paste Detected": "检测到粘贴自 Word 的内容"
  },
  direction: "ltr"
};

}));
