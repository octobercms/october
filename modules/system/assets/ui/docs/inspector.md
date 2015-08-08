# Inspector control

### Inspector

Manages properties of inspectable controls.

### Basic usage

    <button
        class="btn btn-primary"
        data-inspectable
        data-inspector-title="Ttest"
        data-inspector-description="Test description"
        data-inspector-config='[{
            "property":"ocWidgetWidth",
            "title":"Width (1-10)",
            "description":"The widget width, a number between 1 and 10.",
            "type":"dropdown",
            "validationPattern":"^[0-9]+$",
            "validationMessage":"Please enter the widget width as a number between 1 and 10.",
            "options":{"1":"1 column","2":"2 columns","3":"3 columns","4":"4 columns","5":"5 columns","6":"6 columns","7":"7 columns","8":"8 columns","9":"9 columns","10":"10 columns"}
        },{
            "property":"ocWidgetNewRow",
            "title":"Force new row",
            "description":"Put the widget in a new row.",
            "type":"checkbox"
        },{
            "property":"title",
            "title":"Widget title",
            "type":"string",
            "default":"System status",
            "validationPattern":"^.+$",
            "validationMessage":"The Widget Title is required."
        }]'
        data-inspector-class=""
        data-inspector-offset="-3"
        data-inspector-offset-x="-15"
        data-inspector-placement="left"
        data-inspector-fallback-placement="left">
        <input
            type="hidden"
            name="widget_properties[]"
            data-inspector-values
            value='{
                "title":"System status",
                "ocWidgetWidth":"4",
                "ocWidgetNewRow":0
            }' />
        Open Inspector
    </button>

### Manual usage

    <div id="inspectorContainer">
        <button class="btn btn-primary" id="btn1">
            Open inspector
        </button>
    </div>

    <script type="text/template" id="inspectorTemplate">
        <div class="popover-head">
            <h3>Blog archive</h3>
            <p>Provides access to old blog posts by category name or month.</p>
            <button type="button" class="close" data-dismiss="popover" aria-hidden="true">&times;</button>
        </div>
        <table class="inspector-fields">
            <tr>
                <th>Alias</th>
                <td class="text"><input type="text" value="blogArchive"/></td>
            </tr>
            <tr>
                <th>Page param</th>
                <td class="active text"><input type="text" value="page"/></td>
            </tr>
            <tr>
                <th>Paginate</th>
                <td>
                    <div tabindex="0" class="checkbox custom-checkbox nolabel">
                        <input id="check3" type="checkbox" name="check"/>
                        <label for="check3">Paginate</label>
                    </div>
                </td>
            </tr>
            <tr>
                <th>Options</th>
                <td class="dropdown">
                    <select class="custom-select">
                        <option value="value1">Value one</option>
                        <option value="value2">Value two</option>
                        <option value="value3">Value three</option>
                    </select>
                </td>
            </tr>
            <tr>
                <th>Posts / page</th>
                <td class="text"><input type="text" value="20"/></td>
            </tr>
        </table>
    </script>

    <script>
        $('#btn1').on('click', function(){
            $(this).ocPopover({
                content: $('#inspectorTemplate').html(),
               // highlightModalTarget: true,
                modal: true,
                width: 220,
                placement: 'bottom',
                container: '#inspectorContainer',
                containerClass: 'control-inspector'
            })

            return false
        })
    </script>

## API

### Supported data attributes:

- data-inspectable - makes a control inspectable.
- data-inspector-title - title for the inspector popup
- data-inspector-description - optional description for the inspector popup
- data-inspector-class - PHP class name of the inspectable object. Required for drop-down fields with dynamic options.
- data-inspector-css-class - CSS class name to apply to the Inspector container element.
- data-inspector-container - specifies a CSS selector for the inspector container. The default container is the document body. The container element should be relative positioned. The 'self' container value allows to inject the inspector to the inspectable element.
- data-inspector-offset - offset in pixels to add to the calculated position, to make the position more "random"
- data-inspector-placement - top | bottom | left | right. The placement could automatically be changed if the popover doesn't fit into the desired position.
- data-inspector-fallback-placement - The placement to use if the default placement and all other possible placements do not work. The default value is "bottom".
- data-inspector-config - Configuration of the inspector fields as an array in the JSON format.
    Each element in the array is an object with the following properties:
    - property
    - title
    - group (optional)
    - type (currently supported types are: string, checkbox, dropdown)
    - description (optional)
    - validationPattern (regex pattern for for validating the value, supported by the text editor)
    - validationMessage (a message to display if the validation fails)
    - placeholder - placholder text, for text and dropdown properties
    - default - default value
    - depends - a list of properties the property depend on, for dropdown lists
    - options - an option list for dropdown lists, optional. If not provided the options are loaded with AJAX.
    - showExternalParam - specifies the visibility of the external parameter feature for the property. Default: true.
    Example of the configuration string (a single property):
    [{"property":"max-width","title":"Max width","type":"string"}]

The Inspector requires the inspectable element to contain a hidden input element with the attribute "data-inspector-values".
The inspector uses this field to read and write field values. The field value is a JSON string, an object with keys matching property
names and values matching property values.

Any HTML element that wraps the inspectable element can have the data-inspector-external-parameters property that enables the external 
parameters support. External parameters saved with the special syntax {{ paramName }}. The external parameter feature can be toggled
on per-property basis with the showExternalParam option, visible by default.

### Supported events:

- change - the event is triggered on the inspectable element when it's properties are updated.
- showing.oc.inspector - triggered before the Inspector is displayed. Allows to cancel the action with e.preventDefault()
- hiding.oc.inspector - triggered before the Inspector is hidden. Allows to cancel the action with e.preventDefault()
- hidden.oc.inspector - triggered after the Inspector is hidden.

