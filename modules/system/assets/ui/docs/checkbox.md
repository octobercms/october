# Checkbox

Allows a user to select from a small set of binary options.

# Example

    <h5>Checkbox</h5>
    <div class="checkbox custom-checkbox">
        <input name="checkbox" value="1" type="checkbox" id="checkbox1">
        <label for="checkbox1">Checkbox</label>
    </div>



    <hr />



    <h5>Radio</h5>
    <div class="radio custom-radio">
        <input name="radio" value="1" type="radio" id="radio_1">
        <label for="radio_1">Paris</label>
    </div>
    <div class="radio custom-radio">
        <input checked="checked" name="radio" value="2" type="radio" id="radio_2">
        <label for="radio_2">Dubai</label>
    </div>
    <div class="radio custom-radio">
        <input name="radio" value="3" type="radio" id="radio_3">
        <label for="radio_3">New Zealand</label>
    </div>



    <hr />



    <h5>Slider</h5>
    <label class="custom-switch">
        <input type="checkbox" />
        <span><span>On</span><span>Off</span></span>
        <a class="slide-button"></a>
    </label>



    <hr />



    <h5>Balloon selector</h5>
    <div data-control="balloon-selector" class="control-balloon-selector">
        <ul>
            <li data-value="1" class="active">One</li>
            <li data-value="2">Two</li>
            <li data-value="3">Three</li>
        </ul>

        <input type="hidden" name="balloonValue" value="1" />
    </div>