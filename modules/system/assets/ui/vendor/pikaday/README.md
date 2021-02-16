Pikaday
========

[![NPM version][npm-image]][npm-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]


### A refreshing JavaScript Datepicker

* Lightweight (less than 5kb minified and gzipped)
* No dependencies (but plays well with [Moment.js][moment])
* Modular CSS classes for easy styling

[**Try Pikaday Demo →**][Pikaday]

![Pikaday Screenshot][screenshot]

**Production ready?** Since version 1.0.0 Pikaday is stable and used in production. If you do however find bugs or have feature requests please submit them to the [GitHub issue tracker][issues].
Also see the [changelog](CHANGELOG.md)

## Installation
You can install Pikaday as an NPM package:

```shell
npm install pikaday
```

Or link directly to the CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/pikaday/pikaday.js"></script>
```

## Styles
You will also need to include Pikaday CSS file. This step depends on how Pikaday was installed. Either import from NPM:

```css
@import './node_modules/pikaday/css/pikaday.css';
```

Or link to the CDN:

```html
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/pikaday/css/pikaday.css">
```

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

### Formatting

By default, dates are formatted and parsed using standard JavaScript Date object.
If [Moment.js][moment] is available in scope, it will be used to format and parse input values. You can pass an additional `format` option to the configuration which will be passed to the `moment` constructor.
See the [moment.js example][] for a full version.

```html
<input type="text" id="datepicker" value="9 Oct 2014">

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

For more advanced and flexible formatting you can pass your own `toString` function to the configuration which will be used to format the date object.
This function has the following signature:

`toString(date, format = 'YYYY-MM-DD')`

You should return a string from it.

Be careful, though. If the formatted string that you return cannot be correctly parsed by the `Date.parse` method (or by `moment` if it is available), then you must provide your own `parse` function in the config. This function will be passed the formatted string and the format:

`parse(dateString, format = 'YYYY-MM-DD')`

```javascript
var picker = new Pikaday({
    field: document.getElementById('datepicker'),
    format: 'D/M/YYYY',
    toString(date, format) {
        // you should do formatting based on the passed format,
        // but we will just return 'D/M/YYYY' for simplicity
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    },
    parse(dateString, format) {
        // dateString is the result of `toString` method
        const parts = dateString.split('/');
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
    }
});
```

### Configuration

As the examples demonstrate above
Pikaday has many useful options:

