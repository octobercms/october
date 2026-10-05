<ul class="picker-options">
    <?php if (!$readOnly && !$disabled): ?>
        <?php foreach ($availableColors as $index => $color): ?>
            <li
                class="<?= $color == $value ? 'active' : null ?>"
                data-hex-color="<?= e($color) ?>">
                <span style="background: <?= e($color) ?>"><?= e($color) ?></span>
            </li>
        <?php endforeach ?>
    <?php endif ?>
    <?php if ($allowCustom): ?>
        <li
            class="custom-color <?= $isCustomColor == $value ? 'active' : null ?>"
            data-hex-color="<?= $isCustomColor ? e($value) : '#ffffff' ?>"
            data-custom-color>
            <span
                class="<?php if (!$value): ?>is-empty<?php endif ?> <?php if ($readOnly || $disabled): ?>disabled<?php endif ?>"
                style="background: <?= $isCustomColor ? e($value) : '#ffffff' ?>"></span>
        </li>
    <?php endif ?>
</ul>

<input
    type="hidden"
    id="<?= $this->getId('input') ?>"
    name="<?= $name ?>"
    value="<?= e($value) ?>" />
