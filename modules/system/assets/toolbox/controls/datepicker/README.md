# Date Pickers

Renders a date picker, time picker, or both. The input associated to each control acts as a facade, the final value is stored in an underlying hidden input, called a data locker.

## Examples

### Date Picker

    <div data-control="datepicker">
        <!-- Date -->
        <input
            type="text"
            class="form-control"
            placeholder="Select a date"
            data-datepicker />

        <!-- Data locker -->
        <input
            type="hidden"
            name="my_date"
            data-datetime-value
            />
    </div>

### Time Picker

    <div data-control="datepicker">
        <!-- Time -->
        <input
            type="text"
            class="form-control"
            placeholder="Select a time"
            data-timepicker />

        <!-- Data locker -->
        <input
            type="hidden"
            name="my_date"
            data-datetime-value
            />
    </div>

### Date & Time Picker

    <div data-control="datepicker">
        <div class="row">
            <div class="col-md-6">
                <!-- Date -->
                <input
                    type="text"
                    class="form-control"
                    placeholder="Select a date"
                    data-datepicker />
            </div>
            <div class="col-md-6">
                <!-- Time -->
                <input
                    type="text"
                    class="form-control"
                    placeholder="Select a time"
                    data-timepicker />
            </div>
        </div>

        <!-- Data locker -->
        <input
            type="hidden"
            name="my_date"
            data-datetime-value
            />
    </div>

## Locale and timezone handling

The date picker handles timezone and locale preferences automatically. Locale preferences will provide the date format for the region. The timezone setting is used to convert the chosen value to a uniform timezone, commonly UTC. These features are not enabled by default and require adding `<meta />` tags to the page.

```html
<meta name="app-timezone" content="UTC">
<meta name="backend-timezone" content="Australia/Sydney">
<meta name="backend-locale" content="en-au">
```

When a date is selected, it will be converted from the `backend-timezone` to the `app-timezone` for normalized storage.

> **Note**: Locale values are supplied by the Moment.js library.

## Supported data attributes

- data-control="datepicker" - enables the plugin on an element
- data-format="YYYY-MM-DD" - display format
- data-min-date="value" - minimum date to allow
- data-max-date="value" - maximum date to allow
- data-year-range="10" - range of years to display

## JavaScript API

```js
$('div#datepicker').datePicker({
    format: 'YYYY-MM-DD',
    yearRange: 10
})
```
