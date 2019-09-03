# Select

### Select

Custom select control.

    <select class="form-control custom-select">
        <option selected="selected" value="2">Approved</option>
        <option value="3">Deleted</option>
        <option value="1">New</option>
    </select>

## Sizes

### Small size

    <div class="form-group form-group-sm">
        <select class="form-control custom-select">
            <option value="1" selected="selected">One</option>
            <option value="2">Two</option>
        </select>
    </div>

### Large size

    <div class="form-group form-group-lg">
        <select class="form-control custom-select">
            <option value="1" selected="selected">One</option>
            <option value="2">Two</option>
        </select>
    </div>

## Options

### Disable search

Add the `select-no-search` CSS class to disable searching.

    <div class="form-group">
        <select class="form-control custom-select select-no-search">
            <option value="1" selected="selected">One</option>
            <option value="2" selected="selected">Two</option>
        </select>
    </div>

## Option groups

Use the `optgroup` element to create option groups.

    <select class="form-control custom-select">
        <option value="1">Please select an option</option>
        <option value="2">Ungrouped option</option>
        <optgroup label="Option Group">
            <option value="3">Grouped option</option>
            <option value="4">Another option</option>
            <option value="4">Third option</option>
        </optgroup>
    </select>

## AJAX search

Use the `data-handler` attribute to source the select options from an AJAX handler.

```html
<select
    class="form-control custom-select"
    data-handler="onGetOptions"
    data-minimum-input-length="2"
    data-ajax--delay="300"
    data-request-data="foo: 'bar'"
></select>
```

The AJAX handler should return results as an array.

```php
public function onGetOptions()
{
    $results = [
        [
            'id' => 1,
            'text' => 'Foobar',
        ],
        ...
    ];

    return ['result' => $results];
}
```

Due to the fact that JavaScript reorders numeric keys when interpreting the JSON data received by the AJAX handler, we suggest the method above for defining `results`. Support for the original `results` array format is however retained to ensure backwards compatibility.

```php
public function onGetOptions()
{
    $results = [
        'key' => 'value',
        ...
    ];

    return ['result' => $results];
}
```
