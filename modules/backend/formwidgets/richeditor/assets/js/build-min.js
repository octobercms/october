
(function($)
{'use strict';if(!Function.prototype.bind)
{Function.prototype.bind=function(scope)
{var fn=this;return function()
{return fn.apply(scope);};};}
var uuid=0;$.fn.redactor=function(options)
{var val=[];var args=Array.prototype.slice.call(arguments,1);if(typeof options==='string')
{this.each(function()
{var instance=$.data(this,'redactor');var func;if(options.search(/\./)!='-1')
{func=options.split('.');if(typeof instance[func[0]]!='undefined')
{func=instance[func[0]][func[1]];}}
else
{func=instance[options];}
if(typeof instance!=='undefined'&&$.isFunction(func))
{var methodVal=func.apply(instance,args);if(methodVal!==undefined&&methodVal!==instance)
{val.push(methodVal);}}
else
{$.error('No such method "'+options+'" for Redactor');}});}
else
{this.each(function()
{$.data(this,'redactor',{});$.data(this,'redactor',Redactor(this,options));});}
if(val.length===0)return this;else if(val.length===1)return val[0];else return val;};function Redactor(el,options)
{return new Redactor.prototype.init(el,options);}
$.Redactor=Redactor;$.Redactor.VERSION='10.2.5';$.Redactor.modules=['alignment','autosave','block','buffer','build','button','caret','clean','code','core','dropdown','file','focus','image','indent','inline','insert','keydown','keyup','lang','line','link','linkify','list','modal','observe','paragraphize','paste','placeholder','progress','selection','shortcuts','tabifier','tidy','toolbar','upload','utils'];$.Redactor.opts={lang:'en',direction:'ltr',plugins:false,focus:false,focusEnd:false,placeholder:false,visual:true,tabindex:false,minHeight:false,maxHeight:false,linebreaks:false,replaceDivs:true,paragraphize:true,cleanStyleOnEnter:false,enterKey:true,cleanOnPaste:true,cleanSpaces:true,pastePlainText:false,autosave:false,autosaveName:false,autosaveInterval:60,autosaveOnChange:false,autosaveFields:false,linkTooltip:true,linkProtocol:'http',linkNofollow:false,linkSize:50,imageEditable:true,imageLink:true,imagePosition:true,imageFloatMargin:'10px',imageResizable:true,imageUpload:null,imageUploadParam:'file',uploadImageField:false,dragImageUpload:true,fileUpload:null,fileUploadParam:'file',dragFileUpload:true,s3:false,convertLinks:true,convertUrlLinks:true,convertImageLinks:true,convertVideoLinks:true,preSpaces:4,tabAsSpaces:false,tabKey:true,scrollTarget:false,toolbar:true,toolbarFixed:true,toolbarFixedTarget:document,toolbarFixedTopOffset:0,toolbarExternal:false,toolbarOverflow:false,source:true,buttons:['html','formatting','bold','italic','deleted','unorderedlist','orderedlist','outdent','indent','image','file','link','alignment','horizontalrule'],buttonsHide:[],buttonsHideOnMobile:[],formatting:['p','blockquote','pre','h1','h2','h3','h4','h5','h6'],formattingAdd:false,tabifier:true,deniedTags:['script','style'],allowedTags:false,paragraphizeBlocks:['table','div','pre','form','ul','ol','h1','h2','h3','h4','h5','h6','dl','blockquote','figcaption','address','section','header','footer','aside','article','object','style','script','iframe','select','input','textarea','button','option','map','area','math','hr','fieldset','legend','hgroup','nav','figure','details','menu','summary','p'],removeComments:false,replaceTags:[['strike','del'],['b','strong']],replaceStyles:[['font-weight:\\s?bold',"strong"],['font-style:\\s?italic',"em"],['text-decoration:\\s?underline',"u"],['text-decoration:\\s?line-through','del']],removeDataAttr:false,removeAttr:false,allowedAttr:false,removeWithoutAttr:['span'],removeEmpty:['p'],activeButtons:['deleted','italic','bold','underline','unorderedlist','orderedlist','alignleft','aligncenter','alignright','justify'],activeButtonsStates:{b:'bold',strong:'bold',i:'italic',em:'italic',del:'deleted',strike:'deleted',ul:'unorderedlist',ol:'orderedlist',u:'underline'},shortcuts:{'ctrl+shift+m, meta+shift+m':{func:'inline.removeFormat'},'ctrl+b, meta+b':{func:'inline.format',params:['bold']},'ctrl+i, meta+i':{func:'inline.format',params:['italic']},'ctrl+h, meta+h':{func:'inline.format',params:['superscript']},'ctrl+l, meta+l':{func:'inline.format',params:['subscript']},'ctrl+k, meta+k':{func:'link.show'},'ctrl+shift+7':{func:'list.toggle',params:['orderedlist']},'ctrl+shift+8':{func:'list.toggle',params:['unorderedlist']}},shortcutsAdd:false,buffer:[],rebuffer:[],emptyHtml:'<p>&#x200b;</p>',invisibleSpace:'&#x200b;',imageTypes:['image/png','image/jpeg','image/gif'],indentValue:20,verifiedTags:['a','img','b','strong','sub','sup','i','em','u','small','strike','del','cite','ul','ol','li'],inlineTags:['strong','b','u','em','i','code','del','ins','samp','kbd','sup','sub','mark','var','cite','small'],alignmentTags:['P','H1','H2','H3','H4','H5','H6','DL','DT','DD','DIV','TD','BLOCKQUOTE','OUTPUT','FIGCAPTION','ADDRESS','SECTION','HEADER','FOOTER','ASIDE','ARTICLE'],blockLevelElements:['PRE','UL','OL','LI'],highContrast:false,observe:{dropdowns:[]},langs:{en:{html:'HTML',video:'Insert Video',image:'Insert Image',table:'Table',link:'Link',link_insert:'Insert link',link_edit:'Edit link',unlink:'Unlink',formatting:'Formatting',paragraph:'Normal text',quote:'Quote',code:'Code',header1:'Header 1',header2:'Header 2',header3:'Header 3',header4:'Header 4',header5:'Header 5',bold:'Bold',italic:'Italic',fontcolor:'Font Color',backcolor:'Back Color',unorderedlist:'Unordered List',orderedlist:'Ordered List',outdent:'Outdent',indent:'Indent',cancel:'Cancel',insert:'Insert',save:'Save',_delete:'Delete',insert_table:'Insert Table',insert_row_above:'Add Row Above',insert_row_below:'Add Row Below',insert_column_left:'Add Column Left',insert_column_right:'Add Column Right',delete_column:'Delete Column',delete_row:'Delete Row',delete_table:'Delete Table',rows:'Rows',columns:'Columns',add_head:'Add Head',delete_head:'Delete Head',title:'Title',image_position:'Position',none:'None',left:'Left',right:'Right',center:'Center',image_web_link:'Image Web Link',text:'Text',mailto:'Email',web:'URL',video_html_code:'Video Embed Code or Youtube/Vimeo Link',file:'Insert File',upload:'Upload',download:'Download',choose:'Choose',or_choose:'Or choose',drop_file_here:'Drop file here',align_left:'Align text to the left',align_center:'Center text',align_right:'Align text to the right',align_justify:'Justify text',horizontalrule:'Insert Horizontal Rule',deleted:'Deleted',anchor:'Anchor',link_new_tab:'Open link in new tab',underline:'Underline',alignment:'Alignment',filename:'Name (optional)',edit:'Edit',upload_label:'Drop file here or '}},linkify:{regexps:{youtube:/https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube\.com\S*[^\w\-\s])([\w\-]{11})(?=[^\w\-]|$)(?![?=&+%\w.\-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig,vimeo:/https?:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/,image:/((https?|www)[^\s]+\.)(jpe?g|png|gif)(\?[^\s-]+)?/ig,url:/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/ig,}},codemirror:false};Redactor.fn=$.Redactor.prototype={keyCode:{BACKSPACE:8,DELETE:46,UP:38,DOWN:40,ENTER:13,SPACE:32,ESC:27,TAB:9,CTRL:17,META:91,SHIFT:16,ALT:18,RIGHT:39,LEFT:37,LEFT_WIN:91},init:function(el,options)
{this.$element=$(el);this.uuid=uuid++;this.rtePaste=false;this.$pasteBox=false;this.loadOptions(options);this.loadModules();this.formatting={};$.merge(this.opts.blockLevelElements,this.opts.alignmentTags);this.reIsBlock=new RegExp('^('+this.opts.blockLevelElements.join('|')+')$','i');this.tidy.setupAllowed();if(this.opts.deniedTags!==false)
{var tags=['html','head','link','body','meta','applet'];for(var i=0;i<tags.length;i++)
{this.opts.deniedTags.push(tags[i]);}}
this.lang.load();$.extend(this.opts.shortcuts,this.opts.shortcutsAdd);this.core.setCallback('start');this.start=true;this.build.run();},loadOptions:function(options)
{this.opts=$.extend({},$.extend(true,{},$.Redactor.opts),this.$element.data(),options);},getModuleMethods:function(object)
{return Object.getOwnPropertyNames(object).filter(function(property)
{return typeof object[property]=='function';});},loadModules:function()
{var len=$.Redactor.modules.length;for(var i=0;i<len;i++)
{this.bindModuleMethods($.Redactor.modules[i]);}},bindModuleMethods:function(module)
{if(typeof this[module]=='undefined')return;this[module]=this[module]();var methods=this.getModuleMethods(this[module]);var len=methods.length;for(var z=0;z<len;z++)
{this[module][methods[z]]=this[module][methods[z]].bind(this);}},alignment:function()
{return{left:function()
{this.alignment.set('');},right:function()
{this.alignment.set('right');},center:function()
{this.alignment.set('center');},justify:function()
{this.alignment.set('justify');},set:function(type)
{if(!this.utils.browser('msie')&&!this.opts.linebreaks)
{this.$editor.focus();}
this.alignment.blocks=this.selection.getBlocks();this.alignment.type=type;this.buffer.set();this.selection.save();if(this.alignment.isLinebreaksOrNoBlocks())
{this.alignment.setText();}
else
{this.alignment.setBlocks();}
this.selection.restore();this.code.sync();},setText:function()
{var wrapper=this.selection.wrap('div');$(wrapper).attr('data-tagblock','redactor').css('text-align',this.alignment.type);},setBlocks:function()
{$.each(this.alignment.blocks,$.proxy(function(i,el)
{var $el=this.utils.getAlignmentElement(el);if(!$el)return;if(this.alignment.isNeedReplaceElement($el))
{this.alignment.replaceElement($el);}
else
{this.alignment.alignElement($el);}},this));},isLinebreaksOrNoBlocks:function()
{return(this.opts.linebreaks&&this.alignment.blocks[0]===false);},isNeedReplaceElement:function($el)
{return(this.alignment.type===''&&typeof($el.data('tagblock'))!=='undefined');},replaceElement:function($el)
{$el.replaceWith($el.html());},alignElement:function($el)
{$el.css('text-align',this.alignment.type);this.utils.removeEmptyAttr($el,'style');}};},autosave:function()
{return{html:false,enable:function()
{if(!this.opts.autosave)return;this.autosave.name=(this.opts.autosaveName)?this.opts.autosaveName:this.$textarea.attr('name');if(this.opts.autosaveOnChange)return;this.autosaveInterval=setInterval(this.autosave.load,this.opts.autosaveInterval*1000);},onChange:function()
{if(!this.opts.autosaveOnChange)return;this.autosave.load();},load:function()
{if(!this.opts.autosave)return;this.autosave.source=this.code.get();if(this.autosave.html===this.autosave.source)return;var data={};data['name']=this.autosave.name;data[this.autosave.name]=this.autosave.source;data=this.autosave.getHiddenFields(data);var jsxhr=$.ajax({url:this.opts.autosave,type:'post',data:data});jsxhr.done(this.autosave.success);},getHiddenFields:function(data)
{if(this.opts.autosaveFields===false||typeof this.opts.autosaveFields!=='object')
{return data;}
$.each(this.opts.autosaveFields,$.proxy(function(k,v)
{if(v!==null&&v.toString().indexOf('#')===0)v=$(v).val();data[k]=v;},this));return data;},success:function(data)
{var json;try
{json=$.parseJSON(data);}
catch(e)
{json=data;}
var callbackName=(typeof json.error=='undefined')?'autosave':'autosaveError';this.core.setCallback(callbackName,this.autosave.name,json);this.autosave.html=this.autosave.source;},disable:function()
{clearInterval(this.autosaveInterval);}};},block:function()
{return{formatting:function(name)
{this.block.clearStyle=false;var type,value;if(typeof this.formatting[name].data!='undefined')type='data';else if(typeof this.formatting[name].attr!='undefined')type='attr';else if(typeof this.formatting[name]['class']!='undefined')type='class';if(typeof this.formatting[name].clear!='undefined')
{this.block.clearStyle=true;}
if(type)value=this.formatting[name][type];this.block.format(this.formatting[name].tag,type,value);},format:function(tag,type,value)
{if(tag=='quote')tag='blockquote';var formatTags=['p','pre','blockquote','h1','h2','h3','h4','h5','h6'];if($.inArray(tag,formatTags)==-1)return;this.block.isRemoveInline=(tag=='pre'||tag.search(/h[1-6]/i)!=-1);if(!this.utils.browser('msie'))this.$editor.focus();var html=$.trim(this.$editor.html());this.block.isEmpty=this.utils.isEmpty(html);if(this.utils.browser('mozilla')&&!this.focus.isFocused())
{if(this.block.isEmpty)
{var $first;if(!this.opts.linebreaks)
{$first=this.$editor.children().first();this.caret.setEnd($first);}}}
this.block.blocks=this.selection.getBlocks();this.block.blocksSize=this.block.blocks.length;this.block.type=type;this.block.value=value;this.buffer.set();this.selection.save();this.block.set(tag);this.selection.restore();this.code.sync();this.observe.load();},set:function(tag)
{this.selection.get();this.block.containerTag=this.range.commonAncestorContainer.tagName;if(this.range.collapsed)
{this.block.setCollapsed(tag);}
else
{this.block.setMultiple(tag);}},setCollapsed:function(tag)
{if(this.opts.linebreaks&&this.block.isEmpty&&tag!='p')
{var node=document.createElement(tag);this.$editor.html(node);this.caret.setEnd(node);return;}
var block=this.block.blocks[0];if(block===false)return;if(block.tagName=='LI')
{if(tag!='blockquote')return;this.block.formatListToBlockquote();return;}
var isContainerTable=(this.block.containerTag=='TD'||this.block.containerTag=='TH');if(isContainerTable&&!this.opts.linebreaks)
{document.execCommand('formatblock',false,'<'+tag+'>');block=this.selection.getBlock();this.block.toggle($(block));}
else if(block.tagName.toLowerCase()!=tag)
{if(this.opts.linebreaks&&tag=='p')
{$(block).append('<br>');this.utils.replaceWithContents(block);}
else
{var $formatted=this.utils.replaceToTag(block,tag);this.block.toggle($formatted);if(tag!='p'&&tag!='blockquote')$formatted.find('img').remove();if(this.block.isRemoveInline)this.utils.removeInlineTags($formatted);if(tag=='p'||this.block.headTag)$formatted.find('p').contents().unwrap();this.block.formatTableWrapping($formatted);}}
else if(tag=='blockquote'&&block.tagName.toLowerCase()==tag)
{if(this.opts.linebreaks)
{$(block).append('<br>');this.utils.replaceWithContents(block);}
else
{var $el=this.utils.replaceToTag(block,'p');this.block.toggle($el);}}
else if(block.tagName.toLowerCase()==tag)
{this.block.toggle($(block));}
if(typeof this.block.type=='undefined'&&typeof this.block.value=='undefined')
{$(block).removeAttr('class').removeAttr('style');}},setMultiple:function(tag)
{var block=this.block.blocks[0];var isContainerTable=(this.block.containerTag=='TD'||this.block.containerTag=='TH');if(block!==false&&this.block.blocksSize===1)
{if(block.tagName.toLowerCase()==tag&&tag=='blockquote')
{if(this.opts.linebreaks)
{$(block).append('<br>');this.utils.replaceWithContents(block);}
else
{var $el=this.utils.replaceToTag(block,'p');this.block.toggle($el);}}
else if(block.tagName=='LI')
{if(tag!='blockquote')return;this.block.formatListToBlockquote();}
else if(this.block.containerTag=='BLOCKQUOTE')
{this.block.formatBlockquote(tag);}
else if(this.opts.linebreaks&&((isContainerTable)||(this.range.commonAncestorContainer!=block)))
{this.block.formatWrap(tag);}
else
{if(this.opts.linebreaks&&tag=='p')
{$(block).prepend('<br>').append('<br>');this.utils.replaceWithContents(block);}
else if(block.tagName==='TD')
{this.block.formatWrap(tag);}
else
{var $formatted=this.utils.replaceToTag(block,tag);this.block.toggle($formatted);if(this.block.isRemoveInline)this.utils.removeInlineTags($formatted);if(tag=='p'||this.block.headTag)$formatted.find('p').contents().unwrap();}}}
else
{if(this.opts.linebreaks||tag!='p')
{if(tag=='blockquote')
{var count=0;for(var i=0;i<this.block.blocksSize;i++)
{if(this.block.blocks[i].tagName=='BLOCKQUOTE')count++;}
if(count==this.block.blocksSize)
{$.each(this.block.blocks,$.proxy(function(i,s)
{var $formatted=false;if(this.opts.linebreaks)
{$(s).prepend('<br>').append('<br>');$formatted=this.utils.replaceWithContents(s);}
else
{$formatted=this.utils.replaceToTag(s,'p');}
if($formatted&&typeof this.block.type=='undefined'&&typeof this.block.value=='undefined')
{$formatted.removeAttr('class').removeAttr('style');}},this));return;}}
this.block.formatWrap(tag);}
else
{var classSize=0;var toggleType=false;if(this.block.type=='class')
{toggleType='toggle';classSize=$(this.block.blocks).filter('.'+this.block.value).length;if(this.block.blocksSize==classSize)toggleType='toggle';else if(this.block.blocksSize>classSize)toggleType='set';else if(classSize===0)toggleType='set';}
var exceptTags=['ul','ol','li','td','th','dl','dt','dd'];$.each(this.block.blocks,$.proxy(function(i,s)
{if($.inArray(s.tagName.toLowerCase(),exceptTags)!=-1)return;var $formatted=this.utils.replaceToTag(s,tag);if(toggleType)
{if(toggleType=='toggle')this.block.toggle($formatted);else if(toggleType=='remove')this.block.remove($formatted);else if(toggleType=='set')this.block.setForce($formatted);}
else this.block.toggle($formatted);if(tag!='p'&&tag!='blockquote')$formatted.find('img').remove();if(this.block.isRemoveInline)this.utils.removeInlineTags($formatted);if(tag=='p'||this.block.headTag)$formatted.find('p').contents().unwrap();if(typeof this.block.type=='undefined'&&typeof this.block.value=='undefined')
{$formatted.removeAttr('class').removeAttr('style');}},this));}}},setForce:function($el)
{if(this.block.clearStyle)
{$el.removeAttr('class').removeAttr('style');}
if(this.block.type=='class')
{$el.addClass(this.block.value);return;}
else if(this.block.type=='attr'||this.block.type=='data')
{$el.attr(this.block.value.name,this.block.value.value);return;}},toggle:function($el)
{if(this.block.clearStyle)
{$el.removeAttr('class').removeAttr('style');}
if(this.block.type=='class')
{$el.toggleClass(this.block.value);return;}
else if(this.block.type=='attr'||this.block.type=='data')
{if($el.attr(this.block.value.name)==this.block.value.value)
{$el.removeAttr(this.block.value.name);}
else
{$el.attr(this.block.value.name,this.block.value.value);}
return;}
else
{$el.removeAttr('style class');return;}},remove:function($el)
{$el.removeClass(this.block.value);},formatListToBlockquote:function()
{var block=$(this.block.blocks[0]).closest('ul, ol',this.$editor[0]);$(block).find('ul, ol').contents().unwrap();$(block).find('li').append($('<br>')).contents().unwrap();var $el=this.utils.replaceToTag(block,'blockquote');this.block.toggle($el);},formatBlockquote:function(tag)
{document.execCommand('outdent');document.execCommand('formatblock',false,tag);this.clean.clearUnverified();this.$editor.find('p:empty').remove();var formatted=this.selection.getBlock();if(tag!='p')
{$(formatted).find('img').remove();}
if(!this.opts.linebreaks)
{this.block.toggle($(formatted));}
this.$editor.find('ul, ol, tr, blockquote, p').each($.proxy(this.utils.removeEmpty,this));if(this.opts.linebreaks&&tag=='p')
{this.utils.replaceWithContents(formatted);}},formatWrap:function(tag)
{if(this.block.containerTag=='UL'||this.block.containerTag=='OL')
{if(tag=='blockquote')
{this.block.formatListToBlockquote();}
else
{return;}}
var formatted=this.selection.wrap(tag);if(formatted===false)return;var $formatted=$(formatted);this.block.formatTableWrapping($formatted);var $elements=$formatted.find(this.opts.blockLevelElements.join(',')+', td, table, thead, tbody, tfoot, th, tr');$elements.contents().unwrap();if(tag!='p'&&tag!='blockquote')$formatted.find('img').remove();$.each(this.block.blocks,$.proxy(this.utils.removeEmpty,this));$formatted.append(this.selection.getMarker(2));if(!this.opts.linebreaks)
{this.block.toggle($formatted);}
this.$editor.find('ul, ol, tr, blockquote, p').each($.proxy(this.utils.removeEmpty,this));$formatted.find('blockquote:empty').remove();if(this.block.isRemoveInline)
{this.utils.removeInlineTags($formatted);}
if(this.opts.linebreaks&&tag=='p')
{this.utils.replaceWithContents($formatted);}
if(this.opts.linebreaks)
{var $next=$formatted.next().next();if($next.size()!=0&&$next[0].tagName==='BR')
{$next.remove();}}},formatTableWrapping:function($formatted)
{if($formatted.closest('table',this.$editor[0]).length===0)return;if($formatted.closest('tr',this.$editor[0]).length===0)$formatted.wrap('<tr>');if($formatted.closest('td',this.$editor[0]).length===0&&$formatted.closest('th').length===0)
{$formatted.wrap('<td>');}},removeData:function(name,value)
{var blocks=this.selection.getBlocks();$(blocks).removeAttr('data-'+name);this.code.sync();},setData:function(name,value)
{var blocks=this.selection.getBlocks();$(blocks).attr('data-'+name,value);this.code.sync();},toggleData:function(name,value)
{var blocks=this.selection.getBlocks();$.each(blocks,function()
{if($(this).attr('data-'+name))
{$(this).removeAttr('data-'+name);}
else
{$(this).attr('data-'+name,value);}});},removeAttr:function(attr,value)
{var blocks=this.selection.getBlocks();$(blocks).removeAttr(attr);this.code.sync();},setAttr:function(attr,value)
{var blocks=this.selection.getBlocks();$(blocks).attr(attr,value);this.code.sync();},toggleAttr:function(attr,value)
{var blocks=this.selection.getBlocks();$.each(blocks,function()
{if($(this).attr(name))
{$(this).removeAttr(name);}
else
{$(this).attr(name,value);}});},removeClass:function(className)
{var blocks=this.selection.getBlocks();$(blocks).removeClass(className);this.utils.removeEmptyAttr(blocks,'class');this.code.sync();},setClass:function(className)
{var blocks=this.selection.getBlocks();$(blocks).addClass(className);this.code.sync();},toggleClass:function(className)
{var blocks=this.selection.getBlocks();$(blocks).toggleClass(className);this.code.sync();}};},buffer:function()
{return{set:function(type)
{if(typeof type=='undefined'||type=='undo')
{this.buffer.setUndo();}
else
{this.buffer.setRedo();}},setUndo:function()
{this.selection.save();this.opts.buffer.push(this.$editor.html());this.selection.restore();},setRedo:function()
{this.selection.save();this.opts.rebuffer.push(this.$editor.html());this.selection.restore();},getUndo:function()
{this.$editor.html(this.opts.buffer.pop());},getRedo:function()
{this.$editor.html(this.opts.rebuffer.pop());},add:function()
{this.opts.buffer.push(this.$editor.html());},undo:function()
{if(this.opts.buffer.length===0)return;this.buffer.set('redo');this.buffer.getUndo();this.selection.restore();setTimeout($.proxy(this.observe.load,this),50);},redo:function()
{if(this.opts.rebuffer.length===0)return;this.buffer.set('undo');this.buffer.getRedo();this.selection.restore();setTimeout($.proxy(this.observe.load,this),50);}};},build:function()
{return{focused:false,blured:true,run:function()
{this.build.createContainerBox();this.build.loadContent();this.build.loadEditor();this.build.enableEditor();this.build.setCodeAndCall();},isTextarea:function()
{return(this.$element[0].tagName==='TEXTAREA');},createContainerBox:function()
{this.$box=$('<div class="redactor-box" role="application" />');},createTextarea:function()
{this.$textarea=$('<textarea />').attr('name',this.build.getTextareaName());},getTextareaName:function()
{return((typeof(name)=='undefined'))?'content-'+this.uuid:this.$element.attr('id');},loadContent:function()
{var func=(this.build.isTextarea())?'val':'html';this.content=$.trim(this.$element[func]());},enableEditor:function()
{this.$editor.attr({'contenteditable':true,'dir':this.opts.direction});},loadEditor:function()
{var func=(this.build.isTextarea())?'fromTextarea':'fromElement';this.build[func]();},fromTextarea:function()
{this.$editor=$('<div />');this.$textarea=this.$element;this.$box.insertAfter(this.$element).append(this.$editor).append(this.$element);this.$editor.addClass('redactor-editor');this.$element.hide();},fromElement:function()
{this.$editor=this.$element;this.build.createTextarea();this.$box.insertAfter(this.$editor).append(this.$editor).append(this.$textarea);this.$editor.addClass('redactor-editor');this.$textarea.hide();},setCodeAndCall:function()
{this.code.set(this.content);this.build.setOptions();this.build.callEditor();if(this.opts.visual)return;setTimeout($.proxy(this.code.showCode,this),200);},callEditor:function()
{this.build.disableMozillaEditing();this.build.disableIeLinks();this.build.setEvents();this.build.setHelpers();if(this.opts.toolbar)
{this.opts.toolbar=this.toolbar.init();this.toolbar.build();}
this.modal.loadTemplates();this.build.plugins();setTimeout($.proxy(this.observe.load,this),4);this.core.setCallback('init');},setOptions:function()
{$(this.$textarea).attr('dir',this.opts.direction);if(this.opts.linebreaks)this.$editor.addClass('redactor-linebreaks');if(this.opts.tabindex)this.$editor.attr('tabindex',this.opts.tabindex);if(this.opts.minHeight)this.$editor.css('minHeight',this.opts.minHeight);if(this.opts.maxHeight)this.$editor.css('maxHeight',this.opts.maxHeight);},setEventDropUpload:function(e)
{e.preventDefault();if(!this.opts.dragImageUpload||!this.opts.dragFileUpload)return;var files=e.dataTransfer.files;this.upload.directUpload(files[0],e);},setEventDrop:function(e)
{this.code.sync();setTimeout(this.clean.clearUnverified,1);this.core.setCallback('drop',e);},setEvents:function()
{this.$editor.on('dragover.redactor dragenter.redactor',function(e)
{e.preventDefault();e.stopPropagation();});this.$editor.on('drop.redactor',$.proxy(function(e)
{e=e.originalEvent||e;if(window.FormData===undefined||!e.dataTransfer)return true;if(e.dataTransfer.files.length===0)
{return this.build.setEventDrop(e);}
else
{this.build.setEventDropUpload(e);}
setTimeout(this.clean.clearUnverified,1);this.core.setCallback('drop',e);},this));this.$editor.on('click.redactor',$.proxy(function(e)
{var event=this.core.getEvent();var type=(event=='click'||event=='arrow')?false:'click';this.core.addEvent(type);this.utils.disableSelectAll();this.core.setCallback('click',e);},this));this.$editor.on('paste.redactor',$.proxy(this.paste.init,this));this.$editor.on('cut.redactor',$.proxy(this.code.sync,this));this.$editor.on('keydown.redactor',$.proxy(this.keydown.init,this));this.$editor.on('keyup.redactor',$.proxy(this.keyup.init,this));if($.isFunction(this.opts.codeKeydownCallback))
{this.$textarea.on('keydown.redactor-textarea',$.proxy(this.opts.codeKeydownCallback,this));}
if($.isFunction(this.opts.codeKeyupCallback))
{this.$textarea.on('keyup.redactor-textarea',$.proxy(this.opts.codeKeyupCallback,this));}
this.$editor.on('focus.redactor',$.proxy(function(e)
{if($.isFunction(this.opts.focusCallback))
{this.core.setCallback('focus',e);}
this.build.focused=true;this.build.blured=false;if(this.selection.getCurrent()===false)
{this.selection.get();this.range.setStart(this.$editor[0],0);this.range.setEnd(this.$editor[0],0);this.selection.addRange();}},this));$(document).on('mousedown.redactor-blur.'+this.uuid,$.proxy(function(e)
{if(this.start)return;if(this.rtePaste)return;if($(e.target).closest('.redactor-editor, .redactor-toolbar, .redactor-dropdown').size()!==0)
{return;}
this.utils.disableSelectAll();if(!this.build.blured&&$.isFunction(this.opts.blurCallback))
{this.core.setCallback('blur',e);}
this.build.focused=false;this.build.blured=true;},this));},setHelpers:function()
{if(this.linkify.isEnabled())
{this.linkify.format();}
this.placeholder.enable();if(this.opts.focus)setTimeout(this.focus.setStart,100);if(this.opts.focusEnd)setTimeout(this.focus.setEnd,100);},plugins:function()
{if(!this.opts.plugins)return;$.each(this.opts.plugins,$.proxy(function(i,s)
{var func=(typeof RedactorPlugins!=='undefined'&&typeof RedactorPlugins[s]!=='undefined')?RedactorPlugins:Redactor.fn;if(!$.isFunction(func[s]))
{return;}
this[s]=func[s]();var methods=this.getModuleMethods(this[s]);var len=methods.length;for(var z=0;z<len;z++)
{this[s][methods[z]]=this[s][methods[z]].bind(this);}
if($.isFunction(this[s].init))
{this[s].init();}},this));},disableMozillaEditing:function()
{if(!this.utils.browser('mozilla'))return;try{document.execCommand('enableObjectResizing',false,false);document.execCommand('enableInlineTableEditing',false,false);}catch(e){}},disableIeLinks:function()
{if(!this.utils.browser('msie'))return;document.execCommand("AutoUrlDetect",false,false);}};},button:function()
{return{build:function(btnName,btnObject)
{var $button=$('<a href="#" class="re-icon re-'+btnName+'" rel="'+btnName+'" />').attr({'role':'button','aria-label':btnObject.title,'tabindex':'-1'});if(btnObject.func||btnObject.command||btnObject.dropdown)
{this.button.setEvent($button,btnName,btnObject);}
if(btnObject.dropdown)
{$button.addClass('redactor-toolbar-link-dropdown').attr('aria-haspopup',true);var $dropdown=$('<div class="redactor-dropdown redactor-dropdown-'+this.uuid+' redactor-dropdown-box-'+btnName+'" style="display: none;">');$button.data('dropdown',$dropdown);this.dropdown.build(btnName,$dropdown,btnObject.dropdown);}
if(this.utils.isDesktop())
{this.button.createTooltip($button,btnName,btnObject.title);}
return $button;},setEvent:function($button,btnName,btnObject)
{$button.on('touchstart click',$.proxy(function(e)
{if($button.hasClass('redactor-button-disabled'))return false;var type='func';var callback=btnObject.func;if(btnObject.command)
{type='command';callback=btnObject.command;}
else if(btnObject.dropdown)
{type='dropdown';callback=false;}
this.button.onClick(e,btnName,type,callback);},this));},createTooltip:function($button,name,title)
{var $tooltip=$('<span>').addClass('redactor-toolbar-tooltip redactor-toolbar-tooltip-'+this.uuid+' redactor-toolbar-tooltip-'+name).hide().html(title);$tooltip.appendTo('body');$button.on('mouseover',function()
{if($(this).hasClass('redactor-button-disabled'))
{return;}
var pos=$button.offset();$tooltip.css({top:(pos.top+$button.innerHeight())+'px',left:(pos.left+$button.innerWidth()/2-$tooltip.innerWidth()/2)+'px'});$tooltip.show();});$button.on('mouseout',function()
{$tooltip.hide();});},onClick:function(e,btnName,type,callback)
{this.button.caretOffset=this.caret.getOffset();e.preventDefault();$(document).find('.redactor-toolbar-tooltip').hide();if(this.utils.browser('msie'))e.returnValue=false;if(type=='command')this.inline.format(callback);else if(type=='dropdown')this.dropdown.show(e,btnName);else this.button.onClickCallback(e,callback,btnName);},onClickCallback:function(e,callback,btnName)
{var func;if($.isFunction(callback))callback.call(this,btnName);else if(callback.search(/\./)!='-1')
{func=callback.split('.');if(typeof this[func[0]]=='undefined')return;this[func[0]][func[1]](btnName);}
else this[callback](btnName);this.observe.buttons(e,btnName);},get:function(key)
{return this.$toolbar.find('a.re-'+key);},setActive:function(key)
{this.button.get(key).addClass('redactor-act');},setInactive:function(key)
{this.button.get(key).removeClass('redactor-act');},setInactiveAll:function(key)
{if(typeof key==='undefined')
{this.$toolbar.find('a.re-icon').removeClass('redactor-act');}
else
{this.$toolbar.find('a.re-icon').not('.re-'+key).removeClass('redactor-act');}},setActiveInVisual:function()
{this.$toolbar.find('a.re-icon').not('a.re-html, a.re-fullscreen').removeClass('redactor-button-disabled');},setInactiveInCode:function()
{this.$toolbar.find('a.re-icon').not('a.re-html, a.re-fullscreen').addClass('redactor-button-disabled');},changeIcon:function(key,classname)
{this.button.get(key).addClass('re-'+classname);},removeIcon:function(key,classname)
{this.button.get(key).removeClass('re-'+classname);},setAwesome:function(key,name)
{var $button=this.button.get(key);$button.removeClass('redactor-btn-image').addClass('fa-redactor-btn');$button.html('<i class="fa '+name+'"></i>');},addCallback:function($btn,callback)
{if($btn=="buffer")return;var type=(callback=='dropdown')?'dropdown':'func';var key=$btn.attr('rel');$btn.on('touchstart click',$.proxy(function(e)
{if($btn.hasClass('redactor-button-disabled'))return false;this.button.onClick(e,key,type,callback);},this));},addDropdown:function($btn,dropdown)
{$btn.addClass('redactor-toolbar-link-dropdown').attr('aria-haspopup',true);var key=$btn.attr('rel');this.button.addCallback($btn,'dropdown');var $dropdown=$('<div class="redactor-dropdown redactor-dropdown-'+this.uuid+' redactor-dropdown-box-'+key+'" style="display: none;">');$btn.data('dropdown',$dropdown);if(dropdown)this.dropdown.build(key,$dropdown,dropdown);return $dropdown;},add:function(key,title)
{if(!this.opts.toolbar)return;if(this.button.isMobileUndoRedo(key))return"buffer";var btn=this.button.build(key,{title:title});btn.addClass('redactor-btn-image');this.$toolbar.append($('<li>').append(btn));return btn;},addFirst:function(key,title)
{if(!this.opts.toolbar)return;if(this.button.isMobileUndoRedo(key))return"buffer";var btn=this.button.build(key,{title:title});btn.addClass('redactor-btn-image');this.$toolbar.prepend($('<li>').append(btn));return btn;},addAfter:function(afterkey,key,title)
{if(!this.opts.toolbar)return;if(this.button.isMobileUndoRedo(key))return"buffer";var btn=this.button.build(key,{title:title});btn.addClass('redactor-btn-image');var $btn=this.button.get(afterkey);if($btn.length!==0)$btn.parent().after($('<li>').append(btn));else this.$toolbar.append($('<li>').append(btn));return btn;},addBefore:function(beforekey,key,title)
{if(!this.opts.toolbar)return;if(this.button.isMobileUndoRedo(key))return"buffer";var btn=this.button.build(key,{title:title});btn.addClass('redactor-btn-image');var $btn=this.button.get(beforekey);if($btn.length!==0)$btn.parent().before($('<li>').append(btn));else this.$toolbar.append($('<li>').append(btn));return btn;},remove:function(key)
{this.button.get(key).remove();},isMobileUndoRedo:function(key)
{return(key=="undo"||key=="redo")&&!this.utils.isDesktop();}};},caret:function()
{return{setStart:function(node)
{if(!this.utils.isBlock(node))
{var space=this.utils.createSpaceElement();$(node).prepend(space);this.caret.setEnd(space);}
else
{this.caret.set(node,0,node,0);}},setEnd:function(node)
{node=node[0]||node;if(node.lastChild.nodeType==1)
{return this.caret.setAfter(node.lastChild);}
this.caret.set(node,1,node,1);},set:function(orgn,orgo,focn,foco)
{orgn=orgn[0]||orgn;focn=focn[0]||focn;if(this.utils.isBlockTag(orgn.tagName)&&orgn.innerHTML==='')
{orgn.innerHTML=this.opts.invisibleSpace;}
if(orgn.tagName=='BR'&&this.opts.linebreaks===false)
{var parent=$(this.opts.emptyHtml)[0];$(orgn).replaceWith(parent);orgn=parent;focn=orgn;}
this.selection.get();try
{this.range.setStart(orgn,orgo);this.range.setEnd(focn,foco);}
catch(e){}
this.selection.addRange();},setAfter:function(node)
{try
{var tag=$(node)[0].tagName;if(tag!='BR'&&!this.utils.isBlock(node))
{var space=this.utils.createSpaceElement();$(node).after(space);this.caret.setEnd(space);}
else
{if(tag!='BR'&&this.utils.browser('msie'))
{this.caret.setStart($(node).next());}
else
{this.caret.setAfterOrBefore(node,'after');}}}
catch(e)
{var space=this.utils.createSpaceElement();$(node).after(space);this.caret.setEnd(space);}},setBefore:function(node)
{if(this.utils.isBlock(node))
{this.caret.setEnd($(node).prev());}
else
{this.caret.setAfterOrBefore(node,'before');}},setAfterOrBefore:function(node,type)
{if(!this.utils.browser('msie'))this.$editor.focus();node=node[0]||node;this.selection.get();if(type=='after')
{try{this.range.setStartAfter(node);this.range.setEndAfter(node);}
catch(e){}}
else
{try{this.range.setStartBefore(node);this.range.setEndBefore(node);}
catch(e){}}
this.range.collapse(false);this.selection.addRange();},getOffsetOfElement:function(node)
{node=node[0]||node;this.selection.get();var cloned=this.range.cloneRange();cloned.selectNodeContents(node);cloned.setEnd(this.range.endContainer,this.range.endOffset);return $.trim(cloned.toString()).length;},getOffset:function()
{var offset=0;var sel=window.getSelection();if(sel.rangeCount>0)
{var range=window.getSelection().getRangeAt(0);var caretRange=range.cloneRange();caretRange.selectNodeContents(this.$editor[0]);caretRange.setEnd(range.endContainer,range.endOffset);offset=caretRange.toString().length;}
return offset;},setOffset:function(start,end)
{if(typeof end=='undefined')end=start;if(!this.focus.isFocused())this.focus.setStart();var sel=this.selection.get();var node,offset=0;var walker=document.createTreeWalker(this.$editor[0],NodeFilter.SHOW_TEXT,null,null);while(node=walker.nextNode())
{offset+=node.nodeValue.length;if(offset>start)
{this.range.setStart(node,node.nodeValue.length+start-offset);start=Infinity;}
if(offset>=end)
{this.range.setEnd(node,node.nodeValue.length+end-offset);break;}}
this.range.collapse(false);this.selection.addRange();},setToPoint:function(start,end)
{this.caret.setOffset(start,end);},getCoords:function()
{return this.caret.getOffset();}};},clean:function()
{return{onSet:function(html)
{html=this.clean.savePreCode(html);html=html.replace(/<script(.*?[^>]?)>([\w\W]*?)<\/script>/gi,'<pre class="redactor-script-tag" style="display: none;" $1>$2</pre>');html=html.replace(/\$/g,'&#36;');html=html.replace(/<a href="(.*?[^>]?)®(.*?[^>]?)">/gi,'<a href="$1&reg$2">');if(this.opts.replaceDivs&&!this.opts.linebreaks)html=this.clean.replaceDivs(html);if(this.opts.linebreaks)html=this.clean.replaceParagraphsToBr(html);html=this.clean.saveFormTags(html);var $div=$('<div>');$div.html(html);var fonts=$div.find('font[style]');if(fonts.length!==0)
{fonts.replaceWith(function()
{var $el=$(this);var $span=$('<span>').attr('style',$el.attr('style'));return $span.append($el.contents());});html=$div.html();}
$div.remove();html=html.replace(/<font(.*?)>/gi,'');html=html.replace(/<\/font>/gi,'');html=this.tidy.load(html);if(this.opts.paragraphize)html=this.paragraphize.load(html);html=this.clean.setVerified(html);html=this.clean.convertInline(html);html=html.replace(/&amp;/g,'&');return html;},onSync:function(html)
{html=html.replace(/\u200B/g,'');html=html.replace(/&#x200b;/gi,'');if(this.opts.cleanSpaces)
{html=html.replace(/&nbsp;/gi,' ');}
if(html.search(/^<p>(||\s||<br\s?\/?>||&nbsp;)<\/p>$/i)!=-1)
{return'';}
html=html.replace(/<pre class="redactor-script-tag" style="display: none;"(.*?[^>]?)>([\w\W]*?)<\/pre>/gi,'<script$1>$2</script>');html=this.clean.restoreFormTags(html);var chars={'\u2122':'&trade;','\u00a9':'&copy;','\u2026':'&hellip;','\u2014':'&mdash;','\u2010':'&dash;'};$.each(chars,function(i,s)
{html=html.replace(new RegExp(i,'g'),s);});if(this.utils.browser('mozilla'))
{html=html.replace(/<br\s?\/?>$/gi,'');}
html=html.replace(new RegExp('<br\\s?/?></li>','gi'),'</li>');html=html.replace(new RegExp('</li><br\\s?/?>','gi'),'</li>');html=html.replace(/<(.*?)rel="\s*?"(.*?[^>]?)>/gi,'<$1$2">');html=html.replace(/<(.*?)style="\s*?"(.*?[^>]?)>/gi,'<$1$2">');html=html.replace(/="">/gi,'>');html=html.replace(/""">/gi,'">');html=html.replace(/"">/gi,'">');html=html.replace(/<div(.*?)data-tagblock="redactor"(.*?[^>])>/gi,'<div$1$2>');html=html.replace(/<(.*?) data-verified="redactor"(.*?[^>])>/gi,'<$1$2>');var $div=$("<div/>").html($.parseHTML(html,document,true));$div.find("span").removeAttr("rel");$div.find('pre .redactor-invisible-space').each(function()
{$(this).contents().unwrap();});html=$div.html();html=html.replace(/<img(.*?[^>])rel="(.*?[^>])"(.*?[^>])>/gi,'<img$1$3>');html=html.replace(/<span class="redactor-invisible-space">(.*?)<\/span>/gi,'$1');html=html.replace(/ data-save-url="(.*?[^>])"/gi,'');html=html.replace(/<span(.*?)id="redactor-image-box"(.*?[^>])>([\w\W]*?)<img(.*?)><\/span>/gi,'$3<img$4>');html=html.replace(/<span(.*?)id="redactor-image-resizer"(.*?[^>])>(.*?)<\/span>/gi,'');html=html.replace(/<span(.*?)id="redactor-image-editter"(.*?[^>])>(.*?)<\/span>/gi,'');html=html.replace(/<font(.*?)>/gi,'');html=html.replace(/<\/font>/gi,'');html=this.tidy.load(html);if(this.opts.linkNofollow)
{html=html.replace(/<a(.*?)rel="nofollow"(.*?[^>])>/gi,'<a$1$2>');html=html.replace(/<a(.*?[^>])>/gi,'<a$1 rel="nofollow">');}
html=html.replace(/\sdata-redactor-(tag|class|style)="(.*?[^>])"/gi,'');html=html.replace(new RegExp('<(.*?) data-verified="redactor"(.*?[^>])>','gi'),'<$1$2>');html=html.replace(new RegExp('<(.*?) data-verified="redactor">','gi'),'<$1>');html=html.replace(/&amp;/g,'&');return html;},onPaste:function(html,setMode)
{html=$.trim(html);html=html.replace(/\$/g,'&#36;');html=html.replace(/<span class="s[0-9]">/gi,'<span>');html=html.replace(/<span class="Apple-converted-space">&nbsp;<\/span>/gi,' ');html=html.replace(/<span class="Apple-tab-span"[^>]*>\t<\/span>/gi,'\t');html=html.replace(/<span[^>]*>(\s|&nbsp;)<\/span>/gi,' ');if(this.opts.pastePlainText)
{return this.clean.getPlainText(html);}
if(!this.utils.isSelectAll()&&typeof setMode=='undefined')
{if(this.utils.isCurrentOrParent(['FIGCAPTION','A']))
{return this.clean.getPlainText(html,false);}
if(this.utils.isCurrentOrParent('PRE'))
{html=html.replace(/”/g,'"');html=html.replace(/“/g,'"');html=html.replace(/‘/g,'\'');html=html.replace(/’/g,'\'');return this.clean.getPreCode(html);}
if(this.utils.isCurrentOrParent(['BLOCKQUOTE','H1','H2','H3','H4','H5','H6']))
{html=this.clean.getOnlyImages(html);if(!this.utils.browser('msie'))
{var block=this.selection.getBlock();if(block&&block.tagName=='P')
{html=html.replace(/<img(.*?)>/gi,'<p><img$1></p>');}}
return html;}
if(this.utils.isCurrentOrParent(['TD']))
{html=this.clean.onPasteTidy(html,'td');if(this.opts.linebreaks)html=this.clean.replaceParagraphsToBr(html);html=this.clean.replaceDivsToBr(html);return html;}
if(this.utils.isCurrentOrParent(['LI']))
{return this.clean.onPasteTidy(html,'li');}}
html=this.clean.isSingleLine(html,setMode);if(!this.clean.singleLine)
{if(this.opts.linebreaks)html=this.clean.replaceParagraphsToBr(html);if(this.opts.replaceDivs)html=this.clean.replaceDivs(html);html=this.clean.saveFormTags(html);}
html=this.clean.onPasteWord(html);html=this.clean.onPasteExtra(html);html=this.clean.onPasteTidy(html,'all');if(!this.clean.singleLine&&this.opts.paragraphize)
{html=this.paragraphize.load(html);}
html=this.clean.removeDirtyStyles(html);html=this.clean.onPasteRemoveSpans(html);html=this.clean.onPasteRemoveEmpty(html);html=this.clean.convertInline(html);return html;},onPasteWord:function(html)
{html=html.replace(/<!--[\s\S]*?-->/gi,'');html=html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi,'');html=html.replace(/<o\:p[^>]*>[\s\S]*?<\/o\:p>/gi,'');if(html.match(/class="?Mso|style="[^"]*\bmso-|style='[^'']*\bmso-|w:WordDocument/i))
{html=html.replace(/<!--[\s\S]+?-->/gi,'');html=html.replace(/<(!|script[^>]*>.*?<\/script(?=[>\s])|\/?(\?xml(:\w+)?|img|meta|link|style|\w:\w+)(?=[\s\/>]))[^>]*>/gi,'');html=html.replace(/<(\/?)s>/gi,"<$1strike>");html=html.replace(/ /gi,' ');html=html.replace(/<span\s+style\s*=\s*"\s*mso-spacerun\s*:\s*yes\s*;?\s*"\s*>([\s\u00a0]*)<\/span>/gi,function(str,spaces){return(spaces.length>0)?spaces.replace(/./," ").slice(Math.floor(spaces.length/2)).split("").join("\u00a0"):'';});html=this.clean.onPasteIeFixLinks(html);html=html.replace(/<img(.*?)v:shapes=(.*?)>/gi,'');html=html.replace(/src="file\:\/\/(.*?)"/,'src=""');var $div=$("<div/>").html(html);var lastList=false;var lastLevel=1;var listsIds=[];$div.find("p[style]").each(function()
{var matches=$(this).attr('style').match(/mso\-list\:l([0-9]+)\slevel([0-9]+)/);if(matches)
{var currentList=parseInt(matches[1]);var currentLevel=parseInt(matches[2]);var listType=$(this).html().match(/^[\w]+\./)?"ol":"ul";var $li=$("<li/>").html($(this).html());$li.html($li.html().replace(/^([\w\.]+)</,'<'));$li.find("span:first").remove();if(currentLevel==1&&$.inArray(currentList,listsIds)==-1)
{var $list=$("<"+listType+"/>").attr({"data-level":currentLevel,"data-list":currentList}).html($li);$(this).replaceWith($list);lastList=currentList;listsIds.push(currentList);}
else
{if(currentLevel>lastLevel)
{var $prevList=$div.find('[data-level="'+lastLevel+'"][data-list="'+lastList+'"]');var $lastList=$prevList;for(var i=lastLevel;i<currentLevel;i++)
{$list=$("<"+listType+"/>");$list.appendTo($lastList.find("li").last());$lastList=$list;}
$lastList.attr({"data-level":currentLevel,"data-list":currentList}).html($li);}
else
{var $prevList=$div.find('[data-level="'+currentLevel+'"][data-list="'+currentList+'"]').last();$prevList.append($li);}
lastLevel=currentLevel;lastList=currentList;$(this).remove();}}});$div.find('[data-level][data-list]').removeAttr('data-level data-list');html=$div.html();html=html.replace(/·/g,'');html=html.replace(/<p class="Mso(.*?)"/gi,'<p');html=html.replace(/ class=\"(mso[^\"]*)\"/gi,"");html=html.replace(/ class=(mso\w+)/gi,"");html=html.replace(/<o:p(.*?)>([\w\W]*?)<\/o:p>/gi,'$2');html=html.replace(/\n/g,' ');html=html.replace(/<p>\n?<li>/gi,'<li>');}
return html;},onPasteExtra:function(html)
{html=html.replace(/<b\sid="internal-source-marker(.*?)">([\w\W]*?)<\/b>/gi,"$2");html=html.replace(/<b(.*?)id="docs-internal-guid(.*?)">([\w\W]*?)<\/b>/gi,"$3");html=html.replace(/<span[^>]*(font-style: italic; font-weight: bold|font-weight: bold; font-style: italic)[^>]*>/gi,'<span style="font-weight: bold;"><span style="font-style: italic;">');html=html.replace(/<span[^>]*font-style: italic[^>]*>/gi,'<span style="font-style: italic;">');html=html.replace(/<span[^>]*font-weight: bold[^>]*>/gi,'<span style="font-weight: bold;">');html=html.replace(/<span[^>]*text-decoration: underline[^>]*>/gi,'<span style="text-decoration: underline;">');html=html.replace(/<img>/gi,'');html=html.replace(/\n{3,}/gi,'\n');html=html.replace(/<font(.*?)>([\w\W]*?)<\/font>/gi,'$2');html=html.replace(/<p><p>/gi,'<p>');html=html.replace(/<\/p><\/p>/gi,'</p>');html=html.replace(/<li>(\s*|\t*|\n*)<p>/gi,'<li>');html=html.replace(/<\/p>(\s*|\t*|\n*)<\/li>/gi,'</li>');html=html.replace(/<\/p>\s<p/gi,'<\/p><p');html=html.replace(/<img src="webkit-fake-url\:\/\/(.*?)"(.*?)>/gi,'');html=html.replace(/<p>•([\w\W]*?)<\/p>/gi,'<li>$1</li>');if(this.utils.browser('mozilla'))
{html=html.replace(/<br\s?\/?>$/gi,'');}
return html;},onPasteTidy:function(html,type)
{var tags=['span','a','pre','blockquote','small','em','strong','code','kbd','mark','address','cite','var','samp','dfn','sup','sub','b','i','u','del','ol','ul','li','dl','dt','dd','p','br','video','audio','iframe','embed','param','object','img','table','td','th','tr','tbody','tfoot','thead','h1','h2','h3','h4','h5','h6'];var tagsEmpty=false;var attrAllowed=[['a','*'],['img',['src','alt']],['span',['class','rel','data-verified']],['iframe','*'],['video','*'],['audio','*'],['embed','*'],['object','*'],['param','*'],['source','*']];if(type=='all')
{tagsEmpty=['p','span','h1','h2','h3','h4','h5','h6'];attrAllowed=[['table','class'],['td',['colspan','rowspan']],['a','*'],['img',['src','alt','data-redactor-inserted-image']],['span',['class','rel','data-verified']],['iframe','*'],['video','*'],['audio','*'],['embed','*'],['object','*'],['param','*'],['source','*']];}
else if(type=='td')
{tags=['ul','ol','li','span','a','small','em','strong','code','kbd','mark','cite','var','samp','dfn','sup','sub','b','i','u','del','ol','ul','li','dl','dt','dd','br','iframe','video','audio','embed','param','object','img','h1','h2','h3','h4','h5','h6'];}
else if(type=='li')
{tags=['ul','ol','li','span','a','small','em','strong','code','kbd','mark','cite','var','samp','dfn','sup','sub','b','i','u','del','br','iframe','video','audio','embed','param','object','img'];}
var options={deniedTags:(this.opts.deniedTags)?this.opts.deniedTags:false,allowedTags:(this.opts.allowedTags)?this.opts.allowedTags:tags,removeComments:true,removePhp:true,removeAttr:(this.opts.removeAttr)?this.opts.removeAttr:false,allowedAttr:(this.opts.allowedAttr)?this.opts.allowedAttr:attrAllowed,removeEmpty:tagsEmpty};return this.tidy.load(html,options);},onPasteRemoveEmpty:function(html)
{html=html.replace(/<(p|h[1-6])>(|\s|\n|\t|<br\s?\/?>)<\/(p|h[1-6])>/gi,'');if(!this.opts.linebreaks)html=html.replace(/<br>$/i,'');return html;},onPasteRemoveSpans:function(html)
{html=html.replace(/<span>(.*?)<\/span>/gi,'$1');html=html.replace(/<span[^>]*>\s|&nbsp;<\/span>/gi,' ');return html;},onPasteIeFixLinks:function(html)
{if(!this.utils.browser('msie'))return html;var tmp=$.trim(html);if(tmp.search(/^<a(.*?)>(.*?)<\/a>$/i)===0)
{html=html.replace(/^<a(.*?)>(.*?)<\/a>$/i,"$2");}
return html;},isSingleLine:function(html,setMode)
{this.clean.singleLine=false;if(!this.utils.isSelectAll()&&typeof setMode=='undefined')
{var blocks=this.opts.blockLevelElements.join('|').replace('P|','').replace('DIV|','');var matchBlocks=html.match(new RegExp('</('+blocks+')>','gi'));var matchContainers=html.match(/<\/(p|div)>/gi);if(!matchBlocks&&(matchContainers===null||(matchContainers&&matchContainers.length<=1)))
{var matchBR=html.match(/<br\s?\/?>/gi);if(!matchBR)
{this.clean.singleLine=true;html=html.replace(/<\/?(p|div)(.*?)>/gi,'');}}}
return html;},stripTags:function(input,allowed)
{allowed=(((allowed||'')+'').toLowerCase().match(/<[a-z][a-z0-9]*>/g)||[]).join('');var tags=/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;return input.replace(tags,function($0,$1){return allowed.indexOf('<'+$1.toLowerCase()+'>')>-1?$0:'';});},savePreCode:function(html)
{html=this.clean.savePreFormatting(html);html=this.clean.saveCodeFormatting(html);html=this.clean.restoreSelectionMarker(html);return html;},savePreFormatting:function(html)
{var pre=html.match(/<pre(.*?)>([\w\W]*?)<\/pre>/gi);if(pre!==null)
{$.each(pre,$.proxy(function(i,s)
{var arr=s.match(/<pre(.*?)>([\w\W]*?)<\/pre>/i);arr[2]=arr[2].replace(/<br\s?\/?>/g,'\n');arr[2]=arr[2].replace(/&nbsp;/g,' ');if(this.opts.preSpaces)
{arr[2]=arr[2].replace(/\t/g,Array(this.opts.preSpaces+1).join(' '));}
arr[2]=this.clean.encodeEntities(arr[2]);arr[2]=arr[2].replace(/\$/g,'&#36;');html=html.replace(s,'<pre'+arr[1]+'>'+arr[2]+'</pre>');},this));}
return html;},saveCodeFormatting:function(html)
{var code=html.match(/<code(.*?)>([\w\W]*?)<\/code>/gi);if(code!==null)
{$.each(code,$.proxy(function(i,s)
{var arr=s.match(/<code(.*?)>([\w\W]*?)<\/code>/i);arr[2]=arr[2].replace(/&nbsp;/g,' ');arr[2]=this.clean.encodeEntities(arr[2]);arr[2]=arr[2].replace(/\$/g,'&#36;');html=html.replace(s,'<code'+arr[1]+'>'+arr[2]+'</code>');},this));}
return html;},restoreSelectionMarker:function(html)
{html=html.replace(/&lt;span id=&quot;selection-marker-([0-9])&quot; class=&quot;redactor-selection-marker&quot; data-verified=&quot;redactor&quot;&gt;​&lt;\/span&gt;/g,'<span id="selection-marker-$1" class="redactor-selection-marker" data-verified="redactor">​</span>');return html;},getTextFromHtml:function(html)
{html=html.replace(/<br\s?\/?>|<\/H[1-6]>|<\/p>|<\/div>|<\/li>|<\/td>/gi,'\n');var tmp=document.createElement('div');tmp.innerHTML=html;html=tmp.textContent||tmp.innerText;return $.trim(html);},getPlainText:function(html,paragraphize)
{html=this.clean.getTextFromHtml(html);html=html.replace(/\n\s*\n/g,"\n");html=html.replace(/\n\n/g,"\n");html=html.replace(/\n/g,'<br />');if(this.opts.paragraphize&&typeof paragraphize=='undefined'&&!this.utils.browser('mozilla'))
{html=this.paragraphize.load(html);}
return html;},getPreCode:function(html)
{html=html.replace(/<img(.*?) style="(.*?)"(.*?[^>])>/gi,'<img$1$3>');html=html.replace(/<img(.*?)>/gi,'&lt;img$1&gt;');html=this.clean.getTextFromHtml(html);if(this.opts.preSpaces)
{html=html.replace(/\t/g,Array(this.opts.preSpaces+1).join(' '));}
html=this.clean.encodeEntities(html);return html;},getOnlyImages:function(html)
{html=html.replace(/<img(.*?)>/gi,'[img$1]');html=html.replace(/<([Ss]*?)>/gi,'');html=html.replace(/\[img(.*?)\]/gi,'<img$1>');return html;},getOnlyLinksAndImages:function(html)
{html=html.replace(/<a(.*?)href="(.*?)"(.*?)>([\w\W]*?)<\/a>/gi,'[a href="$2"]$4[/a]');html=html.replace(/<img(.*?)>/gi,'[img$1]');html=html.replace(/<(.*?)>/gi,'');html=html.replace(/\[a href="(.*?)"\]([\w\W]*?)\[\/a\]/gi,'<a href="$1">$2</a>');html=html.replace(/\[img(.*?)\]/gi,'<img$1>');return html;},encodeEntities:function(str)
{str=String(str).replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"');return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');},removeDirtyStyles:function(html)
{if(this.utils.browser('msie'))return html;var div=document.createElement('div');div.innerHTML=html;this.clean.clearUnverifiedRemove($(div));html=div.innerHTML;$(div).remove();return html;},clearUnverified:function()
{if(this.utils.browser('msie'))return;this.clean.clearUnverifiedRemove(this.$editor);var headers=this.$editor.find('h1, h2, h3, h4, h5, h6');headers.find('span').removeAttr('style');headers.find(this.opts.verifiedTags.join(', ')).removeAttr('style');this.code.sync();},clearUnverifiedRemove:function($editor)
{$editor.find(this.opts.verifiedTags.join(', ')).removeAttr('style');$editor.find('span').not('[data-verified="redactor"]').removeAttr('style');$editor.find('span[data-verified="redactor"], img[data-verified="redactor"]').each(function(i,s)
{var $s=$(s);$s.attr('style',$s.attr('rel'));});},cleanEmptyParagraph:function()
{},setVerified:function(html)
{if(this.utils.browser('msie'))return html;html=html.replace(new RegExp('<img(.*?[^>])>','gi'),'<img$1 data-verified="redactor">');html=html.replace(new RegExp('<span(.*?[^>])>','gi'),'<span$1 data-verified="redactor">');var matches=html.match(new RegExp('<(span|img)(.*?)style="(.*?)"(.*?[^>])>','gi'));if(matches)
{var len=matches.length;for(var i=0;i<len;i++)
{try{var newTag=matches[i].replace(/style="(.*?)"/i,'style="$1" rel="$1"');html=html.replace(matches[i],newTag);}
catch(e){}}}
return html;},convertInline:function(html)
{var $div=$('<div />').html(html);var tags=this.opts.inlineTags;tags.push('span');$div.find(tags.join(',')).each(function()
{var $el=$(this);var tag=this.tagName.toLowerCase();$el.attr('data-redactor-tag',tag);if(tag=='span')
{if($el.attr('style'))$el.attr('data-redactor-style',$el.attr('style'));else if($el.attr('class'))$el.attr('data-redactor-class',$el.attr('class'));}});html=$div.html();$div.remove();return html;},normalizeLists:function()
{this.$editor.find('li').each(function(i,s)
{var $next=$(s).next();if($next.length!==0&&($next[0].tagName=='UL'||$next[0].tagName=='OL'))
{$(s).append($next);}});},removeSpaces:function(html)
{html=html.replace(/\n/g,'');html=html.replace(/[\t]*/g,'');html=html.replace(/\n\s*\n/g,"\n");html=html.replace(/^[\s\n]*/g,' ');html=html.replace(/[\s\n]*$/g,' ');html=html.replace(/>\s{2,}</g,'> <');html=html.replace(/\n\n/g,"\n");html=html.replace(/\u200B/g,'');return html;},replaceDivs:function(html)
{if(this.opts.linebreaks)
{html=html.replace(/<div><br\s?\/?><\/div>/gi,'<br />');html=html.replace(/<div(.*?)>([\w\W]*?)<\/div>/gi,'$2<br />');}
else
{html=html.replace(/<div(.*?)>([\w\W]*?)<\/div>/gi,'<p$1>$2</p>');}
html=html.replace(/<div(.*?[^>])>/gi,'');html=html.replace(/<\/div>/gi,'');return html;},replaceDivsToBr:function(html)
{html=html.replace(/<div\s(.*?)>/gi,'<p>');html=html.replace(/<div><br\s?\/?><\/div>/gi,'<br /><br />');html=html.replace(/<div>([\w\W]*?)<\/div>/gi,'$1<br /><br />');return html;},replaceParagraphsToBr:function(html)
{html=html.replace(/<p\s(.*?)>/gi,'<p>');html=html.replace(/<p><br\s?\/?><\/p>/gi,'<br />');html=html.replace(/<p>([\w\W]*?)<\/p>/gi,'$1<br /><br />');html=html.replace(/(<br\s?\/?>){1,}\n?<\/blockquote>/gi,'</blockquote>');return html;},saveFormTags:function(html)
{return html.replace(/<form(.*?)>([\w\W]*?)<\/form>/gi,'<section$1 rel="redactor-form-tag">$2</section>');},restoreFormTags:function(html)
{return html.replace(/<section(.*?) rel="redactor-form-tag"(.*?)>([\w\W]*?)<\/section>/gi,'<form$1$2>$3</form>');}};},code:function()
{return{set:function(html)
{html=$.trim(html.toString());html=this.clean.onSet(html);if(this.utils.browser('msie'))
{html=html.replace(/<span(.*?)id="selection-marker-(1|2)"(.*?)><\/span>/gi,'');}
this.$editor.html(html);this.code.sync();if(html!=='')this.placeholder.remove();setTimeout($.proxy(this.buffer.add,this),15);if(this.start===false)this.observe.load();},get:function()
{var code=this.$textarea.val();if(this.opts.replaceDivs)code=this.clean.replaceDivs(code);if(this.opts.linebreaks)code=this.clean.replaceParagraphsToBr(code);code=this.tabifier.get(code);return code;},sync:function()
{setTimeout($.proxy(this.code.startSync,this),10);},startSync:function()
{var html=this.$editor.html();if(this.code.syncCode&&this.code.syncCode==html||(this.start&&html==''))
{return;}
this.code.syncCode=html;html=this.core.setCallback('syncBefore',html);html=this.clean.onSync(html);this.$textarea.val(html);this.core.setCallback('sync',html);if(this.start===false)
{this.core.setCallback('change',html);}
this.start=false;if(this.autosave.html==false)
{this.autosave.html=this.code.get();}
if(this.opts.codemirror)
{this.$textarea.next('.CodeMirror').each(function(i,el)
{el.CodeMirror.setValue(html);});}
this.autosave.onChange();this.autosave.enable();},toggle:function()
{if(this.opts.visual)
{this.code.showCode();}
else
{this.code.showVisual();}},showCode:function()
{this.selection.save();this.code.offset=this.caret.getOffset();var scroll=$(window).scrollTop();var width=this.$editor.innerWidth(),height=this.$editor.innerHeight();this.$editor.hide();var html=this.$textarea.val();this.modified=this.clean.removeSpaces(html);html=this.tabifier.get(html);var start=0,end=0;var $editorDiv=$("<div/>").append($.parseHTML(this.clean.onSync(this.$editor.html()),document,true));var $selectionMarkers=$editorDiv.find("span.redactor-selection-marker");if($selectionMarkers.length>0)
{var editorHtml=this.tabifier.get($editorDiv.html()).replace(/&amp;/g,'&');if($selectionMarkers.length==1)
{start=this.utils.strpos(editorHtml,$editorDiv.find("#selection-marker-1").prop("outerHTML"));end=start;}
else if($selectionMarkers.length==2)
{start=this.utils.strpos(editorHtml,$editorDiv.find("#selection-marker-1").prop("outerHTML"));end=this.utils.strpos(editorHtml,$editorDiv.find("#selection-marker-2").prop("outerHTML"))-$editorDiv.find("#selection-marker-1").prop("outerHTML").toString().length;}}
this.selection.removeMarkers();this.$textarea.val(html);if(this.opts.codemirror)
{this.$textarea.next('.CodeMirror').each(function(i,el)
{$(el).show();el.CodeMirror.setValue(html);el.CodeMirror.setSize('100%',height);el.CodeMirror.refresh();if(start==end)
{el.CodeMirror.setCursor(el.CodeMirror.posFromIndex(start).line,el.CodeMirror.posFromIndex(end).ch);}
else
{el.CodeMirror.setSelection({line:el.CodeMirror.posFromIndex(start).line,ch:el.CodeMirror.posFromIndex(start).ch},{line:el.CodeMirror.posFromIndex(end).line,ch:el.CodeMirror.posFromIndex(end).ch});}
el.CodeMirror.focus();});}
else
{this.$textarea.height(height).show().focus();this.$textarea.on('keydown.redactor-textarea-indenting',this.code.textareaIndenting);$(window).scrollTop(scroll);if(this.$textarea[0].setSelectionRange)
{this.$textarea[0].setSelectionRange(start,end);}
this.$textarea[0].scrollTop=0;}
this.opts.visual=false;this.button.setInactiveInCode();this.button.setActive('html');this.core.setCallback('source',html);},showVisual:function()
{var html;if(this.opts.visual)return;var start=0,end=0;if(this.opts.codemirror)
{var selection;this.$textarea.next('.CodeMirror').each(function(i,el)
{selection=el.CodeMirror.listSelections();start=el.CodeMirror.indexFromPos(selection[0].anchor);end=el.CodeMirror.indexFromPos(selection[0].head);html=el.CodeMirror.getValue();});}
else
{start=this.$textarea.get(0).selectionStart;end=this.$textarea.get(0).selectionEnd;html=this.$textarea.hide().val();}
if(start>end&&end>0)
{var tempStart=end;var tempEnd=start;start=tempStart;end=tempEnd;}
start=this.code.enlargeOffset(html,start);end=this.code.enlargeOffset(html,end);html=html.substr(0,start)+this.selection.getMarkerAsHtml(1)+html.substr(start);if(end>start)
{var markerLength=this.selection.getMarkerAsHtml(1).toString().length;html=html.substr(0,end+markerLength)+this.selection.getMarkerAsHtml(2)+html.substr(end+markerLength);}
if(this.modified!==this.clean.removeSpaces(html))
{this.code.set(html);}
if(this.opts.codemirror)
{this.$textarea.next('.CodeMirror').hide();}
this.$editor.show();if(!this.utils.isEmpty(html))
{this.placeholder.remove();}
this.selection.restore();this.$textarea.off('keydown.redactor-textarea-indenting');this.button.setActiveInVisual();this.button.setInactive('html');this.observe.load();this.opts.visual=true;this.core.setCallback('visual',html);},textareaIndenting:function(e)
{if(e.keyCode!==9)return true;var $el=this.$textarea;var start=$el.get(0).selectionStart;$el.val($el.val().substring(0,start)+"\t"+$el.val().substring($el.get(0).selectionEnd));$el.get(0).selectionStart=$el.get(0).selectionEnd=start+1;return false;},enlargeOffset:function(html,offset)
{var htmlLength=html.length;var c=0;if(html[offset]=='>')
{c++;}
else
{for(var i=offset;i<=htmlLength;i++)
{c++;if(html[i]=='>')
{break;}
else if(html[i]=='<'||i==htmlLength)
{c=0;break;}}}
return offset+c;}};},core:function()
{return{getObject:function()
{return $.extend({},this);},getEditor:function()
{return this.$editor;},getBox:function()
{return this.$box;},getElement:function()
{return this.$element;},getTextarea:function()
{return this.$textarea;},getToolbar:function()
{return(this.$toolbar)?this.$toolbar:false;},addEvent:function(name)
{this.core.event=name;},getEvent:function()
{return this.core.event;},setCallback:function(type,e,data)
{var eventName=type+'Callback';var eventNamespace='redactor';var callback=this.opts[eventName];if(this.$textarea)
{var returnValue=false;var events=$._data(this.$textarea[0],'events');if(typeof events!='undefined'&&typeof events[eventName]!='undefined')
{$.each(events[eventName],$.proxy(function(key,value)
{if(value['namespace']==eventNamespace)
{var data=(typeof data=='undefined')?[e]:[e,data];returnValue=(typeof data=='undefined')?value.handler.call(this,e):value.handler.call(this,e,data);}},this));}
if(returnValue)return returnValue;}
if($.isFunction(callback))
{return(typeof data=='undefined')?callback.call(this,e):callback.call(this,e,data);}
else
{return(typeof data=='undefined')?e:data;}},destroy:function()
{this.opts.destroyed=true;this.core.setCallback('destroy');this.$element.off('.redactor').removeData('redactor');this.$editor.off('.redactor');$(document).off('mousedown.redactor-blur.'+this.uuid);$(document).off('mousedown.redactor.'+this.uuid);$(document).off('click.redactor-image-delete.'+this.uuid);$(document).off('click.redactor-image-resize-hide.'+this.uuid);$(document).off('touchstart.redactor.'+this.uuid+' click.redactor.'+this.uuid);$("body").off('scroll.redactor.'+this.uuid);$(this.opts.toolbarFixedTarget).off('scroll.redactor.'+this.uuid);this.$editor.removeClass('redactor-editor redactor-linebreaks redactor-placeholder');this.$editor.removeAttr('contenteditable');var html=this.code.get();if(this.opts.toolbar)
{this.$toolbar.find('a').each(function()
{var $el=$(this);if($el.data('dropdown'))
{$el.data('dropdown').remove();$el.data('dropdown',{});}});}
if(this.build.isTextarea())
{this.$box.after(this.$element);this.$box.remove();this.$element.val(html).show();}
else
{this.$box.after(this.$editor);this.$box.remove();this.$element.html(html).show();}
if(this.$pasteBox)this.$pasteBox.remove();if(this.$modalBox)this.$modalBox.remove();if(this.$modalOverlay)this.$modalOverlay.remove();$('.redactor-toolbar-tooltip-'+this.uuid).remove();clearInterval(this.autosaveInterval);}};},dropdown:function()
{return{build:function(name,$dropdown,dropdownObject)
{if(name=='formatting'&&this.opts.formattingAdd)
{$.each(this.opts.formattingAdd,$.proxy(function(i,s)
{var name=s.tag,func;if(typeof s['class']!='undefined')
{name=name+'-'+s['class'];}
s.type=(this.utils.isBlockTag(s.tag))?'block':'inline';if(typeof s.func!=="undefined")
{func=s.func;}
else
{func=(s.type=='inline')?'inline.formatting':'block.formatting';}
if(this.opts.linebreaks&&s.type=='block'&&s.tag=='p')return;this.formatting[name]={tag:s.tag,style:s.style,'class':s['class'],attr:s.attr,data:s.data,clear:s.clear};dropdownObject[name]={func:func,title:s.title};},this));}
$.each(dropdownObject,$.proxy(function(btnName,btnObject)
{var $item=$('<a href="#" class="redactor-dropdown-'+btnName+'" role="button">'+btnObject.title+'</a>');if(name=='formatting')$item.addClass('redactor-formatting-'+btnName);$item.on('click',$.proxy(function(e)
{e.preventDefault();var type='func';var callback=btnObject.func;if(btnObject.command)
{type='command';callback=btnObject.command;}
else if(btnObject.dropdown)
{type='dropdown';callback=btnObject.dropdown;}
if($(e.target).hasClass('redactor-dropdown-link-inactive'))return;this.button.onClick(e,btnName,type,callback);this.dropdown.hideAll();},this));this.observe.addDropdown($item,btnName,btnObject);$dropdown.append($item);},this));},show:function(e,key)
{if(!this.opts.visual)
{e.preventDefault();return false;}
var $button=this.button.get(key);var $dropdown=$button.data('dropdown').appendTo(document.body);if(this.opts.highContrast)
{$dropdown.addClass("redactor-dropdown-contrast");}
if($button.hasClass('dropact'))
{this.dropdown.hideAll();}
else
{this.dropdown.hideAll();this.observe.dropdowns();this.core.setCallback('dropdownShow',{dropdown:$dropdown,key:key,button:$button});this.button.setActive(key);$button.addClass('dropact');var keyPosition=$button.offset();var dropdownWidth=$dropdown.width();if((keyPosition.left+dropdownWidth)>$(document).width())
{keyPosition.left=Math.max(0,keyPosition.left-dropdownWidth);}
var left=keyPosition.left+'px';if(this.$toolbar.hasClass('toolbar-fixed-box'))
{var top=this.$toolbar.innerHeight()+this.opts.toolbarFixedTopOffset;var position='fixed';if(this.opts.toolbarFixedTarget!==document)
{top=(this.$toolbar.innerHeight()+this.$toolbar.offset().top)+this.opts.toolbarFixedTopOffset;position='absolute';}
$dropdown.css({position:position,left:left,top:top+'px'}).show();}
else
{var top=($button.innerHeight()+keyPosition.top)+'px';$dropdown.css({position:'absolute',left:left,top:top}).show();}
this.core.setCallback('dropdownShown',{dropdown:$dropdown,key:key,button:$button});this.$dropdown=$dropdown;}
$(document).one('click.redactor-dropdown',$.proxy(this.dropdown.hide,this));this.$editor.one('click.redactor-dropdown',$.proxy(this.dropdown.hide,this));$(document).one('keyup.redactor-dropdown',$.proxy(this.dropdown.closeHandler,this));$dropdown.on('mouseover.redactor-dropdown',$.proxy(this.utils.disableBodyScroll,this)).on('mouseout.redactor-dropdown',$.proxy(this.utils.enableBodyScroll,this));e.stopPropagation();},closeHandler:function(e)
{if(e.which!=this.keyCode.ESC)return;this.dropdown.hideAll();this.$editor.focus();},hideAll:function()
{this.$toolbar.find('a.dropact').removeClass('redactor-act').removeClass('dropact');this.utils.enableBodyScroll();$('.redactor-dropdown-'+this.uuid).hide();$('.redactor-dropdown-link-selected').removeClass('redactor-dropdown-link-selected');if(this.$dropdown)
{this.$dropdown.off('.redactor-dropdown');this.core.setCallback('dropdownHide',this.$dropdown);this.$dropdown=false;}},hide:function(e)
{var $dropdown=$(e.target);if(!$dropdown.hasClass('dropact')&&!$dropdown.hasClass('redactor-dropdown-link-inactive'))
{if($dropdown.hasClass('redactor-dropdown'))
{$dropdown.removeClass('dropact');$dropdown.off('mouseover mouseout');}
this.dropdown.hideAll();}}};},file:function()
{return{show:function()
{this.modal.load('file',this.lang.get('file'),700);this.upload.init('#redactor-modal-file-upload',this.opts.fileUpload,this.file.insert);this.selection.save();this.selection.get();var text=this.sel.toString();$('#redactor-filename').val(text);this.modal.show();},insert:function(json,direct,e)
{if(typeof json.error!='undefined')
{this.modal.close();this.selection.restore();this.core.setCallback('fileUploadError',json);return;}
var link;if(typeof json=='string')
{link=json;}
else
{var text=$('#redactor-filename').val();if(typeof text=='undefined'||text==='')text=json.filename;link='<a href="'+json.filelink+'" id="filelink-marker">'+text+'</a>';}
if(direct)
{this.selection.removeMarkers();var marker=this.selection.getMarker();this.insert.nodeToCaretPositionFromPoint(e,marker);}
else
{this.modal.close();}
this.selection.restore();this.buffer.set();this.insert.htmlWithoutClean(link);if(typeof json=='string')return;var linkmarker=$(this.$editor.find('a#filelink-marker'));if(linkmarker.length!==0)
{linkmarker.removeAttr('id').removeAttr('style');}
else linkmarker=false;this.core.setCallback('fileUpload',linkmarker,json);}};},focus:function()
{return{setStart:function()
{this.$editor.focus();var first=this.$editor.children().first();if(first.length===0)return;if(first[0].length===0||first[0].tagName=='BR'||first[0].nodeType==3)
{return;}
if(first[0].tagName=='UL'||first[0].tagName=='OL')
{var child=first.find('li').first();if(!this.utils.isBlock(child)&&child.text()==='')
{this.caret.setStart(child);return;}}
if(this.opts.linebreaks&&!this.utils.isBlockTag(first[0].tagName))
{this.selection.get();this.range.setStart(this.$editor[0],0);this.range.setEnd(this.$editor[0],0);this.selection.addRange();return;}
this.caret.setStart(first);},setEnd:function()
{var last=this.$editor.children().last();this.$editor.focus();if(last.size()===0)return;if(this.utils.isEmpty(this.$editor.html()))
{this.selection.get();this.range.collapse(true);this.range.setStartAfter(last[0]);this.range.setEnd(last[0],0);this.selection.addRange();}
else
{this.selection.get();this.range.selectNodeContents(last[0]);this.range.collapse(false);this.selection.addRange();}},isFocused:function()
{return this.$editor[0]===document.activeElement;}};},image:function()
{return{show:function()
{this.modal.load('image',this.lang.get('image'),700);this.upload.init('#redactor-modal-image-droparea',this.opts.imageUpload,this.image.insert);this.selection.save();this.modal.show();},showEdit:function($image)
{var $link=$image.closest('a',this.$editor[0]);this.modal.load('imageEdit',this.lang.get('edit'),705);this.modal.createCancelButton();this.image.buttonDelete=this.modal.createDeleteButton(this.lang.get('_delete'));this.image.buttonSave=this.modal.createActionButton(this.lang.get('save'));this.image.buttonDelete.on('click',$.proxy(function()
{this.image.remove($image);},this));this.image.buttonSave.on('click',$.proxy(function()
{this.image.update($image);},this));$('.redactor-link-tooltip').remove();$('#redactor-image-title').val($image.attr('alt'));if(!this.opts.imageLink)$('.redactor-image-link-option').hide();else
{var $redactorImageLink=$('#redactor-image-link');$redactorImageLink.attr('href',$image.attr('src'));if($link.length!==0)
{$redactorImageLink.val($link.attr('href'));if($link.attr('target')=='_blank')$('#redactor-image-link-blank').prop('checked',true);}}
if(!this.opts.imagePosition)$('.redactor-image-position-option').hide();else
{var floatValue=($image.css('display')=='block'&&$image.css('float')=='none')?'center':$image.css('float');$('#redactor-image-align').val(floatValue);}
this.modal.show();$('#redactor-image-title').focus();},setFloating:function($image)
{var floating=$('#redactor-image-align').val();var imageFloat='';var imageDisplay='';var imageMargin='';switch(floating)
{case'left':imageFloat='left';imageMargin='0 '+this.opts.imageFloatMargin+' '+this.opts.imageFloatMargin+' 0';break;case'right':imageFloat='right';imageMargin='0 0 '+this.opts.imageFloatMargin+' '+this.opts.imageFloatMargin;break;case'center':imageDisplay='block';imageMargin='auto';break;}
$image.css({'float':imageFloat,display:imageDisplay,margin:imageMargin});$image.attr('rel',$image.attr('style'));},update:function($image)
{this.image.hideResize();this.buffer.set();var $link=$image.closest('a',this.$editor[0]);var title=$('#redactor-image-title').val().replace(/(<([^>]+)>)/ig,"");$image.attr('alt',title);this.image.setFloating($image);var link=$.trim($('#redactor-image-link').val());var link=link.replace(/(<([^>]+)>)/ig,"");if(link!=='')
{var pattern='((xn--)?[a-z0-9]+(-[a-z0-9]+)*\\.)+[a-z]{2,}';var re=new RegExp('^(http|ftp|https)://'+pattern,'i');var re2=new RegExp('^'+pattern,'i');if(link.search(re)==-1&&link.search(re2)===0&&this.opts.linkProtocol)
{link=this.opts.linkProtocol+'://'+link;}
var target=($('#redactor-image-link-blank').prop('checked'))?true:false;if($link.length===0)
{var a=$('<a href="'+link+'">'+this.utils.getOuterHtml($image)+'</a>');if(target)a.attr('target','_blank');$image.replaceWith(a);}
else
{$link.attr('href',link);if(target)
{$link.attr('target','_blank');}
else
{$link.removeAttr('target');}}}
else if($link.length!==0)
{$link.replaceWith(this.utils.getOuterHtml($image));}
this.modal.close();this.observe.images();this.code.sync();},setEditable:function($image)
{if(this.opts.imageEditable)
{$image.on('dragstart',$.proxy(this.image.onDrag,this));}
var handler=$.proxy(function(e)
{this.observe.image=$image;this.image.resizer=this.image.loadEditableControls($image);$(document).on('mousedown.redactor-image-resize-hide.'+this.uuid,$.proxy(this.image.hideResize,this));if(!this.opts.imageResizable)return;this.image.resizer.on('mousedown.redactor touchstart.redactor',$.proxy(function(e)
{this.image.setResizable(e,$image);},this));},this);$image.off('mousedown.redactor').on('mousedown.redactor',$.proxy(this.image.hideResize,this));$image.off('click.redactor touchstart.redactor').on('click.redactor touchstart.redactor',handler);},setResizable:function(e,$image)
{e.preventDefault();this.image.resizeHandle={x:e.pageX,y:e.pageY,el:$image,ratio:$image.width()/$image.height(),h:$image.height()};e=e.originalEvent||e;if(e.targetTouches)
{this.image.resizeHandle.x=e.targetTouches[0].pageX;this.image.resizeHandle.y=e.targetTouches[0].pageY;}
this.image.startResize();},startResize:function()
{$(document).on('mousemove.redactor-image-resize touchmove.redactor-image-resize',$.proxy(this.image.moveResize,this));$(document).on('mouseup.redactor-image-resize touchend.redactor-image-resize',$.proxy(this.image.stopResize,this));},moveResize:function(e)
{e.preventDefault();e=e.originalEvent||e;var height=this.image.resizeHandle.h;if(e.targetTouches)height+=(e.targetTouches[0].pageY-this.image.resizeHandle.y);else height+=(e.pageY-this.image.resizeHandle.y);var width=Math.round(height*this.image.resizeHandle.ratio);if(height<50||width<100)return;var height=Math.round(this.image.resizeHandle.el.width()/this.image.resizeHandle.ratio);this.image.resizeHandle.el.attr({width:width,height:height});this.image.resizeHandle.el.width(width);this.image.resizeHandle.el.height(height);this.code.sync();},stopResize:function()
{this.handle=false;$(document).off('.redactor-image-resize');this.image.hideResize();},onDrag:function(e)
{if(this.$editor.find('#redactor-image-box').length!==0)
{e.preventDefault();return false;}
this.$editor.on('drop.redactor-image-inside-drop',$.proxy(function()
{setTimeout($.proxy(this.image.onDrop,this),1);},this));},onDrop:function()
{this.image.fixImageSourceAfterDrop();this.observe.images();this.$editor.off('drop.redactor-image-inside-drop');this.clean.clearUnverified();this.code.sync();},fixImageSourceAfterDrop:function()
{this.$editor.find('img[data-save-url]').each(function()
{var $el=$(this);$el.attr('src',$el.attr('data-save-url'));$el.removeAttr('data-save-url');});},hideResize:function(e)
{if(e&&$(e.target).closest('#redactor-image-box',this.$editor[0]).length!==0)return;if(e&&e.target.tagName=='IMG')
{var $image=$(e.target);$image.attr('data-save-url',$image.attr('src'));}
var imageBox=this.$editor.find('#redactor-image-box');if(imageBox.length===0)return;$('#redactor-image-editter').remove();$('#redactor-image-resizer').remove();imageBox.find('img').css({marginTop:imageBox[0].style.marginTop,marginBottom:imageBox[0].style.marginBottom,marginLeft:imageBox[0].style.marginLeft,marginRight:imageBox[0].style.marginRight});imageBox.css('margin','');imageBox.find('img').css('opacity','');imageBox.replaceWith(function()
{return $(this).contents();});$(document).off('mousedown.redactor-image-resize-hide.'+this.uuid);if(typeof this.image.resizeHandle!=='undefined')
{this.image.resizeHandle.el.attr('rel',this.image.resizeHandle.el.attr('style'));}
this.code.sync();},loadResizableControls:function($image,imageBox)
{if(this.opts.imageResizable&&!this.utils.isMobile())
{var imageResizer=$('<span id="redactor-image-resizer" data-redactor="verified"></span>');if(!this.utils.isDesktop())
{imageResizer.css({width:'15px',height:'15px'});}
imageResizer.attr('contenteditable',false);imageBox.append(imageResizer);imageBox.append($image);return imageResizer;}
else
{imageBox.append($image);return false;}},loadEditableControls:function($image)
{var imageBox=$('<span id="redactor-image-box" data-redactor="verified">');imageBox.css('float',$image.css('float')).attr('contenteditable',false);if($image[0].style.margin!='auto')
{imageBox.css({marginTop:$image[0].style.marginTop,marginBottom:$image[0].style.marginBottom,marginLeft:$image[0].style.marginLeft,marginRight:$image[0].style.marginRight});$image.css('margin','');}
else
{imageBox.css({'display':'block','margin':'auto'});}
$image.css('opacity','.5').after(imageBox);if(this.opts.imageEditable)
{this.image.editter=$('<span id="redactor-image-editter" data-redactor="verified">'+this.lang.get('edit')+'</span>');this.image.editter.attr('contenteditable',false);this.image.editter.on('click',$.proxy(function()
{this.image.showEdit($image);},this));imageBox.append(this.image.editter);var editerWidth=this.image.editter.innerWidth();this.image.editter.css('margin-left','-'+editerWidth/2+'px');}
return this.image.loadResizableControls($image,imageBox);},remove:function(image)
{var $image=$(image);var $link=$image.closest('a',this.$editor[0]);var $figure=$image.closest('figure',this.$editor[0]);var $parent=$image.parent();if($('#redactor-image-box').length!==0)
{$parent=$('#redactor-image-box').parent();}
var $next;if($figure.length!==0)
{$next=$figure.next();$figure.remove();}
else if($link.length!==0)
{$parent=$link.parent();$link.remove();}
else
{$image.remove();}
$('#redactor-image-box').remove();if($figure.length!==0)
{this.caret.setStart($next);}
else
{this.caret.setStart($parent);}
this.core.setCallback('imageDelete',$image[0].src,$image);this.modal.close();this.code.sync();},insert:function(json,direct,e)
{if(typeof json.error!='undefined')
{this.modal.close();this.selection.restore();this.core.setCallback('imageUploadError',json);return;}
var $img;if(typeof json=='string')
{$img=$(json).attr('data-redactor-inserted-image','true');}
else
{$img=$('<img>');$img.attr('src',json.filelink).attr('data-redactor-inserted-image','true');}
var node=$img;var isP=this.utils.isCurrentOrParent('P');if(isP)
{node=$('<blockquote />').append($img);}
if(direct)
{this.selection.removeMarkers();var marker=this.selection.getMarker();this.insert.nodeToCaretPositionFromPoint(e,marker);}
else
{this.modal.close();}
this.selection.restore();this.buffer.set();this.insert.html(this.utils.getOuterHtml(node),false);var $image=this.$editor.find('img[data-redactor-inserted-image=true]').removeAttr('data-redactor-inserted-image');if(isP)
{$image.parent().contents().unwrap().wrap('<p />');}
else if(this.opts.linebreaks)
{if(!this.utils.isEmpty(this.code.get()))
{$image.before('<br>');}
$image.after('<br>');}
if(typeof json=='string')return;this.core.setCallback('imageUpload',$image,json);}};},indent:function()
{return{increase:function()
{if(!this.utils.browser('msie'))this.$editor.focus();this.buffer.set();this.selection.save();var block=this.selection.getBlock();if(block&&block.tagName=='LI')
{this.indent.increaseLists();}
else if(block===false&&this.opts.linebreaks)
{this.indent.increaseText();}
else
{this.indent.increaseBlocks();}
this.selection.restore();this.code.sync();},increaseLists:function()
{document.execCommand('indent');this.indent.fixEmptyIndent();this.clean.normalizeLists();this.clean.clearUnverified();},increaseBlocks:function()
{$.each(this.selection.getBlocks(),$.proxy(function(i,elem)
{if(elem.tagName==='TD'||elem.tagName==='TH')return;var $el=this.utils.getAlignmentElement(elem);var left=this.utils.normalize($el.css('margin-left'))+this.opts.indentValue;$el.css('margin-left',left+'px');},this));},increaseText:function()
{var wrapper=this.selection.wrap('div');$(wrapper).attr('data-tagblock','redactor');$(wrapper).css('margin-left',this.opts.indentValue+'px');},decrease:function()
{this.buffer.set();this.selection.save();var block=this.selection.getBlock();if(block&&block.tagName=='LI')
{this.indent.decreaseLists();}
else
{this.indent.decreaseBlocks();}
this.selection.restore();this.code.sync();},decreaseLists:function()
{document.execCommand('outdent');var current=this.selection.getCurrent();var $item=$(current).closest('li',this.$editor[0]);this.indent.fixEmptyIndent();if(!this.opts.linebreaks&&$item.length===0)
{document.execCommand('formatblock',false,'p');this.$editor.find('ul, ol, blockquote, p').each($.proxy(this.utils.removeEmpty,this));}
this.clean.clearUnverified();},decreaseBlocks:function()
{$.each(this.selection.getBlocks(),$.proxy(function(i,elem)
{var $el=this.utils.getAlignmentElement(elem);var left=this.utils.normalize($el.css('margin-left'))-this.opts.indentValue;if(left<=0)
{if(this.opts.linebreaks&&typeof($el.data('tagblock'))!=='undefined')
{$el.replaceWith($el.html()+'<br />');}
else
{$el.css('margin-left','');this.utils.removeEmptyAttr($el,'style');}}
else
{$el.css('margin-left',left+'px');}},this));},fixEmptyIndent:function()
{var block=this.selection.getBlock();if(this.range.collapsed&&block&&block.tagName=='LI'&&this.utils.isEmpty($(block).text()))
{var $block=$(block);$block.find('span').not('.redactor-selection-marker').contents().unwrap();$block.append('<br>');}}};},inline:function()
{return{formatting:function(name)
{var type,value;if(typeof this.formatting[name].style!='undefined')type='style';else if(typeof this.formatting[name]['class']!='undefined')type='class';if(type)value=this.formatting[name][type];this.inline.format(this.formatting[name].tag,type,value);},format:function(tag,type,value)
{var current=this.selection.getCurrent();if(current&&current.tagName==='TR')return;if(this.utils.isCurrentOrParent('PRE')||this.utils.isCurrentOrParentHeader())return;var tags=['b','bold','i','italic','underline','strikethrough','deleted','superscript','subscript'];var replaced=['strong','strong','em','em','u','del','del','sup','sub'];for(var i=0;i<tags.length;i++)
{if(tag==tags[i])tag=replaced[i];}
if(this.opts.allowedTags)
{if($.inArray(tag,this.opts.allowedTags)==-1)return;}
else
{if($.inArray(tag,this.opts.deniedTags)!==-1)return;}
this.inline.type=type||false;this.inline.value=value||false;this.buffer.set();if(!this.utils.browser('msie')&&!this.opts.linebreaks)
{this.$editor.focus();}
this.selection.get();if(this.range.collapsed)
{this.inline.formatCollapsed(tag);}
else
{this.inline.formatMultiple(tag);}},formatCollapsed:function(tag)
{var current=this.selection.getCurrent();var $parent=$(current).closest(tag+'[data-redactor-tag='+tag+']',this.$editor[0]);if($parent.length!==0&&(this.inline.type!='style'&&$parent[0].tagName!='SPAN'))
{if(this.utils.isEmpty($parent.text()))
{this.caret.setAfter($parent[0]);$parent.remove();this.code.sync();}
else if(this.utils.isEndOfElement($parent))
{this.caret.setAfter($parent[0]);}
return;}
var node=$('<'+tag+'>').attr('data-verified','redactor').attr('data-redactor-tag',tag);node.html(this.opts.invisibleSpace);node=this.inline.setFormat(node);var node=this.insert.node(node);this.caret.setEnd(node);this.code.sync();},formatMultiple:function(tag)
{this.inline.formatConvert(tag);this.selection.save();document.execCommand('strikethrough');this.$editor.find('strike').each($.proxy(function(i,s)
{var $el=$(s);this.inline.formatRemoveSameChildren($el,tag);var $span;if(this.inline.type)
{$span=$('<span>').attr('data-redactor-tag',tag).attr('data-verified','redactor');$span=this.inline.setFormat($span);}
else
{$span=$('<'+tag+'>').attr('data-redactor-tag',tag).attr('data-verified','redactor');}
$el.replaceWith($span.html($el.contents()));var $parent=$span.parent();if($span[0].tagName==='A'&&$parent&&$parent[0].tagName==='U')
{$span.parent().replaceWith($span);}
if(tag=='span')
{if($parent&&$parent[0].tagName==='SPAN'&&this.inline.type==='style')
{var arr=this.inline.value.split(';');for(var z=0;z<arr.length;z++)
{if(arr[z]==='')return;var style=arr[z].split(':');$parent.css(style[0],'');if(this.utils.removeEmptyAttr($parent,'style'))
{$parent.replaceWith($parent.contents());}}}}},this));if(tag!='span')
{this.$editor.find(this.opts.inlineTags.join(', ')).each($.proxy(function(i,s)
{var $el=$(s);if(s.tagName==='U'&&s.attributes.length===0)
{$el.replaceWith($el.contents());return;}
var property=$el.css('text-decoration');if(property==='line-through')
{$el.css('text-decoration','');this.utils.removeEmptyAttr($el,'style');}},this));}
if(tag!='del')
{var _this=this;this.$editor.find('inline').each(function(i,s)
{_this.utils.replaceToTag(s,'del');});}
if(tag!='u')
{var _this=this;this.$editor.find('unline').each(function(i,s)
{_this.utils.replaceToTag(s,'u');});}
this.selection.restore();this.code.sync();},formatRemoveSameChildren:function($el,tag)
{var self=this;$el.children(tag).each(function()
{var $child=$(this);if(!$child.hasClass('redactor-selection-marker'))
{if(self.inline.type=='style')
{var arr=self.inline.value.split(';');for(var z=0;z<arr.length;z++)
{if(arr[z]==='')return;var style=arr[z].split(':');$child.css(style[0],'');if(self.utils.removeEmptyAttr($child,'style'))
{$child.replaceWith($child.contents());}}}
else
{$child.contents().unwrap();}}});},formatConvert:function(tag)
{this.selection.save();var find='';if(this.inline.type=='class')find='[data-redactor-class='+this.inline.value+']';else if(this.inline.type=='style')
{find='[data-redactor-style="'+this.inline.value+'"]';}
var self=this;if(tag!='del')
{this.$editor.find('del').each(function(i,s)
{self.utils.replaceToTag(s,'inline');});}
if(tag!='u')
{this.$editor.find('u').each(function(i,s)
{self.utils.replaceToTag(s,'unline');});}
if(tag!='span')
{this.$editor.find(tag).each(function()
{var $el=$(this);$el.replaceWith($('<strike />').html($el.contents()));});}
this.$editor.find('[data-redactor-tag="'+tag+'"]'+find).each(function()
{if(find===''&&tag=='span'&&this.tagName.toLowerCase()==tag)return;var $el=$(this);$el.replaceWith($('<strike />').html($el.contents()));});this.selection.restore();},setFormat:function(node)
{switch(this.inline.type)
{case'class':if(node.hasClass(this.inline.value))
{node.removeClass(this.inline.value);node.removeAttr('data-redactor-class');}
else
{node.addClass(this.inline.value);node.attr('data-redactor-class',this.inline.value);}
break;case'style':node[0].style.cssText=this.inline.value;node.attr('data-redactor-style',this.inline.value);break;}
return node;},removeStyle:function()
{this.buffer.set();var current=this.selection.getCurrent();var nodes=this.selection.getInlines();this.selection.save();if(current&&current.tagName==='SPAN')
{var $s=$(current);$s.removeAttr('style');if($s[0].attributes.length===0)
{$s.replaceWith($s.contents());}}
$.each(nodes,$.proxy(function(i,s)
{var $s=$(s);if($.inArray(s.tagName.toLowerCase(),this.opts.inlineTags)!=-1&&!$s.hasClass('redactor-selection-marker'))
{$s.removeAttr('style');if($s[0].attributes.length===0)
{$s.replaceWith($s.contents());}}},this));this.selection.restore();this.code.sync();},removeStyleRule:function(name)
{this.buffer.set();var parent=this.selection.getParent();var nodes=this.selection.getInlines();this.selection.save();if(parent&&parent.tagName==='SPAN')
{var $s=$(parent);$s.css(name,'');this.utils.removeEmptyAttr($s,'style');if($s[0].attributes.length===0)
{$s.replaceWith($s.contents());}}
$.each(nodes,$.proxy(function(i,s)
{var $s=$(s);if($.inArray(s.tagName.toLowerCase(),this.opts.inlineTags)!=-1&&!$s.hasClass('redactor-selection-marker'))
{$s.css(name,'');this.utils.removeEmptyAttr($s,'style');if($s[0].attributes.length===0)
{$s.replaceWith($s.contents());}}},this));this.selection.restore();this.code.sync();},removeFormat:function()
{this.buffer.set();var current=this.selection.getCurrent();this.selection.save();document.execCommand('removeFormat');if(current&&current.tagName==='SPAN')
{$(current).replaceWith($(current).contents());}
$.each(this.selection.getNodes(),$.proxy(function(i,s)
{var $s=$(s);if($.inArray(s.tagName.toLowerCase(),this.opts.inlineTags)!=-1&&!$s.hasClass('redactor-selection-marker'))
{$s.replaceWith($s.contents());}},this));this.selection.restore();this.code.sync();},toggleClass:function(className)
{this.inline.format('span','class',className);},toggleStyle:function(value)
{this.inline.format('span','style',value);}};},insert:function()
{return{set:function(html,clean)
{this.placeholder.remove();html=this.clean.setVerified(html);if(typeof clean=='undefined')
{html=this.clean.onPaste(html,false);}
this.$editor.html(html);this.selection.remove();this.focus.setEnd();this.clean.normalizeLists();this.code.sync();this.observe.load();if(typeof clean=='undefined')
{setTimeout($.proxy(this.clean.clearUnverified,this),10);}},text:function(text)
{this.placeholder.remove();text=text.toString();text=$.trim(text);text=this.clean.getPlainText(text,false);this.$editor.focus();if(this.utils.browser('msie'))
{this.insert.htmlIe(text);}
else
{this.selection.get();this.range.deleteContents();var el=document.createElement("div");el.innerHTML=text;var frag=document.createDocumentFragment(),node,lastNode;while((node=el.firstChild))
{lastNode=frag.appendChild(node);}
this.range.insertNode(frag);if(lastNode)
{var range=this.range.cloneRange();range.setStartAfter(lastNode);range.collapse(true);this.sel.removeAllRanges();this.sel.addRange(range);}}
this.code.sync();this.clean.clearUnverified();},htmlWithoutClean:function(html)
{this.insert.html(html,false);},html:function(html,clean)
{this.placeholder.remove();if(typeof clean=='undefined')clean=true;if(!this.opts.linebreaks)
{this.$editor.focus();}
html=this.clean.setVerified(html);if(clean)
{html=this.clean.onPaste(html);}
if(this.utils.browser('msie'))
{this.insert.htmlIe(html);}
else
{if(this.clean.singleLine)this.insert.execHtml(html);else document.execCommand('insertHTML',false,html);this.insert.htmlFixMozilla();}
this.clean.normalizeLists();if(!this.opts.linebreaks)
{this.$editor.find('p').each($.proxy(this.utils.removeEmpty,this));}
this.code.sync();this.observe.load();if(clean)
{this.clean.clearUnverified();}},htmlFixMozilla:function()
{if(!this.utils.browser('mozilla'))return;var $next=$(this.selection.getBlock()).next();if($next.length>0&&$next[0].tagName=='P'&&$next.html()==='')
{$next.remove();}},htmlIe:function(html)
{if(this.utils.isIe11())
{var parent=this.utils.isCurrentOrParent('P');var $html=$('<div>').append(html);var blocksMatch=$html.contents().is('p, :header, dl, ul, ol, div, table, td, blockquote, pre, address, section, header, footer, aside, article');if(parent&&blocksMatch)this.insert.ie11FixInserting(parent,html);else this.insert.ie11PasteFrag(html);return;}
document.selection.createRange().pasteHTML(html);},execHtml:function(html)
{html=this.clean.setVerified(html);this.selection.get();this.range.deleteContents();var el=document.createElement('div');el.innerHTML=html;var frag=document.createDocumentFragment(),node,lastNode;while((node=el.firstChild))
{lastNode=frag.appendChild(node);}
this.range.insertNode(frag);this.range.collapse(true);this.caret.setAfter(lastNode);},node:function(node,deleteContents)
{node=node[0]||node;var offset=this.caret.getOffset();var html=this.utils.getOuterHtml(node);html=this.clean.setVerified(html);if(html.match(/</g)!==null)
{node=$(html)[0];}
this.selection.get();if(deleteContents!==false)
{this.range.deleteContents();}
this.range.insertNode(node);this.range.collapse(false);this.selection.addRange();this.caret.setOffset(offset);return node;},nodeToPoint:function(node,x,y)
{node=node[0]||node;this.selection.get();var range;if(document.caretPositionFromPoint)
{var pos=document.caretPositionFromPoint(x,y);this.range.setStart(pos.offsetNode,pos.offset);this.range.collapse(true);this.range.insertNode(node);}
else if(document.caretRangeFromPoint)
{range=document.caretRangeFromPoint(x,y);range.insertNode(node);}
else if(typeof document.body.createTextRange!="undefined")
{range=document.body.createTextRange();range.moveToPoint(x,y);var endRange=range.duplicate();endRange.moveToPoint(x,y);range.setEndPoint("EndToEnd",endRange);range.select();}},nodeToCaretPositionFromPoint:function(e,node)
{node=node[0]||node;var range;var x=e.clientX,y=e.clientY;if(document.caretPositionFromPoint)
{var pos=document.caretPositionFromPoint(x,y);var sel=document.getSelection();range=sel.getRangeAt(0);range.setStart(pos.offsetNode,pos.offset);range.collapse(true);range.insertNode(node);}
else if(document.caretRangeFromPoint)
{range=document.caretRangeFromPoint(x,y);range.insertNode(node);}
else if(typeof document.body.createTextRange!="undefined")
{range=document.body.createTextRange();range.moveToPoint(x,y);var endRange=range.duplicate();endRange.moveToPoint(x,y);range.setEndPoint("EndToEnd",endRange);range.select();}},ie11FixInserting:function(parent,html)
{var node=document.createElement('span');node.className='redactor-ie-paste';this.insert.node(node);var parHtml=$(parent).html();parHtml='<p>'+parHtml.replace(/<span class="redactor-ie-paste"><\/span>/gi,'</p>'+html+'<p>')+'</p>';parHtml=parHtml.replace(/<p><\/p>/gi,'');$(parent).replaceWith(parHtml);},ie11PasteFrag:function(html)
{this.selection.get();this.range.deleteContents();var el=document.createElement("div");el.innerHTML=html;var frag=document.createDocumentFragment(),node,lastNode;while((node=el.firstChild))
{lastNode=frag.appendChild(node);}
this.range.insertNode(frag);this.range.collapse(false);this.selection.addRange();}};},keydown:function()
{return{init:function(e)
{if(this.rtePaste)return;var key=e.which;var arrow=(key>=37&&key<=40);this.keydown.ctrl=e.ctrlKey||e.metaKey;this.keydown.current=this.selection.getCurrent();this.keydown.parent=this.selection.getParent();this.keydown.block=this.selection.getBlock();this.keydown.pre=this.utils.isTag(this.keydown.current,'pre');this.keydown.blockquote=this.utils.isTag(this.keydown.current,'blockquote');this.keydown.figcaption=this.utils.isTag(this.keydown.current,'figcaption');this.shortcuts.init(e,key);if(this.utils.isDesktop())
{this.keydown.checkEvents(arrow,key);this.keydown.setupBuffer(e,key);}
this.keydown.addArrowsEvent(arrow);this.keydown.setupSelectAll(e,key);var keydownStop=this.core.setCallback('keydown',e);if(keydownStop===false)
{e.preventDefault();return false;}
if(this.opts.enterKey&&(this.utils.browser('msie')||this.utils.browser('mozilla'))&&(key===this.keyCode.DOWN||key===this.keyCode.RIGHT))
{var isEndOfTable=false;var $table=false;if(this.keydown.block&&this.keydown.block.tagName==='TD')
{$table=$(this.keydown.block).closest('table',this.$editor[0]);}
if($table&&$table.find('td').last()[0]===this.keydown.block)
{isEndOfTable=true;}
if(this.utils.isEndOfElement()&&isEndOfTable)
{var node=$(this.opts.emptyHtml);$table.after(node);this.caret.setStart(node);}}
if(this.opts.enterKey&&key===this.keyCode.DOWN)
{this.keydown.onArrowDown();}
if(!this.opts.enterKey&&key===this.keyCode.ENTER)
{e.preventDefault();if(!this.range.collapsed)this.range.deleteContents();return;}
if(key==this.keyCode.ENTER&&!e.shiftKey&&!e.ctrlKey&&!e.metaKey)
{var stop=this.core.setCallback('enter',e);if(stop===false)
{e.preventDefault();return false;}
if(this.keydown.blockquote&&this.keydown.exitFromBlockquote(e)===true)
{return false;}
var current,$next;if(this.keydown.pre)
{return this.keydown.insertNewLine(e);}
else if(this.keydown.blockquote||this.keydown.figcaption)
{current=this.selection.getCurrent();$next=$(current).next();if($next.length!==0&&$next[0].tagName=='BR')
{return this.keydown.insertBreakLine(e);}
else if(this.utils.isEndOfElement()&&(current&&current!='SPAN'))
{return this.keydown.insertDblBreakLine(e);}
else
{return this.keydown.insertBreakLine(e);}}
else if(this.opts.linebreaks&&!this.keydown.block)
{current=this.selection.getCurrent();$next=$(this.keydown.current).next();if($next.length!==0&&$next[0].tagName=='BR')
{return this.keydown.insertBreakLine(e);}
else if(current!==false&&$(current).hasClass('redactor-invisible-space'))
{this.caret.setAfter(current);$(current).contents().unwrap();return this.keydown.insertDblBreakLine(e);}
else
{if(this.utils.isEndOfEditor())
{return this.keydown.insertDblBreakLine(e);}
else if($next.length===0&&current===false&&typeof $next.context!='undefined')
{return this.keydown.insertBreakLine(e);}
return this.keydown.insertBreakLine(e);}}
else if(this.opts.linebreaks&&this.keydown.block)
{setTimeout($.proxy(this.keydown.replaceDivToBreakLine,this),1);}
else if(!this.opts.linebreaks&&this.keydown.block)
{setTimeout($.proxy(this.keydown.replaceDivToParagraph,this),1);if(this.keydown.block.tagName==='LI')
{current=this.selection.getCurrent();var $parent=$(current).closest('li',this.$editor[0]);var $list=$parent.closest('ul,ol',this.$editor[0]);if($parent.length!==0&&this.utils.isEmpty($parent.html())&&$list.next().length===0&&this.utils.isEmpty($list.find("li").last().html()))
{$list.find("li").last().remove();var node=$(this.opts.emptyHtml);$list.after(node);this.caret.setStart(node);return false;}}}
else if(!this.opts.linebreaks&&!this.keydown.block)
{return this.keydown.insertParagraph(e);}}
if(key===this.keyCode.ENTER&&(e.ctrlKey||e.shiftKey))
{return this.keydown.onShiftEnter(e);}
if(key===this.keyCode.TAB||e.metaKey&&key===221||e.metaKey&&key===219)
{return this.keydown.onTab(e,key);}
if(key===this.keyCode.BACKSPACE||key===this.keyCode.DELETE)
{var nodes=this.selection.getNodes();if(nodes)
{var len=nodes.length;var last;for(var i=0;i<len;i++)
{var children=$(nodes[i]).children('img');if(children.length!==0)
{var self=this;$.each(children,function(z,s)
{var $s=$(s);if($s.css('float')!='none')return;self.core.setCallback('imageDelete',s.src,$s);last=s;});}
else if(nodes[i].tagName=='IMG')
{if(last!=nodes[i])
{this.core.setCallback('imageDelete',nodes[i].src,$(nodes[i]));last=nodes[i];}}}}}
if(key===this.keyCode.BACKSPACE)
{var block=this.selection.getBlock();var indented=($(block).css('margin-left')!=='0px');if(block&&indented&&this.range.collapsed&&this.utils.isStartOfElement())
{this.indent.decrease();e.preventDefault();return;}
if(this.utils.browser('mozilla'))
{var prev=this.selection.getPrev();var prev2=$(prev).prev()[0];if(prev&&prev.tagName==='HR')$(prev).remove();if(prev2&&prev2.tagName==='HR')$(prev2).remove();}
this.keydown.removeInvisibleSpace();this.keydown.removeEmptyListInTable(e);}
this.code.sync();},checkEvents:function(arrow,key)
{if(!arrow&&(this.core.getEvent()=='click'||this.core.getEvent()=='arrow'))
{this.core.addEvent(false);if(this.keydown.checkKeyEvents(key))
{this.buffer.set();}}},checkKeyEvents:function(key)
{var k=this.keyCode;var keys=[k.BACKSPACE,k.DELETE,k.ENTER,k.ESC,k.TAB,k.CTRL,k.META,k.ALT,k.SHIFT];return($.inArray(key,keys)==-1)?true:false;},addArrowsEvent:function(arrow)
{if(!arrow)return;if((this.core.getEvent()=='click'||this.core.getEvent()=='arrow'))
{this.core.addEvent(false);return;}
this.core.addEvent('arrow');},setupBuffer:function(e,key)
{if(this.keydown.ctrl&&key===90&&!e.shiftKey&&!e.altKey&&this.opts.buffer.length)
{e.preventDefault();this.buffer.undo();return;}
else if(this.keydown.ctrl&&key===90&&e.shiftKey&&!e.altKey&&this.opts.rebuffer.length!==0)
{e.preventDefault();this.buffer.redo();return;}
else if(!this.keydown.ctrl)
{if(key==this.keyCode.BACKSPACE||key==this.keyCode.DELETE||(key==this.keyCode.ENTER&&!e.ctrlKey&&!e.shiftKey))
{this.buffer.set();}}},setupSelectAll:function(e,key)
{if(this.keydown.ctrl&&key===65)
{this.utils.enableSelectAll();}
else if(key!=this.keyCode.LEFT_WIN&&!this.keydown.ctrl)
{this.utils.disableSelectAll();}},onArrowDown:function()
{var tags=[this.keydown.blockquote,this.keydown.pre,this.keydown.figcaption];for(var i=0;i<tags.length;i++)
{if(tags[i])
{this.keydown.insertAfterLastElement(tags[i]);return false;}}},onShiftEnter:function(e)
{this.buffer.set();if(this.utils.isEndOfElement())
{return this.keydown.insertDblBreakLine(e);}
return this.keydown.insertBreakLine(e);},onTab:function(e,key)
{if(!this.opts.tabKey)return true;if(this.utils.isEmpty(this.code.get())&&this.opts.tabAsSpaces===false)return true;e.preventDefault();var node;if(this.keydown.pre&&!e.shiftKey)
{node=(this.opts.preSpaces)?document.createTextNode(Array(this.opts.preSpaces+1).join('\u00a0')):document.createTextNode('\t');this.insert.node(node);this.code.sync();}
else if(this.opts.tabAsSpaces!==false)
{node=document.createTextNode(Array(this.opts.tabAsSpaces+1).join('\u00a0'));this.insert.node(node);this.code.sync();}
else
{if(e.metaKey&&key===219)this.indent.decrease();else if(e.metaKey&&key===221)this.indent.increase();else if(!e.shiftKey)this.indent.increase();else this.indent.decrease();}
return false;},replaceDivToBreakLine:function()
{var blockElem=this.selection.getBlock();var blockHtml=blockElem.innerHTML.replace(/<br\s?\/?>/gi,'');if((blockElem.tagName==='DIV'||blockElem.tagName==='P')&&blockHtml===''&&!$(blockElem).hasClass('redactor-editor'))
{var br=document.createElement('br');$(blockElem).replaceWith(br);this.caret.setBefore(br);this.code.sync();return false;}},replaceDivToParagraph:function()
{var blockElem=this.selection.getBlock();var blockHtml=blockElem.innerHTML.replace(/<br\s?\/?>/gi,'');if(blockElem.tagName==='DIV'&&this.utils.isEmpty(blockHtml)&&!$(blockElem).hasClass('redactor-editor'))
{var p=document.createElement('p');p.innerHTML=this.opts.invisibleSpace;$(blockElem).replaceWith(p);this.caret.setStart(p);this.code.sync();return false;}
else if(this.opts.cleanStyleOnEnter&&blockElem.tagName=='P')
{$(blockElem).removeAttr('class').removeAttr('style');}},insertParagraph:function(e)
{e.preventDefault();this.selection.get();var p=document.createElement('p');p.innerHTML=this.opts.invisibleSpace;this.range.deleteContents();this.range.insertNode(p);this.caret.setStart(p);this.code.sync();return false;},exitFromBlockquote:function(e)
{if(!this.utils.isEndOfElement())return;var tmp=$.trim($(this.keydown.block).html());if(tmp.search(/(<br\s?\/?>){2}$/i)!=-1)
{e.preventDefault();if(this.opts.linebreaks)
{var br=document.createElement('br');$(this.keydown.blockquote).after(br);this.caret.setBefore(br);$(this.keydown.block).html(tmp.replace(/<br\s?\/?>$/i,''));}
else
{var node=$(this.opts.emptyHtml);$(this.keydown.blockquote).after(node);this.caret.setStart(node);}
return true;}
return;},insertAfterLastElement:function(element)
{if(!this.utils.isEndOfElement())return;this.buffer.set();if(this.opts.linebreaks)
{var contents=$('<div>').append($.trim(this.$editor.html())).contents();var last=contents.last()[0];if(last.tagName=='SPAN'&&last.innerHTML==='')
{last=contents.prev()[0];}
if(this.utils.getOuterHtml(last)!=this.utils.getOuterHtml(element))return;var br=document.createElement('br');$(element).after(br);this.caret.setAfter(br);}
else
{if(this.$editor.contents().last()[0]!==element)return;var node=$(this.opts.emptyHtml);$(element).after(node);this.caret.setStart(node);}},insertNewLine:function(e)
{e.preventDefault();var node=document.createTextNode('\n');this.selection.get();this.range.deleteContents();this.range.insertNode(node);this.caret.setAfter(node);this.code.sync();return false;},insertBreakLine:function(e)
{return this.keydown.insertBreakLineProcessing(e);},insertDblBreakLine:function(e)
{return this.keydown.insertBreakLineProcessing(e,true);},insertBreakLineProcessing:function(e,dbl)
{e.stopPropagation();this.selection.get();var br1=document.createElement('br');if(this.utils.browser('msie'))
{this.range.collapse(false);this.range.setEnd(this.range.endContainer,this.range.endOffset);}
else
{this.range.deleteContents();}
this.range.insertNode(br1);var $parentA=$(br1).parent("a");if($parentA.length>0)
{$parentA.find(br1).remove();$parentA.after(br1);}
if(dbl===true)
{var $next=$(br1).next();if($next.length!==0&&$next[0].tagName==='BR'&&this.utils.isEndOfEditor())
{this.caret.setAfter(br1);this.code.sync();return false;}
var br2=document.createElement('br');this.range.insertNode(br2);this.caret.setAfter(br2);}
else
{if(this.utils.browser('msie'))
{var space=document.createElement('span');space.innerHTML='&#x200b;';$(br1).after(space);this.range.setStartAfter(space);this.range.setEndAfter(space);$(space).remove();}
else
{var range=document.createRange();range.setStartAfter(br1);range.collapse(true);var selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);}}
this.code.sync();return false;},removeInvisibleSpace:function()
{var $current=$(this.keydown.current);if($current.text().search(/^\u200B$/g)===0)
{$current.remove();}},removeEmptyListInTable:function(e)
{var $current=$(this.keydown.current);var $parent=$(this.keydown.parent);var td=$current.closest('td',this.$editor[0]);if(td.length!==0&&$current.closest('li',this.$editor[0])&&$parent.children('li').length===1)
{if(!this.utils.isEmpty($current.text()))return;e.preventDefault();$current.remove();$parent.remove();this.caret.setStart(td);}}};},keyup:function()
{return{init:function(e)
{if(this.rtePaste)return;var key=e.which;this.keyup.current=this.selection.getCurrent();this.keyup.parent=this.selection.getParent();var $parent=this.utils.isRedactorParent($(this.keyup.parent).parent());var keyupStop=this.core.setCallback('keyup',e);if(keyupStop===false)
{e.preventDefault();return false;}
if(!this.opts.linebreaks&&this.keyup.current.nodeType===3&&this.keyup.current.length<=1&&(this.keyup.parent===false||this.keyup.parent.tagName=='BODY'))
{this.keyup.replaceToParagraph();}
if(!this.opts.linebreaks&&this.utils.isRedactorParent(this.keyup.current)&&this.keyup.current.tagName==='DIV')
{this.keyup.replaceToParagraph(false);}
if(!this.opts.linebreaks&&$(this.keyup.parent).hasClass('redactor-invisible-space')&&($parent===false||$parent[0].tagName=='BODY'))
{$(this.keyup.parent).contents().unwrap();this.keyup.replaceToParagraph();}
if(this.linkify.isEnabled()&&this.linkify.isKey(key))this.linkify.format();if(key===this.keyCode.DELETE||key===this.keyCode.BACKSPACE)
{if(this.utils.browser('mozilla'))
{var td=$(this.keydown.current).closest('td',this.$editor[0]);if(td.size()!==0&&td.text()!=='')
{e.preventDefault();return false;}}
this.clean.clearUnverified();if(this.observe.image)
{e.preventDefault();this.image.hideResize();this.buffer.set();this.image.remove(this.observe.image);this.observe.image=false;return false;}
this.$editor.find('p').each($.proxy(function(i,s)
{this.utils.removeEmpty(i,$(s).html());},this));if(this.opts.linebreaks&&this.keyup.current&&this.keyup.current.tagName=='DIV'&&this.utils.isEmpty(this.keyup.current.innerHTML))
{$(this.keyup.current).after(this.selection.getMarkerAsHtml());this.selection.restore();$(this.keyup.current).remove();}
this.keyup.removeEmptyLists();return this.keyup.formatEmpty(e);}},replaceToParagraph:function(clone)
{var $current=$(this.keyup.current);var node;if(clone===false)
{node=$('<p>').append($current.html());}
else
{node=$('<p>').append($current.clone());}
$current.replaceWith(node);var next=$(node).next();if(typeof(next[0])!=='undefined'&&next[0].tagName=='BR')
{next.remove();}
this.caret.setEnd(node);},removeEmptyLists:function()
{var removeIt=function()
{var html=$.trim(this.innerHTML).replace(/\/t\/n/g,'');if(html==='')
{$(this).remove();}};this.$editor.find('li').each(removeIt);this.$editor.find('ul, ol').each(removeIt);},formatEmpty:function(e)
{var html=$.trim(this.$editor.html());if(!this.utils.isEmpty(html))return;e.preventDefault();if(this.opts.linebreaks)
{this.$editor.html(this.selection.getMarkerAsHtml());this.selection.restore();}
else
{this.$editor.html(this.opts.emptyHtml);this.focus.setStart();}
this.code.sync();return false;}};},lang:function()
{return{load:function()
{this.opts.curLang=this.opts.langs[this.opts.lang];},get:function(name)
{return(typeof this.opts.curLang[name]!='undefined')?this.opts.curLang[name]:'';}};},line:function()
{return{insert:function()
{this.buffer.set();var blocks=this.selection.getBlocks();if(blocks[0]!==false&&this.line.isExceptLastOrFirst(blocks))
{if(!this.utils.browser('msie'))this.$editor.focus();return;}
if(this.utils.browser('msie'))
{this.line.insertInIe();}
else
{this.line.insertInOthersBrowsers();}},isExceptLastOrFirst:function(blocks)
{var exceptTags=['li','td','th','blockquote','figcaption','pre','dl','dt','dd'];var first=blocks[0].tagName.toLowerCase();var last=this.selection.getLastBlock();last=(typeof last=='undefined')?first:last.tagName.toLowerCase();var firstFound=$.inArray(first,exceptTags)!=-1;var lastFound=$.inArray(last,exceptTags)!=-1;if((firstFound&&lastFound)||firstFound)
{return true;}},insertInIe:function()
{this.utils.saveScroll();this.buffer.set();this.insert.node(document.createElement('hr'));this.utils.restoreScroll();this.code.sync();},insertInOthersBrowsers:function()
{this.buffer.set();var extra='<p id="redactor-insert-line"><br /></p>';if(this.opts.linebreaks)extra='<br id="redactor-insert-line">';document.execCommand('insertHtml',false,'<hr>'+extra);this.line.setFocus();this.code.sync();},setFocus:function()
{var node=this.$editor.find('#redactor-insert-line');var next=$(node).next()[0];var target=next;if(this.utils.browser('mozilla')&&next&&next.innerHTML==='')
{target=$(next).next()[0];$(next).remove();}
if(target)
{node.remove();if(!this.opts.linebreaks)
{this.$editor.focus();this.line.setStart(target);}}
else
{node.removeAttr('id');this.line.setStart(node[0]);}},setStart:function(node)
{if(typeof node==='undefined')return;var textNode=document.createTextNode('\u200B');this.selection.get();this.range.setStart(node,0);this.range.insertNode(textNode);this.range.collapse(true);this.selection.addRange();}};},link:function()
{return{show:function(e)
{if(typeof e!='undefined'&&e.preventDefault)e.preventDefault();if(!this.observe.isCurrent('a'))
{this.modal.load('link',this.lang.get('link_insert'),600);}
else
{this.modal.load('link',this.lang.get('link_edit'),600);}
this.modal.createCancelButton();var buttonText=!this.observe.isCurrent('a')?this.lang.get('insert'):this.lang.get('edit');this.link.buttonInsert=this.modal.createActionButton(buttonText);this.selection.get();this.link.getData();this.link.cleanUrl();if(this.link.target=='_blank')$('#redactor-link-blank').prop('checked',true);this.link.$inputUrl=$('#redactor-link-url');this.link.$inputText=$('#redactor-link-url-text');this.link.$inputText.val(this.link.text);this.link.$inputUrl.val(this.link.url);this.link.buttonInsert.on('click',$.proxy(this.link.insert,this));$('.redactor-link-tooltip').remove();this.selection.save();this.modal.show();this.link.$inputUrl.focus();},cleanUrl:function()
{var thref=self.location.href.replace(/\/$/i,'');if(typeof this.link.url!=="undefined")
{this.link.url=this.link.url.replace(thref,'');this.link.url=this.link.url.replace(/^\/#/,'#');this.link.url=this.link.url.replace('mailto:','');if(!this.opts.linkProtocol)
{var re=new RegExp('^(http|ftp|https)://'+self.location.host,'i');this.link.url=this.link.url.replace(re,'');}}},getData:function()
{this.link.$node=false;var $el=$(this.selection.getCurrent()).closest('a',this.$editor[0]);if($el.length!==0&&$el[0].tagName==='A')
{this.link.$node=$el;this.link.url=$el.attr('href');this.link.text=$el.text();this.link.target=$el.attr('target');}
else
{this.link.text=this.sel.toString();this.link.url='';this.link.target='';}},insert:function()
{this.placeholder.remove();var target='';var link=this.link.$inputUrl.val();var text=this.link.$inputText.val().replace(/(<([^>]+)>)/ig,"");if($.trim(link)==='')
{this.link.$inputUrl.addClass('redactor-input-error').on('keyup',function()
{$(this).removeClass('redactor-input-error');$(this).off('keyup');});return;}
if(link.search('@')!=-1&&/(http|ftp|https):\/\//i.test(link)===false)
{link=link.replace('mailto:','');link='mailto:'+link;}
else if(link.search('#')!==0)
{if($('#redactor-link-blank').prop('checked'))
{target='_blank';}
var pattern='((xn--)?[a-z0-9]+(-[a-z0-9]+)*\\.)+[a-z]{2,}';var re=new RegExp('^(http|ftp|https)://'+pattern,'i');var re2=new RegExp('^'+pattern,'i');var re3=new RegExp('\.(html|php)$','i');if(link.search(re)==-1&&link.search(re3)==-1&&link.search(re2)===0&&this.opts.linkProtocol)
{link=this.opts.linkProtocol+'://'+link;}}
this.link.set(text,link,target);this.modal.close();},set:function(text,link,target)
{text=$.trim(text.replace(/<|>/g,''));this.selection.restore();var blocks=this.selection.getBlocks();if(text===''&&link==='')return;if(text===''&&link!=='')text=link;if(this.link.$node)
{this.buffer.set();var $link=this.link.$node,$el=$link.children();if($el.length>0)
{while($el.length)
{$el=$el.children();}
$el=$el.end();}
else
{$el=$link;}
$link.attr('href',link);$el.text(text);if(target!=='')
{$link.attr('target',target);}
else
{$link.removeAttr('target');}
this.selection.selectElement($link);this.code.sync();}
else
{if(this.utils.browser('mozilla')&&this.link.text==='')
{var $a=$('<a />').attr('href',link).text(text);if(target!=='')$a.attr('target',target);$a=$(this.insert.node($a));if(this.opts.linebreaks)
{$a.after('&nbsp;');}
this.selection.selectElement($a);}
else
{var $a;if(this.utils.browser('msie'))
{$a=$('<a href="'+link+'">').text(text);if(target!=='')$a.attr('target',target);$a=$(this.insert.node($a));if(this.selection.getText().match(/\s$/))
{$a.after(" ");}
this.selection.selectElement($a);}
else
{document.execCommand('createLink',false,link);$a=$(this.selection.getCurrent()).closest('a',this.$editor[0]);if(this.utils.browser('mozilla'))
{$a=$('a[_moz_dirty=""]');}
if(target!=='')$a.attr('target',target);$a.removeAttr('style').removeAttr('_moz_dirty');if(this.selection.getText().match(/\s$/))
{$a.after(" ");}
if(this.link.text!==''||this.link.text!=text)
{if(!this.opts.linebreaks&&blocks&&blocks.length<=1)
{$a.text(text);}
else if(this.opts.linebreaks)
{$a.text(text);}
this.selection.selectElement($a);}}}
this.code.sync();this.core.setCallback('insertedLink',$a);}
setTimeout($.proxy(function()
{this.observe.links();},this),5);},unlink:function(e)
{if(typeof e!='undefined'&&e.preventDefault)
{e.preventDefault();}
var nodes=this.selection.getNodes();if(!nodes)return;this.buffer.set();var len=nodes.length;var links=[];for(var i=0;i<len;i++)
{if(nodes[i].tagName==='A')
{links.push(nodes[i]);}
var $node=$(nodes[i]).closest('a',this.$editor[0]);$node.replaceWith($node.contents());}
this.core.setCallback('deletedLink',links);$('.redactor-link-tooltip').remove();this.code.sync();},toggleClass:function(className)
{this.link.setClass(className,'toggleClass');},addClass:function(className)
{this.link.setClass(className,'addClass');},removeClass:function(className)
{this.link.setClass(className,'removeClass');},setClass:function(className,func)
{var links=this.selection.getInlinesTags(['a']);if(links===false)return;$.each(links,function()
{$(this)[func](className);});}};},linkify:function()
{return{isKey:function(key)
{return key==this.keyCode.ENTER||key==this.keyCode.SPACE;},isEnabled:function()
{return this.opts.convertLinks&&(this.opts.convertUrlLinks||this.opts.convertImageLinks||this.opts.convertVideoLinks)&&!this.utils.isCurrentOrParent('PRE');},format:function()
{var linkify=this.linkify,opts=this.opts;this.$editor.find(":not(iframe,img,a,pre)").addBack().contents().filter(function()
{return this.nodeType===3&&$.trim(this.nodeValue)!=""&&!$(this).parent().is("pre")&&(this.nodeValue.match(opts.linkify.regexps.youtube)||this.nodeValue.match(opts.linkify.regexps.vimeo)||this.nodeValue.match(opts.linkify.regexps.image)||this.nodeValue.match(opts.linkify.regexps.url));}).each(function()
{var text=$(this).text(),html=text;if(opts.convertVideoLinks&&(html.match(opts.linkify.regexps.youtube)||html.match(opts.linkify.regexps.vimeo)))
{html=linkify.convertVideoLinks(html);}
else if(opts.convertImageLinks&&html.match(opts.linkify.regexps.image))
{html=linkify.convertImages(html);}
else if(opts.convertUrlLinks)
{html=linkify.convertLinks(html);}
$(this).before(text.replace(text,html)).remove();});var objects=this.$editor.find('.redactor-linkify-object').each(function()
{var $el=$(this);$el.removeClass('redactor-linkify-object');if($el.attr('class')==='')$el.removeAttr('class');return $el[0];});setTimeout($.proxy(function()
{this.observe.load();this.core.setCallback('linkify',objects);},this),100);this.code.sync();},convertVideoLinks:function(html)
{var iframeStart='<iframe class="redactor-linkify-object" width="500" height="281" src="',iframeEnd='" frameborder="0" allowfullscreen></iframe>';if(html.match(this.opts.linkify.regexps.youtube))
{html=html.replace(this.opts.linkify.regexps.youtube,iframeStart+'//www.youtube.com/embed/$1'+iframeEnd);}
if(html.match(this.opts.linkify.regexps.vimeo))
{html=html.replace(this.opts.linkify.regexps.vimeo,iframeStart+'//player.vimeo.com/video/$2'+iframeEnd);}
return html;},convertImages:function(html)
{var matches=html.match(this.opts.linkify.regexps.image);if(matches)
{html=html.replace(html,'<img src="'+matches+'" class="redactor-linkify-object" />');if(this.opts.linebreaks)
{if(!this.utils.isEmpty(this.code.get()))
{html='<br>'+html;}}
html+='<br>';}
return html;},convertLinks:function(html)
{var matches=html.match(this.opts.linkify.regexps.url);if(matches)
{matches=$.grep(matches,function(v,k){return $.inArray(v,matches)===k;});var length=matches.length;for(var i=0;i<length;i++)
{var href=matches[i],text=href,linkProtocol=this.opts.linkProtocol+'://';if(href.match(/(https?|ftp):\/\//i)!==null)
{linkProtocol="";}
if(text.length>this.opts.linkSize)
{text=text.substring(0,this.opts.linkSize)+'...';}
if(text.search('%')===-1)
{text=decodeURIComponent(text);}
var regexB="\\b";if($.inArray(href.slice(-1),["/","&","="])!=-1)
{regexB="";}
var regexp=new RegExp('('+href.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")+regexB+')','g');html=html.replace(regexp,'<a href="'+linkProtocol+$.trim(href)+'" class="redactor-linkify-object">'+$.trim(text)+'</a>');}}
return html;}};},list:function()
{return{toggle:function(cmd)
{this.placeholder.remove();if(!this.utils.browser('msie')&&!this.opts.linebreaks)
{this.$editor.focus();}
this.buffer.set();this.selection.save();var parent=this.selection.getParent();var $list=$(parent).closest('ol, ul',this.$editor[0]);if(!this.utils.isRedactorParent($list)&&$list.length!==0)
{$list=false;}
var isUnorderedCmdOrdered,isOrderedCmdUnordered;var remove=false;if($list&&$list.length)
{remove=true;var listTag=$list[0].tagName;isUnorderedCmdOrdered=(cmd==='orderedlist'&&listTag==='UL');isOrderedCmdUnordered=(cmd==='unorderedlist'&&listTag==='OL');}
if(isUnorderedCmdOrdered)
{this.utils.replaceToTag($list,'ol');}
else if(isOrderedCmdUnordered)
{this.utils.replaceToTag($list,'ul');}
else
{if(remove)
{this.list.remove(cmd,$list);}
else
{this.list.insert(cmd);}}
this.selection.restore();this.code.sync();},insert:function(cmd)
{var current=this.selection.getCurrent();var $td=$(current).closest('td, th',this.$editor[0]);if(this.utils.browser('msie')&&this.opts.linebreaks)
{this.list.insertInIe(cmd);}
else
{document.execCommand('insert'+cmd);}
var parent=this.selection.getParent();var $list=$(parent).closest('ol, ul',this.$editor[0]);if($td.length!==0)
{var newTd=$td.clone();$td.after(newTd).remove('');}
if(this.utils.isEmpty($list.find('li').text()))
{var $children=$list.children('li');$children.find('br').remove();$children.append(this.selection.getMarkerAsHtml());if(this.opts.linebreaks&&this.utils.browser('mozilla')&&$children.size()==2&&this.utils.isEmpty($children.eq(1).text()))
{$children.eq(1).remove();}}
if($list.length)
{var $listParent=$list.parent();if(this.utils.isRedactorParent($listParent)&&$listParent[0].tagName!='LI'&&this.utils.isBlock($listParent[0]))
{$listParent.replaceWith($listParent.contents());}}
if(!this.utils.browser('msie'))
{this.$editor.focus();}
this.clean.clearUnverified();},insertInIe:function(cmd)
{var wrapper=this.selection.wrap('div');var wrapperHtml=$(wrapper).html();var tmpList=(cmd=='orderedlist')?$('<ol>'):$('<ul>');var tmpLi=$('<li>');if($.trim(wrapperHtml)==='')
{tmpLi.append(this.selection.getMarkerAsHtml());tmpList.append(tmpLi);this.$editor.find('#selection-marker-1').replaceWith(tmpList);}
else
{var items=wrapperHtml.split(/<br\s?\/?>/gi);if(items)
{for(var i=0;i<items.length;i++)
{if($.trim(items[i])!=='')
{tmpList.append($('<li>').html(items[i]));}}}
else
{tmpLi.append(wrapperHtml);tmpList.append(tmpLi);}
$(wrapper).replaceWith(tmpList);}},remove:function(cmd,$list)
{if($.inArray('ul',this.selection.getBlocks()))cmd='unorderedlist';document.execCommand('insert'+cmd);var $current=$(this.selection.getCurrent());this.indent.fixEmptyIndent();if(!this.opts.linebreaks&&$current.closest('li, th, td',this.$editor[0]).length===0)
{document.execCommand('formatblock',false,'p');this.$editor.find('ul, ol, blockquote').each($.proxy(this.utils.removeEmpty,this));}
var $table=$(this.selection.getCurrent()).closest('table',this.$editor[0]);var $prev=$table.prev();if(!this.opts.linebreaks&&$table.length!==0&&$prev.length!==0&&$prev[0].tagName=='BR')
{$prev.remove();}
this.clean.clearUnverified();}};},modal:function()
{return{callbacks:{},loadTemplates:function()
{this.opts.modal={imageEdit:String()
+'<section id="redactor-modal-image-edit">'
+'<label>'+this.lang.get('title')+'</label>'
+'<input type="text" id="redactor-image-title" />'
+'<label class="redactor-image-link-option">'+this.lang.get('link')+'</label>'
+'<input type="text" id="redactor-image-link" class="redactor-image-link-option" aria-label="'+this.lang.get('link')+'" />'
+'<label class="redactor-image-link-option"><input type="checkbox" id="redactor-image-link-blank" aria-label="'+this.lang.get('link_new_tab')+'"> '+this.lang.get('link_new_tab')+'</label>'
+'<label class="redactor-image-position-option">'+this.lang.get('image_position')+'</label>'
+'<select class="redactor-image-position-option" id="redactor-image-align" aria-label="'+this.lang.get('image_position')+'">'
+'<option value="none">'+this.lang.get('none')+'</option>'
+'<option value="left">'+this.lang.get('left')+'</option>'
+'<option value="center">'+this.lang.get('center')+'</option>'
+'<option value="right">'+this.lang.get('right')+'</option>'
+'</select>'
+'</section>',image:String()
+'<section id="redactor-modal-image-insert">'
+'<div id="redactor-modal-image-droparea"></div>'
+'</section>',file:String()
+'<section id="redactor-modal-file-insert">'
+'<div id="redactor-modal-file-upload-box">'
+'<label>'+this.lang.get('filename')+'</label>'
+'<input type="text" id="redactor-filename" aria-label="'+this.lang.get('filename')+'" /><br><br>'
+'<div id="redactor-modal-file-upload"></div>'
+'</div>'
+'</section>',link:String()
+'<section id="redactor-modal-link-insert">'
+'<label>URL</label>'
+'<input type="url" id="redactor-link-url" aria-label="URL" />'
+'<label>'+this.lang.get('text')+'</label>'
+'<input type="text" id="redactor-link-url-text" aria-label="'+this.lang.get('text')+'" />'
+'<label><input type="checkbox" id="redactor-link-blank"> '+this.lang.get('link_new_tab')+'</label>'
+'</section>'};$.extend(this.opts,this.opts.modal);},addCallback:function(name,callback)
{this.modal.callbacks[name]=callback;},createTabber:function($modal)
{this.modal.$tabber=$('<div>').attr('id','redactor-modal-tabber');$modal.prepend(this.modal.$tabber);},addTab:function(id,name,active)
{var $tab=$('<a href="#" rel="tab'+id+'">').text(name);if(active)
{$tab.addClass('active');}
var self=this;$tab.on('click',function(e)
{e.preventDefault();$('.redactor-tab').hide();$('.redactor-'+$(this).attr('rel')).show();self.modal.$tabber.find('a').removeClass('active');$(this).addClass('active');});this.modal.$tabber.append($tab);},addTemplate:function(name,template)
{this.opts.modal[name]=template;},getTemplate:function(name)
{return this.opts.modal[name];},getModal:function()
{return this.$modalBody.find('section');},load:function(templateName,title,width)
{this.modal.templateName=templateName;this.modal.width=width;this.modal.build();this.modal.enableEvents();this.modal.setTitle(title);this.modal.setDraggable();this.modal.setContent();if(typeof this.modal.callbacks[templateName]!='undefined')
{this.modal.callbacks[templateName].call(this);}},show:function()
{this.utils.disableBodyScroll();if(this.utils.isMobile())
{this.modal.showOnMobile();}
else
{this.modal.showOnDesktop();}
if(this.opts.highContrast)
{this.$modalBox.addClass("redactor-modal-contrast");}
this.$modalOverlay.show();this.$modalBox.show();this.$modal.attr('tabindex','-1');this.$modal.focus();this.modal.setButtonsWidth();this.utils.saveScroll();if(!this.utils.isMobile())
{setTimeout($.proxy(this.modal.showOnDesktop,this),0);$(window).on('resize.redactor-modal',$.proxy(this.modal.resize,this));}
this.core.setCallback('modalOpened',this.modal.templateName,this.$modal);$(document).off('focusin.modal');this.$modal.find('input[type=text],input[type=url],input[type=email]').on('keydown.redactor-modal',$.proxy(this.modal.setEnter,this));},showOnDesktop:function()
{var height=this.$modal.outerHeight();var windowHeight=$(window).height();var windowWidth=$(window).width();if(this.modal.width>windowWidth)
{this.$modal.css({width:'96%',marginTop:(windowHeight/2-height/2)+'px'});return;}
if(height>windowHeight)
{this.$modal.css({width:this.modal.width+'px',marginTop:'20px'});}
else
{this.$modal.css({width:this.modal.width+'px',marginTop:(windowHeight/2-height/2)+'px'});}},showOnMobile:function()
{this.$modal.css({width:'96%',marginTop:'2%'});},resize:function()
{if(this.utils.isMobile())
{this.modal.showOnMobile();}
else
{this.modal.showOnDesktop();}},setTitle:function(title)
{this.$modalHeader.html(title);},setContent:function()
{this.$modalBody.html(this.modal.getTemplate(this.modal.templateName));},setDraggable:function()
{if(typeof $.fn.draggable==='undefined')return;this.$modal.draggable({handle:this.$modalHeader});this.$modalHeader.css('cursor','move');},setEnter:function(e)
{if(e.which!=13)return;e.preventDefault();this.$modal.find('button.redactor-modal-action-btn').click();},createCancelButton:function()
{var button=$('<button>').addClass('redactor-modal-btn redactor-modal-close-btn').html(this.lang.get('cancel'));button.on('click',$.proxy(this.modal.close,this));this.$modalFooter.append(button);},createDeleteButton:function(label)
{return this.modal.createButton(label,'delete');},createActionButton:function(label)
{return this.modal.createButton(label,'action');},createButton:function(label,className)
{var button=$('<button>').addClass('redactor-modal-btn').addClass('redactor-modal-'+className+'-btn').html(label);this.$modalFooter.append(button);return button;},setButtonsWidth:function()
{var buttons=this.$modalFooter.find('button');var buttonsSize=buttons.length;if(buttonsSize===0)return;buttons.css('width',(100/buttonsSize)+'%');},build:function()
{this.modal.buildOverlay();this.$modalBox=$('<div id="redactor-modal-box"/>').hide();this.$modal=$('<div id="redactor-modal" role="dialog" aria-labelledby="redactor-modal-header" />');this.$modalHeader=$('<header id="redactor-modal-header"/>');this.$modalClose=$('<button type="button" id="redactor-modal-close" tabindex="1" aria-label="Close" />').html('&times;');this.$modalBody=$('<div id="redactor-modal-body" />');this.$modalFooter=$('<footer />');this.$modal.append(this.$modalHeader);this.$modal.append(this.$modalClose);this.$modal.append(this.$modalBody);this.$modal.append(this.$modalFooter);this.$modalBox.append(this.$modal);this.$modalBox.appendTo(document.body);},buildOverlay:function()
{this.$modalOverlay=$('<div id="redactor-modal-overlay">').hide();$('body').prepend(this.$modalOverlay);},enableEvents:function()
{this.$modalClose.on('click.redactor-modal',$.proxy(this.modal.close,this));$(document).on('keyup.redactor-modal',$.proxy(this.modal.closeHandler,this));this.$editor.on('keyup.redactor-modal',$.proxy(this.modal.closeHandler,this));this.$modalBox.on('click.redactor-modal',$.proxy(this.modal.close,this));},disableEvents:function()
{this.$modalClose.off('click.redactor-modal');$(document).off('keyup.redactor-modal');this.$editor.off('keyup.redactor-modal');this.$modalBox.off('click.redactor-modal');$(window).off('resize.redactor-modal');},closeHandler:function(e)
{if(e.which!=this.keyCode.ESC)return;this.modal.close(false);},close:function(e)
{if(e)
{if(!$(e.target).hasClass('redactor-modal-close-btn')&&e.target!=this.$modalClose[0]&&e.target!=this.$modalBox[0])
{return;}
e.preventDefault();}
if(!this.$modalBox)return;this.modal.disableEvents();this.utils.enableBodyScroll();this.$modalOverlay.remove();this.$modalBox.fadeOut('fast',$.proxy(function()
{this.$modalBox.remove();setTimeout($.proxy(this.utils.restoreScroll,this),0);if(e!==undefined)this.selection.restore();$(document.body).css('overflow',this.modal.bodyOveflow);this.core.setCallback('modalClosed',this.modal.templateName);},this));}};},observe:function()
{return{load:function()
{if(typeof this.opts.destroyed!="undefined")return;if(this.utils.browser('msie'))
{var self=this;this.$editor.find('pre, code').on('mouseover',function()
{self.$editor.attr('contenteditable',false);$(this).attr('contenteditable',true);}).on('mouseout',function()
{self.$editor.attr('contenteditable',true);$(this).removeAttr('contenteditable');});}
this.observe.images();this.observe.links();},toolbar:function(e,btnName)
{this.observe.buttons(e,btnName);this.observe.dropdowns();},isCurrent:function($el,$current)
{if(typeof $current=='undefined')
{var $current=$(this.selection.getCurrent());}
return $current.is($el)||$current.parents($el).length>0;},dropdowns:function()
{var $current=$(this.selection.getCurrent());$.each(this.opts.observe.dropdowns,$.proxy(function(key,value)
{var observe=value.observe,element=observe.element,$item=value.item,inValues=typeof observe['in']!='undefined'?observe['in']:false,outValues=typeof observe['out']!='undefined'?observe['out']:false;if($current.closest(element).size()>0)
{this.observe.setDropdownProperties($item,inValues,outValues);}
else
{this.observe.setDropdownProperties($item,outValues,inValues);}},this));},setDropdownProperties:function($item,addProperties,deleteProperties)
{if(deleteProperties&&typeof deleteProperties['attr']!='undefined')
{this.observe.setDropdownAttr($item,deleteProperties.attr,true);}
if(typeof addProperties['attr']!='undefined')
{this.observe.setDropdownAttr($item,addProperties.attr);}
if(typeof addProperties['title']!='undefined')
{$item.text(addProperties['title']);}},setDropdownAttr:function($item,properties,isDelete)
{$.each(properties,function(key,value)
{if(key=='class')
{if(!isDelete)
{$item.addClass(value);}
else
{$item.removeClass(value);}}
else
{if(!isDelete)
{$item.attr(key,value);}
else
{$item.removeAttr(key);}}});},addDropdown:function($item,btnName,btnObject)
{if(typeof btnObject.observe=="undefined")return;btnObject.item=$item;this.opts.observe.dropdowns.push(btnObject);},buttons:function(e,btnName)
{var current=this.selection.getCurrent();var parent=this.selection.getParent();if(e!==false)
{this.button.setInactiveAll();}
else
{this.button.setInactiveAll(btnName);}
if(e===false&&btnName!=='html')
{if($.inArray(btnName,this.opts.activeButtons)!=-1)this.button.toggleActive(btnName);return;}
$.each(this.opts.activeButtonsStates,$.proxy(function(key,value)
{var parentEl=$(parent).closest(key,this.$editor[0]);var currentEl=$(current).closest(key,this.$editor[0]);if(parentEl.length!==0&&!this.utils.isRedactorParent(parentEl))return;if(!this.utils.isRedactorParent(currentEl))return;if(parentEl.length!==0||currentEl.closest(key,this.$editor[0]).length!==0)
{this.button.setActive(value);}},this));var $parent=$(parent).closest(this.opts.alignmentTags.toString().toLowerCase(),this.$editor[0]);if(this.utils.isRedactorParent(parent)&&$parent.length)
{var align=($parent.css('text-align')==='')?'left':$parent.css('text-align');this.button.setActive('align'+align);}},addButton:function(tag,btnName)
{this.opts.activeButtons.push(btnName);this.opts.activeButtonsStates[tag]=btnName;},images:function()
{this.$editor.find('img').each($.proxy(function(i,img)
{var $img=$(img);$img.closest('a',this.$editor[0]).on('click',function(e){e.preventDefault();});if(this.utils.browser('msie'))$img.attr('unselectable','on');this.image.setEditable($img);},this));$(document).on('click.redactor-image-delete.'+this.uuid,$.proxy(function(e)
{this.observe.image=false;if(e.target.tagName=='IMG'&&this.utils.isRedactorParent(e.target))
{this.observe.image=(this.observe.image&&this.observe.image==e.target)?false:e.target;}},this));},links:function()
{if(!this.opts.linkTooltip)return;this.$editor.find('a').on('touchstart.redactor.'+this.uuid+' click.redactor.'+this.uuid,$.proxy(this.observe.showTooltip,this));this.$editor.on('touchstart.redactor.'+this.uuid+' click.redactor.'+this.uuid,$.proxy(this.observe.closeTooltip,this));$(document).on('touchstart.redactor.'+this.uuid+' click.redactor.'+this.uuid,$.proxy(this.observe.closeTooltip,this));},getTooltipPosition:function($link)
{return $link.offset();},showTooltip:function(e)
{var $el=$(e.target);if($el[0].tagName=='IMG')
return;if($el[0].tagName!=='A')
$el=$el.closest('a',this.$editor[0]);if($el[0].tagName!=='A')
return;var $link=$el;var pos=this.observe.getTooltipPosition($link);var tooltip=$('<span class="redactor-link-tooltip"></span>');var href=$link.attr('href');if(href===undefined)
{href='';}
if(href.length>24)href=href.substring(0,24)+'...';var aLink=$('<a href="'+$link.attr('href')+'" target="_blank" />').html(href).addClass('redactor-link-tooltip-action');var aEdit=$('<a href="#" />').html(this.lang.get('edit')).on('click',$.proxy(this.link.show,this)).addClass('redactor-link-tooltip-action');var aUnlink=$('<a href="#" />').html(this.lang.get('unlink')).on('click',$.proxy(this.link.unlink,this)).addClass('redactor-link-tooltip-action');tooltip.append(aLink).append(' | ').append(aEdit).append(' | ').append(aUnlink);tooltip.css({top:(pos.top+parseInt($link.css('line-height'),10))+'px',left:pos.left+'px'});$('.redactor-link-tooltip').remove();$('body').append(tooltip);},closeTooltip:function(e)
{e=e.originalEvent||e;var target=e.target;var $parent=$(target).closest('a',this.$editor[0]);if($parent.length!==0&&$parent[0].tagName==='A'&&target.tagName!=='A')
{return;}
else if((target.tagName==='A'&&this.utils.isRedactorParent(target))||$(target).hasClass('redactor-link-tooltip-action'))
{return;}
$('.redactor-link-tooltip').remove();}};},paragraphize:function()
{return{load:function(html)
{if(this.opts.linebreaks)return html;if(html===''||html==='<p></p>')return this.opts.emptyHtml;html=html+"\n";this.paragraphize.safes=[];this.paragraphize.z=0;html=html.replace(/(<br\s?\/?>){1,}\n?<\/blockquote>/gi,'</blockquote>');html=this.paragraphize.getSafes(html);html=this.paragraphize.getSafesComments(html);html=this.paragraphize.replaceBreaksToNewLines(html);html=this.paragraphize.replaceBreaksToParagraphs(html);html=this.paragraphize.clear(html);html=this.paragraphize.restoreSafes(html);html=html.replace(new RegExp('<br\\s?/?>\n?<('+this.opts.paragraphizeBlocks.join('|')+')(.*?[^>])>','gi'),'<p><br /></p>\n<$1$2>');return $.trim(html);},getSafes:function(html)
{var $div=$('<div />').append(html);$div.find('blockquote p').replaceWith(function()
{return $(this).append('<br />').contents();});html=$div.html();$div.find(this.opts.paragraphizeBlocks.join(', ')).each($.proxy(function(i,s)
{this.paragraphize.z++;this.paragraphize.safes[this.paragraphize.z]=s.outerHTML;html=html.replace(s.outerHTML,'\n{replace'+this.paragraphize.z+'}');},this));return html;},getSafesComments:function(html)
{var commentsMatches=html.match(/<!--([\w\W]*?)-->/gi);if(!commentsMatches)return html;$.each(commentsMatches,$.proxy(function(i,s)
{this.paragraphize.z++;this.paragraphize.safes[this.paragraphize.z]=s;html=html.replace(s,'\n{replace'+this.paragraphize.z+'}');},this));return html;},restoreSafes:function(html)
{$.each(this.paragraphize.safes,function(i,s)
{s=(typeof s!=='undefined')?s.replace(/\$/g,'&#36;'):s;html=html.replace('{replace'+i+'}',s);});return html;},replaceBreaksToParagraphs:function(html)
{var htmls=html.split(new RegExp('\n','g'),-1);html='';if(htmls)
{var len=htmls.length;for(var i=0;i<len;i++)
{if(!htmls.hasOwnProperty(i))return;if(htmls[i].search('{replace')==-1)
{htmls[i]=htmls[i].replace(/<p>\n\t?<\/p>/gi,'');htmls[i]=htmls[i].replace(/<p><\/p>/gi,'');if(htmls[i]!=='')
{html+='<p>'+htmls[i].replace(/^\n+|\n+$/g,"")+"</p>";}}
else html+=htmls[i];}}
return html;},replaceBreaksToNewLines:function(html)
{html=html.replace(/<br \/>\s*<br \/>/gi,"\n\n");html=html.replace(/<br\s?\/?>\n?<br\s?\/?>/gi,"\n<br /><br />");html=html.replace(new RegExp("\r\n",'g'),"\n");html=html.replace(new RegExp("\r",'g'),"\n");html=html.replace(new RegExp("/\n\n+/"),'g',"\n\n");return html;},clear:function(html)
{html=html.replace(new RegExp('</blockquote></p>','gi'),'</blockquote>');html=html.replace(new RegExp('<p></blockquote>','gi'),'</blockquote>');html=html.replace(new RegExp('<p><blockquote>','gi'),'<blockquote>');html=html.replace(new RegExp('<blockquote></p>','gi'),'<blockquote>');html=html.replace(new RegExp('<p><p ','gi'),'<p ');html=html.replace(new RegExp('<p><p>','gi'),'<p>');html=html.replace(new RegExp('</p></p>','gi'),'</p>');html=html.replace(new RegExp('<p>\\s?</p>','gi'),'');html=html.replace(new RegExp("\n</p>",'gi'),'</p>');html=html.replace(new RegExp('<p>\t?\t?\n?<p>','gi'),'<p>');html=html.replace(new RegExp('<p>\t*</p>','gi'),'');return html;}};},paste:function()
{return{init:function(e)
{if(!this.opts.cleanOnPaste)
{setTimeout($.proxy(this.code.sync,this),1);return;}
this.rtePaste=true;this.buffer.set();this.selection.save();this.utils.saveScroll();this.paste.createPasteBox();$(window).on('scroll.redactor-freeze',$.proxy(function()
{$(window).scrollTop(this.saveBodyScroll);},this));setTimeout($.proxy(function()
{var html=this.$pasteBox.html();this.$pasteBox.remove();this.selection.restore();this.utils.restoreScroll();this.paste.insert(html);$(window).off('scroll.redactor-freeze');if(this.linkify.isEnabled())
{this.linkify.format();}},this),1);},createPasteBox:function()
{this.$pasteBox=$('<div>').html('').attr('contenteditable','true').css({position:'fixed',width:0,top:0,left:'-9999px'});if(this.utils.browser('msie'))
{this.$box.append(this.$pasteBox);}
else
{var $visibleModals=$('.modal-body:visible');if($visibleModals.length>0)
{$visibleModals.append(this.$pasteBox);}
else
{$('body').append(this.$pasteBox);}}
this.$pasteBox.get(0).focus();},insert:function(html)
{html=this.core.setCallback('pasteBefore',html);html=(this.utils.isSelectAll())?this.clean.onPaste(html,false):this.clean.onPaste(html);html=this.core.setCallback('paste',html);if(this.utils.isSelectAll())
{this.insert.set(html,false);}
else
{this.insert.html(html,false);}
this.utils.disableSelectAll();this.rtePaste=false;setTimeout($.proxy(this.clean.clearUnverified,this),10);setTimeout($.proxy(function()
{var spans=this.$editor.find('span');$.each(spans,function(i,s)
{var html=s.innerHTML.replace(/\u200B/,'');if(html===''&&s.attributes.length===0)$(s).remove();});},this),10);}};},placeholder:function()
{return{enable:function()
{if(!this.placeholder.is())return;this.$editor.attr('placeholder',this.$element.attr('placeholder'));this.placeholder.toggle();this.$editor.on('keydown.redactor-placeholder',$.proxy(this.placeholder.toggle,this));},toggle:function()
{setTimeout($.proxy(function()
{var func=this.utils.isEmpty(this.$editor.html(),false)?'addClass':'removeClass';this.$editor[func]('redactor-placeholder');},this),5);},remove:function()
{this.$editor.removeClass('redactor-placeholder');},is:function()
{if(this.opts.placeholder)
{return this.$element.attr('placeholder',this.opts.placeholder);}
else
{return!(typeof this.$element.attr('placeholder')=='undefined'||this.$element.attr('placeholder')==='');}}};},progress:function()
{return{show:function()
{$(document.body).append($('<div id="redactor-progress"><span></span></div>'));$('#redactor-progress').fadeIn();},hide:function()
{$('#redactor-progress').fadeOut(1500,function()
{$(this).remove();});}};},selection:function()
{return{get:function()
{this.sel=document.getSelection();if(document.getSelection&&this.sel.getRangeAt&&this.sel.rangeCount)
{this.range=this.sel.getRangeAt(0);}
else
{this.range=document.createRange();}},addRange:function()
{try{this.sel.removeAllRanges();}catch(e){}
this.sel.addRange(this.range);},getCurrent:function()
{var el=false;this.selection.get();if(this.sel&&this.sel.rangeCount>0)
{el=this.sel.getRangeAt(0).startContainer;}
return this.utils.isRedactorParent(el);},getParent:function(elem)
{elem=elem||this.selection.getCurrent();if(elem)
{return this.utils.isRedactorParent($(elem).parent()[0]);}
return false;},getPrev:function()
{return window.getSelection().anchorNode.previousSibling;},getNext:function()
{return window.getSelection().anchorNode.nextSibling;},getBlock:function(node)
{node=node||this.selection.getCurrent();while(node)
{if(this.utils.isBlockTag(node.tagName))
{return($(node).hasClass('redactor-editor'))?false:node;}
node=node.parentNode;}
return false;},getInlines:function(nodes,tags)
{this.selection.get();if(this.range&&this.range.collapsed)
{return false;}
var inlines=[];nodes=(typeof nodes=='undefined'||nodes===false)?this.selection.getNodes():nodes;var inlineTags=this.opts.inlineTags;inlineTags.push('span');if(typeof tags!=='undefined')
{for(var i=0;i<tags.length;i++)
{inlineTags.push(tags[i]);}}
$.each(nodes,$.proxy(function(i,node)
{if($.inArray(node.tagName.toLowerCase(),inlineTags)!=-1)
{inlines.push(node);}},this));return(inlines.length===0)?false:inlines;},getInlinesTags:function(tags)
{this.selection.get();if(this.range&&this.range.collapsed)
{return false;}
var inlines=[];var nodes=this.selection.getNodes();$.each(nodes,$.proxy(function(i,node)
{if($.inArray(node.tagName.toLowerCase(),tags)!=-1)
{inlines.push(node);}},this));return(inlines.length===0)?false:inlines;},getBlocks:function(nodes)
{this.selection.get();if(this.range&&this.range.collapsed)
{return[this.selection.getBlock()];}
var blocks=[];nodes=(typeof nodes=='undefined')?this.selection.getNodes():nodes;$.each(nodes,$.proxy(function(i,node)
{if(this.utils.isBlock(node))
{blocks.push(node);}},this));return(blocks.length===0)?[this.selection.getBlock()]:blocks;},getLastBlock:function()
{return this.selection.lastBlock;},getNodes:function()
{this.selection.get();var startNode=this.selection.getNodesMarker(1);var endNode=this.selection.getNodesMarker(2);if(this.range.collapsed===false)
{if(window.getSelection){var sel=window.getSelection();if(sel.rangeCount>0){var range=sel.getRangeAt(0);var startPointNode=range.startContainer,startOffset=range.startOffset;var boundaryRange=range.cloneRange();boundaryRange.collapse(false);boundaryRange.insertNode(endNode);boundaryRange.setStart(startPointNode,startOffset);boundaryRange.collapse(true);boundaryRange.insertNode(startNode);range.setStartAfter(startNode);range.setEndBefore(endNode);sel.removeAllRanges();sel.addRange(range);}}}
else
{this.selection.setNodesMarker(this.range,startNode,true);endNode=startNode;}
var nodes=[];var counter=0;var self=this;this.$editor.find('*').each(function()
{if(this==startNode)
{var parent=$(this).parent();if(parent.length!==0&&parent[0].tagName!='BODY'&&self.utils.isRedactorParent(parent[0]))
{nodes.push(parent[0]);}
nodes.push(this);counter=1;}
else
{if(counter>0)
{nodes.push(this);counter=counter+1;}}
if(this==endNode)
{return false;}});var finalNodes=[];var len=nodes.length;for(var i=0;i<len;i++)
{if(nodes[i].id!='nodes-marker-1'&&nodes[i].id!='nodes-marker-2')
{finalNodes.push(nodes[i]);}}
this.selection.removeNodesMarkers();return finalNodes;},getNodesMarker:function(num)
{return $('<span id="nodes-marker-'+num+'" class="redactor-nodes-marker" data-verified="redactor">'+this.opts.invisibleSpace+'</span>')[0];},setNodesMarker:function(range,node,type)
{var range=range.cloneRange();try{range.collapse(type);range.insertNode(node);}
catch(e){}},removeNodesMarkers:function()
{$(document).find('span.redactor-nodes-marker').remove();this.$editor.find('span.redactor-nodes-marker').remove();},fromPoint:function(start,end)
{this.caret.setOffset(start,end);},wrap:function(tag)
{this.selection.get();if(this.range.collapsed)return false;var wrapper=document.createElement(tag);wrapper.appendChild(this.range.extractContents());this.range.insertNode(wrapper);return wrapper;},selectElement:function(node)
{if(this.utils.browser('mozilla'))
{node=node[0]||node;var range=document.createRange();range.selectNodeContents(node);}
else
{this.caret.set(node,0,node,1);}},selectAll:function()
{this.selection.get();this.range.selectNodeContents(this.$editor[0]);this.selection.addRange();},remove:function()
{this.selection.get();this.sel.removeAllRanges();},save:function()
{this.selection.createMarkers();},createMarkers:function()
{this.selection.get();var node1=this.selection.getMarker(1);this.selection.setMarker(this.range,node1,true);if(this.range.collapsed===false)
{var node2=this.selection.getMarker(2);this.selection.setMarker(this.range,node2,false);}
this.savedSel=this.$editor.html();},getMarker:function(num)
{if(typeof num=='undefined')num=1;return $('<span id="selection-marker-'+num+'" class="redactor-selection-marker"  data-verified="redactor">'+this.opts.invisibleSpace+'</span>')[0];},getMarkerAsHtml:function(num)
{return this.utils.getOuterHtml(this.selection.getMarker(num));},setMarker:function(range,node,type)
{range=range.cloneRange();try{range.collapse(type);range.insertNode(node);}
catch(e)
{this.focus.setStart();}},restore:function()
{var node1=this.$editor.find('span#selection-marker-1');var node2=this.$editor.find('span#selection-marker-2');if(this.utils.browser('mozilla'))
{this.$editor.focus();}
if(node1.length!==0&&node2.length!==0)
{this.caret.set(node1,0,node2,0);}
else if(node1.length!==0)
{this.caret.set(node1,0,node1,0);}
else
{this.$editor.focus();}
this.selection.removeMarkers();this.savedSel=false;},removeMarkers:function()
{this.$editor.find('span.redactor-selection-marker').each(function(i,s)
{var text=$(s).text().replace(/\u200B/g,'');if(text==='')$(s).remove();else $(s).replaceWith(function(){return $(this).contents();});});},getText:function()
{this.selection.get();return this.sel.toString();},getHtml:function()
{var html='';this.selection.get();if(this.sel.rangeCount)
{var container=document.createElement('div');var len=this.sel.rangeCount;for(var i=0;i<len;++i)
{container.appendChild(this.sel.getRangeAt(i).cloneContents());}
html=container.innerHTML;}
return this.clean.onSync(html);},replaceSelection:function(html)
{this.selection.get();this.range.deleteContents();var div=document.createElement("div");div.innerHTML=html;var frag=document.createDocumentFragment(),child;while((child=div.firstChild)){frag.appendChild(child);}
this.range.insertNode(frag);},replaceWithHtml:function(html)
{html=this.selection.getMarkerAsHtml(1)+html+this.selection.getMarkerAsHtml(2);this.selection.get();if(window.getSelection&&window.getSelection().getRangeAt)
{this.selection.replaceSelection(html);}
else if(document.selection&&document.selection.createRange)
{this.range.pasteHTML(html);}
this.selection.restore();this.code.sync();}};},shortcuts:function()
{return{init:function(e,key)
{if(!this.opts.shortcuts)
{if((e.ctrlKey||e.metaKey)&&(key===66||key===73))e.preventDefault();return false;}
$.each(this.opts.shortcuts,$.proxy(function(str,command)
{var keys=str.split(',');var len=keys.length;for(var i=0;i<len;i++)
{if(typeof keys[i]==='string')
{this.shortcuts.handler(e,$.trim(keys[i]),$.proxy(function()
{var func;if(command.func.search(/\./)!='-1')
{func=command.func.split('.');if(typeof this[func[0]]!='undefined')
{this[func[0]][func[1]].apply(this,command.params);}}
else
{this[command.func].apply(this,command.params);}},this));}}},this));},handler:function(e,keys,origHandler)
{var hotkeysSpecialKeys={8:"backspace",9:"tab",10:"return",13:"return",16:"shift",17:"ctrl",18:"alt",19:"pause",20:"capslock",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"insert",46:"del",59:";",61:"=",96:"0",97:"1",98:"2",99:"3",100:"4",101:"5",102:"6",103:"7",104:"8",105:"9",106:"*",107:"+",109:"-",110:".",111:"/",112:"f1",113:"f2",114:"f3",115:"f4",116:"f5",117:"f6",118:"f7",119:"f8",120:"f9",121:"f10",122:"f11",123:"f12",144:"numlock",145:"scroll",173:"-",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"};var hotkeysShiftNums={"`":"~","1":"!","2":"@","3":"#","4":"$","5":"%","6":"^","7":"&","8":"*","9":"(","0":")","-":"_","=":"+",";":": ","'":"\"",",":"<",".":">","/":"?","\\":"|"};keys=keys.toLowerCase().split(" ");var special=hotkeysSpecialKeys[e.keyCode],character=String.fromCharCode(e.which).toLowerCase(),modif="",possible={};$.each(["alt","ctrl","meta","shift"],function(index,specialKey)
{if(e[specialKey+'Key']&&special!==specialKey)
{modif+=specialKey+'+';}});if(special)possible[modif+special]=true;if(character)
{possible[modif+character]=true;possible[modif+hotkeysShiftNums[character]]=true;if(modif==="shift+")
{possible[hotkeysShiftNums[character]]=true;}}
for(var i=0,len=keys.length;i<len;i++)
{if(possible[keys[i]])
{e.preventDefault();return origHandler.apply(this,arguments);}}}};},tabifier:function()
{return{get:function(code)
{if(!this.opts.tabifier)return code;var ownLine=['area','body','head','hr','i?frame','link','meta','noscript','style','script','table','tbody','thead','tfoot'];var contOwnLine=['li','dt','dt','h[1-6]','option','script'];var newLevel=['p','blockquote','div','dl','fieldset','form','frameset','map','ol','pre','select','td','th','tr','ul'];this.tabifier.lineBefore=new RegExp('^<(/?'+ownLine.join('|/?')+'|'+contOwnLine.join('|')+')[ >]');this.tabifier.lineAfter=new RegExp('^<(br|/?'+ownLine.join('|/?')+'|/'+contOwnLine.join('|/')+')[ >]');this.tabifier.newLevel=new RegExp('^</?('+newLevel.join('|')+')[ >]');var i=0,codeLength=code.length,point=0,start=null,end=null,tag='',out='',cont='';this.tabifier.cleanlevel=0;for(;i<codeLength;i++)
{point=i;if(-1==code.substr(i).indexOf('<'))
{out+=code.substr(i);return this.tabifier.finish(out);}
while(point<codeLength&&code.charAt(point)!='<')
{point++;}
if(i!=point)
{cont=code.substr(i,point-i);if(!cont.match(/^\s{2,}$/g))
{if('\n'==out.charAt(out.length-1))out+=this.tabifier.getTabs();else if('\n'==cont.charAt(0))
{out+='\n'+this.tabifier.getTabs();cont=cont.replace(/^\s+/,'');}
out+=cont;}
if(cont.match(/\n/))out+='\n'+this.tabifier.getTabs();}
start=point;while(point<codeLength&&'>'!=code.charAt(point))
{point++;}
tag=code.substr(start,point-start);i=point;var t;if('!--'==tag.substr(1,3))
{if(!tag.match(/--$/))
{while('-->'!=code.substr(point,3))
{point++;}
point+=2;tag=code.substr(start,point-start);i=point;}
if('\n'!=out.charAt(out.length-1))out+='\n';out+=this.tabifier.getTabs();out+=tag+'>\n';}
else if('!'==tag[1])
{out=this.tabifier.placeTag(tag+'>',out);}
else if('?'==tag[1])
{out+=tag+'>\n';}
else if(t=tag.match(/^<(script|style|pre)/i))
{t[1]=t[1].toLowerCase();tag=this.tabifier.cleanTag(tag);out=this.tabifier.placeTag(tag,out);end=String(code.substr(i+1)).toLowerCase().indexOf('</'+t[1]);if(end)
{cont=code.substr(i+1,end);i+=end;out+=cont;}}
else
{tag=this.tabifier.cleanTag(tag);out=this.tabifier.placeTag(tag,out);}}
return this.tabifier.finish(out);},getTabs:function()
{var s='';for(var j=0;j<this.tabifier.cleanlevel;j++)
{s+='\t';}
return s;},finish:function(code)
{code=code.replace(/\n\s*\n/g,'\n');code=code.replace(/^[\s\n]*/,'');code=code.replace(/[\s\n]*$/,'');code=code.replace(/<script(.*?)>\n<\/script>/gi,'<script$1></script>');this.tabifier.cleanlevel=0;return code;},cleanTag:function(tag)
{var tagout='';tag=tag.replace(/\n/g,' ');tag=tag.replace(/\s{2,}/g,' ');tag=tag.replace(/^\s+|\s+$/g,' ');var suffix='';if(tag.match(/\/$/))
{suffix='/';tag=tag.replace(/\/+$/,'');}
var m;while(m=/\s*([^= ]+)(?:=((['"']).*?\3|[^ ]+))?/.exec(tag))
{if(m[2])tagout+=m[1].toLowerCase()+'='+m[2];else if(m[1])tagout+=m[1].toLowerCase();tagout+=' ';tag=tag.substr(m[0].length);}
return tagout.replace(/\s*$/,'')+suffix+'>';},placeTag:function(tag,out)
{var nl=tag.match(this.tabifier.newLevel);if(tag.match(this.tabifier.lineBefore)||nl)
{out=out.replace(/\s*$/,'');out+='\n';}
if(nl&&'/'==tag.charAt(1))this.tabifier.cleanlevel--;if('\n'==out.charAt(out.length-1))out+=this.tabifier.getTabs();if(nl&&'/'!=tag.charAt(1))this.tabifier.cleanlevel++;out+=tag;if(tag.match(this.tabifier.lineAfter)||tag.match(this.tabifier.newLevel))
{out=out.replace(/ *$/,'');}
return out;}};},tidy:function()
{return{setupAllowed:function()
{var index=$.inArray('span',this.opts.removeEmpty);if(index!==-1)
{this.opts.removeEmpty.splice(index,1);}
if(this.opts.allowedTags)this.opts.deniedTags=false;if(this.opts.allowedAttr)this.opts.removeAttr=false;if(this.opts.linebreaks)return;var tags=['p','section'];if(this.opts.allowedTags)this.tidy.addToAllowed(tags);if(this.opts.deniedTags)this.tidy.removeFromDenied(tags);},addToAllowed:function(tags)
{var len=tags.length;for(var i=0;i<len;i++)
{if($.inArray(tags[i],this.opts.allowedTags)==-1)
{this.opts.allowedTags.push(tags[i]);}}},removeFromDenied:function(tags)
{var len=tags.length;for(var i=0;i<len;i++)
{var pos=$.inArray(tags[i],this.opts.deniedTags);if(pos!=-1)
{this.opts.deniedTags.splice(pos,1);}}},load:function(html,options)
{this.tidy.settings={deniedTags:this.opts.deniedTags,allowedTags:this.opts.allowedTags,removeComments:this.opts.removeComments,replaceTags:this.opts.replaceTags,replaceStyles:this.opts.replaceStyles,removeDataAttr:this.opts.removeDataAttr,removeAttr:this.opts.removeAttr,allowedAttr:this.opts.allowedAttr,removeWithoutAttr:this.opts.removeWithoutAttr,removeEmpty:this.opts.removeEmpty};$.extend(this.tidy.settings,options);html=this.tidy.removeComments(html);this.tidy.$div=$('<div />').append(html);this.tidy.replaceTags();this.tidy.replaceStyles();this.tidy.removeTags();this.tidy.removeAttr();this.tidy.removeEmpty();this.tidy.removeParagraphsInLists();this.tidy.removeDataAttr();this.tidy.removeWithoutAttr();html=this.tidy.$div.html();this.tidy.$div.remove();return html;},removeComments:function(html)
{if(!this.tidy.settings.removeComments)return html;return html.replace(/<!--[\s\S]*?-->/gi,'');},replaceTags:function(html)
{if(!this.tidy.settings.replaceTags)return html;var len=this.tidy.settings.replaceTags.length;var replacement=[],rTags=[];for(var i=0;i<len;i++)
{rTags.push(this.tidy.settings.replaceTags[i][1]);replacement.push(this.tidy.settings.replaceTags[i][0]);}
$.each(replacement,$.proxy(function(key,value)
{this.tidy.$div.find(value).replaceWith(function()
{return $("<"+rTags[key]+" />",{html:$(this).html()});});},this));},replaceStyles:function()
{if(!this.tidy.settings.replaceStyles)return;var len=this.tidy.settings.replaceStyles.length;this.tidy.$div.find('span').each($.proxy(function(n,s)
{var $el=$(s);var style=$el.attr('style');for(var i=0;i<len;i++)
{if(style&&style.match(new RegExp('^'+this.tidy.settings.replaceStyles[i][0],'i')))
{var tagName=this.tidy.settings.replaceStyles[i][1];$el.replaceWith(function()
{var tag=document.createElement(tagName);return $(tag).append($(this).contents());});}}},this));},removeTags:function()
{if(!this.tidy.settings.deniedTags&&this.tidy.settings.allowedTags)
{this.tidy.$div.find('*').not(this.tidy.settings.allowedTags.join(',')).each(function(i,s)
{if(s.innerHTML==='')$(s).remove();else $(s).contents().unwrap();});}
if(this.tidy.settings.deniedTags)
{this.tidy.$div.find(this.tidy.settings.deniedTags.join(',')).each(function(i,s)
{if($(s).hasClass('redactor-script-tag')||$(s).hasClass('redactor-selection-marker'))return;if(s.innerHTML==='')$(s).remove();else $(s).contents().unwrap();});}},removeAttr:function()
{var len;if(!this.tidy.settings.removeAttr&&this.tidy.settings.allowedAttr)
{var allowedAttrTags=[],allowedAttrData=[];len=this.tidy.settings.allowedAttr.length;for(var i=0;i<len;i++)
{allowedAttrTags.push(this.tidy.settings.allowedAttr[i][0]);allowedAttrData.push(this.tidy.settings.allowedAttr[i][1]);}
this.tidy.$div.find('*').each($.proxy(function(n,s)
{var $el=$(s);var pos=$.inArray($el[0].tagName.toLowerCase(),allowedAttrTags);var attributesRemove=this.tidy.removeAttrGetRemoves(pos,allowedAttrData,$el);if(attributesRemove)
{$.each(attributesRemove,function(z,f){$el.removeAttr(f);});}},this));}
if(this.tidy.settings.removeAttr)
{len=this.tidy.settings.removeAttr.length;for(var i=0;i<len;i++)
{var attrs=this.tidy.settings.removeAttr[i][1];if($.isArray(attrs))attrs=attrs.join(' ');this.tidy.$div.find(this.tidy.settings.removeAttr[i][0]).removeAttr(attrs);}}},removeAttrGetRemoves:function(pos,allowed,$el)
{var attributesRemove=[];if(pos==-1)
{$.each($el[0].attributes,function(i,item)
{attributesRemove.push(item.name);});}
else if(allowed[pos]=='*')
{attributesRemove=[];}
else
{$.each($el[0].attributes,function(i,item)
{if($.isArray(allowed[pos]))
{if($.inArray(item.name,allowed[pos])==-1)
{attributesRemove.push(item.name);}}
else if(allowed[pos]!=item.name)
{attributesRemove.push(item.name);}});}
return attributesRemove;},removeAttrs:function(el,regex)
{regex=new RegExp(regex,"g");return el.each(function()
{var self=$(this);var len=this.attributes.length-1;for(var i=len;i>=0;i--)
{var item=this.attributes[i];if(item&&item.specified&&item.name.search(regex)>=0)
{self.removeAttr(item.name);}}});},removeEmpty:function()
{if(!this.tidy.settings.removeEmpty)return;this.tidy.$div.find(this.tidy.settings.removeEmpty.join(',')).each(function()
{var $el=$(this);var text=$el.text();text=text.replace(/\u200B/g,'');text=text.replace(/&nbsp;/gi,'');text=text.replace(/\s/g,'');if(text===''&&$el.children().length===0)
{$el.remove();}});},removeParagraphsInLists:function()
{this.tidy.$div.find('li p').contents().unwrap();},removeDataAttr:function()
{if(!this.tidy.settings.removeDataAttr)return;var tags=this.tidy.settings.removeDataAttr;if($.isArray(this.tidy.settings.removeDataAttr))tags=this.tidy.settings.removeDataAttr.join(',');this.tidy.removeAttrs(this.tidy.$div.find(tags),'^(data-)');},removeWithoutAttr:function()
{if(!this.tidy.settings.removeWithoutAttr)return;this.tidy.$div.find(this.tidy.settings.removeWithoutAttr.join(',')).each(function()
{if(this.attributes.length===0)
{$(this).contents().unwrap();}});}};},toolbar:function()
{return{init:function()
{return{html:{title:this.lang.get('html'),func:'code.toggle'},formatting:{title:this.lang.get('formatting'),dropdown:{p:{title:this.lang.get('paragraph'),func:'block.format'},blockquote:{title:this.lang.get('quote'),func:'block.format'},pre:{title:this.lang.get('code'),func:'block.format'},h1:{title:this.lang.get('header1'),func:'block.format'},h2:{title:this.lang.get('header2'),func:'block.format'},h3:{title:this.lang.get('header3'),func:'block.format'},h4:{title:this.lang.get('header4'),func:'block.format'},h5:{title:this.lang.get('header5'),func:'block.format'}}},bold:{title:this.lang.get('bold'),func:'inline.format'},italic:{title:this.lang.get('italic'),func:'inline.format'},deleted:{title:this.lang.get('deleted'),func:'inline.format'},underline:{title:this.lang.get('underline'),func:'inline.format'},unorderedlist:{title:'&bull; '+this.lang.get('unorderedlist'),func:'list.toggle'},orderedlist:{title:'1. '+this.lang.get('orderedlist'),func:'list.toggle'},outdent:{title:'< '+this.lang.get('outdent'),func:'indent.decrease'},indent:{title:'> '+this.lang.get('indent'),func:'indent.increase'},image:{title:this.lang.get('image'),func:'image.show'},file:{title:this.lang.get('file'),func:'file.show'},link:{title:this.lang.get('link'),dropdown:{link:{title:this.lang.get('link_insert'),func:'link.show',observe:{element:'a',in:{title:this.lang.get('link_edit'),},out:{title:this.lang.get('link_insert')}}},unlink:{title:this.lang.get('unlink'),func:'link.unlink',observe:{element:'a',out:{attr:{'class':'redactor-dropdown-link-inactive','aria-disabled':true}}}}}},alignment:{title:this.lang.get('alignment'),dropdown:{left:{title:this.lang.get('align_left'),func:'alignment.left'},center:{title:this.lang.get('align_center'),func:'alignment.center'},right:{title:this.lang.get('align_right'),func:'alignment.right'},justify:{title:this.lang.get('align_justify'),func:'alignment.justify'}}},horizontalrule:{title:this.lang.get('horizontalrule'),func:'line.insert'}};},build:function()
{this.toolbar.hideButtons();this.toolbar.hideButtonsOnMobile();this.toolbar.isButtonSourceNeeded();if(this.opts.buttons.length===0)return;this.$toolbar=this.toolbar.createContainer();this.toolbar.setOverflow();this.toolbar.append();this.toolbar.setFormattingTags();this.toolbar.loadButtons();this.toolbar.setFixed();if(this.opts.activeButtons)
{this.$editor.on('mouseup.redactor keyup.redactor focus.redactor',$.proxy(this.observe.toolbar,this));}},createContainer:function()
{return $('<ul>').addClass('redactor-toolbar').attr({'id':'redactor-toolbar-'+this.uuid,'role':'toolbar'});},setFormattingTags:function()
{$.each(this.opts.toolbar.formatting.dropdown,$.proxy(function(i,s)
{if($.inArray(i,this.opts.formatting)==-1)delete this.opts.toolbar.formatting.dropdown[i];},this));},loadButtons:function()
{$.each(this.opts.buttons,$.proxy(function(i,btnName)
{if(!this.opts.toolbar[btnName])return;if(btnName==='file')
{if(this.opts.fileUpload===false)return;else if(!this.opts.fileUpload&&this.opts.s3===false)return;}
if(btnName==='image')
{if(this.opts.imageUpload===false)return;else if(!this.opts.imageUpload&&this.opts.s3===false)return;}
var btnObject=this.opts.toolbar[btnName];this.$toolbar.append($('<li>').append(this.button.build(btnName,btnObject)));},this));},append:function()
{if(this.opts.toolbarExternal)
{this.$toolbar.addClass('redactor-toolbar-external');$(this.opts.toolbarExternal).html(this.$toolbar);}
else
{this.$box.prepend(this.$toolbar);}},setFixed:function()
{if(!this.utils.isDesktop())return;if(this.opts.toolbarExternal)return;if(!this.opts.toolbarFixed)return;this.toolbar.observeScroll();$(this.opts.toolbarFixedTarget).on('scroll.redactor.'+this.uuid,$.proxy(this.toolbar.observeScroll,this));},setOverflow:function()
{if(this.utils.isMobile()&&this.opts.toolbarOverflow)
{this.$toolbar.addClass('redactor-toolbar-overflow');}},isButtonSourceNeeded:function()
{if(this.opts.source)return;var index=this.opts.buttons.indexOf('html');if(index!==-1)
{this.opts.buttons.splice(index,1);}},hideButtons:function()
{if(this.opts.buttonsHide.length===0)return;$.each(this.opts.buttonsHide,$.proxy(function(i,s)
{var index=this.opts.buttons.indexOf(s);this.opts.buttons.splice(index,1);},this));},hideButtonsOnMobile:function()
{if(!this.utils.isMobile()||this.opts.buttonsHideOnMobile.length===0)return;$.each(this.opts.buttonsHideOnMobile,$.proxy(function(i,s)
{var index=this.opts.buttons.indexOf(s);this.opts.buttons.splice(index,1);},this));},observeScroll:function()
{var scrollTop=$(this.opts.toolbarFixedTarget).scrollTop();var boxTop=1;if(this.opts.toolbarFixedTarget===document)
{boxTop=this.$box.offset().top;}
if((scrollTop+this.opts.toolbarFixedTopOffset)>boxTop)
{this.toolbar.observeScrollEnable(scrollTop,boxTop);}
else
{this.toolbar.observeScrollDisable();}},observeScrollEnable:function(scrollTop,boxTop)
{var top=this.opts.toolbarFixedTopOffset+scrollTop-boxTop;var left=0;var end=boxTop+this.$box.height()-32;var width=this.$box.innerWidth();this.$toolbar.addClass('toolbar-fixed-box');this.$toolbar.css({position:'absolute',width:width,top:top+'px',left:left});if(scrollTop>end)
$('.redactor-dropdown-'+this.uuid+':visible').hide();this.toolbar.setDropdownsFixed();this.$toolbar.css('visibility',(scrollTop<end)?'visible':'hidden');},observeScrollDisable:function()
{this.$toolbar.css({position:'relative',width:'auto',top:0,left:0,visibility:'visible'});this.toolbar.unsetDropdownsFixed();this.$toolbar.removeClass('toolbar-fixed-box');},setDropdownsFixed:function()
{var top=this.$toolbar.innerHeight()+this.opts.toolbarFixedTopOffset;var position='fixed';if(this.opts.toolbarFixedTarget!==document)
{top=(this.$toolbar.innerHeight()+this.$toolbar.offset().top)+this.opts.toolbarFixedTopOffset;position='absolute';}
$('.redactor-dropdown-'+this.uuid).each(function()
{$(this).css({position:position,top:top+'px'});});},unsetDropdownsFixed:function()
{var top=(this.$toolbar.innerHeight()+this.$toolbar.offset().top);$('.redactor-dropdown-'+this.uuid).each(function()
{$(this).css({position:'absolute',top:top+'px'});});}};},upload:function()
{return{init:function(id,url,callback)
{this.upload.direct=false;this.upload.callback=callback;this.upload.url=url;this.upload.$el=$(id);this.upload.$droparea=$('<div id="redactor-droparea" />');this.upload.$placeholdler=$('<div id="redactor-droparea-placeholder" />').text(this.lang.get('upload_label'));this.upload.$input=$('<input type="file" name="file" />');this.upload.$placeholdler.append(this.upload.$input);this.upload.$droparea.append(this.upload.$placeholdler);this.upload.$el.append(this.upload.$droparea);this.upload.$droparea.off('redactor.upload');this.upload.$input.off('redactor.upload');this.upload.$droparea.on('dragover.redactor.upload',$.proxy(this.upload.onDrag,this));this.upload.$droparea.on('dragleave.redactor.upload',$.proxy(this.upload.onDragLeave,this));this.upload.$input.on('change.redactor.upload',$.proxy(function(e)
{e=e.originalEvent||e;this.upload.traverseFile(this.upload.$input[0].files[0],e);},this));this.upload.$droparea.on('drop.redactor.upload',$.proxy(function(e)
{e.preventDefault();this.upload.$droparea.removeClass('drag-hover').addClass('drag-drop');this.upload.onDrop(e);},this));},directUpload:function(file,e)
{this.upload.direct=true;this.upload.traverseFile(file,e);},onDrop:function(e)
{e=e.originalEvent||e;var files=e.dataTransfer.files;this.upload.traverseFile(files[0],e);},traverseFile:function(file,e)
{if(this.opts.s3)
{this.upload.setConfig(file);this.upload.s3uploadFile(file);return;}
var formData=!!window.FormData?new FormData():null;if(window.FormData)
{this.upload.setConfig(file);var name=(this.upload.type=='image')?this.opts.imageUploadParam:this.opts.fileUploadParam;formData.append(name,file);}
this.progress.show();this.core.setCallback('uploadStart',e,formData);this.upload.sendData(formData,e);},setConfig:function(file)
{this.upload.getType(file);if(this.upload.direct)
{this.upload.url=(this.upload.type=='image')?this.opts.imageUpload:this.opts.fileUpload;this.upload.callback=(this.upload.type=='image')?this.image.insert:this.file.insert;}},getType:function(file)
{this.upload.type='image';if(this.opts.imageTypes.indexOf(file.type)==-1)
{this.upload.type='file';}},getHiddenFields:function(obj,fd)
{if(obj===false||typeof obj!=='object')return fd;$.each(obj,$.proxy(function(k,v)
{if(v!==null&&v.toString().indexOf('#')===0)v=$(v).val();fd.append(k,v);},this));return fd;},sendData:function(formData,e)
{if(this.upload.type=='image')
{formData=this.upload.getHiddenFields(this.opts.uploadImageFields,formData);formData=this.upload.getHiddenFields(this.upload.imageFields,formData);}
else
{formData=this.upload.getHiddenFields(this.opts.uploadFileFields,formData);formData=this.upload.getHiddenFields(this.upload.fileFields,formData);}
var xhr=new XMLHttpRequest();xhr.open('POST',this.upload.url);xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");xhr.onreadystatechange=$.proxy(function()
{if(xhr.readyState==4)
{var data=xhr.responseText;data=data.replace(/^\[/,'');data=data.replace(/\]$/,'');var json;try
{json=(typeof data==='string'?$.parseJSON(data):data);}
catch(err)
{json={error:true};}
this.progress.hide();if(!this.upload.direct)
{this.upload.$droparea.removeClass('drag-drop');}
this.upload.callback(json,this.upload.direct,e);}},this);xhr.send(formData);},onDrag:function(e)
{e.preventDefault();this.upload.$droparea.addClass('drag-hover');},onDragLeave:function(e)
{e.preventDefault();this.upload.$droparea.removeClass('drag-hover');},clearImageFields:function()
{this.upload.imageFields={};},addImageFields:function(name,value)
{this.upload.imageFields[name]=value;},removeImageFields:function(name)
{delete this.upload.imageFields[name];},clearFileFields:function()
{this.upload.fileFields={};},addFileFields:function(name,value)
{this.upload.fileFields[name]=value;},removeFileFields:function(name)
{delete this.upload.fileFields[name];},s3uploadFile:function(file)
{this.upload.s3executeOnSignedUrl(file,$.proxy(function(signedURL)
{this.upload.s3uploadToS3(file,signedURL);},this));},s3executeOnSignedUrl:function(file,callback)
{var xhr=new XMLHttpRequest();var mark=(this.opts.s3.search(/\?/)!=='-1')?'?':'&';xhr.open('GET',this.opts.s3+mark+'name='+file.name+'&type='+file.type,true);if(xhr.overrideMimeType)xhr.overrideMimeType('text/plain; charset=x-user-defined');var that=this;xhr.onreadystatechange=function(e)
{if(this.readyState==4&&this.status==200)
{that.progress.show();callback(decodeURIComponent(this.responseText));}
else if(this.readyState==4&&this.status!=200)
{}};xhr.send();},s3createCORSRequest:function(method,url)
{var xhr=new XMLHttpRequest();if("withCredentials"in xhr)
{xhr.open(method,url,true);}
else if(typeof XDomainRequest!="undefined")
{xhr=new XDomainRequest();xhr.open(method,url);}
else
{xhr=null;}
return xhr;},s3uploadToS3:function(file,url)
{var xhr=this.upload.s3createCORSRequest('PUT',url);if(!xhr)
{}
else
{xhr.onload=$.proxy(function()
{if(xhr.status==200)
{this.progress.hide();var s3file=url.split('?');if(!s3file[0])
{return false;}
if(!this.upload.direct)
{this.upload.$droparea.removeClass('drag-drop');}
var json={filelink:s3file[0]};if(this.upload.type=='file')
{var arr=s3file[0].split('/');json.filename=arr[arr.length-1];}
this.upload.callback(json,this.upload.direct,false);}
else
{}},this);xhr.onerror=function(){};xhr.upload.onprogress=function(e){};xhr.setRequestHeader('Content-Type',file.type);xhr.setRequestHeader('x-amz-acl','public-read');xhr.send(file);}}};},utils:function()
{return{isMobile:function()
{return/(iPhone|iPod|BlackBerry|Android)/.test(navigator.userAgent);},isDesktop:function()
{return!/(iPhone|iPod|iPad|BlackBerry|Android)/.test(navigator.userAgent);},isString:function(obj)
{return Object.prototype.toString.call(obj)=='[object String]';},isEmpty:function(html,removeEmptyTags)
{html=html.replace(/[\u200B-\u200D\uFEFF]/g,'');html=html.replace(/&nbsp;/gi,'');html=html.replace(/<\/?br\s?\/?>/g,'');html=html.replace(/\s/g,'');html=html.replace(/^<p>[^\W\w\D\d]*?<\/p>$/i,'');html=html.replace(/<iframe(.*?[^>])>$/i,'iframe');html=html.replace(/<source(.*?[^>])>$/i,'source');if(removeEmptyTags!==false)
{html=html.replace(/<[^\/>][^>]*><\/[^>]+>/gi,'');html=html.replace(/<[^\/>][^>]*><\/[^>]+>/gi,'');}
html=$.trim(html);return html==='';},normalize:function(str)
{if(typeof(str)==='undefined')return 0;return parseInt(str.replace('px',''),10);},hexToRgb:function(hex)
{if(typeof hex=='undefined')return;if(hex.search(/^#/)==-1)return hex;var shorthandRegex=/^#?([a-f\d])([a-f\d])([a-f\d])$/i;hex=hex.replace(shorthandRegex,function(m,r,g,b)
{return r+r+g+g+b+b;});var result=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);return'rgb('+parseInt(result[1],16)+', '+parseInt(result[2],16)+', '+parseInt(result[3],16)+')';},getOuterHtml:function(el)
{return $('<div>').append($(el).eq(0).clone()).html();},getAlignmentElement:function(el)
{if($.inArray(el.tagName,this.opts.alignmentTags)!==-1)
{return $(el);}
else
{return $(el).closest(this.opts.alignmentTags.toString().toLowerCase(),this.$editor[0]);}},removeEmptyAttr:function(el,attr)
{var $el=$(el);if(typeof $el.attr(attr)=='undefined')
{return true;}
if($el.attr(attr)==='')
{$el.removeAttr(attr);return true;}
return false;},removeEmpty:function(i,s)
{var $s=$($.parseHTML(s));$s.find('.redactor-invisible-space').removeAttr('style').removeAttr('class');if($s.find('hr, br, img, iframe, source').length!==0)return;var text=$.trim($s.text());if(this.utils.isEmpty(text,false))
{$s.remove();}},saveScroll:function()
{this.saveEditorScroll=this.$editor.scrollTop();this.saveBodyScroll=$(window).scrollTop();if(this.opts.scrollTarget)this.saveTargetScroll=$(this.opts.scrollTarget).scrollTop();},restoreScroll:function()
{if(typeof this.saveScroll==='undefined'&&typeof this.saveBodyScroll==='undefined')return;$(window).scrollTop(this.saveBodyScroll);this.$editor.scrollTop(this.saveEditorScroll);if(this.opts.scrollTarget)$(this.opts.scrollTarget).scrollTop(this.saveTargetScroll);},createSpaceElement:function()
{var space=document.createElement('span');space.className='redactor-invisible-space';space.innerHTML=this.opts.invisibleSpace;return space;},removeInlineTags:function(node)
{var tags=this.opts.inlineTags;tags.push('span');if(node.tagName=='PRE')tags.push('a');$(node).find(tags.join(',')).not('span.redactor-selection-marker').contents().unwrap();},replaceWithContents:function(node,removeInlineTags)
{var self=this;$(node).replaceWith(function()
{if(removeInlineTags===true)self.utils.removeInlineTags(this);return $(this).contents();});return $(node);},replaceToTag:function(node,tag,removeInlineTags)
{var replacement;var self=this;$(node).replaceWith(function()
{replacement=$('<'+tag+' />').append($(this).contents());for(var i=0;i<this.attributes.length;i++)
{replacement.attr(this.attributes[i].name,this.attributes[i].value);}
if(removeInlineTags===true)self.utils.removeInlineTags(replacement);return replacement;});return replacement;},isStartOfElement:function()
{var block=this.selection.getBlock();if(!block)return false;var offset=this.caret.getOffsetOfElement(block);return(offset===0)?true:false;},isEndOfElement:function(element)
{if(typeof element=='undefined')
{var element=this.selection.getBlock();if(!element)return false;}
var offset=this.caret.getOffsetOfElement(element);var text=$.trim($(element).text()).replace(/\n\r\n/g,'');return(offset==text.length)?true:false;},isStartOfEditor:function()
{var offset=this.caret.getOffsetOfElement(this.$editor[0]);return(offset===0)?true:false;},isEndOfEditor:function()
{var block=this.$editor[0];var offset=this.caret.getOffsetOfElement(block);var text=$.trim($(block).html().replace(/(<([^>]+)>)/gi,''));return(offset==text.length)?true:false;},isBlock:function(block)
{block=block[0]||block;return block&&this.utils.isBlockTag(block.tagName);},isBlockTag:function(tag)
{if(typeof tag=='undefined')return false;return this.reIsBlock.test(tag);},isTag:function(current,tag)
{var element=$(current).closest(tag,this.$editor[0]);if(element.length==1)
{return element[0];}
return false;},isSelectAll:function()
{return this.selectAll;},enableSelectAll:function()
{this.selectAll=true;},disableSelectAll:function()
{this.selectAll=false;},isRedactorParent:function(el)
{if(!el)
{return false;}
if($(el).parents('.redactor-editor').length===0||$(el).hasClass('redactor-editor'))
{return false;}
return el;},isCurrentOrParentHeader:function()
{return this.utils.isCurrentOrParent(['H1','H2','H3','H4','H5','H6']);},isCurrentOrParent:function(tagName)
{var parent=this.selection.getParent();var current=this.selection.getCurrent();if($.isArray(tagName))
{var matched=0;$.each(tagName,$.proxy(function(i,s)
{if(this.utils.isCurrentOrParentOne(current,parent,s))
{matched++;}},this));return(matched===0)?false:true;}
else
{return this.utils.isCurrentOrParentOne(current,parent,tagName);}},isCurrentOrParentOne:function(current,parent,tagName)
{tagName=tagName.toUpperCase();return parent&&parent.tagName===tagName?parent:current&&current.tagName===tagName?current:false;},isOldIe:function()
{return(this.utils.browser('msie')&&parseInt(this.utils.browser('version'),10)<9)?true:false;},isLessIe10:function()
{return(this.utils.browser('msie')&&parseInt(this.utils.browser('version'),10)<10)?true:false;},isIe11:function()
{return!!navigator.userAgent.match(/Trident\/7\./);},browser:function(browser)
{var ua=navigator.userAgent.toLowerCase();var match=/(opr)[\/]([\w.]+)/.exec(ua)||/(chrome)[ \/]([\w.]+)/.exec(ua)||/(webkit)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(ua)||/(webkit)[ \/]([\w.]+)/.exec(ua)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua)||/(msie) ([\w.]+)/.exec(ua)||ua.indexOf("trident")>=0&&/(rv)(?::| )([\w.]+)/.exec(ua)||ua.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)||[];if(browser=='safari')return(typeof match[3]!='undefined')?match[3]=='safari':false;if(browser=='version')return match[2];if(browser=='webkit')return(match[1]=='chrome'||match[1]=='opr'||match[1]=='webkit');if(match[1]=='rv')return browser=='msie';if(match[1]=='opr')return browser=='webkit';return browser==match[1];},strpos:function(haystack,needle,offset)
{var i=haystack.indexOf(needle,offset);return i>=0?i:false;},disableBodyScroll:function()
{var $body=$('html');var windowWidth=window.innerWidth;if(!windowWidth)
{var documentElementRect=document.documentElement.getBoundingClientRect();windowWidth=documentElementRect.right-Math.abs(documentElementRect.left);}
var isOverflowing=document.body.clientWidth<windowWidth;var scrollbarWidth=this.utils.measureScrollbar();$body.css('overflow','hidden');if(isOverflowing)$body.css('padding-right',scrollbarWidth);},measureScrollbar:function()
{var $body=$('body');var scrollDiv=document.createElement('div');scrollDiv.className='redactor-scrollbar-measure';$body.append(scrollDiv);var scrollbarWidth=scrollDiv.offsetWidth-scrollDiv.clientWidth;$body[0].removeChild(scrollDiv);return scrollbarWidth;},enableBodyScroll:function()
{$('html').css({'overflow':'','padding-right':''});$('body').remove('redactor-scrollbar-measure');}};}};$(window).on('load.tools.redactor',function()
{$('[data-tools="redactor"]').redactor();});Redactor.prototype.init.prototype=Redactor.prototype;})(jQuery);(function($){'use strict';window.RedactorPlugins=window.RedactorPlugins||{};window.RedactorPlugins.fullscreen=function(){return{init:function(){this.fullscreen.isOpen=false
var button=this.button.add('fullscreen','FullScreen')
this.button.addCallback(button,$.proxy(this.fullscreen.toggle,this))
button.addClass('redactor_btn_fullscreen').removeClass('redactor-btn-image')
button.parent().addClass('redactor-btn-right')
if(this.opts.fullscreen)
this.fullscreen.toggle()},toggle:function(){if(!this.fullscreen.isOpen)
this.fullscreen.enable()
else
this.fullscreen.disable()},enable:function(){this.button.changeIcon('fullscreen','normalscreen')
this.button.setActive('fullscreen')
this.fullscreen.isOpen=true
if(this.opts.toolbarExternal){this.fullscreen.toolcss={}
this.fullscreen.boxcss={}
this.fullscreen.toolcss.width=this.$toolbar.css('width')
this.fullscreen.toolcss.top=this.$toolbar.css('top')
this.fullscreen.toolcss.position=this.$toolbar.css('position')
this.fullscreen.boxcss.top=this.$box.css('top')}
this.fullscreen.height=this.$editor.height()
if(this.opts.maxHeight)this.$editor.css('max-height','')
if(this.opts.minHeight)this.$editor.css('min-height','')
if(!this.$fullscreenPlaceholder)this.$fullscreenPlaceholder=$('<div/>')
this.$fullscreenPlaceholder.insertAfter(this.$box)
this.$box.appendTo(document.body)
this.$box.addClass('redactor-box-fullscreen')
$('body, html').css('overflow','hidden')
this.fullscreen.resize()
$(window).on('resize.redactor.fullscreen',$.proxy(this.fullscreen.resize,this))
$(document).scrollTop(0,0)
this.$editor.focus()
this.observe.load()},disable:function(){this.button.removeIcon('fullscreen','normalscreen')
this.button.setInactive('fullscreen')
this.fullscreen.isOpen=false
$(window).off('resize.redactor.fullscreen')
$('body, html').css('overflow','')
this.$box.insertBefore(this.$fullscreenPlaceholder)
this.$fullscreenPlaceholder.remove()
this.$box.removeClass('redactor-box-fullscreen').css({width:'auto',height:'auto'})
this.code.sync()
if(this.opts.toolbarExternal){this.$box.css('top',this.fullscreen.boxcss.top)
this.$toolbar.css({'width':this.fullscreen.toolcss.width,'top':this.fullscreen.toolcss.top,'position':this.fullscreen.toolcss.position})}
if(this.opts.minHeight)this.$editor.css('minHeight',this.opts.minHeight)
if(this.opts.maxHeight)this.$editor.css('maxHeight',this.opts.maxHeight)
this.$editor.css('height','auto')
this.$editor.focus()
this.observe.load()},resize:function(){if(!this.fullscreen.isOpen)
return false
var pad=this.$editor.css('padding-top').replace('px','')
var toolbarHeight=this.$toolbar.height(),height=$(window).height()-toolbarHeight
this.$box.width($(window).width()-2).height(height+toolbarHeight)
if(this.opts.toolbarExternal){this.$toolbar.css({top:'0px',position:'absolute',width:'100%'})
this.$box.css('top',toolbarHeight+'px')}}}}}(jQuery));(function($){'use strict';window.RedactorPlugins=window.RedactorPlugins||{}
var Figure=function(redactor){this.redactor=redactor
this.toolbar={}
this.init()}
Figure.prototype={control:{up:{classSuffix:'arrow-up'},down:{classSuffix:'arrow-down'},'|':{classSuffix:'divider'},remove:{classSuffix:'delete'}},controlGroup:['up','down','remove'],init:function(){this.observeToolbars()
this.observeKeyboard()},showToolbar:function(event){var $figure=$(event.currentTarget),type=$figure.data('type')||'default',$toolbar=this.getToolbar(type).data('figure',$figure).prependTo($figure).show()
if(this.redactor[type]&&this.redactor[type].onShow){this.redactor[type].onShow($figure,$toolbar)}},hideToolbar:function(event){$(event.currentTarget).find('.oc-figure-controls').appendTo(this.redactor.$box).hide()},observeToolbars:function(){this.redactor.$editor.on('mousedown.figure','.oc-figure-controls',$.proxy(function(event){event.preventDefault()
this.current=this.redactor.selection.getCurrent()},this))
this.redactor.$editor.on('click.figure','.oc-figure-controls span, .oc-figure-controls a',$.proxy(function(event){event.stopPropagation()
var $target=$(event.currentTarget),command=$target.data('command'),$figure=$target.closest('figure'),plugin=this.redactor[$figure.data('type')]
this.command(command,$figure,plugin)},this))
this.redactor.$editor.on('keydown.figure',function(){$(this).find('figure').triggerHandler('mouseleave')})
if(this.redactor.utils.isMobile()){this.redactor.$editor.on('touchstart.figure','figure',function(event){if(event.target.nodeName!=='FIGCAPTION'&&$(event.target).parents('.oc-figure-controls').length){$(this).trigger('click',event)}})
this.redactor.$editor.on('click.figure','figure',$.proxy(function(event){if(event.target.nodeName!=='FIGCAPTION'){this.redactor.$editor.trigger('blur')}
this.showToolbar(event)},this))}
else{this.redactor.$editor.on('mouseenter.figure','figure',$.proxy(this.showToolbar,this))
this.redactor.$editor.on('mouseleave.figure','figure',$.proxy(this.hideToolbar,this))}},getToolbar:function(type){if(this.toolbar[type])
return this.toolbar[type]
var controlGroup=(this.redactor[type]&&this.redactor[type].controlGroup)||this.controlGroup,controls=$.extend({},this.control,(this.redactor[type]&&this.redactor[type].control)||{}),$controls=this.buildControls(controlGroup,controls),$toolbar=$('<div class="oc-figure-controls">').append($controls)
this.toolbar[type]=$toolbar
return $toolbar},buildControls:function(controlGroup,controls){var $controls=$()
$.each(controlGroup,$.proxy(function(index,command){var control
if(typeof command==='string'){control=controls[command]
$controls=$controls.add($('<span>',{'class':'oc-figure-controls-'+control.classSuffix,'text':control.text}).data({command:command,control:control}))}
else if(typeof command==='object'){$.each(command,$.proxy(function(text,commands){var $button=$('<span>').text(' '+text).addClass('oc-figure-controls-table dropdown'),$dropdown=$('<ul class="dropdown-menu open oc-dropdown-menu" />'),container=$('<li class="dropdown-container" />'),list=$('<ul />'),listItem
$dropdown.append(container.append(list))
$button.append($dropdown)
$button.on('mouseover.figure',function(){$dropdown.show()})
$button.on('mouseout.figure',function(){$dropdown.hide()})
$.each(commands,$.proxy(function(index,command){control=controls[command]
if(command==='|'){$('<li class="divider" />').appendTo(list)}
else{listItem=$('<li />')
$('<a />',{text:control.text}).data({command:command,control:control}).appendTo(listItem)
if(index==0)listItem.addClass('first-item')
listItem.appendTo(list)}},this))
$controls=$controls.add($button)},this))}},this))
return $controls},command:function(command,$figure,plugin){$figure.find('.oc-figure-controls').appendTo(this.redactor.$box)
this.redactor.buffer.set(this.redactor.$editor.html())
switch(command){case'up':$figure.prev().before($figure)
break
case'down':$figure.next().after($figure)
break
case'remove':$figure.remove()
break
default:if(plugin&&plugin.command){plugin.command(command,$figure,$(this.current))}
break}
this.redactor.code.sync()},observeKeyboard:function(){var redactor=this.redactor
redactor.$editor.on('keydown.figure',function(event){var currentNode=redactor.selection.getBlock()
if(event.keyCode===8&&!redactor.caret.getOffset(currentNode)&&currentNode.previousSibling&&currentNode.previousSibling.nodeName==='FIGURE'){event.preventDefault()}})},destroy:function(){this.redactor.$editor.off('.figure')
for(var type in this.toolbar){this.toolbar[type].find('span').off('.figure')}
this.redactor=null
this.toolbar=null}}
window.RedactorPlugins.figure=function(){return{init:function(){this.figure=new Figure(this)}}}}(jQuery));if(!RedactorPlugins)var RedactorPlugins={};(function($)
{RedactorPlugins.table=function()
{return{getTemplate:function()
{return String()
+'<section id="redactor-modal-table-insert">'
+'<label>'+this.lang.get('rows')+'</label>'
+'<input type="text" size="5" value="2" id="redactor-table-rows" />'
+'<label>'+this.lang.get('columns')+'</label>'
+'<input type="text" size="5" value="3" id="redactor-table-columns" />'
+'</section>';},init:function()
{var dropdown={};dropdown.insert_table={title:this.lang.get('insert_table'),func:this.table.show};dropdown.insert_row_above={title:this.lang.get('insert_row_above'),func:this.table.addRowAbove};dropdown.insert_row_below={title:this.lang.get('insert_row_below'),func:this.table.addRowBelow};dropdown.insert_column_left={title:this.lang.get('insert_column_left'),func:this.table.addColumnLeft};dropdown.insert_column_right={title:this.lang.get('insert_column_right'),func:this.table.addColumnRight};dropdown.add_head={title:this.lang.get('add_head'),func:this.table.addHead};dropdown.delete_head={title:this.lang.get('delete_head'),func:this.table.deleteHead};dropdown.delete_column={title:this.lang.get('delete_column'),func:this.table.deleteColumn};dropdown.delete_row={title:this.lang.get('delete_row'),func:this.table.deleteRow};dropdown.delete_table={title:this.lang.get('delete_table'),func:this.table.deleteTable};this.observe.addButton('td','table');this.observe.addButton('th','table');var button=this.button.addBefore('link','table',this.lang.get('table'));this.button.addDropdown(button,dropdown);button.addClass('redactor_btn_table').removeClass('redactor-btn-image')},show:function()
{this.modal.addTemplate('table',this.table.getTemplate());this.modal.load('table',this.lang.get('insert_table'),300);this.modal.createCancelButton();var button=this.modal.createActionButton(this.lang.get('insert'));button.on('click',this.table.insert);this.selection.save();this.modal.show();$('#redactor-table-rows').focus();},insert:function()
{this.placeholder.remove();this.clean.cleanEmptyParagraph();var rows=$('#redactor-table-rows').val(),columns=$('#redactor-table-columns').val(),$tableBox=$('<div>'),tableId=Math.floor(Math.random()*99999),$table=$('<table id="table'+tableId+'"><tbody></tbody></table>'),i,$row,z,$column;for(i=0;i<rows;i++)
{$row=$('<tr>');for(z=0;z<columns;z++)
{$column=$('<td>'+this.opts.invisibleSpace+'</td>');if(i===0&&z===0)
{$column.append(this.selection.getMarker());}
$($row).append($column);}
$table.append($row);}
$tableBox.append($table);var html=$tableBox.html();this.modal.close();this.selection.restore();if(this.table.getTable())return;this.buffer.set();var current=this.selection.getBlock()||this.selection.getCurrent();if(current&&current.tagName!='BODY')
{if(current.tagName=='LI')current=$(current).closest('ul, ol');$(current).after(html);}
else
{this.insert.html(html,false);}
this.selection.restore();var table=this.$editor.find('#table'+tableId);if(!this.opts.linebreaks&&(this.utils.browser('mozilla')||this.utils.browser('msie')))
{var $next=table.next();if($next.length===0)
{table.after(this.opts.emptyHtml);}}
this.observe.buttons();table.find('span.redactor-selection-marker').remove();table.removeAttr('id');this.code.sync();this.core.setCallback('insertedTable',table);},getTable:function()
{var $table=$(this.selection.getParent()).closest('table');if(!this.utils.isRedactorParent($table))return false;if($table.size()===0)return false;return $table;},restoreAfterDelete:function($table)
{this.selection.restore();$table.find('span.redactor-selection-marker').remove();this.code.sync();},deleteTable:function()
{var $table=this.table.getTable();if(!$table)return;this.buffer.set();var $next=$table.next();if(!this.opts.linebreaks&&$next.length!==0)
{this.caret.setStart($next);}
else
{this.caret.setAfter($table);}
$table.remove();this.code.sync();},deleteRow:function()
{var $table=this.table.getTable();if(!$table)return;var $current=$(this.selection.getCurrent());this.buffer.set();var $current_tr=$current.closest('tr');var $focus_tr=$current_tr.prev().length?$current_tr.prev():$current_tr.next();if($focus_tr.length)
{var $focus_td=$focus_tr.children('td, th').first();if($focus_td.length)$focus_td.prepend(this.selection.getMarker());}
$current_tr.remove();this.table.restoreAfterDelete($table);},deleteColumn:function()
{var $table=this.table.getTable();if(!$table)return;this.buffer.set();var $current=$(this.selection.getCurrent());var $current_td=$current.closest('td, th');var index=$current_td[0].cellIndex;$table.find('tr').each($.proxy(function(i,elem)
{var $elem=$(elem);var focusIndex=index-1<0?index+1:index-1;if(i===0)$elem.find('td, th').eq(focusIndex).prepend(this.selection.getMarker());$elem.find('td, th').eq(index).remove();},this));this.table.restoreAfterDelete($table);},addHead:function()
{var $table=this.table.getTable();if(!$table)return;this.buffer.set();if($table.find('thead').size()!==0)
{this.table.deleteHead();return;}
var tr=$table.find('tr').first().clone();tr.find('td').replaceWith($.proxy(function()
{return $('<th>').html(this.opts.invisibleSpace);},this));$thead=$('<thead></thead>').append(tr);$table.prepend($thead);this.code.sync();},deleteHead:function()
{var $table=this.table.getTable();if(!$table)return;var $thead=$table.find('thead');if($thead.size()===0)return;this.buffer.set();$thead.remove();this.code.sync();},addRowAbove:function()
{this.table.addRow('before');},addRowBelow:function()
{this.table.addRow('after');},addColumnLeft:function()
{this.table.addColumn('before');},addColumnRight:function()
{this.table.addColumn('after');},addRow:function(type)
{var $table=this.table.getTable();if(!$table)return;this.buffer.set();var $current=$(this.selection.getCurrent());var $current_tr=$current.closest('tr');var new_tr=$current_tr.clone();new_tr.find('th').replaceWith(function()
{var $td=$('<td>');$td[0].attributes=this.attributes;return $td.append($(this).contents());});new_tr.find('td').html(this.opts.invisibleSpace);if(type=='after')
{$current_tr.after(new_tr);}
else
{$current_tr.before(new_tr);}
this.code.sync();},addColumn:function(type)
{var $table=this.table.getTable();if(!$table)return;var index=0;var current=$(this.selection.getCurrent());this.buffer.set();var $current_tr=current.closest('tr');var $current_td=current.closest('td, th');$current_tr.find('td, th').each($.proxy(function(i,elem)
{if($(elem)[0]===$current_td[0])index=i;},this));$table.find('tr').each($.proxy(function(i,elem)
{var $current=$(elem).find('td, th').eq(index);var td=$current.clone();td.html(this.opts.invisibleSpace);if(type=='after')
{$current.after(td);}
else
{$current.before(td);}},this));this.code.sync();}};};})(jQuery);if(!RedactorPlugins)var RedactorPlugins={};(function($)
{RedactorPlugins.pagelinks=function()
{return{init:function()
{if(!this.opts.pageLinksHandler)return
this.modal.addCallback('link',$.proxy(this.pagelinks.load,this))},load:function()
{var $select=$('<select id="redactor-page-links" />')
$('#redactor-modal-link-insert').prepend($select)
this.pagelinks.storage={};this.$editor.request(this.opts.pageLinksHandler,{success:$.proxy(function(data){$.each(data.links,$.proxy(function(key,val){this.pagelinks.storage[key]=val
$select.append($('<option>').val(key).html(val.name))},this))
$select.on('change',$.proxy(this.pagelinks.select,this))},this)})},select:function(e)
{var key=$(e.target).val()
var name='',url=''
if(key!==0){name=this.pagelinks.storage[key].name
url=this.pagelinks.storage[key].url}
$('#redactor-link-url').val(url)
var $el=$('#redactor-link-url-text')
if($el.val()===''){$el.val($.trim($('<span />').html(name).text()))}}};};})(jQuery);+function($){"use strict";var Base=$.oc.foundation.base,BaseProto=Base.prototype
var RichEditor=function(element,options){this.options=options
this.$el=$(element)
this.$textarea=this.$el.find('>textarea:first')
this.$form=this.$el.closest('form')
this.$dataLocker=null
this.$editor=null
this.redactor=null
$.oc.foundation.controlUtils.markDisposable(element)
Base.call(this)
this.init()}
RichEditor.prototype=Object.create(BaseProto)
RichEditor.prototype.constructor=RichEditor
RichEditor.DEFAULTS={dataLocker:null,linksHandler:null,stylesheet:null,fullpage:false}
RichEditor.prototype.init=function(){var self=this;this.$el.one('dispose-control',this.proxy(this.dispose))
if(this.options.dataLocker){this.$dataLocker=$(this.options.dataLocker)
this.$textarea.val(this.$dataLocker.val())}
if(!this.$textarea.attr('id')){this.$textarea.attr('id','element-'+Math.random().toString(36).substring(7))}
var redactorOptions={imageEditable:true,imageResizable:true,buttonSource:true,removeDataAttr:false,toolbarFixed:false,syncBeforeCallback:this.proxy(this.onSyncBefore),focusCallback:this.proxy(this.onFocus),blurCallback:this.proxy(this.onBlur),keydownCallback:this.proxy(this.onKeydown),enterCallback:this.proxy(this.onEnter),changeCallback:this.proxy(this.onChange),pageLinksHandler:this.options.linksHandler,initCallback:function(){self.build(this)}}
if(this.options.fullpage){redactorOptions.fullpage=true}
redactorOptions.plugins=['fullscreen','figure','table','pagelinks','mediamanager']
redactorOptions.buttons=['html','formatting','bold','italic','alignment','unorderedlist','orderedlist','link','horizontalrule'],this.$textarea.redactor(redactorOptions)
this.redactor=this.$textarea.redactor('core.getObject')
this.$editor=this.redactor.$editor}
RichEditor.prototype.dispose=function(){this.unregisterHandlers()
$(document).trigger('mousedown')
this.redactor.core.destroy()
if(this.redactor.figure){this.redactor.figure.destroy()
this.redactor.figure=null}
this.$el.removeData('oc.richEditor')
this.options=null
this.$el=null
this.$textarea=null
this.$form=null
this.$dataLocker=null
this.$editor=null
this.redactor.$textarea=null
this.redactor.$element=null
this.redactor=null
BaseProto.dispose.call(this)}
RichEditor.prototype.unregisterHandlers=function(){$(window).off('resize',this.proxy(this.updateLayout))
$(window).off('oc.updateUi',this.proxy(this.updateLayout))
this.$el.off('dispose-control',this.proxy(this.dispose))}
RichEditor.prototype.build=function(redactor){this.updateLayout()
$(window).on('resize',this.proxy(this.updateLayout))
$(window).on('oc.updateUi',this.proxy(this.updateLayout))
this.$textarea.trigger('init.oc.richeditor',[this.$el])
this.initUiBlocks()
var self=this
redactor.default={onShow:function($figure,$toolbar){self.onShowFigureToolbar($figure,$toolbar)}}}
RichEditor.prototype.updateLayout=function(){var $editor=$('.redactor-editor',this.$el),$codeEditor=$('textarea',this.$el),$toolbar=$('.redactor-toolbar',this.$el)
if(!$editor.length)
return
if(this.$el.hasClass('stretch')){var height=$toolbar.outerHeight(true)
$editor.css('top',height+1)
$codeEditor.css('top',height)}}
RichEditor.prototype.sanityCheckContent=function(){var safeElements='p, h1, h2, h3, h4, h5, pre, figure, ol, ul';if(!this.$editor.children(':last-child').is(safeElements)){this.$editor.append('<p><br></p>')}
if(!this.$editor.children(':first-child').is(safeElements)){this.$editor.prepend('<p><br></p>')}
this.$textarea.trigger('sanitize.oc.richeditor',[this.$editor])}
RichEditor.prototype.syncBefore=function(html){var container={html:html}
this.$textarea.trigger('syncBefore.oc.richeditor',[container])
var $domTree=$('<div>'+container.html+'</div>')
$('*',$domTree).removeAttr('data-redactor-tag')
$domTree.find('span[data-redactor-class="redactor-invisible-space"]').each(function(){$(this).children().insertBefore(this)
$(this).remove()})
$domTree.find('span.redactor-invisible-space').each(function(){$(this).children().insertBefore(this)
$(this).remove()})
$domTree.find('[data-video], [data-audio]').each(function(){$(this).removeAttr('contenteditable data-ui-block tabindex')})
$domTree.find('div.oc-figure-controls').remove()
return $domTree.html()}
RichEditor.prototype.onShowFigureToolbar=function($figure,$toolbar){var toolbarTop=$figure.position().top-$toolbar.height()-10
$toolbar.toggleClass('bottom',toolbarTop<0)}
RichEditor.prototype.insertUiBlock=function($node){var current=this.redactor.selection.getCurrent(),inserted=false
if(current===false)
this.redactor.focus.setStart()
current=this.redactor.selection.getCurrent()
if(current!==false){var $paragraph=$(current).closest('p')
if($paragraph.length>0){this.redactor.caret.setAfter($paragraph.get(0))
if($.trim($paragraph.text()).length==0)
$paragraph.remove()}
else{var $closestBlock=$(current).closest('[data-ui-block]')
if($closestBlock.length>0){$node.insertBefore($closestBlock.get(0))
inserted=true}}}
if(!inserted)
this.redactor.insert.node($node)
this.redactor.code.sync()
$node.focus()}
RichEditor.prototype.initUiBlocks=function(){$('.redactor-editor [data-video], .redactor-editor [data-audio]',this.$el).each(function(){$(this).attr({'data-ui-block':true,'tabindex':'0'})
this.contentEditable=false})}
RichEditor.prototype.handleUiBlocksKeydown=function(ev){if(this.$textarea===undefined)
return
if(ev.target&&$(ev.target).attr('data-ui-block')!==undefined){this.uiBlockKeyDown(ev,ev.target)
ev.preventDefault()
return}
switch(ev.which){case 38:var block=this.redactor.selection.getBlock()
if(block)
this.handleUiBlockCaretIn($(block).prev())
break
case 40:var block=this.redactor.selection.getBlock()
if(block)
this.handleUiBlockCaretIn($(block).next())
break}}
RichEditor.prototype.handleUiBlockCaretIn=function($block){if($block.attr('data-ui-block')!==undefined){$block.focus()
this.redactor.selection.remove()
return true}
return false}
RichEditor.prototype.uiBlockKeyDown=function(ev,block){if(ev.which==40||ev.which==38||ev.which==13||ev.which==8){switch(ev.which){case 40:this.focusUiBlockOrText($(block).next(),true)
break
case 38:this.focusUiBlockOrText($(block).prev(),false)
break
case 13:var $paragraph=$('<p><br/></p>')
$paragraph.insertAfter(block)
this.redactor.caret.setStart($paragraph.get(0))
break
case 8:var $nextFocus=$(block).next(),gotoStart=true
if($nextFocus.length==0){$nextFocus=$(block).prev()
gotoStart=false}
this.focusUiBlockOrText($nextFocus,gotoStart)
$(block).remove()
break}}}
RichEditor.prototype.focusUiBlockOrText=function($block,gotoStart){if($block.length>0){if(!this.handleUiBlockCaretIn($block,this.redactor)){if(gotoStart)
this.redactor.caret.setStart($block.get(0))
else
this.redactor.caret.setEnd($block.get(0))}}}
RichEditor.prototype.onSyncBefore=function(html){return this.syncBefore(html)}
RichEditor.prototype.onFocus=function(){this.$el.addClass('editor-focus')}
RichEditor.prototype.onBlur=function(){this.$el.removeClass('editor-focus')}
RichEditor.prototype.onKeydown=function(ev){this.$textarea.trigger('keydown.oc.richeditor',[ev,this.$editor,this.$textarea])
if(ev.isDefaultPrevented())
return false
this.handleUiBlocksKeydown(ev)
if(ev.isDefaultPrevented())
return false}
RichEditor.prototype.onEnter=function(ev){this.$textarea.trigger('enter.oc.richeditor',[ev,this.$editor,this.$textarea])
if(ev.isDefaultPrevented())
return false
this.handleUiBlocksKeydown(ev)
if(ev.isDefaultPrevented())
return false}
RichEditor.prototype.onChange=function(ev){this.sanityCheckContent()
this.$editor.trigger('mutate')
this.$form.trigger('change')
if(this.$dataLocker)
this.$dataLocker.val(this.syncBefore(this.$editor.html()))}
var old=$.fn.richEditor
$.fn.richEditor=function(option){var args=arguments;return this.each(function(){var $this=$(this)
var data=$this.data('oc.richEditor')
var options=$.extend({},RichEditor.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('oc.richEditor',(data=new RichEditor(this,options)))
if(typeof option=='string'){var methodArgs=[];for(var i=1;i<args.length;i++)
methodArgs.push(args[i])
data[option].apply(data,methodArgs)}})}
$.fn.richEditor.Constructor=RichEditor
$.fn.richEditor.noConflict=function(){$.fn.richEditor=old
return this}
$(document).render(function(){$('[data-control="richeditor"]').richEditor()})}(window.jQuery);