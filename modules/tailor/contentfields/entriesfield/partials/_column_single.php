<?php if ($value): ?>
    <?php if ($column->clickable === true): ?>
        <?= e($value->title) ?>
    <?php else: ?>
        <ul class="list-link-list">
            <?php
                $url = Backend::url('tailor/entries/'.$value->blueprint->handleSlug.'/'.$value->id);
            ?>
            <li><a href="<?= $url ?>"><?= e($value->title) ?></a></li>
        </ul>
    <?php endif ?>
<?php endif ?>
