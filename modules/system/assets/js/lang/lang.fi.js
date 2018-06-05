/*
 * This file has been compiled from: /modules/system/lang/fi/client.php
 */
if ($.oc === undefined) $.oc = {}
if ($.oc.langMessages === undefined) $.oc.langMessages = {}
$.oc.langMessages['fi'] = $.extend(
    $.oc.langMessages['fi'] || {},
    {"markdowneditor":{"formatting":"Muotoilu","quote":"Lainaus","code":"Koodi","header1":"Otsikko 1","header2":"Otsikko 2","header3":"Otsikko 3","header4":"Otsikko 4","header5":"Otsikko 5","header6":"Otsikko 6","bold":"Lihavoi","italic":"Kursivoi","unorderedlist":"J\u00e4rjest\u00e4m\u00e4t\u00f6n lista","orderedlist":"J\u00e4rjestetty lista","video":"Video","image":"Kuva","link":"Linkki","horizontalrule":"Aseta vaakasuuntainen viiva","fullscreen":"Koko n\u00e4ytt\u00f6","preview":"Esikatsele"},"mediamanager":{"insert_link":"Aseta medialinkki","insert_image":"Aseta Media kuva","insert_video":"Aseta Media video","insert_audio":"Aseta Media audio","invalid_file_empty_insert":"Valitse linkitett\u00e4v\u00e4 tiedosto.","invalid_file_single_insert":"Valitse yksi tiedosto.","invalid_image_empty_insert":"Valitse liitett\u00e4v\u00e4(t) kuva(t).","invalid_video_empty_insert":"Valitse liitett\u00e4v\u00e4 videotiedosto.","invalid_audio_empty_insert":"Valitse liitett\u00e4v\u00e4 audiotiedosto."},"alert":{"confirm_button_text":"OK","cancel_button_text":"Peruuta","widget_remove_confirm":"Poista t\u00e4m\u00e4 vekotin?"},"datepicker":{"previousMonth":"Edellinen kuukausi","nextMonth":"Seuraava kuukausi","months":["tammikuu","helmikuu","maaliskuu","huhtikuu","toukokuu","kes\u00e4kuu","hein\u00e4kuu","elokuu","toukokuu","lokakuu","marraskuu","joulukuu"],"weekdays":["Sunnuntai","maanantai","tiistai","keskiviikko","torstai","perjantai","lauantai"],"weekdaysShort":["su","ma","ti","ke","to","pe","la"]},"colorpicker":{"choose":"Ok"},"filter":{"group":{"all":"kaikki"},"dates":{"all":"kaikki","filter_button_text":"Suodata","reset_button_text":"Palauta","date_placeholder":"P\u00e4iv\u00e4","after_placeholder":"J\u00e4lkeen","before_placeholder":"Ennen"},"numbers":{"all":"kaikki","filter_button_text":"Suodata","reset_button_text":"Palauta","min_placeholder":"V\u00e4hint\u00e4\u00e4n","max_placeholder":"Enint\u00e4\u00e4n"}},"eventlog":{"show_stacktrace":"N\u00e4yt\u00e4 stacktrace","hide_stacktrace":"Piilota stacktrace","tabs":{"formatted":"Muotoiltu","raw":"Raaka"},"editor":{"title":"L\u00e4hdekoodieditori","description":"K\u00e4ytt\u00f6j\u00e4rjestelm\u00e4si pit\u00e4isi olla m\u00e4\u00e4ritetty kuuntelemaan jotain n\u00e4ist\u00e4 URL osoitteista.","openWith":"Avaa sovelluksella","remember_choice":"Muista valittu vaihtoehto t\u00e4lle istunnolle","open":"Avaa","cancel":"Peruuta"}}}
);

//! moment.js locale configuration
//! locale : finnish (fi)
//! author : Tarmo Aidantausta : https://github.com/bleadof

;(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined'
       && typeof require === 'function' ? factory(require('../moment')) :
   typeof define === 'function' && define.amd ? define(['moment'], factory) :
   factory(global.moment)
}(this, function (moment) { 'use strict';


    var numbersPast = 'nolla yksi kaksi kolme neljä viisi kuusi seitsemän kahdeksan yhdeksän'.split(' '),
        numbersFuture = [
            'nolla', 'yhden', 'kahden', 'kolmen', 'neljän', 'viiden', 'kuuden',
            numbersPast[7], numbersPast[8], numbersPast[9]
        ];
    function translate(number, withoutSuffix, key, isFuture) {
        var result = '';
        switch (key) {
        case 's':
            return isFuture ? 'muutaman sekunnin' : 'muutama sekunti';
        case 'm':
            return isFuture ? 'minuutin' : 'minuutti';
        case 'mm':
            result = isFuture ? 'minuutin' : 'minuuttia';
            break;
        case 'h':
            return isFuture ? 'tunnin' : 'tunti';
        case 'hh':
            result = isFuture ? 'tunnin' : 'tuntia';
            break;
        case 'd':
            return isFuture ? 'päivän' : 'päivä';
        case 'dd':
            result = isFuture ? 'päivän' : 'päivää';
            break;
        case 'M':
            return isFuture ? 'kuukauden' : 'kuukausi';
        case 'MM':
            result = isFuture ? 'kuukauden' : 'kuukautta';
            break;
        case 'y':
            return isFuture ? 'vuoden' : 'vuosi';
        case 'yy':
            result = isFuture ? 'vuoden' : 'vuotta';
            break;
        }
        result = verbalNumber(number, isFuture) + ' ' + result;
        return result;
    }
    function verbalNumber(number, isFuture) {
        return number < 10 ? (isFuture ? numbersFuture[number] : numbersPast[number]) : number;
    }

    var fi = moment.defineLocale('fi', {
        months : 'tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu'.split('_'),
        monthsShort : 'tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu'.split('_'),
        weekdays : 'sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai'.split('_'),
        weekdaysShort : 'su_ma_ti_ke_to_pe_la'.split('_'),
        weekdaysMin : 'su_ma_ti_ke_to_pe_la'.split('_'),
        longDateFormat : {
            LT : 'HH.mm',
            LTS : 'HH.mm.ss',
            L : 'DD.MM.YYYY',
            LL : 'Do MMMM[ta] YYYY',
            LLL : 'Do MMMM[ta] YYYY, [klo] HH.mm',
            LLLL : 'dddd, Do MMMM[ta] YYYY, [klo] HH.mm',
            l : 'D.M.YYYY',
            ll : 'Do MMM YYYY',
            lll : 'Do MMM YYYY, [klo] HH.mm',
            llll : 'ddd, Do MMM YYYY, [klo] HH.mm'
        },
        calendar : {
            sameDay : '[tänään] [klo] LT',
            nextDay : '[huomenna] [klo] LT',
            nextWeek : 'dddd [klo] LT',
            lastDay : '[eilen] [klo] LT',
            lastWeek : '[viime] dddd[na] [klo] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : '%s päästä',
            past : '%s sitten',
            s : translate,
            m : translate,
            mm : translate,
            h : translate,
            hh : translate,
            d : translate,
            dd : translate,
            M : translate,
            MM : translate,
            y : translate,
            yy : translate
        },
        ordinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return fi;

}));
