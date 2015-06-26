Renders a list

# Example

    <!-- Bad ... example -->
    <div class="control-list">
        <table class="table" data-provides="rowlink">
            <thead>
                <tr>
                    <th class="list-checkbox">
                        <div class="checkbox custom-checkbox nolabel">
                            <input type="checkbox" id="checkbox_0" />
                            <label for="checkbox_0"></label>
                        </div>
                    </th>
                    <th class="sort-desc"><a href="/">Title</a></th>
                    <th class="active sort-asc"><a href="/">Created</a></th>
                    <th class="sort-desc"><a href="/">Author</a></th>
                    <th><span>Categories</span></th>
                    <th><span>Published</span></th>
                    <th><span>Updated</span></th>
                    <th class="list-options"><a href="/" title="List options"></a></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="list-checkbox nolink">
                        <div class="checkbox custom-checkbox nolabel">
                            <input id="checkbox_1" type="checkbox" /><label for="checkbox_1">Check Welcome to October</label>
                        </div>
                    </td>
                    <td><a href="/">Welcome to October</a></td>
                    <td>Oct 01, 2013</td>
                    <td>Sam Georges</td>
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
                            <input id="checkbox_3" type="checkbox" /><label for="checkbox_3">Check Welcome to the Builder!</label>
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
                            <input id="checkbox_4" type="checkbox" /><label for="checkbox_4">Check Components explained</label>
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
                            <input id="checkbox_5" type="checkbox" /><label for="checkbox_5">Check Creating a module in 90 seconds</label>
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
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="8" class="list-pagination nolink">
                        <? include('controls/control-pagination.php'); ?>
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>

    <!-- Good example -->
    <div class="control-list">
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
