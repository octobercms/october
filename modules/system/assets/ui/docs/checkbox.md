# Checkbox

### Checkbox

Allows a user to select from a small set of binary options.

    <div class="checkbox custom-checkbox">
        <input name="checkbox" value="1" type="checkbox" id="checkbox1" />
        <label for="checkbox1">Checkbox</label>
    </div>

### Checkbox lists

Allows a user to select from a list of binary options.

    <div class="form-group checkboxlist-field">
        <label>Checkbox list (hard-coded) example</label>
        <div class="field-checkboxlist">
            <!-- Quick selection (start) -->
            <div class="checkboxlist-controls">
                <a href="javascript:;" class="btn btn-primary" data-field-checkboxlist-all>Select all</a>
                <a href="javascript:;" class="btn btn-primary" data-field-checkboxlist-none>Select none</a>
            </div>
            <!-- Quick selection (end) -->
            <p class="help-block before-field">What cars would you like in your garage?</p>
            <div class="checkbox custom-checkbox" tabindex="0">
                <input id="checkbox-example1" name="checkbox" value="1" type="checkbox" checked="checked" aria-checked="true" />
                <label class="choice" for="checkbox-example1"> Dodge Viper </label>
                <p class="help-block">Do not send new comment notifications.</p>
            </div>
            <div class="checkbox custom-checkbox" tabindex="0">
                <input id="checkbox-example2" name="checkbox" value="2" type="checkbox" aria-checked="false" />
                <label class="choice" for="checkbox-example2"> GM Corvette </label>
                <p class="help-block">Send new comment notifications only to post author.</p>
            </div>
            <div class="checkbox custom-checkbox" tabindex="0">
                <input id="checkbox-example3" name="checkbox" value="3" type="checkbox" aria-checked="mixed" />
                <label class="choice" for="checkbox-example3"> Porsche Boxter </label>
                <p class="help-block">Notify all users who have permissions to receive blog notifications.</p>
            </div>
        </div>
    </div>

### Radio

    <div class="radio custom-radio">
        <input name="radio" value="1" type="radio" id="radio_1" />
        <label for="radio_1">Paris</label>
    </div>
    <div class="radio custom-radio">
        <input checked="checked" name="radio" value="2" type="radio" id="radio_2" />
        <label for="radio_2">Dubai</label>
    </div>
    <div class="radio custom-radio">
        <input name="radio" value="3" type="radio" id="radio_3" />
        <label for="radio_3">New Zealand</label>
    </div>

### Slider

    <label class="custom-switch">
        <input type="checkbox" />
        <span><span>On</span><span>Off</span></span>
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
