### Basic example

    <div class="control-pagination">
        <span class="page-iteration">Displayed records: 1-5 of 20</span>
        <a href="#" class="page-back" title="Previous page"></a><a href="#" class="page-next" title="Next page"></a>
    </div>

### Complete example

    <div class="control-pagination">
        <span class="page-iteration">Displayed records: 1-5 of 20</span>
        <span class="page-first" title="First page"></span>
        <span class="page-back" title="Previous page"></span>
        <select
            name="page"
            class="form-control custom-select select-no-search">
                <option value="1" selected>1</option>
                <option value="2">2</option>
                <option value="3">3</option>
        </select>
        <a href="#" class="page-next" title="Next page"></a>
        <a href="#" class="page-last" title="Last page"></a>
    </div>
