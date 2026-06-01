<?php if ($toolbar): ?>
    <?= $toolbar->render() ?>
<?php endif ?>

<?php if ($useGroups): ?>
    <div class="padded-container container-flush" id="<?= $this->getId('listTabs') ?>">
        <?= $this->makePartial('list_tabs') ?>
    </div>
<?php endif ?>

<div class="layout-row">
    <div class="list-widget-container">
        <?php if ($filter): ?>
            <?= $filter->render() ?>
        <?php endif ?>

        <?= $list->render() ?>
    </div>
</div>
