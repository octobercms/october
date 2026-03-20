<?php
$label ??= '';
$icon ??= '';
$primary ??= false;
$secondary ??= false;
$hotkey ??= '';
$handler ??= '';
$danger ??= false;

$classes = ['btn-icon', $icon];
if ($danger) $classes[] = 'danger';

include __DIR__.'/_hotkey.php';
?>
<button <?= $attributes->merge(array_filter([
    'class' => implode(' ', $classes),
    'type' => 'button',
    'title' => $label ?: null,
    'data-request' => $handler ?: null,
    'data-hotkey' => $hotkeyStr ?: null,
    'data-tooltip-text' => $hotkeyStr ? $label : null,
    'data-tooltip-hotkey' => $tooltipHotkey ?: null,
    'data-tooltip-position' => $hotkeyStr ? 'top' : null,
])) ?>></button>
