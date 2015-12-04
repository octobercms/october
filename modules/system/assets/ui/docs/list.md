### Basic example

    <div class="control-list list-unresponsive">
        <table class="table data">
            <thead>
                <tr>
                    <th class="sort-desc"><a href="/">Title</a></th>
                    <th class="active sort-asc"><a href="/">Created</a></th>
                    <th><span>Categories</span></th>
                    <th><span>Updated</span></th>
                    <th class="list-setup"><a href="/" title="List options"></a></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Welcome to October</td>
                    <td>Oct 01, 2013</td>
                    <td>News</td>
                    <td>Oct 01, 2013</td>
                    <td>&nbsp;</td>
                </tr>
            </tbody>
        </table>
    </div>

### Complete example

    <div class="control-list list-unresponsive">
        <table class="table data" data-control="rowlink">
            <thead>
                <tr>
                    <th class="list-checkbox">
                        <div class="checkbox custom-checkbox nolabel">
                            <input type="checkbox" id="checkboxAll" />
                            <label for="checkboxAll"></label>
                        </div>
                    </th>
                    <th class="sort-desc"><a href="/">Title</a></th>
                    <th class="active sort-asc"><a href="/">Created</a></th>
                    <th class="sort-desc"><a href="/">Author</a></th>
                    <th><span>Categories</span></th>
                    <th><span>Published</span></th>
                    <th><span>Updated</span></th>
                    <th class="list-setup"><a href="/" title="List options"></a></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="list-checkbox nolink">
                        <div class="checkbox custom-checkbox nolabel">
                            <input id="checkbox_1" type="checkbox" />
                            <label for="checkbox_1">Check</label>
                        </div>
                    </td>
                    <td><a href="/">Welcome to October</a></td>
                    <td>Oct 01, 2013</td>
                    <td>Adam Person</td>
                    <td>News</td>
                    <td>Oct 01, 2013</td>
                    <td>Oct 01, 2013</td>
                    <td>&nbsp;</td>
                </tr>
                <tr class="active">
                    <td class="list-checkbox nolink">
                        <div class="checkbox custom-checkbox nolabel">
                            <input id="checkbox_2" type="checkbox" checked="checked" /><label for="checkbox_2">Check The marketplace is open!</label>
                        </div>
                    </td>
                    <td><a href="/">The marketplace is open!</a></td>
                    <td>Oct 15, 2013</td>
                    <td>Sam Georges</td>
                    <td>Features</td>
                    <td>Oct 16, 2013</td>
                    <td>Oct 16, 2013</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td class="list-checkbox nolink">
                        <div class="checkbox custom-checkbox nolabel">
                            <input id="checkbox_3" type="checkbox" />
                            <label for="checkbox_3">Check Welcome to the Builder!</label>
                        </div>
                    </td>
                    <td><a href="/">Welcome to the Builder!</a></td>
                    <td>Oct 21, 2013</td>
                    <td>Alexey Bobkov</td>
                    <td>News, Features</td>
                    <td>Oct 21, 2013</td>
                    <td>Oct 21, 2013</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td class="list-checkbox nolink">
                        <div class="checkbox custom-checkbox nolabel">
                            <input id="checkbox_4" type="checkbox" />
                            <label for="checkbox_4">Check Components explained</label>
                        </div>
                    </td>
                    <td><a href="/">Components explained</a></td>
                    <td>Nov 12, 2013</td>
                    <td>Alexey Bobkov</td>
                    <td>Tutorials</td>
                    <td>Nov 12, 2013</td>
                    <td>Nov 12, 2013</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td class="list-checkbox nolink">
                        <div class="checkbox custom-checkbox nolabel">
                            <input id="checkbox_5" type="checkbox" />
                            <label for="checkbox_5">Check Creating a module in 90 seconds</label>
                        </div>
                    </td>
                    <td><a href="/">Creating a module in 90 seconds</a></td>
                    <td>Nov 15, 2013</td>
                    <td>Sam Georges</td>
                    <td>Tutorials</td>
                    <td>Nov 15, 2013</td>
                    <td>Nov 15, 2013</td>
                    <td>&nbsp;</td>
                </tr>
            </body>
            <tfoot>
                <tr>
                    <td colspan="8" class="list-pagination nolink">
                        <div class="control-pagination">
                            <span class="page-iteration">1-5 of 20</span>
                            <a href="#" class="page-back" title="Previous page"></a><a href="#" class="page-next" title="Next page"></a>
                        </div>
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>

