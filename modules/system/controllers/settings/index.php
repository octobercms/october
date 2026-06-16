<div class="d-flex flex-column h-100">
    <div class="flex-grow-1 oc-logo-transparent"></div>
</div>

<script>
    $(document).ready(function() {
        var $search = $('#settings-search-input'),
            focusSearch = function() {
                setTimeout(function() { $search.focus().select() }, 10);
            }

        focusSearch();
    });
</script>
