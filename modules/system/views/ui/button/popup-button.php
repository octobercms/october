<?php
$label ??= '';
$primary ??= false;
$secondary ??= false;
$danger ??= false;
$icon ??= null;
$handler ?? null;
$hotkey ??= '';
$requestData ??= [];

$classes = ['btn'];
if ($primary) $classes[] = 'btn-primary';
elseif ($secondary) $classes[] = 'btn-secondary';
elseif ($danger) $classes[] = 'btn-danger';

$requestDataStr = $requestData
    ? json_encode($requestData)
    : null;

include __DIR__.'/_hotkey.php';
?>
<button <?= $attributes->merge(array_filter([
    'class' => implode(' ', $classes),
    'type' => 'button',
    'data-control' => 'popup',
    'data-handler' => $handler,
    'data-request-data' => $requestDataStr,
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
