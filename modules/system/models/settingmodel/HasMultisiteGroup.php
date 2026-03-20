<?php namespace System\Models\SettingModel;

use Site;

/**
 * HasMultisiteGroup concern for SettingModel provides site group (tenant)
 * scoping for settings. Settings using this concern will have different values
 * per tenant, while remaining the same across language variants within a tenant.
 */
trait HasMultisiteGroup
{
    /**
     * initializeHasMultisiteGroup trait for a model.
     */
    public function initializeHasMultisiteGroup()
    {
        if (!$this->isClassInstanceOf(\October\Contracts\Database\MultisiteGroupInterface::class)) {
            return;
        }

        $this->bindEvent('model.beforeSave', [$this, 'settingMultisiteGroupBeforeSave']);
    }

    /**
     * settingMultisiteGroupBeforeSave sets the site_group_id from context
     */
    public function settingMultisiteGroupBeforeSave()
    {
        if (Site::hasGlobalContext()) {
            return;
        }

        if (!$this->site_group_id) {
            $this->site_group_id = Site::getSiteGroupIdFromContext();
        }
    }
}
