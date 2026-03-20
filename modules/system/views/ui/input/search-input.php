<?php
$name ??= '';
$placeholder ??= '';
$value ??= '';
$handler ??= '';

if ($handler) {
    $attributes = $attributes->merge([
        'data-request' => $handler,
        'data-request-trigger' => 'input changed delay:500',
        'data-load-indicator' => '',
        'data-load-indicator-opaque' => true,
    ]);
}
?>
<div <?= $attributes->only([])->merge([
    'data-control' => 'search-input',
    'class' => $attributes->get('outer-class')
]) ?>>
    <div class="search-input-container storm-icon-pseudo">
        <input
            <?= $attributes->merge([
                'type' => 'text',
                'name' => $name,
                'placeholder' => $placeholder,
                'value' => $value,
                'class' => 'form-control',
                'autocomplete' => 'off',
                'data-search-input' => true
            ])->except([
                'outer-class'
            ]) ?>
        />
        <button
            class="clear-input-text"
            type="button"
            value=""
            style="display:none"
            data-search-clear
        >
            <i class="storm-icon"></i>
        </button>
    </div>
</div>
