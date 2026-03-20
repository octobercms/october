<?php
$label ??= '';
$href ??= '';
$primary ??= false;
$secondary ??= false;
$danger ??= false;
$icon ??= null;
$hotkey ??= '';

$classes = ['btn'];
if ($primary) $classes[] = 'btn-primary';
elseif ($secondary) $classes[] = 'btn-secondary';
elseif ($danger) $classes[] = 'btn-danger';

include __DIR__.'/button/_hotkey.php';
?>
<?php if ($href): ?>
    <a
        <?= $attributes->merge(array_filter([
            'href' => $href,
            'class' => implode(' ', $classes),
            'type' => 'button',
            'data-hotkey' => $hotkeyStr ?: null,
            'data-tooltip-text' => $hotkeyStr ? $label : null,
            'data-tooltip-hotkey' => $tooltipHotkey ?: null,
            'data-tooltip-position' => $hotkeyStr ? 'top' : null,
        ])) ?>>
        <?php if ($icon): ?>
            <i class="<?= e($icon) ?>"></i>
        <?php endif ?>
        <?= e($label) ?>
    </a>
<?php else: ?>
    <button <?= $attributes->merge(array_filter([
        'class' => implode(' ', $classes),
        'type' => 'button',
        'data-hotkey' => $hotkeyStr ?: null,
        'data-tooltip-text' => $hotkeyStr ? $label : null,
        'data-tooltip-hotkey' => $tooltipHotkey ?: null,
        'data-tooltip-position' => $hotkeyStr ? 'top' : null,
    ])) ?>>
        <?php if ($icon): ?>
            <i class="<?= e($icon) ?>"></i>
        <?php endif ?>
        <?= e($label) ?>
    </button>
<?php endif ?>
