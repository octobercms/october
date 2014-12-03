# Client-side table widget (table.xxx.js)

## Code organization

### OOP pattern

The data source and cell processor JavaScript classes use the simple parasitic combination inheritance pattern described here:

- http://javascriptissexy.com/oop-in-javascript-what-you-need-to-know/
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript

```

// Parent class with a method
var SuperClass = function(params) {}
SuperClass.prototype.someMethod = function() {}

// Child class
var SubClass = function(params) {
    // Call the parent constructor
    SuperClass.call(this, params)
}

SubClass.prototype = Object.create(SuperClass.prototype)
SubClass.prototype.constructor = SubClass

// Child class methods can be defined only after the prototype
// is updated in the two previous lines

SubClass.prototype.someMethod = function() {
    // Call the parent method
    SuperClass.prototype.someMethod.call(this)
};

```

### Namespaces

All classes for the table widget are be defined in the **$.oc.table** namespace. There are several namespaces in this namespace:

- **$.oc.table.processor** - cell processors
- **$.oc.table.datasource** - data sources
- **$.oc.table.helper** - helper classes

### Client-side performance and memory usage considerations

The classes defined for the Table widget should follow the best practices in order to achieve the high performance and avoid memory leaks:

* All references to JavaScript objects and DOM elements should be cleared with the `dispose()` methods.
* All event handlers registered in the control should be unregistered with the `dispose()` method.
* DOM manipulations should only be performed in the detached tree with the `DocumentFragment` objects.
* The number of registered event handlers should be kept as low as possible. Cell processors should rely to delegated events registered for the table.
* Cell processors should have the `dispose()` method that unregisters the event handlers and does all required cleanup actions.
* Do not use closures for event handlers. This gives more control over the variable scope and simplifies the cleanup operations.
* If closures are used for anything, use named closures to simplify the profiling process with Chrome dev tools.

There are several articles that provide a good insight into the high performance JavaScript code and efficient memory management:

* http://www.smashingmagazine.com/2012/11/05/writing-fast-memory-efficient-javascript/
* http://www.toptal.com/javascript/javascript-prototypes-scopes-and-performance-what-you-need-to-know
* http://developer.nokia.com/community/wiki/JavaScript_Performance_Best_Practices (the suggestion about the code comments is doubtful as JS engines compile code now).

## Widget usage

Any `DIV` elements that have the `data-control="table"` attributes are automatically picked up by the control.

```
<div data=control="table" data-columns="{...}"></div>
```

### Options

The options below are listed in the JavaScript notation. Corresponding data attributes would look like `data-client-data-source-class`. 

- `clientDataSourceСlass` (default is **client**)- specifies the client-side data source class. There are two data source classes supported on the client side - **client** and **server**.
- `data` - specifies the data in JSON format for the **client**.
- `recordsPerPage` - specifies how many records per page to display. If the value is not defined or `false` or `null`, the pagination feature is disabled and all records are displayed. Pagination and `rowSorting` cannot be used in the same time.
- `columns` - column definitions in JSON format, see the server-side column definition format below.
- `rowSorting` - enables the drag & drop row sorting. The sorting cannot be used with the pagination (`recordsPerPage` is not `null` or `false`).

## Client-side helper classes

Some auxiliary code is factored out from the table class to helper classes. The helper classes are defined in the **$.oc.table.helper** namespace.

- **table.helper.navigation.js** - implements the keyboard navigation within the table and pagination.

## Data sources ($.oc.table.datasource)

### Adding and removing records

Adding and removing records is an asynchronous process that involves updating records in the dataset.

When a user adds a record, the table object calls the `addRecord(data, offset, count, onSuccess)` method of the data source. The data source adds an empty record to the underlying data set and calls the `onSuccess` callback parameter passed to the method. In the `onSuccess` handler the table object rebuilds the table and focuses a field in the new row.

When user deletes a record, the table object calls the `deleteRecord(index, offset, count, onSuccess)` method of the data source. The data source removes the record from the underlying dataset and calls the `onSuccess` callback parameter, passing records of the current page (determined with the `offset` and `count` parameters) to the callback.

The `onSuccess` callback parameters are: data (records), count.

### Client memory data source ($.oc.table.datasource.client)

The client memory data sources keeps the data in the client memory. The data is loaded from the control element's `data` property (`data-data` attribute) and posted back with the form data.

### Server memory data source ($.oc.table.datasource.server)

**TODO:** document this 

## Cell processors ($.oc.table.processor)

Cell processors are responsible for rendering the cell content, creating the cell data editors and updating the cell value in the grid control. There is a single cell processor per the table column. All rows in a specific column are handled with a same cell processor.

Cell processors should use the table's `setCellValue()` method to update the value in the table. The table class, in turn, will commit the changes to the data source when the user navigates to another row, on the pagination event, search or form submit. The `setCellValue()` should be the only way to update the table data by cell processors.

Cell processors should register delegated events to detect user's interaction with the cells they responsible for. The processors should unregister any event handlers in the `dispose()` method. The even handlers should be registered for the widgwet's top element, not for the table, as the table could be rebuilt completely on pagination, search, and other cases. The `click` and `keydown` events are dispatched to cell processors by the table class automatically and don't require extra handlers.

### Removing editors from the table

The table keeps a reference to the currently active cell processor. The cell processor objects have the `activeCell` property that is a reference to the cell which currently has an editor. The table calls the `hideEditor()` method of the active cell processor and the cell processor removes the editor from the active cell.

### Showing editors

The table object calls the `onFocus()` method of the cell processors when a cell is clicked or navigated (with the keyboard). The cell processor can build a cell editor when this method is called, if it's required.

### Drop-down cell processor

The drop-down column type can load options from the column configuration or with AJAX. Example column configuration:

    color:
        title: Color
        type: dropdown
        options:
            red: Red
            green: Green
            blue: Blue
        width: 15%

If the `options` element is not presented in the configuration, the options will be loaded with AJAX. 

**TODO:** Document the AJAX interface

**TODO:** Plan the option caching. Requirements:
 - a) options could depend on other values in the current row. 
 - b) options could always be cached regardless of other values in the row.

# Server-side table widget (Backend\Widgets\Table)

## Column definitions

Columns are defined as array with the `columns` property. The array keys correspond the column identifiers. The array elements are associative arrays with the following keys:

- `title`
- `type` (string, checkbox, dropdown, autocomplete)
- `width` - sets the column width, can be specified in percents (10%) or pixels (50px). There could be a single column without the width specified. It will be stretched to take the available space.
- `readonly`
- `options` (for drop-down elements and autocomplete types)