Display a breadcrumb on the page.

# Example

    <div style="padding: 20px">
        <div class="control-breadcrumb">
            <nav aria-label="Breadcrumb"
                <ul>
                    <li><a href="#">Dash Board</a></li>
                    <li><a href="#">Blog Posts</a></li>
                    <li aria-current="page"><a href="javascript:;">Edit Post</a></li>
                </ul>
            </nav>
        </div>
    </div>

The last breadcrumb location uses `javascript:;` because it's does nothing whereas using `#` will scroll to the top of the web page and adds an extra entry to the browser history.