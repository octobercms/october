# Tab control

This plugin is a wrapper for the Twitter Bootstrap Tab component. It provides the following features:

- Adding tabs
- Optional close icons with 2 states (modified / unmodified). The icon state can be changed by triggering the modified.oc.tab/unmodified.oc.tab events on any element within tab, or on the tab itself.
- Removing tabs with the Close icon, or with triggering an event from inside a tab pane or tab. The removing can be canceled if the confirm.oc.tab event handler returns false.
- Scrolling tabs if they do not fit the screen
- Collapsible tabs

### Supported CSS modifiers

These modifiers can be added in addition to the `control-tabs` class:

- **tabs-inset**: Applies a negative margin to the tabs allowing them to sit well inside a padded container.
- **tabs-offset**: Applies a positive padding to tabs so they sit well inside a flush (non padded) container.
- **tabs-flush**: Tabs to sit flush to the element above it.

### Master tabs

    <div class="control-tabs master-tabs" data-control="tab">
        <ul class="nav nav-tabs">
            <li class="active"><a href="#primaryTabOne">One</a></li>
            <li><a href="#primaryTabTwo">Two</a></li>
            <li><a href="#primaryTabThree">Three</a></li>
        </ul>
        <div class="tab-content">
            <div class="tab-pane active">
                Tab one content
            </div>
            <div class="tab-pane">
                Tab two content
            </div>
            <div class="tab-pane">
                Tab three content
            </div>
        </div>
    </div>

### Primary tabs

    <div class="control-tabs primary-tabs" data-control="tab">
        <ul class="nav nav-tabs">
            <li class="active"><a href="#primaryTabOne">One</a></li>
            <li><a href="#primaryTabTwo">Two</a></li>
            <li><a href="#primaryTabThree">Three</a></li>
        </ul>
        <div class="tab-content">
            <div class="tab-pane active">
                Tab one content
            </div>
            <div class="tab-pane">
                Tab two content
            </div>
            <div class="tab-pane">
                Tab three content
            </div>
        </div>
    </div>

> **Note**: Primary tabs in the October back-end are inset by default and you should use `.tabs-no-inset` to disable this.

### Secondary tabs

    <div class="control-tabs secondary-tabs" data-control="tab">
        <ul class="nav nav-tabs">
            <li class="active"><a href="#secondaryTabOne">One</a></li>
            <li><a href="#secondaryTabTwo">Two</a></li>
            <li><a href="#secondaryTabThree">Three</a></li>
        </ul>
        <div class="tab-content">
            <div class="tab-pane active">
                Tab one content
            </div>
            <div class="tab-pane">
                Tab two content
            </div>
            <div class="tab-pane">
                Tab three content
            </div>
        </div>
    </div>

### Content tabs

    <div class="control-tabs content-tabs" data-control="tab">
        <ul class="nav nav-tabs">
            <li class="active"><a href="#contentTabOne">One</a></li>
            <li><a href="#contentTabTwo">Two</a></li>
            <li><a href="#contentTabThree">Three</a></li>
        </ul>
        <div class="tab-content">
            <div class="tab-pane active">
                Tab one content
            </div>
            <div class="tab-pane">
                Tab two content
            </div>
            <div class="tab-pane">
                Tab three content
            </div>
        </div>
    </div>


### Supported data attributes:

- data-control="tab" - creates the tab control from an element
- data-closable - enables the Close Tab feature
- data-pane-classes - a list of CSS classes to apply new pane elements

Example with data attributes (data-control="tab"):

    <div class="control-tabs master" data-control="tab" data-closable>
        <ul class="nav nav-tabs">
            <li class="active"><a href="#home">Home</a></li>
        </ul>
        <div class="tab-content">
            <div class="tab-pane active">Home</div>
        </div>
    </div>

### JavaScript API:

- $('#mytabs').ocTab({closable: true, closeConfirmation: 'Do you really want to close this tab? Unsaved data will be lost.'})
- $('#mytabs').ocTab('addTab', 'Tab title', 'Tab content', identifier) - adds tab. The optional identifier parameter allows to associate a identifier with a tab. The identifier can be used with the goTo() method to find and open a tab by it's identifier.
- $('#mytabs').ocTab('closeTab', '.nav-tabs > li.active', true) - closes a tab. The second argument can point to a tab or tab pane. The thrid argument determines whether the tab should be closed without the user confirmation. The default value is false.
- $('.nav-tabs > li.active').trigger('close.oc.tab') - another way to close a tab. The event can be triggered on a tab, tab pane or any element inside a tab or tab pane.
- $('#mytabs').ocTab('modifyTab', '.nav-tabs > li.active') - marks a tab as modified. Use the 'unmodifyTab' to mark a tab as unmodified.
- $('.nav-tabs > li.active').trigger('modified.oc.tab') - another way to mark a tab as modified. The event can be triggered on a tab, tab pane or any element inside a tab or tab pane. Use the 'unmodified.oc.tab' to mark a tab as unmodified.
- $('#mytabs').ocTab('goTo', 'someidentifier') - Finds a tab by it's identifier and opens it.
- $('#mytabs').ocTab('goToPane', '.tab-content .tab-pane:first') - Opens a tab in context of it's content (pane element)

### Supported options:

 - closable - adds the "close" icon to the tab and lets users to close tabs. Corresponds the data-closable attribute.
 - closeConfirmation - a confirmation to show when a user tries to close a modified tab. Corresponds the data-close-confirmation 
   attribute. The confirmation is displayed only if the tab was modified.
 - slidable - allows the tabs to be switched with the swipe gesture on touch devices. Corresponds the data-slidable attribute.
 - paneClasses - a list of CSS classes to apply new pane elements. Corresponds to the data-pane-classes attribute.
 - maxTitleSymbols - the maximum number of characters in tab titles.
 - titleAsFileNames - treat tab titles as file names. In this mode only the file name part is displayed in the tab, and the directory part
   is hidden.

### Supported events:

- beforeClose.oc.tab - triggered on a tab pane element before tab is closed by the user. Call the event's 
  preventDefault() method to cancel the action.
- afterAllClosed.oc.tab - triggered after all tabs have been closed
