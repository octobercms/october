
(function($){$(document).on('keydown','div.custom-checkbox',function(e){if(e.keyCode==32)
e.preventDefault()})
$(document).on('keyup','div.custom-checkbox',function(e){if(e.keyCode==32){var $cb=$('input',this)
if($cb.data('oc-space-timestamp')==e.timeStamp)
return
$cb.get(0).checked=!$cb.get(0).checked
$cb.data('oc-space-timestamp',e.timeStamp)
$cb.trigger('change')
return false}})
$(document).render(function(){if(Modernizr.touch)
return
var formatSelectOption=function(state){if(!state.id)
return state.text;var $option=$(state.element),iconClass=$option.data('icon'),imageSrc=$option.data('image')
if(iconClass)
return'<i class="select-icon '+iconClass+'"></i> '+state.text
if(imageSrc)
return'<img class="select-image" src="'+imageSrc+'" alt="" /> '+state.text
return state.text}
$('select.custom-select:not([data-no-auto-update-on-render=true])').select2({formatResult:formatSelectOption,formatSelection:formatSelectOption,escapeMarkup:function(m){return m;}})})
$(document).on('disable','select.custom-select',function(event,status){$(this).select2('enable',!status)})
$(document).on('focus','select.custom-select',function(event){setTimeout($.proxy(function(){$(this).select2('focus')},this),10)})})(jQuery);$(window).on('ajaxErrorMessage',function(event,message){if(!message)return
swal({title:message,confirmButtonClass:'btn-default'})
event.preventDefault()})
$(window).on('ajaxConfirmMessage',function(event,message){if(!message)return
swal({title:message,showCancelButton:true,confirmButtonClass:'btn-primary'},function(isConfirm){isConfirm?event.promise.resolve():event.promise.reject()})
event.preventDefault()
return true})
function backendUrl(url){if(typeof backendBasePath==='undefined'||!backendBasePath)
return url;if(url.substr(0,1)=='/')
url=url.substr(1);return backendBasePath+url;}
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
img.src=source})}};return o;};assetManager=new AssetManager();$.fn.extend({clickOutside:function(handler,exceptions){var $this=this;$('body').on('click',function(event){if(exceptions&&$.inArray(event.target,exceptions)>-1){return;}else if($.contains($this[0],event.target)){return;}else{handler(event,$this);}});return this;}})
if($.oc===undefined)
$.oc={}
$.oc.escapeHtmlString=function(string){var htmlEscapes={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#x27;','/':'&#x2F;'},htmlEscaper=/[&<>"'\/]/g
return(''+string).replace(htmlEscaper,function(match){return htmlEscapes[match];})}
+function($){"use strict";var TriggerOn=function(element,options){var $el=this.$el=$(element);this.options=options||{};if(this.options.triggerType!==false&&this.options.triggerAction===false)this.options.triggerAction=this.options.triggerType
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
if(this.triggerCondition=='checked'||this.triggerCondition=='value'){$(document).on('change',this.options.trigger,$.proxy(this.onConditionChanged,this))}
var self=this
$el.on('oc.triggerOn.update',function(e){e.stopPropagation()
self.onConditionChanged()})
self.onConditionChanged()}
TriggerOn.prototype.onConditionChanged=function(){if(this.triggerCondition=='checked'){this.updateTarget($(this.options.trigger+':checked',this.triggerParent).length>0)}
else if(this.triggerCondition=='value'){var trigger=$(this.options.trigger+':checked',this.triggerParent);if(trigger.length){this.updateTarget(trigger.val()==this.triggerConditionValue)}else{this.updateTarget($(this.options.trigger,this.triggerParent).val()==this.triggerConditionValue)}}}
TriggerOn.prototype.updateTarget=function(status){if(this.options.triggerAction=='show')
this.$el.toggleClass('hide',!status).trigger('hide',[!status])
else if(this.options.triggerAction=='hide')
this.$el.toggleClass('hide',status).trigger('hide',[status])
else if(this.options.triggerAction=='enable')
this.$el.prop('disabled',!status).trigger('disable',[!status]).toggleClass('control-disabled',!status)
else if(this.options.triggerAction=='disable')
this.$el.prop('disabled',status).trigger('disable',[status]).toggleClass('control-disabled',status)
else if(this.options.triggerAction=='empty'&&status)
this.$el.trigger('empty').val('')
if(this.options.triggerAction=='show'||this.options.triggerAction=='hide')
this.fixButtonClasses()
$(window).trigger('resize')}
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
$(document).render(function(){$('[data-trigger]').triggerOn()})}(window.jQuery);+function($){"use strict";var DragScroll=function(element,options){this.options=$.extend({},DragScroll.DEFAULTS,options)
var
$el=$(element),el=$el.get(0),dragStart=0,startOffset=0,self=this,dragging=false,eventElementName=this.options.vertical?'pageY':'pageX';this.el=$el
this.scrollClassContainer=this.options.scrollClassContainer?$(this.options.scrollClassContainer):$el
if(this.options.scrollMarkerContainer)
$(this.options.scrollMarkerContainer).append($('<span class="before scroll-marker"></span><span class="after scroll-marker"></span>'))
$el.mousewheel(function(event){if(!self.options.allowScroll)
return;var offset=self.options.vertical?((event.deltaFactor*event.deltaY)*-1):((event.deltaFactor*event.deltaX)*-1)
return!scrollWheel(offset)})
$el.on('mousedown',function(event){startDrag(event)
return false})
$el.on('touchstart',function(event){var touchEvent=event.originalEvent;if(touchEvent.touches.length==1){startDrag(touchEvent.touches[0])
event.stopPropagation()}})
$el.on('click',function(){if($(document.body).hasClass('drag'))
return false})
$(document).on('ready',$.proxy(this.fixScrollClasses,this))
$(window).on('resize',$.proxy(this.fixScrollClasses,this))
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
return this}}(window.jQuery);+function($){"use strict";var DragValue=function(element,options){this.options=options
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
$(document).render(function(){$('[data-control="dragvalue"]').dragValue()});}(window.jQuery);+function($){"use strict";var Toolbar=function(element,options){var
$el=this.$el=$(element),$toolbar=$el.closest('.control-toolbar')
this.options=options||{};var scrollClassContainer=options.scrollClassContainer!==undefined?options.scrollClassContainer:$el.parent()
$el.dragScroll({scrollClassContainer:scrollClassContainer})
$('.form-control.growable',$toolbar).on('focus',function(){update()})
$('.form-control.growable',$toolbar).on('blur',function(){update()})
function update(){$(window).trigger('resize')}}
Toolbar.DEFAULTS={}
var old=$.fn.toolbar
$.fn.toolbar=function(option){return this.each(function(){var $this=$(this)
var data=$this.data('oc.toolbar')
var options=$.extend({},Toolbar.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('oc.toolbar',(data=new Toolbar(this,options)))})}
$.fn.toolbar.Constructor=Toolbar
$.fn.toolbar.noConflict=function(){$.fn.toolbar=old
return this}
$(document).on('render',function(){$('[data-control=toolbar]').toolbar()})}(window.jQuery);(function($){$(document).render(function(){$('[data-toggle="tooltip"]').tooltip()})})(jQuery);+function($){"use strict";var VerticalMenu=function(element,toggle,options){this.body=$('body')
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
$(document).ready(function(){$('[data-control="sidenav"]').sideNav()})}(window.jQuery);+function($){"use strict";var Tab=function(element,options){var $el=this.$el=$(element);this.options=options||{}
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
this.$tabsContainer.on('shown.bs.tab','li',function(){$(window).trigger('oc.updateUi')})
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
element.closest('[data-control=tab]').ocTab('goToElement',element)
element.focus()})}(window.jQuery);+function($){"use strict";var Popover=function(element,options){var $el=this.$el=$(element);this.options=options||{};this.arrowSize=15
this.show()}
Popover.prototype.hide=function(){var e=$.Event('hiding.oc.popover',{relatedTarget:this.$el})
this.$el.trigger(e,this)
if(e.isDefaultPrevented())
return
this.$container.removeClass('in')
if(this.$overlay)this.$overlay.removeClass('in')
$.support.transition&&this.$container.hasClass('fade')?this.$container.one($.support.transition.end,$.proxy(this.hidePopover,this)).emulateTransitionEnd(300):this.hidePopover()}
Popover.prototype.hidePopover=function(){if(this.$container)this.$container.remove()
if(this.$overlay)this.$overlay.remove()
this.$overlay=false
this.$container=false
this.$el.removeClass('popover-highlight')
this.$el.data('oc.popover',null)
$(document.body).removeClass('popover-open')
$(document).unbind('mousedown',this.docClickHandler);this.$el.trigger('hide.oc.popover')
$(document).off('.oc.popover')}
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
this.$container.on('mousedown',function(e){e.stopPropagation();})
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
Popover.prototype.onDocumentClick=function(){if(this.options.closeOnPageClick)
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
return false;})}(window.jQuery);+function($){"use strict";var Popup=function(element,options){var self=this
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
this.$modal.on('hide.bs.modal',function(){self.isOpen=false
self.setBackdrop(false)})
this.$modal.on('hidden.bs.modal',function(){self.$container.remove()
self.$el.data('oc.popup',null)})
this.$modal.on('show.bs.modal',function(){self.isOpen=true
self.setBackdrop(true)})
this.$modal.on('shown.bs.modal',function(){self.triggerEvent('shown.oc.popup')})
this.$modal.on('close.oc.popup',function(){self.hide()
return false})
this.init()}
Popup.DEFAULTS={ajax:null,handler:null,keyboard:true,extraData:{},content:null,size:null}
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
return modal.append(modalDialog.append(modalContent))}
Popup.prototype.setContent=function(contents){this.$content.html(contents)
this.setLoading(false)
this.show()
this.firstDiv=this.$content.find('>div:first')
if(this.firstDiv.length>0)
this.firstDiv.data('oc.popup',this)}
Popup.prototype.setBackdrop=function(val){if(val&&!this.$backdrop){this.$backdrop=$('<div class="popup-backdrop fade" />').appendTo(document.body)
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
$(this).closest('.control-popup').popup('hideLoading')})}(window.jQuery);+function($){"use strict";var GoalMeter=function(element,options){var
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
$(document).render(function(){$('[data-control=goal-meter]').goalMeter()})}(window.jQuery);+function($){"use strict";var Scrollbar=function(element,options){var
$el=this.$el=$(element),el=$el.get(0),self=this,options=this.options=options||{},sizeName=this.sizeName=options.vertical?'height':'width',isTouch=this.isTouch=Modernizr.touch,isScrollable=this.isScrollable=false,isLocked=this.isLocked=false,eventElementName=options.vertical?'pageY':'pageX',dragStart=0,startOffset=0;this.$scrollbar=$('<div />').addClass('scrollbar-scrollbar')
this.$track=$('<div />').addClass('scrollbar-track').appendTo(this.$scrollbar)
this.$thumb=$('<div />').addClass('scrollbar-thumb').appendTo(this.$track)
$el.addClass('drag-scrollbar').addClass(options.vertical?'vertical':'horizontal').prepend(this.$scrollbar)
if(isTouch){this.$el.on('touchstart',function(event){var touchEvent=event.originalEvent;if(touchEvent.touches.length==1){startDrag(touchEvent.touches[0])
event.stopPropagation()}})}
else{this.$thumb.on('mousedown',function(event){startDrag(event)})
this.$track.on('mouseup',function(event){moveDrag(event)})}
$el.mousewheel(function(event){var offset=self.options.vertical?((event.deltaFactor*event.deltaY)*-1):((event.deltaFactor*event.deltaX)*-1)
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
FileList.DEFAULTS={}
FileList.prototype.init=function(){var self=this
this.$el.on('click','li.group > h4 > a, li.group > div.group',function(){self.toggleGroup($(this).closest('li'))
return false;});this.$el.on('click','li.item > a',function(event){var e=$.Event('open.oc.list',{relatedTarget:$(this).parent().get(0),clickEvent:event})
self.$el.trigger(e,this)
return false})
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
$(document).ready(function(){$('[data-control=filelist]').fileList()})}(window.jQuery);+function($){"use strict";var HotKey=function(element,options){var $el=this.$el=$(element)
var $target=this.$target=$(options.hotkeyTarget)
this.options=options||{}
if(!options.hotkey)
throw new Error('No hotkey has been defined.');if(options.hotkeyMac)options.hotkey+=', '+options.hotkeyMac
var
keys=options.hotkey.toLowerCase().split(','),keysCount=keys.length,keyConditions=[],keyPressed={shift:false,ctrl:false,cmd:false,alt:false},keyMap={'esc':27,'tab':9,'space':32,'return':13,'enter':13,'backspace':8,'scroll':145,'capslock':20,'numlock':144,'pause':19,'break':19,'insert':45,'home':36,'delete':46,'suppr':46,'end':35,'pageup':33,'pagedown':34,'left':37,'up':38,'right':39,'down':40,'f1':112,'f2':113,'f3':114,'f4':115,'f5':116,'f6':117,'f7':118,'f8':119,'f9':120,'f10':121,'f11':122,'f12':123}
for(var i=0;i<keysCount;i++){keyConditions.push(makeCondition(trim(keys[i])))}
$target.keydown(function(event){keyPressed.shift=event.originalEvent.shiftKey
keyPressed.ctrl=event.originalEvent.ctrlKey
keyPressed.cmd=event.originalEvent.metaKey
keyPressed.alt=event.originalEvent.altKey
if(testConditions(event)){if(options.hotkeyVisible&&!$el.is(':visible'))
return
if(options.callback)
return options.callback($el,this)
keyPressed.shift=false
keyPressed.ctrl=false
keyPressed.cmd=false
keyPressed.alt=false}});$target.keyup(function(event){keyPressed.shift=event.originalEvent.shiftKey
keyPressed.ctrl=event.originalEvent.ctrlKey
keyPressed.cmd=event.originalEvent.metaKey
keyPressed.alt=event.originalEvent.altKey});function testConditions(event){var count=keyConditions.length,condition
for(var i=0;i<count;i++){condition=keyConditions[i]
if(event.which==condition.specific&&keyPressed.shift==condition.shift&&keyPressed.ctrl==condition.ctrl&&keyPressed.cmd==condition.cmd&&keyPressed.alt==condition.alt){return true}}
return false}
function makeCondition(keyBind){var condition={shift:false,ctrl:false,cmd:false,alt:false,specific:-1},keys=keyBind.split('+'),count=keys.length
for(var i=0;i<count;i++){switch(keys[i]){case'shift':condition.shift=true
break
case'ctrl':condition.ctrl=true
break
case'command':case'cmd':case'meta':condition.cmd=true
break
case'alt':condition.alt=true
break}}
condition.specific=keyMap[keys[keys.length-1]]
if(typeof(condition.specific)=='undefined')
condition.specific=keys[keys.length-1].toUpperCase().charCodeAt()
return condition}
function trim(str){return str.replace(/^\s+/,"").replace(/\s+$/,"")}}
HotKey.DEFAULTS={hotkey:null,hotkeyMac:null,hotkeyTarget:'html',hotkeyVisible:true,callback:function(element){element.trigger('click')
return false}}
var old=$.fn.hotKey
$.fn.hotKey=function(option){var args=arguments;return this.each(function(){var $this=$(this)
var data=$this.data('oc.hotkey')
var options=$.extend({},HotKey.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('oc.hotkey',(data=new HotKey(this,options)))
if(typeof option=='string')data[option].call($this)})}
$.fn.hotKey.Constructor=HotKey
$.fn.hotKey.noConflict=function(){$.fn.hotKey=old
return this}
$(document).render(function(){$('[data-hotkey]').hotKey()})}(window.jQuery);+function($){"use strict";var LoadIndicator=function(element,options){var $el=this.$el=$(element)
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
$.oc.stripeLoadIndicator.hide()})}(window.jQuery);+function($){"use strict";var FlashMessage=function(options,el){var
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
$(document).render(function(){$('[data-control=flash-message]').each(function(){$.oc.flashMsg($(this).data(),this)})})}(window.jQuery);+function($){"use strict";var LATIN_MAP={'À':'A','Á':'A','Â':'A','Ã':'A','Ä':'A','Å':'A','Æ':'AE','Ç':'C','È':'E','É':'E','Ê':'E','Ë':'E','Ì':'I','Í':'I','Î':'I','Ï':'I','Ð':'D','Ñ':'N','Ò':'O','Ó':'O','Ô':'O','Õ':'O','Ö':'O','Ő':'O','Ø':'O','Ù':'U','Ú':'U','Û':'U','Ü':'U','Ű':'U','Ý':'Y','Þ':'TH','Ÿ':'Y','ß':'ss','à':'a','á':'a','â':'a','ã':'a','ä':'a','å':'a','æ':'ae','ç':'c','è':'e','é':'e','ê':'e','ë':'e','ì':'i','í':'i','î':'i','ï':'i','ð':'d','ñ':'n','ò':'o','ó':'o','ô':'o','õ':'o','ö':'o','ő':'o','ø':'o','ù':'u','ú':'u','û':'u','ü':'u','ű':'u','ý':'y','þ':'th','ÿ':'y'},LATIN_SYMBOLS_MAP={'©':'(c)'},GREEK_MAP={'α':'a','β':'b','γ':'g','δ':'d','ε':'e','ζ':'z','η':'h','θ':'8','ι':'i','κ':'k','λ':'l','μ':'m','ν':'n','ξ':'3','ο':'o','π':'p','ρ':'r','σ':'s','τ':'t','υ':'y','φ':'f','χ':'x','ψ':'ps','ω':'w','ά':'a','έ':'e','ί':'i','ό':'o','ύ':'y','ή':'h','ώ':'w','ς':'s','ϊ':'i','ΰ':'y','ϋ':'y','ΐ':'i','Α':'A','Β':'B','Γ':'G','Δ':'D','Ε':'E','Ζ':'Z','Η':'H','Θ':'8','Ι':'I','Κ':'K','Λ':'L','Μ':'M','Ν':'N','Ξ':'3','Ο':'O','Π':'P','Ρ':'R','Σ':'S','Τ':'T','Υ':'Y','Φ':'F','Χ':'X','Ψ':'PS','Ω':'W','Ά':'A','Έ':'E','Ί':'I','Ό':'O','Ύ':'Y','Ή':'H','Ώ':'W','Ϊ':'I','Ϋ':'Y'},TURKISH_MAP={'ş':'s','Ş':'S','ı':'i','İ':'I','ç':'c','Ç':'C','ü':'u','Ü':'U','ö':'o','Ö':'O','ğ':'g','Ğ':'G'},RUSSIAN_MAP={'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z','и':'i','й':'j','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'c','ч':'ch','ш':'sh','щ':'sh','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya','А':'A','Б':'B','В':'V','Г':'G','Д':'D','Е':'E','Ё':'Yo','Ж':'Zh','З':'Z','И':'I','Й':'J','К':'K','Л':'L','М':'M','Н':'N','О':'O','П':'P','Р':'R','С':'S','Т':'T','У':'U','Ф':'F','Х':'H','Ц':'C','Ч':'Ch','Ш':'Sh','Щ':'Sh','Ъ':'','Ы':'Y','Ь':'','Э':'E','Ю':'Yu','Я':'Ya'},UKRAINIAN_MAP={'Є':'Ye','І':'I','Ї':'Yi','Ґ':'G','є':'ye','і':'i','ї':'yi','ґ':'g'},CZECH_MAP={'č':'c','ď':'d','ě':'e','ň':'n','ř':'r','š':'s','ť':'t','ů':'u','ž':'z','Č':'C','Ď':'D','Ě':'E','Ň':'N','Ř':'R','Š':'S','Ť':'T','Ů':'U','Ž':'Z'},POLISH_MAP={'ą':'a','ć':'c','ę':'e','ł':'l','ń':'n','ó':'o','ś':'s','ź':'z','ż':'z','Ą':'A','Ć':'C','Ę':'E','Ł':'L','Ń':'N','Ó':'O','Ś':'S','Ź':'Z','Ż':'Z'},LATVIAN_MAP={'ā':'a','č':'c','ē':'e','ģ':'g','ī':'i','ķ':'k','ļ':'l','ņ':'n','š':'s','ū':'u','ž':'z','Ā':'A','Č':'C','Ē':'E','Ģ':'G','Ī':'I','Ķ':'K','Ļ':'L','Ņ':'N','Š':'S','Ū':'U','Ž':'Z'},ARABIC_MAP={'أ':'a','ب':'b','ت':'t','ث':'th','ج':'g','ح':'h','خ':'kh','د':'d','ذ':'th','ر':'r','ز':'z','س':'s','ش':'sh','ص':'s','ض':'d','ط':'t','ظ':'th','ع':'aa','غ':'gh','ف':'f','ق':'k','ك':'k','ل':'l','م':'m','ن':'n','ه':'h','و':'o','ي':'y'},PERSIAN_MAP={'آ':'a','ا':'a','پ':'p','چ':'ch','ژ':'zh','ک':'k','گ':'gh','ی':'y'},LITHUANIAN_MAP={'ą':'a','č':'c','ę':'e','ė':'e','į':'i','š':'s','ų':'u','ū':'u','ž':'z','Ą':'A','Č':'C','Ę':'E','Ė':'E','Į':'I','Š':'S','Ų':'U','Ū':'U','Ž':'Z'},SERBIAN_MAP={'ђ':'dj','ј':'j','љ':'lj','њ':'nj','ћ':'c','џ':'dz','đ':'dj','Ђ':'Dj','Ј':'j','Љ':'Lj','Њ':'Nj','Ћ':'C','Џ':'Dz','Đ':'Dj'},AZERBAIJANI_MAP={'ç':'c','ə':'e','ğ':'g','ı':'i','ö':'o','ş':'s','ü':'u','Ç':'C','Ə':'E','Ğ':'G','İ':'I','Ö':'O','Ş':'S','Ü':'U'},ALL_MAPS=[LATIN_MAP,LATIN_SYMBOLS_MAP,GREEK_MAP,TURKISH_MAP,RUSSIAN_MAP,UKRAINIAN_MAP,CZECH_MAP,POLISH_MAP,LATVIAN_MAP,ARABIC_MAP,PERSIAN_MAP,LITHUANIAN_MAP,SERBIAN_MAP,AZERBAIJANI_MAP]
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
InputPreset.prototype.formatValue=function(){if(this.options.inputPresetType=='camel')
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
$(document).render(function(){$('[data-input-preset]').inputPreset()})}(window.jQuery);(function($){var OctoberLayout=function(){this.$accountMenuOverlay=null}
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
$(document).render(function(){$('[data-control="simplelist"]').simplelist()})}(window.jQuery);+function($){"use strict";var eventNames,cursorAdjustment,containerDefaults={drag:true,drop:true,exclude:"",nested:true,vertical:true},groupDefaults={afterMove:function($placeholder,container,$closestEl){},containerPath:"",containerSelector:"ol, ul",distance:0,delay:0,handle:"",itemPath:"",useAnimation:false,itemSelector:"li",isValidTarget:function($item,container){return true},onCancel:function($item,container,_super,event){},tweakCursorAdjustment:function(adjustment){return adjustment},onDragStart:function($item,container,_super,event){var offset=$item.offset(),pointer=container.rootGroup.pointer
if(pointer){cursorAdjustment={left:pointer.left-offset.left,top:pointer.top-offset.top}}
else{cursorAdjustment=null}
cursorAdjustment=this.tweakCursorAdjustment(cursorAdjustment)
$item.css({height:$item.height(),width:$item.width()})
if(this.useAnimation)
$item.data('oc.animated',true)
$item.addClass("dragged")
$("body").addClass("dragging")},onDrag:function($item,position,_super,event){if(cursorAdjustment){$item.css({left:position.left-cursorAdjustment.left,top:position.top-cursorAdjustment.top})}
else{$item.css(position)}},onDrop:function($item,container,_super,event){$item.removeClass("dragged").removeAttr("style")
$("body").removeClass("dragging")
if($item.data('oc.animated')){$item.hide()
$item.slideDown(200)}},onMousedown:function($item,_super,event){if(event.target.nodeName!='INPUT'&&event.target.nodeName!='SELECT'){event.preventDefault()
return true}},placeholder:'<li class="placeholder"/>',pullPlaceholder:true,serialize:function($parent,$children,parentIsContainer){var result=$.extend({},$parent.data())
if(parentIsContainer)
return $children
else if($children[0]){result.children=$children
delete result.subContainer}
delete result.sortable
return result},tolerance:0},containerGroups={},groupCounter=0,emptyBox={left:0,top:0,bottom:0,right:0},eventNames={start:"touchstart.sortable mousedown.sortable",drop:"touchend.sortable touchcancel.sortable mouseup.sortable",drag:"touchmove.sortable mousemove.sortable",scroll:"scroll.sortable"}
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
if(!this.options.parentContainer){this.scrollProxy=$.proxy(this.scroll,this)
this.dragProxy=$.proxy(this.drag,this)
this.dropProxy=$.proxy(this.drop,this)
this.placeholder=$(this.options.placeholder)
if(!options.isValidTarget)
this.options.isValidTarget=undefined}}
ContainerGroup.get=function(options){if(!containerGroups[options.group]){if(!options.group)
options.group=groupCounter++
containerGroups[options.group]=new ContainerGroup(options)}
return containerGroups[options.group]}
ContainerGroup.prototype={dragInit:function(e,itemContainer){this.$document=$(itemContainer.el[0].ownerDocument)
if(itemContainer.enabled()){this.item=$(e.target).closest(this.options.itemSelector)
this.itemContainer=itemContainer
if(this.item.is(this.options.exclude)||!this.options.onMousedown(this.item,groupDefaults.onMousedown,e)){return}
this.setPointer(e)
this.toggleListeners('on')}else{this.toggleListeners('on',['drop'])}
this.setupDelayTimer()
this.dragInitDone=true},drag:function(e){if(!this.dragging){if(!this.distanceMet(e)||!this.delayMet){return}
this.options.onDragStart(this.item,this.itemContainer,groupDefaults.onDragStart,e)
this.item.before(this.placeholder)
this.dragging=true}
this.setPointer(e)
this.options.onDrag(this.item,getRelativePosition(this.pointer,this.item.offsetParent()),groupDefaults.onDrag,e)
var x=e.pageX||e.originalEvent.pageX,y=e.pageY||e.originalEvent.pageY,box=this.sameResultBox,t=this.options.tolerance
if(!box||box.top-t>y||box.bottom+t<y||box.left-t>x||box.right+t<x){if(!this.searchValidTarget())this.placeholder.detach()}},drop:function(e){this.toggleListeners('off')
this.dragInitDone=false
if(this.dragging){if(this.placeholder.closest("html")[0])
this.placeholder.before(this.item).detach()
else
this.options.onCancel(this.item,this.itemContainer,groupDefaults.onCancel,e)
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
return this.containerDimensions},getContainer:function(element){return element.closest(this.options.containerSelector).data('oc.sortable')},$getOffsetParent:function(){if(this.offsetParent===undefined){var i=this.containers.length-1,offsetParent=this.containers[i].getItemOffsetParent()
if(!this.options.parentContainer){while(i--){if(offsetParent[0]!=this.containers[i].getItemOffsetParent()[0]){offsetParent=false
break;}}}
this.offsetParent=offsetParent}
return this.offsetParent},setPointer:function(e){var pointer=this.getPointer(e)
if(this.$getOffsetParent()){var relativePointer=getRelativePosition(pointer,this.$getOffsetParent())
this.lastRelativePointer=this.relativePointer
this.relativePointer=relativePointer}
this.lastPointer=this.pointer
this.pointer=pointer},distanceMet:function(e){var currentPointer=this.getPointer(e)
return(Math.max(Math.abs(this.pointer.left-currentPointer.left),Math.abs(this.pointer.top-currentPointer.top))>=this.options.distance)},getPointer:function(e){return{left:e.pageX||e.originalEvent.pageX,top:e.pageY||e.originalEvent.pageY}},setupDelayTimer:function(){var self=this
this.delayMet=!this.options.delay
if(!this.delayMet){clearTimeout(this._mouseDelayTimer);this._mouseDelayTimer=setTimeout(function(){self.delayMet=true},this.options.delay)}},scroll:function(e){this.clearDimensions()
this.clearOffsetParent()},toggleListeners:function(method,events){var self=this
events=events||['drag','drop','scroll']
$.each(events,function(i,event){self.$document[method](eventNames[event],self[event+'Proxy'])})},clearOffsetParent:function(){this.offsetParent=undefined},clearDimensions:function(){this.containerDimensions=undefined
var i=this.containers.length
while(i--){this.containers[i].clearDimensions()}},destroy:function(){containerGroups[this.options.group]=undefined}}
function Container(element,options){this.el=element
this.options=$.extend({},containerDefaults,options)
this.group=ContainerGroup.get(this.options)
this.rootGroup=this.options.rootGroup||this.group
this.parentContainer=this.options.parentContainer
this.handle=this.rootGroup.options.handle||this.rootGroup.options.itemSelector
var itemPath=this.rootGroup.options.itemPath,target=itemPath?this.el.find(itemPath):this.el
target.on(eventNames.start,this.handle,$.proxy(this.dragInit,this))
if(this.options.drop){this.group.containers.push(this)}}
Container.prototype={dragInit:function(e){var rootGroup=this.rootGroup
if(!rootGroup.dragInitDone&&this.options.drag){rootGroup.dragInit(e,this)}},searchValidTarget:function(pointer,lastPointer){var distances=sortByDistanceDesc(this.getItemDimensions(),pointer,lastPointer),i=distances.length,rootGroup=this.rootGroup,validTarget=!rootGroup.options.isValidTarget||rootGroup.options.isValidTarget(rootGroup.item,this)
if(!i&&validTarget){var itemPath=this.rootGroup.options.itemPath,target=itemPath?this.el.find(itemPath):this.el
rootGroup.movePlaceholder(this,target,"append")
return true}else{while(i--){var index=distances[i][0],distance=distances[i][1]
if(!distance&&this.hasChildGroup(index)){var found=this.getContainerGroup(index).searchValidTarget(pointer,lastPointer)
if(found)
return true}
else if(validTarget){this.movePlaceholder(index,pointer)
return true}}}},movePlaceholder:function(index,pointer){var item=$(this.items[index]),dim=this.itemDimensions[index],method="after",width=item.outerWidth(),height=item.outerHeight(),offset=item.offset(),sameResultBox={left:offset.left,right:offset.left+width,top:offset.top,bottom:offset.top+height}
if(this.options.vertical){var yCenter=(dim[2]+dim[3])/2,inUpperHalf=pointer.top<=yCenter
if(inUpperHalf){method="before"
sameResultBox.bottom-=height/2}else{sameResultBox.top+=height/2}}else{var xCenter=(dim[0]+dim[1])/2,inLeftHalf=pointer.left<=xCenter
if(inLeftHalf){method="before"
sameResultBox.right-=width/2}else{sameResultBox.left+=width/2}}
if(this.hasChildGroup(index)){sameResultBox=emptyBox}
this.rootGroup.movePlaceholder(this,item,method,sameResultBox)},getItemDimensions:function(){if(!this.itemDimensions){this.items=this.$getChildren(this.el,"item").filter(":not(.placeholder, .dragged)").get()
setDimensions(this.items,this.itemDimensions=[],this.options.tolerance)}
return this.itemDimensions},getItemOffsetParent:function(){var offsetParent,el=this.el
if(el.css("position")==="relative"||el.css("position")==="absolute"||el.css("position")==="fixed")
offsetParent=el
else
offsetParent=el.offsetParent()
return offsetParent},hasChildGroup:function(index){return this.options.nested&&this.getContainerGroup(index)},getContainerGroup:function(index){var childGroup=$.data(this.items[index],"subContainer")
if(childGroup===undefined){var childContainers=this.$getChildren(this.items[index],"container")
childGroup=false
if(childContainers[0]){var options=$.extend({},this.options,{parentContainer:this,rootGroup:this.rootGroup,group:groupCounter++})
childGroup=childContainers.sortable(options).data('oc.sortable').group}
$.data(this.items[index],"subContainer",childGroup)}
return childGroup},enabled:function(){return!this.disabled&&(!this.parentContainer||this.parentContainer.enabled())},$getChildren:function(parent,type){var options=this.rootGroup.options,path=options[type+"Path"],selector=options[type+"Selector"]
parent=$(parent)
if(path)
parent=parent.find(path)
return parent.children(selector)},_serialize:function(parent,isContainer){var self=this,childType=isContainer?"item":"container",children=this.$getChildren(parent,childType).not(this.options.exclude).map(function(){return self._serialize($(this),!isContainer)}).get()
return this.rootGroup.options.serialize(parent,children,isContainer)},clearDimensions:function(){this.itemDimensions=undefined
if(this.items&&this.items[0]){var i=this.items.length
while(i--){var group=$.data(this.items[i],"subContainer")
if(group)
group.clearDimensions()}}}}
var API={enable:function(ignoreChildren){this.disabled=false},disable:function(ignoreChildren){this.disabled=true},serialize:function(){return this._serialize(this.el,true)},destroy:function(){this.rootGroup.destroy()}}
$.extend(Container.prototype,API)
var old=$.fn.sortable
$.fn.sortable=function(option){var args=Array.prototype.slice.call(arguments,1)
return this.map(function(){var $this=$(this),object=$this.data('oc.sortable')
if(object&&API[option])
return API[option].apply(object,args)||this
else if(!object&&(option===undefined||typeof option==="object"))
$this.data('oc.sortable',new Container($this,option))
return this});};$.fn.sortable.noConflict=function(){$.fn.sortable=old
return this}}(window.jQuery);+function($){"use strict";if($.oc===undefined)
$.oc={}
$.oc.inspector={editors:{},propertyCounter:0}
var Inspector=function(element,options){this.options=options
this.$el=$(element)
this.title=false
this.description=false}
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
                <form autocomplete="off">                                                                             \
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
var self=this,fieldsConfig=this.preprocessConfig(),data={title:this.title?this.title:this.$el.data('inspector-title'),description:this.description?this.description:this.$el.data('inspector-description'),properties:fieldsConfig.properties,editor:function(){return function(text,render){if(this.itemType=='property')
return self.renderEditor(this,render)}},info:function(){return function(text,render){if(this.description!==undefined&&this.description!=null)
return render('<span title="{{description}}" class="info oc-icon-info with-tooltip"></span>',this)}},propFormat:function(){return function(text,render){return'prop-'+render(text).replace('.','-')}},colspan:function(){return function(text,render){return this.itemType=='group'?'colspan="2"':null}},tableClass:function(){return function(text,render){return fieldsConfig.hasGroups?'has-groups':null}},cellClass:function(){return function(text,render){var result=this.itemType+((this.itemType=='property'&&this.groupIndex!==undefined)?' grouped':'')
if(this.itemType=='property'&&this.groupIndex!==undefined)
result+=self.groupExpanded(this.group)?' expanded':' collapsed'
if(this.itemType=='property'&&!this.showExternalParam)
result+=' no-external-parameter'
return result}},expandControl:function(){return function(text,render){if(this.itemType=='group'){this.itemStatus=self.groupExpanded(this.title)?'expanded':''
return render('<a class="expandControl {{itemStatus}}" href="javascript:;" data-group-index="{{groupIndex}}"><span>Expand/collapse</span></a>',this)}}},dataGroupIndex:function(){return function(text,render){return this.groupIndex!==undefined&&this.itemType=='property'?render('data-group-index={{groupIndex}}',this):''}}}
this.editors=[]
this.initProperties()
this.$el.data('oc.inspectorVisible',true)
var displayPopover=function(){var offset=self.$el.data('inspector-offset')
if(offset===undefined)
offset=15
var offsetX=self.$el.data('inspector-offset-x'),offsetY=self.$el.data('inspector-offset-y')
var placement=self.$el.data('inspector-placement')
if(placement===undefined)
placement='bottom'
var fallbackPlacement=self.$el.data('inspector-fallback-placement')
if(fallbackPlacement===undefined)
fallbackPlacement='bottom'
self.$el.ocPopover({content:Mustache.render(self.getPopoverTemplate(),data),highlightModalTarget:true,modal:true,placement:placement,fallbackPlacement:fallbackPlacement,containerClass:'control-inspector',container:self.$el.data('inspector-container'),offset:offset,offsetX:offsetX,offsetY:offsetY,width:400})
self.$el.on('hiding.oc.popover',function(e){return self.onBeforeHide(e)})
self.$el.on('hide.oc.popover',function(){self.cleanup()})
self.$el.addClass('inspector-open')
$(self.$el.data('oc.popover').$container).on('keydown',function(e){if(e.keyCode==13)
$(this).trigger('close.oc.popover')})
if(self.editors.length>0){if(self.editors[0].focus!==undefined)
self.editors[0].focus()}
if(self.$el.closest('[data-inspector-external-parameters]').length>0)
self.initExternalParameterEditor(self.$el.data('oc.popover').$container)
$.each(self.editors,function(){if(this.init!==undefined)
this.init()})
$('.with-tooltip',self.$el.data('oc.popover').$container).tooltip({placement:'auto right',container:'body',delay:500})
var $container=self.$el.data('oc.popover').$container
$container.on('click','tr.group',function(){self.toggleGroup($('a.expandControl',this),$container)
return false})
var cssClass=self.options.inspectorCssClass
if(cssClass!==undefined)
$container.addClass(cssClass)}
var e=$.Event('showing.oc.inspector')
this.$el.trigger(e,[{callback:displayPopover}])
if(e.isDefaultPrevented())
return
if(!e.isPropagationStopped())
displayPopover()}
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
this.$el.data('oc.inspectorVisible',false)}
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
var eH=$.Event('hiding.oc.inspector'),ispector=this
this.$el.trigger(eH,[{values:this.propertyValues}])
if(eH.isDefaultPrevented()){e.preventDefault()
return false}
$.each(this.editors,function(){if(ispector.editorExternalPropertyEnabled(this))
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
if(!e.isDefaultPrevented()){$.each(this.editors,function(){if(this.cleanup)
this.cleanup()})}}
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
var self=this
$(document).on('focus',this.selector,function(){var $field=$(this)
$('td',$field.closest('table')).removeClass('active')
$field.closest('td').addClass('active')})
$(document).on('change',this.selector,function(){self.applyValue()})}
InspectorEditorString.prototype.init=function(){var value=this.inspector.readProperty(this.fieldDef.property,true)
if(value===undefined)
value=this.inspector.getDefaultValue(this.fieldDef.property)
$(this.selector).val($.trim(value))}
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
var self=this
$(document).on('change',this.selector,function(){self.applyValue()})}
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
var self=this
$(document).on('change',this.selector,function(){self.applyValue()})}
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
InspectorEditorDropdown.prototype.init=function(){var value=this.inspector.readProperty(this.fieldDef.property,true),self=this
if(value===undefined)
value=this.inspector.getDefaultValue(this.fieldDef.property)
$(this.selector).attr('data-no-auto-update-on-render','true')
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
InspectorEditorDropdown.prototype.cleanup=function(){$(this.selector).select2('destroy')}
$.oc.inspector.editors.inspectorEditorDropdown=InspectorEditorDropdown;function initInspector($element){var inspector=$element.data('oc.inspector')
if(inspector===undefined){inspector=new Inspector($element.get(0),$element.data())
inspector.loadConfiguration(function(){inspector.init()})
$element.data('oc.inspector',inspector)}else
inspector.init()}
$.fn.inspector=function(option){return this.each(function(){initInspector($(this))})}
$(document).on('click','[data-inspectable]',function(){var $this=$(this)
if($this.data('oc.inspectorVisible'))
return false
initInspector($this)
return false})}(window.jQuery);+function($){"use strict";$(document).on('shown.bs.dropdown','.dropdown',function(){$(document.body).addClass('dropdown-open')
var dropdown=$('.dropdown-menu',this),dropdownContainer=$(this).data('dropdown-container')
if($('.dropdown-container',dropdown).length==0){var
title=$('[data-toggle=dropdown]',this).text(),titleAttr=dropdown.data('dropdown-title'),timer=null;if(titleAttr!==undefined)
title=titleAttr
$('li:first-child',dropdown).addClass('first-item')
dropdown.prepend($('<li/>').addClass('dropdown-title').text(title))
var
container=$('<li/>').addClass('dropdown-container'),ul=$('<ul/>')
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
dropdown.addClass('top')}else
dropdown.removeClass('top')
dropdown.css({'left':position.x+leftOffset,'top':position.y,'visibility':'visible'})}
if($('.dropdown-overlay',document.body).length==0)
$(document.body).prepend($('<div/>').addClass('dropdown-overlay'));})
$(document).on('hidden.bs.dropdown','.dropdown',function(){var dropdown=$(this).data('oc.dropdown')
if(dropdown!==undefined){dropdown.css('display','none')
$(this).append(dropdown)}
$(document.body).removeClass('dropdown-open');})}(window.jQuery);+function($){"use strict";var ChangeMonitor=function(element,options){var $el=this.$el=$(element);this.paused=false
this.options=options||{}
this.init()}
ChangeMonitor.prototype.init=function(){this.$el.on('change',$.proxy(this.change,this))
this.$el.on('unchange.oc.changeMonitor',$.proxy(this.unchange,this))
this.$el.on('pause.oc.changeMonitor ',$.proxy(this.pause,this))
this.$el.on('resume.oc.changeMonitor ',$.proxy(this.resume,this))
this.$el.on('keyup input paste','input, textarea:not(.ace_text-input)',$.proxy(this.onInputChange,this))
$('input:not([type=hidden]), textarea:not(.ace_text-input)',this.$el).each(function(){$(this).data('oldval.oc.changeMonitor',$(this).val());})
if(this.options.windowCloseConfirm)
$(window).on('beforeunload',$.proxy(this.onBeforeUnload,this))}
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
$(document).render(function(){$('[data-change-monitor]').changeMonitor()})}(window.jQuery);+function($){"use strict";var ChartUtils=function(){}
ChartUtils.prototype.defaultValueColor='#b8b8b8';ChartUtils.prototype.getColor=function(index){var
colors=['#95b753','#cc3300','#e5a91a','#3366ff','#ff0f00','#ff6600','#ff9e01','#fcd202','#f8ff01','#b0de09','#04d215','#0d8ecf','#0d52d1','#2a0cd0','#8a0ccf','#cd0d74','#754deb','#dddddd','#999999','#333333','#000000','#57032a','#ca9726','#990000','#4b0c25'],colorIndex=index%(colors.length-1);return colors[colorIndex];}
ChartUtils.prototype.loadListValues=function($list){var result={values:[],total:0,max:0}
$('> li',$list).each(function(){var value=parseFloat($('span',this).text());result.total+=value
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
$.oc.chartUtils=new ChartUtils();}(window.jQuery);+function($){"use strict";var PieChart=function(element,options){this.options=options||{};var
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
$(document).render(function(){$('[data-control=chart-pie]').pieChart()})}(window.jQuery);+function($){"use strict";var BarChart=function(element,options){this.options=options||{};var
$el=this.$el=$(element),size=this.size=$el.height(),total=0,self=this,values=$.oc.chartUtils.loadListValues($('ul',$el)),$legend=$.oc.chartUtils.createLegend($('ul',$el)),indicators=$.oc.chartUtils.initLegendColorIndicators($legend),isFullWidth=this.isFullWidth(),chartHeight=this.options.height!==undefined?this.options.height:size,chartWidth=isFullWidth?this.$el.width():size,barWidth=(chartWidth-(values.values.length-1)*this.options.gap)/values.values.length
var $canvas=$('<div/>').addClass('canvas').height(chartHeight).width(isFullWidth?'100%':chartWidth)
$el.prepend($canvas)
$el.toggleClass('full-width',isFullWidth)
Raphael($canvas.get(0),isFullWidth?'100%':chartWidth,chartHeight,function(){self.paper=this;self.bars=this.set()
self.paper.customAttributes.bar=function(start,height){return{path:[["M",start,chartWidth],["L",start,chartHeight-height],["L",start+barWidth,chartHeight-height],["L",start+barWidth,chartWidth],["Z"]]}}
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
$(document).render(function(){$('[data-control=chart-bar]').barChart()})}(window.jQuery);+function($){"use strict";var ChartLine=function(element,options){var self=this
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
$(document).render(function(){$('[data-control="chart-line"]').chartLine()})}(window.jQuery);+function($){"use strict";var BalloonSelector=function(element,options){this.$el=$(element)
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
$(document).on('render',function(){$('div[data-control=balloon-selector]').balloonSelector()})}(window.jQuery);+function($){"use strict";var RowLink=function(element,options){var self=this
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
$(document).render(function(){$('[data-control="rowlink"]').rowLink()})}(window.jQuery);+function($){"use strict";var TreeListWidget=function(element,options){var $el=this.$el=$(element),self=this;this.options=options||{};var sortableOptions={handle:options.handle,nested:options.nested,onDrop:function($item,container,_super){self.$el.trigger('move.oc.treelist',{item:$item,container:container})
_super($item,container)},afterMove:function($placeholder,container,$closestEl){self.$el.trigger('aftermove.oc.treelist',{placeholder:$placeholder,container:container,closestEl:$closestEl})}}
$el.find('> ol').sortable($.extend(sortableOptions,options))
if(!options.nested){$el.find('> ol ol').sortable($.extend(sortableOptions,options))}}
TreeListWidget.prototype.unbind=function(){this.$el.find('> ol').sortable('destroy')
if(!this.options.nested){this.$el.find('> ol ol').sortable('destroy')}
this.$el.removeData('oc.treelist')}
TreeListWidget.DEFAULTS={handle:null,nested:true}
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
$this.autocomplete($this.data())})}(window.jQuery);+function($){'use strict';var dismiss='[data-dismiss="callout"]'
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
$(document).on('click.oc.callout.data-api',dismiss,Callout.prototype.close)}(jQuery);+function($){"use strict";var SidenavTree=function(element,options){this.options=options
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
$(document).ready(function(){$('[data-control=sidenav-tree]').sidenavTree()})}(window.jQuery);