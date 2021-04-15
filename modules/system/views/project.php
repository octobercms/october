<h2>
    License Agreement
</h2>

<?= Form::open() ?>
    <input type="hidden" name="postback" value="1" />

    <div class="scroll-panel">
        <?= View::make('system::license') ?>
    </div>

    <p>Enter a valid License Key to proceed.</p>

    <div class="form-elements" role="form">
        <div class="form-group text-field">
            <label for="licenseKey" class="control-label">License Key</label>
            <input
                id="licenseKey"
                type="text"
                name="license_key"
                class="form-control"
                value="<?= e(post('license_key')) ?>"
            />
        </div>

        <button type="submit" class="btn btn-primary pull-right">
            Agree &amp; Install
        </button>
    </div>

<?= Form::close() ?>
