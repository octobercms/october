<div id="<?= $this->dashGetId() ?>">
    <input type="hidden" name="_dash_definition" value="<?= e($dashDefinition) ?>" />

    <?= $dashWidget->render() ?>
</div>
