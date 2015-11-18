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
- **$.oc.table.validator** - validation classes

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
- `keyColumn` - specifies the name of the key column. The default value is **id**. 
- `postback` - post the client-memory data source data to the server automatically when the parent form gets submitted. The default value is `true`. The option is used only with client-memory data sources. When enabled, the data source data  is available in the widget's server-side data source: `$table->getDataSource()->getRecords();` The data postback occurs only of the request handler name matches the `postbackHandlerName` option value.
- `postbackHandlerName` - AJAX data handler name for the automatic data postback. The data will be posted only when the AJAX request posts data matching this handler name. The default value is **onSave**.
- `adding` - determines whether users can add new records. Default value is **true**.
- `deleting` - determines whether users can delete records. Default value is **true**.
- `toolbar` - determines whether the toolbar is visible. The default value is **true**.
- `height` - specifies the maximum height of the data table  (not including the header, toolbar and pagination). If the table contains more rows than the height could fit, the data table becomes scrollable. The default value is **false** (height is not limited).

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

The drop-down options could depend on other columns. This works only with AJAX-based drop-downs. The column a drop-down depends on are defined with the `dependsOn` property:

    state:
        title: State
        type: dropdown
        dependsOn: country

Multiple fields are allowed as well: 

    state:
        title: State
        type: dropdown
        dependsOn: [country, language]

**Note:** Dependent drop-down should always be defined after their master columns.

### Autocomplete cell processor

The autocomplete column type can load options from the column configuration or with AJAX. Example column configuration:

    color:
        title: Color
        type: autocomplete
        options:
            red: Red
            green: Green
            blue: Blue

If the `options` element is not presented in the configuration, the options will be loaded with AJAX. 

**TODO:** Document the AJAX interface

The editor can have the `dependsOn` property similar to the drop-down editor.

# Server-side table widget (Backend\Widgets\Table)

## Configuration

The widget is configured with YAML file. Required parameters:

* `columns` - the columns definitions, see below.
* `dataSource` - The data source class. Should specify the full qualified data source class name or alias. See the data source aliases below.
* `keyFrom` - name of the key column. The default value is **id**.
* `recordsPerPage` - number of records per page. If not specified, the pagination will be disabled.
* `postbackHandlerName` - AJAX data handler name for the automatic data postback. The data will be posted only when the AJAX requests posts data to this handler. The default value is **onSave**. This parameter is applicable only with client-memory data sources.
* `adding` - indicates if record deleting is allowed, default is **true**.
* `deleting` - indicates if record deleting is allowed, default is **true**.
* `toolbar` - specifies if the toolbar should be visible, default is **true**.
* `height` - specifies the data table height, in pixels. The default value is **false** - the height is not limited.
* `dynamicHeight` - determines if the `height` parameter should work as a max height. When this option is enabled and the table height is less than the `height` value, it won't be scrollable.

The `dataSource` parameter can take aliases for some data source classes for the simpler configuration syntax. Known aliases are:

* `client` = \Backend\Classes\TableClientMemoryDataSource

### Column definitions

Columns are defined as array with the `columns` property. The array keys correspond the column identifiers. The array elements are associative arrays with the following keys:

- `title`
- `type` (string, checkbox, dropdown, autocomplete)
- `width` - sets the column width, can be specified in percents (10%) or pixels (50px). There could be a single column without width specified, it will be stretched to take the available space.
- `readOnly`
- `options` (for drop-down elements and autocomplete types)
- `dependsOn` (from drop-down elements)
- validation - defines the column client-side validation rules. See the **Client-side validation** section below.

## Events 

### table.getDropdownOptions

table.getDropdownOptions - triggered when drop-down options are requested by the client. Parameters: 

- `$columnName` - specifies the drop-down column name.
- `$rowData` - an array containing values of all columns in the table row.

Example event handler:

```
$table->bindEvent('table.getDropdownOptions', 
    function ($columnName, $rowData) {
        if ($columnName == 'state')
            return ['ca'=>'California', 'wa'=>'Washington'];
        ...
    }
);
```

## Initializing the data

After the table widget is created, its data source optionally could be filled with records. Example code:

```
$table = new Table($this, $config);
$dataSource = $table->getDataSource();

$records = [
    ['id'=>1, 'first_name'=>'John', 'last_name'=>'Smith'],
    ['id'=>2, 'last_name'=>'John', 'last_name'=>'Doe']
];

$dataSource->initRecords($records);
```

Note that initializing records in the data source is required only once, when the widget object is first created and not required on the subsequent AJAX calls.

The `initRecords()` method can be called multiple times. Each call adds records to the data source and doesn't replace the existing records.

