Renders a form

# Example

    <!-- Form Elements -->
    <form class="form-elements" role="form">

        <!-- Text Input (Left) -->
        <div class="form-group text-field span-left is-required">
            <label>Input Left</label>
            <input type="text" name="" value="" class="form-control" autocomplete="off" maxlength="255" />
             <p class="help-block">Example below help text here.</p>
        </div>

        <!-- Text Input (Right) -->
        <div class="form-group text-field span-right is-required">
            <label>Input Right</label>
            <input type="text" name="" value="" class="form-control" autocomplete="off" maxlength="255" />
            <p class="help-block">Example below help text here.</p>
        </div>

        <!-- Text Input (Full) -->
        <div class="form-group text-field span-full is-required">
            <label>Input Full</label>
            <p class="help-block before-field">Example above help text here.</p>
            <input type="text" name="" value="" class="form-control" autocomplete="off" maxlength="255" />
        </div>

        <!-- Drop down -->
        <div class="form-group dropdown-field span-left">
            <label>Drop Down</label>
            <select class="form-control custom-select">
                <option selected="selected" value="2">Approved</option>
                <option value="3">Deleted</option>
                <option value="1">New</option>
            </select>
        </div>

        <!-- Grouped Drop down -->
        <div class="form-group dropdown-field span-right">
            <label>Grouped Drop Down</label>
            <select class="form-control custom-select">
                <option value=""></option>
                <optgroup label="NFC EAST">
                    <option>Dallas Cowboys</option>
                    <option>New York Giants</option>
                    <option>Philadelphia Eagles</option>
                    <option>Washington Redskins</option>
                </optgroup><optgroup>
                </optgroup><optgroup label="NFC NORTH">
                    <option>Chicago Bears</option>
                    <option>Detroit Lions</option>
                    <option>Green Bay Packers</option>
                    <option>Minnesota Vikings</option>
                </optgroup>
                <optgroup label="NFC SOUTH">
                    <option>Atlanta Falcons</option>
                    <option>Carolina Panthers</option>
                    <option>New Orleans Saints</option>
                    <option>Tampa Bay Buccaneers</option>
                </optgroup>
                <optgroup label="NFC WEST">
                    <option>Arizona Cardinals</option>
                    <option>St. Louis Rams</option>
                    <option>San Francisco 49ers</option>
                    <option>Seattle Seahawks</option>
                </optgroup>
                <optgroup label="AFC EAST">
                    <option>Buffalo Bills</option>
                    <option>Miami Dolphins</option>
                    <option>New England Patriots</option>
                    <option>New York Jets</option>
                </optgroup>
                <optgroup label="AFC NORTH">
                    <option>Baltimore Ravens</option>
                    <option>Cincinnati Bengals</option>
                    <option>Cleveland Browns</option>
                    <option>Pittsburgh Steelers</option>
                </optgroup>
                <optgroup label="AFC SOUTH">
                    <option>Houston Texans</option>
                    <option>Indianapolis Colts</option>
                    <option>Jacksonville Jaguars</option>
                    <option>Tennessee Titans</option>
                </optgroup>
                <optgroup label="AFC WEST">
                    <option>Denver Broncos</option>
                    <option>Kansas City Chiefs</option>
                    <option>Oakland Raiders</option>
                    <option>San Diego Chargers</option>
                </optgroup>
            </select>
        </div>

        <!-- Checkbox -->
        <div class="form-group checkbox-field span-left is-required">
            <div class="checkbox custom-checkbox">
                <input name="checkbox" value="1" type="checkbox" id="checkbox_1">
                <label for="checkbox_1">Enable Googie Berry Power-up</label>
                <p class="help-block">Use this checkbox to enable the Googie Berry power-up specifically for this page. You can configure the Googie Berry power-up on the System Settings and Dashboard page.</p>
            </div>
        </div>

        <!-- Switcher -->
        <div class="form-group switch-field span-right">
            <div class="field-switch">
                <label>Would you like fries with that?</label>
                <p class="help-block">Use this checkbox to enable the Googie Berry power-up specifically for this page. You can configure the Googie Berry power-up on the System Settings and Dashboard page.</p>
            </div>
            <label class="custom-switch" onclick="">
                <input type="checkbox" />
                <span><span>On</span><span>Off</span></span>
                <a class="slide-button"></a>
            </label>
        </div>

        <!-- Radio List -->
        <div class="form-group radio-field span-left is-required">
            <label>Radio List</label>
            <p class="help-block before-field">Where should you propose to your beautiful girl?</p>
            
            <div class="radio custom-radio">
                <input name="radio" value="1" type="radio" id="radio_1">
                <label for="radio_1">Paris</label>
                <p class="help-block">Do not send new comment notifications.</p>
            </div>
            <div class="radio custom-radio">
                <input checked="checked" name="radio" value="2" type="radio" id="radio_2">
                <label for="radio_2">Dubai</label>
                <p class="help-block">Send new comment notifications only to post author.</p>
            </div>
            <div class="radio custom-radio">
                <input name="radio" value="3" type="radio" id="radio_3">
                <label for="radio_3">New Zealand</label>
                <p class="help-block">Notify all users who have permissions to receive blog notifications.</p>
            </div>
        </div>

        <!-- Checkbox List -->
        <div class="form-group checkboxlist-field span-right is-required">
            <label>Checkbox List</label>
            <p class="help-block before-field">What cars would you like in your garage?</p>

            <div class="checkbox custom-checkbox">
                <input id="checkbox-example1" name="checkbox" value="1" type="checkbox">
                <label class="choice" for="checkbox-example1"> Dodge Viper</label>
                <p class="help-block">Do not send new comment notifications.</p>
            </div>
            <div class="checkbox custom-checkbox">
                <input checked="checked" id="checkbox-example2" name="checkbox" value="2" type="checkbox">
                <label class="choice" for="checkbox-example2"> GM Corvette</label>
                <p class="help-block">Send new comment notifications only to post author.</p>
            </div>
            <div class="checkbox custom-checkbox">
                <input id="checkbox-example3" name="checkbox" value="3" type="checkbox">
                <label class="choice" for="checkbox-example3"> Porsche Boxter</label>
                <p class="help-block">Notify all users who have permissions to receive blog notifications.</p>
            </div>
        </div>

        <!-- Textarea -->
        <div class="form-group textarea-field span-right is-required">
            <label>Textarea</label>
            <p class="help-block before-field">Plain as Jane multi line text input</p>
            <textarea autocomplete="off" class="form-control field-textarea size-large" name="comment" placeholder=""></textarea>
        </div>

    </form>
