# Loading
This plugin adds a 'Loading' integration features to [OctoberCMS](http://octobercms.com).


### Available options: 
* **Speed**: Time taken for loading logo once the page load disappear
* **Background**: Color Background 

## Documentation
In many templates or pages we wait for this all information loaded to display the page. This is what makes this plugin, put the logo of loading until it has completed the full page load.
It adds the **Loading** object to the page, which contains all the information the Component needs to function as you customized it.

### Quickstart guide:
1. Go to the 'System' tab in October, and install the plugin using the **CGGStudio.Loading** code.
2. After installation has finished a new component will appear in under Octobers 'CMS > Components' tab. You have the option to add this to only one page, or add it to a layout making it appear on all pages that use the layout. Whichever you chose the instructions are the same.
3. Open the your selected page/layout, and add the component to it. 
4. Add this small code anywhere on the page/layout: 
``` {% component 'Loading' %} ``` Be sure to use the correct alias, if you haven't changed it, then it should be 'Loading'. The position of the code doesn't really count, since the arrow has a fixed position.
5. That's it. You now have a working 'Loading' button on your page. It has no outside dependencies, so you don't have to worry about anything else.

### Colors:
The Component requires you to add the hex color codes you prefer.
This free online application can help you with that: http://www.colorpicker.com/