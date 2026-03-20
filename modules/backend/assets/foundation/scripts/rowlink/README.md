# Row Link

You may link an entire row by adding the `data-control="rowlink"` attribute to the table element. The first table data (TD) column with an anchor will be used to link the entire row. To bypass this behavior, simply add the `nolink` class to the column.

    <div class="control-list">
        <table class="table data" data-control="rowlink">
            <tbody>
                <tr>
                    <td>
                        <a href="https://octobercms.com">Link to this</a>
                    </td>
                    <td>Row will be linked</td>
                    <td>This will also be linked</td>
                    <td class="nolink">No link applied here</td>
                </tr>
            </tbody>
        </table>
    </div>