* `field` bind the datepicker to a form field
* `trigger` use a different element to trigger opening the datepicker, see [trigger example][] (default to `field`)
* `bound` automatically show/hide the datepicker on `field` focus (default `true` if `field` is set)
* `ariaLabel` data-attribute on the input field with an aria assistance text (only applied when `bound` is set)
* `position` preferred position of the datepicker relative to the form field, e.g.: `top right`, `bottom right` **Note:** automatic adjustment may occur to avoid datepicker from being displayed outside the viewport, see [positions example][] (default to 'bottom left')
* `reposition` can be set to false to not reposition datepicker within the viewport, forcing it to take the configured `position` (default: true)
* `container` DOM node to render calendar into, see [container example][] (default: undefined)
* `format` the default output format for `.toString()` and `field` value (requires [Moment.js][moment] for custom formatting)
* `formatStrict` the default flag for moment's strict date parsing (requires [Moment.js][moment] for custom formatting)
* `toString(date, format)` function which will be used for custom formatting. This function will take precedence over `moment`.
* `parse(dateString, format)` function which will be used for parsing input string and getting a date object from it. This function will take precedence over `moment`.
* `defaultDate` the initial date to view when first opened
* `setDefaultDate` Boolean (true/false). make the `defaultDate` the initial selected value
* `firstDay` first day of the week (0: Sunday, 1: Monday, etc)
* `minDate` the minimum/earliest date that can be selected (this should be a native Date object - e.g. `new Date()` or `moment().toDate()`)
* `maxDate` the maximum/latest date that can be selected (this should be a native Date object - e.g. `new Date()` or `moment().toDate()`)
* `disableWeekends` disallow selection of Saturdays or Sundays
* `disableDayFn` callback function that gets passed a Date object for each day in view. Should return true to disable selection of that day.
* `yearRange` number of years either side (e.g. `10`) or array of upper/lower range (e.g. `[1900,2015]`)
* `showWeekNumber` show the ISO week number at the head of the row (default `false`)
* `pickWholeWeek` select a whole week instead of a day (default `false`)
* `isRTL` reverse the calendar for right-to-left languages
* `i18n` language defaults for month and weekday names (see internationalization below)
* `yearSuffix` additional text to append to the year in the title
* `showMonthAfterYear` render the month after year in the title (default `false`)
* `showDaysInNextAndPreviousMonths` render days of the calendar grid that fall in the next or previous months (default: false)
* `enableSelectionDaysInNextAndPreviousMonths` allows user to select date that is in the next or previous months (default: false)
* `numberOfMonths` number of visible calendars
* `mainCalendar` when `numberOfMonths` is used, this will help you to choose where the main calendar will be (default `left`, can be set to `right`). Only used for the first display or when a selected date is not already visible
* `events` array of dates that you would like to differentiate from regular days (e.g. `['Sat Jun 28 2017', 'Sun Jun 29 2017', 'Tue Jul 01 2017',]`)
* `theme` define a classname that can be used as a hook for styling different themes, see [theme example][] (default `null`)
* `blurFieldOnSelect` defines if the field is blurred when a date is selected (default `true`)
* `onSelect` callback function for when a date is selected
* `onOpen` callback function for when the picker becomes visible
* `onClose` callback function for when the picker is hidden
* `onDraw` callback function for when the picker draws a new month
* `keyboardInput` enable keyboard input support (default `true`)

### Styling

If the `reposition` configuration-option is enabled (default), Pikaday will apply CSS-classes to the datepicker according to how it is positioned:

* `top-aligned`
* `left-aligned`
* `right-aligned`
* `bottom-aligned`

Note that the DOM element at any time will typically have 2 CSS-classes (eg. `top-aligned right-aligned` etc).

## jQuery Plugin

The normal version of Pikaday does not require jQuery, however there is a jQuery plugin if that floats your boat (see `plugins/pikaday.jquery.js` in the repository). This version requires jQuery, naturally, and can be used like other plugins:
See the [jQuery example][] for a full version.

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
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

If you use a modular script loader, Pikaday is not bound to the global object and will fit nicely in your build process. You can require Pikaday just like any other module.
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

When you bundle all your required modules with [Browserify][browserify] and you don't use [Moment.js][moment] specify the ignore option:

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

