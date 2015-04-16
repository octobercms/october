
if(!RedactorPlugins)var RedactorPlugins={};RedactorPlugins.mediamanager=function()
{function hideLinkTooltips(){$('.redactor-link-tooltip').remove()}
return{init:function()
{var buttonInsertLink=this.button.add('mmInsertMediaLink','Insert Media Link');this.button.setAwesome('mmInsertMediaLink','icon-link');buttonInsertLink.addClass('oc-redactor-button oc-autumn-button')
this.button.addCallback(buttonInsertLink,this.mediamanager.onInsertLink);var buttonInsertImage=this.button.add('mmInsertImageLink','Insert Media Image');buttonInsertImage.addClass('re-image oc-autumn-button')
buttonInsertImage.removeClass('redactor-btn-image')
this.button.addCallback(buttonInsertImage,this.mediamanager.onInsertImage);var buttonInsertVideo=this.button.add('mmInsertVideoLink','Insert Media Video');buttonInsertVideo.addClass('re-video oc-autumn-button')
buttonInsertVideo.removeClass('redactor-btn-image')
this.button.addCallback(buttonInsertVideo,this.mediamanager.onInsertVideo);var buttonInsertAudio=this.button.add('mmInsertAudioLink','Insert Media Audio');this.button.setAwesome('mmInsertAudioLink','icon-volume-up');buttonInsertAudio.addClass('oc-redactor-button oc-autumn-button')
this.button.addCallback(buttonInsertAudio,this.mediamanager.onInsertAudio);},onInsertLink:function(buttonName)
{var that=this
hideLinkTooltips()
this.selection.save()
this.link.getData()
new $.oc.mediaManager.popup({alias:'ocmediamanager',cropAndInsertButton:false,onInsert:function(items){if(!items.length){alert('Please select file to insert a links to.')
return}
if(items.length>1){alert('Please select a single file.')
return}
var text=that.link.text,textIsEmpty=$.trim(text)===''
for(var i=0,len=items.length;i<len;i++){var text=textIsEmpty?items[i].title:text
that.link.set(text,items[i].publicUrl,'')}
this.hide()}})},onInsertImage:function(buttonName)
{hideLinkTooltips()
if(!this.selection.getCurrent())
this.focus.setStart()
this.selection.save()
var that=this
new $.oc.mediaManager.popup({alias:'ocmediamanager',cropAndInsertButton:true,onInsert:function(items){if(!items.length){alert('Please select image(s) to insert.')
return}
that.selection.restore()
var isP=that.utils.isCurrentOrParent('P'),html='',imagesInserted=0
for(var i=0,len=items.length;i<len;i++){if(items[i].documentType!=='image'){alert('The file "'+items[i].title+'" is not an image.')
continue}
var $img=$('<img>').attr('src',items[i].publicUrl).attr('data-redactor-inserted-image','true')
html+=that.utils.getOuterHtml($img)
imagesInserted++}
if(imagesInserted>0){if(isP)
html='<blockquote>'+html+'</blockquote>'
that.selection.restore()
that.buffer.set()
that.insert.html(html,false);var $image=that.$editor.find('img[data-redactor-inserted-image=true]').removeAttr('data-redactor-inserted-image')
if(isP)
$image.parent().contents().unwrap().wrap('<p />')
else{if(that.opts.linebreaks)
$image.before('<br>').after('<br>')}}
if(imagesInserted!==0)
this.hide()}})},onInsertVideo:function(buttonName){hideLinkTooltips()
var that=this
hideLinkTooltips()
this.selection.save()
this.link.getData()
new $.oc.mediaManager.popup({alias:'ocmediamanager',cropAndInsertButton:false,onInsert:function(items){if(!items.length){alert('Please select a video file to insert.')
return}
if(items.length>1){alert('Please select a single file.')
return}
var item=items[0]
if(item.documentType!=='video'){alert('The file "'+item.title+'" is not a video.')
return}
var $richEditorNode=that.core.getTextarea().closest('[data-control="richeditor"]'),$videoNode=$('<figure contenteditable="false" tabindex="0" data-ui-block="true"/>')
$videoNode.get(0).contentEditable=false
$videoNode.attr('data-video',item.publicUrl)
$videoNode.attr('data-label',item.title)
that.selection.restore()
$richEditorNode.richEditor('insertUiBlock',$videoNode)
this.hide()}})},onInsertAudio:function(buttonName){hideLinkTooltips()
var that=this
hideLinkTooltips()
this.selection.save()
this.link.getData()
new $.oc.mediaManager.popup({alias:'ocmediamanager',cropAndInsertButton:false,onInsert:function(items){if(!items.length){alert('Please select an audio file to insert.')
return}
if(items.length>1){alert('Please select a single file.')
return}
var item=items[0]
if(item.documentType!=='audio'){alert('The file "'+item.title+'" is not an audio file.')
return}
var $richEditorNode=that.core.getTextarea().closest('[data-control="richeditor"]'),$videoNode=$('<figure contenteditable="false" tabindex="0" data-ui-block="true"/>')
$videoNode.get(0).contentEditable=false
$videoNode.attr('data-audio',item.publicUrl)
$videoNode.attr('data-label',item.title)
that.selection.restore()
$richEditorNode.richEditor('insertUiBlock',$videoNode)
this.hide()}})}};};+function($){"use strict";if($.oc.mediaManager===undefined)
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
$.oc.mediaManager.popup=MediaManagerPopup}(window.jQuery);