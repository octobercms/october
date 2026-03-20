<?php namespace Backend\Behaviors\FormController;

/**
 * HasMultisiteGroup contains logic for managing multisite group records.
 *
 * Unlike HasMultisite which handles per-site record switching, this concern
 * handles models scoped by site_group_id (tenant). The site group
 * context determines which records are visible, and language/translation
 * is handled separately by the Translate plugin.
 */
trait HasMultisiteGroup
{
    /**
     * formHasMultisiteGroup checks if a model uses site group scoping
     */
    public function formHasMultisiteGroup($model)
    {
        return $model &&
            $model->isClassInstanceOf(\October\Contracts\Database\MultisiteGroupInterface::class) &&
            $model->isMultisiteGroupEnabled();
    }
}