## Emptying the data source

The `purge` method removes all records from the data source. This method should always be used with server memory data sources. Nonetheless, server side data sources should take care about providing the automatic ways of cleaning data with using the time-to-live mechanisms. 

```
$table = new Table($this, $config);
$dataSource = $table->getDataSource();
$dataSource->purge();
```


## Reading data from the data source

The server-side data sources (PHP) automatically maintain the actual data, but that mechanism for the client-memory and server-memory data sources is different.

In case of the client-memory data source, the table widget adds the data records to the POST, when the form is saved using the AJAX Framework (see `postback` and `postbackHandlerName` options). The table data will be injected automatically to the AJAX request when the `postback` value is `true` and the `postbackHandlerName` matches the exact handler name of the request. On the server side the data is inserted to the data source and can be accessed using the PHP example below.

The server-memory data source always automatically maintain its contents in synch with the client using AJAX, and POSTing data is not required.

In PHP reading data from a data source of any type looks like this (it should be in the AJAX handler that saves the data, for the client-memory data source the handler name should match the `postbackHandlerName` option value):

```
public function onSave()
{
    // Assuming that the widget was initialized in the 
    // controller constructor with the "table" alias.
    $dataSource = $this->widget->table->getDataSource();

    while ($records = $dataSource->readRecords(5)) {
        traceLog($records);
    }
```


## Validation

There are two ways to validate the table data - with the client-side and server-side validation.

### Client-side validation ($.oc.table.validator)

The client-side validation is performed before the data is sent to the server, or before the user navigates to another page (if the pagination is enabled). Client-side validation is a fast, but simple validation implementation. It can't be used for complex cases like finding duplicating records, or comparing data with records existing in the database.

The client-side validation is configured in the widget configuration file in the column definition with the `validation` key. Example:

    state:
        title: State
        type: dropdown
        validation:
            required:
                message: Please select the state
                requiredWith: country

If a validator doesn't have any options (or default option values should be used), the declaration could look like this:

    state:
        title: State
        type: dropdown
        validation:
            required: {}

The `requiredWith` and `message` parameters are common for all validators.

Currently implemented client-side validation rules:

- required
- integer
- float
- length
- regex

Validation rules can be configured with extra parameters, which depend on a specific validator. 

#### required validator ($.oc.table.validator.required)

Checks if the user has provided a value for the cell. 

#### integer validator ($.oc.table.validator.integer)

Checks if the value is integer. Parameters:

* `allowNegative` - optional, determines if negative values are allowed.
* `min` - optional object, defines the minimum allowed value and error message. Object fields:
    * `value` - defines the minimum value.
    * `message` - optional, defines the error message.
* `max` - optional object, defines the maximum allowed value and error message. Object fields:
    * `value` - defines the maximum value.
    * `message` - optional, defines the error message.

Example of defining the integer validator with the `min` parameter: 

    length:
        title: Length
        type: string
        validation:
            integer:
                min:
                    value: 3
                    message: "The length cannot be less than 3"

#### float validator ($.oc.table.validator.float)

Checks if the value is a floating point number. The parameters for this validator match the parameters of the **integer** validator.

Valid floating point number formats:

* 10
* 10.302
* -10 (if `allowNegative` is `true`)
* -10.84 (if `allowNegative` is `true`)

#### length validator ($.oc.table.validator.length)

Checks if a string is not shorter or longer than specified values.  Parameters:

* `min` - optional object, defines the minimum length and error message. Object fields:
    * `value` - defines the minimum length.
    * `message` - optional, defines the error message.
* `max` - optional object, defines the maximum length and error message. Object fields:
    * `value` - defines the maximum length.
    * `message` - optional, defines the error message.

Example column definition:

    name:
        title: Name
        type: string
        validation:
            length:
                min:
                    value: 3
                    message: "The name is too short."

#### regex validator ($.oc.table.validator.regex)

Checks a string against a provided regular expression:

* `pattern` - specifies the regular expression pattern string. Example: **^[0-9a-z]+$**
* `modifiers` - optional, a string containing regular expression modifiers (https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp), for example **i** for "case insensitive". 

Example:

    login:
        title: Login
        type: string
        validation:
            regex:
                pattern: "^[a-z0-9]+$"
                modifiers: "i"
                message: "The login name can contain only Latin letters and numbers."

Although the `message` parameter is optional for all validators it's highly recommended to provide a message for the regular expression validator as the default message "Invalid value format." is not descriptive and can be confusing.

### Server-side validation

TODO: document.

Draft. In case of a validation error the AJAX response should contain the following information:

- row key
- row offset in the data set
- error message