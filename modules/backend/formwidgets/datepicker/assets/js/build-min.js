
(function(root,factory)
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
var dialRadius=100,outerRadius=80,innerRadius=54,tickRadius=13,diameter=dialRadius*2,duration=transitionSupported?350:1;var tpl=['<div class="popover clockpicker-popover">','<div class="arrow"></div>','<div class="popover-title">','<span class="clockpicker-span-hours text-primary"></span>',':','<span class="clockpicker-span-minutes"></span> ','<span class="clockpicker-span-am-pm"></span>','</div>','<div class="popover-content">','<div class="clockpicker-plate">','<div class="clockpicker-canvas"></div>','<div class="clockpicker-dial clockpicker-hours"></div>','<div class="clockpicker-dial clockpicker-minutes clockpicker-dial-out"></div>','</div>','<span class="clockpicker-am-pm-block">','</span>','</div>','</div>'].join('');function ClockPicker(element,options){var popover=$(tpl),plate=popover.find('.clockpicker-plate'),hoursView=popover.find('.clockpicker-hours'),minutesView=popover.find('.clockpicker-minutes'),amPmBlock=popover.find('.clockpicker-am-pm-block'),isInput=element.prop('tagName')==='INPUT',input=isInput?element:element.find('input'),addon=element.find('.input-group-addon'),self=this,timer;this.id=uniqueId('cp');this.element=element;this.options=options;this.isAppended=false;this.isShown=false;this.currentView='hours';this.isInput=isInput;this.input=input;this.addon=addon;this.popover=popover;this.plate=plate;this.hoursView=hoursView;this.minutesView=minutesView;this.amPmBlock=amPmBlock;this.spanHours=popover.find('.clockpicker-span-hours');this.spanMinutes=popover.find('.clockpicker-span-minutes');this.spanAmPm=popover.find('.clockpicker-span-am-pm');this.amOrPm="PM";if(options.twelvehour){var amPmButtonsTemplate=['<div class="clockpicker-am-pm-block">','<button type="button" class="btn btn-sm btn-secondary clockpicker-button clockpicker-am-button">','AM</button>','<button type="button" class="btn btn-sm btn-secondary clockpicker-button clockpicker-pm-button">','PM</button>','</div>'].join('');var amPmButtons=$(amPmButtonsTemplate);$('<button type="button" class="btn btn-sm btn-secondary clockpicker-button am-button">'+"AM"+'</button>').on("click",function(){self.amOrPm="AM";$('.clockpicker-span-am-pm').empty().append('AM');}).appendTo(this.amPmBlock);$('<button type="button" class="btn btn-sm btn-secondary clockpicker-button pm-button">'+"PM"+'</button>').on("click",function(){self.amOrPm='PM';$('.clockpicker-span-am-pm').empty().append('PM');}).appendTo(this.amPmBlock);}
if(!options.autoclose){$('<button type="button" class="btn btn-sm btn-secondary btn-block clockpicker-button">'+options.donetext+'</button>').click($.proxy(this.done,this)).appendTo(popover);}
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
ClockPicker.DEFAULTS={'default':'',fromnow:0,placement:'bottom',align:'left',donetext:'Done',autoclose:false,twelvehour:false,vibrate:true};ClockPicker.prototype.toggle=function(){this[this.isShown?'hide':'show']();};ClockPicker.prototype.locate=function(){var element=this.element,popover=this.popover,offset=element.offset(),width=element.outerWidth(),height=element.outerHeight(),placement=this.options.placement,align=this.options.align,styles={},self=this;popover.show();switch(placement){case'bottom':styles.top=offset.top+height;break;case'right':styles.left=offset.left+width;break;case'top':styles.top=offset.top-popover.outerHeight();break;case'left':styles.left=offset.left-popover.outerWidth();break;}
switch(align){case'left':styles.left=offset.left;break;case'right':styles.left=offset.left+width-popover.outerWidth();break;case'top':styles.top=offset.top;break;case'bottom':styles.top=offset.top+height-popover.outerHeight();break;}
popover.css(styles);};ClockPicker.prototype.show=function(e){if(this.isShown){return;}
raiseCallback(this.options.beforeShow);var self=this;if(!this.isAppended){$body=$(document.body).append(this.popover);$win.on('resize.clockpicker'+this.id,function(){if(self.isShown){self.locate();}});this.isAppended=true;}
var value=((this.input.prop('value')||this.options['default']||'')+'');if(this.options.twelvehour){var amPmValue=value.split(' ');if(amPmValue[1]){value=amPmValue[0];this.amOrPm=amPmValue[1];}}
value=value.split(':');if(value[0]==='now'){var now=new Date(+new Date()+this.options.fromnow);value=[now.getHours(),now.getMinutes()];}
this.hours=+value[0]||0;this.minutes=+value[1]||0;this.spanHours.html(leadingZero(this.hours));this.spanMinutes.html(leadingZero(this.minutes));if(this.options.twelvehour){this.spanAmPm.html(this.amOrPm);}
this.toggleView('hours');this.locate();this.isShown=true;$doc.on('click.clockpicker.'+this.id+' focusin.clockpicker.'+this.id,function(e){var target=$(e.target);if(target.closest(self.popover).length===0&&target.closest(self.addon).length===0&&target.closest(self.input).length===0){self.hide();}});$doc.on('keyup.clockpicker.'+this.id,function(e){if(e.keyCode===27){self.hide();}});raiseCallback(this.options.afterShow);};ClockPicker.prototype.hide=function(){raiseCallback(this.options.beforeHide);this.isShown=false;$doc.off('click.clockpicker.'+this.id+' focusin.clockpicker.'+this.id);$doc.off('keyup.clockpicker.'+this.id);this.popover.hide();raiseCallback(this.options.afterHide);};ClockPicker.prototype.toggleView=function(view,delay){var raiseAfterHourSelect=false;if(view==='minutes'&&$(this.hoursView).css("visibility")==="visible"){raiseCallback(this.options.beforeHourSelect);raiseAfterHourSelect=true;}
var isHours=view==='hours',nextView=isHours?this.hoursView:this.minutesView,hideView=isHours?this.minutesView:this.hoursView;this.currentView=view;this.spanHours.toggleClass('text-primary',isHours);this.spanMinutes.toggleClass('text-primary',!isHours);hideView.addClass('clockpicker-dial-out');nextView.css('visibility','visible').removeClass('clockpicker-dial-out');this.resetClock(delay);clearTimeout(this.toggleViewTimer);this.toggleViewTimer=setTimeout(function(){hideView.css('visibility','hidden');},duration);if(raiseAfterHourSelect){raiseCallback(this.options.afterHourSelect);}};ClockPicker.prototype.resetClock=function(delay){var view=this.currentView,value=this[view],isHours=view==='hours',unit=Math.PI/(isHours?6:30),radian=value*unit,radius=isHours&&value>0&&value<13?innerRadius:outerRadius,x=Math.sin(radian)*radius,y=-Math.cos(radian)*radius,self=this;if(svgSupported&&delay){self.canvas.addClass('clockpicker-canvas-out');setTimeout(function(){self.canvas.removeClass('clockpicker-canvas-out');self.setHand(x,y);},delay);}else{this.setHand(x,y);}};ClockPicker.prototype.setHand=function(x,y,roundBy5,dragging){var radian=Math.atan2(x,-y),isHours=this.currentView==='hours',unit=Math.PI/(isHours||roundBy5?6:30),z=Math.sqrt(x*x+y*y),options=this.options,inner=isHours&&z<(outerRadius+innerRadius)/2,radius=inner?innerRadius:outerRadius,value;if(options.twelvehour){radius=outerRadius;}
if(radian<0){radian=Math.PI*2+radian;}
value=Math.round(radian/unit);radian=value*unit;if(options.twelvehour){if(isHours){if(value===0){value=12;}}else{if(roundBy5){value*=5;}
if(value===60){value=0;}}}else{if(isHours){if(value===12){value=0;}
value=inner?(value===0?12:value):value===0?0:value+12;}else{if(roundBy5){value*=5;}
if(value===60){value=0;}}}
if(this[this.currentView]!==value){if(vibrate&&this.options.vibrate){if(!this.vibrateTimer){navigator[vibrate](10);this.vibrateTimer=setTimeout($.proxy(function(){this.vibrateTimer=null;},this),100);}}}
this[this.currentView]=value;this[isHours?'spanHours':'spanMinutes'].html(leadingZero(value));if(!svgSupported){this[isHours?'hoursView':'minutesView'].find('.clockpicker-tick').each(function(){var tick=$(this);tick.toggleClass('active',value===+tick.html());});return;}
if(dragging||(!isHours&&value%5)){this.g.insertBefore(this.hand,this.bearing);this.g.insertBefore(this.bg,this.fg);this.bg.setAttribute('class','clockpicker-canvas-bg clockpicker-canvas-bg-trans');}else{this.g.insertBefore(this.hand,this.bg);this.g.insertBefore(this.fg,this.bg);this.bg.setAttribute('class','clockpicker-canvas-bg');}
var cx=Math.sin(radian)*radius,cy=-Math.cos(radian)*radius;this.hand.setAttribute('x2',cx);this.hand.setAttribute('y2',cy);this.bg.setAttribute('cx',cx);this.bg.setAttribute('cy',cy);this.fg.setAttribute('cx',cx);this.fg.setAttribute('cy',cy);};ClockPicker.prototype.done=function(){raiseCallback(this.options.beforeDone);this.hide();var last=this.input.prop('value'),value=leadingZero(this.hours)+':'+leadingZero(this.minutes);if(this.options.twelvehour){value=value+' '+this.amOrPm;}
this.input.prop('value',value);if(value!==last){this.input.triggerHandler('change');if(!this.isInput){this.element.trigger('change');}}
if(this.options.autoclose){this.input.trigger('blur');}
raiseCallback(this.options.afterDone);};ClockPicker.prototype.remove=function(){this.element.removeData('clockpicker');this.input.off('focus.clockpicker click.clockpicker');this.addon.off('click.clockpicker');if(this.isShown){this.hide();}
if(this.isAppended){$win.off('resize.clockpicker'+this.id);this.popover.remove();}};$.fn.clockpicker=function(option){var args=Array.prototype.slice.call(arguments,1);return this.each(function(){var $this=$(this),data=$this.data('clockpicker');if(!data){var options=$.extend({},ClockPicker.DEFAULTS,$this.data(),typeof option=='object'&&option);$this.data('clockpicker',new ClockPicker($this,options));}else{if(typeof data[option]==='function'){data[option].apply(data,args);}}});};}());+function($){"use strict";var Base=$.oc.foundation.base,BaseProto=Base.prototype
var DatePicker=function(element,options){this.$el=$(element)
this.options=options||{}
$.oc.foundation.controlUtils.markDisposable(element)
Base.call(this)
this.init()}
DatePicker.prototype=Object.create(BaseProto)
DatePicker.prototype.constructor=DatePicker
DatePicker.prototype.init=function(){var self=this,$form=this.$el.closest('form'),changeMonitor=$form.data('oc.changeMonitor')
if(changeMonitor!==undefined){changeMonitor.pause()}
this.dbDateTimeFormat='YYYY-MM-DD HH:mm:ss'
this.dbDateFormat='YYYY-MM-DD'
this.dbTimeFormat='HH:mm:ss'
this.$dataLocker=$('[data-datetime-value]',this.$el)
this.$datePicker=$('[data-datepicker]',this.$el)
this.$timePicker=$('[data-timepicker]',this.$el)
this.hasDate=!!this.$datePicker.length
this.hasTime=!!this.$timePicker.length
this.initRegion()
if(this.hasDate){this.initDatePicker()}
if(this.hasTime){this.initTimePicker()}
if(changeMonitor!==undefined){changeMonitor.resume()}
this.$timePicker.on('change.oc.datepicker',function(){if(!$.trim($(this).val())){self.emptyValues()}
else{self.onSelectTimePicker()}})
this.$datePicker.on('change.oc.datepicker',function(){if(!$.trim($(this).val())){self.emptyValues()}})
this.$el.one('dispose-control',this.proxy(this.dispose))}
DatePicker.prototype.dispose=function(){this.$timePicker.off('change.oc.datepicker')
this.$datePicker.off('change.oc.datepicker')
this.$el.off('dispose-control',this.proxy(this.dispose))
this.$el.removeData('oc.datePicker')
this.$el=null
this.options=null
BaseProto.dispose.call(this)}
DatePicker.prototype.initDatePicker=function(){var self=this
var pikadayOptions={yearRange:this.options.yearRange,format:this.getDateFormat(),setDefaultDate:moment().tz(this.timezone).format('l'),i18n:$.oc.lang.get('datepicker'),onOpen:function(){var $field=$(this._o.trigger)
$(this.el).css({left:'auto',right:$(window).width()-$field.offset().left-$field.outerWidth()})},onSelect:function(){self.onSelectDatePicker.call(self,this.getMoment())}}
this.$datePicker.val(this.getDataLockerValue('l'))
if(this.options.minDate){pikadayOptions.minDate=new Date(this.options.minDate)}
if(this.options.maxDate){pikadayOptions.maxDate=new Date(this.options.maxDate)}
this.$datePicker.pikaday(pikadayOptions)}
DatePicker.prototype.onSelectDatePicker=function(pickerMoment){var pickerValue=pickerMoment.format(this.dbDateFormat)
var timeValue=this.getTimePickerValue()
var momentObj=moment.tz(pickerValue+' '+timeValue,this.dbDateTimeFormat,this.timezone).tz(this.appTimezone)
var lockerValue=momentObj.format(this.dbDateTimeFormat)
this.$dataLocker.val(lockerValue)}
DatePicker.prototype.getDatePickerValue=function(){var value=this.$datePicker.val()
if(!this.hasDate||!value){return moment.tz(this.appTimezone).tz(this.timezone).format(this.dbDateFormat)}
return moment(value,this.getDateFormat()).format(this.dbDateFormat)}
DatePicker.prototype.getDateFormat=function(){var format=this.options.format
if(this.locale){format=moment().locale(this.locale).localeData().longDateFormat('l')}
return format}
DatePicker.prototype.initTimePicker=function(){this.$timePicker.clockpicker({autoclose:'true',placement:'bottom',align:'right',twelvehour:this.isTimeTwelveHour()})
this.$timePicker.val(this.getDataLockerValue(this.getTimeFormat()))}
DatePicker.prototype.onSelectTimePicker=function(){var pickerValue=this.$timePicker.val()
var timeValue=moment(pickerValue,this.getTimeFormat()).format(this.dbTimeFormat)
var dateValue=this.getDatePickerValue()
var momentObj=moment.tz(dateValue+' '+timeValue,this.dbDateTimeFormat,this.timezone).tz(this.appTimezone)
var lockerValue=momentObj.format(this.dbDateTimeFormat)
this.$dataLocker.val(lockerValue)}
DatePicker.prototype.getTimePickerValue=function(){var value=this.$timePicker.val()
if(!this.hasTime||!value){return moment.tz(this.appTimezone).tz(this.timezone).format(this.dbTimeFormat)}
return moment(value,this.getTimeFormat()).format(this.dbTimeFormat)}
DatePicker.prototype.getTimeFormat=function(){return this.isTimeTwelveHour()?'hh:mm A':'HH:mm'}
DatePicker.prototype.isTimeTwelveHour=function(){var momentObj=moment()
if(this.locale){momentObj=momentObj.locale(this.locale)}
return momentObj.localeData().longDateFormat('LT').indexOf('A')!==-1;}
DatePicker.prototype.emptyValues=function(){this.$dataLocker.val('')
this.$datePicker.val('')
this.$timePicker.val('')}
DatePicker.prototype.getDataLockerValue=function(format){var value=this.$dataLocker.val()
return value?this.getMomentLoadValue(value,format):null}
DatePicker.prototype.getMomentLoadValue=function(value,format){var momentObj=moment.tz(value,this.appTimezone)
if(this.locale){momentObj=momentObj.locale(this.locale)}
momentObj=momentObj.tz(this.timezone)
return momentObj.format(format)}
DatePicker.prototype.initRegion=function(){this.locale=$('meta[name="backend-locale"]').attr('content')
this.timezone=$('meta[name="backend-timezone"]').attr('content')
this.appTimezone=$('meta[name="app-timezone"]').attr('content')
if(!this.appTimezone){this.appTimezone='UTC'}
if(!this.timezone){this.timezone='UTC'}}
DatePicker.DEFAULTS={minDate:null,maxDate:null,format:'YYYY-MM-DD',yearRange:10}
var old=$.fn.datePicker
$.fn.datePicker=function(option){var args=Array.prototype.slice.call(arguments,1),items,result
items=this.each(function(){var $this=$(this)
var data=$this.data('oc.datePicker')
var options=$.extend({},DatePicker.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('oc.datePicker',(data=new DatePicker(this,options)))
if(typeof option=='string')result=data[option].apply(data,args)
if(typeof result!='undefined')return false})
return result?result:items}
$.fn.datePicker.Constructor=DatePicker
$.fn.datePicker.noConflict=function(){$.fn.datePicker=old
return this}
$(document).on('render',function(){$('[data-control="datepicker"]').datePicker()});}(window.jQuery);