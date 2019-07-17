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
 * Portuguese spoken in Brazil
 */

$.FE.LANGUAGE['pt_br'] = {
  translation: {
    // Place holder
    "Type something": "Digite algo",

    // Basic formatting
    "Bold": "Negrito",
    "Italic": "Itálito",
    "Underline": "Sublinhar",
    "Strikethrough": "Tachado",

    // Main buttons
    "Insert": "Inserir",
    "Delete": "Apagar",
    "Cancel": "Cancelar",
    "OK": "Ok",
    "Back": "Voltar",
    "Remove": "Remover",
    "More": "Mais",
    "Update": "Atualizar",
    "Style": "Estilo",

    // Font
    "Font Family": "Fonte",
    "Font Size": "Tamanho",

    // Colors
    "Colors": "Cores",
    "Background": "Fundo",
    "Text": "Texto",
    "HEX Color": "Cor hexadecimal",

    // Paragraphs
    "Paragraph Format": "Formatos",
    "Normal": "Normal",
    "Code": "Código",
    "Heading 1": "Cabeçalho 1",
    "Heading 2": "Cabeçalho 2",
    "Heading 3": "Cabeçalho 3",
    "Heading 4": "Cabeçalho 4",

    // Style
    "Paragraph Style": "Estilo de parágrafo",
    "Inline Style": "Estilo embutido",

    // Alignment
    "Align": "Alinhar",
    "Align Left": "Alinhar à esquerda",
    "Align Center": "Centralizar",
    "Align Right": "Alinhar à direita",
    "Align Justify": "Justificar",
    "None": "Nenhum",

    // Lists
    "Ordered List": "Lista ordenada",
    "Default": "Padrão",
    "Lower Alpha": "Alpha inferior",
    "Lower Greek": "Grego inferior",
    "Lower Roman": "Baixa romana",
    "Upper Alpha": "Alfa superior",
    "Upper Roman": "Romana superior",

    "Unordered List": "Lista não ordenada",
    "Circle": "Círculo",
    "Disc": "Disco",
    "Square": "Quadrado",

    // Line height
    "Line Height": "Altura da linha",
    "Single": "Solteiro",
    "Double": "Em dobro",

    // Indent
    "Decrease Indent": "Diminuir recuo",
    "Increase Indent": "Aumentar recuo",

    // Links
    "Insert Link": "Inserir link",
    "Open in new tab": "Abrir em uma nova aba",
    "Open Link": "Abrir link",
    "Edit Link": "Editar link",
    "Unlink": "Remover link",
    "Choose Link": "Escolha o link",

    // Images
    "Insert Image": "Inserir imagem",
    "Upload Image": "Carregar imagem",
    "By URL": "Por um endereço URL",
    "Browse": "Procurar",
    "Drop image": "Arraste sua imagem aqui",
    "or click": "ou clique aqui",
    "Manage Images": "Gerenciar imagens",
    "Loading": "Carregando",
    "Deleting": "Excluindo",
    "Tags": "Etiquetas",
    "Are you sure? Image will be deleted.": "Você tem certeza? A imagem será apagada.",
    "Replace": "Substituir",
    "Uploading": "Carregando imagem",
    "Loading image": "Carregando imagem",
    "Display": "Exibir",
    "Inline": "Em linha",
    "Break Text": "Texto de quebra",
    "Alternate Text": "Texto alternativo",
    "Change Size": "Alterar tamanho",
    "Width": "Largura",
    "Height": "Altura",
    "Something went wrong. Please try again.": "Algo deu errado. Por favor, tente novamente.",
    "Image Caption": "Legenda da imagem",
    "Advanced Edit": "Edição avançada",

    // Video
    "Insert Video": "Inserir vídeo",
    "Embedded Code": "Código embutido",
    "Paste in a video URL": "Colar um endereço de vídeo",
    "Drop video": "Solte o vídeo",
    "Your browser does not support HTML5 vídeo.": "Seu navegador não suporta vídeo em HTML5.",
    "Upload Video": "Carregar vídeo",

    // Tables
    "Insert Table": "Inserir tabela",
    "Table Header": "Cabeçalho da tabela",
    "Remove Table": "Remover tabela",
    "Table Style": "Estilo de tabela",
    "Horizontal Align": "Alinhamento horizontal",
    "Row": "Linha",
    "Insert row above": "Inserir linha antes",
    "Insert row below": "Inserir linha depois",
    "Delete row": "Excluir linha",
    "Column": "Coluna",
    "Insert column before": "Inserir coluna antes",
    "Insert column after": "Inserir coluna depois",
    "Delete column": "Excluir coluna",
    "Cell": "Célula",
    "Merge cells": "Agrupar células",
    "Horizontal split": "Divisão horizontal",
    "Vertical split": "Divisão vertical",
    "Cell Background": "Fundo da célula",
    "Vertical Align": "Alinhamento vertical",
    "Top": "Topo",
    "Middle": "Meio",
    "Bottom": "Fundo",
    "Align Top": "Alinhar topo",
    "Align Middle": "Alinhar meio",
    "Align Bottom": "Alinhar fundo",
    "Cell Style": "Estilo de célula",

    // Files
    "Upload File": "Carregar arquivo",
    "Drop file": "Arraste seu arquivo aqui",

    // Emoticons
    "Emoticons": "Emoticons",
    "Grinning face": "Rosto sorrindo",
    "Grinning face with smiling eyes": "Rosto sorrindo rosto com olhos sorridentes",
    "Face with tears of joy": "Rosto com lágrimas de alegria",
    "Smiling face with open mouth": "Rosto sorrindo com a boca aberta",
    "Smiling face with open mouth and smiling eyes": "Rosto sorrindo com a boca aberta e olhos sorridentes",
    "Smiling face with open mouth and cold sweat": "Rosto sorrindo com a boca aberta e suor frio",
    "Smiling face with open mouth and tightly-closed eyes": "Rosto sorrindo com a boca aberta e os olhos bem fechados",
    "Smiling face with halo": "Rosto sorrindo com aréola",
    "Smiling face with horns": "Rosto sorrindo com chifres",
    "Winking face": "Rosto piscando",
    "Smiling face with smiling eyes": "Rosto sorrindo com olhos sorridentes",
    "Face savoring delicious food": "Rosto saboreando uma deliciosa comida",
    "Relieved face": "Rosto aliviado",
    "Smiling face with heart-shaped eyes": "Rosto sorrindo com os olhos em forma de coração",
    "Smiling face with sunglasses": "Rosto sorrindo com óculos de sol",
    "Smirking face": "Rosto sorridente",
    "Neutral face": "Rosto neutro",
    "Expressionless face": "Rosto inexpressivo",
    "Unamused face": "Rosto sem expressão",
    "Face with cold sweat": "Rosto com suor frio",
    "Pensive face": "Rosto pensativo",
    "Confused face": "Rosto confuso",
    "Confounded face": "Rosto atônito",
    "Kissing face": "Rosto beijando",
    "Face throwing a kiss": "Rosto jogando um beijo",
    "Kissing face with smiling eyes": "Rosto beijando com olhos sorridentes",
    "Kissing face with closed eyes": "Rosto beijando com os olhos fechados",
    "Face with stuck out tongue": "Rosto com a língua para fora",
    "Face with stuck out tongue and winking eye": "Rosto com a língua para fora e um olho piscando",
    "Face with stuck out tongue and tightly-closed eyes": "Rosto com a língua para fora e os olhos bem fechados",
    "Disappointed face": "Rosto decepcionado",
    "Worried face": "Rosto preocupado",
    "Angry face": "Rosto irritado",
    "Pouting face": "Rosto com beicinho",
    "Crying face": "Rosto chorando",
    "Persevering face": "Rosto perseverante",
    "Face with look of triumph": "Rosto com olhar de triunfo",
    "Disappointed but relieved face": "Rosto decepcionado mas aliviado",
    "Frowning face with open mouth": "Rosto franzido com a boca aberta",
    "Anguished face": "Rosto angustiado",
    "Fearful face": "Rosto com medo",
    "Weary face": "Rosto cansado",
    "Sleepy face": "Rosto com sono",
    "Tired face": "Rosto cansado",
    "Grimacing face": "Rosto fazendo careta",
    "Loudly crying face": "Rosto chorando alto",
    "Face with open mouth": "Rosto com a boca aberta",
    "Hushed face": "Rosto silencioso",
    "Face with open mouth and cold sweat": "Rosto com a boca aferta e suando frio",
    "Face screaming in fear": "Rosto gritando de medo",
    "Astonished face": "Rosto surpreso",
    "Flushed face": "Rosto envergonhado",
    "Sleeping face": "Rosto dormindo",
    "Dizzy face": "Rosto tonto",
    "Face without mouth": "Rosto sem boca",
    "Face with medical mask": "Rosto com máscara médica",

    // Line breaker
    "Break": "Quebrar linha",

    // Math
    "Subscript": "Subscrito",
    "Superscript": "Sobrescrito",

    // Full screen
    "Fullscreen": "Tela cheia",

    // Horizontal line
    "Insert Horizontal Line": "Inserir linha horizontal",

    // Clear formatting
    "Clear Formatting": "Remover formatação",

    // Save
    "Save": "\u0053\u0061\u006c\u0076\u0065",

    // Undo, redo
    "Undo": "Desfazer",
    "Redo": "Refazer",

    // Select all
    "Select All": "Selecionar tudo",

    // Code view
    "Code View": "Exibir de código",

    // Quote
    "Quote": "Citação",
    "Increase": "Aumentar",
    "Decrease": "Diminuir",

    // Quick Insert
    "Quick Insert": "Inserção rápida",

    // Spcial Characters
    "Special Characters": "Caracteres especiais",
    "Latin": "Latino",
    "Greek": "Grego",
    "Cyrillic": "Cirílico",
    "Punctuation": "Pontuação",
    "Currency": "Moeda",
    "Arrows": "Setas",
    "Math": "Matemática",
    "Misc": "Misc",

    // Print.
    "Print": "Impressão",

    // Spell Checker.
    "Spell Checker": "Corretor ortográfico",

    // Help
    "Help": "Ajuda",
    "Shortcuts": "Atalhos",
    "Inline Editor": "Editor em linha",
    "Show the editor": "Mostre o editor",
    "Common actions": "Ações comuns",
    "Copy": "Cópia de",
    "Cut": "Cortar",
    "Paste": "Colar",
    "Basic Formatting": "Formatação básica",
    "Increase quote level": "Aumentar o nível de cotação",
    "Decrease quote level": "Diminuir o nível de cotação",
    "Image / Video": "Imagem / Vídeo",
    "Resize larger": "Redimensionar maior",
    "Resize smaller": "Redimensionar menor",
    "Table": "Tabela",
    "Select table cell": "Selecione a célula da tabela",
    "Extend selection one cell": "Ampliar a seleção de uma célula",
    "Extend selection one row": "Ampliar a seleção de uma linha",
    "Navigation": "Navegação",
    "Focus popup / toolbar": "Pop-up de foco / Barra de ferramentas",
    "Return focus to previous position": "Retornar o foco para a posição anterior",

    // Embed.ly
    "Embed URL": "URL de inserção",
    "Paste in a URL to embed": "Colar um endereço URL para incorporar",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "O conteúdo colado vem de um documento Microsoft Word. Você quer manter o formato ou limpá-lo?",
    "Keep": "Manter formatação",
    "Clean": "Limpar formatação",
    "Word Paste Detected": "Texto do Word detectado"
  },
  direction: "ltr"
};

}));
