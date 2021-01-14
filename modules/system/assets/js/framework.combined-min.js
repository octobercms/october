
if(window.jQuery===undefined){throw new Error('The jQuery library is not loaded. The OctoberCMS framework cannot be initialized.');}
if(window.jQuery.request!==undefined){throw new Error('The OctoberCMS framework is already loaded.');}
+function($){"use strict";var Request=function(element,handler,options){var $el=this.$el=$(element);this.options=options||{};if(handler===undefined){throw new Error('The request handler name is not specified.')}
if(!handler.match(/^(?:\w+\:{2})?on*/)){throw new Error('Invalid handler name. The correct handler name format is: "onEvent".')}
var $form=options.form?$(options.form):$el.closest('form'),$triggerEl=!!$form.length?$form:$el,context={handler:handler,options:options}
if((options.browserValidate!==undefined)&&typeof document.createElement('input').reportValidity=='function'&&$form&&$form[0]&&!$form[0].checkValidity()){$form[0].reportValidity();return false;}
$el.trigger('ajaxSetup',[context])
var _event=jQuery.Event('oc.beforeRequest')
$triggerEl.trigger(_event,context)
if(_event.isDefaultPrevented())return
var loading=options.loading!==undefined?options.loading:null,url=options.url!==undefined?options.url:window.location.href,isRedirect=options.redirect!==undefined&&options.redirect.length,useFlash=options.flash!==undefined,useFiles=options.files!==undefined
if(useFiles&&typeof FormData==='undefined'){console.warn('This browser does not support file uploads via FormData')
useFiles=false}
if($.type(loading)=='string'){loading=$(loading)}
var requestHeaders={'X-OCTOBER-REQUEST-HANDLER':handler,'X-OCTOBER-REQUEST-PARTIALS':this.extractPartials(options.update)}
if(useFlash){requestHeaders['X-OCTOBER-REQUEST-FLASH']=1}
var csrfToken=getXSRFToken()
if(csrfToken){requestHeaders['X-XSRF-TOKEN']=csrfToken}
var requestData,inputName,data={}
$.each($el.parents('[data-request-data]').toArray().reverse(),function extendRequest(){$.extend(data,paramToObj('data-request-data',$(this).data('request-data')))})
if($el.is(':input')&&!$form.length){inputName=$el.attr('name')
if(inputName!==undefined&&options.data[inputName]===undefined){options.data[inputName]=$el.val()}}
if(options.data!==undefined&&!$.isEmptyObject(options.data)){$.extend(data,options.data)}
if(useFiles){requestData=new FormData($form.length?$form.get(0):undefined)
if($el.is(':file')&&inputName){$.each($el.prop('files'),function(){requestData.append(inputName,this)})
delete data[inputName]}
$.each(data,function(key){if(typeof Blob!=="undefined"&&this instanceof Blob&&this.filename){requestData.append(key,this,this.filename)}else{requestData.append(key,this)}})}
else{requestData=[$form.serialize(),$.param(data)].filter(Boolean).join('&')}
var requestOptions={url:url,crossDomain:false,global:options.ajaxGlobal,context:context,headers:requestHeaders,success:function(data,textStatus,jqXHR){if(this.options.beforeUpdate.apply(this,[data,textStatus,jqXHR])===false)return
if(options.evalBeforeUpdate&&eval('(function($el, context, data, textStatus, jqXHR) {'+options.evalBeforeUpdate+'}.call($el.get(0), $el, context, data, textStatus, jqXHR))')===false)return
var _event=jQuery.Event('ajaxBeforeUpdate')
$triggerEl.trigger(_event,[context,data,textStatus,jqXHR])
if(_event.isDefaultPrevented())return
if(useFlash&&data['X_OCTOBER_FLASH_MESSAGES']){$.each(data['X_OCTOBER_FLASH_MESSAGES'],function(type,message){requestOptions.handleFlashMessage(message,type)})}
var updatePromise=requestOptions.handleUpdateResponse(data,textStatus,jqXHR)
updatePromise.done(function(){$triggerEl.trigger('ajaxSuccess',[context,data,textStatus,jqXHR])
options.evalSuccess&&eval('(function($el, context, data, textStatus, jqXHR) {'+options.evalSuccess+'}.call($el.get(0), $el, context, data, textStatus, jqXHR))')})
return updatePromise},error:function(jqXHR,textStatus,errorThrown){var errorMsg,updatePromise=$.Deferred()
if((window.ocUnloading!==undefined&&window.ocUnloading)||errorThrown=='abort')
return
isRedirect=false
options.redirect=null
if(jqXHR.status==406&&jqXHR.responseJSON){errorMsg=jqXHR.responseJSON['X_OCTOBER_ERROR_MESSAGE']
updatePromise=requestOptions.handleUpdateResponse(jqXHR.responseJSON,textStatus,jqXHR)}
else{errorMsg=jqXHR.responseText?jqXHR.responseText:jqXHR.statusText
updatePromise.resolve()}
updatePromise.done(function(){$el.data('error-message',errorMsg)
var _event=jQuery.Event('ajaxError')
$triggerEl.trigger(_event,[context,errorMsg,textStatus,jqXHR])
if(_event.isDefaultPrevented())return
if(options.evalError&&eval('(function($el, context, errorMsg, textStatus, jqXHR) {'+options.evalError+'}.call($el.get(0), $el, context, errorMsg, textStatus, jqXHR))')===false)
return
requestOptions.handleErrorMessage(errorMsg)})
return updatePromise},complete:function(data,textStatus,jqXHR){$triggerEl.trigger('ajaxComplete',[context,data,textStatus,jqXHR])
options.evalComplete&&eval('(function($el, context, data, textStatus, jqXHR) {'+options.evalComplete+'}.call($el.get(0), $el, context, data, textStatus, jqXHR))')},handleConfirmMessage:function(message){var _event=jQuery.Event('ajaxConfirmMessage')
_event.promise=$.Deferred()
if($(window).triggerHandler(_event,[message])!==undefined){_event.promise.done(function(){options.confirm=null
new Request(element,handler,options)})
return false}
if(_event.isDefaultPrevented())return
if(message)return confirm(message)},handleErrorMessage:function(message){var _event=jQuery.Event('ajaxErrorMessage')
$(window).trigger(_event,[message])
if(_event.isDefaultPrevented())return
if(message)alert(message)},handleValidationMessage:function(message,fields){$triggerEl.trigger('ajaxValidation',[context,message,fields])
var isFirstInvalidField=true
$.each(fields,function focusErrorField(fieldName,fieldMessages){fieldName=fieldName.replace(/\.(\w+)/g,'[$1]')
var fieldElement=$form.find('[name="'+fieldName+'"], [name="'+fieldName+'[]"], [name$="['+fieldName+']"], [name$="['+fieldName+'][]"]').filter(':enabled').first()
if(fieldElement.length>0){var _event=jQuery.Event('ajaxInvalidField')
$(window).trigger(_event,[fieldElement.get(0),fieldName,fieldMessages,isFirstInvalidField])
if(isFirstInvalidField){if(!_event.isDefaultPrevented())fieldElement.focus()
isFirstInvalidField=false}}})},handleFlashMessage:function(message,type){},handleRedirectResponse:function(url){window.location.assign(url)
$el.trigger('ajaxDone')},handleUpdateResponse:function(data,textStatus,jqXHR){var updatePromise=$.Deferred().done(function(){for(var partial in data){var selector=(options.update[partial])?options.update[partial]:partial
if($.type(selector)=='string'&&selector.charAt(0)=='@'){$(selector.substring(1)).append(data[partial]).trigger('ajaxUpdate',[context,data,textStatus,jqXHR])}
else if($.type(selector)=='string'&&selector.charAt(0)=='^'){$(selector.substring(1)).prepend(data[partial]).trigger('ajaxUpdate',[context,data,textStatus,jqXHR])}
else{$(selector).trigger('ajaxBeforeReplace')
$(selector).html(data[partial]).trigger('ajaxUpdate',[context,data,textStatus,jqXHR])}}
setTimeout(function(){$(window).trigger('ajaxUpdateComplete',[context,data,textStatus,jqXHR]).trigger('resize')},0)})
if(data['X_OCTOBER_REDIRECT']){options.redirect=data['X_OCTOBER_REDIRECT']
isRedirect=true}
if(isRedirect){requestOptions.handleRedirectResponse(options.redirect)}
if(data['X_OCTOBER_ERROR_FIELDS']){requestOptions.handleValidationMessage(data['X_OCTOBER_ERROR_MESSAGE'],data['X_OCTOBER_ERROR_FIELDS'])}
if(data['X_OCTOBER_ASSETS']){assetManager.load(data['X_OCTOBER_ASSETS'],$.proxy(updatePromise.resolve,updatePromise))}
else{updatePromise.resolve()}
return updatePromise}}
if(useFiles){requestOptions.processData=requestOptions.contentType=false}
context.success=requestOptions.success
context.error=requestOptions.error
context.complete=requestOptions.complete
requestOptions=$.extend(requestOptions,options)
requestOptions.data=requestData
if(options.confirm&&!requestOptions.handleConfirmMessage(options.confirm)){return}
if(loading)loading.show()
$(window).trigger('ajaxBeforeSend',[context])
$el.trigger('ajaxPromise',[context])
return $.ajax(requestOptions).fail(function(jqXHR,textStatus,errorThrown){if(!isRedirect){$el.trigger('ajaxFail',[context,textStatus,jqXHR])}
if(loading)loading.hide()}).done(function(data,textStatus,jqXHR){if(!isRedirect){$el.trigger('ajaxDone',[context,data,textStatus,jqXHR])}
if(loading)loading.hide()}).always(function(dataOrXhr,textStatus,xhrOrError){$el.trigger('ajaxAlways',[context,dataOrXhr,textStatus,xhrOrError])})}
Request.DEFAULTS={update:{},type:'POST',beforeUpdate:function(data,textStatus,jqXHR){},evalBeforeUpdate:null,evalSuccess:null,evalError:null,evalComplete:null,ajaxGlobal:false}
Request.prototype.extractPartials=function(update){var result=[]
for(var partial in update)
result.push(partial)
return result.join('&')}
var old=$.fn.request
$.fn.request=function(handler,option){var args=arguments
var $this=$(this).first()
var data={evalBeforeUpdate:$this.data('request-before-update'),evalSuccess:$this.data('request-success'),evalError:$this.data('request-error'),evalComplete:$this.data('request-complete'),ajaxGlobal:$this.data('request-ajax-global'),confirm:$this.data('request-confirm'),redirect:$this.data('request-redirect'),loading:$this.data('request-loading'),flash:$this.data('request-flash'),files:$this.data('request-files'),browserValidate:$this.data('browser-validate'),form:$this.data('request-form'),url:$this.data('request-url'),update:paramToObj('data-request-update',$this.data('request-update')),data:paramToObj('data-request-data',$this.data('request-data'))}
if(!handler)handler=$this.data('request')
var options=$.extend(true,{},Request.DEFAULTS,data,typeof option=='object'&&option)
return new Request($this,handler,options)}
$.fn.request.Constructor=Request
$.request=function(handler,option){return $(document).request(handler,option)}
$.fn.request.noConflict=function(){$.fn.request=old
return this}
function paramToObj(name,value){if(value===undefined)value=''
if(typeof value=='object')return value
try{return ocJSON("{"+value+"}")}
catch(e){throw new Error('Error parsing the '+name+' attribute value. '+e)}}
function getXSRFToken(){var cookieValue=null
if(document.cookie&&document.cookie!=''){var cookies=document.cookie.split(';')
for(var i=0;i<cookies.length;i++){var cookie=jQuery.trim(cookies[i])
if(cookie.substring(0,11)==('XSRF-TOKEN'+'=')){cookieValue=decodeURIComponent(cookie.substring(11))
break}}}
return cookieValue}
$(document).on('change','select[data-request], input[type=radio][data-request], input[type=checkbox][data-request], input[type=file][data-request]',function documentOnChange(){$(this).request()})
$(document).on('click','a[data-request], button[data-request], input[type=button][data-request], input[type=submit][data-request]',function documentOnClick(e){e.preventDefault()
$(this).request()
if($(this).is('[type=submit]'))
return false})
$(document).on('keydown','input[type=text][data-request], input[type=submit][data-request], input[type=password][data-request]',function documentOnKeydown(e){if(e.key==='Enter'){if(this.dataTrackInputTimer!==undefined)
window.clearTimeout(this.dataTrackInputTimer)
$(this).request()
return false}})
$(document).on('input','input[data-request][data-track-input]',function documentOnKeyup(e){var
$el=$(this),lastValue=$el.data('oc.lastvalue')
if(!$el.is('[type=email],[type=number],[type=password],[type=search],[type=text]'))
return
if(lastValue!==undefined&&lastValue==this.value)
return
$el.data('oc.lastvalue',this.value)
if(this.dataTrackInputTimer!==undefined)
window.clearTimeout(this.dataTrackInputTimer)
var interval=$(this).data('track-input')
if(!interval)
interval=300
var self=this
this.dataTrackInputTimer=window.setTimeout(function(){if(self.lastDataTrackInputRequest){self.lastDataTrackInputRequest.abort();}
self.lastDataTrackInputRequest=$(self).request();},interval)})
$(document).on('submit','[data-request]',function documentOnSubmit(){$(this).request()
return false})
$(window).on('beforeunload',function documentOnBeforeUnload(){window.ocUnloading=true})
$(document).ready(function triggerRenderOnReady(){$(document).trigger('render')})
$(window).on('ajaxUpdateComplete',function triggerRenderOnAjaxUpdateComplete(){$(document).trigger('render')})
$.fn.render=function(callback){$(document).on('render',callback)}}(window.jQuery);+function(window){"use strict";function parseKey(str,pos,quote){var key="";for(var i=pos;i<str.length;i++){if(quote&&quote===str[i]){return key;}else if(!quote&&(str[i]===" "||str[i]===":")){return key;}
key+=str[i];if(str[i]==="\\"&&i+1<str.length){key+=str[i+1];i++;}}
throw new Error("Broken JSON syntax near "+key);}
function getBody(str,pos){if(str[pos]==="\""||str[pos]==="'"){var body=str[pos];for(var i=pos+1;i<str.length;i++){if(str[i]==="\\"){body+=str[i];if(i+1<str.length)body+=str[i+1];i++;}else if(str[i]===str[pos]){body+=str[pos];return{originLength:body.length,body:body};}else body+=str[i];}
throw new Error("Broken JSON string body near "+body);}
if(str[pos]==="t"){if(str.indexOf("true",pos)===pos){return{originLength:"true".length,body:"true"};}
throw new Error("Broken JSON boolean body near "+str.substr(0,pos+10));}
if(str[pos]==="f"){if(str.indexOf("f",pos)===pos){return{originLength:"false".length,body:"false"};}
throw new Error("Broken JSON boolean body near "+str.substr(0,pos+10));}
if(str[pos]==="n"){if(str.indexOf("null",pos)===pos){return{originLength:"null".length,body:"null"};}
throw new Error("Broken JSON boolean body near "+str.substr(0,pos+10));}
if(str[pos]==="-"||str[pos]==="+"||str[pos]==="."||(str[pos]>="0"&&str[pos]<="9")){var body="";for(var i=pos;i<str.length;i++){if(str[i]==="-"||str[i]==="+"||str[i]==="."||(str[i]>="0"&&str[i]<="9")){body+=str[i];}else{return{originLength:body.length,body:body};}}
throw new Error("Broken JSON number body near "+body);}
if(str[pos]==="{"||str[pos]==="["){var stack=[str[pos]];var body=str[pos];for(var i=pos+1;i<str.length;i++){body+=str[i];if(str[i]==="\\"){if(i+1<str.length)body+=str[i+1];i++;}else if(str[i]==="\""){if(stack[stack.length-1]==="\""){stack.pop();}else if(stack[stack.length-1]!=="'"){stack.push(str[i]);}}else if(str[i]==="'"){if(stack[stack.length-1]==="'"){stack.pop();}else if(stack[stack.length-1]!=="\""){stack.push(str[i]);}}else if(stack[stack.length-1]!=="\""&&stack[stack.length-1]!=="'"){if(str[i]==="{"){stack.push("{");}else if(str[i]==="}"){if(stack[stack.length-1]==="{"){stack.pop();}else{throw new Error("Broken JSON "+(str[pos]==="{"?"object":"array")+" body near "+body);}}else if(str[i]==="["){stack.push("[");}else if(str[i]==="]"){if(stack[stack.length-1]==="["){stack.pop();}else{throw new Error("Broken JSON "+(str[pos]==="{"?"object":"array")+" body near "+body);}}}
if(!stack.length){return{originLength:i-pos,body:body};}}
throw new Error("Broken JSON "+(str[pos]==="{"?"object":"array")+" body near "+body);}
throw new Error("Broken JSON body near "+str.substr((pos-5>=0)?pos-5:0,50));}
function canBeKeyHead(ch){if(ch[0]==="\\")return false;if((ch[0]>='a'&&ch[0]<='z')||(ch[0]>='A'&&ch[0]<='Z')||ch[0]==='_')return true;if(ch[0]>='0'&&ch[0]<='9')return true;if(ch[0]==='$')return true;if(ch.charCodeAt(0)>255)return true;return false;}
function isBlankChar(ch){return ch===" "||ch==="\n"||ch==="\t";}
function parse(str){str=str.trim();if(!str.length)throw new Error("Broken JSON object.");var result="";while(str&&str[0]===","){str=str.substr(1);}
if(str[0]==="\""||str[0]==="'"){if(str[str.length-1]!==str[0]){throw new Error("Invalid string JSON object.");}
var body="\"";for(var i=1;i<str.length;i++){if(str[i]==="\\"){if(str[i+1]==="'"){body+=str[i+1]}else{body+=str[i];body+=str[i+1];}
i++;}else if(str[i]===str[0]){body+="\"";return body}else if(str[i]==="\""){body+="\\\""}else body+=str[i];}
throw new Error("Invalid string JSON object.");}
if(str==="true"||str==="false"){return str;}
if(str==="null"){return"null";}
var num=parseFloat(str);if(!isNaN(num)){return num.toString();}
if(str[0]==="{"){var type="needKey";var result="{";for(var i=1;i<str.length;i++){if(isBlankChar(str[i])){continue;}else if(type==="needKey"&&(str[i]==="\""||str[i]==="'")){var key=parseKey(str,i+1,str[i]);result+="\""+key+"\"";i+=key.length;i+=1;type="afterKey";}else if(type==="needKey"&&canBeKeyHead(str[i])){var key=parseKey(str,i);result+="\"";result+=key;result+="\"";i+=key.length-1;type="afterKey";}else if(type==="afterKey"&&str[i]===":"){result+=":";type=":";}else if(type===":"){var body=getBody(str,i);i=i+body.originLength-1;result+=parse(body.body);type="afterBody";}else if(type==="afterBody"||type==="needKey"){var last=i;while(str[last]===","||isBlankChar(str[last])){last++;}
if(str[last]==="}"&&last===str.length-1){while(result[result.length-1]===","){result=result.substr(0,result.length-1);}
result+="}";return result;}else if(last!==i&&result!=="{"){result+=",";type="needKey";i=last-1;}}}
throw new Error("Broken JSON object near "+result);}
if(str[0]==="["){var result="[";var type="needBody";for(var i=1;i<str.length;i++){if(" "===str[i]||"\n"===str[i]||"\t"===str[i]){continue;}else if(type==="needBody"){if(str[i]===","){result+="null,";continue;}
if(str[i]==="]"&&i===str.length-1){if(result[result.length-1]===",")result=result.substr(0,result.length-1);result+="]";return result;}
var body=getBody(str,i);i=i+body.originLength-1;result+=parse(body.body);type="afterBody";}else if(type==="afterBody"){if(str[i]===","){result+=",";type="needBody";while(str[i+1]===","||isBlankChar(str[i+1])){if(str[i+1]===",")result+="null,";i++;}}else if(str[i]==="]"&&i===str.length-1){result+="]";return result;}}}
throw new Error("Broken JSON array near "+result);}}
window.ocJSON=function(json){var jsonString=parse(json);return JSON.parse(jsonString);};}(window);+function(window){"use strict";function trimAttributes(node){$.each(node.attributes,function(){var attrName=this.name;var attrValue=this.value;if(attrName.indexOf('on')==0||attrValue.indexOf('javascript:')==0){$(node).removeAttr(attrName);}});}
function sanitize(html){var output=$($.parseHTML('<div>'+html+'</div>',null,false));output.find('*').each(function(){trimAttributes(this);});return output.html();}
window.ocSanitize=function(html){return sanitize(html)};}(window);+function($){"use strict";if($.oc===undefined)
$.oc={}
var LOADER_CLASS='oc-loading';$(document).on('ajaxSetup','[data-request][data-request-flash]',function(event,context){context.options.handleErrorMessage=function(message){$.oc.flashMsg({text:message,class:'error'})}
context.options.handleFlashMessage=function(message,type){$.oc.flashMsg({text:message,class:type})}})
$(document).on('ajaxValidation','[data-request][data-request-validate]',function(event,context,errorMsg,fields){var $this=$(this).closest('form'),$container=$('[data-validate-error]',$this),messages=[],$field
$.each(fields,function(fieldName,fieldMessages){$field=$('[data-validate-for="'+fieldName+'"]',$this)
messages=$.merge(messages,fieldMessages)
if(!!$field.length){if(!$field.text().length||$field.data('emptyMode')==true){$field.data('emptyMode',true).text(fieldMessages.join(', '))}
$field.addClass('visible')}})
if(!!$container.length){$container=$('[data-validate-error]',$this)}
if(!!$container.length){var $oldMessages=$('[data-message]',$container)
$container.addClass('visible')
if(!!$oldMessages.length){var $clone=$oldMessages.first()
$.each(messages,function(key,message){$clone.clone().text(message).insertAfter($clone)})
$oldMessages.remove()}
else{$container.text(errorMsg)}}
$this.one('ajaxError',function(event){event.preventDefault()})})
$(document).on('ajaxPromise','[data-request][data-request-validate]',function(){var $this=$(this).closest('form')
$('[data-validate-for]',$this).removeClass('visible')
$('[data-validate-error]',$this).removeClass('visible')})
$(document).on('ajaxPromise','[data-request]',function(){var $target=$(this)
if($target.data('attach-loading')!==undefined){$target.addClass(LOADER_CLASS).prop('disabled',true)}
if($target.is('form')){$('[data-attach-loading]',$target).addClass(LOADER_CLASS).prop('disabled',true)}}).on('ajaxFail ajaxDone','[data-request]',function(){var $target=$(this)
if($target.data('attach-loading')!==undefined){$target.removeClass(LOADER_CLASS).prop('disabled',false)}
if($target.is('form')){$('[data-attach-loading]',$target).removeClass(LOADER_CLASS).prop('disabled',false)}})
var StripeLoadIndicator=function(){var self=this
this.counter=0
this.indicator=$('<div/>').addClass('stripe-loading-indicator loaded').append($('<div />').addClass('stripe')).append($('<div />').addClass('stripe-loaded'))
this.stripe=this.indicator.find('.stripe')
$(document).ready(function(){$(document.body).append(self.indicator)})}
StripeLoadIndicator.prototype.show=function(){this.counter++
this.stripe.after(this.stripe=this.stripe.clone()).remove()
if(this.counter>1){return}
this.indicator.removeClass('loaded')
$(document.body).addClass('oc-loading')}
StripeLoadIndicator.prototype.hide=function(force){this.counter--
if(force!==undefined&&force){this.counter=0}
if(this.counter<=0){this.indicator.addClass('loaded')
$(document.body).removeClass('oc-loading')}}
$.oc.stripeLoadIndicator=new StripeLoadIndicator()
$(document).on('ajaxPromise','[data-request]',function(event){event.stopPropagation()
$.oc.stripeLoadIndicator.show()
var $el=$(this)
$(window).one('ajaxUpdateComplete',function(){if($el.closest('html').length===0)
$.oc.stripeLoadIndicator.hide()})}).on('ajaxFail ajaxDone','[data-request]',function(event){event.stopPropagation()
$.oc.stripeLoadIndicator.hide()})
var FlashMessage=function(options,el){var
options=$.extend({},FlashMessage.DEFAULTS,options),$element=$(el)
$('body > p.flash-message').remove()
if($element.length==0){$element=$('<p />').addClass(options.class).html(options.text)}
$element.addClass('flash-message fade').attr('data-control',null).on('click','button',remove).on('click',remove).append('<button type="button" class="close" aria-hidden="true">&times;</button>')
$(document.body).append($element)
setTimeout(function(){$element.addClass('in')},100)
var timer=window.setTimeout(remove,options.interval*1000)
function removeElement(){$element.remove()}
function remove(){window.clearInterval(timer)
$element.removeClass('in')
$.support.transition&&$element.hasClass('fade')?$element.one($.support.transition.end,removeElement).emulateTransitionEnd(500):removeElement()}}
FlashMessage.DEFAULTS={class:'success',text:'Default text',interval:5}
if($.oc===undefined)
$.oc={}
$.oc.flashMsg=FlashMessage
$(document).render(function(){$('[data-control=flash-message]').each(function(){$.oc.flashMsg($(this).data(),this)})})}(window.jQuery);