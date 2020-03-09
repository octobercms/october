
(function($){$.FroalaEditor.PLUGINS.mediaManager=function(editor){function onInsertFile(){new $.oc.mediaManager.popup({alias:'ocmediamanager',cropAndInsertButton:false,onInsert:function(items){if(!items.length){$.oc.alert($.oc.lang.get('mediamanager.invalid_file_empty_insert'))
return}
if(items.length>1){$.oc.alert($.oc.lang.get('mediamanager.invalid_file_single_insert'))
return}
var link,text=editor.selection.text(),textIsEmpty=$.trim(text)===''
for(var i=0,len=items.length;i<len;i++){var text=textIsEmpty?items[i].title:text
link=items[i].publicUrl}
editor.events.focus(true);editor.selection.restore();editor.html.insert('<a href="'+link+'" id="fr-inserted-file" class="fr-file">'+text+'</a>');var $file=editor.$el.find('#fr-inserted-file');$file.removeAttr('id');editor.undo.saveStep()
this.hide()}})}
function onInsertImage(){var $currentImage=editor.image.get(),selection=editor.selection.get(),range=editor.selection.ranges(0);new $.oc.mediaManager.popup({alias:'ocmediamanager',cropAndInsertButton:true,onInsert:function(items){editor.selection.clear();selection.addRange(range);if(!items.length){$.oc.alert($.oc.lang.get('mediamanager.invalid_image_empty_insert'))
return}
var imagesInserted=0
for(var i=0,len=items.length;i<len;i++){if(items[i].documentType!=='image'){$.oc.alert($.oc.lang.get('mediamanager.invalid_image_invalid_insert','The file "'+items[i].title+'" is not an image.'))
continue}
editor.image.insert(items[i].publicUrl,false,{},$currentImage)
imagesInserted++
if(imagesInserted==1){$currentImage=null}}
if(imagesInserted!==0){this.hide()
editor.undo.saveStep()}}})}
function onInsertVideo(){new $.oc.mediaManager.popup({alias:'ocmediamanager',cropAndInsertButton:false,onInsert:function(items){if(!items.length){$.oc.alert($.oc.lang.get('mediamanager.invalid_video_empty_insert'))
return}
if(items.length>1){$.oc.alert($.oc.lang.get('mediamanager.invalid_file_single_insert'))
return}
var item=items[0]
if(item.documentType!=='video'){$.oc.alert($.oc.lang.get('mediamanager.invalid_video_invalid_insert','The file "'+item.title+'" is not a video.'))
return}
var $richEditorNode=editor.$el.closest('[data-control="richeditor"]')
$richEditorNode.richEditor('insertVideo',item.publicUrl,item.title)
this.hide()}})}
function onInsertAudio(){new $.oc.mediaManager.popup({alias:'ocmediamanager',cropAndInsertButton:false,onInsert:function(items){if(!items.length){$.oc.alert($.oc.lang.get('mediamanager.invalid_audio_empty_insert'))
return}
if(items.length>1){$.oc.alert($.oc.lang.get('mediamanager.invalid_file_single_insert'))
return}
var item=items[0]
if(item.documentType!=='audio'){$.oc.alert($.oc.lang.get('mediamanager.invalid_audio_invalid_insert','The file "'+item.title+'" is not an audio file.'))
return}
var $richEditorNode=editor.$el.closest('[data-control="richeditor"]')
$richEditorNode.richEditor('insertAudio',item.publicUrl,item.title)
this.hide()}})}
function _insertVideoFallback(link){var $richEditorNode=editor.$el.closest('[data-control="richeditor"]')
var title=link.substring(link.lastIndexOf('/')+1)
$richEditorNode.richEditor('insertVideo',link,title)
editor.popups.hide('video.insert')}
function _insertAudioFallback(link){var $richEditorNode=editor.$el.closest('[data-control="richeditor"]')
var title=link.substring(link.lastIndexOf('/')+1)
$richEditorNode.richEditor('insertAudio',link,title)
editor.popups.hide('audio.insert')}
function _init(){editor.events.on('destroy',_destroy,true)
editor.events.on('video.linkError',_insertVideoFallback)
editor.events.on('audio.linkError',_insertAudioFallback)}
function _destroy(){}
return{_init:_init,insertFile:onInsertFile,insertImage:onInsertImage,insertVideo:onInsertVideo,insertAudio:onInsertAudio}}
if(!$.FE.PLUGINS.link||!$.FE.PLUGINS.file||!$.FE.PLUGINS.image||!$.FE.PLUGINS.video){throw new Error('Media manager plugin requires link, file, image and video plugin.');}
$.FE.DEFAULTS.imageInsertButtons.push('mmImageManager');$.FE.RegisterCommand('mmImageManager',{title:'Browse',undo:false,focus:false,callback:function(){this.mediaManager.insertImage();},plugin:'mediaManager'})
$.FE.DefineIcon('mmImageManager',{NAME:'folder'});$.FE.DEFAULTS.fileInsertButtons.push('mmFileManager');$.FE.RegisterCommand('mmFileManager',{title:'Browse',undo:false,focus:false,callback:function(){this.mediaManager.insertFile();},plugin:'mediaManager'})
$.FE.DefineIcon('mmFileManager',{NAME:'folder'});$.FE.DEFAULTS.videoInsertButtons.push('mmVideoManager');$.FE.RegisterCommand('mmVideoManager',{title:'Browse',undo:false,focus:false,callback:function(){this.mediaManager.insertVideo();},plugin:'mediaManager'})
$.FE.DefineIcon('mmVideoManager',{NAME:'folder'});$.FE.DEFAULTS.audioInsertButtons.push('mmAudioManager');$.FE.RegisterCommand('mmAudioManager',{title:'Browse',undo:false,focus:false,callback:function(){this.mediaManager.insertAudio();},plugin:'mediaManager'})
$.FE.DefineIcon('mmAudioManager',{NAME:'folder'});})(jQuery);var richeditorPageLinksPlugin
function richeditorPageLinksSelectPage($form){richeditorPageLinksPlugin.setLinkValueFromPopup($form)}
$.FroalaEditor.DEFAULTS=$.extend($.FroalaEditor.DEFAULTS,{pageLinksHandler:'onLoadPageLinksForm'});$.FroalaEditor.DEFAULTS.key='JA6B2B5A1qB1F1F4D3I1A15A11D3E6B5dVh1VCQWa1EOQFe1NCb1==';(function($){$.FroalaEditor.PLUGINS.pageLinks=function(editor){function setLinkValueFromPopup($form){var $select=$('select[name=pagelink]',$form)
var link={text:$('option:selected',$select).text().trim(),href:$select.val()}
setTimeout(function(){editor.popups.show('link.insert')
setLinkValue(link)},300)}
function setLinkValue(link){var $popup=editor.popups.get('link.insert');var text_inputs=$popup.find('input.fr-link-attr[type="text"]');var check_inputs=$popup.find('input.fr-link-attr[type="checkbox"]');var $input;var i;for(i=0;i<text_inputs.length;i++){$input=$(text_inputs[i]);if(link[$input.attr('name')]){$input.val(link[$input.attr('name')]);}
else if($input.attr('name')!='text'){$input.val('');}}
for(i=0;i<check_inputs.length;i++){$input=$(check_inputs[i]);$input.prop('checked',$input.data('checked')==link[$input.attr('name')]);}}
function insertLink(){richeditorPageLinksPlugin=this
editor.$el.popup({handler:editor.opts.pageLinksHandler})}
function _init(){}
return{_init:_init,setLinkValueFromPopup:setLinkValueFromPopup,setLinkValue:setLinkValue,insertLink:insertLink}}
$.FE.DEFAULTS.linkInsertButtons=['linkBack','|','linkPageLinks']
$.FE.RegisterCommand('linkPageLinks',{title:'Choose Link',undo:false,focus:false,callback:function(){this.pageLinks.insertLink()},plugin:'pageLinks'})
$.FE.DefineIcon('linkPageLinks',{NAME:'search'});})(jQuery);(function($){$.FroalaEditor.PLUGINS.figures=function(editor){function insertElement($el){var html=$('<div />').append($el.clone()).remove().html()
editor.events.focus(true)
editor.selection.restore()
editor.html.insert(html)
editor.html.cleanEmptyTags()
$('figure',editor.$el).each(function(){var $this=$(this),$parent=$this.parent('p'),$next=$this.next('p')
if(!!$parent.length){$this.insertAfter($parent)}
if(!!$next.length&&$.trim($next.text()).length==0){$next.remove()}})
editor.undo.saveStep()}
function _makeUiBlockElement(){var $node=$('<figure contenteditable="false" tabindex="0" data-ui-block="true">&nbsp;</figure>')
$node.get(0).contentEditable=false
return $node}
function insertVideo(url,text){var $node=_makeUiBlockElement()
$node.attr('data-video',url)
$node.attr('data-label',text)
insertElement($node)}
function insertAudio(url,text){var $node=_makeUiBlockElement()
$node.attr('data-audio',url)
$node.attr('data-label',text)
insertElement($node)}
function _initUiBlocks(){$('[data-video], [data-audio]',editor.$el).each(function(){$(this).addClass('fr-draggable').attr({'data-ui-block':'true','draggable':'true','tabindex':'0'}).html('&nbsp;')
this.contentEditable=false})}
function _handleUiBlocksKeydown(ev){if(ev.key==='ArrowDown'||ev.key==='ArrowUp'||ev.key==='Backspace'||ev.key==='Delete'){var $block=$(editor.selection.element())
if($block.is('br')){$block=$block.parent()}
if(!!$block.length){switch(ev.key){case'ArrowUp':_handleUiBlockCaretIn($block.prev())
break
case'ArrowDown':_handleUiBlockCaretIn($block.next())
break
case'Delete':_handleUiBlockCaretClearEmpty($block.next(),$block)
break
case'Backspace':_handleUiBlockCaretClearEmpty($block.prev(),$block)
break}}}}
function _handleUiBlockCaretClearEmpty($block,$p){if($block.attr('data-ui-block')!==undefined&&$.trim($p.text()).length==0){$p.remove()
_handleUiBlockCaretIn($block)
editor.undo.saveStep()}}
function _handleUiBlockCaretIn($block){if($block.attr('data-ui-block')!==undefined){$block.focus()
editor.selection.clear()
return true}
return false}
function _uiBlockKeyDown(ev,block){if(ev.key==='ArrowDown'||ev.key==='ArrowUp'||ev.key==='Enter'||ev.key==='Backspace'||ev.key==='Delete'){switch(ev.key){case'ArrowDown':_focusUiBlockOrText($(block).next(),true)
break
case'ArrowUp':_focusUiBlockOrText($(block).prev(),false)
break
case'Enter':var $paragraph=$('<p><br/></p>')
$paragraph.insertAfter(block)
editor.selection.setAfter(block)
editor.selection.restore()
editor.undo.saveStep()
break
case'Backspace':case'Delete':var $nextFocus=$(block).next(),gotoStart=true
if($nextFocus.length==0){$nextFocus=$(block).prev()
gotoStart=false}
_focusUiBlockOrText($nextFocus,gotoStart)
$(block).remove()
editor.undo.saveStep()
break}
ev.preventDefault()}}
function _focusUiBlockOrText($block,gotoStart){if(!!$block.length){if(!_handleUiBlockCaretIn($block)){if(gotoStart){editor.selection.setAtStart($block.get(0))
editor.selection.restore()}
else{editor.selection.setAtEnd($block.get(0))
editor.selection.restore()}}}}
function _onKeydown(ev){_handleUiBlocksKeydown(ev)
if(ev.isDefaultPrevented()){return false}}
function _onFigureKeydown(ev){if(ev.target&&$(ev.target).attr('data-ui-block')!==undefined){_uiBlockKeyDown(ev,ev.target)}
if(ev.isDefaultPrevented()){return false}}
function _onSync(html){var $domTree=$('<div>'+html+'</div>')
$domTree.find('[data-video], [data-audio]').each(function(){$(this).removeAttr('contenteditable data-ui-block tabindex draggable').removeClass('fr-draggable fr-dragging')})
return $domTree.html()}
function _init(){editor.events.on('initialized',_initUiBlocks)
editor.events.on('html.set',_initUiBlocks)
editor.events.on('html.get',_onSync)
editor.events.on('keydown',_onKeydown)
editor.events.on('destroy',_destroy,true)
editor.$el.on('keydown','figure',_onFigureKeydown)}
function _destroy(){editor.$el.off('keydown','figure',_onFigureKeydown)}
return{_init:_init,insert:insertElement,insertVideo:insertVideo,insertAudio:insertAudio}}})(jQuery);+function($){"use strict";var Base=$.oc.foundation.base,BaseProto=Base.prototype
var RichEditor=function(element,options){this.options=options
this.$el=$(element)
this.$textarea=this.$el.find('>textarea:first')
this.$form=this.$el.closest('form')
this.editor=null
$.oc.foundation.controlUtils.markDisposable(element)
Base.call(this)
this.init()}
RichEditor.prototype=Object.create(BaseProto)
RichEditor.prototype.constructor=RichEditor
RichEditor.DEFAULTS={linksHandler:null,stylesheet:null,fullpage:false,editorLang:'en',useMediaManager:false,toolbarButtons:null,allowEmptyTags:null,allowTags:null,noWrapTags:null,removeTags:null,lineBreakerTags:null,imageStyles:null,linkStyles:null,paragraphStyles:null,tableStyles:null,tableCellStyles:null,aceVendorPath:'/',readOnly:false}
RichEditor.prototype.init=function(){var self=this;this.$el.one('dispose-control',this.proxy(this.dispose))
if(!this.$textarea.attr('id')){this.$textarea.attr('id','element-'+Math.random().toString(36).substring(7))}
this.initFroala()}
RichEditor.prototype.initFroala=function(){var froalaOptions={editorClass:'control-richeditor',language:this.options.editorLang,fullPage:this.options.fullpage,pageLinksHandler:this.options.linksHandler,aceEditorVendorPath:this.options.aceVendorPath,toolbarSticky:false}
if(this.options.toolbarButtons){froalaOptions.toolbarButtons=this.options.toolbarButtons.split(',')}
else{froalaOptions.toolbarButtons=$.oc.richEditorButtons}
froalaOptions.imageStyles=this.options.imageStyles?this.options.imageStyles:{'oc-img-rounded':'Rounded','oc-img-bordered':'Bordered'}
froalaOptions.linkStyles=this.options.linkStyles?this.options.linkStyles:{'oc-link-green':'Green','oc-link-strong':'Thick'}
froalaOptions.paragraphStyles=this.options.paragraphStyles?this.options.paragraphStyles:{'oc-text-gray':'Gray','oc-text-bordered':'Bordered','oc-text-spaced':'Spaced','oc-text-uppercase':'Uppercase'}
froalaOptions.tableStyles=this.options.tableStyles?this.options.tableStyles:{'oc-dashed-borders':'Dashed Borders','oc-alternate-rows':'Alternate Rows'}
froalaOptions.tableCellStyles=this.options.tableCellStyles?this.options.tableCellStyles:{'oc-cell-highlighted':'Highlighted','oc-cell-thick-border':'Thick'}
froalaOptions.toolbarButtonsMD=froalaOptions.toolbarButtons
froalaOptions.toolbarButtonsSM=froalaOptions.toolbarButtons
froalaOptions.toolbarButtonsXS=froalaOptions.toolbarButtons
if(this.options.htmlAllowedEmptyTags){froalaOptions.allowEmptyTags=this.options.htmlAllowedEmptyTags.split(/[\s,]+/)}
if(this.options.allowTags){froalaOptions.htmlAllowedTags=this.options.allowTags.split(/[\s,]+/)}
froalaOptions.htmlDoNotWrapTags=this.options.noWrapTags?this.options.noWrapTags.split(/[\s,]+/):['figure','script','style']
if(this.options.removeTags){froalaOptions.htmlRemoveTags=this.options.removeTags.split(/[\s,]+/)}
froalaOptions.lineBreakerTags=this.options.lineBreakerTags?this.options.lineBreakerTags.split(/[\s,]+/):['figure, table, hr, iframe, form, dl']
froalaOptions.shortcutsEnabled=['show','bold','italic','underline','indent','outdent','undo','redo']
froalaOptions.imageUploadURL=froalaOptions.fileUploadURL=window.location
froalaOptions.imageUploadParam=froalaOptions.fileUploadParam='file_data'
froalaOptions.imageUploadParams=froalaOptions.fileUploadParams={X_OCTOBER_MEDIA_MANAGER_QUICK_UPLOAD:1,_token:$('meta[name="csrf-token"]').attr('content')}
var placeholder=this.$textarea.attr('placeholder')
froalaOptions.placeholderText=placeholder?placeholder:''
froalaOptions.height=this.$el.hasClass('stretch')?Infinity:$('.height-indicator',this.$el).height()
if(!this.options.useMediaManager){delete $.FroalaEditor.PLUGINS.mediaManager}
$.FroalaEditor.ICON_TEMPLATES={font_awesome:'<i class="icon-[NAME]"></i>',text:'<span style="text-align: center;">[NAME]</span>',image:'<img src=[SRC] alt=[ALT] />'}
this.$textarea.on('froalaEditor.initialized',this.proxy(this.build))
this.$textarea.on('froalaEditor.contentChanged',this.proxy(this.onChange))
this.$textarea.on('froalaEditor.html.get',this.proxy(this.onSyncContent))
this.$textarea.on('froalaEditor.html.set',this.proxy(this.onSetContent))
this.$form.on('oc.beforeRequest',this.proxy(this.onFormBeforeRequest))
this.$textarea.froalaEditor(froalaOptions)
this.editor=this.$textarea.data('froala.editor')
if(this.options.readOnly){this.editor.edit.off()}
this.$el.on('keydown','.fr-view figure',this.proxy(this.onFigureKeydown))}
RichEditor.prototype.dispose=function(){this.unregisterHandlers()
this.$textarea.froalaEditor('destroy')
this.$el.removeData('oc.richEditor')
this.options=null
this.$el=null
this.$textarea=null
this.$form=null
this.editor=null
BaseProto.dispose.call(this)}
RichEditor.prototype.unregisterHandlers=function(){this.$el.off('keydown','.fr-view figure',this.proxy(this.onFigureKeydown))
this.$textarea.off('froalaEditor.initialized',this.proxy(this.build))
this.$textarea.off('froalaEditor.contentChanged',this.proxy(this.onChange))
this.$textarea.off('froalaEditor.html.get',this.proxy(this.onSyncContent))
this.$textarea.off('froalaEditor.html.set',this.proxy(this.onSetContent))
this.$form.off('oc.beforeRequest',this.proxy(this.onFormBeforeRequest))
$(window).off('resize',this.proxy(this.updateLayout))
$(window).off('oc.updateUi',this.proxy(this.updateLayout))
this.$el.off('dispose-control',this.proxy(this.dispose))}
RichEditor.prototype.build=function(event,editor){this.updateLayout()
$(window).on('resize',this.proxy(this.updateLayout))
$(window).on('oc.updateUi',this.proxy(this.updateLayout))
editor.events.on('keydown',this.proxy(this.onKeydown),true)
this.$textarea.trigger('init.oc.richeditor',[this])}
RichEditor.prototype.isCodeViewActive=function(){return this.editor&&this.editor.codeView&&this.editor.codeView.isActive()}
RichEditor.prototype.getElement=function(){return this.$el}
RichEditor.prototype.getEditor=function(){return this.editor}
RichEditor.prototype.getTextarea=function(){return this.$textarea}
RichEditor.prototype.getContent=function(){return this.editor.html.get()}
RichEditor.prototype.setContent=function(html){this.editor.html.set(html)}
RichEditor.prototype.syncContent=function(){this.editor.events.trigger('contentChanged')}
RichEditor.prototype.updateLayout=function(){var $editor=$('.fr-wrapper',this.$el),$codeEditor=$('.fr-code',this.$el),$toolbar=$('.fr-toolbar',this.$el),$box=$('.fr-box',this.$el)
if(!$editor.length){return}
if(this.$el.hasClass('stretch')&&!$box.hasClass('fr-fullscreen')){var height=$toolbar.outerHeight(true)
$editor.css('top',height+1)
$codeEditor.css('top',height)}
else{$editor.css('top','')
$codeEditor.css('top','')}}
RichEditor.prototype.insertHtml=function(html){this.editor.html.insert(html)
this.editor.selection.restore()}
RichEditor.prototype.insertElement=function($el){this.insertHtml($('<div />').append($el.clone()).remove().html())}
RichEditor.prototype.insertUiBlock=function($node){this.$textarea.froalaEditor('figures.insert',$node)}
RichEditor.prototype.insertVideo=function(url,title){this.$textarea.froalaEditor('figures.insertVideo',url,title)}
RichEditor.prototype.insertAudio=function(url,title){this.$textarea.froalaEditor('figures.insertAudio',url,title)}
RichEditor.prototype.onSetContent=function(ev,editor){this.$textarea.trigger('setContent.oc.richeditor',[this])}
RichEditor.prototype.onSyncContent=function(ev,editor,html){if(editor.codeBeautifier){html=editor.codeBeautifier.run(html,editor.opts.codeBeautifierOptions)}
var container={html:html}
this.$textarea.trigger('syncContent.oc.richeditor',[this,container])
return container.html}
RichEditor.prototype.onFocus=function(){this.$el.addClass('editor-focus')}
RichEditor.prototype.onBlur=function(){this.$el.removeClass('editor-focus')}
RichEditor.prototype.onFigureKeydown=function(ev){this.$textarea.trigger('figureKeydown.oc.richeditor',[ev,this])}
RichEditor.prototype.onKeydown=function(ev,editor,keyEv){this.$textarea.trigger('keydown.oc.richeditor',[keyEv,this])
if(ev.isDefaultPrevented()){return false}}
RichEditor.prototype.onChange=function(ev){this.$form.trigger('change')}
RichEditor.prototype.onFormBeforeRequest=function(ev){if(!this.editor){return}
if(this.isCodeViewActive()){this.editor.html.set(this.editor.codeView.get())}
this.$textarea.val(this.editor.html.get())}
var old=$.fn.richEditor
$.fn.richEditor=function(option){var args=Array.prototype.slice.call(arguments,1),result
this.each(function(){var $this=$(this)
var data=$this.data('oc.richEditor')
var options=$.extend({},RichEditor.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('oc.richEditor',(data=new RichEditor(this,options)))
if(typeof option=='string')result=data[option].apply(data,args)
if(typeof result!='undefined')return false})
return result?result:this}
$.fn.richEditor.Constructor=RichEditor
$.fn.richEditor.noConflict=function(){$.fn.richEditor=old
return this}
$(document).render(function(){$('[data-control="richeditor"]').richEditor()})
if($.oc===undefined)
$.oc={}
$.oc.richEditorButtons=['paragraphFormat','paragraphStyle','quote','bold','italic','align','formatOL','formatUL','insertTable','insertLink','insertImage','insertVideo','insertAudio','insertFile','insertHR','fullscreen','html']}(window.jQuery);