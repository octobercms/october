
(function($){$.fn.touchwipe=function(settings){var config={min_move_x:20,min_move_y:20,wipeLeft:function(){},wipeRight:function(){},wipeUp:function(){},wipeDown:function(){},preventDefaultEvents:true};if(settings)$.extend(config,settings);this.each(function(){var startX;var startY;var isMoving=false;function cancelTouch(){this.removeEventListener('touchmove',onTouchMove);startX=null;isMoving=false;}
function onTouchMove(e){if(config.preventDefaultEvents){e.preventDefault();}
if(isMoving){var x=e.touches[0].pageX;var y=e.touches[0].pageY;var dx=startX-x;var dy=startY-y;if(Math.abs(dx)>=config.min_move_x){cancelTouch();if(dx>0){config.wipeLeft();}
else{config.wipeRight();}}
else if(Math.abs(dy)>=config.min_move_y){cancelTouch();if(dy>0){config.wipeDown();}
else{config.wipeUp();}}}}
function onTouchStart(e)
{if(e.touches.length==1){startX=e.touches[0].pageX;startY=e.touches[0].pageY;isMoving=true;this.addEventListener('touchmove',onTouchMove,false);}}
if('ontouchstart'in document.documentElement){this.addEventListener('touchstart',onTouchStart,false);}});return this;};})(jQuery);(function(undefined){var moment,VERSION='2.9.0',globalScope=(typeof global!=='undefined'&&(typeof window==='undefined'||window===global.window))?global:this,oldGlobalMoment,round=Math.round,hasOwnProperty=Object.prototype.hasOwnProperty,i,YEAR=0,MONTH=1,DATE=2,HOUR=3,MINUTE=4,SECOND=5,MILLISECOND=6,locales={},momentProperties=[],hasModule=(typeof module!=='undefined'&&module&&module.exports),aspNetJsonRegex=/^\/?Date\((\-?\d+)/i,aspNetTimeSpanJsonRegex=/(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,isoDurationRegex=/^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,formattingTokens=/(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g,localFormattingTokens=/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,parseTokenOneOrTwoDigits=/\d\d?/,parseTokenOneToThreeDigits=/\d{1,3}/,parseTokenOneToFourDigits=/\d{1,4}/,parseTokenOneToSixDigits=/[+\-]?\d{1,6}/,parseTokenDigits=/\d+/,parseTokenWord=/[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,parseTokenTimezone=/Z|[\+\-]\d\d:?\d\d/gi,parseTokenT=/T/i,parseTokenOffsetMs=/[\+\-]?\d+/,parseTokenTimestampMs=/[\+\-]?\d+(\.\d{1,3})?/,parseTokenOneDigit=/\d/,parseTokenTwoDigits=/\d\d/,parseTokenThreeDigits=/\d{3}/,parseTokenFourDigits=/\d{4}/,parseTokenSixDigits=/[+-]?\d{6}/,parseTokenSignedNumber=/[+-]?\d+/,isoRegex=/^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,isoFormat='YYYY-MM-DDTHH:mm:ssZ',isoDates=[['YYYYYY-MM-DD',/[+-]\d{6}-\d{2}-\d{2}/],['YYYY-MM-DD',/\d{4}-\d{2}-\d{2}/],['GGGG-[W]WW-E',/\d{4}-W\d{2}-\d/],['GGGG-[W]WW',/\d{4}-W\d{2}/],['YYYY-DDD',/\d{4}-\d{3}/]],isoTimes=[['HH:mm:ss.SSSS',/(T| )\d\d:\d\d:\d\d\.\d+/],['HH:mm:ss',/(T| )\d\d:\d\d:\d\d/],['HH:mm',/(T| )\d\d:\d\d/],['HH',/(T| )\d\d/]],parseTimezoneChunker=/([\+\-]|\d\d)/gi,proxyGettersAndSetters='Date|Hours|Minutes|Seconds|Milliseconds'.split('|'),unitMillisecondFactors={'Milliseconds':1,'Seconds':1e3,'Minutes':6e4,'Hours':36e5,'Days':864e5,'Months':2592e6,'Years':31536e6},unitAliases={ms:'millisecond',s:'second',m:'minute',h:'hour',d:'day',D:'date',w:'week',W:'isoWeek',M:'month',Q:'quarter',y:'year',DDD:'dayOfYear',e:'weekday',E:'isoWeekday',gg:'weekYear',GG:'isoWeekYear'},camelFunctions={dayofyear:'dayOfYear',isoweekday:'isoWeekday',isoweek:'isoWeek',weekyear:'weekYear',isoweekyear:'isoWeekYear'},formatFunctions={},relativeTimeThresholds={s:45,m:45,h:22,d:26,M:11},ordinalizeTokens='DDD w W M D d'.split(' '),paddedTokens='M D H h m s w W'.split(' '),formatTokenFunctions={M:function(){return this.month()+1;},MMM:function(format){return this.localeData().monthsShort(this,format);},MMMM:function(format){return this.localeData().months(this,format);},D:function(){return this.date();},DDD:function(){return this.dayOfYear();},d:function(){return this.day();},dd:function(format){return this.localeData().weekdaysMin(this,format);},ddd:function(format){return this.localeData().weekdaysShort(this,format);},dddd:function(format){return this.localeData().weekdays(this,format);},w:function(){return this.week();},W:function(){return this.isoWeek();},YY:function(){return leftZeroFill(this.year()%100,2);},YYYY:function(){return leftZeroFill(this.year(),4);},YYYYY:function(){return leftZeroFill(this.year(),5);},YYYYYY:function(){var y=this.year(),sign=y>=0?'+':'-';return sign+leftZeroFill(Math.abs(y),6);},gg:function(){return leftZeroFill(this.weekYear()%100,2);},gggg:function(){return leftZeroFill(this.weekYear(),4);},ggggg:function(){return leftZeroFill(this.weekYear(),5);},GG:function(){return leftZeroFill(this.isoWeekYear()%100,2);},GGGG:function(){return leftZeroFill(this.isoWeekYear(),4);},GGGGG:function(){return leftZeroFill(this.isoWeekYear(),5);},e:function(){return this.weekday();},E:function(){return this.isoWeekday();},a:function(){return this.localeData().meridiem(this.hours(),this.minutes(),true);},A:function(){return this.localeData().meridiem(this.hours(),this.minutes(),false);},H:function(){return this.hours();},h:function(){return this.hours()%12||12;},m:function(){return this.minutes();},s:function(){return this.seconds();},S:function(){return toInt(this.milliseconds()/100);},SS:function(){return leftZeroFill(toInt(this.milliseconds()/10),2);},SSS:function(){return leftZeroFill(this.milliseconds(),3);},SSSS:function(){return leftZeroFill(this.milliseconds(),3);},Z:function(){var a=this.utcOffset(),b='+';if(a<0){a=-a;b='-';}
return b+leftZeroFill(toInt(a/60),2)+':'+leftZeroFill(toInt(a)%60,2);},ZZ:function(){var a=this.utcOffset(),b='+';if(a<0){a=-a;b='-';}
return b+leftZeroFill(toInt(a/60),2)+leftZeroFill(toInt(a)%60,2);},z:function(){return this.zoneAbbr();},zz:function(){return this.zoneName();},x:function(){return this.valueOf();},X:function(){return this.unix();},Q:function(){return this.quarter();}},deprecations={},lists=['months','monthsShort','weekdays','weekdaysShort','weekdaysMin'],updateInProgress=false;function dfl(a,b,c){switch(arguments.length){case 2:return a!=null?a:b;case 3:return a!=null?a:b!=null?b:c;default:throw new Error('Implement me');}}
function hasOwnProp(a,b){return hasOwnProperty.call(a,b);}
function defaultParsingFlags(){return{empty:false,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:false,invalidMonth:null,invalidFormat:false,userInvalidated:false,iso:false};}
function printMsg(msg){if(moment.suppressDeprecationWarnings===false&&typeof console!=='undefined'&&console.warn){console.warn('Deprecation warning: '+msg);}}
function deprecate(msg,fn){var firstTime=true;return extend(function(){if(firstTime){printMsg(msg);firstTime=false;}
return fn.apply(this,arguments);},fn);}
function deprecateSimple(name,msg){if(!deprecations[name]){printMsg(msg);deprecations[name]=true;}}
function padToken(func,count){return function(a){return leftZeroFill(func.call(this,a),count);};}
function ordinalizeToken(func,period){return function(a){return this.localeData().ordinal(func.call(this,a),period);};}
function monthDiff(a,b){var wholeMonthDiff=((b.year()-a.year())*12)+(b.month()-a.month()),anchor=a.clone().add(wholeMonthDiff,'months'),anchor2,adjust;if(b-anchor<0){anchor2=a.clone().add(wholeMonthDiff-1,'months');adjust=(b-anchor)/(anchor-anchor2);}else{anchor2=a.clone().add(wholeMonthDiff+1,'months');adjust=(b-anchor)/(anchor2-anchor);}
return-(wholeMonthDiff+adjust);}
while(ordinalizeTokens.length){i=ordinalizeTokens.pop();formatTokenFunctions[i+'o']=ordinalizeToken(formatTokenFunctions[i],i);}
while(paddedTokens.length){i=paddedTokens.pop();formatTokenFunctions[i+i]=padToken(formatTokenFunctions[i],2);}
formatTokenFunctions.DDDD=padToken(formatTokenFunctions.DDD,3);function meridiemFixWrap(locale,hour,meridiem){var isPm;if(meridiem==null){return hour;}
if(locale.meridiemHour!=null){return locale.meridiemHour(hour,meridiem);}else if(locale.isPM!=null){isPm=locale.isPM(meridiem);if(isPm&&hour<12){hour+=12;}
if(!isPm&&hour===12){hour=0;}
return hour;}else{return hour;}}
function Locale(){}
function Moment(config,skipOverflow){if(skipOverflow!==false){checkOverflow(config);}
copyConfig(this,config);this._d=new Date(+config._d);if(updateInProgress===false){updateInProgress=true;moment.updateOffset(this);updateInProgress=false;}}
function Duration(duration){var normalizedInput=normalizeObjectUnits(duration),years=normalizedInput.year||0,quarters=normalizedInput.quarter||0,months=normalizedInput.month||0,weeks=normalizedInput.week||0,days=normalizedInput.day||0,hours=normalizedInput.hour||0,minutes=normalizedInput.minute||0,seconds=normalizedInput.second||0,milliseconds=normalizedInput.millisecond||0;this._milliseconds=+milliseconds+
seconds*1e3+
minutes*6e4+
hours*36e5;this._days=+days+
weeks*7;this._months=+months+
quarters*3+
years*12;this._data={};this._locale=moment.localeData();this._bubble();}
function extend(a,b){for(var i in b){if(hasOwnProp(b,i)){a[i]=b[i];}}
if(hasOwnProp(b,'toString')){a.toString=b.toString;}
if(hasOwnProp(b,'valueOf')){a.valueOf=b.valueOf;}
return a;}
function copyConfig(to,from){var i,prop,val;if(typeof from._isAMomentObject!=='undefined'){to._isAMomentObject=from._isAMomentObject;}
if(typeof from._i!=='undefined'){to._i=from._i;}
if(typeof from._f!=='undefined'){to._f=from._f;}
if(typeof from._l!=='undefined'){to._l=from._l;}
if(typeof from._strict!=='undefined'){to._strict=from._strict;}
if(typeof from._tzm!=='undefined'){to._tzm=from._tzm;}
if(typeof from._isUTC!=='undefined'){to._isUTC=from._isUTC;}
if(typeof from._offset!=='undefined'){to._offset=from._offset;}
if(typeof from._pf!=='undefined'){to._pf=from._pf;}
if(typeof from._locale!=='undefined'){to._locale=from._locale;}
if(momentProperties.length>0){for(i in momentProperties){prop=momentProperties[i];val=from[prop];if(typeof val!=='undefined'){to[prop]=val;}}}
return to;}
function absRound(number){if(number<0){return Math.ceil(number);}else{return Math.floor(number);}}
function leftZeroFill(number,targetLength,forceSign){var output=''+Math.abs(number),sign=number>=0;while(output.length<targetLength){output='0'+output;}
return(sign?(forceSign?'+':''):'-')+output;}
function positiveMomentsDifference(base,other){var res={milliseconds:0,months:0};res.months=other.month()-base.month()+
(other.year()-base.year())*12;if(base.clone().add(res.months,'M').isAfter(other)){--res.months;}
res.milliseconds=+other-+(base.clone().add(res.months,'M'));return res;}
function momentsDifference(base,other){var res;other=makeAs(other,base);if(base.isBefore(other)){res=positiveMomentsDifference(base,other);}else{res=positiveMomentsDifference(other,base);res.milliseconds=-res.milliseconds;res.months=-res.months;}
return res;}
function createAdder(direction,name){return function(val,period){var dur,tmp;if(period!==null&&!isNaN(+period)){deprecateSimple(name,'moment().'+name+'(period, number) is deprecated. Please use moment().'+name+'(number, period).');tmp=val;val=period;period=tmp;}
val=typeof val==='string'?+val:val;dur=moment.duration(val,period);addOrSubtractDurationFromMoment(this,dur,direction);return this;};}
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
function normalizeObjectUnits(inputObject){var normalizedInput={},normalizedProp,prop;for(prop in inputObject){if(hasOwnProp(inputObject,prop)){normalizedProp=normalizeUnits(prop);if(normalizedProp){normalizedInput[normalizedProp]=inputObject[prop];}}}
return normalizedInput;}
function makeList(field){var count,setter;if(field.indexOf('week')===0){count=7;setter='day';}
else if(field.indexOf('month')===0){count=12;setter='month';}
else{return;}
moment[field]=function(format,index){var i,getter,method=moment._locale[field],results=[];if(typeof format==='number'){index=format;format=undefined;}
getter=function(i){var m=moment().utc().set(setter,i);return method.call(moment._locale,m,format||'');};if(index!=null){return getter(index);}
else{for(i=0;i<count;i++){results.push(getter(i));}
return results;}};}
function toInt(argumentForCoercion){var coercedNumber=+argumentForCoercion,value=0;if(coercedNumber!==0&&isFinite(coercedNumber)){if(coercedNumber>=0){value=Math.floor(coercedNumber);}else{value=Math.ceil(coercedNumber);}}
return value;}
function daysInMonth(year,month){return new Date(Date.UTC(year,month+1,0)).getUTCDate();}
function weeksInYear(year,dow,doy){return weekOfYear(moment([year,11,31+dow-doy]),dow,doy).week;}
function daysInYear(year){return isLeapYear(year)?366:365;}
function isLeapYear(year){return(year%4===0&&year%100!==0)||year%400===0;}
function checkOverflow(m){var overflow;if(m._a&&m._pf.overflow===-2){overflow=m._a[MONTH]<0||m._a[MONTH]>11?MONTH:m._a[DATE]<1||m._a[DATE]>daysInMonth(m._a[YEAR],m._a[MONTH])?DATE:m._a[HOUR]<0||m._a[HOUR]>24||(m._a[HOUR]===24&&(m._a[MINUTE]!==0||m._a[SECOND]!==0||m._a[MILLISECOND]!==0))?HOUR:m._a[MINUTE]<0||m._a[MINUTE]>59?MINUTE:m._a[SECOND]<0||m._a[SECOND]>59?SECOND:m._a[MILLISECOND]<0||m._a[MILLISECOND]>999?MILLISECOND:-1;if(m._pf._overflowDayOfYear&&(overflow<YEAR||overflow>DATE)){overflow=DATE;}
m._pf.overflow=overflow;}}
function isValid(m){if(m._isValid==null){m._isValid=!isNaN(m._d.getTime())&&m._pf.overflow<0&&!m._pf.empty&&!m._pf.invalidMonth&&!m._pf.nullInput&&!m._pf.invalidFormat&&!m._pf.userInvalidated;if(m._strict){m._isValid=m._isValid&&m._pf.charsLeftOver===0&&m._pf.unusedTokens.length===0&&m._pf.bigHour===undefined;}}
return m._isValid;}
function normalizeLocale(key){return key?key.toLowerCase().replace('_','-'):key;}
function chooseLocale(names){var i=0,j,next,locale,split;while(i<names.length){split=normalizeLocale(names[i]).split('-');j=split.length;next=normalizeLocale(names[i+1]);next=next?next.split('-'):null;while(j>0){locale=loadLocale(split.slice(0,j).join('-'));if(locale){return locale;}
if(next&&next.length>=j&&compareArrays(split,next,true)>=j-1){break;}
j--;}
i++;}
return null;}
function loadLocale(name){var oldLocale=null;if(!locales[name]&&hasModule){try{oldLocale=moment.locale();require('./locale/'+name);moment.locale(oldLocale);}catch(e){}}
return locales[name];}
function makeAs(input,model){var res,diff;if(model._isUTC){res=model.clone();diff=(moment.isMoment(input)||isDate(input)?+input:+moment(input))-(+res);res._d.setTime(+res._d+diff);moment.updateOffset(res,false);return res;}else{return moment(input).local();}}
extend(Locale.prototype,{set:function(config){var prop,i;for(i in config){prop=config[i];if(typeof prop==='function'){this[i]=prop;}else{this['_'+i]=prop;}}
this._ordinalParseLenient=new RegExp(this._ordinalParse.source+'|'+/\d{1,2}/.source);},_months:'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),months:function(m){return this._months[m.month()];},_monthsShort:'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),monthsShort:function(m){return this._monthsShort[m.month()];},monthsParse:function(monthName,format,strict){var i,mom,regex;if(!this._monthsParse){this._monthsParse=[];this._longMonthsParse=[];this._shortMonthsParse=[];}
for(i=0;i<12;i++){mom=moment.utc([2000,i]);if(strict&&!this._longMonthsParse[i]){this._longMonthsParse[i]=new RegExp('^'+this.months(mom,'').replace('.','')+'$','i');this._shortMonthsParse[i]=new RegExp('^'+this.monthsShort(mom,'').replace('.','')+'$','i');}
if(!strict&&!this._monthsParse[i]){regex='^'+this.months(mom,'')+'|^'+this.monthsShort(mom,'');this._monthsParse[i]=new RegExp(regex.replace('.',''),'i');}
if(strict&&format==='MMMM'&&this._longMonthsParse[i].test(monthName)){return i;}else if(strict&&format==='MMM'&&this._shortMonthsParse[i].test(monthName)){return i;}else if(!strict&&this._monthsParse[i].test(monthName)){return i;}}},_weekdays:'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),weekdays:function(m){return this._weekdays[m.day()];},_weekdaysShort:'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),weekdaysShort:function(m){return this._weekdaysShort[m.day()];},_weekdaysMin:'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),weekdaysMin:function(m){return this._weekdaysMin[m.day()];},weekdaysParse:function(weekdayName){var i,mom,regex;if(!this._weekdaysParse){this._weekdaysParse=[];}
for(i=0;i<7;i++){if(!this._weekdaysParse[i]){mom=moment([2000,1]).day(i);regex='^'+this.weekdays(mom,'')+'|^'+this.weekdaysShort(mom,'')+'|^'+this.weekdaysMin(mom,'');this._weekdaysParse[i]=new RegExp(regex.replace('.',''),'i');}
if(this._weekdaysParse[i].test(weekdayName)){return i;}}},_longDateFormat:{LTS:'h:mm:ss A',LT:'h:mm A',L:'MM/DD/YYYY',LL:'MMMM D, YYYY',LLL:'MMMM D, YYYY LT',LLLL:'dddd, MMMM D, YYYY LT'},longDateFormat:function(key){var output=this._longDateFormat[key];if(!output&&this._longDateFormat[key.toUpperCase()]){output=this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g,function(val){return val.slice(1);});this._longDateFormat[key]=output;}
return output;},isPM:function(input){return((input+'').toLowerCase().charAt(0)==='p');},_meridiemParse:/[ap]\.?m?\.?/i,meridiem:function(hours,minutes,isLower){if(hours>11){return isLower?'pm':'PM';}else{return isLower?'am':'AM';}},_calendar:{sameDay:'[Today at] LT',nextDay:'[Tomorrow at] LT',nextWeek:'dddd [at] LT',lastDay:'[Yesterday at] LT',lastWeek:'[Last] dddd [at] LT',sameElse:'L'},calendar:function(key,mom,now){var output=this._calendar[key];return typeof output==='function'?output.apply(mom,[now]):output;},_relativeTime:{future:'in %s',past:'%s ago',s:'a few seconds',m:'a minute',mm:'%d minutes',h:'an hour',hh:'%d hours',d:'a day',dd:'%d days',M:'a month',MM:'%d months',y:'a year',yy:'%d years'},relativeTime:function(number,withoutSuffix,string,isFuture){var output=this._relativeTime[string];return(typeof output==='function')?output(number,withoutSuffix,string,isFuture):output.replace(/%d/i,number);},pastFuture:function(diff,output){var format=this._relativeTime[diff>0?'future':'past'];return typeof format==='function'?format(output):format.replace(/%s/i,output);},ordinal:function(number){return this._ordinal.replace('%d',number);},_ordinal:'%d',_ordinalParse:/\d{1,2}/,preparse:function(string){return string;},postformat:function(string){return string;},week:function(mom){return weekOfYear(mom,this._week.dow,this._week.doy).week;},_week:{dow:0,doy:6},firstDayOfWeek:function(){return this._week.dow;},firstDayOfYear:function(){return this._week.doy;},_invalidDate:'Invalid date',invalidDate:function(){return this._invalidDate;}});function removeFormattingTokens(input){if(input.match(/\[[\s\S]/)){return input.replace(/^\[|\]$/g,'');}
return input.replace(/\\/g,'');}
function makeFormatFunction(format){var array=format.match(formattingTokens),i,length;for(i=0,length=array.length;i<length;i++){if(formatTokenFunctions[array[i]]){array[i]=formatTokenFunctions[array[i]];}else{array[i]=removeFormattingTokens(array[i]);}}
return function(mom){var output='';for(i=0;i<length;i++){output+=array[i]instanceof Function?array[i].call(mom,format):array[i];}
return output;};}
function formatMoment(m,format){if(!m.isValid()){return m.localeData().invalidDate();}
format=expandFormat(format,m.localeData());if(!formatFunctions[format]){formatFunctions[format]=makeFormatFunction(format);}
return formatFunctions[format](m);}
function expandFormat(format,locale){var i=5;function replaceLongDateFormatTokens(input){return locale.longDateFormat(input)||input;}
localFormattingTokens.lastIndex=0;while(i>=0&&localFormattingTokens.test(format)){format=format.replace(localFormattingTokens,replaceLongDateFormatTokens);localFormattingTokens.lastIndex=0;i-=1;}
return format;}
function getParseRegexForToken(token,config){var a,strict=config._strict;switch(token){case'Q':return parseTokenOneDigit;case'DDDD':return parseTokenThreeDigits;case'YYYY':case'GGGG':case'gggg':return strict?parseTokenFourDigits:parseTokenOneToFourDigits;case'Y':case'G':case'g':return parseTokenSignedNumber;case'YYYYYY':case'YYYYY':case'GGGGG':case'ggggg':return strict?parseTokenSixDigits:parseTokenOneToSixDigits;case'S':if(strict){return parseTokenOneDigit;}
case'SS':if(strict){return parseTokenTwoDigits;}
case'SSS':if(strict){return parseTokenThreeDigits;}
case'DDD':return parseTokenOneToThreeDigits;case'MMM':case'MMMM':case'dd':case'ddd':case'dddd':return parseTokenWord;case'a':case'A':return config._locale._meridiemParse;case'x':return parseTokenOffsetMs;case'X':return parseTokenTimestampMs;case'Z':case'ZZ':return parseTokenTimezone;case'T':return parseTokenT;case'SSSS':return parseTokenDigits;case'MM':case'DD':case'YY':case'GG':case'gg':case'HH':case'hh':case'mm':case'ss':case'ww':case'WW':return strict?parseTokenTwoDigits:parseTokenOneOrTwoDigits;case'M':case'D':case'd':case'H':case'h':case'm':case's':case'w':case'W':case'e':case'E':return parseTokenOneOrTwoDigits;case'Do':return strict?config._locale._ordinalParse:config._locale._ordinalParseLenient;default:a=new RegExp(regexpEscape(unescapeFormat(token.replace('\\','')),'i'));return a;}}
function utcOffsetFromString(string){string=string||'';var possibleTzMatches=(string.match(parseTokenTimezone)||[]),tzChunk=possibleTzMatches[possibleTzMatches.length-1]||[],parts=(tzChunk+'').match(parseTimezoneChunker)||['-',0,0],minutes=+(parts[1]*60)+toInt(parts[2]);return parts[0]==='+'?minutes:-minutes;}
function addTimeToArrayFromToken(token,input,config){var a,datePartArray=config._a;switch(token){case'Q':if(input!=null){datePartArray[MONTH]=(toInt(input)-1)*3;}
break;case'M':case'MM':if(input!=null){datePartArray[MONTH]=toInt(input)-1;}
break;case'MMM':case'MMMM':a=config._locale.monthsParse(input,token,config._strict);if(a!=null){datePartArray[MONTH]=a;}else{config._pf.invalidMonth=input;}
break;case'D':case'DD':if(input!=null){datePartArray[DATE]=toInt(input);}
break;case'Do':if(input!=null){datePartArray[DATE]=toInt(parseInt(input.match(/\d{1,2}/)[0],10));}
break;case'DDD':case'DDDD':if(input!=null){config._dayOfYear=toInt(input);}
break;case'YY':datePartArray[YEAR]=moment.parseTwoDigitYear(input);break;case'YYYY':case'YYYYY':case'YYYYYY':datePartArray[YEAR]=toInt(input);break;case'a':case'A':config._meridiem=input;break;case'h':case'hh':config._pf.bigHour=true;case'H':case'HH':datePartArray[HOUR]=toInt(input);break;case'm':case'mm':datePartArray[MINUTE]=toInt(input);break;case's':case'ss':datePartArray[SECOND]=toInt(input);break;case'S':case'SS':case'SSS':case'SSSS':datePartArray[MILLISECOND]=toInt(('0.'+input)*1000);break;case'x':config._d=new Date(toInt(input));break;case'X':config._d=new Date(parseFloat(input)*1000);break;case'Z':case'ZZ':config._useUTC=true;config._tzm=utcOffsetFromString(input);break;case'dd':case'ddd':case'dddd':a=config._locale.weekdaysParse(input);if(a!=null){config._w=config._w||{};config._w['d']=a;}else{config._pf.invalidWeekday=input;}
break;case'w':case'ww':case'W':case'WW':case'd':case'e':case'E':token=token.substr(0,1);case'gggg':case'GGGG':case'GGGGG':token=token.substr(0,2);if(input){config._w=config._w||{};config._w[token]=toInt(input);}
break;case'gg':case'GG':config._w=config._w||{};config._w[token]=moment.parseTwoDigitYear(input);}}
function dayOfYearFromWeekInfo(config){var w,weekYear,week,weekday,dow,doy,temp;w=config._w;if(w.GG!=null||w.W!=null||w.E!=null){dow=1;doy=4;weekYear=dfl(w.GG,config._a[YEAR],weekOfYear(moment(),1,4).year);week=dfl(w.W,1);weekday=dfl(w.E,1);}else{dow=config._locale._week.dow;doy=config._locale._week.doy;weekYear=dfl(w.gg,config._a[YEAR],weekOfYear(moment(),dow,doy).year);week=dfl(w.w,1);if(w.d!=null){weekday=w.d;if(weekday<dow){++week;}}else if(w.e!=null){weekday=w.e+dow;}else{weekday=dow;}}
temp=dayOfYearFromWeeks(weekYear,week,weekday,doy,dow);config._a[YEAR]=temp.year;config._dayOfYear=temp.dayOfYear;}
function dateFromConfig(config){var i,date,input=[],currentDate,yearToUse;if(config._d){return;}
currentDate=currentDateArray(config);if(config._w&&config._a[DATE]==null&&config._a[MONTH]==null){dayOfYearFromWeekInfo(config);}
if(config._dayOfYear){yearToUse=dfl(config._a[YEAR],currentDate[YEAR]);if(config._dayOfYear>daysInYear(yearToUse)){config._pf._overflowDayOfYear=true;}
date=makeUTCDate(yearToUse,0,config._dayOfYear);config._a[MONTH]=date.getUTCMonth();config._a[DATE]=date.getUTCDate();}
for(i=0;i<3&&config._a[i]==null;++i){config._a[i]=input[i]=currentDate[i];}
for(;i<7;i++){config._a[i]=input[i]=(config._a[i]==null)?(i===2?1:0):config._a[i];}
if(config._a[HOUR]===24&&config._a[MINUTE]===0&&config._a[SECOND]===0&&config._a[MILLISECOND]===0){config._nextDay=true;config._a[HOUR]=0;}
config._d=(config._useUTC?makeUTCDate:makeDate).apply(null,input);if(config._tzm!=null){config._d.setUTCMinutes(config._d.getUTCMinutes()-config._tzm);}
if(config._nextDay){config._a[HOUR]=24;}}
function dateFromObject(config){var normalizedInput;if(config._d){return;}
normalizedInput=normalizeObjectUnits(config._i);config._a=[normalizedInput.year,normalizedInput.month,normalizedInput.day||normalizedInput.date,normalizedInput.hour,normalizedInput.minute,normalizedInput.second,normalizedInput.millisecond];dateFromConfig(config);}
function currentDateArray(config){var now=new Date();if(config._useUTC){return[now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()];}else{return[now.getFullYear(),now.getMonth(),now.getDate()];}}
function makeDateFromStringAndFormat(config){if(config._f===moment.ISO_8601){parseISO(config);return;}
config._a=[];config._pf.empty=true;var string=''+config._i,i,parsedInput,tokens,token,skipped,stringLength=string.length,totalParsedInputLength=0;tokens=expandFormat(config._f,config._locale).match(formattingTokens)||[];for(i=0;i<tokens.length;i++){token=tokens[i];parsedInput=(string.match(getParseRegexForToken(token,config))||[])[0];if(parsedInput){skipped=string.substr(0,string.indexOf(parsedInput));if(skipped.length>0){config._pf.unusedInput.push(skipped);}
string=string.slice(string.indexOf(parsedInput)+parsedInput.length);totalParsedInputLength+=parsedInput.length;}
if(formatTokenFunctions[token]){if(parsedInput){config._pf.empty=false;}
else{config._pf.unusedTokens.push(token);}
addTimeToArrayFromToken(token,parsedInput,config);}
else if(config._strict&&!parsedInput){config._pf.unusedTokens.push(token);}}
config._pf.charsLeftOver=stringLength-totalParsedInputLength;if(string.length>0){config._pf.unusedInput.push(string);}
if(config._pf.bigHour===true&&config._a[HOUR]<=12){config._pf.bigHour=undefined;}
config._a[HOUR]=meridiemFixWrap(config._locale,config._a[HOUR],config._meridiem);dateFromConfig(config);checkOverflow(config);}
function unescapeFormat(s){return s.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,function(matched,p1,p2,p3,p4){return p1||p2||p3||p4;});}
function regexpEscape(s){return s.replace(/[-\/\\^$*+?.()|[\]{}]/g,'\\$&');}
function makeDateFromStringAndArray(config){var tempConfig,bestMoment,scoreToBeat,i,currentScore;if(config._f.length===0){config._pf.invalidFormat=true;config._d=new Date(NaN);return;}
for(i=0;i<config._f.length;i++){currentScore=0;tempConfig=copyConfig({},config);if(config._useUTC!=null){tempConfig._useUTC=config._useUTC;}
tempConfig._pf=defaultParsingFlags();tempConfig._f=config._f[i];makeDateFromStringAndFormat(tempConfig);if(!isValid(tempConfig)){continue;}
currentScore+=tempConfig._pf.charsLeftOver;currentScore+=tempConfig._pf.unusedTokens.length*10;tempConfig._pf.score=currentScore;if(scoreToBeat==null||currentScore<scoreToBeat){scoreToBeat=currentScore;bestMoment=tempConfig;}}
extend(config,bestMoment||tempConfig);}
function parseISO(config){var i,l,string=config._i,match=isoRegex.exec(string);if(match){config._pf.iso=true;for(i=0,l=isoDates.length;i<l;i++){if(isoDates[i][1].exec(string)){config._f=isoDates[i][0]+(match[6]||' ');break;}}
for(i=0,l=isoTimes.length;i<l;i++){if(isoTimes[i][1].exec(string)){config._f+=isoTimes[i][0];break;}}
if(string.match(parseTokenTimezone)){config._f+='Z';}
makeDateFromStringAndFormat(config);}else{config._isValid=false;}}
function makeDateFromString(config){parseISO(config);if(config._isValid===false){delete config._isValid;moment.createFromInputFallback(config);}}
function map(arr,fn){var res=[],i;for(i=0;i<arr.length;++i){res.push(fn(arr[i],i));}
return res;}
function makeDateFromInput(config){var input=config._i,matched;if(input===undefined){config._d=new Date();}else if(isDate(input)){config._d=new Date(+input);}else if((matched=aspNetJsonRegex.exec(input))!==null){config._d=new Date(+matched[1]);}else if(typeof input==='string'){makeDateFromString(config);}else if(isArray(input)){config._a=map(input.slice(0),function(obj){return parseInt(obj,10);});dateFromConfig(config);}else if(typeof(input)==='object'){dateFromObject(config);}else if(typeof(input)==='number'){config._d=new Date(input);}else{moment.createFromInputFallback(config);}}
function makeDate(y,m,d,h,M,s,ms){var date=new Date(y,m,d,h,M,s,ms);if(y<1970){date.setFullYear(y);}
return date;}
function makeUTCDate(y){var date=new Date(Date.UTC.apply(null,arguments));if(y<1970){date.setUTCFullYear(y);}
return date;}
function parseWeekday(input,locale){if(typeof input==='string'){if(!isNaN(input)){input=parseInt(input,10);}
else{input=locale.weekdaysParse(input);if(typeof input!=='number'){return null;}}}
return input;}
function substituteTimeAgo(string,number,withoutSuffix,isFuture,locale){return locale.relativeTime(number||1,!!withoutSuffix,string,isFuture);}
function relativeTime(posNegDuration,withoutSuffix,locale){var duration=moment.duration(posNegDuration).abs(),seconds=round(duration.as('s')),minutes=round(duration.as('m')),hours=round(duration.as('h')),days=round(duration.as('d')),months=round(duration.as('M')),years=round(duration.as('y')),args=seconds<relativeTimeThresholds.s&&['s',seconds]||minutes===1&&['m']||minutes<relativeTimeThresholds.m&&['mm',minutes]||hours===1&&['h']||hours<relativeTimeThresholds.h&&['hh',hours]||days===1&&['d']||days<relativeTimeThresholds.d&&['dd',days]||months===1&&['M']||months<relativeTimeThresholds.M&&['MM',months]||years===1&&['y']||['yy',years];args[2]=withoutSuffix;args[3]=+posNegDuration>0;args[4]=locale;return substituteTimeAgo.apply({},args);}
function weekOfYear(mom,firstDayOfWeek,firstDayOfWeekOfYear){var end=firstDayOfWeekOfYear-firstDayOfWeek,daysToDayOfWeek=firstDayOfWeekOfYear-mom.day(),adjustedMoment;if(daysToDayOfWeek>end){daysToDayOfWeek-=7;}
if(daysToDayOfWeek<end-7){daysToDayOfWeek+=7;}
adjustedMoment=moment(mom).add(daysToDayOfWeek,'d');return{week:Math.ceil(adjustedMoment.dayOfYear()/7),year:adjustedMoment.year()};}
function dayOfYearFromWeeks(year,week,weekday,firstDayOfWeekOfYear,firstDayOfWeek){var d=makeUTCDate(year,0,1).getUTCDay(),daysToAdd,dayOfYear;d=d===0?7:d;weekday=weekday!=null?weekday:firstDayOfWeek;daysToAdd=firstDayOfWeek-d+(d>firstDayOfWeekOfYear?7:0)-(d<firstDayOfWeek?7:0);dayOfYear=7*(week-1)+(weekday-firstDayOfWeek)+daysToAdd+1;return{year:dayOfYear>0?year:year-1,dayOfYear:dayOfYear>0?dayOfYear:daysInYear(year-1)+dayOfYear};}
function makeMoment(config){var input=config._i,format=config._f,res;config._locale=config._locale||moment.localeData(config._l);if(input===null||(format===undefined&&input==='')){return moment.invalid({nullInput:true});}
if(typeof input==='string'){config._i=input=config._locale.preparse(input);}
if(moment.isMoment(input)){return new Moment(input,true);}else if(format){if(isArray(format)){makeDateFromStringAndArray(config);}else{makeDateFromStringAndFormat(config);}}else{makeDateFromInput(config);}
res=new Moment(config);if(res._nextDay){res.add(1,'d');res._nextDay=undefined;}
return res;}
moment=function(input,format,locale,strict){var c;if(typeof(locale)==='boolean'){strict=locale;locale=undefined;}
c={};c._isAMomentObject=true;c._i=input;c._f=format;c._l=locale;c._strict=strict;c._isUTC=false;c._pf=defaultParsingFlags();return makeMoment(c);};moment.suppressDeprecationWarnings=false;moment.createFromInputFallback=deprecate('moment construction falls back to js Date. This is '+'discouraged and will be removed in upcoming major '+'release. Please refer to '+'https://github.com/moment/moment/issues/1407 for more info.',function(config){config._d=new Date(config._i+(config._useUTC?' UTC':''));});function pickBy(fn,moments){var res,i;if(moments.length===1&&isArray(moments[0])){moments=moments[0];}
if(!moments.length){return moment();}
res=moments[0];for(i=1;i<moments.length;++i){if(moments[i][fn](res)){res=moments[i];}}
return res;}
moment.min=function(){var args=[].slice.call(arguments,0);return pickBy('isBefore',args);};moment.max=function(){var args=[].slice.call(arguments,0);return pickBy('isAfter',args);};moment.utc=function(input,format,locale,strict){var c;if(typeof(locale)==='boolean'){strict=locale;locale=undefined;}
c={};c._isAMomentObject=true;c._useUTC=true;c._isUTC=true;c._l=locale;c._i=input;c._f=format;c._strict=strict;c._pf=defaultParsingFlags();return makeMoment(c).utc();};moment.unix=function(input){return moment(input*1000);};moment.duration=function(input,key){var duration=input,match=null,sign,ret,parseIso,diffRes;if(moment.isDuration(input)){duration={ms:input._milliseconds,d:input._days,M:input._months};}else if(typeof input==='number'){duration={};if(key){duration[key]=input;}else{duration.milliseconds=input;}}else if(!!(match=aspNetTimeSpanJsonRegex.exec(input))){sign=(match[1]==='-')?-1:1;duration={y:0,d:toInt(match[DATE])*sign,h:toInt(match[HOUR])*sign,m:toInt(match[MINUTE])*sign,s:toInt(match[SECOND])*sign,ms:toInt(match[MILLISECOND])*sign};}else if(!!(match=isoDurationRegex.exec(input))){sign=(match[1]==='-')?-1:1;parseIso=function(inp){var res=inp&&parseFloat(inp.replace(',','.'));return(isNaN(res)?0:res)*sign;};duration={y:parseIso(match[2]),M:parseIso(match[3]),d:parseIso(match[4]),h:parseIso(match[5]),m:parseIso(match[6]),s:parseIso(match[7]),w:parseIso(match[8])};}else if(duration==null){duration={};}else if(typeof duration==='object'&&('from'in duration||'to'in duration)){diffRes=momentsDifference(moment(duration.from),moment(duration.to));duration={};duration.ms=diffRes.milliseconds;duration.M=diffRes.months;}
ret=new Duration(duration);if(moment.isDuration(input)&&hasOwnProp(input,'_locale')){ret._locale=input._locale;}
return ret;};moment.version=VERSION;moment.defaultFormat=isoFormat;moment.ISO_8601=function(){};moment.momentProperties=momentProperties;moment.updateOffset=function(){};moment.relativeTimeThreshold=function(threshold,limit){if(relativeTimeThresholds[threshold]===undefined){return false;}
if(limit===undefined){return relativeTimeThresholds[threshold];}
relativeTimeThresholds[threshold]=limit;return true;};moment.lang=deprecate('moment.lang is deprecated. Use moment.locale instead.',function(key,value){return moment.locale(key,value);});moment.locale=function(key,values){var data;if(key){if(typeof(values)!=='undefined'){data=moment.defineLocale(key,values);}
else{data=moment.localeData(key);}
if(data){moment.duration._locale=moment._locale=data;}}
return moment._locale._abbr;};moment.defineLocale=function(name,values){if(values!==null){values.abbr=name;if(!locales[name]){locales[name]=new Locale();}
locales[name].set(values);moment.locale(name);return locales[name];}else{delete locales[name];return null;}};moment.langData=deprecate('moment.langData is deprecated. Use moment.localeData instead.',function(key){return moment.localeData(key);});moment.localeData=function(key){var locale;if(key&&key._locale&&key._locale._abbr){key=key._locale._abbr;}
if(!key){return moment._locale;}
if(!isArray(key)){locale=loadLocale(key);if(locale){return locale;}
key=[key];}
return chooseLocale(key);};moment.isMoment=function(obj){return obj instanceof Moment||(obj!=null&&hasOwnProp(obj,'_isAMomentObject'));};moment.isDuration=function(obj){return obj instanceof Duration;};for(i=lists.length-1;i>=0;--i){makeList(lists[i]);}
moment.normalizeUnits=function(units){return normalizeUnits(units);};moment.invalid=function(flags){var m=moment.utc(NaN);if(flags!=null){extend(m._pf,flags);}
else{m._pf.userInvalidated=true;}
return m;};moment.parseZone=function(){return moment.apply(null,arguments).parseZone();};moment.parseTwoDigitYear=function(input){return toInt(input)+(toInt(input)>68?1900:2000);};moment.isDate=isDate;extend(moment.fn=Moment.prototype,{clone:function(){return moment(this);},valueOf:function(){return+this._d-((this._offset||0)*60000);},unix:function(){return Math.floor(+this/1000);},toString:function(){return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');},toDate:function(){return this._offset?new Date(+this):this._d;},toISOString:function(){var m=moment(this).utc();if(0<m.year()&&m.year()<=9999){if('function'===typeof Date.prototype.toISOString){return this.toDate().toISOString();}else{return formatMoment(m,'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');}}else{return formatMoment(m,'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');}},toArray:function(){var m=this;return[m.year(),m.month(),m.date(),m.hours(),m.minutes(),m.seconds(),m.milliseconds()];},isValid:function(){return isValid(this);},isDSTShifted:function(){if(this._a){return this.isValid()&&compareArrays(this._a,(this._isUTC?moment.utc(this._a):moment(this._a)).toArray())>0;}
return false;},parsingFlags:function(){return extend({},this._pf);},invalidAt:function(){return this._pf.overflow;},utc:function(keepLocalTime){return this.utcOffset(0,keepLocalTime);},local:function(keepLocalTime){if(this._isUTC){this.utcOffset(0,keepLocalTime);this._isUTC=false;if(keepLocalTime){this.subtract(this._dateUtcOffset(),'m');}}
return this;},format:function(inputString){var output=formatMoment(this,inputString||moment.defaultFormat);return this.localeData().postformat(output);},add:createAdder(1,'add'),subtract:createAdder(-1,'subtract'),diff:function(input,units,asFloat){var that=makeAs(input,this),zoneDiff=(that.utcOffset()-this.utcOffset())*6e4,anchor,diff,output,daysAdjust;units=normalizeUnits(units);if(units==='year'||units==='month'||units==='quarter'){output=monthDiff(this,that);if(units==='quarter'){output=output/3;}else if(units==='year'){output=output/12;}}else{diff=this-that;output=units==='second'?diff/1e3:units==='minute'?diff/6e4:units==='hour'?diff/36e5:units==='day'?(diff-zoneDiff)/864e5:units==='week'?(diff-zoneDiff)/6048e5:diff;}
return asFloat?output:absRound(output);},from:function(time,withoutSuffix){return moment.duration({to:this,from:time}).locale(this.locale()).humanize(!withoutSuffix);},fromNow:function(withoutSuffix){return this.from(moment(),withoutSuffix);},calendar:function(time){var now=time||moment(),sod=makeAs(now,this).startOf('day'),diff=this.diff(sod,'days',true),format=diff<-6?'sameElse':diff<-1?'lastWeek':diff<0?'lastDay':diff<1?'sameDay':diff<2?'nextDay':diff<7?'nextWeek':'sameElse';return this.format(this.localeData().calendar(format,this,moment(now)));},isLeapYear:function(){return isLeapYear(this.year());},isDST:function(){return(this.utcOffset()>this.clone().month(0).utcOffset()||this.utcOffset()>this.clone().month(5).utcOffset());},day:function(input){var day=this._isUTC?this._d.getUTCDay():this._d.getDay();if(input!=null){input=parseWeekday(input,this.localeData());return this.add(input-day,'d');}else{return day;}},month:makeAccessor('Month',true),startOf:function(units){units=normalizeUnits(units);switch(units){case'year':this.month(0);case'quarter':case'month':this.date(1);case'week':case'isoWeek':case'day':this.hours(0);case'hour':this.minutes(0);case'minute':this.seconds(0);case'second':this.milliseconds(0);}
if(units==='week'){this.weekday(0);}else if(units==='isoWeek'){this.isoWeekday(1);}
if(units==='quarter'){this.month(Math.floor(this.month()/3)*3);}
return this;},endOf:function(units){units=normalizeUnits(units);if(units===undefined||units==='millisecond'){return this;}
return this.startOf(units).add(1,(units==='isoWeek'?'week':units)).subtract(1,'ms');},isAfter:function(input,units){var inputMs;units=normalizeUnits(typeof units!=='undefined'?units:'millisecond');if(units==='millisecond'){input=moment.isMoment(input)?input:moment(input);return+this>+input;}else{inputMs=moment.isMoment(input)?+input:+moment(input);return inputMs<+this.clone().startOf(units);}},isBefore:function(input,units){var inputMs;units=normalizeUnits(typeof units!=='undefined'?units:'millisecond');if(units==='millisecond'){input=moment.isMoment(input)?input:moment(input);return+this<+input;}else{inputMs=moment.isMoment(input)?+input:+moment(input);return+this.clone().endOf(units)<inputMs;}},isBetween:function(from,to,units){return this.isAfter(from,units)&&this.isBefore(to,units);},isSame:function(input,units){var inputMs;units=normalizeUnits(units||'millisecond');if(units==='millisecond'){input=moment.isMoment(input)?input:moment(input);return+this===+input;}else{inputMs=+moment(input);return+(this.clone().startOf(units))<=inputMs&&inputMs<=+(this.clone().endOf(units));}},min:deprecate('moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',function(other){other=moment.apply(null,arguments);return other<this?this:other;}),max:deprecate('moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',function(other){other=moment.apply(null,arguments);return other>this?this:other;}),zone:deprecate('moment().zone is deprecated, use moment().utcOffset instead. '+'https://github.com/moment/moment/issues/1779',function(input,keepLocalTime){if(input!=null){if(typeof input!=='string'){input=-input;}
this.utcOffset(input,keepLocalTime);return this;}else{return-this.utcOffset();}}),utcOffset:function(input,keepLocalTime){var offset=this._offset||0,localAdjust;if(input!=null){if(typeof input==='string'){input=utcOffsetFromString(input);}
if(Math.abs(input)<16){input=input*60;}
if(!this._isUTC&&keepLocalTime){localAdjust=this._dateUtcOffset();}
this._offset=input;this._isUTC=true;if(localAdjust!=null){this.add(localAdjust,'m');}
if(offset!==input){if(!keepLocalTime||this._changeInProgress){addOrSubtractDurationFromMoment(this,moment.duration(input-offset,'m'),1,false);}else if(!this._changeInProgress){this._changeInProgress=true;moment.updateOffset(this,true);this._changeInProgress=null;}}
return this;}else{return this._isUTC?offset:this._dateUtcOffset();}},isLocal:function(){return!this._isUTC;},isUtcOffset:function(){return this._isUTC;},isUtc:function(){return this._isUTC&&this._offset===0;},zoneAbbr:function(){return this._isUTC?'UTC':'';},zoneName:function(){return this._isUTC?'Coordinated Universal Time':'';},parseZone:function(){if(this._tzm){this.utcOffset(this._tzm);}else if(typeof this._i==='string'){this.utcOffset(utcOffsetFromString(this._i));}
return this;},hasAlignedHourOffset:function(input){if(!input){input=0;}
else{input=moment(input).utcOffset();}
return(this.utcOffset()-input)%60===0;},daysInMonth:function(){return daysInMonth(this.year(),this.month());},dayOfYear:function(input){var dayOfYear=round((moment(this).startOf('day')-moment(this).startOf('year'))/864e5)+1;return input==null?dayOfYear:this.add((input-dayOfYear),'d');},quarter:function(input){return input==null?Math.ceil((this.month()+1)/3):this.month((input-1)*3+this.month()%3);},weekYear:function(input){var year=weekOfYear(this,this.localeData()._week.dow,this.localeData()._week.doy).year;return input==null?year:this.add((input-year),'y');},isoWeekYear:function(input){var year=weekOfYear(this,1,4).year;return input==null?year:this.add((input-year),'y');},week:function(input){var week=this.localeData().week(this);return input==null?week:this.add((input-week)*7,'d');},isoWeek:function(input){var week=weekOfYear(this,1,4).week;return input==null?week:this.add((input-week)*7,'d');},weekday:function(input){var weekday=(this.day()+7-this.localeData()._week.dow)%7;return input==null?weekday:this.add(input-weekday,'d');},isoWeekday:function(input){return input==null?this.day()||7:this.day(this.day()%7?input:input-7);},isoWeeksInYear:function(){return weeksInYear(this.year(),1,4);},weeksInYear:function(){var weekInfo=this.localeData()._week;return weeksInYear(this.year(),weekInfo.dow,weekInfo.doy);},get:function(units){units=normalizeUnits(units);return this[units]();},set:function(units,value){var unit;if(typeof units==='object'){for(unit in units){this.set(unit,units[unit]);}}
else{units=normalizeUnits(units);if(typeof this[units]==='function'){this[units](value);}}
return this;},locale:function(key){var newLocaleData;if(key===undefined){return this._locale._abbr;}else{newLocaleData=moment.localeData(key);if(newLocaleData!=null){this._locale=newLocaleData;}
return this;}},lang:deprecate('moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',function(key){if(key===undefined){return this.localeData();}else{return this.locale(key);}}),localeData:function(){return this._locale;},_dateUtcOffset:function(){return-Math.round(this._d.getTimezoneOffset()/15)*15;}});function rawMonthSetter(mom,value){var dayOfMonth;if(typeof value==='string'){value=mom.localeData().monthsParse(value);if(typeof value!=='number'){return mom;}}
dayOfMonth=Math.min(mom.date(),daysInMonth(mom.year(),value));mom._d['set'+(mom._isUTC?'UTC':'')+'Month'](value,dayOfMonth);return mom;}
function rawGetter(mom,unit){return mom._d['get'+(mom._isUTC?'UTC':'')+unit]();}
function rawSetter(mom,unit,value){if(unit==='Month'){return rawMonthSetter(mom,value);}else{return mom._d['set'+(mom._isUTC?'UTC':'')+unit](value);}}
function makeAccessor(unit,keepTime){return function(value){if(value!=null){rawSetter(this,unit,value);moment.updateOffset(this,keepTime);return this;}else{return rawGetter(this,unit);}};}
moment.fn.millisecond=moment.fn.milliseconds=makeAccessor('Milliseconds',false);moment.fn.second=moment.fn.seconds=makeAccessor('Seconds',false);moment.fn.minute=moment.fn.minutes=makeAccessor('Minutes',false);moment.fn.hour=moment.fn.hours=makeAccessor('Hours',true);moment.fn.date=makeAccessor('Date',true);moment.fn.dates=deprecate('dates accessor is deprecated. Use date instead.',makeAccessor('Date',true));moment.fn.year=makeAccessor('FullYear',true);moment.fn.years=deprecate('years accessor is deprecated. Use year instead.',makeAccessor('FullYear',true));moment.fn.days=moment.fn.day;moment.fn.months=moment.fn.month;moment.fn.weeks=moment.fn.week;moment.fn.isoWeeks=moment.fn.isoWeek;moment.fn.quarters=moment.fn.quarter;moment.fn.toJSON=moment.fn.toISOString;moment.fn.isUTC=moment.fn.isUtc;function daysToYears(days){return days*400/146097;}
function yearsToDays(years){return years*146097/400;}
extend(moment.duration.fn=Duration.prototype,{_bubble:function(){var milliseconds=this._milliseconds,days=this._days,months=this._months,data=this._data,seconds,minutes,hours,years=0;data.milliseconds=milliseconds%1000;seconds=absRound(milliseconds/1000);data.seconds=seconds%60;minutes=absRound(seconds/60);data.minutes=minutes%60;hours=absRound(minutes/60);data.hours=hours%24;days+=absRound(hours/24);years=absRound(daysToYears(days));days-=absRound(yearsToDays(years));months+=absRound(days/30);days%=30;years+=absRound(months/12);months%=12;data.days=days;data.months=months;data.years=years;},abs:function(){this._milliseconds=Math.abs(this._milliseconds);this._days=Math.abs(this._days);this._months=Math.abs(this._months);this._data.milliseconds=Math.abs(this._data.milliseconds);this._data.seconds=Math.abs(this._data.seconds);this._data.minutes=Math.abs(this._data.minutes);this._data.hours=Math.abs(this._data.hours);this._data.months=Math.abs(this._data.months);this._data.years=Math.abs(this._data.years);return this;},weeks:function(){return absRound(this.days()/7);},valueOf:function(){return this._milliseconds+
this._days*864e5+
(this._months%12)*2592e6+
toInt(this._months/12)*31536e6;},humanize:function(withSuffix){var output=relativeTime(this,!withSuffix,this.localeData());if(withSuffix){output=this.localeData().pastFuture(+this,output);}
return this.localeData().postformat(output);},add:function(input,val){var dur=moment.duration(input,val);this._milliseconds+=dur._milliseconds;this._days+=dur._days;this._months+=dur._months;this._bubble();return this;},subtract:function(input,val){var dur=moment.duration(input,val);this._milliseconds-=dur._milliseconds;this._days-=dur._days;this._months-=dur._months;this._bubble();return this;},get:function(units){units=normalizeUnits(units);return this[units.toLowerCase()+'s']();},as:function(units){var days,months;units=normalizeUnits(units);if(units==='month'||units==='year'){days=this._days+this._milliseconds/864e5;months=this._months+daysToYears(days)*12;return units==='month'?months:months/12;}else{days=this._days+Math.round(yearsToDays(this._months/12));switch(units){case'week':return days/7+this._milliseconds/6048e5;case'day':return days+this._milliseconds/864e5;case'hour':return days*24+this._milliseconds/36e5;case'minute':return days*24*60+this._milliseconds/6e4;case'second':return days*24*60*60+this._milliseconds/1000;case'millisecond':return Math.floor(days*24*60*60*1000)+this._milliseconds;default:throw new Error('Unknown unit '+units);}}},lang:moment.fn.lang,locale:moment.fn.locale,toIsoString:deprecate('toIsoString() is deprecated. Please use toISOString() instead '+'(notice the capitals)',function(){return this.toISOString();}),toISOString:function(){var years=Math.abs(this.years()),months=Math.abs(this.months()),days=Math.abs(this.days()),hours=Math.abs(this.hours()),minutes=Math.abs(this.minutes()),seconds=Math.abs(this.seconds()+this.milliseconds()/1000);if(!this.asSeconds()){return'P0D';}
return(this.asSeconds()<0?'-':'')+'P'+
(years?years+'Y':'')+
(months?months+'M':'')+
(days?days+'D':'')+
((hours||minutes||seconds)?'T':'')+
(hours?hours+'H':'')+
(minutes?minutes+'M':'')+
(seconds?seconds+'S':'');},localeData:function(){return this._locale;},toJSON:function(){return this.toISOString();}});moment.duration.fn.toString=moment.duration.fn.toISOString;function makeDurationGetter(name){moment.duration.fn[name]=function(){return this._data[name];};}
for(i in unitMillisecondFactors){if(hasOwnProp(unitMillisecondFactors,i)){makeDurationGetter(i.toLowerCase());}}
moment.duration.fn.asMilliseconds=function(){return this.as('ms');};moment.duration.fn.asSeconds=function(){return this.as('s');};moment.duration.fn.asMinutes=function(){return this.as('m');};moment.duration.fn.asHours=function(){return this.as('h');};moment.duration.fn.asDays=function(){return this.as('d');};moment.duration.fn.asWeeks=function(){return this.as('weeks');};moment.duration.fn.asMonths=function(){return this.as('M');};moment.duration.fn.asYears=function(){return this.as('y');};moment.locale('en',{ordinalParse:/\d{1,2}(th|st|nd|rd)/,ordinal:function(number){var b=number%10,output=(toInt(number%100/10)===1)?'th':(b===1)?'st':(b===2)?'nd':(b===3)?'rd':'th';return number+output;}});function makeGlobal(shouldDeprecate){if(typeof ender!=='undefined'){return;}
oldGlobalMoment=globalScope.moment;if(shouldDeprecate){globalScope.moment=deprecate('Accessing Moment through the global scope is '+'deprecated, and will be removed in an upcoming '+'release.',moment);}else{globalScope.moment=moment;}}
if(hasModule){module.exports=moment;}else if(typeof define==='function'&&define.amd){define(function(require,exports,module){if(module.config&&module.config()&&module.config().noGlobal===true){globalScope.moment=oldGlobalMoment;}
return moment;});makeGlobal(true);}else{makeGlobal();}}).call(this);(function($){var liveUpdatingTargetSelectors={};var liveUpdaterIntervalId;var liveUpdaterRunning=false;var defaultSettings={ellipsis:'...',setTitle:'never',live:false};$.fn.ellipsis=function(selector,options){var subjectElements,settings;subjectElements=$(this);if(typeof selector!=='string'){options=selector;selector=undefined;}
settings=$.extend({},defaultSettings,options);settings.selector=selector;subjectElements.each(function(){var elem=$(this);ellipsisOnElement(elem,settings);});if(settings.live){addToLiveUpdater(subjectElements.selector,settings);}else{removeFromLiveUpdater(subjectElements.selector);}
return this;};function ellipsisOnElement(containerElement,settings){var containerData=containerElement.data('jqae');if(!containerData)containerData={};var wrapperElement=containerData.wrapperElement;if(!wrapperElement){wrapperElement=containerElement.wrapInner('<div/>').find('>div');wrapperElement.css({margin:0,padding:0,border:0});}
var wrapperElementData=wrapperElement.data('jqae');if(!wrapperElementData)wrapperElementData={};var wrapperOriginalContent=wrapperElementData.originalContent;if(wrapperOriginalContent){wrapperElement=wrapperElementData.originalContent.clone(true).data('jqae',{originalContent:wrapperOriginalContent}).replaceAll(wrapperElement);}else{wrapperElement.data('jqae',{originalContent:wrapperElement.clone(true)});}
containerElement.data('jqae',{wrapperElement:wrapperElement,containerWidth:containerElement.width(),containerHeight:containerElement.height()});var containerElementHeight=containerElement.height();var wrapperOffset=(parseInt(containerElement.css('padding-top'),10)||0)+(parseInt(containerElement.css('border-top-width'),10)||0)-(wrapperElement.offset().top-containerElement.offset().top);var deferAppendEllipsis=false;var selectedElements=wrapperElement;if(settings.selector)selectedElements=$(wrapperElement.find(settings.selector).get().reverse());selectedElements.each(function(){var selectedElement=$(this),originalText=selectedElement.text(),ellipsisApplied=false;if(wrapperElement.innerHeight()-selectedElement.innerHeight()>containerElementHeight+wrapperOffset){selectedElement.remove();}else{removeLastEmptyElements(selectedElement);if(selectedElement.contents().length){if(deferAppendEllipsis){getLastTextNode(selectedElement).get(0).nodeValue+=settings.ellipsis;deferAppendEllipsis=false;}
while(wrapperElement.innerHeight()>containerElementHeight+wrapperOffset){ellipsisApplied=ellipsisOnLastTextNode(selectedElement);if(ellipsisApplied){removeLastEmptyElements(selectedElement);if(selectedElement.contents().length){getLastTextNode(selectedElement).get(0).nodeValue+=settings.ellipsis;}else{deferAppendEllipsis=true;selectedElement.remove();break;}}else{deferAppendEllipsis=true;selectedElement.remove();break;}}
if(((settings.setTitle=='onEllipsis')&&ellipsisApplied)||(settings.setTitle=='always')){selectedElement.attr('title',originalText);}else if(settings.setTitle!='never'){selectedElement.removeAttr('title');}}}});}
function ellipsisOnLastTextNode(element){var lastTextNode=getLastTextNode(element);if(lastTextNode.length){var text=lastTextNode.get(0).nodeValue;var pos=text.lastIndexOf(' ');if(pos>-1){text=$.trim(text.substring(0,pos));lastTextNode.get(0).nodeValue=text;}else{lastTextNode.get(0).nodeValue='';}
return true;}
return false;}
function getLastTextNode(element){if(element.contents().length){var contents=element.contents();var lastNode=contents.eq(contents.length-1);if(lastNode.filter(textNodeFilter).length){return lastNode;}else{return getLastTextNode(lastNode);}}else{element.append('');var contents=element.contents();return contents.eq(contents.length-1);}}
function removeLastEmptyElements(element){if(element.contents().length){var contents=element.contents();var lastNode=contents.eq(contents.length-1);if(lastNode.filter(textNodeFilter).length){var text=lastNode.get(0).nodeValue;text=$.trim(text);if(text==''){lastNode.remove();return true;}else{return false;}}else{while(removeLastEmptyElements(lastNode)){}
if(lastNode.contents().length){return false;}else{lastNode.remove();return true;}}}
return false;}
function textNodeFilter(){return this.nodeType===3;}
function addToLiveUpdater(targetSelector,settings){liveUpdatingTargetSelectors[targetSelector]=settings;if(!liveUpdaterIntervalId){liveUpdaterIntervalId=window.setInterval(function(){doLiveUpdater();},200);}}
function removeFromLiveUpdater(targetSelector){if(liveUpdatingTargetSelectors[targetSelector]){delete liveUpdatingTargetSelectors[targetSelector];if(!liveUpdatingTargetSelectors.length){if(liveUpdaterIntervalId){window.clearInterval(liveUpdaterIntervalId);liveUpdaterIntervalId=undefined;}}}};function doLiveUpdater(){if(!liveUpdaterRunning){liveUpdaterRunning=true;for(var targetSelector in liveUpdatingTargetSelectors){$(targetSelector).each(function(){var containerElement,containerData;containerElement=$(this);containerData=containerElement.data('jqae');if((containerData.containerWidth!=containerElement.width())||(containerData.containerHeight!=containerElement.height())){ellipsisOnElement(containerElement,liveUpdatingTargetSelectors[targetSelector]);}});}
liveUpdaterRunning=false;}};})(jQuery);(function($){$.waterfall=function(){var steps=[],dfrd=$.Deferred(),pointer=0;$.each(arguments,function(i,a){steps.push(function(){var args=[].slice.apply(arguments),d;if(typeof(a)=='function'){if(!((d=a.apply(null,args))&&d.promise)){d=$.Deferred()[d===false?'reject':'resolve'](d);}}else if(a&&a.promise){d=a;}else{d=$.Deferred()[a===false?'reject':'resolve'](a);}
d.fail(function(){dfrd.reject.apply(dfrd,[].slice.apply(arguments));}).done(function(data){pointer++;args.push(data);pointer==steps.length?dfrd.resolve.apply(dfrd,args):steps[pointer].apply(null,args);});});});steps.length?steps[0]():dfrd.resolve();return dfrd;}})(jQuery);(function(factory){if(typeof define==='function'&&define.amd){define(['jquery'],factory);}else if(typeof exports==='object'){factory(require('jquery'));}else{factory(jQuery);}}(function($){var pluses=/\+/g;function encode(s){return config.raw?s:encodeURIComponent(s);}
function decode(s){return config.raw?s:decodeURIComponent(s);}
function stringifyCookieValue(value){return encode(config.json?JSON.stringify(value):String(value));}
function parseCookieValue(s){if(s.indexOf('"')===0){s=s.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,'\\');}
try{s=decodeURIComponent(s.replace(pluses,' '));return config.json?JSON.parse(s):s;}catch(e){}}
function read(s,converter){var value=config.raw?s:parseCookieValue(s);return $.isFunction(converter)?converter(value):value;}
var config=$.cookie=function(key,value,options){if(arguments.length>1&&!$.isFunction(value)){options=$.extend({},config.defaults,options);if(typeof options.expires==='number'){var days=options.expires,t=options.expires=new Date();t.setTime(+t+days*864e+5);}
return(document.cookie=[encode(key),'=',stringifyCookieValue(value),options.expires?'; expires='+options.expires.toUTCString():'',options.path?'; path='+options.path:'',options.domain?'; domain='+options.domain:'',options.secure?'; secure':''].join(''));}
var result=key?undefined:{};var cookies=document.cookie?document.cookie.split('; '):[];for(var i=0,l=cookies.length;i<l;i++){var parts=cookies[i].split('=');var name=decode(parts.shift());var cookie=parts.join('=');if(key&&key===name){result=read(cookie,value);break;}
if(!key&&(cookie=read(cookie))!==undefined){result[name]=cookie;}}
return result;};config.defaults={};$.removeCookie=function(key,options){if($.cookie(key)===undefined){return false;}
$.cookie(key,'',$.extend({},options,{expires:-1}));return!$.cookie(key);};}));(function(){var Dropzone,Emitter,camelize,contentLoaded,detectVerticalSquash,drawImageIOSFix,noop,without,__slice=[].slice,__hasProp={}.hasOwnProperty,__extends=function(child,parent){for(var key in parent){if(__hasProp.call(parent,key))child[key]=parent[key];}function ctor(){this.constructor=child;}ctor.prototype=parent.prototype;child.prototype=new ctor();child.__super__=parent.prototype;return child;};noop=function(){};Emitter=(function(){function Emitter(){}
Emitter.prototype.addEventListener=Emitter.prototype.on;Emitter.prototype.on=function(event,fn){this._callbacks=this._callbacks||{};if(!this._callbacks[event]){this._callbacks[event]=[];}
this._callbacks[event].push(fn);return this;};Emitter.prototype.emit=function(){var args,callback,callbacks,event,_i,_len;event=arguments[0],args=2<=arguments.length?__slice.call(arguments,1):[];this._callbacks=this._callbacks||{};callbacks=this._callbacks[event];if(callbacks){for(_i=0,_len=callbacks.length;_i<_len;_i++){callback=callbacks[_i];callback.apply(this,args);}}
return this;};Emitter.prototype.removeListener=Emitter.prototype.off;Emitter.prototype.removeAllListeners=Emitter.prototype.off;Emitter.prototype.removeEventListener=Emitter.prototype.off;Emitter.prototype.off=function(event,fn){var callback,callbacks,i,_i,_len;if(!this._callbacks||arguments.length===0){this._callbacks={};return this;}
callbacks=this._callbacks[event];if(!callbacks){return this;}
if(arguments.length===1){delete this._callbacks[event];return this;}
for(i=_i=0,_len=callbacks.length;_i<_len;i=++_i){callback=callbacks[i];if(callback===fn){callbacks.splice(i,1);break;}}
return this;};return Emitter;})();Dropzone=(function(_super){var extend,resolveOption;__extends(Dropzone,_super);Dropzone.prototype.Emitter=Emitter;Dropzone.prototype.events=["drop","dragstart","dragend","dragenter","dragover","dragleave","addedfile","removedfile","thumbnail","error","errormultiple","processing","processingmultiple","uploadprogress","totaluploadprogress","sending","sendingmultiple","success","successmultiple","canceled","canceledmultiple","complete","completemultiple","reset","maxfilesexceeded","maxfilesreached","queuecomplete"];Dropzone.prototype.defaultOptions={url:null,method:"post",withCredentials:false,parallelUploads:2,uploadMultiple:false,maxFilesize:256,paramName:"file",createImageThumbnails:true,maxThumbnailFilesize:10,thumbnailWidth:120,thumbnailHeight:120,filesizeBase:1000,maxFiles:null,filesizeBase:1000,params:{},clickable:true,ignoreHiddenFiles:true,acceptedFiles:null,acceptedMimeTypes:null,autoProcessQueue:true,autoQueue:true,addRemoveLinks:false,previewsContainer:null,capture:null,dictDefaultMessage:"Drop files here to upload",dictFallbackMessage:"Your browser does not support drag'n'drop file uploads.",dictFallbackText:"Please use the fallback form below to upload your files like in the olden days.",dictFileTooBig:"File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",dictInvalidFileType:"You can't upload files of this type.",dictResponseError:"Server responded with {{statusCode}} code.",dictCancelUpload:"Cancel upload",dictCancelUploadConfirmation:"Are you sure you want to cancel this upload?",dictRemoveFile:"Remove file",dictRemoveFileConfirmation:null,dictMaxFilesExceeded:"You can not upload any more files.",accept:function(file,done){return done();},init:function(){return noop;},forceFallback:false,fallback:function(){var child,messageElement,span,_i,_len,_ref;this.element.className=""+this.element.className+" dz-browser-not-supported";_ref=this.element.getElementsByTagName("div");for(_i=0,_len=_ref.length;_i<_len;_i++){child=_ref[_i];if(/(^| )dz-message($| )/.test(child.className)){messageElement=child;child.className="dz-message";continue;}}
if(!messageElement){messageElement=Dropzone.createElement("<div class=\"dz-message\"><span></span></div>");this.element.appendChild(messageElement);}
span=messageElement.getElementsByTagName("span")[0];if(span){span.textContent=this.options.dictFallbackMessage;}
return this.element.appendChild(this.getFallbackForm());},resize:function(file){var info,srcRatio,trgRatio;info={srcX:0,srcY:0,srcWidth:file.width,srcHeight:file.height};srcRatio=file.width/file.height;info.optWidth=this.options.thumbnailWidth;info.optHeight=this.options.thumbnailHeight;if((info.optWidth==null)&&(info.optHeight==null)){info.optWidth=info.srcWidth;info.optHeight=info.srcHeight;}else if(info.optWidth==null){info.optWidth=srcRatio*info.optHeight;}else if(info.optHeight==null){info.optHeight=(1/srcRatio)*info.optWidth;}
trgRatio=info.optWidth/info.optHeight;if(file.height<info.optHeight||file.width<info.optWidth){info.trgHeight=info.srcHeight;info.trgWidth=info.srcWidth;}else{if(srcRatio>trgRatio){info.srcHeight=file.height;info.srcWidth=info.srcHeight*trgRatio;}else{info.srcWidth=file.width;info.srcHeight=info.srcWidth/trgRatio;}}
info.srcX=(file.width-info.srcWidth)/2;info.srcY=(file.height-info.srcHeight)/2;return info;},drop:function(e){return this.element.classList.remove("dz-drag-hover");},dragstart:noop,dragend:function(e){return this.element.classList.remove("dz-drag-hover");},dragenter:function(e){return this.element.classList.add("dz-drag-hover");},dragover:function(e){return this.element.classList.add("dz-drag-hover");},dragleave:function(e){return this.element.classList.remove("dz-drag-hover");},paste:noop,reset:function(){return this.element.classList.remove("dz-started");},addedfile:function(file){var node,removeFileEvent,removeLink,_i,_j,_k,_len,_len1,_len2,_ref,_ref1,_ref2,_results;if(this.element===this.previewsContainer){this.element.classList.add("dz-started");}
if(this.previewsContainer){file.previewElement=Dropzone.createElement(this.options.previewTemplate.trim());file.previewTemplate=file.previewElement;this.previewsContainer.appendChild(file.previewElement);_ref=file.previewElement.querySelectorAll("[data-dz-name]");for(_i=0,_len=_ref.length;_i<_len;_i++){node=_ref[_i];node.textContent=file.name;}
_ref1=file.previewElement.querySelectorAll("[data-dz-size]");for(_j=0,_len1=_ref1.length;_j<_len1;_j++){node=_ref1[_j];node.innerHTML=this.filesize(file.size);}
if(this.options.addRemoveLinks){file._removeLink=Dropzone.createElement("<a class=\"dz-remove\" href=\"javascript:undefined;\" data-dz-remove>"+this.options.dictRemoveFile+"</a>");file.previewElement.appendChild(file._removeLink);}
removeFileEvent=(function(_this){return function(e){e.preventDefault();e.stopPropagation();if(file.status===Dropzone.UPLOADING){return Dropzone.confirm(_this.options.dictCancelUploadConfirmation,function(){return _this.removeFile(file);});}else{if(_this.options.dictRemoveFileConfirmation){return Dropzone.confirm(_this.options.dictRemoveFileConfirmation,function(){return _this.removeFile(file);});}else{return _this.removeFile(file);}}};})(this);_ref2=file.previewElement.querySelectorAll("[data-dz-remove]");_results=[];for(_k=0,_len2=_ref2.length;_k<_len2;_k++){removeLink=_ref2[_k];_results.push(removeLink.addEventListener("click",removeFileEvent));}
return _results;}},removedfile:function(file){var _ref;if(file.previewElement){if((_ref=file.previewElement)!=null){_ref.parentNode.removeChild(file.previewElement);}}
return this._updateMaxFilesReachedClass();},thumbnail:function(file,dataUrl){var thumbnailElement,_i,_len,_ref;if(file.previewElement){file.previewElement.classList.remove("dz-file-preview");_ref=file.previewElement.querySelectorAll("[data-dz-thumbnail]");for(_i=0,_len=_ref.length;_i<_len;_i++){thumbnailElement=_ref[_i];thumbnailElement.alt=file.name;thumbnailElement.src=dataUrl;}
return setTimeout(((function(_this){return function(){return file.previewElement.classList.add("dz-image-preview");};})(this)),1);}},error:function(file,message){var node,_i,_len,_ref,_results;if(file.previewElement){file.previewElement.classList.add("dz-error");if(typeof message!=="String"&&message.error){message=message.error;}
_ref=file.previewElement.querySelectorAll("[data-dz-errormessage]");_results=[];for(_i=0,_len=_ref.length;_i<_len;_i++){node=_ref[_i];_results.push(node.textContent=message);}
return _results;}},errormultiple:noop,processing:function(file){if(file.previewElement){file.previewElement.classList.add("dz-processing");if(file._removeLink){return file._removeLink.textContent=this.options.dictCancelUpload;}}},processingmultiple:noop,uploadprogress:function(file,progress,bytesSent){var node,_i,_len,_ref,_results;if(file.previewElement){_ref=file.previewElement.querySelectorAll("[data-dz-uploadprogress]");_results=[];for(_i=0,_len=_ref.length;_i<_len;_i++){node=_ref[_i];if(node.nodeName==='PROGRESS'){_results.push(node.value=progress);}else{_results.push(node.style.width=""+progress+"%");}}
return _results;}},totaluploadprogress:noop,sending:noop,sendingmultiple:noop,success:function(file){if(file.previewElement){return file.previewElement.classList.add("dz-success");}},successmultiple:noop,canceled:function(file){return this.emit("error",file,"Upload canceled.");},canceledmultiple:noop,complete:function(file){if(file._removeLink){file._removeLink.textContent=this.options.dictRemoveFile;}
if(file.previewElement){return file.previewElement.classList.add("dz-complete");}},completemultiple:noop,maxfilesexceeded:noop,maxfilesreached:noop,queuecomplete:noop,previewTemplate:"<div class=\"dz-preview dz-file-preview\">\n  <div class=\"dz-image\"><img data-dz-thumbnail /></div>\n  <div class=\"dz-details\">\n    <div class=\"dz-size\"><span data-dz-size></span></div>\n    <div class=\"dz-filename\"><span data-dz-name></span></div>\n  </div>\n  <div class=\"dz-progress\"><span class=\"dz-upload\" data-dz-uploadprogress></span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n  <div class=\"dz-success-mark\">\n    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Check</title>\n      <defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <path d=\"M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" stroke-opacity=\"0.198794158\" stroke=\"#747474\" fill-opacity=\"0.816519475\" fill=\"#FFFFFF\" sketch:type=\"MSShapeGroup\"></path>\n      </g>\n    </svg>\n  </div>\n  <div class=\"dz-error-mark\">\n    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Error</title>\n      <defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <g id=\"Check-+-Oval-2\" sketch:type=\"MSLayerGroup\" stroke=\"#747474\" stroke-opacity=\"0.198794158\" fill=\"#FFFFFF\" fill-opacity=\"0.816519475\">\n          <path d=\"M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" sketch:type=\"MSShapeGroup\"></path>\n        </g>\n      </g>\n    </svg>\n  </div>\n</div>"};extend=function(){var key,object,objects,target,val,_i,_len;target=arguments[0],objects=2<=arguments.length?__slice.call(arguments,1):[];for(_i=0,_len=objects.length;_i<_len;_i++){object=objects[_i];for(key in object){val=object[key];target[key]=val;}}
return target;};function Dropzone(element,options){var elementOptions,fallback,_ref;this.element=element;this.version=Dropzone.version;this.defaultOptions.previewTemplate=this.defaultOptions.previewTemplate.replace(/\n*/g,"");this.clickableElements=[];this.listeners=[];this.files=[];if(typeof this.element==="string"){this.element=document.querySelector(this.element);}
if(!(this.element&&(this.element.nodeType!=null))){throw new Error("Invalid dropzone element.");}
if(this.element.dropzone){throw new Error("Dropzone already attached.");}
Dropzone.instances.push(this);this.element.dropzone=this;elementOptions=(_ref=Dropzone.optionsForElement(this.element))!=null?_ref:{};this.options=extend({},this.defaultOptions,elementOptions,options!=null?options:{});if(this.options.forceFallback||!Dropzone.isBrowserSupported()){return this.options.fallback.call(this);}
if(this.options.url==null){this.options.url=this.element.getAttribute("action");}
if(!this.options.url){throw new Error("No URL provided.");}
if(this.options.acceptedFiles&&this.options.acceptedMimeTypes){throw new Error("You can't provide both 'acceptedFiles' and 'acceptedMimeTypes'. 'acceptedMimeTypes' is deprecated.");}
if(this.options.acceptedMimeTypes){this.options.acceptedFiles=this.options.acceptedMimeTypes;delete this.options.acceptedMimeTypes;}
this.options.method=this.options.method.toUpperCase();if((fallback=this.getExistingFallback())&&fallback.parentNode){fallback.parentNode.removeChild(fallback);}
if(this.options.previewsContainer!==false){if(this.options.previewsContainer){this.previewsContainer=Dropzone.getElement(this.options.previewsContainer,"previewsContainer");}else{this.previewsContainer=this.element;}}
if(this.options.clickable){if(this.options.clickable===true){this.clickableElements=[this.element];}else{this.clickableElements=Dropzone.getElements(this.options.clickable,"clickable");}}
this.init();}
Dropzone.prototype.getAcceptedFiles=function(){var file,_i,_len,_ref,_results;_ref=this.files;_results=[];for(_i=0,_len=_ref.length;_i<_len;_i++){file=_ref[_i];if(file.accepted){_results.push(file);}}
return _results;};Dropzone.prototype.getRejectedFiles=function(){var file,_i,_len,_ref,_results;_ref=this.files;_results=[];for(_i=0,_len=_ref.length;_i<_len;_i++){file=_ref[_i];if(!file.accepted){_results.push(file);}}
return _results;};Dropzone.prototype.getFilesWithStatus=function(status){var file,_i,_len,_ref,_results;_ref=this.files;_results=[];for(_i=0,_len=_ref.length;_i<_len;_i++){file=_ref[_i];if(file.status===status){_results.push(file);}}
return _results;};Dropzone.prototype.getQueuedFiles=function(){return this.getFilesWithStatus(Dropzone.QUEUED);};Dropzone.prototype.getUploadingFiles=function(){return this.getFilesWithStatus(Dropzone.UPLOADING);};Dropzone.prototype.getActiveFiles=function(){var file,_i,_len,_ref,_results;_ref=this.files;_results=[];for(_i=0,_len=_ref.length;_i<_len;_i++){file=_ref[_i];if(file.status===Dropzone.UPLOADING||file.status===Dropzone.QUEUED){_results.push(file);}}
return _results;};Dropzone.prototype.init=function(){var eventName,noPropagation,setupHiddenFileInput,_i,_len,_ref,_ref1;if(this.element.tagName==="form"){this.element.setAttribute("enctype","multipart/form-data");}
if(this.element.classList.contains("dropzone")&&!this.element.querySelector(".dz-message")){this.element.appendChild(Dropzone.createElement("<div class=\"dz-default dz-message\"><span>"+this.options.dictDefaultMessage+"</span></div>"));}
if(this.clickableElements.length){setupHiddenFileInput=(function(_this){return function(){if(_this.hiddenFileInput){document.body.removeChild(_this.hiddenFileInput);}
_this.hiddenFileInput=document.createElement("input");_this.hiddenFileInput.setAttribute("type","file");if((_this.options.maxFiles==null)||_this.options.maxFiles>1){_this.hiddenFileInput.setAttribute("multiple","multiple");}
_this.hiddenFileInput.className="dz-hidden-input";if(_this.options.acceptedFiles!=null){_this.hiddenFileInput.setAttribute("accept",_this.options.acceptedFiles);}
if(_this.options.capture!=null){_this.hiddenFileInput.setAttribute("capture",_this.options.capture);}
_this.hiddenFileInput.style.visibility="hidden";_this.hiddenFileInput.style.position="absolute";_this.hiddenFileInput.style.top="0";_this.hiddenFileInput.style.left="0";_this.hiddenFileInput.style.height="0";_this.hiddenFileInput.style.width="0";document.body.appendChild(_this.hiddenFileInput);return _this.hiddenFileInput.addEventListener("change",function(){var file,files,_i,_len;files=_this.hiddenFileInput.files;if(files.length){for(_i=0,_len=files.length;_i<_len;_i++){file=files[_i];_this.addFile(file);}}
return setupHiddenFileInput();});};})(this);setupHiddenFileInput();}
this.URL=(_ref=window.URL)!=null?_ref:window.webkitURL;_ref1=this.events;for(_i=0,_len=_ref1.length;_i<_len;_i++){eventName=_ref1[_i];this.on(eventName,this.options[eventName]);}
this.on("uploadprogress",(function(_this){return function(){return _this.updateTotalUploadProgress();};})(this));this.on("removedfile",(function(_this){return function(){return _this.updateTotalUploadProgress();};})(this));this.on("canceled",(function(_this){return function(file){return _this.emit("complete",file);};})(this));this.on("complete",(function(_this){return function(file){if(_this.getUploadingFiles().length===0&&_this.getQueuedFiles().length===0){return setTimeout((function(){return _this.emit("queuecomplete");}),0);}};})(this));noPropagation=function(e){e.stopPropagation();if(e.preventDefault){return e.preventDefault();}else{return e.returnValue=false;}};this.listeners=[{element:this.element,events:{"dragstart":(function(_this){return function(e){return _this.emit("dragstart",e);};})(this),"dragenter":(function(_this){return function(e){noPropagation(e);return _this.emit("dragenter",e);};})(this),"dragover":(function(_this){return function(e){var efct;try{efct=e.dataTransfer.effectAllowed;}catch(_error){}
e.dataTransfer.dropEffect='move'===efct||'linkMove'===efct?'move':'copy';noPropagation(e);return _this.emit("dragover",e);};})(this),"dragleave":(function(_this){return function(e){return _this.emit("dragleave",e);};})(this),"drop":(function(_this){return function(e){noPropagation(e);return _this.drop(e);};})(this),"dragend":(function(_this){return function(e){return _this.emit("dragend",e);};})(this)}}];this.clickableElements.forEach((function(_this){return function(clickableElement){return _this.listeners.push({element:clickableElement,events:{"click":function(evt){if((clickableElement!==_this.element)||(evt.target===_this.element||Dropzone.elementInside(evt.target,_this.element.querySelector(".dz-message")))){return _this.hiddenFileInput.click();}}}});};})(this));this.enable();return this.options.init.call(this);};Dropzone.prototype.destroy=function(){var _ref;this.disable();this.removeAllFiles(true);if((_ref=this.hiddenFileInput)!=null?_ref.parentNode:void 0){this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput);this.hiddenFileInput=null;}
delete this.element.dropzone;return Dropzone.instances.splice(Dropzone.instances.indexOf(this),1);};Dropzone.prototype.updateTotalUploadProgress=function(){var activeFiles,file,totalBytes,totalBytesSent,totalUploadProgress,_i,_len,_ref;totalBytesSent=0;totalBytes=0;activeFiles=this.getActiveFiles();if(activeFiles.length){_ref=this.getActiveFiles();for(_i=0,_len=_ref.length;_i<_len;_i++){file=_ref[_i];totalBytesSent+=file.upload.bytesSent;totalBytes+=file.upload.total;}
totalUploadProgress=100*totalBytesSent/totalBytes;}else{totalUploadProgress=100;}
return this.emit("totaluploadprogress",totalUploadProgress,totalBytes,totalBytesSent);};Dropzone.prototype._getParamName=function(n){if(typeof this.options.paramName==="function"){return this.options.paramName(n);}else{return""+this.options.paramName+(this.options.uploadMultiple?"["+n+"]":"");}};Dropzone.prototype.getFallbackForm=function(){var existingFallback,fields,fieldsString,form;if(existingFallback=this.getExistingFallback()){return existingFallback;}
fieldsString="<div class=\"dz-fallback\">";if(this.options.dictFallbackText){fieldsString+="<p>"+this.options.dictFallbackText+"</p>";}
fieldsString+="<input type=\"file\" name=\""+(this._getParamName(0))+"\" "+(this.options.uploadMultiple?'multiple="multiple"':void 0)+" /><input type=\"submit\" value=\"Upload!\"></div>";fields=Dropzone.createElement(fieldsString);if(this.element.tagName!=="FORM"){form=Dropzone.createElement("<form action=\""+this.options.url+"\" enctype=\"multipart/form-data\" method=\""+this.options.method+"\"></form>");form.appendChild(fields);}else{this.element.setAttribute("enctype","multipart/form-data");this.element.setAttribute("method",this.options.method);}
return form!=null?form:fields;};Dropzone.prototype.getExistingFallback=function(){var fallback,getFallback,tagName,_i,_len,_ref;getFallback=function(elements){var el,_i,_len;for(_i=0,_len=elements.length;_i<_len;_i++){el=elements[_i];if(/(^| )fallback($| )/.test(el.className)){return el;}}};_ref=["div","form"];for(_i=0,_len=_ref.length;_i<_len;_i++){tagName=_ref[_i];if(fallback=getFallback(this.element.getElementsByTagName(tagName))){return fallback;}}};Dropzone.prototype.setupEventListeners=function(){var elementListeners,event,listener,_i,_len,_ref,_results;_ref=this.listeners;_results=[];for(_i=0,_len=_ref.length;_i<_len;_i++){elementListeners=_ref[_i];_results.push((function(){var _ref1,_results1;_ref1=elementListeners.events;_results1=[];for(event in _ref1){listener=_ref1[event];_results1.push(elementListeners.element.addEventListener(event,listener,false));}
return _results1;})());}
return _results;};Dropzone.prototype.removeEventListeners=function(){var elementListeners,event,listener,_i,_len,_ref,_results;_ref=this.listeners;_results=[];for(_i=0,_len=_ref.length;_i<_len;_i++){elementListeners=_ref[_i];_results.push((function(){var _ref1,_results1;_ref1=elementListeners.events;_results1=[];for(event in _ref1){listener=_ref1[event];_results1.push(elementListeners.element.removeEventListener(event,listener,false));}
return _results1;})());}
return _results;};Dropzone.prototype.disable=function(){var file,_i,_len,_ref,_results;this.clickableElements.forEach(function(element){return element.classList.remove("dz-clickable");});this.removeEventListeners();_ref=this.files;_results=[];for(_i=0,_len=_ref.length;_i<_len;_i++){file=_ref[_i];_results.push(this.cancelUpload(file));}
return _results;};Dropzone.prototype.enable=function(){this.clickableElements.forEach(function(element){return element.classList.add("dz-clickable");});return this.setupEventListeners();};Dropzone.prototype.filesize=function(size){var cutoff,i,selectedSize,selectedUnit,unit,units,_i,_len;units=['TB','GB','MB','KB','b'];selectedSize=selectedUnit=null;for(i=_i=0,_len=units.length;_i<_len;i=++_i){unit=units[i];cutoff=Math.pow(this.options.filesizeBase,4-i)/10;if(size>=cutoff){selectedSize=size/Math.pow(this.options.filesizeBase,4-i);selectedUnit=unit;break;}}
selectedSize=Math.round(10*selectedSize)/10;return"<strong>"+selectedSize+"</strong> "+selectedUnit;};Dropzone.prototype._updateMaxFilesReachedClass=function(){if((this.options.maxFiles!=null)&&this.getAcceptedFiles().length>=this.options.maxFiles){if(this.getAcceptedFiles().length===this.options.maxFiles){this.emit('maxfilesreached',this.files);}
return this.element.classList.add("dz-max-files-reached");}else{return this.element.classList.remove("dz-max-files-reached");}};Dropzone.prototype.drop=function(e){var files,items;if(!e.dataTransfer){return;}
this.emit("drop",e);files=e.dataTransfer.files;if(files.length){items=e.dataTransfer.items;if(items&&items.length&&(items[0].webkitGetAsEntry!=null)){this._addFilesFromItems(items);}else{this.handleFiles(files);}}};Dropzone.prototype.paste=function(e){var items,_ref;if((e!=null?(_ref=e.clipboardData)!=null?_ref.items:void 0:void 0)==null){return;}
this.emit("paste",e);items=e.clipboardData.items;if(items.length){return this._addFilesFromItems(items);}};Dropzone.prototype.handleFiles=function(files){var file,_i,_len,_results;_results=[];for(_i=0,_len=files.length;_i<_len;_i++){file=files[_i];_results.push(this.addFile(file));}
return _results;};Dropzone.prototype._addFilesFromItems=function(items){var entry,item,_i,_len,_results;_results=[];for(_i=0,_len=items.length;_i<_len;_i++){item=items[_i];if((item.webkitGetAsEntry!=null)&&(entry=item.webkitGetAsEntry())){if(entry.isFile){_results.push(this.addFile(item.getAsFile()));}else if(entry.isDirectory){_results.push(this._addFilesFromDirectory(entry,entry.name));}else{_results.push(void 0);}}else if(item.getAsFile!=null){if((item.kind==null)||item.kind==="file"){_results.push(this.addFile(item.getAsFile()));}else{_results.push(void 0);}}else{_results.push(void 0);}}
return _results;};Dropzone.prototype._addFilesFromDirectory=function(directory,path){var dirReader,entriesReader;dirReader=directory.createReader();entriesReader=(function(_this){return function(entries){var entry,_i,_len;for(_i=0,_len=entries.length;_i<_len;_i++){entry=entries[_i];if(entry.isFile){entry.file(function(file){if(_this.options.ignoreHiddenFiles&&file.name.substring(0,1)==='.'){return;}
file.fullPath=""+path+"/"+file.name;return _this.addFile(file);});}else if(entry.isDirectory){_this._addFilesFromDirectory(entry,""+path+"/"+entry.name);}}};})(this);return dirReader.readEntries(entriesReader,function(error){return typeof console!=="undefined"&&console!==null?typeof console.log==="function"?console.log(error):void 0:void 0;});};Dropzone.prototype.accept=function(file,done){if(file.size>this.options.maxFilesize*1024*1024){return done(this.options.dictFileTooBig.replace("{{filesize}}",Math.round(file.size/1024/10.24)/100).replace("{{maxFilesize}}",this.options.maxFilesize));}else if(!Dropzone.isValidFile(file,this.options.acceptedFiles)){return done(this.options.dictInvalidFileType);}else if((this.options.maxFiles!=null)&&this.getAcceptedFiles().length>=this.options.maxFiles){done(this.options.dictMaxFilesExceeded.replace("{{maxFiles}}",this.options.maxFiles));return this.emit("maxfilesexceeded",file);}else{return this.options.accept.call(this,file,done);}};Dropzone.prototype.addFile=function(file){file.upload={progress:0,total:file.size,bytesSent:0};this.files.push(file);file.status=Dropzone.ADDED;this.emit("addedfile",file);this._enqueueThumbnail(file);return this.accept(file,(function(_this){return function(error){if(error){file.accepted=false;_this._errorProcessing([file],error);}else{file.accepted=true;if(_this.options.autoQueue){_this.enqueueFile(file);}}
return _this._updateMaxFilesReachedClass();};})(this));};Dropzone.prototype.enqueueFiles=function(files){var file,_i,_len;for(_i=0,_len=files.length;_i<_len;_i++){file=files[_i];this.enqueueFile(file);}
return null;};Dropzone.prototype.enqueueFile=function(file){if(file.status===Dropzone.ADDED&&file.accepted===true){file.status=Dropzone.QUEUED;if(this.options.autoProcessQueue){return setTimeout(((function(_this){return function(){return _this.processQueue();};})(this)),0);}}else{throw new Error("This file can't be queued because it has already been processed or was rejected.");}};Dropzone.prototype._thumbnailQueue=[];Dropzone.prototype._processingThumbnail=false;Dropzone.prototype._enqueueThumbnail=function(file){if(this.options.createImageThumbnails&&file.type.match(/image.*/)&&file.size<=this.options.maxThumbnailFilesize*1024*1024){this._thumbnailQueue.push(file);return setTimeout(((function(_this){return function(){return _this._processThumbnailQueue();};})(this)),0);}};Dropzone.prototype._processThumbnailQueue=function(){if(this._processingThumbnail||this._thumbnailQueue.length===0){return;}
this._processingThumbnail=true;return this.createThumbnail(this._thumbnailQueue.shift(),(function(_this){return function(){_this._processingThumbnail=false;return _this._processThumbnailQueue();};})(this));};Dropzone.prototype.removeFile=function(file){if(file.status===Dropzone.UPLOADING){this.cancelUpload(file);}
this.files=without(this.files,file);this.emit("removedfile",file);if(this.files.length===0){return this.emit("reset");}};Dropzone.prototype.removeAllFiles=function(cancelIfNecessary){var file,_i,_len,_ref;if(cancelIfNecessary==null){cancelIfNecessary=false;}
_ref=this.files.slice();for(_i=0,_len=_ref.length;_i<_len;_i++){file=_ref[_i];if(file.status!==Dropzone.UPLOADING||cancelIfNecessary){this.removeFile(file);}}
return null;};Dropzone.prototype.createThumbnail=function(file,callback){var fileReader;fileReader=new FileReader;fileReader.onload=(function(_this){return function(){if(file.type==="image/svg+xml"){_this.emit("thumbnail",file,fileReader.result);if(callback!=null){callback();}
return;}
return _this.createThumbnailFromUrl(file,fileReader.result,callback);};})(this);return fileReader.readAsDataURL(file);};Dropzone.prototype.createThumbnailFromUrl=function(file,imageUrl,callback){var img;img=document.createElement("img");img.onload=(function(_this){return function(){var canvas,ctx,resizeInfo,thumbnail,_ref,_ref1,_ref2,_ref3;file.width=img.width;file.height=img.height;resizeInfo=_this.options.resize.call(_this,file);if(resizeInfo.trgWidth==null){resizeInfo.trgWidth=resizeInfo.optWidth;}
if(resizeInfo.trgHeight==null){resizeInfo.trgHeight=resizeInfo.optHeight;}
canvas=document.createElement("canvas");ctx=canvas.getContext("2d");canvas.width=resizeInfo.trgWidth;canvas.height=resizeInfo.trgHeight;drawImageIOSFix(ctx,img,(_ref=resizeInfo.srcX)!=null?_ref:0,(_ref1=resizeInfo.srcY)!=null?_ref1:0,resizeInfo.srcWidth,resizeInfo.srcHeight,(_ref2=resizeInfo.trgX)!=null?_ref2:0,(_ref3=resizeInfo.trgY)!=null?_ref3:0,resizeInfo.trgWidth,resizeInfo.trgHeight);thumbnail=canvas.toDataURL("image/png");_this.emit("thumbnail",file,thumbnail);if(callback!=null){return callback();}};})(this);if(callback!=null){img.onerror=callback;}
return img.src=imageUrl;};Dropzone.prototype.processQueue=function(){var i,parallelUploads,processingLength,queuedFiles;parallelUploads=this.options.parallelUploads;processingLength=this.getUploadingFiles().length;i=processingLength;if(processingLength>=parallelUploads){return;}
queuedFiles=this.getQueuedFiles();if(!(queuedFiles.length>0)){return;}
if(this.options.uploadMultiple){return this.processFiles(queuedFiles.slice(0,parallelUploads-processingLength));}else{while(i<parallelUploads){if(!queuedFiles.length){return;}
this.processFile(queuedFiles.shift());i++;}}};Dropzone.prototype.processFile=function(file){return this.processFiles([file]);};Dropzone.prototype.processFiles=function(files){var file,_i,_len;for(_i=0,_len=files.length;_i<_len;_i++){file=files[_i];file.processing=true;file.status=Dropzone.UPLOADING;this.emit("processing",file);}
if(this.options.uploadMultiple){this.emit("processingmultiple",files);}
return this.uploadFiles(files);};Dropzone.prototype._getFilesWithXhr=function(xhr){var file,files;return files=(function(){var _i,_len,_ref,_results;_ref=this.files;_results=[];for(_i=0,_len=_ref.length;_i<_len;_i++){file=_ref[_i];if(file.xhr===xhr){_results.push(file);}}
return _results;}).call(this);};Dropzone.prototype.cancelUpload=function(file){var groupedFile,groupedFiles,_i,_j,_len,_len1,_ref;if(file.status===Dropzone.UPLOADING){groupedFiles=this._getFilesWithXhr(file.xhr);for(_i=0,_len=groupedFiles.length;_i<_len;_i++){groupedFile=groupedFiles[_i];groupedFile.status=Dropzone.CANCELED;}
file.xhr.abort();for(_j=0,_len1=groupedFiles.length;_j<_len1;_j++){groupedFile=groupedFiles[_j];this.emit("canceled",groupedFile);}
if(this.options.uploadMultiple){this.emit("canceledmultiple",groupedFiles);}}else if((_ref=file.status)===Dropzone.ADDED||_ref===Dropzone.QUEUED){file.status=Dropzone.CANCELED;this.emit("canceled",file);if(this.options.uploadMultiple){this.emit("canceledmultiple",[file]);}}
if(this.options.autoProcessQueue){return this.processQueue();}};resolveOption=function(){var args,option;option=arguments[0],args=2<=arguments.length?__slice.call(arguments,1):[];if(typeof option==='function'){return option.apply(this,args);}
return option;};Dropzone.prototype.uploadFile=function(file){return this.uploadFiles([file]);};Dropzone.prototype.uploadFiles=function(files){var file,formData,handleError,headerName,headerValue,headers,i,input,inputName,inputType,key,method,option,progressObj,response,updateProgress,url,value,xhr,_i,_j,_k,_l,_len,_len1,_len2,_len3,_m,_ref,_ref1,_ref2,_ref3,_ref4,_ref5;xhr=new XMLHttpRequest();for(_i=0,_len=files.length;_i<_len;_i++){file=files[_i];file.xhr=xhr;}
method=resolveOption(this.options.method,files);url=resolveOption(this.options.url,files);xhr.open(method,url,true);xhr.withCredentials=!!this.options.withCredentials;response=null;handleError=(function(_this){return function(){var _j,_len1,_results;_results=[];for(_j=0,_len1=files.length;_j<_len1;_j++){file=files[_j];_results.push(_this._errorProcessing(files,response||_this.options.dictResponseError.replace("{{statusCode}}",xhr.status),xhr));}
return _results;};})(this);updateProgress=(function(_this){return function(e){var allFilesFinished,progress,_j,_k,_l,_len1,_len2,_len3,_results;if(e!=null){progress=100*e.loaded/e.total;for(_j=0,_len1=files.length;_j<_len1;_j++){file=files[_j];file.upload={progress:progress,total:e.total,bytesSent:e.loaded};}}else{allFilesFinished=true;progress=100;for(_k=0,_len2=files.length;_k<_len2;_k++){file=files[_k];if(!(file.upload.progress===100&&file.upload.bytesSent===file.upload.total)){allFilesFinished=false;}
file.upload.progress=progress;file.upload.bytesSent=file.upload.total;}
if(allFilesFinished){return;}}
_results=[];for(_l=0,_len3=files.length;_l<_len3;_l++){file=files[_l];_results.push(_this.emit("uploadprogress",file,progress,file.upload.bytesSent));}
return _results;};})(this);xhr.onload=(function(_this){return function(e){var _ref;if(files[0].status===Dropzone.CANCELED){return;}
if(xhr.readyState!==4){return;}
response=xhr.responseText;if(xhr.getResponseHeader("content-type")&&~xhr.getResponseHeader("content-type").indexOf("application/json")){try{response=JSON.parse(response);}catch(_error){e=_error;response="Invalid JSON response from server.";}}
updateProgress();if(!((200<=(_ref=xhr.status)&&_ref<300))){return handleError();}else{return _this._finished(files,response,e);}};})(this);xhr.onerror=(function(_this){return function(){if(files[0].status===Dropzone.CANCELED){return;}
return handleError();};})(this);progressObj=(_ref=xhr.upload)!=null?_ref:xhr;progressObj.onprogress=updateProgress;headers={"Accept":"application/json","Cache-Control":"no-cache","X-Requested-With":"XMLHttpRequest"};if(this.options.headers){extend(headers,this.options.headers);}
for(headerName in headers){headerValue=headers[headerName];xhr.setRequestHeader(headerName,headerValue);}
formData=new FormData();if(this.options.params){_ref1=this.options.params;for(key in _ref1){value=_ref1[key];formData.append(key,value);}}
for(_j=0,_len1=files.length;_j<_len1;_j++){file=files[_j];this.emit("sending",file,xhr,formData);}
if(this.options.uploadMultiple){this.emit("sendingmultiple",files,xhr,formData);}
if(this.element.tagName==="FORM"){_ref2=this.element.querySelectorAll("input, textarea, select, button");for(_k=0,_len2=_ref2.length;_k<_len2;_k++){input=_ref2[_k];inputName=input.getAttribute("name");inputType=input.getAttribute("type");if(input.tagName==="SELECT"&&input.hasAttribute("multiple")){_ref3=input.options;for(_l=0,_len3=_ref3.length;_l<_len3;_l++){option=_ref3[_l];if(option.selected){formData.append(inputName,option.value);}}}else if(!inputType||((_ref4=inputType.toLowerCase())!=="checkbox"&&_ref4!=="radio")||input.checked){formData.append(inputName,input.value);}}}
for(i=_m=0,_ref5=files.length-1;0<=_ref5?_m<=_ref5:_m>=_ref5;i=0<=_ref5?++_m:--_m){formData.append(this._getParamName(i),files[i],files[i].name);}
return xhr.send(formData);};Dropzone.prototype._finished=function(files,responseText,e){var file,_i,_len;for(_i=0,_len=files.length;_i<_len;_i++){file=files[_i];file.status=Dropzone.SUCCESS;this.emit("success",file,responseText,e);this.emit("complete",file);}
if(this.options.uploadMultiple){this.emit("successmultiple",files,responseText,e);this.emit("completemultiple",files);}
if(this.options.autoProcessQueue){return this.processQueue();}};Dropzone.prototype._errorProcessing=function(files,message,xhr){var file,_i,_len;for(_i=0,_len=files.length;_i<_len;_i++){file=files[_i];file.status=Dropzone.ERROR;this.emit("error",file,message,xhr);this.emit("complete",file);}
if(this.options.uploadMultiple){this.emit("errormultiple",files,message,xhr);this.emit("completemultiple",files);}
if(this.options.autoProcessQueue){return this.processQueue();}};return Dropzone;})(Emitter);Dropzone.version="4.0.1";Dropzone.options={};Dropzone.optionsForElement=function(element){if(element.getAttribute("id")){return Dropzone.options[camelize(element.getAttribute("id"))];}else{return void 0;}};Dropzone.instances=[];Dropzone.forElement=function(element){if(typeof element==="string"){element=document.querySelector(element);}
if((element!=null?element.dropzone:void 0)==null){throw new Error("No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone.");}
return element.dropzone;};Dropzone.autoDiscover=true;Dropzone.discover=function(){var checkElements,dropzone,dropzones,_i,_len,_results;if(document.querySelectorAll){dropzones=document.querySelectorAll(".dropzone");}else{dropzones=[];checkElements=function(elements){var el,_i,_len,_results;_results=[];for(_i=0,_len=elements.length;_i<_len;_i++){el=elements[_i];if(/(^| )dropzone($| )/.test(el.className)){_results.push(dropzones.push(el));}else{_results.push(void 0);}}
return _results;};checkElements(document.getElementsByTagName("div"));checkElements(document.getElementsByTagName("form"));}
_results=[];for(_i=0,_len=dropzones.length;_i<_len;_i++){dropzone=dropzones[_i];if(Dropzone.optionsForElement(dropzone)!==false){_results.push(new Dropzone(dropzone));}else{_results.push(void 0);}}
return _results;};Dropzone.blacklistedBrowsers=[/opera.*Macintosh.*version\/12/i];Dropzone.isBrowserSupported=function(){var capableBrowser,regex,_i,_len,_ref;capableBrowser=true;if(window.File&&window.FileReader&&window.FileList&&window.Blob&&window.FormData&&document.querySelector){if(!("classList"in document.createElement("a"))){capableBrowser=false;}else{_ref=Dropzone.blacklistedBrowsers;for(_i=0,_len=_ref.length;_i<_len;_i++){regex=_ref[_i];if(regex.test(navigator.userAgent)){capableBrowser=false;continue;}}}}else{capableBrowser=false;}
return capableBrowser;};without=function(list,rejectedItem){var item,_i,_len,_results;_results=[];for(_i=0,_len=list.length;_i<_len;_i++){item=list[_i];if(item!==rejectedItem){_results.push(item);}}
return _results;};camelize=function(str){return str.replace(/[\-_](\w)/g,function(match){return match.charAt(1).toUpperCase();});};Dropzone.createElement=function(string){var div;div=document.createElement("div");div.innerHTML=string;return div.childNodes[0];};Dropzone.elementInside=function(element,container){if(element===container){return true;}
while(element=element.parentNode){if(element===container){return true;}}
return false;};Dropzone.getElement=function(el,name){var element;if(typeof el==="string"){element=document.querySelector(el);}else if(el.nodeType!=null){element=el;}
if(element==null){throw new Error("Invalid `"+name+"` option provided. Please provide a CSS selector or a plain HTML element.");}
return element;};Dropzone.getElements=function(els,name){var e,el,elements,_i,_j,_len,_len1,_ref;if(els instanceof Array){elements=[];try{for(_i=0,_len=els.length;_i<_len;_i++){el=els[_i];elements.push(this.getElement(el,name));}}catch(_error){e=_error;elements=null;}}else if(typeof els==="string"){elements=[];_ref=document.querySelectorAll(els);for(_j=0,_len1=_ref.length;_j<_len1;_j++){el=_ref[_j];elements.push(el);}}else if(els.nodeType!=null){elements=[els];}
if(!((elements!=null)&&elements.length)){throw new Error("Invalid `"+name+"` option provided. Please provide a CSS selector, a plain HTML element or a list of those.");}
return elements;};Dropzone.confirm=function(question,accepted,rejected){if(window.confirm(question)){return accepted();}else if(rejected!=null){return rejected();}};Dropzone.isValidFile=function(file,acceptedFiles){var baseMimeType,mimeType,validType,_i,_len;if(!acceptedFiles){return true;}
acceptedFiles=acceptedFiles.split(",");mimeType=file.type;baseMimeType=mimeType.replace(/\/.*$/,"");for(_i=0,_len=acceptedFiles.length;_i<_len;_i++){validType=acceptedFiles[_i];validType=validType.trim();if(validType.charAt(0)==="."){if(file.name.toLowerCase().indexOf(validType.toLowerCase(),file.name.length-validType.length)!==-1){return true;}}else if(/\/\*$/.test(validType)){if(baseMimeType===validType.replace(/\/.*$/,"")){return true;}}else{if(mimeType===validType){return true;}}}
return false;};if(typeof jQuery!=="undefined"&&jQuery!==null){jQuery.fn.dropzone=function(options){return this.each(function(){return new Dropzone(this,options);});};}
if(typeof module!=="undefined"&&module!==null){module.exports=Dropzone;}else{window.Dropzone=Dropzone;}
Dropzone.ADDED="added";Dropzone.QUEUED="queued";Dropzone.ACCEPTED=Dropzone.QUEUED;Dropzone.UPLOADING="uploading";Dropzone.PROCESSING=Dropzone.UPLOADING;Dropzone.CANCELED="canceled";Dropzone.ERROR="error";Dropzone.SUCCESS="success";detectVerticalSquash=function(img){var alpha,canvas,ctx,data,ey,ih,iw,py,ratio,sy;iw=img.naturalWidth;ih=img.naturalHeight;canvas=document.createElement("canvas");canvas.width=1;canvas.height=ih;ctx=canvas.getContext("2d");ctx.drawImage(img,0,0);data=ctx.getImageData(0,0,1,ih).data;sy=0;ey=ih;py=ih;while(py>sy){alpha=data[(py-1)*4+3];if(alpha===0){ey=py;}else{sy=py;}
py=(ey+sy)>>1;}
ratio=py/ih;if(ratio===0){return 1;}else{return ratio;}};drawImageIOSFix=function(ctx,img,sx,sy,sw,sh,dx,dy,dw,dh){var vertSquashRatio;vertSquashRatio=detectVerticalSquash(img);return ctx.drawImage(img,sx,sy,sw,sh,dx,dy,dw,dh/vertSquashRatio);};contentLoaded=function(win,fn){var add,doc,done,init,poll,pre,rem,root,top;done=false;top=true;doc=win.document;root=doc.documentElement;add=(doc.addEventListener?"addEventListener":"attachEvent");rem=(doc.addEventListener?"removeEventListener":"detachEvent");pre=(doc.addEventListener?"":"on");init=function(e){if(e.type==="readystatechange"&&doc.readyState!=="complete"){return;}
(e.type==="load"?win:doc)[rem](pre+e.type,init,false);if(!done&&(done=true)){return fn.call(win,e.type||e);}};poll=function(){var e;try{root.doScroll("left");}catch(_error){e=_error;setTimeout(poll,50);return;}
return init("poll");};if(doc.readyState!=="complete"){if(doc.createEventObject&&root.doScroll){try{top=!win.frameElement;}catch(_error){}
if(top){poll();}}
doc[add](pre+"DOMContentLoaded",init,false);doc[add](pre+"readystatechange",init,false);return win[add](pre+"load",init,false);}};Dropzone._autoDiscoverFunction=function(){if(Dropzone.autoDiscover){return Dropzone.discover();}};contentLoaded(window,Dropzone._autoDiscoverFunction);}).call(this);(function(window,document){var modalClass='.sweet-alert',overlayClass='.sweet-overlay',alertTypes=['error','warning','info','success'],defaultParams={title:'',text:'',type:null,allowOutsideClick:false,showCancelButton:false,closeOnConfirm:true,closeOnCancel:true,confirmButtonText:'OK',confirmButtonClass:'btn-primary',cancelButtonText:'Cancel',cancelButtonClass:'btn-default',imageUrl:null,imageSize:null,timer:null};var getModal=function(){return document.querySelector(modalClass);},getOverlay=function(){return document.querySelector(overlayClass);},hasClass=function(elem,className){return new RegExp(' '+className+' ').test(' '+elem.className+' ');},addClass=function(elem,className){if(!hasClass(elem,className)){elem.className+=' '+className;}},removeClass=function(elem,className){var newClass=' '+elem.className.replace(/[\t\r\n]/g,' ')+' ';if(hasClass(elem,className)){while(newClass.indexOf(' '+className+' ')>=0){newClass=newClass.replace(' '+className+' ',' ');}
elem.className=newClass.replace(/^\s+|\s+$/g,'');}},escapeHtml=function(str){var div=document.createElement('div');div.appendChild(document.createTextNode(str));return div.innerHTML;},_show=function(elem){elem.style.opacity='';elem.style.display='block';},show=function(elems){if(elems&&!elems.length){return _show(elems);}
for(var i=0;i<elems.length;++i){_show(elems[i]);}},_hide=function(elem){elem.style.opacity='';elem.style.display='none';},hide=function(elems){if(elems&&!elems.length){return _hide(elems);}
for(var i=0;i<elems.length;++i){_hide(elems[i]);}},isDescendant=function(parent,child){var node=child.parentNode;while(node!==null){if(node===parent){return true;}
node=node.parentNode;}
return false;},getTopMargin=function(elem){elem.style.left='-9999px';elem.style.display='block';var height=elem.clientHeight;var padding=parseInt(getComputedStyle(elem).getPropertyValue('padding'),10);elem.style.left='';elem.style.display='none';return('-'+parseInt(height/2+padding)+'px');},fadeIn=function(elem,interval){if(+elem.style.opacity<1){interval=interval||16;elem.style.opacity=0;elem.style.display='block';var last=+new Date();var tick=function(){elem.style.opacity=+elem.style.opacity+(new Date()-last)/100;last=+new Date();if(+elem.style.opacity<1){setTimeout(tick,interval);}};tick();}},fadeOut=function(elem,interval){interval=interval||16;elem.style.opacity=1;var last=+new Date();var tick=function(){elem.style.opacity=+elem.style.opacity-(new Date()-last)/100;last=+new Date();if(+elem.style.opacity>0){setTimeout(tick,interval);}else{elem.style.display='none';}};tick();},fireClick=function(node){if(MouseEvent){var mevt=new MouseEvent('click',{view:window,bubbles:false,cancelable:true});node.dispatchEvent(mevt);}else if(document.createEvent){var evt=document.createEvent('MouseEvents');evt.initEvent('click',false,false);node.dispatchEvent(evt);}else if(document.createEventObject){node.fireEvent('onclick');}else if(typeof node.onclick==='function'){node.onclick();}},stopEventPropagation=function(e){if(typeof e.stopPropagation==='function'){e.stopPropagation();e.preventDefault();}else if(window.event&&window.event.hasOwnProperty('cancelBubble')){window.event.cancelBubble=true;}};var previousActiveElement,previousDocumentClick,previousWindowKeyDown,lastFocusedButton;window.sweetAlertInitialize=function(){var sweetHTML='<div class="sweet-overlay" tabIndex="-1"></div><div class="sweet-alert" tabIndex="-1"><div class="icon error"><span class="x-mark"><span class="line left"></span><span class="line right"></span></span></div><div class="icon warning"> <span class="body"></span> <span class="dot"></span> </div> <div class="icon info"></div> <div class="icon success"> <span class="line tip"></span> <span class="line long"></span> <div class="placeholder"></div> <div class="fix"></div> </div> <div class="icon custom"></div> <h4>Title</h4><p class="text-muted">Text</p><p><button class="cancel btn" tabIndex="2">Cancel</button> <button class="confirm btn" tabIndex="1">OK</button></p></div>',sweetWrap=document.createElement('div');sweetWrap.innerHTML=sweetHTML;document.body.appendChild(sweetWrap);}
window.sweetAlert=window.swal=function(){if(arguments[0]===undefined){window.console.error('sweetAlert expects at least 1 attribute!');return false;}
var params=extend({},defaultParams);switch(typeof arguments[0]){case'string':params.title=arguments[0];params.text=arguments[1]||'';params.type=arguments[2]||'';break;case'object':if(arguments[0].title===undefined){window.console.error('Missing "title" argument!');return false;}
params.title=arguments[0].title;params.text=arguments[0].text||defaultParams.text;params.type=arguments[0].type||defaultParams.type;params.allowOutsideClick=arguments[0].allowOutsideClick||defaultParams.allowOutsideClick;params.showCancelButton=arguments[0].showCancelButton!==undefined?arguments[0].showCancelButton:defaultParams.showCancelButton;params.closeOnConfirm=arguments[0].closeOnConfirm!==undefined?arguments[0].closeOnConfirm:defaultParams.closeOnConfirm;params.closeOnCancel=arguments[0].closeOnCancel!==undefined?arguments[0].closeOnCancel:defaultParams.closeOnCancel;params.timer=arguments[0].timer||defaultParams.timer;params.confirmButtonText=(defaultParams.showCancelButton)?'Confirm':defaultParams.confirmButtonText;params.confirmButtonText=arguments[0].confirmButtonText||defaultParams.confirmButtonText;params.confirmButtonClass=arguments[0].confirmButtonClass||defaultParams.confirmButtonClass;params.cancelButtonText=arguments[0].cancelButtonText||defaultParams.cancelButtonText;params.cancelButtonClass=arguments[0].cancelButtonClass||defaultParams.cancelButtonClass;params.imageUrl=arguments[0].imageUrl||defaultParams.imageUrl;params.imageSize=arguments[0].imageSize||defaultParams.imageSize;params.doneFunction=arguments[1]||null;break;default:window.console.error('Unexpected type of argument! Expected "string" or "object", got '+typeof arguments[0]);return false;}
setParameters(params);fixVerticalPosition();openModal();var modal=getModal();var onButtonEvent=function(e){var target=e.target||e.srcElement,targetedConfirm=(target.className.indexOf('confirm')>-1),modalIsVisible=hasClass(modal,'visible'),doneFunctionExists=(params.doneFunction&&modal.getAttribute('data-has-done-function')==='true');switch(e.type){case("click"):if(targetedConfirm&&doneFunctionExists&&modalIsVisible){params.doneFunction(true);if(params.closeOnConfirm){closeModal();}}else if(doneFunctionExists&&modalIsVisible){var functionAsStr=String(params.doneFunction).replace(/\s/g,'');var functionHandlesCancel=functionAsStr.substring(0,9)==="function("&&functionAsStr.substring(9,10)!==")";if(functionHandlesCancel){params.doneFunction(false);}
if(params.closeOnCancel){closeModal();}}else{closeModal();}
break;}};var $buttons=modal.querySelectorAll('button');for(var i=0;i<$buttons.length;i++){$buttons[i].onclick=onButtonEvent;}
previousDocumentClick=document.onclick;document.onclick=function(e){var target=e.target||e.srcElement;var clickedOnModal=(modal===target),clickedOnModalChild=isDescendant(modal,e.target),modalIsVisible=hasClass(modal,'visible'),outsideClickIsAllowed=modal.getAttribute('data-allow-ouside-click')==='true';if(!clickedOnModal&&!clickedOnModalChild&&modalIsVisible&&outsideClickIsAllowed){closeModal();}};var $okButton=modal.querySelector('button.confirm'),$cancelButton=modal.querySelector('button.cancel'),$modalButtons=modal.querySelectorAll('button:not([type=hidden])');function handleKeyDown(e){var keyCode=e.keyCode||e.which;if([9,13,32,27].indexOf(keyCode)===-1){return;}
var $targetElement=e.target||e.srcElement;var btnIndex=-1;for(var i=0;i<$modalButtons.length;i++){if($targetElement===$modalButtons[i]){btnIndex=i;break;}}
if(keyCode===9){if(btnIndex===-1){$targetElement=$okButton;}else{if(btnIndex===$modalButtons.length-1){$targetElement=$modalButtons[0];}else{$targetElement=$modalButtons[btnIndex+1];}}
stopEventPropagation(e);$targetElement.focus();}else{if(keyCode===13||keyCode===32){if(btnIndex===-1){$targetElement=$okButton;}else{$targetElement=undefined;}}else if(keyCode===27&&!($cancelButton.hidden||$cancelButton.style.display==='none')){$targetElement=$cancelButton;}else{$targetElement=undefined;}
if($targetElement!==undefined){fireClick($targetElement,e);}}}
previousWindowKeyDown=window.onkeydown;window.onkeydown=handleKeyDown;function handleOnBlur(e){var $targetElement=e.target||e.srcElement,$focusElement=e.relatedTarget,modalIsVisible=hasClass(modal,'visible');if(modalIsVisible){var btnIndex=-1;if($focusElement!==null){for(var i=0;i<$modalButtons.length;i++){if($focusElement===$modalButtons[i]){btnIndex=i;break;}}
if(btnIndex===-1){$targetElement.focus();}}else{lastFocusedButton=$targetElement;}}}
$okButton.onblur=handleOnBlur;$cancelButton.onblur=handleOnBlur;window.onfocus=function(){window.setTimeout(function(){if(lastFocusedButton!==undefined){lastFocusedButton.focus();lastFocusedButton=undefined;}},0);};};window.swal.setDefaults=function(userParams){if(!userParams){throw new Error('userParams is required');}
if(typeof userParams!=='object'){throw new Error('userParams has to be a object');}
extend(defaultParams,userParams);};function setParameters(params){var modal=getModal();var $title=modal.querySelector('h4'),$text=modal.querySelector('p'),$cancelBtn=modal.querySelector('button.cancel'),$confirmBtn=modal.querySelector('button.confirm');$title.innerHTML=escapeHtml(params.title).split("\n").join("<br>");$text.innerHTML=escapeHtml(params.text||'').split("\n").join("<br>");if(params.text){show($text);}
hide(modal.querySelectorAll('.icon'));if(params.type){var validType=false;for(var i=0;i<alertTypes.length;i++){if(params.type===alertTypes[i]){validType=true;break;}}
if(!validType){window.console.error('Unknown alert type: '+params.type);return false;}
var $icon=modal.querySelector('.icon.'+params.type);show($icon);switch(params.type){case"success":addClass($icon,'animate');addClass($icon.querySelector('.tip'),'animateSuccessTip');addClass($icon.querySelector('.long'),'animateSuccessLong');break;case"error":addClass($icon,'animateErrorIcon');addClass($icon.querySelector('.x-mark'),'animateXMark');break;case"warning":addClass($icon,'pulseWarning');addClass($icon.querySelector('.body'),'pulseWarningIns');addClass($icon.querySelector('.dot'),'pulseWarningIns');break;}}
if(params.imageUrl){var $customIcon=modal.querySelector('.icon.custom');$customIcon.style.backgroundImage='url('+params.imageUrl+')';show($customIcon);var _imgWidth=80,_imgHeight=80;if(params.imageSize){var imgWidth=params.imageSize.split('x')[0];var imgHeight=params.imageSize.split('x')[1];if(!imgWidth||!imgHeight){window.console.error("Parameter imageSize expects value with format WIDTHxHEIGHT, got "+params.imageSize);}else{_imgWidth=imgWidth;_imgHeight=imgHeight;$customIcon.css({'width':imgWidth+'px','height':imgHeight+'px'});}}
$customIcon.setAttribute('style',$customIcon.getAttribute('style')+'width:'+_imgWidth+'px; height:'+_imgHeight+'px');}
modal.setAttribute('data-has-cancel-button',params.showCancelButton);if(params.showCancelButton){$cancelBtn.style.display='inline-block';}else{hide($cancelBtn);}
if(params.cancelButtonText){$cancelBtn.innerHTML=escapeHtml(params.cancelButtonText);}
if(params.confirmButtonText){$confirmBtn.innerHTML=escapeHtml(params.confirmButtonText);}
$confirmBtn.className='confirm btn'
addClass($confirmBtn,params.confirmButtonClass);addClass($cancelBtn,params.cancelButtonClass);modal.setAttribute('data-allow-ouside-click',params.allowOutsideClick);var hasDoneFunction=(params.doneFunction)?true:false;modal.setAttribute('data-has-done-function',hasDoneFunction);modal.setAttribute('data-timer',params.timer);}
function colorLuminance(hex,lum){hex=String(hex).replace(/[^0-9a-f]/gi,'');if(hex.length<6){hex=hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];}
lum=lum||0;var rgb="#",c,i;for(i=0;i<3;i++){c=parseInt(hex.substr(i*2,2),16);c=Math.round(Math.min(Math.max(0,c+(c*lum)),255)).toString(16);rgb+=("00"+c).substr(c.length);}
return rgb;}
function extend(a,b){for(var key in b){if(b.hasOwnProperty(key)){a[key]=b[key];}}
return a;}
function hexToRgb(hex){var result=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);return result?parseInt(result[1],16)+', '+parseInt(result[2],16)+', '+parseInt(result[3],16):null;}
function setFocusStyle($button,bgColor){var rgbColor=hexToRgb(bgColor);$button.style.boxShadow='0 0 2px rgba('+rgbColor+', 0.8), inset 0 0 0 1px rgba(0, 0, 0, 0.05)';}
function openModal(){var modal=getModal();fadeIn(getOverlay(),10);show(modal);addClass(modal,'showSweetAlert');removeClass(modal,'hideSweetAlert');previousActiveElement=document.activeElement;var $okButton=modal.querySelector('button.confirm');$okButton.focus();setTimeout(function(){addClass(modal,'visible');},500);var timer=modal.getAttribute('data-timer');if(timer!=="null"&&timer!==""){setTimeout(function(){closeModal();},timer);}}
function closeModal(){var modal=getModal();fadeOut(getOverlay(),5);fadeOut(modal,5);removeClass(modal,'showSweetAlert');addClass(modal,'hideSweetAlert');removeClass(modal,'visible');var $successIcon=modal.querySelector('.icon.success');removeClass($successIcon,'animate');removeClass($successIcon.querySelector('.tip'),'animateSuccessTip');removeClass($successIcon.querySelector('.long'),'animateSuccessLong');var $errorIcon=modal.querySelector('.icon.error');removeClass($errorIcon,'animateErrorIcon');removeClass($errorIcon.querySelector('.x-mark'),'animateXMark');var $warningIcon=modal.querySelector('.icon.warning');removeClass($warningIcon,'pulseWarning');removeClass($warningIcon.querySelector('.body'),'pulseWarningIns');removeClass($warningIcon.querySelector('.dot'),'pulseWarningIns');window.onkeydown=previousWindowKeyDown;document.onclick=previousDocumentClick;if(previousActiveElement){previousActiveElement.focus();}
lastFocusedButton=undefined;}
function fixVerticalPosition(){var modal=getModal();modal.style.marginTop=getTopMargin(getModal());}
(function(){if(document.readyState==="complete"||document.readyState==="interactive"&&document.body){sweetAlertInitialize();}else{if(document.addEventListener){document.addEventListener('DOMContentLoaded',function factorial(){document.removeEventListener('DOMContentLoaded',arguments.callee,false);sweetAlertInitialize();},false);}else if(document.attachEvent){document.attachEvent('onreadystatechange',function(){if(document.readyState==='complete'){document.detachEvent('onreadystatechange',arguments.callee);sweetAlertInitialize();}});}}})();})(window,document);(function($){$.Jcrop=function(obj,opt){var options=$.extend({},$.Jcrop.defaults),docOffset,_ua=navigator.userAgent.toLowerCase(),is_msie=/msie/.test(_ua),ie6mode=/msie [1-6]\./.test(_ua);function px(n){return Math.round(n)+'px';}
function cssClass(cl){return options.baseClass+'-'+cl;}
function supportsColorFade(){return $.fx.step.hasOwnProperty('backgroundColor');}
function getPos(obj)
{var pos=$(obj).offset();return[pos.left,pos.top];}
function mouseAbs(e)
{return[(e.pageX-docOffset[0]),(e.pageY-docOffset[1])];}
function setOptions(opt)
{if(typeof(opt)!=='object')opt={};options=$.extend(options,opt);$.each(['onChange','onSelect','onRelease','onDblClick'],function(i,e){if(typeof(options[e])!=='function')options[e]=function(){};});}
function startDragMode(mode,pos,touch)
{docOffset=getPos($img);Tracker.setCursor(mode==='move'?mode:mode+'-resize');if(mode==='move'){return Tracker.activateHandlers(createMover(pos),doneSelect,touch);}
var fc=Coords.getFixed();var opp=oppLockCorner(mode);var opc=Coords.getCorner(oppLockCorner(opp));Coords.setPressed(Coords.getCorner(opp));Coords.setCurrent(opc);Tracker.activateHandlers(dragmodeHandler(mode,fc),doneSelect,touch);}
function dragmodeHandler(mode,f)
{return function(pos){if(!options.aspectRatio){switch(mode){case'e':pos[1]=f.y2;break;case'w':pos[1]=f.y2;break;case'n':pos[0]=f.x2;break;case's':pos[0]=f.x2;break;}}else{switch(mode){case'e':pos[1]=f.y+1;break;case'w':pos[1]=f.y+1;break;case'n':pos[0]=f.x+1;break;case's':pos[0]=f.x+1;break;}}
Coords.setCurrent(pos);Selection.update();};}
function createMover(pos)
{var lloc=pos;KeyManager.watchKeys();return function(pos){Coords.moveOffset([pos[0]-lloc[0],pos[1]-lloc[1]]);lloc=pos;Selection.update();};}
function oppLockCorner(ord)
{switch(ord){case'n':return'sw';case's':return'nw';case'e':return'nw';case'w':return'ne';case'ne':return'sw';case'nw':return'se';case'se':return'nw';case'sw':return'ne';}}
function createDragger(ord)
{return function(e){if(options.disabled){return false;}
if((ord==='move')&&!options.allowMove){return false;}
docOffset=getPos($img);btndown=true;startDragMode(ord,mouseAbs(e));e.stopPropagation();e.preventDefault();return false;};}
function presize($obj,w,h)
{var nw=$obj.width(),nh=$obj.height();if((nw>w)&&w>0){nw=w;nh=(w/$obj.width())*$obj.height();}
if((nh>h)&&h>0){nh=h;nw=(h/$obj.height())*$obj.width();}
xscale=$obj.width()/nw;yscale=$obj.height()/nh;$obj.width(nw).height(nh);}
function unscale(c)
{return{x:c.x*xscale,y:c.y*yscale,x2:c.x2*xscale,y2:c.y2*yscale,w:c.w*xscale,h:c.h*yscale};}
function doneSelect(pos)
{var c=Coords.getFixed();if((c.w>options.minSelect[0])&&(c.h>options.minSelect[1])){Selection.enableHandles();Selection.done();}else{Selection.release();}
Tracker.setCursor(options.allowSelect?'crosshair':'default');}
function newSelection(e)
{if(options.disabled){return false;}
if(!options.allowSelect){return false;}
btndown=true;docOffset=getPos($img);Selection.disableHandles();Tracker.setCursor('crosshair');var pos=mouseAbs(e);Coords.setPressed(pos);Selection.update();Tracker.activateHandlers(selectDrag,doneSelect,e.type.substring(0,5)==='touch');KeyManager.watchKeys();e.stopPropagation();e.preventDefault();return false;}
function selectDrag(pos)
{Coords.setCurrent(pos);Selection.update();}
function newTracker()
{var trk=$('<div></div>').addClass(cssClass('tracker'));if(is_msie){trk.css({opacity:0,backgroundColor:'white'});}
return trk;}
if(typeof(obj)!=='object'){obj=$(obj)[0];}
if(typeof(opt)!=='object'){opt={};}
setOptions(opt);var img_css={border:'none',visibility:'visible',margin:0,padding:0,position:'absolute',top:0,left:0};var $origimg=$(obj),img_mode=true;if(obj.tagName=='IMG'){if($origimg[0].width!=0&&$origimg[0].height!=0){$origimg.width($origimg[0].width);$origimg.height($origimg[0].height);}else{var tempImage=new Image();tempImage.src=$origimg[0].src;$origimg.width(tempImage.width);$origimg.height(tempImage.height);}
var $img=$origimg.clone().removeAttr('id').css(img_css).show();$img.width($origimg.width());$img.height($origimg.height());$origimg.after($img).hide();}else{$img=$origimg.css(img_css).show();img_mode=false;if(options.shade===null){options.shade=true;}}
presize($img,options.boxWidth,options.boxHeight);var boundx=$img.width(),boundy=$img.height(),$div=$('<div />').width(boundx).height(boundy).addClass(cssClass('holder')).css({position:'relative',backgroundColor:options.bgColor}).insertAfter($origimg).append($img);if(options.addClass){$div.addClass(options.addClass);}
var $img2=$('<div />'),$img_holder=$('<div />').width('100%').height('100%').css({zIndex:310,position:'absolute',overflow:'hidden'}),$hdl_holder=$('<div />').width('100%').height('100%').css('zIndex',320),$sel=$('<div />').css({position:'absolute',zIndex:600}).dblclick(function(){var c=Coords.getFixed();options.onDblClick.call(api,c);}).insertBefore($img).append($img_holder,$hdl_holder);if(img_mode){$img2=$('<img />').attr('src',$img.attr('src')).css(img_css).width(boundx).height(boundy),$img_holder.append($img2);}
if(ie6mode){$sel.css({overflowY:'hidden'});}
var bound=options.boundary;var $trk=newTracker().width(boundx+(bound*2)).height(boundy+(bound*2)).css({position:'absolute',top:px(-bound),left:px(-bound),zIndex:290}).mousedown(newSelection);var bgcolor=options.bgColor,bgopacity=options.bgOpacity,xlimit,ylimit,xmin,ymin,xscale,yscale,enabled=true,btndown,animating,shift_down;docOffset=getPos($img);var Touch=(function(){function hasTouchSupport(){var support={},events=['touchstart','touchmove','touchend'],el=document.createElement('div'),i;try{for(i=0;i<events.length;i++){var eventName=events[i];eventName='on'+eventName;var isSupported=(eventName in el);if(!isSupported){el.setAttribute(eventName,'return;');isSupported=typeof el[eventName]=='function';}
support[events[i]]=isSupported;}
return support.touchstart&&support.touchend&&support.touchmove;}
catch(err){return false;}}
function detectSupport(){if((options.touchSupport===true)||(options.touchSupport===false))return options.touchSupport;else return hasTouchSupport();}
return{createDragger:function(ord){return function(e){if(options.disabled){return false;}
if((ord==='move')&&!options.allowMove){return false;}
docOffset=getPos($img);btndown=true;startDragMode(ord,mouseAbs(Touch.cfilter(e)),true);e.stopPropagation();e.preventDefault();return false;};},newSelection:function(e){return newSelection(Touch.cfilter(e));},cfilter:function(e){e.pageX=e.originalEvent.changedTouches[0].pageX;e.pageY=e.originalEvent.changedTouches[0].pageY;return e;},fixTouchSupport:function(e){if($(e.currentTarget).hasClass('jcrop-tracker'))e.stopPropagation();},isSupported:hasTouchSupport,support:detectSupport()};}());var Coords=(function(){var x1=0,y1=0,x2=0,y2=0,ox,oy;function setPressed(pos)
{pos=rebound(pos);x2=x1=pos[0];y2=y1=pos[1];}
function setCurrent(pos)
{pos=rebound(pos);ox=pos[0]-x2;oy=pos[1]-y2;x2=pos[0];y2=pos[1];}
function getOffset()
{return[ox,oy];}
function moveOffset(offset)
{var ox=offset[0],oy=offset[1];if(0>x1+ox){ox-=ox+x1;}
if(0>y1+oy){oy-=oy+y1;}
if(boundy<y2+oy){oy+=boundy-(y2+oy);}
if(boundx<x2+ox){ox+=boundx-(x2+ox);}
x1+=ox;x2+=ox;y1+=oy;y2+=oy;}
function getCorner(ord)
{var c=getFixed();switch(ord){case'ne':return[c.x2,c.y];case'nw':return[c.x,c.y];case'se':return[c.x2,c.y2];case'sw':return[c.x,c.y2];}}
function getFixed()
{if(!options.aspectRatio){return getRect();}
var aspect=options.aspectRatio,min_x=options.minSize[0]/xscale,max_x=options.maxSize[0]/xscale,max_y=options.maxSize[1]/yscale,rw=x2-x1,rh=y2-y1,rwa=Math.abs(rw),rha=Math.abs(rh),real_ratio=rwa/rha,xx,yy,w,h;if(max_x===0){max_x=boundx*10;}
if(max_y===0){max_y=boundy*10;}
if(real_ratio<aspect){yy=y2;w=rha*aspect;xx=rw<0?x1-w:w+x1;if(xx<0){xx=0;h=Math.abs((xx-x1)/aspect);yy=rh<0?y1-h:h+y1;}else if(xx>boundx){xx=boundx;h=Math.abs((xx-x1)/aspect);yy=rh<0?y1-h:h+y1;}}else{xx=x2;h=rwa/aspect;yy=rh<0?y1-h:y1+h;if(yy<0){yy=0;w=Math.abs((yy-y1)*aspect);xx=rw<0?x1-w:w+x1;}else if(yy>boundy){yy=boundy;w=Math.abs(yy-y1)*aspect;xx=rw<0?x1-w:w+x1;}}
if(xx>x1){if(xx-x1<min_x){xx=x1+min_x;}else if(xx-x1>max_x){xx=x1+max_x;}
if(yy>y1){yy=y1+(xx-x1)/aspect;}else{yy=y1-(xx-x1)/aspect;}}else if(xx<x1){if(x1-xx<min_x){xx=x1-min_x;}else if(x1-xx>max_x){xx=x1-max_x;}
if(yy>y1){yy=y1+(x1-xx)/aspect;}else{yy=y1-(x1-xx)/aspect;}}
if(xx<0){x1-=xx;xx=0;}else if(xx>boundx){x1-=xx-boundx;xx=boundx;}
if(yy<0){y1-=yy;yy=0;}else if(yy>boundy){y1-=yy-boundy;yy=boundy;}
return makeObj(flipCoords(x1,y1,xx,yy));}
function rebound(p)
{if(p[0]<0)p[0]=0;if(p[1]<0)p[1]=0;if(p[0]>boundx)p[0]=boundx;if(p[1]>boundy)p[1]=boundy;return[Math.round(p[0]),Math.round(p[1])];}
function flipCoords(x1,y1,x2,y2)
{var xa=x1,xb=x2,ya=y1,yb=y2;if(x2<x1){xa=x2;xb=x1;}
if(y2<y1){ya=y2;yb=y1;}
return[xa,ya,xb,yb];}
function getRect()
{var xsize=x2-x1,ysize=y2-y1,delta;if(xlimit&&(Math.abs(xsize)>xlimit)){x2=(xsize>0)?(x1+xlimit):(x1-xlimit);}
if(ylimit&&(Math.abs(ysize)>ylimit)){y2=(ysize>0)?(y1+ylimit):(y1-ylimit);}
if(ymin/yscale&&(Math.abs(ysize)<ymin/yscale)){y2=(ysize>0)?(y1+ymin/yscale):(y1-ymin/yscale);}
if(xmin/xscale&&(Math.abs(xsize)<xmin/xscale)){x2=(xsize>0)?(x1+xmin/xscale):(x1-xmin/xscale);}
if(x1<0){x2-=x1;x1-=x1;}
if(y1<0){y2-=y1;y1-=y1;}
if(x2<0){x1-=x2;x2-=x2;}
if(y2<0){y1-=y2;y2-=y2;}
if(x2>boundx){delta=x2-boundx;x1-=delta;x2-=delta;}
if(y2>boundy){delta=y2-boundy;y1-=delta;y2-=delta;}
if(x1>boundx){delta=x1-boundy;y2-=delta;y1-=delta;}
if(y1>boundy){delta=y1-boundy;y2-=delta;y1-=delta;}
return makeObj(flipCoords(x1,y1,x2,y2));}
function makeObj(a)
{return{x:a[0],y:a[1],x2:a[2],y2:a[3],w:a[2]-a[0],h:a[3]-a[1]};}
return{flipCoords:flipCoords,setPressed:setPressed,setCurrent:setCurrent,getOffset:getOffset,moveOffset:moveOffset,getCorner:getCorner,getFixed:getFixed};}());var Shade=(function(){var enabled=false,holder=$('<div />').css({position:'absolute',zIndex:240,opacity:0}),shades={top:createShade(),left:createShade().height(boundy),right:createShade().height(boundy),bottom:createShade()};function resizeShades(w,h){shades.left.css({height:px(h)});shades.right.css({height:px(h)});}
function updateAuto()
{return updateShade(Coords.getFixed());}
function updateShade(c)
{shades.top.css({left:px(c.x),width:px(c.w),height:px(c.y)});shades.bottom.css({top:px(c.y2),left:px(c.x),width:px(c.w),height:px(boundy-c.y2)});shades.right.css({left:px(c.x2),width:px(boundx-c.x2)});shades.left.css({width:px(c.x)});}
function createShade(){return $('<div />').css({position:'absolute',backgroundColor:options.shadeColor||options.bgColor}).appendTo(holder);}
function enableShade(){if(!enabled){enabled=true;holder.insertBefore($img);updateAuto();Selection.setBgOpacity(1,0,1);$img2.hide();setBgColor(options.shadeColor||options.bgColor,1);if(Selection.isAwake())
{setOpacity(options.bgOpacity,1);}
else setOpacity(1,1);}}
function setBgColor(color,now){colorChangeMacro(getShades(),color,now);}
function disableShade(){if(enabled){holder.remove();$img2.show();enabled=false;if(Selection.isAwake()){Selection.setBgOpacity(options.bgOpacity,1,1);}else{Selection.setBgOpacity(1,1,1);Selection.disableHandles();}
colorChangeMacro($div,0,1);}}
function setOpacity(opacity,now){if(enabled){if(options.bgFade&&!now){holder.animate({opacity:1-opacity},{queue:false,duration:options.fadeTime});}
else holder.css({opacity:1-opacity});}}
function refreshAll(){options.shade?enableShade():disableShade();if(Selection.isAwake())setOpacity(options.bgOpacity);}
function getShades(){return holder.children();}
return{update:updateAuto,updateRaw:updateShade,getShades:getShades,setBgColor:setBgColor,enable:enableShade,disable:disableShade,resize:resizeShades,refresh:refreshAll,opacity:setOpacity};}());var Selection=(function(){var awake,hdep=370,borders={},handle={},dragbar={},seehandles=false;function insertBorder(type)
{var jq=$('<div />').css({position:'absolute',opacity:options.borderOpacity}).addClass(cssClass(type));$img_holder.append(jq);return jq;}
function dragDiv(ord,zi)
{var jq=$('<div />').mousedown(createDragger(ord)).css({cursor:ord+'-resize',position:'absolute',zIndex:zi}).addClass('ord-'+ord);if(Touch.support){jq.bind('touchstart.jcrop',Touch.createDragger(ord));}
$hdl_holder.append(jq);return jq;}
function insertHandle(ord)
{var hs=options.handleSize,div=dragDiv(ord,hdep++).css({opacity:options.handleOpacity}).addClass(cssClass('handle'));if(hs){div.width(hs).height(hs);}
return div;}
function insertDragbar(ord)
{return dragDiv(ord,hdep++).addClass('jcrop-dragbar');}
function createDragbars(li)
{var i;for(i=0;i<li.length;i++){dragbar[li[i]]=insertDragbar(li[i]);}}
function createBorders(li)
{var cl,i;for(i=0;i<li.length;i++){switch(li[i]){case'n':cl='hline';break;case's':cl='hline bottom';break;case'e':cl='vline right';break;case'w':cl='vline';break;}
borders[li[i]]=insertBorder(cl);}}
function createHandles(li)
{var i;for(i=0;i<li.length;i++){handle[li[i]]=insertHandle(li[i]);}}
function moveto(x,y)
{if(!options.shade){$img2.css({top:px(-y),left:px(-x)});}
$sel.css({top:px(y),left:px(x)});}
function resize(w,h)
{$sel.width(Math.round(w)).height(Math.round(h));}
function refresh()
{var c=Coords.getFixed();Coords.setPressed([c.x,c.y]);Coords.setCurrent([c.x2,c.y2]);updateVisible();}
function updateVisible(select)
{if(awake){return update(select);}}
function update(select)
{var c=Coords.getFixed();resize(c.w,c.h);moveto(c.x,c.y);if(options.shade)Shade.updateRaw(c);awake||show();if(select){options.onSelect.call(api,unscale(c));}else{options.onChange.call(api,unscale(c));}}
function setBgOpacity(opacity,force,now)
{if(!awake&&!force)return;if(options.bgFade&&!now){$img.animate({opacity:opacity},{queue:false,duration:options.fadeTime});}else{$img.css('opacity',opacity);}}
function show()
{$sel.show();if(options.shade)Shade.opacity(bgopacity);else setBgOpacity(bgopacity,true);awake=true;}
function release()
{disableHandles();$sel.hide();if(options.shade)Shade.opacity(1);else setBgOpacity(1);awake=false;options.onRelease.call(api);}
function showHandles()
{if(seehandles){$hdl_holder.show();}}
function enableHandles()
{seehandles=true;if(options.allowResize){$hdl_holder.show();return true;}}
function disableHandles()
{seehandles=false;$hdl_holder.hide();}
function animMode(v)
{if(v){animating=true;disableHandles();}else{animating=false;enableHandles();}}
function done()
{animMode(false);refresh();}
if(options.dragEdges&&$.isArray(options.createDragbars))
createDragbars(options.createDragbars);if($.isArray(options.createHandles))
createHandles(options.createHandles);if(options.drawBorders&&$.isArray(options.createBorders))
createBorders(options.createBorders);$(document).bind('touchstart.jcrop-ios',Touch.fixTouchSupport);var $track=newTracker().mousedown(createDragger('move')).css({cursor:'move',position:'absolute',zIndex:360});if(Touch.support){$track.bind('touchstart.jcrop',Touch.createDragger('move'));}
$img_holder.append($track);disableHandles();return{updateVisible:updateVisible,update:update,release:release,refresh:refresh,isAwake:function(){return awake;},setCursor:function(cursor){$track.css('cursor',cursor);},enableHandles:enableHandles,enableOnly:function(){seehandles=true;},showHandles:showHandles,disableHandles:disableHandles,animMode:animMode,setBgOpacity:setBgOpacity,done:done};}());var Tracker=(function(){var onMove=function(){},onDone=function(){},trackDoc=options.trackDocument;function toFront(touch)
{$trk.css({zIndex:450});if(touch)
$(document).bind('touchmove.jcrop',trackTouchMove).bind('touchend.jcrop',trackTouchEnd);else if(trackDoc)
$(document).bind('mousemove.jcrop',trackMove).bind('mouseup.jcrop',trackUp);}
function toBack()
{$trk.css({zIndex:290});$(document).unbind('.jcrop');}
function trackMove(e)
{onMove(mouseAbs(e));return false;}
function trackUp(e)
{e.preventDefault();e.stopPropagation();if(btndown){btndown=false;onDone(mouseAbs(e));if(Selection.isAwake()){options.onSelect.call(api,unscale(Coords.getFixed()));}
toBack();onMove=function(){};onDone=function(){};}
return false;}
function activateHandlers(move,done,touch)
{btndown=true;onMove=move;onDone=done;toFront(touch);return false;}
function trackTouchMove(e)
{onMove(mouseAbs(Touch.cfilter(e)));return false;}
function trackTouchEnd(e)
{return trackUp(Touch.cfilter(e));}
function setCursor(t)
{$trk.css('cursor',t);}
if(!trackDoc){$trk.mousemove(trackMove).mouseup(trackUp).mouseout(trackUp);}
$img.before($trk);return{activateHandlers:activateHandlers,setCursor:setCursor};}());var KeyManager=(function(){var $keymgr=$('<input type="radio" />').css({position:'fixed',left:'-120px',width:'12px'}).addClass('jcrop-keymgr'),$keywrap=$('<div />').css({position:'absolute',overflow:'hidden'}).append($keymgr);function watchKeys()
{if(options.keySupport){$keymgr.show();$keymgr.focus();}}
function onBlur(e)
{$keymgr.hide();}
function doNudge(e,x,y)
{if(options.allowMove){Coords.moveOffset([x,y]);Selection.updateVisible(true);}
e.preventDefault();e.stopPropagation();}
function parseKey(e)
{if(e.ctrlKey||e.metaKey){return true;}
shift_down=e.shiftKey?true:false;var nudge=shift_down?10:1;switch(e.keyCode){case 37:doNudge(e,-nudge,0);break;case 39:doNudge(e,nudge,0);break;case 38:doNudge(e,0,-nudge);break;case 40:doNudge(e,0,nudge);break;case 27:if(options.allowSelect)Selection.release();break;case 9:return true;}
return false;}
if(options.keySupport){$keymgr.keydown(parseKey).blur(onBlur);if(ie6mode||!options.fixedSupport){$keymgr.css({position:'absolute',left:'-20px'});$keywrap.append($keymgr).insertBefore($img);}else{$keymgr.insertBefore($img);}}
return{watchKeys:watchKeys};}());function setClass(cname)
{$div.removeClass().addClass(cssClass('holder')).addClass(cname);}
function animateTo(a,callback)
{var x1=a[0]/xscale,y1=a[1]/yscale,x2=a[2]/xscale,y2=a[3]/yscale;if(animating){return;}
var animto=Coords.flipCoords(x1,y1,x2,y2),c=Coords.getFixed(),initcr=[c.x,c.y,c.x2,c.y2],animat=initcr,interv=options.animationDelay,ix1=animto[0]-initcr[0],iy1=animto[1]-initcr[1],ix2=animto[2]-initcr[2],iy2=animto[3]-initcr[3],pcent=0,velocity=options.swingSpeed;x1=animat[0];y1=animat[1];x2=animat[2];y2=animat[3];Selection.animMode(true);var anim_timer;function queueAnimator(){window.setTimeout(animator,interv);}
var animator=(function(){return function(){pcent+=(100-pcent)/velocity;animat[0]=Math.round(x1+((pcent/100)*ix1));animat[1]=Math.round(y1+((pcent/100)*iy1));animat[2]=Math.round(x2+((pcent/100)*ix2));animat[3]=Math.round(y2+((pcent/100)*iy2));if(pcent>=99.8){pcent=100;}
if(pcent<100){setSelectRaw(animat);queueAnimator();}else{Selection.done();Selection.animMode(false);if(typeof(callback)==='function'){callback.call(api);}}};}());queueAnimator();}
function setSelect(rect)
{setSelectRaw([rect[0]/xscale,rect[1]/yscale,rect[2]/xscale,rect[3]/yscale]);options.onSelect.call(api,unscale(Coords.getFixed()));Selection.enableHandles();}
function setSelectRaw(l)
{Coords.setPressed([l[0],l[1]]);Coords.setCurrent([l[2],l[3]]);Selection.update();}
function tellSelect()
{return unscale(Coords.getFixed());}
function tellScaled()
{return Coords.getFixed();}
function setOptionsNew(opt)
{setOptions(opt);interfaceUpdate();}
function disableCrop()
{options.disabled=true;Selection.disableHandles();Selection.setCursor('default');Tracker.setCursor('default');}
function enableCrop()
{options.disabled=false;interfaceUpdate();}
function cancelCrop()
{Selection.done();Tracker.activateHandlers(null,null);}
function destroy()
{$(document).unbind('touchstart.jcrop-ios',Touch.fixTouchSupport);$div.remove();$origimg.show();$origimg.css('visibility','visible');$(obj).removeData('Jcrop');}
function setImage(src,callback)
{Selection.release();disableCrop();var img=new Image();img.onload=function(){var iw=img.width;var ih=img.height;var bw=options.boxWidth;var bh=options.boxHeight;$img.width(iw).height(ih);$img.attr('src',src);$img2.attr('src',src);presize($img,bw,bh);boundx=$img.width();boundy=$img.height();$img2.width(boundx).height(boundy);$trk.width(boundx+(bound*2)).height(boundy+(bound*2));$div.width(boundx).height(boundy);Shade.resize(boundx,boundy);enableCrop();if(typeof(callback)==='function'){callback.call(api);}};img.src=src;}
function colorChangeMacro($obj,color,now){var mycolor=color||options.bgColor;if(options.bgFade&&supportsColorFade()&&options.fadeTime&&!now){$obj.animate({backgroundColor:mycolor},{queue:false,duration:options.fadeTime});}else{$obj.css('backgroundColor',mycolor);}}
function interfaceUpdate(alt)
{if(options.allowResize){if(alt){Selection.enableOnly();}else{Selection.enableHandles();}}else{Selection.disableHandles();}
Tracker.setCursor(options.allowSelect?'crosshair':'default');Selection.setCursor(options.allowMove?'move':'default');if(options.hasOwnProperty('trueSize')){xscale=options.trueSize[0]/boundx;yscale=options.trueSize[1]/boundy;}
if(options.hasOwnProperty('setSelect')){setSelect(options.setSelect);Selection.done();delete(options.setSelect);}
Shade.refresh();if(options.bgColor!=bgcolor){colorChangeMacro(options.shade?Shade.getShades():$div,options.shade?(options.shadeColor||options.bgColor):options.bgColor);bgcolor=options.bgColor;}
if(bgopacity!=options.bgOpacity){bgopacity=options.bgOpacity;if(options.shade)Shade.refresh();else Selection.setBgOpacity(bgopacity);}
xlimit=options.maxSize[0]||0;ylimit=options.maxSize[1]||0;xmin=options.minSize[0]||0;ymin=options.minSize[1]||0;if(options.hasOwnProperty('outerImage')){$img.attr('src',options.outerImage);delete(options.outerImage);}
Selection.refresh();}
if(Touch.support)$trk.bind('touchstart.jcrop',Touch.newSelection);$hdl_holder.hide();interfaceUpdate(true);var api={setImage:setImage,animateTo:animateTo,setSelect:setSelect,setOptions:setOptionsNew,tellSelect:tellSelect,tellScaled:tellScaled,setClass:setClass,disable:disableCrop,enable:enableCrop,cancel:cancelCrop,release:Selection.release,destroy:destroy,focus:KeyManager.watchKeys,getBounds:function(){return[boundx*xscale,boundy*yscale];},getWidgetSize:function(){return[boundx,boundy];},getScaleFactor:function(){return[xscale,yscale];},getOptions:function(){return options;},ui:{holder:$div,selection:$sel}};if(is_msie)$div.bind('selectstart',function(){return false;});$origimg.data('Jcrop',api);return api;};$.fn.Jcrop=function(options,callback)
{var api;this.each(function(){if($(this).data('Jcrop')){if(options==='api')return $(this).data('Jcrop');else $(this).data('Jcrop').setOptions(options);}
else{if(this.tagName=='IMG')
$.Jcrop.Loader(this,function(){$(this).css({display:'block',visibility:'hidden'});api=$.Jcrop(this,options);if($.isFunction(callback))callback.call(api);});else{$(this).css({display:'block',visibility:'hidden'});api=$.Jcrop(this,options);if($.isFunction(callback))callback.call(api);}}});return this;};$.Jcrop.Loader=function(imgobj,success,error){var $img=$(imgobj),img=$img[0];function completeCheck(){if(img.complete){$img.unbind('.jcloader');if($.isFunction(success))success.call(img);}
else window.setTimeout(completeCheck,50);}
$img.bind('load.jcloader',completeCheck).bind('error.jcloader',function(e){$img.unbind('.jcloader');if($.isFunction(error))error.call(img);});if(img.complete&&$.isFunction(success)){$img.unbind('.jcloader');success.call(img);}};$.Jcrop.defaults={allowSelect:true,allowMove:true,allowResize:true,trackDocument:true,baseClass:'jcrop',addClass:null,bgColor:'black',bgOpacity:0.6,bgFade:false,borderOpacity:0.4,handleOpacity:0.5,handleSize:null,aspectRatio:0,keySupport:true,createHandles:['n','s','e','w','nw','ne','se','sw'],createDragbars:['n','s','e','w'],createBorders:['n','s','e','w'],drawBorders:true,dragEdges:true,fixedSupport:true,touchSupport:null,shade:null,boxWidth:0,boxHeight:0,boundary:2,fadeTime:400,animationDelay:20,swingSpeed:3,minSelect:[0,0],maxSize:[0,0],minSize:[0,0],onChange:function(){},onSelect:function(){},onDblClick:function(){},onRelease:function(){}};}(jQuery));+function($){"use strict";if($.oc===undefined)
$.oc={}
if($.oc.foundation===undefined)
$.oc.foundation={}
$.oc.foundation._proxyCounter=0
var Base=function(){this.proxiedMethods={}}
Base.prototype.dispose=function()
{for(var key in this.proxiedMethods){this.proxiedMethods[key]=null}
this.proxiedMethods=null}
Base.prototype.proxy=function(method){if(method.ocProxyId===undefined){$.oc.foundation._proxyCounter++
method.ocProxyId=$.oc.foundation._proxyCounter}
if(this.proxiedMethods[method.ocProxyId]!==undefined)
return this.proxiedMethods[method.ocProxyId]
this.proxiedMethods[method.ocProxyId]=method.bind(this)
return this.proxiedMethods[method.ocProxyId]}
$.oc.foundation.base=Base;}(window.jQuery);+function($){"use strict";if($.oc===undefined)
$.oc={}
if($.oc.foundation===undefined)
$.oc.foundation={}
var Element={hasClass:function(el,className){if(el.classList)
return el.classList.contains(className);return new RegExp('(^| )'+className+'( |$)','gi').test(el.className);},addClass:function(el,className){if(this.hasClass(el,className))
return
if(el.classList)
el.classList.add(className);else
el.className+=' '+className;},removeClass:function(el,className){if(el.classList)
el.classList.remove(className);else
el.className=el.className.replace(new RegExp('(^|\\b)'+className.split(' ').join('|')+'(\\b|$)','gi'),' ');},absolutePosition:function(element,ignoreScrolling){var top=ignoreScrolling===true?0:document.body.scrollTop,left=0
do{top+=element.offsetTop||0;if(ignoreScrolling!==true)
top-=element.scrollTop||0
left+=element.offsetLeft||0
element=element.offsetParent}while(element)
return{top:top,left:left}},getCaretPosition:function(input){if(document.selection){var selection=document.selection.createRange()
selection.moveStart('character',-input.value.length)
return selection.text.length}
if(input.selectionStart!==undefined)
return input.selectionStart
return 0},setCaretPosition:function(input,position){if(document.selection){var range=input.createTextRange()
setTimeout(function(){range.collapse(true)
range.moveStart("character",position)
range.moveEnd("character",0)
range.select()
range=null
input=null},0)}
if(input.selectionStart!==undefined){setTimeout(function(){input.selectionStart=position
input.selectionEnd=position
input=null},0)}}}
$.oc.foundation.element=Element;}(window.jQuery);+function($){"use strict";if($.oc===undefined)
$.oc={}
if($.oc.foundation===undefined)
$.oc.foundation={}
var Event={getTarget:function(ev,tag){var target=ev.target?ev.target:ev.srcElement
if(tag===undefined)
return target
var tagName=target.tagName
while(tagName!=tag){target=target.parentNode
if(!target)
return null
tagName=target.tagName}
return target},stop:function(ev){if(ev.stopPropagation)
ev.stopPropagation()
else
ev.cancelBubble=true
if(ev.preventDefault)
ev.preventDefault()
else
ev.returnValue=false},pageCoordinates:function(ev){if(ev.pageX||ev.pageY){return{x:ev.pageX,y:ev.pageY}}
else if(ev.clientX||ev.clientY){return{x:(ev.clientX+document.body.scrollLeft+document.documentElement.scrollLeft),y:(ev.clientY+document.body.scrollTop+document.documentElement.scrollTop)}}
return{x:0,y:0}}}
$.oc.foundation.event=Event;}(window.jQuery);+function($){"use strict";if($.oc===undefined)
$.oc={}
if($.oc.foundation===undefined)
$.oc.foundation={}
var ControlUtils={markDisposable:function(el){el.setAttribute('data-disposable','')},disposeControls:function(container){var controls=container.querySelectorAll('[data-disposable]')
for(var i=0,len=controls.length;i<len;i++)
$(controls[i]).triggerHandler('dispose-control')
if(container.hasAttribute('data-disposable'))
$(container).triggerHandler('dispose-control')}}
$.oc.foundation.controlUtils=ControlUtils;$(document).on('ajaxBeforeReplace',function(ev){$.oc.foundation.controlUtils.disposeControls(ev.target)})}(window.jQuery);+function($){'use strict';function transitionEnd(){var el=document.createElement('bootstrap')
var transEndEventNames={'WebkitTransition':'webkitTransitionEnd','MozTransition':'transitionend','OTransition':'oTransitionEnd otransitionend','transition':'transitionend'}
for(var name in transEndEventNames){if(el.style[name]!==undefined){return{end:transEndEventNames[name]}}}
return false}
$.fn.emulateTransitionEnd=function(duration){var called=false,$el=this
$(this).one($.support.transition.end,function(){called=true})
var callback=function(){if(!called)$($el).trigger($.support.transition.end)}
setTimeout(callback,duration)
return this}
$(function(){$.support.transition=transitionEnd()})}(jQuery);+function($){"use strict";var FlashMessage=function(options,el){var
options=$.extend({},FlashMessage.DEFAULTS,options),$element=$(el)
$('body > p.flash-message').remove()
if($element.length==0)
$element=$('<p/>').addClass(options.class).html(options.text)
$element.addClass('flash-message fade')
$element.attr('data-control',null)
$element.append('<button type="button" class="close" aria-hidden="true">&times;</button>')
$element.on('click','button',remove)
$element.on('click',remove)
$(document.body).append($element)
setTimeout(function(){$element.addClass('in')},1)
var timer=window.setTimeout(remove,options.interval*1000)
function removeElement(){$element.remove()}
function remove(){window.clearInterval(timer)
$element.removeClass('in')
$.support.transition&&$element.hasClass('fade')?$element.one($.support.transition.end,removeElement).emulateTransitionEnd(500):removeElement()}}
FlashMessage.DEFAULTS={class:'success',text:'Default text',interval:2}
if($.oc===undefined)
$.oc={}
$.oc.flashMsg=FlashMessage
$(document).render(function(){$('[data-control=flash-message]').each(function(){$.oc.flashMsg($(this).data(),this)})})}(window.jQuery);;window.Modernizr=(function(window,document,undefined){var version='2.8.3',Modernizr={},enableClasses=true,docElement=document.documentElement,mod='modernizr',modElem=document.createElement(mod),mStyle=modElem.style,inputElem=document.createElement('input'),smile=':)',toString={}.toString,prefixes=' -webkit- -moz- -o- -ms- '.split(' '),omPrefixes='Webkit Moz O ms',cssomPrefixes=omPrefixes.split(' '),domPrefixes=omPrefixes.toLowerCase().split(' '),ns={'svg':'http://www.w3.org/2000/svg'},tests={},inputs={},attrs={},classes=[],slice=classes.slice,featureName,injectElementWithStyles=function(rule,callback,nodes,testnames){var style,ret,node,docOverflow,div=document.createElement('div'),body=document.body,fakeBody=body||document.createElement('body');if(parseInt(nodes,10)){while(nodes--){node=document.createElement('div');node.id=testnames?testnames[nodes]:mod+(nodes+1);div.appendChild(node);}}
style=['&#173;','<style id="s',mod,'">',rule,'</style>'].join('');div.id=mod;(body?div:fakeBody).innerHTML+=style;fakeBody.appendChild(div);if(!body){fakeBody.style.background='';fakeBody.style.overflow='hidden';docOverflow=docElement.style.overflow;docElement.style.overflow='hidden';docElement.appendChild(fakeBody);}
ret=callback(div,rule);if(!body){fakeBody.parentNode.removeChild(fakeBody);docElement.style.overflow=docOverflow;}else{div.parentNode.removeChild(div);}
return!!ret;},testMediaQuery=function(mq){var matchMedia=window.matchMedia||window.msMatchMedia;if(matchMedia){return matchMedia(mq)&&matchMedia(mq).matches||false;}
var bool;injectElementWithStyles('@media '+mq+' { #'+mod+' { position: absolute; } }',function(node){bool=(window.getComputedStyle?getComputedStyle(node,null):node.currentStyle)['position']=='absolute';});return bool;},isEventSupported=(function(){var TAGNAMES={'select':'input','change':'input','submit':'form','reset':'form','error':'img','load':'img','abort':'img'};function isEventSupported(eventName,element){element=element||document.createElement(TAGNAMES[eventName]||'div');eventName='on'+eventName;var isSupported=eventName in element;if(!isSupported){if(!element.setAttribute){element=document.createElement('div');}
if(element.setAttribute&&element.removeAttribute){element.setAttribute(eventName,'');isSupported=is(element[eventName],'function');if(!is(element[eventName],'undefined')){element[eventName]=undefined;}
element.removeAttribute(eventName);}}
element=null;return isSupported;}
return isEventSupported;})(),_hasOwnProperty=({}).hasOwnProperty,hasOwnProp;if(!is(_hasOwnProperty,'undefined')&&!is(_hasOwnProperty.call,'undefined')){hasOwnProp=function(object,property){return _hasOwnProperty.call(object,property);};}
else{hasOwnProp=function(object,property){return((property in object)&&is(object.constructor.prototype[property],'undefined'));};}
if(!Function.prototype.bind){Function.prototype.bind=function bind(that){var target=this;if(typeof target!="function"){throw new TypeError();}
var args=slice.call(arguments,1),bound=function(){if(this instanceof bound){var F=function(){};F.prototype=target.prototype;var self=new F();var result=target.apply(self,args.concat(slice.call(arguments)));if(Object(result)===result){return result;}
return self;}else{return target.apply(that,args.concat(slice.call(arguments)));}};return bound;};}
function setCss(str){mStyle.cssText=str;}
function setCssAll(str1,str2){return setCss(prefixes.join(str1+';')+(str2||''));}
function is(obj,type){return typeof obj===type;}
function contains(str,substr){return!!~(''+str).indexOf(substr);}
function testProps(props,prefixed){for(var i in props){var prop=props[i];if(!contains(prop,"-")&&mStyle[prop]!==undefined){return prefixed=='pfx'?prop:true;}}
return false;}
function testDOMProps(props,obj,elem){for(var i in props){var item=obj[props[i]];if(item!==undefined){if(elem===false)return props[i];if(is(item,'function')){return item.bind(elem||obj);}
return item;}}
return false;}
function testPropsAll(prop,prefixed,elem){var ucProp=prop.charAt(0).toUpperCase()+prop.slice(1),props=(prop+' '+cssomPrefixes.join(ucProp+' ')+ucProp).split(' ');if(is(prefixed,"string")||is(prefixed,"undefined")){return testProps(props,prefixed);}else{props=(prop+' '+(domPrefixes).join(ucProp+' ')+ucProp).split(' ');return testDOMProps(props,prefixed,elem);}}tests['flexbox']=function(){return testPropsAll('flexWrap');};tests['flexboxlegacy']=function(){return testPropsAll('boxDirection');};tests['canvas']=function(){var elem=document.createElement('canvas');return!!(elem.getContext&&elem.getContext('2d'));};tests['canvastext']=function(){return!!(Modernizr['canvas']&&is(document.createElement('canvas').getContext('2d').fillText,'function'));};tests['webgl']=function(){return!!window.WebGLRenderingContext;};tests['touch']=function(){var bool;if(('ontouchstart'in window)||window.DocumentTouch&&document instanceof DocumentTouch){bool=true;}else{injectElementWithStyles(['@media (',prefixes.join('touch-enabled),('),mod,')','{#modernizr{top:9px;position:absolute}}'].join(''),function(node){bool=node.offsetTop===9;});}
return bool;};tests['geolocation']=function(){return'geolocation'in navigator;};tests['postmessage']=function(){return!!window.postMessage;};tests['websqldatabase']=function(){return!!window.openDatabase;};tests['indexedDB']=function(){return!!testPropsAll("indexedDB",window);};tests['hashchange']=function(){return isEventSupported('hashchange',window)&&(document.documentMode===undefined||document.documentMode>7);};tests['history']=function(){return!!(window.history&&history.pushState);};tests['draganddrop']=function(){var div=document.createElement('div');return('draggable'in div)||('ondragstart'in div&&'ondrop'in div);};tests['websockets']=function(){return'WebSocket'in window||'MozWebSocket'in window;};tests['rgba']=function(){setCss('background-color:rgba(150,255,150,.5)');return contains(mStyle.backgroundColor,'rgba');};tests['hsla']=function(){setCss('background-color:hsla(120,40%,100%,.5)');return contains(mStyle.backgroundColor,'rgba')||contains(mStyle.backgroundColor,'hsla');};tests['multiplebgs']=function(){setCss('background:url(https://),url(https://),red url(https://)');return(/(url\s*\(.*?){3}/).test(mStyle.background);};tests['backgroundsize']=function(){return testPropsAll('backgroundSize');};tests['borderimage']=function(){return testPropsAll('borderImage');};tests['borderradius']=function(){return testPropsAll('borderRadius');};tests['boxshadow']=function(){return testPropsAll('boxShadow');};tests['textshadow']=function(){return document.createElement('div').style.textShadow==='';};tests['opacity']=function(){setCssAll('opacity:.55');return(/^0.55$/).test(mStyle.opacity);};tests['cssanimations']=function(){return testPropsAll('animationName');};tests['csscolumns']=function(){return testPropsAll('columnCount');};tests['cssgradients']=function(){var str1='background-image:',str2='gradient(linear,left top,right bottom,from(#9f9),to(white));',str3='linear-gradient(left top,#9f9, white);';setCss((str1+'-webkit- '.split(' ').join(str2+str1)+
prefixes.join(str3+str1)).slice(0,-str1.length));return contains(mStyle.backgroundImage,'gradient');};tests['cssreflections']=function(){return testPropsAll('boxReflect');};tests['csstransforms']=function(){return!!testPropsAll('transform');};tests['csstransforms3d']=function(){var ret=!!testPropsAll('perspective');if(ret&&'webkitPerspective'in docElement.style){injectElementWithStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}',function(node,rule){ret=node.offsetLeft===9&&node.offsetHeight===3;});}
return ret;};tests['csstransitions']=function(){return testPropsAll('transition');};tests['fontface']=function(){var bool;injectElementWithStyles('@font-face {font-family:"font";src:url("https://")}',function(node,rule){var style=document.getElementById('smodernizr'),sheet=style.sheet||style.styleSheet,cssText=sheet?(sheet.cssRules&&sheet.cssRules[0]?sheet.cssRules[0].cssText:sheet.cssText||''):'';bool=/src/i.test(cssText)&&cssText.indexOf(rule.split(' ')[0])===0;});return bool;};tests['generatedcontent']=function(){var bool;injectElementWithStyles(['#',mod,'{font:0/0 a}#',mod,':after{content:"',smile,'";visibility:hidden;font:3px/1 a}'].join(''),function(node){bool=node.offsetHeight>=3;});return bool;};tests['video']=function(){var elem=document.createElement('video'),bool=false;try{if(bool=!!elem.canPlayType){bool=new Boolean(bool);bool.ogg=elem.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,'');bool.h264=elem.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,'');bool.webm=elem.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,'');}}catch(e){}
return bool;};tests['audio']=function(){var elem=document.createElement('audio'),bool=false;try{if(bool=!!elem.canPlayType){bool=new Boolean(bool);bool.ogg=elem.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,'');bool.mp3=elem.canPlayType('audio/mpeg;').replace(/^no$/,'');bool.wav=elem.canPlayType('audio/wav; codecs="1"').replace(/^no$/,'');bool.m4a=(elem.canPlayType('audio/x-m4a;')||elem.canPlayType('audio/aac;')).replace(/^no$/,'');}}catch(e){}
return bool;};tests['localstorage']=function(){try{localStorage.setItem(mod,mod);localStorage.removeItem(mod);return true;}catch(e){return false;}};tests['sessionstorage']=function(){try{sessionStorage.setItem(mod,mod);sessionStorage.removeItem(mod);return true;}catch(e){return false;}};tests['webworkers']=function(){return!!window.Worker;};tests['applicationcache']=function(){return!!window.applicationCache;};tests['svg']=function(){return!!document.createElementNS&&!!document.createElementNS(ns.svg,'svg').createSVGRect;};tests['inlinesvg']=function(){var div=document.createElement('div');div.innerHTML='<svg/>';return(div.firstChild&&div.firstChild.namespaceURI)==ns.svg;};tests['smil']=function(){return!!document.createElementNS&&/SVGAnimate/.test(toString.call(document.createElementNS(ns.svg,'animate')));};tests['svgclippaths']=function(){return!!document.createElementNS&&/SVGClipPath/.test(toString.call(document.createElementNS(ns.svg,'clipPath')));};function webforms(){Modernizr['input']=(function(props){for(var i=0,len=props.length;i<len;i++){attrs[props[i]]=!!(props[i]in inputElem);}
if(attrs.list){attrs.list=!!(document.createElement('datalist')&&window.HTMLDataListElement);}
return attrs;})('autocomplete autofocus list placeholder max min multiple pattern required step'.split(' '));Modernizr['inputtypes']=(function(props){for(var i=0,bool,inputElemType,defaultView,len=props.length;i<len;i++){inputElem.setAttribute('type',inputElemType=props[i]);bool=inputElem.type!=='text';if(bool){inputElem.value=smile;inputElem.style.cssText='position:absolute;visibility:hidden;';if(/^range$/.test(inputElemType)&&inputElem.style.WebkitAppearance!==undefined){docElement.appendChild(inputElem);defaultView=document.defaultView;bool=defaultView.getComputedStyle&&defaultView.getComputedStyle(inputElem,null).WebkitAppearance!=='textfield'&&(inputElem.offsetHeight!==0);docElement.removeChild(inputElem);}else if(/^(search|tel)$/.test(inputElemType)){}else if(/^(url|email)$/.test(inputElemType)){bool=inputElem.checkValidity&&inputElem.checkValidity()===false;}else{bool=inputElem.value!=smile;}}
inputs[props[i]]=!!bool;}
return inputs;})('search tel url email datetime date month week time datetime-local number range color'.split(' '));}
for(var feature in tests){if(hasOwnProp(tests,feature)){featureName=feature.toLowerCase();Modernizr[featureName]=tests[feature]();classes.push((Modernizr[featureName]?'':'no-')+featureName);}}
Modernizr.input||webforms();Modernizr.addTest=function(feature,test){if(typeof feature=='object'){for(var key in feature){if(hasOwnProp(feature,key)){Modernizr.addTest(key,feature[key]);}}}else{feature=feature.toLowerCase();if(Modernizr[feature]!==undefined){return Modernizr;}
test=typeof test=='function'?test():test;if(typeof enableClasses!=="undefined"&&enableClasses){docElement.className+=' '+(test?'':'no-')+feature;}
Modernizr[feature]=test;}
return Modernizr;};setCss('');modElem=inputElem=null;;(function(window,document){var version='3.7.0';var options=window.html5||{};var reSkip=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;var saveClones=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;var supportsHtml5Styles;var expando='_html5shiv';var expanID=0;var expandoData={};var supportsUnknownElements;(function(){try{var a=document.createElement('a');a.innerHTML='<xyz></xyz>';supportsHtml5Styles=('hidden'in a);supportsUnknownElements=a.childNodes.length==1||(function(){(document.createElement)('a');var frag=document.createDocumentFragment();return(typeof frag.cloneNode=='undefined'||typeof frag.createDocumentFragment=='undefined'||typeof frag.createElement=='undefined');}());}catch(e){supportsHtml5Styles=true;supportsUnknownElements=true;}}());function addStyleSheet(ownerDocument,cssText){var p=ownerDocument.createElement('p'),parent=ownerDocument.getElementsByTagName('head')[0]||ownerDocument.documentElement;p.innerHTML='x<style>'+cssText+'</style>';return parent.insertBefore(p.lastChild,parent.firstChild);}
function getElements(){var elements=html5.elements;return typeof elements=='string'?elements.split(' '):elements;}
function getExpandoData(ownerDocument){var data=expandoData[ownerDocument[expando]];if(!data){data={};expanID++;ownerDocument[expando]=expanID;expandoData[expanID]=data;}
return data;}
function createElement(nodeName,ownerDocument,data){if(!ownerDocument){ownerDocument=document;}
if(supportsUnknownElements){return ownerDocument.createElement(nodeName);}
if(!data){data=getExpandoData(ownerDocument);}
var node;if(data.cache[nodeName]){node=data.cache[nodeName].cloneNode();}else if(saveClones.test(nodeName)){node=(data.cache[nodeName]=data.createElem(nodeName)).cloneNode();}else{node=data.createElem(nodeName);}
return node.canHaveChildren&&!reSkip.test(nodeName)&&!node.tagUrn?data.frag.appendChild(node):node;}
function createDocumentFragment(ownerDocument,data){if(!ownerDocument){ownerDocument=document;}
if(supportsUnknownElements){return ownerDocument.createDocumentFragment();}
data=data||getExpandoData(ownerDocument);var clone=data.frag.cloneNode(),i=0,elems=getElements(),l=elems.length;for(;i<l;i++){clone.createElement(elems[i]);}
return clone;}
function shivMethods(ownerDocument,data){if(!data.cache){data.cache={};data.createElem=ownerDocument.createElement;data.createFrag=ownerDocument.createDocumentFragment;data.frag=data.createFrag();}
ownerDocument.createElement=function(nodeName){if(!html5.shivMethods){return data.createElem(nodeName);}
return createElement(nodeName,ownerDocument,data);};ownerDocument.createDocumentFragment=Function('h,f','return function(){'+'var n=f.cloneNode(),c=n.createElement;'+'h.shivMethods&&('+
getElements().join().replace(/[\w\-]+/g,function(nodeName){data.createElem(nodeName);data.frag.createElement(nodeName);return'c("'+nodeName+'")';})+');return n}')(html5,data.frag);}
function shivDocument(ownerDocument){if(!ownerDocument){ownerDocument=document;}
var data=getExpandoData(ownerDocument);if(html5.shivCSS&&!supportsHtml5Styles&&!data.hasCSS){data.hasCSS=!!addStyleSheet(ownerDocument,'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}'+'mark{background:#FF0;color:#000}'+'template{display:none}');}
if(!supportsUnknownElements){shivMethods(ownerDocument,data);}
return ownerDocument;}
var html5={'elements':options.elements||'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video','version':version,'shivCSS':(options.shivCSS!==false),'supportsUnknownElements':supportsUnknownElements,'shivMethods':(options.shivMethods!==false),'type':'default','shivDocument':shivDocument,createElement:createElement,createDocumentFragment:createDocumentFragment};window.html5=html5;shivDocument(document);}(this,document));Modernizr._version=version;Modernizr._prefixes=prefixes;Modernizr._domPrefixes=domPrefixes;Modernizr._cssomPrefixes=cssomPrefixes;Modernizr.mq=testMediaQuery;Modernizr.hasEvent=isEventSupported;Modernizr.testProp=function(prop){return testProps([prop]);};Modernizr.testAllProps=testPropsAll;Modernizr.testStyles=injectElementWithStyles;docElement.className=docElement.className.replace(/(^|\s)no-js(\s|$)/,'$1$2')+
(enableClasses?' js '+classes.join(' '):'');return Modernizr;})(this,this.document);(function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}})(this,document);Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0));};;(function(global,factory){if(typeof exports==="object"&&exports){factory(exports);}else if(typeof define==="function"&&define.amd){define(['exports'],factory);}else{factory(global.Mustache={});}}(this,function(mustache){var Object_toString=Object.prototype.toString;var isArray=Array.isArray||function(object){return Object_toString.call(object)==='[object Array]';};function isFunction(object){return typeof object==='function';}
function escapeRegExp(string){return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&");}
var RegExp_test=RegExp.prototype.test;function testRegExp(re,string){return RegExp_test.call(re,string);}
var nonSpaceRe=/\S/;function isWhitespace(string){return!testRegExp(nonSpaceRe,string);}
var entityMap={"&":"&amp;","<":"&lt;",">":"&gt;",'"':'&quot;',"'":'&#39;',"/":'&#x2F;'};function escapeHtml(string){return String(string).replace(/[&<>"'\/]/g,function(s){return entityMap[s];});}
var whiteRe=/\s*/;var spaceRe=/\s+/;var equalsRe=/\s*=/;var curlyRe=/\s*\}/;var tagRe=/#|\^|\/|>|\{|&|=|!/;function parseTemplate(template,tags){if(!template)
return[];var sections=[];var tokens=[];var spaces=[];var hasTag=false;var nonSpace=false;function stripSpace(){if(hasTag&&!nonSpace){while(spaces.length)
delete tokens[spaces.pop()];}else{spaces=[];}
hasTag=false;nonSpace=false;}
var openingTagRe,closingTagRe,closingCurlyRe;function compileTags(tags){if(typeof tags==='string')
tags=tags.split(spaceRe,2);if(!isArray(tags)||tags.length!==2)
throw new Error('Invalid tags: '+tags);openingTagRe=new RegExp(escapeRegExp(tags[0])+'\\s*');closingTagRe=new RegExp('\\s*'+escapeRegExp(tags[1]));closingCurlyRe=new RegExp('\\s*'+escapeRegExp('}'+tags[1]));}
compileTags(tags||mustache.tags);var scanner=new Scanner(template);var start,type,value,chr,token,openSection;while(!scanner.eos()){start=scanner.pos;value=scanner.scanUntil(openingTagRe);if(value){for(var i=0,valueLength=value.length;i<valueLength;++i){chr=value.charAt(i);if(isWhitespace(chr)){spaces.push(tokens.length);}else{nonSpace=true;}
tokens.push(['text',chr,start,start+1]);start+=1;if(chr==='\n')
stripSpace();}}
if(!scanner.scan(openingTagRe))
break;hasTag=true;type=scanner.scan(tagRe)||'name';scanner.scan(whiteRe);if(type==='='){value=scanner.scanUntil(equalsRe);scanner.scan(equalsRe);scanner.scanUntil(closingTagRe);}else if(type==='{'){value=scanner.scanUntil(closingCurlyRe);scanner.scan(curlyRe);scanner.scanUntil(closingTagRe);type='&';}else{value=scanner.scanUntil(closingTagRe);}
if(!scanner.scan(closingTagRe))
throw new Error('Unclosed tag at '+scanner.pos);token=[type,value,start,scanner.pos];tokens.push(token);if(type==='#'||type==='^'){sections.push(token);}else if(type==='/'){openSection=sections.pop();if(!openSection)
throw new Error('Unopened section "'+value+'" at '+start);if(openSection[1]!==value)
throw new Error('Unclosed section "'+openSection[1]+'" at '+start);}else if(type==='name'||type==='{'||type==='&'){nonSpace=true;}else if(type==='='){compileTags(value);}}
openSection=sections.pop();if(openSection)
throw new Error('Unclosed section "'+openSection[1]+'" at '+scanner.pos);return nestTokens(squashTokens(tokens));}
function squashTokens(tokens){var squashedTokens=[];var token,lastToken;for(var i=0,numTokens=tokens.length;i<numTokens;++i){token=tokens[i];if(token){if(token[0]==='text'&&lastToken&&lastToken[0]==='text'){lastToken[1]+=token[1];lastToken[3]=token[3];}else{squashedTokens.push(token);lastToken=token;}}}
return squashedTokens;}
function nestTokens(tokens){var nestedTokens=[];var collector=nestedTokens;var sections=[];var token,section;for(var i=0,numTokens=tokens.length;i<numTokens;++i){token=tokens[i];switch(token[0]){case'#':case'^':collector.push(token);sections.push(token);collector=token[4]=[];break;case'/':section=sections.pop();section[5]=token[2];collector=sections.length>0?sections[sections.length-1][4]:nestedTokens;break;default:collector.push(token);}}
return nestedTokens;}
function Scanner(string){this.string=string;this.tail=string;this.pos=0;}
Scanner.prototype.eos=function(){return this.tail==="";};Scanner.prototype.scan=function(re){var match=this.tail.match(re);if(!match||match.index!==0)
return'';var string=match[0];this.tail=this.tail.substring(string.length);this.pos+=string.length;return string;};Scanner.prototype.scanUntil=function(re){var index=this.tail.search(re),match;switch(index){case-1:match=this.tail;this.tail="";break;case 0:match="";break;default:match=this.tail.substring(0,index);this.tail=this.tail.substring(index);}
this.pos+=match.length;return match;};function Context(view,parentContext){this.view=view;this.cache={'.':this.view};this.parent=parentContext;}
Context.prototype.push=function(view){return new Context(view,this);};Context.prototype.lookup=function(name){var cache=this.cache;var value;if(name in cache){value=cache[name];}else{var context=this,names,index,lookupHit=false;while(context){if(name.indexOf('.')>0){value=context.view;names=name.split('.');index=0;while(value!=null&&index<names.length){if(index===names.length-1&&value!=null)
lookupHit=(typeof value==='object')&&value.hasOwnProperty(names[index]);value=value[names[index++]];}}else if(context.view!=null&&typeof context.view==='object'){value=context.view[name];lookupHit=context.view.hasOwnProperty(name);}
if(lookupHit)
break;context=context.parent;}
cache[name]=value;}
if(isFunction(value))
value=value.call(this.view);return value;};function Writer(){this.cache={};}
Writer.prototype.clearCache=function(){this.cache={};};Writer.prototype.parse=function(template,tags){var cache=this.cache;var tokens=cache[template];if(tokens==null)
tokens=cache[template]=parseTemplate(template,tags);return tokens;};Writer.prototype.render=function(template,view,partials){var tokens=this.parse(template);var context=(view instanceof Context)?view:new Context(view);return this.renderTokens(tokens,context,partials,template);};Writer.prototype.renderTokens=function(tokens,context,partials,originalTemplate){var buffer='';var token,symbol,value;for(var i=0,numTokens=tokens.length;i<numTokens;++i){value=undefined;token=tokens[i];symbol=token[0];if(symbol==='#')value=this._renderSection(token,context,partials,originalTemplate);else if(symbol==='^')value=this._renderInverted(token,context,partials,originalTemplate);else if(symbol==='>')value=this._renderPartial(token,context,partials,originalTemplate);else if(symbol==='&')value=this._unescapedValue(token,context);else if(symbol==='name')value=this._escapedValue(token,context);else if(symbol==='text')value=this._rawValue(token);if(value!==undefined)
buffer+=value;}
return buffer;};Writer.prototype._renderSection=function(token,context,partials,originalTemplate){var self=this;var buffer='';var value=context.lookup(token[1]);function subRender(template){return self.render(template,context,partials);}
if(!value)return;if(isArray(value)){for(var j=0,valueLength=value.length;j<valueLength;++j){buffer+=this.renderTokens(token[4],context.push(value[j]),partials,originalTemplate);}}else if(typeof value==='object'||typeof value==='string'||typeof value==='number'){buffer+=this.renderTokens(token[4],context.push(value),partials,originalTemplate);}else if(isFunction(value)){if(typeof originalTemplate!=='string')
throw new Error('Cannot use higher-order sections without the original template');value=value.call(context.view,originalTemplate.slice(token[3],token[5]),subRender);if(value!=null)
buffer+=value;}else{buffer+=this.renderTokens(token[4],context,partials,originalTemplate);}
return buffer;};Writer.prototype._renderInverted=function(token,context,partials,originalTemplate){var value=context.lookup(token[1]);if(!value||(isArray(value)&&value.length===0))
return this.renderTokens(token[4],context,partials,originalTemplate);};Writer.prototype._renderPartial=function(token,context,partials){if(!partials)return;var value=isFunction(partials)?partials(token[1]):partials[token[1]];if(value!=null)
return this.renderTokens(this.parse(value),context,partials,value);};Writer.prototype._unescapedValue=function(token,context){var value=context.lookup(token[1]);if(value!=null)
return value;};Writer.prototype._escapedValue=function(token,context){var value=context.lookup(token[1]);if(value!=null)
return mustache.escape(value);};Writer.prototype._rawValue=function(token){return token[1];};mustache.name="mustache.js";mustache.version="2.0.0";mustache.tags=["{{","}}"];var defaultWriter=new Writer();mustache.clearCache=function(){return defaultWriter.clearCache();};mustache.parse=function(template,tags){return defaultWriter.parse(template,tags);};mustache.render=function(template,view,partials){return defaultWriter.render(template,view,partials);};mustache.to_html=function(template,view,partials,send){var result=mustache.render(template,view,partials);if(isFunction(send)){send(result);}else{return result;}};mustache.escape=escapeHtml;mustache.Scanner=Scanner;mustache.Context=Context;mustache.Writer=Writer;}));+function($){"use strict";var Popover=function(element,options){var $el=this.$el=$(element);this.options=options||{};this.arrowSize=15
this.docClickHandler=null
this.show()}
Popover.prototype.hide=function(){var e=$.Event('hiding.oc.popover',{relatedTarget:this.$el})
this.$el.trigger(e,this)
if(e.isDefaultPrevented())
return
this.$container.removeClass('in')
if(this.$overlay)this.$overlay.removeClass('in')
this.disposeControls()
$.support.transition&&this.$container.hasClass('fade')?this.$container.one($.support.transition.end,$.proxy(this.hidePopover,this)).emulateTransitionEnd(300):this.hidePopover()}
Popover.prototype.disposeControls=function(){if(this.$container){$.oc.foundation.controlUtils.disposeControls(this.$container.get(0))}}
Popover.prototype.hidePopover=function(){this.$container.remove();if(this.$overlay)this.$overlay.remove()
this.$el.removeClass('popover-highlight')
this.$el.trigger('hide.oc.popover')
this.$overlay=false
this.$container=false
this.$el.data('oc.popover',null)
$(document.body).removeClass('popover-open')
$(document).unbind('mousedown',this.docClickHandler);$(document).off('.oc.popover')
this.docClickHandler=null}
Popover.prototype.show=function(options){var self=this
var e=$.Event('showing.oc.popover',{relatedTarget:this.$el})
this.$el.trigger(e,this)
if(e.isDefaultPrevented())
return
this.$container=$('<div />').addClass('control-popover')
if(this.options.containerClass)
this.$container.addClass(this.options.containerClass)
if(this.options.useAnimation)
this.$container.addClass('fade')
var $content=$('<div />').html(this.getContent())
this.$container.append($content)
if(this.options.width)
this.$container.width(this.options.width)
if(this.options.modal){this.$overlay=$('<div />').addClass('popover-overlay')
$(document.body).append(this.$overlay)
if(this.options.highlightModalTarget){this.$el.addClass('popover-highlight')
this.$el.blur()}}else{this.$overlay=false}
if(this.options.container)
$(this.options.container).append(this.$container)
else
$(document.body).append(this.$container)
var
placement=this.calcPlacement(),position=this.calcPosition(placement)
this.$container.css({left:position.x,top:position.y}).addClass('placement-'+placement)
this.$container.addClass('in')
if(this.$overlay)this.$overlay.addClass('in')
$(document.body).addClass('popover-open')
var showEvent=jQuery.Event('show.oc.popover',{relatedTarget:this.$container.get(0)})
this.$el.trigger(showEvent)
this.$container.on('close.oc.popover',function(e){self.hide()})
this.$container.on('click','[data-dismiss=popover]',function(e){self.hide()
return false})
this.docClickHandler=$.proxy(this.onDocumentClick,this)
$(document).bind('mousedown',this.docClickHandler);if(this.options.closeOnEsc){$(document).on('keyup.oc.popover',function(e){if($(e.target).hasClass('select2-offscreen'))
return false
if(e.keyCode==27){self.hide()
return false}})}}
Popover.prototype.getContent=function(){return typeof this.options.content=='function'?this.options.content.call(this.$el[0],this):this.options.content}
Popover.prototype.calcDimensions=function(){var
documentWidth=$(document).width(),documentHeight=$(document).height(),targetOffset=this.$el.offset(),targetWidth=this.$el.outerWidth(),targetHeight=this.$el.outerHeight()
return{containerWidth:this.$container.outerWidth()+this.arrowSize,containerHeight:this.$container.outerHeight()+this.arrowSize,targetOffset:targetOffset,targetHeight:targetHeight,targetWidth:targetWidth,spaceLeft:targetOffset.left,spaceRight:documentWidth-(targetWidth+targetOffset.left),spaceTop:targetOffset.top,spaceBottom:documentHeight-(targetHeight+targetOffset.top),spaceHorizontalBottom:documentHeight-targetOffset.top,spaceVerticalRight:documentWidth-targetOffset.left,documentWidth:documentWidth}}
Popover.prototype.fitsLeft=function(dimensions){return dimensions.spaceLeft>=dimensions.containerWidth&&dimensions.spaceHorizontalBottom>=dimensions.containerHeight}
Popover.prototype.fitsRight=function(dimensions){return dimensions.spaceRight>=dimensions.containerWidth&&dimensions.spaceHorizontalBottom>=dimensions.containerHeight}
Popover.prototype.fitsBottom=function(dimensions){return dimensions.spaceBottom>=dimensions.containerHeight&&dimensions.spaceVerticalRight>=dimensions.containerWidth}
Popover.prototype.fitsTop=function(dimensions){return dimensions.spaceTop>=dimensions.containerHeight&&dimensions.spaceVerticalRight>=dimensions.containerWidth}
Popover.prototype.calcPlacement=function(){var
placement=this.options.placement,dimensions=this.calcDimensions();if(placement=='center')
return placement
if(placement!='bottom'&&placement!='top'&&placement!='left'&&placement!='right')
placement='bottom'
var placementFunctions={top:this.fitsTop,bottom:this.fitsBottom,left:this.fitsLeft,right:this.fitsRight}
if(placementFunctions[placement](dimensions))
return placement
for(var index in placementFunctions){if(placementFunctions[index](dimensions))
return index}
return this.options.fallbackPlacement}
Popover.prototype.calcPosition=function(placement){var
dimensions=this.calcDimensions(),result
switch(placement){case'left':var realOffset=this.options.offsetY===undefined?this.options.offset:this.options.offsetY
result={x:(dimensions.targetOffset.left-dimensions.containerWidth),y:dimensions.targetOffset.top+realOffset}
break;case'top':var realOffset=this.options.offsetX===undefined?this.options.offset:this.options.offsetX
result={x:dimensions.targetOffset.left+realOffset,y:(dimensions.targetOffset.top-dimensions.containerHeight)}
break;case'bottom':var realOffset=this.options.offsetX===undefined?this.options.offset:this.options.offsetX
result={x:dimensions.targetOffset.left+realOffset,y:(dimensions.targetOffset.top+dimensions.targetHeight+this.arrowSize)}
break;case'right':var realOffset=this.options.offsetY===undefined?this.options.offset:this.options.offsetY
result={x:(dimensions.targetOffset.left+dimensions.targetWidth+this.arrowSize),y:dimensions.targetOffset.top+realOffset}
break;case'center':var windowHeight=$(window).height()
result={x:(dimensions.documentWidth/2-dimensions.containerWidth/2),y:(windowHeight/2-dimensions.containerHeight/2)}
if(result.y<40)
result.y=40
break;}
if(!this.options.container)
return result
var
$container=$(this.options.container),containerOffset=$container.offset()
result.x-=containerOffset.left
result.y-=containerOffset.top
return result}
Popover.prototype.onDocumentClick=function(e){if(!this.options.closeOnPageClick)
return
if($.contains(this.$container.get(0),e.target))
return
this.hide();}
Popover.DEFAULTS={placement:'bottom',fallbackPlacement:'bottom',content:'<p>Popover content<p>',width:false,modal:false,highlightModalTarget:false,closeOnPageClick:true,closeOnEsc:true,container:false,containerClass:null,offset:15,useAnimation:false}
var old=$.fn.ocPopover
$.fn.ocPopover=function(option){var args=arguments;return this.each(function(){var $this=$(this)
var data=$this.data('oc.popover')
var options=$.extend({},Popover.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data){if(typeof option=='string')
return;$this.data('oc.popover',(data=new Popover(this,options)))}else{if(typeof option!='string')
return;var methodArgs=[];for(var i=1;i<args.length;i++)
methodArgs.push(args[i])
data[option].apply(data,methodArgs)}})}
$.fn.ocPopover.Constructor=Popover
$.fn.ocPopover.noConflict=function(){$.fn.ocPopover=old
return this}
$(document).on('click','[data-control=popover]',function(e){$(this).ocPopover()
return false;})}(window.jQuery);+function($){'use strict';var Tooltip=function(element,options){this.type=this.options=this.enabled=this.timeout=this.hoverState=this.$element=null
this.init('tooltip',element,options)}
Tooltip.DEFAULTS={animation:true,placement:'top',selector:false,template:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:'hover focus',title:'',delay:0,html:false,container:false}
Tooltip.prototype.init=function(type,element,options){this.enabled=true
this.type=type
this.$element=$(element)
this.options=this.getOptions(options)
var triggers=this.options.trigger.split(' ')
for(var i=triggers.length;i--;){var trigger=triggers[i]
if(trigger=='click'){this.$element.on('click.'+this.type,this.options.selector,$.proxy(this.toggle,this))}else if(trigger!='manual'){var eventIn=trigger=='hover'?'mouseenter':'focusin'
var eventOut=trigger=='hover'?'mouseleave':'focusout'
this.$element.on(eventIn+'.'+this.type,this.options.selector,$.proxy(this.enter,this))
this.$element.on(eventOut+'.'+this.type,this.options.selector,$.proxy(this.leave,this))}}
this.options.selector?(this._options=$.extend({},this.options,{trigger:'manual',selector:''})):this.fixTitle()}
Tooltip.prototype.getDefaults=function(){return Tooltip.DEFAULTS}
Tooltip.prototype.getOptions=function(options){options=$.extend({},this.getDefaults(),this.$element.data(),options)
if(options.delay&&typeof options.delay=='number'){options.delay={show:options.delay,hide:options.delay}}
return options}
Tooltip.prototype.getDelegateOptions=function(){var options={}
var defaults=this.getDefaults()
this._options&&$.each(this._options,function(key,value){if(defaults[key]!=value)options[key]=value})
return options}
Tooltip.prototype.enter=function(obj){var self=obj instanceof this.constructor?obj:$(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.'+this.type)
clearTimeout(self.timeout)
self.hoverState='in'
if(!self.options.delay||!self.options.delay.show)return self.show()
self.timeout=setTimeout(function(){if(self.hoverState=='in')self.show()},self.options.delay.show)}
Tooltip.prototype.leave=function(obj){var self=obj instanceof this.constructor?obj:$(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.'+this.type)
clearTimeout(self.timeout)
self.hoverState='out'
if(!self.options.delay||!self.options.delay.hide)return self.hide()
self.timeout=setTimeout(function(){if(self.hoverState=='out')self.hide()},self.options.delay.hide)}
Tooltip.prototype.show=function(){var e=$.Event('show.bs.'+this.type)
if(this.hasContent()&&this.enabled){this.$element.trigger(e)
if(e.isDefaultPrevented())return
var that=this;var $tip=this.tip()
this.setContent()
if(this.options.animation)$tip.addClass('fade')
var placement=typeof this.options.placement=='function'?this.options.placement.call(this,$tip[0],this.$element[0]):this.options.placement
var autoToken=/\s?auto?\s?/i
var autoPlace=autoToken.test(placement)
if(autoPlace)placement=placement.replace(autoToken,'')||'top'
$tip.detach().css({top:0,left:0,display:'block'}).addClass(placement)
this.options.container?$tip.appendTo(this.options.container):$tip.insertAfter(this.$element)
var pos=this.getPosition()
var actualWidth=$tip[0].offsetWidth
var actualHeight=$tip[0].offsetHeight
if(autoPlace){var $parent=this.$element.parent()
var orgPlacement=placement
var docScroll=document.documentElement.scrollTop||document.body.scrollTop
var parentWidth=this.options.container=='body'?window.innerWidth:$parent.outerWidth()
var parentHeight=this.options.container=='body'?window.innerHeight:$parent.outerHeight()
var parentLeft=this.options.container=='body'?0:$parent.offset().left
placement=placement=='bottom'&&pos.top+pos.height+actualHeight-docScroll>parentHeight?'top':placement=='top'&&pos.top-docScroll-actualHeight<0?'bottom':placement=='right'&&pos.right+actualWidth>parentWidth?'left':placement=='left'&&pos.left-actualWidth<parentLeft?'right':placement
$tip.removeClass(orgPlacement).addClass(placement)}
var calculatedOffset=this.getCalculatedOffset(placement,pos,actualWidth,actualHeight)
this.applyPlacement(calculatedOffset,placement)
this.hoverState=null
var complete=function(){that.$element.trigger('shown.bs.'+that.type)}
$.support.transition&&this.$tip.hasClass('fade')?$tip.one($.support.transition.end,complete).emulateTransitionEnd(150):complete()}}
Tooltip.prototype.applyPlacement=function(offset,placement){var replace
var $tip=this.tip()
var width=$tip[0].offsetWidth
var height=$tip[0].offsetHeight
var marginTop=parseInt($tip.css('margin-top'),10)
var marginLeft=parseInt($tip.css('margin-left'),10)
if(isNaN(marginTop))marginTop=0
if(isNaN(marginLeft))marginLeft=0
offset.top=offset.top+marginTop
offset.left=offset.left+marginLeft
$.offset.setOffset($tip[0],$.extend({using:function(props){$tip.css({top:Math.round(props.top),left:Math.round(props.left)})}},offset),0)
$tip.addClass('in')
var actualWidth=$tip[0].offsetWidth
var actualHeight=$tip[0].offsetHeight
if(placement=='top'&&actualHeight!=height){replace=true
offset.top=offset.top+height-actualHeight}
if(/bottom|top/.test(placement)){var delta=0
if(offset.left<0){delta=offset.left*-2
offset.left=0
$tip.offset(offset)
actualWidth=$tip[0].offsetWidth
actualHeight=$tip[0].offsetHeight}
this.replaceArrow(delta-width+actualWidth,actualWidth,'left')}else{this.replaceArrow(actualHeight-height,actualHeight,'top')}
if(replace)$tip.offset(offset)}
Tooltip.prototype.replaceArrow=function(delta,dimension,position){this.arrow().css(position,delta?(50*(1-delta/dimension)+'%'):'')}
Tooltip.prototype.setContent=function(){var $tip=this.tip()
var title=this.getTitle()
$tip.find('.tooltip-inner')[this.options.html?'html':'text'](title)
$tip.removeClass('fade in top bottom left right')}
Tooltip.prototype.hide=function(){var that=this
var $tip=this.tip()
var e=$.Event('hide.bs.'+this.type)
function complete(){if(that.hoverState!='in')$tip.detach()
that.$element.trigger('hidden.bs.'+that.type)}
this.$element.trigger(e)
if(e.isDefaultPrevented())return
$tip.removeClass('in')
$.support.transition&&this.$tip.hasClass('fade')?$tip.one($.support.transition.end,complete).emulateTransitionEnd(150):complete()
this.hoverState=null
return this}
Tooltip.prototype.fixTitle=function(){var $e=this.$element
if($e.attr('title')||typeof($e.attr('data-original-title'))!='string'){$e.attr('data-original-title',$e.attr('title')||'').attr('title','')}}
Tooltip.prototype.hasContent=function(){return this.getTitle()}
Tooltip.prototype.getPosition=function(){var el=this.$element[0]
return $.extend({},(typeof el.getBoundingClientRect=='function')?el.getBoundingClientRect():{width:el.offsetWidth,height:el.offsetHeight},this.$element.offset())}
Tooltip.prototype.getCalculatedOffset=function(placement,pos,actualWidth,actualHeight){return placement=='bottom'?{top:pos.top+pos.height,left:pos.left+pos.width/2-actualWidth/2}:placement=='top'?{top:pos.top-actualHeight,left:pos.left+pos.width/2-actualWidth/2}:placement=='left'?{top:pos.top+pos.height/2-actualHeight/2,left:pos.left-actualWidth}:{top:pos.top+pos.height/2-actualHeight/2,left:pos.left+pos.width}}
Tooltip.prototype.getTitle=function(){var title
var $e=this.$element
var o=this.options
title=$e.attr('data-original-title')||(typeof o.title=='function'?o.title.call($e[0]):o.title)
return title}
Tooltip.prototype.tip=function(){return this.$tip=this.$tip||$(this.options.template)}
Tooltip.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find('.tooltip-arrow')}
Tooltip.prototype.validate=function(){if(!this.$element[0].parentNode){this.hide()
this.$element=null
this.options=null}}
Tooltip.prototype.enable=function(){this.enabled=true}
Tooltip.prototype.disable=function(){this.enabled=false}
Tooltip.prototype.toggleEnabled=function(){this.enabled=!this.enabled}
Tooltip.prototype.toggle=function(e){var self=e?$(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.'+this.type):this
self.tip().hasClass('in')?self.leave(self):self.enter(self)}
Tooltip.prototype.destroy=function(){clearTimeout(this.timeout)
this.hide().$element.off('.'+this.type).removeData('bs.'+this.type)}
var old=$.fn.tooltip
$.fn.tooltip=function(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.tooltip')
var options=typeof option=='object'&&option
if(!data&&option=='destroy')return
if(!data)$this.data('bs.tooltip',(data=new Tooltip(this,options)))
if(typeof option=='string')data[option]()})}
$.fn.tooltip.Constructor=Tooltip
$.fn.tooltip.noConflict=function(){$.fn.tooltip=old
return this}}(jQuery);(function($){$(document).render(function(){$('[data-toggle="tooltip"]').tooltip()})})(jQuery);+function($){"use strict";var BalloonSelector=function(element,options){this.$el=$(element)
this.$field=$('input',this.$el)
this.options=options||{};var self=this;$('li',this.$el).click(function(){if(self.$el.hasClass('control-disabled'))
return
$('li',self.$el).removeClass('active')
$(this).addClass('active')
self.$field.val($(this).data('value'))
self.$el.trigger('change')})}
BalloonSelector.DEFAULTS={}
var old=$.fn.balloonSelector
$.fn.balloonSelector=function(option){return this.each(function(){var $this=$(this)
var data=$this.data('oc.balloon-selector')
var options=$.extend({},BalloonSelector.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('oc.balloon-selector',(data=new BalloonSelector(this,options)))})}
$.fn.balloonSelector.Constructor=BalloonSelector
$.fn.balloonSelector.noConflict=function(){$.fn.balloonSelector=old
return this}
$(document).on('render',function(){$('div[data-control=balloon-selector]').balloonSelector()})}(window.jQuery);(function($){$(document).on('keydown','div.custom-checkbox',function(e){if(e.keyCode==32)
e.preventDefault()})
$(document).on('keyup','div.custom-checkbox',function(e){if(e.keyCode==32){var $cb=$('input',this)
if($cb.data('oc-space-timestamp')==e.timeStamp)
return
$cb.get(0).checked=!$cb.get(0).checked
$cb.data('oc-space-timestamp',e.timeStamp)
$cb.trigger('change')
return false}})})(jQuery);(function(factory){if(typeof define==='function'&&define.amd){define(['jquery'],factory);}else if(typeof exports==='object'){factory(require('jquery'));}else{factory(jQuery);}}(function(jQuery){var S2=(function(){if(jQuery&&jQuery.fn&&jQuery.fn.select2&&jQuery.fn.select2.amd){var S2=jQuery.fn.select2.amd;}
var S2;(function(){if(!S2||!S2.requirejs){if(!S2){S2={};}else{require=S2;}
var requirejs,require,define;(function(undef){var main,req,makeMap,handlers,defined={},waiting={},config={},defining={},hasOwn=Object.prototype.hasOwnProperty,aps=[].slice,jsSuffixRegExp=/\.js$/;function hasProp(obj,prop){return hasOwn.call(obj,prop);}
function normalize(name,baseName){var nameParts,nameSegment,mapValue,foundMap,lastIndex,foundI,foundStarMap,starI,i,j,part,baseParts=baseName&&baseName.split("/"),map=config.map,starMap=(map&&map['*'])||{};if(name&&name.charAt(0)==="."){if(baseName){baseParts=baseParts.slice(0,baseParts.length-1);name=name.split('/');lastIndex=name.length-1;if(config.nodeIdCompat&&jsSuffixRegExp.test(name[lastIndex])){name[lastIndex]=name[lastIndex].replace(jsSuffixRegExp,'');}
name=baseParts.concat(name);for(i=0;i<name.length;i+=1){part=name[i];if(part==="."){name.splice(i,1);i-=1;}else if(part===".."){if(i===1&&(name[2]==='..'||name[0]==='..')){break;}else if(i>0){name.splice(i-1,2);i-=2;}}}
name=name.join("/");}else if(name.indexOf('./')===0){name=name.substring(2);}}
if((baseParts||starMap)&&map){nameParts=name.split('/');for(i=nameParts.length;i>0;i-=1){nameSegment=nameParts.slice(0,i).join("/");if(baseParts){for(j=baseParts.length;j>0;j-=1){mapValue=map[baseParts.slice(0,j).join('/')];if(mapValue){mapValue=mapValue[nameSegment];if(mapValue){foundMap=mapValue;foundI=i;break;}}}}
if(foundMap){break;}
if(!foundStarMap&&starMap&&starMap[nameSegment]){foundStarMap=starMap[nameSegment];starI=i;}}
if(!foundMap&&foundStarMap){foundMap=foundStarMap;foundI=starI;}
if(foundMap){nameParts.splice(0,foundI,foundMap);name=nameParts.join('/');}}
return name;}
function makeRequire(relName,forceSync){return function(){return req.apply(undef,aps.call(arguments,0).concat([relName,forceSync]));};}
function makeNormalize(relName){return function(name){return normalize(name,relName);};}
function makeLoad(depName){return function(value){defined[depName]=value;};}
function callDep(name){if(hasProp(waiting,name)){var args=waiting[name];delete waiting[name];defining[name]=true;main.apply(undef,args);}
if(!hasProp(defined,name)&&!hasProp(defining,name)){throw new Error('No '+name);}
return defined[name];}
function splitPrefix(name){var prefix,index=name?name.indexOf('!'):-1;if(index>-1){prefix=name.substring(0,index);name=name.substring(index+1,name.length);}
return[prefix,name];}
makeMap=function(name,relName){var plugin,parts=splitPrefix(name),prefix=parts[0];name=parts[1];if(prefix){prefix=normalize(prefix,relName);plugin=callDep(prefix);}
if(prefix){if(plugin&&plugin.normalize){name=plugin.normalize(name,makeNormalize(relName));}else{name=normalize(name,relName);}}else{name=normalize(name,relName);parts=splitPrefix(name);prefix=parts[0];name=parts[1];if(prefix){plugin=callDep(prefix);}}
return{f:prefix?prefix+'!'+name:name,n:name,pr:prefix,p:plugin};};function makeConfig(name){return function(){return(config&&config.config&&config.config[name])||{};};}
handlers={require:function(name){return makeRequire(name);},exports:function(name){var e=defined[name];if(typeof e!=='undefined'){return e;}else{return(defined[name]={});}},module:function(name){return{id:name,uri:'',exports:defined[name],config:makeConfig(name)};}};main=function(name,deps,callback,relName){var cjsModule,depName,ret,map,i,args=[],callbackType=typeof callback,usingExports;relName=relName||name;if(callbackType==='undefined'||callbackType==='function'){deps=!deps.length&&callback.length?['require','exports','module']:deps;for(i=0;i<deps.length;i+=1){map=makeMap(deps[i],relName);depName=map.f;if(depName==="require"){args[i]=handlers.require(name);}else if(depName==="exports"){args[i]=handlers.exports(name);usingExports=true;}else if(depName==="module"){cjsModule=args[i]=handlers.module(name);}else if(hasProp(defined,depName)||hasProp(waiting,depName)||hasProp(defining,depName)){args[i]=callDep(depName);}else if(map.p){map.p.load(map.n,makeRequire(relName,true),makeLoad(depName),{});args[i]=defined[depName];}else{throw new Error(name+' missing '+depName);}}
ret=callback?callback.apply(defined[name],args):undefined;if(name){if(cjsModule&&cjsModule.exports!==undef&&cjsModule.exports!==defined[name]){defined[name]=cjsModule.exports;}else if(ret!==undef||!usingExports){defined[name]=ret;}}}else if(name){defined[name]=callback;}};requirejs=require=req=function(deps,callback,relName,forceSync,alt){if(typeof deps==="string"){if(handlers[deps]){return handlers[deps](callback);}
return callDep(makeMap(deps,callback).f);}else if(!deps.splice){config=deps;if(config.deps){req(config.deps,config.callback);}
if(!callback){return;}
if(callback.splice){deps=callback;callback=relName;relName=null;}else{deps=undef;}}
callback=callback||function(){};if(typeof relName==='function'){relName=forceSync;forceSync=alt;}
if(forceSync){main(undef,deps,callback,relName);}else{setTimeout(function(){main(undef,deps,callback,relName);},4);}
return req;};req.config=function(cfg){return req(cfg);};requirejs._defined=defined;define=function(name,deps,callback){if(!deps.splice){callback=deps;deps=[];}
if(!hasProp(defined,name)&&!hasProp(waiting,name)){waiting[name]=[name,deps,callback];}};define.amd={jQuery:true};}());S2.requirejs=requirejs;S2.require=require;S2.define=define;}}());S2.define("almond",function(){});S2.define('jquery',[],function(){var _$=jQuery||$;if(_$==null&&console&&console.error){console.error('Select2: An instance of jQuery or a jQuery-compatible library was not '+'found. Make sure that you are including jQuery before Select2 on your '+'web page.');}
return _$;});S2.define('select2/utils',['jquery'],function($){var Utils={};Utils.Extend=function(ChildClass,SuperClass){var __hasProp={}.hasOwnProperty;function BaseConstructor(){this.constructor=ChildClass;}
for(var key in SuperClass){if(__hasProp.call(SuperClass,key)){ChildClass[key]=SuperClass[key];}}
BaseConstructor.prototype=SuperClass.prototype;ChildClass.prototype=new BaseConstructor();ChildClass.__super__=SuperClass.prototype;return ChildClass;};function getMethods(theClass){var proto=theClass.prototype;var methods=[];for(var methodName in proto){var m=proto[methodName];if(typeof m!=='function'){continue;}
if(methodName==='constructor'){continue;}
methods.push(methodName);}
return methods;}
Utils.Decorate=function(SuperClass,DecoratorClass){var decoratedMethods=getMethods(DecoratorClass);var superMethods=getMethods(SuperClass);function DecoratedClass(){var unshift=Array.prototype.unshift;var argCount=DecoratorClass.prototype.constructor.length;var calledConstructor=SuperClass.prototype.constructor;if(argCount>0){unshift.call(arguments,SuperClass.prototype.constructor);calledConstructor=DecoratorClass.prototype.constructor;}
calledConstructor.apply(this,arguments);}
DecoratorClass.displayName=SuperClass.displayName;function ctr(){this.constructor=DecoratedClass;}
DecoratedClass.prototype=new ctr();for(var m=0;m<superMethods.length;m++){var superMethod=superMethods[m];DecoratedClass.prototype[superMethod]=SuperClass.prototype[superMethod];}
var calledMethod=function(methodName){var originalMethod=function(){};if(methodName in DecoratedClass.prototype){originalMethod=DecoratedClass.prototype[methodName];}
var decoratedMethod=DecoratorClass.prototype[methodName];return function(){var unshift=Array.prototype.unshift;unshift.call(arguments,originalMethod);return decoratedMethod.apply(this,arguments);};};for(var d=0;d<decoratedMethods.length;d++){var decoratedMethod=decoratedMethods[d];DecoratedClass.prototype[decoratedMethod]=calledMethod(decoratedMethod);}
return DecoratedClass;};var Observable=function(){this.listeners={};};Observable.prototype.on=function(event,callback){this.listeners=this.listeners||{};if(event in this.listeners){this.listeners[event].push(callback);}else{this.listeners[event]=[callback];}};Observable.prototype.trigger=function(event){var slice=Array.prototype.slice;this.listeners=this.listeners||{};if(event in this.listeners){this.invoke(this.listeners[event],slice.call(arguments,1));}
if('*'in this.listeners){this.invoke(this.listeners['*'],arguments);}};Observable.prototype.invoke=function(listeners,params){for(var i=0,len=listeners.length;i<len;i++){listeners[i].apply(this,params);}};Utils.Observable=Observable;Utils.generateChars=function(length){var chars='';for(var i=0;i<length;i++){var randomChar=Math.floor(Math.random()*36);chars+=randomChar.toString(36);}
return chars;};Utils.bind=function(func,context){return function(){func.apply(context,arguments);};};Utils._convertData=function(data){for(var originalKey in data){var keys=originalKey.split('-');var dataLevel=data;if(keys.length===1){continue;}
for(var k=0;k<keys.length;k++){var key=keys[k];key=key.substring(0,1).toLowerCase()+key.substring(1);if(!(key in dataLevel)){dataLevel[key]={};}
if(k==keys.length-1){dataLevel[key]=data[originalKey];}
dataLevel=dataLevel[key];}
delete data[originalKey];}
return data;};Utils.hasScroll=function(index,el){var $el=$(el);var overflowX=el.style.overflowX;var overflowY=el.style.overflowY;if(overflowX===overflowY&&(overflowY==='hidden'||overflowY==='visible')){return false;}
if(overflowX==='scroll'||overflowY==='scroll'){return true;}
return($el.innerHeight()<el.scrollHeight||$el.innerWidth()<el.scrollWidth);};Utils.escapeMarkup=function(markup){var replaceMap={'\\':'&#92;','&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;','/':'&#47;'};if(typeof markup!=='string'){return markup;}
return String(markup).replace(/[&<>"'\/\\]/g,function(match){return replaceMap[match];});};Utils.appendMany=function($element,$nodes){if($.fn.jquery.substr(0,3)==='1.7'){var $jqNodes=$();$.map($nodes,function(node){$jqNodes=$jqNodes.add(node);});$nodes=$jqNodes;}
$element.append($nodes);};return Utils;});S2.define('select2/results',['jquery','./utils'],function($,Utils){function Results($element,options,dataAdapter){this.$element=$element;this.data=dataAdapter;this.options=options;Results.__super__.constructor.call(this);}
Utils.Extend(Results,Utils.Observable);Results.prototype.render=function(){var $results=$('<ul class="select2-results__options" role="tree"></ul>');if(this.options.get('multiple')){$results.attr('aria-multiselectable','true');}
this.$results=$results;return $results;};Results.prototype.clear=function(){this.$results.empty();};Results.prototype.displayMessage=function(params){var escapeMarkup=this.options.get('escapeMarkup');this.clear();this.hideLoading();var $message=$('<li role="treeitem" class="select2-results__option"></li>');var message=this.options.get('translations').get(params.message);$message.append(escapeMarkup(message(params.args)));this.$results.append($message);};Results.prototype.append=function(data){this.hideLoading();var $options=[];if(data.results==null||data.results.length===0){if(this.$results.children().length===0){this.trigger('results:message',{message:'noResults'});}
return;}
data.results=this.sort(data.results);for(var d=0;d<data.results.length;d++){var item=data.results[d];var $option=this.option(item);$options.push($option);}
this.$results.append($options);};Results.prototype.position=function($results,$dropdown){var $resultsContainer=$dropdown.find('.select2-results');$resultsContainer.append($results);};Results.prototype.sort=function(data){var sorter=this.options.get('sorter');return sorter(data);};Results.prototype.setClasses=function(){var self=this;this.data.current(function(selected){var selectedIds=$.map(selected,function(s){return s.id.toString();});var $options=self.$results.find('.select2-results__option[aria-selected]');$options.each(function(){var $option=$(this);var item=$.data(this,'data');var id=''+item.id;if((item.element!=null&&item.element.selected)||(item.element==null&&$.inArray(id,selectedIds)>-1)){$option.attr('aria-selected','true');}else{$option.attr('aria-selected','false');}});var $selected=$options.filter('[aria-selected=true]');if($selected.length>0){$selected.first().trigger('mouseenter');}else{$options.first().trigger('mouseenter');}});};Results.prototype.showLoading=function(params){this.hideLoading();var loadingMore=this.options.get('translations').get('searching');var loading={disabled:true,loading:true,text:loadingMore(params)};var $loading=this.option(loading);$loading.className+=' loading-results';this.$results.prepend($loading);};Results.prototype.hideLoading=function(){this.$results.find('.loading-results').remove();};Results.prototype.option=function(data){var option=document.createElement('li');option.className='select2-results__option';var attrs={'role':'treeitem','aria-selected':'false'};if(data.disabled){delete attrs['aria-selected'];attrs['aria-disabled']='true';}
if(data.id==null){delete attrs['aria-selected'];}
if(data._resultId!=null){option.id=data._resultId;}
if(data.title){option.title=data.title;}
if(data.children){attrs.role='group';attrs['aria-label']=data.text;delete attrs['aria-selected'];}
for(var attr in attrs){var val=attrs[attr];option.setAttribute(attr,val);}
if(data.children){var $option=$(option);var label=document.createElement('strong');label.className='select2-results__group';var $label=$(label);this.template(data,label);var $children=[];for(var c=0;c<data.children.length;c++){var child=data.children[c];var $child=this.option(child);$children.push($child);}
var $childrenContainer=$('<ul></ul>',{'class':'select2-results__options select2-results__options--nested'});$childrenContainer.append($children);$option.append(label);$option.append($childrenContainer);}else{this.template(data,option);}
$.data(option,'data',data);return option;};Results.prototype.bind=function(container,$container){var self=this;var id=container.id+'-results';this.$results.attr('id',id);container.on('results:all',function(params){self.clear();self.append(params.data);if(container.isOpen()){self.setClasses();}});container.on('results:append',function(params){self.append(params.data);if(container.isOpen()){self.setClasses();}});container.on('query',function(params){self.showLoading(params);});container.on('select',function(){if(!container.isOpen()){return;}
self.setClasses();});container.on('unselect',function(){if(!container.isOpen()){return;}
self.setClasses();});container.on('open',function(){self.$results.attr('aria-expanded','true');self.$results.attr('aria-hidden','false');self.setClasses();self.ensureHighlightVisible();});container.on('close',function(){self.$results.attr('aria-expanded','false');self.$results.attr('aria-hidden','true');self.$results.removeAttr('aria-activedescendant');});container.on('results:toggle',function(){var $highlighted=self.getHighlightedResults();if($highlighted.length===0){return;}
$highlighted.trigger('mouseup');});container.on('results:select',function(){var $highlighted=self.getHighlightedResults();if($highlighted.length===0){return;}
var data=$highlighted.data('data');if($highlighted.attr('aria-selected')=='true'){self.trigger('close');}else{self.trigger('select',{data:data});}});container.on('results:previous',function(){var $highlighted=self.getHighlightedResults();var $options=self.$results.find('[aria-selected]');var currentIndex=$options.index($highlighted);if(currentIndex===0){return;}
var nextIndex=currentIndex-1;if($highlighted.length===0){nextIndex=0;}
var $next=$options.eq(nextIndex);$next.trigger('mouseenter');var currentOffset=self.$results.offset().top;var nextTop=$next.offset().top;var nextOffset=self.$results.scrollTop()+(nextTop-currentOffset);if(nextIndex===0){self.$results.scrollTop(0);}else if(nextTop-currentOffset<0){self.$results.scrollTop(nextOffset);}});container.on('results:next',function(){var $highlighted=self.getHighlightedResults();var $options=self.$results.find('[aria-selected]');var currentIndex=$options.index($highlighted);var nextIndex=currentIndex+1;if(nextIndex>=$options.length){return;}
var $next=$options.eq(nextIndex);$next.trigger('mouseenter');var currentOffset=self.$results.offset().top+
self.$results.outerHeight(false);var nextBottom=$next.offset().top+$next.outerHeight(false);var nextOffset=self.$results.scrollTop()+nextBottom-currentOffset;if(nextIndex===0){self.$results.scrollTop(0);}else if(nextBottom>currentOffset){self.$results.scrollTop(nextOffset);}});container.on('results:focus',function(params){params.element.addClass('select2-results__option--highlighted');});container.on('results:message',function(params){self.displayMessage(params);});if($.fn.mousewheel){this.$results.on('mousewheel',function(e){var top=self.$results.scrollTop();var bottom=(self.$results.get(0).scrollHeight-
self.$results.scrollTop()+
e.deltaY);var isAtTop=e.deltaY>0&&top-e.deltaY<=0;var isAtBottom=e.deltaY<0&&bottom<=self.$results.height();if(isAtTop){self.$results.scrollTop(0);e.preventDefault();e.stopPropagation();}else if(isAtBottom){self.$results.scrollTop(self.$results.get(0).scrollHeight-self.$results.height());e.preventDefault();e.stopPropagation();}});}
this.$results.on('mouseup','.select2-results__option[aria-selected]',function(evt){var $this=$(this);var data=$this.data('data');if($this.attr('aria-selected')==='true'){if(self.options.get('multiple')){self.trigger('unselect',{originalEvent:evt,data:data});}else{self.trigger('close');}
return;}
self.trigger('select',{originalEvent:evt,data:data});});this.$results.on('mouseenter','.select2-results__option[aria-selected]',function(evt){var data=$(this).data('data');self.getHighlightedResults().removeClass('select2-results__option--highlighted');self.trigger('results:focus',{data:data,element:$(this)});});};Results.prototype.getHighlightedResults=function(){var $highlighted=this.$results.find('.select2-results__option--highlighted');return $highlighted;};Results.prototype.destroy=function(){this.$results.remove();};Results.prototype.ensureHighlightVisible=function(){var $highlighted=this.getHighlightedResults();if($highlighted.length===0){return;}
var $options=this.$results.find('[aria-selected]');var currentIndex=$options.index($highlighted);var currentOffset=this.$results.offset().top;var nextTop=$highlighted.offset().top;var nextOffset=this.$results.scrollTop()+(nextTop-currentOffset);var offsetDelta=nextTop-currentOffset;nextOffset-=$highlighted.outerHeight(false)*2;if(currentIndex<=2){this.$results.scrollTop(0);}else if(offsetDelta>this.$results.outerHeight()||offsetDelta<0){this.$results.scrollTop(nextOffset);}};Results.prototype.template=function(result,container){var template=this.options.get('templateResult');var escapeMarkup=this.options.get('escapeMarkup');var content=template(result);if(content==null){container.style.display='none';}else if(typeof content==='string'){container.innerHTML=escapeMarkup(content);}else{$(container).append(content);}};return Results;});S2.define('select2/keys',[],function(){var KEYS={BACKSPACE:8,TAB:9,ENTER:13,SHIFT:16,CTRL:17,ALT:18,ESC:27,SPACE:32,PAGE_UP:33,PAGE_DOWN:34,END:35,HOME:36,LEFT:37,UP:38,RIGHT:39,DOWN:40,DELETE:46};return KEYS;});S2.define('select2/selection/base',['jquery','../utils','../keys'],function($,Utils,KEYS){function BaseSelection($element,options){this.$element=$element;this.options=options;BaseSelection.__super__.constructor.call(this);}
Utils.Extend(BaseSelection,Utils.Observable);BaseSelection.prototype.render=function(){var $selection=$('<span class="select2-selection" role="combobox" '+'aria-autocomplete="list" aria-haspopup="true" aria-expanded="false">'+'</span>');this._tabindex=0;if(this.$element.data('old-tabindex')!=null){this._tabindex=this.$element.data('old-tabindex');}else if(this.$element.attr('tabindex')!=null){this._tabindex=this.$element.attr('tabindex');}
$selection.attr('title',this.$element.attr('title'));$selection.attr('tabindex',this._tabindex);this.$selection=$selection;return $selection;};BaseSelection.prototype.bind=function(container,$container){var self=this;var id=container.id+'-container';var resultsId=container.id+'-results';this.container=container;this.$selection.on('focus',function(evt){self.trigger('focus',evt);});this.$selection.on('blur',function(evt){self._handleBlur(evt);});this.$selection.on('keydown',function(evt){self.trigger('keypress',evt);if(evt.which===KEYS.SPACE){evt.preventDefault();}});container.on('results:focus',function(params){self.$selection.attr('aria-activedescendant',params.data._resultId);});container.on('selection:update',function(params){self.update(params.data);});container.on('open',function(){self.$selection.attr('aria-expanded','true');self.$selection.attr('aria-owns',resultsId);self._attachCloseHandler(container);});container.on('close',function(){self.$selection.attr('aria-expanded','false');self.$selection.removeAttr('aria-activedescendant');self.$selection.removeAttr('aria-owns');self.$selection.focus();self._detachCloseHandler(container);});container.on('enable',function(){self.$selection.attr('tabindex',self._tabindex);});container.on('disable',function(){self.$selection.attr('tabindex','-1');});};BaseSelection.prototype._handleBlur=function(evt){var self=this;window.setTimeout(function(){if((document.activeElement==self.$selection[0])||($.contains(self.$selection[0],document.activeElement))){return;}
self.trigger('blur',evt);},1);};BaseSelection.prototype._attachCloseHandler=function(container){var self=this;$(document.body).on('mousedown.select2.'+container.id,function(e){var $target=$(e.target);var $select=$target.closest('.select2');var $all=$('.select2.select2-container--open');$all.each(function(){var $this=$(this);if(this==$select[0]){return;}
var $element=$this.data('element');$element.select2('close');});});};BaseSelection.prototype._detachCloseHandler=function(container){$(document.body).off('mousedown.select2.'+container.id);};BaseSelection.prototype.position=function($selection,$container){var $selectionContainer=$container.find('.selection');$selectionContainer.append($selection);};BaseSelection.prototype.destroy=function(){this._detachCloseHandler(this.container);};BaseSelection.prototype.update=function(data){throw new Error('The `update` method must be defined in child classes.');};return BaseSelection;});S2.define('select2/selection/single',['jquery','./base','../utils','../keys'],function($,BaseSelection,Utils,KEYS){function SingleSelection(){SingleSelection.__super__.constructor.apply(this,arguments);}
Utils.Extend(SingleSelection,BaseSelection);SingleSelection.prototype.render=function(){var $selection=SingleSelection.__super__.render.call(this);$selection.addClass('select2-selection--single');$selection.html('<span class="select2-selection__rendered"></span>'+'<span class="select2-selection__arrow" role="presentation">'+'<b role="presentation"></b>'+'</span>');return $selection;};SingleSelection.prototype.bind=function(container,$container){var self=this;SingleSelection.__super__.bind.apply(this,arguments);var id=container.id+'-container';this.$selection.find('.select2-selection__rendered').attr('id',id);this.$selection.attr('aria-labelledby',id);this.$selection.on('mousedown',function(evt){if(evt.which!==1){return;}
self.trigger('toggle',{originalEvent:evt});});this.$selection.on('focus',function(evt){});this.$selection.on('blur',function(evt){});container.on('selection:update',function(params){self.update(params.data);});};SingleSelection.prototype.clear=function(){this.$selection.find('.select2-selection__rendered').empty();};SingleSelection.prototype.display=function(data,container){var template=this.options.get('templateSelection');var escapeMarkup=this.options.get('escapeMarkup');return escapeMarkup(template(data,container));};SingleSelection.prototype.selectionContainer=function(){return $('<span></span>');};SingleSelection.prototype.update=function(data){if(data.length===0){this.clear();return;}
var selection=data[0];var $rendered=this.$selection.find('.select2-selection__rendered');var formatted=this.display(selection,$rendered);$rendered.empty().append(formatted);$rendered.prop('title',selection.title||selection.text);};return SingleSelection;});S2.define('select2/selection/multiple',['jquery','./base','../utils'],function($,BaseSelection,Utils){function MultipleSelection($element,options){MultipleSelection.__super__.constructor.apply(this,arguments);}
Utils.Extend(MultipleSelection,BaseSelection);MultipleSelection.prototype.render=function(){var $selection=MultipleSelection.__super__.render.call(this);$selection.addClass('select2-selection--multiple');$selection.html('<ul class="select2-selection__rendered"></ul>');return $selection;};MultipleSelection.prototype.bind=function(container,$container){var self=this;MultipleSelection.__super__.bind.apply(this,arguments);this.$selection.on('click',function(evt){self.trigger('toggle',{originalEvent:evt});});this.$selection.on('click','.select2-selection__choice__remove',function(evt){var $remove=$(this);var $selection=$remove.parent();var data=$selection.data('data');self.trigger('unselect',{originalEvent:evt,data:data});});};MultipleSelection.prototype.clear=function(){this.$selection.find('.select2-selection__rendered').empty();};MultipleSelection.prototype.display=function(data,container){var template=this.options.get('templateSelection');var escapeMarkup=this.options.get('escapeMarkup');return escapeMarkup(template(data,container));};MultipleSelection.prototype.selectionContainer=function(){var $container=$('<li class="select2-selection__choice">'+'<span class="select2-selection__choice__remove" role="presentation">'+'&times;'+'</span>'+'</li>');return $container;};MultipleSelection.prototype.update=function(data){this.clear();if(data.length===0){return;}
var $selections=[];for(var d=0;d<data.length;d++){var selection=data[d];var $selection=this.selectionContainer();var formatted=this.display(selection,$selection);$selection.append(formatted);$selection.prop('title',selection.title||selection.text);$selection.data('data',selection);$selections.push($selection);}
var $rendered=this.$selection.find('.select2-selection__rendered');Utils.appendMany($rendered,$selections);};return MultipleSelection;});S2.define('select2/selection/placeholder',['../utils'],function(Utils){function Placeholder(decorated,$element,options){this.placeholder=this.normalizePlaceholder(options.get('placeholder'));decorated.call(this,$element,options);}
Placeholder.prototype.normalizePlaceholder=function(_,placeholder){if(typeof placeholder==='string'){placeholder={id:'',text:placeholder};}
return placeholder;};Placeholder.prototype.createPlaceholder=function(decorated,placeholder){var $placeholder=this.selectionContainer();$placeholder.html(this.display(placeholder));$placeholder.addClass('select2-selection__placeholder').removeClass('select2-selection__choice');return $placeholder;};Placeholder.prototype.update=function(decorated,data){var singlePlaceholder=(data.length==1&&data[0].id!=this.placeholder.id);var multipleSelections=data.length>1;if(multipleSelections||singlePlaceholder){return decorated.call(this,data);}
this.clear();var $placeholder=this.createPlaceholder(this.placeholder);this.$selection.find('.select2-selection__rendered').append($placeholder);};return Placeholder;});S2.define('select2/selection/allowClear',['jquery','../keys'],function($,KEYS){function AllowClear(){}
AllowClear.prototype.bind=function(decorated,container,$container){var self=this;decorated.call(this,container,$container);if(this.placeholder==null){if(this.options.get('debug')&&window.console&&console.error){console.error('Select2: The `allowClear` option should be used in combination '+'with the `placeholder` option.');}}
this.$selection.on('mousedown','.select2-selection__clear',function(evt){self._handleClear(evt);});container.on('keypress',function(evt){self._handleKeyboardClear(evt,container);});};AllowClear.prototype._handleClear=function(_,evt){if(this.options.get('disabled')){return;}
var $clear=this.$selection.find('.select2-selection__clear');if($clear.length===0){return;}
evt.stopPropagation();var data=$clear.data('data');for(var d=0;d<data.length;d++){var unselectData={data:data[d]};this.trigger('unselect',unselectData);if(unselectData.prevented){return;}}
this.$element.val(this.placeholder.id).trigger('change');this.trigger('toggle');};AllowClear.prototype._handleKeyboardClear=function(_,evt,container){if(container.isOpen()){return;}
if(evt.which==KEYS.DELETE||evt.which==KEYS.BACKSPACE){this._handleClear(evt);}};AllowClear.prototype.update=function(decorated,data){decorated.call(this,data);if(this.$selection.find('.select2-selection__placeholder').length>0||data.length===0){return;}
var $remove=$('<span class="select2-selection__clear">'+'&times;'+'</span>');$remove.data('data',data);this.$selection.find('.select2-selection__rendered').prepend($remove);};return AllowClear;});S2.define('select2/selection/search',['jquery','../utils','../keys'],function($,Utils,KEYS){function Search(decorated,$element,options){decorated.call(this,$element,options);}
Search.prototype.render=function(decorated){var $search=$('<li class="select2-search select2-search--inline">'+'<input class="select2-search__field" type="search" tabindex="-1"'+' autocomplete="off" autocorrect="off" autocapitalize="off"'+' spellcheck="false" role="textbox" />'+'</li>');this.$searchContainer=$search;this.$search=$search.find('input');var $rendered=decorated.call(this);this._transferTabIndex();return $rendered;};Search.prototype.bind=function(decorated,container,$container){var self=this;decorated.call(this,container,$container);container.on('open',function(){self.$search.trigger('focus');});container.on('close',function(){self.$search.val('');self.$search.trigger('focus');});container.on('enable',function(){self.$search.prop('disabled',false);self._transferTabIndex();});container.on('disable',function(){self.$search.prop('disabled',true);});container.on('focus',function(evt){self.$search.trigger('focus');});this.$selection.on('focusin','.select2-search--inline',function(evt){self.trigger('focus',evt);});this.$selection.on('focusout','.select2-search--inline',function(evt){self._handleBlur(evt);});this.$selection.on('keydown','.select2-search--inline',function(evt){evt.stopPropagation();self.trigger('keypress',evt);self._keyUpPrevented=false;var key=evt.which;if(key===KEYS.BACKSPACE&&self.$search.val()===''){var $previousChoice=self.$searchContainer.prev('.select2-selection__choice');if($previousChoice.length>0){var item=$previousChoice.data('data');self.searchRemoveChoice(item);evt.preventDefault();}}});this.$selection.on('input','.select2-search--inline',function(evt){self.$selection.off('keyup.search');});this.$selection.on('keyup.search input','.select2-search--inline',function(evt){var key=evt.which;if(key==KEYS.SHIFT||key==KEYS.CTRL||key==KEYS.ALT){return;}
if(key==KEYS.TAB){return;}
self.handleSearch(evt);});};Search.prototype._transferTabIndex=function(decorated){this.$search.attr('tabindex',this.$selection.attr('tabindex'));this.$selection.attr('tabindex','-1');};Search.prototype.createPlaceholder=function(decorated,placeholder){this.$search.attr('placeholder',placeholder.text);};Search.prototype.update=function(decorated,data){var searchHadFocus=this.$search[0]==document.activeElement;this.$search.attr('placeholder','');decorated.call(this,data);this.$selection.find('.select2-selection__rendered').append(this.$searchContainer);this.resizeSearch();if(searchHadFocus){this.$search.focus();}};Search.prototype.handleSearch=function(){this.resizeSearch();if(!this._keyUpPrevented){var input=this.$search.val();this.trigger('query',{term:input});}
this._keyUpPrevented=false;};Search.prototype.searchRemoveChoice=function(decorated,item){this.trigger('unselect',{data:item});this.trigger('open');this.$search.val(item.text+' ');};Search.prototype.resizeSearch=function(){this.$search.css('width','25px');var width='';if(this.$search.attr('placeholder')!==''){width=this.$selection.find('.select2-selection__rendered').innerWidth();}else{var minimumWidth=this.$search.val().length+1;width=(minimumWidth*0.75)+'em';}
this.$search.css('width',width);};return Search;});S2.define('select2/selection/eventRelay',['jquery'],function($){function EventRelay(){}
EventRelay.prototype.bind=function(decorated,container,$container){var self=this;var relayEvents=['open','opening','close','closing','select','selecting','unselect','unselecting'];var preventableEvents=['opening','closing','selecting','unselecting'];decorated.call(this,container,$container);container.on('*',function(name,params){if($.inArray(name,relayEvents)===-1){return;}
params=params||{};var evt=$.Event('select2:'+name,{params:params});self.$element.trigger(evt);if($.inArray(name,preventableEvents)===-1){return;}
params.prevented=false;});};return EventRelay;});S2.define('select2/translation',['jquery','require'],function($,require){function Translation(dict){this.dict=dict||{};}
Translation.prototype.all=function(){return this.dict;};Translation.prototype.get=function(key){return this.dict[key];};Translation.prototype.extend=function(translation){this.dict=$.extend({},translation.all(),this.dict);};Translation._cache={};Translation.loadPath=function(path){if(!(path in Translation._cache)){var translations=require(path);Translation._cache[path]=translations;}
return new Translation(Translation._cache[path]);};return Translation;});S2.define('select2/diacritics',[],function(){var diacritics={'\u24B6':'A','\uFF21':'A','\u00C0':'A','\u00C1':'A','\u00C2':'A','\u1EA6':'A','\u1EA4':'A','\u1EAA':'A','\u1EA8':'A','\u00C3':'A','\u0100':'A','\u0102':'A','\u1EB0':'A','\u1EAE':'A','\u1EB4':'A','\u1EB2':'A','\u0226':'A','\u01E0':'A','\u00C4':'A','\u01DE':'A','\u1EA2':'A','\u00C5':'A','\u01FA':'A','\u01CD':'A','\u0200':'A','\u0202':'A','\u1EA0':'A','\u1EAC':'A','\u1EB6':'A','\u1E00':'A','\u0104':'A','\u023A':'A','\u2C6F':'A','\uA732':'AA','\u00C6':'AE','\u01FC':'AE','\u01E2':'AE','\uA734':'AO','\uA736':'AU','\uA738':'AV','\uA73A':'AV','\uA73C':'AY','\u24B7':'B','\uFF22':'B','\u1E02':'B','\u1E04':'B','\u1E06':'B','\u0243':'B','\u0182':'B','\u0181':'B','\u24B8':'C','\uFF23':'C','\u0106':'C','\u0108':'C','\u010A':'C','\u010C':'C','\u00C7':'C','\u1E08':'C','\u0187':'C','\u023B':'C','\uA73E':'C','\u24B9':'D','\uFF24':'D','\u1E0A':'D','\u010E':'D','\u1E0C':'D','\u1E10':'D','\u1E12':'D','\u1E0E':'D','\u0110':'D','\u018B':'D','\u018A':'D','\u0189':'D','\uA779':'D','\u01F1':'DZ','\u01C4':'DZ','\u01F2':'Dz','\u01C5':'Dz','\u24BA':'E','\uFF25':'E','\u00C8':'E','\u00C9':'E','\u00CA':'E','\u1EC0':'E','\u1EBE':'E','\u1EC4':'E','\u1EC2':'E','\u1EBC':'E','\u0112':'E','\u1E14':'E','\u1E16':'E','\u0114':'E','\u0116':'E','\u00CB':'E','\u1EBA':'E','\u011A':'E','\u0204':'E','\u0206':'E','\u1EB8':'E','\u1EC6':'E','\u0228':'E','\u1E1C':'E','\u0118':'E','\u1E18':'E','\u1E1A':'E','\u0190':'E','\u018E':'E','\u24BB':'F','\uFF26':'F','\u1E1E':'F','\u0191':'F','\uA77B':'F','\u24BC':'G','\uFF27':'G','\u01F4':'G','\u011C':'G','\u1E20':'G','\u011E':'G','\u0120':'G','\u01E6':'G','\u0122':'G','\u01E4':'G','\u0193':'G','\uA7A0':'G','\uA77D':'G','\uA77E':'G','\u24BD':'H','\uFF28':'H','\u0124':'H','\u1E22':'H','\u1E26':'H','\u021E':'H','\u1E24':'H','\u1E28':'H','\u1E2A':'H','\u0126':'H','\u2C67':'H','\u2C75':'H','\uA78D':'H','\u24BE':'I','\uFF29':'I','\u00CC':'I','\u00CD':'I','\u00CE':'I','\u0128':'I','\u012A':'I','\u012C':'I','\u0130':'I','\u00CF':'I','\u1E2E':'I','\u1EC8':'I','\u01CF':'I','\u0208':'I','\u020A':'I','\u1ECA':'I','\u012E':'I','\u1E2C':'I','\u0197':'I','\u24BF':'J','\uFF2A':'J','\u0134':'J','\u0248':'J','\u24C0':'K','\uFF2B':'K','\u1E30':'K','\u01E8':'K','\u1E32':'K','\u0136':'K','\u1E34':'K','\u0198':'K','\u2C69':'K','\uA740':'K','\uA742':'K','\uA744':'K','\uA7A2':'K','\u24C1':'L','\uFF2C':'L','\u013F':'L','\u0139':'L','\u013D':'L','\u1E36':'L','\u1E38':'L','\u013B':'L','\u1E3C':'L','\u1E3A':'L','\u0141':'L','\u023D':'L','\u2C62':'L','\u2C60':'L','\uA748':'L','\uA746':'L','\uA780':'L','\u01C7':'LJ','\u01C8':'Lj','\u24C2':'M','\uFF2D':'M','\u1E3E':'M','\u1E40':'M','\u1E42':'M','\u2C6E':'M','\u019C':'M','\u24C3':'N','\uFF2E':'N','\u01F8':'N','\u0143':'N','\u00D1':'N','\u1E44':'N','\u0147':'N','\u1E46':'N','\u0145':'N','\u1E4A':'N','\u1E48':'N','\u0220':'N','\u019D':'N','\uA790':'N','\uA7A4':'N','\u01CA':'NJ','\u01CB':'Nj','\u24C4':'O','\uFF2F':'O','\u00D2':'O','\u00D3':'O','\u00D4':'O','\u1ED2':'O','\u1ED0':'O','\u1ED6':'O','\u1ED4':'O','\u00D5':'O','\u1E4C':'O','\u022C':'O','\u1E4E':'O','\u014C':'O','\u1E50':'O','\u1E52':'O','\u014E':'O','\u022E':'O','\u0230':'O','\u00D6':'O','\u022A':'O','\u1ECE':'O','\u0150':'O','\u01D1':'O','\u020C':'O','\u020E':'O','\u01A0':'O','\u1EDC':'O','\u1EDA':'O','\u1EE0':'O','\u1EDE':'O','\u1EE2':'O','\u1ECC':'O','\u1ED8':'O','\u01EA':'O','\u01EC':'O','\u00D8':'O','\u01FE':'O','\u0186':'O','\u019F':'O','\uA74A':'O','\uA74C':'O','\u01A2':'OI','\uA74E':'OO','\u0222':'OU','\u24C5':'P','\uFF30':'P','\u1E54':'P','\u1E56':'P','\u01A4':'P','\u2C63':'P','\uA750':'P','\uA752':'P','\uA754':'P','\u24C6':'Q','\uFF31':'Q','\uA756':'Q','\uA758':'Q','\u024A':'Q','\u24C7':'R','\uFF32':'R','\u0154':'R','\u1E58':'R','\u0158':'R','\u0210':'R','\u0212':'R','\u1E5A':'R','\u1E5C':'R','\u0156':'R','\u1E5E':'R','\u024C':'R','\u2C64':'R','\uA75A':'R','\uA7A6':'R','\uA782':'R','\u24C8':'S','\uFF33':'S','\u1E9E':'S','\u015A':'S','\u1E64':'S','\u015C':'S','\u1E60':'S','\u0160':'S','\u1E66':'S','\u1E62':'S','\u1E68':'S','\u0218':'S','\u015E':'S','\u2C7E':'S','\uA7A8':'S','\uA784':'S','\u24C9':'T','\uFF34':'T','\u1E6A':'T','\u0164':'T','\u1E6C':'T','\u021A':'T','\u0162':'T','\u1E70':'T','\u1E6E':'T','\u0166':'T','\u01AC':'T','\u01AE':'T','\u023E':'T','\uA786':'T','\uA728':'TZ','\u24CA':'U','\uFF35':'U','\u00D9':'U','\u00DA':'U','\u00DB':'U','\u0168':'U','\u1E78':'U','\u016A':'U','\u1E7A':'U','\u016C':'U','\u00DC':'U','\u01DB':'U','\u01D7':'U','\u01D5':'U','\u01D9':'U','\u1EE6':'U','\u016E':'U','\u0170':'U','\u01D3':'U','\u0214':'U','\u0216':'U','\u01AF':'U','\u1EEA':'U','\u1EE8':'U','\u1EEE':'U','\u1EEC':'U','\u1EF0':'U','\u1EE4':'U','\u1E72':'U','\u0172':'U','\u1E76':'U','\u1E74':'U','\u0244':'U','\u24CB':'V','\uFF36':'V','\u1E7C':'V','\u1E7E':'V','\u01B2':'V','\uA75E':'V','\u0245':'V','\uA760':'VY','\u24CC':'W','\uFF37':'W','\u1E80':'W','\u1E82':'W','\u0174':'W','\u1E86':'W','\u1E84':'W','\u1E88':'W','\u2C72':'W','\u24CD':'X','\uFF38':'X','\u1E8A':'X','\u1E8C':'X','\u24CE':'Y','\uFF39':'Y','\u1EF2':'Y','\u00DD':'Y','\u0176':'Y','\u1EF8':'Y','\u0232':'Y','\u1E8E':'Y','\u0178':'Y','\u1EF6':'Y','\u1EF4':'Y','\u01B3':'Y','\u024E':'Y','\u1EFE':'Y','\u24CF':'Z','\uFF3A':'Z','\u0179':'Z','\u1E90':'Z','\u017B':'Z','\u017D':'Z','\u1E92':'Z','\u1E94':'Z','\u01B5':'Z','\u0224':'Z','\u2C7F':'Z','\u2C6B':'Z','\uA762':'Z','\u24D0':'a','\uFF41':'a','\u1E9A':'a','\u00E0':'a','\u00E1':'a','\u00E2':'a','\u1EA7':'a','\u1EA5':'a','\u1EAB':'a','\u1EA9':'a','\u00E3':'a','\u0101':'a','\u0103':'a','\u1EB1':'a','\u1EAF':'a','\u1EB5':'a','\u1EB3':'a','\u0227':'a','\u01E1':'a','\u00E4':'a','\u01DF':'a','\u1EA3':'a','\u00E5':'a','\u01FB':'a','\u01CE':'a','\u0201':'a','\u0203':'a','\u1EA1':'a','\u1EAD':'a','\u1EB7':'a','\u1E01':'a','\u0105':'a','\u2C65':'a','\u0250':'a','\uA733':'aa','\u00E6':'ae','\u01FD':'ae','\u01E3':'ae','\uA735':'ao','\uA737':'au','\uA739':'av','\uA73B':'av','\uA73D':'ay','\u24D1':'b','\uFF42':'b','\u1E03':'b','\u1E05':'b','\u1E07':'b','\u0180':'b','\u0183':'b','\u0253':'b','\u24D2':'c','\uFF43':'c','\u0107':'c','\u0109':'c','\u010B':'c','\u010D':'c','\u00E7':'c','\u1E09':'c','\u0188':'c','\u023C':'c','\uA73F':'c','\u2184':'c','\u24D3':'d','\uFF44':'d','\u1E0B':'d','\u010F':'d','\u1E0D':'d','\u1E11':'d','\u1E13':'d','\u1E0F':'d','\u0111':'d','\u018C':'d','\u0256':'d','\u0257':'d','\uA77A':'d','\u01F3':'dz','\u01C6':'dz','\u24D4':'e','\uFF45':'e','\u00E8':'e','\u00E9':'e','\u00EA':'e','\u1EC1':'e','\u1EBF':'e','\u1EC5':'e','\u1EC3':'e','\u1EBD':'e','\u0113':'e','\u1E15':'e','\u1E17':'e','\u0115':'e','\u0117':'e','\u00EB':'e','\u1EBB':'e','\u011B':'e','\u0205':'e','\u0207':'e','\u1EB9':'e','\u1EC7':'e','\u0229':'e','\u1E1D':'e','\u0119':'e','\u1E19':'e','\u1E1B':'e','\u0247':'e','\u025B':'e','\u01DD':'e','\u24D5':'f','\uFF46':'f','\u1E1F':'f','\u0192':'f','\uA77C':'f','\u24D6':'g','\uFF47':'g','\u01F5':'g','\u011D':'g','\u1E21':'g','\u011F':'g','\u0121':'g','\u01E7':'g','\u0123':'g','\u01E5':'g','\u0260':'g','\uA7A1':'g','\u1D79':'g','\uA77F':'g','\u24D7':'h','\uFF48':'h','\u0125':'h','\u1E23':'h','\u1E27':'h','\u021F':'h','\u1E25':'h','\u1E29':'h','\u1E2B':'h','\u1E96':'h','\u0127':'h','\u2C68':'h','\u2C76':'h','\u0265':'h','\u0195':'hv','\u24D8':'i','\uFF49':'i','\u00EC':'i','\u00ED':'i','\u00EE':'i','\u0129':'i','\u012B':'i','\u012D':'i','\u00EF':'i','\u1E2F':'i','\u1EC9':'i','\u01D0':'i','\u0209':'i','\u020B':'i','\u1ECB':'i','\u012F':'i','\u1E2D':'i','\u0268':'i','\u0131':'i','\u24D9':'j','\uFF4A':'j','\u0135':'j','\u01F0':'j','\u0249':'j','\u24DA':'k','\uFF4B':'k','\u1E31':'k','\u01E9':'k','\u1E33':'k','\u0137':'k','\u1E35':'k','\u0199':'k','\u2C6A':'k','\uA741':'k','\uA743':'k','\uA745':'k','\uA7A3':'k','\u24DB':'l','\uFF4C':'l','\u0140':'l','\u013A':'l','\u013E':'l','\u1E37':'l','\u1E39':'l','\u013C':'l','\u1E3D':'l','\u1E3B':'l','\u017F':'l','\u0142':'l','\u019A':'l','\u026B':'l','\u2C61':'l','\uA749':'l','\uA781':'l','\uA747':'l','\u01C9':'lj','\u24DC':'m','\uFF4D':'m','\u1E3F':'m','\u1E41':'m','\u1E43':'m','\u0271':'m','\u026F':'m','\u24DD':'n','\uFF4E':'n','\u01F9':'n','\u0144':'n','\u00F1':'n','\u1E45':'n','\u0148':'n','\u1E47':'n','\u0146':'n','\u1E4B':'n','\u1E49':'n','\u019E':'n','\u0272':'n','\u0149':'n','\uA791':'n','\uA7A5':'n','\u01CC':'nj','\u24DE':'o','\uFF4F':'o','\u00F2':'o','\u00F3':'o','\u00F4':'o','\u1ED3':'o','\u1ED1':'o','\u1ED7':'o','\u1ED5':'o','\u00F5':'o','\u1E4D':'o','\u022D':'o','\u1E4F':'o','\u014D':'o','\u1E51':'o','\u1E53':'o','\u014F':'o','\u022F':'o','\u0231':'o','\u00F6':'o','\u022B':'o','\u1ECF':'o','\u0151':'o','\u01D2':'o','\u020D':'o','\u020F':'o','\u01A1':'o','\u1EDD':'o','\u1EDB':'o','\u1EE1':'o','\u1EDF':'o','\u1EE3':'o','\u1ECD':'o','\u1ED9':'o','\u01EB':'o','\u01ED':'o','\u00F8':'o','\u01FF':'o','\u0254':'o','\uA74B':'o','\uA74D':'o','\u0275':'o','\u01A3':'oi','\u0223':'ou','\uA74F':'oo','\u24DF':'p','\uFF50':'p','\u1E55':'p','\u1E57':'p','\u01A5':'p','\u1D7D':'p','\uA751':'p','\uA753':'p','\uA755':'p','\u24E0':'q','\uFF51':'q','\u024B':'q','\uA757':'q','\uA759':'q','\u24E1':'r','\uFF52':'r','\u0155':'r','\u1E59':'r','\u0159':'r','\u0211':'r','\u0213':'r','\u1E5B':'r','\u1E5D':'r','\u0157':'r','\u1E5F':'r','\u024D':'r','\u027D':'r','\uA75B':'r','\uA7A7':'r','\uA783':'r','\u24E2':'s','\uFF53':'s','\u00DF':'s','\u015B':'s','\u1E65':'s','\u015D':'s','\u1E61':'s','\u0161':'s','\u1E67':'s','\u1E63':'s','\u1E69':'s','\u0219':'s','\u015F':'s','\u023F':'s','\uA7A9':'s','\uA785':'s','\u1E9B':'s','\u24E3':'t','\uFF54':'t','\u1E6B':'t','\u1E97':'t','\u0165':'t','\u1E6D':'t','\u021B':'t','\u0163':'t','\u1E71':'t','\u1E6F':'t','\u0167':'t','\u01AD':'t','\u0288':'t','\u2C66':'t','\uA787':'t','\uA729':'tz','\u24E4':'u','\uFF55':'u','\u00F9':'u','\u00FA':'u','\u00FB':'u','\u0169':'u','\u1E79':'u','\u016B':'u','\u1E7B':'u','\u016D':'u','\u00FC':'u','\u01DC':'u','\u01D8':'u','\u01D6':'u','\u01DA':'u','\u1EE7':'u','\u016F':'u','\u0171':'u','\u01D4':'u','\u0215':'u','\u0217':'u','\u01B0':'u','\u1EEB':'u','\u1EE9':'u','\u1EEF':'u','\u1EED':'u','\u1EF1':'u','\u1EE5':'u','\u1E73':'u','\u0173':'u','\u1E77':'u','\u1E75':'u','\u0289':'u','\u24E5':'v','\uFF56':'v','\u1E7D':'v','\u1E7F':'v','\u028B':'v','\uA75F':'v','\u028C':'v','\uA761':'vy','\u24E6':'w','\uFF57':'w','\u1E81':'w','\u1E83':'w','\u0175':'w','\u1E87':'w','\u1E85':'w','\u1E98':'w','\u1E89':'w','\u2C73':'w','\u24E7':'x','\uFF58':'x','\u1E8B':'x','\u1E8D':'x','\u24E8':'y','\uFF59':'y','\u1EF3':'y','\u00FD':'y','\u0177':'y','\u1EF9':'y','\u0233':'y','\u1E8F':'y','\u00FF':'y','\u1EF7':'y','\u1E99':'y','\u1EF5':'y','\u01B4':'y','\u024F':'y','\u1EFF':'y','\u24E9':'z','\uFF5A':'z','\u017A':'z','\u1E91':'z','\u017C':'z','\u017E':'z','\u1E93':'z','\u1E95':'z','\u01B6':'z','\u0225':'z','\u0240':'z','\u2C6C':'z','\uA763':'z','\u0386':'\u0391','\u0388':'\u0395','\u0389':'\u0397','\u038A':'\u0399','\u03AA':'\u0399','\u038C':'\u039F','\u038E':'\u03A5','\u03AB':'\u03A5','\u038F':'\u03A9','\u03AC':'\u03B1','\u03AD':'\u03B5','\u03AE':'\u03B7','\u03AF':'\u03B9','\u03CA':'\u03B9','\u0390':'\u03B9','\u03CC':'\u03BF','\u03CD':'\u03C5','\u03CB':'\u03C5','\u03B0':'\u03C5','\u03C9':'\u03C9','\u03C2':'\u03C3'};return diacritics;});S2.define('select2/data/base',['../utils'],function(Utils){function BaseAdapter($element,options){BaseAdapter.__super__.constructor.call(this);}
Utils.Extend(BaseAdapter,Utils.Observable);BaseAdapter.prototype.current=function(callback){throw new Error('The `current` method must be defined in child classes.');};BaseAdapter.prototype.query=function(params,callback){throw new Error('The `query` method must be defined in child classes.');};BaseAdapter.prototype.bind=function(container,$container){};BaseAdapter.prototype.destroy=function(){};BaseAdapter.prototype.generateResultId=function(container,data){var id=container.id+'-result-';id+=Utils.generateChars(4);if(data.id!=null){id+='-'+data.id.toString();}else{id+='-'+Utils.generateChars(4);}
return id;};return BaseAdapter;});S2.define('select2/data/select',['./base','../utils','jquery'],function(BaseAdapter,Utils,$){function SelectAdapter($element,options){this.$element=$element;this.options=options;SelectAdapter.__super__.constructor.call(this);}
Utils.Extend(SelectAdapter,BaseAdapter);SelectAdapter.prototype.current=function(callback){var data=[];var self=this;this.$element.find(':selected').each(function(){var $option=$(this);var option=self.item($option);data.push(option);});callback(data);};SelectAdapter.prototype.select=function(data){var self=this;data.selected=true;if($(data.element).is('option')){data.element.selected=true;this.$element.trigger('change');return;}
if(this.$element.prop('multiple')){this.current(function(currentData){var val=[];data=[data];data.push.apply(data,currentData);for(var d=0;d<data.length;d++){var id=data[d].id;if($.inArray(id,val)===-1){val.push(id);}}
self.$element.val(val);self.$element.trigger('change');});}else{var val=data.id;this.$element.val(val);this.$element.trigger('change');}};SelectAdapter.prototype.unselect=function(data){var self=this;if(!this.$element.prop('multiple')){return;}
data.selected=false;if($(data.element).is('option')){data.element.selected=false;this.$element.trigger('change');return;}
this.current(function(currentData){var val=[];for(var d=0;d<currentData.length;d++){var id=currentData[d].id;if(id!==data.id&&$.inArray(id,val)===-1){val.push(id);}}
self.$element.val(val);self.$element.trigger('change');});};SelectAdapter.prototype.bind=function(container,$container){var self=this;this.container=container;container.on('select',function(params){self.select(params.data);});container.on('unselect',function(params){self.unselect(params.data);});};SelectAdapter.prototype.destroy=function(){this.$element.find('*').each(function(){$.removeData(this,'data');});};SelectAdapter.prototype.query=function(params,callback){var data=[];var self=this;var $options=this.$element.children();$options.each(function(){var $option=$(this);if(!$option.is('option')&&!$option.is('optgroup')){return;}
var option=self.item($option);var matches=self.matches(params,option);if(matches!==null){data.push(matches);}});callback({results:data});};SelectAdapter.prototype.addOptions=function($options){Utils.appendMany(this.$element,$options);};SelectAdapter.prototype.option=function(data){var option;if(data.children){option=document.createElement('optgroup');option.label=data.text;}else{option=document.createElement('option');if(option.textContent!==undefined){option.textContent=data.text;}else{option.innerText=data.text;}}
if(data.id){option.value=data.id;}
if(data.disabled){option.disabled=true;}
if(data.selected){option.selected=true;}
if(data.title){option.title=data.title;}
var $option=$(option);var normalizedData=this._normalizeItem(data);normalizedData.element=option;$.data(option,'data',normalizedData);return $option;};SelectAdapter.prototype.item=function($option){var data={};data=$.data($option[0],'data');if(data!=null){return data;}
if($option.is('option')){data={id:$option.val(),text:$option.text(),disabled:$option.prop('disabled'),selected:$option.prop('selected'),title:$option.prop('title')};}else if($option.is('optgroup')){data={text:$option.prop('label'),children:[],title:$option.prop('title')};var $children=$option.children('option');var children=[];for(var c=0;c<$children.length;c++){var $child=$($children[c]);var child=this.item($child);children.push(child);}
data.children=children;}
data=this._normalizeItem(data);data.element=$option[0];$.data($option[0],'data',data);return data;};SelectAdapter.prototype._normalizeItem=function(item){if(!$.isPlainObject(item)){item={id:item,text:item};}
item=$.extend({},{text:''},item);var defaults={selected:false,disabled:false};if(item.id!=null){item.id=item.id.toString();}
if(item.text!=null){item.text=item.text.toString();}
if(item._resultId==null&&item.id&&this.container!=null){item._resultId=this.generateResultId(this.container,item);}
return $.extend({},defaults,item);};SelectAdapter.prototype.matches=function(params,data){var matcher=this.options.get('matcher');return matcher(params,data);};return SelectAdapter;});S2.define('select2/data/array',['./select','../utils','jquery'],function(SelectAdapter,Utils,$){function ArrayAdapter($element,options){var data=options.get('data')||[];ArrayAdapter.__super__.constructor.call(this,$element,options);this.addOptions(this.convertToOptions(data));}
Utils.Extend(ArrayAdapter,SelectAdapter);ArrayAdapter.prototype.select=function(data){var $option=this.$element.find('option').filter(function(i,elm){return elm.value==data.id.toString();});if($option.length===0){$option=this.option(data);this.addOptions($option);}
ArrayAdapter.__super__.select.call(this,data);};ArrayAdapter.prototype.convertToOptions=function(data){var self=this;var $existing=this.$element.find('option');var existingIds=$existing.map(function(){return self.item($(this)).id;}).get();var $options=[];function onlyItem(item){return function(){return $(this).val()==item.id;};}
for(var d=0;d<data.length;d++){var item=this._normalizeItem(data[d]);if($.inArray(item.id,existingIds)>=0){var $existingOption=$existing.filter(onlyItem(item));var existingData=this.item($existingOption);var newData=$.extend(true,{},existingData,item);var $newOption=this.option(existingData);$existingOption.replaceWith($newOption);continue;}
var $option=this.option(item);if(item.children){var $children=this.convertToOptions(item.children);Utils.appendMany($option,$children);}
$options.push($option);}
return $options;};return ArrayAdapter;});S2.define('select2/data/ajax',['./array','../utils','jquery'],function(ArrayAdapter,Utils,$){function AjaxAdapter($element,options){this.ajaxOptions=this._applyDefaults(options.get('ajax'));if(this.ajaxOptions.processResults!=null){this.processResults=this.ajaxOptions.processResults;}
AjaxAdapter.__super__.constructor.call(this,$element,options);}
Utils.Extend(AjaxAdapter,ArrayAdapter);AjaxAdapter.prototype._applyDefaults=function(options){var defaults={data:function(params){return{q:params.term};},transport:function(params,success,failure){var $request=$.ajax(params);$request.then(success);$request.fail(failure);return $request;}};return $.extend({},defaults,options,true);};AjaxAdapter.prototype.processResults=function(results){return results;};AjaxAdapter.prototype.query=function(params,callback){var matches=[];var self=this;if(this._request!=null){if($.isFunction(this._request.abort)){this._request.abort();}
this._request=null;}
var options=$.extend({type:'GET'},this.ajaxOptions);if(typeof options.url==='function'){options.url=options.url(params);}
if(typeof options.data==='function'){options.data=options.data(params);}
function request(){var $request=options.transport(options,function(data){var results=self.processResults(data,params);if(self.options.get('debug')&&window.console&&console.error){if(!results||!results.results||!$.isArray(results.results)){console.error('Select2: The AJAX results did not return an array in the '+'`results` key of the response.');}}
callback(results);},function(){});self._request=$request;}
if(this.ajaxOptions.delay&&params.term!==''){if(this._queryTimeout){window.clearTimeout(this._queryTimeout);}
this._queryTimeout=window.setTimeout(request,this.ajaxOptions.delay);}else{request();}};return AjaxAdapter;});S2.define('select2/data/tags',['jquery'],function($){function Tags(decorated,$element,options){var tags=options.get('tags');var createTag=options.get('createTag');if(createTag!==undefined){this.createTag=createTag;}
decorated.call(this,$element,options);if($.isArray(tags)){for(var t=0;t<tags.length;t++){var tag=tags[t];var item=this._normalizeItem(tag);var $option=this.option(item);this.$element.append($option);}}}
Tags.prototype.query=function(decorated,params,callback){var self=this;this._removeOldTags();if(params.term==null||params.page!=null){decorated.call(this,params,callback);return;}
function wrapper(obj,child){var data=obj.results;for(var i=0;i<data.length;i++){var option=data[i];var checkChildren=(option.children!=null&&!wrapper({results:option.children},true));var checkText=option.text===params.term;if(checkText||checkChildren){if(child){return false;}
obj.data=data;callback(obj);return;}}
if(child){return true;}
var tag=self.createTag(params);if(tag!=null){var $option=self.option(tag);$option.attr('data-select2-tag',true);self.addOptions([$option]);self.insertTag(data,tag);}
obj.results=data;callback(obj);}
decorated.call(this,params,wrapper);};Tags.prototype.createTag=function(decorated,params){var term=$.trim(params.term);if(term===''){return null;}
return{id:term,text:term};};Tags.prototype.insertTag=function(_,data,tag){data.unshift(tag);};Tags.prototype._removeOldTags=function(_){var tag=this._lastTag;var $options=this.$element.find('option[data-select2-tag]');$options.each(function(){if(this.selected){return;}
$(this).remove();});};return Tags;});S2.define('select2/data/tokenizer',['jquery'],function($){function Tokenizer(decorated,$element,options){var tokenizer=options.get('tokenizer');if(tokenizer!==undefined){this.tokenizer=tokenizer;}
decorated.call(this,$element,options);}
Tokenizer.prototype.bind=function(decorated,container,$container){decorated.call(this,container,$container);this.$search=container.dropdown.$search||container.selection.$search||$container.find('.select2-search__field');};Tokenizer.prototype.query=function(decorated,params,callback){var self=this;function select(data){self.select(data);}
params.term=params.term||'';var tokenData=this.tokenizer(params,this.options,select);if(tokenData.term!==params.term){if(this.$search.length){this.$search.val(tokenData.term);this.$search.focus();}
params.term=tokenData.term;}
decorated.call(this,params,callback);};Tokenizer.prototype.tokenizer=function(_,params,options,callback){var separators=options.get('tokenSeparators')||[];var term=params.term;var i=0;var createTag=this.createTag||function(params){return{id:params.term,text:params.term};};while(i<term.length){var termChar=term[i];if($.inArray(termChar,separators)===-1){i++;continue;}
var part=term.substr(0,i);var partParams=$.extend({},params,{term:part});var data=createTag(partParams);callback(data);term=term.substr(i+1)||'';i=0;}
return{term:term};};return Tokenizer;});S2.define('select2/data/minimumInputLength',[],function(){function MinimumInputLength(decorated,$e,options){this.minimumInputLength=options.get('minimumInputLength');decorated.call(this,$e,options);}
MinimumInputLength.prototype.query=function(decorated,params,callback){params.term=params.term||'';if(params.term.length<this.minimumInputLength){this.trigger('results:message',{message:'inputTooShort',args:{minimum:this.minimumInputLength,input:params.term,params:params}});return;}
decorated.call(this,params,callback);};return MinimumInputLength;});S2.define('select2/data/maximumInputLength',[],function(){function MaximumInputLength(decorated,$e,options){this.maximumInputLength=options.get('maximumInputLength');decorated.call(this,$e,options);}
MaximumInputLength.prototype.query=function(decorated,params,callback){params.term=params.term||'';if(this.maximumInputLength>0&&params.term.length>this.maximumInputLength){this.trigger('results:message',{message:'inputTooLong',args:{maximum:this.maximumInputLength,input:params.term,params:params}});return;}
decorated.call(this,params,callback);};return MaximumInputLength;});S2.define('select2/data/maximumSelectionLength',[],function(){function MaximumSelectionLength(decorated,$e,options){this.maximumSelectionLength=options.get('maximumSelectionLength');decorated.call(this,$e,options);}
MaximumSelectionLength.prototype.query=function(decorated,params,callback){var self=this;this.current(function(currentData){var count=currentData!=null?currentData.length:0;if(self.maximumSelectionLength>0&&count>=self.maximumSelectionLength){self.trigger('results:message',{message:'maximumSelected',args:{maximum:self.maximumSelectionLength}});return;}
decorated.call(self,params,callback);});};return MaximumSelectionLength;});S2.define('select2/dropdown',['jquery','./utils'],function($,Utils){function Dropdown($element,options){this.$element=$element;this.options=options;Dropdown.__super__.constructor.call(this);}
Utils.Extend(Dropdown,Utils.Observable);Dropdown.prototype.render=function(){var $dropdown=$('<span class="select2-dropdown">'+'<span class="select2-results"></span>'+'</span>');$dropdown.attr('dir',this.options.get('dir'));this.$dropdown=$dropdown;return $dropdown;};Dropdown.prototype.position=function($dropdown,$container){};Dropdown.prototype.destroy=function(){this.$dropdown.remove();};return Dropdown;});S2.define('select2/dropdown/search',['jquery','../utils'],function($,Utils){function Search(){}
Search.prototype.render=function(decorated){var $rendered=decorated.call(this);var $search=$('<span class="select2-search select2-search--dropdown">'+'<input class="select2-search__field" type="search" tabindex="-1"'+' autocomplete="off" autocorrect="off" autocapitalize="off"'+' spellcheck="false" role="textbox" />'+'</span>');this.$searchContainer=$search;this.$search=$search.find('input');$rendered.prepend($search);return $rendered;};Search.prototype.bind=function(decorated,container,$container){var self=this;decorated.call(this,container,$container);this.$search.on('keydown',function(evt){self.trigger('keypress',evt);self._keyUpPrevented=false;});this.$search.on('input',function(evt){$(this).off('keyup');});this.$search.on('keyup input',function(evt){self.handleSearch(evt);});container.on('open',function(){self.$search.attr('tabindex',0);self.$search.focus();window.setTimeout(function(){self.$search.focus();},0);});container.on('close',function(){self.$search.attr('tabindex',-1);self.$search.val('');});container.on('results:all',function(params){if(params.query.term==null||params.query.term===''){var showSearch=self.showSearch(params);if(showSearch){self.$searchContainer.removeClass('select2-search--hide');}else{self.$searchContainer.addClass('select2-search--hide');}}});};Search.prototype.handleSearch=function(evt){if(!this._keyUpPrevented){var input=this.$search.val();this.trigger('query',{term:input});}
this._keyUpPrevented=false;};Search.prototype.showSearch=function(_,params){return true;};return Search;});S2.define('select2/dropdown/hidePlaceholder',[],function(){function HidePlaceholder(decorated,$element,options,dataAdapter){this.placeholder=this.normalizePlaceholder(options.get('placeholder'));decorated.call(this,$element,options,dataAdapter);}
HidePlaceholder.prototype.append=function(decorated,data){data.results=this.removePlaceholder(data.results);decorated.call(this,data);};HidePlaceholder.prototype.normalizePlaceholder=function(_,placeholder){if(typeof placeholder==='string'){placeholder={id:'',text:placeholder};}
return placeholder;};HidePlaceholder.prototype.removePlaceholder=function(_,data){var modifiedData=data.slice(0);for(var d=data.length-1;d>=0;d--){var item=data[d];if(this.placeholder.id===item.id){modifiedData.splice(d,1);}}
return modifiedData;};return HidePlaceholder;});S2.define('select2/dropdown/infiniteScroll',['jquery'],function($){function InfiniteScroll(decorated,$element,options,dataAdapter){this.lastParams={};decorated.call(this,$element,options,dataAdapter);this.$loadingMore=this.createLoadingMore();this.loading=false;}
InfiniteScroll.prototype.append=function(decorated,data){this.$loadingMore.remove();this.loading=false;decorated.call(this,data);if(this.showLoadingMore(data)){this.$results.append(this.$loadingMore);}};InfiniteScroll.prototype.bind=function(decorated,container,$container){var self=this;decorated.call(this,container,$container);container.on('query',function(params){self.lastParams=params;self.loading=true;});container.on('query:append',function(params){self.lastParams=params;self.loading=true;});this.$results.on('scroll',function(){var isLoadMoreVisible=$.contains(document.documentElement,self.$loadingMore[0]);if(self.loading||!isLoadMoreVisible){return;}
var currentOffset=self.$results.offset().top+
self.$results.outerHeight(false);var loadingMoreOffset=self.$loadingMore.offset().top+
self.$loadingMore.outerHeight(false);if(currentOffset+50>=loadingMoreOffset){self.loadMore();}});};InfiniteScroll.prototype.loadMore=function(){this.loading=true;var params=$.extend({},{page:1},this.lastParams);params.page++;this.trigger('query:append',params);};InfiniteScroll.prototype.showLoadingMore=function(_,data){return data.pagination&&data.pagination.more;};InfiniteScroll.prototype.createLoadingMore=function(){var $option=$('<li class="option load-more" role="treeitem"></li>');var message=this.options.get('translations').get('loadingMore');$option.html(message(this.lastParams));return $option;};return InfiniteScroll;});S2.define('select2/dropdown/attachBody',['jquery','../utils'],function($,Utils){function AttachBody(decorated,$element,options){this.$dropdownParent=options.get('dropdownParent')||document.body;decorated.call(this,$element,options);}
AttachBody.prototype.bind=function(decorated,container,$container){var self=this;var setupResultsEvents=false;decorated.call(this,container,$container);container.on('open',function(){self._showDropdown();self._attachPositioningHandler(container);if(!setupResultsEvents){setupResultsEvents=true;container.on('results:all',function(){self._positionDropdown();self._resizeDropdown();});container.on('results:append',function(){self._positionDropdown();self._resizeDropdown();});}});container.on('close',function(){self._hideDropdown();self._detachPositioningHandler(container);});this.$dropdownContainer.on('mousedown',function(evt){evt.stopPropagation();});};AttachBody.prototype.position=function(decorated,$dropdown,$container){$dropdown.attr('class',$container.attr('class'));$dropdown.removeClass('select2');$dropdown.addClass('select2-container--open');$dropdown.css({position:'absolute',top:-999999});this.$container=$container;};AttachBody.prototype.render=function(decorated){var $container=$('<span></span>');var $dropdown=decorated.call(this);$container.append($dropdown);this.$dropdownContainer=$container;return $container;};AttachBody.prototype._hideDropdown=function(decorated){this.$dropdownContainer.detach();};AttachBody.prototype._attachPositioningHandler=function(container){var self=this;var scrollEvent='scroll.select2.'+container.id;var resizeEvent='resize.select2.'+container.id;var orientationEvent='orientationchange.select2.'+container.id;var $watchers=this.$container.parents().filter(Utils.hasScroll);$watchers.each(function(){$(this).data('select2-scroll-position',{x:$(this).scrollLeft(),y:$(this).scrollTop()});});$watchers.on(scrollEvent,function(ev){var position=$(this).data('select2-scroll-position');$(this).scrollTop(position.y);});$(window).on(scrollEvent+' '+resizeEvent+' '+orientationEvent,function(e){self._positionDropdown();self._resizeDropdown();});};AttachBody.prototype._detachPositioningHandler=function(container){var scrollEvent='scroll.select2.'+container.id;var resizeEvent='resize.select2.'+container.id;var orientationEvent='orientationchange.select2.'+container.id;var $watchers=this.$container.parents().filter(Utils.hasScroll);$watchers.off(scrollEvent);$(window).off(scrollEvent+' '+resizeEvent+' '+orientationEvent);};AttachBody.prototype._positionDropdown=function(){var $window=$(window);var isCurrentlyAbove=this.$dropdown.hasClass('select2-dropdown--above');var isCurrentlyBelow=this.$dropdown.hasClass('select2-dropdown--below');var newDirection=null;var position=this.$container.position();var offset=this.$container.offset();offset.bottom=offset.top+this.$container.outerHeight(false);var container={height:this.$container.outerHeight(false)};container.top=offset.top;container.bottom=offset.top+container.height;var dropdown={height:this.$dropdown.outerHeight(false)};var viewport={top:$window.scrollTop(),bottom:$window.scrollTop()+$window.height()};var enoughRoomAbove=viewport.top<(offset.top-dropdown.height);var enoughRoomBelow=viewport.bottom>(offset.bottom+dropdown.height);var css={left:offset.left,top:container.bottom};if(!isCurrentlyAbove&&!isCurrentlyBelow){newDirection='below';}
if(!enoughRoomBelow&&enoughRoomAbove&&!isCurrentlyAbove){newDirection='above';}else if(!enoughRoomAbove&&enoughRoomBelow&&isCurrentlyAbove){newDirection='below';}
if(newDirection=='above'||(isCurrentlyAbove&&newDirection!=='below')){css.top=container.top-dropdown.height;}
if(newDirection!=null){this.$dropdown.removeClass('select2-dropdown--below select2-dropdown--above').addClass('select2-dropdown--'+newDirection);this.$container.removeClass('select2-container--below select2-container--above').addClass('select2-container--'+newDirection);}
this.$dropdownContainer.css(css);};AttachBody.prototype._resizeDropdown=function(){this.$dropdownContainer.width();var css={width:this.$container.outerWidth(false)+'px'};if(this.options.get('dropdownAutoWidth')){css.minWidth=css.width;css.width='auto';}
this.$dropdown.css(css);};AttachBody.prototype._showDropdown=function(decorated){this.$dropdownContainer.appendTo(this.$dropdownParent);this._positionDropdown();this._resizeDropdown();};return AttachBody;});S2.define('select2/dropdown/minimumResultsForSearch',[],function(){function countResults(data){var count=0;for(var d=0;d<data.length;d++){var item=data[d];if(item.children){count+=countResults(item.children);}else{count++;}}
return count;}
function MinimumResultsForSearch(decorated,$element,options,dataAdapter){this.minimumResultsForSearch=options.get('minimumResultsForSearch');if(this.minimumResultsForSearch<0){this.minimumResultsForSearch=Infinity;}
decorated.call(this,$element,options,dataAdapter);}
MinimumResultsForSearch.prototype.showSearch=function(decorated,params){if(countResults(params.data.results)<this.minimumResultsForSearch){return false;}
return decorated.call(this,params);};return MinimumResultsForSearch;});S2.define('select2/dropdown/selectOnClose',[],function(){function SelectOnClose(){}
SelectOnClose.prototype.bind=function(decorated,container,$container){var self=this;decorated.call(this,container,$container);container.on('close',function(){self._handleSelectOnClose();});};SelectOnClose.prototype._handleSelectOnClose=function(){var $highlightedResults=this.getHighlightedResults();if($highlightedResults.length<1){return;}
this.trigger('select',{data:$highlightedResults.data('data')});};return SelectOnClose;});S2.define('select2/dropdown/closeOnSelect',[],function(){function CloseOnSelect(){}
CloseOnSelect.prototype.bind=function(decorated,container,$container){var self=this;decorated.call(this,container,$container);container.on('select',function(evt){self._selectTriggered(evt);});container.on('unselect',function(evt){self._selectTriggered(evt);});};CloseOnSelect.prototype._selectTriggered=function(_,evt){var originalEvent=evt.originalEvent;if(originalEvent&&originalEvent.ctrlKey){return;}
this.trigger('close');};return CloseOnSelect;});S2.define('select2/i18n/en',[],function(){return{errorLoading:function(){return'The results could not be loaded.';},inputTooLong:function(args){var overChars=args.input.length-args.maximum;var message='Please delete '+overChars+' character';if(overChars!=1){message+='s';}
return message;},inputTooShort:function(args){var remainingChars=args.minimum-args.input.length;var message='Please enter '+remainingChars+' or more characters';return message;},loadingMore:function(){return'Loading more results…';},maximumSelected:function(args){var message='You can only select '+args.maximum+' item';if(args.maximum!=1){message+='s';}
return message;},noResults:function(){return'No results found';},searching:function(){return'Searching…';}};});S2.define('select2/defaults',['jquery','require','./results','./selection/single','./selection/multiple','./selection/placeholder','./selection/allowClear','./selection/search','./selection/eventRelay','./utils','./translation','./diacritics','./data/select','./data/array','./data/ajax','./data/tags','./data/tokenizer','./data/minimumInputLength','./data/maximumInputLength','./data/maximumSelectionLength','./dropdown','./dropdown/search','./dropdown/hidePlaceholder','./dropdown/infiniteScroll','./dropdown/attachBody','./dropdown/minimumResultsForSearch','./dropdown/selectOnClose','./dropdown/closeOnSelect','./i18n/en'],function($,require,ResultsList,SingleSelection,MultipleSelection,Placeholder,AllowClear,SelectionSearch,EventRelay,Utils,Translation,DIACRITICS,SelectData,ArrayData,AjaxData,Tags,Tokenizer,MinimumInputLength,MaximumInputLength,MaximumSelectionLength,Dropdown,DropdownSearch,HidePlaceholder,InfiniteScroll,AttachBody,MinimumResultsForSearch,SelectOnClose,CloseOnSelect,EnglishTranslation){function Defaults(){this.reset();}
Defaults.prototype.apply=function(options){options=$.extend({},this.defaults,options);if(options.dataAdapter==null){if(options.ajax!=null){options.dataAdapter=AjaxData;}else if(options.data!=null){options.dataAdapter=ArrayData;}else{options.dataAdapter=SelectData;}
if(options.minimumInputLength>0){options.dataAdapter=Utils.Decorate(options.dataAdapter,MinimumInputLength);}
if(options.maximumInputLength>0){options.dataAdapter=Utils.Decorate(options.dataAdapter,MaximumInputLength);}
if(options.maximumSelectionLength>0){options.dataAdapter=Utils.Decorate(options.dataAdapter,MaximumSelectionLength);}
if(options.tags){options.dataAdapter=Utils.Decorate(options.dataAdapter,Tags);}
if(options.tokenSeparators!=null||options.tokenizer!=null){options.dataAdapter=Utils.Decorate(options.dataAdapter,Tokenizer);}
if(options.query!=null){var Query=require(options.amdBase+'compat/query');options.dataAdapter=Utils.Decorate(options.dataAdapter,Query);}
if(options.initSelection!=null){var InitSelection=require(options.amdBase+'compat/initSelection');options.dataAdapter=Utils.Decorate(options.dataAdapter,InitSelection);}}
if(options.resultsAdapter==null){options.resultsAdapter=ResultsList;if(options.ajax!=null){options.resultsAdapter=Utils.Decorate(options.resultsAdapter,InfiniteScroll);}
if(options.placeholder!=null){options.resultsAdapter=Utils.Decorate(options.resultsAdapter,HidePlaceholder);}
if(options.selectOnClose){options.resultsAdapter=Utils.Decorate(options.resultsAdapter,SelectOnClose);}}
if(options.dropdownAdapter==null){if(options.multiple){options.dropdownAdapter=Dropdown;}else{var SearchableDropdown=Utils.Decorate(Dropdown,DropdownSearch);options.dropdownAdapter=SearchableDropdown;}
if(options.minimumResultsForSearch!==0){options.dropdownAdapter=Utils.Decorate(options.dropdownAdapter,MinimumResultsForSearch);}
if(options.closeOnSelect){options.dropdownAdapter=Utils.Decorate(options.dropdownAdapter,CloseOnSelect);}
if(options.dropdownCssClass!=null||options.dropdownCss!=null||options.adaptDropdownCssClass!=null){var DropdownCSS=require(options.amdBase+'compat/dropdownCss');options.dropdownAdapter=Utils.Decorate(options.dropdownAdapter,DropdownCSS);}
options.dropdownAdapter=Utils.Decorate(options.dropdownAdapter,AttachBody);}
if(options.selectionAdapter==null){if(options.multiple){options.selectionAdapter=MultipleSelection;}else{options.selectionAdapter=SingleSelection;}
if(options.placeholder!=null){options.selectionAdapter=Utils.Decorate(options.selectionAdapter,Placeholder);}
if(options.allowClear){options.selectionAdapter=Utils.Decorate(options.selectionAdapter,AllowClear);}
if(options.multiple){options.selectionAdapter=Utils.Decorate(options.selectionAdapter,SelectionSearch);}
if(options.containerCssClass!=null||options.containerCss!=null||options.adaptContainerCssClass!=null){var ContainerCSS=require(options.amdBase+'compat/containerCss');options.selectionAdapter=Utils.Decorate(options.selectionAdapter,ContainerCSS);}
options.selectionAdapter=Utils.Decorate(options.selectionAdapter,EventRelay);}
if(typeof options.language==='string'){if(options.language.indexOf('-')>0){var languageParts=options.language.split('-');var baseLanguage=languageParts[0];options.language=[options.language,baseLanguage];}else{options.language=[options.language];}}
if($.isArray(options.language)){var languages=new Translation();options.language.push('en');var languageNames=options.language;for(var l=0;l<languageNames.length;l++){var name=languageNames[l];var language={};try{language=Translation.loadPath(name);}catch(e){try{name=this.defaults.amdLanguageBase+name;language=Translation.loadPath(name);}catch(ex){if(options.debug&&window.console&&console.warn){console.warn('Select2: The language file for "'+name+'" could not be '+'automatically loaded. A fallback will be used instead.');}
continue;}}
languages.extend(language);}
options.translations=languages;}else{var baseTranslation=Translation.loadPath(this.defaults.amdLanguageBase+'en');var customTranslation=new Translation(options.language);customTranslation.extend(baseTranslation);options.translations=customTranslation;}
return options;};Defaults.prototype.reset=function(){function stripDiacritics(text){function match(a){return DIACRITICS[a]||a;}
return text.replace(/[^\u0000-\u007E]/g,match);}
function matcher(params,data){if($.trim(params.term)===''){return data;}
if(data.children&&data.children.length>0){var match=$.extend(true,{},data);for(var c=data.children.length-1;c>=0;c--){var child=data.children[c];var matches=matcher(params,child);if(matches==null){match.children.splice(c,1);}}
if(match.children.length>0){return match;}
return matcher(params,match);}
var original=stripDiacritics(data.text).toUpperCase();var term=stripDiacritics(params.term).toUpperCase();if(original.indexOf(term)>-1){return data;}
return null;}
this.defaults={amdBase:'./',amdLanguageBase:'./i18n/',closeOnSelect:true,debug:false,dropdownAutoWidth:false,escapeMarkup:Utils.escapeMarkup,language:EnglishTranslation,matcher:matcher,minimumInputLength:0,maximumInputLength:0,maximumSelectionLength:0,minimumResultsForSearch:0,selectOnClose:false,sorter:function(data){return data;},templateResult:function(result){return result.text;},templateSelection:function(selection){return selection.text;},theme:'default',width:'resolve'};};Defaults.prototype.set=function(key,value){var camelKey=$.camelCase(key);var data={};data[camelKey]=value;var convertedData=Utils._convertData(data);$.extend(this.defaults,convertedData);};var defaults=new Defaults();return defaults;});S2.define('select2/options',['require','jquery','./defaults','./utils'],function(require,$,Defaults,Utils){function Options(options,$element){this.options=options;if($element!=null){this.fromElement($element);}
this.options=Defaults.apply(this.options);if($element&&$element.is('input')){var InputCompat=require(this.get('amdBase')+'compat/inputData');this.options.dataAdapter=Utils.Decorate(this.options.dataAdapter,InputCompat);}}
Options.prototype.fromElement=function($e){var excludedData=['select2'];if(this.options.multiple==null){this.options.multiple=$e.prop('multiple');}
if(this.options.disabled==null){this.options.disabled=$e.prop('disabled');}
if(this.options.language==null){if($e.prop('lang')){this.options.language=$e.prop('lang').toLowerCase();}else if($e.closest('[lang]').prop('lang')){this.options.language=$e.closest('[lang]').prop('lang');}}
if(this.options.dir==null){if($e.prop('dir')){this.options.dir=$e.prop('dir');}else if($e.closest('[dir]').prop('dir')){this.options.dir=$e.closest('[dir]').prop('dir');}else{this.options.dir='ltr';}}
$e.prop('disabled',this.options.disabled);$e.prop('multiple',this.options.multiple);if($e.data('select2Tags')){if(this.options.debug&&window.console&&console.warn){console.warn('Select2: The `data-select2-tags` attribute has been changed to '+'use the `data-data` and `data-tags="true"` attributes and will be '+'removed in future versions of Select2.');}
$e.data('data',$e.data('select2Tags'));$e.data('tags',true);}
if($e.data('ajaxUrl')){if(this.options.debug&&window.console&&console.warn){console.warn('Select2: The `data-ajax-url` attribute has been changed to '+'`data-ajax--url` and support for the old attribute will be removed'+' in future versions of Select2.');}
$e.attr('ajax--url',$e.data('ajaxUrl'));$e.data('ajax--url',$e.data('ajaxUrl'));}
var dataset={};if($.fn.jquery&&$.fn.jquery.substr(0,2)=='1.'&&$e[0].dataset){dataset=$.extend(true,{},$e[0].dataset,$e.data());}else{dataset=$e.data();}
var data=$.extend(true,{},dataset);data=Utils._convertData(data);for(var key in data){if($.inArray(key,excludedData)>-1){continue;}
if($.isPlainObject(this.options[key])){$.extend(this.options[key],data[key]);}else{this.options[key]=data[key];}}
return this;};Options.prototype.get=function(key){return this.options[key];};Options.prototype.set=function(key,val){this.options[key]=val;};return Options;});S2.define('select2/core',['jquery','./options','./utils','./keys'],function($,Options,Utils,KEYS){var Select2=function($element,options){if($element.data('select2')!=null){$element.data('select2').destroy();}
this.$element=$element;this.id=this._generateId($element);options=options||{};this.options=new Options(options,$element);Select2.__super__.constructor.call(this);var tabindex=$element.attr('tabindex')||0;$element.data('old-tabindex',tabindex);$element.attr('tabindex','-1');var DataAdapter=this.options.get('dataAdapter');this.dataAdapter=new DataAdapter($element,this.options);var $container=this.render();this._placeContainer($container);var SelectionAdapter=this.options.get('selectionAdapter');this.selection=new SelectionAdapter($element,this.options);this.$selection=this.selection.render();this.selection.position(this.$selection,$container);var DropdownAdapter=this.options.get('dropdownAdapter');this.dropdown=new DropdownAdapter($element,this.options);this.$dropdown=this.dropdown.render();this.dropdown.position(this.$dropdown,$container);var ResultsAdapter=this.options.get('resultsAdapter');this.results=new ResultsAdapter($element,this.options,this.dataAdapter);this.$results=this.results.render();this.results.position(this.$results,this.$dropdown);var self=this;this._bindAdapters();this._registerDomEvents();this._registerDataEvents();this._registerSelectionEvents();this._registerDropdownEvents();this._registerResultsEvents();this._registerEvents();this.dataAdapter.current(function(initialData){self.trigger('selection:update',{data:initialData});});$element.addClass('select2-hidden-accessible');$element.attr('aria-hidden','true');this._syncAttributes();$element.data('select2',this);};Utils.Extend(Select2,Utils.Observable);Select2.prototype._generateId=function($element){var id='';if($element.attr('id')!=null){id=$element.attr('id');}else if($element.attr('name')!=null){id=$element.attr('name')+'-'+Utils.generateChars(2);}else{id=Utils.generateChars(4);}
id='select2-'+id;return id;};Select2.prototype._placeContainer=function($container){$container.insertAfter(this.$element);var width=this._resolveWidth(this.$element,this.options.get('width'));if(width!=null){$container.css('width',width);}};Select2.prototype._resolveWidth=function($element,method){var WIDTH=/^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;if(method=='resolve'){var styleWidth=this._resolveWidth($element,'style');if(styleWidth!=null){return styleWidth;}
return this._resolveWidth($element,'element');}
if(method=='element'){var elementWidth=$element.outerWidth(false);if(elementWidth<=0){return'auto';}
return elementWidth+'px';}
if(method=='style'){var style=$element.attr('style');if(typeof(style)!=='string'){return null;}
var attrs=style.split(';');for(var i=0,l=attrs.length;i<l;i=i+1){var attr=attrs[i].replace(/\s/g,'');var matches=attr.match(WIDTH);if(matches!==null&&matches.length>=1){return matches[1];}}
return null;}
return method;};Select2.prototype._bindAdapters=function(){this.dataAdapter.bind(this,this.$container);this.selection.bind(this,this.$container);this.dropdown.bind(this,this.$container);this.results.bind(this,this.$container);};Select2.prototype._registerDomEvents=function(){var self=this;this.$element.on('change.select2',function(){self.dataAdapter.current(function(data){self.trigger('selection:update',{data:data});});});this._sync=Utils.bind(this._syncAttributes,this);if(this.$element[0].attachEvent){this.$element[0].attachEvent('onpropertychange',this._sync);}
var observer=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver;if(observer!=null){this._observer=new observer(function(mutations){$.each(mutations,self._sync);});this._observer.observe(this.$element[0],{attributes:true,subtree:false});}else if(this.$element[0].addEventListener){this.$element[0].addEventListener('DOMAttrModified',self._sync,false);}};Select2.prototype._registerDataEvents=function(){var self=this;this.dataAdapter.on('*',function(name,params){self.trigger(name,params);});};Select2.prototype._registerSelectionEvents=function(){var self=this;var nonRelayEvents=['toggle','focus'];this.selection.on('toggle',function(){self.toggleDropdown();});this.selection.on('focus',function(params){self.focus(params);});this.selection.on('*',function(name,params){if($.inArray(name,nonRelayEvents)!==-1){return;}
self.trigger(name,params);});};Select2.prototype._registerDropdownEvents=function(){var self=this;this.dropdown.on('*',function(name,params){self.trigger(name,params);});};Select2.prototype._registerResultsEvents=function(){var self=this;this.results.on('*',function(name,params){self.trigger(name,params);});};Select2.prototype._registerEvents=function(){var self=this;this.on('open',function(){self.$container.addClass('select2-container--open');});this.on('close',function(){self.$container.removeClass('select2-container--open');});this.on('enable',function(){self.$container.removeClass('select2-container--disabled');});this.on('disable',function(){self.$container.addClass('select2-container--disabled');});this.on('blur',function(){self.$container.removeClass('select2-container--focus');});this.on('query',function(params){if(!self.isOpen()){self.trigger('open');}
this.dataAdapter.query(params,function(data){self.trigger('results:all',{data:data,query:params});});});this.on('query:append',function(params){this.dataAdapter.query(params,function(data){self.trigger('results:append',{data:data,query:params});});});this.on('keypress',function(evt){var key=evt.which;if(self.isOpen()){if(key===KEYS.ESC||key===KEYS.TAB||(key===KEYS.UP&&evt.altKey)){self.close();evt.preventDefault();}else if(key===KEYS.ENTER){self.trigger('results:select');evt.preventDefault();}else if((key===KEYS.SPACE&&evt.ctrlKey)){self.trigger('results:toggle');evt.preventDefault();}else if(key===KEYS.UP){self.trigger('results:previous');evt.preventDefault();}else if(key===KEYS.DOWN){self.trigger('results:next');evt.preventDefault();}}else{if(key===KEYS.ENTER||key===KEYS.SPACE||(key===KEYS.DOWN&&evt.altKey)){self.open();evt.preventDefault();}}});};Select2.prototype._syncAttributes=function(){this.options.set('disabled',this.$element.prop('disabled'));if(this.options.get('disabled')){if(this.isOpen()){this.close();}
this.trigger('disable');}else{this.trigger('enable');}};Select2.prototype.trigger=function(name,args){var actualTrigger=Select2.__super__.trigger;var preTriggerMap={'open':'opening','close':'closing','select':'selecting','unselect':'unselecting'};if(name in preTriggerMap){var preTriggerName=preTriggerMap[name];var preTriggerArgs={prevented:false,name:name,args:args};actualTrigger.call(this,preTriggerName,preTriggerArgs);if(preTriggerArgs.prevented){args.prevented=true;return;}}
actualTrigger.call(this,name,args);};Select2.prototype.toggleDropdown=function(){if(this.options.get('disabled')){return;}
if(this.isOpen()){this.close();}else{this.open();}};Select2.prototype.open=function(){if(this.isOpen()){return;}
this.trigger('query',{});this.trigger('open');};Select2.prototype.close=function(){if(!this.isOpen()){return;}
this.trigger('close');};Select2.prototype.isOpen=function(){return this.$container.hasClass('select2-container--open');};Select2.prototype.hasFocus=function(){return this.$container.hasClass('select2-container--focus');};Select2.prototype.focus=function(data){if(this.hasFocus()){return;}
this.$container.addClass('select2-container--focus');this.trigger('focus');};Select2.prototype.enable=function(args){if(this.options.get('debug')&&window.console&&console.warn){console.warn('Select2: The `select2("enable")` method has been deprecated and will'+' be removed in later Select2 versions. Use $element.prop("disabled")'+' instead.');}
if(args==null||args.length===0){args=[true];}
var disabled=!args[0];this.$element.prop('disabled',disabled);};Select2.prototype.data=function(){if(this.options.get('debug')&&arguments.length>0&&window.console&&console.warn){console.warn('Select2: Data can no longer be set using `select2("data")`. You '+'should consider setting the value instead using `$element.val()`.');}
var data=[];this.dataAdapter.current(function(currentData){data=currentData;});return data;};Select2.prototype.val=function(args){if(this.options.get('debug')&&window.console&&console.warn){console.warn('Select2: The `select2("val")` method has been deprecated and will be'+' removed in later Select2 versions. Use $element.val() instead.');}
if(args==null||args.length===0){return this.$element.val();}
var newVal=args[0];if($.isArray(newVal)){newVal=$.map(newVal,function(obj){return obj.toString();});}
this.$element.val(newVal).trigger('change');};Select2.prototype.destroy=function(){this.$container.remove();if(this.$element[0].detachEvent){this.$element[0].detachEvent('onpropertychange',this._sync);}
if(this._observer!=null){this._observer.disconnect();this._observer=null;}else if(this.$element[0].removeEventListener){this.$element[0].removeEventListener('DOMAttrModified',this._sync,false);}
this._sync=null;this.$element.off('.select2');this.$element.attr('tabindex',this.$element.data('old-tabindex'));this.$element.removeClass('select2-hidden-accessible');this.$element.attr('aria-hidden','false');this.$element.removeData('select2');this.dataAdapter.destroy();this.selection.destroy();this.dropdown.destroy();this.results.destroy();this.dataAdapter=null;this.selection=null;this.dropdown=null;this.results=null;};Select2.prototype.render=function(){var $container=$('<span class="select2 select2-container">'+'<span class="selection"></span>'+'<span class="dropdown-wrapper" aria-hidden="true"></span>'+'</span>');$container.attr('dir',this.options.get('dir'));this.$container=$container;this.$container.addClass('select2-container--'+this.options.get('theme'));$container.data('element',this.$element);return $container;};return Select2;});S2.define('select2/compat/utils',['jquery'],function($){function syncCssClasses($dest,$src,adapter){var classes,replacements=[],adapted;classes=$.trim($dest.attr('class'));if(classes){classes=''+classes;$(classes.split(/\s+/)).each(function(){if(this.indexOf('select2-')===0){replacements.push(this);}});}
classes=$.trim($src.attr('class'));if(classes){classes=''+classes;$(classes.split(/\s+/)).each(function(){if(this.indexOf('select2-')!==0){adapted=adapter(this);if(adapted!=null){replacements.push(adapted);}}});}
$dest.attr('class',replacements.join(' '));}
return{syncCssClasses:syncCssClasses};});S2.define('select2/compat/containerCss',['jquery','./utils'],function($,CompatUtils){function _containerAdapter(clazz){return null;}
function ContainerCSS(){}
ContainerCSS.prototype.render=function(decorated){var $container=decorated.call(this);var containerCssClass=this.options.get('containerCssClass')||'';if($.isFunction(containerCssClass)){containerCssClass=containerCssClass(this.$element);}
var containerCssAdapter=this.options.get('adaptContainerCssClass');containerCssAdapter=containerCssAdapter||_containerAdapter;if(containerCssClass.indexOf(':all:')!==-1){containerCssClass=containerCssClass.replace(':all:','');var _cssAdapter=containerCssAdapter;containerCssAdapter=function(clazz){var adapted=_cssAdapter(clazz);if(adapted!=null){return adapted+' '+clazz;}
return clazz;};}
var containerCss=this.options.get('containerCss')||{};if($.isFunction(containerCss)){containerCss=containerCss(this.$element);}
CompatUtils.syncCssClasses($container,this.$element,containerCssAdapter);$container.css(containerCss);$container.addClass(containerCssClass);return $container;};return ContainerCSS;});S2.define('select2/compat/dropdownCss',['jquery','./utils'],function($,CompatUtils){function _dropdownAdapter(clazz){return null;}
function DropdownCSS(){}
DropdownCSS.prototype.render=function(decorated){var $dropdown=decorated.call(this);var dropdownCssClass=this.options.get('dropdownCssClass')||'';if($.isFunction(dropdownCssClass)){dropdownCssClass=dropdownCssClass(this.$element);}
var dropdownCssAdapter=this.options.get('adaptDropdownCssClass');dropdownCssAdapter=dropdownCssAdapter||_dropdownAdapter;if(dropdownCssClass.indexOf(':all:')!==-1){dropdownCssClass=dropdownCssClass.replace(':all:','');var _cssAdapter=dropdownCssAdapter;dropdownCssAdapter=function(clazz){var adapted=_cssAdapter(clazz);if(adapted!=null){return adapted+' '+clazz;}
return clazz;};}
var dropdownCss=this.options.get('dropdownCss')||{};if($.isFunction(dropdownCss)){dropdownCss=dropdownCss(this.$element);}
CompatUtils.syncCssClasses($dropdown,this.$element,dropdownCssAdapter);$dropdown.css(dropdownCss);$dropdown.addClass(dropdownCssClass);return $dropdown;};return DropdownCSS;});S2.define('select2/compat/initSelection',['jquery'],function($){function InitSelection(decorated,$element,options){if(options.get('debug')&&window.console&&console.warn){console.warn('Select2: The `initSelection` option has been deprecated in favor'+' of a custom data adapter that overrides the `current` method. '+'This method is now called multiple times instead of a single '+'time when the instance is initialized. Support will be removed '+'for the `initSelection` option in future versions of Select2');}
this.initSelection=options.get('initSelection');this._isInitialized=false;decorated.call(this,$element,options);}
InitSelection.prototype.current=function(decorated,callback){var self=this;if(this._isInitialized){decorated.call(this,callback);return;}
this.initSelection.call(null,this.$element,function(data){self._isInitialized=true;if(!$.isArray(data)){data=[data];}
callback(data);});};return InitSelection;});S2.define('select2/compat/inputData',['jquery'],function($){function InputData(decorated,$element,options){this._currentData=[];this._valueSeparator=options.get('valueSeparator')||',';if($element.prop('type')==='hidden'){if(options.get('debug')&&console&&console.warn){console.warn('Select2: Using a hidden input with Select2 is no longer '+'supported and may stop working in the future. It is recommended '+'to use a `<select>` element instead.');}}
decorated.call(this,$element,options);}
InputData.prototype.current=function(_,callback){function getSelected(data,selectedIds){var selected=[];if(data.selected||$.inArray(data.id,selectedIds)!==-1){data.selected=true;selected.push(data);}else{data.selected=false;}
if(data.children){selected.push.apply(selected,getSelected(data.children,selectedIds));}
return selected;}
var selected=[];for(var d=0;d<this._currentData.length;d++){var data=this._currentData[d];selected.push.apply(selected,getSelected(data,this.$element.val().split(this._valueSeparator)));}
callback(selected);};InputData.prototype.select=function(_,data){if(!this.options.get('multiple')){this.current(function(allData){$.map(allData,function(data){data.selected=false;});});this.$element.val(data.id);this.$element.trigger('change');}else{var value=this.$element.val();value+=this._valueSeparator+data.id;this.$element.val(value);this.$element.trigger('change');}};InputData.prototype.unselect=function(_,data){var self=this;data.selected=false;this.current(function(allData){var values=[];for(var d=0;d<allData.length;d++){var item=allData[d];if(data.id==item.id){continue;}
values.push(item.id);}
self.$element.val(values.join(self._valueSeparator));self.$element.trigger('change');});};InputData.prototype.query=function(_,params,callback){var results=[];for(var d=0;d<this._currentData.length;d++){var data=this._currentData[d];var matches=this.matches(params,data);if(matches!==null){results.push(matches);}}
callback({results:results});};InputData.prototype.addOptions=function(_,$options){var options=$.map($options,function($option){return $.data($option[0],'data');});this._currentData.push.apply(this._currentData,options);};return InputData;});S2.define('select2/compat/matcher',['jquery'],function($){function oldMatcher(matcher){function wrappedMatcher(params,data){var match=$.extend(true,{},data);if(params.term==null||$.trim(params.term)===''){return match;}
if(data.children){for(var c=data.children.length-1;c>=0;c--){var child=data.children[c];var doesMatch=matcher(params.term,child.text,child);if(!doesMatch){match.children.splice(c,1);}}
if(match.children.length>0){return match;}}
if(matcher(params.term,data.text,data)){return match;}
return null;}
return wrappedMatcher;}
return oldMatcher;});S2.define('select2/compat/query',[],function(){function Query(decorated,$element,options){if(options.get('debug')&&window.console&&console.warn){console.warn('Select2: The `query` option has been deprecated in favor of a '+'custom data adapter that overrides the `query` method. Support '+'will be removed for the `query` option in future versions of '+'Select2.');}
decorated.call(this,$element,options);}
Query.prototype.query=function(_,params,callback){params.callback=callback;var query=this.options.get('query');query.call(null,params);};return Query;});S2.define('select2/dropdown/attachContainer',[],function(){function AttachContainer(decorated,$element,options){decorated.call(this,$element,options);}
AttachContainer.prototype.position=function(decorated,$dropdown,$container){var $dropdownContainer=$container.find('.dropdown-wrapper');$dropdownContainer.append($dropdown);$dropdown.addClass('select2-dropdown--below');$container.addClass('select2-container--below');};return AttachContainer;});S2.define('select2/dropdown/stopPropagation',[],function(){function StopPropagation(){}
StopPropagation.prototype.bind=function(decorated,container,$container){decorated.call(this,container,$container);var stoppedEvents=['blur','change','click','dblclick','focus','focusin','focusout','input','keydown','keyup','keypress','mousedown','mouseenter','mouseleave','mousemove','mouseover','mouseup','search','touchend','touchstart'];this.$dropdown.on(stoppedEvents.join(' '),function(evt){evt.stopPropagation();});};return StopPropagation;});S2.define('select2/selection/stopPropagation',[],function(){function StopPropagation(){}
StopPropagation.prototype.bind=function(decorated,container,$container){decorated.call(this,container,$container);var stoppedEvents=['blur','change','click','dblclick','focus','focusin','focusout','input','keydown','keyup','keypress','mousedown','mouseenter','mouseleave','mousemove','mouseover','mouseup','search','touchend','touchstart'];this.$selection.on(stoppedEvents.join(' '),function(evt){evt.stopPropagation();});};return StopPropagation;});S2.define('jquery.select2',['jquery','require','./select2/core','./select2/defaults'],function($,require,Select2,Defaults){require('jquery.mousewheel');if($.fn.select2==null){var thisMethods=['open','close','destroy'];$.fn.select2=function(options){options=options||{};if(typeof options==='object'){this.each(function(){var instanceOptions=$.extend({},options,true);var instance=new Select2($(this),instanceOptions);});return this;}else if(typeof options==='string'){var instance=this.data('select2');if(instance==null&&window.console&&console.error){console.error('The select2(\''+options+'\') method was called on an '+'element that is not using Select2.');}
var args=Array.prototype.slice.call(arguments,1);var ret=instance[options](args);if($.inArray(options,thisMethods)>-1){return this;}
return ret;}else{throw new Error('Invalid arguments for Select2: '+options);}};}
if($.fn.select2.defaults==null){$.fn.select2.defaults=Defaults;}
return Select2;});(function(factory){if(typeof S2.define==='function'&&S2.define.amd){S2.define('jquery.mousewheel',['jquery'],factory);}else if(typeof exports==='object'){module.exports=factory;}else{factory(jQuery);}}(function($){var toFix=['wheel','mousewheel','DOMMouseScroll','MozMousePixelScroll'],toBind=('onwheel'in document||document.documentMode>=9)?['wheel']:['mousewheel','DomMouseScroll','MozMousePixelScroll'],slice=Array.prototype.slice,nullLowestDeltaTimeout,lowestDelta;if($.event.fixHooks){for(var i=toFix.length;i;){$.event.fixHooks[toFix[--i]]=$.event.mouseHooks;}}
var special=$.event.special.mousewheel={version:'3.1.12',setup:function(){if(this.addEventListener){for(var i=toBind.length;i;){this.addEventListener(toBind[--i],handler,false);}}else{this.onmousewheel=handler;}
$.data(this,'mousewheel-line-height',special.getLineHeight(this));$.data(this,'mousewheel-page-height',special.getPageHeight(this));},teardown:function(){if(this.removeEventListener){for(var i=toBind.length;i;){this.removeEventListener(toBind[--i],handler,false);}}else{this.onmousewheel=null;}
$.removeData(this,'mousewheel-line-height');$.removeData(this,'mousewheel-page-height');},getLineHeight:function(elem){var $elem=$(elem),$parent=$elem['offsetParent'in $.fn?'offsetParent':'parent']();if(!$parent.length){$parent=$('body');}
return parseInt($parent.css('fontSize'),10)||parseInt($elem.css('fontSize'),10)||16;},getPageHeight:function(elem){return $(elem).height();},settings:{adjustOldDeltas:true,normalizeOffset:true}};$.fn.extend({mousewheel:function(fn){return fn?this.bind('mousewheel',fn):this.trigger('mousewheel');},unmousewheel:function(fn){return this.unbind('mousewheel',fn);}});function handler(event){var orgEvent=event||window.event,args=slice.call(arguments,1),delta=0,deltaX=0,deltaY=0,absDelta=0,offsetX=0,offsetY=0;event=$.event.fix(orgEvent);event.type='mousewheel';if('detail'in orgEvent){deltaY=orgEvent.detail*-1;}
if('wheelDelta'in orgEvent){deltaY=orgEvent.wheelDelta;}
if('wheelDeltaY'in orgEvent){deltaY=orgEvent.wheelDeltaY;}
if('wheelDeltaX'in orgEvent){deltaX=orgEvent.wheelDeltaX*-1;}
if('axis'in orgEvent&&orgEvent.axis===orgEvent.HORIZONTAL_AXIS){deltaX=deltaY*-1;deltaY=0;}
delta=deltaY===0?deltaX:deltaY;if('deltaY'in orgEvent){deltaY=orgEvent.deltaY*-1;delta=deltaY;}
if('deltaX'in orgEvent){deltaX=orgEvent.deltaX;if(deltaY===0){delta=deltaX*-1;}}
if(deltaY===0&&deltaX===0){return;}
if(orgEvent.deltaMode===1){var lineHeight=$.data(this,'mousewheel-line-height');delta*=lineHeight;deltaY*=lineHeight;deltaX*=lineHeight;}else if(orgEvent.deltaMode===2){var pageHeight=$.data(this,'mousewheel-page-height');delta*=pageHeight;deltaY*=pageHeight;deltaX*=pageHeight;}
absDelta=Math.max(Math.abs(deltaY),Math.abs(deltaX));if(!lowestDelta||absDelta<lowestDelta){lowestDelta=absDelta;if(shouldAdjustOldDeltas(orgEvent,absDelta)){lowestDelta/=40;}}
if(shouldAdjustOldDeltas(orgEvent,absDelta)){delta/=40;deltaX/=40;deltaY/=40;}
delta=Math[delta>=1?'floor':'ceil'](delta/lowestDelta);deltaX=Math[deltaX>=1?'floor':'ceil'](deltaX/lowestDelta);deltaY=Math[deltaY>=1?'floor':'ceil'](deltaY/lowestDelta);if(special.settings.normalizeOffset&&this.getBoundingClientRect){var boundingRect=this.getBoundingClientRect();offsetX=event.clientX-boundingRect.left;offsetY=event.clientY-boundingRect.top;}
event.deltaX=deltaX;event.deltaY=deltaY;event.deltaFactor=lowestDelta;event.offsetX=offsetX;event.offsetY=offsetY;event.deltaMode=0;args.unshift(event,delta,deltaX,deltaY);if(nullLowestDeltaTimeout){clearTimeout(nullLowestDeltaTimeout);}
nullLowestDeltaTimeout=setTimeout(nullLowestDelta,200);return($.event.dispatch||$.event.handle).apply(this,args);}
function nullLowestDelta(){lowestDelta=null;}
function shouldAdjustOldDeltas(orgEvent,absDelta){return special.settings.adjustOldDeltas&&orgEvent.type==='mousewheel'&&absDelta%120===0;}}));return{define:S2.define,require:S2.require};}());var select2=S2.require('jquery.select2');jQuery.fn.select2.amd=S2;return select2;}));(function($){$(document).render(function(){if(Modernizr.touch)
return
var formatSelectOption=function(state){if(!state.id)
return state.text;var $option=$(state.element),iconClass=$option.data('icon'),imageSrc=$option.data('image')
if(iconClass)
return'<i class="select-icon '+iconClass+'"></i> '+state.text
if(imageSrc)
return'<img class="select-image" src="'+imageSrc+'" alt="" /> '+state.text
return state.text}
var selectOptions={templateResult:formatSelectOption,templateSelection:formatSelectOption,escapeMarkup:function(m){return m},width:'style'}
$('select.custom-select').each(function(){var $element=$(this),extraOptions={}
if($element.data('select2')!=null){return true;}
$element.attr('data-disposable','data-disposable')
$element.one('dispose-control',function(){if($element.data('select2')){$element.select2('destroy')}})
if($element.hasClass('select-no-search')){extraOptions.minimumResultsForSearch=Infinity}
$element.select2($.extend({},selectOptions,extraOptions))})})
$(document).on('disable','select.custom-select',function(event,status){$(this).select2('enable',!status)})
$(document).on('focus','select.custom-select',function(event){setTimeout($.proxy(function(){$(this).select2('focus')},this),10)})})(jQuery);+function($){"use strict";var Base=$.oc.foundation.base,BaseProto=Base.prototype
if($.oc===undefined)
$.oc={}
$.oc.inspector={editors:{},propertyCounter:0}
var Inspector=function(element,options){this.options=options
this.$el=$(element)
this.title=false
this.description=false
Base.call(this)}
Inspector.prototype=Object.create(BaseProto)
Inspector.prototype.constructor=Inspector
Inspector.prototype.loadConfiguration=function(onSuccess){var configString=this.$el.data('inspector-config')
if(configString!==undefined){this.parseConfiguration(configString)
if(onSuccess!==undefined)
onSuccess();}else{var $form=$(this.selector).closest('form'),data=this.$el.data(),self=this
$.oc.stripeLoadIndicator.show()
var request=$form.request('onGetInspectorConfiguration',{data:data}).done(function(data){self.parseConfiguration(data.configuration.properties)
if(data.configuration.title!==undefined)
self.title=data.configuration.title
if(data.configuration.description!==undefined)
self.description=data.configuration.description
$.oc.stripeLoadIndicator.hide()
if(onSuccess!==undefined)
onSuccess();}).always(function(){$.oc.stripeLoadIndicator.hide()})}}
Inspector.prototype.parseConfiguration=function(jsonString){if(jsonString===undefined)
throw new Error('The Inspector cannot be initialized because the Inspector configuration '+'attribute is not defined on the inspectable element.');if(!$.isArray(jsonString)&&!$.isPlainObject(jsonString)){try{this.config=$.parseJSON(jsonString)}catch(err){throw new Error('Error parsing the Inspector field configuration. '+err)}}else
this.config=jsonString
this.propertyValuesField=$('input[data-inspector-values]',this.$el)}
Inspector.prototype.getPopoverTemplate=function(){return'                                                                                                      \
                <div class="popover-head">                                                                            \
                    <h3>{{title}}</h3>                                                                                \
                    {{#description}}                                                                                  \
                        <p>{{description}}</p>                                                                        \
                    {{/description}}                                                                                  \
                    <button type="button" class="close"                                                               \
                        data-dismiss="popover"                                                                        \
                        aria-hidden="true">&times;</button>                                                           \
                </div>                                                                                                \
                <form autocomplete="off" onsubmit="return false">                                                     \
                    <table class="inspector-fields {{#tableClass}}{{/tableClass}}">                                   \
                        {{#properties}}                                                                               \
                            <tr id="{{#propFormat}}{{property}}{{/propFormat}}" data-property="{{property}}"          \
                                {{#dataGroupIndex}}{{/dataGroupIndex}}                                                \
                                class="{{#cellClass}}{{/cellClass}}">                                                 \
                                <th {{#colspan}}{{/colspan}}><div><div><span class="title-element" title="{{title}}"> \
                                {{#expandControl}}{{/expandControl}}                                                  \
                                {{title}}</span>                                                                      \
                                {{#info}}{{/info}}                                                                    \
                                </div></div></th>                                                                     \
                                {{#editor}}{{/editor}}                                                                \
                            </tr>                                                                                     \
                        {{/properties}}                                                                               \
                    </table>                                                                                          \
                <form>                                                                                                \
            '}
Inspector.prototype.init=function(){if(!this.config||this.config.length==0)
return
this.editors=[]
this.initProperties()
this.$el.data('oc.inspectorVisible',true)
var e=$.Event('showing.oc.inspector')
this.$el.trigger(e,[{callback:this.proxy(this.displayPopover)}])
if(e.isDefaultPrevented())
return
if(!e.isPropagationStopped())
this.displayPopover()}
Inspector.prototype.displayPopover=function(){var fieldsConfig=this.preprocessConfig(),renderEditorBound=this.proxy(this.renderEditor),groupExpandedBound=this.proxy(this.groupExpanded),data={title:this.title?this.title:this.$el.data('inspector-title'),description:this.description?this.description:this.$el.data('inspector-description'),properties:fieldsConfig.properties,editor:function(){return function(text,render){if(this.itemType=='property')
return renderEditorBound(this,render)}},info:function(){return function(text,render){if(this.description!==undefined&&this.description!=null)
return render('<span title="{{description}}" class="info oc-icon-info with-tooltip"></span>',this)}},propFormat:function(){return function(text,render){return'prop-'+render(text).replace('.','-')}},colspan:function(){return function(text,render){return this.itemType=='group'?'colspan="2"':null}},tableClass:function(){return function(text,render){return fieldsConfig.hasGroups?'has-groups':null}},cellClass:function(){return function(text,render){var result=this.itemType+((this.itemType=='property'&&this.groupIndex!==undefined)?' grouped':'')
if(this.itemType=='property'&&this.groupIndex!==undefined)
result+=groupExpandedBound(this.group)?' expanded':' collapsed'
if(this.itemType=='property'&&!this.showExternalParam)
result+=' no-external-parameter'
return result}},expandControl:function(){return function(text,render){if(this.itemType=='group'){this.itemStatus=groupExpandedBound(this.title)?'expanded':''
return render('<a class="expandControl {{itemStatus}}" href="javascript:;" data-group-index="{{groupIndex}}"><span>Expand/collapse</span></a>',this)}}},dataGroupIndex:function(){return function(text,render){return this.groupIndex!==undefined&&this.itemType=='property'?render('data-group-index={{groupIndex}}',this):''}}}
var offset=this.$el.data('inspector-offset')
if(offset===undefined)
offset=15
var offsetX=this.$el.data('inspector-offset-x'),offsetY=this.$el.data('inspector-offset-y')
var placement=this.$el.data('inspector-placement')
if(placement===undefined)
placement='bottom'
var fallbackPlacement=this.$el.data('inspector-fallback-placement')
if(fallbackPlacement===undefined)
fallbackPlacement='bottom'
this.$el.ocPopover({content:Mustache.render(this.getPopoverTemplate(),data),highlightModalTarget:true,modal:true,placement:placement,fallbackPlacement:fallbackPlacement,containerClass:'control-inspector',container:this.$el.data('inspector-container'),offset:offset,offsetX:offsetX,offsetY:offsetY,width:400})
this.$el.on('hiding.oc.popover',this.proxy(this.onBeforeHide))
this.$el.on('hide.oc.popover',this.proxy(this.cleanup))
this.$el.addClass('inspector-open')
$(this.$el.data('oc.popover').$container).on('keydown',this.proxy(this.onPopoverKeyDown))
if(this.editors.length>0){if(this.editors[0].focus!==undefined)
this.editors[0].focus()}
if(this.$el.closest('[data-inspector-external-parameters]').length>0)
this.initExternalParameterEditor(this.$el.data('oc.popover').$container)
for(var i=0,len=this.editors.length;i<len;i++){if(this.editors[i].init!==undefined)
this.editors[i].init()}
$('.with-tooltip',this.$el.data('oc.popover').$container).tooltip({placement:'auto right',container:'body',delay:500})
var $container=this.$el.data('oc.popover').$container
$container.on('click','tr.group',this.proxy(this.onGroupClick))
var cssClass=this.options.inspectorCssClass
if(cssClass!==undefined)
$container.addClass(cssClass)}
Inspector.prototype.onPopoverKeyDown=function(ev){if(ev.keyCode==13)
$(ev.currentTarget).trigger('close.oc.popover')}
Inspector.prototype.onGroupClick=function(ev){var $container=this.$el.data('oc.popover').$container
this.toggleGroup($('a.expandControl',ev.target),$container)
return false}
Inspector.prototype.initExternalParameterEditor=function($container){var self=this
$('table.inspector-fields tr',$container).each(function(){if(!$(this).hasClass('no-external-parameter')){var property=$(this).data('property'),$td=$('td',this),$editorContainer=$('<div class="external-param-editor-container"></div>'),$editor=$('<div class="external-editor">                  \
                            <div class="controls">                      \
                                <input type="text" tabindex="-1"/>      \
                                <a href="#" tabindex="-1">              \
                                    <i class="oc-icon-terminal"></i>    \
                                </a>                                    \
                            </div>                                      \
                        </div>')
$editorContainer.append($td.children())
$editorContainer.append($editor)
$td.append($editorContainer)
var $editorLink=$('a',$editor)
$editorLink.click(function(){return self.toggleExternalParameterEditor($(this))}).attr('title','Click to enter the external parameter name to load the property value from').tooltip({'container':'body',delay:500})
var $input=$editor.find('input'),propertyValue=self.propertyValues[property]
$input.on('focus',function(){var $field=$(this)
$('td',$field.closest('table')).removeClass('active')
$field.closest('td').addClass('active')})
$input.on('change',function(){self.markPropertyChanged(property,true)})
var matches=[]
if(propertyValue){if(matches=propertyValue.match(/^\{\{([^\}]+)\}\}$/)){var value=$.trim(matches[1])
if(value.length>0){self.showExternalParameterEditor($editorContainer,$editor,$editorLink,$td,true)
$editor.find('input').val(value)
self.writeProperty(property,null,true)}}}}})}
Inspector.prototype.showExternalParameterEditor=function($container,$editor,$editorLink,$cell,noAnimation){var position=$editor.position()
$('input',$editor).focus()
if(!noAnimation){$editor.css({'left':position.left+'px','right':0})}else{$editor.css('right',0)}
setTimeout(function(){$editor.css('left',0)
$cell.scrollTop(0)},0)
$container.addClass('editor-visible')
$editorLink.attr('data-original-title','Click to enter the property value')
this.toggleCellEditorVisibility($cell,false)
$editor.find('input').attr('tabindex',0)}
Inspector.prototype.toggleExternalParameterEditor=function($editorLink){var $container=$editorLink.closest('.external-param-editor-container'),$editor=$('.external-editor',$container),$cell=$editorLink.closest('td'),self=this
$editorLink.tooltip('hide')
if(!$container.hasClass('editor-visible')){self.showExternalParameterEditor($container,$editor,$editorLink,$cell)}else{var left=$container.width()
$editor.css('left',left+'px')
setTimeout(function(){$editor.css({'left':'auto','right':'30px'})
$container.removeClass('editor-visible')
$container.closest('td').removeClass('active')
var property=$container.closest('tr').data('property'),propertyEditor=self.findEditor(property)
if(propertyEditor&&propertyEditor.onHideExternalParameterEditor!==undefined)
propertyEditor.onHideExternalParameterEditor()},200)
$editorLink.attr('data-original-title','Click to enter the external parameter name to load the property value from')
$editor.find('input').attr('tabindex',-1)
self.toggleCellEditorVisibility($cell,true)}
return false}
Inspector.prototype.toggleCellEditorVisibility=function($cell,show){var $container=$('.external-param-editor-container',$cell)
$container.children().each(function(){var $el=$(this)
if($el.hasClass('external-editor'))
return
if(show)
$el.removeClass('hide')
else{var height=$cell.data('inspector-cell-height')
if(!height){height=$cell.height()
$cell.data('inspector-cell-height',height)}
$container.css('height',height+'px')
$el.addClass('hide')}})}
Inspector.prototype.preprocessConfig=function(){var fields=[],result={hasGroups:false,properties:[]},groupIndex=0
function findGroup(title){var groups=$.grep(fields,function(item){return item.itemType!==undefined&&item.itemType=='group'&&item.title==title})
if(groups.length>0)
return groups[0]
return null}
$.each(this.config,function(){this.itemType='property'
if(this.group===undefined)
fields.push(this)
else{var group=findGroup(this.group)
if(!group){group={itemType:'group',title:this.group,properties:[],groupIndex:groupIndex}
groupIndex++
fields.push(group)}
this.groupIndex=group.groupIndex
group.properties.push(this)}})
$.each(fields,function(){result.properties.push(this)
if(this.itemType=='group'){result.hasGroups=true
$.each(this.properties,function(){result.properties.push(this)})
delete this.properties}})
return result}
Inspector.prototype.toggleGroup=function(link,$container){var $link=$(link),groupIndex=$link.data('group-index'),propertyRows=$('tr[data-group-index='+groupIndex+']',$container),duration=Math.round(100/propertyRows.length),collapse=true,statuses=this.loadGroupExpandedStatuses(),title=$('span.title-element',$link.closest('tr')).attr('title')
if($link.hasClass('expanded')){$link.removeClass('expanded')
statuses[title]=false}else{$link.addClass('expanded')
collapse=false
statuses[title]=true}
propertyRows.each(function(index){var self=$(this)
setTimeout(function(){self.toggleClass('collapsed',collapse)
self.toggleClass('expanded',!collapse)},index*duration)})
this.writeGroupExpandedStatuses(statuses)}
Inspector.prototype.loadGroupExpandedStatuses=function(){var statuses=this.$el.data('inspector-group-statuses')
return statuses!==undefined?JSON.parse(statuses):{}}
Inspector.prototype.writeGroupExpandedStatuses=function(statuses){this.$el.data('inspector-group-statuses',JSON.stringify(statuses))}
Inspector.prototype.groupExpanded=function(title){var statuses=this.loadGroupExpandedStatuses()
if(statuses[title]!==undefined)
return statuses[title]
return false}
Inspector.prototype.normalizePropertyCode=function(code){var lowerCaseCode=code.toLowerCase()
for(var index in this.config){var propertyInfo=this.config[index]
if(propertyInfo.property.toLowerCase()==lowerCaseCode)
return propertyInfo.property}
return code}
Inspector.prototype.initProperties=function(){if(!this.propertyValuesField.length){var properties={},attributes=this.$el.get(0).attributes
for(var i=0,len=attributes.length;i<len;i++){var attribute=attributes[i],matches=[]
if(matches=attribute.name.match(/^data-property-(.*)$/)){properties[this.normalizePropertyCode(matches[1])]=attribute.value}}
this.propertyValues=properties}else{var propertyValuesStr=$.trim(this.propertyValuesField.val())
this.propertyValues=propertyValuesStr.length===0?{}:$.parseJSON(propertyValuesStr)}
try{this.originalPropertyValues=$.extend(true,{},this.propertyValues)}catch(err){throw new Error('Error parsing the Inspector property values string. '+err)}}
Inspector.prototype.readProperty=function(property,returnUndefined){if(this.propertyValues[property]!==undefined)
return this.propertyValues[property]
return returnUndefined?undefined:null}
Inspector.prototype.getDefaultValue=function(property){for(var index in this.config){var propertyInfo=this.config[index]
if(propertyInfo.itemType!=='property')
continue
if(propertyInfo.property==property)
return propertyInfo.default}
return undefined}
Inspector.prototype.writeProperty=function(property,value,noChangedStatusUpdate){this.propertyValues[property]=value
if(this.propertyValuesField.length)
this.propertyValuesField.val(JSON.stringify(this.propertyValues))
else{var self=this
$.each(this.propertyValues,function(propertyName){self.$el.attr('data-property-'+propertyName,this)})}
if(this.originalPropertyValues[property]===undefined||this.originalPropertyValues[property]!=value){if(!noChangedStatusUpdate){this.$el.trigger('change')
this.markPropertyChanged(property,true)}}else{if(!noChangedStatusUpdate)
this.markPropertyChanged(property,false)}
if(!noChangedStatusUpdate)
this.$el.trigger('propertyChanged.oc.Inspector',[property])
return value}
Inspector.prototype.markPropertyChanged=function(property,changed){$('#prop-'+property.replace('.','-'),this.$el.data('oc.popover').$container).toggleClass('changed',changed)}
Inspector.prototype.renderEditor=function(data,render){$.oc.inspector.propertyCounter++
var editorClass='inspectorEditor'
+data.type.charAt(0).toUpperCase()
+data.type.slice(1),editorId='inspector-property-'+data.type+$.oc.inspector.propertyCounter
if($.oc.inspector.editors[editorClass]===undefined)
throw new Error('The Inspector editor class "'+editorClass+'" is not defined in the $.oc.inspector.editors namespace.')
var editor=new $.oc.inspector.editors[editorClass](editorId,this,data)
this.editors.push(editor)
editor.inspectorCellId=editorId
return editor.renderEditor()}
Inspector.prototype.cleanup=function(){this.$el.off('hiding.oc.popover')
this.$el.off('hide.oc.popover')
this.$el.off('.oc.Inspector')
this.$el.removeClass('inspector-open')
var e=$.Event('hidden.oc.inspector')
this.$el.trigger(e)
this.$el.data('oc.inspectorVisible',false)
this.dispose()}
Inspector.prototype.dispose=function(){var $popoverContainer=$(this.$el.data('oc.popover').$container)
$popoverContainer.off('keydown',this.proxy(this.onPopoverKeyDown))
$('.with-tooltip',$popoverContainer).tooltip('destroy')
this.$el.removeData('oc.inspector')
this.editors=null
this.options=null
this.$el=null
BaseProto.dispose.call(this)}
Inspector.prototype.onBeforeHide=function(e){var $container=this.$el.data('inspector-container'),externalParamErrorFound=false,self=this
$.each(this.editors,function(){if(!self.editorExternalPropertyEnabled(this))
this.applyValue()
else{var $cell=$('#'+this.inspectorCellId,$container),$extPropEditorContainer=$cell.find('.external-param-editor-container'),$input=$extPropEditorContainer.find('.external-editor input'),val=$.trim($input.val())
if(val.length==0){alert('Please enter external parameter name for the '+this.fieldDef.title+' property.')
externalParamErrorFound=true
setTimeout(function(){$input.focus()},0)
return false}
self.writeProperty(this.fieldDef.property,'{{ '+val+' }}')}})
if(externalParamErrorFound){e.preventDefault()
return false}
var eH=$.Event('hiding.oc.inspector'),inspector=this
this.$el.trigger(eH,[{values:this.propertyValues}])
if(eH.isDefaultPrevented()){e.preventDefault()
return false}
$.each(this.editors,function(){if(inspector.editorExternalPropertyEnabled(this))
return true
if(this.validate===undefined)
return true
var validationError=this.validate()
if(!validationError)
return true
alert(validationError)
e.preventDefault()
var self=this
setTimeout(function(){self.focus()},0)
return false})
$('.with-tooltip',this.$el.data('oc.popover').$container).tooltip('hide')
if(!e.isDefaultPrevented()){for(var i=0,len=this.editors.length;i<len;i++){this.editors[i].dispose()
this.editors[i]=null}}}
Inspector.prototype.editorExternalPropertyEnabled=function(editor){var $container=this.$el.data('inspector-container'),$cell=$('#'+editor.inspectorCellId,$container),$extPropEditorContainer=$cell.find('.external-param-editor-container')
return $extPropEditorContainer.hasClass('editor-visible')}
Inspector.prototype.findEditor=function(property){var count=this.editors.length
for(var i=0;i<count;i++){if(this.editors[i].fieldDef.property==property)
return this.editors[i]}
return null}
var InspectorEditorString=function(editorId,inspector,fieldDef){this.inspector=inspector
this.fieldDef=fieldDef
this.editorId=editorId
this.selector='#'+this.editorId+' input.string-editor'
Base.call(this)
$(document).on('focus',this.selector,this.proxy(this.onFocus))
$(document).on('change',this.selector,this.proxy(this.applyValue))}
InspectorEditorString.prototype=Object.create(BaseProto)
InspectorEditorString.prototype.constructor=InspectorEditorString
InspectorEditorString.prototype.init=function(){var value=this.inspector.readProperty(this.fieldDef.property,true)
if(value===undefined)
value=this.inspector.getDefaultValue(this.fieldDef.property)
$(this.selector).val($.trim(value))}
InspectorEditorString.prototype.dispose=function(){$(document).off('change',this.selector,this.proxy(this.applyValue))
$(document).off('focus',this.selector,this.proxy(this.onFocus))
this.inspector=null
this.fieldDef=null
this.editorId=null
this.selector=null
BaseProto.dispose.call(this)}
InspectorEditorString.prototype.onFocus=function(ev){var $field=$(ev.currentTarget)
$('td',$field.closest('table')).removeClass('active')
$field.closest('td').addClass('active')}
InspectorEditorString.prototype.applyValue=function(){this.inspector.writeProperty(this.fieldDef.property,$.trim($(this.selector).val()))}
InspectorEditorString.prototype.renderEditor=function(){var data={id:this.editorId,placeholder:this.fieldDef.placeholder!==undefined?this.fieldDef.placeholder:''}
return Mustache.render('<td class="text" id="{{id}}"><input type="text" class="string-editor" placeholder="{{placeholder}}"/></td>',data)}
InspectorEditorString.prototype.validate=function(){var val=$.trim($(this.selector).val())
if(this.fieldDef.required&&val.length===0)
return this.fieldDef.validationMessage||'Required fields were left blank.'
if(this.fieldDef.validationPattern===undefined)
return
var re=new RegExp(this.fieldDef.validationPattern,'m')
if(!val.match(re))
return this.fieldDef.validationMessage}
InspectorEditorString.prototype.focus=function(){$(this.selector).focus()
$(this.selector).closest('td').scrollLeft(0)}
$.oc.inspector.editors.inspectorEditorString=InspectorEditorString;var InspectorEditorCheckbox=function(editorId,inspector,fieldDef){this.inspector=inspector
this.fieldDef=fieldDef
this.editorId=editorId
this.selector='#'+this.editorId+' input'
Base.call(this)
$(document).on('change',this.selector,this.proxy(this.applyValue))}
InspectorEditorCheckbox.prototype=Object.create(BaseProto)
InspectorEditorCheckbox.prototype.constructor=InspectorEditorCheckbox
InspectorEditorCheckbox.prototype.dispose=function(){$(document).off('change',this.selector,this.proxy(this.applyValue))
this.inspector=null
this.fieldDef=null
this.editorId=null
this.selector=null
BaseProto.dispose.call(this)}
InspectorEditorCheckbox.prototype.applyValue=function(){this.inspector.writeProperty(this.fieldDef.property,$(this.selector).get(0).checked?1:0)}
InspectorEditorCheckbox.prototype.renderEditor=function(){var self=this,data={id:this.editorId,cbId:this.editorId+'-cb',title:this.fieldDef.title}
return Mustache.render(this.getTemplate(),data)}
InspectorEditorCheckbox.prototype.init=function(){var isChecked=this.inspector.readProperty(this.fieldDef.property,true)
if(isChecked===undefined){if(this.fieldDef.default!==undefined){isChecked=this.normalizeCheckedValue(this.fieldDef.default)}}else{isChecked=this.normalizeCheckedValue(isChecked)}
$(this.selector).prop('checked',isChecked)}
InspectorEditorCheckbox.prototype.normalizeCheckedValue=function(value){if(value=='0'||value=='false')
return false
return value}
InspectorEditorCheckbox.prototype.focus=function(){$(this.selector).closest('div').focus()}
InspectorEditorCheckbox.prototype.getTemplate=function(){return'                                              \
            <td id="{{id}}">                                  \
                <div tabindex="0" class="checkbox             \
                    custom-checkbox nolabel">                 \
                    <input type="checkbox"                    \
                        value="1"                             \
                        id="{{cbId}}"/>                       \
                    <label for="{{cbId}}">{{title}}</label>   \
                </div>                                        \
            </td>                                             \
        ';}
$.oc.inspector.editors.inspectorEditorCheckbox=InspectorEditorCheckbox;var InspectorEditorDropdown=function(editorId,inspector,fieldDef){this.inspector=inspector
this.fieldDef=fieldDef
this.editorId=editorId
this.selector='#'+this.editorId+' select'
this.dynamicOptions=this.fieldDef.options?false:true
this.initialization=false
Base.call(this)
$(document).on('change',this.selector,this.proxy(this.applyValue))}
InspectorEditorDropdown.prototype=Object.create(BaseProto)
InspectorEditorDropdown.prototype.constructor=InspectorEditorDropdown
InspectorEditorDropdown.prototype.dispose=function(){$(document).off('change',this.selector,this.proxy(this.applyValue))
var $element=$(this.selector)
if($element.data('select2')!=null){$element.select2('close')
$element.select2('destroy')}
this.inspector=null
this.fieldDef=null
this.editorId=null
this.selector=null
BaseProto.dispose.call(this)}
InspectorEditorDropdown.prototype.applyValue=function(){this.inspector.writeProperty(this.fieldDef.property,$(this.selector).val(),this.initialization)}
InspectorEditorDropdown.prototype.renderEditor=function(){var
self=this,data={id:this.editorId,value:$.trim(this.inspector.readProperty(this.fieldDef.property)),selectId:this.editorId+'-select',defaultOption:function(){return function(text,render){if(self.fieldDef.placeholder==undefined)
return''
if(!Modernizr.touch)
return'<option></option>'}}}
if(this.fieldDef.options){var options=[]
if(this.fieldDef.placeholder!==undefined&&Modernizr.touch)
options.push({value:null,title:this.fieldDef.placeholder})
$.each(this.fieldDef.options,function(value,title){options.push({value:value,title:title})})
data.options=options}
return Mustache.render(this.getTemplate(),data)}
InspectorEditorDropdown.prototype.getTemplate=function(){return'                                                    \
            <td id="{{id}}" class="dropdown">                       \
                <select id="{{selectId}}" class="custom-select">    \
                    {{#defaultOption}}{{/defaultOption}}            \
                    {{#options}}                                    \
                        <option value="{{value}}">                  \
                            {{title}}                               \
                        </option>                                   \
                    {{/options}}                                    \
                </select>                                           \
            </td>                                                   \
        ';}
InspectorEditorDropdown.prototype.init=function(){var value=this.inspector.readProperty(this.fieldDef.property,true)
if(value===undefined)
value=this.inspector.getDefaultValue(this.fieldDef.property)
$(this.selector).val(value)
if(!Modernizr.touch){var options={dropdownCssClass:'ocInspectorDropdown'}
if(this.fieldDef.placeholder!==undefined)
options.placeholder=this.fieldDef.placeholder
$(this.selector).select2(options)}
if(this.dynamicOptions){if(!Modernizr.touch){this.indicatorContainer=$('.select2-container',$(this.selector).closest('td'))
this.indicatorContainer.addClass('loading-indicator-container').addClass('size-small')}
this.loadOptions(true)}
if(this.fieldDef.depends)
this.inspector.$el.on('propertyChanged.oc.Inspector',$.proxy(this.onDependencyChanged,this))}
InspectorEditorDropdown.prototype.onDependencyChanged=function(ev,property){if($.inArray(property,this.fieldDef.depends)===-1)
return
var self=this,dependencyValues=this.getDependencyValues()
if(this.prevDependencyValues===undefined||this.prevDependencyValues!=dependencyValues)
this.loadOptions()}
InspectorEditorDropdown.prototype.saveDependencyValues=function(){this.prevDependencyValues=this.getDependencyValues()}
InspectorEditorDropdown.prototype.getDependencyValues=function(){var dependencyValues='',self=this
$.each(this.fieldDef.depends,function(index,masterProperty){dependencyValues+=masterProperty+':'+self.inspector.readProperty(masterProperty)+'-'})
return dependencyValues}
InspectorEditorDropdown.prototype.showLoadingIndicator=function(){if(!Modernizr.touch)
this.indicatorContainer.loadIndicator()}
InspectorEditorDropdown.prototype.hideLoadingIndicator=function(){if(!Modernizr.touch)
this.indicatorContainer.loadIndicator('hide')}
InspectorEditorDropdown.prototype.loadOptions=function(initialization){var $form=$(this.selector).closest('form'),data=this.inspector.propertyValues,$select=$(this.selector),currentValue=this.inspector.readProperty(this.fieldDef.property,true),self=this
if(currentValue===undefined)
currentValue=this.inspector.getDefaultValue(this.fieldDef.property)
for(var index in this.inspector.config){var propertyInfo=this.inspector.config[index]
if(propertyInfo.itemType=='property'){if(data[propertyInfo.property]===undefined)
data[propertyInfo.property]=this.inspector.getDefaultValue(propertyInfo.property)}}
if(this.fieldDef.depends)
this.saveDependencyValues()
data.inspectorProperty=this.fieldDef.property
data.inspectorClassName=this.inspector.options.inspectorClass
this.showLoadingIndicator()
$form.request('onInspectableGetOptions',{data:data,success:function(data){$('option',$select).remove()
if(self.fieldDef.placeholder!==undefined)
$select.append($('<option></option>'))
if(data.options)
$.each(data.options,function(key,obj){$select.append($('<option></option>').attr('value',obj.value).text(obj.title))})
var hasOption=$('option[value="'+currentValue+'"]',$select).length>0
if(hasOption)
$select.val(currentValue)
else
$('option:first-child',$select).attr("selected","selected");self.initialization=initialization
$select.trigger('change')
self.initialization=false
self.hideLoadingIndicator()},error:function(jqXHR,textStatus,errorThrown){alert(jqXHR.responseText.length?jqXHR.responseText:jqXHR.statusText)
self.hideLoadingIndicator()}})}
InspectorEditorDropdown.prototype.onHideExternalParameterEditor=function(){this.loadOptions(false)}
$.oc.inspector.editors.inspectorEditorDropdown=InspectorEditorDropdown;function initInspector($element){var inspector=$element.data('oc.inspector')
if(inspector===undefined){inspector=new Inspector($element.get(0),$element.data())
inspector.loadConfiguration(function(){inspector.init()})
$element.data('oc.inspector',inspector)}}
$.fn.inspector=function(option){return this.each(function(){initInspector($(this))})}
$(document).on('click','[data-inspectable]',function(){var $this=$(this)
if($this.data('oc.inspectorVisible'))
return false
initInspector($this)
return false})}(window.jQuery);(function($){$(document).on('keydown','div.custom-checkbox',function(e){if(e.keyCode==32)
e.preventDefault()})
$(document).on('keyup','div.custom-checkbox',function(e){if(e.keyCode==32){var $cb=$('input',this)
if($cb.data('oc-space-timestamp')==e.timeStamp)
return
$cb.get(0).checked=!$cb.get(0).checked
$cb.data('oc-space-timestamp',e.timeStamp)
$cb.trigger('change')
return false}})})(jQuery);+function($){'use strict';var backdrop='.dropdown-backdrop'
var toggle='[data-toggle=dropdown]'
var Dropdown=function(element){$(element).on('click.bs.dropdown',this.toggle)}
Dropdown.prototype.toggle=function(e){var $this=$(this)
if($this.is('.disabled, :disabled'))return
var $parent=getParent($this)
var isActive=$parent.hasClass('open')
clearMenus()
if(!isActive){if('ontouchstart'in document.documentElement&&!$parent.closest('.navbar-nav').length){$('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click',clearMenus)}
var relatedTarget={relatedTarget:this}
$parent.trigger(e=$.Event('show.bs.dropdown',relatedTarget))
if(e.isDefaultPrevented())return
$parent.toggleClass('open').trigger('shown.bs.dropdown',relatedTarget)
$this.focus()}
return false}
Dropdown.prototype.keydown=function(e){if(!/(38|40|27)/.test(e.keyCode))return
var $this=$(this)
e.preventDefault()
e.stopPropagation()
if($this.is('.disabled, :disabled'))return
var $parent=getParent($this)
var isActive=$parent.hasClass('open')
if(!isActive||(isActive&&e.keyCode==27)){if(e.which==27)$parent.find(toggle).focus()
return $this.click()}
var desc=' li:not(.divider):visible a'
var $items=$parent.find('[role=menu]'+desc+', [role=listbox]'+desc)
if(!$items.length)return
var index=$items.index($items.filter(':focus'))
if(e.keyCode==38&&index>0)index--
if(e.keyCode==40&&index<$items.length-1)index++
if(!~index)index=0
$items.eq(index).focus()}
function clearMenus(e){$(backdrop).remove()
$(toggle).each(function(){var $parent=getParent($(this))
var relatedTarget={relatedTarget:this}
if(!$parent.hasClass('open'))return
$parent.trigger(e=$.Event('hide.bs.dropdown',relatedTarget))
if(e.isDefaultPrevented())return
$parent.removeClass('open').trigger('hidden.bs.dropdown',relatedTarget)})}
function getParent($this){var selector=$this.attr('data-target')
if(!selector){selector=$this.attr('href')
selector=selector&&/#[A-Za-z]/.test(selector)&&selector.replace(/.*(?=#[^\s]*$)/,'')}
var $parent=selector&&$(selector)
return $parent&&$parent.length?$parent:$this.parent()}
var old=$.fn.dropdown
$.fn.dropdown=function(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.dropdown')
if(!data)$this.data('bs.dropdown',(data=new Dropdown(this)))
if(typeof option=='string')data[option].call($this)})}
$.fn.dropdown.Constructor=Dropdown
$.fn.dropdown.noConflict=function(){$.fn.dropdown=old
return this}
$(document).on('click.bs.dropdown.data-api',clearMenus).on('click.bs.dropdown.data-api','.dropdown form',function(e){e.stopPropagation()}).on('click.bs.dropdown.data-api',toggle,Dropdown.prototype.toggle).on('keydown.bs.dropdown.data-api',toggle+', [role=menu], [role=listbox]',Dropdown.prototype.keydown)}(jQuery);+function($){"use strict";$(document).on('shown.bs.dropdown','.dropdown',function(){$(document.body).addClass('dropdown-open')
var dropdown=$('.dropdown-menu',this),dropdownContainer=$(this).data('dropdown-container')
if($('.dropdown-container',dropdown).length==0){var title=$('[data-toggle=dropdown]',this).text(),titleAttr=dropdown.data('dropdown-title'),timer=null
if(titleAttr!==undefined)
title=titleAttr
$('li:first-child',dropdown).addClass('first-item')
dropdown.prepend($('<li/>').addClass('dropdown-title').text(title))
var container=$('<li/>').addClass('dropdown-container'),ul=$('<ul/>')
container.prepend(ul)
ul.prepend(dropdown.children())
dropdown.prepend(container)
dropdown.on('touchstart',function(){window.setTimeout(function(){dropdown.addClass('scroll')},200)})
dropdown.on('touchend',function(){window.setTimeout(function(){dropdown.removeClass('scroll')},200)})
dropdown.on('click','a',function(){if(dropdown.hasClass('scroll'))
return false})}
if(dropdownContainer!==undefined&&dropdownContainer=='body'){$(this).data('oc.dropdown',dropdown)
$(document.body).append(dropdown)
dropdown.css({'visibility':'hidden','left':0,'top':0,'display':'block'})
var targetOffset=$(this).offset(),targetHeight=$(this).height(),targetWidth=$(this).width(),position={x:targetOffset.left,y:targetOffset.top+targetHeight},leftOffset=targetWidth<30?-16:0,documentHeight=$(document).height(),dropdownHeight=dropdown.height()
if((dropdownHeight+position.y)>$(document).height()){position.y=targetOffset.top-dropdownHeight-12
dropdown.addClass('top')}
else{dropdown.removeClass('top')}
dropdown.css({'left':position.x+leftOffset,'top':position.y,'visibility':'visible'})}
if($('.dropdown-overlay',document.body).length==0){$(document.body).prepend($('<div/>').addClass('dropdown-overlay'));}})
$(document).on('hidden.bs.dropdown','.dropdown',function(){var dropdown=$(this).data('oc.dropdown')
if(dropdown!==undefined){dropdown.css('display','none')
$(this).append(dropdown)}
$(document.body).removeClass('dropdown-open');})}(window.jQuery);+function($){'use strict';var dismiss='[data-dismiss="callout"]'
var Callout=function(el){$(el).on('click',dismiss,this.close)}
Callout.prototype.close=function(e){var $this=$(this)
var selector=$this.attr('data-target')
if(!selector){selector=$this.attr('href')
selector=selector&&selector.replace(/.*(?=#[^\s]*$)/,'')}
var $parent=$(selector)
if(e)e.preventDefault()
if(!$parent.length){$parent=$this.hasClass('callout')?$this:$this.parent()}
$parent.trigger(e=$.Event('close.oc.callout'))
if(e.isDefaultPrevented())return
$parent.removeClass('in')
function removeElement(){$parent.trigger('closed.oc.callout').remove()}
$.support.transition&&$parent.hasClass('fade')?$parent.one($.support.transition.end,removeElement).emulateTransitionEnd(500):removeElement()}
var old=$.fn.callout
$.fn.callout=function(option){return this.each(function(){var $this=$(this)
var data=$this.data('oc.callout')
if(!data)$this.data('oc.callout',(data=new Callout(this)))
if(typeof option=='string')data[option].call($this)})}
$.fn.callout.Constructor=Callout
$.fn.callout.noConflict=function(){$.fn.callout=old
return this}
$(document).on('click.oc.callout.data-api',dismiss,Callout.prototype.close)}(jQuery);(function($){$(document).render(function(){$('[data-toggle="tooltip"]').tooltip()})})(jQuery);(function(factory){if(typeof define==='function'&&define.amd){define(['jquery'],factory);}else if(typeof exports==='object'){module.exports=factory;}else{factory(jQuery);}}(function($){var toFix=['wheel','mousewheel','DOMMouseScroll','MozMousePixelScroll'],toBind=('onwheel'in document||document.documentMode>=9)?['wheel']:['mousewheel','DomMouseScroll','MozMousePixelScroll'],slice=Array.prototype.slice,nullLowestDeltaTimeout,lowestDelta;if($.event.fixHooks){for(var i=toFix.length;i;){$.event.fixHooks[toFix[--i]]=$.event.mouseHooks;}}
var special=$.event.special.mousewheel={version:'3.1.9',setup:function(){if(this.addEventListener){for(var i=toBind.length;i;){this.addEventListener(toBind[--i],handler,false);}}else{this.onmousewheel=handler;}
$.data(this,'mousewheel-line-height',special.getLineHeight(this));$.data(this,'mousewheel-page-height',special.getPageHeight(this));},teardown:function(){if(this.removeEventListener){for(var i=toBind.length;i;){this.removeEventListener(toBind[--i],handler,false);}}else{this.onmousewheel=null;}},getLineHeight:function(elem){return parseInt($(elem)['offsetParent'in $.fn?'offsetParent':'parent']().css('fontSize'),10);},getPageHeight:function(elem){return $(elem).height();},settings:{adjustOldDeltas:true}};$.fn.extend({mousewheel:function(fn){return fn?this.bind('mousewheel',fn):this.trigger('mousewheel');},unmousewheel:function(fn){return this.unbind('mousewheel',fn);}});function handler(event){var orgEvent=event||window.event,args=slice.call(arguments,1),delta=0,deltaX=0,deltaY=0,absDelta=0;event=$.event.fix(orgEvent);event.type='mousewheel';if('detail'in orgEvent){deltaY=orgEvent.detail*-1;}
if('wheelDelta'in orgEvent){deltaY=orgEvent.wheelDelta;}
if('wheelDeltaY'in orgEvent){deltaY=orgEvent.wheelDeltaY;}
if('wheelDeltaX'in orgEvent){deltaX=orgEvent.wheelDeltaX*-1;}
if('axis'in orgEvent&&orgEvent.axis===orgEvent.HORIZONTAL_AXIS){deltaX=deltaY*-1;deltaY=0;}
delta=deltaY===0?deltaX:deltaY;if('deltaY'in orgEvent){deltaY=orgEvent.deltaY*-1;delta=deltaY;}
if('deltaX'in orgEvent){deltaX=orgEvent.deltaX;if(deltaY===0){delta=deltaX*-1;}}
if(deltaY===0&&deltaX===0){return;}
if(orgEvent.deltaMode===1){var lineHeight=$.data(this,'mousewheel-line-height');delta*=lineHeight;deltaY*=lineHeight;deltaX*=lineHeight;}else if(orgEvent.deltaMode===2){var pageHeight=$.data(this,'mousewheel-page-height');delta*=pageHeight;deltaY*=pageHeight;deltaX*=pageHeight;}
absDelta=Math.max(Math.abs(deltaY),Math.abs(deltaX));if(!lowestDelta||absDelta<lowestDelta){lowestDelta=absDelta;if(shouldAdjustOldDeltas(orgEvent,absDelta)){lowestDelta/=40;}}
if(shouldAdjustOldDeltas(orgEvent,absDelta)){delta/=40;deltaX/=40;deltaY/=40;}
delta=Math[delta>=1?'floor':'ceil'](delta/lowestDelta);deltaX=Math[deltaX>=1?'floor':'ceil'](deltaX/lowestDelta);deltaY=Math[deltaY>=1?'floor':'ceil'](deltaY/lowestDelta);event.deltaX=deltaX;event.deltaY=deltaY;event.deltaFactor=lowestDelta;event.deltaMode=0;args.unshift(event,delta,deltaX,deltaY);if(nullLowestDeltaTimeout){clearTimeout(nullLowestDeltaTimeout);}
nullLowestDeltaTimeout=setTimeout(nullLowestDelta,200);return($.event.dispatch||$.event.handle).apply(this,args);}
function nullLowestDelta(){lowestDelta=null;}
function shouldAdjustOldDeltas(orgEvent,absDelta){return special.settings.adjustOldDeltas&&orgEvent.type==='mousewheel'&&absDelta%120===0;}}));+function($){"use strict";var Base=$.oc.foundation.base,BaseProto=Base.prototype
var DragScroll=function(element,options){this.options=$.extend({},DragScroll.DEFAULTS,options)
var
$el=$(element),el=$el.get(0),dragStart=0,startOffset=0,self=this,dragging=false,eventElementName=this.options.vertical?'pageY':'pageX';this.el=$el
this.scrollClassContainer=this.options.scrollClassContainer?$(this.options.scrollClassContainer):$el
Base.call(this)
if(this.options.scrollMarkerContainer){$(this.options.scrollMarkerContainer).append($('<span class="before scroll-marker"></span><span class="after scroll-marker"></span>'))}
$el.mousewheel(function(event){if(!self.options.allowScroll)
return;var offset=self.options.vertical?((event.deltaFactor*event.deltaY)*-1):(event.deltaFactor*event.deltaX)
return!scrollWheel(offset)})
$el.on('mousedown.dragScroll',function(event){if(event.target&&event.target.tagName==='INPUT')
return
startDrag(event)
return false})
$el.on('touchstart.dragScroll',function(event){var touchEvent=event.originalEvent;if(touchEvent.touches.length==1){startDrag(touchEvent.touches[0])
event.stopPropagation()}})
$el.on('click.dragScroll',function(){if($(document.body).hasClass('drag'))
return false})
$(document).on('ready',this.proxy(this.fixScrollClasses))
$(window).on('resize',this.proxy(this.fixScrollClasses))
function startDrag(event){dragStart=event[eventElementName]
startOffset=self.options.vertical?$el.scrollTop():$el.scrollLeft()
if(Modernizr.touch){$(window).on('touchmove.dragScroll',function(event){var touchEvent=event.originalEvent
moveDrag(touchEvent.touches[0])
event.preventDefault()})
$(window).on('touchend.dragScroll',function(event){stopDrag()})}
else{$(window).on('mousemove.dragScroll',function(event){moveDrag(event)
$(document.body).addClass(self.options.dragClass)
return false})
$(window).on('mouseup.dragScroll',function(mouseUpEvent){var isClick=event.pageX==mouseUpEvent.pageX&&event.pageY==mouseUpEvent.pageY
stopDrag(isClick)
return false})}}
function moveDrag(event){var current=event[eventElementName],offset=dragStart-current
if(Math.abs(offset)>2){if(!dragging){dragging=true
$el.trigger('start.oc.dragScroll')
self.options.start();}
self.options.vertical?$el.scrollTop(startOffset+offset):$el.scrollLeft(startOffset+offset)
$el.trigger('drag.oc.dragScroll')
self.options.drag()}}
function stopDrag(click){$(window).off('.dragScroll')
dragging=false;if(click)
$(document.body).removeClass(self.options.dragClass)
else
self.fixScrollClasses()
window.setTimeout(function(){if(!click){$(document.body).removeClass(self.options.dragClass)
$el.trigger('stop.oc.dragScroll')
self.options.stop()
self.fixScrollClasses()}},100)}
function scrollWheel(offset){startOffset=self.options.vertical?el.scrollTop:el.scrollLeft
self.options.vertical?$el.scrollTop(startOffset+offset):$el.scrollLeft(startOffset+offset)
var scrolled=self.options.vertical?el.scrollTop!=startOffset:el.scrollLeft!=startOffset
$el.trigger('drag.oc.dragScroll')
self.options.drag()
if(scrolled){if(self.wheelUpdateTimer!==undefined&&self.wheelUpdateTimer!==false)
window.clearInterval(self.wheelUpdateTimer);self.wheelUpdateTimer=window.setTimeout(function(){self.wheelUpdateTimer=false;self.fixScrollClasses()},100);}
return scrolled}
this.fixScrollClasses();}
DragScroll.prototype=Object.create(BaseProto)
DragScroll.prototype.constructor=DragScroll
DragScroll.DEFAULTS={vertical:false,allowScroll:true,scrollClassContainer:false,scrollMarkerContainer:false,dragClass:'drag',start:function(){},drag:function(){},stop:function(){}}
DragScroll.prototype.fixScrollClasses=function(){this.scrollClassContainer.toggleClass('scroll-before',!this.isStart())
this.scrollClassContainer.toggleClass('scroll-after',!this.isEnd())
this.scrollClassContainer.toggleClass('scroll-active-before',this.isActiveBefore())
this.scrollClassContainer.toggleClass('scroll-active-after',this.isActiveAfter())}
DragScroll.prototype.isStart=function(){if(!this.options.vertical)
return this.el.scrollLeft()<=0;else
return this.el.scrollTop()<=0;}
DragScroll.prototype.isEnd=function(){if(!this.options.vertical)
return(this.el[0].scrollWidth-(this.el.scrollLeft()+this.el.width()))<=0
else
return(this.el[0].scrollHeight-(this.el.scrollTop()+this.el.height()))<=0}
DragScroll.prototype.goToStart=function(){if(!this.options.vertical)
return this.el.scrollLeft(0)
else
return this.el.scrollTop(0)}
DragScroll.prototype.isActiveAfter=function(){var activeElement=$('.active',this.el);if(activeElement.length==0)
return false
if(!this.options.vertical)
return activeElement.get(0).offsetLeft>(this.el.scrollLeft()+this.el.width())
else
return activeElement.get(0).offsetTop>(this.el.scrollTop()+this.el.height())}
DragScroll.prototype.isActiveBefore=function(){var activeElement=$('.active',this.el);if(activeElement.length==0)
return false
if(!this.options.vertical)
return(activeElement.get(0).offsetLeft+activeElement.width())<this.el.scrollLeft()
else
return(activeElement.get(0).offsetTop+activeElement.height())<this.el.scrollTop()}
DragScroll.prototype.goToElement=function(element,callback,options){var $el=$(element)
if(!$el.length)
return;var self=this,params={duration:300,queue:false,complete:function(){self.fixScrollClasses()
if(callback!==undefined)
callback()}}
params=$.extend(params,options||{})
var offset=0,animated=false
if(!this.options.vertical){offset=$el.get(0).offsetLeft-this.el.scrollLeft()
if(offset<0){this.el.animate({'scrollLeft':$el.get(0).offsetLeft},params)
animated=true}else{offset=$el.get(0).offsetLeft+$el.width()-(this.el.scrollLeft()+this.el.width())
if(offset>0){this.el.animate({'scrollLeft':$el.get(0).offsetLeft+$el.width()-this.el.width()},params)
animated=true}}}else{offset=$el.get(0).offsetTop-this.el.scrollTop()
if(offset<0){this.el.animate({'scrollTop':$el.get(0).offsetTop},params)
animated=true}else{offset=$el.get(0).offsetTop-(this.el.scrollTop()+this.el.height())
if(offset>0){this.el.animate({'scrollTop':$el.get(0).offsetTop+$el.height()-this.el.height()},params)
animated=true}}}
if(!animated&&callback!==undefined)
callback()}
DragScroll.prototype.dispose=function(){this.scrollClassContainer=null
$(document).off('ready',this.proxy(this.fixScrollClasses))
$(window).off('resize',this.proxy(this.fixScrollClasses))
this.el.off('.dragScroll')
this.el.removeData('oc.dragScroll')
this.el=null
BaseProto.dispose.call(this)}
var old=$.fn.dragScroll
$.fn.dragScroll=function(option){var args=arguments;return this.each(function(){var $this=$(this)
var data=$this.data('oc.dragScroll')
var options=typeof option=='object'&&option
if(!data)$this.data('oc.dragScroll',(data=new DragScroll(this,options)))
if(typeof option=='string'){var methodArgs=[];for(var i=1;i<args.length;i++)
methodArgs.push(args[i])
data[option].apply(data,methodArgs)}})}
$.fn.dragScroll.Constructor=DragScroll
$.fn.dragScroll.noConflict=function(){$.fn.dragScroll=old
return this}}(window.jQuery);+function($){"use strict";var Base=$.oc.foundation.base,BaseProto=Base.prototype
var Toolbar=function(element,options){var
$el=this.$el=$(element),$toolbar=$el.closest('.control-toolbar')
$.oc.foundation.controlUtils.markDisposable(element)
this.$toolbar=$toolbar
this.options=options||{};Base.call(this)
var scrollClassContainer=options.scrollClassContainer!==undefined?options.scrollClassContainer:$el.parent()
$el.dragScroll({scrollClassContainer:scrollClassContainer})
$('.form-control.growable',$toolbar).on('focus.toolbar',function(){update()})
$('.form-control.growable',$toolbar).on('blur.toolbar',function(){update()})
this.$el.one('dispose-control',this.proxy(this.dispose))
function update(){$(window).trigger('resize')}}
Toolbar.prototype=Object.create(BaseProto)
Toolbar.prototype.constructor=Toolbar
Toolbar.prototype.dispose=function(){this.$el.off('dispose-control',this.proxy(this.dispose))
$('.form-control.growable',this.$toolbar).off('.toolbar')
this.$el.dragScroll('dispose')
this.$el.removeData('oc.toolbar')
this.$el=null
BaseProto.dispose.call(this)}
Toolbar.DEFAULTS={}
var old=$.fn.toolbar
$.fn.toolbar=function(option){var args=Array.prototype.slice.call(arguments,1)
return this.each(function(){var $this=$(this)
var data=$this.data('oc.toolbar')
var options=$.extend({},Toolbar.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('oc.toolbar',(data=new Toolbar(this,options)))
if(typeof option=='string')data[option].apply(data,args)})}
$.fn.toolbar.Constructor=Toolbar
$.fn.toolbar.noConflict=function(){$.fn.toolbar=old
return this}
$(document).on('render',function(){$('[data-control=toolbar]').toolbar()})}(window.jQuery);+function($){"use strict";var FilterWidget=function(element,options){var $el=this.$el=$(element);this.options=options||{}
this.scopeValues={}
this.$activeScope=null
this.activeScopeName=null
this.isActiveScopeDirty=false
this.init()}
FilterWidget.DEFAULTS={optionsHandler:null,updateHandler:null}
FilterWidget.prototype.getPopoverTemplate=function(){return'                                                                                        \
                <form>                                                                                  \
                    <input type="hidden" name="scopeName"  value="{{ scopeName }}" />                   \
                    <div id="controlFilterPopover" class="control-filter-popover">                      \
                        <div class="filter-search loading-indicator-container size-input-text">         \
                            <button class="close" data-dismiss="popover" type="button">&times;</button> \
                            <input                                                                      \
                                type="text"                                                             \
                                name="search"                                                           \
                                autocomplete="off"                                                      \
                                class="filter-search-input form-control icon search"                    \
                                data-request="{{ optionsHandler }}"                                     \
                                data-load-indicator-opaque                                              \
                                data-load-indicator                                                     \
                                data-track-input />                                                     \
                        </div>                                                                          \
                        <div class="filter-items">                                                      \
                            <ul>                                                                        \
                                {{#available}}                                                          \
                                    <li data-item-id="{{id}}"><a href="javascript:;">{{name}}</a></li>  \
                                {{/available}}                                                          \
                                {{#loading}}                                                            \
                                    <li class="loading"><span></span></li>                              \
                                {{/loading}}                                                            \
                            </ul>                                                                       \
                        </div>                                                                          \
                        <div class="filter-active-items">                                               \
                            <ul>                                                                        \
                                {{#active}}                                                             \
                                    <li data-item-id="{{id}}"><a href="javascript:;">{{name}}</a></li>  \
                                {{/active}}                                                             \
                            </ul>                                                                       \
                        </div>                                                                          \
                    </div>                                                                              \
                </form>                                                                                 \
            '}
FilterWidget.prototype.init=function(){var self=this
this.$el.on('change','.filter-scope input[type="checkbox"]',function(){var isChecked=$(this).is(':checked'),$scope=$(this).closest('.filter-scope'),scopeName=$scope.data('scope-name')
self.scopeValues[scopeName]=isChecked
self.checkboxToggle(scopeName,isChecked)})
this.$el.on('click','a.filter-scope',function(){var $scope=$(this),scopeName=$scope.data('scope-name')
if($scope.hasClass('filter-scope-open'))return
self.$activeScope=$scope
self.activeScopeName=scopeName
self.isActiveScopeDirty=false
self.displayPopover($scope)
$scope.addClass('filter-scope-open')})
this.$el.on('show.oc.popover','a.filter-scope',function(){self.focusSearch()})
this.$el.on('hide.oc.popover','a.filter-scope',function(){var $scope=$(this)
self.pushOptions(self.activeScopeName)
self.activeScopeName=null
self.$activeScope=null
setTimeout(function(){$scope.removeClass('filter-scope-open')},200)})
$(document).on('click','#controlFilterPopover .filter-items > ul > li',function(){self.selectItem($(this))})
$(document).on('click','#controlFilterPopover .filter-active-items > ul > li',function(){self.selectItem($(this),true)})
$(document).on('ajaxDone','#controlFilterPopover input.filter-search-input',function(event,context,data){self.filterAvailable(data.scopeName,data.options.available)})}
FilterWidget.prototype.focusSearch=function(){if(Modernizr.touch)
return
var $input=$('#controlFilterPopover input.filter-search-input'),length=$input.val().length
$input.focus()
$input.get(0).setSelectionRange(length,length)}
FilterWidget.prototype.updateScopeSetting=function($scope,amount){var $setting=$scope.find('.filter-setting')
if(amount){$setting.text(amount)
$scope.addClass('active')}
else{$setting.text('all')
$scope.removeClass('active')}}
FilterWidget.prototype.selectItem=function($item,isDeselect){var $otherContainer=isDeselect?$item.closest('.control-filter-popover').find('.filter-items:first > ul'):$item.closest('.control-filter-popover').find('.filter-active-items:first > ul')
$item.addClass('animate-enter').prependTo($otherContainer).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){$(this).removeClass('animate-enter')})
if(!this.scopeValues[this.activeScopeName])
return
var
itemId=$item.data('item-id'),items=this.scopeValues[this.activeScopeName],fromItems=isDeselect?items.active:items.available,toItems=isDeselect?items.available:items.active,testFunc=function(item){return item.id==itemId},item=$.grep(fromItems,testFunc).pop(),filtered=$.grep(fromItems,testFunc,true)
if(isDeselect)
this.scopeValues[this.activeScopeName].active=filtered
else
this.scopeValues[this.activeScopeName].available=filtered
if(item)
toItems.push(item)
this.updateScopeSetting(this.$activeScope,items.active.length)
this.isActiveScopeDirty=true
this.focusSearch()}
FilterWidget.prototype.displayPopover=function($scope){var self=this,scopeName=$scope.data('scope-name'),data=this.scopeValues[scopeName],isLoaded=true
if(!data){data={loading:true}
isLoaded=false}
data.scopeName=scopeName
data.optionsHandler=self.options.optionsHandler
$scope.data('oc.popover',null)
$scope.ocPopover({content:Mustache.render(self.getPopoverTemplate(),data),modal:false,highlightModalTarget:true,closeOnPageClick:true,placement:'bottom'})
if(!isLoaded){self.loadOptions(scopeName)}}
FilterWidget.prototype.loadOptions=function(scopeName){var $form=this.$el.closest('form'),self=this,data={scopeName:scopeName}
var populated=this.$el.data('filterScopes')
if(populated&&populated[scopeName]){self.fillOptions(scopeName,populated[scopeName])
return false}
return $form.request(this.options.optionsHandler,{data:data,success:function(data){self.fillOptions(scopeName,data.options)}})}
FilterWidget.prototype.fillOptions=function(scopeName,data){if(this.scopeValues[scopeName])
return
if(!data.active)data.active=[]
if(!data.available)data.available=[]
this.scopeValues[scopeName]=data
if(scopeName!=this.activeScopeName)
return
var container=$('#controlFilterPopover .filter-items > ul').empty()
this.addItemsToListElement(container,data.available)
var container=$('#controlFilterPopover .filter-active-items > ul')
this.addItemsToListElement(container,data.active)}
FilterWidget.prototype.filterAvailable=function(scopeName,available){if(this.activeScopeName!=scopeName)
return
if(!this.scopeValues[this.activeScopeName])
return
var
self=this,filtered=[],items=this.scopeValues[scopeName]
if(items.active.length){var compareFunc=function(a,b){return a.id==b.id},inArrayFunc=function(elem,array,testFunc){var i=array.length
do{if(i--===0)return i}while(testFunc(array[i],elem))
return i}
filtered=$.grep(available,function(item){return!inArrayFunc(item,items.active,compareFunc)})}
else{filtered=available}
var container=$('#controlFilterPopover .filter-items > ul').empty()
self.addItemsToListElement(container,filtered)}
FilterWidget.prototype.addItemsToListElement=function($ul,items){$.each(items,function(key,obj){var item=$('<li />').data({'item-id':obj.id}).append($('<a />').prop({'href':'javascript:;',}).text(obj.name))
$ul.append(item)})}
FilterWidget.prototype.pushOptions=function(scopeName){if(!this.isActiveScopeDirty||!this.options.updateHandler)
return
var $form=this.$el.closest('form'),data={scopeName:scopeName,options:this.scopeValues[scopeName]}
$.oc.stripeLoadIndicator.show()
$form.request(this.options.updateHandler,{data:data}).always(function(){$.oc.stripeLoadIndicator.hide()})}
FilterWidget.prototype.checkboxToggle=function(scopeName,isChecked){if(!this.options.updateHandler)
return
var $form=this.$el.closest('form'),data={scopeName:scopeName,value:isChecked}
$.oc.stripeLoadIndicator.show()
$form.request(this.options.updateHandler,{data:data}).always(function(){$.oc.stripeLoadIndicator.hide()})}
var old=$.fn.filterWidget
$.fn.filterWidget=function(option){var args=arguments,result
this.each(function(){var $this=$(this)
var data=$this.data('oc.filterwidget')
var options=$.extend({},FilterWidget.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('oc.filterwidget',(data=new FilterWidget(this,options)))
if(typeof option=='string')result=data[option].call($this)
if(typeof result!='undefined')return false})
return result?result:this}
$.fn.filterWidget.Constructor=FilterWidget
$.fn.filterWidget.noConflict=function(){$.fn.filterWidget=old
return this}
$(document).render(function(){$('[data-control="filterwidget"]').filterWidget();})}(window.jQuery);(function($){$(document).render(function(){if(Modernizr.touch)
return
var formatSelectOption=function(state){if(!state.id)
return state.text;var $option=$(state.element),iconClass=$option.data('icon'),imageSrc=$option.data('image')
if(iconClass)
return'<i class="select-icon '+iconClass+'"></i> '+state.text
if(imageSrc)
return'<img class="select-image" src="'+imageSrc+'" alt="" /> '+state.text
return state.text}
var selectOptions={templateResult:formatSelectOption,templateSelection:formatSelectOption,escapeMarkup:function(m){return m},width:'style'}
$('select.custom-select').each(function(){var $element=$(this),extraOptions={}
if($element.data('select2')!=null){return true;}
$element.attr('data-disposable','data-disposable')
$element.one('dispose-control',function(){if($element.data('select2')){$element.select2('destroy')}})
if($element.hasClass('select-no-search')){extraOptions.minimumResultsForSearch=Infinity}
$element.select2($.extend({},selectOptions,extraOptions))})})
$(document).on('disable','select.custom-select',function(event,status){$(this).select2('enable',!status)})
$(document).on('focus','select.custom-select',function(event){setTimeout($.proxy(function(){$(this).select2('focus')},this),10)})})(jQuery);+function($){"use strict";var LoadIndicator=function(element,options){var $el=this.$el=$(element)
this.options=options||{}
this.tally=0
this.show()}
LoadIndicator.prototype.hide=function(){this.tally--
if(this.tally<=0){$('div.loading-indicator',this.$el).remove()
this.$el.removeClass('in-progress')}}
LoadIndicator.prototype.show=function(options){if(options)
this.options=options
this.hide()
var indicator=$('<div class="loading-indicator"></div>')
indicator.append($('<div></div>').text(this.options.text))
indicator.append($('<span></span>'))
if(this.options.opaque!==undefined){indicator.addClass('is-opaque')}
this.$el.prepend(indicator)
this.$el.addClass('in-progress')
this.tally++}
LoadIndicator.DEFAULTS={text:''}
var old=$.fn.loadIndicator
$.fn.loadIndicator=function(option){var args=arguments;return this.each(function(){var $this=$(this)
var data=$this.data('oc.loadIndicator')
var options=$.extend({},LoadIndicator.DEFAULTS,typeof option=='object'&&option)
if(!data){if(typeof option=='string')
return;$this.data('oc.loadIndicator',(data=new LoadIndicator(this,options)))}else{if(typeof option!=='string')
data.show(options);else{var methodArgs=[];for(var i=1;i<args.length;i++)
methodArgs.push(args[i])
data[option].apply(data,methodArgs)}}})}
$.fn.loadIndicator.Constructor=LoadIndicator
$.fn.loadIndicator.noConflict=function(){$.fn.loadIndicator=old
return this}
$(document).on('ajaxPromise','[data-load-indicator]',function(){var
indicatorContainer=$(this).closest('.loading-indicator-container'),loadingText=$(this).data('load-indicator'),options={opaque:$(this).data('load-indicator-opaque')}
if(loadingText)
options.text=loadingText
indicatorContainer.loadIndicator(options)}).on('ajaxFail ajaxDone','[data-load-indicator]',function(){$(this).closest('.loading-indicator-container').loadIndicator('hide')})}(window.jQuery);+function($){"use strict";if($.oc===undefined)
$.oc={}
var CursorLoadIndicator=function(){if(Modernizr.touch)
return
this.counter=0
this.indicator=$('<div/>').addClass('cursor-loading-indicator').addClass('hide')
$(document.body).append(this.indicator)}
CursorLoadIndicator.prototype.show=function(event){if(Modernizr.touch)
return
this.counter++
if(this.counter>1)
return
var self=this,$window=$(window);if(event!==undefined&&event.clientY!==undefined){self.indicator.css({left:event.clientX+15,top:event.clientY+15})}
this.indicator.removeClass('hide')
$(window).on('mousemove.cursorLoadIndicator',function(e){self.indicator.css({left:e.clientX+15,top:e.clientY+15,})})}
CursorLoadIndicator.prototype.hide=function(force){if(Modernizr.touch)
return
this.counter--
if(force!==undefined&&force)
this.counter=0
if(this.counter<=0){this.indicator.addClass('hide')
$(window).off('.cursorLoadIndicator');}}
$(document).ready(function(){$.oc.cursorLoadIndicator=new CursorLoadIndicator();})
$(document).on('ajaxPromise','[data-cursor-load-indicator]',function(){$.oc.cursorLoadIndicator.show()}).on('ajaxFail ajaxDone','[data-cursor-load-indicator]',function(){$.oc.cursorLoadIndicator.hide()})}(window.jQuery);+function($){"use strict";if($.oc===undefined)
$.oc={}
var StripeLoadIndicator=function(){this.counter=0
this.indicator=$('<div/>').addClass('stripe-loading-indicator loaded').append($('<div />').addClass('stripe')).append($('<div />').addClass('stripe-loaded'))
this.stripe=this.indicator.find('.stripe')
$(document.body).append(this.indicator)}
StripeLoadIndicator.prototype.show=function(){this.counter++
this.stripe.after(this.stripe=this.stripe.clone()).remove()
if(this.counter>1)
return
this.indicator.removeClass('loaded')
$(document.body).addClass('loading')}
StripeLoadIndicator.prototype.hide=function(force){this.counter--
if(force!==undefined&&force)
this.counter=0
if(this.counter<=0){this.indicator.addClass('loaded')
$(document.body).removeClass('loading')}}
$(document).ready(function(){$.oc.stripeLoadIndicator=new StripeLoadIndicator()})
$(document).on('ajaxPromise','[data-stripe-load-indicator]',function(event){event.stopPropagation()
$.oc.stripeLoadIndicator.show()
var $el=$(this)
$(window).one('ajaxUpdateComplete',function(){if($el.closest('html').length===0)
$.oc.stripeLoadIndicator.hide()})}).on('ajaxFail ajaxDone','[data-stripe-load-indicator]',function(event){event.stopPropagation()
$.oc.stripeLoadIndicator.hide()})}(window.jQuery);+function($){"use strict";var Popover=function(element,options){var $el=this.$el=$(element);this.options=options||{};this.arrowSize=15
this.docClickHandler=null
this.show()}
Popover.prototype.hide=function(){var e=$.Event('hiding.oc.popover',{relatedTarget:this.$el})
this.$el.trigger(e,this)
if(e.isDefaultPrevented())
return
this.$container.removeClass('in')
if(this.$overlay)this.$overlay.removeClass('in')
this.disposeControls()
$.support.transition&&this.$container.hasClass('fade')?this.$container.one($.support.transition.end,$.proxy(this.hidePopover,this)).emulateTransitionEnd(300):this.hidePopover()}
Popover.prototype.disposeControls=function(){if(this.$container){$.oc.foundation.controlUtils.disposeControls(this.$container.get(0))}}
Popover.prototype.hidePopover=function(){this.$container.remove();if(this.$overlay)this.$overlay.remove()
this.$el.removeClass('popover-highlight')
this.$el.trigger('hide.oc.popover')
this.$overlay=false
this.$container=false
this.$el.data('oc.popover',null)
$(document.body).removeClass('popover-open')
$(document).unbind('mousedown',this.docClickHandler);$(document).off('.oc.popover')
this.docClickHandler=null}
Popover.prototype.show=function(options){var self=this
var e=$.Event('showing.oc.popover',{relatedTarget:this.$el})
this.$el.trigger(e,this)
if(e.isDefaultPrevented())
return
this.$container=$('<div />').addClass('control-popover')
if(this.options.containerClass)
this.$container.addClass(this.options.containerClass)
if(this.options.useAnimation)
this.$container.addClass('fade')
var $content=$('<div />').html(this.getContent())
this.$container.append($content)
if(this.options.width)
this.$container.width(this.options.width)
if(this.options.modal){this.$overlay=$('<div />').addClass('popover-overlay')
$(document.body).append(this.$overlay)
if(this.options.highlightModalTarget){this.$el.addClass('popover-highlight')
this.$el.blur()}}else{this.$overlay=false}
if(this.options.container)
$(this.options.container).append(this.$container)
else
$(document.body).append(this.$container)
var
placement=this.calcPlacement(),position=this.calcPosition(placement)
this.$container.css({left:position.x,top:position.y}).addClass('placement-'+placement)
this.$container.addClass('in')
if(this.$overlay)this.$overlay.addClass('in')
$(document.body).addClass('popover-open')
var showEvent=jQuery.Event('show.oc.popover',{relatedTarget:this.$container.get(0)})
this.$el.trigger(showEvent)
this.$container.on('close.oc.popover',function(e){self.hide()})
this.$container.on('click','[data-dismiss=popover]',function(e){self.hide()
return false})
this.docClickHandler=$.proxy(this.onDocumentClick,this)
$(document).bind('mousedown',this.docClickHandler);if(this.options.closeOnEsc){$(document).on('keyup.oc.popover',function(e){if($(e.target).hasClass('select2-offscreen'))
return false
if(e.keyCode==27){self.hide()
return false}})}}
Popover.prototype.getContent=function(){return typeof this.options.content=='function'?this.options.content.call(this.$el[0],this):this.options.content}
Popover.prototype.calcDimensions=function(){var
documentWidth=$(document).width(),documentHeight=$(document).height(),targetOffset=this.$el.offset(),targetWidth=this.$el.outerWidth(),targetHeight=this.$el.outerHeight()
return{containerWidth:this.$container.outerWidth()+this.arrowSize,containerHeight:this.$container.outerHeight()+this.arrowSize,targetOffset:targetOffset,targetHeight:targetHeight,targetWidth:targetWidth,spaceLeft:targetOffset.left,spaceRight:documentWidth-(targetWidth+targetOffset.left),spaceTop:targetOffset.top,spaceBottom:documentHeight-(targetHeight+targetOffset.top),spaceHorizontalBottom:documentHeight-targetOffset.top,spaceVerticalRight:documentWidth-targetOffset.left,documentWidth:documentWidth}}
Popover.prototype.fitsLeft=function(dimensions){return dimensions.spaceLeft>=dimensions.containerWidth&&dimensions.spaceHorizontalBottom>=dimensions.containerHeight}
Popover.prototype.fitsRight=function(dimensions){return dimensions.spaceRight>=dimensions.containerWidth&&dimensions.spaceHorizontalBottom>=dimensions.containerHeight}
Popover.prototype.fitsBottom=function(dimensions){return dimensions.spaceBottom>=dimensions.containerHeight&&dimensions.spaceVerticalRight>=dimensions.containerWidth}
Popover.prototype.fitsTop=function(dimensions){return dimensions.spaceTop>=dimensions.containerHeight&&dimensions.spaceVerticalRight>=dimensions.containerWidth}
Popover.prototype.calcPlacement=function(){var
placement=this.options.placement,dimensions=this.calcDimensions();if(placement=='center')
return placement
if(placement!='bottom'&&placement!='top'&&placement!='left'&&placement!='right')
placement='bottom'
var placementFunctions={top:this.fitsTop,bottom:this.fitsBottom,left:this.fitsLeft,right:this.fitsRight}
if(placementFunctions[placement](dimensions))
return placement
for(var index in placementFunctions){if(placementFunctions[index](dimensions))
return index}
return this.options.fallbackPlacement}
Popover.prototype.calcPosition=function(placement){var
dimensions=this.calcDimensions(),result
switch(placement){case'left':var realOffset=this.options.offsetY===undefined?this.options.offset:this.options.offsetY
result={x:(dimensions.targetOffset.left-dimensions.containerWidth),y:dimensions.targetOffset.top+realOffset}
break;case'top':var realOffset=this.options.offsetX===undefined?this.options.offset:this.options.offsetX
result={x:dimensions.targetOffset.left+realOffset,y:(dimensions.targetOffset.top-dimensions.containerHeight)}
break;case'bottom':var realOffset=this.options.offsetX===undefined?this.options.offset:this.options.offsetX
result={x:dimensions.targetOffset.left+realOffset,y:(dimensions.targetOffset.top+dimensions.targetHeight+this.arrowSize)}
break;case'right':var realOffset=this.options.offsetY===undefined?this.options.offset:this.options.offsetY
result={x:(dimensions.targetOffset.left+dimensions.targetWidth+this.arrowSize),y:dimensions.targetOffset.top+realOffset}
break;case'center':var windowHeight=$(window).height()
result={x:(dimensions.documentWidth/2-dimensions.containerWidth/2),y:(windowHeight/2-dimensions.containerHeight/2)}
if(result.y<40)
result.y=40
break;}
if(!this.options.container)
return result
var
$container=$(this.options.container),containerOffset=$container.offset()
result.x-=containerOffset.left
result.y-=containerOffset.top
return result}
Popover.prototype.onDocumentClick=function(e){if(!this.options.closeOnPageClick)
return
if($.contains(this.$container.get(0),e.target))
return
this.hide();}
Popover.DEFAULTS={placement:'bottom',fallbackPlacement:'bottom',content:'<p>Popover content<p>',width:false,modal:false,highlightModalTarget:false,closeOnPageClick:true,closeOnEsc:true,container:false,containerClass:null,offset:15,useAnimation:false}
var old=$.fn.ocPopover
$.fn.ocPopover=function(option){var args=arguments;return this.each(function(){var $this=$(this)
var data=$this.data('oc.popover')
var options=$.extend({},Popover.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data){if(typeof option=='string')
return;$this.data('oc.popover',(data=new Popover(this,options)))}else{if(typeof option!='string')
return;var methodArgs=[];for(var i=1;i<args.length;i++)
methodArgs.push(args[i])
data[option].apply(data,methodArgs)}})}
$.fn.ocPopover.Constructor=Popover
$.fn.ocPopover.noConflict=function(){$.fn.ocPopover=old
return this}
$(document).on('click','[data-control=popover]',function(e){$(this).ocPopover()
return false;})}(window.jQuery);+function($){'use strict';var Modal=function(element,options){this.options=options
this.$element=$(element)
this.$backdrop=this.isShown=null
if(this.options.remote){this.$element.find('.modal-content').load(this.options.remote,$.proxy(function(){this.$element.trigger('loaded.bs.modal')},this))}}
Modal.DEFAULTS={backdrop:true,keyboard:true,show:true}
Modal.prototype.toggle=function(_relatedTarget){return this[!this.isShown?'show':'hide'](_relatedTarget)}
Modal.prototype.show=function(_relatedTarget){var that=this
var e=$.Event('show.bs.modal',{relatedTarget:_relatedTarget})
this.$element.trigger(e)
if(this.isShown||e.isDefaultPrevented())return
this.isShown=true
this.escape()
this.$element.on('click.dismiss.bs.modal','[data-dismiss="modal"]',$.proxy(this.hide,this))
this.backdrop(function(){var transition=$.support.transition&&that.$element.hasClass('fade')
if(!that.$element.parent().length){that.$element.appendTo(document.body)}
that.$element.show().scrollTop(0)
if(transition){that.$element[0].offsetWidth}
that.$element.addClass('in').attr('aria-hidden',false)
that.enforceFocus()
var e=$.Event('shown.bs.modal',{relatedTarget:_relatedTarget})
transition?that.$element.find('.modal-dialog').one($.support.transition.end,function(){that.$element.focus().trigger(e)}).emulateTransitionEnd(300):that.$element.focus().trigger(e)})}
Modal.prototype.hide=function(e){if(e)e.preventDefault()
e=$.Event('hide.bs.modal')
this.$element.trigger(e)
if(!this.isShown||e.isDefaultPrevented())return
this.isShown=false
this.escape()
$(document).off('focusin.bs.modal')
this.$element.removeClass('in').attr('aria-hidden',true).off('click.dismiss.bs.modal')
$.support.transition&&this.$element.hasClass('fade')?this.$element.one($.support.transition.end,$.proxy(this.hideModal,this)).emulateTransitionEnd(300):this.hideModal()}
Modal.prototype.enforceFocus=function(){$(document).off('focusin.bs.modal').on('focusin.bs.modal',$.proxy(function(e){if($(e.target).hasClass('select2-search__field')){return}
if(this.$element[0]!==e.target&&!this.$element.has(e.target).length){this.$element.focus()}},this))}
Modal.prototype.escape=function(){if(this.isShown&&this.options.keyboard){this.$element.on('keyup.dismiss.bs.modal',$.proxy(function(e){e.which==27&&this.hide()},this))}
else if(!this.isShown){this.$element.off('keyup.dismiss.bs.modal')}}
Modal.prototype.hideModal=function(){var that=this
this.$element.hide()
this.backdrop(function(){that.removeBackdrop()
that.$element.trigger('hidden.bs.modal')})}
Modal.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove()
this.$backdrop=null}
Modal.prototype.backdrop=function(callback){var animate=this.$element.hasClass('fade')?'fade':''
if(this.isShown&&this.options.backdrop){var doAnimate=$.support.transition&&animate
this.$backdrop=$('<div class="modal-backdrop '+animate+'" />').appendTo(document.body)
this.$element.on('click.dismiss.bs.modal',$.proxy(function(e){if(e.target!==e.currentTarget)return
this.options.backdrop=='static'?this.$element[0].focus.call(this.$element[0]):this.hide.call(this)},this))
if(doAnimate)this.$backdrop[0].offsetWidth
this.$backdrop.addClass('in')
if(!callback)return
doAnimate?this.$backdrop.one($.support.transition.end,callback).emulateTransitionEnd(150):callback()}
else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass('in')
$.support.transition&&this.$element.hasClass('fade')?this.$backdrop.one($.support.transition.end,callback).emulateTransitionEnd(150):callback()}
else if(callback){callback()}}
var old=$.fn.modal
$.fn.modal=function(option,_relatedTarget){return this.each(function(){var $this=$(this)
var data=$this.data('bs.modal')
var options=$.extend({},Modal.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('bs.modal',(data=new Modal(this,options)))
if(typeof option=='string')data[option](_relatedTarget)
else if(options.show)data.show(_relatedTarget)})}
$.fn.modal.Constructor=Modal
$.fn.modal.noConflict=function(){$.fn.modal=old
return this}
$(document).on('click.bs.modal.data-api','[data-toggle="modal"]',function(e){var $this=$(this)
var href=$this.attr('href')
var $target=$($this.attr('data-target')||(href&&href.replace(/.*(?=#[^\s]+$)/,'')))
var option=$target.data('bs.modal')?'toggle':$.extend({remote:!/#/.test(href)&&href},$target.data(),$this.data())
if($this.is('a'))e.preventDefault()
$target.modal(option,this).one('hide',function(){$this.is(':visible')&&$this.focus()})})
$(document).on('show.bs.modal','.modal',function(){$(document.body).addClass('modal-open')}).on('hidden.bs.modal','.modal',function(){$(document.body).removeClass('modal-open')})}(jQuery);+function($){"use strict";var Popup=function(element,options){var self=this
this.options=options
this.$el=$(element)
this.$container=null
this.$modal=null
this.$backdrop=null
this.isOpen=false
this.firstDiv=null
this.allowHide=true
this.$container=this.createPopupContainer()
this.$content=this.$container.find('.modal-content:first')
this.$modal=this.$container.modal({show:false,backdrop:false,keyboard:this.options.keyboard})
this.$container.data('oc.popup',this)
this.$modal.on('hide.bs.modal',function(){self.triggerEvent('hide.oc.popup')
self.isOpen=false
self.setBackdrop(false)})
this.$modal.on('hidden.bs.modal',function(){self.triggerEvent('hidden.oc.popup')
self.$container.remove()
self.$el.data('oc.popup',null)
$(document.body).removeClass('modal-open')})
this.$modal.on('show.bs.modal',function(){self.isOpen=true
self.setBackdrop(true)
$(document.body).addClass('modal-open')})
this.$modal.on('shown.bs.modal',function(){self.triggerEvent('shown.oc.popup')})
this.$modal.on('close.oc.popup',function(){self.hide()
return false})
this.init()}
Popup.DEFAULTS={ajax:null,handler:null,keyboard:true,extraData:{},content:null,size:null,adaptiveHeight:false,zIndex:null}
Popup.prototype.init=function(){var self=this
if(self.isOpen)
return
this.setBackdrop(true)
if(!this.options.content)
this.setLoading(true)
if(this.options.handler){this.$el.request(this.options.handler,{data:this.options.extraData,success:function(data,textStatus,jqXHR){this.success(data,textStatus,jqXHR).done(function(){self.setContent(data.result)
$(window).trigger('ajaxUpdateComplete',[this,data,textStatus,jqXHR])
self.triggerEvent('popupComplete')
self.triggerEvent('complete.oc.popup')})},error:function(jqXHR,textStatus,errorThrown){this.error(jqXHR,textStatus,errorThrown).done(function(){self.hide()
self.triggerEvent('popupError')
self.triggerEvent('error.oc.popup')})}})}
else if(this.options.ajax){$.ajax({url:this.options.ajax,data:this.options.extraData,success:function(data){self.setContent(data)},cache:false})}
else if(this.options.content){var content=typeof this.options.content=='function'?this.options.content.call(this.$el[0],this):this.options.content
this.setContent(content)}}
Popup.prototype.createPopupContainer=function(){var
modal=$('<div />').prop({class:'control-popup modal fade',role:'dialog',tabindex:-1}),modalDialog=$('<div />').addClass('modal-dialog'),modalContent=$('<div />').addClass('modal-content')
if(this.options.size)
modalDialog.addClass('size-'+this.options.size)
if(this.options.adaptiveHeight)
modalDialog.addClass('adaptive-height')
if(this.options.zIndex!==null)
modal.css('z-index',this.options.zIndex+20)
return modal.append(modalDialog.append(modalContent))}
Popup.prototype.setContent=function(contents){this.$content.html(contents)
this.setLoading(false)
this.show()
this.firstDiv=this.$content.find('>div:first')
if(this.firstDiv.length>0)
this.firstDiv.data('oc.popup',this)}
Popup.prototype.setBackdrop=function(val){if(val&&!this.$backdrop){this.$backdrop=$('<div class="popup-backdrop fade" />')
if(this.options.zIndex!==null)
this.$backdrop.css('z-index',this.options.zIndex)
this.$backdrop.appendTo(document.body)
this.$backdrop.addClass('in')
this.$backdrop.append($('<div class="modal-content popup-loading-indicator" />'))}
else if(!val&&this.$backdrop){this.$backdrop.remove()
this.$backdrop=null}}
Popup.prototype.setLoading=function(val){if(!this.$backdrop)
return;var self=this
if(val){setTimeout(function(){self.$backdrop.addClass('loading');},100)}
else{this.$backdrop.removeClass('loading');}}
Popup.prototype.hideLoading=function(val){this.setLoading(false)
var self=this
setTimeout(function(){self.setBackdrop(false)},250)
setTimeout(function(){self.hide()},500)}
Popup.prototype.triggerEvent=function(eventName,params){if(!params)
params=[this.$el,this.$modal]
var eventObject=jQuery.Event(eventName,{relatedTarget:this.$container.get(0)})
this.$el.trigger(eventObject,params)
if(this.firstDiv)
this.firstDiv.trigger(eventObject,params)}
Popup.prototype.reload=function(){this.init()}
Popup.prototype.show=function(){this.$modal.modal('show')
this.$modal.on('click.dismiss.popup','[data-dismiss="popup"]',$.proxy(this.hide,this))
this.triggerEvent('popupShow')
this.triggerEvent('show.oc.popup')}
Popup.prototype.hide=function(){this.triggerEvent('popupHide')
this.triggerEvent('hide.oc.popup')
if(this.allowHide)
this.$modal.modal('hide')}
Popup.prototype.visible=function(val){if(val)
this.$modal.addClass('in')
else
this.$modal.removeClass('in')
this.setBackdrop(val)}
Popup.prototype.toggle=function(){this.triggerEvent('popupToggle',[this.$modal])
this.triggerEvent('toggle.oc.popup',[this.$modal])
this.$modal.modal('toggle')}
Popup.prototype.lock=function(val){this.allowHide=!val}
var old=$.fn.popup
$.fn.popup=function(option){var args=Array.prototype.slice.call(arguments,1)
return this.each(function(){var $this=$(this)
var data=$this.data('oc.popup')
var options=$.extend({},Popup.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('oc.popup',(data=new Popup(this,options)))
else if(typeof option=='string')data[option].apply(data,args)
else data.reload()})}
$.fn.popup.Constructor=Popup
$.popup=function(option){return $('<a />').popup(option)}
$.fn.popup.noConflict=function(){$.fn.popup=old
return this}
$(document).on('click.oc.popup','[data-control="popup"]',function(){$(this).popup()
return false});$(document).on('ajaxPromise','[data-popup-load-indicator]',function(event,context){if($(this).data('request')!=context.handler)return
$(this).closest('.control-popup').removeClass('in').popup('setLoading',true)}).on('ajaxFail','[data-popup-load-indicator]',function(event,context){if($(this).data('request')!=context.handler)return
$(this).closest('.control-popup').addClass('in').popup('setLoading',false)}).on('ajaxDone','[data-popup-load-indicator]',function(event,context){if($(this).data('request')!=context.handler)return
$(this).closest('.control-popup').popup('hideLoading')})}(window.jQuery);(function(glob){var version="0.4.2",has="hasOwnProperty",separator=/[\.\/]/,wildcard="*",fun=function(){},numsort=function(a,b){return a-b;},current_event,stop,events={n:{}},eve=function(name,scope){name=String(name);var e=events,oldstop=stop,args=Array.prototype.slice.call(arguments,2),listeners=eve.listeners(name),z=0,f=false,l,indexed=[],queue={},out=[],ce=current_event,errors=[];current_event=name;stop=0;for(var i=0,ii=listeners.length;i<ii;i++)if("zIndex"in listeners[i]){indexed.push(listeners[i].zIndex);if(listeners[i].zIndex<0){queue[listeners[i].zIndex]=listeners[i];}}
indexed.sort(numsort);while(indexed[z]<0){l=queue[indexed[z++]];out.push(l.apply(scope,args));if(stop){stop=oldstop;return out;}}
for(i=0;i<ii;i++){l=listeners[i];if("zIndex"in l){if(l.zIndex==indexed[z]){out.push(l.apply(scope,args));if(stop){break;}
do{z++;l=queue[indexed[z]];l&&out.push(l.apply(scope,args));if(stop){break;}}while(l)}else{queue[l.zIndex]=l;}}else{out.push(l.apply(scope,args));if(stop){break;}}}
stop=oldstop;current_event=ce;return out.length?out:null;};eve._events=events;eve.listeners=function(name){var names=name.split(separator),e=events,item,items,k,i,ii,j,jj,nes,es=[e],out=[];for(i=0,ii=names.length;i<ii;i++){nes=[];for(j=0,jj=es.length;j<jj;j++){e=es[j].n;items=[e[names[i]],e[wildcard]];k=2;while(k--){item=items[k];if(item){nes.push(item);out=out.concat(item.f||[]);}}}
es=nes;}
return out;};eve.on=function(name,f){name=String(name);if(typeof f!="function"){return function(){};}
var names=name.split(separator),e=events;for(var i=0,ii=names.length;i<ii;i++){e=e.n;e=e.hasOwnProperty(names[i])&&e[names[i]]||(e[names[i]]={n:{}});}
e.f=e.f||[];for(i=0,ii=e.f.length;i<ii;i++)if(e.f[i]==f){return fun;}
e.f.push(f);return function(zIndex){if(+zIndex==+zIndex){f.zIndex=+zIndex;}};};eve.f=function(event){var attrs=[].slice.call(arguments,1);return function(){eve.apply(null,[event,null].concat(attrs).concat([].slice.call(arguments,0)));};};eve.stop=function(){stop=1;};eve.nt=function(subname){if(subname){return new RegExp("(?:\\.|\\/|^)"+subname+"(?:\\.|\\/|$)").test(current_event);}
return current_event;};eve.nts=function(){return current_event.split(separator);};eve.off=eve.unbind=function(name,f){if(!name){eve._events=events={n:{}};return;}
var names=name.split(separator),e,key,splice,i,ii,j,jj,cur=[events];for(i=0,ii=names.length;i<ii;i++){for(j=0;j<cur.length;j+=splice.length-2){splice=[j,1];e=cur[j].n;if(names[i]!=wildcard){if(e[names[i]]){splice.push(e[names[i]]);}}else{for(key in e)if(e[has](key)){splice.push(e[key]);}}
cur.splice.apply(cur,splice);}}
for(i=0,ii=cur.length;i<ii;i++){e=cur[i];while(e.n){if(f){if(e.f){for(j=0,jj=e.f.length;j<jj;j++)if(e.f[j]==f){e.f.splice(j,1);break;}!e.f.length&&delete e.f;}
for(key in e.n)if(e.n[has](key)&&e.n[key].f){var funcs=e.n[key].f;for(j=0,jj=funcs.length;j<jj;j++)if(funcs[j]==f){funcs.splice(j,1);break;}!funcs.length&&delete e.n[key].f;}}else{delete e.f;for(key in e.n)if(e.n[has](key)&&e.n[key].f){delete e.n[key].f;}}
e=e.n;}}};eve.once=function(name,f){var f2=function(){eve.unbind(name,f2);return f.apply(this,arguments);};return eve.on(name,f2);};eve.version=version;eve.toString=function(){return"You are running Eve "+version;};(typeof module!="undefined"&&module.exports)?(module.exports=eve):(typeof define!="undefined"?(define("eve",[],function(){return eve;})):(glob.eve=eve));})(window||this);(function(glob,factory){if(typeof define==="function"&&define.amd){define(["eve"],function(eve){return factory(glob,eve);});}else{factory(glob,glob.eve);}}(this,function(window,eve){function R(first){if(R.is(first,"function")){return loaded?first():eve.on("raphael.DOMload",first);}else if(R.is(first,array)){return R._engine.create[apply](R,first.splice(0,3+R.is(first[0],nu))).add(first);}else{var args=Array.prototype.slice.call(arguments,0);if(R.is(args[args.length-1],"function")){var f=args.pop();return loaded?f.call(R._engine.create[apply](R,args)):eve.on("raphael.DOMload",function(){f.call(R._engine.create[apply](R,args));});}else{return R._engine.create[apply](R,arguments);}}}
R.version="2.1.2";R.eve=eve;var loaded,separator=/[, ]+/,elements={circle:1,rect:1,path:1,ellipse:1,text:1,image:1},formatrg=/\{(\d+)\}/g,proto="prototype",has="hasOwnProperty",g={doc:document,win:window},oldRaphael={was:Object.prototype[has].call(g.win,"Raphael"),is:g.win.Raphael},Paper=function(){this.ca=this.customAttributes={};},paperproto,appendChild="appendChild",apply="apply",concat="concat",supportsTouch=('ontouchstart'in g.win)||g.win.DocumentTouch&&g.doc instanceof DocumentTouch,E="",S=" ",Str=String,split="split",events="click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend touchcancel"[split](S),touchMap={mousedown:"touchstart",mousemove:"touchmove",mouseup:"touchend"},lowerCase=Str.prototype.toLowerCase,math=Math,mmax=math.max,mmin=math.min,abs=math.abs,pow=math.pow,PI=math.PI,nu="number",string="string",array="array",toString="toString",fillString="fill",objectToString=Object.prototype.toString,paper={},push="push",ISURL=R._ISURL=/^url\(['"]?([^\)]+?)['"]?\)$/i,colourRegExp=/^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i,isnan={"NaN":1,"Infinity":1,"-Infinity":1},bezierrg=/^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/,round=math.round,setAttribute="setAttribute",toFloat=parseFloat,toInt=parseInt,upperCase=Str.prototype.toUpperCase,availableAttrs=R._availableAttrs={"arrow-end":"none","arrow-start":"none",blur:0,"clip-rect":"0 0 1e9 1e9",cursor:"default",cx:0,cy:0,fill:"#fff","fill-opacity":1,font:'10px "Arial"',"font-family":'"Arial"',"font-size":"10","font-style":"normal","font-weight":400,gradient:0,height:0,href:"http://raphaeljs.com/","letter-spacing":0,opacity:1,path:"M0,0",r:0,rx:0,ry:0,src:"",stroke:"#000","stroke-dasharray":"","stroke-linecap":"butt","stroke-linejoin":"butt","stroke-miterlimit":0,"stroke-opacity":1,"stroke-width":1,target:"_blank","text-anchor":"middle",title:"Raphael",transform:"",width:0,x:0,y:0},availableAnimAttrs=R._availableAnimAttrs={blur:nu,"clip-rect":"csv",cx:nu,cy:nu,fill:"colour","fill-opacity":nu,"font-size":nu,height:nu,opacity:nu,path:"path",r:nu,rx:nu,ry:nu,stroke:"colour","stroke-opacity":nu,"stroke-width":nu,transform:"transform",width:nu,x:nu,y:nu},whitespace=/[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]/g,commaSpaces=/[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/,hsrg={hs:1,rg:1},p2s=/,?([achlmqrstvxz]),?/gi,pathCommand=/([achlmrqstvz])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/ig,tCommand=/([rstm])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/ig,pathValues=/(-?\d*\.?\d*(?:e[\-+]?\d+)?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/ig,radial_gradient=R._radial_gradient=/^r(?:\(([^,]+?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*([^\)]+?)\))?/,eldata={},sortByKey=function(a,b){return a.key-b.key;},sortByNumber=function(a,b){return toFloat(a)-toFloat(b);},fun=function(){},pipe=function(x){return x;},rectPath=R._rectPath=function(x,y,w,h,r){if(r){return[["M",x+r,y],["l",w-r*2,0],["a",r,r,0,0,1,r,r],["l",0,h-r*2],["a",r,r,0,0,1,-r,r],["l",r*2-w,0],["a",r,r,0,0,1,-r,-r],["l",0,r*2-h],["a",r,r,0,0,1,r,-r],["z"]];}
return[["M",x,y],["l",w,0],["l",0,h],["l",-w,0],["z"]];},ellipsePath=function(x,y,rx,ry){if(ry==null){ry=rx;}
return[["M",x,y],["m",0,-ry],["a",rx,ry,0,1,1,0,2*ry],["a",rx,ry,0,1,1,0,-2*ry],["z"]];},getPath=R._getPath={path:function(el){return el.attr("path");},circle:function(el){var a=el.attrs;return ellipsePath(a.cx,a.cy,a.r);},ellipse:function(el){var a=el.attrs;return ellipsePath(a.cx,a.cy,a.rx,a.ry);},rect:function(el){var a=el.attrs;return rectPath(a.x,a.y,a.width,a.height,a.r);},image:function(el){var a=el.attrs;return rectPath(a.x,a.y,a.width,a.height);},text:function(el){var bbox=el._getBBox();return rectPath(bbox.x,bbox.y,bbox.width,bbox.height);},set:function(el){var bbox=el._getBBox();return rectPath(bbox.x,bbox.y,bbox.width,bbox.height);}},mapPath=R.mapPath=function(path,matrix){if(!matrix){return path;}
var x,y,i,j,ii,jj,pathi;path=path2curve(path);for(i=0,ii=path.length;i<ii;i++){pathi=path[i];for(j=1,jj=pathi.length;j<jj;j+=2){x=matrix.x(pathi[j],pathi[j+1]);y=matrix.y(pathi[j],pathi[j+1]);pathi[j]=x;pathi[j+1]=y;}}
return path;};R._g=g;R.type=(g.win.SVGAngle||g.doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1")?"SVG":"VML");if(R.type=="VML"){var d=g.doc.createElement("div"),b;d.innerHTML='<v:shape adj="1"/>';b=d.firstChild;b.style.behavior="url(#default#VML)";if(!(b&&typeof b.adj=="object")){return(R.type=E);}
d=null;}
R.svg=!(R.vml=R.type=="VML");R._Paper=Paper;R.fn=paperproto=Paper.prototype=R.prototype;R._id=0;R._oid=0;R.is=function(o,type){type=lowerCase.call(type);if(type=="finite"){return!isnan[has](+o);}
if(type=="array"){return o instanceof Array;}
return(type=="null"&&o===null)||(type==typeof o&&o!==null)||(type=="object"&&o===Object(o))||(type=="array"&&Array.isArray&&Array.isArray(o))||objectToString.call(o).slice(8,-1).toLowerCase()==type;};function clone(obj){if(typeof obj=="function"||Object(obj)!==obj){return obj;}
var res=new obj.constructor;for(var key in obj)if(obj[has](key)){res[key]=clone(obj[key]);}
return res;}
R.angle=function(x1,y1,x2,y2,x3,y3){if(x3==null){var x=x1-x2,y=y1-y2;if(!x&&!y){return 0;}
return(180+math.atan2(-y,-x)*180/PI+360)%360;}else{return R.angle(x1,y1,x3,y3)-R.angle(x2,y2,x3,y3);}};R.rad=function(deg){return deg%360*PI/180;};R.deg=function(rad){return rad*180/PI%360;};R.snapTo=function(values,value,tolerance){tolerance=R.is(tolerance,"finite")?tolerance:10;if(R.is(values,array)){var i=values.length;while(i--)if(abs(values[i]-value)<=tolerance){return values[i];}}else{values=+values;var rem=value%values;if(rem<tolerance){return value-rem;}
if(rem>values-tolerance){return value-rem+values;}}
return value;};var createUUID=R.createUUID=(function(uuidRegEx,uuidReplacer){return function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(uuidRegEx,uuidReplacer).toUpperCase();};})(/[xy]/g,function(c){var r=math.random()*16|0,v=c=="x"?r:(r&3|8);return v.toString(16);});R.setWindow=function(newwin){eve("raphael.setWindow",R,g.win,newwin);g.win=newwin;g.doc=g.win.document;if(R._engine.initWin){R._engine.initWin(g.win);}};var toHex=function(color){if(R.vml){var trim=/^\s+|\s+$/g;var bod;try{var docum=new ActiveXObject("htmlfile");docum.write("<body>");docum.close();bod=docum.body;}catch(e){bod=createPopup().document.body;}
var range=bod.createTextRange();toHex=cacher(function(color){try{bod.style.color=Str(color).replace(trim,E);var value=range.queryCommandValue("ForeColor");value=((value&255)<<16)|(value&65280)|((value&16711680)>>>16);return"#"+("000000"+value.toString(16)).slice(-6);}catch(e){return"none";}});}else{var i=g.doc.createElement("i");i.title="Rapha\xebl Colour Picker";i.style.display="none";g.doc.body.appendChild(i);toHex=cacher(function(color){i.style.color=color;return g.doc.defaultView.getComputedStyle(i,E).getPropertyValue("color");});}
return toHex(color);},hsbtoString=function(){return"hsb("+[this.h,this.s,this.b]+")";},hsltoString=function(){return"hsl("+[this.h,this.s,this.l]+")";},rgbtoString=function(){return this.hex;},prepareRGB=function(r,g,b){if(g==null&&R.is(r,"object")&&"r"in r&&"g"in r&&"b"in r){b=r.b;g=r.g;r=r.r;}
if(g==null&&R.is(r,string)){var clr=R.getRGB(r);r=clr.r;g=clr.g;b=clr.b;}
if(r>1||g>1||b>1){r/=255;g/=255;b/=255;}
return[r,g,b];},packageRGB=function(r,g,b,o){r*=255;g*=255;b*=255;var rgb={r:r,g:g,b:b,hex:R.rgb(r,g,b),toString:rgbtoString};R.is(o,"finite")&&(rgb.opacity=o);return rgb;};R.color=function(clr){var rgb;if(R.is(clr,"object")&&"h"in clr&&"s"in clr&&"b"in clr){rgb=R.hsb2rgb(clr);clr.r=rgb.r;clr.g=rgb.g;clr.b=rgb.b;clr.hex=rgb.hex;}else if(R.is(clr,"object")&&"h"in clr&&"s"in clr&&"l"in clr){rgb=R.hsl2rgb(clr);clr.r=rgb.r;clr.g=rgb.g;clr.b=rgb.b;clr.hex=rgb.hex;}else{if(R.is(clr,"string")){clr=R.getRGB(clr);}
if(R.is(clr,"object")&&"r"in clr&&"g"in clr&&"b"in clr){rgb=R.rgb2hsl(clr);clr.h=rgb.h;clr.s=rgb.s;clr.l=rgb.l;rgb=R.rgb2hsb(clr);clr.v=rgb.b;}else{clr={hex:"none"};clr.r=clr.g=clr.b=clr.h=clr.s=clr.v=clr.l=-1;}}
clr.toString=rgbtoString;return clr;};R.hsb2rgb=function(h,s,v,o){if(this.is(h,"object")&&"h"in h&&"s"in h&&"b"in h){v=h.b;s=h.s;h=h.h;o=h.o;}
h*=360;var R,G,B,X,C;h=(h%360)/60;C=v*s;X=C*(1-abs(h%2-1));R=G=B=v-C;h=~~h;R+=[C,X,0,0,X,C][h];G+=[X,C,C,X,0,0][h];B+=[0,0,X,C,C,X][h];return packageRGB(R,G,B,o);};R.hsl2rgb=function(h,s,l,o){if(this.is(h,"object")&&"h"in h&&"s"in h&&"l"in h){l=h.l;s=h.s;h=h.h;}
if(h>1||s>1||l>1){h/=360;s/=100;l/=100;}
h*=360;var R,G,B,X,C;h=(h%360)/60;C=2*s*(l<.5?l:1-l);X=C*(1-abs(h%2-1));R=G=B=l-C/2;h=~~h;R+=[C,X,0,0,X,C][h];G+=[X,C,C,X,0,0][h];B+=[0,0,X,C,C,X][h];return packageRGB(R,G,B,o);};R.rgb2hsb=function(r,g,b){b=prepareRGB(r,g,b);r=b[0];g=b[1];b=b[2];var H,S,V,C;V=mmax(r,g,b);C=V-mmin(r,g,b);H=(C==0?null:V==r?(g-b)/C:V==g?(b-r)/C+2:(r-g)/C+4);H=((H+360)%6)*60/360;S=C==0?0:C/V;return{h:H,s:S,b:V,toString:hsbtoString};};R.rgb2hsl=function(r,g,b){b=prepareRGB(r,g,b);r=b[0];g=b[1];b=b[2];var H,S,L,M,m,C;M=mmax(r,g,b);m=mmin(r,g,b);C=M-m;H=(C==0?null:M==r?(g-b)/C:M==g?(b-r)/C+2:(r-g)/C+4);H=((H+360)%6)*60/360;L=(M+m)/2;S=(C==0?0:L<.5?C/(2*L):C/(2-2*L));return{h:H,s:S,l:L,toString:hsltoString};};R._path2string=function(){return this.join(",").replace(p2s,"$1");};function repush(array,item){for(var i=0,ii=array.length;i<ii;i++)if(array[i]===item){return array.push(array.splice(i,1)[0]);}}
function cacher(f,scope,postprocessor){function newf(){var arg=Array.prototype.slice.call(arguments,0),args=arg.join("\u2400"),cache=newf.cache=newf.cache||{},count=newf.count=newf.count||[];if(cache[has](args)){repush(count,args);return postprocessor?postprocessor(cache[args]):cache[args];}
count.length>=1e3&&delete cache[count.shift()];count.push(args);cache[args]=f[apply](scope,arg);return postprocessor?postprocessor(cache[args]):cache[args];}
return newf;}
var preload=R._preload=function(src,f){var img=g.doc.createElement("img");img.style.cssText="position:absolute;left:-9999em;top:-9999em";img.onload=function(){f.call(this);this.onload=null;g.doc.body.removeChild(this);};img.onerror=function(){g.doc.body.removeChild(this);};g.doc.body.appendChild(img);img.src=src;};function clrToString(){return this.hex;}
R.getRGB=cacher(function(colour){if(!colour||!!((colour=Str(colour)).indexOf("-")+1)){return{r:-1,g:-1,b:-1,hex:"none",error:1,toString:clrToString};}
if(colour=="none"){return{r:-1,g:-1,b:-1,hex:"none",toString:clrToString};}!(hsrg[has](colour.toLowerCase().substring(0,2))||colour.charAt()=="#")&&(colour=toHex(colour));var res,red,green,blue,opacity,t,values,rgb=colour.match(colourRegExp);if(rgb){if(rgb[2]){blue=toInt(rgb[2].substring(5),16);green=toInt(rgb[2].substring(3,5),16);red=toInt(rgb[2].substring(1,3),16);}
if(rgb[3]){blue=toInt((t=rgb[3].charAt(3))+t,16);green=toInt((t=rgb[3].charAt(2))+t,16);red=toInt((t=rgb[3].charAt(1))+t,16);}
if(rgb[4]){values=rgb[4][split](commaSpaces);red=toFloat(values[0]);values[0].slice(-1)=="%"&&(red*=2.55);green=toFloat(values[1]);values[1].slice(-1)=="%"&&(green*=2.55);blue=toFloat(values[2]);values[2].slice(-1)=="%"&&(blue*=2.55);rgb[1].toLowerCase().slice(0,4)=="rgba"&&(opacity=toFloat(values[3]));values[3]&&values[3].slice(-1)=="%"&&(opacity/=100);}
if(rgb[5]){values=rgb[5][split](commaSpaces);red=toFloat(values[0]);values[0].slice(-1)=="%"&&(red*=2.55);green=toFloat(values[1]);values[1].slice(-1)=="%"&&(green*=2.55);blue=toFloat(values[2]);values[2].slice(-1)=="%"&&(blue*=2.55);(values[0].slice(-3)=="deg"||values[0].slice(-1)=="\xb0")&&(red/=360);rgb[1].toLowerCase().slice(0,4)=="hsba"&&(opacity=toFloat(values[3]));values[3]&&values[3].slice(-1)=="%"&&(opacity/=100);return R.hsb2rgb(red,green,blue,opacity);}
if(rgb[6]){values=rgb[6][split](commaSpaces);red=toFloat(values[0]);values[0].slice(-1)=="%"&&(red*=2.55);green=toFloat(values[1]);values[1].slice(-1)=="%"&&(green*=2.55);blue=toFloat(values[2]);values[2].slice(-1)=="%"&&(blue*=2.55);(values[0].slice(-3)=="deg"||values[0].slice(-1)=="\xb0")&&(red/=360);rgb[1].toLowerCase().slice(0,4)=="hsla"&&(opacity=toFloat(values[3]));values[3]&&values[3].slice(-1)=="%"&&(opacity/=100);return R.hsl2rgb(red,green,blue,opacity);}
rgb={r:red,g:green,b:blue,toString:clrToString};rgb.hex="#"+(16777216|blue|(green<<8)|(red<<16)).toString(16).slice(1);R.is(opacity,"finite")&&(rgb.opacity=opacity);return rgb;}
return{r:-1,g:-1,b:-1,hex:"none",error:1,toString:clrToString};},R);R.hsb=cacher(function(h,s,b){return R.hsb2rgb(h,s,b).hex;});R.hsl=cacher(function(h,s,l){return R.hsl2rgb(h,s,l).hex;});R.rgb=cacher(function(r,g,b){return"#"+(16777216|b|(g<<8)|(r<<16)).toString(16).slice(1);});R.getColor=function(value){var start=this.getColor.start=this.getColor.start||{h:0,s:1,b:value||.75},rgb=this.hsb2rgb(start.h,start.s,start.b);start.h+=.075;if(start.h>1){start.h=0;start.s-=.2;start.s<=0&&(this.getColor.start={h:0,s:1,b:start.b});}
return rgb.hex;};R.getColor.reset=function(){delete this.start;};function catmullRom2bezier(crp,z){var d=[];for(var i=0,iLen=crp.length;iLen-2*!z>i;i+=2){var p=[{x:+crp[i-2],y:+crp[i-1]},{x:+crp[i],y:+crp[i+1]},{x:+crp[i+2],y:+crp[i+3]},{x:+crp[i+4],y:+crp[i+5]}];if(z){if(!i){p[0]={x:+crp[iLen-2],y:+crp[iLen-1]};}else if(iLen-4==i){p[3]={x:+crp[0],y:+crp[1]};}else if(iLen-2==i){p[2]={x:+crp[0],y:+crp[1]};p[3]={x:+crp[2],y:+crp[3]};}}else{if(iLen-4==i){p[3]=p[2];}else if(!i){p[0]={x:+crp[i],y:+crp[i+1]};}}
d.push(["C",(-p[0].x+6*p[1].x+p[2].x)/6,(-p[0].y+6*p[1].y+p[2].y)/6,(p[1].x+6*p[2].x-p[3].x)/6,(p[1].y+6*p[2].y-p[3].y)/6,p[2].x,p[2].y]);}
return d;}
R.parsePathString=function(pathString){if(!pathString){return null;}
var pth=paths(pathString);if(pth.arr){return pathClone(pth.arr);}
var paramCounts={a:7,c:6,h:1,l:2,m:2,r:4,q:4,s:4,t:2,v:1,z:0},data=[];if(R.is(pathString,array)&&R.is(pathString[0],array)){data=pathClone(pathString);}
if(!data.length){Str(pathString).replace(pathCommand,function(a,b,c){var params=[],name=b.toLowerCase();c.replace(pathValues,function(a,b){b&&params.push(+b);});if(name=="m"&&params.length>2){data.push([b][concat](params.splice(0,2)));name="l";b=b=="m"?"l":"L";}
if(name=="r"){data.push([b][concat](params));}else while(params.length>=paramCounts[name]){data.push([b][concat](params.splice(0,paramCounts[name])));if(!paramCounts[name]){break;}}});}
data.toString=R._path2string;pth.arr=pathClone(data);return data;};R.parseTransformString=cacher(function(TString){if(!TString){return null;}
var paramCounts={r:3,s:4,t:2,m:6},data=[];if(R.is(TString,array)&&R.is(TString[0],array)){data=pathClone(TString);}
if(!data.length){Str(TString).replace(tCommand,function(a,b,c){var params=[],name=lowerCase.call(b);c.replace(pathValues,function(a,b){b&&params.push(+b);});data.push([b][concat](params));});}
data.toString=R._path2string;return data;});var paths=function(ps){var p=paths.ps=paths.ps||{};if(p[ps]){p[ps].sleep=100;}else{p[ps]={sleep:100};}
setTimeout(function(){for(var key in p)if(p[has](key)&&key!=ps){p[key].sleep--;!p[key].sleep&&delete p[key];}});return p[ps];};R.findDotsAtSegment=function(p1x,p1y,c1x,c1y,c2x,c2y,p2x,p2y,t){var t1=1-t,t13=pow(t1,3),t12=pow(t1,2),t2=t*t,t3=t2*t,x=t13*p1x+t12*3*t*c1x+t1*3*t*t*c2x+t3*p2x,y=t13*p1y+t12*3*t*c1y+t1*3*t*t*c2y+t3*p2y,mx=p1x+2*t*(c1x-p1x)+t2*(c2x-2*c1x+p1x),my=p1y+2*t*(c1y-p1y)+t2*(c2y-2*c1y+p1y),nx=c1x+2*t*(c2x-c1x)+t2*(p2x-2*c2x+c1x),ny=c1y+2*t*(c2y-c1y)+t2*(p2y-2*c2y+c1y),ax=t1*p1x+t*c1x,ay=t1*p1y+t*c1y,cx=t1*c2x+t*p2x,cy=t1*c2y+t*p2y,alpha=(90-math.atan2(mx-nx,my-ny)*180/PI);(mx>nx||my<ny)&&(alpha+=180);return{x:x,y:y,m:{x:mx,y:my},n:{x:nx,y:ny},start:{x:ax,y:ay},end:{x:cx,y:cy},alpha:alpha};};R.bezierBBox=function(p1x,p1y,c1x,c1y,c2x,c2y,p2x,p2y){if(!R.is(p1x,"array")){p1x=[p1x,p1y,c1x,c1y,c2x,c2y,p2x,p2y];}
var bbox=curveDim.apply(null,p1x);return{x:bbox.min.x,y:bbox.min.y,x2:bbox.max.x,y2:bbox.max.y,width:bbox.max.x-bbox.min.x,height:bbox.max.y-bbox.min.y};};R.isPointInsideBBox=function(bbox,x,y){return x>=bbox.x&&x<=bbox.x2&&y>=bbox.y&&y<=bbox.y2;};R.isBBoxIntersect=function(bbox1,bbox2){var i=R.isPointInsideBBox;return i(bbox2,bbox1.x,bbox1.y)||i(bbox2,bbox1.x2,bbox1.y)||i(bbox2,bbox1.x,bbox1.y2)||i(bbox2,bbox1.x2,bbox1.y2)||i(bbox1,bbox2.x,bbox2.y)||i(bbox1,bbox2.x2,bbox2.y)||i(bbox1,bbox2.x,bbox2.y2)||i(bbox1,bbox2.x2,bbox2.y2)||(bbox1.x<bbox2.x2&&bbox1.x>bbox2.x||bbox2.x<bbox1.x2&&bbox2.x>bbox1.x)&&(bbox1.y<bbox2.y2&&bbox1.y>bbox2.y||bbox2.y<bbox1.y2&&bbox2.y>bbox1.y);};function base3(t,p1,p2,p3,p4){var t1=-3*p1+9*p2-9*p3+3*p4,t2=t*t1+6*p1-12*p2+6*p3;return t*t2-3*p1+3*p2;}
function bezlen(x1,y1,x2,y2,x3,y3,x4,y4,z){if(z==null){z=1;}
z=z>1?1:z<0?0:z;var z2=z/2,n=12,Tvalues=[-0.1252,0.1252,-0.3678,0.3678,-0.5873,0.5873,-0.7699,0.7699,-0.9041,0.9041,-0.9816,0.9816],Cvalues=[0.2491,0.2491,0.2335,0.2335,0.2032,0.2032,0.1601,0.1601,0.1069,0.1069,0.0472,0.0472],sum=0;for(var i=0;i<n;i++){var ct=z2*Tvalues[i]+z2,xbase=base3(ct,x1,x2,x3,x4),ybase=base3(ct,y1,y2,y3,y4),comb=xbase*xbase+ybase*ybase;sum+=Cvalues[i]*math.sqrt(comb);}
return z2*sum;}
function getTatLen(x1,y1,x2,y2,x3,y3,x4,y4,ll){if(ll<0||bezlen(x1,y1,x2,y2,x3,y3,x4,y4)<ll){return;}
var t=1,step=t/2,t2=t-step,l,e=.01;l=bezlen(x1,y1,x2,y2,x3,y3,x4,y4,t2);while(abs(l-ll)>e){step/=2;t2+=(l<ll?1:-1)*step;l=bezlen(x1,y1,x2,y2,x3,y3,x4,y4,t2);}
return t2;}
function intersect(x1,y1,x2,y2,x3,y3,x4,y4){if(mmax(x1,x2)<mmin(x3,x4)||mmin(x1,x2)>mmax(x3,x4)||mmax(y1,y2)<mmin(y3,y4)||mmin(y1,y2)>mmax(y3,y4)){return;}
var nx=(x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4),ny=(x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4),denominator=(x1-x2)*(y3-y4)-(y1-y2)*(x3-x4);if(!denominator){return;}
var px=nx/denominator,py=ny/denominator,px2=+px.toFixed(2),py2=+py.toFixed(2);if(px2<+mmin(x1,x2).toFixed(2)||px2>+mmax(x1,x2).toFixed(2)||px2<+mmin(x3,x4).toFixed(2)||px2>+mmax(x3,x4).toFixed(2)||py2<+mmin(y1,y2).toFixed(2)||py2>+mmax(y1,y2).toFixed(2)||py2<+mmin(y3,y4).toFixed(2)||py2>+mmax(y3,y4).toFixed(2)){return;}
return{x:px,y:py};}
function inter(bez1,bez2){return interHelper(bez1,bez2);}
function interCount(bez1,bez2){return interHelper(bez1,bez2,1);}
function interHelper(bez1,bez2,justCount){var bbox1=R.bezierBBox(bez1),bbox2=R.bezierBBox(bez2);if(!R.isBBoxIntersect(bbox1,bbox2)){return justCount?0:[];}
var l1=bezlen.apply(0,bez1),l2=bezlen.apply(0,bez2),n1=mmax(~~(l1/5),1),n2=mmax(~~(l2/5),1),dots1=[],dots2=[],xy={},res=justCount?0:[];for(var i=0;i<n1+1;i++){var p=R.findDotsAtSegment.apply(R,bez1.concat(i/n1));dots1.push({x:p.x,y:p.y,t:i/n1});}
for(i=0;i<n2+1;i++){p=R.findDotsAtSegment.apply(R,bez2.concat(i/n2));dots2.push({x:p.x,y:p.y,t:i/n2});}
for(i=0;i<n1;i++){for(var j=0;j<n2;j++){var di=dots1[i],di1=dots1[i+1],dj=dots2[j],dj1=dots2[j+1],ci=abs(di1.x-di.x)<.001?"y":"x",cj=abs(dj1.x-dj.x)<.001?"y":"x",is=intersect(di.x,di.y,di1.x,di1.y,dj.x,dj.y,dj1.x,dj1.y);if(is){if(xy[is.x.toFixed(4)]==is.y.toFixed(4)){continue;}
xy[is.x.toFixed(4)]=is.y.toFixed(4);var t1=di.t+abs((is[ci]-di[ci])/(di1[ci]-di[ci]))*(di1.t-di.t),t2=dj.t+abs((is[cj]-dj[cj])/(dj1[cj]-dj[cj]))*(dj1.t-dj.t);if(t1>=0&&t1<=1.001&&t2>=0&&t2<=1.001){if(justCount){res++;}else{res.push({x:is.x,y:is.y,t1:mmin(t1,1),t2:mmin(t2,1)});}}}}}
return res;}
R.pathIntersection=function(path1,path2){return interPathHelper(path1,path2);};R.pathIntersectionNumber=function(path1,path2){return interPathHelper(path1,path2,1);};function interPathHelper(path1,path2,justCount){path1=R._path2curve(path1);path2=R._path2curve(path2);var x1,y1,x2,y2,x1m,y1m,x2m,y2m,bez1,bez2,res=justCount?0:[];for(var i=0,ii=path1.length;i<ii;i++){var pi=path1[i];if(pi[0]=="M"){x1=x1m=pi[1];y1=y1m=pi[2];}else{if(pi[0]=="C"){bez1=[x1,y1].concat(pi.slice(1));x1=bez1[6];y1=bez1[7];}else{bez1=[x1,y1,x1,y1,x1m,y1m,x1m,y1m];x1=x1m;y1=y1m;}
for(var j=0,jj=path2.length;j<jj;j++){var pj=path2[j];if(pj[0]=="M"){x2=x2m=pj[1];y2=y2m=pj[2];}else{if(pj[0]=="C"){bez2=[x2,y2].concat(pj.slice(1));x2=bez2[6];y2=bez2[7];}else{bez2=[x2,y2,x2,y2,x2m,y2m,x2m,y2m];x2=x2m;y2=y2m;}
var intr=interHelper(bez1,bez2,justCount);if(justCount){res+=intr;}else{for(var k=0,kk=intr.length;k<kk;k++){intr[k].segment1=i;intr[k].segment2=j;intr[k].bez1=bez1;intr[k].bez2=bez2;}
res=res.concat(intr);}}}}}
return res;}
R.isPointInsidePath=function(path,x,y){var bbox=R.pathBBox(path);return R.isPointInsideBBox(bbox,x,y)&&interPathHelper(path,[["M",x,y],["H",bbox.x2+10]],1)%2==1;};R._removedFactory=function(methodname){return function(){eve("raphael.log",null,"Rapha\xebl: you are calling to method \u201c"+methodname+"\u201d of removed object",methodname);};};var pathDimensions=R.pathBBox=function(path){var pth=paths(path);if(pth.bbox){return clone(pth.bbox);}
if(!path){return{x:0,y:0,width:0,height:0,x2:0,y2:0};}
path=path2curve(path);var x=0,y=0,X=[],Y=[],p;for(var i=0,ii=path.length;i<ii;i++){p=path[i];if(p[0]=="M"){x=p[1];y=p[2];X.push(x);Y.push(y);}else{var dim=curveDim(x,y,p[1],p[2],p[3],p[4],p[5],p[6]);X=X[concat](dim.min.x,dim.max.x);Y=Y[concat](dim.min.y,dim.max.y);x=p[5];y=p[6];}}
var xmin=mmin[apply](0,X),ymin=mmin[apply](0,Y),xmax=mmax[apply](0,X),ymax=mmax[apply](0,Y),width=xmax-xmin,height=ymax-ymin,bb={x:xmin,y:ymin,x2:xmax,y2:ymax,width:width,height:height,cx:xmin+width/2,cy:ymin+height/2};pth.bbox=clone(bb);return bb;},pathClone=function(pathArray){var res=clone(pathArray);res.toString=R._path2string;return res;},pathToRelative=R._pathToRelative=function(pathArray){var pth=paths(pathArray);if(pth.rel){return pathClone(pth.rel);}
if(!R.is(pathArray,array)||!R.is(pathArray&&pathArray[0],array)){pathArray=R.parsePathString(pathArray);}
var res=[],x=0,y=0,mx=0,my=0,start=0;if(pathArray[0][0]=="M"){x=pathArray[0][1];y=pathArray[0][2];mx=x;my=y;start++;res.push(["M",x,y]);}
for(var i=start,ii=pathArray.length;i<ii;i++){var r=res[i]=[],pa=pathArray[i];if(pa[0]!=lowerCase.call(pa[0])){r[0]=lowerCase.call(pa[0]);switch(r[0]){case"a":r[1]=pa[1];r[2]=pa[2];r[3]=pa[3];r[4]=pa[4];r[5]=pa[5];r[6]=+(pa[6]-x).toFixed(3);r[7]=+(pa[7]-y).toFixed(3);break;case"v":r[1]=+(pa[1]-y).toFixed(3);break;case"m":mx=pa[1];my=pa[2];default:for(var j=1,jj=pa.length;j<jj;j++){r[j]=+(pa[j]-((j%2)?x:y)).toFixed(3);}}}else{r=res[i]=[];if(pa[0]=="m"){mx=pa[1]+x;my=pa[2]+y;}
for(var k=0,kk=pa.length;k<kk;k++){res[i][k]=pa[k];}}
var len=res[i].length;switch(res[i][0]){case"z":x=mx;y=my;break;case"h":x+=+res[i][len-1];break;case"v":y+=+res[i][len-1];break;default:x+=+res[i][len-2];y+=+res[i][len-1];}}
res.toString=R._path2string;pth.rel=pathClone(res);return res;},pathToAbsolute=R._pathToAbsolute=function(pathArray){var pth=paths(pathArray);if(pth.abs){return pathClone(pth.abs);}
if(!R.is(pathArray,array)||!R.is(pathArray&&pathArray[0],array)){pathArray=R.parsePathString(pathArray);}
if(!pathArray||!pathArray.length){return[["M",0,0]];}
var res=[],x=0,y=0,mx=0,my=0,start=0;if(pathArray[0][0]=="M"){x=+pathArray[0][1];y=+pathArray[0][2];mx=x;my=y;start++;res[0]=["M",x,y];}
var crz=pathArray.length==3&&pathArray[0][0]=="M"&&pathArray[1][0].toUpperCase()=="R"&&pathArray[2][0].toUpperCase()=="Z";for(var r,pa,i=start,ii=pathArray.length;i<ii;i++){res.push(r=[]);pa=pathArray[i];if(pa[0]!=upperCase.call(pa[0])){r[0]=upperCase.call(pa[0]);switch(r[0]){case"A":r[1]=pa[1];r[2]=pa[2];r[3]=pa[3];r[4]=pa[4];r[5]=pa[5];r[6]=+(pa[6]+x);r[7]=+(pa[7]+y);break;case"V":r[1]=+pa[1]+y;break;case"H":r[1]=+pa[1]+x;break;case"R":var dots=[x,y][concat](pa.slice(1));for(var j=2,jj=dots.length;j<jj;j++){dots[j]=+dots[j]+x;dots[++j]=+dots[j]+y;}
res.pop();res=res[concat](catmullRom2bezier(dots,crz));break;case"M":mx=+pa[1]+x;my=+pa[2]+y;default:for(j=1,jj=pa.length;j<jj;j++){r[j]=+pa[j]+((j%2)?x:y);}}}else if(pa[0]=="R"){dots=[x,y][concat](pa.slice(1));res.pop();res=res[concat](catmullRom2bezier(dots,crz));r=["R"][concat](pa.slice(-2));}else{for(var k=0,kk=pa.length;k<kk;k++){r[k]=pa[k];}}
switch(r[0]){case"Z":x=mx;y=my;break;case"H":x=r[1];break;case"V":y=r[1];break;case"M":mx=r[r.length-2];my=r[r.length-1];default:x=r[r.length-2];y=r[r.length-1];}}
res.toString=R._path2string;pth.abs=pathClone(res);return res;},l2c=function(x1,y1,x2,y2){return[x1,y1,x2,y2,x2,y2];},q2c=function(x1,y1,ax,ay,x2,y2){var _13=1/3,_23=2/3;return[_13*x1+_23*ax,_13*y1+_23*ay,_13*x2+_23*ax,_13*y2+_23*ay,x2,y2];},a2c=function(x1,y1,rx,ry,angle,large_arc_flag,sweep_flag,x2,y2,recursive){var _120=PI*120/180,rad=PI/180*(+angle||0),res=[],xy,rotate=cacher(function(x,y,rad){var X=x*math.cos(rad)-y*math.sin(rad),Y=x*math.sin(rad)+y*math.cos(rad);return{x:X,y:Y};});if(!recursive){xy=rotate(x1,y1,-rad);x1=xy.x;y1=xy.y;xy=rotate(x2,y2,-rad);x2=xy.x;y2=xy.y;var cos=math.cos(PI/180*angle),sin=math.sin(PI/180*angle),x=(x1-x2)/2,y=(y1-y2)/2;var h=(x*x)/(rx*rx)+(y*y)/(ry*ry);if(h>1){h=math.sqrt(h);rx=h*rx;ry=h*ry;}
var rx2=rx*rx,ry2=ry*ry,k=(large_arc_flag==sweep_flag?-1:1)*math.sqrt(abs((rx2*ry2-rx2*y*y-ry2*x*x)/(rx2*y*y+ry2*x*x))),cx=k*rx*y/ry+(x1+x2)/2,cy=k*-ry*x/rx+(y1+y2)/2,f1=math.asin(((y1-cy)/ry).toFixed(9)),f2=math.asin(((y2-cy)/ry).toFixed(9));f1=x1<cx?PI-f1:f1;f2=x2<cx?PI-f2:f2;f1<0&&(f1=PI*2+f1);f2<0&&(f2=PI*2+f2);if(sweep_flag&&f1>f2){f1=f1-PI*2;}
if(!sweep_flag&&f2>f1){f2=f2-PI*2;}}else{f1=recursive[0];f2=recursive[1];cx=recursive[2];cy=recursive[3];}
var df=f2-f1;if(abs(df)>_120){var f2old=f2,x2old=x2,y2old=y2;f2=f1+_120*(sweep_flag&&f2>f1?1:-1);x2=cx+rx*math.cos(f2);y2=cy+ry*math.sin(f2);res=a2c(x2,y2,rx,ry,angle,0,sweep_flag,x2old,y2old,[f2,f2old,cx,cy]);}
df=f2-f1;var c1=math.cos(f1),s1=math.sin(f1),c2=math.cos(f2),s2=math.sin(f2),t=math.tan(df/4),hx=4/3*rx*t,hy=4/3*ry*t,m1=[x1,y1],m2=[x1+hx*s1,y1-hy*c1],m3=[x2+hx*s2,y2-hy*c2],m4=[x2,y2];m2[0]=2*m1[0]-m2[0];m2[1]=2*m1[1]-m2[1];if(recursive){return[m2,m3,m4][concat](res);}else{res=[m2,m3,m4][concat](res).join()[split](",");var newres=[];for(var i=0,ii=res.length;i<ii;i++){newres[i]=i%2?rotate(res[i-1],res[i],rad).y:rotate(res[i],res[i+1],rad).x;}
return newres;}},findDotAtSegment=function(p1x,p1y,c1x,c1y,c2x,c2y,p2x,p2y,t){var t1=1-t;return{x:pow(t1,3)*p1x+pow(t1,2)*3*t*c1x+t1*3*t*t*c2x+pow(t,3)*p2x,y:pow(t1,3)*p1y+pow(t1,2)*3*t*c1y+t1*3*t*t*c2y+pow(t,3)*p2y};},curveDim=cacher(function(p1x,p1y,c1x,c1y,c2x,c2y,p2x,p2y){var a=(c2x-2*c1x+p1x)-(p2x-2*c2x+c1x),b=2*(c1x-p1x)-2*(c2x-c1x),c=p1x-c1x,t1=(-b+math.sqrt(b*b-4*a*c))/2/a,t2=(-b-math.sqrt(b*b-4*a*c))/2/a,y=[p1y,p2y],x=[p1x,p2x],dot;abs(t1)>"1e12"&&(t1=.5);abs(t2)>"1e12"&&(t2=.5);if(t1>0&&t1<1){dot=findDotAtSegment(p1x,p1y,c1x,c1y,c2x,c2y,p2x,p2y,t1);x.push(dot.x);y.push(dot.y);}
if(t2>0&&t2<1){dot=findDotAtSegment(p1x,p1y,c1x,c1y,c2x,c2y,p2x,p2y,t2);x.push(dot.x);y.push(dot.y);}
a=(c2y-2*c1y+p1y)-(p2y-2*c2y+c1y);b=2*(c1y-p1y)-2*(c2y-c1y);c=p1y-c1y;t1=(-b+math.sqrt(b*b-4*a*c))/2/a;t2=(-b-math.sqrt(b*b-4*a*c))/2/a;abs(t1)>"1e12"&&(t1=.5);abs(t2)>"1e12"&&(t2=.5);if(t1>0&&t1<1){dot=findDotAtSegment(p1x,p1y,c1x,c1y,c2x,c2y,p2x,p2y,t1);x.push(dot.x);y.push(dot.y);}
if(t2>0&&t2<1){dot=findDotAtSegment(p1x,p1y,c1x,c1y,c2x,c2y,p2x,p2y,t2);x.push(dot.x);y.push(dot.y);}
return{min:{x:mmin[apply](0,x),y:mmin[apply](0,y)},max:{x:mmax[apply](0,x),y:mmax[apply](0,y)}};}),path2curve=R._path2curve=cacher(function(path,path2){var pth=!path2&&paths(path);if(!path2&&pth.curve){return pathClone(pth.curve);}
var p=pathToAbsolute(path),p2=path2&&pathToAbsolute(path2),attrs={x:0,y:0,bx:0,by:0,X:0,Y:0,qx:null,qy:null},attrs2={x:0,y:0,bx:0,by:0,X:0,Y:0,qx:null,qy:null},processPath=function(path,d,pcom){var nx,ny,tq={T:1,Q:1};if(!path){return["C",d.x,d.y,d.x,d.y,d.x,d.y];}!(path[0]in tq)&&(d.qx=d.qy=null);switch(path[0]){case"M":d.X=path[1];d.Y=path[2];break;case"A":path=["C"][concat](a2c[apply](0,[d.x,d.y][concat](path.slice(1))));break;case"S":if(pcom=="C"||pcom=="S"){nx=d.x*2-d.bx;ny=d.y*2-d.by;}
else{nx=d.x;ny=d.y;}
path=["C",nx,ny][concat](path.slice(1));break;case"T":if(pcom=="Q"||pcom=="T"){d.qx=d.x*2-d.qx;d.qy=d.y*2-d.qy;}
else{d.qx=d.x;d.qy=d.y;}
path=["C"][concat](q2c(d.x,d.y,d.qx,d.qy,path[1],path[2]));break;case"Q":d.qx=path[1];d.qy=path[2];path=["C"][concat](q2c(d.x,d.y,path[1],path[2],path[3],path[4]));break;case"L":path=["C"][concat](l2c(d.x,d.y,path[1],path[2]));break;case"H":path=["C"][concat](l2c(d.x,d.y,path[1],d.y));break;case"V":path=["C"][concat](l2c(d.x,d.y,d.x,path[1]));break;case"Z":path=["C"][concat](l2c(d.x,d.y,d.X,d.Y));break;}
return path;},fixArc=function(pp,i){if(pp[i].length>7){pp[i].shift();var pi=pp[i];while(pi.length){pp.splice(i++,0,["C"][concat](pi.splice(0,6)));}
pp.splice(i,1);ii=mmax(p.length,p2&&p2.length||0);}},fixM=function(path1,path2,a1,a2,i){if(path1&&path2&&path1[i][0]=="M"&&path2[i][0]!="M"){path2.splice(i,0,["M",a2.x,a2.y]);a1.bx=0;a1.by=0;a1.x=path1[i][1];a1.y=path1[i][2];ii=mmax(p.length,p2&&p2.length||0);}};for(var i=0,ii=mmax(p.length,p2&&p2.length||0);i<ii;i++){p[i]=processPath(p[i],attrs);fixArc(p,i);p2&&(p2[i]=processPath(p2[i],attrs2));p2&&fixArc(p2,i);fixM(p,p2,attrs,attrs2,i);fixM(p2,p,attrs2,attrs,i);var seg=p[i],seg2=p2&&p2[i],seglen=seg.length,seg2len=p2&&seg2.length;attrs.x=seg[seglen-2];attrs.y=seg[seglen-1];attrs.bx=toFloat(seg[seglen-4])||attrs.x;attrs.by=toFloat(seg[seglen-3])||attrs.y;attrs2.bx=p2&&(toFloat(seg2[seg2len-4])||attrs2.x);attrs2.by=p2&&(toFloat(seg2[seg2len-3])||attrs2.y);attrs2.x=p2&&seg2[seg2len-2];attrs2.y=p2&&seg2[seg2len-1];}
if(!p2){pth.curve=pathClone(p);}
return p2?[p,p2]:p;},null,pathClone),parseDots=R._parseDots=cacher(function(gradient){var dots=[];for(var i=0,ii=gradient.length;i<ii;i++){var dot={},par=gradient[i].match(/^([^:]*):?([\d\.]*)/);dot.color=R.getRGB(par[1]);if(dot.color.error){return null;}
dot.color=dot.color.hex;par[2]&&(dot.offset=par[2]+"%");dots.push(dot);}
for(i=1,ii=dots.length-1;i<ii;i++){if(!dots[i].offset){var start=toFloat(dots[i-1].offset||0),end=0;for(var j=i+1;j<ii;j++){if(dots[j].offset){end=dots[j].offset;break;}}
if(!end){end=100;j=ii;}
end=toFloat(end);var d=(end-start)/(j-i+1);for(;i<j;i++){start+=d;dots[i].offset=start+"%";}}}
return dots;}),tear=R._tear=function(el,paper){el==paper.top&&(paper.top=el.prev);el==paper.bottom&&(paper.bottom=el.next);el.next&&(el.next.prev=el.prev);el.prev&&(el.prev.next=el.next);},tofront=R._tofront=function(el,paper){if(paper.top===el){return;}
tear(el,paper);el.next=null;el.prev=paper.top;paper.top.next=el;paper.top=el;},toback=R._toback=function(el,paper){if(paper.bottom===el){return;}
tear(el,paper);el.next=paper.bottom;el.prev=null;paper.bottom.prev=el;paper.bottom=el;},insertafter=R._insertafter=function(el,el2,paper){tear(el,paper);el2==paper.top&&(paper.top=el);el2.next&&(el2.next.prev=el);el.next=el2.next;el.prev=el2;el2.next=el;},insertbefore=R._insertbefore=function(el,el2,paper){tear(el,paper);el2==paper.bottom&&(paper.bottom=el);el2.prev&&(el2.prev.next=el);el.prev=el2.prev;el2.prev=el;el.next=el2;},toMatrix=R.toMatrix=function(path,transform){var bb=pathDimensions(path),el={_:{transform:E},getBBox:function(){return bb;}};extractTransform(el,transform);return el.matrix;},transformPath=R.transformPath=function(path,transform){return mapPath(path,toMatrix(path,transform));},extractTransform=R._extractTransform=function(el,tstr){if(tstr==null){return el._.transform;}
tstr=Str(tstr).replace(/\.{3}|\u2026/g,el._.transform||E);var tdata=R.parseTransformString(tstr),deg=0,dx=0,dy=0,sx=1,sy=1,_=el._,m=new Matrix;_.transform=tdata||[];if(tdata){for(var i=0,ii=tdata.length;i<ii;i++){var t=tdata[i],tlen=t.length,command=Str(t[0]).toLowerCase(),absolute=t[0]!=command,inver=absolute?m.invert():0,x1,y1,x2,y2,bb;if(command=="t"&&tlen==3){if(absolute){x1=inver.x(0,0);y1=inver.y(0,0);x2=inver.x(t[1],t[2]);y2=inver.y(t[1],t[2]);m.translate(x2-x1,y2-y1);}else{m.translate(t[1],t[2]);}}else if(command=="r"){if(tlen==2){bb=bb||el.getBBox(1);m.rotate(t[1],bb.x+bb.width/2,bb.y+bb.height/2);deg+=t[1];}else if(tlen==4){if(absolute){x2=inver.x(t[2],t[3]);y2=inver.y(t[2],t[3]);m.rotate(t[1],x2,y2);}else{m.rotate(t[1],t[2],t[3]);}
deg+=t[1];}}else if(command=="s"){if(tlen==2||tlen==3){bb=bb||el.getBBox(1);m.scale(t[1],t[tlen-1],bb.x+bb.width/2,bb.y+bb.height/2);sx*=t[1];sy*=t[tlen-1];}else if(tlen==5){if(absolute){x2=inver.x(t[3],t[4]);y2=inver.y(t[3],t[4]);m.scale(t[1],t[2],x2,y2);}else{m.scale(t[1],t[2],t[3],t[4]);}
sx*=t[1];sy*=t[2];}}else if(command=="m"&&tlen==7){m.add(t[1],t[2],t[3],t[4],t[5],t[6]);}
_.dirtyT=1;el.matrix=m;}}
el.matrix=m;_.sx=sx;_.sy=sy;_.deg=deg;_.dx=dx=m.e;_.dy=dy=m.f;if(sx==1&&sy==1&&!deg&&_.bbox){_.bbox.x+=+dx;_.bbox.y+=+dy;}else{_.dirtyT=1;}},getEmpty=function(item){var l=item[0];switch(l.toLowerCase()){case"t":return[l,0,0];case"m":return[l,1,0,0,1,0,0];case"r":if(item.length==4){return[l,0,item[2],item[3]];}else{return[l,0];}
case"s":if(item.length==5){return[l,1,1,item[3],item[4]];}else if(item.length==3){return[l,1,1];}else{return[l,1];}}},equaliseTransform=R._equaliseTransform=function(t1,t2){t2=Str(t2).replace(/\.{3}|\u2026/g,t1);t1=R.parseTransformString(t1)||[];t2=R.parseTransformString(t2)||[];var maxlength=mmax(t1.length,t2.length),from=[],to=[],i=0,j,jj,tt1,tt2;for(;i<maxlength;i++){tt1=t1[i]||getEmpty(t2[i]);tt2=t2[i]||getEmpty(tt1);if((tt1[0]!=tt2[0])||(tt1[0].toLowerCase()=="r"&&(tt1[2]!=tt2[2]||tt1[3]!=tt2[3]))||(tt1[0].toLowerCase()=="s"&&(tt1[3]!=tt2[3]||tt1[4]!=tt2[4]))){return;}
from[i]=[];to[i]=[];for(j=0,jj=mmax(tt1.length,tt2.length);j<jj;j++){j in tt1&&(from[i][j]=tt1[j]);j in tt2&&(to[i][j]=tt2[j]);}}
return{from:from,to:to};};R._getContainer=function(x,y,w,h){var container;container=h==null&&!R.is(x,"object")?g.doc.getElementById(x):x;if(container==null){return;}
if(container.tagName){if(y==null){return{container:container,width:container.style.pixelWidth||container.offsetWidth,height:container.style.pixelHeight||container.offsetHeight};}else{return{container:container,width:y,height:w};}}
return{container:1,x:x,y:y,width:w,height:h};};R.pathToRelative=pathToRelative;R._engine={};R.path2curve=path2curve;R.matrix=function(a,b,c,d,e,f){return new Matrix(a,b,c,d,e,f);};function Matrix(a,b,c,d,e,f){if(a!=null){this.a=+a;this.b=+b;this.c=+c;this.d=+d;this.e=+e;this.f=+f;}else{this.a=1;this.b=0;this.c=0;this.d=1;this.e=0;this.f=0;}}
(function(matrixproto){matrixproto.add=function(a,b,c,d,e,f){var out=[[],[],[]],m=[[this.a,this.c,this.e],[this.b,this.d,this.f],[0,0,1]],matrix=[[a,c,e],[b,d,f],[0,0,1]],x,y,z,res;if(a&&a instanceof Matrix){matrix=[[a.a,a.c,a.e],[a.b,a.d,a.f],[0,0,1]];}
for(x=0;x<3;x++){for(y=0;y<3;y++){res=0;for(z=0;z<3;z++){res+=m[x][z]*matrix[z][y];}
out[x][y]=res;}}
this.a=out[0][0];this.b=out[1][0];this.c=out[0][1];this.d=out[1][1];this.e=out[0][2];this.f=out[1][2];};matrixproto.invert=function(){var me=this,x=me.a*me.d-me.b*me.c;return new Matrix(me.d/x,-me.b/x,-me.c/x,me.a/x,(me.c*me.f-me.d*me.e)/x,(me.b*me.e-me.a*me.f)/x);};matrixproto.clone=function(){return new Matrix(this.a,this.b,this.c,this.d,this.e,this.f);};matrixproto.translate=function(x,y){this.add(1,0,0,1,x,y);};matrixproto.scale=function(x,y,cx,cy){y==null&&(y=x);(cx||cy)&&this.add(1,0,0,1,cx,cy);this.add(x,0,0,y,0,0);(cx||cy)&&this.add(1,0,0,1,-cx,-cy);};matrixproto.rotate=function(a,x,y){a=R.rad(a);x=x||0;y=y||0;var cos=+math.cos(a).toFixed(9),sin=+math.sin(a).toFixed(9);this.add(cos,sin,-sin,cos,x,y);this.add(1,0,0,1,-x,-y);};matrixproto.x=function(x,y){return x*this.a+y*this.c+this.e;};matrixproto.y=function(x,y){return x*this.b+y*this.d+this.f;};matrixproto.get=function(i){return+this[Str.fromCharCode(97+i)].toFixed(4);};matrixproto.toString=function(){return R.svg?"matrix("+[this.get(0),this.get(1),this.get(2),this.get(3),this.get(4),this.get(5)].join()+")":[this.get(0),this.get(2),this.get(1),this.get(3),0,0].join();};matrixproto.toFilter=function(){return"progid:DXImageTransform.Microsoft.Matrix(M11="+this.get(0)+", M12="+this.get(2)+", M21="+this.get(1)+", M22="+this.get(3)+", Dx="+this.get(4)+", Dy="+this.get(5)+", sizingmethod='auto expand')";};matrixproto.offset=function(){return[this.e.toFixed(4),this.f.toFixed(4)];};function norm(a){return a[0]*a[0]+a[1]*a[1];}
function normalize(a){var mag=math.sqrt(norm(a));a[0]&&(a[0]/=mag);a[1]&&(a[1]/=mag);}
matrixproto.split=function(){var out={};out.dx=this.e;out.dy=this.f;var row=[[this.a,this.c],[this.b,this.d]];out.scalex=math.sqrt(norm(row[0]));normalize(row[0]);out.shear=row[0][0]*row[1][0]+row[0][1]*row[1][1];row[1]=[row[1][0]-row[0][0]*out.shear,row[1][1]-row[0][1]*out.shear];out.scaley=math.sqrt(norm(row[1]));normalize(row[1]);out.shear/=out.scaley;var sin=-row[0][1],cos=row[1][1];if(cos<0){out.rotate=R.deg(math.acos(cos));if(sin<0){out.rotate=360-out.rotate;}}else{out.rotate=R.deg(math.asin(sin));}
out.isSimple=!+out.shear.toFixed(9)&&(out.scalex.toFixed(9)==out.scaley.toFixed(9)||!out.rotate);out.isSuperSimple=!+out.shear.toFixed(9)&&out.scalex.toFixed(9)==out.scaley.toFixed(9)&&!out.rotate;out.noRotation=!+out.shear.toFixed(9)&&!out.rotate;return out;};matrixproto.toTransformString=function(shorter){var s=shorter||this[split]();if(s.isSimple){s.scalex=+s.scalex.toFixed(4);s.scaley=+s.scaley.toFixed(4);s.rotate=+s.rotate.toFixed(4);return(s.dx||s.dy?"t"+[s.dx,s.dy]:E)+
(s.scalex!=1||s.scaley!=1?"s"+[s.scalex,s.scaley,0,0]:E)+
(s.rotate?"r"+[s.rotate,0,0]:E);}else{return"m"+[this.get(0),this.get(1),this.get(2),this.get(3),this.get(4),this.get(5)];}};})(Matrix.prototype);var version=navigator.userAgent.match(/Version\/(.*?)\s/)||navigator.userAgent.match(/Chrome\/(\d+)/);if((navigator.vendor=="Apple Computer, Inc.")&&(version&&version[1]<4||navigator.platform.slice(0,2)=="iP")||(navigator.vendor=="Google Inc."&&version&&version[1]<8)){paperproto.safari=function(){var rect=this.rect(-99,-99,this.width+99,this.height+99).attr({stroke:"none"});setTimeout(function(){rect.remove();});};}else{paperproto.safari=fun;}
var preventDefault=function(){this.returnValue=false;},preventTouch=function(){return this.originalEvent.preventDefault();},stopPropagation=function(){this.cancelBubble=true;},stopTouch=function(){return this.originalEvent.stopPropagation();},getEventPosition=function(e){var scrollY=g.doc.documentElement.scrollTop||g.doc.body.scrollTop,scrollX=g.doc.documentElement.scrollLeft||g.doc.body.scrollLeft;return{x:e.clientX+scrollX,y:e.clientY+scrollY};},addEvent=(function(){if(g.doc.addEventListener){return function(obj,type,fn,element){var f=function(e){var pos=getEventPosition(e);return fn.call(element,e,pos.x,pos.y);};obj.addEventListener(type,f,false);if(supportsTouch&&touchMap[type]){var _f=function(e){var pos=getEventPosition(e),olde=e;for(var i=0,ii=e.targetTouches&&e.targetTouches.length;i<ii;i++){if(e.targetTouches[i].target==obj){e=e.targetTouches[i];e.originalEvent=olde;e.preventDefault=preventTouch;e.stopPropagation=stopTouch;break;}}
return fn.call(element,e,pos.x,pos.y);};obj.addEventListener(touchMap[type],_f,false);}
return function(){obj.removeEventListener(type,f,false);if(supportsTouch&&touchMap[type])
obj.removeEventListener(touchMap[type],f,false);return true;};};}else if(g.doc.attachEvent){return function(obj,type,fn,element){var f=function(e){e=e||g.win.event;var scrollY=g.doc.documentElement.scrollTop||g.doc.body.scrollTop,scrollX=g.doc.documentElement.scrollLeft||g.doc.body.scrollLeft,x=e.clientX+scrollX,y=e.clientY+scrollY;e.preventDefault=e.preventDefault||preventDefault;e.stopPropagation=e.stopPropagation||stopPropagation;return fn.call(element,e,x,y);};obj.attachEvent("on"+type,f);var detacher=function(){obj.detachEvent("on"+type,f);return true;};return detacher;};}})(),drag=[],dragMove=function(e){var x=e.clientX,y=e.clientY,scrollY=g.doc.documentElement.scrollTop||g.doc.body.scrollTop,scrollX=g.doc.documentElement.scrollLeft||g.doc.body.scrollLeft,dragi,j=drag.length;while(j--){dragi=drag[j];if(supportsTouch&&e.touches){var i=e.touches.length,touch;while(i--){touch=e.touches[i];if(touch.identifier==dragi.el._drag.id){x=touch.clientX;y=touch.clientY;(e.originalEvent?e.originalEvent:e).preventDefault();break;}}}else{e.preventDefault();}
var node=dragi.el.node,o,next=node.nextSibling,parent=node.parentNode,display=node.style.display;g.win.opera&&parent.removeChild(node);node.style.display="none";o=dragi.el.paper.getElementByPoint(x,y);node.style.display=display;g.win.opera&&(next?parent.insertBefore(node,next):parent.appendChild(node));o&&eve("raphael.drag.over."+dragi.el.id,dragi.el,o);x+=scrollX;y+=scrollY;eve("raphael.drag.move."+dragi.el.id,dragi.move_scope||dragi.el,x-dragi.el._drag.x,y-dragi.el._drag.y,x,y,e);}},dragUp=function(e){R.unmousemove(dragMove).unmouseup(dragUp);var i=drag.length,dragi;while(i--){dragi=drag[i];dragi.el._drag={};eve("raphael.drag.end."+dragi.el.id,dragi.end_scope||dragi.start_scope||dragi.move_scope||dragi.el,e);}
drag=[];},elproto=R.el={};for(var i=events.length;i--;){(function(eventName){R[eventName]=elproto[eventName]=function(fn,scope){if(R.is(fn,"function")){this.events=this.events||[];this.events.push({name:eventName,f:fn,unbind:addEvent(this.shape||this.node||g.doc,eventName,fn,scope||this)});}
return this;};R["un"+eventName]=elproto["un"+eventName]=function(fn){var events=this.events||[],l=events.length;while(l--){if(events[l].name==eventName&&(R.is(fn,"undefined")||events[l].f==fn)){events[l].unbind();events.splice(l,1);!events.length&&delete this.events;}}
return this;};})(events[i]);}
elproto.data=function(key,value){var data=eldata[this.id]=eldata[this.id]||{};if(arguments.length==0){return data;}
if(arguments.length==1){if(R.is(key,"object")){for(var i in key)if(key[has](i)){this.data(i,key[i]);}
return this;}
eve("raphael.data.get."+this.id,this,data[key],key);return data[key];}
data[key]=value;eve("raphael.data.set."+this.id,this,value,key);return this;};elproto.removeData=function(key){if(key==null){eldata[this.id]={};}else{eldata[this.id]&&delete eldata[this.id][key];}
return this;};elproto.getData=function(){return clone(eldata[this.id]||{});};elproto.hover=function(f_in,f_out,scope_in,scope_out){return this.mouseover(f_in,scope_in).mouseout(f_out,scope_out||scope_in);};elproto.unhover=function(f_in,f_out){return this.unmouseover(f_in).unmouseout(f_out);};var draggable=[];elproto.drag=function(onmove,onstart,onend,move_scope,start_scope,end_scope){function start(e){(e.originalEvent||e).preventDefault();var x=e.clientX,y=e.clientY,scrollY=g.doc.documentElement.scrollTop||g.doc.body.scrollTop,scrollX=g.doc.documentElement.scrollLeft||g.doc.body.scrollLeft;this._drag.id=e.identifier;if(supportsTouch&&e.touches){var i=e.touches.length,touch;while(i--){touch=e.touches[i];this._drag.id=touch.identifier;if(touch.identifier==this._drag.id){x=touch.clientX;y=touch.clientY;break;}}}
this._drag.x=x+scrollX;this._drag.y=y+scrollY;!drag.length&&R.mousemove(dragMove).mouseup(dragUp);drag.push({el:this,move_scope:move_scope,start_scope:start_scope,end_scope:end_scope});onstart&&eve.on("raphael.drag.start."+this.id,onstart);onmove&&eve.on("raphael.drag.move."+this.id,onmove);onend&&eve.on("raphael.drag.end."+this.id,onend);eve("raphael.drag.start."+this.id,start_scope||move_scope||this,e.clientX+scrollX,e.clientY+scrollY,e);}
this._drag={};draggable.push({el:this,start:start});this.mousedown(start);return this;};elproto.onDragOver=function(f){f?eve.on("raphael.drag.over."+this.id,f):eve.unbind("raphael.drag.over."+this.id);};elproto.undrag=function(){var i=draggable.length;while(i--)if(draggable[i].el==this){this.unmousedown(draggable[i].start);draggable.splice(i,1);eve.unbind("raphael.drag.*."+this.id);}!draggable.length&&R.unmousemove(dragMove).unmouseup(dragUp);drag=[];};paperproto.circle=function(x,y,r){var out=R._engine.circle(this,x||0,y||0,r||0);this.__set__&&this.__set__.push(out);return out;};paperproto.rect=function(x,y,w,h,r){var out=R._engine.rect(this,x||0,y||0,w||0,h||0,r||0);this.__set__&&this.__set__.push(out);return out;};paperproto.ellipse=function(x,y,rx,ry){var out=R._engine.ellipse(this,x||0,y||0,rx||0,ry||0);this.__set__&&this.__set__.push(out);return out;};paperproto.path=function(pathString){pathString&&!R.is(pathString,string)&&!R.is(pathString[0],array)&&(pathString+=E);var out=R._engine.path(R.format[apply](R,arguments),this);this.__set__&&this.__set__.push(out);return out;};paperproto.image=function(src,x,y,w,h){var out=R._engine.image(this,src||"about:blank",x||0,y||0,w||0,h||0);this.__set__&&this.__set__.push(out);return out;};paperproto.text=function(x,y,text){var out=R._engine.text(this,x||0,y||0,Str(text));this.__set__&&this.__set__.push(out);return out;};paperproto.set=function(itemsArray){!R.is(itemsArray,"array")&&(itemsArray=Array.prototype.splice.call(arguments,0,arguments.length));var out=new Set(itemsArray);this.__set__&&this.__set__.push(out);out["paper"]=this;out["type"]="set";return out;};paperproto.setStart=function(set){this.__set__=set||this.set();};paperproto.setFinish=function(set){var out=this.__set__;delete this.__set__;return out;};paperproto.setSize=function(width,height){return R._engine.setSize.call(this,width,height);};paperproto.setViewBox=function(x,y,w,h,fit){return R._engine.setViewBox.call(this,x,y,w,h,fit);};paperproto.top=paperproto.bottom=null;paperproto.raphael=R;var getOffset=function(elem){var box=elem.getBoundingClientRect(),doc=elem.ownerDocument,body=doc.body,docElem=doc.documentElement,clientTop=docElem.clientTop||body.clientTop||0,clientLeft=docElem.clientLeft||body.clientLeft||0,top=box.top+(g.win.pageYOffset||docElem.scrollTop||body.scrollTop)-clientTop,left=box.left+(g.win.pageXOffset||docElem.scrollLeft||body.scrollLeft)-clientLeft;return{y:top,x:left};};paperproto.getElementByPoint=function(x,y){var paper=this,svg=paper.canvas,target=g.doc.elementFromPoint(x,y);if(g.win.opera&&target.tagName=="svg"){var so=getOffset(svg),sr=svg.createSVGRect();sr.x=x-so.x;sr.y=y-so.y;sr.width=sr.height=1;var hits=svg.getIntersectionList(sr,null);if(hits.length){target=hits[hits.length-1];}}
if(!target){return null;}
while(target.parentNode&&target!=svg.parentNode&&!target.raphael){target=target.parentNode;}
target==paper.canvas.parentNode&&(target=svg);target=target&&target.raphael?paper.getById(target.raphaelid):null;return target;};paperproto.getElementsByBBox=function(bbox){var set=this.set();this.forEach(function(el){if(R.isBBoxIntersect(el.getBBox(),bbox)){set.push(el);}});return set;};paperproto.getById=function(id){var bot=this.bottom;while(bot){if(bot.id==id){return bot;}
bot=bot.next;}
return null;};paperproto.forEach=function(callback,thisArg){var bot=this.bottom;while(bot){if(callback.call(thisArg,bot)===false){return this;}
bot=bot.next;}
return this;};paperproto.getElementsByPoint=function(x,y){var set=this.set();this.forEach(function(el){if(el.isPointInside(x,y)){set.push(el);}});return set;};function x_y(){return this.x+S+this.y;}
function x_y_w_h(){return this.x+S+this.y+S+this.width+" \xd7 "+this.height;}
elproto.isPointInside=function(x,y){var rp=this.realPath=getPath[this.type](this);if(this.attr('transform')&&this.attr('transform').length){rp=R.transformPath(rp,this.attr('transform'));}
return R.isPointInsidePath(rp,x,y);};elproto.getBBox=function(isWithoutTransform){if(this.removed){return{};}
var _=this._;if(isWithoutTransform){if(_.dirty||!_.bboxwt){this.realPath=getPath[this.type](this);_.bboxwt=pathDimensions(this.realPath);_.bboxwt.toString=x_y_w_h;_.dirty=0;}
return _.bboxwt;}
if(_.dirty||_.dirtyT||!_.bbox){if(_.dirty||!this.realPath){_.bboxwt=0;this.realPath=getPath[this.type](this);}
_.bbox=pathDimensions(mapPath(this.realPath,this.matrix));_.bbox.toString=x_y_w_h;_.dirty=_.dirtyT=0;}
return _.bbox;};elproto.clone=function(){if(this.removed){return null;}
var out=this.paper[this.type]().attr(this.attr());this.__set__&&this.__set__.push(out);return out;};elproto.glow=function(glow){if(this.type=="text"){return null;}
glow=glow||{};var s={width:(glow.width||10)+(+this.attr("stroke-width")||1),fill:glow.fill||false,opacity:glow.opacity||.5,offsetx:glow.offsetx||0,offsety:glow.offsety||0,color:glow.color||"#000"},c=s.width/2,r=this.paper,out=r.set(),path=this.realPath||getPath[this.type](this);path=this.matrix?mapPath(path,this.matrix):path;for(var i=1;i<c+1;i++){out.push(r.path(path).attr({stroke:s.color,fill:s.fill?s.color:"none","stroke-linejoin":"round","stroke-linecap":"round","stroke-width":+(s.width/c*i).toFixed(3),opacity:+(s.opacity/c).toFixed(3)}));}
return out.insertBefore(this).translate(s.offsetx,s.offsety);};var curveslengths={},getPointAtSegmentLength=function(p1x,p1y,c1x,c1y,c2x,c2y,p2x,p2y,length){if(length==null){return bezlen(p1x,p1y,c1x,c1y,c2x,c2y,p2x,p2y);}else{return R.findDotsAtSegment(p1x,p1y,c1x,c1y,c2x,c2y,p2x,p2y,getTatLen(p1x,p1y,c1x,c1y,c2x,c2y,p2x,p2y,length));}},getLengthFactory=function(istotal,subpath){return function(path,length,onlystart){path=path2curve(path);var x,y,p,l,sp="",subpaths={},point,len=0;for(var i=0,ii=path.length;i<ii;i++){p=path[i];if(p[0]=="M"){x=+p[1];y=+p[2];}else{l=getPointAtSegmentLength(x,y,p[1],p[2],p[3],p[4],p[5],p[6]);if(len+l>length){if(subpath&&!subpaths.start){point=getPointAtSegmentLength(x,y,p[1],p[2],p[3],p[4],p[5],p[6],length-len);sp+=["C"+point.start.x,point.start.y,point.m.x,point.m.y,point.x,point.y];if(onlystart){return sp;}
subpaths.start=sp;sp=["M"+point.x,point.y+"C"+point.n.x,point.n.y,point.end.x,point.end.y,p[5],p[6]].join();len+=l;x=+p[5];y=+p[6];continue;}
if(!istotal&&!subpath){point=getPointAtSegmentLength(x,y,p[1],p[2],p[3],p[4],p[5],p[6],length-len);return{x:point.x,y:point.y,alpha:point.alpha};}}
len+=l;x=+p[5];y=+p[6];}
sp+=p.shift()+p;}
subpaths.end=sp;point=istotal?len:subpath?subpaths:R.findDotsAtSegment(x,y,p[0],p[1],p[2],p[3],p[4],p[5],1);point.alpha&&(point={x:point.x,y:point.y,alpha:point.alpha});return point;};};var getTotalLength=getLengthFactory(1),getPointAtLength=getLengthFactory(),getSubpathsAtLength=getLengthFactory(0,1);R.getTotalLength=getTotalLength;R.getPointAtLength=getPointAtLength;R.getSubpath=function(path,from,to){if(this.getTotalLength(path)-to<1e-6){return getSubpathsAtLength(path,from).end;}
var a=getSubpathsAtLength(path,to,1);return from?getSubpathsAtLength(a,from).end:a;};elproto.getTotalLength=function(){var path=this.getPath();if(!path){return;}
if(this.node.getTotalLength){return this.node.getTotalLength();}
return getTotalLength(path);};elproto.getPointAtLength=function(length){var path=this.getPath();if(!path){return;}
return getPointAtLength(path,length);};elproto.getPath=function(){var path,getPath=R._getPath[this.type];if(this.type=="text"||this.type=="set"){return;}
if(getPath){path=getPath(this);}
return path;};elproto.getSubpath=function(from,to){var path=this.getPath();if(!path){return;}
return R.getSubpath(path,from,to);};var ef=R.easing_formulas={linear:function(n){return n;},"<":function(n){return pow(n,1.7);},">":function(n){return pow(n,.48);},"<>":function(n){var q=.48-n/1.04,Q=math.sqrt(.1734+q*q),x=Q-q,X=pow(abs(x),1/3)*(x<0?-1:1),y=-Q-q,Y=pow(abs(y),1/3)*(y<0?-1:1),t=X+Y+.5;return(1-t)*3*t*t+t*t*t;},backIn:function(n){var s=1.70158;return n*n*((s+1)*n-s);},backOut:function(n){n=n-1;var s=1.70158;return n*n*((s+1)*n+s)+1;},elastic:function(n){if(n==!!n){return n;}
return pow(2,-10*n)*math.sin((n-.075)*(2*PI)/.3)+1;},bounce:function(n){var s=7.5625,p=2.75,l;if(n<(1/p)){l=s*n*n;}else{if(n<(2/p)){n-=(1.5/p);l=s*n*n+.75;}else{if(n<(2.5/p)){n-=(2.25/p);l=s*n*n+.9375;}else{n-=(2.625/p);l=s*n*n+.984375;}}}
return l;}};ef.easeIn=ef["ease-in"]=ef["<"];ef.easeOut=ef["ease-out"]=ef[">"];ef.easeInOut=ef["ease-in-out"]=ef["<>"];ef["back-in"]=ef.backIn;ef["back-out"]=ef.backOut;var animationElements=[],requestAnimFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(callback){setTimeout(callback,16);},animation=function(){var Now=+new Date,l=0;for(;l<animationElements.length;l++){var e=animationElements[l];if(e.el.removed||e.paused){continue;}
var time=Now-e.start,ms=e.ms,easing=e.easing,from=e.from,diff=e.diff,to=e.to,t=e.t,that=e.el,set={},now,init={},key;if(e.initstatus){time=(e.initstatus*e.anim.top-e.prev)/(e.percent-e.prev)*ms;e.status=e.initstatus;delete e.initstatus;e.stop&&animationElements.splice(l--,1);}else{e.status=(e.prev+(e.percent-e.prev)*(time/ms))/e.anim.top;}
if(time<0){continue;}
if(time<ms){var pos=easing(time/ms);for(var attr in from)if(from[has](attr)){switch(availableAnimAttrs[attr]){case nu:now=+from[attr]+pos*ms*diff[attr];break;case"colour":now="rgb("+[upto255(round(from[attr].r+pos*ms*diff[attr].r)),upto255(round(from[attr].g+pos*ms*diff[attr].g)),upto255(round(from[attr].b+pos*ms*diff[attr].b))].join(",")+")";break;case"path":now=[];for(var i=0,ii=from[attr].length;i<ii;i++){now[i]=[from[attr][i][0]];for(var j=1,jj=from[attr][i].length;j<jj;j++){now[i][j]=+from[attr][i][j]+pos*ms*diff[attr][i][j];}
now[i]=now[i].join(S);}
now=now.join(S);break;case"transform":if(diff[attr].real){now=[];for(i=0,ii=from[attr].length;i<ii;i++){now[i]=[from[attr][i][0]];for(j=1,jj=from[attr][i].length;j<jj;j++){now[i][j]=from[attr][i][j]+pos*ms*diff[attr][i][j];}}}else{var get=function(i){return+from[attr][i]+pos*ms*diff[attr][i];};now=[["m",get(0),get(1),get(2),get(3),get(4),get(5)]];}
break;case"csv":if(attr=="clip-rect"){now=[];i=4;while(i--){now[i]=+from[attr][i]+pos*ms*diff[attr][i];}}
break;default:var from2=[][concat](from[attr]);now=[];i=that.paper.customAttributes[attr].length;while(i--){now[i]=+from2[i]+pos*ms*diff[attr][i];}
break;}
set[attr]=now;}
that.attr(set);(function(id,that,anim){setTimeout(function(){eve("raphael.anim.frame."+id,that,anim);});})(that.id,that,e.anim);}else{(function(f,el,a){setTimeout(function(){eve("raphael.anim.frame."+el.id,el,a);eve("raphael.anim.finish."+el.id,el,a);R.is(f,"function")&&f.call(el);});})(e.callback,that,e.anim);that.attr(to);animationElements.splice(l--,1);if(e.repeat>1&&!e.next){for(key in to)if(to[has](key)){init[key]=e.totalOrigin[key];}
e.el.attr(init);runAnimation(e.anim,e.el,e.anim.percents[0],null,e.totalOrigin,e.repeat-1);}
if(e.next&&!e.stop){runAnimation(e.anim,e.el,e.next,null,e.totalOrigin,e.repeat);}}}
R.svg&&that&&that.paper&&that.paper.safari();animationElements.length&&requestAnimFrame(animation);},upto255=function(color){return color>255?255:color<0?0:color;};elproto.animateWith=function(el,anim,params,ms,easing,callback){var element=this;if(element.removed){callback&&callback.call(element);return element;}
var a=params instanceof Animation?params:R.animation(params,ms,easing,callback),x,y;runAnimation(a,element,a.percents[0],null,element.attr());for(var i=0,ii=animationElements.length;i<ii;i++){if(animationElements[i].anim==anim&&animationElements[i].el==el){animationElements[ii-1].start=animationElements[i].start;break;}}
return element;};function CubicBezierAtTime(t,p1x,p1y,p2x,p2y,duration){var cx=3*p1x,bx=3*(p2x-p1x)-cx,ax=1-cx-bx,cy=3*p1y,by=3*(p2y-p1y)-cy,ay=1-cy-by;function sampleCurveX(t){return((ax*t+bx)*t+cx)*t;}
function solve(x,epsilon){var t=solveCurveX(x,epsilon);return((ay*t+by)*t+cy)*t;}
function solveCurveX(x,epsilon){var t0,t1,t2,x2,d2,i;for(t2=x,i=0;i<8;i++){x2=sampleCurveX(t2)-x;if(abs(x2)<epsilon){return t2;}
d2=(3*ax*t2+2*bx)*t2+cx;if(abs(d2)<1e-6){break;}
t2=t2-x2/d2;}
t0=0;t1=1;t2=x;if(t2<t0){return t0;}
if(t2>t1){return t1;}
while(t0<t1){x2=sampleCurveX(t2);if(abs(x2-x)<epsilon){return t2;}
if(x>x2){t0=t2;}else{t1=t2;}
t2=(t1-t0)/2+t0;}
return t2;}
return solve(t,1/(200*duration));}
elproto.onAnimation=function(f){f?eve.on("raphael.anim.frame."+this.id,f):eve.unbind("raphael.anim.frame."+this.id);return this;};function Animation(anim,ms){var percents=[],newAnim={};this.ms=ms;this.times=1;if(anim){for(var attr in anim)if(anim[has](attr)){newAnim[toFloat(attr)]=anim[attr];percents.push(toFloat(attr));}
percents.sort(sortByNumber);}
this.anim=newAnim;this.top=percents[percents.length-1];this.percents=percents;}
Animation.prototype.delay=function(delay){var a=new Animation(this.anim,this.ms);a.times=this.times;a.del=+delay||0;return a;};Animation.prototype.repeat=function(times){var a=new Animation(this.anim,this.ms);a.del=this.del;a.times=math.floor(mmax(times,0))||1;return a;};function runAnimation(anim,element,percent,status,totalOrigin,times){percent=toFloat(percent);var params,isInAnim,isInAnimSet,percents=[],next,prev,timestamp,ms=anim.ms,from={},to={},diff={};if(status){for(i=0,ii=animationElements.length;i<ii;i++){var e=animationElements[i];if(e.el.id==element.id&&e.anim==anim){if(e.percent!=percent){animationElements.splice(i,1);isInAnimSet=1;}else{isInAnim=e;}
element.attr(e.totalOrigin);break;}}}else{status=+to;}
for(var i=0,ii=anim.percents.length;i<ii;i++){if(anim.percents[i]==percent||anim.percents[i]>status*anim.top){percent=anim.percents[i];prev=anim.percents[i-1]||0;ms=ms/anim.top*(percent-prev);next=anim.percents[i+1];params=anim.anim[percent];break;}else if(status){element.attr(anim.anim[anim.percents[i]]);}}
if(!params){return;}
if(!isInAnim){for(var attr in params)if(params[has](attr)){if(availableAnimAttrs[has](attr)||element.paper.customAttributes[has](attr)){from[attr]=element.attr(attr);(from[attr]==null)&&(from[attr]=availableAttrs[attr]);to[attr]=params[attr];switch(availableAnimAttrs[attr]){case nu:diff[attr]=(to[attr]-from[attr])/ms;break;case"colour":from[attr]=R.getRGB(from[attr]);var toColour=R.getRGB(to[attr]);diff[attr]={r:(toColour.r-from[attr].r)/ms,g:(toColour.g-from[attr].g)/ms,b:(toColour.b-from[attr].b)/ms};break;case"path":var pathes=path2curve(from[attr],to[attr]),toPath=pathes[1];from[attr]=pathes[0];diff[attr]=[];for(i=0,ii=from[attr].length;i<ii;i++){diff[attr][i]=[0];for(var j=1,jj=from[attr][i].length;j<jj;j++){diff[attr][i][j]=(toPath[i][j]-from[attr][i][j])/ms;}}
break;case"transform":var _=element._,eq=equaliseTransform(_[attr],to[attr]);if(eq){from[attr]=eq.from;to[attr]=eq.to;diff[attr]=[];diff[attr].real=true;for(i=0,ii=from[attr].length;i<ii;i++){diff[attr][i]=[from[attr][i][0]];for(j=1,jj=from[attr][i].length;j<jj;j++){diff[attr][i][j]=(to[attr][i][j]-from[attr][i][j])/ms;}}}else{var m=(element.matrix||new Matrix),to2={_:{transform:_.transform},getBBox:function(){return element.getBBox(1);}};from[attr]=[m.a,m.b,m.c,m.d,m.e,m.f];extractTransform(to2,to[attr]);to[attr]=to2._.transform;diff[attr]=[(to2.matrix.a-m.a)/ms,(to2.matrix.b-m.b)/ms,(to2.matrix.c-m.c)/ms,(to2.matrix.d-m.d)/ms,(to2.matrix.e-m.e)/ms,(to2.matrix.f-m.f)/ms];}
break;case"csv":var values=Str(params[attr])[split](separator),from2=Str(from[attr])[split](separator);if(attr=="clip-rect"){from[attr]=from2;diff[attr]=[];i=from2.length;while(i--){diff[attr][i]=(values[i]-from[attr][i])/ms;}}
to[attr]=values;break;default:values=[][concat](params[attr]);from2=[][concat](from[attr]);diff[attr]=[];i=element.paper.customAttributes[attr].length;while(i--){diff[attr][i]=((values[i]||0)-(from2[i]||0))/ms;}
break;}}}
var easing=params.easing,easyeasy=R.easing_formulas[easing];if(!easyeasy){easyeasy=Str(easing).match(bezierrg);if(easyeasy&&easyeasy.length==5){var curve=easyeasy;easyeasy=function(t){return CubicBezierAtTime(t,+curve[1],+curve[2],+curve[3],+curve[4],ms);};}else{easyeasy=pipe;}}
timestamp=params.start||anim.start||+new Date;e={anim:anim,percent:percent,timestamp:timestamp,start:timestamp+(anim.del||0),status:0,initstatus:status||0,stop:false,ms:ms,easing:easyeasy,from:from,diff:diff,to:to,el:element,callback:params.callback,prev:prev,next:next,repeat:times||anim.times,origin:element.attr(),totalOrigin:totalOrigin};animationElements.push(e);if(status&&!isInAnim&&!isInAnimSet){e.stop=true;e.start=new Date-ms*status;if(animationElements.length==1){return animation();}}
if(isInAnimSet){e.start=new Date-e.ms*status;}
animationElements.length==1&&requestAnimFrame(animation);}else{isInAnim.initstatus=status;isInAnim.start=new Date-isInAnim.ms*status;}
eve("raphael.anim.start."+element.id,element,anim);}
R.animation=function(params,ms,easing,callback){if(params instanceof Animation){return params;}
if(R.is(easing,"function")||!easing){callback=callback||easing||null;easing=null;}
params=Object(params);ms=+ms||0;var p={},json,attr;for(attr in params)if(params[has](attr)&&toFloat(attr)!=attr&&toFloat(attr)+"%"!=attr){json=true;p[attr]=params[attr];}
if(!json){return new Animation(params,ms);}else{easing&&(p.easing=easing);callback&&(p.callback=callback);return new Animation({100:p},ms);}};elproto.animate=function(params,ms,easing,callback){var element=this;if(element.removed){callback&&callback.call(element);return element;}
var anim=params instanceof Animation?params:R.animation(params,ms,easing,callback);runAnimation(anim,element,anim.percents[0],null,element.attr());return element;};elproto.setTime=function(anim,value){if(anim&&value!=null){this.status(anim,mmin(value,anim.ms)/anim.ms);}
return this;};elproto.status=function(anim,value){var out=[],i=0,len,e;if(value!=null){runAnimation(anim,this,-1,mmin(value,1));return this;}else{len=animationElements.length;for(;i<len;i++){e=animationElements[i];if(e.el.id==this.id&&(!anim||e.anim==anim)){if(anim){return e.status;}
out.push({anim:e.anim,status:e.status});}}
if(anim){return 0;}
return out;}};elproto.pause=function(anim){for(var i=0;i<animationElements.length;i++)if(animationElements[i].el.id==this.id&&(!anim||animationElements[i].anim==anim)){if(eve("raphael.anim.pause."+this.id,this,animationElements[i].anim)!==false){animationElements[i].paused=true;}}
return this;};elproto.resume=function(anim){for(var i=0;i<animationElements.length;i++)if(animationElements[i].el.id==this.id&&(!anim||animationElements[i].anim==anim)){var e=animationElements[i];if(eve("raphael.anim.resume."+this.id,this,e.anim)!==false){delete e.paused;this.status(e.anim,e.status);}}
return this;};elproto.stop=function(anim){for(var i=0;i<animationElements.length;i++)if(animationElements[i].el.id==this.id&&(!anim||animationElements[i].anim==anim)){if(eve("raphael.anim.stop."+this.id,this,animationElements[i].anim)!==false){animationElements.splice(i--,1);}}
return this;};function stopAnimation(paper){for(var i=0;i<animationElements.length;i++)if(animationElements[i].el.paper==paper){animationElements.splice(i--,1);}}
eve.on("raphael.remove",stopAnimation);eve.on("raphael.clear",stopAnimation);elproto.toString=function(){return"Rapha\xebl\u2019s object";};var Set=function(items){this.items=[];this.length=0;this.type="set";if(items){for(var i=0,ii=items.length;i<ii;i++){if(items[i]&&(items[i].constructor==elproto.constructor||items[i].constructor==Set)){this[this.items.length]=this.items[this.items.length]=items[i];this.length++;}}}},setproto=Set.prototype;setproto.push=function(){var item,len;for(var i=0,ii=arguments.length;i<ii;i++){item=arguments[i];if(item&&(item.constructor==elproto.constructor||item.constructor==Set)){len=this.items.length;this[len]=this.items[len]=item;this.length++;}}
return this;};setproto.pop=function(){this.length&&delete this[this.length--];return this.items.pop();};setproto.forEach=function(callback,thisArg){for(var i=0,ii=this.items.length;i<ii;i++){if(callback.call(thisArg,this.items[i],i)===false){return this;}}
return this;};for(var method in elproto)if(elproto[has](method)){setproto[method]=(function(methodname){return function(){var arg=arguments;return this.forEach(function(el){el[methodname][apply](el,arg);});};})(method);}
setproto.attr=function(name,value){if(name&&R.is(name,array)&&R.is(name[0],"object")){for(var j=0,jj=name.length;j<jj;j++){this.items[j].attr(name[j]);}}else{for(var i=0,ii=this.items.length;i<ii;i++){this.items[i].attr(name,value);}}
return this;};setproto.clear=function(){while(this.length){this.pop();}};setproto.splice=function(index,count,insertion){index=index<0?mmax(this.length+index,0):index;count=mmax(0,mmin(this.length-index,count));var tail=[],todel=[],args=[],i;for(i=2;i<arguments.length;i++){args.push(arguments[i]);}
for(i=0;i<count;i++){todel.push(this[index+i]);}
for(;i<this.length-index;i++){tail.push(this[index+i]);}
var arglen=args.length;for(i=0;i<arglen+tail.length;i++){this.items[index+i]=this[index+i]=i<arglen?args[i]:tail[i-arglen];}
i=this.items.length=this.length-=count-arglen;while(this[i]){delete this[i++];}
return new Set(todel);};setproto.exclude=function(el){for(var i=0,ii=this.length;i<ii;i++)if(this[i]==el){this.splice(i,1);return true;}};setproto.animate=function(params,ms,easing,callback){(R.is(easing,"function")||!easing)&&(callback=easing||null);var len=this.items.length,i=len,item,set=this,collector;if(!len){return this;}
callback&&(collector=function(){!--len&&callback.call(set);});easing=R.is(easing,string)?easing:collector;var anim=R.animation(params,ms,easing,collector);item=this.items[--i].animate(anim);while(i--){this.items[i]&&!this.items[i].removed&&this.items[i].animateWith(item,anim,anim);(this.items[i]&&!this.items[i].removed)||len--;}
return this;};setproto.insertAfter=function(el){var i=this.items.length;while(i--){this.items[i].insertAfter(el);}
return this;};setproto.getBBox=function(){var x=[],y=[],x2=[],y2=[];for(var i=this.items.length;i--;)if(!this.items[i].removed){var box=this.items[i].getBBox();x.push(box.x);y.push(box.y);x2.push(box.x+box.width);y2.push(box.y+box.height);}
x=mmin[apply](0,x);y=mmin[apply](0,y);x2=mmax[apply](0,x2);y2=mmax[apply](0,y2);return{x:x,y:y,x2:x2,y2:y2,width:x2-x,height:y2-y};};setproto.clone=function(s){s=this.paper.set();for(var i=0,ii=this.items.length;i<ii;i++){s.push(this.items[i].clone());}
return s;};setproto.toString=function(){return"Rapha\xebl\u2018s set";};setproto.glow=function(glowConfig){var ret=this.paper.set();this.forEach(function(shape,index){var g=shape.glow(glowConfig);if(g!=null){g.forEach(function(shape2,index2){ret.push(shape2);});}});return ret;};setproto.isPointInside=function(x,y){var isPointInside=false;this.forEach(function(el){if(el.isPointInside(x,y)){isPointInside=true;return false;}});return isPointInside;};R.registerFont=function(font){if(!font.face){return font;}
this.fonts=this.fonts||{};var fontcopy={w:font.w,face:{},glyphs:{}},family=font.face["font-family"];for(var prop in font.face)if(font.face[has](prop)){fontcopy.face[prop]=font.face[prop];}
if(this.fonts[family]){this.fonts[family].push(fontcopy);}else{this.fonts[family]=[fontcopy];}
if(!font.svg){fontcopy.face["units-per-em"]=toInt(font.face["units-per-em"],10);for(var glyph in font.glyphs)if(font.glyphs[has](glyph)){var path=font.glyphs[glyph];fontcopy.glyphs[glyph]={w:path.w,k:{},d:path.d&&"M"+path.d.replace(/[mlcxtrv]/g,function(command){return{l:"L",c:"C",x:"z",t:"m",r:"l",v:"c"}[command]||"M";})+"z"};if(path.k){for(var k in path.k)if(path[has](k)){fontcopy.glyphs[glyph].k[k]=path.k[k];}}}}
return font;};paperproto.getFont=function(family,weight,style,stretch){stretch=stretch||"normal";style=style||"normal";weight=+weight||{normal:400,bold:700,lighter:300,bolder:800}[weight]||400;if(!R.fonts){return;}
var font=R.fonts[family];if(!font){var name=new RegExp("(^|\\s)"+family.replace(/[^\w\d\s+!~.:_-]/g,E)+"(\\s|$)","i");for(var fontName in R.fonts)if(R.fonts[has](fontName)){if(name.test(fontName)){font=R.fonts[fontName];break;}}}
var thefont;if(font){for(var i=0,ii=font.length;i<ii;i++){thefont=font[i];if(thefont.face["font-weight"]==weight&&(thefont.face["font-style"]==style||!thefont.face["font-style"])&&thefont.face["font-stretch"]==stretch){break;}}}
return thefont;};paperproto.print=function(x,y,string,font,size,origin,letter_spacing,line_spacing){origin=origin||"middle";letter_spacing=mmax(mmin(letter_spacing||0,1),-1);line_spacing=mmax(mmin(line_spacing||1,3),1);var letters=Str(string)[split](E),shift=0,notfirst=0,path=E,scale;R.is(font,"string")&&(font=this.getFont(font));if(font){scale=(size||16)/font.face["units-per-em"];var bb=font.face.bbox[split](separator),top=+bb[0],lineHeight=bb[3]-bb[1],shifty=0,height=+bb[1]+(origin=="baseline"?lineHeight+(+font.face.descent):lineHeight/2);for(var i=0,ii=letters.length;i<ii;i++){if(letters[i]=="\n"){shift=0;curr=0;notfirst=0;shifty+=lineHeight*line_spacing;}else{var prev=notfirst&&font.glyphs[letters[i-1]]||{},curr=font.glyphs[letters[i]];shift+=notfirst?(prev.w||font.w)+(prev.k&&prev.k[letters[i]]||0)+(font.w*letter_spacing):0;notfirst=1;}
if(curr&&curr.d){path+=R.transformPath(curr.d,["t",shift*scale,shifty*scale,"s",scale,scale,top,height,"t",(x-top)/scale,(y-height)/scale]);}}}
return this.path(path).attr({fill:"#000",stroke:"none"});};paperproto.add=function(json){if(R.is(json,"array")){var res=this.set(),i=0,ii=json.length,j;for(;i<ii;i++){j=json[i]||{};elements[has](j.type)&&res.push(this[j.type]().attr(j));}}
return res;};R.format=function(token,params){var args=R.is(params,array)?[0][concat](params):arguments;token&&R.is(token,string)&&args.length-1&&(token=token.replace(formatrg,function(str,i){return args[++i]==null?E:args[i];}));return token||E;};R.fullfill=(function(){var tokenRegex=/\{([^\}]+)\}/g,objNotationRegex=/(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g,replacer=function(all,key,obj){var res=obj;key.replace(objNotationRegex,function(all,name,quote,quotedName,isFunc){name=name||quotedName;if(res){if(name in res){res=res[name];}
typeof res=="function"&&isFunc&&(res=res());}});res=(res==null||res==obj?all:res)+"";return res;};return function(str,obj){return String(str).replace(tokenRegex,function(all,key){return replacer(all,key,obj);});};})();R.ninja=function(){oldRaphael.was?(g.win.Raphael=oldRaphael.is):delete Raphael;return R;};R.st=setproto;(function(doc,loaded,f){if(doc.readyState==null&&doc.addEventListener){doc.addEventListener(loaded,f=function(){doc.removeEventListener(loaded,f,false);doc.readyState="complete";},false);doc.readyState="loading";}
function isLoaded(){(/in/).test(doc.readyState)?setTimeout(isLoaded,9):R.eve("raphael.DOMload");}
isLoaded();})(document,"DOMContentLoaded");eve.on("raphael.DOMload",function(){loaded=true;});(function(){if(!R.svg){return;}
var has="hasOwnProperty",Str=String,toFloat=parseFloat,toInt=parseInt,math=Math,mmax=math.max,abs=math.abs,pow=math.pow,separator=/[, ]+/,eve=R.eve,E="",S=" ";var xlink="http://www.w3.org/1999/xlink",markers={block:"M5,0 0,2.5 5,5z",classic:"M5,0 0,2.5 5,5 3.5,3 3.5,2z",diamond:"M2.5,0 5,2.5 2.5,5 0,2.5z",open:"M6,1 1,3.5 6,6",oval:"M2.5,0A2.5,2.5,0,0,1,2.5,5 2.5,2.5,0,0,1,2.5,0z"},markerCounter={};R.toString=function(){return"Your browser supports SVG.\nYou are running Rapha\xebl "+this.version;};var $=function(el,attr){if(attr){if(typeof el=="string"){el=$(el);}
for(var key in attr)if(attr[has](key)){if(key.substring(0,6)=="xlink:"){el.setAttributeNS(xlink,key.substring(6),Str(attr[key]));}else{el.setAttribute(key,Str(attr[key]));}}}else{el=R._g.doc.createElementNS("http://www.w3.org/2000/svg",el);el.style&&(el.style.webkitTapHighlightColor="rgba(0,0,0,0)");}
return el;},addGradientFill=function(element,gradient){var type="linear",id=element.id+gradient,fx=.5,fy=.5,o=element.node,SVG=element.paper,s=o.style,el=R._g.doc.getElementById(id);if(!el){gradient=Str(gradient).replace(R._radial_gradient,function(all,_fx,_fy){type="radial";if(_fx&&_fy){fx=toFloat(_fx);fy=toFloat(_fy);var dir=((fy>.5)*2-1);pow(fx-.5,2)+pow(fy-.5,2)>.25&&(fy=math.sqrt(.25-pow(fx-.5,2))*dir+.5)&&fy!=.5&&(fy=fy.toFixed(5)-1e-5*dir);}
return E;});gradient=gradient.split(/\s*\-\s*/);if(type=="linear"){var angle=gradient.shift();angle=-toFloat(angle);if(isNaN(angle)){return null;}
var vector=[0,0,math.cos(R.rad(angle)),math.sin(R.rad(angle))],max=1/(mmax(abs(vector[2]),abs(vector[3]))||1);vector[2]*=max;vector[3]*=max;if(vector[2]<0){vector[0]=-vector[2];vector[2]=0;}
if(vector[3]<0){vector[1]=-vector[3];vector[3]=0;}}
var dots=R._parseDots(gradient);if(!dots){return null;}
id=id.replace(/[\(\)\s,\xb0#]/g,"_");if(element.gradient&&id!=element.gradient.id){SVG.defs.removeChild(element.gradient);delete element.gradient;}
if(!element.gradient){el=$(type+"Gradient",{id:id});element.gradient=el;$(el,type=="radial"?{fx:fx,fy:fy}:{x1:vector[0],y1:vector[1],x2:vector[2],y2:vector[3],gradientTransform:element.matrix.invert()});SVG.defs.appendChild(el);for(var i=0,ii=dots.length;i<ii;i++){el.appendChild($("stop",{offset:dots[i].offset?dots[i].offset:i?"100%":"0%","stop-color":dots[i].color||"#fff"}));}}}
$(o,{fill:"url(#"+id+")",opacity:1,"fill-opacity":1});s.fill=E;s.opacity=1;s.fillOpacity=1;return 1;},updatePosition=function(o){var bbox=o.getBBox(1);$(o.pattern,{patternTransform:o.matrix.invert()+" translate("+bbox.x+","+bbox.y+")"});},addArrow=function(o,value,isEnd){if(o.type=="path"){var values=Str(value).toLowerCase().split("-"),p=o.paper,se=isEnd?"end":"start",node=o.node,attrs=o.attrs,stroke=attrs["stroke-width"],i=values.length,type="classic",from,to,dx,refX,attr,w=3,h=3,t=5;while(i--){switch(values[i]){case"block":case"classic":case"oval":case"diamond":case"open":case"none":type=values[i];break;case"wide":h=5;break;case"narrow":h=2;break;case"long":w=5;break;case"short":w=2;break;}}
if(type=="open"){w+=2;h+=2;t+=2;dx=1;refX=isEnd?4:1;attr={fill:"none",stroke:attrs.stroke};}else{refX=dx=w/2;attr={fill:attrs.stroke,stroke:"none"};}
if(o._.arrows){if(isEnd){o._.arrows.endPath&&markerCounter[o._.arrows.endPath]--;o._.arrows.endMarker&&markerCounter[o._.arrows.endMarker]--;}else{o._.arrows.startPath&&markerCounter[o._.arrows.startPath]--;o._.arrows.startMarker&&markerCounter[o._.arrows.startMarker]--;}}else{o._.arrows={};}
if(type!="none"){var pathId="raphael-marker-"+type,markerId="raphael-marker-"+se+type+w+h;if(!R._g.doc.getElementById(pathId)){p.defs.appendChild($($("path"),{"stroke-linecap":"round",d:markers[type],id:pathId}));markerCounter[pathId]=1;}else{markerCounter[pathId]++;}
var marker=R._g.doc.getElementById(markerId),use;if(!marker){marker=$($("marker"),{id:markerId,markerHeight:h,markerWidth:w,orient:"auto",refX:refX,refY:h/2});use=$($("use"),{"xlink:href":"#"+pathId,transform:(isEnd?"rotate(180 "+w/2+" "+h/2+") ":E)+"scale("+w/t+","+h/t+")","stroke-width":(1/((w/t+h/t)/2)).toFixed(4)});marker.appendChild(use);p.defs.appendChild(marker);markerCounter[markerId]=1;}else{markerCounter[markerId]++;use=marker.getElementsByTagName("use")[0];}
$(use,attr);var delta=dx*(type!="diamond"&&type!="oval");if(isEnd){from=o._.arrows.startdx*stroke||0;to=R.getTotalLength(attrs.path)-delta*stroke;}else{from=delta*stroke;to=R.getTotalLength(attrs.path)-(o._.arrows.enddx*stroke||0);}
attr={};attr["marker-"+se]="url(#"+markerId+")";if(to||from){attr.d=R.getSubpath(attrs.path,from,to);}
$(node,attr);o._.arrows[se+"Path"]=pathId;o._.arrows[se+"Marker"]=markerId;o._.arrows[se+"dx"]=delta;o._.arrows[se+"Type"]=type;o._.arrows[se+"String"]=value;}else{if(isEnd){from=o._.arrows.startdx*stroke||0;to=R.getTotalLength(attrs.path)-from;}else{from=0;to=R.getTotalLength(attrs.path)-(o._.arrows.enddx*stroke||0);}
o._.arrows[se+"Path"]&&$(node,{d:R.getSubpath(attrs.path,from,to)});delete o._.arrows[se+"Path"];delete o._.arrows[se+"Marker"];delete o._.arrows[se+"dx"];delete o._.arrows[se+"Type"];delete o._.arrows[se+"String"];}
for(attr in markerCounter)if(markerCounter[has](attr)&&!markerCounter[attr]){var item=R._g.doc.getElementById(attr);item&&item.parentNode.removeChild(item);}}},dasharray={"":[0],"none":[0],"-":[3,1],".":[1,1],"-.":[3,1,1,1],"-..":[3,1,1,1,1,1],". ":[1,3],"- ":[4,3],"--":[8,3],"- .":[4,3,1,3],"--.":[8,3,1,3],"--..":[8,3,1,3,1,3]},addDashes=function(o,value,params){value=dasharray[Str(value).toLowerCase()];if(value){var width=o.attrs["stroke-width"]||"1",butt={round:width,square:width,butt:0}[o.attrs["stroke-linecap"]||params["stroke-linecap"]]||0,dashes=[],i=value.length;while(i--){dashes[i]=value[i]*width+((i%2)?1:-1)*butt;}
$(o.node,{"stroke-dasharray":dashes.join(",")});}},setFillAndStroke=function(o,params){var node=o.node,attrs=o.attrs,vis=node.style.visibility;node.style.visibility="hidden";for(var att in params){if(params[has](att)){if(!R._availableAttrs[has](att)){continue;}
var value=params[att];attrs[att]=value;switch(att){case"blur":o.blur(value);break;case"title":var title=node.getElementsByTagName("title");if(title.length&&(title=title[0])){title.firstChild.nodeValue=value;}else{title=$("title");var val=R._g.doc.createTextNode(value);title.appendChild(val);node.appendChild(title);}
break;case"href":case"target":var pn=node.parentNode;if(pn.tagName.toLowerCase()!="a"){var hl=$("a");pn.insertBefore(hl,node);hl.appendChild(node);pn=hl;}
if(att=="target"){pn.setAttributeNS(xlink,"show",value=="blank"?"new":value);}else{pn.setAttributeNS(xlink,att,value);}
break;case"cursor":node.style.cursor=value;break;case"transform":o.transform(value);break;case"arrow-start":addArrow(o,value);break;case"arrow-end":addArrow(o,value,1);break;case"clip-rect":var rect=Str(value).split(separator);if(rect.length==4){o.clip&&o.clip.parentNode.parentNode.removeChild(o.clip.parentNode);var el=$("clipPath"),rc=$("rect");el.id=R.createUUID();$(rc,{x:rect[0],y:rect[1],width:rect[2],height:rect[3]});el.appendChild(rc);o.paper.defs.appendChild(el);$(node,{"clip-path":"url(#"+el.id+")"});o.clip=rc;}
if(!value){var path=node.getAttribute("clip-path");if(path){var clip=R._g.doc.getElementById(path.replace(/(^url\(#|\)$)/g,E));clip&&clip.parentNode.removeChild(clip);$(node,{"clip-path":E});delete o.clip;}}
break;case"path":if(o.type=="path"){$(node,{d:value?attrs.path=R._pathToAbsolute(value):"M0,0"});o._.dirty=1;if(o._.arrows){"startString"in o._.arrows&&addArrow(o,o._.arrows.startString);"endString"in o._.arrows&&addArrow(o,o._.arrows.endString,1);}}
break;case"width":node.setAttribute(att,value);o._.dirty=1;if(attrs.fx){att="x";value=attrs.x;}else{break;}
case"x":if(attrs.fx){value=-attrs.x-(attrs.width||0);}
case"rx":if(att=="rx"&&o.type=="rect"){break;}
case"cx":node.setAttribute(att,value);o.pattern&&updatePosition(o);o._.dirty=1;break;case"height":node.setAttribute(att,value);o._.dirty=1;if(attrs.fy){att="y";value=attrs.y;}else{break;}
case"y":if(attrs.fy){value=-attrs.y-(attrs.height||0);}
case"ry":if(att=="ry"&&o.type=="rect"){break;}
case"cy":node.setAttribute(att,value);o.pattern&&updatePosition(o);o._.dirty=1;break;case"r":if(o.type=="rect"){$(node,{rx:value,ry:value});}else{node.setAttribute(att,value);}
o._.dirty=1;break;case"src":if(o.type=="image"){node.setAttributeNS(xlink,"href",value);}
break;case"stroke-width":if(o._.sx!=1||o._.sy!=1){value/=mmax(abs(o._.sx),abs(o._.sy))||1;}
if(o.paper._vbSize){value*=o.paper._vbSize;}
node.setAttribute(att,value);if(attrs["stroke-dasharray"]){addDashes(o,attrs["stroke-dasharray"],params);}
if(o._.arrows){"startString"in o._.arrows&&addArrow(o,o._.arrows.startString);"endString"in o._.arrows&&addArrow(o,o._.arrows.endString,1);}
break;case"stroke-dasharray":addDashes(o,value,params);break;case"fill":var isURL=Str(value).match(R._ISURL);if(isURL){el=$("pattern");var ig=$("image");el.id=R.createUUID();$(el,{x:0,y:0,patternUnits:"userSpaceOnUse",height:1,width:1});$(ig,{x:0,y:0,"xlink:href":isURL[1]});el.appendChild(ig);(function(el){R._preload(isURL[1],function(){var w=this.offsetWidth,h=this.offsetHeight;$(el,{width:w,height:h});$(ig,{width:w,height:h});o.paper.safari();});})(el);o.paper.defs.appendChild(el);$(node,{fill:"url(#"+el.id+")"});o.pattern=el;o.pattern&&updatePosition(o);break;}
var clr=R.getRGB(value);if(!clr.error){delete params.gradient;delete attrs.gradient;!R.is(attrs.opacity,"undefined")&&R.is(params.opacity,"undefined")&&$(node,{opacity:attrs.opacity});!R.is(attrs["fill-opacity"],"undefined")&&R.is(params["fill-opacity"],"undefined")&&$(node,{"fill-opacity":attrs["fill-opacity"]});}else if((o.type=="circle"||o.type=="ellipse"||Str(value).charAt()!="r")&&addGradientFill(o,value)){if("opacity"in attrs||"fill-opacity"in attrs){var gradient=R._g.doc.getElementById(node.getAttribute("fill").replace(/^url\(#|\)$/g,E));if(gradient){var stops=gradient.getElementsByTagName("stop");$(stops[stops.length-1],{"stop-opacity":("opacity"in attrs?attrs.opacity:1)*("fill-opacity"in attrs?attrs["fill-opacity"]:1)});}}
attrs.gradient=value;attrs.fill="none";break;}
clr[has]("opacity")&&$(node,{"fill-opacity":clr.opacity>1?clr.opacity/100:clr.opacity});case"stroke":clr=R.getRGB(value);node.setAttribute(att,clr.hex);att=="stroke"&&clr[has]("opacity")&&$(node,{"stroke-opacity":clr.opacity>1?clr.opacity/100:clr.opacity});if(att=="stroke"&&o._.arrows){"startString"in o._.arrows&&addArrow(o,o._.arrows.startString);"endString"in o._.arrows&&addArrow(o,o._.arrows.endString,1);}
break;case"gradient":(o.type=="circle"||o.type=="ellipse"||Str(value).charAt()!="r")&&addGradientFill(o,value);break;case"opacity":if(attrs.gradient&&!attrs[has]("stroke-opacity")){$(node,{"stroke-opacity":value>1?value/100:value});}
case"fill-opacity":if(attrs.gradient){gradient=R._g.doc.getElementById(node.getAttribute("fill").replace(/^url\(#|\)$/g,E));if(gradient){stops=gradient.getElementsByTagName("stop");$(stops[stops.length-1],{"stop-opacity":value});}
break;}
default:att=="font-size"&&(value=toInt(value,10)+"px");var cssrule=att.replace(/(\-.)/g,function(w){return w.substring(1).toUpperCase();});node.style[cssrule]=value;o._.dirty=1;node.setAttribute(att,value);break;}}}
tuneText(o,params);node.style.visibility=vis;},leading=1.2,tuneText=function(el,params){if(el.type!="text"||!(params[has]("text")||params[has]("font")||params[has]("font-size")||params[has]("x")||params[has]("y"))){return;}
var a=el.attrs,node=el.node,fontSize=node.firstChild?toInt(R._g.doc.defaultView.getComputedStyle(node.firstChild,E).getPropertyValue("font-size"),10):10;if(params[has]("text")){a.text=params.text;while(node.firstChild){node.removeChild(node.firstChild);}
var texts=Str(params.text).split("\n"),tspans=[],tspan;for(var i=0,ii=texts.length;i<ii;i++){tspan=$("tspan");i&&$(tspan,{dy:fontSize*leading,x:a.x});tspan.appendChild(R._g.doc.createTextNode(texts[i]));node.appendChild(tspan);tspans[i]=tspan;}}else{tspans=node.getElementsByTagName("tspan");for(i=0,ii=tspans.length;i<ii;i++)if(i){$(tspans[i],{dy:fontSize*leading,x:a.x});}else{$(tspans[0],{dy:0});}}
$(node,{x:a.x,y:a.y});el._.dirty=1;var bb=el._getBBox(),dif=a.y-(bb.y+bb.height/2);dif&&R.is(dif,"finite")&&$(tspans[0],{dy:dif});},Element=function(node,svg){var X=0,Y=0;this[0]=this.node=node;node.raphael=true;this.id=R._oid++;node.raphaelid=this.id;this.matrix=R.matrix();this.realPath=null;this.paper=svg;this.attrs=this.attrs||{};this._={transform:[],sx:1,sy:1,deg:0,dx:0,dy:0,dirty:1};!svg.bottom&&(svg.bottom=this);this.prev=svg.top;svg.top&&(svg.top.next=this);svg.top=this;this.next=null;},elproto=R.el;Element.prototype=elproto;elproto.constructor=Element;R._engine.path=function(pathString,SVG){var el=$("path");SVG.canvas&&SVG.canvas.appendChild(el);var p=new Element(el,SVG);p.type="path";setFillAndStroke(p,{fill:"none",stroke:"#000",path:pathString});return p;};elproto.rotate=function(deg,cx,cy){if(this.removed){return this;}
deg=Str(deg).split(separator);if(deg.length-1){cx=toFloat(deg[1]);cy=toFloat(deg[2]);}
deg=toFloat(deg[0]);(cy==null)&&(cx=cy);if(cx==null||cy==null){var bbox=this.getBBox(1);cx=bbox.x+bbox.width/2;cy=bbox.y+bbox.height/2;}
this.transform(this._.transform.concat([["r",deg,cx,cy]]));return this;};elproto.scale=function(sx,sy,cx,cy){if(this.removed){return this;}
sx=Str(sx).split(separator);if(sx.length-1){sy=toFloat(sx[1]);cx=toFloat(sx[2]);cy=toFloat(sx[3]);}
sx=toFloat(sx[0]);(sy==null)&&(sy=sx);(cy==null)&&(cx=cy);if(cx==null||cy==null){var bbox=this.getBBox(1);}
cx=cx==null?bbox.x+bbox.width/2:cx;cy=cy==null?bbox.y+bbox.height/2:cy;this.transform(this._.transform.concat([["s",sx,sy,cx,cy]]));return this;};elproto.translate=function(dx,dy){if(this.removed){return this;}
dx=Str(dx).split(separator);if(dx.length-1){dy=toFloat(dx[1]);}
dx=toFloat(dx[0])||0;dy=+dy||0;this.transform(this._.transform.concat([["t",dx,dy]]));return this;};elproto.transform=function(tstr){var _=this._;if(tstr==null){return _.transform;}
R._extractTransform(this,tstr);this.clip&&$(this.clip,{transform:this.matrix.invert()});this.pattern&&updatePosition(this);this.node&&$(this.node,{transform:this.matrix});if(_.sx!=1||_.sy!=1){var sw=this.attrs[has]("stroke-width")?this.attrs["stroke-width"]:1;this.attr({"stroke-width":sw});}
return this;};elproto.hide=function(){!this.removed&&this.paper.safari(this.node.style.display="none");return this;};elproto.show=function(){!this.removed&&this.paper.safari(this.node.style.display="");return this;};elproto.remove=function(){if(this.removed||!this.node.parentNode){return;}
var paper=this.paper;paper.__set__&&paper.__set__.exclude(this);eve.unbind("raphael.*.*."+this.id);if(this.gradient){paper.defs.removeChild(this.gradient);}
R._tear(this,paper);if(this.node.parentNode.tagName.toLowerCase()=="a"){this.node.parentNode.parentNode.removeChild(this.node.parentNode);}else{this.node.parentNode.removeChild(this.node);}
for(var i in this){this[i]=typeof this[i]=="function"?R._removedFactory(i):null;}
this.removed=true;};elproto._getBBox=function(){if(this.node.style.display=="none"){this.show();var hide=true;}
var bbox={};try{bbox=this.node.getBBox();}catch(e){}finally{bbox=bbox||{};}
hide&&this.hide();return bbox;};elproto.attr=function(name,value){if(this.removed){return this;}
if(name==null){var res={};for(var a in this.attrs)if(this.attrs[has](a)){res[a]=this.attrs[a];}
res.gradient&&res.fill=="none"&&(res.fill=res.gradient)&&delete res.gradient;res.transform=this._.transform;return res;}
if(value==null&&R.is(name,"string")){if(name=="fill"&&this.attrs.fill=="none"&&this.attrs.gradient){return this.attrs.gradient;}
if(name=="transform"){return this._.transform;}
var names=name.split(separator),out={};for(var i=0,ii=names.length;i<ii;i++){name=names[i];if(name in this.attrs){out[name]=this.attrs[name];}else if(R.is(this.paper.customAttributes[name],"function")){out[name]=this.paper.customAttributes[name].def;}else{out[name]=R._availableAttrs[name];}}
return ii-1?out:out[names[0]];}
if(value==null&&R.is(name,"array")){out={};for(i=0,ii=name.length;i<ii;i++){out[name[i]]=this.attr(name[i]);}
return out;}
if(value!=null){var params={};params[name]=value;}else if(name!=null&&R.is(name,"object")){params=name;}
for(var key in params){eve("raphael.attr."+key+"."+this.id,this,params[key]);}
for(key in this.paper.customAttributes)if(this.paper.customAttributes[has](key)&&params[has](key)&&R.is(this.paper.customAttributes[key],"function")){var par=this.paper.customAttributes[key].apply(this,[].concat(params[key]));this.attrs[key]=params[key];for(var subkey in par)if(par[has](subkey)){params[subkey]=par[subkey];}}
setFillAndStroke(this,params);return this;};elproto.toFront=function(){if(this.removed){return this;}
if(this.node.parentNode.tagName.toLowerCase()=="a"){this.node.parentNode.parentNode.appendChild(this.node.parentNode);}else{this.node.parentNode.appendChild(this.node);}
var svg=this.paper;svg.top!=this&&R._tofront(this,svg);return this;};elproto.toBack=function(){if(this.removed){return this;}
var parent=this.node.parentNode;if(parent.tagName.toLowerCase()=="a"){parent.parentNode.insertBefore(this.node.parentNode,this.node.parentNode.parentNode.firstChild);}else if(parent.firstChild!=this.node){parent.insertBefore(this.node,this.node.parentNode.firstChild);}
R._toback(this,this.paper);var svg=this.paper;return this;};elproto.insertAfter=function(element){if(this.removed){return this;}
var node=element.node||element[element.length-1].node;if(node.nextSibling){node.parentNode.insertBefore(this.node,node.nextSibling);}else{node.parentNode.appendChild(this.node);}
R._insertafter(this,element,this.paper);return this;};elproto.insertBefore=function(element){if(this.removed){return this;}
var node=element.node||element[0].node;node.parentNode.insertBefore(this.node,node);R._insertbefore(this,element,this.paper);return this;};elproto.blur=function(size){var t=this;if(+size!==0){var fltr=$("filter"),blur=$("feGaussianBlur");t.attrs.blur=size;fltr.id=R.createUUID();$(blur,{stdDeviation:+size||1.5});fltr.appendChild(blur);t.paper.defs.appendChild(fltr);t._blur=fltr;$(t.node,{filter:"url(#"+fltr.id+")"});}else{if(t._blur){t._blur.parentNode.removeChild(t._blur);delete t._blur;delete t.attrs.blur;}
t.node.removeAttribute("filter");}
return t;};R._engine.circle=function(svg,x,y,r){var el=$("circle");svg.canvas&&svg.canvas.appendChild(el);var res=new Element(el,svg);res.attrs={cx:x,cy:y,r:r,fill:"none",stroke:"#000"};res.type="circle";$(el,res.attrs);return res;};R._engine.rect=function(svg,x,y,w,h,r){var el=$("rect");svg.canvas&&svg.canvas.appendChild(el);var res=new Element(el,svg);res.attrs={x:x,y:y,width:w,height:h,r:r||0,rx:r||0,ry:r||0,fill:"none",stroke:"#000"};res.type="rect";$(el,res.attrs);return res;};R._engine.ellipse=function(svg,x,y,rx,ry){var el=$("ellipse");svg.canvas&&svg.canvas.appendChild(el);var res=new Element(el,svg);res.attrs={cx:x,cy:y,rx:rx,ry:ry,fill:"none",stroke:"#000"};res.type="ellipse";$(el,res.attrs);return res;};R._engine.image=function(svg,src,x,y,w,h){var el=$("image");$(el,{x:x,y:y,width:w,height:h,preserveAspectRatio:"none"});el.setAttributeNS(xlink,"href",src);svg.canvas&&svg.canvas.appendChild(el);var res=new Element(el,svg);res.attrs={x:x,y:y,width:w,height:h,src:src};res.type="image";return res;};R._engine.text=function(svg,x,y,text){var el=$("text");svg.canvas&&svg.canvas.appendChild(el);var res=new Element(el,svg);res.attrs={x:x,y:y,"text-anchor":"middle",text:text,font:R._availableAttrs.font,stroke:"none",fill:"#000"};res.type="text";setFillAndStroke(res,res.attrs);return res;};R._engine.setSize=function(width,height){this.width=width||this.width;this.height=height||this.height;this.canvas.setAttribute("width",this.width);this.canvas.setAttribute("height",this.height);if(this._viewBox){this.setViewBox.apply(this,this._viewBox);}
return this;};R._engine.create=function(){var con=R._getContainer.apply(0,arguments),container=con&&con.container,x=con.x,y=con.y,width=con.width,height=con.height;if(!container){throw new Error("SVG container not found.");}
var cnvs=$("svg"),css="overflow:hidden;",isFloating;x=x||0;y=y||0;width=width||512;height=height||342;$(cnvs,{height:height,version:1.1,width:width,xmlns:"http://www.w3.org/2000/svg"});if(container==1){cnvs.style.cssText=css+"position:absolute;left:"+x+"px;top:"+y+"px";R._g.doc.body.appendChild(cnvs);isFloating=1;}else{cnvs.style.cssText=css+"position:relative";if(container.firstChild){container.insertBefore(cnvs,container.firstChild);}else{container.appendChild(cnvs);}}
container=new R._Paper;container.width=width;container.height=height;container.canvas=cnvs;container.clear();container._left=container._top=0;isFloating&&(container.renderfix=function(){});container.renderfix();return container;};R._engine.setViewBox=function(x,y,w,h,fit){eve("raphael.setViewBox",this,this._viewBox,[x,y,w,h,fit]);var size=mmax(w/this.width,h/this.height),top=this.top,aspectRatio=fit?"xMidYMid meet":"xMinYMin",vb,sw;if(x==null){if(this._vbSize){size=1;}
delete this._vbSize;vb="0 0 "+this.width+S+this.height;}else{this._vbSize=size;vb=x+S+y+S+w+S+h;}
$(this.canvas,{viewBox:vb,preserveAspectRatio:aspectRatio});while(size&&top){sw="stroke-width"in top.attrs?top.attrs["stroke-width"]:1;top.attr({"stroke-width":sw});top._.dirty=1;top._.dirtyT=1;top=top.prev;}
this._viewBox=[x,y,w,h,!!fit];return this;};R.prototype.renderfix=function(){var cnvs=this.canvas,s=cnvs.style,pos;try{pos=cnvs.getScreenCTM()||cnvs.createSVGMatrix();}catch(e){pos=cnvs.createSVGMatrix();}
var left=-pos.e%1,top=-pos.f%1;if(left||top){if(left){this._left=(this._left+left)%1;s.left=this._left+"px";}
if(top){this._top=(this._top+top)%1;s.top=this._top+"px";}}};R.prototype.clear=function(){R.eve("raphael.clear",this);var c=this.canvas;while(c.firstChild){c.removeChild(c.firstChild);}
this.bottom=this.top=null;(this.desc=$("desc")).appendChild(R._g.doc.createTextNode("Created with Rapha\xebl "+R.version));c.appendChild(this.desc);c.appendChild(this.defs=$("defs"));};R.prototype.remove=function(){eve("raphael.remove",this);this.canvas.parentNode&&this.canvas.parentNode.removeChild(this.canvas);for(var i in this){this[i]=typeof this[i]=="function"?R._removedFactory(i):null;}};var setproto=R.st;for(var method in elproto)if(elproto[has](method)&&!setproto[has](method)){setproto[method]=(function(methodname){return function(){var arg=arguments;return this.forEach(function(el){el[methodname].apply(el,arg);});};})(method);}})();(function(){if(!R.vml){return;}
var has="hasOwnProperty",Str=String,toFloat=parseFloat,math=Math,round=math.round,mmax=math.max,mmin=math.min,abs=math.abs,fillString="fill",separator=/[, ]+/,eve=R.eve,ms=" progid:DXImageTransform.Microsoft",S=" ",E="",map={M:"m",L:"l",C:"c",Z:"x",m:"t",l:"r",c:"v",z:"x"},bites=/([clmz]),?([^clmz]*)/gi,blurregexp=/ progid:\S+Blur\([^\)]+\)/g,val=/-?[^,\s-]+/g,cssDot="position:absolute;left:0;top:0;width:1px;height:1px",zoom=21600,pathTypes={path:1,rect:1,image:1},ovalTypes={circle:1,ellipse:1},path2vml=function(path){var total=/[ahqstv]/ig,command=R._pathToAbsolute;Str(path).match(total)&&(command=R._path2curve);total=/[clmz]/g;if(command==R._pathToAbsolute&&!Str(path).match(total)){var res=Str(path).replace(bites,function(all,command,args){var vals=[],isMove=command.toLowerCase()=="m",res=map[command];args.replace(val,function(value){if(isMove&&vals.length==2){res+=vals+map[command=="m"?"l":"L"];vals=[];}
vals.push(round(value*zoom));});return res+vals;});return res;}
var pa=command(path),p,r;res=[];for(var i=0,ii=pa.length;i<ii;i++){p=pa[i];r=pa[i][0].toLowerCase();r=="z"&&(r="x");for(var j=1,jj=p.length;j<jj;j++){r+=round(p[j]*zoom)+(j!=jj-1?",":E);}
res.push(r);}
return res.join(S);},compensation=function(deg,dx,dy){var m=R.matrix();m.rotate(-deg,.5,.5);return{dx:m.x(dx,dy),dy:m.y(dx,dy)};},setCoords=function(p,sx,sy,dx,dy,deg){var _=p._,m=p.matrix,fillpos=_.fillpos,o=p.node,s=o.style,y=1,flip="",dxdy,kx=zoom/sx,ky=zoom/sy;s.visibility="hidden";if(!sx||!sy){return;}
o.coordsize=abs(kx)+S+abs(ky);s.rotation=deg*(sx*sy<0?-1:1);if(deg){var c=compensation(deg,dx,dy);dx=c.dx;dy=c.dy;}
sx<0&&(flip+="x");sy<0&&(flip+=" y")&&(y=-1);s.flip=flip;o.coordorigin=(dx*-kx)+S+(dy*-ky);if(fillpos||_.fillsize){var fill=o.getElementsByTagName(fillString);fill=fill&&fill[0];o.removeChild(fill);if(fillpos){c=compensation(deg,m.x(fillpos[0],fillpos[1]),m.y(fillpos[0],fillpos[1]));fill.position=c.dx*y+S+c.dy*y;}
if(_.fillsize){fill.size=_.fillsize[0]*abs(sx)+S+_.fillsize[1]*abs(sy);}
o.appendChild(fill);}
s.visibility="visible";};R.toString=function(){return"Your browser doesn\u2019t support SVG. Falling down to VML.\nYou are running Rapha\xebl "+this.version;};var addArrow=function(o,value,isEnd){var values=Str(value).toLowerCase().split("-"),se=isEnd?"end":"start",i=values.length,type="classic",w="medium",h="medium";while(i--){switch(values[i]){case"block":case"classic":case"oval":case"diamond":case"open":case"none":type=values[i];break;case"wide":case"narrow":h=values[i];break;case"long":case"short":w=values[i];break;}}
var stroke=o.node.getElementsByTagName("stroke")[0];stroke[se+"arrow"]=type;stroke[se+"arrowlength"]=w;stroke[se+"arrowwidth"]=h;},setFillAndStroke=function(o,params){o.attrs=o.attrs||{};var node=o.node,a=o.attrs,s=node.style,xy,newpath=pathTypes[o.type]&&(params.x!=a.x||params.y!=a.y||params.width!=a.width||params.height!=a.height||params.cx!=a.cx||params.cy!=a.cy||params.rx!=a.rx||params.ry!=a.ry||params.r!=a.r),isOval=ovalTypes[o.type]&&(a.cx!=params.cx||a.cy!=params.cy||a.r!=params.r||a.rx!=params.rx||a.ry!=params.ry),res=o;for(var par in params)if(params[has](par)){a[par]=params[par];}
if(newpath){a.path=R._getPath[o.type](o);o._.dirty=1;}
params.href&&(node.href=params.href);params.title&&(node.title=params.title);params.target&&(node.target=params.target);params.cursor&&(s.cursor=params.cursor);"blur"in params&&o.blur(params.blur);if(params.path&&o.type=="path"||newpath){node.path=path2vml(~Str(a.path).toLowerCase().indexOf("r")?R._pathToAbsolute(a.path):a.path);if(o.type=="image"){o._.fillpos=[a.x,a.y];o._.fillsize=[a.width,a.height];setCoords(o,1,1,0,0,0);}}"transform"in params&&o.transform(params.transform);if(isOval){var cx=+a.cx,cy=+a.cy,rx=+a.rx||+a.r||0,ry=+a.ry||+a.r||0;node.path=R.format("ar{0},{1},{2},{3},{4},{1},{4},{1}x",round((cx-rx)*zoom),round((cy-ry)*zoom),round((cx+rx)*zoom),round((cy+ry)*zoom),round(cx*zoom));o._.dirty=1;}
if("clip-rect"in params){var rect=Str(params["clip-rect"]).split(separator);if(rect.length==4){rect[2]=+rect[2]+(+rect[0]);rect[3]=+rect[3]+(+rect[1]);var div=node.clipRect||R._g.doc.createElement("div"),dstyle=div.style;dstyle.clip=R.format("rect({1}px {2}px {3}px {0}px)",rect);if(!node.clipRect){dstyle.position="absolute";dstyle.top=0;dstyle.left=0;dstyle.width=o.paper.width+"px";dstyle.height=o.paper.height+"px";node.parentNode.insertBefore(div,node);div.appendChild(node);node.clipRect=div;}}
if(!params["clip-rect"]){node.clipRect&&(node.clipRect.style.clip="auto");}}
if(o.textpath){var textpathStyle=o.textpath.style;params.font&&(textpathStyle.font=params.font);params["font-family"]&&(textpathStyle.fontFamily='"'+params["font-family"].split(",")[0].replace(/^['"]+|['"]+$/g,E)+'"');params["font-size"]&&(textpathStyle.fontSize=params["font-size"]);params["font-weight"]&&(textpathStyle.fontWeight=params["font-weight"]);params["font-style"]&&(textpathStyle.fontStyle=params["font-style"]);}
if("arrow-start"in params){addArrow(res,params["arrow-start"]);}
if("arrow-end"in params){addArrow(res,params["arrow-end"],1);}
if(params.opacity!=null||params["stroke-width"]!=null||params.fill!=null||params.src!=null||params.stroke!=null||params["stroke-width"]!=null||params["stroke-opacity"]!=null||params["fill-opacity"]!=null||params["stroke-dasharray"]!=null||params["stroke-miterlimit"]!=null||params["stroke-linejoin"]!=null||params["stroke-linecap"]!=null){var fill=node.getElementsByTagName(fillString),newfill=false;fill=fill&&fill[0];!fill&&(newfill=fill=createNode(fillString));if(o.type=="image"&&params.src){fill.src=params.src;}
params.fill&&(fill.on=true);if(fill.on==null||params.fill=="none"||params.fill===null){fill.on=false;}
if(fill.on&&params.fill){var isURL=Str(params.fill).match(R._ISURL);if(isURL){fill.parentNode==node&&node.removeChild(fill);fill.rotate=true;fill.src=isURL[1];fill.type="tile";var bbox=o.getBBox(1);fill.position=bbox.x+S+bbox.y;o._.fillpos=[bbox.x,bbox.y];R._preload(isURL[1],function(){o._.fillsize=[this.offsetWidth,this.offsetHeight];});}else{fill.color=R.getRGB(params.fill).hex;fill.src=E;fill.type="solid";if(R.getRGB(params.fill).error&&(res.type in{circle:1,ellipse:1}||Str(params.fill).charAt()!="r")&&addGradientFill(res,params.fill,fill)){a.fill="none";a.gradient=params.fill;fill.rotate=false;}}}
if("fill-opacity"in params||"opacity"in params){var opacity=((+a["fill-opacity"]+1||2)-1)*((+a.opacity+1||2)-1)*((+R.getRGB(params.fill).o+1||2)-1);opacity=mmin(mmax(opacity,0),1);fill.opacity=opacity;if(fill.src){fill.color="none";}}
node.appendChild(fill);var stroke=(node.getElementsByTagName("stroke")&&node.getElementsByTagName("stroke")[0]),newstroke=false;!stroke&&(newstroke=stroke=createNode("stroke"));if((params.stroke&&params.stroke!="none")||params["stroke-width"]||params["stroke-opacity"]!=null||params["stroke-dasharray"]||params["stroke-miterlimit"]||params["stroke-linejoin"]||params["stroke-linecap"]){stroke.on=true;}
(params.stroke=="none"||params.stroke===null||stroke.on==null||params.stroke==0||params["stroke-width"]==0)&&(stroke.on=false);var strokeColor=R.getRGB(params.stroke);stroke.on&&params.stroke&&(stroke.color=strokeColor.hex);opacity=((+a["stroke-opacity"]+1||2)-1)*((+a.opacity+1||2)-1)*((+strokeColor.o+1||2)-1);var width=(toFloat(params["stroke-width"])||1)*.75;opacity=mmin(mmax(opacity,0),1);params["stroke-width"]==null&&(width=a["stroke-width"]);params["stroke-width"]&&(stroke.weight=width);width&&width<1&&(opacity*=width)&&(stroke.weight=1);stroke.opacity=opacity;params["stroke-linejoin"]&&(stroke.joinstyle=params["stroke-linejoin"]||"miter");stroke.miterlimit=params["stroke-miterlimit"]||8;params["stroke-linecap"]&&(stroke.endcap=params["stroke-linecap"]=="butt"?"flat":params["stroke-linecap"]=="square"?"square":"round");if("stroke-dasharray"in params){var dasharray={"-":"shortdash",".":"shortdot","-.":"shortdashdot","-..":"shortdashdotdot",". ":"dot","- ":"dash","--":"longdash","- .":"dashdot","--.":"longdashdot","--..":"longdashdotdot"};stroke.dashstyle=dasharray[has](params["stroke-dasharray"])?dasharray[params["stroke-dasharray"]]:E;}
newstroke&&node.appendChild(stroke);}
if(res.type=="text"){res.paper.canvas.style.display=E;var span=res.paper.span,m=100,fontSize=a.font&&a.font.match(/\d+(?:\.\d*)?(?=px)/);s=span.style;a.font&&(s.font=a.font);a["font-family"]&&(s.fontFamily=a["font-family"]);a["font-weight"]&&(s.fontWeight=a["font-weight"]);a["font-style"]&&(s.fontStyle=a["font-style"]);fontSize=toFloat(a["font-size"]||fontSize&&fontSize[0])||10;s.fontSize=fontSize*m+"px";res.textpath.string&&(span.innerHTML=Str(res.textpath.string).replace(/</g,"&#60;").replace(/&/g,"&#38;").replace(/\n/g,"<br>"));var brect=span.getBoundingClientRect();res.W=a.w=(brect.right-brect.left)/m;res.H=a.h=(brect.bottom-brect.top)/m;res.X=a.x;res.Y=a.y+res.H/2;("x"in params||"y"in params)&&(res.path.v=R.format("m{0},{1}l{2},{1}",round(a.x*zoom),round(a.y*zoom),round(a.x*zoom)+1));var dirtyattrs=["x","y","text","font","font-family","font-weight","font-style","font-size"];for(var d=0,dd=dirtyattrs.length;d<dd;d++)if(dirtyattrs[d]in params){res._.dirty=1;break;}
switch(a["text-anchor"]){case"start":res.textpath.style["v-text-align"]="left";res.bbx=res.W/2;break;case"end":res.textpath.style["v-text-align"]="right";res.bbx=-res.W/2;break;default:res.textpath.style["v-text-align"]="center";res.bbx=0;break;}
res.textpath.style["v-text-kern"]=true;}},addGradientFill=function(o,gradient,fill){o.attrs=o.attrs||{};var attrs=o.attrs,pow=Math.pow,opacity,oindex,type="linear",fxfy=".5 .5";o.attrs.gradient=gradient;gradient=Str(gradient).replace(R._radial_gradient,function(all,fx,fy){type="radial";if(fx&&fy){fx=toFloat(fx);fy=toFloat(fy);pow(fx-.5,2)+pow(fy-.5,2)>.25&&(fy=math.sqrt(.25-pow(fx-.5,2))*((fy>.5)*2-1)+.5);fxfy=fx+S+fy;}
return E;});gradient=gradient.split(/\s*\-\s*/);if(type=="linear"){var angle=gradient.shift();angle=-toFloat(angle);if(isNaN(angle)){return null;}}
var dots=R._parseDots(gradient);if(!dots){return null;}
o=o.shape||o.node;if(dots.length){o.removeChild(fill);fill.on=true;fill.method="none";fill.color=dots[0].color;fill.color2=dots[dots.length-1].color;var clrs=[];for(var i=0,ii=dots.length;i<ii;i++){dots[i].offset&&clrs.push(dots[i].offset+S+dots[i].color);}
fill.colors=clrs.length?clrs.join():"0% "+fill.color;if(type=="radial"){fill.type="gradientTitle";fill.focus="100%";fill.focussize="0 0";fill.focusposition=fxfy;fill.angle=0;}else{fill.type="gradient";fill.angle=(270-angle)%360;}
o.appendChild(fill);}
return 1;},Element=function(node,vml){this[0]=this.node=node;node.raphael=true;this.id=R._oid++;node.raphaelid=this.id;this.X=0;this.Y=0;this.attrs={};this.paper=vml;this.matrix=R.matrix();this._={transform:[],sx:1,sy:1,dx:0,dy:0,deg:0,dirty:1,dirtyT:1};!vml.bottom&&(vml.bottom=this);this.prev=vml.top;vml.top&&(vml.top.next=this);vml.top=this;this.next=null;};var elproto=R.el;Element.prototype=elproto;elproto.constructor=Element;elproto.transform=function(tstr){if(tstr==null){return this._.transform;}
var vbs=this.paper._viewBoxShift,vbt=vbs?"s"+[vbs.scale,vbs.scale]+"-1-1t"+[vbs.dx,vbs.dy]:E,oldt;if(vbs){oldt=tstr=Str(tstr).replace(/\.{3}|\u2026/g,this._.transform||E);}
R._extractTransform(this,vbt+tstr);var matrix=this.matrix.clone(),skew=this.skew,o=this.node,split,isGrad=~Str(this.attrs.fill).indexOf("-"),isPatt=!Str(this.attrs.fill).indexOf("url(");matrix.translate(1,1);if(isPatt||isGrad||this.type=="image"){skew.matrix="1 0 0 1";skew.offset="0 0";split=matrix.split();if((isGrad&&split.noRotation)||!split.isSimple){o.style.filter=matrix.toFilter();var bb=this.getBBox(),bbt=this.getBBox(1),dx=bb.x-bbt.x,dy=bb.y-bbt.y;o.coordorigin=(dx*-zoom)+S+(dy*-zoom);setCoords(this,1,1,dx,dy,0);}else{o.style.filter=E;setCoords(this,split.scalex,split.scaley,split.dx,split.dy,split.rotate);}}else{o.style.filter=E;skew.matrix=Str(matrix);skew.offset=matrix.offset();}
oldt&&(this._.transform=oldt);return this;};elproto.rotate=function(deg,cx,cy){if(this.removed){return this;}
if(deg==null){return;}
deg=Str(deg).split(separator);if(deg.length-1){cx=toFloat(deg[1]);cy=toFloat(deg[2]);}
deg=toFloat(deg[0]);(cy==null)&&(cx=cy);if(cx==null||cy==null){var bbox=this.getBBox(1);cx=bbox.x+bbox.width/2;cy=bbox.y+bbox.height/2;}
this._.dirtyT=1;this.transform(this._.transform.concat([["r",deg,cx,cy]]));return this;};elproto.translate=function(dx,dy){if(this.removed){return this;}
dx=Str(dx).split(separator);if(dx.length-1){dy=toFloat(dx[1]);}
dx=toFloat(dx[0])||0;dy=+dy||0;if(this._.bbox){this._.bbox.x+=dx;this._.bbox.y+=dy;}
this.transform(this._.transform.concat([["t",dx,dy]]));return this;};elproto.scale=function(sx,sy,cx,cy){if(this.removed){return this;}
sx=Str(sx).split(separator);if(sx.length-1){sy=toFloat(sx[1]);cx=toFloat(sx[2]);cy=toFloat(sx[3]);isNaN(cx)&&(cx=null);isNaN(cy)&&(cy=null);}
sx=toFloat(sx[0]);(sy==null)&&(sy=sx);(cy==null)&&(cx=cy);if(cx==null||cy==null){var bbox=this.getBBox(1);}
cx=cx==null?bbox.x+bbox.width/2:cx;cy=cy==null?bbox.y+bbox.height/2:cy;this.transform(this._.transform.concat([["s",sx,sy,cx,cy]]));this._.dirtyT=1;return this;};elproto.hide=function(){!this.removed&&(this.node.style.display="none");return this;};elproto.show=function(){!this.removed&&(this.node.style.display=E);return this;};elproto._getBBox=function(){if(this.removed){return{};}
return{x:this.X+(this.bbx||0)-this.W/2,y:this.Y-this.H,width:this.W,height:this.H};};elproto.remove=function(){if(this.removed||!this.node.parentNode){return;}
this.paper.__set__&&this.paper.__set__.exclude(this);R.eve.unbind("raphael.*.*."+this.id);R._tear(this,this.paper);this.node.parentNode.removeChild(this.node);this.shape&&this.shape.parentNode.removeChild(this.shape);for(var i in this){this[i]=typeof this[i]=="function"?R._removedFactory(i):null;}
this.removed=true;};elproto.attr=function(name,value){if(this.removed){return this;}
if(name==null){var res={};for(var a in this.attrs)if(this.attrs[has](a)){res[a]=this.attrs[a];}
res.gradient&&res.fill=="none"&&(res.fill=res.gradient)&&delete res.gradient;res.transform=this._.transform;return res;}
if(value==null&&R.is(name,"string")){if(name==fillString&&this.attrs.fill=="none"&&this.attrs.gradient){return this.attrs.gradient;}
var names=name.split(separator),out={};for(var i=0,ii=names.length;i<ii;i++){name=names[i];if(name in this.attrs){out[name]=this.attrs[name];}else if(R.is(this.paper.customAttributes[name],"function")){out[name]=this.paper.customAttributes[name].def;}else{out[name]=R._availableAttrs[name];}}
return ii-1?out:out[names[0]];}
if(this.attrs&&value==null&&R.is(name,"array")){out={};for(i=0,ii=name.length;i<ii;i++){out[name[i]]=this.attr(name[i]);}
return out;}
var params;if(value!=null){params={};params[name]=value;}
value==null&&R.is(name,"object")&&(params=name);for(var key in params){eve("raphael.attr."+key+"."+this.id,this,params[key]);}
if(params){for(key in this.paper.customAttributes)if(this.paper.customAttributes[has](key)&&params[has](key)&&R.is(this.paper.customAttributes[key],"function")){var par=this.paper.customAttributes[key].apply(this,[].concat(params[key]));this.attrs[key]=params[key];for(var subkey in par)if(par[has](subkey)){params[subkey]=par[subkey];}}
if(params.text&&this.type=="text"){this.textpath.string=params.text;}
setFillAndStroke(this,params);}
return this;};elproto.toFront=function(){!this.removed&&this.node.parentNode.appendChild(this.node);this.paper&&this.paper.top!=this&&R._tofront(this,this.paper);return this;};elproto.toBack=function(){if(this.removed){return this;}
if(this.node.parentNode.firstChild!=this.node){this.node.parentNode.insertBefore(this.node,this.node.parentNode.firstChild);R._toback(this,this.paper);}
return this;};elproto.insertAfter=function(element){if(this.removed){return this;}
if(element.constructor==R.st.constructor){element=element[element.length-1];}
if(element.node.nextSibling){element.node.parentNode.insertBefore(this.node,element.node.nextSibling);}else{element.node.parentNode.appendChild(this.node);}
R._insertafter(this,element,this.paper);return this;};elproto.insertBefore=function(element){if(this.removed){return this;}
if(element.constructor==R.st.constructor){element=element[0];}
element.node.parentNode.insertBefore(this.node,element.node);R._insertbefore(this,element,this.paper);return this;};elproto.blur=function(size){var s=this.node.runtimeStyle,f=s.filter;f=f.replace(blurregexp,E);if(+size!==0){this.attrs.blur=size;s.filter=f+S+ms+".Blur(pixelradius="+(+size||1.5)+")";s.margin=R.format("-{0}px 0 0 -{0}px",round(+size||1.5));}else{s.filter=f;s.margin=0;delete this.attrs.blur;}
return this;};R._engine.path=function(pathString,vml){var el=createNode("shape");el.style.cssText=cssDot;el.coordsize=zoom+S+zoom;el.coordorigin=vml.coordorigin;var p=new Element(el,vml),attr={fill:"none",stroke:"#000"};pathString&&(attr.path=pathString);p.type="path";p.path=[];p.Path=E;setFillAndStroke(p,attr);vml.canvas.appendChild(el);var skew=createNode("skew");skew.on=true;el.appendChild(skew);p.skew=skew;p.transform(E);return p;};R._engine.rect=function(vml,x,y,w,h,r){var path=R._rectPath(x,y,w,h,r),res=vml.path(path),a=res.attrs;res.X=a.x=x;res.Y=a.y=y;res.W=a.width=w;res.H=a.height=h;a.r=r;a.path=path;res.type="rect";return res;};R._engine.ellipse=function(vml,x,y,rx,ry){var res=vml.path(),a=res.attrs;res.X=x-rx;res.Y=y-ry;res.W=rx*2;res.H=ry*2;res.type="ellipse";setFillAndStroke(res,{cx:x,cy:y,rx:rx,ry:ry});return res;};R._engine.circle=function(vml,x,y,r){var res=vml.path(),a=res.attrs;res.X=x-r;res.Y=y-r;res.W=res.H=r*2;res.type="circle";setFillAndStroke(res,{cx:x,cy:y,r:r});return res;};R._engine.image=function(vml,src,x,y,w,h){var path=R._rectPath(x,y,w,h),res=vml.path(path).attr({stroke:"none"}),a=res.attrs,node=res.node,fill=node.getElementsByTagName(fillString)[0];a.src=src;res.X=a.x=x;res.Y=a.y=y;res.W=a.width=w;res.H=a.height=h;a.path=path;res.type="image";fill.parentNode==node&&node.removeChild(fill);fill.rotate=true;fill.src=src;fill.type="tile";res._.fillpos=[x,y];res._.fillsize=[w,h];node.appendChild(fill);setCoords(res,1,1,0,0,0);return res;};R._engine.text=function(vml,x,y,text){var el=createNode("shape"),path=createNode("path"),o=createNode("textpath");x=x||0;y=y||0;text=text||"";path.v=R.format("m{0},{1}l{2},{1}",round(x*zoom),round(y*zoom),round(x*zoom)+1);path.textpathok=true;o.string=Str(text);o.on=true;el.style.cssText=cssDot;el.coordsize=zoom+S+zoom;el.coordorigin="0 0";var p=new Element(el,vml),attr={fill:"#000",stroke:"none",font:R._availableAttrs.font,text:text};p.shape=el;p.path=path;p.textpath=o;p.type="text";p.attrs.text=Str(text);p.attrs.x=x;p.attrs.y=y;p.attrs.w=1;p.attrs.h=1;setFillAndStroke(p,attr);el.appendChild(o);el.appendChild(path);vml.canvas.appendChild(el);var skew=createNode("skew");skew.on=true;el.appendChild(skew);p.skew=skew;p.transform(E);return p;};R._engine.setSize=function(width,height){var cs=this.canvas.style;this.width=width;this.height=height;width==+width&&(width+="px");height==+height&&(height+="px");cs.width=width;cs.height=height;cs.clip="rect(0 "+width+" "+height+" 0)";if(this._viewBox){R._engine.setViewBox.apply(this,this._viewBox);}
return this;};R._engine.setViewBox=function(x,y,w,h,fit){R.eve("raphael.setViewBox",this,this._viewBox,[x,y,w,h,fit]);var width=this.width,height=this.height,size=1/mmax(w/width,h/height),H,W;if(fit){H=height/h;W=width/w;if(w*H<width){x-=(width-w*H)/2/H;}
if(h*W<height){y-=(height-h*W)/2/W;}}
this._viewBox=[x,y,w,h,!!fit];this._viewBoxShift={dx:-x,dy:-y,scale:size};this.forEach(function(el){el.transform("...");});return this;};var createNode;R._engine.initWin=function(win){var doc=win.document;doc.createStyleSheet().addRule(".rvml","behavior:url(#default#VML)");try{!doc.namespaces.rvml&&doc.namespaces.add("rvml","urn:schemas-microsoft-com:vml");createNode=function(tagName){return doc.createElement('<rvml:'+tagName+' class="rvml">');};}catch(e){createNode=function(tagName){return doc.createElement('<'+tagName+' xmlns="urn:schemas-microsoft.com:vml" class="rvml">');};}};R._engine.initWin(R._g.win);R._engine.create=function(){var con=R._getContainer.apply(0,arguments),container=con.container,height=con.height,s,width=con.width,x=con.x,y=con.y;if(!container){throw new Error("VML container not found.");}
var res=new R._Paper,c=res.canvas=R._g.doc.createElement("div"),cs=c.style;x=x||0;y=y||0;width=width||512;height=height||342;res.width=width;res.height=height;width==+width&&(width+="px");height==+height&&(height+="px");res.coordsize=zoom*1e3+S+zoom*1e3;res.coordorigin="0 0";res.span=R._g.doc.createElement("span");res.span.style.cssText="position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;";c.appendChild(res.span);cs.cssText=R.format("top:0;left:0;width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden",width,height);if(container==1){R._g.doc.body.appendChild(c);cs.left=x+"px";cs.top=y+"px";cs.position="absolute";}else{if(container.firstChild){container.insertBefore(c,container.firstChild);}else{container.appendChild(c);}}
res.renderfix=function(){};return res;};R.prototype.clear=function(){R.eve("raphael.clear",this);this.canvas.innerHTML=E;this.span=R._g.doc.createElement("span");this.span.style.cssText="position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;";this.canvas.appendChild(this.span);this.bottom=this.top=null;};R.prototype.remove=function(){R.eve("raphael.remove",this);this.canvas.parentNode.removeChild(this.canvas);for(var i in this){this[i]=typeof this[i]=="function"?R._removedFactory(i):null;}
return true;};var setproto=R.st;for(var method in elproto)if(elproto[has](method)&&!setproto[has](method)){setproto[method]=(function(methodname){return function(){var arg=arguments;return this.forEach(function(el){el[methodname].apply(el,arg);});};})(method);}})();oldRaphael.was?(g.win.Raphael=R):(Raphael=R);return R;}));+function($){"use strict";var ChartUtils=function(){}
ChartUtils.prototype.defaultValueColor='#b8b8b8';ChartUtils.prototype.getColor=function(index){var
colors=['#95b753','#cc3300','#e5a91a','#3366ff','#ff0f00','#ff6600','#ff9e01','#fcd202','#f8ff01','#b0de09','#04d215','#0d8ecf','#0d52d1','#2a0cd0','#8a0ccf','#cd0d74','#754deb','#dddddd','#999999','#333333','#000000','#57032a','#ca9726','#990000','#4b0c25'],colorIndex=index%(colors.length-1);return colors[colorIndex];}
ChartUtils.prototype.loadListValues=function($list){var result={values:[],total:0,max:0}
$('> li',$list).each(function(){var value=$(this).data('value')?parseFloat($(this).data('value')):parseFloat($('span',this).text());result.total+=value
result.values.push({value:value,color:$(this).data('color')})
result.max=Math.max(result.max,value)})
return result;}
ChartUtils.prototype.getLegendLabel=function($legend,index){return $('tr:eq('+index+') td:eq(1)',$legend).html();}
ChartUtils.prototype.initLegendColorIndicators=function($legend){var indicators=[];$('tr > td:first-child',$legend).each(function(){var indicator=$('<i></i>')
$(this).prepend(indicator)
indicators.push(indicator)})
return indicators;}
ChartUtils.prototype.createLegend=function($list){var
$legend=$('<div>').addClass('chart-legend'),$table=$('<table>')
$legend.append($table)
$('> li',$list).each(function(){var label=$(this).clone().children().remove().end().html();$table.append($('<tr>').append($('<td class="indicator">')).append($('<td>').html(label)).append($('<td>').addClass('value').html($('span',this).html())))})
$legend.insertAfter($list)
$list.remove()
return $legend;}
ChartUtils.prototype.showTooltip=function(x,y,text){var $tooltip=$('#chart-tooltip')
if($tooltip.length)
$tooltip.remove()
$tooltip=$('<div id="chart-tooltip">').html(text).css('visibility','hidden')
x+=10
y+=10
$(document.body).append($tooltip)
var tooltipWidth=$tooltip.outerWidth()
if((x+tooltipWidth)>$(window).width())
x=$(window).width()-tooltipWidth-10;$tooltip.css({top:y,left:x,visibility:'visible'});}
ChartUtils.prototype.hideTooltip=function(){$('#chart-tooltip').remove()}
if($.oc===undefined)
$.oc={}
$.oc.chartUtils=new ChartUtils();}(window.jQuery);(function(B){B.color={};B.color.make=function(F,E,C,D){var G={};G.r=F||0;G.g=E||0;G.b=C||0;G.a=D!=null?D:1;G.add=function(J,I){for(var H=0;H<J.length;++H){G[J.charAt(H)]+=I}return G.normalize()};G.scale=function(J,I){for(var H=0;H<J.length;++H){G[J.charAt(H)]*=I}return G.normalize()};G.toString=function(){if(G.a>=1){return"rgb("+[G.r,G.g,G.b].join(",")+")"}else{return"rgba("+[G.r,G.g,G.b,G.a].join(",")+")"}};G.normalize=function(){function H(J,K,I){return K<J?J:(K>I?I:K)}G.r=H(0,parseInt(G.r),255);G.g=H(0,parseInt(G.g),255);G.b=H(0,parseInt(G.b),255);G.a=H(0,G.a,1);return G};G.clone=function(){return B.color.make(G.r,G.b,G.g,G.a)};return G.normalize()};B.color.extract=function(D,C){var E;do{E=D.css(C).toLowerCase();if(E!=""&&E!="transparent"){break}D=D.parent()}while(!B.nodeName(D.get(0),"body"));if(E=="rgba(0, 0, 0, 0)"){E="transparent"}return B.color.parse(E)};B.color.parse=function(F){var E,C=B.color.make;if(E=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(F)){return C(parseInt(E[1],10),parseInt(E[2],10),parseInt(E[3],10))}if(E=/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(F)){return C(parseInt(E[1],10),parseInt(E[2],10),parseInt(E[3],10),parseFloat(E[4]))}if(E=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(F)){return C(parseFloat(E[1])*2.55,parseFloat(E[2])*2.55,parseFloat(E[3])*2.55)}if(E=/rgba\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(F)){return C(parseFloat(E[1])*2.55,parseFloat(E[2])*2.55,parseFloat(E[3])*2.55,parseFloat(E[4]))}if(E=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(F)){return C(parseInt(E[1],16),parseInt(E[2],16),parseInt(E[3],16))}if(E=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(F)){return C(parseInt(E[1]+E[1],16),parseInt(E[2]+E[2],16),parseInt(E[3]+E[3],16))}var D=B.trim(F).toLowerCase();if(D=="transparent"){return C(255,255,255,0)}else{E=A[D]||[0,0,0];return C(E[0],E[1],E[2])}};var A={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0]}})(jQuery);(function($){var hasOwnProperty=Object.prototype.hasOwnProperty;function Canvas(cls,container){var element=container.children("."+cls)[0];if(element==null){element=document.createElement("canvas");element.className=cls;$(element).css({direction:"ltr",position:"absolute",left:0,top:0}).appendTo(container);if(!element.getContext){if(window.G_vmlCanvasManager){element=window.G_vmlCanvasManager.initElement(element);}else{throw new Error("Canvas is not available. If you're using IE with a fall-back such as Excanvas, then there's either a mistake in your conditional include, or the page has no DOCTYPE and is rendering in Quirks Mode.");}}}
this.element=element;var context=this.context=element.getContext("2d");var devicePixelRatio=window.devicePixelRatio||1,backingStoreRatio=context.webkitBackingStorePixelRatio||context.mozBackingStorePixelRatio||context.msBackingStorePixelRatio||context.oBackingStorePixelRatio||context.backingStorePixelRatio||1;this.pixelRatio=devicePixelRatio/backingStoreRatio;this.resize(container.width(),container.height());this.textContainer=null;this.text={};this._textCache={};}
Canvas.prototype.resize=function(width,height){if(width<=0||height<=0){throw new Error("Invalid dimensions for plot, width = "+width+", height = "+height);}
var element=this.element,context=this.context,pixelRatio=this.pixelRatio;if(this.width!=width){element.width=width*pixelRatio;element.style.width=width+"px";this.width=width;}
if(this.height!=height){element.height=height*pixelRatio;element.style.height=height+"px";this.height=height;}
context.restore();context.save();context.scale(pixelRatio,pixelRatio);};Canvas.prototype.clear=function(){this.context.clearRect(0,0,this.width,this.height);};Canvas.prototype.render=function(){var cache=this._textCache;for(var layerKey in cache){if(hasOwnProperty.call(cache,layerKey)){var layer=this.getTextLayer(layerKey),layerCache=cache[layerKey];layer.hide();for(var styleKey in layerCache){if(hasOwnProperty.call(layerCache,styleKey)){var styleCache=layerCache[styleKey];for(var key in styleCache){if(hasOwnProperty.call(styleCache,key)){var positions=styleCache[key].positions;for(var i=0,position;position=positions[i];i++){if(position.active){if(!position.rendered){layer.append(position.element);position.rendered=true;}}else{positions.splice(i--,1);if(position.rendered){position.element.detach();}}}
if(positions.length==0){delete styleCache[key];}}}}}
layer.show();}}};Canvas.prototype.getTextLayer=function(classes){var layer=this.text[classes];if(layer==null){if(this.textContainer==null){this.textContainer=$("<div class='flot-text'></div>").css({position:"absolute",top:0,left:0,bottom:0,right:0,'font-size':"smaller",color:"#545454"}).insertAfter(this.element);}
layer=this.text[classes]=$("<div></div>").addClass(classes).css({position:"absolute",top:0,left:0,bottom:0,right:0}).appendTo(this.textContainer);}
return layer;};Canvas.prototype.getTextInfo=function(layer,text,font,angle,width){var textStyle,layerCache,styleCache,info;text=""+text;if(typeof font==="object"){textStyle=font.style+" "+font.variant+" "+font.weight+" "+font.size+"px/"+font.lineHeight+"px "+font.family;}else{textStyle=font;}
layerCache=this._textCache[layer];if(layerCache==null){layerCache=this._textCache[layer]={};}
styleCache=layerCache[textStyle];if(styleCache==null){styleCache=layerCache[textStyle]={};}
info=styleCache[text];if(info==null){var element=$("<div></div>").html(text).css({position:"absolute",'max-width':width,top:-9999}).appendTo(this.getTextLayer(layer));if(typeof font==="object"){element.css({font:textStyle,color:font.color});}else if(typeof font==="string"){element.addClass(font);}
info=styleCache[text]={width:element.outerWidth(true),height:element.outerHeight(true),element:element,positions:[]};element.detach();}
return info;};Canvas.prototype.addText=function(layer,x,y,text,font,angle,width,halign,valign){var info=this.getTextInfo(layer,text,font,angle,width),positions=info.positions;if(halign=="center"){x-=info.width/2;}else if(halign=="right"){x-=info.width;}
if(valign=="middle"){y-=info.height/2;}else if(valign=="bottom"){y-=info.height;}
for(var i=0,position;position=positions[i];i++){if(position.x==x&&position.y==y){position.active=true;return;}}
position={active:true,rendered:false,element:positions.length?info.element.clone():info.element,x:x,y:y};positions.push(position);position.element.css({top:Math.round(y),left:Math.round(x),'text-align':halign});};Canvas.prototype.removeText=function(layer,x,y,text,font,angle){if(text==null){var layerCache=this._textCache[layer];if(layerCache!=null){for(var styleKey in layerCache){if(hasOwnProperty.call(layerCache,styleKey)){var styleCache=layerCache[styleKey];for(var key in styleCache){if(hasOwnProperty.call(styleCache,key)){var positions=styleCache[key].positions;for(var i=0,position;position=positions[i];i++){position.active=false;}}}}}}}else{var positions=this.getTextInfo(layer,text,font,angle).positions;for(var i=0,position;position=positions[i];i++){if(position.x==x&&position.y==y){position.active=false;}}}};function Plot(placeholder,data_,options_,plugins){var series=[],options={colors:["#edc240","#afd8f8","#cb4b4b","#4da74d","#9440ed"],legend:{show:true,noColumns:1,labelFormatter:null,labelBoxBorderColor:"#ccc",container:null,position:"ne",margin:5,backgroundColor:null,backgroundOpacity:0.85,sorted:null},xaxis:{show:null,position:"bottom",mode:null,font:null,color:null,tickColor:null,transform:null,inverseTransform:null,min:null,max:null,autoscaleMargin:null,ticks:null,tickFormatter:null,labelWidth:null,labelHeight:null,reserveSpace:null,tickLength:null,alignTicksWithAxis:null,tickDecimals:null,tickSize:null,minTickSize:null},yaxis:{autoscaleMargin:0.02,position:"left"},xaxes:[],yaxes:[],series:{points:{show:false,radius:3,lineWidth:2,fill:true,fillColor:"#ffffff",symbol:"circle"},lines:{lineWidth:2,fill:false,fillColor:null,steps:false},bars:{show:false,lineWidth:2,barWidth:1,fill:true,fillColor:null,align:"left",horizontal:false,zero:true},shadowSize:3,highlightColor:null},grid:{show:true,aboveData:false,color:"#545454",backgroundColor:null,borderColor:null,tickColor:null,margin:0,labelMargin:5,axisMargin:8,borderWidth:2,minBorderMargin:null,markings:null,markingsColor:"#f4f4f4",markingsLineWidth:2,clickable:false,hoverable:false,autoHighlight:true,mouseActiveRadius:10},interaction:{redrawOverlayInterval:1000/60},hooks:{}},surface=null,overlay=null,eventHolder=null,ctx=null,octx=null,xaxes=[],yaxes=[],plotOffset={left:0,right:0,top:0,bottom:0},plotWidth=0,plotHeight=0,hooks={processOptions:[],processRawData:[],processDatapoints:[],processOffset:[],drawBackground:[],drawSeries:[],draw:[],bindEvents:[],drawOverlay:[],shutdown:[]},plot=this;plot.setData=setData;plot.setupGrid=setupGrid;plot.draw=draw;plot.getPlaceholder=function(){return placeholder;};plot.getCanvas=function(){return surface.element;};plot.getPlotOffset=function(){return plotOffset;};plot.width=function(){return plotWidth;};plot.height=function(){return plotHeight;};plot.offset=function(){var o=eventHolder.offset();o.left+=plotOffset.left;o.top+=plotOffset.top;return o;};plot.getData=function(){return series;};plot.getAxes=function(){var res={},i;$.each(xaxes.concat(yaxes),function(_,axis){if(axis)
res[axis.direction+(axis.n!=1?axis.n:"")+"axis"]=axis;});return res;};plot.getXAxes=function(){return xaxes;};plot.getYAxes=function(){return yaxes;};plot.c2p=canvasToAxisCoords;plot.p2c=axisToCanvasCoords;plot.getOptions=function(){return options;};plot.highlight=highlight;plot.unhighlight=unhighlight;plot.triggerRedrawOverlay=triggerRedrawOverlay;plot.pointOffset=function(point){return{left:parseInt(xaxes[axisNumber(point,"x")-1].p2c(+point.x)+plotOffset.left,10),top:parseInt(yaxes[axisNumber(point,"y")-1].p2c(+point.y)+plotOffset.top,10)};};plot.shutdown=shutdown;plot.resize=function(){var width=placeholder.width(),height=placeholder.height();surface.resize(width,height);overlay.resize(width,height);};plot.hooks=hooks;initPlugins(plot);parseOptions(options_);setupCanvases();setData(data_);setupGrid();draw();bindEvents();function executeHooks(hook,args){args=[plot].concat(args);for(var i=0;i<hook.length;++i)
hook[i].apply(this,args);}
function initPlugins(){var classes={Canvas:Canvas};for(var i=0;i<plugins.length;++i){var p=plugins[i];p.init(plot,classes);if(p.options)
$.extend(true,options,p.options);}}
function parseOptions(opts){$.extend(true,options,opts);if(opts&&opts.colors){options.colors=opts.colors;}
if(options.xaxis.color==null)
options.xaxis.color=$.color.parse(options.grid.color).scale('a',0.22).toString();if(options.yaxis.color==null)
options.yaxis.color=$.color.parse(options.grid.color).scale('a',0.22).toString();if(options.xaxis.tickColor==null)
options.xaxis.tickColor=options.grid.tickColor||options.xaxis.color;if(options.yaxis.tickColor==null)
options.yaxis.tickColor=options.grid.tickColor||options.yaxis.color;if(options.grid.borderColor==null)
options.grid.borderColor=options.grid.color;if(options.grid.tickColor==null)
options.grid.tickColor=$.color.parse(options.grid.color).scale('a',0.22).toString();var i,axisOptions,axisCount,fontDefaults={style:placeholder.css("font-style"),size:Math.round(0.8*(+placeholder.css("font-size").replace("px","")||13)),variant:placeholder.css("font-variant"),weight:placeholder.css("font-weight"),family:placeholder.css("font-family")};fontDefaults.lineHeight=fontDefaults.size*1.15;axisCount=options.xaxes.length||1;for(i=0;i<axisCount;++i){axisOptions=options.xaxes[i];if(axisOptions&&!axisOptions.tickColor){axisOptions.tickColor=axisOptions.color;}
axisOptions=$.extend(true,{},options.xaxis,axisOptions);options.xaxes[i]=axisOptions;if(axisOptions.font){axisOptions.font=$.extend({},fontDefaults,axisOptions.font);if(!axisOptions.font.color){axisOptions.font.color=axisOptions.color;}}}
axisCount=options.yaxes.length||1;for(i=0;i<axisCount;++i){axisOptions=options.yaxes[i];if(axisOptions&&!axisOptions.tickColor){axisOptions.tickColor=axisOptions.color;}
axisOptions=$.extend(true,{},options.yaxis,axisOptions);options.yaxes[i]=axisOptions;if(axisOptions.font){axisOptions.font=$.extend({},fontDefaults,axisOptions.font);if(!axisOptions.font.color){axisOptions.font.color=axisOptions.color;}}}
if(options.xaxis.noTicks&&options.xaxis.ticks==null)
options.xaxis.ticks=options.xaxis.noTicks;if(options.yaxis.noTicks&&options.yaxis.ticks==null)
options.yaxis.ticks=options.yaxis.noTicks;if(options.x2axis){options.xaxes[1]=$.extend(true,{},options.xaxis,options.x2axis);options.xaxes[1].position="top";}
if(options.y2axis){options.yaxes[1]=$.extend(true,{},options.yaxis,options.y2axis);options.yaxes[1].position="right";}
if(options.grid.coloredAreas)
options.grid.markings=options.grid.coloredAreas;if(options.grid.coloredAreasColor)
options.grid.markingsColor=options.grid.coloredAreasColor;if(options.lines)
$.extend(true,options.series.lines,options.lines);if(options.points)
$.extend(true,options.series.points,options.points);if(options.bars)
$.extend(true,options.series.bars,options.bars);if(options.shadowSize!=null)
options.series.shadowSize=options.shadowSize;if(options.highlightColor!=null)
options.series.highlightColor=options.highlightColor;for(i=0;i<options.xaxes.length;++i)
getOrCreateAxis(xaxes,i+1).options=options.xaxes[i];for(i=0;i<options.yaxes.length;++i)
getOrCreateAxis(yaxes,i+1).options=options.yaxes[i];for(var n in hooks)
if(options.hooks[n]&&options.hooks[n].length)
hooks[n]=hooks[n].concat(options.hooks[n]);executeHooks(hooks.processOptions,[options]);}
function setData(d){series=parseData(d);fillInSeriesOptions();processData();}
function parseData(d){var res=[];for(var i=0;i<d.length;++i){var s=$.extend(true,{},options.series);if(d[i].data!=null){s.data=d[i].data;delete d[i].data;$.extend(true,s,d[i]);d[i].data=s.data;}
else
s.data=d[i];res.push(s);}
return res;}
function axisNumber(obj,coord){var a=obj[coord+"axis"];if(typeof a=="object")
a=a.n;if(typeof a!="number")
a=1;return a;}
function allAxes(){return $.grep(xaxes.concat(yaxes),function(a){return a;});}
function canvasToAxisCoords(pos){var res={},i,axis;for(i=0;i<xaxes.length;++i){axis=xaxes[i];if(axis&&axis.used)
res["x"+axis.n]=axis.c2p(pos.left);}
for(i=0;i<yaxes.length;++i){axis=yaxes[i];if(axis&&axis.used)
res["y"+axis.n]=axis.c2p(pos.top);}
if(res.x1!==undefined)
res.x=res.x1;if(res.y1!==undefined)
res.y=res.y1;return res;}
function axisToCanvasCoords(pos){var res={},i,axis,key;for(i=0;i<xaxes.length;++i){axis=xaxes[i];if(axis&&axis.used){key="x"+axis.n;if(pos[key]==null&&axis.n==1)
key="x";if(pos[key]!=null){res.left=axis.p2c(pos[key]);break;}}}
for(i=0;i<yaxes.length;++i){axis=yaxes[i];if(axis&&axis.used){key="y"+axis.n;if(pos[key]==null&&axis.n==1)
key="y";if(pos[key]!=null){res.top=axis.p2c(pos[key]);break;}}}
return res;}
function getOrCreateAxis(axes,number){if(!axes[number-1])
axes[number-1]={n:number,direction:axes==xaxes?"x":"y",options:$.extend(true,{},axes==xaxes?options.xaxis:options.yaxis)};return axes[number-1];}
function fillInSeriesOptions(){var neededColors=series.length,maxIndex=-1,i;for(i=0;i<series.length;++i){var sc=series[i].color;if(sc!=null){neededColors--;if(typeof sc=="number"&&sc>maxIndex){maxIndex=sc;}}}
if(neededColors<=maxIndex){neededColors=maxIndex+1;}
var c,colors=[],colorPool=options.colors,colorPoolSize=colorPool.length,variation=0;for(i=0;i<neededColors;i++){c=$.color.parse(colorPool[i%colorPoolSize]||"#666");if(i%colorPoolSize==0&&i){if(variation>=0){if(variation<0.5){variation=-variation-0.2;}else variation=0;}else variation=-variation;}
colors[i]=c.scale('rgb',1+variation);}
var colori=0,s;for(i=0;i<series.length;++i){s=series[i];if(s.color==null){s.color=colors[colori].toString();++colori;}
else if(typeof s.color=="number")
s.color=colors[s.color].toString();if(s.lines.show==null){var v,show=true;for(v in s)
if(s[v]&&s[v].show){show=false;break;}
if(show)
s.lines.show=true;}
if(s.lines.zero==null){s.lines.zero=!!s.lines.fill;}
s.xaxis=getOrCreateAxis(xaxes,axisNumber(s,"x"));s.yaxis=getOrCreateAxis(yaxes,axisNumber(s,"y"));}}
function processData(){var topSentry=Number.POSITIVE_INFINITY,bottomSentry=Number.NEGATIVE_INFINITY,fakeInfinity=Number.MAX_VALUE,i,j,k,m,length,s,points,ps,x,y,axis,val,f,p,data,format;function updateAxis(axis,min,max){if(min<axis.datamin&&min!=-fakeInfinity)
axis.datamin=min;if(max>axis.datamax&&max!=fakeInfinity)
axis.datamax=max;}
$.each(allAxes(),function(_,axis){axis.datamin=topSentry;axis.datamax=bottomSentry;axis.used=false;});for(i=0;i<series.length;++i){s=series[i];s.datapoints={points:[]};executeHooks(hooks.processRawData,[s,s.data,s.datapoints]);}
for(i=0;i<series.length;++i){s=series[i];data=s.data;format=s.datapoints.format;if(!format){format=[];format.push({x:true,number:true,required:true});format.push({y:true,number:true,required:true});if(s.bars.show||(s.lines.show&&s.lines.fill)){var autoscale=!!((s.bars.show&&s.bars.zero)||(s.lines.show&&s.lines.zero));format.push({y:true,number:true,required:false,defaultValue:0,autoscale:autoscale});if(s.bars.horizontal){delete format[format.length-1].y;format[format.length-1].x=true;}}
s.datapoints.format=format;}
if(s.datapoints.pointsize!=null)
continue;s.datapoints.pointsize=format.length;ps=s.datapoints.pointsize;points=s.datapoints.points;var insertSteps=s.lines.show&&s.lines.steps;s.xaxis.used=s.yaxis.used=true;for(j=k=0;j<data.length;++j,k+=ps){p=data[j];var nullify=p==null;if(!nullify){for(m=0;m<ps;++m){val=p[m];f=format[m];if(f){if(f.number&&val!=null){val=+val;if(isNaN(val))
val=null;else if(val==Infinity)
val=fakeInfinity;else if(val==-Infinity)
val=-fakeInfinity;}
if(val==null){if(f.required)
nullify=true;if(f.defaultValue!=null)
val=f.defaultValue;}}
points[k+m]=val;}}
if(nullify){for(m=0;m<ps;++m){val=points[k+m];if(val!=null){f=format[m];if(f.autoscale){if(f.x){updateAxis(s.xaxis,val,val);}
if(f.y){updateAxis(s.yaxis,val,val);}}}
points[k+m]=null;}}
else{if(insertSteps&&k>0&&points[k-ps]!=null&&points[k-ps]!=points[k]&&points[k-ps+1]!=points[k+1]){for(m=0;m<ps;++m)
points[k+ps+m]=points[k+m];points[k+1]=points[k-ps+1];k+=ps;}}}}
for(i=0;i<series.length;++i){s=series[i];executeHooks(hooks.processDatapoints,[s,s.datapoints]);}
for(i=0;i<series.length;++i){s=series[i];points=s.datapoints.points;ps=s.datapoints.pointsize;format=s.datapoints.format;var xmin=topSentry,ymin=topSentry,xmax=bottomSentry,ymax=bottomSentry;for(j=0;j<points.length;j+=ps){if(points[j]==null)
continue;for(m=0;m<ps;++m){val=points[j+m];f=format[m];if(!f||f.autoscale===false||val==fakeInfinity||val==-fakeInfinity)
continue;if(f.x){if(val<xmin)
xmin=val;if(val>xmax)
xmax=val;}
if(f.y){if(val<ymin)
ymin=val;if(val>ymax)
ymax=val;}}}
if(s.bars.show){var delta;switch(s.bars.align){case"left":delta=0;break;case"right":delta=-s.bars.barWidth;break;case"center":delta=-s.bars.barWidth/2;break;default:throw new Error("Invalid bar alignment: "+s.bars.align);}
if(s.bars.horizontal){ymin+=delta;ymax+=delta+s.bars.barWidth;}
else{xmin+=delta;xmax+=delta+s.bars.barWidth;}}
updateAxis(s.xaxis,xmin,xmax);updateAxis(s.yaxis,ymin,ymax);}
$.each(allAxes(),function(_,axis){if(axis.datamin==topSentry)
axis.datamin=null;if(axis.datamax==bottomSentry)
axis.datamax=null;});}
function setupCanvases(){placeholder.css("padding",0).children(":not(.flot-base,.flot-overlay)").remove();if(placeholder.css("position")=='static')
placeholder.css("position","relative");surface=new Canvas("flot-base",placeholder);overlay=new Canvas("flot-overlay",placeholder);ctx=surface.context;octx=overlay.context;eventHolder=$(overlay.element).unbind();var existing=placeholder.data("plot");if(existing){existing.shutdown();overlay.clear();}
placeholder.data("plot",plot);}
function bindEvents(){if(options.grid.hoverable){eventHolder.mousemove(onMouseMove);eventHolder.bind("mouseleave",onMouseLeave);}
if(options.grid.clickable)
eventHolder.click(onClick);executeHooks(hooks.bindEvents,[eventHolder]);}
function shutdown(){if(redrawTimeout)
clearTimeout(redrawTimeout);eventHolder.unbind("mousemove",onMouseMove);eventHolder.unbind("mouseleave",onMouseLeave);eventHolder.unbind("click",onClick);executeHooks(hooks.shutdown,[eventHolder]);}
function setTransformationHelpers(axis){function identity(x){return x;}
var s,m,t=axis.options.transform||identity,it=axis.options.inverseTransform;if(axis.direction=="x"){s=axis.scale=plotWidth/Math.abs(t(axis.max)-t(axis.min));m=Math.min(t(axis.max),t(axis.min));}
else{s=axis.scale=plotHeight/Math.abs(t(axis.max)-t(axis.min));s=-s;m=Math.max(t(axis.max),t(axis.min));}
if(t==identity)
axis.p2c=function(p){return(p-m)*s;};else
axis.p2c=function(p){return(t(p)-m)*s;};if(!it)
axis.c2p=function(c){return m+c/s;};else
axis.c2p=function(c){return it(m+c/s);};}
function measureTickLabels(axis){var opts=axis.options,ticks=axis.ticks||[],labelWidth=opts.labelWidth||0,labelHeight=opts.labelHeight||0,maxWidth=labelWidth||axis.direction=="x"?Math.floor(surface.width/(ticks.length||1)):null,legacyStyles=axis.direction+"Axis "+axis.direction+axis.n+"Axis",layer="flot-"+axis.direction+"-axis flot-"+axis.direction+axis.n+"-axis "+legacyStyles,font=opts.font||"flot-tick-label tickLabel";for(var i=0;i<ticks.length;++i){var t=ticks[i];if(!t.label)
continue;var info=surface.getTextInfo(layer,t.label,font,null,maxWidth);labelWidth=Math.max(labelWidth,info.width);labelHeight=Math.max(labelHeight,info.height);}
axis.labelWidth=opts.labelWidth||labelWidth;axis.labelHeight=opts.labelHeight||labelHeight;}
function allocateAxisBoxFirstPhase(axis){var lw=axis.labelWidth,lh=axis.labelHeight,pos=axis.options.position,tickLength=axis.options.tickLength,axisMargin=options.grid.axisMargin,padding=options.grid.labelMargin,all=axis.direction=="x"?xaxes:yaxes,index,innermost;var samePosition=$.grep(all,function(a){return a&&a.options.position==pos&&a.reserveSpace;});if($.inArray(axis,samePosition)==samePosition.length-1)
axisMargin=0;innermost=$.inArray(axis,samePosition)==0;if(tickLength==null){if(innermost)
tickLength="full";else
tickLength=5;}
if(!isNaN(+tickLength))
padding+=+tickLength;if(axis.direction=="x"){lh+=padding;if(pos=="bottom"){plotOffset.bottom+=lh+axisMargin;axis.box={top:surface.height-plotOffset.bottom,height:lh};}
else{axis.box={top:plotOffset.top+axisMargin,height:lh};plotOffset.top+=lh+axisMargin;}}
else{lw+=padding;if(pos=="left"){axis.box={left:plotOffset.left+axisMargin,width:lw};plotOffset.left+=lw+axisMargin;}
else{plotOffset.right+=lw+axisMargin;axis.box={left:surface.width-plotOffset.right,width:lw};}}
axis.position=pos;axis.tickLength=tickLength;axis.box.padding=padding;axis.innermost=innermost;}
function allocateAxisBoxSecondPhase(axis){if(axis.direction=="x"){axis.box.left=plotOffset.left-axis.labelWidth/2;axis.box.width=surface.width-plotOffset.left-plotOffset.right+axis.labelWidth;}
else{axis.box.top=plotOffset.top-axis.labelHeight/2;axis.box.height=surface.height-plotOffset.bottom-plotOffset.top+axis.labelHeight;}}
function adjustLayoutForThingsStickingOut(){var minMargin=options.grid.minBorderMargin,margins={x:0,y:0},i,axis;if(minMargin==null){minMargin=0;for(i=0;i<series.length;++i)
minMargin=Math.max(minMargin,2*(series[i].points.radius+series[i].points.lineWidth/2));}
margins.x=margins.y=Math.ceil(minMargin);$.each(allAxes(),function(_,axis){var dir=axis.direction;if(axis.reserveSpace)
margins[dir]=Math.ceil(Math.max(margins[dir],(dir=="x"?axis.labelWidth:axis.labelHeight)/2));});plotOffset.left=Math.max(margins.x,plotOffset.left);plotOffset.right=Math.max(margins.x,plotOffset.right);plotOffset.top=Math.max(margins.y,plotOffset.top);plotOffset.bottom=Math.max(margins.y,plotOffset.bottom);}
function setupGrid(){var i,axes=allAxes(),showGrid=options.grid.show;for(var a in plotOffset){var margin=options.grid.margin||0;plotOffset[a]=typeof margin=="number"?margin:margin[a]||0;}
executeHooks(hooks.processOffset,[plotOffset]);for(var a in plotOffset){if(typeof(options.grid.borderWidth)=="object"){plotOffset[a]+=showGrid?options.grid.borderWidth[a]:0;}
else{plotOffset[a]+=showGrid?options.grid.borderWidth:0;}}
$.each(axes,function(_,axis){axis.show=axis.options.show;if(axis.show==null)
axis.show=axis.used;axis.reserveSpace=axis.show||axis.options.reserveSpace;setRange(axis);});if(showGrid){var allocatedAxes=$.grep(axes,function(axis){return axis.reserveSpace;});$.each(allocatedAxes,function(_,axis){setupTickGeneration(axis);setTicks(axis);snapRangeToTicks(axis,axis.ticks);measureTickLabels(axis);});for(i=allocatedAxes.length-1;i>=0;--i)
allocateAxisBoxFirstPhase(allocatedAxes[i]);adjustLayoutForThingsStickingOut();$.each(allocatedAxes,function(_,axis){allocateAxisBoxSecondPhase(axis);});}
plotWidth=surface.width-plotOffset.left-plotOffset.right;plotHeight=surface.height-plotOffset.bottom-plotOffset.top;$.each(axes,function(_,axis){setTransformationHelpers(axis);});if(showGrid){drawAxisLabels();}
insertLegend();}
function setRange(axis){var opts=axis.options,min=+(opts.min!=null?opts.min:axis.datamin),max=+(opts.max!=null?opts.max:axis.datamax),delta=max-min;if(delta==0.0){var widen=max==0?1:0.01;if(opts.min==null)
min-=widen;if(opts.max==null||opts.min!=null)
max+=widen;}
else{var margin=opts.autoscaleMargin;if(margin!=null){if(opts.min==null){min-=delta*margin;if(min<0&&axis.datamin!=null&&axis.datamin>=0)
min=0;}
if(opts.max==null){max+=delta*margin;if(max>0&&axis.datamax!=null&&axis.datamax<=0)
max=0;}}}
axis.min=min;axis.max=max;}
function setupTickGeneration(axis){var opts=axis.options;var noTicks;if(typeof opts.ticks=="number"&&opts.ticks>0)
noTicks=opts.ticks;else
noTicks=0.3*Math.sqrt(axis.direction=="x"?surface.width:surface.height);var delta=(axis.max-axis.min)/noTicks,dec=-Math.floor(Math.log(delta)/Math.LN10),maxDec=opts.tickDecimals;if(maxDec!=null&&dec>maxDec){dec=maxDec;}
var magn=Math.pow(10,-dec),norm=delta/magn,size;if(norm<1.5){size=1;}else if(norm<3){size=2;if(norm>2.25&&(maxDec==null||dec+1<=maxDec)){size=2.5;++dec;}}else if(norm<7.5){size=5;}else{size=10;}
size*=magn;if(opts.minTickSize!=null&&size<opts.minTickSize){size=opts.minTickSize;}
axis.delta=delta;axis.tickDecimals=Math.max(0,maxDec!=null?maxDec:dec);axis.tickSize=opts.tickSize||size;if(opts.mode=="time"&&!axis.tickGenerator){throw new Error("Time mode requires the flot.time plugin.");}
if(!axis.tickGenerator){axis.tickGenerator=function(axis){var ticks=[],start=floorInBase(axis.min,axis.tickSize),i=0,v=Number.NaN,prev;do{prev=v;v=start+i*axis.tickSize;ticks.push(v);++i;}while(v<axis.max&&v!=prev);return ticks;};axis.tickFormatter=function(value,axis){var factor=axis.tickDecimals?Math.pow(10,axis.tickDecimals):1;var formatted=""+Math.round(value*factor)/factor;if(axis.tickDecimals!=null){var decimal=formatted.indexOf(".");var precision=decimal==-1?0:formatted.length-decimal-1;if(precision<axis.tickDecimals){return(precision?formatted:formatted+".")+(""+factor).substr(1,axis.tickDecimals-precision);}}
return formatted;};}
if($.isFunction(opts.tickFormatter))
axis.tickFormatter=function(v,axis){return""+opts.tickFormatter(v,axis);};if(opts.alignTicksWithAxis!=null){var otherAxis=(axis.direction=="x"?xaxes:yaxes)[opts.alignTicksWithAxis-1];if(otherAxis&&otherAxis.used&&otherAxis!=axis){var niceTicks=axis.tickGenerator(axis);if(niceTicks.length>0){if(opts.min==null)
axis.min=Math.min(axis.min,niceTicks[0]);if(opts.max==null&&niceTicks.length>1)
axis.max=Math.max(axis.max,niceTicks[niceTicks.length-1]);}
axis.tickGenerator=function(axis){var ticks=[],v,i;for(i=0;i<otherAxis.ticks.length;++i){v=(otherAxis.ticks[i].v-otherAxis.min)/(otherAxis.max-otherAxis.min);v=axis.min+v*(axis.max-axis.min);ticks.push(v);}
return ticks;};if(!axis.mode&&opts.tickDecimals==null){var extraDec=Math.max(0,-Math.floor(Math.log(axis.delta)/Math.LN10)+1),ts=axis.tickGenerator(axis);if(!(ts.length>1&&/\..*0$/.test((ts[1]-ts[0]).toFixed(extraDec))))
axis.tickDecimals=extraDec;}}}}
function setTicks(axis){var oticks=axis.options.ticks,ticks=[];if(oticks==null||(typeof oticks=="number"&&oticks>0))
ticks=axis.tickGenerator(axis);else if(oticks){if($.isFunction(oticks))
ticks=oticks(axis);else
ticks=oticks;}
var i,v;axis.ticks=[];for(i=0;i<ticks.length;++i){var label=null;var t=ticks[i];if(typeof t=="object"){v=+t[0];if(t.length>1)
label=t[1];}
else
v=+t;if(label==null)
label=axis.tickFormatter(v,axis);if(!isNaN(v))
axis.ticks.push({v:v,label:label});}}
function snapRangeToTicks(axis,ticks){if(axis.options.autoscaleMargin&&ticks.length>0){if(axis.options.min==null)
axis.min=Math.min(axis.min,ticks[0].v);if(axis.options.max==null&&ticks.length>1)
axis.max=Math.max(axis.max,ticks[ticks.length-1].v);}}
function draw(){surface.clear();executeHooks(hooks.drawBackground,[ctx]);var grid=options.grid;if(grid.show&&grid.backgroundColor)
drawBackground();if(grid.show&&!grid.aboveData){drawGrid();}
for(var i=0;i<series.length;++i){executeHooks(hooks.drawSeries,[ctx,series[i]]);drawSeries(series[i]);}
executeHooks(hooks.draw,[ctx]);if(grid.show&&grid.aboveData){drawGrid();}
surface.render();triggerRedrawOverlay();}
function extractRange(ranges,coord){var axis,from,to,key,axes=allAxes();for(var i=0;i<axes.length;++i){axis=axes[i];if(axis.direction==coord){key=coord+axis.n+"axis";if(!ranges[key]&&axis.n==1)
key=coord+"axis";if(ranges[key]){from=ranges[key].from;to=ranges[key].to;break;}}}
if(!ranges[key]){axis=coord=="x"?xaxes[0]:yaxes[0];from=ranges[coord+"1"];to=ranges[coord+"2"];}
if(from!=null&&to!=null&&from>to){var tmp=from;from=to;to=tmp;}
return{from:from,to:to,axis:axis};}
function drawBackground(){ctx.save();ctx.translate(plotOffset.left,plotOffset.top);ctx.fillStyle=getColorOrGradient(options.grid.backgroundColor,plotHeight,0,"rgba(255, 255, 255, 0)");ctx.fillRect(0,0,plotWidth,plotHeight);ctx.restore();}
function drawGrid(){var i,axes,bw,bc;ctx.save();ctx.translate(plotOffset.left,plotOffset.top);var markings=options.grid.markings;if(markings){if($.isFunction(markings)){axes=plot.getAxes();axes.xmin=axes.xaxis.min;axes.xmax=axes.xaxis.max;axes.ymin=axes.yaxis.min;axes.ymax=axes.yaxis.max;markings=markings(axes);}
for(i=0;i<markings.length;++i){var m=markings[i],xrange=extractRange(m,"x"),yrange=extractRange(m,"y");if(xrange.from==null)
xrange.from=xrange.axis.min;if(xrange.to==null)
xrange.to=xrange.axis.max;if(yrange.from==null)
yrange.from=yrange.axis.min;if(yrange.to==null)
yrange.to=yrange.axis.max;if(xrange.to<xrange.axis.min||xrange.from>xrange.axis.max||yrange.to<yrange.axis.min||yrange.from>yrange.axis.max)
continue;xrange.from=Math.max(xrange.from,xrange.axis.min);xrange.to=Math.min(xrange.to,xrange.axis.max);yrange.from=Math.max(yrange.from,yrange.axis.min);yrange.to=Math.min(yrange.to,yrange.axis.max);if(xrange.from==xrange.to&&yrange.from==yrange.to)
continue;xrange.from=xrange.axis.p2c(xrange.from);xrange.to=xrange.axis.p2c(xrange.to);yrange.from=yrange.axis.p2c(yrange.from);yrange.to=yrange.axis.p2c(yrange.to);if(xrange.from==xrange.to||yrange.from==yrange.to){ctx.beginPath();ctx.strokeStyle=m.color||options.grid.markingsColor;ctx.lineWidth=m.lineWidth||options.grid.markingsLineWidth;ctx.moveTo(xrange.from,yrange.from);ctx.lineTo(xrange.to,yrange.to);ctx.stroke();}
else{ctx.fillStyle=m.color||options.grid.markingsColor;ctx.fillRect(xrange.from,yrange.to,xrange.to-xrange.from,yrange.from-yrange.to);}}}
axes=allAxes();bw=options.grid.borderWidth;for(var j=0;j<axes.length;++j){var axis=axes[j],box=axis.box,t=axis.tickLength,x,y,xoff,yoff;if(!axis.show||axis.ticks.length==0)
continue;ctx.lineWidth=1;if(axis.direction=="x"){x=0;if(t=="full")
y=(axis.position=="top"?0:plotHeight);else
y=box.top-plotOffset.top+(axis.position=="top"?box.height:0);}
else{y=0;if(t=="full")
x=(axis.position=="left"?0:plotWidth);else
x=box.left-plotOffset.left+(axis.position=="left"?box.width:0);}
if(!axis.innermost){ctx.strokeStyle=axis.options.color;ctx.beginPath();xoff=yoff=0;if(axis.direction=="x")
xoff=plotWidth+1;else
yoff=plotHeight+1;if(ctx.lineWidth==1){if(axis.direction=="x"){y=Math.floor(y)+0.5;}else{x=Math.floor(x)+0.5;}}
ctx.moveTo(x,y);ctx.lineTo(x+xoff,y+yoff);ctx.stroke();}
ctx.strokeStyle=axis.options.tickColor;ctx.beginPath();for(i=0;i<axis.ticks.length;++i){var v=axis.ticks[i].v;xoff=yoff=0;if(isNaN(v)||v<axis.min||v>axis.max||(t=="full"&&((typeof bw=="object"&&bw[axis.position]>0)||bw>0)&&(v==axis.min||v==axis.max)))
continue;if(axis.direction=="x"){x=axis.p2c(v);yoff=t=="full"?-plotHeight:t;if(axis.position=="top")
yoff=-yoff;}
else{y=axis.p2c(v);xoff=t=="full"?-plotWidth:t;if(axis.position=="left")
xoff=-xoff;}
if(ctx.lineWidth==1){if(axis.direction=="x")
x=Math.floor(x)+0.5;else
y=Math.floor(y)+0.5;}
ctx.moveTo(x,y);ctx.lineTo(x+xoff,y+yoff);}
ctx.stroke();}
if(bw){bc=options.grid.borderColor;if(typeof bw=="object"||typeof bc=="object"){if(typeof bw!=="object"){bw={top:bw,right:bw,bottom:bw,left:bw};}
if(typeof bc!=="object"){bc={top:bc,right:bc,bottom:bc,left:bc};}
if(bw.top>0){ctx.strokeStyle=bc.top;ctx.lineWidth=bw.top;ctx.beginPath();ctx.moveTo(0-bw.left,0-bw.top/2);ctx.lineTo(plotWidth,0-bw.top/2);ctx.stroke();}
if(bw.right>0){ctx.strokeStyle=bc.right;ctx.lineWidth=bw.right;ctx.beginPath();ctx.moveTo(plotWidth+bw.right/2,0-bw.top);ctx.lineTo(plotWidth+bw.right/2,plotHeight);ctx.stroke();}
if(bw.bottom>0){ctx.strokeStyle=bc.bottom;ctx.lineWidth=bw.bottom;ctx.beginPath();ctx.moveTo(plotWidth+bw.right,plotHeight+bw.bottom/2);ctx.lineTo(0,plotHeight+bw.bottom/2);ctx.stroke();}
if(bw.left>0){ctx.strokeStyle=bc.left;ctx.lineWidth=bw.left;ctx.beginPath();ctx.moveTo(0-bw.left/2,plotHeight+bw.bottom);ctx.lineTo(0-bw.left/2,0);ctx.stroke();}}
else{ctx.lineWidth=bw;ctx.strokeStyle=options.grid.borderColor;ctx.strokeRect(-bw/2,-bw/2,plotWidth+bw,plotHeight+bw);}}
ctx.restore();}
function drawAxisLabels(){$.each(allAxes(),function(_,axis){if(!axis.show||axis.ticks.length==0)
return;var box=axis.box,legacyStyles=axis.direction+"Axis "+axis.direction+axis.n+"Axis",layer="flot-"+axis.direction+"-axis flot-"+axis.direction+axis.n+"-axis "+legacyStyles,font=axis.options.font||"flot-tick-label tickLabel",tick,x,y,halign,valign;surface.removeText(layer);for(var i=0;i<axis.ticks.length;++i){tick=axis.ticks[i];if(!tick.label||tick.v<axis.min||tick.v>axis.max)
continue;if(axis.direction=="x"){halign="center";x=plotOffset.left+axis.p2c(tick.v);if(axis.position=="bottom"){y=box.top+box.padding;}else{y=box.top+box.height-box.padding;valign="bottom";}}else{valign="middle";y=plotOffset.top+axis.p2c(tick.v);if(axis.position=="left"){x=box.left+box.width-box.padding;halign="right";}else{x=box.left+box.padding;}}
surface.addText(layer,x,y,tick.label,font,null,null,halign,valign);}});}
function drawSeries(series){if(series.lines.show)
drawSeriesLines(series);if(series.bars.show)
drawSeriesBars(series);if(series.points.show)
drawSeriesPoints(series);}
function drawSeriesLines(series){function plotLine(datapoints,xoffset,yoffset,axisx,axisy){var points=datapoints.points,ps=datapoints.pointsize,prevx=null,prevy=null;ctx.beginPath();for(var i=ps;i<points.length;i+=ps){var x1=points[i-ps],y1=points[i-ps+1],x2=points[i],y2=points[i+1];if(x1==null||x2==null)
continue;if(y1<=y2&&y1<axisy.min){if(y2<axisy.min)
continue;x1=(axisy.min-y1)/(y2-y1)*(x2-x1)+x1;y1=axisy.min;}
else if(y2<=y1&&y2<axisy.min){if(y1<axisy.min)
continue;x2=(axisy.min-y1)/(y2-y1)*(x2-x1)+x1;y2=axisy.min;}
if(y1>=y2&&y1>axisy.max){if(y2>axisy.max)
continue;x1=(axisy.max-y1)/(y2-y1)*(x2-x1)+x1;y1=axisy.max;}
else if(y2>=y1&&y2>axisy.max){if(y1>axisy.max)
continue;x2=(axisy.max-y1)/(y2-y1)*(x2-x1)+x1;y2=axisy.max;}
if(x1<=x2&&x1<axisx.min){if(x2<axisx.min)
continue;y1=(axisx.min-x1)/(x2-x1)*(y2-y1)+y1;x1=axisx.min;}
else if(x2<=x1&&x2<axisx.min){if(x1<axisx.min)
continue;y2=(axisx.min-x1)/(x2-x1)*(y2-y1)+y1;x2=axisx.min;}
if(x1>=x2&&x1>axisx.max){if(x2>axisx.max)
continue;y1=(axisx.max-x1)/(x2-x1)*(y2-y1)+y1;x1=axisx.max;}
else if(x2>=x1&&x2>axisx.max){if(x1>axisx.max)
continue;y2=(axisx.max-x1)/(x2-x1)*(y2-y1)+y1;x2=axisx.max;}
if(x1!=prevx||y1!=prevy)
ctx.moveTo(axisx.p2c(x1)+xoffset,axisy.p2c(y1)+yoffset);prevx=x2;prevy=y2;ctx.lineTo(axisx.p2c(x2)+xoffset,axisy.p2c(y2)+yoffset);}
ctx.stroke();}
function plotLineArea(datapoints,axisx,axisy){var points=datapoints.points,ps=datapoints.pointsize,bottom=Math.min(Math.max(0,axisy.min),axisy.max),i=0,top,areaOpen=false,ypos=1,segmentStart=0,segmentEnd=0;while(true){if(ps>0&&i>points.length+ps)
break;i+=ps;var x1=points[i-ps],y1=points[i-ps+ypos],x2=points[i],y2=points[i+ypos];if(areaOpen){if(ps>0&&x1!=null&&x2==null){segmentEnd=i;ps=-ps;ypos=2;continue;}
if(ps<0&&i==segmentStart+ps){ctx.fill();areaOpen=false;ps=-ps;ypos=1;i=segmentStart=segmentEnd+ps;continue;}}
if(x1==null||x2==null)
continue;if(x1<=x2&&x1<axisx.min){if(x2<axisx.min)
continue;y1=(axisx.min-x1)/(x2-x1)*(y2-y1)+y1;x1=axisx.min;}
else if(x2<=x1&&x2<axisx.min){if(x1<axisx.min)
continue;y2=(axisx.min-x1)/(x2-x1)*(y2-y1)+y1;x2=axisx.min;}
if(x1>=x2&&x1>axisx.max){if(x2>axisx.max)
continue;y1=(axisx.max-x1)/(x2-x1)*(y2-y1)+y1;x1=axisx.max;}
else if(x2>=x1&&x2>axisx.max){if(x1>axisx.max)
continue;y2=(axisx.max-x1)/(x2-x1)*(y2-y1)+y1;x2=axisx.max;}
if(!areaOpen){ctx.beginPath();ctx.moveTo(axisx.p2c(x1),axisy.p2c(bottom));areaOpen=true;}
if(y1>=axisy.max&&y2>=axisy.max){ctx.lineTo(axisx.p2c(x1),axisy.p2c(axisy.max));ctx.lineTo(axisx.p2c(x2),axisy.p2c(axisy.max));continue;}
else if(y1<=axisy.min&&y2<=axisy.min){ctx.lineTo(axisx.p2c(x1),axisy.p2c(axisy.min));ctx.lineTo(axisx.p2c(x2),axisy.p2c(axisy.min));continue;}
var x1old=x1,x2old=x2;if(y1<=y2&&y1<axisy.min&&y2>=axisy.min){x1=(axisy.min-y1)/(y2-y1)*(x2-x1)+x1;y1=axisy.min;}
else if(y2<=y1&&y2<axisy.min&&y1>=axisy.min){x2=(axisy.min-y1)/(y2-y1)*(x2-x1)+x1;y2=axisy.min;}
if(y1>=y2&&y1>axisy.max&&y2<=axisy.max){x1=(axisy.max-y1)/(y2-y1)*(x2-x1)+x1;y1=axisy.max;}
else if(y2>=y1&&y2>axisy.max&&y1<=axisy.max){x2=(axisy.max-y1)/(y2-y1)*(x2-x1)+x1;y2=axisy.max;}
if(x1!=x1old){ctx.lineTo(axisx.p2c(x1old),axisy.p2c(y1));}
ctx.lineTo(axisx.p2c(x1),axisy.p2c(y1));ctx.lineTo(axisx.p2c(x2),axisy.p2c(y2));if(x2!=x2old){ctx.lineTo(axisx.p2c(x2),axisy.p2c(y2));ctx.lineTo(axisx.p2c(x2old),axisy.p2c(y2));}}}
ctx.save();ctx.translate(plotOffset.left,plotOffset.top);ctx.lineJoin="round";var lw=series.lines.lineWidth,sw=series.shadowSize;if(lw>0&&sw>0){ctx.lineWidth=sw;ctx.strokeStyle="rgba(0,0,0,0.1)";var angle=Math.PI/18;plotLine(series.datapoints,Math.sin(angle)*(lw/2+sw/2),Math.cos(angle)*(lw/2+sw/2),series.xaxis,series.yaxis);ctx.lineWidth=sw/2;plotLine(series.datapoints,Math.sin(angle)*(lw/2+sw/4),Math.cos(angle)*(lw/2+sw/4),series.xaxis,series.yaxis);}
ctx.lineWidth=lw;ctx.strokeStyle=series.color;var fillStyle=getFillStyle(series.lines,series.color,0,plotHeight);if(fillStyle){ctx.fillStyle=fillStyle;plotLineArea(series.datapoints,series.xaxis,series.yaxis);}
if(lw>0)
plotLine(series.datapoints,0,0,series.xaxis,series.yaxis);ctx.restore();}
function drawSeriesPoints(series){function plotPoints(datapoints,radius,fillStyle,offset,shadow,axisx,axisy,symbol){var points=datapoints.points,ps=datapoints.pointsize;for(var i=0;i<points.length;i+=ps){var x=points[i],y=points[i+1];if(x==null||x<axisx.min||x>axisx.max||y<axisy.min||y>axisy.max)
continue;ctx.beginPath();x=axisx.p2c(x);y=axisy.p2c(y)+offset;if(symbol=="circle")
ctx.arc(x,y,radius,0,shadow?Math.PI:Math.PI*2,false);else
symbol(ctx,x,y,radius,shadow);ctx.closePath();if(fillStyle){ctx.fillStyle=fillStyle;ctx.fill();}
ctx.stroke();}}
ctx.save();ctx.translate(plotOffset.left,plotOffset.top);var lw=series.points.lineWidth,sw=series.shadowSize,radius=series.points.radius,symbol=series.points.symbol;if(lw==0)
lw=0.0001;if(lw>0&&sw>0){var w=sw/2;ctx.lineWidth=w;ctx.strokeStyle="rgba(0,0,0,0.1)";plotPoints(series.datapoints,radius,null,w+w/2,true,series.xaxis,series.yaxis,symbol);ctx.strokeStyle="rgba(0,0,0,0.2)";plotPoints(series.datapoints,radius,null,w/2,true,series.xaxis,series.yaxis,symbol);}
ctx.lineWidth=lw;ctx.strokeStyle=series.color;plotPoints(series.datapoints,radius,getFillStyle(series.points,series.color),0,false,series.xaxis,series.yaxis,symbol);ctx.restore();}
function drawBar(x,y,b,barLeft,barRight,offset,fillStyleCallback,axisx,axisy,c,horizontal,lineWidth){var left,right,bottom,top,drawLeft,drawRight,drawTop,drawBottom,tmp;if(horizontal){drawBottom=drawRight=drawTop=true;drawLeft=false;left=b;right=x;top=y+barLeft;bottom=y+barRight;if(right<left){tmp=right;right=left;left=tmp;drawLeft=true;drawRight=false;}}
else{drawLeft=drawRight=drawTop=true;drawBottom=false;left=x+barLeft;right=x+barRight;bottom=b;top=y;if(top<bottom){tmp=top;top=bottom;bottom=tmp;drawBottom=true;drawTop=false;}}
if(right<axisx.min||left>axisx.max||top<axisy.min||bottom>axisy.max)
return;if(left<axisx.min){left=axisx.min;drawLeft=false;}
if(right>axisx.max){right=axisx.max;drawRight=false;}
if(bottom<axisy.min){bottom=axisy.min;drawBottom=false;}
if(top>axisy.max){top=axisy.max;drawTop=false;}
left=axisx.p2c(left);bottom=axisy.p2c(bottom);right=axisx.p2c(right);top=axisy.p2c(top);if(fillStyleCallback){c.beginPath();c.moveTo(left,bottom);c.lineTo(left,top);c.lineTo(right,top);c.lineTo(right,bottom);c.fillStyle=fillStyleCallback(bottom,top);c.fill();}
if(lineWidth>0&&(drawLeft||drawRight||drawTop||drawBottom)){c.beginPath();c.moveTo(left,bottom+offset);if(drawLeft)
c.lineTo(left,top+offset);else
c.moveTo(left,top+offset);if(drawTop)
c.lineTo(right,top+offset);else
c.moveTo(right,top+offset);if(drawRight)
c.lineTo(right,bottom+offset);else
c.moveTo(right,bottom+offset);if(drawBottom)
c.lineTo(left,bottom+offset);else
c.moveTo(left,bottom+offset);c.stroke();}}
function drawSeriesBars(series){function plotBars(datapoints,barLeft,barRight,offset,fillStyleCallback,axisx,axisy){var points=datapoints.points,ps=datapoints.pointsize;for(var i=0;i<points.length;i+=ps){if(points[i]==null)
continue;drawBar(points[i],points[i+1],points[i+2],barLeft,barRight,offset,fillStyleCallback,axisx,axisy,ctx,series.bars.horizontal,series.bars.lineWidth);}}
ctx.save();ctx.translate(plotOffset.left,plotOffset.top);ctx.lineWidth=series.bars.lineWidth;ctx.strokeStyle=series.color;var barLeft;switch(series.bars.align){case"left":barLeft=0;break;case"right":barLeft=-series.bars.barWidth;break;case"center":barLeft=-series.bars.barWidth/2;break;default:throw new Error("Invalid bar alignment: "+series.bars.align);}
var fillStyleCallback=series.bars.fill?function(bottom,top){return getFillStyle(series.bars,series.color,bottom,top);}:null;plotBars(series.datapoints,barLeft,barLeft+series.bars.barWidth,0,fillStyleCallback,series.xaxis,series.yaxis);ctx.restore();}
function getFillStyle(filloptions,seriesColor,bottom,top){var fill=filloptions.fill;if(!fill)
return null;if(filloptions.fillColor)
return getColorOrGradient(filloptions.fillColor,bottom,top,seriesColor);var c=$.color.parse(seriesColor);c.a=typeof fill=="number"?fill:0.4;c.normalize();return c.toString();}
function insertLegend(){placeholder.find(".legend").remove();if(!options.legend.show)
return;var fragments=[],entries=[],rowStarted=false,lf=options.legend.labelFormatter,s,label;for(var i=0;i<series.length;++i){s=series[i];if(s.label){label=lf?lf(s.label,s):s.label;if(label){entries.push({label:label,color:s.color});}}}
if(options.legend.sorted){if($.isFunction(options.legend.sorted)){entries.sort(options.legend.sorted);}else if(options.legend.sorted=="reverse"){entries.reverse();}else{var ascending=options.legend.sorted!="descending";entries.sort(function(a,b){return a.label==b.label?0:((a.label<b.label)!=ascending?1:-1);});}}
for(var i=0;i<entries.length;++i){var entry=entries[i];if(i%options.legend.noColumns==0){if(rowStarted)
fragments.push('</tr>');fragments.push('<tr>');rowStarted=true;}
fragments.push('<td class="legendColorBox"><div style="border:1px solid '+options.legend.labelBoxBorderColor+';padding:1px"><div style="width:4px;height:0;border:5px solid '+entry.color+';overflow:hidden"></div></div></td>'+'<td class="legendLabel">'+entry.label+'</td>');}
if(rowStarted)
fragments.push('</tr>');if(fragments.length==0)
return;var table='<table style="font-size:smaller;color:'+options.grid.color+'">'+fragments.join("")+'</table>';if(options.legend.container!=null)
$(options.legend.container).html(table);else{var pos="",p=options.legend.position,m=options.legend.margin;if(m[0]==null)
m=[m,m];if(p.charAt(0)=="n")
pos+='top:'+(m[1]+plotOffset.top)+'px;';else if(p.charAt(0)=="s")
pos+='bottom:'+(m[1]+plotOffset.bottom)+'px;';if(p.charAt(1)=="e")
pos+='right:'+(m[0]+plotOffset.right)+'px;';else if(p.charAt(1)=="w")
pos+='left:'+(m[0]+plotOffset.left)+'px;';var legend=$('<div class="legend">'+table.replace('style="','style="position:absolute;'+pos+';')+'</div>').appendTo(placeholder);if(options.legend.backgroundOpacity!=0.0){var c=options.legend.backgroundColor;if(c==null){c=options.grid.backgroundColor;if(c&&typeof c=="string")
c=$.color.parse(c);else
c=$.color.extract(legend,'background-color');c.a=1;c=c.toString();}
var div=legend.children();$('<div style="position:absolute;width:'+div.width()+'px;height:'+div.height()+'px;'+pos+'background-color:'+c+';"> </div>').prependTo(legend).css('opacity',options.legend.backgroundOpacity);}}}
var highlights=[],redrawTimeout=null;function findNearbyItem(mouseX,mouseY,seriesFilter){var maxDistance=options.grid.mouseActiveRadius,smallestDistance=maxDistance*maxDistance+1,item=null,foundPoint=false,i,j,ps;for(i=series.length-1;i>=0;--i){if(!seriesFilter(series[i]))
continue;var s=series[i],axisx=s.xaxis,axisy=s.yaxis,points=s.datapoints.points,mx=axisx.c2p(mouseX),my=axisy.c2p(mouseY),maxx=maxDistance/axisx.scale,maxy=maxDistance/axisy.scale;ps=s.datapoints.pointsize;if(axisx.options.inverseTransform)
maxx=Number.MAX_VALUE;if(axisy.options.inverseTransform)
maxy=Number.MAX_VALUE;if(s.lines.show||s.points.show){for(j=0;j<points.length;j+=ps){var x=points[j],y=points[j+1];if(x==null)
continue;if(x-mx>maxx||x-mx<-maxx||y-my>maxy||y-my<-maxy)
continue;var dx=Math.abs(axisx.p2c(x)-mouseX),dy=Math.abs(axisy.p2c(y)-mouseY),dist=dx*dx+dy*dy;if(dist<smallestDistance){smallestDistance=dist;item=[i,j/ps];}}}
if(s.bars.show&&!item){var barLeft=s.bars.align=="left"?0:-s.bars.barWidth/2,barRight=barLeft+s.bars.barWidth;for(j=0;j<points.length;j+=ps){var x=points[j],y=points[j+1],b=points[j+2];if(x==null)
continue;if(series[i].bars.horizontal?(mx<=Math.max(b,x)&&mx>=Math.min(b,x)&&my>=y+barLeft&&my<=y+barRight):(mx>=x+barLeft&&mx<=x+barRight&&my>=Math.min(b,y)&&my<=Math.max(b,y)))
item=[i,j/ps];}}}
if(item){i=item[0];j=item[1];ps=series[i].datapoints.pointsize;return{datapoint:series[i].datapoints.points.slice(j*ps,(j+1)*ps),dataIndex:j,series:series[i],seriesIndex:i};}
return null;}
function onMouseMove(e){if(options.grid.hoverable)
triggerClickHoverEvent("plothover",e,function(s){return s["hoverable"]!=false;});}
function onMouseLeave(e){if(options.grid.hoverable)
triggerClickHoverEvent("plothover",e,function(s){return false;});}
function onClick(e){triggerClickHoverEvent("plotclick",e,function(s){return s["clickable"]!=false;});}
function triggerClickHoverEvent(eventname,event,seriesFilter){var offset=eventHolder.offset(),canvasX=event.pageX-offset.left-plotOffset.left,canvasY=event.pageY-offset.top-plotOffset.top,pos=canvasToAxisCoords({left:canvasX,top:canvasY});pos.pageX=event.pageX;pos.pageY=event.pageY;var item=findNearbyItem(canvasX,canvasY,seriesFilter);if(item){item.pageX=parseInt(item.series.xaxis.p2c(item.datapoint[0])+offset.left+plotOffset.left,10);item.pageY=parseInt(item.series.yaxis.p2c(item.datapoint[1])+offset.top+plotOffset.top,10);}
if(options.grid.autoHighlight){for(var i=0;i<highlights.length;++i){var h=highlights[i];if(h.auto==eventname&&!(item&&h.series==item.series&&h.point[0]==item.datapoint[0]&&h.point[1]==item.datapoint[1]))
unhighlight(h.series,h.point);}
if(item)
highlight(item.series,item.datapoint,eventname);}
placeholder.trigger(eventname,[pos,item]);}
function triggerRedrawOverlay(){var t=options.interaction.redrawOverlayInterval;if(t==-1){drawOverlay();return;}
if(!redrawTimeout)
redrawTimeout=setTimeout(drawOverlay,t);}
function drawOverlay(){redrawTimeout=null;octx.save();overlay.clear();octx.translate(plotOffset.left,plotOffset.top);var i,hi;for(i=0;i<highlights.length;++i){hi=highlights[i];if(hi.series.bars.show)
drawBarHighlight(hi.series,hi.point);else
drawPointHighlight(hi.series,hi.point);}
octx.restore();executeHooks(hooks.drawOverlay,[octx]);}
function highlight(s,point,auto){if(typeof s=="number")
s=series[s];if(typeof point=="number"){var ps=s.datapoints.pointsize;point=s.datapoints.points.slice(ps*point,ps*(point+1));}
var i=indexOfHighlight(s,point);if(i==-1){highlights.push({series:s,point:point,auto:auto});triggerRedrawOverlay();}
else if(!auto)
highlights[i].auto=false;}
function unhighlight(s,point){if(s==null&&point==null){highlights=[];triggerRedrawOverlay();return;}
if(typeof s=="number")
s=series[s];if(typeof point=="number"){var ps=s.datapoints.pointsize;point=s.datapoints.points.slice(ps*point,ps*(point+1));}
var i=indexOfHighlight(s,point);if(i!=-1){highlights.splice(i,1);triggerRedrawOverlay();}}
function indexOfHighlight(s,p){for(var i=0;i<highlights.length;++i){var h=highlights[i];if(h.series==s&&h.point[0]==p[0]&&h.point[1]==p[1])
return i;}
return-1;}
function drawPointHighlight(series,point){var x=point[0],y=point[1],axisx=series.xaxis,axisy=series.yaxis,highlightColor=(typeof series.highlightColor==="string")?series.highlightColor:$.color.parse(series.color).scale('a',0.5).toString();if(x<axisx.min||x>axisx.max||y<axisy.min||y>axisy.max)
return;var pointRadius=series.points.radius+series.points.lineWidth/2;octx.lineWidth=pointRadius;octx.strokeStyle=highlightColor;var radius=1.5*pointRadius;x=axisx.p2c(x);y=axisy.p2c(y);octx.beginPath();if(series.points.symbol=="circle")
octx.arc(x,y,radius,0,2*Math.PI,false);else
series.points.symbol(octx,x,y,radius,false);octx.closePath();octx.stroke();}
function drawBarHighlight(series,point){var highlightColor=(typeof series.highlightColor==="string")?series.highlightColor:$.color.parse(series.color).scale('a',0.5).toString(),fillStyle=highlightColor,barLeft=series.bars.align=="left"?0:-series.bars.barWidth/2;octx.lineWidth=series.bars.lineWidth;octx.strokeStyle=highlightColor;drawBar(point[0],point[1],point[2]||0,barLeft,barLeft+series.bars.barWidth,0,function(){return fillStyle;},series.xaxis,series.yaxis,octx,series.bars.horizontal,series.bars.lineWidth);}
function getColorOrGradient(spec,bottom,top,defaultColor){if(typeof spec=="string")
return spec;else{var gradient=ctx.createLinearGradient(0,top,0,bottom);for(var i=0,l=spec.colors.length;i<l;++i){var c=spec.colors[i];if(typeof c!="string"){var co=$.color.parse(defaultColor);if(c.brightness!=null)
co=co.scale('rgb',c.brightness);if(c.opacity!=null)
co.a*=c.opacity;c=co.toString();}
gradient.addColorStop(i/(l-1),c);}
return gradient;}}}
$.plot=function(placeholder,data,options){var plot=new Plot($(placeholder),data,options,$.plot.plugins);return plot;};$.plot.version="0.8.2-alpha";$.plot.plugins=[];$.fn.plot=function(data,options){return this.each(function(){$.plot(this,data,options);});};function floorInBase(n,base){return base*Math.floor(n/base);}})(jQuery);(function($){var defaultOptions={tooltip:false,tooltipOpts:{content:"%s | X: %x | Y: %y",xDateFormat:null,yDateFormat:null,shifts:{x:10,y:20},defaultTheme:true,onHover:function(flotItem,$tooltipEl){}}};var FlotTooltip=function(plot){this.tipPosition={x:0,y:0};this.init(plot);};FlotTooltip.prototype.init=function(plot){var that=this;plot.hooks.bindEvents.push(function(plot,eventHolder){that.plotOptions=plot.getOptions();if(that.plotOptions.tooltip===false||typeof that.plotOptions.tooltip==='undefined')return;that.tooltipOptions=that.plotOptions.tooltipOpts;var $tip=that.getDomElement();$(plot.getPlaceholder()).bind("plothover",function(event,pos,item){if(item){var tipText;tipText=that.stringFormat(that.tooltipOptions.content,item);$tip.html(tipText);that.updateTooltipPosition({x:pos.pageX,y:pos.pageY});$tip.css({left:that.tipPosition.x+that.tooltipOptions.shifts.x,top:that.tipPosition.y+that.tooltipOptions.shifts.y}).show();if(typeof that.tooltipOptions.onHover==='function'){that.tooltipOptions.onHover(item,$tip);}}
else{$tip.hide().html('');}});eventHolder.mousemove(function(e){var pos={};pos.x=e.pageX;pos.y=e.pageY;that.updateTooltipPosition(pos);});});};FlotTooltip.prototype.getDomElement=function(){var $tip;if($('#flotTip').length>0){$tip=$('#flotTip');}
else{$tip=$('<div />').attr('id','flotTip');$tip.appendTo('body').hide().css({position:'absolute'});if(this.tooltipOptions.defaultTheme){$tip.css({'background':'#fff','z-index':'100','padding':'0.4em 0.6em','border-radius':'0.5em','font-size':'0.8em','border':'1px solid #111','display':'inline-block','white-space':'nowrap'});}}
return $tip;};FlotTooltip.prototype.updateTooltipPosition=function(pos){var totalTipWidth=$("#flotTip").outerWidth()+this.tooltipOptions.shifts.x;var totalTipHeight=$("#flotTip").outerHeight()+this.tooltipOptions.shifts.y;if((pos.x-$(window).scrollLeft())>($(window).innerWidth()-totalTipWidth)){pos.x-=totalTipWidth;}
if((pos.y-$(window).scrollTop())>($(window).innerHeight()-totalTipHeight)){pos.y-=totalTipHeight;}
this.tipPosition.x=pos.x;this.tipPosition.y=pos.y;};FlotTooltip.prototype.stringFormat=function(content,item){var percentPattern=/%p\.{0,1}(\d{0,})/;var seriesPattern=/%s/;var xPattern=/%x\.{0,1}(\d{0,})/;var yPattern=/%y\.{0,1}(\d{0,})/;if(typeof(content)==='function'){content=content(item.series.data[item.dataIndex][0],item.series.data[item.dataIndex][1]);}
if(typeof(item.series.percent)!=='undefined'){content=this.adjustValPrecision(percentPattern,content,item.series.percent);}
if(typeof(item.series.label)!=='undefined'){content=content.replace(seriesPattern,item.series.label);}
if(this.isTimeMode('xaxis',item)&&this.isXDateFormat(item)){content=content.replace(xPattern,this.timestampToDate(item.series.data[item.dataIndex][0],this.tooltipOptions.xDateFormat));}
if(this.isTimeMode('yaxis',item)&&this.isYDateFormat(item)){content=content.replace(yPattern,this.timestampToDate(item.series.data[item.dataIndex][1],this.tooltipOptions.yDateFormat));}
if(typeof item.series.data[item.dataIndex][0]==='number'){content=this.adjustValPrecision(xPattern,content,item.series.data[item.dataIndex][0]);}
if(typeof item.series.data[item.dataIndex][1]==='number'){content=this.adjustValPrecision(yPattern,content,item.series.data[item.dataIndex][1]);}
if(typeof item.series.xaxis.tickFormatter!=='undefined'){content=content.replace(xPattern,item.series.xaxis.tickFormatter(item.series.data[item.dataIndex][0],item.series.xaxis));}
if(typeof item.series.yaxis.tickFormatter!=='undefined'){content=content.replace(yPattern,item.series.yaxis.tickFormatter(item.series.data[item.dataIndex][1],item.series.yaxis));}
return content;};FlotTooltip.prototype.isTimeMode=function(axisName,item){return(typeof item.series[axisName].options.mode!=='undefined'&&item.series[axisName].options.mode==='time');};FlotTooltip.prototype.isXDateFormat=function(item){return(typeof this.tooltipOptions.xDateFormat!=='undefined'&&this.tooltipOptions.xDateFormat!==null);};FlotTooltip.prototype.isYDateFormat=function(item){return(typeof this.tooltipOptions.yDateFormat!=='undefined'&&this.tooltipOptions.yDateFormat!==null);};FlotTooltip.prototype.timestampToDate=function(tmst,dateFormat){var theDate=new Date(tmst);return $.plot.formatDate(theDate,dateFormat);};FlotTooltip.prototype.adjustValPrecision=function(pattern,content,value){var precision;if(content.match(pattern)!==null){if(RegExp.$1!==''){precision=RegExp.$1;value=value.toFixed(precision);content=content.replace(pattern,value);}}
return content;};var init=function(plot){new FlotTooltip(plot);};$.plot.plugins.push({init:init,options:defaultOptions,name:'tooltip',version:'0.6.1'});})(jQuery);(function($){var options={};function init(plot){function onResize(){var placeholder=plot.getPlaceholder();if(placeholder.width()==0||placeholder.height()==0)
return;plot.resize();plot.setupGrid();plot.draw();}
function bindEvents(plot,eventHolder){$(window).bind('resize',onResize)}
function shutdown(plot,eventHolder){$(window).unbind('resize',onResize)}
plot.hooks.bindEvents.push(bindEvents);plot.hooks.shutdown.push(shutdown);}
$.plot.plugins.push({init:init,options:options,name:'resize',version:'1.0'});})(jQuery);(function($){var options={xaxis:{timezone:null,timeformat:null,twelveHourClock:false,monthNames:null}};function floorInBase(n,base){return base*Math.floor(n/base);}
function formatDate(d,fmt,monthNames,dayNames){if(typeof d.strftime=="function"){return d.strftime(fmt);}
var leftPad=function(n,pad){n=""+n;pad=""+(pad==null?"0":pad);return n.length==1?pad+n:n;};var r=[];var escape=false;var hours=d.getHours();var isAM=hours<12;if(monthNames==null){monthNames=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];}
if(dayNames==null){dayNames=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];}
var hours12;if(hours>12){hours12=hours-12;}else if(hours==0){hours12=12;}else{hours12=hours;}
for(var i=0;i<fmt.length;++i){var c=fmt.charAt(i);if(escape){switch(c){case'a':c=""+dayNames[d.getDay()];break;case'b':c=""+monthNames[d.getMonth()];break;case'd':c=leftPad(d.getDate());break;case'e':c=leftPad(d.getDate()," ");break;case'h':case'H':c=leftPad(hours);break;case'I':c=leftPad(hours12);break;case'l':c=leftPad(hours12," ");break;case'm':c=leftPad(d.getMonth()+1);break;case'M':c=leftPad(d.getMinutes());break;case'q':c=""+(Math.floor(d.getMonth()/3)+1);break;case'S':c=leftPad(d.getSeconds());break;case'y':c=leftPad(d.getFullYear()%100);break;case'Y':c=""+d.getFullYear();break;case'p':c=(isAM)?(""+"am"):(""+"pm");break;case'P':c=(isAM)?(""+"AM"):(""+"PM");break;case'w':c=""+d.getDay();break;}
r.push(c);escape=false;}else{if(c=="%"){escape=true;}else{r.push(c);}}}
return r.join("");}
function makeUtcWrapper(d){function addProxyMethod(sourceObj,sourceMethod,targetObj,targetMethod){sourceObj[sourceMethod]=function(){return targetObj[targetMethod].apply(targetObj,arguments);};};var utc={date:d};if(d.strftime!=undefined){addProxyMethod(utc,"strftime",d,"strftime");}
addProxyMethod(utc,"getTime",d,"getTime");addProxyMethod(utc,"setTime",d,"setTime");var props=["Date","Day","FullYear","Hours","Milliseconds","Minutes","Month","Seconds"];for(var p=0;p<props.length;p++){addProxyMethod(utc,"get"+props[p],d,"getUTC"+props[p]);addProxyMethod(utc,"set"+props[p],d,"setUTC"+props[p]);}
return utc;};function dateGenerator(ts,opts){if(opts.timezone=="browser"){return new Date(ts);}else if(!opts.timezone||opts.timezone=="utc"){return makeUtcWrapper(new Date(ts));}else if(typeof timezoneJS!="undefined"&&typeof timezoneJS.Date!="undefined"){var d=new timezoneJS.Date();d.setTimezone(opts.timezone);d.setTime(ts);return d;}else{return makeUtcWrapper(new Date(ts));}}
var timeUnitSize={"second":1000,"minute":60*1000,"hour":60*60*1000,"day":24*60*60*1000,"month":30*24*60*60*1000,"quarter":3*30*24*60*60*1000,"year":365.2425*24*60*60*1000};var baseSpec=[[1,"second"],[2,"second"],[5,"second"],[10,"second"],[30,"second"],[1,"minute"],[2,"minute"],[5,"minute"],[10,"minute"],[30,"minute"],[1,"hour"],[2,"hour"],[4,"hour"],[8,"hour"],[12,"hour"],[1,"day"],[2,"day"],[3,"day"],[0.25,"month"],[0.5,"month"],[1,"month"],[2,"month"]];var specMonths=baseSpec.concat([[3,"month"],[6,"month"],[1,"year"]]);var specQuarters=baseSpec.concat([[1,"quarter"],[2,"quarter"],[1,"year"]]);function init(plot){plot.hooks.processOptions.push(function(plot,options){$.each(plot.getAxes(),function(axisName,axis){var opts=axis.options;if(opts.mode=="time"){axis.tickGenerator=function(axis){var ticks=[];var d=dateGenerator(axis.min,opts);var minSize=0;var spec=(opts.tickSize&&opts.tickSize[1]==="quarter")||(opts.minTickSize&&opts.minTickSize[1]==="quarter")?specQuarters:specMonths;if(opts.minTickSize!=null){if(typeof opts.tickSize=="number"){minSize=opts.tickSize;}else{minSize=opts.minTickSize[0]*timeUnitSize[opts.minTickSize[1]];}}
for(var i=0;i<spec.length-1;++i){if(axis.delta<(spec[i][0]*timeUnitSize[spec[i][1]]
+spec[i+1][0]*timeUnitSize[spec[i+1][1]])/2&&spec[i][0]*timeUnitSize[spec[i][1]]>=minSize){break;}}
var size=spec[i][0];var unit=spec[i][1];if(unit=="year"){if(opts.minTickSize!=null&&opts.minTickSize[1]=="year"){size=Math.floor(opts.minTickSize[0]);}else{var magn=Math.pow(10,Math.floor(Math.log(axis.delta/timeUnitSize.year)/Math.LN10));var norm=(axis.delta/timeUnitSize.year)/magn;if(norm<1.5){size=1;}else if(norm<3){size=2;}else if(norm<7.5){size=5;}else{size=10;}
size*=magn;}
if(size<1){size=1;}}
axis.tickSize=opts.tickSize||[size,unit];var tickSize=axis.tickSize[0];unit=axis.tickSize[1];var step=tickSize*timeUnitSize[unit];if(unit=="second"){d.setSeconds(floorInBase(d.getSeconds(),tickSize));}else if(unit=="minute"){d.setMinutes(floorInBase(d.getMinutes(),tickSize));}else if(unit=="hour"){d.setHours(floorInBase(d.getHours(),tickSize));}else if(unit=="month"){d.setMonth(floorInBase(d.getMonth(),tickSize));}else if(unit=="quarter"){d.setMonth(3*floorInBase(d.getMonth()/3,tickSize));}else if(unit=="year"){d.setFullYear(floorInBase(d.getFullYear(),tickSize));}
d.setMilliseconds(0);if(step>=timeUnitSize.minute){d.setSeconds(0);}
if(step>=timeUnitSize.hour){d.setMinutes(0);}
if(step>=timeUnitSize.day){d.setHours(0);}
if(step>=timeUnitSize.day*4){d.setDate(1);}
if(step>=timeUnitSize.month*2){d.setMonth(floorInBase(d.getMonth(),3));}
if(step>=timeUnitSize.quarter*2){d.setMonth(floorInBase(d.getMonth(),6));}
if(step>=timeUnitSize.year){d.setMonth(0);}
var carry=0;var v=Number.NaN;var prev;do{prev=v;v=d.getTime();ticks.push(v);if(unit=="month"||unit=="quarter"){if(tickSize<1){d.setDate(1);var start=d.getTime();d.setMonth(d.getMonth()+
(unit=="quarter"?3:1));var end=d.getTime();d.setTime(v+carry*timeUnitSize.hour+(end-start)*tickSize);carry=d.getHours();d.setHours(0);}else{d.setMonth(d.getMonth()+
tickSize*(unit=="quarter"?3:1));}}else if(unit=="year"){d.setFullYear(d.getFullYear()+tickSize);}else{d.setTime(v+step);}}while(v<axis.max&&v!=prev);return ticks;};axis.tickFormatter=function(v,axis){var d=dateGenerator(v,axis.options);if(opts.timeformat!=null){return formatDate(d,opts.timeformat,opts.monthNames,opts.dayNames);}
var useQuarters=(axis.options.tickSize&&axis.options.tickSize[1]=="quarter")||(axis.options.minTickSize&&axis.options.minTickSize[1]=="quarter");var t=axis.tickSize[0]*timeUnitSize[axis.tickSize[1]];var span=axis.max-axis.min;var suffix=(opts.twelveHourClock)?" %p":"";var hourCode=(opts.twelveHourClock)?"%I":"%H";var fmt;if(t<timeUnitSize.minute){fmt=hourCode+":%M:%S"+suffix;}else if(t<timeUnitSize.day){if(span<2*timeUnitSize.day){fmt=hourCode+":%M"+suffix;}else{fmt="%b %d "+hourCode+":%M"+suffix;}}else if(t<timeUnitSize.month){fmt="%b %d";}else if((useQuarters&&t<timeUnitSize.quarter)||(!useQuarters&&t<timeUnitSize.year)){if(span<timeUnitSize.year){fmt="%b";}else{fmt="%b %Y";}}else if(useQuarters&&t<timeUnitSize.year){if(span<timeUnitSize.year){fmt="Q%q";}else{fmt="Q%q %Y";}}else{fmt="%Y";}
var rt=formatDate(d,fmt,opts.monthNames,opts.dayNames);return rt;};}});});}
$.plot.plugins.push({init:init,options:options,name:'time',version:'1.0'});$.plot.formatDate=formatDate;})(jQuery);+function($){"use strict";var ChartLine=function(element,options){var self=this
this.chartOptions={xaxis:{mode:"time",tickLength:5},selection:{mode:"x"},grid:{markingsColor:"rgba(0,0,0, 0.02)",backgroundColor:{colors:["#fff","#fff"]},borderColor:"#7bafcc",borderWidth:0,color:"#ddd",hoverable:true,clickable:true,labelMargin:10},series:{lines:{show:true,fill:true},points:{show:true}},tooltip:true,tooltipOpts:{defaultTheme:false,content:"%x: <strong>%y</strong>",dateFormat:"%y-%0m-%0d",shifts:{x:10,y:20}},legend:{show:true,noColumns:2}}
this.defaultDataSetOptions={shadowSize:0}
var parsedOptions={}
try{parsedOptions=JSON.parse(JSON.stringify(eval("({"+options.chartOptions+"})")));}catch(e){throw new Error('Error parsing the data-chart-options attribute value. '+e);}
this.chartOptions=$.extend({},this.chartOptions,parsedOptions)
this.options=options,this.$el=$(element)
this.fullDataSet=[]
this.resetZoomLink=$(options.resetZoomLink)
this.$el.trigger('oc.chartLineInit',[this])
this.resetZoomLink.on('click',$.proxy(this.clearZoom,this));if(this.options.zoomable){this.$el.on("plotselected",function(event,ranges){var newCoords={xaxis:{min:ranges.xaxis.from,max:ranges.xaxis.to}}
$.plot(self.$el,self.fullDataSet,$.extend(true,{},self.chartOptions,newCoords))
self.resetZoomLink.show()});}
if(this.chartOptions.xaxis.mode=="time"&&this.options.timeMode=="weeks")
this.chartOptions.markings=weekendAreas
function weekendAreas(axes){var markings=[],d=new Date(axes.xaxis.min);d.setUTCDate(d.getUTCDate()-((d.getUTCDay()+1)%7))
d.setUTCSeconds(0)
d.setUTCMinutes(0)
d.setUTCHours(0)
var i=d.getTime()
do{markings.push({xaxis:{from:i,to:i+2*24*60*60*1000}})
i+=7*24*60*60*1000}while(i<axes.xaxis.max)
return markings}
this.initializing=true
this.$el.find('>[data-chart="dataset"]').each(function(){var data=$(this).data(),processedData={};for(var key in data){var normalizedKey=key.substring(3),value=data[key];normalizedKey=normalizedKey.charAt(0).toLowerCase()+normalizedKey.slice(1);if(normalizedKey=='data')
value=JSON.parse('['+value+']');processedData[normalizedKey]=value;}
self.addDataSet($.extend({},self.defaultDataSetOptions,processedData));})
this.initializing=false
this.rebuildChart()}
ChartLine.DEFAULTS={chartOptions:"",timeMode:null,zoomable:false}
ChartLine.prototype.addDataSet=function(dataSet){this.fullDataSet.push(dataSet)
if(!this.initializing)
this.rebuildChart()}
ChartLine.prototype.rebuildChart=function(){this.$el.trigger('oc.beforeChartLineRender',[this])
$.plot(this.$el,this.fullDataSet,this.chartOptions)}
ChartLine.prototype.clearZoom=function(){this.rebuildChart()
this.resetZoomLink.hide()}
var old=$.fn.chartLine
$.fn.chartLine=function(option){return this.each(function(){var $this=$(this)
var data=$this.data('october.chartLine')
var options=$.extend({},ChartLine.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('october.chartLine',(data=new ChartLine(this,options)))
if(typeof option=='string')data[option].call($this)})}
$.fn.chartLine.Constructor=ChartLine
$.fn.chartLine.noConflict=function(){$.fn.chartLine=old
return this}
$(document).render(function(){$('[data-control="chart-line"]').chartLine()})}(window.jQuery);+function($){"use strict";var BarChart=function(element,options){this.options=options||{};var
$el=this.$el=$(element),size=this.size=$el.height(),total=0,self=this,values=$.oc.chartUtils.loadListValues($('ul',$el)),$legend=$.oc.chartUtils.createLegend($('ul',$el)),indicators=$.oc.chartUtils.initLegendColorIndicators($legend),isFullWidth=this.isFullWidth(),chartHeight=this.options.height!==undefined?this.options.height:size,chartWidth=isFullWidth?this.$el.width():size,barWidth=(chartWidth-(values.values.length-1)*this.options.gap)/values.values.length
var $canvas=$('<div/>').addClass('canvas').height(chartHeight).width(isFullWidth?'100%':chartWidth)
$el.prepend($canvas)
$el.toggleClass('full-width',isFullWidth)
Raphael($canvas.get(0),isFullWidth?'100%':chartWidth,chartHeight,function(){self.paper=this;self.bars=this.set()
self.paper.customAttributes.bar=function(start,height){return{path:[["M",start,chartHeight],["L",start,chartHeight-height],["L",start+barWidth,chartHeight-height],["L",start+barWidth,chartHeight],["Z"]]}}
var start=0;$.each(values.values,function(index,valueInfo){var color=valueInfo.color!==undefined?valueInfo.color:$.oc.chartUtils.getColor(index),path=self.paper.path().attr({"stroke-width":0}).attr({bar:[start,0]}).attr({fill:color})
self.bars.push(path)
indicators[index].css('background-color',color)
start+=barWidth+self.options.gap
path.hover(function(ev){$.oc.chartUtils.showTooltip(ev.pageX,ev.pageY,$.trim($.oc.chartUtils.getLegendLabel($legend,index))+': <strong>'+valueInfo.value+'</stong>')},function(){$.oc.chartUtils.hideTooltip()})})
start=0
$.each(values.values,function(index,valueInfo){var height=chartHeight/values.max*valueInfo.value;self.bars[index].animate({bar:[start,height]},1000,"bounce")
start+=barWidth+self.options.gap;})
if(isFullWidth){$(window).on('resize',function(){chartWidth=self.$el.width(),barWidth=(chartWidth-(values.values.length-1)*self.options.gap)/values.values.length
var start=0
$.each(values.values,function(index,valueInfo){var height=chartHeight/values.max*valueInfo.value;self.bars[index].animate({bar:[start,height]},10,"bounce")
start+=barWidth+self.options.gap;})})}});}
BarChart.prototype.isFullWidth=function(){return this.options.fullWidth!==undefined&&this.options.fullWidth}
BarChart.DEFAULTS={gap:2}
var old=$.fn.barChart
$.fn.barChart=function(option){return this.each(function(){var $this=$(this)
var data=$this.data('oc.barChart')
var options=$.extend({},BarChart.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)
$this.data('oc.barChart',(data=new BarChart(this,options)))})}
$.fn.barChart.Constructor=BarChart
$.fn.barChart.noConflict=function(){$.fn.barChart=old
return this}
$(document).render(function(){$('[data-control=chart-bar]').barChart()})}(window.jQuery);+function($){"use strict";var PieChart=function(element,options){this.options=options||{};var
$el=this.$el=$(element),size=this.size=(this.options.size!==undefined?this.options.size:$el.height()),outerRadius=size/2-1,innerRadius=outerRadius-outerRadius/3.5,total=0,values=$.oc.chartUtils.loadListValues($('ul',$el)),$legend=$.oc.chartUtils.createLegend($('ul',$el)),indicators=$.oc.chartUtils.initLegendColorIndicators($legend),self=this;var $canvas=$('<div/>').addClass('canvas').width(size).height(size)
$el.prepend($canvas)
Raphael($canvas.get(0),size,size,function(){self.paper=this;self.segments=this.set()
self.paper.customAttributes.segment=function(startAngle,endAngle){var
p1=self.arcCoords(outerRadius,startAngle),p2=self.arcCoords(outerRadius,endAngle),p3=self.arcCoords(innerRadius,endAngle),p4=self.arcCoords(innerRadius,startAngle),flag=(endAngle-startAngle)>180,path=[["M",p1.x,p1.y],["A",outerRadius,outerRadius,0,+flag,0,p2.x,p2.y],["L",p3.x,p3.y],["A",innerRadius,innerRadius,0,+flag,1,p4.x,p4.y],["Z"]];return{path:path}}
self.paper.circle(size/2,size/2,innerRadius+(outerRadius-innerRadius)/2).attr({"stroke-width":outerRadius-innerRadius-0.5}).attr({stroke:$.oc.chartUtils.defaultValueColor})
$.each(values.values,function(index,valueInfo){var color=valueInfo.color!==undefined?valueInfo.color:$.oc.chartUtils.getColor(index),path=self.paper.path().attr({"stroke-width":0}).attr({segment:[0,0]}).attr({fill:color})
self.segments.push(path)
indicators[index].css('background-color',color)
path.hover(function(ev){$.oc.chartUtils.showTooltip(ev.pageX,ev.pageY,$.trim($.oc.chartUtils.getLegendLabel($legend,index))+': <strong>'+valueInfo.value+'</stong>')},function(){$.oc.chartUtils.hideTooltip()})})
var start=self.options.startAngle;$.each(values.values,function(index,valueInfo){var length=360/values.total*valueInfo.value;if(length==360)
length--;self.segments[index].animate({segment:[start,start+length]},1000,"bounce")
start+=length})});if(this.options.centerText!==undefined){var $text=$('<span>').addClass('center').html(this.options.centerText)
$canvas.append($text)}}
PieChart.prototype.arcCoords=function(radius,angle){var
a=Raphael.rad(angle),x=this.size/2+radius*Math.cos(a),y=this.size/2-radius*Math.sin(a);return{'x':x,'y':y}}
PieChart.DEFAULTS={startAngle:45}
var old=$.fn.pieChart
$.fn.pieChart=function(option){return this.each(function(){var $this=$(this)
var data=$this.data('oc.pieChart')
var options=$.extend({},PieChart.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)
$this.data('oc.pieChart',(data=new PieChart(this,options)))})}
$.fn.pieChart.Constructor=PieChart
$.fn.pieChart.noConflict=function(){$.fn.pieChart=old
return this}
$(document).render(function(){$('[data-control=chart-pie]').pieChart()})}(window.jQuery);+function($){"use strict";var GoalMeter=function(element,options){var
$el=this.$el=$(element),self=this;this.options=options||{};this.$indicatorBar=$('<span/>').text(this.options.value+'%')
this.$indicatorOuter=$('<span/>').addClass('goal-meter-indicator').append(this.$indicatorBar)
$('p',this.$el).first().before(this.$indicatorOuter)
window.setTimeout(function(){self.update(self.options.value)},200)}
GoalMeter.prototype.update=function(value){this.$indicatorBar.css('height',value+'%')}
GoalMeter.DEFAULTS={value:50}
var old=$.fn.goalMeter
$.fn.goalMeter=function(option){return this.each(function(){var $this=$(this)
var data=$this.data('oc.goalMeter')
var options=$.extend({},GoalMeter.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)
$this.data('oc.goalMeter',(data=new GoalMeter(this,options)))
else
data.update(option)})}
$.fn.goalMeter.Constructor=GoalMeter
$.fn.goalMeter.noConflict=function(){$.fn.goalMeter=old
return this}
$(document).render(function(){$('[data-control=goal-meter]').goalMeter()})}(window.jQuery);+function($){"use strict";var RowLink=function(element,options){var self=this
this.options=options
this.$el=$(element)
var tr=this.$el.prop('tagName')=='TR'?this.$el:this.$el.find('tr:has(td)')
tr.each(function(){var link=$(this).find(options.target).filter(function(){return!$(this).closest('td').hasClass(options.excludeClass)&&!$(this).hasClass(options.excludeClass)}).first()
if(!link.length)return
var href=link.attr('href'),onclick=(typeof link.get(0).onclick=="function")?link.get(0).onclick:null
$(this).find('td').not('.'+options.excludeClass).click(function(){if(onclick)
onclick.apply(link.get(0))
else
window.location=href;})
$(this).addClass(options.linkedClass)
link.hide().after(link.html())})}
RowLink.DEFAULTS={target:'a',excludeClass:'nolink',linkedClass:'rowlink'}
var old=$.fn.rowLink
$.fn.rowLink=function(option){var args=Array.prototype.slice.call(arguments,1)
return this.each(function(){var $this=$(this)
var data=$this.data('oc.rowlink')
var options=$.extend({},RowLink.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('oc.rowlink',(data=new RowLink(this,options)))
else if(typeof option=='string')data[option].apply(data,args)})}
$.fn.rowLink.Constructor=RowLink
$.fn.rowLink.noConflict=function(){$.fn.rowLink=old
return this}
$(document).render(function(){$('[data-control="rowlink"]').rowLink()})}(window.jQuery);+function($){"use strict";var Base=$.oc.foundation.base,BaseProto=Base.prototype
var ChangeMonitor=function(element,options){var $el=this.$el=$(element);this.paused=false
this.options=options||{}
$.oc.foundation.controlUtils.markDisposable(element)
Base.call(this)
this.init()}
ChangeMonitor.prototype=Object.create(BaseProto)
ChangeMonitor.prototype.constructor=ChangeMonitor
ChangeMonitor.prototype.init=function(){this.$el.on('change',this.proxy(this.change))
this.$el.on('unchange.oc.changeMonitor',this.proxy(this.unchange))
this.$el.on('pause.oc.changeMonitor ',this.proxy(this.pause))
this.$el.on('resume.oc.changeMonitor ',this.proxy(this.resume))
this.$el.on('keyup input paste','input, textarea:not(.ace_text-input)',this.proxy(this.onInputChange))
$('input:not([type=hidden]), textarea:not(.ace_text-input)',this.$el).each(function(){$(this).data('oldval.oc.changeMonitor',$(this).val());})
if(this.options.windowCloseConfirm)
$(window).on('beforeunload',this.proxy(this.onBeforeUnload))
this.$el.one('dispose-control',this.proxy(this.dispose))}
ChangeMonitor.prototype.dispose=function(){if(this.$el===null)
return
this.unregisterHandlers()
this.$el.removeData('oc.changeMonitor')
this.$el=null
this.options=null
BaseProto.dispose.call(this)}
ChangeMonitor.prototype.unregisterHandlers=function(){this.$el.off('change',this.proxy(this.change))
this.$el.off('unchange.oc.changeMonitor',this.proxy(this.unchange))
this.$el.off('pause.oc.changeMonitor ',this.proxy(this.pause))
this.$el.off('resume.oc.changeMonitor ',this.proxy(this.resume))
this.$el.off('keyup input paste','input, textarea:not(.ace_text-input)',this.proxy(this.onInputChange))
this.$el.off('dispose-control',this.proxy(this.dispose))
if(this.options.windowCloseConfirm)
$(window).off('beforeunload',this.proxy(this.onBeforeUnload))}
ChangeMonitor.prototype.change=function(ev,inputChange){if(this.paused)
return
if(!inputChange){var type=$(ev.target).attr('type')
if(type=='text'||type=="password")
return}
if(!this.$el.hasClass('oc-data-changed')){this.$el.trigger('changed.oc.changeMonitor')
this.$el.addClass('oc-data-changed')}}
ChangeMonitor.prototype.unchange=function(){if(this.paused)
return
if(this.$el.hasClass('oc-data-changed')){this.$el.trigger('unchanged.oc.changeMonitor')
this.$el.removeClass('oc-data-changed')}}
ChangeMonitor.prototype.onInputChange=function(ev){if(this.paused)
return
var $el=$(ev.target)
if($el.data('oldval.oc.changeMonitor')!=$el.val()){$el.data('oldval.oc.changeMonitor',$el.val());this.change(ev,true);}}
ChangeMonitor.prototype.pause=function(){this.paused=true}
ChangeMonitor.prototype.resume=function(){this.paused=false}
ChangeMonitor.prototype.onBeforeUnload=function(){if($.contains(document.documentElement,this.$el.get(0))&&this.$el.hasClass('oc-data-changed'))
return this.options.windowCloseConfirm}
ChangeMonitor.DEFAULTS={windowCloseConfirm:false}
var old=$.fn.changeMonitor
$.fn.changeMonitor=function(option){return this.each(function(){var $this=$(this)
var data=$this.data('oc.changeMonitor')
var options=$.extend({},ChangeMonitor.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('oc.changeMonitor',(data=new ChangeMonitor(this,options)))})}
$.fn.changeMonitor.Constructor=ChangeMonitor
$.fn.changeMonitor.noConflict=function(){$.fn.changeMonitor=old
return this}
$(document).render(function(){$('[data-change-monitor]').changeMonitor()})}(window.jQuery);+function($){"use strict";var Base=$.oc.foundation.base,BaseProto=Base.prototype
var HotKey=function(element,options){if(!options.hotkey)
throw new Error('No hotkey has been defined.');this.$el=$(element)
this.$target=$(options.hotkeyTarget)
this.options=options||{}
this.keyConditions=[]
this.keyMap=null
$.oc.foundation.controlUtils.markDisposable(element)
Base.call(this)
this.init()}
HotKey.prototype=Object.create(BaseProto)
HotKey.prototype.constructor=HotKey
HotKey.prototype.dispose=function(){if(this.$el===null)
return
this.unregisterHandlers()
this.$el.removeData('oc.hotkey')
this.$target=null
this.$el=null
this.keyConditions=null
this.keyMap=null
this.options=null
BaseProto.dispose.call(this)}
HotKey.prototype.init=function(){if(this.options.hotkeyMac)
this.options.hotkey+=', '+this.options.hotkeyMac
this.initKeyMap()
var keys=this.options.hotkey.toLowerCase().split(',')
for(var i=0,len=keys.length;i<len;i++){var keysTrimmed=this.trim(keys[i])
this.keyConditions.push(this.makeCondition(keysTrimmed))}
this.$target.on('keydown',this.proxy(this.onKeyDown))
this.$el.one('dispose-control',this.proxy(this.dispose))}
HotKey.prototype.unregisterHandlers=function(){this.$target.off('keydown',this.proxy(this.onKeyDown))
this.$el.off('dispose-control',this.proxy(this.dispose))}
HotKey.prototype.makeCondition=function(keyBind){var condition={shift:false,ctrl:false,cmd:false,alt:false,specific:-1},keys=keyBind.split('+')
for(var i=0,len=keys.length;i<len;i++){switch(keys[i]){case'shift':condition.shift=true
break
case'ctrl':condition.ctrl=true
break
case'command':case'cmd':case'meta':condition.cmd=true
break
case'alt':condition.alt=true
break}}
condition.specific=this.keyMap[keys[keys.length-1]]
if(typeof(condition.specific)=='undefined')
condition.specific=keys[keys.length-1].toUpperCase().charCodeAt()
return condition}
HotKey.prototype.initKeyMap=function(){this.keyMap={'esc':27,'tab':9,'space':32,'return':13,'enter':13,'backspace':8,'scroll':145,'capslock':20,'numlock':144,'pause':19,'break':19,'insert':45,'home':36,'delete':46,'suppr':46,'end':35,'pageup':33,'pagedown':34,'left':37,'up':38,'right':39,'down':40,'f1':112,'f2':113,'f3':114,'f4':115,'f5':116,'f6':117,'f7':118,'f8':119,'f9':120,'f10':121,'f11':122,'f12':123}}
HotKey.prototype.trim=function(str){return str.replace(/^\s+/,"").replace(/\s+$/,"")}
HotKey.prototype.testConditions=function(ev){for(var i=0,len=this.keyConditions.length;i<len;i++){var condition=this.keyConditions[i]
if(ev.which==condition.specific&&ev.originalEvent.shiftKey==condition.shift&&ev.originalEvent.ctrlKey==condition.ctrl&&ev.originalEvent.metaKey==condition.cmd&&ev.originalEvent.altKey==condition.alt){return true}}
return false}
HotKey.prototype.onKeyDown=function(ev){if(this.testConditions(ev)){if(this.options.hotkeyVisible&&!this.$el.is(':visible'))
return
if(this.options.callback)
return this.options.callback(this.$el,ev.currentTarget)}}
HotKey.DEFAULTS={hotkey:null,hotkeyMac:null,hotkeyTarget:'html',hotkeyVisible:true,callback:function(element){element.trigger('click')
return false}}
var old=$.fn.hotKey
$.fn.hotKey=function(option){var args=arguments;return this.each(function(){var $this=$(this)
var data=$this.data('oc.hotkey')
var options=$.extend({},HotKey.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('oc.hotkey',(data=new HotKey(this,options)))
if(typeof option=='string')data[option].apply(data,args)})}
$.fn.hotKey.Constructor=HotKey
$.fn.hotKey.noConflict=function(){$.fn.hotKey=old
return this}
$(document).render(function(){$('[data-hotkey]').hotKey()})}(window.jQuery);+function($){"use strict";var LATIN_MAP={'À':'A','Á':'A','Â':'A','Ã':'A','Ä':'A','Å':'A','Æ':'AE','Ç':'C','È':'E','É':'E','Ê':'E','Ë':'E','Ì':'I','Í':'I','Î':'I','Ï':'I','Ð':'D','Ñ':'N','Ò':'O','Ó':'O','Ô':'O','Õ':'O','Ö':'O','Ő':'O','Ø':'O','Ù':'U','Ú':'U','Û':'U','Ü':'U','Ű':'U','Ý':'Y','Þ':'TH','Ÿ':'Y','ß':'ss','à':'a','á':'a','â':'a','ã':'a','ä':'a','å':'a','æ':'ae','ç':'c','è':'e','é':'e','ê':'e','ë':'e','ì':'i','í':'i','î':'i','ï':'i','ð':'d','ñ':'n','ò':'o','ó':'o','ô':'o','õ':'o','ö':'o','ő':'o','ø':'o','ù':'u','ú':'u','û':'u','ü':'u','ű':'u','ý':'y','þ':'th','ÿ':'y'},LATIN_SYMBOLS_MAP={'©':'(c)'},GREEK_MAP={'α':'a','β':'b','γ':'g','δ':'d','ε':'e','ζ':'z','η':'h','θ':'8','ι':'i','κ':'k','λ':'l','μ':'m','ν':'n','ξ':'3','ο':'o','π':'p','ρ':'r','σ':'s','τ':'t','υ':'y','φ':'f','χ':'x','ψ':'ps','ω':'w','ά':'a','έ':'e','ί':'i','ό':'o','ύ':'y','ή':'h','ώ':'w','ς':'s','ϊ':'i','ΰ':'y','ϋ':'y','ΐ':'i','Α':'A','Β':'B','Γ':'G','Δ':'D','Ε':'E','Ζ':'Z','Η':'H','Θ':'8','Ι':'I','Κ':'K','Λ':'L','Μ':'M','Ν':'N','Ξ':'3','Ο':'O','Π':'P','Ρ':'R','Σ':'S','Τ':'T','Υ':'Y','Φ':'F','Χ':'X','Ψ':'PS','Ω':'W','Ά':'A','Έ':'E','Ί':'I','Ό':'O','Ύ':'Y','Ή':'H','Ώ':'W','Ϊ':'I','Ϋ':'Y'},TURKISH_MAP={'ş':'s','Ş':'S','ı':'i','İ':'I','ç':'c','Ç':'C','ü':'u','Ü':'U','ö':'o','Ö':'O','ğ':'g','Ğ':'G'},RUSSIAN_MAP={'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z','и':'i','й':'j','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'c','ч':'ch','ш':'sh','щ':'sh','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya','А':'A','Б':'B','В':'V','Г':'G','Д':'D','Е':'E','Ё':'Yo','Ж':'Zh','З':'Z','И':'I','Й':'J','К':'K','Л':'L','М':'M','Н':'N','О':'O','П':'P','Р':'R','С':'S','Т':'T','У':'U','Ф':'F','Х':'H','Ц':'C','Ч':'Ch','Ш':'Sh','Щ':'Sh','Ъ':'','Ы':'Y','Ь':'','Э':'E','Ю':'Yu','Я':'Ya'},UKRAINIAN_MAP={'Є':'Ye','І':'I','Ї':'Yi','Ґ':'G','є':'ye','і':'i','ї':'yi','ґ':'g'},CZECH_MAP={'č':'c','ď':'d','ě':'e','ň':'n','ř':'r','š':'s','ť':'t','ů':'u','ž':'z','Č':'C','Ď':'D','Ě':'E','Ň':'N','Ř':'R','Š':'S','Ť':'T','Ů':'U','Ž':'Z'},POLISH_MAP={'ą':'a','ć':'c','ę':'e','ł':'l','ń':'n','ó':'o','ś':'s','ź':'z','ż':'z','Ą':'A','Ć':'C','Ę':'E','Ł':'L','Ń':'N','Ó':'O','Ś':'S','Ź':'Z','Ż':'Z'},LATVIAN_MAP={'ā':'a','č':'c','ē':'e','ģ':'g','ī':'i','ķ':'k','ļ':'l','ņ':'n','š':'s','ū':'u','ž':'z','Ā':'A','Č':'C','Ē':'E','Ģ':'G','Ī':'I','Ķ':'K','Ļ':'L','Ņ':'N','Š':'S','Ū':'U','Ž':'Z'},ARABIC_MAP={'أ':'a','ب':'b','ت':'t','ث':'th','ج':'g','ح':'h','خ':'kh','د':'d','ذ':'th','ر':'r','ز':'z','س':'s','ش':'sh','ص':'s','ض':'d','ط':'t','ظ':'th','ع':'aa','غ':'gh','ف':'f','ق':'k','ك':'k','ل':'l','م':'m','ن':'n','ه':'h','و':'o','ي':'y'},PERSIAN_MAP={'آ':'a','ا':'a','پ':'p','چ':'ch','ژ':'zh','ک':'k','گ':'gh','ی':'y'},LITHUANIAN_MAP={'ą':'a','č':'c','ę':'e','ė':'e','į':'i','š':'s','ų':'u','ū':'u','ž':'z','Ą':'A','Č':'C','Ę':'E','Ė':'E','Į':'I','Š':'S','Ų':'U','Ū':'U','Ž':'Z'},SERBIAN_MAP={'ђ':'dj','ј':'j','љ':'lj','њ':'nj','ћ':'c','џ':'dz','đ':'dj','Ђ':'Dj','Ј':'j','Љ':'Lj','Њ':'Nj','Ћ':'C','Џ':'Dz','Đ':'Dj'},AZERBAIJANI_MAP={'ç':'c','ə':'e','ğ':'g','ı':'i','ö':'o','ş':'s','ü':'u','Ç':'C','Ə':'E','Ğ':'G','İ':'I','Ö':'O','Ş':'S','Ü':'U'},ALL_MAPS=[LATIN_MAP,LATIN_SYMBOLS_MAP,GREEK_MAP,TURKISH_MAP,RUSSIAN_MAP,UKRAINIAN_MAP,CZECH_MAP,POLISH_MAP,LATVIAN_MAP,ARABIC_MAP,PERSIAN_MAP,LITHUANIAN_MAP,SERBIAN_MAP,AZERBAIJANI_MAP]
var removeList=["a","an","as","at","before","but","by","for","from","is","in","into","like","of","off","on","onto","per","since","than","the","this","that","to","up","via","with"]
var Downcoder={Initialize:function(){if(Downcoder.map){return;}
Downcoder.map={};Downcoder.chars=[];for(var i=0;i<ALL_MAPS.length;i++){var lookup=ALL_MAPS[i];for(var c in lookup){if(lookup.hasOwnProperty(c)){Downcoder.map[c]=lookup[c];}}}
for(var k in Downcoder.map){if(Downcoder.map.hasOwnProperty(k)){Downcoder.chars.push(k);}}
Downcoder.regex=new RegExp(Downcoder.chars.join('|'),'g');}}
function toCamel(slug,numChars){Downcoder.Initialize()
slug=slug.replace(Downcoder.regex,function(m){return Downcoder.map[m]})
var regex=new RegExp('\\b('+removeList.join('|')+')\\b','gi')
slug=slug.replace(regex,'')
slug=slug.toLowerCase()
slug=slug.replace(/(\b|-)\w/g,function(m){return m.toUpperCase();});slug=slug.replace(/[^-\w\s]/g,'')
slug=slug.replace(/^\s+|\s+$/g,'')
slug=slug.replace(/[-\s]+/g,'')
slug=slug.substr(0,1).toLowerCase()+slug.substr(1);return slug.substring(0,numChars)}
function slugify(slug,numChars){Downcoder.Initialize()
slug=slug.replace(Downcoder.regex,function(m){return Downcoder.map[m]})
var regex=new RegExp('\\b('+removeList.join('|')+')\\b','gi')
slug=slug.replace(regex,'')
slug=slug.replace(/[^-\w\s]/g,'')
slug=slug.replace(/^\s+|\s+$/g,'')
slug=slug.replace(/[-\s]+/g,'-')
slug=slug.toLowerCase()
return slug.substring(0,numChars)}
var InputPreset=function(element,options){var $el=this.$el=$(element)
this.options=options||{}
this.cancelled=false
var parent=options.inputPresetClosestParent!==undefined?$el.closest(options.inputPresetClosestParent):undefined,self=this,prefix=''
if(options.inputPresetPrefixInput!==undefined)
prefix=$(options.inputPresetPrefixInput,parent).val()
if(prefix===undefined)
prefix=''
if($el.val().length&&$el.val()!=prefix)
return
$el.val(prefix)
this.$src=$(options.inputPreset,parent),this.$src.on('keyup',function(){if(self.cancelled)
return
$el.val(prefix+self.formatValue())})
this.$el.on('change',function(){self.cancelled=true})}
InputPreset.prototype.formatNamespace=function(){var value=toCamel(this.$src.val())
return value.substr(0,1).toUpperCase()+value.substr(1)}
InputPreset.prototype.formatValue=function(){if(this.options.inputPresetType=='namespace'){return this.formatNamespace()}
if(this.options.inputPresetType=='camel')
var value=toCamel(this.$src.val())
else{var value=slugify(this.$src.val())}
if(this.options.inputPresetType=='url')
value='/'+value
return value.replace(/\s/gi,"-")}
InputPreset.DEFAULTS={inputPreset:'',inputPresetType:'file',inputPresetClosestParent:undefined,inputPresetPrefixInput:undefined}
var old=$.fn.inputPreset
$.fn.inputPreset=function(option){return this.each(function(){var $this=$(this)
var data=$this.data('oc.inputPreset')
var options=$.extend({},InputPreset.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('oc.inputPreset',(data=new InputPreset(this,options)))})}
$.fn.inputPreset.Constructor=InputPreset
$.fn.inputPreset.noConflict=function(){$.fn.inputPreset=old
return this}
$(document).render(function(){$('[data-input-preset]').inputPreset()})}(window.jQuery);+function($){"use strict";var TriggerOn=function(element,options){var $el=this.$el=$(element);this.options=options||{};if(this.options.triggerType!==false&&this.options.triggerAction===false)this.options.triggerAction=this.options.triggerType
if(this.options.triggerCondition===false)
throw new Error('Trigger condition is not specified.')
if(this.options.trigger===false)
throw new Error('Trigger selector is not specified.')
if(this.options.triggerAction===false)
throw new Error('Trigger action is not specified.')
this.triggerCondition=this.options.triggerCondition
if(this.options.triggerCondition.indexOf('value')==0){var match=this.options.triggerCondition.match(/[^[\]]+(?=])/g)
this.triggerCondition='value'
this.triggerConditionValue=(match)?match:""}
this.triggerParent=this.options.triggerClosestParent!==undefined?$el.closest(this.options.triggerClosestParent):undefined
if(this.triggerCondition=='checked'||this.triggerCondition=='unchecked'||this.triggerCondition=='value'){$(document).on('change',this.options.trigger,$.proxy(this.onConditionChanged,this))}
var self=this
$el.on('oc.triggerOn.update',function(e){e.stopPropagation()
self.onConditionChanged()})
self.onConditionChanged()}
TriggerOn.prototype.onConditionChanged=function(){if(this.triggerCondition=='checked'){this.updateTarget(!!$(this.options.trigger+':checked',this.triggerParent).length)}
else if(this.triggerCondition=='unchecked'){this.updateTarget(!$(this.options.trigger+':checked',this.triggerParent).length)}
else if(this.triggerCondition=='value'){var trigger,triggerValue=''
trigger=$(this.options.trigger,this.triggerParent).not('input[type=checkbox], input[type=radio], input[type=button], input[type=submit]')
if(!trigger.length){trigger=$(this.options.trigger,this.triggerParent).not(':not(input[type=checkbox]:checked, input[type=radio]:checked)')}
if(!!trigger.length){triggerValue=trigger.val()}
this.updateTarget($.inArray(triggerValue,this.triggerConditionValue)!=-1)}}
TriggerOn.prototype.updateTarget=function(status){var self=this,actions=this.options.triggerAction.split('|')
$.each(actions,function(index,action){self.updateTargetAction(action,status)})
$(window).trigger('resize')}
TriggerOn.prototype.updateTargetAction=function(action,status){if(action=='show'){this.$el.toggleClass('hide',!status).trigger('hide.oc.triggerapi',[!status])}
else if(action=='hide'){this.$el.toggleClass('hide',status).trigger('hide.oc.triggerapi',[status])}
else if(action=='enable'){this.$el.prop('disabled',!status).toggleClass('control-disabled',!status).trigger('disable.oc.triggerapi',[!status])}
else if(action=='disable'){this.$el.prop('disabled',status).toggleClass('control-disabled',status).trigger('disable.oc.triggerapi',[status])}
else if(action=='empty'&&status){this.$el.not('input[type=checkbox], input[type=radio], input[type=button], input[type=submit]').val('')
this.$el.not(':not(input[type=checkbox], input[type=radio])').prop('checked',false)
this.$el.trigger('empty.oc.triggerapi').trigger('change')}
if(action=='show'||action=='hide'){this.fixButtonClasses()}}
TriggerOn.prototype.fixButtonClasses=function(){var group=this.$el.closest('.btn-group')
if(group.length>0&&this.$el.is(':last-child'))
this.$el.prev().toggleClass('last',this.$el.hasClass('hide'))}
TriggerOn.DEFAULTS={triggerAction:false,triggerCondition:false,triggerClosestParent:undefined,trigger:false}
var old=$.fn.triggerOn
$.fn.triggerOn=function(option){return this.each(function(){var $this=$(this)
var data=$this.data('oc.triggerOn')
var options=$.extend({},TriggerOn.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('oc.triggerOn',(data=new TriggerOn(this,options)))})}
$.fn.triggerOn.Constructor=TriggerOn
$.fn.triggerOn.noConflict=function(){$.fn.triggerOn=old
return this}
$(document).render(function(){$('[data-trigger]').triggerOn()})}(window.jQuery);+function($){"use strict";var DragValue=function(element,options){this.options=options
this.$el=$(element)
this.init()}
DragValue.DEFAULTS={dragClick:false}
DragValue.prototype.init=function(){this.$el.prop('draggable',true)
this.textValue=this.$el.data('textValue')
this.$el.on('dragstart',$.proxy(this.handleDragStart,this))
this.$el.on('drop',$.proxy(this.handleDrop,this))
this.$el.on('dragend',$.proxy(this.handleDragEnd,this))
if(this.options.dragClick){this.$el.on('click',$.proxy(this.handleClick,this))
this.$el.on('mouseover',$.proxy(this.handleMouseOver,this))}}
DragValue.prototype.handleDragStart=function(event){var e=event.originalEvent
e.dataTransfer.effectAllowed='all'
e.dataTransfer.setData('text/plain',this.textValue)
this.$el.css({opacity:0.5}).addClass('dragvalue-dragging')}
DragValue.prototype.handleDrop=function(event){event.stopPropagation()
return false}
DragValue.prototype.handleDragEnd=function(event){this.$el.css({opacity:1}).removeClass('dragvalue-dragging')}
DragValue.prototype.handleMouseOver=function(event){var el=document.activeElement
if(!el)return
if(el.isContentEditable||(el.tagName.toLowerCase()=='input'&&el.type=='text'||el.tagName.toLowerCase()=='textarea')){this.lastElement=el}}
DragValue.prototype.handleClick=function(event){if(!this.lastElement)return
var $el=$(this.lastElement)
if($el.hasClass('ace_text-input'))
return this.handleClickCodeEditor(event,$el)
if(this.lastElement.isContentEditable)
return this.handleClickContentEditable()
this.insertAtCaret(this.lastElement,this.textValue)}
DragValue.prototype.handleClickCodeEditor=function(event,$el){var $editorArea=$el.closest('[data-control=codeeditor]')
if(!$editorArea.length)return
$editorArea.codeEditor('getEditorObject').insert(this.textValue)}
DragValue.prototype.handleClickContentEditable=function(){var sel,range,html;if(window.getSelection){sel=window.getSelection();if(sel.getRangeAt&&sel.rangeCount){range=sel.getRangeAt(0);range.deleteContents();range.insertNode(document.createTextNode(this.textValue));}}
else if(document.selection&&document.selection.createRange){document.selection.createRange().text=this.textValue;}}
DragValue.prototype.insertAtCaret=function(el,insertValue){if(document.selection){el.focus()
sel=document.selection.createRange()
sel.text=insertValue
el.focus()}
else if(el.selectionStart||el.selectionStart=='0'){var startPos=el.selectionStart,endPos=el.selectionEnd,scrollTop=el.scrollTop
el.value=el.value.substring(0,startPos)+insertValue+el.value.substring(endPos,el.value.length)
el.focus()
el.selectionStart=startPos+insertValue.length
el.selectionEnd=startPos+insertValue.length
el.scrollTop=scrollTop}
else{el.value+=insertValue
el.focus()}}
var old=$.fn.dragValue
$.fn.dragValue=function(option){var args=Array.prototype.slice.call(arguments,1),result
this.each(function(){var $this=$(this)
var data=$this.data('oc.dragvalue')
var options=$.extend({},DragValue.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('oc.dragvalue',(data=new DragValue(this,options)))
if(typeof option=='string')result=data[option].apply(data,args)
if(typeof result!='undefined')return false})
return result?result:this}
$.fn.dragValue.Constructor=DragValue
$.fn.dragValue.noConflict=function(){$.fn.dragValue=old
return this}
$(document).render(function(){$('[data-control="dragvalue"]').dragValue()});}(window.jQuery);!function($,window,pluginName,undefined){var containerDefaults={drag:true,drop:true,exclude:"",nested:true,vertical:true},groupDefaults={afterMove:function($placeholder,container,$closestItemOrContainer){},containerPath:"",containerSelector:"ol, ul",distance:0,delay:0,handle:"",itemPath:"",itemSelector:"li",bodyClass:"dragging",draggedClass:"dragged",isValidTarget:function($item,container){return true},onCancel:function($item,container,_super,event){},onDrag:function($item,position,_super,event){$item.css(position)},onDragStart:function($item,container,_super,event){$item.css({height:$item.outerHeight(),width:$item.outerWidth()})
$item.addClass(container.group.options.draggedClass)
$("body").addClass(container.group.options.bodyClass)},onDrop:function($item,container,_super,event){$item.removeClass(container.group.options.draggedClass).removeAttr("style")
$("body").removeClass(container.group.options.bodyClass)},onMousedown:function($item,_super,event){if(!event.target.nodeName.match(/^(input|select|textarea)$/i)){event.preventDefault()
return true}},placeholderClass:"placeholder",placeholder:'<li class="placeholder"></li>',pullPlaceholder:true,serialize:function($parent,$children,parentIsContainer){var result=$.extend({},$parent.data())
if(parentIsContainer)
return[$children]
else if($children[0]){result.children=$children}
delete result.subContainers
delete result.sortable
return result},tolerance:0},containerGroups={},groupCounter=0,emptyBox={left:0,top:0,bottom:0,right:0},eventNames={start:"touchstart.sortable mousedown.sortable",drop:"touchend.sortable touchcancel.sortable mouseup.sortable",drag:"touchmove.sortable mousemove.sortable",scroll:"scroll.sortable"},subContainerKey="subContainers"
function d(a,b){var x=Math.max(0,a[0]-b[0],b[0]-a[1]),y=Math.max(0,a[2]-b[1],b[1]-a[3])
return x+y;}
function setDimensions(array,dimensions,tolerance,useOffset){var i=array.length,offsetMethod=useOffset?"offset":"position"
tolerance=tolerance||0
while(i--){var el=array[i].el?array[i].el:$(array[i]),pos=el[offsetMethod]()
pos.left+=parseInt(el.css('margin-left'),10)
pos.top+=parseInt(el.css('margin-top'),10)
dimensions[i]=[pos.left-tolerance,pos.left+el.outerWidth()+tolerance,pos.top-tolerance,pos.top+el.outerHeight()+tolerance]}}
function getRelativePosition(pointer,element){var offset=element.offset()
return{left:pointer.left-offset.left,top:pointer.top-offset.top}}
function sortByDistanceDesc(dimensions,pointer,lastPointer){pointer=[pointer.left,pointer.top]
lastPointer=lastPointer&&[lastPointer.left,lastPointer.top]
var dim,i=dimensions.length,distances=[]
while(i--){dim=dimensions[i]
distances[i]=[i,d(dim,pointer),lastPointer&&d(dim,lastPointer)]}
distances=distances.sort(function(a,b){return b[1]-a[1]||b[2]-a[2]||b[0]-a[0]})
return distances}
function ContainerGroup(options){this.options=$.extend({},groupDefaults,options)
this.containers=[]
if(!this.options.rootGroup){this.scrollProxy=$.proxy(this.scroll,this)
this.dragProxy=$.proxy(this.drag,this)
this.dropProxy=$.proxy(this.drop,this)
this.placeholder=$(this.options.placeholder)
if(!options.isValidTarget)
this.options.isValidTarget=undefined}}
ContainerGroup.get=function(options){if(!containerGroups[options.group]){if(options.group===undefined)
options.group=groupCounter++
containerGroups[options.group]=new ContainerGroup(options)}
return containerGroups[options.group]}
ContainerGroup.prototype={dragInit:function(e,itemContainer){this.$document=$(itemContainer.el[0].ownerDocument)
var closestItem=$(e.target).closest(this.options.itemSelector);if(closestItem.length){this.item=closestItem;this.itemContainer=itemContainer;if(this.item.is(this.options.exclude)||!this.options.onMousedown(this.item,groupDefaults.onMousedown,e)){return;}
this.setPointer(e);this.toggleListeners('on');this.setupDelayTimer();this.dragInitDone=true;}},drag:function(e){if(!this.dragging){if(!this.distanceMet(e)||!this.delayMet)
return
this.options.onDragStart(this.item,this.itemContainer,groupDefaults.onDragStart,e)
this.item.before(this.placeholder)
this.dragging=true}
this.setPointer(e)
this.options.onDrag(this.item,getRelativePosition(this.pointer,this.item.offsetParent()),groupDefaults.onDrag,e)
var p=this.getPointer(e),box=this.sameResultBox,t=this.options.tolerance
if(!box||box.top-t>p.top||box.bottom+t<p.top||box.left-t>p.left||box.right+t<p.left)
if(!this.searchValidTarget()){this.placeholder.detach()
this.lastAppendedItem=undefined}},drop:function(e){this.toggleListeners('off')
this.dragInitDone=false
if(this.dragging){if(this.placeholder.closest("html")[0]){this.placeholder.before(this.item).detach()}else{this.options.onCancel(this.item,this.itemContainer,groupDefaults.onCancel,e)}
this.options.onDrop(this.item,this.getContainer(this.item),groupDefaults.onDrop,e)
this.clearDimensions()
this.clearOffsetParent()
this.lastAppendedItem=this.sameResultBox=undefined
this.dragging=false}},searchValidTarget:function(pointer,lastPointer){if(!pointer){pointer=this.relativePointer||this.pointer
lastPointer=this.lastRelativePointer||this.lastPointer}
var distances=sortByDistanceDesc(this.getContainerDimensions(),pointer,lastPointer),i=distances.length
while(i--){var index=distances[i][0],distance=distances[i][1]
if(!distance||this.options.pullPlaceholder){var container=this.containers[index]
if(!container.disabled){if(!this.$getOffsetParent()){var offsetParent=container.getItemOffsetParent()
pointer=getRelativePosition(pointer,offsetParent)
lastPointer=getRelativePosition(lastPointer,offsetParent)}
if(container.searchValidTarget(pointer,lastPointer))
return true}}}
if(this.sameResultBox)
this.sameResultBox=undefined},movePlaceholder:function(container,item,method,sameResultBox){var lastAppendedItem=this.lastAppendedItem
if(!sameResultBox&&lastAppendedItem&&lastAppendedItem[0]===item[0])
return;item[method](this.placeholder)
this.lastAppendedItem=item
this.sameResultBox=sameResultBox
this.options.afterMove(this.placeholder,container,item)},getContainerDimensions:function(){if(!this.containerDimensions)
setDimensions(this.containers,this.containerDimensions=[],this.options.tolerance,!this.$getOffsetParent())
return this.containerDimensions},getContainer:function(element){return element.closest(this.options.containerSelector).data(pluginName)},$getOffsetParent:function(){if(this.offsetParent===undefined){var i=this.containers.length-1,offsetParent=this.containers[i].getItemOffsetParent()
if(!this.options.rootGroup){while(i--){if(offsetParent[0]!=this.containers[i].getItemOffsetParent()[0]){offsetParent=false
break;}}}
this.offsetParent=offsetParent}
return this.offsetParent},setPointer:function(e){var pointer=this.getPointer(e)
if(this.$getOffsetParent()){var relativePointer=getRelativePosition(pointer,this.$getOffsetParent())
this.lastRelativePointer=this.relativePointer
this.relativePointer=relativePointer}
this.lastPointer=this.pointer
this.pointer=pointer},distanceMet:function(e){var currentPointer=this.getPointer(e)
return(Math.max(Math.abs(this.pointer.left-currentPointer.left),Math.abs(this.pointer.top-currentPointer.top))>=this.options.distance)},getPointer:function(e){var o=e.originalEvent||e.originalEvent.touches&&e.originalEvent.touches[0]
return{left:e.pageX||o.pageX,top:e.pageY||o.pageY}},setupDelayTimer:function(){var that=this
this.delayMet=!this.options.delay
if(!this.delayMet){clearTimeout(this._mouseDelayTimer);this._mouseDelayTimer=setTimeout(function(){that.delayMet=true},this.options.delay)}},scroll:function(e){this.clearDimensions()
this.clearOffsetParent()},toggleListeners:function(method){var that=this,events=['drag','drop','scroll']
$.each(events,function(i,event){that.$document[method](eventNames[event],that[event+'Proxy'])})},clearOffsetParent:function(){this.offsetParent=undefined},clearDimensions:function(){this.traverse(function(object){object._clearDimensions()})},traverse:function(callback){callback(this)
var i=this.containers.length
while(i--){this.containers[i].traverse(callback)}},_clearDimensions:function(){this.containerDimensions=undefined},_destroy:function(){containerGroups[this.options.group]=undefined}}
function Container(element,options){this.el=element
this.options=$.extend({},containerDefaults,options)
this.group=ContainerGroup.get(this.options)
this.rootGroup=this.options.rootGroup||this.group
this.handle=this.rootGroup.options.handle||this.rootGroup.options.itemSelector
var itemPath=this.rootGroup.options.itemPath
this.target=itemPath?this.el.find(itemPath):this.el
this.target.on(eventNames.start,this.handle,$.proxy(this.dragInit,this))
if(this.options.drop)
this.group.containers.push(this)}
Container.prototype={dragInit:function(e){var rootGroup=this.rootGroup
if(!this.disabled&&!rootGroup.dragInitDone&&this.options.drag&&this.isValidDrag(e)){rootGroup.dragInit(e,this)}},isValidDrag:function(e){return e.which==1||e.type=="touchstart"&&e.originalEvent.touches.length==1},searchValidTarget:function(pointer,lastPointer){var distances=sortByDistanceDesc(this.getItemDimensions(),pointer,lastPointer),i=distances.length,rootGroup=this.rootGroup,validTarget=!rootGroup.options.isValidTarget||rootGroup.options.isValidTarget(rootGroup.item,this)
if(!i&&validTarget){rootGroup.movePlaceholder(this,this.target,"append")
return true}else
while(i--){var index=distances[i][0],distance=distances[i][1]
if(!distance&&this.hasChildGroup(index)){var found=this.getContainerGroup(index).searchValidTarget(pointer,lastPointer)
if(found)
return true}
else if(validTarget){this.movePlaceholder(index,pointer)
return true}}},movePlaceholder:function(index,pointer){var item=$(this.items[index]),dim=this.itemDimensions[index],method="after",width=item.outerWidth(),height=item.outerHeight(),offset=item.offset(),sameResultBox={left:offset.left,right:offset.left+width,top:offset.top,bottom:offset.top+height}
if(this.options.vertical){var yCenter=(dim[2]+dim[3])/2,inUpperHalf=pointer.top<=yCenter
if(inUpperHalf){method="before"
sameResultBox.bottom-=height/2}else
sameResultBox.top+=height/2}else{var xCenter=(dim[0]+dim[1])/2,inLeftHalf=pointer.left<=xCenter
if(inLeftHalf){method="before"
sameResultBox.right-=width/2}else
sameResultBox.left+=width/2}
if(this.hasChildGroup(index))
sameResultBox=emptyBox
this.rootGroup.movePlaceholder(this,item,method,sameResultBox)},getItemDimensions:function(){if(!this.itemDimensions){this.items=this.$getChildren(this.el,"item").filter(":not(."+this.group.options.placeholderClass+", ."+this.group.options.draggedClass+")").get()
setDimensions(this.items,this.itemDimensions=[],this.options.tolerance)}
return this.itemDimensions},getItemOffsetParent:function(){var offsetParent,el=this.el
if(el.css("position")==="relative"||el.css("position")==="absolute"||el.css("position")==="fixed")
offsetParent=el
else
offsetParent=el.offsetParent()
return offsetParent},hasChildGroup:function(index){return this.options.nested&&this.getContainerGroup(index)},getContainerGroup:function(index){var childGroup=$.data(this.items[index],subContainerKey)
if(childGroup===undefined){var childContainers=this.$getChildren(this.items[index],"container")
childGroup=false
if(childContainers[0]){var options=$.extend({},this.options,{rootGroup:this.rootGroup,group:groupCounter++})
childGroup=childContainers[pluginName](options).data(pluginName).group}
$.data(this.items[index],subContainerKey,childGroup)}
return childGroup},$getChildren:function(parent,type){var options=this.rootGroup.options,path=options[type+"Path"],selector=options[type+"Selector"]
parent=$(parent)
if(path)
parent=parent.find(path)
return parent.children(selector)},_serialize:function(parent,isContainer){var that=this,childType=isContainer?"item":"container",children=this.$getChildren(parent,childType).not(this.options.exclude).map(function(){return that._serialize($(this),!isContainer)}).get()
return this.rootGroup.options.serialize(parent,children,isContainer)},traverse:function(callback){$.each(this.items||[],function(item){var group=$.data(this,subContainerKey)
if(group)
group.traverse(callback)});callback(this)},_clearDimensions:function(){this.itemDimensions=undefined},_destroy:function(){var that=this;this.target.off(eventNames.start,this.handle);this.el.removeData(pluginName)
if(this.options.drop)
this.group.containers=$.grep(this.group.containers,function(val){return val!=that})
$.each(this.items||[],function(){$.removeData(this,subContainerKey)})}}
var API={enable:function(){this.traverse(function(object){object.disabled=false})},disable:function(){this.traverse(function(object){object.disabled=true})},serialize:function(){return this._serialize(this.el,true)},refresh:function(){this.traverse(function(object){object._clearDimensions()})},destroy:function(){this.traverse(function(object){object._destroy();})}}
$.extend(Container.prototype,API)
$.fn[pluginName]=function(methodOrOptions){var args=Array.prototype.slice.call(arguments,1)
return this.map(function(){var $t=$(this),object=$t.data(pluginName)
if(object&&API[methodOrOptions])
return API[methodOrOptions].apply(object,args)||this
else if(!object&&(methodOrOptions===undefined||typeof methodOrOptions==="object"))
$t.data(pluginName,new Container($t,methodOrOptions))
return this});};}(jQuery,window,'jqSortable');+function($){"use strict";var Base=$.oc.foundation.base,BaseProto=Base.prototype
var Sortable=function(element,options){this.$el=$(element)
this.options=options||{}
this.cursorAdjustment=null
$.oc.foundation.controlUtils.markDisposable(element)
Base.call(this)
this.init()}
Sortable.prototype=Object.create(BaseProto)
Sortable.prototype.constructor=Sortable
Sortable.prototype.init=function(){this.$el.one('dispose-control',this.proxy(this.dispose))
var
self=this,sortableOverrides={},sortableDefaults={onDragStart:this.proxy(this.onDragStart),onDrag:this.proxy(this.onDrag),onDrop:this.proxy(this.onDrop)}
if(this.options.onDragStart){sortableOverrides.onDragStart=function($item,container,_super,event){self.options.onDragStart($item,container,sortableDefaults.onDragStart,event)}}
if(this.options.onDrag){sortableOverrides.onDrag=function($item,position,_super,event){self.options.onDrag($item,position,sortableDefaults.onDrag,event)}}
if(this.options.onDrop){sortableOverrides.onDrop=function($item,container,_super,event){self.options.onDrop($item,container,sortableDefaults.onDrop,event)}}
this.$el.jqSortable($.extend({},sortableDefaults,this.options,sortableOverrides))}
Sortable.prototype.dispose=function(){this.$el.jqSortable('destroy')
this.$el.off('dispose-control',this.proxy(this.dispose))
this.$el.removeData('oc.sortable')
this.$el=null
this.options=null
this.cursorAdjustment=null
BaseProto.dispose.call(this)}
Sortable.prototype.onDragStart=function($item,container,_super,event){var offset=$item.offset(),pointer=container.rootGroup.pointer
if(pointer){this.cursorAdjustment={left:pointer.left-offset.left,top:pointer.top-offset.top}}
else{this.cursorAdjustment=null}
if(this.options.tweakCursorAdjustment){this.cursorAdjustment=this.options.tweakCursorAdjustment(this.cursorAdjustment)}
$item.css({height:$item.height(),width:$item.width()})
$item.addClass('dragged')
$('body').addClass('dragging')
if(this.options.useAnimation){$item.data('oc.animated',true)}
if(this.options.usePlaceholderClone){$(container.rootGroup.placeholder).html($item.html())}}
Sortable.prototype.onDrag=function($item,position,_super,event){if(this.cursorAdjustment){$item.css({left:position.left-this.cursorAdjustment.left,top:position.top-this.cursorAdjustment.top})}
else{$item.css(position)}}
Sortable.prototype.onDrop=function($item,container,_super,event){$item.removeClass('dragged').removeAttr('style')
$('body').removeClass('dragging')
if($item.data('oc.animated')){$item.hide().slideDown(200)}}
Sortable.prototype.enable=function(){this.$el.jqSortable('enable')}
Sortable.prototype.disable=function(){this.$el.jqSortable('disable')}
Sortable.prototype.refresh=function(){this.$el.jqSortable('refresh')}
Sortable.prototype.serialize=function(){this.$el.jqSortable('serialize')}
Sortable.prototype.destroy=function(){this.dispose()}
Sortable.prototype.destroyGroup=function(){var jqSortable=this.$el.data('jqSortable')
if(jqSortable.group){jqSortable.group._destroy()}}
Sortable.DEFAULTS={useAnimation:false,usePlaceholderClone:false,tweakCursorAdjustment:null}
var old=$.fn.sortable
$.fn.sortable=function(option){var args=arguments;return this.each(function(){var $this=$(this)
var data=$this.data('oc.sortable')
var options=$.extend({},Sortable.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('oc.sortable',(data=new Sortable(this,options)))
if(typeof option=='string')data[option].apply(data,args)})}
$.fn.sortable.Constructor=Sortable
$.fn.sortable.noConflict=function(){$.fn.sortable=old
return this}}(window.jQuery);+function($){'use strict';var Tab=function(element){this.element=$(element)}
Tab.prototype.show=function(){var $this=this.element
var $ul=$this.closest('ul:not(.dropdown-menu)')
var selector=$this.data('target')
if(!selector){selector=$this.attr('href')
selector=selector&&selector.replace(/.*(?=#[^\s]*$)/,'')}
if($this.parent('li').hasClass('active'))return
var previous=$ul.find('.active:last a')[0]
var e=$.Event('show.bs.tab',{relatedTarget:previous})
$this.trigger(e)
if(e.isDefaultPrevented())return
var $target=$(selector)
this.activate($this.parent('li'),$ul)
this.activate($target,$target.parent(),function(){$this.trigger({type:'shown.bs.tab',relatedTarget:previous})})}
Tab.prototype.activate=function(element,container,callback){var $active=container.find('> .active')
var transition=callback&&$.support.transition&&$active.hasClass('fade')
function next(){$active.removeClass('active').find('> .dropdown-menu > .active').removeClass('active')
element.addClass('active')
if(transition){element[0].offsetWidth
element.addClass('in')}else{element.removeClass('fade')}
if(element.parent('.dropdown-menu')){element.closest('li.dropdown').addClass('active')}
callback&&callback()}
transition?$active.one($.support.transition.end,next).emulateTransitionEnd(150):next()
$active.removeClass('in')}
var old=$.fn.tab
$.fn.tab=function(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.tab')
if(!data)$this.data('bs.tab',(data=new Tab(this)))
if(typeof option=='string')data[option]()})}
$.fn.tab.Constructor=Tab
$.fn.tab.noConflict=function(){$.fn.tab=old
return this}
$(document).on('click.bs.tab.data-api','[data-toggle="tab"], [data-toggle="pill"]',function(e){e.preventDefault()
$(this).tab('show')})}(jQuery);+function($){"use strict";var Base=$.oc.foundation.base,BaseProto=Base.prototype
var Toolbar=function(element,options){var
$el=this.$el=$(element),$toolbar=$el.closest('.control-toolbar')
$.oc.foundation.controlUtils.markDisposable(element)
this.$toolbar=$toolbar
this.options=options||{};Base.call(this)
var scrollClassContainer=options.scrollClassContainer!==undefined?options.scrollClassContainer:$el.parent()
$el.dragScroll({scrollClassContainer:scrollClassContainer})
$('.form-control.growable',$toolbar).on('focus.toolbar',function(){update()})
$('.form-control.growable',$toolbar).on('blur.toolbar',function(){update()})
this.$el.one('dispose-control',this.proxy(this.dispose))
function update(){$(window).trigger('resize')}}
Toolbar.prototype=Object.create(BaseProto)
Toolbar.prototype.constructor=Toolbar
Toolbar.prototype.dispose=function(){this.$el.off('dispose-control',this.proxy(this.dispose))
$('.form-control.growable',this.$toolbar).off('.toolbar')
this.$el.dragScroll('dispose')
this.$el.removeData('oc.toolbar')
this.$el=null
BaseProto.dispose.call(this)}
Toolbar.DEFAULTS={}
var old=$.fn.toolbar
$.fn.toolbar=function(option){var args=Array.prototype.slice.call(arguments,1)
return this.each(function(){var $this=$(this)
var data=$this.data('oc.toolbar')
var options=$.extend({},Toolbar.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('oc.toolbar',(data=new Toolbar(this,options)))
if(typeof option=='string')data[option].apply(data,args)})}
$.fn.toolbar.Constructor=Toolbar
$.fn.toolbar.noConflict=function(){$.fn.toolbar=old
return this}
$(document).on('render',function(){$('[data-control=toolbar]').toolbar()})}(window.jQuery);+function($){"use strict";var Tab=function(element,options){var $el=this.$el=$(element);this.options=options||{}
this.$tabsContainer=$('.nav-tabs',$el)
this.$pagesContainer=$('.tab-content',$el)
this.tabId='tabs'+$el.parents().length+Math.round(Math.random()*1000);if(this.options.closable!==undefined&&this.options.closable!==false)
$el.attr('data-closable','')
this.init()}
Tab.prototype.init=function(){var self=this;this.options.slidable=this.options.slidable!==undefined&&this.options.slidable!==false
$('> li',this.$tabsContainer).each(function(index){self.initTab(this)})
this.$el.on('close.oc.tab',function(ev,data){ev.preventDefault()
var force=(data!==undefined&&data.force!==undefined)?data.force:false;self.closeTab($(ev.target).closest('ul.nav-tabs > li, div.tab-content > div'),force)})
this.$el.on('toggleCollapse.oc.tab',function(ev,data){ev.preventDefault()
$(ev.target).closest('div.tab-content > div').toggleClass('collapsed')})
this.$el.on('modified.oc.tab',function(ev){ev.preventDefault()
self.modifyTab($(ev.target).closest('ul.nav-tabs > li, div.tab-content > div'))})
this.$el.on('unmodified.oc.tab',function(ev){ev.preventDefault()
self.unmodifyTab($(ev.target).closest('ul.nav-tabs > li, div.tab-content > div'))})
this.$tabsContainer.on('shown.bs.tab','li',function(){$(window).trigger('oc.updateUi')
var tabUrl=$('> a',this).data('tabUrl')
if(tabUrl){window.history.replaceState({},'Tab link reference',tabUrl)}})
if(this.options.slidable){this.$pagesContainer.touchwipe({wipeRight:function(){self.prev();},wipeLeft:function(){self.next();},preventDefaultEvents:false,min_move_x:60});}
this.$tabsContainer.toolbar({scrollClassContainer:this.$el})
this.updateClasses()}
Tab.prototype.initTab=function(li){var
$tabs=$('>li',this.$tabsContainer),tabIndex=$tabs.index(li),time=new Date().getTime(),targetId=this.tabId+'-tab-'+tabIndex+time,$a=$('a',li)
$a.attr('data-target','#'+targetId).attr('data-toggle','tab')
if(!$a.attr('title'))
$a.attr('title',$a.text())
var html=$a.html()
$a.html('')
$a.append($('<span class="title"></span>').append($('<span></span>').html(html)))
var pane=$('> .tab-pane',this.$pagesContainer).eq(tabIndex).attr('id',targetId)
$(li).append($('<span class="tab-close"><i>&times;</i></span>').click(function(){$(this).trigger('close.oc.tab')
return false}))
pane.data('tab',li)
this.$el.trigger('initTab.oc.tab',[{'pane':pane,'tab':li}])}
Tab.prototype.addTab=function(title,content,identifier,tabClass){var
processedTitle=this.generateTitleText(title,-1),$link=$('<a/>').attr('href','javascript:;').text(processedTitle),$li=$('<li/>'),$pane=$('<div>').html(content).addClass('tab-pane');$link.attr('title',title)
$li.append($link)
this.$tabsContainer.append($li)
this.$pagesContainer.append($pane)
if(tabClass!==undefined)
$link.addClass(tabClass)
if(identifier!==undefined)
$li.attr('data-tab-id',identifier)
if(this.options.paneClasses!==undefined)
$pane.addClass(this.options.paneClasses)
this.initTab($li)
$link.tab('show')
$(window).trigger('resize')
this.$tabsContainer.dragScroll('goToElement',$li)
var defaultFocus=$('[default-focus]',$pane)
if(defaultFocus.is(":visible"))
defaultFocus.focus()
this.updateClasses()}
Tab.prototype.updateTab=function(tab,title,content){var tabIndex=this.findTabIndex(tab)
if(tabIndex==-1)
return
var
processedTitle=this.generateTitleText(title,-1),$tab=$('> li',this.$tabsContainer).eq(tabIndex),$pane=$('> div',this.$pagesContainer).eq(tabIndex),$link=$('a',$tab)
$link.text(processedTitle).attr('title',title)
$pane.html(content)
this.initTab($tab)
this.updateClasses()}
Tab.prototype.generateTitleText=function(title,tabIndex){var newTitle=title
if(this.options.titleAsFileNames)
newTitle=title.replace(/^.*[\\\/]/,'')
if(this.options.maxTitleSymbols&&newTitle.length>this.options.maxTitleSymbols)
newTitle='...'+newTitle.substring(newTitle.length-this.options.maxTitleSymbols)
return newTitle}
Tab.prototype.closeTab=function(tab,force){var tabIndex=this.findTabIndex(tab)
if(tabIndex==-1)
return
var
$tab=$('> li',this.$tabsContainer).eq(tabIndex),$pane=$('> div',this.$pagesContainer).eq(tabIndex),isActive=$tab.hasClass('active'),isModified=$tab.attr('data-modified')!==undefined;if(isModified&&this.options.closeConfirmation!==undefined&&force!==true){if(!confirm(this.options.closeConfirmation))
return}
var e=$.Event('beforeClose.oc.tab',{relatedTarget:$pane})
this.$el.trigger(e)
if(e.isDefaultPrevented())
return
$pane.remove()
$tab.remove()
if(isActive)
$('> li > a',this.$tabsContainer).eq(tabIndex-1).tab('show')
if($('> li > a',this.$tabsContainer).length==0)
this.$el.trigger('afterAllClosed.oc.tab')
this.$el.trigger('closed.oc.tab',[$tab])
$(window).trigger('resize')
this.updateClasses()}
Tab.prototype.updateClasses=function(){if(this.$tabsContainer.children().length>0)
this.$el.addClass('has-tabs')
else
this.$el.removeClass('has-tabs')}
Tab.prototype.modifyTab=function(tab){var tabIndex=this.findTabIndex(tab)
if(tabIndex==-1)
return
$('> li',this.$tabsContainer).eq(tabIndex).attr('data-modified','')
$('> div',this.$pagesContainer).eq(tabIndex).attr('data-modified','')}
Tab.prototype.unmodifyTab=function(tab){var tabIndex=this.findTabIndex(tab)
if(tabIndex==-1)
return
$('> li',this.$tabsContainer).eq(tabIndex).removeAttr('data-modified')
$('> div',this.$pagesContainer).eq(tabIndex).removeAttr('data-modified')}
Tab.prototype.findTabIndex=function(tab){var tabToFind=tab
if(tab===undefined)
tabToFind=$('li.active',this.$tabsContainer)
var tabParent=this.$pagesContainer
if($(tabToFind).parent().hasClass('nav-tabs'))
tabParent=this.$tabsContainer
return tabParent.children().index($(tabToFind))}
Tab.prototype.findTabFromPane=function(pane){var id='#'+$(pane).attr('id'),tab=$('[data-target="'+id+'"]',this.$tabsContainer)
return tab}
Tab.prototype.goTo=function(identifier){var $tab=$('[data-tab-id="'+identifier+'" ]',this.$tabsContainer)
if($tab.length==0)
return false
var tabIndex=this.findTabIndex($tab)
if(tabIndex==-1)
return false
this.goToIndex(tabIndex)
this.$tabsContainer.dragScroll('goToElement',$tab)
return true}
Tab.prototype.goToPane=function(pane){var $pane=$(pane),$tab=this.findTabFromPane($pane)
if($pane.length==0)
return
$pane.removeClass('collapsed')
var tabIndex=this.findTabIndex($pane)
if(tabIndex==-1)
return false
this.goToIndex(tabIndex)
if($tab.length>0)
this.$tabsContainer.dragScroll('goToElement',$tab)
return true}
Tab.prototype.goToElement=function(element){return this.goToPane(element.closest('.tab-pane'))}
Tab.prototype.findByIdentifier=function(identifier){return $('[data-tab-id="'+identifier+'" ]',this.$tabsContainer);}
Tab.prototype.updateIdentifier=function(tab,identifier){var index=this.findTabIndex(tab)
if(index==-1)
return
$('> li',this.$tabsContainer).eq(index).attr('data-tab-id',identifier)}
Tab.prototype.updateTitle=function(tab,title){var index=this.findTabIndex(tab)
if(index==-1)
return
var processedTitle=this.generateTitleText(title,index),$link=$('> li > a span.title',this.$tabsContainer).eq(index)
$link.attr('title',title)
$link.text(processedTitle)}
Tab.prototype.goToIndex=function(index){$('> li > a',this.$tabsContainer).eq(index).tab('show')}
Tab.prototype.prev=function(){var tabIndex=this.findTabIndex()
if(tabIndex<=0)
return
this.goToIndex(tabIndex-1)}
Tab.prototype.next=function(){var tabIndex=this.findTabIndex()
if(tabIndex==-1)
return
this.goToIndex(tabIndex+1)}
Tab.DEFAULTS={}
var old=$.fn.ocTab
$.fn.ocTab=function(option){var args=arguments;return this.each(function(){var $this=$(this)
var data=$this.data('oc.tab')
var options=$.extend({},Tab.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('oc.tab',(data=new Tab(this,options)))
if(typeof option=='string'){var methodArgs=[];for(var i=1;i<args.length;i++)
methodArgs.push(args[i])
data[option].apply(data,methodArgs)}})}
$.fn.ocTab.Constructor=Tab
$.fn.ocTab.noConflict=function(){$.fn.ocTab=old
return this}
$(document).render(function(){$('[data-control=tab]').ocTab()})
$(window).on('ajaxInvalidField',function(event,element,name,messages,isFirst){if(!isFirst)return
event.preventDefault()
var $el=$(element)
$el.closest('[data-control=tab]').ocTab('goToElement',$el)
$el.focus()})}(window.jQuery);+function($){"use strict";var Base=$.oc.foundation.base,BaseProto=Base.prototype
var Scrollpad=function(element,options){this.$el=$(element)
this.scrollbarElement=null
this.dragHandleElement=null
this.scrollContentElement=null
this.contentElement=null
this.options=options
this.scrollbarSize=null
this.updateScrollbarTimer=null
this.dragOffset=null
Base.call(this)
this.init()}
Scrollpad.prototype=Object.create(BaseProto)
Scrollpad.prototype.constructor=Scrollpad
Scrollpad.prototype.dispose=function(){this.unregisterHandlers()
this.$el.get(0).removeChild(this.scrollbarElement)
this.$el.removeData('oc.scrollpad')
this.$el=null
this.scrollbarElement=null
this.dragHandleElement=null
this.scrollContentElement=null
this.contentElement=null
BaseProto.dispose.call(this)}
Scrollpad.prototype.scrollToStart=function(){var scrollAttr=this.options.direction=='vertical'?'scrollTop':'scrollLeft'
this.scrollContentElement[scrollAttr]=0}
Scrollpad.prototype.update=function(){this.updateScrollbarSize()}
Scrollpad.prototype.init=function(){this.build()
this.setScrollContentSize()
this.registerHandlers()}
Scrollpad.prototype.build=function(){var el=this.$el.get(0)
this.scrollContentElement=el.children[0]
this.contentElement=this.scrollContentElement.children[0]
this.$el.prepend('<div class="scrollpad-scrollbar"><div class="drag-handle"></div></div>')
this.scrollbarElement=el.querySelector('.scrollpad-scrollbar')
this.dragHandleElement=el.querySelector('.scrollpad-scrollbar > .drag-handle')}
Scrollpad.prototype.registerHandlers=function(){this.$el.on('mouseenter',this.proxy(this.onMouseEnter))
this.$el.on('mouseleave',this.proxy(this.onMouseLeave))
this.scrollContentElement.addEventListener('scroll',this.proxy(this.onScroll))
this.dragHandleElement.addEventListener('mousedown',this.proxy(this.onStartDrag))}
Scrollpad.prototype.unregisterHandlers=function(){this.$el.off('mouseenter',this.proxy(this.onMouseEnter))
this.$el.off('mouseleave',this.proxy(this.onMouseLeave))
this.scrollContentElement.removeEventListener('scroll',this.proxy(this.onScroll))
this.dragHandleElement.removeEventListener('mousedown',this.proxy(this.onStartDrag))
document.removeEventListener('mousemove',this.proxy(this.onMouseMove))
document.removeEventListener('mouseup',this.proxy(this.onEndDrag))}
Scrollpad.prototype.setScrollContentSize=function(){var scrollbarSize=this.getScrollbarSize()
if(this.options.direction=='vertical')
this.scrollContentElement.setAttribute('style','margin-right: -'+scrollbarSize+'px')
else
this.scrollContentElement.setAttribute('style','margin-bottom: -'+scrollbarSize+'px')}
Scrollpad.prototype.getScrollbarSize=function(){if(this.scrollbarSize!==null)
return this.scrollbarSize
var testerElement=document.createElement('div')
testerElement.setAttribute('class','scrollpad-scrollbar-size-tester')
testerElement.appendChild(document.createElement('div'))
document.body.appendChild(testerElement)
var width=testerElement.offsetWidth,innerWidth=testerElement.querySelector('div').offsetWidth
document.body.removeChild(testerElement)
if(width===innerWidth&&navigator.userAgent.toLowerCase().indexOf('firefox')>-1)
return this.scrollbarSize=17
return this.scrollbarSize=width-innerWidth}
Scrollpad.prototype.updateScrollbarSize=function(){this.scrollbarElement.removeAttribute('data-hidden')
var contentSize=this.options.direction=='vertical'?this.contentElement.scrollHeight:this.contentElement.scrollWidth,scrollOffset=this.options.direction=='vertical'?this.scrollContentElement.scrollTop:this.scrollContentElement.scrollLeft,scrollbarSize=this.options.direction=='vertical'?this.scrollbarElement.offsetHeight:this.scrollbarElement.offsetWidth,scrollbarRatio=scrollbarSize/contentSize,handleOffset=Math.round(scrollbarRatio*scrollOffset)+2,handleSize=Math.floor(scrollbarRatio*(scrollbarSize-2))-2;if(scrollbarSize<contentSize){if(this.options.direction=='vertical')
this.dragHandleElement.setAttribute('style','top: '+handleOffset+'px; height: '+handleSize+'px')
else
this.dragHandleElement.setAttribute('style','left: '+handleOffset+'px; width: '+handleSize+'px')
this.scrollbarElement.removeAttribute('data-hidden')}
else
this.scrollbarElement.setAttribute('data-hidden',true)}
Scrollpad.prototype.displayScrollbar=function(){this.clearUpdateScrollbarTimer()
this.updateScrollbarSize()
this.scrollbarElement.setAttribute('data-visible','true')}
Scrollpad.prototype.hideScrollbar=function(){this.scrollbarElement.removeAttribute('data-visible')}
Scrollpad.prototype.clearUpdateScrollbarTimer=function(){if(this.updateScrollbarTimer===null)
return
clearTimeout(this.updateScrollbarTimer)
this.updateScrollbarTimer=null}
Scrollpad.prototype.onMouseEnter=function(){this.displayScrollbar()}
Scrollpad.prototype.onMouseLeave=function(){this.hideScrollbar()}
Scrollpad.prototype.onScroll=function(){if(this.updateScrollbarTimer!==null)
return
this.updateScrollbarTimer=setTimeout(this.proxy(this.displayScrollbar),10)}
Scrollpad.prototype.onStartDrag=function(ev){$.oc.foundation.event.stop(ev)
var pageCoords=$.oc.foundation.event.pageCoordinates(ev),eventOffset=this.options.direction=='vertical'?pageCoords.y:pageCoords.x,handleCoords=$.oc.foundation.element.absolutePosition(this.dragHandleElement),handleOffset=this.options.direction=='vertical'?handleCoords.top:handleCoords.left
this.dragOffset=eventOffset-handleOffset
document.addEventListener('mousemove',this.proxy(this.onMouseMove))
document.addEventListener('mouseup',this.proxy(this.onEndDrag))}
Scrollpad.prototype.onMouseMove=function(ev){$.oc.foundation.event.stop(ev)
var eventCoordsAttr=this.options.direction=='vertical'?'y':'x',elementCoordsAttr=this.options.direction=='vertical'?'top':'left',offsetAttr=this.options.direction=='vertical'?'offsetHeight':'offsetWidth',scrollAttr=this.options.direction=='vertical'?'scrollTop':'scrollLeft'
var eventOffset=$.oc.foundation.event.pageCoordinates(ev)[eventCoordsAttr],scrollbarOffset=$.oc.foundation.element.absolutePosition(this.scrollbarElement)[elementCoordsAttr],dragPos=eventOffset-scrollbarOffset-this.dragOffset,scrollbarSize=this.scrollbarElement[offsetAttr],contentSize=this.contentElement[offsetAttr],dragPerc=dragPos/scrollbarSize
if(dragPerc>1)
dragPerc=1
var scrollPos=dragPerc*contentSize;this.scrollContentElement[scrollAttr]=scrollPos}
Scrollpad.prototype.onEndDrag=function(ev){document.removeEventListener('mousemove',this.proxy(this.onMouseMove))
document.removeEventListener('mouseup',this.proxy(this.onEndDrag))}
Scrollpad.DEFAULTS={direction:'vertical'}
var old=$.fn.scrollpad
$.fn.scrollpad=function(option){var args=Array.prototype.slice.call(arguments,1),result=undefined
this.each(function(){var $this=$(this)
var data=$this.data('oc.scrollpad')
var options=$.extend({},Scrollpad.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('oc.scrollpad',(data=new Scrollpad(this,options)))
if(typeof option=='string')result=data[option].apply(data,args)
if(typeof result!='undefined')return false})
return result?result:this}
$.fn.scrollpad.Constructor=Scrollpad
$.fn.scrollpad.noConflict=function(){$.fn.scrollpad=old
return this}
$(document).on('render',function(){$('div[data-control=scrollpad]').scrollpad()})}(window.jQuery);+function($){"use strict";var VerticalMenu=function(element,toggle,options){this.body=$('body')
this.toggle=$(toggle)
this.options=options||{}
this.options=$.extend({},VerticalMenu.DEFAULTS,this.options)
this.wrapper=$(this.options.contentWrapper)
this.menuPanel=$('<div></div>').appendTo('body').addClass(this.options.collapsedMenuClass).css('width',0)
this.menuContainer=$('<div></div>').appendTo(this.menuPanel).css('display','none')
this.menuElement=$(element).clone().appendTo(this.menuContainer).css('width','auto')
var self=this
this.toggle.click(function(){if(!self.body.hasClass(self.options.bodyMenuOpenClass)){var wrapperWidth=self.wrapper.outerWidth()
self.menuElement.dragScroll('goToStart')
self.wrapper.css({'position':'absolute','min-width':self.wrapper.width(),'height':'100%'})
self.body.addClass(self.options.bodyMenuOpenClass)
self.menuContainer.css('display','block')
self.wrapper.animate({'left':self.options.menuWidth},{duration:200,queue:false})
self.menuPanel.animate({'width':self.options.menuWidth},{duration:200,queue:false,complete:function(){self.menuElement.css('width',self.options.menuWidth)}})}else{closeMenu()}
return false})
this.wrapper.click(function(){if(self.body.hasClass(self.options.bodyMenuOpenClass)){closeMenu()
return false}})
$(window).resize(function(){if(self.body.hasClass(self.options.bodyMenuOpenClass)){if($(window).width()>self.options.breakpoint){hideMenu()}}})
this.menuElement.dragScroll({vertical:true,start:function(){self.menuElement.addClass('drag')},stop:function(){self.menuElement.removeClass('drag')},scrollClassContainer:self.menuPanel,scrollMarkerContainer:self.menuContainer})
this.menuElement.on('click',function(){if(self.menuElement.hasClass('drag'))
return false})
function hideMenu(){self.body.removeClass(self.options.bodyMenuOpenClass)
self.wrapper.css({'position':'static','min-width':0,'right':0,'height':'100%'})
self.menuPanel.css('width',0)
self.menuElement.css('width','auto')
self.menuContainer.css('display','none')}
function closeMenu(){self.wrapper.animate({'left':0},{duration:200,queue:false})
self.menuPanel.animate({'width':0},{duration:200,queue:false,complete:hideMenu})
self.menuElement.animate({'width':0},{duration:200,queue:false})}}
VerticalMenu.DEFAULTS={menuWidth:250,minContentWidth:769,breakpoint:769,bodyMenuOpenClass:'mainmenu-open',collapsedMenuClass:'mainmenu-collapsed',contentWrapper:'#layout-canvas'}
var old=$.fn.verticalMenu
$.fn.verticalMenu=function(toggleSelector,option){return this.each(function(){var $this=$(this)
var data=$this.data('oc.verticalMenu')
var options=typeof option=='object'&&option
if(!data)$this.data('oc.verticalMenu',(data=new VerticalMenu(this,toggleSelector,options)))
if(typeof option=='string')data[option].call($this)})}
$.fn.verticalMenu.Constructor=VerticalMenu
$.fn.verticalMenu.noConflict=function(){$.fn.verticalMenu=old
return this}}(window.jQuery);(function($){$(window).load(function(){$('nav.navbar').each(function(){var
navbar=$(this),nav=$('ul.nav',navbar)
nav.verticalMenu($('a.menu-toggle',navbar))
$('li.with-tooltip > a',navbar).tooltip({container:'body',placement:'bottom'})
$('.layout-cell.width-fix',navbar).one('oc.widthFixed',function(){var dragScroll=$('[data-control=toolbar]',navbar).data('oc.dragScroll')
if(dragScroll)
dragScroll.goToElement($('ul.nav > li.active',navbar),undefined,{'duration':0})})})})})(jQuery);+function($){"use strict";if($.oc===undefined)
$.oc={}
var SideNav=function(element,options){this.options=options
this.$el=$(element)
this.$list=$('ul',this.$el)
this.init();}
SideNav.DEFAULTS={}
SideNav.prototype.init=function(){var self=this;this.$list.dragScroll({vertical:true,start:function(){self.$list.addClass('drag')},stop:function(){self.$list.removeClass('drag')},scrollClassContainer:self.$el,scrollMarkerContainer:self.$el})
this.$list.on('click',function(){if(self.$list.hasClass('drag'))
return false})}
SideNav.prototype.setCounter=function(itemId,value){var $counter=$('span.counter[data-menu-id="'+itemId+'"]',this.$el)
$counter.removeClass('empty')
$counter.toggleClass('empty',value==0)
$counter.text(value)
return this}
SideNav.prototype.increaseCounter=function(itemId,value){var $counter=$('span.counter[data-menu-id="'+itemId+'"]',this.$el)
var originalValue=parseInt($counter.text())
if(isNaN(originalValue))
originalValue=0
var newValue=value+originalValue
$counter.toggleClass('empty',newValue==0)
$counter.text(newValue)
return this}
SideNav.prototype.dropCounter=function(itemId){this.setCounter(itemId,0)
return this}
var old=$.fn.sideNav
$.fn.sideNav=function(option){return this.each(function(){var $this=$(this)
var data=$this.data('oc.sideNav')
var options=$.extend({},SideNav.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('oc.sideNav',(data=new SideNav(this,options)))
if(typeof option=='string')data[option].call($this)
if($.oc.sideNav===undefined)
$.oc.sideNav=data})}
$.fn.sideNav.Constructor=SideNav
$.fn.sideNav.noConflict=function(){$.fn.sideNav=old
return this}
$(document).ready(function(){$('[data-control="sidenav"]').sideNav()})}(window.jQuery);+function($){"use strict";var Base=$.oc.foundation.base,BaseProto=Base.prototype
var Scrollbar=function(element,options){var
$el=this.$el=$(element),el=$el.get(0),self=this,options=this.options=options||{},sizeName=this.sizeName=options.vertical?'height':'width',isTouch=this.isTouch=Modernizr.touch,isScrollable=this.isScrollable=false,isLocked=this.isLocked=false,eventElementName=options.vertical?'pageY':'pageX',dragStart=0,startOffset=0;$.oc.foundation.controlUtils.markDisposable(element)
Base.call(this)
this.$el.one('dispose-control',this.proxy(this.dispose))
this.$scrollbar=$('<div />').addClass('scrollbar-scrollbar')
this.$track=$('<div />').addClass('scrollbar-track').appendTo(this.$scrollbar)
this.$thumb=$('<div />').addClass('scrollbar-thumb').appendTo(this.$track)
$el.addClass('drag-scrollbar').addClass(options.vertical?'vertical':'horizontal').prepend(this.$scrollbar)
if(isTouch){this.$el.on('touchstart',function(event){var touchEvent=event.originalEvent;if(touchEvent.touches.length==1){startDrag(touchEvent.touches[0])
event.stopPropagation()}})}
else{this.$thumb.on('mousedown',function(event){startDrag(event)})
this.$track.on('mouseup',function(event){moveDrag(event)})}
$el.mousewheel(function(event){var offset=self.options.vertical?((event.deltaFactor*event.deltaY)*-1):(event.deltaFactor*event.deltaX)
return!scrollWheel(offset*self.options.scrollSpeed)})
$el.on('oc.scrollbar.gotoStart',function(event){self.options.vertical?$el.scrollTop(0):$el.scrollLeft(0)
self.update()
event.stopPropagation()})
$(window).on('resize',$.proxy(this.update,this))
$(window).on('oc.updateUi',$.proxy(this.update,this))
function startDrag(event){$('body').addClass('drag-noselect')
$el.trigger('oc.scrollStart')
dragStart=event[eventElementName]
startOffset=self.options.vertical?$el.scrollTop():$el.scrollLeft()
if(isTouch){$(window).on('touchmove.scrollbar',function(event){var touchEvent=event.originalEvent
if(moveDrag(touchEvent.touches[0]))
event.preventDefault();});$el.on('touchend.scrollbar',stopDrag)}
else{$(window).on('mousemove.scrollbar',function(event){moveDrag(event)
return false})
$(window).on('mouseup.scrollbar',function(){stopDrag()
return false})}}
function moveDrag(event){self.isLocked=true;var
offset,dragTo=event[eventElementName]
if(self.isTouch){offset=dragStart-dragTo}
else{var ratio=self.getCanvasSize()/self.getViewportSize()
offset=(dragTo-dragStart)*ratio}
self.options.vertical?$el.scrollTop(startOffset+offset):$el.scrollLeft(startOffset+offset)
self.setThumbPosition()
return self.options.vertical?el.scrollTop!=startOffset:el.scrollLeft!=startOffset}
function stopDrag(){$('body').removeClass('drag-noselect')
$el.trigger('oc.scrollEnd')
$(window).off('.scrollbar')}
var isWebkit=$(document.documentElement).hasClass('webkit')
function scrollWheel(offset){startOffset=self.options.vertical?el.scrollTop:el.scrollLeft
$el.trigger('oc.scrollStart')
self.options.vertical?$el.scrollTop(startOffset+offset):$el.scrollLeft(startOffset+offset)
var scrolled=self.options.vertical?el.scrollTop!=startOffset:el.scrollLeft!=startOffset
self.setThumbPosition()
if(!isWebkit){if(self.endScrollTimeout!==undefined){clearTimeout(self.endScrollTimeout)
self.endScrollTimeout=undefined}
self.endScrollTimeout=setTimeout(function(){$el.trigger('oc.scrollEnd')
self.endScrollTimeout=undefined},50)}else{$el.trigger('oc.scrollEnd')}
return scrolled}
setTimeout(function(){self.update()},1);}
Scrollbar.prototype=Object.create(BaseProto)
Scrollbar.prototype.constructor=Scrollbar
Scrollbar.prototype.dispose=function(){this.unregisterHandlers()
BaseProto.dispose.call(this)}
Scrollbar.prototype.unregisterHandlers=function(){}
Scrollbar.DEFAULTS={vertical:true,scrollSpeed:2,animation:true,start:function(){},drag:function(){},stop:function(){}}
Scrollbar.prototype.update=function(){if(!this.$scrollbar)
return
this.$scrollbar.hide()
this.setThumbSize()
this.setThumbPosition()
this.$scrollbar.show()}
Scrollbar.prototype.setThumbSize=function(){var properties=this.calculateProperties()
this.isScrollable=!(properties.thumbSizeRatio>=1);this.$scrollbar.toggleClass('disabled',!this.isScrollable)
if(this.options.vertical){this.$track.height(properties.canvasSize)
this.$thumb.height(properties.thumbSize)}
else{this.$track.width(properties.canvasSize)
this.$thumb.width(properties.thumbSize)}}
Scrollbar.prototype.setThumbPosition=function(){var properties=this.calculateProperties()
if(this.options.vertical)
this.$thumb.css({top:properties.thumbPosition})
else
this.$thumb.css({left:properties.thumbPosition})}
Scrollbar.prototype.calculateProperties=function(){var $el=this.$el,properties={};properties.viewportSize=this.getViewportSize()
properties.canvasSize=this.getCanvasSize()
properties.scrollAmount=(this.options.vertical)?$el.scrollTop():$el.scrollLeft()
properties.thumbSizeRatio=properties.viewportSize/properties.canvasSize
properties.thumbSize=properties.viewportSize*properties.thumbSizeRatio
properties.thumbPositionRatio=properties.scrollAmount/(properties.canvasSize-properties.viewportSize)
properties.thumbPosition=((properties.viewportSize-properties.thumbSize)*properties.thumbPositionRatio)+properties.scrollAmount
if(isNaN(properties.thumbPosition))
properties.thumbPosition=0
return properties;}
Scrollbar.prototype.getViewportSize=function(){return(this.options.vertical)?this.$el.height():this.$el.width();}
Scrollbar.prototype.getCanvasSize=function(){return(this.options.vertical)?this.$el.get(0).scrollHeight:this.$el.get(0).scrollWidth;}
Scrollbar.prototype.gotoElement=function(element,callback){var $el=$(element)
if(!$el.length)
return;var self=this,offset=0,animated=false,params={duration:300,queue:false,complete:function(){if(callback!==undefined)
callback()}}
if(!this.options.vertical){offset=$el.get(0).offsetLeft-this.$el.scrollLeft()
if(offset<0){this.$el.animate({'scrollLeft':$el.get(0).offsetLeft},params)
animated=true}else{offset=$el.get(0).offsetLeft+$el.outerWidth()-(this.$el.scrollLeft()+this.$el.outerWidth())
if(offset>0){this.$el.animate({'scrollLeft':$el.get(0).offsetLeft+$el.outerWidth()-this.$el.outerWidth()},params)
animated=true}}}else{offset=$el.get(0).offsetTop-this.$el.scrollTop()
if(this.options.animation){if(offset<0){this.$el.animate({'scrollTop':$el.get(0).offsetTop},params)
animated=true}else{offset=$el.get(0).offsetTop-(this.$el.scrollTop()+this.$el.outerHeight())
if(offset>0){this.$el.animate({'scrollTop':$el.get(0).offsetTop+$el.outerHeight()-this.$el.outerHeight()},params)
animated=true}}}else{if(offset<0){this.$el.scrollTop($el.get(0).offsetTop)}else{offset=$el.get(0).offsetTop-(this.$el.scrollTop()+this.$el.outerHeight())
if(offset>0)
this.$el.scrollTop($el.get(0).offsetTop+$el.outerHeight()-this.$el.outerHeight())}}}
if(!animated&&callback!==undefined)
callback()
return this}
Scrollbar.prototype.dispose=function(){this.$el=null
this.$scrollbar=null
this.$track=null
this.$thumb=null}
var old=$.fn.scrollbar
$.fn.scrollbar=function(option){return this.each(function(){var $this=$(this)
var data=$this.data('oc.scrollbar')
var options=$.extend({},Scrollbar.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('oc.scrollbar',(data=new Scrollbar(this,options)))
if(typeof option=='string')data[option].call($this)})}
$.fn.scrollbar.Constructor=Scrollbar
$.fn.scrollbar.noConflict=function(){$.fn.scrollbar=old
return this}
$(document).render(function(){$('[data-control=scrollbar]').scrollbar()})}(window.jQuery);+function($){"use strict";var FileList=function(element,options){this.options=options
this.$el=$(element)
this.init();}
FileList.DEFAULTS={ignoreItemClick:false}
FileList.prototype.init=function(){var self=this
this.$el.on('click','li.group > h4 > a, li.group > div.group',function(){self.toggleGroup($(this).closest('li'))
return false;});if(!this.options.ignoreItemClick){this.$el.on('click','li.item > a',function(event){var e=$.Event('open.oc.list',{relatedTarget:$(this).parent().get(0),clickEvent:event})
self.$el.trigger(e,this)
return false})}
this.$el.on('ajaxUpdate',$.proxy(this.update,this))}
FileList.prototype.toggleGroup=function(group){var $group=$(group);$group.attr('data-status')=='expanded'?this.collapseGroup($group):this.expandGroup($group)}
FileList.prototype.collapseGroup=function(group){var
$list=$('> ul, > div.subitems',group),self=this;$list.css('overflow','hidden')
$list.animate({'height':0},{duration:100,queue:false,complete:function(){$list.css({'overflow':'visible','display':'none'})
$(group).attr('data-status','collapsed')
$(window).trigger('resize')}})
this.sendGroupStatusRequest(group,0);}
FileList.prototype.expandGroup=function(group){var
$list=$('> ul, > div.subitems',group),self=this;$list.css({'overflow':'hidden','display':'block','height':0})
$list.animate({'height':$list[0].scrollHeight},{duration:100,queue:false,complete:function(){$list.css({'overflow':'visible','height':'auto'})
$(group).attr('data-status','expanded')
$(window).trigger('resize')}})
this.sendGroupStatusRequest(group,1);}
FileList.prototype.sendGroupStatusRequest=function(group,status){if(this.options.groupStatusHandler!==undefined){var groupId=$(group).data('group-id')
if(groupId===undefined)
groupId=$('> h4 a',group).text();$(group).request(this.options.groupStatusHandler,{data:{group:groupId,status:status}})}}
FileList.prototype.markActive=function(dataId){$('li.item',this.$el).removeClass('active')
if(dataId)
$('li.item[data-id="'+dataId+'"]',this.$el).addClass('active')
this.dataId=dataId}
FileList.prototype.update=function(){if(this.dataId!==undefined)
this.markActive(this.dataId)}
var old=$.fn.fileList
$.fn.fileList=function(option){var args=arguments;return this.each(function(){var $this=$(this)
var data=$this.data('oc.fileList')
var options=$.extend({},FileList.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('oc.fileList',(data=new FileList(this,options)))
if(typeof option=='string'){var methodArgs=[];for(var i=1;i<args.length;i++)
methodArgs.push(args[i])
data[option].apply(data,methodArgs)}})}
$.fn.fileList.Constructor=FileList
$.fn.fileList.noConflict=function(){$.fn.fileList=old
return this}
$(document).ready(function(){$('[data-control=filelist]').fileList()})}(window.jQuery);(function($){var OctoberLayout=function(){this.$accountMenuOverlay=null}
OctoberLayout.prototype.setPageTitle=function(title){var $title=$('title')
if(this.pageTitleTemplate===undefined)
this.pageTitleTemplate=$title.data('titleTemplate')
$title.text(this.pageTitleTemplate.replace('%s',title))}
OctoberLayout.prototype.updateLayout=function(title){$('.layout-cell.width-fix').each(function(){var $el=$(this).children();if($el.length>0){var margin=$el.data('oc.layoutMargin');if(margin===undefined){margin=parseInt($el.css('marginRight'))+parseInt($el.css('marginLeft'))
$el.data('oc.layoutMargin',margin)}
$(this).width($el.get(0).offsetWidth+margin)
$(this).trigger('oc.widthFixed')}})}
OctoberLayout.prototype.toggleAccountMenu=function(el){var self=this,$menu=$(el).next()
if($menu.hasClass('active')){self.$accountMenuOverlay.remove()
$menu.removeClass('active')}
else{self.$accountMenuOverlay=$('<div />').addClass('popover-overlay')
$(document.body).append(self.$accountMenuOverlay)
$menu.addClass('active')
self.$accountMenuOverlay.one('click',function(){self.$accountMenuOverlay.remove()
$menu.removeClass('active')})}}
if($.oc===undefined)
$.oc={}
$.oc.layout=new OctoberLayout()
$(document).ready(function(){$.oc.layout.updateLayout()
window.setTimeout($.oc.layout.updateLayout,100)})
$(window).on('resize',function(){$.oc.layout.updateLayout()})
$(window).on('oc.updateUi',function(){$.oc.layout.updateLayout()})})(jQuery);+function($){"use strict";var SidePanelTab=function(element,options){this.options=options
this.$el=$(element)
this.init()}
SidePanelTab.prototype.init=function(){var self=this
this.tabOpenDelay=200
this.tabOpenTimeout=undefined
this.panelOpenTimeout=undefined
this.$sideNav=$('#layout-sidenav')
this.$sideNavItems=$('ul li',this.$sideNav)
this.$sidePanelItems=$('[data-content-id]',this.$el)
this.sideNavWidth=this.$sideNavItems.outerWidth()
this.mainNavHeight=$('#layout-mainmenu').outerHeight()
this.panelVisible=false
this.visibleItemId=false
this.$fixButton=$('<a href="#" class="fix-button"><i class="icon-thumb-tack"></i></a>')
this.$fixButton.click(function(){self.fixPanel()
return false})
$('.fix-button-container',this.$el).append(this.$fixButton)
this.$sideNavItems.click(function(){if(Modernizr.touch&&$(window).width()<self.options.breakpoint){if($(this).data('menu-item')==self.visibleItemId&&self.panelVisible){self.hideSidePanel()
return}else
self.displaySidePanel()}
self.displayTab(this)
return false})
if(!Modernizr.touch){self.$sideNav.mouseenter(function(){if($(window).width()<self.options.breakpoint||!self.panelFixed()){self.panelOpenTimeout=setTimeout(function(){self.displaySidePanel()},self.tabOpenDelay)}})
self.$sideNav.mouseleave(function(){clearTimeout(self.panelOpenTimeout)})
self.$el.mouseleave(function(){self.hideSidePanel()})
self.$sideNavItems.mouseenter(function(){if($(window).width()<self.options.breakpoint||!self.panelFixed()){var _this=this
self.tabOpenTimeout=setTimeout(function(){self.displayTab(_this)},self.tabOpenDelay)}})
self.$sideNavItems.mouseleave(function(){clearTimeout(self.tabOpenTimeout)})
$(window).resize(function(){self.updatePanelPosition()
self.updateActiveTab()})}else{$('#layout-body').click(function(){if(self.panelVisible){self.hideSidePanel()
return false}})
self.$el.on('close.oc.sidePanel',function(){self.hideSidePanel()})}
this.updateActiveTab()}
SidePanelTab.prototype.displayTab=function(menuItem){var menuItemId=$(menuItem).data('menu-item')
this.$sideNavItems.removeClass('active')
$(menuItem).addClass('active')
this.visibleItemId=menuItemId
this.$sidePanelItems.each(function(){var $el=$(this)
$el.toggleClass('hide',$el.data('content-id')!=menuItemId)})
$(window).trigger('resize')}
SidePanelTab.prototype.displaySidePanel=function(){$(document.body).addClass('display-side-panel')
this.$el.appendTo('#layout-canvas')
this.panelVisible=true
this.$el.css({left:this.sideNavWidth,top:this.mainNavHeight})
this.updatePanelPosition()
$(window).trigger('resize')}
SidePanelTab.prototype.hideSidePanel=function(){$(document.body).removeClass('display-side-panel')
if(this.$el.next('#layout-body').length==0){$('#layout-body').before(this.$el)}
this.panelVisible=false
this.updateActiveTab()}
SidePanelTab.prototype.updatePanelPosition=function(){if(!this.panelFixed()||Modernizr.touch){this.$el.height($(document).height()-this.mainNavHeight)}
else{this.$el.css('height','')}
if(this.panelVisible&&$(window).width()>this.options.breakpoint&&this.panelFixed()){this.hideSidePanel()}}
SidePanelTab.prototype.updateActiveTab=function(){if(!this.panelVisible&&($(window).width()<this.options.breakpoint||!this.panelFixed())){this.$sideNavItems.removeClass('active')}
else{this.$sideNavItems.filter('[data-menu-item='+this.visibleItemId+']').addClass('active')}}
SidePanelTab.prototype.panelFixed=function(){return!($(window).width()<this.options.breakpoint)&&!$(document.body).hasClass('side-panel-not-fixed')}
SidePanelTab.prototype.fixPanel=function(){$(document.body).toggleClass('side-panel-not-fixed')
var self=this
window.setTimeout(function(){var fixed=self.panelFixed()
if(fixed){self.updateActiveTab()
$(document.body).addClass('side-panel-fix-shadow')}else{$(document.body).removeClass('side-panel-fix-shadow')
self.hideSidePanel()}
if(typeof(localStorage)!=='undefined')
localStorage.ocSidePanelFixed=fixed?1:0},0)}
SidePanelTab.DEFAULTS={breakpoint:769}
var old=$.fn.sidePanelTab
$.fn.sidePanelTab=function(option){return this.each(function(){var $this=$(this)
var data=$this.data('oc.sidePanelTab')
var options=$.extend({},SidePanelTab.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('oc.sidePanelTab',(data=new SidePanelTab(this,options)))
if(typeof option=='string')data[option].call($this)})}
$.fn.sidePanelTab.Constructor=SidePanelTab
$.fn.sidePanelTab.noConflict=function(){$.fn.sidePanelTab=old
return this}
$(window).load(function(){$('[data-control=layout-sidepanel]').sidePanelTab()})
$(document).ready(function(){if(Modernizr.touch||(typeof(localStorage)!=='undefined'&&localStorage.ocSidePanelFixed==1)){$(document.body).removeClass('side-panel-not-fixed')
$(window).trigger('resize')}})}(window.jQuery);+function($){"use strict";var SimpleList=function(element,options){var $el=this.$el=$(element)
this.options=options||{}
if($el.hasClass('is-sortable')){var sortableOptions={distance:10}
if(this.options.sortableHandle)
sortableOptions[handle]=this.options.sortableHandle
$el.find('> ul, > ol').sortable(sortableOptions)}
if($el.hasClass('is-scrollable')){$el.wrapInner($('<div />').addClass('control-scrollbar'))
var $scrollbar=$el.find('>.control-scrollbar:first')
$scrollbar.scrollbar()}}
SimpleList.DEFAULTS={sortableHandle:null}
var old=$.fn.simplelist
$.fn.simplelist=function(option){return this.each(function(){var $this=$(this)
var data=$this.data('oc.simplelist')
var options=$.extend({},SimpleList.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('oc.simplelist',(data=new SimpleList(this,options)))})}
$.fn.simplelist.Constructor=SimpleList
$.fn.simplelist.noConflict=function(){$.fn.simplelist=old
return this}
$(document).render(function(){$('[data-control="simplelist"]').simplelist()})}(window.jQuery);+function($){"use strict";var Base=$.oc.foundation.base,BaseProto=Base.prototype
var TreeListWidget=function(element,options){this.$el=$(element)
this.options=options||{};Base.call(this)
$.oc.foundation.controlUtils.markDisposable(element)
this.init()}
TreeListWidget.prototype=Object.create(BaseProto)
TreeListWidget.prototype.constructor=TreeListWidget
TreeListWidget.prototype.init=function(){var sortableOptions={handle:this.options.handle,nested:this.options.nested,onDrop:this.proxy(this.onDrop),afterMove:this.proxy(this.onAfterMove)}
this.$el.find('> ol').sortable($.extend(sortableOptions,this.options))
if(!this.options.nested)
this.$el.find('> ol ol').sortable($.extend(sortableOptions,this.options))
this.$el.one('dispose-control',this.proxy(this.dispose))}
TreeListWidget.prototype.dispose=function(){this.unbind()
BaseProto.dispose.call(this)}
TreeListWidget.prototype.unbind=function(){this.$el.off('dispose-control',this.proxy(this.dispose))
this.$el.find('> ol').sortable('destroy')
if(!this.options.nested){this.$el.find('> ol ol').sortable('destroy')}
this.$el.removeData('oc.treelist')
this.$el=null
this.options=null}
TreeListWidget.DEFAULTS={handle:null,nested:true}
TreeListWidget.prototype.onDrop=function($item,container,_super){if(!this.$el){return}
this.$el.trigger('move.oc.treelist',{item:$item,container:container})
_super($item,container)}
TreeListWidget.prototype.onAfterMove=function($placeholder,container,$closestEl){if(!this.$el){return}
this.$el.trigger('aftermove.oc.treelist',{placeholder:$placeholder,container:container,closestEl:$closestEl})}
var old=$.fn.treeListWidget
$.fn.treeListWidget=function(option){var args=arguments,result
this.each(function(){var $this=$(this)
var data=$this.data('oc.treelist')
var options=$.extend({},TreeListWidget.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('oc.treelist',(data=new TreeListWidget(this,options)))
if(typeof option=='string')result=data[option].call(data)
if(typeof result!='undefined')return false})
return result?result:this}
$.fn.treeListWidget.Constructor=TreeListWidget
$.fn.treeListWidget.noConflict=function(){$.fn.treeListWidget=old
return this}
$(document).render(function(){$('[data-control="treelist"]').treeListWidget();})}(window.jQuery);!function($){"use strict";var Autocomplete=function(element,options){this.$element=$(element)
this.options=$.extend({},$.fn.autocomplete.defaults,options)
this.matcher=this.options.matcher||this.matcher
this.sorter=this.options.sorter||this.sorter
this.highlighter=this.options.highlighter||this.highlighter
this.updater=this.options.updater||this.updater
this.source=this.options.source
this.$menu=$(this.options.menu)
this.shown=false
this.listen()}
Autocomplete.prototype={constructor:Autocomplete,select:function(){var val=this.$menu.find('.active').attr('data-value')
this.$element.val(this.updater(val)).change()
return this.hide()},updater:function(item){return item},show:function(){var pos=$.extend({},this.$element.position(),{height:this.$element[0].offsetHeight})
this.$menu.insertAfter(this.$element).css({top:pos.top+pos.height,left:pos.left}).show()
this.shown=true
return this},hide:function(){this.$menu.hide()
this.shown=false
return this},lookup:function(event){var items
this.query=this.$element.val()
if(!this.query||this.query.length<this.options.minLength){return this.shown?this.hide():this}
items=$.isFunction(this.source)?this.source(this.query,$.proxy(this.process,this)):this.source
return items?this.process(items):this},itemValue:function(item){if(typeof item==='object')
return item.value;return item;},itemLabel:function(item){if(typeof item==='object')
return item.label;return item;},itemsToArray:function(items){var newArray=[]
$.each(items,function(value,label){newArray.push({label:label,value:value})})
return newArray},process:function(items){var that=this
if(typeof items=='object')
items=this.itemsToArray(items)
items=$.grep(items,function(item){return that.matcher(item)})
items=this.sorter(items)
if(!items.length){return this.shown?this.hide():this}
return this.render(items.slice(0,this.options.items)).show()},matcher:function(item){return~this.itemValue(item).toLowerCase().indexOf(this.query.toLowerCase())},sorter:function(items){var beginswith=[],caseSensitive=[],caseInsensitive=[],item,itemValue
while(item=items.shift()){itemValue=this.itemValue(item)
if(!itemValue.toLowerCase().indexOf(this.query.toLowerCase()))beginswith.push(item)
else if(~itemValue.indexOf(this.query))caseSensitive.push(item)
else caseInsensitive.push(item)}
return beginswith.concat(caseSensitive,caseInsensitive)},highlighter:function(item){var query=this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,'\\$&')
return item.replace(new RegExp('('+query+')','ig'),function($1,match){return'<strong>'+match+'</strong>'})},render:function(items){var that=this
items=$(items).map(function(i,item){i=$(that.options.item).attr('data-value',that.itemValue(item))
i.find('a').html(that.highlighter(that.itemLabel(item)))
return i[0]})
items.first().addClass('active')
this.$menu.html(items)
return this},next:function(event){var active=this.$menu.find('.active').removeClass('active'),next=active.next()
if(!next.length){next=$(this.$menu.find('li')[0])}
next.addClass('active')},prev:function(event){var active=this.$menu.find('.active').removeClass('active'),prev=active.prev()
if(!prev.length){prev=this.$menu.find('li').last()}
prev.addClass('active')},listen:function(){this.$element.on('focus',$.proxy(this.focus,this)).on('blur',$.proxy(this.blur,this)).on('keypress',$.proxy(this.keypress,this)).on('keyup',$.proxy(this.keyup,this))
if(this.eventSupported('keydown')){this.$element.on('keydown',$.proxy(this.keydown,this))}
this.$menu.on('click',$.proxy(this.click,this)).on('mouseenter','li',$.proxy(this.mouseenter,this)).on('mouseleave','li',$.proxy(this.mouseleave,this))},eventSupported:function(eventName){var isSupported=eventName in this.$element
if(!isSupported){this.$element.setAttribute(eventName,'return;')
isSupported=typeof this.$element[eventName]==='function'}
return isSupported},move:function(e){if(!this.shown)return
switch(e.keyCode){case 9:case 13:case 27:e.preventDefault()
break
case 38:e.preventDefault()
this.prev()
break
case 40:e.preventDefault()
this.next()
break}
e.stopPropagation()},keydown:function(e){this.suppressKeyPressRepeat=~$.inArray(e.keyCode,[40,38,9,13,27])
this.move(e)},keypress:function(e){if(this.suppressKeyPressRepeat)return
this.move(e)},keyup:function(e){switch(e.keyCode){case 40:case 38:case 16:case 17:case 18:break
case 9:case 13:if(!this.shown)return
this.select()
break
case 27:if(!this.shown)return
this.hide()
break
default:this.lookup()}
e.stopPropagation()
e.preventDefault()},focus:function(e){this.focused=true},blur:function(e){this.focused=false
if(!this.mousedover&&this.shown)this.hide()},click:function(e){e.stopPropagation()
e.preventDefault()
this.select()
this.$element.focus()},mouseenter:function(e){this.mousedover=true
this.$menu.find('.active').removeClass('active')
$(e.currentTarget).addClass('active')},mouseleave:function(e){this.mousedover=false
if(!this.focused&&this.shown)this.hide()}}
var old=$.fn.autocomplete
$.fn.autocomplete=function(option){return this.each(function(){var $this=$(this),data=$this.data('autocomplete'),options=typeof option=='object'&&option
if(!data)$this.data('autocomplete',(data=new Autocomplete(this,options)))
if(typeof option=='string')data[option]()})}
$.fn.autocomplete.defaults={source:[],items:8,menu:'<ul class="autocomplete dropdown-menu"></ul>',item:'<li><a href="#"></a></li>',minLength:1}
$.fn.autocomplete.Constructor=Autocomplete
$.fn.autocomplete.noConflict=function(){$.fn.autocomplete=old
return this}
$(document).on('focus.autocomplete.data-api','[data-control="autocomplete"]',function(e){var $this=$(this)
if($this.data('autocomplete'))return
$this.autocomplete($this.data())})}(window.jQuery);+function($){"use strict";var SidenavTree=function(element,options){this.options=options
this.$el=$(element)
this.init();}
SidenavTree.DEFAULTS={treeName:'sidenav_tree'}
SidenavTree.prototype.init=function(){var self=this
$(document.body).addClass('has-sidenav-tree')
this.statusCookieName=this.options.treeName+'groupStatus'
this.searchCookieName=this.options.treeName+'search'
this.$searchInput=$(this.options.searchInput)
this.$el.on('click','li > div.group',function(){self.toggleGroup($(this).closest('li'))
return false;});this.$searchInput.on('keyup',function(){self.handleSearchChange()})
var searchTerm=$.cookie(this.searchCookieName)
if(searchTerm!==undefined&&searchTerm.length>0){this.$searchInput.val(searchTerm)
this.applySearch()}
var scrollbar=$('[data-control=scrollbar]',this.$el).data('oc.scrollbar'),active=$('li.active',this.$el)
if(active.length>0)
scrollbar.gotoElement(active)}
SidenavTree.prototype.toggleGroup=function(group){var $group=$(group),status=$group.attr('data-status')
status===undefined||status=='expanded'?this.collapseGroup($group):this.expandGroup($group)}
SidenavTree.prototype.collapseGroup=function(group){var
$list=$('> ul',group),self=this;$list.css('overflow','hidden')
$list.animate({'height':0},{duration:100,queue:false,complete:function(){$list.css({'overflow':'visible','display':'none'})
$(group).attr('data-status','collapsed')
$(window).trigger('oc.updateUi')
self.saveGroupStatus($(group).data('group-code'),true)}})}
SidenavTree.prototype.expandGroup=function(group,duration){var
$list=$('> ul',group),self=this
duration=duration===undefined?100:duration
$list.css({'overflow':'hidden','display':'block','height':0})
$list.animate({'height':$list[0].scrollHeight},{duration:duration,queue:false,complete:function(){$list.css({'overflow':'visible','height':'auto'})
$(group).attr('data-status','expanded')
$(window).trigger('oc.updateUi')
self.saveGroupStatus($(group).data('group-code'),false)}})}
SidenavTree.prototype.saveGroupStatus=function(groupCode,collapsed){var collapsedGroups=$.cookie(this.statusCookieName),updatedGroups=[]
if(collapsedGroups===undefined)
collapsedGroups=''
collapsedGroups=collapsedGroups.split('|')
$.each(collapsedGroups,function(){if(groupCode!=this)
updatedGroups.push(this)})
if(collapsed)
updatedGroups.push(groupCode)
$.cookie(this.statusCookieName,updatedGroups.join('|'),{expires:30,path:'/'})}
SidenavTree.prototype.handleSearchChange=function(){var lastValue=this.$searchInput.data('oc.lastvalue');if(lastValue!==undefined&&lastValue==this.$searchInput.val())
return
this.$searchInput.data('oc.lastvalue',this.$searchInput.val())
if(this.dataTrackInputTimer!==undefined)
window.clearTimeout(this.dataTrackInputTimer);var self=this
this.dataTrackInputTimer=window.setTimeout(function(){self.applySearch()},300);$.cookie(this.searchCookieName,$.trim(this.$searchInput.val()),{expires:30,path:'/'})}
SidenavTree.prototype.applySearch=function(){var query=$.trim(this.$searchInput.val()),words=query.toLowerCase().split(' '),visibleGroups=[],visibleItems=[],self=this
if(query.length==0){$('li',this.$el).removeClass('hidden')
return}
$('ul.top-level > li',this.$el).each(function(){var $li=$(this)
if(self.textContainsWords($('div.group h3',$li).text(),words)){visibleGroups.push($li.get(0))
$('ul li',$li).each(function(){visibleItems.push(this)})}else{$('ul li',$li).each(function(){if(self.textContainsWords($(this).text(),words)||self.textContainsWords($(this).data('keywords'),words)){visibleGroups.push($li.get(0))
visibleItems.push(this)}})}})
$('ul.top-level > li',this.$el).each(function(){var $li=$(this),groupIsVisible=$.inArray(this,visibleGroups)!==-1
$li.toggleClass('hidden',!groupIsVisible)
if(groupIsVisible)
self.expandGroup($li,0)
$('ul li',$li).each(function(){var $itemLi=$(this)
$itemLi.toggleClass('hidden',$.inArray(this,visibleItems)==-1)})})
return false}
SidenavTree.prototype.textContainsWords=function(text,words){text=text.toLowerCase()
for(var i=0;i<words.length;i++){if(text.indexOf(words[i])===-1)
return false}
return true}
var old=$.fn.sidenavTree
$.fn.sidenavTree=function(option){var args=arguments;return this.each(function(){var $this=$(this)
var data=$this.data('oc.sidenavTree')
var options=$.extend({},SidenavTree.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('oc.sidenavTree',(data=new SidenavTree(this,options)))
if(typeof option=='string'){var methodArgs=[];for(var i=1;i<args.length;i++)
methodArgs.push(args[i])
data[option].apply(data,methodArgs)}})}
$.fn.sidenavTree.Constructor=SidenavTree
$.fn.sidenavTree.noConflict=function(){$.fn.sidenavTree=old
return this}
$(document).ready(function(){$('[data-control=sidenav-tree]').sidenavTree()})}(window.jQuery);$.ajaxPrefilter(function(options){var token=$('meta[name="csrf-token"]').attr('content')
if(token){if(!options.headers)options.headers={}
options.headers['X-CSRF-TOKEN']=token}})
$(window).on('ajaxErrorMessage',function(event,message){if(!message)return
swal({title:message,confirmButtonClass:'btn-default'})
event.preventDefault()})
$(window).on('ajaxConfirmMessage',function(event,message){if(!message)return
swal({title:message,showCancelButton:true,confirmButtonClass:'btn-primary'},function(isConfirm){isConfirm?event.promise.resolve():event.promise.reject()})
event.preventDefault()
return true})
if($.oc===undefined)
$.oc={}
$.oc.backendUrl=function(url){var backendBasePath=$('meta[name="backend-base-path"]').attr('content')
if(!backendBasePath)
return url
if(url.substr(0,1)=='/')
url=url.substr(1)
return backendBasePath+'/'+url}
AssetManager=function(){var o={load:function(collection,callback){var jsList=(collection.js)?collection.js:[],cssList=(collection.css)?collection.css:[],imgList=(collection.img)?collection.img:[]
jsList=$.grep(jsList,function(item){return $('head script[src="'+item+'"]').length==0})
cssList=$.grep(cssList,function(item){return $('head link[href="'+item+'"]').length==0})
var cssCounter=0,jsLoaded=false,imgLoaded=false
if(jsList.length===0&&cssList.length===0&&imgList.length===0){callback&&callback()
return}
o.loadJavaScript(jsList,function(){jsLoaded=true
checkLoaded()})
$.each(cssList,function(index,source){o.loadStyleSheet(source,function(){cssCounter++
checkLoaded()})})
o.loadImage(imgList,function(){imgLoaded=true
checkLoaded()})
function checkLoaded(){if(!imgLoaded)
return false
if(!jsLoaded)
return false
if(cssCounter<cssList.length)
return false
callback&&callback()}},loadStyleSheet:function(source,callback){var cssElement=document.createElement('link')
cssElement.setAttribute('rel','stylesheet')
cssElement.setAttribute('type','text/css')
cssElement.setAttribute('href',source)
cssElement.addEventListener('load',callback,false)
if(typeof cssElement!='undefined'){document.getElementsByTagName('head')[0].appendChild(cssElement)}
return cssElement},loadJavaScript:function(sources,callback){if(sources.length<=0)
return callback()
var source=sources.shift(),jsElement=document.createElement('script');jsElement.setAttribute('type','text/javascript')
jsElement.setAttribute('src',source)
jsElement.addEventListener('load',function(){o.loadJavaScript(sources,callback)},false)
if(typeof jsElement!='undefined'){document.getElementsByTagName('head')[0].appendChild(jsElement)}},loadImage:function(sources,callback){if(sources.length<=0)
return callback()
var loaded=0
$.each(sources,function(index,source){var img=new Image()
img.onload=function(){if(++loaded==sources.length&&callback)
callback()}
img.src=source})}};return o;};assetManager=new AssetManager();