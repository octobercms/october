<?php
    $navCss = 'form-tab-nav';
    $contentCss = 'form-tab-content';
    $paneCss = 'form-tab-pane';

    if ($tabs->stretch) {
        $navCss .= ' is-stretch';
        $contentCss .= ' is-stretch';
        $paneCss .= ' is-stretch';
    }
?>
<div class="<?= $navCss ?>">
    <ul class="nav nav-tabs">
        <?php $index = 0; foreach ($tabs as $name => $fields): $index++ ?>
            <?php
                $isActive = $tabs->isPaneActive($index, $name);
                $isLazy = !$isActive && $tabs->isLazy($name);
                $anchorId = $tabs->getPaneAnchorId($index, $name);
                $tabId = $tabs->getTabId($name);
                $tabClass = ($isActive ? 'active ' : '') . ($isLazy ? 'tab-lazy ' : '');
            ?>
            <li class="<?= $tabClass ?>" <?php if ($tabId): ?>id="<?= $tabId ?>"<?php endif ?>>
                <a href="#<?= e($anchorId) ?>" name="<?= e($anchorId) ?>"
                    <?php if ($isLazy): ?>
                        data-tab-name="<?= e($name) ?>"
                        data-tab-section="<?= $tabs->section ?>"
                        data-tab-lazy-handler="<?= $this->getEventHandler('onLazyLoadTab') ?>"
                    <?php endif ?>
                >
                    <span class="title">
                        <span>
                            <?php if ($tabs->getIcon($name)): ?>
                                <span class="<?= $tabs->getIcon($name) ?>"></span>
                            <?php endif ?>
                            <?= e(trans($name)) ?>
                        </span>
                    </span>
                </a>
            </li>
        <?php endforeach ?>
    </ul>
</div>

<div class="tab-content <?= $contentCss ?>">
    <?php $index = 0; foreach ($tabs as $name => $fields): $index++ ?>
        <?php
            $isActive = $tabs->isPaneActive($index, $name);
            $isLazy = !$isActive && $tabs->isLazy($name);
            $isAdaptive = $tabs->isAdaptive($name);
            $paneId = $tabs->getPaneId($name);
            $paneClass = 'tab-pane '
                . ($isLazy ? 'is-lazy ' : '')
                . ($isAdaptive ? 'is-adaptive ' : '')
                . ($tabs->getPaneCssClass($index, $name) . ' ')
                . ($isActive ? 'active ' : '')
                . $paneCss;
        ?>
        <div class="<?= $paneClass ?>" <?php if ($paneId): ?>id="<?= $paneId ?>"<?php endif ?>>
            <?php if ($isLazy): ?>
                <?= $this->makePartial('form_fields_lazy', ['fields' => $fields]) ?>
            <?php else: ?>
                <?= $this->makePartial('form_fields', ['fields' => $fields]) ?>
            <?php endif ?>
        </div>
    <?php endforeach ?>
</div>
