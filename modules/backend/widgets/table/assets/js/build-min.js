
+function($){"use strict";if($.oc===undefined)
$.oc={}
if($.oc.table===undefined)
$.oc.table={}
var Table=function(element,options){this.el=element
this.$el=$(element)
this.options=options
this.disposed=false
this.dataSource=null
this.cellProcessors={}
this.activeCellProcessor=null
this.activeCell=null
this.tableContainer=null
this.dataTableContainer=null
this.editedRowKey=null
this.dataTable=null
this.headerTable=null
this.toolbar=null
this.clickHandler=this.onClick.bind(this)
this.keydownHandler=this.onKeydown.bind(this)
this.documentClickHandler=this.onDocumentClick.bind(this)
this.toolbarClickHandler=this.onToolbarClick.bind(this)
if(this.options.postback&&this.options.clientDataSourceClass=='client')
this.formSubmitHandler=this.onFormSubmit.bind(this)
this.navigation=null
this.recordsAddedOrDeleted=0
this.disposeBound=this.dispose.bind(this)
this.init()
$.oc.foundation.controlUtils.markDisposable(element)}
Table.prototype.init=function(){this.createDataSource()
this.initCellProcessors()
this.navigation=new $.oc.table.helper.navigation(this)
this.buildUi()
this.registerHandlers()}
Table.prototype.disposeCellProcessors=function(){for(var i=0,len=this.options.columns.length;i<len;i++){var column=this.options.columns[i].key
this.cellProcessors[column].dispose()
this.cellProcessors[column]=null}
this.cellProcessors=null
this.activeCellProcessor=null}
Table.prototype.createDataSource=function(){var dataSourceClass=this.options.clientDataSourceClass
if($.oc.table.datasource===undefined||$.oc.table.datasource[dataSourceClass]==undefined)
throw new Error('The table client-side data source class "'+dataSourceClass+'" is not '+'found in the $.oc.table.datasource namespace.')
this.dataSource=new $.oc.table.datasource[dataSourceClass](this)}
Table.prototype.registerHandlers=function(){this.el.addEventListener('click',this.clickHandler)
this.el.addEventListener('keydown',this.keydownHandler)
this.$el.one('dispose-control',this.disposeBound)
document.addEventListener('click',this.documentClickHandler)
if(this.options.postback&&this.options.clientDataSourceClass=='client')
this.$el.closest('form').bind('oc.beforeRequest',this.formSubmitHandler)
var toolbar=this.getToolbar()
if(toolbar)
toolbar.addEventListener('click',this.toolbarClickHandler);}
Table.prototype.unregisterHandlers=function(){this.el.removeEventListener('click',this.clickHandler);document.removeEventListener('click',this.documentClickHandler)
this.clickHandler=null
this.el.removeEventListener('keydown',this.keydownHandler);this.keydownHandler=null
var toolbar=this.getToolbar()
if(toolbar)
toolbar.removeEventListener('click',this.toolbarClickHandler);this.toolbarClickHandler=null
if(this.formSubmitHandler){this.$el.closest('form').unbind('oc.beforeRequest',this.formSubmitHandler)
this.formSubmitHandler=null}}
Table.prototype.initCellProcessors=function(){for(var i=0,len=this.options.columns.length;i<len;i++){var columnConfiguration=this.options.columns[i],column=columnConfiguration.key,columnType=columnConfiguration.type
if(columnType===undefined){columnType='string'
this.options.columns[i].type=columnType}
if($.oc.table.processor===undefined||$.oc.table.processor[columnType]==undefined)
throw new Error('The table cell processor for the column type "'+columnType+'" is not '+'found in the $.oc.table.processor namespace.')
this.cellProcessors[column]=new $.oc.table.processor[columnType](this,column,columnConfiguration)}}
Table.prototype.getCellProcessor=function(columnName){return this.cellProcessors[columnName]}
Table.prototype.buildUi=function(){this.tableContainer=document.createElement('div')
this.tableContainer.setAttribute('class','table-container')
if(this.options.toolbar)
this.buildToolbar()
this.tableContainer.appendChild(this.buildHeaderTable())
this.el.insertBefore(this.tableContainer,this.el.children[0])
if(!this.options.height)
this.dataTableContainer=this.tableContainer
else
this.dataTableContainer=this.buildScrollbar()
this.updateDataTable()}
Table.prototype.buildToolbar=function(){if(!this.options.adding&&!this.options.deleting)
return
this.toolbar=document.createElement('div')
this.toolbar.setAttribute('class','toolbar')
if(this.options.adding){var addBelowButton=document.createElement('a')
addBelowButton.setAttribute('class','btn table-icon add-table-row-below')
addBelowButton.setAttribute('data-cmd','record-add-below')
this.toolbar.appendChild(addBelowButton)
if(this.navigation.paginationEnabled()||!this.options.rowSorting){addBelowButton.textContent=this.options.btnAddRowLabel}
else{addBelowButton.textContent=this.options.btnAddRowBelowLabel
var addAboveButton=document.createElement('a')
addAboveButton.setAttribute('class','btn table-icon add-table-row-above')
addAboveButton.textContent='Add row above'
addAboveButton.setAttribute('data-cmd','record-add-above')
this.toolbar.appendChild(addAboveButton)}}
if(this.options.deleting){var deleteButton=document.createElement('a')
deleteButton.setAttribute('class','btn table-icon delete-table-row')
deleteButton.textContent=this.options.btnDeleteRowLabel
deleteButton.setAttribute('data-cmd','record-delete')
this.toolbar.appendChild(deleteButton)}
this.tableContainer.appendChild(this.toolbar)}
Table.prototype.buildScrollbar=function(){var scrollbar=document.createElement('div'),scrollbarContent=document.createElement('div')
scrollbar.setAttribute('class','control-scrollbar')
if(this.options.dynamicHeight)
scrollbar.setAttribute('style','max-height: '+this.options.height+'px')
else
scrollbar.setAttribute('style','height: '+this.options.height+'px')
scrollbar.appendChild(scrollbarContent)
this.tableContainer.appendChild(scrollbar)
$(scrollbar).scrollbar({animation:false})
return scrollbarContent}
Table.prototype.buildHeaderTable=function(){var headersTable=document.createElement('table'),row=document.createElement('tr')
headersTable.className='headers'
headersTable.appendChild(row)
for(var i=0,len=this.options.columns.length;i<len;i++){var header=document.createElement('th')
if(this.options.columns[i].width)
header.setAttribute('style','width: '+this.options.columns[i].width)
header.textContent!==undefined?header.textContent=this.options.columns[i].title:header.innerText=this.options.columns[i].title
row.appendChild(header)}
this.headerTable=headersTable
return headersTable}
Table.prototype.updateDataTable=function(onSuccess){var self=this
this.unfocusTable()
this.fetchRecords(function onUpdateDataTableSuccess(records,totalCount){self.buildDataTable(records,totalCount)
if(onSuccess)
onSuccess()
if(totalCount==0)
self.addRecord('above',true)
self.$el.trigger('oc.tableUpdateData',[records,totalCount])
self=null})}
Table.prototype.updateColumnWidth=function(){var headerCells=this.headerTable.querySelectorAll('th'),dataCells=this.dataTable.querySelectorAll('tr:first-child td')
for(var i=0,len=headerCells.length;i<len;i++){if(dataCells[i])
dataCells[i].setAttribute('style',headerCells[i].getAttribute('style'))}}
Table.prototype.buildDataTable=function(records,totalCount){var dataTable=document.createElement('table'),tbody=document.createElement('tbody'),keyColumn=this.options.keyColumn
dataTable.setAttribute('class','data')
for(var i=0,len=records.length;i<len;i++){var row=document.createElement('tr')
if(records[i][keyColumn]===undefined)
throw new Error('The row attribute '+keyColumn+' is not set for the row #'+i);row.setAttribute('data-row',records[i][keyColumn])
for(var j=0,colsLen=this.options.columns.length;j<colsLen;j++){var cell=document.createElement('td'),dataContainer=document.createElement('input'),cellContentContainer=document.createElement('div'),column=this.options.columns[j],columnName=column.key,cellProcessor=this.getCellProcessor(columnName)
cell.setAttribute('data-column',columnName)
cell.setAttribute('data-column-type',column.type)
dataContainer.setAttribute('type','hidden')
dataContainer.setAttribute('data-container','data-container')
dataContainer.value=this.formatDataContainerValue(records[i][columnName])
cellContentContainer.setAttribute('class','content-container')
cell.appendChild(cellContentContainer)
row.appendChild(cell)
cell.appendChild(dataContainer)
cellProcessor.renderCell(records[i][columnName],cellContentContainer)}
tbody.appendChild(row)}
dataTable.appendChild(tbody)
if(this.dataTable!==null)
this.dataTableContainer.replaceChild(dataTable,this.dataTable)
else
this.dataTableContainer.appendChild(dataTable)
this.dataTable=dataTable
this.updateColumnWidth()
this.updateScrollbar()
this.navigation.buildPagination(totalCount)}
Table.prototype.formatDataContainerValue=function(value){if(value===undefined){return''}
if(typeof value==='boolean'){return value?1:''}
return value}
Table.prototype.fetchRecords=function(onSuccess){this.dataSource.getRecords(this.navigation.getPageFirstRowOffset(),this.options.recordsPerPage,onSuccess)}
Table.prototype.updateScrollbar=function(){if(!this.options.height)
return
$(this.dataTableContainer.parentNode).data('oc.scrollbar').update()}
Table.prototype.scrollCellIntoView=function(){if(!this.options.height||!this.activeCell)
return
$(this.dataTableContainer.parentNode).data('oc.scrollbar').gotoElement(this.activeCell)}
Table.prototype.disposeScrollbar=function(){if(!this.options.height)
return
$(this.dataTableContainer.parentNode).data('oc.scrollbar').dispose()
$(this.dataTableContainer.parentNode).data('oc.scrollbar',null)}
Table.prototype.setActiveProcessor=function(processor){if(this.activeCellProcessor)
this.activeCellProcessor.onUnfocus()
this.activeCellProcessor=processor}
Table.prototype.commitEditedRow=function(){if(this.editedRowKey===null)
return
var editedRow=this.dataTable.querySelector('tr[data-row="'+this.editedRowKey+'"]')
if(!editedRow)
return
if(editedRow.getAttribute('data-dirty')!=1)
return
var cells=editedRow.children,data={}
for(var i=0,len=cells.length;i<len;i++){var cell=cells[i]
data[cell.getAttribute('data-column')]=this.getCellValue(cell)}
this.dataSource.updateRecord(this.editedRowKey,data)
editedRow.setAttribute('data-dirty',0)}
Table.prototype.unfocusTable=function(){this.elementRemoveClass(this.el,'active')
if(this.activeCellProcessor)
this.activeCellProcessor.onUnfocus()
this.commitEditedRow()
this.activeCellProcessor=null
if(this.activeCell)
this.activeCell.setAttribute('class','')
this.activeCell=null}
Table.prototype.focusTable=function(){this.elementAddClass(this.el,'active')}
Table.prototype.focusCell=function(cellElement,isClick){var columnName=cellElement.getAttribute('data-column')
if(columnName===null)
return
this.focusTable()
var processor=this.getCellProcessor(columnName)
if(!processor)
throw new Error("Cell processor not found for the column "+columnName)
if(this.activeCell!==cellElement){if(this.activeCell)
this.elementRemoveClass(this.activeCell,'active')
this.setActiveProcessor(processor)
this.activeCell=cellElement
if(processor.isCellFocusable())
this.elementAddClass(this.activeCell,'active')}
var rowKey=this.getCellRowKey(cellElement)
if(this.editedRowKey!==null&&rowKey!=this.editedRowKey)
this.commitEditedRow()
this.editedRowKey=rowKey
processor.onFocus(cellElement,isClick)
this.scrollCellIntoView()}
Table.prototype.markCellRowDirty=function(cellElement){cellElement.parentNode.setAttribute('data-dirty',1)}
Table.prototype.addRecord=function(placement,noFocus){if(!this.activeCell||this.navigation.paginationEnabled()||!this.options.rowSorting)
placement='bottom'
var relativeToKey=null,currentRowIndex=null
if(placement=='above'||placement=='below'){relativeToKey=this.getCellRowKey(this.activeCell)
currentRowIndex=this.getCellRowIndex(this.activeCell)}
this.unfocusTable()
if(this.navigation.paginationEnabled()){var newPageIndex=this.navigation.getNewRowPage(placement,currentRowIndex)
if(newPageIndex!=this.navigation.pageIndex){if(!this.validate())
return}
this.navigation.pageIndex=newPageIndex}
this.recordsAddedOrDeleted++
var keyColumn=this.options.keyColumn,recordData={},self=this
recordData[keyColumn]=-1*this.recordsAddedOrDeleted
this.$el.trigger('oc.tableNewRow',[recordData])
this.dataSource.createRecord(recordData,placement,relativeToKey,this.navigation.getPageFirstRowOffset(),this.options.recordsPerPage,function onAddRecordDataTableSuccess(records,totalCount){self.buildDataTable(records,totalCount)
var row=self.findRowByKey(recordData[keyColumn])
if(!row)
throw new Error('New row is not found in the updated table: '+recordData[keyColumn])
if(!noFocus)
self.navigation.focusCell(row,0)
self=null})}
Table.prototype.deleteRecord=function(){if(!this.activeCell)
return
var currentRowIndex=this.getCellRowIndex(this.activeCell),key=this.getCellRowKey(this.activeCell),self=this,paginationEnabled=this.navigation.paginationEnabled(),currentPageIndex=this.navigation.pageIndex,currentCellIndex=this.activeCell.cellIndex
if(paginationEnabled)
this.navigation.pageIndex=this.navigation.getPageAfterDeletion(currentRowIndex)
this.recordsAddedOrDeleted++
var keyColumn=this.options.keyColumn,newRecordData={}
newRecordData[keyColumn]=-1*this.recordsAddedOrDeleted
this.dataSource.deleteRecord(key,newRecordData,this.navigation.getPageFirstRowOffset(),this.options.recordsPerPage,function onDeleteRecordDataTableSuccess(records,totalCount){self.buildDataTable(records,totalCount)
if(!paginationEnabled)
self.navigation.focusCellInReplacedRow(currentRowIndex,currentCellIndex)
else{if(currentPageIndex!=self.navigation.pageIndex)
self.navigation.focusCell('bottom',currentCellIndex)
else
self.navigation.focusCellInReplacedRow(currentRowIndex,currentCellIndex)}
self=null})}
Table.prototype.notifyRowProcessorsOnChange=function(cellElement){var columnName=cellElement.getAttribute('data-column'),row=cellElement.parentNode
for(var i=0,len=row.children.length;i<len;i++){var column=this.options.columns[i].key
this.cellProcessors[column].onRowValueChanged(columnName,row.children[i])}}
Table.prototype.getToolbar=function(){return this.tableContainer.querySelector('div.toolbar')}
Table.prototype.validate=function(){var rows=this.dataTable.querySelectorAll('tbody tr[data-row]')
for(var i=0,len=rows.length;i<len;i++){var row=rows[i]
this.elementRemoveClass(row,'error')}
for(var i=0,rowsLen=rows.length;i<rowsLen;i++){var row=rows[i],rowData=this.getRowData(row)
for(var j=0,colsLen=row.children.length;j<colsLen;j++)
this.elementRemoveClass(row.children[j],'error')
for(var columnName in rowData){var cellProcessor=this.getCellProcessor(columnName),message=cellProcessor.validate(rowData[columnName],rowData)
if(message!==undefined){var cell=row.querySelector('td[data-column="'+columnName+'"]'),self=this
this.elementAddClass(row,'error')
this.elementAddClass(cell,'error')
$.oc.flashMsg({text:message,'class':'error'})
window.setTimeout(function(){self.focusCell(cell,false)
cell=null
self=null
cellProcessor=null},100)
return false}}}
return true}
Table.prototype.onClick=function(ev){this.focusTable()
if(this.navigation.onClick(ev)===false)
return
for(var i=0,len=this.options.columns.length;i<len;i++){var column=this.options.columns[i].key
this.cellProcessors[column].onClick(ev)}
var target=this.getEventTarget(ev,'TD')
if(!target)
return
if(target.tagName!='TD')
return
this.focusCell(target,true)}
Table.prototype.onKeydown=function(ev){if(ev.keyCode==65&&ev.altKey&&this.options.adding){if(!ev.shiftKey){this.addRecord('below')}else{this.addRecord('above')}
this.stopEvent(ev)
return}
if(ev.keyCode==68&&ev.altKey&&this.options.deleting){this.deleteRecord()
this.stopEvent(ev)
return}
for(var i=0,len=this.options.columns.length;i<len;i++){var column=this.options.columns[i].key
this.cellProcessors[column].onKeyDown(ev)}
if(this.navigation.onKeydown(ev)===false)
return}
Table.prototype.onFormSubmit=function(ev,data){if(data.handler==this.options.postbackHandlerName){this.unfocusTable()
if(!this.validate()){ev.preventDefault()
return}
var fieldName=this.options.fieldName.indexOf('[')>-1?this.options.fieldName+'[TableData]':this.options.fieldName+'TableData'
data.options.data[fieldName]=this.dataSource.getAllData()}}
Table.prototype.onToolbarClick=function(ev){var target=this.getEventTarget(ev),cmd=target.getAttribute('data-cmd')
if(!cmd)
return
switch(cmd){case'record-add-below':this.addRecord('below')
break
case'record-add-above':this.addRecord('above')
break
case'record-delete':this.deleteRecord()
break}
this.stopEvent(ev)}
Table.prototype.onDocumentClick=function(ev){var target=this.getEventTarget(ev)
if(this.parentContainsElement(this.el,target))
return
if(this.activeCellProcessor&&this.activeCellProcessor.elementBelongsToProcessor(target))
return
this.unfocusTable()}
Table.prototype.dispose=function(){if(this.disposed){return}
this.disposed=true
this.disposeBound=true
this.unfocusTable()
this.dataSource.dispose()
this.dataSource=null
this.unregisterHandlers()
this.dataTable=null
this.headerTable=null
this.toolbar=null
this.disposeCellProcessors()
this.navigation.dispose()
this.navigation=null
this.disposeScrollbar()
this.el=null
this.tableContainer=null
this.$el=null
this.dataTableContainer=null
this.activeCell=null}
Table.prototype.setRowValues=function(rowIndex,rowValues){var row=this.findRowByIndex(rowIndex)
if(!row){return false}
var dataUpdated=false
for(var i=0,len=row.children.length;i<len;i++){var cell=row.children[i],cellColumnName=this.getCellColumnName(cell)
for(var rowColumnName in rowValues){if(rowColumnName==cellColumnName){this.setCellValue(cell,rowValues[rowColumnName],true)
dataUpdated=true}}}
if(dataUpdated){var originalEditedRowKey=this.editedRowKey
this.editedRowKey=this.getRowKey(row)
this.commitEditedRow()
this.editedRowKey=originalEditedRowKey}
return true}
Table.prototype.getElement=function(){return this.el}
Table.prototype.getAlias=function(){return this.options.alias}
Table.prototype.getTableContainer=function(){return this.tableContainer}
Table.prototype.getDataTableBody=function(){return this.dataTable.children[0]}
Table.prototype.getEventTarget=function(ev,tag){var target=ev.target?ev.target:ev.srcElement
if(tag===undefined)
return target
var tagName=target.tagName
while(tagName!=tag){target=target.parentNode
if(!target)
return null
tagName=target.tagName}
return target}
Table.prototype.stopEvent=function(ev){if(ev.stopPropagation)
ev.stopPropagation()
else
ev.cancelBubble=true
if(ev.preventDefault)
ev.preventDefault()
else
ev.returnValue=false}
Table.prototype.elementHasClass=function(el,className){if(el.classList)
return el.classList.contains(className);return new RegExp('(^| )'+className+'( |$)','gi').test(el.className);}
Table.prototype.elementAddClass=function(el,className){if(this.elementHasClass(el,className))
return
if(el.classList)
el.classList.add(className);else
el.className+=' '+className;}
Table.prototype.elementRemoveClass=function(el,className){if(el.classList)
el.classList.remove(className);else
el.className=el.className.replace(new RegExp('(^|\\b)'+className.split(' ').join('|')+'(\\b|$)','gi'),' ');}
Table.prototype.parentContainsElement=function(parent,element){while(element&&element!=parent){element=element.parentNode}
return element?true:false}
Table.prototype.getCellValue=function(cellElement){return cellElement.querySelector('[data-container]').value}
Table.prototype.getCellRowKey=function(cellElement){return parseInt(cellElement.parentNode.getAttribute('data-row'))}
Table.prototype.getRowKey=function(rowElement){return parseInt(rowElement.getAttribute('data-row'))}
Table.prototype.findRowByKey=function(key){return this.dataTable.querySelector('tbody tr[data-row="'+key+'"]')}
Table.prototype.findRowByIndex=function(index){return this.getDataTableBody().children[index]}
Table.prototype.getCellRowIndex=function(cellElement){return parseInt(cellElement.parentNode.rowIndex)}
Table.prototype.getRowCellValueByColumnName=function(row,columnName){var cell=row.querySelector('td[data-column="'+columnName+'"]')
if(!cell)
return cell
return this.getCellValue(cell)}
Table.prototype.getRowData=function(row){var result={}
for(var i=0,len=row.children.length;i<len;i++){var cell=row.children[i]
result[cell.getAttribute('data-column')]=this.getCellValue(cell)}
return result}
Table.prototype.getCellColumnName=function(cellElement){return cellElement.getAttribute('data-column')}
Table.prototype.setCellValue=function(cellElement,value,suppressEvents){var dataContainer=cellElement.querySelector('[data-container]')
if(dataContainer.value!=value){dataContainer.value=value
this.markCellRowDirty(cellElement)
this.notifyRowProcessorsOnChange(cellElement)
if(suppressEvents===undefined||!suppressEvents){this.$el.trigger('oc.tableCellChanged',[this.getCellColumnName(cellElement),value,this.getCellRowIndex(cellElement)])}}}
Table.DEFAULTS={clientDataSourceClass:'client',keyColumn:'id',recordsPerPage:false,data:null,postback:true,postbackHandlerName:'onSave',adding:true,deleting:true,toolbar:true,rowSorting:false,height:false,dynamicHeight:false,btnAddRowLabel:'Add row',btnAddRowBelowLabel:'Add row below',btnDeleteRowLabel:'Delete row'}
var old=$.fn.table
$.fn.table=function(option){var args=Array.prototype.slice.call(arguments,1),result=undefined
this.each(function(){var $this=$(this)
var data=$this.data('oc.table')
var options=$.extend({},Table.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('oc.table',(data=new Table(this,options)))
if(typeof option=='string')result=data[option].apply(data,args)
if(typeof result!='undefined')return false})
return result?result:this}
$.fn.table.Constructor=Table
$.oc.table.table=Table
$.fn.table.noConflict=function(){$.fn.table=old
return this}
$(document).on('render',function(){$('div[data-control=table]').table()})}(window.jQuery);+function($){"use strict";if($.oc.table===undefined)
throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");if($.oc.table.helper===undefined)
$.oc.table.helper={}
var Navigation=function(tableObj){this.tableObj=tableObj
this.pageIndex=0
this.pageCount=0
this.init()};Navigation.prototype.init=function(){}
Navigation.prototype.dispose=function(){this.tableObj=null}
Navigation.prototype.paginationEnabled=function(){return this.tableObj.options.recordsPerPage!=null&&this.tableObj.options.recordsPerPage!=false}
Navigation.prototype.getPageFirstRowOffset=function(){return this.pageIndex*this.tableObj.options.recordsPerPage}
Navigation.prototype.buildPagination=function(recordCount){if(!this.paginationEnabled())
return
var paginationContainer=this.tableObj.getElement().querySelector('.pagination'),newPaginationContainer=false,curRecordCount=0
this.pageCount=this.calculatePageCount(recordCount,this.tableObj.options.recordsPerPage)
if(!paginationContainer){paginationContainer=document.createElement('div')
paginationContainer.setAttribute('class','pagination')
newPaginationContainer=true}
else{curRecordCount=this.getRecordCount(paginationContainer)}
if(newPaginationContainer||curRecordCount!=recordCount){paginationContainer.setAttribute('data-record-count',recordCount)
var pageList=this.buildPaginationLinkList(recordCount,this.tableObj.options.recordsPerPage,this.pageIndex)
if(!newPaginationContainer){paginationContainer.replaceChild(pageList,paginationContainer.children[0])}
else{paginationContainer.appendChild(pageList)
this.tableObj.getElement().appendChild(paginationContainer)}}
else{this.markActiveLinkItem(paginationContainer,this.pageIndex)}}
Navigation.prototype.calculatePageCount=function(recordCount,recordsPerPage){var pageCount=Math.ceil(recordCount/recordsPerPage)
if(!pageCount)
pageCount=1
return pageCount}
Navigation.prototype.getRecordCount=function(paginationContainer){var container=paginationContainer?paginationContainer:this.tableObj.getElement().querySelector('.pagination')
return parseInt(container.getAttribute('data-record-count'))}
Navigation.prototype.buildPaginationLinkList=function(recordCount,recordsPerPage,pageIndex){var pageCount=this.calculatePageCount(recordCount,recordsPerPage),pageList=document.createElement('ul')
for(var i=0;i<pageCount;i++){var item=document.createElement('li'),link=document.createElement('a')
if(i==pageIndex)
item.setAttribute('class','active')
link.innerText=i+1
link.setAttribute('data-page-index',i)
link.setAttribute('href','#')
item.appendChild(link)
pageList.appendChild(item)
$(link).addClass('pagination-link')}
return pageList}
Navigation.prototype.markActiveLinkItem=function(paginationContainer,pageIndex){var activeItem=paginationContainer.querySelector('.active'),list=paginationContainer.children[0]
activeItem.setAttribute('class','')
for(var i=0,len=list.children.length;i<len;i++){if(i==pageIndex){list.children[i].setAttribute('class','active')}}}
Navigation.prototype.gotoPage=function(pageIndex,onSuccess){this.tableObj.unfocusTable()
if(!this.tableObj.validate())
return
this.pageIndex=pageIndex
this.tableObj.updateDataTable(onSuccess)}
Navigation.prototype.getRowCountOnPage=function(cellElement){return this.tableObj.getDataTableBody().children.length}
Navigation.prototype.getNewRowPage=function(placement,currentRowIndex){var curRecordCount=this.getRecordCount()
if(placement==='bottom')
return this.calculatePageCount(curRecordCount+1,this.tableObj.options.recordsPerPage)-1
if(placement=='above')
return this.pageIndex
if(placement=='below'){if(currentRowIndex==(this.tableObj.options.recordsPerPage-1))
return this.pageIndex+1
return this.pageIndex}
return this.pageIndex}
Navigation.prototype.getPageAfterDeletion=function(currentRowIndex){if(currentRowIndex==0&&this.getRowCountOnPage()==1)
return this.pageIndex==0?0:this.pageIndex-1
return this.pageIndex}
Navigation.prototype.navigateDown=function(ev,forceCellIndex){if(!this.tableObj.activeCell)
return
if(this.tableObj.activeCellProcessor&&!this.tableObj.activeCellProcessor.keyNavigationAllowed(ev,'down'))
return
var row=this.tableObj.activeCell.parentNode,newRow=!ev.shiftKey?row.nextElementSibling:row.parentNode.children[row.parentNode.children.length-1],cellIndex=forceCellIndex!==undefined?forceCellIndex:this.tableObj.activeCell.cellIndex
if(newRow){var cell=newRow.children[cellIndex]
if(cell)
this.tableObj.focusCell(cell)}
else{if(!this.paginationEnabled())
return
if(this.pageIndex<this.pageCount-1){var self=this
this.gotoPage(this.pageIndex+1,function navDownPageSuccess(){self.focusCell('top',cellIndex)
self=null})}}}
Navigation.prototype.navigateUp=function(ev,forceCellIndex,isTab){if(!this.tableObj.activeCell)
return
if(this.tableObj.activeCellProcessor&&!this.tableObj.activeCellProcessor.keyNavigationAllowed(ev,'up'))
return
var row=this.tableObj.activeCell.parentNode,newRow=(!ev.shiftKey||isTab)?row.previousElementSibling:row.parentNode.children[0],cellIndex=forceCellIndex!==undefined?forceCellIndex:this.tableObj.activeCell.cellIndex
if(newRow){var cell=newRow.children[cellIndex]
if(cell)
this.tableObj.focusCell(cell)}
else{if(!this.paginationEnabled())
return
if(this.pageIndex>0){var self=this
this.gotoPage(this.pageIndex-1,function navUpPageSuccess(){self.focusCell('bottom',cellIndex)
self=null})}}}
Navigation.prototype.navigateLeft=function(ev,isTab){if(!this.tableObj.activeCell)
return
if(!isTab&&this.tableObj.activeCellProcessor&&!this.tableObj.activeCellProcessor.keyNavigationAllowed(ev,'left'))
return
var row=this.tableObj.activeCell.parentNode,newIndex=(!ev.shiftKey||isTab)?this.tableObj.activeCell.cellIndex-1:0
var cell=row.children[newIndex]
if(cell){this.tableObj.focusCell(cell)}
else{this.navigateUp(ev,row.children.length-1,isTab)}}
Navigation.prototype.navigateRight=function(ev,isTab){if(!this.tableObj.activeCell)
return
if(!isTab&&this.tableObj.activeCellProcessor&&!this.tableObj.activeCellProcessor.keyNavigationAllowed(ev,'right'))
return
var row=this.tableObj.activeCell.parentNode,newIndex=!ev.shiftKey?this.tableObj.activeCell.cellIndex+1:row.children.length-1
var cell=row.children[newIndex]
if(cell){this.tableObj.focusCell(cell)}
else{this.navigateDown(ev,0)}}
Navigation.prototype.navigateNext=function(ev){if(!this.tableObj.activeCell)
return
if(this.tableObj.activeCellProcessor&&!this.tableObj.activeCellProcessor.keyNavigationAllowed(ev,'tab'))
return
if(!ev.shiftKey)
this.navigateRight(ev,true)
else
this.navigateLeft(ev,true)
this.tableObj.stopEvent(ev)}
Navigation.prototype.focusCell=function(rowReference,cellIndex){var row=null,tbody=this.tableObj.getDataTableBody()
if(typeof rowReference==='object'){row=rowReference}
else{if(rowReference=='bottom'){row=tbody.children[tbody.children.length-1]}
else if(rowReference=='top'){row=tbody.children[0]}}
if(!row)
return
var cell=row.children[cellIndex]
if(cell)
this.tableObj.focusCell(cell)}
Navigation.prototype.focusCellInReplacedRow=function(rowIndex,cellIndex){if(rowIndex==0){this.focusCell('top',cellIndex)}
else{var focusRow=this.tableObj.findRowByIndex(rowIndex)
if(!focusRow)
focusRow=this.tableObj.findRowByIndex(rowIndex-1)
if(focusRow)
this.focusCell(focusRow,cellIndex)
else
this.focusCell('top',cellIndex)}}
Navigation.prototype.onKeydown=function(ev){if(ev.keyCode==40)
return this.navigateDown(ev)
else if(ev.keyCode==38)
return this.navigateUp(ev)
else if(ev.keyCode==37)
return this.navigateLeft(ev)
if(ev.keyCode==39)
return this.navigateRight(ev)
if(ev.keyCode==9)
return this.navigateNext(ev)}
Navigation.prototype.onClick=function(ev){var target=this.tableObj.getEventTarget(ev,'A')
if(!target||!$(target).hasClass('pagination-link'))
return
var pageIndex=parseInt(target.getAttribute('data-page-index'))
if(pageIndex===null)
return
this.gotoPage(pageIndex)
this.tableObj.stopEvent(ev)
return false}
$.oc.table.helper.navigation=Navigation;}(window.jQuery);+function($){"use strict";if($.oc.table===undefined)
throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");if($.oc.table.datasource===undefined)
$.oc.table.datasource={}
var Base=function(tableObj){this.tableObj=tableObj}
Base.prototype.dispose=function(){this.tableObj=null}
Base.prototype.getRecords=function(offset,count,onSuccess){onSuccess([])}
Base.prototype.createRecord=function(recordData,placement,relativeToKey,offset,count,onSuccess){onSuccess([],0)}
Base.prototype.updateRecord=function(key,recordData){}
Base.prototype.deleteRecord=function(key,newRecordData,offset,count,onSuccess){onSuccess([],0)}
$.oc.table.datasource.base=Base;}(window.jQuery);+function($){"use strict";if($.oc.table===undefined)
throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");if($.oc.table.datasource===undefined)
throw new Error("The $.oc.table.datasource namespace is not defined. Make sure that the table.datasource.base.js script is loaded.");var Base=$.oc.table.datasource.base,BaseProto=Base.prototype
var Client=function(tableObj){Base.call(this,tableObj)
var dataString=tableObj.getElement().getAttribute('data-data')
if(dataString===null||dataString===undefined)
throw new Error('The required data-data attribute is not found on the table control element.')
this.data=JSON.parse(dataString)};Client.prototype=Object.create(BaseProto)
Client.prototype.constructor=Client
Client.prototype.dispose=function(){BaseProto.dispose.call(this)
this.data=null}
Client.prototype.getRecords=function(offset,count,onSuccess){if(!count){onSuccess(this.data,this.data.length)}
else{onSuccess(this.data.slice(offset,offset+count),this.data.length)}}
Client.prototype.createRecord=function(recordData,placement,relativeToKey,offset,count,onSuccess){if(placement==='bottom'){this.data.push(recordData)}
else if(placement=='above'||placement=='below'){var recordIndex=this.getIndexOfKey(relativeToKey)
if(placement=='below')
recordIndex++
this.data.splice(recordIndex,0,recordData)}
this.getRecords(offset,count,onSuccess)}
Client.prototype.updateRecord=function(key,recordData){var recordIndex=this.getIndexOfKey(key)
if(recordIndex!==-1){recordData[this.tableObj.options.keyColumn]=key
this.data[recordIndex]=recordData}
else{throw new Error('Record with they key '+key+' is not found in the data set')}}
Client.prototype.deleteRecord=function(key,newRecordData,offset,count,onSuccess){var recordIndex=this.getIndexOfKey(key)
if(recordIndex!==-1){this.data.splice(recordIndex,1)
if(this.data.length==0)
this.data.push(newRecordData)
this.getRecords(offset,count,onSuccess)}
else{throw new Error('Record with they key '+key+' is not found in the data set')}}
Client.prototype.getIndexOfKey=function(key){var keyColumn=this.tableObj.options.keyColumn
return this.data.map(function(record){return record[keyColumn]+""}).indexOf(key+"")}
Client.prototype.getAllData=function(){return this.data}
$.oc.table.datasource.client=Client}(window.jQuery);+function($){"use strict";if($.oc.table===undefined)
throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");if($.oc.table.datasource===undefined)
throw new Error("The $.oc.table.datasource namespace is not defined. Make sure that the table.datasource.base.js script is loaded.");var Base=$.oc.table.datasource.base,BaseProto=Base.prototype
var Server=function(tableObj){Base.call(this,tableObj)
var dataString=tableObj.getElement().getAttribute('data-data')
if(dataString===null||dataString===undefined)
throw new Error('The required data-data attribute is not found on the table control element.')
this.data=JSON.parse(dataString)};Server.prototype=Object.create(BaseProto)
Server.prototype.constructor=Server
Server.prototype.dispose=function(){BaseProto.dispose.call(this)
this.data=null}
Server.prototype.getRecords=function(offset,count,onSuccess){var handlerName=this.tableObj.getAlias()+'::onServerGetRecords'
this.tableObj.$el.request(handlerName,{data:{offset:offset,count:count}}).done(function(data){onSuccess(data.records,data.count)})}
Server.prototype.createRecord=function(recordData,placement,relativeToKey,offset,count,onSuccess){var handlerName=this.tableObj.getAlias()+'::onServerCreateRecord'
this.tableObj.$el.request(handlerName,{data:{recordData:recordData,placement:placement,relativeToKey:relativeToKey,offset:offset,count:count}}).done(function(data){onSuccess(data.records,data.count)})}
Server.prototype.updateRecord=function(key,recordData){var handlerName=this.tableObj.getAlias()+'::onServerUpdateRecord'
this.tableObj.$el.request(handlerName,{data:{key:key,recordData:recordData}})}
Server.prototype.deleteRecord=function(key,newRecordData,offset,count,onSuccess){var handlerName=this.tableObj.getAlias()+'::onServerDeleteRecord'
this.tableObj.$el.request(handlerName,{data:{key:key,offset:offset,count:count}}).done(function(data){onSuccess(data.records,data.count)})}
$.oc.table.datasource.server=Server}(window.jQuery);+function($){"use strict";if($.oc.table===undefined)
throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");if($.oc.table.processor===undefined)
$.oc.table.processor={}
var Base=function(tableObj,columnName,columnConfiguration){this.tableObj=tableObj
this.columnName=columnName
this.columnConfiguration=columnConfiguration
this.activeCell=null
this.validators=[]
this.registerHandlers()
this.initValidators()}
Base.prototype.dispose=function(){this.unregisterHandlers()
this.tableObj=null
this.activeCell=null}
Base.prototype.renderCell=function(value,cellContentContainer){}
Base.prototype.registerHandlers=function(){}
Base.prototype.unregisterHandlers=function(){}
Base.prototype.onFocus=function(cellElement,isClick){}
Base.prototype.onUnfocus=function(){}
Base.prototype.onKeyDown=function(ev){}
Base.prototype.onClick=function(ev){}
Base.prototype.onRowValueChanged=function(columnName,cellElement){}
Base.prototype.keyNavigationAllowed=function(ev,direction){return true}
Base.prototype.isCellFocusable=function(){return true}
Base.prototype.getCellContentContainer=function(cellElement){return cellElement.querySelector('.content-container')}
Base.prototype.createViewContainer=function(cellContentContainer,value){var viewContainer=document.createElement('div')
viewContainer.setAttribute('data-view-container','data-view-container')
viewContainer.textContent=value===undefined?'':value
cellContentContainer.appendChild(viewContainer)
return viewContainer}
Base.prototype.getViewContainer=function(cellElement){return cellElement.querySelector('[data-view-container]')}
Base.prototype.showViewContainer=function(cellElement){return this.getViewContainer(cellElement).setAttribute('class','')}
Base.prototype.hideViewContainer=function(cellElement){return this.getViewContainer(cellElement).setAttribute('class','hide')}
Base.prototype.setViewContainerValue=function(cellElement,value){return this.getViewContainer(cellElement).textContent=value}
Base.prototype.elementBelongsToProcessor=function(element){return false}
Base.prototype.initValidators=function(){if(this.columnConfiguration.validation===undefined)
return
for(var validatorName in this.columnConfiguration.validation){if($.oc.table.validator===undefined||$.oc.table.validator[validatorName]==undefined)
throw new Error('The table cell validator "'+validatorName+'" for the column "'+this.columnName+'" is not '+'found in the $.oc.table.validator namespace.')
var validator=new $.oc.table.validator[validatorName](this.columnConfiguration.validation[validatorName])
this.validators.push(validator)}}
Base.prototype.validate=function(value,rowData){for(var i=0,len=this.validators.length;i<len;i++){var message=this.validators[i].validate(value,rowData)
if(message!==undefined)
return message}}
$.oc.table.processor.base=Base}(window.jQuery);+function($){"use strict";if($.oc.table===undefined)
throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");if($.oc.table.processor===undefined)
throw new Error("The $.oc.table.processor namespace is not defined. Make sure that the table.processor.base.js script is loaded.");var Base=$.oc.table.processor.base,BaseProto=Base.prototype
var StringProcessor=function(tableObj,columnName,columnConfiguration){this.focusTimeoutHandler=this.onFocusTimeout.bind(this)
Base.call(this,tableObj,columnName,columnConfiguration)}
StringProcessor.prototype=Object.create(BaseProto)
StringProcessor.prototype.constructor=StringProcessor
StringProcessor.prototype.dispose=function(){BaseProto.dispose.call(this)
this.focusTimeoutHandler=null}
StringProcessor.prototype.renderCell=function(value,cellContentContainer){this.createViewContainer(cellContentContainer,value)}
StringProcessor.prototype.onFocus=function(cellElement,isClick){if(this.activeCell===cellElement)
return
this.activeCell=cellElement
this.buildEditor(cellElement,this.getCellContentContainer(cellElement))}
StringProcessor.prototype.onUnfocus=function(){if(!this.activeCell)
return
var editor=this.activeCell.querySelector('.string-input')
if(editor){this.tableObj.setCellValue(this.activeCell,editor.value)
this.setViewContainerValue(this.activeCell,editor.value)
editor.parentNode.removeChild(editor)}
this.showViewContainer(this.activeCell)
this.activeCell=null}
StringProcessor.prototype.buildEditor=function(cellElement,cellContentContainer){this.hideViewContainer(this.activeCell)
var input=document.createElement('input')
input.setAttribute('type','text')
input.setAttribute('class','string-input')
input.value=this.tableObj.getCellValue(cellElement)
if(this.columnConfiguration.readOnly){input.setAttribute('readonly',true)}
cellContentContainer.appendChild(input)
this.setCaretPosition(input,0)
window.setTimeout(this.focusTimeoutHandler,0)}
StringProcessor.prototype.keyNavigationAllowed=function(ev,direction){if(direction!='left'&&direction!='right')
return true
if(!this.activeCell)
return true
var editor=this.activeCell.querySelector('.string-input')
if(!editor)
return true
var caretPosition=this.getCaretPosition(editor)
if(direction=='left')
return caretPosition==0
if(direction=='right')
return caretPosition==editor.value.length
return true}
StringProcessor.prototype.onRowValueChanged=function(columnName,cellElement){if(columnName!=this.columnName){return}
var value=this.tableObj.getCellValue(cellElement)
this.setViewContainerValue(cellElement,value)}
StringProcessor.prototype.onFocusTimeout=function(){if(!this.activeCell)
return
var editor=this.activeCell.querySelector('.string-input')
if(!editor)
return
editor.focus()
this.setCaretPosition(editor,0)}
StringProcessor.prototype.getCaretPosition=function(input){if(document.selection){var selection=document.selection.createRange()
selection.moveStart('character',-input.value.length)
return selection.text.length}
if(input.selectionStart!==undefined)
return input.selectionStart
return 0}
StringProcessor.prototype.setCaretPosition=function(input,position){if(document.selection){var range=input.createTextRange()
setTimeout(function(){range.collapse(true)
range.moveStart("character",position)
range.moveEnd("character",0)
range.select()},0)}
if(input.selectionStart!==undefined){setTimeout(function(){input.selectionStart=position
input.selectionEnd=position},0)}
return 0}
$.oc.table.processor.string=StringProcessor;}(window.jQuery);+function($){"use strict";if($.oc.table===undefined)
throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");if($.oc.table.processor===undefined)
throw new Error("The $.oc.table.processor namespace is not defined. Make sure that the table.processor.base.js script is loaded.");var Base=$.oc.table.processor.base,BaseProto=Base.prototype
var CheckboxProcessor=function(tableObj,columnName,columnConfiguration){Base.call(this,tableObj,columnName,columnConfiguration)}
CheckboxProcessor.prototype=Object.create(BaseProto)
CheckboxProcessor.prototype.constructor=CheckboxProcessor
CheckboxProcessor.prototype.dispose=function(){BaseProto.dispose.call(this)}
CheckboxProcessor.prototype.isCellFocusable=function(){return false}
CheckboxProcessor.prototype.renderCell=function(value,cellContentContainer){var checkbox=document.createElement('div')
checkbox.setAttribute('data-checkbox-element','true')
checkbox.setAttribute('tabindex','0')
if(value&&value!=0&&value!="false"){checkbox.setAttribute('class','checked')}
cellContentContainer.appendChild(checkbox)}
CheckboxProcessor.prototype.onFocus=function(cellElement,isClick){cellElement.querySelector('div[data-checkbox-element]').focus()}
CheckboxProcessor.prototype.onKeyDown=function(ev){if(ev.keyCode==32)
this.onClick(ev)}
CheckboxProcessor.prototype.onClick=function(ev){var target=this.tableObj.getEventTarget(ev,'DIV')
if(target.getAttribute('data-checkbox-element')){var container=this.getCheckboxContainerNode(target)
if(container.getAttribute('data-column')!==this.columnName){return}
this.changeState(target)
$(ev.target).trigger('change')}}
CheckboxProcessor.prototype.changeState=function(divElement){var cell=divElement.parentNode.parentNode
if(divElement.getAttribute('class')=='checked'){divElement.setAttribute('class','')
this.tableObj.setCellValue(cell,0)}
else{divElement.setAttribute('class','checked')
this.tableObj.setCellValue(cell,1)}}
CheckboxProcessor.prototype.getCheckboxContainerNode=function(checkbox){return checkbox.parentNode.parentNode}
CheckboxProcessor.prototype.onRowValueChanged=function(columnName,cellElement){if(columnName!=this.columnName){return}
var checkbox=cellElement.querySelector('div[data-checkbox-element]'),value=this.tableObj.getCellValue(cellElement)
if(value&&value!=0&&value!="false"){checkbox.setAttribute('class','checked')}
else{checkbox.setAttribute('class','')}}
$.oc.table.processor.checkbox=CheckboxProcessor;}(window.jQuery);+function($){"use strict";if($.oc.table===undefined)
throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");if($.oc.table.processor===undefined)
throw new Error("The $.oc.table.processor namespace is not defined. Make sure that the table.processor.base.js script is loaded.");var Base=$.oc.table.processor.base,BaseProto=Base.prototype
var DropdownProcessor=function(tableObj,columnName,columnConfiguration){this.itemListElement=null
this.cachedOptionPromises={}
this.itemClickHandler=this.onItemClick.bind(this)
this.itemKeyDownHandler=this.onItemKeyDown.bind(this)
Base.call(this,tableObj,columnName,columnConfiguration)}
DropdownProcessor.prototype=Object.create(BaseProto)
DropdownProcessor.prototype.constructor=DropdownProcessor
DropdownProcessor.prototype.dispose=function(){this.unregisterListHandlers()
this.itemClickHandler=null
this.itemKeyDownHandler=null
this.itemListElement=null
this.cachedOptionPromises=null
BaseProto.dispose.call(this)}
DropdownProcessor.prototype.unregisterListHandlers=function(){if(this.itemListElement)
{this.itemListElement.removeEventListener('click',this.itemClickHandler)
this.itemListElement.removeEventListener('keydown',this.itemKeyDownHandler)}}
DropdownProcessor.prototype.renderCell=function(value,cellContentContainer){var viewContainer=this.createViewContainer(cellContentContainer,'...')
this.fetchOptions(cellContentContainer.parentNode,function renderCellFetchOptions(options){if(options[value]!==undefined)
viewContainer.textContent=options[value]
cellContentContainer.setAttribute('tabindex',0)})}
DropdownProcessor.prototype.onFocus=function(cellElement,isClick){if(this.activeCell===cellElement){this.showDropdown()
return}
this.activeCell=cellElement
var cellContentContainer=this.getCellContentContainer(cellElement)
this.buildEditor(cellElement,cellContentContainer,isClick)
if(!isClick)
cellContentContainer.focus()}
DropdownProcessor.prototype.onUnfocus=function(){if(!this.activeCell)
return
this.unregisterListHandlers()
this.hideDropdown()
this.itemListElement=null
this.activeCell=null}
DropdownProcessor.prototype.buildEditor=function(cellElement,cellContentContainer,isClick){var currentValue=this.tableObj.getCellValue(cellElement),containerPosition=this.getAbsolutePosition(cellContentContainer)
self=this
this.itemListElement=document.createElement('div')
this.itemListElement.addEventListener('click',this.itemClickHandler)
this.itemListElement.addEventListener('keydown',this.itemKeyDownHandler)
this.itemListElement.setAttribute('class','table-control-dropdown-list')
this.itemListElement.style.width=cellContentContainer.offsetWidth+'px'
this.itemListElement.style.left=containerPosition.left+'px'
this.itemListElement.style.top=containerPosition.top-2+cellContentContainer.offsetHeight+'px'
this.fetchOptions(cellElement,function renderCellFetchOptions(options){var listElement=document.createElement('ul')
for(var value in options){var itemElement=document.createElement('li')
itemElement.setAttribute('data-value',value)
itemElement.textContent=options[value]
itemElement.setAttribute('tabindex',0)
if(value==currentValue)
itemElement.setAttribute('class','selected')
listElement.appendChild(itemElement)}
self.itemListElement.appendChild(listElement)
if(isClick)
self.showDropdown()
self=null})}
DropdownProcessor.prototype.hideDropdown=function(){if(this.itemListElement&&this.activeCell&&this.itemListElement.parentNode){var cellContentContainer=this.getCellContentContainer(this.activeCell)
cellContentContainer.setAttribute('data-dropdown-open','false')
this.itemListElement.parentNode.removeChild(this.itemListElement)
cellContentContainer.focus()}}
DropdownProcessor.prototype.showDropdown=function(){if(this.itemListElement&&this.itemListElement.parentNode!==document.body){this.getCellContentContainer(this.activeCell).setAttribute('data-dropdown-open','true')
document.body.appendChild(this.itemListElement)
var activeItemElement=this.itemListElement.querySelector('ul li.selected')
if(!activeItemElement){activeItemElement=this.itemListElement.querySelector('ul li:first-child')
if(activeItemElement)
activeItemElement.setAttribute('class','selected')}
if(activeItemElement){window.setTimeout(function(){activeItemElement.focus()},0)}}}
DropdownProcessor.prototype.fetchOptions=function(cellElement,onSuccess){if(this.columnConfiguration.options){onSuccess(this.columnConfiguration.options)}
else{var row=cellElement.parentNode,cachingKey=this.createOptionsCachingKey(row),viewContainer=this.getViewContainer(cellElement)
viewContainer.setAttribute('class','loading')
if(!this.cachedOptionPromises[cachingKey]){var requestData={column:this.columnName,rowData:this.tableObj.getRowData(row)},handlerName=this.tableObj.getAlias()+'::onGetDropdownOptions'
this.cachedOptionPromises[cachingKey]=this.tableObj.$el.request(handlerName,{data:requestData})}
this.cachedOptionPromises[cachingKey].done(function onDropDownLoadOptionsSuccess(data){onSuccess(data.options)}).always(function onDropDownLoadOptionsAlways(){viewContainer.setAttribute('class','')})}}
DropdownProcessor.prototype.createOptionsCachingKey=function(row){var cachingKey='non-dependent',dependsOn=this.columnConfiguration.dependsOn
if(dependsOn){if(typeof dependsOn=='object'){for(var i=0,len=dependsOn.length;i<len;i++)
cachingKey+=dependsOn[i]+this.tableObj.getRowCellValueByColumnName(row,dependsOn[i])}else
cachingKey=dependsOn+this.tableObj.getRowCellValueByColumnName(row,dependsOn)}
return cachingKey}
DropdownProcessor.prototype.getAbsolutePosition=function(element){var top=document.body.scrollTop,left=0
do{top+=element.offsetTop||0;top-=element.scrollTop||0;left+=element.offsetLeft||0;element=element.offsetParent;}while(element)
return{top:top,left:left}}
DropdownProcessor.prototype.updateCellFromSelectedItem=function(selectedItem){this.tableObj.setCellValue(this.activeCell,selectedItem.getAttribute('data-value'))
this.setViewContainerValue(this.activeCell,selectedItem.textContent)}
DropdownProcessor.prototype.findSelectedItem=function(){if(this.itemListElement)
return this.itemListElement.querySelector('ul li.selected')
return null}
DropdownProcessor.prototype.onItemClick=function(ev){var target=this.tableObj.getEventTarget(ev)
if(target.tagName=='LI'){this.updateCellFromSelectedItem(target)
var selected=this.findSelectedItem()
if(selected)
selected.setAttribute('class','')
target.setAttribute('class','selected')
this.hideDropdown()}}
DropdownProcessor.prototype.onItemKeyDown=function(ev){if(!this.itemListElement)
return
if(ev.keyCode==40||ev.keyCode==38)
{var selected=this.findSelectedItem(),newSelectedItem=selected.nextElementSibling
if(ev.keyCode==38)
newSelectedItem=selected.previousElementSibling
if(newSelectedItem){selected.setAttribute('class','')
newSelectedItem.setAttribute('class','selected')
newSelectedItem.focus()}
return}
if(ev.keyCode==13||ev.keyCode==32){this.updateCellFromSelectedItem(this.findSelectedItem())
this.hideDropdown()
return}
if(ev.keyCode==9){this.updateCellFromSelectedItem(this.findSelectedItem())
this.tableObj.navigation.navigateNext(ev)
this.tableObj.stopEvent(ev)}
if(ev.keyCode==27){this.hideDropdown()}}
DropdownProcessor.prototype.onKeyDown=function(ev){if(ev.keyCode==32)
this.showDropdown()}
DropdownProcessor.prototype.onRowValueChanged=function(columnName,cellElement){if(!this.columnConfiguration.dependsOn)
return
var dependsOnColumn=false,dependsOn=this.columnConfiguration.dependsOn
if(typeof dependsOn=='object'){for(var i=0,len=dependsOn.length;i<len;i++){if(dependsOn[i]==columnName){dependsOnColumn=true
break}}}
else{dependsOnColumn=dependsOn==columnName}
if(!dependsOnColumn)
return
var currentValue=this.tableObj.getCellValue(cellElement),viewContainer=this.getViewContainer(cellElement)
this.fetchOptions(cellElement,function rowValueChangedFetchOptions(options){var value=options[currentValue]!==undefined?options[currentValue]:'...'
viewContainer.textContent=value
viewContainer=null})}
DropdownProcessor.prototype.elementBelongsToProcessor=function(element){if(!this.itemListElement)
return false
return this.tableObj.parentContainsElement(this.itemListElement,element)}
$.oc.table.processor.dropdown=DropdownProcessor;}(window.jQuery);+function($){"use strict";if($.oc.table===undefined)
throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");if($.oc.table.processor===undefined)
throw new Error("The $.oc.table.processor namespace is not defined. Make sure that the table.processor.base.js script is loaded.");var Base=$.oc.table.processor.string,BaseProto=Base.prototype
var AutocompleteProcessor=function(tableObj,columnName,columnConfiguration){this.cachedOptionPromises={}
Base.call(this,tableObj,columnName,columnConfiguration)}
AutocompleteProcessor.prototype=Object.create(BaseProto)
AutocompleteProcessor.prototype.constructor=AutocompleteProcessor
AutocompleteProcessor.prototype.dispose=function(){this.cachedOptionPromises=null
BaseProto.dispose.call(this)}
AutocompleteProcessor.prototype.onUnfocus=function(){if(!this.activeCell)
return
this.removeAutocomplete()
BaseProto.onUnfocus.call(this)}
AutocompleteProcessor.prototype.renderCell=function(value,cellContentContainer){BaseProto.renderCell.call(this,value,cellContentContainer)}
AutocompleteProcessor.prototype.buildEditor=function(cellElement,cellContentContainer,isClick){BaseProto.buildEditor.call(this,cellElement,cellContentContainer,isClick)
var self=this
this.fetchOptions(cellElement,function autocompleteFetchOptions(options){self.buildAutoComplete(options)
self=null})}
AutocompleteProcessor.prototype.fetchOptions=function(cellElement,onSuccess){if(this.columnConfiguration.options){if(onSuccess!==undefined){onSuccess(this.columnConfiguration.options)}}else{if(this.triggerGetOptions(onSuccess)===false){return}
var row=cellElement.parentNode,cachingKey=this.createOptionsCachingKey(row),viewContainer=this.getViewContainer(cellElement)
$.oc.foundation.element.addClass(viewContainer,'loading')
if(!this.cachedOptionPromises[cachingKey]){var requestData={column:this.columnName,rowData:this.tableObj.getRowData(row)},handlerName=this.tableObj.getAlias()+'::onGetAutocompleteOptions'
this.cachedOptionPromises[cachingKey]=this.tableObj.$el.request(handlerName,{data:requestData})}
this.cachedOptionPromises[cachingKey].done(function onAutocompleteLoadOptionsSuccess(data){if(onSuccess!==undefined){onSuccess(data.options)}}).always(function onAutocompleteLoadOptionsAlways(){$.oc.foundation.element.removeClass(viewContainer,'loading')})}}
AutocompleteProcessor.prototype.createOptionsCachingKey=function(row){var cachingKey='non-dependent',dependsOn=this.columnConfiguration.dependsOn
if(dependsOn){if(typeof dependsOn=='object'){for(var i=0,len=dependsOn.length;i<len;i++)
cachingKey+=dependsOn[i]+this.tableObj.getRowCellValueByColumnName(row,dependsOn[i])}else
cachingKey=dependsOn+this.tableObj.getRowCellValueByColumnName(row,dependsOn)}
return cachingKey}
AutocompleteProcessor.prototype.triggerGetOptions=function(callback){var tableElement=this.tableObj.getElement()
if(!tableElement){return}
var optionsEvent=$.Event('autocompleteitems.oc.table'),values={}
$(tableElement).trigger(optionsEvent,[{values:values,callback:callback,column:this.columnName,columnConfiguration:this.columnConfiguration}])
if(optionsEvent.isDefaultPrevented()){return false}
return true}
AutocompleteProcessor.prototype.getInput=function(){if(!this.activeCell){return null}
return this.activeCell.querySelector('.string-input')}
AutocompleteProcessor.prototype.buildAutoComplete=function(items){if(!this.activeCell){return}
var input=this.getInput()
if(!input){return}
if(items===undefined){items=[]}
$(input).autocomplete({source:this.prepareItems(items),matchWidth:true,menu:'<ul class="autocomplete dropdown-menu table-widget-autocomplete"></ul>',bodyContainer:true})}
AutocompleteProcessor.prototype.prepareItems=function(items){var result={}
if($.isArray(items)){for(var i=0,len=items.length;i<len;i++){result[items[i]]=items[i]}}
else{result=items}
return result}
AutocompleteProcessor.prototype.removeAutocomplete=function(){var input=this.getInput()
$(input).autocomplete('destroy')}
$.oc.table.processor.autocomplete=AutocompleteProcessor;}(window.jQuery);+function($){"use strict";if($.oc.table===undefined)
throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");if($.oc.table.validator===undefined)
$.oc.table.validator={}
var Base=function(options){this.options=options}
Base.prototype.validate=function(value,rowData){if(this.options.requiredWith!==undefined&&!this.rowHasValue(this.options.requiredWith,rowData))
return
return this.validateValue(value,rowData)}
Base.prototype.validateValue=function(value,rowData){}
Base.prototype.trim=function(value){if(String.prototype.trim)
return value.trim()
return value.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,'')}
Base.prototype.getMessage=function(defaultValue){if(this.options.message!==undefined)
return this.options.message
return defaultValue}
Base.prototype.rowHasValue=function(columnName,rowData){if(rowData[columnName]===undefined)
return false
if(typeof rowData[columnName]=='boolean')
return rowData[columnName]
var value=this.trim(String(rowData[columnName]))
return value.length>0}
$.oc.table.validator.base=Base;}(window.jQuery);+function($){"use strict";if($.oc.table===undefined)
throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");if($.oc.table.validator===undefined)
throw new Error("The $.oc.table.validator namespace is not defined. Make sure that the table.validator.base.js script is loaded.");var Base=$.oc.table.validator.base,BaseProto=Base.prototype
var Required=function(options){Base.call(this,options)};Required.prototype=Object.create(BaseProto)
Required.prototype.constructor=Required
Required.prototype.validateValue=function(value,rowData){value=this.trim(value)
if(value.length===0)
return this.getMessage("The value should not be empty.")
return}
$.oc.table.validator.required=Required}(window.jQuery);+function($){"use strict";if($.oc.table===undefined)
throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");if($.oc.table.validator===undefined)
throw new Error("The $.oc.table.validator namespace is not defined. Make sure that the table.validator.base.js script is loaded.");var Base=$.oc.table.validator.base,BaseProto=Base.prototype
var BaseNumber=function(options){Base.call(this,options)};BaseNumber.prototype=Object.create(BaseProto)
BaseNumber.prototype.constructor=BaseNumber
BaseNumber.prototype.doCommonChecks=function(value){if(this.options.min!==undefined||this.options.max!==undefined){if(this.options.min!==undefined){if(this.options.min.value===undefined)
throw new Error('The min.value parameter is not defined in the table validator configuration')
if(value<this.options.min.value){return this.options.min.message!==undefined?this.options.min.message:"The value should not be less than "+this.options.min.value}}
if(this.options.max!==undefined){if(this.options.max.value===undefined)
throw new Error('The max.value parameter is not defined in the table validator configuration')
if(value>this.options.max.value){return this.options.max.message!==undefined?this.options.max.message:"The value should not be more than "+this.options.max.value}}}
return}
$.oc.table.validator.baseNumber=BaseNumber}(window.jQuery);+function($){"use strict";if($.oc.table===undefined)
throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");if($.oc.table.validator===undefined)
throw new Error("The $.oc.table.validator namespace is not defined. Make sure that the table.validator.base.js script is loaded.");if($.oc.table.validator.baseNumber===undefined)
throw new Error("The $.oc.table.validator.baseNumber namespace is not defined. Make sure that the table.validator.baseNumber.js script is loaded.");var Base=$.oc.table.validator.baseNumber,BaseProto=Base.prototype
var Integer=function(options){Base.call(this,options)};Integer.prototype=Object.create(BaseProto)
Integer.prototype.constructor=Integer
Integer.prototype.validateValue=function(value,rowData){value=this.trim(value)
if(value.length==0)
return
var testResult=this.options.allowNegative?/^\-?[0-9]*$/.test(value):/^[0-9]*$/.test(value)
if(!testResult){var defaultMessage=this.options.allowNegative?'The value should be an integer.':'The value should be a positive integer';return this.getMessage(defaultMessage)}
return this.doCommonChecks(parseInt(value))}
$.oc.table.validator.integer=Integer}(window.jQuery);+function($){"use strict";if($.oc.table===undefined)
throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");if($.oc.table.validator===undefined)
throw new Error("The $.oc.table.validator namespace is not defined. Make sure that the table.validator.base.js script is loaded.");if($.oc.table.validator.baseNumber===undefined)
throw new Error("The $.oc.table.validator.baseNumber namespace is not defined. Make sure that the table.validator.baseNumber.js script is loaded.");var Base=$.oc.table.validator.baseNumber,BaseProto=Base.prototype
var Float=function(options){Base.call(this,options)};Float.prototype=Object.create(BaseProto)
Float.prototype.constructor=Float
Float.prototype.validateValue=function(value,rowData){value=this.trim(value)
if(value.length==0)
return
var testResult=this.options.allowNegative?/^[-]?([0-9]+\.[0-9]+|[0-9]+)$/.test(value):/^([0-9]+\.[0-9]+|[0-9]+)$/.test(value)
if(!testResult){var defaultMessage=this.options.allowNegative?'The value should be a floating point number.':'The value should be a positive floating point number';return this.getMessage(defaultMessage)}
return this.doCommonChecks(parseFloat(value))}
$.oc.table.validator.float=Float}(window.jQuery);+function($){"use strict";if($.oc.table===undefined)
throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");if($.oc.table.validator===undefined)
throw new Error("The $.oc.table.validator namespace is not defined. Make sure that the table.validator.base.js script is loaded.");var Base=$.oc.table.validator.base,BaseProto=Base.prototype
var Length=function(options){Base.call(this,options)};Length.prototype=Object.create(BaseProto)
Length.prototype.constructor=Length
Length.prototype.validateValue=function(value,rowData){value=this.trim(value)
if(value.length==0)
return
if(this.options.min!==undefined||this.options.max!==undefined){if(this.options.min!==undefined){if(this.options.min.value===undefined)
throw new Error('The min.value parameter is not defined in the Length table validator configuration')
if(value.length<this.options.min.value){return this.options.min.message!==undefined?this.options.min.message:"The string should not be shorter than "+this.options.min.value}}
if(this.options.max!==undefined){if(this.options.max.value===undefined)
throw new Error('The max.value parameter is not defined in the Length table validator configuration')
if(value.length>this.options.max.value){return this.options.max.message!==undefined?this.options.max.message:"The string should not be longer than "+this.options.max.value}}}
return}
$.oc.table.validator.length=Length}(window.jQuery);+function($){"use strict";if($.oc.table===undefined)
throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");if($.oc.table.validator===undefined)
throw new Error("The $.oc.table.validator namespace is not defined. Make sure that the table.validator.base.js script is loaded.");var Base=$.oc.table.validator.base,BaseProto=Base.prototype
var Regex=function(options){Base.call(this,options)};Regex.prototype=Object.create(BaseProto)
Regex.prototype.constructor=Regex
Regex.prototype.validateValue=function(value,rowData){value=this.trim(value)
if(value.length==0)
return
if(this.options.pattern===undefined)
throw new Error('The pattern parameter is not defined in the Regex table validator configuration')
var regexObj=new RegExp(this.options.pattern,this.options.modifiers)
if(!regexObj.test(value))
return this.getMessage("Invalid value format.")
return}
$.oc.table.validator.regex=Regex}(window.jQuery);