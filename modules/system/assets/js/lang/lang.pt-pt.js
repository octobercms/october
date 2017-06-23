/*
 * This file has been compiled from: /modules/system/lang/pt-pt/client.php
 */
if ($.oc === undefined) $.oc = {}
if ($.oc.langMessages === undefined) $.oc.langMessages = {}
$.oc.langMessages['pt-pt'] = $.extend(
    $.oc.langMessages['pt-pt'] || {},
    {"markdowneditor":{"formatting":"Formatando","quote":"Cita\u00e7\u00e3o","code":"C\u00f3digo","header1":"Cabe\u00e7alho 1","header2":"Cabe\u00e7alho 2","header3":"Cabe\u00e7alho 3","header4":"Cabe\u00e7alho 4","header5":"Cabe\u00e7alho 5","header6":"Cabe\u00e7alho 6","bold":"Negrito","italic":"It\u00e1lico","unorderedlist":"Lista n\u00e3o ordenada","orderedlist":"Lista ordenada","video":"V\u00eddeo","image":"Imagem","link":"Link","horizontalrule":"Inserir linha horizontal","fullscreen":"Ecran cheio","preview":"Visualizar"},"mediamanager":{"insert_link":"Inserir ligação","insert_image":"Inserir imagem","insert_video":"Inserir v\u00eddeo","insert_audio":"Inserir \u00e1udio","invalid_file_empty_insert":"Por favor, selecione o ficheiro para criar a ligação.","invalid_file_single_insert":"Por favor, selecione apenas um ficheiro.","invalid_image_empty_insert":"Por favor, selecione as imagens que deseja inserir.","invalid_video_empty_insert":"Por favor, selecione os v\u00eddeos que deseja inserir.","invalid_audio_empty_insert":"Por favor, selecione os \u00e1udios que deseja inserir."},"alert":{"confirm_button_text":"OK","cancel_button_text":"Cancelar","widget_remove_confirm":"Remover este widget?"},"datepicker":{"previousMonth":"M\u00eas anterior","nextMonth":"M\u00eas seguinte","months":["Janeiro","Fevereiro","Mar\u00e7o","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],"weekdays":["Domingo","Segunda-feira","Ter\u00e7a-feira","Quarta-feira","Quinta-feira","Sexta-feira","S\u00e1bado"],"weekdaysShort":["Dom","Seg","Ter","Qua","Qui","Sex","Sab"]},"filter":{"group":{"all":"todos"},"dates":{"all":"todas","filter_button_text":"Filtro","reset_button_text":"Reiniciar","date_placeholder":"Data","after_placeholder":"Ap\u00f3s","before_placeholder":"Antes"}},"eventlog":{"show_stacktrace":"Exibir o rastreamento","hide_stacktrace":"Ocultar o rastreamento","tabs":{"formatted":"Formatado","raw":"Bruto"},"editor":{"title":"Editor de c\u00f3digo fonte","description":"O sistema operativo deve ser configurado para escutar um desses esquemas de URL.","openWith":"Abrir com","remember_choice":"Lembrar a op\u00e7\u00e3o selecionada nesta sess\u00e3o","open":"Abrir","cancel":"Cancelar"}}}
);

//! moment.js locale configuration
//! locale : portuguese Portugal (pt-pt)
//! author : José Longo
//! based on work of : Caio Ribeiro Pereira : https://github.com/caio-ribeiro-pereira

;(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined'
       && typeof require === 'function' ? factory(require('../moment')) :
   typeof define === 'function' && define.amd ? define(['moment'], factory) :
   factory(global.moment)
}(this, function (moment) { 'use strict';


    var pt_br = moment.defineLocale('pt-pt', {
        months : 'Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split('_'),
        monthsShort : 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_'),
        weekdays : 'Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado'.split('_'),
        weekdaysShort : 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
        weekdaysMin : 'Dom_2ª_3ª_4ª_5ª_6ª_Sáb'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D [de] MMMM [de] YYYY',
            LLL : 'D [de] MMMM [de] YYYY [às] HH:mm',
            LLLL : 'dddd, D [de] MMMM [de] YYYY [às] HH:mm'
        },
        calendar : {
            sameDay: '[Hoje às] LT',
            nextDay: '[Amanhã às] LT',
            nextWeek: 'dddd [às] LT',
            lastDay: '[Ontem às] LT',
            lastWeek: function () {
                return (this.day() === 0 || this.day() === 6) ?
                    '[Último] dddd [às] LT' : // Saturday + Sunday
                    '[Última] dddd [às] LT'; // Monday - Friday
            },
            sameElse: 'L'
        },
        relativeTime : {
            future : 'em %s',
            past : '%s atrás',
            s : 'poucos segundos',
            m : 'um minuto',
            mm : '%d minutos',
            h : 'uma hora',
            hh : '%d horas',
            d : 'um dia',
            dd : '%d dias',
            M : 'um mês',
            MM : '%d meses',
            y : 'um ano',
            yy : '%d anos'
        },
        ordinalParse: /\d{1,2}º/,
        ordinal : '%dº'
    });

    return pt_pt;

}));
