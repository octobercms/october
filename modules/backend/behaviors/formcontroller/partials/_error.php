<div class="form-fatal-error">
    <p class="flash-message static error">
        <?= e($fatalError) ?>
    </p>
    <p>
        <?= Ui::button(
            label: __("Return to Previous Page"),
            href: Backend::url($this->formGetConfig()->defaultRedirect ?? ''),
            icon: 'icon-arrow-left',
            secondary: true,
            dataBrowserRedirectBack: true
        ) ?>
    </p>
</div>
