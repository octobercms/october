<?php
    $icon = null;

    if ($record->context_disabled) {
        $icon = 'eye-slash';
    }
    elseif ($record->disabledBySystem) {
        $icon = 'exclamation';
    }
    elseif ($record->orphaned) {
        $icon = 'question';
    }
?>
<span class="<?= $icon ? 'oc-icon-'.$icon : '' ?>">
    <?= $value ?>
</span>
