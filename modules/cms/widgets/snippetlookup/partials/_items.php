<?php if ($items): ?>
    <ul>
        <?php foreach ($items as $item): ?>
            <?php
                $dataId = 'snippet-'.$item->code;
            ?>
            <li class="item"
                data-id="<?= e($dataId) ?>"
                data-snippet="<?= e($item->code) ?>"
                data-snippet-name="<?= e($item->getName()) ?>"
                data-type="snippet"
                data-description="<?= e($item->getDescription()) ?>"
                data-component-class="<?= e($item->getComponentClass()) ?>"
                data-use-ajax="<?= $item->useAjaxPartial() ? 'true' : 'false' ?>"
                data-inline="<?= $item->isInline() ? 'true' : 'false' ?>"
            >
                <a href="javascript:;">
                    <span class="title"><?= e($item->getName()) ?></span>
                    <span class="description">
                        <?= e($item->getDescription()) ?>
                    </span>
                    <span class="borders"></span>
                </a>
            </li>
        <?php endforeach ?>
    </ul>
<?php else: ?>
    <p class="no-data"><?= e(trans($this->noRecordsMessage)) ?></p>
<?php endif ?>
