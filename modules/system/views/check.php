<h2 class="has-error"></h2>

<div class="requirement-list">
    <?php foreach ($requirements as $key => $message): ?>
        <?php if ($key == 'cache-path'): ?>
            <div>
                <p>Cache path is not writable</p>
                <code><?= e(cache_path()) ?></code>
                <small>Write Permissions</small>
            </div>
        <?php elseif ($key == 'pdo-library'): ?>
            <div>
                <p>Extension PDO is not loaded</p>
                <code>extension=pdo</code>
                <small>PHP Extension</small>
            </div>
        <?php elseif ($key == 'mbstring-library'): ?>
            <div>
                <p>Extension mbstring is not loaded</p>
                <code>extension=mbstring</code>
                <small>PHP Extension</small>
            </div>
        <?php elseif ($key == 'fileinfo-library'): ?>
            <div>
                <p>Extension fileinfo is not loaded</p>
                <code>extension=fileinfo</code>
                <small>PHP Extension</small>
            </div>
        <?php elseif ($key == 'ssl-library'): ?>
            <div>
                <p>Extension OpenSSL is not loaded</p>
                <code>extension=openssl</code>
                <small>PHP Extension</small>
            </div>
        <?php elseif ($key == 'gd-library'): ?>
            <div>
                <p>Extension GD is not loaded</p>
                <code>extension=gd2</code>
                <small>PHP Extension</small>
            </div>
        <?php elseif ($key == 'curl-library'): ?>
            <div>
                <p>Extension curl is not loaded</p>
                <code>extension=curl</code>
                <small>PHP Extension</small>
            </div>
        <?php elseif ($key == 'zip-library'): ?>
            <div>
                <p>Class ZipArchive is not found</p>
                <code>extension=zip</code>
                <small>PHP Extension</small>
            </div>
        <?php endif ?>
    <?php endforeach ?>
</div>

<div class="form-buttons">
    <button type="button" class="btn btn-primary pull-right" onclick="window.location.reload()">
        Check Again
    </button>
</div>
