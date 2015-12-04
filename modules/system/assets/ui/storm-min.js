
(function(global,factory){if(typeof exports==="object"&&exports){factory(exports);}else if(typeof define==="function"&&define.amd){define(['exports'],factory);}else{factory(global.Mustache={});}}(this,function(mustache){var Object_toString=Object.prototype.toString;var isArray=Array.isArray||function(object){return Object_toString.call(object)==='[object Array]';};function isFunction(object){return typeof object==='function';}
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
return mustache.escape(value);};Writer.prototype._rawValue=function(token){return token[1];};mustache.name="mustache.js";mustache.version="2.0.0";mustache.tags=["{{","}}"];var defaultWriter=new Writer();mustache.clearCache=function(){return defaultWriter.clearCache();};mustache.parse=function(template,tags){return defaultWriter.parse(template,tags);};mustache.render=function(template,view,partials){return defaultWriter.render(template,view,partials);};mustache.to_html=function(template,view,partials,send){var result=mustache.render(template,view,partials);if(isFunction(send)){send(result);}else{return result;}};mustache.escape=escapeHtml;mustache.Scanner=Scanner;mustache.Context=Context;mustache.Writer=Writer;}));;window.Modernizr=(function(window,document,undefined){var version='2.8.3',Modernizr={},enableClasses=true,docElement=document.documentElement,mod='modernizr',modElem=document.createElement(mod),mStyle=modElem.style,inputElem=document.createElement('input'),smile=':)',toString={}.toString,prefixes=' -webkit- -moz- -o- -ms- '.split(' '),omPrefixes='Webkit Moz O ms',cssomPrefixes=omPrefixes.split(' '),domPrefixes=omPrefixes.toLowerCase().split(' '),ns={'svg':'http://www.w3.org/2000/svg'},tests={},inputs={},attrs={},classes=[],slice=classes.slice,featureName,injectElementWithStyles=function(rule,callback,nodes,testnames){var style,ret,node,docOverflow,div=document.createElement('div'),body=document.body,fakeBody=body||document.createElement('body');if(parseInt(nodes,10)){while(nodes--){node=document.createElement('div');node.id=testnames?testnames[nodes]:mod+(nodes+1);div.appendChild(node);}}
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
(enableClasses?' js '+classes.join(' '):'');return Modernizr;})(this,this.document);(function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}})(this,document);Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0));};;+function($){'use strict';var backdrop='.dropdown-backdrop'
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
$(document).on('click.bs.dropdown.data-api',clearMenus).on('click.bs.dropdown.data-api','.dropdown form',function(e){e.stopPropagation()}).on('click.bs.dropdown.data-api',toggle,Dropdown.prototype.toggle).on('keydown.bs.dropdown.data-api',toggle+', [role=menu], [role=listbox]',Dropdown.prototype.keydown)}(jQuery);+function($){'use strict';function transitionEnd(){var el=document.createElement('bootstrap')
var transEndEventNames={'WebkitTransition':'webkitTransitionEnd','MozTransition':'transitionend','OTransition':'oTransitionEnd otransitionend','transition':'transitionend'}
for(var name in transEndEventNames){if(el.style[name]!==undefined){return{end:transEndEventNames[name]}}}
return false}
$.fn.emulateTransitionEnd=function(duration){var called=false,$el=this
$(this).one($.support.transition.end,function(){called=true})
var callback=function(){if(!called)$($el).trigger($.support.transition.end)}
setTimeout(callback,duration)
return this}
$(function(){$.support.transition=transitionEnd()})}(jQuery);+function($){'use strict';var Tab=function(element){this.element=$(element)}
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
$(this).tab('show')})}(jQuery);+function($){'use strict';var Modal=function(element,options){this.options=options
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
$(document).on('show.bs.modal','.modal',function(){$(document.body).addClass('modal-open')}).on('hidden.bs.modal','.modal',function(){$(document.body).removeClass('modal-open')})}(jQuery);+function($){'use strict';var Tooltip=function(element,options){this.type=this.options=this.enabled=this.timeout=this.hoverState=this.$element=null
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
return this}}(jQuery);(function(glob){var version="0.4.2",has="hasOwnProperty",separator=/[\.\/]/,wildcard="*",fun=function(){},numsort=function(a,b){return a-b;},current_event,stop,events={n:{}},eve=function(name,scope){name=String(name);var e=events,oldstop=stop,args=Array.prototype.slice.call(arguments,2),listeners=eve.listeners(name),z=0,f=false,l,indexed=[],queue={},out=[],ce=current_event,errors=[];current_event=name;stop=0;for(var i=0,ii=listeners.length;i<ii;i++)if("zIndex"in listeners[i]){indexed.push(listeners[i].zIndex);if(listeners[i].zIndex<0){queue[listeners[i].zIndex]=listeners[i];}}
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
return true;};var setproto=R.st;for(var method in elproto)if(elproto[has](method)&&!setproto[has](method)){setproto[method]=(function(methodname){return function(){var arg=arguments;return this.forEach(function(el){el[methodname].apply(el,arg);});};})(method);}})();oldRaphael.was?(g.win.Raphael=R):(Raphael=R);return R;}));(function(B){B.color={};B.color.make=function(F,E,C,D){var G={};G.r=F||0;G.g=E||0;G.b=C||0;G.a=D!=null?D:1;G.add=function(J,I){for(var H=0;H<J.length;++H){G[J.charAt(H)]+=I}return G.normalize()};G.scale=function(J,I){for(var H=0;H<J.length;++H){G[J.charAt(H)]*=I}return G.normalize()};G.toString=function(){if(G.a>=1){return"rgb("+[G.r,G.g,G.b].join(",")+")"}else{return"rgba("+[G.r,G.g,G.b,G.a].join(",")+")"}};G.normalize=function(){function H(J,K,I){return K<J?J:(K>I?I:K)}G.r=H(0,parseInt(G.r),255);G.g=H(0,parseInt(G.g),255);G.b=H(0,parseInt(G.b),255);G.a=H(0,G.a,1);return G};G.clone=function(){return B.color.make(G.r,G.b,G.g,G.a)};return G.normalize()};B.color.extract=function(D,C){var E;do{E=D.css(C).toLowerCase();if(E!=""&&E!="transparent"){break}D=D.parent()}while(!B.nodeName(D.get(0),"body"));if(E=="rgba(0, 0, 0, 0)"){E="transparent"}return B.color.parse(E)};B.color.parse=function(F){var E,C=B.color.make;if(E=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(F)){return C(parseInt(E[1],10),parseInt(E[2],10),parseInt(E[3],10))}if(E=/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(F)){return C(parseInt(E[1],10),parseInt(E[2],10),parseInt(E[3],10),parseFloat(E[4]))}if(E=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(F)){return C(parseFloat(E[1])*2.55,parseFloat(E[2])*2.55,parseFloat(E[3])*2.55)}if(E=/rgba\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(F)){return C(parseFloat(E[1])*2.55,parseFloat(E[2])*2.55,parseFloat(E[3])*2.55,parseFloat(E[4]))}if(E=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(F)){return C(parseInt(E[1],16),parseInt(E[2],16),parseInt(E[3],16))}if(E=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(F)){return C(parseInt(E[1]+E[1],16),parseInt(E[2]+E[2],16),parseInt(E[3]+E[3],16))}var D=B.trim(F).toLowerCase();if(D=="transparent"){return C(255,255,255,0)}else{E=A[D]||[0,0,0];return C(E[0],E[1],E[2])}};var A={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0]}})(jQuery);(function($){var hasOwnProperty=Object.prototype.hasOwnProperty;function Canvas(cls,container){var element=container.children("."+cls)[0];if(element==null){element=document.createElement("canvas");element.className=cls;$(element).css({direction:"ltr",position:"absolute",left:0,top:0}).appendTo(container);if(!element.getContext){if(window.G_vmlCanvasManager){element=window.G_vmlCanvasManager.initElement(element);}else{throw new Error("Canvas is not available. If you're using IE with a fall-back such as Excanvas, then there's either a mistake in your conditional include, or the page has no DOCTYPE and is rendering in Quirks Mode.");}}}
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
$.plot.plugins.push({init:init,options:options,name:'time',version:'1.0'});$.plot.formatDate=formatDate;})(jQuery);(function(factory){if(typeof define==='function'&&define.amd){define(['jquery'],factory);}else if(typeof exports==='object'){factory(require('jquery'));}else{factory(jQuery);}}(function(jQuery){var S2=(function(){if(jQuery&&jQuery.fn&&jQuery.fn.select2&&jQuery.fn.select2.amd){var S2=jQuery.fn.select2.amd;}
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
$selection.attr('title',this.$element.attr('title'));$selection.attr('tabindex',this._tabindex);this.$selection=$selection;return $selection;};BaseSelection.prototype.bind=function(container,$container){var self=this;var id=container.id+'-container';var resultsId=container.id+'-results';this.container=container;this.$selection.on('focus',function(evt){self.trigger('focus',evt);});this.$selection.on('blur',function(evt){self.trigger('blur',evt);});this.$selection.on('keydown',function(evt){self.trigger('keypress',evt);if(evt.which===KEYS.SPACE){evt.preventDefault();}});container.on('results:focus',function(params){self.$selection.attr('aria-activedescendant',params.data._resultId);});container.on('selection:update',function(params){self.update(params.data);});container.on('open',function(){self.$selection.attr('aria-expanded','true');self.$selection.attr('aria-owns',resultsId);self._attachCloseHandler(container);});container.on('close',function(){self.$selection.attr('aria-expanded','false');self.$selection.removeAttr('aria-activedescendant');self.$selection.removeAttr('aria-owns');self.$selection.focus();self._detachCloseHandler(container);});container.on('enable',function(){self.$selection.attr('tabindex',self._tabindex);});container.on('disable',function(){self.$selection.attr('tabindex','-1');});};BaseSelection.prototype._attachCloseHandler=function(container){var self=this;$(document.body).on('mousedown.select2.'+container.id,function(e){var $target=$(e.target);var $select=$target.closest('.select2');var $all=$('.select2.select2-container--open');$all.each(function(){var $this=$(this);if(this==$select[0]){return;}
var $element=$this.data('element');$element.select2('close');});});};BaseSelection.prototype._detachCloseHandler=function(container){$(document.body).off('mousedown.select2.'+container.id);};BaseSelection.prototype.position=function($selection,$container){var $selectionContainer=$container.find('.selection');$selectionContainer.append($selection);};BaseSelection.prototype.destroy=function(){this._detachCloseHandler(this.container);};BaseSelection.prototype.update=function(data){throw new Error('The `update` method must be defined in child classes.');};return BaseSelection;});S2.define('select2/selection/single',['jquery','./base','../utils','../keys'],function($,BaseSelection,Utils,KEYS){function SingleSelection(){SingleSelection.__super__.constructor.apply(this,arguments);}
Utils.Extend(SingleSelection,BaseSelection);SingleSelection.prototype.render=function(){var $selection=SingleSelection.__super__.render.call(this);$selection.addClass('select2-selection--single');$selection.html('<span class="select2-selection__rendered"></span>'+'<span class="select2-selection__arrow" role="presentation">'+'<b role="presentation"></b>'+'</span>');return $selection;};SingleSelection.prototype.bind=function(container,$container){var self=this;SingleSelection.__super__.bind.apply(this,arguments);var id=container.id+'-container';this.$selection.find('.select2-selection__rendered').attr('id',id);this.$selection.attr('aria-labelledby',id);this.$selection.on('mousedown',function(evt){if(evt.which!==1){return;}
self.trigger('toggle',{originalEvent:evt});});this.$selection.on('focus',function(evt){});this.$selection.on('blur',function(evt){});container.on('selection:update',function(params){self.update(params.data);});};SingleSelection.prototype.clear=function(){this.$selection.find('.select2-selection__rendered').empty();};SingleSelection.prototype.display=function(data){var template=this.options.get('templateSelection');var escapeMarkup=this.options.get('escapeMarkup');return escapeMarkup(template(data));};SingleSelection.prototype.selectionContainer=function(){return $('<span></span>');};SingleSelection.prototype.update=function(data){if(data.length===0){this.clear();return;}
var selection=data[0];var formatted=this.display(selection);var $rendered=this.$selection.find('.select2-selection__rendered');$rendered.empty().append(formatted);$rendered.prop('title',selection.title||selection.text);};return SingleSelection;});S2.define('select2/selection/multiple',['jquery','./base','../utils'],function($,BaseSelection,Utils){function MultipleSelection($element,options){MultipleSelection.__super__.constructor.apply(this,arguments);}
Utils.Extend(MultipleSelection,BaseSelection);MultipleSelection.prototype.render=function(){var $selection=MultipleSelection.__super__.render.call(this);$selection.addClass('select2-selection--multiple');$selection.html('<ul class="select2-selection__rendered"></ul>');return $selection;};MultipleSelection.prototype.bind=function(container,$container){var self=this;MultipleSelection.__super__.bind.apply(this,arguments);this.$selection.on('click',function(evt){self.trigger('toggle',{originalEvent:evt});});this.$selection.on('click','.select2-selection__choice__remove',function(evt){var $remove=$(this);var $selection=$remove.parent();var data=$selection.data('data');self.trigger('unselect',{originalEvent:evt,data:data});});};MultipleSelection.prototype.clear=function(){this.$selection.find('.select2-selection__rendered').empty();};MultipleSelection.prototype.display=function(data){var template=this.options.get('templateSelection');var escapeMarkup=this.options.get('escapeMarkup');return escapeMarkup(template(data));};MultipleSelection.prototype.selectionContainer=function(){var $container=$('<li class="select2-selection__choice">'+'<span class="select2-selection__choice__remove" role="presentation">'+'&times;'+'</span>'+'</li>');return $container;};MultipleSelection.prototype.update=function(data){this.clear();if(data.length===0){return;}
var $selections=[];for(var d=0;d<data.length;d++){var selection=data[d];var formatted=this.display(selection);var $selection=this.selectionContainer();$selection.append(formatted);$selection.prop('title',selection.title||selection.text);$selection.data('data',selection);$selections.push($selection);}
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
Search.prototype.render=function(decorated){var $search=$('<li class="select2-search select2-search--inline">'+'<input class="select2-search__field" type="search" tabindex="-1"'+' autocomplete="off" autocorrect="off" autocapitalize="off"'+' spellcheck="false" role="textbox" />'+'</li>');this.$searchContainer=$search;this.$search=$search.find('input');var $rendered=decorated.call(this);return $rendered;};Search.prototype.bind=function(decorated,container,$container){var self=this;decorated.call(this,container,$container);container.on('open',function(){self.$search.attr('tabindex',0);self.$search.focus();});container.on('close',function(){self.$search.attr('tabindex',-1);self.$search.val('');self.$search.focus();});container.on('enable',function(){self.$search.prop('disabled',false);});container.on('disable',function(){self.$search.prop('disabled',true);});this.$selection.on('focusin','.select2-search--inline',function(evt){self.trigger('focus',evt);});this.$selection.on('focusout','.select2-search--inline',function(evt){self.trigger('blur',evt);});this.$selection.on('keydown','.select2-search--inline',function(evt){evt.stopPropagation();self.trigger('keypress',evt);self._keyUpPrevented=evt.isDefaultPrevented();var key=evt.which;if(key===KEYS.BACKSPACE&&self.$search.val()===''){var $previousChoice=self.$searchContainer.prev('.select2-selection__choice');if($previousChoice.length>0){var item=$previousChoice.data('data');self.searchRemoveChoice(item);evt.preventDefault();}}});this.$selection.on('input','.select2-search--inline',function(evt){self.$selection.off('keyup.search');});this.$selection.on('keyup.search input','.select2-search--inline',function(evt){self.handleSearch(evt);});};Search.prototype.createPlaceholder=function(decorated,placeholder){this.$search.attr('placeholder',placeholder.text);};Search.prototype.update=function(decorated,data){this.$search.attr('placeholder','');decorated.call(this,data);this.$selection.find('.select2-selection__rendered').append(this.$searchContainer);this.resizeSearch();};Search.prototype.handleSearch=function(){this.resizeSearch();if(!this._keyUpPrevented){var input=this.$search.val();this.trigger('query',{term:input});}
this._keyUpPrevented=false;};Search.prototype.searchRemoveChoice=function(decorated,item){this.trigger('unselect',{data:item});this.trigger('open');this.$search.val(item.text+' ');};Search.prototype.resizeSearch=function(){this.$search.css('width','25px');var width='';if(this.$search.attr('placeholder')!==''){width=this.$selection.find('.select2-selection__rendered').innerWidth();}else{var minimumWidth=this.$search.val().length+1;width=(minimumWidth*0.75)+'em';}
this.$search.css('width',width);};return Search;});S2.define('select2/selection/eventRelay',['jquery'],function($){function EventRelay(){}
EventRelay.prototype.bind=function(decorated,container,$container){var self=this;var relayEvents=['open','opening','close','closing','select','selecting','unselect','unselecting'];var preventableEvents=['opening','closing','selecting','unselecting'];decorated.call(this,container,$container);container.on('*',function(name,params){if($.inArray(name,relayEvents)===-1){return;}
params=params||{};var evt=$.Event('select2:'+name,{params:params});self.$element.trigger(evt);if($.inArray(name,preventableEvents)===-1){return;}
params.prevented=evt.isDefaultPrevented();});};return EventRelay;});S2.define('select2/translation',['jquery','require'],function($,require){function Translation(dict){this.dict=dict||{};}
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
ArrayAdapter.__super__.constructor.call(this,$element,options);}
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
Search.prototype.render=function(decorated){var $rendered=decorated.call(this);var $search=$('<span class="select2-search select2-search--dropdown">'+'<input class="select2-search__field" type="search" tabindex="-1"'+' autocomplete="off" autocorrect="off" autocapitalize="off"'+' spellcheck="false" role="textbox" />'+'</span>');this.$searchContainer=$search;this.$search=$search.find('input');$rendered.prepend($search);return $rendered;};Search.prototype.bind=function(decorated,container,$container){var self=this;decorated.call(this,container,$container);this.$search.on('keydown',function(evt){self.trigger('keypress',evt);self._keyUpPrevented=evt.isDefaultPrevented();});this.$search.on('input',function(evt){$(this).off('keyup');});this.$search.on('keyup input',function(evt){self.handleSearch(evt);});container.on('open',function(){self.$search.attr('tabindex',0);self.$search.focus();window.setTimeout(function(){self.$search.focus();},0);});container.on('close',function(){self.$search.attr('tabindex',-1);self.$search.val('');});container.on('results:all',function(params){if(params.query.term==null||params.query.term===''){var showSearch=self.showSearch(params);if(showSearch){self.$searchContainer.removeClass('select2-search--hide');}else{self.$searchContainer.addClass('select2-search--hide');}}});};Search.prototype.handleSearch=function(evt){if(!this._keyUpPrevented){var input=this.$search.val();this.trigger('query',{term:input});}
this._keyUpPrevented=false;};Search.prototype.showSearch=function(_,params){return true;};return Search;});S2.define('select2/dropdown/hidePlaceholder',[],function(){function HidePlaceholder(decorated,$element,options,dataAdapter){this.placeholder=this.normalizePlaceholder(options.get('placeholder'));decorated.call(this,$element,options,dataAdapter);}
HidePlaceholder.prototype.append=function(decorated,data){data.results=this.removePlaceholder(data.results);decorated.call(this,data);};HidePlaceholder.prototype.normalizePlaceholder=function(_,placeholder){if(typeof placeholder==='string'){placeholder={id:'',text:placeholder};}
return placeholder;};HidePlaceholder.prototype.removePlaceholder=function(_,data){var modifiedData=data.slice(0);for(var d=data.length-1;d>=0;d--){var item=data[d];if(this.placeholder.id===item.id){modifiedData.splice(d,1);}}
return modifiedData;};return HidePlaceholder;});S2.define('select2/dropdown/infiniteScroll',['jquery'],function($){function InfiniteScroll(decorated,$element,options,dataAdapter){this.lastParams={};decorated.call(this,$element,options,dataAdapter);this.$loadingMore=this.createLoadingMore();this.loading=false;}
InfiniteScroll.prototype.append=function(decorated,data){this.$loadingMore.remove();this.loading=false;decorated.call(this,data);if(this.showLoadingMore(data)){this.$results.append(this.$loadingMore);}};InfiniteScroll.prototype.bind=function(decorated,container,$container){var self=this;decorated.call(this,container,$container);container.on('query',function(params){self.lastParams=params;self.loading=true;});container.on('query:append',function(params){self.lastParams=params;self.loading=true;});this.$results.on('scroll',function(){var isLoadMoreVisible=$.contains(document.documentElement,self.$loadingMore[0]);if(self.loading||!isLoadMoreVisible){return;}
var currentOffset=self.$results.offset().top+
self.$results.outerHeight(false);var loadingMoreOffset=self.$loadingMore.offset().top+
self.$loadingMore.outerHeight(false);if(currentOffset+50>=loadingMoreOffset){self.loadMore();}});};InfiniteScroll.prototype.loadMore=function(){this.loading=true;var params=$.extend({},{page:1},this.lastParams);params.page++;this.trigger('query:append',params);};InfiniteScroll.prototype.showLoadingMore=function(_,data){return data.pagination&&data.pagination.more;};InfiniteScroll.prototype.createLoadingMore=function(){var $option=$('<li class="option load-more" role="treeitem"></li>');var message=this.options.get('translations').get('loadingMore');$option.html(message(this.lastParams));return $option;};return InfiniteScroll;});S2.define('select2/dropdown/attachBody',['jquery','../utils'],function($,Utils){function AttachBody(decorated,$element,options){this.$dropdownParent=options.get('dropdownParent')||document.body;decorated.call(this,$element,options);}
AttachBody.prototype.bind=function(decorated,container,$container){var self=this;var setupResultsEvents=false;decorated.call(this,container,$container);container.on('open',function(){self._showDropdown();self._attachPositioningHandler(container);if(!setupResultsEvents){setupResultsEvents=true;container.on('results:all',function(){self._positionDropdown();self._resizeDropdown();});container.on('results:append',function(){self._positionDropdown();self._resizeDropdown();});}});container.on('close',function(){self._hideDropdown();self._detachPositioningHandler(container);});this.$dropdownContainer.on('mousedown.select2',function(evt){evt.stopPropagation();});};AttachBody.prototype.position=function(decorated,$dropdown,$container){$dropdown.attr('class',$container.attr('class'));$dropdown.removeClass('select2');$dropdown.addClass('select2-container--open');$dropdown.css({position:'absolute',top:-999999});this.$container=$container;};AttachBody.prototype.render=function(decorated){var $container=$('<span></span>');var $dropdown=decorated.call(this);$container.append($dropdown);this.$dropdownContainer=$container;return $container;};AttachBody.prototype._hideDropdown=function(decorated){this.$dropdownContainer.detach();};AttachBody.prototype._attachPositioningHandler=function(container){var self=this;var scrollEvent='scroll.select2.'+container.id;var resizeEvent='resize.select2.'+container.id;var orientationEvent='orientationchange.select2.'+container.id;var $watchers=this.$container.parents().filter(Utils.hasScroll);$watchers.each(function(){$(this).data('select2-scroll-position',{x:$(this).scrollLeft(),y:$(this).scrollTop()});});$watchers.on(scrollEvent,function(ev){var position=$(this).data('select2-scroll-position');$(this).scrollTop(position.y);});$(window).on(scrollEvent+' '+resizeEvent+' '+orientationEvent,function(e){self._positionDropdown();self._resizeDropdown();});};AttachBody.prototype._detachPositioningHandler=function(container){var scrollEvent='scroll.select2.'+container.id;var resizeEvent='resize.select2.'+container.id;var orientationEvent='orientationchange.select2.'+container.id;var $watchers=this.$container.parents().filter(Utils.hasScroll);$watchers.off(scrollEvent);$(window).off(scrollEvent+' '+resizeEvent+' '+orientationEvent);};AttachBody.prototype._positionDropdown=function(){var $window=$(window);var isCurrentlyAbove=this.$dropdown.hasClass('select2-dropdown--above');var isCurrentlyBelow=this.$dropdown.hasClass('select2-dropdown--below');var newDirection=null;var position=this.$container.position();var offset=this.$container.offset();offset.bottom=offset.top+this.$container.outerHeight(false);var container={height:this.$container.outerHeight(false)};container.top=offset.top;container.bottom=offset.top+container.height;var dropdown={height:this.$dropdown.outerHeight(false)};var viewport={top:$window.scrollTop(),bottom:$window.scrollTop()+$window.height()};var enoughRoomAbove=viewport.top<(offset.top-dropdown.height);var enoughRoomBelow=viewport.bottom>(offset.bottom+dropdown.height);var css={left:offset.left,top:container.bottom};if(!isCurrentlyAbove&&!isCurrentlyBelow){newDirection='below';}
if(!enoughRoomBelow&&enoughRoomAbove&&!isCurrentlyAbove){newDirection='above';}else if(!enoughRoomAbove&&enoughRoomBelow&&isCurrentlyAbove){newDirection='below';}
if(newDirection=='above'||(isCurrentlyAbove&&newDirection!=='below')){css.top=container.top-dropdown.height;}
if(newDirection!=null){this.$dropdown.removeClass('select2-dropdown--below select2-dropdown--above').addClass('select2-dropdown--'+newDirection);this.$container.removeClass('select2-container--below select2-container--above').addClass('select2-container--'+newDirection);}
this.$dropdownContainer.css(css);};AttachBody.prototype._resizeDropdown=function(){this.$dropdownContainer.width();var css={width:this.$container.outerWidth(false)+'px'};if(this.options.get('dropdownAutoWidth')){css.minWidth=css.width;css.width='auto';}
this.$dropdown.css(css);};AttachBody.prototype._showDropdown=function(decorated){this.$dropdownContainer.appendTo(this.$dropdownParent);this._positionDropdown();this._resizeDropdown();};AttachBody.prototype.destroy=function(decorated){this.$dropdownContainer.off('.select2')
decorated.call(this);}
return AttachBody;});S2.define('select2/dropdown/minimumResultsForSearch',[],function(){function countResults(data){var count=0;for(var d=0;d<data.length;d++){var item=data[d];if(item.children){count+=countResults(item.children);}else{count++;}}
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
var observer=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver;if(observer!=null){this._observer=new observer(function(mutations){$.each(mutations,self._sync);});this._observer.observe(this.$element[0],{attributes:true,subtree:false});}else if(this.$element[0].addEventListener){this.$element[0].addEventListener('DOMAttrModified',self._sync,false);}};Select2.prototype._registerDataEvents=function(){var self=this;this.dataAdapter.on('*',function(name,params){self.trigger(name,params);});};Select2.prototype._registerSelectionEvents=function(){var self=this;var nonRelayEvents=['toggle'];this.selection.on('toggle',function(){self.toggleDropdown();});this.selection.on('*',function(name,params){if($.inArray(name,nonRelayEvents)!==-1){return;}
self.trigger(name,params);});};Select2.prototype._registerDropdownEvents=function(){var self=this;this.dropdown.on('*',function(name,params){self.trigger(name,params);});};Select2.prototype._registerResultsEvents=function(){var self=this;this.results.on('*',function(name,params){self.trigger(name,params);});};Select2.prototype._registerEvents=function(){var self=this;this.on('open',function(){self.$container.addClass('select2-container--open');});this.on('close',function(){self.$container.removeClass('select2-container--open');});this.on('enable',function(){self.$container.removeClass('select2-container--disabled');});this.on('disable',function(){self.$container.addClass('select2-container--disabled');});this.on('focus',function(){self.$container.addClass('select2-container--focus');});this.on('blur',function(){self.$container.removeClass('select2-container--focus');});this.on('query',function(params){if(!self.isOpen()){self.trigger('open');}
this.dataAdapter.query(params,function(data){self.trigger('results:all',{data:data,query:params});});});this.on('query:append',function(params){this.dataAdapter.query(params,function(data){self.trigger('results:append',{data:data,query:params});});});this.on('keypress',function(evt){var key=evt.which;if(self.isOpen()){if(key===KEYS.ENTER){self.trigger('results:select');evt.preventDefault();}else if((key===KEYS.SPACE&&evt.ctrlKey)){self.trigger('results:toggle');evt.preventDefault();}else if(key===KEYS.UP){self.trigger('results:previous');evt.preventDefault();}else if(key===KEYS.DOWN){self.trigger('results:next');evt.preventDefault();}else if(key===KEYS.ESC||key===KEYS.TAB){self.close();evt.preventDefault();}}else{if(key===KEYS.ENTER||key===KEYS.SPACE||((key===KEYS.DOWN||key===KEYS.UP)&&evt.altKey)){self.open();evt.preventDefault();}}});};Select2.prototype._syncAttributes=function(){this.options.set('disabled',this.$element.prop('disabled'));if(this.options.get('disabled')){if(this.isOpen()){this.close();}
this.trigger('disable');}else{this.trigger('enable');}};Select2.prototype.trigger=function(name,args){var actualTrigger=Select2.__super__.trigger;var preTriggerMap={'open':'opening','close':'closing','select':'selecting','unselect':'unselecting'};if(name in preTriggerMap){var preTriggerName=preTriggerMap[name];var preTriggerArgs={prevented:false,name:name,args:args};actualTrigger.call(this,preTriggerName,preTriggerArgs);if(preTriggerArgs.prevented){args.prevented=true;return;}}
actualTrigger.call(this,name,args);};Select2.prototype.toggleDropdown=function(){if(this.options.get('disabled')){return;}
if(this.isOpen()){this.close();}else{this.open();}};Select2.prototype.open=function(){if(this.isOpen()){return;}
this.trigger('query',{});this.trigger('open');};Select2.prototype.close=function(){if(!this.isOpen()){return;}
this.trigger('close');};Select2.prototype.isOpen=function(){return this.$container.hasClass('select2-container--open');};Select2.prototype.enable=function(args){if(this.options.get('debug')&&window.console&&console.warn){console.warn('Select2: The `select2("enable")` method has been deprecated and will'+' be removed in later Select2 versions. Use $element.prop("disabled")'+' instead.');}
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
var containerCssAdapter=this.options.get('adaptContainerCssClass');containerCssAdapter=containerCssAdapter||_containerAdapter;if(containerCssClass.indexOf(':all:')!==-1){containerCssClass=containerCssClass.replace(':all','');var _cssAdapter=containerCssAdapter;containerCssAdapter=function(clazz){var adapted=_cssAdapter(clazz);if(adapted!=null){return adapted+' '+clazz;}
return clazz;};}
var containerCss=this.options.get('containerCss')||{};if($.isFunction(containerCss)){containerCss=containerCss(this.$element);}
CompatUtils.syncCssClasses($container,this.$element,containerCssAdapter);$container.css(containerCss);$container.addClass(containerCssClass);return $container;};return ContainerCSS;});S2.define('select2/compat/dropdownCss',['jquery','./utils'],function($,CompatUtils){function _dropdownAdapter(clazz){return null;}
function DropdownCSS(){}
DropdownCSS.prototype.render=function(decorated){var $dropdown=decorated.call(this);var dropdownCssClass=this.options.get('dropdownCssClass')||'';if($.isFunction(dropdownCssClass)){dropdownCssClass=dropdownCssClass(this.$element);}
var dropdownCssAdapter=this.options.get('adaptDropdownCssClass');dropdownCssAdapter=dropdownCssAdapter||_dropdownAdapter;if(dropdownCssClass.indexOf(':all:')!==-1){dropdownCssClass=dropdownCssClass.replace(':all','');var _cssAdapter=dropdownCssAdapter;dropdownCssAdapter=function(clazz){var adapted=_cssAdapter(clazz);if(adapted!=null){return adapted+' '+clazz;}
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
function shouldAdjustOldDeltas(orgEvent,absDelta){return special.settings.adjustOldDeltas&&orgEvent.type==='mousewheel'&&absDelta%120===0;}}));return{define:S2.define,require:S2.require};}());var select2=S2.require('jquery.select2');jQuery.fn.select2.amd=S2;return select2;}));(function(factory){if(typeof define==='function'&&define.amd){define(['jquery'],factory);}else if(typeof exports==='object'){module.exports=factory;}else{factory(jQuery);}}(function($){var toFix=['wheel','mousewheel','DOMMouseScroll','MozMousePixelScroll'],toBind=('onwheel'in document||document.documentMode>=9)?['wheel']:['mousewheel','DomMouseScroll','MozMousePixelScroll'],slice=Array.prototype.slice,nullLowestDeltaTimeout,lowestDelta;if($.event.fixHooks){for(var i=toFix.length;i;){$.event.fixHooks[toFix[--i]]=$.event.mouseHooks;}}
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
function shouldAdjustOldDeltas(orgEvent,absDelta){return special.settings.adjustOldDeltas&&orgEvent.type==='mousewheel'&&absDelta%120===0;}}));!function($,window,pluginName,undefined){var containerDefaults={drag:true,drop:true,exclude:"",nested:true,vertical:true},groupDefaults={afterMove:function($placeholder,container,$closestItemOrContainer){},containerPath:"",containerSelector:"ol, ul",distance:0,delay:0,handle:"",itemPath:"",itemSelector:"li",bodyClass:"dragging",draggedClass:"dragged",isValidTarget:function($item,container){return true},onCancel:function($item,container,_super,event){},onDrag:function($item,position,_super,event){$item.css(position)},onDragStart:function($item,container,_super,event){$item.css({height:$item.outerHeight(),width:$item.outerWidth()})
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
return this});};}(jQuery,window,'jqSortable');+function($){"use strict";if($.oc===undefined)
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
return el.classList.contains(className);return new RegExp('(^| )'+className+'( |$)','gi').test(el.className);},addClass:function(el,className){var classes=className.split(' ')
for(var i=0,len=classes.length;i<len;i++){var currentClass=classes[i].trim()
if(this.hasClass(el,currentClass))
return
if(el.classList)
el.classList.add(currentClass);else
el.className+=' '+currentClass;}},removeClass:function(el,className){if(el.classList)
el.classList.remove(className);else
el.className=el.className.replace(new RegExp('(^|\\b)'+className.split(' ').join('|')+'(\\b|$)','gi'),' ');},toggleClass:function(el,className,add){if(add===undefined){if(this.hasClass(el,className)){this.removeClass(el,className)}
else{this.addClass(el,className)}}
if(add&&!this.hasClass(el,className)){this.addClass(el,className)
return}
if(!add&&this.hasClass(el,className)){this.removeClass(el,className)
return}},absolutePosition:function(element,ignoreScrolling){var top=ignoreScrolling===true?0:document.body.scrollTop,left=0
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
$.oc.foundation.controlUtils=ControlUtils;$(document).on('ajaxBeforeReplace',function(ev){$.oc.foundation.controlUtils.disposeControls(ev.target)})}(window.jQuery);+function($){"use strict";var FlashMessage=function(options,el){var
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
$(document).render(function(){$('[data-control=flash-message]').each(function(){$.oc.flashMsg($(this).data(),this)})})}(window.jQuery);(function($){$(document).on('keydown','div.custom-checkbox',function(e){if(e.keyCode==32)
e.preventDefault()})
$(document).on('keyup','div.custom-checkbox',function(e){if(e.keyCode==32){var $cb=$('input',this)
if($cb.data('oc-space-timestamp')==e.timeStamp)
return
$cb.get(0).checked=!$cb.get(0).checked
$cb.data('oc-space-timestamp',e.timeStamp)
$cb.trigger('change')
return false}})})(jQuery);+function($){"use strict";var BalloonSelector=function(element,options){this.$el=$(element)
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
$(document).on('render',function(){$('div[data-control=balloon-selector]').balloonSelector()})}(window.jQuery);+function($){"use strict";$(document).on('shown.bs.dropdown','.dropdown',function(){$(document.body).addClass('dropdown-open')
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
$(document.body).removeClass('dropdown-open');})
var $dropdown,$container,$target
function fixDropdownPosition(){var position=$container.offset()
$dropdown.css({position:'fixed',top:position.top-1-$(window).scrollTop()+$target.outerHeight(),left:position.left})}
$(document).on('shown.bs.dropdown','.dropdown.dropdown-fixed',function(event,eventData){$container=$(this)
$dropdown=$('.dropdown-menu',$container)
$target=$(eventData.relatedTarget)
fixDropdownPosition()
$(window).on('scroll.oc.dropdown, resize.oc.dropdown',fixDropdownPosition)})
$(document).on('hidden.bs.dropdown','.dropdown.dropdown-fixed',function(){$(window).off('scroll.oc.dropdown, resize.oc.dropdown',fixDropdownPosition)})}(window.jQuery);+function($){'use strict';var dismiss='[data-dismiss="callout"]'
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
$(document).on('click.oc.callout.data-api',dismiss,Callout.prototype.close)}(jQuery);(function($){$(document).render(function(){$('[data-control="tooltip"], [data-toggle="tooltip"]').tooltip()})})(jQuery);+function($){"use strict";var Base=$.oc.foundation.base,BaseProto=Base.prototype
var Toolbar=function(element,options){var
$el=this.$el=$(element),$toolbar=$el.closest('.control-toolbar')
$.oc.foundation.controlUtils.markDisposable(element)
this.$toolbar=$toolbar
this.options=options||{};var noDragSupport=options.noDragSupport!==undefined&&options.noDragSupport
Base.call(this)
var scrollClassContainer=options.scrollClassContainer!==undefined?options.scrollClassContainer:$el.parent()
$el.dragScroll({scrollClassContainer:scrollClassContainer,noDragSupport:noDragSupport})
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
LoadIndicator.prototype.destroy=function(){this.$el.removeData('oc.loadIndicator')
this.$el=null}
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
this.docClickHandler=null
this.options.onCheckDocumentClickTarget=null}
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
this.reposition()
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
if(!self.options.closeOnEsc){return false}
if(e.keyCode==27){self.hide()
return false}})}}
Popover.prototype.reposition=function(){var
placement=this.calcPlacement(),position=this.calcPosition(placement)
this.$container.removeClass('placement-center placement-bottom placement-top placement-left placement-right')
this.$container.css({left:position.x,top:position.y}).addClass('placement-'+placement)}
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
if(this.options.onCheckDocumentClickTarget&&this.options.onCheckDocumentClickTarget(e.target)){return}
if($.contains(this.$container.get(0),e.target))
return
this.hide();}
Popover.DEFAULTS={placement:'bottom',fallbackPlacement:'bottom',content:'<p>Popover content<p>',width:false,modal:false,highlightModalTarget:false,closeOnPageClick:true,closeOnEsc:true,container:false,containerClass:null,offset:15,useAnimation:false,onCheckDocumentClickTarget:null}
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
$(this).closest('.control-popup').popup('hideLoading')})}(window.jQuery);+function($){"use strict";var ChartUtils=function(){}
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
$.oc.chartUtils=new ChartUtils();}(window.jQuery);+function($){"use strict";var ChartLine=function(element,options){var self=this
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
window.location=href})
$(this).addClass(options.linkedClass)})}
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
this.$el.on('pause.oc.changeMonitor',this.proxy(this.pause))
this.$el.on('resume.oc.changeMonitor',this.proxy(this.resume))
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
if(this.options.inputPresetType=='camel'){var value=toCamel(this.$src.val())}
else{var value=slugify(this.$src.val())}
if(this.options.inputPresetType=='url'){value='/'+value}
return value.replace(/\s/gi,"-")}
InputPreset.DEFAULTS={inputPreset:'',inputPresetType:'slug',inputPresetClosestParent:undefined,inputPresetPrefixInput:undefined}
var old=$.fn.inputPreset
$.fn.inputPreset=function(option){return this.each(function(){var $this=$(this)
var data=$this.data('oc.inputPreset')
var options=$.extend({},InputPreset.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('oc.inputPreset',(data=new InputPreset(this,options)))})}
$.fn.inputPreset.Constructor=InputPreset
$.fn.inputPreset.noConflict=function(){$.fn.inputPreset=old
return this}
$(document).render(function(){$('[data-input-preset]').inputPreset()})}(window.jQuery);+function($){"use strict";var TriggerOn=function(element,options){var $el=this.$el=$(element);this.options=options||{};if(this.options.triggerCondition===false)
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
$(window).trigger('resize')
this.$el.trigger('oc.triggerOn.afterUpdate',status)}
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
$(document).render(function(){$('[data-control="dragvalue"]').dragValue()});}(window.jQuery);+function($){"use strict";var Base=$.oc.foundation.base,BaseProto=Base.prototype
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
return this}}(window.jQuery);+function($){"use strict";var Base=$.oc.foundation.base,BaseProto=Base.prototype
var DragScroll=function(element,options){this.options=$.extend({},DragScroll.DEFAULTS,options)
var
$el=$(element),el=$el.get(0),dragStart=0,startOffset=0,self=this,dragging=false,eventElementName=this.options.vertical?'pageY':'pageX';this.el=$el
this.scrollClassContainer=this.options.scrollClassContainer?$(this.options.scrollClassContainer):$el
Base.call(this)
if(this.options.scrollMarkerContainer){$(this.options.scrollMarkerContainer).append($('<span class="before scroll-marker"></span><span class="after scroll-marker"></span>'))}
$el.mousewheel(function(event){if(!self.options.allowScroll)
return;var offset=self.options.vertical?((event.deltaFactor*event.deltaY)*-1):(event.deltaFactor*event.deltaX)
return!scrollWheel(offset)})
if(!options.noDragSupport){$el.on('mousedown.dragScroll',function(event){if(event.target&&event.target.tagName==='INPUT')
return
startDrag(event)
return false})}
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
DragScroll.DEFAULTS={vertical:false,allowScroll:true,scrollClassContainer:false,scrollMarkerContainer:false,dragClass:'drag',noDragSupport:false,start:function(){},drag:function(){},stop:function(){}}
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
animated=true}
else{offset=$el.get(0).offsetLeft+$el.width()-(this.el.scrollLeft()+this.el.width())
if(offset>0){this.el.animate({'scrollLeft':$el.get(0).offsetLeft+$el.width()-this.el.width()},params)
animated=true}}}
else{offset=$el.get(0).offsetTop-this.el.scrollTop()
if(offset<0){this.el.animate({'scrollTop':$el.get(0).offsetTop},params)
animated=true}
else{offset=$el.get(0).offsetTop-(this.el.scrollTop()+this.el.height())
if(offset>0){this.el.animate({'scrollTop':$el.get(0).offsetTop+$el.height()-this.el.height()},params)
animated=true}}}
if(!animated&&callback!==undefined){callback()}}
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
return this}}(window.jQuery);+function($){"use strict";var Tab=function(element,options){var $el=this.$el=$(element);this.options=options||{}
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
$tabs=$('>li',this.$tabsContainer),tabIndex=$tabs.index(li),time=new Date().getTime(),targetId=this.tabId+'-tab-'+tabIndex+time,$anchor=$('a',li)
$anchor.data('target','#'+targetId).attr('data-target','#'+targetId).attr('data-toggle','tab')
if(!$anchor.attr('title'))
$anchor.attr('title',$anchor.text())
var html=$anchor.html()
$anchor.html('')
$anchor.append($('<span class="title"></span>').append($('<span></span>').html(html)))
var pane=$('> .tab-pane',this.$pagesContainer).eq(tabIndex).attr('id',targetId)
if(!$('span.tab-close',li).length){$(li).append($('<span class="tab-close"><i>&times;</i></span>').click(function(){$(this).trigger('close.oc.tab')
return false}))}
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
$.oc.foundation.controlUtils.disposeControls($pane.get(0))
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
$el.focus()})}(window.jQuery);+function($){"use strict";if($.oc===undefined)
$.oc={}
if($.oc.inspector===undefined)
$.oc.inspector={}
var Base=$.oc.foundation.base,BaseProto=Base.prototype
var Surface=function(containerElement,properties,values,inspectorUniqueId,options,parentSurface,group){if(inspectorUniqueId===undefined){throw new Error('Inspector surface unique ID should be defined.')}
this.options=$.extend({},Surface.DEFAULTS,typeof options=='object'&&options)
this.rawProperties=properties
this.parsedProperties=$.oc.inspector.engine.processPropertyGroups(properties)
this.container=containerElement
this.inspectorUniqueId=inspectorUniqueId
this.values=values!==null?values:{}
this.originalValues=$.extend(true,{},this.values)
this.idCounter=1
this.popupCounter=0
this.parentSurface=parentSurface
this.editors=[]
this.externalParameterEditors=[]
this.tableContainer=null
this.groupManager=null
this.group=null
if(group!==undefined){this.group=group}
if(!this.parentSurface){this.groupManager=new $.oc.inspector.groupManager(this.inspectorUniqueId)}
Base.call(this)
this.init()}
Surface.prototype=Object.create(BaseProto)
Surface.prototype.constructor=Surface
Surface.prototype.dispose=function(){this.unregisterHandlers()
this.disposeControls()
this.disposeEditors()
this.removeElements()
this.disposeExternalParameterEditors()
this.container=null
this.tableContainer=null
this.rawProperties=null
this.parsedProperties=null
this.editors=null
this.externalParameterEditors=null
this.values=null
this.originalValues=null
this.options.onChange=null
this.options.onPopupDisplayed=null
this.options.onPopupHidden=null
this.parentSurface=null
this.groupManager=null
this.group=null
BaseProto.dispose.call(this)}
Surface.prototype.init=function(){if(this.groupManager&&!this.group){this.group=this.groupManager.createGroup('root')}
this.build()
if(!this.parentSurface){$.oc.foundation.controlUtils.markDisposable(this.tableContainer)}
this.registerHandlers()}
Surface.prototype.registerHandlers=function(){if(!this.parentSurface){$(this.tableContainer).one('dispose-control',this.proxy(this.dispose))
$(this.tableContainer).on('click','tr.group, tr.control-group',this.proxy(this.onGroupClick))
$(this.tableContainer).on('focus-control',this.proxy(this.focusFirstEditor))}}
Surface.prototype.unregisterHandlers=function(){if(!this.parentSurface){$(this.tableContainer).off('dispose-control',this.proxy(this.dispose))
$(this.tableContainer).off('click','tr.group, tr.control-group',this.proxy(this.onGroupClick))
$(this.tableContainer).off('focus-control',this.proxy(this.focusFirstEditor))}}
Surface.prototype.build=function(){this.tableContainer=document.createElement('div')
var dataTable=document.createElement('table'),tbody=document.createElement('tbody')
$.oc.foundation.element.addClass(dataTable,'inspector-fields')
if(this.parsedProperties.hasGroups){$.oc.foundation.element.addClass(dataTable,'has-groups')}
var currentGroup=this.group
for(var i=0,len=this.parsedProperties.properties.length;i<len;i++){var property=this.parsedProperties.properties[i]
if(property.itemType=='group'){currentGroup=this.getGroupManager().createGroup(property.groupIndex,this.group)}
else{if(property.groupIndex===undefined){currentGroup=this.group}}
var row=this.buildRow(property,currentGroup)
if(property.itemType=='group')
{this.applyGroupLevelToRow(row,currentGroup.parentGroup)}
else{this.applyGroupLevelToRow(row,currentGroup)}
tbody.appendChild(row)
this.buildEditor(row,property,dataTable,currentGroup)}
dataTable.appendChild(tbody)
this.tableContainer.appendChild(dataTable)
this.container.appendChild(this.tableContainer)
if(this.options.enableExternalParameterEditor){this.buildExternalParameterEditor(tbody)}
if(!this.parentSurface){this.focusFirstEditor()}}
Surface.prototype.moveToContainer=function(newContainer){this.container=newContainer
this.container.appendChild(this.tableContainer)}
Surface.prototype.buildRow=function(property,group){var row=document.createElement('tr'),th=document.createElement('th'),titleSpan=document.createElement('span'),description=this.buildPropertyDescription(property)
if(property.property){row.setAttribute('data-property',property.property)}
this.applyGroupIndexAttribute(property,row,group)
$.oc.foundation.element.addClass(row,this.getRowCssClass(property,group))
this.applyHeadColspan(th,property)
titleSpan.setAttribute('class','title-element')
titleSpan.setAttribute('title',this.escapeJavascriptString(property.title))
this.buildGroupExpandControl(titleSpan,property,false,false,group)
titleSpan.innerHTML+=this.escapeJavascriptString(property.title)
var outerDiv=document.createElement('div'),innerDiv=document.createElement('div')
innerDiv.appendChild(titleSpan)
if(description){innerDiv.appendChild(description)}
outerDiv.appendChild(innerDiv)
th.appendChild(outerDiv)
row.appendChild(th)
return row}
Surface.prototype.focusFirstEditor=function(){if(this.editors.length==0){return}
var groupManager=this.getGroupManager()
for(var i=0,len=this.editors.length;i<len;i++){var editor=this.editors[i],group=editor.parentGroup
if(group&&!this.groupManager.isGroupExpanded(group)){continue}
var externalParameterEditor=this.findExternalParameterEditor(editor.getPropertyName())
if(externalParameterEditor&&externalParameterEditor.isEditorVisible()){externalParameterEditor.focus()
return}
editor.focus()
return}}
Surface.prototype.getRowCssClass=function(property,group){var result=property.itemType
if(property.itemType=='property'){if(group.parentGroup){result+=this.getGroupManager().isGroupExpanded(group)?' expanded':' collapsed'}}
if(property.itemType=='property'&&!property.showExternalParam){result+=' no-external-parameter'}
return result}
Surface.prototype.applyHeadColspan=function(th,property){if(property.itemType=='group'){th.setAttribute('colspan',2)}}
Surface.prototype.buildGroupExpandControl=function(titleSpan,property,force,hasChildSurface,group){if(property.itemType!=='group'&&!force){return}
var groupIndex=this.getGroupManager().getGroupIndex(group),statusClass=this.getGroupManager().isGroupExpanded(group)?'expanded':'',anchor=document.createElement('a')
anchor.setAttribute('class','expandControl '+statusClass)
anchor.setAttribute('href','javascript:;')
anchor.innerHTML='<span>Expand/collapse</span>'
titleSpan.appendChild(anchor)}
Surface.prototype.buildPropertyDescription=function(property){if(property.description===undefined||property.description===null){return null}
var span=document.createElement('span')
span.setAttribute('title',this.escapeJavascriptString(property.description))
span.setAttribute('class','info oc-icon-info with-tooltip')
$(span).tooltip({placement:'auto right',container:'body',delay:500})
return span}
Surface.prototype.buildExternalParameterEditor=function(tbody){var rows=tbody.children
for(var i=0,len=rows.length;i<len;i++){var row=rows[i],property=row.getAttribute('data-property')
if($.oc.foundation.element.hasClass(row,'no-external-parameter')||!property){continue}
var propertyEditor=this.findPropertyEditor(property)
if(propertyEditor&&!propertyEditor.supportsExternalParameterEditor()){continue}
var cell=row.querySelector('td'),propertyDefinition=this.findPropertyDefinition(property),editor=new $.oc.inspector.externalParameterEditor(this,propertyDefinition,cell)
this.externalParameterEditors.push(editor)}}
Surface.prototype.applyGroupIndexAttribute=function(property,row,group,isGroupedControl){if(property.itemType=='group'||isGroupedControl){row.setAttribute('data-group-index',this.getGroupManager().getGroupIndex(group))
row.setAttribute('data-parent-group-index',this.getGroupManager().getGroupIndex(group.parentGroup))}
else{if(group.parentGroup){row.setAttribute('data-parent-group-index',this.getGroupManager().getGroupIndex(group))}}}
Surface.prototype.applyGroupLevelToRow=function(row,group){if(row.hasAttribute('data-group-level')){return}
var th=this.getRowHeadElement(row)
if(th===null){throw new Error('Cannot find TH element for the Inspector row')}
var groupLevel=group.getLevel()
row.setAttribute('data-group-level',groupLevel)
th.children[0].style.marginLeft=groupLevel*10+'px'}
Surface.prototype.toggleGroup=function(row,forceExpand){var link=row.querySelector('a'),groupIndex=row.getAttribute('data-group-index'),table=this.getRootTable(),groupManager=this.getGroupManager(),collapse=true
if($.oc.foundation.element.hasClass(link,'expanded')&&!forceExpand){$.oc.foundation.element.removeClass(link,'expanded')}else{$.oc.foundation.element.addClass(link,'expanded')
collapse=false}
var propertyRows=groupManager.findGroupRows(table,groupIndex,!collapse),duration=Math.round(50/propertyRows.length)
this.expandOrCollapseRows(propertyRows,collapse,duration,forceExpand)
groupManager.setGroupStatus(groupIndex,!collapse)}
Surface.prototype.expandGroupParents=function(group){var groups=group.getGroupAndAllParents(),table=this.getRootTable()
for(var i=groups.length-1;i>=0;i--){var row=groups[i].findGroupRow(table)
if(row){this.toggleGroup(row,true)}}}
Surface.prototype.expandOrCollapseRows=function(rows,collapse,duration,noAnimation){var row=rows.pop(),self=this
if(row){if(!noAnimation){setTimeout(function toggleRow(){$.oc.foundation.element.toggleClass(row,'collapsed',collapse)
$.oc.foundation.element.toggleClass(row,'expanded',!collapse)
self.expandOrCollapseRows(rows,collapse,duration,noAnimation)},duration)}
else{$.oc.foundation.element.toggleClass(row,'collapsed',collapse)
$.oc.foundation.element.toggleClass(row,'expanded',!collapse)
self.expandOrCollapseRows(rows,collapse,duration,noAnimation)}}}
Surface.prototype.getGroupManager=function(){return this.getRootSurface().groupManager}
Surface.prototype.buildEditor=function(row,property,dataTable,group){if(property.itemType!=='property'){return}
this.validateEditorType(property.type)
var cell=document.createElement('td'),type=property.type
row.appendChild(cell)
if(type===undefined){type='string'}
var editor=new $.oc.inspector.propertyEditors[type](this,property,cell,group)
if(editor.isGroupedEditor()){$.oc.foundation.element.addClass(dataTable,'has-groups')
$.oc.foundation.element.addClass(row,'control-group')
this.applyGroupIndexAttribute(property,row,editor.group,true)
this.buildGroupExpandControl(row.querySelector('span.title-element'),property,true,editor.hasChildSurface(),editor.group)
if(cell.children.length==0){row.querySelector('th').setAttribute('colspan',2)
row.removeChild(cell)}}
this.editors.push(editor)}
Surface.prototype.generateSequencedId=function(){this.idCounter++
return this.inspectorUniqueId+'-'+this.idCounter}
Surface.prototype.getPropertyValue=function(property){return this.values[property]}
Surface.prototype.setPropertyValue=function(property,value,supressChangeEvents,forceEditorUpdate){if(value!==undefined){this.values[property]=value}
else{if(this.values[property]!==undefined){delete this.values[property]}}
if(!supressChangeEvents){if(this.originalValues[property]===undefined||!this.comparePropertyValues(this.originalValues[property],value)){this.markPropertyChanged(property,true)}
else{this.markPropertyChanged(property,false)}
this.notifyEditorsPropertyChanged(property,value)
if(this.options.onChange!==null){this.options.onChange(property,value)}}
if(forceEditorUpdate){var editor=this.findPropertyEditor(property)
if(editor){editor.updateDisplayedValue(value)}}
return value}
Surface.prototype.notifyEditorsPropertyChanged=function(property,value){for(var i=0,len=this.editors.length;i<len;i++){var editor=this.editors[i]
editor.onInspectorPropertyChanged(property,value)}}
Surface.prototype.makeCellActive=function(cell){var tbody=cell.parentNode.parentNode.parentNode,cells=tbody.querySelectorAll('tr td')
for(var i=0,len=cells.length;i<len;i++){$.oc.foundation.element.removeClass(cells[i],'active')}
$.oc.foundation.element.addClass(cell,'active')}
Surface.prototype.markPropertyChanged=function(property,changed){var row=this.tableContainer.querySelector('tr[data-property="'+property+'"]')
if(changed){$.oc.foundation.element.addClass(row,'changed')}
else{$.oc.foundation.element.removeClass(row,'changed')}}
Surface.prototype.findPropertyEditor=function(property){for(var i=0,len=this.editors.length;i<len;i++){if(this.editors[i].getPropertyName()==property){return this.editors[i]}}
return null}
Surface.prototype.findExternalParameterEditor=function(property){for(var i=0,len=this.externalParameterEditors.length;i<len;i++){if(this.externalParameterEditors[i].getPropertyName()==property){return this.externalParameterEditors[i]}}
return null}
Surface.prototype.findPropertyDefinition=function(property){for(var i=0,len=this.parsedProperties.properties.length;i<len;i++){var definition=this.parsedProperties.properties[i]
if(definition.property==property){return definition}}
return null}
Surface.prototype.validateEditorType=function(type){if(type===undefined){type='string'}
if($.oc.inspector.propertyEditors[type]===undefined){throw new Error('The Inspector editor class "'+type+'" is not defined in the $.oc.inspector.propertyEditors namespace.')}}
Surface.prototype.popupDisplayed=function(){if(this.popupCounter===0&&this.options.onPopupDisplayed!==null){this.options.onPopupDisplayed()}
this.popupCounter++}
Surface.prototype.popupHidden=function(){this.popupCounter--
if(this.popupCounter<0){this.popupCounter=0}
if(this.popupCounter===0&&this.options.onPopupHidden!==null){this.options.onPopupHidden()}}
Surface.prototype.mergeChildSurface=function(surface,mergeAfterRow){var rows=surface.tableContainer.querySelectorAll('table.inspector-fields > tbody > tr')
surface.tableContainer=this.getRootSurface().tableContainer
for(var i=rows.length-1;i>=0;i--){var row=rows[i]
mergeAfterRow.parentNode.insertBefore(row,mergeAfterRow.nextSibling)
this.applyGroupLevelToRow(row,surface.group)}}
Surface.prototype.getRowHeadElement=function(row){for(var i=row.children.length-1;i>=0;i--){var element=row.children[i]
if(element.tagName==='TH'){return element}}
return null}
Surface.prototype.getInspectorUniqueId=function(){return this.inspectorUniqueId}
Surface.prototype.getRootSurface=function(){var current=this
while(current){if(!current.parentSurface){return current}
current=current.parentSurface}}
Surface.prototype.removeElements=function(){if(!this.parentSurface){this.tableContainer.parentNode.removeChild(this.tableContainer);}}
Surface.prototype.disposeEditors=function(){for(var i=0,len=this.editors.length;i<len;i++){var editor=this.editors[i]
editor.dispose()}}
Surface.prototype.disposeExternalParameterEditors=function(){for(var i=0,len=this.externalParameterEditors.length;i<len;i++){var editor=this.externalParameterEditors[i]
editor.dispose()}}
Surface.prototype.disposeControls=function(){var tooltipControls=this.tableContainer.querySelectorAll('.with-tooltip')
for(var i=0,len=tooltipControls.length;i<len;i++){$(tooltipControls[i]).tooltip('destroy')}}
Surface.prototype.escapeJavascriptString=function(str){var div=document.createElement('div')
div.appendChild(document.createTextNode(str))
return div.innerHTML}
Surface.prototype.comparePropertyValues=function(oldValue,newValue){if(oldValue===undefined&&newValue!==undefined){return false}
if(oldValue!==undefined&&newValue===undefined){return false}
if(typeof oldValue=='object'&&typeof newValue=='object'){return JSON.stringify(oldValue)==JSON.stringify(newValue)}
return oldValue==newValue}
Surface.prototype.getRootTable=function(){return this.getRootSurface().container.querySelector('table.inspector-fields')}
Surface.prototype.getValues=function(){var result={}
for(var i=0,len=this.parsedProperties.properties.length;i<len;i++){var property=this.parsedProperties.properties[i]
if(property.itemType!=='property'){continue}
var value=null,externalParameterEditor=this.findExternalParameterEditor(property.property)
if(!externalParameterEditor||!externalParameterEditor.isEditorVisible()){value=this.getPropertyValue(property.property)
if(value===undefined){var editor=this.findPropertyEditor(property.property)
if(editor){value=editor.getUndefinedValue()}
else{value=property.default}}
if(value===$.oc.inspector.removedProperty){continue}}
else{value=externalParameterEditor.getValue()
value='{{ '+value+' }}'}
result[property.property]=value}
return result}
Surface.prototype.validate=function(){this.getGroupManager().unmarkInvalidGroups(this.getRootTable())
for(var i=0,len=this.editors.length;i<len;i++){var editor=this.editors[i],externalEditor=this.findExternalParameterEditor(editor.propertyDefinition.property)
if(externalEditor&&externalEditor.isEditorVisible()){if(!externalEditor.validate()){editor.markInvalid()
return false}
else{continue}}
if(!editor.validate()){editor.markInvalid()
return false}}
return true}
Surface.prototype.hasChanges=function(){return!this.comparePropertyValues(this.originalValues,this.values)}
Surface.prototype.onGroupClick=function(ev){var row=ev.currentTarget
this.toggleGroup(row)
$.oc.foundation.event.stop(ev)
return false}
Surface.DEFAULTS={enableExternalParameterEditor:false,onChange:null,onPopupDisplayed:null,onPopupHidden:null}
$.oc.inspector.surface=Surface
$.oc.inspector.removedProperty={removed:true}}(window.jQuery);+function($){"use strict";var Base=$.oc.foundation.base,BaseProto=Base.prototype
var InspectorManager=function(){Base.call(this)
this.init()}
InspectorManager.prototype=Object.create(BaseProto)
InspectorManager.prototype.constructor=Base
InspectorManager.prototype.init=function(){$(document).on('click','[data-inspectable]',this.proxy(this.onInspectableClicked))}
InspectorManager.prototype.getContainerElement=function($element){var $containerHolder=$element.closest('[data-inspector-container]')
if($containerHolder.length===0){return null}
var $container=$containerHolder.find($containerHolder.data('inspector-container'))
if($container.length===0){throw new Error('Inspector container '+$containerHolder.data['inspector-container']+' element is not found.')}
return $container}
InspectorManager.prototype.loadElementOptions=function($element){var options={}
if($element.data('inspector-css-class')){options.inspectorCssClass=$element.data('inspector-css-class')}
return options}
InspectorManager.prototype.createInspectorPopup=function($element,containerSupported){var options=$.extend(this.loadElementOptions($element),{containerSupported:containerSupported})
new $.oc.inspector.wrappers.popup($element,null,options)}
InspectorManager.prototype.createInspectorContainer=function($element,$container){var options=$.extend(this.loadElementOptions($element),{containerSupported:true,container:$container})
new $.oc.inspector.wrappers.container($element,null,options)}
InspectorManager.prototype.switchToPopup=function(wrapper){var options=$.extend(this.loadElementOptions(wrapper.$element),{containerSupported:true})
new $.oc.inspector.wrappers.popup(wrapper.$element,wrapper,options)
wrapper.cleanupAfterSwitch()
this.setContainerPreference(false)}
InspectorManager.prototype.switchToContainer=function(wrapper){var $container=this.getContainerElement(wrapper.$element),options=$.extend(this.loadElementOptions(wrapper.$element),{containerSupported:true,container:$container})
if(!$container){throw new Error('Cannot switch to container: a container element is not found')}
new $.oc.inspector.wrappers.container(wrapper.$element,wrapper,options)
wrapper.cleanupAfterSwitch()
this.setContainerPreference(true)}
InspectorManager.prototype.createInspector=function(element){var $element=$(element)
if($element.data('oc.inspectorVisible')){return false}
var $container=this.getContainerElement($element)
if(!$container){this.createInspectorPopup($element,false)}
else{if(!this.applyValuesFromContainer($container)||!this.containerHidingAllowed($container)){return}
$.oc.foundation.controlUtils.disposeControls($container.get(0))
if(!this.getContainerPreference()){this.createInspectorPopup($element,true)}
else{this.createInspectorContainer($element,$container)}}}
InspectorManager.prototype.getContainerPreference=function(){if(!Modernizr.localstorage){return false}
return localStorage.getItem('oc.inspectorUseContainer')==="true"}
InspectorManager.prototype.setContainerPreference=function(value){if(!Modernizr.localstorage){return}
return localStorage.setItem('oc.inspectorUseContainer',value?"true":"false")}
InspectorManager.prototype.applyValuesFromContainer=function($container){var applyEvent=$.Event('apply.oc.inspector')
$container.trigger(applyEvent)
return!applyEvent.isDefaultPrevented();}
InspectorManager.prototype.containerHidingAllowed=function($container){var allowedEvent=$.Event('beforeContainerHide.oc.inspector')
$container.trigger(allowedEvent)
return!allowedEvent.isDefaultPrevented();}
InspectorManager.prototype.onInspectableClicked=function(ev){var $element=$(ev.currentTarget)
if(this.createInspector($element)===false){return false}}
$.oc.inspector.manager=new InspectorManager()
$.fn.inspector=function(){return this.each(function(){$.oc.inspector.manager.createInspector(this)})}}(window.jQuery);+function($){"use strict";if($.oc.inspector===undefined)
$.oc.inspector={}
if($.oc.inspector.wrappers===undefined)
$.oc.inspector.wrappers={}
var Base=$.oc.foundation.base,BaseProto=Base.prototype
var BaseWrapper=function($element,sourceWrapper,options){this.$element=$element
this.options=$.extend({},BaseWrapper.DEFAULTS,typeof options=='object'&&options)
this.switched=false
Base.call(this)
if(!sourceWrapper){if(!this.triggerShowingAndInit()){return}
this.surface=null
this.title=null
this.description=null}
else{this.surface=sourceWrapper.surface
this.title=sourceWrapper.title
this.description=sourceWrapper.description
sourceWrapper=null
this.init()}}
BaseWrapper.prototype=Object.create(BaseProto)
BaseWrapper.prototype.constructor=Base
BaseWrapper.prototype.dispose=function(){if(!this.switched){this.$element.removeClass('inspector-open')
this.setInspectorVisibleFlag(false)
this.$element.trigger('hidden.oc.inspector')}
this.surface=null
this.$element=null
this.title=null
this.description=null
BaseProto.dispose.call(this)}
BaseWrapper.prototype.init=function(){if(!this.surface){this.loadConfiguration()}
else{this.adoptSurface()}
this.$element.addClass('inspector-open')}
BaseWrapper.prototype.getElementValuesInput=function(){return this.$element.find('input[data-inspector-values]')}
BaseWrapper.prototype.normalizePropertyCode=function(code,configuration){var lowerCaseCode=code.toLowerCase()
for(var index in configuration){var propertyInfo=configuration[index]
if(propertyInfo.property.toLowerCase()==lowerCaseCode){return propertyInfo.property}}
return code}
BaseWrapper.prototype.isExternalParametersEditorEnabled=function(){return this.$element.closest('[data-inspector-external-parameters]').length>0}
BaseWrapper.prototype.initSurface=function(containerElement,properties,values){var options=this.$element.data()||{}
options.enableExternalParameterEditor=this.isExternalParametersEditorEnabled()
this.surface=new $.oc.inspector.surface(containerElement,properties,values,$.oc.inspector.helpers.generateElementUniqueId(this.$element.get(0)),options)}
BaseWrapper.prototype.createSurfaceAndUi=function(properties,values){}
BaseWrapper.prototype.setInspectorVisibleFlag=function(value){this.$element.data('oc.inspectorVisible',value)}
BaseWrapper.prototype.adoptSurface=function(){}
BaseWrapper.prototype.cleanupAfterSwitch=function(){this.switched=true
this.dispose()}
BaseWrapper.prototype.loadValues=function(configuration){var $valuesField=this.getElementValuesInput()
if($valuesField.length>0){var valuesStr=$.trim($valuesField.val())
try{return valuesStr.length===0?{}:$.parseJSON(valuesStr)}
catch(err){throw new Error('Error parsing Inspector field values. '+err)}}
var values={},attributes=this.$element.get(0).attributes
for(var i=0,len=attributes.length;i<len;i++){var attribute=attributes[i],matches=[]
if(matches=attribute.name.match(/^data-property-(.*)$/)){var normalizedPropertyName=this.normalizePropertyCode(matches[1],configuration)
values[normalizedPropertyName]=attribute.value}}
return values}
BaseWrapper.prototype.applyValues=function(){var $valuesField=this.getElementValuesInput(),values=this.surface.getValues()
if($valuesField.length>0){$valuesField.val(JSON.stringify(values))}
else{for(var property in values){var value=values[property]
if($.isArray(value)||$.isPlainObject(value)){throw new Error('Inspector data-property-xxx attributes do not support complex values. Property: '+property)}
this.$element.attr('data-property-'+property,value)}}
if(this.surface.hasChanges()){this.$element.trigger('change')}}
BaseWrapper.prototype.loadConfiguration=function(){var configString=this.$element.data('inspector-config'),result={properties:{},title:null,description:null}
result.title=this.$element.data('inspector-title')
result.description=this.$element.data('inspector-description')
if(configString!==undefined){result.properties=this.parseConfiguration(configString)
this.configurationLoaded(result)
return}
var $configurationField=this.$element.find('input[data-inspector-config]')
if($configurationField.length>0){result.properties=this.parseConfiguration($configurationField.val())
this.configurationLoaded(result)
return}
var $form=this.$element.closest('form'),data=this.$element.data(),self=this
$.oc.stripeLoadIndicator.show()
$form.request('onGetInspectorConfiguration',{data:data}).done(function inspectorConfigurationRequestDoneClosure(data){self.onConfigurartionRequestDone(data,result)}).always(function(){$.oc.stripeLoadIndicator.hide()})}
BaseWrapper.prototype.parseConfiguration=function(configuration){if(!$.isArray(configuration)&&!$.isPlainObject(configuration)){if($.trim(configuration)===0){return{}}
try{return $.parseJSON(configuration)}
catch(err){throw new Error('Error parsing Inspector configuration. '+err)}}
else{return configuration}}
BaseWrapper.prototype.configurationLoaded=function(configuration){var values=this.loadValues(configuration.properties)
this.title=configuration.title
this.description=configuration.description
this.createSurfaceAndUi(configuration.properties,values)}
BaseWrapper.prototype.onConfigurartionRequestDone=function(data,result){result.properties=this.parseConfiguration(data.configuration.properties)
if(data.configuration.title!==undefined){result.title=data.configuration.title}
if(data.configuration.description!==undefined){result.description=data.configuration.description}
this.configurationLoaded(result)}
BaseWrapper.prototype.triggerShowingAndInit=function(){var e=$.Event('showing.oc.inspector')
this.$element.trigger(e,[{callback:this.proxy(this.init)}])
if(e.isDefaultPrevented()){this.$element=null
return false}
if(!e.isPropagationStopped()){this.init()}}
BaseWrapper.prototype.triggerHiding=function(){var hidingEvent=$.Event('hiding.oc.inspector'),values=this.surface.getValues()
this.$element.trigger(hidingEvent,[{values:values}])
return!hidingEvent.isDefaultPrevented();}
BaseWrapper.DEFAULTS={containerSupported:false}
$.oc.inspector.wrappers.base=BaseWrapper}(window.jQuery);+function($){"use strict";var Base=$.oc.inspector.wrappers.base,BaseProto=Base.prototype
var InspectorPopup=function($element,surface,options){this.$popoverContainer=null
this.popoverObj=null
this.cleaningUp=false
Base.call(this,$element,surface,options)}
InspectorPopup.prototype=Object.create(BaseProto)
InspectorPopup.prototype.constructor=Base
InspectorPopup.prototype.dispose=function(){this.unregisterHandlers()
this.$popoverContainer=null
this.popoverObj=null
BaseProto.dispose.call(this)}
InspectorPopup.prototype.createSurfaceAndUi=function(properties,values,title,description){this.showPopover()
this.initSurface(this.$popoverContainer.find('[data-surface-container]').get(0),properties,values)
this.repositionPopover()
this.registerPopupHandlers()}
InspectorPopup.prototype.adoptSurface=function(){this.showPopover()
this.surface.moveToContainer(this.$popoverContainer.find('[data-surface-container]').get(0))
this.repositionPopover()
this.registerPopupHandlers()}
InspectorPopup.prototype.cleanupAfterSwitch=function(){this.cleaningUp=true
this.switched=true
this.forceClose()}
InspectorPopup.prototype.getPopoverContents=function(){return'<div class="popover-head">                          \
                    <h3 data-inspector-title></h3>                  \
                    <p data-inspector-description></p>              \
                    <button type="button" class="close"             \
                        data-dismiss="popover"                      \
                        aria-hidden="true">&times;</button>         \
                </div>                                              \
                <form autocomplete="off" onsubmit="return false">   \
                    <div data-surface-container></div>              \
                <form>'}
InspectorPopup.prototype.showPopover=function(){var offset=this.$element.data('inspector-offset'),offsetX=this.$element.data('inspector-offset-x'),offsetY=this.$element.data('inspector-offset-y'),placement=this.$element.data('inspector-placement'),fallbackPlacement=this.$element.data('inspector-fallback-placement')
if(offset===undefined){offset=15}
if(placement===undefined){placement='bottom'}
if(fallbackPlacement===undefined){fallbackPlacement='bottom'}
this.$element.ocPopover({content:this.getPopoverContents(),highlightModalTarget:true,modal:true,placement:placement,fallbackPlacement:fallbackPlacement,containerClass:'control-inspector',container:this.$element.data('inspector-container'),offset:offset,offsetX:offsetX,offsetY:offsetY,width:400})
this.setInspectorVisibleFlag(true)
this.popoverObj=this.$element.data('oc.popover')
this.$popoverContainer=this.popoverObj.$container
this.$popoverContainer.addClass('inspector-temporary-placement')
if(this.options.inspectorCssClass!==undefined){this.$popoverContainer.addClass(this.options.inspectorCssClass)}
if(this.options.containerSupported){var moveToContainerButton=$('<span class="inspector-move-to-container oc-icon-download">')
this.$popoverContainer.find('.popover-head').append(moveToContainerButton)}
this.$popoverContainer.find('[data-inspector-title]').text(this.title)
this.$popoverContainer.find('[data-inspector-description]').text(this.description)}
InspectorPopup.prototype.repositionPopover=function(){this.popoverObj.reposition()
this.$popoverContainer.removeClass('inspector-temporary-placement')
this.$popoverContainer.find('div[data-surface-container] > div').trigger('focus-control')}
InspectorPopup.prototype.forceClose=function(){this.$popoverContainer.trigger('close.oc.popover')}
InspectorPopup.prototype.registerPopupHandlers=function(){this.surface.options.onPopupDisplayed=this.proxy(this.onPopupEditorDisplayed)
this.surface.options.onPopupHidden=this.proxy(this.onPopupEditorHidden)
this.popoverObj.options.onCheckDocumentClickTarget=this.proxy(this.onCheckDocumentClickTarget)
this.$element.on('hiding.oc.popover',this.proxy(this.onBeforeHide))
this.$element.on('hide.oc.popover',this.proxy(this.onHide))
this.$popoverContainer.on('keydown',this.proxy(this.onPopoverKeyDown))
if(this.options.containerSupported){this.$popoverContainer.on('click','span.inspector-move-to-container',this.proxy(this.onMoveToContainer))}}
InspectorPopup.prototype.unregisterHandlers=function(){this.popoverObj.options.onCheckDocumentClickTarget=null
this.$element.off('hiding.oc.popover',this.proxy(this.onBeforeHide))
this.$element.off('hide.oc.popover',this.proxy(this.onHide))
this.$popoverContainer.off('keydown',this.proxy(this.onPopoverKeyDown))
if(this.options.containerSupported){this.$popoverContainer.off('click','span.inspector-move-to-container',this.proxy(this.onMoveToContainer))}
this.surface.options.onPopupDisplayed=null
this.surface.options.onPopupHidden=null}
InspectorPopup.prototype.onBeforeHide=function(ev){if(this.cleaningUp){return}
if(!this.surface.validate()){ev.preventDefault()
return false}
if(!this.triggerHiding()){ev.preventDefault()
return false}
this.applyValues()}
InspectorPopup.prototype.onHide=function(ev){this.dispose()}
InspectorPopup.prototype.onPopoverKeyDown=function(ev){if(ev.keyCode==13){$(ev.currentTarget).trigger('close.oc.popover')}}
InspectorPopup.prototype.onPopupEditorDisplayed=function(){this.popoverObj.options.closeOnPageClick=false
this.popoverObj.options.closeOnEsc=false}
InspectorPopup.prototype.onPopupEditorHidden=function(){this.popoverObj.options.closeOnPageClick=true
this.popoverObj.options.closeOnEsc=true}
InspectorPopup.prototype.onCheckDocumentClickTarget=function(element){if($.contains(this.$element,element)||this.$element.get(0)===element){return true}}
InspectorPopup.prototype.onMoveToContainer=function(){$.oc.inspector.manager.switchToContainer(this)}
$.oc.inspector.wrappers.popup=InspectorPopup}(window.jQuery);+function($){"use strict";var Base=$.oc.inspector.wrappers.base,BaseProto=Base.prototype
var InspectorContainer=function($element,surface,options){if(!options.container){throw new Error('Cannot create Inspector container wrapper without a container element.')}
this.surfaceContainer=null
Base.call(this,$element,surface,options)}
InspectorContainer.prototype=Object.create(BaseProto)
InspectorContainer.prototype.constructor=Base
InspectorContainer.prototype.init=function(){this.registerHandlers()
BaseProto.init.call(this)}
InspectorContainer.prototype.dispose=function(){this.unregisterHandlers()
this.removeControls()
this.surfaceContainer=null
BaseProto.dispose.call(this)}
InspectorContainer.prototype.createSurfaceAndUi=function(properties,values){this.buildUi()
this.initSurface(this.surfaceContainer,properties,values)}
InspectorContainer.prototype.adoptSurface=function(){this.buildUi()
this.surface.moveToContainer(this.surfaceContainer)}
InspectorContainer.prototype.buildUi=function(){var scrollable=this.isScrollable(),head=this.buildHead(),layoutElements=this.buildLayout()
layoutElements.headContainer.appendChild(head)
if(scrollable){var scrollpad=this.buildScrollpad()
this.surfaceContainer=scrollpad.container
layoutElements.bodyContainer.appendChild(scrollpad.scrollpad)
$(scrollpad.scrollpad).scrollpad()}
else{this.surfaceContainer=layoutElements.bodyContainer}
this.setInspectorVisibleFlag(true)}
InspectorContainer.prototype.buildHead=function(){var container=document.createElement('div'),header=document.createElement('h3'),paragraph=document.createElement('p'),detachButton=document.createElement('span'),closeButton=document.createElement('span')
container.setAttribute('class','inspector-header')
detachButton.setAttribute('class','oc-icon-external-link-square detach')
closeButton.setAttribute('class','close')
header.textContent=this.title
paragraph.textContent=this.description
closeButton.innerHTML='&times;';container.appendChild(header)
container.appendChild(paragraph)
container.appendChild(detachButton)
container.appendChild(closeButton)
return container}
InspectorContainer.prototype.buildScrollpad=function(){var scrollpad=document.createElement('div'),scrollWrapper=document.createElement('div'),scrollableContainer=document.createElement('div')
scrollpad.setAttribute('class','control-scrollpad')
scrollpad.setAttribute('data-control','scrollpad')
scrollWrapper.setAttribute('class','scroll-wrapper inspector-wrapper')
scrollpad.appendChild(scrollWrapper)
scrollWrapper.appendChild(scrollableContainer)
return{scrollpad:scrollpad,container:scrollableContainer}}
InspectorContainer.prototype.buildLayout=function(){var layout=document.createElement('div'),headRow=document.createElement('div'),bodyRow=document.createElement('div'),bodyCell=document.createElement('div'),layoutRelative=document.createElement('div')
layout.setAttribute('class','layout')
headRow.setAttribute('class','layout-row min-size')
bodyRow.setAttribute('class','layout-row')
bodyCell.setAttribute('class','layout-cell')
layoutRelative.setAttribute('class','layout-relative')
bodyCell.appendChild(layoutRelative)
bodyRow.appendChild(bodyCell)
layout.appendChild(headRow)
layout.appendChild(bodyRow)
this.options.container.get(0).appendChild(layout)
$.oc.foundation.controlUtils.markDisposable(layout)
this.registerLayoutHandlers(layout)
return{headContainer:headRow,bodyContainer:layoutRelative}}
InspectorContainer.prototype.validateAndApply=function(){if(!this.surface.validate()){return false}
this.applyValues()
return true}
InspectorContainer.prototype.isScrollable=function(){return this.options.container.data('inspector-scrollable')!==undefined}
InspectorContainer.prototype.getLayout=function(){return this.options.container.get(0).querySelector('div.layout')}
InspectorContainer.prototype.registerLayoutHandlers=function(layout){var $layout=$(layout)
$layout.one('dispose-control',this.proxy(this.dispose))
$layout.on('click','span.close',this.proxy(this.onClose))
$layout.on('click','span.detach',this.proxy(this.onDetach))}
InspectorContainer.prototype.registerHandlers=function(){this.options.container.on('apply.oc.inspector',this.proxy(this.onApplyValues))
this.options.container.on('beforeContainerHide.oc.inspector',this.proxy(this.onBeforeHide))}
InspectorContainer.prototype.unregisterHandlers=function(){var $layout=$(this.getLayout())
this.options.container.off('apply.oc.inspector',this.proxy(this.onApplyValues))
this.options.container.off('beforeContainerHide.oc.inspector',this.proxy(this.onBeforeHide))
$layout.off('dispose-control',this.proxy(this.dispose))
$layout.off('click','span.close',this.proxy(this.onClose))
$layout.off('click','span.detach',this.proxy(this.onDetach))}
InspectorContainer.prototype.removeControls=function(){if(this.isScrollable()){this.options.container.find('.control-scrollpad').scrollpad('dispose')}
var layout=this.getLayout()
layout.parentNode.removeChild(layout)}
InspectorContainer.prototype.onApplyValues=function(ev){if(!this.validateAndApply()){ev.preventDefault()
return false}}
InspectorContainer.prototype.onBeforeHide=function(ev){if(!this.triggerHiding()){ev.preventDefault()
return false}}
InspectorContainer.prototype.onClose=function(ev){if(!this.validateAndApply()){ev.preventDefault()
return false}
if(!this.triggerHiding()){ev.preventDefault()
return false}
this.surface.dispose()
this.dispose()}
InspectorContainer.prototype.onDetach=function(){$.oc.inspector.manager.switchToPopup(this)}
$.oc.inspector.wrappers.container=InspectorContainer}(window.jQuery);+function($){"use strict";var GroupManager=function(controlId){this.controlId=controlId
this.rootGroup=null
this.cachedGroupStatuses=null}
GroupManager.prototype.createGroup=function(groupId,parentGroup){var group=new Group(groupId)
if(parentGroup){parentGroup.groups.push(group)
group.parentGroup=parentGroup}
else{this.rootGroup=group}
return group}
GroupManager.prototype.getGroupIndex=function(group){return group.getGroupIndex()}
GroupManager.prototype.isParentGroupExpanded=function(group){if(!group.parentGroup){return true}
return this.isGroupExpanded(group.parentGroup)}
GroupManager.prototype.isGroupExpanded=function(group){if(!group.parentGroup){return true}
var groupIndex=this.getGroupIndex(group),statuses=this.readGroupStatuses()
if(statuses[groupIndex]!==undefined){return statuses[groupIndex]}
return false}
GroupManager.prototype.setGroupStatus=function(groupIndex,expanded){var statuses=this.readGroupStatuses()
statuses[groupIndex]=expanded
this.writeGroupStatuses(statuses)}
GroupManager.prototype.readGroupStatuses=function(){if(this.cachedGroupStatuses!==null){return this.cachedGroupStatuses}
var statuses=getInspectorGroupStatuses()
if(statuses[this.controlId]!==undefined){this.cachedGroupStatuses=statuses[this.controlId]}
else{this.cachedGroupStatuses={}}
return this.cachedGroupStatuses}
GroupManager.prototype.writeGroupStatuses=function(updatedStatuses){var statuses=getInspectorGroupStatuses()
statuses[this.controlId]=updatedStatuses
setInspectorGroupStatuses(statuses)
this.cachedGroupStatuses=updatedStatuses}
GroupManager.prototype.findGroupByIndex=function(index){return this.rootGroup.findGroupByIndex(index)}
GroupManager.prototype.findGroupRows=function(table,index,ignoreCollapsedSubgroups){var group=this.findGroupByIndex(index)
if(!group){throw new Error('Cannot find the requested row group.')}
return group.findGroupRows(table,ignoreCollapsedSubgroups,this)}
GroupManager.prototype.markGroupRowInvalid=function(group,table){var currentGroup=group
while(currentGroup){var row=currentGroup.findGroupRow(table)
if(row){$.oc.foundation.element.addClass(row,'invalid')}
currentGroup=currentGroup.parentGroup}}
GroupManager.prototype.unmarkInvalidGroups=function(table){var rows=table.querySelectorAll('tr.invalid')
for(var i=rows.length-1;i>=0;i--){$.oc.foundation.element.removeClass(rows[i],'invalid')}}
GroupManager.prototype.isRowVisible=function(table,rowGroupIndex){var group=this.findGroupByIndex(index)
if(!group){throw new Error('Cannot find the requested row group.')}
var current=group
while(current){if(!this.isGroupExpanded(current)){return false}
current=current.parentGroup}
return true}
function getInspectorGroupStatuses(){var statuses=document.body.getAttribute('data-inspector-group-statuses')
if(statuses!==null){return JSON.parse(statuses)}
return{}}
function setInspectorGroupStatuses(statuses){document.body.setAttribute('data-inspector-group-statuses',JSON.stringify(statuses))}
var Group=function(groupId){this.groupId=groupId
this.parentGroup=null
this.groupIndex=null
this.groups=[]}
Group.prototype.getGroupIndex=function(){if(this.groupIndex!==null){return this.groupIndex}
var result='',current=this
while(current){if(result.length>0){result=current.groupId+'-'+result}
else{result=String(current.groupId)}
current=current.parentGroup}
this.groupIndex=result
return result}
Group.prototype.findGroupByIndex=function(index){if(this.getGroupIndex()==index){return this}
for(var i=this.groups.length-1;i>=0;i--){var groupResult=this.groups[i].findGroupByIndex(index)
if(groupResult!==null){return groupResult}}
return null}
Group.prototype.getLevel=function(){var current=this,level=-1
while(current){level++
current=current.parentGroup}
return level}
Group.prototype.getGroupAndAllParents=function(){var current=this,result=[]
while(current){result.push(current)
current=current.parentGroup}
return result}
Group.prototype.findGroupRows=function(table,ignoreCollapsedSubgroups,groupManager){var groupIndex=this.getGroupIndex(),rows=table.querySelectorAll('tr[data-parent-group-index="'+groupIndex+'"]'),result=Array.prototype.slice.call(rows)
for(var i=0,len=this.groups.length;i<len;i++){var subgroup=this.groups[i]
if(ignoreCollapsedSubgroups&&!groupManager.isGroupExpanded(subgroup)){continue}
var subgroupRows=subgroup.findGroupRows(table,ignoreCollapsedSubgroups,groupManager)
for(var j=0,subgroupLen=subgroupRows.length;j<subgroupLen;j++){result.push(subgroupRows[j])}}
return result}
Group.prototype.findGroupRow=function(table){return table.querySelector('tr[data-group-index="'+this.groupIndex+'"]')}
$.oc.inspector.groupManager=GroupManager}(window.jQuery);+function($){"use strict";if($.oc===undefined)
$.oc={}
if($.oc.inspector===undefined)
$.oc.inspector={}
$.oc.inspector.engine={}
function findGroup(group,properties){for(var i=0,len=properties.length;i<len;i++){var property=properties[i]
if(property.itemType!==undefined&&property.itemType=='group'&&property.title==group){return property}}
return null}
$.oc.inspector.engine.processPropertyGroups=function(properties){var fields=[],result={hasGroups:false,properties:[]},groupIndex=0
for(var i=0,len=properties.length;i<len;i++){var property=properties[i]
property.itemType='property'
if(property.group===undefined){fields.push(property)}
else{var group=findGroup(property.group,fields)
if(!group){group={itemType:'group',title:property.group,properties:[],groupIndex:groupIndex}
groupIndex++
fields.push(group)}
property.groupIndex=group.groupIndex
group.properties.push(property)}}
for(var i=0,len=fields.length;i<len;i++){var property=fields[i]
result.properties.push(property)
if(property.itemType=='group'){result.hasGroups=true
for(var j=0,propertiesLen=property.properties.length;j<propertiesLen;j++){result.properties.push(property.properties[j])}
delete property.properties}}
return result}}(window.jQuery);+function($){"use strict";if($.oc===undefined)
$.oc={}
if($.oc.inspector===undefined)
$.oc.inspector={}
if($.oc.inspector.propertyEditors===undefined)
$.oc.inspector.propertyEditors={}
var Base=$.oc.foundation.base,BaseProto=Base.prototype
var BaseEditor=function(inspector,propertyDefinition,containerCell,group){this.inspector=inspector
this.propertyDefinition=propertyDefinition
this.containerCell=containerCell
this.containerRow=containerCell.parentNode
this.parentGroup=group
this.group=null
this.childInspector=null
this.validationSet=null
this.disposed=false
Base.call(this)
this.init()}
BaseEditor.prototype=Object.create(BaseProto)
BaseEditor.prototype.constructor=Base
BaseEditor.prototype.dispose=function(){this.disposed=true
this.disposeValidation()
if(this.childInspector){this.childInspector.dispose()}
this.inspector=null
this.propertyDefinition=null
this.containerCell=null
this.containerRow=null
this.childInspector=null
this.parentGroup=null
this.group=null
this.validationSet=null
BaseProto.dispose.call(this)}
BaseEditor.prototype.init=function(){this.build()
this.registerHandlers()
this.initValidation()}
BaseEditor.prototype.build=function(){return null}
BaseEditor.prototype.isDisposed=function(){return this.disposed}
BaseEditor.prototype.registerHandlers=function(){}
BaseEditor.prototype.onInspectorPropertyChanged=function(property,value){}
BaseEditor.prototype.focus=function(){}
BaseEditor.prototype.hasChildSurface=function(){return this.childInspector!==null}
BaseEditor.prototype.getRootSurface=function(){return this.inspector.getRootSurface()}
BaseEditor.prototype.updateDisplayedValue=function(value){}
BaseEditor.prototype.getPropertyName=function(){return this.propertyDefinition.property}
BaseEditor.prototype.getUndefinedValue=function(){return this.propertyDefinition.default===undefined?undefined:this.propertyDefinition.default}
BaseEditor.prototype.throwError=function(errorMessage){throw new Error(errorMessage+' Property: '+this.propertyDefinition.property)}
BaseEditor.prototype.initValidation=function(){this.validationSet=new $.oc.inspector.validationSet(this.propertyDefinition,this.propertyDefinition.property)}
BaseEditor.prototype.disposeValidation=function(){this.validationSet.dispose()}
BaseEditor.prototype.getValueToValidate=function(){return this.inspector.getPropertyValue(this.propertyDefinition.property)}
BaseEditor.prototype.validate=function(){var value=this.getValueToValidate()
if(value===undefined){value=this.getUndefinedValue()}
var validationResult=this.validationSet.validate(value)
if(validationResult!==null){$.oc.flashMsg({text:validationResult,'class':'error','interval':5})
return false}
return true}
BaseEditor.prototype.markInvalid=function(){$.oc.foundation.element.addClass(this.containerRow,'invalid')
this.inspector.getGroupManager().markGroupRowInvalid(this.parentGroup,this.inspector.getRootTable())
this.inspector.getRootSurface().expandGroupParents(this.parentGroup)
this.focus()}
BaseEditor.prototype.supportsExternalParameterEditor=function(){return true}
BaseEditor.prototype.onExternalPropertyEditorHidden=function(){}
BaseEditor.prototype.isGroupedEditor=function(){return false}
BaseEditor.prototype.initControlGroup=function(){this.group=this.inspector.getGroupManager().createGroup(this.propertyDefinition.property,this.parentGroup)}
BaseEditor.prototype.createGroupedRow=function(property){var row=this.inspector.buildRow(property,this.group),groupedClass=this.inspector.getGroupManager().isGroupExpanded(this.group)?'expanded':'collapsed'
this.inspector.applyGroupLevelToRow(row,this.group)
$.oc.foundation.element.addClass(row,'property')
$.oc.foundation.element.addClass(row,groupedClass)
return row}
$.oc.inspector.propertyEditors.base=BaseEditor}(window.jQuery);+function($){"use strict";var Base=$.oc.inspector.propertyEditors.base,BaseProto=Base.prototype
var StringEditor=function(inspector,propertyDefinition,containerCell,group){Base.call(this,inspector,propertyDefinition,containerCell,group)}
StringEditor.prototype=Object.create(BaseProto)
StringEditor.prototype.constructor=Base
StringEditor.prototype.dispose=function(){this.unregisterHandlers()
BaseProto.dispose.call(this)}
StringEditor.prototype.build=function(){var editor=document.createElement('input'),placeholder=this.propertyDefinition.placeholder!==undefined?this.propertyDefinition.placeholder:'',value=this.inspector.getPropertyValue(this.propertyDefinition.property)
editor.setAttribute('type','text')
editor.setAttribute('class','string-editor')
editor.setAttribute('placeholder',placeholder)
if(value===undefined){value=this.propertyDefinition.default}
if(value===undefined){value=''}
editor.value=value
$.oc.foundation.element.addClass(this.containerCell,'text')
this.containerCell.appendChild(editor)}
StringEditor.prototype.updateDisplayedValue=function(value){this.getInput().value=value}
StringEditor.prototype.getInput=function(){return this.containerCell.querySelector('input')}
StringEditor.prototype.focus=function(){this.getInput().focus()
this.onInputFocus()}
StringEditor.prototype.registerHandlers=function(){var input=this.getInput()
input.addEventListener('focus',this.proxy(this.onInputFocus))
input.addEventListener('keyup',this.proxy(this.onInputKeyUp))}
StringEditor.prototype.unregisterHandlers=function(){var input=this.getInput()
input.removeEventListener('focus',this.proxy(this.onInputFocus))
input.removeEventListener('keyup',this.proxy(this.onInputKeyUp))}
StringEditor.prototype.onInputFocus=function(ev){this.inspector.makeCellActive(this.containerCell)}
StringEditor.prototype.onInputKeyUp=function(){var value=$.trim(this.getInput().value)
this.inspector.setPropertyValue(this.propertyDefinition.property,value)}
StringEditor.prototype.onExternalPropertyEditorHidden=function(){this.focus()}
$.oc.inspector.propertyEditors.string=StringEditor}(window.jQuery);+function($){"use strict";var Base=$.oc.inspector.propertyEditors.base,BaseProto=Base.prototype
var CheckboxEditor=function(inspector,propertyDefinition,containerCell,group){Base.call(this,inspector,propertyDefinition,containerCell,group)}
CheckboxEditor.prototype=Object.create(BaseProto)
CheckboxEditor.prototype.constructor=Base
CheckboxEditor.prototype.dispose=function(){this.unregisterHandlers()
BaseProto.dispose.call(this)}
CheckboxEditor.prototype.build=function(){var editor=document.createElement('input'),container=document.createElement('div'),value=this.inspector.getPropertyValue(this.propertyDefinition.property),label=document.createElement('label'),isChecked=false,id=this.inspector.generateSequencedId()
container.setAttribute('tabindex',0)
container.setAttribute('class','custom-checkbox nolabel')
editor.setAttribute('type','checkbox')
editor.setAttribute('value','1')
editor.setAttribute('placeholder','placeholder')
editor.setAttribute('id',id)
label.setAttribute('for',id)
label.textContent=this.propertyDefinition.title
container.appendChild(editor)
container.appendChild(label)
if(value===undefined){if(this.propertyDefinition.default!==undefined){isChecked=this.normalizeCheckedValue(this.propertyDefinition.default)}}
else{isChecked=this.normalizeCheckedValue(value)}
editor.checked=isChecked
this.containerCell.appendChild(container)}
CheckboxEditor.prototype.normalizeCheckedValue=function(value){if(value=='0'||value=='false'){return false}
return value}
CheckboxEditor.prototype.getInput=function(){return this.containerCell.querySelector('input')}
CheckboxEditor.prototype.focus=function(){this.getInput().parentNode.focus()}
CheckboxEditor.prototype.updateDisplayedValue=function(value){this.getInput().checked=this.normalizeCheckedValue(value)}
CheckboxEditor.prototype.registerHandlers=function(){var input=this.getInput()
input.addEventListener('change',this.proxy(this.onInputChange))}
CheckboxEditor.prototype.unregisterHandlers=function(){var input=this.getInput()
input.removeEventListener('change',this.proxy(this.onInputChange))}
CheckboxEditor.prototype.onInputChange=function(){var isChecked=this.getInput().checked
this.inspector.setPropertyValue(this.propertyDefinition.property,isChecked?1:0)}
$.oc.inspector.propertyEditors.checkbox=CheckboxEditor}(window.jQuery);+function($){"use strict";var Base=$.oc.inspector.propertyEditors.base,BaseProto=Base.prototype
var DropdownEditor=function(inspector,propertyDefinition,containerCell,group){this.indicatorContainer=null
Base.call(this,inspector,propertyDefinition,containerCell,group)}
DropdownEditor.prototype=Object.create(BaseProto)
DropdownEditor.prototype.constructor=Base
DropdownEditor.prototype.init=function(){this.dynamicOptions=this.propertyDefinition.options?false:true
this.initialization=false
BaseProto.init.call(this)}
DropdownEditor.prototype.dispose=function(){this.unregisterHandlers()
this.destroyCustomSelect()
this.indicatorContainer=null
BaseProto.dispose.call(this)}
DropdownEditor.prototype.build=function(){var select=document.createElement('select')
$.oc.foundation.element.addClass(this.containerCell,'dropdown')
$.oc.foundation.element.addClass(select,'custom-select')
if(!this.dynamicOptions){this.loadStaticOptions(select)}
this.containerCell.appendChild(select)
this.initCustomSelect()
if(this.dynamicOptions){this.loadDynamicOptions(true)}}
DropdownEditor.prototype.createOption=function(select,title,value){var option=document.createElement('option')
if(title!==null){option.textContent=title}
if(value!==null){option.value=value}
select.appendChild(option)}
DropdownEditor.prototype.createOptions=function(select,options){for(var value in options){this.createOption(select,options[value],value)}}
DropdownEditor.prototype.initCustomSelect=function(){var select=this.getSelect()
if(Modernizr.touch){return}
var options={dropdownCssClass:'ocInspectorDropdown'}
if(this.propertyDefinition.placeholder!==undefined){options.placeholder=this.propertyDefinition.placeholder}
$(select).select2(options)
if(!Modernizr.touch){this.indicatorContainer=$('.select2-container',this.containerCell)
this.indicatorContainer.addClass('loading-indicator-container size-small')}}
DropdownEditor.prototype.createPlaceholder=function(select){var placeholder=this.propertyDefinition.placeholder
if(placeholder!==undefined&&!Modernizr.touch){this.createOption(select,null,null)}
if(placeholder!==undefined&&Modernizr.touch){this.createOption(select,placeholder,null)}}
DropdownEditor.prototype.getSelect=function(){return this.containerCell.querySelector('select')}
DropdownEditor.prototype.clearOptions=function(select){while(select.firstChild){select.removeChild(select.firstChild)}}
DropdownEditor.prototype.hasOptionValue=function(select,value){var options=select.children
for(var i=0,len=options.length;i<len;i++){if(options[i].value==value){return true}}
return false}
DropdownEditor.prototype.registerHandlers=function(){var select=this.getSelect()
$(select).on('change',this.proxy(this.onSelectionChange))}
DropdownEditor.prototype.onSelectionChange=function(){var select=this.getSelect()
this.inspector.setPropertyValue(this.propertyDefinition.property,select.value,this.initialization)}
DropdownEditor.prototype.onInspectorPropertyChanged=function(property,value){if(!this.propertyDefinition.depends||this.propertyDefinition.depends.indexOf(property)===-1){return}
var dependencyValues=this.getDependencyValues()
if(this.prevDependencyValues===undefined||this.prevDependencyValues!=dependencyValues){this.loadDynamicOptions()}}
DropdownEditor.prototype.onExternalPropertyEditorHidden=function(){this.loadDynamicOptions(false)}
DropdownEditor.prototype.updateDisplayedValue=function(value){var select=this.getSelect()
select.value=value}
DropdownEditor.prototype.getUndefinedValue=function(){if(this.propertyDefinition.default!==undefined){return this.propertyDefinition.default}
if(this.propertyDefinition.placeholder!==undefined){return undefined}
var select=this.getSelect()
if(select){return select.value}
return undefined}
DropdownEditor.prototype.destroyCustomSelect=function(){var $select=$(this.getSelect())
if($select.data('select2')!=null){$select.select2('destroy')}}
DropdownEditor.prototype.unregisterHandlers=function(){var select=this.getSelect()
$(select).off('change',this.proxy(this.onSelectionChange))}
DropdownEditor.prototype.loadStaticOptions=function(select){var value=this.inspector.getPropertyValue(this.propertyDefinition.property)
this.createPlaceholder(select)
this.createOptions(select,this.propertyDefinition.options)
if(value===undefined){value=this.propertyDefinition.default}
select.value=value}
DropdownEditor.prototype.loadDynamicOptions=function(initialization){var currentValue=this.inspector.getPropertyValue(this.propertyDefinition.property),data=this.inspector.getValues(),self=this,$form=$(this.getSelect()).closest('form')
if(currentValue===undefined){currentValue=this.propertyDefinition.default}
if(this.propertyDefinition.depends){this.saveDependencyValues()}
data['inspectorProperty']=this.propertyDefinition.property
data['inspectorClassName']=this.inspector.options.inspectorClass
this.showLoadingIndicator()
$form.request('onInspectableGetOptions',{data:data,}).done(function dropdownOptionsRequestDoneClosure(data){self.optionsRequestDone(data,currentValue,true)}).always(this.proxy(this.hideLoadingIndicator))}
DropdownEditor.prototype.saveDependencyValues=function(){this.prevDependencyValues=this.getDependencyValues()}
DropdownEditor.prototype.getDependencyValues=function(){var result=''
for(var i=0,len=this.propertyDefinition.depends.length;i<len;i++){var property=this.propertyDefinition.depends[i],value=this.inspector.getPropertyValue(property)
if(value===undefined){value='';}
result+=property+':'+value+'-'}
return result}
DropdownEditor.prototype.showLoadingIndicator=function(){if(!Modernizr.touch){this.indicatorContainer.loadIndicator()}}
DropdownEditor.prototype.hideLoadingIndicator=function(){if(this.isDisposed()){return}
if(!Modernizr.touch){this.indicatorContainer.loadIndicator('hide')
this.indicatorContainer.loadIndicator('destroy')}}
DropdownEditor.prototype.optionsRequestDone=function(data,currentValue,initialization){if(this.isDisposed()){return}
var select=this.getSelect()
this.destroyCustomSelect()
this.clearOptions(select)
this.initCustomSelect()
this.createPlaceholder(select)
if(data.options){for(var i=0,len=data.options.length;i<len;i++){this.createOption(select,data.options[i].title,data.options[i].value)}}
if(this.hasOptionValue(select,currentValue)){select.value=currentValue}
else{select.selectedIndex=this.propertyDefinition.placeholder===undefined?0:-1}
this.initialization=initialization
$(select).trigger('change')
this.initialization=false}
$.oc.inspector.propertyEditors.dropdown=DropdownEditor}(window.jQuery);+function($){"use strict";var Base=$.oc.inspector.propertyEditors.base,BaseProto=Base.prototype
var PopupBase=function(inspector,propertyDefinition,containerCell,group){this.popup=null
Base.call(this,inspector,propertyDefinition,containerCell,group)}
PopupBase.prototype=Object.create(BaseProto)
PopupBase.prototype.constructor=Base
PopupBase.prototype.dispose=function(){this.unregisterHandlers()
this.popup=null
BaseProto.dispose.call(this)}
PopupBase.prototype.build=function(){var link=document.createElement('a')
$.oc.foundation.element.addClass(link,'trigger')
link.setAttribute('href','#')
this.setLinkText(link)
$.oc.foundation.element.addClass(this.containerCell,'trigger-cell')
this.containerCell.appendChild(link)}
PopupBase.prototype.setLinkText=function(link,value){}
PopupBase.prototype.getPopupContent=function(){return'<form>                                                                                  \
                <div class="modal-header">                                                              \
                    <button type="button" class="close" data-dismiss="popup">&times;</button>           \
                    <h4 class="modal-title">{{property}}</h4>                                           \
                </div>                                                                                  \
                <div class="modal-body">                                                                \
                    <div class="form-group">                                                            \
                    </div>                                                                              \
                </div>                                                                                  \
                <div class="modal-footer">                                                              \
                    <button type="submit" class="btn btn-primary">OK</button>                           \
                    <button type="button" class="btn btn-default" data-dismiss="popup">Cancel</button>   \
                </div>                                                                                  \
                </form>'}
PopupBase.prototype.updateDisplayedValue=function(value){this.setLinkText(this.getLink(),value)}
PopupBase.prototype.registerHandlers=function(){var link=this.getLink(),$link=$(link)
link.addEventListener('click',this.proxy(this.onTriggerClick))
$link.on('shown.oc.popup',this.proxy(this.onPopupShown))
$link.on('hidden.oc.popup',this.proxy(this.onPopupHidden))}
PopupBase.prototype.unregisterHandlers=function(){var link=this.getLink(),$link=$(link)
link.removeEventListener('click',this.proxy(this.onTriggerClick))
$link.off('shown.oc.popup',this.proxy(this.onPopupShown))
$link.off('hidden.oc.popup',this.proxy(this.onPopupHidden))}
PopupBase.prototype.getLink=function(){return this.containerCell.querySelector('a.trigger')}
PopupBase.prototype.configurePopup=function(popup){}
PopupBase.prototype.handleSubmit=function($form){}
PopupBase.prototype.hidePopup=function(){$(this.getLink()).popup('hide')}
PopupBase.prototype.onTriggerClick=function(ev){$.oc.foundation.event.stop(ev)
var content=this.getPopupContent()
content=content.replace('{{property}}',this.propertyDefinition.title)
$(ev.target).popup({content:content})
return false}
PopupBase.prototype.onPopupShown=function(ev,link,popup){$(popup).on('submit.inspector','form',this.proxy(this.onSubmit))
this.popup=popup.get(0)
this.configurePopup(popup)
this.getRootSurface().popupDisplayed()}
PopupBase.prototype.onPopupHidden=function(ev,link,popup){$(popup).off('.inspector','form',this.proxy(this.onSubmit))
this.popup=null
this.getRootSurface().popupHidden()}
PopupBase.prototype.onSubmit=function(ev){ev.preventDefault()
if(this.handleSubmit($(ev.target))===false){return false}
this.setLinkText(this.getLink())
this.hidePopup()
return false}
$.oc.inspector.propertyEditors.popupBase=PopupBase}(window.jQuery);+function($){"use strict";var Base=$.oc.inspector.propertyEditors.popupBase,BaseProto=Base.prototype
var TextEditor=function(inspector,propertyDefinition,containerCell,group){Base.call(this,inspector,propertyDefinition,containerCell,group)}
TextEditor.prototype=Object.create(BaseProto)
TextEditor.prototype.constructor=Base
TextEditor.prototype.setLinkText=function(link,value){var value=value!==undefined?value:this.inspector.getPropertyValue(this.propertyDefinition.property)
if(value===undefined){value=this.propertyDefinition.default}
if(!value){value=this.propertyDefinition.placeholder
$.oc.foundation.element.addClass(link,'placeholder')}
else{$.oc.foundation.element.removeClass(link,'placeholder')}
if(typeof value==='string'){value=value.replace(/(?:\r\n|\r|\n)/g,' ');value=$.trim(value)
value=value.substring(0,300);}
link.textContent=value}
TextEditor.prototype.getPopupContent=function(){return'<form>                                                                                  \
                <div class="modal-header">                                                              \
                    <button type="button" class="close" data-dismiss="popup">&times;</button>           \
                    <h4 class="modal-title">{{property}}</h4>                                           \
                </div>                                                                                  \
                <div class="modal-body">                                                                \
                    <div class="form-group">                                                            \
                        <textarea class="form-control size-small field-textarea" name="name" value=""/> \
                    </div>                                                                              \
                </div>                                                                                  \
                <div class="modal-footer">                                                              \
                    <button type="submit" class="btn btn-primary">OK</button>                           \
                    <button type="button" class="btn btn-default" data-dismiss="popup">Cancel</button>   \
                </div>                                                                                  \
                </form>'}
TextEditor.prototype.configurePopup=function(popup){var $textarea=$(popup).find('textarea'),value=this.inspector.getPropertyValue(this.propertyDefinition.property)
if(this.propertyDefinition.placeholder){$textarea.attr('placeholder',this.propertyDefinition.placeholder)}
if(value===undefined){value=this.propertyDefinition.default}
$textarea.val(value)
$textarea.focus()}
TextEditor.prototype.handleSubmit=function($form){var $textarea=$form.find('textarea'),link=this.getLink(),value=$.trim($textarea.val())
this.inspector.setPropertyValue(this.propertyDefinition.property,value)}
$.oc.inspector.propertyEditors.text=TextEditor}(window.jQuery);+function($){"use strict";var Base=$.oc.inspector.propertyEditors.base,BaseProto=Base.prototype
var SetEditor=function(inspector,propertyDefinition,containerCell,group){this.editors=[]
this.loadedItems=null
Base.call(this,inspector,propertyDefinition,containerCell,group)}
SetEditor.prototype=Object.create(BaseProto)
SetEditor.prototype.constructor=Base
SetEditor.prototype.init=function(){this.initControlGroup()
BaseProto.init.call(this)}
SetEditor.prototype.dispose=function(){this.disposeEditors()
this.disposeControls()
this.editors=null
BaseProto.dispose.call(this)}
SetEditor.prototype.build=function(){var link=document.createElement('a')
$.oc.foundation.element.addClass(link,'trigger')
link.setAttribute('href','#')
this.setLinkText(link)
$.oc.foundation.element.addClass(this.containerCell,'trigger-cell')
this.containerCell.appendChild(link)
if(this.propertyDefinition.items!==undefined){this.loadStaticItems()}
else{this.loadDynamicItems()}}
SetEditor.prototype.loadStaticItems=function(){var itemArray=[]
for(var itemValue in this.propertyDefinition.items){itemArray.push({value:itemValue,title:this.propertyDefinition.items[itemValue]})}
for(var i=itemArray.length-1;i>=0;i--){this.buildItemEditor(itemArray[i].value,itemArray[i].title)}}
SetEditor.prototype.setLinkText=function(link,value){var value=(value!==undefined&&value!==null)?value:this.getNormalizedValue(),text='[ ]'
if(value===undefined){value=this.propertyDefinition.default}
if(value!==undefined&&value.length!==undefined&&value.length>0&&typeof value!=='string'){var textValues=[]
for(var i=0,len=value.length;i<len;i++){textValues.push(this.valueToText(value[i]))}
text='['+textValues.join(', ')+']'
$.oc.foundation.element.removeClass(link,'placeholder')}
else{text=this.propertyDefinition.placeholder
if((typeof text==='string'&&text.length==0)||text===undefined){text='[ ]'}
$.oc.foundation.element.addClass(link,'placeholder')}
link.textContent=text}
SetEditor.prototype.buildItemEditor=function(value,text){var property={title:text,itemType:'property',groupIndex:this.group.getGroupIndex()},newRow=this.createGroupedRow(property),currentRow=this.containerCell.parentNode,tbody=this.containerCell.parentNode.parentNode,cell=document.createElement('td')
this.buildCheckbox(cell,value,text)
newRow.appendChild(cell)
tbody.insertBefore(newRow,currentRow.nextSibling)}
SetEditor.prototype.buildCheckbox=function(cell,value,title){var property={property:value,title:title,default:this.isCheckedByDefault(value)},editor=new $.oc.inspector.propertyEditors.checkbox(this,property,cell,this.group)
this.editors.push[editor]}
SetEditor.prototype.isCheckedByDefault=function(value){if(!this.propertyDefinition.default){return false}
return this.propertyDefinition.default.indexOf(value)>-1}
SetEditor.prototype.showLoadingIndicator=function(){$(this.getLink()).loadIndicator()}
SetEditor.prototype.hideLoadingIndicator=function(){if(this.isDisposed()){return}
var $link=$(this.getLink())
$link.loadIndicator('hide')
$link.loadIndicator('destroy')}
SetEditor.prototype.loadDynamicItems=function(){var link=this.getLink(),data=this.inspector.getValues(),$form=$(link).closest('form')
$.oc.foundation.element.addClass(link,'loading-indicator-container size-small')
this.showLoadingIndicator()
data['inspectorProperty']=this.propertyDefinition.property
data['inspectorClassName']=this.inspector.options.inspectorClass
$form.request('onInspectableGetOptions',{data:data,}).done(this.proxy(this.itemsRequestDone)).always(this.proxy(this.hideLoadingIndicator))}
SetEditor.prototype.itemsRequestDone=function(data,currentValue,initialization){if(this.isDisposed()){return}
this.loadedItems={}
if(data.options){for(var i=data.options.length-1;i>=0;i--){this.buildItemEditor(data.options[i].value,data.options[i].title)
this.loadedItems[data.options[i].value]=data.options[i].title}}
this.setLinkText(this.getLink())}
SetEditor.prototype.getLink=function(){return this.containerCell.querySelector('a.trigger')}
SetEditor.prototype.getItemsSource=function(){if(this.propertyDefinition.items!==undefined){return this.propertyDefinition.items}
return this.loadedItems}
SetEditor.prototype.valueToText=function(value){var source=this.getItemsSource()
if(!source){return value}
for(var itemValue in source){if(itemValue==value){return source[itemValue]}}
return value}
SetEditor.prototype.cleanUpValue=function(value){if(!value){return value}
var result=[],source=this.getItemsSource()
for(var i=0,len=value.length;i<len;i++){var currentValue=value[i]
if(source[currentValue]!==undefined){result.push(currentValue)}}
return result}
SetEditor.prototype.getNormalizedValue=function(){var value=this.inspector.getPropertyValue(this.propertyDefinition.property)
if(value===null){value=undefined}
if(value===undefined){return value}
if(value.length===undefined||typeof value==='string'){return undefined}
return value}
SetEditor.prototype.supportsExternalParameterEditor=function(){return false}
SetEditor.prototype.isGroupedEditor=function(){return true}
SetEditor.prototype.getPropertyValue=function(checkboxValue){var value=this.getNormalizedValue()
if(value===undefined){return this.isCheckedByDefault(checkboxValue)}
if(!value){return false}
return value.indexOf(checkboxValue)>-1}
SetEditor.prototype.setPropertyValue=function(checkboxValue,isChecked){var currentValue=this.getNormalizedValue()
if(currentValue===undefined){currentValue=this.propertyDefinition.default}
if(!currentValue){currentValue=[]}
if(isChecked){if(currentValue.indexOf(checkboxValue)===-1){currentValue.push(checkboxValue)}}
else{var index=currentValue.indexOf(checkboxValue)
if(index!==-1){currentValue.splice(index,1)}}
this.inspector.setPropertyValue(this.propertyDefinition.property,this.cleanUpValue(currentValue))
this.setLinkText(this.getLink())}
SetEditor.prototype.generateSequencedId=function(){return this.inspector.generateSequencedId()}
SetEditor.prototype.disposeEditors=function(){for(var i=0,len=this.editors.length;i<len;i++){var editor=this.editors[i]
editor.dispose()}}
SetEditor.prototype.disposeControls=function(){var link=this.getLink()
if(this.propertyDefinition.items===undefined){$(link).loadIndicator('destroy')}
link.parentNode.removeChild(link)}
$.oc.inspector.propertyEditors.set=SetEditor}(window.jQuery);+function($){"use strict";var Base=$.oc.inspector.propertyEditors.base,BaseProto=Base.prototype
var ObjectListEditor=function(inspector,propertyDefinition,containerCell,group){this.currentRowInspector=null
this.popup=null
if(propertyDefinition.titleProperty===undefined){throw new Error('The titleProperty property should be specified in the objectList editor configuration. Property: '+propertyDefinition.property)}
if(propertyDefinition.itemProperties===undefined){throw new Error('The itemProperties property should be specified in the objectList editor configuration. Property: '+propertyDefinition.property)}
Base.call(this,inspector,propertyDefinition,containerCell,group)}
ObjectListEditor.prototype=Object.create(BaseProto)
ObjectListEditor.prototype.constructor=Base
ObjectListEditor.prototype.init=function(){if(this.isKeyValueMode()){var keyProperty=this.getKeyProperty()
if(!keyProperty){throw new Error('Object list key property '+this.propertyDefinition.keyProperty
+' is not defined in itemProperties. Property: '+this.propertyDefinition.property)}}
BaseProto.init.call(this)}
ObjectListEditor.prototype.dispose=function(){this.unregisterHandlers()
this.removeControls()
this.currentRowInspector=null
this.popup=null
BaseProto.dispose.call(this)}
ObjectListEditor.prototype.supportsExternalParameterEditor=function(){return false}
ObjectListEditor.prototype.build=function(){var link=document.createElement('a')
$.oc.foundation.element.addClass(link,'trigger')
link.setAttribute('href','#')
this.setLinkText(link)
$.oc.foundation.element.addClass(this.containerCell,'trigger-cell')
this.containerCell.appendChild(link)}
ObjectListEditor.prototype.setLinkText=function(link,value){var value=value!==undefined&&value!==null?value:this.inspector.getPropertyValue(this.propertyDefinition.property)
if(value===null){value=undefined}
if(value===undefined){var placeholder=this.propertyDefinition.placeholder
if(placeholder!==undefined){$.oc.foundation.element.addClass(link,'placeholder')
link.textContent=placeholder}
else{link.textContent='Items: 0'}}
else{var itemCount=0
if(!this.isKeyValueMode()){if(value.length===undefined){throw new Error('Object list value should be an array. Property: '+this.propertyDefinition.property)}
itemCount=value.length}
else{if(typeof value!=='object'){throw new Error('Object list value should be an object. Property: '+this.propertyDefinition.property)}
itemCount=this.getValueKeys(value).length}
$.oc.foundation.element.removeClass(link,'placeholder')
link.textContent='Items: '+itemCount}}
ObjectListEditor.prototype.getPopupContent=function(){return'<form>                                                                                  \
                <div class="modal-header">                                                              \
                    <button type="button" class="close" data-dismiss="popup">&times;</button>           \
                    <h4 class="modal-title">{{property}}</h4>                                           \
                </div>                                                                                  \
                <div>                                                                                   \
                    <div class="layout inspector-columns-editor">                                       \
                        <div class="layout-row">                                                        \
                            <div class="layout-cell items-column">                                      \
                                <div class="layout-relative">                                           \
                                    <div class="layout">                                                \
                                        <div class="layout-row min-size">                               \
                                            <div class="control-toolbar toolbar-padded">                \
                                                <div class="toolbar-item">                              \
                                                    <div class="btn-group">                             \
                                                        <button type="button" class="btn btn-primary    \
                                                            oc-icon-plus"                               \
                                                            data-cmd="create-item">Add</button>         \
                                                        <button type="button" class="btn btn-default    \
                                                            empty oc-icon-trash-o"                      \
                                                            data-cmd="delete-item"></button>            \
                                                    </div>                                              \
                                                </div>                                                  \
                                            </div>                                                      \
                                        </div>                                                          \
                                        <div class="layout-row">                                        \
                                            <div class="layout-cell">                                   \
                                                <div class="layout-relative">                           \
                                                    <div class="layout-absolute">                       \
                                                        <div class="control-scrollpad"                  \
                                                            data-control="scrollpad">                   \
                                                            <div class="scroll-wrapper">                \
                                                                <table class="table data                \
                                                                    no-offset-bottom                    \
                                                                    inspector-table-list">              \
                                                                </table>                                \
                                                            </div>                                      \
                                                        </div>                                          \
                                                    </div>                                              \
                                                </div>                                                  \
                                            </div>                                                      \
                                        </div>                                                          \
                                    </div>                                                              \
                                </div>                                                                  \
                            </div>                                                                      \
                            <div class="layout-cell">                                                   \
                                <div class="layout-relative">                                           \
                                    <div class="layout-absolute">                                       \
                                        <div class="control-scrollpad" data-control="scrollpad">        \
                                            <div class="scroll-wrapper inspector-wrapper">              \
                                                <div data-inspector-container>                          \
                                                </div>                                                  \
                                            </div>                                                      \
                                        </div>                                                          \
                                    </div>                                                              \
                                </div>                                                                  \
                            </div>                                                                      \
                        </div>                                                                          \
                    </div>                                                                              \
                </div>                                                                                  \
                <div class="modal-footer">                                                              \
                    <button type="submit" class="btn btn-primary">OK</button>                           \
                    <button type="button" class="btn btn-default" data-dismiss="popup">Cancel</button>   \
                </div>                                                                                  \
                </form>'}
ObjectListEditor.prototype.buildPopupContents=function(popup){this.buildItemsTable(popup)}
ObjectListEditor.prototype.buildItemsTable=function(popup){var table=popup.querySelector('table'),tbody=document.createElement('tbody'),items=this.inspector.getPropertyValue(this.propertyDefinition.property),titleProperty=this.propertyDefinition.titleProperty
if(items===undefined||this.getValueKeys(items).length===0){var row=this.buildEmptyRow()
tbody.appendChild(row)}
else{var firstRow=undefined
for(var key in items){var item=items[key],itemInspectorValue=this.addKeyProperty(key,item),itemText=item[titleProperty],row=this.buildTableRow(itemText,'rowlink')
row.setAttribute('data-inspector-values',JSON.stringify(itemInspectorValue))
tbody.appendChild(row)
if(firstRow===undefined){firstRow=row}}}
table.appendChild(tbody)
if(firstRow!==undefined){this.selectRow(firstRow,true)}
this.updateScrollpads()}
ObjectListEditor.prototype.buildEmptyRow=function(){return this.buildTableRow('No items found','no-data','nolink')}
ObjectListEditor.prototype.removeEmptyRow=function(){var tbody=this.getTableBody(),row=tbody.querySelector('tr.no-data')
if(row){tbody.removeChild(row)}}
ObjectListEditor.prototype.buildTableRow=function(text,rowClass,cellClass){var row=document.createElement('tr'),cell=document.createElement('td')
cell.textContent=text
if(rowClass!==undefined){$.oc.foundation.element.addClass(row,rowClass)}
if(cellClass!==undefined){$.oc.foundation.element.addClass(cell,cellClass)}
row.appendChild(cell)
return row}
ObjectListEditor.prototype.updateScrollpads=function(){$('.control-scrollpad',this.popup).scrollpad('update')}
ObjectListEditor.prototype.selectRow=function(row,forceSelect){var tbody=row.parentNode,inspectorContainer=this.getInspectorContainer(),selectedRow=this.getSelectedRow()
if(selectedRow===row&&!forceSelect){return}
if(selectedRow){if(!this.validateKeyValue()){return}
if(this.currentRowInspector){if(!this.currentRowInspector.validate()){return}}
this.applyDataToRow(selectedRow)
$.oc.foundation.element.removeClass(selectedRow,'active')}
this.disposeInspector()
$.oc.foundation.element.addClass(row,'active')
this.createInspectorForRow(row,inspectorContainer)}
ObjectListEditor.prototype.createInspectorForRow=function(row,inspectorContainer){var dataStr=row.getAttribute('data-inspector-values')
if(dataStr===undefined||typeof dataStr!=='string'){throw new Error('Values not found for the selected row.')}
var properties=this.propertyDefinition.itemProperties,values=$.parseJSON(dataStr),options={enableExternalParameterEditor:false,onChange:this.proxy(this.onInspectorDataChange),inspectorClass:this.inspector.options.inspectorClass}
this.currentRowInspector=new $.oc.inspector.surface(inspectorContainer,properties,values,$.oc.inspector.helpers.generateElementUniqueId(inspectorContainer),options)}
ObjectListEditor.prototype.disposeInspector=function(){$.oc.foundation.controlUtils.disposeControls(this.popup.querySelector('[data-inspector-container]'))
this.currentRowInspector=null}
ObjectListEditor.prototype.applyDataToRow=function(row){if(this.currentRowInspector===null){return}
var data=this.currentRowInspector.getValues()
row.setAttribute('data-inspector-values',JSON.stringify(data))}
ObjectListEditor.prototype.updateRowText=function(property,value){var selectedRow=this.getSelectedRow()
if(!selectedRow){throw new Exception('A row is not found for the updated data')}
if(property!==this.propertyDefinition.titleProperty){return}
value=$.trim(value)
if(value.length===0){value='[No title]'
$.oc.foundation.element.addClass(selectedRow,'disabled')}
else{$.oc.foundation.element.removeClass(selectedRow,'disabled')}
selectedRow.firstChild.textContent=value}
ObjectListEditor.prototype.getSelectedRow=function(){if(!this.popup){throw new Error('Trying to get selected row without a popup reference.')}
var rows=this.getTableBody().children
for(var i=0,len=rows.length;i<len;i++){if($.oc.foundation.element.hasClass(rows[i],'active')){return rows[i]}}
return null}
ObjectListEditor.prototype.createItem=function(){var selectedRow=this.getSelectedRow()
if(selectedRow){if(!this.validateKeyValue()){return}
if(this.currentRowInspector){if(!this.currentRowInspector.validate()){return}}
this.applyDataToRow(selectedRow)
$.oc.foundation.element.removeClass(selectedRow,'active')}
this.disposeInspector()
var title='New item',row=this.buildTableRow(title,'rowlink active'),tbody=this.getTableBody(),data={}
data[this.propertyDefinition.titleProperty]=title
row.setAttribute('data-inspector-values',JSON.stringify(data))
tbody.appendChild(row)
this.selectRow(row,true)
this.removeEmptyRow()
this.updateScrollpads()}
ObjectListEditor.prototype.deleteItem=function(){var selectedRow=this.getSelectedRow()
if(!selectedRow){return}
var nextRow=selectedRow.nextElementSibling,prevRow=selectedRow.previousElementSibling,tbody=this.getTableBody()
this.disposeInspector()
tbody.removeChild(selectedRow)
var newSelectedRow=nextRow?nextRow:prevRow
if(newSelectedRow){this.selectRow(newSelectedRow)}
else{tbody.appendChild(this.buildEmptyRow())}
this.updateScrollpads()}
ObjectListEditor.prototype.applyDataToParentInspector=function(){var selectedRow=this.getSelectedRow(),tbody=this.getTableBody(),dataRows=tbody.querySelectorAll('tr[data-inspector-values]'),link=this.getLink(),result=this.getEmptyValue()
if(selectedRow){if(!this.validateKeyValue()){return}
if(this.currentRowInspector){if(!this.currentRowInspector.validate()){return}}
this.applyDataToRow(selectedRow)}
for(var i=0,len=dataRows.length;i<len;i++){var dataRow=dataRows[i],rowData=$.parseJSON(dataRow.getAttribute('data-inspector-values'))
if(!this.isKeyValueMode()){result.push(rowData)}
else{var rowKey=rowData[this.propertyDefinition.keyProperty]
result[rowKey]=this.removeKeyProperty(rowData)}}
this.inspector.setPropertyValue(this.propertyDefinition.property,result)
this.setLinkText(link,result)
$(link).popup('hide')
return false}
ObjectListEditor.prototype.validateKeyValue=function(){if(!this.isKeyValueMode()){return true}
if(this.currentRowInspector===null){return true}
var data=this.currentRowInspector.getValues(),keyProperty=this.propertyDefinition.keyProperty
if(data[keyProperty]===undefined){throw new Error('Key property '+keyProperty+' is not found in the Inspector data. Property: '+this.propertyDefinition.property)}
var keyPropertyValue=data[keyProperty],keyPropertyTitle=this.getKeyProperty().title
if(typeof keyPropertyValue!=='string'){throw new Error('Key property ('+keyProperty+') value should be a string. Property: '+this.propertyDefinition.property)}
if($.trim(keyPropertyValue).length===0){$.oc.flashMsg({text:'The value of key property '+keyPropertyTitle+' cannot be empty.','class':'error','interval':3})
return false}
var selectedRow=this.getSelectedRow(),tbody=this.getTableBody(),dataRows=tbody.querySelectorAll('tr[data-inspector-values]')
for(var i=0,len=dataRows.length;i<len;i++){var dataRow=dataRows[i],rowData=$.parseJSON(dataRow.getAttribute('data-inspector-values'))
if(selectedRow==dataRow){continue}
if(rowData[keyProperty]==keyPropertyValue){$.oc.flashMsg({text:'The value of key property '+keyPropertyTitle+' should be unique.','class':'error','interval':3})
return false}}
return true}
ObjectListEditor.prototype.getLink=function(){return this.containerCell.querySelector('a.trigger')}
ObjectListEditor.prototype.getPopupFormElement=function(){var form=this.popup.querySelector('form')
if(!form){this.throwError('Cannot find form element in the popup window.')}
return form}
ObjectListEditor.prototype.getInspectorContainer=function(){return this.popup.querySelector('div[data-inspector-container]')}
ObjectListEditor.prototype.getTableBody=function(){return this.popup.querySelector('table.inspector-table-list tbody')}
ObjectListEditor.prototype.isKeyValueMode=function(){return this.propertyDefinition.keyProperty!==undefined}
ObjectListEditor.prototype.getKeyProperty=function(){for(var i=0,len=this.propertyDefinition.itemProperties.length;i<len;i++){var property=this.propertyDefinition.itemProperties[i]
if(property.property==this.propertyDefinition.keyProperty){return property}}}
ObjectListEditor.prototype.getValueKeys=function(value){var result=[]
for(var key in value){result.push(key)}
return result}
ObjectListEditor.prototype.addKeyProperty=function(key,value){if(!this.isKeyValueMode()){return value}
value[this.propertyDefinition.keyProperty]=key
return value}
ObjectListEditor.prototype.removeKeyProperty=function(value){if(!this.isKeyValueMode()){return value}
var result=value
if(result[this.propertyDefinition.keyProperty]!==undefined){delete result[this.propertyDefinition.keyProperty]}
return result}
ObjectListEditor.prototype.getEmptyValue=function(){if(this.isKeyValueMode()){return{}}
else{return[]}}
ObjectListEditor.prototype.registerHandlers=function(){var link=this.getLink(),$link=$(link)
link.addEventListener('click',this.proxy(this.onTriggerClick))
$link.on('shown.oc.popup',this.proxy(this.onPopupShown))
$link.on('hidden.oc.popup',this.proxy(this.onPopupHidden))}
ObjectListEditor.prototype.unregisterHandlers=function(){var link=this.getLink(),$link=$(link)
link.removeEventListener('click',this.proxy(this.onTriggerClick))
$link.off('shown.oc.popup',this.proxy(this.onPopupShown))
$link.off('hidden.oc.popup',this.proxy(this.onPopupHidden))}
ObjectListEditor.prototype.onTriggerClick=function(ev){$.oc.foundation.event.stop(ev)
var content=this.getPopupContent()
content=content.replace('{{property}}',this.propertyDefinition.title)
$(ev.target).popup({content:content})
return false}
ObjectListEditor.prototype.onPopupShown=function(ev,link,popup){$(popup).on('submit.inspector','form',this.proxy(this.onSubmit))
$(popup).on('click','tr.rowlink',this.proxy(this.onRowClick))
$(popup).on('click.inspector','[data-cmd]',this.proxy(this.onCommand))
this.popup=popup.get(0)
this.buildPopupContents(this.popup)
this.getRootSurface().popupDisplayed()}
ObjectListEditor.prototype.onPopupHidden=function(ev,link,popup){$(popup).off('.inspector',this.proxy(this.onSubmit))
$(popup).off('click','tr.rowlink',this.proxy(this.onRowClick))
$(popup).off('click.inspector','[data-cmd]',this.proxy(this.onCommand))
this.disposeInspector()
$.oc.foundation.controlUtils.disposeControls(this.popup)
this.popup=null
this.getRootSurface().popupHidden()}
ObjectListEditor.prototype.onSubmit=function(ev){this.applyDataToParentInspector()
ev.preventDefault()
return false}
ObjectListEditor.prototype.onRowClick=function(ev){this.selectRow(ev.currentTarget)}
ObjectListEditor.prototype.onInspectorDataChange=function(property,value){this.updateRowText(property,value)}
ObjectListEditor.prototype.onCommand=function(ev){var command=ev.currentTarget.getAttribute('data-cmd')
switch(command){case'create-item':this.createItem()
break;case'delete-item':this.deleteItem()
break;}}
ObjectListEditor.prototype.removeControls=function(){if(this.popup){this.disposeInspector(this.popup)}}
$.oc.inspector.propertyEditors.objectList=ObjectListEditor}(window.jQuery);+function($){"use strict";var Base=$.oc.inspector.propertyEditors.base,BaseProto=Base.prototype
var ObjectEditor=function(inspector,propertyDefinition,containerCell,group){if(propertyDefinition.properties===undefined){this.throwError('The properties property should be specified in the object editor configuration.')}
Base.call(this,inspector,propertyDefinition,containerCell,group)}
ObjectEditor.prototype=Object.create(BaseProto)
ObjectEditor.prototype.constructor=Base
ObjectEditor.prototype.init=function(){this.initControlGroup()
BaseProto.init.call(this)}
ObjectEditor.prototype.build=function(){var currentRow=this.containerCell.parentNode,inspectorContainer=document.createElement('div'),options={enableExternalParameterEditor:false,onChange:this.proxy(this.onInspectorDataChange),inspectorClass:this.inspector.options.inspectorClass},values=this.inspector.getPropertyValue(this.propertyDefinition.property)
if(values===undefined){values={}}
this.childInspector=new $.oc.inspector.surface(inspectorContainer,this.propertyDefinition.properties,values,this.inspector.getInspectorUniqueId()+'-'+this.propertyDefinition.property,options,this.inspector,this.group)
this.inspector.mergeChildSurface(this.childInspector,currentRow)}
ObjectEditor.prototype.cleanUpValue=function(value){if(value===undefined||typeof value!=='object'){return undefined}
if(this.propertyDefinition.ignoreIfPropertyEmpty===undefined){return value}
return this.getValueOrRemove(value)}
ObjectEditor.prototype.isEmptyValue=function(value){return value===undefined||value===null||$.isEmptyObject(value)||(typeof value=='string'&&$.trim(value).length===0)||(Object.prototype.toString.call(value)==='[object Array]'&&value.length===0)}
ObjectEditor.prototype.getValueOrRemove=function(value){if(this.propertyDefinition.ignoreIfPropertyEmpty===undefined){return value}
var targetProperty=this.propertyDefinition.ignoreIfPropertyEmpty,targetValue=value[targetProperty]
if(this.isEmptyValue(targetValue)){return $.oc.inspector.removedProperty}
return value}
ObjectEditor.prototype.supportsExternalParameterEditor=function(){return false}
ObjectEditor.prototype.isGroupedEditor=function(){return true}
ObjectEditor.prototype.getUndefinedValue=function(){var result={}
for(var i=0,len=this.propertyDefinition.properties.length;i<len;i++){var propertyName=this.propertyDefinition.properties[i].property,editor=this.childInspector.findPropertyEditor(propertyName)
if(editor){result[propertyName]=editor.getUndefinedValue()}}
return this.getValueOrRemove(result)}
ObjectEditor.prototype.validate=function(){var values=this.childInspector.getValues()
if(this.cleanUpValue(values)===$.oc.inspector.removedProperty){return true}
return this.childInspector.validate()}
ObjectEditor.prototype.onInspectorDataChange=function(property,value){var values=this.childInspector.getValues()
this.inspector.setPropertyValue(this.propertyDefinition.property,this.cleanUpValue(values))}
$.oc.inspector.propertyEditors.object=ObjectEditor}(window.jQuery);+function($){"use strict";var Base=$.oc.inspector.propertyEditors.text,BaseProto=Base.prototype
var StringListEditor=function(inspector,propertyDefinition,containerCell,group){Base.call(this,inspector,propertyDefinition,containerCell,group)}
StringListEditor.prototype=Object.create(BaseProto)
StringListEditor.prototype.constructor=Base
StringListEditor.prototype.setLinkText=function(link,value){var value=value!==undefined?value:this.inspector.getPropertyValue(this.propertyDefinition.property)
if(value===undefined){value=this.propertyDefinition.default}
this.checkValueType(value)
if(!value){value=this.propertyDefinition.placeholder
$.oc.foundation.element.addClass(link,'placeholder')
if(!value){value='[]'}
link.textContent=value}
else{$.oc.foundation.element.removeClass(link,'placeholder')
link.textContent='['+value.join(', ')+']'}}
StringListEditor.prototype.checkValueType=function(value){if(value&&Object.prototype.toString.call(value)!=='[object Array]'){this.throwError('The string list value should be an array.')}}
StringListEditor.prototype.configurePopup=function(popup){var $textarea=$(popup).find('textarea'),value=this.inspector.getPropertyValue(this.propertyDefinition.property)
if(this.propertyDefinition.placeholder){$textarea.attr('placeholder',this.propertyDefinition.placeholder)}
if(value===undefined){value=this.propertyDefinition.default}
this.checkValueType(value)
if(value&&value.length){$textarea.val(value.join('\n'))}
$textarea.focus()}
StringListEditor.prototype.handleSubmit=function($form){var $textarea=$form.find('textarea'),link=this.getLink(),value=$.trim($textarea.val()),arrayValue=[],resultValue=[]
if(value.length){value=value.replace(/\r\n/g,'\n')
arrayValue=value.split('\n')
for(var i=0,len=arrayValue.length;i<len;i++){var currentValue=$.trim(arrayValue[i])
if(currentValue.length>0){resultValue.push(currentValue)}}}
this.inspector.setPropertyValue(this.propertyDefinition.property,resultValue)}
$.oc.inspector.propertyEditors.stringList=StringListEditor}(window.jQuery);+function($){"use strict";var Base=$.oc.inspector.propertyEditors.popupBase,BaseProto=Base.prototype
var DictionaryEditor=function(inspector,propertyDefinition,containerCell,group){this.keyValidationSet=null
this.valueValidationSet=null
Base.call(this,inspector,propertyDefinition,containerCell,group)}
DictionaryEditor.prototype=Object.create(BaseProto)
DictionaryEditor.prototype.constructor=Base
DictionaryEditor.prototype.dispose=function(){this.disposeValidators()
this.keyValidationSet=null
this.valueValidationSet=null
BaseProto.dispose.call(this)}
DictionaryEditor.prototype.init=function(){this.initValidators()
BaseProto.init.call(this)}
DictionaryEditor.prototype.supportsExternalParameterEditor=function(){return false}
DictionaryEditor.prototype.setLinkText=function(link,value){var value=value!==undefined?value:this.inspector.getPropertyValue(this.propertyDefinition.property)
if(value===undefined){value=this.propertyDefinition.default}
if(value===undefined||$.isEmptyObject(value)){var placeholder=this.propertyDefinition.placeholder
if(placeholder!==undefined){$.oc.foundation.element.addClass(link,'placeholder')
link.textContent=placeholder}
else{link.textContent='Items: 0'}}
else{if(typeof value!=='object'){this.throwError('Object list value should be an object.')}
var itemCount=this.getValueKeys(value).length
$.oc.foundation.element.removeClass(link,'placeholder')
link.textContent='Items: '+itemCount}}
DictionaryEditor.prototype.getPopupContent=function(){return'<form>                                                                                  \
                <div class="modal-header">                                                              \
                    <button type="button" class="close" data-dismiss="popup">&times;</button>           \
                    <h4 class="modal-title">{{property}}</h4>                                           \
                </div>                                                                                  \
                <div class="modal-body">                                                                \
                    <div class="control-toolbar">                                                       \
                        <div class="toolbar-item">                                                      \
                            <div class="btn-group">                                                     \
                                <button type="button" class="btn btn-primary                            \
                                    oc-icon-plus"                                                       \
                                    data-cmd="create-item">Add</button>                                 \
                                <button type="button" class="btn btn-default                            \
                                    empty oc-icon-trash-o"                                              \
                                    data-cmd="delete-item"></button>                                    \
                            </div>                                                                      \
                        </div>                                                                          \
                    </div>                                                                              \
                    <div class="form-group">                                                            \
                        <div class="inspector-dictionary-container">                                    \
                            <table class="headers">                                                     \
                                <thead>                                                                 \
                                    <tr>                                                                \
                                        <td>Key</td>                                                    \
                                        <td>Value</td>                                                  \
                                    </tr>                                                               \
                                </thead>                                                                \
                            </table>                                                                    \
                            <div class="values">                                                        \
                                <div class="control-scrollpad"                                          \
                                    data-control="scrollpad">                                           \
                                    <div class="scroll-wrapper">                                        \
                                        <table class="                                                  \
                                            no-offset-bottom                                            \
                                            inspector-dictionary-table">                                \
                                        </table>                                                        \
                                    </div>                                                              \
                                </div>                                                                  \
                            </div>                                                                      \
                        </div>                                                                          \
                    </div>                                                                              \
                </div>                                                                                  \
                <div class="modal-footer">                                                              \
                    <button type="submit" class="btn btn-primary">OK</button>                           \
                    <button type="button" class="btn btn-default" data-dismiss="popup">Cancel</button>   \
                </div>                                                                                  \
                </form>'}
DictionaryEditor.prototype.configurePopup=function(popup){this.buildItemsTable(popup.get(0))
this.focusFirstInput()}
DictionaryEditor.prototype.handleSubmit=function($form){return this.applyValues()}
DictionaryEditor.prototype.buildItemsTable=function(popup){var table=popup.querySelector('table.inspector-dictionary-table'),tbody=document.createElement('tbody'),items=this.inspector.getPropertyValue(this.propertyDefinition.property),titleProperty=this.propertyDefinition.titleProperty
if(items===undefined){items=this.propertyDefinition.default}
if(items===undefined||this.getValueKeys(items).length===0){var row=this.buildEmptyRow()
tbody.appendChild(row)}
else{for(var key in items){var row=this.buildTableRow(key,items[key])
tbody.appendChild(row)}}
table.appendChild(tbody)
this.updateScrollpads()}
DictionaryEditor.prototype.buildTableRow=function(key,value){var row=document.createElement('tr'),keyCell=document.createElement('td'),valueCell=document.createElement('td')
this.createInput(keyCell,key)
this.createInput(valueCell,value)
row.appendChild(keyCell)
row.appendChild(valueCell)
return row}
DictionaryEditor.prototype.buildEmptyRow=function(){return this.buildTableRow(null,null)}
DictionaryEditor.prototype.createInput=function(container,value){var input=document.createElement('input'),controlContainer=document.createElement('div')
input.setAttribute('type','text')
input.setAttribute('class','form-control')
input.value=value
controlContainer.appendChild(input)
container.appendChild(controlContainer)}
DictionaryEditor.prototype.setActiveCell=function(input){var activeCells=this.popup.querySelectorAll('td.active')
for(var i=activeCells.length-1;i>=0;i--){$.oc.foundation.element.removeClass(activeCells[i],'active')}
var activeCell=input.parentNode.parentNode
$.oc.foundation.element.addClass(activeCell,'active')}
DictionaryEditor.prototype.createItem=function(){var activeRow=this.getActiveRow(),newRow=this.buildEmptyRow(),tbody=this.getTableBody(),nextSibling=activeRow?activeRow.nextElementSibling:null
tbody.insertBefore(newRow,nextSibling)
this.focusAndMakeActive(newRow.querySelector('input'))
this.updateScrollpads()}
DictionaryEditor.prototype.deleteItem=function(){var activeRow=this.getActiveRow(),tbody=this.getTableBody()
if(!activeRow){return}
var nextRow=activeRow.nextElementSibling,prevRow=activeRow.previousElementSibling
tbody.removeChild(activeRow)
var newSelectedRow=nextRow?nextRow:prevRow
if(!newSelectedRow){newSelectedRow=this.buildEmptyRow()
tbody.appendChild(newSelectedRow)}
this.focusAndMakeActive(newSelectedRow.querySelector('input'))
this.updateScrollpads()}
DictionaryEditor.prototype.applyValues=function(){var tbody=this.getTableBody(),dataRows=tbody.querySelectorAll('tr'),link=this.getLink(),result={}
for(var i=0,len=dataRows.length;i<len;i++){var dataRow=dataRows[i],keyInput=this.getRowInputByIndex(dataRow,0),valueInput=this.getRowInputByIndex(dataRow,1),key=$.trim(keyInput.value),value=$.trim(valueInput.value)
if(key.length==0&&value.length==0){continue}
if(key.length==0){$.oc.flashMsg({text:'The key cannot be empty.','class':'error','interval':3})
this.focusAndMakeActive(keyInput)
return false}
if(value.length==0){$.oc.flashMsg({text:'The value cannot be empty.','class':'error','interval':3})
this.focusAndMakeActive(valueInput)
return false}
if(result[key]!==undefined){$.oc.flashMsg({text:'Keys should be unique.','class':'error','interval':3})
this.focusAndMakeActive(keyInput)
return false}
var validationResult=this.keyValidationSet.validate(key)
if(validationResult!==null){$.oc.flashMsg({text:validationResult,'class':'error','interval':5})
return false}
validationResult=this.valueValidationSet.validate(value)
if(validationResult!==null){$.oc.flashMsg({text:validationResult,'class':'error','interval':5})
return false}
result[key]=value}
this.inspector.setPropertyValue(this.propertyDefinition.property,result)
this.setLinkText(link,result)}
DictionaryEditor.prototype.getValueKeys=function(value){var result=[]
for(var key in value){result.push(key)}
return result}
DictionaryEditor.prototype.getActiveRow=function(){var activeCell=this.popup.querySelector('td.active')
if(!activeCell){return null}
return activeCell.parentNode}
DictionaryEditor.prototype.getTableBody=function(){return this.popup.querySelector('table.inspector-dictionary-table tbody')}
DictionaryEditor.prototype.updateScrollpads=function(){$('.control-scrollpad',this.popup).scrollpad('update')}
DictionaryEditor.prototype.focusFirstInput=function(){var input=this.popup.querySelector('td input')
if(input){input.focus()
this.setActiveCell(input)}}
DictionaryEditor.prototype.getEditorCell=function(cell){return cell.parentNode.parentNode}
DictionaryEditor.prototype.getEditorRow=function(cell){return cell.parentNode.parentNode.parentNode}
DictionaryEditor.prototype.focusAndMakeActive=function(input){input.focus()
this.setActiveCell(input)}
DictionaryEditor.prototype.getRowInputByIndex=function(row,index){return row.cells[index].querySelector('input')}
DictionaryEditor.prototype.navigateDown=function(ev){var cell=this.getEditorCell(ev.currentTarget),row=this.getEditorRow(ev.currentTarget),nextRow=row.nextElementSibling
if(!nextRow){return}
var newActiveEditor=nextRow.cells[cell.cellIndex].querySelector('input')
this.focusAndMakeActive(newActiveEditor)}
DictionaryEditor.prototype.navigateUp=function(ev){var cell=this.getEditorCell(ev.currentTarget),row=this.getEditorRow(ev.currentTarget),prevRow=row.previousElementSibling
if(!prevRow){return}
var newActiveEditor=prevRow.cells[cell.cellIndex].querySelector('input')
this.focusAndMakeActive(newActiveEditor)}
DictionaryEditor.prototype.initValidators=function(){this.keyValidationSet=new $.oc.inspector.validationSet({validation:this.propertyDefinition.validationKey},this.propertyDefinition.property+'.validationKey')
this.valueValidationSet=new $.oc.inspector.validationSet({validation:this.propertyDefinition.validationValue},this.propertyDefinition.property+'.validationValue')}
DictionaryEditor.prototype.disposeValidators=function(){this.keyValidationSet.dispose()
this.valueValidationSet.dispose()}
DictionaryEditor.prototype.onPopupShown=function(ev,link,popup){BaseProto.onPopupShown.call(this,ev,link,popup)
popup.on('focus.inspector','td input',this.proxy(this.onFocus))
popup.on('keydown.inspector','td input',this.proxy(this.onKeyDown))
popup.on('click.inspector','[data-cmd]',this.proxy(this.onCommand))}
DictionaryEditor.prototype.onPopupHidden=function(ev,link,popup){popup.off('.inspector','td input')
popup.off('.inspector','[data-cmd]',this.proxy(this.onCommand))
BaseProto.onPopupHidden.call(this,ev,link,popup)}
DictionaryEditor.prototype.onFocus=function(ev){this.setActiveCell(ev.currentTarget)}
DictionaryEditor.prototype.onCommand=function(ev){var command=ev.currentTarget.getAttribute('data-cmd')
switch(command){case'create-item':this.createItem()
break;case'delete-item':this.deleteItem()
break;}}
DictionaryEditor.prototype.onKeyDown=function(ev){if(ev.keyCode==40){return this.navigateDown(ev)}
else if(ev.keyCode==38){return this.navigateUp(ev)}}
$.oc.inspector.propertyEditors.dictionary=DictionaryEditor}(window.jQuery);+function($){"use strict";var Base=$.oc.inspector.propertyEditors.string,BaseProto=Base.prototype
var AutocompleteEditor=function(inspector,propertyDefinition,containerCell,group){Base.call(this,inspector,propertyDefinition,containerCell,group)}
AutocompleteEditor.prototype=Object.create(BaseProto)
AutocompleteEditor.prototype.constructor=Base
AutocompleteEditor.prototype.dispose=function(){this.removeAutocomplete()
BaseProto.dispose.call(this)}
AutocompleteEditor.prototype.build=function(){var container=document.createElement('div'),editor=document.createElement('input'),placeholder=this.propertyDefinition.placeholder!==undefined?this.propertyDefinition.placeholder:'',value=this.inspector.getPropertyValue(this.propertyDefinition.property)
editor.setAttribute('type','text')
editor.setAttribute('class','string-editor')
editor.setAttribute('placeholder',placeholder)
container.setAttribute('class','autocomplete-container')
if(value===undefined){value=this.propertyDefinition.default}
if(value===undefined){value=''}
editor.value=value
$.oc.foundation.element.addClass(this.containerCell,'text autocomplete')
container.appendChild(editor)
this.containerCell.appendChild(container)
if(this.propertyDefinition.items!==undefined){this.buildAutoComplete(this.propertyDefinition.items)}
else{this.loadDynamicItems()}}
AutocompleteEditor.prototype.buildAutoComplete=function(items){var input=this.getInput()
if(items===undefined){items=[]}
$(input).autocomplete({source:this.prepareItems(items),matchWidth:true})}
AutocompleteEditor.prototype.removeAutocomplete=function(){var input=this.getInput()
$(input).autocomplete('destroy')}
AutocompleteEditor.prototype.prepareItems=function(items){var result={}
if($.isArray(items)){for(var i=0,len=items.length;i<len;i++){result[items[i]]=items[i]}}
else{result=items}
return result}
AutocompleteEditor.prototype.supportsExternalParameterEditor=function(){return false}
AutocompleteEditor.prototype.getContainer=function(){return this.getInput().parentNode}
AutocompleteEditor.prototype.registerHandlers=function(){BaseProto.registerHandlers.call(this)
$(this.getInput()).on('change',this.proxy(this.onInputKeyUp))}
AutocompleteEditor.prototype.unregisterHandlers=function(){BaseProto.unregisterHandlers.call(this)
$(this.getInput()).off('change',this.proxy(this.onInputKeyUp))}
AutocompleteEditor.prototype.showLoadingIndicator=function(){$(this.getContainer()).loadIndicator()}
AutocompleteEditor.prototype.hideLoadingIndicator=function(){if(this.isDisposed()){return}
var $container=$(this.getContainer())
$container.loadIndicator('hide')
$container.loadIndicator('destroy')
$container.removeClass('loading-indicator-container')}
AutocompleteEditor.prototype.loadDynamicItems=function(){var container=this.getContainer(),data=this.inspector.getValues(),$form=$(container).closest('form')
$.oc.foundation.element.addClass(container,'loading-indicator-container size-small')
this.showLoadingIndicator()
data['inspectorProperty']=this.propertyDefinition.property
data['inspectorClassName']=this.inspector.options.inspectorClass
$form.request('onInspectableGetOptions',{data:data,}).done(this.proxy(this.itemsRequestDone)).always(this.proxy(this.hideLoadingIndicator))}
AutocompleteEditor.prototype.itemsRequestDone=function(data,currentValue,initialization){if(this.isDisposed()){return}
var loadedItems={}
if(data.options){for(var i=data.options.length-1;i>=0;i--){loadedItems[data.options[i].value]=data.options[i].title}}
this.buildAutoComplete(loadedItems)}
$.oc.inspector.propertyEditors.autocomplete=AutocompleteEditor}(window.jQuery);+function($){"use strict";if($.oc===undefined)
$.oc={}
if($.oc.inspector===undefined)
$.oc.inspector={}
$.oc.inspector.helpers={}
$.oc.inspector.helpers.generateElementUniqueId=function(element){if(element.hasAttribute('data-inspector-id')){return element.getAttribute('data-inspector-id')}
var id=$.oc.inspector.helpers.generateUniqueId()
element.setAttribute('data-inspector-id',id)
return id}
$.oc.inspector.helpers.generateUniqueId=function(){return"inspectorid-"+Math.floor(Math.random()*new Date().getTime());}}(window.jQuery)
+function($){"use strict";if($.oc.inspector.validators===undefined)
$.oc.inspector.validators={}
var Base=$.oc.foundation.base,BaseProto=Base.prototype
var ValidationSet=function(options,propertyName){this.validators=[]
this.options=options
this.propertyName=propertyName
Base.call(this)
this.createValidators()}
ValidationSet.prototype=Object.create(BaseProto)
ValidationSet.prototype.constructor=Base
ValidationSet.prototype.dispose=function(){this.disposeValidators()
this.validators=null
BaseProto.dispose.call(this)}
ValidationSet.prototype.disposeValidators=function(){for(var i=0,len=this.validators.length;i<len;i++){this.validators[i].dispose()}}
ValidationSet.prototype.throwError=function(errorMessage){throw new Error(errorMessage+' Property: '+this.propertyName)}
ValidationSet.prototype.createValidators=function(){if((this.options.required!==undefined||this.options.validationPattern!==undefined||this.options.validationMessage!==undefined)&&this.options.validation!==undefined){this.throwError('Legacy and new validation syntax should not be mixed.')}
if(this.options.required!==undefined){var validator=new $.oc.inspector.validators.required({message:this.options.validationMessage})
this.validators.push(validator)}
if(this.options.validationPattern!==undefined){var validator=new $.oc.inspector.validators.regex({message:this.options.validationMessage,pattern:this.options.validationPattern})
this.validators.push(validator)}
if(this.options.validation===undefined){return}
for(var validatorName in this.options.validation){if($.oc.inspector.validators[validatorName]==undefined){this.throwError('Inspector validator "'+validatorName+'" is not found in the $.oc.inspector.validators namespace.')}
var validator=new $.oc.inspector.validators[validatorName](this.options.validation[validatorName])
this.validators.push(validator)}}
ValidationSet.prototype.validate=function(value){try{for(var i=0,len=this.validators.length;i<len;i++){var validator=this.validators[i],errorMessage=validator.isValid(value)
if(typeof errorMessage==='string'){return errorMessage}}
return null}
catch(err){this.throwError(err)}}
$.oc.inspector.validationSet=ValidationSet}(window.jQuery);+function($){"use strict";if($.oc.inspector.validators===undefined)
$.oc.inspector.validators={}
var Base=$.oc.foundation.base,BaseProto=Base.prototype
var BaseValidator=function(options){this.options=options
this.defaultMessage='Invalid property value.'
Base.call(this)}
BaseValidator.prototype=Object.create(BaseProto)
BaseValidator.prototype.constructor=Base
BaseValidator.prototype.dispose=function(){this.defaultMessage=null
BaseProto.dispose.call(this)}
BaseValidator.prototype.getMessage=function(defaultMessage){if(this.options.message!==undefined){return this.options.message}
if(defaultMessage!==undefined){return defaultMessage}
return this.defaultMessage}
BaseValidator.prototype.isScalar=function(value){if(value===undefined||value===null){return true}
return!!(typeof value==='string'||typeof value=='number'||typeof value=='boolean');}
BaseValidator.prototype.isValid=function(value){return null}
$.oc.inspector.validators.base=BaseValidator}(window.jQuery);+function($){"use strict";var Base=$.oc.inspector.validators.base,BaseProto=Base.prototype
var BaseNumber=function(options){Base.call(this,options)}
BaseNumber.prototype=Object.create(BaseProto)
BaseNumber.prototype.constructor=Base
BaseNumber.prototype.doCommonChecks=function(value){if(this.options.min!==undefined||this.options.max!==undefined){if(this.options.min!==undefined){if(this.options.min.value===undefined){throw new Error('The min.value parameter is not defined in the Inspector validator configuration')}
if(value<this.options.min.value){return this.options.min.message!==undefined?this.options.min.message:"The value should not be less than "+this.options.min.value}}
if(this.options.max!==undefined){if(this.options.max.value===undefined){throw new Error('The max.value parameter is not defined in the table Inspector validator configuration')}
if(value>this.options.max.value){return this.options.max.message!==undefined?this.options.max.message:"The value should not be greater than "+this.options.max.value}}}}
$.oc.inspector.validators.baseNumber=BaseNumber}(window.jQuery);+function($){"use strict";var Base=$.oc.inspector.validators.base,BaseProto=Base.prototype
var RequiredValidator=function(options){Base.call(this,options)
this.defaultMessage='The property is required.'}
RequiredValidator.prototype=Object.create(BaseProto)
RequiredValidator.prototype.constructor=Base
RequiredValidator.prototype.isValid=function(value){if(value===undefined||value===null){return this.getMessage()}
if(typeof value==='boolean'){return value?null:this.getMessage()}
if(typeof value==='object'){return!$.isEmptyObject(value)?null:this.getMessage()}
return $.trim(String(value)).length>0?null:this.getMessage()}
$.oc.inspector.validators.required=RequiredValidator}(window.jQuery);+function($){"use strict";var Base=$.oc.inspector.validators.base,BaseProto=Base.prototype
var RegexValidator=function(options){Base.call(this,options)}
RegexValidator.prototype=Object.create(BaseProto)
RegexValidator.prototype.constructor=Base
RegexValidator.prototype.isValid=function(value){if(this.options.pattern===undefined){this.throwError('The pattern parameter is not defined in the Regex Inspector validator configuration.')}
if(!this.isScalar(value)){this.throwError('The Regex Inspector validator can only be used with string values.')}
if(value===undefined||value===null){return null}
var string=$.trim(String(value))
if(string.length===0){return null}
var regexObj=new RegExp(this.options.pattern,this.options.modifiers)
return regexObj.test(string)?null:this.getMessage()}
$.oc.inspector.validators.regex=RegexValidator}(window.jQuery);+function($){"use strict";var Base=$.oc.inspector.validators.baseNumber,BaseProto=Base.prototype
var IntegerValidator=function(options){Base.call(this,options)}
IntegerValidator.prototype=Object.create(BaseProto)
IntegerValidator.prototype.constructor=Base
IntegerValidator.prototype.isValid=function(value){if(!this.isScalar(value)||typeof value=='boolean'){this.throwError('The Integer Inspector validator can only be used with string values.')}
if(value===undefined||value===null){return null}
var string=$.trim(String(value))
if(string.length===0){return null}
var testResult=this.options.allowNegative?/^\-?[0-9]*$/.test(string):/^[0-9]*$/.test(string)
if(!testResult){var defaultMessage=this.options.allowNegative?'The value should be an integer.':'The value should be a positive integer.';return this.getMessage(defaultMessage)}
return this.doCommonChecks(parseInt(string))}
$.oc.inspector.validators.integer=IntegerValidator}(window.jQuery);+function($){"use strict";var Base=$.oc.inspector.validators.baseNumber,BaseProto=Base.prototype
var FloatValidator=function(options){Base.call(this,options)}
FloatValidator.prototype=Object.create(BaseProto)
FloatValidator.prototype.constructor=Base
FloatValidator.prototype.isValid=function(value){if(!this.isScalar(value)||typeof value=='boolean'){this.throwError('The Float Inspector validator can only be used with string values.')}
if(value===undefined||value===null){return null}
var string=$.trim(String(value))
if(string.length===0){return null}
var testResult=this.options.allowNegative?/^[-]?([0-9]+\.[0-9]+|[0-9]+)$/.test(string):/^([0-9]+\.[0-9]+|[0-9]+)$/.test(string)
if(!testResult){var defaultMessage=this.options.allowNegative?'The value should be a floating point number.':'The value should be a positive floating point number.';return this.getMessage(defaultMessage)}
return this.doCommonChecks(parseFloat(string))}
$.oc.inspector.validators.float=FloatValidator}(window.jQuery);+function($){"use strict";var Base=$.oc.inspector.validators.base,BaseProto=Base.prototype
var LengthValidator=function(options){Base.call(this,options)}
LengthValidator.prototype=Object.create(BaseProto)
LengthValidator.prototype.constructor=Base
LengthValidator.prototype.isValid=function(value){if(value===undefined||value===null){return null}
if(typeof value=='boolean'){this.throwError('The Length Inspector validator cannot work with Boolean values.')}
var length=null
if(Object.prototype.toString.call(value)==='[object Array]'||typeof value==='string'){length=value.length}
else if(typeof value==='object'){length=this.getObjectLength(value)}
if(this.options.min!==undefined||this.options.max!==undefined){if(this.options.min!==undefined){if(this.options.min.value===undefined){throw new Error('The min.value parameter is not defined in the Length Inspector validator configuration.')}
if(length<this.options.min.value){return this.options.min.message!==undefined?this.options.min.message:"The value should not be shorter than "+this.options.min.value}}
if(this.options.max!==undefined){if(this.options.max.value===undefined)
throw new Error('The max.value parameter is not defined in the Length Inspector validator configuration.')
if(length>this.options.max.value){return this.options.max.message!==undefined?this.options.max.message:"The value should not be longer than "+this.options.max.value}}}}
LengthValidator.prototype.getObjectLength=function(value){var result=0
for(var key in value){result++}
return result}
$.oc.inspector.validators.length=LengthValidator}(window.jQuery);+function($){"use strict";if($.oc===undefined)
$.oc={}
if($.oc.inspector===undefined)
$.oc.inspector={}
var Base=$.oc.foundation.base,BaseProto=Base.prototype
var ExternalParameterEditor=function(inspector,propertyDefinition,containerCell){this.inspector=inspector
this.propertyDefinition=propertyDefinition
this.containerCell=containerCell
Base.call(this)
this.init()}
ExternalParameterEditor.prototype=Object.create(BaseProto)
ExternalParameterEditor.prototype.constructor=Base
ExternalParameterEditor.prototype.dispose=function(){this.disposeControls()
this.unregisterHandlers()
this.inspector=null
this.propertyDefinition=null
this.containerCell=null
BaseProto.dispose.call(this)}
ExternalParameterEditor.prototype.init=function(){this.tooltipText='Click to enter the external parameter name to load the property value from'
this.build()
this.registerHandlers()
this.setInitialValue()}
ExternalParameterEditor.prototype.build=function(){var container=document.createElement('div'),editor=document.createElement('div'),controls=document.createElement('div'),input=document.createElement('input'),link=document.createElement('a'),icon=document.createElement('i')
container.setAttribute('class','external-param-editor-container')
editor.setAttribute('class','external-editor')
controls.setAttribute('class','controls')
input.setAttribute('type','text')
input.setAttribute('tabindex','-1')
link.setAttribute('href','#')
link.setAttribute('class','external-editor-link')
link.setAttribute('tabindex','-1')
link.setAttribute('title',this.tooltipText)
$(link).tooltip({'container':'body',delay:500})
icon.setAttribute('class','oc-icon-terminal')
link.appendChild(icon)
controls.appendChild(input)
controls.appendChild(link)
editor.appendChild(controls)
while(this.containerCell.firstChild){var child=this.containerCell.firstChild
container.appendChild(child)}
container.appendChild(editor)
this.containerCell.appendChild(container)}
ExternalParameterEditor.prototype.setInitialValue=function(){var propertyValue=this.inspector.getPropertyValue(this.propertyDefinition.property)
if(!propertyValue){return}
if(typeof propertyValue!=='string'){return}
var matches=[]
if(matches=propertyValue.match(/^\{\{([^\}]+)\}\}$/)){var value=$.trim(matches[1])
if(value.length>0){this.showEditor(true)
this.getInput().value=value
this.inspector.setPropertyValue(this.propertyDefinition.property,null,true,true)}}}
ExternalParameterEditor.prototype.showEditor=function(building){var editor=this.getEditor(),input=this.getInput(),container=this.getContainer(),link=this.getLink()
var position=$(editor).position()
if(!building){editor.style.right=0
editor.style.left=position.left+'px'}
else{editor.style.right=0}
setTimeout(this.proxy(this.repositionEditor),0)
$.oc.foundation.element.addClass(container,'editor-visible')
link.setAttribute('data-original-title','Click to enter the property value')
this.toggleEditorVisibility(false)
input.setAttribute('tabindex',0)
if(!building){input.focus()}}
ExternalParameterEditor.prototype.repositionEditor=function(){this.getEditor().style.left=0
this.containerCell.scrollTop=0}
ExternalParameterEditor.prototype.hideEditor=function(){var editor=this.getEditor(),container=this.getContainer()
editor.style.left='auto'
editor.style.right='30px'
$.oc.foundation.element.removeClass(container,'editor-visible')
$.oc.foundation.element.removeClass(this.containerCell,'active')
var propertyEditor=this.inspector.findPropertyEditor(this.propertyDefinition.property)
if(propertyEditor){propertyEditor.onExternalPropertyEditorHidden()}}
ExternalParameterEditor.prototype.toggleEditor=function(ev){$.oc.foundation.event.stop(ev)
var link=this.getLink(),container=this.getContainer(),editor=this.getEditor()
$(link).tooltip('hide')
if(!this.isEditorVisible()){this.showEditor()
return}
var left=container.offsetWidth
editor.style.left=left+'px'
link.setAttribute('data-original-title',this.tooltipText)
this.getInput().setAttribute('tabindex','-1')
this.toggleEditorVisibility(true)
setTimeout(this.proxy(this.hideEditor),200)}
ExternalParameterEditor.prototype.toggleEditorVisibility=function(show){var container=this.getContainer(),children=container.children,height=0
if(!show){height=this.containerCell.getAttribute('data-inspector-cell-height')
if(!height){height=$(this.containerCell).height()
this.containerCell.setAttribute('data-inspector-cell-height',height)}}
for(var i=0,len=children.length;i<len;i++){var element=children[i]
if($.oc.foundation.element.hasClass(element,'external-editor')){continue}
if(show){$.oc.foundation.element.removeClass(element,'hide')}
else{container.style.height=height+'px'
$.oc.foundation.element.addClass(element,'hide')}}}
ExternalParameterEditor.prototype.focus=function(){this.getInput().focus()}
ExternalParameterEditor.prototype.validate=function(){var value=$.trim(this.getValue())
if(value.length===0){$.oc.flashMsg({text:'Please enter the external parameter name.','class':'error','interval':5})
this.focus()
return false}
return true}
ExternalParameterEditor.prototype.registerHandlers=function(){var input=this.getInput()
this.getLink().addEventListener('click',this.proxy(this.toggleEditor))
input.addEventListener('focus',this.proxy(this.onInputFocus))
input.addEventListener('change',this.proxy(this.onInputChange))}
ExternalParameterEditor.prototype.onInputFocus=function(){this.inspector.makeCellActive(this.containerCell)}
ExternalParameterEditor.prototype.onInputChange=function(){this.inspector.markPropertyChanged(this.propertyDefinition.property,true)}
ExternalParameterEditor.prototype.unregisterHandlers=function(){var input=this.getInput()
this.getLink().removeEventListener('click',this.proxy(this.toggleEditor))
input.removeEventListener('focus',this.proxy(this.onInputFocus))
input.removeEventListener('change',this.proxy(this.onInputChange))}
ExternalParameterEditor.prototype.disposeControls=function(){$(this.getLink()).tooltip('destroy')}
ExternalParameterEditor.prototype.getInput=function(){return this.containerCell.querySelector('div.external-editor input')}
ExternalParameterEditor.prototype.getValue=function(){return this.getInput().value}
ExternalParameterEditor.prototype.getLink=function(){return this.containerCell.querySelector('a.external-editor-link')}
ExternalParameterEditor.prototype.getContainer=function(){return this.containerCell.querySelector('div.external-param-editor-container')}
ExternalParameterEditor.prototype.getEditor=function(){return this.containerCell.querySelector('div.external-editor')}
ExternalParameterEditor.prototype.getPropertyName=function(){return this.propertyDefinition.property}
ExternalParameterEditor.prototype.isEditorVisible=function(){return $.oc.foundation.element.hasClass(this.getContainer(),'editor-visible')}
$.oc.inspector.externalParameterEditor=ExternalParameterEditor}(window.jQuery);