<?= $this->makePartial('filter_menu') ?>

<div class="filter-scroll">
    <div class="filter-scopes">
        <?= $this->makePartial('filter_scopes', ['scopes' => $scopes]) ?>
    </div>
</div>
