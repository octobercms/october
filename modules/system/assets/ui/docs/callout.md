# Callout

### Callout

Displays a detailed message to the user, also allowing it to be dismissed.

    <div class="callout fade in callout-warning">
        <button
            type="button"
            class="close"
            data-dismiss="callout"
            aria-hidden="true">&times;</button>
        <div class="header">
            <i class="icon-warning"></i>
            <h3>Warning warning</h3>
            <p>My arms are flailing wildly</p>
        </div>
        <div class="content">
            <p>Insert coin(s) to begin play</p>
        </div>
    </div>

### No sub-header

Include the `no-subheader` class to omit the sub heading.

    <div class="callout fade in callout-info no-subheader">
        <div class="header">
            <i class="icon-info"></i>
            <h3>Incoming unicorn</h3>
        </div>
    </div>

### No icon

Include the `no-icon` class to omit the icon.

    <div class="callout fade in callout-danger no-icon">
        <div class="header">
            <h3>There was a hull breach</h3>
            <ul>
                <li>Get to the chopper</li>
            </ul>
        </div>
    </div>

### No header

    <div class="callout fade in callout-success">
        <div class="content">
            <p>Something good happened</p>
            <ul>
                <li>You found a pony</li>
            </ul>
        </div>
    </div>

### Data attributes:

- data-dismiss="callout" - when assigned to an element, the callout hides on click

## JavaScript API

### Events

- close.oc.callout - triggered when the callout is closed
