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
$.FE.LANGUAGE['vi'] = {
  translation: {
    // Place holder
    "Type something": "Vi\u1EBFt \u0111i\u1EC1u g\u00EC \u0111\u00F3...",

    // Basic formatting
    "Bold": "\u0110\u1EADm",
    "Italic": "Nghi\u00EAng",
    "Underline": "G\u1EA1ch ch\u00E2n",
    "Strikethrough": "G\u1EA1ch ngang ch\u1EEF",

    // Main buttons
    "Insert": "Ch\u00E8n",
    "Delete": "X\u00F3a",
    "Cancel": "H\u1EE7y",
    "OK": "OK",
    "Back": "Tr\u1EDF v\u1EC1",
    "Remove": "X\u00F3a",
    "More": "Th\u00EAm",
    "Update": "C\u1EADp nh\u1EADt",
    "Style": "Ki\u1EC3u",

    // Font
    "Font Family": "Ph\u00F4ng ch\u1EEF",
    "Font Size": "C\u1EE1 ch\u1EEF",

    // Colors
    "Colors": "M\u00E0u s\u1EAFc",
    "Background": "N\u1EC1n",
    "Text": "Ch\u1EEF",
    "HEX Color": "Màu hex",

    // Paragraphs
    "Paragraph Format": "\u0110\u1ECBnh d\u1EA1ng \u0111o\u1EA1n v\u0103n b\u1EA3n",
    "Normal": "Normal",
    "Code": "Code",
    "Heading 1": "Heading 1",
    "Heading 2": "Heading 2",
    "Heading 3": "Heading 3",
    "Heading 4": "Heading 4",

    // Style
    "Paragraph Style": "Ki\u1EC3u \u0111o\u1EA1n v\u0103n b\u1EA3n",
    "Inline Style": "Ki\u1EC3u d\u00F2ng",

    // Alignment
     "Align": "C\u0103n ch\u1EC9nh",
    "Align Left": "C\u0103n tr\u00E1i",
    "Align Center": "C\u0103n gi\u1EEFa",
    "Align Right": "C\u0103n ph\u1EA3i",
    "Align Justify": "C\u0103n \u0111\u1EC1u",
    "None": "Kh\u00F4ng",

    // Lists
    "Ordered List": "Danh s\u00E1ch theo th\u1EE9 t\u1EF1",
    "Default": "Mặc định",
    "Lower Alpha": "Hạ alpha",
    "Lower Greek": "Hạ Hy Lạp",
    "Lower Roman": "Hạ La Mã",
    "Upper Alpha": "Alpha trên",
    "Upper Roman": "Thượng lưu La Mã",

    "Unordered List": "Danh s\u00E1ch li\u1EC7t k\u00EA",
    "Circle": "Vòng tròn",
    "Disc": "Đĩa",
    "Square": "Quảng trường",

    // Line height
    "Line Height": "Chiều cao giữa các dòng",
    "Single": "Độc thân",
    "Double": "Gấp đôi",

    // Indent
    "Decrease Indent": "Gi\u1EA3m c\u0103n l\u1EC1",
    "Increase Indent": "T\u0103ng c\u0103n l\u1EC1",

    // Links
    "Insert Link": "Ch\u00E8n link",
    "Open in new tab": "M\u1EDF trong tab m\u1EDBi",
    "Open Link": "M\u1EDF link",
    "Edit Link": "S\u1EEDa link",
    "Unlink": "B\u1ECF link",
    "Choose Link": "Ch\u1ECDn link",

    // Images
    "Insert Image": "Ch\u00E8n h\u00ECnh",
    "Upload Image": "T\u1EA3i h\u00ECnh l\u00EAn",
    "By URL": "B\u1EB1ng URL",
    "Browse": "Duy\u1EC7t file",
    "Drop image": "K\u00E9o th\u1EA3 h\u00ECnh",
    "or click": "ho\u1EB7c ch\u1ECDn",
    "Manage Images": "Qu\u1EA3n l\u00FD h\u00ECnh \u1EA3nh",
    "Loading": "\u0110ang t\u1EA3i",
    "Deleting": "\u0110ang x\u00F3a",
    "Tags": "Tags",
    "Are you sure? Image will be deleted.": "B\u1EA1n c\u00F3 ch\u1EAFc ch\u1EAFn? H\u00ECnh \u1EA3nh s\u1EBD b\u1ECB x\u00F3a.",
    "Replace": "Thay th\u1EBF",
    "Uploading": "\u0110ang t\u1EA3i l\u00EAn",
    "Loading image": "\u0110ang t\u1EA3i h\u00ECnh \u1EA3nh",
    "Display": "Hi\u1EC3n th\u1ECB",
    "Inline": "C\u00F9ng d\u00F2ng v\u1EDBi ch\u1EEF",
    "Break Text": "Kh\u00F4ng c\u00F9ng d\u00F2ng v\u1EDBi ch\u1EEF",
    "Alternative Text": "Thay th\u1EBF ch\u1EEF",
    "Change Size": "Thay \u0111\u1ED5i k\u00EDch c\u1EE1",
    "Width": "Chi\u1EC1u r\u1ED9ng",
    "Height": "Chi\u1EC1u cao",
    "Something went wrong. Please try again.": "C\u00F3 l\u1ED7i x\u1EA3y ra. Vui l\u00F2ng th\u1EED l\u1EA1i sau.",
    "Image Caption": "Chú thích hình ảnh",
    "Advanced Edit": "Chỉnh sửa tiên tiến",

    // Video
    "Insert Video": "Ch\u00E8n video",
    "Embedded Code": "M\u00E3 nh\u00FAng",
    "Paste in a video URL": "Dán vào một url video",
    "Drop video": "Thả video",
    "Your browser does not support HTML5 video.": "Trình duyệt của bạn không hỗ trợ video html5.",
    "Upload Video": "Tải video lên",

    // Tables
    "Insert Table": "Ch\u00E8n b\u1EA3ng",
    "Table Header": "D\u00F2ng \u0111\u1EA7u b\u1EA3ng",
    "Remove Table": "X\u00F3a b\u1EA3ng",
    "Table Style": "Ki\u1EC3u b\u1EA3ng",
    "Horizontal Align": "C\u0103n ch\u1EC9nh chi\u1EC1u ngang",
    "Row": "D\u00F2ng",
    "Insert row above": "Ch\u00E8n d\u00F2ng ph\u00EDa tr\u00EAn",
    "Insert row below": "Ch\u00E8n d\u00F2ng ph\u00EDa d\u01B0\u1EDBi",
    "Delete row": "X\u00F3a d\u00F2ng",
    "Column": "C\u1ED9t",
    "Insert column before": "Ch\u00E8n c\u1ED9t b\u00EAn tr\u00E1i",
    "Insert column after": "Ch\u00E8n c\u1ED9t b\u00EAn ph\u1EA3i",
    "Delete column": "X\u00F3a c\u1ED9t",
    "Cell": "\u00D4 b\u1EA3ng",
    "Merge cells": "G\u1ED9p \u00F4",
    "Horizontal split": "Chia d\u00F2ng",
    "Vertical split": "Chia c\u1ED9t",
    "Cell Background": "M\u00E0u n\u1EC1n",
    "Vertical Align": "C\u0103n ch\u1EC9nh chi\u1EC1u d\u1ECDc",
    "Top": "Tr\u00EAn c\u00F9ng",
    "Middle": "Gi\u1EEFa",
    "Bottom": "D\u01B0\u1EDBi \u0111\u00E1y",
    "Align Top": "C\u0103n tr\u00EAn",
    "Align Middle": "C\u0103n gi\u1EEFa",
    "Align Bottom": "C\u0103n d\u01B0\u1EDBi",
    "Cell Style": "Ki\u1EC3u \u00F4",

    // Files
    "Upload File": "T\u1EA3i file l\u00EAn",
    "Drop file": "K\u00E9o th\u1EA3 file",

    // Emoticons
    "Emoticons": "Bi\u1EC3u t\u01B0\u1EE3ng c\u1EA3m x\u00FAc",

    // Line breaker
    "Break": "Ng\u1EAFt d\u00F2ng",

    // Math
    "Subscript": "Subscript",
    "Superscript": "Superscript",

    // Full screen
    "Fullscreen": "To\u00E0n m\u00E0n h\u00ECnh",

    // Horizontal line
    "Insert Horizontal Line": "Ch\u00E8n \u0111\u01B0\u1EDDng k\u1EBB ngang v\u0103n b\u1EA3n",

    // Clear formatting
    "Clear Formatting": "X\u00F3a \u0111\u1ECBnh d\u1EA1ng",

    // Save
    "Save": "Save",

    // Undo, redo
    "Undo": "Undo",
    "Redo": "Redo",

    // Select all
    "Select All": "Ch\u1ECDn t\u1EA5t c\u1EA3",

    // Code view
    "Code View": "Xem d\u1EA1ng code",

    // Quote
    "Quote": "Tr\u00EDch d\u1EABn",
    "Increase": "T\u0103ng",
    "Decrease": "Gi\u1EA3m",

    // Quick Insert
    "Quick Insert": "Ch\u00E8n nhanh",

    // Spcial Characters
    "Special Characters": "Nhân vật đặc biệt",
    "Latin": "Latin",
    "Greek": "Người Hy Lạp",
    "Cyrillic": "Chữ viết tay",
    "Punctuation": "Chấm câu",
    "Currency": "Tiền tệ",
    "Arrows": "Mũi tên",
    "Math": "Môn Toán",
    "Misc": "Misc",

    // Print.
    "Print": "In",

    // Spell Checker.
    "Spell Checker": "Công cụ kiểm tra chính tả",

    // Help
    "Help": "Cứu giúp",
    "Shortcuts": "Phím tắt",
    "Inline Editor": "Trình biên tập nội tuyến",
    "Show the editor": "Hiển thị trình soạn thảo",
    "Common actions": "Hành động thông thường",
    "Copy": "Sao chép",
    "Cut": "Cắt tỉa",
    "Paste": "Dán",
    "Basic Formatting": "Định dạng cơ bản",
    "Increase quote level": "Tăng mức báo giá",
    "Decrease quote level": "Giảm mức giá",
    "Image / Video": "Hình ảnh / video",
    "Resize larger": "Thay đổi kích thước lớn hơn",
    "Resize smaller": "Thay đổi kích thước nhỏ hơn",
    "Table": "Bàn",
    "Select table cell": "Chọn ô trong bảng",
    "Extend selection one cell": "Mở rộng lựa chọn một ô",
    "Extend selection one row": "Mở rộng lựa chọn một hàng",
    "Navigation": "Dẫn đường",
    "Focus popup / toolbar": "Tập trung popup / thanh công cụ",
    "Return focus to previous position": "Quay trở lại vị trí trước",

    // Embed.ly
    "Embed URL": "Url nhúng",
    "Paste in a URL to embed": "Dán vào một url để nhúng",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "Nội dung dán là đến từ một tài liệu từ microsoft. bạn có muốn giữ định dạng hoặc làm sạch nó?",
    "Keep": "Giữ",
    "Clean": "Dọn dẹp",
    "Word Paste Detected": "Dán từ được phát hiện"
  },
  direction: "ltr"
};

}));
