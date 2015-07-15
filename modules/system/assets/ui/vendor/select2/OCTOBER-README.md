There's a hack in line 1390 and 1412 in select2.full.js. The fix replaces **mousedown** event with **click** for closing the drop-down. The fix was required because the mousedown event propagation is prevented in the October popover control.

## Line 1390

Before: 

    $(document.body).on('mousedown.select2.' + container.id, function (e) {

After:

    $(document.body).on('click.select2.' + container.id, function (e) {

## Line 1412

Before:

    (document.body).off('mousedown.select2.' + container.id);

After:

    (document.body).off('click.select2.' + container.id);
