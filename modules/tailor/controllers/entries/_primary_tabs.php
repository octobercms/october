<div class="flex-grow-1 d-flex flex-column primary-tabs-container">
    <?= $this->formRender([
        'section' => 'primary',
        'preview' => $initialState['isDeleted']
    ]) ?>
    <input type="hidden" name="_content_group_value" value="<?= e($formModel->content_group) ?>"/>
</div>
