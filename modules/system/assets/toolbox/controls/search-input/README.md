# Search Input

Renders a search input with clear input, loading state and search icon.

## Basic Usage

```html
<div data-control="searchwidget">
    <div class="search-input-container storm-icon-pseudo">
        <input
            placeholder="Search ..."
            type="text"
            name="search_input"
            value=""
            data-request="onSubmit"
            data-track-input
            data-load-indicator
            data-load-indicator-opaque
            class="form-control"
            autocomplete="off"
            data-search-input />
        <button
            class="clear-input-text"
            type="button"
            value=""
            style="display: none"
            data-search-clear
        >
            <i class="storm-icon"></i>
        </button>
    </div>
</div>
```