Returns the selected date in a string format. If [Moment.js][moment] exists (recommended) then Pikaday can return any format that Moment understands.
You can also provide your own `toString` function and do the formatting yourself. Read more in the [formatting](#formatting) section.

If neither `moment` object exists nor `toString` function is provided, JavaScript's default [`.toDateString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toDateString) method will be used.

`picker.getDate()`

Returns a basic JavaScript `Date` object of the selected day, or `null` if no selection.

`picker.setDate('2015-01-01')`

Set the current selection. This will be restricted within the bounds of `minDate` and `maxDate` options if they're specified. You can optionally pass a boolean as the second parameter to prevent triggering of the onSelect callback (true), allowing the date to be set silently.

`picker.getMoment()`

Returns a [Moment.js][moment] object for the selected date (Moment must be loaded before Pikaday).

`picker.setMoment(moment('14th February 2014', 'DDo MMMM YYYY'))`

Set the current selection with a [Moment.js][moment] object (see `setDate` for details).

### Clear and reset date

`picker.clear()`

Will clear and reset the input where picker is bound to.

### Change current view

`picker.gotoDate(new Date(2014, 1))`

Change the current view to see a specific date. This example will jump to February 2014 ([month is a zero-based index][mdn_date]).

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

`picker.setStartRange()`

Update the range start date. For using two Pikaday instances to select a date range.

`picker.setEndRange()`

Update the range end date. For using two Pikaday instances to select a date range.

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

You can use the work [@owenmead][owenmead] did most recently at [owenmead/Pikaday][owen Pika]
A more simple time selection approach done by [@xeeali][xeeali] at [xeeali/Pikaday][xeeali Pika] is based on version 1.2.0.
Also [@stas][stas] has a fork [stas/Pikaday][stas Pika], but is now quite old


## Browser Compatibility

* IE 7+
* Chrome 8+
* Firefox 3.5+
* Safari 3+
* Opera 10.6+

[![browser compatibility](https://ci.testling.com/rikkert/pikaday.png)
](https://ci.testling.com/rikkert/pikaday)


* * *

## Authors

* David Bushell [https://dbushell.com][Bushell] [@dbushell][Bushell Twitter]
* Ramiro Rikkert [GitHub][Rikkert] [@RamRik][Rikkert Twitter]

Thanks to [@shoogledesigns][shoogledesigns] for the name.

Copyright © 2014 David Bushell | BSD & MIT license

  [Pikaday]:     https://pikaday.com/                                             "Pikaday"
  [moment]:      http://momentjs.com/                                             "moment.js"
  [browserify]:  http://browserify.org/                                           "browserify"
  [screenshot]:  https://raw.github.com/Pikaday/Pikaday/master/examples/screenshot.png  "Screenshot"
  [issues]:      https://github.com/Pikaday/Pikaday/issues                        "Issue tracker"
  [gem]:         https://rubygems.org/gems/pikaday-gem                            "RoR gem"
  [mdn_date]:    https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date  "Date"
  [Bushell]:     https://dbushell.com/                                            "dbushell.com"
  [Bushell Twitter]: https://twitter.com/dbushell                                 "@dbushell"
  [Rikkert]:     https://github.com/rikkert                                       "Rikkert GitHub"
  [Rikkert Twitter]: https://twitter.com/ramrik                                   "@ramrik"
  [shoogledesigns]:  https://twitter.com/shoogledesigns/status/255209384261586944 "@shoogledesigns"
  [issue1]:      https://github.com/Pikaday/Pikaday/issues/1                      "Issue 1"
  [issue18]:     https://github.com/Pikaday/Pikaday/issues/18                     "Issue 18"
  [stas]:        https://github.com/stas                                          "@stas"
  [stas Pika]:   https://github.com/stas/Pikaday                                  "Pikaday"
  [owenmead]:    https://github.com/owenmead                                      "@owenmead"
  [owen Pika]:   https://github.com/owenmead/Pikaday                              "Pikaday"
  [xeeali]:      https://github.com/xeeali                                        "@xeeali"
  [xeeali Pika]: https://github.com/xeeali/Pikaday                                "Pikaday"
  [moment.js example]: https://pikaday.com/examples/moment.html    "Pikaday w/ moment.js"
  [jQuery example]: https://pikaday.com/examples/jquery.html       "Pikaday w/ jQuery"
  [AMD example]: https://pikaday.com/examples/amd.html             "Pikaday w/ AMD"
  [jQuery AMD example]: https://pikaday.com/examples/jquery-amd.html "Pikaday w/ jQuery + AMD"
  [trigger example]: https://pikaday.com/examples/trigger.html     "Pikaday using custom trigger"
  [positions example]: https://pikaday.com/examples/positions.html "Pikaday using different position options"
  [container example]: https://pikaday.com/examples/container.html "Pikaday using custom calendar container"
  [theme example]: https://pikaday.com/examples/theme.html         "Pikaday using multiple themes"



[npm-image]: https://img.shields.io/npm/v/pikaday.svg?style=flat-square
[npm-url]: https://npmjs.org/package/pikaday
[license-image]: https://img.shields.io/:license-mit-blue.svg?style=flat-square
[license-url]: LICENSE.md
[downloads-image]: http://img.shields.io/npm/dm/pikaday.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/pikaday
