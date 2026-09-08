<div class="field-repeater-builder">
    <?php if (!$this->previewMode): ?>
        <?= $this->makePartial('repeater_toolbar') ?>
    <?php endif ?>

    <ul class="field-repeater-groups"></ul>
</div>

<ul id="<?= $this->getId('items') ?>" class="field-repeater-items">
    <?php $isFirstItem = true ?>
    <?php foreach ($formWidgets as $index => $widget): ?>
        <?= $this->makePartial('repeater_item', [
            'widget' => $widget,
            'indexValue' => $index,
            'lazyItem' => !$isFirstItem
        ]) ?>
        <?php $isFirstItem = false ?>
    <?php endforeach ?>
</ul>

<script type="text/template" data-group-template>
    <li
        class="field-repeater-group"
        data-repeater-index
        data-repeater-group
    >
        <div class="group-controls" data-group-controls></div>
        <span class="group-image" data-group-image><i></i></span>
        <span class="group-title" data-group-title></span>
        <span class="group-description" data-group-description></span>
    </li>
</script>

<script type="text/template" data-group-loading-template>
    <li class="field-repeater-group is-placeholder">
        <div class="placeholder-glow">
            <span class="placeholder col-7"></span>
            <span class="placeholder col-4"></span>
            <span class="placeholder col-4"></span>
            <span class="placeholder col-6"></span>
            <span class="placeholder col-8"></span>
        </div>
    </li>
</script>
