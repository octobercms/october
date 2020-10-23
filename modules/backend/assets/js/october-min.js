
(function($){$.fn.touchwipe=function(settings){var config={min_move_x:20,min_move_y:20,wipeLeft:function(){},wipeRight:function(){},wipeUp:function(){},wipeDown:function(){},preventDefaultEvents:true};if(settings)$.extend(config,settings);this.each(function(){var startX;var startY;var isMoving=false;function cancelTouch(){this.removeEventListener('touchmove',onTouchMove);startX=null;isMoving=false;}
function onTouchMove(e){if(config.preventDefaultEvents){e.preventDefault();}
if(isMoving){var x=e.touches[0].pageX;var y=e.touches[0].pageY;var dx=startX-x;var dy=startY-y;if(Math.abs(dx)>=config.min_move_x){cancelTouch();if(dx>0){config.wipeLeft();}
else{config.wipeRight();}}
else if(Math.abs(dy)>=config.min_move_y){cancelTouch();if(dy>0){config.wipeDown();}
else{config.wipeUp();}}}}
function onTouchStart(e)
{if(e.touches.length==1){startX=e.touches[0].pageX;startY=e.touches[0].pageY;isMoving=true;this.addEventListener('touchmove',onTouchMove,false);}}
if('ontouchstart'in document.documentElement){this.addEventListener('touchstart',onTouchStart,false);}});return this;};})(jQuery);(function($){var liveUpdatingTargetSelectors={};var liveUpdaterIntervalId;var liveUpdaterRunning=false;var defaultSettings={ellipsis:'...',setTitle:'never',live:false};$.fn.ellipsis=function(selector,options){var subjectElements,settings;subjectElements=$(this);if(typeof selector!=='string'){options=selector;selector=undefined;}
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
$.cookie(key,'',$.extend({},options,{expires:-1}));return!$.cookie(key);};}));"use strict";var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}
function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}
function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}
var Emitter=function(){function Emitter(){_classCallCheck(this,Emitter);}
_createClass(Emitter,[{key:"on",value:function on(event,fn){this._callbacks=this._callbacks||{};if(!this._callbacks[event]){this._callbacks[event]=[];}
this._callbacks[event].push(fn);return this;}},{key:"emit",value:function emit(event){this._callbacks=this._callbacks||{};var callbacks=this._callbacks[event];if(callbacks){for(var _len=arguments.length,args=Array(_len>1?_len-1:0),_key=1;_key<_len;_key++){args[_key-1]=arguments[_key];}
for(var _iterator=callbacks,_isArray=true,_i=0,_iterator=_isArray?_iterator:_iterator[Symbol.iterator]();;){var _ref;if(_isArray){if(_i>=_iterator.length)break;_ref=_iterator[_i++];}else{_i=_iterator.next();if(_i.done)break;_ref=_i.value;}
var callback=_ref;callback.apply(this,args);}}
return this;}},{key:"off",value:function off(event,fn){if(!this._callbacks||arguments.length===0){this._callbacks={};return this;}
var callbacks=this._callbacks[event];if(!callbacks){return this;}
if(arguments.length===1){delete this._callbacks[event];return this;}
for(var i=0;i<callbacks.length;i++){var callback=callbacks[i];if(callback===fn){callbacks.splice(i,1);break;}}
return this;}}]);return Emitter;}();var Dropzone=function(_Emitter){_inherits(Dropzone,_Emitter);_createClass(Dropzone,null,[{key:"initClass",value:function initClass(){this.prototype.Emitter=Emitter;this.prototype.events=["drop","dragstart","dragend","dragenter","dragover","dragleave","addedfile","addedfiles","removedfile","thumbnail","error","errormultiple","processing","processingmultiple","uploadprogress","totaluploadprogress","sending","sendingmultiple","success","successmultiple","canceled","canceledmultiple","complete","completemultiple","reset","maxfilesexceeded","maxfilesreached","queuecomplete"];this.prototype.defaultOptions={url:null,method:"post",withCredentials:false,timeout:30000,parallelUploads:2,uploadMultiple:false,chunking:false,forceChunking:false,chunkSize:2000000,parallelChunkUploads:false,retryChunks:false,retryChunksLimit:3,maxFilesize:256,paramName:"file",createImageThumbnails:true,maxThumbnailFilesize:10,thumbnailWidth:120,thumbnailHeight:120,thumbnailMethod:'crop',resizeWidth:null,resizeHeight:null,resizeMimeType:null,resizeQuality:0.8,resizeMethod:'contain',filesizeBase:1000,maxFiles:null,headers:null,clickable:true,ignoreHiddenFiles:true,acceptedFiles:null,acceptedMimeTypes:null,autoProcessQueue:true,autoQueue:true,addRemoveLinks:false,previewsContainer:null,hiddenInputContainer:"body",capture:null,renameFilename:null,renameFile:null,forceFallback:false,dictDefaultMessage:"Drop files here to upload",dictFallbackMessage:"Your browser does not support drag'n'drop file uploads.",dictFallbackText:"Please use the fallback form below to upload your files like in the olden days.",dictFileTooBig:"File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",dictInvalidFileType:"You can't upload files of this type.",dictResponseError:"Server responded with {{statusCode}} code.",dictCancelUpload:"Cancel upload",dictUploadCanceled:"Upload canceled.",dictCancelUploadConfirmation:"Are you sure you want to cancel this upload?",dictRemoveFile:"Remove file",dictRemoveFileConfirmation:null,dictMaxFilesExceeded:"You can not upload any more files.",dictFileSizeUnits:{tb:"TB",gb:"GB",mb:"MB",kb:"KB",b:"b"},init:function init(){},params:function params(files,xhr,chunk){if(chunk){return{dzuuid:chunk.file.upload.uuid,dzchunkindex:chunk.index,dztotalfilesize:chunk.file.size,dzchunksize:this.options.chunkSize,dztotalchunkcount:chunk.file.upload.totalChunkCount,dzchunkbyteoffset:chunk.index*this.options.chunkSize};}},accept:function accept(file,done){return done();},chunksUploaded:function chunksUploaded(file,done){done();},fallback:function fallback(){var messageElement=void 0;this.element.className=this.element.className+" dz-browser-not-supported";for(var _iterator2=this.element.getElementsByTagName("div"),_isArray2=true,_i2=0,_iterator2=_isArray2?_iterator2:_iterator2[Symbol.iterator]();;){var _ref2;if(_isArray2){if(_i2>=_iterator2.length)break;_ref2=_iterator2[_i2++];}else{_i2=_iterator2.next();if(_i2.done)break;_ref2=_i2.value;}
var child=_ref2;if(/(^| )dz-message($| )/.test(child.className)){messageElement=child;child.className="dz-message";break;}}
if(!messageElement){messageElement=Dropzone.createElement("<div class=\"dz-message\"><span></span></div>");this.element.appendChild(messageElement);}
var span=messageElement.getElementsByTagName("span")[0];if(span){if(span.textContent!=null){span.textContent=this.options.dictFallbackMessage;}else if(span.innerText!=null){span.innerText=this.options.dictFallbackMessage;}}
return this.element.appendChild(this.getFallbackForm());},resize:function resize(file,width,height,resizeMethod){var info={srcX:0,srcY:0,srcWidth:file.width,srcHeight:file.height};var srcRatio=file.width/file.height;if(width==null&&height==null){width=info.srcWidth;height=info.srcHeight;}else if(width==null){width=height*srcRatio;}else if(height==null){height=width/srcRatio;}
width=Math.min(width,info.srcWidth);height=Math.min(height,info.srcHeight);var trgRatio=width/height;if(info.srcWidth>width||info.srcHeight>height){if(resizeMethod==='crop'){if(srcRatio>trgRatio){info.srcHeight=file.height;info.srcWidth=info.srcHeight*trgRatio;}else{info.srcWidth=file.width;info.srcHeight=info.srcWidth/trgRatio;}}else if(resizeMethod==='contain'){if(srcRatio>trgRatio){height=width/srcRatio;}else{width=height*srcRatio;}}else{throw new Error("Unknown resizeMethod '"+resizeMethod+"'");}}
info.srcX=(file.width-info.srcWidth)/2;info.srcY=(file.height-info.srcHeight)/2;info.trgWidth=width;info.trgHeight=height;return info;},transformFile:function transformFile(file,done){if((this.options.resizeWidth||this.options.resizeHeight)&&file.type.match(/image.*/)){return this.resizeImage(file,this.options.resizeWidth,this.options.resizeHeight,this.options.resizeMethod,done);}else{return done(file);}},previewTemplate:"<div class=\"dz-preview dz-file-preview\">\n  <div class=\"dz-image\"><img data-dz-thumbnail /></div>\n  <div class=\"dz-details\">\n    <div class=\"dz-size\"><span data-dz-size></span></div>\n    <div class=\"dz-filename\"><span data-dz-name></span></div>\n  </div>\n  <div class=\"dz-progress\"><span class=\"dz-upload\" data-dz-uploadprogress></span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n  <div class=\"dz-success-mark\">\n    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Check</title>\n      <defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <path d=\"M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" stroke-opacity=\"0.198794158\" stroke=\"#747474\" fill-opacity=\"0.816519475\" fill=\"#FFFFFF\" sketch:type=\"MSShapeGroup\"></path>\n      </g>\n    </svg>\n  </div>\n  <div class=\"dz-error-mark\">\n    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Error</title>\n      <defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <g id=\"Check-+-Oval-2\" sketch:type=\"MSLayerGroup\" stroke=\"#747474\" stroke-opacity=\"0.198794158\" fill=\"#FFFFFF\" fill-opacity=\"0.816519475\">\n          <path d=\"M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" sketch:type=\"MSShapeGroup\"></path>\n        </g>\n      </g>\n    </svg>\n  </div>\n</div>",drop:function drop(e){return this.element.classList.remove("dz-drag-hover");},dragstart:function dragstart(e){},dragend:function dragend(e){return this.element.classList.remove("dz-drag-hover");},dragenter:function dragenter(e){return this.element.classList.add("dz-drag-hover");},dragover:function dragover(e){return this.element.classList.add("dz-drag-hover");},dragleave:function dragleave(e){return this.element.classList.remove("dz-drag-hover");},paste:function paste(e){},reset:function reset(){return this.element.classList.remove("dz-started");},addedfile:function addedfile(file){var _this2=this;if(this.element===this.previewsContainer){this.element.classList.add("dz-started");}
if(this.previewsContainer){file.previewElement=Dropzone.createElement(this.options.previewTemplate.trim());file.previewTemplate=file.previewElement;this.previewsContainer.appendChild(file.previewElement);for(var _iterator3=file.previewElement.querySelectorAll("[data-dz-name]"),_isArray3=true,_i3=0,_iterator3=_isArray3?_iterator3:_iterator3[Symbol.iterator]();;){var _ref3;if(_isArray3){if(_i3>=_iterator3.length)break;_ref3=_iterator3[_i3++];}else{_i3=_iterator3.next();if(_i3.done)break;_ref3=_i3.value;}
var node=_ref3;node.textContent=file.name;}
for(var _iterator4=file.previewElement.querySelectorAll("[data-dz-size]"),_isArray4=true,_i4=0,_iterator4=_isArray4?_iterator4:_iterator4[Symbol.iterator]();;){if(_isArray4){if(_i4>=_iterator4.length)break;node=_iterator4[_i4++];}else{_i4=_iterator4.next();if(_i4.done)break;node=_i4.value;}
node.innerHTML=this.filesize(file.size);}
if(this.options.addRemoveLinks){file._removeLink=Dropzone.createElement("<a class=\"dz-remove\" href=\"javascript:undefined;\" data-dz-remove>"+this.options.dictRemoveFile+"</a>");file.previewElement.appendChild(file._removeLink);}
var removeFileEvent=function removeFileEvent(e){e.preventDefault();e.stopPropagation();if(file.status===Dropzone.UPLOADING){return Dropzone.confirm(_this2.options.dictCancelUploadConfirmation,function(){return _this2.removeFile(file);});}else{if(_this2.options.dictRemoveFileConfirmation){return Dropzone.confirm(_this2.options.dictRemoveFileConfirmation,function(){return _this2.removeFile(file);});}else{return _this2.removeFile(file);}}};for(var _iterator5=file.previewElement.querySelectorAll("[data-dz-remove]"),_isArray5=true,_i5=0,_iterator5=_isArray5?_iterator5:_iterator5[Symbol.iterator]();;){var _ref4;if(_isArray5){if(_i5>=_iterator5.length)break;_ref4=_iterator5[_i5++];}else{_i5=_iterator5.next();if(_i5.done)break;_ref4=_i5.value;}
var removeLink=_ref4;removeLink.addEventListener("click",removeFileEvent);}}},removedfile:function removedfile(file){if(file.previewElement!=null&&file.previewElement.parentNode!=null){file.previewElement.parentNode.removeChild(file.previewElement);}
return this._updateMaxFilesReachedClass();},thumbnail:function thumbnail(file,dataUrl){if(file.previewElement){file.previewElement.classList.remove("dz-file-preview");for(var _iterator6=file.previewElement.querySelectorAll("[data-dz-thumbnail]"),_isArray6=true,_i6=0,_iterator6=_isArray6?_iterator6:_iterator6[Symbol.iterator]();;){var _ref5;if(_isArray6){if(_i6>=_iterator6.length)break;_ref5=_iterator6[_i6++];}else{_i6=_iterator6.next();if(_i6.done)break;_ref5=_i6.value;}
var thumbnailElement=_ref5;thumbnailElement.alt=file.name;thumbnailElement.src=dataUrl;}
return setTimeout(function(){return file.previewElement.classList.add("dz-image-preview");},1);}},error:function error(file,message){if(file.previewElement){file.previewElement.classList.add("dz-error");if(typeof message!=="String"&&message.error){message=message.error;}
for(var _iterator7=file.previewElement.querySelectorAll("[data-dz-errormessage]"),_isArray7=true,_i7=0,_iterator7=_isArray7?_iterator7:_iterator7[Symbol.iterator]();;){var _ref6;if(_isArray7){if(_i7>=_iterator7.length)break;_ref6=_iterator7[_i7++];}else{_i7=_iterator7.next();if(_i7.done)break;_ref6=_i7.value;}
var node=_ref6;node.textContent=message;}}},errormultiple:function errormultiple(){},processing:function processing(file){if(file.previewElement){file.previewElement.classList.add("dz-processing");if(file._removeLink){return file._removeLink.innerHTML=this.options.dictCancelUpload;}}},processingmultiple:function processingmultiple(){},uploadprogress:function uploadprogress(file,progress,bytesSent){if(file.previewElement){for(var _iterator8=file.previewElement.querySelectorAll("[data-dz-uploadprogress]"),_isArray8=true,_i8=0,_iterator8=_isArray8?_iterator8:_iterator8[Symbol.iterator]();;){var _ref7;if(_isArray8){if(_i8>=_iterator8.length)break;_ref7=_iterator8[_i8++];}else{_i8=_iterator8.next();if(_i8.done)break;_ref7=_i8.value;}
var node=_ref7;node.nodeName==='PROGRESS'?node.value=progress:node.style.width=progress+"%";}}},totaluploadprogress:function totaluploadprogress(){},sending:function sending(){},sendingmultiple:function sendingmultiple(){},success:function success(file){if(file.previewElement){return file.previewElement.classList.add("dz-success");}},successmultiple:function successmultiple(){},canceled:function canceled(file){return this.emit("error",file,this.options.dictUploadCanceled);},canceledmultiple:function canceledmultiple(){},complete:function complete(file){if(file._removeLink){file._removeLink.innerHTML=this.options.dictRemoveFile;}
if(file.previewElement){return file.previewElement.classList.add("dz-complete");}},completemultiple:function completemultiple(){},maxfilesexceeded:function maxfilesexceeded(){},maxfilesreached:function maxfilesreached(){},queuecomplete:function queuecomplete(){},addedfiles:function addedfiles(){}};this.prototype._thumbnailQueue=[];this.prototype._processingThumbnail=false;}},{key:"extend",value:function extend(target){for(var _len2=arguments.length,objects=Array(_len2>1?_len2-1:0),_key2=1;_key2<_len2;_key2++){objects[_key2-1]=arguments[_key2];}
for(var _iterator9=objects,_isArray9=true,_i9=0,_iterator9=_isArray9?_iterator9:_iterator9[Symbol.iterator]();;){var _ref8;if(_isArray9){if(_i9>=_iterator9.length)break;_ref8=_iterator9[_i9++];}else{_i9=_iterator9.next();if(_i9.done)break;_ref8=_i9.value;}
var object=_ref8;for(var key in object){var val=object[key];target[key]=val;}}
return target;}}]);function Dropzone(el,options){_classCallCheck(this,Dropzone);var _this=_possibleConstructorReturn(this,(Dropzone.__proto__||Object.getPrototypeOf(Dropzone)).call(this));var fallback=void 0,left=void 0;_this.element=el;_this.version=Dropzone.version;_this.defaultOptions.previewTemplate=_this.defaultOptions.previewTemplate.replace(/\n*/g,"");_this.clickableElements=[];_this.listeners=[];_this.files=[];if(typeof _this.element==="string"){_this.element=document.querySelector(_this.element);}
if(!_this.element||_this.element.nodeType==null){throw new Error("Invalid dropzone element.");}
if(_this.element.dropzone){throw new Error("Dropzone already attached.");}
Dropzone.instances.push(_this);_this.element.dropzone=_this;var elementOptions=(left=Dropzone.optionsForElement(_this.element))!=null?left:{};_this.options=Dropzone.extend({},_this.defaultOptions,elementOptions,options!=null?options:{});if(_this.options.forceFallback||!Dropzone.isBrowserSupported()){var _ret;return _ret=_this.options.fallback.call(_this),_possibleConstructorReturn(_this,_ret);}
if(_this.options.url==null){_this.options.url=_this.element.getAttribute("action");}
if(!_this.options.url){throw new Error("No URL provided.");}
if(_this.options.acceptedFiles&&_this.options.acceptedMimeTypes){throw new Error("You can't provide both 'acceptedFiles' and 'acceptedMimeTypes'. 'acceptedMimeTypes' is deprecated.");}
if(_this.options.uploadMultiple&&_this.options.chunking){throw new Error('You cannot set both: uploadMultiple and chunking.');}
if(_this.options.acceptedMimeTypes){_this.options.acceptedFiles=_this.options.acceptedMimeTypes;delete _this.options.acceptedMimeTypes;}
if(_this.options.renameFilename!=null){_this.options.renameFile=function(file){return _this.options.renameFilename.call(_this,file.name,file);};}
_this.options.method=_this.options.method.toUpperCase();if((fallback=_this.getExistingFallback())&&fallback.parentNode){fallback.parentNode.removeChild(fallback);}
if(_this.options.previewsContainer!==false){if(_this.options.previewsContainer){_this.previewsContainer=Dropzone.getElement(_this.options.previewsContainer,"previewsContainer");}else{_this.previewsContainer=_this.element;}}
if(_this.options.clickable){if(_this.options.clickable===true){_this.clickableElements=[_this.element];}else{_this.clickableElements=Dropzone.getElements(_this.options.clickable,"clickable");}}
_this.init();return _this;}
_createClass(Dropzone,[{key:"getAcceptedFiles",value:function getAcceptedFiles(){return this.files.filter(function(file){return file.accepted;}).map(function(file){return file;});}},{key:"getRejectedFiles",value:function getRejectedFiles(){return this.files.filter(function(file){return!file.accepted;}).map(function(file){return file;});}},{key:"getFilesWithStatus",value:function getFilesWithStatus(status){return this.files.filter(function(file){return file.status===status;}).map(function(file){return file;});}},{key:"getQueuedFiles",value:function getQueuedFiles(){return this.getFilesWithStatus(Dropzone.QUEUED);}},{key:"getUploadingFiles",value:function getUploadingFiles(){return this.getFilesWithStatus(Dropzone.UPLOADING);}},{key:"getAddedFiles",value:function getAddedFiles(){return this.getFilesWithStatus(Dropzone.ADDED);}},{key:"getActiveFiles",value:function getActiveFiles(){return this.files.filter(function(file){return file.status===Dropzone.UPLOADING||file.status===Dropzone.QUEUED;}).map(function(file){return file;});}},{key:"init",value:function init(){var _this3=this;if(this.element.tagName==="form"){this.element.setAttribute("enctype","multipart/form-data");}
if(this.element.classList.contains("dropzone")&&!this.element.querySelector(".dz-message")){this.element.appendChild(Dropzone.createElement("<div class=\"dz-default dz-message\"><span>"+this.options.dictDefaultMessage+"</span></div>"));}
if(this.clickableElements.length){var setupHiddenFileInput=function setupHiddenFileInput(){if(_this3.hiddenFileInput){_this3.hiddenFileInput.parentNode.removeChild(_this3.hiddenFileInput);}
_this3.hiddenFileInput=document.createElement("input");_this3.hiddenFileInput.setAttribute("type","file");if(_this3.options.maxFiles===null||_this3.options.maxFiles>1){_this3.hiddenFileInput.setAttribute("multiple","multiple");}
_this3.hiddenFileInput.className="dz-hidden-input";if(_this3.options.acceptedFiles!==null){_this3.hiddenFileInput.setAttribute("accept",_this3.options.acceptedFiles);}
if(_this3.options.capture!==null){_this3.hiddenFileInput.setAttribute("capture",_this3.options.capture);}
_this3.hiddenFileInput.style.visibility="hidden";_this3.hiddenFileInput.style.position="absolute";_this3.hiddenFileInput.style.top="0";_this3.hiddenFileInput.style.left="0";_this3.hiddenFileInput.style.height="0";_this3.hiddenFileInput.style.width="0";Dropzone.getElement(_this3.options.hiddenInputContainer,'hiddenInputContainer').appendChild(_this3.hiddenFileInput);return _this3.hiddenFileInput.addEventListener("change",function(){var files=_this3.hiddenFileInput.files;if(files.length){for(var _iterator10=files,_isArray10=true,_i10=0,_iterator10=_isArray10?_iterator10:_iterator10[Symbol.iterator]();;){var _ref9;if(_isArray10){if(_i10>=_iterator10.length)break;_ref9=_iterator10[_i10++];}else{_i10=_iterator10.next();if(_i10.done)break;_ref9=_i10.value;}
var file=_ref9;_this3.addFile(file);}}
_this3.emit("addedfiles",files);return setupHiddenFileInput();});};setupHiddenFileInput();}
this.URL=window.URL!==null?window.URL:window.webkitURL;for(var _iterator11=this.events,_isArray11=true,_i11=0,_iterator11=_isArray11?_iterator11:_iterator11[Symbol.iterator]();;){var _ref10;if(_isArray11){if(_i11>=_iterator11.length)break;_ref10=_iterator11[_i11++];}else{_i11=_iterator11.next();if(_i11.done)break;_ref10=_i11.value;}
var eventName=_ref10;this.on(eventName,this.options[eventName]);}
this.on("uploadprogress",function(){return _this3.updateTotalUploadProgress();});this.on("removedfile",function(){return _this3.updateTotalUploadProgress();});this.on("canceled",function(file){return _this3.emit("complete",file);});this.on("complete",function(file){if(_this3.getAddedFiles().length===0&&_this3.getUploadingFiles().length===0&&_this3.getQueuedFiles().length===0){return setTimeout(function(){return _this3.emit("queuecomplete");},0);}});var noPropagation=function noPropagation(e){e.stopPropagation();if(e.preventDefault){return e.preventDefault();}else{return e.returnValue=false;}};this.listeners=[{element:this.element,events:{"dragstart":function dragstart(e){return _this3.emit("dragstart",e);},"dragenter":function dragenter(e){noPropagation(e);return _this3.emit("dragenter",e);},"dragover":function dragover(e){var efct=void 0;try{efct=e.dataTransfer.effectAllowed;}catch(error){}
e.dataTransfer.dropEffect='move'===efct||'linkMove'===efct?'move':'copy';noPropagation(e);return _this3.emit("dragover",e);},"dragleave":function dragleave(e){return _this3.emit("dragleave",e);},"drop":function drop(e){noPropagation(e);return _this3.drop(e);},"dragend":function dragend(e){return _this3.emit("dragend",e);}}}];this.clickableElements.forEach(function(clickableElement){return _this3.listeners.push({element:clickableElement,events:{"click":function click(evt){if(clickableElement!==_this3.element||evt.target===_this3.element||Dropzone.elementInside(evt.target,_this3.element.querySelector(".dz-message"))){_this3.hiddenFileInput.click();}
return true;}}});});this.enable();return this.options.init.call(this);}},{key:"destroy",value:function destroy(){this.disable();this.removeAllFiles(true);if(this.hiddenFileInput!=null?this.hiddenFileInput.parentNode:undefined){this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput);this.hiddenFileInput=null;}
delete this.element.dropzone;return Dropzone.instances.splice(Dropzone.instances.indexOf(this),1);}},{key:"updateTotalUploadProgress",value:function updateTotalUploadProgress(){var totalUploadProgress=void 0;var totalBytesSent=0;var totalBytes=0;var activeFiles=this.getActiveFiles();if(activeFiles.length){for(var _iterator12=this.getActiveFiles(),_isArray12=true,_i12=0,_iterator12=_isArray12?_iterator12:_iterator12[Symbol.iterator]();;){var _ref11;if(_isArray12){if(_i12>=_iterator12.length)break;_ref11=_iterator12[_i12++];}else{_i12=_iterator12.next();if(_i12.done)break;_ref11=_i12.value;}
var file=_ref11;totalBytesSent+=file.upload.bytesSent;totalBytes+=file.upload.total;}
totalUploadProgress=100*totalBytesSent/totalBytes;}else{totalUploadProgress=100;}
return this.emit("totaluploadprogress",totalUploadProgress,totalBytes,totalBytesSent);}},{key:"_getParamName",value:function _getParamName(n){if(typeof this.options.paramName==="function"){return this.options.paramName(n);}else{return""+this.options.paramName+(this.options.uploadMultiple?"["+n+"]":"");}}},{key:"_renameFile",value:function _renameFile(file){if(typeof this.options.renameFile!=="function"){return file.name;}
return this.options.renameFile(file);}},{key:"getFallbackForm",value:function getFallbackForm(){var existingFallback=void 0,form=void 0;if(existingFallback=this.getExistingFallback()){return existingFallback;}
var fieldsString="<div class=\"dz-fallback\">";if(this.options.dictFallbackText){fieldsString+="<p>"+this.options.dictFallbackText+"</p>";}
fieldsString+="<input type=\"file\" name=\""+this._getParamName(0)+"\" "+(this.options.uploadMultiple?'multiple="multiple"':undefined)+" /><input type=\"submit\" value=\"Upload!\"></div>";var fields=Dropzone.createElement(fieldsString);if(this.element.tagName!=="FORM"){form=Dropzone.createElement("<form action=\""+this.options.url+"\" enctype=\"multipart/form-data\" method=\""+this.options.method+"\"></form>");form.appendChild(fields);}else{this.element.setAttribute("enctype","multipart/form-data");this.element.setAttribute("method",this.options.method);}
return form!=null?form:fields;}},{key:"getExistingFallback",value:function getExistingFallback(){var getFallback=function getFallback(elements){for(var _iterator13=elements,_isArray13=true,_i13=0,_iterator13=_isArray13?_iterator13:_iterator13[Symbol.iterator]();;){var _ref12;if(_isArray13){if(_i13>=_iterator13.length)break;_ref12=_iterator13[_i13++];}else{_i13=_iterator13.next();if(_i13.done)break;_ref12=_i13.value;}
var el=_ref12;if(/(^| )fallback($| )/.test(el.className)){return el;}}};var _arr=["div","form"];for(var _i14=0;_i14<_arr.length;_i14++){var tagName=_arr[_i14];var fallback;if(fallback=getFallback(this.element.getElementsByTagName(tagName))){return fallback;}}}},{key:"setupEventListeners",value:function setupEventListeners(){return this.listeners.map(function(elementListeners){return function(){var result=[];for(var event in elementListeners.events){var listener=elementListeners.events[event];result.push(elementListeners.element.addEventListener(event,listener,false));}
return result;}();});}},{key:"removeEventListeners",value:function removeEventListeners(){return this.listeners.map(function(elementListeners){return function(){var result=[];for(var event in elementListeners.events){var listener=elementListeners.events[event];result.push(elementListeners.element.removeEventListener(event,listener,false));}
return result;}();});}},{key:"disable",value:function disable(){var _this4=this;this.clickableElements.forEach(function(element){return element.classList.remove("dz-clickable");});this.removeEventListeners();this.disabled=true;return this.files.map(function(file){return _this4.cancelUpload(file);});}},{key:"enable",value:function enable(){delete this.disabled;this.clickableElements.forEach(function(element){return element.classList.add("dz-clickable");});return this.setupEventListeners();}},{key:"filesize",value:function filesize(size){var selectedSize=0;var selectedUnit="b";if(size>0){var units=['tb','gb','mb','kb','b'];for(var i=0;i<units.length;i++){var unit=units[i];var cutoff=Math.pow(this.options.filesizeBase,4-i)/10;if(size>=cutoff){selectedSize=size/Math.pow(this.options.filesizeBase,4-i);selectedUnit=unit;break;}}
selectedSize=Math.round(10*selectedSize)/10;}
return"<strong>"+selectedSize+"</strong> "+this.options.dictFileSizeUnits[selectedUnit];}},{key:"_updateMaxFilesReachedClass",value:function _updateMaxFilesReachedClass(){if(this.options.maxFiles!=null&&this.getAcceptedFiles().length>=this.options.maxFiles){if(this.getAcceptedFiles().length===this.options.maxFiles){this.emit('maxfilesreached',this.files);}
return this.element.classList.add("dz-max-files-reached");}else{return this.element.classList.remove("dz-max-files-reached");}}},{key:"drop",value:function drop(e){if(!e.dataTransfer){return;}
this.emit("drop",e);var files=[];for(var i=0;i<e.dataTransfer.files.length;i++){files[i]=e.dataTransfer.files[i];}
this.emit("addedfiles",files);if(files.length){var items=e.dataTransfer.items;if(items&&items.length&&items[0].webkitGetAsEntry!=null){this._addFilesFromItems(items);}else{this.handleFiles(files);}}}},{key:"paste",value:function paste(e){if(__guard__(e!=null?e.clipboardData:undefined,function(x){return x.items;})==null){return;}
this.emit("paste",e);var items=e.clipboardData.items;if(items.length){return this._addFilesFromItems(items);}}},{key:"handleFiles",value:function handleFiles(files){for(var _iterator14=files,_isArray14=true,_i15=0,_iterator14=_isArray14?_iterator14:_iterator14[Symbol.iterator]();;){var _ref13;if(_isArray14){if(_i15>=_iterator14.length)break;_ref13=_iterator14[_i15++];}else{_i15=_iterator14.next();if(_i15.done)break;_ref13=_i15.value;}
var file=_ref13;this.addFile(file);}}},{key:"_addFilesFromItems",value:function _addFilesFromItems(items){var _this5=this;return function(){var result=[];for(var _iterator15=items,_isArray15=true,_i16=0,_iterator15=_isArray15?_iterator15:_iterator15[Symbol.iterator]();;){var _ref14;if(_isArray15){if(_i16>=_iterator15.length)break;_ref14=_iterator15[_i16++];}else{_i16=_iterator15.next();if(_i16.done)break;_ref14=_i16.value;}
var item=_ref14;var entry;if(item.webkitGetAsEntry!=null&&(entry=item.webkitGetAsEntry())){if(entry.isFile){result.push(_this5.addFile(item.getAsFile()));}else if(entry.isDirectory){result.push(_this5._addFilesFromDirectory(entry,entry.name));}else{result.push(undefined);}}else if(item.getAsFile!=null){if(item.kind==null||item.kind==="file"){result.push(_this5.addFile(item.getAsFile()));}else{result.push(undefined);}}else{result.push(undefined);}}
return result;}();}},{key:"_addFilesFromDirectory",value:function _addFilesFromDirectory(directory,path){var _this6=this;var dirReader=directory.createReader();var errorHandler=function errorHandler(error){return __guardMethod__(console,'log',function(o){return o.log(error);});};var readEntries=function readEntries(){return dirReader.readEntries(function(entries){if(entries.length>0){for(var _iterator16=entries,_isArray16=true,_i17=0,_iterator16=_isArray16?_iterator16:_iterator16[Symbol.iterator]();;){var _ref15;if(_isArray16){if(_i17>=_iterator16.length)break;_ref15=_iterator16[_i17++];}else{_i17=_iterator16.next();if(_i17.done)break;_ref15=_i17.value;}
var entry=_ref15;if(entry.isFile){entry.file(function(file){if(_this6.options.ignoreHiddenFiles&&file.name.substring(0,1)==='.'){return;}
file.fullPath=path+"/"+file.name;return _this6.addFile(file);});}else if(entry.isDirectory){_this6._addFilesFromDirectory(entry,path+"/"+entry.name);}}
readEntries();}
return null;},errorHandler);};return readEntries();}},{key:"accept",value:function accept(file,done){if(this.options.maxFilesize&&file.size>this.options.maxFilesize*1024*1024){return done(this.options.dictFileTooBig.replace("{{filesize}}",Math.round(file.size/1024/10.24)/100).replace("{{maxFilesize}}",this.options.maxFilesize));}else if(!Dropzone.isValidFile(file,this.options.acceptedFiles)){return done(this.options.dictInvalidFileType);}else if(this.options.maxFiles!=null&&this.getAcceptedFiles().length>=this.options.maxFiles){done(this.options.dictMaxFilesExceeded.replace("{{maxFiles}}",this.options.maxFiles));return this.emit("maxfilesexceeded",file);}else{return this.options.accept.call(this,file,done);}}},{key:"addFile",value:function addFile(file){var _this7=this;file.upload={uuid:Dropzone.uuidv4(),progress:0,total:file.size,bytesSent:0,filename:this._renameFile(file),chunked:this.options.chunking&&(this.options.forceChunking||file.size>this.options.chunkSize),totalChunkCount:Math.ceil(file.size/this.options.chunkSize)};this.files.push(file);file.status=Dropzone.ADDED;this.emit("addedfile",file);this._enqueueThumbnail(file);return this.accept(file,function(error){if(error){file.accepted=false;_this7._errorProcessing([file],error);}else{file.accepted=true;if(_this7.options.autoQueue){_this7.enqueueFile(file);}}
return _this7._updateMaxFilesReachedClass();});}},{key:"enqueueFiles",value:function enqueueFiles(files){for(var _iterator17=files,_isArray17=true,_i18=0,_iterator17=_isArray17?_iterator17:_iterator17[Symbol.iterator]();;){var _ref16;if(_isArray17){if(_i18>=_iterator17.length)break;_ref16=_iterator17[_i18++];}else{_i18=_iterator17.next();if(_i18.done)break;_ref16=_i18.value;}
var file=_ref16;this.enqueueFile(file);}
return null;}},{key:"enqueueFile",value:function enqueueFile(file){var _this8=this;if(file.status===Dropzone.ADDED&&file.accepted===true){file.status=Dropzone.QUEUED;if(this.options.autoProcessQueue){return setTimeout(function(){return _this8.processQueue();},0);}}else{throw new Error("This file can't be queued because it has already been processed or was rejected.");}}},{key:"_enqueueThumbnail",value:function _enqueueThumbnail(file){var _this9=this;if(this.options.createImageThumbnails&&file.type.match(/image.*/)&&file.size<=this.options.maxThumbnailFilesize*1024*1024){this._thumbnailQueue.push(file);return setTimeout(function(){return _this9._processThumbnailQueue();},0);}}},{key:"_processThumbnailQueue",value:function _processThumbnailQueue(){var _this10=this;if(this._processingThumbnail||this._thumbnailQueue.length===0){return;}
this._processingThumbnail=true;var file=this._thumbnailQueue.shift();return this.createThumbnail(file,this.options.thumbnailWidth,this.options.thumbnailHeight,this.options.thumbnailMethod,true,function(dataUrl){_this10.emit("thumbnail",file,dataUrl);_this10._processingThumbnail=false;return _this10._processThumbnailQueue();});}},{key:"removeFile",value:function removeFile(file){if(file.status===Dropzone.UPLOADING){this.cancelUpload(file);}
this.files=without(this.files,file);this.emit("removedfile",file);if(this.files.length===0){return this.emit("reset");}}},{key:"removeAllFiles",value:function removeAllFiles(cancelIfNecessary){if(cancelIfNecessary==null){cancelIfNecessary=false;}
for(var _iterator18=this.files.slice(),_isArray18=true,_i19=0,_iterator18=_isArray18?_iterator18:_iterator18[Symbol.iterator]();;){var _ref17;if(_isArray18){if(_i19>=_iterator18.length)break;_ref17=_iterator18[_i19++];}else{_i19=_iterator18.next();if(_i19.done)break;_ref17=_i19.value;}
var file=_ref17;if(file.status!==Dropzone.UPLOADING||cancelIfNecessary){this.removeFile(file);}}
return null;}},{key:"resizeImage",value:function resizeImage(file,width,height,resizeMethod,callback){var _this11=this;return this.createThumbnail(file,width,height,resizeMethod,true,function(dataUrl,canvas){if(canvas==null){return callback(file);}else{var resizeMimeType=_this11.options.resizeMimeType;if(resizeMimeType==null){resizeMimeType=file.type;}
var resizedDataURL=canvas.toDataURL(resizeMimeType,_this11.options.resizeQuality);if(resizeMimeType==='image/jpeg'||resizeMimeType==='image/jpg'){resizedDataURL=ExifRestore.restore(file.dataURL,resizedDataURL);}
return callback(Dropzone.dataURItoBlob(resizedDataURL));}});}},{key:"createThumbnail",value:function createThumbnail(file,width,height,resizeMethod,fixOrientation,callback){var _this12=this;var fileReader=new FileReader();fileReader.onload=function(){file.dataURL=fileReader.result;if(file.type==="image/svg+xml"){if(callback!=null){callback(fileReader.result);}
return;}
return _this12.createThumbnailFromUrl(file,width,height,resizeMethod,fixOrientation,callback);};return fileReader.readAsDataURL(file);}},{key:"createThumbnailFromUrl",value:function createThumbnailFromUrl(file,width,height,resizeMethod,fixOrientation,callback,crossOrigin){var _this13=this;var img=document.createElement("img");if(crossOrigin){img.crossOrigin=crossOrigin;}
img.onload=function(){var loadExif=function loadExif(callback){return callback(1);};if(typeof EXIF!=='undefined'&&EXIF!==null&&fixOrientation){loadExif=function loadExif(callback){return EXIF.getData(img,function(){return callback(EXIF.getTag(this,'Orientation'));});};}
return loadExif(function(orientation){file.width=img.width;file.height=img.height;var resizeInfo=_this13.options.resize.call(_this13,file,width,height,resizeMethod);var canvas=document.createElement("canvas");var ctx=canvas.getContext("2d");canvas.width=resizeInfo.trgWidth;canvas.height=resizeInfo.trgHeight;if(orientation>4){canvas.width=resizeInfo.trgHeight;canvas.height=resizeInfo.trgWidth;}
switch(orientation){case 2:ctx.translate(canvas.width,0);ctx.scale(-1,1);break;case 3:ctx.translate(canvas.width,canvas.height);ctx.rotate(Math.PI);break;case 4:ctx.translate(0,canvas.height);ctx.scale(1,-1);break;case 5:ctx.rotate(0.5*Math.PI);ctx.scale(1,-1);break;case 6:ctx.rotate(0.5*Math.PI);ctx.translate(0,-canvas.width);break;case 7:ctx.rotate(0.5*Math.PI);ctx.translate(canvas.height,-canvas.width);ctx.scale(-1,1);break;case 8:ctx.rotate(-0.5*Math.PI);ctx.translate(-canvas.height,0);break;}
drawImageIOSFix(ctx,img,resizeInfo.srcX!=null?resizeInfo.srcX:0,resizeInfo.srcY!=null?resizeInfo.srcY:0,resizeInfo.srcWidth,resizeInfo.srcHeight,resizeInfo.trgX!=null?resizeInfo.trgX:0,resizeInfo.trgY!=null?resizeInfo.trgY:0,resizeInfo.trgWidth,resizeInfo.trgHeight);var thumbnail=canvas.toDataURL("image/png");if(callback!=null){return callback(thumbnail,canvas);}});};if(callback!=null){img.onerror=callback;}
return img.src=file.dataURL;}},{key:"processQueue",value:function processQueue(){var parallelUploads=this.options.parallelUploads;var processingLength=this.getUploadingFiles().length;var i=processingLength;if(processingLength>=parallelUploads){return;}
var queuedFiles=this.getQueuedFiles();if(!(queuedFiles.length>0)){return;}
if(this.options.uploadMultiple){return this.processFiles(queuedFiles.slice(0,parallelUploads-processingLength));}else{while(i<parallelUploads){if(!queuedFiles.length){return;}
this.processFile(queuedFiles.shift());i++;}}}},{key:"processFile",value:function processFile(file){return this.processFiles([file]);}},{key:"processFiles",value:function processFiles(files){for(var _iterator19=files,_isArray19=true,_i20=0,_iterator19=_isArray19?_iterator19:_iterator19[Symbol.iterator]();;){var _ref18;if(_isArray19){if(_i20>=_iterator19.length)break;_ref18=_iterator19[_i20++];}else{_i20=_iterator19.next();if(_i20.done)break;_ref18=_i20.value;}
var file=_ref18;file.processing=true;file.status=Dropzone.UPLOADING;this.emit("processing",file);}
if(this.options.uploadMultiple){this.emit("processingmultiple",files);}
return this.uploadFiles(files);}},{key:"_getFilesWithXhr",value:function _getFilesWithXhr(xhr){var files=void 0;return files=this.files.filter(function(file){return file.xhr===xhr;}).map(function(file){return file;});}},{key:"cancelUpload",value:function cancelUpload(file){if(file.status===Dropzone.UPLOADING){var groupedFiles=this._getFilesWithXhr(file.xhr);for(var _iterator20=groupedFiles,_isArray20=true,_i21=0,_iterator20=_isArray20?_iterator20:_iterator20[Symbol.iterator]();;){var _ref19;if(_isArray20){if(_i21>=_iterator20.length)break;_ref19=_iterator20[_i21++];}else{_i21=_iterator20.next();if(_i21.done)break;_ref19=_i21.value;}
var groupedFile=_ref19;groupedFile.status=Dropzone.CANCELED;}
if(typeof file.xhr!=='undefined'){file.xhr.abort();}
for(var _iterator21=groupedFiles,_isArray21=true,_i22=0,_iterator21=_isArray21?_iterator21:_iterator21[Symbol.iterator]();;){var _ref20;if(_isArray21){if(_i22>=_iterator21.length)break;_ref20=_iterator21[_i22++];}else{_i22=_iterator21.next();if(_i22.done)break;_ref20=_i22.value;}
var _groupedFile=_ref20;this.emit("canceled",_groupedFile);}
if(this.options.uploadMultiple){this.emit("canceledmultiple",groupedFiles);}}else if(file.status===Dropzone.ADDED||file.status===Dropzone.QUEUED){file.status=Dropzone.CANCELED;this.emit("canceled",file);if(this.options.uploadMultiple){this.emit("canceledmultiple",[file]);}}
if(this.options.autoProcessQueue){return this.processQueue();}}},{key:"resolveOption",value:function resolveOption(option){if(typeof option==='function'){for(var _len3=arguments.length,args=Array(_len3>1?_len3-1:0),_key3=1;_key3<_len3;_key3++){args[_key3-1]=arguments[_key3];}
return option.apply(this,args);}
return option;}},{key:"uploadFile",value:function uploadFile(file){return this.uploadFiles([file]);}},{key:"uploadFiles",value:function uploadFiles(files){var _this14=this;this._transformFiles(files,function(transformedFiles){if(files[0].upload.chunked){var file=files[0];var transformedFile=transformedFiles[0];var startedChunkCount=0;file.upload.chunks=[];var handleNextChunk=function handleNextChunk(){var chunkIndex=0;while(file.upload.chunks[chunkIndex]!==undefined){chunkIndex++;}
if(chunkIndex>=file.upload.totalChunkCount)return;startedChunkCount++;var start=chunkIndex*_this14.options.chunkSize;var end=Math.min(start+_this14.options.chunkSize,file.size);var dataBlock={name:_this14._getParamName(0),data:transformedFile.webkitSlice?transformedFile.webkitSlice(start,end):transformedFile.slice(start,end),filename:file.upload.filename,chunkIndex:chunkIndex};file.upload.chunks[chunkIndex]={file:file,index:chunkIndex,dataBlock:dataBlock,status:Dropzone.UPLOADING,progress:0,retries:0};_this14._uploadData(files,[dataBlock]);};file.upload.finishedChunkUpload=function(chunk){var allFinished=true;chunk.status=Dropzone.SUCCESS;chunk.dataBlock=null;chunk.xhr=null;for(var i=0;i<file.upload.totalChunkCount;i++){if(file.upload.chunks[i]===undefined){return handleNextChunk();}
if(file.upload.chunks[i].status!==Dropzone.SUCCESS){allFinished=false;}}
if(allFinished){_this14.options.chunksUploaded(file,function(){_this14._finished(files,'',null);});}};if(_this14.options.parallelChunkUploads){for(var i=0;i<file.upload.totalChunkCount;i++){handleNextChunk();}}else{handleNextChunk();}}else{var dataBlocks=[];for(var _i23=0;_i23<files.length;_i23++){dataBlocks[_i23]={name:_this14._getParamName(_i23),data:transformedFiles[_i23],filename:files[_i23].upload.filename};}
_this14._uploadData(files,dataBlocks);}});}},{key:"_getChunk",value:function _getChunk(file,xhr){for(var i=0;i<file.upload.totalChunkCount;i++){if(file.upload.chunks[i]!==undefined&&file.upload.chunks[i].xhr===xhr){return file.upload.chunks[i];}}}},{key:"_uploadData",value:function _uploadData(files,dataBlocks){var _this15=this;var xhr=new XMLHttpRequest();for(var _iterator22=files,_isArray22=true,_i24=0,_iterator22=_isArray22?_iterator22:_iterator22[Symbol.iterator]();;){var _ref21;if(_isArray22){if(_i24>=_iterator22.length)break;_ref21=_iterator22[_i24++];}else{_i24=_iterator22.next();if(_i24.done)break;_ref21=_i24.value;}
var file=_ref21;file.xhr=xhr;}
if(files[0].upload.chunked){files[0].upload.chunks[dataBlocks[0].chunkIndex].xhr=xhr;}
var method=this.resolveOption(this.options.method,files);var url=this.resolveOption(this.options.url,files);xhr.open(method,url,true);xhr.timeout=this.resolveOption(this.options.timeout,files);xhr.withCredentials=!!this.options.withCredentials;xhr.onload=function(e){_this15._finishedUploading(files,xhr,e);};xhr.onerror=function(){_this15._handleUploadError(files,xhr);};var progressObj=xhr.upload!=null?xhr.upload:xhr;progressObj.onprogress=function(e){return _this15._updateFilesUploadProgress(files,xhr,e);};var headers={"Accept":"application/json","Cache-Control":"no-cache","X-Requested-With":"XMLHttpRequest"};if(this.options.headers){Dropzone.extend(headers,this.options.headers);}
for(var headerName in headers){var headerValue=headers[headerName];if(headerValue){xhr.setRequestHeader(headerName,headerValue);}}
var formData=new FormData();if(this.options.params){var additionalParams=this.options.params;if(typeof additionalParams==='function'){additionalParams=additionalParams.call(this,files,xhr,files[0].upload.chunked?this._getChunk(files[0],xhr):null);}
for(var key in additionalParams){var value=additionalParams[key];formData.append(key,value);}}
for(var _iterator23=files,_isArray23=true,_i25=0,_iterator23=_isArray23?_iterator23:_iterator23[Symbol.iterator]();;){var _ref22;if(_isArray23){if(_i25>=_iterator23.length)break;_ref22=_iterator23[_i25++];}else{_i25=_iterator23.next();if(_i25.done)break;_ref22=_i25.value;}
var _file=_ref22;this.emit("sending",_file,xhr,formData);}
if(this.options.uploadMultiple){this.emit("sendingmultiple",files,xhr,formData);}
this._addFormElementData(formData);for(var i=0;i<dataBlocks.length;i++){var dataBlock=dataBlocks[i];formData.append(dataBlock.name,dataBlock.data,dataBlock.filename);}
this.submitRequest(xhr,formData,files);}},{key:"_transformFiles",value:function _transformFiles(files,done){var _this16=this;var transformedFiles=[];var doneCounter=0;var _loop=function _loop(i){_this16.options.transformFile.call(_this16,files[i],function(transformedFile){transformedFiles[i]=transformedFile;if(++doneCounter===files.length){done(transformedFiles);}});};for(var i=0;i<files.length;i++){_loop(i);}}},{key:"_addFormElementData",value:function _addFormElementData(formData){if(this.element.tagName==="FORM"){for(var _iterator24=this.element.querySelectorAll("input, textarea, select, button"),_isArray24=true,_i26=0,_iterator24=_isArray24?_iterator24:_iterator24[Symbol.iterator]();;){var _ref23;if(_isArray24){if(_i26>=_iterator24.length)break;_ref23=_iterator24[_i26++];}else{_i26=_iterator24.next();if(_i26.done)break;_ref23=_i26.value;}
var input=_ref23;var inputName=input.getAttribute("name");var inputType=input.getAttribute("type");if(inputType)inputType=inputType.toLowerCase();if(typeof inputName==='undefined'||inputName===null)continue;if(input.tagName==="SELECT"&&input.hasAttribute("multiple")){for(var _iterator25=input.options,_isArray25=true,_i27=0,_iterator25=_isArray25?_iterator25:_iterator25[Symbol.iterator]();;){var _ref24;if(_isArray25){if(_i27>=_iterator25.length)break;_ref24=_iterator25[_i27++];}else{_i27=_iterator25.next();if(_i27.done)break;_ref24=_i27.value;}
var option=_ref24;if(option.selected){formData.append(inputName,option.value);}}}else if(!inputType||inputType!=="checkbox"&&inputType!=="radio"||input.checked){formData.append(inputName,input.value);}}}}},{key:"_updateFilesUploadProgress",value:function _updateFilesUploadProgress(files,xhr,e){var progress=void 0;if(typeof e!=='undefined'){progress=100*e.loaded/e.total;if(files[0].upload.chunked){var file=files[0];var chunk=this._getChunk(file,xhr);chunk.progress=progress;chunk.total=e.total;chunk.bytesSent=e.loaded;var fileProgress=0,fileTotal=void 0,fileBytesSent=void 0;file.upload.progress=0;file.upload.total=0;file.upload.bytesSent=0;for(var i=0;i<file.upload.totalChunkCount;i++){if(file.upload.chunks[i]!==undefined&&file.upload.chunks[i].progress!==undefined){file.upload.progress+=file.upload.chunks[i].progress;file.upload.total+=file.upload.chunks[i].total;file.upload.bytesSent+=file.upload.chunks[i].bytesSent;}}
file.upload.progress=file.upload.progress/file.upload.totalChunkCount;}else{for(var _iterator26=files,_isArray26=true,_i28=0,_iterator26=_isArray26?_iterator26:_iterator26[Symbol.iterator]();;){var _ref25;if(_isArray26){if(_i28>=_iterator26.length)break;_ref25=_iterator26[_i28++];}else{_i28=_iterator26.next();if(_i28.done)break;_ref25=_i28.value;}
var _file2=_ref25;_file2.upload.progress=progress;_file2.upload.total=e.total;_file2.upload.bytesSent=e.loaded;}}
for(var _iterator27=files,_isArray27=true,_i29=0,_iterator27=_isArray27?_iterator27:_iterator27[Symbol.iterator]();;){var _ref26;if(_isArray27){if(_i29>=_iterator27.length)break;_ref26=_iterator27[_i29++];}else{_i29=_iterator27.next();if(_i29.done)break;_ref26=_i29.value;}
var _file3=_ref26;this.emit("uploadprogress",_file3,_file3.upload.progress,_file3.upload.bytesSent);}}else{var allFilesFinished=true;progress=100;for(var _iterator28=files,_isArray28=true,_i30=0,_iterator28=_isArray28?_iterator28:_iterator28[Symbol.iterator]();;){var _ref27;if(_isArray28){if(_i30>=_iterator28.length)break;_ref27=_iterator28[_i30++];}else{_i30=_iterator28.next();if(_i30.done)break;_ref27=_i30.value;}
var _file4=_ref27;if(_file4.upload.progress!==100||_file4.upload.bytesSent!==_file4.upload.total){allFilesFinished=false;}
_file4.upload.progress=progress;_file4.upload.bytesSent=_file4.upload.total;}
if(allFilesFinished){return;}
for(var _iterator29=files,_isArray29=true,_i31=0,_iterator29=_isArray29?_iterator29:_iterator29[Symbol.iterator]();;){var _ref28;if(_isArray29){if(_i31>=_iterator29.length)break;_ref28=_iterator29[_i31++];}else{_i31=_iterator29.next();if(_i31.done)break;_ref28=_i31.value;}
var _file5=_ref28;this.emit("uploadprogress",_file5,progress,_file5.upload.bytesSent);}}}},{key:"_finishedUploading",value:function _finishedUploading(files,xhr,e){var response=void 0;if(files[0].status===Dropzone.CANCELED){return;}
if(xhr.readyState!==4){return;}
if(xhr.responseType!=='arraybuffer'&&xhr.responseType!=='blob'){response=xhr.responseText;if(xhr.getResponseHeader("content-type")&&~xhr.getResponseHeader("content-type").indexOf("application/json")){try{response=JSON.parse(response);}catch(error){e=error;response="Invalid JSON response from server.";}}}
this._updateFilesUploadProgress(files);if(!(200<=xhr.status&&xhr.status<300)){this._handleUploadError(files,xhr,response);}else{if(files[0].upload.chunked){files[0].upload.finishedChunkUpload(this._getChunk(files[0],xhr));}else{this._finished(files,response,e);}}}},{key:"_handleUploadError",value:function _handleUploadError(files,xhr,response){if(files[0].status===Dropzone.CANCELED){return;}
if(files[0].upload.chunked&&this.options.retryChunks){var chunk=this._getChunk(files[0],xhr);if(chunk.retries++<this.options.retryChunksLimit){this._uploadData(files,[chunk.dataBlock]);return;}else{console.warn('Retried this chunk too often. Giving up.');}}
for(var _iterator30=files,_isArray30=true,_i32=0,_iterator30=_isArray30?_iterator30:_iterator30[Symbol.iterator]();;){var _ref29;if(_isArray30){if(_i32>=_iterator30.length)break;_ref29=_iterator30[_i32++];}else{_i32=_iterator30.next();if(_i32.done)break;_ref29=_i32.value;}
var file=_ref29;this._errorProcessing(files,response||this.options.dictResponseError.replace("{{statusCode}}",xhr.status),xhr);}}},{key:"submitRequest",value:function submitRequest(xhr,formData,files){xhr.send(formData);}},{key:"_finished",value:function _finished(files,responseText,e){for(var _iterator31=files,_isArray31=true,_i33=0,_iterator31=_isArray31?_iterator31:_iterator31[Symbol.iterator]();;){var _ref30;if(_isArray31){if(_i33>=_iterator31.length)break;_ref30=_iterator31[_i33++];}else{_i33=_iterator31.next();if(_i33.done)break;_ref30=_i33.value;}
var file=_ref30;file.status=Dropzone.SUCCESS;this.emit("success",file,responseText,e);this.emit("complete",file);}
if(this.options.uploadMultiple){this.emit("successmultiple",files,responseText,e);this.emit("completemultiple",files);}
if(this.options.autoProcessQueue){return this.processQueue();}}},{key:"_errorProcessing",value:function _errorProcessing(files,message,xhr){for(var _iterator32=files,_isArray32=true,_i34=0,_iterator32=_isArray32?_iterator32:_iterator32[Symbol.iterator]();;){var _ref31;if(_isArray32){if(_i34>=_iterator32.length)break;_ref31=_iterator32[_i34++];}else{_i34=_iterator32.next();if(_i34.done)break;_ref31=_i34.value;}
var file=_ref31;file.status=Dropzone.ERROR;this.emit("error",file,message,xhr);this.emit("complete",file);}
if(this.options.uploadMultiple){this.emit("errormultiple",files,message,xhr);this.emit("completemultiple",files);}
if(this.options.autoProcessQueue){return this.processQueue();}}}],[{key:"uuidv4",value:function uuidv4(){return'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){var r=Math.random()*16|0,v=c==='x'?r:r&0x3|0x8;return v.toString(16);});}}]);return Dropzone;}(Emitter);Dropzone.initClass();Dropzone.version="5.5.1";Dropzone.options={};Dropzone.optionsForElement=function(element){if(element.getAttribute("id")){return Dropzone.options[camelize(element.getAttribute("id"))];}else{return undefined;}};Dropzone.instances=[];Dropzone.forElement=function(element){if(typeof element==="string"){element=document.querySelector(element);}
if((element!=null?element.dropzone:undefined)==null){throw new Error("No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone.");}
return element.dropzone;};Dropzone.autoDiscover=true;Dropzone.discover=function(){var dropzones=void 0;if(document.querySelectorAll){dropzones=document.querySelectorAll(".dropzone");}else{dropzones=[];var checkElements=function checkElements(elements){return function(){var result=[];for(var _iterator33=elements,_isArray33=true,_i35=0,_iterator33=_isArray33?_iterator33:_iterator33[Symbol.iterator]();;){var _ref32;if(_isArray33){if(_i35>=_iterator33.length)break;_ref32=_iterator33[_i35++];}else{_i35=_iterator33.next();if(_i35.done)break;_ref32=_i35.value;}
var el=_ref32;if(/(^| )dropzone($| )/.test(el.className)){result.push(dropzones.push(el));}else{result.push(undefined);}}
return result;}();};checkElements(document.getElementsByTagName("div"));checkElements(document.getElementsByTagName("form"));}
return function(){var result=[];for(var _iterator34=dropzones,_isArray34=true,_i36=0,_iterator34=_isArray34?_iterator34:_iterator34[Symbol.iterator]();;){var _ref33;if(_isArray34){if(_i36>=_iterator34.length)break;_ref33=_iterator34[_i36++];}else{_i36=_iterator34.next();if(_i36.done)break;_ref33=_i36.value;}
var dropzone=_ref33;if(Dropzone.optionsForElement(dropzone)!==false){result.push(new Dropzone(dropzone));}else{result.push(undefined);}}
return result;}();};Dropzone.blacklistedBrowsers=[/opera.*(Macintosh|Windows Phone).*version\/12/i];Dropzone.isBrowserSupported=function(){var capableBrowser=true;if(window.File&&window.FileReader&&window.FileList&&window.Blob&&window.FormData&&document.querySelector){if(!("classList"in document.createElement("a"))){capableBrowser=false;}else{for(var _iterator35=Dropzone.blacklistedBrowsers,_isArray35=true,_i37=0,_iterator35=_isArray35?_iterator35:_iterator35[Symbol.iterator]();;){var _ref34;if(_isArray35){if(_i37>=_iterator35.length)break;_ref34=_iterator35[_i37++];}else{_i37=_iterator35.next();if(_i37.done)break;_ref34=_i37.value;}
var regex=_ref34;if(regex.test(navigator.userAgent)){capableBrowser=false;continue;}}}}else{capableBrowser=false;}
return capableBrowser;};Dropzone.dataURItoBlob=function(dataURI){var byteString=atob(dataURI.split(',')[1]);var mimeString=dataURI.split(',')[0].split(':')[1].split(';')[0];var ab=new ArrayBuffer(byteString.length);var ia=new Uint8Array(ab);for(var i=0,end=byteString.length,asc=0<=end;asc?i<=end:i>=end;asc?i++:i--){ia[i]=byteString.charCodeAt(i);}
return new Blob([ab],{type:mimeString});};var without=function without(list,rejectedItem){return list.filter(function(item){return item!==rejectedItem;}).map(function(item){return item;});};var camelize=function camelize(str){return str.replace(/[\-_](\w)/g,function(match){return match.charAt(1).toUpperCase();});};Dropzone.createElement=function(string){var div=document.createElement("div");div.innerHTML=string;return div.childNodes[0];};Dropzone.elementInside=function(element,container){if(element===container){return true;}
while(element=element.parentNode){if(element===container){return true;}}
return false;};Dropzone.getElement=function(el,name){var element=void 0;if(typeof el==="string"){element=document.querySelector(el);}else if(el.nodeType!=null){element=el;}
if(element==null){throw new Error("Invalid `"+name+"` option provided. Please provide a CSS selector or a plain HTML element.");}
return element;};Dropzone.getElements=function(els,name){var el=void 0,elements=void 0;if(els instanceof Array){elements=[];try{for(var _iterator36=els,_isArray36=true,_i38=0,_iterator36=_isArray36?_iterator36:_iterator36[Symbol.iterator]();;){if(_isArray36){if(_i38>=_iterator36.length)break;el=_iterator36[_i38++];}else{_i38=_iterator36.next();if(_i38.done)break;el=_i38.value;}
elements.push(this.getElement(el,name));}}catch(e){elements=null;}}else if(typeof els==="string"){elements=[];for(var _iterator37=document.querySelectorAll(els),_isArray37=true,_i39=0,_iterator37=_isArray37?_iterator37:_iterator37[Symbol.iterator]();;){if(_isArray37){if(_i39>=_iterator37.length)break;el=_iterator37[_i39++];}else{_i39=_iterator37.next();if(_i39.done)break;el=_i39.value;}
elements.push(el);}}else if(els.nodeType!=null){elements=[els];}
if(elements==null||!elements.length){throw new Error("Invalid `"+name+"` option provided. Please provide a CSS selector, a plain HTML element or a list of those.");}
return elements;};Dropzone.confirm=function(question,accepted,rejected){if(window.confirm(question)){return accepted();}else if(rejected!=null){return rejected();}};Dropzone.isValidFile=function(file,acceptedFiles){if(!acceptedFiles){return true;}
acceptedFiles=acceptedFiles.split(",");var mimeType=file.type;var baseMimeType=mimeType.replace(/\/.*$/,"");for(var _iterator38=acceptedFiles,_isArray38=true,_i40=0,_iterator38=_isArray38?_iterator38:_iterator38[Symbol.iterator]();;){var _ref35;if(_isArray38){if(_i40>=_iterator38.length)break;_ref35=_iterator38[_i40++];}else{_i40=_iterator38.next();if(_i40.done)break;_ref35=_i40.value;}
var validType=_ref35;validType=validType.trim();if(validType.charAt(0)==="."){if(file.name.toLowerCase().indexOf(validType.toLowerCase(),file.name.length-validType.length)!==-1){return true;}}else if(/\/\*$/.test(validType)){if(baseMimeType===validType.replace(/\/.*$/,"")){return true;}}else{if(mimeType===validType){return true;}}}
return false;};if(typeof jQuery!=='undefined'&&jQuery!==null){jQuery.fn.dropzone=function(options){return this.each(function(){return new Dropzone(this,options);});};}
if(typeof module!=='undefined'&&module!==null){module.exports=Dropzone;}else{window.Dropzone=Dropzone;}
Dropzone.ADDED="added";Dropzone.QUEUED="queued";Dropzone.ACCEPTED=Dropzone.QUEUED;Dropzone.UPLOADING="uploading";Dropzone.PROCESSING=Dropzone.UPLOADING;Dropzone.CANCELED="canceled";Dropzone.ERROR="error";Dropzone.SUCCESS="success";var detectVerticalSquash=function detectVerticalSquash(img){var iw=img.naturalWidth;var ih=img.naturalHeight;var canvas=document.createElement("canvas");canvas.width=1;canvas.height=ih;var ctx=canvas.getContext("2d");ctx.drawImage(img,0,0);var _ctx$getImageData=ctx.getImageData(1,0,1,ih),data=_ctx$getImageData.data;var sy=0;var ey=ih;var py=ih;while(py>sy){var alpha=data[(py-1)*4+3];if(alpha===0){ey=py;}else{sy=py;}
py=ey+sy>>1;}
var ratio=py/ih;if(ratio===0){return 1;}else{return ratio;}};var drawImageIOSFix=function drawImageIOSFix(ctx,img,sx,sy,sw,sh,dx,dy,dw,dh){var vertSquashRatio=detectVerticalSquash(img);return ctx.drawImage(img,sx,sy,sw,sh,dx,dy,dw,dh/vertSquashRatio);};var ExifRestore=function(){function ExifRestore(){_classCallCheck(this,ExifRestore);}
_createClass(ExifRestore,null,[{key:"initClass",value:function initClass(){this.KEY_STR='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';}},{key:"encode64",value:function encode64(input){var output='';var chr1=undefined;var chr2=undefined;var chr3='';var enc1=undefined;var enc2=undefined;var enc3=undefined;var enc4='';var i=0;while(true){chr1=input[i++];chr2=input[i++];chr3=input[i++];enc1=chr1>>2;enc2=(chr1&3)<<4|chr2>>4;enc3=(chr2&15)<<2|chr3>>6;enc4=chr3&63;if(isNaN(chr2)){enc3=enc4=64;}else if(isNaN(chr3)){enc4=64;}
output=output+this.KEY_STR.charAt(enc1)+this.KEY_STR.charAt(enc2)+this.KEY_STR.charAt(enc3)+this.KEY_STR.charAt(enc4);chr1=chr2=chr3='';enc1=enc2=enc3=enc4='';if(!(i<input.length)){break;}}
return output;}},{key:"restore",value:function restore(origFileBase64,resizedFileBase64){if(!origFileBase64.match('data:image/jpeg;base64,')){return resizedFileBase64;}
var rawImage=this.decode64(origFileBase64.replace('data:image/jpeg;base64,',''));var segments=this.slice2Segments(rawImage);var image=this.exifManipulation(resizedFileBase64,segments);return"data:image/jpeg;base64,"+this.encode64(image);}},{key:"exifManipulation",value:function exifManipulation(resizedFileBase64,segments){var exifArray=this.getExifArray(segments);var newImageArray=this.insertExif(resizedFileBase64,exifArray);var aBuffer=new Uint8Array(newImageArray);return aBuffer;}},{key:"getExifArray",value:function getExifArray(segments){var seg=undefined;var x=0;while(x<segments.length){seg=segments[x];if(seg[0]===255&seg[1]===225){return seg;}
x++;}
return[];}},{key:"insertExif",value:function insertExif(resizedFileBase64,exifArray){var imageData=resizedFileBase64.replace('data:image/jpeg;base64,','');var buf=this.decode64(imageData);var separatePoint=buf.indexOf(255,3);var mae=buf.slice(0,separatePoint);var ato=buf.slice(separatePoint);var array=mae;array=array.concat(exifArray);array=array.concat(ato);return array;}},{key:"slice2Segments",value:function slice2Segments(rawImageArray){var head=0;var segments=[];while(true){var length;if(rawImageArray[head]===255&rawImageArray[head+1]===218){break;}
if(rawImageArray[head]===255&rawImageArray[head+1]===216){head+=2;}else{length=rawImageArray[head+2]*256+rawImageArray[head+3];var endPoint=head+length+2;var seg=rawImageArray.slice(head,endPoint);segments.push(seg);head=endPoint;}
if(head>rawImageArray.length){break;}}
return segments;}},{key:"decode64",value:function decode64(input){var output='';var chr1=undefined;var chr2=undefined;var chr3='';var enc1=undefined;var enc2=undefined;var enc3=undefined;var enc4='';var i=0;var buf=[];var base64test=/[^A-Za-z0-9\+\/\=]/g;if(base64test.exec(input)){console.warn('There were invalid base64 characters in the input text.\nValid base64 characters are A-Z, a-z, 0-9, \'+\', \'/\',and \'=\'\nExpect errors in decoding.');}
input=input.replace(/[^A-Za-z0-9\+\/\=]/g,'');while(true){enc1=this.KEY_STR.indexOf(input.charAt(i++));enc2=this.KEY_STR.indexOf(input.charAt(i++));enc3=this.KEY_STR.indexOf(input.charAt(i++));enc4=this.KEY_STR.indexOf(input.charAt(i++));chr1=enc1<<2|enc2>>4;chr2=(enc2&15)<<4|enc3>>2;chr3=(enc3&3)<<6|enc4;buf.push(chr1);if(enc3!==64){buf.push(chr2);}
if(enc4!==64){buf.push(chr3);}
chr1=chr2=chr3='';enc1=enc2=enc3=enc4='';if(!(i<input.length)){break;}}
return buf;}}]);return ExifRestore;}();ExifRestore.initClass();var contentLoaded=function contentLoaded(win,fn){var done=false;var top=true;var doc=win.document;var root=doc.documentElement;var add=doc.addEventListener?"addEventListener":"attachEvent";var rem=doc.addEventListener?"removeEventListener":"detachEvent";var pre=doc.addEventListener?"":"on";var init=function init(e){if(e.type==="readystatechange"&&doc.readyState!=="complete"){return;}
(e.type==="load"?win:doc)[rem](pre+e.type,init,false);if(!done&&(done=true)){return fn.call(win,e.type||e);}};var poll=function poll(){try{root.doScroll("left");}catch(e){setTimeout(poll,50);return;}
return init("poll");};if(doc.readyState!=="complete"){if(doc.createEventObject&&root.doScroll){try{top=!win.frameElement;}catch(error){}
if(top){poll();}}
doc[add](pre+"DOMContentLoaded",init,false);doc[add](pre+"readystatechange",init,false);return win[add](pre+"load",init,false);}};Dropzone._autoDiscoverFunction=function(){if(Dropzone.autoDiscover){return Dropzone.discover();}};contentLoaded(window,Dropzone._autoDiscoverFunction);function __guard__(value,transform){return typeof value!=='undefined'&&value!==null?transform(value):undefined;}
function __guardMethod__(obj,methodName,transform){if(typeof obj!=='undefined'&&obj!==null&&typeof obj[methodName]==='function'){return transform(obj,methodName);}else{return undefined;}}
(function(window,document){var modalClass='.sweet-alert',overlayClass='.sweet-overlay',alertTypes=['error','warning','info','success'],defaultParams={title:'',text:'',type:null,allowOutsideClick:false,showCancelButton:false,showConfirmButton:true,closeOnConfirm:true,closeOnCancel:true,confirmButtonText:'OK',confirmButtonClass:'btn-primary',cancelButtonText:'Cancel',cancelButtonClass:'btn-default',containerClass:'',titleClass:'',textClass:'',imageUrl:null,imageSize:null,timer:null};var getModal=function(){return document.querySelector(modalClass);},getOverlay=function(){return document.querySelector(overlayClass);},hasClass=function(elem,className){return new RegExp(' '+className+' ').test(' '+elem.className+' ');},addClass=function(elem,className){if(className&&!hasClass(elem,className)){elem.className+=' '+className;}},removeClass=function(elem,className){var newClass=' '+elem.className.replace(/[\t\r\n]/g,' ')+' ';if(hasClass(elem,className)){while(newClass.indexOf(' '+className+' ')>=0){newClass=newClass.replace(' '+className+' ',' ');}
elem.className=newClass.replace(/^\s+|\s+$/g,'');}},escapeHtml=function(str){var div=document.createElement('div');div.appendChild(document.createTextNode(str));return div.innerHTML;},_show=function(elem){elem.style.opacity='';elem.style.display='block';},show=function(elems){if(elems&&!elems.length){return _show(elems);}
for(var i=0;i<elems.length;++i){_show(elems[i]);}},_hide=function(elem){elem.style.opacity='';elem.style.display='none';},hide=function(elems){if(elems&&!elems.length){return _hide(elems);}
for(var i=0;i<elems.length;++i){_hide(elems[i]);}},isDescendant=function(parent,child){var node=child.parentNode;while(node!==null){if(node===parent){return true;}
node=node.parentNode;}
return false;},getTopMargin=function(elem){elem.style.left='-9999px';elem.style.display='block';var height=elem.clientHeight;var padding=parseInt(getComputedStyle(elem).getPropertyValue('padding'),10);elem.style.left='';elem.style.display='none';return('-'+parseInt(height/2+padding)+'px');},fadeIn=function(elem,interval){if(+elem.style.opacity<1){interval=interval||16;elem.style.opacity=0;elem.style.display='block';var last=+new Date();var tick=function(){elem.style.opacity=+elem.style.opacity+(new Date()-last)/100;last=+new Date();if(+elem.style.opacity<1){setTimeout(tick,interval);}};tick();}},fadeOut=function(elem,interval){interval=interval||16;elem.style.opacity=1;var last=+new Date();var tick=function(){elem.style.opacity=+elem.style.opacity-(new Date()-last)/100;last=+new Date();if(+elem.style.opacity>0){setTimeout(tick,interval);}else{elem.style.display='none';}};tick();},fireClick=function(node){if(MouseEvent){var mevt=new MouseEvent('click',{view:window,bubbles:false,cancelable:true});node.dispatchEvent(mevt);}else if(document.createEvent){var evt=document.createEvent('MouseEvents');evt.initEvent('click',false,false);node.dispatchEvent(evt);}else if(document.createEventObject){node.fireEvent('onclick');}else if(typeof node.onclick==='function'){node.onclick();}},stopEventPropagation=function(e){if(typeof e.stopPropagation==='function'){e.stopPropagation();e.preventDefault();}else if(window.event&&window.event.hasOwnProperty('cancelBubble')){window.event.cancelBubble=true;}};var previousActiveElement,previousDocumentClick,previousWindowKeyDown,lastFocusedButton;window.sweetAlertInitialize=function(){var sweetHTML='<div class="sweet-overlay"></div><div class="sweet-alert"><div class="icon error"><span class="x-mark"><span class="line left"></span><span class="line right"></span></span></div><div class="icon warning"> <span class="body"></span> <span class="dot"></span> </div> <div class="icon info"></div> <div class="icon success"> <span class="line tip"></span> <span class="line long"></span> <div class="placeholder"></div> <div class="fix"></div> </div> <div class="icon custom"></div> <h2>Title</h2><p class="lead text-muted">Text</p><p><button class="cancel btn" tabIndex="2">Cancel</button> <button class="confirm btn" tabIndex="1">OK</button></p></div>',sweetWrap=document.createElement('div');sweetWrap.innerHTML=sweetHTML;document.body.appendChild(sweetWrap);}
window.sweetAlert=window.swal=function(){if(arguments[0]===undefined){window.console.error('sweetAlert expects at least 1 attribute!');return false;}
var params=extend({},defaultParams);switch(typeof arguments[0]){case'string':params.title=arguments[0];params.text=arguments[1]||'';params.type=arguments[2]||'';break;case'object':if(arguments[0].title===undefined){window.console.error('Missing "title" argument!');return false;}
params.title=arguments[0].title;params.text=arguments[0].text||defaultParams.text;params.type=arguments[0].type||defaultParams.type;params.allowOutsideClick=arguments[0].allowOutsideClick||defaultParams.allowOutsideClick;params.showCancelButton=arguments[0].showCancelButton!==undefined?arguments[0].showCancelButton:defaultParams.showCancelButton;params.showConfirmButton=arguments[0].showConfirmButton!==undefined?arguments[0].showConfirmButton:defaultParams.showConfirmButton;params.closeOnConfirm=arguments[0].closeOnConfirm!==undefined?arguments[0].closeOnConfirm:defaultParams.closeOnConfirm;params.closeOnCancel=arguments[0].closeOnCancel!==undefined?arguments[0].closeOnCancel:defaultParams.closeOnCancel;params.timer=arguments[0].timer||defaultParams.timer;params.confirmButtonText=(defaultParams.showCancelButton)?'Confirm':defaultParams.confirmButtonText;params.confirmButtonText=arguments[0].confirmButtonText||defaultParams.confirmButtonText;params.confirmButtonClass=arguments[0].confirmButtonClass||(arguments[0].type?'btn-'+arguments[0].type:null)||defaultParams.confirmButtonClass;params.cancelButtonText=arguments[0].cancelButtonText||defaultParams.cancelButtonText;params.cancelButtonClass=arguments[0].cancelButtonClass||defaultParams.cancelButtonClass;params.containerClass=arguments[0].containerClass||defaultParams.containerClass;params.titleClass=arguments[0].titleClass||defaultParams.titleClass;params.textClass=arguments[0].textClass||defaultParams.textClass;params.imageUrl=arguments[0].imageUrl||defaultParams.imageUrl;params.imageSize=arguments[0].imageSize||defaultParams.imageSize;params.doneFunction=arguments[1]||null;break;default:window.console.error('Unexpected type of argument! Expected "string" or "object", got '+typeof arguments[0]);return false;}
setParameters(params);fixVerticalPosition();openModal();var modal=getModal();var onButtonEvent=function(e){var target=e.target||e.srcElement,targetedConfirm=(target.className.indexOf('confirm')>-1),modalIsVisible=hasClass(modal,'visible'),doneFunctionExists=(params.doneFunction&&modal.getAttribute('data-has-done-function')==='true');switch(e.type){case("click"):if(targetedConfirm&&doneFunctionExists&&modalIsVisible){params.doneFunction(true);if(params.closeOnConfirm){closeModal();}}else if(doneFunctionExists&&modalIsVisible){var functionAsStr=String(params.doneFunction).replace(/\s/g,'');var functionHandlesCancel=functionAsStr.substring(0,9)==="function("&&functionAsStr.substring(9,10)!==")";if(functionHandlesCancel){params.doneFunction(false);}
if(params.closeOnCancel){closeModal();}}else{closeModal();}
break;}};var $buttons=modal.querySelectorAll('button');for(var i=0;i<$buttons.length;i++){$buttons[i].onclick=onButtonEvent;}
previousDocumentClick=document.onclick;document.onclick=function(e){var target=e.target||e.srcElement;var clickedOnModal=(modal===target),clickedOnModalChild=isDescendant(modal,e.target),modalIsVisible=hasClass(modal,'visible'),outsideClickIsAllowed=modal.getAttribute('data-allow-ouside-click')==='true';if(!clickedOnModal&&!clickedOnModalChild&&modalIsVisible&&outsideClickIsAllowed){closeModal();}};var $okButton=modal.querySelector('button.confirm'),$cancelButton=modal.querySelector('button.cancel'),$modalButtons=modal.querySelectorAll('button:not([type=hidden])');function handleKeyDown(e){var keyCode=e.keyCode||e.which;if([9,13,32,27].indexOf(keyCode)===-1){return;}
var $targetElement=e.target||e.srcElement;var btnIndex=-1;for(var i=0;i<$modalButtons.length;i++){if($targetElement===$modalButtons[i]){btnIndex=i;break;}}
if(keyCode===9){if(btnIndex===-1){$targetElement=$okButton;}else{if(btnIndex===$modalButtons.length-1){$targetElement=$modalButtons[0];}else{$targetElement=$modalButtons[btnIndex+1];}}
stopEventPropagation(e);$targetElement.focus();}else{if(keyCode===13||keyCode===32){if(btnIndex===-1){$targetElement=$okButton;}else{$targetElement=undefined;}}else if(keyCode===27&&!($cancelButton.hidden||$cancelButton.style.display==='none')){$targetElement=$cancelButton;}else{$targetElement=undefined;}
if($targetElement!==undefined){fireClick($targetElement,e);}}}
previousWindowKeyDown=window.onkeydown;window.onkeydown=handleKeyDown;function handleOnBlur(e){var $targetElement=e.target||e.srcElement,$focusElement=e.relatedTarget,modalIsVisible=hasClass(modal,'visible'),bootstrapModalIsVisible=document.querySelector('.control-popup.modal')||false;if(bootstrapModalIsVisible){return;}
if(modalIsVisible){var btnIndex=-1;if($focusElement!==null){for(var i=0;i<$modalButtons.length;i++){if($focusElement===$modalButtons[i]){btnIndex=i;break;}}
if(btnIndex===-1){$targetElement.focus();}}else{lastFocusedButton=$targetElement;}}}
$okButton.onblur=handleOnBlur;$cancelButton.onblur=handleOnBlur;window.onfocus=function(){window.setTimeout(function(){if(lastFocusedButton!==undefined){lastFocusedButton.focus();lastFocusedButton=undefined;}},0);};};window.swal.setDefaults=function(userParams){if(!userParams){throw new Error('userParams is required');}
if(typeof userParams!=='object'){throw new Error('userParams has to be a object');}
extend(defaultParams,userParams);};window.swal.close=function(){closeModal();}
function setParameters(params){var modal=getModal();var $title=modal.querySelector('h2'),$text=modal.querySelector('p'),$cancelBtn=modal.querySelector('button.cancel'),$confirmBtn=modal.querySelector('button.confirm');$title.innerHTML=escapeHtml(params.title).split("\n").join("<br>");$text.innerHTML=escapeHtml(params.text||'').split("\n").join("<br>");if(params.text){show($text);}
hide(modal.querySelectorAll('.icon'));if(params.type){var validType=false;for(var i=0;i<alertTypes.length;i++){if(params.type===alertTypes[i]){validType=true;break;}}
if(!validType){window.console.error('Unknown alert type: '+params.type);return false;}
var $icon=modal.querySelector('.icon.'+params.type);show($icon);switch(params.type){case"success":addClass($icon,'animate');addClass($icon.querySelector('.tip'),'animateSuccessTip');addClass($icon.querySelector('.long'),'animateSuccessLong');break;case"error":addClass($icon,'animateErrorIcon');addClass($icon.querySelector('.x-mark'),'animateXMark');break;case"warning":addClass($icon,'pulseWarning');addClass($icon.querySelector('.body'),'pulseWarningIns');addClass($icon.querySelector('.dot'),'pulseWarningIns');break;}}
if(params.imageUrl){var $customIcon=modal.querySelector('.icon.custom');$customIcon.style.backgroundImage='url('+params.imageUrl+')';show($customIcon);var _imgWidth=80,_imgHeight=80;if(params.imageSize){var imgWidth=params.imageSize.split('x')[0];var imgHeight=params.imageSize.split('x')[1];if(!imgWidth||!imgHeight){window.console.error("Parameter imageSize expects value with format WIDTHxHEIGHT, got "+params.imageSize);}else{_imgWidth=imgWidth;_imgHeight=imgHeight;$customIcon.css({'width':imgWidth+'px','height':imgHeight+'px'});}}
$customIcon.setAttribute('style',$customIcon.getAttribute('style')+'width:'+_imgWidth+'px; height:'+_imgHeight+'px');}
modal.setAttribute('data-has-cancel-button',params.showCancelButton);if(params.showCancelButton){$cancelBtn.style.display='inline-block';}else{hide($cancelBtn);}
modal.setAttribute('data-has-confirm-button',params.showConfirmButton);if(params.showConfirmButton){$confirmBtn.style.display='inline-block';}else{hide($confirmBtn);}
if(params.cancelButtonText){$cancelBtn.innerHTML=escapeHtml(params.cancelButtonText);}
if(params.confirmButtonText){$confirmBtn.innerHTML=escapeHtml(params.confirmButtonText);}
$confirmBtn.className='confirm btn'
addClass(modal,params.containerClass);addClass($confirmBtn,params.confirmButtonClass);addClass($cancelBtn,params.cancelButtonClass);addClass($title,params.titleClass);addClass($text,params.textClass);modal.setAttribute('data-allow-ouside-click',params.allowOutsideClick);var hasDoneFunction=(params.doneFunction)?true:false;modal.setAttribute('data-has-done-function',hasDoneFunction);modal.setAttribute('data-timer',params.timer);}
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
(function(){if(document.readyState==="complete"||document.readyState==="interactive"&&document.body){sweetAlertInitialize();}else{if(document.addEventListener){document.addEventListener('DOMContentLoaded',function handler(){document.removeEventListener('DOMContentLoaded',handler,false);sweetAlertInitialize();},false);}else if(document.attachEvent){document.attachEvent('onreadystatechange',function handler(){if(document.readyState==='complete'){document.detachEvent('onreadystatechange',handler);sweetAlertInitialize();}});}}})();})(window,document);(function($){$.Jcrop=function(obj,opt){var options=$.extend({},$.Jcrop.defaults),docOffset,_ua=navigator.userAgent.toLowerCase(),is_msie=/msie/.test(_ua),ie6mode=/msie [1-6]\./.test(_ua);function px(n){return Math.round(n)+'px';}
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
$img.bind('load.jcloader',completeCheck).bind('error.jcloader',function(e){$img.unbind('.jcloader');if($.isFunction(error))error.call(img);});if(img.complete&&$.isFunction(success)){$img.unbind('.jcloader');success.call(img);}};$.Jcrop.defaults={allowSelect:true,allowMove:true,allowResize:true,trackDocument:true,baseClass:'jcrop',addClass:null,bgColor:'black',bgOpacity:0.6,bgFade:false,borderOpacity:0.4,handleOpacity:0.5,handleSize:null,aspectRatio:0,keySupport:true,createHandles:['n','s','e','w','nw','ne','se','sw'],createDragbars:['n','s','e','w'],createBorders:['n','s','e','w'],drawBorders:true,dragEdges:true,fixedSupport:true,touchSupport:null,shade:null,boxWidth:0,boxHeight:0,boundary:2,fadeTime:400,animationDelay:20,swingSpeed:3,minSelect:[0,0],maxSize:[0,0],minSize:[0,0],onChange:function(){},onSelect:function(){},onDblClick:function(){},onRelease:function(){}};}(jQuery));!function(){var q=null;window.PR_SHOULD_USE_CONTINUATION=!0;(function(){function S(a){function d(e){var b=e.charCodeAt(0);if(b!==92)return b;var a=e.charAt(1);return(b=r[a])?b:"0"<=a&&a<="7"?parseInt(e.substring(1),8):a==="u"||a==="x"?parseInt(e.substring(2),16):e.charCodeAt(1)}function g(e){if(e<32)return(e<16?"\\x0":"\\x")+e.toString(16);e=String.fromCharCode(e);return e==="\\"||e==="-"||e==="]"||e==="^"?"\\"+e:e}function b(e){var b=e.substring(1,e.length-1).match(/\\u[\dA-Fa-f]{4}|\\x[\dA-Fa-f]{2}|\\[0-3][0-7]{0,2}|\\[0-7]{1,2}|\\[\S\s]|[^\\]/g),e=[],a=b[0]==="^",c=["["];a&&c.push("^");for(var a=a?1:0,f=b.length;a<f;++a){var h=b[a];if(/\\[bdsw]/i.test(h))c.push(h);else{var h=d(h),l;a+2<f&&"-"===b[a+1]?(l=d(b[a+2]),a+=2):l=h;e.push([h,l]);l<65||h>122||(l<65||h>90||e.push([Math.max(65,h)|32,Math.min(l,90)|32]),l<97||h>122||e.push([Math.max(97,h)&-33,Math.min(l,122)&-33]))}}e.sort(function(e,a){return e[0]-a[0]||a[1]-e[1]});b=[];f=[];for(a=0;a<e.length;++a)h=e[a],h[0]<=f[1]+1?f[1]=Math.max(f[1],h[1]):b.push(f=h);for(a=0;a<b.length;++a)h=b[a],c.push(g(h[0])),h[1]>h[0]&&(h[1]+1>h[0]&&c.push("-"),c.push(g(h[1])));c.push("]");return c.join("")}function s(e){for(var a=e.source.match(/\[(?:[^\\\]]|\\[\S\s])*]|\\u[\dA-Fa-f]{4}|\\x[\dA-Fa-f]{2}|\\\d+|\\[^\dux]|\(\?[!:=]|[()^]|[^()[\\^]+/g),c=a.length,d=[],f=0,h=0;f<c;++f){var l=a[f];l==="("?++h:"\\"===l.charAt(0)&&(l=+l.substring(1))&&(l<=h?d[l]=-1:a[f]=g(l))}for(f=1;f<d.length;++f)-1===d[f]&&(d[f]=++x);for(h=f=0;f<c;++f)l=a[f],l==="("?(++h,d[h]||(a[f]="(?:")):"\\"===l.charAt(0)&&(l=+l.substring(1))&&l<=h&&(a[f]="\\"+d[l]);for(f=0;f<c;++f)"^"===a[f]&&"^"!==a[f+1]&&(a[f]="");if(e.ignoreCase&&m)for(f=0;f<c;++f)l=a[f],e=l.charAt(0),l.length>=2&&e==="["?a[f]=b(l):e!=="\\"&&(a[f]=l.replace(/[A-Za-z]/g,function(a){a=a.charCodeAt(0);return"["+String.fromCharCode(a&-33,a|32)+"]"}));return a.join("")}for(var x=0,m=!1,j=!1,k=0,c=a.length;k<c;++k){var i=a[k];if(i.ignoreCase)j=!0;else if(/[a-z]/i.test(i.source.replace(/\\u[\da-f]{4}|\\x[\da-f]{2}|\\[^UXux]/gi,""))){m=!0;j=!1;break}}for(var r={b:8,t:9,n:10,v:11,f:12,r:13},n=[],k=0,c=a.length;k<c;++k){i=a[k];if(i.global||i.multiline)throw Error(""+i);n.push("(?:"+s(i)+")")}return RegExp(n.join("|"),j?"gi":"g")}function T(a,d){function g(a){var c=a.nodeType;if(c==1){if(!b.test(a.className)){for(c=a.firstChild;c;c=c.nextSibling)g(c);c=a.nodeName.toLowerCase();if("br"===c||"li"===c)s[j]="\n",m[j<<1]=x++,m[j++<<1|1]=a}}else if(c==3||c==4)c=a.nodeValue,c.length&&(c=d?c.replace(/\r\n?/g,"\n"):c.replace(/[\t\n\r ]+/g," "),s[j]=c,m[j<<1]=x,x+=c.length,m[j++<<1|1]=a)}var b=/(?:^|\s)nocode(?:\s|$)/,s=[],x=0,m=[],j=0;g(a);return{a:s.join("").replace(/\n$/,""),d:m}}function H(a,d,g,b){d&&(a={a:d,e:a},g(a),b.push.apply(b,a.g))}function U(a){for(var d=void 0,g=a.firstChild;g;g=g.nextSibling)var b=g.nodeType,d=b===1?d?a:g:b===3?V.test(g.nodeValue)?a:d:d;return d===a?void 0:d}function C(a,d){function g(a){for(var j=a.e,k=[j,"pln"],c=0,i=a.a.match(s)||[],r={},n=0,e=i.length;n<e;++n){var z=i[n],w=r[z],t=void 0,f;if(typeof w==="string")f=!1;else{var h=b[z.charAt(0)];if(h)t=z.match(h[1]),w=h[0];else{for(f=0;f<x;++f)if(h=d[f],t=z.match(h[1])){w=h[0];break}t||(w="pln")}if((f=w.length>=5&&"lang-"===w.substring(0,5))&&!(t&&typeof t[1]==="string"))f=!1,w="src";f||(r[z]=w)}h=c;c+=z.length;if(f){f=t[1];var l=z.indexOf(f),B=l+f.length;t[2]&&(B=z.length-t[2].length,l=B-f.length);w=w.substring(5);H(j+h,z.substring(0,l),g,k);H(j+h+l,f,I(w,f),k);H(j+h+B,z.substring(B),g,k)}else k.push(j+h,w)}a.g=k}var b={},s;(function(){for(var g=a.concat(d),j=[],k={},c=0,i=g.length;c<i;++c){var r=g[c],n=r[3];if(n)for(var e=n.length;--e>=0;)b[n.charAt(e)]=r;r=r[1];n=""+r;k.hasOwnProperty(n)||(j.push(r),k[n]=q)}j.push(/[\S\s]/);s=S(j)})();var x=d.length;return g}function v(a){var d=[],g=[];a.tripleQuotedStrings?d.push(["str",/^(?:'''(?:[^'\\]|\\[\S\s]|''?(?=[^']))*(?:'''|$)|"""(?:[^"\\]|\\[\S\s]|""?(?=[^"]))*(?:"""|$)|'(?:[^'\\]|\\[\S\s])*(?:'|$)|"(?:[^"\\]|\\[\S\s])*(?:"|$))/,q,"'\""]):a.multiLineStrings?d.push(["str",/^(?:'(?:[^'\\]|\\[\S\s])*(?:'|$)|"(?:[^"\\]|\\[\S\s])*(?:"|$)|`(?:[^\\`]|\\[\S\s])*(?:`|$))/,q,"'\"`"]):d.push(["str",/^(?:'(?:[^\n\r'\\]|\\.)*(?:'|$)|"(?:[^\n\r"\\]|\\.)*(?:"|$))/,q,"\"'"]);a.verbatimStrings&&g.push(["str",/^@"(?:[^"]|"")*(?:"|$)/,q]);var b=a.hashComments;b&&(a.cStyleComments?(b>1?d.push(["com",/^#(?:##(?:[^#]|#(?!##))*(?:###|$)|.*)/,q,"#"]):d.push(["com",/^#(?:(?:define|e(?:l|nd)if|else|error|ifn?def|include|line|pragma|undef|warning)\b|[^\n\r]*)/,q,"#"]),g.push(["str",/^<(?:(?:(?:\.\.\/)*|\/?)(?:[\w-]+(?:\/[\w-]+)+)?[\w-]+\.h(?:h|pp|\+\+)?|[a-z]\w*)>/,q])):d.push(["com",/^#[^\n\r]*/,q,"#"]));a.cStyleComments&&(g.push(["com",/^\/\/[^\n\r]*/,q]),g.push(["com",/^\/\*[\S\s]*?(?:\*\/|$)/,q]));if(b=a.regexLiterals){var s=(b=b>1?"":"\n\r")?".":"[\\S\\s]";g.push(["lang-regex",RegExp("^(?:^^\\.?|[+-]|[!=]=?=?|\\#|%=?|&&?=?|\\(|\\*=?|[+\\-]=|->|\\/=?|::?|<<?=?|>>?>?=?|,|;|\\?|@|\\[|~|{|\\^\\^?=?|\\|\\|?=?|break|case|continue|delete|do|else|finally|instanceof|return|throw|try|typeof)\\s*("+("/(?=[^/*"+b+"])(?:[^/\\x5B\\x5C"+b+"]|\\x5C"+s+"|\\x5B(?:[^\\x5C\\x5D"+b+"]|\\x5C"+
s+")*(?:\\x5D|$))+/")+")")])}(b=a.types)&&g.push(["typ",b]);b=(""+a.keywords).replace(/^ | $/g,"");b.length&&g.push(["kwd",RegExp("^(?:"+b.replace(/[\s,]+/g,"|")+")\\b"),q]);d.push(["pln",/^\s+/,q," \r\n\t\u00a0"]);b="^.[^\\s\\w.$@'\"`/\\\\]*";a.regexLiterals&&(b+="(?!s*/)");g.push(["lit",/^@[$_a-z][\w$@]*/i,q],["typ",/^(?:[@_]?[A-Z]+[a-z][\w$@]*|\w+_t\b)/,q],["pln",/^[$_a-z][\w$@]*/i,q],["lit",/^(?:0x[\da-f]+|(?:\d(?:_\d+)*\d*(?:\.\d*)?|\.\d\+)(?:e[+-]?\d+)?)[a-z]*/i,q,"0123456789"],["pln",/^\\[\S\s]?/,q],["pun",RegExp(b),q]);return C(d,g)}function J(a,d,g){function b(a){var c=a.nodeType;if(c==1&&!x.test(a.className))if("br"===a.nodeName)s(a),a.parentNode&&a.parentNode.removeChild(a);else for(a=a.firstChild;a;a=a.nextSibling)b(a);else if((c==3||c==4)&&g){var d=a.nodeValue,i=d.match(m);if(i)c=d.substring(0,i.index),a.nodeValue=c,(d=d.substring(i.index+i[0].length))&&a.parentNode.insertBefore(j.createTextNode(d),a.nextSibling),s(a),c||a.parentNode.removeChild(a)}}function s(a){function b(a,c){var d=c?a.cloneNode(!1):a,e=a.parentNode;if(e){var e=b(e,1),g=a.nextSibling;e.appendChild(d);for(var i=g;i;i=g)g=i.nextSibling,e.appendChild(i)}return d}for(;!a.nextSibling;)if(a=a.parentNode,!a)return;for(var a=b(a.nextSibling,0),d;(d=a.parentNode)&&d.nodeType===1;)a=d;c.push(a)}for(var x=/(?:^|\s)nocode(?:\s|$)/,m=/\r\n?|\n/,j=a.ownerDocument,k=j.createElement("li");a.firstChild;)k.appendChild(a.firstChild);for(var c=[k],i=0;i<c.length;++i)b(c[i]);d===(d|0)&&c[0].setAttribute("value",d);var r=j.createElement("ol");r.className="linenums";for(var d=Math.max(0,d-1|0)||0,i=0,n=c.length;i<n;++i)k=c[i],k.className="L"+(i+d)%10,k.firstChild||k.appendChild(j.createTextNode("\u00a0")),r.appendChild(k);a.appendChild(r)}function p(a,d){for(var g=d.length;--g>=0;){var b=d[g];F.hasOwnProperty(b)?D.console&&console.warn("cannot override language handler %s",b):F[b]=a}}function I(a,d){if(!a||!F.hasOwnProperty(a))a=/^\s*</.test(d)?"default-markup":"default-code";return F[a]}function K(a){var d=a.h;try{var g=T(a.c,a.i),b=g.a;a.a=b;a.d=g.d;a.e=0;I(d,b)(a);var s=/\bMSIE\s(\d+)/.exec(navigator.userAgent),s=s&&+s[1]<=8,d=/\n/g,x=a.a,m=x.length,g=0,j=a.d,k=j.length,b=0,c=a.g,i=c.length,r=0;c[i]=m;var n,e;for(e=n=0;e<i;)c[e]!==c[e+2]?(c[n++]=c[e++],c[n++]=c[e++]):e+=2;i=n;for(e=n=0;e<i;){for(var p=c[e],w=c[e+1],t=e+2;t+2<=i&&c[t+1]===w;)t+=2;c[n++]=p;c[n++]=w;e=t}c.length=n;var f=a.c,h;if(f)h=f.style.display,f.style.display="none";try{for(;b<k;){var l=j[b+2]||m,B=c[r+2]||m,t=Math.min(l,B),A=j[b+1],G;if(A.nodeType!==1&&(G=x.substring(g,t))){s&&(G=G.replace(d,"\r"));A.nodeValue=G;var L=A.ownerDocument,o=L.createElement("span");o.className=c[r+1];var v=A.parentNode;v.replaceChild(o,A);o.appendChild(A);g<l&&(j[b+1]=A=L.createTextNode(x.substring(t,l)),v.insertBefore(A,o.nextSibling))}g=t;g>=l&&(b+=2);g>=B&&(r+=2)}}finally{if(f)f.style.display=h}}catch(u){D.console&&console.log(u&&u.stack||u)}}var D=window,y=["break,continue,do,else,for,if,return,while"],E=[[y,"auto,case,char,const,default,double,enum,extern,float,goto,inline,int,long,register,short,signed,sizeof,static,struct,switch,typedef,union,unsigned,void,volatile"],"catch,class,delete,false,import,new,operator,private,protected,public,this,throw,true,try,typeof"],M=[E,"alignof,align_union,asm,axiom,bool,concept,concept_map,const_cast,constexpr,decltype,delegate,dynamic_cast,explicit,export,friend,generic,late_check,mutable,namespace,nullptr,property,reinterpret_cast,static_assert,static_cast,template,typeid,typename,using,virtual,where"],N=[E,"abstract,assert,boolean,byte,extends,final,finally,implements,import,instanceof,interface,null,native,package,strictfp,super,synchronized,throws,transient"],O=[N,"as,base,by,checked,decimal,delegate,descending,dynamic,event,fixed,foreach,from,group,implicit,in,internal,into,is,let,lock,object,out,override,orderby,params,partial,readonly,ref,sbyte,sealed,stackalloc,string,select,uint,ulong,unchecked,unsafe,ushort,var,virtual,where"],E=[E,"debugger,eval,export,function,get,null,set,undefined,var,with,Infinity,NaN"],P=[y,"and,as,assert,class,def,del,elif,except,exec,finally,from,global,import,in,is,lambda,nonlocal,not,or,pass,print,raise,try,with,yield,False,True,None"],Q=[y,"alias,and,begin,case,class,def,defined,elsif,end,ensure,false,in,module,next,nil,not,or,redo,rescue,retry,self,super,then,true,undef,unless,until,when,yield,BEGIN,END"],W=[y,"as,assert,const,copy,drop,enum,extern,fail,false,fn,impl,let,log,loop,match,mod,move,mut,priv,pub,pure,ref,self,static,struct,true,trait,type,unsafe,use"],y=[y,"case,done,elif,esac,eval,fi,function,in,local,set,then,until"],R=/^(DIR|FILE|vector|(de|priority_)?queue|list|stack|(const_)?iterator|(multi)?(set|map)|bitset|u?(int|float)\d*)\b/,V=/\S/,X=v({keywords:[M,O,E,"caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END",P,Q,y],hashComments:!0,cStyleComments:!0,multiLineStrings:!0,regexLiterals:!0}),F={};p(X,["default-code"]);p(C([],[["pln",/^[^<?]+/],["dec",/^<!\w[^>]*(?:>|$)/],["com",/^<\!--[\S\s]*?(?:--\>|$)/],["lang-",/^<\?([\S\s]+?)(?:\?>|$)/],["lang-",/^<%([\S\s]+?)(?:%>|$)/],["pun",/^(?:<[%?]|[%?]>)/],["lang-",/^<xmp\b[^>]*>([\S\s]+?)<\/xmp\b[^>]*>/i],["lang-js",/^<script\b[^>]*>([\S\s]*?)(<\/script\b[^>]*>)/i],["lang-css",/^<style\b[^>]*>([\S\s]*?)(<\/style\b[^>]*>)/i],["lang-in.tag",/^(<\/?[a-z][^<>]*>)/i]]),["default-markup","htm","html","mxml","xhtml","xml","xsl"]);p(C([["pln",/^\s+/,q," \t\r\n"],["atv",/^(?:"[^"]*"?|'[^']*'?)/,q,"\"'"]],[["tag",/^^<\/?[a-z](?:[\w-.:]*\w)?|\/?>$/i],["atn",/^(?!style[\s=]|on)[a-z](?:[\w:-]*\w)?/i],["lang-uq.val",/^=\s*([^\s"'>]*(?:[^\s"'/>]|\/(?=\s)))/],["pun",/^[/<->]+/],["lang-js",/^on\w+\s*=\s*"([^"]+)"/i],["lang-js",/^on\w+\s*=\s*'([^']+)'/i],["lang-js",/^on\w+\s*=\s*([^\s"'>]+)/i],["lang-css",/^style\s*=\s*"([^"]+)"/i],["lang-css",/^style\s*=\s*'([^']+)'/i],["lang-css",/^style\s*=\s*([^\s"'>]+)/i]]),["in.tag"]);p(C([],[["atv",/^[\S\s]+/]]),["uq.val"]);p(v({keywords:M,hashComments:!0,cStyleComments:!0,types:R}),["c","cc","cpp","cxx","cyc","m"]);p(v({keywords:"null,true,false"}),["json"]);p(v({keywords:O,hashComments:!0,cStyleComments:!0,verbatimStrings:!0,types:R}),["cs"]);p(v({keywords:N,cStyleComments:!0}),["java"]);p(v({keywords:y,hashComments:!0,multiLineStrings:!0}),["bash","bsh","csh","sh"]);p(v({keywords:P,hashComments:!0,multiLineStrings:!0,tripleQuotedStrings:!0}),["cv","py","python"]);p(v({keywords:"caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END",hashComments:!0,multiLineStrings:!0,regexLiterals:2}),["perl","pl","pm"]);p(v({keywords:Q,hashComments:!0,multiLineStrings:!0,regexLiterals:!0}),["rb","ruby"]);p(v({keywords:E,cStyleComments:!0,regexLiterals:!0}),["javascript","js"]);p(v({keywords:"all,and,by,catch,class,else,extends,false,finally,for,if,in,is,isnt,loop,new,no,not,null,of,off,on,or,return,super,then,throw,true,try,unless,until,when,while,yes",hashComments:3,cStyleComments:!0,multilineStrings:!0,tripleQuotedStrings:!0,regexLiterals:!0}),["coffee"]);p(v({keywords:W,cStyleComments:!0,multilineStrings:!0}),["rc","rs","rust"]);p(C([],[["str",/^[\S\s]+/]]),["regex"]);var Y=D.PR={createSimpleLexer:C,registerLangHandler:p,sourceDecorator:v,PR_ATTRIB_NAME:"atn",PR_ATTRIB_VALUE:"atv",PR_COMMENT:"com",PR_DECLARATION:"dec",PR_KEYWORD:"kwd",PR_LITERAL:"lit",PR_NOCODE:"nocode",PR_PLAIN:"pln",PR_PUNCTUATION:"pun",PR_SOURCE:"src",PR_STRING:"str",PR_TAG:"tag",PR_TYPE:"typ",prettyPrintOne:D.prettyPrintOne=function(a,d,g){var b=document.createElement("div");b.innerHTML="<pre>"+a+"</pre>";b=b.firstChild;g&&J(b,g,!0);K({h:d,j:g,c:b,i:1});return b.innerHTML},prettyPrint:D.prettyPrint=function(a,d){function g(){for(var b=D.PR_SHOULD_USE_CONTINUATION?c.now()+250:Infinity;i<p.length&&c.now()<b;i++){for(var d=p[i],j=h,k=d;k=k.previousSibling;){var m=k.nodeType,o=(m===7||m===8)&&k.nodeValue;if(o?!/^\??prettify\b/.test(o):m!==3||/\S/.test(k.nodeValue))break;if(o){j={};o.replace(/\b(\w+)=([\w%+\-.:]+)/g,function(a,b,c){j[b]=c});break}}k=d.className;if((j!==h||e.test(k))&&!v.test(k)){m=!1;for(o=d.parentNode;o;o=o.parentNode)if(f.test(o.tagName)&&o.className&&e.test(o.className)){m=!0;break}if(!m){d.className+=" prettyprinted";m=j.lang;if(!m){var m=k.match(n),y;if(!m&&(y=U(d))&&t.test(y.tagName))m=y.className.match(n);m&&(m=m[1])}if(w.test(d.tagName))o=1;else var o=d.currentStyle,u=s.defaultView,o=(o=o?o.whiteSpace:u&&u.getComputedStyle?u.getComputedStyle(d,q).getPropertyValue("white-space"):0)&&"pre"===o.substring(0,3);u=j.linenums;if(!(u=u==="true"||+u))u=(u=k.match(/\blinenums\b(?::(\d+))?/))?u[1]&&u[1].length?+u[1]:!0:!1;u&&J(d,u,o);r={h:m,c:d,j:u,i:o};K(r)}}}i<p.length?setTimeout(g,250):"function"===typeof a&&a()}for(var b=d||document.body,s=b.ownerDocument||document,b=[b.getElementsByTagName("pre"),b.getElementsByTagName("code"),b.getElementsByTagName("xmp")],p=[],m=0;m<b.length;++m)for(var j=0,k=b[m].length;j<k;++j)p.push(b[m][j]);var b=q,c=Date;c.now||(c={now:function(){return+new Date}});var i=0,r,n=/\blang(?:uage)?-([\w.]+)(?!\S)/,e=/\bprettyprint\b/,v=/\bprettyprinted\b/,w=/pre|xmp/i,t=/^code$/i,f=/^(?:pre|code|xmp)$/i,h={};g()}};typeof define==="function"&&define.amd&&define("google-code-prettify",[],function(){return Y})})();}()
+function($){"use strict";if($.oc.mediaManager===undefined)
$.oc.mediaManager={}
var Base=$.oc.foundation.base,BaseProto=Base.prototype
var MediaManagerPopup=function(options){this.$popupRootElement=null
this.options=$.extend({},MediaManagerPopup.DEFAULTS,options)
Base.call(this)
this.init()
this.show()}
MediaManagerPopup.prototype=Object.create(BaseProto)
MediaManagerPopup.prototype.constructor=MediaManagerPopup
MediaManagerPopup.prototype.dispose=function(){this.unregisterHandlers()
this.$popupRootElement.remove()
this.$popupRootElement=null
this.$popupElement=null
BaseProto.dispose.call(this)}
MediaManagerPopup.prototype.init=function(){if(this.options.alias===undefined)
throw new Error('Media Manager popup option "alias" is not set.')
this.$popupRootElement=$('<div/>')
this.registerHandlers()}
MediaManagerPopup.prototype.registerHandlers=function(){this.$popupRootElement.one('hide.oc.popup',this.proxy(this.onPopupHidden))
this.$popupRootElement.one('shown.oc.popup',this.proxy(this.onPopupShown))}
MediaManagerPopup.prototype.unregisterHandlers=function(){this.$popupElement.off('popupcommand',this.proxy(this.onPopupCommand))
this.$popupRootElement.off('popupcommand',this.proxy(this.onPopupCommand))}
MediaManagerPopup.prototype.show=function(){var data={bottomToolbar:this.options.bottomToolbar?1:0,cropAndInsertButton:this.options.cropAndInsertButton?1:0}
this.$popupRootElement.popup({extraData:data,size:'adaptive',adaptiveHeight:true,handler:this.options.alias+'::onLoadPopup'})}
MediaManagerPopup.prototype.hide=function(){if(this.$popupElement)
this.$popupElement.trigger('close.oc.popup')}
MediaManagerPopup.prototype.getMediaManagerElement=function(){return this.$popupElement.find('[data-control="media-manager"]')}
MediaManagerPopup.prototype.insertMedia=function(){var items=this.getMediaManagerElement().mediaManager('getSelectedItems')
if(this.options.onInsert!==undefined)
this.options.onInsert.call(this,items)}
MediaManagerPopup.prototype.insertCroppedImage=function(imageItem){if(this.options.onInsert!==undefined)
this.options.onInsert.call(this,[imageItem])}
MediaManagerPopup.prototype.onPopupHidden=function(event,element,popup){var mediaManager=this.getMediaManagerElement()
mediaManager.mediaManager('dispose')
mediaManager.remove()
$(document).trigger('mousedown')
this.dispose()
if(this.options.onClose!==undefined)
this.options.onClose.call(this)}
MediaManagerPopup.prototype.onPopupShown=function(event,element,popup){this.$popupElement=popup
this.$popupElement.on('popupcommand',this.proxy(this.onPopupCommand))
this.getMediaManagerElement().mediaManager('selectFirstItem')}
MediaManagerPopup.prototype.onPopupCommand=function(ev,command,param){switch(command){case'insert':this.insertMedia()
break;case'insert-cropped':this.insertCroppedImage(param)
break;}
return false}
MediaManagerPopup.DEFAULTS={alias:undefined,bottomToolbar:true,cropAndInsertButton:false,onInsert:undefined,onClose:undefined}
$.oc.mediaManager.popup=MediaManagerPopup}(window.jQuery);if($.oc===undefined)
$.oc={}
if($.oc.langMessages===undefined)
$.oc.langMessages={}
$.oc.lang=(function(lang,messages){lang.load=function(locale){if(messages[locale]===undefined){messages[locale]={}}
lang.loadedMessages=messages[locale]}
lang.get=function(name,defaultValue){if(!name)return
var result=lang.loadedMessages
if(!defaultValue)defaultValue=name
$.each(name.split('.'),function(index,value){if(result[value]===undefined){result=defaultValue
return false}
result=result[value]})
return result}
if(lang.locale===undefined){lang.locale=$('html').attr('lang')||'en'}
if(lang.loadedMessages===undefined){lang.load(lang.locale)}
return lang})($.oc.lang||{},$.oc.langMessages);(function($){if($.oc===undefined)
$.oc={}
$.oc.alert=function alert(message){swal({title:message,confirmButtonClass:'btn-primary'})}
$.oc.confirm=function confirm(message,callback){swal({title:message,showCancelButton:true,confirmButtonClass:'btn-primary'},callback)}})(jQuery);$(window).on('ajaxErrorMessage',function(event,message){if(!message)return
$.oc.alert(message)
event.preventDefault()})
$(window).on('ajaxConfirmMessage',function(event,message){if(!message)return
$.oc.confirm(message,function(isConfirm){isConfirm?event.promise.resolve():event.promise.reject()})
event.preventDefault()
return true})
$(document).ready(function(){if(!window.swal)return
var swal=window.swal
window.sweetAlert=window.swal=function(message,callback){if(typeof message==='object'){message.confirmButtonText=message.confirmButtonText||$.oc.lang.get('alert.confirm_button_text')
message.cancelButtonText=message.cancelButtonText||$.oc.lang.get('alert.cancel_button_text')}
else{message={title:message,confirmButtonText:$.oc.lang.get('alert.confirm_button_text'),cancelButtonText:$.oc.lang.get('alert.cancel_button_text')}}
swal(message,callback)}})
+function($){"use strict";var Base=$.oc.foundation.base,BaseProto=Base.prototype
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
this.init()
$.oc.foundation.controlUtils.markDisposable(element)}
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
this.$el.one('dispose-control',this.proxy(this.dispose))
this.scrollContentElement.addEventListener('scroll',this.proxy(this.onScroll))
this.dragHandleElement.addEventListener('mousedown',this.proxy(this.onStartDrag))}
Scrollpad.prototype.unregisterHandlers=function(){this.$el.off('mouseenter',this.proxy(this.onMouseEnter))
this.$el.off('mouseleave',this.proxy(this.onMouseLeave))
this.$el.off('dispose-control',this.proxy(this.dispose))
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
$(document).on('render',function(){$('div[data-control=scrollpad]').scrollpad()})}(window.jQuery);+function($){"use strict";var VerticalMenu=function(element,toggle,options){this.$el=$(element)
this.body=$('body')
this.toggle=$(toggle)
this.options=options||{}
this.options=$.extend({},VerticalMenu.DEFAULTS,this.options)
this.wrapper=$(this.options.contentWrapper)
this.breakpoint=options.breakpoint
this.menuPanel=$('<div></div>').appendTo('body').addClass(this.options.collapsedMenuClass).css('width',0)
this.menuContainer=$('<div></div>').appendTo(this.menuPanel).css('display','none')
this.menuElement=this.$el.clone().appendTo(this.menuContainer).css('width','auto')
var self=this
this.toggle.click(function(){if(!self.body.hasClass(self.options.bodyMenuOpenClass)){var wrapperWidth=self.wrapper.outerWidth()
self.menuElement.dragScroll('goToStart')
self.wrapper.css({'position':'absolute','min-width':self.wrapper.width(),'height':'100%'})
self.body.addClass(self.options.bodyMenuOpenClass)
self.menuContainer.css('display','block')
self.wrapper.animate({'left':self.options.menuWidth},{duration:200,queue:false})
self.menuPanel.animate({'width':self.options.menuWidth},{duration:200,queue:false,complete:function(){self.menuElement.css('width',self.options.menuWidth)}})}
else{closeMenu()}
return false})
this.wrapper.click(function(){if(self.body.hasClass(self.options.bodyMenuOpenClass)){closeMenu()
return false}})
$(window).resize(function(){if(self.body.hasClass(self.options.bodyMenuOpenClass)){if($(window).width()>self.breakpoint){hideMenu()}}})
this.menuElement.dragScroll({vertical:true,useNative:true,start:function(){self.menuElement.addClass('drag')},stop:function(){self.menuElement.removeClass('drag')},scrollClassContainer:self.menuPanel,scrollMarkerContainer:self.menuContainer})
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
VerticalMenu.DEFAULTS={menuWidth:230,breakpoint:769,bodyMenuOpenClass:'mainmenu-open',collapsedMenuClass:'mainmenu-collapsed',contentWrapper:'#layout-canvas'}
var old=$.fn.verticalMenu
$.fn.verticalMenu=function(toggleSelector,option){return this.each(function(){var $this=$(this)
var data=$this.data('oc.verticalMenu')
var options=typeof option=='object'&&option
if(!data)$this.data('oc.verticalMenu',(data=new VerticalMenu(this,toggleSelector,options)))
if(typeof option=='string')data[option].call($this)})}
$.fn.verticalMenu.Constructor=VerticalMenu
$.fn.verticalMenu.noConflict=function(){$.fn.verticalMenu=old
return this}}(window.jQuery);(function($){$(document).ready(function(){$('nav.navbar').each(function(){var
navbar=$(this),nav=$('ul.nav',navbar),collapseMode=navbar.hasClass('navbar-mode-collapse'),isMobile=$('html').hasClass('mobile')
nav.verticalMenu($('a.menu-toggle',navbar),{breakpoint:collapseMode?Infinity:769})
$('li.with-tooltip:not(.active) > a',navbar).tooltip({container:'body',placement:'bottom',template:'<div class="tooltip mainmenu-tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'}).on('show.bs.tooltip',function(e){if(isMobile)e.preventDefault()})
var dragScroll=$('[data-control=toolbar]',navbar).data('oc.dragScroll')
if(dragScroll){dragScroll.goToElement($('ul.nav > li.active',navbar),undefined,{'duration':0})}})})})(jQuery);+function($){"use strict";if($.oc===undefined)
$.oc={}
var SideNav=function(element,options){this.options=options
this.$el=$(element)
this.$list=$('ul',this.$el)
this.$items=$('li',this.$list)
this.init();}
SideNav.DEFAULTS={activeClass:'active'}
SideNav.prototype.init=function(){var self=this
this.$list.dragScroll({vertical:true,useNative:true,start:function(){self.$list.addClass('drag')},stop:function(){self.$list.removeClass('drag')},scrollClassContainer:self.$el,scrollMarkerContainer:self.$el})
this.$list.on('click',function(){if(self.$list.hasClass('drag')){return false}})}
SideNav.prototype.unsetActiveItem=function(itemId){this.$items.removeClass(this.options.activeClass)}
SideNav.prototype.setActiveItem=function(itemId){if(!itemId){return}
this.$items.removeClass(this.options.activeClass).filter('[data-menu-item='+itemId+']').addClass(this.options.activeClass)}
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
$.fn.sideNav=function(option){var args=Array.prototype.slice.call(arguments,1),result
this.each(function(){var $this=$(this)
var data=$this.data('oc.sideNav')
var options=$.extend({},SideNav.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('oc.sideNav',(data=new SideNav(this,options)))
if(typeof option=='string')result=data[option].apply(data,args)
if(typeof result!='undefined')return false
if($.oc.sideNav===undefined)
$.oc.sideNav=data})
return result?result:this}
$.fn.sideNav.Constructor=SideNav
$.fn.sideNav.noConflict=function(){$.fn.sideNav=old
return this}
$(document).ready(function(){$('[data-control="sidenav"]').sideNav()})}(window.jQuery);+function($){"use strict";var Base=$.oc.foundation.base,BaseProto=Base.prototype
var Scrollbar=function(element,options){var
$el=this.$el=$(element),el=$el.get(0),self=this,options=this.options=options||{},sizeName=this.sizeName=options.vertical?'height':'width',isNative=$('html').hasClass('mobile'),isTouch=this.isTouch=Modernizr.touchevents,isScrollable=this.isScrollable=false,isLocked=this.isLocked=false,eventElementName=options.vertical?'pageY':'pageX',dragStart=0,startOffset=0;$.oc.foundation.controlUtils.markDisposable(element)
Base.call(this)
this.$el.one('dispose-control',this.proxy(this.dispose))
if(isNative){return}
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
OctoberLayout.prototype.updateLayout=function(title){var $children,$el,fixedWidth,margin
$('[data-calculate-width]').each(function(){$children=$(this).children()
if($children.length>0){fixedWidth=0
$children.each(function(){$el=$(this)
margin=$el.data('oc.layoutMargin')
if(margin===undefined){margin=parseInt($el.css('marginRight'))+parseInt($el.css('marginLeft'))
$el.data('oc.layoutMargin',margin)}
fixedWidth+=$el.get(0).offsetWidth+margin})
$(this).width(fixedWidth)
$(this).trigger('oc.widthFixed')}})}
OctoberLayout.prototype.toggleAccountMenu=function(el){var self=this,$el=$(el),$parent=$(el).parent(),$menu=$el.next()
$el.tooltip('hide')
if($menu.hasClass('active')){self.$accountMenuOverlay.remove()
$parent.removeClass('highlight')
$menu.removeClass('active')}
else{self.$accountMenuOverlay=$('<div />').addClass('popover-overlay')
$(document.body).append(self.$accountMenuOverlay)
$parent.addClass('highlight')
$menu.addClass('active')
self.$accountMenuOverlay.one('click',function(){self.$accountMenuOverlay.remove()
$menu.removeClass('active')
$parent.removeClass('highlight')})}}
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
this.$sideNavItems.click(function(){if($(this).data('no-side-panel')){return}
if(Modernizr.touchevents&&$(window).width()<self.options.breakpoint){if($(this).data('menu-item')==self.visibleItemId&&self.panelVisible){self.hideSidePanel()
return}
else{self.displaySidePanel()}}
self.displayTab(this)
return false})
if(!Modernizr.touchevents){self.$sideNav.mouseleave(function(){clearTimeout(self.panelOpenTimeout)})
self.$el.mouseleave(function(){self.hideSidePanel()})
self.$sideNavItems.mouseenter(function(){if($(window).width()<self.options.breakpoint||!self.panelFixed()){if($(this).data('no-side-panel')){self.hideSidePanel()
return}
var _this=this
self.tabOpenTimeout=setTimeout(function(){self.displaySidePanel()
self.displayTab(_this)},self.tabOpenDelay)}})
self.$sideNavItems.mouseleave(function(){clearTimeout(self.tabOpenTimeout)})
$(window).resize(function(){self.updatePanelPosition()
self.updateActiveTab()})}
else{$('#layout-body').click(function(){if(self.panelVisible){self.hideSidePanel()
return false}})
self.$el.on('close.oc.sidePanel',function(){self.hideSidePanel()})}
this.updateActiveTab()}
SidePanelTab.prototype.displayTab=function(menuItem){var menuItemId=$(menuItem).data('menu-item')
this.visibleItemId=menuItemId
if($.oc.sideNav!==undefined){$.oc.sideNav.setActiveItem(menuItemId)}
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
SidePanelTab.prototype.updatePanelPosition=function(){if(!this.panelFixed()||Modernizr.touchevents){this.$el.height($(document).height()-this.mainNavHeight)}
else{this.$el.css('height','')}
if(this.panelVisible&&$(window).width()>this.options.breakpoint&&this.panelFixed()){this.hideSidePanel()}}
SidePanelTab.prototype.updateActiveTab=function(){if($.oc.sideNav===undefined){return}
if(!this.panelVisible&&($(window).width()<this.options.breakpoint||!this.panelFixed())){$.oc.sideNav.unsetActiveItem()}
else{$.oc.sideNav.setActiveItem(this.visibleItemId)}}
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
if(typeof option=='string')data[option].call(data)})}
$.fn.sidePanelTab.Constructor=SidePanelTab
$.fn.sidePanelTab.noConflict=function(){$.fn.sidePanelTab=old
return this}
$(document).ready(function(){$('[data-control=layout-sidepanel]').sidePanelTab()})
$(document).ready(function(){if(Modernizr.touchevents||(typeof(localStorage)!=='undefined')){if(localStorage.ocSidePanelFixed==0){$(document.body).addClass('side-panel-not-fixed')
$(window).trigger('resize')}
else if(localStorage.ocSidePanelFixed==1){$(document.body).removeClass('side-panel-not-fixed')
$(window).trigger('resize')}}})}(window.jQuery);+function($){"use strict";var SimpleList=function(element,options){var $el=this.$el=$(element)
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
$(document).render(function(){$('[data-control="treelist"]').treeListWidget();})}(window.jQuery);+function($){"use strict";var SidenavTree=function(element,options){this.options=options
this.$el=$(element)
this.init()}
SidenavTree.DEFAULTS={treeName:'sidenav_tree'}
SidenavTree.prototype.init=function(){var self=this
$(document.body).addClass('has-sidenav-tree')
this.statusCookieName=this.options.treeName+'groupStatus'
this.searchCookieName=this.options.treeName+'search'
this.$searchInput=$(this.options.searchInput)
this.$el.on('click','li > div.group',function(){self.toggleGroup($(this).closest('li'))
return false})
this.$searchInput.on('input',function(){self.handleSearchChange()})
var searchTerm=$.cookie(this.searchCookieName)
if(searchTerm!==undefined&&searchTerm.length>0){this.$searchInput.val(searchTerm)
this.applySearch()}
var scrollbar=$('[data-control=scrollbar]',this.$el).data('oc.scrollbar'),active=$('li.active',this.$el)
if(active.length>0){scrollbar.gotoElement(active)}}
SidenavTree.prototype.toggleGroup=function(group){var $group=$(group),status=$group.attr('data-status')
status===undefined||status=='expanded'?this.collapseGroup($group):this.expandGroup($group)}
SidenavTree.prototype.collapseGroup=function(group){var
$list=$('> ul',group),self=this
$list.css('overflow','hidden')
$list.animate({'height':0},{duration:100,queue:false,complete:function(){$list.css({'overflow':'visible','display':'none'})
$(group).attr('data-status','collapsed')
$(window).trigger('oc.updateUi')
self.saveGroupStatus($(group).data('group-code'),true)}})}
SidenavTree.prototype.expandGroup=function(group,duration){var
$list=$('> ul',group),self=this
duration=duration===undefined?100:duration
$list.css({'overflow':'hidden','height':0})
$list.animate({'height':$list[0].scrollHeight},{duration:duration,queue:false,complete:function(){$list.css({'overflow':'visible','height':'auto','display':''})
$(group).attr('data-status','expanded')
$(window).trigger('oc.updateUi')
self.saveGroupStatus($(group).data('group-code'),false)}})}
SidenavTree.prototype.saveGroupStatus=function(groupCode,collapsed){var collapsedGroups=$.cookie(this.statusCookieName),updatedGroups=[]
if(collapsedGroups===undefined){collapsedGroups=''}
collapsedGroups=collapsedGroups.split('|')
$.each(collapsedGroups,function(){if(groupCode!=this)
updatedGroups.push(this)})
if(collapsed){updatedGroups.push(groupCode)}
$.cookie(this.statusCookieName,updatedGroups.join('|'),{expires:30,path:'/'})}
SidenavTree.prototype.handleSearchChange=function(){var lastValue=this.$searchInput.data('oc.lastvalue');if(lastValue!==undefined&&lastValue==this.$searchInput.val()){return}
this.$searchInput.data('oc.lastvalue',this.$searchInput.val())
if(this.dataTrackInputTimer!==undefined){window.clearTimeout(this.dataTrackInputTimer)}
var self=this
this.dataTrackInputTimer=window.setTimeout(function(){self.applySearch()},300);$.cookie(this.searchCookieName,$.trim(this.$searchInput.val()),{expires:30,path:'/'})}
SidenavTree.prototype.applySearch=function(){var query=$.trim(this.$searchInput.val()),words=query.toLowerCase().split(' '),visibleGroups=[],visibleItems=[],self=this
if(query.length==0){$('li',this.$el).removeClass('hidden')
return}
$('ul.top-level > li',this.$el).each(function(){var $li=$(this)
if(self.textContainsWords($('div.group h3',$li).text(),words)){visibleGroups.push($li.get(0))
$('ul li',$li).each(function(){visibleItems.push(this)})}
else{$('ul li',$li).each(function(){if(self.textContainsWords($(this).text(),words)||self.textContainsWords($(this).data('keywords'),words)){visibleGroups.push($li.get(0))
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
$(document).ready(function(){$('[data-control=sidenav-tree]').sidenavTree()})}(window.jQuery);+function($){"use strict";var Base=$.oc.foundation.base,BaseProto=Base.prototype
var DateTimeConverter=function(element,options){this.$el=$(element)
this.options=options||{}
$.oc.foundation.controlUtils.markDisposable(element)
Base.call(this)
this.init()}
DateTimeConverter.prototype=Object.create(BaseProto)
DateTimeConverter.prototype.constructor=DateTimeConverter
DateTimeConverter.prototype.init=function(){this.initDefaults()
this.$el.text(this.getDateTimeValue())
this.$el.one('dispose-control',this.proxy(this.dispose))}
DateTimeConverter.prototype.initDefaults=function(){if(!this.options.timezone){this.options.timezone=$('meta[name="backend-timezone"]').attr('content')}
if(!this.options.locale){this.options.locale=$('meta[name="backend-locale"]').attr('content')}
if(!this.options.format){this.options.format='llll'}
if(this.options.formatAlias){this.options.format=this.getFormatFromAlias(this.options.formatAlias)}
this.appTimezone=$('meta[name="app-timezone"]').attr('content')
if(!this.appTimezone){this.appTimezone='UTC'}}
DateTimeConverter.prototype.getDateTimeValue=function(){this.datetime=this.$el.attr('datetime')
if(this.$el.get(0).hasAttribute('data-ignore-timezone')){this.appTimezone='UTC'
this.options.timezone='UTC'}
var momentObj=moment.tz(this.datetime,this.appTimezone),result
if(this.options.locale){momentObj=momentObj.locale(this.options.locale)}
if(this.options.timezone){momentObj=momentObj.tz(this.options.timezone)}
if(this.options.timeSince){result=momentObj.fromNow()}
else if(this.options.timeTense){result=momentObj.calendar()}
else{result=momentObj.format(this.options.format)}
return result}
DateTimeConverter.prototype.getFormatFromAlias=function(alias){var map={time:'LT',timeLong:'LTS',date:'L',dateMin:'l',dateLong:'LL',dateLongMin:'ll',dateTime:'LLL',dateTimeMin:'lll',dateTimeLong:'LLLL',dateTimeLongMin:'llll'}
return map[alias]?map[alias]:'llll'}
DateTimeConverter.prototype.dispose=function(){this.$el.off('dispose-control',this.proxy(this.dispose))
this.$el.removeData('oc.dateTimeConverter')
this.$el=null
this.options=null
BaseProto.dispose.call(this)}
DateTimeConverter.DEFAULTS={format:null,formatAlias:null,timezone:null,locale:null,timeTense:false,timeSince:false}
var old=$.fn.dateTimeConverter
$.fn.dateTimeConverter=function(option){var args=Array.prototype.slice.call(arguments,1),items,result
items=this.each(function(){var $this=$(this)
var data=$this.data('oc.dateTimeConverter')
var options=$.extend({},DateTimeConverter.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('oc.dateTimeConverter',(data=new DateTimeConverter(this,options)))
if(typeof option=='string')result=data[option].apply(data,args)
if(typeof result!='undefined')return false})
return result?result:items}
$.fn.dateTimeConverter.Constructor=DateTimeConverter
$.fn.dateTimeConverter.noConflict=function(){$.fn.dateTimeConverter=old
return this}
$(document).render(function(){$('time[data-datetime-control]').dateTimeConverter()})}(window.jQuery);$.ajaxPrefilter(function(options){var token=$('meta[name="csrf-token"]').attr('content')
if(token){if(!options.headers)options.headers={}
options.headers['X-CSRF-TOKEN']=token}})
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
img.src=source})}};return o;};assetManager=new AssetManager();if($.oc===undefined)
$.oc={}
$.oc.escapeHtmlString=function(string){var htmlEscapes={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#x27;','/':'&#x2F;'},htmlEscaper=/[&<>"'\/]/g
return(''+string).replace(htmlEscaper,function(match){return htmlEscapes[match];})}
if(!!window.MSInputMethodContext&&!!document.documentMode){$(window).on('resize',function(){fixMediaManager()
fixSidebar()})
function fixMediaManager(){var $el=$('div[data-control="media-manager"] .control-scrollpad')
$el.height($el.parent().height())}
function fixSidebar(){$('#layout-sidenav').height(Math.max($('#layout-body').innerHeight(),$(window).height()-$('#layout-mainmenu').height()))}}