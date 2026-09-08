<ul id="<?= $this->getId('items') ?>" class="field-repeater-items">
    <?php foreach ($formWidgets as $index => $widget): ?>
        <?= $this->makePartial('repeater_item', [
            'widget' => $widget,
            'indexValue' => $index,
            'collapsedItem' => !$itemsExpanded
        ]) ?>
    <?php endforeach ?>
</ul>

<?php if (!$this->previewMode): ?>
    <?= $this->makePartial('repeater_toolbar') ?>
<?php endif ?>
