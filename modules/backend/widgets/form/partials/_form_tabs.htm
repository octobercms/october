<?php
    $type = $tabs->section;

    $navCss = '';
    $contentCss = '';
    $paneCss = '';

    if ($tabs->stretch) {
        $navCss = 'layout-row min-size';
        $contentCss = 'layout-row';
        $paneCss = 'layout-cell';
    }
?>
<div class="<?= $navCss ?>">
    <ul class="nav nav-tabs"  <?= $tabs->linkable ? 'data-linkable' : '' ?>>
        <?php $index = 0; foreach ($tabs as $name => $fields):
            $lazy = in_array($name, $tabs->lazy);
        ?>
            <li class="<?= ($index++ === 0) ? 'active' : '' ?> <?= $lazy ? 'tab-lazy' : '' ?>">
                <a
                    href="#<?= $type . 'tab-' . ($tabs->linkable ? str_slug($name) : $index) ?>"
                    <?php if ($lazy): ?>
                        data-tab-name="<?= e($name) ?>"
                        data-tab-section="<?= $type ?>"
                        data-tab-lazy-handler="<?= $this->getEventHandler('onLazyLoadTab') ?>"
                    <?php endif ?>
                >
                    <span class="title">
                        <span>
                            <?php if ($tabs->getIcon($name)): ?><span class="<?= $tabs->getIcon($name) ?>"></span><?php endif; ?>
                            <?= e(trans($name)) ?>
                        </span>
                    </span>
                </a>
            </li>
        <?php endforeach ?>
    </ul>
</div>

<div class="tab-content <?= $contentCss ?>">
    <?php
    $index = 0;
    foreach ($tabs as $name => $fields):
        $lazy = in_array($name, $tabs->lazy);
    ?>
            <div
                class="tab-pane <?= $lazy ? 'lazy' : '' ?> <?= e($tabs->getPaneCssClass($index, $name)) ?> <?= ($index++ === 0) ? 'active' : '' ?> <?= $paneCss ?>"
                id="<?= $type . 'tab-' . $index ?>">
                <?php if ($lazy): ?>
                    <?= $this->makePartial('form_tabs_lazy', ['fields' => $fields]) ?>
                <?php else: ?>
                    <?= $this->makePartial('form_fields', ['fields' => $fields]) ?>
                <?php endif ?>
            </div>
    <?php endforeach ?>
</div>
