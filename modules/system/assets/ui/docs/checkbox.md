# Checkbox

### Checkbox

Allows a user to select from a small set of binary options.

    <div class="checkbox custom-checkbox">
        <input name="checkbox" value="1" type="checkbox" id="checkbox1" />
        <label for="checkbox1">Checkbox</label>
    </div>

### Radio

    <div class="radio-field" role="radiogroup" aria-label="Radio button group">
        <div class="radio custom-radio">
            <input name="radio" value="1" type="radio" role="radio" tabindex="-1" id="radio_1" aria-checked="false" />
            <label for="radio_1">Paris</label>
        </div>
        <div class="radio custom-radio">
            <input name="radio" value="2" type="radio" role="radio" tabindex="0" id="radio_2" aria-checked="true" checked="checked" />
            <label for="radio_2">Dubai</label>
        </div>
        <div class="radio custom-radio">
            <input name="radio" value="3" type="radio" role="radio" tabindex="-1" id="radio_3" aria-checked="false" />
            <label for="radio_3">New Zealand</label>
        </div>
    </div>

### Slider

    <label class="custom-switch">
        <input type="checkbox" role="checkbox" tabindex="0" aria-checked="false" />
        <span tabindex="-1"><span>On</span><span>Off</span></span>
        <a class="slide-button"></a>
    </label>

    <label class="custom-switch">
        <input type="checkbox" role="checkbox" tabindex="0" aria-checked="true" checked="checked" />
        <span tabindex="-1"><span>On</span><span>Off</span></span>
        <a class="slide-button"></a>
    </label>

### Balloon selector

    <div data-control="balloon-selector" class="control-balloon-selector">
        <ul>
            <li data-value="1" class="active">One</li>
            <li data-value="2">Two</li>
            <li data-value="3">Three</li>
        </ul>

        <input type="hidden" name="balloonValue" value="1" />
    </div>

If you don't define `data-control="balloon-selector"` then the control will act as a static list of labels.

    <div class="control-balloon-selector">
        <ul>
            <li>Monday</li>
            <li>Tuesday</li>
            <li>Happy days!</li>
        </ul>
    </div>
