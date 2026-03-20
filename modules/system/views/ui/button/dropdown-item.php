<?php
$label ??= '';
$handler ??= '';
$href ??= '';
$icon ??= null;
?>
<li>
    <a <?= $attributes->merge(array_filter([
        'href' => $href ?: 'javascript:;',
        'data-request' => $handler ?: null,
    ])) ?>>
        <?php if ($icon): ?>
            <i class="<?= e($icon) ?>"></i>
        <?php endif ?>
        <?= e($label) ?>
    </a>
</li>
