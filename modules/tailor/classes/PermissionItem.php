<?php namespace Tailor\Classes;

use October\Rain\Element\ElementBase;

/**
 * PermissionItem
 *
 * @method PermissionItem prefix(string $prefix) code
 * @method PermissionItem label(string $label) label
 * @method PermissionItem baseLabel(string $baseLabel) baseLabel
 * @method PermissionItem permissions(array $permissions) permissions
 * @method PermissionItem uuid(string $uuid) uuid is uuid sourced from the blueprint
 * @method PermissionItem handle(string $handle) handle sourced from the blueprint
 * @method PermissionItem useMulti(bool $useMulti) useMulti
 * @method PermissionItem usePublish(bool $usePublish) usePublish
 * @method PermissionItem useDrafts(bool $useDrafts) useDrafts
 * @method PermissionItem useOwners(bool $useOwners) useOwners
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
class PermissionItem extends ElementBase
{
    /**
     * toBackendPermissionArray
     */
    public function toBackendPermissionArray()
    {
        $result = [];
        $perms = [];

        // Common item
        $baseCode = $this->prefix;
        $perms[$baseCode] = $this->baseLabel;

        if ($this->useMulti) {
            $perms[$baseCode.'.create'] = __('Create Entry');
        }

        if ($this->usePublish) {
            $perms[$baseCode.'.publish'] = __('Publish Entry');
        }

        if ($this->useMulti) {
            $perms[$baseCode.'.delete'] = __('Delete Entry');
        }

        if ($this->useOwners) {
            $perms[$baseCode.'.other_entries'] = __('Update Other Author Entry');
            $perms[$baseCode.'.other_entries.publish'] = __('Publish Other Author Entry');
            $perms[$baseCode.'.other_entries.delete'] = __('Delete Other Author Entry');

            if ($this->useDrafts) {
                $perms[$baseCode.'.other_drafts'] = __('Update Other Author Draft');
                $perms[$baseCode.'.other_drafts.publish'] = __('Publish Other Author Draft');
                $perms[$baseCode.'.other_drafts.delete'] = __('Delete Other Author Draft');
            }
        }

        foreach ($perms as $perm => $label) {
            $result[$perm] = [
                'label' => $label,
                'tab' => "Tailor",
                'order' => 900
            ];
        }

        return $result;
    }
}
