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

### Dynamic option creation

In addition to a pre-populated menu of options, Select widgets may dynamically create new options from textual input by the user in the search box. This feature is called "tagging". To enable tagging, set the `tags` option to `true`:

    <select
        class="form-control custom-select"
        data-tags="true"
    ></select>

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

The AJAX handler should return results in the [Select2 data format](https://select2.org/data-sources/formats).

```php
public function onGetOptions()
{
    return [
        'results' => [
            [
                'id' => 1,
                'text' => 'Foo'
            ],
            [
                'id' => 2,
                'text' => 'Bar'
            ]
            ...
        ]
    ];
}
```

Or a more full-featured example:

```php
public function onGetOptions()
{
    return [
        'results' => [
            [
                'id' => 1,
                'text' => 'Foo',
                'disabled' => true
            ],
            [
                'id' => 2,
                'text' => 'Bar',
                'selected' => true
            ],
            [
                'text' => 'Group',
                'children' => [
                    [
                        'id' => 3,
                        'text' => 'Child 1'
                    ],
                    [
                        'id' => 4,
                        'text' => 'Child 2'
                    ]
                    ...
                ]
            ]
            ...
        ],
        'pagination' => [
            'more' => true
        ]
    ];
}
```

The results array can be assigned to either the `result` or `results` key. As an alternative to the Select2 format, results can also be provided as an associative array (also assigned to either key). Due to the fact that JavaScript does not guarantee the order of object properties, we suggest the method above for defining results.

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
