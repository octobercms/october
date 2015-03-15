
(function(undefined){var moment,VERSION="2.7.0",globalScope=typeof global!=='undefined'?global:this,oldGlobalMoment,round=Math.round,i,YEAR=0,MONTH=1,DATE=2,HOUR=3,MINUTE=4,SECOND=5,MILLISECOND=6,languages={},momentProperties={_isAMomentObject:null,_i:null,_f:null,_l:null,_strict:null,_tzm:null,_isUTC:null,_offset:null,_pf:null,_lang:null},hasModule=(typeof module!=='undefined'&&module.exports),aspNetJsonRegex=/^\/?Date\((\-?\d+)/i,aspNetTimeSpanJsonRegex=/(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,isoDurationRegex=/^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,formattingTokens=/(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|X|zz?|ZZ?|.)/g,localFormattingTokens=/(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,parseTokenOneOrTwoDigits=/\d\d?/,parseTokenOneToThreeDigits=/\d{1,3}/,parseTokenOneToFourDigits=/\d{1,4}/,parseTokenOneToSixDigits=/[+\-]?\d{1,6}/,parseTokenDigits=/\d+/,parseTokenWord=/[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,parseTokenTimezone=/Z|[\+\-]\d\d:?\d\d/gi,parseTokenT=/T/i,parseTokenTimestampMs=/[\+\-]?\d+(\.\d{1,3})?/,parseTokenOrdinal=/\d{1,2}/,parseTokenOneDigit=/\d/,parseTokenTwoDigits=/\d\d/,parseTokenThreeDigits=/\d{3}/,parseTokenFourDigits=/\d{4}/,parseTokenSixDigits=/[+-]?\d{6}/,parseTokenSignedNumber=/[+-]?\d+/,isoRegex=/^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,isoFormat='YYYY-MM-DDTHH:mm:ssZ',isoDates=[['YYYYYY-MM-DD',/[+-]\d{6}-\d{2}-\d{2}/],['YYYY-MM-DD',/\d{4}-\d{2}-\d{2}/],['GGGG-[W]WW-E',/\d{4}-W\d{2}-\d/],['GGGG-[W]WW',/\d{4}-W\d{2}/],['YYYY-DDD',/\d{4}-\d{3}/]],isoTimes=[['HH:mm:ss.SSSS',/(T| )\d\d:\d\d:\d\d\.\d+/],['HH:mm:ss',/(T| )\d\d:\d\d:\d\d/],['HH:mm',/(T| )\d\d:\d\d/],['HH',/(T| )\d\d/]],parseTimezoneChunker=/([\+\-]|\d\d)/gi,proxyGettersAndSetters='Date|Hours|Minutes|Seconds|Milliseconds'.split('|'),unitMillisecondFactors={'Milliseconds':1,'Seconds':1e3,'Minutes':6e4,'Hours':36e5,'Days':864e5,'Months':2592e6,'Years':31536e6},unitAliases={ms:'millisecond',s:'second',m:'minute',h:'hour',d:'day',D:'date',w:'week',W:'isoWeek',M:'month',Q:'quarter',y:'year',DDD:'dayOfYear',e:'weekday',E:'isoWeekday',gg:'weekYear',GG:'isoWeekYear'},camelFunctions={dayofyear:'dayOfYear',isoweekday:'isoWeekday',isoweek:'isoWeek',weekyear:'weekYear',isoweekyear:'isoWeekYear'},formatFunctions={},relativeTimeThresholds={s:45,m:45,h:22,dd:25,dm:45,dy:345},ordinalizeTokens='DDD w W M D d'.split(' '),paddedTokens='M D H h m s w W'.split(' '),formatTokenFunctions={M:function(){return this.month()+1;},MMM:function(format){return this.lang().monthsShort(this,format);},MMMM:function(format){return this.lang().months(this,format);},D:function(){return this.date();},DDD:function(){return this.dayOfYear();},d:function(){return this.day();},dd:function(format){return this.lang().weekdaysMin(this,format);},ddd:function(format){return this.lang().weekdaysShort(this,format);},dddd:function(format){return this.lang().weekdays(this,format);},w:function(){return this.week();},W:function(){return this.isoWeek();},YY:function(){return leftZeroFill(this.year()%100,2);},YYYY:function(){return leftZeroFill(this.year(),4);},YYYYY:function(){return leftZeroFill(this.year(),5);},YYYYYY:function(){var y=this.year(),sign=y>=0?'+':'-';return sign+leftZeroFill(Math.abs(y),6);},gg:function(){return leftZeroFill(this.weekYear()%100,2);},gggg:function(){return leftZeroFill(this.weekYear(),4);},ggggg:function(){return leftZeroFill(this.weekYear(),5);},GG:function(){return leftZeroFill(this.isoWeekYear()%100,2);},GGGG:function(){return leftZeroFill(this.isoWeekYear(),4);},GGGGG:function(){return leftZeroFill(this.isoWeekYear(),5);},e:function(){return this.weekday();},E:function(){return this.isoWeekday();},a:function(){return this.lang().meridiem(this.hours(),this.minutes(),true);},A:function(){return this.lang().meridiem(this.hours(),this.minutes(),false);},H:function(){return this.hours();},h:function(){return this.hours()%12||12;},m:function(){return this.minutes();},s:function(){return this.seconds();},S:function(){return toInt(this.milliseconds()/100);},SS:function(){return leftZeroFill(toInt(this.milliseconds()/10),2);},SSS:function(){return leftZeroFill(this.milliseconds(),3);},SSSS:function(){return leftZeroFill(this.milliseconds(),3);},Z:function(){var a=-this.zone(),b="+";if(a<0){a=-a;b="-";}
return b+leftZeroFill(toInt(a/60),2)+":"+leftZeroFill(toInt(a)%60,2);},ZZ:function(){var a=-this.zone(),b="+";if(a<0){a=-a;b="-";}
return b+leftZeroFill(toInt(a/60),2)+leftZeroFill(toInt(a)%60,2);},z:function(){return this.zoneAbbr();},zz:function(){return this.zoneName();},X:function(){return this.unix();},Q:function(){return this.quarter();}},lists=['months','monthsShort','weekdays','weekdaysShort','weekdaysMin'];function dfl(a,b,c){switch(arguments.length){case 2:return a!=null?a:b;case 3:return a!=null?a:b!=null?b:c;default:throw new Error("Implement me");}}
function defaultParsingFlags(){return{empty:false,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:false,invalidMonth:null,invalidFormat:false,userInvalidated:false,iso:false};}
function deprecate(msg,fn){var firstTime=true;function printMsg(){if(moment.suppressDeprecationWarnings===false&&typeof console!=='undefined'&&console.warn){console.warn("Deprecation warning: "+msg);}}
return extend(function(){if(firstTime){printMsg();firstTime=false;}
return fn.apply(this,arguments);},fn);}
function padToken(func,count){return function(a){return leftZeroFill(func.call(this,a),count);};}
function ordinalizeToken(func,period){return function(a){return this.lang().ordinal(func.call(this,a),period);};}
while(ordinalizeTokens.length){i=ordinalizeTokens.pop();formatTokenFunctions[i+'o']=ordinalizeToken(formatTokenFunctions[i],i);}
while(paddedTokens.length){i=paddedTokens.pop();formatTokenFunctions[i+i]=padToken(formatTokenFunctions[i],2);}
formatTokenFunctions.DDDD=padToken(formatTokenFunctions.DDD,3);function Language(){}
function Moment(config){checkOverflow(config);extend(this,config);}
function Duration(duration){var normalizedInput=normalizeObjectUnits(duration),years=normalizedInput.year||0,quarters=normalizedInput.quarter||0,months=normalizedInput.month||0,weeks=normalizedInput.week||0,days=normalizedInput.day||0,hours=normalizedInput.hour||0,minutes=normalizedInput.minute||0,seconds=normalizedInput.second||0,milliseconds=normalizedInput.millisecond||0;this._milliseconds=+milliseconds+
seconds*1e3+
minutes*6e4+
hours*36e5;this._days=+days+
weeks*7;this._months=+months+
quarters*3+
years*12;this._data={};this._bubble();}
function extend(a,b){for(var i in b){if(b.hasOwnProperty(i)){a[i]=b[i];}}
if(b.hasOwnProperty("toString")){a.toString=b.toString;}
if(b.hasOwnProperty("valueOf")){a.valueOf=b.valueOf;}
return a;}
function cloneMoment(m){var result={},i;for(i in m){if(m.hasOwnProperty(i)&&momentProperties.hasOwnProperty(i)){result[i]=m[i];}}
return result;}
function absRound(number){if(number<0){return Math.ceil(number);}else{return Math.floor(number);}}
function leftZeroFill(number,targetLength,forceSign){var output=''+Math.abs(number),sign=number>=0;while(output.length<targetLength){output='0'+output;}
return(sign?(forceSign?'+':''):'-')+output;}
function addOrSubtractDurationFromMoment(mom,duration,isAdding,updateOffset){var milliseconds=duration._milliseconds,days=duration._days,months=duration._months;updateOffset=updateOffset==null?true:updateOffset;if(milliseconds){mom._d.setTime(+mom._d+milliseconds*isAdding);}
if(days){rawSetter(mom,'Date',rawGetter(mom,'Date')+days*isAdding);}
if(months){rawMonthSetter(mom,rawGetter(mom,'Month')+months*isAdding);}
if(updateOffset){moment.updateOffset(mom,days||months);}}
function isArray(input){return Object.prototype.toString.call(input)==='[object Array]';}
function isDate(input){return Object.prototype.toString.call(input)==='[object Date]'||input instanceof Date;}
function compareArrays(array1,array2,dontConvert){var len=Math.min(array1.length,array2.length),lengthDiff=Math.abs(array1.length-array2.length),diffs=0,i;for(i=0;i<len;i++){if((dontConvert&&array1[i]!==array2[i])||(!dontConvert&&toInt(array1[i])!==toInt(array2[i]))){diffs++;}}
return diffs+lengthDiff;}
function normalizeUnits(units){if(units){var lowered=units.toLowerCase().replace(/(.)s$/,'$1');units=unitAliases[units]||camelFunctions[lowered]||lowered;}
return units;}
function normalizeObjectUnits(inputObject){var normalizedInput={},normalizedProp,prop;for(prop in inputObject){if(inputObject.hasOwnProperty(prop)){normalizedProp=normalizeUnits(prop);if(normalizedProp){normalizedInput[normalizedProp]=inputObject[prop];}}}
return normalizedInput;}
function makeList(field){var count,setter;if(field.indexOf('week')===0){count=7;setter='day';}
else if(field.indexOf('month')===0){count=12;setter='month';}
else{return;}
moment[field]=function(format,index){var i,getter,method=moment.fn._lang[field],results=[];if(typeof format==='number'){index=format;format=undefined;}
getter=function(i){var m=moment().utc().set(setter,i);return method.call(moment.fn._lang,m,format||'');};if(index!=null){return getter(index);}
else{for(i=0;i<count;i++){results.push(getter(i));}
return results;}};}
function toInt(argumentForCoercion){var coercedNumber=+argumentForCoercion,value=0;if(coercedNumber!==0&&isFinite(coercedNumber)){if(coercedNumber>=0){value=Math.floor(coercedNumber);}else{value=Math.ceil(coercedNumber);}}
return value;}
function daysInMonth(year,month){return new Date(Date.UTC(year,month+1,0)).getUTCDate();}
function weeksInYear(year,dow,doy){return weekOfYear(moment([year,11,31+dow-doy]),dow,doy).week;}
function daysInYear(year){return isLeapYear(year)?366:365;}
function isLeapYear(year){return(year%4===0&&year%100!==0)||year%400===0;}
function checkOverflow(m){var overflow;if(m._a&&m._pf.overflow===-2){overflow=m._a[MONTH]<0||m._a[MONTH]>11?MONTH:m._a[DATE]<1||m._a[DATE]>daysInMonth(m._a[YEAR],m._a[MONTH])?DATE:m._a[HOUR]<0||m._a[HOUR]>23?HOUR:m._a[MINUTE]<0||m._a[MINUTE]>59?MINUTE:m._a[SECOND]<0||m._a[SECOND]>59?SECOND:m._a[MILLISECOND]<0||m._a[MILLISECOND]>999?MILLISECOND:-1;if(m._pf._overflowDayOfYear&&(overflow<YEAR||overflow>DATE)){overflow=DATE;}
m._pf.overflow=overflow;}}
function isValid(m){if(m._isValid==null){m._isValid=!isNaN(m._d.getTime())&&m._pf.overflow<0&&!m._pf.empty&&!m._pf.invalidMonth&&!m._pf.nullInput&&!m._pf.invalidFormat&&!m._pf.userInvalidated;if(m._strict){m._isValid=m._isValid&&m._pf.charsLeftOver===0&&m._pf.unusedTokens.length===0;}}
return m._isValid;}
function normalizeLanguage(key){return key?key.toLowerCase().replace('_','-'):key;}
function makeAs(input,model){return model._isUTC?moment(input).zone(model._offset||0):moment(input).local();}
extend(Language.prototype,{set:function(config){var prop,i;for(i in config){prop=config[i];if(typeof prop==='function'){this[i]=prop;}else{this['_'+i]=prop;}}},_months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),months:function(m){return this._months[m.month()];},_monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),monthsShort:function(m){return this._monthsShort[m.month()];},monthsParse:function(monthName){var i,mom,regex;if(!this._monthsParse){this._monthsParse=[];}
for(i=0;i<12;i++){if(!this._monthsParse[i]){mom=moment.utc([2000,i]);regex='^'+this.months(mom,'')+'|^'+this.monthsShort(mom,'');this._monthsParse[i]=new RegExp(regex.replace('.',''),'i');}
if(this._monthsParse[i].test(monthName)){return i;}}},_weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdays:function(m){return this._weekdays[m.day()];},_weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysShort:function(m){return this._weekdaysShort[m.day()];},_weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),weekdaysMin:function(m){return this._weekdaysMin[m.day()];},weekdaysParse:function(weekdayName){var i,mom,regex;if(!this._weekdaysParse){this._weekdaysParse=[];}
for(i=0;i<7;i++){if(!this._weekdaysParse[i]){mom=moment([2000,1]).day(i);regex='^'+this.weekdays(mom,'')+'|^'+this.weekdaysShort(mom,'')+'|^'+this.weekdaysMin(mom,'');this._weekdaysParse[i]=new RegExp(regex.replace('.',''),'i');}
if(this._weekdaysParse[i].test(weekdayName)){return i;}}},_longDateFormat:{LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D YYYY",LLL:"MMMM D YYYY LT",LLLL:"dddd, MMMM D YYYY LT"},longDateFormat:function(key){var output=this._longDateFormat[key];if(!output&&this._longDateFormat[key.toUpperCase()]){output=this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g,function(val){return val.slice(1);});this._longDateFormat[key]=output;}
return output;},isPM:function(input){return((input+'').toLowerCase().charAt(0)==='p');},_meridiemParse:/[ap]\.?m?\.?/i,meridiem:function(hours,minutes,isLower){if(hours>11){return isLower?'pm':'PM';}else{return isLower?'am':'AM';}},_calendar:{sameDay:'[Today at] LT',nextDay:'[Tomorrow at] LT',nextWeek:'dddd [at] LT',lastDay:'[Yesterday at] LT',lastWeek:'[Last] dddd [at] LT',sameElse:'L'},calendar:function(key,mom){var output=this._calendar[key];return typeof output==='function'?output.apply(mom):output;},_relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},relativeTime:function(number,withoutSuffix,string,isFuture){var output=this._relativeTime[string];return(typeof output==='function')?output(number,withoutSuffix,string,isFuture):output.replace(/%d/i,number);},pastFuture:function(diff,output){var format=this._relativeTime[diff>0?'future':'past'];return typeof format==='function'?format(output):format.replace(/%s/i,output);},ordinal:function(number){return this._ordinal.replace("%d",number);},_ordinal:"%d",preparse:function(string){return string;},postformat:function(string){return string;},week:function(mom){return weekOfYear(mom,this._week.dow,this._week.doy).week;},_week:{dow:0,doy:6},_invalidDate:'Invalid date',invalidDate:function(){return this._invalidDate;}});function loadLang(key,values){values.abbr=key;if(!languages[key]){languages[key]=new Language();}
languages[key].set(values);return languages[key];}
function unloadLang(key){delete languages[key];}
function getLangDefinition(key){var i=0,j,lang,next,split,get=function(k){if(!languages[k]&&hasModule){try{require('./lang/'+k);}catch(e){}}
return languages[k];};if(!key){return moment.fn._lang;}
if(!isArray(key)){lang=get(key);if(lang){return lang;}
key=[key];}
while(i<key.length){split=normalizeLanguage(key[i]).split('-');j=split.length;next=normalizeLanguage(key[i+1]);next=next?next.split('-'):null;while(j>0){lang=get(split.slice(0,j).join('-'));if(lang){return lang;}
if(next&&next.length>=j&&compareArrays(split,next,true)>=j-1){break;}
j--;}
i++;}
return moment.fn._lang;}
function removeFormattingTokens(input){if(input.match(/\[[\s\S]/)){return input.replace(/^\[|\]$/g,"");}
return input.replace(/\\/g,"");}
function makeFormatFunction(format){var array=format.match(formattingTokens),i,length;for(i=0,length=array.length;i<length;i++){if(formatTokenFunctions[array[i]]){array[i]=formatTokenFunctions[array[i]];}else{array[i]=removeFormattingTokens(array[i]);}}
return function(mom){var output="";for(i=0;i<length;i++){output+=array[i]instanceof Function?array[i].call(mom,format):array[i];}
return output;};}
function formatMoment(m,format){if(!m.isValid()){return m.lang().invalidDate();}
format=expandFormat(format,m.lang());if(!formatFunctions[format]){formatFunctions[format]=makeFormatFunction(format);}
return formatFunctions[format](m);}
function expandFormat(format,lang){var i=5;function replaceLongDateFormatTokens(input){return lang.longDateFormat(input)||input;}
localFormattingTokens.lastIndex=0;while(i>=0&&localFormattingTokens.test(format)){format=format.replace(localFormattingTokens,replaceLongDateFormatTokens);localFormattingTokens.lastIndex=0;i-=1;}
return format;}
function getParseRegexForToken(token,config){var a,strict=config._strict;switch(token){case'Q':return parseTokenOneDigit;case'DDDD':return parseTokenThreeDigits;case'YYYY':case'GGGG':case'gggg':return strict?parseTokenFourDigits:parseTokenOneToFourDigits;case'Y':case'G':case'g':return parseTokenSignedNumber;case'YYYYYY':case'YYYYY':case'GGGGG':case'ggggg':return strict?parseTokenSixDigits:parseTokenOneToSixDigits;case'S':if(strict){return parseTokenOneDigit;}
case'SS':if(strict){return parseTokenTwoDigits;}
case'SSS':if(strict){return parseTokenThreeDigits;}
case'DDD':return parseTokenOneToThreeDigits;case'MMM':case'MMMM':case'dd':case'ddd':case'dddd':return parseTokenWord;case'a':case'A':return getLangDefinition(config._l)._meridiemParse;case'X':return parseTokenTimestampMs;case'Z':case'ZZ':return parseTokenTimezone;case'T':return parseTokenT;case'SSSS':return parseTokenDigits;case'MM':case'DD':case'YY':case'GG':case'gg':case'HH':case'hh':case'mm':case'ss':case'ww':case'WW':return strict?parseTokenTwoDigits:parseTokenOneOrTwoDigits;case'M':case'D':case'd':case'H':case'h':case'm':case's':case'w':case'W':case'e':case'E':return parseTokenOneOrTwoDigits;case'Do':return parseTokenOrdinal;default:a=new RegExp(regexpEscape(unescapeFormat(token.replace('\\','')),"i"));return a;}}
function timezoneMinutesFromString(string){string=string||"";var possibleTzMatches=(string.match(parseTokenTimezone)||[]),tzChunk=possibleTzMatches[possibleTzMatches.length-1]||[],parts=(tzChunk+'').match(parseTimezoneChunker)||['-',0,0],minutes=+(parts[1]*60)+toInt(parts[2]);return parts[0]==='+'?-minutes:minutes;}
function addTimeToArrayFromToken(token,input,config){var a,datePartArray=config._a;switch(token){case'Q':if(input!=null){datePartArray[MONTH]=(toInt(input)-1)*3;}
break;case'M':case'MM':if(input!=null){datePartArray[MONTH]=toInt(input)-1;}
break;case'MMM':case'MMMM':a=getLangDefinition(config._l).monthsParse(input);if(a!=null){datePartArray[MONTH]=a;}else{config._pf.invalidMonth=input;}
break;case'D':case'DD':if(input!=null){datePartArray[DATE]=toInt(input);}
break;case'Do':if(input!=null){datePartArray[DATE]=toInt(parseInt(input,10));}
break;case'DDD':case'DDDD':if(input!=null){config._dayOfYear=toInt(input);}
break;case'YY':datePartArray[YEAR]=moment.parseTwoDigitYear(input);break;case'YYYY':case'YYYYY':case'YYYYYY':datePartArray[YEAR]=toInt(input);break;case'a':case'A':config._isPm=getLangDefinition(config._l).isPM(input);break;case'H':case'HH':case'h':case'hh':datePartArray[HOUR]=toInt(input);break;case'm':case'mm':datePartArray[MINUTE]=toInt(input);break;case's':case'ss':datePartArray[SECOND]=toInt(input);break;case'S':case'SS':case'SSS':case'SSSS':datePartArray[MILLISECOND]=toInt(('0.'+input)*1000);break;case'X':config._d=new Date(parseFloat(input)*1000);break;case'Z':case'ZZ':config._useUTC=true;config._tzm=timezoneMinutesFromString(input);break;case'dd':case'ddd':case'dddd':a=getLangDefinition(config._l).weekdaysParse(input);if(a!=null){config._w=config._w||{};config._w['d']=a;}else{config._pf.invalidWeekday=input;}
break;case'w':case'ww':case'W':case'WW':case'd':case'e':case'E':token=token.substr(0,1);case'gggg':case'GGGG':case'GGGGG':token=token.substr(0,2);if(input){config._w=config._w||{};config._w[token]=toInt(input);}
break;case'gg':case'GG':config._w=config._w||{};config._w[token]=moment.parseTwoDigitYear(input);}}
function dayOfYearFromWeekInfo(config){var w,weekYear,week,weekday,dow,doy,temp,lang;w=config._w;if(w.GG!=null||w.W!=null||w.E!=null){dow=1;doy=4;weekYear=dfl(w.GG,config._a[YEAR],weekOfYear(moment(),1,4).year);week=dfl(w.W,1);weekday=dfl(w.E,1);}else{lang=getLangDefinition(config._l);dow=lang._week.dow;doy=lang._week.doy;weekYear=dfl(w.gg,config._a[YEAR],weekOfYear(moment(),dow,doy).year);week=dfl(w.w,1);if(w.d!=null){weekday=w.d;if(weekday<dow){++week;}}else if(w.e!=null){weekday=w.e+dow;}else{weekday=dow;}}
temp=dayOfYearFromWeeks(weekYear,week,weekday,doy,dow);config._a[YEAR]=temp.year;config._dayOfYear=temp.dayOfYear;}
function dateFromConfig(config){var i,date,input=[],currentDate,yearToUse;if(config._d){return;}
currentDate=currentDateArray(config);if(config._w&&config._a[DATE]==null&&config._a[MONTH]==null){dayOfYearFromWeekInfo(config);}
if(config._dayOfYear){yearToUse=dfl(config._a[YEAR],currentDate[YEAR]);if(config._dayOfYear>daysInYear(yearToUse)){config._pf._overflowDayOfYear=true;}
date=makeUTCDate(yearToUse,0,config._dayOfYear);config._a[MONTH]=date.getUTCMonth();config._a[DATE]=date.getUTCDate();}
for(i=0;i<3&&config._a[i]==null;++i){config._a[i]=input[i]=currentDate[i];}
for(;i<7;i++){config._a[i]=input[i]=(config._a[i]==null)?(i===2?1:0):config._a[i];}
config._d=(config._useUTC?makeUTCDate:makeDate).apply(null,input);if(config._tzm!=null){config._d.setUTCMinutes(config._d.getUTCMinutes()+config._tzm);}}
function dateFromObject(config){var normalizedInput;if(config._d){return;}
normalizedInput=normalizeObjectUnits(config._i);config._a=[normalizedInput.year,normalizedInput.month,normalizedInput.day,normalizedInput.hour,normalizedInput.minute,normalizedInput.second,normalizedInput.millisecond];dateFromConfig(config);}
function currentDateArray(config){var now=new Date();if(config._useUTC){return[now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()];}else{return[now.getFullYear(),now.getMonth(),now.getDate()];}}
function makeDateFromStringAndFormat(config){if(config._f===moment.ISO_8601){parseISO(config);return;}
config._a=[];config._pf.empty=true;var lang=getLangDefinition(config._l),string=''+config._i,i,parsedInput,tokens,token,skipped,stringLength=string.length,totalParsedInputLength=0;tokens=expandFormat(config._f,lang).match(formattingTokens)||[];for(i=0;i<tokens.length;i++){token=tokens[i];parsedInput=(string.match(getParseRegexForToken(token,config))||[])[0];if(parsedInput){skipped=string.substr(0,string.indexOf(parsedInput));if(skipped.length>0){config._pf.unusedInput.push(skipped);}
string=string.slice(string.indexOf(parsedInput)+parsedInput.length);totalParsedInputLength+=parsedInput.length;}
if(formatTokenFunctions[token]){if(parsedInput){config._pf.empty=false;}
else{config._pf.unusedTokens.push(token);}
addTimeToArrayFromToken(token,parsedInput,config);}
else if(config._strict&&!parsedInput){config._pf.unusedTokens.push(token);}}
config._pf.charsLeftOver=stringLength-totalParsedInputLength;if(string.length>0){config._pf.unusedInput.push(string);}
if(config._isPm&&config._a[HOUR]<12){config._a[HOUR]+=12;}
if(config._isPm===false&&config._a[HOUR]===12){config._a[HOUR]=0;}
dateFromConfig(config);checkOverflow(config);}
function unescapeFormat(s){return s.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,function(matched,p1,p2,p3,p4){return p1||p2||p3||p4;});}
function regexpEscape(s){return s.replace(/[-\/\\^$*+?.()|[\]{}]/g,'\\$&');}
function makeDateFromStringAndArray(config){var tempConfig,bestMoment,scoreToBeat,i,currentScore;if(config._f.length===0){config._pf.invalidFormat=true;config._d=new Date(NaN);return;}
for(i=0;i<config._f.length;i++){currentScore=0;tempConfig=extend({},config);tempConfig._pf=defaultParsingFlags();tempConfig._f=config._f[i];makeDateFromStringAndFormat(tempConfig);if(!isValid(tempConfig)){continue;}
currentScore+=tempConfig._pf.charsLeftOver;currentScore+=tempConfig._pf.unusedTokens.length*10;tempConfig._pf.score=currentScore;if(scoreToBeat==null||currentScore<scoreToBeat){scoreToBeat=currentScore;bestMoment=tempConfig;}}
extend(config,bestMoment||tempConfig);}
function parseISO(config){var i,l,string=config._i,match=isoRegex.exec(string);if(match){config._pf.iso=true;for(i=0,l=isoDates.length;i<l;i++){if(isoDates[i][1].exec(string)){config._f=isoDates[i][0]+(match[6]||" ");break;}}
for(i=0,l=isoTimes.length;i<l;i++){if(isoTimes[i][1].exec(string)){config._f+=isoTimes[i][0];break;}}
if(string.match(parseTokenTimezone)){config._f+="Z";}
makeDateFromStringAndFormat(config);}else{config._isValid=false;}}
function makeDateFromString(config){parseISO(config);if(config._isValid===false){delete config._isValid;moment.createFromInputFallback(config);}}
function makeDateFromInput(config){var input=config._i,matched=aspNetJsonRegex.exec(input);if(input===undefined){config._d=new Date();}else if(matched){config._d=new Date(+matched[1]);}else if(typeof input==='string'){makeDateFromString(config);}else if(isArray(input)){config._a=input.slice(0);dateFromConfig(config);}else if(isDate(input)){config._d=new Date(+input);}else if(typeof(input)==='object'){dateFromObject(config);}else if(typeof(input)==='number'){config._d=new Date(input);}else{moment.createFromInputFallback(config);}}
function makeDate(y,m,d,h,M,s,ms){var date=new Date(y,m,d,h,M,s,ms);if(y<1970){date.setFullYear(y);}
return date;}
function makeUTCDate(y){var date=new Date(Date.UTC.apply(null,arguments));if(y<1970){date.setUTCFullYear(y);}
return date;}
function parseWeekday(input,language){if(typeof input==='string'){if(!isNaN(input)){input=parseInt(input,10);}
else{input=language.weekdaysParse(input);if(typeof input!=='number'){return null;}}}
return input;}
function substituteTimeAgo(string,number,withoutSuffix,isFuture,lang){return lang.relativeTime(number||1,!!withoutSuffix,string,isFuture);}
function relativeTime(milliseconds,withoutSuffix,lang){var seconds=round(Math.abs(milliseconds)/1000),minutes=round(seconds/60),hours=round(minutes/60),days=round(hours/24),years=round(days/365),args=seconds<relativeTimeThresholds.s&&['s',seconds]||minutes===1&&['m']||minutes<relativeTimeThresholds.m&&['mm',minutes]||hours===1&&['h']||hours<relativeTimeThresholds.h&&['hh',hours]||days===1&&['d']||days<=relativeTimeThresholds.dd&&['dd',days]||days<=relativeTimeThresholds.dm&&['M']||days<relativeTimeThresholds.dy&&['MM',round(days/30)]||years===1&&['y']||['yy',years];args[2]=withoutSuffix;args[3]=milliseconds>0;args[4]=lang;return substituteTimeAgo.apply({},args);}
function weekOfYear(mom,firstDayOfWeek,firstDayOfWeekOfYear){var end=firstDayOfWeekOfYear-firstDayOfWeek,daysToDayOfWeek=firstDayOfWeekOfYear-mom.day(),adjustedMoment;if(daysToDayOfWeek>end){daysToDayOfWeek-=7;}
if(daysToDayOfWeek<end-7){daysToDayOfWeek+=7;}
adjustedMoment=moment(mom).add('d',daysToDayOfWeek);return{week:Math.ceil(adjustedMoment.dayOfYear()/7),year:adjustedMoment.year()};}
function dayOfYearFromWeeks(year,week,weekday,firstDayOfWeekOfYear,firstDayOfWeek){var d=makeUTCDate(year,0,1).getUTCDay(),daysToAdd,dayOfYear;d=d===0?7:d;weekday=weekday!=null?weekday:firstDayOfWeek;daysToAdd=firstDayOfWeek-d+(d>firstDayOfWeekOfYear?7:0)-(d<firstDayOfWeek?7:0);dayOfYear=7*(week-1)+(weekday-firstDayOfWeek)+daysToAdd+1;return{year:dayOfYear>0?year:year-1,dayOfYear:dayOfYear>0?dayOfYear:daysInYear(year-1)+dayOfYear};}
function makeMoment(config){var input=config._i,format=config._f;if(input===null||(format===undefined&&input==='')){return moment.invalid({nullInput:true});}
if(typeof input==='string'){config._i=input=getLangDefinition().preparse(input);}
if(moment.isMoment(input)){config=cloneMoment(input);config._d=new Date(+input._d);}else if(format){if(isArray(format)){makeDateFromStringAndArray(config);}else{makeDateFromStringAndFormat(config);}}else{makeDateFromInput(config);}
return new Moment(config);}
moment=function(input,format,lang,strict){var c;if(typeof(lang)==="boolean"){strict=lang;lang=undefined;}
c={};c._isAMomentObject=true;c._i=input;c._f=format;c._l=lang;c._strict=strict;c._isUTC=false;c._pf=defaultParsingFlags();return makeMoment(c);};moment.suppressDeprecationWarnings=false;moment.createFromInputFallback=deprecate("moment construction falls back to js Date. This is "+"discouraged and will be removed in upcoming major "+"release. Please refer to "+"https://github.com/moment/moment/issues/1407 for more info.",function(config){config._d=new Date(config._i);});function pickBy(fn,moments){var res,i;if(moments.length===1&&isArray(moments[0])){moments=moments[0];}
if(!moments.length){return moment();}
res=moments[0];for(i=1;i<moments.length;++i){if(moments[i][fn](res)){res=moments[i];}}
return res;}
moment.min=function(){var args=[].slice.call(arguments,0);return pickBy('isBefore',args);};moment.max=function(){var args=[].slice.call(arguments,0);return pickBy('isAfter',args);};moment.utc=function(input,format,lang,strict){var c;if(typeof(lang)==="boolean"){strict=lang;lang=undefined;}
c={};c._isAMomentObject=true;c._useUTC=true;c._isUTC=true;c._l=lang;c._i=input;c._f=format;c._strict=strict;c._pf=defaultParsingFlags();return makeMoment(c).utc();};moment.unix=function(input){return moment(input*1000);};moment.duration=function(input,key){var duration=input,match=null,sign,ret,parseIso;if(moment.isDuration(input)){duration={ms:input._milliseconds,d:input._days,M:input._months};}else if(typeof input==='number'){duration={};if(key){duration[key]=input;}else{duration.milliseconds=input;}}else if(!!(match=aspNetTimeSpanJsonRegex.exec(input))){sign=(match[1]==="-")?-1:1;duration={y:0,d:toInt(match[DATE])*sign,h:toInt(match[HOUR])*sign,m:toInt(match[MINUTE])*sign,s:toInt(match[SECOND])*sign,ms:toInt(match[MILLISECOND])*sign};}else if(!!(match=isoDurationRegex.exec(input))){sign=(match[1]==="-")?-1:1;parseIso=function(inp){var res=inp&&parseFloat(inp.replace(',','.'));return(isNaN(res)?0:res)*sign;};duration={y:parseIso(match[2]),M:parseIso(match[3]),d:parseIso(match[4]),h:parseIso(match[5]),m:parseIso(match[6]),s:parseIso(match[7]),w:parseIso(match[8])};}
ret=new Duration(duration);if(moment.isDuration(input)&&input.hasOwnProperty('_lang')){ret._lang=input._lang;}
return ret;};moment.version=VERSION;moment.defaultFormat=isoFormat;moment.ISO_8601=function(){};moment.momentProperties=momentProperties;moment.updateOffset=function(){};moment.relativeTimeThreshold=function(threshold,limit){if(relativeTimeThresholds[threshold]===undefined){return false;}
relativeTimeThresholds[threshold]=limit;return true;};moment.lang=function(key,values){var r;if(!key){return moment.fn._lang._abbr;}
if(values){loadLang(normalizeLanguage(key),values);}else if(values===null){unloadLang(key);key='en';}else if(!languages[key]){getLangDefinition(key);}
r=moment.duration.fn._lang=moment.fn._lang=getLangDefinition(key);return r._abbr;};moment.langData=function(key){if(key&&key._lang&&key._lang._abbr){key=key._lang._abbr;}
return getLangDefinition(key);};moment.isMoment=function(obj){return obj instanceof Moment||(obj!=null&&obj.hasOwnProperty('_isAMomentObject'));};moment.isDuration=function(obj){return obj instanceof Duration;};for(i=lists.length-1;i>=0;--i){makeList(lists[i]);}
moment.normalizeUnits=function(units){return normalizeUnits(units);};moment.invalid=function(flags){var m=moment.utc(NaN);if(flags!=null){extend(m._pf,flags);}
else{m._pf.userInvalidated=true;}
return m;};moment.parseZone=function(){return moment.apply(null,arguments).parseZone();};moment.parseTwoDigitYear=function(input){return toInt(input)+(toInt(input)>68?1900:2000);};extend(moment.fn=Moment.prototype,{clone:function(){return moment(this);},valueOf:function(){return+this._d+((this._offset||0)*60000);},unix:function(){return Math.floor(+this/1000);},toString:function(){return this.clone().lang('en').format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");},toDate:function(){return this._offset?new Date(+this):this._d;},toISOString:function(){var m=moment(this).utc();if(0<m.year()&&m.year()<=9999){return formatMoment(m,'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');}else{return formatMoment(m,'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');}},toArray:function(){var m=this;return[m.year(),m.month(),m.date(),m.hours(),m.minutes(),m.seconds(),m.milliseconds()];},isValid:function(){return isValid(this);},isDSTShifted:function(){if(this._a){return this.isValid()&&compareArrays(this._a,(this._isUTC?moment.utc(this._a):moment(this._a)).toArray())>0;}
return false;},parsingFlags:function(){return extend({},this._pf);},invalidAt:function(){return this._pf.overflow;},utc:function(){return this.zone(0);},local:function(){this.zone(0);this._isUTC=false;return this;},format:function(inputString){var output=formatMoment(this,inputString||moment.defaultFormat);return this.lang().postformat(output);},add:function(input,val){var dur;if(typeof input==='string'&&typeof val==='string'){dur=moment.duration(isNaN(+val)?+input:+val,isNaN(+val)?val:input);}else if(typeof input==='string'){dur=moment.duration(+val,input);}else{dur=moment.duration(input,val);}
addOrSubtractDurationFromMoment(this,dur,1);return this;},subtract:function(input,val){var dur;if(typeof input==='string'&&typeof val==='string'){dur=moment.duration(isNaN(+val)?+input:+val,isNaN(+val)?val:input);}else if(typeof input==='string'){dur=moment.duration(+val,input);}else{dur=moment.duration(input,val);}
addOrSubtractDurationFromMoment(this,dur,-1);return this;},diff:function(input,units,asFloat){var that=makeAs(input,this),zoneDiff=(this.zone()-that.zone())*6e4,diff,output;units=normalizeUnits(units);if(units==='year'||units==='month'){diff=(this.daysInMonth()+that.daysInMonth())*432e5;output=((this.year()-that.year())*12)+(this.month()-that.month());output+=((this-moment(this).startOf('month'))-
(that-moment(that).startOf('month')))/diff;output-=((this.zone()-moment(this).startOf('month').zone())-
(that.zone()-moment(that).startOf('month').zone()))*6e4/diff;if(units==='year'){output=output/12;}}else{diff=(this-that);output=units==='second'?diff/1e3:units==='minute'?diff/6e4:units==='hour'?diff/36e5:units==='day'?(diff-zoneDiff)/864e5:units==='week'?(diff-zoneDiff)/6048e5:diff;}
return asFloat?output:absRound(output);},from:function(time,withoutSuffix){return moment.duration(this.diff(time)).lang(this.lang()._abbr).humanize(!withoutSuffix);},fromNow:function(withoutSuffix){return this.from(moment(),withoutSuffix);},calendar:function(time){var now=time||moment(),sod=makeAs(now,this).startOf('day'),diff=this.diff(sod,'days',true),format=diff<-6?'sameElse':diff<-1?'lastWeek':diff<0?'lastDay':diff<1?'sameDay':diff<2?'nextDay':diff<7?'nextWeek':'sameElse';return this.format(this.lang().calendar(format,this));},isLeapYear:function(){return isLeapYear(this.year());},isDST:function(){return(this.zone()<this.clone().month(0).zone()||this.zone()<this.clone().month(5).zone());},day:function(input){var day=this._isUTC?this._d.getUTCDay():this._d.getDay();if(input!=null){input=parseWeekday(input,this.lang());return this.add({d:input-day});}else{return day;}},month:makeAccessor('Month',true),startOf:function(units){units=normalizeUnits(units);switch(units){case'year':this.month(0);case'quarter':case'month':this.date(1);case'week':case'isoWeek':case'day':this.hours(0);case'hour':this.minutes(0);case'minute':this.seconds(0);case'second':this.milliseconds(0);}
if(units==='week'){this.weekday(0);}else if(units==='isoWeek'){this.isoWeekday(1);}
if(units==='quarter'){this.month(Math.floor(this.month()/3)*3);}
return this;},endOf:function(units){units=normalizeUnits(units);return this.startOf(units).add((units==='isoWeek'?'week':units),1).subtract('ms',1);},isAfter:function(input,units){units=typeof units!=='undefined'?units:'millisecond';return+this.clone().startOf(units)>+moment(input).startOf(units);},isBefore:function(input,units){units=typeof units!=='undefined'?units:'millisecond';return+this.clone().startOf(units)<+moment(input).startOf(units);},isSame:function(input,units){units=units||'ms';return+this.clone().startOf(units)===+makeAs(input,this).startOf(units);},min:deprecate("moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548",function(other){other=moment.apply(null,arguments);return other<this?this:other;}),max:deprecate("moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548",function(other){other=moment.apply(null,arguments);return other>this?this:other;}),zone:function(input,keepTime){var offset=this._offset||0;if(input!=null){if(typeof input==="string"){input=timezoneMinutesFromString(input);}
if(Math.abs(input)<16){input=input*60;}
this._offset=input;this._isUTC=true;if(offset!==input){if(!keepTime||this._changeInProgress){addOrSubtractDurationFromMoment(this,moment.duration(offset-input,'m'),1,false);}else if(!this._changeInProgress){this._changeInProgress=true;moment.updateOffset(this,true);this._changeInProgress=null;}}}else{return this._isUTC?offset:this._d.getTimezoneOffset();}
return this;},zoneAbbr:function(){return this._isUTC?"UTC":"";},zoneName:function(){return this._isUTC?"Coordinated Universal Time":"";},parseZone:function(){if(this._tzm){this.zone(this._tzm);}else if(typeof this._i==='string'){this.zone(this._i);}
return this;},hasAlignedHourOffset:function(input){if(!input){input=0;}
else{input=moment(input).zone();}
return(this.zone()-input)%60===0;},daysInMonth:function(){return daysInMonth(this.year(),this.month());},dayOfYear:function(input){var dayOfYear=round((moment(this).startOf('day')-moment(this).startOf('year'))/864e5)+1;return input==null?dayOfYear:this.add("d",(input-dayOfYear));},quarter:function(input){return input==null?Math.ceil((this.month()+1)/3):this.month((input-1)*3+this.month()%3);},weekYear:function(input){var year=weekOfYear(this,this.lang()._week.dow,this.lang()._week.doy).year;return input==null?year:this.add("y",(input-year));},isoWeekYear:function(input){var year=weekOfYear(this,1,4).year;return input==null?year:this.add("y",(input-year));},week:function(input){var week=this.lang().week(this);return input==null?week:this.add("d",(input-week)*7);},isoWeek:function(input){var week=weekOfYear(this,1,4).week;return input==null?week:this.add("d",(input-week)*7);},weekday:function(input){var weekday=(this.day()+7-this.lang()._week.dow)%7;return input==null?weekday:this.add("d",input-weekday);},isoWeekday:function(input){return input==null?this.day()||7:this.day(this.day()%7?input:input-7);},isoWeeksInYear:function(){return weeksInYear(this.year(),1,4);},weeksInYear:function(){var weekInfo=this._lang._week;return weeksInYear(this.year(),weekInfo.dow,weekInfo.doy);},get:function(units){units=normalizeUnits(units);return this[units]();},set:function(units,value){units=normalizeUnits(units);if(typeof this[units]==='function'){this[units](value);}
return this;},lang:function(key){if(key===undefined){return this._lang;}else{this._lang=getLangDefinition(key);return this;}}});function rawMonthSetter(mom,value){var dayOfMonth;if(typeof value==='string'){value=mom.lang().monthsParse(value);if(typeof value!=='number'){return mom;}}
dayOfMonth=Math.min(mom.date(),daysInMonth(mom.year(),value));mom._d['set'+(mom._isUTC?'UTC':'')+'Month'](value,dayOfMonth);return mom;}
function rawGetter(mom,unit){return mom._d['get'+(mom._isUTC?'UTC':'')+unit]();}
function rawSetter(mom,unit,value){if(unit==='Month'){return rawMonthSetter(mom,value);}else{return mom._d['set'+(mom._isUTC?'UTC':'')+unit](value);}}
function makeAccessor(unit,keepTime){return function(value){if(value!=null){rawSetter(this,unit,value);moment.updateOffset(this,keepTime);return this;}else{return rawGetter(this,unit);}};}
moment.fn.millisecond=moment.fn.milliseconds=makeAccessor('Milliseconds',false);moment.fn.second=moment.fn.seconds=makeAccessor('Seconds',false);moment.fn.minute=moment.fn.minutes=makeAccessor('Minutes',false);moment.fn.hour=moment.fn.hours=makeAccessor('Hours',true);moment.fn.date=makeAccessor('Date',true);moment.fn.dates=deprecate("dates accessor is deprecated. Use date instead.",makeAccessor('Date',true));moment.fn.year=makeAccessor('FullYear',true);moment.fn.years=deprecate("years accessor is deprecated. Use year instead.",makeAccessor('FullYear',true));moment.fn.days=moment.fn.day;moment.fn.months=moment.fn.month;moment.fn.weeks=moment.fn.week;moment.fn.isoWeeks=moment.fn.isoWeek;moment.fn.quarters=moment.fn.quarter;moment.fn.toJSON=moment.fn.toISOString;extend(moment.duration.fn=Duration.prototype,{_bubble:function(){var milliseconds=this._milliseconds,days=this._days,months=this._months,data=this._data,seconds,minutes,hours,years;data.milliseconds=milliseconds%1000;seconds=absRound(milliseconds/1000);data.seconds=seconds%60;minutes=absRound(seconds/60);data.minutes=minutes%60;hours=absRound(minutes/60);data.hours=hours%24;days+=absRound(hours/24);data.days=days%30;months+=absRound(days/30);data.months=months%12;years=absRound(months/12);data.years=years;},weeks:function(){return absRound(this.days()/7);},valueOf:function(){return this._milliseconds+
this._days*864e5+
(this._months%12)*2592e6+
toInt(this._months/12)*31536e6;},humanize:function(withSuffix){var difference=+this,output=relativeTime(difference,!withSuffix,this.lang());if(withSuffix){output=this.lang().pastFuture(difference,output);}
return this.lang().postformat(output);},add:function(input,val){var dur=moment.duration(input,val);this._milliseconds+=dur._milliseconds;this._days+=dur._days;this._months+=dur._months;this._bubble();return this;},subtract:function(input,val){var dur=moment.duration(input,val);this._milliseconds-=dur._milliseconds;this._days-=dur._days;this._months-=dur._months;this._bubble();return this;},get:function(units){units=normalizeUnits(units);return this[units.toLowerCase()+'s']();},as:function(units){units=normalizeUnits(units);return this['as'+units.charAt(0).toUpperCase()+units.slice(1)+'s']();},lang:moment.fn.lang,toIsoString:function(){var years=Math.abs(this.years()),months=Math.abs(this.months()),days=Math.abs(this.days()),hours=Math.abs(this.hours()),minutes=Math.abs(this.minutes()),seconds=Math.abs(this.seconds()+this.milliseconds()/1000);if(!this.asSeconds()){return'P0D';}
return(this.asSeconds()<0?'-':'')+'P'+
(years?years+'Y':'')+
(months?months+'M':'')+
(days?days+'D':'')+
((hours||minutes||seconds)?'T':'')+
(hours?hours+'H':'')+
(minutes?minutes+'M':'')+
(seconds?seconds+'S':'');}});function makeDurationGetter(name){moment.duration.fn[name]=function(){return this._data[name];};}
function makeDurationAsGetter(name,factor){moment.duration.fn['as'+name]=function(){return+this/factor;};}
for(i in unitMillisecondFactors){if(unitMillisecondFactors.hasOwnProperty(i)){makeDurationAsGetter(i,unitMillisecondFactors[i]);makeDurationGetter(i.toLowerCase());}}
makeDurationAsGetter('Weeks',6048e5);moment.duration.fn.asMonths=function(){return(+this-this.years()*31536e6)/2592e6+this.years()*12;};moment.lang('en',{ordinal:function(number){var b=number%10,output=(toInt(number%100/10)===1)?'th':(b===1)?'st':(b===2)?'nd':(b===3)?'rd':'th';return number+output;}});function makeGlobal(shouldDeprecate){if(typeof ender!=='undefined'){return;}
oldGlobalMoment=globalScope.moment;if(shouldDeprecate){globalScope.moment=deprecate("Accessing Moment through the global scope is "+"deprecated, and will be removed in an upcoming "+"release.",moment);}else{globalScope.moment=moment;}}
if(hasModule){module.exports=moment;}else if(typeof define==="function"&&define.amd){define("moment",function(require,exports,module){if(module.config&&module.config()&&module.config().noGlobal===true){globalScope.moment=oldGlobalMoment;}
return moment;});makeGlobal(true);}else{makeGlobal();}}).call(this);(function(root,factory)
{'use strict';var moment;if(typeof exports==='object'){try{moment=require('moment');}catch(e){}
module.exports=factory(moment);}else if(typeof define==='function'&&define.amd){define(function(req)
{var id='moment';moment=req.defined&&req.defined(id)?req(id):undefined;return factory(moment);});}else{root.Pikaday=factory(root.moment);}}(this,function(moment)
{'use strict';var hasMoment=typeof moment==='function',hasEventListeners=!!window.addEventListener,document=window.document,sto=window.setTimeout,addEvent=function(el,e,callback,capture)
{if(hasEventListeners){el.addEventListener(e,callback,!!capture);}else{el.attachEvent('on'+e,callback);}},removeEvent=function(el,e,callback,capture)
{if(hasEventListeners){el.removeEventListener(e,callback,!!capture);}else{el.detachEvent('on'+e,callback);}},fireEvent=function(el,eventName,data)
{var ev;if(document.createEvent){ev=document.createEvent('HTMLEvents');ev.initEvent(eventName,true,false);ev=extend(ev,data);el.dispatchEvent(ev);}else if(document.createEventObject){ev=document.createEventObject();ev=extend(ev,data);el.fireEvent('on'+eventName,ev);}},trim=function(str)
{return str.trim?str.trim():str.replace(/^\s+|\s+$/g,'');},hasClass=function(el,cn)
{return(' '+el.className+' ').indexOf(' '+cn+' ')!==-1;},addClass=function(el,cn)
{if(!hasClass(el,cn)){el.className=(el.className==='')?cn:el.className+' '+cn;}},removeClass=function(el,cn)
{el.className=trim((' '+el.className+' ').replace(' '+cn+' ',' '));},isArray=function(obj)
{return(/Array/).test(Object.prototype.toString.call(obj));},isDate=function(obj)
{return(/Date/).test(Object.prototype.toString.call(obj))&&!isNaN(obj.getTime());},isLeapYear=function(year)
{return year%4===0&&year%100!==0||year%400===0;},getDaysInMonth=function(year,month)
{return[31,isLeapYear(year)?29:28,31,30,31,30,31,31,30,31,30,31][month];},setToStartOfDay=function(date)
{if(isDate(date))date.setHours(0,0,0,0);},compareDates=function(a,b)
{var _a=new Date(a.getTime());var _b=new Date(b.getTime());setToStartOfDay(_a);setToStartOfDay(_b);return _a.getTime()===_b.getTime();},extend=function(to,from,overwrite)
{var prop,hasProp;for(prop in from){hasProp=to[prop]!==undefined;if(hasProp&&typeof from[prop]==='object'&&from[prop].nodeName===undefined){if(isDate(from[prop])){if(overwrite){to[prop]=new Date(from[prop].getTime());}}
else if(isArray(from[prop])){if(overwrite){to[prop]=from[prop].slice(0);}}else{to[prop]=extend({},from[prop],overwrite);}}else if(overwrite||!hasProp){to[prop]=from[prop];}}
return to;},defaults={field:null,bound:undefined,format:null,defaultDate:null,setDefaultDate:false,firstDay:0,minDate:null,maxDate:null,yearRange:10,minYear:0,maxYear:9999,minMonth:undefined,maxMonth:undefined,isRTL:false,yearSuffix:'',showMonthAfterYear:false,numberOfMonths:1,showTime:false,showSeconds:false,use24hour:false,i18n:{previousMonth:'Previous Month',nextMonth:'Next Month',months:['January','February','March','April','May','June','July','August','September','October','November','December'],weekdays:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],weekdaysShort:['Sun','Mon','Tue','Wed','Thu','Fri','Sat']},onSelect:null,onOpen:null,onClose:null,onDraw:null},renderDayName=function(opts,day,abbr)
{day+=opts.firstDay;while(day>=7){day-=7;}
return abbr?opts.i18n.weekdaysShort[day]:opts.i18n.weekdays[day];},renderDay=function(i,isSelected,isToday,isDisabled,isEmpty)
{if(isEmpty){return'<td class="is-empty"></td>';}
var arr=[];if(isDisabled){arr.push('is-disabled');}
if(isToday){arr.push('is-today');}
if(isSelected){arr.push('is-selected');}
return'<td data-day="'+i+'" class="'+arr.join(' ')+'"><button class="pika-button" type="button">'+i+'</button>'+'</td>';},renderRow=function(days,isRTL)
{return'<tr>'+(isRTL?days.reverse():days).join('')+'</tr>';},renderBody=function(rows)
{return'<tbody>'+rows.join('')+'</tbody>';},renderHead=function(opts)
{var i,arr=[];for(i=0;i<7;i++){arr.push('<th scope="col"><abbr title="'+renderDayName(opts,i)+'">'+renderDayName(opts,i,true)+'</abbr></th>');}
return'<thead>'+(opts.isRTL?arr.reverse():arr).join('')+'</thead>';},renderTitle=function(instance)
{var i,j,arr,opts=instance._o,month=instance._m,year=instance._y,isMinYear=year===opts.minYear,isMaxYear=year===opts.maxYear,html='<div class="pika-title">',monthHtml,yearHtml,prev=true,next=true;for(arr=[],i=0;i<12;i++){arr.push('<option value="'+i+'"'+
(i===month?' selected':'')+
((isMinYear&&i<opts.minMonth)||(isMaxYear&&i>opts.maxMonth)?'disabled':'')+'>'+
opts.i18n.months[i]+'</option>');}
monthHtml='<div class="pika-label">'+opts.i18n.months[month]+'<select class="pika-select pika-select-month">'+arr.join('')+'</select></div>';if(isArray(opts.yearRange)){i=opts.yearRange[0];j=opts.yearRange[1]+1;}else{i=year-opts.yearRange;j=1+year+opts.yearRange;}
for(arr=[];i<j&&i<=opts.maxYear;i++){if(i>=opts.minYear){arr.push('<option value="'+i+'"'+(i===year?' selected':'')+'>'+(i)+'</option>');}}
yearHtml='<div class="pika-label">'+year+opts.yearSuffix+'<select class="pika-select pika-select-year">'+arr.join('')+'</select></div>';if(opts.showMonthAfterYear){html+=yearHtml+monthHtml;}else{html+=monthHtml+yearHtml;}
if(isMinYear&&(month===0||opts.minMonth>=month)){prev=false;}
if(isMaxYear&&(month===11||opts.maxMonth<=month)){next=false;}
html+='<button class="pika-prev'+(prev?'':' is-disabled')+'" type="button">'+opts.i18n.previousMonth+'</button>';html+='<button class="pika-next'+(next?'':' is-disabled')+'" type="button">'+opts.i18n.nextMonth+'</button>';return html+='</div>';},renderTable=function(opts,data)
{return'<table cellpadding="0" cellspacing="0" class="pika-table">'+renderHead(opts)+renderBody(data)+'</table>';},renderFooter=function(hh,mm,ss,use24hour,showSeconds)
{var to_return='<div class="pika-footer">'+
renderTime(24,hh,'pika-select-hour',function(i){if(use24hour){return i;}else{var to_return=(i%12)+(i<12?' AM':' PM');if(to_return=='0 AM'){return'Midnight'}else if(to_return=='0 PM'){return'Noon'}else{return to_return;}}})+'<div class="pika-label pika-label-divider">:</div>'+
renderTime(60,mm,'pika-select-minute',function(i){if(i<10)return"0"+i;return i});if(showSeconds){to_return+='<div class="pika-label pika-label-divider">:</div>'+
renderTime(60,ss,'pika-select-second',function(i){if(i<10)return"0"+i;return i});}
return to_return+'</div>';},renderTime=function(num_options,selected_val,select_class,display_func){var to_return='<div class="pika-label"> '+display_func(selected_val)+' <select class="pika-select '+select_class+'">';for(var i=0;i<num_options;i++){to_return+='<option value="'+i+'" '+(i==selected_val?'selected':'')+'>'+display_func(i)+'</option>'}
to_return+='</select></div>';return to_return;},Pikaday=function(options)
{var self=this,opts=self.config(options);self._onMouseDown=function(e)
{if(!self._v){return;}
e=e||window.event;var target=e.target||e.srcElement;if(!target){return;}
if(!hasClass(target,'is-disabled')){if(hasClass(target,'pika-button')&&!hasClass(target,'is-empty')){self.setDate(new Date(self._y,self._m,parseInt(target.innerHTML,10),self._hh,self._mm,self._ss));if(opts.bound){sto(function(){self.hide();},100);}
return;}
else if(hasClass(target,'pika-prev')){self.prevMonth();}
else if(hasClass(target,'pika-next')){self.nextMonth();}}
if(!hasClass(target,'pika-select')){if(e.preventDefault){e.preventDefault();}else{e.returnValue=false;return false;}}else{self._c=true;}};self._onChange=function(e)
{e=e||window.event;var target=e.target||e.srcElement;if(!target){return;}
if(hasClass(target,'pika-select-month')){self.gotoMonth(target.value);}
else if(hasClass(target,'pika-select-year')){self.gotoYear(target.value);}
else if(hasClass(target,'pika-select-hour')){self._hh=target.value;self.setTime(self._hh,self._mm,self._ss);}
else if(hasClass(target,'pika-select-minute')){self._mm=target.value;self.setTime(self._hh,self._mm,self._ss);}
else if(hasClass(target,'pika-select-second')){self._ss=target.value;self.setTime(self._hh,self._mm,self._ss);}};self._onInputChange=function(e)
{var date;if(e.firedBy===self){return;}
if(hasMoment){date=moment(opts.field.value,opts.format);date=(date&&date.isValid())?date.toDate():null;}
else{date=new Date(Date.parse(opts.field.value));}
self.setDate(isDate(date)?date:null);if(!self._v){self.show();}};self._onInputFocus=function()
{self.show();};self._onInputClick=function()
{self.show();};self._onInputBlur=function()
{if(!self._c){self._b=sto(function(){self.hide();},50);}
self._c=false;};self._onClick=function(e)
{e=e||window.event;var target=e.target||e.srcElement,pEl=target;if(!target){return;}
if(!hasEventListeners&&hasClass(target,'pika-select')){if(!target.onchange){target.setAttribute('onchange','return;');addEvent(target,'change',self._onChange);}}
do{if(hasClass(pEl,'pika-single')){return;}}
while((pEl=pEl.parentNode));if(self._v&&target!==opts.trigger){self.hide();}};self.el=document.createElement('div');self.el.className='pika-single'+(opts.isRTL?' is-rtl':'');addEvent(self.el,'mousedown',self._onMouseDown,true);addEvent(self.el,'change',self._onChange);if(opts.field){if(opts.bound){document.body.appendChild(self.el);}else{opts.field.parentNode.insertBefore(self.el,opts.field.nextSibling);}
addEvent(opts.field,'change',self._onInputChange);if(!opts.defaultDate){if(hasMoment&&opts.field.value){opts.defaultDate=moment(opts.field.value,opts.format).toDate();}else{opts.defaultDate=new Date(Date.parse(opts.field.value));}
opts.setDefaultDate=true;}}
var defDate=opts.defaultDate;if(isDate(defDate)){if(opts.setDefaultDate){self.setDate(defDate,true);}else{self.gotoDate(defDate);}}else{self.gotoDate(new Date());}
if(opts.bound){this.hide();self.el.className+=' is-bound';addEvent(opts.trigger,'click',self._onInputClick);addEvent(opts.trigger,'focus',self._onInputFocus);addEvent(opts.trigger,'blur',self._onInputBlur);}else{this.show();}};Pikaday.prototype={config:function(options)
{if(!this._o){this._o=extend({},defaults,true);}
var opts=extend(this._o,options,true);opts.isRTL=!!opts.isRTL;opts.field=(opts.field&&opts.field.nodeName)?opts.field:null;opts.bound=!!(opts.bound!==undefined?opts.field&&opts.bound:opts.field);opts.trigger=(opts.trigger&&opts.trigger.nodeName)?opts.trigger:opts.field;var nom=parseInt(opts.numberOfMonths,10)||1;opts.numberOfMonths=nom>4?4:nom;if(!isDate(opts.minDate)){opts.minDate=false;}
if(!isDate(opts.maxDate)){opts.maxDate=false;}
if((opts.minDate&&opts.maxDate)&&opts.maxDate<opts.minDate){opts.maxDate=opts.minDate=false;}
if(opts.minDate){if(!opts.showTime)setToStartOfDay(opts.minDate);opts.minYear=opts.minDate.getFullYear();opts.minMonth=opts.minDate.getMonth();}
if(opts.maxDate){if(!opts.showTime)setToStartOfDay(opts.maxDate);opts.maxYear=opts.maxDate.getFullYear();opts.maxMonth=opts.maxDate.getMonth();}
if(isArray(opts.yearRange)){var fallback=new Date().getFullYear()-10;opts.yearRange[0]=parseInt(opts.yearRange[0],10)||fallback;opts.yearRange[1]=parseInt(opts.yearRange[1],10)||fallback;}else{opts.yearRange=Math.abs(parseInt(opts.yearRange,10))||defaults.yearRange;if(opts.yearRange>100){opts.yearRange=100;}}
if(opts.format===null){opts.format='YYYY-MM-DD';if(opts.showTime){opts.format+=' HH:mm:ss';}}
return opts;},toString:function(format)
{return!isDate(this._d)?'':hasMoment?moment(this._d).format(format||this._o.format):this._o.showTime?this._d.toString():this._d.toDateString();},getMoment:function()
{return hasMoment?moment(this._d):null;},setMoment:function(date)
{if(hasMoment&&moment.isMoment(date)){this.setDate(date.toDate());}},getDate:function()
{return isDate(this._d)?new Date(this._d.getTime()):null;},setTime:function(hours,minutes,seconds){if(this._d){this._d.setHours(this._hh,this._mm,this._ss);this.setDate(this._d);}},setDate:function(date,preventOnSelect)
{if(!date){this._d=null;return this.draw();}
if(typeof date==='string'){date=new Date(Date.parse(date));}
if(!isDate(date)){return;}
var min=this._o.minDate,max=this._o.maxDate;if(isDate(min)&&date<min){date=min;}else if(isDate(max)&&date>max){date=max;}
this._d=new Date(date.getTime());if(this._o.showTime&&!this._o.showSeconds){this._d.setSeconds(0);}else if(!this._o.showTime){setToStartOfDay(this._d);}
this.gotoDate(this._d);if(this._o.field){this._o.field.value=this.toString();fireEvent(this._o.field,'change',{firedBy:this});}
if(!preventOnSelect&&typeof this._o.onSelect==='function'){this._o.onSelect.call(this,this.getDate());}},gotoDate:function(date)
{if(!isDate(date)){return;}
this._y=date.getFullYear();this._m=date.getMonth();this._hh=date.getHours();this._mm=date.getMinutes();this._ss=date.getSeconds();this.draw();},gotoToday:function()
{this.gotoDate(new Date());},gotoMonth:function(month)
{if(!isNaN((month=parseInt(month,10)))){this._m=month<0?0:month>11?11:month;this.draw();}},nextMonth:function()
{if(++this._m>11){this._m=0;this._y++;}
this.draw();},prevMonth:function()
{if(--this._m<0){this._m=11;this._y--;}
this.draw();},gotoYear:function(year)
{if(!isNaN(year)){this._y=parseInt(year,10);this.draw();}},setMinDate:function(value)
{this._o.minDate=value;},setMaxDate:function(value)
{this._o.maxDate=value;},draw:function(force)
{if(!this._v&&!force){return;}
var opts=this._o,minYear=opts.minYear,maxYear=opts.maxYear,minMonth=opts.minMonth,maxMonth=opts.maxMonth;if(this._y<=minYear){this._y=minYear;if(!isNaN(minMonth)&&this._m<minMonth){this._m=minMonth;}}
if(this._y>=maxYear){this._y=maxYear;if(!isNaN(maxMonth)&&this._m>maxMonth){this._m=maxMonth;}}
this.el.innerHTML=renderTitle(this)+this.render(this._y,this._m);if(opts.showTime){this.el.innerHTML+=renderFooter(this._hh,this._mm,this._ss,this._o.use24hour,this._o.showSeconds);}
if(opts.bound){if(opts.field.type!=='hidden'){sto(function(){opts.trigger.focus();},1);}}
if(typeof this._o.onDraw==='function'){var self=this;sto(function(){self._o.onDraw.call(self);},0);}},adjustPosition:function()
{var field=this._o.trigger,pEl=field,width=this.el.offsetWidth,height=this.el.offsetHeight,viewportWidth=window.innerWidth||document.documentElement.clientWidth,viewportHeight=window.innerHeight||document.documentElement.clientHeight,scrollTop=window.pageYOffset||document.body.scrollTop||document.documentElement.scrollTop,left,top,clientRect;if(typeof field.getBoundingClientRect==='function'){clientRect=field.getBoundingClientRect();left=clientRect.left+window.pageXOffset;top=clientRect.bottom+window.pageYOffset;}else{left=pEl.offsetLeft;top=pEl.offsetTop+pEl.offsetHeight;while((pEl=pEl.offsetParent)){left+=pEl.offsetLeft;top+=pEl.offsetTop;}}
if(left+width>viewportWidth){left=left-width+field.offsetWidth;}
if(top+height>viewportHeight+scrollTop){top=top-height-field.offsetHeight;}
this.el.style.cssText='position:absolute;left:'+left+'px;top:'+top+'px;';},render:function(year,month)
{var opts=this._o,now=new Date(),days=getDaysInMonth(year,month),before=new Date(year,month,1).getDay(),data=[],row=[];if(!opts.showTime)setToStartOfDay(now);if(opts.firstDay>0){before-=opts.firstDay;if(before<0){before+=7;}}
var cells=days+before,after=cells;while(after>7){after-=7;}
cells+=7-after;for(var i=0,r=0;i<cells;i++)
{var day=new Date(year,month,1+(i-before)),isDisabled=(opts.minDate&&day<opts.minDate)||(opts.maxDate&&day>opts.maxDate),isSelected=isDate(this._d)?compareDates(day,this._d):false,isToday=compareDates(day,now),isEmpty=i<before||i>=(days+before);row.push(renderDay(1+(i-before),isSelected,isToday,isDisabled,isEmpty));if(++r===7){data.push(renderRow(row,opts.isRTL));row=[];r=0;}}
return renderTable(opts,data);},isVisible:function()
{return this._v;},show:function()
{if(!this._v){removeClass(this.el,'is-hidden');this._v=true;this.draw();if(this._o.bound){addEvent(document,'click',this._onClick);this.adjustPosition();}
if(typeof this._o.onOpen==='function'){this._o.onOpen.call(this);}}},hide:function()
{var v=this._v;if(v!==false){if(this._o.bound){removeEvent(document,'click',this._onClick);}
this.el.style.cssText='';addClass(this.el,'is-hidden');this._v=false;if(v!==undefined&&typeof this._o.onClose==='function'){this._o.onClose.call(this);}}},destroy:function()
{this.hide();removeEvent(this.el,'mousedown',this._onMouseDown,true);removeEvent(this.el,'change',this._onChange);if(this._o.field){removeEvent(this._o.field,'change',this._onInputChange);if(this._o.bound){removeEvent(this._o.trigger,'click',this._onInputClick);removeEvent(this._o.trigger,'focus',this._onInputFocus);removeEvent(this._o.trigger,'blur',this._onInputBlur);}}
if(this.el.parentNode){this.el.parentNode.removeChild(this.el);}}};return Pikaday;}));(function(root,factory)
{'use strict';if(typeof exports==='object'){factory(require('jquery'),require('../pikaday'));}else if(typeof define==='function'&&define.amd){define(['jquery','pikaday'],factory);}else{factory(root.jQuery,root.Pikaday);}}(this,function($,Pikaday)
{'use strict';$.fn.pikaday=function()
{var args=arguments;if(!args||!args.length){args=[{}];}
return this.each(function()
{var self=$(this),plugin=self.data('pikaday');if(!(plugin instanceof Pikaday)){if(typeof args[0]==='object'){var options=$.extend({},args[0]);options.field=self[0];self.data('pikaday',new Pikaday(options));}}else{if(typeof args[0]==='string'&&typeof plugin[args[0]]==='function'){plugin[args[0]].apply(plugin,Array.prototype.slice.call(args,1));}}});};}));;(function(){var $=window.jQuery,$win=$(window),$doc=$(document),$body;var svgNS='http://www.w3.org/2000/svg',svgSupported='SVGAngle'in window&&(function(){var supported,el=document.createElement('div');el.innerHTML='<svg/>';supported=(el.firstChild&&el.firstChild.namespaceURI)==svgNS;el.innerHTML='';return supported;})();var transitionSupported=(function(){var style=document.createElement('div').style;return'transition'in style||'WebkitTransition'in style||'MozTransition'in style||'msTransition'in style||'OTransition'in style;})();var touchSupported='ontouchstart'in window,mousedownEvent='mousedown'+(touchSupported?' touchstart':''),mousemoveEvent='mousemove.clockpicker'+(touchSupported?' touchmove.clockpicker':''),mouseupEvent='mouseup.clockpicker'+(touchSupported?' touchend.clockpicker':'');var vibrate=navigator.vibrate?'vibrate':navigator.webkitVibrate?'webkitVibrate':null;function createSvgElement(name){return document.createElementNS(svgNS,name);}
function leadingZero(num){return(num<10?'0':'')+num;}
var idCounter=0;function uniqueId(prefix){var id=++idCounter+'';return prefix?prefix+id:id;}
var dialRadius=100,outerRadius=80,innerRadius=54,tickRadius=13,diameter=dialRadius*2,duration=transitionSupported?350:1;var tpl=['<div class="popover clockpicker-popover">','<div class="arrow"></div>','<div class="popover-title">','<span class="clockpicker-span-hours text-primary"></span>',' : ','<span class="clockpicker-span-minutes"></span>','<span class="clockpicker-span-am-pm"></span>','</div>','<div class="popover-content">','<div class="clockpicker-plate">','<div class="clockpicker-canvas"></div>','<div class="clockpicker-dial clockpicker-hours"></div>','<div class="clockpicker-dial clockpicker-minutes clockpicker-dial-out"></div>','</div>','<span class="clockpicker-am-pm-block">','</span>','</div>','</div>'].join('');function ClockPicker(element,options){var popover=$(tpl),plate=popover.find('.clockpicker-plate'),hoursView=popover.find('.clockpicker-hours'),minutesView=popover.find('.clockpicker-minutes'),amPmBlock=popover.find('.clockpicker-am-pm-block'),isInput=element.prop('tagName')==='INPUT',input=isInput?element:element.find('input'),addon=element.find('.input-group-addon'),self=this,timer;this.id=uniqueId('cp');this.element=element;this.options=options;this.isAppended=false;this.isShown=false;this.currentView='hours';this.isInput=isInput;this.input=input;this.addon=addon;this.popover=popover;this.plate=plate;this.hoursView=hoursView;this.minutesView=minutesView;this.amPmBlock=amPmBlock;this.spanHours=popover.find('.clockpicker-span-hours');this.spanMinutes=popover.find('.clockpicker-span-minutes');this.spanAmPm=popover.find('.clockpicker-span-am-pm');this.amOrPm="PM";if(options.twelvehour){var amPmButtonsTemplate=['<div class="clockpicker-am-pm-block">','<button type="button" class="btn btn-sm btn-default clockpicker-button clockpicker-am-button">','AM</button>','<button type="button" class="btn btn-sm btn-default clockpicker-button clockpicker-pm-button">','PM</button>','</div>'].join('');var amPmButtons=$(amPmButtonsTemplate);$('<button type="button" class="btn btn-sm btn-default clockpicker-button am-button">'+"AM"+'</button>').on("click",function(){self.amOrPm="AM";$('.clockpicker-span-am-pm').empty().append('AM');}).appendTo(this.amPmBlock);$('<button type="button" class="btn btn-sm btn-default clockpicker-button pm-button">'+"PM"+'</button>').on("click",function(){self.amOrPm='PM';$('.clockpicker-span-am-pm').empty().append('PM');}).appendTo(this.amPmBlock);}
if(!options.autoclose){$('<button type="button" class="btn btn-sm btn-default btn-block clockpicker-button">'+options.donetext+'</button>').click($.proxy(this.done,this)).appendTo(popover);}
if((options.placement==='top'||options.placement==='bottom')&&(options.align==='top'||options.align==='bottom'))options.align='left';if((options.placement==='left'||options.placement==='right')&&(options.align==='left'||options.align==='right'))options.align='top';popover.addClass(options.placement);popover.addClass('clockpicker-align-'+options.align);this.spanHours.click($.proxy(this.toggleView,this,'hours'));this.spanMinutes.click($.proxy(this.toggleView,this,'minutes'));input.on('focus.clockpicker click.clockpicker',$.proxy(this.show,this));addon.on('click.clockpicker',$.proxy(this.toggle,this));var tickTpl=$('<div class="clockpicker-tick"></div>'),i,tick,radian,radius;if(options.twelvehour){for(i=1;i<13;i+=1){tick=tickTpl.clone();radian=i/6*Math.PI;radius=outerRadius;tick.css('font-size','120%');tick.css({left:dialRadius+Math.sin(radian)*radius-tickRadius,top:dialRadius-Math.cos(radian)*radius-tickRadius});tick.html(i===0?'00':i);hoursView.append(tick);tick.on(mousedownEvent,mousedown);}}else{for(i=0;i<24;i+=1){tick=tickTpl.clone();radian=i/6*Math.PI;var inner=i>0&&i<13;radius=inner?innerRadius:outerRadius;tick.css({left:dialRadius+Math.sin(radian)*radius-tickRadius,top:dialRadius-Math.cos(radian)*radius-tickRadius});if(inner){tick.css('font-size','120%');}
tick.html(i===0?'00':i);hoursView.append(tick);tick.on(mousedownEvent,mousedown);}}
for(i=0;i<60;i+=5){tick=tickTpl.clone();radian=i/30*Math.PI;tick.css({left:dialRadius+Math.sin(radian)*outerRadius-tickRadius,top:dialRadius-Math.cos(radian)*outerRadius-tickRadius});tick.css('font-size','120%');tick.html(leadingZero(i));minutesView.append(tick);tick.on(mousedownEvent,mousedown);}
plate.on(mousedownEvent,function(e){if($(e.target).closest('.clockpicker-tick').length===0){mousedown(e,true);}});function mousedown(e,space){var offset=plate.offset(),isTouch=/^touch/.test(e.type),x0=offset.left+dialRadius,y0=offset.top+dialRadius,dx=(isTouch?e.originalEvent.touches[0]:e).pageX-x0,dy=(isTouch?e.originalEvent.touches[0]:e).pageY-y0,z=Math.sqrt(dx*dx+dy*dy),moved=false;if(space&&(z<outerRadius-tickRadius||z>outerRadius+tickRadius)){return;}
e.preventDefault();var movingTimer=setTimeout(function(){$body.addClass('clockpicker-moving');},200);if(svgSupported){plate.append(self.canvas);}
self.setHand(dx,dy,!space,true);$doc.off(mousemoveEvent).on(mousemoveEvent,function(e){e.preventDefault();var isTouch=/^touch/.test(e.type),x=(isTouch?e.originalEvent.touches[0]:e).pageX-x0,y=(isTouch?e.originalEvent.touches[0]:e).pageY-y0;if(!moved&&x===dx&&y===dy){return;}
moved=true;self.setHand(x,y,false,true);});$doc.off(mouseupEvent).on(mouseupEvent,function(e){$doc.off(mouseupEvent);e.preventDefault();var isTouch=/^touch/.test(e.type),x=(isTouch?e.originalEvent.changedTouches[0]:e).pageX-x0,y=(isTouch?e.originalEvent.changedTouches[0]:e).pageY-y0;if((space||moved)&&x===dx&&y===dy){self.setHand(x,y);}
if(self.currentView==='hours'){self.toggleView('minutes',duration/2);}else{if(options.autoclose){self.minutesView.addClass('clockpicker-dial-out');setTimeout(function(){self.done();},duration/2);}}
plate.prepend(canvas);clearTimeout(movingTimer);$body.removeClass('clockpicker-moving');$doc.off(mousemoveEvent);});}
if(svgSupported){var canvas=popover.find('.clockpicker-canvas'),svg=createSvgElement('svg');svg.setAttribute('class','clockpicker-svg');svg.setAttribute('width',diameter);svg.setAttribute('height',diameter);var g=createSvgElement('g');g.setAttribute('transform','translate('+dialRadius+','+dialRadius+')');var bearing=createSvgElement('circle');bearing.setAttribute('class','clockpicker-canvas-bearing');bearing.setAttribute('cx',0);bearing.setAttribute('cy',0);bearing.setAttribute('r',2);var hand=createSvgElement('line');hand.setAttribute('x1',0);hand.setAttribute('y1',0);var bg=createSvgElement('circle');bg.setAttribute('class','clockpicker-canvas-bg');bg.setAttribute('r',tickRadius);var fg=createSvgElement('circle');fg.setAttribute('class','clockpicker-canvas-fg');fg.setAttribute('r',3.5);g.appendChild(hand);g.appendChild(bg);g.appendChild(fg);g.appendChild(bearing);svg.appendChild(g);canvas.append(svg);this.hand=hand;this.bg=bg;this.fg=fg;this.bearing=bearing;this.g=g;this.canvas=canvas;}
raiseCallback(this.options.init);}
function raiseCallback(callbackFunction){if(callbackFunction&&typeof callbackFunction==="function"){callbackFunction();}}
ClockPicker.DEFAULTS={'default':'',fromnow:0,placement:'bottom',align:'left',donetext:'完成',autoclose:false,twelvehour:false,vibrate:true};ClockPicker.prototype.toggle=function(){this[this.isShown?'hide':'show']();};ClockPicker.prototype.locate=function(){var element=this.element,popover=this.popover,offset=element.offset(),width=element.outerWidth(),height=element.outerHeight(),placement=this.options.placement,align=this.options.align,styles={},self=this;popover.show();switch(placement){case'bottom':styles.top=offset.top+height;break;case'right':styles.left=offset.left+width;break;case'top':styles.top=offset.top-popover.outerHeight();break;case'left':styles.left=offset.left-popover.outerWidth();break;}
switch(align){case'left':styles.left=offset.left;break;case'right':styles.left=offset.left+width-popover.outerWidth();break;case'top':styles.top=offset.top;break;case'bottom':styles.top=offset.top+height-popover.outerHeight();break;}
popover.css(styles);};ClockPicker.prototype.show=function(e){if(this.isShown){return;}
raiseCallback(this.options.beforeShow);var self=this;if(!this.isAppended){$body=$(document.body).append(this.popover);$win.on('resize.clockpicker'+this.id,function(){if(self.isShown){self.locate();}});this.isAppended=true;}
var value=((this.input.prop('value')||this.options['default']||'')+'').split(':');if(value[0]==='now'){var now=new Date(+new Date()+this.options.fromnow);value=[now.getHours(),now.getMinutes()];}
this.hours=+value[0]||0;this.minutes=+value[1]||0;this.spanHours.html(leadingZero(this.hours));this.spanMinutes.html(leadingZero(this.minutes));this.toggleView('hours');this.locate();this.isShown=true;$doc.on('click.clockpicker.'+this.id+' focusin.clockpicker.'+this.id,function(e){var target=$(e.target);if(target.closest(self.popover).length===0&&target.closest(self.addon).length===0&&target.closest(self.input).length===0){self.hide();}});$doc.on('keyup.clockpicker.'+this.id,function(e){if(e.keyCode===27){self.hide();}});raiseCallback(this.options.afterShow);};ClockPicker.prototype.hide=function(){raiseCallback(this.options.beforeHide);this.isShown=false;$doc.off('click.clockpicker.'+this.id+' focusin.clockpicker.'+this.id);$doc.off('keyup.clockpicker.'+this.id);this.popover.hide();raiseCallback(this.options.afterHide);};ClockPicker.prototype.toggleView=function(view,delay){var raiseAfterHourSelect=false;if(view==='minutes'&&$(this.hoursView).css("visibility")==="visible"){raiseCallback(this.options.beforeHourSelect);raiseAfterHourSelect=true;}
var isHours=view==='hours',nextView=isHours?this.hoursView:this.minutesView,hideView=isHours?this.minutesView:this.hoursView;this.currentView=view;this.spanHours.toggleClass('text-primary',isHours);this.spanMinutes.toggleClass('text-primary',!isHours);hideView.addClass('clockpicker-dial-out');nextView.css('visibility','visible').removeClass('clockpicker-dial-out');this.resetClock(delay);clearTimeout(this.toggleViewTimer);this.toggleViewTimer=setTimeout(function(){hideView.css('visibility','hidden');},duration);if(raiseAfterHourSelect){raiseCallback(this.options.afterHourSelect);}};ClockPicker.prototype.resetClock=function(delay){var view=this.currentView,value=this[view],isHours=view==='hours',unit=Math.PI/(isHours?6:30),radian=value*unit,radius=isHours&&value>0&&value<13?innerRadius:outerRadius,x=Math.sin(radian)*radius,y=-Math.cos(radian)*radius,self=this;if(svgSupported&&delay){self.canvas.addClass('clockpicker-canvas-out');setTimeout(function(){self.canvas.removeClass('clockpicker-canvas-out');self.setHand(x,y);},delay);}else{this.setHand(x,y);}};ClockPicker.prototype.setHand=function(x,y,roundBy5,dragging){var radian=Math.atan2(x,-y),isHours=this.currentView==='hours',unit=Math.PI/(isHours||roundBy5?6:30),z=Math.sqrt(x*x+y*y),options=this.options,inner=isHours&&z<(outerRadius+innerRadius)/2,radius=inner?innerRadius:outerRadius,value;if(options.twelvehour){radius=outerRadius;}
if(radian<0){radian=Math.PI*2+radian;}
value=Math.round(radian/unit);radian=value*unit;if(options.twelvehour){if(isHours){if(value===0){value=12;}}else{if(roundBy5){value*=5;}
if(value===60){value=0;}}}else{if(isHours){if(value===12){value=0;}
value=inner?(value===0?12:value):value===0?0:value+12;}else{if(roundBy5){value*=5;}
if(value===60){value=0;}}}
if(this[this.currentView]!==value){if(vibrate&&this.options.vibrate){if(!this.vibrateTimer){navigator[vibrate](10);this.vibrateTimer=setTimeout($.proxy(function(){this.vibrateTimer=null;},this),100);}}}
this[this.currentView]=value;this[isHours?'spanHours':'spanMinutes'].html(leadingZero(value));if(!svgSupported){this[isHours?'hoursView':'minutesView'].find('.clockpicker-tick').each(function(){var tick=$(this);tick.toggleClass('active',value===+tick.html());});return;}
if(dragging||(!isHours&&value%5)){this.g.insertBefore(this.hand,this.bearing);this.g.insertBefore(this.bg,this.fg);this.bg.setAttribute('class','clockpicker-canvas-bg clockpicker-canvas-bg-trans');}else{this.g.insertBefore(this.hand,this.bg);this.g.insertBefore(this.fg,this.bg);this.bg.setAttribute('class','clockpicker-canvas-bg');}
var cx=Math.sin(radian)*radius,cy=-Math.cos(radian)*radius;this.hand.setAttribute('x2',cx);this.hand.setAttribute('y2',cy);this.bg.setAttribute('cx',cx);this.bg.setAttribute('cy',cy);this.fg.setAttribute('cx',cx);this.fg.setAttribute('cy',cy);};ClockPicker.prototype.done=function(){raiseCallback(this.options.beforeDone);this.hide();var last=this.input.prop('value'),value=leadingZero(this.hours)+':'+leadingZero(this.minutes);if(this.options.twelvehour){value=value+this.amOrPm;}
this.input.prop('value',value);if(value!==last){this.input.triggerHandler('change');if(!this.isInput){this.element.trigger('change');}}
if(this.options.autoclose){this.input.trigger('blur');}
raiseCallback(this.options.afterDone);};ClockPicker.prototype.remove=function(){this.element.removeData('clockpicker');this.input.off('focus.clockpicker click.clockpicker');this.addon.off('click.clockpicker');if(this.isShown){this.hide();}
if(this.isAppended){$win.off('resize.clockpicker'+this.id);this.popover.remove();}};$.fn.clockpicker=function(option){var args=Array.prototype.slice.call(arguments,1);return this.each(function(){var $this=$(this),data=$this.data('clockpicker');if(!data){var options=$.extend({},ClockPicker.DEFAULTS,$this.data(),typeof option=='object'&&option);$this.data('clockpicker',new ClockPicker($this,options));}else{if(typeof data[option]==='function'){data[option].apply(data,args);}}});};}());+function($){"use strict";var DatePicker=function(element,options){var self=this
this.options=options
this.$el=$(element)
this.$input=this.$el.find('input:first')
var $form=this.$el.closest('form'),changeMonitor=$form.data('oc.changeMonitor')
if(changeMonitor!==undefined)
changeMonitor.pause()
this.$input.pikaday({minDate:new Date(options.minDate),maxDate:new Date(options.maxDate),yearRange:options.yearRange,setDefaultDate:moment(this.$input.val()).toDate(),onOpen:function(){var $field=$(this._o.trigger)
$(this.el).css({left:'auto',right:$(window).width()-$field.offset().left-$field.outerWidth()})}})
if(changeMonitor!==undefined)
changeMonitor.resume()}
DatePicker.DEFAULTS={minDate:'2000-01-01',maxDate:'2020-12-31',yearRange:10}
var old=$.fn.datePicker
$.fn.datePicker=function(option){var args=Array.prototype.slice.call(arguments,1)
return this.each(function(){var $this=$(this)
var data=$this.data('oc.datepicker')
var options=$.extend({},DatePicker.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('oc.datepicker',(data=new DatePicker(this,options)))
else if(typeof option=='string')data[option].apply(data,args)})}
$.fn.datePicker.Constructor=DatePicker
$.fn.datePicker.noConflict=function(){$.fn.datePicker=old
return this}
$(document).on('render',function(){$('[data-control="datepicker"]').datePicker()});}(window.jQuery);+function($){"use strict";var TimePicker=function(element,options){var self=this
this.options=options
this.$el=$(element)
this.$input=this.$el.find('input:first')
var $form=this.$el.closest('form'),changeMonitor=$form.data('oc.changeMonitor')
if(changeMonitor!==undefined)
changeMonitor.pause()
this.$input.clockpicker()
if(changeMonitor!==undefined)
changeMonitor.resume()}
TimePicker.DEFAULTS={}
var old=$.fn.timePicker
$.fn.timePicker=function(option){var args=Array.prototype.slice.call(arguments,1)
return this.each(function(){var $this=$(this)
var data=$this.data('oc.timepicker')
var options=$.extend({},TimePicker.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('oc.timepicker',(data=new TimePicker(this,options)))
else if(typeof option=='string')data[option].apply(data,args)})}
$.fn.timePicker.Constructor=TimePicker
$.fn.timePicker.noConflict=function(){$.fn.timePicker=old
return this}
$(document).on('render',function(){$('[data-control="timepicker"]').timePicker()});}(window.jQuery);