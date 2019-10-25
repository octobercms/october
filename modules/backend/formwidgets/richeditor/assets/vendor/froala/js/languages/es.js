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
 * Spanish
 */

$.FE.LANGUAGE['es'] = {
  translation: {
    // Place holder
    "Type something": "Escriba algo",

    // Basic formatting
    "Bold": "Negrita",
    "Italic": "It\u00e1lica",
    "Underline": "Subrayado",
    "Strikethrough": "Tachado",

    // Main buttons
    "Insert": "Insertar",
    "Delete": "Borrar",
    "Cancel": "Cancelar",
    "OK": "Ok",
    "Back": "Atr\u00e1s",
    "Remove": "Quitar",
    "More": "M\u00e1s",
    "Update": "Actualizaci\u00f3n",
    "Style": "Estilo",

    // Font
    "Font Family": "Familia de fuentes",
    "Font Size": "Tama\u00f1o de fuente",

    // Colors
    "Colors": "Colores",
    "Background": "Fondo",
    "Text": "Texto",
    "HEX Color": "Color hexadecimal",

    // Paragraphs
    "Paragraph Format": "Formato de p\u00e1rrafo",
    "Normal": "Normal",
    "Code": "C\u00f3digo",
    "Heading 1": "Encabezado 1",
    "Heading 2": "Encabezado 2",
    "Heading 3": "Encabezado 3",
    "Heading 4": "Encabezado 4",

    // Style
    "Paragraph Style": "Estilo de p\u00e1rrafo",
    "Inline Style": "Estilo en l\u00ednea",

    // Alignment
    "Align": "Alinear",
    "Align Left": "Alinear a la izquierda",
    "Align Center": "Alinear al centro",
    "Align Right": "Alinear a la derecha",
    "Align Justify": "Justificar",
    "None": "Ninguno",

    // Lists
    "Ordered List": "Lista ordenada",
    "Default": "Defecto",
    "Lower Alpha": "Alfa inferior",
    "Lower Greek": "Griego inferior",
    "Lower Roman": "Baja romana",
    "Upper Alpha": "Alfa superior",
    "Upper Roman": "Romano superior",

    "Unordered List": "Lista desordenada",
    "Circle": "Circulo",
    "Disc": "Dto",
    "Square": "Cuadrado",

    // Line height
    "Line Height": "Altura de la línea",
    "Single": "Soltero",
    "Double": "Doble",

    // Indent
    "Decrease Indent": "Reducir sangr\u00eda",
    "Increase Indent": "Aumentar sangr\u00eda",

    // Links
    "Insert Link": "Insertar enlace",
    "Open in new tab": "Abrir en una nueva pesta\u00F1a",
    "Open Link": "Abrir enlace",
    "Edit Link": "Editar enlace",
    "Unlink": "Quitar enlace",
    "Choose Link": "Elegir enlace",

    // Images
    "Insert Image": "Insertar imagen",
    "Upload Image": "Cargar imagen",
    "By URL": "Por URL",
    "Browse": "Examinar",
    "Drop image": "Soltar la imagen",
    "or click": "o haga clic en",
    "Manage Images": "Administrar im\u00e1genes",
    "Loading": "Cargando",
    "Deleting": "Borrado",
    "Tags": "Etiquetas",
    "Are you sure? Image will be deleted.": "\u00bfEst\u00e1 seguro? Imagen ser\u00e1 borrada.",
    "Replace": "Reemplazar",
    "Uploading": "Carga",
    "Loading image": "Cargando imagen",
    "Display": "Mostrar",
    "Inline": "En l\u00ednea",
    "Break Text": "Romper texto",
    "Alternative Text": "Texto alternativo",
    "Change Size": "Cambiar tama\u00f1o",
    "Width": "Ancho",
    "Height": "Altura",
    "Something went wrong. Please try again.": "Algo sali\u00f3 mal. Por favor, vuelva a intentarlo.",
    "Image Caption": "Captura de imagen",
    "Advanced Edit": "Edición avanzada",

    // Video
    "Insert Video": "Insertar video",
    "Embedded Code": "C\u00f3digo incrustado",
    "Paste in a video URL": "Pegar en una URL de video",
    "Drop video": "Soltar video",
    "Your browser does not support HTML5 video.": "Su navegador no es compatible con video html5.",
    "Upload Video": "Subir video",

    // Tables
    "Insert Table": "Insertar tabla",
    "Table Header": "Encabezado de la tabla",
    "Remove Table": "Retire la tabla",
    "Table Style": "Estilo de tabla",
    "Horizontal Align": "Alinear horizontal",
    "Row": "Fila",
    "Insert row above": "Insertar fila antes",
    "Insert row below": "Insertar fila despu\u00e9s",
    "Delete row": "Eliminar fila",
    "Column": "Columna",
    "Insert column before": "Insertar columna antes",
    "Insert column after": "Insertar columna despu\u00e9s",
    "Delete column": "Eliminar columna",
    "Cell": "Celda",
    "Merge cells": "Combinar celdas",
    "Horizontal split": "Divisi\u00f3n horizontal",
    "Vertical split": "Divisi\u00f3n vertical",
    "Cell Background": "Fondo de la celda",
    "Vertical Align": "Alinear vertical",
    "Top": "Cima",
    "Middle": "Medio",
    "Bottom": "Del fondo",
    "Align Top": "Alinear a la parte superior",
    "Align Middle": "Alinear media",
    "Align Bottom": "Alinear abajo",
    "Cell Style": "Estilo de celda",

    // Files
    "Upload File": "Subir archivo",
    "Drop file": "Soltar archivo",

    // Emoticons
    "Emoticons": "Emoticones",
    "Grinning face": "Sonriendo cara",
    "Grinning face with smiling eyes": "Sonriendo cara con ojos sonrientes",
    "Face with tears of joy": "Cara con l\u00e1grimas de alegr\u00eda",
    "Smiling face with open mouth": "Cara sonriente con la boca abierta",
    "Smiling face with open mouth and smiling eyes": "Cara sonriente con la boca abierta y los ojos sonrientes",
    "Smiling face with open mouth and cold sweat": "Cara sonriente con la boca abierta y el sudor fr\u00edo",
    "Smiling face with open mouth and tightly-closed eyes": "Cara sonriente con la boca abierta y los ojos fuertemente cerrados",
    "Smiling face with halo": "Cara sonriente con halo",
    "Smiling face with horns": "Cara sonriente con cuernos",
    "Winking face": "Gui\u00f1o de la cara",
    "Smiling face with smiling eyes": "Cara sonriente con ojos sonrientes",
    "Face savoring delicious food": "Care saborear una deliciosa comida",
    "Relieved face": "Cara Aliviado",
    "Smiling face with heart-shaped eyes": "Cara sonriente con los ojos en forma de coraz\u00f3n",
    "Smiling face with sunglasses": "Cara sonriente con gafas de sol",
    "Smirking face": "Sonriendo cara",
    "Neutral face": "Cara neutral",
    "Expressionless face": "Rostro inexpresivo",
    "Unamused face": "Cara no divertido",
    "Face with cold sweat": "Cara con sudor fr\u00edo",
    "Pensive face": "Rostro pensativo",
    "Confused face": "Cara confusa",
    "Confounded face": "Cara Averg\u00fc\u00e9ncense",
    "Kissing face": "Besar la cara",
    "Face throwing a kiss": "Cara lanzando un beso",
    "Kissing face with smiling eyes": "Besar a cara con ojos sonrientes",
    "Kissing face with closed eyes": "Besar a cara con los ojos cerrados",
    "Face with stuck out tongue": "Cara con la lengua pegada",
    "Face with stuck out tongue and winking eye": "Cara con pegado a la lengua y los ojos gui\u00f1o",
    "Face with stuck out tongue and tightly-closed eyes": "Cara con la lengua pegada a y los ojos fuertemente cerrados",
    "Disappointed face": "Cara decepcionado",
    "Worried face": "Cara de preocupaci\u00f3n",
    "Angry face": "Cara enojada",
    "Pouting face": "Que pone mala cara",
    "Crying face": "Cara llorando",
    "Persevering face": "Perseverar cara",
    "Face with look of triumph": "Cara con expresi\u00f3n de triunfo",
    "Disappointed but relieved face": "Decepcionado pero el rostro aliviado",
    "Frowning face with open mouth": "Con el ce\u00f1o fruncido la cara con la boca abierta",
    "Anguished face": "Rostro angustiado",
    "Fearful face": "Cara Temeroso",
    "Weary face": "Rostro cansado",
    "Sleepy face": "Rostro so\u00f1oliento",
    "Tired face": "Rostro cansado",
    "Grimacing face": "Haciendo una mueca cara",
    "Loudly crying face": "Llorando en voz alta la cara",
    "Face with open mouth": "Cara con la boca abierta",
    "Hushed face": "Cara callada",
    "Face with open mouth and cold sweat": "Cara con la boca abierta y el sudor frío",
    "Face screaming in fear": "Cara gritando de miedo",
    "Astonished face": "Cara asombrosa",
    "Flushed face": "Cara enrojecida",
    "Sleeping face": "Rostro dormido",
    "Dizzy face": "Cara Mareado",
    "Face without mouth": "Cara sin boca",
    "Face with medical mask": "Cara con la m\u00e1scara m\u00e9dica",

    // Line breaker
    "Break": "Romper",

    // Math
    "Subscript": "Sub\u00edndice",
    "Superscript": "Super\u00edndice",

    // Full screen
    "Fullscreen": "Pantalla completa",

    // Horizontal line
    "Insert Horizontal Line": "Insertar l\u00ednea horizontal",

    // Clear formatting
    "Clear Formatting": "Quitar el formato",

    // Save
    "Save": "Salvar",

    // Undo, redo
    "Undo": "Deshacer",
    "Redo": "Rehacer",

    // Select all
    "Select All": "Seleccionar todo",

    // Code view
    "Code View": "Vista de c\u00f3digo",

    // Quote
    "Quote": "Cita",
    "Increase": "Aumentar",
    "Decrease": "Disminuci\u00f3n",

    // Quick Insert
    "Quick Insert": "Inserci\u00f3n r\u00e1pida",

    // Spcial Characters
    "Special Characters": "Caracteres especiales",
    "Latin": "Latín",
    "Greek": "Griego",
    "Cyrillic": "Cirílico",
    "Punctuation": "Puntuación",
    "Currency": "Moneda",
    "Arrows": "Flechas",
    "Math": "Mates",
    "Misc": "Misc",

    // Print.
    "Print": "Impresión",

    // Spell Checker.
    "Spell Checker": "Corrector ortográfico",

    // Help
    "Help": "Ayuda",
    "Shortcuts": "Atajos",
    "Inline Editor": "Editor en línea",
    "Show the editor": "Mostrar al editor",
    "Common actions": "Acciones comunes",
    "Copy": "Dupdo",
    "Cut": "Cortar",
    "Paste": "Pegar",
    "Basic Formatting": "Formato básico",
    "Increase quote level": "Aumentar el nivel de cotización",
    "Decrease quote level": "Disminuir el nivel de cotización",
    "Image / Video": "Imagen / video",
    "Resize larger": "Redimensionar más grande",
    "Resize smaller": "Redimensionar más pequeño",
    "Table": "Mesa",
    "Select table cell": "Celda de tabla select",
    "Extend selection one cell": "Ampliar la selección una celda",
    "Extend selection one row": "Ampliar la selección una fila",
    "Navigation": "Navegación",
    "Focus popup / toolbar": "Focus popup / toolbar",
    "Return focus to previous position": "Volver al foco a la posición anterior",

    // Embed.ly
    "Embed URL": "URL de inserción",
    "Paste in a URL to embed": "Pegar en una url para incrustar",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "El contenido pegado viene de un documento de Microsoft Word. ¿Quieres mantener el formato o limpiarlo?",
    "Keep": "Guardar",
    "Clean": "Limpiar",
    "Word Paste Detected": "Palabra detectada"
  },
  direction: "ltr"
};

}));
