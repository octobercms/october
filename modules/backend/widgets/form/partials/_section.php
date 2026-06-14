<?php
    $type = $tabs->section;
    $containerCss = 'form-section';

    if ($tabs->stretch) {
        $containerCss .= ' is-stretch';
    }
?>
<!-- <?= ucfirst($type) ?> Tabs -->
<div class="<?= $containerCss ?>">
    <?php if ($tabs->suppressTabs): ?>

        <div
            id="<?= $this->getId($type.'Tabs') ?>"
            class="form-tabless-fields <?= $tabs->cssClass ?>">
            <?= $this->makePartial('form_fields', ['fields' => $tabs]) ?>
        </div>

    <?php else: ?>

        <div
            id="<?= $this->getId($type.'Tabs') ?>"
            class="control-tabs <?= $type ?>-tabs form-section-stretch <?= $tabs->cssClass ?>"
            <?= $tabs->linkable ? 'data-linkable' : '' ?>
            <?php if (iterator_count($tabs) === 1): ?>data-single-tab<?php endif ?>
            data-control="tab">
            <?= $this->makePartial($this->surveyMode ? 'form_tabs_survey' : 'form_tabs', [
                'tabs' => $tabs
            ]) ?>
        </div>

    <?php endif ?>
</div>
