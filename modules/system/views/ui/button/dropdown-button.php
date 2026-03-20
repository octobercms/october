<?php
$label ??= '';
$primary ??= false;
$secondary ??= false;
$caret ??= true;
$icon ??= null;

$classes = ['btn'];
if ($caret) $classes[] = 'dropdown-toggle';
if ($primary) $classes[] = 'btn-primary';
elseif ($secondary) $classes[] = 'btn-secondary';
?>
<div class="dropdown dropdown-fixed">
    <button <?= $attributes->merge(array_filter([
        'class' => implode(' ', $classes),
        'type' => 'button',
        'data-toggle' => 'dropdown',
    ])) ?>>
        <?php if ($icon): ?>
            <i class="<?= e($icon) ?>"></i>
        <?php endif ?>
        <?= e($label) ?>
    </button>
    <ul class="dropdown-menu">
        <?= $slot ?>
    </ul>
</div>
