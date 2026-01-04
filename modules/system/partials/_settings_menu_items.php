<?php
    $context = \System\Classes\SettingsManager::instance()->getContext();

    $collapsedGroups = explode('|',
        isset($_COOKIE['settingsNavGroupStatus']) ? $_COOKIE['settingsNavGroupStatus'] : ''
    );
?>
<ul class="top-level">
    <?php foreach ($items as $category => $items): ?>
        <?php
            $collapsed = in_array($category, $collapsedGroups);
            $firstItem = array_first($items);
        ?>
        <li data-group-code="<?= e($category) ?>" <?= $collapsed ? 'data-status="collapsed"' : null ?>>
            <div class="group">
                <h3>
                    <span class="group-icon"><i class="<?= $firstItem->icon ?? '' ?>"></i></span>
                    <?= e(__($category)) ?>
                    <span class="group-collapse"><i class="icon-angle-up"></i></span>
                </h3>
            </div>

            <ul <?= $collapsed ? 'style="overflow:visible;height:0;display:none"' : null ?>>
                <?php foreach ($items as $item): ?>
                    <li
                        class="<?= strtolower($item->owner) == $context->owner && strtolower($item->code) == $context->itemCode ? 'active' : false ?>"
                        data-keywords="<?= e(__($item->keywords ?? '')) ?>"
                        <?= Html::attributes($item->attributes) ?>
                    >
                        <a href="<?= $item->url ?>" title="<?= e(__($item->description ?? '')) ?>" ontouchstart="">
                            <span class="header"><?= e(__($item->label ?? '')) ?></span>
                        </a>
                    </li>
                <?php endforeach ?>
            </ul>
        </li>
    <?php endforeach ?>
</ul>
