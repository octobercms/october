Pikaday
========

### A refreshing JavaScript Datepicker

* Lightweight (less than 5kb minified and gzipped)
* No dependencies (but plays well with [Moment.js][moment]
* Modular CSS classes for easy styling

[**Try Pikaday Demo →**][Pikaday]

![Pikaday Screenshot][screenshot]

**Production ready?** Since version 1.0.0 Pikaday is stable and used in production. If you do however find bugs or have feature requests please submit them to the [GitHub issue tracker][issues].  
Also see the [changelog](CHANGELOG.md)


## Usage

**Pikaday** can be bound to an input field:

```html
<input type="text" id="datepicker">
```

Add the JavaScript to the end of your document:

```html
<script src="pikaday.js"></script>
<script>
    var picker = new Pikaday({ field: document.getElementById('datepicker') });
</script>
```

If you're using **jQuery** make sure to pass only the first element:

```javascript
var picker = new Pikaday({ field: $('#datepicker')[0] });
```

If the Pikaday instance is not bound to a field you can append the element anywhere:

```javascript
var field = document.getElementById('datepicker');
var picker = new Pikaday({
    onSelect: function(date) {
        field.value = picker.toString();
    }
});
field.parentNode.insertBefore(picker.el, field.nextSibling);
```

For advanced formatting load [Moment.js][moment] prior to Pikaday:  
See the [moment.js example][] for a full version.

```html
<input type="text" id="datepicker" value="9 Oct 2012">

<script src="moment.js"></script>
<script src="pikaday.js"></script>
<script>
    var picker = new Pikaday({
        field: document.getElementById('datepicker'),
        format: 'D MMM YYYY',
        onSelect: function() {
            console.log(this.getMoment().format('Do MMMM YYYY'));
        }
    });
</script>
```

### Configuration

As the examples demonstrate above
Pikaday has many useful options:

* `field` bind the datepicker to a form field
* `trigger` use a different element to trigger opening the datepicker, see [trigger example][] (default to `field`)
* `bound` automatically show/hide the datepicker on `field` focus (default `true` if `field` is set)
* `format` the default output format for `.toString()` and `field` value (requires [Moment.js][moment] for advanced formatting)
* `defaultDate` the initial date to view when first opened
* `setDefaultDate` make the `defaultDate` the initial selected value
* `firstDay` first day of the week (0: Sunday, 1: Monday, etc)
* `minDate` the minimum/earliest date that can be selected (this should be a native Date object - e.g. `new Date()` or `moment().toDate()`)
* `maxDate` the maximum/latest date that can be selected (this should be a native Date object - e.g. `new Date()` or `moment().toDate()`)
* `yearRange` number of years either side (e.g. `10`) or array of upper/lower range (e.g. `[1900,2012]`)
* `isRTL` reverse the calendar for right-to-left languages
* `i18n` language defaults for month and weekday names (see internationalization below)
* `yearSuffix` additional text to append to the year in the title
* `showMonthAfterYear` render the month after year in the title (default `false`)
* `onSelect` callback function for when a date is selected
* `onOpen` callback function for when the picker becomes visible
* `onClose` callback function for when the picker is hidden
* `onDraw` callback function for when the picker draws a new month

## jQuery Plugin

The normal version of Pikaday does not require jQuery, however there is a jQuery plugin if that floats your boat (see `plugins/pikaday.jquery.js` in the repository). This version requires jQuery, naturally, and can be used like other plugins:  
See the [jQuery example][] for a full version.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.0/jquery.js" integrity="sha384-WGhEWG1n4j4SSTvTWxHLVbwDs5irzinCJT89aUzyS2H/wY2d2eZrUWSsNyCucTYy" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-migrate/3.0.1/jquery-migrate.min.js" integrity="sha384-w5FBDpYZssTSnIDL59XH9TYLpEJ2dDP4RPhSPtJd2iLxUY5L8AATkjOsbM4Ohmax" crossorigin="anonymous"></script>
<script src="pikaday.js"></script>
<script src="plugins/pikaday.jquery.js"></script>
<script>

// activate datepickers for all elements with a class of `datepicker`
$('.datepicker').pikaday({ firstDay: 1 });

// chain a few methods for the first datepicker, jQuery style!
$('.datepicker').eq(0).pikaday('show').pikaday('gotoYear', 2042);

</script>
```

## AMD support

If you use a modular script loader than Pikaday is not bound to the global object and will fit nicely in your build process. You can require Pikaday just like any other module.  
See the [AMD example][] for a full version.

```javascript
require(['pikaday'], function(Pikaday) {
    var picker = new Pikaday({ field: document.getElementById('datepicker') });
});
```
The same applies for the jQuery plugin mentioned above.  
See the [jQuery AMD example][] for a full version.

```javascript
require(['jquery', 'pikaday.jquery'], function($) {
    $('#datepicker').pikaday();
});
```

## CommonJS module support

If you use a CommonJS compatible environment you can use the require function to import Pikaday.


```javascript
var pikaday = require('pikaday');
```

When you bundle all your required modules with [Browserify][browserify] and you don't use [Moment.js][moment] specify the ignore opption:

`browserify main.js -o bundle.js -i moment`

## Ruby on Rails

If you're using **Ruby on Rails**, make sure to check out the [Pikaday gem][gem].

## Methods

You can control the date picker after creation:

```javascript
var picker = new Pikaday({ field: document.getElementById('datepicker') });
```

### Get and set date

`picker.toString('YYYY-MM-DD')`

Returns the selected date in a string format. If [Moment.js][moment] exists (recommended) then Pikaday can return any format that Moment understands, otherwise you're stuck with JavaScript's default.

`picker.getDate()`

Returns a basic JavaScript `Date` object of the selected day, or `null` if no selection.

`picker.setDate('2012-01-01'))`

Set the current selection. This will be restricted within the bounds of `minDate` and `maxDate` options if they're specified.

`picker.getMoment()`

Returns a [Moment.js][moment] object for the selected date (Moment must be loaded before Pikaday).

`picker.setMoment(moment('14th Feburary 2013', 'DDo MMMM YYYY'))`

Set the current selection with a [Moment.js][moment] object (passed on to `setDate`).

### Change current view

`picker.gotoDate(new Date(2012, 1))`

Change the current view to see a specific date. This example will jump to February 2012 ([month is a zero-based index][mdn_date]).

`picker.gotoToday()`

Shortcut for `picker.gotoDate(new Date())`

`picker.gotoMonth(2)`

Change the current view by month (0: January, 1: Februrary, etc).

`picker.nextMonth()`
`picker.prevMonth()`

Go to the next or previous month (this will change year if necessary).

`picker.gotoYear()`

Change the year being viewed.

`picker.setMinDate()`

Update the minimum/earliest date that can be selected.

`picker.setMaxDate()`

Update the maximum/latest date that can be selected.

### Show and hide datepicker

`picker.isVisible()`

Returns `true` or `false`.

`picker.show()`

Make the picker visible.

`picker.adjustPosition()`

Recalculate and change the position of the picker.

`picker.hide()`

Hide the picker making it invisible.

`picker.destroy()`

Hide the picker and remove all event listeners — no going back!

### Internationalization

The default `i18n` configuration format looks like this:

```javascript
i18n: {
    previousMonth : 'Previous Month',
    nextMonth     : 'Next Month',
    months        : ['January','February','March','April','May','June','July','August','September','October','November','December'],
    weekdays      : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    weekdaysShort : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
}
```

You must provide 12 months and 7 weekdays (with abbreviations). Always specify weekdays in this order with Sunday first. You can change the `firstDay` option to reorder if necessary (0: Sunday, 1: Monday, etc). You can also set `isRTL` to `true` for languages that are read right-to-left.


## Extensions

### Timepicker

Pikaday is a pure datepicker. It will not support picking a time of day. However, there have been efforts to add time support to Pikaday.  
See [#1][issue1] and [#18][issue18]. These reside in their own fork.

You can use the work [@stas][stas] did at [stas/Pikaday][stas Pika]  
or the work [@owenmead][owenmead] did more recently at [owenmead/Pikaday][owen Pika] which is based on version 1.1.0.


## Browser Compatibility

* IE 7+
* Chrome 8+
* Firefox 3.5+
* Safari 3+
* Opera 10.6+


* * *

## Authors

* David Bushell [http://dbushell.com][Bushell] [@dbushell][Bushell Twitter]
* Ramiro Rikkert [GitHub][Rikkert] [@RamRik][Rikkert Twitter]

Thanks to [@shoogledesigns][shoogledesigns] for the name.

Copyright © 2013 David Bushell | BSD & MIT license

  [Pikaday]:     http://dbushell.github.com/Pikaday/                              "Pikaday"
  [moment]:      http://momentjs.com/                                             "moment.js"
  [browserify]:  http://browserify.org/                                           "browserify"
  [screenshot]:  https://raw.github.com/dbushell/Pikaday/gh-pages/screenshot.png  "Screenshot"
  [issues]:      https://github.com/dbushell/Pikaday/issues                       "Issue tracker"
  [gem]:         https://rubygems.org/gems/pikaday-gem                            "RoR gem"
  [mdn_date]:    https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date  "Date"
  [Bushell]:     http://dbushell.com/                                             "dbushell.com"
  [Bushell Twitter]: https://twitter.com/dbushell                                 "@dbushell"
  [Rikkert]:     https://github.com/rikkert                                       "Rikkert GitHub"
  [Rikkert Twitter]: https://twitter.com/ramrik                                   "@ramrik"
  [shoogledesigns]:  https://twitter.com/shoogledesigns/status/255209384261586944 "@shoogledesigns"
  [issue1]:      https://github.com/dbushell/Pikaday/issues/1                     "Issue 1"
  [issue18]:     https://github.com/dbushell/Pikaday/issues/18                    "Issue 18"
  [stas]:        https://github.com/stas                                          "@stas"
  [stas Pika]:   https://github.com/stas/Pikaday                                  "Pikaday"
  [owenmead]:     https://github.com/owenmead                                     "@owenmead"
  [owen Pika]:   https://github.com/owenmead/Pikaday                              "Pikaday"
  [moment.js example]: http://dbushell.github.com/Pikaday/examples/moment.html    "Pikaday w/ moment.js"
  [jQuery example]: http://dbushell.github.com/Pikaday/examples/jquery.html       "Pikaday w/ jQuery"
  [AMD example]: http://dbushell.github.com/Pikaday/examples/amd.html             "Pikaday w/ AMD"
  [jQuery AMD example]: http://dbushell.github.com/Pikaday/examples/jquery-amd.html "Pikaday w/ jQuery + AMD"
  [trigger example]: http://dbushell.github.com/Pikaday/examples/trigger.html     "Pikaday using custom trigger"
