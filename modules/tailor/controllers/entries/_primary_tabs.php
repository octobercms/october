<div class="layout primary-tabs-container">
    <?= $this->formRender([
        'section' => 'primary',
        'preview' => $initialState['isDeleted']
    ]) ?>
    <input type="hidden" name="_content_group_value" value="<?= e($formModel->content_group) ?>"/>
</div>
