There's a hack in select2.full.js. The hack prevents DOM element leakage through the event handler. Added/updated code:

Line 3961, added .select2 namespace in the event handler registration:

    this.$dropdownContainer.on('mousedown.select2', function (evt) {

Lines 4120-4124. Added new method:

```
  AttachBody.prototype.destroy = function(decorated) {
    this.$dropdownContainer.off('.select2')

    decorated.call(this);
  }
```

Filed an issue: https://github.com/select2/select2/issues/3774
The issue was closed by the developers - the problem is going to be fixed in the upcoming 4.0.1 release. 