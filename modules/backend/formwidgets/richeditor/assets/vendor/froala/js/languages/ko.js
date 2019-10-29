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
 * Korean
 */

$.FE.LANGUAGE['ko'] = {
  translation: {
    // Place holder
    "Type something": "무언가를 입력하십시오.",

    // Basic formatting
    "Bold": "굵게",
    "Italic": "기울임꼴",
    "Underline": "밑줄",
    "Strikethrough": "취소선",

    // Main buttons
    "Insert": "삽입",
    "Delete": "삭제",
    "Cancel": "취소",
    "OK": "확인",
    "Back": "뒤로",
    "Remove": "지우기",
    "More": "더",
    "Update": "업데이트",
    "Style": "스타일",

    // Font
    "Font Family": "폰트 종류",
    "Font Size": "폰트 사이즈",

    // Colors
    "Colors": "색깔",
    "Background": "배경",
    "Text": "텍스트",
    "HEX Color": "Hex Color",

    // Paragraphs
    "Paragraph Format": "단락 형식",
    "Normal": "기본적인",
    "Code": "코드",
    "Heading 1": "제목 1",
    "Heading 2": "제목 2",
    "Heading 3": "제목 3",
    "Heading 4": "제목 4",

    // Style
    "Paragraph Style": "단락 스타일",
    "Inline Style": "인라인 스타일",

    // Alignment
    "Align": "정렬",
    "Align Left": "왼쪽 정렬",
    "Align Center": "가운데 정렬",
    "Align Right": "오른쪽 정렬",
    "Align Justify": "양쪽 정렬",
    "None": "아무것도 아님",

    // Lists
    "Ordered List": "정렬된 리스트",
    "Default": "기본",
    "Lower Alpha": "낮은 알파",
    "Lower Greek": "낮은 그리스어",
    "Lower Roman": "낮은 로마자",
    "Upper Alpha": "상위 알파",
    "Upper Roman": "상위 로마자",

    "Unordered List": "정렬되지 않은 리스트",
    "Circle": "원",
    "Disc": "디스크",
    "Square": "정사각형",

    // Line height
    "Line Height": "라인 높이",
    "Single": "단일",
    "Double": "더블",

    // Indent
    "Decrease Indent": "들여쓰기 감소",
    "Increase Indent": "들여쓰기 증가",

    // Links
    "Insert Link": "링크 삽입",
    "Open in new tab": "새로운 탭 만들기",
    "Open Link": "링크 열기",
    "Edit Link": "링크 수정",
    "Unlink": "링크 해제",
    "Choose Link": "링크 선택",

    // Images
    "Insert Image": "이미지 삽입",
    "Upload Image": "이미지 올리기",
    "By URL": "URL 사용",
    "Browse": "브라우즈 ",
    "Drop image": "이미지 드랍",
    "or click": "또는 클릭",
    "Manage Images": "이미지 관리하기",
    "Loading": "로딩 중",
    "Deleting": "삭제 중",
    "Tags": "태그",
    "Are you sure? Image will be deleted.": "확실합니까? 이미지가 지워집니다.",
    "Replace": "대체",
    "Uploading": "올리는 중",
    "Loading image": "이미지 로딩 중",
    "Display": "보여주다.",
    "Inline": "인라인",
    "Break Text": "깨진 텍스트",
    "Alternative Text": "대체 텍스트",
    "Change Size": "사이즈 바꾸기",
    "Width": "넓이",
    "Height": "높이",
    "Something went wrong. Please try again.": "뭔가 잘못됐습니다. 다시 시도해보십시오.",
    "Image Caption": "이미지 캡션",
    "Advanced Edit": "고급 편집",

    // Video
    "Insert Video": "비디오 삽입",
    "Embedded Code": "Embedded Code",
    "Paste in a video URL": "비디오 URL 붙여넣기",
    "Drop video": "비디오 드랍",
    "Your browser does not support HTML5 video.": "브라우저에서 HTML5 비디오를 지원하지 않음.",
    "Upload Video": "업로드 비디오",

    // Tables
    "Insert Table": "표 삽입",
    "Table Header": "표 헤더",
    "Remove Table": "표 지우기",
    "Table Style": "표 스타일",
    "Horizontal Align": "가로 정렬",
    "Row": "행",
    "Insert row above": "위에 행 삽입",
    "Insert row below": "아래에 행 삽입",
    "Delete row": "행 지우기",
    "Column": "열",
    "Insert column before": "앞에 열 삽입",
    "Insert column after": "뒤에 열 삽입",
    "Delete column": "열 지우기",
    "Cell": "셀",
    "Merge cells": "셀 합치기",
    "Horizontal split": "수평 분할",
    "Vertical split": "수직 분할",
    "Cell Background": "셀 배경",
    "Vertical Align": "수직 정렬",
    "Top": "상단",
    "Middle": "중간",
    "Bottom": "하단",
    "Align Top": "위로 정렬",
    "Align Middle": "중간 정렬",
    "Align Bottom": "아래로 정렬",
    "Cell Style": "셀 스타일",

    // Files
    "Upload File": "업로드 파일",
    "Drop file": "드랍 파일",

    // Emoticons
    "Emoticons": "이모티콘",
    "Grinning face": "웃는 얼굴",
    "Grinning face with smiling eyes": "눈웃음 얼굴",
    "Face with tears of joy": "기쁨의 눈물",
    "Smiling face with open mouth": "크게 웃는 얼굴",
    "Smiling face with open mouth and smiling eyes": "크게 웃는 눈웃음 얼굴",
    "Smiling face with open mouth and cold sweat": "식은땀 흘리는 웃는 얼굴",
    "Smiling face with open mouth and tightly-closed eyes": "환하게 웃는 얼굴",
    "Smiling face with halo": "후광이 비치는 웃는 얼굴",
    "Smiling face with horns": "뿔난 웃는 얼굴",
    "Winking face": "윙크",
    "Smiling face with smiling eyes": "눈웃음 얼굴",
    "Face savoring delicious food": "맛있어하는 얼굴",
    "Relieved face": "안심한 얼굴",
    "Smiling face with heart-shaped eyes": "하트 눈 얼굴",
    "Smiling face with sunglasses": "선글라스 낀 얼굴",
    "Smirking face": "실실 웃는 얼굴",
    "Neutral face": "덤덤한 얼굴",
    "Expressionless face": "무표정한 얼굴",
    "Unamused face": "지루해하는 얼굴",
    "Face with cold sweat": "감기 걸린 얼굴",
    "Pensive face": "낙담한 얼굴",
    "Confused face": "헷갈려하는 얼굴",
    "Confounded face": "당혹한 얼굴",
    "Kissing face": "뽀뽀하는 얼굴",
    "Face throwing a kiss": "뽀뽀를 날리는 얼굴",
    "Kissing face with smiling eyes": "웃으며 뽀뽀하는 얼굴",
    "Kissing face with closed eyes": "눈 감으면서 뽀뽀하는 얼굴",
    "Face with stuck out tongue": "메롱",
    "Face with stuck out tongue and winking eye": "윙크하면서 혀를 내민 메롱",
    "Face with stuck out tongue and tightly-closed eyes": "눈을 감고 혀를 내민 메롱",
    "Disappointed face": "실망한 얼굴",
    "Worried face": "걱정스러운 얼굴",
    "Angry face": "화난 얼굴",
    "Pouting face": "뾰로통한 얼굴",
    "Crying face": "우는 얼굴",
    "Persevering face": "얼빠진 얼굴",
    "Face with look of triumph": "승리감에 찬 얼굴",
    "Disappointed but relieved face": "실망했지만 안도하는 얼굴",
    "Frowning face with open mouth": "입을 벌리고 찡그린 얼굴",
    "Anguished face": "괴로워하는 얼굴",
    "Fearful face": "두려워하는 얼굴",
    "Weary face": "지친 얼굴",
    "Sleepy face": "잠 오는 얼굴",
    "Tired face": "피곤한 얼굴",
    "Grimacing face": "찡그린 얼굴",
    "Loudly crying face": "크게 우는 얼굴",
    "Face with open mouth": "입 벌린 얼굴",
    "Hushed face": "숨죽인 얼굴",
    "Face with open mouth and cold sweat": "입을 연 감기 걸린듯한 얼굴",
    "Face screaming in fear": "비명 지르는 얼굴",
    "Astonished face": "깜짝 놀란 얼굴",
    "Flushed face": "상기도니 얼굴",
    "Sleeping face": "졸고 있는 얼굴",
    "Dizzy face": "어지러운 얼굴",
    "Face without mouth": "입이 없는 얼굴",
    "Face with medical mask": "마스크 낀 얼굴",

    // Line breaker
    "Break": "줄 바꿈",

    // Math
    "Subscript": "아래첨자",
    "Superscript": "위첨자",

    // Full screen
    "Fullscreen": "풀스크린",

    // Horizontal line
    "Insert Horizontal Line": "가로줄 삽입",

    // Clear formatting
    "Clear Formatting": "포맷 재설정",

    // Save
    "Save": "저장",

    // Undo, redo
    "Undo": "되돌리기",
    "Redo": "다시하기",

    // Select all
    "Select All": "전체 선택",

    // Code view
    "Code View": "코드 보기",

    // Quote
    "Quote": "인용",
    "Increase": "증가",
    "Decrease": "감소",

    // Quick Insert
    "Quick Insert": "빠른 삽입",

    // Spcial Characters
    "Special Characters": "특수 문자들",
    "Latin": "라틴어",
    "Greek": "그리스어",
    "Cyrillic": "키릴",
    "Punctuation": "문장 부호",
    "Currency": "통화 기호",
    "Arrows": "화살표",
    "Math": "수식",
    "Misc": "기타",

    // Print.
    "Print": "프린트",

    // Spell Checker.
    "Spell Checker": "스펠 체크",

    // Help
    "Help": "도움말",
    "Shortcuts": "바로가기",
    "Inline Editor": "인라인 에디터",
    "Show the editor": "에디터 보기",
    "Common actions": "자주 사용하는 액션",
    "Copy": "복사",
    "Cut": "자르기",
    "Paste": "붙여넣기",
    "Basic Formatting": "기본 설정",
    "Increase quote level": "Increase quote level",
    "Decrease quote level": "Decrease quote level",
    "Image / Video": "사진 / 비디오",
    "Resize larger": "크기를 크게하다",
    "Resize smaller": "크기를 작게하다",
    "Table": "표",
    "Select table cell": "표 셀 선택",
    "Extend selection one cell": "선택 항목을 한 셀 확장",
    "Extend selection one row": "선택 항목을 한 행 확장",
    "Navigation": "Navigation",
    "Focus popup / toolbar": "Focus 팝업 / 도구모음",
    "Return focus to previous position": "이전 위치의 focus 되돌리기",

    // Embed.ly
    "Embed URL": "Embed URl",
    "Paste in a URL to embed": "Embed된 URL 붙여넣기",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "붙여넣은 내용은 마이크로소프트 워드 문서에서 나오고 있다. 형식을 유지하시겠습니까, 아니면 정리하시겠습니까?",
    "Keep": "유지",
    "Clean": "정리",
    "Word Paste Detected": "단어 붙여넣기 감지"
  },
  direction: "ltr"
};

}));
