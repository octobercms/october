# Tooltips

Tooltips are an alternative to the standard browser title tooltip. They use Bootstrap's tooltip component under the hood.

## Usage

Tooltips can be spawned using any of these data attributes:

    <a
        href="javascript:;"
        data-control="tooltip"
        data-placement="left"
        title="Tooltip content">
        Some link
    </a>

    <a
        href="javascript:;"
        data-bs-toggle="tooltip"
        data-placement="left"
        title="Tooltip content">
        Some link
    </a>

## Config

- `placement` - tooltip position: top, bottom, left, right (default: 'top')
- `delay` - show/hide delay in ms (default: 500)
- `container` - append tooltip to a specific element (default: 'body')