### Responsive list

Lists are responsive by default and will collapse at a breakpoint of `980px`. This behavior can be disabled by adding the `list-unresponsive` class.

    <div class="control-list">
        <table class="table data">
            <thead>
                <tr>
                    <th class="sort-desc"><a href="/">Title</a></th>
                    <th class="active sort-asc"><a href="/">Created</a></th>
                    <th><span>Categories</span></th>
                    <th><span>Published</span></th>
                    <th><span>Updated</span></th>
                    <th class="list-setup"><a href="/" title="List options"></a></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td data-title="Title">Welcome to October</td>
                    <td data-title="Created">Oct 01, 2013</td>
                    <td data-title="Categories">News</td>
                    <td data-title="Published">Oct 01, 2013</td>
                    <td data-title="Updated">Oct 01, 2013</td>
                    <td class="list-setup">&nbsp;</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="5" class="list-pagination nolink">
                        <div class="control-pagination">
                            <span class="page-iteration">
                                Displayed records: 1-1 of 1
                            </span>
                        </div>
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>

### Row classes

The following colored classes are available to use on the table row elements.

    <div class="control-list list-unresponsive">
        <table class="table data">
            <thead>
                <tr>
                    <th class="sort-desc"><a href="/">Class</a></th>
                </tr>
            </thead>
            <tbody>
                <tr><td>Normal text</td></tr>
                <tr class="hidden"><td>.hidden</td></tr>
                <tr class="strike"><td>.strike</td></tr>
                <tr class="frozen"><td>.frozen</td></tr>
                <tr class="processing"><td>.processing</td></tr>
                <tr class="negative"><td>.negative</td></tr>
                <tr class="positive"><td>.positive</td></tr>
                <tr class="disabled"><td>.disabled / .deleted</td></tr>
                <tr class="new"><td>.new / .important</td></tr>
                <tr class="safe"><td>.safe / .special</td></tr>
            </tbody>
        </table>
    </div>

### Status column

It might be fun to include a status column!

    <div class="control-list list-unresponsive">
        <table class="table data">
            <thead>
                <tr>
                    <th style="width: 150px"><span>Status</span></th>
                    <th class="active sort-asc"><a href="/">Title</a></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <span class="oc-icon-circle text-muted">
                            Draft
                        </span>
                    </td>
                    <td>Welcome to October</td>
                </tr>
                <tr>
                    <td>
                        <span class="oc-icon-circle text-info">
                            Pending
                        </span>
                    </td>
                    <td>What a wonderful day</td>
                </tr>
                <tr>
                    <td>
                        <span class="oc-icon-circle text-success">
                            Pending
                        </span>
                    </td>
                    <td>The sun is shining</td>
                </tr>
                <tr>
                    <td>
                        <span class="oc-icon-circle text-danger">
                            Cancelled
                        </span>
                    </td>
                    <td>The weather is sweet here</td>
                </tr>
            </tbody>
        </table>
    </div>

### Button column

You may add a small button to a list column by adding the `column-button` class to the table data (TD) element.

    <div class="control-list list-unresponsive">
        <table class="table data" data-control="rowlink">
            <thead>
                <tr>
                    <th style="width: 150px"><span>Action</span></th>
                    <th><a href="javascript:;">Name</a></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="column-button nolink">
                        <a
                            href="http://www.google.com"
                            target="_blank"
                            class="btn btn-default btn-sm">
                            Open Google
                        </a>
                    </td>
                    <td>
                        <a href="javascript:;">
                            Petoria
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

