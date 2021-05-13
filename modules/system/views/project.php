<h2>
    <?= e(trans('system::lang.installer.license_section')) ?>
</h2>

<?= Form::open() ?>
    <input type="hidden" name="postback" value="1" />

    <div class="scroll-panel">
        <?= View::make('system::license') ?>
    </div>

    <p><?= e(trans('system::lang.installer.license_key_comment')) ?></p>

    <div class="form-elements" role="form">
        <div class="form-group text-field">
            <label for="licenseKey" class="control-label">
                <?= e(trans('system::lang.installer.license_key_label')) ?>
            </label>
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
